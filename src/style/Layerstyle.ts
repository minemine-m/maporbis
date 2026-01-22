import { StyleConfig } from './index'; 

/**
 * 样式规则接口 (简化版)
 * Style Rule Interface (Simplified)
 * @description 定义一个样式规则，它将通过外部的 Feature Filter 机制来应用。
 * Defines a style rule that will be applied via an external Feature Filter mechanism.
  * @category Style
 */
export interface StyleRule {
    /** * 过滤条件表达式（Placeholder）
     * Filter condition expression (Placeholder)
     * 这是一个占位符，用于表示您将来要引入的 feature-filter 表达式或规则ID。
     * This is a placeholder to represent a future feature-filter expression or rule ID.
     * 例如: ['==', 'class', 'highway'] 或 'highway-z10-14'
     * e.g., ['==', 'class', 'highway'] or 'highway-z10-14'
     */
    filter: any; 

    /** 样式配置 Style Configuration */
    style: StyleConfig;
}

/**
 * 瓦片样式输入类型 (现在是一个规则数组)
 * Tile style input type (currently an array of rules)
 * @category Style
 */
export type TileStyleInput = StyleRule[];

/**
 * 样式层级类：处理规则匹配逻辑
 * Layer Style Class: Handles rule matching logic
 * @category Style
 */
export class LayerStyle {
    private rules: StyleRule[];

    /**
     * @param rules 样式规则数组或单个 StyleConfig。 Style rule array or single StyleConfig.
     * @param filterEngine 外部的 Feature Filter 引擎实例 External Feature Filter engine instance
     */
    constructor(rules: StyleRule[] | StyleConfig, private filterEngine?: any) {
        // 如果只传入单个 StyleConfig，自动创建一个默认规则
        // If only a single StyleConfig is passed, automatically create a default rule
        if (!Array.isArray(rules)) {
            // 默认规则的 filter 设为 true 或其他能匹配所有要素的表达式
            // Default rule filter is set to true or other expression that matches all features
            this.rules = [{ style: rules, filter: true }]; 
        } else {
            this.rules = rules;
        }
    }

    /**
     * 根据要素属性和缩放级别获取匹配的样式配置
     * Get matching style configuration based on feature properties and zoom level
     * **注意：此方法现在需要依赖外部的 `filterEngine` 或您自定义的逻辑来解析 `rule.filter`。**
     * **Note: This method now relies on an external `filterEngine` or your custom logic to parse `rule.filter`.**
     * @param rawFeature 原始要素数据 (包含 properties) Raw feature data (includes properties)
     * @param zoom 缩放级别 Zoom level
     * @returns 匹配的 StyleConfig 或 null (未匹配到) Matching StyleConfig or null (no match)
     */
    public getStyle(rawFeature: any, zoom: number): StyleConfig | null {
        // 遍历规则 Iterate through rules
        for (const rule of this.rules) {
            
            // 核心逻辑：使用外部的 filterEngine 来判断是否匹配
            // Core logic: Use external filterEngine to determine match
            // 以下是使用占位符 filterEngine 的伪代码：
            // The following is pseudo-code using a placeholder filterEngine:
            
            // 如果没有 filterEngine，且 filter 为 true，则匹配 (作为默认样式)
            // If no filterEngine and filter is true, match (as default style)
            if (!this.filterEngine && rule.filter === true) {
                 return rule.style;
            }
            
            // 如果有 filterEngine，则使用它来评估表达式
            // If filterEngine exists, use it to evaluate expression
            if (this.filterEngine && this.filterEngine.evaluate(rule.filter, rawFeature.properties, zoom)) {
                return rule.style;
            }

            //  如果 rule.filter 是一个简单的字符串/值，可以直接做属性匹配
            //  If rule.filter is a simple string/value, direct property matching can be done
            // if (rawFeature.properties.id === rule.filter) return rule.style; 
        }
        return null; // 没有规则匹配 No rule matched
    }
}