import { Object3D } from 'three';
import { Line2 } from 'three-stdlib';
import { Style, StyleInput } from '../../style/index';

/**
 * Internal feature style queue manager.
 * 内部要素样式队列管理器
 * 
 * @description
 * Handles asynchronous style application with queue mechanism and retry logic.
 * 处理带有队列机制和重试逻辑的异步样式应用
 * 
 * @internal
 */
export class FeatureStyleManager {
    /** Style queue for handling asynchronous style application. 样式队列（用于处理异步样式应用） */
    private _styleQueue: StyleInput[] = [];
    
    /** Whether style is currently being applied. 是否正在应用样式 */
    private _isApplyingStyle = false;
    
    /** Current style instance. 当前样式实例 */
    private _currentStyle?: Style;
    
    /** Callback when style is applied successfully. 样式成功应用后的回调 */
    private _onStyleApplied?: (style: Style) => void;
    
    /** Render object getter. 渲染对象获取器 */
    private _getRenderObject: () => Object3D | Line2 | null;
    
    /** Add render object to parent. 将渲染对象添加到父级 */
    private _addRenderObject: () => void;

    /**
     * Create a style manager instance.
     * 创建样式管理器实例
     * 
     * @param getRenderObject - Function to get current render object. 获取当前渲染对象的函数
     * @param addRenderObject - Function to add render object to parent. 添加渲染对象到父级的函数
     */
    constructor(
        getRenderObject: () => Object3D | Line2 | null,
        addRenderObject: () => void
    ) {
        this._getRenderObject = getRenderObject;
        this._addRenderObject = addRenderObject;
    }

    /**
     * Set callback for when style is applied.
     * 设置样式应用后的回调
     * 
     * @param callback - Callback function. 回调函数
     */
    setOnStyleApplied(callback: (style: Style) => void): void {
        this._onStyleApplied = callback;
    }

    /**
     * Get current style.
     * 获取当前样式
     * 
     * @returns Current style or undefined. 当前样式或undefined
     */
    getCurrentStyle(): Style | undefined {
        return this._currentStyle;
    }

    /**
     * Enqueue a style for application.
     * 将样式加入应用队列
     * 
     * @param input - Style configuration or style instance. 样式配置或样式实例
     * @returns The style instance. 样式实例
     */
    enqueueStyle(input: StyleInput): Style {
        const style = input instanceof Style ? input : new Style(input);
        this._currentStyle = style;
        const configCopy = JSON.parse(JSON.stringify(style.config));
        this._styleQueue.push(configCopy);
        this._tryProcessStyleQueue();
        return style;
    }

    /**
     * Check if style queue can be processed.
     * 检查样式队列是否可以处理
     * 
     * @returns Whether processing should start. 是否应该开始处理
     */
    canProcessQueue(): boolean {
        const renderObject = this._getRenderObject();
        return (
            renderObject !== null &&
            !this._isApplyingStyle &&
            this._styleQueue.length > 0
        );
    }

    /**
     * Try to process the style queue.
     * 尝试处理样式队列
     */
    _tryProcessStyleQueue(): void {
        if (this.canProcessQueue()) {
            this._processStyleQueue()
                .catch((error) => {
                    this._isApplyingStyle = false;
                    this._tryProcessStyleQueue();
                    console.warn('Style application failed:', error);
                });
        }
    }

    /**
     * Process the style queue sequentially.
     * 按顺序处理样式队列
     */
    private async _processStyleQueue(): Promise<void> {
        const renderObject = this._getRenderObject();
        if (!renderObject || this._isApplyingStyle || this._styleQueue.length === 0) {
            return;
        }

        this._isApplyingStyle = true;
        const currentStyle = this._styleQueue[0];

        try {
            const styleInstance = new Style(JSON.parse(JSON.stringify(currentStyle)));
            await this._applyStyleWithRetry(styleInstance, renderObject);
            this._styleQueue.shift();
            
            if (this._styleQueue.length > 0) {
                await this._processStyleQueue();
            }
        } catch (error) {
            throw error;
        } finally {
            this._isApplyingStyle = false;
            if (this._styleQueue.length > 0) {
                this._tryProcessStyleQueue();
            }
        }
    }

    /**
     * Apply style with retry mechanism.
     * 应用样式（带重试机制）
     * 
     * @param style - Style instance. 样式实例
     * @param renderObject - Render object to apply style to. 要应用样式的渲染对象
     * @param maxRetries - Maximum retries (default: 3). 最大重试次数（默认3）
     * @param baseDelay - Base delay in ms (default: 100). 基础延迟时间（毫秒，默认100）
     */
    private async _applyStyleWithRetry(
        style: Style,
        renderObject: Object3D | Line2,
        maxRetries: number = 3,
        baseDelay: number = 100
    ): Promise<void> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                if (!renderObject.parent) {
                    this._addRenderObject();
                    await new Promise(r => requestAnimationFrame(r));
                }
                await style.applyTo(renderObject);
                
                // Notify that style was applied
                if (this._onStyleApplied) {
                    this._onStyleApplied(style);
                }
                
                return;
            } catch (error) {
                lastError = error as Error;
                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
        throw lastError || new Error('Style application failed after retries');
    }

    /**
     * Check if geometry is initializing.
     * 检查几何体是否正在初始化
     */
    get isApplyingStyle(): boolean {
        return this._isApplyingStyle;
    }

    /**
     * Check if there are pending styles.
     * 检查是否有待处理的样式
     */
    get hasPendingStyles(): boolean {
        return this._styleQueue.length > 0;
    }
}
