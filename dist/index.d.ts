import { AmbientLight } from 'three';
import { BaseEvent } from 'three';
import { BufferGeometry } from 'three';
import { BufferGeometryEventMap } from 'three';
import { Camera } from 'three';
import { Clouds } from '@pmndrs/vanilla';
import { Color } from 'three';
import { DirectionalLight } from 'three';
import { EventDispatcher } from 'three';
import { Group } from 'three';
import { Intersection } from 'three';
import { Line2 } from 'three-stdlib';
import { LineString as LineString_2 } from 'geojson';
import { LoadingManager } from 'three';
import { MapControls } from 'three-stdlib';
import { Material } from 'three';
import { Matrix4 } from 'three';
import { Mesh } from 'three';
import { MeshStandardMaterial } from 'three';
import { MeshStandardMaterialParameters } from 'three';
import { MultiLineString as MultiLineString_2 } from 'geojson';
import { MultiPoint } from 'geojson';
import { MultiPolygon } from 'geojson';
import { NormalBufferAttributes } from 'three';
import { Object3D } from 'three';
import { Object3DEventMap } from 'three';
import { PerspectiveCamera } from 'three';
import { PlaneGeometry } from 'three';
import { Point as Point_2 } from 'geojson';
import { Points } from 'three';
import { PointsMaterial } from 'three';
import { Polygon as Polygon_2 } from 'geojson';
import { Raycaster } from 'three';
import { Scene } from 'three';
import { Texture } from 'three';
import { Vector2 } from 'three';
import { Vector3 } from 'three';
import { VectorTile } from '@mapbox/vector-tile';
import { WebGLRenderer } from 'three';

/**
 * 抽象 Canvas 材质加载器
 * @abstract
 * @description 用于程序化生成纹理 (Procedural Textures)
 */
export declare abstract class AbstractCanvasMaterialLoader extends AbstractMaterialLoader {
    readonly info: {
        version: string;
        description: string;
    };
    /**
     * 重写 load 方法以支持 Canvas 特有的材质创建逻辑
     * @param context
     */
    load(context: SourceLoadContext): Promise<TileMaterial>;
    /**
     * 实现父类的 abstract 方法 (虽然在这里我们重写了 load，可能不会用到 performLoad，
     * 但为了满足 TypeScript 契约，我们还是需要实现它，或者抛出错误)
     */
    protected performLoad(_url: string, _context: SourceLoadContext): Promise<Texture>;
    /**
     * 绘制瓦片内容
     * @param ctx
     * @param context
     */
    protected abstract drawTile(ctx: OffscreenCanvasRenderingContext2D, context: SourceLoadContext): void;
    /**
     * 创建 Canvas 上下文并设置坐标系
     * @param width
     * @param height
     */
    private createCanvasContext;
}

/**
 * 抽象几何体加载器基类
 * @abstract
 */
export declare abstract class AbstractGeometryLoader implements IGeometryLoader<MapTileGeometry> {
    readonly info: LoaderMetadata;
    abstract readonly dataType: string;
    /**
     * 从数据源加载瓦片几何数据
     * @param context 加载上下文
     * @returns Promise<MapTileGeometry>
     */
    load(context: SourceLoadContext): Promise<MapTileGeometry>;
    /**
     * 执行实际加载逻辑 (由子类实现)
     * @param url 数据 URL
     * @param context 加载上下文
     */
    protected abstract performLoad(url: string, context: SourceLoadContext): Promise<MapTileGeometry>;
}

/**
 * 抽象材质加载器基类
 * @class AbstractMaterialLoader
 */
export declare abstract class AbstractMaterialLoader implements IMaterialLoader<ITileMaterial> {
    readonly info: LoaderMetadata;
    abstract readonly dataType: string;
    /**
     * 从数据源加载材质
     * @param context 加载上下文
     */
    load(context: SourceLoadContext): Promise<ITileMaterial>;
    /**
     * 卸载材质资源
     * @param material
     */
    unload(material: ITileMaterial): void;
    /**
     * 执行实际加载逻辑 (由子类实现)
     * @param url 数据 URL
     * @param context 加载上下文
     */
    protected abstract performLoad(url: string, context: SourceLoadContext): Promise<Texture>;
}

/**
 * Animation pause parameters.
 * 动画暂停参数
 */
declare interface AnimationPauseParams {
    /**
     * Whether to pause.
     * 是否暂停
     */
    paused: boolean;
}

/**
 * Animation play parameters.
 * 动画播放参数
 */
declare interface AnimationPlayParams {
    /**
     * Animation name or index.
     * 动画名称或索引
     */
    name: string | number;
    /**
     * Whether to loop.
     * 是否循环播放
     */
    loop?: boolean;
    /**
     * Playback speed.
     * 播放速度
     */
    speed?: number;
    /**
     * Fade in duration (seconds).
     * 淡入时间(秒)
     */
    fadeInDuration?: number;
    /**
     * Fade out duration (seconds).
     * 淡出时间(秒)
     */
    fadeOutDuration?: number;
    /**
     * Start playback from specified time (seconds).
     * 从指定时间开始播放(秒)
     */
    startAt?: number;
    /**
     * Animation weight (0-1).
     * 动画权重(0-1)
     */
    weight?: number;
}

/**
 * Animation speed parameters.
 * 动画速度参数
 */
declare interface AnimationSpeedParams {
    /**
     * Playback speed.
     * 播放速度
     */
    speed: number;
}

/**
 * Animation update parameters.
 * 动画更新参数
 */
declare interface AnimationUpdateParams {
    /**
     * Time delta (seconds).
     * 时间增量(秒)
     */
    deltaTime: number;
}

/**
 * ArcGIS地形数据源类
 * @description 提供ArcGIS在线地形高程数据
 * @extends TileSource
 */
export declare class ArcGisDemSource extends TileSource {
    /**
     * 数据类型标识
     * @default "lerc"
     */
    dataType: string;
    /**
     * 数据源版权信息
     * @default "ArcGIS"
     */
    attribution: string;
    /**
     * 最小层级
     * @default 6
     */
    minLevel: number;
    /**
     * 最大层级
     * @default 13
     */
    maxLevel: number;
    /**
     * 瓦片URL模板
     * @default "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}"
     */
    url: string;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: SourceOptions);
}

/**
 * ArcGIS LERC 地形加载器
 * @class ArcGISLercLoader
 * @description 加载并解析 LERC (Limited Error Raster Compression) 格式的高程数据
 */
export declare class ArcGISLercLoader extends AbstractGeometryLoader {
    readonly info: {
        version: string;
        description: string;
    };
    readonly dataType = "lerc";
    private fileLoader;
    private workerPool;
    constructor();
    /**
     * 执行加载
     * @param url
     * @param context
     */
    protected performLoad(url: string, context: SourceLoadContext): Promise<MapTileGeometry>;
}

/**
 * ArcGIS影像数据源类
 * @description 提供ArcGIS在线地图服务的瓦片数据
 * @extends TileSource
 */
export declare class ArcGisSource extends TileSource {
    /**
     * 数据类型标识
     * @default "image"
     */
    dataType: string;
    /**
     * 数据源版权信息
     * @default "ArcGIS"
     */
    attribution: string;
    /**
     * 地图样式
     * @default "World_Imagery"
     */
    style: string;
    /**
     * 瓦片URL模板
     * @default "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}"
     */
    url: string;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options?: ArcGisSourceOptions);
}

/**
 * ArcGIS影像源配置选项
 * @extends SourceOptions
 */
export declare type ArcGisSourceOptions = SourceOptions & {
    /**
     * 地图样式
     * @default "World_Imagery"
     */
    style?: string;
};

/**
 * Arrow paint configuration.
 * 箭头流动线样式
 * @category Paint
 */
export declare interface ArrowPaint extends BasePaint {
    type: 'arrow';
    /** 箭头颜色 */
    color?: string | number | Color;
    /** 线条宽度 */
    width?: number;
    /** 箭头长度 */
    arrowLength?: number;
    /** 箭头间距 */
    arrowSpacing?: number;
    /** 速度因子 */
    speed?: number;
    /** 拐角半径 */
    cornerRadius?: number;
}

declare class Base {
}

declare type BaseDrawToolOptions = MapToolOptions & {
    /** 模式名称，例如 'line' / 'polygon' / 'point' */
    mode: string;
    /** 是否在一次绘制结束后自动禁用工具 */
    once?: boolean;
};

/**
 * @category Core
 */
export declare interface BaseEventMap<Target = any> {
    /** 触发事件的目标对象（泛型） */
    target?: Target;
    /** 原始的DOM事件对象 */
    originEvent: Event;
    /** 事件名称（可选） */
    eventName?: string;
    /** 屏幕坐标信息 */
    screenXY: {
        X: number;
        Y: number;
    };
}

/**
 * Base paint interface.
 * 基础样式接口
 * @category Paint
 */
export declare interface BasePaint {
    /** 是否可见 */
    visible?: boolean;
    /** 透明度 (0-1) */
    opacity?: number;
    /** 渲染层级 */
    zIndex?: number;
    /** 碰撞检测优先级 */
    collisionPriority?: number;
    /** 可选：深度偏移等级（整数） */
    depthOffset?: number;
    depthTest?: boolean;
    depthWrite?: boolean;
    transparent?: boolean;
    alphaTest?: number;
    /** 发光配置（可选，配合全局 bloom 后处理） */
    bloom?: boolean | {
        /** 是否启用发光（默认 true） */
        enabled?: boolean;
        /** 发光强度（默认 1.0） */
        intensity?: number;
        /** 发光颜色（默认 '#ffffff'） */
        color?: string;
    };
}

/**
 * Tile Layer abstract base class.
 * 瓦片图层抽象基类
 *
 * @description
 * Provides basic implementation skeleton for tile-based layers.
 * It handles the creation and management of the tile tree, LOD (Level of Detail) updates, and visibility.
 *
 * 提供基于瓦片的图层的基本实现骨架。
 * 它处理瓦片树的创建和管理、LOD（细节层次）更新和可见性。
 *
 * @abstract
 * @extends Layer
 * @implements ITileLayer
 * @category Layer
 */
declare abstract class BaseTileLayer extends Layer implements ITileLayer {
    readonly layerId: string;
    /**
     * Whether the layer is a tile layer.
     * 是否为瓦片图层。
     * @readonly
     */
    readonly isTileLayer = true;
    /**
     * Layer type identifier.
     * 图层类型标识符。
     * @readonly
     */
    readonly layerType: string;
    /**
     * Whether it is a base layer (background map).
     * 是否是底图。
     * @readonly
     */
    readonly isBaseLayer = false;
    protected _enabled: boolean;
    protected _visible: boolean;
    /**
     * Root tile instance.
     * 根瓦片实例。
     * @protected
     */
    protected _rootTile: Tile;
    /**
     * Loader instance.
     * 加载器实例。
     * @protected
     */
    protected _loader: ICompositeLoader;
    private _LODThreshold;
    /**
     * Whether it is a scene layer (e.g. 3D objects).
     * 是否是场景图层。
     * @readonly
     */
    readonly isSceneLayer = false;
    /**
     * Layer opacity.
     * 图层透明度。
     */
    opacity: number;
    /**
     * Layer data source(s).
     * 图层数据源。
     * @readonly
     */
    readonly source: ISource | ISource[];
    /**
     * Layer projection.
     * 图层投影。
     * @readonly
     */
    readonly projection: MapProjection;
    /**
     * Minimum zoom level.
     * 最小缩放级别。
     */
    minLevel: number;
    /**
     * Maximum zoom level.
     * 最大缩放级别。
     */
    maxLevel: number;
    /**
     * Create a new BaseTileLayer instance.
     * 创建一个新的 BaseTileLayer 实例。
     *
     * @param layerId Unique layer identifier. 图层唯一标识符。
     * @param options Layer configuration options. 图层配置选项。
     */
    constructor(layerId: string, options: BaseTileLayerOptions);
    /**
     * Get LOD threshold.
     * 获取LOD阈值
     *
     * @returns {number} The current LOD threshold. 当前 LOD 阈值。
     */
    get LODThreshold(): number;
    /**
     * Set LOD threshold.
     * 设置LOD阈值
     *
     * @param value Recommended value between 1-2. Smaller values mean higher detail. 建议取值1-2之间。值越小细节越高。
     */
    set LODThreshold(value: number);
    /**
     * Get the tile loader instance.
     * 获取瓦片加载器实例。
     */
    get loader(): ICompositeLoader;
    /**
     * Create the tile loader for this layer.
     * 创建此图层的瓦片加载器。
     *
     * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
     * @protected
     * @abstract
     */
    protected abstract createLoader(): ICompositeLoader;
    /**
     * Get layer enabled state.
     * 获取图层启用状态。
     */
    get enabled(): boolean;
    /**
     * Set layer enabled state.
     * 设置图层启用状态。
     *
     * @param value True to enable, false to disable. True 启用，False 禁用。
     */
    set enabled(value: boolean);
    /**
     * Get layer internal visibility.
     * 获取图层内部可见性。
     *
     * @description
     * Combines layer specific visibility with base class visibility.
     * 结合图层特定可见性和基类可见性。
     */
    get ivisible(): boolean;
    /**
     * Set layer internal visibility.
     * 设置图层内部可见性。
     */
    set ivisible(value: boolean);
    /**
     * Update the layer.
     * 更新图层。
     *
     * @description
     * Called every frame to update the tile tree based on the camera.
     * 每帧调用以根据相机更新瓦片树。
     *
     * @param camera The camera used for rendering. 用于渲染的相机。
     */
    update(camera: Camera): void;
    private _debugTileTree;
    /**
     * Get LOD threshold - Missing function implementation.
     * 获取LOD阈值 - 缺失的函数实现
     * @description Control threshold for tile detail level. 控制瓦片细节级别的阈值
     * @returns {number} LOD threshold, smaller value means easier to trigger subdivision. LOD阈值，值越小越容易触发瓦片细分。
     */
    protected _getLODThreshold(): number;
    /**
     * Get current max loaded tile level (for debugging).
     * 获取当前显示的瓦片层级（用于调试）。
     * @private
     */
    private _getCurrentTileLevel;
    /**
     * Dispose the layer and resources.
     * 销毁图层和资源。
     *
     * @description
     * Removes the root tile and cleans up resources.
     * 移除根瓦片并清理资源。
     */
    dispose(): void;
    /**
     * Reload the layer data.
     * 重新加载图层数据。
     */
    reload(): void;
    /**
     * Set the base elevation of the layer.
     * 设置图层整体抬高。
     *
     * @param elevation The elevation value. 抬高高度。
     */
    setElevation(elevation: number): void;
    /**
     * Raise the layer elevation by a delta.
     * 在现有基础上增加抬高。
     *
     * @param delta The elevation difference to add. 增加的高度。
     */
    raiseElevation(delta: number): void;
    /**
     * Get current layer elevation.
     * 获取当前高程。
     *
     * @returns {number} The current elevation (y-coordinate). 当前高程（y坐标）。
     */
    getElevation(): number;
}

/**
 * Tile Layer configuration interface.
 * 瓦片图层配置接口
 *
 * @description
 * Base configuration options for all tile layers.
 * 所有瓦片图层的基本配置选项。
 * @category Layer
 */
declare interface BaseTileLayerOptions extends LayerOptions {
    /**
     * Data source(s) for the layer.
     * 图层数据源。
     */
    source: ISource | ISource[];
    /**
     * Projection system used by the layer.
     * 图层使用的投影系统。
     */
    projection: MapProjection;
    /**
     * Minimum zoom level.
     * 最小缩放级别。
     * @default 2
     */
    minLevel?: number;
    /**
     * Maximum zoom level.
     * 最大缩放级别。
     * @default 19
     */
    maxLevel?: number;
    /**
     * Level of Detail (LOD) threshold.
     * 细节层次（LOD）阈值。
     * @default 1
     */
    LODThreshold?: number;
    /**
     * Layer opacity (0-1).
     * 图层透明度 (0-1)。
     * @default 1
     */
    opacity?: number;
}

/**
 * Camera configuration options.
 * 相机配置选项
 * @category Map
 */
export declare type CameraOptions = {
    /** Camera pitch angle in degrees (0 = looking straight down) 俯仰角（度，0为垂直向下看） */
    pitch?: number;
    /** Camera bearing angle in degrees (0 = north) 方位角（度，0为正北） */
    bearing?: number;
    /** Minimum camera distance 最小相机距离 */
    minDistance?: number;
    /** Maximum camera distance 最大相机距离 */
    maxDistance?: number;
};

/**
 * Circle paint configuration.
 * 基础点样式配置
 * @category Paint
 */
export declare interface CirclePaint extends BasePaint {
    type: 'circle';
    /** 点颜色 */
    color?: string | number | Color;
    /** 点大小 */
    size: number;
    /** 是否发光 */
    glow?: boolean;
    /** 是否随距离衰减 */
    sizeAttenuation?: boolean;
}

/** 类选项类型  * @category Core
 /** 类选项类型 */
declare type ClassOptions = Record<string, any>;

/**
 * Cloud feature configuration options.
 * 云朵要素配置选项
 *
 * @extends PointOptions
 * @category Feature
 */
export declare type CloudOptions = PointOptions & {};

/**
 * Cloud paint configuration.
 * 云朵样式配置
 * @category Paint
 */
export declare type CloudPaint = BasePaint & CloudProps & {
    type: 'cloud';
};

/**
 * 云朵属性配置
 * @category Paint
 */
export declare type CloudProps = {
    /** 随机种子 */
    seed?: number;
    /** 分段/粒子数量 */
    segments?: number;
    /** 3D边界范围 */
    bounds?: Vector3;
    /** 分布方式 */
    concentrate?: 'random' | 'inside' | 'outside';
    /** 缩放比例 */
    scale?: Vector3;
    /** 体积/厚度 */
    volume?: number;
    /** 最小体积 */
    smallestVolume?: number;
    /** 自定义分布函数 */
    distribute?: ((cloud: CloudState, index: number) => {
        point: Vector3;
        volume?: number;
    }) | null;
    /** 生长系数 */
    growth?: number;
    /** 动画速度 */
    speed?: number;
    /** 渐隐距离 */
    fade?: number;
    /** 不透明度 */
    opacity?: number;
    /** 颜色 */
    color?: Color;
    /** 十六进制颜色 */
    hexcolor?: string;
    /** 文本边界 */
    boundstext?: {
        x: number;
        y: number;
        z: number;
    };
};

/**
 * Cloud Effect Layer class.
 * 云层特效图层类
 *
 * @description
 * Specialized layer for rendering and managing cloud effects in 3D scene.
 * Implements cloud effects based on @pmndrs/vanilla Clouds.
 * 用于在3D场景中渲染和管理云层特效的专用图层。
 * 基于@pmndrs/vanilla的Clouds实现云层效果。
 *
 * @extends OverlayLayer<ICloud>
 * @category Layer
 */
export declare class CloudsLayer extends OverlayLayer<ICloud> {
    /**
     * Cloud effect instance.
     * 云层特效实例
     * @description
     * Stores the Clouds instance created by @pmndrs/vanilla.
     * 存储由@pmndrs/vanilla创建的Clouds实例。
     */
    _clouds: Clouds | null;
    /**
     * Constructor.
     * 构造函数
     * @param id Layer unique identifier.
     *           图层唯一标识符
     * @param options Cloud layer options.
     *                云层配置选项
     *
     * @throws {Error} Throws error when texture parameter is missing.
     *                 当缺少必要的texture参数时抛出错误
     */
    constructor(id: string, options: ICloudLayerOptions);
    /**
     * Create cloud effect instance.
     * 创建云层特效实例
     * @param texture Cloud texture (URL or Texture object).
     *                云层纹理（URL或Texture对象）
     *
     * @private
     * @description
     * Asynchronously loads texture and initializes Clouds instance.
     * 异步加载纹理并初始化Clouds实例。
     */
    private _createClouds;
    /**
     * Validate feature type.
     * 验证要素类型
     * @param feature Feature to validate.
     *                待验证的要素
     * @returns Whether it is a valid Cloud feature.
     *          是否为合法的云层要素
     *
     * @description
     * Implement parent abstract method, validate if feature type is 'Cloud'.
     * 实现父类抽象方法，验证要素类型是否为'Cloud'。
     */
    protected validateFeature(feature: ICloud): boolean;
    /**
     * Animation update method.
     * 动画更新方法
     * @param delta Frame interval time (seconds). 帧间隔时间（秒）
     * @param elapsedtime Elapsed time (seconds). 累计时间（秒）
     *
     * @description
     * Called automatically every frame to update cloud animation state.
     * 每帧自动调用，用于更新云层动画状态。
     */
    animate(delta: number, elapsedtime: number): void;
}

/**
 * 云朵状态类型
 * @category Paint
 */
export declare type CloudState = {
    /** 引用组 */
    ref: Group;
    /** 唯一标识 */
    uuid: string;
    /** 索引 */
    index: number;
    /** 分段数 */
    segments: number;
    /** 距离 */
    dist: number;
    /** 变换矩阵 */
    matrix: Matrix4;
    /** 边界范围 */
    bounds: Vector3;
    /** 位置 */
    position: Vector3;
    /** 体积 */
    volume: number;
    /** 长度 */
    length: number;
    /** 速度 */
    speed: number;
    /** 生长系数 */
    growth: number;
    /** 透明度 */
    opacity: number;
    /** 渐隐距离 */
    fade: number;
    /** 密度 */
    density: number;
    /** 旋转角度 */
    rotation: number;
    /** 旋转因子 */
    rotationFactor: number;
    /** 颜色 */
    color: Color;
};

/**
 * Collision Detection and Avoidance Engine
 * 碰撞检测与避让引擎
 *
 * @description
 * Responsible for managing collision detection and avoidance strategies for map features.
 * Uses QuadTree spatial indexing and multiple avoidance strategies to ensure features
 * do not overlap during visualization, providing optimal readability.
 * 负责管理地图要素的碰撞检测和避让策略，通过四叉树空间索引和多种避让策略
 * 确保要素在可视化时不会相互重叠，提供最佳的可读性
 *
 * @example
 * ```typescript
 * const collisionEngine = new CollisionEngine(renderer, {
 *   enabled: true,
 *   maxFeaturesPerFrame: 1000
 * });
 * collisionEngine.registerLayer(mapLayer);
 * ```
 * @category Core
 */
declare class CollisionEngine {
    private renderer;
    private _quadTreeManager;
    private _strategyOrchestrator;
    private _performanceMonitor;
    /**
     * Registered layers set
     * 注册的图层集合
     */
    private _layers;
    /**
     * Collision configuration
     * 碰撞检测配置
     */
    private _config;
    /**
     * Whether updating (prevent duplicate updates)
     * 是否正在更新中（防止重复更新）
     */
    private _isUpdating;
    /**
     * Last update timestamp
     * 上次更新时间戳
     */
    private _lastUpdateTime;
    /**
     * Frame counter
     * 帧计数器
     */
    private _frameCount;
    /**
     * Create collision detection engine instance
     * 创建碰撞检测引擎实例
     *
     * @param renderer - Three.js renderer instance Three.js 渲染器实例
     * @param config - Collision detection configuration options 碰撞检测配置选项
     */
    constructor(renderer: WebGLRenderer, config?: Partial<ICollisionConfig>);
    /**
     * Update collision detection status
     * 更新碰撞检测状态
     *
     * @description
     * Executes collision detection and avoidance strategies based on current camera position
     * and feature states. Automatically controls update frequency to avoid performance issues.
     * 根据当前相机位置和要素状态，执行碰撞检测和避让策略，
     * 自动控制更新频率以避免性能问题
     *
     * @param camera - Current scene camera 当前场景相机
     * @returns Promise Async result after update completion 更新完成后的异步结果
     */
    update(camera: Camera): Promise<void>;
    /**
     * Reset visibility of all features
     * 重置所有要素的可见性
     *
     * @description
     * Ensures each update starts from a clean state, letting the avoidance engine
     * re-decide the visibility of each feature.
     * 确保每次更新都从干净状态开始，让避让引擎重新决策每个要素的可见性
     */
    private _resetAllFeaturesVisibility;
    /**
     * Register a layer to the collision detection engine
     * 注册图层到碰撞检测引擎
     *
     * @param layer - Overlay layer to register 要注册的覆盖图层
     * @returns Current engine instance (supports chaining) 当前引擎实例（支持链式调用）
     */
    registerLayer(layer: OverlayLayer): this;
    /**
     * Unregister a layer from the collision detection engine
     * 从碰撞检测引擎取消注册图层
     *
     * @param layer - Overlay layer to unregister 要取消注册的覆盖图层
     * @returns Current engine instance (supports chaining) 当前引擎实例（支持链式调用）
     */
    unregisterLayer(layer: OverlayLayer): this;
    /**
     * Update collision detection configuration
     * 更新碰撞检测配置
     *
     * @param newConfig - New configuration options 新的配置选项
     * @returns Current engine instance (supports chaining) 当前引擎实例（支持链式调用）
     */
    setConfig(newConfig: Partial<ICollisionConfig>): this;
    /**
     * Get performance statistics
     * 获取性能统计信息
     *
     * @returns Object containing performance metrics like FPS, processing time, etc. 包含帧率、处理时间等性能指标的对象
     */
    getPerformanceStats(): any;
    /**
     * Initialize internal engine components
     * 初始化引擎内部组件
     *
     * @description
     * Creates QuadTree manager, strategy orchestrator, and performance monitor,
     * and sets up viewport resize handling.
     * 创建四叉树管理器、策略协调器和性能监控器，
     * 并设置视口变化监听
     */
    private _initializeComponents;
    /**
     * Create collision detection context
     * 创建碰撞检测上下文
     *
     * @param camera - Current scene camera 当前场景相机
     * @param timestamp - Current timestamp 当前时间戳
     * @returns Collision detection context object 碰撞检测上下文对象
     */
    private _createCollisionContext;
    /**
     * Collect all collidable features
     * 收集所有可碰撞检测的要素
     *
     * @description
     * Filters features supporting collision detection from all registered layers,
     * and limits the maximum number of features processed per frame.
     * 从所有注册的图层中筛选出支持碰撞检测的要素，
     * 并限制每帧处理的最大数量
     *
     * @returns Array of collidable features 可碰撞检测的要素数组
     */
    private _collectCollidableFeatures;
    /**
     * Apply collision detection results to features
     * 应用碰撞检测结果到要素
     *
     * @description
     * Updates visibility status of each feature based on strategy execution results.
     * 根据策略执行结果更新每个要素的可见性状态
     *
     * @param results - Collision detection results map 碰撞检测结果映射表
     * @param features - Features array 要素数组
     * @returns Promise Async result after application 应用完成后的异步结果
     */
    private _applyCollisionResults;
    /**
     * Setup viewport resize handler
     * 设置视口变化监听器
     *
     * @description
     * Monitors renderer DOM element size changes and automatically updates QuadTree manager's viewport size.
     * 监听渲染器DOM元素尺寸变化，自动更新四叉树管理器的视口大小
     */
    private _setupViewportResizeHandler;
    /**
     * 设置性能监控
     *
     * 定期检查性能统计信息，在性能下降时输出警告
     */
    private _setupPerformanceMonitoring;
}

/**
 * 碰撞原因枚举
 *
 * @description
 * 记录要素可见性变化的详细原因，用于调试和不同原因的特殊处理。
 * @category Core
 */
declare enum CollisionReason {
    /** 无碰撞 - 要素正常显示 */
    NO_COLLISION = "no_collision",
    /** 优先级失败 - 与其他要素碰撞且优先级较低 */
    PRIORITY_LOST = "priority_lost",
    /** 超出视口 - 要素位于屏幕可见区域之外 */
    OUT_OF_VIEWPORT = "out_of_viewport",
    /** 层级过滤 - 当前缩放级别不满足显示条件 */
    ZOOM_FILTERED = "zoom_filtered",
    /** 手动隐藏 - 用户主动隐藏该要素 */
    MANUAL_HIDDEN = "manual_hidden",
    /** 组碰撞 - 与同一组内的其他要素发生碰撞 */
    GROUP_COLLISION = "group_collision"
}

/**
 * 碰撞类型枚举
 *
 * @description
 * 定义不同类型的要素在避让系统中的处理方式。
 * 不同类型的要素使用不同的包围盒计算策略。
 * @category Core
 */
declare enum CollisionType {
    /** 点要素 - 使用圆形或小方形包围盒 */
    POINT = "point",
    /** 线要素的顶点 - 沿线分布的多个点 */
    LINE_VERTEX = "line_vertex",
    /** 面要素的中心点 - 通常用于面要素的标签定位 */
    POLYGON_CENTER = "polygon_center",
    /** 文字标签 - 考虑文字内容和字体大小的矩形区域 */
    LABEL = "label",
    /** 图标要素 - 固定尺寸的方形或圆形区域 */
    ICON = "icon",
    /** 聚合要素 - 代表多个要素的聚合点 */
    CLUSTER = "cluster"
}

/**
 * 综合瓦片加载器
 * @class CompositeTileLoader
 * @description 负责协调加载瓦片的几何体 (Geometry) 和材质 (Material)
 */
