
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
import { createChildren, getDistance, getTileSize, LODAction, LODEvaluate } from "./util";

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
	/** Lower concurrency while the user is panning/zooming */
	private static _interactingMaxConcurrentDownloads = 3;
	private static _interacting = false;
	/** Priority queue of tiles waiting to start network load (center-first) */
	private static _loadQueue: Array<{ tile: Tile; loader: ICompositeLoader; priority: number }> = [];
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
	 * Enqueue a tile load by camera distance (center tiles first).
	 * 按相机距离入队加载（中心优先）。
	 */
	private static _enqueueLoad(tile: Tile, loader: ICompositeLoader) {
		Tile._loadQueue.push({ tile, loader, priority: tile.distToCamera });
		Tile._drainLoadQueue();
	}

	private static _drainLoadQueue() {
		if (Tile._loadQueue.length === 0) return;
		// Refresh priorities from latest camera distances
		for (const job of Tile._loadQueue) {
			job.priority = job.tile.distToCamera;
		}
		// Closer tiles load first
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

	/** Drop queued loads for tiles that are no longer pending */
	private static _purgeQueue(tile: Tile) {
		Tile._loadQueue = Tile._loadQueue.filter((job) => job.tile !== tile);
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
		// 始终细分 LOD 结构；网络并发由加载队列控制。
		let newTiles: Tile[] = [];
		const { loader, minLevel, maxLevel, LODThreshold } = params;
		const action = LODEvaluate(this, minLevel, maxLevel, LODThreshold);
		if (action === LODAction.create) {
			newTiles = createChildren(loader, this.x, this.y, this.z);
			this.add(...newTiles);
		}
		return { action, newTiles };
	}

	/**
	 * Checks the visibility of the tile.
	 */
	private _checkVisibility() {
		const parent = this.parent;
		if (parent && parent.isTile) {
			const children = parent.children.filter(child => child.isTile);
			const allLoaded = children.every(child => child.loaded);
			parent.showing = !allLoaded;
			children.forEach(child => (child.showing = allLoaded));
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
			// Init children, then enqueue loads by distance (center first)
			newTiles?.forEach(newTile => {
				newTile._initTile();
				newTile._isVirtualTile = newTile.z < params.minLevel;
				// Approximate priority from parent distance before first camera update
				newTile.distToCamera = currentTile.distToCamera;
				this.dispatchEvent({ type: "tile-created", tile: newTile });
				if (!newTile.isDummy) {
					newTile._onLoadComplete = () => {
						newTile._checkVisibility();
						this.dispatchEvent({ type: "tile-loaded", tile: newTile });
					};
					Tile._enqueueLoad(newTile, params.loader);
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
