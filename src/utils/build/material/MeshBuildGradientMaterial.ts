import * as THREE from 'three';
/** 区域蒙版最多支持的顶点数（可以按需调大） */
const REGION_OVERLAY_MAX_VERTS = 64;
/**
 * 着色器效果配置选项
 */
interface ShaderEffectOptions {
  /**
   * 圆环扩散效果配置
   * @property enabled 是否启用效果
   * @property color 圆环颜色
   * @property width 圆环宽度（单位：米）
   * @property speed 扩散速度（单位：米/秒）
   * @property maxDistance 最大扩散距离（单位：米）
   * @property center 扩散中心点（世界坐标）
   */
  diffusion?: {
    enabled: boolean;
    color: THREE.Color;
    width: number;
    speed: number;
    maxDistance?: number;
    center?: THREE.Vector3;
  };

  /**
   * 流光效果配置
   * @property enabled 是否启用效果
   * @property color 流光颜色
   * @property range 流光影响范围
   * @property speed 流动速度
   */
  flow?: {
    enabled: boolean;
    color: THREE.Color;
    range: number;
    speed: number;
  };

  /**
   * 扫光效果配置
   * @property enabled 是否启用效果
   * @property color 扫光颜色
   * @property width 扫光宽度
   * @property speed 扫光速度
   */
  sweep?: {
    enabled: boolean;
    color: THREE.Color;
    width: number;
    speed: number;
  };
}

/**
 * 着色器配置选项
 */
interface ShaderOption {
  /** 最小高度值 */
  minY: number;
  /** 最大高度值 */
  maxY: number;
  /** 最小亮度系数 */
  minRate: number;
  /** 最大亮度系数 */
  maxRate: number;
  /** 特效配置 */
  effects?: ShaderEffectOptions;
}

/** 区域蒙版材质参数（按多边形顶点） */
interface RegionOverlayMaterialParams {
  /** 叠加颜色（已是 THREE.Color 实例） */
  color: THREE.Color;
  /** 叠加不透明度 0-1 */
  opacity: number;
  /** 顶点列表（世界坐标 XZ 平面，用 vec2(x, z) 表示） */
  vertices: THREE.Vector2[];
  /** 顶点数量（可不传，由构造函数自动计算） */
  vertexCount?: number;
}


/**
 * 材质选项
 * @extends THREE.MeshStandardMaterialParameters
 */
interface MaterialOptions extends THREE.MeshStandardMaterialParameters {
  /** 着色器配置选项 */
  shaderOption?: Partial<ShaderOption>;
  /** 区域蒙版配置 */
  regionOverlay?: RegionOverlayMaterialParams;
}

/**
 * 建筑渐变材质
 * @description 自定义Three.js标准材质，支持高度渐变和多种动态特效
 * @extends THREE.MeshStandardMaterial
  * @category Utils
 */
export class MeshBuildGradientMaterial extends THREE.MeshStandardMaterial {
  /** 着色器配置 */
  shaderOption: ShaderOption;
  /** 动画时钟 */
  private clock: THREE.Clock;
  /** 当前时间（用于动画） */
  private time: { value: number };
  /** 启动时间（用于渐变动画） */
  private startTime: { value: number };
  /** 区域蒙版参数 */
  private regionOverlay?: RegionOverlayMaterialParams;

  /**
   * 构造函数
   * @param options 材质选项
   */
  constructor(options: MaterialOptions = {}) {
    const { shaderOption, regionOverlay, ...standardOptions } = options;

    super({
      color: "rgb(58,126,182)",
      roughness: 0.7,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
      envMapIntensity: 0.8,
      // 默认：建筑渐变材质不写深度，避免挡住 UI / 纹理点
      depthWrite: true,
      depthTest: true,
      ...standardOptions,
    });
    // 归一化区域蒙版参数（限制顶点数量并补足到固定长度）
    if (regionOverlay && regionOverlay.vertices && regionOverlay.vertices.length > 0) {
      const verts = regionOverlay.vertices.slice(0, REGION_OVERLAY_MAX_VERTS).map(v => v.clone());
      const count = verts.length;
      while (verts.length < REGION_OVERLAY_MAX_VERTS) {
        verts.push(new THREE.Vector2(0, 0));
      }
      this.regionOverlay = {
        color: regionOverlay.color,
        opacity: regionOverlay.opacity,
        vertices: verts,
        vertexCount: count
      };
    }
    // 初始化默认着色器配置
    this.shaderOption = {
      minY: 0,
      maxY: 100,
      minRate: 0.3,
      maxRate: 1.5,
      effects: {
        diffusion: {
          enabled: false,
          color: new THREE.Color('#9ECDEC'),
          width: 20,
          speed: 1,
          maxDistance: 100,
          center: undefined
        },
        flow: {
          enabled: false,
          color: new THREE.Color('#00E4FF'),
          range: 10,
          speed: 20
        },
        sweep: {
          enabled: false,
          color: new THREE.Color('#FFFFFF'),
          width: 1.5,
          speed: 10
        }
      },
      ...shaderOption,
    };

    this.clock = new THREE.Clock();
    this.time = { value: 0 };
    this.startTime = { value: 0 };
    this.animate();
  }

