/**
 * @module Geometry
 */
/**
 * Import Marker class
 * 导入Marker类
 * @description Basic marker class for creating point features
 *              基础标记点类，用于创建点状要素
 */
import { Marker, type MarkerOptions } from './Marker';

/**
 * Import LineString class
 * 导入LineString类
 * @description Line feature class for creating line features
 *              线要素类，用于创建线状要素
 */
import { LineString, type LineStringOptions } from './LineString';

/**
 * Import Polygon class
 * 导入Polygon类
 * @description Polygon feature class for creating polygon features
 *              面要素类，用于创建多边形要素
 */
import { Polygon, type PolygonOptions } from './Polygon';

/**
 * Import MultiLineString class
 * 导入MultiLineString类
 * @description MultiLineString feature class for creating multi-line features
 *              多线要素类，用于创建多线要素
 */
import { MultiLineString, type MultiLineStringOptions } from './MultiLineString';

/**
 * Import Model class
 * 导入Model类
 * @description 3D Model class for loading and displaying 3D models
 *              3D模型类，用于加载和显示3D模型
 */
import { Model, type ModelOptions } from './Model';

/**
 * Import ICloud class
 * 导入ICloud类
 * @description Cloud effect class for creating cloud layer effects
 *              云特效类，用于创建云层效果
 */
import { ICloud, type CloudOptions } from './ICloud';

/**
 * Import Label class
 * 导入Label类
 * @description Label class for creating text labels
 *              标签类，用于创建文本标注
 */
import { Label } from './Label';

/**
 * Import TPoints class
 * 导入TPoints类
 * @description TPoints feature class for creating point features (Cloud/Light)
 *              点要素类，用于创建点状要素
 */
import { TPoints, type TPointsOptions } from './TPoints';

/**
 * Import Edit extension
 * 导入编辑功能扩展
 * @description Add editing capabilities to Feature class
 *              为Feature类添加编辑功能
 */
import './ext/Feature.Edit';

/**
 * Export all geometry feature classes
 * 导出所有几何要素类
 * @description Centralized export of all geometry feature classes, including:
 *              集中导出所有几何要素类，包括：
 * - Marker: Point feature (点要素)
 * - LineString: Line feature (线要素)
 * - MultiLineString: Multi-line feature (多线要素)
 * - Polygon: Polygon feature (面要素)
 * - Model: 3D Model (3D模型)
 * - ICloud: Cloud effect (云特效)
 * - Label: Text label (文本标注)
 */
export { Feature, type FeatureOptions, type GeoJSONGeometry } from './Feature';
export { 
  Marker, 
  LineString, 
  MultiLineString, 
  Polygon, 
  Model, 
  ICloud, 
  Label, 
  TPoints 
};
export type { 
  MarkerOptions, 
  LineStringOptions, 
  PolygonOptions, 
  MultiLineStringOptions, 
  ModelOptions, 
  CloudOptions, 
  TPointsOptions 
};
