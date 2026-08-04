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
// ============================================================================
// 预设定义
// ============================================================================
/**
 * 大气环境预设集合
 *
 * 每个预设仅包含与默认值不同的字段，可与默认值合并使用：
 * ```ts
 * const params = { ...DEFAULTS, ...ATMOSPHERE_PRESETS.sunset };
 * ```
 */
export const ATMOSPHERE_PRESETS = {
    /** 晴天 - 明亮清澈的天空 */
    sunny: {
        turbidity: 15,
        rayleigh: 0.2,
        mieCoefficient: 0.001,
        weaken: 0.3,
        elevation: 15,
        dirLight: 2,
        ambLight: 2,
        fogColor: '#b4deff',
    },
    /** 多云 - 使用默认值 */
    cloudy: {
        fogColor: '#b4deff',
    },
    /** 阴天 - 厚重云层，低光照 */
    overcast: {
        elevation: 50,
        turbidity: 20,
        rayleigh: 0.3,
        mieCoefficient: 0.06,
        mieDirectionalG: 0.998,
        mult: 1.6,
        weaken: 0.6,
        THICKNESS: 40,
        coverage: 1,
        curve: 0.5,
        fogColor: '#b4deff',
        fogDensity: 0.2,
        ambLight: 2,
        dirLight: 0.5,
    },
    /** 雾霾 - 低能见度 */
    fog: {
        turbidity: 20,
        rayleigh: 2.5,
        weaken: 0.8,
        elevation: 50,
        fogColor: '#b4deff',
        fogDensity: 4,
        ambLight: 0.5,
        dirLight: 0.5,
    },
    /** 日出 - 低角度暖光 */
    sunrise: {
        elevation: 0,
        sunSize: 3,
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.0001,
        mieDirectionalG: 0.996,
        THICKNESS: 60,
        weaken: 0.1,
        coverage: 0.4,
        skylineF: 0.6,
        curve: 0.1,
        fogColor: '#000000',
        fogDensity: 0.3,
        ambLight: 1,
        dirLight: 1,
    },
    /** 早晨 - 清爽明亮 */
    morning: {
        elevation: 19,
        turbidity: 1,
        rayleigh: 0.05,
        mieCoefficient: 0.001,
        weaken: 0.5,
        THICKNESS: 40,
        coverage: 1,
        curve: 0.1,
        fogDensity: 0.3,
        ambLight: 2,
        dirLight: 1,
    },
    /** 傍晚 - 暖色落日 */
    sunset: {
        elevation: 0,
        sunSize: 2,
        turbidity: 6,
        rayleigh: 1.8,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.998,
        THICKNESS: 60,
        weaken: 0.5,
        coverage: 0.3,
        skylineF: 0.6,
        curve: 0.1,
        fogColor: '#ea891a',
        fogDensity: 0.3,
        ambLight: 1.5,
        dirLight: 0.8,
    },
    /** 夜空 - 暗色调无太阳，带星星和月亮 */
    nightsky: {
        elevation: 10,
        sunSize: 0,
        turbidity: 10,
        rayleigh: 0.6,
        mieCoefficient: 0.09,
        mieDirectionalG: 0.999999,
        THICKNESS: 30,
        ABSORPTION: 0.8,
        weaken: 0.5,
        coverage: 0.4,
        skylineF: 0.5,
        curve: 0.1,
        fogColor: '#000000',
        fogDensity: 0.5,
        ambLight: 0.3,
        dirLight: 0.2,
        starIntensity: 0.8,
        moonIntensity: 0.9,
        moonElevation: 45,
        moonAzimuth: 30,
    },
    /** 夜晚 - 极暗环境，繁星满天无月 */
    night: {
        elevation: 15,
        sunSize: 0,
        turbidity: 10,
        rayleigh: 0.5,
        mieCoefficient: 0.07,
        mieDirectionalG: 0.999,
        weaken: 0.65,
        skyIntensity: 0.06,
        skylineF: 0.5,
        curve: 0.1,
        fogColor: '#111111',
        fogDensity: 0.5,
        ambLight: 0.2,
        dirLight: 0,
        starIntensity: 1.0,
        moonIntensity: 0.0,
    },
};
