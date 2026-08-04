/**
 * Retry configuration
 * 重试配置
 */
export interface RetryOptions {
    /** Maximum retry attempts (default: 2) 最大重试次数 */
    maxRetries?: number;
    /** Base delay in ms (default: 100) 基础延迟毫秒 */
    baseDelay?: number;
    /** Max delay in ms (default: 2000) 最大延迟毫秒 */
    maxDelay?: number;
}
/**
 * Retry Loader Wrapper
 * 重试加载器包装器
 * @description Wraps any loader with automatic retry logic using exponential backoff.
 *              包装任何加载器，添加自动重试逻辑（指数退避）。
 */
export declare class RetryLoader<T> {
    private _loader;
    private _maxRetries;
    private _baseDelay;
    private _maxDelay;
    constructor(loader: (context: any) => Promise<T>, options?: RetryOptions);
    /**
     * Load with retry
     * 带重试的加载
     */
    load(context: any): Promise<T>;
    /**
     * Calculate delay with exponential backoff
     * 计算指数退避延迟
     */
    private _calculateDelay;
    private _sleep;
    /** Get max retries 获取最大重试次数 */
    get maxRetries(): number;
    /** Set max retries 设置最大重试次数 */
    set maxRetries(value: number);
}