export declare class CompositeTileLoader implements ICompositeLoader {
    private _imgSources;
    private _demSource;
    private _vtSource;
    manager: TileLoadingManager;
    get imgSource(): ISource[];
    set imgSource(value: ISource[]);
    get demSource(): ISource | undefined;
    set demSource(value: ISource | undefined);
    get vtSource(): ISource | undefined;
    set vtSource(value: ISource | undefined);
    /**
     * 加载瓦片数据
     * @param context 加载上下文
     */
    load(context: TileLoadContext): Promise<TileMeshData>;
    /**
     * 卸载资源
     * @param tileMesh
     */
    unload(tileMesh: Mesh): void;
    /**
     * 加载几何体
     * @param context
     */
    protected loadGeometry(context: TileLoadContext): Promise<BufferGeometry>;
    /**
     * 加载材质列表
     * @param context
     */
    protected loadMaterials(context: TileLoadContext): Promise<Material[]>;
    private loadFromSource;
    /**
     * 检查瓦片边界是否在数据源范围内
     */
    private isBoundsInSource;
}

/**
 * Custom paint configuration.
 * 自定义样式配置
 * @category Paint
 */
export declare interface CustomPaint extends BasePaint {
    type: 'custom';
    /** Build function 构建函数 */
    build: () => Object3D | Promise<Object3D>;
}

/**
 * @category Map
 */
declare interface DomEventMap extends BaseEventMap<Map_2> {
    /**
     * Geographic coordinate of the event (optional)
     * 事件的地理坐标（可选）
     */
    coordinate?: LngLatLike;
}

/**
 * 单个绘制模式定义：
 * - actions: 参与的事件序列（目前主要是 click / mousemove / dblclick）
 * - create: 第一次点击时创建几何对象
 * - update: 每次新增顶点或移动时更新几何
 * - generate: 结束时生成最终结果（可以是 Feature，也可以是原几何）
 * - clickLimit: 最少点击次数（达到就可以结束，通常配合 dblclick）
 */
declare type DrawModeDefinition = {
    actions: Array<"click" | "mousemove" | "dblclick">;
    create: (start: LngLatLike, evt: DomEventMap) => any;
    update: (coords: LngLatLike[], geometry: any, evt: DomEventMap) => void;
    generate: (geometry: any, coords: LngLatLike[]) => any;
    clickLimit?: number;
};

/**
 * DrawTool：通用绘图工具
 *
 * 负责：
 * - 处理 Map 的 DOM 事件（click/mousemove/dblclick）
 * - 维护顶点序列 _clickCoords
 * - 调用模式定义的 create/update/generate
 * - 向外触发：drawstart / drawvertex / drawend / drawing 等事件
 */
export declare class DrawTool extends MapTool {
    /** 配置 */
    options: DrawToolOptions;
    /** 当前模式定义 */
    private _modeDef?;
    /** 当前绘制中的顶点序列 */
    private _clickCoords;
    /** 是否正在绘制中 */
    private _isDrawing;
    /** 当前绘制中的几何对象（由 mode.create/create 返回） */
    private _geometry;
    /** 内部统一草图图层 */
    private _draftLayer?;
    /**
     * 注册一个绘制模式
     */
    static registerMode(name: string, def: DrawModeDefinition): void;
    /**
     * 获取已注册的模式
     */
    static getModeDefinition(name: string): DrawModeDefinition | undefined;
    constructor(options: DrawToolOptions);
    /**
     * 获取当前模式名称（统一转为小写）
     */
    getMode(): string;
    /**
     * 设置绘制模式：会清空当前绘制状态
     */
    setMode(mode: string): this;
    /**
     * Set drawing paint (only affects new drawings started after this call)
     * - geometryPaint: main geometry paint (point/line/fill)
     * - vertexPaint: vertex paint, pass null to disable anchor point rendering
     */
    setPaint(paint: DrawToolPaintOptions): this;
    /**
     * 子类实现：返回需要绑定到 Map 的事件映射
     */
    protected getEvents(): {
        click: (evt: DomEventMap) => void;
        mousemove: (evt: DomEventMap) => void;
        dblclick: (evt: DomEventMap) => void;
    };
    /**
     * 启用时同步一下模式定义
     */
    protected onEnable(): void;
    /**
     * 禁用时结束当前绘制，并清理草图图层
     */
    protected onDisable(): void;
    /**
     * 确保当前 mode 有对应的定义
     */
    private _ensureMode;
    /**
     * 处理 click 事件：
     * - 第一次 click：开始绘制，调用 mode.create，触发 drawstart
     * - 后续 click：追加顶点，调用 mode.update，触发 drawvertex
     * - 若达到 clickLimit，则结束绘制
     */
    private _handleClick;
    /**
     * 处理 mousemove 事件：
     * - 仅在绘制中才更新几何
     * - 不修改 _clickCoords，只用临时 coords 传给 update
     */
    private _handleMouseMove;
    /**
     * 处理 dblclick：
     * - 如果正在绘制，则直接结束
     */
    private _handleDblClick;
    /**
     * 正常结束一次绘制：调用 mode.generate 并触发 drawend
     */
    private _finishDrawing;
    /**
     * 静默结束（不触发 drawend），用于切换模式 / 禁用工具
     */
    private _finishDrawingSilently;
    /**
     * 内部：获取或创建统一草图图层
     */
    _getOrCreateDraftLayer(): OverlayLayer<Feature>;
    /**
     * 内部：销毁草图图层
     */
    private _destroyDraftLayer;
}

export declare type DrawToolOptions = BaseDrawToolOptions & DrawToolPaintOptions;

/**
 * Paint configuration type
 */
export declare type DrawToolPaintOptions = {
    /** Main geometry paint (point / line / fill) */
    geometryPaint?: PaintInput;
    /**
     * Vertex (anchor point) paint
     * - Pass null to disable anchor point rendering
     * - Omit this field to keep current setting
     */
    vertexPaint?: PaintInput | null;
};

export declare interface EaseToOptions {
    center: LngLatLike;
    duration?: number;
    /**
     * Distance from camera to target point (consistent with OrbitControls.getDistance)
     * 相机到目标点的距离（与 OrbitControls.getDistance 一致）
     * Unit consistent with world coordinates. Recommended to use this field.
     * 单位与世界坐标一致。建议优先使用该字段。
     */
    distance?: number;
    /**
     * @deprecated Recommended to use distance.
     * @deprecated 建议使用 distance。
     * Same semantics as distance: distance from camera to target point.
     * 语义与 distance 相同：相机到目标点的距离。
     * Kept for backward compatibility.
     * 保留只是为了向后兼容旧代码。
     */
    altitude?: number;
    /**
     * Camera pitch angle (in degrees)
     * 相机俯仰角（角度制）
     * 0 = top-down view, 90 = horizontal (no artificial limit)
     * 0 = 正上方俯视，90 = 水平（无人为限制）
     */
    pitch?: number;
    /**
     * Camera bearing angle (in degrees)
     * 相机方位角（角度制）
     * 0 = looking North, 90 = looking East
     * 0 = 朝北，90 = 朝东
     */
    bearing?: number;
    complete?: () => void;
    curvePath?: boolean;
}

declare class EmptyBase {
    constructor(..._args: any[]);
}

declare class EmptyBase_2 {
    constructor(..._args: any[]);
}

/**
 * Create an empty base class (only used as mixin starting point).
 * 创建一个空基类（仅用于混入起点）
 */
declare class EmptyClass {
    constructor(..._args: any[]);
}

/**
 * 事件管理类
 *
 * 提供事件的订阅、触发和取消订阅功能，基于Three.js的EventDispatcher实现
 * 支持链式调用，并提供与原生Three.js事件系统的集成能力
 * @category Core
 */
export declare class EventClass {
    /** Three.js事件分发器实例 */
    private _dispatcher;
    /**
     * 监听器映射表
     * 结构: { 事件类型: { 原始监听器: 包装函数 } }
     */
    private _listenerMap;
    /**
     * 订阅事件
     * @param type 事件类型
     * @param listener 事件监听函数
     * @returns 当前实例（支持链式调用）
     *
     * @example
     * event.on('click', (data) => {
     *   console.log('click event:', data);
     * });
     */
    on(type: string, listener: (data?: any) => void): this;
    /**
     * 一次性订阅事件（触发后自动取消订阅）
     * @param type 事件类型
     * @param listener 事件监听函数
     * @returns 当前实例（支持链式调用）
     *
     * @example
     * event.once('load', () => {
     *   console.log('this will only trigger once');
     * });
     */
    once(type: string, listener: (data?: any) => void): this;
    /**
     * 取消订阅事件
     * @param type 事件类型
     * @param listener 要移除的事件监听函数
     * @returns 当前实例（支持链式调用）
     *
     * @example
     * const handler = (data) => console.log(data);
     * event.on('message', handler);
     * event.off('message', handler);
     */
    off(type: string, listener: (...args: any[]) => void): this;
    /**
     * Fire an event.
     * 触发事件
     * @param type Event type. 事件类型
     * @param data Event data to pass (optional). 要传递的事件数据（可选）
     * @returns Current instance (supports chaining). 当前实例（支持链式调用）
     *
     * @example
     * event.fire('update', { time: Date.now() });
     */
    fire(type: string, data?: any): this;
    /**
     * 获取原生Three.js事件分发器
     * @returns Three.js的EventDispatcher实例
     *
     * @description
     * 用于与Three.js原生事件系统集成
     */
    get threeEventDispatcher(): EventDispatcher;
}

/**
 * 外部模型加载器 (Singleton Service)
 * @class ExternalModelLoader
 * @description 负责加载、缓存和处理外部 3D 模型 (GLTF, FBX)
 */
export declare class ExternalModelLoader {
    private static instance;
    private cache;
    private gltfLoader;
    private fbxLoader;
    private dracoLoader?;
    private constructor();
    /**
     * 获取单例实例
     * @param manager
     */
    static getInstance(manager?: LoadingManager): ExternalModelLoader;
    /**
     * 清除缓存
     */
    clearCache(): void;
    /**
     * 加载模型
     * @param options 模型样式配置
     */
    load(options: ModelPaint): Promise<{
        model: Group;
        animations: any[];
    }>;
    /**
     * 确保 Draco 加载器已初始化
     * @param decoderPath
     */
    private ensureDracoLoader;
    /**
     * 克隆缓存的模型
     * @param cacheKey
     * @param options
     */
    private cloneCachedModel;
    /**
     * 处理动画数据 (标准化)
     * @param animations
     */
    private processAnimations;
    /**
     * 处理模型变换 (位置、缩放、旋转)
     * @param model
     * @param options
     */
    private processModel;
}

/**
 * Extrusion paint configuration.
 * 拉伸多边形样式配置
 * @category Paint
 */
export declare interface ExtrusionPaint extends BasePaint {
    type: 'extrusion';
    /** 填充颜色 */
    color?: number | string;
    /** 透明度 */
    opacity?: number;
    /** 是否显示线框 */
    wireframe?: boolean;
    /** 渲染面 */
    side?: 'front' | 'back' | 'double';
    /** 拉伸配置 */
    extrude?: {
        /** 拉伸高度 */
        height: number;
        /** 是否启用斜角 */
        bevelEnabled?: boolean;
    };
}

/**
 * Feature abstract base class.
 * 要素抽象基类
 *
 * @description
 * Provides basic feature functionality, including:
 * - Geometry data management
 * - Style management
 * - Layer management
 * - Event system
 * - Collision detection and avoidance support
 *
 * 提供要素的基础功能，包括：
 * - 几何数据管理
 * - 样式管理
 * - 图层管理
 * - 事件系统
 * - 碰撞检测与避让支持
 *
 * @abstract
 * @extends EventMixin(BaseMixin(Object3D))
 * @implements ICollidable
 * @category Feature
 */
export declare abstract class Feature extends Feature_base implements ICollidable {
    /**
     * Feature position (single coordinate or array of coordinates).
     * 要素位置（单个坐标或坐标数组）
     */
    _worldCoordinates: Vector3 | Vector3[];
    /**
     * Three.js geometry object.
     * Three.js几何对象
     */
    _renderObject: Object3D | Line2;
    /**
     * GeoJSON geometry data.
     * GeoJSON几何数据
     */
    _geometry: GeoJSONGeometry;
    /**
     * The layer this feature belongs to.
     * 所属图层
     */
    _layer?: Layer;
    /**
     * Current paint.
     * 当前样式
     */
    _paint?: Paint;
    /**
     * Feature ID.
     * 要素ID
     */
    _id: string;
    /**
     * Internal paint manager.
     * 内部样式管理器
     */
    private _paintManager;
    /**
     * Internal bloom helper.
     * 内部发光效果辅助器
     */
    private _bloomHelper;
    /**
     * Whether geometry is currently initializing.
     * 是否正在初始化几何体
     */
    private _isGeometryInitializing;
    /**
     * Create a feature instance.
     * 创建要素实例
     *
     * @param options - Feature configuration options. 要素配置选项
     * @throws Throws error if geometry is not provided. 如果未提供geometry参数会抛出错误
     */
    constructor(options: FeatureOptions);
    /**
     * Ensure render object is added to the scene.
     * 确保渲染对象已添加到场景中
     */
    private _ensureRenderObjectInScene;
    /* Excluded from this release type: _applyAlphaToObject */
    /**
     * Called when paint is successfully applied.
     * 样式成功应用后调用
     */
    private _onPaintApplied;
    /**
     * Initialize geometry (template method).
     * 初始化几何体（模板方法）
     *
     * @description
     * Calls _buildRenderObject implemented by subclasses and processes pending paint changes.
     * 该方法会调用子类实现的_buildRenderObject方法，并处理积压的样式变更
     *
     * @returns Promise<void>
     */
    initializeGeometry(): Promise<void>;
    /**
     * 构建渲染对象 (Internal)
     * Build the Three.js object for rendering.
     */
    abstract _buildRenderObject(): Promise<void> | void;
    /**
     * 更新渲染对象的坐标 (Internal)
     * Update the coordinates of the render object.
     */
    protected _refreshCoordinates(): void;
    /**
     * Set paint.
     * 设置样式
     *
     * @param input - Paint configuration or paint instance. 样式配置或样式实例
     * @returns Current feature instance (supports method chaining). 当前要素实例（支持链式调用）
     */
    setPaint(input: PaintInput): this;
    /**
     * Get current paint.
     * 获取当前样式
     *
     * @returns Current paint or undefined. 当前样式或undefined
     */
    getPaint(): Paint | undefined;
    /**
     * Paint property getter/setter for convenience.
     */
    get paint(): Paint | undefined;
    set paint(value: PaintInput | undefined);
    /**
     * Set bloom status for the current feature.
     * 设置当前要素的发光状态
     *
     * @param enabled Whether to enable bloom. 是否启用发光
     * @param options Optional: bloom intensity and color. 可选：发光强度和颜色
     */
    setBloom(enabled: boolean, options?: {
        intensity?: number;
        color?: string;
    }): this;
    /**
     * Get bloom configuration of the current feature.
     * 获取当前要素的发光配置
     */
    getBloom(): {
        enabled: boolean;
        intensity: number;
        color: string;
    } | undefined;
    /**
     * Add feature to layer
     * 将要素添加到图层
     *
     * @param layer - Target layer 目标图层
     * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
     */
    addTo<T extends Feature>(layer: OverlayLayer<T>): this;
    /**
     * Get parent layer
     * 获取所属图层
     *
     * @returns Layer instance or null 图层实例或null
     */
    getLayer(): Layer | null;
    /**
     * Get parent map
     * 获取所属地图
     *
     * @returns Map instance or null 地图实例或null
     */
    getMap(): Map_2 | null;
    /**
     * Set feature coordinates (geographic coordinates)
     * 设置要素坐标（地理坐标）
     *
     * @param coordinates - Longitude and latitude coordinates 经纬度坐标
     * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
     */
    setCoordinates(coordinates: any): this;
    /**
     * Internal processing after coordinate change
     * 坐标变化后的内部处理
     *
     * @param fastUpdate - Whether to use fast update mode (only updates vertex positions, does not rebuild geometry) 是否使用快速更新模式（仅更新顶点位置，不重建几何体）
     */
    protected _applyCoordinateChanges(fastUpdate?: boolean): void;
    /**
     * Get feature center (geographic coordinates)
     * 获取要素中心点（地理坐标）
     *
     * @returns Center coordinates [lng, lat] 中心点坐标 [经度, 纬度]
     */
    getCenter(): [number, number];
    /**
     * Bind to layer (internal use)
     * 绑定到图层（内部使用）
     *
     * @param layer - Layer instance 图层实例
     * @throws Throws error if feature already belongs to another layer 如果要素已属于其他图层会抛出错误
     */
    _bindLayer(layer: Layer): void;
    /**
     * Update geometry
     * 更新几何体
     */
    _updateGeometry(): void;
    /**
     * Remove self from layer
     * 从图层中移除自身
     *
     * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
     */
    _remove(): this;
    /**
     * Unbind from layer (internal use)
     * 解除图层绑定（内部使用）
     */
    _unbind(): void;
    /**
     * Dispose geometry resources
     * 释放几何体资源
     */
    _disposeGeometry(): void;
    /**
     * Get whether collision detection is enabled
     * 获取是否启用碰撞检测
     *
     * @returns Whether collision detection is enabled 是否启用碰撞检测
     */
    get collidable(): boolean;
    /**
     * Get collision type (subclasses need to override)
     * 获取碰撞类型（子类需要重写）
     *
     * @returns Collision type 碰撞类型
     */
    get collisionType(): CollisionType;
    /**
     * Get collision priority
     * 获取碰撞优先级
     *
     * Priority calculation order:
     * 优先级计算顺序：
     * 1. Priority in user data
     * 1. 用户数据中的优先级
     * 2. Priority in style configuration
     * 2. 样式配置中的优先级
     * 3. Default priority
     * 3. 默认优先级
     *
     * @returns Collision priority value 碰撞优先级数值
     */
    getCollisionPriority(): number;
    /**
     * Get screen space bounding box
     * 获取屏幕空间包围盒
     *
     * Calculate the bounding box of the feature in screen space for collision detection
     * 计算要素在屏幕空间中的包围盒，用于碰撞检测
     *
     * @param camera - Current camera 当前相机
     * @param renderer - Renderer instance 渲染器实例
     * @returns Bounding box info or null (if invisible or calculation failed) 包围盒信息或null（如果不可见或计算失败）
     */
    getScreenBoundingBox(camera: Camera, renderer: WebGLRenderer): IBoundingBox | null;
    /**
     * Set collision visibility
     * 设置碰撞可见性
     *
     * Control the display state of the feature after collision detection, supporting smooth transition animation
     * 控制要素在碰撞检测后的显示状态，支持平滑过渡动画
     *
     * @param visible - Whether visible 是否可见
     * @param reason - Reason for visibility change 可见性变化原因
     */
    setCollisionVisibility(visible: boolean, reason?: CollisionReason): void;
    /**
     * Get current collision visibility
     * 获取当前碰撞可见性
     *
     * @returns Current visibility state 当前可见性状态
     */
    getCollisionVisibility(): boolean;
    /**
     * Set collision detection configuration
     * 设置碰撞检测配置
     *
     * @param config - Collision configuration options 碰撞配置选项
     * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
     */
    setCollisionConfig(config: Partial<typeof this._collisionConfig>): this;
    /**
     * Enable collision detection
     * 启用碰撞检测
     *
     * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
     */
    enableCollision(): this;
    /**
     * Disable collision detection
     * 禁用碰撞检测
     *
     * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
     */
    disableCollision(): this;
    /**
     * Apply alpha to all child objects
     * 应用透明度到所有子对象
     *
     * Recursively traverse all child objects, set transparency uniformly, support single and multiple materials
     * 递归遍历所有子对象，统一设置透明度，支持单个和多个材质
     *
     * @param alpha - Alpha value (0-1) 透明度值（0-1）
     * @private
     */
    private _applyVisibilityAlpha;
    /**
     * Apply final alpha and force update
     * 应用最终透明度并强制更新
     *
     * @param alpha - Alpha value (0-1) 透明度值（0-1）
     * @private
     */
    private _applyFinalAlpha;
    /**
     * Get collision related data
     * 获取碰撞相关数据
     *
     * @returns Object containing feature type, user data, and style config 包含要素类型、用户数据、样式配置的对象
     */
    getCollisionData(): any;
    /**
     * Calculate bounding box for collision detection
     * 计算碰撞检测用的包围盒
     *
     * pointToLngLat world space bounding box to screen space to calculate pixel-level bounding box
     * 将世界空间包围盒投影到屏幕空间，计算像素级别的包围盒
     *
     * @param camera - Current camera 当前相机
     * @param renderer - Renderer instance 渲染器实例
     * @returns Bounding box info or null (if calculation failed) 包围盒信息或null（如果计算失败）
     * @private
     */
    _calculateCollisionBoundingBox(camera?: Camera, renderer?: WebGLRenderer): {
        width: number;
        height: number;
        offsetX: number;
        offsetY: number;
    } | null;
    /**
     * Get fallback bounding box (used when calculation fails)
     * 获取备用包围盒（计算失败时使用）
     *
     * @returns Default bounding box info 默认包围盒信息
     *
     */
    _getFallbackBoundingBox(): {
        width: number;
        height: number;
        offsetX: number;
        offsetY: number;
    };
    /**
     * Convert tile coordinates to local world coordinates
     * 将瓦片坐标转换为本地世界坐标
     *
     * @param rawX - Raw X coordinate 原始X坐标
     * @param rawY - Raw Y coordinate 原始Y坐标
     * @param tileData - Tile data 瓦片数据
     * @param map - Map instance 地图实例
     * @returns Local world coordinate vector 本地世界坐标向量
     * @private
     */
    private _tileCoordToLocalWorld;
}

declare const Feature_base: {
    new (...args: any[]): {
        [key: string]: any;
        _handlers?: Handler[];
        addHandler(name: string | number, handlerClass: new (arg0: /*elided*/ any) => any): /*elided*/ any;
        removeHandler(name: string | number): /*elided*/ any;
        _clearHandlers(): void;
    };
} & {
    new (...args: any[]): {
        eventClass: EventClass;
        on: (type: string, listener: (data?: any) => void) => EventClass;
        fire: (type: string, data?: any) => EventClass;
        off: (type: string, listener: (...args: any[]) => void) => EventClass;
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        options: any;
        _isUpdatingOptions?: boolean;
        _initHooksCalled?: boolean;
        _initHooks?: Function[];
        _proxyOptions(): /*elided*/ any;
        _callInitHooks(): /*elided*/ any;
        setOptions(options: ClassOptions): /*elided*/ any;
        configure(conf?: string | ClassOptions, value?: any): ClassOptions | /*elided*/ any;
        onOptionsChange(_conf: ClassOptions): void;
        _visitInitHooks(proto: {
            _initHooks: any;
        }): void;
    };
    mergeOptions(options: ClassOptions): /*elided*/ any & typeof Object3D;
    addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & typeof Object3D;
    include(...sources: any[]): /*elided*/ any & typeof Object3D;
} & typeof Object3D;

/**
 * Feature configuration options.
 * 要素配置选项
 * @category Feature
 */
export declare type FeatureOptions = {
    /**
     * Feature ID (optional, automatically generated if not provided).
     * 要素ID（可选，不传则自动生成）
     */
    id?: string;
    /**
     * GeoJSON geometry data (required).
     * GeoJSON几何数据（必填）
     */
    geometry?: GeoJSON.Geometry;
    /**
     * Whether the feature is visible (default: true).
     * 是否可见（默认true）
     */
    visible?: boolean;
    /**
     * Default projection coordinate system.
     * 默认投影坐标系
     */
    defaultProjection?: string;
    /**
     * Style configuration.
     * 样式配置
     */
    paint?: PaintInput;
    /**
     * Custom user data.
     * 自定义数据
     */
    userData?: {
        [key: string]: any;
    };
    /**
     * Rotation angle (in radians).
     * 旋转角度（弧度）
     */
    rotateAngle?: number;
    /**
     * Whether the feature is draggable (default: false).
     * 是否可拖拽（默认false）
     */
    draggable?: boolean;
    /**
     * Whether the feature is editable (default: false).
     * 是否可编辑（默认false）
     */
    editable?: boolean;
};

/**
 * Fill paint configuration.
 * 基础多边形样式配置
 * @category Paint
 */
export declare interface FillPaint extends BasePaint {
    type: 'fill';
    /** 填充颜色 */
    color?: string | number | Color;
    /** 透明度 */
    opacity?: number;
    /** 是否显示线框 */
    wireframe?: boolean;
    /** 线框颜色 */
    wireframeColor?: string | number | Color;
    /** 线框宽度 */
    wireframeWidth?: number;
    /** 边框颜色 */
    borderColor?: string | number | Color;
    /** 边框宽度 */
    borderWidth?: number;
    /** 边框虚线数组 */
    borderdashArray?: number[];
    /** 渲染面 */
    side?: 'front' | 'back' | 'double';
    /** 是否使用顶点颜色 */
    vertexColors?: boolean;
    /** 是否使用平面着色 */
    flatShading?: boolean;
}

/**
 * Fill paint union type.
 * 面样式联合类型
 * @category Paint
 */
export declare type FillPaintUnion = FillPaint | ExtrusionPaint | WaterPaintUnion;

/**
 * Flow texture paint configuration.
 * 纹理流动线样式配置（发光箭头线等）
 * @category Paint
 */
export declare interface FlowTexturePaint extends BasePaint {
    type: 'flow-texture';
    /** 线颜色（与纹理颜色相乘，用于整体调色） */
    color?: string | number | Color;
    /** 线宽（世界坐标单位） */
    width?: number;
    /** 流动纹理 URL，例如箭头贴图 */
    flowTexture: string;
    /** 流动速度，越大流动越快 */
    speed?: number;
    /** 纹理沿线方向重复次数（控制箭头密度） */
    repeat?: number;
    /** 拐角半径（预留，与 FlowLineStyle 含义一致） */
    cornerRadius?: number;
}

/**
 * Flow tube paint configuration.
 * 流动管线样式配置
 * @category Paint
 */
export declare interface FlowTubePaint extends BasePaint {
    type: 'flow-tube';
    /** 管道颜色 */
    color?: string | number | Color;
    /** 管道半径 */
    radius: number;
    /** 径向分段数 */
    radialSegments?: number;
    /** 管长分段数 */
    tubularSegments?: number;
    /** 速度因子 */
    speed?: number;
    /** 条纹宽度 */
    stripeWidth?: number;
    /** 条纹间距 */
    stripeSpacing?: number;
    /** 条纹颜色 */
    stripeColor?: string | number | Color;
    /** 拐角半径 */
    cornerRadius?: number;
}

/**
 * flyTo method parameters interface
 * flyTo方法参数接口
 * @category SceneRenderer
 */
export declare interface FlyToOptions {
    /** Longitude and latitude 经纬度 */
    center: LngLatLike;
    /** Camera coordinates 相机 */
    cameraCoord: LngLatLike;
    duration?: number;
    delay?: number;
    complete?: () => void;
    /** Whether to use curved path (default is straight line) 是否使用曲线路径飞行（默认直线） */
    curvePath?: boolean;
}

/**
 * Union type for GeoJSON geometry types.
 * GeoJSON几何类型联合类型
 * @category Feature
 */
export declare type GeoJSONGeometry = Point_2 | MultiPoint | LineString_2 | MultiLineString_2 | Polygon_2 | MultiPolygon;

/**
 * 几何体辅助工具类
 * @class GeometryHelper
 */
export declare class GeometryHelper {
    /**
     * 连接多个类型化数组
     * @param arrays 要连接的数组列表
     * @returns 连接后的新数组
     */
    static concatenateTypedArrays<T extends Float32Array | Uint16Array | Uint32Array | Int16Array | Int32Array | Uint8Array | Int8Array>(...arrays: T[]): T;
    /**
     * 计算网格法线
     * @param vertices 顶点位置数组 (x, y, z, ...)
     * @param indices 索引数组
     * @returns 法线数组
     */
    static computeVertexNormals(vertices: Float32Array, indices: Uint16Array | Uint32Array): Float32Array;
    /**
     * 生成规则网格的索引
     * @param rows 行数 (Height)
     * @param cols 列数 (Width)
     */
    static generateGridIndices(rows: number, cols: number): Uint16Array | Uint32Array;
    /**
     * 从 DEM 数据生成几何数据
     * @param demData DEM 高度数据
     * @returns IGeometryData
     */
    static fromDEM(demData: Float32Array): IGeometryData;
}

/**
 * 几何体裙边生成工具
 * @class GeometrySkirtUtils
 */
export declare class GeometrySkirtUtils {
    /**
     * 为几何体添加裙边 (Skirt)
     * @description 防止地形瓦片之间出现裂缝
     * @param geometryData 原始几何体数据
     * @param skirtHeight 裙边高度 (向下延伸的距离)
     * @param externalEdgeIndices 可选的预计算边缘索引
     */
    static addSkirt(geometryData: IGeometryData, skirtHeight: number, externalEdgeIndices?: IEdgeIndices): IGeometryData;
    /**
     * 从网格索引中提取边界边
     * @param indices 三角形索引
     */
    private static extractBoundaryEdges;
    /**
     * 根据预定义的边缘索引获取边列表
     * @param indices 边缘索引组
     * @param position 顶点位置 (用于排序)
     */
    private static getEdgesFromIndices;
}

