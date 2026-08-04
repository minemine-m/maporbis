import { Feature, Marker, LineString, Polygon } from "../feature";
import { OverlayLayer, OverlayLayerOptions } from "./OverlayLayer";
import { Tile } from "../core/tile";
import {
    Object3D,
    Vector3,
    // PointsMaterial,
    BufferGeometry,
    Float32BufferAttribute,
    LineSegments,
    LineBasicMaterial,
    InstancedMesh,
    DynamicDrawUsage,
    Color,
    Vector2,
    CircleGeometry,
    MeshBasicMaterial,
    PlaneGeometry,
    TextureLoader,
    Texture,
    DoubleSide,
    Mesh
} from 'three';
import { LineSegmentsGeometry, LineSegments2, LineMaterial } from 'three-stdlib';

import { Paint, PaintConfig, PaintRule } from "../style";
import { matchFilter } from "../style/filter";
import { WebGPUCompat } from "../utils/WebGPUCompat";

import { LineBucket, PointBucket, FillBucket } from "../buckets";
import { FeatureLayout, LayoutFeature } from "../layout";
import { VectorTileWorkerManager } from "../workers";

/**
 * Vector Tile Data structure for internal Feature conversion.
 * 矢量瓦片数据结构，用于 Feature 内部转换
 */
interface FeatureTileData {
    isVectorTile: boolean;
    tileZ: number;
    tileX: number;
    tileY: number;
    // Raw PBF geometry coordinates (0-4096)
    // 原始 PBF 几何坐标 (0-4096)
    rawCoordinates: any;
    extent: number;
    tileSize: number;
}

export type VectorTileRenderLayerOptions = OverlayLayerOptions<Feature> & {
    /** 
     * Paint configuration: Global PaintRule array, applied to all vector layers.
     * 样式配置：全局 PaintRule 数组，应用于所有矢量图层 
     */
    paint: PaintRule[];
    // Physical size of tile in Three.js world (e.g., 256 or 1)
    // 瓦片在 Three.js 世界中的物理尺寸（例如 256 或 1）
    tileSize?: number;
    // Tile grid extent (usually 4096)
    // 瓦片网格范围（通常是 4096）
    extent?: number;
};

/**
 * Vector Tile Render Layer.
 * 矢量瓦片渲染层
 * 
 * @description
 * Responsible for rendering features from vector tiles.
 * Manages the lifecycle of features associated with tiles.
 * 
 * 负责渲染矢量瓦片中的要素。
 * 管理与瓦片关联的要素的生命周期。
  * @category Layer
 */
export class VectorTileRenderLayer extends OverlayLayer<Feature> {
    private static _textureCache = new Map<string, Texture>();
    private static _geometryCache = new Map<string, BufferGeometry>();
    private static _materialCache = new Map<string, any>(); // 共享材质缓存

    private readonly TILE_SIZE: number;
    private readonly EXTENT: number;
    public paint: PaintRule[];

    /**
     * Store Features corresponding to each tile for lifecycle management and updates.
     * 存储每个瓦片对应的 Features，用于管理生命周期和更新。
     * @private
     */
    private _tileFeatureMap = new Map<string, Feature[]>();

    /**
     * Currently active feature filter (from VectorTileLayer).
     * 当前激活的要素过滤器 (来自 VectorTileLayer)。
     * @private
     */
    private _activeFeatureFilter?: (feature: any) => boolean;

    /**
     * Feature Layout instance for coordinate transformation
     * 要素布局实例，用于坐标转换
     */
    private _layout: FeatureLayout;

    /**
     * Worker Manager for off-thread processing
     * Worker 管理器，用于线程外处理
     */
    public _workerManager: VectorTileWorkerManager;

    constructor(id: string, options: VectorTileRenderLayerOptions) {
        super(id, options);
        this.TILE_SIZE = options.tileSize ?? 256;
        this.EXTENT = options.extent ?? 4096;
        // Initialize as array
        // 初始化为数组
        this.paint = options.paint || [];
        this._layout = new FeatureLayout();
        this._workerManager = new VectorTileWorkerManager();

        // Ensure _onMapUpdate 'this' binding is correct
        // 确保 _onMapUpdate 的 this 指向正确
        this._onMapUpdate = this._onMapUpdate.bind(this);
    }

    // --- Core Rendering and Data Processing Methods ---
    // --- 核心渲染和数据处理方法 ---

