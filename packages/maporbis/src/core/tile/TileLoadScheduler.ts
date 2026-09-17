import type { ICompositeLoader } from "../../loaders";
import type { Tile } from "./Tile";
import type { IdealTileSet } from "./util";

type LoadJob = {
	tile: Tile;
	loader: ICompositeLoader;
	priority: number;
	idealTiles?: Set<string>;
};

/**
 * Global tile network-load scheduler (Mapbox-like request ordering).
 * Shared across raster + vector layers so base imagery is not starved.
 *
 * Owns: queue, concurrency, priority, prune, in-flight abort accounting.
 * Does not own: scene graph, showing, retain, payload application.
 */
export class TileLoadScheduler {
	private static _activeDownloads = 0;
	private static _maxConcurrentDownloads = 32;
	private static _interactingMaxConcurrentDownloads = 20;
	private static _interacting = false;
	private static _loadQueue: LoadJob[] = [];
	private static _loadingTiles = new Set<Tile>();
	private static _idealTiles: Set<string> = new Set();
	private static _idealTileSet: IdealTileSet | null = null;
	private static _idealLoadedCount = 0;
	private static _idealCoveredCount = 0;
	private static _coveringZoom = 0;
	private static _statAbortCount = 0;
	private static _statDeferCount = 0;
	private static _statEnterFrustumCount = 0;
	private static _statParentPrefetchCount = 0;
	private static _statRetainHoldCount = 0;
	private static _statRetainReleaseCount = 0;
	private static _statMaxQueue = 0;
	private static _statLoadedDistSum = 0;
	private static _statLoadedDistCount = 0;
	private static _statLoadedDistMin = Infinity;
	private static _statLoadedDistMax = 0;

	static debugSchedule = false;

	static get downloadThreads(): number {
		return TileLoadScheduler._activeDownloads;
	}

	static get maxConcurrentDownloads(): number {
		return TileLoadScheduler._maxConcurrentDownloads;
	}

	static set maxConcurrentDownloads(value: number) {
		TileLoadScheduler._maxConcurrentDownloads = Math.max(1, value);
	}

	static set interacting(value: boolean) {
		TileLoadScheduler._interacting = value;
	}

	static get interacting(): boolean {
		return TileLoadScheduler._interacting;
	}

	static get effectiveMaxConcurrentDownloads(): number {
		return TileLoadScheduler._interacting
			? Math.min(
					TileLoadScheduler._interactingMaxConcurrentDownloads,
					TileLoadScheduler._maxConcurrentDownloads
				)
			: TileLoadScheduler._maxConcurrentDownloads;
	}

	static get loadQueueSize(): number {
		return TileLoadScheduler._loadQueue.length;
	}

	static get coveringZoom(): number {
		return TileLoadScheduler._coveringZoom;
	}

	static set coveringZoom(value: number) {
		TileLoadScheduler._coveringZoom = value;
	}

	static get idealTileCount(): number {
		return TileLoadScheduler._idealTiles.size;
	}

	static get idealTileSet(): IdealTileSet | null {
		return TileLoadScheduler._idealTileSet;
	}

	static get idealLoadedCount(): number {
		return TileLoadScheduler._idealLoadedCount;
	}

	static setIdealLoadedCount(n: number): void {
		TileLoadScheduler._idealLoadedCount = n;
	}

	static get idealCoveredCount(): number {
		return TileLoadScheduler._idealCoveredCount;
	}

	static setIdealCoveredCount(n: number): void {
		TileLoadScheduler._idealCoveredCount = n;
	}

	static isIdealTile(tile: Tile): boolean {
		return TileLoadScheduler._idealTiles.has(`${tile.z}/${tile.x}/${tile.y}`);
	}

	/**
	 * Stats/demo only. Do NOT purge the shared queue here —
	 * raster and vector layers share one queue; purging with one
	 * layer's ideal set drops the other layer's requests.
	 */
	static setIdealTileSet(set: IdealTileSet | null): void {
		TileLoadScheduler._idealTileSet = set;
		TileLoadScheduler._idealTiles = set ? new Set(set.keys) : new Set();
	}

	static noteAbort(): void {
		TileLoadScheduler._statAbortCount++;
	}

	static noteEnterFrustum(): void {
		TileLoadScheduler._statEnterFrustumCount++;
	}

