// layers/BaseTileLayer.ts
import { Camera } from "three";
import { ISource } from "../../sources";
import { MapProjection as IProjection } from "../../projection";
import { ITileLayer } from "./interfaces/ITileLayer";
import { Tile } from "../../core/tile"; 
import { ICompositeLoader } from "../../loaders"; 
import { Layer, LayerOptions } from "../Layer";

/**
 * Tile Layer configuration interface.
 * 瓦片图层配置接口
 * 
 * @description
 * Base configuration options for all tile layers.
 * 所有瓦片图层的基本配置选项。
  * @category Layer
 */
export interface BaseTileLayerOptions extends LayerOptions {
    /**
     * Data source(s) for the layer.
     * 图层数据源。
     */
    source: ISource | ISource[];

    /**
     * Projection system used by the layer.
     * 图层使用的投影系统。
     */
    projection: IProjection;

    /**
     * Minimum zoom level.
     * 最小缩放级别。
     * @default 2
     */
    minLevel?: number;

    /**
     * Maximum zoom level.
     * 最大缩放级别。
     * @default 19
     */
    maxLevel?: number;

    /**
     * Level of Detail (LOD) threshold.
     * 细节层次（LOD）阈值。
     * @default 1
     */
    LODThreshold?: number;

    /**
     * Layer opacity (0-1).
     * 图层透明度 (0-1)。
     * @default 1
     */
    opacity?: number;
}

/**
 * Tile Layer abstract base class.
 * 瓦片图层抽象基类
 * 
 * @description 
 * Provides basic implementation skeleton for tile-based layers.
 * It handles the creation and management of the tile tree, LOD (Level of Detail) updates, and visibility.
 * 
 * 提供基于瓦片的图层的基本实现骨架。
 * 它处理瓦片树的创建和管理、LOD（细节层次）更新和可见性。
 *
 * @abstract
 * @extends Layer
 * @implements ITileLayer
 * @category Layer
 */
export abstract class BaseTileLayer extends Layer implements ITileLayer {
    /**
     * Whether the layer is a tile layer.
     * 是否为瓦片图层。
     * @readonly
     */
    public readonly isTileLayer = true;

    /**
     * Layer type identifier.
     * 图层类型标识符。
     * @readonly
     */
    public readonly layerType: string = "base";

    /**
     * Whether it is a base layer (background map).
     * 是否是底图。
     * @readonly
     */
    public readonly isBaseLayer = false; // Whether it is base layer 是否是底图
    
    protected _enabled: boolean = true;
    protected _visible: boolean = true;
    
    /**
     * Root tile instance.
     * 根瓦片实例。
     * @protected
     */
    protected _rootTile: Tile; // Root tile instance 根瓦片实例

    /**
     * Loader instance.
     * 加载器实例。
     * @protected
     */
    protected _loader: ICompositeLoader; // Loader instance 加载器实例
    
    private _LODThreshold = 1;

    /**
     * Whether it is a scene layer (e.g. 3D objects).
     * 是否是场景图层。
     * @readonly
     */
    public readonly isSceneLayer = false;

    /**
     * Layer opacity.
     * 图层透明度。
     */
    public opacity: number = 1;
    
    // Public properties
    // 公共属性

    /**
     * Layer data source(s).
     * 图层数据源。
     * @readonly
     */
    public readonly source: ISource | ISource[];

    /**
     * Layer projection.
     * 图层投影。
     * @readonly
     */
    public readonly projection: IProjection;

    /**
     * Minimum zoom level.
     * 最小缩放级别。
     */
    public minLevel: number = 2;

    /**
     * Maximum zoom level.
     * 最大缩放级别。
     */
    public maxLevel: number = 19;