    /**
     * **Core Method:** Process single tile data, create Features based on global style rules array.
     * **核心方法：** 处理单个瓦片的数据，根据全局样式规则数组创建 Features。
     * 
     * @param tile Tile object (contains z, x, y ID). 瓦片对象 (包含 z, x, y ID)。
     * @param data Parsed vector tile data (contains vectorData property). 经过解析的矢量瓦片数据 (包含 vectorData 属性)。
     * @param zoom Current zoom level. 当前缩放级别 (Unused parameter in implementation).
     */
    public processTileData(tile: Tile, data: any): void {
        const map = this.getMap();
        const tileKey = `${tile.z}-${tile.x}-${tile.y}`;

        // 🔥 Optimization: Check cache first. If Features for this tile already exist, show them directly and return
        // 🔥 优化：先检查缓存。如果该瓦片的 Features 已经存在，直接显示并返回
        const existingFeatures = this._tileFeatureMap.get(tileKey);
        if (existingFeatures && existingFeatures.length > 0) {
            existingFeatures.forEach(f => {
                f.visible = true;
                if (!this.children.some(child => child && f && child.uuid === f.uuid)) {
                    f.addTo(this);
                }
            });
            return;
        }

        const vectorData = data.vectorData;

        // Check basic conditions and paint configuration
        // 检查基本条件和样式配置
        if (!vectorData || !vectorData.layers || !map || this.paint.length === 0) {
            return;
        }

        const newFeatures: Feature[] = [];
        const globalPaintRules = this.paint;
        const prjCenter = map.prjcenter as Vector3;

        // Phase B: Use Layout for coordinate transformation
        // 阶段 B：使用 Layout 进行坐标转换
        const layoutFeatures = this._layout.layoutTileFeatures(
            vectorData,
            map,
            prjCenter,
            globalPaintRules,
            (filter, properties, layerName, geometryType) => this._evaluateFilter(filter, properties, layerName, geometryType)
        );

        // Group by paint config for batching
        // 按样式分组进行批处理
        const lineBuckets = new Map<string, { config: PaintConfig, bucket: LineBucket }>();
        const pointBuckets = new Map<string, { config: PaintConfig, bucket: PointBucket }>();
        const fillBuckets = new Map<string, { config: PaintConfig, bucket: FillBucket }>();

        // Process layout features
        // 处理布局后的要素
        let lineCount = 0, pointCount = 0, fillCount = 0;
        for (const layoutFeature of layoutFeatures) {
            // Find matching paint config from original data
            // 从原始数据中找到匹配的样式配置
            let matchedPaintConfig: PaintConfig | null = null;
            for (const rule of globalPaintRules) {
                if (this._evaluateFilter(rule.filter, layoutFeature.properties, layoutFeature.layerName, layoutFeature.type)) {
                    matchedPaintConfig = rule.paint;
                    break;
                }
            }

            if (matchedPaintConfig) {
                const paintKey = JSON.stringify(matchedPaintConfig);
                const type = layoutFeature.type;

                if (type === 'LineString' || type === 'MultiLineString') {
                    if (!lineBuckets.has(paintKey)) {
                        lineBuckets.set(paintKey, { config: matchedPaintConfig, bucket: new LineBucket() });
                    }
                    const { bucket } = lineBuckets.get(paintKey)!;
                    bucket.addFeatureFromLayout(layoutFeature);
                    lineCount++;

                } else if (type === 'Point' || type === 'MultiPoint') {
                    if (!pointBuckets.has(paintKey)) {
                        pointBuckets.set(paintKey, { config: matchedPaintConfig, bucket: new PointBucket() });
                    }
                    const { bucket } = pointBuckets.get(paintKey)!;
                    bucket.addFeatureFromLayout(layoutFeature, matchedPaintConfig);
                    pointCount++;

                } else if (type === 'Polygon' || type === 'MultiPolygon') {
                    if (!fillBuckets.has(paintKey)) {
                        fillBuckets.set(paintKey, { config: matchedPaintConfig, bucket: new FillBucket() });
                    }
                    const { bucket } = fillBuckets.get(paintKey)!;
                    bucket.addFeatureFromLayout(layoutFeature);
                    fillCount++;
                }
            }
        }

        // Render Line Buckets
        lineBuckets.forEach(({ config, bucket }) => {
            if (!bucket.hasData()) return;

            const data = bucket.getData();
            const mesh = this._createLineMesh(data.segments, config);
            mesh.position.copy(prjCenter);
            mesh.updateMatrixWorld(true);
            this.add(mesh);

            // Create proxy features
            data.features.forEach(info => {
                const feature = new MergedFeature(mesh, {
                    id: info.id,
                    userData: info.properties,
                    geometry: { type: 'Merged', coordinates: [] },
                    paint: config
                }, info.startIndex, info.vertexCount);
                feature._layer = this;
                newFeatures.push(feature);
            });

            if (newFeatures.length > 0) {
                const lastFeature = newFeatures[newFeatures.length - 1];
                if (lastFeature instanceof MergedFeature) {
                    lastFeature._sharedMesh = mesh;
                }
            }
        });

        // Render Point Buckets
        pointBuckets.forEach(({ config, bucket }) => {
            if (!bucket.hasData()) {
                return;
            }

            const data = bucket.getData();
            const mesh = this._createPointMesh(data.instances, config);
            mesh.position.copy(prjCenter);
            mesh.updateMatrixWorld(true);
            this.add(mesh);

            // Create proxy features
            data.features.forEach(info => {
                const feature = new InstancedFeature(mesh, {
                    id: info.id,
                    userData: info.properties,
                    geometry: { type: 'MergedPoint', coordinates: [] },
                    paint: config
                }, info.startIndex, info.vertexCount);
                feature._layer = this;
                newFeatures.push(feature);
            });

            if (newFeatures.length > 0) {
                const lastFeature = newFeatures[newFeatures.length - 1];
                if (lastFeature instanceof MergedFeature || lastFeature instanceof InstancedFeature) {
                    lastFeature._sharedMesh = mesh;
                }
            }
        });

        // Render Fill Buckets
        fillBuckets.forEach(({ config, bucket }) => {
            if (!bucket.hasData()) return;

            const data = bucket.getData();
            const mesh = this._createFillMesh(data.vertices, data.indices, config);
            mesh.position.copy(prjCenter);
            mesh.updateMatrixWorld(true);
            this.add(mesh);

            // Create proxy features
            data.features.forEach(info => {
                const feature = new MergedFeature(mesh, {
                    id: info.id,
                    userData: info.properties,
                    geometry: { type: 'Merged', coordinates: [] },
                    paint: config
                }, info.startIndex, info.vertexCount);
                feature._layer = this;
                newFeatures.push(feature);
            });

            if (newFeatures.length > 0) {
                const lastFeature = newFeatures[newFeatures.length - 1];
                if (lastFeature instanceof MergedFeature) {
                    lastFeature._sharedMesh = mesh;
                }
            }
        });

        // Store new Features reference
        // 存储新的 Features 引用
        this._tileFeatureMap.set(tileKey, newFeatures);
    }

