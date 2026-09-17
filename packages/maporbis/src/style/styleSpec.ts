import type { PaintConfig } from "./index";
import type { PaintRule } from "./Layerstyle";
import { evaluateFilter, type FilterExpression } from "./filterExpression";

export type StyleLayerType = "fill" | "line" | "symbol" | "circle";

export type StyleLayer = {
	id: string;
	type: StyleLayerType;
	"source-layer"?: string;
	source?: string;
	filter?: FilterExpression;
	minzoom?: number;
	maxzoom?: number;
	paint?: Record<string, unknown>;
	layout?: Record<string, unknown>;
};

export type StyleSource = {
	type: "vector" | "raster" | string;
	url?: string;
	tiles?: string[];
	[key: string]: unknown;
};

/** Mapbox Style Spec–like document (subset used by MapOrbis P1). */
export type StyleSpecLike = {
	version?: 8;
	name?: string;
	sources: Record<string, StyleSource>;
	layers: StyleLayer[];
};

function num(v: unknown, fallback: number): number {
	const n = typeof v === "number" ? v : Number(v);
	return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown, fallback: string): string {
	return typeof v === "string" ? v : fallback;
}

/**
 * Map one style layer's paint/layout (subset) onto MapOrbis PaintConfig.
 * Returns a loosely-typed config consumed by VectorTileRenderLayer buckets.
 */
export function mapPaintToConfig(layer: StyleLayer): PaintConfig {
	const paint = layer.paint ?? {};
	const layout = layer.layout ?? {};
	const type = layer.type;

	if (type === "line") {
		const color = str(paint["line-color"], "#3388ff");
		const width = num(paint["line-width"], 1);
		const opacity = num(paint["line-opacity"], 1);
		const dashArray = Array.isArray(paint["line-dasharray"])
			? (paint["line-dasharray"] as number[])
			: undefined;
		// Renderer reads `width`/`color`; keep `weight` for legacy PaintConfig consumers.
		return {
			type: "line",
			color,
			width,
			weight: width,
			opacity,
			dashArray,
			transparent: true,
		} as unknown as PaintConfig;
	}

	if (type === "fill") {
		return {
			type: "fill",
			fill: true,
			fillColor: str(paint["fill-color"], "#3388ff"),
			fillOpacity: num(paint["fill-opacity"], 0.5),
			stroke: paint["fill-outline-color"] != null,
			color: str(paint["fill-outline-color"], "#3388ff"),
			weight: 1,
			width: 1,
		} as unknown as PaintConfig;
	}

	// symbol / circle → existing point path
	const textField = layout["text-field"];
	return {
		type: "icon",
		color: str(paint["circle-color"] ?? paint["text-color"], "#3388ff"),
		size: num(paint["circle-radius"], 4),
		fontColor: str(paint["text-color"], "#ffffff"),
		textField: typeof textField === "string" ? textField.replace(/^\{|\}$/g, "") : "name",
	} as unknown as PaintConfig;
}

/** Attach source-layer into a serializable filter-friendly rule meta via paint key later. */
export type StylePaintRule = PaintRule & {
	id: string;
	type: StyleLayerType;
	sourceLayer?: string;
	minzoom?: number;
	maxzoom?: number;
};

/**
 * Convert a StyleSpecLike into ordered PaintRules (first match wins, like Mapbox paint order inverted:
 * Mapbox draws first layer under later ones; matching here follows array order like existing getPaint).
 */
export function toPaintRules(style: StyleSpecLike): StylePaintRule[] {
	const layers = Array.isArray(style.layers) ? style.layers : [];
	return layers.map((layer) => {
		const rule: StylePaintRule = {
			id: layer.id,
			type: layer.type,
			sourceLayer: layer["source-layer"],
			minzoom: layer.minzoom,
			maxzoom: layer.maxzoom,
			filter: layer.filter ?? true,
			paint: mapPaintToConfig(layer),
		};
		return rule;
	});
}

/** Compatibility: accept either StyleSpecLike or legacy PaintRule[]. */
export function normalizeStyleInput(
	input: StyleSpecLike | PaintRule[]
): StylePaintRule[] {
	if (Array.isArray(input)) {
		return input.map((r, i) => ({
			...r,
			id: (r as StylePaintRule).id ?? `legacy-${i}`,
			type: ((r as StylePaintRule).type ?? "line") as StyleLayerType,
		})) as StylePaintRule[];
	}
	return toPaintRules(input);
}

export { evaluateFilter };
