import { Vector3, Object3D } from 'three';
import { PointOptions, Point } from './Point';
import { Style } from '../style';
import { _createTextSprite, _createFixedSizeTextSprite } from '../utils/createobject';
import { Map } from '../map';

/**
 * Label feature configuration options.
 * 标签要素配置选项
 * 
 * @extends PointOptions
  * @category Feature
 */
export type MarkerOptions = PointOptions & {
    // Can add label-specific config items
};

/** Default label configuration */
const options: MarkerOptions = {
    // Default config items
};

/**
 * Label feature class.
 * 标签要素类
 * 
 * @description
 * Represents a text label feature in the 3D scene, inheriting from the Point class.
 * Provides functionality for creating, updating, and rendering labels, supporting two types of text labels:
 * - Fixed size labels
 * - Dynamic size labels
 * 
 * 表示3D场景中的文本标签要素，继承自Point类
 * 提供标签的创建、更新和渲染功能，支持两种文本标签类型：
 * - 固定大小标签
 * - 动态大小标签
 * 
 * @extends Point
  * @category Feature
 */
export class Label extends Point {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string = 'Label';

    /**
     * Create a label feature.
     * 创建标签要素
     * 
     * @param options Label configuration options
     *                标签配置选项
     */
    constructor(options: MarkerOptions) {
        super(options);
    }

    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     * 
     * @returns Promise<void>
     * 
     * @description
     * Creates text label geometry based on style configuration.
     * 
     * 根据样式配置创建文本标签几何体
     */
    async _buildRenderObject(): Promise<void> {
        this._worldCoordinates = this._coordsTransform() as Vector3;
        if (this._style) {
            if (this._renderObject) {
                this._disposeGeometry();
            }

            this._renderObject = await this._createObject(this._style);
            this._refreshCoordinates();
        }
    }

    /**
     * Quickly update geometry vertex positions (without rebuilding the entire geometry).
     * 快速更新几何体顶点位置（不重建整个几何体）
     * 
     * @description
     * Used for real-time interactions like dragging and editing. Updates only Label position without destroying and rebuilding geometry.
     * 
     * 用于拖拽、编辑等实时交互场景，仅更新Label的位置而不销毁重建几何体。
     */
    protected _refreshCoordinates(): void {
        // Recalculate coordinates
        this._worldCoordinates = this._coordsTransform() as Vector3;

        // If geometry exists, only update position
        if (this._renderObject) {
            // Update position
            this._renderObject.position.copy(this._worldCoordinates as Vector3);
            
            // Ensure geometry is in the scene (Critical: prevent disappearance during editing)
            if (!this.children.includes(this._renderObject as Object3D)) {
                this.add(this._renderObject);
            }
            
            // Force update matrix
            this.updateMatrixWorld(true);
            this._renderObject.updateMatrixWorld(true);
        } else {
            // If geometry doesn't exist, call full rebuild
            this._buildRenderObject();
        }
    }

    /**
     * Create label object.
     * 创建标签对象
     * 
     * @param style Style configuration
     *              样式配置
     * @returns Created label object
     *          创建的标签对象
     * @throws Throws error if style type is not supported
     *         如果样式类型不支持会抛出错误
     * 
     * @description
     * Supports two label types:
     * - 'canvas-label-fixed': Fixed size label
     * - 'canvas-label': Dynamic size label
     * 
     * 支持两种标签类型：
     * - 'canvas-label-fixed': 固定大小标签
     * - 'canvas-label': 动态大小标签
     */
    async _createObject(style: Style): Promise<Object3D> {
        switch (style.config.type) {
            case 'canvas-label-fixed':
                return _createFixedSizeTextSprite(
                    style.config, 
                    new Vector3(0, 0, 0), 
                    this.getMap() as Map
                );
            case 'canvas-label':
                return _createTextSprite(
                    style.config, 
                    new Vector3(0, 0, 0)
                );
            default:
                throw new Error(`Unsupported style type: ${style.config.type}`);
        }
    }
}

// 合并默认配置
Label.mergeOptions(options);