/** Tile-local ring: [[x, y], ...] in extent units */
export type TileLocalRing = Array<[number, number]>;
export type TileLocalGeometry = {
    type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";
    coordinates: any;
};
export type TileLocalFeature = {
    id: number | undefined;
    properties: Record<string, any>;
    geometry: TileLocalGeometry;
};
export type ParsedVectorTile = {
    x: number;
    y: number;
    z: number;
    extent: number;
    layers: Record<string, TileLocalFeature[]>;
    timestamp: number;
    /** Marks geometry coordinates as tile-local [0, extent], not lon/lat */
    dataFormat: "mvt-local";
};
/**
 * Mapbox Vector Tile (MVT) Parser
 * MVT 矢量瓦片解析器
 *
 * Keeps coordinates in tile-local extent space [0, extent].
 * Does NOT expand to GeoJSON lon/lat on the hot path.
 */
export declare class MVTParser {
    static parse(arrayBuffer: ArrayBuffer, x: number, y: number, z: number): Promise<ParsedVectorTile>;
    /**
     * Convert MVT PBF to tile-local feature layers (no GeoJSON lon/lat expansion).
     * 将 MVT PBF 转为瓦片本地坐标要素图层（不做 GeoJSON 经纬度展开）。
     */
    static mvt2TileLocal(data: ArrayBuffer | Uint8Array, x: number, y: number, z: number): ParsedVectorTile;
    private static featureToLocalGeometry;
}