    /**
     * Create a new BaseTileLayer instance.
     * 创建一个新的 BaseTileLayer 实例。
     * 
     * @param layerId Unique layer identifier. 图层唯一标识符。
     * @param options Layer configuration options. 图层配置选项。
     */
    constructor(
        public readonly layerId: string,
        options: BaseTileLayerOptions // Merge all parameters into one config object 合并所有参数为一个配置对象
    ) {
        super(layerId, options);
        
        // Initialize properties
        // 初始化属性
        this.source = options.source;
        this.projection = options.projection;
        this.minLevel = options.minLevel ?? 2;
        this.maxLevel = options.maxLevel ?? 19;
        this._LODThreshold = options.LODThreshold ?? 1;
        this.opacity = options.opacity ?? 1;

        // this.up.set(0, 0, 1);
        this.name = `Layer-${layerId}`;
        
        // Create loader
        // 创建加载器
        this._loader = this.createLoader();
        
        // Create root tile
        // 创建根瓦片
        this._rootTile = new Tile();
        this._rootTile.matrixAutoUpdate = true;
        // this._rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, this.projection.mapDepth);
        // console.log(this.projection.mapWidth, this.projection.mapHeight, 100000);
        this._rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, 1);
        this.add(this._rootTile);
        this._rootTile.updateMatrix();
        this.layerId = layerId;
        
