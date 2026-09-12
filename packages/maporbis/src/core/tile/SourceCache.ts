import { Camera, PerspectiveCamera, Vector3 } from "three";
import { Tile } from "./Tile";
import { ICompositeLoader } from "../../loaders";
import {
	IdealTileSet,
	computeCoveringZoomLevel,
	computeIdealTileSet,
	countIdealCovered,
	hasLoadedCover,
} from "./util";
import { computeCoveringTilesDFS } from "./coveringTiles";

/** Mapbox SourceCache.maxOverzooming / maxUnderzooming */
const MAX_OVERZOOMING = 10;
const MAX_UNDERZOOMING = 3;

export type SourceCacheUpdateContext = {
	root: Tile;
	camera: Camera;
	loader: ICompositeLoader;
	mapWidth: number;
	mapHeight: number;
	viewportWidth: number;
	viewportHeight: number;
	lookAtProjected: { x: number; y: number };
	cameraDistance: number;
	fovDeg: number;
	minLevel: number;
	maxLevel: number;
	interacting: boolean;
};

export type SourceCacheSnapshot = {
	coveringZoom: number;
	ideal: IdealTileSet | null;
	idealKeys: Set<string>;
	retainKeys: Set<string>;
	coveredKeys: Set<string>;
	idealCount: number;
	idealLoaded: number;
	idealCovered: number;
	retainCount: number;
};

function parseKey(key: string): [number, number, number] {
	const p = key.split("/");
	return [+p[0], +p[1], +p[2]];
}

function keyOf(z: number, x: number, y: number): string {
	return `${z}/${x}/${y}`;
}

function parentKeyOf(key: string): string | null {
	const [z, x, y] = parseKey(key);
	if (z <= 0) return null;
	return keyOf(z - 1, x >> 1, y >> 1);
}

function childKeysOf(key: string): string[] {
	const [z, x, y] = parseKey(key);
	const cz = z + 1;
	const cx = x << 1;
	const cy = y << 1;
	return [
		keyOf(cz, cx, cy),
		keyOf(cz, cx + 1, cy),
		keyOf(cz, cx, cy + 1),
		keyOf(cz, cx + 1, cy + 1),
	];
}

/**
 * Mapbox SourceCache._updateRetainedTiles (z/x/y string keys).
 * retain = ideals + loaded children that cover missing ideals + loaded ancestors.
 */
function updateRetainedTiles(
	idealKeys: ReadonlySet<string>,
	byKey: Map<string, Tile>,
	loadedKeys: ReadonlySet<string>,
	minLevel: number
): Set<string> {
	const retain = new Set<string>();
	if (idealKeys.size === 0) return retain;

	let minZoom = Infinity;
	let maxZoom = -Infinity;
	for (const k of idealKeys) {
		const z = parseKey(k)[0];
		if (z < minZoom) minZoom = z;
		if (z > maxZoom) maxZoom = z;
	}

	const minCoveringZoom = Math.max(maxZoom - MAX_OVERZOOMING, minLevel);
	const maxCoveringZoom = Math.max(maxZoom + MAX_UNDERZOOMING, minLevel);

	const missing = new Set<string>();
	for (const id of idealKeys) {
		retain.add(id);
		if (!loadedKeys.has(id)) missing.add(id);
	}

	// _retainLoadedChildren: keep topmost loaded child under a missing ideal
	for (const [key, tile] of byKey) {
		if (retain.has(key) || !tile.loaded) continue;
		if (tile.z <= minZoom || tile.z > maxCoveringZoom) continue;

		// walk up to the topmost loaded tile at z > minZoom
		let topKey = key;
		let cur: Tile | undefined = tile;
		while (cur && cur.z > minZoom + 1) {
			const pk = parentKeyOf(topKey);
			if (!pk) break;
			const parent = byKey.get(pk);
			if (parent?.loaded) {
				topKey = pk;
				cur = parent;
			} else {
				const [tz, tx, ty] = parseKey(topKey);
				// continue ascent using coordinates even if parent node missing
				const zk = keyOf(tz - 1, tx >> 1, ty >> 1);
				const anc = byKey.get(zk);
				if (anc?.loaded) {
					topKey = zk;
					cur = anc;
				} else {
					break;
				}
			}
		}

		// does any ancestor of topKey need this child (is a missing ideal)?
		const [tz, tx, ty] = parseKey(topKey);
		let z = tz;
		let x = tx;
		let y = ty;
		let needed = false;
		while (z > minZoom) {
			z--;
			x >>= 1;
			y >>= 1;
			if (missing.has(keyOf(z, x, y))) {
				needed = true;
				break;
			}
		}
		if (needed) retain.add(topKey);
	}

	// For each missing ideal: children cover or parent ascent
	for (const id of idealKeys) {
		if (loadedKeys.has(id)) continue;
		const kids = childKeysOf(id);
		if (kids.length === 4 && kids.every((k) => retain.has(k))) {
			continue; // covered by children
		}

		const [z0, x0, y0] = parseKey(id);
		let x = x0;
		let y = y0;
		let parentWasRequested = byKey.get(id)?.state === "loading" || byKey.get(id)?.loaded;
		// wasRequested ≈ tile exists in tree (already asked or loading/loaded/error)
		const idealTile = byKey.get(id);
		parentWasRequested = !!idealTile && idealTile.state !== "idle";

		const checked = new Set<string>();
		for (let pz = z0 - 1; pz >= minCoveringZoom; --pz) {
			x >>= 1;
			y >>= 1;
			const pk = keyOf(pz, x, y);
			if (checked.has(pk)) break;
			checked.add(pk);

			let t = byKey.get(pk);
			if (!t && parentWasRequested) {
				// parent path was already asked — do not invent nodes here;
				// tree LOD will create them. Still retain the key for priority.
				retain.add(pk);
				parentWasRequested = true;
				continue;
			}
			if (t) {
				retain.add(pk);
				parentWasRequested = t.state !== "idle";
				if (t.loaded) break;
			}
		}
	}

	return retain;
}

