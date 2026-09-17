
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
import { TileCache } from "../../loaders/TileCache";
import { getDistance, getTileSize, IdealTileSet } from "./util";
import { computeTileRootLocal } from "./tileTransform";
import { TileLoadScheduler } from "./TileLoadScheduler";

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

		if (newState === TileState.Loaded) {
			this._isLoaded = true;
		} else if (
			newState === TileState.Idle ||
			newState === TileState.Loading ||
			newState === TileState.Unloaded
		) {
			this._isLoaded = false;
		}

		return true;
	}

	/**
	 * Unloaded must be reloadable — dispose sets Unloaded and the tile is
	 * often needed again on the next zoom/pan.
	 */
	private _canStartLoading(): boolean {
		return (
			this._state === TileState.Idle ||
			this._state === TileState.Error ||
			this._state === TileState.Unloaded
		);
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
	/** Optional payload LRU on the tree root (set by TileLayer) */
	public _payloadCache: TileCache | null = null;

	private _rootCache(): TileCache | null {
		let t: Tile = this;
		while (t.parent && (t.parent as any).isTile) {
			t = t.parent as Tile;
		}
		return t._payloadCache;
	}

	/** Shared empty placeholder geometry — never cache or dispose it. */
	private static _isPlaceholderGeometry(geo: any): boolean {
		return !geo || geo === defaultGeometry || !(geo as any).attributes?.position;
	}

	private static _payloadMaterials(materials: any): Material[] {
		const list = Array.isArray(materials) ? materials : materials ? [materials] : [];
		return list.filter(Boolean) as Material[];
	}

	/**
	 * Raster tiles need a real geometry + at least one material to draw.
	 * Vector/data-only tiles only need vector payload.
	 */
	hasRenderPayload(): boolean {
		if (this._dataMode) {
			return !!(this as any)._vectorData;
		}
		return (
			!Tile._isPlaceholderGeometry(this.geometry) &&
			Tile._payloadMaterials(this.material).length > 0
		);
	}

	private _cacheKey(): string {
		return `${this.z}/${this.x}/${this.y}`;
	}
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

	/** Count tiles in a layer tree (debug). */
	public static countTree(root: Tile): number {
		let n = 0;
		root.traverse((t) => {
			if ((t as any).isTile) n++;
		});
		return n;
	}

	/** Thin alias: scheduling lives on TileLoadScheduler. */
	public static requestLoad(
		tile: Tile,
		loader: ICompositeLoader,
		idealTiles?: Set<string>
	): void {
		TileLoadScheduler.enqueue(tile, loader, idealTiles);
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
		// Schedule layer already does frustum tests. Three's mesh frustumCulled
		// uses stale hierarchical bounds and randomly drops tiles.
		this.frustumCulled = false;
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
	 * Visibility / retain (called when a child finishes loading).
	 * No-op: SourceCache retain/covered owns showing when idealTiles is set.
	 */
	private _checkVisibility() {
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

		const { x, y, z } = this;

		// Cache hit first — must not take a download slot (no network)
		const cache = this._rootCache();
		if (cache) {
			const hit = cache.get(z, x, y);
			if (hit) {
				// Exclusive handoff: drop the entry so LRU evict cannot dispose
				// GPU objects still bound to a live tile.
				cache.delete(z, x, y);
				const hitMats = Tile._payloadMaterials(hit.materials);
				const hitGeo = hit.geometry;
				const okHit = this._dataMode
					? true
					: !Tile._isPlaceholderGeometry(hitGeo) && hitMats.length > 0;
				if (okHit) {
					try {
						if (this._dataMode) {
							(this as any)._vectorData = (hitGeo as any)?.userData || {};
						} else {
							this.geometry = hitGeo;
							this.material = hitMats;
							this.maxZ = (this.geometry as any)?.boundingBox?.max.z || 0;
							this._applyRasterDepthBias();
						}
						this._transitionTo(TileState.Loaded);
						this._retryCount = 0;
						if (TileLoadScheduler.debugSchedule) {
							console.log(`[Schedule] cache-hit z${z}/${x}/${y}`);
						}
						const done = this._onLoadComplete;
						this._onLoadComplete = null;
						if (done) {
							try { done(); } catch { /* ignore */ }
						}
						TileLoadScheduler.drain();
						return this;
					} catch {
						/* fall through to network */
					}
				} else if (TileLoadScheduler.debugSchedule) {
					console.log(`[Schedule] cache-hit-empty z${z}/${x}/${y} → reload`);
				}
			}
		}

		// Transition to Loading state 转换到 Loading 状态
		this._transitionTo(TileState.Loading);
		TileLoadScheduler.beginDownload(this);

		// Abort previous request if any
		this._abortController?.abort();
		this._abortController = new AbortController();
		const signal = this._abortController.signal;

		if (TileLoadScheduler.debugSchedule) {
			console.log(
				`[Schedule] start load z${z}/${x}/${y} ` +
				`active=${TileLoadScheduler.downloadThreads}/${TileLoadScheduler.effectiveMaxConcurrentDownloads} queue=${TileLoadScheduler.loadQueueSize}`
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
				TileLoadScheduler.noteLoadedDist(this.distToCamera);
				if (TileLoadScheduler.debugSchedule) {
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
				this.material = Tile._payloadMaterials(meshData.materials);
				this.geometry = meshData.geometry;
				if (Tile._isPlaceholderGeometry(this.geometry) || this.material.length === 0) {
					// Do not mark Loaded without a drawable payload — that creates skybox holes.
					this.geometry = defaultGeometry as any;
					this.material = [] as any;
					this._transitionTo(TileState.Error);
					this._onLoadComplete = null;
					return this;
				}
				this.maxZ = this.geometry.boundingBox?.max.z || 0;
				this._applyRasterDepthBias();

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
				TileLoadScheduler.noteAbort();
				if (TileLoadScheduler.debugSchedule) {
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
				TileLoadScheduler.freeDownloadSlotForRetry(this);
				// Exponential backoff: 100ms, 200ms, 400ms 指数退避
				const delay = Math.min(100 * Math.pow(2, this._retryCount - 1), 2000);
				await new Promise(resolve => setTimeout(resolve, delay));
				return this._loadData(loader);
			}
		} finally {
			TileLoadScheduler.endDownload(this);
			this._abortController = null;
			const done = this._onLoadComplete;
			this._onLoadComplete = null;
			if (done) {
				try { done(); } catch { /* ignore */ }
			}
			// Start next queued loads (center-first)
			TileLoadScheduler.drain();
		}

		return this;
	}

	/**
	 * Flat Mapbox-style transform: tile is a direct child of root in root-local
	 * unit space (before root scale mapW/mapH). y=0 is the top row (+v).
	 */
	public setTileTransform(z: number, x: number, y: number): void {
		const local = computeTileRootLocal(z, x, y);
		this.position.set(local.u, local.v, 0);
		this.scale.set(local.su, local.sv, 1);
		this.matrixAutoUpdate = false;
		this.updateMatrix();
	}

	/** New tile init */
	private _initTile() {
		this.frustumCulled = false;
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
	 * Child tiles (higher z) must win over parents during retain handoff —
	 * coplanar rasters otherwise z-fight while both are retained.
	 */
	private _applyRasterDepthBias(): void {
		if (this._dataMode || !Array.isArray(this.material)) return;
		// Large mercator coords need a stronger bias than 1–2 units
		const factor = -this.z * 8;
		this.material.forEach((mat) => {
			if (!mat) return;
			mat.polygonOffset = true;
			mat.polygonOffsetFactor = factor;
			mat.polygonOffsetUnits = factor;
			mat.needsUpdate = true;
		});
		this._syncMaterialVisibility();
	}

	/**
	 * New/cached materials default to visible=true. Until SourceCache marks
	 * showing, a just-loaded tile would draw under its parent and at the
	 * wrong LOD — the pitch "sharp/blur patches" and edge z-fight.
	 */
	private _syncMaterialVisibility(): void {
		if (!Array.isArray(this.material)) return;
		const show = this._isVisible;
		this.material.forEach((mat) => {
			if (mat) mat.visible = show;
		});
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
		TileLoadScheduler.interacting = !!params.interacting;
		if (typeof params.coveringZoom === "number" && Number.isFinite(params.coveringZoom)) {
			TileLoadScheduler.coveringZoom = params.coveringZoom;
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

			// Deferred load: exact ideal keys only when SourceCache drives.
			// Ancestors-of-ideals used to enqueue the whole z-1..z-N chain.
			const idealSet = params.idealTiles;
			const onIdealPath =
				!idealSet ||
				idealSet.size === 0 ||
				idealSet.has(`${tile.z}/${tile.x}/${tile.y}`);
			if (
				tile.inFrustum &&
				onIdealPath &&
				!tile.isDummy &&
				!tile.loaded &&
				tile.z >= params.minLevel &&
				tile._canStartLoading() &&
				!TileLoadScheduler.isQueued(tile)
			) {
				if (!tile._onLoadComplete) {
					tile._onLoadComplete = () => {
						tile._checkVisibility();
						this.dispatchEvent({ type: "tile-loaded", tile });
					};
				}
				if (TileLoadScheduler.debugSchedule) {
					console.log(`[Schedule] enter-frustum load z${tile.z}/${tile.x}/${tile.y}`);
				}
				TileLoadScheduler.noteEnterFrustum();
				TileLoadScheduler.enqueue(tile, params.loader, params.idealTiles);
			}
			// PR-3: no LOD create/remove. Structure is owned by SourceCache.ensureTilePath.
		});

		// Re-prioritize queued loads with fresh distances
		TileLoadScheduler.drain();

		this._checkReadyState();

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

	/**
	 * Shallow payload release for SourceCache (PR-2). Does NOT recurse into
	 * children — retained descendants must keep their scene parents and data.
	 */
	releasePayloadForCache(loader?: ICompositeLoader): void {
		TileLoadScheduler.purge(this);
		this._abortController?.abort();
		this._abortController = null;
		this._onLoadComplete = null;
		if (!this.isTile || this.isDummy) return;
		if (!this.loaded && this.state === TileState.Idle) return;

		this._transitionTo(TileState.Unloaded);
		this.dispatchEvent({ type: "unload" });

		const cache = this._rootCache();
		const mats = Tile._payloadMaterials(this.material);
		const geo = this.geometry;
		const canCache =
			!this._dataMode &&
			!Tile._isPlaceholderGeometry(geo) &&
			mats.length > 0;
		if (cache) {
			if (this._dataMode) {
				cache.set(this.z, this.x, this.y, {
					materials: [],
					geometry: { userData: (this as any)._vectorData } as any,
				});
				(this as any)._vectorData = null;
			} else if (canCache) {
				cache.set(this.z, this.x, this.y, {
					materials: mats as any,
					geometry: geo as any,
				});
			}
		} else if (canCache) {
			loader?.unload?.(this);
		}
		this.geometry = defaultGeometry as any;
		this.material = [] as any;
	}

	private _disposeResources(disposeSelf: boolean, loader: ICompositeLoader) {
		// Cancel in-flight / queued work for this tile
		if (TileLoadScheduler.debugSchedule && (this._abortController || TileLoadScheduler.isQueued(this))) {
			console.log(`[Schedule] dispose/abort z${this.z}/${this.x}/${this.y}`);
		}
		TileLoadScheduler.purge(this);
		this._abortController?.abort();
		this._abortController = null;
		this._onLoadComplete = null;

		if (disposeSelf && this.isTile && !this.isDummy) {
			// Transition to Unloaded state 转换到 Unloaded 状态
			this._transitionTo(TileState.Unloaded);
			this.dispatchEvent({ type: "unload" });

			const cache = this._rootCache();
			const mats = Tile._payloadMaterials(this.material);
			const geo = this.geometry;
			const canCache = !this._dataMode &&
				!Tile._isPlaceholderGeometry(geo) &&
				mats.length > 0;
			if (cache) {
				// Keep payload for zoom-back; skip loader.unload (cache owns GPU objects)
				if (this._dataMode) {
					cache.set(this.z, this.x, this.y, {
						materials: [],
						geometry: { userData: (this as any)._vectorData } as any,
					});
					(this as any)._vectorData = null;
				} else if (canCache) {
					// Transfer ownership of real GPU payload only.
					// Never write placeholder/empty entries — a later cache hit
					// would mark the tile Loaded with nothing to draw (skybox hole),
					// and a re-dispose would wipe a good cache slot.
					cache.set(this.z, this.x, this.y, {
						materials: mats as any,
						geometry: geo as any,
					});
				}
				this.geometry = defaultGeometry as any;
				this.material = [] as any;
			} else {
				if (canCache) {
					loader?.unload?.(this);
				}
				this.geometry = defaultGeometry as any;
				this.material = [] as any;
			}
		}
		// remove all children recursively
		this.children.forEach(child => child._disposeResources(true, loader));
		this.clear();
		return this;
	}
}
