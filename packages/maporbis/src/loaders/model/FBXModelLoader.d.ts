import { AbstractModelLoader, ModelLoaderOptions } from './AbstractModelLoader';
import { ModelLoadResult } from './ModelCache';
/**
 * FBX model loader.
 * FBX模型加载器
 *
 * @description
 * Loads FBX format 3D models.
 *
 * 加载FBX格式的3D模型
 *
 * @extends AbstractModelLoader
 * @category Loader
 */
export declare class FBXModelLoader extends AbstractModelLoader {
    readonly name = "FBXModelLoader";
    readonly extensions: string[];
    /**
     * FBX loader instance.
     * FBX加载器实例
     */
    private _loader;
    constructor();
    /**
     * Perform FBX model loading.
     * 执行FBX模型加载
     *
     * @param options Loader options
     *                加载器选项
     * @returns Promise resolving to model result
     *          解析为模型结果的Promise
     * @protected
     * @override
     */
    protected performLoad(options: ModelLoaderOptions): Promise<ModelLoadResult>;
}
