import { describe, it, expect } from "vitest";
import { Tile } from "../Tile";
import { LODAction, LODEvaluate, isAncestorOfAnyIdeal } from "../util";

function leaf(z: number, x: number, y: number, opts?: { showing?: boolean; inFrustum?: boolean }) {
	const t = new Tile(x, y, z);
	(t as any).inFrustum = opts?.inFrustum !== false;
	t.showing = opts?.showing !== false;
	return t;
}

describe("isAncestorOfAnyIdeal", () => {
	it("matches descendant ideal keys", () => {
		const ideals = new Set(["12/100/50", "12/101/50"]);
		// 100>>2=25, 50>>2=12 at z=10
		expect(isAncestorOfAnyIdeal(10, 25, 12, ideals)).toBe(true);
		expect(isAncestorOfAnyIdeal(10, 0, 0, ideals)).toBe(false);
	});

	it("does not match self or ancestor", () => {
		const ideals = new Set(["10/25/12"]);
		expect(isAncestorOfAnyIdeal(10, 25, 12, ideals)).toBe(false);
		expect(isAncestorOfAnyIdeal(11, 50, 24, ideals)).toBe(false);
	});
});

describe("LODEvaluate edge refine (no showing gate)", () => {
	it("creates children when in frustum and z < coveringZoom even if not showing", () => {
		const t = leaf(10, 25, 12, { showing: false, inFrustum: true });
		const action = LODEvaluate(t, 0, 15, 1, 12.21);
		expect(action).toBe(LODAction.create);
	});

	it("does not create when out of frustum", () => {
		const t = leaf(10, 25, 12, { showing: false, inFrustum: false });
		const action = LODEvaluate(t, 0, 15, 1, 12.21);
		expect(action).toBe(LODAction.none);
	});

	it("force-refines ancestors of ideal tiles even past coveringZoom", () => {
		// coveringZoom=8 but ideal needs z=12 under this tile
		const t = leaf(8, 6, 3, { showing: false, inFrustum: true });
		const ideals = new Set(["12/100/50"]);
		// 100>>4=6, 50>>4=3 at z=8
		const action = LODEvaluate(t, 0, 15, 1, 8, ideals);
		expect(action).toBe(LODAction.create);
	});

	it("keeps out-of-frustum subtree if it still covers ideal tiles", () => {
		// non-leaf: has children mock via isLeaf false — Tile.isLeaf checks children
		const parent = new Tile(0, 0, 5);
		const child = new Tile(0, 0, 6);
		parent.add(child);
		(parent as any).inFrustum = false;
		parent.showing = true;
		const ideals = new Set(["12/100/50"]);
		// 100>>7=0, 50>>7=0 at z=5
		const action = LODEvaluate(parent, 0, 15, 1, 12, ideals);
		expect(action).toBe(LODAction.none);
	});

	it("removes out-of-frustum subtree with no ideal descendants", () => {
		const parent = new Tile(0, 0, 5);
		const child = new Tile(0, 0, 6);
		parent.add(child);
		(parent as any).inFrustum = false;
		const action = LODEvaluate(parent, 0, 15, 1, 12, new Set(["12/999/999"]));
		expect(action).toBe(LODAction.remove);
	});
});
