/**
 * 评估一个 Mapbox 风格的 filter 对某个要素是否成立
 * Evaluate if a Mapbox style filter matches a feature
 * @param filter 过滤条件 Filter condition
 * @param properties 要素属性 Feature properties
 * @returns 是否匹配 True if matched, false otherwise
  * @category Style
 */
export function matchFilter(
    filter: any,
    properties: any
): boolean {
    if (!filter || filter === true) return true;

    if (!Array.isArray(filter)) {
        // 简单值，直接转布尔 Simple value, convert to boolean directly
        return !!filter;
    }

    const op = filter[0];

    switch (op) {
        case 'all':
            return filter.slice(1).every((sub: any) => matchFilter(sub, properties));

        case 'any':
            return filter.slice(1).some((sub: any) => matchFilter(sub, properties));

        case '!':
            return !matchFilter(filter[1], properties);

        case '==': {
            const left = evalExpr(filter[1], properties, true);
            const right = evalExpr(filter[2], properties, false);
            // Mapbox 的 == 会进行类型转换 Mapbox '==' performs type coercion
            return coerceType(left) == coerceType(right);
        }

        case '!=': {
            const left = evalExpr(filter[1], properties, true);
            const right = evalExpr(filter[2], properties, false);
            // Mapbox 的 != 会进行类型转换 Mapbox '!=' performs type coercion
            return coerceType(left) != coerceType(right);
        }

        case '>': {
            const left = evalExpr(filter[1], properties, true);
            const right = evalExpr(filter[2], properties, false);
            // 数值比较 Numerical comparison
            return toNumber(left) > toNumber(right);
        }

        case '<': {
            const left = evalExpr(filter[1], properties, true);
            const right = evalExpr(filter[2], properties, false);
            return toNumber(left) < toNumber(right);
        }

        case '>=': {
            const left = evalExpr(filter[1], properties, true);
            const right = evalExpr(filter[2], properties, false);
            return toNumber(left) >= toNumber(right);
        }

        case '<=': {
            const left = evalExpr(filter[1], properties, true);
            const right = evalExpr(filter[2], properties, false);
            return toNumber(left) <= toNumber(right);
        }

        case 'in': {
            const value = evalExpr(filter[1], properties, true);
            const rest = filter.slice(2).map((x: any) => evalExpr(x, properties, false));
            return rest.includes(value);
        }

        case '!in': {
            const value = evalExpr(filter[1], properties, true);
            const rest = filter.slice(2).map((x: any) => evalExpr(x, properties, false));
            return !rest.includes(value);
        }

        case 'has': {
            const key = filter[1];
            return properties != null && Object.prototype.hasOwnProperty.call(properties, key);
        }

        case '!has': {
            const key = filter[1];
            return !(properties != null && Object.prototype.hasOwnProperty.call(properties, key));
        }

        default:
            // 其他高阶表达式暂时不支持，先当全匹配
            // Other high-order expressions are not supported yet, treat as full match
            return true;
    }
}

/**
 * 解析表达式节点
 * asPropertyKey=true：字符串视为属性名（legacy Mapbox 左操作数）
 * Parse expression; bare strings are property keys when asPropertyKey.
 */
function evalExpr(expr: any, properties: any, asPropertyKey = false): any {
    if (Array.isArray(expr)) {
        const op = expr[0];
        switch (op) {
            case 'get':
                return properties ? properties[expr[1]] : undefined;
            case 'zoom':
                // zoom injected into properties by caller if needed
                return properties && properties.$zoom != null ? properties.$zoom : undefined;
            default:
                return expr;
        }
    }
    if (asPropertyKey && typeof expr === 'string' && properties) {
        return properties[expr];
    }
    return expr;
}

// 类型转换函数（模拟 Mapbox 的类型转换）
function coerceType(value: any): any {
    if (value === null || value === undefined) {
        return null;
    }
    
    // 如果是数字字符串，转换为数字
    if (typeof value === 'string') {
        const num = Number(value);
        if (!isNaN(num) && value.trim() !== '') {
            return num;
        }
    }
    
    // 布尔值转换为数字
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    
    return value;
}

// 转换为数字（用于比较运算）
function toNumber(value: any): number {
    if (value === null || value === undefined) {
        return 0;
    }
    
    if (typeof value === 'number') {
        return value;
    }
    
    if (typeof value === 'boolean') {
        return value ? 1 : 0;
    }
    
    if (typeof value === 'string') {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    }
    
    return Number(value);
}