import { Object3D, Mesh, Points, PointsMaterial } from 'three';
import { Line2 } from 'three-stdlib';

/**
 * Bloom configuration interface.
 * 发光配置接口
 */
export interface IBloomConfig {
    enabled: boolean;
    intensity: number;
    color: string;
}

/**
 * Internal feature bloom effect helper.
 * 内部要素发光效果辅助类
 * 
 * @description
 * Manages bloom/glow effects for features including Points, Sprites, Line2, and Meshes.
 * 管理要素的发光效果，包括点、精灵、线条和网格
 * 
 * @internal
 */
export class FeatureBloomHelper {
    /** Current bloom configuration. 当前发光配置 */
    private _bloomConfig?: IBloomConfig;

    /**
     * Get current bloom configuration.
     * 获取当前发光配置
     */
    getBloomConfig(): IBloomConfig | undefined {
        return this._bloomConfig;
    }

    /**
     * Set bloom configuration.
     * 设置发光配置
     * 
     * @param enabled - Whether to enable bloom. 是否启用发光
     * @param options - Bloom intensity and color options. 发光强度和颜色选项
     */
    setBloomConfig(
        enabled: boolean,
        options?: { intensity?: number; color?: string }
    ): IBloomConfig {
        const prev = this._bloomConfig || {
            enabled: false,
            intensity: 1.0,
            color: '#ffffff'
        };

        this._bloomConfig = {
            enabled,
            intensity: options?.intensity ?? prev.intensity,
            color: options?.color ?? prev.color
        };

        return this._bloomConfig;
    }

    /**
     * Apply bloom configuration from style.
     * 从样式应用发光配置
     * 
     * @param styleBloom - Bloom config from style. 样式中的发光配置
     */
    applyStyleBloom(styleBloom: boolean | { enabled?: boolean; intensity?: number; color?: string } | undefined): void {
        if (styleBloom === undefined) return;

        if (typeof styleBloom === 'boolean') {
            this._bloomConfig = {
                enabled: styleBloom,
                intensity: 1.0,
                color: '#ffffff'
            };
        } else {
            this._bloomConfig = {
                enabled: styleBloom.enabled ?? true,
                intensity: styleBloom.intensity ?? 1.0,
                color: styleBloom.color ?? '#ffffff'
            };
        }
    }

    /**
     * Apply bloom effect to a Three.js object.
     * 将发光效果应用到Three.js对象上
     * 
     * @param root - Root object to apply bloom to. 要应用发光的根对象
     */
    applyBloomToObject(root: Object3D | Line2): void {
        if (!this._bloomConfig) return;
        const { enabled, intensity, color } = this._bloomConfig;

        (root as Object3D).traverse((child: any) => {
            // Handle Points
            if (child instanceof Points && child.material) {
                this._applyBloomToPoints(child, enabled, intensity);
                return;
            }

            // Handle Sprite
            if (child.type === 'Sprite' && child.material) {
                this._applyBloomToSprite(child, enabled, intensity, color);
                return;
            }

            // Handle Line2
            if (child.isLine2 && child.material) {
                this._applyBloomToLine2(child, enabled, intensity, color);
                return;
            }

            // Handle Mesh
            if (child instanceof Mesh && child.material) {
                this._applyBloomToMesh(child, enabled, intensity, color);
            }
        });
    }

    /**
     * Apply bloom to Points material.
     * 将发光效果应用到点材质
     */
    private _applyBloomToPoints(child: Points, enabled: boolean, intensity: number): void {
        const mat = child.material as PointsMaterial;
        child.userData = child.userData || {};
        
        if (!child.userData.__bloomBackup) {
            child.userData.__bloomBackup = {
                size: mat.size,
                sizeAttenuation: mat.sizeAttenuation
            };
        }
        
        const backup = child.userData.__bloomBackup;
        if (!enabled) {
            mat.size = backup.size;
            mat.sizeAttenuation = backup.sizeAttenuation;
        } else {
            mat.size = backup.size * (1 + intensity);
            mat.sizeAttenuation = false;
        }
        mat.needsUpdate = true;
    }

