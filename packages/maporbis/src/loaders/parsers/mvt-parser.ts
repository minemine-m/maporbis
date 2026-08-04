// loaders/VectorTileLoader/mvt-parser.ts

import Pbf from "pbf";
import { VectorTile } from "@mapbox/vector-tile";

/**
 * Mapbox Vector Tile (MVT) Parser
 * MVT 矢量瓦片解析器
 * 
 * @description
 * Parses MVT binary data (PBF) into GeoJSON compatible format.
 * 解析 MVT 二进制数据 (PBF) 为 GeoJSON 兼容格式。
 */
export class MVTParser {
    /**
     * Parse MVT data in Worker
     * 在 Worker 中解析 MVT 数据
     */
    public static async parse(
        arrayBuffer: ArrayBuffer,
        x: number,
        y: number,
        z: number
    ): Promise<any> {
        try {
            const layers = MVTParser.mvt2GeoJSON(arrayBuffer, x, y, z);
            return {
                x, y, z,
                layers,
                timestamp: Date.now(),
                dataFormat: 'mvt'
            };
        } catch (error) {
            console.error('[MVTParser] Error parsing vector tile data:', error);
            throw error;
        }
    }

    /**
     * Convert MVT PBF to GeoJSON layers
     * 将 MVT PBF 转换为 GeoJSON 图层
     * 
     * @param data PBF data
     * @param x Tile X
     * @param y Tile Y
     * @param z Tile Zoom
     */
    public static mvt2GeoJSON(data: ArrayBuffer | Uint8Array, x: number, y: number, z: number) {
        // Use Pbf to parse binary data
        const pbf = new Pbf(data);

        // Construct VectorTile instance
        const tile = new VectorTile(pbf);

        // Iterate layers and convert features to GeoJSON
        const result: any = {};

        for (const layerName in tile.layers) {
            const layer = tile.layers[layerName];
            const features = [];

            for (let i = 0; i < layer.length; i++) {
                const feature = layer.feature(i);
                const geojson = feature.toGeoJSON(x, y, z);
                features.push(geojson);
            }

            result[layerName] = features;
        }

        return result;
    }
}
