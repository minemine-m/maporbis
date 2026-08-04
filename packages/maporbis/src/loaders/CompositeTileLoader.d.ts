import { BufferGeometry, Material, Mesh } from "three";
import { ISource } from "../sources";
import { ICompositeLoader, TileLoadContext, TileMeshData } from "./LoaderInterfaces";
import { TileCache } from "./TileCache";
import { RetryOptions } from "./RetryLoader";
/**
 * 综合瓦片加载器
 * @class CompositeTileLoader
 * @description 负责协调加载瓦片的几何体 (Geometry) 和材质 (Material)
 */
export declare class CompositeTileLoader implements ICompositeLoader {
    private _imgSources;
    private _demSource;
    private _vtSource;
    /** Tile cache for avoiding re-fetching 瓦片缓存，避免重复请求 */
    cache: TileCache;
    /** Retry configuration 重试配置 */
    private _retryOptions;
    manager: import("./LoaderInterfaces").TileLoadingManager;
    constructor(maxCacheSize?: number);
    /** Set retry options 设置重试选项 */
    setRetryOptions(options: RetryOptions): void;
    /** Get retry options 获取重试选项 */
    getRetryOptions(): Readonly<RetryOptions>;
    /** Disable cache 禁用缓存 */
    disableCache(): void;
    get imgSource(): ISource[];
    set imgSource(value: ISource[]);
    get demSource(): ISource | undefined;
    set demSource(value: ISource | undefined);
    get vtSource(): ISource | undefined;
    set vtSource(value: ISource | undefined);
    /**
     * 加载瓦片数据
     * @param context 加载上下文
     */
    load(context: TileLoadContext): Promise<TileMeshData>;
    /**
     * 卸载资源
     * @param tileMesh
     */
    unload(tileMesh: Mesh): void;
    /**
     * 加载几何体
     * @param context
     */
    protected loadGeometry(context: TileLoadContext): Promise<BufferGeometry>;
    /**
     * 加载材质列表
     * @param context
     */
    protected loadMaterials(context: TileLoadContext): Promise<Material[]>;
    private loadFromSource;
    /**
     * 检查瓦片边界是否在数据源范围内
     */
    private isBoundsInSource;
}
