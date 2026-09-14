import { describe, it, expect, vi, beforeEach } from "vitest";
import { BufferGeometry, MeshBasicMaterial, PlaneGeometry } from "three";
import { Tile, TileState } from "../Tile";
import { TileSourceCache } from "../SourceCache";
import { TileCache } from "../../../loaders/TileCache";
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

function makeRasterLoader(payload?: () => { geometry: any; materials: any[] }) {
	return {
		load: vi.fn(async () =>
			payload
				? payload()
				: {
						geometry: new PlaneGeometry(1, 1),
						materials: [new MeshBasicMaterial()],
				  }
		),
		unload: vi.fn(),
		cache: null,
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

describe("tile holes: empty Loaded / payload cache poisoning", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.interacting = false;
	});

	it("never-loaded dispose does not write empty payload into cache", () => {
		const root = new Tile(0, 0, 0);
		const cache = new TileCache(8);
		root._payloadCache = cache;
		const child = new Tile(0, 0, 1);
		root.add(child);
		const loader = makeRasterLoader();
		(child as any)._disposeResources(true, loader);
		expect(child.loaded).toBe(false);
		expect(cache.has(1, 0, 0)).toBe(false);
		expect(child.hasRenderPayload()).toBe(false);
	});

	it("re-dispose does not wipe a cached real payload", async () => {
		const root = new Tile(0, 0, 0);
		const cache = new TileCache(8);
		root._payloadCache = cache;
		const child = new Tile(0, 0, 1);
		root.add(child);
		const loader = makeRasterLoader();
		await (child as any)._loadData(loader);
		expect(child.loaded).toBe(true);
		expect(child.hasRenderPayload()).toBe(true);

		(child as any)._disposeResources(true, loader);
		expect(cache.has(1, 0, 0)).toBe(true);
		// second dispose (already empty) must not overwrite with placeholder
		(child as any)._disposeResources(true, loader);
		const hit = cache.get(1, 0, 0);
		expect(hit).toBeTruthy();
		expect(hit!.geometry).toBeTruthy();
		expect((hit!.geometry as any).attributes?.position).toBeTruthy();
		expect(hit!.materials?.length).toBe(1);
	});

	it("empty cache hit falls through to network instead of marking Loaded", async () => {
		const root = new Tile(0, 0, 0);
		const cache = new TileCache(8);
		root._payloadCache = cache;
		// Poison: previous bug wrote placeholder + empty materials
		cache.set(1, 0, 0, {
			materials: [],
			geometry: new BufferGeometry(),
		} as any);
		const child = new Tile(0, 0, 1);
		root.add(child);
		const loader = makeRasterLoader();
		await (child as any)._loadData(loader);
		expect(loader.load).toHaveBeenCalled();
		expect(child.loaded).toBe(true);
		expect(child.hasRenderPayload()).toBe(true);
		expect(cache.has(1, 0, 0)).toBe(false);
	});

	it("cache hit with real payload restores without network", async () => {
		const root = new Tile(0, 0, 0);
		const cache = new TileCache(8);
		root._payloadCache = cache;
		const a = new Tile(0, 0, 1);
		root.add(a);
		const loader = makeRasterLoader();
		await (a as any)._loadData(loader);
		(a as any)._disposeResources(true, loader);

		const b = new Tile(0, 0, 1);
		root.add(b);
		await (b as any)._loadData(loader);
		expect(loader.load).toHaveBeenCalledTimes(1);
		expect(b.loaded).toBe(true);
		expect(b.hasRenderPayload()).toBe(true);
	});

	it("empty loader payload is not marked Loaded", async () => {
		const root = new Tile(0, 0, 0);
		const child = new Tile(0, 0, 1);
		root.add(child);
		const loader = makeRasterLoader(() => ({
			geometry: new BufferGeometry(),
			materials: [],
		}));
		await (child as any)._loadData(loader);
		expect(child.loaded).toBe(false);
		expect(child.hasRenderPayload()).toBe(false);
	});
});

