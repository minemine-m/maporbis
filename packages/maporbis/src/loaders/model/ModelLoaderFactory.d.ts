import { AbstractModelLoader } from './AbstractModelLoader';
/**
 * Supported model types.
 * 支持的模型类型
 */
export type ModelType = 'gltf' | 'fbx';
/**
 * Model loader factory.
 * 模型加载器工厂
 *
 * @description
 * Centralized factory for managing and retrieving model loaders.
 *
 * 用于管理和检索模型加载器的集中式工厂
 *
 * @category Loader
 */
export declare class ModelLoaderFactory {
    /**
     * Registered loaders.
     * 已注册的加载器
     */
    private static _loaders;
    /**
     * Register default loaders on first use.
     * 首次使用时注册默认加载器
     */
    private static _initialized;
    /**
     * Initialize default loaders.
     * 初始化默认加载器
     *
     * @private
     */
    private static _initialize;
    /**
     * Register a model loader.
     * 注册模型加载器
     *
     * @param loader Loader instance
     *               加载器实例
     */
    static register(loader: AbstractModelLoader): void;
    /**
     * Get loader by model type.
     * 按模型类型获取加载器
     *
     * @param type Model type ('gltf' or 'fbx')
     *             模型类型（'gltf'或'fbx'）
     * @returns Loader instance
     *          加载器实例
     * @throws Error if loader not found
     *         如果未找到加载器则抛出错误
     */
    static getLoader(type: ModelType): AbstractModelLoader;
    /**
     * Get loader by file extension.
     * 按文件扩展名获取加载器
     *
     * @param extension File extension (without dot)
     *                  文件扩展名（不含点）
     * @returns Loader instance or null
     *          加载器实例或null
     */
    static getLoaderByExtension(extension: string): AbstractModelLoader | null;
    /**
     * Get all registered loaders.
     * 获取所有已注册的加载器
     *
     * @returns Array of loader instances
     *          加载器实例数组
     */
    static getAllLoaders(): AbstractModelLoader[];
    /**
     * Check if a model type is supported.
     * 检查是否支持某种模型类型
     *
     * @param type Model type
     *             模型类型
     * @returns Whether the type is supported
     *          是否支持该类型
     */
    static isSupported(type: ModelType): boolean;
}
