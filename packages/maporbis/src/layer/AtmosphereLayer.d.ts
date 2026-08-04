/**
 * AtmosphereLayer - 大气环境图层
 *
 * 基于自定义 Sky 实现的大气效果图层，包含：
 * - 天空散射（瑞利散射、米氏散射）
 * - 程序化云层渲染
 * - 太阳渲染
 * - 雾效果
 * - 天际线效果
 *
 * 还原自 three-tile-doc 的 Atmosphere 示例。
 *
 * @example
 * ```ts
 * import { AtmosphereLayer } from '@maporbis/pro';
 *
 * const atmosphere = new AtmosphereLayer('atmosphere', {
 *   url: 'perlin256.png',
 *   elevation: 15,
 *   azimuth: 180,
 *   turbidity: 10,
 *   rayleigh: 0.3,
 *   coverage: 0.6,
 *   weaken: 0.5,
 * });
 *
 * map.addLayer(atmosphere);
 *
 * // 动态更新
 * atmosphere.update({ coverage: 0.8 });
 * ```
 */
import { Color } from 'three';
import { Layer, LayerOptions } from './Layer';
import { Sky, SkyParams } from './Sky';
/**
 * AtmosphereLayer 配置选项
 *
 * @extends LayerOptions
 * @category Layer
 */
export type AtmosphereLayerOptions = LayerOptions & {
    /**
     * 云噪声纹理 URL
     * @description 用于生成程序化云层的噪声纹理
     */
    url?: string;
    /** 太阳仰角 (0-90)，默认 15 */
    elevation?: number;
    /** 太阳方位角 (-180 ~ 180)，默认 180 */
    azimuth?: number;
    /** 太阳大小倍数 (0-10)，默认 1 */
    sunSize?: number;
    /** 天空亮度 (0-1)，默认 1 */
    skyIntensity?: number;
    /** 浑浊度 (0-20)，默认 10 */
    turbidity?: number;
    /** 瑞利散射系数 (0-4)，默认 0.4 */
    rayleigh?: number;
    /** 米氏散射系数 (0-0.1)，默认 0.005 */
    mieCoefficient?: number;
    /** 米氏方向因子 (0-1)，默认 1 */
    mieDirectionalG?: number;
    /** 云覆盖率 (0-1)，默认 0.5 */
    coverage?: number;
    /** 云厚度 (0-100)，默认 80 */
    THICKNESS?: number;
    /** 云光线吸收率 (0-1)，默认 0.45 */
    ABSORPTION?: number;
    /** 云量/衰减因子 (0-1)，默认 0.5 */
    weaken?: number;
    /** 云频率 (0-3)，默认 1 */
    mult?: number;
    /** 云采样迭代次数 (0-5)，默认 3 */
    N_MARCH_STEPS?: number;
    /** 云光照迭代次数 (0-10)，默认 3 */
    N_LIGHT_STEPS?: number;
    /** 风速 (0-10)，默认 0.5 */
    speed?: number;
    /** 风向 */
    wind?: {
        x: number;
        y: number;
        z: number;
    };
    /** 天际线因子 (0-1)，默认 0.2 */
    skylineF?: number;
    /** 坐标曲率 (0.1-0.6)，默认 0.3 */
    curve?: number;
    /** 雾颜色 */
    fogColor?: Color | number | string;
    /** 雾密度，默认 0.5 */
    fogDensity?: number;
    /** 环境光强度 (0-5)，默认 1 */
    ambLight?: number;
    /** 平行光强度 (0-5)，默认 1 */
    dirLight?: number;
    /** 星星亮度 (0-1)，默认 0（关闭）。白天太阳亮时自动消失 */
    starIntensity?: number;
    /** 月亮亮度 (0-1)，默认 0（关闭）。白天太阳亮时自动消失 */
    moonIntensity?: number;
    /** 月亮仰角 (0-90)，默认 30 */
    moonElevation?: number;
    /** 月亮方位角 (-180 ~ 180)，默认 0 */
    moonAzimuth?: number;
    /** 月亮角半径（弧度），默认 0.0045 ≈ 0.26° */
    moonAngularRadius?: number;
};
/**
 * 大气环境图层类
 *
 * 用于在 3D 场景中渲染和管理大气效果。
 * 基于自定义 Sky 实现，包含天空散射、程序化云层、太阳、雾效果。
 *
 * @extends Layer
 * @category Layer
 */
export declare class AtmosphereLayer extends Layer {
    /**
     * Sky 实例
     * @description 存储 Sky Mesh 实例
     */
    private _sky;
    /**
     * 待应用的场景参数（延迟到绑定 map 后应用）
     */
    private _pendingSceneParams;
    /**
     * 构造函数
     *
     * @param id 图层唯一标识符
     * @param options 大气配置选项
     */
    constructor(id: string, options?: AtmosphereLayerOptions);
    /**
     * 获取 Sky 实例
     */
    get sky(): Sky | null;
    /**
     * 创建 Sky 实例
     *
     * @param options 配置选项
     */
    private _createSky;
    /**
     * 更新大气参数
     *
     * @param params 要更新的参数
     */
    update(params: SkyParams & AtmosphereLayerOptions): void;
    /**
     * 更新场景光照和雾效
     *
     * @param params 参数
     */
    private _updateScene;
    /**
     * 绑定到 map 时调用，应用待处理的场景参数
     */
    _bindMap(mapInstance: any): void;
    /**
     * 实际应用场景参数
     */
    private _applySceneParams;
    /**
     * 设置图层可见性
     *
     * @param visible 是否可见
     */
    setVisible(visible: boolean): this;
    /**
     * 获取图层可见性
     */
    getVisible(): boolean;
    /**
     * 销毁图层
     */
    dispose(): void;
}
