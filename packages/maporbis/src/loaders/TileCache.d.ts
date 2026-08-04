import { TileMeshData } from "./LoaderInterfaces";
/**
 * LRU Tile Cache
 * LRU 瓦片缓存
 * @description Caches loaded tile geometry and materials to avoid re-fetching on zoom back.
 *              Uses Least Recently Used eviction when cache is full.
 *              缓存已加载的瓦片几何体和材质，避免缩放回去时重新请求。
 *              满时使用最近最少使用策略淘汰。
 */
export declare class TileCache {
    private _cache;
    private _maxSize;
    private _hits;
    private _misses;
    /**
     * Create a tile cache
     * 创建瓦片缓存
     * @param maxSize - Maximum number of tiles to cache (default 512)
     */
    constructor(maxSize?: number);
    /**
     * Generate cache key from tile coordinates
     * 从瓦片坐标生成缓存键
     */
    private _key;
    /**
     * Get cached tile data
     * 获取缓存的瓦片数据
     * @returns Cached data or undefined if not found
     */
    get(z: number, x: number, y: number): TileMeshData | undefined;
    /**
     * Store tile data in cache
     * 存储瓦片数据到缓存
     */
    set(z: number, x: number, y: number, data: TileMeshData): void;
    /**
     * Check if tile is cached
     * 检查瓦片是否已缓存
     */
    has(z: number, x: number, y: number): boolean;
    /**
     * Remove tile from cache
     * 从缓存中移除瓦片
     */
    delete(z: number, x: number, y: number): void;
    /**
     * Clear all cached data
     * 清空所有缓存数据
     */
    clear(): void;
    /**
     * Evict least recently used entry
     * 淘汰最近最少使用的条目
     */
    private _evict;
    /**
     * Get current cache size
     * 获取当前缓存大小
     */
    get size(): number;
    /**
     * Get cache hits
     * 获取缓存命中次数
     */
    get hits(): number;
    /**
     * Get cache misses
     * 获取缓存未命中次数
     */
    get misses(): number;
    /**
     * Get max cache size
     * 获取最大缓存大小
     */
    get maxSize(): number;
    /**
     * Set max cache size
     * 设置最大缓存大小
     */
    set maxSize(value: number);
    /**
     * Get cache hit rate
     * 获取缓存命中率
     */
    get hitRate(): number;
    /**
     * Get cache stats
     * 获取缓存统计
     */
    get stats(): {
        size: number;
        maxSize: number;
        hits: number;
        misses: number;
        hitRate: number;
    };
    /**
     * Reset stats
     * 重置统计
     */
    resetStats(): void;
}
