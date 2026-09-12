import { describe, it, expect } from "vitest";
import { MeshBasicMaterial } from "three";
import { Tile } from "../Tile";

describe("raster material visibility follows showing", () => {
	it("new materials stay hidden until showing is true", () => {
		const t = new Tile(1, 2, 13);
		const mat = new MeshBasicMaterial();
		// Three defaults material.visible = true
		expect(mat.visible).toBe(true);
		t.material = [mat];
		(t as any)._applyRasterDepthBias();
		expect(mat.visible).toBe(false);
		expect(t.showing).toBe(false);
	});

	it("showing=true turns materials on; false turns them off", () => {
		const t = new Tile(1, 2, 13);
		const mat = new MeshBasicMaterial();
		t.material = [mat];
		(t as any)._applyRasterDepthBias();

		t.showing = true;
		expect(mat.visible).toBe(true);
		t.showing = false;
		expect(mat.visible).toBe(false);
	});
});
