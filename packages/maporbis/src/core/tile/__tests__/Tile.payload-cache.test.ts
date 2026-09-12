import { describe, it, expect, vi } from "vitest";
import { BufferGeometry } from "three";
import { Tile, TileState } from "../Tile";
import { TileCache } from "../../../loaders/TileCache";

function makeRoot() {
	const root = new Tile(0, 0, 0);
	root._payloadCache = new TileCache(8);
	return root;
}

describe("Tile payload cache", () => {
	it("LRU stores and retrieves by z/x/y", () => {
		const cache = new TileCache(2);
		const g = new BufferGeometry();
		cache.set(1, 2, 3, { materials: [], geometry: g });
		expect(cache.has(1, 2, 3)).toBe(true);
		expect(cache.get(1, 2, 3)?.geometry).toBe(g);
		cache.set(1, 0, 0, { materials: [], geometry: new BufferGeometry() });
		cache.set(1, 0, 1, { materials: [], geometry: new BufferGeometry() });
		expect(cache.size).toBe(2);
	});

	it("data-only dispose puts vectorData in cache; load restores without network", async () => {
		const root = makeRoot();
		// ctor is Tile(x, y, z) → z=1, x=0, y=0
		const child = new Tile(0, 0, 1);
		child.setDataOnlyMode(true);
		root.add(child);
		(child as any)._vectorData = { vectorData: { dataFormat: "mvt-local", layers: {} } };
		(child as any)._transitionTo(TileState.Loaded);
		(child as any)._isLoaded = true;

		const loader = {
			load: vi.fn(),
			unload: vi.fn(),
		} as any;
		(child as any)._disposeResources(true, loader);
		expect(loader.unload).not.toHaveBeenCalled();
		expect(root._payloadCache!.has(1, 0, 0)).toBe(true);

		// New node same key — cache hit, no network
		const again = new Tile(0, 0, 1);
		again.setDataOnlyMode(true);
		root.add(again);
		await (again as any)._loadData(loader);
		expect(loader.load).not.toHaveBeenCalled();
		expect(again.loaded).toBe(true);
		expect(again.getVectorData()?.vectorData?.dataFormat).toBe("mvt-local");
	});
});
