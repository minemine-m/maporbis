import { Object3D } from 'three';
import { Line2 } from 'three-stdlib';
/**
 * Bloom configuration interface.
 * 发光配置接口
 */
export interface IBloomConfig {
    enabled: boolean;
    intensity: number;
    color: string;
}
/**
 * Internal feature bloom effect helper.
 * 内部要素发光效果辅助类
 *
 * @description
 * Manages bloom/glow effects for features including Points, Sprites, Line2, and Meshes.
 * 管理要素的发光效果，包括点、精灵、线条和网格
 *
 * @internal
 */
export declare class FeatureBloomHelper {
    /** Current bloom configuration. 当前发光配置 */
    private _bloomConfig?;
    /**
     * Get current bloom configuration.
     * 获取当前发光配置
     */
    getBloomConfig(): IBloomConfig | undefined;
    /**
     * Set bloom configuration.
     * 设置发光配置
     *
     * @param enabled - Whether to enable bloom. 是否启用发光
     * @param options - Bloom intensity and color options. 发光强度和颜色选项
     */
    setBloomConfig(enabled: boolean, options?: {
        intensity?: number;
        color?: string;
    }): IBloomConfig;
    /**
     * Apply bloom configuration from style.
     * 从样式应用发光配置
     *
     * @param styleBloom - Bloom config from style. 样式中的发光配置
     */
    applyStyleBloom(styleBloom: boolean | {
        enabled?: boolean;
        intensity?: number;
        color?: string;
    } | undefined): void;
    /**
     * Apply bloom effect to a Three.js object.
     * 将发光效果应用到Three.js对象上
     *
     * @param root - Root object to apply bloom to. 要应用发光的根对象
     */
    applyBloomToObject(root: Object3D | Line2): void;
    /**
     * Apply bloom to Points material.
     * 将发光效果应用到点材质
     */
    private _applyBloomToPoints;
    /**
     * Apply bloom to Sprite material.
     * 将发光效果应用到精灵材质
     */
    private _applyBloomToSprite;
    /**
     * Apply bloom to Line2 material.
     * 将发光效果应用到Line2材质
     */
    private _applyBloomToLine2;
    /**
     * Apply bloom to Mesh material.
     * 将发光效果应用到网格材质
     */
    private _applyBloomToMesh;
}
