import { ModelCache } from './ModelCache';
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
export class AbstractModelLoader {
    /**
     * Load model from URL.
     * 从URL加载模型
     *
     * @param options Loader options
     *                加载器选项
     * @returns Promise resolving to model result
     *          解析为模型结果的Promise
     */
    async load(options) {
        const { url, onError } = options;
        try {
            // Check cache first
            const cached = ModelCache.get(url);
            if (cached) {
                return cached;
            }
            // Perform actual load
            const result = await this.performLoad(options);
            // Cache the result
            ModelCache.set(url, result);
            return result;
        }
        catch (error) {
            console.error(`${this.name}: Failed to load ${url}`, error);
            if (onError) {
                onError(error);
            }
            throw error;
        }
    }
    /**
     * Check if this loader supports the given file extension.
     * 检查此加载器是否支持给定的文件扩展名
     *
     * @param extension File extension (without dot)
     *                  文件扩展名（不含点）
     * @returns Whether the extension is supported
     *          是否支持该扩展名
     */
    supportsExtension(extension) {
        return this.extensions.includes(extension.toLowerCase());
    }
}
