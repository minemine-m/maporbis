/**
 * Vector Tile Worker
 * 矢量瓦片 Worker
 *
 * Receives pre-transformed LayoutFeatures (worldCoordinates already computed on main thread).
 * Only handles: filter matching → bucket grouping → vertex generation.
 * 接收已转换坐标的 LayoutFeatures（世界坐标已在主线程计算）。
 * 只负责：过滤匹配 → 分桶 → 顶点生成。
 */

import earcut from 'earcut';

/**
 * Processed result sent back to main thread
 */
interface ProcessedResult {
    type: 'tileProcessed';
    id: string;
    payload: {
        lines: { segments: number[]; features: any[]; config: any }[];
        points: { instances: any[]; features: any[]; config: any }[];
        fills: { vertices: number[]; indices: number[]; features: any[]; config: any }[];
    };
}

/**
 * Evaluate filter expression (Mapbox GL style spec)
 */
function evaluateFilter(filter: any, properties: any, layerName: string, geometryType: string): boolean {
    if (!filter || filter === true) return true;

    const extendedProps = {
        ...properties,
        $layer: layerName,
        $type: geometryType
    };

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
    if (op === 'all') return filter.slice(1).every((f: any) => evaluateFilter(f, properties, layerName, geometryType));
    if (op === 'any') return filter.slice(1).some((f: any) => evaluateFilter(f, properties, layerName, geometryType));
    if (op === 'none') return !filter.slice(1).some((f: any) => evaluateFilter(f, properties, layerName, geometryType));
    if (op === '!') return !evaluateFilter(filter[1], properties, layerName, geometryType);
    if (op === 'has') return filter[1] in extendedProps;

    return true;
}

/**
 * Process line features into buckets
 */
function processLineFeatures(
    features: any[],
    paintRules: any[]
): { segments: number[]; features: any[]; config: any }[] {
    const bucketMap = new Map<string, { segments: number[]; features: any[]; config: any }>();

    for (const feature of features) {
        if (feature.type !== 'LineString' && feature.type !== 'MultiLineString') continue;

        let matchedConfig: any = null;
        for (const rule of paintRules) {
            if (evaluateFilter(rule.filter, feature.properties, feature.layerName, feature.type)) {
                matchedConfig = rule.paint;
                break;
            }
        }

        if (!matchedConfig) continue;

        const configKey = JSON.stringify(matchedConfig);
        if (!bucketMap.has(configKey)) {
            bucketMap.set(configKey, { segments: [], features: [], config: matchedConfig });
        }

        const bucket = bucketMap.get(configKey)!;
        const featureInfo = {
            id: feature.id,
            properties: feature.properties,
            startIndex: bucket.segments.length / 3,
            vertexCount: 0
        };

        // Generate line segments from pre-transformed worldCoordinates
        feature.worldCoordinates.forEach((ring: { x: number; y: number; z: number }[]) => {
            for (let k = 1; k < ring.length; k++) {
                const prev = ring[k - 1];
                const curr = ring[k];
                bucket.segments.push(prev.x, prev.y, prev.z);
                bucket.segments.push(curr.x, curr.y, curr.z);
            }
        });

        featureInfo.vertexCount = (bucket.segments.length / 3) - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            bucket.features.push(featureInfo);
        }
    }

    return Array.from(bucketMap.values());
}

/**
 * Process point features into buckets
 */