/**
 * Parent fully covered by four retained+loaded children → do not draw parent.
 * Mapbox `_coveredTiles`.
 */
function computeCovered(
	retain: ReadonlySet<string>,
	loadedKeys: ReadonlySet<string>
): Set<string> {
	const covered = new Set<string>();
	for (const key of retain) {
		const kids = childKeysOf(key);
		if (kids.every((k) => retain.has(k) && loadedKeys.has(k))) {
			covered.add(key);
		}
	}
	return covered;
}

/**
 * Mapbox SourceCache: ideal cover → retain → covered → visibility + loads.
 * Visibility rule is ONLY: retain && loaded && !covered.
 */
export class TileSourceCache {
	private _ideal: IdealTileSet | null = null;
	private _idealKeys = new Set<string>();
	private _retainKeys = new Set<string>();
	private _coveredKeys = new Set<string>();
	private _coveringZoom = 0;
	private _snapshot: SourceCacheSnapshot = {
		coveringZoom: 0,
		ideal: null,
		idealKeys: new Set(),
		retainKeys: new Set(),
		coveredKeys: new Set(),
		idealCount: 0,
		idealLoaded: 0,
		idealCovered: 0,
		retainCount: 0,
	};

	get idealKeys(): ReadonlySet<string> {
		return this._idealKeys;
	}

	get retainKeys(): ReadonlySet<string> {
		return this._retainKeys;
	}

	get coveredKeys(): ReadonlySet<string> {
		return this._coveredKeys;
	}

	get ideal(): IdealTileSet | null {
		return this._ideal;
	}

	get coveringZoom(): number {
		return this._coveringZoom;
	}

	get snapshot(): SourceCacheSnapshot {
		return this._snapshot;
	}

	update(ctx: SourceCacheUpdateContext): SourceCacheSnapshot {
		this._coveringZoom = computeCoveringZoomLevel(
			ctx.cameraDistance,
			ctx.viewportHeight,
			ctx.mapWidth,
			256,
			ctx.fovDeg
		);

		const cam = ctx.camera as PerspectiveCamera;
		const camDistOk = Number.isFinite(ctx.cameraDistance) && ctx.cameraDistance > 1;
		if (cam && cam.isPerspectiveCamera && ctx.mapWidth > 0 && camDistOk) {
			ctx.root.updateMatrixWorld(true);
			this._ideal = computeCoveringTilesDFS({
				coveringZoom: this._coveringZoom,
				camera: cam,
				mapWidth: ctx.mapWidth,
				mapHeight: ctx.mapHeight,
				minLevel: ctx.minLevel,
				maxLevel: ctx.maxLevel,
				tileSize: 256,
				// Uniform z — mixed-z distance LOD made sharp/blur patches
				useDistanceLod: false,
				cameraToCenterDistance: ctx.cameraDistance,
				rootWorldMatrix: ctx.root.matrixWorld,
			});
		} else {
			this._ideal = computeIdealTileSet(
				this._coveringZoom,
				ctx.lookAtProjected,
				ctx.mapWidth,
				ctx.mapHeight,
				ctx.viewportWidth,
				ctx.viewportHeight,
				ctx.cameraDistance,
				ctx.fovDeg,
				ctx.minLevel,
				ctx.maxLevel
			);
		}
		this._idealKeys = this._ideal ? new Set(this._ideal.keys) : new Set();

		const loadedKeys = new Set<string>();
		const byKey = new Map<string, Tile>();
		ctx.root.traverse((t) => {
			if (!t.isTile) return;
			const key = keyOf(t.z, t.x, t.y);
			byKey.set(key, t);
			if (t.loaded) loadedKeys.add(key);
		});

		this._retainKeys = updateRetainedTiles(
			this._idealKeys,
			byKey,
			loadedKeys,
			ctx.minLevel
		);
		this._coveredKeys = computeCovered(this._retainKeys, loadedKeys);

		// Sole visibility rule (Mapbox painter: draw retain tiles with data, skip covered)
		ctx.root.traverse((t) => {
			if (!t.isTile) return;
			const key = keyOf(t.z, t.x, t.y);
			const show =
				this._retainKeys.has(key) && t.loaded && !this._coveredKeys.has(key);
			t.showing = show;
		});

		// Load missing ideals (tree nodes that already exist)
		for (const key of this._idealKeys) {
			if (loadedKeys.has(key)) continue;
			const tile = byKey.get(key);
			if (tile && !tile.loaded) {
				Tile.requestLoad(tile, ctx.loader, this._idealKeys);
			}
		}

		let idealLoaded = 0;
		for (const key of this._idealKeys) {
			if (loadedKeys.has(key)) idealLoaded++;
		}
		const idealCovered = countIdealCovered(
			this._ideal ? this._ideal.keys : [],
			loadedKeys
		);

		this._snapshot = {
			coveringZoom: this._coveringZoom,
			ideal: this._ideal,
			idealKeys: this._idealKeys,
			retainKeys: this._retainKeys,
			coveredKeys: this._coveredKeys,
			idealCount: this._idealKeys.size,
			idealLoaded,
			idealCovered,
			retainCount: this._retainKeys.size,
		};
		return this._snapshot;
	}
}