/**
 * 获取近似缩放级别
 * @param camera 相机
 * @param map 地图
 * @returns 缩放级别
 */
export declare function getApproxZoomLevel(_camera: Camera, map: Map_2): number;

export declare function getLocalInfoFromGeo(map: Map_2, geo: Vector3): LocationInfo | undefined;

/**
 * 通过射线获取地面信息
 * @param map 地图实例
 * @param ray 射线检测器
 * @returns 相交信息或undefined（未相交时）
 * @description 检测射线与地图的相交点，并转换为地理位置坐标
 * @category Map
 */
export declare function getLocalInfoFromRay(map: Map_2, ray: Raycaster): LocationInfo | undefined;

/**
 * 通过屏幕坐标获取地面信息
 * @param camera 相机
 * @param map 地图实例
 * @param pointer 屏幕坐标（-0.5~0.5）
 * @returns 地面信息
 * @description 从屏幕坐标投射射线检测地面
 * @category Map
 */
export declare function getLocalInfoFromScreen(camera: Camera, map: Map_2, pointer: Vector2): LocationInfo | undefined;

/**
 * 通过世界坐标获取地面信息
 * @param map 地图实例
 * @param worldPosition 世界坐标
 * @returns 地面信息
 * @description 从指定世界坐标上方垂直向下投射射线检测地面
 * @category Map
 */
export declare function getLocalInfoFromWorld(map: Map_2, worldPosition: Vector3): LocationInfo | undefined;

/**
 * 所有交互Handler类的基类
 *
 * @english
 * Base class for all the interaction handlers
 * @category Interaction
 * @abstract
 * @protected
 */
declare abstract class Handler extends Handler_base {
    target: any;
    dom?: HTMLElement;
    _enabled: boolean;
    constructor(target: any);
    /**
     * Add event hooks
     * 添加事件钩子
     */
    abstract addHooks(): void;
    /**
     * Remove event hooks
     * 移除事件钩子
     */
    abstract removeHooks(): void;
    /**
     * 启用Handler
     *
     * @english
     * Enables the handler
     */
    enable(): this;
    /**
     * 停用Handler
     *
     * @english
     * Disables the handler
     */
    disable(): this;
    /**
     * 检查Handler是否启用
     *
     * @english
     * Returns true if the handler is enabled.
     */
    enabled(): boolean;
    /**
     * 从target上移除Handler
     *
     * @english
     * remove handler from target
     */
    remove(): void;
}

declare const Handler_base: {
    new (...args: any[]): {
        eventClass: EventClass;
        on: (type: string, listener: (data?: any) => void) => EventClass;
        fire: (type: string, data?: any) => EventClass;
        off: (type: string, listener: (...args: any[]) => void) => EventClass;
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        options: any;
        _isUpdatingOptions?: boolean;
        _initHooksCalled?: boolean;
        _initHooks?: Function[];
        _proxyOptions(): /*elided*/ any;
        _callInitHooks(): /*elided*/ any;
        setOptions(options: ClassOptions): /*elided*/ any;
        configure(conf?: string | ClassOptions, value?: any): /*elided*/ any | ClassOptions;
        onOptionsChange(_conf: ClassOptions): void;
        _visitInitHooks(proto: {
            _initHooks: any;
        }): void;
    };
    mergeOptions(options: ClassOptions): /*elided*/ any & typeof Base;
    addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & typeof Base;
    include(...sources: any[]): /*elided*/ any & typeof Base;
} & typeof Base;

/**
 * 包围盒接口
 *
 * @description
 * 表示要素在屏幕空间中的矩形区域，用于碰撞检测。
 * 避让系统基于这些包围盒进行重叠检测和冲突解决。
 * @category Core
 */
declare interface IBoundingBox {
    /** 包围盒唯一标识，用于碰撞关系追踪 */
    id: string;
    /** 包围盒左上角在屏幕空间中的X坐标（像素） */
    x: number;
    /** 包围盒左上角在屏幕空间中的Y坐标（像素） */
    y: number;
    /** 包围盒宽度（像素） */
    width: number;
    /** 包围盒高度（像素） */
    height: number;
    /** 避让优先级，数值越高越重要，碰撞时优先显示 */
    priority: number;
    /** 对应的要素ID，关联到具体的要素对象 */
    featureId: string;
    /** 要素所属的图层ID，用于按图层管理避让策略 */
    layerId: string;
    /** 碰撞类型，影响避让算法和包围盒形状 */
    type: CollisionType;
    /** 扩展数据，可存储要素特定的避让相关信息 */
    data?: any;
}

/**
 * Cloud feature class.
 * 云朵要素类
 *
 * @description
 * Represents Cloud features in 3D scene, inheriting from Point class.
 * Provides creation, update, and rendering functions for Clouds.
 * 表示3D场景中的云朵要素，继承自Point类。
 * 提供云朵的创建、更新和渲染功能。
 *
 * @extends Point
 * @category Feature
 */
export declare class ICloud extends Point_3 {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string;
    /**
     * Create a Cloud feature instance.
     * 创建云朵要素
     *
     * @param options Cloud configuration options
     *                云朵配置选项
     */
    constructor(options: PointOptions);
    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     *
     * @returns Promise<void>
     *
     * @description
     * Create cloud geometry based on style configuration.
     * 根据样式配置创建云朵几何体
     */
    _buildRenderObject(): Promise<void>;
    /**
     * Update geometry (override parent method).
     * 更新几何体（重写父类方法）
     *
     * @description
     * Add cloud geometry to the layer's cloud container, and set position and render order.
     * 将云朵几何体添加到图层的云朵容器中，并设置位置和渲染顺序
     */
    _refreshCoordinates(): void;
    /**
     * Create cloud object.
     * 创建云朵对象
     *
     * @param style Style configuration
     *              样式配置
     * @returns Created cloud object
     *          创建的云朵对象
     * @throws Throws error if style type is not supported
     *         如果样式类型不支持会抛出错误
     *
     * @private
     */
    _createObject(paint: Paint): Promise<any>;
}

/**
 * Cloud Layer configuration options.
 * 云层图层配置选项
 *
 * @description
 * Extends basic layer options, adds cloud-specific texture configuration.
 * 扩展基础图层选项，添加云层特有的纹理配置。
 *
 * @extends OverlayLayerOptions<ICloud>
 * @category Layer
 */
export declare type ICloudLayerOptions = OverlayLayerOptions<ICloud> & {
    /**
     * Cloud texture.
     * 云层纹理
     * @description
     * Supports direct Texture object or texture URL string.
     * 支持直接传入Texture对象或纹理URL字符串。
     */
    texture: string | Texture;
};

/**
 * 可避让要素接口
 *
 * @description
 * 定义了要素参与避让检测必须实现的方法和属性。
 * 避让系统用于解决地图上要素重叠显示的问题，确保重要信息清晰可见。
 * @category Core
 */
declare interface ICollidable {
    /** 要素唯一标识，用于避让系统的要素识别和碰撞关系追踪 */
    readonly _id: string;
    /**
     * 是否参与避让检测
     * @returns true-参与避让检测，false-忽略避让检测（始终显示）
     */
    readonly collidable: boolean;
    /**
     * 碰撞类型，决定避让策略和包围盒计算方式
     * @example CollisionType.POINT - 点要素，使用圆形或方形包围盒
     * @example CollisionType.LABEL - 文字标签，考虑文字尺寸
     */
    readonly collisionType: CollisionType;
    /**
     * 获取避让优先级
     * @returns 优先级数值（0-100），数值越高显示优先级越高
     * @description 当多个要素发生碰撞时，优先级高的要素会显示，优先级低的会被隐藏
     */
    getCollisionPriority(): number;
    /**
     * 获取屏幕空间包围盒
     * @param camera 相机对象，用于坐标投影计算
     * @param renderer 渲染器，提供视口尺寸信息
     * @returns 屏幕空间的包围盒信息，如果要素不可见或不在视口内返回null
     * @description 将3D世界坐标转换为2D屏幕坐标，计算要素在屏幕上的占用区域
     */
    getScreenBoundingBox(camera: Camera, renderer: WebGLRenderer): IBoundingBox | null;
    /**
     * 设置碰撞可见性
     * @param visible 是否可见
     * @param immediately 是否立即生效（true-无过渡动画，false-淡入淡出动画）
     * @param reason 可见性变化的原因（碰撞、手动操作等）
     * @description 避让系统根据碰撞检测结果调用此方法来控制要素显示/隐藏
     */
    setCollisionVisibility(visible: boolean, reason?: CollisionReason): void;
    /**
     * 获取当前碰撞可见性状态
     * @returns 当前是否因避让原因而可见
     * @description 注意：这与要素的visible属性可能不同，仅反映避让系统的可见性决策
     */
    getCollisionVisibility(): boolean;
    /**
     * 碰撞状态变化回调（可选）
     * @param state 新的碰撞状态
     * @description 当要素的避让状态发生变化时触发，用于外部监听状态变化
     */
    onCollisionStateChange?(state: ICollisionState): void;
    /**
     * 获取碰撞相关数据（可选）
     * @returns 避让系统需要的扩展数据
     * @description 提供要素的额外信息，用于更智能的避让决策
     */
    getCollisionData?(): any;
}

/**
 * 避让系统配置接口
 *
 * @description
 * 控制避让系统整体行为的配置参数，支持运行时调整。
 * @category Core
 */
declare interface ICollisionConfig {
    /** 是否启用避让系统，关闭后所有要素都会显示 */
    enabled: boolean;
    /** 包围盒外边距（像素），增加检测区域避免紧贴 */
    padding: number;
    /** 避让检测更新间隔（毫秒），控制检测频率平衡性能 */
    updateInterval: number;
    /** 显示/隐藏动画的持续时间（毫秒） */
    animationDuration: number;
    /** 每帧最多处理的要素数量，防止单帧卡顿 */
    maxFeaturesPerFrame: number;
    /** 视口外边距（像素），提前检测即将进入视口的要素 */
    viewportMargin: number;
    /** 避让策略配置 */
    strategies: {
        /** 是否启用优先级策略 - 高优先级要素优先显示 */
        priority: boolean;
        /** 是否启用分组策略 - 同组要素协同避让 */
        grouping: boolean;
        /** 是否启用邻近策略 - 考虑要素间的相对位置 */
        proximity: boolean;
    };
}

/**
 * 碰撞状态接口
 *
 * @description
 * 记录要素在避让系统中的当前状态信息，用于状态追踪和动画过渡。
 * @category Core
 */
declare interface ICollisionState {
    /** 当前是否可见（避让系统的可见性决策结果） */
    visible: boolean;
    /** 可见性变化的原因，用于诊断和不同原因的不同处理策略 */
    reason: CollisionReason;
    /** 与当前要素发生碰撞的其他要素ID列表，用于分析碰撞关系 */
    collidedWith: string[];
    /** 状态更新时间戳，用于动画计时和状态新鲜度判断 */
    timestamp: number;
}

/**
 * 综合瓦片加载器接口
 */
export declare interface ICompositeLoader<TMeshData extends TileMeshData = TileMeshData> {
    manager: TileLoadingManager;
    imgSource: ISource[];
    demSource: ISource | undefined;
    load(context: TileLoadContext): Promise<TMeshData>;
    unload?(tileMesh: Mesh): void;
}

/**
 * Icon paint configuration.
 * 图标点样式配置
 * @category Paint
 */
export declare interface IconPaint extends BasePaint {
    type: 'icon';
    /** 点颜色 */
    color?: string | number | Color;
    /** 图标URL */
    url: string;
    /** 图标尺寸 [宽, 高] */
    size: number | [number, number];
    /** 旋转角度 */
    rotation?: number;
    /** 锚点位置 [x, y] */
    anchor?: [number, number];
    /** 是否随距离衰减 */
    sizeAttenuation?: boolean;
    sizeUnit?: 'pixels' | 'meters';
}

export declare interface IEdgeIndices {
    west: Uint16Array | Uint32Array;
    south: Uint16Array | Uint32Array;
    east: Uint16Array | Uint32Array;
    north: Uint16Array | Uint32Array;
}

/**
 * 几何体属性数据接口
 * @interface IGeometryAttribute
 */
export declare interface IGeometryAttribute {
    /** 属性值数组 (Float32Array) */
    value: Float32Array;
    /** 每个顶点的分量数 (例如: position=3, uv=2) */
    size: number;
}

/**
 * 几何体完整属性集合接口
 * @interface IGeometryAttributes
 */
export declare interface IGeometryAttributes {
    /** 顶点位置属性 */
    position: IGeometryAttribute;
    /** 纹理坐标属性 */
    texcoord: IGeometryAttribute;
    /** 法线属性 */
    normal: IGeometryAttribute;
}

/**
 * 几何体数据接口 (包含属性和索引)
 * @interface IGeometryData
 */
export declare interface IGeometryData {
    /** 顶点属性集合 */
    attributes: IGeometryAttributes;
    /** 顶点索引数组 */
    indices: Uint16Array | Uint32Array;
}

/**
 * 几何体加载器接口
 */
export declare interface IGeometryLoader<TGeometry extends BufferGeometry = BufferGeometry> {
    readonly isMaterialLoader?: false;
    readonly info: LoaderMetadata;
    readonly dataType: string;
    load(context: SourceLoadContext): Promise<TGeometry>;
    unload?(geometry: TGeometry): void;
}

/**
 * 材质加载器接口
 */
export declare interface IMaterialLoader<TMaterial extends Material = Material> {
    readonly isMaterialLoader?: true;
    readonly info: LoaderMetadata;
    readonly dataType: string;
    load(context: SourceLoadContext): Promise<TMaterial>;
    unload?(material: TMaterial): void;
}

/**
 * InfoWindow Component.
 * 信息窗口组件
 * @extends UIComponent
 * @category UI
 */
export declare class InfoWindow extends UIComponent {
    options: InfoWindowOptions;
    private _titleEl?;
    private _contentEl?;
    /**
     * @param options InfoWindow options InfoWindow 配置
     */
    constructor(options: InfoWindowOptions);
    protected _getClassName(): string;
    /**
     * Build InfoWindow DOM structure.
     * 构建 InfoWindow 的 DOM 结构
     */
    protected buildOn(): HTMLElement;
    protected getOffset(): {
        x: number;
        y: number;
    };
    /**
     * Calculate actual pixel height of Sprite on screen
     * 计算 Sprite 在屏幕上的实际像素高度
     *
     * @description
     * Handles both sizeAttenuation=false (fixed screen size) and sizeAttenuation=true (perspective projection) cases.
     * 处理 sizeAttenuation=false（固定屏幕大小）和 sizeAttenuation=true（透视投影）两种情况。
     */
    private _getSpriteScreenHeight;
    /**
     * Set title.
     * 设置标题
     */
    setTitle(title?: string): this;
    /**
     * Set content.
     * 设置内容
     */
    setContent(content: string | HTMLElement): this;
    /**
     * Open InfoWindow (semantically equivalent to show).
     * 打开 InfoWindow（语义上等价于 show）
     * @param coordinate Optional geographic coordinate, use owner center / map center if not provided 可选地理坐标，不传则使用 owner 的中心 / 地图中心
     */
    open(coordinate?: LngLatLike): this;
    /**
     * Close InfoWindow (semantically equivalent to hide).
     * 关闭 InfoWindow（语义上等价于 hide）
     */
    close(): this;
}

/**
 * InfoWindow options.
 * InfoWindow 配置项
 * @category UI
 */
declare type InfoWindowOptions = UIComponentOptions & {
    /**
     * Title text.
     * 标题文本
     */
    title?: string;
    /**
     * Content, can be HTML string or HTMLElement.
     * 内容，可以是 HTML 字符串或 HTMLElement
     */
    content?: string | HTMLElement;
    /**
     * Minimum width.
     * 最小宽度
     */
    minWidth?: number;
    /**
     * Minimum height.
     * 最小高度
     */
    minHeight?: number;
    /**
     * Custom mode: if true, do not render default title bar / content box, directly use DOM/HTML provided by user.
     * 自定义模式：true 时不渲染默认标题栏/内容框，直接使用用户提供的 DOM/HTML
     */
    custom?: boolean;
};

/**
 * Interaction configuration options.
 * 交互配置选项
 * @category Map
 */
export declare type InteractionOptions = {
    /** Enable feature event handling 启用要素事件处理 */
    featureEvents?: boolean;
    /** Enable collision detection 启用碰撞检测 */
    collision?: boolean;
    /** Enable map dragging 启用地图拖拽 */
    draggable?: boolean;
    /** Enable scroll zoom 启用滚轮缩放 */
    scrollZoom?: boolean;
};

/**
 * Source interface
 * all source implements ISource get url from x/y/z coordinate to url
 */
export declare interface ISource {
    /** A string identifies the source data type, it requires the support of the loader. */
    dataType: string;
    /** Source attribution info, it allows you to display attribution*/
    attribution: string;
    /** Data max level */
    minLevel: number;
    /** Data min level */
    maxLevel: number;
    /** Data projection */
    projectionID: ProjectionType;
    /** Display opacity */
    opacity: number;
    /** is TMS scheme */
    isTMS?: boolean;
    bounds: [number, number, number, number];
    /** Data bounds in Proejction, internal use */
    _projectionBounds: [number, number, number, number];
    /** Get url from xyz, internal use */
    _getUrl(x: number, y: number, z: number): string | undefined;
    /** Any data */
    [key: string]: unknown;
}

/**
 * Tile event map
 * 瓦片事件映射
 */
export declare interface ITileEventMap extends Object3DEventMap {
    unload: BaseEvent;
    ready: BaseEvent;
    "tile-created": BaseEvent & {
        tile: Tile;
    };
    "tile-loaded": BaseEvent & {
        tile: Tile;
    };
    "tile-unload": BaseEvent & {
        tile: Tile;
    };
    "vector-data-loaded": BaseEvent & {
        tile: Tile;
        data: any;
    };
    "vector-tile-loaded": BaseEvent & {
        tileKey: string;
        data: any;
        tile: Tile;
    };
    "tile-hidden": BaseEvent & {
        tile: Tile;
    };
    "tile-shown": BaseEvent & {
        tile: Tile;
    };
    "vector-tile-unloaded": BaseEvent & {
        tileKey: string;
        tile: Tile;
    };
    "visible-vector-tiles-changed": BaseEvent & {
        tiles: Array<{
            tileKey: string;
            data: any;
            tile: Tile;
        }>;
    };
}

/**
 * Base interface for Tile Layer.
 * 瓦片图层基础接口
 *
 * @description
 * Defines basic contract for layers, without specific implementation.
 * 定义图层的基本契约，不包含具体实现。
 * @category Layer
 */
declare interface ITileLayer extends Layer {
    /**
     * Layer unique identifier.
     * 图层唯一标识
     */
    /**
     * Layer name.
     * 图层名称。
     */
    name: string;
    /**
     * Whether enabled.
     * 是否启用。
     */
    enabled: boolean;
    /**
     * Whether visible.
     * 是否可见。
     */
    visible: boolean;
    /**
     * Layer type identifier.
     * 图层类型标识。
     * @readonly
     */
    readonly layerType: string;
    /**
     * Data source - Layer data foundation.
     * 数据源 - 图层的数据基础。
     * @readonly
     */
    readonly source: ISource | ISource[];
    /**
     * Projection system - Layer coordinate foundation.
     * 投影系统 - 图层的坐标基础。
     * @readonly
     */
    readonly projection: MapProjection;
    /**
     * Loader reference.
     * 加载器引用。
     * @readonly
     */
    readonly loader: ICompositeLoader | IGeometryLoader;
    /**
     * Minimum display level.
     * 最小显示层级。
     */
    minLevel: number;
    /**
     * Maximum display level.
     * 最大显示层级。
     */
    maxLevel: number;
    /**
     * Update layer.
     * 更新图层。
     *
     * @param camera The camera used for rendering. 用于渲染的相机。
     */
    update(camera: Camera): void;
    /**
     * Dispose resources.
     * 释放资源。
     */
    dispose(): void;
    /**
     * Reload data.
     * 重新加载数据。
     */
    reload(): void;
    /**
     * Local coordinates to world coordinates.
     * 本地坐标转世界坐标。
     *
     * @param localPos Local position vector. 本地位置向量。
     * @returns {Vector3} World position vector. 世界位置向量。
     */
    localToWorld(localPos: Vector3): Vector3;
}

/**
 * 扩展材质接口
 */
export declare interface ITileMaterial extends Material {
    map?: Texture | null;
}

/**
 * Label feature class.
 * 标签要素类
 *
 * @description
 * Represents a text label feature in the 3D scene, inheriting from the Point class.
 * Provides functionality for creating, updating, and rendering labels, supporting two types of text labels:
 * - Fixed size labels
 * - Dynamic size labels
 *
 * 表示3D场景中的文本标签要素，继承自Point类
 * 提供标签的创建、更新和渲染功能，支持两种文本标签类型：
 * - 固定大小标签
 * - 动态大小标签
 *
 * @extends Point
 * @category Feature
 */
export declare class Label extends Point_3 {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string;
    /**
     * Create a label feature.
     * 创建标签要素
     *
     * @param options Label configuration options
     *                标签配置选项
     */
    constructor(options: MarkerOptions_2);
    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     *
     * @returns Promise<void>
     *
     * @description
     * Creates text label geometry based on style configuration.
     *
     * 根据样式配置创建文本标签几何体
     */
    _buildRenderObject(): Promise<void>;
    /**
     * Quickly update geometry vertex positions (without rebuilding the entire geometry).
     * 快速更新几何体顶点位置（不重建整个几何体）
     *
     * @description
     * Used for real-time interactions like dragging and editing. Updates only Label position without destroying and rebuilding geometry.
     *
     * 用于拖拽、编辑等实时交互场景，仅更新Label的位置而不销毁重建几何体。
     */
    protected _refreshCoordinates(): void;
    /**
     * Create label object.
     * 创建标签对象
     *
     * @param style Style configuration
     *              样式配置
     * @returns Created label object
     *          创建的标签对象
     * @throws Throws error if style type is not supported
     *         如果样式类型不支持会抛出错误
     *
     * @description
     * Supports two label types:
     * - 'canvas-label-fixed': Fixed size label
     * - 'canvas-label': Dynamic size label
     *
     * 支持两种标签类型：
     * - 'canvas-label-fixed': 固定大小标签
     * - 'canvas-label': 动态大小标签
     */
    _createObject(paint: Paint): Promise<Object3D>;
}

/**
 * Layer abstract base class.
 * 图层抽象基类
 *
 * @description
 * Base class for all layers, providing basic layer functionality:
 * - Visibility control
 * - Opacity setting
 * - Z-index management
 * - Animation support
 *
 * 所有图层的基类，提供图层的基础功能：
 * - 可见性控制
 * - 透明度设置
 * - 层级管理
 * - 动画支持
 *
 * @abstract
 * @extends EventMixin(BaseMixin(Group))
 * @category Layer
 */
declare abstract class Layer extends Layer_base {
    /**
     * Layer unique identifier.
     * 图层唯一标识
     */
    private _layerId;
    /**
     * Layer opacity.
     * 图层透明度
     */
    opacity: number;
    /**
     * Animation callback set.
     * 动画回调集合
     */
    private _animCallbacks;
    /**
     * Whether it is a scene layer.
     * 是否为场景层
     */
    isSceneLayer: boolean;
    /**
     * Current altitude record.
     * 当前高度记录
     */
    protected _baseAltitude: number;
    /**
     * Layer-level depth offset (default value for style depthOffset).
     * 图层级深度偏移（作为样式 depthOffset 的默认值）
     */
    depthOffset?: number;
    /**
     * Region overlay configuration set (common to all subclasses).
     * 区域蒙版配置集合（所有子类通用）
     */
    private _regionConfigs;
    /**
     * Create a layer instance.
     * 创建图层实例
     * @param layerId - Layer ID. 图层ID
     * @param config - Layer configuration. 图层配置
     * @throws Throws error if id is not provided. 如果未提供id会抛出错误
     */
    constructor(layerId: string, config?: LayerOptions);
    /**
     * Get layer ID.
     * 获取图层ID
     * @returns Layer ID
     *          图层ID
     */
    getId(): string;
    /**
     * Add layer to map.
     * 将图层添加到地图
     * @param mapInstance Map instance
     *            地图实例
     * @returns this
     */
    addTo(mapInstance: Map_2): this;
    /**
     * Get layer z-index.
     * 获取图层层级
     * @returns Current z-index
     *          当前层级
     */
    getZIndex(): number;
    /**
     * Get layer depth offset.
     * 获取图层深度偏移
     * @returns Current layer depthOffset
     *          当前图层的 depthOffset
     */
    getDepthOffset(): number;
    /**
     * Get layer opacity.
     * 获取图层透明度
     * @returns Current opacity
     *          当前透明度
     */
    getOpacity(): number;
    /**
     * Set layer opacity.
     * 设置图层透明度
     * @param val Opacity value (0-1)
     *                透明度值 (0-1)
     *
     * @description
     * Recursively update opacity of all child elements, including:
     * - Objects with material property
     * - Special types like Sprite
     *
     * 递归更新所有子元素的透明度，包括：
     * - 带有material属性的对象
     * - Sprite等特殊类型
     */
    setOpacity(val: number): void;
    /**
     * Get associated map instance.
     * 获取关联的地图实例
     * @returns Map instance or null
     *          地图实例或null
     */
    getMap(): any;
    /**
     * Show layer.
     * 显示图层
     * @returns this
     */
    show(): this;
    /**
     * Hide layer.
     * 隐藏图层
     * @returns this
     */
    hide(): this;
    /**
     * Set layer altitude.
     * 设置图层高度 (海拔)
     * @param val Altitude value
     *                 高度值
     * @description
     * Modify layer position in vertical direction.
     * 修改图层在垂直方向上的位置。
     */
    setAltitude(val: number): this;
    /**
     * Get current layer altitude.
     * 获取当前图层高度
     * @returns Altitude value
     *          高度值
     */
    getAltitude(): number;
    /**
     * Bind map instance.
     * 绑定地图实例
     * @param mapInstance Map instance
     *            地图实例
     *
     * @protected
     */
    _bindMap(mapInstance: Map_2): void;
    /**
     * Animation method (Optional implementation for subclasses).
     * 动画方法（子类可选实现）
     * @param delta Frame interval time
     *              帧间隔时间
     * @param elapsedtime Elapsed time
     *                    累计时间
     * @param context SceneRenderer context
     *                SceneRenderer 上下文
     *
     * @protected
     * @abstract
     */
    protected animate?(delta: number, elapsedtime: number, context: SceneRenderer): void;
    /**
     * Register animation callback.
     * 注册动画回调
     *
     * @private
     */
    private _registerAnimate;
    /**
     * Clear animation callbacks.
     * 清除动画回调
     *
     * @protected
     */
    protected _clearAnimationCallbacks(): void;
    /**
     * Get layer configuration.
     * 获取图层配置
     * @returns Layer configuration
     *          图层配置
     */
    getOptions(): LayerOptions;
    /**
     * Batch set region overlays.
     * 批量设置区域蒙版
     * @param configs Region overlay configuration array
     *                 区域蒙版配置数组
     */
    setRegionOverlays(configs: RegionOverlayConfig[]): this;
    /**
     * Add a single region overlay.
     * 添加单个区域蒙版
     * @param overlay Region overlay configuration
     *                区域蒙版配置
     * @returns Generated overlay ID
     *          生成的蒙版 id
     */
    addRegionOverlay(overlay: RegionOverlayConfig): string;
    /**
     * Remove region overlay by ID.
     * 移除指定 id 的区域蒙版
     * @param id Region overlay ID
     *           区域蒙版 id
     */
    removeRegionOverlay(id: string): this;
    /**
     * Clear all region overlays.
     * 清空所有区域蒙版
     */
    clearRegionOverlays(): this;
    /**
     * Get all current region overlays (Returns a copy to avoid direct external modification).
     * 获取当前所有区域蒙版（返回副本，避免外部直接修改）
     */
    getRegionOverlays(): RegionOverlayConfig[];
    /**
     * Generate region overlay ID.
     * 生成区域蒙版 id
     */
    private _generateRegionOverlayId;
}

declare const Layer_base: {
    new (...args: any[]): {
        [key: string]: any;
        _handlers?: Handler[];
        addHandler(name: string | number, handlerClass: new (arg0: /*elided*/ any) => any): /*elided*/ any;
        removeHandler(name: string | number): /*elided*/ any;
        _clearHandlers(): void;
    };
} & {
    new (...args: any[]): {
        eventClass: EventClass;
        on: (type: string, listener: (data?: any) => void) => EventClass;
        fire: (type: string, data?: any) => EventClass;
        off: (type: string, listener: (...args: any[]) => void) => EventClass;
    };
} & {
    new (...args: any[]): {
        [x: string]: any;
        options: any;
        _isUpdatingOptions?: boolean;
        _initHooksCalled?: boolean;
        _initHooks?: Function[];
        _proxyOptions(): /*elided*/ any;
        _callInitHooks(): /*elided*/ any;
        setOptions(options: ClassOptions): /*elided*/ any;
        configure(conf?: string | ClassOptions, value?: any): ClassOptions | /*elided*/ any;
        onOptionsChange(_conf: ClassOptions): void;
        _visitInitHooks(proto: {
            _initHooks: any;
        }): void;
    };
    mergeOptions(options: ClassOptions): /*elided*/ any & typeof Group;
    addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & typeof Group;
    include(...sources: any[]): /*elided*/ any & typeof Group;
} & typeof Group;

