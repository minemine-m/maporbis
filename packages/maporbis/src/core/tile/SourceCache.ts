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
	idealCount: number;
	idealLoaded: number;
	idealCovered: number;
	retainCount: number;
};

/**
 * Per-layer tile retain set (Mapbox SourceCache-style).
 * Ideal cover drives load priority + show/hide; missing ideals keep loaded ancestors.
 *
 * 独立 SourceCache：理想集驱动加载与显隐；未就绪的 ideal 用已加载祖先覆盖。
 */
export class TileSourceCache {
	private _ideal: IdealTileSet | null = null;
	private _idealKeys = new Set<string>();
	private _retainKeys = new Set<string>();
	private _coveringZoom = 0;
	private _snapshot: SourceCacheSnapshot = {
		coveringZoom: 0,
		ideal: null,
		idealKeys: new Set(),
		retainKeys: new Set(),
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

	get ideal(): IdealTileSet | null {
		return this._ideal;
	}

	get coveringZoom(): number {
		return this._coveringZoom;
	}

	get snapshot(): SourceCacheSnapshot {
		return this._snapshot;
	}

	/**
	 * Recompute ideal set + retain set, request missing ideal tiles, apply visibility.
	 */
	update(ctx: SourceCacheUpdateContext): SourceCacheSnapshot {
		this._coveringZoom = computeCoveringZoomLevel(
			ctx.cameraDistance,
			ctx.viewportHeight,
			ctx.mapWidth,
			256,
			ctx.fovDeg
		);

		// Prefer real frustum DFS when a full camera is available; AABB fallback for stubs.
		const cam = ctx.camera as PerspectiveCamera;
		const camDistOk = Number.isFinite(ctx.cameraDistance) && ctx.cameraDistance > 1;
		if (cam && cam.isPerspectiveCamera && ctx.mapWidth > 0 && camDistOk) {
			// Root matrix includes map scale + group rotation (XZ ground, Y up)
			ctx.root.updateMatrixWorld(true);
			this._ideal = computeCoveringTilesDFS({
				coveringZoom: this._coveringZoom,
				camera: cam,
				mapWidth: ctx.mapWidth,
				mapHeight: ctx.mapHeight,
				minLevel: ctx.minLevel,
				maxLevel: ctx.maxLevel,
				tileSize: 256,
				// Pitch: far tiles stop at lower z (Mapbox distance split)
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

		const loadedKeys = new Set<string>();
		const byKey = new Map<string, Tile>();
		ctx.root.traverse((t) => {
			if (!t.isTile) return;
			const key = `${t.z}/${t.x}/${t.y}`;
			byKey.set(key, t);
			if (t.loaded) loadedKeys.add(key);
		});

		// Retain: every ideal key + every loaded ancestor used as cover
		const retain = new Set<string>(this._idealKeys);
		for (const key of this._idealKeys) {
			const [z, x, y] = key.split("/").map(Number);
			if (loadedKeys.has(key)) continue;
			if (!hasLoadedCover(loadedKeys, z, x, y)) continue;
			let cz = z, cx = x, cy = y;
			while (cz > 0) {
				cx >>= 1;
				cy >>= 1;
				cz--;
				const ancKey = `${cz}/${cx}/${cy}`;
				if (loadedKeys.has(ancKey)) {
					retain.add(ancKey);
					break;
				}
			}
		}
		this._retainKeys = retain;

		// Visibility: show retained loaded tiles; hide others
		ctx.root.traverse((t) => {
			if (!t.isTile) return;
			const key = `${t.z}/${t.x}/${t.y}`;
			if (retain.has(key) && t.loaded) {
				t.showing = true;
			} else if (t.z >= ctx.minLevel && !this._isRetainCover(t, retain)) {
				// leave leaf show logic to _checkVisibility; only force-hide non-retain deep tiles
				// (avoid fighting parent cover)
			}
		});

		// Request missing ideal (and cover ancestors) via existing enqueue path
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
			idealCount: this._idealKeys.size,
			idealLoaded,
			idealCovered,
			retainCount: this._retainKeys.size,
		};
		return this._snapshot;
	}

	private _isRetainCover(tile: Tile, retain: Set<string>): boolean {
		// Keep showing if this tile is on the path from ideal up through loaded ancestors
		const key = `${tile.z}/${tile.x}/${tile.y}`;
		return retain.has(key);
	}
}
