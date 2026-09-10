
import {
	BaseEvent,
	Box3,
	BufferGeometry,
	Camera,
	Frustum,
	InstancedBufferGeometry,
	Intersection,
	Material,
	Matrix4,
	Mesh,
	Object3DEventMap,
	Raycaster,
	Vector3,
} from "three";
import { ICompositeLoader } from "../../loaders";
import { createChildren, getDistance, getTileSize, LODAction, LODEvaluate, IdealTileSet } from "./util";

const MAX_RETRY_COUNT = 3;

/**
 * Tile state machine enumeration
 * 瓦片状态机枚举
 */
export enum TileState {
	/** Initial state, not yet started loading 初始状态，尚未开始加载 */
	Idle = "idle",
	/** Currently loading data 正在加载数据 */
	Loading = "loading",
	/** Data loaded successfully 数据加载成功 */
	Loaded = "loaded",
	/** Loading failed 加载失败 */
	Error = "error",
	/** Tile disposed/unloaded 瓦片已释放/卸载 */
	Unloaded = "unloaded",
}

/**
 * Tile update parameters
 */
export type TileUpdateParams = {
	camera: Camera;
	loader: ICompositeLoader;
	minLevel: number;
	maxLevel: number;
	LODThreshold: number;
	/** Map is currently interacting (pan/zoom) — throttle network loads */
	interacting?: boolean;
	/** Screen-space ideal tile z from camera (coveringZoomLevel) */
	coveringZoom?: number;
	/** Per-layer ideal tile keys for this update (not global) */
	idealTiles?: Set<string>;
};

/**
 * Tile event map
 * 瓦片事件映射
 */
export interface ITileEventMap extends Object3DEventMap {
	unload: BaseEvent;
	ready: BaseEvent;
	"tile-created": BaseEvent & { tile: Tile };
	"tile-loaded": BaseEvent & { tile: Tile };
	"tile-unload": BaseEvent & { tile: Tile };
	"vector-data-loaded": BaseEvent & { tile: Tile; data: any };
	"vector-tile-loaded": BaseEvent & { tileKey: string; data: any; tile: Tile };
	"tile-hidden": BaseEvent & { tile: Tile }; // Tile hidden event 瓦片被隐藏事件
	"tile-shown": BaseEvent & { tile: Tile }; // Tile shown event 瓦片被显示事件
	"vector-tile-unloaded": BaseEvent & { tileKey: string; tile: Tile };
	"visible-vector-tiles-changed": BaseEvent & { tiles: Array<{ tileKey: string, data: any, tile: Tile }> };
}

// Default geometry of tile
const defaultGeometry = new InstancedBufferGeometry();
// const defaultGeometry = new SphereGeometry( 0.3, 32, 16 );

const tempVec3 = new Vector3();
const tempMat4 = new Matrix4();
const tileBox = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, 1));
const frustum = new Frustum();

/**
 * Class Tile, inherit of Mesh
 * Tile类，继承自Mesh
 */
/**
 * Represents a tile in a 3D scene.
 * Extends the Mesh class with BufferGeometry and Material.
 * 表示3D场景中的一个瓦片。
 * 继承自带有BufferGeometry和Material的Mesh类。
 */
export class Tile extends Mesh<BufferGeometry, Material[], ITileEventMap> {
	private static _activeDownloads = 0;
	private static _maxConcurrentDownloads = 10;
	/** Still allow enough bandwidth while panning so edges do not starve */
	private static _interactingMaxConcurrentDownloads = 8;
	private static _interacting = false;
	/** Priority queue of tiles waiting to start network load (center-first) */
	private static _loadQueue: Array<{
		tile: Tile;
		loader: ICompositeLoader;
		priority: number;
		idealTiles?: Set<string>;
	}> = [];
	// Data mode switch 数据模式开关
	private _dataMode: boolean = false;
	private _abortController: AbortController | null = null;
	/** Invoked when a queued load finishes (success, abort, or final failure) */
	private _onLoadComplete: (() => void) | null = null;

	/** Tile state 瓦片状态 */
	private _state: TileState = TileState.Idle;
	/** Retry count for failed loads 加载失败重试计数 */
	private _retryCount: number = 0;
	/** Maximum retry count 最大重试次数 */
	private _maxRetries: number = MAX_RETRY_COUNT;

	/**
	 * Get current tile state
	 * 获取当前瓦片状态
	 */
	public get state(): TileState {
		return this._state;
	}

	/**
	 * Get retry count
	 * 获取重试次数
	 */
	public get retryCount(): number {
		return this._retryCount;
	}

	/**
	 * Set max retry count
	 * 设置最大重试次数
	 */
	public set maxRetries(value: number) {
		this._maxRetries = value;
	}

