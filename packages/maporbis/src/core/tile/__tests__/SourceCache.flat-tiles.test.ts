import { describe, it, expect, vi, beforeEach } from "vitest";
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

/** maxLevel=0 so update does not ensureTilePath a deep tree. */
function ctx(root: Tile, loader: any) {
	return {
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
	};
}

describe("TileSourceCache flat _tiles", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.setIdealLoadedCount(0);
		Tile.setIdealCoveredCount(0);
	});

	it("seeds from existing tree and keeps registry after update", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const z1 = createChildren(loader, 0, 0, 0);
		root.add(...z1);
		z1.forEach((t) => (t as any)._transitionTo(TileState.Loaded));

		const cache = new TileSourceCache();
		cache.update(ctx(root, loader));
		// root + 4 children (maxLevel=0 does not build deeper)
		expect(cache.tileCount).toBe(5);
		expect(cache.getTile("1/0/0")).toBeDefined();
		expect(cache.getTile("0/0/0")).toBe(root);
	});

	it("registers tiles created later via tile-created", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const cache = new TileSourceCache();
		cache.update(ctx(root, loader));
		expect(cache.tileCount).toBe(1);

		const kids = createChildren(loader, 0, 0, 0);
		root.add(...kids);
		kids.forEach((k) => root.dispatchEvent({ type: "tile-created", tile: k }));
		expect(cache.tileCount).toBe(5);
		expect(cache.getTile("1/0/0")).toBeDefined();
	});

	it("unregisters on tile-unload and prunes detached children", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const z1 = createChildren(loader, 0, 0, 0);
		root.add(...z1);
		const cache = new TileSourceCache();
		cache.update(ctx(root, loader));
		expect(cache.tileCount).toBe(5);

		root.dispatchEvent({ type: "tile-unload", tile: z1[0] });
		expect(cache.getTile(`1/${z1[0].x}/${z1[0].y}`)).toBeUndefined();
		expect(cache.tileCount).toBe(4);

		// LOD-style dispose: clear remaining children from the scene graph
		z1.slice(1).forEach((c) => root.remove(c));
		cache.update(ctx(root, loader));
		expect(cache.tileCount).toBe(1);
		expect(cache.getTile("0/0/0")).toBe(root);
	});
});
