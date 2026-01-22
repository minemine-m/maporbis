import { Group, LoadingManager } from 'three';
import { DRACOLoader, FBXLoader, GLTFLoader } from 'three-stdlib';
import { ModelStyle } from '../style';

/**
 * 模型缓存项
 */
interface ModelCacheItem {
    model: Group;
    animations?: any[];
}

/**
 * 外部模型加载器 (Singleton Service)
 * @class ExternalModelLoader
 * @description 负责加载、缓存和处理外部 3D 模型 (GLTF, FBX)
 */
export class ExternalModelLoader {
    private static instance: ExternalModelLoader;

    private cache = new Map<string, ModelCacheItem>();
    private gltfLoader: GLTFLoader;
    private fbxLoader: FBXLoader;
    private dracoLoader?: DRACOLoader;

    private constructor(manager?: LoadingManager) {
        this.gltfLoader = new GLTFLoader(manager);
        this.fbxLoader = new FBXLoader(manager);
    }

    /**
     * 获取单例实例
     * @param manager 
     */
    public static getInstance(manager?: LoadingManager): ExternalModelLoader {
        if (!this.instance) {
            this.instance = new ExternalModelLoader(manager);
        }
        return this.instance;
    }

    /**
     * 清除缓存
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * 加载模型
     * @param options 模型样式配置
     */
    public async load(options: ModelStyle): Promise<{ model: Group; animations: any[] }> {
        const cacheKey = `${options.type}:${options.url}`;

        // 1. 检查缓存
        if (this.cache.has(cacheKey)) {
            return this.cloneCachedModel(cacheKey, options);
        }

        // 2. 初始化 Draco 解码器 (如果需要)
        if (options.type === 'gltf' && options.dracoOptions?.enable) {
            this.ensureDracoLoader(options.dracoOptions.decoderPath);
        }

        // 3. 加载模型
        let model: Group;
        let animations: any[] | undefined;

        try {
            if (options.type === 'gltf') {
                const gltf = await this.gltfLoader.loadAsync(options.url);
                model = gltf.scene;
                animations = gltf.animations;
            } else {
                model = await this.fbxLoader.loadAsync(options.url);
                animations = (model as any).animations;
            }

            // 4. 存入缓存
            this.cache.set(cacheKey, { model, animations });

            // 5. 返回处理后的副本
            return {
                model: this.processModel(model.clone(), options),
                animations: this.processAnimations(animations)
            };

        } catch (error) {
            console.error(`[ExternalModelLoader] Failed to load ${options.type} model from ${options.url}:`, error);
            throw error;
        }
    }

    /**
     * 确保 Draco 加载器已初始化
     * @param decoderPath 
     */
    private ensureDracoLoader(decoderPath = '/draco/'): void {
        if (!this.dracoLoader) {
            this.dracoLoader = new DRACOLoader();
            this.dracoLoader.setDecoderPath(decoderPath);
            this.gltfLoader.setDRACOLoader(this.dracoLoader);
        }
    }

    /**
     * 克隆缓存的模型
     * @param cacheKey 
     * @param options 
     */
    private cloneCachedModel(cacheKey: string, options: ModelStyle): { model: Group; animations: any[] } {
        const cached = this.cache.get(cacheKey)!;
        const clone = cached.model.clone();
        
        return {
            model: this.processModel(clone, options),
            animations: this.processAnimations(cached.animations)
        };
    }

    /**
     * 处理动画数据 (标准化)
     * @param animations 
     */
    private processAnimations(animations?: any[]): any[] {
        return animations?.map(anim => ({ 
            ...anim, 
            name: anim.name || 'unnamed' 
        })) || [];
    }

    /**
     * 处理模型变换 (位置、缩放、旋转)
     * @param model 
     * @param options 
     */
    private processModel(model: Group, options: ModelStyle): Group {
        // 应用位置
        if (options.position) {
            model.position.copy(options.position);
        }

        // 应用缩放
        if (options.scale) {
            if (typeof options.scale === 'number') {
                model.scale.setScalar(options.scale);
            } else {
                const { x, y, z } = options.scale;
                if (x !== undefined) model.scale.x = x;
                if (y !== undefined) model.scale.y = y;
                if (z !== undefined) model.scale.z = z;
            }
        }
        
        // 应用旋转 (如果有)
        if (options.rotation) {
             model.rotation.setFromVector3(options.rotation);
        }

        return model;
    }
}
