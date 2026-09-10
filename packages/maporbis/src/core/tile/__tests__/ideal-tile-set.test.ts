import { describe, it, expect } from "vitest";
import { computeIdealTileSet } from "../util";

describe("computeIdealTileSet", () => {
	const mapW = 40075016;
	const mapH = 40075016;

	it("returns a non-empty set at center of world", () => {
		const set = computeIdealTileSet(
			13.5,
			{ x: 0, y: 0 },
			mapW,
			mapH,
			1200,
			800,
			100000,
			60,
			0,
			15
		);
		expect(set).not.toBeNull();
		expect(set!.z).toBe(13);
		expect(set!.keys.length).toBeGreaterThan(0);
		expect(set!.keys[0]).toMatch(/^13\//);
	});

	it("clamps z to maxLevel", () => {
		const set = computeIdealTileSet(
			18.2,
			{ x: 0, y: 0 },
			mapW,
			mapH,
			1200,
			800,
			100000,
			60,
			0,
			15
		);
		expect(set!.z).toBe(15);
	});

	it("clamps z to minLevel", () => {
		const set = computeIdealTileSet(
			1.2,
			{ x: 0, y: 0 },
			mapW,
			mapH,
			1200,
			800,
			1e7,
			60,
			3,
			15
		);
		expect(set!.z).toBe(3);
	});
});
