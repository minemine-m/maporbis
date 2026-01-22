import { Camera } from "three";
// import { TileSource } from "../../sources";
import { BaseTileLayer, BaseTileLayerOptions } from "./TileLayer";
import { CompositeTileLoader, ICompositeLoader } from "../../loaders";
import { Tile } from "../../core/tile";
import { Feature } from "../../feature/Feature";
import { VectorTileRenderLayer } from "./renderer/VectorTileRenderLayer";

/**
 * Vector Tile Layer configuration interface.
 * 矢量瓦片图层配置接口
 * 
 * @description
 * Configuration options for creating a VectorTileLayer.
 * 用于创建 VectorTileLayer 的配置选项。
  * @category Layer
 */
export interface VectorTileLayerOptions extends BaseTileLayerOptions {
    /**
     * Vector style configuration (Required).
     * 矢量样式配置（必需）。
     */
    style: any; // Vector style configuration (Required) 矢量样式配置（必需）

    /**
     * Feature filter function (Optional).
     * 要素过滤器（可选）。
     */
    featureFilter?: (feature: any) => boolean; // Feature filter (Optional) 要素过滤器（可选）

    /**
     * Whether to enable collision detection (Optional).
     * 是否进行碰撞检测（可选）。
     * @default false
     */
    collision?: boolean; // Whether to enable collision detection (Optional) 是否进行碰撞检测（可选）
}

/**
 * Vector Tile Layer.
 * 矢量瓦片图层
 * 
 * @description 
 * Layer specialized for displaying vector data, responsible for loading and distributing tile data.
 * Features rendering and lifecycle are managed by VectorTileRenderLayer.
 * 
 * 专门用于显示矢量数据的图层，负责瓦片数据的加载和分发。
 * Features 的渲染和生命周期由 VectorTileRenderLayer 管理。
  * @category Layer
 */
export class VectorTileLayer extends BaseTileLayer {
    /**
     * Layer type identifier.
     * 图层类型标识符。
     * @readonly
     */
    public readonly layerType: string = "vector";

    /**
     * Store tile data references for data query, does not store Features.
     * 存储瓦片数据引用，用于数据查询，不存储 Features。
     * @private
     */
    private _tileDataMap: Map<string, any> = new Map();

    /**
     * Container/Logic layer for rendering Features, inherits from OverlayLayer.
     * 渲染 Feature 的容器/逻辑层，继承自 OverlayLayer。
     * @private
     */
    private _renderer!: VectorTileRenderLayer;

    // Vector layer specific properties
    // 矢量图层特有属性
    private _style: any;
    // private _featureFilter?: (feature: any) => boolean;

    // Compatible with OverlayLayer properties (if needed)
    // 兼容 OverlayLayer 属性 (如果需要)
    _feaList: Feature[] = [];
    _collision: boolean = false;
    private _renderAltitude: number = 0; // Rendering altitude 渲染高度
    // private _levelOffset = 2;
    // private _minLevelFloor = 5;   // Don't go below level 8, adjust according to scene 不要低于8级，按你场景自己调
    // public readonly type: string = "vector";

    /**
     * Create a new VectorTileLayer instance.
     * 创建一个新的 VectorTileLayer 实例。
     * 
     * @param id Unique layer identifier. 图层唯一标识符。
     * @param options Layer configuration options. 图层配置选项。
     */
    constructor(
        id: string,
        options: VectorTileLayerOptions
    ) {
        super(id, options);
        // Set altitude to 0
        // 设置高度为0
        // Initialize vector layer specific properties
        // 初始化矢量图层特有属性
        if (!options.style) {
            throw new Error("VectorTileLayer must provide style configuration! VectorTileLayer 必须提供样式配置");
        }
        this._style = options.style;
        this._collision = options.collision || false;
        this._featureFilter = options.featureFilter;
        this._renderAltitude = options.altitude || 0;
        // 🔥 Critical: Set root tile to data mode (no Three.js geometry rendering)
        // 🔥 关键：设置根瓦片为数据模式 (不进行 Three.js 几何体渲染)
        (this as any)._rootTile.setDataOnlyMode(true);

        // Listen for new tile creation, automatically set to data mode
        // 监听新创建的瓦片，自动设置为数据模式
        this._setupDataModeAndListenersForChildren();

        // Listen for data load and unload events, and forward to Renderer
        // 监听数据加载和卸载事件，并转发给 Renderer
        this._setupLifeCycleListeners();
    }