function processPointFeatures(
    features: any[],
    paintRules: any[]
): { instances: any[]; features: any[]; config: any }[] {
    const bucketMap = new Map<string, { instances: any[]; features: any[]; config: any }>();

    for (const feature of features) {
        if (feature.type !== 'Point' && feature.type !== 'MultiPoint') continue;

        let matchedConfig: any = null;
        for (const rule of paintRules) {
            if (evaluateFilter(rule.filter, feature.properties, feature.layerName, feature.type)) {
                matchedConfig = rule.paint;
                break;
            }
        }

        if (!matchedConfig) continue;

        const configKey = JSON.stringify(matchedConfig);
        if (!bucketMap.has(configKey)) {
            bucketMap.set(configKey, { instances: [], features: [], config: matchedConfig });
        }

        const bucket = bucketMap.get(configKey)!;
        const featureInfo = {
            id: feature.id,
            properties: feature.properties,
            startIndex: bucket.instances.length,
            vertexCount: 0
        };

        feature.worldCoordinates.forEach((ring: { x: number; y: number; z: number }[]) => {
            ring.forEach((point: { x: number; y: number; z: number }) => {
                let scale = 1;
                const size = matchedConfig.size;
                const pixelsToUnit = 0.002;

                if (size !== undefined) {
                    if (matchedConfig.type === 'icon') {
                        scale = (size * pixelsToUnit) / 10;
                    } else {
                        scale = (matchedConfig.radius || 3) / 5;
                    }
                } else {
                    scale = matchedConfig.radius ? (matchedConfig.radius / 5) : 1;
                }

                bucket.instances.push({
                    position: point,
                    scale,
                    rotation: 0,
                    color: matchedConfig.color
                });
            });
        });

        featureInfo.vertexCount = bucket.instances.length - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            bucket.features.push(featureInfo);
        }
    }

    return Array.from(bucketMap.values());
}

/**
 * Process fill features into buckets
 */
function processFillFeatures(
    features: any[],
    paintRules: any[]
): { vertices: number[]; indices: number[]; features: any[]; config: any }[] {
    const bucketMap = new Map<string, { vertices: number[]; indices: number[]; features: any[]; config: any }>();

    for (const feature of features) {
        if (feature.type !== 'Polygon' && feature.type !== 'MultiPolygon') continue;

        let matchedConfig: any = null;
        for (const rule of paintRules) {
            if (evaluateFilter(rule.filter, feature.properties, feature.layerName, feature.type)) {
                matchedConfig = rule.paint;
                break;
            }
        }

        if (!matchedConfig) continue;

        const configKey = JSON.stringify(matchedConfig);
        if (!bucketMap.has(configKey)) {
            bucketMap.set(configKey, { vertices: [], indices: [], features: [], config: matchedConfig });
        }

        const bucket = bucketMap.get(configKey)!;
        const featureInfo = {
            id: feature.id,
            properties: feature.properties,
            startIndex: bucket.vertices.length / 3,
            vertexCount: 0
        };

        // Generate fill geometry from pre-transformed worldCoordinates
        feature.worldCoordinates.forEach((ring: { x: number; y: number; z: number }[]) => {
            const vertexOffset = bucket.vertices.length / 3;
            const ringVerts: number[] = [];

            ring.forEach((point: { x: number; y: number; z: number }) => {
                bucket.vertices.push(point.x, point.y, point.z);
                ringVerts.push(point.x, point.y, point.z);
            });

            // Triangulate ring using earcut
            const flatVertices: number[] = [];
            for (let i = 0; i < ringVerts.length; i += 3) {
                flatVertices.push(ringVerts[i], ringVerts[i + 1]);
            }

            const triangles = earcut(flatVertices);
            triangles.forEach((idx: number) => {
                bucket.indices.push(vertexOffset + idx);
            });
        });

        featureInfo.vertexCount = (bucket.vertices.length / 3) - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            bucket.features.push(featureInfo);
        }
    }

    return Array.from(bucketMap.values());
}

/**
 * Worker message handler
 * Receives pre-transformed LayoutFeatures, only does bucket grouping and vertex generation.
 */
self.onmessage = (e: MessageEvent) => {
    const { type, id, payload } = e.data;

    if (type === 'processTile') {
        const { layoutFeatures, paintRules } = payload;

        // Process into buckets (no coordinate transformation needed)
        const lines = processLineFeatures(layoutFeatures, paintRules);
        const points = processPointFeatures(layoutFeatures, paintRules);
        const fills = processFillFeatures(layoutFeatures, paintRules);

        const result: ProcessedResult = {
            type: 'tileProcessed',
            id,
            payload: { lines, points, fills }
        };

        self.postMessage(result);
    }
};
