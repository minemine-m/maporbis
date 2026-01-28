import { Object3D } from 'three';
import { _createBasePolygon, _createExtrudedPolygon, _createWaterSurface, _createBaseWaterSurface } from '../utils/createobject';
import { Paint } from '../style';
import { Surface, SurfaceOptions } from './Surface';
import { Polygon as GeoJSONPolygon, MultiPolygon as GeoJSONMultiPolygon } from 'geojson';
import { Map } from '../map';

/**
 * Polygon feature configuration options.
 * 多边形要素配置选项
 * 
 * @extends SurfaceOptions
  * @category Feature
 */
export type PolygonOptions = SurfaceOptions & {
    /**
     * GeoJSON polygon geometry data.
     * GeoJSON多边形几何数据
     */
    geometry?: GeoJSONPolygon | GeoJSONMultiPolygon;
};

/** Default Polygon feature configuration */
const options: PolygonOptions = {
    // Default config items
};

/**
 * Polygon feature class.
 * 多边形要素类
 * 
 * @description
 * Represents a polygon feature in the 3D scene, inheriting from the Surface class.
 * Supports various polygon styles:
 * - Basic polygon
 * - Extruded polygon
 * - Water surface effect
 * - Basic water surface effect
 * 
 * 表示3D场景中的多边形要素，继承自Surface类
 * 提供多种多边形样式支持：
 * - 基础多边形
 * - 挤出多边形
 * - 水面效果
 * - 基础水面效果
 * 
 * @extends Surface
 * @category Feature
 */
export class Polygon extends Surface {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string = 'Polygon';

    /**
     * Create a Polygon feature instance.
     * 创建多边形要素实例
     * 
     * @param options Polygon configuration
     *                多边形配置
     */
    constructor(options: PolygonOptions) {
        super(options);
    }

    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     * 
     * @returns Promise<void>
     * 
     * @description
     * Creates polygon geometry based on style configuration and performs coordinate transformation.
     * 
     * 根据样式配置创建多边形几何体，并进行坐标转换
     */
    async _buildRenderObject(): Promise<void> {
        let { _vertexPoints } = this._coordsTransform();
        this._vertexPoints = _vertexPoints;

        if (this._paint) {
            if (this._renderObject) {
                this.remove(this._renderObject);
            }

            this._renderObject = await this._createObject(this._paint);

            // Position the render object in the scene
            // Don't call _refreshCoordinates() here to avoid infinite recursion
            const map = this.getMap();
            if (map && this._renderObject) {
                this._renderObject.position.add(map.prjcenter as any);
                this._renderObject.updateMatrix();
                this.add(this._renderObject);
            }
            
            await this._paint.applyTo(this._renderObject);
        }
    }

    /**
     * Quickly update geometry vertex positions (without rebuilding the entire geometry).
     * 快速更新几何体顶点位置（不重建整个几何体）
     * 
     * @description
     * Used for real-time interactions like dragging and editing.
     * For basic-polygon type, implements quick update to avoid rebuild;
     * For complex types (extrude/water), still calls full rebuild.
     * 
     * 用于拖拽、编辑等实时交互场景。
     * 对于basic-polygon类型，实现快速更新避免重建；
     * 对于复杂类型（extrude/water），仍然调用完整重建。
     */
    protected _refreshCoordinates(): void {
        // For all polygon types, avoid full rebuild during coordinate refresh
        // Instead, only update the existing render object's position
        if (this._renderObject) {
            // Recalculate world coordinates
            let { _vertexPoints } = this._coordsTransform();
            this._vertexPoints = _vertexPoints;
            
            const map = this.getMap();
            
            // Clear existing children
            this.clear();
            
            // Re-add with updated position
            if (map && map.prjcenter) {
                this._renderObject.position.set(0, 0, 0);
                this._renderObject.position.add(map.prjcenter as any);
                this._renderObject.updateMatrix();
            }
            
            this.add(this._renderObject);
            
            // Force update matrix
            this.updateMatrixWorld(true);
            this._renderObject.updateMatrixWorld(true);
            
            return;
        }
        
        // If no render object exists, perform full rebuild
        console.warn('[Polygon] _refreshCoordinates: No render object, calling full rebuild');
        this._buildRenderObject();
    }

    /**
     * Create polygon object.
     * 创建多边形对象
     * 
     * @param style Style configuration
     *              样式配置
     * @returns Created polygon object
     *          创建的多边形对象
     * @throws Throws error if style type is not supported
     *         如果样式类型不支持会抛出错误
     * 
     * @description
     * Supported style types:
     * - 'basic-polygon': Basic polygon
     * - 'extrude-polygon': Extruded polygon
     * - 'water': Water surface effect
     * - 'base-water': Basic water surface effect
     * 
     * 支持以下样式类型：
     * - 'basic-polygon': 基础多边形
     * - 'extrude-polygon': 挤出多边形
     * - 'water': 水面效果
     * - 'base-water': 基础水面效果
     */
    async _createObject(paint: Paint): Promise<Object3D> {
        switch (paint.config.type) {
            case 'fill':
                return _createBasePolygon(paint.config, this._vertexPoints);
            case 'extrusion':
                return _createExtrudedPolygon(paint.config, this._vertexPoints);
            case 'water':
                return _createWaterSurface(paint.config, this.getMap() as Map, this._vertexPoints);
            case 'water-simple':
                return _createBaseWaterSurface(paint.config, this._vertexPoints);
            default:
                throw new Error(`Unsupported style type: ${paint.config.type}`);
        }
    }
    /**
     * Calculate collision bounding box.
     * 计算碰撞检测包围盒
     * 
     * @returns Collision bounding box
     *          碰撞检测包围盒
     */
    _calculateCollisionBoundingBox(): any | null {
        return null;
    }
}

// 合并默认配置
Polygon.mergeOptions(options);