    // private _computeDynamicMinLevel(): number {
    //     let currentLevel = 0;
    //
    //     this._rootTile.traverse(tile => {
    //         if ((tile as any).isTile && (tile as any).loaded && (tile as any).inFrustum) {
    //             currentLevel = Math.max(currentLevel, tile.z);
    //         }
    //     });
    //
    //     if (currentLevel === 0) {
    //         // Initial stage with few tiles, fallback to configured minLevel
    //         // 初始阶段还没什么瓦片，退回配置里的 minLevel
    //         return this.minLevel;
    //     }
    //
    //     const desired = currentLevel - this._levelOffset;
    //     return Math.max(this._minLevelFloor, Math.min(desired, this.maxLevel));
    // }

    /**
     * Create the tile loader for this layer.
     * 创建此图层的瓦片加载器。
     * 
     * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
     * @protected
     */
    protected createLoader(): ICompositeLoader {
        const loader = new CompositeTileLoader();
        
        // Set vector tile source
        // 设置矢量瓦片数据源
        if (Array.isArray(this.source)) {
            // Usually vector layer has one source, but if array, take first or handle logic
            // 通常矢量图层有一个数据源，如果是数组，取第一个或处理逻辑
            loader.vtSource = this.source[0];
        } else {
            loader.vtSource = this.source;
        }

        return loader;
    }

    /**
    * Set all child tiles to data mode and add necessary event listeners to them.
    * 设置所有子瓦片为数据模式，并为它们添加必要的事件监听器
    */
    private _setupDataModeAndListenersForChildren(): void {
        const setupTile = (tile: Tile) => {
            if (tile !== this._rootTile) {
                tile.setDataOnlyMode(true);
            }
            // Add tile-hidden listener to tile
            // 为瓦片添加 tile-hidden 监听器
            // // this._addHiddenListenerToTile(tile);
            // this._addHiddenListenerToTile(tile);
            // Add shown listener to supplement render cached data
            // 添加显示监听，补渲染缓存数据
            this._addShownListenerToTile(tile);
            // Add unload listener to thoroughly clean up vector features of that tile
            // 添加卸载监听，彻底清理该 tile 的矢量要素
            this._addUnloadListenerToTile(tile);
        };

        // Listen for new tile creation event
        // 监听新瓦片创建事件
        this._rootTile.addEventListener('tile-created', (event: any) => {
            const newTile = event.tile;
            setupTile(newTile);
        });

        // Traverse existing child tiles (if any)
        // 遍历现有子瓦片（如果有的话）
        this._rootTile.traverse(tile => {
            if ((tile as any).isTile) {
                setupTile(tile);
            }
        });
    }
    private _addShownListenerToTile(tile: Tile): void {
        const listener = (event: any) => {
            const shownTile: Tile = event.tile;
            const tileKey = `${shownTile.z}-${shownTile.x}-${shownTile.y}`;

            // Leaf tile's own shown does not trigger supplement render to avoid flickering
            // 叶子瓦片自己的 shown 不触发补渲染，避免闪烁
            // if (shownTile.isLeaf) {
            //     return;
            // }

            const hasRenderer = !!this._renderer;
            const cached = this._tileDataMap.get(tileKey);
            // const hasData = !!cached;

            // let beforeCount = 0;
            // if (hasRenderer) {
            //     const featureMap = (this._renderer as any)._tileFeatureMap as Map<string, any[]>;
            //     const list = featureMap?.get(tileKey);
            //     beforeCount = list ? list.length : 0;
            // }

            // console.log(
            //     `[VectorTileLayer] tile-shown ${tileKey} ` +
            //     `showing=${shownTile.showing}, loaded=${shownTile.loaded}, ` +
            //     `hasData=${hasData}, beforeFeatures=${beforeCount}`
            // );
            // console.log('tile-shown', tile.z, tile.x, tile.y);

            if (!hasRenderer) {
                // console.warn(`Vector tile renderer tile-shown ${tileKey} not ready yet 矢量瓦片渲染器 tile-shown ${tileKey} 还没准备好`);
                return;
            }

            if (!cached) {
                // console.warn(`Vector tile renderer tile-shown ${tileKey} has no cached data 矢量瓦片渲染器 tile-shown ${tileKey} 没有缓存数据`);
                return;
            }

            // Supplement render using cached data
            // 利用缓存数据补渲染
            this._renderer.processTileData(shownTile, cached.data);

            // let afterCount = 0;
            // const featureMap = (this._renderer as any)._tileFeatureMap as Map<string, any[]>;
            // const list = featureMap?.get(tileKey);
            // afterCount = list ? list.length : 0;

            // console.log(
            //     `Vector tile layer tile-shown ${tileKey} supplement render count 矢量瓦片图层 tile-shown ${tileKey} 补充渲染数量, ` +
            //     `${afterCount}`
            // );
        };
        tile.addEventListener('tile-shown', listener);
    }
    private _addUnloadListenerToTile(tile: Tile): void {
        const listener = (event: any) => {
            // For this.dispatchEvent({ type: "unload" }); in _unLoad
            // event.target is the tile being unloaded
            // 对于 _unLoad 里的 this.dispatchEvent({ type: "unload" });
            // event.target 就是当前被卸载的 tile
            const t: Tile = (event.tile as Tile) || (event.target as Tile);
            const tileKey = `${t.z}-${t.x}-${t.y}`;

            // console.log('[VectorTileLayer] tile unload', tileKey);

            if (this._renderer) {
                try {
                    this._renderer.removeFeaturesByTileKey(tileKey);
                } catch (e) {
                    // console.error('[VectorTileLayer] Error removing features for tile', tileKey, e);
                }
            }
            this._tileDataMap.delete(tileKey);
        };
        tile.addEventListener('unload', listener);
    }


