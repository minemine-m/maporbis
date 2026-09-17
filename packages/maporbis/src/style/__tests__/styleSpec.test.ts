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
		expect((rules[1].paint as any).weight).toBe(2);
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
			paint: { "circle-color": "#0f0", "circle-radius": 6, "text-color": "#fff" },
			layout: { "text-field": "{name}" },
		});
		expect((cfg as any).color).toBe("#0f0");
		expect((cfg as any).textField).toBe("name");
	});
});
