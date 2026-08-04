import { FileLoader } from "three";
import { WorkerPool } from "three/examples/jsm/utils/WorkerPool.js";
import { TileLoaderFactory } from "./TileLoaderFactory";
import { MapTileGeometry } from "../geometries/MapTileGeometry";
import MVTParseWorker from "./workers/mvt-parse.worker?worker&inline";
import { WebGPUCompat } from "../utils/WebGPUCompat";
const THREAD_COUNT = 10;
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
export class MapboxVectorTileGeometryLoader {
    info = {
        version: "2.0.0",
        description: "Mapbox Vector Tile Geometry Loader (Refactored)",
    };
    dataType = "vector-tile";
    fileLoader = new FileLoader(TileLoaderFactory.manager);
    _workerPool = new WorkerPool(0);
    constructor() {
        this.fileLoader.setResponseType("arraybuffer");
        this._workerPool.setWorkerCreator(() => new MVTParseWorker());
    }
    /**
     * Load tile geometry (vector data container)
     * 加载瓦片几何体（矢量数据容器）
     */
    async load(context) {
        const { source, x, y, z } = context;
        // Get URL from source
        const url = typeof source._getUrl === "function"
            ? source._getUrl(x, y, z)
            : this.buildTileUrl(source.url, x, y, z);
        if (!url) {
            return this.createErrorGeometry(x, y, z, new Error("Source returned empty URL"));
        }
        // Initialize worker pool if needed
        if (this._workerPool.pool === 0) {
            this._workerPool.setWorkerLimit(THREAD_COUNT);
        }
        try {
            // Fetch raw data
            const arrayBuffer = await this.fetchVectorData(url);
            // Parse in worker
            const message = { arrayBuffer, x, y, z };
            const workerResult = await this._workerPool.postMessage(message, [arrayBuffer]);
            const vectorData = workerResult.data;
            if (vectorData.error) {
                throw new Error(vectorData.error);
            }
            // Create geometry with data
            const geometry = this.createGeometryWithVectorData(vectorData, context);
            // Notify manager
            TileLoaderFactory.manager.parseEnd(url);
            return geometry;
        }
        catch (error) {
            return this.createErrorGeometry(x, y, z, error);
        }
    }
    async fetchVectorData(url) {
        try {
            const arrayBuffer = await this.fileLoader.loadAsync(url);
            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                throw new Error("Empty response");
            }
            return arrayBuffer;
        }
        catch (error) {
            throw new Error(`Failed to fetch vector tile: ${error.message}`);
        }
    }
    buildTileUrl(urlTemplate, x, y, z) {
        if (!urlTemplate)
            return "";
        return urlTemplate
            .replace('{x}', x.toString())
            .replace('{y}', y.toString())
            .replace('{z}', z.toString())
            .replace('{-y}', (Math.pow(2, z) - 1 - y).toString());
    }
    createGeometryWithVectorData(vectorData, context) {
        const geometry = new MapTileGeometry();
        geometry.userData = {
            vectorData: vectorData,
            tileInfo: {
                x: context.x,
                y: context.y,
                z: context.z,
                bounds: context.bounds
            },
            metadata: {
                dataType: this.dataType,
                version: this.info.version,
                loadedAt: Date.now()
            }
        };
        return geometry;
    }
    createErrorGeometry(x, y, z, error) {
        const geometry = new MapTileGeometry();
        const tileSize = 40075016.68557849 / Math.pow(2, z);
        geometry.userData = {
            vectorData: {
                x, y, z,
                layers: {},
                totalFeatures: 0,
                bounds: { world: { x: tileSize, y: tileSize } }, // Simplified bounds
                error: error.message || "Unknown error",
                timestamp: Date.now(),
                dataFormat: 'error'
            },
            tileInfo: { x, y, z, bounds: [0, 0, 0, 0] },
            metadata: {
                dataType: 'vector-tile-error',
                error: true,
                errorMessage: error.message
            }
        };
        return geometry;
    }
    unload(geometry) {
        WebGPUCompat.safeDispose(() => {
            if (geometry.userData?.vectorData) {
                geometry.userData.vectorData = null;
            }
            geometry.dispose();
        });
    }
}
