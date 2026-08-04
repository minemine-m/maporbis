/**
 * AtmospherePresets - 大气环境预设
 *
 * 提供一组预配置的大气参数，可直接用于 {@link AtmosphereLayer.update}。
 *
 * @example
 * ```ts
 * import { AtmosphereLayer, ATMOSPHERE_PRESETS } from '@maporbis/pro';
 *
 * const atmosphere = new AtmosphereLayer('atmosphere');
 * map.addLayer(atmosphere);
 *
 * // 应用预设
 * atmosphere.update(ATMOSPHERE_PRESETS.sunset);
 *
 * // 部分覆盖预设
 * atmosphere.update({ ...ATMOSPHERE_PRESETS.night, elevation: 10 });
 * ```
 */
import type { AtmosphereLayerOptions } from './AtmosphereLayer';
/** 预设名称 */
export type AtmospherePresetName = 'sunny' | 'cloudy' | 'overcast' | 'fog' | 'sunrise' | 'morning' | 'sunset' | 'nightsky' | 'night';
/**
 * 大气环境预设集合
 *
 * 每个预设仅包含与默认值不同的字段，可与默认值合并使用：
 * ```ts
 * const params = { ...DEFAULTS, ...ATMOSPHERE_PRESETS.sunset };
 * ```
 */
export declare const ATMOSPHERE_PRESETS: Record<AtmospherePresetName, Partial<AtmosphereLayerOptions>>;
