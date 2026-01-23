import {
    Vector2, Vector3, BufferGeometry, BufferAttribute, Points, PointsMaterial, SpriteMaterial, Sprite, Color, Group, MeshBasicMaterial, Mesh, BackSide, DoubleSide, FrontSide, ShaderMaterial, RepeatWrapping, TextureLoader, Shape, ShapeGeometry, MeshStandardMaterial, CanvasTexture, MathUtils, NearestFilter, LinearMipmapLinearFilter, Texture, NormalBlending, InstancedMesh, CylinderGeometry, AdditiveBlending, Object3D,
    LinearFilter, SRGBColorSpace, TubeGeometry, CurvePath, LineCurve3, QuadraticBezierCurve3, MeshPhongMaterial
} from 'three';
import { Line2, LineMaterial, LineGeometry, Water } from 'three-stdlib';
import { ExternalModelLoader } from '../loaders/ExternalModelLoader';
import { Map } from '../map';
import { BasicPointStyle, BaseLineStyle, IconPointStyle, ModelStyle, BasePolygonStyle, ExtrudeStyle, WaterStyle, CloudStyle, LabelStyle, IconLabelStyle, LightStyle, Style, FlowLineStyle, ArrowLineStyle, FlowTextureLineStyle } from '../style';
import { Cloud as vanillaCloud } from "@pmndrs/vanilla";

/**
 * Canvas绘制结果接口
 */
interface CanvasResult {
    /** 绘制的Canvas元素 */
    canvas: HTMLCanvasElement;
    /** Canvas宽度 */
    width: number;
    /** Canvas高度 */
    height: number;
    /** 中心点坐标 */
    center: [number, number];
}


interface LabelSettings {
    text: string;
    fontSize: number;
    /**
    * 图标尺寸
    * - number：表示“高度像素”，宽度按图片原始比例自动计算
    * - [width, height]：直接使用指定宽高
    */
    iconSize?: number | [number, number];
    fontFamily: string;
    fontWeight: number;
    padding: { top: number; right: number; bottom: number; left: number };
    bgColor: string;
    bgOpacity: number;
    textColor: string;
    strokeColor: string;
    strokeWidth: number;
    iconScale: number;
    canvasScale: number;
    renderbg: boolean;
    textOffset: { x: number; y: number };
    transparent?: boolean;
    depthTest?: boolean;
    depthWrite?: boolean;
}

/**
 * 创建基础点要素
 * @param config 点样式配置
 * @param position 点位置
 * @returns 点要素对象
  * @category Utils
 */
export function _createBasicPoint(config: BasicPointStyle, position: Vector3): Points {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array([0, 0, 0]), 3));

    const isSizeAttenuation = config.sizeAttenuation ?? true;
    // Align with icon/label size scaling (pixelsToUnit = 0.002) when using size attenuation
    const size = isSizeAttenuation ? config.size * 0.002 : config.size;

    // console.log('createBasicPoint config.sizeAttenuation ', config.sizeAttenuation);
    const material = new PointsMaterial({
        size: size,
        color: config.color || 0xffffff,
        sizeAttenuation: isSizeAttenuation,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
    });

    // Custom shader to render a circle
    material.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <clipping_planes_fragment>`,
            `
            #include <clipping_planes_fragment>
            vec2 coord = gl_PointCoord - vec2(0.5);
            if(length(coord) > 0.5) discard;
            `
        );
    };

    const points = new Points(geometry, material);

    points.position.copy(position);
    return points;
}

/**
 * 创建图标点要素
 * @param config 图标样式配置
 * @param position 点位置
 * @returns Promise<Sprite> 图标精灵对象
 */
export async function _createIconPoint(config: IconPointStyle, position: Vector3): Promise<Sprite> {
    // 尝试加载纹理，但不让异常向外抛出
    let texture: Texture | null = null;
    try {
        texture = await Style._loadTexture(config.url);
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.colorSpace = SRGBColorSpace;
        texture.generateMipmaps = true;
        // texture.format = RGBAFormat;
        texture.premultiplyAlpha = false;  // 明确设置
        texture.needsUpdate = true;
    } catch (error) {
        console.error("IconPoint texture load failed:", config.url, error);
    }

    const material = new SpriteMaterial({
        // 如果纹理加载失败，map 为 null，使用纯色占位
        map: texture ?? null,
        color: config.color || 0xffffff,
        transparent: config.transparent ?? true,
        opacity: (config as any).opacity ?? 1,
        sizeAttenuation: config.sizeAttenuation ?? true,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
        alphaTest: config.alphaTest ?? 0.05,
        premultipliedAlpha: false,  // 与纹理设置保持一致
        blending: NormalBlending,  // 正常混合模式
    });

    const sprite = new Sprite(material);

    const pixelsToUnit = 0.002;

    // 兼容 size 传数组或单值（虽然类型定义是 [number, number]）
    const rawSize = (config as any).size;
    let width: number;
    let height: number;

    if (Array.isArray(rawSize)) {
        // 显式传入 [width, height]，按用户指定来（和以前一致）
        [width, height] = rawSize;
    } else {
        // 单值：按“高度像素”理解，宽度按纹理实际比例推导
        const baseSize = (typeof rawSize === 'number' ? rawSize : 32);

        if (texture && (texture.image as any)?.width && (texture.image as any)?.height) {
            const img: any = texture.image;
            const aspect = img.width / img.height || 1;
            height = baseSize;
            width = baseSize * aspect;
        } else {
            // 没有纹理或取不到尺寸时退回正方形
            width = baseSize;
            height = baseSize;
        }
    }

    sprite.scale.set(width * pixelsToUnit, height * pixelsToUnit, 1);
    if (config.rotation) sprite.rotation.z = config.rotation;
    if (config.anchor) sprite.center.set(config.anchor[0], config.anchor[1]);
    sprite.position.copy(position);

    return sprite;
}
// 

/**
 * 创建基础线要素
 * @param config 线样式配置
 * @param positions 顶点坐标数组
 * @returns 线要素对象
  * @category Utils
 */
export function _createBasicLine(
    config: BaseLineStyle,
    positions: Vector3[] | number[] | Float32Array
): Line2 {
    // 统一坐标数组格式
    let flatPositions: number[];
    if (positions instanceof Float32Array) {
        flatPositions = Array.from(positions);
    } else if (Array.isArray(positions) && typeof positions[0] === 'number') {
        flatPositions = positions as number[];
    } else {
        flatPositions = (positions as Vector3[]).flatMap(v => [v.x, v.y, v.z]);
    }
    // console.log('flatPositions', flatPositions);
    // 创建线几何体
    const geometry = new LineGeometry();
    geometry.setPositions(flatPositions);

    // 创建线材质
    const material = new LineMaterial({
        color: new Color(config.color ?? 0xffffff).getHex(),
        linewidth: config.width ?? 2,
        transparent: config.transparent ?? true,
        opacity: config.opacity ?? 1,
        dashed: !!config.dashArray,
        dashScale: config.dashArray?.[0] ?? 1,
        dashSize: config.dashArray?.[0] ?? 1,
        gapSize: config.dashArray?.[1] ?? 0,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
        alphaToCoverage: true,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,

    });

    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        material.resolution.set(window.innerWidth, window.innerHeight);
    });

    return new Line2(geometry, material);
}

/**
 * 创建流动管线
 * @param config 流动管线样式配置
 * @param positions 顶点坐标数组
 * @returns 管线网格
  * @category Utils
 */
export function _createFlowLine(
    config: FlowLineStyle,
    positions: Vector3[] | number[]
): Mesh {
    // 统一坐标数组格式
    let points: Vector3[] = [];
    if (Array.isArray(positions) && typeof positions[0] === 'number') {
        for (let i = 0; i < positions.length; i += 3) {
            points.push(new Vector3(positions[i] as number, positions[i + 1] as number, positions[i + 2] as number));
        }
    } else if (positions instanceof Float32Array) {
        for (let i = 0; i < positions.length; i += 3) {
            points.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
        }
    } else {
        points = positions as Vector3[];
    }

    if (points.length < 2) return new Mesh();

    // 创建路径 (带圆角)
    const curve = new CurvePath<Vector3>();
    const cornerRadius = config.cornerRadius || 5;

    if (points.length === 2 || cornerRadius <= 0) {
        // 只有两点或不需要圆角，直接用直线
        for (let i = 0; i < points.length - 1; i++) {
            const lineCurve = new LineCurve3(points[i], points[i + 1]);
            curve.curves.push(lineCurve);
        }
    } else {
        // 处理圆角逻辑
        let currentPoint = points[0];

        for (let i = 1; i < points.length - 1; i++) {
            const p1 = currentPoint;
            const p2 = points[i];
            const p3 = points[i + 1];

            const v1 = new Vector3().subVectors(p2, p1);
            const v2 = new Vector3().subVectors(p3, p2);

            const len1 = v1.length();
            const len2 = v2.length();

            const maxRadius = Math.min(len1, len2) * 0.4;
            const radius = Math.min(cornerRadius, maxRadius);

            v1.normalize().multiplyScalar(len1 - radius);
            v2.normalize().multiplyScalar(radius);

            const startTangent = new Vector3().addVectors(p1, v1);
            const endTangent = new Vector3().addVectors(p2, v2);

            curve.curves.push(new LineCurve3(p1, startTangent));
            curve.curves.push(new QuadraticBezierCurve3(startTangent, p2, endTangent));

            currentPoint = endTangent;
        }

        curve.curves.push(new LineCurve3(currentPoint, points[points.length - 1]));
    }

    // 创建几何体
    const radius = config.radius || 2;
    const radialSegments = config.radialSegments || 8;
    const tubularSegments = config.tubularSegments || 64;
    const geometry = new TubeGeometry(curve, tubularSegments, radius, radialSegments, false);

    // 专门给 bloom 提亮的倍数
    const bloomBoost = 5.0;

    // 创建材质 - 使用 MeshPhongMaterial 支持发光
    const material = new MeshPhongMaterial({
        color: config.color || '#19bbd5',
        side: DoubleSide,
        emissive: new Color(config.color || '#19bbd5'),
        emissiveIntensity: 0.6 * bloomBoost,
        transparent: true,
    });
    material.defines = { 'USE_UV': '' };

    const length = curve.getLength();
    const uniforms = {
        totalLength: { value: length },
        stripeOffset: { value: 0 },
        stripeWidth: { value: config.stripeWidth || 10 },
        stripeSpacing: { value: config.stripeSpacing || 20 },
        stripeColor: { value: new Color(config.stripeColor || '#096be3') },
        speedFactor: { value: config.speed || 10 },
        bloomBoost: { value: bloomBoost },
    };

    material.onBeforeCompile = shader => {
        shader.uniforms.totalLength = uniforms.totalLength;
        shader.uniforms.stripeOffset = uniforms.stripeOffset;
        shader.uniforms.stripeWidth = uniforms.stripeWidth;
        shader.uniforms.stripeSpacing = uniforms.stripeSpacing;
        shader.uniforms.stripeColor = uniforms.stripeColor;
        shader.uniforms.bloomBoost = uniforms.bloomBoost;

        shader.fragmentShader = `
            uniform float totalLength;
            uniform float stripeOffset;
            uniform float stripeWidth;
            uniform float stripeSpacing;
            uniform vec3 stripeColor;
            uniform float bloomBoost;
            ${shader.fragmentShader}
        `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            // 计算条纹模式（用于漫反射）
            float pattern = mod((vUv.x - stripeOffset) * totalLength / (stripeWidth + stripeSpacing), 1.0);
            float isStripe = step(pattern, stripeWidth / (stripeWidth + stripeSpacing));
            
            // 混合条纹颜色
            diffuseColor.rgb = mix(diffuseColor.rgb, stripeColor, isStripe);
            
            // 条纹区域再额外提亮，让 bloom 更明显
            if (isStripe > 0.5) {
                diffuseColor.rgb += stripeColor * (3.0 * bloomBoost);
            }
            `
        ).replace(
            `#include <emissivemap_fragment>`,
            `#include <emissivemap_fragment>
            // 计算条纹模式（用于自发光）
            float pattern_e = mod((vUv.x - stripeOffset) * totalLength / (stripeWidth + stripeSpacing), 1.0);
            float isStripe_e = step(pattern_e, stripeWidth / (stripeWidth + stripeSpacing));
            
            // 自发光通道也叠加一遍，进一步抬高亮度
            totalEmissiveRadiance += stripeColor * isStripe_e * (3.0 * bloomBoost);
            `
        );
    };

    const mesh = new Mesh(geometry, material);

    // 动画更新
    let lastTime = 0;
    mesh.onBeforeRender = () => {
        const time = performance.now();
        const delta = lastTime ? (time - lastTime) / 1000 : 0.016;
        lastTime = time;

        const normalizedSpeed = uniforms.speedFactor.value / uniforms.totalLength.value * 10;
        uniforms.stripeOffset.value -= delta * normalizedSpeed;
        uniforms.stripeOffset.value = uniforms.stripeOffset.value % 1.0;
    };

    return mesh;
}

