import { Color, Vector3, Clock, Mesh, Sphere, Box3, MeshPhongMaterial } from "three";

/**
 * 城市渲染配置选项
 */
interface RenderCityOptions {
    /** 基础颜色（默认#3F90D9） */
    BaseColor?: string | Color;
    /** 顶部颜色（默认#00F6E5） */
    topColor?: string | Color;
    /** 流光颜色（默认#00E4FF） */
    flowColor?: string | Color;
    /** 特效颜色（默认#9ECDEC） */
    effectColor?: string | Color;
    /** 透明度（默认1） */
    opacity?: number;
    /** 模型范围（默认10） */
    modRange?: number;
    /** 模型宽度（默认1.5） */
    modWidth?: number;
    /** 扩散效果参数 */
    diffusionParams?: {
        /** 是否启用（默认true） */
        enabled: boolean;
        /** 扩散范围（默认120） */
        range: number;
        /** 扩散速度（默认600） */
        speed: number;
        /** 扩散中心点（默认模型中心） */
        center?: Vector3;
    };
    /** 流光效果参数 */
    flowParams?: {
        /** 是否启用（默认true） */
        enabled: boolean;
        /** 流光范围（默认10） */
        range: number;
        /** 流光速度（默认20） */
        speed: number;
    };
    /** 动画速度（默认0.01） */
    animationSpeed?: number;
    /** 效果开关 */
    switches?: {
        /** 是否启用扩散效果（默认false） */
        diffusion: boolean;
        /** 是否启用扫光效果（默认false） */
        sweep: boolean;
        /** 是否启用向上扫描效果（默认false） */
        upwardScan: boolean;
    };
}

/**
 * 渲染城市建筑效果
 * @param object 要渲染的网格对象
 * @param options 渲染配置选项
 * 
 * @description
 * 该函数为城市建筑模型添加以下特效：
 * - 高度渐变颜色（从基础色到顶部色）
 * - 扩散光波效果
 * - 垂直流光效果
 * - 动态动画效果
  * @category Utils
 */
