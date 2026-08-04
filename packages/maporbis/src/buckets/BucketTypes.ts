import { Vector3, Color } from "three";

/**
 * Feature information for querying
 * 要素信息，用于查询
 */
export interface FeatureInfo {
    id: any;
    properties: any;
    startIndex: number;
    vertexCount: number;
}

/**
 * Instance data for points
 * 点的实例数据
 */
export interface PointInstance {
    position: Vector3;
    scale: number;
    rotation: number;
    color?: Color;
}

/**
 * Fill bucket data
 * 面桶数据
 */
export interface FillData {
    vertices: number[];
    indices: number[];
    features: FeatureInfo[];
}

/**
 * Line bucket data
 * 线桶数据
 */
export interface LineData {
    segments: number[];
    features: FeatureInfo[];
}

/**
 * Point bucket data
 * 点桶数据
 */
export interface PointData {
    instances: PointInstance[];
    features: FeatureInfo[];
}
