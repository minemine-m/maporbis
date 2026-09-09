/**
 * Verify new tile-local MVT parser against a real MapTiler PBF.
 */
import { MVTParser } from "../packages/maporbis/src/loaders/parsers/mvt-parser.js";

const url =
	"https://api.maptiler.com/tiles/v3/5/28/12.pbf?key=uKYsZQZpm72WlbSgH9B7";

const buf = await fetch(url).then((r) => {
	if (!r.ok) throw new Error(`HTTP ${r.status}`);
	return r.arrayBuffer();
});

console.log("pbf bytes", buf.byteLength);
const parsed = await MVTParser.parse(buf, 28, 12, 5);

console.log("dataFormat", parsed.dataFormat);
console.log("extent", parsed.extent);
console.log("layerNames", Object.keys(parsed.layers));

let featureCount = 0;
let outOfRange = 0;
let sample = null;
let coordCount = 0;

function walkCoords(coords, cb) {
	if (typeof coords[0] === "number") {
		cb(coords);
		return;
	}
	for (const c of coords) walkCoords(c, cb);
}

let minXY = [Infinity, Infinity];
let maxXY = [-Infinity, -Infinity];

for (const [name, feats] of Object.entries(parsed.layers)) {
	featureCount += feats.length;
	for (const f of feats) {
		walkCoords(f.geometry.coordinates, (xy) => {
			coordCount++;
			const [x, y] = xy;
			if (x < minXY[0]) minXY[0] = x;
			if (y < minXY[1]) minXY[1] = y;
			if (x > maxXY[0]) maxXY[0] = x;
			if (y > maxXY[1]) maxXY[1] = y;
			if (x < -512 || y < -512 || x > parsed.extent + 512 || y > parsed.extent + 512) {
				outOfRange++;
			}
			if (!sample) sample = { layer: name, type: f.geometry.type, xy: [x, y] };
		});
	}
}

console.log("minXY", minXY, "maxXY", maxXY);
console.log("featureCount", featureCount);
console.log("coordCount", coordCount);
console.log("outOfRange", outOfRange);
console.log("sample", sample);
console.log("PROBE_SUMMARY", {
	ok: parsed.dataFormat === "mvt-local" && outOfRange === 0 && coordCount > 0,
});
