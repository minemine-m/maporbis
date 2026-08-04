import { GLTFLoader } from 'three-stdlib';
import { DRACOLoader } from 'three-stdlib';
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
export class GLTFModelLoader extends AbstractModelLoader {
    readonly name = 'GLTFModelLoader';
    readonly extensions = ['gltf', 'glb'];

    /**
     * GLTF loader instance.
     * GLTF加载器实例
     */
    private _loader: GLTFLoader;

    /**
     * Draco loader instance.
     * Draco加载器实例
     */
    private _dracoLoader: DRACOLoader | null = null;

    /**
     * Whether Draco is currently configured.
     * 是否已配置Draco
     */
    private _dracoConfigured = false;

    constructor() {
        super();
        this._loader = new GLTFLoader();
    }

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
    protected async performLoad(options: ModelLoaderOptions): Promise<ModelLoadResult> {
        const { url, manager, dracoOptions, onProgress } = options;

        // Set loading manager if provided
        if (manager) {
            this._loader.manager = manager;
        }

        // Setup Draco decoder if enabled
        if (dracoOptions?.enable && !this._dracoConfigured) {
            if (!this._dracoLoader) {
                this._dracoLoader = new DRACOLoader();
            }
            const decoderPath = dracoOptions.decoderPath || '/draco/';
            this._dracoLoader.setDecoderPath(decoderPath);
            this._loader.setDRACOLoader(this._dracoLoader);
            this._dracoConfigured = true;
        }

        return new Promise((resolve, reject) => {
            this._loader.load(
                url,
                (gltf) => {
                    const result: ModelLoadResult = {
                        scene: gltf.scene,
                        animations: gltf.animations || [],
                        cameras: gltf.cameras,
                        userData: {
                            parser: gltf.parser,
                            userData: gltf.userData
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
                    reject(new Error(`GLTF load failed: ${error}`));
                }
            );
        });
    }

    /**
     * Dispose resources.
     * 释放资源
     */
    dispose(): void {
        if (this._dracoLoader) {
            this._dracoLoader.dispose();
            this._dracoLoader = null;
            this._dracoConfigured = false;
        }
    }
}
