import { Camera } from "three";
import { BaseTileLayer, BaseTileLayerOptions } from "./TileLayer/TileLayer";
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
    style: any;
    /**
     * Feature filter function (Optional).
     * 要素过滤器（可选）。
     */
    featureFilter?: (feature: any) => boolean;
    /**
     * Whether to enable collision detection (Optional).
     * 是否进行碰撞检测（可选）。
     * @default false
     */
    collision?: boolean;
    /**
     * Whether to use Web Worker for tile processing (Optional).
     * 是否使用 Web Worker 处理瓦片（可选）。
     * @default false
     */
    useWorker?: boolean;
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
export declare class VectorTileLayer extends BaseTileLayer {
    /**
     * Layer type identifier.
     * 图层类型标识符。
     * @readonly
     */
    readonly layerType: string;
    /**
     * Store tile data references for data query, does not store Features.
     * 存储瓦片数据引用，用于数据查询，不存储 Features。
     * @private
     */
    private _tileDataMap;
    /**
     * Container/Logic layer for rendering Features, inherits from OverlayLayer.
     * 渲染 Feature 的容器/逻辑层，继承自 OverlayLayer。
     * @private
     */
    private _renderer;
    private _style;
    private _useWorker;
    _feaList: Feature[];
    _collision: boolean;
    private _renderAltitude;
    /**
     * Create a new VectorTileLayer instance.
     * 创建一个新的 VectorTileLayer 实例。
     *
     * @param id Unique layer identifier. 图层唯一标识符。
     * @param options Layer configuration options. 图层配置选项。
     */
    constructor(id: string, options: VectorTileLayerOptions);
    /**
     * Override _bindMap to automatically initialize VectorTileRenderLayer.
     * 重写 _bindMap 以自动初始化 VectorTileRenderLayer。
     * @param mapInstance Map instance
     */
    _bindMap(mapInstance: any): void;
    /**
     * Create the tile loader for this layer.
     * 创建此图层的瓦片加载器。
     *
     * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
     * @protected
     */
    protected createLoader(): ICompositeLoader;
    /**
    * Set all child tiles to data mode and add necessary event listeners to them.
    * 设置所有子瓦片为数据模式，并为它们添加必要的事件监听器
    */
    private _setupDataModeAndListenersForChildren;
    private _addShownListenerToTile;
    private _addUnloadListenerToTile;
    /**
     * Set layer altitude.
     * 设置图层高度 (海拔)。
     *
     * @param altitude Altitude value. 高度值。
     * @description
     * Modify layer position in vertical direction.
     * 修改图层在垂直方向上的位置。
     */
    setAltitude(altitude: number): this;
    /**
     * Get current layer altitude.
     * 获取当前图层高度。
     *
     * @returns {number} Altitude value. 高度值。
     */
    getAltitude(): number;
    /**
     * Add tile-hidden event listener for a single tile.
     * 为单个瓦片添加 tile-hidden 事件监听器
     * @param tile
     * @private
     */
    private _addHiddenListenerToTile;
    /**
     * Unified lifecycle listener management, responsible for data and renderer linkage.
     * 统一管理生命周期监听，负责数据和渲染器的联动
    */
    private _setupLifeCycleListeners;
    /**
     * Extract vector data from tile geometry.
     * 从瓦片几何体中提取矢量数据
     */
    private getVectorDataFromTile;
    /**
     * Get currently visible vector tile data.
     * 获取当前可见的矢量瓦片数据。
     *
     * @returns {Array<{ tileKey: string, data: any, tile: Tile }>} Array of visible tile data. 可见瓦片数据的数组。
     */
    getVisibleVectorTiles(): Array<{
        tileKey: string;
        data: any;
        tile: Tile;
    }>;
    /**
     * Get all loaded vector data.
     * 获取所有已加载的矢量数据。
     *
     * @returns {Map<string, any>} Map of all loaded vector data. 所有已加载矢量数据的 Map。
     */
    getAllVectorData(): Map<string, any>;
    /**
     * Get specific tile data by coordinates.
     * 根据坐标获取特定瓦片数据。
     *
     * @param x Tile X coordinate. 瓦片 X 坐标。
     * @param y Tile Y coordinate. 瓦片 Y 坐标。
     * @param z Tile Z coordinate (zoom level). 瓦片 Z 坐标（缩放级别）。
     * @returns {any} The vector data for the tile, or null if not found. 瓦片的矢量数据，如果未找到则为 null。
     */
    getVectorData(x: number, y: number, z: number): any;
    /**
     * Set paint configuration.
     * 设置样式配置。
     * @param style Style configuration (PaintRule[]). 样式配置 (PaintRule[])。
     */
    setPaint(style: any[]): void;
    /**
     * Update symbol for specific rule.
     * 更新指定规则的符号。
     * @param index Rule index. 规则索引。
     * @param symbol New symbol configuration. 新的符号配置。
     */
    updateSymbol(index: number, symbol: any): void;
    /**
     * Refresh visible tiles by re-sending data to renderer.
     * 通过向渲染器重新发送数据来刷新可见瓦片。
     * @private
     */
    private _refreshVisibleTiles;
    /**
     * Set feature filter.
     * 设置要素过滤器。
     *
     * @param filter Filter function that returns true to keep the feature. 返回 true 以保留要素的过滤函数。
     */
    setFeatureFilter(filter: (feature: any) => boolean): void;
    /**
     * Clear feature filter.
     * 清除要素过滤器。
     */
    clearFeatureFilter(): void;
    /**
     * Set layer opacity.
     * 设置图层透明度。
     *
     * @param opacity Opacity value (0-1). 透明度值 (0-1)。
     */
    setOpacity(opacity: number): void;
    /**
     * Update layer - Override to add vector specific logic.
     * 更新图层 - 重写以添加矢量特定逻辑。
     *
     * @param camera The camera used for rendering. 用于渲染的相机。
     */
    update(camera: Camera): void;
    /**
     * Override dispose method to clean up vector data.
     * 重写dispose方法，清理矢量数据。
     */
    dispose(): void;
    _setRenderer(renderer: VectorTileRenderLayer): void;
    _getRenderer(): VectorTileRenderLayer;
    getStyle(): any;
}