describe("covered hide via SourceCache.update", () => {
	function ctx(root: Tile, loader: any, maxLevel: number) {
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
			maxLevel,
			interacting: false,
		};
	}

	it("z0-only ideal is not covered and is showing", async () => {
		const root = new Tile(0, 0, 0);
		const loader = makeRasterLoader();
		const cache = new TileSourceCache();
		cache.update(ctx(root, loader, 0));
		await (root as any)._loadData(loader);
		const snap = cache.update(ctx(root, loader, 0));
		expect(snap.idealKeys.has("0/0/0")).toBe(true);
		expect(snap.coveredKeys.has("0/0/0")).toBe(false);
		expect(root.showing).toBe(true);
	});

	it("when all retained children load, covered parents do not show", async () => {
		const root = new Tile(0, 0, 0);
		const loader = makeRasterLoader();
		const cache = new TileSourceCache();
		cache.update(ctx(root, loader, 1));
		const pending: Tile[] = [];
		root.traverse((t) => {
			if ((t as any).isTile) pending.push(t as Tile);
		});
		for (const t of pending) {
			if (!t.loaded) await (t as any)._loadData(loader);
		}
		const snap = cache.update(ctx(root, loader, 1));
		// Invariant: every covered key is hidden (I1 + Mapbox _coveredTiles)
		for (const key of snap.coveredKeys) {
			const t = cache.getTile(key);
			if (t) expect(t.showing).toBe(false);
		}
		// Settle: no multi-z hard collage — showing tiles share one z
		const showingZ = new Set<number>();
		root.traverse((t) => {
			if ((t as any).isTile && (t as Tile).showing) showingZ.add((t as Tile).z);
		});
		expect(showingZ.size).toBeLessThanOrEqual(1);
	});
});

describe("load completion does not write showing (I1/I3)", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.interacting = false;
	});

	it("cache-hit and network load leave showing=false until SourceCache.update", async () => {
		const root = new Tile(0, 0, 0);
		const cache = new TileCache(8);
		root._payloadCache = cache;
		const child = new Tile(0, 0, 1);
		root.add(child);
		const loader = makeRasterLoader();
		await (child as any)._loadData(loader);
		expect(child.loaded).toBe(true);
		expect(child.showing).toBe(false);
	});

	it("only SourceCache production path assigns tile.showing in src/core/tile", async () => {
		const t = new Tile(0, 0, 1);
		expect((t as any)._revealIfIdeal).toBeUndefined();
		expect((t as any)._refreshCoverVisibility).toBeUndefined();
	});
});

describe("SourceCache emptyLoaded + settle showing", () => {
	beforeEach(() => {
		Tile.setIdealTileSet(null);
		Tile.interacting = false;
	});

	function ctxFor(root: Tile, loader: any, maxLevel = 2) {
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
			maxLevel,
			interacting: false,
		};
	}

	it("settled update keeps emptyLoaded=0 and showing only at one z", async () => {
		const root = new Tile(0, 0, 0);
		const loader = makeRasterLoader();
		const cache = new TileSourceCache();

		// First pass: create + start loads for ideals
		cache.update(ctxFor(root, loader, 1));
		// Load every registered tile with a real payload
		const tiles: Tile[] = [];
		root.traverse((t) => {
			if ((t as any).isTile) tiles.push(t as Tile);
		});
		for (const t of tiles) {
			if (!t.loaded) await (t as any)._loadData(loader);
		}

		const snap = cache.update(ctxFor(root, loader, 1));
		expect(snap.emptyLoaded).toBe(0);

		const showingZ = new Set<number>();
		root.traverse((t) => {
			if ((t as any).isTile && (t as Tile).showing) showingZ.add((t as Tile).z);
		});
		expect(showingZ.size).toBe(1);
		// After all ideals load, the sole showing z is the ideal z (not a parent collage)
		expect(showingZ.has(snap.ideal!.z)).toBe(true);
	});

	it("markDirty + setOnDirty re-runs update via live driver (deferred)", async () => {
		const root = new Tile(0, 0, 0);
		const loader = makeRasterLoader();
		const cache = new TileSourceCache();
		let driven = 0;
		cache.setOnDirty(() => {
			driven++;
			cache.update(ctxFor(root, loader, 0));
		});
		cache.update(ctxFor(root, loader, 0));
		expect(cache.dirty).toBe(false);

		root.dispatchEvent({ type: "tile-loaded", tile: root });
		expect(cache.dirty).toBe(true);
		// Driver is deferred (microtask) so cache-hit cannot nest update
		expect(driven).toBe(0);
		await Promise.resolve();
		expect(driven).toBeGreaterThan(0);
		expect(cache.dirty).toBe(false);
	});
});
