
import {
	VectorPaints
} from "../materials/vectorTileRenderer/IVectorTileRender";
import { SourceOptions, TileSource } from "./TileSource";

/**
 */
export type MVTSourceOptions = SourceOptions & { paint?: VectorPaints };

/**
 */
export class MVTSource extends TileSource {
	public dataType = "mvt";
	public paint: VectorPaints = { layer: {} };
	//  "https://demotiles.maplibre.org/style.json";

	public constructor(options: MVTSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}