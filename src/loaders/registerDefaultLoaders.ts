import { TileLoaderFactory } from "./TileLoaderFactory";
import { WebImageLoader } from "./WebImageLoader";
import { MapboxRGBLoader } from "./MapboxRGBLoader";
import { ArcGISLercLoader } from "./ArcGISLercLoader";
import { MapboxVectorTileGeometryLoader } from "./MapboxVectorTileGeometryLoader";
import { VectorTileTextureLoader } from "./VectorTileTextureLoader";

/**
 * Register default loaders to TileLoaderFactory.
 * 注册默认加载器到 TileLoaderFactory
 */
export function registerDefaultLoaders() {
    // Material Loaders
    TileLoaderFactory.registerMaterialLoader(new WebImageLoader());
    TileLoaderFactory.registerMaterialLoader(new VectorTileTextureLoader());

    // Geometry Loaders (Terrain)
    TileLoaderFactory.registerGeometryLoader(new MapboxRGBLoader());
    TileLoaderFactory.registerGeometryLoader(new ArcGISLercLoader());

    // Mesh Loaders (Vector Tile)
    // Note: Vector tiles provide both geometry (data) and can be rendered.
    // MapboxVectorTileGeometryLoader parses the data into geometry.userData.
    TileLoaderFactory.registerMeshLoader(new MapboxVectorTileGeometryLoader());

    console.log("[TileLoaderFactory] Default loaders registered.");
}
