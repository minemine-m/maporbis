import { Vector3, Object3D, AnimationClip, Camera, WebGLRenderer } from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import { Point, PointOptions } from './Point';
import { ModelType } from '../loaders/model';
/**
 * Animation configuration options.
 * 动画配置选项
 */
export interface AnimationOptions {
    /**
     * Auto-play first animation.
     * 自动播放第一个动画
     */
    autoPlay?: boolean;
    /**
     * Loop animation.
     * 循环播放
     */
    loop?: boolean;
    /**
     * Animation index to play.
     * 要播放的动画索引
     */
    clipIndex?: number;
    /**
     * Animation name to play.
     * 要播放的动画名称
     */
    clipName?: string;
    /**
     * Playback speed (1.0 = normal).
     * 播放速度（1.0 = 正常）
     */
    timeScale?: number;
}
/**
 * Vector3-like input type.
 * 类Vector3输入类型
 */
export type Vector3Like = number | Vector3 | {
    x?: number;
    y?: number;
    z?: number;
};
/**
 * Model feature configuration options.
 * 模型要素配置选项
 *
 * @extends PointOptions
 * @category Feature
 */
export type ModelFeatureOptions = PointOptions & {
    /**
     * Model URL (required if no paint.url provided).
     * 模型URL（如果未提供paint.url则必填）
     */
    url?: string;
    /**
     * Model type (auto-inferred from extension if not specified).
     * 模型类型（如未指定则从扩展名自动推断）
     */
    modelType?: ModelType;
    /**
     * Scale transformation.
     * 缩放变换
     */
    scale?: Vector3Like;
    /**
     * Rotation (Euler angles in radians).
     * 旋转（欧拉角，弧度）
     */
    rotation?: Vector3 | {
        x?: number;
        y?: number;
        z?: number;
    };
    /**
     * Translation offset (in addition to coordinate position).
     * 平移偏移（在坐标位置基础上的额外偏移）
     */
    translation?: Vector3 | {
        x?: number;
        y?: number;
        z?: number;
    };
    /**
     * Animation control options.
     * 动画控制选项
     */
    animations?: AnimationOptions;
    /**
     * Draco compression options (GLTF only).
     * Draco压缩选项（仅GLTF）
     */
    dracoOptions?: {
        enable: boolean;
        decoderPath?: string;
    };
    /**
     * Loading progress callback.
     * 加载进度回调
     */
    onProgress?: (progress: number) => void;
    /**
     * Loading error callback.
     * 加载错误回调
     */
    onError?: (error: Error) => void;
    /**
     * Loading complete callback.
     * 加载完成回调
     */
    onLoad?: (model: Object3D) => void;
    /**
     * Whether the model casts shadows.
     * 是否投射阴影
     */
    castShadow?: boolean;
    /**
     * Whether the model receives shadows.
     * 是否接收阴影
     */
    receiveShadow?: boolean;
};
/**
 * Animation controller interface.
 * 动画控制器接口
 *
 * @category Feature
 */
export interface IAnimationController {
    play(indexOrName?: number | string): void;
    pause(): void;
    stop(): void;
    setTime(time: number): void;
    getTime(): number;
    setLoop(loop: boolean): void;
    setTimeScale(scale: number): void;
    getClips(): AnimationClip[];
    getCurrentClip(): AnimationClip | null;
}
/**
 * 3D Model feature class.
 * 3D模型要素类
 *
 * @description
 * Represents a 3D model feature in the scene, supporting GLTF/GLB and FBX formats.
 * Provides animation control, transformations, and standard feature integration.
 *
 * 表示场景中的3D模型要素，支持GLTF/GLB和FBX格式
 * 提供动画控制、变换和标准要素集成
 *
 * @extends Point
 * @implements IAnimationController
 * @category Feature
 *
 * @example
 * const model = new ModelFeature({
 *     geometry: { type: 'Point', coordinates: [120.0, 30.0, 0] },
 *     url: '/models/building.glb',
 *     scale: 2.0,
 *     animations: { autoPlay: true, loop: true },
 *     castShadow: true,
 *     receiveShadow: true
 * });
 * model.addTo(pointLayer);
 */