/**
 * 创建箭头流动线（平面带状）
 * @param config 箭头流动线样式配置
 * @param positions 顶点坐标数组
 * @returns 箭头网格
  * @category Utils
 */
export function _createArrowLine(
    config: ArrowLineStyle,
    positions: Vector3[] | number[]
): Mesh {
    // 统一坐标数组格式
    let points: Vector3[] = [];
    if (Array.isArray(positions) && typeof positions[0] === 'number') {
        for (let i = 0; i < positions.length; i += 3) {
            points.push(new Vector3(positions[i] as number, positions[i + 1] as number, positions[i + 2] as number));
        }
    } else if (positions instanceof Float32Array) {
        for (let i = 0; i < positions.length; i += 3) {
            points.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
        }
    } else {
        points = positions as Vector3[];
    }

    if (points.length < 2) return new Mesh();

    // 创建路径 (带圆角)
    const curve = new CurvePath<Vector3>();
    const cornerRadius = config.cornerRadius || 5;

    if (points.length === 2 || cornerRadius <= 0) {
        for (let i = 0; i < points.length - 1; i++) {
            const lineCurve = new LineCurve3(points[i], points[i + 1]);
            curve.curves.push(lineCurve);
        }
    } else {
        let currentPoint = points[0];

        for (let i = 1; i < points.length - 1; i++) {
            const p1 = currentPoint;
            const p2 = points[i];
            const p3 = points[i + 1];

            const v1 = new Vector3().subVectors(p2, p1);
            const v2 = new Vector3().subVectors(p3, p2);

            const len1 = v1.length();
            const len2 = v2.length();

            const maxRadius = Math.min(len1, len2) * 0.4;
            const radius = Math.min(cornerRadius, maxRadius);

            v1.normalize().multiplyScalar(len1 - radius);
            v2.normalize().multiplyScalar(radius);

            const startTangent = new Vector3().addVectors(p1, v1);
            const endTangent = new Vector3().addVectors(p2, v2);

            curve.curves.push(new LineCurve3(p1, startTangent));
            curve.curves.push(new QuadraticBezierCurve3(startTangent, p2, endTangent));

            currentPoint = endTangent;
        }

        curve.curves.push(new LineCurve3(currentPoint, points[points.length - 1]));
    }

    // 创建平面带状几何体
    const width = config.width || 4;
    const segments = 128;
    const pathPoints = curve.getPoints(segments);
    
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    let accumulatedLength = 0;
    const totalLength = curve.getLength();
    
    for (let i = 0; i < pathPoints.length; i++) {
        const point = pathPoints[i];
        
        // 计算切线方向（在XZ平面上）
        let tangent: Vector3;
        if (i === 0) {
            tangent = new Vector3().subVectors(pathPoints[1], pathPoints[0]);
        } else if (i === pathPoints.length - 1) {
            tangent = new Vector3().subVectors(pathPoints[i], pathPoints[i - 1]);
        } else {
            tangent = new Vector3().subVectors(pathPoints[i + 1], pathPoints[i - 1]);
        }
        
        // 只保留XZ平面的方向
        tangent.y = 0;
        tangent.normalize();
        
        // 计算垂直方向（XZ平面内旋转90度）
        const perpendicular = new Vector3(-tangent.z, 0, tangent.x);
        
        // 生成带宽的两个顶点（保持在路径的Y高度）
        const halfWidth = width / 2;
        const left = new Vector3(
            point.x + perpendicular.x * halfWidth,
            point.y,
            point.z + perpendicular.z * halfWidth
        );
        const right = new Vector3(
            point.x - perpendicular.x * halfWidth,
            point.y,
            point.z - perpendicular.z * halfWidth
        );
        
        vertices.push(left.x, left.y, left.z);
        vertices.push(right.x, right.y, right.z);
        
        // 计算累积长度
        if (i > 0) {
            accumulatedLength += pathPoints[i].distanceTo(pathPoints[i - 1]);
        }
        const u = accumulatedLength / totalLength;
        
        uvs.push(u, 0);
        uvs.push(u, 1);
        
        // 生成三角面索引
        if (i < pathPoints.length - 1) {
            const base = i * 2;
            indices.push(base, base + 1, base + 2);
            indices.push(base + 1, base + 3, base + 2);
        }
    }
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const bloomBoost = 5.0;

    // 创建材质
    const material = new MeshPhongMaterial({
        color: config.color || '#0ED5FD',
        side: DoubleSide,
        emissive: new Color(config.color || '#0ED5FD'),
        emissiveIntensity: 5,
        transparent: true,
    });
    material.defines = { 'USE_UV': '' };

    const uniforms = {
        totalLength: { value: totalLength },
        stripeOffset: { value: 0 },
        arrowLength: { value: config.arrowLength || 20 },
        arrowSpacing: { value: config.arrowSpacing || 80 },
        arrowColor: { value: new Color(config.color || '#0ED5FD') },
        speedFactor: { value: config.speed || 10 },
        bloomBoost: { value: bloomBoost },
    };

    material.onBeforeCompile = shader => {
        shader.uniforms.totalLength = uniforms.totalLength;
        shader.uniforms.stripeOffset = uniforms.stripeOffset;
        shader.uniforms.arrowLength = uniforms.arrowLength;
        shader.uniforms.arrowSpacing = uniforms.arrowSpacing;
        shader.uniforms.arrowColor = uniforms.arrowColor;
        shader.uniforms.bloomBoost = uniforms.bloomBoost;

        shader.fragmentShader = shader.fragmentShader.replace(
            `uniform vec3 diffuse;`,
            `uniform vec3 diffuse;
            uniform float totalLength;
            uniform float stripeOffset;
            uniform float arrowLength;
            uniform float arrowSpacing;
            uniform vec3 arrowColor;
            uniform float bloomBoost;`
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
            {
                float tpat = arrowLength + arrowSpacing;
                float posi = mod((vUv.x - stripeOffset) * totalLength, tpat);
                float inArrow = step(posi, arrowLength);
                float npos = posi / arrowLength;
                
                float centerDist = abs(vUv.y - 0.5);
                
                float h0 = step(npos, 0.5);
                float headWidth = mix(0.0, 1.5, npos / 0.5);
                float shaftWidth = 0.6;
                float arrowWidth = mix(shaftWidth, headWidth, h0);
                float arrowShape = step(centerDist, arrowWidth * 0.5);
                
                float mask = inArrow * arrowShape;
                mask = clamp(mask, 0.0, 1.0);
                
                diffuseColor.rgb = arrowColor;
                diffuseColor.a = mask;
            }`
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <emissivemap_fragment>`,
            `#include <emissivemap_fragment>
            {
                float tpat2 = arrowLength + arrowSpacing;
                float posi2 = mod((vUv.x - stripeOffset) * totalLength, tpat2);
                float inArrow2 = step(posi2, arrowLength);
                float npos2 = posi2 / arrowLength;
                
                float centerDist2 = abs(vUv.y - 0.5);
                
                float h02 = step(npos2, 0.5);
                float headWidth2 = mix(0.0, 1.5, npos2 / 0.5);
                float shaftWidth2 = 0.6;
                float arrowWidth2 = mix(shaftWidth2, headWidth2, h02);
                float arrowShape2 = step(centerDist2, arrowWidth2 * 0.5);
                
                float mask2 = inArrow2 * arrowShape2;
                mask2 = clamp(mask2, 0.0, 1.0);
                
                totalEmissiveRadiance += arrowColor * mask2 * 0.5;
            }`
        );
    };

    const mesh = new Mesh(geometry, material);

    // 动画更新
    let lastTime = 0;
    mesh.onBeforeRender = () => {
        const time = performance.now();
        const delta = lastTime ? (time - lastTime) / 1000 : 0.016;
        lastTime = time;

        const normalizedSpeed = uniforms.speedFactor.value / uniforms.totalLength.value * 10;
        uniforms.stripeOffset.value -= delta * normalizedSpeed;
        uniforms.stripeOffset.value = uniforms.stripeOffset.value % 1.0;
    };

    return mesh;
}


