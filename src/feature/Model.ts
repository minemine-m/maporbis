import { Vector3, AnimationMixer, LoopOnce, LoopRepeat, Clock, Mesh, Color, Box3, RepeatWrapping, Vector2 } from "three";
import { PointOptions, Point } from "./Point";
import { Paint } from "../style";
import { _createModel } from "../utils/createobject";
import { MeshBuildGradientMaterial } from "../utils/build/material/MeshBuildGradientMaterial";
// import type { GeoJSONPolygon, GeoJSONMultiPolygon } from 'geojson';
import type { Layer, RegionOverlayConfig } from '../layer/Layer';

/**
 * Model feature configuration options.
 * 模型要素配置选项
 * 
 * @extends PointOptions
  * @category Feature
 */
export type ModelOptions = PointOptions & {
    /** 
     * Whether to enable emissive effect.
     * 是否启用自发光效果 
     */
    emissive?: boolean;
    /** 
     * Emissive intensity.
     * 自发光强度 
     */
    emissiveIntensity?: number;
    /** 
     * Emissive color.
     * 自发光颜色 
     */
    emissiveColor?: string;
    /** 
     * Whether to cast shadow.
     * 是否投射阴影 
     */
    castShadow?: boolean;
    /** 
     * Whether to receive shadow.
     * 是否接收阴影 
     */
    receiveShadow?: boolean;
    /** 
     * Whether it is a city building model.
     * 是否为城市建筑模型 
     */
    iscity?: boolean;
};

/**
 * Default model configuration.
 * 默认模型配置
 */
const options: ModelOptions = {
    emissive: false,
    emissiveIntensity: 1.0,
    emissiveColor: "#ffffff",
};

/**
 * Animation play parameters.
 * 动画播放参数
 */
interface AnimationPlayParams {
    /** 
     * Animation name or index.
     * 动画名称或索引 
     */
    name: string | number;
    /** 
     * Whether to loop.
     * 是否循环播放 
     */
    loop?: boolean;
    /** 
     * Playback speed.
     * 播放速度 
     */
    speed?: number;
    /** 
     * Fade in duration (seconds).
     * 淡入时间(秒) 
     */
    fadeInDuration?: number;
    /** 
     * Fade out duration (seconds).
     * 淡出时间(秒) 
     */
    fadeOutDuration?: number;
    /** 
     * Start playback from specified time (seconds).
     * 从指定时间开始播放(秒) 
     */
    startAt?: number;
    /** 
     * Animation weight (0-1).
     * 动画权重(0-1) 
     */
    weight?: number;
}

/**
 * Animation update parameters.
 * 动画更新参数
 */
interface AnimationUpdateParams {
    /** 
     * Time delta (seconds).
     * 时间增量(秒) 
     */
    deltaTime: number;
}

/**
 * Animation speed parameters.
 * 动画速度参数
 */
interface AnimationSpeedParams {
    /** 
     * Playback speed.
     * 播放速度 
     */
    speed: number;
}

/**
 * Animation pause parameters.
 * 动画暂停参数
 */
interface AnimationPauseParams {
    /** 
     * Whether to pause.
     * 是否暂停 
     */
    paused: boolean;
}

/**
 * 3D Model feature class.
 * 3D模型要素类
 * 
 * @description
 * Represents a model feature in the 3D scene, inheriting from Point class.
 * Provides functionality for model loading, animation control, shadow settings, and special effects.
 * Supports FBX and GLTF 3D model formats.
 * 
 * 表示3D场景中的模型要素，继承自Point类
 * 提供模型加载、动画控制、阴影设置和特殊效果等功能
 * 支持FBX和GLTF格式的3D模型
 * 
 * @extends Point
  * @category Feature
 */
export class Model extends Point {
    /** 
     * Feature type identifier.
     * 要素类型标识 
     */
    _type: string = "Model";

