/**
 * Geographic coordinate type.
 * 基础坐标类型
 * @description Represents a point in 2D or 3D space. 表示二维或三维空间中的坐标点
 * 
 * @typedef {Array} LngLatLike
 * @property {number} 0 - Longitude or X coordinate. X坐标（经度或水平位置）
 * @property {number} 1 - Latitude or Y coordinate. Y坐标（纬度或垂直位置）
 * @property {number} [2] - Optional altitude or Z coordinate. 可选Z坐标（高度或深度）
 * 
 * @example
 * // 2D coordinate
 * const coord2D: LngLatLike = [116.404, 39.915];
 * 
 * @example
 * // 3D coordinate
 * const coord3D: LngLatLike = [116.404, 39.915, 500];
 * @category Types
 */
export type LngLatLike = [number, number] | [number, number, number];