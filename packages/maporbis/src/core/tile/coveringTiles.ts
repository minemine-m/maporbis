import { Box3, Camera, Frustum, Matrix4, PerspectiveCamera, Vector3 } from "three";
import { IdealTileSet } from "./util";

export type CoveringTilesDfsOptions = {
	/** Already-computed covering zoom (float). Floored and clamped to [minLevel, maxLevel]. */
	coveringZoom: number;
	camera: Camera;
	mapWidth: number;
	mapHeight: number;
	minLevel: number;
	maxLevel: number;
	/**
	 * Root tile world matrix (includes map scale + any group rotation).
	 * Tile local space is centered XY in [-0.5,0.5], Z in [0,1].
	 */
	rootWorldMatrix?: Matrix4;
	/** Standard XYZ tile pixel size (256). Used for distance-based early stop. */
	tileSize?: number;
	/** Local Z range of the ground slab (before root matrix). */
	minLocalZ?: number;
	maxLocalZ?: number;
	/**
	 * Mapbox-style distance LOD: stop refining tiles whose AABB is farther
	 * than (1 << (targetZ - z)) * (camDist / tileSize). Off = uniform z.
	 */
	useDistanceLod?: boolean;
	/** Camera → look-at distance; required when useDistanceLod. */
	cameraToCenterDistance?: number;
};

type StackNode = {
	z: number;
	x: number;
	y: number;
	fullyVisible: boolean;
};

const _frustum = new Frustum();
const _projView = new Matrix4();
const _box = new Box3();
const _camPos = new Vector3();
const _fwd = new Vector3();
const _corner = new Vector3();
const _identity = new Matrix4();

/**
 * World AABB for XYZ tile.
 * Local: x/y in [-0.5,0.5] (tile Y south), then rootWorldMatrix.
 * 默认无矩阵时按「XY 平面、Y 北向」的世界系（单测用）。
 */
export function tileWorldBounds(
	z: number,
	x: number,
	y: number,
	mapWidth: number,
	mapHeight: number,
	minLocalZ = 0,
	maxLocalZ = 1,
	rootWorldMatrix?: Matrix4
): Box3 {
	const n = Math.pow(2, z);
	// Root-local (pre-scale) tile box: root covers [-0.5,0.5]^2, scale applied by matrix
	const lx0 = x / n - 0.5;
	const lx1 = (x + 1) / n - 0.5;
	// Tile Y increases south; local +Y is north (matches createChildren).
	const ly0 = 0.5 - (y + 1) / n;
	const ly1 = 0.5 - y / n;

	if (!rootWorldMatrix) {
		// Fallback: treat as already world-sized centered XY plane (tests)
		const x0 = (x / n - 0.5) * mapWidth;
		const x1 = ((x + 1) / n - 0.5) * mapWidth;
		const y1 = (0.5 - y / n) * mapHeight;
		const y0 = (0.5 - (y + 1) / n) * mapHeight;
		return new Box3(new Vector3(x0, y0, minLocalZ), new Vector3(x1, y1, maxLocalZ));
	}

	const box = new Box3(
		new Vector3(lx0, ly0, minLocalZ),
		new Vector3(lx1, ly1, maxLocalZ)
	);
	// Transform 8 corners (scale/rotation on root)
	const min = new Vector3(Infinity, Infinity, Infinity);
	const max = new Vector3(-Infinity, -Infinity, -Infinity);
	for (let i = 0; i < 8; i++) {
		_corner.set(
			i & 1 ? box.max.x : box.min.x,
			i & 2 ? box.max.y : box.min.y,
			i & 4 ? box.max.z : box.min.z
		);
		_corner.applyMatrix4(rootWorldMatrix);
		min.min(_corner);
		max.max(_corner);
	}
	return new Box3(min, max);
}

/**
 * 0 = outside, 1 = partial, 2 = fully inside.
 * Three.js plane: distance = n·p + constant; positive is inside.
 */
function classifyBox(frustum: Frustum, box: Box3): 0 | 1 | 2 {
	let inside = true;
	const p = new Vector3();
	for (let i = 0; i < 6; i++) {
		const plane = frustum.planes[i];
		const n = plane.normal;
		p.set(
			n.x > 0 ? box.max.x : box.min.x,
			n.y > 0 ? box.max.y : box.min.y,
			n.z > 0 ? box.max.z : box.min.z
		);
		if (plane.distanceToPoint(p) < 0) return 0;
		p.set(
			n.x > 0 ? box.min.x : box.max.x,
			n.y > 0 ? box.min.y : box.max.y,
			n.z > 0 ? box.min.z : box.max.z
		);
		if (plane.distanceToPoint(p) < 0) inside = false;
	}
	return inside ? 2 : 1;
}

