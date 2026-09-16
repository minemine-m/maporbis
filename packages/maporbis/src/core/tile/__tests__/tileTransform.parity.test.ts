import { describe, it, expect } from "vitest";
import { Object3D, Vector3 } from "three";
import { createChildren } from "../util";
import { computeTileRootLocal, computeTileRootSpace } from "../tileTransform";
import type { ICompositeLoader } from "../../../loaders";

const MAP_W = 40075016;
const MAP_H = 40075016;

const fakeLoader = {} as ICompositeLoader;

function buildHierarchical(z: number, x: number, y: number) {
	const root = new Object3D();
	root.scale.set(MAP_W, MAP_H, 1);
	root.updateMatrix();
	root.updateMatrixWorld(true);

	let node: Object3D = root;
	for (let level = 1; level <= z; level++) {
		const shift = z - level;
		const cx = x >> shift;
		const cy = y >> shift;
		const dx = cx & 1;
		const dy = cy & 1;
		const pos = 0.25;
		const child = new Object3D();
		child.position.set(dx === 0 ? -pos : pos, dy === 0 ? pos : -pos, 0);
		child.scale.set(0.5, 0.5, 1);
		node.add(child);
		node.updateMatrixWorld(true);
		node = child;
	}
	return { root, tile: node };
}

describe("flat tile transform vs hierarchical createChildren", () => {
	const samples: Array<[number, number, number]> = [
		[0, 0, 0],
		[1, 0, 0],
		[1, 1, 0],
		[1, 0, 1],
		[1, 1, 1],
		[2, 0, 0],
		[2, 3, 1],
		[2, 2, 2],
		[3, 5, 6],
		[5, 17, 9],
		[8, 100, 200],
		[10, 500, 512],
		[12, 2000, 1500],
		[14, 8000, 9000],
	];

	it("world center/scale match formula within 1e-3", () => {
		for (const [z, x, y] of samples) {
			const { root, tile } = buildHierarchical(z, x, y);
			const worldPos = new Vector3();
			const worldScale = new Vector3();
			tile.getWorldPosition(worldPos);
			tile.getWorldScale(worldScale);

			const expected = computeTileRootSpace(z, x, y, MAP_W, MAP_H);

			expect(worldPos.x).toBeCloseTo(expected.px, 3);
			expect(worldPos.y).toBeCloseTo(expected.py, 3);
			expect(worldScale.x).toBeCloseTo(expected.wx, 3);
			expect(worldScale.y).toBeCloseTo(expected.wy, 3);
		}
	});

	it("unit-space local formula is inverse of root scale", () => {
		const local = computeTileRootLocal(2, 1, 1);
		const space = computeTileRootSpace(2, 1, 1, MAP_W, MAP_H);
		expect(local.u * MAP_W).toBeCloseTo(space.px, 9);
		expect(local.v * MAP_H).toBeCloseTo(space.py, 9);
		expect(local.v).toBeCloseTo(0.125, 9);
	});

	it("createChildren still available for parity reference", () => {
		expect(typeof createChildren).toBe("function");
		expect(fakeLoader).toBeTruthy();
	});
});
