import { describe, it, expect } from "vitest";
import { Tile } from "../Tile";
import { LODAction, LODEvaluate, isAncestorOfAnyIdeal } from "../util";

function leaf(z: number, x: number, y: number, opts?: { showing?: boolean; inFrustum?: boolean }) {
	const t = new Tile(x, y, z);
	(t as any).inFrustum = opts?.inFrustum !== false;
	t.showing = opts?.showing !== false;
	return t;
}

describe("LODEvaluate uses floor(coveringZoom) as target", () => {
	it("does not refine z=target when coveringZoom is fractional", () => {
		// ideal z = floor(12.47) = 12; z=12 must NOT create z=13
		const t = leaf(12, 100, 50, { showing: true, inFrustum: true });
		const action = LODEvaluate(t, 0, 15, 1, 12.47);
		expect(action).toBe(LODAction.none);
	});

	it("still refines z < floor(coveringZoom)", () => {
		const t = leaf(11, 50, 25, { showing: false, inFrustum: true });
		const action = LODEvaluate(t, 0, 15, 1, 12.47);
		expect(action).toBe(LODAction.create);
	});

	it("does not remove z=target+0 parent while children load", () => {
		const parent = new Tile(0, 0, 11);
		parent.add(new Tile(0, 0, 12));
		(parent as any).inFrustum = true;
		const action = LODEvaluate(parent, 0, 15, 1, 12.47);
		// z=11 < target 12, keep children
		expect(action).toBe(LODAction.none);
	});

	it("removes leftover children at/above ideal z after zoom-out", () => {
		// Was at zoom 14 (z=13 has z=14 kids); back to 13.54 → target 13
		const parent = new Tile(0, 0, 13);
		parent.add(new Tile(0, 0, 14));
		(parent as any).inFrustum = true;
		const action = LODEvaluate(parent, 0, 15, 1, 13.54);
		expect(action).toBe(LODAction.remove);
	});
});

describe("isAncestorOfAnyIdeal", () => {
	it("matches descendant ideal keys", () => {
		const ideals = new Set(["12/100/50", "12/101/50"]);
		expect(isAncestorOfAnyIdeal(10, 25, 12, ideals)).toBe(true);
		expect(isAncestorOfAnyIdeal(10, 0, 0, ideals)).toBe(false);
	});
});
