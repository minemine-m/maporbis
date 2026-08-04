/**
 * Sky - 自定义大气天空实现
 *
 * **不是** Three.js 内置的 `three/addons/objects/Sky.js`，
 * 而是完全自定义的实现，包含天空散射 + 程序化云层 + 雾效果。
 *
 * 还原自 three-tile-doc 的 Atmosphere 示例，确保与原实现完全一致。
 */
import { Mesh, Color } from "three";
export interface SkyParams {
    elevation?: number;
    azimuth?: number;
    turbidity?: number;
    rayleigh?: number;
    mieCoefficient?: number;
    mieDirectionalG?: number;
    sunSize?: number;
    skyIntensity?: number;
    coverage?: number;
    THICKNESS?: number;
    ABSORPTION?: number;
    weaken?: number;
    mult?: number;
    N_MARCH_STEPS?: number;
    N_LIGHT_STEPS?: number;
    speed?: number;
    wind?: {
        x: number;
        y: number;
        z: number;
    };
    skylineF?: number;
    curve?: number;
    fogColor?: Color | number | string;
    fogDensity?: number;
    /** 星星亮度 (0-1)，0 关闭 */
    starIntensity?: number;
    /** 月亮亮度 (0-1)，0 关闭 */
    moonIntensity?: number;
    /** 月亮仰角 (0-90) */
    moonElevation?: number;
    /** 月亮方位角 (-180 ~ 180) */
    moonAzimuth?: number;
    /** 月亮角半径（弧度），默认 0.0045 ≈ 0.26° */
    moonAngularRadius?: number;
}
export interface SkyOptions {
    url?: string;
}
export declare class Sky extends Mesh {
    isSky: boolean;
    private _material;
    constructor(options?: SkyOptions);
    get uniforms(): {
        [uniform: string]: import("three").IUniform<any>;
    };
    /**
     * 更新天空参数
     *
     * 注意：参数转换逻辑与 three-tile-doc 的 r() 函数完全一致
     */
    update(params: SkyParams): void;
}
