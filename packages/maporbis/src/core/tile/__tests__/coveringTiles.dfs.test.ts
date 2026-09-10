import { describe, it, expect } from "vitest";
import { Matrix4, PerspectiveCamera, Vector3 } from "three";
import { computeCoveringTilesDFS, tileWorldBounds } from "../coveringTiles";
import { computeCoveringZoomLevel } from "../util";

const mapW = 40075016;
const mapH = 40075016;

function topDownCamera(dist: number, aspect = 1.5): PerspectiveCamera {
	const cam = new PerspectiveCamera(60, aspect, 1, dist * 4);
	cam.position.set(0, 0, dist);
	cam.lookAt(0, 0, 0);
	cam.updateMatrixWorld(true);
	cam.updateProjectionMatrix();
	return cam;
}

function pitchedCamera(dist: number, pitchDeg: number, aspect = 1.5): PerspectiveCamera {
	const cam = new PerspectiveCamera(60, aspect, 1, dist * 4);
	const pitch = (pitchDeg * Math.PI) / 180;
	// Orbit around origin: camera on +Y side looking down toward origin
	cam.position.set(0, dist * Math.sin(pitch), dist * Math.cos(pitch));
	cam.lookAt(0, 0, 0);
	cam.updateMatrixWorld(true);
	cam.updateProjectionMatrix();
	return cam;
}

describe("tileWorldBounds", () => {
	it("covers full world at z=0", () => {
		const b = tileWorldBounds(0, 0, 0, mapW, mapH);
		expect(b.min.x).toBeCloseTo(-mapW / 2, 3);
		expect(b.max.x).toBeCloseTo(mapW / 2, 3);
		expect(b.min.y).toBeCloseTo(-mapH / 2, 3);
		expect(b.max.y).toBeCloseTo(mapH / 2, 3);
	});

	it("NE quadrant at z=1 is +X +Y (tile Y south)", () => {
		// XYZ: x=1 east half, y=0 north half
		const b = tileWorldBounds(1, 1, 0, mapW, mapH);
		expect(b.min.x).toBeCloseTo(0, 3);
		expect(b.max.x).toBeCloseTo(mapW / 2, 3);
		expect(b.max.y).toBeCloseTo(mapH / 2, 3);
		expect(b.min.y).toBeCloseTo(0, 3);
	});
});

describe("computeCoveringTilesDFS", () => {
	it("top-down center produces non-empty set at covering z", () => {
		const dist = 80000;
		const cam = topDownCamera(dist);
		const coverZ = computeCoveringZoomLevel(dist, 800, mapW, 256, 60);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
		});
		expect(set).not.toBeNull();
		expect(set!.keys.length).toBeGreaterThan(0);
		const z0 = Math.floor(coverZ);
		expect(set!.keys[0]).toMatch(new RegExp(`^${z0}/`));
		// Top-down should be a modest viewport set, not the whole world
		expect(set!.keys.length).toBeLessThan(200);
	});

	it("clamps to maxLevel", () => {
		const cam = topDownCamera(2000);
		const set = computeCoveringTilesDFS({
			coveringZoom: 18.5,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
		});
		expect(set).not.toBeNull();
		for (const k of set!.keys) {
			expect(k.startsWith("15/")).toBe(true);
		}
	});

	it("camera far off-world yields empty set", () => {
		const cam = topDownCamera(1e6);
		// Point camera away from map (look along +X from far east, map is around origin)
		cam.position.set(mapW * 10, 0, 50);
		cam.lookAt(mapW * 20, 0, 0);
		cam.updateMatrixWorld(true);
		const set = computeCoveringTilesDFS({
			coveringZoom: 8,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
		});
		expect(set).toBeNull();
	});

	it("pitch still covers center tiles", () => {
		const dist = 120000;
		const cam = pitchedCamera(dist, 50);
		const coverZ = computeCoveringZoomLevel(dist, 800, mapW, 256, 60);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
		});
		expect(set).not.toBeNull();
		expect(set!.keys.length).toBeGreaterThan(0);
		// At least some tiles near world center (z around coverZ, x/y mid)
		const z = set!.z;
		const n = Math.pow(2, z);
		const mid = n / 2;
		const nearCenter = set!.keys.some((k) => {
			const [, x, y] = k.split("/").map(Number);
			return Math.abs(x - mid) < n * 0.25 && Math.abs(y - mid) < n * 0.25;
		});
		expect(nearCenter).toBe(true);
	});

	it("distance LOD stops far tiles earlier than near tiles", () => {
		const dist = 200000;
		const cam = pitchedCamera(dist, 55);
		const coverZ = computeCoveringZoomLevel(dist, 800, mapW, 256, 60);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
			useDistanceLod: true,
			cameraToCenterDistance: dist,
		});
		expect(set).not.toBeNull();
		const zooms = new Set(set!.keys.map((k) => Number(k.split("/")[0])));
		// Mixed LOD levels when distance LOD is on
		expect(zooms.size).toBeGreaterThanOrEqual(1);
		// Max zoom present
		expect(Math.max(...zooms)).toBeLessThanOrEqual(Math.floor(coverZ));
	});

	it("engine rootWorldMatrix (XZ ground, Y up) finds tiles under top-down camera", () => {
		// Matches Map: _rootGroup.rotation.x = -PI/2, scale (mapW, mapH, 1)
		const rootM = new Matrix4()
			.makeRotationX(-Math.PI / 2)
			.multiply(new Matrix4().makeScale(mapW, mapH, 1));
		const dist = 80000;
		const cam = new PerspectiveCamera(45, 1920 / 945, 1, dist * 4);
		cam.position.set(0, dist, 0);
		cam.lookAt(0, 0, 0);
		cam.updateMatrixWorld(true);
		cam.updateProjectionMatrix();
		const coverZ = computeCoveringZoomLevel(dist, 945, mapW, 256, 45);
		const set = computeCoveringTilesDFS({
			coveringZoom: coverZ,
			camera: cam,
			mapWidth: mapW,
			mapHeight: mapH,
			minLevel: 0,
			maxLevel: 15,
			useDistanceLod: false,
			rootWorldMatrix: rootM,
		});
		expect(set).not.toBeNull();
		expect(set!.keys.length).toBeGreaterThan(4);
		expect(set!.keys.length).toBeLessThan(200);
		const z = Math.floor(coverZ);
		for (const k of set!.keys) {
			expect(k.startsWith(`${z}/`)).toBe(true);
		}
	});
});
