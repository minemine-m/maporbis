import { VectorPaints } from "../materials/vectorTileRenderer/IVectorTileRender";
import { SourceOptions, TileSource } from "./TileSource";
/**
 */
export type MVTSourceOptions = SourceOptions & {
    paint?: VectorPaints;
};
/**
 */
export declare class MVTSource extends TileSource {
    dataType: string;
    paint: VectorPaints;
    constructor(options: MVTSourceOptions);
}