	/**
	 * Transition tile state
	 * 转换瓦片状态
	 * @param newState - Target state 目标状态
	 * @returns true if transition succeeded 状态转换是否成功
	 */
	private _transitionTo(newState: TileState): boolean {
		const oldState = this._state;
		this._state = newState;

		// Sync backward-compatible flags 同步向后兼容的标志位
		if (newState === TileState.Loaded) {
			this._isLoaded = true;
		} else if (newState === TileState.Idle || newState === TileState.Loading) {
			this._isLoaded = false;
		}

		return true;
	}

	/**
	 * Check if tile can start loading
	 * 检查瓦片是否可以开始加载
	 */
	private _canStartLoading(): boolean {
		return this._state === TileState.Idle || this._state === TileState.Error;
	}

	/**
	 * Check if tile needs retry
	 * 检查瓦片是否需要重试
	 */
	private _needsRetry(): boolean {
		return this._state === TileState.Error && this._retryCount < this._maxRetries;
	}
	/** Vector Data 矢量数据 */
	public _vectorData: any = null;
	/**
		* Set data only mode (do not create Mesh, only return data)
		* 设置为数据模式（不创建Mesh，只返回数据）
		*/
	public setDataOnlyMode(isDataOnly: boolean): this {
		this._dataMode = isDataOnly;
		if (isDataOnly) {
			this.visible = false; // Hide Mesh 隐藏Mesh
		}
		return this;
	}
	/**
	 * Check if it is data only mode
	 * 检查是否是数据模式
	  */
	public isDataOnlyMode(): boolean {
		return this._dataMode;
	}

	/**
	 * Get vector data (only valid in data mode)
	 * 获取矢量数据（仅数据模式有效）
	 */
	public getVectorData(): any {
		return (this as any)._vectorData;
	}
	/**
	 * Number of download threads.
	 * 下载线程数
	 */
	public static get downloadThreads() {
		return Tile._activeDownloads;
	}

	/**
	 * Get max concurrent downloads.
	 * 获取最大并发下载数
	 */
	public static get maxConcurrentDownloads(): number {
		return Tile._maxConcurrentDownloads;
	}

	/**
	 * Set max concurrent downloads.
	 * 设置最大并发下载数
	 */
	public static set maxConcurrentDownloads(value: number) {
		Tile._maxConcurrentDownloads = Math.max(1, value);
	}

	/** Whether map interaction throttling is active */
	public static set interacting(value: boolean) {
		Tile._interacting = value;
	}

	public static get interacting(): boolean {
		return Tile._interacting;
	}

	/** Effective concurrency limit (lower while interacting) */
	public static get effectiveMaxConcurrentDownloads(): number {
		return Tile._interacting
			? Math.min(Tile._interactingMaxConcurrentDownloads, Tile._maxConcurrentDownloads)
			: Tile._maxConcurrentDownloads;
	}

	public static get loadQueueSize(): number {
		return Tile._loadQueue.length;
	}

	/**
	 * Schedule snapshot for demos / debugging.
	 * 调度快照，供演示与调试读取。
	 */
	public static getScheduleStats(): {
		activeDownloads: number;
		maxConcurrent: number;
		loadQueue: number;
		interacting: boolean;
		abortCount: number;
		deferCount: number;
		enterFrustumCount: number;
		parentPrefetchCount: number;
		retainHoldCount: number;
		retainReleaseCount: number;
		maxQueueSeen: number;
		avgLoadedDist: number;
		loadedDistMin: number;
		loadedDistMax: number;
		coveringZoom: number;
		idealTileCount: number;
		idealTileZ: number | null;
		idealLoadedCount: number;
		idealCoveredCount: number;
	} {
		return {
			activeDownloads: Tile._activeDownloads,
			maxConcurrent: Tile.effectiveMaxConcurrentDownloads,
			loadQueue: Tile._loadQueue.length,
			interacting: Tile._interacting,
			abortCount: Tile._statAbortCount,
			deferCount: Tile._statDeferCount,
			enterFrustumCount: Tile._statEnterFrustumCount,
			parentPrefetchCount: Tile._statParentPrefetchCount,
			retainHoldCount: Tile._statRetainHoldCount,
			retainReleaseCount: Tile._statRetainReleaseCount,
			maxQueueSeen: Tile._statMaxQueue,
			avgLoadedDist:
				Tile._statLoadedDistCount > 0
					? Tile._statLoadedDistSum / Tile._statLoadedDistCount
					: 0,
			loadedDistMin: Tile._statLoadedDistMin === Infinity ? 0 : Tile._statLoadedDistMin,
			loadedDistMax: Tile._statLoadedDistMax,
			coveringZoom: Tile._coveringZoom,
			idealTileCount: Tile._idealTiles.size,
			idealTileZ: Tile._idealTileSet ? Tile._idealTileSet.z : null,
			idealLoadedCount: Tile._idealLoadedCount,
			idealCoveredCount: Tile._idealCoveredCount,
		};
	}

