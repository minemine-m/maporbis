import { Texture, MeshBasicMaterial } from 'three';
import { OverlayLayerOptions, OverlayLayer } from './OverlayLayer';
import { ICloud } from '../feature/ICloud';
import { Clouds } from "@pmndrs/vanilla";
import { Style } from '../style';
import { requireProp } from "../utils/validate";

/**
 * Cloud Layer configuration options.
 * 云层图层配置选项
 * 
 * @description
 * Extends basic layer options, adds cloud-specific texture configuration.
 * 扩展基础图层选项，添加云层特有的纹理配置。
 * 
 * @extends OverlayLayerOptions<ICloud>
  * @category Layer
 */
export type ICloudLayerOptions = OverlayLayerOptions<ICloud> & {
    /**
     * Cloud texture.
     * 云层纹理
     * @description 
     * Supports direct Texture object or texture URL string.
     * 支持直接传入Texture对象或纹理URL字符串。
     */
    texture: string | Texture;
};

/**
 * Cloud Effect Layer class.
 * 云层特效图层类
 * 
 * @description
 * Specialized layer for rendering and managing cloud effects in 3D scene.
 * Implements cloud effects based on @pmndrs/vanilla Clouds.
 * 用于在3D场景中渲染和管理云层特效的专用图层。
 * 基于@pmndrs/vanilla的Clouds实现云层效果。
 * 
 * @extends OverlayLayer<ICloud>
  * @category Layer
 */
export class CloudsLayer extends OverlayLayer<ICloud> {
    /**
     * Cloud effect instance.
     * 云层特效实例
     * @description 
     * Stores the Clouds instance created by @pmndrs/vanilla.
     * 存储由@pmndrs/vanilla创建的Clouds实例。
     */
    public _clouds: Clouds | null = null;

    /**
     * Constructor.
     * 构造函数
     * @param id Layer unique identifier.
     *           图层唯一标识符
     * @param options Cloud layer options.
     *                云层配置选项
     * 
     * @throws {Error} Throws error when texture parameter is missing.
     *                 当缺少必要的texture参数时抛出错误
     */
    constructor(id: string, options: ICloudLayerOptions) {
        super(id, options);
        // Validate required parameters
        // 验证必要参数
        const configPaths = ['texture'];
        for (const path of configPaths) {
            requireProp<string>(options, path);
        }
        // Create cloud effects
        // 创建云层特效
        this._createClouds(options.texture);
    }

    /**
     * Create cloud effect instance.
     * 创建云层特效实例
     * @param texture Cloud texture (URL or Texture object).
     *                云层纹理（URL或Texture对象）
     * 
     * @private
     * @description 
     * Asynchronously loads texture and initializes Clouds instance.
     * 异步加载纹理并初始化Clouds实例。
     */
    private async _createClouds(texture: string | Texture) {
        // Load texture
        // 加载纹理
        const loadedTexture = await Style._loadTexture(texture as string);
        
        // Create cloud effects
        // 创建云层特效
        const clouds = new Clouds({
            texture: loadedTexture,
            material: MeshBasicMaterial
        });

        // Configure effect properties
        // 配置特效属性
        clouds.castShadow = true;         // Enable shadow casting 启用阴影投射
        // clouds.renderOrder = 99999;       // Set render order 设置渲染顺序
        this._clouds = clouds;            // Save instance reference 保存实例引用
    }

    /**
     * Validate feature type.
     * 验证要素类型
     * @param feature Feature to validate.
     *                待验证的要素
     * @returns Whether it is a valid Cloud feature.
     *          是否为合法的云层要素
     * 
     * @description
     * Implement parent abstract method, validate if feature type is 'Cloud'.
     * 实现父类抽象方法，验证要素类型是否为'Cloud'。
     */
    protected validateFeature(feature: ICloud): boolean {
        return feature._type === 'Cloud';
    }

    /**
     * Animation update method.
     * 动画更新方法
     * @param delta Frame interval time (seconds). 帧间隔时间（秒）
     * @param elapsedtime Elapsed time (seconds). 累计时间（秒）
     * 
     * @description
     * Called automatically every frame to update cloud animation state.
     * 每帧自动调用，用于更新云层动画状态。
     */
    override animate(delta: number, elapsedtime: number) {
        if (this._clouds) {
            // 更新云层特效状态
            this._clouds.update(this.map.viewer.camera, elapsedtime, delta);
        }
    }
}