import { describe, it, expect, beforeEach } from "vitest";
import { Camera } from "three";
import { Tile, TileState } from "../Tile";
import { TileSourceCache } from "../SourceCache";
import { createChildren } from "../util";

function makeLoader() {
	return {
		load: vi.fn(async () => ({
			geometry: { userData: { vectorData: { dataFormat: "mvt-local", layers: {} } } },
			materials: [],
		})),
		unload: vi.fn(),
		cache: { get: () => undefined, set: () => undefined, clear: () => undefined },
	} as any;
}

import { vi } from "vitest";

describe("TileSourceCache.update", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.setIdealLoadedCount(0);
		Tile.setIdealCoveredCount(0);
	});

	it("computes ideal set and retain covering missing ideals via ancestors", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const z1 = createChildren(loader, 0, 0, 0);
		root.add(...z1);
		z1.forEach((t) => {
			(parentTick(t) as any)._transitionTo(TileState.Loaded);
		});

		const cache = new TileSourceCache();
		const snap = cache.update({
			root,
			camera: new Camera(),
			loader,
			mapWidth: 40075016,
			mapHeight: 40075016,
			viewportWidth: 1200,
			viewportHeight: 800,
			lookAtProjected: { x: 0, y: 0 },
			cameraDistance: 100000,
			fovDeg: 60,
			minLevel: 0,
			maxLevel: 15,
			interacting: false,
		});
		expect(snap.idealCount).toBeGreaterThan(0);
		expect(snap.idealCovered).toBe(snap.idealCount);
		expect(snap.retainCount).toBeGreaterThanOrEqual(snap.idealCount);
	});

	function parentTick(t: Tile) {
		return t;
	}
});
