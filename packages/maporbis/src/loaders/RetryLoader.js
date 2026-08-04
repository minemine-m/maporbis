/**
 * Retry Loader Wrapper
 * 重试加载器包装器
 * @description Wraps any loader with automatic retry logic using exponential backoff.
 *              包装任何加载器，添加自动重试逻辑（指数退避）。
 */
export class RetryLoader {
    _loader;
    _maxRetries;
    _baseDelay;
    _maxDelay;
    constructor(loader, options = {}) {
        this._loader = loader;
        this._maxRetries = options.maxRetries ?? 2;
        this._baseDelay = options.baseDelay ?? 100;
        this._maxDelay = options.maxDelay ?? 2000;
    }
    /**
     * Load with retry
     * 带重试的加载
     */
    async load(context) {
        let lastError = null;
        for (let attempt = 0; attempt <= this._maxRetries; attempt++) {
            try {
                return await this._loader(context);
            }
            catch (error) {
                lastError = error;
                if (attempt < this._maxRetries) {
                    const delay = this._calculateDelay(attempt);
                    console.warn(`[RetryLoader] Load failed (attempt ${attempt + 1}/${this._maxRetries + 1}), ` +
                        `retrying in ${delay}ms...`, context);
                    await this._sleep(delay);
                }
            }
        }
        // All retries failed
        console.error(`[RetryLoader] Load failed after ${this._maxRetries + 1} attempts`, lastError);
        throw lastError;
    }
    /**
     * Calculate delay with exponential backoff
     * 计算指数退避延迟
     */
    _calculateDelay(attempt) {
        const delay = this._baseDelay * Math.pow(2, attempt);
        return Math.min(delay, this._maxDelay);
    }
    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /** Get max retries 获取最大重试次数 */
    get maxRetries() {
        return this._maxRetries;
    }
    /** Set max retries 设置最大重试次数 */
    set maxRetries(value) {
        this._maxRetries = Math.max(0, value);
    }
}