	/** Count tiles in a layer tree (debug). */
	public static countTree(root: Tile): number {
		let n = 0;
		root.traverse((t) => {
			if ((t as any).isTile) n++;
		});
		return n;
	}

	public static get coveringZoom(): number {
		return Tile._coveringZoom;
	}

	public static get idealTileCount(): number {
		return Tile._idealTiles.size;
	}

	public static get idealTileSet(): IdealTileSet | null {
		return Tile._idealTileSet;
	}

	public static isIdealTile(tile: Tile): boolean {
		return Tile._idealTiles.has(`${tile.z}/${tile.x}/${tile.y}`);
	}

	/**
	 * Keep queued work that is ideal, or an ancestor of an ideal tile (parent cover).
	 * Drop the rest — obsolete after camera moved.
	 */
	private static _isNeededForIdealCover(tile: Tile): boolean {
		if (Tile._idealTiles.has(`${tile.z}/${tile.x}/${tile.y}`)) return true;
		const set = Tile._idealTileSet;
		if (!set) return true; // no ideal info — keep everything
		// Ancestor of any ideal key: same z-prefix via integer division
		const shift = set.z - tile.z;
		if (shift < 0) return false; // deeper than ideal — not needed as cover
		const n = Math.pow(2, shift);
		for (const key of Tile._idealTiles) {
			const [iz, ix, iy] = key.split("/").map(Number);
			if (iz !== set.z) continue;
			if (Math.floor(ix / n) === tile.x && Math.floor(iy / n) === tile.y) {
				return true;
			}
		}
		return false;
	}

	public static setIdealTileSet(set: IdealTileSet | null) {
		// Stats/demo only. Do NOT purge the shared queue here —
		// raster and vector layers share Tile._loadQueue; purging with one
		// layer's ideal set drops the other layer's requests.
		Tile._idealTileSet = set;
		Tile._idealTiles = set ? new Set(set.keys) : new Set();
	}

	public static setIdealLoadedCount(n: number) {
		Tile._idealLoadedCount = n;
	}

	public static get idealLoadedCount(): number {
		return Tile._idealLoadedCount;
	}

	public static setIdealCoveredCount(n: number) {
		Tile._idealCoveredCount = n;
	}

	public static get idealCoveredCount(): number {
		return Tile._idealCoveredCount;
	}

	/** Toggle verbose schedule logs (create/load/abort/retain) */
	public static debugSchedule = false;

	// ---- Verification counters (demo checklist) ----
	private static _statAbortCount = 0;
	private static _statDeferCount = 0;
	private static _statEnterFrustumCount = 0;
	private static _statParentPrefetchCount = 0;
	private static _statRetainHoldCount = 0;
	private static _statRetainReleaseCount = 0;
	private static _statMaxQueue = 0;
	private static _statLoadedDistSum = 0;
	private static _statLoadedDistCount = 0;
	private static _statLoadedDistMin = Infinity;
	private static _statLoadedDistMax = 0;
	private static _coveringZoom = 0;
	private static _idealTiles: Set<string> = new Set();
	private static _idealTileSet: IdealTileSet | null = null;
	private static _idealLoadedCount = 0;
	private static _idealCoveredCount = 0;

	/**
	 * Enqueue a tile load by camera distance (center tiles first).
	 * Ideal tiles (covering set) load before non-ideal.
	 * 按相机距离入队；ideal 集内的瓦片优先。
	 */
	/**
	 * Load priority (lower = sooner).
	 * 0: sibling blocking a showing parent (edge holes)
	 * 1: ideal covering tile
	 * 2+: distance (fair across raster/vector — no absolute ideal=0 flood)
	 */
	private static _loadPriority(tile: Tile, idealTiles?: Set<string>): number {
		const parent = tile.parent as Tile | null;
		if (parent && (parent as any).isTile) {
			const sibs = parent.children.filter((c: any) => c.isTile);
			if (parent.showing && sibs.some((c: any) => !c.loaded)) {
				return 0;
			}
		}
		const key = `${tile.z}/${tile.x}/${tile.y}`;
		if (idealTiles ? idealTiles.has(key) : Tile._idealTiles.has(key)) {
			return 1;
		}
		return 2 + tile.distToCamera;
	}

