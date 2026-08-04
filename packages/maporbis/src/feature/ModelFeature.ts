import {
    Vector3,
    Object3D,
    AnimationMixer,
    AnimationClip,
    AnimationAction,
    LoopRepeat,
    LoopOnce,
    Camera,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three';
import type { WebGPURenderer } from 'three/webgpu';
import { Point, PointOptions } from './Point';
import { ModelLoaderFactory, ModelType } from '../loaders/model';

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
export type Vector3Like = number | Vector3 | { x?: number; y?: number; z?: number };

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
    rotation?: Vector3 | { x?: number; y?: number; z?: number };

    /**
     * Translation offset (in addition to coordinate position).
     * 平移偏移（在坐标位置基础上的额外偏移）
     */
    translation?: Vector3 | { x?: number; y?: number; z?: number };

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
export class ModelFeature extends Point implements IAnimationController {
    /**
     * Feature type identifier.
     * 要素类型标识
     */
    _type: string = 'ModelFeature';

    /**
     * Model URL.
     * 模型URL
     */
    private _url: string;

    /**
     * Model type.
     * 模型类型
     */
    private _modelType: ModelType;

    /**
     * Animation mixer for controlling animations.
     * 用于控制动画的动画混合器
     */
    private _mixer: AnimationMixer | null = null;

    /**
     * Available animation clips.
     * 可用的动画片段
     */
    private _clips: AnimationClip[] = [];

    /**
     * Current animation action.
     * 当前动画动作
     */
    private _currentAction: AnimationAction | null = null;

    /**
     * Scale transformation.
     * 缩放变换
     */
    private _modelScale: Vector3 = new Vector3(1, 1, 1);

    /**
     * Rotation transformation (Euler angles).
     * 旋转变换（欧拉角）
     */
    private _modelRotation: Vector3 = new Vector3(0, 0, 0);

    /**
     * Translation offset.
     * 平移偏移
     */
    private _translation: Vector3 = new Vector3(0, 0, 0);

    /**
     * Loading state.
     * 加载状态
     */
    private _isLoading: boolean = false;

    /**
     * Whether the model casts shadows.
     * 是否投射阴影
     */
    private _castShadow: boolean = false;

    /**
     * Whether the model receives shadows.
     * 是否接收阴影
     */
    private _receiveShadow: boolean = false;

    /**
     * Loaded state.
     * 已加载状态
     */
    private _isLoaded: boolean = false;

    /**
     * Animation options.
     * 动画选项
     */
    private _animationOptions?: AnimationOptions;

    /**
     * Draco options.
     * Draco选项
     */
    private _dracoOptions?: { enable: boolean; decoderPath?: string };

    /**
     * Progress callback.
     * 进度回调
     */
    private _onProgress?: (progress: number) => void;

    /**
     * Error callback.
     * 错误回调
     */
    private _onError?: (error: Error) => void;

    /**
     * Load complete callback.
     * 加载完成回调
     */
    private _onLoad?: (model: Object3D) => void;

    /**
     * Create a ModelFeature instance.
     * 创建模型要素实例
     * 
     * @param options Model feature configuration
     *                模型要素配置
     */
    constructor(options: ModelFeatureOptions) {
        super(options);

        // Extract URL from options or paint config
        this._url = options.url || (options.paint as any)?.url;
        this._modelType = options.modelType || this._inferModelType(this._url);

        if (!this._url) {
            throw new Error('ModelFeature requires a URL in options or paint config');
        }

        // Set transformations
        if (options.scale !== undefined) {
            this._modelScale = this._normalizeVector3(options.scale);
        }
        if (options.rotation) {
            this._modelRotation = this._normalizeVector3(options.rotation, 0);
        }
        if (options.translation) {
            this._translation = this._normalizeVector3(options.translation, 0);
        }

        // Store options
        this._animationOptions = options.animations;
        this._dracoOptions = options.dracoOptions;
        this._onProgress = options.onProgress;
        this._onError = options.onError;
        this._onLoad = options.onLoad;
        this._castShadow = options.castShadow ?? false;
        this._receiveShadow = options.receiveShadow ?? false;
    }

    /**
     * Build render object (load 3D model).
     * 构建渲染对象（加载3D模型）
     * 
     * @override
     */
    async _buildRenderObject(): Promise<void> {
        const map = this.getMap();
        
        if (!map) {
            console.warn('[ModelFeature._buildRenderObject] No map, returning');
            return;
        }

        // Prevent duplicate loading
        if (this._isLoading) {
            return;
        }

        // Allow reload if already loaded
        if (this._isLoaded) {
            this._disposeGeometry();
        }

        this._isLoading = true;
        this._worldCoordinates = this._coordsTransform() as Vector3;

        try {
            // Load model through factory (uses caching)
            const loader = ModelLoaderFactory.getLoader(this._modelType);
            
            const result = await loader.load({
                url: this._url,
                onProgress: this._onProgress,
                onError: this._onError,
                dracoOptions: this._dracoOptions
            });

            // Set render object
            this._renderObject = result.scene;
            this._renderObject.userData._type = 'Model';

            // Store animation clips
            this._clips = result.animations || [];

            // Initialize animation mixer if clips exist
            if (this._clips.length > 0) {
                this._mixer = new AnimationMixer(this._renderObject);

                // Auto-play if specified
                if (this._animationOptions?.autoPlay) {
                    const clipIdentifier = this._animationOptions.clipName ??
                        this._animationOptions.clipIndex ?? 0;
                    this.play(clipIdentifier);

                    if (this._animationOptions.loop !== undefined) {
                        this.setLoop(this._animationOptions.loop);
                    }
                    if (this._animationOptions.timeScale !== undefined) {
                        this.setTimeScale(this._animationOptions.timeScale);
                    }
                }
            }

            // Apply transformations
            this._applyTransformations();

            // Apply shadow settings
            this._applyShadowSettings();

            // Update coordinates and add to scene
            this._refreshCoordinates();

            this._isLoaded = true;
            this._isLoading = false;

            // Register with map for animation updates
            this._registerWithMap();

            // Fire load callback
            if (this._onLoad) {
                this._onLoad(this._renderObject);
            }

            this.fire('modelload', { model: this._renderObject, clips: this._clips });

        } catch (error) {
            this._isLoading = false;
            console.error(`ModelFeature: Failed to load model from ${this._url}`, error);

            if (this._onError) {
                this._onError(error as Error);
            }

            this.fire('modelerror', { error, url: this._url });

            // Create fallback placeholder
            this._createFallbackObject();
        }
    }

    /**
     * Refresh coordinates (efficient position update).
     * 刷新坐标（高效位置更新）
     * 
     * @override
     */
    protected _refreshCoordinates(): void {
        // Recalculate world coordinates
        this._worldCoordinates = this._coordsTransform() as Vector3;

        if (this._renderObject) {
            // Update position
            const map = this.getMap();
            
            if (map?.prjcenter) {
                // FIX: Use absolute coordinates to match camera/scene coordinate system
                // Previously: this._renderObject.position.copy(this._worldCoordinates as Vector3).sub(map.prjcenter as Vector3);
                this._renderObject.position.copy(this._worldCoordinates as Vector3);
            } else {
                this._renderObject.position.copy(this._worldCoordinates as Vector3);
            }

            // Apply additional translation
            this._renderObject.position.add(this._translation);
            // Ensure in scene
            if (!this.children.includes(this._renderObject as Object3D)) {
                this.add(this._renderObject);
            } else {
                console.warn('[ModelFeature._refreshCoordinates] _renderObject already in ModelFeature container');
            }
            
            // console.log('[ModelFeature._refreshCoordinates] ModelFeature parent:', this.parent);

            // Force update
            this.updateMatrixWorld(true);
        } else if (!this._isLoading) {
            // If no render object and not currently loading, trigger full rebuild
            this._buildRenderObject();
        }
    }

    /**
     * Apply scale, rotation, and translation transformations.
     * 应用缩放、旋转和平移变换
     * 
     * @private
     */
    private _applyTransformations(): void {
        if (!this._renderObject) return;

        // Apply scale
        this._renderObject.scale.copy(this._modelScale);

        // Apply rotation (Euler angles)
        this._renderObject.rotation.set(
            this._modelRotation.x,
            this._modelRotation.y,
            this._modelRotation.z
        );

        // Translation is applied in _refreshCoordinates
    }

    /**
     * Apply shadow settings to all meshes in the model.
     * 将阴影设置应用到模型中的所有网格
     * 
     * @private
     */
    private _applyShadowSettings(): void {
        if (!this._renderObject) return;

        this._renderObject.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = this._castShadow;
                child.receiveShadow = this._receiveShadow;
            }
        });
    }

    /**
     * Update animation (called each frame).
     * 更新动画（每帧调用）
     * 
     * @param deltaTime Delta time in seconds
     *                  增量时间（秒）
     */
    update(deltaTime: number): void {
        if (this._mixer) {
            this._mixer.update(deltaTime);
        }
    }

    // === IAnimationController Implementation ===

    /**
     * Play animation by index or name.
     * 按索引或名称播放动画
     * 
     * @param indexOrName Animation index or name (default: 0)
     *                    动画索引或名称（默认：0）
     */
    play(indexOrName: number | string = 0): void {
        if (!this._mixer || this._clips.length === 0) {
            console.warn('ModelFeature: No animations available');
            return;
        }

        let clip: AnimationClip | undefined;

        if (typeof indexOrName === 'number') {
            clip = this._clips[indexOrName];
        } else {
            clip = this._clips.find(c => c.name === indexOrName);
        }

        if (!clip) {
            console.warn(`ModelFeature: Animation "${indexOrName}" not found`);
            return;
        }

        // Stop current action
        if (this._currentAction) {
            this._currentAction.stop();
        }

        // Create and play new action
        this._currentAction = this._mixer.clipAction(clip);
        this._currentAction.play();

        this.fire('animationplay', { clip });
    }

    /**
     * Pause current animation.
     * 暂停当前动画
     */
    pause(): void {
        if (this._currentAction) {
            this._currentAction.paused = true;
            this.fire('animationpause');
        }
    }

    /**
     * Resume paused animation.
     * 恢复暂停的动画
     */
    resume(): void {
        if (this._currentAction) {
            this._currentAction.paused = false;
            this.fire('animationresume');
        }
    }

    /**
     * Stop and reset animation.
     * 停止并重置动画
     */
    stop(): void {
        if (this._currentAction) {
            this._currentAction.stop();
            this._currentAction = null;
            this.fire('animationstop');
        }
    }

    /**
     * Set animation time.
     * 设置动画时间
     * 
     * @param time Time in seconds
     *             时间（秒）
     */
    setTime(time: number): void {
        if (this._currentAction) {
            this._currentAction.time = time;
        }
    }

    /**
     * Get current animation time.
     * 获取当前动画时间
     * 
     * @returns Current time in seconds
     *          当前时间（秒）
     */
    getTime(): number {
        return this._currentAction?.time ?? 0;
    }

    /**
     * Set loop mode.
     * 设置循环模式
     * 
     * @param loop Whether to loop
     *             是否循环
     */
    setLoop(loop: boolean): void {
        if (this._currentAction) {
            this._currentAction.setLoop(loop ? LoopRepeat : LoopOnce, Infinity);
            this._currentAction.clampWhenFinished = !loop;
        }
    }

    /**
     * Set time scale (playback speed).
     * 设置时间缩放（播放速度）
     * 
     * @param scale Speed multiplier (1.0 = normal)
     *              速度倍数（1.0 = 正常）
     */
    setTimeScale(scale: number): void {
        if (this._currentAction) {
            this._currentAction.timeScale = scale;
        }
    }

    /**
     * Get all animation clips.
     * 获取所有动画片段
     * 
     * @returns Array of animation clips
     *          动画片段数组
     */
    getClips(): AnimationClip[] {
        return this._clips;
    }

    /**
     * Get current playing clip.
     * 获取当前播放的片段
     * 
     * @returns Current clip or null
     *          当前片段或null
     */
    getCurrentClip(): AnimationClip | null {
        return this._currentAction?.getClip() ?? null;
    }

    /**
     * Check if animation is playing.
     * 检查动画是否正在播放
     * 
     * @returns Whether animation is playing
     *          动画是否正在播放
     */
    isPlaying(): boolean {
        return this._currentAction !== null && !this._currentAction.paused;
    }

    // === Transformation Methods ===

    /**
     * Set scale.
     * 设置缩放
     * 
     * @param scale Scale value
     *              缩放值
     * @returns Current instance (method chaining)
     *          当前实例（方法链）
     */
    setScale(scale: Vector3Like): this {
        this._modelScale = this._normalizeVector3(scale);
        if (this._renderObject) {
            this._renderObject.scale.copy(this._modelScale);
        }
        return this;
    }

    /**
     * Get current scale.
     * 获取当前缩放
     * 
     * @returns Current scale vector
     *          当前缩放向量
     */
    getScale(): Vector3 {
        return this._modelScale.clone();
    }

    /**
     * Set rotation.
     * 设置旋转
     * 
     * @param rotation Rotation (Euler angles in radians)
     *                 旋转（欧拉角，弧度）
     * @returns Current instance (method chaining)
     *          当前实例（方法链）
     */
    setRotation(rotation: Vector3 | { x?: number; y?: number; z?: number }): this {
        this._modelRotation = this._normalizeVector3(rotation, 0);
        if (this._renderObject) {
            this._renderObject.rotation.set(
                this._modelRotation.x,
                this._modelRotation.y,
                this._modelRotation.z
            );
        }
        return this;
    }

    /**
     * Get current rotation.
     * 获取当前旋转
     * 
     * @returns Current rotation vector (Euler angles)
     *          当前旋转向量（欧拉角）
     */
    getRotation(): Vector3 {
        return this._modelRotation.clone();
    }

    /**
     * Set translation offset.
     * 设置平移偏移
     * 
     * @param translation Translation offset
     *                    平移偏移
     * @returns Current instance (method chaining)
     *          当前实例（方法链）
     */
    setTranslation(translation: Vector3 | { x?: number; y?: number; z?: number }): this {
        this._translation = this._normalizeVector3(translation, 0);
        this._refreshCoordinates();
        return this;
    }

    /**
     * Get current translation offset.
     * 获取当前平移偏移
     * 
     * @returns Current translation vector
     *          当前平移向量
     */
    getTranslation(): Vector3 {
        return this._translation.clone();
    }

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
    setShadows(castShadow: boolean, receiveShadow: boolean): this {
        this._castShadow = castShadow;
        this._receiveShadow = receiveShadow;
        this._applyShadowSettings();
        return this;
    }

    /**
     * Get shadow settings.
     * 获取阴影设置
     */
    getShadows() {
        return {
            castShadow: this._castShadow,
            receiveShadow: this._receiveShadow
        };
    }

    // === Getters ===

    /**
     * Get model URL.
     * 获取模型URL
     * 
     * @returns Model URL
     *          模型URL
     */
    getUrl(): string {
        return this._url;
    }

    /**
     * Get model type.
     * 获取模型类型
     * 
     * @returns Model type
     *          模型类型
     */
    getModelType(): ModelType {
        return this._modelType;
    }

    /**
     * Check if model is loaded.
     * 检查模型是否已加载
     * 
     * @returns Whether model is loaded
     *          模型是否已加载
     */
    isLoaded(): boolean {
        return this._isLoaded;
    }

    /**
     * Check if model is loading.
     * 检查模型是否正在加载
     * 
     * @returns Whether model is loading
     *          模型是否正在加载
     */
    isLoading(): boolean {
        return this._isLoading;
    }

    // === Utility Methods ===

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
    private _normalizeVector3(value: Vector3Like, defaultValue: number = 1): Vector3 {
        if (typeof value === 'number') {
            return new Vector3(value, value, value);
        } else if (value instanceof Vector3) {
            return value.clone();
        } else {
            return new Vector3(
                value.x ?? defaultValue,
                value.y ?? defaultValue,
                value.z ?? defaultValue
            );
        }
    }

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
    private _inferModelType(url: string): ModelType {
        if (!url) return 'gltf';
        const ext = url.split('.').pop()?.toLowerCase().split('?')[0];
        if (ext === 'glb' || ext === 'gltf') {
            return 'gltf';
        } else if (ext === 'fbx') {
            return 'fbx';
        }
        // Default to GLTF
        return 'gltf';
    }

    /**
     * Create fallback object when loading fails.
     * 加载失败时创建后备对象
     * 
     * @private
     */
    private _createFallbackObject(): void {
        // Create a simple wireframe box as placeholder
        const geometry = new BoxGeometry(10, 10, 10);
        const material = new MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this._renderObject = new Mesh(geometry, material);
        this._renderObject.userData._type = 'Model';
        this._renderObject.userData.fallback = true;
        this._isLoaded = true;
        this._refreshCoordinates();
    }

    /**
     * Register with map for animation updates.
     * 注册到地图以进行动画更新
     * 
     * @private
     */
    private _registerWithMap(): void {
        const map = this.getMap() as any;
        if (map && this._clips.length > 0) {
            map.registerModelFeature?.(this);
        }
    }

    /**
     * Unregister from map.
     * 从地图注销
     * 
     * @private
     */
    private _unregisterFromMap(): void {
        const map = this.getMap() as any;
        if (map) {
            map.unregisterModelFeature?.(this);
        }
    }

    /**
     * Calculate collision bounding box.
     * 计算碰撞包围盒
     * 
     * @override
     */
    override _calculateCollisionBoundingBox(
        camera: Camera,
        renderer: WebGLRenderer | WebGPURenderer
    ): { width: number; height: number; offsetX: number; offsetY: number } | null {
        // Use parent implementation (Box3 projection)
        return super._calculateCollisionBoundingBox(camera, renderer);
    }

    /**
     * Dispose geometry and animations.
     * 释放几何体和动画
     * 
     * @override
     */
    override _disposeGeometry(): void {
        // Unregister from map
        this._unregisterFromMap();

        // Stop animations
        if (this._currentAction) {
            this._currentAction.stop();
            this._currentAction = null;
        }

        // Dispose mixer
        if (this._mixer) {
            this._mixer.stopAllAction();
            this._mixer = null;
        }

        // Clear clips
        this._clips = [];

        // Dispose render object
        super._disposeGeometry();

        this._isLoaded = false;
    }
}
