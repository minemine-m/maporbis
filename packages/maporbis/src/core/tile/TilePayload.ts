import type { BufferGeometry, Material } from "three";

export type TilePayloadKind = "raster" | "vector";

/**
 * Loaded content for a tile, independent of Mesh ownership.
 * Raster: geometry + materials applied to the Mesh.
 * Vector: opaque vector payload; Mesh stays empty (data-only).
 */
export type TilePayload = {
	kind: TilePayloadKind;
	geometry?: BufferGeometry;
	materials?: Material[];
	vectorData?: unknown;
};

export function payloadMaterials(materials: unknown): Material[] {
	const list = Array.isArray(materials)
		? materials
		: materials
			? [materials]
			: [];
	return list.filter(Boolean) as Material[];
}

export function isPlaceholderGeometry(geo: unknown, placeholder: BufferGeometry): boolean {
	return !geo || geo === placeholder || !(geo as any)?.attributes?.position;
}