	/**
	 * Public API for SourceCache: enqueue a tile load with optional ideal keys.
	 */
	public static requestLoad(
		tile: Tile,
		loader: ICompositeLoader,
		idealTiles?: Set<string>
	): void {
		if (!tile || !loader) return;
		if (!tile._canStartLoading()) return;
		if (Tile._isQueued(tile)) return;
		Tile._enqueueLoad(tile, loader, idealTiles);
	}

	private static _enqueueLoad(
		tile: Tile,
		loader: ICompositeLoader,
		idealTiles?: Set<string>
	) {
		const priority = Tile._loadPriority(tile, idealTiles);
		Tile._loadQueue.push({ tile, loader, priority, idealTiles });
		if (Tile._loadQueue.length > Tile._statMaxQueue) {
			Tile._statMaxQueue = Tile._loadQueue.length;
		}
		if (Tile.debugSchedule) {
			console.log(
				`[Schedule] enqueue z${tile.z}/${tile.x}/${tile.y} ` +
				`dist=${tile.distToCamera.toFixed(0)} queue=${Tile._loadQueue.length}`
			);
		}
		Tile._drainLoadQueue();
	}

	private static _drainLoadQueue() {
		if (Tile._loadQueue.length === 0) return;
		Tile._pruneLoadQueue();
		for (const job of Tile._loadQueue) {
			job.priority = Tile._loadPriority(job.tile, job.idealTiles);
		}
		Tile._loadQueue.sort((a, b) => a.priority - b.priority);
		while (
			Tile._activeDownloads < Tile.effectiveMaxConcurrentDownloads &&
			Tile._loadQueue.length > 0
		) {
			const job = Tile._loadQueue.shift()!;
			const tile = job.tile;
			if (tile._canStartLoading()) {
				void tile._loadData(job.loader);
			}
		}
	}

	/**
	 * Drop obsolete queued work while panning: disposed tiles, out-of-frustum
	 * (unless blocking a showing parent), and cap the queue size.
	 * 平移时剪掉过时请求，避免队列无限膨胀导致越拖越慢。
	 */
	private static _pruneLoadQueue() {
		const MAX_QUEUE = 240;
		if (Tile._loadQueue.length === 0) return;
		const before = Tile._loadQueue.length;
		Tile._loadQueue = Tile._loadQueue.filter((job) => {
			const t = job.tile;
			if (t.z !== 0 && !t.parent) return false;
			if (t.loaded || t.state === TileState.Unloaded) return false;
			const parent = t.parent as Tile | null;
			if (parent && (parent as any).isTile && parent.showing) {
				const sibs = parent.children.filter((c: any) => c.isTile);
				if (sibs.some((c: any) => !c.loaded)) return true;
			}
			// Only drop out-of-frustum work when the queue is actually backing up
			if (!t.inFrustum && Tile._loadQueue.length > 48) return false;
			return true;
		});
		if (Tile._loadQueue.length > MAX_QUEUE) {
			Tile._loadQueue.sort((a, b) => a.priority - b.priority);
			Tile._loadQueue.length = MAX_QUEUE;
		}
		if (before !== Tile._loadQueue.length && Tile.debugSchedule) {
			console.log(`[Schedule] prune queue ${before}→${Tile._loadQueue.length}`);
		}
	}

	/** Drop queued loads for tiles that are no longer pending */
	private static _purgeQueue(tile: Tile) {
		Tile._loadQueue = Tile._loadQueue.filter((job) => job.tile !== tile);
	}

	private static _isQueued(tile: Tile): boolean {
		return Tile._loadQueue.some((job) => job.tile === tile);
	}

	/** Coordinate of tile 瓦片坐标 */
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	/** Is a tile? 是否是瓦片？ */
	public readonly isTile = true;

	/** Tile parent 父瓦片 */
	public readonly parent: this | null = null;

	/** Children of tile 子瓦片 */
	public readonly children: this[] = [];

	private _isReady = false;

	/** return this.minLevel < map.minLevel, True mean do not needs load tile data. True表示不需要加载瓦片数据 */
	private _isVirtualTile = false;
	public get isDummy() {
		return this._isVirtualTile;
	}

	private _isVisible = false;
	// private _wasShowing = false; // Record last showing value 记录上一次 showing 的值

	/**
	 * Gets the showing state of the tile.
	 * 获取瓦片的显示状态。
	 */
	public get showing() {
		return this._isVisible;
	}