    /**
     * Process tile data using Worker (async)
     * 使用 Worker 处理瓦片数据（异步）
     */
    public async processTileDataAsync(tile: Tile, data: any): Promise<void> {
        const map = this.getMap();
        const tileKey = `${tile.z}-${tile.x}-${tile.y}`;

        // Check cache
        const existingFeatures = this._tileFeatureMap.get(tileKey);
        if (existingFeatures && existingFeatures.length > 0) {
            existingFeatures.forEach(f => {
                f.visible = true;
                if (!this.children.some(child => child && f && child.uuid === f.uuid)) {
                    f.addTo(this);
                }
            });
            return;
        }

        const vectorData = data.vectorData;
        if (!vectorData || !vectorData.layers || !map || this.paint.length === 0) {
            return;
        }

        const prjCenter = map.prjcenter as Vector3;
        const newFeatures: Feature[] = [];

        try {
            // Step 1: Layout on main thread (coordinate transformation using map.lngLatToWorld)
            // 第一步：在主线程进行 Layout（坐标转换，使用 map.lngLatToWorld）
            const layoutFeatures = this._layout.layoutTileFeatures(
                vectorData,
                map,
                prjCenter,
                this.paint,
                (filter, properties, layerName, geometryType) => this._evaluateFilter(filter, properties, layerName, geometryType)
            );

            // Step 2: Send pre-transformed features to Worker for bucket grouping + vertex generation
            // 第二步：将已转换坐标的要素发送给 Worker 进行分桶 + 顶点生成
            const result = await this._workerManager.processTile(
                tileKey,
                layoutFeatures,
                this.paint
            );

            // Check if tile is still valid after async processing
            if (!tile.showing || !tile.loaded) {
                return;
            }

            // Process lines
            result.lines.forEach(lineData => {
                if (lineData.segments.length === 0) return;
                const mesh = this._createLineMesh(lineData.segments, lineData.config);
                mesh.position.copy(prjCenter);
                mesh.updateMatrixWorld(true);
                this.add(mesh);

                lineData.features.forEach(info => {
                    const feature = new MergedFeature(mesh, {
                        id: info.id,
                        userData: info.properties,
                        geometry: { type: 'Merged', coordinates: [] },
                        paint: lineData.config
                    }, info.startIndex, info.vertexCount);
                    feature._layer = this;
                    newFeatures.push(feature);
                });
            });

            // Process points
            result.points.forEach(pointData => {
                if (pointData.instances.length === 0) return;
                const mesh = this._createPointMesh(pointData.instances, pointData.config);
                mesh.position.copy(prjCenter);
                mesh.updateMatrixWorld(true);
                this.add(mesh);

                pointData.features.forEach(info => {
                    const feature = new InstancedFeature(mesh, {
                        id: info.id,
                        userData: info.properties,
                        geometry: { type: 'MergedPoint', coordinates: [] },
                        paint: pointData.config
                    }, info.startIndex, info.vertexCount);
                    feature._layer = this;
                    newFeatures.push(feature);
                });
            });

            // Process fills
            result.fills.forEach(fillData => {
                if (fillData.vertices.length === 0) return;
                const mesh = this._createFillMesh(fillData.vertices, fillData.indices, fillData.config);
                mesh.position.copy(prjCenter);
                mesh.updateMatrixWorld(true);
                this.add(mesh);

                fillData.features.forEach(info => {
                    const feature = new MergedFeature(mesh, {
                        id: info.id,
                        userData: info.properties,
                        geometry: { type: 'Merged', coordinates: [] },
                        paint: fillData.config
                    }, info.startIndex, info.vertexCount);
                    feature._layer = this;
                    newFeatures.push(feature);
                });
            });

            this._tileFeatureMap.set(tileKey, newFeatures);

        } catch (error) {
            console.error(`[Worker] Failed to process tile ${tileKey}, falling back to main thread:`, error);
            this.processTileData(tile, data);
        }
    }

