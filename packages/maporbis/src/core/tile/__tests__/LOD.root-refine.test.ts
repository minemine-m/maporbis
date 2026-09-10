import { describe, it, expect } from "vitest";
import { Tile } from "../Tile";
import { LODAction, LODEvaluate } from "../util";

describe("LODEvaluate root refine with minLevel=0", () => {
	it("creates children for root z=0 when in frustum even if not showing", () => {
		const root = new Tile(0, 0, 0);
		(root as any).inFrustum = true;
		root.showing = false;
		const action = LODEvaluate(root, 0, 15, 1, 13.5);
		expect(action).toBe(LODAction.create);
	});

	it("still creates when z < minLevel", () => {
		const t = new Tile(0, 0, 1);
		(t as any).inFrustum = true;
		t.showing = false;
		const action = LODEvaluate(t, 2, 15, 1, 13.5);
		expect(action).toBe(LODAction.create);
	});
});
