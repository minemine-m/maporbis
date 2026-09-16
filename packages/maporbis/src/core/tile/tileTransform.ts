/**
 * Flat tile transform in root-tile local unit space (before root scale mapW/mapH).
 * y=0 is the top row → +v, matching createChildren (t1 at +0.25 local y).
 */
export type TileRootLocal = {
	u: number;
	v: number;
	su: number;
	sv: number;
};

export function computeTileRootLocal(z: number, x: number, y: number): TileRootLocal {
	const n = Math.pow(2, z);
	return {
		u: (x + 0.5) / n - 0.5,
		v: 0.5 - (y + 0.5) / n,
		su: 1 / n,
		sv: 1 / n,
	};
}

/** World (root-space, after root scale) center and size. */
export function computeTileRootSpace(
	z: number,
	x: number,
	y: number,
	mapWidth: number,
	mapHeight: number
): { px: number; py: number; wx: number; wy: number } {
	const local = computeTileRootLocal(z, x, y);
	return {
		px: local.u * mapWidth,
		py: local.v * mapHeight,
		wx: local.su * mapWidth,
		wy: local.sv * mapHeight,
	};
}