    /**
     * Create line mesh from segments data
     * 从线段数据创建线网格
     */
    private _createLineMesh(segments: number[], config: PaintConfig): any {
        const cacheKey = `line_${JSON.stringify(config)}`;
        let material = VectorTileRenderLayer._materialCache.get(cacheKey);

        const opacity = config.opacity ?? 1;
        const isTransparent = opacity < 1 || (config as any).transparent === true;
        const width = (config as any).width ?? 1;
        const useWideLine = width > 1 && !WebGPUCompat.useWebGPU;

        let mesh: any;

        if (useWideLine) {
            const geometry = new LineSegmentsGeometry();
            geometry.setPositions(segments);

            if (!material) {
                material = new LineMaterial({
                    color: (config as any).color || 0xffffff,
                    linewidth: width,
                    transparent: isTransparent,
                    opacity: opacity,
                    dashed: Array.isArray((config as any).dashArray) && (config as any).dashArray.length > 0,
                    dashScale: 1,
                    dashSize: (config as any).dashArray?.[0] ?? 1,
                    gapSize: (config as any).dashArray?.[1] ?? 0,
                    resolution: new Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio),
                    alphaToCoverage: false,
                    depthTest: true,
                    depthWrite: !isTransparent,
                    polygonOffset: true,
                    polygonOffsetFactor: -2,
                    polygonOffsetUnits: -2
                });
                VectorTileRenderLayer._materialCache.set(cacheKey, material);
            }

            mesh = new LineSegments2(geometry, material);
            if ((material as any).dashed) {
                mesh.computeLineDistances();
            }
            mesh.onBeforeRender = function(renderer: any) {
                const drawingBufferSize = new Vector2();
                renderer.getDrawingBufferSize(drawingBufferSize);
                if (material.resolution.x !== drawingBufferSize.x || material.resolution.y !== drawingBufferSize.y) {
                    material.resolution.copy(drawingBufferSize);
                }
            };
        } else {
            const geometry = new BufferGeometry();
            geometry.setAttribute('position', new Float32BufferAttribute(segments, 3));

            if (!material) {
                material = new LineBasicMaterial({
                    color: (config as any).color || 0xffffff,
                    linewidth: 1,
                    transparent: isTransparent,
                    opacity: opacity,
                    depthWrite: !isTransparent
                });
                VectorTileRenderLayer._materialCache.set(cacheKey, material);
            }

            mesh = new LineSegments(geometry, material);
        }

