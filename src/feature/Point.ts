import { Vector3, BufferGeometry, Points, PointsMaterial, Object3D } from 'three';
import { Feature, FeatureOptions } from './Feature';
import { Point as GeoJSONPoint, MultiPoint as GeoJSONMultiPoint } from 'geojson';

/**
 * Point feature configuration options.
 * 点要素配置选项
 * 
 * @extends FeatureOptions
  * @category Feature
 */
export type PointOptions = FeatureOptions & {
    /**
     * GeoJSON point geometry data.
     * GeoJSON点几何数据
     */
    geometry?: GeoJSONPoint | GeoJSONMultiPoint;
};

/**
 * Point feature abstract base class.
 * 点要素抽象基类
 * 
 * @description
 * Represents a point feature in the 3D scene, inheriting from the Feature class.
 * Provides basic functionality for point features, including:
 * - Coordinate transformation
 * - Point geometry creation
 * 
 * 表示3D场景中的点要素，继承自Feature类
 * 提供点要素的基础功能，包括：
 * - 坐标转换
 * - 点几何体创建
 * 
 * @abstract
 * @extends Feature
 * @category Feature
 */
export abstract class Point extends Feature {
    /**
     * Base type identifier.
     * 基础类型标识
     */
    readonly _baseType = "Point";

    /**
     * Specific point type identifier (implemented by subclasses).
     * 具体点类型标识（由子类实现）
     */
    abstract _type: string;

    /**
     * Create a Point feature instance.
     * 创建点要素实例
     * 
     * @param options Point feature configuration
     *                点要素配置
     */
    constructor(options: PointOptions) {
        super(options);
        this._threeGeometry = this._createThreeGeometry();
        if (this._style) {
            this._style.applyTo(this._threeGeometry);
        }
    }

    /**
     * Coordinate transformation method.
     * 坐标转换方法
     * 
     * @returns Transformed world coordinates
     *          转换后的世界坐标
     * 
     * @description
     * Converts geographic coordinates to world coordinates.
     * 
     * 将地理坐标转换为世界坐标
     */
    _coordsTransform(): Vector3 {
        const map = this.getMap();
        const coordinates = new Vector3(
            this._geometry.coordinates[0] as number,
            this._geometry.coordinates[1] as number,
            this._geometry.coordinates[2] as number || 0 // Default height 500
        );

        return map ? map.geo2world(coordinates) : coordinates;
    }

    /**
     * Convert feature to Three.js geometry (abstract method).
     * 将要素转换为Three.js几何体（抽象方法）
     * 
     * @abstract
     */
    _toThreeJSGeometry() {
        // Implemented by subclasses
    }

    /**
     * Quickly update geometry vertex positions (without rebuilding the entire geometry).
     * 快速更新几何体顶点位置（不重建整个几何体）
     * 
     * @description
     * Used for real-time interactions like editing. Updates only point position without destroying and rebuilding geometry.
     * This is much faster than full rebuild and keeps the feature visible during editing.
     * 
     * 用于编辑等实时交互场景，仅更新点的位置而不销毁重建几何体。
     * 这比完整重建快得多，并且能保持feature在编辑过程中可见。
     */
    protected _updateGeometryPositions(): void {
        // Recalculate coordinates
        const worldPos = this._coordsTransform();
        this._position = worldPos;

        // If geometry exists, only update position
        if (this._threeGeometry) {
            // Update geometry position
            const map = this.getMap();
            if (map?.prjcenter) {
                this._threeGeometry.position.copy(worldPos).sub(map.prjcenter as Vector3);
            } else {
                this._threeGeometry.position.copy(worldPos);
            }

            // Ensure geometry is in the scene (Critical: prevent disappearance during editing)
            if (!this.children.includes(this._threeGeometry as Object3D)) {
                this.add(this._threeGeometry);
            }

            // Force update matrix
            this.updateMatrixWorld(true);
        } else {
            // If geometry doesn't exist, call full rebuild
            this._toThreeJSGeometry();
        }
    }

    /**
     * Create basic point geometry.
     * 创建基础点几何体
     * 
     * @returns Points instance
     *          Points实例
     * 
     * @protected
     * @description
     * Creates point geometry with default material. Subclasses can extend or override this method.
     * 
     * 创建带有默认材质的点几何体，子类可扩展或重写此方法
     */
    protected _createThreeGeometry() {
        return new Points(
            new BufferGeometry(),
            new PointsMaterial({ size: 1, color: 0x888888 })
        );
    }
}