/**
 * 基础坐标类型
 * @description 表示二维或三维空间中的坐标点
 * 
 * @typedef {Array} Coordinate
 * @property {number} 0 - X坐标（经度或水平位置）
 * @property {number} 1 - Y坐标（纬度或垂直位置）
 * @property {number} [2] - 可选Z坐标（高度或深度）
 * 
 * @example
 * // 二维坐标
 * const coord2D: Coordinate = [116.404, 39.915];
 * 
 * @example
 * // 三维坐标
 * const coord3D: Coordinate = [116.404, 39.915, 500];
  * @category Types
 */
export type Coordinate = [number, number] | [number, number, number];