/**
 * 创建纹理流动线（发光箭头线等）- 修复扭曲问题
 * @param config 纹理流动线样式配置
 * @param positions 顶点坐标数组
 * @returns 线状 Mesh
 */
export async function _createFlowTextureLine(
    config: FlowTextureLineStyle,
    positions: Vector3[] | number[] | Float32Array
): Promise<Mesh> {
    // 统一坐标数组格式为 Vector3[] (此部分逻辑不变)
    let points: Vector3[] = [];
    if (Array.isArray(positions) && typeof positions[0] === 'number') {
        const arr = positions as number[];
        for (let i = 0; i < arr.length; i += 3) {
            points.push(new Vector3(arr[i], arr[i + 1], arr[i + 2]));
        }
    } else if (positions instanceof Float32Array) {
        for (let i = 0; i < positions.length; i += 3) {
            points.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));
        }
    } else {
        points = positions as Vector3[];
    }

    if (points.length < 2) return new Mesh();

    const halfWidth = (config.width ?? 10) * 0.5;

    const positionsArray: number[] = [];
    const uvsArray: number[] = [];
    const indices: number[] = [];

    // 计算总长度
    let totalLength = 0;
    const segmentLengths: number[] = [0];
    for (let i = 1; i < points.length; i++) {
        const segLen = points[i].distanceTo(points[i - 1]);
        totalLength += segLen;
        segmentLengths.push(totalLength);
    }
    if (totalLength === 0) return new Mesh();

     const repeat = config.repeat ?? 1;

    // 第一步：计算所有左右顶点的位置（在水平面上）
    const leftPoints: Vector3[] = [];
    const rightPoints: Vector3[] = [];
    
    for (let i = 0; i < points.length; i++) {
        // 计算切线方向
        let tangent = new Vector3();
        if (i === 0) {
            tangent.subVectors(points[i + 1], points[i]);
        } else if (i === points.length - 1) {
            tangent.subVectors(points[i], points[i - 1]);
        } else {
            tangent.subVectors(points[i + 1], points[i - 1]);
        }
        tangent.normalize();

        // 计算垂直于切线的水平方向
        const up = new Vector3(0, 1, 0);
        let normal = new Vector3().crossVectors(tangent, up);
        
        if (normal.lengthSq() < 1e-10) {
            normal.set(1, 0, 0);
        } else {
            normal.normalize();
        }
        
        // 计算左右顶点位置
        leftPoints.push(points[i].clone().add(normal.clone().multiplyScalar(-halfWidth)));
        rightPoints.push(points[i].clone().add(normal.clone().multiplyScalar(halfWidth)));
    }

    // 第二步：分别计算左右两侧边界的累积长度
    const leftLengths: number[] = [0];
    const rightLengths: number[] = [0];
    let leftTotalLength = 0;
    let rightTotalLength = 0;
    
    for (let i = 1; i < leftPoints.length; i++) {
        leftTotalLength += leftPoints[i].distanceTo(leftPoints[i - 1]);
        leftLengths.push(leftTotalLength);
        
        rightTotalLength += rightPoints[i].distanceTo(rightPoints[i - 1]);
        rightLengths.push(rightTotalLength);
    }
    
    // 使用左右两侧的平均长度作为基准
    const avgTotalLength = (leftTotalLength + rightTotalLength) / 2;
    if (avgTotalLength === 0) return new Mesh();

    // 第三步：生成顶点和UV坐标
    for (let i = 0; i < points.length; i++) {
        positionsArray.push(
            leftPoints[i].x, leftPoints[i].y, leftPoints[i].z,
            rightPoints[i].x, rightPoints[i].y, rightPoints[i].z
        );

        // 关键修复4：使用中心线的累积长度作为U坐标
        // 这是最标准的做法，虽然在急转弯处会有轻微剪切变形
        // 但贴图不会看起来“歪”或扭曲
        const u = (segmentLengths[i] / totalLength) * repeat;
        
        // V坐标保持0和1，让贴图在宽度方向上完整显示
        uvsArray.push(
            u, 0,   // 左侧顶点：使用中心线U坐标，V=0
            u, 1    // 右侧顶点：使用中心线U坐标，V=1
        );
    }

    // 生成三角形索引（此部分逻辑不变，但依赖于正确的顶点顺序）
    const segmentCount = points.length - 1;
    for (let i = 0; i < segmentCount; i++) {
        const a = i * 2;      // 当前段左侧起点
        const b = i * 2 + 1;  // 当前段右侧起点
        const c = (i + 1) * 2;      // 下一段左侧起点
        const d = (i + 1) * 2 + 1;  // 下一段右侧起点
        
        // 第一个三角形：a → c → b
        indices.push(a, c, b);
        // 第二个三角形：c → d → b
        indices.push(c, d, b);
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(new Float32Array(positionsArray), 3));
    geometry.setAttribute('uv', new BufferAttribute(new Float32Array(uvsArray), 2));
    geometry.setIndex(indices);

    // 计算几何体的边界框，确保渲染正确
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    // 加载流动纹理
    const texture = await Style._loadTexture(config.flowTexture);
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    // 关键修复5：设置各向异性过滤，提升纹理显示质量[8](@ref)
    texture.anisotropy = 4;
    texture.needsUpdate = true;

    const color = new Color(config.color ?? 0xffffff);
    const bloomBoost = 5.0;

    const uniforms = {
        uMap: { value: texture },
        uColor: { value: color },
        uOpacity: { value: config.opacity ?? 1 },
        uOffset: { value: 0 },
        uBloomBoost: { value: bloomBoost },
    };

    const depthOffset = config.depthOffset ?? 1;
    const enablePolygonOffset = depthOffset !== 0;

    // 关键修复6：优化着色器代码，确保纹理采样正确
    const material = new ShaderMaterial({
        uniforms,
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D uMap;
            uniform vec3 uColor;
            uniform float uOpacity;
            uniform float uOffset;
            uniform float uBloomBoost;
            varying vec2 vUv;

            void main() {
                // 关键修复：修正UV滚动计算，确保方向正确[3](@ref)
                vec2 uv = vec2(fract(vUv.x + uOffset), vUv.y);
                vec4 texColor = texture2D(uMap, uv);
                
                // 添加alpha测试，完全透明的片元直接丢弃
                if (texColor.a < 0.01) discard;
                
                float alpha = texColor.a * uOpacity;
                vec3 baseColor = texColor.rgb * uColor;
                // 使用更自然的颜色增强公式
                vec3 finalColor = baseColor * uBloomBoost;
                
                gl_FragColor = vec4(finalColor, alpha);
            }
        `,
        transparent: config.transparent ?? true,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? false,
        blending: AdditiveBlending,
        side: DoubleSide,
        polygonOffset: enablePolygonOffset,
        polygonOffsetFactor: -depthOffset,
        polygonOffsetUnits: -depthOffset,
    });

    const mesh = new Mesh(geometry, material);

    // 动画更新：沿线滚动UV[1](@ref)
    let lastTime = 0;
    mesh.onBeforeRender = () => {
        const time = performance.now();
        const delta = lastTime ? (time - lastTime) / 1000 : 0.016;
        lastTime = time;

        const speed = config.speed ?? 10;
        // 使用fract函数确保偏移量在0-1范围内，避免精度问题
        uniforms.uOffset.value = fract(uniforms.uOffset.value - delta * speed / totalLength);
    };

    // 辅助函数：确保值在[0,1)范围内
    function fract(x: number): number {
        return x - Math.floor(x);
    }

    return mesh;
}

// ... existing code ...



/**
 * 创建3D模型
 * @param style 模型样式配置
 * @param position 模型位置
 * @returns Promise<Group> 模型组
 */
export async function _createModel(style: ModelStyle, position: Vector3): Promise<Group> {
    const type = style.type || (style.url.toLowerCase().endsWith('.fbx') ? 'fbx' : 'gltf');
    const result = await ExternalModelLoader.getInstance().load({
        ...style,
        type,
        position
    });
    return result.model;
}

/**
 * 创建基础多边形
 * @param config 多边形样式配置
 * @param positions 顶点坐标数组
 * @returns 多边形网格
  * @category Utils
 */
export function _createBasePolygon(
    config: BasePolygonStyle,
    positions: number[]
): Mesh {
    const { geometry, center, avgY } = _createPolygonGeometry(positions);

    // 使用样式里的 depthOffset 控制 polygonOffset 强度
    const depthOffset = config.depthOffset ?? 0;
    const enablePolygonOffset = depthOffset !== 0;

    const material = new MeshBasicMaterial({
        color: new Color(config.color ?? 0xffffff),
        transparent: config.transparent ?? true,
        opacity: config.opacity ?? 1,
        wireframe: config.wireframe ?? false,
        side: config.side === 'back' ? BackSide :
            config.side === 'double' ? DoubleSide : FrontSide,
        // depthWrite: true,
        polygonOffset: enablePolygonOffset,
        polygonOffsetFactor: enablePolygonOffset ? depthOffset : 0,
        polygonOffsetUnits: enablePolygonOffset ? depthOffset : 0,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
    });

    const fillMesh = new Mesh(geometry, material);

    // 水面同款：先在 XY 平面生成，再旋转到 XZ 平面
    fillMesh.rotation.x = -Math.PI / 2;
    fillMesh.position.set(center.x, avgY, center.z);

    // === 可选边框线 ===
    const hasBorder = (config.borderWidth ?? 0) > 0;
    if (hasBorder) {
        const borderColor = config.borderColor ?? config.color ?? 0x000000;

        const borderStyle: BaseLineStyle = {
            type: "basic-line",
            color: borderColor,
            width: config.borderWidth,
            // dashArray: config.borderdashArray,
            // opacity: config.opacity
        } as any;

        // 使用与 _createPolygonGeometry 相同的投影方式：
        // 只用 x/z 生成 2D 形状，忽略高度 y
        const localPositions: number[] = [];
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];

            localPositions.push(
                x - center.x,          // 对应 shapePoints.x
                -(z - center.z),       // 对应 shapePoints.y
                0                      // 与 ShapeGeometry 一样，初始在 XY 平面
            );
        }

        const borderLine = _createBasicLine(borderStyle, localPositions);
        // 在“平面法线方向”稍微抬一点，避免 z-fighting。
        // 注意：这里的 z 是旋转前的局部 Z，旋转后会变成世界坐标的 Y（高度）
        borderLine.position.z += 0.1;

        fillMesh.add(borderLine);
    }

    return fillMesh;
}



/**
 * 创建拉伸多边形
 * @param config 拉伸样式配置
 * @param flatPositions 平面坐标数组
 * @returns 拉伸多边形网格
  * @category Utils
 */
export function _createExtrudedPolygon(
    config: ExtrudeStyle,
    flatPositions: number[]
): Mesh {
    const height = config.extrude?.height || 2000;

    // 创建顶点数据
    const vertices = [];
    const baseVertices = [];
    const topVertices = [];

    for (let i = 0; i < flatPositions.length; i += 3) {
        const x = flatPositions[i];
        const y = flatPositions[i + 1];
        const z = flatPositions[i + 2];

        baseVertices.push(new Vector3(x, y, z));
        topVertices.push(new Vector3(x, y + height, z));
    }

    vertices.push(...baseVertices, ...topVertices);

    // 创建几何体
    const geometry = new BufferGeometry();
    geometry.setFromPoints(vertices);

    // 创建索引
    const indices = [];
    const len = baseVertices.length;

    // 侧面索引
    for (let i = 0; i < len; i++) {
        const next = (i + 1) % len;
        indices.push(i, i + len, next);
        indices.push(next, i + len, next + len);
    }

    // 底面和顶面索引
    for (let i = 2; i < len; i++) {
        indices.push(0, i - 1, i);
        indices.push(len, len + i - 1, len + i);
    }

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // 创建自定义着色器材质
    const material = new ShaderMaterial({
        uniforms: {
            uColor: { value: new Color(config.color ?? 0xffffff) },
            uOpacity: { value: config.opacity ?? 1 },
            uBrightness: { value: 1.2 }
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uBrightness;
          varying vec3 vWorldPosition;
          varying vec3 vNormal;
      
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            float innerGlow = smoothstep(0.3, 0.8, length(vWorldPosition - vec3(0.0))) * uBrightness;
            vec3 finalColor = uColor * (1.0 + fresnel * 0.5 + innerGlow);
            gl_FragColor = vec4(finalColor, uOpacity);
            if (uOpacity >= 0.99) gl_FragDepthEXT = gl_FragCoord.z;
          }
        `,
        transparent: config.transparent ?? true,
        side: DoubleSide,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
    });

    const mesh = new Mesh(geometry, material);
    // mesh.renderOrder = 5000;
    return mesh;
}