	static noteLoadedDist(distToCamera: number): void {
		TileLoadScheduler._statLoadedDistSum += distToCamera;
		TileLoadScheduler._statLoadedDistCount++;
		if (distToCamera < TileLoadScheduler._statLoadedDistMin) {
			TileLoadScheduler._statLoadedDistMin = distToCamera;
		}
		if (distToCamera > TileLoadScheduler._statLoadedDistMax) {
			TileLoadScheduler._statLoadedDistMax = distToCamera;
		}
	}

	/** Begin a network load slot (called from Tile._loadData). */
	static beginDownload(tile: Tile): void {
		TileLoadScheduler._activeDownloads++;
		TileLoadScheduler._loadingTiles.add(tile);
	}

	/** End a network load slot (called from Tile._loadData finally). */
	static endDownload(tile: Tile): void {
		TileLoadScheduler._activeDownloads--;
		TileLoadScheduler._loadingTiles.delete(tile);
	}

	/** Retry path: temporarily free a slot before backoff re-enters _loadData. */
	static freeDownloadSlotForRetry(tile: Tile): void {
		TileLoadScheduler._activeDownloads--;
		TileLoadScheduler._loadingTiles.delete(tile);
	}

	/**
	 * Load priority (lower = sooner).
	 * Band [0,1): underlay coarse parents first, then ideals (coarser z first,
	 * then near→far). ≥1: sibling blockers, then distance.
	 */
	static loadPriority(tile: Tile, idealTiles?: Set<string>): number {
		const key = `${tile.z}/${tile.x}/${tile.y}`;
		const isIdeal = idealTiles
			? idealTiles.has(key)
			: TileLoadScheduler._idealTiles.has(key);
		const d = Number.isFinite(tile.distToCamera) ? tile.distToCamera : 0;
		const dNorm = Math.min(d / 1e12, 0.009);
		const idealMaxZ = TileLoadScheduler._idealTileSet?.z;
		if (isIdeal) {
			return Math.min(0.1 + tile.z * 0.01 + dNorm, 0.999);
		}
		if (typeof idealMaxZ === "number" && tile.z < idealMaxZ) {
			return Math.min(0.01 + dNorm, 0.099);
		}
		return 2 + tile.distToCamera;
	}

	/** Enqueue a tile load; always attaches completion → root via requestLoad. */
	static enqueue(
		tile: Tile,
		loader: ICompositeLoader,
		idealTiles?: Set<string>
	): void {
		if (!tile || !loader) return;
		if (!(tile as any)._canStartLoading?.()) return;
		if (TileLoadScheduler.isQueued(tile)) return;

		if (!(tile as any)._onLoadComplete) {
			let root: Tile = tile;
			while (root.parent && (root.parent as any).isTile) {
				root = root.parent as Tile;
			}
			const forEvent = root;
			(tile as any)._onLoadComplete = () => {
				forEvent.dispatchEvent({ type: "tile-loaded", tile });
			};
		}

		const priority = TileLoadScheduler.loadPriority(tile, idealTiles);
		TileLoadScheduler._loadQueue.push({ tile, loader, priority, idealTiles });
		if (TileLoadScheduler._loadQueue.length > TileLoadScheduler._statMaxQueue) {
			TileLoadScheduler._statMaxQueue = TileLoadScheduler._loadQueue.length;
		}
		if (TileLoadScheduler.debugSchedule) {
			console.log(
				`[Schedule] enqueue z${tile.z}/${tile.x}/${tile.y} ` +
					`dist=${tile.distToCamera.toFixed(0)} queue=${TileLoadScheduler._loadQueue.length}`
			);
		}
		TileLoadScheduler.drain();
	}

	static drain(): void {
		if (TileLoadScheduler._loadQueue.length === 0) return;
		TileLoadScheduler.prune();
		for (const job of TileLoadScheduler._loadQueue) {
			job.priority = TileLoadScheduler.loadPriority(job.tile, job.idealTiles);
		}
		TileLoadScheduler._loadQueue.sort((a, b) => a.priority - b.priority);
		while (
			TileLoadScheduler._activeDownloads <
				TileLoadScheduler.effectiveMaxConcurrentDownloads &&
			TileLoadScheduler._loadQueue.length > 0
		) {
			const job = TileLoadScheduler._loadQueue.shift()!;
			const tile = job.tile;
			if ((tile as any)._canStartLoading?.()) {
				void (tile as any)._loadData(job.loader);
			}
		}
	}