  /**
   * 着色器编译前回调
   * @param shader 着色器对象
   */
  onBeforeCompile(shader: any) {
    const { minY, maxY, minRate, maxRate, effects } = this.shaderOption;
    const heightRange = maxY - minY;

    const hasRegionOverlay = !!this.regionOverlay;

    // 更新uniforms
    shader.uniforms = {
      ...shader.uniforms,
      time: this.time,
      uStartTime: this.startTime,
      uMinY: { value: minY },
      uMaxY: { value: maxY },
      uHeightRange: { value: heightRange },
      uMinRate: { value: minRate },
      uMaxRate: { value: maxRate },
      uDiffusionEnabled: { value: effects?.diffusion?.enabled ? 1 : 0 },
      uDiffusionColor: { value: effects?.diffusion?.color || new THREE.Color('#9ECDEC') },
      uDiffusionWidth: { value: effects?.diffusion?.width || 20 },
      uDiffusionSpeed: { value: effects?.diffusion?.speed || 1 },
      uDiffusionMaxDistance: { value: effects?.diffusion?.maxDistance || 100 },
      uDiffusionCenter: { value: effects?.diffusion?.center || new THREE.Vector3(0, 0, 0) },
      uFlowEnabled: { value: effects?.flow?.enabled ? 1 : 0 },
      uFlowColor: { value: effects?.flow?.color || new THREE.Color('#00E4FF') },
      uFlowRange: { value: effects?.flow?.range || 10 },
      uFlowSpeed: { value: effects?.flow?.speed || 20 },
      uSweepEnabled: { value: effects?.sweep?.enabled ? 1 : 0 },
      uSweepColor: { value: effects?.sweep?.color || new THREE.Color('#FFFFFF') },
      uSweepWidth: { value: effects?.sweep?.width || 1.5 },
      uSweepSpeed: { value: effects?.sweep?.speed || 10 },

      // 区域多边形外衣相关
      uRegionOverlayEnabled: { value: hasRegionOverlay ? 1 : 0 },
      uRegionOverlayColor: { value: this.regionOverlay?.color || new THREE.Color('#00FF88') },
      uRegionOverlayOpacity: { value: this.regionOverlay?.opacity ?? 0.0 },
      uRegionOverlayVertexCount: { value: this.regionOverlay?.vertexCount ?? 0 },
      uRegionOverlayVertices: {
        value: this.regionOverlay?.vertices || new Array(REGION_OVERLAY_MAX_VERTS)
          .fill(0)
          .map(() => new THREE.Vector2(0, 0))
      }
    };

    // 修改顶点着色器
    shader.vertexShader = `
      varying vec3 vWorldPosition;
      varying vec3 vPosition;
      varying float vHeight;
      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vPosition = position;
      vHeight = position.y;
      `
    );

