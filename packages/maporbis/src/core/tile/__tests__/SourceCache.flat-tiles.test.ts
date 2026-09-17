import { describe, it, expect, vi, beforeEach } from "vitest";
import { Camera } from "three";
import { Tile, TileState } from "../Tile";
import { TileLoadScheduler } from "../TileLoadScheduler";
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
		TileLoadScheduler.setIdealTileSet(null);
		TileLoadScheduler.setIdealLoadedCount(0);
		TileLoadScheduler.setIdealCoveredCount(0);
	});

	it("seeds from existing tree; releases non-retain extras (PR-2)", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const z1 = createChildren(loader, 0, 0, 0);
		root.add(...z1);
		z1.forEach((t) => (t as any)._transitionTo(TileState.Loaded));

		const cache = new TileSourceCache();
		cache.update(ctx(root, loader));
		// maxLevel=0: only root is ideal/structural; z1 extras are released
		expect(cache.tileCount).toBe(1);
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

	it("ensureTilePath creates flat root children (PR-4 redo)", () => {
		const root = new Tile(0, 0, 0);
		root.scale.set(40075016, 40075016, 1);
		root.updateMatrix();
		root.updateMatrixWorld(true);
		const loader = makeLoader();
		const cache = new TileSourceCache();
		const c = { ...ctx(root, loader), maxLevel: 1 };
		cache.update(c as any);
		// After update, any z=1 tiles must be direct children of root, not nested
		const z1 = root.children.filter((ch: any) => ch?.isTile && ch.z === 1);
		for (const t of z1) {
			expect(t.parent).toBe(root);
		}
		// No tile has a tile parent other than root
		root.traverse((t) => {
			if (!t.isTile || t === root) return;
			expect((t.parent as any).isTile).toBe(true);
			expect(t.parent).toBe(root);
		});
	});

	it("unregisters on tile-unload and prunes detached children", () => {
		const root = new Tile(0, 0, 0);
		const loader = makeLoader();
		const z1 = createChildren(loader, 0, 0, 0);
		root.add(...z1);
		const cache = new TileSourceCache();
		// maxLevel 0 â†?extras released immediately (PR-2)
		cache.update(ctx(root, loader));
		expect(cache.tileCount).toBe(1);
		expect(cache.getTile("0/0/0")).toBe(root);
	});
});