        if (this.name === 'Layer-label-layer') {
            // alert('标签图层')
            this.position.set(0, 0, 1);
        }
        // this._rootTile.updateMatrixWorld(true);
        // this.position.set(0, 0, 1000);
    }

    /**
     * Get LOD threshold.
     * 获取LOD阈值
     * 
     * @returns {number} The current LOD threshold. 当前 LOD 阈值。
     */
    public get LODThreshold() {
        return this._LODThreshold;
    }
    
    /**
     * Set LOD threshold.
     * 设置LOD阈值
     * 
     * @param value Recommended value between 1-2. Smaller values mean higher detail. 建议取值1-2之间。值越小细节越高。
     */
    public set LODThreshold(value) {
        this._LODThreshold = value;
    }

    /**
     * Get the tile loader instance.
     * 获取瓦片加载器实例。
     */
    get loader(): ICompositeLoader {
        return this._loader;
    }

    /**
     * Create the tile loader for this layer.
     * 创建此图层的瓦片加载器。
     * 
     * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
     * @protected
     * @abstract
     */
    protected abstract createLoader(): ICompositeLoader;

    // ITileLayer interface implementation
    // ITileLayer 接口实现

    /**
     * Get layer enabled state.
     * 获取图层启用状态。
     */
    get enabled(): boolean { return this._enabled; }
    
    /**
     * Set layer enabled state.
     * 设置图层启用状态。
     * 
     * @param value True to enable, false to disable. True 启用，False 禁用。
     */
    set enabled(value: boolean) {
        this._enabled = value;
        if (this._rootTile) {
            this._rootTile.visible = value && this._visible;
        }
    }

    /**
     * Get layer internal visibility.
     * 获取图层内部可见性。
     * 
     * @description 
     * Combines layer specific visibility with base class visibility.
     * 结合图层特定可见性和基类可见性。
     */
    get ivisible(): boolean {
        return this._visible && super._visible; // Combine with base class visible 结合基类的 visible
    }

    /**
     * Set layer internal visibility.
     * 设置图层内部可见性。
     */
    set ivisible(value: boolean) {
        this._visible = value;
        if (this._rootTile) {
            this._rootTile.visible = value && this._enabled;
        }
    }

    /**
     * Update the layer.
     * 更新图层。
     * 
     * @description
     * Called every frame to update the tile tree based on the camera.
     * 每帧调用以根据相机更新瓦片树。
     * 
     * @param camera The camera used for rendering. 用于渲染的相机。
     */
    public update(camera: Camera): void {
        // console.log('更新图层tile');
        if (!this._enabled || !this._visible) {
            // console.log(`❌ 图层 ${this.layerId} 被禁用或不可见`);
            return;
        }

        // console.group(`🔄 更新图层: ${this.layerId}`);
        // console.log("📊 图层状态:", {
        //     启用: this._enabled,
        //     可见: this._visible,
        //     根瓦片存在: !!this._rootTile,
        //     加载器存在: !!this._loader
        // });

        try {
            // Check root tile transform matrix
            // 检查根瓦片变换矩阵
            // console.log("📐 根瓦片变换:", {
            //     位置: this._rootTile.position.toArray(),
            //     缩放: this._rootTile.scale.toArray(),
            //     矩阵更新: this._rootTile.matrixAutoUpdate
            // });
           
            // Call tile update
            // 调用瓦片更新
            this.updateMatrixWorld(true);
            this._rootTile.update({
                camera,
                loader: this._loader,
                minLevel: this.minLevel,
                maxLevel: this.maxLevel,
                LODThreshold: this.LODThreshold
            });

            // Check tile tree status
            // 检查瓦片树状态
            // this._debugTileTree();

        } catch (error) {
            // console.error(`💥 图层更新错误:`, error);
        }
        console.groupEnd();
    }

    // @ts-ignore
    private _debugTileTree(): void {
        let totalTiles = 0;
        let loadedTiles = 0;
        let visibleTiles = 0;
        let inFrustumTiles = 0;

        this._rootTile.traverse(tile => {
            if (tile.isTile) {
                totalTiles++;
                if (tile.loaded) loadedTiles++;
                if (tile.visible) visibleTiles++;
                if (tile.inFrustum) inFrustumTiles++;

                if (tile.loaded) {
                    // console.log(`  瓦片 ${tile.z}-${tile.x}-${tile.y}:`, {
                    //     已加载: tile.loaded,
                    //     显示中: tile.showing,
                    //     在视锥内: tile.inFrustum,
                    //     几何体: tile.geometry ? `顶点数: ${tile.geometry.attributes.position?.count || 0}` : '无',
                    //     材质: tile.material.length
                    // });
                }
            }
        });

        // console.log("📈 瓦片统计:", {
        //     总数: totalTiles,
        //     已加载: loadedTiles,
        //     可见: visibleTiles,
        //     在视锥内: inFrustumTiles
        // });
    }

    /**
     * Get LOD threshold - Missing function implementation.
     * 获取LOD阈值 - 缺失的函数实现
     * @description Control threshold for tile detail level. 控制瓦片细节级别的阈值
     * @returns {number} LOD threshold, smaller value means easier to trigger subdivision. LOD阈值，值越小越容易触发瓦片细分。
     */
    protected _getLODThreshold(): number {
        // 默认返回1.0，可以根据图层类型调整
        return 1.0;
    }

    /**
     * Get current max loaded tile level (for debugging).
     * 获取当前显示的瓦片层级（用于调试）。
     * @private
     */
    // @ts-ignore
    private _getCurrentTileLevel(): string {
        let maxLevel = 0;
        this._rootTile.traverse(tile => {
            if (tile.isTile && tile.loaded) {
                maxLevel = Math.max(maxLevel, tile.z);
            }
        });
        return `最大层级: ${maxLevel}`;
    }

    // 将dispose和reload改为具体实现
    
    /**
     * Dispose the layer and resources.
     * 销毁图层和资源。
     * 
     * @description
     * Removes the root tile and cleans up resources.
     * 移除根瓦片并清理资源。
     */
    dispose(): void {
        this.remove(this._rootTile);
        this._rootTile.reload(this._loader);
    }

    /**
     * Reload the layer data.
     * 重新加载图层数据。
     */
    reload(): void {
        this._rootTile.reload(this._loader);
    }

    /**
     * Set the base elevation of the layer.
     * 设置图层整体抬高。
     * 
     * @param elevation The elevation value. 抬高高度。
     */
    public setElevation(elevation: number): void {
        this.position.y = elevation;
        // 如果需要更新矩阵
        this.updateMatrix();
        this.updateMatrixWorld(true);
    }

    /**
     * Raise the layer elevation by a delta.
     * 在现有基础上增加抬高。
     * 
     * @param delta The elevation difference to add. 增加的高度。
     */
    public raiseElevation(delta: number): void {
        this.position.z += delta;
        this.updateMatrix();
        this.updateMatrixWorld(true);
    }

    /**
     * Get current layer elevation.
     * 获取当前高程。
     * 
     * @returns {number} The current elevation (y-coordinate). 当前高程（y坐标）。
     */
    public getElevation(): number {
        return this.position.y;
    }
}