    /** 
     * Emissive state.
     * 自发光状态 
     */
    private _emissive: boolean = false;
    /** 
     * Emissive intensity.
     * 自发光强度 
     */
    private _emissiveIntensity: number = 1.0;
    /** 
     * Emissive color.
     * 自发光颜色 
     */
    private _emissiveColor: string = "#ffffff";
    /** 
     * Animation mixer.
     * 动画混合器 
     */
    private _mixer: AnimationMixer | null = null;
    /** 
     * Current animation action.
     * 当前动画动作 
     */
    private _currentAction: any = null;
    /** 
     * Array of animation clips.
     * 动画剪辑数组 
     */
    private _animations: any[] = [];
    /** 
     * Animation clock.
     * 动画时钟 
     */
    private _clock: Clock = new Clock();
    /** 
     * Whether to auto update animation.
     * 是否自动更新动画 
     */
    private _autoUpdate: boolean = true;
    /** 
     * Animation request ID.
     * 动画请求ID 
     */
    private _animationRequestId: number | null = null;
    /** 
     * Whether it is a city building model.
     * 是否为城市建筑模型 
     */
    private _iscity: boolean = false;

    /**
     * Create a Model feature instance.
     * 创建模型要素实例
     * 
     * @param options Model configuration options
     *                模型配置选项
     */
    constructor(options: ModelOptions) {
        super(options);
        this._emissive = options.emissive || false;
        this._emissiveIntensity = options.emissiveIntensity || 1.0;
        this._emissiveColor = options.emissiveColor || "#ffffff";
        this.castShadow = options.castShadow || false;
        this.receiveShadow = options.receiveShadow || false;
        this._iscity = options.iscity || false;
    }

    /**
     * Convert feature to Three.js geometry.
     * 将要素转换为Three.js几何体
     * 
     * @returns Promise<void>
     */
    async _buildRenderObject(): Promise<void> {
        this._worldCoordinates = this._coordsTransform() as Vector3;
        if (this._style) {
            if (this._renderObject) {
                this._disposeGeometry();
            }

            this.modelunino = await this._createObject(this._style);
            this._renderObject = this.modelunino.model;
            // Safety check: if model is undefined, return directly
            // 安全检查：如果model不存在，直接返回
            if (!this._renderObject) {
                console.error('Model load failed: model returned by _createObject is undefined');
                console.error('模型加载失败：_createObject返回的model为undefined');
                return;
            }
            // Temporarily use userData to store type, can be used later to identify model
            // 此处暂时用userData存储类型，后续可以根据类型判断是否为模型
            this._renderObject.userData._type = 'Model';
            // Initialize animation system
            // 初始化动画系统
            if (this.modelunino.animations && this.modelunino.animations.length > 0) {
                this._animations = this.modelunino.animations;
                this._mixer = new AnimationMixer(this._renderObject);
                this._startAnimationLoop();
                this.playAnimation({
                    name: this._animations[0].name,
                    loop: true,
                    speed: 1.5,
                    fadeInDuration: 0.5,
                    fadeOutDuration: 0.3,
                });
            }
            this._refreshCoordinates();
            this.setShadows({
                cast: this.castShadow,
                receive: this.receiveShadow,
            });
            this._applyEmissionProperties();
            if (this._iscity) this._rendercity();
        }
    }

    /**
     * Create model object.
     * 创建模型对象
     * 
     * @param style Style configuration
     *              样式配置
     * @returns Created model object
     *          创建的模型对象
     * @throws Throws error if style type is not supported
     *         如果样式类型不支持会抛出错误
     */
    async _createObject(paint: Paint): Promise<any> {
        switch (style.config.type) {
            case "fbx":
            case "gltf":
                return _createModel(style.config, this._worldCoordinates as Vector3);
            default:
                throw new Error(`Unsupported style type: ${style.config.type}`);
        }
    }

    /**
     * Apply emission properties.
     * 应用自发光属性
     * 
     * @private
     */
    private _applyEmissionProperties(): void {
        if (this._renderObject) {
            this._renderObject.traverse(child => {
                if ("material" in child) {
                    const material = (child as any).material;
                    if (material) {
                        material.emissiveIntensity = this._emissive ? this._emissiveIntensity : 0;
                        if (material.emissive) {
                            material.emissive.setStyle(this._emissiveColor);
                        }
                    }
                }
            });
        }
    }

    /* Emissive property accessors */
    /* 自发光属性访问器 */
    get emissive(): boolean {
        return this._emissive;
    }

