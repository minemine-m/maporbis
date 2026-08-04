import { Vector3 } from "three";
import { PointData } from "./BucketTypes";
import { LayoutFeature } from "../layout";
/**
 * Point Bucket
 * 点桶
 *
 * @description
 * Collects and processes Point/MultiPoint features.
 * Generates instance data for InstancedMesh rendering.
 *
 * 收集和处理 Point/MultiPoint 要素。
 * 生成用于 InstancedMesh 渲染的实例数据。
 */
export declare class PointBucket {
    private _data;
    constructor();
    /**
     * Add a point feature from Layout output
     * 从 Layout 输出添加点要素
     */
    addFeatureFromLayout(layoutFeature: LayoutFeature, paint: any): void;
    /**
     * Add a point feature (legacy interface)
     * 添加点要素（旧接口）
     */
    addFeature(geometry: any, properties: any, id: any, paint: any, map: any, prjCenter: Vector3): void;
    /**
     * Get point data
     * 获取点数据
     */
    getData(): PointData;
    /**
     * Check if bucket has data
     * 检查桶是否有数据
     */
    hasData(): boolean;
    /**
     * Get instance count
     * 获取实例数量
     */
    getInstanceCount(): number;
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
