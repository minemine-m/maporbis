/**
 * Resolve Mapbox zoom expressions to a number at a given zoom.
 * Supports: literal number, ["zoom"], ["step", ...], ["interpolate", linear|exponential, ...].
 */

function isStopArray(v: unknown): v is unknown[] {
	return Array.isArray(v);
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

/**
 * Evaluate a numeric paint value that may be a zoom function.
 * Non-expression values are coerced with Number(); invalid → fallback.
 */
export function resolveZoomNumber(value: unknown, zoom: number, fallback: number): number {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (value == null) return fallback;
	if (!Array.isArray(value) || value.length === 0) {
		const n = Number(value);
		return Number.isFinite(n) ? n : fallback;
	}

	const head = value[0];

	// ["zoom"] alone is not a paint value
	if (head === "step") {
		// ["step", input, default, stop1, out1, ...]
		const input = resolveInput(value[1], zoom);
		let result = toNum(value[2], fallback);
		for (let i = 3; i + 1 < value.length; i += 2) {
			const stop = toNum(value[i], Number.POSITIVE_INFINITY);
			if (input >= stop) result = toNum(value[i + 1], result);
			else break;
		}
		return result;
	}

	if (head === "interpolate") {
		// ["interpolate", ["exponential", base]|["linear"], ["zoom"], z0, v0, z1, v1, ...]
		const method = value[1];
		const input = resolveInput(value[2], zoom);
		const stops: { z: number; v: number }[] = [];
		for (let i = 3; i + 1 < value.length; i += 2) {
			stops.push({ z: toNum(value[i], 0), v: toNum(value[i + 1], 0) });
		}
		if (stops.length === 0) return fallback;
		if (input <= stops[0].z) return stops[0].v;
		if (input >= stops[stops.length - 1].z) return stops[stops.length - 1].v;

		for (let i = 0; i < stops.length - 1; i++) {
			const a = stops[i];
			const b = stops[i + 1];
			if (input >= a.z && input <= b.z) {
				const t = b.z === a.z ? 0 : (input - a.z) / (b.z - a.z);
				if (isStopArray(method) && method[0] === "exponential") {
					const base = toNum(method[1], 1);
					if (base > 0 && base !== 1 && a.v > 0 && b.v > 0) {
						// Mapbox exponential: v = a.v * (b.v/a.v)^t
						return a.v * Math.pow(b.v / a.v, t);
					}
				}
				return lerp(a.v, b.v, t);
			}
		}
		return fallback;
	}

	const n = Number(value);
	return Number.isFinite(n) ? n : fallback;
}

function resolveInput(expr: unknown, zoom: number): number {
	if (Array.isArray(expr) && expr[0] === "zoom") return zoom;
	const n = Number(expr);
	return Number.isFinite(n) ? n : zoom;
}

function toNum(v: unknown, fallback: number): number {
	const n = Number(v);
	return Number.isFinite(n) ? n : fallback;
}

/** True if value looks like a zoom expression array. */
export function isZoomExpression(v: unknown): boolean {
	return (
		Array.isArray(v) &&
		typeof v[0] === "string" &&
		(v[0] === "interpolate" || v[0] === "step" || v[0] === "zoom")
	);
}