/**
 * 创建水面效果
 * @param config 水面样式配置
 * @param map 地图实例
 * @param vertices 顶点坐标数组
 * @returns 水面网格
  * @category Utils
 */
export function _createWaterSurface(
    config: WaterStyle,
    map: Map,
    vertices: number[]
): Water {
    const { geometry, center, avgY } = _createPolygonGeometry(vertices);

    const water = new Water(geometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new TextureLoader().load(config.normalMap, function (texture) {
            texture.wrapS = texture.wrapT = RepeatWrapping;
        }),
        waterColor: config.color || '#19AAEE',
        sunColor: config.sunColor || '#05FFF8',
        distortionScale: 1,
        alpha: config.opacity || 0.8,
        // depthTest: config.depthTest ?? true,
        // depthWrite: config.depthWrite ?? true,
    });

    // 设置渲染回调
    const before = water.onBeforeRender;
    const after = water.onAfterRender;
    water.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
        map.autoUpdate = false;
        before.call(water, renderer, scene, camera, geometry, material, group);
    };
    water.onAfterRender = (renderer, scene, camera, geometry, material, group) => {
        map.autoUpdate = true;
        after.call(water, renderer, scene, camera, geometry, material, group);
    };

    water.material.uniforms["size"].value = 0.1;
    water.rotation.x = -Math.PI / 2;
    water.position.set(center.x, avgY, center.z);

    // 添加动画更新
    map.viewer.addEventListener("update", () => {
        water.material.uniforms["time"].value += 1.0 / 60.0;
    });

    return water;
}