export declare class ModelFeature extends Point implements IAnimationController {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string;
    /**
     * Model URL.
     * 模型URL
     */
    private _url;
    /**
     * Model type.
     * 模型类型
     */
    private _modelType;
    /**
     * Animation mixer for controlling animations.
     * 用于控制动画的动画混合器
     */
    private _mixer;
    /**
     * Available animation clips.
     * 可用的动画片段
     */
    private _clips;
    /**
     * Current animation action.
     * 当前动画动作
     */
    private _currentAction;
    /**
     * Scale transformation.
     * 缩放变换
     */
    private _modelScale;
    /**
     * Rotation transformation (Euler angles).
     * 旋转变换（欧拉角）
     */
    private _modelRotation;
    /**
     * Translation offset.
     * 平移偏移
     */
    private _translation;
    /**
     * Loading state.
     * 加载状态
     */
    private _isLoading;
    /**
     * Whether the model casts shadows.
     * 是否投射阴影
     */
    private _castShadow;
    /**
     * Whether the model receives shadows.
     * 是否接收阴影
     */
    private _receiveShadow;
    /**
     * Loaded state.
     * 已加载状态
     */
    private _isLoaded;
    /**
     * Animation options.
     * 动画选项
     */
    private _animationOptions?;
    /**
     * Draco options.
     * Draco选项
     */
    private _dracoOptions?;
    /**
     * Progress callback.
     * 进度回调
     */
    private _onProgress?;
    /**
     * Error callback.
     * 错误回调
     */
    private _onError?;
    /**
     * Load complete callback.
     * 加载完成回调
     */
    private _onLoad?;
    /**
     * Create a ModelFeature instance.
     * 创建模型要素实例
     *
     * @param options Model feature configuration
     *                模型要素配置
     */
    constructor(options: ModelFeatureOptions);
    /**
     * Build render object (load 3D model).
     * 构建渲染对象（加载3D模型）
     *
     * @override
     */
    _buildRenderObject(): Promise<void>;
    /**
     * Refresh coordinates (efficient position update).
     * 刷新坐标（高效位置更新）
     *
     * @override
     */
    protected _refreshCoordinates(): void;
    /**
     * Apply scale, rotation, and translation transformations.
     * 应用缩放、旋转和平移变换
     *
     * @private
     */
    private _applyTransformations;
    /**
     * Apply shadow settings to all meshes in the model.
     * 将阴影设置应用到模型中的所有网格
     *
     * @private
     */
    private _applyShadowSettings;
    /**
     * Update animation (called each frame).
     * 更新动画（每帧调用）
     *
     * @param deltaTime Delta time in seconds
     *                  增量时间（秒）
     */
    update(deltaTime: number): void;
    /**
     * Play animation by index or name.
     * 按索引或名称播放动画
     *
     * @param indexOrName Animation index or name (default: 0)
     *                    动画索引或名称（默认：0）
     */
    play(indexOrName?: number | string): void;
    /**
     * Pause current animation.
     * 暂停当前动画
     */
    pause(): void;
    /**
     * Resume paused animation.
     * 恢复暂停的动画
     */
    resume(): void;
    /**
     * Stop and reset animation.
     * 停止并重置动画
     */
    stop(): void;
    /**
     * Set animation time.
     * 设置动画时间
     *
     * @param time Time in seconds
     *             时间（秒）
     */
    setTime(time: number): void;
    /**
     * Get current animation time.
     * 获取当前动画时间
     *
     * @returns Current time in seconds
     *          当前时间（秒）
     */
    getTime(): number;
    /**
     * Set loop mode.
     * 设置循环模式
     *
     * @param loop Whether to loop
     *             是否循环
     */
    setLoop(loop: boolean): void;
    /**
     * Set time scale (playback speed).
     * 设置时间缩放（播放速度）
     *
     * @param scale Speed multiplier (1.0 = normal)
     *              速度倍数（1.0 = 正常）
     */
    setTimeScale(scale: number): void;
    /**
     * Get all animation clips.
     * 获取所有动画片段
     *
     * @returns Array of animation clips
     *          动画片段数组
     */
    getClips(): AnimationClip[];
    /**
     * Get current playing clip.
     * 获取当前播放的片段
     *
     * @returns Current clip or null
     *          当前片段或null
     */
    getCurrentClip(): AnimationClip | null;
    /**
     * Check if animation is playing.
     * 检查动画是否正在播放
     *
     * @returns Whether animation is playing
     *          动画是否正在播放
     */
    isPlaying(): boolean;
    /**
     * Set scale.
     * 设置缩放
     *
     * @param scale Scale value
     *              缩放值
     * @returns Current instance (method chaining)
     *          当前实例（方法链）
     */
    setScale(scale: Vector3Like): this;
    /**
     * Get current scale.
     * 获取当前缩放
     *
     * @returns Current scale vector
     *          当前缩放向量
     */
    getScale(): Vector3;
    /**
     * Set rotation.
     * 设置旋转
     *
     * @param rotation Rotation (Euler angles in radians)
     *                 旋转（欧拉角，弧度）
     * @returns Current instance (method chaining)
     *          当前实例（方法链）
     */
    setRotation(rotation: Vector3 | {
        x?: number;
        y?: number;
        z?: number;
    }): this;
    /**
     * Get current rotation.
     * 获取当前旋转
     *
     * @returns Current rotation vector (Euler angles)
     *          当前旋转向量（欧拉角）
     */
    getRotation(): Vector3;
    /**
     * Set translation offset.
     * 设置平移偏移
     *
     * @param translation Translation offset
     *                    平移偏移
     * @returns Current instance (method chaining)
     *          当前实例（方法链）
     */
    setTranslation(translation: Vector3 | {
        x?: number;
        y?: number;
        z?: number;
    }): this;
    /**
     * Get current translation offset.
     * 获取当前平移偏移
     *
     * @returns Current translation vector
     *          当前平移向量
     */
    getTranslation(): Vector3;
    /**
     * Set shadow settings.
     * 设置阴影选项
     *
     * @param castShadow Whether to cast shadows
     *                   是否投射阴影
     * @param receiveShadow Whether to receive shadows
     *                      是否接收阴影
     * @returns Current instance (method chaining)
     */
    setShadows(castShadow: boolean, receiveShadow: boolean): this;
    /**
     * Get shadow settings.
     * 获取阴影设置
     */
    getShadows(): {
        castShadow: boolean;
        receiveShadow: boolean;
    };
    /**
     * Get model URL.
     * 获取模型URL
     *
     * @returns Model URL
     *          模型URL
     */
    getUrl(): string;
    /**
     * Get model type.
     * 获取模型类型
     *
     * @returns Model type
     *          模型类型
     */
    getModelType(): ModelType;
    /**
     * Check if model is loaded.
     * 检查模型是否已加载
     *
     * @returns Whether model is loaded
     *          模型是否已加载
     */
    isLoaded(): boolean;
    /**
     * Check if model is loading.
     * 检查模型是否正在加载
     *
     * @returns Whether model is loading
     *          模型是否正在加载
     */
    isLoading(): boolean;
    /**
     * Normalize various input formats to Vector3.
     * 将各种输入格式标准化为Vector3
     *
     * @param value Input value
     *              输入值
     * @param defaultValue Default component value
     *                     默认分量值
     * @returns Vector3 instance
     *          Vector3实例
     * @private
     */
    private _normalizeVector3;
    /**
     * Infer model type from URL.
     * 从URL推断模型类型
     *
     * @param url Model URL
     *            模型URL
     * @returns Model type
     *          模型类型
     * @private
     */
    private _inferModelType;
    /**
     * Create fallback object when loading fails.
     * 加载失败时创建后备对象
     *
     * @private
     */
    private _createFallbackObject;
    /**
     * Register with map for animation updates.
     * 注册到地图以进行动画更新
     *
     * @private
     */
    private _registerWithMap;
    /**
     * Unregister from map.
     * 从地图注销
     *
     * @private
     */
    private _unregisterFromMap;
    /**
     * Calculate collision bounding box.
     * 计算碰撞包围盒
     *
     * @override
     */
    _calculateCollisionBoundingBox(camera: Camera, renderer: WebGLRenderer | WebGPURenderer): {
        width: number;
        height: number;
        offsetX: number;
        offsetY: number;
    } | null;
    /**
     * Dispose geometry and animations.
     * 释放几何体和动画
     *
     * @override
     */
    _disposeGeometry(): void;
}