function closestAabbDistanceSq(box: Box3, point: Vector3): number {
	const dx = Math.max(box.min.x - point.x, 0, point.x - box.max.x);
	const dy = Math.max(box.min.y - point.y, 0, point.y - box.max.y);
	const dz = Math.max(box.min.z - point.z, 0, point.z - box.max.z);
	return dx * dx + dy * dy + dz * dz;
}

/**
 * Mapbox-style DFS covering tiles: start at root, refine while the tile
 * intersects the camera frustum and needs more detail.
 *
 * 与 look-at AABB 不同：只收集真正与视锥相交的瓦片，pitch 时边缘不过度拉取。
 */
export function computeCoveringTilesDFS(opts: CoveringTilesDfsOptions): IdealTileSet | null {
	const {
		coveringZoom,
		camera,
		mapWidth,
		mapHeight,
		minLevel,
		maxLevel,
		tileSize = 256,
		minLocalZ = 0,
		maxLocalZ = 1,
		useDistanceLod = false,
	} = opts;
	const rootM = opts.rootWorldMatrix ?? null;

	if (!Number.isFinite(coveringZoom)) return null;

	const targetZ = Math.min(Math.max(Math.floor(coveringZoom), minLevel), maxLevel);
	if (targetZ < 0) return null;

	camera.updateMatrixWorld();
	if ((camera as PerspectiveCamera).isPerspectiveCamera) {
		(camera as PerspectiveCamera).updateProjectionMatrix();
	}
	_projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
	_frustum.setFromProjectionMatrix(_projView);
	camera.getWorldPosition(_camPos);

	const camDist = opts.cameraToCenterDistance;
	camera.getWorldDirection(_fwd);
	// Near top-down (within ~20° of looking straight down): uniform z for the
	// whole viewport. Distance LOD only when the view is meaningfully pitched.
	const nearTopDown = _fwd.y < -0.94;
	const distLodOn =
		useDistanceLod && typeof camDist === "number" && camDist > 1 && !nearTopDown;

	/**
	 * Pitched-only distance split (top-down uses uniform z above):
	 *   distToSplit = (1 << (targetZ - z)) * camDist * 0.55
	 * Near look-at tiles (~camDist) refine to targetZ; far tiles (~1.3×+)
	 * step down. 0.502 Mapbox factor is for tile-space, not Euclidean world.
	 */
	const DIST_K = 0.55;
	const shouldSplit = (z: number, box: Box3): boolean => {
		if (z >= targetZ) return false;
		if (!distLodOn) return true;
		const distSq = closestAabbDistanceSq(box, _camPos);
		const distToSplit = (1 << (targetZ - z)) * camDist! * DIST_K;
		return distSq < distToSplit * distToSplit;
	};

	const keys: string[] = [];
	let minX = Infinity;
	let maxX = -Infinity;
	let minY = Infinity;
	let maxY = -Infinity;
	let resultZ: number | null = null;

	const stack: StackNode[] = [{ z: 0, x: 0, y: 0, fullyVisible: false }];
	const maxNodes = 1 << 16;
	let visited = 0;

	while (stack.length > 0) {
		if (++visited > maxNodes) break;
		const it = stack.pop()!;
		_box.copy(
			tileWorldBounds(
				it.z,
				it.x,
				it.y,
				mapWidth,
				mapHeight,
				minLocalZ,
				maxLocalZ,
				rootM ?? undefined
			)
		);

		let fullyVisible = it.fullyVisible;
		if (!fullyVisible) {
			const c = classifyBox(_frustum, _box);
			if (c === 0) continue;
			fullyVisible = c === 2;
		}

		if (!shouldSplit(it.z, _box)) {
			// Representative z = max (near-camera detail). Mixed under pitch distance LOD.
			if (resultZ === null || it.z > resultZ) resultZ = it.z;
			keys.push(`${it.z}/${it.x}/${it.y}`);
			if (it.x < minX) minX = it.x;
			if (it.x > maxX) maxX = it.x;
			if (it.y < minY) minY = it.y;
			if (it.y > maxY) maxY = it.y;
			continue;
		}

		const cz = it.z + 1;
		const cx = it.x << 1;
		const cy = it.y << 1;
		stack.push(
			{ z: cz, x: cx, y: cy, fullyVisible },
			{ z: cz, x: cx + 1, y: cy, fullyVisible },
			{ z: cz, x: cx, y: cy + 1, fullyVisible },
			{ z: cz, x: cx + 1, y: cy + 1, fullyVisible }
		);
	}

	if (keys.length === 0) return null;
	return {
		z: resultZ ?? targetZ,
		keys,
		minX,
		maxX,
		minY,
		maxY,
	};
}
