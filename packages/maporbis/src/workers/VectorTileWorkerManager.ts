import { Vector3 } from "three";
import { LayoutFeature } from "../layout";
import VectorTileWorkerConstructor from "./vector-tile.worker?worker";

/**
 * Worker message types
 * Worker 消息类型
 */
interface WorkerRequest {
    type: 'processTile';
    id: string;
    payload: {
        layoutFeatures: any[];
        paintRules: any[];
    };
}

interface WorkerResponse {
    type: 'tileProcessed';
    id: string;
    payload: {
        lines: { segments: number[]; features: any[]; config: any }[];
        points: { instances: any[]; features: any[]; config: any }[];
        fills: { vertices: number[]; indices: number[]; features: any[]; config: any }[];
    };
}

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
export class VectorTileWorkerManager {
    private _worker: Worker | null = null;
    private _pendingRequests: Map<string, {
        resolve: (result: any) => void;
        reject: (error: any) => void;
    }> = new Map();
    private _useWorker: boolean;

    constructor() {
        // Check if Worker is available
        this._useWorker = typeof Worker !== 'undefined';

        if (this._useWorker) {
            try {
                this._worker = new VectorTileWorkerConstructor();

                this._worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
                    const { id, type, payload } = e.data;
                    const pending = this._pendingRequests.get(id);
                    if (pending) {
                        pending.resolve(payload);
                        this._pendingRequests.delete(id);
                    }
                };

                this._worker.onerror = (e) => {
                    console.error('[VectorTileWorker] Worker error:', e);
                    this._pendingRequests.forEach((pending) => {
                        pending.reject(e);
                    });
                    this._pendingRequests.clear();
                };

                console.log('[VectorTileWorker] Worker initialized');
            } catch (e) {
                console.warn('[VectorTileWorker] Failed to create worker, falling back to main thread:', e);
                this._useWorker = false;
                this._worker = null;
            }
        } else {
            console.log('[VectorTileWorker] Worker not available, using main thread');
        }
    }

    /**
     * Process tile data in Worker
     * LayoutFeatures should already have worldCoordinates computed on main thread.
     * 在 Worker 中处理瓦片数据。LayoutFeatures 的世界坐标已在主线程计算完毕。
     */
    async processTile(
        tileKey: string,
        layoutFeatures: LayoutFeature[],
        paintRules: any[]
    ): Promise<{
        lines: { segments: number[]; features: any[]; config: any }[];
        points: { instances: any[]; features: any[]; config: any }[];
        fills: { vertices: number[]; indices: number[]; features: any[]; config: any }[];
    }> {
        if (!this._useWorker || !this._worker) {
            return this._processMainThread(layoutFeatures, paintRules);
        }

        // Store worker reference for use in Promise callback
        const worker = this._worker;

        // Serialize LayoutFeatures for postMessage (Vector3 → plain objects)
        const serialized = layoutFeatures.map(f => ({
            ...f,
            worldCoordinates: f.worldCoordinates.map(ring =>
                ring.map(v => ({ x: v.x, y: v.y, z: v.z }))
            )
        }));

        return new Promise((resolve, reject) => {
            const id = tileKey;
            this._pendingRequests.set(id, { resolve, reject });

            const message: WorkerRequest = {
                type: 'processTile',
                id,
                payload: {
                    layoutFeatures: serialized,
                    paintRules
                }
            };

            worker.postMessage(message);
        });
    }

    /**
     * Process on main thread (fallback)
     * 在主线程处理（回退方案）
     */
    private _processMainThread(
        layoutFeatures: LayoutFeature[],
        paintRules: any[]
    ): Promise<{
        lines: { segments: number[]; features: any[]; config: any }[];
        points: { instances: any[]; features: any[]; config: any }[];
        fills: { vertices: number[]; indices: number[]; features: any[]; config: any }[];
    }> {
        const lines: { segments: number[]; features: any[]; config: any }[] = [];
        const points: { instances: any[]; features: any[]; config: any }[] = [];
        const fills: { vertices: number[]; indices: number[]; features: any[]; config: any }[] = [];

        const lineBuckets = new Map<string, any>();
        const pointBuckets = new Map<string, any>();
        const fillBuckets = new Map<string, any>();

        for (const feature of layoutFeatures) {
            let matchedPaint = null;
            for (const rule of paintRules) {
                if (this._evaluateFilter(rule.filter, feature.properties, feature.layerName, feature.type)) {
                    matchedPaint = rule.paint;
                    break;
                }
            }

            if (!matchedPaint) continue;

            const configKey = JSON.stringify(matchedPaint);
            const type = matchedPaint.type;

            if (type === 'line') {
                if (!lineBuckets.has(configKey)) {
                    lineBuckets.set(configKey, { config: matchedPaint, segments: [], features: [] });
                }
                const bucket = lineBuckets.get(configKey);
                const startIdx = bucket.segments.length / 3;
                // Generate line segments from worldCoordinates
                feature.worldCoordinates.forEach((ring: { x: number; y: number; z: number }[]) => {
                    for (let k = 1; k < ring.length; k++) {
                        const prev = ring[k - 1];
                        const curr = ring[k];
                        bucket.segments.push(prev.x, prev.y, prev.z);
                        bucket.segments.push(curr.x, curr.y, curr.z);
                    }
                });
                const vertexCount = (bucket.segments.length / 3) - startIdx;
                if (vertexCount > 0) {
                    bucket.features.push({ id: feature.id, properties: feature.properties, startIndex: startIdx, vertexCount });
                }
            } else if (type === 'icon') {
                if (!pointBuckets.has(configKey)) {
                    pointBuckets.set(configKey, { config: matchedPaint, instances: [], features: [] });
                }
                const bucket = pointBuckets.get(configKey);
                const startIdx = bucket.instances.length;
                feature.worldCoordinates.forEach((ring: { x: number; y: number; z: number }[]) => {
                    ring.forEach((point: { x: number; y: number; z: number }) => {
                        let scale = 1;
                        const size = matchedPaint.size;
                        const pixelsToUnit = 0.002;
                        if (size !== undefined) {
                            if (matchedPaint.type === 'icon') {
                                scale = (size * pixelsToUnit) / 10;
                            } else {
                                scale = (matchedPaint.radius || 3) / 5;
                            }
                        } else {
                            scale = matchedPaint.radius ? (matchedPaint.radius / 5) : 1;
                        }
                        bucket.instances.push({
                            position: point,
                            scale,
                            rotation: 0,
                            color: matchedPaint.color
                        });
                    });
                });
                const vertexCount = bucket.instances.length - startIdx;
                if (vertexCount > 0) {
                    bucket.features.push({ id: feature.id, properties: feature.properties, startIndex: startIdx, vertexCount });
                }
            } else if (type === 'fill') {
                if (!fillBuckets.has(configKey)) {
                    fillBuckets.set(configKey, { config: matchedPaint, vertices: [], indices: [], features: [] });
                }
                const bucket = fillBuckets.get(configKey);
                const startIdx = bucket.vertices.length / 3;
                feature.worldCoordinates.forEach((ring: { x: number; y: number; z: number }[]) => {
                    const vertexOffset = bucket.vertices.length / 3;
                    const ringVerts: number[] = [];
                    ring.forEach((point: { x: number; y: number; z: number }) => {
                        bucket.vertices.push(point.x, point.y, point.z);
                        ringVerts.push(point.x, point.y, point.z);
                    });
                    // Simple earcut triangulation
                    const flat: number[] = [];
                    for (let i = 0; i < ringVerts.length; i += 3) {
                        flat.push(ringVerts[i], ringVerts[i + 1]);
                    }
                    try {
                        const earcut = require('earcut');
                        const triangles = earcut(flat);
                        triangles.forEach((idx: number) => {
                            bucket.indices.push(vertexOffset + idx);
                        });
                    } catch (e) {
                        // earcut not available
                    }
                });
                const vertexCount = (bucket.vertices.length / 3) - startIdx;
                if (vertexCount > 0) {
                    bucket.features.push({ id: feature.id, properties: feature.properties, startIndex: startIdx, vertexCount });
                }
            }
        }

        lineBuckets.forEach(bucket => lines.push(bucket));
        pointBuckets.forEach(bucket => points.push(bucket));
        fillBuckets.forEach(bucket => fills.push(bucket));

        return Promise.resolve({ lines, points, fills });
    }

    /**
     * Evaluate filter expression
     */
    private _evaluateFilter(filter: any, properties: any, layerName: string, geometryType: string): boolean {
        if (!filter) return true;

        const extendedProps = { ...properties, $layer: layerName, $type: geometryType };

        const getValue = (expr: any): any => {
            if (Array.isArray(expr)) {
                if (expr[0] === 'get') return extendedProps[expr[1]];
                if (expr[0] === 'literal') return expr[1];
            }
            return expr;
        };

        if (!Array.isArray(filter)) return true;

        const op = filter[0];
        if (op === '==') return getValue(filter[1]) === getValue(filter[2]);
        if (op === '!=') return getValue(filter[1]) !== getValue(filter[2]);
        if (op === '>') return getValue(filter[1]) > getValue(filter[2]);
        if (op === '>=') return getValue(filter[1]) >= getValue(filter[2]);
        if (op === '<') return getValue(filter[1]) < getValue(filter[2]);
        if (op === '<=') return getValue(filter[1]) <= getValue(filter[2]);
        if (op === 'in') { const v = getValue(filter[1]); return Array.isArray(filter[2]) && filter[2].includes(v); }
        if (op === 'all') return filter.slice(1).every((f: any) => this._evaluateFilter(f, properties, layerName, geometryType));
        if (op === 'any') return filter.slice(1).some((f: any) => this._evaluateFilter(f, properties, layerName, geometryType));
        if (op === 'none') return !filter.slice(1).some((f: any) => this._evaluateFilter(f, properties, layerName, geometryType));
        if (op === '!') return !this._evaluateFilter(filter[1], properties, layerName, geometryType);
        if (op === 'has') return filter[1] in extendedProps;

        return true;
    }

    isWorkerAvailable(): boolean {
        return this._useWorker && this._worker !== null;
    }

    terminate(): void {
        if (this._worker) {
            this._worker.terminate();
            this._worker = null;
        }
        this._pendingRequests.clear();
    }
}
