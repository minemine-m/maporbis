import { describe, it, expect, beforeEach } from "vitest";
import { Tile } from "../Tile";
import { IdealTileSet, computeIdealTileSet } from "../util";

describe("computeIdealTileSet", () => {
	const mapW = 40075016;
	const mapH = 40075016;

	it("returns a non-empty set at center of world", () => {
		const set = computeIdealTileSet(13.5, { x: 0, y: 0 }, mapW, mapH, 1200, 800, 100000, 60, 0, 15);
		expect(set).not.toBeNull();
		expect(set!.z).toBe(13);
		expect(set!.keys.length).toBeGreaterThan(0);
		expect(set!.keys[0]).toMatch(/^13\//);
	});

	it("clamps z to maxLevel", () => {
		const set = computeIdealTileSet(18.2, { x: 0, y: 0 }, mapW, mapH, 1200, 800, 100000, 60, 0, 15);
		expect(set!.z).toBe(15);
	});

	it("clamps z to minLevel", () => {
		const set = computeIdealTileSet(1.2, { x: 0, y: 0 }, mapW, mapH, 1200, 800, 1e7, 60, 3, 15);
		expect(set!.z).toBe(3);
	});
});

describe("Tile ideal tile set", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.setIdealLoadedCount(0);
	});

	it("tracks ideal keys and loaded count", () => {
		const set: IdealTileSet = {
			z: 13,
			keys: ["13/1/1", "13/1/2", "13/2/1"],
			minX: 1,
			maxX: 2,
			minY: 1,
			maxY: 2,
		};
		Tile.setIdealTileSet(set);
		expect(Tile.idealTileCount).toBe(3);
		expect(Tile.isIdealTile(new Tile(1, 1, 13))).toBe(true);
		expect(Tile.isIdealTile(new Tile(9, 9, 13))).toBe(false);
		Tile.setIdealLoadedCount(2);
		expect(Tile.idealLoadedCount).toBe(2);
		expect(Tile.getScheduleStats().idealLoadedCount).toBe(2);
	});

	it("clears ideal set on null", () => {
		Tile.setIdealTileSet({ z: 5, keys: ["5/0/0"], minX: 0, maxX: 0, minY: 0, maxY: 0 });
		Tile.setIdealTileSet(null);
		expect(Tile.idealTileCount).toBe(0);
	});
});
