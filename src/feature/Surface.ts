import { Vector2, Vector3 } from 'three';
import { Feature, FeatureOptions } from './Feature';
import { Polygon as GeoJSONPolygon, MultiPolygon as GeoJSONMultiPolygon } from 'geojson';
import { Line2, LineMaterial, LineGeometry } from 'three-stdlib';
import { Coordinate } from '../types';

/**
 * Surface feature configuration options.
 * 表面要素配置选项
 * 
 * @extends FeatureOptions
  * @category Feature
 */
export type SurfaceOptions = FeatureOptions & {
    /**
     * GeoJSON polygon geometry data.
     * GeoJSON多边形几何数据
     */
    geometry?: GeoJSONPolygon | GeoJSONMultiPolygon;
};

/**
 * Surface feature abstract base class.
 * 表面要素抽象基类
 * 
 * @description
 * Represents a surface feature in the 3D scene, inheriting from the Feature class.
 * Provides basic functionality for polygon surface features, including:
 * - Coordinate transformation
 * - Geometry creation
 * - Style application
 * 
 * 表示3D场景中的表面要素，继承自Feature类
 * 提供多边形表面要素的基础功能，包括：
 * - 坐标转换
 * - 几何体创建
 * - 样式应用
 * 
 * @abstract
 * @extends Feature
  * @category Feature
 */
export abstract class Surface extends Feature {
    /**
     * Base type identifier.
     * 基础类型标识
     */
    readonly _baseType = "Surface";

    /**
     * Specific surface type identifier (implemented by subclasses).
     * 具体表面类型标识（由子类实现）
     */
    abstract _type: string;

    /**
     * Array of vertex coordinates.
     * 顶点坐标数组
     */
    _vertexPoints: number[];

    /**
     * Create a Surface feature instance.
     * 创建表面要素实例
     * 
     * @param options Surface configuration
     *                表面配置
     */
    constructor(options: SurfaceOptions) {
        super(options);
        this._threeGeometry = this._createThreeGeometry();
        this._vertexPoints = [0, 0, 0];
        if (this._style) {
            this._style.applyTo(this._threeGeometry);
        }
    }

    /**
     * Coordinate transformation method.
     * 坐标转换方法
     * 
     * @returns Transformed coordinate information
     *          转换后的坐标信息
     * 
     * @description
     * Handles coordinate transformation for Polygon and MultiPolygon, returning:
     * - _positions: Array of transformed coordinates
     * - _vertexPoints: Array of flattened vertex coordinates
     * 
     * 处理多边形和多面体的坐标转换，返回：
     * - _positions: 转换后的坐标数组
     * - _vertexPoints: 展平的顶点坐标数组
     * 
     * @throws Throws error if geometry type is not supported
     *         如果几何类型不支持会抛出错误
     */
    _coordsTransform(): any {
        const map = this.getMap();
        const center = map?.prjcenter as Vector3;
        const geometry = this._geometry;
        if (!geometry) throw new Error('Geometry data undefined');

        // Handle Polygon
        if (geometry.type === 'Polygon') {
            const coordinates = geometry.coordinates as Coordinate[][];
            let _positions: Vector3[][] = [];
            let _vertexPoints: number[] = [];

            coordinates.forEach(ring => {
                const ringPositions = ring.map(coord => {
                    const vec = new Vector3(coord[0], coord[1], coord[2] || 0);
                    const worldPos = map ? map.geo2world(vec) : vec;
                    return worldPos.sub(center);
                });
                _positions.push(ringPositions);
                _vertexPoints.push(...ringPositions.flatMap(v => [v.x, v.y, v.z]));
            });

            return { _positions, _vertexPoints };
        }
        // Handle MultiPolygon
        else if (geometry.type === 'MultiPolygon') {
            const coordinates = geometry.coordinates as Coordinate[][][];
            let _positions: Vector3[][][] = [];
            let _vertexPoints: number[] = [];

            coordinates.forEach(polygon => {
                const polygonPositions: Vector3[][] = [];
                polygon.forEach(ring => {
                    const ringPositions = ring.map(coord => {
                        const vec = new Vector3(coord[0], coord[1], coord[2] || 0);
                        const worldPos = map ? map.geo2world(vec) : vec;
                        return worldPos.sub(center);
                    });
                    polygonPositions.push(ringPositions);
                    _vertexPoints.push(...ringPositions.flatMap(v => [v.x, v.y, v.z]));
                });
                _positions.push(polygonPositions);
            });

            return { _positions, _vertexPoints };
        } else {
            throw new Error(`Unsupported geometry type: ${geometry.type}`);
        }
    }

    /**
     * Update geometry.
     * 更新几何体
     * 
     * @description
     * Updates geometry based on current style type:
     * - 'basic-polygon': Basic polygon
     * - 'extrude-polygon': Extruded polygon
     * - 'water': Water surface effect
     * 
     * 根据当前样式类型更新几何体：
     * - 'basic-polygon': 基础多边形
     * - 'extrude-polygon': 挤出多边形
     * - 'water': 水面效果
     */
    _updateGeometry(): void {
        const styletype = this._style?.config.type;
        this.clear();

        if (!this._threeGeometry || !this._vertexPoints?.length) {
            console.warn('Cannot update geometry: missing geometry or vertex data');
            return;
        }

        // const mesh = this._threeGeometry as Mesh;
        // const geometry = mesh.geometry as BufferGeometry;
        const map = this.getMap();

        try {
            if (styletype === 'basic-polygon') {
                // basic-polygon is now same as water/base-water:
                // _createBasePolygon has completed triangulation, here only responsible for displacement to map center
                this._threeGeometry.renderOrder = 90;
                this._threeGeometry.position.add(map?.prjcenter as Vector3);
                this._threeGeometry.updateMatrix();
                this.add(this._threeGeometry);
            }
            else if (styletype === 'extrude-polygon' || styletype?.includes('water')) {
                this._threeGeometry.renderOrder = 90;
                this._threeGeometry.position.add(map?.prjcenter as Vector3);
                this._threeGeometry.updateMatrix();
                this.add(this._threeGeometry);
            }
        } catch (error) {
            console.error('Failed to update polygon position:', error);
            throw error;
        }
    }



    /**
     * Create basic geometry.
     * 创建基础几何体
     * 
     * @returns Line2 instance
     *          Line2实例
     * 
     * @protected
     * @description
     * Creates line geometry with default material. Subclasses can extend or override this method.
     * 
     * 创建带有默认材质的线几何体，子类可扩展或重写此方法
     */
    protected _createThreeGeometry() {
        const geometry = new LineGeometry();
        const material = new LineMaterial({
            color: 0x888888,
            linewidth: 0.1,
            dashed: false,
            resolution: new Vector2(window.innerWidth, window.innerHeight)
        });
        return new Line2(geometry, material);
    }
}