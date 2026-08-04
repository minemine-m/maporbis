import { Vector3 } from "three";
import { FillData } from "./BucketTypes";
import { LayoutFeature } from "../layout";
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
export declare class FillBucket {
    private _data;
    constructor();
    /**
     * Add a polygon feature from Layout output
     * 从 Layout 输出添加多边形要素
     */
    addFeatureFromLayout(layoutFeature: LayoutFeature): void;
    /**
     * Add a polygon feature (legacy interface)
     * 添加多边形要素（旧接口）
     */
    addFeature(geometry: any, properties: any, id: any, map: any, prjCenter: Vector3): void;
    /**
     * Get fill data
     * 获取面数据
     */
    getData(): FillData;
    /**
     * Check if bucket has data
     * 检查桶是否有数据
     */
    hasData(): boolean;
    /**
     * Get vertex count
     * 获取顶点数量
     */
    getVertexCount(): number;
    /**
     * Get feature count
     * 获取要素数量
     */
    getFeatureCount(): number;
    /**
     * Clear bucket data
     * 清空桶数据
     */
    clear(): void;
}
