import { SourceOptions, TileSource } from "./TileSource";

/**
 * MVTGeo数据源类
 * @description 提供MVTGeo在线矢量数据
 * @extends TileSource
 */
export class MVTGeoSource extends TileSource {
    /**
     * 数据类型标识
     * @default "mvtgeo"
     */
    public dataType: string = "VectorTile";

    /**
     * 数据源版权信息
     * @default "ArcGIS"
     */
    public attribution = "ArcGIS";

    /**
     * 最小层级
     * @default 6
     */
    public minLevel = 1;

    /**
     * 最大层级
     * @default 13
     */
    public maxLevel = 21;

    /**
     * 瓦片URL模板
     * @default "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}"
     */
    public url = "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=uKYsZQZpm72WlbSgH9B7";

    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: SourceOptions) {
        super(options);
        Object.assign(this, options);
    }
}