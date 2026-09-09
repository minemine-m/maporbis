import { Vector3 } from "three";
/**
 * Layout Feature Output
 * 布局要素输出
 */
export interface LayoutFeature {
    type: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
    coordinates: number[][][] | number[][] | number[];
    properties: Record<string, any>;
    id: any;
    layerName: string;
    worldCoordinates: Vector3[][];
}
export type TileLocalMeta = {
    x: number;
    y: number;
    z: number;
    extent: number;
};
/**
 * Feature Layout
 * 要素布局
 *
 * Converts tile-local extent coordinates to world space relative to prjCenter.
 * Avoids per-vertex lon/lat GeoJSON expansion.
 */
export declare class FeatureLayout {
    private _tempVec3;
    /**
     * Layout a feature from tile-local coordinates
     * 从瓦片本地坐标布局要素
     */
    layoutFeature(geometry: any, properties: Record<string, any>, id: any, map: any, prjCenter: Vector3, layerName?: string, tileMeta?: TileLocalMeta): LayoutFeature;
    /**
     * Tile-local (extent units) → projected → world (relative to prjCenter)
     */
    private _transformCoordinates;
    /** XYZ normalized y [0,1] → latitude degrees (web mercator) */
    private _yToLat;
    /**
     * Layout multiple features from tile data
     * 从瓦片数据布局多个要素
     */
    layoutTileFeatures(vectorData: any, map: any, prjCenter: Vector3, paintRules: any[], evaluateFilter: (filter: any, properties: any, layerName: string, geometryType: string) => boolean): LayoutFeature[];
}
