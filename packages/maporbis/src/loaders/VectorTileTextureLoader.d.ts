import { Texture } from "three";
import { VectorTile } from "@mapbox/vector-tile";
import { AbstractMaterialLoader } from "./AbstractMaterialLoader";
import { LoaderMetadata, SourceLoadContext } from "./LoaderInterfaces";
import { VectorPaint } from "../materials/vectorTileRenderer/IVectorTileRender";
export type PaintType = {
    layer: VectorPaint[];
};
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
export declare class VectorTileTextureLoader extends AbstractMaterialLoader {
    readonly info: LoaderMetadata;
    readonly dataType = "mvt";
    private _loader;
    private _render;
    constructor();
    /**
     * Override load to handle custom MVT loading logic
     * 重写 load 以处理自定义 MVT 加载逻辑
     */
    protected performLoad(url: string, context: SourceLoadContext): Promise<Texture>;
    /**
     * Draw tile to OffscreenCanvas
     * 在离屏画布上绘制瓦片
     */
    private drawTile;
    private _renderLayer;
    private _renderFeature;
    /**
     * Convert Vector Tile to GeoJSON FeatureCollection
     * 将整个矢量瓦片转换为 GeoJSON FeatureCollection
     */
    convertVectorTileToGeoJSON(vectorTile: VectorTile): any;
    private _convertToGeoJSONFeature;
    private _convertGeometryToGeoJSON;
    private _convertPointGeometry;
    private _convertLineGeometry;
    private _convertPolygonGeometry;
    private _isRingClockwise;
}
