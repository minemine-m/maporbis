import { describe, it, expect } from "vitest";
import { evaluateFilter } from "../filterExpression";
import { toPaintRules, mapPaintToConfig, normalizeStyleInput } from "../styleSpec";

describe("evaluateFilter", () => {
	const props = { class: "primary", level: 3, name: "Main" };

	it("true/false/null", () => {
		expect(evaluateFilter(true, props, 12)).toBe(true);
		expect(evaluateFilter(false, props, 12)).toBe(false);
		expect(evaluateFilter(null, props, 12)).toBe(false);
	});

	it("== !=", () => {
		expect(evaluateFilter(["==", "class", "primary"], props, 12)).toBe(true);
		expect(evaluateFilter(["==", "class", "secondary"], props, 12)).toBe(false);
		expect(evaluateFilter(["!=", "class", "secondary"], props, 12)).toBe(true);
	});

	it("range", () => {
		expect(evaluateFilter([">=", "level", 2], props, 12)).toBe(true);
		expect(evaluateFilter(["<", "level", 3], props, 12)).toBe(false);
	});

	it("in / !in / has", () => {
		expect(evaluateFilter(["in", "class", "primary", "secondary"], props, 12)).toBe(true);
		expect(evaluateFilter(["!in", "class", "motorway"], props, 12)).toBe(true);
		expect(evaluateFilter(["has", "name"], props, 12)).toBe(true);
		expect(evaluateFilter(["!has", "missing"], props, 12)).toBe(true);
	});

	it("all any !", () => {
		expect(
			evaluateFilter(["all", ["==", "class", "primary"], [">=", "level", 1]], props, 12)
		).toBe(true);
		expect(
			evaluateFilter(["any", ["==", "class", "x"], ["==", "level", 3]], props, 12)
		).toBe(true);
		expect(evaluateFilter(["!", ["==", "class", "x"]], props, 12)).toBe(true);
	});

	it("zoom comparison", () => {
		expect(evaluateFilter([">=", ["zoom"], 10], props, 12)).toBe(true);
		expect(evaluateFilter([">=", ["zoom"], 14], props, 12)).toBe(false);
	});
});

describe("styleSpec convert", () => {
	const style = {
		version: 8 as const,
		sources: { v: { type: "vector" as const, tiles: ["https://x/{z}/{x}/{y}.pbf"] } },
		layers: [
			{
				id: "water",
				type: "fill" as const,
				"source-layer": "water",
				filter: ["==", "class", "water"],
				paint: { "fill-color": "#00f", "fill-opacity": 0.4 },
			},
			{
				id: "road",
				type: "line" as const,
				"source-layer": "transportation",
				filter: ["in", "class", "primary", "secondary"],
				paint: { "line-color": "#f00", "line-width": 2 },
			},
		],
	};

	it("toPaintRules maps paint and keeps filter", () => {
		const rules = toPaintRules(style);
		expect(rules).toHaveLength(2);
		expect(rules[0].type).toBe("fill");
		expect((rules[0].paint as any).fillColor).toBe("#00f");
		expect(rules[1].type).toBe("line");
		expect((rules[1].paint as any).width).toBe(2);
		expect((rules[1].paint as any).weight).toBe(2);
		expect((rules[1].paint as any).type).toBe("line");
		expect(rules[1].sourceLayer).toBe("transportation");
	});

	it("legacy PaintRule[] still works", () => {
		const rules = normalizeStyleInput([
			{ filter: true, paint: { color: "#123456", weight: 3 } as any },
		]);
		expect(rules[0].type).toBe("line");
		expect((rules[0].paint as any).color).toBe("#123456");
	});

	it("mapPaintToConfig circle/symbol", () => {
		const cfg = mapPaintToConfig({
			id: "poi",
			type: "circle",
			paint: {
				"circle-color": "#0f0",
				"circle-radius": 6,
				"text-color": "#fff",
				"circle-stroke-width": 2,
				"circle-stroke-color": "#111",
			},
			layout: { "text-field": "{name}" },
		});
		expect((cfg as any).color).toBe("#0f0");
		expect((cfg as any).textField).toBe("name");
		expect((cfg as any).strokeWidth).toBe(2);
		expect((cfg as any).strokeColor).toBe("#111");
	});

	it("layout.visibility none drops layer and zero-opacity mapping", () => {
		const rules = toPaintRules({
			sources: {},
			layers: [
				{ id: "off", type: "line", layout: { visibility: "none" }, paint: { "line-color": "#f00" } },
				{ id: "on", type: "line", paint: { "line-color": "#0f0", "line-opacity": 0.5 } },
			],
		});
		expect(rules).toHaveLength(1);
		expect(rules[0].id).toBe("on");

		const hidden = mapPaintToConfig({
			id: "h",
			type: "line",
			layout: { visibility: "none" },
			paint: { "line-color": "#f00" },
		});
		expect((hidden as any).opacity).toBe(0);
	});

	it("line dash + fill outline extras", () => {
		const line = mapPaintToConfig({
			id: "d",
			type: "line",
			paint: { "line-color": "#00f", "line-width": 2, "line-dasharray": [2, 2], "line-blur": 1 },
		});
		expect((line as any).dashArray).toEqual([2, 2]);
		expect((line as any).blur).toBe(1);

		const fill = mapPaintToConfig({
			id: "f",
			type: "fill",
			paint: {
				"fill-color": "#abc",
				"fill-opacity": 0.3,
				"fill-outline-color": "#def",
				"fill-outline-width": 2,
			},
		});
		expect((fill as any).fillOpacity).toBeCloseTo(0.3);
		expect((fill as any).width).toBe(2);
		expect((fill as any).stroke).toBe(true);
	});
});
