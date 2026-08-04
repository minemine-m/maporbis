import { AbstractModelLoader, ModelLoaderOptions } from './AbstractModelLoader';
import { ModelLoadResult } from './ModelCache';
/**
 * GLTF/GLB model loader.
 * GLTF/GLB模型加载器
 *
 * @description
 * Loads GLTF and GLB format 3D models with optional Draco compression support.
 *
 * 加载GLTF和GLB格式的3D模型，支持可选的Draco压缩
 *
 * @extends AbstractModelLoader
 * @category Loader
 */
export declare class GLTFModelLoader extends AbstractModelLoader {
    readonly name = "GLTFModelLoader";
    readonly extensions: string[];
    /**
     * GLTF loader instance.
     * GLTF加载器实例
     */
    private _loader;
    /**
     * Draco loader instance.
     * Draco加载器实例
     */
    private _dracoLoader;
    /**
     * Whether Draco is currently configured.
     * 是否已配置Draco
     */
    private _dracoConfigured;
    constructor();
    /**
     * Perform GLTF model loading.
     * 执行GLTF模型加载
     *
     * @param options Loader options
     *                加载器选项
     * @returns Promise resolving to model result
     *          解析为模型结果的Promise
     * @protected
     * @override
     */
    protected performLoad(options: ModelLoaderOptions): Promise<ModelLoadResult>;
    /**
     * Dispose resources.
     * 释放资源
     */
    dispose(): void;
}
