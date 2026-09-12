import { describe, it, expect } from "vitest";
import { Matrix4, PerspectiveCamera } from "three";
import { computeCoveringTilesDFS } from "../coveringTiles";
import { computeCoveringZoomLevel, LODAction, LODEvaluate, isAncestorOfAnyIdeal } from "../util";
import { Tile } from "../Tile";

const mapW = 40075016;
const mapH = 40075016;

function engineRoot(): Matrix4 {
	return new Matrix4()
		.makeRotationX(-Math.PI / 2)
		.multiply(new Matrix4().makeScale(mapW, mapH, 1));
}

function pitchedCamera(dist: number, pitchDeg: number, aspect = 1.75): PerspectiveCamera {
	const cam = new PerspectiveCamera(45, aspect, 1, dist * 4);
	const pitch = (pitchDeg * Math.PI) / 180;
	cam.position.set(0, dist * Math.sin(pitch), dist * Math.cos(pitch));
	cam.lookAt(0, 0, 0);
	cam.updateMatrixWorld(true);
	cam.updateProjectionMatrix();
	return cam;
}

describe("coveringTiles distance LOD (pitch)", () => {
	it("produces mixed zoom levels under strong pitch (far coarser than near)", () => {
		const dist = 80000;
		// 65° from horizontal (25° from vertical) → far tiles beyond 2*K*camDist
		const cam = pitchedCamera(dist, 65);
		const coverZ = computeCoveringZoomLevel(dist, 900, mapW, 256, 45);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
			useDistanceLod: true,
			cameraToCenterDistance: dist,
			rootWorldMatrix: engineRoot(),
		});
		expect(set).not.toBeNull();
		const zooms = set!.keys.map((k) => Number(k.split("/")[0]));
		const maxZ = Math.max(...zooms);
		const minZ = Math.min(...zooms);
		expect(maxZ).toBe(Math.floor(coverZ));
		expect(minZ).toBeLessThan(maxZ);
	});

	it("top-down stays uniform even with distance LOD enabled", () => {
		const dist = 80000;
		const cam = new PerspectiveCamera(45, 1.75, 1, dist * 4);
		// Y-up: camera straight above origin
		cam.position.set(0, dist, 0);
		cam.lookAt(0, 0, 0);
		cam.updateMatrixWorld(true);
		cam.updateProjectionMatrix();
		const coverZ = computeCoveringZoomLevel(dist, 900, mapW, 256, 45);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
			useDistanceLod: true,
			cameraToCenterDistance: dist,
			rootWorldMatrix: engineRoot(),
		});
		expect(set).not.toBeNull();
		const zooms = new Set(set!.keys.map((k) => Number(k.split("/")[0])));
		expect(zooms.size).toBe(1);
		expect([...zooms][0]).toBe(Math.floor(coverZ));
		expect(set!.keys.length).toBeGreaterThan(8);
	});

	it("uniform z when distance LOD is off", () => {
		const dist = 80000;
		const cam = pitchedCamera(dist, 55);
		const coverZ = computeCoveringZoomLevel(dist, 900, mapW, 256, 45);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
			useDistanceLod: false,
			cameraToCenterDistance: dist,
			rootWorldMatrix: engineRoot(),
		});
		const zooms = new Set(set!.keys.map((k) => Number(k.split("/")[0])));
		expect(zooms.size).toBe(1);
		expect([...zooms][0]).toBe(Math.floor(coverZ));
	});
});

describe("mixed-z ideal path (distance LOD) + LODEvaluate", () => {
	it("reports max zoom as IdealTileSet.z when mixed", () => {
		const dist = 80000;
		const cam = pitchedCamera(dist, 65);
		const coverZ = computeCoveringZoomLevel(dist, 900, mapW, 256, 45);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
			useDistanceLod: true,
			cameraToCenterDistance: dist,
			rootWorldMatrix: engineRoot(),
		});
		expect(set).not.toBeNull();
		const zooms = set!.keys.map((k) => Number(k.split("/")[0]));
		expect(set!.z).toBe(Math.max(...zooms));
	});

	it("does not force uniform refine when mixed ideal set is present", () => {
		// Far ideal at z=12; coveringZoom would otherwise pull this to 14
		const t = new Tile(25, 12, 10);
		(t as any).inFrustum = true;
		const ideals = new Set(["12/100/50", "14/400/200"]);
		const action = LODEvaluate(t, 0, 15, 1, 14.2, ideals);
		// 100>>2=25, 50>>2=12 → ancestor of z=12 ideal → create
		expect(action).toBe(LODAction.create);
	});

	it("skips non-ancestor leaves when mixed ideal set is present", () => {
		const t = new Tile(0, 0, 10);
		(t as any).inFrustum = true;
		// Ideals live under (25,12) / (100,50) branches — not this tile
		const ideals = new Set(["12/100/50", "14/400/200"]);
		const action = LODEvaluate(t, 0, 15, 1, 14.2, ideals);
		expect(action).toBe(LODAction.none);
	});

	it("isAncestorOfAnyIdeal accepts mixed zoom keys", () => {
		const ideals = new Set(["12/100/50", "14/400/200"]);
		// 100>>2=25, 50>>2=12 at z=10
		expect(isAncestorOfAnyIdeal(10, 25, 12, ideals)).toBe(true);
		// 400>>3=50, 200>>3=25 at z=11
		expect(isAncestorOfAnyIdeal(11, 50, 25, ideals)).toBe(true);
		expect(isAncestorOfAnyIdeal(10, 0, 0, ideals)).toBe(false);
	});
});
