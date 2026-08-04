/**
 * LRU Tile Cache
 * LRU 瓦片缓存
 * @description Caches loaded tile geometry and materials to avoid re-fetching on zoom back.
 *              Uses Least Recently Used eviction when cache is full.
 *              缓存已加载的瓦片几何体和材质，避免缩放回去时重新请求。
 *              满时使用最近最少使用策略淘汰。
 */
export class TileCache {
    _cache = new Map();
    _maxSize;
    _hits = 0;
    _misses = 0;
    /**
     * Create a tile cache
     * 创建瓦片缓存
     * @param maxSize - Maximum number of tiles to cache (default 512)
     */
    constructor(maxSize = 512) {
        this._maxSize = maxSize;
    }
    /**
     * Generate cache key from tile coordinates
     * 从瓦片坐标生成缓存键
     */
    _key(z, x, y) {
        return `${z}-${x}-${y}`;
    }
    /**
     * Get cached tile data
     * 获取缓存的瓦片数据
     * @returns Cached data or undefined if not found
     */
    get(z, x, y) {
        const key = this._key(z, x, y);
        const entry = this._cache.get(key);
        if (entry) {
            // Update access time 更新访问时间
            entry.lastAccess = Date.now();
            this._hits++;
            return entry.data;
        }
        this._misses++;
        return undefined;
    }
    /**
     * Store tile data in cache
     * 存储瓦片数据到缓存
     */
    set(z, x, y, data) {
        const key = this._key(z, x, y);
        // If already exists, update 如果已存在，更新
        if (this._cache.has(key)) {
            this._cache.get(key).data = data;
            this._cache.get(key).lastAccess = Date.now();
            return;
        }
        // Evict if full 满时淘汰
        if (this._cache.size >= this._maxSize) {
            this._evict();
        }
        // Add new entry 添加新条目
        this._cache.set(key, {
            data,
            lastAccess: Date.now()
        });
    }
    /**
     * Check if tile is cached
     * 检查瓦片是否已缓存
     */
    has(z, x, y) {
        return this._cache.has(this._key(z, x, y));
    }
    /**
     * Remove tile from cache
     * 从缓存中移除瓦片
     */
    delete(z, x, y) {
        this._cache.delete(this._key(z, x, y));
    }
    /**
     * Clear all cached data
     * 清空所有缓存数据
     */
    clear() {
        this._cache.clear();
    }
    /**
     * Evict least recently used entry
     * 淘汰最近最少使用的条目
     */
    _evict() {
        let oldestKey = null;
        let oldestTime = Infinity;
        for (const [key, entry] of this._cache) {
            if (entry.lastAccess < oldestTime) {
                oldestTime = entry.lastAccess;
                oldestKey = key;
            }
        }
        if (oldestKey) {
            this._cache.delete(oldestKey);
        }
    }
    /**
     * Get current cache size
     * 获取当前缓存大小
     */
    get size() {
        return this._cache.size;
    }
    /**
     * Get cache hits
     * 获取缓存命中次数
     */
    get hits() {
        return this._hits;
    }
    /**
     * Get cache misses
     * 获取缓存未命中次数
     */
    get misses() {
        return this._misses;
    }
    /**
     * Get max cache size
     * 获取最大缓存大小
     */
    get maxSize() {
        return this._maxSize;
    }
    /**
     * Set max cache size
     * 设置最大缓存大小
     */
    set maxSize(value) {
        this._maxSize = value;
        // Evict if over new limit 超过新限制时淘汰
        while (this._cache.size > this._maxSize) {
            this._evict();
        }
    }
    /**
     * Get cache hit rate
     * 获取缓存命中率
     */
    get hitRate() {
        const total = this._hits + this._misses;
        return total === 0 ? 0 : this._hits / total;
    }
    /**
     * Get cache stats
     * 获取缓存统计
     */
    get stats() {
        return {
            size: this._cache.size,
            maxSize: this._maxSize,
            hits: this._hits,
            misses: this._misses,
            hitRate: this.hitRate
        };
    }
    /**
     * Reset stats
     * 重置统计
     */
    resetStats() {
        this._hits = 0;
        this._misses = 0;
    }
}
