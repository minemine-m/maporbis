import { Vector3 } from "three";

/**
 * Layout Feature Output
 * 布局要素输出
 */
export interface LayoutFeature {
	type: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
	coordinates: number[][][] | number[][] | number[];
	properties: Record<string, any>;
	id: any;
	layerName: string;
	worldCoordinates: Vector3[][];
}

export type TileLocalMeta = {
	x: number;
	y: number;
	z: number;
	extent: number;
};

/**
 * Feature Layout
 * 要素布局
 *
 * Converts tile-local extent coordinates to world space relative to prjCenter.
 * Avoids per-vertex lon/lat GeoJSON expansion.
 */
export class FeatureLayout {
	private _tempVec3 = new Vector3();

	/**
	 * Layout a feature from tile-local coordinates
	 * 从瓦片本地坐标布局要素
	 */
	layoutFeature(
		geometry: any,
		properties: Record<string, any>,
		id: any,
		map: any,
		prjCenter: Vector3,
		layerName: string = "",
		tileMeta?: TileLocalMeta
	): LayoutFeature {
		const type = geometry.type as LayoutFeature["type"];
		const worldCoordinates: Vector3[][] = [];

		if (type === "Point") {
			worldCoordinates.push(this._transformCoordinates([geometry.coordinates], map, prjCenter, tileMeta));
		} else if (type === "MultiPoint") {
			worldCoordinates.push(this._transformCoordinates(geometry.coordinates, map, prjCenter, tileMeta));
		} else if (type === "LineString") {
			worldCoordinates.push(this._transformCoordinates(geometry.coordinates, map, prjCenter, tileMeta));
		} else if (type === "MultiLineString") {
			geometry.coordinates.forEach((line: number[][]) => {
				worldCoordinates.push(this._transformCoordinates(line, map, prjCenter, tileMeta));
			});
		} else if (type === "Polygon") {
			geometry.coordinates.forEach((ring: number[][]) => {
				worldCoordinates.push(this._transformCoordinates(ring, map, prjCenter, tileMeta));
			});
		} else if (type === "MultiPolygon") {
			geometry.coordinates.forEach((polygon: number[][][]) => {
				polygon.forEach((ring: number[][]) => {
					worldCoordinates.push(this._transformCoordinates(ring, map, prjCenter, tileMeta));
				});
			});
		}

		return {
			type,
			coordinates: geometry.coordinates,
			properties,
			id,
			layerName,
			worldCoordinates,
		};
	}

	/**
	 * Tile-local (extent units) → projected → world (relative to prjCenter)
	 */
	private _transformCoordinates(
		coords: number[][],
		map: any,
		prjCenter: Vector3,
		tileMeta?: TileLocalMeta
	): Vector3[] {
		const result: Vector3[] = [];
		const pcx = prjCenter.x;
		const pcy = prjCenter.y;
		const pcz = prjCenter.z;

		const useTileLocal = !!(tileMeta && tileMeta.extent > 0);
		const n = useTileLocal ? Math.pow(2, tileMeta!.z) : 1;
		const extent = useTileLocal ? tileMeta!.extent : 1;
		const tileX = useTileLocal ? tileMeta!.x : 0;
		const tileY = useTileLocal ? tileMeta!.y : 0;
		const projection = map?.projection;
		const isMercator = projection?.ID === "3857";

		for (const coord of coords) {
			let worldPos: Vector3;

			if (useTileLocal && isMercator) {
				// XYZ web-mercator: projected space is linear in tile grid
				const u = (tileX + coord[0] / extent) / n;
				const v = (tileY + coord[1] / extent) / n;
				const px = (u - 0.5) * projection.mapWidth;
				const py = (0.5 - v) * projection.mapHeight;
				this._tempVec3.set(px, py, coord[2] || 0);
				worldPos = map.pointToWorld(this._tempVec3);
			} else if (useTileLocal) {
				// Fallback: tile-local → lon/lat → world
				const u = (tileX + coord[0] / extent) / n;
				const v = (tileY + coord[1] / extent) / n;
				const lon = u * 360 - 180;
				const lat = this._yToLat(v);
				this._tempVec3.set(lon, lat, coord[2] || 0);
				worldPos = map.lngLatToWorld(this._tempVec3);
			} else {
				// Legacy path: coordinates are lon/lat
				this._tempVec3.set(coord[0], coord[1], coord[2] || 0);
				worldPos = map.lngLatToWorld(this._tempVec3);
			}

			result.push(new Vector3(worldPos.x - pcx, worldPos.y - pcy, worldPos.z - pcz));
		}

		return result;
	}

	/** XYZ normalized y [0,1] → latitude degrees (web mercator) */
	private _yToLat(yNorm: number): number {
		const n = Math.PI - 2 * Math.PI * yNorm;
		return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
	}

	/**
	 * Layout multiple features from tile data
	 * 从瓦片数据布局多个要素
	 */
	layoutTileFeatures(
		vectorData: any,
		map: any,
		prjCenter: Vector3,
		paintRules: any[],
		evaluateFilter: (filter: any, properties: any, layerName: string, geometryType: string) => boolean
	): LayoutFeature[] {
		const features: LayoutFeature[] = [];

		if (!vectorData?.layers) return features;

		const tileMeta: TileLocalMeta | undefined =
			vectorData.dataFormat === "mvt-local" && vectorData.extent > 0
				? {
						x: vectorData.x,
						y: vectorData.y,
						z: vectorData.z,
						extent: vectorData.extent,
					}
				: undefined;

		Object.keys(vectorData.layers).forEach((layerName) => {
			const vectorLayer = vectorData.layers[layerName];

			for (let i = 0; i < vectorLayer.length; i++) {
				const rawFeature = vectorLayer[i];

				let matched = false;
				for (const rule of paintRules) {
					if (
						evaluateFilter(
							rule.filter,
							rawFeature.properties,
							layerName,
							rawFeature.geometry.type
						)
					) {
						matched = true;
						break;
					}
				}

				if (matched) {
					features.push(
						this.layoutFeature(
							rawFeature.geometry,
							rawFeature.properties,
							rawFeature.id,
							map,
							prjCenter,
							layerName,
							tileMeta
						)
					);
				}
			}
		});

		return features;
	}
}
