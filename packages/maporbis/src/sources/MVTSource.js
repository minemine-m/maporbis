import { TileSource } from "./TileSource";
/**
 */
export class MVTSource extends TileSource {
    dataType = "mvt";
    paint = { layer: {} };
    //  "https://demotiles.maplibre.org/style.json";
    constructor(options) {
        super(options);
        Object.assign(this, options);
    }
}
