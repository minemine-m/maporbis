import { CanvasTexture, FileLoader, Texture } from "three";
import { VectorTile, VectorTileFeature, VectorTileLayer } from "@mapbox/vector-tile";
import Pbf from "pbf";
import { AbstractMaterialLoader } from "./AbstractMaterialLoader";
import { TileLoaderFactory } from "./TileLoaderFactory";
import { LoaderMetadata, SourceLoadContext } from "./LoaderInterfaces";
import { VectorTileRender } from "../materials/vectorTileRenderer/VectorTileRender";
import { 
    VectorStyle, 
    VectorFeature,
    VectorFeatureTypes
} from "../materials/vectorTileRenderer/IVectorTileRender";

export type StyleType = { layer: VectorStyle[] };

/**
 * Vector Tile Texture Loader
 * 矢量瓦片纹理加载器
 * 
 * @description
 * Loads Mapbox Vector Tile (MVT) data and renders it to a texture using OffscreenCanvas.
 * Useful for displaying vector data as raster tiles.
 * 
 * 加载 Mapbox 矢量瓦片 (MVT) 数据并使用 OffscreenCanvas 将其渲染为纹理。
 * 适用于将矢量数据显示为栅格瓦片。
 */
export class VectorTileTextureLoader extends AbstractMaterialLoader {
    public readonly info: LoaderMetadata = {
        version: "2.0.0",
        description: "Vector Tile Texture Loader (Refactored)",
    };

    public readonly dataType = "mvt";

    private _loader = new FileLoader(TileLoaderFactory.manager);
    private _render = new VectorTileRender();

    constructor() {
        super();
        this._loader.setResponseType("arraybuffer");
    }

    /**
     * Override load to handle custom MVT loading logic
     * 重写 load 以处理自定义 MVT 加载逻辑
     */
    protected async performLoad(url: string, context: SourceLoadContext): Promise<Texture> {
        // Load vector tile data
        const data = (await this._loader.loadAsync(url)) as ArrayBuffer;

        // Parse vector tile
        const vectorTile = new VectorTile(new Pbf(data));

        // Render to canvas
        const style = (context.source as any).style;
        const img = this.drawTile(vectorTile, style, context.z);

        // Create texture
        return new CanvasTexture(img);
    }

    /**
     * Draw tile to OffscreenCanvas
     * 在离屏画布上绘制瓦片
     */
    private drawTile(vectorTile: VectorTile, style: StyleType, z: number): OffscreenCanvas {
        const width = 256;
        const height = 256;
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Canvas context is not available");
        }

        if (style) {
            // Render with style
            for (const layerName in style.layer) {
                const layerStyle = style.layer[layerName];
                if (z < (layerStyle.minLevel ?? 1) || z > (layerStyle.maxLevel ?? 20)) {
                    continue;
                }
                const layer = vectorTile.layers[layerName];
                if (layer) {
                    const scale = width / layer.extent;
                    this._renderLayer(ctx, layer, layerStyle, scale);
                }
            }
        } else {
            // Render default
            for (const layerName in vectorTile.layers) {
                const layer = vectorTile.layers[layerName];
                const scale = width / layer.extent;
                this._renderLayer(ctx, layer, undefined, scale);
            }
        }

