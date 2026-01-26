/**
 * @module Viewer
 */
import {
  AmbientLight,
  BaseEvent,
  Clock,
  Color,
  DirectionalLight,
  EventDispatcher,
  FogExp2,
  MathUtils,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  CubeTextureLoader,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  FloatType,
  Object3D,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  CameraHelper,
  CubicBezierCurve3,
  SRGBColorSpace,
  Vector2,
  WebGLRenderTarget,
  RGBAFormat,
} from "three";
import Stats from "three/addons/libs/stats.module.js";
import {
  MapControls,
  RGBELoader,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
} from "three-stdlib";
import {
  Easing,
  Tween,
  update as teweenUpdate,
} from "three/examples/jsm/libs/tween.module.js";
import { Clouds } from "@pmndrs/vanilla";
import { mapValue } from "../utils/validate";
import type { Map } from "../map";
import { Coordinate } from "../types";
import { BaseMixin, EventMixin } from "../core/mixins";
/**
 * Viewer event mapping interface
 * Viewer事件映射接口
 * @extends Object3DEventMap
 * @category Viewer
 */
export interface ViewerEventMap extends Object3DEventMap {
  /** Update event, including time delta 更新事件，包含时间增量 */
  update: BaseEvent & { delta: number };
}

/**
 * Viewer configuration options
 * Viewer配置选项
 * @category Viewer
 */