	/**
	 * Sets the showing state of the tile.
	 * 设置瓦片的显示状态。
	 * @param value - The new showing state. 新的显示状态。
	 */
	public set showing(value) {
		const oldValue = this._isVisible;
		this._isVisible = value;
		this.material.forEach(mat => (mat.visible = value));

		// 🔥 Critical Fix: When tile changes from hidden to shown, if loaded but not rendered, trigger render
		// 🔥 关键修复：当瓦片从隐藏变为显示时，如果已加载但未渲染，触发渲染
		if (oldValue === false && this._isVisible === true && this._isLoaded) {
			// Trigger an event to notify VectorTileLayer to check and render this tile
			// 触发一个事件，通知 VectorTileLayer 检查并渲染这个瓦片
			// console.log('Tile shown', this.z, this.x, this.y);
			this.dispatchEvent({ type: "tile-shown", tile: this });
		}

		// 🔥 When tile changes from shown to hidden, trigger tile-hidden event
		// 🔥 当瓦片从显示变为隐藏时，触发 tile-hidden 事件
		if (oldValue === true && this._isVisible === false) {
			// console.log('Tile hidden', this.z, this.x, this.y);
			this.dispatchEvent({ type: "tile-hidden", tile: this });
		}
	}

	/** Max height of tile 瓦片最大高度 */
	private _maxHeight = 0;
	/**
	 * Gets the maximum height of the tile.
	 * 获取瓦片的最大高度。
	 */
	public get maxZ() {
		return this._maxHeight;
	}

	/**
	 * Sets the maximum height of the tile.
	 * 设置瓦片的最大高度。
	 * @param value - The new maximum height. 新的最大高度。
	 */
	protected set maxZ(value) {
		this._maxHeight = value;
	}

	/** Distance to camera 到相机的距离 */
	public distToCamera = 0;

	/* Tile size in world 世界空间中的瓦片大小 */
	public sizeInWorld = 0;

	/**
	 * Gets the index of the tile in its parent's children array.
	 * 获取瓦片在父节点子数组中的索引。
	 * @returns The index of the tile. 瓦片的索引。
	 */
	public get index(): number {
		return this.parent ? this.parent.children.indexOf(this) : -1;
	}

	private _isLoaded = false;

	/**
	 * Gets the load state of the tile.
	 * 获取瓦片的加载状态。
	 */
	public get loaded() {
		return this._isLoaded;
	}

	private _inFrustum = false;

	/** Is tile in frustum ? 瓦片是否在视锥体中？ */
	public get inFrustum() {
		return this._inFrustum;
	}

	/**
	 * Sets whether the tile is in the frustum.
	 * 设置瓦片是否在视锥体中。
	 * @param value - The new frustum state. 新的视锥体状态。
	 */
	protected set inFrustum(value) {
		this._inFrustum = value;
	}

	/** Tile is a leaf ? 瓦片是否是叶子节点？ */
	public get isLeaf(): boolean {
		return this.children.filter(child => child.isTile).length === 0;
	}

	/**
	 * Constructor for the Tile class.
	 * Tile类的构造函数。
	 * @param x - Tile X-coordinate, default: 0. 瓦片X坐标，默认0。
	 * @param y - Tile Y-coordinate, default: 0. 瓦片Y坐标，默认0。
	 * @param z - Tile level, default: 0. 瓦片层级，默认0。
	 */
	public constructor(x: number = 0, y: number = 0, z: number = 0) {
		super(defaultGeometry, []);
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = `Tile ${z}-${x}-${y}`;
		this.up.set(0, 0, 1);
		this.matrixAutoUpdate = false;
		// Ensure tiles are rendered before other overlays (like polygons) to avoid transparency sorting issues
		// 确保瓦片在其他覆盖物（如多边形）之前渲染，以避免透明度排序问题
		this.renderOrder = -1;
	}

	/**
	 * Override Object3D.traverse, change the callback param type to "this".
	 * 重写 Object3D.traverse，将回调参数类型更改为 "this"。
	 * @param callback - The callback function. 回调函数。
	 */
	public traverse(callback: (object: this) => void): void {
		callback(this);
		this.children.forEach(tile => {
			tile.isTile && tile.traverse(callback);
		});
	}

	/**
	 * Override Object3D.traverseVisible, change the callback param type to "this".
	 * 重写 Object3D.traverseVisible，将回调参数类型更改为 "this"。
	 * @param callback - The callback function. 回调函数。
	 */
	public traverseVisible(callback: (object: this) => void): void {
		if (this.visible) {
			callback(this);
			this.children.forEach(tile => {
				tile.isTile && tile.traverseVisible(callback);
			});
		}
	}

	/**
	 * Override Object3D.raycast, only test the tile has loaded.
	 * 重写 Object3D.raycast，仅测试已加载的瓦片。
	 * @param raycaster - The raycaster. 射线投射器。
	 * @param intersects - The array of intersections. 交点数组。
	 */
	public raycast(raycaster: Raycaster, intersects: Intersection[]): void {
		if (this.showing && this.loaded && this.isTile) {
			super.raycast(raycaster, intersects);
		}
	}

