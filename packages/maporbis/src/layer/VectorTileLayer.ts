import { Camera } from "three";
// import { TileSource } from "../../sources";
import { BaseTileLayer, BaseTileLayerOptions } from "./TileLayer/TileLayer";
import { CompositeTileLoader } from "../loaders/CompositeTileLoader";
import { ICompositeLoader } from "../loaders/LoaderInterfaces";
import { Tile } from "../core/tile";
import { Feature } from "../feature";
import { VectorTileRenderLayer } from "./VectorTileRenderLayer";

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

    /**
     * Whether to use Web Worker for tile processing (Optional).
     * 是否使用 Web Worker 处理瓦片（可选）。
     * @default false
     */
    useWorker?: boolean; // Use Web Worker for off-thread processing 使用 Web Worker 进行线程外处理

    /**
     * Create per-feature proxy objects for picking (default false = mesh-only).
     * 是否创建逐要素代理（默认 false，只保留分桶 Mesh）。
     */
    createFeatureProxies?: boolean;
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
    private _useWorker: boolean = true;

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
        this._useWorker = options.useWorker ?? true;
        // Vector layer owns the ideal covering set (raster layers must not)
        this._idealRetain = true;
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

    /**
     * Override _bindMap to automatically initialize VectorTileRenderLayer.
     * 重写 _bindMap 以自动初始化 VectorTileRenderLayer。
     * @param mapInstance Map instance
     */
    _bindMap(mapInstance: any): void {
        // Call parent implementation
        // 调用父类实现
        super._bindMap(mapInstance);

        // If renderer not initialized yet and map is available, create renderer
        // 如果渲染器还未初始化且地图可用，则创建渲染器
        if (!this._renderer && mapInstance) {
            const baseOptions = (this as any).options || {};
            const vtrenderer = new VectorTileRenderLayer(this.layerId + '-vtrender', {
                altitude: this.getAltitude(),
                paint: this._style,
                collision: this._collision,
                zIndex: typeof baseOptions.zIndex === 'number' ? baseOptions.zIndex : undefined,
                depthOffset: typeof baseOptions.depthOffset === 'number' ? baseOptions.depthOffset : undefined,
                createFeatureProxies: baseOptions.createFeatureProxies ?? false,
            });
            this._renderer = vtrenderer;

            // Add renderer to map's layer group
            if (mapInstance._layerGroup) {
                mapInstance._layerGroup.add(vtrenderer);
                vtrenderer._bindMap(mapInstance);
            }
        }
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
    * Set all child tiles to data mode and wire SourceCache lifecycle events.
    * 设置所有子瓦片为数据模式，并挂 SourceCache 生命周期事件。
    */
    private _setupDataModeAndListenersForChildren(): void {
        const setupTile = (tile: Tile) => {
            if (tile !== this._rootTile) {
                tile.setDataOnlyMode(true);
            }
        };

        // Event bus is SourceCache (not root Tile).
        this.sourceCache.addEventListener('tile-created', (event: any) => {
            const newTile = event.tile;
            if (newTile?.isTile) setupTile(newTile);
        });

        this._rootTile.traverse(tile => {
            if ((tile as any).isTile) {
                setupTile(tile);
            }
        });

        this.sourceCache.addEventListener('tile-shown', (event: any) => {
            this._onVectorTileShown(event.tile as Tile);
        });
        this.sourceCache.addEventListener('tile-hidden', (event: any) => {
            this._onVectorTileHidden(event.tile as Tile);
        });
        this.sourceCache.addEventListener('tile-unload', (event: any) => {
            this._onVectorTileUnload(event.tile as Tile);
        });
    }

    private _onVectorTileShown(shownTile: Tile): void {
        if (!shownTile?.isTile) return;
        const tileKey = `${shownTile.z}-${shownTile.x}-${shownTile.y}`;
        const hasRenderer = !!this._renderer;
        const cached = this._tileDataMap.get(tileKey);
        if (!hasRenderer || !cached) return;
        if (this._useWorker) {
            this._renderer.processTileDataAsync(shownTile, cached.data);
        } else {
            this._renderer.processTileData(shownTile, cached.data);
        }
    }

    private _onVectorTileHidden(hiddenTile: Tile): void {
        if (!hiddenTile?.isTile || !this._renderer) return;
        const tileKey = `${hiddenTile.z}-${hiddenTile.x}-${hiddenTile.y}`;
        try {
            this._renderer.hideFeaturesByTileKey(tileKey);
        } catch {
            /* ignore */
        }
        // Keep _tileDataMap for supplement render on next shown.
    }

    private _onVectorTileUnload(t: Tile): void {
        if (!t?.isTile) return;
        const tileKey = `${t.z}-${t.x}-${t.y}`;
        if (this._renderer) {
            try {
                this._renderer.removeFeaturesByTileKey(tileKey);
            } catch {
                /* ignore */
            }
        }
        this._tileDataMap.delete(tileKey);
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
     * Unified lifecycle listener management, responsible for data and renderer linkage.
     * 统一管理生命周期监听，负责数据和渲染器的联动
    */
    private _setupLifeCycleListeners(): void {
        // Events come from SourceCache (public bus), not root Tile.
        this.sourceCache.addEventListener('tile-loaded', (event: any) => {
            const tile: Tile = event.tile;
            const tileKey = `${tile.z}-${tile.x}-${tile.y}`;
            const vectorData = this.getVectorDataFromTile(tile);
            if (!vectorData) {
                console.warn(`[VectorTileLayer] Tile ${tileKey} loaded but has no vector data.`);
                return;
            }
            const fmt = vectorData.vectorData?.dataFormat;
            if (fmt === 'mvt' || fmt === 'mvt-local') {
                this._tileDataMap.set(tileKey, {
                    data: vectorData,
                    tile,
                    timestamp: Date.now(),
                    pending: false
                });
            }
            if (this._renderer && (fmt === 'mvt' || fmt === 'mvt-local')) {
                try {
                    if (this._useWorker) {
                        this._renderer.processTileDataAsync(tile, vectorData);
                    } else {
                        this._renderer.processTileData(tile, vectorData);
                    }
                } catch (e) {
                    // ignore
                }
            }
        });
    }


    /**
     * Extract vector data from tile geometry.
     * 从瓦片几何体中提取矢量数据
     */
    private getVectorDataFromTile(tile: Tile): any {
        // Prefer payload.vectorData; Mesh geometry is not the vector carrier.
        if (tile.payload?.vectorData) {
            return tile.payload.vectorData;
        }
        if (!tile.getVectorData()) {
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
     * Set paint configuration.
     * 设置样式配置。
     * @param style Style configuration (PaintRule[]). 样式配置 (PaintRule[])。
     */
    public setPaint(style: any[]): void {
        this._style = style;
        if (this._renderer) {
            this._renderer.setPaint(style);
            // Re-render visible tiles
            this._refreshVisibleTiles();
        }
    }

    /**
     * Update symbol for specific rule.
     * 更新指定规则的符号。
     * @param index Rule index. 规则索引。
     * @param symbol New symbol configuration. 新的符号配置。
     */
    public updateSymbol(index: number, symbol: any): void {
        if (this._renderer) {
            this._renderer.updateSymbol(index, symbol);
            this._refreshVisibleTiles();
        }
    }

    /**
     * Refresh visible tiles by re-sending data to renderer.
     * 通过向渲染器重新发送数据来刷新可见瓦片。
     * @private
     */
    private _refreshVisibleTiles(): void {
        if (!this._renderer) return;
        
        this._rootTile.traverse((tile) => {
             if ((tile as any).isTile && (tile as any).loaded && (tile as any).showing) {
                 const tileKey = `${tile.z}-${tile.x}-${tile.y}`;
                 const entry = this._tileDataMap.get(tileKey);
                 if (entry) {
                     if (this._useWorker) {
                         this._renderer.processTileDataAsync(tile, entry.data);
                     } else {
                         this._renderer.processTileData(tile, entry.data);
                     }
                 }
             }
        });
    }

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