export type ViewerOptions = {
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
  map?: Map;
  /**
   * Camera azimuth angle (in radians, optional)
   * 相机方位角（弧度制，可选）
   * 0 = looking North from South, Math.PI / 2 = looking East from West
   * 0 = 从南看北，Math.PI / 2 = 从西看东
   */
  azimuthAngle?: number;

  /**
   * Camera polar angle (in radians, optional)
   * 相机俯仰角（弧度制，可选）
   * 0 = top-down view, Math.PI / 2 = horizontal
   * 0 = 正上方俯视，Math.PI / 2 = 水平
   */
  polarAngle?: number;

  /**
   * Azimuth angle (in degrees, optional)
   * 方位角（角度制，可选）
   * 0 = looking North from South, 90 = looking East from West
   * 0 = 从南看北，90 = 从西看东
   */
  azimuthDeg?: number;

  /**
   * Polar angle (in degrees, optional)
   * 俯仰角（角度制，可选）
   * 0 = top-down view, 90 = horizontal
   * 0 = 正上方俯视，90 = 水平
   */
  polarDeg?: number;

  /** Bloom post-processing configuration (optional) Bloom 后处理配置（可选） */
  bloom?: {
    enabled?: boolean; // Whether to enable Bloom post-processing 是否启用 Bloom 后处理
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
};

/**
 * flyTo method parameters interface
 * flyTo方法参数接口
 * @category Viewer
 */
export interface FlyToOptions {
  /** Longitude and latitude 经纬度 */
  center: Coordinate;
  /** Camera coordinates 相机 */
  cameraCoord: Coordinate;
  duration?: number;
  delay?: number;
  complete?: () => void;
  /** Whether to use curved path (default is straight line) 是否使用曲线路径飞行（默认直线） */
  curvePath?: boolean;
}

// Configuration options interface for camera flying to a specific coordinate point
// 相机飞向指定坐标点的配置选项接口
export interface FlyToPointOptions {
  // Target coordinate point (required) 目标坐标点（必需参数）
  center: Coordinate;

  // Flight animation duration, usually in milliseconds (optional) 飞行动画持续时间，单位通常为毫秒（可选）
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

  // Camera polar angle (angle with horizontal plane), usually in radians (optional)
  // 相机俯仰角（与水平面的夹角），单位通常为弧度（可选）
  // Example: 0 means horizontal, Math.PI / 2 means vertical down
  // 例如：0 表示水平，Math.PI / 2 表示垂直向下
  polarAngle?: number;

  // Camera azimuth angle (horizontal angle), in radians (optional)
  // 相机方位角（水平方向的角度），单位为弧度（可选）
  // Example: 0 means South to North, Math.PI / 2 means West to East
  // 例如：0 表示从南向北，Math.PI / 2 表示从西向东
  azimuthAngle?: number;

  // In degrees 角度制
  polarDeg?: number; // 0 = top-down view, 90 = horizontal 0 = 正上方俯视, 90 = 水平
  azimuthDeg?: number; // 0 = South to North, 90 = West to East 0 = 从南看北, 90 = 从西看东

  // Callback function when flight animation completes (optional) 飞行动画完成时的回调函数（可选）
  complete?: () => void;

  // Whether to use curved path (optional) 是否使用曲线路径飞行（可选）
  // true: Use curved path, smoother trajectory true: 使用曲线路径，飞行轨迹更平滑
  // false: Use straight line path false: 使用直线路径
  curvePath?: boolean;
}

// Create mixin base class, add generic parameter 创建混入基类，添加泛型参数
const ViewerBase = EventMixin(BaseMixin(EventDispatcher<ViewerEventMap>));

/**
 * Three.js scene initialization class
 * Three.js场景初始化类
 * @extends EventDispatcher<ViewerEventMap>
 * @category Viewer
 */
export class Viewer extends ViewerBase {
  /** Scene object 场景对象 */
  public readonly scene: Scene;
  /** WebGL renderer WebGL渲染器 */
  public readonly renderer: WebGLRenderer;
  /** Perspective camera 透视相机 */
  public readonly camera: PerspectiveCamera;
  /** Map controls 地图控制器 */
  public readonly controls: MapControls;
  /** Ambient light 环境光 */
  public readonly ambLight: AmbientLight;
  /** Directional light 平行光 */
  public readonly dirLight: DirectionalLight;
  /** 辅助平行光 (补光) */
  // public readonly auxDirLight: DirectionalLight;
  /** 云层效果 */
  public clouds: Clouds | null = null;
  /** 容器元素 */
  public container?: HTMLElement;
  /** 内部时钟 */
  private readonly _clock: Clock = new Clock();
  /** 性能统计器 */
  // @ts-ignore
  private stats: Stats;
  /** 动画回调集合 */
  private _animationCallbacks: Set<
    (delta: number, elapsedtime: number, context: Viewer) => void
  > = new Set();
  /** 雾效因子 */
  private _fogFactor = 1.0;
  private _sceneSize = 50000 * 2;
  /** 地面网格 */
  private _defaultGround: Mesh;
  /** 地图实例 */
  public map: Map;
  public centerWorldPos: Vector3;
  private _isInteracting = false;
  /** 是否启用调试模式 */
  private debug = false;
  private flyTween: Tween<any> | null = null;

  /** 后期处理：bloom 管线 */
  private composer?: EffectComposer;
  private renderPass?: RenderPass;
  private bloomPass?: UnrealBloomPass;

  /**
   * 获取雾效因子
   */
  public get fogFactor() {
    return this._fogFactor;
  }

  public get isInteracting() {
    return this._isInteracting;
  }

  /**
   * 设置雾效因子（默认1）
   */
  public set fogFactor(value) {
    this._fogFactor = value;
    this.controls.dispatchEvent({
      type: "change",
      target: this.controls,
    });
  }

  /**
   * 获取容器宽度
   */
  public get width() {
    return this.container?.clientWidth || 0;
  }

  /**
   * 获取容器高度
   */
  public get height() {
    return this.container?.clientHeight || 0;
  }

  /**
   * 构造函数
   * @param container 容器元素或选择器字符串
   * @param options 配置选项
   */
  constructor(container?: HTMLElement | string, options: ViewerOptions = {}) {
    super();

    // 手动设置 options
    this.setOptions(options);

    const {
      antialias = false,
      stencil = true,
      logarithmicDepthBuffer = true,
      skybox,
      map,
      bloom,
      minDistance,
      maxDistance,
      draggable = true,
    } = options;
    this.map = map as Map;
    this.centerWorldPos = this.map.projectToWorld(
      new Vector3(this.map.center[0], this.map.center[1], 0),
    );
    this.renderer = this._createRenderer(
      antialias,
      stencil,
      logarithmicDepthBuffer,
    );
    this.scene = this._createScene(skybox);
    this.camera = this._createCamera();
    if (container) {
      this.addTo(container);
    }
    this.controls = this._createControls(minDistance, maxDistance);
    // 初始化 draggable 状态
    this.controls.enabled = draggable !== false;
    this.ambLight = this._createAmbLight();
    this.scene.add(this.ambLight);
    this.dirLight = this._createDirLight();
    this.scene.add(this.dirLight);
    this.scene.add(this.dirLight.target);
    // 创建并添加辅助光
    // this.auxDirLight = this._createAuxDirLight();
    // this.scene.add(this.auxDirLight);
    // this.scene.add(this.auxDirLight.target);
    // 创建并添加头光
    // this.headlight = this._createHeadlight();
    // this.scene.add(this.headlight);
    // this.scene.add(this.headlight.target);

    this._defaultGround = this._createDefaultGround();
    this.scene.add(this._defaultGround);

    // 初始化 bloom 管线：普通渲染 + UnrealBloomPass
    if (bloom && bloom.enabled) {
      const pixelRatio = this.renderer.getPixelRatio();
      const width = this.container ? this.width : window.innerWidth;
      const height = this.container ? this.height : window.innerHeight;
      const rtWidth = width * pixelRatio;
      const rtHeight = height * pixelRatio;

      // 使用 WebGLRenderTarget，并通过 samples 开启 MSAA（WebGL2 下生效）
      const renderTarget = new WebGLRenderTarget(rtWidth, rtHeight, {
        format: RGBAFormat,
      });
      // three r171 支持在 WebGLRenderTarget 上直接设置 samples
      (renderTarget as any).samples = 4; // 4x MSAA，必要时可调成 2

      this.composer = new EffectComposer(this.renderer, renderTarget);
      this.renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);

      const bloomStrength = bloom?.strength ?? 1.5;
      const bloomRadius = bloom?.radius ?? 1.0;
      const bloomThreshold = bloom?.threshold ?? 0.7;

      this.bloomPass = new UnrealBloomPass(
        new Vector2(rtWidth, rtHeight),
        bloomStrength,
        bloomRadius,
        bloomThreshold,
      );
      this.composer.addPass(this.bloomPass);
    }

    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.debug = options.debug || false;
    this.flyTween = null;
    if (this.debug) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  /**
   * Add renderer to container
   * 将渲染器添加到容器
   * @param container Container element or selector string 容器元素或选择器字符串
   * @returns this
   */
  public addTo(container: HTMLElement | string) {
    let el: HTMLElement | null = null;
    if (typeof container === "string") {
      el =
        document.getElementById(container) || document.querySelector(container);
    } else {
      el = container;
    }

    if (el instanceof HTMLElement) {
      this.container = el;
      el.appendChild(this.renderer.domElement);
      new ResizeObserver(this.resize.bind(this)).observe(el);
    } else {
      throw `${container} not found!`;
    }
    return this;
  }

  /**
   * Create scene
   * 创建场景
   * @param skyboxConfig Skybox configuration 天空盒配置
   * @returns Scene object 场景对象
   */
  private _createScene(skyboxConfig?: ViewerOptions["skybox"]) {
    const scene = new Scene();
    const backColor = skyboxConfig?.defaultColor || "rgb(21,48,94)";
    scene.background = new Color(backColor);
    scene.fog = new FogExp2(backColor, 0.0002);

    if (skyboxConfig?.files) {
      const loader = new CubeTextureLoader();

      if (skyboxConfig.path) {
        loader.setPath(skyboxConfig.path);
      }

      loader.load(
        skyboxConfig.files,
        (texture) => {
          // texture.colorSpace = SRGBColorSpace;
          scene.background = texture;
          // scene.environment = texture;
        },
        undefined,
        (error) => {
          console.error("Error loading skybox:", error);
          scene.background = new Color(backColor);
        },
      );
    } else if (skyboxConfig?.hdr) {
      this._loadHDRWithPMREM(scene, skyboxConfig);
    }
    return scene;
  }

  /**
   * 使用PMREM加载HDR环境贴图
   * @param scene 场景对象
   * @param skyboxConfig 天空盒配置
   */
  private async _loadHDRWithPMREM(
    scene: Scene,
    skyboxConfig: ViewerOptions["skybox"],
  ) {
    try {
      if (skyboxConfig) {
        const hdrLoader = new RGBELoader()
          .setPath(skyboxConfig.path || "")
          .setDataType(FloatType);

        const hdrTexture = await hdrLoader.loadAsync(skyboxConfig.hdr!);
        // hdrTexture.intensity = skyboxConfig.hdrIntensity || 1.0;
        // hdrTexture.intensity
        // 设置HDR纹理
        hdrTexture.colorSpace = this.renderer.outputColorSpace;
        hdrTexture.mapping = 303;
        hdrTexture.needsUpdate = true;

        // 关键：设置为场景的环境贴图
        this.scene.environment = hdrTexture;

        // 可选：同时作为背景显示
        this.scene.background = hdrTexture;
        // scene.environmentIntensity = 0.000001; // 默认值 1.0

        // 控制环境光强度 - 这里控制HDR亮度
        // this.scene.environmentIntensity = 0.00001;
        // 控制背景亮度（如果需要独立控制）
        this.scene.backgroundIntensity = 1.1;
        // hdrTexture.dispose();
      }
    } catch (error) {
      console.error("加载HDR失败:", error);
      scene.background = new Color(skyboxConfig?.defaultColor || 0xdbf0ff);
    }
  }

  /**
   * 创建WebGL渲染器
   * @param antialias 是否抗锯齿
   * @param stencil 是否使用模板缓冲区
   * @param logarithmicDepthBuffer 是否使用对数深度缓冲区
   * @returns 渲染器对象
   */
  private _createRenderer(
    antialias: boolean,
    stencil: boolean,
    logarithmicDepthBuffer: boolean,
  ) {
    const renderer = new WebGLRenderer({
      antialias,
      logarithmicDepthBuffer,
      stencil,
      alpha: true,
      precision: "highp",
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: true,
    });

    // const renderer = new WebGLRenderer({
    //     antialias: true, // 开启抗锯齿,
    //     logarithmicDepthBuffer: true, // 防闪烁
    //     alpha: true,
    //     precision: "highp",
    // });

    renderer.debug.checkShaderErrors = true;
    // renderer.physicallyCorrectLights = true;

    renderer.sortObjects = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.tabIndex = 0;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.needsUpdate = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = SRGBColorSpace;
    // renderer.outputColorSpace = "srgb-linear";
    // renderer.outputEncoding = LinearEncoding;

    // if (renderer.capabilities.isWebGL2) {
    //     const gl = renderer.getContext();
    //     gl.getExtension('EXT_color_buffer_float');
    //     gl.getExtension('OES_texture_float_linear');
    // }
    return renderer;
  }

  /**
   * Create camera
   * 创建相机
   * @returns Camera object 相机对象
   */
  private _createCamera() {
    // const camera = new PerspectiveCamera(70, 1, 100, 5e4);
    // camera.position.set(0, 3e4 * 1000, 0);

    // return camera;

    // dt
    const camera = new PerspectiveCamera(
      45,
      this.getAspect(),
      0.1,
      this._sceneSize * 2,
    );
    return camera;

    // 创建正交相机消除透视变形
    // const orthoCamera = new OrthographicCamera(
    //     -window.innerWidth / 2,   // left
    //     window.innerWidth / 2,    // right
    //     window.innerHeight / 2,   // top
    //     -window.innerHeight / 2,  // bottom
    //     0.1,                     // near
    //     1000000                   // far
    // );

    // return orthoCamera;

    // 保持原有相机位置
    // orthoCamera.position.copy(this.viewer.camera.position);
    // orthoCamera.lookAt(this.viewer.controls.target);
  }

  /**
   * Create map controls
   * 创建地图控制器
   * @param minDistance Minimum zoom distance 最小缩放距离
   * @param maxDistance Maximum zoom distance 最大缩放距离
   * @returns Controls object 控制器对象
   */
  private _createControls(minDistance?: number, maxDistance?: number) {
    const controls = new MapControls(this.camera, this.renderer.domElement);
    const MAX_POLAR_ANGLE = Math.PI / 2.1;

    // controls.target.set(0, 0, -3e3);
    controls.screenSpacePanning = false;
    controls.minDistance = minDistance ?? 0.1;
    controls.maxDistance = maxDistance ?? 60000;
    controls.maxPolarAngle = MAX_POLAR_ANGLE;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.keyPanSpeed = 1;

    controls.listenToKeyEvents(this.renderer.domElement);

    controls.addEventListener("change", () => {
      const polar = Math.max(controls.getPolarAngle(), 0.1);
      const dist = Math.max(controls.getDistance(), 100);

      controls.zoomSpeed = Math.max(Math.log(dist / 1e3), 1) + 3;
      const maxFar = 300000 * 2;
      if (controls.maxDistance > maxFar * 0.95)
        controls.maxDistance = maxFar * 0.95;
      this.camera.far = MathUtils.clamp((dist / polar) * 8, 100, maxFar);
      this.camera.near = MathUtils.clamp(this.camera.far / 1e3, 0.001, 1);

      this.camera.updateProjectionMatrix();

      if (this.scene.fog instanceof FogExp2) {
        // this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.375;
        this.scene.fog.density = (polar / (dist + 5)) * this.fogFactor * 0.1;
      }

      const DIST_THRESHOLD = 60000;
      const isDistAboveThreshold = dist > DIST_THRESHOLD;
      controls.minAzimuthAngle = isDistAboveThreshold ? 0 : -Infinity;
      controls.maxAzimuthAngle = isDistAboveThreshold ? 0 : Infinity;

      // const POLAR_BASE = 1e7;
      // const POLAR_EXPONENT = 4;
      // controls.maxPolarAngle = Math.min(Math.pow(POLAR_BASE / dist, POLAR_EXPONENT), MAX_POLAR_ANGLE);
      controls.maxPolarAngle = mapValue(
        controls.getDistance(),
        0,
        70000,
        MAX_POLAR_ANGLE,
        0,
      );
      // 此处绑定map的事件
      // console.log(this.map,'我的map ----------------- ')
      this.map?.trigger("control-change", {
        type: "control-change",
        control: controls,
        camera: this.camera,
        target: this.map,
      });
    });

    // 注册控制器开始事件
    controls.addEventListener("start", () => {
      this._isInteracting = true;
      this.map?.trigger("control-start", {
        type: "control-start",
        control: controls,
        camera: this.camera,
        target: this.map,
      });
    });

    // 注册控制器开始事件
    controls.addEventListener("end", () => {
      this._isInteracting = false;
      this.map?.trigger("control-end", {
        type: "control-end",
        control: controls,
        camera: this.camera,
        target: this.map,
      });
    });
    return controls;
  }

  /**
   * Create ambient light
   * 创建环境光
   * @returns Ambient light object 环境光对象
   */
  private _createAmbLight() {
    const ambLight = new AmbientLight(0xffffff, 2);
    return ambLight;
  }

  /**
   * 创建平行光
   * @returns 平行光对象
   */
  private _createDirLight() {
    const x = 1.2;
    const y = 2;
    const z = 1;
    const size = 55000;
    const mapSize = 10;
    const near = 1;
    const far = size * 3.5;
    const radius = 1;
    const bias = -0.0001 * 0;
    const intensity = 10;
    const dirLight = new DirectionalLight("rgba(248, 167, 16, 1)", intensity);
    dirLight.position.set(
      this.centerWorldPos.x + size * x,
      size * y,
      this.centerWorldPos.z + size * z,
    );
    const targetObject = new Object3D();
    targetObject.position.copy(this.centerWorldPos);
    this.scene.add(targetObject);
    dirLight.target = targetObject;
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024 * mapSize;
    dirLight.shadow.mapSize.height = 1024 * mapSize;
    dirLight.shadow.camera.near = near;
    dirLight.shadow.camera.far = far;
    dirLight.shadow.camera.left = -size;
    dirLight.shadow.camera.bottom = -size;
    dirLight.shadow.camera.top = size;
    dirLight.shadow.camera.right = size;
    dirLight.shadow.radius = radius;
    dirLight.shadow.bias = bias;

    if (this.debug) {
      const cameraHelper = new CameraHelper(dirLight.shadow.camera);
      cameraHelper.name = "dirLightCameraHelper";
      this.scene.add(cameraHelper);
    }

    return dirLight;
  }

  /**
   * 创建三个辅助平行光 (后补光、左侧光、右侧光)，指向场景中心。
   * @returns 返回后补光实例 (匹配 this.auxDirLight 属性)
   * @internal Reserved for future use
   */
  // @ts-ignore - Reserved method for auxiliary light creation
  private _createAuxDirLight(): DirectionalLight {
    const size = 55000;
    const intensity = 0.5; // 辅助光强度

    // ----------------------------------------------------
    // Aux Light 1 (后补光 / Back Fill - 与主光(1.2, 1)对向)
    // ----------------------------------------------------
    const x1 = -1.2;
    const z1 = -1;
    const y1 = 1.5;
    const auxLight1 = this._createAuxLightInstance(
      this.centerWorldPos.x + size * x1,
      size * y1,
      this.centerWorldPos.z + size * z1,
      intensity,
    );
    auxLight1.name = "AuxDirLight_BackFill";
    this.scene.add(auxLight1);
    this.scene.add(auxLight1.target); // 目标点已在 _createAuxLightInstance 中添加，这里是多余的，但保留以防万一

    // ----------------------------------------------------
    // Aux Light 2 (左侧光 / Left Rim - 与主光近似垂直)
    // ----------------------------------------------------
    const x2 = -1.0;
    const z2 = 1.2;
    const y2 = 1.5;
    const auxLight2 = this._createAuxLightInstance(
      this.centerWorldPos.x + size * x2,
      size * y2,
      this.centerWorldPos.z + size * z2,
      intensity,
    );
    auxLight2.name = "AuxDirLight_LeftRim";
    this.scene.add(auxLight2);
    this.scene.add(auxLight2.target);

    // ----------------------------------------------------
    // Aux Light 3 (右侧光 / Right Rim - 与左侧光对向)
    // ----------------------------------------------------
    const x3 = 1.0;
    const z3 = -1.2;
    // const y3 = 1.5;
    const auxLight3 = this._createAuxLightInstance(
      this.centerWorldPos.x + size * x3,
      size * y1,
      this.centerWorldPos.z + size * z3,
      intensity,
    );
    auxLight3.name = "AuxDirLight_RightRim";
    this.scene.add(auxLight3);
    this.scene.add(auxLight3.target);

    // 返回第一个辅助光实例，以匹配 this.auxDirLight 属性
    return auxLight1;
  }
  /**
   * Create a single auxiliary directional light instance.
   * 创建单个辅助平行光实例。
   * @param x Light source world X coordinate 光源的世界X坐标
   * @param y Light source world Y coordinate 光源的世界Y坐标
   * @param z Light source world Z coordinate 光源的世界Z坐标
   * @param intensity Light intensity 光源强度
   * @returns DirectionalLight
   */
  private _createAuxLightInstance(
    x: number,
    y: number,
    z: number,
    intensity: number,
  ): DirectionalLight {
    const auxLight = new DirectionalLight(0xffffff, intensity);
    auxLight.position.set(x, y, z);

    // 目标点：始终指向场景中心
    const targetObject = new Object3D();
    targetObject.position.copy(this.centerWorldPos);
    this.scene.add(targetObject);
    auxLight.target = targetObject;
    auxLight.castShadow = false;
    return auxLight;
  }
  /**
   * Resize container
   * 调整容器大小
   * @returns this
   */
  public resize() {
    const width = this.width;
    const height = this.height;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    if (this.composer) {
      const pixelRatio = this.renderer.getPixelRatio();
      this.composer.setSize(width * pixelRatio, height * pixelRatio);
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    return this;
  }

  /**
   * 添加动画回调
   * @param callback 回调函数，接收deltaTime和elapsedTime参数
   * @returns 移除回调的函数
   */
  public addAnimationCallback(
    callback: (delta: number, elapsedtime: number, context: Viewer) => void,
  ): () => void {
    this._animationCallbacks.add(callback);
    return () => this._animationCallbacks.delete(callback);
  }

  /**
   * 动画循环
   */
  private animate() {
    const delta = this._clock.getDelta();
    const elapsedtime = this._clock.getElapsedTime();

    this._animationCallbacks.forEach((cb) => cb(delta, elapsedtime, this));

    this.controls.update();
    // 核心修正：在渲染前调用更新函数，同步光源位置
    // this._updateHeadlightPosition();
    // this.renderer.render(this.scene, this.camera);
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
    teweenUpdate();
    if (this.stats) {
      this.stats.update();
    }

    this.trigger("update", { delta });
  }

  /**
   * Fly to specified position
   * 飞行到指定位置
   * @param centerWorldPos Map center target position (world coordinates) 地图中心目标位置（世界坐标）
   * @param cameraWorldPos Camera target position (world coordinates) 相机目标位置（世界坐标）
   * @param animate Whether to enable animation 是否启用动画
   * @param onComplete Completion callback 完成回调
   */
  public flyTo(
    centerWorldPos: Vector3,
    cameraWorldPos: Vector3,
    animate = true,
    onComplete?: (obj: Vector3) => void,
  ) {
    this.controls.target.copy(centerWorldPos);
    if (animate) {
      const start = this.camera.position;
      new Tween(start)
        .to({ y: 2e7, z: 0 }, 500)
        .chain(
          new Tween(start)
            .to(cameraWorldPos, 2000)
            .easing(Easing.Quintic.Out)
            .onComplete((obj) => onComplete && onComplete(obj)),
        )
        .start();
    } else {
      this.camera.position.copy(cameraWorldPos);
    }
  }
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
  public flyToAdvanced(options: FlyToOptions) {
    const camera = this.camera;
    const controls = this.controls;
    const centerGeo = options.center;
    const cameraGeo = options.cameraCoord;
    const duration = options.duration ?? 2000;
    const delay = options.delay ?? 0;
    const complete = options.complete;
    const useCurvePath = !!options.curvePath;

    if (!centerGeo || !cameraGeo) return;

    const centerWorldPos = this.map.projectToWorld(
      new Vector3(centerGeo[0], centerGeo[1], 0),
    );
    const cameraWorldPos = this.map.projectToWorld(
      new Vector3(cameraGeo[0], cameraGeo[1], cameraGeo[2]),
    );

    if (!camera || !controls || !centerWorldPos || !cameraWorldPos) return;

    // 克隆目标和相机位置
    const targetStart = controls.target.clone();
    const positionStart = camera.position.clone();

    const targetEnd = new Vector3(
      centerWorldPos.x,
      centerWorldPos.y,
      centerWorldPos.z,
    );
    const positionEnd = new Vector3(
      cameraWorldPos.x,
      cameraWorldPos.y,
      cameraWorldPos.z,
    );

    // 停止之前的动画
    if (this.flyTween) {
      this.flyTween.stop();
      this.flyTween = null;
    }

    // 直线 / 曲线由 curvePath 控制，默认直线
    if (!useCurvePath) {
      const tweenObj = {
        tx: targetStart.x,
        ty: targetStart.y,
        tz: targetStart.z,
        px: positionStart.x,
        py: positionStart.y,
        pz: positionStart.z,
      };

      this.flyTween = new Tween(tweenObj)
        .to(
          {
            tx: targetEnd.x,
            ty: targetEnd.y,
            tz: targetEnd.z,
            px: positionEnd.x,
            py: positionEnd.y,
            pz: positionEnd.z,
          },
          duration,
        )
        .easing(Easing.Quadratic.InOut)
        .onUpdate(() => {
          const newTarget = new Vector3(tweenObj.tx, tweenObj.ty, tweenObj.tz);
          const newPosition = new Vector3(
            tweenObj.px,
            tweenObj.py,
            tweenObj.pz,
          );
          camera.position.copy(newPosition);
          camera.lookAt(newTarget);
          controls.target.copy(newTarget);
          controls.update();
          // 渲染交给全局 animate 中的 renderer.render
        });
    } else {
      // 曲线路径版本
      const points = [
        positionStart,
        positionStart.clone().lerp(positionEnd, 0.33),
        positionStart.clone().lerp(positionEnd, 0.67),
        positionEnd,
      ];

      const curve = new CubicBezierCurve3(...points);

      const tweenObj = {
        t: 0,
        x: targetStart.x,
        y: targetStart.y,
        z: targetStart.z,
      };

      this.flyTween = new Tween(tweenObj)
        .to(
          {
            t: 1,
            x: targetEnd.x,
            y: targetEnd.y,
            z: targetEnd.z,
          },
          duration,
        )
        .easing(Easing.Quadratic.InOut)
        .onUpdate(() => {
          const newPosition = curve.getPoint(tweenObj.t);
          const newTarget = new Vector3(tweenObj.x, tweenObj.y, tweenObj.z);
          camera.position.copy(newPosition);
          camera.lookAt(newTarget);
          camera.updateProjectionMatrix();
          controls.target.copy(newTarget);
          controls.update();
        });
    }

    if (!this.flyTween) return;

    this.flyTween.onComplete(() => {
      if (this.flyTween) {
        this.flyTween.stop();
        this.flyTween = null;
      }
      if (complete) complete();
    });

    if (delay > 0) {
      setTimeout(() => {
        if (this.flyTween) {
          this.flyTween.start();
        }
      }, delay);
    } else {
      this.flyTween.start();
    }
  }

  /**
   * Configuration update callback
   * 配置更新回调
   * Triggered when viewer.config() is called to update configuration
   * 当调用 viewer.config() 更新配置时，会触发此方法
   */
  onConfig(conf: ViewerOptions): void {
    // 处理 draggable 配置
    if ("draggable" in conf) {
      const draggable = conf.draggable;
      if (this.controls) {
        // 控制 controls 是否启用
        this.controls.enabled = draggable !== false;
      }
    }
  }

  /**
   * 飞行到指定点，自动计算相机位置
   * @param center 目标点的经纬度坐标
   * @param options 飞行选项
   */

  public flyToPoint(options: FlyToPointOptions) {
    const { controls } = this;
    const center = options.center;
    const duration = options.duration ?? 2000;

    const distance =
      typeof options.distance === "number"
        ? options.distance
        : typeof options.altitude === "number"
          ? options.altitude
          : controls.getDistance();

    // === 角度优先，弧度兜底 ===
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    // 避免极点奇异：当传入 polarDeg 且 <= 0 时，自动替换为小角度
    let polarAngle: number;
    if (typeof options.polarDeg === "number") {
      const safePolarDeg = options.polarDeg <= 0 ? 0.1 : options.polarDeg;
      polarAngle = toRad(safePolarDeg);
    } else if (typeof options.polarAngle === "number") {
      // 如果传的是弧度，也做极点保护
      polarAngle = options.polarAngle <= 0 ? toRad(0.1) : options.polarAngle;
    } else {
      polarAngle = controls.getPolarAngle();
    }

    const azimuthAngle =
      typeof options.azimuthDeg === "number"
        ? toRad(options.azimuthDeg)
        : options.azimuthAngle || controls.getAzimuthalAngle();

    const complete = options.complete;
    const useCurvePath = !!options.curvePath;

    const targetWorld = this.map.projectToWorld(
      new Vector3(center[0], center[1], 0),
    );
    const newCameraPosition = this.calculateCameraPosition(
      targetWorld,
      distance,
      polarAngle,
      azimuthAngle,
    );
    // const minHeight = distance * 0.5;
    // if (newCameraPosition.y < minHeight) newCameraPosition.y = minHeight;

    const newCameraGeo = this.map.unprojectFromWorld(newCameraPosition);

    this.flyToAdvanced({
      center: [center[0], center[1], 0],
      cameraCoord: [newCameraGeo.x, newCameraGeo.y, newCameraGeo.z || 0],
      duration,
      complete,
      curvePath: useCurvePath,
    });
  }

  /**
   * 计算相机在世界坐标系中的位置
   * @param target 目标点（世界坐标）
   * @param distance 相机到目标的距离
   * @param polarAngle 极角（与垂直方向的夹角，0=垂直向下，Math.PI/2=水平）
   * @param azimuthAngle 方位角（0=从南向北，Math.PI/2=从西向东）
   * @returns 相机位置（世界坐标）
   */
  public calculateCameraPosition = (
    target: Vector3,
    distance: number,
    polarAngle: number,
    azimuthAngle: number,
  ): Vector3 => {
    // 直接使用旋转矩阵
    // 先计算相机在默认位置（目标的南边，+Z 方向）
    const defaultOffset = new Vector3(
      0, // X分量
      distance * Math.cos(polarAngle), // Y分量
      distance * Math.sin(polarAngle), // Z分量  <-- 这里改成正号
    );

    // 绕Y轴旋转方位角
    // 注意：Three.js的applyAxisAngle是右手法则，逆时针为正
    defaultOffset.applyAxisAngle(new Vector3(0, 1, 0), azimuthAngle);

    return new Vector3(
      target.x + defaultOffset.x,
      target.y + defaultOffset.y,
      target.z + defaultOffset.z,
    );
  };

  /**
   * Get current scene state
   * 获取当前场景状态
   * @returns Object containing center position and camera position 包含中心位置和相机位置的对象
   */
  public getState() {
    return {
      centerPosition: this.controls.target,
      cameraPosition: this.camera.position,
    };
  }

  /**
   * Bind map instance
   * 绑定地图实例
   * @param map Map instance 地图实例
   *
   * @protected
   */
  _bindMap(map: Map) {
    if (!map) return;

    this.map = map;
  }
  /**
   * Get associated map instance
   * 获取关联的地图实例
   * @returns Map instance or null 地图实例或null
   */
  getMap() {
    if (this.map) {
      return this.map;
    }
    return null;
  }

  // dt的方法

  /**
   * Get current browser window aspect ratio.
   * 获取当前浏览器窗口的宽高比（aspect ratio）。
   * @returns {number} Aspect ratio (width / height), e.g., returns ~1.777 for 16:9 screen. 宽高比（width / height），例如 16:9 的屏幕返回 ~1.777。
   */
  getAspect() {
    // 调用 getWidthHeight() 获取窗口的宽度和高度
    const [width, height] = this.getWidthHeight();
    // 计算并返回宽高比（宽度 ÷ 高度）
    return width / height;
  }

  /**
   * 获取当前浏览器窗口的实际宽度和高度（视口尺寸）。
   * @returns {Array<number>} 包含宽度和高度的数组 [width, height]，单位是像素。
   */
  getWidthHeight() {
    // window.innerWidth：浏览器视口的宽度（包括滚动条，单位：px）
    let width = window.innerWidth;
    // window.innerHeight：浏览器视口的高度（包括滚动条，单位：px）
    let height = window.innerHeight;
    // 返回 [width, height] 数组
    return [width, height];
  }

  /**
   * Create the default ground plane.
   * 创建默认地面平面
   * 
   * @description
   * Creates a large ground plane mesh that serves as a visual base when no tile layers are present.
   * The ground is positioned at y=0 and centered at the map center.
   * 创建一个大型地面网格，当没有瓦片图层时作为视觉基底。
   * 地面位于 y=0 并以地图中心为中心。
   * 
   * @returns Ground mesh. 地面网格
   * @internal
   */
  private _createDefaultGround(): Mesh {
    const centerWorldPos = this.centerWorldPos;
    const material = new MeshStandardMaterial({
      transparent: false,
      color: new Color("rgb(45,52,60)").multiplyScalar(0.7),
      metalness: 0.2,
      roughness: 1.0,
    });
    const geometry = new PlaneGeometry(
      this._sceneSize * 2,
      this._sceneSize * 2,
    );
    const mesh = new Mesh(geometry, material);
    mesh.name = "DefaultGround";
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.position.y = 0;
    mesh.position.add(centerWorldPos);
    mesh.rotateX(-Math.PI / 2);
    mesh.visible = false;
    return mesh;
  }

  /**
   * Show the default ground plane.
   * 显示默认地面平面
   * 
   * @description
   * Makes the default ground plane visible. This is typically called automatically
   * when no tile layers are present in the map.
   * 使默认地面平面可见。通常在地图中没有瓦片图层时自动调用。
   */
  public showDefaultGround(): void {
    if (this._defaultGround) {
      this._defaultGround.visible = true;
    }
  }

  /**
   * Update the default ground plane position.
   * 更新默认地面平面位置
   * 
   * @description
   * Recalculates and updates the ground plane position based on current map center.
   * This should be called after the map's root group transformation is finalized.
   * 根据当前地图中心重新计算并更新地面位置。
   * 应在地图根组变换完成后调用。
   * 
   * @internal
   */
  public _updateDefaultGroundPosition(): void {
    if (!this._defaultGround || !this.map) {
      return;
    }
    
    // Recalculate centerWorldPos with the properly transformed rootGroup
    // 使用正确变换后的 rootGroup 重新计算 centerWorldPos
    const newCenterWorldPos = this.map.projectToWorld(
      new Vector3(this.map.center[0], this.map.center[1], 0),
    );
    this.centerWorldPos = newCenterWorldPos;
    
    // Reset ground position
    // 重置地面位置
    this._defaultGround.position.set(0, 0, 0);
    this._defaultGround.position.add(newCenterWorldPos);
  }

  /**
   * Hide the default ground plane.
   * 隐藏默认地面平面
   * 
   * @description
   * Hides the default ground plane. This is typically called automatically
   * when tile layers are added to the map.
   * 隐藏默认地面平面。通常在向地图添加瓦片图层时自动调用。
   */
  public hideDefaultGround(): void {
    if (this._defaultGround) {
      this._defaultGround.visible = false;
    }
  }

  /**
   * Check if the default ground plane is visible.
   * 检查默认地面平面是否可见
   * 
   * @returns Whether the ground is visible. 地面是否可见
   */
  public isDefaultGroundVisible(): boolean {
    return this._defaultGround?.visible ?? false;
  }

  /**
   * 销毁viewer实例，释放所有资源
   * @description
   * 该方法会清理以下资源：
   * 1. 停止动画循环
   * 2. 销毁控制器
   * 3. 清理场景中的所有对象
   * 4. 销毁渲染器
   * 5. 销毁后期处理器
   * 6. 移除DOM元素
   */
  public destroy(): void {
    // console.log('🗑️ 开始销毁Viewer实例...');

    try {
      // 1. 停止动画循环
      this.renderer.setAnimationLoop(null);
      // console.log('✅ 动画循环已停止');

      // 2. 清理动画回调
      this._animationCallbacks.clear();
      // console.log('✅ 动画回调已清理');

      // 3. 断开map引用，避免控制器事件触发map方法
      // @ts-ignore
      this.map = null;
      // console.log('✅ Map引用已断开');

      // 4. 销毁控制器
      if (this.controls) {
        this.controls.dispose();
        // console.log('✅ 控制器已销毁');
      }

      // 5. 清理场景中的所有对象
      if (this.scene) {
        this.scene.traverse((object: any) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => {
                this._disposeMaterial(material);
              });
            } else {
              this._disposeMaterial(object.material);
            }
          }
        });
        this.scene.clear();
        // console.log('✅ 场景已清理');
      }

      // 6. 销毁后期处理器
      if (this.composer) {
        if (this.bloomPass) {
          this.bloomPass.dispose?.();
        }
        if (this.renderPass) {
          this.renderPass.dispose?.();
        }
        // @ts-ignore
        this.composer = null;
        // @ts-ignore
        this.renderPass = null;
        // @ts-ignore
        this.bloomPass = null;
        // console.log('✅ 后期处理器已销毁');
      }

      // 7. 销毁渲染器
      if (this.renderer) {
        this.renderer.dispose();
        if (
          this.container &&
          this.renderer.domElement.parentNode === this.container
        ) {
          this.container.removeChild(this.renderer.domElement);
        }
        // console.log('✅ 渲染器已销毁');
      }

      // 8. 清理stats
      if (this.stats && this.stats.dom.parentNode) {
        this.stats.dom.parentNode.removeChild(this.stats.dom);
        // console.log('✅ Stats已移除');
      }

      // console.log('✅ Viewer实例销毁完成');
    } catch (error) {
      console.error("❌ 销毁Viewer时出错:", error);
    }
  }

  /**
   * Dispose material resources
   * 销毁材质资源
   * @param material Material to dispose 要销毁的材质
   */
  private _disposeMaterial(material: any): void {
    if (!material) return;

    // 销毁材质的所有纹理
    const textures = [
      "map",
      "lightMap",
      "bumpMap",
      "normalMap",
      "specularMap",
      "envMap",
      "alphaMap",
      "aoMap",
      "displacementMap",
      "emissiveMap",
      "gradientMap",
      "metalnessMap",
      "roughnessMap",
    ];

    textures.forEach((texName) => {
      if (material[texName]) {
        material[texName].dispose();
      }
    });

    material.dispose();
  }
}
