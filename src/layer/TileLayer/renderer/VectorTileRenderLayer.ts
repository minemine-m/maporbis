import { Feature } from '../../../feature/Feature';
import { OverlayLayer, OverlayLayerOptions } from '../../OverlayLayer';
import { Tile } from '../../../core/tile';
import { Marker, LineString } from '../../../feature';

// import { Map as MapClass } from '../../../map/index';
// import { Camera } from 'three';

import { Style, StyleConfig } from '../../../style';
import { StyleRule } from '../../../style/Layerstyle';
import { matchFilter } from '../../../style/filter';

/**
 * Vector Tile Data structure for internal Feature conversion.
 * 矢量瓦片数据结构，用于 Feature 内部转换
 */
interface FeatureTileData {
    isVectorTile: boolean;
    tileZ: number;
    tileX: number;
    tileY: number;
    // Raw PBF geometry coordinates (0-4096)
    // 原始 PBF 几何坐标 (0-4096)
    rawCoordinates: any;
    extent: number;
    tileSize: number;
}

export type VectorTileRenderLayerOptions = OverlayLayerOptions<Feature> & {
    /** 
     * Style configuration: Global StyleRule array, applied to all vector layers.
     * 样式配置：全局 StyleRule 数组，应用于所有矢量图层 
     */
    style: StyleRule[];
    // Physical size of tile in Three.js world (e.g., 256 or 1)
    // 瓦片在 Three.js 世界中的物理尺寸（例如 256 或 1）
    tileSize?: number;
    // Tile grid extent (usually 4096)
    // 瓦片网格范围（通常是 4096）
    extent?: number;
};

/**
 * Vector Tile Render Layer.
 * 矢量瓦片渲染层
 * 
 * @description
 * Responsible for rendering features from vector tiles.
 * Manages the lifecycle of features associated with tiles.
 * 
 * 负责渲染矢量瓦片中的要素。
 * 管理与瓦片关联的要素的生命周期。
  * @category Layer
 */
export class VectorTileRenderLayer extends OverlayLayer<Feature> {

    private readonly TILE_SIZE: number;
    private readonly EXTENT: number;
    public style: StyleRule[];

    /**
     * Store Features corresponding to each tile for lifecycle management and updates.
     * 存储每个瓦片对应的 Features，用于管理生命周期和更新。
     * @private
     */
    private _tileFeatureMap = new Map<string, Feature[]>();

    /**
     * Currently active feature filter (from VectorTileLayer).
     * 当前激活的要素过滤器 (来自 VectorTileLayer)。
     * @private
     */
    private _activeFeatureFilter?: (feature: any) => boolean;

    constructor(id: string, options: VectorTileRenderLayerOptions) {
        super(id, options);
        this.TILE_SIZE = options.tileSize ?? 256;
        this.EXTENT = options.extent ?? 4096;
        // Initialize as array
        // 初始化为数组
        this.style = options.style || [];

        // Ensure _onMapUpdate 'this' binding is correct
        // 确保 _onMapUpdate 的 this 指向正确
        this._onMapUpdate = this._onMapUpdate.bind(this);
    }

    // --- Core Rendering and Data Processing Methods ---
    // --- 核心渲染和数据处理方法 ---

