/**
 * Mapbox Vector Tile (MVT) Parser
 * MVT 矢量瓦片解析器
 *
 * @description
 * Parses MVT binary data (PBF) into GeoJSON compatible format.
 * 解析 MVT 二进制数据 (PBF) 为 GeoJSON 兼容格式。
 */
export declare class MVTParser {
    /**
     * Parse MVT data in Worker
     * 在 Worker 中解析 MVT 数据
     */
    static parse(arrayBuffer: ArrayBuffer, x: number, y: number, z: number): Promise<any>;
    /**
     * Convert MVT PBF to GeoJSON layers
     * 将 MVT PBF 转换为 GeoJSON 图层
     *
     * @param data PBF data
     * @param x Tile X
     * @param y Tile Y
     * @param z Tile Zoom
     */
    static mvt2GeoJSON(data: ArrayBuffer | Uint8Array, x: number, y: number, z: number): any;
}