/**
 * 创建多边形几何体
 * @param vertices 顶点坐标数组
 * @returns 几何体及相关数据
  * @category Utils
 */
export function _createPolygonGeometry(
    vertices: number[]
) {
    // 计算平均Y值
    let avgY = 0;
    for (let i = 1; i < vertices.length; i += 3) {
        avgY += vertices[i];
    }
    avgY /= (vertices.length / 3);

    // 计算中心点
    const center = { x: 0, z: 0 };
    const shapePoints = [];
    for (let i = 0; i < vertices.length; i += 3) {
        center.x += vertices[i];
        center.z += vertices[i + 2];
    }
    center.x /= (vertices.length / 3);
    center.z /= (vertices.length / 3);

    // 转换为局部坐标
    for (let i = 0; i < vertices.length; i += 3) {
        shapePoints.push(new Vector2(
            vertices[i] - center.x,
            -(vertices[i + 2] - center.z)
        ));
    }

    // 创建几何体
    const shape = new Shape(shapePoints);
    const geometry = new ShapeGeometry(shape);
    return {
        geometry,
        center,
        avgY
    };
}

/**
 * 创建基础水面
 * @param config 水面样式配置
 * @param vertices 顶点坐标数组
 * @returns Promise<Mesh> 水面网格
 */