	/**
	 * Drop obsolete queued work while panning: disposed tiles, non-ideal
	 * out-of-frustum work, and cap the queue size. Ideal tiles always stay.
	 */
	static prune(): void {
		const MAX_QUEUE = 160;
		if (TileLoadScheduler._loadQueue.length === 0) return;
		const before = TileLoadScheduler._loadQueue.length;
		const ideals = TileLoadScheduler._idealTiles;
		TileLoadScheduler._loadQueue = TileLoadScheduler._loadQueue.filter((job) => {
			const t = job.tile;
			if (t.z !== 0 && !t.parent) return false;
			if ((t as any).loaded || (t as any).state === "loading") return false;
			const key = `${t.z}/${t.x}/${t.y}`;
			if (job.idealTiles?.has(key)) return true;
			if (TileLoadScheduler._idealTiles.has(key)) return true;
			if ((t as any).inFrustum) return true;
			return TileLoadScheduler._loadQueue.length <= 24;
		});
		if (TileLoadScheduler._loadQueue.length > 80) {
			for (const t of TileLoadScheduler._loadingTiles) {
				if ((t as any).inFrustum) continue;
				const key = `${t.z}/${t.x}/${t.y}`;
				if (ideals.has(key)) continue;
				(t as any)._abortController?.abort();
			}
		}
		if (TileLoadScheduler._loadQueue.length > MAX_QUEUE) {
			TileLoadScheduler._loadQueue.sort((a, b) => a.priority - b.priority);
			TileLoadScheduler._loadQueue.length = MAX_QUEUE;
		}
		if (before !== TileLoadScheduler._loadQueue.length && TileLoadScheduler.debugSchedule) {
			console.log(
				`[Schedule] prune queue ${before}→${TileLoadScheduler._loadQueue.length}`
			);
		}
	}

	static purge(tile: Tile): void {
		TileLoadScheduler._loadQueue = TileLoadScheduler._loadQueue.filter(
			(job) => job.tile !== tile
		);
	}

	static isQueued(tile: Tile): boolean {
		return TileLoadScheduler._loadQueue.some((job) => job.tile === tile);
	}

	static hasLoading(tile: Tile): boolean {
		return TileLoadScheduler._loadingTiles.has(tile);
	}

	static getScheduleStats() {
		let idealMinZ: number | null = null;
		let idealMaxZ: number | null = null;
		if (TileLoadScheduler._idealTiles.size > 0) {
			for (const key of TileLoadScheduler._idealTiles) {
				const z = +key.split("/")[0];
				if (!Number.isFinite(z)) continue;
				if (idealMinZ === null || z < idealMinZ) idealMinZ = z;
				if (idealMaxZ === null || z > idealMaxZ) idealMaxZ = z;
			}
		}
		return {
			activeDownloads: TileLoadScheduler._activeDownloads,
			maxConcurrent: TileLoadScheduler.effectiveMaxConcurrentDownloads,
			loadQueue: TileLoadScheduler._loadQueue.length,
			interacting: TileLoadScheduler._interacting,
			abortCount: TileLoadScheduler._statAbortCount,
			deferCount: TileLoadScheduler._statDeferCount,
			enterFrustumCount: TileLoadScheduler._statEnterFrustumCount,
			parentPrefetchCount: TileLoadScheduler._statParentPrefetchCount,
			retainHoldCount: TileLoadScheduler._statRetainHoldCount,
			retainReleaseCount: TileLoadScheduler._statRetainReleaseCount,
			maxQueueSeen: TileLoadScheduler._statMaxQueue,
			avgLoadedDist:
				TileLoadScheduler._statLoadedDistCount > 0
					? TileLoadScheduler._statLoadedDistSum /
						TileLoadScheduler._statLoadedDistCount
					: 0,
			loadedDistMin:
				TileLoadScheduler._statLoadedDistMin === Infinity
					? 0
					: TileLoadScheduler._statLoadedDistMin,
			loadedDistMax: TileLoadScheduler._statLoadedDistMax,
			coveringZoom: TileLoadScheduler._coveringZoom,
			idealTileCount: TileLoadScheduler._idealTiles.size,
			idealTileZ: TileLoadScheduler._idealTileSet
				? TileLoadScheduler._idealTileSet.z
				: null,
			idealMinZ,
			idealMaxZ,
			idealLoadedCount: TileLoadScheduler._idealLoadedCount,
			idealCoveredCount: TileLoadScheduler._idealCoveredCount,
		};
	}
}
