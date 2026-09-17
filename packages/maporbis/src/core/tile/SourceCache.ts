import { Camera, PerspectiveCamera, Vector3 } from "three";
import { Tile, TileState } from "./Tile";
import { TileLoadScheduler } from "./TileLoadScheduler";
import { ICompositeLoader } from "../../loaders";
import {
	IdealTileSet,
	computeCoveringZoomLevel,
	computeIdealTileSet,
	countIdealCovered,
	hasLoadedCover,
} from "./util";
import { computeCoveringTilesDFS } from "./coveringTiles";

const _camWorldPos = new Vector3();
const _tileWorldPos = new Vector3();

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
	/** Loaded tiles without render payload after recover — must stay 0 (I6). */
	emptyLoaded: number;
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
 * Mapbox _addTile: create the (z,x,y) node if missing.
 * Flat PR-4 redo: tile is a direct child of root with setTileTransform
 * (no createChildren sibling quads, no hierarchical ±0.25 chain).
 */
function ensureTilePath(
	root: Tile,
	z: number,
	x: number,
	y: number,
	loader: ICompositeLoader
): Tile | null {
	if (!root?.isTile) return null;
	if (z <= 0) return root;

	const existing = root.children.find(
		(c: any) => c?.isTile && c.z === z && c.x === x && c.y === y
	) as Tile | undefined;
	if (existing) return existing;

	const tile = new Tile(x, y, z);
	tile.setTileTransform(z, x, y);
	root.add(tile);
	(tile as any)._initTile?.();
	(tile as any).inFrustum = (root as any).inFrustum;
	if (!(tile as any)._onLoadComplete) {
		const forEvent = root;
		(tile as any)._onLoadComplete = () => {
			forEvent.dispatchEvent({ type: "tile-loaded", tile });
		};
	}
	root.dispatchEvent({ type: "tile-created", tile });
	return tile;
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

	// Missing ideal: immediate parent (network underlay) + nearest already-loaded
	// ancestor (paint underlay). No multi-level warm-up of unloaded nodes.
	for (const id of idealKeys) {
		if (loadedKeys.has(id)) continue;
		const kids = childKeysOf(id);
		if (kids.length === 4 && kids.every((k) => retain.has(k))) {
			continue; // covered by children
		}

		const [z0, x0, y0] = parseKey(id);
		const minAncZ = Math.max(minLevel, z0 - MAX_UNDERZOOMING);
		for (let pz = z0 - 1; pz >= minAncZ; pz--) {
			const s = z0 - pz;
			const pk = keyOf(pz, x0 >> s, y0 >> s);
			if (loadedKeys.has(pk)) {
				retain.add(pk);
				break;
			}
			if (pz === z0 - 1) retain.add(pk);
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
 *
 * Storage is a flat key→Tile map (`_tiles`), like Mapbox `_tiles`. The scene
 * graph still holds hierarchy/transforms; this map is the O(1) schedule index.
 */
export class TileSourceCache {
	private _ideal: IdealTileSet | null = null;
	private _idealKeys = new Set<string>();
	private _retainKeys = new Set<string>();
	private _coveredKeys = new Set<string>();
	private _coveringZoom = 0;
	/** Flat schedule index (Mapbox `_tiles`). Scene tree remains for LOD/transforms. */
	private _tiles = new Map<string, Tile>();
	private _root: Tile | null = null;
	private _dirty = false;
	private _lastCtx: SourceCacheUpdateContext | null = null;
	/** Live driver (TileLayer) rebuilds transform ctx and calls update — avoids stale cameraDistance. */
	private _onDirty: (() => void) | null = null;
	/** True while update() runs — prevents nested update from cache-hit tile-loaded. */
	private _inUpdate = false;
	/** Log showing flips written by this cache (sole writer). */
	static traceVisibility = false;
	private readonly _onTileCreated = (e: any) => {
		const t = e?.tile as Tile | undefined;
		if (t?.isTile) this._register(t);
	};
	private readonly _onTileUnload = (e: any) => {
		const t = e?.tile as Tile | undefined;
		if (t?.isTile) this._tiles.delete(keyOf(t.z, t.x, t.y));
	};
	private readonly _onTileLoaded = (_e: any) => {
		this.markDirty();
		// Always defer: cache-hit path fires tile-loaded synchronously inside
		// update()'s load phase; a sync driver would nest a full update.
		queueMicrotask(() => {
			if (this._onDirty) this._onDirty();
			else this.updateIfDirty();
		});
	};
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
		emptyLoaded: 0,
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

	/** Flat tile registry size (debug / stats). */
	get tileCount(): number {
		return this._tiles.size;
	}

	getTile(key: string): Tile | undefined {
		return this._tiles.get(key);
	}

	private _register(tile: Tile): void {
		if (!tile?.isTile) return;
		this._tiles.set(keyOf(tile.z, tile.x, tile.y), tile);
	}

	/** Bind root once; seed from existing tree; listen for LOD creates. */
	private _bindRoot(root: Tile): void {
		if (this._root === root) return;
		if (this._root) {
			this._root.removeEventListener("tile-created", this._onTileCreated);
			this._root.removeEventListener("tile-unload", this._onTileUnload);
			this._root.removeEventListener("tile-loaded", this._onTileLoaded);
		}
		this._root = root;
		this._tiles.clear();
		if (!root?.isTile) return;
		root.addEventListener("tile-created", this._onTileCreated);
		root.addEventListener("tile-unload", this._onTileUnload);
		root.addEventListener("tile-loaded", this._onTileLoaded);
		root.traverse((t) => {
			if (t.isTile) this._register(t);
		});
	}

	/**
	 * Load completion (or other cache-affecting change) must re-run update
	 * so showing is decided solely here — never flipped in Tile._loadData.
	 */
	markDirty(): void {
		this._dirty = true;
	}

	/** Attach a live update driver so dirty runs rebuild transform from the camera. */
	setOnDirty(cb: (() => void) | null): void {
		this._onDirty = cb;
	}

	get dirty(): boolean {
		return this._dirty;
	}

	/**
	 * Re-run the last update when dirty. Prefer setOnDirty from TileLayer so
	 * cameraDistance/lookAt/viewport are fresh; this fallback may use stale fields.
	 */
	updateIfDirty(): boolean {
		if (!this._dirty || !this._lastCtx) return false;
		this.update(this._lastCtx);
		return true;
	}

	private _setShowing(tile: Tile, show: boolean, label: string): void {
		if (tile.showing === show) return;
		if (TileSourceCache.traceVisibility) {
			const key = keyOf(tile.z, tile.x, tile.y);
			console.log(
				`[SC:vis] ${key} showing ${tile.showing}→${show} by ${label}`
			);
		}
		tile.showing = show;
	}

	/**
	 * Drop entries whose scene node was cleared (LOD remove → Object3D.clear).
	 * Children do not fire tile-unload; parent does.
	 */
	private _pruneDetached(): void {
		for (const [key, tile] of this._tiles) {
			if (!tile?.isTile) {
				this._tiles.delete(key);
				continue;
			}
			if (tile.z === 0) continue;
			const p = tile.parent as any;
			if (!p || !p.isTile) this._tiles.delete(key);
		}
	}

	/**
	 * Re-register any scene tile missing from the flat map.
	 * LOD create / ensureTilePath can add nodes that never got a
	 * tile-created callback — SourceCache then could not show or load them.
	 */
	private _resyncFromTree(root: Tile): void {
		if (!root?.isTile) return;
		root.traverse((t) => {
			if (!t.isTile) return;
			const key = keyOf(t.z, t.x, t.y);
			if (this._tiles.get(key) !== t) this._tiles.set(key, t);
		});
		this._pruneDetached();
	}

	update(ctx: SourceCacheUpdateContext): SourceCacheSnapshot {
		if (this._inUpdate) {
			// Re-entrant call (e.g. sync dirty driver mid load): mark and return current snapshot.
			this._dirty = true;
			return this._snapshot;
		}
		this._inUpdate = true;
		try {
			return this._updateInner(ctx);
		} finally {
			this._inUpdate = false;
		}
	}

	private _updateInner(ctx: SourceCacheUpdateContext): SourceCacheSnapshot {
		this._bindRoot(ctx.root);
		this._lastCtx = ctx;
		this._dirty = false;
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
				// Pitched distance LOD (Mapbox): near tiles at targetZ, far/skyline
				// step down. Top-down is forced uniform inside computeCoveringTilesDFS.
				useDistanceLod: true,
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

		// Mapbox _addTile: ideal keys must exist as tree nodes before load/retain
		if (this._idealKeys.size > 0) {
			for (const key of this._idealKeys) {
				const [z, x, y] = parseKey(key);
				if (z < ctx.minLevel || z > ctx.maxLevel) continue;
				ensureTilePath(ctx.root, z, x, y, ctx.loader);
			}
		}

		this._pruneDetached();
		this._resyncFromTree(ctx.root);

		const byKey = this._tiles;
		// Recover "Loaded but nothing to draw" tiles — they would be counted
		// as coverage and leave a skybox hole. Force Unloaded so they reload.
		for (const tile of byKey.values()) {
			if (tile.loaded && !tile.hasRenderPayload()) {
				(tile as any)._transitionTo(TileState.Unloaded);
			}
		}
		let emptyLoaded = 0;
		for (const tile of byKey.values()) {
			if (tile.loaded && !tile.hasRenderPayload()) emptyLoaded++;
		}
		const loadedKeys = new Set<string>();
		for (const [key, tile] of byKey) {
			if (tile.loaded) loadedKeys.add(key);
		}

		this._retainKeys = updateRetainedTiles(
			this._idealKeys,
			byKey,
			loadedKeys,
			ctx.minLevel
		);

		// SourceCache mode never runs rootTile.update — write distToCamera here
		// so load priority can be center-first within the ideal set.
		{
			ctx.camera.getWorldPosition(_camWorldPos);
			for (const key of this._idealKeys) {
				const tile = byKey.get(key);
				if (!tile) continue;
				tile.getWorldPosition(_tileWorldPos);
				tile.distToCamera = _tileWorldPos.distanceTo(_camWorldPos);
			}
			for (const key of this._retainKeys) {
				if (this._idealKeys.has(key)) continue;
				const tile = byKey.get(key);
				if (!tile) continue;
				tile.getWorldPosition(_tileWorldPos);
				tile.distToCamera = _tileWorldPos.distanceTo(_camWorldPos);
			}
		}

		this._coveredKeys = computeCovered(this._retainKeys, loadedKeys);

		// Sole visibility rule (Mapbox painter: draw retain tiles with data, skip covered)
		for (const [key, tile] of byKey) {
			const show =
				this._retainKeys.has(key) && tile.loaded && !this._coveredKeys.has(key);
			this._setShowing(tile, show, "SourceCache.update");
		}

		// Sticky underlay: only the nearest loaded ancestor of each missing ideal,
		// and only if that ancestor is retained (sole rule: retain ∧ loaded ∧ ¬covered).
		// Do not replay the previous frame's entire showing set.
		let idealReady = 0;
		for (const key of this._idealKeys) {
			if (loadedKeys.has(key)) idealReady++;
		}
		const coverageIncomplete =
			this._idealKeys.size > 0 && idealReady < this._idealKeys.size;
		if (coverageIncomplete) {
			const targetZ = this._ideal ? this._ideal.z : 0;
			const minUnderlayZ = Math.max(ctx.minLevel, targetZ - 3);
			for (const key of this._idealKeys) {
				if (loadedKeys.has(key)) continue;
				const [iz, ix, iy] = parseKey(key);
				for (let z = iz - 1; z >= minUnderlayZ; z--) {
					const s = iz - z;
					const pk = keyOf(z, ix >> s, iy >> s);
					const anc = byKey.get(pk);
					if (
						anc &&
						anc.loaded &&
						this._retainKeys.has(pk) &&
						!this._coveredKeys.has(pk)
					) {
						this._setShowing(anc, true, "sticky-ancestor");
						break;
					}
				}
			}
		}

		// Covered parents must stay hidden (Mapbox _coveredTiles). Single write funnel.
		for (const key of this._coveredKeys) {
			const tile = byKey.get(key);
			if (tile) this._setShowing(tile, false, "covered");
		}

		// Settled uniform-z only: when every ideal key shares one z (top-down /
		// no distance LOD). Mixed-z pitch ideals must keep showing all levels.
		if (this._ideal && Number.isFinite(this._ideal.z) && !coverageIncomplete) {
			let minZ = Infinity;
			let maxZ = -Infinity;
			for (const key of this._idealKeys) {
				const z = parseKey(key)[0];
				if (z < minZ) minZ = z;
				if (z > maxZ) maxZ = z;
			}
			const uniformZ = minZ === maxZ;
			if (uniformZ) {
				const targetZ = maxZ;
				for (const [key, tile] of byKey) {
					if (tile.showing && parseKey(key)[0] !== targetZ) {
						this._setShowing(tile, false, "settle-single-z");
					}
				}
			}
		}

		// PR-2 release: ∉ retain and ∉ structural ideal-path → shallow unload.
		// Flat PR-4: tiles are root children; hasTileChild is always false for z>0.
		// Deepest first.
		{
			const structural = new Set<string>();
			for (const key of this._idealKeys) {
				const [z0, x0, y0] = parseKey(key);
				for (let z = 0; z <= z0; z++) {
					const s = z0 - z;
					structural.add(keyOf(z, x0 >> s, y0 >> s));
				}
			}
			// Never drop the scene root
			if (ctx.root?.isTile) {
				structural.add(keyOf(ctx.root.z, ctx.root.x, ctx.root.y));
			}
			const toRelease: Tile[] = [];
			for (const [key, tile] of byKey) {
				if (this._retainKeys.has(key)) continue;
				if (structural.has(key)) continue;
				// Incomplete coverage: keep loaded payloads as underlay continuity.
				// Release only empty shells so zoom/pitch does not punch holes.
				if (coverageIncomplete && tile.loaded) continue;
				toRelease.push(tile);
			}
			toRelease.sort((a, b) => b.z - a.z);
			for (const tile of toRelease) {
				const key = keyOf(tile.z, tile.x, tile.y);
				if (this._retainKeys.has(key) || structural.has(key)) continue;
				if (coverageIncomplete && tile.loaded) continue;
				this._setShowing(tile, false, "release");
				tile.releasePayloadForCache(ctx.loader);
				const hasTileChild = tile.children.some((c: any) => c?.isTile);
				if (!hasTileChild && tile.parent) {
					tile.parent.remove(tile);
					byKey.delete(key);
					if (this._root) {
						this._root.dispatchEvent({ type: "tile-unload", tile });
					}
				}
				// Parent shell with children: keep in map for resync/transforms
			}
		}

		// Load missing ideals AND retained cover tiles (Mapbox loads the
		// whole retain set so ancestors form a basemap while children fetch).
		const toLoad: { key: string; ideal: boolean }[] = [];
		for (const key of this._idealKeys) {
			if (!loadedKeys.has(key)) toLoad.push({ key, ideal: true });
		}
		for (const key of this._retainKeys) {
			if (loadedKeys.has(key) || this._idealKeys.has(key)) continue;
			toLoad.push({ key, ideal: false });
		}
		toLoad.sort((a, b) => (a.ideal === b.ideal ? 0 : a.ideal ? -1 : 1));
		const maxCoverLoads = 48;
		let coverQueued = 0;
		for (const { key, ideal } of toLoad) {
			if (!ideal) {
				if (coverQueued >= maxCoverLoads) continue;
				coverQueued++;
			}
			const [z, x, y] = parseKey(key);
			if (z < ctx.minLevel || z > ctx.maxLevel) continue;
			ensureTilePath(ctx.root, z, x, y, ctx.loader);
			const tile = this._tiles.get(key);
			if (tile && !tile.loaded) {
				// SourceCache no longer runs LOD frustum tests. Mark needed
				// tiles so prune does not drop parent-underlay jobs.
				(tile as any).inFrustum = true;
				TileLoadScheduler.enqueue(tile, ctx.loader, this._idealKeys);
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
			emptyLoaded,
		};
		return this._snapshot;
	}
}
