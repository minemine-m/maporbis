import { Vector3, Color } from "three";
import { PointData, PointInstance, FeatureInfo } from "./BucketTypes";
import { LayoutFeature } from "../layout";

/**
 * Point Bucket
 * 点桶
 *
 * @description
 * Collects and processes Point/MultiPoint features.
 * Generates instance data for InstancedMesh rendering.
 *
 * 收集和处理 Point/MultiPoint 要素。
 * 生成用于 InstancedMesh 渲染的实例数据。
 */
export class PointBucket {
    private _data: PointData;

    constructor() {
        this._data = {
            instances: [],
            features: []
        };
    }

    /**
     * Add a point feature from Layout output
     * 从 Layout 输出添加点要素
     */
    addFeatureFromLayout(layoutFeature: LayoutFeature, paint: any): void {
        const featureInfo: FeatureInfo = {
            id: layoutFeature.id,
            properties: layoutFeature.properties,
            startIndex: this._data.instances.length,
            vertexCount: 0
        };

        layoutFeature.worldCoordinates.forEach((ring: Vector3[]) => {
            ring.forEach((point: Vector3) => {
                // Scale calculation
                let scale = 1;
                const size = paint.size;
                const pixelsToUnit = 0.002;

                if (size !== undefined) {
                    if (paint.type === 'icon') {
                        scale = (size * pixelsToUnit) / 10;
                    } else {
                        const radius = paint.radius || 3;
                        scale = radius / 5;
                    }
                } else {
                    scale = paint.radius ? (paint.radius / 5) : 1;
                }

                const color = paint.color ? new Color(paint.color) : undefined;

                this._data.instances.push({
                    position: point.clone(),
                    scale,
                    rotation: 0,
                    color
                });
            });
        });

        featureInfo.vertexCount = this._data.instances.length - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            this._data.features.push(featureInfo);
        }
    }

    /**
     * Add a point feature (legacy interface)
     * 添加点要素（旧接口）
     */
    addFeature(
        geometry: any,
        properties: any,
        id: any,
        paint: any,
        map: any,
        prjCenter: Vector3
    ): void {
        const coords = geometry.coordinates;
        const pointsList = geometry.type === 'MultiPoint' ? coords : [coords];

        const pcx = prjCenter.x;
        const pcy = prjCenter.y;
        const pcz = prjCenter.z;

        const featureInfo: FeatureInfo = {
            id,
            properties,
            startIndex: this._data.instances.length,
            vertexCount: 0
        };

        const tempVec3 = new Vector3();

        pointsList.forEach((pt: any) => {
            tempVec3.set(pt[0], pt[1], pt[2] || 0);
            const worldPos = map.lngLatToWorld(tempVec3);

            worldPos.x -= pcx;
            worldPos.y -= pcy;
            worldPos.z -= pcz;

            // Scale calculation
            let scale = 1;
            const size = paint.size;
            const pixelsToUnit = 0.002;

            if (size !== undefined) {
                if (paint.type === 'icon') {
                    scale = (size * pixelsToUnit) / 10;
                } else {
                    const radius = paint.radius || 3;
                    scale = radius / 5;
                }
            } else {
                scale = paint.radius ? (paint.radius / 5) : 1;
            }

            const color = paint.color ? new Color(paint.color) : undefined;

            this._data.instances.push({
                position: worldPos,
                scale,
                rotation: 0,
                color
            });
        });

        featureInfo.vertexCount = this._data.instances.length - featureInfo.startIndex;
        if (featureInfo.vertexCount > 0) {
            this._data.features.push(featureInfo);
        }
    }

    /**
     * Get point data
     * 获取点数据
     */
    getData(): PointData {
        return this._data;
    }

    /**
     * Check if bucket has data
     * 检查桶是否有数据
     */
    hasData(): boolean {
        return this._data.instances.length > 0;
    }

    /**
     * Get instance count
     * 获取实例数量
     */
    getInstanceCount(): number {
        return this._data.instances.length;
    }

    /**
     * Get feature count
     * 获取要素数量
     */
    getFeatureCount(): number {
        return this._data.features.length;
    }

    /**
     * Clear bucket data
     * 清空桶数据
     */
    clear(): void {
        this._data.instances = [];
        this._data.features = [];
    }
}
