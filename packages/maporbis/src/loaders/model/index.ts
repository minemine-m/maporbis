/**
 * Model loader module.
 * 模型加载器模块
 * 
 * @description
 * Provides 3D model loading capabilities for GLTF/GLB and FBX formats.
 * Includes caching and factory pattern for extensibility.
 * 
 * 提供GLTF/GLB和FBX格式的3D模型加载能力
 * 包含缓存和工厂模式以支持扩展性
 * 
 * @module loaders/model
 */

export { ModelCache } from './ModelCache';
export type { ModelLoadResult } from './ModelCache';

export { AbstractModelLoader } from './AbstractModelLoader';
export type { ModelLoaderOptions } from './AbstractModelLoader';

export { GLTFModelLoader } from './GLTFModelLoader';
export { FBXModelLoader } from './FBXModelLoader';

export { ModelLoaderFactory } from './ModelLoaderFactory';
export type { ModelType } from './ModelLoaderFactory';
