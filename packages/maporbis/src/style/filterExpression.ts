/**
 * Mapbox-style filter expression evaluator (subset).
 * Supports comparison, membership, existence, boolean combinators, and ["zoom"].
 */

export type FilterExpression = unknown;

function isComparisonOp(op: string): boolean {
	return op === "==" || op === "!=" || op === "<" || op === "<=" || op === ">" || op === ">=";
}

function resolvePropertyKey(
	operand: unknown,
	properties: Record<string, unknown>,
	zoom: number
): unknown {
	if (Array.isArray(operand)) {
		if (operand[0] === "zoom") return zoom;
		if (operand[0] === "get" && typeof operand[1] === "string") {
			return properties[operand[1]];
		}
		return undefined;
	}
	// Left of a comparison is a property name (legacy Mapbox filter).
	if (typeof operand === "string") {
		return properties[operand];
	}
	return operand;
}

/** Right-hand side is a literal unless it's ["zoom"] / ["get", key]. */
function resolveLiteral(
	operand: unknown,
	properties: Record<string, unknown>,
	zoom: number
): unknown {
	if (Array.isArray(operand)) {
		if (operand[0] === "zoom") return zoom;
		if (operand[0] === "get" && typeof operand[1] === "string") {
			return properties[operand[1]];
		}
		return undefined;
	}
	return operand;
}

function compare(op: string, left: unknown, right: unknown): boolean {
	switch (op) {
		case "==":
			return left === right;
		case "!=":
			return left !== right;
		case "<":
			return Number(left) < Number(right);
		case "<=":
			return Number(left) <= Number(right);
		case ">":
			return Number(left) > Number(right);
		case ">=":
			return Number(left) >= Number(right);
		default:
			return false;
	}
}

/**
 * Evaluate a Mapbox filter expression against feature properties and zoom.
 * Legacy form: ["==", "class", "primary"] → properties.class === "primary".
 */
export function evaluateFilter(
	expr: FilterExpression,
	properties: Record<string, unknown> = {},
	zoom = 0
): boolean {
	if (expr === true) return true;
	if (expr === false || expr == null) return false;
	if (!Array.isArray(expr) || expr.length === 0) return false;

	const op = expr[0];
	if (typeof op !== "string") return false;

	if (isComparisonOp(op)) {
		if (expr.length < 3) return false;
		const left = resolvePropertyKey(expr[1], properties, zoom);
		const right = resolveLiteral(expr[2], properties, zoom);
		return compare(op, left, right);
	}

	if (op === "in" || op === "!in") {
		if (expr.length < 2) return false;
		const v = resolvePropertyKey(expr[1], properties, zoom);
		const values = expr.slice(2).map((x) => resolveLiteral(x, properties, zoom));
		const has = values.some((x) => x === v);
		return op === "in" ? has : !has;
	}

	if (op === "has" || op === "!has") {
		if (expr.length < 2) return false;
		const key = expr[1];
		const exists = Object.prototype.hasOwnProperty.call(properties, key);
		return op === "has" ? exists : !exists;
	}

	if (op === "all") {
		for (let i = 1; i < expr.length; i++) {
			if (!evaluateFilter(expr[i], properties, zoom)) return false;
		}
		return true;
	}

	if (op === "any") {
		for (let i = 1; i < expr.length; i++) {
			if (evaluateFilter(expr[i], properties, zoom)) return true;
		}
		return false;
	}

	if (op === "!") {
		if (expr.length < 2) return false;
		return !evaluateFilter(expr[1], properties, zoom);
	}

	return false;
}
