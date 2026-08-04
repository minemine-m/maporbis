import { Vector3 } from "three";
import { LineData } from "./BucketTypes";
import { LayoutFeature } from "../layout";
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
export declare class LineBucket {
    private _data;
    constructor();
    /**
     * Add a line feature from Layout output
     * 从 Layout 输出添加线要素
     */
    addFeatureFromLayout(layoutFeature: LayoutFeature): void;
    /**
     * Add a line feature (legacy interface)
     * 添加线要素（旧接口）
     */
    addFeature(geometry: any, properties: any, id: any, map: any, prjCenter: Vector3): void;
    /**
     * Get line data
     * 获取线数据
     */
    getData(): LineData;
    /**
     * Check if bucket has data
     * 检查桶是否有数据
     */
    hasData(): boolean;
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
