import { LoadingManager } from 'three';
import { ModelLoadResult } from './ModelCache';
/**
 * Model loader configuration options.
 * 模型加载器配置选项
 *
 * @category Loader
 */
export interface ModelLoaderOptions {
    /**
     * Model URL.
     * 模型URL
     */
    url: string;
    /**
     * Loading manager (optional).
     * 加载管理器（可选）
     */
    manager?: LoadingManager;
    /**
     * Draco compression options (GLTF only).
     * Draco压缩选项（仅GLTF）
     */
    dracoOptions?: {
        enable: boolean;
        decoderPath?: string;
    };
    /**
     * Progress callback (0-1).
     * 进度回调（0-1）
     */
    onProgress?: (progress: number) => void;
    /**
     * Error callback.
     * 错误回调
     */
    onError?: (error: Error) => void;
}
/**
 * Abstract model loader base class.
 * 抽象模型加载器基类
 *
 * @description
 * Provides common functionality for all model loaders including:
 * - Caching mechanism
 * - Progress tracking
 * - Error handling
 *
 * 为所有模型加载器提供通用功能，包括：
 * - 缓存机制
 * - 进度跟踪
 * - 错误处理
 *
 * @abstract
 * @category Loader
 */
export declare abstract class AbstractModelLoader {
    /**
     * Loader name/type identifier.
     * 加载器名称/类型标识
     */
    abstract readonly name: string;
    /**
     * Supported file extensions.
     * 支持的文件扩展名
     */
    abstract readonly extensions: string[];
    /**
     * Load model from URL.
     * 从URL加载模型
     *
     * @param options Loader options
     *                加载器选项
     * @returns Promise resolving to model result
     *          解析为模型结果的Promise
     */
    load(options: ModelLoaderOptions): Promise<ModelLoadResult>;
    /**
     * Perform actual model loading (implemented by subclasses).
     * 执行实际的模型加载（由子类实现）
     *
     * @param options Loader options
     *                加载器选项
     * @returns Promise resolving to model result
     *          解析为模型结果的Promise
     * @protected
     * @abstract
     */
    protected abstract performLoad(options: ModelLoaderOptions): Promise<ModelLoadResult>;
    /**
     * Check if this loader supports the given file extension.
     * 检查此加载器是否支持给定的文件扩展名
     *
     * @param extension File extension (without dot)
     *                  文件扩展名（不含点）
     * @returns Whether the extension is supported
     *          是否支持该扩展名
     */
    supportsExtension(extension: string): boolean;
}