    /**
     * **Core Method:** Process single tile data, create Features based on global style rules array.
     * **核心方法：** 处理单个瓦片的数据，根据全局样式规则数组创建 Features。
     * 
     * @param tile Tile object (contains z, x, y ID). 瓦片对象 (包含 z, x, y ID)。
     * @param data Parsed vector tile data (contains vectorData property). 经过解析的矢量瓦片数据 (包含 vectorData 属性)。
     * @param zoom Current zoom level. 当前缩放级别 (Unused parameter in implementation).
     */
    public processTileData(tile: Tile, data: any): void {
        const map = this.getMap();
        const tileKey = `${tile.z}-${tile.x}-${tile.y}`;

        // 🔥 Optimization: Check cache first. If Features for this tile already exist, show them directly and return
        // 🔥 优化：先检查缓存。如果该瓦片的 Features 已经存在，直接显示并返回
        const existingFeatures = this._tileFeatureMap.get(tileKey);
        // console.log(`Checking cache on creation ${tileKey}`, existingFeatures);
        // console.log(`All cache on creation ${tileKey}`, this._tileFeatureMap);
        if (existingFeatures && existingFeatures.length > 0) {
            existingFeatures.forEach(f => {

                f.visible = true;
                // console.log(this, 'Adding back to layer');
                // Ensure added back to layer (if removed)
                // 确保添加回图层（如果被移除过）
                // if (!this.children.includes(f)) {
                //     // this.addFeature(f);
                //     f.addTo(this);
                // }
                if (!this.children.some(child => child && f && child.uuid === f.uuid)) {
                    f.addTo(this);
                }
            });
            // console.log(`Cache hit on creation ${tileKey}`);
            // console.log(`[VectorTileRenderLayer] Cache hit for ${tileKey}, restored ${existingFeatures.length} features.`);
            return;
        }

        const vectorData = data.vectorData;

        // this._removeFeaturesByTileKey(tileKey);

        // Check basic conditions and style configuration
        // 检查基本条件和样式配置
        if (!vectorData || !vectorData.layers || !map || this.style.length === 0) return;

        const newFeatures: Feature[] = [];
        const globalStyleRules = this.style; // Get global style rules array 获取全局样式规则数组

        Object.keys(vectorData.layers).forEach(layerName => {
            const vectorLayer = vectorData.layers[layerName];
            // if (layerName.includes('pipe')) {
            //     return
            // }
            for (let i = 0; i < vectorLayer.length; i++) {
                const rawFeature = vectorLayer[i];

                // Load geometry only once for subsequent use
                // 仅加载一次几何体，供后续使用
                const rawCoordinates = rawFeature.geometry;

                // 0. Check Layer level feature filter (if exists)
                // 0. 检查 Layer 级别的要素过滤器 (如果存在)
                if (this._activeFeatureFilter && !this._activeFeatureFilter(rawFeature.properties)) {
                    continue;
                }

                // console.log(`Creating feature ${layerName}`, rawFeature);

                let matchedStyleConfig: StyleConfig | null = null;

                // Iterate through global style rules array, attempt to match
                // 遍历全局样式规则数组，尝试匹配
                for (const rule of globalStyleRules) {
                    if (this._evaluateFilter(rule.filter, rawFeature.properties, layerName, rawFeature.geometry.type)) {
                        matchedStyleConfig = rule.style;
                        break;
                    }
                }

                // If matching style found
                // 如果找到匹配的样式
                if (matchedStyleConfig) {

                    const tileData: FeatureTileData = {
                        isVectorTile: true,
                        tileZ: tile.z,
                        tileX: tile.x,
                        tileY: tile.y,
                        rawCoordinates: rawCoordinates,
                        extent: this.EXTENT,
                        tileSize: this.TILE_SIZE
                    };
                    // Instantiate Feature
                    // 实例化 Feature
                    const feature = this._createFeatureInstance(
                        rawFeature.geometry,
                        rawFeature.geometry.type,
                        matchedStyleConfig,
                        rawFeature.properties
                    );
                    // console.log(feature, 'Created feature')
                    if (feature) {
                        // Inject tile data and style
                        // 注入瓦片数据和样式
                        feature.userData.tileData = tileData;
                        feature.style = Style.create(matchedStyleConfig);

                        // Add Feature to current Layer (OverlayLayer)
                        // 将 Feature 添加到当前 Layer (OverlayLayer)
                        feature.addTo(this);

                        // Trigger Feature initialization (perform coordinate conversion and style application)
                        // 触发 Feature 初始化 (执行坐标转换和样式应用)
                        feature.initializeGeometry();

                        newFeatures.push(feature);
                    }
                }
            }
        });

        // Store new Features reference
        // 存储新的 Features 引用
        this._tileFeatureMap.set(tileKey, newFeatures);
    }

    /**
     * Placeholder function: Evaluate if feature properties satisfy filter conditions (needs to implement complex Mapbox GL style spec).
     * 占位函数：评估要素属性是否满足过滤条件 (需要实现复杂的 Mapbox GL 样式规范)。
     * 
     * @param filter Filter expression in style rule. 样式规则中的 filter 表达式。
     * @param properties Feature properties object. 要素的属性对象。
     * @param layerName Name of tile layer the current feature belongs to (can be used for filtering). 当前要素所属的瓦片图层名称 (可用于过滤)。
     * @returns {boolean} Whether it matches. 是否匹配。
     */
    private _evaluateFilter(filter: any, properties: any, layerName: string, geometryType: string): boolean {
        if (!filter || filter === true) return true;
        const extendedProps = {
            ...properties,
            $layer: layerName,
            $type: geometryType  
        };

        return matchFilter(filter, extendedProps);
    }

    /**
     * Hide Features of a tile (do not destroy).
     * Used for tile-hidden event.
     * 隐藏某个瓦片的 Features（并不销毁）。
     * 用于 tile-hidden 事件。
     * 
     * @param tileKey Tile identifier. 瓦片标识符。
     */
    public hideFeaturesByTileKey(tileKey: string): void {
        const features = this._tileFeatureMap.get(tileKey);
        if (features) {
            // console.log(`Cache hit when hiding ${tileKey}`);
            features.forEach(f => {
                f.visible = false;
                // console.log(`I am hidden ${f.id}`);
            });
            // console.log(`[VectorTileRenderLayer] Hidden features for ${tileKey}`);
        }
    }

    /**
     * Completely clean up all Features loaded by a tile.
     * Used for tile-unload event.
     * 彻底清理某个瓦片加载的所有 Feature。
     * 用于 tile-unload 事件。
     * 
     * @param tileKey Tile identifier. 瓦片标识符。
     */
    public removeFeaturesByTileKey(tileKey: string): void {
        this._removeFeaturesByTileKey(tileKey);
    }