        return mesh;
    }

    /**
     * Create point mesh from instances data
     * 从实例数据创建点网格
     */
    private _createPointMesh(instances: any[], config: PaintConfig): InstancedMesh {
        let baseGeometry: BufferGeometry;
        let meshMaterial: any;

        const cacheKey = `point_${JSON.stringify(config)}`;
        meshMaterial = VectorTileRenderLayer._materialCache.get(cacheKey);

        if ((config as any).type === 'icon' && (config as any).url) {
            // Geometry Cache
            const geomKey = 'Plane_10_10';
            baseGeometry = VectorTileRenderLayer._geometryCache.get(geomKey)!;
            if (!baseGeometry) {
                baseGeometry = new PlaneGeometry(10, 10);
                VectorTileRenderLayer._geometryCache.set(geomKey, baseGeometry);
            }

            if (!meshMaterial) {
                const url = (config as any).url;
                let texture = VectorTileRenderLayer._textureCache.get(url);
                if (!texture) {
                    texture = new TextureLoader().load(url);
                    VectorTileRenderLayer._textureCache.set(url, texture);
                }

                meshMaterial = new MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: config.opacity ?? 1,
                    side: DoubleSide,
                    depthTest: false,
                    alphaTest: 0.1,
                    color: 0xffffff
                });

                // Billboard Shader
                meshMaterial.onBeforeCompile = (shader: any) => {
                    shader.vertexShader = shader.vertexShader.replace(
                        '#include <project_vertex>',
                        `
                        vec4 mvPosition = vec4( transformed, 1.0 );

                        #ifdef USE_INSTANCING
                            mvPosition = modelViewMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
                            float instScale = length( instanceMatrix[0].xyz );
                            vec2 anchorOffset = vec2(0.0, 0.0);
                            ${this._getAnchorShaderInjection(config)}

                            // Size attenuation logic
                            bool isSizeAttenuation = ${(config as any).sizeAttenuation !== false};
                            if (!isSizeAttenuation) {
                                instScale *= -mvPosition.z;
                                instScale *= 2.0;
                            }

                            mvPosition.xy += (position.xy + anchorOffset * 10.0) * instScale;
                        #else
                            mvPosition = modelViewMatrix * mvPosition;
                        #endif

                        gl_Position = projectionMatrix * mvPosition;
                        `
                    );

                    if ((config as any).sizeAttenuation === false) {
                        shader.vertexShader = shader.vertexShader.replace(
                            'gl_Position = projectionMatrix * mvPosition;',
                            `
                            gl_Position = projectionMatrix * mvPosition;
                            gl_Position /= gl_Position.w;
                            `
                        );
                    }
                };

                VectorTileRenderLayer._materialCache.set(cacheKey, meshMaterial);
            }
        } else {
            // Geometry Cache
            const geomKey = 'Circle_5_8';
            baseGeometry = VectorTileRenderLayer._geometryCache.get(geomKey)!;
            if (!baseGeometry) {
                baseGeometry = new CircleGeometry(5, 8);
                VectorTileRenderLayer._geometryCache.set(geomKey, baseGeometry);
            }

            if (!meshMaterial) {
                meshMaterial = new MeshBasicMaterial({
                    color: (config as any).color || 0xffffff,
                    transparent: true,
                    opacity: config.opacity ?? 1,
                    side: DoubleSide,
                    depthTest: false
                });
                VectorTileRenderLayer._materialCache.set(cacheKey, meshMaterial);
            }
        }

        const instancedMesh = new InstancedMesh(baseGeometry, meshMaterial, instances.length);
        instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);
        instancedMesh.frustumCulled = false; // Instances positions are local offsets, bounding sphere can't cover them

        const dummy = new Object3D();

        instances.forEach((inst, i) => {
            dummy.position.copy(inst.position);
            dummy.scale.setScalar(inst.scale);
            dummy.rotation.set(0, 0, inst.rotation);
            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);

            if (inst.color) {
                instancedMesh.setColorAt(i, inst.color);
            }
        });

        return instancedMesh;
    }

    /**
     * Create fill mesh from vertices and indices
     * 从顶点和索引创建面网格
     */
    private _createFillMesh(vertices: number[], indices: number[], config: PaintConfig): any {
        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setIndex(indices);

        const material = new MeshBasicMaterial({
            color: (config as any).fillColor || (config as any).color || 0xffffff,
            transparent: true,
            opacity: (config as any).fillOpacity ?? config.opacity ?? 1,
            side: DoubleSide,
            depthWrite: false
        });

        return new Mesh(geometry, material);
    }

    /**
     * Placeholder function: Evaluate if feature properties satisfy filter conditions (needs to implement complex Mapbox GL style spec).
     * 占位函数：评估要素属性是否满足过滤条件 (需要实现复杂的 Mapbox GL 样式规范)。
     * 
     * @param filter Filter expression in style rule. 样式规则中的 filter 表达式。
     * @param properties Feature properties object. 要素的属性对象。
     * @param layerName Name of tile layer the current feature belongs to (can be used for filtering). 当前要素所属的瓦片图层名称 (可用于过滤)。
     * @returns {boolean} Whether it matches. 是否匹配。
     */
    private _evaluateFilter(filter: any, properties: any, layerName: string, geometryType: string): boolean {
        if (!filter || filter === true) return true;
        const extendedProps = {
            ...properties,
            $layer: layerName,
            $type: geometryType  
        };

        return matchFilter(filter, extendedProps);
    }

    /**
     * Hide Features of a tile (do not destroy).
     * Used for tile-hidden event.
     * 隐藏某个瓦片的 Features（并不销毁）。
     * 用于 tile-hidden 事件。
     * 
     * @param tileKey Tile identifier. 瓦片标识符。
     */
    public hideFeaturesByTileKey(tileKey: string): void {
        const features = this._tileFeatureMap.get(tileKey);
        if (features) {
            // console.log(`Cache hit when hiding ${tileKey}`);
            features.forEach(f => {
                f.visible = false;
                // console.log(`I am hidden ${f.id}`);
            });
        }
    }

    /**
     * Completely clean up all Features loaded by a tile.
     * Used for tile-unload event.
     * 彻底清理某个瓦片加载的所有 Feature。
     * 用于 tile-unload 事件。
     * 
     * @param tileKey Tile identifier. 瓦片标识符。
     */
    public removeFeaturesByTileKey(tileKey: string): void {
        this._removeFeaturesByTileKey(tileKey);
    }

    private _removeFeaturesByTileKey(tileKey: string): void {
        const features = this._tileFeatureMap.get(tileKey);
        // console.log(features, 'Unloaded vector tile features')
        //   console.log(features, 'Read vector tile')
        if (features) {
            // Clean up shared meshes for MergedFeatures
            // 清理 MergedFeatures 的共享网格
            const sharedMeshes = new Set<Object3D>();
            features.forEach(f => {
                if (f instanceof MergedFeature && f._sharedMesh) {
                    sharedMeshes.add(f._sharedMesh);
                }
            });

            // Dispose shared meshes
            // 释放共享网格资源
            sharedMeshes.forEach(mesh => {
                this.remove(mesh);
                if ((mesh as any).geometry) {
                    // Check if geometry is cached (shared)
                    let isCached = false;
                    for (const cachedGeom of VectorTileRenderLayer._geometryCache.values()) {
                        if (cachedGeom === (mesh as any).geometry) {
                            isCached = true;
                            break;
                        }
                    }
                    if (!isCached) {
                        (mesh as any).geometry.dispose();
                    }
                }
                if ((mesh as any).material) {
                    const material = (mesh as any).material;
                    // 仅当材质不在缓存中时才销毁 (缓存的材质是共享的，应保留)
                    let isCached = false;
                    for (const cachedMat of VectorTileRenderLayer._materialCache.values()) {
                         if (Array.isArray(material)) {
                             // 复杂情况暂不处理，假设 VectorTileRenderLayer 仅使用单一材质
                         } else {
                             if (cachedMat === material) {
                                 isCached = true;
                                 break;
                             }
                         }
                    }

                    if (!isCached) {
                        if (Array.isArray(material)) {
                            material.forEach((m: any) => m.dispose());
                        } else {
                            material.dispose();
                        }
                    }
                }
            });

            features.forEach(f => {
                // 调用 Feature 自身的销毁和移除逻辑
                // console.log(`Destroying feature ${f.id}`);
                
                // 重要：对于 MergedFeature，必须确保不会重复销毁共享网格
                f._remove();
            });
            this._tileFeatureMap.delete(tileKey);
        }
    }

    // --- Feature Factory Methods ---
    // --- Feature 工厂方法 ---

    /**
     * Create corresponding Feature instance based on GeoJSON type.
     * 根据 GeoJSON 类型创建对应的 Feature 实例
     */
    private _createFeatureInstance(geometry: any, type: string, paint: any, properties: any): Feature | null {
        const dummyGeometry = geometry;
        const options = {
            geometry: {
                ismvt: true,
                ...dummyGeometry
            },
            paint: paint,
            userData: properties
        };
        // 1 = Point, 2 = LineString, 3 = Polygon
        switch (type) {
            case 'Point': // Point
                // Marker inherits from Point Feature
                // Marker 继承自 Point Feature
                // console.log(options, 'Point feature')
                return new Marker(options);
            case 'LineString': // LineString
                return new LineString(options);
            case 'Polygon': // Polygon
            case 'MultiPolygon':
                return new Polygon(options as any); 
            default:
                // console.warn(`Unsupported vector tile geometry type: ${type} 不支持的矢量瓦片几何类型: ${type}`);
                return null;
        }
    }

    // --- Lifecycle, Paint and Update ---
    // --- 生命周期、样式和更新 ---

    private _getAnchorShaderInjection(config: any): string {
        // Sprite default center is (0.5, 0.5)
        // User anchor: 'bottom-left' -> (0, 0)
        // Offset = (0.5 - anchorX, 0.5 - anchorY)
        // We need to shift geometry so that the 'anchor point' is at (0,0,0) in world space
        // Currently geometry center is at (0,0,0).
        // If anchor is bottom-left (0,0), we want the bottom-left of image to be at (0,0,0).
        // Current bottom-left of Plane(10,10) is (-5, -5).
        // So we need to shift geometry by (+5, +5).
        // Offset X = (0.5 - 0) * 10 = 5. Correct.
        // Offset Y = (0.5 - 0) * 10 = 5. Correct.
        
        let anchor = [0.5, 0.5]; // Default center
        if (config.anchor) {
            if (typeof config.anchor === 'string') {
                switch(config.anchor) {
                    case 'center': anchor = [0.5, 0.5]; break;
                    case 'bottom': anchor = [0.5, 0.0]; break;
                    case 'bottom-left': anchor = [0.0, 0.0]; break; // 修正：Mapbox/Sprite 习惯 bottom-left 可能是 (0,0) ? 
                    // Wait, Three.js Sprite: (0,0) is bottom-left. (1,1) is top-right.
                    // If user says 'bottom-left', they expect the bottom-left corner of icon to be at position.
                    // So anchor = [0, 0].
                    case 'bottom-right': anchor = [1.0, 0.0]; break;
                    case 'top': anchor = [0.5, 1.0]; break;
                    case 'top-left': anchor = [0.0, 1.0]; break;
                    case 'top-right': anchor = [1.0, 1.0]; break;
                    case 'left': anchor = [0.0, 0.5]; break;
                    case 'right': anchor = [1.0, 0.5]; break;
                }
            } else if (Array.isArray(config.anchor)) {
                anchor = config.anchor;
            }
        }
        
        // Offset calculation:
        // Geometry Center (0,0) corresponds to Anchor(0.5, 0.5).
        // We want Anchor(u, v) to be at (0,0).
        // Shift = (0.5 - u, 0.5 - v)
        const offsetX = 0.5 - anchor[0];
        const offsetY = 0.5 - anchor[1];
        
        return `anchorOffset = vec2(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)});`;
    }

    /**
     * Set feature filter function.
     * 设置要素过滤函数
     * @param filter Filter function (feature => boolean)
     */
    public setFeatureFilter(filter: any): void {
        this._activeFeatureFilter = filter;
        // Reload all visible tiles to apply new filtering rules (requires VectorTileLayer to trigger reload)
        // 重新加载所有可见瓦片以应用新的过滤规则 (需要 VectorTileLayer 触发 reload)
        // ⚠️ Optimization: For loaded Features, can only update visibility/style instead of recreating
        // ⚠️ 优化：对于已加载的 Features，可以只进行可见性/样式更新，而非重新创建
    }

    public clearFeatureFilter(): void {
        this._activeFeatureFilter = undefined;
    }

    public setOpacity(opacity: number): void {
        this.opacity = opacity;
        // Iterate through all Features and apply new opacity
        // 遍历所有 Features 并应用新的透明度
        this._tileFeatureMap.forEach(features => {
            features.forEach(f => {
                if (f.material) {
                    f.material.opacity = opacity;
                    f.material.transparent = opacity < 1;
                }
            });
        });
    }

    /**
     * Start listening to map update events when Layer is added to Map.
     * Layer 绑定到 Map 时，开始监听地图更新事件
     */
    // public onAdd(map: MapClass): void {
    //     // super.onAdd(map);
    //     // Listen for map move events to update Features when map center (prjcenter) changes
    //     // 监听地图移动事件，以便在地图中心点 (prjcenter) 变化时更新 Features
    //     // (map as any).on('move', this._onMapUpdate);
    // }

    /**
     * Stop listening when Layer is removed from Map.
     * Layer 从 Map 移除时，取消监听
     */
    // public onRemove(map: MapClass): void {
    //     // (map as any).off('move', this._onMapUpdate);
    //     // super.onRemove(map);
    //     this.dispose();
    // }

    /**
     * Map update callback: Force all loaded Features to recalculate their local world coordinates.
     * 地图更新回调：强制所有已加载的 Features 重新计算其局部世界坐标。
     */
    private _onMapUpdate(): void {
        // console.log(`Map update callback 地图更新回调`);
        // const now = Date.now();
        // // Simple throttle: do not recalculate within 50ms (adjust based on experience)
        // // 简单限流：50ms 内不重复计算（可根据体验调整）
        // if (now - this._lastUpdateTime < 50) {
        //     return;
        // }
        // this._lastUpdateTime = now;
    
        // this._tileFeatureMap.forEach(features => {
        //     features.forEach(feature => {
        //         // Force Feature to re-execute geometry initialization and coordinate conversion
        //         // 强制 Feature 重新执行几何体初始化和坐标转换
        //         feature.initializeGeometry();
        //     });
        // });
    }

    /**
     * Set paint rules and refresh the layer.
     * 设置样式规则并刷新图层。
     * @param paint New paint rules. 新的样式规则。
     */
    public setPaint(paint: PaintRule[]): void {
        // Clean up all existing features and meshes properly
        // 必须正确清理所有现有的要素和网格
        // Use Array.from to avoid iterator issues when deleting keys
        Array.from(this._tileFeatureMap.keys()).forEach(key => {
            this.removeFeaturesByTileKey(key);
        });

        this.paint = paint;
        // No need to call this.clear() as removeFeaturesByTileKey handles removal from scene and _feaList
    }

    /**
     * Update symbol for specific rule (by index).
     * 更新指定规则的符号 (按索引)。
     * @param index Rule index to update. 要更新的规则索引。
     * @param symbol New symbol configuration. 新的符号配置。
     */
    public updateSymbol(index: number, symbol: PaintConfig): void {
        if (this.paint && this.paint[index]) {
            // Clean up all existing features and meshes properly
            // 必须正确清理所有现有的要素和网格
            Array.from(this._tileFeatureMap.keys()).forEach(key => {
                this.removeFeaturesByTileKey(key);
            });

            this.paint[index].paint = symbol;
        }
    }

    /**
     * OverlayLayer abstract method implementation.
     * OverlayLayer 抽象方法实现
     */
    protected validateFeature(feature: Feature): boolean {
        return feature instanceof Feature;
    }

    /**
     * Three.js render loop update method.
     * Three.js 渲染循环更新方法
     */
    // public update(camera: Camera): void {
    //     // Leave empty or call super.update(camera)
    //     // 留空或调用 super.update(camera)
    // }

    public dispose(): void {
        // Clean up all Features
        // 清理所有 Features
        this._tileFeatureMap.forEach((_features, tileKey) => {
            this._removeFeaturesByTileKey(tileKey);
        });
        super.dispose();
    }

    public setLineColor(color: string | number): void {
        VectorTileRenderLayer._materialCache.forEach((mat: any) => {
            if ((mat && (mat.isLineMaterial || mat.isLineBasicMaterial)) && mat.color) {
                mat.color.set(color as any);
            }
        });
        this.children.forEach(obj => {
            const mat: any = (obj as any).material;
            if (mat && (mat.isLineMaterial || mat.isLineBasicMaterial) && mat.color) {
                mat.color.set(color as any);
            }
        });
    }
}