export async function _createBaseWaterSurface(
    config: WaterStyle,
    vertices: number[],
): Promise<Mesh> {
    const { geometry, center, avgY } = _createPolygonGeometry(vertices);

    // 加载多层法线贴图
    const normalMap1 = await Style._loadTexture(config.normalMap);
    const normalMap2 = await Style._loadTexture(config.normalMap); // 可以用不同的法线贴图

    normalMap1.wrapS = normalMap1.wrapT = RepeatWrapping;
    normalMap2.wrapS = normalMap2.wrapT = RepeatWrapping;

    // 不同尺度的波纹
    normalMap1.repeat.set(0.015, 0.015); // 大波纹
    normalMap2.repeat.set(0.005, 0.005); // 小波纹

    // 创建材质
    const waterMaterial = new MeshStandardMaterial({
        color: new Color(config.color).multiplyScalar(3.5),
        roughness: 0.1,        // 稍微增加粗糙度更真实
        metalness: 0.8,
        transparent: config.transparent ?? true,
        opacity: 0.9,
        fog: false,
        normalMap: normalMap1,
        normalScale: new Vector2(1.5, 1.5),
        // environmentMap: viewer.scene.environment, 
        envMapIntensity: 2.0, // 提高环境贴图的强度，让反射更亮
        // clearcoat: 1.0,        // 启用 Clearcoat，强度 1.0
        // clearcoatRoughness: 0.0, // Clearcoat 粗糙度 0.0，实现锋利高光
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
    });

    const water = new Mesh(geometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(center.x, avgY + 0.15, center.z);
    water.castShadow = false;
    water.receiveShadow = true;

    let lastTime = 0;

    water.onBeforeRender = () => {
        const time = performance.now();
        const delta = lastTime ? (time - lastTime) / 1000 : 0.016;

        // 第一层：慢速大波纹
        normalMap1.offset.x += delta * 0.08;
        normalMap1.offset.y += delta * 0.03;

        // 第二层：快速小波纹
        normalMap2.offset.x -= delta * 0.12;
        normalMap2.offset.y += delta * 0.02;



        // 轻微的高度波动（模拟水面起伏）
        water.position.y = avgY + 0.5 + Math.sin(time * 0.02) * 0.02;


        lastTime = time;
    };

    return water;
}

// 简单的噪声函数
// @ts-ignore
function noise(x: any) {
    return Math.sin(x) * 0.5 + Math.sin(x * 2.3) * 0.25 + Math.sin(x * 5.7) * 0.125;
}


/**
 * 创建云朵效果
 * @param config 云朵样式配置
 * @param position 云朵位置
 * @returns 云朵对象
  * @category Utils
 */
export function _createClouds(
    config: CloudStyle, position: Vector3
) {
    config.color = new Color(config.hexcolor);
    if (config.boundstext) {
        config.bounds = new Vector3(config.boundstext.x, config.boundstext.y, config.boundstext.z);
    }

    const cloud = new vanillaCloud(config);
    cloud.castShadow = true;
    cloud.scale.setScalar(50);
    cloud.position.copy(position);
    return cloud;
}

/**
 * 创建文本精灵
 * @param config 文本样式配置
 * @param position 文本位置
 * @returns Promise<Sprite> 文本精灵
 */
export async function _createTextSprite(config: LabelStyle, position: Vector3): Promise<Sprite> {
    // 默认配置
    const textStyleConfig = {
        fontSizeDpi: 48,
        fontFamily: "'Microsoft YaHei', sans-serif",
        fontWeight: 'bold',
        fontStyle: 'normal',
        textColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
        showBackground: true,
        bgStyle: 1,
        bgColor: '#3498db',
        bgOpacity: 0.8,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 5,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        roundRectRadius: 20,
        bubblePointerHeight: 10,
        bubblePointerWidth: 15,
        bubbleBorderColor: '#ffffff',
        bubbleBorderWidth: 3,
        // 和 canvas-label-fixed 对齐的“屏幕尺寸”参数，fixedSize 作为兼容别名
        screenSpaceSize: 20,
        fixedSize: 50,
    };

    // 合并配置
    const finalConfig = { ...textStyleConfig, ...config };

    // 优先使用 screenSpaceSize，如果只传了 fixedSize，则映射到 screenSpaceSize
    if (finalConfig.screenSpaceSize == null && finalConfig.fixedSize != null) {
        finalConfig.screenSpaceSize = finalConfig.fixedSize;
    }

    // 和 _createFixedSizeTextSprite 一样的规则：
    // 如果调用方显式给了 screenSpaceSize/fixedSize，但没给 fontSizeDpi，
    // 就按 screenSpaceSize * (dpr * 4) 推导 fontSizeDpi（过采样保证清晰）
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    const oversample = dpr * 4;
    const hasExplicitSizeParam = config.screenSpaceSize != null || config.fixedSize != null;

    if (config.fontSizeDpi == null && hasExplicitSizeParam) {
        const baseSize =
            config.screenSpaceSize ??
            config.fixedSize ??
            finalConfig.screenSpaceSize;
        finalConfig.fontSizeDpi = baseSize * oversample;
    }

    // Clamp 一下，避免极端值
    finalConfig.fontSizeDpi = Math.min(Math.max(finalConfig.fontSizeDpi, 8), 128);

    // 创建Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas context is null');

    // 设置字体和计算尺寸
    const fontString = `${finalConfig.fontStyle} ${finalConfig.fontWeight} ${finalConfig.fontSizeDpi}px ${finalConfig.fontFamily}`;
    ctx.font = fontString;

    const padding = finalConfig.showBackground ? 20 : 0;
    const minWidth = 100;
    const minHeight = 50;

    const textMetrics = ctx.measureText(finalConfig.text);
    const textWidth = Math.max(minWidth, textMetrics.width + padding * 2);
    const textHeight = Math.max(minHeight, finalConfig.fontSizeDpi * 1.5 + padding * 2);

    canvas.width = Math.min(textWidth, 2048);
    canvas.height = Math.min(textHeight, 2048);

    // 重新设置上下文
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontString;

    // 绘制背景（如果启用）
    if (finalConfig.showBackground) {
        if (finalConfig.bgStyle === 1) {
            // 圆角矩形背景
            ctx.fillStyle = finalConfig.bgColor;
            ctx.globalAlpha = finalConfig.bgOpacity;
            ctx.beginPath();
            roundRect(ctx, padding / 2, padding / 2, canvas.width - padding, canvas.height - padding, finalConfig.roundRectRadius);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // 阴影效果
            ctx.shadowColor = finalConfig.shadowColor;
            ctx.shadowBlur = finalConfig.shadowBlur;
            ctx.shadowOffsetX = finalConfig.shadowOffsetX;
            ctx.shadowOffsetY = finalConfig.shadowOffsetY;
        } else {
            // 气泡背景
            ctx.fillStyle = finalConfig.bgColor;
            ctx.globalAlpha = finalConfig.bgOpacity;
            ctx.beginPath();
            drawSpeechBubble(
                ctx,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width * 0.8,
                canvas.height * 0.8,
                finalConfig.roundRectRadius,
                finalConfig.bubblePointerHeight,
                finalConfig.bubblePointerWidth
            );
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // 气泡边框
            ctx.strokeStyle = finalConfig.bubbleBorderColor;
            ctx.lineWidth = finalConfig.bubbleBorderWidth;
            ctx.stroke();
        }
    }

    // 绘制文字（带描边）
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 先绘制描边
    if (finalConfig.strokeWidth > 0) {
        ctx.strokeStyle = finalConfig.strokeColor;
        ctx.lineWidth = finalConfig.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(finalConfig.text, canvas.width / 2, canvas.height / 2);
    }

    // 再绘制填充文字
    ctx.fillStyle = finalConfig.textColor;
    ctx.fillText(finalConfig.text, canvas.width / 2, canvas.height / 2);

    // 重置阴影
    ctx.shadowColor = 'transparent';

    // 创建sprite
    const texture = new CanvasTexture(canvas);
    texture.magFilter = NearestFilter;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = 16;

    const material = new SpriteMaterial({
        map: texture,
        transparent: config.transparent ?? true,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
        fog: false
    });

    const sprite = new Sprite(material);

    // 设置固定大小：这里也统一用 screenSpaceSize 作为主参数
    const fixedScale = finalConfig.screenSpaceSize ?? finalConfig.fixedSize;
    sprite.scale.set(
        canvas.width * fixedScale / 100,
        canvas.height * fixedScale / 100,
        1
    );

    // 处理 anchor 和 textOffset
    const anchor = config.anchor || [0.5, 0.5];
    const textOffset = config.textOffset || { x: 0, y: 0 };
    
    // 计算中心点偏移：textOffset 单位是像素，需要根据 canvas 尺寸转换为 UV 偏移
    sprite.center.set(
        anchor[0] - textOffset.x / canvas.width,
        anchor[1] + textOffset.y / canvas.height 
    );

    if (position) {
        sprite.position.copy(position);
    }

    // sprite.renderOrder = 9999;

    return sprite;
}

/**
 * 创建固定大小的文本精灵
 * @param config 文本样式配置
 * @param position 文本位置
 * @param map 地图实例
 * @returns Promise<Sprite> 文本精灵
 */
export async function _createFixedSizeTextSprite(
    config: LabelStyle,
    position: Vector3,
    map: Map,
): Promise<Sprite> {
    // 默认配置
    const defaults = {
        fontSizeDpi: 48,
        fontFamily: "'Microsoft YaHei', sans-serif",
        fontWeight: 'bold',
        fontStyle: 'normal',
        textColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
        showBackground: true,
        bgStyle: 1,
        bgColor: '#3498db',
        bgOpacity: 0.8,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowBlur: 5,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        roundRectRadius: 20,
        bubblePointerHeight: 10,
        bubblePointerWidth: 15,
        bubbleBorderColor: '#ffffff',
        bubbleBorderWidth: 3,
        screenSpaceSize: 20,
        maxVisibleDistance: Infinity
    };

    // 合并配置
    const finalConfig = { ...defaults, ...config };

    // 如果只传了 fixedSize，当作 screenSpaceSize 用（参数名统一）
    if (finalConfig.screenSpaceSize == null && config.fixedSize != null) {
        finalConfig.screenSpaceSize = config.fixedSize;
    }

    // 根据 screenSpaceSize 自动推导 fontSize（过采样），
    // 调用方可以完全不传 fontSize，只设一个 screenSpaceSize。
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    const oversample = dpr * 4; // 2×DPR 过采样，保证清晰
    if (config.fontSizeDpi == null) {
        finalConfig.fontSizeDpi = finalConfig.screenSpaceSize * oversample;
    }
    // Clamp 一下，避免极端值
    finalConfig.fontSizeDpi = Math.max(finalConfig.fontSizeDpi, 8);

    // 创建Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // 设置字体和计算尺寸
    const fontString = `${finalConfig.fontStyle} ${finalConfig.fontWeight} ${finalConfig.fontSizeDpi}px ${finalConfig.fontFamily}`;
    ctx.font = fontString;

    const padding = finalConfig.showBackground ? 20 : 0;
    const minWidth = 100;
    const minHeight = 50;

    const textMetrics = ctx.measureText(finalConfig.text);
    const textWidth = Math.max(minWidth, textMetrics.width + padding * 2);
    const textHeight = Math.max(minHeight, finalConfig.fontSizeDpi * 1.5 + padding * 2);

    canvas.width = Math.min(textWidth, 2048);
    canvas.height = Math.min(textHeight, 2048);

    // 绘制背景和文字
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontString;

    if (finalConfig.showBackground) {
        if (finalConfig.bgStyle === 1) {
            // 圆角矩形背景
            ctx.fillStyle = finalConfig.bgColor;
            ctx.globalAlpha = finalConfig.bgOpacity;
            ctx.beginPath();
            roundRect(ctx, padding / 2, padding / 2, canvas.width - padding, canvas.height - padding, finalConfig.roundRectRadius);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.shadowColor = finalConfig.shadowColor;
            ctx.shadowBlur = finalConfig.shadowBlur;
            ctx.shadowOffsetX = finalConfig.shadowOffsetX;
            ctx.shadowOffsetY = finalConfig.shadowOffsetY;
        } else {
            // 气泡背景
            ctx.fillStyle = finalConfig.bgColor;
            ctx.globalAlpha = finalConfig.bgOpacity;
            ctx.beginPath();
            drawSpeechBubble(
                ctx,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width * 0.8,
                canvas.height * 0.8,
                finalConfig.roundRectRadius,
                finalConfig.bubblePointerHeight,
                finalConfig.bubblePointerWidth
            );
            ctx.fill();
            ctx.globalAlpha = 1.0;

            ctx.strokeStyle = finalConfig.bubbleBorderColor;
            ctx.lineWidth = finalConfig.bubbleBorderWidth;
            ctx.stroke();
        }
    }

    // 绘制文字
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (finalConfig.strokeWidth > 0) {
        ctx.strokeStyle = finalConfig.strokeColor;
        ctx.lineWidth = finalConfig.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(finalConfig.text, canvas.width / 2, canvas.height / 2);
    }

    ctx.fillStyle = finalConfig.textColor;
    ctx.fillText(finalConfig.text, canvas.width / 2, canvas.height / 2);
    ctx.shadowColor = 'transparent';

    // 创建Sprite
    const texture = new CanvasTexture(canvas);
    const material = new SpriteMaterial({
        map: texture,
        transparent: config.transparent ?? true,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? true,
        fog: false
    });

    const sprite = new Sprite(material);

    // 处理 anchor 和 textOffset
    const anchor = config.anchor || [0.5, 0.5];
    const textOffset = config.textOffset || { x: 0, y: 0 };
    
    // canvas-label-fixed 是屏幕空间大小，textOffset 应被视为 CSS 像素
    // canvas.height 对应 screenSpaceSize (CSS像素)
    // 所以 Y 轴偏移比例 = textOffset.y / screenSpaceSize
    // X 轴偏移比例 = textOffset.x / (screenSpaceSize * aspect)
    const cssHeight = finalConfig.screenSpaceSize;
    const cssWidth = cssHeight * (canvas.width / canvas.height);

    sprite.center.set(
        anchor[0] - textOffset.x / cssWidth,
        anchor[1] + textOffset.y / cssHeight 
    );

    sprite.position.copy(position);
    // sprite.renderOrder = 9999;
    sprite.userData.isLabel = true;

    // 动态更新大小：screenSpaceSize 以“CSS 像素高度”理解
    const updateSize = () => {
        if (!sprite.visible) return;

        // 计算相机距离
        const distance = map.viewer.camera.position.distanceTo(sprite.position);

        // 距离裁剪
        if (distance > finalConfig.maxVisibleDistance) {
            sprite.visible = false;
            return;
        }
        sprite.visible = true;

        // 获取渲染器尺寸（设备像素）
        const size = new Vector2();
        map.viewer.renderer.getSize(size);

        const viewportHeight = size.height;
        const fovRad = MathUtils.degToRad(map.viewer.camera.fov);

        const dprLocal = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
        const targetDevicePixels = finalConfig.screenSpaceSize * dprLocal;

        // worldHeight = targetDevicePixels * 2 * distance * tan(fov/2) / viewportHeight
        const scale = (targetDevicePixels / canvas.height) *
            (2 * distance * Math.tan(fovRad / 2) / viewportHeight);

        sprite.scale.set(scale * canvas.width, scale * canvas.height, 1);

        // 使文字始终面向相机
        sprite.lookAt(map.viewer.camera.position);
    };

    // 初始化和绑定事件
    updateSize();
    const onBeforeRender = () => updateSize();
    // @ts-ignore
    sprite.addEventListener('dispose', () => {
        map.viewer.renderer.domElement.removeEventListener('resize', updateSize);
    });

    map.viewer.renderer.domElement.addEventListener('resize', updateSize);
    // @ts-ignore
    map.viewer.camera.addEventListener('change', updateSize);
    sprite.onBeforeRender = onBeforeRender;

    return sprite;
}
/**
 * 创建带有图标和文本的Sprite标签
 */
export async function _createIconLabelSprite(options: IconLabelStyle, position: Vector3): Promise<Sprite> {
    // 1. 在这里统一处理默认值
    // 支持 size 或 iconSize 两种写法，保持和 _createIconPoint 入参习惯一致
    const rawIconSize = (options as any).size ?? options.iconSize;

    const settings: LabelSettings = {
        text: options.text || '',
        iconSize: rawIconSize,
        fontSize: options.fontSize ?? 12,
        fontFamily: options.fontFamily || '微软雅黑',
        fontWeight: options.fontWeight ?? 400,
        padding: { top: 3, right: 6, bottom: 3, left: 6, ...options.padding },
        bgColor: options.bgColor || '#ffffff',
        bgOpacity: options.bgOpacity ?? 1,
        textColor: options.textColor || '#000000',
        strokeColor: options.strokeColor || '#000000',
        strokeWidth: options.strokeWidth ?? 0,
        iconScale: options.iconScale ?? 1,
        renderbg: options.renderbg ?? true,
        textOffset: options.textOffset ?? { x: -40, y: -19 },
        depthTest: options.depthTest ?? false,
        depthWrite: options.depthWrite ?? false,
        transparent: options.transparent ?? true,
        canvasScale: 4 // 固定 4 倍采样解决模糊
    } as any;

    //  加载图标
    let iconImage: HTMLImageElement | null = null;
    if (options.url) {
        try {
            iconImage = await loadImage(options.url);
        } catch (e) {
            console.error('Label icon load failed:', options.url);
        }
    }

    // 核心绘图 - 确保 settings 被完整传进去
    const { canvas, width, height, center } = await createLabelCanvas(settings, iconImage);

    // 纹理处理
    const texture = new Texture(canvas);
    texture.generateMipmaps = true;  // 生成 Mipmap
    texture.minFilter = LinearMipmapLinearFilter;  // 三线性（质量最好）
    texture.magFilter = LinearFilter;  // 双线性
    texture.colorSpace = SRGBColorSpace;
    // texture.format = RGBAFormat;
    texture.premultiplyAlpha = false;  // 明确设置
    texture.needsUpdate = true;

    // 材质与物体
    const spriteMaterial = new SpriteMaterial({
        map: texture,
        transparent: settings.transparent ?? true,
        depthTest: settings.depthTest ?? true,
        depthWrite: settings.depthWrite ?? true,
        blending: NormalBlending,
        sizeAttenuation: false,
        premultipliedAlpha: false,
        alphaTest: 0.05,
    });

    const sprite = new Sprite(spriteMaterial);

    // 和 _createIconPoint 保持一致的像素→世界单位比例
    const pixelToWorldScale = 0.002;
    sprite.scale.set(width * pixelToWorldScale, height * pixelToWorldScale, 1);
    // sprite.center.set(center[0], center[1]);
    // 如果调用方传了 anchor，则覆盖默认锚点；否则用图标中心
    if (options.anchor) {
        sprite.center.set(options.anchor[0], options.anchor[1]);
    } else {
        sprite.center.set(center[0], center[1]);
    }
    if (position) sprite.position.copy(position);

    return sprite;
}

async function createLabelCanvas(settings: LabelSettings, iconImage: HTMLImageElement | null): Promise<CanvasResult> {
    return new Promise((resolve) => {
        const {
            text, fontSize, fontFamily, padding,
            bgColor, textColor, strokeColor, strokeWidth, iconScale,
            canvasScale, renderbg, textOffset, iconSize, fontWeight, bgOpacity
        } = settings;

        const hasIcon = iconImage !== null;

        // === 计算图标的逻辑宽高（保持原始比例） ===
        let iconWidth = 0;
        let iconHeight = 0;

        if (hasIcon && iconImage) {
            const imgWidth = (iconImage.naturalWidth || iconImage.width || 1);
            const imgHeight = (iconImage.naturalHeight || iconImage.height || 1);
            const aspect = imgWidth / imgHeight || 1;

            if (Array.isArray(iconSize)) {
                iconWidth = iconSize[0];
                iconHeight = iconSize[1];
            } else if (typeof iconSize === 'number') {
                // 单值按“高度像素”理解，宽度按图片比例推导
                iconHeight = iconSize;
                iconWidth = iconSize * aspect;
            } else {
                // 未显式指定 iconSize 时，使用原始尺寸（可以视情况再乘一个缩放）
                iconWidth = imgWidth;
                iconHeight = imgHeight;
            }
        } else if (Array.isArray(iconSize)) {
            // 没有图标图片但给了尺寸，按尺寸占位
            iconWidth = iconSize[0];
            iconHeight = iconSize[1];
        } else if (typeof iconSize === 'number') {
            iconWidth = iconSize;
            iconHeight = iconSize;
        }

        // 创建临时画布测量文本
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;

        const fontStr = `${fontWeight} ${fontSize}px ${fontFamily}`;
        tempCtx.font = fontStr;

        const textMetrics = measureTextDimensions(tempCtx, text, fontSize);
        const { width: textWidth, ascent: textAscent, descent: textDescent } = textMetrics;

        // 2. 计算布局（文本相对“图标中心”偏移）
        const iconCenterX = hasIcon ? iconWidth / 2 : 0;
        const iconCenterY = hasIcon ? iconHeight / 2 : 0;

        const textX = iconCenterX + textOffset.x;
        const textY = iconCenterY + textOffset.y;

        // 文本背景边界
        const bgMinX = textX - padding.left;
        const bgMaxX = textX + textWidth + padding.right;
        const bgMinY = textY - textAscent - padding.top;
        const bgMaxY = textY + textDescent + padding.bottom;

        // 计算包含图标和文本的总边界
        let minX: number;
        let minY: number;
        let maxX: number;
        let maxY: number;

        if (hasIcon) {
            minX = Math.min(0, bgMinX);
            minY = Math.min(0, bgMinY);
            maxX = Math.max(iconWidth, bgMaxX);
            maxY = Math.max(iconHeight, bgMaxY);
        } else {
            minX = bgMinX;
            minY = bgMinY;
            maxX = bgMaxX;
            maxY = bgMaxY;
        }

        const logicalWidth = Math.ceil(maxX - minX);
        const logicalHeight = Math.ceil(maxY - minY);

        //  创建主画布
        const { canvas, ctx } = createOptimizedCanvas(logicalWidth, logicalHeight, canvasScale);

        // 计算内容起始位置（从画布原点偏移，使内容居中）
        const contentOffsetX = -minX;
        const contentOffsetY = -minY;

        //  绘制图标
        if (hasIcon && iconImage && iconWidth > 0 && iconHeight > 0) {
            const scaledIconWidth = iconWidth * iconScale;
            const scaledIconHeight = iconHeight * iconScale;
            const iconOffsetX = (iconWidth - scaledIconWidth) / 2;
            const iconOffsetY = (iconHeight - scaledIconHeight) / 2;
            const iconX = contentOffsetX + iconOffsetX;
            const iconY = contentOffsetY + iconOffsetY;

            ctx.drawImage(iconImage, iconX, iconY, scaledIconWidth, scaledIconHeight);
        }

        //  绘制文本背景
        const renderTextX = contentOffsetX + textX;
        const renderTextY = contentOffsetY + textY;

        if (renderbg && bgColor && bgColor !== 'transparent') {
            drawTextBackground(
                ctx,
                renderTextX, renderTextY,
                textWidth, textAscent, textDescent,
                padding, bgColor, bgOpacity
            );
        }

        // 绘制文本
        ctx.font = fontStr;
        drawText(ctx, text, renderTextX, renderTextY, textColor, strokeWidth, strokeColor);

        // 计算锚点（图标中心相对于画布的比例；无图标时用居中）
        let anchorX: number;
        let anchorY: number;

        if (hasIcon && iconWidth > 0 && iconHeight > 0) {
            anchorX = (contentOffsetX + iconCenterX) / logicalWidth;
            anchorY = (contentOffsetY + iconCenterY) / logicalHeight;
        } else {
            anchorX = 0.5;
            anchorY = 0.5;
        }

        resolve({
            canvas,
            width: logicalWidth,
            height: logicalHeight,
            center: [anchorX, 1 - anchorY]  // 转换为 canvas 坐标系
        });
    });
}
/**
 * 绘制圆角矩形
 * @param ctx Canvas上下文
 * @param x 左上角x坐标
 * @param y 左上角y坐标
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角半径
 */
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * 绘制气泡
 * @param ctx Canvas上下文
 * @param cx 中心x坐标
 * @param cy 中心y坐标
 * @param width 宽度
 * @param height 高度
 * @param radius 圆角半径
 * @param pointerHeight 指针高度
 * @param pointerWidth 指针宽度
 */
function drawSpeechBubble(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number,
    radius: number,
    pointerHeight?: number,
    pointerWidth?: number
): void {
    if (width <= 0) throw new Error("Width must be positive");
    if (height <= 0) throw new Error("Height must be positive");
    if (radius < 0) throw new Error("Radius cannot be negative");

    const bubbleWidth = width;
    const bubbleHeight = height;
    const bubbleRadius = Math.min(radius, width / 2, height / 2);
    const pointerHeightValue = pointerHeight ?? 10;
    const pointerWidthValue = pointerWidth ?? 15;

    ctx.beginPath();

    // 开始点：左上角+圆角
    ctx.moveTo(cx - bubbleWidth / 2 + bubbleRadius, cy - bubbleHeight / 2);

    // 顶部线条
    ctx.lineTo(cx + bubbleWidth / 2 - bubbleRadius, cy - bubbleHeight / 2);
    ctx.quadraticCurveTo(
        cx + bubbleWidth / 2, cy - bubbleHeight / 2,
        cx + bubbleWidth / 2, cy - bubbleHeight / 2 + bubbleRadius
    );

    // 右侧线条
    ctx.lineTo(cx + bubbleWidth / 2, cy + bubbleHeight / 2 - bubbleRadius);
    ctx.quadraticCurveTo(
        cx + bubbleWidth / 2, cy + bubbleHeight / 2,
        cx + bubbleWidth / 2 - bubbleRadius, cy + bubbleHeight / 2
    );

    // 底部线条（指针在底部中间）
    ctx.lineTo(cx + pointerWidthValue / 2, cy + bubbleHeight / 2);
    ctx.lineTo(cx, cy + bubbleHeight / 2 + pointerHeightValue);
    ctx.lineTo(cx - pointerWidthValue / 2, cy + bubbleHeight / 2);
    ctx.lineTo(cx - bubbleWidth / 2 + bubbleRadius, cy + bubbleHeight / 2);

    // 左侧线条
    ctx.quadraticCurveTo(
        cx - bubbleWidth / 2, cy + bubbleHeight / 2,
        cx - bubbleWidth / 2, cy + bubbleHeight / 2 - bubbleRadius
    );
    ctx.lineTo(cx - bubbleWidth / 2, cy - bubbleHeight / 2 + bubbleRadius);
    ctx.quadraticCurveTo(
        cx - bubbleWidth / 2, cy - bubbleHeight / 2,
        cx - bubbleWidth / 2 + bubbleRadius, cy - bubbleHeight / 2
    );

    ctx.closePath();
}

// /**
//  * 辅助：绘制圆角矩形
//  */
// function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
//     if (w < 2 * r) r = w / 2;
//     if (h < 2 * r) r = h / 2;
//     ctx.beginPath();
//     ctx.moveTo(x + r, y);
//     ctx.arcTo(x + w, y, x + w, y + h, r);
//     ctx.arcTo(x + w, y + h, x, y + h, r);
//     ctx.arcTo(x, y + h, x, y, r);
//     ctx.arcTo(x, y, x + w, y, r);
//     ctx.closePath();
//     ctx.fill();
// }
// 工具函数：创建并配置画布
function createOptimizedCanvas(width: number, height: number, scale: number): {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
} {
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext('2d', { alpha: true })!;
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
}

// 工具函数：测量文本尺寸
function measureTextDimensions(ctx: CanvasRenderingContext2D, text: string, fontSize: number) {
    const metrics = ctx.measureText(text);
    return {
        width: metrics.width,
        ascent: metrics.actualBoundingBoxAscent || fontSize * 0.8,
        descent: metrics.actualBoundingBoxDescent || fontSize * 0.2,
        totalHeight: (metrics.actualBoundingBoxAscent || fontSize * 0.8) +
            (metrics.actualBoundingBoxDescent || fontSize * 0.2)
    };
}

// 工具函数：绘制圆角矩形
function drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    width: number, height: number,
    radius: number
): void {
    if (radius <= 0) {
        ctx.rect(x, y, width, height);
        return;
    }

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
}

