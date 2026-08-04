import { SkeletonUtils } from 'three-stdlib';
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
export class ModelCache {
    /**
     * Cache storage.
     * 缓存存储
     */
    static _cache = new Map();
    /**
     * Maximum cache size (number of models).
     * 最大缓存大小（模型数量）
     */
    static _maxSize = 50;
    /**
     * Maximum cache age in milliseconds (default: 1 hour).
     * 最大缓存年龄（毫秒）（默认：1小时）
     */
    static _maxAge = 60 * 60 * 1000;
    /**
     * Get cached model result.
     * 获取缓存的模型结果
     *
     * @param url Model URL
     *            模型URL
     * @returns Cached result (cloned) or null
     *          缓存的结果（克隆后）或null
     */
    static get(url) {
        const entry = this._cache.get(url);
        if (!entry) {
            return null;
        }
        // Check if cache is stale
        const age = Date.now() - entry.timestamp;
        if (age > this._maxAge) {
            this._cache.delete(url);
            return null;
        }
        // Update hit count
        entry.hits++;
        // Clone the result to avoid shared state issues
        return this._cloneResult(entry.result);
    }
    /**
     * Set/update cache entry.
     * 设置/更新缓存条目
     *
     * @param url Model URL
     *            模型URL
     * @param result Model result
     *               模型结果
     */
    static set(url, result) {
        // Evict if cache is full
        if (this._cache.size >= this._maxSize) {
            this._evictLRU();
        }
        this._cache.set(url, {
            result,
            timestamp: Date.now(),
            hits: 0
        });
    }
    /**
     * Remove entry from cache.
     * 从缓存中移除条目
     *
     * @param url Model URL
     *            模型URL
     * @returns Whether removal was successful
     *          是否成功移除
     */
    static remove(url) {
        return this._cache.delete(url);
    }
    /**
     * Clear all cache entries.
     * 清除所有缓存条目
     */
    static clear() {
        this._cache.clear();
    }
    /**
     * Set maximum cache size.
     * 设置最大缓存大小
     *
     * @param size Maximum number of models to cache
     *             要缓存的最大模型数量
     */
    static setMaxSize(size) {
        this._maxSize = Math.max(1, size);
        // Evict if current size exceeds new limit
        while (this._cache.size > this._maxSize) {
            this._evictLRU();
        }
    }
    /**
     * Set maximum cache age.
     * 设置最大缓存年龄
     *
     * @param ageMs Maximum age in milliseconds
     *              最大年龄（毫秒）
     */
    static setMaxAge(ageMs) {
        this._maxAge = Math.max(0, ageMs);
    }
    /**
     * Get cache statistics.
     * 获取缓存统计信息
     *
     * @returns Cache statistics
     *          缓存统计信息
     */
    static getStats() {
        const now = Date.now();
        const entries = Array.from(this._cache.entries()).map(([url, entry]) => ({
            url,
            hits: entry.hits,
            age: now - entry.timestamp
        }));
        return {
            size: this._cache.size,
            maxSize: this._maxSize,
            entries
        };
    }
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
    static _cloneResult(result) {
        // Use SkeletonUtils.clone for proper skeleton/bone cloning
        let clonedScene;
        try {
            clonedScene = SkeletonUtils.clone(result.scene);
        }
        catch {
            // Fallback to regular clone if SkeletonUtils fails
            clonedScene = result.scene.clone(true);
        }
        return {
            scene: clonedScene,
            animations: result.animations.map(clip => clip.clone()),
            cameras: result.cameras?.map(cam => cam.clone()),
            userData: result.userData ? { ...result.userData } : undefined
        };
    }
    /**
     * Evict least recently used entry.
     * 淘汰最少使用的条目
     *
     * @private
     */
    static _evictLRU() {
        if (this._cache.size === 0)
            return;
        // Find entry with lowest hit count and oldest timestamp
        let lruKey = null;
        let lruScore = Infinity;
        for (const [url, entry] of this._cache.entries()) {
            // Score: prioritize low hits and old age
            const ageWeight = Date.now() - entry.timestamp;
            const score = entry.hits * 1000000 + ageWeight;
            if (score < lruScore) {
                lruScore = score;
                lruKey = url;
            }
        }
        if (lruKey) {
            this._cache.delete(lruKey);
        }
    }
}
