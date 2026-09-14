import { describe, it, expect, vi, beforeEach } from "vitest";
import { Tile, TileState } from "../Tile";
import { TileSourceCache } from "../SourceCache";
import { createChildren } from "../util";
import { Camera } from "three";

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

describe("tile holes: Unloaded reload + SourceCache registry", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.interacting = false;
	});

	it("Unloaded tiles can start loading again", () => {
		const t = new Tile(1, 2, 5);
		(t as any)._transitionTo(TileState.Unloaded);
		expect(t.loaded).toBe(false);
		expect((t as any)._canStartLoading()).toBe(true);
	});

	it("resync registers scene tiles missing from _tiles", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const cache = new TileSourceCache();
		// update with maxLevel 0 so no deep ensureTilePath
		cache.update({
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
			maxLevel: 0,
			interacting: false,
		});
		expect(cache.tileCount).toBe(1);

		// LOD-style create without going through ensureTilePath events
		const kids = createChildren(loader, 0, 0, 0);
		root.add(...kids);
		// do NOT dispatch tile-created — simulates missed callback
		cache.update({
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
			maxLevel: 0,
			interacting: false,
		});
		expect(cache.tileCount).toBe(5);
		expect(cache.getTile("1/0/0")).toBeDefined();
	});
});