// 工具函数：绘制文本背景
function drawTextBackground(
    ctx: CanvasRenderingContext2D,
    textX: number,
    textY: number,
    textWidth: number,
    textAscent: number,
    textDescent: number,
    padding: LabelSettings['padding'],
    bgColor: string,
    bgOpacity: number = 1
): void {
    const bgX = textX - padding.left;
    const bgY = textY - textAscent - padding.top;
    const bgWidth = textWidth + padding.left + padding.right;
    const bgHeight = (textAscent + textDescent) + padding.top + padding.bottom;

    ctx.save();
    ctx.globalAlpha = bgOpacity;  // 设置全局透明度
    ctx.fillStyle = bgColor;
    drawRoundedRect(ctx, bgX, bgY, bgWidth, bgHeight, 2);
    ctx.fill();
    ctx.restore();
}

// 工具函数：绘制文本
function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    textColor: string,
    strokeWidth: number,
    strokeColor: string
): void {
    ctx.save();
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    // 先描边
    if (strokeWidth > 0) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(text, x, y);
    }

    // 再填充（只填充一次，双重填充效果不明显且影响性能）
    ctx.fillStyle = textColor;
    ctx.fillText(text, x, y);
    ctx.restore();
}
/**
 * 加载图片
 * @param url 图片URL
 * @returns Promise<HTMLImageElement> 图片元素
 */
