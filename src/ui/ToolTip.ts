import { UIComponent, type UIComponentOptions } from "./UIComponent";
import type { Coordinate } from "../types";

/**
 * ToolTip content type.
 * ToolTip 内容类型
  * @category UI
 */
export type ToolTipContent =
    | string
    | HTMLElement
    | ((container: HTMLElement) => void);

/**
 * ToolTip options.
 * ToolTip 配置项
  * @category UI
 */
export type ToolTipOptions = UIComponentOptions & {
    /** 
     * Width.
     * 宽度 
     */
    width?: number;
    /** 
     * Height.
     * 高度 
     */
    height?: number;
    /** 
     * Show timeout (ms), 0 means show immediately.
     * 延时显示（毫秒），0 表示立即显示 
     */
    showTimeout?: number;
    /** 
     * Content.
     * 提示内容 
     */
    content?: ToolTipContent;
};

/**
 * ToolTip Component.
 * 提示框组件
 * @extends UIComponent
  * @category UI
 */
export class ToolTip extends UIComponent {
    declare options: ToolTipOptions;

    private _content?: ToolTipContent;
    private _timeoutId: number | undefined;
    private _boundOnOwnerMove = (e: any) => this._onOwnerMove(e);
    private _boundOnOwnerOut = () => this._onOwnerOut();
    private _boundOnOwnerRemoved = () => this._onOwnerRemoved();

    /**
     * @param options ToolTip options ToolTip 配置
     */
    constructor(options: ToolTipOptions = {}) {
        super({
            single: false, // tooltip usually not global singleton tooltip 通常不做全局单例
            ...options,
        });
        this._content = options.content;
    }

    protected _getClassName(): string {
        return "ToolTip";
    }

    /**
     * Build ToolTip DOM structure.
     * 构建 ToolTip 的 DOM 结构
     */
    protected buildOn(): HTMLElement {
        const container = document.createElement("div");
        const inner = document.createElement("div");

        // Default style class name, can be configured in CSS via maporbis-tooltip
        // 默认样式类名，可以在 CSS 里配 maporbis-tooltip
        inner.className = "maporbis-tooltip";

        const extraClass = this.options.containerClass;
        if (extraClass) {
            const classes = Array.isArray(extraClass) ? extraClass : [extraClass];
            classes.forEach((cls) => {
                inner.classList.add(cls);
            });
        }

        const { width, height } = this.options;
        if (typeof width === "number") {
            inner.style.width = `${width}px`;
        }
        if (typeof height === "number") {
            inner.style.height = `${height}px`;
        }

        const content = this._content;
        if (typeof content === "function") {
            content(inner);
        } else if (content instanceof HTMLElement) {
            inner.appendChild(content);
        } else if (typeof content === "string") {
            inner.innerHTML = content;
        }

        container.appendChild(inner);
        return container;
    }

    /**
     * Calculate offset based on DOM size to make tooltip appear slightly above and to the right of the point.
     * 根据 DOM 尺寸，做一个简单的偏移，让 tooltip 出现在点的上方偏右一点
     */
    protected override getOffset(): { x: number; y: number } {
        const base = super.getOffset();
        const dom = (this as any)._dom as HTMLElement | undefined;
        if (!dom) {
            return base;
        }

        const width = dom.offsetWidth;
        const height = dom.offsetHeight;

        return {
            x: base.x + 10 - width / 2,
            y: base.y - height - 10,
        };
    }

    /**
     * Bind to feature or map. The key is to bind mouse move/leave events to owner.
     * 绑定到要素或地图。这里重点是给 owner 绑鼠标移动/离开事件。
     */
    override addTo(owner: any): this {
        this._owner = owner;

        // Hand over to base class to complete map binding logic
        // 先交给基类完成 map 绑定等逻辑
        super.addTo(owner);

        if (owner && typeof owner.on === "function") {
            owner.on("mousemove", this._boundOnOwnerMove);
            owner.on("mouseout", this._boundOnOwnerOut);
            owner.on("removed", this._boundOnOwnerRemoved);
        }

        return this;
    }

    /**
     * Internal: Handle owner move event.
     * 内部：处理 owner 移动事件
     */
    private _onOwnerMove(e: any): void {
        const map = this.getMap();
        if (!map) {
            return;
        }

        if (this._timeoutId != null) {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = undefined;
        }

        const coordinate: Coordinate =
            e?.coordinate ??
            (this._owner && typeof this._owner.getCoordinate === "function"
                ? this._owner.getCoordinate()
                : (map as any).getCenter?.());

        const delay = this.options.showTimeout ?? 400;

        const doShow = () => {
            // Base class show: create DOM, record coordinate, but hide first
            // 基类 show：创建 DOM，记录坐标，但先隐藏
            super.show(coordinate);

            const anyThis = this as any;
            // Let this update position and show directly
            // 直接让这一次更新位置并显示
            anyThis._positionedOnce = true;
            anyThis._refreshDomPosition();

            if (anyThis._dom) {
                anyThis._dom.style.display = "block";
            }
        };

        if (delay <= 0) {
            doShow();
        } else {
            this._timeoutId = window.setTimeout(doShow, delay);
        }
    }

    /**
     * Internal: Handle owner out event.
     * 内部：处理 owner 离开事件
     */
    private _onOwnerOut(): void {
        if (this._timeoutId != null) {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = undefined;
        }
        this.hide();
    }

    /**
     * Internal: Handle owner removed event.
     * 内部：处理 owner 移除事件
     */
    private _onOwnerRemoved(): void {
        this.remove();
    }

    protected override onRemove(): void {
        if (this._timeoutId != null) {
            window.clearTimeout(this._timeoutId);
            this._timeoutId = undefined;
        }
        const owner = this._owner;
        if (owner && typeof owner.off === "function") {
            owner.off("mousemove", this._boundOnOwnerMove);
            owner.off("mouseout", this._boundOnOwnerOut);
            owner.off("removed", this._boundOnOwnerRemoved);
        }
        this._owner = undefined;
    }
}
