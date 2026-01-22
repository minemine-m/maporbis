
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

const THREADSNUM = 10;

/**
 * Tile update parameters
 */
export type TileUpdateParams = {
	camera: Camera;
	loader: ICompositeLoader;
	minLevel: number;
	maxLevel: number;
	LODThreshold: number;
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
	private static _activeDownloadThreads = 0;
	// Data mode switch 数据模式开关
	private _isDataOnlyMode: boolean = false;
	/** Vector Data 矢量数据 */
	public vectorData: any = null;
	/**
		* Set data only mode (do not create Mesh, only return data)
		* 设置为数据模式（不创建Mesh，只返回数据）
		*/
	public setDataOnlyMode(enabled: boolean): this {
		this._isDataOnlyMode = enabled;
		if (enabled) {
			this.visible = false; // Hide Mesh 隐藏Mesh
		}
		return this;
	}
	/**
	 * Check if it is data only mode
	 * 检查是否是数据模式
	  */
	public isDataOnlyMode(): boolean {
		return this._isDataOnlyMode;
	}

	/**
	 * Get vector data (only valid in data mode)
	 * 获取矢量数据（仅数据模式有效）
	 */
	public getVectorData(): any {
		return (this as any).vectorData;
	}
	/**
	 * Number of download threads.
	 * 下载线程数
	 */
	public static get downloadThreads() {
		return Tile._activeDownloadThreads;
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
	private _isDummyTile = false;
	public get isDummy() {
		return this._isDummyTile;
	}

	private _isShowing = false;
	// private _wasShowing = false; // Record last showing value 记录上一次 showing 的值

	/**
	 * Gets the showing state of the tile.
	 * 获取瓦片的显示状态。
	 */
	public get showing() {
		return this._isShowing;
	}

	/**
	 * Sets the showing state of the tile.
	 * 设置瓦片的显示状态。
	 * @param value - The new showing state. 新的显示状态。
	 */
	public set showing(value) {
		const oldValue = this._isShowing;
		this._isShowing = value;
		this.material.forEach(mat => (mat.visible = value));

		// 🔥 Critical Fix: When tile changes from hidden to shown, if loaded but not rendered, trigger render
		// 🔥 关键修复：当瓦片从隐藏变为显示时，如果已加载但未渲染，触发渲染
		if (oldValue === false && this._isShowing === true && this._isLoaded) {
			// Trigger an event to notify VectorTileLayer to check and render this tile
			// 触发一个事件，通知 VectorTileLayer 检查并渲染这个瓦片
			// console.log('Tile shown', this.z, this.x, this.y);
			this.dispatchEvent({ type: "tile-shown", tile: this });
		}

		// 🔥 When tile changes from shown to hidden, trigger tile-hidden event
		// 🔥 当瓦片从显示变为隐藏时，触发 tile-hidden 事件
		if (oldValue === true && this._isShowing === false) {
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

	private _isInFrustum = false;

	/** Is tile in frustum ? 瓦片是否在视锥体中？ */
	public get inFrustum() {
		return this._isInFrustum;
	}

	/**
	 * Sets whether the tile is in the frustum.
	 * 设置瓦片是否在视锥体中。
	 * @param value - The new frustum state. 新的视锥体状态。
	 */
	protected set inFrustum(value) {
		this._isInFrustum = value;
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
	public constructor(x = 0, y = 0, z = 0) {
		super(defaultGeometry, []);
		this.x = x;
		this.y = y;
		this.z = z;
		this.name = `Tile ${z}-${x}-${y}`;
		this.up.set(0, 0, 1);
		this.matrixAutoUpdate = false;
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
	 * @param loader - The tile loader. 瓦片加载器。
	 * @param minLevel - The minimum level. 最小层级。
	 * @param maxLevel - The maximum level. 最大层级。
	 * @param threshold - The threshold. 阈值。
	 * @returns this
	 */
	protected updateLOD(params: TileUpdateParams) {
		if (Tile.downloadThreads > THREADSNUM) {
			return { action: LODAction.none };
		}
		let newTiles: Tile[] = [];
		// LOD evaluate
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
	private _checkVisible() {
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
	 * Asynchronously load tile data
	 *
	 * @param loader Tile loader
	 * @returns this
	 */
	private async _load(loader: ICompositeLoader): Promise<Tile> {
		Tile._activeDownloadThreads++;
		const { x, y, z } = this;

		// 如果是数据模式，只获取数据不创建Mesh
		if (this._isDataOnlyMode) {
			try {
				// 调用加载器获取数据
				const meshData = await loader.load({
					x, y, z,
					bounds: [-Infinity, -Infinity, Infinity, Infinity],
				});
				(this as any).vectorData = (meshData as any).geometry?.userData || {};

				this._isLoaded = true;
				// 触发数据加载事件
				this.dispatchEvent({
					type: "vector-data-loaded",
					data: (this as any).vectorData,
					tile: this
				});

			} catch (error) {
				console.error(`数据模式加载失败 ${z}/${x}/${y}:`, error);
				this._isLoaded = false;
			}
		}
		else {
			const meshData = await loader.load({
				x,
				y,
				z,
				bounds: [-Infinity, -Infinity, Infinity, Infinity],
			});
			this.material = meshData.materials;
			// this.material = [new MeshPhongMaterial({
			// 	color: 0xFF0000,
			// 	flatShading: true,
			// 	side: DoubleSide,
			// })];
			this.geometry = meshData.geometry;
			this.maxZ = this.geometry.boundingBox?.max.z || 0;
			this._isLoaded = true;
		}

		Tile._activeDownloadThreads--;
		// this._checkVisible();
		return this;
	}

	/** New tile init */
	private _init() {
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
		// console.log(`Tile.update called for root tile ${this.name}, parent exists: ${!!this.parent}`);
		if (!this.parent) {
			return this;
		}
		// console.log("camera:", camera);

		// Get camera frustum
		frustum.setFromProjectionMatrix(
			tempMat4.multiplyMatrices(params.camera.projectionMatrix, params.camera.matrixWorldInverse)
		);

		// console.log(params.camera, '此时更新的camera -------------')
		// Get camera position
		const cameraWorldPosition = params.camera.getWorldPosition(tempVec3);

		// LOD for tiles
		this.traverse(tile => {
			// shadow
			tile.receiveShadow = this.receiveShadow;
			tile.castShadow = this.castShadow;

			// Tile is in frustum?
			// const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			// bounds.max.setY(9000);

			// 修复视锥体检测
			const bounds = tileBox.clone().applyMatrix4(tile.matrixWorld);
			// 根据瓦片的最大高度动态设置包围盒
			// bounds.max.z = tile.maxZ > 0 ? tile.maxZ : 100; // 默认给一个较小的高度
			// tile.inFrustum = frustum.intersectsBox(bounds);
			
			// const bounds = new Box3(new Vector3(-0.5, -0.5, 0), new Vector3(0.5, 0.5, (this.z + 2) * 500)).applyMatrix4(
			// 	tile.matrixWorld
			// );
			tile.inFrustum = frustum.intersectsBox(bounds);

			// Get distance to camera
			tile.distToCamera = getDistance(tile, cameraWorldPosition);
			// console.log(params, 'params------------')
			// LOD
			const { action, newTiles } = tile.updateLOD(params);
			// console.log(action, 'action------------')
			this.handleLODAction(tile, action, newTiles, params);
		});

		this._checkReady();

		// console.log(this, '此时更新的tile -------------')
		return this;
	}

	private handleLODAction(currentTile: Tile, action: LODAction, newTiles: Tile[] | undefined, params: TileUpdateParams) {
		// console.log(action, 'action------------')
		// console.log(LODAction, 'LODAction------------')
		if (action === LODAction.create) {
			// Load new tiles data
			newTiles?.forEach(newTile => {
				newTile._init();
				newTile._isDummyTile = newTile.z < params.minLevel;
				this.dispatchEvent({ type: "tile-created", tile: newTile });
				if (!newTile.isDummy) {
					newTile._load(params.loader).then(() => {
						// Show tile when all children has loaded
						newTile._checkVisible();
						this.dispatchEvent({ type: "tile-loaded", tile: newTile });
					});
				}
			});
		} else if (action === LODAction.remove) {
			currentTile.showing = true;
			// unload children tiles
			currentTile._unLoad(false, params.loader);
			this.dispatchEvent({ type: "tile-unload", tile: currentTile });
		}
		return this;
	}

	/**
	 * Reloads the tile data.
	 * @returns this
	 */
	public reload(loader: ICompositeLoader) {
		this._unLoad(true, loader);
		return this;
	}

	/**
	 * Checks if the tile is ready to render.
	 * @returns this
	 */
	private _checkReady() {
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
	 * @param unLoadSelf - Whether to unload tile itself.
	 * @returns this.
	 */
	// private _unLoad(unLoadSelf: boolean, loader: ITileLoader) {
	// 	if (unLoadSelf && this.isTile && !this.isDummy) {
	// 		this.dispatchEvent({ type: "unload" });
	// 		loader?.unload?.(this);
	// 	}
	// 	// remove all children recursively
	// 	this.children.forEach(child => child._unLoad(true, loader));
	// 	this.clear();
	// 	return this;
	// }

	private _unLoad(unLoadSelf: boolean, loader: ICompositeLoader) {
		if (unLoadSelf && this.isTile && !this.isDummy) {
			this.dispatchEvent({ type: "unload" });
			loader?.unload?.(this);
		}
		// remove all children recursively
		this.children.forEach(child => child._unLoad(true, loader));
		this.clear();
		return this;
	}
}
