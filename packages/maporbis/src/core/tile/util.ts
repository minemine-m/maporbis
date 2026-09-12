

import { Camera, PerspectiveCamera, Vector3 } from "three";
import { Tile } from ".";
import { ICompositeLoader } from "../../loaders";

/**
 */
export enum LODAction {
	none,
	create,
	remove,
}

/**
 * Estimate the integer tile zoom that best matches the current camera
 * (Mapbox-style coveringZoomLevel). Target ~targetScreenSize pixels per tile.
 *
 * @param cameraOrDistance Pass a Camera, or a precomputed camera→ground distance.
 */
export function computeCoveringZoomLevel(
	camera: Camera | number,
	viewportHeight: number,
	mapWidth: number,
	targetScreenSize: number = 512,
	fovDegOverride?: number
): number {
	let dist: number;
	let fovDeg = 60;
	if (typeof camera === "number") {
		dist = camera;
		if (typeof fovDegOverride === "number") fovDeg = fovDegOverride;
	} else {
		const cam = camera as PerspectiveCamera;
		const camPos = new Vector3();
		cam.getWorldPosition(camPos);
		const target = (cam as any)?.controls?.target || (cam as any)?.parent?.userData?.cameraTarget;
		if (target && target.isVector3) {
			dist = camPos.distanceTo(target);
		} else {
			dist = camPos.length();
		}
		fovDeg = cam.fov || fovDegOverride || 60;
	}
	dist = Math.max(dist, 1);
	const fovRad = (fovDeg * Math.PI) / 180;
	const h = Math.max(viewportHeight, 1);
	const worldPerPixel = (2 * dist * Math.tan(fovRad / 2)) / h;
	const tileWorld = targetScreenSize * worldPerPixel;
	const z = Math.log2(Math.max(mapWidth, 1) / Math.max(tileWorld, 1e-6));
	return z;
}

export type IdealTileSet = {
	z: number;
	keys: string[];
	minX: number;
	maxX: number;
	minY: number;
	maxY: number;
};

/**
 * True if the ideal tile itself is loaded, or any ancestor is loaded (cover).
 * ideal 自身已加载，或任一祖先已加载可作覆盖。
 */
export function hasLoadedCover(
	loadedKeys: Set<string>,
	z: number,
	x: number,
	y: number
): boolean {
	if (loadedKeys.has(`${z}/${x}/${y}`)) return true;
	if (z <= 0) return false;
	return hasLoadedCover(loadedKeys, z - 1, x >> 1, y >> 1);
}

/**
 * Count how many ideal tiles are visually covered (self or ancestor loaded).
 */
export function countIdealCovered(
	idealKeys: string[],
	loadedKeys: Set<string>
): number {
	let n = 0;
	for (const key of idealKeys) {
		const [z, x, y] = key.split("/").map(Number);
		if (hasLoadedCover(loadedKeys, z, x, y)) n++;
	}
	return n;
}

/**
 * Mapbox-style coveringTiles (viewport AABB at covering zoom).
 * Returns ideal XYZ keys the camera wants this frame.
 * 每帧根据相机与视口计算 ideal 瓦片 key 集合。
 */
export function computeIdealTileSet(
	coveringZoom: number,
	lookAtProjected: { x: number; y: number },
	mapWidth: number,
	mapHeight: number,
	viewportWidth: number,
	viewportHeight: number,
	dist: number,
	fovDeg: number,
	minLevel: number,
	maxLevel: number
): IdealTileSet | null {
	if (!Number.isFinite(coveringZoom)) return null;
	const z = Math.min(
		Math.max(Math.floor(coveringZoom), minLevel),
		maxLevel
	);
	const n = Math.pow(2, z);
	const fovRad = (fovDeg * Math.PI) / 180;
	const h = Math.max(viewportHeight, 1);
	const w = Math.max(viewportWidth, 1);
	const asp = w / h;
	const d = Math.max(dist, 1);

	const visH = 2 * d * Math.tan(fovRad / 2);
	const visW = visH * asp;

	const u0 = (lookAtProjected.x + mapWidth / 2) / mapWidth;
	const v0 = (mapHeight / 2 - lookAtProjected.y) / mapHeight;

	const halfTilesX = (visW / mapWidth) * n * 0.5;
	const halfTilesY = (visH / mapHeight) * n * 0.5;
	const cx = u0 * n;
	const cy = v0 * n;

	const minX = Math.max(0, Math.floor(cx - halfTilesX));
	const maxX = Math.min(n - 1, Math.ceil(cx + halfTilesX));
	const minY = Math.max(0, Math.floor(cy - halfTilesY));
	const maxY = Math.min(n - 1, Math.ceil(cy + halfTilesY));
	if (maxX < minX || maxY < minY) return null;

	const keys: string[] = [];
	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			keys.push(`${z}/${x}/${y}`);
		}
	}
	return { z, keys, minX, maxX, minY, maxY };
}

// Get the distance of camera to tile
/**
 */
export function getDistance(tile: Tile, cameraWorldPosition: Vector3) {
	const tilePos = tile.position.clone().setZ(tile.maxZ).applyMatrix4(tile.matrixWorld);
	return cameraWorldPosition.distanceTo(tilePos);
}

