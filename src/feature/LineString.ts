import { Object3D, Vector3 } from 'three';
import { LineOptions, Line } from './Line';
import { _createBasicLine, _createFlowLine, _createArrowLine, _createFlowTextureLine } from '../utils/createobject';
import { Line2 } from 'three-stdlib';
import { Style } from '../style';

/**
 * LineString feature configuration options.
 * 线要素配置选项
 * 
 * @extends LineOptions
  * @category Feature
 */
export type LineStringOptions = LineOptions & {
    // type?: 'circle' | 'icon'; // Config items specific to LineString can be added
};

/** Default LineString feature configuration */
const options: LineStringOptions = {
    // type: 'circle', // Defaults to Point geometry
};

/**
 * LineString feature class.
 * 线要素类
 * 
 * @description
 * Represents a line feature in the 3D scene, inheriting from the Line base class.
 * Provides functionality for creating, updating, and rendering line features, supporting basic line styles.
 * 
 * 表示3D场景中的线要素，继承自Line基类
 * 提供线要素的创建、更新和渲染功能，支持基础线样式
 * 
 * @extends Line
 * @category Feature
 */
export class LineString extends Line {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string = 'LineString';

    /**
     * Create a LineString feature instance.
     * 创建线要素实例
     * 
     * @param options Configuration options for the line feature
     *                线要素配置
     */
    constructor(options: LineStringOptions) {
        super(options);
    }

    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     * 
     * @returns Promise<void>
     * 
     * @description
     * Creates line geometry based on style configuration and performs coordinate transformation.
     * 
     * 根据样式配置创建线几何体，并进行坐标转换
     */
    async _toThreeJSGeometry(): Promise<void> {
        // console.log(this._geometry, '_geometry  线要素')

        let { _vertexPoints } = this._coordsTransform(); // Perform coordinate transformation
        this._vertexPoints = _vertexPoints;

        if (this._style) {
            if (this._threeGeometry) {
                this._disposeGeometry();
            }

            this._threeGeometry = await this._createObject(this._style);
            this._updateGeometry();
        }
    }

    /**
     * Quickly update geometry vertex positions (without rebuilding the entire geometry).
     * 快速更新几何体顶点位置（不重建整个几何体）
     * 
     * @description
     * Used for real-time interactions like dragging and editing. Updates only Line2 vertex positions without destroying and rebuilding geometry.
     * This is much faster than full rebuild and keeps the feature visible during dragging.
     * 
     * 用于拖拽、编辑等实时交互场景，仅更新Line2的顶点位置而不销毁重建几何体。
     * 这比完整重建快得多，并且能保持feature在拖拽过程中可见。
     */
    protected _updateGeometryPositions(): void {
        // Recalculate coordinates
        let { _vertexPoints } = this._coordsTransform();
        this._vertexPoints = _vertexPoints;

        // Check if geometry is Line2 type (using isLine2 property is more reliable)
        const isLine2Type = this._threeGeometry && 
            ((this._threeGeometry as any).isLine2 || this._threeGeometry instanceof Line2);

        // If geometry exists and is Line2 type, only update vertex positions (Critical: do not call _disposeGeometry)
        if (isLine2Type) {
            const line2 = this._threeGeometry as Line2;
            const geometry = line2.geometry;

            // Update geometry coordinates
            geometry.setPositions(this._vertexPoints);

            // Recalculate bounding info
            geometry.computeBoundingSphere();
            geometry.computeBoundingBox();

            // Update position (relative to map center)
            const map = this.getMap();
            if (map?.prjcenter) {
                // Note: Copy directly, do not use sub or add to avoid accumulated offset
                this._threeGeometry.position.set(
                    (map.prjcenter as Vector3).x,
                    (map.prjcenter as Vector3).y,
                    (map.prjcenter as Vector3).z
                );
            }

            // Ensure geometry is in the scene
            if (!this.children.includes(this._threeGeometry as Object3D)) {
                this.add(this._threeGeometry);
            }

            // Force update matrix
            this.updateMatrixWorld(true);
            this._threeGeometry.updateMatrixWorld(true);
        } else {
            // If geometry doesn't exist or type mismatch, call full rebuild
            console.warn('[LineString] _updateGeometryPositions: Geometry type mismatch, fallback to full rebuild', {
                hasGeometry: !!this._threeGeometry,
                geometryType: this._threeGeometry?.constructor?.name,
                isLine2: (this._threeGeometry as any)?.isLine2
            });
            this._toThreeJSGeometry();
        }
    }

    /**
     * Create line object.
     * 创建线对象
     * 
     * @param style - Style configuration 样式配置
     * @returns Created line object 创建的线对象
     * @throws Throws error if style type is not supported 如果样式类型不支持会抛出错误
     * 
     * @description
     * Currently supported style types:
     * - 'basic-line': Basic line style
     * 
     * 当前支持样式类型：
     * - 'basic-line': 基础线样式
     */
    async _createObject(style: Style): Promise<Object3D> {
        switch (style.config.type) {
            case 'basic-line':
                return _createBasicLine(style.config, this._vertexPoints);
            case 'flow-tube-line':
                return _createFlowLine(style.config, this._vertexPoints);
            case 'arrow-line':
                return _createArrowLine(style.config, this._vertexPoints);
            case 'flow-texture-line':
                return await _createFlowTextureLine(style.config as any, this._vertexPoints);
            default:
                throw new Error(`Unsupported style type: ${style.config.type}`);
        }
    }

    /**
     * Update geometry.
     * 更新几何体
     * 
     * @description
     * Updates line geometry vertex coordinates and recalculates bounding info.
     * Automatically handles position relationship with map center.
     * 
     * 更新线几何体的顶点坐标，并重新计算边界信息
     * 自动处理与地图中心的位置关系
     */
    _updateGeometry() {
        const map = this.getMap();
        // this._disposeGeometry(); // Commented out to avoid double disposal of newly created geometry (bug fix)
        // 这里的_disposeGeometry()会导致刚创建的几何体被销毁，因为_toThreeJSGeometry中已经调用了_disposeGeometry()处理旧几何体
        // 并且this._threeGeometry此时已经是新创建的几何体对象了

        if (this._threeGeometry) {
            if (this._threeGeometry instanceof Line2) {
                const line2 = this._threeGeometry as Line2;
                const geometry = line2.geometry;

                // Update geometry coordinates
                geometry.setPositions(this._vertexPoints);

                // Recalculate bounding info
                geometry.computeBoundingSphere();
                geometry.computeBoundingBox();
            }

            // Adjust position to map center
            this._threeGeometry.position.add(map?.prjcenter as Vector3);
            // Adjust renderOrder
            this._threeGeometry.renderOrder = 99;
            this.add(this._threeGeometry);
            this.updateMatrixWorld(true);
            this._tryProcessQueue();
        }
    }
}

// 合并默认配置
LineString.mergeOptions(options);