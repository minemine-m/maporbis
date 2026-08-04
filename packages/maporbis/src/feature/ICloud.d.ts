import { PointOptions, Point } from './Point';
import { Paint } from '../style';
/**
 * Cloud feature configuration options.
 * 云朵要素配置选项
 *
 * @extends PointOptions
  * @category Feature
 */
export type CloudOptions = PointOptions & {};
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
export declare class ICloud extends Point {
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
