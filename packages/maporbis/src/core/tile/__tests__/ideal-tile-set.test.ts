import { describe, it, expect, beforeEach } from "vitest";
import { Tile } from "../Tile";
import {
	IdealTileSet,
	computeIdealTileSet,
	hasLoadedCover,
	countIdealCovered,
} from "../util";

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

describe("ideal cover (self or ancestor)", () => {
	it("counts self-loaded ideal tiles", () => {
		const loaded = new Set(["13/1/1", "13/1/2"]);
		expect(hasLoadedCover(loaded, 13, 1, 1)).toBe(true);
		expect(hasLoadedCover(loaded, 13, 9, 9)).toBe(false);
	});

	it("uses loaded ancestor when ideal tile missing", () => {
		// ideal 13/5/5 → ancestors 12/2/2, 11/1/1
		const loaded = new Set(["12/2/2"]);
		expect(hasLoadedCover(loaded, 13, 5, 5)).toBe(true);
		expect(countIdealCovered(["13/5/5", "13/9/9"], loaded)).toBe(1);
	});

	it("counts all covered ideal keys", () => {
		const loaded = new Set(["12/0/0", "13/1/1"]);
		const n = countIdealCovered(["13/0/0", "13/0/1", "13/1/1"], loaded);
		// 13/0/0 and 13/0/1 covered by 12/0/0; 13/1/1 self
		expect(n).toBe(3);
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
