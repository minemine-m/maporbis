import { LineOptions, Line } from './Line';
/**
 * Multi-line feature configuration options.
 * 多线要素配置选项
 *
 * @extends LineOptions
  * @category Feature
 */
export type MultiLineStringOptions = LineOptions & {};
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