    set emissive(value: boolean) {
        this._emissive = value;
        this._applyEmissionProperties();
    }

    get emissiveIntensity(): number {
        return this._emissiveIntensity;
    }

    set emissiveIntensity(value: number) {
        this._emissiveIntensity = value;
        this._applyEmissionProperties();
    }

    get emissiveColor(): string {
        return this._emissiveColor;
    }

    set emissiveColor(value: string) {
        this._emissiveColor = value;
        this._applyEmissionProperties();
    }

    /**
     * Set emissive effect.
     * 设置自发光效果
     * 
     * @param enabled Whether to enable
     *                是否启用
     * @param intensity Intensity (optional)
     *                  强度(可选)
     * @param color Color (optional)
     *              颜色(可选)
     */
    setEmission(enabled: boolean, intensity?: number, color?: string): void {
        this._emissive = enabled;
        if (intensity !== undefined) this._emissiveIntensity = intensity;
        if (color !== undefined) this._emissiveColor = color;
        this._applyEmissionProperties();
    }

    /**
     * Set shadow properties.
     * 设置阴影属性
     * 
     * @param options Shadow configuration
     *                阴影配置
     */
    async setShadows(options: { cast: boolean; receive: boolean }) {
        this.castShadow = options.cast;
        this.receiveShadow = options.receive;
        if (this._renderObject) {
            this._renderObject.traverse((child: any) => {
                if (child.isMesh && child.material) {
                    child.castShadow = options.cast;
                    child.receiveShadow = options.receive;
                }
            });
        }
    }

    setBloom(enabled: boolean, _options?: { intensity?: number; color?: string }): this {
        this.userData.bloom = enabled;
        if (this._renderObject) {
            this._renderObject.traverse(child => {
                if (child instanceof Mesh) {
                    // Check if it's the original material or a clone
                    // 检查是否是原始材质还是克隆后的
                    if (!child.userData.originalMaterial) {
                        child.userData.originalMaterial = child.material;
                    }

                    if (enabled) {
                        // Apply bloom material
                        // 应用发光材质
                        // Note: Here we simply assume using standard material and setting emissive, actual logic may be more complex
                        // 注意：这里简单假设使用标准材质并设置自发光，实际逻辑可能更复杂
                        if (Array.isArray(child.material)) {
                            child.material.forEach(m => {
                                if ('emissive' in m) {
                                    m.emissive.setHex(0xffffff);
                                    m.emissiveIntensity = 0.5;
                                }
                            });
                        } else if ('emissive' in child.material) {
                            (child.material as any).emissive.setHex(0xffffff);
                            (child.material as any).emissiveIntensity = 0.5;
                        }
                    } else {
                        // Restore original material state
                        // 恢复原始材质状态
                        // child.material = child.userData.originalMaterial;
                         if (Array.isArray(child.material)) {
                            child.material.forEach(m => {
                                if ('emissive' in m) {
                                    m.emissive.setHex(0x000000);
                                    m.emissiveIntensity = 0;
                                }
                            });
                        } else if ('emissive' in child.material) {
                            (child.material as any).emissive.setHex(0x000000);
                            (child.material as any).emissiveIntensity = 0;
                        }
                    }
                }
            });
        }
        return this;
    }

    /* Animation control methods */
    /* 动画控制方法 */

    /**
     * Play animation.
     * 播放动画
     * 
     * @param params Animation parameters
     *               动画参数
     */
    playAnimation(params: AnimationPlayParams): void {
        if (!this._mixer || this._animations.length === 0) {
            console.warn("No available animations for model");
            console.warn("模型没有可用的动画");
            return;
        }

        // Stop current animation
        // 停止当前动画
        if (this._currentAction) {
            if (params.fadeOutDuration && params.fadeOutDuration > 0) {
                this._currentAction.fadeOut(params.fadeOutDuration);
            } else {
                this._currentAction.stop();
            }
        }

        // Get animation clip
        // 获取动画剪辑
        const clip =
            typeof params.name === "number"
                ? this._animations[params.name]
                : this._animations.find(anim => anim.name === params.name);

        if (!clip) {
            console.warn(`Animation not found: ${params.name}`);
            console.warn(`找不到动画: ${params.name}`);
            return;
        }

        // Create and play new animation
        // 创建并播放新动画
        this._currentAction = this._mixer.clipAction(clip);
        this._currentAction.setLoop(params.loop ? LoopRepeat : LoopOnce, params.loop ? Infinity : 1);
        this._currentAction.timeScale = params.speed || 1;
        this._currentAction.time = params.startAt || 0;
        this._currentAction.setEffectiveWeight(params.weight || 1);

        if (params.fadeInDuration && params.fadeInDuration > 0) {
            this._currentAction.fadeIn(params.fadeInDuration);
        }

        this._currentAction.play();

        // Start animation loop (if not started)
        // 启动动画循环（如果未启动）
        if (this._autoUpdate && this._animationRequestId === null) {
            this._startAnimationLoop();
        }
    }