    /**
     * Apply bloom to Sprite material.
     * 将发光效果应用到精灵材质
     */
    private _applyBloomToSprite(child: any, enabled: boolean, intensity: number, color: string): void {
        const mat = child.material;
        child.userData = child.userData || {};
        
        if (!child.userData.__bloomBackup) {
            child.userData.__bloomBackup = {
                color: mat.color ? mat.color.clone() : null,
                opacity: mat.opacity ?? 1.0
            };
        }
        
        const backup = child.userData.__bloomBackup;
        if (!enabled) {
            if (backup.color && mat.color) {
                mat.color.copy(backup.color);
            }
            mat.opacity = backup.opacity;
        } else {
            if (mat.color && backup.color) {
                mat.color.copy(backup.color);
                if (color && color !== '#ffffff') {
                    mat.color.setStyle(color);
                    mat.color.multiplyScalar(1 + intensity * 2.0);
                } else {
                    mat.color.multiplyScalar(1 + intensity * 2.0);
                }
            }
            mat.opacity = Math.min(1.0, (backup.opacity ?? 1.0) * (1 + intensity * 0.3));
        }
        mat.needsUpdate = true;
    }

    /**
     * Apply bloom to Line2 material.
     * 将发光效果应用到Line2材质
     */
    private _applyBloomToLine2(child: any, enabled: boolean, intensity: number, color: string): void {
        const mat = child.material;
        child.userData = child.userData || {};
        
        if (!child.userData.__bloomBackup) {
            child.userData.__bloomBackup = {
                color: mat.color ? mat.color.clone() : null,
                opacity: mat.opacity ?? 1.0
            };
        }
        
        const backup = child.userData.__bloomBackup;
        if (!enabled) {
            if (backup.color && mat.color) {
                mat.color.copy(backup.color);
            }
            mat.opacity = backup.opacity;
        } else {
            if (mat.color && backup.color) {
                mat.color.copy(backup.color);
                if (color && color !== '#ffffff') {
                    mat.color.setStyle(color);
                    mat.color.multiplyScalar(1 + intensity * 2.0);
                } else {
                    mat.color.multiplyScalar(1 + intensity * 2.0);
                }
            }
            mat.opacity = Math.min(1.0, (backup.opacity ?? 1.0) * (1 + intensity * 0.3));
        }
        mat.needsUpdate = true;
    }

    /**
     * Apply bloom to Mesh material.
     * 将发光效果应用到网格材质
     */
    private _applyBloomToMesh(child: Mesh, enabled: boolean, intensity: number, color: string): void {
        const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

        materials.forEach((mat: any) => {
            child.userData = child.userData || {};
            
            if (!child.userData.__bloomBackup) {
                child.userData.__bloomBackup = {
                    emissiveIntensity: mat.emissiveIntensity ?? 0,
                    emissiveColor: mat.emissive ? mat.emissive.clone() : null,
                    color: mat.color ? mat.color.clone() : null
                };
            }
            
            const backup = child.userData.__bloomBackup;

            if (!enabled) {
                // Restore original values
                if ('emissiveIntensity' in mat) {
                    mat.emissiveIntensity = backup.emissiveIntensity !== undefined
                        ? backup.emissiveIntensity
                        : 0;
                }
                if (backup.emissiveColor && mat.emissive) {
                    mat.emissive.copy(backup.emissiveColor);
                }
                if (backup.color && mat.color) {
                    mat.color.copy(backup.color);
                }
            } else {
                // Apply bloom effect
                if ('emissive' in mat && mat.emissive) {
                    mat.emissiveIntensity = intensity;
                    if (color && color !== '#ffffff' && mat.emissive.setStyle) {
                        mat.emissive.setStyle(color);
                    } else if (backup.color && mat.emissive) {
                        mat.emissive.copy(backup.color);
                    }
                } else if (mat.color) {
                    if (backup.color) {
                        mat.color.copy(backup.color);
                    }
                    if (color && color !== '#ffffff') {
                        mat.color.setStyle(color);
                    } else {
                        mat.color.multiplyScalar(1 + intensity * 0.3);
                    }
                }
            }
            mat.needsUpdate = true;
        });
    }
}
