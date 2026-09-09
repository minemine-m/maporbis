// loaders/parsers/mvt-parser.ts

import Pbf from "pbf";
import { VectorTile, classifyRings } from "@mapbox/vector-tile";

/** Tile-local ring: [[x, y], ...] in extent units */
export type TileLocalRing = Array<[number, number]>;

export type TileLocalGeometry = {
	type: "Point" | "MultiPoint" | "LineString" | "MultiLineString" | "Polygon" | "MultiPolygon";
	coordinates: any;
};

export type TileLocalFeature = {
	id: number | undefined;
	properties: Record<string, any>;
	geometry: TileLocalGeometry;
};

export type ParsedVectorTile = {
	x: number;
	y: number;
	z: number;
	extent: number;
	layers: Record<string, TileLocalFeature[]>;
	timestamp: number;
	/** Marks geometry coordinates as tile-local [0, extent], not lon/lat */
	dataFormat: "mvt-local";
};

/**
 * Mapbox Vector Tile (MVT) Parser
 * MVT 矢量瓦片解析器
 *
 * Keeps coordinates in tile-local extent space [0, extent].
 * Does NOT expand to GeoJSON lon/lat on the hot path.
 */
export class MVTParser {
	public static async parse(
		arrayBuffer: ArrayBuffer,
		x: number,
		y: number,
		z: number
	): Promise<ParsedVectorTile> {
		try {
			return MVTParser.mvt2TileLocal(arrayBuffer, x, y, z);
		} catch (error) {
			console.error("[MVTParser] Error parsing vector tile data:", error);
			throw error;
		}
	}

	/**
	 * Convert MVT PBF to tile-local feature layers (no GeoJSON lon/lat expansion).
	 * 将 MVT PBF 转为瓦片本地坐标要素图层（不做 GeoJSON 经纬度展开）。
	 */
	public static mvt2TileLocal(
		data: ArrayBuffer | Uint8Array,
		x: number,
		y: number,
		z: number
	): ParsedVectorTile {
		const pbf = new Pbf(data);
		const tile = new VectorTile(pbf);
		const layers: Record<string, TileLocalFeature[]> = {};
		let extent = 4096;

		for (const layerName in tile.layers) {
			const layer = tile.layers[layerName];
			extent = layer.extent || extent;
			const features: TileLocalFeature[] = [];

			for (let i = 0; i < layer.length; i++) {
				const feature = layer.feature(i);
				const geometry = MVTParser.featureToLocalGeometry(feature);
				if (!geometry) continue;
				features.push({
					id: feature.id,
					properties: feature.properties,
					geometry,
				});
			}

			layers[layerName] = features;
		}

		return {
			x,
			y,
			z,
			extent,
			layers,
			timestamp: Date.now(),
			dataFormat: "mvt-local",
		};
	}

	private static featureToLocalGeometry(feature: any): TileLocalGeometry | null {
		const rawLines = feature.loadGeometry();
		const toRing = (line: Array<{ x: number; y: number }>): TileLocalRing =>
			line.map((p) => [p.x, p.y] as [number, number]);

		if (feature.type === 1) {
			const points: Array<[number, number]> = [];
			for (const line of rawLines) {
				if (line[0]) points.push([line[0].x, line[0].y]);
			}
			if (points.length === 0) return null;
			return points.length === 1
				? { type: "Point", coordinates: points[0] }
				: { type: "MultiPoint", coordinates: points };
		}

		if (feature.type === 2) {
			const lines = rawLines.map(toRing);
			if (lines.length === 0) return null;
			return lines.length === 1
				? { type: "LineString", coordinates: lines[0] }
				: { type: "MultiLineString", coordinates: lines };
		}

		if (feature.type === 3) {
			const polygons = classifyRings(rawLines);
			const coordinates = polygons.map((polygon) => polygon.map(toRing));
			if (coordinates.length === 0) return null;
			return coordinates.length === 1
				? { type: "Polygon", coordinates: coordinates[0] }
				: { type: "MultiPolygon", coordinates };
		}

		return null;
	}
}
