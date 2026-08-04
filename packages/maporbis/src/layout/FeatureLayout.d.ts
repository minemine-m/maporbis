import { Vector3 } from "three";
/**
 * Layout Feature Output
 * 布局要素输出
 */
export interface LayoutFeature {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon';
    coordinates: number[][][] | number[][] | number[];
    properties: Record<string, any>;
    id: any;
    layerName: string;
    worldCoordinates: Vector3[][];
}
/**
 * Feature Layout
 * 要素布局
 *
 * @description
 * Handles coordinate transformation from tile coordinates to world coordinates.
 * Separates coordinate conversion from vertex generation.
 *
 * 处理从瓦片坐标到世界坐标的转换。
 * 将坐标转换与顶点生成分离。
 */
export declare class FeatureLayout {
    private _tempVec3;
    constructor();
    /**
     * Layout a feature - convert coordinates to world space
     * 布局要素 - 将坐标转换为世界空间
     */
    layoutFeature(geometry: any, properties: Record<string, any>, id: any, map: any, prjCenter: Vector3, layerName?: string): LayoutFeature;
    /**
     * Transform coordinates from lnglat to world space (relative to prjCenter)
     * 将坐标从经纬度转换为世界空间（相对于 prjCenter）
     */
    private _transformCoordinates;
    /**
     * Layout multiple features from tile data
     * 从瓦片数据布局多个要素
     */
    layoutTileFeatures(vectorData: any, map: any, prjCenter: Vector3, paintRules: any[], evaluateFilter: (filter: any, properties: any, layerName: string, geometryType: string) => boolean): LayoutFeature[];
}