    /**
     * Stop animation.
     * 停止动画
     * 
     * @param params Stop parameters
     *               停止参数
     */
    stopAnimation(params: { fadeDuration?: number } = {}): void {
        if (this._currentAction) {
            if (params.fadeDuration && params.fadeDuration > 0) {
                this._currentAction.fadeOut(params.fadeDuration);
                setTimeout(() => {
                    if (this._currentAction) {
                        this._currentAction.stop();
                        this._currentAction = null;
                    }
                }, params.fadeDuration * 1000);
            } else {
                this._currentAction.stop();
                this._currentAction = null;
            }
        }
    }

    /**
     * Set animation paused state.
     * 设置动画暂停状态
     * 
     * @param params Pause parameters
     *               暂停参数
     */
    setAnimationPaused(params: AnimationPauseParams): void {
        if (this._currentAction) {
            this._currentAction.paused = params.paused;
        }
    }

    /**
     * Set animation speed.
     * 设置动画速度
     * 
     * @param params Speed parameters
     *               速度参数
     */
    setAnimationSpeed(params: AnimationSpeedParams): void {
        if (this._currentAction) {
            this._currentAction.timeScale = params.speed;
        }
    }

    /**
     * Update animation.
     * 更新动画
     * 
     * @param params Update parameters
     *               更新参数
     */
    updateAnimation(params: AnimationUpdateParams): void {
        if (this._mixer) {
            this._mixer.update(params.deltaTime);
        }
    }

    /**
     * Get animation name list.
     * 获取动画名称列表
     * 
     * @returns Animation name array
     *          动画名称数组
     */
    getAnimationNames(): string[] {
        return this._animations.map(anim => anim.name);
    }

    /**
     * Get current animation name.
     * 获取当前动画名称
     * 
     * @returns Current animation name or null
     *          当前动画名称或null
     */
    getCurrentAnimationName(): string | null {
        return this._currentAction ? this._currentAction.getClip().name : null;
    }

    /**
     * Get animation duration.
     * 获取动画时长
     * 
     * @param params Animation parameters
     *               动画参数
     * @returns Animation duration (seconds) or null
     *          动画时长(秒)或null
     */
    getAnimationDuration(params: { name: string | number }): number | null {
        let clip: any;
        if (typeof params.name === "number") {
            clip = this._animations[params.name];
        } else {
            clip = this._animations.find(anim => anim.name === params.name);
        }
        return clip ? clip.duration : null;
    }

    /**
     * Dispose resources.
     * 释放资源
     */
    dispose(): void {
        this._stopAnimationLoop();
        if (this._mixer) {
            this._mixer.stopAllAction();
            this._mixer.uncacheRoot(this._renderObject);
        }
        super.dispose();
    }

    /**
     * Start animation loop.
     * 启动动画循环
     * 
     * @private
     */
    private _startAnimationLoop(): void {
        if (!this._autoUpdate || this._animationRequestId !== null) return;

        const update = () => {
            if (this._mixer) {
                const delta = this._clock.getDelta();
                this._mixer.update(delta);
            }
            this._animationRequestId = requestAnimationFrame(update);
        };

        this._clock.start();
        this._animationRequestId = requestAnimationFrame(update);
    }

    /**
     * Stop animation loop.
     * 停止动画循环
     * 
     * @private
     */
    private _stopAnimationLoop(): void {
        if (this._animationRequestId !== null) {
            cancelAnimationFrame(this._animationRequestId);
            this._animationRequestId = null;
        }
        this._clock.stop();
    }