/**
 * Layer base configuration options.
 * 图层基础配置项
 * @category Layer
 */
declare type LayerOptions = {
    /**
     * Attribution information.
     * 版权信息
     */
    attribution?: string;
    /**
     * Whether the layer is visible.
     * 是否可见
     */
    visible?: boolean;
    /**
     * Opacity (0-1).
     * 透明度 (0-1)
     */
    opacity?: number;
    /**
     * Layer z-index.
     * 图层层级
     */
    zIndex?: number;
    /**
     * Whether it is a scene layer.
     * 是否为场景层
     */
    isSceneLayer?: boolean;
    /**
     * Base altitude of the layer.
     * 图层基础高度/海拔
     */
    altitude?: number;
    /**
     * Layer-level depth offset (default value for style depthOffset).
     * 图层级深度偏移（作为样式 depthOffset 的默认值）
     */
    depthOffset?: number;
};

export declare interface LightPaint extends BasePaint {
    type: 'light';
    /** 点颜色 */
    color?: string | number | Color;
    /** 点大小 */
    size?: number;
    /** 图标URL */
    icon?: string;
}

/**
 * Line feature abstract base class.
 * 线要素抽象基类
 *
 * @description
 * Represents a line feature in the 3D scene, inheriting from the Feature class.
 * Provides basic functionality for line features, including:
 * - LngLatLike transformation
 * - Line geometry creation
 * - Style application
 *
 * 表示3D场景中的线要素，继承自Feature类
 * 提供线要素的基础功能，包括：
 * - 坐标转换
 * - 线几何体创建
 * - 样式应用
 *
 * @abstract
 * @extends Feature
 * @category Feature
 */
declare abstract class Line extends Feature {
    /**
     * Base type identifier.
     * 基础类型标识
     */
    readonly _baseType = "Line";
    /**
     * Specific line type identifier (implemented by subclasses).
     * 具体线类型标识（由子类实现）
     */
    abstract _type: string;
    /**
     * Array of vertex coordinates.
     * 顶点坐标数组
     */
    _vertexPoints: number[];
    /**
     * Create a Line feature instance.
     * 创建线要素实例
     *
     * @param options Line feature configuration
     *                线要素配置
     */
    constructor(options: LineOptions);
    /**
     * LngLatLike transformation method.
     * 坐标转换方法
     *
     * @returns Transformed coordinate information
     *          转换后的坐标信息
     *
     * @description
     * Converts geographic coordinates to world coordinates and calculates coordinates relative to map center.
     *
     * 将地理坐标转换为世界坐标，并计算相对于地图中心的坐标
     */
    _coordsTransform(): any;
    /**
     * Convert to Three.js geometry (abstract method).
     * 转换为Three.js几何体（抽象方法）
     *
     * @abstract
     */
    _buildRenderObject(): void;
    /**
     * Create basic line geometry.
     * 创建基础线几何体
     *
     * @returns Line2 instance
     *          Line2实例
     *
     * @protected
     * @description
     * Creates line geometry with default material. Subclasses can extend or override this method.
     *
     * 创建带有默认材质的线几何体，子类可扩展或重写此方法
     */
    protected _createRenderObject(): Line2;
}

/**
 * Line Layer class.
 * 线图层类
 *
 * @description
 * Specialized layer for managing Line features, inheriting from OverlayLayer base class.
 * Provides functions for adding, removing, and rendering line features.
 * 用于管理线要素的专用图层，继承自OverlayLayer基类。
 * 提供线要素的添加、删除、渲染等功能。
 *
 * @extends OverlayLayer<Line>
 * @category Layer
 */
export declare class LineLayer extends OverlayLayer<Line> {
    /**
     * Constructor.
     * 构造函数
     * @param id Layer unique identifier.
     *           图层唯一标识符
     * @param options Line layer configuration options.
     *                线图层配置选项
     */
    constructor(id: string, options?: LineLayerOptions);
    /**
     * Validate if feature belongs to this layer.
     * 验证要素是否属于此图层
     * @param feature Line feature to validate.
     *                要验证的线要素
     * @returns Whether it is a valid Line feature.
     *          是否为合法的线要素
     *
     * @description
     * Implement parent abstract method, check if feature base type is 'Line'.
     * 实现父类抽象方法，检查要素的基础类型是否为'Line'。
     * @override
     */
    protected validateFeature(feature: Line): boolean;
}

/**
 * Line Layer configuration options.
 * 线图层配置选项
 *
 * @extends OverlayLayerOptions<Line>
 * @description
 * Configuration options for Line Layer, extending basic overlay layer options.
 * Can add Line Layer specific configurations.
 * 线图层的配置选项，继承自基础覆盖图层选项。
 * 可添加线图层特有的配置项。
 * @category Layer
 */
export declare type LineLayerOptions = OverlayLayerOptions<Line> & {};

/**
 * Line feature configuration options.
 * 线要素配置选项
 *
 * @extends FeatureOptions
 * @category Feature
 */
declare type LineOptions = FeatureOptions & {
    /**
     * GeoJSON line geometry data.
     * GeoJSON线几何数据
     */
    geometry?: LineString_2 | MultiLineString_2;
};

/**
 * Line paint configuration.
 * 基础线样式配置
 * @category Paint
 */
export declare interface LinePaint extends BasePaint {
    type: 'line';
    /** 线颜色 */
    color?: string | number | Color;
    /** 线宽 */
    width?: number;
    /** 虚线模式 */
    dashArray?: [number, number];
    /** 透明度 */
    opacity?: number;
    /** 渲染层级 */
    zIndex?: number;
    /** 渲染器分辨率 */
    resolution?: Vector2;
}

/**
 * Line paint union type.
 * 线样式联合类型
 * @category Paint
 */
export declare type LinePaintUnion = LinePaint | TubePaint | FlowTubePaint | FlowTexturePaint | ArrowPaint;

/**
 * LineString feature class.
 * 线要素类
 *
 * @description
 * Represents a line feature in the 3D scene, inheriting from the Line base class.
 * Provides functionality for creating, updating, and rendering line features, supporting basic line styles.
 *
 * 表示3D场景中的线要素，继承自Line基类
 * 提供线要素的创建、更新和渲染功能，支持基础线样式
 *
 * @extends Line
 * @category Feature
 */
export declare class LineString extends Line {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string;
    /**
     * Create a LineString feature instance.
     * 创建线要素实例
     *
     * @param options Configuration options for the line feature
     *                线要素配置
     */
    constructor(options: LineStringOptions);
    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     *
     * @returns Promise<void>
     *
     * @description
     * Creates line geometry based on style configuration and performs coordinate transformation.
     *
     * 根据样式配置创建线几何体，并进行坐标转换
     */
    _buildRenderObject(): Promise<void>;
    /**
     * Quickly update geometry vertex positions (without rebuilding the entire geometry).
     * 快速更新几何体顶点位置（不重建整个几何体）
     *
     * @description
     * Used for real-time interactions like dragging and editing. Updates only Line2 vertex positions without destroying and rebuilding geometry.
     * This is much faster than full rebuild and keeps the feature visible during dragging.
     *
     * 用于拖拽、编辑等实时交互场景，仅更新Line2的顶点位置而不销毁重建几何体。
     * 这比完整重建快得多，并且能保持feature在拖拽过程中可见。
     */
    protected _refreshCoordinates(): void;
    /**
     * Create line object.
     * 创建线对象
     *
     * @param style - Style configuration 样式配置
     * @returns Created line object 创建的线对象
     * @throws Throws error if style type is not supported 如果样式类型不支持会抛出错误
     *
     * @description
     * Currently supported style types:
     * - 'basic-line': Basic line style
     *
     * 当前支持样式类型：
     * - 'basic-line': 基础线样式
     */
    _createObject(paint: Paint): Promise<Object3D>;
}

/**
 * LineString feature configuration options.
 * 线要素配置选项
 *
 * @extends LineOptions
 * @category Feature
 */
export declare type LineStringOptions = LineOptions & {};

/**
 * Geographic coordinate type.
 * 基础坐标类型
 * @description Represents a point in 2D or 3D space. 表示二维或三维空间中的坐标点
 *
 * @typedef {Array} LngLatLike
 * @property {number} 0 - Longitude or X coordinate. X坐标（经度或水平位置）
 * @property {number} 1 - Latitude or Y coordinate. Y坐标（纬度或垂直位置）
 * @property {number} [2] - Optional altitude or Z coordinate. 可选Z坐标（高度或深度）
 *
 * @example
 * // 2D coordinate
 * const coord2D: LngLatLike = [116.404, 39.915];
 *
 * @example
 * // 3D coordinate
 * const coord3D: LngLatLike = [116.404, 39.915, 500];
 * @category Types
 */
declare type LngLatLike = [number, number] | [number, number, number];

/**
 * 加载器元数据
 */
export declare interface LoaderMetadata {
    version: string;
    author?: string;
    description?: string;
}

/**
 * Loader Utilities Class
 * @class LoaderUtils
 */
