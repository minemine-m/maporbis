import { describe, it, expect, beforeEach, vi } from "vitest";
import { Camera, MeshBasicMaterial, PlaneGeometry } from "three";
import { Tile, TileState } from "../Tile";
import { TileLoadScheduler } from "../TileLoadScheduler";
import { TileSourceCache } from "../SourceCache";
import { TileCache } from "../../../loaders/TileCache";

function makeRasterLoader() {
	return {
		load: vi.fn(async () => ({
			geometry: new PlaneGeometry(1, 1),
			materials: [new MeshBasicMaterial()],
		})),
		unload: vi.fn(),
	} as any;
}

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

describe("feel: center-first priority", () => {
	beforeEach(() => {
		TileLoadScheduler.setIdealTileSet(null);
		TileLoadScheduler.interacting = false;
	});

	it("ideal tiles get distance-based priority (near < far)", () => {
		const near = new Tile(0, 0, 1);
		const far = new Tile(1, 0, 1);
		near.distToCamera = 10;
		far.distToCamera = 1000;
		const ideals = new Set(["1/0/0", "1/1/0"]);
		const pn = TileLoadScheduler.loadPriority(near, ideals);
		const pf = TileLoadScheduler.loadPriority(far, ideals);
		expect(pn).toBeLessThan(pf);
		expect(pn).toBeLessThan(1);
		expect(pf).toBeLessThan(1);
	});

	it("coarser ideal tiles sort before finer ones (skyline underpaint)", () => {
		TileLoadScheduler.setIdealTileSet({ z: 16, keys: ["14/0/0", "16/0/0"], minX: 0, maxX: 0, minY: 0, maxY: 0 });
		const coarse = new Tile(0, 0, 14);
		const fine = new Tile(0, 0, 16);
		coarse.distToCamera = 5000;
		fine.distToCamera = 100;
		const ideals = new Set(["14/0/0", "16/0/0"]);
		const pc = TileLoadScheduler.loadPriority(coarse, ideals);
		const pf = TileLoadScheduler.loadPriority(fine, ideals);
		expect(pc).toBeLessThan(pf);
		TileLoadScheduler.setIdealTileSet(null);
	});

	it("non-ideal underlay (lower z) loads before fine ideals' distant siblings but after? band < 0.1", () => {
		TileLoadScheduler.setIdealTileSet({ z: 16, keys: ["16/0/0"], minX: 0, maxX: 0, minY: 0, maxY: 0 });
		const underlay = new Tile(1, 0, 15); // not ideal, z < 16
		underlay.distToCamera = 8000;
		const fineIdeal = new Tile(2, 0, 16);
		fineIdeal.distToCamera = 50;
		const pu = TileLoadScheduler.loadPriority(underlay, new Set(["16/0/0"]));
		const pf = TileLoadScheduler.loadPriority(fineIdeal, new Set(["16/0/0"]));
		// Underlay paints first so the skyline is never empty
		expect(pu).toBeLessThan(0.1);
		expect(pu).toBeLessThan(pf);
		TileLoadScheduler.setIdealTileSet(null);
	});

	it("non-ideal remains behind every ideal", () => {
		const ideal = new Tile(0, 0, 2);
		ideal.distToCamera = 1e8;
		const other = new Tile(0, 0, 1);
		other.distToCamera = 1;
		const ideals = new Set(["2/0/0"]);
		const pi = TileLoadScheduler.loadPriority(ideal, ideals);
		const po = TileLoadScheduler.loadPriority(other, ideals);
		expect(pi).toBeLessThan(po);
	});
});

describe("feel: incomplete coverage holds loaded tiles", () => {
	beforeEach(() => {
		TileLoadScheduler.setIdealTileSet(null);
		TileLoadScheduler.interacting = false;
	});

	it("loaded non-retain tiles survive update while an ideal is missing", async () => {
		const root = new Tile(0, 0, 0);
		root._payloadCache = new TileCache(16);
		const loader = makeRasterLoader();
		const sc = new TileSourceCache();

		sc.update(ctx(root, loader, 1));
		const pending: Tile[] = [];
		root.traverse((t) => {
			if ((t as any).isTile && !(t as Tile).loaded) pending.push(t as Tile);
		});
		for (const t of pending) {
			await (t as any)._loadData(loader);
		}
		sc.update(ctx(root, loader, 1));
		expect(sc.snapshot.idealCount).toBeGreaterThan(0);
		expect(sc.snapshot.idealLoaded).toBe(sc.snapshot.idealCount);

		// Create incomplete coverage first, then register a loaded non-retain tile.
		const victimKey = [...sc.idealKeys][0];
		const victim = sc.getTile(victimKey)!;
		(victim as any)._transitionTo(TileState.Unloaded);

		const orphan = new Tile(7, 0, 3); // key 3/7/0 — not ideal, not ancestor
		root.add(orphan);
		(orphan as any)._initTile?.();
		await (orphan as any)._loadData(loader);
		expect(orphan.loaded).toBe(true);

		sc.update(ctx(root, loader, 1));
		const orphanKey = "3/7/0";
		expect(sc.snapshot.idealLoaded).toBeLessThan(sc.snapshot.idealCount);
		expect(sc.getTile(orphanKey)).toBe(orphan);
		expect(sc.retainKeys.has(orphanKey)).toBe(false);
		expect(orphan.loaded).toBe(true);
	});
});
