import { SourceOptions, TileSource } from "./TileSource";
/**
 * MVTGeo数据源类
 * @description 提供MVTGeo在线矢量数据
 * @extends TileSource
 */
export declare class MVTGeoSource extends TileSource {
    /**
     * 数据类型标识
     * @default "mvtgeo"
     */
    dataType: string;
    /**
     * 数据源版权信息
     * @default "ArcGIS"
     */
    attribution: string;
    /**
     * 最小层级
     * @default 6
     */
    minLevel: number;
    /**
     * 最大层级
     * @default 13
     */
    maxLevel: number;
    /**
     * 瓦片URL模板
     * @default "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}"
     */
    url: string;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: SourceOptions);
}
