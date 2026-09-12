import { describe, it, expect } from "vitest";
import { Matrix4, PerspectiveCamera } from "three";
import { computeCoveringTilesDFS } from "../coveringTiles";
import { computeCoveringZoomLevel } from "../util";

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
	it("produces mixed zoom levels under pitch (far coarser than near)", () => {
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
			useDistanceLod: true,
			cameraToCenterDistance: dist,
			rootWorldMatrix: engineRoot(),
		});
		expect(set).not.toBeNull();
		const zooms = set!.keys.map((k) => Number(k.split("/")[0]));
		const maxZ = Math.max(...zooms);
		const minZ = Math.min(...zooms);
		// Near camera reaches cover z; far tiles stop earlier
		expect(maxZ).toBe(Math.floor(coverZ));
		expect(minZ).toBeLessThan(maxZ);
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