    private _removeFeaturesByTileKey(tileKey: string): void {
        const features = this._tileFeatureMap.get(tileKey);
        // console.log(features, 'Unloaded vector tile features')
        //   console.log(features, 'Read vector tile')
        if (features) {
            features.forEach(f => {
                // Call Feature's own destruction and removal logic
                // 调用 Feature 自身的销毁和移除逻辑
                // console.log(`Destroying feature ${f.id}`);
                f._remove();
            });
            this._tileFeatureMap.delete(tileKey);
        }
    }

    // --- Feature Factory Methods ---
    // --- Feature 工厂方法 ---

    /**
     * Create corresponding Feature instance based on GeoJSON type.
     * 根据 GeoJSON 类型创建对应的 Feature 实例
     */
    private _createFeatureInstance(geometry: any, type: string, style: any, properties: any): Feature | null {
        const dummyGeometry = geometry;
        const options = {
            geometry: {
                ismvt: true,
                ...dummyGeometry
            },
            style: style,
            userData: properties
        };
        // 1 = Point, 2 = LineString, 3 = Polygon
        switch (type) {
            case 'Point': // Point
                // Marker inherits from Point Feature
                // Marker 继承自 Point Feature
                // console.log(options, 'Point feature')
                return new Marker(options);
            case 'LineString': // LineString
                return new LineString(options);
            // case 3: // Polygon
            //     return new PolygonFeature(options as any); 
            default:
                // console.warn(`Unsupported vector tile geometry type: ${type} 不支持的矢量瓦片几何类型: ${type}`);
                return null;
        }
    }

    // --- Lifecycle, Style and Update ---
    // --- 生命周期、样式和更新 ---

    public setFeatureFilter(filter: (feature: any) => boolean): void {
        this._activeFeatureFilter = filter;
        // Reload all visible tiles to apply new filtering rules (requires VectorTileLayer to trigger reload)
        // 重新加载所有可见瓦片以应用新的过滤规则 (需要 VectorTileLayer 触发 reload)
        // ⚠️ Optimization: For loaded Features, can only update visibility/style instead of recreating
        // ⚠️ 优化：对于已加载的 Features，可以只进行可见性/样式更新，而非重新创建
    }

    public clearFeatureFilter(): void {
        this._activeFeatureFilter = undefined;
    }

    public setOpacity(opacity: number): void {
        this.opacity = opacity;
        // Iterate through all Features and apply new opacity
        // 遍历所有 Features 并应用新的透明度
        this._tileFeatureMap.forEach(features => {
            features.forEach(f => {
                if (f.material) {
                    f.material.opacity = opacity;
                    f.material.transparent = opacity < 1;
                }
            });
        });
    }

    /**
     * Start listening to map update events when Layer is added to Map.
     * Layer 绑定到 Map 时，开始监听地图更新事件
     */
    // public onAdd(map: MapClass): void {
    //     // super.onAdd(map);
    //     // Listen for map move events to update Features when map center (prjcenter) changes
    //     // 监听地图移动事件，以便在地图中心点 (prjcenter) 变化时更新 Features
    //     // (map as any).on('move', this._onMapUpdate);
    // }

    /**
     * Stop listening when Layer is removed from Map.
     * Layer 从 Map 移除时，取消监听
     */
    // public onRemove(map: MapClass): void {
    //     // (map as any).off('move', this._onMapUpdate);
    //     // super.onRemove(map);
    //     this.dispose();
    // }

    /**
     * Map update callback: Force all loaded Features to recalculate their local world coordinates.
     * 地图更新回调：强制所有已加载的 Features 重新计算其局部世界坐标。
     */
    private _onMapUpdate(): void {
        // console.log(`Map update callback 地图更新回调`);
        // const now = Date.now();
        // // Simple throttle: do not recalculate within 50ms (adjust based on experience)
        // // 简单限流：50ms 内不重复计算（可根据体验调整）
        // if (now - this._lastUpdateTime < 50) {
        //     return;
        // }
        // this._lastUpdateTime = now;
    
        // this._tileFeatureMap.forEach(features => {
        //     features.forEach(feature => {
        //         // Force Feature to re-execute geometry initialization and coordinate conversion
        //         // 强制 Feature 重新执行几何体初始化和坐标转换
        //         feature.initializeGeometry();
        //     });
        // });
    }

    /**
     * OverlayLayer abstract method implementation.
     * OverlayLayer 抽象方法实现
     */
    protected validateFeature(feature: Feature): boolean {
        return feature instanceof Feature;
    }

    /**
     * Three.js render loop update method.
     * Three.js 渲染循环更新方法
     */
    // public update(camera: Camera): void {
    //     // Leave empty or call super.update(camera)
    //     // 留空或调用 super.update(camera)
    // }

    public dispose(): void {
        // Clean up all Features
        // 清理所有 Features
        this._tileFeatureMap.forEach((_features, tileKey) => {
            this._removeFeaturesByTileKey(tileKey);
        });
        super.dispose();
    }
}