    /**
     * Set auto update state.
     * 设置自动更新状态
     * 
     * @param enabled Whether to enable auto update
     *                是否启用自动更新
     */
    setAutoUpdate(enabled: boolean): void {
        this._autoUpdate = enabled;
        if (enabled) {
            this._startAnimationLoop();
        } else {
            this._stopAnimationLoop();
        }
    }
    /**
     * Compute polygon vertices in world coordinates (XZ plane) from region overlay configuration.
     * Prioritize using world coordinates (_vertexPoints) from Terra face feature.
     * Fallback to GeoJSON + projectToWorld only if no feature is provided.
     * 
     * 从区域蒙版配置计算世界坐标系下的多边形顶点（XZ 平面）
     * 优先使用 Terra 面 feature 中已有的世界坐标（_vertexPoints），
     * 如果没有传 feature，才回退到 GeoJSON + projectToWorld。
     */
    private _computeOverlayVertices(overlay: RegionOverlayConfig): Vector2[] | null {
        // 1. Prioritize using _vertexPoints from Terra face feature
        // 1. 优先使用 Terra 面 feature 的 _vertexPoints
        const feature: any = overlay.feature;
        if (feature && Array.isArray(feature._vertexPoints) && feature._vertexPoints.length >= 6) {
            // Try getting map from feature or current Model
            // 尝试从 feature 或当前 Model 拿 map
            const map = feature.getMap?.() || this.getMap();
            if (map && (map as any).prjcenter) {
                const center = (map as any).prjcenter as Vector3;
                const verts = feature._vertexPoints as number[];
                const vertices: Vector2[] = [];

                for (let i = 0; i + 2 < verts.length; i += 3) {
                    const xRel = verts[i];
                    // const yRel = verts[i + 1]; // Temporarily unused // 这里暂时不用
                    const zRel = verts[i + 2];

                    const x = center.x + xRel;
                    const z = center.z + zRel;
                    vertices.push(new Vector2(x, z));
                }

                if (vertices.length >= 3) {
                    return vertices;
                }
            }
        }

        // 2. Fallback to GeoJSON + projectToWorld if no feature or recovery from feature failed
        // 2. 没有 feature 或从 feature 中无法恢复，则回退到 GeoJSON + projectToWorld
        const map = this.getMap();
        if (!map || !overlay.geometry) return null;

        const geometry = overlay.geometry as any;

        let rings: number[][][];
        if (geometry.type === 'Polygon') {
            rings = geometry.coordinates as number[][][];
        } else if (geometry.type === 'MultiPolygon') {
            if (!geometry.coordinates.length) return null;
            // Simplify: take only the outer ring of the first Polygon
            // 简化：先只取第一个 Polygon 的外环
            rings = geometry.coordinates[0] as number[][][];
        } else {
            return null;
        }

        if (!rings.length || !rings[0].length) return null;
        const outerRing = rings[0];

        const vertices: Vector2[] = [];
        for (const coord of outerRing) {
            const lng = coord[0];
            const lat = coord[1];
            const world = map.projectToWorld(new Vector3(lng, lat, 0));
            vertices.push(new Vector2(world.x, world.z));
        }

        if (vertices.length < 3) return null;
        return vertices;
    }

