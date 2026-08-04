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
export class FeatureLayout {
    private _tempVec3: Vector3;

    constructor() {
        this._tempVec3 = new Vector3();
    }

    /**
     * Layout a feature - convert coordinates to world space
     * 布局要素 - 将坐标转换为世界空间
     */
    layoutFeature(
        geometry: any,
        properties: Record<string, any>,
        id: any,
        map: any,
        prjCenter: Vector3,
        layerName: string = ''
    ): LayoutFeature {
        const type = geometry.type as LayoutFeature['type'];
        const worldCoordinates: Vector3[][] = [];

        if (type === 'Point') {
            worldCoordinates.push(this._transformCoordinates([geometry.coordinates], map, prjCenter));
        } else if (type === 'MultiPoint') {
            worldCoordinates.push(this._transformCoordinates(geometry.coordinates, map, prjCenter));
        } else if (type === 'LineString') {
            worldCoordinates.push(this._transformCoordinates(geometry.coordinates, map, prjCenter));
        } else if (type === 'MultiLineString') {
            geometry.coordinates.forEach((line: number[][]) => {
                worldCoordinates.push(this._transformCoordinates(line, map, prjCenter));
            });
        } else if (type === 'Polygon') {
            geometry.coordinates.forEach((ring: number[][]) => {
                worldCoordinates.push(this._transformCoordinates(ring, map, prjCenter));
            });
        } else if (type === 'MultiPolygon') {
            geometry.coordinates.forEach((polygon: number[][][]) => {
                polygon.forEach((ring: number[][]) => {
                    worldCoordinates.push(this._transformCoordinates(ring, map, prjCenter));
                });
            });
        }

        return {
            type,
            coordinates: geometry.coordinates,
            properties,
            id,
            layerName,
            worldCoordinates
        };
    }

    /**
     * Transform coordinates from lnglat to world space (relative to prjCenter)
     * 将坐标从经纬度转换为世界空间（相对于 prjCenter）
     */
    private _transformCoordinates(
        coords: number[][],
        map: any,
        prjCenter: Vector3
    ): Vector3[] {
        const result: Vector3[] = [];
        const pcx = prjCenter.x;
        const pcy = prjCenter.y;
        const pcz = prjCenter.z;

        for (const coord of coords) {
            this._tempVec3.set(coord[0], coord[1], coord[2] || 0);
            const worldPos = map.lngLatToWorld(this._tempVec3);
            result.push(new Vector3(
                worldPos.x - pcx,
                worldPos.y - pcy,
                worldPos.z - pcz
            ));
        }

        return result;
    }

    /**
     * Layout multiple features from tile data
     * 从瓦片数据布局多个要素
     */
    layoutTileFeatures(
        vectorData: any,
        map: any,
        prjCenter: Vector3,
        paintRules: any[],
        evaluateFilter: (filter: any, properties: any, layerName: string, geometryType: string) => boolean
    ): LayoutFeature[] {
        const features: LayoutFeature[] = [];

        if (!vectorData?.layers) return features;

        Object.keys(vectorData.layers).forEach(layerName => {
            const vectorLayer = vectorData.layers[layerName];

            for (let i = 0; i < vectorLayer.length; i++) {
                const rawFeature = vectorLayer[i];

                // Match paint rules
                let matched = false;
                for (const rule of paintRules) {
                    if (evaluateFilter(rule.filter, rawFeature.properties, layerName, rawFeature.geometry.type)) {
                        matched = true;
                        break;
                    }
                }

                if (matched) {
                    features.push(this.layoutFeature(
                        rawFeature.geometry,
                        rawFeature.properties,
                        rawFeature.id,
                        map,
                        prjCenter,
                        layerName
                    ));
                }
            }
        });

        return features;
    }
}
