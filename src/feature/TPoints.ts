import { Vector3 } from "three";
import { PointOptions, Point } from "./Point";
import { _createClouds,createLight } from "../utils/createobject";
import { Map } from '../map';
import { Paint } from "../style";

/**
 * TPoints feature configuration options.
 * TPoints要素配置选项
 * 
 * @extends PointOptions
  * @category Feature
 */
export type TPointsOptions = PointOptions & {
    /**
     * Geometry data.
     * 几何数据
     */
    geometries?: any;
};

/**
 * Default TPoints configuration.
 * 默认TPoints配置
 */
const options: TPointsOptions = {
    
};

/**
 * TPoints feature class (Clouds/Lights).
 * TPoints要素类 (云朵/灯光)
 * 
 * @description
 * Represents TPoints features in 3D scene, inheriting from Point class.
 * Provides creation, update, and rendering functions for TPoints.
 * 表示3D场景中的TPoints要素，继承自Point类。
 * 提供TPoints的创建、更新和渲染功能。
 * 
 * @extends Point
  * @category Feature
 */
export class TPoints extends Point {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string = "TPoints";
    
    /**
     * Geometry data.
     * 几何数据
     */
    _geometries: any;

    /**
     * Create a TPoints feature instance.
     * 创建TPoints要素实例
     * 
     * @param options TPoints configuration options
     *                TPoints配置选项
     */
    constructor(options: TPointsOptions) {
        super(options);
        this._geometries = options.geometries;

    }

    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     * 
     * @returns Promise<void>
     * 
     * @description
     * Create TPoints geometry based on style configuration.
     * 根据样式配置创建TPoints几何体
     */
    async _buildRenderObject(): Promise<void> {
        this._worldCoordinates = this._coordsTransform() as Vector3;
        if (this._paint) {
            if (this._renderObject) {
                this._disposeGeometry();
            }

            this._renderObject = await this._createObject(this._paint) as any;
            this._refreshCoordinates();
        }
    }

    /**
     * Update geometry (override parent method).
     * 更新几何体（重写父类方法）
     * 
     * @description
     * Add TPoints geometry to the container, and set position and render order.
     * 将TPoints几何体添加到容器中，并设置位置和渲染顺序
     */
    override _refreshCoordinates(): void {

        // console.log(this._renderObject,'灯');

        // this._disposeGeometry();
        // const layer = this.getLayer();

        if (this._renderObject) {
            // this._renderObject.position.copy(this._worldCoordinates as any);
            // this._renderObject.renderOrder = 1000;
            
            // if (layer) {
            //     layer._clouds.add(this._renderObject);
            //     layer._clouds.updateMatrixWorld();
            // }
            if ((this._renderObject as any).points) {
                this.add((this._renderObject as any).points);
            }
            if ((this._renderObject as any).InstancedCol) {
                this.add((this._renderObject as any).InstancedCol);
            }
            this.updateMatrixWorld(true);
        }
    }

    /**
     * Create TPoints object.
     * 创建TPoints对象
     * 
     * @param style Style configuration
     *              样式配置
     * @returns Created TPoints object
     *          创建的TPoints对象
     * @throws Throws error if style type is not supported
     *         如果样式类型不支持会抛出错误
     * 
     * @private
     */
    async _createObject(paint: Paint): Promise<any> {
        switch (paint.config.type) {
            case "light":
                return createLight(paint.config, this._geometries, this.getMap() as Map);
            default:
                throw new Error(`Unsupported style type: ${paint.config.type}`);
        }
    }
}

// Merge default options
// 合并默认配置
TPoints.mergeOptions(options);
