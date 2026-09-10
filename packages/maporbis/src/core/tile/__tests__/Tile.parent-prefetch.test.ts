import { describe, it, expect, vi, beforeEach } from "vitest";
import { Camera } from "three";
import { Tile, TileState } from "../Tile";
import { LODAction, createChildren } from "../util";

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

function makeParams(loader: any) {
	return {
		camera: new Camera(),
		loader,
		minLevel: 0,
		maxLevel: 12,
		LODThreshold: 1,
		interacting: false,
	};
}

describe("Tile parent-prefetch when subdividing unloaded parent", () => {
	beforeEach(() => {
		Tile.debugSchedule = false;
		Tile.interacting = false;
	});

	it("enqueues an unloaded non-dummy parent when creating its children", async () => {
		const loader = makeLoader();
		const before = Tile.getScheduleStats().parentPrefetchCount;

		const root = new Tile(0, 0, 0);
		// Parent at z=2: in tree, in frustum, showing, but never loaded
		const parent = new Tile(1, 1, 2);
		root.add(parent);
		(parent as any).inFrustum = true;
		parent.showing = true;
		parent.distToCamera = 1000;
		expect(parent.loaded).toBe(false);
		expect(parent.state).toBe(TileState.Idle);

		const children = createChildren(loader, parent.x, parent.y, parent.z);
		const params = makeParams(loader);
		(root as any)._processLODAction(parent, LODAction.create, children, params);

		// Callback wired before async load finishes
		expect((parent as any)._onLoadComplete).toBeTruthy();

		// Allow queued load to start/finish (finally clears _onLoadComplete)
		await new Promise((r) => setTimeout(r, 0));

		const after = Tile.getScheduleStats().parentPrefetchCount;
		expect(after).toBe(before + 1);

		// Parent itself should have been requested (cover), not only children
		const loadCalls = loader.load.mock.calls.map((c: any[]) => `${c[0].z}/${c[0].x}/${c[0].y}`);
		expect(loadCalls).toContain("2/1/1");
		// Children in frustum should also be requested
		expect(loadCalls.length).toBeGreaterThanOrEqual(2);
	});

	it("does not prefetch an already-loaded parent", async () => {
		const loader = makeLoader();
		const before = Tile.getScheduleStats().parentPrefetchCount;

		const root = new Tile(0, 0, 0);
		const parent = new Tile(0, 0, 1);
		root.add(parent);
		(parent as any).inFrustum = true;
		parent.showing = true;
		// Simulate already loaded
		(parent as any)._transitionTo(TileState.Loaded);

		const children = createChildren(loader, parent.x, parent.y, parent.z);
		(root as any)._processLODAction(parent, LODAction.create, children, makeParams(loader));
		await new Promise((r) => setTimeout(r, 0));

		const after = Tile.getScheduleStats().parentPrefetchCount;
		expect(after).toBe(before);
		const loadCalls = loader.load.mock.calls.map((c: any[]) => `${c[0].z}/${c[0].x}/${c[0].y}`);
		expect(loadCalls).not.toContain("1/0/0");
	});
});