export function renderCity(object: Mesh, options: RenderCityOptions = {}) {
    // 计算模型的包围盒和包围球
    object.geometry.computeBoundingBox();
    object.geometry.computeBoundingSphere();

    const { geometry } = object;

    // 获取几何中心点和半径
    const { center, radius } = geometry.boundingSphere as Sphere;
    const { max, min } = geometry.boundingBox as Box3;

    // 计算模型尺寸
    const size = new Vector3(
        max.x - min.x,
        max.y - min.y,
        max.z - min.z
    );

    // 计算世界空间高度范围
    const box = new Box3().setFromObject(object);
    const uMinWorldY = box.min.y + 1; // 最低点（地面）
    const uMaxWorldHeight = box.max.y - uMinWorldY; // 建筑高度范围

    // 设置默认值
    const {
        BaseColor = "#3F90D9",
        topColor = "#00F6E5",
        flowColor = "#00E4FF",
        effectColor = "#9ECDEC",
        opacity = 1,
        modRange = 10,
        modWidth = 1.5,
        diffusionParams = { enabled: true, range: 120, speed: 600 },
        flowParams = { enabled: true, range: 10, speed: 20 },
        animationSpeed = 0.01,
        switches = { diffusion: false, sweep: false, upwardScan: false }
    } = options;

    // 动画时间变量
    const time = { value: 0 };
    const StartTime = { value: 0 };

    // 处理材质
    forMaterial(object.material, (material: MeshPhongMaterial) => {
        material.transparent = true;

        // 着色器编译前回调
        material.onBeforeCompile = (shader: any) => {
            // 添加uniforms
            shader.uniforms.time = time;
            shader.uniforms.uStartTime = StartTime;

            // 几何属性
            shader.uniforms.uCenter = { value: center };
            shader.uniforms.uSize = { value: size };
            shader.uniforms.uMax = { value: max };
            shader.uniforms.uMin = { value: min };
            shader.uniforms.uRadius = { value: radius };
            shader.uniforms.uMaxWorldHeight = { value: uMaxWorldHeight };
            shader.uniforms.uMinWorldY = { value: uMinWorldY };

            // 颜色属性
            shader.uniforms.uBaseColor = { value: new Color(BaseColor) };
            shader.uniforms.uTopColor = { value: new Color(topColor) };
            shader.uniforms.uColor = { value: new Color(effectColor) };
            shader.uniforms.uFlowColor = { value: new Color(flowColor) };

            // 效果参数
            shader.uniforms.uOpacity = { value: opacity };
            shader.uniforms.uModRange = { value: modRange };
            shader.uniforms.uModWidth = { value: modWidth };

            // 效果开关
            shader.uniforms.uSwitch = {
                value: new Vector3(
                    switches.diffusion ? 1 : 0,
                    switches.sweep ? 1 : 0,
                    switches.upwardScan ? 1 : 0
                )
            };

            // 扩散参数
            shader.uniforms.uDiffusion = {
                value: new Vector3(
                    diffusionParams.enabled ? 1 : 0,
                    diffusionParams.range,
                    diffusionParams.speed
                )
            };
            shader.uniforms.uDiffusionCenter = {
                value: diffusionParams.center || new Vector3(0, 0, 0)
            };

            // 流光参数
            shader.uniforms.uFlow = {
                value: new Vector3(
                    flowParams.enabled ? 1 : 0,
                    flowParams.range,
                    flowParams.speed
                )
            };

            // 修改片元着色器
            const fragment = `
float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
}

float lerp(float x, float y, float t) {
    return (1.0 - t) * x + t * y;
}

vec3 getGradientColor(vec3 color1, vec3 color2, float index) {
    float r = lerp(color1.r, color2.r, index);
    float g = lerp(color1.g, color2.g, index);
    float b = lerp(color1.b, color2.b, index);
    return vec3(r, g, b);
}

varying vec4 vPositionMatrix;
varying vec3 vPosition;
varying float vWorldY;

uniform float time;
uniform float uRadius;
uniform float uOpacity;
uniform float uModRange;
uniform float uModWidth;
uniform float uStartTime; 
uniform vec3 uMin;
uniform vec3 uMax;
uniform vec3 uSize;
uniform vec3 uFlow;
uniform vec3 uColor;
uniform vec3 uCenter;
uniform vec3 uSwitch;
uniform vec3 uBaseColor;
uniform vec3 uTopColor;
uniform vec3 uFlowColor;
uniform vec3 uDiffusion; 
uniform vec3 uDiffusionCenter;
uniform float uMaxWorldHeight;
uniform float uMinWorldY;

void main() {
    `;

            const fragmentColor = `
vec3 distColor = outgoingLight * uBaseColor;
float dstOpacity = diffuseColor.a;

// 高度渐变计算
float normalizedY = (vWorldY - uMinWorldY) / uMaxWorldHeight;
normalizedY = clamp(normalizedY, 0.0, 1.0);

// 对数渐变处理
float indexMix = log(normalizedY * 15.0 + 1.0) / log(11.0);

// 顶部亮度限制
if (normalizedY > 0.92) {
    float compression = smoothstep(0.92, 1.0, normalizedY);
    indexMix = mix(indexMix, 0.65, compression);
}

// 底部最小亮度
float minTopMix = 0.3;
if (normalizedY > 0.01) {
    indexMix = max(indexMix, minTopMix * (1.0 - exp(-normalizedY * 5.0)));
}

distColor = mix(distColor, uTopColor, indexMix);

// 扩散波效果
vec2 position2D = vec2(vPosition.x, vPosition.y);
if (uDiffusion.x > 0.5) {
    float dTime = mod(time * uDiffusion.z, uRadius * 2.0);
    float uLen = distanceTo(position2D, vec2(uCenter.x, uCenter.z));

    if (uLen < dTime && uLen > dTime - uDiffusion.y) {
        float dIndex = sin((dTime - uLen) / uDiffusion.y * PI);
        distColor = mix(uColor, distColor, 1.0 - dIndex);
    }
}

// 流光效果
if (uFlow.x > 0.5) {
    float dTime = mod(time * uFlow.z, uSize.z); 
    float topY = vPosition.z + uFlow.y;
    if (dTime > vPosition.z && dTime < topY) {
        float dIndex = sin((topY - dTime) / uFlow.y * PI);
        distColor = mix(distColor, uFlowColor, dIndex); 
    }
}

gl_FragColor = vec4(vec3(distColor), uOpacity);
    `;

            shader.fragmentShader = shader.fragmentShader.replace("void main() {", fragment);
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>
                ${fragmentColor}`
            );

            // 修改顶点着色器
            const vertex = `
varying vec4 vPositionMatrix;
varying vec3 vPosition;
varying float vWorldY;
uniform float uStartTime;
void main() {
    vWorldY = (modelMatrix * vec4(position, 1.0)).y;
    vPositionMatrix = projectionMatrix * vec4(position, 1.0);
    vPosition = position;
    `;

            const vertexPosition = `
vec3 transformed = vec3(position.x, position.y, position.z * uStartTime);
    `;

            shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);
            shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", vertexPosition);

            // 增强材质效果
            material.shininess = 30;
            material.specular.set(0xffffff);
            material.flatShading = true;
        };
    });

    // 创建动画时钟
    const clock = new Clock();

    /**
     * 动画循环
     */
    function animate() {
        requestAnimationFrame(animate);
        time.value = clock.getElapsedTime();
        if (StartTime.value < 1.0) {
            StartTime.value += animationSpeed;
        }
    }

    animate();
}

/**
 * 处理材质数组或单个材质
 * @param materials 材质或材质数组
 * @param callback 回调函数
 */
function forMaterial(materials: any, callback: Function): void {
    if (!callback || !materials) return;
    if (Array.isArray(materials)) {
        materials.forEach((mat) => {
            callback(mat);
        });
    } else {
        callback(materials);
    }
}