    /**
     * Set layer altitude.
     * 设置图层高度 (海拔)。
     * 
     * @param altitude Altitude value. 高度值。
     * @description 
     * Modify layer position in vertical direction.
     * 修改图层在垂直方向上的位置。
     */
    setAltitude(altitude: number) {
        // Logic layer: always set parent altitude to 0
        // 逻辑层：总是设置父类altitude为0
        super.setAltitude(0);
        this._renderAltitude = altitude;
        // Render layer: use actual altitude
        // 渲染层：用实际的altitude
        if (this._renderer) {
            this._renderer.setAltitude(altitude);
        }

        return this;
    }

    /**
     * Get current layer altitude.
     * 获取当前图层高度。
     * 
     * @returns {number} Altitude value. 高度值。
     */
    getAltitude(): number {
        return this._renderAltitude;
    }
    /**
     * Add tile-hidden event listener for a single tile.
     * 为单个瓦片添加 tile-hidden 事件监听器
     * @param tile
     * @private
     */
   //@ts-ignore
    private _addHiddenListenerToTile(tile: Tile): void {
        const listener = (event: any) => {
            const hiddenTile: Tile = event.tile;
            const tileKey = `${hiddenTile.z}-${hiddenTile.x}-${hiddenTile.y}`;

            // Leaf tile's hidden does not trigger vector hide/show to avoid flickering caused by frequent hide/show
            //  叶子瓦片的 hidden 不做矢量显隐，避免频繁 hide/show 导致闪烁
            // if (hiddenTile.isLeaf) {
            //     return;
            // }
            // const hasRenderer = !!this._renderer;
            // let beforeCount = 0;
            //
            // if (hasRenderer) {
            //     const featureMap = (this._renderer as any)._tileFeatureMap as Map<string, any[]>;
            //     const list = featureMap?.get(tileKey);
            //     beforeCount = list ? list.length : 0;
            // }

            // console.log(
            //     `[VectorTileLayer] tile-hidden ${tileKey} ` +
            //     `showing=${hiddenTile.showing}, loaded=${hiddenTile.loaded}, ` +
            //     `beforeFeatures=${beforeCount}`
            // );

            if (this._renderer) {
                try {
                    this._renderer.hideFeaturesByTileKey(tileKey);

                    // let afterCount = 0;
                    // const featureMap = (this._renderer as any)._tileFeatureMap as Map<string, any[]>;
                    // const list = featureMap?.get(tileKey);
                    // afterCount = list ? list.length : 0;

                    // console.log('tile-hidden', tile.z, tile.x, tile.y);
                } catch (e) {
                    // console.error(`[VectorTileLayer] Error hiding features for tile ${tileKey}:`, e);
                }
            }

            // Note: Do not clear _tileDataMap here temporarily, to avoid losing opportunity for supplement render
            // 注意：这里暂时不要清理 _tileDataMap，避免失去补渲染的机会
            // const hadData = this._tileDataMap.has(tileKey);
            // this._tileDataMap.delete(tileKey);
            // console.log(`[VectorTileLayer] Removed data reference for hidden tile ${tileKey}, hadData=${hadData}.`);
        };
        tile.addEventListener('tile-hidden', listener);
    }
    /**
     * Unified lifecycle listener management, responsible for data and renderer linkage.
     * 统一管理生命周期监听，负责数据和渲染器的联动
    */
    private _setupLifeCycleListeners(): void {

        // --- Tile loaded event ---
        // ---  瓦片加载完成事件 ---
        // This event is dispatched on rootTile
        // 此事件是在 rootTile 上派发的
        this._rootTile.addEventListener('tile-loaded', (event: any) => {
            const tile: Tile = event.tile;
            const tileKey = `${tile.z}-${tile.x}-${tile.y}`;
            // console.log(`Vector tile layer Tile ${tileKey} triggered loaded event. 矢量瓦片图层 Tile ${tileKey} 触发了loaded事件。`);
            const vectorData = this.getVectorDataFromTile(tile);
            if (!vectorData) {
                console.warn(`[VectorTileLayer] Tile ${tileKey} loaded but has no vector data.`);
                return;
            }
            if (vectorData.vectorData?.dataFormat === 'mvt') {
                // console.log(`Vector tile layer Tile ${tileKey} loaded MVT data. 矢量瓦片图层 Tile ${tileKey} 加载了 MVT 数据。`);
                this._tileDataMap.set(tileKey, {
                    data: vectorData,
                    tile,
                    timestamp: Date.now(),
                    pending: false // Whether to render 是否渲染
                });
            }
            // ② Render directly in tile-loaded stage only if tile is currently showing
            // ② 只有当前就处于 showing 的瓦片，才在 tile-loaded 阶段直接渲染
            if (tile.showing && this._renderer && vectorData.vectorData?.dataFormat === 'mvt') {
                try {
                    this._renderer.processTileData(tile, vectorData);
                    // console.log(`[VectorTileLayer] Sent data to renderer for visible tile ${tileKey}.`);
                } catch (e) {
                    // console.error(`[VectorTileLayer] Error processing data for tile ${tileKey}:`, e);
                }
            } else {
                // console.warn(
                //     `[VectorTileLayer] Skip immediate render for tile ${tileKey}, ` +
                //     `showing=${tile.showing}, hasRenderer=${!!this._renderer}, ` +
                //     `format=${vectorData.vectorData?.dataFormat}`
                // );
            }
            // console.log(`All cached in loaded: loaed里所有的缓存:`, this._tileDataMap);
        });


    }