export declare class LoaderUtils {
    /**
     * 计算图片裁剪区域
     * @param clipBounds 裁剪边界 [minx, miny, maxx, maxy] (0-1)
     * @param targetSize 目标尺寸
     * @returns {sx, sy, sw, sh}
         */
     static getBoundsCoord(clipBounds: [number, number, number, number], targetSize: number): {
         sx: number;
         sy: number;
         sw: number;
         sh: number;
     };
     /**
      * 获取安全瓦片 URL 和裁剪边界
      * @description 如果请求级别超过最大级别，则回退到最大级别并计算裁剪边界
      */
     static getSafeTileUrlAndBounds(source: ISource, x: number, y: number, z: number): {
         url: string | undefined;
         clipBounds: [number, number, number, number];
     };
     private static getMaxLevelTileAndBounds;
    }

    /**
     * 地面位置信息类型
     * @extends Intersection
     * @description 扩展Three.js的相交检测结果，添加地理位置信息
     * @category Map
     */
    export declare interface LocationInfo extends Intersection {
        /** 地理位置坐标（经纬度） */
        location: Vector3;
    }

    /**
     */
    declare enum LODAction {
        none = 0,
        create = 1,
        remove = 2
    }

    /**
     * Map main class, inheriting from EventMixin and BaseMixin.
     * 地图主类，继承自事件混入和基础混入
     * @category Map
     * @example
     * const map = new Map('map-container', {
     *   state: {
     *     center: [120, 30],
     *     zoom: 12
     *   },
     *   source: {
     *     baseLayers: [...]
     *   }
     * });
     */
    declare class Map extends Map_base {
        /**
         * SceneRenderer instance.
         * 场景渲染器实例
         */
        sceneRenderer: SceneRenderer;
        /**
         * Map root object
         * 地图根对象
         */
        private _rootGroup;
        /**
         * Map layers
         * 地图图层
         */
        private _layers;
        /**
         * Map projection
         * 地图投影
         */
        private _mapProjection;
        /**
         * Update clock
         * 更新时钟
         */
        private readonly _animationClock;
        /**
         * Whether to automatically update
         * 是否自动更新
         */
        autoUpdate: boolean;
        /**
         * Update interval (ms)
         * 更新间隔（毫秒）
         */
        updateInterval: number;
        /**
         * Min zoom level
         * 最小缩放级别
         */
        minLevel: number;
        /**
         * Max zoom level
         * 最大缩放级别
         */
        maxLevel: number;
        get projection(): MapProjection;
        get lon0(): number;
        /**
         * Convert geographic coordinate to map model coordinate
         * 地理坐标转换到地图模型坐标
         * @param lngLat Geographic coordinate (Long, Lat, Alt)
         * @returns Map model coordinate
         */
        lngLatToPoint(lngLat: Vector3): Vector3;
        /**
         * Convert geographic coordinate to world coordinate
         * 地理坐标转换到世界坐标
         * @param lngLat Geographic coordinate (Long, Lat, Alt)
         * @returns World coordinate
         */
        lngLatToWorld(lngLat: Vector3): Vector3;
        /**
         * Convert map model coordinate to geographic coordinate
         * 地图模型坐标转换到地理坐标
         * @param point Map model coordinate
         * @returns Geographic coordinate (Long, Lat, Alt)
         */
        pointToLngLat(point: Vector3): Vector3;
        /**
         * Convert world coordinate to geographic coordinate
         * 世界坐标转换到地理坐标
         * @param worldPos World coordinate
         * @returns Geographic coordinate (Long, Lat, Alt)
         */
        worldToLngLat(worldPos: Vector3): Vector3;
        /**
         * Query intersection info at geographic coordinate
         * 查询指定地理坐标的交互/地面信息
         * @param lngLat Geographic coordinate
         * @returns Intersection info
         */
        queryAtLngLat(lngLat: Vector3): LocationInfo | undefined;
        /**
         * Query intersection info at world coordinate
         * 查询指定世界坐标的交互/地面信息
         * @param worldPos World coordinate
         * @returns Intersection info
         */
        queryAtWorld(worldPos: Vector3): LocationInfo | undefined;
        /**
         * Query intersection info at screen pixel coordinate
         * 查询指定屏幕坐标的交互/地面信息
         * @param point Screen pixel coordinate
         * @returns Intersection info
         */
        queryAtPoint(point: Vector2): LocationInfo | undefined;
        /**
         * Map center coordinates.

         * 地图中心点坐标
         */
        readonly center: LngLatLike;
        /**
         * Projected map center coordinates.
         * 投影后的地图中心点坐标
         */
        readonly prjcenter: Vector3;
        /**
         * Map configuration options.
         * 地图配置选项
         */
        options: MapOptions;
        /**
         * Layer container instance.
         * 图层容器实例
         */
        private _layerContainer;
        /**
         * Event map table.
         * 事件映射表
         */
        private _eventState;
        /**
         * Canvas manager instance.
         * 画布管理器实例
         */
        private _canvasMgr;
        /**
         * Collision engine instance.
         * 碰撞引擎实例
         */
        private _collisionEngine;
        /**
         * Load hook function array.
         * 加载钩子函数数组
         */
        _onLoadHooks: Array<(...args: any[]) => void>;
        /**
         * Minimum/Maximum allowed zoom level for view (Configurable externally, only used for clipping logic).
         * 视图允许的最小/最大缩放级别（对外可配置，只用于裁剪逻辑）
         */
        private _minZoom;
        private _maxZoom;
        /**
         * Internal global zoom scale (Determines relation between zoom and distance, only for setZoom camera pushing).
         * 内部使用的全局 zoom 标尺（决定 zoom 与距离的关系，仅用于 setZoom 推相机）
         */
        private readonly _ZOOM_MIN_CONST;
        private readonly _ZOOM_MAX_CONST;
        /**
         * Nearest/Farthest allowed camera distance during zoom (Used for mapping).
         * 缩放时相机允许的最近/最远距离（用于映射）
         */
        private _minZoomDistance;
        private _maxZoomDistance;
        /**
         * Whether currently in zoom interaction.
         * 当前是否处于缩放交互中
         */
        private _isZooming;
        /**
         * Start zoom value of current zoom operation.
         * 本次缩放起始 zoom 值
         */
        private _zoomStartValue;
        /**
         * Last recorded zoom (Used for control events).
         * 上一次记录的 zoom（用于控制器事件）
         */
        private _lastZoomForControls;
        /**
         * "Extra zoom levels" beyond data levels (Overzoom count).
         * 超出数据层级后的“额外 zoom 级数”（overzoom 计数）
         */
        private _overZoom;
        /**
         * Record camera distance to target in previous frame, used to determine zoom in/out direction.
         * 记录上一帧相机到目标点的距离，用于判断放大/缩小方向
         */
        private _lastCameraDistance;
        /**
         * Create map instance.
         * 创建地图实例
         *
         * @param domContainer Map container element or element ID
         *                  地图容器元素或元素ID
         * @param config Map configuration options
         *                地图配置选项
         */
        constructor(container: HTMLElement | string, options: MapOptions);
        /**
         * Add hook function after load completion.
         * 添加加载完成后的钩子函数
         *
         * @param fn Function name or function
         *           函数名或函数
         * @param args Additional arguments
         *             附加参数
         * @returns Map class
         *          地图类
         */
        static addOnLoadHook(fn: string | ((this: Map, ...args: any[]) => void), ...args: any[]): typeof Map;
        /**
         * Internal method: Call all load hook functions.
         * 内部方法:调用所有加载钩子函数
         */
        _callOnLoadHooks(): void;
        /**
         * Get current "View Zoom Level".
         * 获取当前“视图缩放级别”
         *
         * @description
         * Mapped to fixed scale [0, 22] based on camera distance.
         * This value can exceed data source maxLevel (e.g., 18), used for UI / Styling / Interaction.
         * 按相机距离映射到固定标尺 [0, 22]。
         * 这个值可以超过数据源的 maxLevel（比如 18），用于 UI / 样式 / 交互。
         */
        getZoom(): number;
        /**
         * Get current "Data Zoom Level" (Tile z).
         * 获取当前“数据缩放级别”（瓦片 z）
         *
         * @description
         * Actual z calculated from TileMap base layer tile tree.
         * Max value limited by data source and TileLayer.maxLevel, e.g., data only goes up to 18.
         * 从 TileMap 的底图瓦片树中统计出来的实际 z。
         * 最大值受数据源和 TileLayer.maxLevel 限制，例如数据只到 18。
         */
        getTileZoom(): number;
        /**
         * Get view minimum zoom level.
         * 获取视图最小缩放级别
         */
        getMinZoom(): number;
        /**
         * Get view maximum zoom level.
         * 获取视图最大缩放级别
         */
        getMaxZoom(): number;
        /**
         * Set view zoom range.
         * 设置视图缩放范围
         *
         * @param minZoom Minimum zoom level
         *                最小缩放级别
         * @param maxZoom Maximum zoom level
         *                最大缩放级别
         */
        setZoomBounds(minZoom: number, maxZoom: number): this;
        /**
         * Set minimum zoom level.
         * 设置最小缩放级别
         */
        setMinZoom(minZoom: number): this;
        /**
         * Set maximum zoom level.
         * 设置最大缩放级别
         */
        setMaxZoom(maxZoom: number): this;
        /**
         * Set zoom level.
         * 设置缩放级别
         *
         * @param zoom Target zoom level
         *             目标缩放级别
         * @returns Map instance
         *          地图实例
         */
        setZoom(zoom: number): this;
        /**
         * Zoom in by specified levels.
         * 放大指定级数
         *
         * @param delta Zoom in levels, default 1
         *              放大级数，默认 1
         */
        zoomIn(delta?: number): this;
        /**
         * Zoom out by specified levels.
         * 缩小指定级数
         *
         * @param delta Zoom out levels, default 1
         *              缩小级数，默认 1
         */
        zoomOut(delta?: number): this;
        /**
         * Inverse calculate camera distance to target from view zoom level.
         * 根据视图缩放级别反推相机到目标点的距离
         */
        private _computeDistanceFromZoom;
        /**
         * Initialize map.
         * 初始化地图
         */
        private initMap;
        /* Excluded from this release type: _updateDefaultGroundVisibility */
        /**
         * Show or hide the default ground plane manually.
         * 手动显示或隐藏默认地面
         *
         * @param visible - Whether to show the ground plane. 是否显示地面
         * @returns Current map instance. 当前地图实例
         */
        setGroundVisible(visible: boolean): this;
        /**
         * Check if the default ground plane is visible.
         * 检查默认地面是否可见
         *
         * @returns Whether the ground is visible. 地面是否可见
         */
        isGroundVisible(): boolean;
        /**
         * Update map and layers.
         * 更新地图和图层
         */
        render(camera: Camera): void;
        /**
         * Add layer(s) to the map.
         * 添加图层到地图
         *
         * @param layerOrLayers Layer object or array of layer objects
         *               图层对象或图层对象数组
         * @param otherLayers Other layer objects
         *                    其他图层对象
         * @returns Current map instance
         *          当前地图实例
         */
        addLayer(layerOrLayers: Layer | Array<Layer>, ...otherLayers: Array<Layer>): this;
        /**
         * Remove layer.
         * 移除图层
         */
        removeLayer(id: string): boolean;
        /**
         * Add regular layer (Add to scene only).
         * 添加普通图层（只添加到场景）
         */
        private addRegularLayer;
        /**
         * Add tile layer.
         * 添加瓦片图层
         */
        addTileLayer(layer: ITileLayer): this;
        /**
         * Clear all layers.
         * 清空所有图层
         *
         * @returns Layer container instance
         *          图层容器实例
         */
        clearLayers(): this;
        /**
         * Get all layers.
         * 获取所有图层
         *
         * @returns Array of layers
         *          图层数组
         */
        getLayers(): any[];
        /**
         * Get layer by ID.
         * 根据ID获取图层
         *
         * @param id Layer ID
         *           图层ID
         * @returns Layer instance or undefined
         *          图层实例或undefined
         */
        getLayer(id: string): any;
        /**
         * Get canvas.
         * 获取画布
         *
         * @param width Canvas width
         *              画布宽度
         * @param height Canvas height
         *               画布高度
         * @param keySuffix Key suffix
         *                  键名后缀
         * @returns Canvas instance
         *          画布实例
         */
        _getCanvas(width?: number, height?: number, keySuffix?: string): HTMLCanvasElement;
        /**
         * Get map container.
         * 获取地图容器
         *
         * @returns Map container instance
         *          地图容器实例
         */
        getContainer(): HTMLElement | undefined;
        /**
         * Get renderer.
         * 获取渲染器
         *
         * @returns Renderer instance
         *          渲染器实例
         */
        getRenderer(): WebGLRenderer;
        /**
         * Get camera.
         * 获取相机
         *
         * @returns Camera instance
         *          相机实例
         */
        getCamera(): PerspectiveCamera;
        /**
         * Find all Features at a specific position.
         * 找出某位置的所有Feature
         */
        _queryFeaturesAt(position: {
            x: number;
            y: number;
        }): any[];
        /**
         * Get current map center point (Longitude, Latitude).
         * 获取当前地图中心点（经纬度）
         *
         * @returns Coordinate [lng, lat, height]
         */
        getCenter(): LngLatLike;
        /**
         * Get event position (Screen coordinates).
         * 获取事件位置（屏幕坐标）
         */
        _getPointerPosition(domEvent: MouseEvent | TouchEvent): {
            x: number;
            y: number;
        } | null;
        get isInteracting(): boolean;
        /**
         * Internal tool: Get distance from current camera to target point.
         * 内部工具：获取当前相机到目标点的距离
         */
        private _getCameraDistance;
        /**
         * Internal tool: Calculate theoretically reachable zoom range of view based on current control distance limits.
         * 内部工具：根据当前控制器的距离限制，推算视图理论可达的 zoom 区间
         *
         * @returns {Object} `{ min: number, max: number }`
         */
        private _getViewZoomRange;
        /**
         * Fly to specified position.
         * 飞行到指定位置
         *
         * @param flyConfig Flight parameters object
         *                飞行参数对象
         */
        flyTo(flyConfig: FlyToOptions): void;
        /**
         * Fly to point position.
         * 飞行到指定点的位置
         *
         * @param flyConfig Flight parameters object
         *                飞行参数对象
         */
        easeTo(flyConfig: EaseToOptions): void;
        /**
         * Destroy map instance, release all resources.
         * 销毁地图实例，释放所有资源
         *
         * @description
         * This method cleans up the following resources:
         * 1. Remove all event listeners
         * 2. Clear all layers
         * 3. Destroy collision engine
         * 4. Destroy sceneRenderer (including renderer, scene, controls, etc.)
         * 5. Clean up DOM container
         *
         * 该方法会清理以下资源：
         * 1. 移除所有事件监听器
         * 2. 清空所有图层
         * 3. 销毁碰撞引擎
         * 4. 销毁sceneRenderer（包括renderer、scene、controls等）
         * 5. 清理DOM容器
         */
        dispose(): void;
    }
    export { Map_2 as Map }

    declare const Map_base: {
        new (...args: any[]): {
            [key: string]: any;
            _handlers?: Handler[];
            addHandler(name: string | number, handlerClass: new (arg0: /*elided*/ any) => any): /*elided*/ any;
            removeHandler(name: string | number): /*elided*/ any;
            _clearHandlers(): void;
        };
    } & {
        new (...args: any[]): {
            eventClass: EventClass;
            on: (type: string, listener: (data?: any) => void) => EventClass;
            fire: (type: string, data?: any) => EventClass;
            off: (type: string, listener: (...args: any[]) => void) => EventClass;
        };
    } & {
        new (...args: any[]): {
            [x: string]: any;
            options: any;
            _isUpdatingOptions?: boolean;
            _initHooksCalled?: boolean;
            _initHooks?: Function[];
            _proxyOptions(): /*elided*/ any;
            _callInitHooks(): /*elided*/ any;
            setOptions(options: ClassOptions): /*elided*/ any;
            configure(conf?: string | ClassOptions, value?: any): /*elided*/ any | ClassOptions;
            onOptionsChange(_conf: ClassOptions): void;
            _visitInitHooks(proto: {
                _initHooks: any;
            }): void;
        };
        mergeOptions(options: ClassOptions): /*elided*/ any & typeof EmptyClass;
        addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & typeof EmptyClass;
        include(...sources: any[]): /*elided*/ any & typeof EmptyClass;
    } & typeof EmptyClass;

    /**
     * Mapbox RGB 地形加载器
     * @class MapboxRGBLoader
     */
    export declare class MapboxRGBLoader extends AbstractGeometryLoader {
        readonly info: {
            version: string;
            description: string;
        };
        readonly dataType = "terrain-rgb";
        private imageLoader;
        private workerPool;
        constructor();
        /**
         * 执行加载
         * @param url
         * @param context
         */
        protected performLoad(url: string, context: SourceLoadContext): Promise<MapTileGeometry>;
        /**
         * 提取子图像数据
         * @param image 源图像
         * @param bounds 裁剪边界
         * @param targetSize 目标尺寸
         */
        private extractSubImageData;
    }

    /**
     * MapBox数据源类
     * @description 提供MapBox在线地图服务的瓦片数据
     * @extends TileSource
     */
    export declare class MapBoxSource extends TileSource {
        /**
         * MapBox访问令牌
         * @description 用于API请求认证
         */
        token: string;
        /**
         * 瓦片图像格式
         * @default "webp"
         * @description 支持webp、png、jpg等格式
         */
        format: string;
        /**
         * 地图样式ID
         * @default "cm2myr6qx001t01pi0sf7estf"
         */
        style: string;
        /**
         * 数据源版权信息
         * @default "MapBox"
         */
        attribution: string;
        /**
         * 最大缩放级别
         * @default 25
         */
        maxLevel: number;
        /**
         * 瓦片URL模板
         * @default "https://api.mapbox.com/styles/v1/criska/cm2myr6qx001t01pi0sf7estf/tiles/256/{z}/{x}/{y}?access_token={token}&format={format}"
         * @description 模板变量：
         * - {z}: 缩放级别
         * - {x}: 瓦片X坐标
         * - {y}: 瓦片Y坐标
         * - {token}: 访问令牌
         * - {format}: 图像格式
         */
        url: string;
        /**
         * 构造函数
         * @param options 配置选项
         * @throws 当未提供token时抛出错误
         */
        constructor(options?: MapBoxSourceOptions);
    }

    /**
     * MapBox数据源配置选项
     * @extends SourceOptions
     */
    export declare type MapBoxSourceOptions = SourceOptions & {
        /**
         * 地图样式ID
         * @default "cm2myr6qx001t01pi0sf7estf"
         */
        style?: string;
        /**
         * MapBox访问令牌（必填）
         * @description 用于验证MapBox API请求的访问令牌
         */
        token: string;
    };

    /**
     * Mapbox Vector Tile Geometry Loader
     * Mapbox 矢量瓦片几何体加载器
     *
     * @description
     * Loads and parses Mapbox Vector Tile (MVT) data, returning a geometry with parsed vector data in userData.
     * It uses a worker pool to parse MVT data in parallel.
     *
     * 加载并解析 Mapbox 矢量瓦片 (MVT) 数据，返回 userData 中包含解析后矢量数据的几何体。
     * 使用 Worker 池并行解析 MVT 数据。
     */
    export declare class MapboxVectorTileGeometryLoader implements IGeometryLoader {
        readonly info: LoaderMetadata;
        readonly dataType = "vector-tile";
        private fileLoader;
        private _workerPool;
        constructor();
        /**
         * Load tile geometry (vector data container)
         * 加载瓦片几何体（矢量数据容器）
         */
        load(context: SourceLoadContext): Promise<BufferGeometry>;
        private fetchVectorData;
        private buildTileUrl;
        private createGeometryWithVectorData;
        private createErrorGeometry;
        unload(geometry: BufferGeometry): void;
    }

    /**
     * Map general configuration (using nested objects to distinguish modules).
     * 地图总配置类型（用嵌套对象区分模块）
     * @category Map
     */
    export declare type MapOptions = {
        /**
         * Renderer configuration options.
         * 渲染器配置选项
         */
        renderer?: SceneRendererOptions;
        /**
         * Camera configuration options.
         * 相机配置选项
         */
        camera?: CameraOptions;
        /**
         * Interaction configuration options.
         * 交互配置选项
         */
        interaction?: InteractionOptions;
        /**
         * Source configuration options (tile layers and data levels).
         * 数据源配置选项（瓦片图层和数据级别）
         */
        source?: MapSourceOptions;
        /**
         * Map state configuration options.
         * 地图状态配置选项
         */
        state: StateOptions;
    };

    /**
     * 地图投影接口
     * @interface MapProjection
     * @description 定义了地图投影系统必须实现的核心功能，包括坐标转换和尺度信息。
     */
    declare interface MapProjection {
        /**
         * 投影系统的唯一标识符 (EPSG代码)
         */
        readonly ID: ProjectionType_2;
        /**
         * 投影坐标系下的地图总宽度 (米)
         */
        readonly mapWidth: number;
        /**
         * 投影坐标系下的地图总高度 (米)
         */
        readonly mapHeight: number;
        /**
         * 投影坐标系下的地图深度 (米)
         */
        readonly mapDepth: number;
        /**
         * 中央经线 (度)
         */
        readonly centralMeridian: number;
        /**
         * 将地理坐标转换为投影坐标
         * @param longitude 经度 (度)
         * @param latitude 纬度 (度)
         * @returns 投影坐标 {x, y} (米)
         */
        forward(longitude: number, latitude: number): {
            x: number;
            y: number;
        };
        /**
         * 将投影坐标转换为地理坐标
         * @param x 投影坐标 X (米)
         * @param y 投影坐标 Y (米)
         * @returns 地理坐标 {lon, lat} (度)
         */
        inverse(x: number, y: number): {
            lon: number;
            lat: number;
        };
        /**
         * 计算瓦片在考虑中央经线偏移后的 X 坐标
         * @param tileX 原始瓦片 X 坐标
         * @param zoom 瓦片层级
         * @returns 调整后的瓦片 X 坐标
         */
        adjustTileXWithCentralMeridian(tileX: number, zoom: number): number;
        /**
         * 根据经纬度边界获取投影坐标边界
         * @param bounds [minLon, minLat, maxLon, maxLat]
         * @returns [minX, minY, maxX, maxY]
         */
        getProjectedBoundsFromGeoBounds(bounds: [number, number, number, number]): [number, number, number, number];
        /**
         * 获取指定瓦片的投影坐标边界
         * @param x 瓦片 X 坐标
         * @param y 瓦片 Y 坐标
         * @param z 瓦片层级
         * @returns [minX, minY, maxX, maxY]
         */
        getTileProjectedBounds(x: number, y: number, z: number): [number, number, number, number];
        /**
         * 获取指定瓦片的经纬度边界
         * @param x 瓦片 X 坐标
         * @param y 瓦片 Y 坐标
         * @param z 瓦片层级
         * @returns [minLon, minLat, maxLon, maxLat]
         */
        getTileGeoBounds(x: number, y: number, z: number): [number, number, number, number];
    }

    /**
     * Map source configuration options (tile layers and data levels).
     * 地图数据源配置选项（瓦片图层和数据级别）
     * @category Map
     */
    export declare type MapSourceOptions = {
        /** Min data level 最小数据级别 */
        minLevel?: number;
        /** Max data level 最大数据级别 */
        maxLevel?: number;
        /** Base tile layers 底图瓦片图层 */
        baseLayers?: ITileLayer[];
    };

    /**
     * 地图瓦片几何体
     * @class MapTileGeometry
     * @extends PlaneGeometry
     * @description 专用于地图瓦片的几何体，支持设置地形数据和自动生成裙边。
     */
    export declare class MapTileGeometry extends PlaneGeometry {
        readonly type = "MapTileGeometry";
        /**
         * 设置地形数据
         * @param data 几何体数据 (IGeometryData) 或 DEM 高度图 (Float32Array)
         * @param skirtHeight 裙边高度 (米), 默认 1000
         * @returns this
         */
        setTerrainData(data: IGeometryData | Float32Array, skirtHeight?: number): this;
        /**
         * 更新 Three.js BufferAttributes
         * @param geoData
         */
        private updateThreeJSAttributes;
    }

    /**
     * 地图工具基类
     *
     * - 管理工具的生命周期（addTo / enable / disable / remove）
     * - 与 Map 的事件系统对接（内部统一注册/注销事件）
     * - 保证同一张地图同时只存在一个激活工具
     */
    export declare abstract class MapTool extends MapTool_base {
        /** 绑定的地图实例 */
        protected _map?: Map_2;
        /** 是否启用中 */
        protected _enabled: boolean;
        /** 缓存绑定到 Map 上的事件处理函数，便于 off 时移除 */
        private _boundHandlers;
        /**
         * @param options 工具配置
         */
        constructor(options?: MapToolOptions);
        /**
         * 将工具添加到地图上，并自动启用。
         * 同一张 Map 上会保证只有一个激活的 MapTool。
         */
        addTo(map: Map_2): this;
        /**
         * 获取当前绑定的地图实例
         */
        getMap(): Map_2 | undefined;
        /**
         * 启用工具：绑定事件 + 调用 onEnable 钩子
         */
        enable(): this;
        /**
         * 禁用工具：解绑事件 + 调用 onDisable 钩子
         */
        disable(): this;
        /**
         * 工具是否处于启用状态
         */
        isEnabled(): boolean;
        /**
         * 从地图上移除工具
         */
        remove(): this;
        /**
         * 子类实现：返回需要绑定到 Map 上的事件映射
         *
         * key: 事件名（如 'click', 'mousemove'）
         * value: 事件处理函数（参数为 Map 的事件数据）
         *
         * 注意：
         * - 不要求提前 bind(this)，MapTool 内部会统一绑定 this
         */
        protected abstract getEvents(): Record<string, (e: any) => void>;
        /**
         * 生命周期钩子：工具刚 addTo(map) 时调用
         */
        protected onAdd?(): void;
        /**
         * 生命周期钩子：工具 enable() 时调用
         */
        protected onEnable?(): void;
        /**
         * 生命周期钩子：工具 disable() 时调用
         */
        protected onDisable?(): void;
        /**
         * 内部：绑定 Map 事件
         */
        private _bindEvents;
        /**
         * 内部：解绑 Map 事件
         */
        private _unbindEvents;
    }

    declare const MapTool_base: {
        new (...args: any[]): {
            eventClass: EventClass;
            on: (type: string, listener: (data?: any) => void) => EventClass;
            fire: (type: string, data?: any) => EventClass;
            off: (type: string, listener: (...args: any[]) => void) => EventClass;
        };
    } & {
        new (...args: any[]): {
            [x: string]: any;
            options: any;
            _isUpdatingOptions?: boolean;
            _initHooksCalled?: boolean;
            _initHooks?: Function[];
            _proxyOptions(): /*elided*/ any;
            _callInitHooks(): /*elided*/ any;
            setOptions(options: ClassOptions): /*elided*/ any;
            configure(conf?: string | ClassOptions, value?: any): ClassOptions | /*elided*/ any;
            onOptionsChange(_conf: ClassOptions): void;
            _visitInitHooks(proto: {
                _initHooks: any;
            }): void;
        };
        mergeOptions(options: ClassOptions): /*elided*/ any & typeof EmptyBase;
        addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & typeof EmptyBase;
        include(...sources: any[]): /*elided*/ any & typeof EmptyBase;
    } & typeof EmptyBase;

    /**
     * MapTool 配置项（预留，将来可以扩展）
     */
    declare type MapToolOptions = ClassOptions & {};

    /**
     * Marker feature class.
     * 标记点要素类
     *
     * @description
     * Represents a marker feature in the 3D scene, inheriting from the Point class.
     * Supports various marker styles:
     * - Basic point style
     * - Icon point style
     * - Icon point style with label
     *
     * 表示3D场景中的标记点要素，继承自Point类
     * 提供多种标记点样式支持：
     * - 基础点样式
     * - 图标点样式
     * - 带标签的图标点样式
     *
     * @extends Point
     * @category Feature
     */
    export declare class Marker extends Point_3 {
        /**
         * Feature type identifier.
         * 要素类型标识
         */
        _type: string;
        /**
         * Create a marker feature instance.
         * 创建标记点要素实例
         *
         * @param options - Marker configuration options. 标记点配置选项
         */
        constructor(options: MarkerOptions);
        /**
         * Convert feature to Three.js geometry.
         * 将要素转换为Three.js几何体
         *
         * @description
         * Creates marker geometry based on style configuration and performs coordinate transformation.
         * 根据样式配置创建标记点几何体，并进行坐标转换
         *
         * @returns Promise<void>
         */
        _buildRenderObject(): Promise<void>;
        /**
         * Quickly update geometry vertex positions (without rebuilding the entire geometry).
         * 快速更新几何体顶点位置（不重建整个几何体）
         *
         * @description
         * Used for real-time interactions like dragging and editing. Updates only Marker position without destroying and rebuilding geometry.
         * This is much faster than full rebuild and keeps the feature visible during dragging.
         *
         * 用于拖拽、编辑等实时交互场景，仅更新Marker的位置而不销毁重建几何体。
         * 这比完整重建快得多，并且能保持feature在拖拽过程中可见。
         */
        protected _refreshCoordinates(): void;
        /**
         * Create marker object.
         * 创建标记点对象
         *
         * @description
         * Supports the following style types:
         * 支持以下样式类型：
         * - 'basic-point': 基础点样式
         * - 'icon-point': 图标点样式
         * - 'icon-label-point': 带标签的图标点样式
         *
         * @param style - 样式配置
         * @returns 创建的标记点对象
         * @throws 如果样式类型不支持会抛出错误
         */
        _createObject(paint: Paint): Promise<Object3D>;
        /**
         * Calculate collision bounding box (different strategies based on type)
         * 计算碰撞检测用的屏幕空间包围盒（根据不同类型使用不同的计算策略）
         *
         * @description
         * Override parent method, use different calculation strategies based on marker type (Sprite, Mesh, etc.)
         * Provides more precise bounding box calculation.
         *
         * 重写父类方法，根据标记点的具体类型（Sprite、Mesh等）使用不同的计算策略
         * 提供更精确的包围盒计算
         *
         * @param camera - Current camera 当前相机
         * @param renderer - Renderer instance 渲染器实例
         * @returns Bounding box info or null (if calculation failed) 包围盒信息或null（如果计算失败）
         */
        _calculateCollisionBoundingBox(camera: Camera, renderer: WebGLRenderer): {
            width: number;
            height: number;
            offsetX: number;
            offsetY: number;
        } | null;
        /**
         * Calculate Sprite screen space bounding box - based on actual display
         * 计算Sprite的屏幕空间包围盒 - 基于实际显示
         *
         * @description
         * Precise bounding box calculation for Sprite type markers,
         * estimating actual screen size based on Sprite scale.
         *
         * 针对Sprite类型的标记点进行精确的包围盒计算，
         * 基于Sprite的缩放比例估算实际屏幕尺寸
         *
         * @param sprite - Sprite object Sprite对象
         * @returns Bounding box info or null (if calculation failed) 包围盒信息或null（如果计算失败）
         * @private
         */
        private _calculateSpriteBoundingBox;
        /**
         * Get fallback simple bounding box
         * 获取备用的简单包围盒
         *
         * @description
         * Returns different default sizes based on style type when precise calculation fails.
         *
         * 当精确计算失败时，根据样式类型返回不同的默认尺寸
         *
         * @returns Default bounding box info 默认包围盒信息
         */
        _getFallbackBoundingBox(): {
            width: number;
            height: number;
            offsetX: number;
            offsetY: number;
        };
    }

    /**
     * Marker feature configuration options.
     * 标记点要素配置选项
     *
     * @extends PointOptions
     * @category Feature
     */
    export declare type MarkerOptions = PointOptions & {};

    /**
     * Label feature configuration options.
     * 标签要素配置选项
     *
     * @extends PointOptions
     * @category Feature
     */
    declare type MarkerOptions_2 = PointOptions & {};

    /**
     * 3D Model feature class.
     * 3D模型要素类
     *
     * @description
     * Represents a model feature in the 3D scene, inheriting from Point class.
     * Provides functionality for model loading, animation control, shadow settings, and special effects.
     * Supports FBX and GLTF 3D model formats.
     *
     * 表示3D场景中的模型要素，继承自Point类
     * 提供模型加载、动画控制、阴影设置和特殊效果等功能
     * 支持FBX和GLTF格式的3D模型
     *
     * @extends Point
     * @category Feature
     */
    export declare class Model extends Point_3 {
        /**
         * Feature type identifier.
         * 要素类型标识
         */
        _type: string;
        /**
         * Emissive state.
         * 自发光状态
         */
        private _emissive;
        /**
         * Emissive intensity.
         * 自发光强度
         */
        private _emissiveIntensity;
        /**
         * Emissive color.
         * 自发光颜色
         */
        private _emissiveColor;
        /**
         * Animation mixer.
         * 动画混合器
         */
        private _mixer;
        /**
         * Current animation action.
         * 当前动画动作
         */
        private _currentAction;
        /**
         * Array of animation clips.
         * 动画剪辑数组
         */
        private _animations;
        /**
         * Animation clock.
         * 动画时钟
         */
        private _clock;
        /**
         * Whether to auto update animation.
         * 是否自动更新动画
         */
        private _autoUpdate;
        /**
         * Animation request ID.
         * 动画请求ID
         */
        private _animationRequestId;
        /**
         * Whether it is a city building model.
         * 是否为城市建筑模型
         */
        private _iscity;
        /**
         * Create a Model feature instance.
         * 创建模型要素实例
         *
         * @param options Model configuration options
         *                模型配置选项
         */
        constructor(options: ModelOptions);
        /**
         * Convert feature to Three.js geometry.
         * 将要素转换为Three.js几何体
         *
         * @returns Promise<void>
         */
        _buildRenderObject(): Promise<void>;
        /**
         * Create model object.
         * 创建模型对象
         *
         * @param style Style configuration
         *              样式配置
         * @returns Created model object
         *          创建的模型对象
         * @throws Throws error if style type is not supported
         *         如果样式类型不支持会抛出错误
         */
        _createObject(paint: Paint): Promise<any>;
        /**
         * Apply emission properties.
         * 应用自发光属性
         *
         * @private
         */
        private _applyEmissionProperties;
        get emissive(): boolean;
        set emissive(value: boolean);
        get emissiveIntensity(): number;
        set emissiveIntensity(value: number);
        get emissiveColor(): string;
        set emissiveColor(value: string);
        /**
         * Set emissive effect.
         * 设置自发光效果
         *
         * @param enabled Whether to enable
         *                是否启用
         * @param intensity Intensity (optional)
         *                  强度(可选)
         * @param color Color (optional)
         *              颜色(可选)
         */
        setEmission(enabled: boolean, intensity?: number, color?: string): void;
        /**
         * Set shadow properties.
         * 设置阴影属性
         *
         * @param options Shadow configuration
         *                阴影配置
         */
        setShadows(options: {
            cast: boolean;
            receive: boolean;
        }): Promise<void>;
        setBloom(enabled: boolean, _options?: {
            intensity?: number;
            color?: string;
        }): this;
        /**
         * Play animation.
         * 播放动画
         *
         * @param params Animation parameters
         *               动画参数
         */
        playAnimation(params: AnimationPlayParams): void;
        /**
         * Stop animation.
         * 停止动画
         *
         * @param params Stop parameters
         *               停止参数
         */
        stopAnimation(params?: {
            fadeDuration?: number;
        }): void;
        /**
         * Set animation paused state.
         * 设置动画暂停状态
         *
         * @param params Pause parameters
         *               暂停参数
         */
        setAnimationPaused(params: AnimationPauseParams): void;
        /**
         * Set animation speed.
         * 设置动画速度
         *
         * @param params Speed parameters
         *               速度参数
         */
        setAnimationSpeed(params: AnimationSpeedParams): void;
        /**
         * Update animation.
         * 更新动画
         *
         * @param params Update parameters
         *               更新参数
         */
        updateAnimation(params: AnimationUpdateParams): void;
        /**
         * Get animation name list.
         * 获取动画名称列表
         *
         * @returns Animation name array
         *          动画名称数组
         */
        getAnimationNames(): string[];
        /**
         * Get current animation name.
         * 获取当前动画名称
         *
         * @returns Current animation name or null
         *          当前动画名称或null
         */
        getCurrentAnimationName(): string | null;
        /**
         * Get animation duration.
         * 获取动画时长
         *
         * @param params Animation parameters
         *               动画参数
         * @returns Animation duration (seconds) or null
         *          动画时长(秒)或null
         */
        getAnimationDuration(params: {
            name: string | number;
        }): number | null;
        /**
         * Dispose resources.
         * 释放资源
         */
        dispose(): void;
        /**
         * Start animation loop.
         * 启动动画循环
         *
         * @private
         */
        private _startAnimationLoop;
        /**
         * Stop animation loop.
         * 停止动画循环
         *
         * @private
         */
        private _stopAnimationLoop;
        /**
         * Set auto update state.
         * 设置自动更新状态
         *
         * @param enabled Whether to enable auto update
         *                是否启用自动更新
         */
        setAutoUpdate(enabled: boolean): void;
        /**
         * Compute polygon vertices in world coordinates (XZ plane) from region overlay configuration.
         * Prioritize using world coordinates (_vertexPoints) from Terra face feature.
         * Fallback to GeoJSON + lngLatToWorld only if no feature is provided.
         *
         * 从区域蒙版配置计算世界坐标系下的多边形顶点（XZ 平面）
         * 优先使用 Terra 面 feature 中已有的世界坐标（_vertexPoints），
         * 如果没有传 feature，才回退到 GeoJSON + lngLatToWorld。
         */
        private _computeOverlayVertices;
        /**
         * Render city effect.
         * 渲染城市效果
         *
         * @private
         */
        private _rendercity;
    }

    /**
     * Model feature configuration options.
     * 模型要素配置选项
     *
     * @extends PointOptions
     * @category Feature
     */
    export declare type ModelOptions = PointOptions & {
        /**
         * Whether to enable emissive effect.
         * 是否启用自发光效果
         */
        emissive?: boolean;
        /**
         * Emissive intensity.
         * 自发光强度
         */
        emissiveIntensity?: number;
        /**
         * Emissive color.
         * 自发光颜色
         */
        emissiveColor?: string;
        /**
         * Whether to cast shadow.
         * 是否投射阴影
         */
        castShadow?: boolean;
        /**
         * Whether to receive shadow.
         * 是否接收阴影
         */
        receiveShadow?: boolean;
        /**
         * Whether it is a city building model.
         * 是否为城市建筑模型
         */
        iscity?: boolean;
    };

    /**
     * Model paint configuration.
     * 模型样式配置
     * @category Paint
     */
    export declare interface ModelPaint extends BasePaint {
        /** Model URL 模型URL */
        url: string;
        /** Model type 模型类型 */
        type: 'model-gltf' | 'model-fbx';
        /** 位置 */
        position?: Vector3;
        /** 缩放 */
        scale?: number | Vector3 | {
            x?: number;
            y?: number;
            z?: number;
        };
        /** 旋转 */
        rotation?: Vector3;
        /** 材质覆盖 */
        materialOverrides?: Record<string, Material>;
        /** 加载管理器 */
        manager?: LoadingManager;
        /** Draco压缩选项 */
        dracoOptions?: {
            /** 是否启用 */
            enable: boolean;
            /** 解码器路径 */
            decoderPath?: string;
        };
        /** 阴影配置 */
        shadows?: {
            /** 是否投射阴影 */
            cast?: boolean;
            /** 是否接收阴影 */
            receive?: boolean;
            /** 阴影质量 */
            quality?: 'low' | 'medium' | 'high';
        };
    }

    /**
     * Multi-line feature class.
     * 多线要素类
     *
     * @description
     * Represents a multi-line feature in the 3D scene, inheriting from the Line class.
     * Supports display of multiple line segments, each manageable independently.
     *
     * 表示3D场景中的多线要素，继承自Line类
     * 支持多条线段的组合显示，每条线段可独立管理
     *
     * @extends Line
     * @category Feature
     */
    export declare class MultiLineString extends Line {
        /**
         * Feature type identifier.
         * 要素类型标识
         */
        _type: string;
        /**
         * Array storing all line objects.
         * 存储所有线对象的数组
         */
        private _lineObjects;
        /**
         * Container group containing all line objects.
         * 包含所有线对象的容器组
         */
        private _linesContainer;
        /**
         * Create a MultiLineString feature instance.
         * 创建多线要素实例
         *
         * @param options Multi-line configuration options
         *                多线配置选项
         */
        constructor(options: MultiLineStringOptions);
        /**
         * Convert feature to Three.js geometry.
         * 将要素转换为Three.js几何体
         *
         * @returns Promise<void>
         *
         * @description
         * Create separate geometry for each line segment and add to container.
         * 为每条线段创建单独的几何体，并添加到容器中
         */
        _buildRenderObject(): Promise<void>;
        /**
         * Create a single line object.
         * 创建单条线对象
         *
         * @param style Style configuration
         *              样式配置
         * @param vertexPoints Vertex coordinates array
         *                     顶点坐标数组
         * @returns Created line object
         *          创建的线对象
         * @throws Throws error if style type is not supported
         *         如果样式类型不支持会抛出错误
         *
         * @private
         */
        private _createLineObject;
        /**
         * Coordinate transformation method.
         * 坐标转换方法
         *
         * @returns Transformed coordinate information
         *          转换后的坐标信息
         *
         * @description
         * Convert geographic coordinates to world coordinates and calculate coordinates relative to map center.
         * 将地理坐标转换为世界坐标，并计算相对于地图中心的坐标
         */
        _coordsTransform(): any;
        /**
         * Update container status.
         * 更新容器状态
         *
         * @private
         * @description
         * Update matrix and boundary information of the container group.
         * 更新容器组的矩阵和边界信息
         */
        private _updateContainer;
        /**
         * Clear all line objects.
         * 清除所有线对象
         *
         * @private
         * @description
         * Remove and dispose resources of all line objects.
         * 移除并释放所有线对象的资源
         */
        private clearLines;
        /**
         * Update geometry.
         * 更新几何体
         *
         * @description
         * For multi-line features, simply recreating all lines is easier.
         * 对于多线要素，直接重新创建所有线更简单
         */
        protected _refreshCoordinates(): void;
        /**
         * Dispose object resources.
         * 释放对象资源
         *
         * @description
         * Clean up resources used by multi-line feature.
         * 清理多线要素使用的资源
         */
        _disposeObject(): void;
    }

    /**
     * Multi-line feature configuration options.
     * 多线要素配置选项
     *
     * @extends LineOptions
     * @category Feature
     */
    export declare type MultiLineStringOptions = LineOptions & {};

    /**
     * MVTGeo数据源类
     * @description 提供MVTGeo在线矢量数据
     * @extends TileSource
     */
    export declare class MVTGeoSource extends TileSource {
        /**
         * 数据类型标识
         * @default "mvtgeo"
         */
        dataType: string;
        /**
         * 数据源版权信息
         * @default "ArcGIS"
         */
        attribution: string;
        /**
         * 最小层级
         * @default 6
         */
        minLevel: number;
        /**
         * 最大层级
         * @default 13
         */
        maxLevel: number;
        /**
         * 瓦片URL模板
         * @default "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}"
         */
        url: string;
        /**
         * 构造函数
         * @param options 配置选项
         */
        constructor(options?: SourceOptions);
    }

    /**
     */
    export declare class MVTSource extends TileSource {
        dataType: string;
        paint: VectorPaints;
        constructor(options: MVTSourceOptions);
    }

    /**
     */
    export declare type MVTSourceOptions = SourceOptions & {
        paint?: VectorPaints;
    };

    /**
     * Base class for Layers, managing features.
     * Layer的基类，管理features
     * @abstract
     * @template T Feature type inheriting from Feature. 继承自Feature的要素类型
     * @category Layer
     */
    declare abstract class OverlayLayer<T extends Feature = Feature> extends Layer {
        private _feaList;
        _collision: boolean;
        constructor(id: string, options?: OverlayLayerOptions<T>);
        /**
         * Validation logic to be implemented by subclasses (Abstract method).
         * 子类必须实现的校验逻辑（抽象方法）
         * @param feature Feature to validate.
         *                待校验的 Feature
         * @returns Whether valid.
         *          是否合法
         */
        protected abstract validateFeature(feature: T): boolean;
        /**
         * Add Feature(s) to the layer.
         * 添加Feature到图层
         * @param features Feature instance or array of instances to add.
         *                 要添加的Feature实例或实例数组
         * @returns this
         */
        addFeature(features: T | T[]): this;
        /**
         * Get all Features.
         * 获取所有的Features
         * @param filter Filter function.
         *               过滤函数
         * @param context Filter function context.
         *                过滤函数上下文
         * @returns Filtered Feature array.
         *          过滤后的Feature数组
         */
        getFeatures(filter?: (feature: Feature) => boolean, context?: any): Array<Feature>;
        /**
         * Get number of features.
         * 获取features个数
         * @return Feature count.
         *         features数量
         */
        getCount(): number;
        /**
         * Check if layer is empty.
         * layer是否为空
         * @return Whether empty.
         *         是否为空
         */
        isEmpty(): boolean;
        /**
         * Remove one or more features.
         * 移除一个或多个features
         * @param features Feature(s) to remove.
         *                 要移除的feature或数组
         * @returns this
         */
        removeFeature(features: Feature | Feature[]): any;
        /**
         * Clear all features in the layer.
         * 清空图层中的所有要素
         * @returns this
         */
        clear(): this;
        /**
         * Handler when removing a feature.
         * 移除feature时的处理
         * @param feature Feature to remove.
         *                要移除的feature
         */
        onRemoveFeature(feature: T): void;
        /* Excluded from this release type: _findInList */
        /**
         * Dispose feature resources recursively.
         * 递归释放要素资源
         *
         * @private
         */
        private _disposeFeatureResources;
        /**
         * Merge geometries (TODO).
         * 几何体合并 (待办)
         */
        _mergedGeometry(): void;
        /**
         * Set collision engine (Pluggable design).
         * 设置避让系统（可插拔设计）
         *
         * @param engine Collision engine instance. 避让引擎实例。
         */
        setCollisionEngine(engine: CollisionEngine): this;
    }

    /**
     * Overlay layer configuration options.
     * 覆盖图层配置选项
     * @template T Feature type inheriting from Feature. 继承自Feature的要素类型
     * @category Layer
     */
    declare type OverlayLayerOptions<T extends Feature> = LayerOptions & {
        /**
         * Initial features.
         * 初始要素
         */
        features?: T[];
        /**
         * Merge geometries toggle.
         * 合并几何体开关
         */
        merge?: boolean;
        /**
         * Collision detection toggle.
         * 碰撞检测开关
         */
        collision?: boolean;
    };

    /**
     * Paint class.
     * @description Manages and applies various 3D object paints/styles
     * @category Paint
     */
    export declare class Paint {
        config: PaintConfig;
        /** Texture cache */
        private static _textureCache;
        /** Texture loader */
        private static _textureLoader;
        /**
         * Constructor
         * @param config Paint configuration
         */
        constructor(config: PaintConfig);
        /**
         * 应用样式到3D对象
         * @param object 目标3D对象
         * @returns 是否应用成功
         */
        applyTo(object: Object3D): Promise<boolean>;
        /**
         * Apply point paint
         * @param object Target object
         * @returns Success status
         */
        private _applyPointPaint;
        /**
         * Apply icon paint
         * @param object Target object
         * @param config Paint configuration
         */
        private _applyIconPaint;
        /**
         * Apply circle paint
         * @param object Target object
         * @param config Paint configuration
         */
        private _applyCirclePaint;
        /**
         * Apply symbol paint
         * @param object Target object
         * @param config Paint configuration
         */
        private _applySymbolPaint;
        /**
         * Apply line paint
         * @param object Target object
         * @returns Success status
         */
        private _applyLinePaint;
        /**
         * Apply flow tube paint
         * @param object Target object
         * @returns Success status
         */
        private _applyFlowTubePaint;
        /**
         * Apply arrow paint
         * @param object Target object
         * @returns Success status
         */
        private _applyArrowPaint;
        /**
         * Apply flow texture paint
         * @param object Target object
         * @returns Success status
         */
        private _applyFlowTexturePaint;
        /**
         * Apply fill paint
         * @param object Target object
         * @returns Success status
         */
        private _applyFillPaint;
        /**
         * Apply extrusion paint
         * @param object Target object
         * @returns Success status
         */
        private _applyExtrusionPaint;
        /**
         * Apply water paint
         * @param object Target object
         * @returns Success status
         */
        private _applyWaterPaint;
        /**
         * Apply cloud paint
         * @param object Target object
         * @returns Success status
         */
        private _applyCloudPaint;
        /**
         * Apply text paint
         * @param object Target object
         * @returns Success status
         */
        private _applyTextPaint;
        /**
         * Apply light paint
         * @param object Target object
         * @returns Success status
         */
        private _applyLightPaint;
        /**
         * Apply model paint
         * @param object Target object
         * @returns Success status
         */
        private _applyModelPaint;
        /**
         * Apply custom paint
         * @param object Target object
         * @returns Success status
         */
        private _applyCustomPaint;
        /**
         * Load texture
         * @param url Texture URL
         * @returns Texture object
         */
        static _loadTexture(url: string): Promise<Texture>;
        /**
         * Create paint instance
         * @param input Paint input
         * @returns Paint instance
         */
        static create(input: PaintInput): Paint;
    }

    /**
     * Paint configuration union type.
     * 样式配置联合类型
     * @category Paint
     */
    export declare type PaintConfig = PointPaintUnion | LinePaintUnion | FillPaintUnion | CloudPaint | CustomPaint;

    /**
     * Paint input type.
     * 样式输入类型
     * @category Paint
     */
    export declare type PaintInput = PaintConfig | Paint;

    /**
     * Paint rule interface (Simplified)
     * 样式规则接口 (简化版)
     * @description Defines a paint rule that will be applied via an external Feature Filter mechanism.
     * 定义一个样式规则，它将通过外部的 Feature Filter 机制来应用。
     * @category Paint
     */
    declare interface PaintRule {
        /**
         * Filter condition expression (Placeholder)
         * 过滤条件表达式（Placeholder）
         * This is a placeholder to represent a future feature-filter expression or rule ID.
         * 这是一个占位符，用于表示您将来要引入的 feature-filter 表达式或规则ID。
         * e.g., ['==', 'class', 'highway'] or 'highway-z10-14'
         * 例如: ['==', 'class', 'highway'] 或 'highway-z10-14'
         */
        filter: any;
        /** Paint configuration */
        paint: PaintConfig;
    }

    export declare type PaintType = {
        layer: VectorPaint[];
    };

    /**
     * 点类型
     */
    export declare type Point = {
        x: number;
        y: number;
    };

    /**
     * Point feature abstract base class.
     * 点要素抽象基类
     *
     * @description
     * Represents a point feature in the 3D scene, inheriting from the Feature class.
     * Provides basic functionality for point features, including:
     * - Coordinate transformation
     * - Point geometry creation
     *
     * 表示3D场景中的点要素，继承自Feature类
     * 提供点要素的基础功能，包括：
     * - 坐标转换
     * - 点几何体创建
     *
     * @abstract
     * @extends Feature
     * @category Feature
     */
    declare abstract class Point_3 extends Feature {
        /**
         * Base type identifier.
         * 基础类型标识
         */
        readonly _baseType = "Point";
        /**
         * Specific point type identifier (implemented by subclasses).
         * 具体点类型标识（由子类实现）
         */
        abstract _type: string;
        /**
         * Create a Point feature instance.
         * 创建点要素实例
         *
         * @param options Point feature configuration
         *                点要素配置
         */
        constructor(options: PointOptions);
        /**
         * Coordinate transformation method.
         * 坐标转换方法
         *
         * @returns Transformed world coordinates
         *          转换后的世界坐标
         *
         * @description
         * Converts geographic coordinates to world coordinates.
         *
         * 将地理坐标转换为世界坐标
         */
        _coordsTransform(): Vector3;
        /**
         * Convert feature to Three.js geometry (abstract method).
         * 将要素转换为Three.js几何体（抽象方法）
         *
         * @abstract
         */
        _buildRenderObject(): Promise<void>;
        protected _refreshCoordinates(): void;
        /**
         * Create basic point geometry.
         * 创建基础点几何体
         *
         * @returns Points instance
         *          Points实例
         *
         * @protected
         * @description
         * Creates point geometry with default material. Subclasses can extend or override this method.
         *
         * 创建带有默认材质的点几何体，子类可扩展或重写此方法
         */
        protected _createRenderObject(): Points<BufferGeometry<NormalBufferAttributes, BufferGeometryEventMap>, PointsMaterial, Object3DEventMap>;
    }

    /**
     * Point Feature Layer class.
     * 点要素图层类
     * @description
     * Specialized layer for managing Point features.
     * 用于管理点要素的专用图层。
     * @extends OverlayLayer<Point>
     * @category Layer
     */
    export declare class PointLayer extends OverlayLayer<Point_3> {
        /**
         * Constructor.
         * 构造函数
         * @param id Layer ID.
         *           图层ID
         * @param options Layer configuration options.
         *                图层配置选项
         */
        constructor(id: string, options?: PointLayerOptions);
        /**
         * Validate if feature belongs to this layer.
         * 验证要素是否属于此图层
         * @param feature Point feature to validate.
         *                要验证的点要素
         * @returns Whether it is a valid Point feature.
         *          是否为合法的点要素
         * @override
         */
        protected validateFeature(feature: Point_3): boolean;
    }

    /**
     * Point Layer configuration options.
     * 点图层配置选项
     * @extends OverlayLayerOptions<Point>
     * @category Layer
     */
    export declare type PointLayerOptions = OverlayLayerOptions<Point_3> & {};

    /**
     * Point feature configuration options.
     * 点要素配置选项
     *
     * @extends FeatureOptions
     * @category Feature
     */
    declare type PointOptions = FeatureOptions & {
        /**
         * GeoJSON point geometry data.
         * GeoJSON点几何数据
         */
        geometry?: Point_2 | MultiPoint;
    };

    /**
     * Point paint union type.
     * 点样式联合类型
     * @category Paint
     */
    export declare type PointPaintUnion = CirclePaint | IconPaint | SymbolPaint | LightPaint | ModelPaint | TextPaint;

    /**
     * Polygon feature class.
     * 多边形要素类
     *
     * @description
     * Represents a polygon feature in the 3D scene, inheriting from the Surface class.
     * Supports various polygon styles:
     * - Basic polygon
     * - Extruded polygon
     * - Water surface effect
     * - Basic water surface effect
     *
     * 表示3D场景中的多边形要素，继承自Surface类
     * 提供多种多边形样式支持：
     * - 基础多边形
     * - 挤出多边形
     * - 水面效果
     * - 基础水面效果
     *
     * @extends Surface
     * @category Feature
     */
    export declare class Polygon extends Surface {
        /**
         * Feature type identifier.
         * 要素类型标识
         */
        _type: string;
        /**
         * Create a Polygon feature instance.
         * 创建多边形要素实例
         *
         * @param options Polygon configuration
         *                多边形配置
         */
        constructor(options: PolygonOptions);
        /**
         * Convert feature to Three.js geometry.
         * 将要素转换为Three.js几何体
         *
         * @returns Promise<void>
         *
         * @description
         * Creates polygon geometry based on style configuration and performs coordinate transformation.
         *
         * 根据样式配置创建多边形几何体，并进行坐标转换
         */
        _buildRenderObject(): Promise<void>;
        /**
         * Quickly update geometry vertex positions (without rebuilding the entire geometry).
         * 快速更新几何体顶点位置（不重建整个几何体）
         *
         * @description
         * Used for real-time interactions like dragging and editing.
         * For basic-polygon type, implements quick update to avoid rebuild;
         * For complex types (extrude/water), still calls full rebuild.
         *
         * 用于拖拽、编辑等实时交互场景。
         * 对于basic-polygon类型，实现快速更新避免重建；
         * 对于复杂类型（extrude/water），仍然调用完整重建。
         */
        protected _refreshCoordinates(): void;
        /**
         * Create polygon object.
         * 创建多边形对象
         *
         * @param style Style configuration
         *              样式配置
         * @returns Created polygon object
         *          创建的多边形对象
         * @throws Throws error if style type is not supported
         *         如果样式类型不支持会抛出错误
         *
         * @description
         * Supported style types:
         * - 'basic-polygon': Basic polygon
         * - 'extrude-polygon': Extruded polygon
         * - 'water': Water surface effect
         * - 'base-water': Basic water surface effect
         *
         * 支持以下样式类型：
         * - 'basic-polygon': 基础多边形
         * - 'extrude-polygon': 挤出多边形
         * - 'water': 水面效果
         * - 'base-water': 基础水面效果
         */
        _createObject(paint: Paint): Promise<Object3D>;
        /**
         * Calculate collision bounding box.
         * 计算碰撞检测包围盒
         *
         * @returns Collision bounding box
         *          碰撞检测包围盒
         */
        _calculateCollisionBoundingBox(): any | null;
    }

    /**
     * Polygon Feature Layer class.
     * 多边形要素图层类
     * @description
     * Specialized layer for managing Polygon features.
     * 用于管理多边形要素的专用图层。
     * @extends OverlayLayer<Polygon>
     * @category Layer
     */
    export declare class PolygonLayer extends OverlayLayer<Polygon> {
        /**
         * Constructor.
         * 构造函数
         * @param id Layer unique identifier.
         *           图层唯一标识符
         * @param options Polygon layer configuration options.
         *                多边形图层配置选项
         */
        constructor(id: string, options?: PolygonLayerOptions);
        /**
         * Validate if feature belongs to this layer.
         * 验证要素是否属于此图层
         * @param feature Polygon feature to validate.
         *                要验证的多边形要素
         * @returns Whether it is a valid Polygon feature.
         *          是否为合法的多边形要素
         * @override
         * @description
         * Check if feature base type is 'Surface'.
         * 检查要素的基础类型是否为'Surface'。
         */
        protected validateFeature(feature: Polygon): boolean;
    }

    /**
     * Polygon Layer configuration options.
     * 多边形图层配置选项
     * @extends OverlayLayerOptions<Polygon>
     * @description
     * Extends basic layer options, can add Polygon specific configurations.
     * 扩展基础图层选项，可添加多边形特有的配置项。
     * @category Layer
     */
    export declare type PolygonLayerOptions = OverlayLayerOptions<Polygon> & {};

    /**
     * Polygon feature configuration options.
     * 多边形要素配置选项
     *
     * @extends SurfaceOptions
     * @category Feature
     */
    export declare type PolygonOptions = SurfaceOptions & {
        /**
         * GeoJSON polygon geometry data.
         * GeoJSON多边形几何数据
         */
        geometry?: Polygon_2 | MultiPolygon;
    };

    /**
     * 投影工厂类
     * @class ProjectionFactory
     */
    export declare class ProjectionFactory {
        /**
         * 创建投影实例
         * @param type 投影类型 ID ("3857" | "4326")
         * @param centralMeridian 中央经线，默认为 0
         * @returns MapProjection 实例
         * @throws Error 如果投影类型不支持
         */
        static create(type?: ProjectionType_2, centralMeridian?: number): MapProjection;
    }

    /** pointToLngLat ID */
    export declare type ProjectionType = "3857" | "4326";

    /**
     * 投影类型定义
     * @description 目前支持 Web墨卡托 (3857) 和 WGS84 (4326)
     */
    declare type ProjectionType_2 = "3857" | "4326";

    /**
     * Raster Tile Layer.
     * 栅格瓦片图层
     *
     * @description
     * General purpose layer for displaying raster imagery.
     * It uses a TileLoader to fetch and display image tiles based on the camera position and zoom level.
     *
     * 用于显示影像数据的通用图层。
     * 它使用 TileLoader 根据相机位置和缩放级别获取并显示图像瓦片。
     * @category Layer
     */
    declare class RasterTileLayer extends BaseTileLayer {
        /**
         * Layer type identifier.
         * 图层类型标识符。
         * @readonly
         */
        readonly layerType: string;
        /**
         * Create a new RasterTileLayer instance.
         * 创建一个新的 RasterTileLayer 实例。
         *
         * @param id Unique layer identifier. 图层唯一标识符。
         * @param options Layer configuration options. 图层配置选项。
         */
        constructor(id: string, options: RasterTileLayerOptions);
        /**
         * Create the tile loader for this layer.
         * 创建此图层的瓦片加载器。
         *
         * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
         * @protected
         */
        protected createLoader(): ICompositeLoader;
    }
    export { RasterTileLayer }
    export { RasterTileLayer as TileLayer }

    /**
     * Raster Tile Layer configuration interface.
     * 栅格瓦片图层配置接口
     *
     * @description
     * Configuration options for creating a RasterTileLayer.
     * 用于创建 RasterTileLayer 的配置选项。
     * @category Layer
     */
    declare interface RasterTileLayerOptions extends BaseTileLayerOptions {
    }
    export { RasterTileLayerOptions }
    export { RasterTileLayerOptions as TileLayerOptions }

    /**
     * @category Layer
     */
    declare interface RegionOverlayConfig {
        /**
         * Region overlay ID.
         * Optional, used for subsequent deletion/update.
         * 区域蒙版 ID。
         * 可选，用于后续删除/更新。
         */
        id?: string;
        /**
         * Region geometry (Pass GeoJSON directly).
         * 区域面几何（直接传 GeoJSON）
         */
        geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon;
        /**
         * Region feature (Pass Terra's Polygon/Surface Feature).
         * NOTE: To avoid circular dependencies, type is not strictly constrained here, use any.
         * 区域面要素（直接传 Terra 的 Polygon/Surface Feature）
         * NOTE: 为避免循环依赖，这里不强行约束类型，用 any。
         */
        feature?: any;
        /**
         * Overlay color (used in 'overlay' mode), default '#00FF88'.
         * overlay 模式用，默认 '#00FF88'
         */
        color?: string;
        /**
         * Opacity (used in 'overlay' mode), default 0.3.
         * overlay 模式用，默认 0.3
         */
        opacity?: number;
        /**
         * Overlay mode ('overlay' | 'clip'), default 'overlay'.
         * 'overlay' | 'clip'，默认 'overlay'
         */
        mode?: RegionOverlayMode;
        /**
         * Priority when multiple overlays overlap (Higher value means higher priority).
         * 多个重叠 overlay 时的优先级（数值越大优先级越高）
         */
        zIndex?: number;
    }

    /**
     * @category Layer
     */
    declare type RegionOverlayMode = 'overlay' | 'clip';

    /**
     * Register default loaders to TileLoaderFactory.
     * 注册默认加载器到 TileLoaderFactory
     */
    export declare function registerDefaultLoaders(): void;

    /**
     * Three.js scene initialization class
     * Three.js场景初始化类
     * @extends EventDispatcher<SceneRendererEventMap>
     * @category SceneRenderer
     */
    export declare class SceneRenderer extends SceneRendererBase {
        /** Scene object 场景对象 */
        readonly scene: Scene;
        /** WebGL renderer WebGL渲染器 */
        readonly renderer: WebGLRenderer;
        /** Perspective camera 透视相机 */
        readonly camera: PerspectiveCamera;
        /** Map controls 地图控制器 */
        readonly controls: MapControls;
        /** Ambient light 环境光 */
        readonly ambLight: AmbientLight;
        /** Directional light 平行光 */
        readonly dirLight: DirectionalLight;
        /** 辅助平行光 (补光) */
        /** 云层效果 */
        clouds: Clouds | null;
        /** 容器元素 */
        container?: HTMLElement;
        /** 内部时钟 */
        private readonly _clock;
        /** 性能统计器 */
        private stats;
        /** 动画回调集合 */
        private _animationCallbacks;
        /** 雾效因子 */
        private _fogFactor;
        private _sceneSize;
        /** 地面网格 */
        private _defaultGround;
        /** 地图实例 */
        map: Map_2;
        centerWorldPos: Vector3;
        private _isInteracting;
        /** 是否启用调试模式 */
        private debug;
        private flyTween;
        /** 后期处理：bloom 管线 */
        private composer?;
        private renderPass?;
        private bloomPass?;
        /**
         * 获取雾效因子
         */
        get fogFactor(): number;
        get isInteracting(): boolean;
        /**
         * 设置雾效因子（默认1）
         */
        set fogFactor(value: number);
        /**
         * 获取容器宽度
         */
        get width(): number;
        /**
         * 获取容器高度
         */
        get height(): number;
        /**
         * 构造函数
         * @param container 容器元素或选择器字符串
         * @param options 配置选项
         */
        constructor(container?: HTMLElement | string, options?: SceneRendererOptions);
        /**
         * Add renderer to container
         * 将渲染器添加到容器
         * @param container Container element or selector string 容器元素或选择器字符串
         * @returns this
         */
        addTo(container: HTMLElement | string): this;
        /**
         * Create scene
         * 创建场景
         * @param skyboxConfig Skybox configuration 天空盒配置
         * @returns Scene object 场景对象
         */
        private _createScene;
        /**
         * 使用PMREM加载HDR环境贴图
         * @param scene 场景对象
         * @param skyboxConfig 天空盒配置
         */
        private _loadHDRWithPMREM;
        /**
         * 创建WebGL渲染器
         * @param antialias 是否抗锯齿
         * @param stencil 是否使用模板缓冲区
         * @param logarithmicDepthBuffer 是否使用对数深度缓冲区
         * @returns 渲染器对象
         */
        private _createRenderer;
        /**
         * Create camera
         * 创建相机
         * @returns Camera object 相机对象
         */
        private _createCamera;
        /**
         * Create map controls
         * 创建地图控制器
         * @param minDistance Minimum zoom distance 最小缩放距离
         * @param maxDistance Maximum zoom distance 最大缩放距离
         * @returns Controls object 控制器对象
         */
        private _createControls;
        /**
         * Create ambient light
         * 创建环境光
         * @returns Ambient light object 环境光对象
         */
        private _createAmbLight;
        /**
         * 创建平行光
         * @returns 平行光对象
         */
        private _createDirLight;
        /* Excluded from this release type: _createAuxDirLight */
        /**
         * Create a single auxiliary directional light instance.
         * 创建单个辅助平行光实例。
         * @param x Light source world X coordinate 光源的世界X坐标
         * @param y Light source world Y coordinate 光源的世界Y坐标
         * @param z Light source world Z coordinate 光源的世界Z坐标
         * @param intensity Light intensity 光源强度
         * @returns DirectionalLight
         */
        private _createAuxLightInstance;
        /**
         * Resize container
         * 调整容器大小
         * @returns this
         */
        resize(): this;
        /**
         * 添加动画回调
         * @param callback 回调函数，接收deltaTime和elapsedTime参数
         * @returns 移除回调的函数
         */
        addAnimationCallback(callback: (delta: number, elapsedtime: number, context: SceneRenderer) => void): () => void;
        /**
         * 动画循环
         */
        private animate;
        /**
         * Fly to specified position
         * 飞行到指定位置
         * @param centerWorldPos Map center target position (world coordinates) 地图中心目标位置（世界坐标）
         * @param cameraWorldPos Camera target position (world coordinates) 相机目标位置（世界坐标）
         * @param animate Whether to enable animation 是否启用动画
         * @param onComplete Completion callback 完成回调
         */
        flyTo(centerWorldPos: Vector3, cameraWorldPos: Vector3, animate?: boolean, onComplete?: (obj: Vector3) => void): void;
        /**
         * Advanced fly to specified position method
         * 高级飞行到指定位置的方法
         *
         * Supports both straight and curved flight paths, allowing customization of flight duration, delay, and completion callback.
         * Achieves smooth camera movement and view transition via Tween animation.
         * 支持直线和曲线两种飞行路径，可以自定义飞行持续时间、延迟和完成回调。
         * 通过Tween动画实现平滑的相机移动和视角过渡。
         *
         * @param options - Flight configuration options 飞行配置选项
         * @param options.center - Target center point longitude and latitude coordinates 目标中心点的经纬度坐标
         * @param options.cameraCoord - Camera target position longitude and latitude coordinates 相机目标位置的经纬度坐标
         * @param options.duration - Flight animation duration (ms), default 2000ms 飞行动画持续时间（毫秒），默认2000ms
         * @param options.delay - Delay before flight starts (ms), default 0ms 开始飞行前的延迟时间（毫秒），默认0ms
         * @param options.complete - Callback function when flight completes 飞行完成时的回调函数
         * @param options.curvePath - Whether to use curved flight path, true for cubic Bezier curve, false for straight line (default) 是否使用曲线路径飞行，true为三次贝塞尔曲线，false为直线（默认）
         *
         *
         * @remarks
         * - If there is an ongoing flight animation, it will be stopped automatically
         * - Camera position, view, and target point will be updated during flight
         * - Curved path uses cubic Bezier curve, control points are automatically generated
         * - Longitude and latitude coordinates will be automatically converted to world coordinates
         * - 如果之前有正在进行的飞行动画，会自动停止
         * - 飞行过程中会更新相机位置、视角和目标点
         * - 曲线路径使用三次贝塞尔曲线，控制点自动生成
         * - 经纬度坐标会自动转换为世界坐标
         *
         * @throws Returns silently when center or cameraCoord parameters are invalid, no exception thrown 当center或cameraCoord参数无效时静默返回，不抛出异常
         */
        flyToAdvanced(options: FlyToOptions): void;
        /**
         * Options change callback.
         * 配置更新回调
         * Triggered when sceneRenderer.configure() is called to update options.
         * 当调用 sceneRenderer.configure() 更新配置时，会触发此方法
         */
        onOptionsChange(conf: SceneRendererOptions): void;
        /**
         * 飞行到指定点，自动计算相机位置
         * @param center 目标点的经纬度坐标
         * @param options 飞行选项
         */
        easeTo(options: EaseToOptions): void;
        /**
         * Calculate camera position in world coordinates.
         * 计算相机在世界坐标系中的位置
         * @param target Target point (world coordinates) 目标点（世界坐标）
         * @param distance Distance from camera to target 相机到目标的距离
         * @param pitchRad Pitch angle in radians (0=top-down, Math.PI/2=horizontal) 俯仰角（弧度）
         * @param bearingRad Bearing angle in radians 方位角（弧度）
         * @returns Camera position (world coordinates) 相机位置（世界坐标）
         */
        calculateCameraPosition: (target: Vector3, distance: number, pitchRad: number, bearingRad: number) => Vector3;
        /**
         * Get current scene state
         * 获取当前场景状态
         * @returns Object containing center position and camera position 包含中心位置和相机位置的对象
         */
        getState(): {
            centerPosition: Vector3;
            cameraPosition: Vector3;
        };
        /**
         * Bind map instance
         * 绑定地图实例
         * @param map Map instance 地图实例
         *
         * @protected
         */
        _bindMap(map: Map_2): void;
        /**
         * Get associated map instance
         * 获取关联的地图实例
         * @returns Map instance or null 地图实例或null
         */
        getMap(): Map_2 | null;
        /**
         * Get current browser window aspect ratio.
         * 获取当前浏览器窗口的宽高比（aspect ratio）。
         * @returns {number} Aspect ratio (width / height), e.g., returns ~1.777 for 16:9 screen. 宽高比（width / height），例如 16:9 的屏幕返回 ~1.777。
         */
        getAspect(): number;
        /**
         * 获取当前浏览器窗口的实际宽度和高度（视口尺寸）。
         * @returns {Array<number>} 包含宽度和高度的数组 [width, height]，单位是像素。
         */
        getWidthHeight(): number[];
        /* Excluded from this release type: _createDefaultGround */
        /**
         * Show the default ground plane.
         * 显示默认地面平面
         *
         * @description
         * Makes the default ground plane visible. This is typically called automatically
         * when no tile layers are present in the map.
         * 使默认地面平面可见。通常在地图中没有瓦片图层时自动调用。
         */
        showDefaultGround(): void;
        /* Excluded from this release type: _updateDefaultGroundPosition */
        /**
         * Hide the default ground plane.
         * 隐藏默认地面平面
         *
         * @description
         * Hides the default ground plane. This is typically called automatically
         * when tile layers are added to the map.
         * 隐藏默认地面平面。通常在向地图添加瓦片图层时自动调用。
         */
        hideDefaultGround(): void;
        /**
         * Check if the default ground plane is visible.
         * 检查默认地面平面是否可见
         *
         * @returns Whether the ground is visible. 地面是否可见
         */
        isDefaultGroundVisible(): boolean;
        /**
         * Set the default ground plane visibility.
         * 设置默认地面平面可见性
         *
         * @param visible Whether the ground is visible. 地面是否可见
         */
        setDefaultGroundVisible(visible: boolean): void;
        /**
         * Set the default ground plane style.
         * 设置默认地面平面样式
         *
         * @param style Style properties. 样式属性
         */
        setDefaultGroundStyle(style: {
            color?: string | number;
            opacity?: number;
        }): void;
        /**
         * 销毁sceneRenderer实例，释放所有资源
         * @description
         * 该方法会清理以下资源：
         * 1. 停止动画循环
         * 2. 销毁控制器
         * 3. 清理场景中的所有对象
         * 4. 销毁渲染器
         * 5. 销毁后期处理器
         * 6. 移除DOM元素
         */
        destroy(): void;
        /**
         * Dispose material resources
         * 销毁材质资源
         * @param material Material to dispose 要销毁的材质
         */
        private _disposeMaterial;
    }

    declare const SceneRendererBase: {
        new (...args: any[]): {
            eventClass: EventClass;
            on: (type: string, listener: (data?: any) => void) => EventClass;
            fire: (type: string, data?: any) => EventClass;
            off: (type: string, listener: (...args: any[]) => void) => EventClass;
        };
    } & {
        new (...args: any[]): {
            [x: string]: any;
            options: any;
            _isUpdatingOptions?: boolean;
            _initHooksCalled?: boolean;
            _initHooks?: Function[];
            _proxyOptions(): /*elided*/ any;
            _callInitHooks(): /*elided*/ any;
            setOptions(options: ClassOptions): /*elided*/ any;
            configure(conf?: string | ClassOptions, value?: any): /*elided*/ any | ClassOptions;
            onOptionsChange(_conf: ClassOptions): void;
            _visitInitHooks(proto: {
                _initHooks: any;
            }): void;
        };
        mergeOptions(options: ClassOptions): /*elided*/ any & {
            new (): EventDispatcher<SceneRendererEventMap>;
        };
        addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & {
            new (): EventDispatcher<SceneRendererEventMap>;
        };
        include(...sources: any[]): /*elided*/ any & {
            new (): EventDispatcher<SceneRendererEventMap>;
        };
    } & {
        new (): EventDispatcher<SceneRendererEventMap>;
    };

    /**
     * SceneRenderer event mapping interface
     * SceneRenderer事件映射接口
     * @extends Object3DEventMap
     * @category SceneRenderer
     */
    export declare interface SceneRendererEventMap extends Object3DEventMap {
        /** Update event, including time delta 更新事件，包含时间增量 */
        update: BaseEvent & {
            delta: number;
        };
    }

    /**
     * SceneRenderer configuration options
     * SceneRenderer配置选项
     * @category SceneRenderer
     */
    export declare type SceneRendererOptions = {
        /** Whether to enable antialiasing, default is false 是否启用抗锯齿，默认为false */
        antialias?: boolean;
        /** Whether to use stencil buffer, default is true 是否使用模板缓冲区，默认为true */
        stencil?: boolean;
        /** Whether to use logarithmic depth buffer, default is true 是否使用对数深度缓冲区，默认为true */
        logarithmicDepthBuffer?: boolean;
        /** Whether panning is draggable, default is true 是否可拖拽平移，默认为 true */
        draggable?: boolean;
        /** Skybox configuration 天空盒配置 */
        skybox?: {
            /** Skybox image path 天空盒图片路径 */
            path?: string;
            /** HDR file path HDR文件路径 */
            hdr?: string;
            /**
             * Skybox image filenames array, order: [px, nx, py, ny, pz, nz]
             * 天空盒图片文件名数组，顺序为：[右,左,上,下,前,后]
             */
            files?: string[];
            /** Default skybox color (used when loading fails) 天空盒默认颜色（当加载失败时使用） */
            defaultColor?: number;
            /** Whether HDR is equirectangular, true for equirectangular, false for cubemap HDR是否为等距柱状投影，true为等距柱状，false为立方体贴图 */
            hdrEquirectangular?: boolean;
            /** HDR exposure value HDR曝光值 */
            hdrExposure?: number;
            /** HDR encoding HDR编码方式 */
            hdrEncoding?: number;
        };
        /** Whether to enable debug mode 是否启用调试模式 */
        debug?: boolean;
        /** Map instance 地图实例 */
        map?: Map_2;
        /**
         * Camera bearing angle (in degrees)
         * 相机方位角（角度制）
         * 0 = looking North, 90 = looking East, 180 = looking South, 270 = looking West
         * 0 = 朝北，90 = 朝东，180 = 朝南，270 = 朝西
         */
        bearing?: number;
        /**
         * Camera pitch angle (in degrees)
         * 相机俯仰角（角度制）
         * 0 = top-down view, 90 = horizontal (no artificial limit)
         * 0 = 正上方俯视，90 = 水平（无人为限制）
         */
        pitch?: number;
        /** Bloom post-processing configuration (optional) Bloom 后处理配置（可选） */
        bloom?: {
            enabled?: boolean;
            /** Bloom strength, corresponds to UnrealBloomPass strength 辉光强度，对应 UnrealBloomPass 的 strength */
            strength?: number;
            /** Bloom radius, corresponds to UnrealBloomPass radius 辉光扩散半径，对应 UnrealBloomPass 的 radius */
            radius?: number;
            /** Bloom threshold, corresponds to UnrealBloomPass threshold 触发辉光的亮度阈值，对应 UnrealBloomPass 的 threshold */
            threshold?: number;
        };
        /** Minimum controller zoom distance (how close the camera can get), default is 100 控制器最小缩放距离（相机能靠多近），默认为 100 */
        minDistance?: number;
        /** Maximum controller zoom distance (how far the camera can move), default is 60000 控制器最大缩放距离（相机能拉多远），默认为 60000 */
        maxDistance?: number;
        /** Default ground configuration 默认地面配置 */
        defaultGround?: {
            /** Whether to enable default ground, default is false 是否启用默认地面，默认为 false */
            enabled?: boolean;
            /** Whether default ground is visible, default is false 默认地面是否可见，默认为 false */
            visible?: boolean;
            /** Ground color, default is "rgb(45,52,60)" 地面颜色，默认为 "rgb(45,52,60)" */
            color?: string | number;
            /** Ground opacity, default is 1 地面透明度，默认为 1 */
            opacity?: number;
        };
    };

    /**
     * Simple water paint configuration.
     * 基础水面样式配置
     * @category Paint
     */
    export declare interface SimpleWaterPaint extends BasePaint {
        type: 'water-simple';
        /** 水面颜色 */
        color?: number | string;
        /** 透明度 */
        opacity?: number;
        /** 阳光方向 */
        sunDirection?: Vector3;
        /** 阳光颜色 */
        sunColor?: number | string;
        /** 波纹强度 */
        distortionScale?: number;
        /** 波纹大小 */
        size?: number;
        /** 法线贴图URL */
        normalMap: string;
        /** 是否受雾影响 */
        fog?: boolean;
    }

    /**
     * 数据源加载上下文
     */
    export declare type SourceLoadContext<TSource extends ISource = ISource> = TileLoadContext & {
        source: TSource;
    };

    /**
     * source construtor params type
     * 数据源构造函数参数类型
     */
    export declare interface SourceOptions {
        /** A string identifies the source data type, it requires the support of the loader. 数据源类型标识字符串，需要加载器支持 */
        dataType?: string;
        /** Source attribution info, it allows you to display attribution. 数据源版权信息，用于显示版权 */
        attribution?: string;
        /** Data max level. 数据最大层级 */
        minLevel?: number;
        /** Data min level. 数据最小层级 */
        maxLevel?: number;
        /** Data projection. 数据投影 */
        projectionID?: ProjectionType;
        /** Display opacity. 显示不透明度 */
        opacity?: number;
        bounds?: [number, number, number, number];
        /** Data Url template. 数据URL模板 */
        url?: string;
        /** Url subdomains array or string. URL子域名数组或字符串 */
        subdomains?: string[] | string;
        /** Is TMS scheme. 是否为TMS方案 */
        isTMS?: boolean;
        /** Any data. 任意数据 */
        [key: string]: unknown;
    }

    /**
     * Map state configuration options.
     * 地图状态配置选项
     * @category Map
     */
    export declare type StateOptions = {
        /** Map center coordinates (Required) 地图中心点坐标（必填） */
        center: LngLatLike;
        /** Initial zoom level 初始缩放级别 */
        zoom?: number;
        /** Minimum allowed zoom level 最小缩放级别 */
        minZoom?: number;
        /** Maximum allowed zoom level 最大缩放级别 */
        maxZoom?: number;
    };

    /**
     * 天地图地图样式类型
     * @description 定义天地图支持的各种地图样式
     */
    declare type Style = "img_w" | "cia_w" | "cva_w" | "ibo_w" | "ter_w" | "vec_w" | "cta_w" | "img_c" | "cia_c";

    /**
     * Surface feature abstract base class.
     * 表面要素抽象基类
     *
     * @description
     * Represents a surface feature in the 3D scene, inheriting from the Feature class.
     * Provides basic functionality for polygon surface features, including:
     * - LngLatLike transformation
     * - Geometry creation
     * - Style application
     *
     * 表示3D场景中的表面要素，继承自Feature类
     * 提供多边形表面要素的基础功能，包括：
     * - 坐标转换
     * - 几何体创建
     * - 样式应用
     *
     * @abstract
     * @extends Feature
     * @category Feature
     */
    declare abstract class Surface extends Feature {
        /**
         * Base type identifier.
         * 基础类型标识
         */
        readonly _baseType = "Surface";
        /**
         * Specific surface type identifier (implemented by subclasses).
         * 具体表面类型标识（由子类实现）
         */
        abstract _type: string;
        /**
         * Array of vertex coordinates.
         * 顶点坐标数组
         */
        _vertexPoints: number[];
        /**
         * Create a Surface feature instance.
         * 创建表面要素实例
         *
         * @param options Surface configuration
         *                表面配置
         */
        constructor(options: SurfaceOptions);
        _buildRenderObject(): void;
        /**
         * LngLatLike transformation method.
         * 坐标转换方法
         *
         * @returns Transformed coordinate information
         *          转换后的坐标信息
         *
         * @description
         * Handles coordinate transformation for Polygon and MultiPolygon, returning:
         * - _worldLngLatLikes: Array of transformed coordinates
         * - _vertexPoints: Array of flattened vertex coordinates
         *
         * 处理多边形和多面体的坐标转换，返回：
         * - _worldLngLatLikes: 转换后的坐标数组
         * - _vertexPoints: 展平的顶点坐标数组
         *
         * @throws Throws error if geometry type is not supported
         *         如果几何类型不支持会抛出错误
         */
        _coordsTransform(): any;
        /**
         * Update geometry.
         * 更新几何体
         *
         * @description
         * Updates geometry based on current style type:
         * - 'basic-polygon': Basic polygon
         * - 'extrude-polygon': Extruded polygon
         * - 'water': Water surface effect
         *
         * 根据当前样式类型更新几何体：
         * - 'basic-polygon': 基础多边形
         * - 'extrude-polygon': 挤出多边形
         * - 'water': 水面效果
         */
        protected _refreshLngLatLikes(): void;
        /**
         * Create basic geometry.
         * 创建基础几何体
         *
         * @returns Line2 instance
         *          Line2实例
         *
         * @protected
         * @description
         * Creates line geometry with default material. Subclasses can extend or override this method.
         *
         * 创建带有默认材质的线几何体，子类可扩展或重写此方法
         */
        protected _createRenderObject(): Line2;
    }

    /**
     * Surface feature configuration options.
     * 表面要素配置选项
     *
     * @extends FeatureOptions
     * @category Feature
     */
    declare type SurfaceOptions = FeatureOptions & {
        /**
         * GeoJSON polygon geometry data.
         * GeoJSON多边形几何数据
         */
        geometry?: Polygon_2 | MultiPolygon;
    };

    /**
     * Symbol paint configuration.
     * 图标标签样式配置
     * @category Paint
     */
    export declare interface SymbolPaint extends BasePaint {
        type: 'symbol';
        /** 文本内容 */
        text: string;
        /** 图标URL */
        url?: string;
        /** 图标大小 */
        iconSize?: number | [number, number];
        size?: number | [number, number];
        /** 图标缩放 */
        iconScale?: number;
        /** 字体大小 */
        fontSize?: number;
        /** 字体家族 */
        fontFamily?: string;
        fontWeight?: number;
        /** 文字颜色 */
        textColor?: string;
        /** 描边颜色 */
        strokeColor?: string;
        /** 描边宽度 */
        strokeWidth?: number;
        /** 是否渲染背景 */
        renderbg?: boolean;
        /** 背景颜色 */
        bgColor?: string;
        /** 背景透明度 */
        bgOpacity?: number;
        /** 内边距 */
        padding?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
        /** 画布缩放 */
        canvasScale?: number;
        /** 文本偏移 */
        textOffset?: {
            x: number;
            y: number;
        };
        /** 整体锚点，等同于 Sprite.center / IconPointStyle.anchor */
        anchor?: [number, number];
    }

    /**
     * 天地图量化网格地形数据源
     * @description 提供天地图地形高程数据服务
     * @extends TileSource
     */
    export declare class TDTQMSource extends TileSource {
        /**
         * 数据类型标识
         * @default "quantized-mesh"
         */
        dataType: string;
        /**
         * 数据源版权信息
         * @default "天地图"
         */
        attribution: string;
        /**
         * 天地图访问令牌
         * @description 用于API请求认证
         */
        token: string;
        /**
         * 服务器子域列表
         * @default "01234"
         * @description 用于负载均衡的服务器子域轮询
         */
        subdomains: string;
        /**
         * 瓦片URL模板
         * @default "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}"
         * @description 模板变量：
         * - {s}: 子域编号
         * - {token}: 访问令牌
         * - {x}: 瓦片X坐标
         * - {y}: 瓦片Y坐标
         * - {z}: 缩放级别
         */
        url: string;
        /**
         * 构造函数
         * @param options 配置选项
         * @throws 当未提供token时抛出错误
         */
        constructor(options?: TDTSourceOptins);
    }

    /**
     * 天地图标准瓦片数据源
     * @description 提供天地图标准地图服务的瓦片数据
     * @extends TileSource
     */
    export declare class TDTSource extends TileSource {
        /**
         * 数据类型标识
         * @default "image"
         */
        dataType: string;
        /**
         * 数据源版权信息
         * @default "天地图"
         */
        attribution: string;
        /**
         * 天地图访问令牌
         * @description 用于API请求认证
         */
        token: string;
        /**
         * 地图样式类型
         * @default "img_w" (全球影像地图)
         */
        style: Style;
        /**
         * 服务器子域列表
         * @default "01234"
         * @description 用于负载均衡的服务器子域轮询
         */
        subdomains: string;
        /**
         * 瓦片URL模板
         * @default "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}"
         * @description 模板变量：
         * - {s}: 子域编号
         * - {style}: 地图样式
         * - {x}: 瓦片X坐标
         * - {y}: 瓦片Y坐标
         * - {z}: 缩放级别
         * - {token}: 访问令牌
         */
        url: string;
        /**
         * 构造函数
         * @param options 配置选项
         * @throws 当未提供token时抛出错误
         */
        constructor(options?: TDTSourceOptins);
    }

    /**
     * 天地图数据源配置选项
     * @extends SourceOptions
     */
    export declare type TDTSourceOptins = SourceOptions & {
        /**
         * 地图样式类型
         * @default "img_w" (全球影像地图)
         */
        style?: Style;
        /**
         * 天地图访问令牌
         * @description 必须提供有效的天地图API访问令牌
         */
        token: string;
    };

    /**
     * RTIN (Right-Triangulated Irregular Networks) based terrain mesh builder.
     * 基于 RTIN 的地形网格构建器。
     *
     * @description
     * Implements the Martini algorithm for fast terrain mesh generation.
     * 实现 Martini 算法以快速生成地形网格。
     */
    export declare class TerrainMeshBuilder {
        /**
         * Default grid size (257).
         * 默认网格大小 (257)。
         */
        static readonly DEFAULT_GRID_SIZE = 257;
        private readonly gridSize;
        private readonly numTriangles;
        private readonly numParentTriangles;
        private readonly indices;
        private readonly coords;
        /**
         * Create a new TerrainMeshBuilder.
         * 创建一个新的 TerrainMeshBuilder。
         *
         * @param gridSize Grid size, must be 2^k + 1. 网格大小，必须是 2^k + 1。
         */
        constructor(gridSize?: number);
        /**
         * Precompute triangle coordinates.
         * 预计算三角形坐标。
         * @param tileSize Tile size (gridSize - 1)
         */
        private precomputeCoords;
        /**
         * Process terrain data to generate mesh.
         * 处理地形数据以生成网格。
         *
         * @param terrainData Terrain height data. 地形高度数据。
         * @param maxError Maximum allowed error. 最大允许误差。
         * @returns Geometry data. 几何体数据。
         */
        build(terrainData: Float32Array, maxError?: number): IGeometryData;
        /**
         * Calculate errors for all triangles.
         * 计算所有三角形的误差。
         */
        private calculateErrors;
        /**
         * Generate geometry from error map.
         * 从误差图生成几何体。
         */
        private generateGeometry;
    }

    /**
     * Text paint configuration.
     * 标签样式配置
     * @category Paint
     */
    export declare interface TextPaint extends BasePaint {
        type: 'text' | 'text-fixed';
        /** 文本内容 */
        text: string;
        /** 字体大小像素Dpi，默认不传，内部会自动处理 */
        fontSizeDpi?: number;
        /** 字体家族 */
        fontFamily?: string;
        /** 字体粗细 */
        fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | number;
        /** 字体样式 */
        fontStyle?: 'normal' | 'italic' | 'oblique';
        /** 文字颜色 */
        textColor?: string;
        /** 描边颜色 */
        strokeColor?: string;
        /** 描边宽度 */
        strokeWidth?: number;
        /** 是否显示背景 */
        showBackground?: boolean;
        /** 背景样式 */
        bgStyle?: 1 | 2;
        /** 背景颜色 */
        bgColor?: string;
        /** 背景透明度 */
        bgOpacity?: number;
        /** 阴影颜色 */
        shadowColor?: string;
        /** 阴影模糊度 */
        shadowBlur?: number;
        /** 阴影X偏移 */
        shadowOffsetX?: number;
        /** 阴影Y偏移 */
        shadowOffsetY?: number;
        /** 圆角半径 */
        roundRectRadius?: number;
        /** 气泡指针高度 */
        bubblePointerHeight?: number;
        /** 气泡指针宽度 */
        bubblePointerWidth?: number;
        /** 气泡边框颜色 */
        bubbleBorderColor?: string;
        /** 气泡边框宽度 */
        bubbleBorderWidth?: number;
        /** 固定显示大小（与 screenSpaceSize 含义一致，推荐使用 screenSpaceSize） */
        fixedSize?: number;
        /** 屏幕空间大小，语义为在屏幕上的目标高度（CSS 像素） */
        screenSpaceSize?: number;
        /** 文本偏移 */
        textOffset?: {
            x: number;
            y: number;
        };
        /** 整体锚点 */
        anchor?: [number, number];
    }

    /**
     * Class Tile, inherit of Mesh
     * Tile类，继承自Mesh
     */
    /**
     * Represents a tile in a 3D scene.
     * Extends the Mesh class with BufferGeometry and Material.
     * 表示3D场景中的一个瓦片。
     * 继承自带有BufferGeometry和Material的Mesh类。
     */
    export declare class Tile extends Mesh<BufferGeometry, Material[], ITileEventMap> {
        private static _activeDownloads;
        private _dataMode;
        /** Vector Data 矢量数据 */
        _vectorData: any;
        /**
         * Set data only mode (do not create Mesh, only return data)
         * 设置为数据模式（不创建Mesh，只返回数据）
         */
        setDataOnlyMode(isDataOnly: boolean): this;
        /**
         * Check if it is data only mode
         * 检查是否是数据模式
         */
        isDataOnlyMode(): boolean;
        /**
         * Get vector data (only valid in data mode)
         * 获取矢量数据（仅数据模式有效）
         */
        getVectorData(): any;
        /**
         * Number of download threads.
         * 下载线程数
         */
        static get downloadThreads(): number;
        /** Coordinate of tile 瓦片坐标 */
        readonly x: number;
        readonly y: number;
        readonly z: number;
        /** Is a tile? 是否是瓦片？ */
        readonly isTile = true;
        /** Tile parent 父瓦片 */
        readonly parent: this | null;
        /** Children of tile 子瓦片 */
        readonly children: this[];
        private _isReady;
        /** return this.minLevel < map.minLevel, True mean do not needs load tile data. True表示不需要加载瓦片数据 */
        private _isVirtualTile;
        get isDummy(): boolean;
        private _isVisible;
        /**
         * Gets the showing state of the tile.
         * 获取瓦片的显示状态。
         */
        get showing(): boolean;
        /**
         * Sets the showing state of the tile.
         * 设置瓦片的显示状态。
         * @param value - The new showing state. 新的显示状态。
         */
        set showing(value: boolean);
        /** Max height of tile 瓦片最大高度 */
        private _maxHeight;
        /**
         * Gets the maximum height of the tile.
         * 获取瓦片的最大高度。
         */
        get maxZ(): number;
        /**
         * Sets the maximum height of the tile.
         * 设置瓦片的最大高度。
         * @param value - The new maximum height. 新的最大高度。
         */
        protected set maxZ(value: number);
        /** Distance to camera 到相机的距离 */
        distToCamera: number;
        sizeInWorld: number;
        /**
         * Gets the index of the tile in its parent's children array.
         * 获取瓦片在父节点子数组中的索引。
         * @returns The index of the tile. 瓦片的索引。
         */
        get index(): number;
        private _isLoaded;
        /**
         * Gets the load state of the tile.
         * 获取瓦片的加载状态。
         */
        get loaded(): boolean;
        private _inFrustum;
        /** Is tile in frustum ? 瓦片是否在视锥体中？ */
        get inFrustum(): boolean;
        /**
         * Sets whether the tile is in the frustum.
         * 设置瓦片是否在视锥体中。
         * @param value - The new frustum state. 新的视锥体状态。
         */
        protected set inFrustum(value: boolean);
        /** Tile is a leaf ? 瓦片是否是叶子节点？ */
        get isLeaf(): boolean;
        /**
         * Constructor for the Tile class.
         * Tile类的构造函数。
         * @param x - Tile X-coordinate, default: 0. 瓦片X坐标，默认0。
         * @param y - Tile Y-coordinate, default: 0. 瓦片Y坐标，默认0。
         * @param z - Tile level, default: 0. 瓦片层级，默认0。
         */
        constructor(x?: number, y?: number, z?: number);
        /**
         * Override Object3D.traverse, change the callback param type to "this".
         * 重写 Object3D.traverse，将回调参数类型更改为 "this"。
         * @param callback - The callback function. 回调函数。
         */
        traverse(callback: (object: this) => void): void;
        /**
         * Override Object3D.traverseVisible, change the callback param type to "this".
         * 重写 Object3D.traverseVisible，将回调参数类型更改为 "this"。
         * @param callback - The callback function. 回调函数。
         */
        traverseVisible(callback: (object: this) => void): void;
        /**
         * Override Object3D.raycast, only test the tile has loaded.
         * 重写 Object3D.raycast，仅测试已加载的瓦片。
         * @param raycaster - The raycaster. 射线投射器。
         * @param intersects - The array of intersections. 交点数组。
         */
        raycast(raycaster: Raycaster, intersects: Intersection[]): void;
        /**
         * LOD (Level of Detail).
         * LOD（细节层次）。
         * @param params - The tile loader. 瓦片加载器。
         * @returns this
         */
        protected _updateLOD(params: TileUpdateParams): {
            action: LODAction;
            newTiles?: undefined;
        } | {
            action: LODAction;
            newTiles: Tile[];
        };
        /**
         * Checks the visibility of the tile.
         */
        private _checkVisibility;
        /**
         * Asynchronously load tile data
         *
         * @param loader Tile loader
         * @returns this
         */
        private _loadData;
        /** New tile init */
        private _initTile;
        /**
         * Updates the tile.
         * @param params - The update parameters.
         * @returns this
         */
        update(params: TileUpdateParams): this;
        private _processLODAction;
        /**
         * Reloads the tile data.
         * @returns this
         */
        reload(loader: ICompositeLoader): this;
        /**
         * Checks if the tile is ready to render.
         * @returns this
         */
        private _checkReadyState;
        /**
         * UnLoads the tile data.
         * @param disposeSelf - Whether to unload tile itself.
         * @returns this.
         */
        private _disposeResources;
    }

    /**
     * 瓦片坐标及边界参数
     */
    export declare type TileLoadContext = {
        x: number;
        y: number;
        z: number;
        bounds: [number, number, number, number];
        lonLatBounds?: [number, number, number, number];
    };

    /**
     * 瓦片加载器工厂
     * @description 管理和检索各种类型的瓦片加载器 (Geometry, Material, Mesh)
     */
    export declare class TileLoaderFactory {
        static readonly manager: TileLoadingManager;
        private static readonly geometryLoaders;
        private static readonly materialLoaders;
        private static readonly meshLoaders;
        /**
         * 注册材质加载器
         * @param loader
         */
        static registerMaterialLoader(loader: IMaterialLoader): void;
        /**
         * 注册几何体加载器
         * @param loader
         */
        static registerGeometryLoader(loader: IGeometryLoader): void;
        /**
         * 注册网格加载器 (通常用于矢量瓦片等自带几何体和材质的数据)
         * @param loader
         */
        static registerMeshLoader(loader: IGeometryLoader): void;
        /**
         * 获取材质加载器
         * @param source
         */
        static getMaterialLoader(source: ISource): IMaterialLoader;
        /**
         * 获取几何体加载器
         * @param source
         */
        static getGeometryLoader(source: ISource): IGeometryLoader;
        /**
         * 获取网格加载器
         * @param source
         */
        static getMeshLoader(source: ISource): IGeometryLoader;
        private static ensureAuthor;
    }

    /**
     * 瓦片加载管理器
     */
    export declare class TileLoadingManager extends LoadingManager {
        onParseEnd?: (url: string) => void;
        parseEnd(url: string): void;
    }

    /**
     * Tile material
     */
    export declare class TileMaterial extends MeshStandardMaterial {
        constructor(params?: MeshStandardMaterialParameters);
        setTexture(texture: Texture): void;
        dispose(): void;
    }

    /**
     * 瓦片网格数据类型
     */
    export declare type TileMeshData = {
        materials: Material[];
        geometry: BufferGeometry;
    };

    /**
     * Tile paint input type.
     * 矢量瓦片样式输入类型
     * @description 支持单个样式配置或数组
     * @category Paint
     */
    export declare type TilePaintInput = PaintConfig | PaintConfig[];

    /**
     *  Base class for data sources, users can customize data sources by inheriting this class
     *  数据源基类，用户可以通过继承此类来自定义数据源
     */
    export declare class TileSource implements ISource {
        /** Data type that determines which loader to use for loading and processing data. Default is "image" type. 决定使用哪个加载器加载和处理数据的类型，默认为"image"类型 */
        dataType: string;
        /** Copyright attribution information for the data source, used for displaying map copyright notices. 数据源版权信息，用于显示地图版权声明 */
        attribution: string;
        /** Minimum zoom level supported by the data source. Default is 0. 数据源支持的最小缩放级别，默认为0 */
        minLevel: number;
        /** Maximum zoom level supported by the data source. Default is 18. 数据源支持的最大缩放级别，默认为18 */
        maxLevel: number;
        /** Data projection type. Default is "3857" Mercator projection. 数据投影类型，默认为"3857"墨卡托投影 */
        projectionID: ProjectionType;
        /** URL template for tile data. Uses variables like {x},{y},{z} to construct tile request URLs. 瓦片数据URL模板，使用{x},{y},{z}等变量构建请求URL */
        url: string;
        /** List of URL subdomains for load balancing. Can be an array of strings or a single string. 用于负载均衡的URL子域名列表，可以是字符串数组或单个字符串 */
        subdomains: string[] | string;
        /** Currently used subdomain. Randomly selected from subdomains when requesting tiles. 当前使用的子域名，请求瓦片时随机选择 */
        s: string;
        /** Layer opacity. Range 0-1, default is 1.0 (completely opaque). 图层不透明度，范围0-1，默认1.0（完全不透明） */
        opacity: number;
        /** Whether to use TMS tile coordinate system. Default false uses XYZ system, true uses TMS system. 是否使用TMS瓦片坐标系，默认false使用XYZ坐标系，true使用TMS坐标系 */
        isTMS: boolean;
        /** Data bounds in format [minLon, minLat, maxLon, maxLat]. Default covers global range excluding polar regions. 数据范围格式[minLon, minLat, maxLon, maxLat]，默认覆盖全球范围（不含极地） */
        bounds: [number, number, number, number];
        /** Projected data bounds. 投影后的数据范围 */
        _projectionBounds: [number, number, number, number];
        /** Tile material. 瓦片材质 */
        tileMaterial?: Material;
        /** Any data. 任意数据 */
        [key: string]: unknown;
        /**
         * constructor
         * 构造函数
         * @param options SourceOptions
         */
        constructor(options?: SourceOptions);
        /**
         * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
         * 根据瓦片坐标获取URL，公开方法，可重写以自定义生成URL
         * @param x tile x coordinate 瓦片X坐标
         * @param y tile y coordinate 瓦片Y坐标
         * @param z tile z coordinate 瓦片Z坐标
         * @returns url tile url 瓦片URL
         */
        getUrl(x: number, y: number, z: number): string | undefined;
        /**
         * Get url from tile coordinate, public, called by TileLoader system
         * 根据瓦片坐标获取URL，公开方法，由瓦片加载系统调用
         * @param x tile x coordinate 瓦片X坐标
         * @param y tile y coordinate 瓦片Y坐标
         * @param z tile z coordinate 瓦片Z坐标
         * @returns url tile url 瓦片URL
         */
        _getUrl(x: number, y: number, z: number): string | undefined;
        /**
         * Create source directly through factoy functions.
         * @param options source options
         * @returns ISource data source instance
         */
        static create(options: SourceOptions): TileSource;
    }

    /**
     * Tile update parameters
     */
    export declare type TileUpdateParams = {
        camera: Camera;
        loader: ICompositeLoader;
        minLevel: number;
        maxLevel: number;
        LODThreshold: number;
    };

    /**
     * ToolTip Component.
     * 提示框组件
     * @extends UIComponent
     * @category UI
     */
    export declare class ToolTip extends UIComponent {
        options: ToolTipOptions;
        private _content?;
        private _timeoutId;
        private _boundOnOwnerMove;
        private _boundOnOwnerOut;
        private _boundOnOwnerRemoved;
        /**
         * @param options ToolTip options ToolTip 配置
         */
        constructor(options?: ToolTipOptions);
        protected _getClassName(): string;
        /**
         * Build ToolTip DOM structure.
         * 构建 ToolTip 的 DOM 结构
         */
        protected buildOn(): HTMLElement;
        /**
         * Calculate offset based on DOM size to make tooltip appear slightly above and to the right of the point.
         * 根据 DOM 尺寸，做一个简单的偏移，让 tooltip 出现在点的上方偏右一点
         */
        protected getOffset(): {
            x: number;
            y: number;
        };
        /**
         * Bind to feature or map. The key is to bind mouse move/leave events to owner.
         * 绑定到要素或地图。这里重点是给 owner 绑鼠标移动/离开事件。
         */
        addTo(owner: any): this;
        /**
         * Internal: Handle owner move event.
         * 内部：处理 owner 移动事件
         */
        private _onOwnerMove;
        /**
         * Internal: Handle owner out event.
         * 内部：处理 owner 离开事件
         */
        private _onOwnerOut;
        /**
         * Internal: Handle owner removed event.
         * 内部：处理 owner 移除事件
         */
        private _onOwnerRemoved;
        protected onRemove(): void;
    }

    /**
     * ToolTip content type.
     * ToolTip 内容类型
     * @category UI
     */
    declare type ToolTipContent = string | HTMLElement | ((container: HTMLElement) => void);

    /**
     * ToolTip options.
     * ToolTip 配置项
     * @category UI
     */
    declare type ToolTipOptions = UIComponentOptions & {
        /**
         * Width.
         * 宽度
         */
        width?: number;
        /**
         * Height.
         * 高度
         */
        height?: number;
        /**
         * Show timeout (ms), 0 means show immediately.
         * 延时显示（毫秒），0 表示立即显示
         */
        showTimeout?: number;
        /**
         * Content.
         * 提示内容
         */
        content?: ToolTipContent;
    };

    /**
     * TPoints feature class (Clouds/Lights).
     * TPoints要素类 (云朵/灯光)
     *
     * @description
     * Represents TPoints features in 3D scene, inheriting from Point class.
     * Provides creation, update, and rendering functions for TPoints.
     * 表示3D场景中的TPoints要素，继承自Point类。
     * 提供TPoints的创建、更新和渲染功能。
     *
     * @extends Point
     * @category Feature
     */
    export declare class TPoints extends Point_3 {
        /**
         * Feature type identifier.
         * 要素类型标识
         */
        _type: string;
        /**
         * Geometry data.
         * 几何数据
         */
        _geometries: any;
        /**
         * Create a TPoints feature instance.
         * 创建TPoints要素实例
         *
         * @param options TPoints configuration options
         *                TPoints配置选项
         */
        constructor(options: TPointsOptions);
        /**
         * Convert feature to Three.js geometry.
         * 将要素转换为Three.js几何体
         *
         * @returns Promise<void>
         *
         * @description
         * Create TPoints geometry based on style configuration.
         * 根据样式配置创建TPoints几何体
         */
        _buildRenderObject(): Promise<void>;
        /**
         * Update geometry (override parent method).
         * 更新几何体（重写父类方法）
         *
         * @description
         * Add TPoints geometry to the container, and set position and render order.
         * 将TPoints几何体添加到容器中，并设置位置和渲染顺序
         */
        _refreshCoordinates(): void;
        /**
         * Create TPoints object.
         * 创建TPoints对象
         *
         * @param style Style configuration
         *              样式配置
         * @returns Created TPoints object
         *          创建的TPoints对象
         * @throws Throws error if style type is not supported
         *         如果样式类型不支持会抛出错误
         *
         * @private
         */
        _createObject(paint: Paint): Promise<any>;
    }

    /**
     * TPoints feature configuration options.
     * TPoints要素配置选项
     *
     * @extends PointOptions
     * @category Feature
     */
    export declare type TPointsOptions = PointOptions & {
        /**
         * Geometry data.
         * 几何数据
         */
        geometries?: any;
    };

    /**
     * Tube paint configuration.
     * 管道线样式配置
     * @category Paint
     */
    export declare interface TubePaint extends BasePaint {
        type: 'tube';
        /** 管道颜色 */
        color?: string | number | Color;
        /** 管道半径 */
        radius: number;
        /** 圆柱分段数 */
        segments?: number;
        /** 是否包含端盖 */
        caps?: boolean;
        /** 流动贴图URL */
        flowTexture?: string;
        /** 压力值 */
        pressure?: number;
    }

    /**
     * UI Component Base Class.
     * UI 组件基类
     * @description
     * Abstraction goals:
     * - Attach to Map or Feature (addTo)
     * - Internally manage DOM lifecycle (buildOn / remove)
     * - Position DOM to screen coordinates based on world coordinates + camera
     * - Update position when listening to map view changes (viewchange)
     *
     * 抽象目标：
     * - 挂到 Map 或 Feature 上（addTo）
     * - 内部管理 DOM 生命周期（buildOn / remove）
     * - 根据世界坐标 + 相机，将 DOM 定位到屏幕坐标
     * - 监听地图视图变化（viewchange）时更新位置
     * @category UI
     */
    export declare abstract class UIComponent extends UIComponent_base {
        /**
         * Component options.
         * 组件配置
         */
        options: UIComponentOptions;
        /**
         * Owner object: Map or Feature.
         * 所属对象：Map 或 Feature
         */
        protected _owner?: any;
        /**
         * Map instance.
         * 所属地图实例
         */
        protected _map?: Map_2;
        /**
         * Current world position.
         * 当前使用的世界坐标
         */
        protected _worldPosition?: Vector3;
        /**
         * Recorded coordinate if passed via show(coordinate).
         * 如果通过 show(coordinate) 传入了坐标，这里记录下来
         */
        private _coordinate?;
        /**
         * Corresponding DOM element.
         * 对应的 DOM 元素
         */
        protected _dom?: HTMLElement;
        /**
         * Whether currently visible.
         * 当前是否可见
         */
        protected _visible: boolean;
        /**
         * Cache event handlers bound to Map for removal on off.
         * 绑定到 Map 的事件处理缓存，便于 off 时移除
         */
        private _boundMapHandlers;
        /**
         * SceneRenderer update event handler.
         * 绑定到 SceneRenderer 的 update 事件处理函数
         */
        private _sceneRendererUpdateHandler?;
        /**
         * Whether position calculation has been done once (to avoid initial wrong position flicker).
         * 是否已经完成过一次位置计算（用于避免第一次错误位置闪一下）
         */
        private _positionedOnce;
        /**
         * Set of "single" components on the same map for mutual exclusion display.
         * 同一张地图上的“single”组件集合，用于互斥显示
         */
        private static _singletons;
        /**
         * @param options UI component options UI 组件配置
         */
        constructor(options?: UIComponentOptions);
        /**
         * Subclasses must implement: Build own DOM.
         * 子类必须实现：构建自身 DOM
         * @returns Created DOM element 创建的 DOM 元素
         */
        protected abstract buildOn(): HTMLElement;
        /**
         * Subclasses optional: For debugging and style distinction.
         * 子类可选：用于调试和样式区分
         * @returns Class name 类名
         */
        protected _getClassName(): string;
        /**
         * Subclasses optional: Extra offset.
         * 子类可选：额外偏移
         * @returns {Object} Offset `{x, y}` 偏移量
         */
        protected getOffset(): {
            x: number;
            y: number;
        };
        /**
         * Lifecycle hook: Called on addTo.
         * 生命周期钩子：addTo 时调用
         */
        protected onAdd?(): void;
        /**
         * Lifecycle hook: Called on remove.
         * 生命周期钩子：remove 时调用
         */
        protected onRemove?(): void;
        /**
         * Lifecycle hook: Called when DOM is removed from container.
         * 生命周期钩子：DOM 从容器移除时调用
         */
        protected onDomRemove?(): void;
        /**
         * Add UIComponent to Map or Feature.
         * 将 UIComponent 添加到 Map 或 Feature 上
         * @param owner Map or Feature Map 或 Feature
         */
        addTo(owner: any): this;
        /**
         * Remove UIComponent from owner Map / Feature.
         * 从所属 Map / Feature 移除 UIComponent
         */
        remove(): this;
        /**
         * Show UIComponent.
         * 显示 UIComponent
         * @param coordinate Geographic coordinate ([lng, lat, alt]), optional 地理坐标（[lng, lat, alt]），可选
         */
        show(coordinate?: LngLatLike): this;
        /**
         * Hide UIComponent (keep DOM, do not unbind).
         * 隐藏 UIComponent（保留 DOM，不解绑）
         */
        hide(): this;
        /**
         * Remove DOM (called on remove).
         * 移除 DOM（remove 时调用）
         */
        hideDom(): this;
        /**
         * Get owner Map.
         * 获取所属 Map
         */
        getMap(): Map_2 | undefined;
        /**
         * Whether currently visible (show state).
         * 当前是否可见（show 状态）
         */
        isVisible(): boolean;
        /**
         * Internal: Bind / Unbind map events.
         * 内部：绑定 / 解绑地图事件
         */
        private _bindMapEvents;
        /**
         * Internal: Derive world position from geographic coordinate / owner.
         * Ensures unified use of map.lngLatToWorld to keep altitude / center units consistent.
         *
         * 内部：根据地理坐标 / owner 推导世界坐标
         * 保证统一走 map.lngLatToWorld，从而保持 altitude / center 单位统一
         */
        private _resolveWorldPosition;
        /**
         * Internal: Update DOM position based on world coordinates.
         * 内部：根据世界坐标更新 DOM 位置
         */
        protected _refreshDomPosition(): void;
    }

    declare const UIComponent_base: {
        new (...args: any[]): {
            eventClass: EventClass;
            on: (type: string, listener: (data? /**
            * DOM zIndex.
            * DOM zIndex
            */: any) => void) => EventClass;
            fire: (type: string, data?: any) => EventClass;
            off: (type: string, listener: (...args: any[]) => void) => EventClass;
        };
    } & {
        new (...args: any[]): {
            [x: string]: any;
            options: any;
            _isUpdatingOptions?: boolean;
            _initHooksCalled?: boolean;
            _initHooks?: Function[];
            _proxyOptions(): /*elided*/ any;
            _callInitHooks(): /*elided*/ any;
            setOptions(options: ClassOptions): /*elided*/ any;
            configure(conf?: string | ClassOptions, value?: any): ClassOptions | /*elided*/ any;
            onOptionsChange(_conf: ClassOptions): void;
            _visitInitHooks(proto: {
                _initHooks: any;
            }): void;
        };
        mergeOptions(options: ClassOptions): /*elided*/ any & typeof EmptyBase_2;
        addInitHook(fn: Function | string, ...args: any[]): /*elided*/ any & typeof EmptyBase_2;
        include(...sources: any[]): /*elided*/ any & typeof EmptyBase_2;
    } & typeof EmptyBase_2;

    /**
     * UI Component options.
     * UI 组件配置项
     * @category UI
     */
    declare type UIComponentOptions = ClassOptions & {
        /**
         * DOM container class, can be string or string[].
         * DOM 容器 class，可为 string 或 string[]
         */
        containerClass?: string | string[];
        /**
         * X pixel offset (positive for right).
         * X 方向像素偏移（右为正）
         */
        dx?: number;
        /**
         * Y pixel offset (positive for down).
         * Y 方向像素偏移（下为正）
         */
        dy?: number;
        /**
         * Whether visible by default.
         * 是否默认可见
         */
        visible?: boolean;
        /**
         * Whether it is a global unique component on the same map (only one of the same kind is displayed).
         * 是否为同一张地图上的全局唯一组件（同类只显示一个）
         */
        single?: boolean;
        /**
         * DOM zIndex.
         * DOM zIndex
         */
        zIndex?: number;
    };

    /**
     * UIMarker Component
     * UIMarker 组件
     *
     * @description
     * A DOM-based marker component that is anchored to a specific geographic coordinate on the map.
     * Updates its position automatically as the map moves or zooms.
     * 基于 DOM 的标记点组件，锚定在地图上的特定地理坐标。
     * 随地图移动或缩放自动更新位置。
     * @category UI
     */
    export declare class UIMarker extends UIComponent {
        options: UIMarkerOptions;
        /**
         * Current marker coordinate
         * 当前标记点坐标
         */
        private _markerCoord;
        /**
         * Content cache
         * 内容缓存
         */
        private _content;
        constructor(options: UIMarkerOptions);
        protected _getClassName(): string;
        /**
         * Build UIMarker DOM
         * 构建 UIMarker 的 DOM
         */
        protected buildOn(): HTMLElement;
        /**
         * Position offset: default centers the marker on the coordinate
         * 位置偏移：默认让标记点中心落在坐标位置上
         */
        protected getOffset(): {
            x: number;
            y: number;
        };
        /**
         * Show: updates internal coordinate if a new one is provided
         * 显示：如果传了新坐标，就更新内部坐标
         */
        show(coordinate?: LngLatLike): this;
        /**
         * 设置坐标（会触发重新定位）
         */
        setLngLatLikes(coordinate: LngLatLike): this;
        /**
         * 获取当前坐标
         */
        getLngLatLikes(): LngLatLike;
        /**
         *
         */
        getCenter(): LngLatLike;
        /**
         * 获取高度（优先坐标的 z，再退回 options.altitude）
         */
        getAltitude(): number;
        /**
         * 设置高度：内部直接改第三个分量
         */
        setAltitude(alt: number): this;
        /**
         * 设置内容：如果当前已显示，会立即更新 DOM
         */
        setContent(content: UIMarkerContent): this;
        getContent(): UIMarkerContent;
        addTo(owner: any): this;
    }

    /**
     * UIMarker content type
     * UIMarker 内容类型
     * @category UI
     */
    declare type UIMarkerContent = string | HTMLElement | ((container: HTMLElement) => void);

    /**
     * UIMarker options
     * UIMarker 配置项
     * @category UI
     */
    declare type UIMarkerOptions = UIComponentOptions & {
        /**
         * Required: Geographic coordinate [lng, lat, alt?]
         * 必填：地理坐标 [lng, lat, alt?]
         */
        coordinate: LngLatLike;
        /**
         * Content: can be HTML string / DOM / render function
         * 内容，可以是 HTML 字符串 / DOM / 渲染函数
         */
        content: UIMarkerContent;
        /**
         * Width (pixels, optional)
         * 宽度（像素，可选）
         */
        width?: number;
        /**
         * Height (pixels, optional)
         * 高度（像素，可选）
         */
        height?: number;
        /**
         * Fallback altitude (used if z is missing in coordinate)
         * 备用高度（如果坐标里没 z，就用这个）
         */
        altitude?: number;
    };

    /**
     * 矢量特征值
     */
    export declare type VectorFeature = {
        geometry: Point[][];
        properties?: Record<string, unknown>;
        size?: number;
    };

    /**
     * 元素类型
     */
    export declare enum VectorFeatureTypes {
        Unknown = 0,
        Point = 1,
        Linestring = 2,
        Polygon = 3
    }

    /**
     *  瓦片绘图样式，参考leaflet的path样式定义
     */
    export declare interface VectorPaint {
        minLevel?: number;
        maxLevel?: number;
        stroke?: boolean | undefined;
        color?: string | undefined;
        weight?: number | undefined;
        opacity?: number | undefined;
        dashArray?: number[] | undefined;
        dashOffset?: string | undefined;
        fill?: boolean | undefined;
        fillColor?: string | undefined;
        font?: string;
        fontColor?: string;
        fontOffset?: [number, number];
        textField?: string;
        fillOpacity?: number | undefined;
        fillRule?: CanvasFillRule | undefined;
        shadowBlur?: number;
        shadowColor?: string;
        shadowOffset?: [number, number];
    }

    /**
     * 样式集合
     */
    export declare type VectorPaints = {
        [key: string]: VectorPaint;
    };

    /**
     * Alias for VectorPaint (for backwards compatibility)
     */
    export declare type VectorStyle = VectorPaint;

    /**
     * Vector Tile Layer.
     * 矢量瓦片图层
     *
     * @description
     * Layer specialized for displaying vector data, responsible for loading and distributing tile data.
     * Features rendering and lifecycle are managed by VectorTileRenderLayer.
     *
     * 专门用于显示矢量数据的图层，负责瓦片数据的加载和分发。
     * Features 的渲染和生命周期由 VectorTileRenderLayer 管理。
     * @category Layer
     */
    export declare class VectorTileLayer extends BaseTileLayer {
        /**
         * Layer type identifier.
         * 图层类型标识符。
         * @readonly
         */
        readonly layerType: string;
        /**
         * Store tile data references for data query, does not store Features.
         * 存储瓦片数据引用，用于数据查询，不存储 Features。
         * @private
         */
        private _tileDataMap;
        /**
         * Container/Logic layer for rendering Features, inherits from OverlayLayer.
         * 渲染 Feature 的容器/逻辑层，继承自 OverlayLayer。
         * @private
         */
        private _renderer;
        private _style;
        _feaList: Feature[];
        _collision: boolean;
        private _renderAltitude;
        /**
         * Create a new VectorTileLayer instance.
         * 创建一个新的 VectorTileLayer 实例。
         *
         * @param id Unique layer identifier. 图层唯一标识符。
         * @param options Layer configuration options. 图层配置选项。
         */
        constructor(id: string, options: VectorTileLayerOptions);
        /**
         * Create the tile loader for this layer.
         * 创建此图层的瓦片加载器。
         *
         * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
         * @protected
         */
        protected createLoader(): ICompositeLoader;
        /**
         * Set all child tiles to data mode and add necessary event listeners to them.
         * 设置所有子瓦片为数据模式，并为它们添加必要的事件监听器
         */
        private _setupDataModeAndListenersForChildren;
        private _addShownListenerToTile;
        private _addUnloadListenerToTile;
        /**
         * Set layer altitude.
         * 设置图层高度 (海拔)。
         *
         * @param altitude Altitude value. 高度值。
         * @description
         * Modify layer position in vertical direction.
         * 修改图层在垂直方向上的位置。
         */
        setAltitude(altitude: number): this;
        /**
         * Get current layer altitude.
         * 获取当前图层高度。
         *
         * @returns {number} Altitude value. 高度值。
         */
        getAltitude(): number;
        /**
         * Add tile-hidden event listener for a single tile.
         * 为单个瓦片添加 tile-hidden 事件监听器
         * @param tile
         * @private
         */
        private _addHiddenListenerToTile;
        /**
         * Unified lifecycle listener management, responsible for data and renderer linkage.
         * 统一管理生命周期监听，负责数据和渲染器的联动
         */
        private _setupLifeCycleListeners;
        /**
         * Extract vector data from tile geometry.
         * 从瓦片几何体中提取矢量数据
         */
        private getVectorDataFromTile;
        /**
         * Get currently visible vector tile data.
         * 获取当前可见的矢量瓦片数据。
         *
         * @returns {Array<{ tileKey: string, data: any, tile: Tile }>} Array of visible tile data. 可见瓦片数据的数组。
         */
        getVisibleVectorTiles(): Array<{
            tileKey: string;
            data: any;
            tile: Tile;
        }>;
        /**
         * Get all loaded vector data.
         * 获取所有已加载的矢量数据。
         *
         * @returns {Map<string, any>} Map of all loaded vector data. 所有已加载矢量数据的 Map。
         */
        getAllVectorData(): Map<string, any>;
        /**
         * Get specific tile data by coordinates.
         * 根据坐标获取特定瓦片数据。
         *
         * @param x Tile X coordinate. 瓦片 X 坐标。
         * @param y Tile Y coordinate. 瓦片 Y 坐标。
         * @param z Tile Z coordinate (zoom level). 瓦片 Z 坐标（缩放级别）。
         * @returns {any} The vector data for the tile, or null if not found. 瓦片的矢量数据，如果未找到则为 null。
         */
        getVectorData(x: number, y: number, z: number): any;
        /**
         * Set feature filter.
         * 设置要素过滤器。
         *
         * @param filter Filter function that returns true to keep the feature. 返回 true 以保留要素的过滤函数。
         */
        setFeatureFilter(filter: (feature: any) => boolean): void;
        /**
         * Clear feature filter.
         * 清除要素过滤器。
         */
        clearFeatureFilter(): void;
        /**
         * Set layer opacity.
         * 设置图层透明度。
         *
         * @param opacity Opacity value (0-1). 透明度值 (0-1)。
         */
        setOpacity(opacity: number): void;
        /**
         * Update layer - Override to add vector specific logic.
         * 更新图层 - 重写以添加矢量特定逻辑。
         *
         * @param camera The camera used for rendering. 用于渲染的相机。
         */
        update(camera: Camera): void;
        /**
         * Override dispose method to clean up vector data.
         * 重写dispose方法，清理矢量数据。
         */
        dispose(): void;
        _setRenderer(renderer: VectorTileRenderLayer): void;
        _getRenderer(): VectorTileRenderLayer;
        getStyle(): any;
    }

    /**
     * Vector Tile Layer configuration interface.
     * 矢量瓦片图层配置接口
     *
     * @description
     * Configuration options for creating a VectorTileLayer.
     * 用于创建 VectorTileLayer 的配置选项。
     * @category Layer
     */
    export declare interface VectorTileLayerOptions extends BaseTileLayerOptions {
        /**
         * Vector style configuration (Required).
         * 矢量样式配置（必需）。
         */
        style: any;
        /**
         * Feature filter function (Optional).
         * 要素过滤器（可选）。
         */
        featureFilter?: (feature: any) => boolean;
        /**
         * Whether to enable collision detection (Optional).
         * 是否进行碰撞检测（可选）。
         * @default false
         */
        collision?: boolean;
    }

    /**
     * 矢量数据渲染器
     */
    export declare class VectorTileRender {
        /**
         * 渲染矢量数据
         * @param ctx 渲染上下文
         * @param type 元素类型
         * @param feature 元素
         * @param style 样式
         * @param scale 拉伸倍数
         */
        render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, type: VectorFeatureTypes, feature: VectorFeature, style: VectorStyle, scale?: number): void;
        private _renderPointText;
        private _renderLineString;
        private _renderPolygon;
    }

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
    declare class VectorTileRenderLayer extends OverlayLayer<Feature> {
        private readonly TILE_SIZE;
        private readonly EXTENT;
        paint: PaintRule[];
        /**
         * Store Features corresponding to each tile for lifecycle management and updates.
         * 存储每个瓦片对应的 Features，用于管理生命周期和更新。
         * @private
         */
        private _tileFeatureMap;
        /**
         * Currently active feature filter (from VectorTileLayer).
         * 当前激活的要素过滤器 (来自 VectorTileLayer)。
         * @private
         */
        private _activeFeatureFilter?;
        constructor(id: string, options: VectorTileRenderLayerOptions);
        /**
         * **Core Method:** Process single tile data, create Features based on global style rules array.
         * **核心方法：** 处理单个瓦片的数据，根据全局样式规则数组创建 Features。
         *
         * @param tile Tile object (contains z, x, y ID). 瓦片对象 (包含 z, x, y ID)。
         * @param data Parsed vector tile data (contains vectorData property). 经过解析的矢量瓦片数据 (包含 vectorData 属性)。
         * @param zoom Current zoom level. 当前缩放级别 (Unused parameter in implementation).
         */
        processTileData(tile: Tile, data: any): void;
        /**
         * Placeholder function: Evaluate if feature properties satisfy filter conditions (needs to implement complex Mapbox GL style spec).
         * 占位函数：评估要素属性是否满足过滤条件 (需要实现复杂的 Mapbox GL 样式规范)。
         *
         * @param filter Filter expression in style rule. 样式规则中的 filter 表达式。
         * @param properties Feature properties object. 要素的属性对象。
         * @param layerName Name of tile layer the current feature belongs to (can be used for filtering). 当前要素所属的瓦片图层名称 (可用于过滤)。
         * @returns {boolean} Whether it matches. 是否匹配。
         */
        private _evaluateFilter;
        /**
         * Hide Features of a tile (do not destroy).
         * Used for tile-hidden event.
         * 隐藏某个瓦片的 Features（并不销毁）。
         * 用于 tile-hidden 事件。
         *
         * @param tileKey Tile identifier. 瓦片标识符。
         */
        hideFeaturesByTileKey(tileKey: string): void;
        /**
         * Completely clean up all Features loaded by a tile.
         * Used for tile-unload event.
         * 彻底清理某个瓦片加载的所有 Feature。
         * 用于 tile-unload 事件。
         *
         * @param tileKey Tile identifier. 瓦片标识符。
         */
        removeFeaturesByTileKey(tileKey: string): void;
        private _removeFeaturesByTileKey;
        /**
         * Create corresponding Feature instance based on GeoJSON type.
         * 根据 GeoJSON 类型创建对应的 Feature 实例
         */
        private _createFeatureInstance;
        setFeatureFilter(filter: (feature: any) => boolean): void;
        clearFeatureFilter(): void;
        setOpacity(opacity: number): void;
        /**
         * Start listening to map update events when Layer is added to Map.
         * Layer 绑定到 Map 时，开始监听地图更新事件
         */
        /**
         * Stop listening when Layer is removed from Map.
         * Layer 从 Map 移除时，取消监听
         */
        /**
         * Map update callback: Force all loaded Features to recalculate their local world coordinates.
         * 地图更新回调：强制所有已加载的 Features 重新计算其局部世界坐标。
         */
        private _onMapUpdate;
        /**
         * OverlayLayer abstract method implementation.
         * OverlayLayer 抽象方法实现
         */
        protected validateFeature(feature: Feature): boolean;
        /**
         * Three.js render loop update method.
         * Three.js 渲染循环更新方法
         */
        dispose(): void;
    }

    declare type VectorTileRenderLayerOptions = OverlayLayerOptions<Feature> & {
        /**
         * Paint configuration: Global PaintRule array, applied to all vector layers.
         * 样式配置：全局 PaintRule 数组，应用于所有矢量图层
         */
        paint: PaintRule[];
        tileSize?: number;
        extent?: number;
    };

    /**
     * Vector Tile Texture Loader
     * 矢量瓦片纹理加载器
     *
     * @description
     * Loads Mapbox Vector Tile (MVT) data and renders it to a texture using OffscreenCanvas.
     * Useful for displaying vector data as raster tiles.
     *
     * 加载 Mapbox 矢量瓦片 (MVT) 数据并使用 OffscreenCanvas 将其渲染为纹理。
     * 适用于将矢量数据显示为栅格瓦片。
     */
    export declare class VectorTileTextureLoader extends AbstractMaterialLoader {
        readonly info: LoaderMetadata;
        readonly dataType = "mvt";
        private _loader;
        private _render;
        constructor();
        /**
         * Override load to handle custom MVT loading logic
         * 重写 load 以处理自定义 MVT 加载逻辑
         */
        protected performLoad(url: string, context: SourceLoadContext): Promise<Texture>;
        /**
         * Draw tile to OffscreenCanvas
         * 在离屏画布上绘制瓦片
         */
        private drawTile;
        private _renderLayer;
        private _renderFeature;
        /**
         * Convert Vector Tile to GeoJSON FeatureCollection
         * 将整个矢量瓦片转换为 GeoJSON FeatureCollection
         */
        convertVectorTileToGeoJSON(vectorTile: VectorTile): any;
        private _convertToGeoJSONFeature;
        private _convertGeometryToGeoJSON;
        private _convertPointGeometry;
        private _convertLineGeometry;
        private _convertPolygonGeometry;
        private _isRingClockwise;
    }

    /**
     * Water paint configuration.
     * 水面样式配置
     * @category Paint
     */
    export declare interface WaterPaint extends BasePaint {
        type: 'water';
        /** 水面颜色 */
        color?: number | string;
        /** 透明度 */
        opacity?: number;
        /** 阳光方向 */
        sunDirection?: Vector3;
        /** 阳光颜色 */
        sunColor?: number | string;
        /** 波纹强度 */
        distortionScale?: number;
        /** 波纹大小 */
        size?: number;
        /** 法线贴图URL */
        normalMap: string;
        /** 是否受雾影响 */
        fog?: boolean;
    }

    /**
     * Water paint union type.
     * 水面样式联合类型
     * @category Paint
     */
    export declare type WaterPaintUnion = SimpleWaterPaint | WaterPaint;

    /**
     * Web 图像加载器
     * @class WebImageLoader
     * @description 加载标准 XYZ 瓦片图像 (PNG, JPG, etc.)
     */
    export declare class WebImageLoader extends AbstractMaterialLoader {
        readonly info: {
            version: string;
            description: string;
        };
        readonly dataType = "image";
        private loader;
        /**
         * 执行加载
         * @param url
         * @param context
         */
        protected performLoad(url: string, context: SourceLoadContext): Promise<Texture>;
        /**
         * 提取子图像
         * @param image
         * @param bounds
         */
        private extractSubImage;
    }

    /**
     * WMTS标准瓦片数据源
     * @description 实现OGC WMTS 1.0.0标准的瓦片数据源
     * @extends TileSource
     */
    export declare class WMTSSource extends TileSource {
        /**
         * 最小缩放级别
         * @default 2
         */
        minLevel: number;
        /**
         * 最大缩放级别
         * @default 24
         */
        maxLevel: number;
        /**
         * 构造函数
         * @param options 配置选项
         */
        constructor(options: WMTSSourceOptions);
        /**
         * 获取瓦片URL
         * @param x 瓦片X坐标（瓦片列号）
         * @param y 瓦片Y坐标（瓦片行号）
         * @param z 缩放级别（瓦片矩阵级别）
         * @returns 完整的瓦片请求URL
         *
         * @description
         * 根据WMTS规范生成瓦片请求URL，自动处理：
         * - 坐标轴朝向（TMS/Y轴反向）
         * - 变量替换（支持多种WMTS参数命名）
         *
         * 支持的URL模板变量：
         * - {x}: 瓦片X坐标
         * - {y}: 瓦片Y坐标（自动处理TMS反转）
         * - {z}: 缩放级别
         * - {tileMatrix}: 瓦片矩阵级别
         * - {tileRow}: 瓦片行号（自动处理TMS反转）
         * - {tileCol}: 瓦片列号
         */
        getUrl(x: number, y: number, z: number): string;
    }

    /**
     * WMTS数据源配置选项
     * @extends SourceOptions
     */
    export declare type WMTSSourceOptions = SourceOptions & {
        /**
         * 完整的WMTS请求URL模板
         * @description
         * 必须包含{x}{y}{z}或等效参数
         * 支持变量：
         * - {x}: 瓦片X坐标
         * - {y}: 瓦片Y坐标
         * - {z}: 缩放级别
         * - {tileMatrix}: 瓦片矩阵级别（同z）
         * - {tileRow}: 瓦片行号（同y）
         * - {tileCol}: 瓦片列号（同x）
         */
        urlTemplate: string;
        /**
         * 是否使用TMS坐标轴朝向
         * @default false
         * @description
         * true表示Y轴从下往上递增（TMS规范）
         * false表示Y轴从上往下递增（WMTS默认）
         */
        isTMS?: boolean;
    };

    /**
     * WMTS Tile Layer.
     * WMTS瓦片图层
     *
     * @description
     * Layer specialized for WMTS (Web Map Tile Service) services.
     * 专门用于WMTS服务的图层。
     * @category Layer
     */
    export declare class WMTSTileLayer extends RasterTileLayer {
        /**
         * Layer type identifier.
         * 图层类型标识符。
         * @readonly
         */
        readonly layerType: string;
        private _layerName;
        private _style;
        private _matrixSet;
        /**
         * Create a new WMTSTileLayer instance.
         * 创建一个新的 WMTSTileLayer 实例。
         *
         * @param id Unique layer identifier. 图层唯一标识符。
         * @param options Layer configuration options. 图层配置选项。
         */
        constructor(id: string, options: WMTSTileLayerOptions);
        /**
         * Get WMTS layer name.
         * 获取WMTS图层名称。
         */
        get layerName(): string;
        /**
         * Get WMTS style.
         * 获取WMTS样式。
         */
        get style(): string;
        /**
         * Get WMTS matrix set.
         * 获取WMTS矩阵集。
         */
        get matrixSet(): string;
        /**
         * Create tile loader.
         * 创建瓦片加载器。
         *
         * @returns {ICompositeLoader} The created tile loader. 创建的瓦片加载器。
         * @protected
         */
        protected createLoader(): ICompositeLoader;
        /**
         * Update layer.
         * 更新图层。
         *
         * @param camera The camera used for rendering. 用于渲染的相机。
         */
        update(camera: Camera): void;
    }

    /**
     * WMTS Tile Layer configuration interface.
     * WMTS瓦片图层配置接口
     *
     * @description
     * Configuration options for creating a WMTSTileLayer.
     * 用于创建 WMTSTileLayer 的配置选项。
     * @category Layer
     */
    export declare interface WMTSTileLayerOptions extends RasterTileLayerOptions {
        /**
         * WMTS Layer Name (e.g., 'landsat8').
         * WMTS 图层名称（例如 'landsat8'）。
         */
        layerName: string;
        /**
         * WMTS Style (e.g., 'default').
         * WMTS 样式（例如 'default'）。
         * @default 'default'
         */
        style?: string;
        /**
         * WMTS Matrix Set (e.g., 'EPSG:3857').
         * WMTS 矩阵集（例如 'EPSG:3857'）。
         * @default 'GoogleMapsCompatible'
         */
        matrixSet?: string;
    }

    export { }
