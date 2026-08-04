import { BufferGeometry } from "three";
import { IGeometryLoader, LoaderMetadata, SourceLoadContext } from "./LoaderInterfaces";
/**
 * Mapbox Vector Tile Geometry Loader
 * Mapbox 矢量瓦片几何体加载器
 *
 * @description
 * Loads and parses Mapbox Vector Tile (MVT) data, returning a geometry with parsed vector data in userData.
 * It uses a worker pool to parse MVT data in parallel.
 *
 * 加载并解析 Mapbox 矢量瓦片 (MVT) 数据，返回 userData 中包含解析后矢量数据的几何体。
 * 使用 Worker 池并行解析 MVT 数据。
 */
export declare class MapboxVectorTileGeometryLoader implements IGeometryLoader {
    readonly info: LoaderMetadata;
    readonly dataType = "vector-tile";
    private fileLoader;
    private _workerPool;
    constructor();
    /**
     * Load tile geometry (vector data container)
     * 加载瓦片几何体（矢量数据容器）
     */
    load(context: SourceLoadContext): Promise<BufferGeometry>;
    private fetchVectorData;
    private buildTileUrl;
    private createGeometryWithVectorData;
    private createErrorGeometry;
    unload(geometry: BufferGeometry): void;
}
