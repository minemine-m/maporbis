import { Vector3 } from "three";
import earcut from "earcut";
/**
 * Fill Bucket
 * 面桶
 *
 * @description
 * Collects and processes Polygon/MultiPolygon features.
 * Generates triangulated vertices for mesh rendering.
 *
 * 收集和处理 Polygon/MultiPolygon 要素。
 * 生成三角化的顶点用于 Mesh 渲染。
 */
export class FillBucket {
    _data;
    constructor() {
        this._data = {
            vertices: [],
            indices: [],
            features: []
        };
    }
    /**
     * Add a polygon feature from Layout output
     * 从 Layout 输出添加多边形要素
     */
    addFeatureFromLayout(layoutFeature) {
        const featureInfo = {
            id: layoutFeature.id,
            properties: layoutFeature.properties,
            startIndex: this._data.vertices.length / 3,
            vertexCount: 0
        };
        layoutFeature.worldCoordinates.forEach((ring) => {
            const ringVertices = [];
            let vertexOffset = this._data.vertices.length / 3;
            ring.forEach((point) => {
                this._data.vertices.push(point.x, point.y, point.z);
                ringVertices.push(point.x, point.y, point.z);
            });
            // Triangulate ring
            const flatVertices = [];
            for (let i = 0; i < ringVertices.length; i += 3) {
                flatVertices.push(ringVertices[i], ringVertices[i + 1]);
            }
            const triangles = earcut(flatVertices);
            triangles.forEach((idx) => {
                this._data.indices.push(vertexOffset + idx);
            });
        });
        featureInfo.vertexCount = (this._data.vertices.length / 3) - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            this._data.features.push(featureInfo);
        }
    }
    /**
     * Add a polygon feature (legacy interface)
     * 添加多边形要素（旧接口）
     */
    addFeature(geometry, properties, id, map, prjCenter) {
        const pcx = prjCenter.x;
        const pcy = prjCenter.y;
        const pcz = prjCenter.z;
        const featureInfo = {
            id,
            properties,
            startIndex: this._data.vertices.length / 3,
            vertexCount: 0
        };
        const coords = geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
        const tempVec3 = new Vector3();
        coords.forEach((polygon) => {
            polygon.forEach((ring) => {
                const ringVertices = [];
                let vertexOffset = this._data.vertices.length / 3;
                ring.forEach((coord) => {
                    tempVec3.set(coord[0], coord[1], coord[2] || 0);
                    const worldPos = map.lngLatToWorld(tempVec3);
                    const x = worldPos.x - pcx;
                    const y = worldPos.y - pcy;
                    const z = worldPos.z - pcz;
                    this._data.vertices.push(x, y, z);
                    ringVertices.push(x, y, z);
                });
                // Triangulate ring
                const flatVertices = [];
                for (let i = 0; i < ringVertices.length; i += 3) {
                    flatVertices.push(ringVertices[i], ringVertices[i + 1]);
                }
                const triangles = earcut(flatVertices);
                triangles.forEach((idx) => {
                    this._data.indices.push(vertexOffset + idx);
                });
            });
        });
        featureInfo.vertexCount = (this._data.vertices.length / 3) - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            this._data.features.push(featureInfo);
        }
    }
    /**
     * Get fill data
     * 获取面数据
     */
    getData() {
        return this._data;
    }
    /**
     * Check if bucket has data
     * 检查桶是否有数据
     */
    hasData() {
        return this._data.vertices.length > 0;
    }
    /**
     * Get vertex count
     * 获取顶点数量
     */
    getVertexCount() {
        return this._data.vertices.length / 3;
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
        this._data.vertices = [];
        this._data.indices = [];
        this._data.features = [];
    }
}
