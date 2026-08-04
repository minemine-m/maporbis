/**
 * Sky - 自定义大气天空实现
 *
 * **不是** Three.js 内置的 `three/addons/objects/Sky.js`，
 * 而是完全自定义的实现，包含天空散射 + 程序化云层 + 雾效果。
 *
 * 还原自 three-tile-doc 的 Atmosphere 示例，确保与原实现完全一致。
 */
import { Mesh, SphereGeometry, ShaderMaterial, TextureLoader, Vector3, Color, MathUtils, BackSide, RepeatWrapping, } from "three";
// ============================================================================
// 着色器代码 - 与 three-tile-doc 完全一致
// ============================================================================
const vertexShader = `
// 太阳
uniform float Intensity;    // 亮度
uniform vec3 sunPosition;   // 太阳位置

// 天空
uniform float rayleigh;     // 瑞利散射
uniform vec3 up;            // 相机上方

varying vec3 vWorldPosition;  // 世界坐标
varying vec3 vSunDirection;   // 阳光方向
varying float vSunfade;       // 太阳照射范围
varying vec3 vBetaR;          // 瑞利系数
varying float vSunE;          // 阳光强度

// 相关常数
const float e = 2.71828182845904523536028747135266249775724709369995957;
const float pi = 3.141592653589793238462643383279502884197169;
const vec3 totalRayleigh = vec3(5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5);
const float cutoffAngle = 1.6110731556870734; // pi / 1.95
const float steepness = 1.5;
const float EE = 1000.0;

float sunIntensity(float zenithAngleCos) {
    zenithAngleCos = clamp(zenithAngleCos, -1.0, 1.0);
    return Intensity * EE * max(0.0, 1.0 - pow(e, -((cutoffAngle - acos(zenithAngleCos)) / steepness)));
}

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    gl_Position.z = gl_Position.w; // set z to camera.far

    vSunDirection = normalize(sunPosition);
    float sun_up = dot(vSunDirection, up);

    vSunE = sunIntensity(sun_up);
    vSunfade = 1.0 - clamp(1.0 - exp((sun_up)), 0.0, 1.0);

    float rayleighCoefficient = rayleigh - (1.0 * (1.0 - vSunfade));
    vBetaR = totalRayleigh * rayleighCoefficient;
}
`;
const fragmentShader = `
// 太阳
uniform float sunAngularDiameter;
uniform float mieDirectionalG;
uniform float Exposure;

// 天空
uniform float turbidity;
uniform float skylineF;
uniform float mieCoefficient;
uniform vec3 skyGlowColor;
uniform vec3 sunGlowColor;
uniform vec3 up;

// 云朵
uniform sampler2D map;
uniform float uTime;
uniform float weaken;
uniform float THICKNESS;
uniform int N_LIGHT_STEPS;
uniform float curve;
uniform float speed;
uniform vec3 wind;
uniform float coverage;
uniform float ABSORPTION;
uniform float mult;
uniform int N_MARCH_STEPS;

// 雾：用于地平线附近过渡，与地面雾自然融合
uniform float fogDensity;
uniform vec3 fogColor;

// 星星与月亮
uniform float uStarIntensity;
uniform float uMoonIntensity;
uniform vec3 uMoonDir;
uniform float uMoonAngularRadius;

varying vec3 vWorldPosition;
varying vec3 vSunDirection;
varying float vSunfade;
varying vec3 vBetaR;
varying float vSunE;

// ============================================================================
// 云相关函数
// ============================================================================

const vec3 cameraPos = vec3(0.0, 0.0, 0.0);
const float pi = 3.141592653589793238462643383279502884197169;

float noise(vec3 p) {
    return texture(map, p.xz).x;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a = random(i.xy + i.z * 0.1);
    float b = random((i + vec3(1.0, 0.0, 0.0)).xy + i.z * 0.1);
    float c = random((i + vec3(0.0, 1.0, 0.0)).xy + i.z * 0.1);
    float d = random((i + vec3(1.0, 1.0, 0.0)).xy + i.z * 0.1);

    float e = random((i + vec3(0.0, 0.0, 1.0)).xy + (i.z + 1.0) * 0.1);
    float f2 = random((i + vec3(1.0, 0.0, 1.0)).xy + (i.z + 1.0) * 0.1);
    float g = random((i + vec3(0.0, 1.0, 1.0)).xy + (i.z + 1.0) * 0.1);
    float h = random((i + vec3(1.0, 1.0, 1.0)).xy + (i.z + 1.0) * 0.1);

    vec3 u = f * f * (3.0 - 2.0 * f);

    float x1 = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    float x2 = mix(mix(e, f2, u.x), mix(g, h, u.x), u.y);

    return mix(x1, x2, u.z);
}

const mat3 m = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);

float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = weaken;
    float frequency = mult;

    for (int i = 0; i < 5; i++) {
        value += amplitude * noise3D(p);
        amplitude *= 0.6;
        p = m * p * mult;
    }

    return value;
}

float cloud_density(vec3 pos, float cov) {
    float dens = fbm(pos);
    return smoothstep(cov, 1., dens);
}

float cloud_light(vec3 pos, vec3 sundir_step, float cov) {
    float T = 1.0;
    float dens;
    float T_i;

    for (int i = 0; i < N_LIGHT_STEPS; i++) {
        dens = cloud_density(pos, cov);
        T_i = exp(-ABSORPTION * dens);
        T *= T_i;
        pos += sundir_step;
    }
    T = clamp(T, 0., 1.);
    return T;
}

vec4 render_clouds(vec3 rayOrigin, vec3 rayDirection) {
    float march_step = (THICKNESS + .0002) / float(N_MARCH_STEPS);
    vec3 pos = rayOrigin + speed * vec3(uTime * wind.x, uTime * wind.y, uTime * wind.z);
    vec3 dir_step = rayDirection * march_step;
    vec3 light_step = normalize(vSunDirection - cameraPos) * march_step;

    float T = 1.0;
    vec3 C = vec3(0.0);
    float alpha = 0.0;
    float dens;
    float T_i;
    float cloudLight;

    for (int i = 0; i < N_MARCH_STEPS; i++) {
        dens = cloud_density(pos, 1. - coverage);
        T_i = exp(-ABSORPTION * dens * march_step);
        T *= T_i;
        cloudLight = cloud_light(pos, light_step, 1. - coverage);
        C += T * cloudLight * dens * march_step;
        C = mix(C * 0.9, C, clamp(cloudLight, 0.0, 1.0));
        alpha += (1.0 - T_i) * (1.0 - alpha);

        if (alpha > .99) break;
        pos += dir_step;
    }

    return vec4(C, alpha);
}

// ============================================================================
// 星星与月亮函数
// ============================================================================

float hash21(vec2 p) {
    p = fract(p * vec2(233.34, 851.74));
    p += dot(p, p + 23.45);
    return fract(p.x * p.y);
}

// 星场：基于天球坐标的 2D 程序化星星
// 使用方位角+仰角，星星固定在天空上，不受相机旋转影响
float stars(vec3 dir, float density) {
    // 转换为天球坐标（方位角 0~1，仰角 0~1）
    float altitude = dir.y * 0.5 + 0.5;
    float azimuth = atan(dir.z, dir.x) / 6.2832 + 0.5;

    vec2 p = vec2(azimuth, altitude) * density;
    vec2 cell = floor(p);
    vec2 f = fract(p) - 0.5;

    float brightness = 0.0;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 cellId = cell + offset;

            // 随机决定这个 cell 有没有星
            float h = hash21(cellId);
            if (h < 0.65) continue;

            // 星在 cell 内的位置
            vec2 starPos = offset + vec2(hash21(cellId + 1.0), hash21(cellId + 2.0)) - 0.5;
            float d = length(f - starPos);

            // 星星亮度：分 3 档
            float brightnessClass = hash21(cellId + 5.0);
            float starBrightness;
            if (brightnessClass < 0.6) {
                starBrightness = 0.25 + 0.2 * hash21(cellId + 3.0);  // 暗星 60%
            } else if (brightnessClass < 0.88) {
                starBrightness = 0.55 + 0.3 * hash21(cellId + 3.0);  // 中等星 28%
            } else {
                starBrightness = 0.9 + 0.1 * hash21(cellId + 3.0);   // 亮星 12%
            }

            // 高斯衰减：极小 sigma = 针尖光点
            float sigma = 0.006 + 0.008 * hash21(cellId + 4.0);
            float br = exp(-d * d / (2.0 * sigma * sigma)) * starBrightness;
            brightness = max(brightness, br);
        }
    }
    return brightness;
}

// 月亮圆盘：基于角距离的柔和圆盘
float moonDisc(vec3 dir, vec3 moonDir, float radius) {
    float cosAngle = dot(dir, moonDir);
    float angle = acos(clamp(cosAngle, -1.0, 1.0));
    // 柔和边缘的圆盘，外圈光晕
    float disc = smoothstep(radius, radius * 0.4, angle);
    float glow = smoothstep(radius * 3.0, radius * 0.5, angle) * 0.15;
    // 内部提亮
    float inner = smoothstep(radius * 0.6, 0.0, angle) * 0.2;
    return disc + glow + inner;
}

// ============================================================================
// 天空散射函数
// ============================================================================

const float rayleighZenithLength = 8.4E3;
const float mieZenithLength = 1.25E3;
const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
const float ONE_OVER_FOURPI = 0.07957747154594767;
const vec3 MieConst = vec3(1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14);

float rayleighPhase(float cosTheta) {
    return THREE_OVER_SIXTEENPI * (1.0 + pow(cosTheta, 2.0));
}

float hgPhase(float cosTheta, float g) {
    float g2 = pow(g, 2.0);
    float inverse = 1.0 / pow(1.0 - 2.0 * g * cosTheta + g2, 1.5);
    return ONE_OVER_FOURPI * ((1.0 - g2) * inverse);
}

vec3 totalMie(float T) {
    float c = (0.2 * T) * 10E-18;
    return 0.434 * c * MieConst;
}

vec3 ReRRTAndODTFit(vec3 color) {
    vec3 ret;
    ret = -(sqrt(10.0) * sqrt((-187345541948750.0 * pow(color, vec3(2.0)))
        + 232671271403227.0 * color + 241563894490.0)
        + 21647550.0 * color - 1228930.0)
        / (98372900.0 * color - 100000000.0);
    return ret;
}

vec3 ReACESToneMapping(vec3 color) {
    mat3 InputM_I = mat3(
        1.76474, -0.14703, -0.03634,
        -0.67578, 1.16025, -0.16244,
        -0.08896, -0.01322, 1.19877
    );
    mat3 Output_I = mat3(
        0.64304, 0.05927, 0.005962,
        0.31119, 0.93144, 0.06393,
        0.04578, 0.00929, 0.93012
    );

    vec3 ret;
    ret = InputM_I * ReRRTAndODTFit(Output_I * color) * 0.6 / Exposure;
    return ret;
}

// ============================================================================
// 主函数
// ============================================================================

void main() {
    vec3 pos = normalize(vWorldPosition);

    if (pos.y < -0.2) {
        discard;
        return;
    }

    vec4 cld = vec4(1., 1., 1., 1.);
    if (pos.y > 0.) {
        float df = 1. / (curve * pos.y + .1);
        vec3 posS = .4 * df * pos;
        vec3 raydir = normalize(posS - cameraPos);
        cld = render_clouds(posS, raydir);
    }

    vec3 direction = normalize(vWorldPosition - cameraPos);
    float view = smoothstep(0.0, 1.0, dot(up, direction));
    float zenithAngle = acos(max(0.0, dot(up, direction)));
    float inverse = 1.0 / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));
    float sR = rayleighZenithLength * inverse;
    float sM = mieZenithLength * inverse;
    float sun_up = smoothstep(0., 1., dot(up, vSunDirection));

    vec3 vBetaM = totalMie(turbidity) * mieCoefficient;

    vec3 Fex = exp(-(vBetaR * sR + vBetaM * sM));
    vec3 Fex_c = exp(-(vBetaR * sR + vBetaM * sM * (10000. * cld.a + 1.)) / 2.);

    float cosTheta = dot(direction, vSunDirection);

    float scaledDiameter = sunAngularDiameter * 0.15;
    float sunAngularDiameterRad = scaledDiameter * pi / 180.;

    float theta = acos(clamp(cosTheta, -1.0, 1.0));
    float glowSigma = sunAngularDiameterRad * 5.0;
    float glow = exp(-theta * theta / (2.0 * glowSigma * glowSigma));
    glow *= 0.06;

    vec3 suncolor = vSunE * 19000. * Fex * glow;
    suncolor *= 1. - smoothstep(0., 1., cld.a * 2000.);

    float rPhase = rayleighPhase(cosTheta * 0.5 + 0.5);
    vec3 betaRTheta = vBetaR * rPhase;
    vec3 cloudBetaR = vBetaR * rPhase;

    float a = 1. - smoothstep(0., 1., cld.a * 2000.);
    float mPhase = a * hgPhase(cosTheta, mieDirectionalG);
    vec3 betaMTheta = vBetaM * mPhase;

    vec3 Lin = pow(vSunE * ((betaRTheta + betaMTheta) / (vBetaR + vBetaM)) * (1.0 - Fex), vec3(3.5));
    Lin *= mix(vec3(1.0), pow(vSunE * ((betaRTheta + betaMTheta) / (vBetaR + vBetaM)) * Fex, vec3(1.0 / 2.0)),
        clamp(pow(1.0 - dot(up, vSunDirection), 5.), 0.0, 1.0));

    vec3 L0 = vec3(0.1) * Fex;

    vec3 cloud = pow(vSunE * ((cloudBetaR + betaMTheta) / (vBetaR + vBetaM)) * (1.0 - Fex_c), vec3(1.5));
    cloud *= mix(vec3(1.0), pow(vSunE * ((cloudBetaR + betaMTheta) / (vBetaR + vBetaM)) * Fex_c, vec3(1.0 / 2.0)),
        clamp(pow(1.0 - dot(up, vSunDirection), 5.), 0.0, 1.0));
    cloud *= 1. + cld.rgb * 2000.;

    vec3 bluecolor = vec3(0.0002, 0.00045, 0.0008);

    vec3 texColor = (Lin + L0) * 0.04 + bluecolor;
    vec3 retColor = pow(texColor, vec3(1.0 / (1.2 + (1.2 * vSunfade))));

    float d_factor = 1. - smoothstep(0., skylineF, pos.y);
    cloud = mix(cloud, retColor, clamp(d_factor, 0., 1.));
    retColor = mix(retColor + suncolor, cloud, clamp((cld.a) * 2000., 0., 1.));

    // === 星场与月亮 ===
    // 用太阳实际位置判断昼夜（太阳 y < 0 即为夜间）
    float nightFactor = 1.0 - smoothstep(-0.1, 0.1, vSunDirection.y);
    float cloudOcclusion = 1.0 - smoothstep(0.0, 1.0, cld.a * 2000.0);

    // DEBUG: 临时强制显示星月（排除遮挡问题）
    nightFactor = max(nightFactor, uStarIntensity > 0.0 ? 1.0 : 0.0);
    cloudOcclusion = max(cloudOcclusion, 0.5);

    // 星星
    if (uStarIntensity > 0.0 && pos.y > 0.0) {
        float star = stars(pos, 65.0);
        // 每颗星独立相位 + 双频叠加产生不规则闪烁
        float sAlt = pos.y * 0.5 + 0.5;
        float sAzi = atan(pos.z, pos.x) / 6.2832 + 0.5;
        float phase = hash21(floor(vec2(sAzi, sAlt) * 65.0));
        float twinkle = sin(uTime * 3.0 + phase * 50.0) * 0.4
                       + sin(uTime * 7.0 + phase * 30.0) * 0.2
                       + 0.5;
        float starAlpha = star * twinkle * uStarIntensity * 3.0;
        retColor += vec3(starAlpha);
    }

    // 月亮
    if (uMoonIntensity > 0.0) {
        float moonMask = moonDisc(pos, normalize(uMoonDir), uMoonAngularRadius);
        vec3 moonColor = vec3(1.0, 0.98, 0.94) * uMoonIntensity * 1.5;
        retColor = mix(retColor, moonColor, moonMask);
    }

    // 天空雾效：只在地平线附近（pos.y 接近0时）混合雾色，让天空与地面自然融合
    // 使用 skylineF 控制过渡范围，强度由 fogDensity 控制
    vec3 fog_Color = ReACESToneMapping(fogColor);
    float horizonFog = (1. - smoothstep(0., skylineF * 2., pos.y)) * fogDensity;
    retColor = mix(retColor, fog_Color, clamp(horizonFog, 0., 1.));
    retColor = clamp(retColor, 0., 14.);

    gl_FragColor = vec4(retColor, 1.0);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;
// ============================================================================
// SkyMaterial - 自定义着色器材质
// ============================================================================
class SkyMaterial extends ShaderMaterial {
    constructor(textureUrl) {
        // 与测试页面完全一致：直接创建 uniforms，不使用深拷贝
        const uniforms = {
            sunAngularDiameter: { value: 0.505 },
            Intensity: { value: 1 },
            sunPosition: { value: new Vector3() },
            mieDirectionalG: { value: 1 },
            Exposure: { value: 1 },
            turbidity: { value: 10 },
            skylineF: { value: 0.2 },
            rayleigh: { value: 0.4 },
            mieCoefficient: { value: 0.005 },
            up: { value: new Vector3(0, 1, 0) },
            map: { value: null },
            uTime: { value: 1 },
            weaken: { value: 0.5 },
            THICKNESS: { value: 0.001 },
            N_LIGHT_STEPS: { value: 3 },
            curve: { value: 0.3 },
            speed: { value: 0.5 },
            wind: { value: new Vector3(0.3, 0.1, 0.3) },
            coverage: { value: 0.5 },
            ABSORPTION: { value: 0.45 },
            mult: { value: 1 },
            N_MARCH_STEPS: { value: 3 },
            fogColor: { value: new Color(0.7, 0.7, 0.7) },
            fogDensity: { value: 0.0001 },
            uStarIntensity: { value: 0.0 },
            uMoonIntensity: { value: 0.0 },
            uMoonDir: { value: new Vector3(0, 1, 0) },
            uMoonAngularRadius: { value: 0.015 },
        };
        super({
            uniforms,
            fragmentShader,
            vertexShader,
            side: BackSide,
            depthWrite: false,
            // fog: false, // Sky 着色器没有 #include <fog_fragment>，scene.fog 不会自动影响 Sky
        });
        // 加载云噪声纹理 - 与测试页面完全一致
        if (textureUrl) {
            console.log("[Sky] Loading texture from:", textureUrl);
            const texture = new TextureLoader().load(textureUrl, (tex) => {
                console.log("[Sky] Texture loaded successfully!", tex);
                this.uniforms.map.value = tex;
            }, undefined, (err) => {
                console.error("[Sky] Texture load error:", err);
            });
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
            texture.generateMipmaps = false;
            this.uniforms.map.value = texture;
        }
    }
}
export class Sky extends Mesh {
    _material;
    constructor(options = {}) {
        const url = options.url || "";
        const material = new SkyMaterial(url);
        super(new SphereGeometry(), material);
        this._material = material;
        this.isSky = true;
        // 确保 Sky 渲染在最后面（最远）
        this.renderOrder = -999999;
        // 每帧更新时间 uniform，驱动云动画
        this.onBeforeRender = () => {
            this._material.uniforms.uTime.value = performance.now() * 0.001;
        };
    }
    get uniforms() {
        return this._material.uniforms;
    }
    /**
     * 更新天空参数
     *
     * 注意：参数转换逻辑与 three-tile-doc 的 r() 函数完全一致
     */
    update(params) {
        const u = this._material.uniforms;
        // 太阳位置 - 与 three-tile-doc 完全一致
        if (params.elevation !== undefined || params.azimuth !== undefined) {
            const elevation = params.elevation ?? 15;
            const azimuth = params.azimuth ?? 180;
            const phi = MathUtils.degToRad(90 - elevation);
            const theta = MathUtils.degToRad(azimuth);
            const sun = new Vector3();
            sun.setFromSphericalCoords(1, phi, theta);
            u.sunPosition.value.copy(sun);
        }
        // 天空参数 - 直接赋值
        if (params.turbidity !== undefined)
            u.turbidity.value = params.turbidity;
        if (params.rayleigh !== undefined)
            u.rayleigh.value = params.rayleigh;
        if (params.mieCoefficient !== undefined)
            u.mieCoefficient.value = params.mieCoefficient;
        if (params.mieDirectionalG !== undefined)
            u.mieDirectionalG.value = params.mieDirectionalG;
        if (params.sunSize !== undefined)
            u.sunAngularDiameter.value = params.sunSize * 0.505;
        if (params.skyIntensity !== undefined)
            u.Intensity.value = params.skyIntensity;
        // 云参数 - 注意转换逻辑与 three-tile-doc 一致
        if (params.mult !== undefined)
            u.mult.value = params.mult;
        // THICKNESS: 参数值 / 3e4（three-tile-doc 的转换）
        if (params.THICKNESS !== undefined)
            u.THICKNESS.value = params.THICKNESS / 3e4;
        if (params.ABSORPTION !== undefined)
            u.ABSORPTION.value = params.ABSORPTION;
        if (params.N_MARCH_STEPS !== undefined)
            u.N_MARCH_STEPS.value = params.N_MARCH_STEPS;
        if (params.N_LIGHT_STEPS !== undefined)
            u.N_LIGHT_STEPS.value = params.N_LIGHT_STEPS;
        if (params.weaken !== undefined)
            u.weaken.value = params.weaken;
        if (params.coverage !== undefined)
            u.coverage.value = params.coverage;
        // speed: 参数值 / 10（three-tile-doc 的转换）
        if (params.speed !== undefined)
            u.speed.value = params.speed / 10.0;
        if (params.wind !== undefined)
            u.wind.value = new Vector3(params.wind.x, params.wind.y, params.wind.z);
        if (params.skylineF !== undefined)
            u.skylineF.value = params.skylineF;
        // curve: 1 - 参数值（three-tile-doc 的转换）
        if (params.curve !== undefined)
            u.curve.value = 1 - params.curve;
        // 雾参数：用于地平线附近过渡
        if (params.fogColor !== undefined) {
            if (typeof params.fogColor === "number" ||
                typeof params.fogColor === "string") {
                u.fogColor.value.set(params.fogColor);
            }
            else {
                u.fogColor.value.copy(params.fogColor);
            }
        }
        if (params.fogDensity !== undefined)
            u.fogDensity.value = params.fogDensity;
        // 星星参数
        if (params.starIntensity !== undefined)
            u.uStarIntensity.value = params.starIntensity;
        // 月亮参数
        if (params.moonIntensity !== undefined)
            u.uMoonIntensity.value = params.moonIntensity;
        if (params.moonAngularRadius !== undefined)
            u.uMoonAngularRadius.value = params.moonAngularRadius;
        if (params.moonElevation !== undefined || params.moonAzimuth !== undefined) {
            const moonElev = params.moonElevation ?? 30;
            const moonAzim = params.moonAzimuth ?? 0;
            const phi = MathUtils.degToRad(90 - moonElev);
            const theta = MathUtils.degToRad(moonAzim);
            const moon = new Vector3().setFromSphericalCoords(1, phi, theta);
            u.uMoonDir.value.copy(moon);
        }
    }
}
