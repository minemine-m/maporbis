import { LayoutFeature } from "../layout";
/**
 * Vector Tile Worker Manager
 * 矢量瓦片 Worker 管理器
 *
 * @description
 * Manages Web Worker for processing vector tile data off the main thread.
 * Coordinate transformation is done on main thread (via FeatureLayout),
 * Worker only handles bucket grouping and vertex generation.
 *
 * 管理用于在主线程外处理矢量瓦片数据的 Web Worker。
 * 坐标转换在主线程完成（通过 FeatureLayout），Worker 只负责分桶和顶点生成。
 */
export declare class VectorTileWorkerManager {
    private _worker;
    private _pendingRequests;
    private _useWorker;
    constructor();
    /**
     * Process tile data in Worker
     * LayoutFeatures should already have worldCoordinates computed on main thread.
     * 在 Worker 中处理瓦片数据。LayoutFeatures 的世界坐标已在主线程计算完毕。
     */
    processTile(tileKey: string, layoutFeatures: LayoutFeature[], paintRules: any[]): Promise<{
        lines: {
            segments: number[];
            features: any[];
            config: any;
        }[];
        points: {
            instances: any[];
            features: any[];
            config: any;
        }[];
        fills: {
            vertices: number[];
            indices: number[];
            features: any[];
            config: any;
        }[];
    }>;
    /**
     * Process on main thread (fallback)
     * 在主线程处理（回退方案）
     */
    private _processMainThread;
    /**
     * Evaluate filter expression
     */
    private _evaluateFilter;
    isWorkerAvailable(): boolean;
    terminate(): void;
}
