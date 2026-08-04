import { FBXLoader } from 'three-stdlib';
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
export class FBXModelLoader extends AbstractModelLoader {
    readonly name = 'FBXModelLoader';
    readonly extensions = ['fbx'];

    /**
     * FBX loader instance.
     * FBX加载器实例
     */
    private _loader: FBXLoader;

    constructor() {
        super();
        this._loader = new FBXLoader();
    }

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
    protected async performLoad(options: ModelLoaderOptions): Promise<ModelLoadResult> {
        const { url, manager, onProgress } = options;

        // Set loading manager if provided
        if (manager) {
            this._loader.manager = manager;
        }

        return new Promise((resolve, reject) => {
            this._loader.load(
                url,
                (fbx) => {
                    const result: ModelLoadResult = {
                        scene: fbx,
                        animations: fbx.animations || [],
                        userData: {
                            fbxData: fbx.userData
                        }
                    };
                    resolve(result);
                },
                (xhr) => {
                    if (onProgress && xhr.lengthComputable) {
                        const progress = xhr.loaded / xhr.total;
                        onProgress(progress);
                    }
                },
                (error) => {
                    reject(new Error(`FBX load failed: ${error}`));
                }
            );
        });
    }
}
