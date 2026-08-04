import { Object3D, AnimationClip, Camera } from 'three';
/**
 * Loaded model result interface.
 * 加载的模型结果接口
 *
 * @category Loader
 */
export interface ModelLoadResult {
    /**
     * Root scene/group object.
     * 根场景/组对象
     */
    scene: Object3D;
    /**
     * Available animations.
     * 可用动画
     */
    animations: AnimationClip[];
    /**
     * All cameras in the model.
     * 模型中的所有相机
     */
    cameras?: Camera[];
    /**
     * Original loader data (for advanced use).
     * 原始加载器数据（用于高级用途）
     */
    userData?: any;
}
/**
 * Model caching system.
 * 模型缓存系统
 *
 * @description
 * Manages a cache of loaded 3D models to avoid redundant network requests.
 * Implements LRU eviction with configurable size limits.
 *
 * 管理已加载3D模型的缓存，避免冗余的网络请求
 * 实现具有可配置大小限制的LRU淘汰策略
 *
 * @category Loader
 */
export declare class ModelCache {
    /**
     * Cache storage.
     * 缓存存储
     */
    private static _cache;
    /**
     * Maximum cache size (number of models).
     * 最大缓存大小（模型数量）
     */
    private static _maxSize;
    /**
     * Maximum cache age in milliseconds (default: 1 hour).
     * 最大缓存年龄（毫秒）（默认：1小时）
     */
    private static _maxAge;
    /**
     * Get cached model result.
     * 获取缓存的模型结果
     *
     * @param url Model URL
     *            模型URL
     * @returns Cached result (cloned) or null
     *          缓存的结果（克隆后）或null
     */
    static get(url: string): ModelLoadResult | null;
    /**
     * Set/update cache entry.
     * 设置/更新缓存条目
     *
     * @param url Model URL
     *            模型URL
     * @param result Model result
     *               模型结果
     */
    static set(url: string, result: ModelLoadResult): void;
    /**
     * Remove entry from cache.
     * 从缓存中移除条目
     *
     * @param url Model URL
     *            模型URL
     * @returns Whether removal was successful
     *          是否成功移除
     */
    static remove(url: string): boolean;
    /**
     * Clear all cache entries.
     * 清除所有缓存条目
     */
    static clear(): void;
    /**
     * Set maximum cache size.
     * 设置最大缓存大小
     *
     * @param size Maximum number of models to cache
     *             要缓存的最大模型数量
     */
    static setMaxSize(size: number): void;
    /**
     * Set maximum cache age.
     * 设置最大缓存年龄
     *
     * @param ageMs Maximum age in milliseconds
     *              最大年龄（毫秒）
     */
    static setMaxAge(ageMs: number): void;
    /**
     * Get cache statistics.
     * 获取缓存统计信息
     *
     * @returns Cache statistics
     *          缓存统计信息
     */
    static getStats(): {
        size: number;
        maxSize: number;
        entries: Array<{
            url: string;
            hits: number;
            age: number;
        }>;
    };
    /**
     * Clone model result for cached reuse.
     * 克隆模型结果用于缓存复用
     *
     * @param result Original result
     *               原始结果
     * @returns Cloned result
     *          克隆的结果
     * @private
     */
    private static _cloneResult;
    /**
     * Evict least recently used entry.
     * 淘汰最少使用的条目
     *
     * @private
     */
    private static _evictLRU;
}