function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(new Error(`Failed to load image: ${url} ${e}`));
        img.src = url;
    });
}


// 路灯 points
export async function createLight(config: LightStyle, geometries: any, map: Map) {
    // const sprite = createSprite({
    //     image: 'light.png',
    //     position: [0, 0],
    //     center: [0.5, 0.5],
    //     scale: [0.001, 0.001, 1],
    // }, map);
    // return sprite;

    const h = 1.5;
    const colGeometry = new CylinderGeometry(0.2, 0.2, h * 16, 12);
    const colMaterial = new MeshBasicMaterial({ color: config.color });
    const texture = await Style._loadTexture(config.icon as string);
    // const texture = await map.viewer.dataLoader.loadTexture("/threescene/resources/img/texture/effects/proceduralcity/lensflare2_alpha.png");
    const material = new PointsMaterial({
        // color: new THREE.Color(color).multiplyScalar(0.5),
        size: (80 * window.innerHeight / window.innerHeight),
        fog: false,
        opacity: 1,
        transparent: config.transparent ?? true,
        toneMapped: false,
        blending: AdditiveBlending,
        map: texture,
        sizeAttenuation: true,
        depthTest: config.depthTest ?? true,
        depthWrite: config.depthWrite ?? false,
    });

    // 生成网格
    const InstancedCol = new InstancedMesh(colGeometry, colMaterial, geometries.length);
    InstancedCol.position.add(map.prjcenter);
    InstancedCol.castShadow = true;
    // InstancedCol.renderOrder = 1;


    const transform = new Object3D();
    const positionsData = [];
    for (let i = 0; i < geometries.length; i++) {
        const geometry = geometries[i];
        // const coordinates = geometry.coordinates;
        // let xy4326 = { x: coordinates[0], y: coordinates[1], z: 0 };
        const coordinates = new Vector3(
            geometry.coordinates[0] as number,
            geometry.coordinates[1] as number,
            geometry.coordinates[2] as number || 0 // 默认高度0
        );
        // if (xy4326.x > 10000) xy4326 = epsg3857To4326(...coordinates);
        const xy1 = map.projectToWorld(coordinates);
        const xy2 = xy1.sub(map.prjcenter);
        transform.position.copy(xy2);
        transform.updateMatrix();
        InstancedCol.setMatrixAt(i, transform.matrix);
        positionsData.push(xy2.x, 0, xy2.z);
    }
    const positions = new Float32Array(positionsData);
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    const points = new Points(geometry, material);
    points.position.add(map.prjcenter);
    points.position.y = h * 10;
    points.renderOrder = 99999999;
    points.visible = true;

    // console.log(map, 'map');
    // map.viewer.scene.add(points);
    // map.viewer.scene.add(InstancedCol);
    // this.map._viewchangeFuns.push((dis) => {
    //     points.visible = !!(this.map.camera.position.y < 400);
    //     InstancedCol.visible = !!(this.map.camera.position.y < 400);
    // })
    return {
        points,
        InstancedCol,
    }
}