/**
 */
export function getTileSize(tile: Tile) {
	const scale = tile.scale;
	const lt = new Vector3(-scale.x, -scale.y, 0).applyMatrix4(tile.matrixWorld);
	const rt = new Vector3(scale.x, scale.y, 0).applyMatrix4(tile.matrixWorld);
	return lt.sub(rt).length();
}

function getDistRatio(tile: Tile): number {
	return (tile.distToCamera / tile.sizeInWorld) * 0.8;
}

/**
 * True if any ideal key lives under this tile (strict descendant).
 * ideal key 是否落在该瓦片子树内。
 */
export function isAncestorOfAnyIdeal(
	z: number,
	x: number,
	y: number,
	idealKeys?: ReadonlySet<string> | Set<string> | null
): boolean {
	if (!idealKeys || idealKeys.size === 0) return false;
	for (const key of idealKeys) {
		const parts = key.split("/");
		const iz = +parts[0];
		const ix = +parts[1];
		const iy = +parts[2];
		if (!Number.isFinite(iz) || iz <= z) continue;
		const dz = iz - z;
		if ((ix >> dz) === x && (iy >> dz) === y) return true;
	}
	return false;
}

/**
 * Evaluate the Level of Detail (LOD) action.
 * Primary: coveringZoom from camera (screen-space ideal z).
 * Fallback: distance ratio threshold (legacy).
 *
 * 细分条件：在视锥内且需要更细（coveringZoom / ideal 祖先）。
 * 不要求 showing——否则边缘/平移后父级未 showing 时永远建不出子树。
 */
export function LODEvaluate(
	tile: Tile,
	minLevel: number,
	maxLevel: number,
	threshold: number,
	coveringZoom?: number,
	idealTiles?: ReadonlySet<string> | Set<string> | null
): LODAction {
	const distRatio = getDistRatio(tile);
	const hasCover = typeof coveringZoom === "number" && Number.isFinite(coveringZoom);
	// Integer target z — same as SourceCache ideal (floor). Do not refine past
	// it or cover will wait on z+1 tiles that are not in the ideal load set.
	const targetZ = hasCover ? Math.floor(coveringZoom!) : undefined;

	if (tile.isLeaf) {
		// Root (z=0) must always refine when in frustum; it has no parent to set showing.
		const forceRefine = tile.z === 0 || tile.z < minLevel;
		const coverOk = hasCover ? tile.z < targetZ! : distRatio < threshold;
		const needsIdeal = isAncestorOfAnyIdeal(tile.z, tile.x, tile.y, idealTiles);
		if (
			tile.inFrustum &&
			tile.z < maxLevel &&
			(forceRefine || coverOk || needsIdeal)
		) {
			return LODAction.create;
		}
	} else {
		// Keep one extra level so parent can cover while ideal children load
		const coverOk = hasCover ? tile.z > targetZ! + 1 : distRatio > threshold;
		// Drop deep out-of-view subtrees, but keep shallow loaded tiles for pan-back
		// and anything still needed for ideal cover.
		const keepForPan = tile.loaded && hasCover && tile.z <= targetZ! + 1;
		const outOfView =
			!tile.inFrustum &&
			tile.z >= minLevel &&
			!keepForPan &&
			!isAncestorOfAnyIdeal(tile.z, tile.x, tile.y, idealTiles);
		if (tile.z >= minLevel && (tile.z > maxLevel || coverOk || outOfView)) {
			return LODAction.remove;
		}
	}

	return LODAction.none;
}

/**
 * Load the children tile from coordinate
 * @param _loader tile loader instance
 * @param px parent tile x coordinate
 * @param py parent tile y coordinate
 * @param pz parent tile level
 * @returns children tile array
 */
export function createChildren(_loader: ICompositeLoader, px: number, py: number, pz: number): Tile[] {
	const children: Tile[] = [];
	const level = pz + 1;
	const x = px * 2;
	const z = 0;
	const pos = 0.25;
	// Two children at level 0 when 4326 projection
	// const isWGS = loader.imgSource[0].projectionID === "4326";
	const isWGS = false;
	if (pz === 0 && isWGS) {
		const y = py;
		const scale = new Vector3(0.5, 1.0, 1.0);
		const t1 = new Tile(x, y, level);
		const t2 = new Tile(x, y, level);
		t1.position.set(-pos, 0, z);
		t1.scale.copy(scale);
		t2.position.set(pos, 0, z);
		t2.scale.copy(scale);
		children.push(t1, t2);
	} else {
		const y = py * 2;
		const scale = new Vector3(0.5, 0.5, 1.0);
		const t1 = new Tile(x, y, level);
		const t2 = new Tile(x + 1, y, level);
		const t3 = new Tile(x, y + 1, level);
		const t4 = new Tile(x + 1, y + 1, level);
		t1.position.set(-pos, pos, z);
		t1.scale.copy(scale);
		t2.position.set(pos, pos, z);
		t2.scale.copy(scale);
		t3.position.set(-pos, -pos, z);
		t3.scale.copy(scale);
		t4.position.set(pos, -pos, z);
		t4.scale.copy(scale);
		children.push(t1, t2, t3, t4);
	}

	return children;
}
