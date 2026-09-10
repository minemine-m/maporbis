import { describe, it, expect } from "vitest";
import { Tile, TileState } from "../Tile";

function makeLoaded(t: Tile) {
	// Force loaded state without network
	(t as any)._transitionTo(TileState.Loaded);
	(t as any)._isLoaded = true;
	return t;
}

describe("cover visibility uses in-frustum children only", () => {
	it("shows loaded in-frustum children even if siblings are out of frustum", () => {
		const parent = new Tile(0, 0, 5);
		const c0 = new Tile(0, 0, 6);
		const c1 = new Tile(1, 0, 6);
		const c2 = new Tile(0, 1, 6);
		const c3 = new Tile(1, 1, 6);
		parent.add(c0, c1, c2, c3);

		// Only two children on screen; those two are loaded
		(c0 as any).inFrustum = true;
		(c1 as any).inFrustum = true;
		(c2 as any).inFrustum = false;
		(c3 as any).inFrustum = false;
		makeLoaded(c0);
		makeLoaded(c1);
		// c2/c3 remain unloaded

		(parent as any)._refreshCoverVisibility();

		expect(parent.showing).toBe(false);
		expect(c0.showing).toBe(true);
		expect(c1.showing).toBe(true);
	});

	it("keeps parent cover until in-frustum children are loaded", () => {
		const parent = new Tile(0, 0, 5);
		const c0 = new Tile(0, 0, 6);
		const c1 = new Tile(1, 0, 6);
		const c2 = new Tile(0, 1, 6);
		const c3 = new Tile(1, 1, 6);
		parent.add(c0, c1, c2, c3);

		(c0 as any).inFrustum = true;
		(c1 as any).inFrustum = true;
		(c2 as any).inFrustum = false;
		(c3 as any).inFrustum = false;
		makeLoaded(c0);
		// c1 still loading

		(parent as any)._refreshCoverVisibility();

		expect(parent.showing).toBe(true);
		expect(c0.showing).toBe(false);
		expect(c1.showing).toBe(false);
	});
});
