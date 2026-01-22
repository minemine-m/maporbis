
import {
	VectorStyles
} from "../materials/vectorTileRenderer/IVectorTileRender";
import { SourceOptions, TileSource } from "./TileSource";

/**
 */
export type MVTSourceOptions = SourceOptions & { style?: VectorStyles };

/**
 */
export class MVTSource extends TileSource {
	public dataType = "mvt";
	public style: VectorStyles = { layer: {} };
	//  "https://demotiles.maplibre.org/style.json";

	public constructor(options: MVTSourceOptions) {
		super(options);
		Object.assign(this, options);
	}
}