/**
 * Merged Feature Proxy Class
 * 合并要素代理类
 * 
 * @description
 * A virtual feature that proxies interactions to a shared merged mesh.
 * Does not hold its own geometry.
 * 
 * 虚拟要素代理，将交互操作代理到共享的合并网格上。
 * 不持有自己的几何体。
 */
class MergedFeature extends Feature {
    public _sharedMesh?: Object3D; // Reference to shared mesh (only on the first feature of a batch)
    // private _startIndex: number;   // Start index in the buffer
    // private _vertexCount: number;  // Vertex count in the buffer

    /**
     * @param options Basic properties (id, properties, paint, geometry type)
     *                基本属性（id, properties, paint, geometry type）
     * @param startIndex Start index in the shared mesh geometry
     *                   共享网格几何体中的起始索引
     * @param vertexCount Number of vertices used by this feature
     *                    此要素使用的顶点数量
     */
    constructor(sharedMesh: Object3D, options: any, _startIndex: number, _vertexCount: number) {
        // Ensure options is valid to prevent super() crash
        if (!options) {
             console.error("MergedFeature: options is undefined! Using fallback.");
             options = { geometry: { type: 'Merged', coordinates: [] }, id: 'fallback' };
        }
        // console.log("MergedFeature constructor", options);
        super(options);
        this._sharedMesh = sharedMesh;
        // this.id = options.id; // Handled by super
        // this.userData = options.userData; // Handled by super
        // this._paintConfig = options.paint; // Handled by super (as _paint)
        
        // Virtual geometry (not real buffer data, just logic)
        // 虚拟几何体（非真实缓冲数据，仅逻辑）
        // this._geometry = options.geometry; // Handled by super

        // this._startIndex = startIndex;
        // this._vertexCount = vertexCount;

        // Make sure it's not added to scene graph directly
        // 确保它不直接添加到场景图
        this.matrixAutoUpdate = false;
        this.visible = true;
    }

