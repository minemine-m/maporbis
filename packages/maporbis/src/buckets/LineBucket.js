import { Vector3 } from "three";
/**
 * Line Bucket
 * 线桶
 *
 * @description
 * Collects and processes LineString/MultiLineString features.
 * Generates vertex pairs for LineSegments rendering.
 *
 * 收集和处理 LineString/MultiLineString 要素。
 * 生成用于 LineSegments 渲染的顶点对。
 */
export class LineBucket {
    _data;
    constructor() {
        this._data = {
            segments: [],
            features: []
        };
    }
    /**
     * Add a line feature from Layout output
     * 从 Layout 输出添加线要素
     */
    addFeatureFromLayout(layoutFeature) {
        const featureInfo = {
            id: layoutFeature.id,
            properties: layoutFeature.properties,
            startIndex: this._data.segments.length / 3,
            vertexCount: 0
        };
        layoutFeature.worldCoordinates.forEach((ring) => {
            for (let k = 0; k < ring.length; k++) {
                const point = ring[k];
                if (k > 0) {
                    const prev = ring[k - 1];
                    this._data.segments.push(prev.x, prev.y, prev.z);
                    this._data.segments.push(point.x, point.y, point.z);
                }
            }
        });
        featureInfo.vertexCount = (this._data.segments.length / 3) - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            this._data.features.push(featureInfo);
        }
    }
    /**
     * Add a line feature (legacy interface)
     * 添加线要素（旧接口）
     */
    addFeature(geometry, properties, id, map, prjCenter) {
        const coords = geometry.coordinates;
        const lines = geometry.type === 'MultiLineString' ? coords : [coords];
        const pcx = prjCenter.x;
        const pcy = prjCenter.y;
        const pcz = prjCenter.z;
        const featureInfo = {
            id,
            properties,
            startIndex: this._data.segments.length / 3,
            vertexCount: 0
        };
        const tempVec3 = new Vector3();
        lines.forEach((lineCoords) => {
            let prevX = 0, prevY = 0, prevZ = 0;
            for (let k = 0; k < lineCoords.length; k++) {
                const coord = lineCoords[k];
                tempVec3.set(coord[0], coord[1], coord[2] || 0);
                const worldPos = map.lngLatToWorld(tempVec3);
                const x = worldPos.x - pcx;
                const y = worldPos.y - pcy;
                const z = worldPos.z - pcz;
                if (k > 0) {
                    this._data.segments.push(prevX, prevY, prevZ);
                    this._data.segments.push(x, y, z);
                }
                prevX = x;
                prevY = y;
                prevZ = z;
            }
        });
        featureInfo.vertexCount = (this._data.segments.length / 3) - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            this._data.features.push(featureInfo);
        }
    }
    /**
     * Get line data
     * 获取线数据
     */
    getData() {
        return this._data;
    }
    /**
     * Check if bucket has data
     * 检查桶是否有数据
     */
    hasData() {
        return this._data.segments.length > 0;
    }
    /**
     * Get feature count
     * 获取要素数量
     */
    getFeatureCount() {
        return this._data.features.length;
    }
    /**
     * Clear bucket data
     * 清空桶数据
     */
    clear() {
        this._data.segments = [];
        this._data.features = [];
    }
}