    /**
     * Render city effect.
     * 渲染城市效果
     * 
     * @private
     */
    private _rendercity() {
        // First read currently active region overlay from belonging layer (only take the one with max zIndex in overlay mode)
        // 先从所属图层读取当前生效的区域蒙版（只取 overlay 模式里 zIndex 最大的一个）
        const layer = this.getLayer() as Layer | null;
        let overlayParams: {
            color: Color;
            opacity: number;
            vertices: Vector2[];
        } | null = null;

        if (layer && (layer as any).getRegionOverlays) {
            const overlays: RegionOverlayConfig[] = (layer as any).getRegionOverlays() || [];
            if (overlays.length) {
                const overlayCandidates = overlays
                    .filter(o => (o.mode ?? 'overlay') === 'overlay')
                    .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0));
                const active = overlayCandidates[overlayCandidates.length - 1];
                // ✅ Participate in calculation if either geometry or feature exists
                // ✅ geometry 或 feature 任意存在一种都参与计算
                if (active && (active.geometry || active.feature)) {
                    const vertices = this._computeOverlayVertices(active);
                    if (vertices && vertices.length >= 3) {
                        overlayParams = {
                            color: new Color(active.color ?? '#00FF88'),
                            opacity: active.opacity ?? 0.3,
                            vertices
                        };
                    }
                }
            }
        }
        this.traverse(async child => {
            if (child instanceof Mesh && child.material) {
                child.castShadow = true;
                if (child.name === "building") {
                    const material = new MeshBuildGradientMaterial({
                        // color: new Color("#C7BD3C").multiplyScalar(1.8),
                        color: new Color("#6BA7EC").multiplyScalar(1.8),
                        opacity: 0.9,
                        shaderOption: {
                            minY: 0,
                            maxY: 50,
                            minRate: 0.3,
                            maxRate: 1.5,
                            effects: {
                                diffusion: {
                                    enabled: true,
                                    color: new Color("#FFFFF"),
                                    width: 300,
                                    speed: 0.5 / 10,
                                },
                                flow: {
                                    enabled: false,
                                    color: new Color("#FFFFF"),
                                    range: 1000,
                                    speed: 3000,
                                },
                                sweep: {
                                    enabled: true,
                                    color: new Color("#ffffff"),
                                    width: 3,
                                    speed: 5,
                                },
                            },

                        },
                        // New: pass calculated overlayParams to material
                        // 新增：把算好的 overlayParams 传给材质
                        regionOverlay: overlayParams || undefined,
                    });

                    const box = new Box3().setFromObject(child);
                    material.updateBoundingBox(box.min.y, box.max.y);
                    material.setDiffusionFromObject(child);
                    child.receiveShadow = false;
                    child.material = material;
                    child.material.needsUpdate = true;
                }

                if (child.name === "grass") {
                    child.castShadow = false;
                    child.receiveShadow = true;
                    // child.material.emissiveIntensity = 0.1;
                    // child.material.emissive = new Color("#3FD3BD");
                    // child.material.needsUpdate = true;
                    child.material.color = new Color('#81e4d8ff)').multiplyScalar(0.7);

                    // child.material.color = new Color('rgb(4,136,101)').multiplyScalar(0.25);
                    child.material.metalness = 0.2;
                    child.material.roughness = 0.8;

                    // console.log(child.material, 'child.material-------------------');

                    ['metalnessMap', 'normalMap', 'roughnessMap', 'specularColorMap'].forEach((mapName) => {
                        const texture = child.material[mapName];
                        if (texture) {
                            texture.wrapS = texture.wrapT = RepeatWrapping;
                            texture.repeat.set(0.3, 0.3);
                            texture.needsUpdate = true;
                        }
                    });

                    child.material.normalScale = new Vector2(3, 3);

                    // const material = child.material || new MeshStandardMaterial();
                    // material.map = null;
                    // material.color = new Color('rgb(4,136,101)').multiplyScalar(0.25);
                    // // material.metalness = 0.2;
                    // // material.roughness = 0.8;
                    // ['metalnessMap', 'normalMap', 'roughnessMap', 'specularColorMap'].forEach((mapName) => {
                    //     const texture = material[mapName];
                    //     if (texture) {
                    //         texture.wrapS = texture.wrapT = RepeatWrapping;
                    //         texture.repeat.set(0.3, 0.3);
                    //         texture.needsUpdate = true;
                    //     }
                    // });
                    // material.normalScale = new Vector2(3, 3);

                    // child.castShadow = false;
                    // child.receiveShadow = true;
                    // child.material = material;
                    // // modelGreen.addModel(layer).then(() => {
                    //     modelGreen._model.name = 'modelGreen';
                    //     modelGreen.traverse((mesh) => {
                    //         if (mesh.isMesh) {
                    //             mesh.castShadow = false;
                    //             mesh.receiveShadow = true;
                    //             mesh.material = material;
                    //         }
                    //     });
                    // });
                }
            }
        });
    }
}

Model.mergeOptions(options);