        return canvas;
    }

    private _renderLayer(
        ctx: OffscreenCanvasRenderingContext2D,
        layer: VectorTileLayer,
        style?: VectorStyle,
        scale: number = 1
    ) {
        ctx.save();
        for (let i = 0; i < layer.length; i++) {
            const feature = layer.feature(i);
            this._renderFeature(ctx, feature, style, scale);
        }
        ctx.restore();
    }

    private _renderFeature(
        ctx: OffscreenCanvasRenderingContext2D,
        feature: VectorTileFeature,
        style: VectorStyle = {},
        scale: number = 1
    ) {
        const type = [
            VectorFeatureTypes.Unknown,
            VectorFeatureTypes.Point,
            VectorFeatureTypes.Linestring,
            VectorFeatureTypes.Polygon,
        ][feature.type];

        const renderFeature: VectorFeature = {
            geometry: feature.loadGeometry(),
            properties: feature.properties,
        };

        this._render.render(ctx, type, renderFeature, style, scale);
    }

    // #region GeoJSON Conversion Utilities (Preserved functionality)
    
    /**
     * Convert Vector Tile to GeoJSON FeatureCollection
     * 将整个矢量瓦片转换为 GeoJSON FeatureCollection
     */
    public convertVectorTileToGeoJSON(vectorTile: VectorTile): any {
        const features: any[] = [];

        for (const layerName in vectorTile.layers) {
            const layer = vectorTile.layers[layerName];

            for (let i = 0; i < layer.length; i++) {
                const feature = layer.feature(i);
                const type = [
                    VectorFeatureTypes.Unknown,
                    VectorFeatureTypes.Point,
                    VectorFeatureTypes.Linestring,
                    VectorFeatureTypes.Polygon,
                    VectorFeatureTypes.Unknown,
                ][feature.type];

                const renderFeature: VectorFeature = {
                    geometry: feature.loadGeometry(),
                    properties: feature.properties,
                };

                const geoJSONFeature = this._convertToGeoJSONFeature(renderFeature, type);
                if (geoJSONFeature) {
                    geoJSONFeature.properties._layer = layerName;
                    features.push(geoJSONFeature);
                }
            }
        }

        return {
            type: "FeatureCollection",
            features: features
        };
    }

    private _convertToGeoJSONFeature(renderFeature: VectorFeature, type: VectorFeatureTypes): any {
        const geometry = this._convertGeometryToGeoJSON(renderFeature.geometry, type);
        if (!geometry) return null;

        return {
            type: "Feature",
            geometry: geometry,
            properties: renderFeature.properties || {},
            id: (renderFeature as any).id
        };
    }

    private _convertGeometryToGeoJSON(geometry: any, type: VectorFeatureTypes): any {
        switch (type) {
            case VectorFeatureTypes.Point:
                return this._convertPointGeometry(geometry);
            case VectorFeatureTypes.Linestring:
                return this._convertLineGeometry(geometry);
            case VectorFeatureTypes.Polygon:
                return this._convertPolygonGeometry(geometry);
            default:
                console.warn('Unknown geometry type:', type);
                return null;
        }
    }

    private _convertPointGeometry(geometry: any): any {
        const coordinates: number[][] = [];
        for (const ring of geometry) {
            for (const point of ring) {
                coordinates.push([point.x, point.y]);
            }
        }

        if (coordinates.length === 0) return null;
        if (coordinates.length === 1) {
            return { type: "Point", coordinates: coordinates[0] };
        } else {
            return { type: "MultiPoint", coordinates: coordinates };
        }
    }

    private _convertLineGeometry(geometry: any): any {
        const coordinates: number[][][] = [];
        for (const ring of geometry) {
            const line: number[][] = [];
            for (const point of ring) {
                line.push([point.x, point.y]);
            }
            if (line.length >= 2) {
                coordinates.push(line);
            }
        }

        if (coordinates.length === 0) return null;
        if (coordinates.length === 1) {
            return { type: "LineString", coordinates: coordinates[0] };
        } else {
            return { type: "MultiLineString", coordinates: coordinates };
        }
    }

    private _convertPolygonGeometry(geometry: any): any {
        const coordinates: number[][][][] = [];
        let currentPolygon: number[][][] = [];

        for (const ring of geometry) {
            const polygonRing: number[][] = [];
            for (const point of ring) {
                polygonRing.push([point.x, point.y]);
            }

            if (polygonRing.length >= 4) {
                const isClockwise = this._isRingClockwise(polygonRing);
                if (isClockwise || currentPolygon.length === 0) {
                    if (currentPolygon.length > 0) {
                        coordinates.push(currentPolygon);
                    }
                    currentPolygon = [polygonRing];
                } else {
                    currentPolygon.push(polygonRing);
                }
            }
        }

        if (currentPolygon.length > 0) {
            coordinates.push(currentPolygon);
        }

        if (coordinates.length === 0) return null;
        if (coordinates.length === 1) {
            return { type: "Polygon", coordinates: coordinates[0] };
        } else {
            return { type: "MultiPolygon", coordinates: coordinates };
        }
    }

    private _isRingClockwise(ring: number[][]): boolean {
        let sum = 0;
        for (let i = 0; i < ring.length - 1; i++) {
            const [x1, y1] = ring[i];
            const [x2, y2] = ring[i + 1];
            sum += (x2 - x1) * (y2 + y1);
        }
        return sum > 0;
    }

    // #endregion
}
