import { GLTFModelLoader } from './GLTFModelLoader';
import { FBXModelLoader } from './FBXModelLoader';
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
export class ModelLoaderFactory {
    /**
     * Registered loaders.
     * 已注册的加载器
     */
    static _loaders = new Map();
    /**
     * Register default loaders on first use.
     * 首次使用时注册默认加载器
     */
    static _initialized = false;
    /**
     * Initialize default loaders.
     * 初始化默认加载器
     *
     * @private
     */
    static _initialize() {
        if (this._initialized)
            return;
        this.register(new GLTFModelLoader());
        this.register(new FBXModelLoader());
        this._initialized = true;
    }
    /**
     * Register a model loader.
     * 注册模型加载器
     *
     * @param loader Loader instance
     *               加载器实例
     */
    static register(loader) {
        this._loaders.set(loader.name, loader);
    }
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
    static getLoader(type) {
        this._initialize();
        const loaderName = type === 'gltf' ? 'GLTFModelLoader' : 'FBXModelLoader';
        const loader = this._loaders.get(loaderName);
        if (!loader) {
            throw new Error(`ModelLoaderFactory: No loader registered for type "${type}"`);
        }
        return loader;
    }
    /**
     * Get loader by file extension.
     * 按文件扩展名获取加载器
     *
     * @param extension File extension (without dot)
     *                  文件扩展名（不含点）
     * @returns Loader instance or null
     *          加载器实例或null
     */
    static getLoaderByExtension(extension) {
        this._initialize();
        const ext = extension.toLowerCase();
        for (const loader of this._loaders.values()) {
            if (loader.supportsExtension(ext)) {
                return loader;
            }
        }
        return null;
    }
    /**
     * Get all registered loaders.
     * 获取所有已注册的加载器
     *
     * @returns Array of loader instances
     *          加载器实例数组
     */
    static getAllLoaders() {
        this._initialize();
        return Array.from(this._loaders.values());
    }
    /**
     * Check if a model type is supported.
     * 检查是否支持某种模型类型
     *
     * @param type Model type
     *             模型类型
     * @returns Whether the type is supported
     *          是否支持该类型
     */
    static isSupported(type) {
        this._initialize();
        const loaderName = type === 'gltf' ? 'GLTFModelLoader' : 'FBXModelLoader';
        return this._loaders.has(loaderName);
    }
}