    public _buildRenderObject(): void {
        // Return a dummy object or the shared mesh itself (but be careful not to re-add)
        // 返回一个虚拟对象或共享网格本身（但要注意不要重新添加）
        // Returning null might break some logic expecting an object.
        // Returning a new Group() is safest as a placeholder.
        // return new Object3D();
    }

    _coordsTransform(): any {
        return new Vector3();
    }

    protected validateFeature(_feature: Feature): boolean {
        return true;
    }

    /**
     * Override _remove to handle shared mesh cleanup
     * 重写 _remove 以处理共享网格清理
     */
    _remove() {
        // 重写默认的 remove 方法，避免 Feature 类自动销毁共享网格（如果存在）。
        // Layer 会在 _removeFeaturesByTileKey 中统一处理共享网格的销毁。
        // MergedFeature 仅仅是一个代理。
        
        // 从内部列表移除，但【不要】在这里 dispose 网格。
        if (this._sharedMesh) {
             this._sharedMesh = undefined;
        }

        return super._remove();
    }

    /**
     * Override setVisible to handle buffer hiding (Advanced)
     * 重写 setVisible 以处理缓冲区的隐藏（进阶）
     */
    // public set visible(value: boolean) {
    //    // TODO: Implement vertex collapsing to hide specific feature
    //    super.visible = value;
    // }
}

/**
 * Instanced Feature Proxy Class
 * 实例化要素代理类
 * 
 * @description
 * A virtual feature for InstancedMesh.
 * 实例化网格的虚拟要素。
 */
class InstancedFeature extends MergedFeature {
    // Instance ID in the InstancedMesh
    // InstancedMesh 中的实例 ID
    // (Stored in _startIndex from parent class)
    
    constructor(sharedMesh: Object3D, options: any, instanceId: number, count: number = 1) {
        super(sharedMesh, options, instanceId, count);
    }

    // Override to update specific instance
    // 重写以更新特定实例
    // public set visible(value: boolean) {
    //     // Update scale to 0 or move to infinity to hide
    //     super.visible = value;
    // }
}