	/**
	 * LOD (Level of Detail).
	 * LOD（细节层次）。
	 * @param params - The tile loader. 瓦片加载器。
	 * @returns this
	 */
	protected _updateLOD(params: TileUpdateParams) {
		// Always refine LOD structure; network concurrency is handled by the load queue.
		let newTiles: Tile[] = [];
		const { loader, minLevel, maxLevel, LODThreshold, coveringZoom, idealTiles } = params;
		const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold, coveringZoom, idealTiles);
		if (action === LODAction.create) {
			newTiles = createChildren(loader, this.x, this.y, this.z);
			this.add(...newTiles);
		}
		return { action, newTiles };
	}

	/**
	 * Visibility / retain:
	 * - Parent stays visible until every child tile has data (anti-flicker cover).
	 * - If parent itself is missing, climb to the nearest loaded ancestor.
	 */
	private _checkVisibility() {
		const parent = this.parent;
		if (parent && parent.isTile) {
			const children = parent.children.filter(child => child.isTile);
			const allLoaded = children.every(child => child.loaded);
			if (allLoaded) {
				if (parent.showing) Tile._statRetainReleaseCount++;
			} else {
				Tile._statRetainHoldCount++;
			}
			parent.showing = !allLoaded;
			children.forEach(child => (child.showing = allLoaded));

			if (Tile.debugSchedule) {
				const loadedCount = children.filter(c => c.loaded).length;
				console.log(
					`[Schedule] retain parent z${parent.z}/${parent.x}/${parent.y} ` +
					`children ${loadedCount}/${children.length} loaded → parent.showing=${parent.showing}`
				);
			}

			// Parent not ready yet: hold nearest loaded ancestor as cover
			if (!allLoaded && !parent.loaded) {
				let anc: Tile | null = parent.parent as Tile | null;
				while (anc && (anc as any).isTile && !(anc as any).loaded) {
					anc = (anc as any).parent as Tile | null;
				}
				if (anc && (anc as any).isTile) {
					(anc as any).showing = true;
					if (Tile.debugSchedule) {
						console.log(
							`[Schedule] ancestor cover z${(anc as any).z}/${(anc as any).x}/${(anc as any).y} ` +
							`for incomplete z${parent.z}/${parent.x}/${parent.y}`
						);
					}
				}
			}
		}
		return this;
	}

	/**
	 * Asynchronously load tile data with state machine and retry support
	 * 异步加载瓦片数据，支持状态机和重试
	 *
	 * @param loader Tile loader
	 * @returns this
	 */
	private async _loadData(loader: ICompositeLoader): Promise<Tile> {
		// Check if tile can start loading 检查瓦片是否可以开始加载
		if (!this._canStartLoading()) {
			return this;
		}

		// Transition to Loading state 转换到 Loading 状态
		this._transitionTo(TileState.Loading);
		Tile._activeDownloads++;

		// Abort previous request if any
		this._abortController?.abort();
		this._abortController = new AbortController();
		const signal = this._abortController.signal;

		const { x, y, z } = this;
		if (Tile.debugSchedule) {
			console.log(
				`[Schedule] start load z${z}/${x}/${y} ` +
				`active=${Tile._activeDownloads}/${Tile.effectiveMaxConcurrentDownloads} queue=${Tile._loadQueue.length}`
			);
		}

		try {
			// 如果是数据模式，只获取数据不创建Mesh
			if (this._dataMode) {
				// 调用加载器获取数据
				const meshData = await loader.load({
					x, y, z,
					bounds: [-Infinity, -Infinity, Infinity, Infinity],
					signal,
				});
				if (signal.aborted) {
					this._transitionTo(TileState.Unloaded);
					this._onLoadComplete = null;
					return this;
				}
				(this as any)._vectorData = (meshData as any).geometry?.userData || {};

				// Transition to Loaded state 转换到 Loaded 状态
				this._transitionTo(TileState.Loaded);
				this._retryCount = 0; // Reset retry count on success 成功后重置重试计数
				Tile._statLoadedDistSum += this.distToCamera;
				Tile._statLoadedDistCount++;
				if (this.distToCamera < Tile._statLoadedDistMin) Tile._statLoadedDistMin = this.distToCamera;
				if (this.distToCamera > Tile._statLoadedDistMax) Tile._statLoadedDistMax = this.distToCamera;
				if (Tile.debugSchedule) {
					console.log(`[Schedule] loaded z${z}/${x}/${y} (vector) dist=${this.distToCamera.toFixed(0)}`);
				}

				// 触发数据加载事件
				this.dispatchEvent({
					type: "vector-data-loaded",
					data: (this as any)._vectorData,
					tile: this
				});
			} else {
				const meshData = await loader.load({
					x,
					y,
					z,
					bounds: [-Infinity, -Infinity, Infinity, Infinity],
					signal,
				});
				if (signal.aborted) {
					this._transitionTo(TileState.Unloaded);
					this._onLoadComplete = null;
					return this;
				}
				this.material = meshData.materials;
				this.geometry = meshData.geometry;
				this.maxZ = this.geometry.boundingBox?.max.z || 0;

				// Transition to Loaded state 转换到 Loaded 状态
				this._transitionTo(TileState.Loaded);
				this._retryCount = 0; // Reset retry count on success 成功后重置重试计数
			}
		} catch (error) {
			const isAbort =
				signal.aborted ||
				(error as any)?.name === "AbortError" ||
				String((error as Error)?.message || "").includes("AbortError");

			if (isAbort) {
				// Cancelled by dispose/refinement — not a failure
				Tile._statAbortCount++;
				if (Tile.debugSchedule) {
					console.log(`[Schedule] abort z${z}/${x}/${y} (cancelled, not an error)`);
				}
				this._transitionTo(TileState.Unloaded);
				this._abortController = null;
				this._onLoadComplete = null;
				return this;
			}

			console.error(`Tile load failed ${z}/${x}/${y} (attempt ${this._retryCount + 1}/${this._maxRetries}):`, error);

			// Transition to Error state 转换到 Error 状态
			this._transitionTo(TileState.Error);
			this._retryCount++;

			// Auto retry if within retry limit 如果在重试次数限制内，自动重试
			if (this._needsRetry()) {
				Tile._activeDownloads--;
				// Exponential backoff: 100ms, 200ms, 400ms 指数退避
				const delay = Math.min(100 * Math.pow(2, this._retryCount - 1), 2000);
				await new Promise(resolve => setTimeout(resolve, delay));
				return this._loadData(loader);
			}
		} finally {
			Tile._activeDownloads--;
			this._abortController = null;
			const done = this._onLoadComplete;
			this._onLoadComplete = null;
			if (done) {
				try { done(); } catch { /* ignore */ }
			}
			// Start next queued loads (center-first)
			Tile._drainLoadQueue();
		}

		return this;
	}

	/** New tile init */
	private _initTile() {
		this.updateMatrix();
		this.updateMatrixWorld();
		this.sizeInWorld = getTileSize(this);

		// 添加调试信息
		// console.log(`瓦片 ${this.z}-${this.x}-${this.y} 变换矩阵:`, {
		// 	position: this.position.toArray(),
		// 	scale: this.scale.toArray(),
		// 	rotation: this.rotation.toArray(),
		// 	matrix: this.matrix.toArray(),
		// 	matrixWorld: this.matrixWorld.toArray()
		// });
	}
	/**
	 * Updates the tile.
	 * @param params - The update parameters.
	 * @returns this
	 */
	public update(params: TileUpdateParams) {
		console.assert(this.z === 0);
		if (!this.parent) {
			return this;
		}

		// Interaction throttle for this frame
		Tile.interacting = !!params.interacting;
		if (typeof params.coveringZoom === "number" && Number.isFinite(params.coveringZoom)) {
			Tile._coveringZoom = params.coveringZoom;
		}

		// Get camera frustum
		frustum.setFromProjectionMatrix(
			tempMat4.multiplyMatrices(params.camera.projectionMatrix, params.camera.matrixWorldInverse)
		);

		// Get camera position
		const cameraWorldPosition = params.camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse(tile => {
			// shadow
			tile.receiveShadow = this.receiveShadow;
			tile.castShadow = this.castShadow;

			// 修复视锥体检测
			const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			tile.inFrustum = frustum.intersectsBox(bounds);

			// Get distance to camera
			tile.distToCamera = getDistance(tile, cameraWorldPosition);

			// Deferred load: tile entered frustum after it was created
			if (
				tile.inFrustum &&
				!tile.isDummy &&
				!tile.loaded &&
				tile.z >= params.minLevel &&
				tile._canStartLoading() &&
				!Tile._isQueued(tile)
			) {
				if (!tile._onLoadComplete) {
					tile._onLoadComplete = () => {
						tile._checkVisibility();
						this.dispatchEvent({ type: "tile-loaded", tile });
					};
				}
				if (Tile.debugSchedule) {
					console.log(`[Schedule] enter-frustum load z${tile.z}/${tile.x}/${tile.y}`);
				}
				Tile._statEnterFrustumCount++;
				Tile._enqueueLoad(tile, params.loader, params.idealTiles);
			}

			// LOD
			const { action, newTiles } = tile._updateLOD(params);
			this._processLODAction(tile, action, newTiles, params);
		});

		// Re-prioritize queued loads with fresh distances
		Tile._drainLoadQueue();

		this._checkReadyState();

		return this;
	}

	private _processLODAction(currentTile: Tile, action: LODAction, newTiles: Tile[] | undefined, params: TileUpdateParams) {
		if (action === LODAction.create) {
			// Mapbox-style: ensure the parent has data so it can cover while children load
			if (
				!currentTile.isDummy &&
				currentTile.z >= params.minLevel &&
				!currentTile.loaded &&
				currentTile._canStartLoading() &&
				!Tile._isQueued(currentTile)
			) {
				if (!currentTile._onLoadComplete) {
					const parentForEvent = this;
					currentTile._onLoadComplete = () => {
						currentTile._checkVisibility();
						parentForEvent.dispatchEvent({ type: "tile-loaded", tile: currentTile });
					};
				}
				Tile._statParentPrefetchCount++;
				if (Tile.debugSchedule) {
					console.log(
						`[Schedule] parent-prefetch z${currentTile.z}/${currentTile.x}/${currentTile.y} ` +
						`(cover while children load)`
					);
				}
				Tile._enqueueLoad(currentTile, params.loader, params.idealTiles);
			}

			// Init children, then enqueue in-frustum loads by distance (center first)
			newTiles?.forEach(newTile => {
				newTile._initTile();
				// At far zoom, coveringZoom may be < minLevel — still load ancestors
				// so the world is not a single tile + skybox (issue: min zoom empty).
				const minLoad = Math.min(
					params.minLevel,
					Math.max(0, Math.floor(params.coveringZoom ?? params.minLevel))
				);
				newTile._isVirtualTile = newTile.z < minLoad;
				newTile.distToCamera = currentTile.distToCamera;
				// Inherit frustum so this-frame enqueue is not pruned as out-of-view
				(newTile as any).inFrustum = currentTile.inFrustum;
				this.dispatchEvent({ type: "tile-created", tile: newTile });
				if (!newTile.isDummy) {
					newTile._onLoadComplete = () => {
						newTile._checkVisibility();
						this.dispatchEvent({ type: "tile-loaded", tile: newTile });
					};
					if (currentTile.inFrustum) {
						Tile._enqueueLoad(newTile, params.loader, params.idealTiles);
					} else {
						Tile._statDeferCount++;
						if (Tile.debugSchedule) {
							console.log(
								`[Schedule] defer load z${newTile.z}/${newTile.x}/${newTile.y} (parent out of frustum)`
							);
						}
					}
				}
			});
		} else if (action === LODAction.remove) {
			currentTile.showing = true;
			// unload children tiles
			currentTile._disposeResources(false, params.loader);
			this.dispatchEvent({ type: "tile-unload", tile: currentTile });
		}
		return this;
	}

	/**
	 * Reloads the tile data.
	 * @returns this
	 */
	public reload(loader: ICompositeLoader) {
		this._disposeResources(true, loader);
		return this;
	}

	/**
	 * Checks if the tile is ready to render.
	 * @returns this
	 */
	private _checkReadyState() {
		if (!this._isReady) {
			this._isReady = true;
			this.traverse(child => {
				if (child.isLeaf && child.loaded && !child.isDummy) {
					this._isReady = false;
					return;
				}
			});
			if (this._isReady) {
				this.dispatchEvent({ type: "ready" });
			}
		}
		return this;
	}

	/**
	 * UnLoads the tile data.
	 * @param disposeSelf - Whether to unload tile itself.
	 * @returns this.
	 */
	// private _disposeResources(disposeSelf: boolean, loader: ITileLoader) {
	// 	if (disposeSelf && this.isTile && !this.isDummy) {
	// 		this.dispatchEvent({ type: "unload" });
	// 		loader?.unload?.(this);
	// 	}
	// 	// remove all children recursively
	// 	this.children.forEach(child => child._disposeResources(true, loader));
	// 	this.clear();
	// 	return this;
	// }

	private _disposeResources(disposeSelf: boolean, loader: ICompositeLoader) {
		// Cancel in-flight / queued work for this tile
		if (Tile.debugSchedule && (this._abortController || Tile._loadQueue.some(j => j.tile === this))) {
			console.log(`[Schedule] dispose/abort z${this.z}/${this.x}/${this.y}`);
		}
		Tile._purgeQueue(this);
		this._abortController?.abort();
		this._abortController = null;
		this._onLoadComplete = null;

		if (disposeSelf && this.isTile && !this.isDummy) {
			// Transition to Unloaded state 转换到 Unloaded 状态
			this._transitionTo(TileState.Unloaded);
			this.dispatchEvent({ type: "unload" });
			loader?.unload?.(this);
		}
		// remove all children recursively
		this.children.forEach(child => child._disposeResources(true, loader));
		this.clear();
		return this;
	}
}
