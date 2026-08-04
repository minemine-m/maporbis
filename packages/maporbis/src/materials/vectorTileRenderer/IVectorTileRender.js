/**
 * 元素类型
 */
export var VectorFeatureTypes;
(function (VectorFeatureTypes) {
    VectorFeatureTypes[VectorFeatureTypes["Unknown"] = 0] = "Unknown";
    VectorFeatureTypes[VectorFeatureTypes["Point"] = 1] = "Point";
    VectorFeatureTypes[VectorFeatureTypes["Linestring"] = 2] = "Linestring";
    VectorFeatureTypes[VectorFeatureTypes["Polygon"] = 3] = "Polygon";
})(VectorFeatureTypes || (VectorFeatureTypes = {}));
