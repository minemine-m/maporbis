import { describe, it, expect, vi, beforeEach } from "vitest";
import { Camera, MeshBasicMaterial, PlaneGeometry } from "three";
import { Tile } from "../Tile";
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

describe("SourceCache event bus", () => {
	beforeEach(() => {
		TileLoadScheduler.setIdealTileSet(null);
		TileLoadScheduler.interacting = false;
	});

	it("dispatches tile-created and tile-loaded on the cache, not only root", async () => {
		const root = new Tile(0, 0, 0);
		root._payloadCache = new TileCache(8);
		const loader = makeRasterLoader();
		const sc = new TileSourceCache();

		const created: string[] = [];
		const loaded: string[] = [];
		sc.addEventListener("tile-created", (e: any) => {
			created.push(`${e.tile.z}/${e.tile.x}/${e.tile.y}`);
		});
		sc.addEventListener("tile-loaded", (e: any) => {
			loaded.push(`${e.tile.z}/${e.tile.x}/${e.tile.y}`);
		});

		sc.update(ctx(root, loader, 1));
		expect(created.length).toBeGreaterThan(0);

		const pending: Tile[] = [];
		root.traverse((t) => {
			if ((t as any).isTile && !(t as Tile).loaded) pending.push(t as Tile);
		});
		for (const t of pending) {
			await (t as any)._loadData(loader);
		}
		expect(loaded.length).toBeGreaterThan(0);
	});

	it("dispatches tile-shown when SourceCache flips showing", async () => {
		const root = new Tile(0, 0, 0);
		root._payloadCache = new TileCache(8);
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
		// Drain dirty-driven updates so showing is already true.
		await new Promise((r) => setTimeout(r, 0));
		sc.update(ctx(root, loader, 1));

		// Force a hidden state without going through the public writer, then
		// let SourceCache re-show and emit the event.
		root.traverse((t) => {
			if ((t as any).isTile && (t as Tile).loaded) {
				(t as any)._isVisible = false;
			}
		});

		const shown: number[] = [];
		sc.addEventListener("tile-shown", (e: any) => {
			shown.push(e.tile.z);
		});
		sc.update(ctx(root, loader, 1));
		expect(shown.length).toBeGreaterThan(0);
	});

	it("re-emits tile-unload when root reload disposes children", async () => {
		const root = new Tile(0, 0, 0);
		root._payloadCache = new TileCache(8);
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

		const unloaded: string[] = [];
		sc.addEventListener("tile-unload", (e: any) => {
			unloaded.push(`${e.tile.z}/${e.tile.x}/${e.tile.y}`);
		});
		root.reload(loader);
		expect(unloaded.length).toBeGreaterThan(0);
	});

	it("re-emits tile-unload for root itself on root reload", async () => {
		const root = new Tile(0, 0, 0);
		root._payloadCache = new TileCache(8);
		const loader = makeRasterLoader();
		const sc = new TileSourceCache();
		// Bind root (production layer always update()s first).
		sc.update(ctx(root, loader, 1));
		await (root as any)._loadData(loader);

		const unloaded: string[] = [];
		sc.addEventListener("tile-unload", (e: any) => {
			unloaded.push(`${e.tile.z}/${e.tile.x}/${e.tile.y}`);
		});
		root.reload(loader);
		expect(unloaded).toContain("0/0/0");
	});
});
