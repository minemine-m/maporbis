import { describe, it, expect } from "vitest";
import { resolveZoomNumber, isZoomExpression } from "../zoomExpression";
import { toPaintRules, mapPaintToConfig } from "../styleSpec";

describe("resolveZoomNumber", () => {
	it("literal number", () => {
		expect(resolveZoomNumber(2, 10, 1)).toBe(2);
	});

	it("step", () => {
		const expr = ["step", ["zoom"], 1, 10, 2, 14, 4];
		expect(resolveZoomNumber(expr, 8, 0)).toBe(1);
		expect(resolveZoomNumber(expr, 10, 0)).toBe(2);
		expect(resolveZoomNumber(expr, 15, 0)).toBe(4);
	});

	it("interpolate linear", () => {
		const expr = ["interpolate", ["linear"], ["zoom"], 10, 1, 20, 3];
		expect(resolveZoomNumber(expr, 10, 0)).toBe(1);
		expect(resolveZoomNumber(expr, 15, 0)).toBe(2);
		expect(resolveZoomNumber(expr, 20, 0)).toBe(3);
	});

	it("interpolate exponential", () => {
		const expr = ["interpolate", ["exponential", 1.5], ["zoom"], 10, 1, 12, 2];
		const mid = resolveZoomNumber(expr, 11, 0);
		expect(mid).toBeGreaterThan(1);
		expect(mid).toBeLessThan(2);
	});

	it("isZoomExpression", () => {
		expect(isZoomExpression(["zoom"])).toBe(true);
		expect(isZoomExpression(2)).toBe(false);
	});
});

describe("styleSpec zoom + range", () => {
	const style = {
		sources: {},
		layers: [
			{
				id: "roads",
				type: "line" as const,
				minzoom: 10,
				maxzoom: 16,
				paint: {
					"line-color": "#f00",
					"line-width": ["interpolate", ["linear"], ["zoom"], 10, 1, 15, 4],
				},
			},
			{
				id: "far",
				type: "line" as const,
				minzoom: 16,
				paint: { "line-color": "#00f", "line-width": 5 },
			},
		],
	};

	it("resolves width by zoom", () => {
		const z12 = toPaintRules(style, 12);
		expect(z12).toHaveLength(1);
		// linear: z10=1 → z15=4 ⇒ z12 = 1 + 0.4*3 = 2.2
		expect((z12[0].paint as any).width).toBeCloseTo(2.2);

		const z18 = toPaintRules(style, 18);
		expect(z18).toHaveLength(1);
		expect(z18[0].id).toBe("far");
	});

	it("drops layer outside zoom range", () => {
		expect(toPaintRules(style, 5)).toHaveLength(0);
		expect((mapPaintToConfig(style.layers[0], 15) as any).width).toBeCloseTo(4);
	});
});