    /**
     * Extract vector data from tile geometry.
     * 从瓦片几何体中提取矢量数据
     */
    private getVectorDataFromTile(tile: Tile): any {
        if (!(tile as any).geometry || !tile.getVectorData()) {
            return null;
        }
        return tile.getVectorData();
    }


    // --- Public data access methods ---
    // --- 公开数据访问方法 ---

    /**
     * Get currently visible vector tile data.
     * 获取当前可见的矢量瓦片数据。
     * 
     * @returns {Array<{ tileKey: string, data: any, tile: Tile }>} Array of visible tile data. 可见瓦片数据的数组。
     */
    public getVisibleVectorTiles(): Array<{ tileKey: string, data: any, tile: Tile }> {
        const result: Array<{ tileKey: string, data: any, tile: Tile }> = [];

        this._rootTile.traverse(tile => {
            if ((tile as any).isTile && (tile as any).loaded && (tile as any).inFrustum) {
                const tileKey = `${tile.z}-${tile.x}-${tile.y}`;
                const tileData = this._tileDataMap.get(tileKey);
                if (tileData) {
                    result.push({
                        tileKey,
                        data: tileData.data,
                        tile: tileData.tile
                    });
                }
            }
        });

        return result;
    }

    /**
     * Get all loaded vector data.
     * 获取所有已加载的矢量数据。
     * 
     * @returns {Map<string, any>} Map of all loaded vector data. 所有已加载矢量数据的 Map。
     */
    public getAllVectorData(): Map<string, any> {
        return new Map(this._tileDataMap);
    }