    // 修改片元着色器
    shader.fragmentShader = `
      #define PI 3.141592653589793
      #define REGION_OVERLAY_MAX_VERTS 64
      varying vec3 vWorldPosition;
      varying vec3 vPosition;
      varying float vHeight;
      uniform float uMinY;
      uniform float uMaxY;
      uniform float uHeightRange;
      uniform float uMinRate;
      uniform float uMaxRate;
      uniform float time;
      uniform float uStartTime;
      uniform int uDiffusionEnabled;
      uniform vec3 uDiffusionColor;
      uniform float uDiffusionWidth;
      uniform float uDiffusionSpeed;
      uniform float uDiffusionMaxDistance;
      uniform vec3 uDiffusionCenter;
      uniform int uFlowEnabled;
      uniform vec3 uFlowColor;
      uniform float uFlowRange;
      uniform float uFlowSpeed;
      uniform int uSweepEnabled;
      uniform vec3 uSweepColor;
      uniform float uSweepWidth;
      uniform float uSweepSpeed;

       // 区域多边形外衣相关 uniform 声明（之前缺少）
      uniform int uRegionOverlayEnabled;
      uniform vec3 uRegionOverlayColor;
      uniform float uRegionOverlayOpacity;
      uniform int uRegionOverlayVertexCount;
      uniform vec2 uRegionOverlayVertices[REGION_OVERLAY_MAX_VERTS];
      
      
      float distanceTo(vec2 src, vec2 dst) {
        return distance(src, dst);
      }
      
      ${shader.fragmentShader}
    `.replace(
      '#include <color_fragment>',
      `
      #include <color_fragment>
      
      // 高度渐变计算
      float normalizedHeight = clamp((vWorldPosition.y - uMinY) / uHeightRange, 0.0, 1.0);
      float heightFactor = smoothstep(0.0, 1.0, normalizedHeight);
      diffuseColor.rgb *= mix(uMinRate, uMaxRate, heightFactor);
      
      // 圆环扩散效果
      if (uDiffusionEnabled == 1) {
        vec2 position2D = vec2(vWorldPosition.x, vWorldPosition.z);
        vec2 center2D = vec2(uDiffusionCenter.x, uDiffusionCenter.z);
        float distToCenter = distance(position2D, center2D);
        
        float progress = mod(time * uDiffusionSpeed, 1.0);
        float currentRadius = progress * uDiffusionMaxDistance;
        
        if (distToCenter > currentRadius - uDiffusionWidth && 
            distToCenter < currentRadius) {
            float ringFactor = smoothstep(
                currentRadius - uDiffusionWidth,
                currentRadius,
                distToCenter
            );
            
            vec3 highBrightnessColor = uDiffusionColor * 5.0;
            diffuseColor.rgb += highBrightnessColor * (1.0 - ringFactor);
            diffuseColor.rgb = min(diffuseColor.rgb, vec3(2.0));
        }
      }
      
      // 流光效果
      if (uFlowEnabled == 1) {
        float dTime = mod(time * uFlowSpeed, uFlowRange * 2.0);
        if (vPosition.z > dTime - uFlowRange && vPosition.z < dTime) {
          float dIndex = sin((dTime - vPosition.z) / uFlowRange * PI);
          diffuseColor.rgb = mix(uFlowColor, diffuseColor.rgb, 1.0 - dIndex);
        }
      }
      
      // 扫光效果
      if (uSweepEnabled == 1) {
        float sweepPos = mod(time * uSweepSpeed, 2.0);
        if (vHeight > sweepPos - uSweepWidth && vHeight < sweepPos) {
          float sweepFactor = smoothstep(sweepPos - uSweepWidth, sweepPos, vHeight);
          diffuseColor.rgb = mix(uSweepColor, diffuseColor.rgb, 1.0 - sweepFactor);
        }
      }
    // 区域多边形外衣叠色（Ray casting 判定点是否在多边形内）
      if (uRegionOverlayEnabled == 1 && uRegionOverlayOpacity > 0.0 && uRegionOverlayVertexCount >= 3) {
        vec2 p = vec2(vWorldPosition.x, vWorldPosition.z);
        bool inside = false;
        int j = 0;
        for (int i = 0; i < REGION_OVERLAY_MAX_VERTS; i++) {
          if (i >= uRegionOverlayVertexCount) break;
          if (i == 0) {
            j = uRegionOverlayVertexCount - 1;
          }
          vec2 pi = uRegionOverlayVertices[i];
          vec2 pj = uRegionOverlayVertices[j];

          bool intersect = ((pi.y > p.y) != (pj.y > p.y)) &&
            (p.x < (pj.x - pi.x) * (p.y - pi.y) / (pj.y - pi.y + 1e-6) + pi.x);
          if (intersect) {
            inside = !inside;
          }
          j = i;
        }

        if (inside) {
          diffuseColor.rgb = mix(
            diffuseColor.rgb,
            uRegionOverlayColor,
            clamp(uRegionOverlayOpacity, 0.0, 1.0)
          );
        }
      }
      `
    );
  }

  /**
   * 自动设置圆环扩散参数
   * @param object 目标3D对象
   */
  setDiffusionFromObject(object: THREE.Object3D) {
    if (!this.shaderOption.effects?.diffusion) return;

    const box = new THREE.Box3().setFromObject(object);
    if (box.isEmpty()) return;

    const center = new THREE.Vector3();
    box.getCenter(center);

    const corners = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z)
    ];
    let maxDistance = 0;
    corners.forEach(corner => {
      const d = center.distanceTo(corner);
      if (d > maxDistance) maxDistance = d;
    });

    this.shaderOption.effects.diffusion = {
      ...this.shaderOption.effects.diffusion,
      center: center,
      maxDistance: maxDistance
    };
    this.needsUpdate = true;
  }

  /**
   * 更新边界框高度范围
   * @param minY 最小高度
   * @param maxY 最大高度
   */
  updateBoundingBox(minY: number, maxY: number) {
    this.shaderOption.minY = minY;
    this.shaderOption.maxY = maxY;
    this.needsUpdate = true;
  }

  /**
   * 更新特效配置
   * @param effects 特效配置
   */
  updateEffects(effects: Partial<ShaderEffectOptions>) {
    this.shaderOption.effects = {
      ...this.shaderOption.effects,
      ...effects
    };
    this.needsUpdate = true;
  }

  /**
   * 动画循环
   */
  private animate() {
    requestAnimationFrame(() => this.animate());
    this.time.value = this.clock.getElapsedTime();
    if (this.startTime.value < 1.0) {
      this.startTime.value += 0.01;
    }
  }
}