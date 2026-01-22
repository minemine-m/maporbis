import type { Feature } from '../feature/Feature';

/**
 * 基础样式接口
 * Base Style Interface
 * @description 定义所有样式类型共享的基础属性
 * Defines base properties shared by all style types.
 * @category Style
 */
export type BaseStyle = {
    /**
     * 是否可见
     * Visibility
     * @default true
     */
    visible?: boolean;
    
    /**
     * 透明度 (0-1)
     * Opacity (0-1)
     * @default 1
     */
    opacity?: number;
    
    /**
     * 渲染层级
     * Render Z-Index
     * @description 数值越大渲染在越上层
     * Higher value means rendered on top.
     */
    zIndex?: number;
};

/**
 * 点要素样式配置
 * Point Feature Style Configuration
 * @extends BaseStyle
  * @category Style
 */
export type PointStyle = BaseStyle & {
    /**
     * 样式类型标识
     * Style Type Identifier
     */
    type: 'point';
    
    /**
     * 点颜色
     * Point Color
     * @description 支持CSS颜色字符串或十六进制数值
     * Supports CSS color strings or hex values.
     * @example '#ff0000' 或 0xff0000
     */
    color?: string | number;
    
    /**
     * 点大小
     * Point Size
     * @description 单位：像素
     * Unit: pixels
     * @default 10
     */
    size?: number;
    
    /**
     * 图标URL
     * Icon URL
     * @description 当需要显示图标时指定
     * Specified when an icon needs to be displayed.
     */
    icon?: string;
    
    // ...其他点样式属性
};

/**
 * 线要素样式配置
 * Line Feature Style Configuration
 * @extends BaseStyle
  * @category Style
 */
export type LineStyle = BaseStyle & {
    /**
     * 样式类型标识
     * Style Type Identifier
     */
    type: 'line';
    
    /**
     * 线颜色
     * Line Color
     * @description 支持CSS颜色字符串或十六进制数值
     * Supports CSS color strings or hex values.
     * @example '#00ff00' 或 0x00ff00
     */
    color?: string | number;
    
    /**
     * 线宽
     * Line Width
     * @description 单位：像素
     * Unit: pixels
     * @default 2
     */
    width?: number;
    
    // ...其他线样式属性
};

/**
 * 样式配置联合类型
 * Style Configuration Union Type
 * @description 包含所有支持的样式类型
 * Contains all supported style types.
  * @category Style
 */
export type StyleConfig = PointStyle | LineStyle;

/**
 * 样式函数类型
 * Style Function Type
 * @description 根据要素和缩放级别动态计算样式
 * Dynamically calculates style based on feature and zoom level.
 * @template T 样式配置类型 Style configuration type
 * @param feature 地图要素 Map feature
 * @param zoom 当前缩放级别（可选） Current zoom level (optional)
 * @returns 样式配置对象 Style configuration object
  * @category Style
 */
export type StyleFunction<T extends StyleConfig> = (
    feature: Feature,
    zoom?: number
) => T;