    /**
     * Get specific tile data by coordinates.
     * 根据坐标获取特定瓦片数据。
     * 
     * @param x Tile X coordinate. 瓦片 X 坐标。
     * @param y Tile Y coordinate. 瓦片 Y 坐标。
     * @param z Tile Z coordinate (zoom level). 瓦片 Z 坐标（缩放级别）。
     * @returns {any} The vector data for the tile, or null if not found. 瓦片的矢量数据，如果未找到则为 null。
     */
    public getVectorData(x: number, y: number, z: number): any {
        const tileKey = `${z}-${x}-${y}`;
        const tileData = this._tileDataMap.get(tileKey);
        return tileData ? tileData.data : null;
    }

    // --- Feature Style and Filter ---
    // --- Feature 样式和过滤 ---

    /**
     * Set feature filter.
     * 设置要素过滤器。
     * 
     * @param filter Filter function that returns true to keep the feature. 返回 true 以保留要素的过滤函数。
     */
    public setFeatureFilter(filter: (feature: any) => boolean): void {
        this._featureFilter = filter;
        // Notify renderer to re-render or apply filter
        // 通知 renderer 重新渲染或应用过滤
        if (this._renderer) {
            this._renderer.setFeatureFilter(filter);
        }
    }

    /**
     * Clear feature filter.
     * 清除要素过滤器。
     */
    public clearFeatureFilter(): void {
        this._featureFilter = undefined;
        // Notify renderer
        // 通知 renderer
        if (this._renderer) {
            this._renderer.clearFeatureFilter();
        }
    }

    /**
     * Set layer opacity.
     * 设置图层透明度。
     * 
     * @param opacity Opacity value (0-1). 透明度值 (0-1)。
     */
    public setOpacity(opacity: number): void {
        this.opacity = opacity;
        // Forward to renderer
        // 转发给 renderer
        if (this._renderer) {
            this._renderer.setOpacity(opacity);
        }
    }

    // --- Framework Lifecycle ---
    // --- 框架生命周期 ---

    /**
     * Update layer - Override to add vector specific logic.
     * 更新图层 - 重写以添加矢量特定逻辑。
     * 
     * @param camera The camera used for rendering. 用于渲染的相机。
     */
    public update(camera: Camera): void {
        if (!this.enabled || !this.visible) return;
        super.update(camera);
        // Ensure renderer also updates (e.g. recalculate Features positions)
        // 确保 renderer 也更新（例如重新计算 Features 位置）
        // if (this._renderer) {
        //     this._renderer.update(camera);
        // }
    }

    /**
     * Override dispose method to clean up vector data.
     * 重写dispose方法，清理矢量数据。
     */
    public dispose(): void {
        // Notify renderer to clean up all Features
        // 通知 renderer 清理所有 Features
        if (this._renderer) {
            this._renderer.dispose();
        }
        super.dispose();
    }
    _setRenderer(renderer: VectorTileRenderLayer) {
        this._renderer = renderer;
    }

    _getRenderer() {
        return this._renderer || null;
    }

    getStyle() {
        return this._style;
    }
}