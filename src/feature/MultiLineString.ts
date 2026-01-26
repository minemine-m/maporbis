import { Group, Mesh } from 'three';
import { LineOptions, Line } from './Line';
import { _createBasicLine, _createFlowLine, _createArrowLine, _createFlowTextureLine } from '../utils/createobject';
import { Line2 } from 'three-stdlib';
import { Paint } from '../style';
import { MultiLineString as GeoJSONMultiLineString } from 'geojson';
import { Vector3 } from 'three';

/**
 * Multi-line feature configuration options.
 * 多线要素配置选项
 * 
 * @extends LineOptions
  * @category Feature
 */
export type MultiLineStringOptions = LineOptions & {
    // Add multi-line specific configuration items
    // 可添加多线特有的配置项
};

/**
 * Default multi-line configuration.
 * 默认多线配置
 */
const options: MultiLineStringOptions = {
    // Default configuration items
    // 默认配置项
};

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
export class MultiLineString extends Line {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string = 'MultiLineString';
    
    /**
     * Array storing all line objects.
     * 存储所有线对象的数组
     */
    private _lineObjects: (Line2 | Mesh)[] = [];
    
    /**
     * Container group containing all line objects.
     * 包含所有线对象的容器组
     */
    private _linesContainer: Group;

    /**
     * Create a MultiLineString feature instance.
     * 创建多线要素实例
     * 
     * @param options Multi-line configuration options
     *                多线配置选项
     */
    constructor(options: MultiLineStringOptions) {
        super(options);
        this._linesContainer = new Group();
    }

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
    async _buildRenderObject(): Promise<void> {
        debugger
        const { _worldCoordinates } = this._coordsTransform();
        const map = this.getMap();

        // Clear existing line objects
        // 清除现有的线对象
        this.clearLines();
        this._disposeGeometry();

        if (this._paint) {
            // Create separate geometry for each line
            // 为每条线创建单独的几何体
            for (const linePositions of _worldCoordinates as Vector3[][]) {
                const vertexPoints = linePositions.flatMap(v => [v.x, v.y, v.z]);
                const lineObject = await this._createLineObject(this._paint, vertexPoints);
                lineObject.position.add(map?.prjcenter as Vector3);
                lineObject.updateMatrixWorld(true);
                
                // Set render order for each line
                // 设置每条线的渲染顺序
                lineObject.renderOrder = 99;
                this._lineObjects.push(lineObject);
                this._linesContainer.add(lineObject);

            }
            // Set container group render order and attach as geometry object to Feature
            // 统一设置容器组的渲染顺序，并作为几何对象挂到 Feature 上
            this._linesContainer.renderOrder = 99;
            this._renderObject = this._linesContainer;
            this.add(this._renderObject);
            this._updateContainer();
            this.updateMatrixWorld(true);
            this._renderObject.updateMatrixWorld(true);
            this._tryProcessQueue();
        }
    }

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
    private async _createLineObject(paint: Paint, vertexPoints: number[]): Promise<Line2 | Mesh> {
        switch (paint.config.type) {
            case 'line':
                return _createBasicLine(paint.config, vertexPoints);
            case 'flow-tube':
                return _createFlowLine(paint.config, vertexPoints);
            case 'arrow':
                return _createArrowLine(paint.config, vertexPoints);
            case 'flow-texture':
                return await _createFlowTextureLine(paint.config as any, vertexPoints);
            default:
                throw new Error(`Unsupported style type: ${paint.config.type}`);
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
     * Convert geographic coordinates to world coordinates and calculate coordinates relative to map center.
     * 将地理坐标转换为世界坐标，并计算相对于地图中心的坐标
     */
    _coordsTransform(): any {
        const map = this.getMap();
        const geometry = this._geometry as GeoJSONMultiLineString;

        if (this._geometry.type === 'MultiLineString') {
            const center = map?.prjcenter as Vector3;
            const _worldCoordinates = geometry.coordinates.map(line => {
                return line.map(coord => {
                    const vec = new Vector3(coord[0], coord[1], coord[2] || 0);
                    const worldPos = map ? map.lngLatToWorld(vec) : vec;
                    return worldPos.sub(center);
                });
            });

            return { _worldCoordinates };
        }
    }

    /**
     * Update container status.
     * 更新容器状态
     * 
     * @private
     * @description
     * Update matrix and boundary information of the container group.
     * 更新容器组的矩阵和边界信息
     */
    private _updateContainer() {
        this._linesContainer.updateMatrixWorld(true);
    }

    /**
     * Clear all line objects.
     * 清除所有线对象
     * 
     * @private
     * @description
     * Remove and dispose resources of all line objects.
     * 移除并释放所有线对象的资源
     */
    private clearLines() {
        this._lineObjects.forEach(line => {
            this._linesContainer.remove(line);
            if (line.geometry) line.geometry.dispose();
            if (line.material) {
                if (Array.isArray(line.material)) {
                    line.material.forEach(mat => mat.dispose());
                } else {
                    line.material.dispose();
                }
            }
        });
        this._lineObjects = [];
    }

    /**
     * Update geometry.
     * 更新几何体
     * 
     * @description
     * For multi-line features, simply recreating all lines is easier.
     * 对于多线要素，直接重新创建所有线更简单
     */
    protected _refreshCoordinates() {
        this._buildRenderObject();
    }

    /**
     * Dispose object resources.
     * 释放对象资源
     * 
     * @description
     * Clean up resources used by multi-line feature.
     * 清理多线要素使用的资源
     */
    _disposeObject() {
        // Add specific resource cleanup logic if needed
        // 可添加特定资源清理逻辑
    }
}

// Merge default options
// 合并默认配置
MultiLineString.mergeOptions(options);