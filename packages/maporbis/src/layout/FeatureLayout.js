import { Vector3 } from "three";
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
    _tempVec3;
    constructor() {
        this._tempVec3 = new Vector3();
    }
    /**
     * Layout a feature - convert coordinates to world space
     * 布局要素 - 将坐标转换为世界空间
     */
    layoutFeature(geometry, properties, id, map, prjCenter, layerName = '') {
        const type = geometry.type;
        const worldCoordinates = [];
        if (type === 'Point') {
            worldCoordinates.push(this._transformCoordinates([geometry.coordinates], map, prjCenter));
        }
        else if (type === 'MultiPoint') {
            worldCoordinates.push(this._transformCoordinates(geometry.coordinates, map, prjCenter));
        }
        else if (type === 'LineString') {
            worldCoordinates.push(this._transformCoordinates(geometry.coordinates, map, prjCenter));
        }
        else if (type === 'MultiLineString') {
            geometry.coordinates.forEach((line) => {
                worldCoordinates.push(this._transformCoordinates(line, map, prjCenter));
            });
        }
        else if (type === 'Polygon') {
            geometry.coordinates.forEach((ring) => {
                worldCoordinates.push(this._transformCoordinates(ring, map, prjCenter));
            });
        }
        else if (type === 'MultiPolygon') {
            geometry.coordinates.forEach((polygon) => {
                polygon.forEach((ring) => {
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
    _transformCoordinates(coords, map, prjCenter) {
        const result = [];
        const pcx = prjCenter.x;
        const pcy = prjCenter.y;
        const pcz = prjCenter.z;
        for (const coord of coords) {
            this._tempVec3.set(coord[0], coord[1], coord[2] || 0);
            const worldPos = map.lngLatToWorld(this._tempVec3);
            result.push(new Vector3(worldPos.x - pcx, worldPos.y - pcy, worldPos.z - pcz));
        }
        return result;
    }
    /**
     * Layout multiple features from tile data
     * 从瓦片数据布局多个要素
     */
    layoutTileFeatures(vectorData, map, prjCenter, paintRules, evaluateFilter) {
        const features = [];
        if (!vectorData?.layers)
            return features;
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
                    features.push(this.layoutFeature(rawFeature.geometry, rawFeature.properties, rawFeature.id, map, prjCenter, layerName));
                }
            }
        });
        return features;
    }
}
