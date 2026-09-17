import type { PaintConfig } from "./index";
import type { PaintRule } from "./Layerstyle";
import { evaluateFilter, type FilterExpression } from "./filterExpression";
import { resolveZoomNumber, isZoomExpression } from "./zoomExpression";

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
	return resolveZoomNumber(v, 0, fallback);
}

function numAt(v: unknown, zoom: number, fallback: number): number {
	return resolveZoomNumber(v, zoom, fallback);
}

function str(v: unknown, fallback: string): string {
	return typeof v === "string" ? v : fallback;
}

/**
 * Map one style layer's paint/layout onto MapOrbis PaintConfig.
 * P2: extra paint keys + layout.visibility.
 * P3a: numeric paint values may be zoom expressions; resolved at `zoom`.
 */
export function mapPaintToConfig(layer: StyleLayer, zoom = 0): PaintConfig {
	const paint = layer.paint ?? {};
	const layout = layer.layout ?? {};
	const type = layer.type;
	const visible = layout["visibility"] !== "none";

	if (type === "line") {
		const color = str(paint["line-color"], "#3388ff");
		const widthRaw = paint["line-width"];
		const width = numAt(widthRaw, zoom, 1);
		const opacity = numAt(paint["line-opacity"], zoom, 1) * (visible ? 1 : 0);
		const dashArray = Array.isArray(paint["line-dasharray"])
			? (paint["line-dasharray"] as number[])
			: undefined;
		return {
			type: "line",
			color,
			width,
			weight: width,
			opacity,
			dashArray,
			transparent: opacity < 1 || paint["line-opacity"] != null,
			blur: numAt(paint["line-blur"], zoom, 0),
			gapWidth: numAt(paint["line-gap-width"], zoom, 0),
			zOffset: numAt(paint["line-z-offset"] ?? (paint["line-elevation-reference"] as number), zoom, 0),
			// Keep raw zoom fn so renderer can patch linewidth without rebuild.
			widthExpr: isZoomExpression(widthRaw) ? widthRaw : undefined,
		} as unknown as PaintConfig;
	}

	if (type === "fill") {
		const fillOpacity = numAt(paint["fill-opacity"], zoom, 0.5) * (visible ? 1 : 0);
		return {
			type: "fill",
			fill: true,
			fillColor: str(paint["fill-color"], "#3388ff"),
			fillOpacity,
			opacity: fillOpacity,
			stroke: paint["fill-outline-color"] != null || paint["fill-outline-width"] != null,
			color: str(paint["fill-outline-color"], "#3388ff"),
			weight: numAt(paint["fill-outline-width"], zoom, 1),
			width: numAt(paint["fill-outline-width"], zoom, 1),
			antialias: paint["fill-antialias"] !== false,
		} as unknown as PaintConfig;
	}

	const textField = layout["text-field"];
	const size = numAt(paint["circle-radius"], zoom, 4);
	return {
		type: "icon",
		color: str(paint["circle-color"] ?? paint["text-color"], "#3388ff"),
		size,
		width: size,
		opacity: numAt(paint["circle-opacity"] ?? paint["text-opacity"], zoom, 1) * (visible ? 1 : 0),
		fontColor: str(paint["text-color"], "#ffffff"),
		textField: typeof textField === "string" ? textField.replace(/^\{|\}$/g, "") : "name",
		strokeWidth: numAt(paint["circle-stroke-width"], zoom, 0),
		strokeColor: str(paint["circle-stroke-color"], "#ffffff"),
		haloColor: str(paint["text-halo-color"], "#000000"),
		haloWidth: numAt(paint["text-halo-width"], zoom, 0),
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
/**
 * Convert StyleSpecLike → ordered PaintRules at a given zoom.
 * Drops visibility=none and layers outside [minzoom, maxzoom].
 */
export function toPaintRules(style: StyleSpecLike, zoom = 0): StylePaintRule[] {
	const layers = Array.isArray(style.layers) ? style.layers : [];
	return layers
		.filter((layer) => layer.layout?.["visibility"] !== "none")
		.filter((layer) => {
			if (typeof layer.minzoom === "number" && zoom < layer.minzoom) return false;
			if (typeof layer.maxzoom === "number" && zoom >= layer.maxzoom) return false;
			return true;
		})
		.map((layer) => {
			const rule: StylePaintRule = {
				id: layer.id,
				type: layer.type,
				sourceLayer: layer["source-layer"],
				minzoom: layer.minzoom,
				maxzoom: layer.maxzoom,
				filter: layer.filter ?? true,
				paint: mapPaintToConfig(layer, zoom),
			};
			return rule;
		});
}

/** Compatibility: accept either StyleSpecLike or legacy PaintRule[]. */
export function normalizeStyleInput(
	input: StyleSpecLike | PaintRule[],
	zoom = 0
): StylePaintRule[] {
	if (Array.isArray(input)) {
		return input.map((r, i) => ({
			...r,
			id: (r as StylePaintRule).id ?? `legacy-${i}`,
			type: ((r as StylePaintRule).type ?? "line") as StyleLayerType,
		})) as StylePaintRule[];
	}
	return toPaintRules(input, zoom);
}

export { evaluateFilter };
