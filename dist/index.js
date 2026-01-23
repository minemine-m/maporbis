import * as st from "three";
import { Vector3 as I, InstancedBufferGeometry as rd, Matrix4 as xe, Box3 as en, Frustum as Hw, Mesh as Ue, Raycaster as Ps, REVISION as id, TrianglesDrawMode as Vw, TriangleFanDrawMode as Kl, TriangleStripDrawMode as nd, Color as oe, FrontSide as ea, Plane as sd, Vector4 as gr, PerspectiveCamera as qi, WebGLRenderTarget as Cn, UniformsUtils as Ji, UniformsLib as Qo, ShaderMaterial as Ar, MOUSE as ui, TOUCH as hi, Spherical as nf, Quaternion as pr, OrthographicCamera as Ln, Vector2 as ce, Ray as Ww, PlaneGeometry as Fn, HalfFloatType as Xi, AdditiveBlending as mc, MeshBasicMaterial as Kt, RGBAFormat as od, LinearFilter as yi, NoBlending as Gw, Clock as ta, Loader as gc, LoaderUtils as On, FileLoader as vi, MeshPhysicalMaterial as Cr, SpotLight as ad, PointLight as ql, DirectionalLight as Jo, InstancedMesh as _c, InstancedBufferAttribute as Ql, Object3D as mr, TextureLoader as ra, ImageBitmapLoader as jw, BufferAttribute as mt, InterleavedBuffer as $w, InterleavedBufferAttribute as Yi, LinearMipmapLinearFilter as Ls, NearestMipmapLinearFilter as Xw, LinearMipmapNearestFilter as Yw, NearestMipmapNearestFilter as Zw, NearestFilter as ld, RepeatWrapping as _r, MirroredRepeatWrapping as Kw, ClampToEdgeWrapping as Jl, PointsMaterial as ia, Material as Ml, LineBasicMaterial as cd, MeshStandardMaterial as Os, DoubleSide as Un, PropertyBinding as Es, BufferGeometry as qt, SkinnedMesh as ud, LineSegments as qw, Line as hd, LineLoop as Qw, Points as kn, Group as Qt, MathUtils as lt, Skeleton as fd, AnimationClip as dd, Bone as ec, InterpolateDiscrete as Jw, InterpolateLinear as pd, Texture as Rn, VectorKeyframeTrack as tc, NumberKeyframeTrack as rc, QuaternionKeyframeTrack as ic, Interpolant as e1, Sphere as yc, Curve as t1, MeshPhongMaterial as Ss, MeshLambertMaterial as md, EquirectangularReflectionMapping as r1, AmbientLight as gd, Float32BufferAttribute as fi, Uint16BufferAttribute as i1, Matrix3 as n1, Euler as ms, DataTextureLoader as s1, FloatType as Zo, DataUtils as Eo, InstancedInterleavedBuffer as nc, WireframeGeometry as o1, Line3 as a1, EventDispatcher as _d, Scene as l1, FogExp2 as sf, CubeTextureLoader as c1, WebGLRenderer as u1, PCFSoftShadowMap as h1, ACESFilmicToneMapping as f1, SRGBColorSpace as na, CameraHelper as d1, CubicBezierCurve3 as p1, Sprite as tn, DynamicDrawUsage as of, SpriteMaterial as Ds, NormalBlending as yd, CurvePath as vd, LineCurve3 as Dn, QuadraticBezierCurve3 as wd, TubeGeometry as m1, BackSide as g1, Shape as _1, ShapeGeometry as y1, CanvasTexture as Is, CylinderGeometry as v1, AnimationMixer as w1, LoopRepeat as x1, LoopOnce as b1, LoadingManager as T1, Box2 as S1, ImageLoader as xd } from "three";
const M1 = "0.0.1";
var gs = /* @__PURE__ */ ((s) => (s[s.none = 0] = "none", s[s.create = 1] = "create", s[s.remove = 2] = "remove", s))(gs || {});
function A1(s, e) {
  const t = s.position.clone().setZ(s.maxZ).applyMatrix4(s.matrixWorld);
  return e.distanceTo(t);
}
function P1(s) {
  const e = s.scale, t = new I(-e.x, -e.y, 0).applyMatrix4(s.matrixWorld), r = new I(e.x, e.y, 0).applyMatrix4(s.matrixWorld);
  return t.sub(r).length();
}
function E1(s) {
  return s.distToCamera / s.sizeInWorld * 0.8;
}
function C1(s, e, t, r) {
  const i = E1(s);
  if (s.isLeaf) {
    if (s.inFrustum && // Tile is in frustum
    s.z < t && // Tile level < map maxlevel
    (s.z < e || s.showing) && // (Tile level < map minLevel ) || (Parent tile has showed)
    (s.z < e || i < r))
      return 1;
  } else if (s.z >= e && // Tile level >= map minLevel
  (s.z > t || i > r))
    return 2;
  return 0;
}
function L1(s, e, t, r) {
  const i = [], o = r + 1, l = e * 2, c = 0, u = 0.25;
  {
    const f = t * 2, p = new I(0.5, 0.5, 1), d = new En(l, f, o), g = new En(l + 1, f, o), y = new En(l, f + 1, o), b = new En(l + 1, f + 1, o);
    d.position.set(-u, u, c), d.scale.copy(p), g.position.set(u, u, c), g.scale.copy(p), y.position.set(-u, -u, c), y.scale.copy(p), b.position.set(u, -u, c), b.scale.copy(p), i.push(d, g, y, b);
  }
  return i;
}
var O1 = Object.defineProperty, D1 = (s, e, t) => e in s ? O1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Je = (s, e, t) => D1(s, typeof e != "symbol" ? e + "" : e, t);
const I1 = 10, F1 = new rd(), R1 = new I(), B1 = new xe(), U1 = new en(new I(-0.5, -0.5, 0), new I(0.5, 0.5, 1)), af = new Hw(), bd = class _s extends Ue {
  /**
   * Constructor for the Tile class.
   * Tile类的构造函数。
   * @param x - Tile X-coordinate, default: 0. 瓦片X坐标，默认0。
   * @param y - Tile Y-coordinate, default: 0. 瓦片Y坐标，默认0。
   * @param z - Tile level, default: 0. 瓦片层级，默认0。
   */
  constructor(e = 0, t = 0, r = 0) {
    super(F1, []), Je(this, "_dataMode", !1), Je(this, "_vectorData", null), Je(this, "x"), Je(this, "y"), Je(this, "z"), Je(this, "isTile", !0), Je(this, "parent", null), Je(this, "children", []), Je(this, "_isReady", !1), Je(this, "_isVirtualTile", !1), Je(this, "_isVisible", !1), Je(this, "_maxHeight", 0), Je(this, "distToCamera", 0), Je(this, "sizeInWorld", 0), Je(this, "_isLoaded", !1), Je(this, "_inFrustum", !1), this.x = e, this.y = t, this.z = r, this.name = `Tile ${r}-${e}-${t}`, this.up.set(0, 0, 1), this.matrixAutoUpdate = !1;
  }
  /**
  	* Set data only mode (do not create Mesh, only return data)
  	* 设置为数据模式（不创建Mesh，只返回数据）
  	*/
  setDataOnlyMode(e) {
    return this._dataMode = e, e && (this.visible = !1), this;
  }
  /**
   * Check if it is data only mode
   * 检查是否是数据模式
    */
  isDataOnlyMode() {
    return this._dataMode;
  }
  /**
   * Get vector data (only valid in data mode)
   * 获取矢量数据（仅数据模式有效）
   */
  getVectorData() {
    return this._vectorData;
  }
  /**
   * Number of download threads.
   * 下载线程数
   */
  static get downloadThreads() {
    return _s._activeDownloads;
  }
  get isDummy() {
    return this._isVirtualTile;
  }
  // private _wasShowing = false; // Record last showing value 记录上一次 showing 的值
  /**
   * Gets the showing state of the tile.
   * 获取瓦片的显示状态。
   */
  get showing() {
    return this._isVisible;
  }
  /**
   * Sets the showing state of the tile.
   * 设置瓦片的显示状态。
   * @param value - The new showing state. 新的显示状态。
   */
  set showing(e) {
    const t = this._isVisible;
    this._isVisible = e, this.material.forEach((r) => r.visible = e), t === !1 && this._isVisible === !0 && this._isLoaded && this.dispatchEvent({ type: "tile-shown", tile: this }), t === !0 && this._isVisible === !1 && this.dispatchEvent({ type: "tile-hidden", tile: this });
  }
  /**
   * Gets the maximum height of the tile.
   * 获取瓦片的最大高度。
   */
  get maxZ() {
    return this._maxHeight;
  }
  /**
   * Sets the maximum height of the tile.
   * 设置瓦片的最大高度。
   * @param value - The new maximum height. 新的最大高度。
   */
  set maxZ(e) {
    this._maxHeight = e;
  }
  /**
   * Gets the index of the tile in its parent's children array.
   * 获取瓦片在父节点子数组中的索引。
   * @returns The index of the tile. 瓦片的索引。
   */
  get index() {
    return this.parent ? this.parent.children.indexOf(this) : -1;
  }
  /**
   * Gets the load state of the tile.
   * 获取瓦片的加载状态。
   */
  get loaded() {
    return this._isLoaded;
  }
  /** Is tile in frustum ? 瓦片是否在视锥体中？ */
  get inFrustum() {
    return this._inFrustum;
  }
  /**
   * Sets whether the tile is in the frustum.
   * 设置瓦片是否在视锥体中。
   * @param value - The new frustum state. 新的视锥体状态。
   */
  set inFrustum(e) {
    this._inFrustum = e;
  }
  /** Tile is a leaf ? 瓦片是否是叶子节点？ */
  get isLeaf() {
    return this.children.filter((e) => e.isTile).length === 0;
  }
  /**
   * Override Object3D.traverse, change the callback param type to "this".
   * 重写 Object3D.traverse，将回调参数类型更改为 "this"。
   * @param callback - The callback function. 回调函数。
   */
  traverse(e) {
    e(this), this.children.forEach((t) => {
      t.isTile && t.traverse(e);
    });
  }
  /**
   * Override Object3D.traverseVisible, change the callback param type to "this".
   * 重写 Object3D.traverseVisible，将回调参数类型更改为 "this"。
   * @param callback - The callback function. 回调函数。
   */
  traverseVisible(e) {
    this.visible && (e(this), this.children.forEach((t) => {
      t.isTile && t.traverseVisible(e);
    }));
  }
  /**
   * Override Object3D.raycast, only test the tile has loaded.
   * 重写 Object3D.raycast，仅测试已加载的瓦片。
   * @param raycaster - The raycaster. 射线投射器。
   * @param intersects - The array of intersections. 交点数组。
   */
  raycast(e, t) {
    this.showing && this.loaded && this.isTile && super.raycast(e, t);
  }
  /**
   * LOD (Level of Detail).
   * LOD（细节层次）。
   * @param params - The tile loader. 瓦片加载器。
   * @returns this
   */
  _updateLOD(e) {
    if (_s.downloadThreads > I1)
      return { action: gs.none };
    let t = [];
    const { loader: r, minLevel: i, maxLevel: o, LODThreshold: l } = e, c = C1(this, i, o, l);
    return c === gs.create && (t = L1(r, this.x, this.y, this.z), this.add(...t)), { action: c, newTiles: t };
  }
  /**
   * Checks the visibility of the tile.
   */
  _checkVisibility() {
    const e = this.parent;
    if (e && e.isTile) {
      const t = e.children.filter((i) => i.isTile), r = t.every((i) => i.loaded);
      e.showing = !r, t.forEach((i) => i.showing = r);
    }
    return this;
  }
  /**
   * Asynchronously load tile data
   *
   * @param loader Tile loader
   * @returns this
   */
  async _loadData(e) {
    _s._activeDownloads++;
    const { x: t, y: r, z: i } = this;
    if (this._dataMode)
      try {
        const o = await e.load({
          x: t,
          y: r,
          z: i,
          bounds: [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
        });
        this._vectorData = o.geometry?.userData || {}, this._isLoaded = !0, this.dispatchEvent({
          type: "vector-data-loaded",
          data: this._vectorData,
          tile: this
        });
      } catch (o) {
        console.error(`数据模式加载失败 ${i}/${t}/${r}:`, o), this._isLoaded = !1;
      }
    else {
      const o = await e.load({
        x: t,
        y: r,
        z: i,
        bounds: [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
      });
      this.material = o.materials, this.geometry = o.geometry, this.maxZ = this.geometry.boundingBox?.max.z || 0, this._isLoaded = !0;
    }
    return _s._activeDownloads--, this;
  }
  /** New tile init */
  _initTile() {
    this.updateMatrix(), this.updateMatrixWorld(), this.sizeInWorld = P1(this);
  }
  /**
   * Updates the tile.
   * @param params - The update parameters.
   * @returns this
   */
  update(e) {
    if (console.assert(this.z === 0), !this.parent)
      return this;
    af.setFromProjectionMatrix(
      B1.multiplyMatrices(e.camera.projectionMatrix, e.camera.matrixWorldInverse)
    );
    const t = e.camera.getWorldPosition(R1);
    return this.traverse((r) => {
      r.receiveShadow = this.receiveShadow, r.castShadow = this.castShadow;
      const i = U1.clone().applyMatrix4(r.matrixWorld);
      r.inFrustum = af.intersectsBox(i), r.distToCamera = A1(r, t);
      const { action: o, newTiles: l } = r._updateLOD(e);
      this._processLODAction(r, o, l, e);
    }), this._checkReadyState(), this;
  }
  _processLODAction(e, t, r, i) {
    return t === gs.create ? r?.forEach((o) => {
      o._initTile(), o._isVirtualTile = o.z < i.minLevel, this.dispatchEvent({ type: "tile-created", tile: o }), o.isDummy || o._loadData(i.loader).then(() => {
        o._checkVisibility(), this.dispatchEvent({ type: "tile-loaded", tile: o });
      });
    }) : t === gs.remove && (e.showing = !0, e._disposeResources(!1, i.loader), this.dispatchEvent({ type: "tile-unload", tile: e })), this;
  }
  /**
   * Reloads the tile data.
   * @returns this
   */
  reload(e) {
    return this._disposeResources(!0, e), this;
  }
  /**
   * Checks if the tile is ready to render.
   * @returns this
   */
  _checkReadyState() {
    return this._isReady || (this._isReady = !0, this.traverse((e) => {
      if (e.isLeaf && e.loaded && !e.isDummy) {
        this._isReady = !1;
        return;
      }
    }), this._isReady && this.dispatchEvent({ type: "ready" })), this;
  }
  /**
   * UnLoads the tile data.
   * @param disposeSelf - Whether to unload tile itself.
   * @returns this.
   */
  // private _disposeResources(disposeSelf: boolean, loader: ITileLoader) {
  // 	if (disposeSelf && this.isTile && !this.isDummy) {
  // 		this.dispatchEvent({ type: "unload" });
  // 		loader?.unload?.(this);
  // 	}
  // 	// remove all children recursively
  // 	this.children.forEach(child => child._disposeResources(true, loader));
  // 	this.clear();
  // 	return this;
  // }
  _disposeResources(e, t) {
    return e && this.isTile && !this.isDummy && (this.dispatchEvent({ type: "unload" }), t?.unload?.(this)), this.children.forEach((r) => r._disposeResources(!0, t)), this.clear(), this;
  }
};
Je(bd, "_activeDownloads", 0);
let En = bd;
function Td(s, e) {
  const t = s.getLayers().find((o) => o.isBaseLayer === !0);
  if (!t || !t._rootTile)
    return;
  const r = t._rootTile, i = e.intersectObjects([r]);
  for (const o of i)
    if (o.object instanceof En) {
      const l = o.point.clone(), c = s.unproject(l);
      return Object.assign(o, {
        location: c
      });
    }
}
function sc(s, e) {
  const t = new I(0, -1, 0), r = new I(e.x, 10 * 1e3, e.z), i = new Ps(r, t);
  return Td(s, i);
}
function Sd(s, e, t) {
  const r = new Ps();
  return r.setFromCamera(t, s), Td(e, r);
}
function KA(s, e) {
  const t = s.projectToWorld(e);
  return sc(s, t);
}
function qA(s, e) {
  return e.getZoom();
}
var Ms = function() {
  var s = 0, e = document.createElement("div");
  e.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", e.addEventListener("click", function(p) {
    p.preventDefault(), r(++s % e.children.length);
  }, !1);
  function t(p) {
    return e.appendChild(p.dom), p;
  }
  function r(p) {
    for (var d = 0; d < e.children.length; d++)
      e.children[d].style.display = d === p ? "block" : "none";
    s = p;
  }
  var i = (performance || Date).now(), o = i, l = 0, c = t(new Ms.Panel("FPS", "#0ff", "#002")), u = t(new Ms.Panel("MS", "#0f0", "#020"));
  if (self.performance && self.performance.memory)
    var f = t(new Ms.Panel("MB", "#f08", "#201"));
  return r(0), {
    REVISION: 16,
    dom: e,
    addPanel: t,
    showPanel: r,
    begin: function() {
      i = (performance || Date).now();
    },
    end: function() {
      l++;
      var p = (performance || Date).now();
      if (u.update(p - i, 200), p >= o + 1e3 && (c.update(l * 1e3 / (p - o), 100), o = p, l = 0, f)) {
        var d = performance.memory;
        f.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
      }
      return p;
    },
    update: function() {
      i = this.end();
    },
    // Backwards Compatibility
    domElement: e,
    setMode: r
  };
};
Ms.Panel = function(s, e, t) {
  var r = 1 / 0, i = 0, o = Math.round, l = o(window.devicePixelRatio || 1), c = 80 * l, u = 48 * l, f = 3 * l, p = 2 * l, d = 3 * l, g = 15 * l, y = 74 * l, b = 30 * l, T = document.createElement("canvas");
  T.width = c, T.height = u, T.style.cssText = "width:80px;height:48px";
  var x = T.getContext("2d");
  return x.font = "bold " + 9 * l + "px Helvetica,Arial,sans-serif", x.textBaseline = "top", x.fillStyle = t, x.fillRect(0, 0, c, u), x.fillStyle = e, x.fillText(s, f, p), x.fillRect(d, g, y, b), x.fillStyle = t, x.globalAlpha = 0.9, x.fillRect(d, g, y, b), {
    dom: T,
    update: function(E, M) {
      r = Math.min(r, E), i = Math.max(i, E), x.fillStyle = t, x.globalAlpha = 1, x.fillRect(0, 0, c, g), x.fillStyle = e, x.fillText(o(E) + " " + s + " (" + o(r) + "-" + o(i) + ")", f, p), x.drawImage(T, d + l, g, y - l, b, d, g, y - l, b), x.fillRect(d + y - l, g, l, b), x.fillStyle = t, x.globalAlpha = 0.9, x.fillRect(d + y - l, g, l, o((1 - E / M) * b));
    }
  };
};
const sa = parseInt(id.replace(/\D+/g, "")), vc = sa >= 125 ? "uv1" : "uv2";
function lf(s, e) {
  if (e === Vw)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), s;
  if (e === Kl || e === nd) {
    let t = s.getIndex();
    if (t === null) {
      const l = [], c = s.getAttribute("position");
      if (c !== void 0) {
        for (let u = 0; u < c.count; u++)
          l.push(u);
        s.setIndex(l), t = s.getIndex();
      } else
        return console.error(
          "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
        ), s;
    }
    const r = t.count - 2, i = [];
    if (t)
      if (e === Kl)
        for (let l = 1; l <= r; l++)
          i.push(t.getX(0)), i.push(t.getX(l)), i.push(t.getX(l + 1));
      else
        for (let l = 0; l < r; l++)
          l % 2 === 0 ? (i.push(t.getX(l)), i.push(t.getX(l + 1)), i.push(t.getX(l + 2))) : (i.push(t.getX(l + 2)), i.push(t.getX(l + 1)), i.push(t.getX(l)));
    i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const o = s.clone();
    return o.setIndex(i), o.clearGroups(), o;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), s;
}
var Zt = Uint8Array, di = Uint16Array, oc = Uint32Array, Md = new Zt([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), Ad = new Zt([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), k1 = new Zt([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Pd = function(s, e) {
  for (var t = new di(31), r = 0; r < 31; ++r)
    t[r] = e += 1 << s[r - 1];
  for (var i = new oc(t[30]), r = 1; r < 30; ++r)
    for (var o = t[r]; o < t[r + 1]; ++o)
      i[o] = o - t[r] << 5 | r;
  return [t, i];
}, Ed = Pd(Md, 2), Cd = Ed[0], z1 = Ed[1];
Cd[28] = 258, z1[258] = 28;
var N1 = Pd(Ad, 0), H1 = N1[0], ac = new di(32768);
for (var Fe = 0; Fe < 32768; ++Fe) {
  var si = (Fe & 43690) >>> 1 | (Fe & 21845) << 1;
  si = (si & 52428) >>> 2 | (si & 13107) << 2, si = (si & 61680) >>> 4 | (si & 3855) << 4, ac[Fe] = ((si & 65280) >>> 8 | (si & 255) << 8) >>> 1;
}
var As = (function(s, e, t) {
  for (var r = s.length, i = 0, o = new di(e); i < r; ++i)
    ++o[s[i] - 1];
  var l = new di(e);
  for (i = 0; i < e; ++i)
    l[i] = l[i - 1] + o[i - 1] << 1;
  var c;
  if (t) {
    c = new di(1 << e);
    var u = 15 - e;
    for (i = 0; i < r; ++i)
      if (s[i])
        for (var f = i << 4 | s[i], p = e - s[i], d = l[s[i] - 1]++ << p, g = d | (1 << p) - 1; d <= g; ++d)
          c[ac[d] >>> u] = f;
  } else
    for (c = new di(r), i = 0; i < r; ++i)
      s[i] && (c[i] = ac[l[s[i] - 1]++] >>> 15 - s[i]);
  return c;
}), Fs = new Zt(288);
for (var Fe = 0; Fe < 144; ++Fe)
  Fs[Fe] = 8;
for (var Fe = 144; Fe < 256; ++Fe)
  Fs[Fe] = 9;
for (var Fe = 256; Fe < 280; ++Fe)
  Fs[Fe] = 7;
for (var Fe = 280; Fe < 288; ++Fe)
  Fs[Fe] = 8;
var Ld = new Zt(32);
for (var Fe = 0; Fe < 32; ++Fe)
  Ld[Fe] = 5;
var V1 = /* @__PURE__ */ As(Fs, 9, 1), W1 = /* @__PURE__ */ As(Ld, 5, 1), Al = function(s) {
  for (var e = s[0], t = 1; t < s.length; ++t)
    s[t] > e && (e = s[t]);
  return e;
}, ur = function(s, e, t) {
  var r = e / 8 | 0;
  return (s[r] | s[r + 1] << 8) >> (e & 7) & t;
}, Pl = function(s, e) {
  var t = e / 8 | 0;
  return (s[t] | s[t + 1] << 8 | s[t + 2] << 16) >> (e & 7);
}, G1 = function(s) {
  return (s / 8 | 0) + (s & 7 && 1);
}, j1 = function(s, e, t) {
  (t == null || t > s.length) && (t = s.length);
  var r = new (s instanceof di ? di : s instanceof oc ? oc : Zt)(t - e);
  return r.set(s.subarray(e, t)), r;
}, $1 = function(s, e, t) {
  var r = s.length;
  if (!r || t && !t.l && r < 5)
    return e || new Zt(0);
  var i = !e || t, o = !t || t.i;
  t || (t = {}), e || (e = new Zt(r * 3));
  var l = function(Ut) {
    var er = e.length;
    if (Ut > er) {
      var yt = new Zt(Math.max(er * 2, Ut));
      yt.set(e), e = yt;
    }
  }, c = t.f || 0, u = t.p || 0, f = t.b || 0, p = t.l, d = t.d, g = t.m, y = t.n, b = r * 8;
  do {
    if (!p) {
      t.f = c = ur(s, u, 1);
      var T = ur(s, u + 1, 3);
      if (u += 3, T)
        if (T == 1)
          p = V1, d = W1, g = 9, y = 5;
        else if (T == 2) {
          var A = ur(s, u, 31) + 257, D = ur(s, u + 10, 15) + 4, z = A + ur(s, u + 5, 31) + 1;
          u += 14;
          for (var j = new Zt(z), V = new Zt(19), R = 0; R < D; ++R)
            V[k1[R]] = ur(s, u + R * 3, 7);
          u += D * 3;
          for (var G = Al(V), k = (1 << G) - 1, B = As(V, G, 1), R = 0; R < z; ) {
            var $ = B[ur(s, u, k)];
            u += $ & 15;
            var x = $ >>> 4;
            if (x < 16)
              j[R++] = x;
            else {
              var K = 0, Y = 0;
              for (x == 16 ? (Y = 3 + ur(s, u, 3), u += 2, K = j[R - 1]) : x == 17 ? (Y = 3 + ur(s, u, 7), u += 3) : x == 18 && (Y = 11 + ur(s, u, 127), u += 7); Y--; )
                j[R++] = K;
            }
          }
          var ee = j.subarray(0, A), Q = j.subarray(A);
          g = Al(ee), y = Al(Q), p = As(ee, g, 1), d = As(Q, y, 1);
        } else
          throw "invalid block type";
      else {
        var x = G1(u) + 4, E = s[x - 4] | s[x - 3] << 8, M = x + E;
        if (M > r) {
          if (o)
            throw "unexpected EOF";
          break;
        }
        i && l(f + E), e.set(s.subarray(x, M), f), t.b = f += E, t.p = u = M * 8;
        continue;
      }
      if (u > b) {
        if (o)
          throw "unexpected EOF";
        break;
      }
    }
    i && l(f + 131072);
    for (var Ee = (1 << g) - 1, we = (1 << y) - 1, be = u; ; be = u) {
      var K = p[Pl(s, u) & Ee], ge = K >>> 4;
      if (u += K & 15, u > b) {
        if (o)
          throw "unexpected EOF";
        break;
      }
      if (!K)
        throw "invalid length/literal";
      if (ge < 256)
        e[f++] = ge;
      else if (ge == 256) {
        be = u, p = null;
        break;
      } else {
        var Ce = ge - 254;
        if (ge > 264) {
          var R = ge - 257, Le = Md[R];
          Ce = ur(s, u, (1 << Le) - 1) + Cd[R], u += Le;
        }
        var Oe = d[Pl(s, u) & we], ct = Oe >>> 4;
        if (!Oe)
          throw "invalid distance";
        u += Oe & 15;
        var Q = H1[ct];
        if (ct > 3) {
          var Le = Ad[ct];
          Q += Pl(s, u) & (1 << Le) - 1, u += Le;
        }
        if (u > b) {
          if (o)
            throw "unexpected EOF";
          break;
        }
        i && l(f + 131072);
        for (var ut = f + Ce; f < ut; f += 4)
          e[f] = e[f - Q], e[f + 1] = e[f + 1 - Q], e[f + 2] = e[f + 2 - Q], e[f + 3] = e[f + 3 - Q];
        f = ut;
      }
    }
    t.l = p, t.p = be, t.b = f, p && (c = 1, t.m = g, t.d = d, t.n = y);
  } while (!c);
  return f == e.length ? e : j1(e, 0, f);
}, X1 = /* @__PURE__ */ new Zt(0), Y1 = function(s) {
  if ((s[0] & 15) != 8 || s[0] >>> 4 > 7 || (s[0] << 8 | s[1]) % 31)
    throw "invalid zlib data";
  if (s[1] & 32)
    throw "invalid zlib data: preset dictionaries not supported";
};
function Z1(s, e) {
  return $1((Y1(s), s.subarray(2, -4)), e);
}
var K1 = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), q1 = 0;
try {
  K1.decode(X1, { stream: !0 }), q1 = 1;
} catch {
}
class Q1 extends Ue {
  constructor(e, t = {}) {
    super(e), this.isWater = !0;
    const r = this, i = t.textureWidth !== void 0 ? t.textureWidth : 512, o = t.textureHeight !== void 0 ? t.textureHeight : 512, l = t.clipBias !== void 0 ? t.clipBias : 0, c = t.alpha !== void 0 ? t.alpha : 1, u = t.time !== void 0 ? t.time : 0, f = t.waterNormals !== void 0 ? t.waterNormals : null, p = t.sunDirection !== void 0 ? t.sunDirection : new I(0.70707, 0.70707, 0), d = new oe(t.sunColor !== void 0 ? t.sunColor : 16777215), g = new oe(t.waterColor !== void 0 ? t.waterColor : 8355711), y = t.eye !== void 0 ? t.eye : new I(0, 0, 0), b = t.distortionScale !== void 0 ? t.distortionScale : 20, T = t.side !== void 0 ? t.side : ea, x = t.fog !== void 0 ? t.fog : !1, E = new sd(), M = new I(), A = new I(), D = new I(), z = new xe(), j = new I(0, 0, -1), V = new gr(), R = new I(), G = new I(), k = new gr(), B = new xe(), $ = new qi(), K = new Cn(i, o), Y = {
      uniforms: Ji.merge([
        Qo.fog,
        Qo.lights,
        {
          normalSampler: { value: null },
          mirrorSampler: { value: null },
          alpha: { value: 1 },
          time: { value: 0 },
          size: { value: 1 },
          distortionScale: { value: 20 },
          textureMatrix: { value: new xe() },
          sunColor: { value: new oe(8355711) },
          sunDirection: { value: new I(0.70707, 0.70707, 0) },
          eye: { value: new I() },
          waterColor: { value: new oe(5592405) }
        }
      ]),
      vertexShader: (
        /* glsl */
        `
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`
      ),
      fragmentShader: (
        /* glsl */
        `
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <${sa >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
					#include <fog_fragment>	
				}`
      )
    }, ee = new Ar({
      fragmentShader: Y.fragmentShader,
      vertexShader: Y.vertexShader,
      uniforms: Ji.clone(Y.uniforms),
      lights: !0,
      side: T,
      fog: x
    });
    ee.uniforms.mirrorSampler.value = K.texture, ee.uniforms.textureMatrix.value = B, ee.uniforms.alpha.value = c, ee.uniforms.time.value = u, ee.uniforms.normalSampler.value = f, ee.uniforms.sunColor.value = d, ee.uniforms.waterColor.value = g, ee.uniforms.sunDirection.value = p, ee.uniforms.distortionScale.value = b, ee.uniforms.eye.value = y, r.material = ee, r.onBeforeRender = function(Q, Ee, we) {
      if (A.setFromMatrixPosition(r.matrixWorld), D.setFromMatrixPosition(we.matrixWorld), z.extractRotation(r.matrixWorld), M.set(0, 0, 1), M.applyMatrix4(z), R.subVectors(A, D), R.dot(M) > 0)
        return;
      R.reflect(M).negate(), R.add(A), z.extractRotation(we.matrixWorld), j.set(0, 0, -1), j.applyMatrix4(z), j.add(D), G.subVectors(A, j), G.reflect(M).negate(), G.add(A), $.position.copy(R), $.up.set(0, 1, 0), $.up.applyMatrix4(z), $.up.reflect(M), $.lookAt(G), $.far = we.far, $.updateMatrixWorld(), $.projectionMatrix.copy(we.projectionMatrix), B.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), B.multiply($.projectionMatrix), B.multiply($.matrixWorldInverse), E.setFromNormalAndCoplanarPoint(M, A), E.applyMatrix4($.matrixWorldInverse), V.set(E.normal.x, E.normal.y, E.normal.z, E.constant);
      const be = $.projectionMatrix;
      k.x = (Math.sign(V.x) + be.elements[8]) / be.elements[0], k.y = (Math.sign(V.y) + be.elements[9]) / be.elements[5], k.z = -1, k.w = (1 + be.elements[10]) / be.elements[14], V.multiplyScalar(2 / V.dot(k)), be.elements[2] = V.x, be.elements[6] = V.y, be.elements[10] = V.z + 1 - l, be.elements[14] = V.w, y.setFromMatrixPosition(we.matrixWorld);
      const ge = Q.getRenderTarget(), Ce = Q.xr.enabled, Le = Q.shadowMap.autoUpdate;
      r.visible = !1, Q.xr.enabled = !1, Q.shadowMap.autoUpdate = !1, Q.setRenderTarget(K), Q.state.buffers.depth.setMask(!0), Q.autoClear === !1 && Q.clear(), Q.render(Ee, $), r.visible = !0, Q.xr.enabled = Ce, Q.shadowMap.autoUpdate = Le, Q.setRenderTarget(ge);
      const Oe = we.viewport;
      Oe !== void 0 && Q.state.viewport(Oe);
    };
  }
}
var J1 = Object.defineProperty, ex = (s, e, t) => e in s ? J1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, tx = (s, e, t) => (ex(s, e + "", t), t);
class rx {
  constructor() {
    tx(this, "_listeners");
  }
  /**
   * Adds a listener to an event type.
   * @param type The type of event to listen to.
   * @param listener The function that gets called when the event is fired.
   */
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const r = this._listeners;
    r[e] === void 0 && (r[e] = []), r[e].indexOf(t) === -1 && r[e].push(t);
  }
  /**
      * Checks if listener is added to an event type.
      * @param type The type of event to listen to.
      * @param listener The function that gets called when the event is fired.
      */
  hasEventListener(e, t) {
    if (this._listeners === void 0)
      return !1;
    const r = this._listeners;
    return r[e] !== void 0 && r[e].indexOf(t) !== -1;
  }
  /**
      * Removes a listener from an event type.
      * @param type The type of the listener that gets removed.
      * @param listener The listener function that gets removed.
      */
  removeEventListener(e, t) {
    if (this._listeners === void 0)
      return;
    const i = this._listeners[e];
    if (i !== void 0) {
      const o = i.indexOf(t);
      o !== -1 && i.splice(o, 1);
    }
  }
  /**
      * Fire an event type.
      * @param event The event that gets fired.
      */
  dispatchEvent(e) {
    if (this._listeners === void 0)
      return;
    const r = this._listeners[e.type];
    if (r !== void 0) {
      e.target = this;
      const i = r.slice(0);
      for (let o = 0, l = i.length; o < l; o++)
        i[o].call(this, e);
      e.target = null;
    }
  }
}
var ix = Object.defineProperty, nx = (s, e, t) => e in s ? ix(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, te = (s, e, t) => (nx(s, typeof e != "symbol" ? e + "" : e, t), t);
const Co = /* @__PURE__ */ new Ww(), cf = /* @__PURE__ */ new sd(), sx = Math.cos(70 * (Math.PI / 180)), uf = (s, e) => (s % e + e) % e;
class ox extends rx {
  constructor(e, t) {
    super(), te(this, "object"), te(this, "domElement"), te(this, "enabled", !0), te(this, "target", new I()), te(this, "minDistance", 0), te(this, "maxDistance", 1 / 0), te(this, "minZoom", 0), te(this, "maxZoom", 1 / 0), te(this, "minPolarAngle", 0), te(this, "maxPolarAngle", Math.PI), te(this, "minAzimuthAngle", -1 / 0), te(this, "maxAzimuthAngle", 1 / 0), te(this, "enableDamping", !1), te(this, "dampingFactor", 0.05), te(this, "enableZoom", !0), te(this, "zoomSpeed", 1), te(this, "enableRotate", !0), te(this, "rotateSpeed", 1), te(this, "enablePan", !0), te(this, "panSpeed", 1), te(this, "screenSpacePanning", !0), te(this, "keyPanSpeed", 7), te(this, "zoomToCursor", !1), te(this, "autoRotate", !1), te(this, "autoRotateSpeed", 2), te(this, "reverseOrbit", !1), te(this, "reverseHorizontalOrbit", !1), te(this, "reverseVerticalOrbit", !1), te(this, "keys", { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }), te(this, "mouseButtons", {
      LEFT: ui.ROTATE,
      MIDDLE: ui.DOLLY,
      RIGHT: ui.PAN
    }), te(this, "touches", { ONE: hi.ROTATE, TWO: hi.DOLLY_PAN }), te(this, "target0"), te(this, "position0"), te(this, "zoom0"), te(this, "_domElementKeyEvents", null), te(this, "getPolarAngle"), te(this, "getAzimuthalAngle"), te(this, "setPolarAngle"), te(this, "setAzimuthalAngle"), te(this, "getDistance"), te(this, "getZoomScale"), te(this, "listenToKeyEvents"), te(this, "stopListenToKeyEvents"), te(this, "saveState"), te(this, "reset"), te(this, "update"), te(this, "connect"), te(this, "dispose"), te(this, "dollyIn"), te(this, "dollyOut"), te(this, "getScale"), te(this, "setScale"), this.object = e, this.domElement = t, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = () => p.phi, this.getAzimuthalAngle = () => p.theta, this.setPolarAngle = (O) => {
      let X = uf(O, 2 * Math.PI), se = p.phi;
      se < 0 && (se += 2 * Math.PI), X < 0 && (X += 2 * Math.PI);
      let ve = Math.abs(X - se);
      2 * Math.PI - ve < ve && (X < se ? X += 2 * Math.PI : se += 2 * Math.PI), d.phi = X - se, r.update();
    }, this.setAzimuthalAngle = (O) => {
      let X = uf(O, 2 * Math.PI), se = p.theta;
      se < 0 && (se += 2 * Math.PI), X < 0 && (X += 2 * Math.PI);
      let ve = Math.abs(X - se);
      2 * Math.PI - ve < ve && (X < se ? X += 2 * Math.PI : se += 2 * Math.PI), d.theta = X - se, r.update();
    }, this.getDistance = () => r.object.position.distanceTo(r.target), this.listenToKeyEvents = (O) => {
      O.addEventListener("keydown", yr), this._domElementKeyEvents = O;
    }, this.stopListenToKeyEvents = () => {
      this._domElementKeyEvents.removeEventListener("keydown", yr), this._domElementKeyEvents = null;
    }, this.saveState = () => {
      r.target0.copy(r.target), r.position0.copy(r.object.position), r.zoom0 = r.object.zoom;
    }, this.reset = () => {
      r.target.copy(r.target0), r.object.position.copy(r.position0), r.object.zoom = r.zoom0, r.object.updateProjectionMatrix(), r.dispatchEvent(i), r.update(), u = c.NONE;
    }, this.update = (() => {
      const O = new I(), X = new I(0, 1, 0), se = new pr().setFromUnitVectors(e.up, X), ve = se.clone().invert(), je = new I(), kt = new pr(), ir = 2 * Math.PI;
      return function() {
        const ks = r.object.position;
        se.setFromUnitVectors(e.up, X), ve.copy(se).invert(), O.copy(ks).sub(r.target), O.applyQuaternion(se), p.setFromVector3(O), r.autoRotate && u === c.NONE && Y($()), r.enableDamping ? (p.theta += d.theta * r.dampingFactor, p.phi += d.phi * r.dampingFactor) : (p.theta += d.theta, p.phi += d.phi);
        let nr = r.minAzimuthAngle, sr = r.maxAzimuthAngle;
        isFinite(nr) && isFinite(sr) && (nr < -Math.PI ? nr += ir : nr > Math.PI && (nr -= ir), sr < -Math.PI ? sr += ir : sr > Math.PI && (sr -= ir), nr <= sr ? p.theta = Math.max(nr, Math.min(sr, p.theta)) : p.theta = p.theta > (nr + sr) / 2 ? Math.max(nr, p.theta) : Math.min(sr, p.theta)), p.phi = Math.max(r.minPolarAngle, Math.min(r.maxPolarAngle, p.phi)), p.makeSafe(), r.enableDamping === !0 ? r.target.addScaledVector(y, r.dampingFactor) : r.target.add(y), r.zoomToCursor && G || r.object.isOrthographicCamera ? p.radius = Oe(p.radius) : p.radius = Oe(p.radius * g), O.setFromSpherical(p), O.applyQuaternion(ve), ks.copy(r.target).add(O), r.object.matrixAutoUpdate || r.object.updateMatrix(), r.object.lookAt(r.target), r.enableDamping === !0 ? (d.theta *= 1 - r.dampingFactor, d.phi *= 1 - r.dampingFactor, y.multiplyScalar(1 - r.dampingFactor)) : (d.set(0, 0, 0), y.set(0, 0, 0));
        let Zr = !1;
        if (r.zoomToCursor && G) {
          let Ci = null;
          if (r.object instanceof qi && r.object.isPerspectiveCamera) {
            const Li = O.length();
            Ci = Oe(Li * g);
            const ln = Li - Ci;
            r.object.position.addScaledVector(V, ln), r.object.updateMatrixWorld();
          } else if (r.object.isOrthographicCamera) {
            const Li = new I(R.x, R.y, 0);
            Li.unproject(r.object), r.object.zoom = Math.max(r.minZoom, Math.min(r.maxZoom, r.object.zoom / g)), r.object.updateProjectionMatrix(), Zr = !0;
            const ln = new I(R.x, R.y, 0);
            ln.unproject(r.object), r.object.position.sub(ln).add(Li), r.object.updateMatrixWorld(), Ci = O.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), r.zoomToCursor = !1;
          Ci !== null && (r.screenSpacePanning ? r.target.set(0, 0, -1).transformDirection(r.object.matrix).multiplyScalar(Ci).add(r.object.position) : (Co.origin.copy(r.object.position), Co.direction.set(0, 0, -1).transformDirection(r.object.matrix), Math.abs(r.object.up.dot(Co.direction)) < sx ? e.lookAt(r.target) : (cf.setFromNormalAndCoplanarPoint(r.object.up, r.target), Co.intersectPlane(cf, r.target))));
        } else r.object instanceof Ln && r.object.isOrthographicCamera && (Zr = g !== 1, Zr && (r.object.zoom = Math.max(r.minZoom, Math.min(r.maxZoom, r.object.zoom / g)), r.object.updateProjectionMatrix()));
        return g = 1, G = !1, Zr || je.distanceToSquared(r.object.position) > f || 8 * (1 - kt.dot(r.object.quaternion)) > f ? (r.dispatchEvent(i), je.copy(r.object.position), kt.copy(r.object.quaternion), Zr = !1, !0) : !1;
      };
    })(), this.connect = (O) => {
      r.domElement = O, r.domElement.style.touchAction = "none", r.domElement.addEventListener("contextmenu", on), r.domElement.addEventListener("pointerdown", $r), r.domElement.addEventListener("pointercancel", Ai), r.domElement.addEventListener("wheel", Yr);
    }, this.dispose = () => {
      var O, X, se, ve, je, kt;
      r.domElement && (r.domElement.style.touchAction = "auto"), (O = r.domElement) == null || O.removeEventListener("contextmenu", on), (X = r.domElement) == null || X.removeEventListener("pointerdown", $r), (se = r.domElement) == null || se.removeEventListener("pointercancel", Ai), (ve = r.domElement) == null || ve.removeEventListener("wheel", Yr), (je = r.domElement) == null || je.ownerDocument.removeEventListener("pointermove", Xr), (kt = r.domElement) == null || kt.ownerDocument.removeEventListener("pointerup", Ai), r._domElementKeyEvents !== null && r._domElementKeyEvents.removeEventListener("keydown", yr);
    };
    const r = this, i = { type: "change" }, o = { type: "start" }, l = { type: "end" }, c = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let u = c.NONE;
    const f = 1e-6, p = new nf(), d = new nf();
    let g = 1;
    const y = new I(), b = new ce(), T = new ce(), x = new ce(), E = new ce(), M = new ce(), A = new ce(), D = new ce(), z = new ce(), j = new ce(), V = new I(), R = new ce();
    let G = !1;
    const k = [], B = {};
    function $() {
      return 2 * Math.PI / 60 / 60 * r.autoRotateSpeed;
    }
    function K() {
      return Math.pow(0.95, r.zoomSpeed);
    }
    function Y(O) {
      r.reverseOrbit || r.reverseHorizontalOrbit ? d.theta += O : d.theta -= O;
    }
    function ee(O) {
      r.reverseOrbit || r.reverseVerticalOrbit ? d.phi += O : d.phi -= O;
    }
    const Q = (() => {
      const O = new I();
      return function(se, ve) {
        O.setFromMatrixColumn(ve, 0), O.multiplyScalar(-se), y.add(O);
      };
    })(), Ee = (() => {
      const O = new I();
      return function(se, ve) {
        r.screenSpacePanning === !0 ? O.setFromMatrixColumn(ve, 1) : (O.setFromMatrixColumn(ve, 0), O.crossVectors(r.object.up, O)), O.multiplyScalar(se), y.add(O);
      };
    })(), we = (() => {
      const O = new I();
      return function(se, ve) {
        const je = r.domElement;
        if (je && r.object instanceof qi && r.object.isPerspectiveCamera) {
          const kt = r.object.position;
          O.copy(kt).sub(r.target);
          let ir = O.length();
          ir *= Math.tan(r.object.fov / 2 * Math.PI / 180), Q(2 * se * ir / je.clientHeight, r.object.matrix), Ee(2 * ve * ir / je.clientHeight, r.object.matrix);
        } else je && r.object instanceof Ln && r.object.isOrthographicCamera ? (Q(
          se * (r.object.right - r.object.left) / r.object.zoom / je.clientWidth,
          r.object.matrix
        ), Ee(
          ve * (r.object.top - r.object.bottom) / r.object.zoom / je.clientHeight,
          r.object.matrix
        )) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), r.enablePan = !1);
      };
    })();
    function be(O) {
      r.object instanceof qi && r.object.isPerspectiveCamera || r.object instanceof Ln && r.object.isOrthographicCamera ? g = O : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), r.enableZoom = !1);
    }
    function ge(O) {
      be(g / O);
    }
    function Ce(O) {
      be(g * O);
    }
    function Le(O) {
      if (!r.zoomToCursor || !r.domElement)
        return;
      G = !0;
      const X = r.domElement.getBoundingClientRect(), se = O.clientX - X.left, ve = O.clientY - X.top, je = X.width, kt = X.height;
      R.x = se / je * 2 - 1, R.y = -(ve / kt) * 2 + 1, V.set(R.x, R.y, 1).unproject(r.object).sub(r.object.position).normalize();
    }
    function Oe(O) {
      return Math.max(r.minDistance, Math.min(r.maxDistance, O));
    }
    function ct(O) {
      b.set(O.clientX, O.clientY);
    }
    function ut(O) {
      Le(O), D.set(O.clientX, O.clientY);
    }
    function Ut(O) {
      E.set(O.clientX, O.clientY);
    }
    function er(O) {
      T.set(O.clientX, O.clientY), x.subVectors(T, b).multiplyScalar(r.rotateSpeed);
      const X = r.domElement;
      X && (Y(2 * Math.PI * x.x / X.clientHeight), ee(2 * Math.PI * x.y / X.clientHeight)), b.copy(T), r.update();
    }
    function yt(O) {
      z.set(O.clientX, O.clientY), j.subVectors(z, D), j.y > 0 ? ge(K()) : j.y < 0 && Ce(K()), D.copy(z), r.update();
    }
    function tr(O) {
      M.set(O.clientX, O.clientY), A.subVectors(M, E).multiplyScalar(r.panSpeed), we(A.x, A.y), E.copy(M), r.update();
    }
    function nn(O) {
      Le(O), O.deltaY < 0 ? Ce(K()) : O.deltaY > 0 && ge(K()), r.update();
    }
    function Or(O) {
      let X = !1;
      switch (O.code) {
        case r.keys.UP:
          we(0, r.keyPanSpeed), X = !0;
          break;
        case r.keys.BOTTOM:
          we(0, -r.keyPanSpeed), X = !0;
          break;
        case r.keys.LEFT:
          we(r.keyPanSpeed, 0), X = !0;
          break;
        case r.keys.RIGHT:
          we(-r.keyPanSpeed, 0), X = !0;
          break;
      }
      X && (O.preventDefault(), r.update());
    }
    function rr() {
      if (k.length == 1)
        b.set(k[0].pageX, k[0].pageY);
      else {
        const O = 0.5 * (k[0].pageX + k[1].pageX), X = 0.5 * (k[0].pageY + k[1].pageY);
        b.set(O, X);
      }
    }
    function Dr() {
      if (k.length == 1)
        E.set(k[0].pageX, k[0].pageY);
      else {
        const O = 0.5 * (k[0].pageX + k[1].pageX), X = 0.5 * (k[0].pageY + k[1].pageY);
        E.set(O, X);
      }
    }
    function Ge() {
      const O = k[0].pageX - k[1].pageX, X = k[0].pageY - k[1].pageY, se = Math.sqrt(O * O + X * X);
      D.set(0, se);
    }
    function At() {
      r.enableZoom && Ge(), r.enablePan && Dr();
    }
    function Ti() {
      r.enableZoom && Ge(), r.enableRotate && rr();
    }
    function vt(O) {
      if (k.length == 1)
        T.set(O.pageX, O.pageY);
      else {
        const se = Ei(O), ve = 0.5 * (O.pageX + se.x), je = 0.5 * (O.pageY + se.y);
        T.set(ve, je);
      }
      x.subVectors(T, b).multiplyScalar(r.rotateSpeed);
      const X = r.domElement;
      X && (Y(2 * Math.PI * x.x / X.clientHeight), ee(2 * Math.PI * x.y / X.clientHeight)), b.copy(T);
    }
    function Si(O) {
      if (k.length == 1)
        M.set(O.pageX, O.pageY);
      else {
        const X = Ei(O), se = 0.5 * (O.pageX + X.x), ve = 0.5 * (O.pageY + X.y);
        M.set(se, ve);
      }
      A.subVectors(M, E).multiplyScalar(r.panSpeed), we(A.x, A.y), E.copy(M);
    }
    function sn(O) {
      const X = Ei(O), se = O.pageX - X.x, ve = O.pageY - X.y, je = Math.sqrt(se * se + ve * ve);
      z.set(0, je), j.set(0, Math.pow(z.y / D.y, r.zoomSpeed)), ge(j.y), D.copy(z);
    }
    function Mi(O) {
      r.enableZoom && sn(O), r.enablePan && Si(O);
    }
    function Pt(O) {
      r.enableZoom && sn(O), r.enableRotate && vt(O);
    }
    function $r(O) {
      var X, se;
      r.enabled !== !1 && (k.length === 0 && ((X = r.domElement) == null || X.ownerDocument.addEventListener("pointermove", Xr), (se = r.domElement) == null || se.ownerDocument.addEventListener("pointerup", Ai)), Vn(O), O.pointerType === "touch" ? Nn(O) : Pi(O));
    }
    function Xr(O) {
      r.enabled !== !1 && (O.pointerType === "touch" ? Hn(O) : fa(O));
    }
    function Ai(O) {
      var X, se, ve;
      Wn(O), k.length === 0 && ((X = r.domElement) == null || X.releasePointerCapture(O.pointerId), (se = r.domElement) == null || se.ownerDocument.removeEventListener("pointermove", Xr), (ve = r.domElement) == null || ve.ownerDocument.removeEventListener("pointerup", Ai)), r.dispatchEvent(l), u = c.NONE;
    }
    function Pi(O) {
      let X;
      switch (O.button) {
        case 0:
          X = r.mouseButtons.LEFT;
          break;
        case 1:
          X = r.mouseButtons.MIDDLE;
          break;
        case 2:
          X = r.mouseButtons.RIGHT;
          break;
        default:
          X = -1;
      }
      switch (X) {
        case ui.DOLLY:
          if (r.enableZoom === !1)
            return;
          ut(O), u = c.DOLLY;
          break;
        case ui.ROTATE:
          if (O.ctrlKey || O.metaKey || O.shiftKey) {
            if (r.enablePan === !1)
              return;
            Ut(O), u = c.PAN;
          } else {
            if (r.enableRotate === !1)
              return;
            ct(O), u = c.ROTATE;
          }
          break;
        case ui.PAN:
          if (O.ctrlKey || O.metaKey || O.shiftKey) {
            if (r.enableRotate === !1)
              return;
            ct(O), u = c.ROTATE;
          } else {
            if (r.enablePan === !1)
              return;
            Ut(O), u = c.PAN;
          }
          break;
        default:
          u = c.NONE;
      }
      u !== c.NONE && r.dispatchEvent(o);
    }
    function fa(O) {
      if (r.enabled !== !1)
        switch (u) {
          case c.ROTATE:
            if (r.enableRotate === !1)
              return;
            er(O);
            break;
          case c.DOLLY:
            if (r.enableZoom === !1)
              return;
            yt(O);
            break;
          case c.PAN:
            if (r.enablePan === !1)
              return;
            tr(O);
            break;
        }
    }
    function Yr(O) {
      r.enabled === !1 || r.enableZoom === !1 || u !== c.NONE && u !== c.ROTATE || (O.preventDefault(), r.dispatchEvent(o), nn(O), r.dispatchEvent(l));
    }
    function yr(O) {
      r.enabled === !1 || r.enablePan === !1 || Or(O);
    }
    function Nn(O) {
      switch (an(O), k.length) {
        case 1:
          switch (r.touches.ONE) {
            case hi.ROTATE:
              if (r.enableRotate === !1)
                return;
              rr(), u = c.TOUCH_ROTATE;
              break;
            case hi.PAN:
              if (r.enablePan === !1)
                return;
              Dr(), u = c.TOUCH_PAN;
              break;
            default:
              u = c.NONE;
          }
          break;
        case 2:
          switch (r.touches.TWO) {
            case hi.DOLLY_PAN:
              if (r.enableZoom === !1 && r.enablePan === !1)
                return;
              At(), u = c.TOUCH_DOLLY_PAN;
              break;
            case hi.DOLLY_ROTATE:
              if (r.enableZoom === !1 && r.enableRotate === !1)
                return;
              Ti(), u = c.TOUCH_DOLLY_ROTATE;
              break;
            default:
              u = c.NONE;
          }
          break;
        default:
          u = c.NONE;
      }
      u !== c.NONE && r.dispatchEvent(o);
    }
    function Hn(O) {
      switch (an(O), u) {
        case c.TOUCH_ROTATE:
          if (r.enableRotate === !1)
            return;
          vt(O), r.update();
          break;
        case c.TOUCH_PAN:
          if (r.enablePan === !1)
            return;
          Si(O), r.update();
          break;
        case c.TOUCH_DOLLY_PAN:
          if (r.enableZoom === !1 && r.enablePan === !1)
            return;
          Mi(O), r.update();
          break;
        case c.TOUCH_DOLLY_ROTATE:
          if (r.enableZoom === !1 && r.enableRotate === !1)
            return;
          Pt(O), r.update();
          break;
        default:
          u = c.NONE;
      }
    }
    function on(O) {
      r.enabled !== !1 && O.preventDefault();
    }
    function Vn(O) {
      k.push(O);
    }
    function Wn(O) {
      delete B[O.pointerId];
      for (let X = 0; X < k.length; X++)
        if (k[X].pointerId == O.pointerId) {
          k.splice(X, 1);
          return;
        }
    }
    function an(O) {
      let X = B[O.pointerId];
      X === void 0 && (X = new ce(), B[O.pointerId] = X), X.set(O.pageX, O.pageY);
    }
    function Ei(O) {
      const X = O.pointerId === k[0].pointerId ? k[1] : k[0];
      return B[X.pointerId];
    }
    this.dollyIn = (O = K()) => {
      Ce(O), r.update();
    }, this.dollyOut = (O = K()) => {
      ge(O), r.update();
    }, this.getScale = () => g, this.setScale = (O) => {
      be(O), r.update();
    }, this.getZoomScale = () => K(), t !== void 0 && this.connect(t), this.update();
  }
}
class ax extends ox {
  constructor(e, t) {
    super(e, t), this.screenSpacePanning = !1, this.mouseButtons.LEFT = ui.PAN, this.mouseButtons.RIGHT = ui.ROTATE, this.touches.ONE = hi.PAN, this.touches.TWO = hi.DOLLY_ROTATE;
  }
}
var lx = Object.defineProperty, cx = (s, e, t) => e in s ? lx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Zi = (s, e, t) => (cx(s, typeof e != "symbol" ? e + "" : e, t), t);
class Rs {
  constructor() {
    Zi(this, "enabled", !0), Zi(this, "needsSwap", !0), Zi(this, "clear", !1), Zi(this, "renderToScreen", !1);
  }
  setSize(e, t) {
  }
  render(e, t, r, i, o) {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  dispose() {
  }
}
class Od {
  constructor(e) {
    Zi(this, "camera", new Ln(-1, 1, 1, -1, 0, 1)), Zi(this, "geometry", new Fn(2, 2)), Zi(this, "mesh"), this.mesh = new Ue(this.geometry, e);
  }
  get material() {
    return this.mesh.material;
  }
  set material(e) {
    this.mesh.material = e;
  }
  dispose() {
    this.mesh.geometry.dispose();
  }
  render(e) {
    e.render(this.mesh, this.camera);
  }
}
var ux = Object.defineProperty, hx = (s, e, t) => e in s ? ux(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Lo = (s, e, t) => (hx(s, typeof e != "symbol" ? e + "" : e, t), t);
class hf extends Rs {
  constructor(e, t = "tDiffuse") {
    super(), Lo(this, "textureID"), Lo(this, "uniforms"), Lo(this, "material"), Lo(this, "fsQuad"), this.textureID = t, e instanceof Ar ? (this.uniforms = e.uniforms, this.material = e) : (this.uniforms = Ji.clone(e.uniforms), this.material = new Ar({
      defines: Object.assign({}, e.defines),
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    })), this.fsQuad = new Od(this.material);
  }
  render(e, t, r) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = r.texture), this.fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.fsQuad.dispose(), this.material.dispose();
  }
}
const lc = {
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1 }
  },
  vertexShader: (
    /* glsl */
    `
    varying vec2 vUv;

    void main() {

    	vUv = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `
  ),
  fragmentShader: (
    /* glsl */
    `
    uniform float opacity;

    uniform sampler2D tDiffuse;

    varying vec2 vUv;

    void main() {

    	vec4 texel = texture2D( tDiffuse, vUv );
    	gl_FragColor = opacity * texel;

    }
  `
  )
}, fx = {
  uniforms: {
    tDiffuse: { value: null },
    luminosityThreshold: { value: 1 },
    smoothWidth: { value: 1 },
    defaultColor: { value: /* @__PURE__ */ new oe(0) },
    defaultOpacity: { value: 0 }
  },
  vertexShader: (
    /* glsl */
    `
    varying vec2 vUv;

    void main() {

    	vUv = uv;

    	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `
  ),
  fragmentShader: (
    /* glsl */
    `
    uniform sampler2D tDiffuse;
    uniform vec3 defaultColor;
    uniform float defaultOpacity;
    uniform float luminosityThreshold;
    uniform float smoothWidth;

    varying vec2 vUv;

    void main() {

    	vec4 texel = texture2D( tDiffuse, vUv );

    	vec3 luma = vec3( 0.299, 0.587, 0.114 );

    	float v = dot( texel.xyz, luma );

    	vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

    	float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

    	gl_FragColor = mix( outputColor, texel, alpha );

    }
  `
  )
};
var dx = Object.defineProperty, px = (s, e, t) => e in s ? dx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ff = (s, e, t) => (px(s, typeof e != "symbol" ? e + "" : e, t), t);
const mx = /* @__PURE__ */ (() => {
  const s = class extends Rs {
    constructor(t, r, i, o) {
      super(), this.strength = r !== void 0 ? r : 1, this.radius = i, this.threshold = o, this.resolution = t !== void 0 ? new ce(t.x, t.y) : new ce(256, 256), this.clearColor = new oe(0, 0, 0), this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
      let l = Math.round(this.resolution.x / 2), c = Math.round(this.resolution.y / 2);
      this.renderTargetBright = new Cn(l, c, { type: Xi }), this.renderTargetBright.texture.name = "UnrealBloomPass.bright", this.renderTargetBright.texture.generateMipmaps = !1;
      for (let g = 0; g < this.nMips; g++) {
        const y = new Cn(l, c, { type: Xi });
        y.texture.name = "UnrealBloomPass.h" + g, y.texture.generateMipmaps = !1, this.renderTargetsHorizontal.push(y);
        const b = new Cn(l, c, { type: Xi });
        b.texture.name = "UnrealBloomPass.v" + g, b.texture.generateMipmaps = !1, this.renderTargetsVertical.push(b), l = Math.round(l / 2), c = Math.round(c / 2);
      }
      const u = fx;
      this.highPassUniforms = Ji.clone(u.uniforms), this.highPassUniforms.luminosityThreshold.value = o, this.highPassUniforms.smoothWidth.value = 0.01, this.materialHighPassFilter = new Ar({
        uniforms: this.highPassUniforms,
        vertexShader: u.vertexShader,
        fragmentShader: u.fragmentShader,
        defines: {}
      }), this.separableBlurMaterials = [];
      const f = [3, 5, 7, 9, 11];
      l = Math.round(this.resolution.x / 2), c = Math.round(this.resolution.y / 2);
      for (let g = 0; g < this.nMips; g++)
        this.separableBlurMaterials.push(this.getSeperableBlurMaterial(f[g])), this.separableBlurMaterials[g].uniforms.texSize.value = new ce(l, c), l = Math.round(l / 2), c = Math.round(c / 2);
      this.compositeMaterial = this.getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = r, this.compositeMaterial.uniforms.bloomRadius.value = 0.1, this.compositeMaterial.needsUpdate = !0;
      const p = [1, 0.8, 0.6, 0.4, 0.2];
      this.compositeMaterial.uniforms.bloomFactors.value = p, this.bloomTintColors = [
        new I(1, 1, 1),
        new I(1, 1, 1),
        new I(1, 1, 1),
        new I(1, 1, 1),
        new I(1, 1, 1)
      ], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors;
      const d = lc;
      this.copyUniforms = Ji.clone(d.uniforms), this.copyUniforms.opacity.value = 1, this.materialCopy = new Ar({
        uniforms: this.copyUniforms,
        vertexShader: d.vertexShader,
        fragmentShader: d.fragmentShader,
        blending: mc,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0
      }), this.enabled = !0, this.needsSwap = !1, this._oldClearColor = new oe(), this.oldClearAlpha = 1, this.basic = new Kt(), this.fsQuad = new Od(null);
    }
    dispose() {
      for (let t = 0; t < this.renderTargetsHorizontal.length; t++)
        this.renderTargetsHorizontal[t].dispose();
      for (let t = 0; t < this.renderTargetsVertical.length; t++)
        this.renderTargetsVertical[t].dispose();
      this.renderTargetBright.dispose();
      for (let t = 0; t < this.separableBlurMaterials.length; t++)
        this.separableBlurMaterials[t].dispose();
      this.compositeMaterial.dispose(), this.materialCopy.dispose(), this.basic.dispose(), this.fsQuad.dispose();
    }
    setSize(t, r) {
      let i = Math.round(t / 2), o = Math.round(r / 2);
      this.renderTargetBright.setSize(i, o);
      for (let l = 0; l < this.nMips; l++)
        this.renderTargetsHorizontal[l].setSize(i, o), this.renderTargetsVertical[l].setSize(i, o), this.separableBlurMaterials[l].uniforms.texSize.value = new ce(i, o), i = Math.round(i / 2), o = Math.round(o / 2);
    }
    render(t, r, i, o, l) {
      t.getClearColor(this._oldClearColor), this.oldClearAlpha = t.getClearAlpha();
      const c = t.autoClear;
      t.autoClear = !1, t.setClearColor(this.clearColor, 0), l && t.state.buffers.stencil.setTest(!1), this.renderToScreen && (this.fsQuad.material = this.basic, this.basic.map = i.texture, t.setRenderTarget(null), t.clear(), this.fsQuad.render(t)), this.highPassUniforms.tDiffuse.value = i.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this.fsQuad.material = this.materialHighPassFilter, t.setRenderTarget(this.renderTargetBright), t.clear(), this.fsQuad.render(t);
      let u = this.renderTargetBright;
      for (let f = 0; f < this.nMips; f++)
        this.fsQuad.material = this.separableBlurMaterials[f], this.separableBlurMaterials[f].uniforms.colorTexture.value = u.texture, this.separableBlurMaterials[f].uniforms.direction.value = s.BlurDirectionX, t.setRenderTarget(this.renderTargetsHorizontal[f]), t.clear(), this.fsQuad.render(t), this.separableBlurMaterials[f].uniforms.colorTexture.value = this.renderTargetsHorizontal[f].texture, this.separableBlurMaterials[f].uniforms.direction.value = s.BlurDirectionY, t.setRenderTarget(this.renderTargetsVertical[f]), t.clear(), this.fsQuad.render(t), u = this.renderTargetsVertical[f];
      this.fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, t.setRenderTarget(this.renderTargetsHorizontal[0]), t.clear(), this.fsQuad.render(t), this.fsQuad.material = this.materialCopy, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, l && t.state.buffers.stencil.setTest(!0), this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(i), this.fsQuad.render(t)), t.setClearColor(this._oldClearColor, this.oldClearAlpha), t.autoClear = c;
    }
    getSeperableBlurMaterial(t) {
      return new Ar({
        defines: {
          KERNEL_RADIUS: t,
          SIGMA: t
        },
        uniforms: {
          colorTexture: { value: null },
          texSize: { value: new ce(0.5, 0.5) },
          direction: { value: new ce(0.5, 0.5) }
        },
        vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`
      });
    }
    getCompositeMaterial(t) {
      return new Ar({
        defines: {
          NUM_MIPS: t
        },
        uniforms: {
          blurTexture1: { value: null },
          blurTexture2: { value: null },
          blurTexture3: { value: null },
          blurTexture4: { value: null },
          blurTexture5: { value: null },
          bloomStrength: { value: 1 },
          bloomFactors: { value: null },
          bloomTintColors: { value: null },
          bloomRadius: { value: 0 }
        },
        vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
      });
    }
  };
  let e = s;
  return ff(e, "BlurDirectionX", new ce(1, 0)), ff(e, "BlurDirectionY", new ce(0, 1)), e;
})();
var gx = Object.defineProperty, _x = (s, e, t) => e in s ? gx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, El = (s, e, t) => (_x(s, typeof e != "symbol" ? e + "" : e, t), t);
class df extends Rs {
  constructor(e, t) {
    super(), El(this, "scene"), El(this, "camera"), El(this, "inverse"), this.scene = e, this.camera = t, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(e, t, r) {
    const i = e.getContext(), o = e.state;
    o.buffers.color.setMask(!1), o.buffers.depth.setMask(!1), o.buffers.color.setLocked(!0), o.buffers.depth.setLocked(!0);
    let l, c;
    this.inverse ? (l = 0, c = 1) : (l = 1, c = 0), o.buffers.stencil.setTest(!0), o.buffers.stencil.setOp(i.REPLACE, i.REPLACE, i.REPLACE), o.buffers.stencil.setFunc(i.ALWAYS, l, 4294967295), o.buffers.stencil.setClear(c), o.buffers.stencil.setLocked(!0), e.setRenderTarget(r), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), o.buffers.color.setLocked(!1), o.buffers.depth.setLocked(!1), o.buffers.stencil.setLocked(!1), o.buffers.stencil.setFunc(i.EQUAL, 1, 4294967295), o.buffers.stencil.setOp(i.KEEP, i.KEEP, i.KEEP), o.buffers.stencil.setLocked(!0);
  }
}
class yx extends Rs {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(e) {
    e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
  }
}
var vx = Object.defineProperty, wx = (s, e, t) => e in s ? vx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Xt = (s, e, t) => (wx(s, typeof e != "symbol" ? e + "" : e, t), t);
class xx {
  constructor(e, t) {
    if (Xt(this, "renderer"), Xt(this, "_pixelRatio"), Xt(this, "_width"), Xt(this, "_height"), Xt(this, "renderTarget1"), Xt(this, "renderTarget2"), Xt(this, "writeBuffer"), Xt(this, "readBuffer"), Xt(this, "renderToScreen"), Xt(this, "passes", []), Xt(this, "copyPass"), Xt(this, "clock"), this.renderer = e, t === void 0) {
      const r = {
        minFilter: yi,
        magFilter: yi,
        format: od
      }, i = e.getSize(new ce());
      this._pixelRatio = e.getPixelRatio(), this._width = i.width, this._height = i.height, t = new Cn(
        this._width * this._pixelRatio,
        this._height * this._pixelRatio,
        r
      ), t.texture.name = "EffectComposer.rt1";
    } else
      this._pixelRatio = 1, this._width = t.width, this._height = t.height;
    this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, lc === void 0 && console.error("THREE.EffectComposer relies on CopyShader"), hf === void 0 && console.error("THREE.EffectComposer relies on ShaderPass"), this.copyPass = new hf(lc), this.copyPass.material.blending = Gw, this.clock = new ta();
  }
  swapBuffers() {
    const e = this.readBuffer;
    this.readBuffer = this.writeBuffer, this.writeBuffer = e;
  }
  addPass(e) {
    this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  insertPass(e, t) {
    this.passes.splice(t, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
  }
  removePass(e) {
    const t = this.passes.indexOf(e);
    t !== -1 && this.passes.splice(t, 1);
  }
  isLastEnabledPass(e) {
    for (let t = e + 1; t < this.passes.length; t++)
      if (this.passes[t].enabled)
        return !1;
    return !0;
  }
  render(e) {
    e === void 0 && (e = this.clock.getDelta());
    const t = this.renderer.getRenderTarget();
    let r = !1;
    const i = this.passes.length;
    for (let o = 0; o < i; o++) {
      const l = this.passes[o];
      if (l.enabled !== !1) {
        if (l.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), l.render(this.renderer, this.writeBuffer, this.readBuffer, e, r), l.needsSwap) {
          if (r) {
            const c = this.renderer.getContext(), u = this.renderer.state.buffers.stencil;
            u.setFunc(c.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), u.setFunc(c.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        df !== void 0 && (l instanceof df ? r = !0 : l instanceof yx && (r = !1));
      }
    }
    this.renderer.setRenderTarget(t);
  }
  reset(e) {
    if (e === void 0) {
      const t = this.renderer.getSize(new ce());
      this._pixelRatio = this.renderer.getPixelRatio(), this._width = t.width, this._height = t.height, e = this.renderTarget1.clone(), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
    }
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
  }
  setSize(e, t) {
    this._width = e, this._height = t;
    const r = this._width * this._pixelRatio, i = this._height * this._pixelRatio;
    this.renderTarget1.setSize(r, i), this.renderTarget2.setSize(r, i);
    for (let o = 0; o < this.passes.length; o++)
      this.passes[o].setSize(r, i);
  }
  setPixelRatio(e) {
    this._pixelRatio = e, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
var bx = Object.defineProperty, Tx = (s, e, t) => e in s ? bx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ni = (s, e, t) => (Tx(s, typeof e != "symbol" ? e + "" : e, t), t);
class Sx extends Rs {
  constructor(e, t, r, i, o = 0) {
    super(), Ni(this, "scene"), Ni(this, "camera"), Ni(this, "overrideMaterial"), Ni(this, "clearColor"), Ni(this, "clearAlpha"), Ni(this, "clearDepth", !1), Ni(this, "_oldClearColor", new oe()), this.scene = e, this.camera = t, this.overrideMaterial = r, this.clearColor = i, this.clearAlpha = o, this.clear = !0, this.needsSwap = !1;
  }
  render(e, t, r) {
    let i = e.autoClear;
    e.autoClear = !1;
    let o, l = null;
    this.overrideMaterial !== void 0 && (l = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor && (e.getClearColor(this._oldClearColor), o = e.getClearAlpha(), e.setClearColor(this.clearColor, this.clearAlpha)), this.clearDepth && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : r), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor && e.setClearColor(this._oldClearColor, o), this.overrideMaterial !== void 0 && (this.scene.overrideMaterial = l), e.autoClear = i;
  }
}
function Bn(s) {
  if (typeof TextDecoder < "u")
    return new TextDecoder().decode(s);
  let e = "";
  for (let t = 0, r = s.length; t < r; t++)
    e += String.fromCharCode(s[t]);
  try {
    return decodeURIComponent(escape(e));
  } catch {
    return e;
  }
}
const Ki = "srgb", jr = "srgb-linear", pf = 3001, Mx = 3e3;
class Ax extends gc {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new Ox(t);
    }), this.register(function(t) {
      return new Dx(t);
    }), this.register(function(t) {
      return new Hx(t);
    }), this.register(function(t) {
      return new Vx(t);
    }), this.register(function(t) {
      return new Wx(t);
    }), this.register(function(t) {
      return new Fx(t);
    }), this.register(function(t) {
      return new Rx(t);
    }), this.register(function(t) {
      return new Bx(t);
    }), this.register(function(t) {
      return new Ux(t);
    }), this.register(function(t) {
      return new Lx(t);
    }), this.register(function(t) {
      return new kx(t);
    }), this.register(function(t) {
      return new Ix(t);
    }), this.register(function(t) {
      return new Nx(t);
    }), this.register(function(t) {
      return new zx(t);
    }), this.register(function(t) {
      return new Ex(t);
    }), this.register(function(t) {
      return new Gx(t);
    }), this.register(function(t) {
      return new jx(t);
    });
  }
  load(e, t, r, i) {
    const o = this;
    let l;
    if (this.resourcePath !== "")
      l = this.resourcePath;
    else if (this.path !== "") {
      const f = On.extractUrlBase(e);
      l = On.resolveURL(f, this.path);
    } else
      l = On.extractUrlBase(e);
    this.manager.itemStart(e);
    const c = function(f) {
      i ? i(f) : console.error(f), o.manager.itemError(e), o.manager.itemEnd(e);
    }, u = new vi(this.manager);
    u.setPath(this.path), u.setResponseType("arraybuffer"), u.setRequestHeader(this.requestHeader), u.setWithCredentials(this.withCredentials), u.load(
      e,
      function(f) {
        try {
          o.parse(
            f,
            l,
            function(p) {
              t(p), o.manager.itemEnd(e);
            },
            c
          );
        } catch (p) {
          c(p);
        }
      },
      r,
      c
    );
  }
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  setDDSLoader() {
    throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".');
  }
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  parse(e, t, r, i) {
    let o;
    const l = {}, c = {};
    if (typeof e == "string")
      o = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (Bn(new Uint8Array(e.slice(0, 4))) === Dd) {
        try {
          l[me.KHR_BINARY_GLTF] = new $x(e);
        } catch (p) {
          i && i(p);
          return;
        }
        o = JSON.parse(l[me.KHR_BINARY_GLTF].content);
      } else
        o = JSON.parse(Bn(new Uint8Array(e)));
    else
      o = e;
    if (o.asset === void 0 || o.asset.version[0] < 2) {
      i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const u = new sb(o, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    u.fileLoader.setRequestHeader(this.requestHeader);
    for (let f = 0; f < this.pluginCallbacks.length; f++) {
      const p = this.pluginCallbacks[f](u);
      p.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), c[p.name] = p, l[p.name] = !0;
    }
    if (o.extensionsUsed)
      for (let f = 0; f < o.extensionsUsed.length; ++f) {
        const p = o.extensionsUsed[f], d = o.extensionsRequired || [];
        switch (p) {
          case me.KHR_MATERIALS_UNLIT:
            l[p] = new Cx();
            break;
          case me.KHR_DRACO_MESH_COMPRESSION:
            l[p] = new Xx(o, this.dracoLoader);
            break;
          case me.KHR_TEXTURE_TRANSFORM:
            l[p] = new Yx();
            break;
          case me.KHR_MESH_QUANTIZATION:
            l[p] = new Zx();
            break;
          default:
            d.indexOf(p) >= 0 && c[p] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + p + '".');
        }
      }
    u.setExtensions(l), u.setPlugins(c), u.parse(r, i);
  }
  parseAsync(e, t) {
    const r = this;
    return new Promise(function(i, o) {
      r.parse(e, t, i, o);
    });
  }
}
function Px() {
  let s = {};
  return {
    get: function(e) {
      return s[e];
    },
    add: function(e, t) {
      s[e] = t;
    },
    remove: function(e) {
      delete s[e];
    },
    removeAll: function() {
      s = {};
    }
  };
}
const me = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class Ex {
  constructor(e) {
    this.parser = e, this.name = me.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let r = 0, i = t.length; r < i; r++) {
      const o = t[r];
      o.extensions && o.extensions[this.name] && o.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, o.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, r = "light:" + e;
    let i = t.cache.get(r);
    if (i)
      return i;
    const o = t.json, u = ((o.extensions && o.extensions[this.name] || {}).lights || [])[e];
    let f;
    const p = new oe(16777215);
    u.color !== void 0 && p.setRGB(u.color[0], u.color[1], u.color[2], jr);
    const d = u.range !== void 0 ? u.range : 0;
    switch (u.type) {
      case "directional":
        f = new Jo(p), f.target.position.set(0, 0, -1), f.add(f.target);
        break;
      case "point":
        f = new ql(p), f.distance = d;
        break;
      case "spot":
        f = new ad(p), f.distance = d, u.spot = u.spot || {}, u.spot.innerConeAngle = u.spot.innerConeAngle !== void 0 ? u.spot.innerConeAngle : 0, u.spot.outerConeAngle = u.spot.outerConeAngle !== void 0 ? u.spot.outerConeAngle : Math.PI / 4, f.angle = u.spot.outerConeAngle, f.penumbra = 1 - u.spot.innerConeAngle / u.spot.outerConeAngle, f.target.position.set(0, 0, -1), f.add(f.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + u.type);
    }
    return f.position.set(0, 0, 0), f.decay = 2, Vr(f, u), u.intensity !== void 0 && (f.intensity = u.intensity), f.name = t.createUniqueName(u.name || "light_" + e), i = Promise.resolve(f), t.cache.add(r, i), i;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, r = this.parser, o = r.json.nodes[e], c = (o.extensions && o.extensions[this.name] || {}).light;
    return c === void 0 ? null : this._loadLight(c).then(function(u) {
      return r._getNodeRef(t.cache, c, u);
    });
  }
}
class Cx {
  constructor() {
    this.name = me.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Kt;
  }
  extendParams(e, t, r) {
    const i = [];
    e.color = new oe(1, 1, 1), e.opacity = 1;
    const o = t.pbrMetallicRoughness;
    if (o) {
      if (Array.isArray(o.baseColorFactor)) {
        const l = o.baseColorFactor;
        e.color.setRGB(l[0], l[1], l[2], jr), e.opacity = l[3];
      }
      o.baseColorTexture !== void 0 && i.push(r.assignTexture(e, "map", o.baseColorTexture, Ki));
    }
    return Promise.all(i);
  }
}
class Lx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = i.extensions[this.name].emissiveStrength;
    return o !== void 0 && (t.emissiveIntensity = o), Promise.resolve();
  }
}
class Ox {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    if (l.clearcoatFactor !== void 0 && (t.clearcoat = l.clearcoatFactor), l.clearcoatTexture !== void 0 && o.push(r.assignTexture(t, "clearcoatMap", l.clearcoatTexture)), l.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = l.clearcoatRoughnessFactor), l.clearcoatRoughnessTexture !== void 0 && o.push(r.assignTexture(t, "clearcoatRoughnessMap", l.clearcoatRoughnessTexture)), l.clearcoatNormalTexture !== void 0 && (o.push(r.assignTexture(t, "clearcoatNormalMap", l.clearcoatNormalTexture)), l.clearcoatNormalTexture.scale !== void 0)) {
      const c = l.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new ce(c, c);
    }
    return Promise.all(o);
  }
}
class Dx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = i.extensions[this.name];
    return t.dispersion = o.dispersion !== void 0 ? o.dispersion : 0, Promise.resolve();
  }
}
class Ix {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return l.iridescenceFactor !== void 0 && (t.iridescence = l.iridescenceFactor), l.iridescenceTexture !== void 0 && o.push(r.assignTexture(t, "iridescenceMap", l.iridescenceTexture)), l.iridescenceIor !== void 0 && (t.iridescenceIOR = l.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), l.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = l.iridescenceThicknessMinimum), l.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = l.iridescenceThicknessMaximum), l.iridescenceThicknessTexture !== void 0 && o.push(
      r.assignTexture(t, "iridescenceThicknessMap", l.iridescenceThicknessTexture)
    ), Promise.all(o);
  }
}
class Fx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [];
    t.sheenColor = new oe(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const l = i.extensions[this.name];
    if (l.sheenColorFactor !== void 0) {
      const c = l.sheenColorFactor;
      t.sheenColor.setRGB(c[0], c[1], c[2], jr);
    }
    return l.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = l.sheenRoughnessFactor), l.sheenColorTexture !== void 0 && o.push(r.assignTexture(t, "sheenColorMap", l.sheenColorTexture, Ki)), l.sheenRoughnessTexture !== void 0 && o.push(r.assignTexture(t, "sheenRoughnessMap", l.sheenRoughnessTexture)), Promise.all(o);
  }
}
class Rx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return l.transmissionFactor !== void 0 && (t.transmission = l.transmissionFactor), l.transmissionTexture !== void 0 && o.push(r.assignTexture(t, "transmissionMap", l.transmissionTexture)), Promise.all(o);
  }
}
class Bx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    t.thickness = l.thicknessFactor !== void 0 ? l.thicknessFactor : 0, l.thicknessTexture !== void 0 && o.push(r.assignTexture(t, "thicknessMap", l.thicknessTexture)), t.attenuationDistance = l.attenuationDistance || 1 / 0;
    const c = l.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new oe().setRGB(
      c[0],
      c[1],
      c[2],
      jr
    ), Promise.all(o);
  }
}
class Ux {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = i.extensions[this.name];
    return t.ior = o.ior !== void 0 ? o.ior : 1.5, Promise.resolve();
  }
}
class kx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    t.specularIntensity = l.specularFactor !== void 0 ? l.specularFactor : 1, l.specularTexture !== void 0 && o.push(r.assignTexture(t, "specularIntensityMap", l.specularTexture));
    const c = l.specularColorFactor || [1, 1, 1];
    return t.specularColor = new oe().setRGB(c[0], c[1], c[2], jr), l.specularColorTexture !== void 0 && o.push(
      r.assignTexture(t, "specularColorMap", l.specularColorTexture, Ki)
    ), Promise.all(o);
  }
}
class zx {
  constructor(e) {
    this.parser = e, this.name = me.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return t.bumpScale = l.bumpFactor !== void 0 ? l.bumpFactor : 1, l.bumpTexture !== void 0 && o.push(r.assignTexture(t, "bumpMap", l.bumpTexture)), Promise.all(o);
  }
}
class Nx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const r = this.parser.json.materials[e];
    return !r.extensions || !r.extensions[this.name] ? null : Cr;
  }
  extendMaterialParams(e, t) {
    const r = this.parser, i = r.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return l.anisotropyStrength !== void 0 && (t.anisotropy = l.anisotropyStrength), l.anisotropyRotation !== void 0 && (t.anisotropyRotation = l.anisotropyRotation), l.anisotropyTexture !== void 0 && o.push(r.assignTexture(t, "anisotropyMap", l.anisotropyTexture)), Promise.all(o);
  }
}
class Hx {
  constructor(e) {
    this.parser = e, this.name = me.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, r = t.json, i = r.textures[e];
    if (!i.extensions || !i.extensions[this.name])
      return null;
    const o = i.extensions[this.name], l = t.options.ktx2Loader;
    if (!l) {
      if (r.extensionsRequired && r.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, o.source, l);
  }
}
class Vx {
  constructor(e) {
    this.parser = e, this.name = me.EXT_TEXTURE_WEBP, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, r = this.parser, i = r.json, o = i.textures[e];
    if (!o.extensions || !o.extensions[t])
      return null;
    const l = o.extensions[t], c = i.images[l.source];
    let u = r.textureLoader;
    if (c.uri) {
      const f = r.options.manager.getHandler(c.uri);
      f !== null && (u = f);
    }
    return this.detectSupport().then(function(f) {
      if (f)
        return r.loadTextureImage(e, l.source, u);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      return r.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class Wx {
  constructor(e) {
    this.parser = e, this.name = me.EXT_TEXTURE_AVIF, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, r = this.parser, i = r.json, o = i.textures[e];
    if (!o.extensions || !o.extensions[t])
      return null;
    const l = o.extensions[t], c = i.images[l.source];
    let u = r.textureLoader;
    if (c.uri) {
      const f = r.options.manager.getHandler(c.uri);
      f !== null && (u = f);
    }
    return this.detectSupport().then(function(f) {
      if (f)
        return r.loadTextureImage(e, l.source, u);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
      return r.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class Gx {
  constructor(e) {
    this.name = me.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, r = t.bufferViews[e];
    if (r.extensions && r.extensions[this.name]) {
      const i = r.extensions[this.name], o = this.parser.getDependency("buffer", i.buffer), l = this.parser.options.meshoptDecoder;
      if (!l || !l.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return o.then(function(c) {
        const u = i.byteOffset || 0, f = i.byteLength || 0, p = i.count, d = i.byteStride, g = new Uint8Array(c, u, f);
        return l.decodeGltfBufferAsync ? l.decodeGltfBufferAsync(p, d, g, i.mode, i.filter).then(function(y) {
          return y.buffer;
        }) : l.ready.then(function() {
          const y = new ArrayBuffer(p * d);
          return l.decodeGltfBuffer(
            new Uint8Array(y),
            p,
            d,
            g,
            i.mode,
            i.filter
          ), y;
        });
      });
    } else
      return null;
  }
}
class jx {
  constructor(e) {
    this.name = me.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, r = t.nodes[e];
    if (!r.extensions || !r.extensions[this.name] || r.mesh === void 0)
      return null;
    const i = t.meshes[r.mesh];
    for (const f of i.primitives)
      if (f.mode !== Yt.TRIANGLES && f.mode !== Yt.TRIANGLE_STRIP && f.mode !== Yt.TRIANGLE_FAN && f.mode !== void 0)
        return null;
    const l = r.extensions[this.name].attributes, c = [], u = {};
    for (const f in l)
      c.push(
        this.parser.getDependency("accessor", l[f]).then((p) => (u[f] = p, u[f]))
      );
    return c.length < 1 ? null : (c.push(this.parser.createNodeMesh(e)), Promise.all(c).then((f) => {
      const p = f.pop(), d = p.isGroup ? p.children : [p], g = f[0].count, y = [];
      for (const b of d) {
        const T = new xe(), x = new I(), E = new pr(), M = new I(1, 1, 1), A = new _c(b.geometry, b.material, g);
        for (let D = 0; D < g; D++)
          u.TRANSLATION && x.fromBufferAttribute(u.TRANSLATION, D), u.ROTATION && E.fromBufferAttribute(u.ROTATION, D), u.SCALE && M.fromBufferAttribute(u.SCALE, D), A.setMatrixAt(D, T.compose(x, E, M));
        for (const D in u)
          if (D === "_COLOR_0") {
            const z = u[D];
            A.instanceColor = new Ql(z.array, z.itemSize, z.normalized);
          } else D !== "TRANSLATION" && D !== "ROTATION" && D !== "SCALE" && b.geometry.setAttribute(D, u[D]);
        mr.prototype.copy.call(A, b), this.parser.assignFinalMaterial(A), y.push(A);
      }
      return p.isGroup ? (p.clear(), p.add(...y), p) : y[0];
    }));
  }
}
const Dd = "glTF", ss = 12, mf = { JSON: 1313821514, BIN: 5130562 };
class $x {
  constructor(e) {
    this.name = me.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, ss);
    if (this.header = {
      magic: Bn(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== Dd)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const r = this.header.length - ss, i = new DataView(e, ss);
    let o = 0;
    for (; o < r; ) {
      const l = i.getUint32(o, !0);
      o += 4;
      const c = i.getUint32(o, !0);
      if (o += 4, c === mf.JSON) {
        const u = new Uint8Array(e, ss + o, l);
        this.content = Bn(u);
      } else if (c === mf.BIN) {
        const u = ss + o;
        this.body = e.slice(u, u + l);
      }
      o += l;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class Xx {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = me.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const r = this.json, i = this.dracoLoader, o = e.extensions[this.name].bufferView, l = e.extensions[this.name].attributes, c = {}, u = {}, f = {};
    for (const p in l) {
      const d = cc[p] || p.toLowerCase();
      c[d] = l[p];
    }
    for (const p in e.attributes) {
      const d = cc[p] || p.toLowerCase();
      if (l[p] !== void 0) {
        const g = r.accessors[e.attributes[p]], y = In[g.componentType];
        f[d] = y.name, u[d] = g.normalized === !0;
      }
    }
    return t.getDependency("bufferView", o).then(function(p) {
      return new Promise(function(d, g) {
        i.decodeDracoFile(
          p,
          function(y) {
            for (const b in y.attributes) {
              const T = y.attributes[b], x = u[b];
              x !== void 0 && (T.normalized = x);
            }
            d(y);
          },
          c,
          f,
          jr,
          g
        );
      });
    });
  }
}
class Yx {
  constructor() {
    this.name = me.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class Zx {
  constructor() {
    this.name = me.KHR_MESH_QUANTIZATION;
  }
}
class Id extends e1 {
  constructor(e, t, r, i) {
    super(e, t, r, i);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, r = this.sampleValues, i = this.valueSize, o = e * i * 3 + i;
    for (let l = 0; l !== i; l++)
      t[l] = r[o + l];
    return t;
  }
  interpolate_(e, t, r, i) {
    const o = this.resultBuffer, l = this.sampleValues, c = this.valueSize, u = c * 2, f = c * 3, p = i - t, d = (r - t) / p, g = d * d, y = g * d, b = e * f, T = b - f, x = -2 * y + 3 * g, E = y - g, M = 1 - x, A = E - g + d;
    for (let D = 0; D !== c; D++) {
      const z = l[T + D + c], j = l[T + D + u] * p, V = l[b + D + c], R = l[b + D] * p;
      o[D] = M * z + A * j + x * V + E * R;
    }
    return o;
  }
}
const Kx = /* @__PURE__ */ new pr();
class qx extends Id {
  interpolate_(e, t, r, i) {
    const o = super.interpolate_(e, t, r, i);
    return Kx.fromArray(o).normalize().toArray(o), o;
  }
}
const Yt = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}, In = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, gf = {
  9728: ld,
  9729: yi,
  9984: Zw,
  9985: Yw,
  9986: Xw,
  9987: Ls
}, _f = {
  33071: Jl,
  33648: Kw,
  10497: _r
}, Cl = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, cc = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  // uv => uv1, 4 uv channels
  // https://github.com/mrdoob/three.js/pull/25943
  // https://github.com/mrdoob/three.js/pull/25788
  ...sa >= 152 ? {
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv1",
    TEXCOORD_2: "uv2",
    TEXCOORD_3: "uv3"
  } : {
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv2"
  },
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, oi = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, Qx = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: pd,
  STEP: Jw
}, Ll = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function Jx(s) {
  return s.DefaultMaterial === void 0 && (s.DefaultMaterial = new Os({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: ea
  })), s.DefaultMaterial;
}
function Hi(s, e, t) {
  for (const r in t.extensions)
    s[r] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[r] = t.extensions[r]);
}
function Vr(s, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(s.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function eb(s, e, t) {
  let r = !1, i = !1, o = !1;
  for (let f = 0, p = e.length; f < p; f++) {
    const d = e[f];
    if (d.POSITION !== void 0 && (r = !0), d.NORMAL !== void 0 && (i = !0), d.COLOR_0 !== void 0 && (o = !0), r && i && o)
      break;
  }
  if (!r && !i && !o)
    return Promise.resolve(s);
  const l = [], c = [], u = [];
  for (let f = 0, p = e.length; f < p; f++) {
    const d = e[f];
    if (r) {
      const g = d.POSITION !== void 0 ? t.getDependency("accessor", d.POSITION) : s.attributes.position;
      l.push(g);
    }
    if (i) {
      const g = d.NORMAL !== void 0 ? t.getDependency("accessor", d.NORMAL) : s.attributes.normal;
      c.push(g);
    }
    if (o) {
      const g = d.COLOR_0 !== void 0 ? t.getDependency("accessor", d.COLOR_0) : s.attributes.color;
      u.push(g);
    }
  }
  return Promise.all([
    Promise.all(l),
    Promise.all(c),
    Promise.all(u)
  ]).then(function(f) {
    const p = f[0], d = f[1], g = f[2];
    return r && (s.morphAttributes.position = p), i && (s.morphAttributes.normal = d), o && (s.morphAttributes.color = g), s.morphTargetsRelative = !0, s;
  });
}
function tb(s, e) {
  if (s.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, r = e.weights.length; t < r; t++)
      s.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (s.morphTargetInfluences.length === t.length) {
      s.morphTargetDictionary = {};
      for (let r = 0, i = t.length; r < i; r++)
        s.morphTargetDictionary[t[r]] = r;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function rb(s) {
  let e;
  const t = s.extensions && s.extensions[me.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + Ol(t.attributes) : e = s.indices + ":" + Ol(s.attributes) + ":" + s.mode, s.targets !== void 0)
    for (let r = 0, i = s.targets.length; r < i; r++)
      e += ":" + Ol(s.targets[r]);
  return e;
}
function Ol(s) {
  let e = "";
  const t = Object.keys(s).sort();
  for (let r = 0, i = t.length; r < i; r++)
    e += t[r] + ":" + s[t[r]] + ";";
  return e;
}
function uc(s) {
  switch (s) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function ib(s) {
  return s.search(/\.jpe?g($|\?)/i) > 0 || s.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : s.search(/\.webp($|\?)/i) > 0 || s.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
}
const nb = /* @__PURE__ */ new xe();
class sb {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Px(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let r = !1, i = !1, o = -1;
    typeof navigator < "u" && typeof navigator.userAgent < "u" && (r = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0, i = navigator.userAgent.indexOf("Firefox") > -1, o = i ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1), typeof createImageBitmap > "u" || r || i && o < 98 ? this.textureLoader = new ra(this.options.manager) : this.textureLoader = new jw(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new vi(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const r = this, i = this.json, o = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(l) {
      return l._markDefs && l._markDefs();
    }), Promise.all(
      this._invokeAll(function(l) {
        return l.beforeRoot && l.beforeRoot();
      })
    ).then(function() {
      return Promise.all([
        r.getDependencies("scene"),
        r.getDependencies("animation"),
        r.getDependencies("camera")
      ]);
    }).then(function(l) {
      const c = {
        scene: l[0][i.scene || 0],
        scenes: l[0],
        animations: l[1],
        cameras: l[2],
        asset: i.asset,
        parser: r,
        userData: {}
      };
      return Hi(o, c, i), Vr(c, i), Promise.all(
        r._invokeAll(function(u) {
          return u.afterRoot && u.afterRoot(c);
        })
      ).then(function() {
        for (const u of c.scenes)
          u.updateMatrixWorld();
        e(c);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], r = this.json.meshes || [];
    for (let i = 0, o = t.length; i < o; i++) {
      const l = t[i].joints;
      for (let c = 0, u = l.length; c < u; c++)
        e[l[c]].isBone = !0;
    }
    for (let i = 0, o = e.length; i < o; i++) {
      const l = e[i];
      l.mesh !== void 0 && (this._addNodeRef(this.meshCache, l.mesh), l.skin !== void 0 && (r[l.mesh].isSkinnedMesh = !0)), l.camera !== void 0 && this._addNodeRef(this.cameraCache, l.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(e, t, r) {
    if (e.refs[t] <= 1)
      return r;
    const i = r.clone(), o = (l, c) => {
      const u = this.associations.get(l);
      u != null && this.associations.set(c, u);
      for (const [f, p] of l.children.entries())
        o(p, c.children[f]);
    };
    return o(r, i), i.name += "_instance_" + e.uses[t]++, i;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let r = 0; r < t.length; r++) {
      const i = e(t[r]);
      if (i)
        return i;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const r = [];
    for (let i = 0; i < t.length; i++) {
      const o = e(t[i]);
      o && r.push(o);
    }
    return r;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const r = e + ":" + t;
    let i = this.cache.get(r);
    if (!i) {
      switch (e) {
        case "scene":
          i = this.loadScene(t);
          break;
        case "node":
          i = this._invokeOne(function(o) {
            return o.loadNode && o.loadNode(t);
          });
          break;
        case "mesh":
          i = this._invokeOne(function(o) {
            return o.loadMesh && o.loadMesh(t);
          });
          break;
        case "accessor":
          i = this.loadAccessor(t);
          break;
        case "bufferView":
          i = this._invokeOne(function(o) {
            return o.loadBufferView && o.loadBufferView(t);
          });
          break;
        case "buffer":
          i = this.loadBuffer(t);
          break;
        case "material":
          i = this._invokeOne(function(o) {
            return o.loadMaterial && o.loadMaterial(t);
          });
          break;
        case "texture":
          i = this._invokeOne(function(o) {
            return o.loadTexture && o.loadTexture(t);
          });
          break;
        case "skin":
          i = this.loadSkin(t);
          break;
        case "animation":
          i = this._invokeOne(function(o) {
            return o.loadAnimation && o.loadAnimation(t);
          });
          break;
        case "camera":
          i = this.loadCamera(t);
          break;
        default:
          if (i = this._invokeOne(function(o) {
            return o != this && o.getDependency && o.getDependency(e, t);
          }), !i)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(r, i);
    }
    return i;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const r = this, i = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(
        i.map(function(o, l) {
          return r.getDependency(e, l);
        })
      ), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], r = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[me.KHR_BINARY_GLTF].body);
    const i = this.options;
    return new Promise(function(o, l) {
      r.load(On.resolveURL(t.uri, i.path), o, void 0, function() {
        l(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(r) {
      const i = t.byteLength || 0, o = t.byteOffset || 0;
      return r.slice(o, o + i);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, r = this.json, i = this.json.accessors[e];
    if (i.bufferView === void 0 && i.sparse === void 0) {
      const l = Cl[i.type], c = In[i.componentType], u = i.normalized === !0, f = new c(i.count * l);
      return Promise.resolve(new mt(f, l, u));
    }
    const o = [];
    return i.bufferView !== void 0 ? o.push(this.getDependency("bufferView", i.bufferView)) : o.push(null), i.sparse !== void 0 && (o.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), o.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(o).then(function(l) {
      const c = l[0], u = Cl[i.type], f = In[i.componentType], p = f.BYTES_PER_ELEMENT, d = p * u, g = i.byteOffset || 0, y = i.bufferView !== void 0 ? r.bufferViews[i.bufferView].byteStride : void 0, b = i.normalized === !0;
      let T, x;
      if (y && y !== d) {
        const E = Math.floor(g / y), M = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + E + ":" + i.count;
        let A = t.cache.get(M);
        A || (T = new f(c, E * y, i.count * y / p), A = new $w(T, y / p), t.cache.add(M, A)), x = new Yi(
          A,
          u,
          g % y / p,
          b
        );
      } else
        c === null ? T = new f(i.count * u) : T = new f(c, g, i.count * u), x = new mt(T, u, b);
      if (i.sparse !== void 0) {
        const E = Cl.SCALAR, M = In[i.sparse.indices.componentType], A = i.sparse.indices.byteOffset || 0, D = i.sparse.values.byteOffset || 0, z = new M(
          l[1],
          A,
          i.sparse.count * E
        ), j = new f(l[2], D, i.sparse.count * u);
        c !== null && (x = new mt(
          x.array.slice(),
          x.itemSize,
          x.normalized
        ));
        for (let V = 0, R = z.length; V < R; V++) {
          const G = z[V];
          if (x.setX(G, j[V * u]), u >= 2 && x.setY(G, j[V * u + 1]), u >= 3 && x.setZ(G, j[V * u + 2]), u >= 4 && x.setW(G, j[V * u + 3]), u >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return x;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(e) {
    const t = this.json, r = this.options, o = t.textures[e].source, l = t.images[o];
    let c = this.textureLoader;
    if (l.uri) {
      const u = r.manager.getHandler(l.uri);
      u !== null && (c = u);
    }
    return this.loadTextureImage(e, o, c);
  }
  loadTextureImage(e, t, r) {
    const i = this, o = this.json, l = o.textures[e], c = o.images[t], u = (c.uri || c.bufferView) + ":" + l.sampler;
    if (this.textureCache[u])
      return this.textureCache[u];
    const f = this.loadImageSource(t, r).then(function(p) {
      p.flipY = !1, p.name = l.name || c.name || "", p.name === "" && typeof c.uri == "string" && c.uri.startsWith("data:image/") === !1 && (p.name = c.uri);
      const g = (o.samplers || {})[l.sampler] || {};
      return p.magFilter = gf[g.magFilter] || yi, p.minFilter = gf[g.minFilter] || Ls, p.wrapS = _f[g.wrapS] || _r, p.wrapT = _f[g.wrapT] || _r, i.associations.set(p, { textures: e }), p;
    }).catch(function() {
      return null;
    });
    return this.textureCache[u] = f, f;
  }
  loadImageSource(e, t) {
    const r = this, i = this.json, o = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((d) => d.clone());
    const l = i.images[e], c = self.URL || self.webkitURL;
    let u = l.uri || "", f = !1;
    if (l.bufferView !== void 0)
      u = r.getDependency("bufferView", l.bufferView).then(function(d) {
        f = !0;
        const g = new Blob([d], { type: l.mimeType });
        return u = c.createObjectURL(g), u;
      });
    else if (l.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const p = Promise.resolve(u).then(function(d) {
      return new Promise(function(g, y) {
        let b = g;
        t.isImageBitmapLoader === !0 && (b = function(T) {
          const x = new Rn(T);
          x.needsUpdate = !0, g(x);
        }), t.load(On.resolveURL(d, o.path), b, void 0, y);
      });
    }).then(function(d) {
      return f === !0 && c.revokeObjectURL(u), Vr(d, l), d.userData.mimeType = l.mimeType || ib(l.uri), d;
    }).catch(function(d) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", u), d;
    });
    return this.sourceCache[e] = p, p;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, r, i) {
    const o = this;
    return this.getDependency("texture", r.index).then(function(l) {
      if (!l)
        return null;
      if (r.texCoord !== void 0 && r.texCoord > 0 && (l = l.clone(), l.channel = r.texCoord), o.extensions[me.KHR_TEXTURE_TRANSFORM]) {
        const c = r.extensions !== void 0 ? r.extensions[me.KHR_TEXTURE_TRANSFORM] : void 0;
        if (c) {
          const u = o.associations.get(l);
          l = o.extensions[me.KHR_TEXTURE_TRANSFORM].extendTexture(l, c), o.associations.set(l, u);
        }
      }
      return i !== void 0 && (typeof i == "number" && (i = i === pf ? Ki : jr), "colorSpace" in l ? l.colorSpace = i : l.encoding = i === Ki ? pf : Mx), e[t] = l, l;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let r = e.material;
    const i = t.attributes.tangent === void 0, o = t.attributes.color !== void 0, l = t.attributes.normal === void 0;
    if (e.isPoints) {
      const c = "PointsMaterial:" + r.uuid;
      let u = this.cache.get(c);
      u || (u = new ia(), Ml.prototype.copy.call(u, r), u.color.copy(r.color), u.map = r.map, u.sizeAttenuation = !1, this.cache.add(c, u)), r = u;
    } else if (e.isLine) {
      const c = "LineBasicMaterial:" + r.uuid;
      let u = this.cache.get(c);
      u || (u = new cd(), Ml.prototype.copy.call(u, r), u.color.copy(r.color), u.map = r.map, this.cache.add(c, u)), r = u;
    }
    if (i || o || l) {
      let c = "ClonedMaterial:" + r.uuid + ":";
      i && (c += "derivative-tangents:"), o && (c += "vertex-colors:"), l && (c += "flat-shading:");
      let u = this.cache.get(c);
      u || (u = r.clone(), o && (u.vertexColors = !0), l && (u.flatShading = !0), i && (u.normalScale && (u.normalScale.y *= -1), u.clearcoatNormalScale && (u.clearcoatNormalScale.y *= -1)), this.cache.add(c, u), this.associations.set(u, this.associations.get(r))), r = u;
    }
    e.material = r;
  }
  getMaterialType() {
    return Os;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, r = this.json, i = this.extensions, o = r.materials[e];
    let l;
    const c = {}, u = o.extensions || {}, f = [];
    if (u[me.KHR_MATERIALS_UNLIT]) {
      const d = i[me.KHR_MATERIALS_UNLIT];
      l = d.getMaterialType(), f.push(d.extendParams(c, o, t));
    } else {
      const d = o.pbrMetallicRoughness || {};
      if (c.color = new oe(1, 1, 1), c.opacity = 1, Array.isArray(d.baseColorFactor)) {
        const g = d.baseColorFactor;
        c.color.setRGB(g[0], g[1], g[2], jr), c.opacity = g[3];
      }
      d.baseColorTexture !== void 0 && f.push(t.assignTexture(c, "map", d.baseColorTexture, Ki)), c.metalness = d.metallicFactor !== void 0 ? d.metallicFactor : 1, c.roughness = d.roughnessFactor !== void 0 ? d.roughnessFactor : 1, d.metallicRoughnessTexture !== void 0 && (f.push(t.assignTexture(c, "metalnessMap", d.metallicRoughnessTexture)), f.push(t.assignTexture(c, "roughnessMap", d.metallicRoughnessTexture))), l = this._invokeOne(function(g) {
        return g.getMaterialType && g.getMaterialType(e);
      }), f.push(
        Promise.all(
          this._invokeAll(function(g) {
            return g.extendMaterialParams && g.extendMaterialParams(e, c);
          })
        )
      );
    }
    o.doubleSided === !0 && (c.side = Un);
    const p = o.alphaMode || Ll.OPAQUE;
    if (p === Ll.BLEND ? (c.transparent = !0, c.depthWrite = !1) : (c.transparent = !1, p === Ll.MASK && (c.alphaTest = o.alphaCutoff !== void 0 ? o.alphaCutoff : 0.5)), o.normalTexture !== void 0 && l !== Kt && (f.push(t.assignTexture(c, "normalMap", o.normalTexture)), c.normalScale = new ce(1, 1), o.normalTexture.scale !== void 0)) {
      const d = o.normalTexture.scale;
      c.normalScale.set(d, d);
    }
    if (o.occlusionTexture !== void 0 && l !== Kt && (f.push(t.assignTexture(c, "aoMap", o.occlusionTexture)), o.occlusionTexture.strength !== void 0 && (c.aoMapIntensity = o.occlusionTexture.strength)), o.emissiveFactor !== void 0 && l !== Kt) {
      const d = o.emissiveFactor;
      c.emissive = new oe().setRGB(
        d[0],
        d[1],
        d[2],
        jr
      );
    }
    return o.emissiveTexture !== void 0 && l !== Kt && f.push(t.assignTexture(c, "emissiveMap", o.emissiveTexture, Ki)), Promise.all(f).then(function() {
      const d = new l(c);
      return o.name && (d.name = o.name), Vr(d, o), t.associations.set(d, { materials: e }), o.extensions && Hi(i, d, o), d;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(e) {
    const t = Es.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, r = this.extensions, i = this.primitiveCache;
    function o(c) {
      return r[me.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(c, t).then(function(u) {
        return yf(u, c, t);
      });
    }
    const l = [];
    for (let c = 0, u = e.length; c < u; c++) {
      const f = e[c], p = rb(f), d = i[p];
      if (d)
        l.push(d.promise);
      else {
        let g;
        f.extensions && f.extensions[me.KHR_DRACO_MESH_COMPRESSION] ? g = o(f) : g = yf(new qt(), f, t), i[p] = { primitive: f, promise: g }, l.push(g);
      }
    }
    return Promise.all(l);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(e) {
    const t = this, r = this.json, i = this.extensions, o = r.meshes[e], l = o.primitives, c = [];
    for (let u = 0, f = l.length; u < f; u++) {
      const p = l[u].material === void 0 ? Jx(this.cache) : this.getDependency("material", l[u].material);
      c.push(p);
    }
    return c.push(t.loadGeometries(l)), Promise.all(c).then(function(u) {
      const f = u.slice(0, u.length - 1), p = u[u.length - 1], d = [];
      for (let y = 0, b = p.length; y < b; y++) {
        const T = p[y], x = l[y];
        let E;
        const M = f[y];
        if (x.mode === Yt.TRIANGLES || x.mode === Yt.TRIANGLE_STRIP || x.mode === Yt.TRIANGLE_FAN || x.mode === void 0)
          E = o.isSkinnedMesh === !0 ? new ud(T, M) : new Ue(T, M), E.isSkinnedMesh === !0 && E.normalizeSkinWeights(), x.mode === Yt.TRIANGLE_STRIP ? E.geometry = lf(E.geometry, nd) : x.mode === Yt.TRIANGLE_FAN && (E.geometry = lf(E.geometry, Kl));
        else if (x.mode === Yt.LINES)
          E = new qw(T, M);
        else if (x.mode === Yt.LINE_STRIP)
          E = new hd(T, M);
        else if (x.mode === Yt.LINE_LOOP)
          E = new Qw(T, M);
        else if (x.mode === Yt.POINTS)
          E = new kn(T, M);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + x.mode);
        Object.keys(E.geometry.morphAttributes).length > 0 && tb(E, o), E.name = t.createUniqueName(o.name || "mesh_" + e), Vr(E, o), x.extensions && Hi(i, E, x), t.assignFinalMaterial(E), d.push(E);
      }
      for (let y = 0, b = d.length; y < b; y++)
        t.associations.set(d[y], {
          meshes: e,
          primitives: y
        });
      if (d.length === 1)
        return o.extensions && Hi(i, d[0], o), d[0];
      const g = new Qt();
      o.extensions && Hi(i, g, o), t.associations.set(g, { meshes: e });
      for (let y = 0, b = d.length; y < b; y++)
        g.add(d[y]);
      return g;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(e) {
    let t;
    const r = this.json.cameras[e], i = r[r.type];
    if (!i) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return r.type === "perspective" ? t = new qi(
      lt.radToDeg(i.yfov),
      i.aspectRatio || 1,
      i.znear || 1,
      i.zfar || 2e6
    ) : r.type === "orthographic" && (t = new Ln(-i.xmag, i.xmag, i.ymag, -i.ymag, i.znear, i.zfar)), r.name && (t.name = this.createUniqueName(r.name)), Vr(t, r), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], r = [];
    for (let i = 0, o = t.joints.length; i < o; i++)
      r.push(this._loadNodeShallow(t.joints[i]));
    return t.inverseBindMatrices !== void 0 ? r.push(this.getDependency("accessor", t.inverseBindMatrices)) : r.push(null), Promise.all(r).then(function(i) {
      const o = i.pop(), l = i, c = [], u = [];
      for (let f = 0, p = l.length; f < p; f++) {
        const d = l[f];
        if (d) {
          c.push(d);
          const g = new xe();
          o !== null && g.fromArray(o.array, f * 16), u.push(g);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[f]);
      }
      return new fd(c, u);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, r = this, i = t.animations[e], o = i.name ? i.name : "animation_" + e, l = [], c = [], u = [], f = [], p = [];
    for (let d = 0, g = i.channels.length; d < g; d++) {
      const y = i.channels[d], b = i.samplers[y.sampler], T = y.target, x = T.node, E = i.parameters !== void 0 ? i.parameters[b.input] : b.input, M = i.parameters !== void 0 ? i.parameters[b.output] : b.output;
      T.node !== void 0 && (l.push(this.getDependency("node", x)), c.push(this.getDependency("accessor", E)), u.push(this.getDependency("accessor", M)), f.push(b), p.push(T));
    }
    return Promise.all([
      Promise.all(l),
      Promise.all(c),
      Promise.all(u),
      Promise.all(f),
      Promise.all(p)
    ]).then(function(d) {
      const g = d[0], y = d[1], b = d[2], T = d[3], x = d[4], E = [];
      for (let M = 0, A = g.length; M < A; M++) {
        const D = g[M], z = y[M], j = b[M], V = T[M], R = x[M];
        if (D === void 0)
          continue;
        D.updateMatrix && D.updateMatrix();
        const G = r._createAnimationTracks(D, z, j, V, R);
        if (G)
          for (let k = 0; k < G.length; k++)
            E.push(G[k]);
      }
      return new dd(o, void 0, E);
    });
  }
  createNodeMesh(e) {
    const t = this.json, r = this, i = t.nodes[e];
    return i.mesh === void 0 ? null : r.getDependency("mesh", i.mesh).then(function(o) {
      const l = r._getNodeRef(r.meshCache, i.mesh, o);
      return i.weights !== void 0 && l.traverse(function(c) {
        if (c.isMesh)
          for (let u = 0, f = i.weights.length; u < f; u++)
            c.morphTargetInfluences[u] = i.weights[u];
      }), l;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, r = this, i = t.nodes[e], o = r._loadNodeShallow(e), l = [], c = i.children || [];
    for (let f = 0, p = c.length; f < p; f++)
      l.push(r.getDependency("node", c[f]));
    const u = i.skin === void 0 ? Promise.resolve(null) : r.getDependency("skin", i.skin);
    return Promise.all([o, Promise.all(l), u]).then(function(f) {
      const p = f[0], d = f[1], g = f[2];
      g !== null && p.traverse(function(y) {
        y.isSkinnedMesh && y.bind(g, nb);
      });
      for (let y = 0, b = d.length; y < b; y++)
        p.add(d[y]);
      return p;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, r = this.extensions, i = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const o = t.nodes[e], l = o.name ? i.createUniqueName(o.name) : "", c = [], u = i._invokeOne(function(f) {
      return f.createNodeMesh && f.createNodeMesh(e);
    });
    return u && c.push(u), o.camera !== void 0 && c.push(
      i.getDependency("camera", o.camera).then(function(f) {
        return i._getNodeRef(i.cameraCache, o.camera, f);
      })
    ), i._invokeAll(function(f) {
      return f.createNodeAttachment && f.createNodeAttachment(e);
    }).forEach(function(f) {
      c.push(f);
    }), this.nodeCache[e] = Promise.all(c).then(function(f) {
      let p;
      if (o.isBone === !0 ? p = new ec() : f.length > 1 ? p = new Qt() : f.length === 1 ? p = f[0] : p = new mr(), p !== f[0])
        for (let d = 0, g = f.length; d < g; d++)
          p.add(f[d]);
      if (o.name && (p.userData.name = o.name, p.name = l), Vr(p, o), o.extensions && Hi(r, p, o), o.matrix !== void 0) {
        const d = new xe();
        d.fromArray(o.matrix), p.applyMatrix4(d);
      } else
        o.translation !== void 0 && p.position.fromArray(o.translation), o.rotation !== void 0 && p.quaternion.fromArray(o.rotation), o.scale !== void 0 && p.scale.fromArray(o.scale);
      return i.associations.has(p) || i.associations.set(p, {}), i.associations.get(p).nodes = e, p;
    }), this.nodeCache[e];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, r = this.json.scenes[e], i = this, o = new Qt();
    r.name && (o.name = i.createUniqueName(r.name)), Vr(o, r), r.extensions && Hi(t, o, r);
    const l = r.nodes || [], c = [];
    for (let u = 0, f = l.length; u < f; u++)
      c.push(i.getDependency("node", l[u]));
    return Promise.all(c).then(function(u) {
      for (let p = 0, d = u.length; p < d; p++)
        o.add(u[p]);
      const f = (p) => {
        const d = /* @__PURE__ */ new Map();
        for (const [g, y] of i.associations)
          (g instanceof Ml || g instanceof Rn) && d.set(g, y);
        return p.traverse((g) => {
          const y = i.associations.get(g);
          y != null && d.set(g, y);
        }), d;
      };
      return i.associations = f(o), o;
    });
  }
  _createAnimationTracks(e, t, r, i, o) {
    const l = [], c = e.name ? e.name : e.uuid, u = [];
    oi[o.path] === oi.weights ? e.traverse(function(g) {
      g.morphTargetInfluences && u.push(g.name ? g.name : g.uuid);
    }) : u.push(c);
    let f;
    switch (oi[o.path]) {
      case oi.weights:
        f = rc;
        break;
      case oi.rotation:
        f = ic;
        break;
      case oi.position:
      case oi.scale:
        f = tc;
        break;
      default:
        r.itemSize === 1 ? f = rc : f = tc;
        break;
    }
    const p = i.interpolation !== void 0 ? Qx[i.interpolation] : pd, d = this._getArrayFromAccessor(r);
    for (let g = 0, y = u.length; g < y; g++) {
      const b = new f(
        u[g] + "." + oi[o.path],
        t.array,
        d,
        p
      );
      i.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(b), l.push(b);
    }
    return l;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const r = uc(t.constructor), i = new Float32Array(t.length);
      for (let o = 0, l = t.length; o < l; o++)
        i[o] = t[o] * r;
      t = i;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(r) {
      const i = this instanceof ic ? qx : Id;
      return new i(this.times, this.values, this.getValueSize() / 3, r);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function ob(s, e, t) {
  const r = e.attributes, i = new en();
  if (r.POSITION !== void 0) {
    const c = t.json.accessors[r.POSITION], u = c.min, f = c.max;
    if (u !== void 0 && f !== void 0) {
      if (i.set(new I(u[0], u[1], u[2]), new I(f[0], f[1], f[2])), c.normalized) {
        const p = uc(In[c.componentType]);
        i.min.multiplyScalar(p), i.max.multiplyScalar(p);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const o = e.targets;
  if (o !== void 0) {
    const c = new I(), u = new I();
    for (let f = 0, p = o.length; f < p; f++) {
      const d = o[f];
      if (d.POSITION !== void 0) {
        const g = t.json.accessors[d.POSITION], y = g.min, b = g.max;
        if (y !== void 0 && b !== void 0) {
          if (u.setX(Math.max(Math.abs(y[0]), Math.abs(b[0]))), u.setY(Math.max(Math.abs(y[1]), Math.abs(b[1]))), u.setZ(Math.max(Math.abs(y[2]), Math.abs(b[2]))), g.normalized) {
            const T = uc(In[g.componentType]);
            u.multiplyScalar(T);
          }
          c.max(u);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    i.expandByVector(c);
  }
  s.boundingBox = i;
  const l = new yc();
  i.getCenter(l.center), l.radius = i.min.distanceTo(i.max) / 2, s.boundingSphere = l;
}
function yf(s, e, t) {
  const r = e.attributes, i = [];
  function o(l, c) {
    return t.getDependency("accessor", l).then(function(u) {
      s.setAttribute(c, u);
    });
  }
  for (const l in r) {
    const c = cc[l] || l.toLowerCase();
    c in s.attributes || i.push(o(r[l], c));
  }
  if (e.indices !== void 0 && !s.index) {
    const l = t.getDependency("accessor", e.indices).then(function(c) {
      s.setIndex(c);
    });
    i.push(l);
  }
  return Vr(s, e), ob(s, e, t), Promise.all(i).then(function() {
    return e.targets !== void 0 ? eb(s, e.targets, t) : s;
  });
}
function Fd(s, e, t) {
  const r = t.length - s - 1;
  if (e >= t[r])
    return r - 1;
  if (e <= t[s])
    return s;
  let i = s, o = r, l = Math.floor((i + o) / 2);
  for (; e < t[l] || e >= t[l + 1]; )
    e < t[l] ? o = l : i = l, l = Math.floor((i + o) / 2);
  return l;
}
function ab(s, e, t, r) {
  const i = [], o = [], l = [];
  i[0] = 1;
  for (let c = 1; c <= t; ++c) {
    o[c] = e - r[s + 1 - c], l[c] = r[s + c] - e;
    let u = 0;
    for (let f = 0; f < c; ++f) {
      const p = l[f + 1], d = o[c - f], g = i[f] / (p + d);
      i[f] = u + p * g, u = d * g;
    }
    i[c] = u;
  }
  return i;
}
function lb(s, e, t, r) {
  const i = Fd(s, r, e), o = ab(i, r, s, e), l = new gr(0, 0, 0, 0);
  for (let c = 0; c <= s; ++c) {
    const u = t[i - s + c], f = o[c], p = u.w * f;
    l.x += u.x * p, l.y += u.y * p, l.z += u.z * p, l.w += u.w * f;
  }
  return l;
}
function cb(s, e, t, r, i) {
  const o = [];
  for (let d = 0; d <= t; ++d)
    o[d] = 0;
  const l = [];
  for (let d = 0; d <= r; ++d)
    l[d] = o.slice(0);
  const c = [];
  for (let d = 0; d <= t; ++d)
    c[d] = o.slice(0);
  c[0][0] = 1;
  const u = o.slice(0), f = o.slice(0);
  for (let d = 1; d <= t; ++d) {
    u[d] = e - i[s + 1 - d], f[d] = i[s + d] - e;
    let g = 0;
    for (let y = 0; y < d; ++y) {
      const b = f[y + 1], T = u[d - y];
      c[d][y] = b + T;
      const x = c[y][d - 1] / c[d][y];
      c[y][d] = g + b * x, g = T * x;
    }
    c[d][d] = g;
  }
  for (let d = 0; d <= t; ++d)
    l[0][d] = c[d][t];
  for (let d = 0; d <= t; ++d) {
    let g = 0, y = 1;
    const b = [];
    for (let T = 0; T <= t; ++T)
      b[T] = o.slice(0);
    b[0][0] = 1;
    for (let T = 1; T <= r; ++T) {
      let x = 0;
      const E = d - T, M = t - T;
      d >= T && (b[y][0] = b[g][0] / c[M + 1][E], x = b[y][0] * c[E][M]);
      const A = E >= -1 ? 1 : -E, D = d - 1 <= M ? T - 1 : t - d;
      for (let j = A; j <= D; ++j)
        b[y][j] = (b[g][j] - b[g][j - 1]) / c[M + 1][E + j], x += b[y][j] * c[E + j][M];
      d <= M && (b[y][T] = -b[g][T - 1] / c[M + 1][d], x += b[y][T] * c[d][M]), l[T][d] = x;
      const z = g;
      g = y, y = z;
    }
  }
  let p = t;
  for (let d = 1; d <= r; ++d) {
    for (let g = 0; g <= t; ++g)
      l[d][g] *= p;
    p *= t - d;
  }
  return l;
}
function ub(s, e, t, r, i) {
  const o = i < s ? i : s, l = [], c = Fd(s, r, e), u = cb(c, r, s, o, e), f = [];
  for (let p = 0; p < t.length; ++p) {
    const d = t[p].clone(), g = d.w;
    d.x *= g, d.y *= g, d.z *= g, f[p] = d;
  }
  for (let p = 0; p <= o; ++p) {
    const d = f[c - s].clone().multiplyScalar(u[p][0]);
    for (let g = 1; g <= s; ++g)
      d.add(f[c - s + g].clone().multiplyScalar(u[p][g]));
    l[p] = d;
  }
  for (let p = o + 1; p <= i + 1; ++p)
    l[p] = new gr(0, 0, 0);
  return l;
}
function hb(s, e) {
  let t = 1;
  for (let i = 2; i <= s; ++i)
    t *= i;
  let r = 1;
  for (let i = 2; i <= e; ++i)
    r *= i;
  for (let i = 2; i <= s - e; ++i)
    r *= i;
  return t / r;
}
function fb(s) {
  const e = s.length, t = [], r = [];
  for (let o = 0; o < e; ++o) {
    const l = s[o];
    t[o] = new I(l.x, l.y, l.z), r[o] = l.w;
  }
  const i = [];
  for (let o = 0; o < e; ++o) {
    const l = t[o].clone();
    for (let c = 1; c <= o; ++c)
      l.sub(i[o - c].clone().multiplyScalar(hb(o, c) * r[c]));
    i[o] = l.divideScalar(r[0]);
  }
  return i;
}
function db(s, e, t, r, i) {
  const o = ub(s, e, t, r, i);
  return fb(o);
}
class vf extends t1 {
  constructor(e, t, r, i, o) {
    super(), this.degree = e, this.knots = t, this.controlPoints = [], this.startKnot = i || 0, this.endKnot = o || this.knots.length - 1;
    for (let l = 0; l < r.length; ++l) {
      const c = r[l];
      this.controlPoints[l] = new gr(c.x, c.y, c.z, c.w);
    }
  }
  getPoint(e, t) {
    const r = t || new I(), i = this.knots[this.startKnot] + e * (this.knots[this.endKnot] - this.knots[this.startKnot]), o = lb(this.degree, this.knots, this.controlPoints, i);
    return o.w != 1 && o.divideScalar(o.w), r.set(o.x, o.y, o.z);
  }
  getTangent(e, t) {
    const r = t || new I(), i = this.knots[0] + e * (this.knots[this.knots.length - 1] - this.knots[0]), o = db(this.degree, this.knots, this.controlPoints, i, 1);
    return r.copy(o[1]).normalize(), r;
  }
}
let pe, Ve, Mt;
class pb extends gc {
  constructor(e) {
    super(e);
  }
  load(e, t, r, i) {
    const o = this, l = o.path === "" ? On.extractUrlBase(e) : o.path, c = new vi(this.manager);
    c.setPath(o.path), c.setResponseType("arraybuffer"), c.setRequestHeader(o.requestHeader), c.setWithCredentials(o.withCredentials), c.load(
      e,
      function(u) {
        try {
          t(o.parse(u, l));
        } catch (f) {
          i ? i(f) : console.error(f), o.manager.itemError(e);
        }
      },
      r,
      i
    );
  }
  parse(e, t) {
    if (wb(e))
      pe = new vb().parse(e);
    else {
      const i = kd(e);
      if (!xb(i))
        throw new Error("THREE.FBXLoader: Unknown format.");
      if (xf(i) < 7e3)
        throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + xf(i));
      pe = new yb().parse(i);
    }
    const r = new ra(this.manager).setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin);
    return new mb(r, this.manager).parse(pe);
  }
}
class mb {
  constructor(e, t) {
    this.textureLoader = e, this.manager = t;
  }
  parse() {
    Ve = this.parseConnections();
    const e = this.parseImages(), t = this.parseTextures(e), r = this.parseMaterials(t), i = this.parseDeformers(), o = new gb().parse(i);
    return this.parseScene(i, o, r), Mt;
  }
  // Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
  // and details the connection type
  parseConnections() {
    const e = /* @__PURE__ */ new Map();
    return "Connections" in pe && pe.Connections.connections.forEach(function(r) {
      const i = r[0], o = r[1], l = r[2];
      e.has(i) || e.set(i, {
        parents: [],
        children: []
      });
      const c = { ID: o, relationship: l };
      e.get(i).parents.push(c), e.has(o) || e.set(o, {
        parents: [],
        children: []
      });
      const u = { ID: i, relationship: l };
      e.get(o).children.push(u);
    }), e;
  }
  // Parse FBXTree.Objects.Video for embedded image data
  // These images are connected to textures in FBXTree.Objects.Textures
  // via FBXTree.Connections.
  parseImages() {
    const e = {}, t = {};
    if ("Video" in pe.Objects) {
      const r = pe.Objects.Video;
      for (const i in r) {
        const o = r[i], l = parseInt(i);
        if (e[l] = o.RelativeFilename || o.Filename, "Content" in o) {
          const c = o.Content instanceof ArrayBuffer && o.Content.byteLength > 0, u = typeof o.Content == "string" && o.Content !== "";
          if (c || u) {
            const f = this.parseImage(r[i]);
            t[o.RelativeFilename || o.Filename] = f;
          }
        }
      }
    }
    for (const r in e) {
      const i = e[r];
      t[i] !== void 0 ? e[r] = t[i] : e[r] = e[r].split("\\").pop();
    }
    return e;
  }
  // Parse embedded image data in FBXTree.Video.Content
  parseImage(e) {
    const t = e.Content, r = e.RelativeFilename || e.Filename, i = r.slice(r.lastIndexOf(".") + 1).toLowerCase();
    let o;
    switch (i) {
      case "bmp":
        o = "image/bmp";
        break;
      case "jpg":
      case "jpeg":
        o = "image/jpeg";
        break;
      case "png":
        o = "image/png";
        break;
      case "tif":
        o = "image/tiff";
        break;
      case "tga":
        this.manager.getHandler(".tga") === null && console.warn("FBXLoader: TGA loader not found, skipping ", r), o = "image/tga";
        break;
      default:
        console.warn('FBXLoader: Image type "' + i + '" is not supported.');
        return;
    }
    if (typeof t == "string")
      return "data:" + o + ";base64," + t;
    {
      const l = new Uint8Array(t);
      return window.URL.createObjectURL(new Blob([l], { type: o }));
    }
  }
  // Parse nodes in FBXTree.Objects.Texture
  // These contain details such as UV scaling, cropping, rotation etc and are connected
  // to images in FBXTree.Objects.Video
  parseTextures(e) {
    const t = /* @__PURE__ */ new Map();
    if ("Texture" in pe.Objects) {
      const r = pe.Objects.Texture;
      for (const i in r) {
        const o = this.parseTexture(r[i], e);
        t.set(parseInt(i), o);
      }
    }
    return t;
  }
  // Parse individual node in FBXTree.Objects.Texture
  parseTexture(e, t) {
    const r = this.loadTexture(e, t);
    r.ID = e.id, r.name = e.attrName;
    const i = e.WrapModeU, o = e.WrapModeV, l = i !== void 0 ? i.value : 0, c = o !== void 0 ? o.value : 0;
    if (r.wrapS = l === 0 ? _r : Jl, r.wrapT = c === 0 ? _r : Jl, "Scaling" in e) {
      const u = e.Scaling.value;
      r.repeat.x = u[0], r.repeat.y = u[1];
    }
    return r;
  }
  // load a texture specified as a blob or data URI, or via an external URL using TextureLoader
  loadTexture(e, t) {
    let r;
    const i = this.textureLoader.path, o = Ve.get(e.id).children;
    o !== void 0 && o.length > 0 && t[o[0].ID] !== void 0 && (r = t[o[0].ID], (r.indexOf("blob:") === 0 || r.indexOf("data:") === 0) && this.textureLoader.setPath(void 0));
    let l;
    const c = e.FileName.slice(-3).toLowerCase();
    if (c === "tga") {
      const u = this.manager.getHandler(".tga");
      u === null ? (console.warn("FBXLoader: TGA loader not found, creating placeholder texture for", e.RelativeFilename), l = new Rn()) : (u.setPath(this.textureLoader.path), l = u.load(r));
    } else c === "psd" ? (console.warn(
      "FBXLoader: PSD textures are not supported, creating placeholder texture for",
      e.RelativeFilename
    ), l = new Rn()) : l = this.textureLoader.load(r);
    return this.textureLoader.setPath(i), l;
  }
  // Parse nodes in FBXTree.Objects.Material
  parseMaterials(e) {
    const t = /* @__PURE__ */ new Map();
    if ("Material" in pe.Objects) {
      const r = pe.Objects.Material;
      for (const i in r) {
        const o = this.parseMaterial(r[i], e);
        o !== null && t.set(parseInt(i), o);
      }
    }
    return t;
  }
  // Parse single node in FBXTree.Objects.Material
  // Materials are connected to texture maps in FBXTree.Objects.Textures
  // FBX format currently only supports Lambert and Phong shading models
  parseMaterial(e, t) {
    const r = e.id, i = e.attrName;
    let o = e.ShadingModel;
    if (typeof o == "object" && (o = o.value), !Ve.has(r))
      return null;
    const l = this.parseParameters(e, t, r);
    let c;
    switch (o.toLowerCase()) {
      case "phong":
        c = new Ss();
        break;
      case "lambert":
        c = new md();
        break;
      default:
        console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', o), c = new Ss();
        break;
    }
    return c.setValues(l), c.name = i, c;
  }
  // Parse FBX material and return parameters suitable for a three.js material
  // Also parse the texture map and return any textures associated with the material
  parseParameters(e, t, r) {
    const i = {};
    e.BumpFactor && (i.bumpScale = e.BumpFactor.value), e.Diffuse ? i.color = new oe().fromArray(e.Diffuse.value) : e.DiffuseColor && (e.DiffuseColor.type === "Color" || e.DiffuseColor.type === "ColorRGB") && (i.color = new oe().fromArray(e.DiffuseColor.value)), e.DisplacementFactor && (i.displacementScale = e.DisplacementFactor.value), e.Emissive ? i.emissive = new oe().fromArray(e.Emissive.value) : e.EmissiveColor && (e.EmissiveColor.type === "Color" || e.EmissiveColor.type === "ColorRGB") && (i.emissive = new oe().fromArray(e.EmissiveColor.value)), e.EmissiveFactor && (i.emissiveIntensity = parseFloat(e.EmissiveFactor.value)), e.Opacity && (i.opacity = parseFloat(e.Opacity.value)), i.opacity < 1 && (i.transparent = !0), e.ReflectionFactor && (i.reflectivity = e.ReflectionFactor.value), e.Shininess && (i.shininess = e.Shininess.value), e.Specular ? i.specular = new oe().fromArray(e.Specular.value) : e.SpecularColor && e.SpecularColor.type === "Color" && (i.specular = new oe().fromArray(e.SpecularColor.value));
    const o = this;
    return Ve.get(r).children.forEach(function(l) {
      const c = l.relationship;
      switch (c) {
        case "Bump":
          i.bumpMap = o.getTexture(t, l.ID);
          break;
        case "Maya|TEX_ao_map":
          i.aoMap = o.getTexture(t, l.ID);
          break;
        case "DiffuseColor":
        case "Maya|TEX_color_map":
          i.map = o.getTexture(t, l.ID), i.map !== void 0 && ("colorSpace" in i.map ? i.map.colorSpace = "srgb" : i.map.encoding = 3001);
          break;
        case "DisplacementColor":
          i.displacementMap = o.getTexture(t, l.ID);
          break;
        case "EmissiveColor":
          i.emissiveMap = o.getTexture(t, l.ID), i.emissiveMap !== void 0 && ("colorSpace" in i.emissiveMap ? i.emissiveMap.colorSpace = "srgb" : i.emissiveMap.encoding = 3001);
          break;
        case "NormalMap":
        case "Maya|TEX_normal_map":
          i.normalMap = o.getTexture(t, l.ID);
          break;
        case "ReflectionColor":
          i.envMap = o.getTexture(t, l.ID), i.envMap !== void 0 && (i.envMap.mapping = r1, "colorSpace" in i.envMap ? i.envMap.colorSpace = "srgb" : i.envMap.encoding = 3001);
          break;
        case "SpecularColor":
          i.specularMap = o.getTexture(t, l.ID), i.specularMap !== void 0 && ("colorSpace" in i.specularMap ? i.specularMap.colorSpace = "srgb" : i.specularMap.encoding = 3001);
          break;
        case "TransparentColor":
        case "TransparencyFactor":
          i.alphaMap = o.getTexture(t, l.ID), i.transparent = !0;
          break;
        default:
          console.warn("THREE.FBXLoader: %s map is not supported in three.js, skipping texture.", c);
          break;
      }
    }), i;
  }
  // get a texture from the textureMap for use by a material.
  getTexture(e, t) {
    return "LayeredTexture" in pe.Objects && t in pe.Objects.LayeredTexture && (console.warn("THREE.FBXLoader: layered textures are not supported in three.js. Discarding all but first layer."), t = Ve.get(t).children[0].ID), e.get(t);
  }
  // Parse nodes in FBXTree.Objects.Deformer
  // Deformer node can contain skinning or Vertex Cache animation data, however only skinning is supported here
  // Generates map of Skeleton-like objects for use later when generating and binding skeletons.
  parseDeformers() {
    const e = {}, t = {};
    if ("Deformer" in pe.Objects) {
      const r = pe.Objects.Deformer;
      for (const i in r) {
        const o = r[i], l = Ve.get(parseInt(i));
        if (o.attrType === "Skin") {
          const c = this.parseSkeleton(l, r);
          c.ID = i, l.parents.length > 1 && console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."), c.geometryID = l.parents[0].ID, e[i] = c;
        } else if (o.attrType === "BlendShape") {
          const c = {
            id: i
          };
          c.rawTargets = this.parseMorphTargets(l, r), c.id = i, l.parents.length > 1 && console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."), t[i] = c;
        }
      }
    }
    return {
      skeletons: e,
      morphTargets: t
    };
  }
  // Parse single nodes in FBXTree.Objects.Deformer
  // The top level skeleton node has type 'Skin' and sub nodes have type 'Cluster'
  // Each skin node represents a skeleton and each cluster node represents a bone
  parseSkeleton(e, t) {
    const r = [];
    return e.children.forEach(function(i) {
      const o = t[i.ID];
      if (o.attrType !== "Cluster")
        return;
      const l = {
        ID: i.ID,
        indices: [],
        weights: [],
        transformLink: new xe().fromArray(o.TransformLink.a)
        // transform: new Matrix4().fromArray( boneNode.Transform.a ),
        // linkMode: boneNode.Mode,
      };
      "Indexes" in o && (l.indices = o.Indexes.a, l.weights = o.Weights.a), r.push(l);
    }), {
      rawBones: r,
      bones: []
    };
  }
  // The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
  parseMorphTargets(e, t) {
    const r = [];
    for (let i = 0; i < e.children.length; i++) {
      const o = e.children[i], l = t[o.ID], c = {
        name: l.attrName,
        initialWeight: l.DeformPercent,
        id: l.id,
        fullWeights: l.FullWeights.a
      };
      if (l.attrType !== "BlendShapeChannel")
        return;
      c.geoID = Ve.get(parseInt(o.ID)).children.filter(function(u) {
        return u.relationship === void 0;
      })[0].ID, r.push(c);
    }
    return r;
  }
  // create the main Group() to be returned by the loader
  parseScene(e, t, r) {
    Mt = new Qt();
    const i = this.parseModels(e.skeletons, t, r), o = pe.Objects.Model, l = this;
    i.forEach(function(u) {
      const f = o[u.ID];
      l.setLookAtProperties(u, f), Ve.get(u.ID).parents.forEach(function(d) {
        const g = i.get(d.ID);
        g !== void 0 && g.add(u);
      }), u.parent === null && Mt.add(u);
    }), this.bindSkeleton(e.skeletons, t, i), this.createAmbientLight(), Mt.traverse(function(u) {
      if (u.userData.transformData) {
        u.parent && (u.userData.transformData.parentMatrix = u.parent.matrix, u.userData.transformData.parentMatrixWorld = u.parent.matrixWorld);
        const f = Bd(u.userData.transformData);
        u.applyMatrix4(f), u.updateWorldMatrix();
      }
    });
    const c = new _b().parse();
    Mt.children.length === 1 && Mt.children[0].isGroup && (Mt.children[0].animations = c, Mt = Mt.children[0]), Mt.animations = c;
  }
  // parse nodes in FBXTree.Objects.Model
  parseModels(e, t, r) {
    const i = /* @__PURE__ */ new Map(), o = pe.Objects.Model;
    for (const l in o) {
      const c = parseInt(l), u = o[l], f = Ve.get(c);
      let p = this.buildSkeleton(f, e, c, u.attrName);
      if (!p) {
        switch (u.attrType) {
          case "Camera":
            p = this.createCamera(f);
            break;
          case "Light":
            p = this.createLight(f);
            break;
          case "Mesh":
            p = this.createMesh(f, t, r);
            break;
          case "NurbsCurve":
            p = this.createCurve(f, t);
            break;
          case "LimbNode":
          case "Root":
            p = new ec();
            break;
          default:
            p = new Qt();
            break;
        }
        p.name = u.attrName ? Es.sanitizeNodeName(u.attrName) : "", p.ID = c;
      }
      this.getTransformData(p, u), i.set(c, p);
    }
    return i;
  }
  buildSkeleton(e, t, r, i) {
    let o = null;
    return e.parents.forEach(function(l) {
      for (const c in t) {
        const u = t[c];
        u.rawBones.forEach(function(f, p) {
          if (f.ID === l.ID) {
            const d = o;
            o = new ec(), o.matrixWorld.copy(f.transformLink), o.name = i ? Es.sanitizeNodeName(i) : "", o.ID = r, u.bones[p] = o, d !== null && o.add(d);
          }
        });
      }
    }), o;
  }
  // create a PerspectiveCamera or OrthographicCamera
  createCamera(e) {
    let t, r;
    if (e.children.forEach(function(i) {
      const o = pe.Objects.NodeAttribute[i.ID];
      o !== void 0 && (r = o);
    }), r === void 0)
      t = new mr();
    else {
      let i = 0;
      r.CameraProjectionType !== void 0 && r.CameraProjectionType.value === 1 && (i = 1);
      let o = 1;
      r.NearPlane !== void 0 && (o = r.NearPlane.value / 1e3);
      let l = 1e3;
      r.FarPlane !== void 0 && (l = r.FarPlane.value / 1e3);
      let c = window.innerWidth, u = window.innerHeight;
      r.AspectWidth !== void 0 && r.AspectHeight !== void 0 && (c = r.AspectWidth.value, u = r.AspectHeight.value);
      const f = c / u;
      let p = 45;
      r.FieldOfView !== void 0 && (p = r.FieldOfView.value);
      const d = r.FocalLength ? r.FocalLength.value : null;
      switch (i) {
        case 0:
          t = new qi(p, f, o, l), d !== null && t.setFocalLength(d);
          break;
        case 1:
          t = new Ln(
            -c / 2,
            c / 2,
            u / 2,
            -u / 2,
            o,
            l
          );
          break;
        default:
          console.warn("THREE.FBXLoader: Unknown camera type " + i + "."), t = new mr();
          break;
      }
    }
    return t;
  }
  // Create a DirectionalLight, PointLight or SpotLight
  createLight(e) {
    let t, r;
    if (e.children.forEach(function(i) {
      const o = pe.Objects.NodeAttribute[i.ID];
      o !== void 0 && (r = o);
    }), r === void 0)
      t = new mr();
    else {
      let i;
      r.LightType === void 0 ? i = 0 : i = r.LightType.value;
      let o = 16777215;
      r.Color !== void 0 && (o = new oe().fromArray(r.Color.value));
      let l = r.Intensity === void 0 ? 1 : r.Intensity.value / 100;
      r.CastLightOnObject !== void 0 && r.CastLightOnObject.value === 0 && (l = 0);
      let c = 0;
      r.FarAttenuationEnd !== void 0 && (r.EnableFarAttenuation !== void 0 && r.EnableFarAttenuation.value === 0 ? c = 0 : c = r.FarAttenuationEnd.value);
      const u = 1;
      switch (i) {
        case 0:
          t = new ql(o, l, c, u);
          break;
        case 1:
          t = new Jo(o, l);
          break;
        case 2:
          let f = Math.PI / 3;
          r.InnerAngle !== void 0 && (f = lt.degToRad(r.InnerAngle.value));
          let p = 0;
          r.OuterAngle !== void 0 && (p = lt.degToRad(r.OuterAngle.value), p = Math.max(p, 1)), t = new ad(o, l, c, f, p, u);
          break;
        default:
          console.warn(
            "THREE.FBXLoader: Unknown light type " + r.LightType.value + ", defaulting to a PointLight."
          ), t = new ql(o, l);
          break;
      }
      r.CastShadows !== void 0 && r.CastShadows.value === 1 && (t.castShadow = !0);
    }
    return t;
  }
  createMesh(e, t, r) {
    let i, o = null, l = null;
    const c = [];
    return e.children.forEach(function(u) {
      t.has(u.ID) && (o = t.get(u.ID)), r.has(u.ID) && c.push(r.get(u.ID));
    }), c.length > 1 ? l = c : c.length > 0 ? l = c[0] : (l = new Ss({ color: 13421772 }), c.push(l)), "color" in o.attributes && c.forEach(function(u) {
      u.vertexColors = !0;
    }), o.FBX_Deformer ? (i = new ud(o, l), i.normalizeSkinWeights()) : i = new Ue(o, l), i;
  }
  createCurve(e, t) {
    const r = e.children.reduce(function(o, l) {
      return t.has(l.ID) && (o = t.get(l.ID)), o;
    }, null), i = new cd({ color: 3342591, linewidth: 1 });
    return new hd(r, i);
  }
  // parse the model node for transform data
  getTransformData(e, t) {
    const r = {};
    "InheritType" in t && (r.inheritType = parseInt(t.InheritType.value)), "RotationOrder" in t ? r.eulerOrder = Ud(t.RotationOrder.value) : r.eulerOrder = "ZYX", "Lcl_Translation" in t && (r.translation = t.Lcl_Translation.value), "PreRotation" in t && (r.preRotation = t.PreRotation.value), "Lcl_Rotation" in t && (r.rotation = t.Lcl_Rotation.value), "PostRotation" in t && (r.postRotation = t.PostRotation.value), "Lcl_Scaling" in t && (r.scale = t.Lcl_Scaling.value), "ScalingOffset" in t && (r.scalingOffset = t.ScalingOffset.value), "ScalingPivot" in t && (r.scalingPivot = t.ScalingPivot.value), "RotationOffset" in t && (r.rotationOffset = t.RotationOffset.value), "RotationPivot" in t && (r.rotationPivot = t.RotationPivot.value), e.userData.transformData = r;
  }
  setLookAtProperties(e, t) {
    "LookAtProperty" in t && Ve.get(e.ID).children.forEach(function(i) {
      if (i.relationship === "LookAtProperty") {
        const o = pe.Objects.Model[i.ID];
        if ("Lcl_Translation" in o) {
          const l = o.Lcl_Translation.value;
          e.target !== void 0 ? (e.target.position.fromArray(l), Mt.add(e.target)) : e.lookAt(new I().fromArray(l));
        }
      }
    });
  }
  bindSkeleton(e, t, r) {
    const i = this.parsePoseNodes();
    for (const o in e) {
      const l = e[o];
      Ve.get(parseInt(l.ID)).parents.forEach(function(u) {
        if (t.has(u.ID)) {
          const f = u.ID;
          Ve.get(f).parents.forEach(function(d) {
            r.has(d.ID) && r.get(d.ID).bind(new fd(l.bones), i[d.ID]);
          });
        }
      });
    }
  }
  parsePoseNodes() {
    const e = {};
    if ("Pose" in pe.Objects) {
      const t = pe.Objects.Pose;
      for (const r in t)
        if (t[r].attrType === "BindPose" && t[r].NbPoseNodes > 0) {
          const i = t[r].PoseNode;
          Array.isArray(i) ? i.forEach(function(o) {
            e[o.Node] = new xe().fromArray(o.Matrix.a);
          }) : e[i.Node] = new xe().fromArray(i.Matrix.a);
        }
    }
    return e;
  }
  // Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
  createAmbientLight() {
    if ("GlobalSettings" in pe && "AmbientColor" in pe.GlobalSettings) {
      const e = pe.GlobalSettings.AmbientColor.value, t = e[0], r = e[1], i = e[2];
      if (t !== 0 || r !== 0 || i !== 0) {
        const o = new oe(t, r, i);
        Mt.add(new gd(o, 1));
      }
    }
  }
}
class gb {
  // Parse nodes in FBXTree.Objects.Geometry
  parse(e) {
    const t = /* @__PURE__ */ new Map();
    if ("Geometry" in pe.Objects) {
      const r = pe.Objects.Geometry;
      for (const i in r) {
        const o = Ve.get(parseInt(i)), l = this.parseGeometry(o, r[i], e);
        t.set(parseInt(i), l);
      }
    }
    return t;
  }
  // Parse single node in FBXTree.Objects.Geometry
  parseGeometry(e, t, r) {
    switch (t.attrType) {
      case "Mesh":
        return this.parseMeshGeometry(e, t, r);
      case "NurbsCurve":
        return this.parseNurbsGeometry(t);
    }
  }
  // Parse single node mesh geometry in FBXTree.Objects.Geometry
  parseMeshGeometry(e, t, r) {
    const i = r.skeletons, o = [], l = e.parents.map(function(d) {
      return pe.Objects.Model[d.ID];
    });
    if (l.length === 0)
      return;
    const c = e.children.reduce(function(d, g) {
      return i[g.ID] !== void 0 && (d = i[g.ID]), d;
    }, null);
    e.children.forEach(function(d) {
      r.morphTargets[d.ID] !== void 0 && o.push(r.morphTargets[d.ID]);
    });
    const u = l[0], f = {};
    "RotationOrder" in u && (f.eulerOrder = Ud(u.RotationOrder.value)), "InheritType" in u && (f.inheritType = parseInt(u.InheritType.value)), "GeometricTranslation" in u && (f.translation = u.GeometricTranslation.value), "GeometricRotation" in u && (f.rotation = u.GeometricRotation.value), "GeometricScaling" in u && (f.scale = u.GeometricScaling.value);
    const p = Bd(f);
    return this.genGeometry(t, c, o, p);
  }
  // Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
  genGeometry(e, t, r, i) {
    const o = new qt();
    e.attrName && (o.name = e.attrName);
    const l = this.parseGeoNode(e, t), c = this.genBuffers(l), u = new fi(c.vertex, 3);
    if (u.applyMatrix4(i), o.setAttribute("position", u), c.colors.length > 0 && o.setAttribute("color", new fi(c.colors, 3)), t && (o.setAttribute("skinIndex", new i1(c.weightsIndices, 4)), o.setAttribute("skinWeight", new fi(c.vertexWeights, 4)), o.FBX_Deformer = t), c.normal.length > 0) {
      const f = new n1().getNormalMatrix(i), p = new fi(c.normal, 3);
      p.applyNormalMatrix(f), o.setAttribute("normal", p);
    }
    if (c.uvs.forEach(function(f, p) {
      vc === "uv2" && p++;
      const d = p === 0 ? "uv" : `uv${p}`;
      o.setAttribute(d, new fi(c.uvs[p], 2));
    }), l.material && l.material.mappingType !== "AllSame") {
      let f = c.materialIndex[0], p = 0;
      if (c.materialIndex.forEach(function(d, g) {
        d !== f && (o.addGroup(p, g - p, f), f = d, p = g);
      }), o.groups.length > 0) {
        const d = o.groups[o.groups.length - 1], g = d.start + d.count;
        g !== c.materialIndex.length && o.addGroup(g, c.materialIndex.length - g, f);
      }
      o.groups.length === 0 && o.addGroup(0, c.materialIndex.length, c.materialIndex[0]);
    }
    return this.addMorphTargets(o, e, r, i), o;
  }
  parseGeoNode(e, t) {
    const r = {};
    if (r.vertexPositions = e.Vertices !== void 0 ? e.Vertices.a : [], r.vertexIndices = e.PolygonVertexIndex !== void 0 ? e.PolygonVertexIndex.a : [], e.LayerElementColor && (r.color = this.parseVertexColors(e.LayerElementColor[0])), e.LayerElementMaterial && (r.material = this.parseMaterialIndices(e.LayerElementMaterial[0])), e.LayerElementNormal && (r.normal = this.parseNormals(e.LayerElementNormal[0])), e.LayerElementUV) {
      r.uv = [];
      let i = 0;
      for (; e.LayerElementUV[i]; )
        e.LayerElementUV[i].UV && r.uv.push(this.parseUVs(e.LayerElementUV[i])), i++;
    }
    return r.weightTable = {}, t !== null && (r.skeleton = t, t.rawBones.forEach(function(i, o) {
      i.indices.forEach(function(l, c) {
        r.weightTable[l] === void 0 && (r.weightTable[l] = []), r.weightTable[l].push({
          id: o,
          weight: i.weights[c]
        });
      });
    })), r;
  }
  genBuffers(e) {
    const t = {
      vertex: [],
      normal: [],
      colors: [],
      uvs: [],
      materialIndex: [],
      vertexWeights: [],
      weightsIndices: []
    };
    let r = 0, i = 0, o = !1, l = [], c = [], u = [], f = [], p = [], d = [];
    const g = this;
    return e.vertexIndices.forEach(function(y, b) {
      let T, x = !1;
      y < 0 && (y = y ^ -1, x = !0);
      let E = [], M = [];
      if (l.push(y * 3, y * 3 + 1, y * 3 + 2), e.color) {
        const A = Oo(b, r, y, e.color);
        u.push(A[0], A[1], A[2]);
      }
      if (e.skeleton) {
        if (e.weightTable[y] !== void 0 && e.weightTable[y].forEach(function(A) {
          M.push(A.weight), E.push(A.id);
        }), M.length > 4) {
          o || (console.warn(
            "THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."
          ), o = !0);
          const A = [0, 0, 0, 0], D = [0, 0, 0, 0];
          M.forEach(function(z, j) {
            let V = z, R = E[j];
            D.forEach(function(G, k, B) {
              if (V > G) {
                B[k] = V, V = G;
                const $ = A[k];
                A[k] = R, R = $;
              }
            });
          }), E = A, M = D;
        }
        for (; M.length < 4; )
          M.push(0), E.push(0);
        for (let A = 0; A < 4; ++A)
          p.push(M[A]), d.push(E[A]);
      }
      if (e.normal) {
        const A = Oo(b, r, y, e.normal);
        c.push(A[0], A[1], A[2]);
      }
      e.material && e.material.mappingType !== "AllSame" && (T = Oo(b, r, y, e.material)[0]), e.uv && e.uv.forEach(function(A, D) {
        const z = Oo(b, r, y, A);
        f[D] === void 0 && (f[D] = []), f[D].push(z[0]), f[D].push(z[1]);
      }), i++, x && (g.genFace(
        t,
        e,
        l,
        T,
        c,
        u,
        f,
        p,
        d,
        i
      ), r++, i = 0, l = [], c = [], u = [], f = [], p = [], d = []);
    }), t;
  }
  // Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
  genFace(e, t, r, i, o, l, c, u, f, p) {
    for (let d = 2; d < p; d++)
      e.vertex.push(t.vertexPositions[r[0]]), e.vertex.push(t.vertexPositions[r[1]]), e.vertex.push(t.vertexPositions[r[2]]), e.vertex.push(t.vertexPositions[r[(d - 1) * 3]]), e.vertex.push(t.vertexPositions[r[(d - 1) * 3 + 1]]), e.vertex.push(t.vertexPositions[r[(d - 1) * 3 + 2]]), e.vertex.push(t.vertexPositions[r[d * 3]]), e.vertex.push(t.vertexPositions[r[d * 3 + 1]]), e.vertex.push(t.vertexPositions[r[d * 3 + 2]]), t.skeleton && (e.vertexWeights.push(u[0]), e.vertexWeights.push(u[1]), e.vertexWeights.push(u[2]), e.vertexWeights.push(u[3]), e.vertexWeights.push(u[(d - 1) * 4]), e.vertexWeights.push(u[(d - 1) * 4 + 1]), e.vertexWeights.push(u[(d - 1) * 4 + 2]), e.vertexWeights.push(u[(d - 1) * 4 + 3]), e.vertexWeights.push(u[d * 4]), e.vertexWeights.push(u[d * 4 + 1]), e.vertexWeights.push(u[d * 4 + 2]), e.vertexWeights.push(u[d * 4 + 3]), e.weightsIndices.push(f[0]), e.weightsIndices.push(f[1]), e.weightsIndices.push(f[2]), e.weightsIndices.push(f[3]), e.weightsIndices.push(f[(d - 1) * 4]), e.weightsIndices.push(f[(d - 1) * 4 + 1]), e.weightsIndices.push(f[(d - 1) * 4 + 2]), e.weightsIndices.push(f[(d - 1) * 4 + 3]), e.weightsIndices.push(f[d * 4]), e.weightsIndices.push(f[d * 4 + 1]), e.weightsIndices.push(f[d * 4 + 2]), e.weightsIndices.push(f[d * 4 + 3])), t.color && (e.colors.push(l[0]), e.colors.push(l[1]), e.colors.push(l[2]), e.colors.push(l[(d - 1) * 3]), e.colors.push(l[(d - 1) * 3 + 1]), e.colors.push(l[(d - 1) * 3 + 2]), e.colors.push(l[d * 3]), e.colors.push(l[d * 3 + 1]), e.colors.push(l[d * 3 + 2])), t.material && t.material.mappingType !== "AllSame" && (e.materialIndex.push(i), e.materialIndex.push(i), e.materialIndex.push(i)), t.normal && (e.normal.push(o[0]), e.normal.push(o[1]), e.normal.push(o[2]), e.normal.push(o[(d - 1) * 3]), e.normal.push(o[(d - 1) * 3 + 1]), e.normal.push(o[(d - 1) * 3 + 2]), e.normal.push(o[d * 3]), e.normal.push(o[d * 3 + 1]), e.normal.push(o[d * 3 + 2])), t.uv && t.uv.forEach(function(g, y) {
        e.uvs[y] === void 0 && (e.uvs[y] = []), e.uvs[y].push(c[y][0]), e.uvs[y].push(c[y][1]), e.uvs[y].push(c[y][(d - 1) * 2]), e.uvs[y].push(c[y][(d - 1) * 2 + 1]), e.uvs[y].push(c[y][d * 2]), e.uvs[y].push(c[y][d * 2 + 1]);
      });
  }
  addMorphTargets(e, t, r, i) {
    if (r.length === 0)
      return;
    e.morphTargetsRelative = !0, e.morphAttributes.position = [];
    const o = this;
    r.forEach(function(l) {
      l.rawTargets.forEach(function(c) {
        const u = pe.Objects.Geometry[c.geoID];
        u !== void 0 && o.genMorphGeometry(e, t, u, i, c.name);
      });
    });
  }
  // a morph geometry node is similar to a standard  node, and the node is also contained
  // in FBXTree.Objects.Geometry, however it can only have attributes for position, normal
  // and a special attribute Index defining which vertices of the original geometry are affected
  // Normal and position attributes only have data for the vertices that are affected by the morph
  genMorphGeometry(e, t, r, i, o) {
    const l = t.PolygonVertexIndex !== void 0 ? t.PolygonVertexIndex.a : [], c = r.Vertices !== void 0 ? r.Vertices.a : [], u = r.Indexes !== void 0 ? r.Indexes.a : [], f = e.attributes.position.count * 3, p = new Float32Array(f);
    for (let b = 0; b < u.length; b++) {
      const T = u[b] * 3;
      p[T] = c[b * 3], p[T + 1] = c[b * 3 + 1], p[T + 2] = c[b * 3 + 2];
    }
    const d = {
      vertexIndices: l,
      vertexPositions: p
    }, g = this.genBuffers(d), y = new fi(g.vertex, 3);
    y.name = o || r.attrName, y.applyMatrix4(i), e.morphAttributes.position.push(y);
  }
  // Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
  parseNormals(e) {
    const t = e.MappingInformationType, r = e.ReferenceInformationType, i = e.Normals.a;
    let o = [];
    return r === "IndexToDirect" && ("NormalIndex" in e ? o = e.NormalIndex.a : "NormalsIndex" in e && (o = e.NormalsIndex.a)), {
      dataSize: 3,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: r
    };
  }
  // Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
  parseUVs(e) {
    const t = e.MappingInformationType, r = e.ReferenceInformationType, i = e.UV.a;
    let o = [];
    return r === "IndexToDirect" && (o = e.UVIndex.a), {
      dataSize: 2,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: r
    };
  }
  // Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
  parseVertexColors(e) {
    const t = e.MappingInformationType, r = e.ReferenceInformationType, i = e.Colors.a;
    let o = [];
    return r === "IndexToDirect" && (o = e.ColorIndex.a), {
      dataSize: 4,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: r
    };
  }
  // Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
  parseMaterialIndices(e) {
    const t = e.MappingInformationType, r = e.ReferenceInformationType;
    if (t === "NoMappingInformation")
      return {
        dataSize: 1,
        buffer: [0],
        indices: [0],
        mappingType: "AllSame",
        referenceType: r
      };
    const i = e.Materials.a, o = [];
    for (let l = 0; l < i.length; ++l)
      o.push(l);
    return {
      dataSize: 1,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: r
    };
  }
  // Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
  parseNurbsGeometry(e) {
    if (vf === void 0)
      return console.error(
        "THREE.FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry."
      ), new qt();
    const t = parseInt(e.Order);
    if (isNaN(t))
      return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s", e.Order, e.id), new qt();
    const r = t - 1, i = e.KnotVector.a, o = [], l = e.Points.a;
    for (let d = 0, g = l.length; d < g; d += 4)
      o.push(new gr().fromArray(l, d));
    let c, u;
    if (e.Form === "Closed")
      o.push(o[0]);
    else if (e.Form === "Periodic") {
      c = r, u = i.length - 1 - c;
      for (let d = 0; d < r; ++d)
        o.push(o[d]);
    }
    const p = new vf(r, i, o, c, u).getPoints(o.length * 12);
    return new qt().setFromPoints(p);
  }
}
class _b {
  // take raw animation clips and turn them into three.js animation clips
  parse() {
    const e = [], t = this.parseClips();
    if (t !== void 0)
      for (const r in t) {
        const i = t[r], o = this.addClip(i);
        e.push(o);
      }
    return e;
  }
  parseClips() {
    if (pe.Objects.AnimationCurve === void 0)
      return;
    const e = this.parseAnimationCurveNodes();
    this.parseAnimationCurves(e);
    const t = this.parseAnimationLayers(e);
    return this.parseAnimStacks(t);
  }
  // parse nodes in FBXTree.Objects.AnimationCurveNode
  // each AnimationCurveNode holds data for an animation transform for a model (e.g. left arm rotation )
  // and is referenced by an AnimationLayer
  parseAnimationCurveNodes() {
    const e = pe.Objects.AnimationCurveNode, t = /* @__PURE__ */ new Map();
    for (const r in e) {
      const i = e[r];
      if (i.attrName.match(/S|R|T|DeformPercent/) !== null) {
        const o = {
          id: i.id,
          attr: i.attrName,
          curves: {}
        };
        t.set(o.id, o);
      }
    }
    return t;
  }
  // parse nodes in FBXTree.Objects.AnimationCurve and connect them up to
  // previously parsed AnimationCurveNodes. Each AnimationCurve holds data for a single animated
  // axis ( e.g. times and values of x rotation)
  parseAnimationCurves(e) {
    const t = pe.Objects.AnimationCurve;
    for (const r in t) {
      const i = {
        id: t[r].id,
        times: t[r].KeyTime.a.map(bb),
        values: t[r].KeyValueFloat.a
      }, o = Ve.get(i.id);
      if (o !== void 0) {
        const l = o.parents[0].ID, c = o.parents[0].relationship;
        c.match(/X/) ? e.get(l).curves.x = i : c.match(/Y/) ? e.get(l).curves.y = i : c.match(/Z/) ? e.get(l).curves.z = i : c.match(/d|DeformPercent/) && e.has(l) && (e.get(l).curves.morph = i);
      }
    }
  }
  // parse nodes in FBXTree.Objects.AnimationLayer. Each layers holds references
  // to various AnimationCurveNodes and is referenced by an AnimationStack node
  // note: theoretically a stack can have multiple layers, however in practice there always seems to be one per stack
  parseAnimationLayers(e) {
    const t = pe.Objects.AnimationLayer, r = /* @__PURE__ */ new Map();
    for (const i in t) {
      const o = [], l = Ve.get(parseInt(i));
      l !== void 0 && (l.children.forEach(function(u, f) {
        if (e.has(u.ID)) {
          const p = e.get(u.ID);
          if (p.curves.x !== void 0 || p.curves.y !== void 0 || p.curves.z !== void 0) {
            if (o[f] === void 0) {
              const d = Ve.get(u.ID).parents.filter(function(g) {
                return g.relationship !== void 0;
              })[0].ID;
              if (d !== void 0) {
                const g = pe.Objects.Model[d.toString()];
                if (g === void 0) {
                  console.warn("THREE.FBXLoader: Encountered a unused curve.", u);
                  return;
                }
                const y = {
                  modelName: g.attrName ? Es.sanitizeNodeName(g.attrName) : "",
                  ID: g.id,
                  initialPosition: [0, 0, 0],
                  initialRotation: [0, 0, 0],
                  initialScale: [1, 1, 1]
                };
                Mt.traverse(function(b) {
                  b.ID === g.id && (y.transform = b.matrix, b.userData.transformData && (y.eulerOrder = b.userData.transformData.eulerOrder));
                }), y.transform || (y.transform = new xe()), "PreRotation" in g && (y.preRotation = g.PreRotation.value), "PostRotation" in g && (y.postRotation = g.PostRotation.value), o[f] = y;
              }
            }
            o[f] && (o[f][p.attr] = p);
          } else if (p.curves.morph !== void 0) {
            if (o[f] === void 0) {
              const d = Ve.get(u.ID).parents.filter(function(E) {
                return E.relationship !== void 0;
              })[0].ID, g = Ve.get(d).parents[0].ID, y = Ve.get(g).parents[0].ID, b = Ve.get(y).parents[0].ID, T = pe.Objects.Model[b], x = {
                modelName: T.attrName ? Es.sanitizeNodeName(T.attrName) : "",
                morphName: pe.Objects.Deformer[d].attrName
              };
              o[f] = x;
            }
            o[f][p.attr] = p;
          }
        }
      }), r.set(parseInt(i), o));
    }
    return r;
  }
  // parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
  // hierarchy. Each Stack node will be used to create a AnimationClip
  parseAnimStacks(e) {
    const t = pe.Objects.AnimationStack, r = {};
    for (const i in t) {
      const o = Ve.get(parseInt(i)).children;
      o.length > 1 && console.warn(
        "THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers."
      );
      const l = e.get(o[0].ID);
      r[i] = {
        name: t[i].attrName,
        layer: l
      };
    }
    return r;
  }
  addClip(e) {
    let t = [];
    const r = this;
    return e.layer.forEach(function(i) {
      t = t.concat(r.generateTracks(i));
    }), new dd(e.name, -1, t);
  }
  generateTracks(e) {
    const t = [];
    let r = new I(), i = new pr(), o = new I();
    if (e.transform && e.transform.decompose(r, i, o), r = r.toArray(), i = new ms().setFromQuaternion(i, e.eulerOrder).toArray(), o = o.toArray(), e.T !== void 0 && Object.keys(e.T.curves).length > 0) {
      const l = this.generateVectorTrack(
        e.modelName,
        e.T.curves,
        r,
        "position"
      );
      l !== void 0 && t.push(l);
    }
    if (e.R !== void 0 && Object.keys(e.R.curves).length > 0) {
      const l = this.generateRotationTrack(
        e.modelName,
        e.R.curves,
        i,
        e.preRotation,
        e.postRotation,
        e.eulerOrder
      );
      l !== void 0 && t.push(l);
    }
    if (e.S !== void 0 && Object.keys(e.S.curves).length > 0) {
      const l = this.generateVectorTrack(e.modelName, e.S.curves, o, "scale");
      l !== void 0 && t.push(l);
    }
    if (e.DeformPercent !== void 0) {
      const l = this.generateMorphTrack(e);
      l !== void 0 && t.push(l);
    }
    return t;
  }
  generateVectorTrack(e, t, r, i) {
    const o = this.getTimesForAllAxes(t), l = this.getKeyframeTrackValues(o, t, r);
    return new tc(e + "." + i, o, l);
  }
  generateRotationTrack(e, t, r, i, o, l) {
    t.x !== void 0 && (this.interpolateRotations(t.x), t.x.values = t.x.values.map(lt.degToRad)), t.y !== void 0 && (this.interpolateRotations(t.y), t.y.values = t.y.values.map(lt.degToRad)), t.z !== void 0 && (this.interpolateRotations(t.z), t.z.values = t.z.values.map(lt.degToRad));
    const c = this.getTimesForAllAxes(t), u = this.getKeyframeTrackValues(c, t, r);
    i !== void 0 && (i = i.map(lt.degToRad), i.push(l), i = new ms().fromArray(i), i = new pr().setFromEuler(i)), o !== void 0 && (o = o.map(lt.degToRad), o.push(l), o = new ms().fromArray(o), o = new pr().setFromEuler(o).invert());
    const f = new pr(), p = new ms(), d = [];
    for (let g = 0; g < u.length; g += 3)
      p.set(u[g], u[g + 1], u[g + 2], l), f.setFromEuler(p), i !== void 0 && f.premultiply(i), o !== void 0 && f.multiply(o), f.toArray(d, g / 3 * 4);
    return new ic(e + ".quaternion", c, d);
  }
  generateMorphTrack(e) {
    const t = e.DeformPercent.curves.morph, r = t.values.map(function(o) {
      return o / 100;
    }), i = Mt.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];
    return new rc(
      e.modelName + ".morphTargetInfluences[" + i + "]",
      t.times,
      r
    );
  }
  // For all animated objects, times are defined separately for each axis
  // Here we'll combine the times into one sorted array without duplicates
  getTimesForAllAxes(e) {
    let t = [];
    if (e.x !== void 0 && (t = t.concat(e.x.times)), e.y !== void 0 && (t = t.concat(e.y.times)), e.z !== void 0 && (t = t.concat(e.z.times)), t = t.sort(function(r, i) {
      return r - i;
    }), t.length > 1) {
      let r = 1, i = t[0];
      for (let o = 1; o < t.length; o++) {
        const l = t[o];
        l !== i && (t[r] = l, i = l, r++);
      }
      t = t.slice(0, r);
    }
    return t;
  }
  getKeyframeTrackValues(e, t, r) {
    const i = r, o = [];
    let l = -1, c = -1, u = -1;
    return e.forEach(function(f) {
      if (t.x && (l = t.x.times.indexOf(f)), t.y && (c = t.y.times.indexOf(f)), t.z && (u = t.z.times.indexOf(f)), l !== -1) {
        const p = t.x.values[l];
        o.push(p), i[0] = p;
      } else
        o.push(i[0]);
      if (c !== -1) {
        const p = t.y.values[c];
        o.push(p), i[1] = p;
      } else
        o.push(i[1]);
      if (u !== -1) {
        const p = t.z.values[u];
        o.push(p), i[2] = p;
      } else
        o.push(i[2]);
    }), o;
  }
  // Rotations are defined as Euler angles which can have values  of any size
  // These will be converted to quaternions which don't support values greater than
  // PI, so we'll interpolate large rotations
  interpolateRotations(e) {
    for (let t = 1; t < e.values.length; t++) {
      const r = e.values[t - 1], i = e.values[t] - r, o = Math.abs(i);
      if (o >= 180) {
        const l = o / 180, c = i / l;
        let u = r + c;
        const f = e.times[t - 1], d = (e.times[t] - f) / l;
        let g = f + d;
        const y = [], b = [];
        for (; g < e.times[t]; )
          y.push(g), g += d, b.push(u), u += c;
        e.times = bf(e.times, t, y), e.values = bf(e.values, t, b);
      }
    }
  }
}
class yb {
  getPrevNode() {
    return this.nodeStack[this.currentIndent - 2];
  }
  getCurrentNode() {
    return this.nodeStack[this.currentIndent - 1];
  }
  getCurrentProp() {
    return this.currentProp;
  }
  pushStack(e) {
    this.nodeStack.push(e), this.currentIndent += 1;
  }
  popStack() {
    this.nodeStack.pop(), this.currentIndent -= 1;
  }
  setCurrentProp(e, t) {
    this.currentProp = e, this.currentPropName = t;
  }
  parse(e) {
    this.currentIndent = 0, this.allNodes = new Rd(), this.nodeStack = [], this.currentProp = [], this.currentPropName = "";
    const t = this, r = e.split(/[\r\n]+/);
    return r.forEach(function(i, o) {
      const l = i.match(/^[\s\t]*;/), c = i.match(/^[\s\t]*$/);
      if (l || c)
        return;
      const u = i.match("^\\t{" + t.currentIndent + "}(\\w+):(.*){", ""), f = i.match("^\\t{" + t.currentIndent + "}(\\w+):[\\s\\t\\r\\n](.*)"), p = i.match("^\\t{" + (t.currentIndent - 1) + "}}");
      u ? t.parseNodeBegin(i, u) : f ? t.parseNodeProperty(i, f, r[++o]) : p ? t.popStack() : i.match(/^[^\s\t}]/) && t.parseNodePropertyContinued(i);
    }), this.allNodes;
  }
  parseNodeBegin(e, t) {
    const r = t[1].trim().replace(/^"/, "").replace(/"$/, ""), i = t[2].split(",").map(function(u) {
      return u.trim().replace(/^"/, "").replace(/"$/, "");
    }), o = { name: r }, l = this.parseNodeAttr(i), c = this.getCurrentNode();
    this.currentIndent === 0 ? this.allNodes.add(r, o) : r in c ? (r === "PoseNode" ? c.PoseNode.push(o) : c[r].id !== void 0 && (c[r] = {}, c[r][c[r].id] = c[r]), l.id !== "" && (c[r][l.id] = o)) : typeof l.id == "number" ? (c[r] = {}, c[r][l.id] = o) : r !== "Properties70" && (r === "PoseNode" ? c[r] = [o] : c[r] = o), typeof l.id == "number" && (o.id = l.id), l.name !== "" && (o.attrName = l.name), l.type !== "" && (o.attrType = l.type), this.pushStack(o);
  }
  parseNodeAttr(e) {
    let t = e[0];
    e[0] !== "" && (t = parseInt(e[0]), isNaN(t) && (t = e[0]));
    let r = "", i = "";
    return e.length > 1 && (r = e[1].replace(/^(\w+)::/, ""), i = e[2]), { id: t, name: r, type: i };
  }
  parseNodeProperty(e, t, r) {
    let i = t[1].replace(/^"/, "").replace(/"$/, "").trim(), o = t[2].replace(/^"/, "").replace(/"$/, "").trim();
    i === "Content" && o === "," && (o = r.replace(/"/g, "").replace(/,$/, "").trim());
    const l = this.getCurrentNode();
    if (l.name === "Properties70") {
      this.parseNodeSpecialProperty(e, i, o);
      return;
    }
    if (i === "C") {
      const u = o.split(",").slice(1), f = parseInt(u[0]), p = parseInt(u[1]);
      let d = o.split(",").slice(3);
      d = d.map(function(g) {
        return g.trim().replace(/^"/, "");
      }), i = "connections", o = [f, p], Sb(o, d), l[i] === void 0 && (l[i] = []);
    }
    i === "Node" && (l.id = o), i in l && Array.isArray(l[i]) ? l[i].push(o) : i !== "a" ? l[i] = o : l.a = o, this.setCurrentProp(l, i), i === "a" && o.slice(-1) !== "," && (l.a = Il(o));
  }
  parseNodePropertyContinued(e) {
    const t = this.getCurrentNode();
    t.a += e, e.slice(-1) !== "," && (t.a = Il(t.a));
  }
  // parse "Property70"
  parseNodeSpecialProperty(e, t, r) {
    const i = r.split('",').map(function(p) {
      return p.trim().replace(/^\"/, "").replace(/\s/, "_");
    }), o = i[0], l = i[1], c = i[2], u = i[3];
    let f = i[4];
    switch (l) {
      case "int":
      case "enum":
      case "bool":
      case "ULongLong":
      case "double":
      case "Number":
      case "FieldOfView":
        f = parseFloat(f);
        break;
      case "Color":
      case "ColorRGB":
      case "Vector3D":
      case "Lcl_Translation":
      case "Lcl_Rotation":
      case "Lcl_Scaling":
        f = Il(f);
        break;
    }
    this.getPrevNode()[o] = {
      type: l,
      type2: c,
      flag: u,
      value: f
    }, this.setCurrentProp(this.getPrevNode(), o);
  }
}
class vb {
  parse(e) {
    const t = new wf(e);
    t.skip(23);
    const r = t.getUint32();
    if (r < 6400)
      throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + r);
    const i = new Rd();
    for (; !this.endOfContent(t); ) {
      const o = this.parseNode(t, r);
      o !== null && i.add(o.name, o);
    }
    return i;
  }
  // Check if reader has reached the end of content.
  endOfContent(e) {
    return e.size() % 16 === 0 ? (e.getOffset() + 160 + 16 & -16) >= e.size() : e.getOffset() + 160 + 16 >= e.size();
  }
  // recursively parse nodes until the end of the file is reached
  parseNode(e, t) {
    const r = {}, i = t >= 7500 ? e.getUint64() : e.getUint32(), o = t >= 7500 ? e.getUint64() : e.getUint32();
    t >= 7500 ? e.getUint64() : e.getUint32();
    const l = e.getUint8(), c = e.getString(l);
    if (i === 0)
      return null;
    const u = [];
    for (let g = 0; g < o; g++)
      u.push(this.parseProperty(e));
    const f = u.length > 0 ? u[0] : "", p = u.length > 1 ? u[1] : "", d = u.length > 2 ? u[2] : "";
    for (r.singleProperty = o === 1 && e.getOffset() === i; i > e.getOffset(); ) {
      const g = this.parseNode(e, t);
      g !== null && this.parseSubNode(c, r, g);
    }
    return r.propertyList = u, typeof f == "number" && (r.id = f), p !== "" && (r.attrName = p), d !== "" && (r.attrType = d), c !== "" && (r.name = c), r;
  }
  parseSubNode(e, t, r) {
    if (r.singleProperty === !0) {
      const i = r.propertyList[0];
      Array.isArray(i) ? (t[r.name] = r, r.a = i) : t[r.name] = i;
    } else if (e === "Connections" && r.name === "C") {
      const i = [];
      r.propertyList.forEach(function(o, l) {
        l !== 0 && i.push(o);
      }), t.connections === void 0 && (t.connections = []), t.connections.push(i);
    } else if (r.name === "Properties70")
      Object.keys(r).forEach(function(o) {
        t[o] = r[o];
      });
    else if (e === "Properties70" && r.name === "P") {
      let i = r.propertyList[0], o = r.propertyList[1];
      const l = r.propertyList[2], c = r.propertyList[3];
      let u;
      i.indexOf("Lcl ") === 0 && (i = i.replace("Lcl ", "Lcl_")), o.indexOf("Lcl ") === 0 && (o = o.replace("Lcl ", "Lcl_")), o === "Color" || o === "ColorRGB" || o === "Vector" || o === "Vector3D" || o.indexOf("Lcl_") === 0 ? u = [r.propertyList[4], r.propertyList[5], r.propertyList[6]] : u = r.propertyList[4], t[i] = {
        type: o,
        type2: l,
        flag: c,
        value: u
      };
    } else t[r.name] === void 0 ? typeof r.id == "number" ? (t[r.name] = {}, t[r.name][r.id] = r) : t[r.name] = r : r.name === "PoseNode" ? (Array.isArray(t[r.name]) || (t[r.name] = [t[r.name]]), t[r.name].push(r)) : t[r.name][r.id] === void 0 && (t[r.name][r.id] = r);
  }
  parseProperty(e) {
    const t = e.getString(1);
    let r;
    switch (t) {
      case "C":
        return e.getBoolean();
      case "D":
        return e.getFloat64();
      case "F":
        return e.getFloat32();
      case "I":
        return e.getInt32();
      case "L":
        return e.getInt64();
      case "R":
        return r = e.getUint32(), e.getArrayBuffer(r);
      case "S":
        return r = e.getUint32(), e.getString(r);
      case "Y":
        return e.getInt16();
      case "b":
      case "c":
      case "d":
      case "f":
      case "i":
      case "l":
        const i = e.getUint32(), o = e.getUint32(), l = e.getUint32();
        if (o === 0)
          switch (t) {
            case "b":
            case "c":
              return e.getBooleanArray(i);
            case "d":
              return e.getFloat64Array(i);
            case "f":
              return e.getFloat32Array(i);
            case "i":
              return e.getInt32Array(i);
            case "l":
              return e.getInt64Array(i);
          }
        const c = Z1(new Uint8Array(e.getArrayBuffer(l))), u = new wf(c.buffer);
        switch (t) {
          case "b":
          case "c":
            return u.getBooleanArray(i);
          case "d":
            return u.getFloat64Array(i);
          case "f":
            return u.getFloat32Array(i);
          case "i":
            return u.getInt32Array(i);
          case "l":
            return u.getInt64Array(i);
        }
      default:
        throw new Error("THREE.FBXLoader: Unknown property type " + t);
    }
  }
}
class wf {
  constructor(e, t) {
    this.dv = new DataView(e), this.offset = 0, this.littleEndian = t !== void 0 ? t : !0;
  }
  getOffset() {
    return this.offset;
  }
  size() {
    return this.dv.buffer.byteLength;
  }
  skip(e) {
    this.offset += e;
  }
  // seems like true/false representation depends on exporter.
  // true: 1 or 'Y'(=0x59), false: 0 or 'T'(=0x54)
  // then sees LSB.
  getBoolean() {
    return (this.getUint8() & 1) === 1;
  }
  getBooleanArray(e) {
    const t = [];
    for (let r = 0; r < e; r++)
      t.push(this.getBoolean());
    return t;
  }
  getUint8() {
    const e = this.dv.getUint8(this.offset);
    return this.offset += 1, e;
  }
  getInt16() {
    const e = this.dv.getInt16(this.offset, this.littleEndian);
    return this.offset += 2, e;
  }
  getInt32() {
    const e = this.dv.getInt32(this.offset, this.littleEndian);
    return this.offset += 4, e;
  }
  getInt32Array(e) {
    const t = [];
    for (let r = 0; r < e; r++)
      t.push(this.getInt32());
    return t;
  }
  getUint32() {
    const e = this.dv.getUint32(this.offset, this.littleEndian);
    return this.offset += 4, e;
  }
  // JavaScript doesn't support 64-bit integer so calculate this here
  // 1 << 32 will return 1 so using multiply operation instead here.
  // There's a possibility that this method returns wrong value if the value
  // is out of the range between Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER.
  // TODO: safely handle 64-bit integer
  getInt64() {
    let e, t;
    return this.littleEndian ? (e = this.getUint32(), t = this.getUint32()) : (t = this.getUint32(), e = this.getUint32()), t & 2147483648 ? (t = ~t & 4294967295, e = ~e & 4294967295, e === 4294967295 && (t = t + 1 & 4294967295), e = e + 1 & 4294967295, -(t * 4294967296 + e)) : t * 4294967296 + e;
  }
  getInt64Array(e) {
    const t = [];
    for (let r = 0; r < e; r++)
      t.push(this.getInt64());
    return t;
  }
  // Note: see getInt64() comment
  getUint64() {
    let e, t;
    return this.littleEndian ? (e = this.getUint32(), t = this.getUint32()) : (t = this.getUint32(), e = this.getUint32()), t * 4294967296 + e;
  }
  getFloat32() {
    const e = this.dv.getFloat32(this.offset, this.littleEndian);
    return this.offset += 4, e;
  }
  getFloat32Array(e) {
    const t = [];
    for (let r = 0; r < e; r++)
      t.push(this.getFloat32());
    return t;
  }
  getFloat64() {
    const e = this.dv.getFloat64(this.offset, this.littleEndian);
    return this.offset += 8, e;
  }
  getFloat64Array(e) {
    const t = [];
    for (let r = 0; r < e; r++)
      t.push(this.getFloat64());
    return t;
  }
  getArrayBuffer(e) {
    const t = this.dv.buffer.slice(this.offset, this.offset + e);
    return this.offset += e, t;
  }
  getString(e) {
    let t = [];
    for (let i = 0; i < e; i++)
      t[i] = this.getUint8();
    const r = t.indexOf(0);
    return r >= 0 && (t = t.slice(0, r)), Bn(new Uint8Array(t));
  }
}
class Rd {
  add(e, t) {
    this[e] = t;
  }
}
function wb(s) {
  const e = "Kaydara FBX Binary  \0";
  return s.byteLength >= e.length && e === kd(s, 0, e.length);
}
function xb(s) {
  const e = [
    "K",
    "a",
    "y",
    "d",
    "a",
    "r",
    "a",
    "\\",
    "F",
    "B",
    "X",
    "\\",
    "B",
    "i",
    "n",
    "a",
    "r",
    "y",
    "\\",
    "\\"
  ];
  let t = 0;
  function r(i) {
    const o = s[i - 1];
    return s = s.slice(t + i), t++, o;
  }
  for (let i = 0; i < e.length; ++i)
    if (r(1) === e[i])
      return !1;
  return !0;
}
function xf(s) {
  const e = /FBXVersion: (\d+)/, t = s.match(e);
  if (t)
    return parseInt(t[1]);
  throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.");
}
function bb(s) {
  return s / 46186158e3;
}
const Tb = [];
function Oo(s, e, t, r) {
  let i;
  switch (r.mappingType) {
    case "ByPolygonVertex":
      i = s;
      break;
    case "ByPolygon":
      i = e;
      break;
    case "ByVertice":
      i = t;
      break;
    case "AllSame":
      i = r.indices[0];
      break;
    default:
      console.warn("THREE.FBXLoader: unknown attribute mapping type " + r.mappingType);
  }
  r.referenceType === "IndexToDirect" && (i = r.indices[i]);
  const o = i * r.dataSize, l = o + r.dataSize;
  return Mb(Tb, r.buffer, o, l);
}
const Dl = /* @__PURE__ */ new ms(), Tn = /* @__PURE__ */ new I();
function Bd(s) {
  const e = new xe(), t = new xe(), r = new xe(), i = new xe(), o = new xe(), l = new xe(), c = new xe(), u = new xe(), f = new xe(), p = new xe(), d = new xe(), g = new xe(), y = s.inheritType ? s.inheritType : 0;
  if (s.translation && e.setPosition(Tn.fromArray(s.translation)), s.preRotation) {
    const k = s.preRotation.map(lt.degToRad);
    k.push(s.eulerOrder), t.makeRotationFromEuler(Dl.fromArray(k));
  }
  if (s.rotation) {
    const k = s.rotation.map(lt.degToRad);
    k.push(s.eulerOrder), r.makeRotationFromEuler(Dl.fromArray(k));
  }
  if (s.postRotation) {
    const k = s.postRotation.map(lt.degToRad);
    k.push(s.eulerOrder), i.makeRotationFromEuler(Dl.fromArray(k)), i.invert();
  }
  s.scale && o.scale(Tn.fromArray(s.scale)), s.scalingOffset && c.setPosition(Tn.fromArray(s.scalingOffset)), s.scalingPivot && l.setPosition(Tn.fromArray(s.scalingPivot)), s.rotationOffset && u.setPosition(Tn.fromArray(s.rotationOffset)), s.rotationPivot && f.setPosition(Tn.fromArray(s.rotationPivot)), s.parentMatrixWorld && (d.copy(s.parentMatrix), p.copy(s.parentMatrixWorld));
  const b = t.clone().multiply(r).multiply(i), T = new xe();
  T.extractRotation(p);
  const x = new xe();
  x.copyPosition(p);
  const E = x.clone().invert().multiply(p), M = T.clone().invert().multiply(E), A = o, D = new xe();
  if (y === 0)
    D.copy(T).multiply(b).multiply(M).multiply(A);
  else if (y === 1)
    D.copy(T).multiply(M).multiply(b).multiply(A);
  else {
    const B = new xe().scale(new I().setFromMatrixScale(d)).clone().invert(), $ = M.clone().multiply(B);
    D.copy(T).multiply(b).multiply($).multiply(A);
  }
  const z = f.clone().invert(), j = l.clone().invert();
  let V = e.clone().multiply(u).multiply(f).multiply(t).multiply(r).multiply(i).multiply(z).multiply(c).multiply(l).multiply(o).multiply(j);
  const R = new xe().copyPosition(V), G = p.clone().multiply(R);
  return g.copyPosition(G), V = g.clone().multiply(D), V.premultiply(p.invert()), V;
}
function Ud(s) {
  s = s || 0;
  const e = [
    "ZYX",
    // -> XYZ extrinsic
    "YZX",
    // -> XZY extrinsic
    "XZY",
    // -> YZX extrinsic
    "ZXY",
    // -> YXZ extrinsic
    "YXZ",
    // -> ZXY extrinsic
    "XYZ"
    // -> ZYX extrinsic
    //'SphericXYZ', // not possible to support
  ];
  return s === 6 ? (console.warn("THREE.FBXLoader: unsupported Euler Order: Spherical XYZ. Animations and rotations may be incorrect."), e[0]) : e[s];
}
function Il(s) {
  return s.split(",").map(function(t) {
    return parseFloat(t);
  });
}
function kd(s, e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = s.byteLength), Bn(new Uint8Array(s, e, t));
}
function Sb(s, e) {
  for (let t = 0, r = s.length, i = e.length; t < i; t++, r++)
    s[r] = e[t];
}
function Mb(s, e, t, r) {
  for (let i = t, o = 0; i < r; i++, o++)
    s[o] = e[i];
  return s;
}
function bf(s, e, t) {
  return s.slice(0, e).concat(t).concat(s.slice(e));
}
class Ab extends s1 {
  constructor(e) {
    super(e), this.type = Xi;
  }
  // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
  parse(e) {
    const l = function(R, G) {
      switch (R) {
        case 1:
          throw new Error("THREE.RGBELoader: Read Error: " + (G || ""));
        case 2:
          throw new Error("THREE.RGBELoader: Write Error: " + (G || ""));
        case 3:
          throw new Error("THREE.RGBELoader: Bad File Format: " + (G || ""));
        default:
        case 4:
          throw new Error("THREE.RGBELoader: Memory Error: " + (G || ""));
      }
    }, d = function(R, G, k) {
      G = G || 1024;
      let $ = R.pos, K = -1, Y = 0, ee = "", Q = String.fromCharCode.apply(null, new Uint16Array(R.subarray($, $ + 128)));
      for (; 0 > (K = Q.indexOf(`
`)) && Y < G && $ < R.byteLength; )
        ee += Q, Y += Q.length, $ += 128, Q += String.fromCharCode.apply(null, new Uint16Array(R.subarray($, $ + 128)));
      return -1 < K ? (R.pos += Y + K + 1, ee + Q.slice(0, K)) : !1;
    }, g = function(R) {
      const G = /^#\?(\S+)/, k = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, B = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, $ = /^\s*FORMAT=(\S+)\s*$/, K = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, Y = {
        valid: 0,
        string: "",
        comments: "",
        programtype: "RGBE",
        format: "",
        gamma: 1,
        exposure: 1,
        width: 0,
        height: 0
      };
      let ee, Q;
      for ((R.pos >= R.byteLength || !(ee = d(R))) && l(1, "no header found"), (Q = ee.match(G)) || l(3, "bad initial token"), Y.valid |= 1, Y.programtype = Q[1], Y.string += ee + `
`; ee = d(R), ee !== !1; ) {
        if (Y.string += ee + `
`, ee.charAt(0) === "#") {
          Y.comments += ee + `
`;
          continue;
        }
        if ((Q = ee.match(k)) && (Y.gamma = parseFloat(Q[1])), (Q = ee.match(B)) && (Y.exposure = parseFloat(Q[1])), (Q = ee.match($)) && (Y.valid |= 2, Y.format = Q[1]), (Q = ee.match(K)) && (Y.valid |= 4, Y.height = parseInt(Q[1], 10), Y.width = parseInt(Q[2], 10)), Y.valid & 2 && Y.valid & 4)
          break;
      }
      return Y.valid & 2 || l(3, "missing format specifier"), Y.valid & 4 || l(3, "missing image size specifier"), Y;
    }, y = function(R, G, k) {
      const B = G;
      if (
        // run length encoding is not allowed so read flat
        B < 8 || B > 32767 || // this file is not run length encoded
        R[0] !== 2 || R[1] !== 2 || R[2] & 128
      )
        return new Uint8Array(R);
      B !== (R[2] << 8 | R[3]) && l(3, "wrong scanline width");
      const $ = new Uint8Array(4 * G * k);
      $.length || l(4, "unable to allocate buffer space");
      let K = 0, Y = 0;
      const ee = 4 * B, Q = new Uint8Array(4), Ee = new Uint8Array(ee);
      let we = k;
      for (; we > 0 && Y < R.byteLength; ) {
        Y + 4 > R.byteLength && l(1), Q[0] = R[Y++], Q[1] = R[Y++], Q[2] = R[Y++], Q[3] = R[Y++], (Q[0] != 2 || Q[1] != 2 || (Q[2] << 8 | Q[3]) != B) && l(3, "bad rgbe scanline format");
        let be = 0, ge;
        for (; be < ee && Y < R.byteLength; ) {
          ge = R[Y++];
          const Le = ge > 128;
          if (Le && (ge -= 128), (ge === 0 || be + ge > ee) && l(3, "bad scanline data"), Le) {
            const Oe = R[Y++];
            for (let ct = 0; ct < ge; ct++)
              Ee[be++] = Oe;
          } else
            Ee.set(R.subarray(Y, Y + ge), be), be += ge, Y += ge;
        }
        const Ce = B;
        for (let Le = 0; Le < Ce; Le++) {
          let Oe = 0;
          $[K] = Ee[Le + Oe], Oe += B, $[K + 1] = Ee[Le + Oe], Oe += B, $[K + 2] = Ee[Le + Oe], Oe += B, $[K + 3] = Ee[Le + Oe], K += 4;
        }
        we--;
      }
      return $;
    }, b = function(R, G, k, B) {
      const $ = R[G + 3], K = Math.pow(2, $ - 128) / 255;
      k[B + 0] = R[G + 0] * K, k[B + 1] = R[G + 1] * K, k[B + 2] = R[G + 2] * K, k[B + 3] = 1;
    }, T = function(R, G, k, B) {
      const $ = R[G + 3], K = Math.pow(2, $ - 128) / 255;
      k[B + 0] = Eo.toHalfFloat(Math.min(R[G + 0] * K, 65504)), k[B + 1] = Eo.toHalfFloat(Math.min(R[G + 1] * K, 65504)), k[B + 2] = Eo.toHalfFloat(Math.min(R[G + 2] * K, 65504)), k[B + 3] = Eo.toHalfFloat(1);
    }, x = new Uint8Array(e);
    x.pos = 0;
    const E = g(x), M = E.width, A = E.height, D = y(x.subarray(x.pos), M, A);
    let z, j, V;
    switch (this.type) {
      case Zo:
        V = D.length / 4;
        const R = new Float32Array(V * 4);
        for (let k = 0; k < V; k++)
          b(D, k * 4, R, k * 4);
        z = R, j = Zo;
        break;
      case Xi:
        V = D.length / 4;
        const G = new Uint16Array(V * 4);
        for (let k = 0; k < V; k++)
          T(D, k * 4, G, k * 4);
        z = G, j = Xi;
        break;
      default:
        throw new Error("THREE.RGBELoader: Unsupported type: " + this.type);
    }
    return {
      width: M,
      height: A,
      data: z,
      header: E.string,
      gamma: E.gamma,
      exposure: E.exposure,
      type: j
    };
  }
  setDataType(e) {
    return this.type = e, this;
  }
  load(e, t, r, i) {
    function o(l, c) {
      switch (l.type) {
        case Zo:
        case Xi:
          "colorSpace" in l ? l.colorSpace = "srgb-linear" : l.encoding = 3e3, l.minFilter = yi, l.magFilter = yi, l.generateMipmaps = !1, l.flipY = !0;
          break;
      }
      t && t(l, c);
    }
    return super.load(e, o, r, i);
  }
}
const Fl = /* @__PURE__ */ new WeakMap();
class Pb extends gc {
  constructor(e) {
    super(e), this.decoderPath = "", this.decoderConfig = {}, this.decoderBinary = null, this.decoderPending = null, this.workerLimit = 4, this.workerPool = [], this.workerNextTaskID = 1, this.workerSourceURL = "", this.defaultAttributeIDs = {
      position: "POSITION",
      normal: "NORMAL",
      color: "COLOR",
      uv: "TEX_COORD"
    }, this.defaultAttributeTypes = {
      position: "Float32Array",
      normal: "Float32Array",
      color: "Float32Array",
      uv: "Float32Array"
    };
  }
  setDecoderPath(e) {
    return this.decoderPath = e, this;
  }
  setDecoderConfig(e) {
    return this.decoderConfig = e, this;
  }
  setWorkerLimit(e) {
    return this.workerLimit = e, this;
  }
  load(e, t, r, i) {
    const o = new vi(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(
      e,
      (l) => {
        const c = {
          attributeIDs: this.defaultAttributeIDs,
          attributeTypes: this.defaultAttributeTypes,
          useUniqueIDs: !1
        };
        this.decodeGeometry(l, c).then(t).catch(i);
      },
      r,
      i
    );
  }
  /** @deprecated Kept for backward-compatibility with previous DRACOLoader versions. */
  decodeDracoFile(e, t, r, i) {
    const o = {
      attributeIDs: r || this.defaultAttributeIDs,
      attributeTypes: i || this.defaultAttributeTypes,
      useUniqueIDs: !!r
    };
    this.decodeGeometry(e, o).then(t);
  }
  decodeGeometry(e, t) {
    for (const u in t.attributeTypes) {
      const f = t.attributeTypes[u];
      f.BYTES_PER_ELEMENT !== void 0 && (t.attributeTypes[u] = f.name);
    }
    const r = JSON.stringify(t);
    if (Fl.has(e)) {
      const u = Fl.get(e);
      if (u.key === r)
        return u.promise;
      if (e.byteLength === 0)
        throw new Error(
          "THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred."
        );
    }
    let i;
    const o = this.workerNextTaskID++, l = e.byteLength, c = this._getWorker(o, l).then((u) => (i = u, new Promise((f, p) => {
      i._callbacks[o] = { resolve: f, reject: p }, i.postMessage({ type: "decode", id: o, taskConfig: t, buffer: e }, [e]);
    }))).then((u) => this._createGeometry(u.geometry));
    return c.catch(() => !0).then(() => {
      i && o && this._releaseTask(i, o);
    }), Fl.set(e, {
      key: r,
      promise: c
    }), c;
  }
  _createGeometry(e) {
    const t = new qt();
    e.index && t.setIndex(new mt(e.index.array, 1));
    for (let r = 0; r < e.attributes.length; r++) {
      const i = e.attributes[r], o = i.name, l = i.array, c = i.itemSize;
      t.setAttribute(o, new mt(l, c));
    }
    return t;
  }
  _loadLibrary(e, t) {
    const r = new vi(this.manager);
    return r.setPath(this.decoderPath), r.setResponseType(t), r.setWithCredentials(this.withCredentials), new Promise((i, o) => {
      r.load(e, i, void 0, o);
    });
  }
  preload() {
    return this._initDecoder(), this;
  }
  _initDecoder() {
    if (this.decoderPending)
      return this.decoderPending;
    const e = typeof WebAssembly != "object" || this.decoderConfig.type === "js", t = [];
    return e ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")), t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))), this.decoderPending = Promise.all(t).then((r) => {
      const i = r[0];
      e || (this.decoderConfig.wasmBinary = r[1]);
      const o = Eb.toString(), l = [
        "/* draco decoder */",
        i,
        "",
        "/* worker */",
        o.substring(o.indexOf("{") + 1, o.lastIndexOf("}"))
      ].join(`
`);
      this.workerSourceURL = URL.createObjectURL(new Blob([l]));
    }), this.decoderPending;
  }
  _getWorker(e, t) {
    return this._initDecoder().then(() => {
      if (this.workerPool.length < this.workerLimit) {
        const i = new Worker(this.workerSourceURL);
        i._callbacks = {}, i._taskCosts = {}, i._taskLoad = 0, i.postMessage({ type: "init", decoderConfig: this.decoderConfig }), i.onmessage = function(o) {
          const l = o.data;
          switch (l.type) {
            case "decode":
              i._callbacks[l.id].resolve(l);
              break;
            case "error":
              i._callbacks[l.id].reject(l);
              break;
            default:
              console.error('THREE.DRACOLoader: Unexpected message, "' + l.type + '"');
          }
        }, this.workerPool.push(i);
      } else
        this.workerPool.sort(function(i, o) {
          return i._taskLoad > o._taskLoad ? -1 : 1;
        });
      const r = this.workerPool[this.workerPool.length - 1];
      return r._taskCosts[e] = t, r._taskLoad += t, r;
    });
  }
  _releaseTask(e, t) {
    e._taskLoad -= e._taskCosts[t], delete e._callbacks[t], delete e._taskCosts[t];
  }
  debug() {
    console.log(
      "Task load: ",
      this.workerPool.map((e) => e._taskLoad)
    );
  }
  dispose() {
    for (let e = 0; e < this.workerPool.length; ++e)
      this.workerPool[e].terminate();
    return this.workerPool.length = 0, this;
  }
}
function Eb() {
  let s, e;
  onmessage = function(l) {
    const c = l.data;
    switch (c.type) {
      case "init":
        s = c.decoderConfig, e = new Promise(function(p) {
          s.onModuleLoaded = function(d) {
            p({ draco: d });
          }, DracoDecoderModule(s);
        });
        break;
      case "decode":
        const u = c.buffer, f = c.taskConfig;
        e.then((p) => {
          const d = p.draco, g = new d.Decoder(), y = new d.DecoderBuffer();
          y.Init(new Int8Array(u), u.byteLength);
          try {
            const b = t(d, g, y, f), T = b.attributes.map((x) => x.array.buffer);
            b.index && T.push(b.index.array.buffer), self.postMessage({ type: "decode", id: c.id, geometry: b }, T);
          } catch (b) {
            console.error(b), self.postMessage({ type: "error", id: c.id, error: b.message });
          } finally {
            d.destroy(y), d.destroy(g);
          }
        });
        break;
    }
  };
  function t(l, c, u, f) {
    const p = f.attributeIDs, d = f.attributeTypes;
    let g, y;
    const b = c.GetEncodedGeometryType(u);
    if (b === l.TRIANGULAR_MESH)
      g = new l.Mesh(), y = c.DecodeBufferToMesh(u, g);
    else if (b === l.POINT_CLOUD)
      g = new l.PointCloud(), y = c.DecodeBufferToPointCloud(u, g);
    else
      throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
    if (!y.ok() || g.ptr === 0)
      throw new Error("THREE.DRACOLoader: Decoding failed: " + y.error_msg());
    const T = { index: null, attributes: [] };
    for (const x in p) {
      const E = self[d[x]];
      let M, A;
      if (f.useUniqueIDs)
        A = p[x], M = c.GetAttributeByUniqueId(g, A);
      else {
        if (A = c.GetAttributeId(g, l[p[x]]), A === -1)
          continue;
        M = c.GetAttribute(g, A);
      }
      T.attributes.push(i(l, c, g, x, E, M));
    }
    return b === l.TRIANGULAR_MESH && (T.index = r(l, c, g)), l.destroy(g), T;
  }
  function r(l, c, u) {
    const p = u.num_faces() * 3, d = p * 4, g = l._malloc(d);
    c.GetTrianglesUInt32Array(u, d, g);
    const y = new Uint32Array(l.HEAPF32.buffer, g, p).slice();
    return l._free(g), { array: y, itemSize: 1 };
  }
  function i(l, c, u, f, p, d) {
    const g = d.num_components(), b = u.num_points() * g, T = b * p.BYTES_PER_ELEMENT, x = o(l, p), E = l._malloc(T);
    c.GetAttributeDataArrayForAllPoints(u, d, x, T, E);
    const M = new p(l.HEAPF32.buffer, E, b).slice();
    return l._free(E), {
      name: f,
      array: M,
      itemSize: g
    };
  }
  function o(l, c) {
    switch (c) {
      case Float32Array:
        return l.DT_FLOAT32;
      case Int8Array:
        return l.DT_INT8;
      case Int16Array:
        return l.DT_INT16;
      case Int32Array:
        return l.DT_INT32;
      case Uint8Array:
        return l.DT_UINT8;
      case Uint16Array:
        return l.DT_UINT16;
      case Uint32Array:
        return l.DT_UINT32;
    }
  }
}
const Tf = /* @__PURE__ */ new en(), Do = /* @__PURE__ */ new I();
class zd extends rd {
  constructor() {
    super(), this.isLineSegmentsGeometry = !0, this.type = "LineSegmentsGeometry";
    const e = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0], t = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2], r = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
    this.setIndex(r), this.setAttribute("position", new fi(e, 3)), this.setAttribute("uv", new fi(t, 2));
  }
  applyMatrix4(e) {
    const t = this.attributes.instanceStart, r = this.attributes.instanceEnd;
    return t !== void 0 && (t.applyMatrix4(e), r.applyMatrix4(e), t.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  setPositions(e) {
    let t;
    e instanceof Float32Array ? t = e : Array.isArray(e) && (t = new Float32Array(e));
    const r = new nc(t, 6, 1);
    return this.setAttribute("instanceStart", new Yi(r, 3, 0)), this.setAttribute("instanceEnd", new Yi(r, 3, 3)), this.computeBoundingBox(), this.computeBoundingSphere(), this;
  }
  setColors(e, t = 3) {
    let r;
    e instanceof Float32Array ? r = e : Array.isArray(e) && (r = new Float32Array(e));
    const i = new nc(r, t * 2, 1);
    return this.setAttribute("instanceColorStart", new Yi(i, t, 0)), this.setAttribute("instanceColorEnd", new Yi(i, t, t)), this;
  }
  fromWireframeGeometry(e) {
    return this.setPositions(e.attributes.position.array), this;
  }
  fromEdgesGeometry(e) {
    return this.setPositions(e.attributes.position.array), this;
  }
  fromMesh(e) {
    return this.fromWireframeGeometry(new o1(e.geometry)), this;
  }
  fromLineSegments(e) {
    const t = e.geometry;
    return this.setPositions(t.attributes.position.array), this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new en());
    const e = this.attributes.instanceStart, t = this.attributes.instanceEnd;
    e !== void 0 && t !== void 0 && (this.boundingBox.setFromBufferAttribute(e), Tf.setFromBufferAttribute(t), this.boundingBox.union(Tf));
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new yc()), this.boundingBox === null && this.computeBoundingBox();
    const e = this.attributes.instanceStart, t = this.attributes.instanceEnd;
    if (e !== void 0 && t !== void 0) {
      const r = this.boundingSphere.center;
      this.boundingBox.getCenter(r);
      let i = 0;
      for (let o = 0, l = e.count; o < l; o++)
        Do.fromBufferAttribute(e, o), i = Math.max(i, r.distanceToSquared(Do)), Do.fromBufferAttribute(t, o), i = Math.max(i, r.distanceToSquared(Do));
      this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error(
        "THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",
        this
      );
    }
  }
  toJSON() {
  }
  applyMatrix(e) {
    return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."), this.applyMatrix4(e);
  }
}
class oa extends zd {
  constructor() {
    super(), this.isLineGeometry = !0, this.type = "LineGeometry";
  }
  setPositions(e) {
    const t = e.length - 3, r = new Float32Array(2 * t);
    for (let i = 0; i < t; i += 3)
      r[2 * i] = e[i], r[2 * i + 1] = e[i + 1], r[2 * i + 2] = e[i + 2], r[2 * i + 3] = e[i + 3], r[2 * i + 4] = e[i + 4], r[2 * i + 5] = e[i + 5];
    return super.setPositions(r), this;
  }
  setColors(e, t = 3) {
    const r = e.length - t, i = new Float32Array(2 * r);
    if (t === 3)
      for (let o = 0; o < r; o += t)
        i[2 * o] = e[o], i[2 * o + 1] = e[o + 1], i[2 * o + 2] = e[o + 2], i[2 * o + 3] = e[o + 3], i[2 * o + 4] = e[o + 4], i[2 * o + 5] = e[o + 5];
    else
      for (let o = 0; o < r; o += t)
        i[2 * o] = e[o], i[2 * o + 1] = e[o + 1], i[2 * o + 2] = e[o + 2], i[2 * o + 3] = e[o + 3], i[2 * o + 4] = e[o + 4], i[2 * o + 5] = e[o + 5], i[2 * o + 6] = e[o + 6], i[2 * o + 7] = e[o + 7];
    return super.setColors(i, t), this;
  }
  fromLine(e) {
    const t = e.geometry;
    return this.setPositions(t.attributes.position.array), this;
  }
}
class Bs extends Ar {
  constructor(e) {
    super({
      type: "LineMaterial",
      uniforms: Ji.clone(
        Ji.merge([
          Qo.common,
          Qo.fog,
          {
            worldUnits: { value: 1 },
            linewidth: { value: 1 },
            resolution: { value: new ce(1, 1) },
            dashOffset: { value: 0 },
            dashScale: { value: 1 },
            dashSize: { value: 1 },
            gapSize: { value: 1 }
            // todo FIX - maybe change to totalSize
          }
        ])
      ),
      vertexShader: (
        /* glsl */
        `
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`
      ),
      fragmentShader: (
        /* glsl */
        `
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${sa >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`
      ),
      clipping: !0
      // required for clipping support
    }), this.isLineMaterial = !0, this.onBeforeCompile = function() {
      this.transparent ? this.defines.USE_LINE_COLOR_ALPHA = "1" : delete this.defines.USE_LINE_COLOR_ALPHA;
    }, Object.defineProperties(this, {
      color: {
        enumerable: !0,
        get: function() {
          return this.uniforms.diffuse.value;
        },
        set: function(t) {
          this.uniforms.diffuse.value = t;
        }
      },
      worldUnits: {
        enumerable: !0,
        get: function() {
          return "WORLD_UNITS" in this.defines;
        },
        set: function(t) {
          t === !0 ? this.defines.WORLD_UNITS = "" : delete this.defines.WORLD_UNITS;
        }
      },
      linewidth: {
        enumerable: !0,
        get: function() {
          return this.uniforms.linewidth.value;
        },
        set: function(t) {
          this.uniforms.linewidth.value = t;
        }
      },
      dashed: {
        enumerable: !0,
        get: function() {
          return "USE_DASH" in this.defines;
        },
        set(t) {
          !!t != "USE_DASH" in this.defines && (this.needsUpdate = !0), t === !0 ? this.defines.USE_DASH = "" : delete this.defines.USE_DASH;
        }
      },
      dashScale: {
        enumerable: !0,
        get: function() {
          return this.uniforms.dashScale.value;
        },
        set: function(t) {
          this.uniforms.dashScale.value = t;
        }
      },
      dashSize: {
        enumerable: !0,
        get: function() {
          return this.uniforms.dashSize.value;
        },
        set: function(t) {
          this.uniforms.dashSize.value = t;
        }
      },
      dashOffset: {
        enumerable: !0,
        get: function() {
          return this.uniforms.dashOffset.value;
        },
        set: function(t) {
          this.uniforms.dashOffset.value = t;
        }
      },
      gapSize: {
        enumerable: !0,
        get: function() {
          return this.uniforms.gapSize.value;
        },
        set: function(t) {
          this.uniforms.gapSize.value = t;
        }
      },
      opacity: {
        enumerable: !0,
        get: function() {
          return this.uniforms.opacity.value;
        },
        set: function(t) {
          this.uniforms.opacity.value = t;
        }
      },
      resolution: {
        enumerable: !0,
        get: function() {
          return this.uniforms.resolution.value;
        },
        set: function(t) {
          this.uniforms.resolution.value.copy(t);
        }
      },
      alphaToCoverage: {
        enumerable: !0,
        get: function() {
          return "USE_ALPHA_TO_COVERAGE" in this.defines;
        },
        set: function(t) {
          !!t != "USE_ALPHA_TO_COVERAGE" in this.defines && (this.needsUpdate = !0), t === !0 ? (this.defines.USE_ALPHA_TO_COVERAGE = "", this.extensions.derivatives = !0) : (delete this.defines.USE_ALPHA_TO_COVERAGE, this.extensions.derivatives = !1);
        }
      }
    }), this.setValues(e);
  }
}
const Rl = /* @__PURE__ */ new gr(), Sf = /* @__PURE__ */ new I(), Mf = /* @__PURE__ */ new I(), qe = /* @__PURE__ */ new gr(), Qe = /* @__PURE__ */ new gr(), br = /* @__PURE__ */ new gr(), Bl = /* @__PURE__ */ new I(), Ul = /* @__PURE__ */ new xe(), tt = /* @__PURE__ */ new a1(), Af = /* @__PURE__ */ new I(), Io = /* @__PURE__ */ new en(), Fo = /* @__PURE__ */ new yc(), Tr = /* @__PURE__ */ new gr();
let Mr, Qi;
function Pf(s, e, t) {
  return Tr.set(0, 0, -e, 1).applyMatrix4(s.projectionMatrix), Tr.multiplyScalar(1 / Tr.w), Tr.x = Qi / t.width, Tr.y = Qi / t.height, Tr.applyMatrix4(s.projectionMatrixInverse), Tr.multiplyScalar(1 / Tr.w), Math.abs(Math.max(Tr.x, Tr.y));
}
function Cb(s, e) {
  const t = s.matrixWorld, r = s.geometry, i = r.attributes.instanceStart, o = r.attributes.instanceEnd, l = Math.min(r.instanceCount, i.count);
  for (let c = 0, u = l; c < u; c++) {
    tt.start.fromBufferAttribute(i, c), tt.end.fromBufferAttribute(o, c), tt.applyMatrix4(t);
    const f = new I(), p = new I();
    Mr.distanceSqToSegment(tt.start, tt.end, p, f), p.distanceTo(f) < Qi * 0.5 && e.push({
      point: p,
      pointOnLine: f,
      distance: Mr.origin.distanceTo(p),
      object: s,
      face: null,
      faceIndex: c,
      uv: null,
      [vc]: null
    });
  }
}
function Lb(s, e, t) {
  const r = e.projectionMatrix, o = s.material.resolution, l = s.matrixWorld, c = s.geometry, u = c.attributes.instanceStart, f = c.attributes.instanceEnd, p = Math.min(c.instanceCount, u.count), d = -e.near;
  Mr.at(1, br), br.w = 1, br.applyMatrix4(e.matrixWorldInverse), br.applyMatrix4(r), br.multiplyScalar(1 / br.w), br.x *= o.x / 2, br.y *= o.y / 2, br.z = 0, Bl.copy(br), Ul.multiplyMatrices(e.matrixWorldInverse, l);
  for (let g = 0, y = p; g < y; g++) {
    if (qe.fromBufferAttribute(u, g), Qe.fromBufferAttribute(f, g), qe.w = 1, Qe.w = 1, qe.applyMatrix4(Ul), Qe.applyMatrix4(Ul), qe.z > d && Qe.z > d)
      continue;
    if (qe.z > d) {
      const A = qe.z - Qe.z, D = (qe.z - d) / A;
      qe.lerp(Qe, D);
    } else if (Qe.z > d) {
      const A = Qe.z - qe.z, D = (Qe.z - d) / A;
      Qe.lerp(qe, D);
    }
    qe.applyMatrix4(r), Qe.applyMatrix4(r), qe.multiplyScalar(1 / qe.w), Qe.multiplyScalar(1 / Qe.w), qe.x *= o.x / 2, qe.y *= o.y / 2, Qe.x *= o.x / 2, Qe.y *= o.y / 2, tt.start.copy(qe), tt.start.z = 0, tt.end.copy(Qe), tt.end.z = 0;
    const T = tt.closestPointToPointParameter(Bl, !0);
    tt.at(T, Af);
    const x = lt.lerp(qe.z, Qe.z, T), E = x >= -1 && x <= 1, M = Bl.distanceTo(Af) < Qi * 0.5;
    if (E && M) {
      tt.start.fromBufferAttribute(u, g), tt.end.fromBufferAttribute(f, g), tt.start.applyMatrix4(l), tt.end.applyMatrix4(l);
      const A = new I(), D = new I();
      Mr.distanceSqToSegment(tt.start, tt.end, D, A), t.push({
        point: D,
        pointOnLine: A,
        distance: Mr.origin.distanceTo(D),
        object: s,
        face: null,
        faceIndex: g,
        uv: null,
        [vc]: null
      });
    }
  }
}
class Ob extends Ue {
  constructor(e = new zd(), t = new Bs({ color: Math.random() * 16777215 })) {
    super(e, t), this.isLineSegments2 = !0, this.type = "LineSegments2";
  }
  // for backwards-compatibility, but could be a method of LineSegmentsGeometry...
  computeLineDistances() {
    const e = this.geometry, t = e.attributes.instanceStart, r = e.attributes.instanceEnd, i = new Float32Array(2 * t.count);
    for (let l = 0, c = 0, u = t.count; l < u; l++, c += 2)
      Sf.fromBufferAttribute(t, l), Mf.fromBufferAttribute(r, l), i[c] = c === 0 ? 0 : i[c - 1], i[c + 1] = i[c] + Sf.distanceTo(Mf);
    const o = new nc(i, 2, 1);
    return e.setAttribute("instanceDistanceStart", new Yi(o, 1, 0)), e.setAttribute("instanceDistanceEnd", new Yi(o, 1, 1)), this;
  }
  raycast(e, t) {
    const r = this.material.worldUnits, i = e.camera;
    i === null && !r && console.error(
      'LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'
    );
    const o = e.params.Line2 !== void 0 && e.params.Line2.threshold || 0;
    Mr = e.ray;
    const l = this.matrixWorld, c = this.geometry, u = this.material;
    Qi = u.linewidth + o, c.boundingSphere === null && c.computeBoundingSphere(), Fo.copy(c.boundingSphere).applyMatrix4(l);
    let f;
    if (r)
      f = Qi * 0.5;
    else {
      const d = Math.max(i.near, Fo.distanceToPoint(Mr.origin));
      f = Pf(i, d, u.resolution);
    }
    if (Fo.radius += f, Mr.intersectsSphere(Fo) === !1)
      return;
    c.boundingBox === null && c.computeBoundingBox(), Io.copy(c.boundingBox).applyMatrix4(l);
    let p;
    if (r)
      p = Qi * 0.5;
    else {
      const d = Math.max(i.near, Io.distanceToPoint(Mr.origin));
      p = Pf(i, d, u.resolution);
    }
    Io.expandByScalar(p), Mr.intersectsBox(Io) !== !1 && (r ? Cb(this, t) : Lb(this, i, t));
  }
  onBeforeRender(e) {
    const t = this.material.uniforms;
    t && t.resolution && (e.getViewport(Rl), this.material.uniforms.resolution.value.set(Rl.z, Rl.w));
  }
}
class aa extends Ob {
  constructor(e = new oa(), t = new Bs({ color: Math.random() * 16777215 })) {
    super(e, t), this.isLine2 = !0, this.type = "Line2";
  }
}
var gi = Object.freeze({
  Linear: Object.freeze({
    None: function(s) {
      return s;
    },
    In: function(s) {
      return this.None(s);
    },
    Out: function(s) {
      return this.None(s);
    },
    InOut: function(s) {
      return this.None(s);
    }
  }),
  Quadratic: Object.freeze({
    In: function(s) {
      return s * s;
    },
    Out: function(s) {
      return s * (2 - s);
    },
    InOut: function(s) {
      return (s *= 2) < 1 ? 0.5 * s * s : -0.5 * (--s * (s - 2) - 1);
    }
  }),
  Cubic: Object.freeze({
    In: function(s) {
      return s * s * s;
    },
    Out: function(s) {
      return --s * s * s + 1;
    },
    InOut: function(s) {
      return (s *= 2) < 1 ? 0.5 * s * s * s : 0.5 * ((s -= 2) * s * s + 2);
    }
  }),
  Quartic: Object.freeze({
    In: function(s) {
      return s * s * s * s;
    },
    Out: function(s) {
      return 1 - --s * s * s * s;
    },
    InOut: function(s) {
      return (s *= 2) < 1 ? 0.5 * s * s * s * s : -0.5 * ((s -= 2) * s * s * s - 2);
    }
  }),
  Quintic: Object.freeze({
    In: function(s) {
      return s * s * s * s * s;
    },
    Out: function(s) {
      return --s * s * s * s * s + 1;
    },
    InOut: function(s) {
      return (s *= 2) < 1 ? 0.5 * s * s * s * s * s : 0.5 * ((s -= 2) * s * s * s * s + 2);
    }
  }),
  Sinusoidal: Object.freeze({
    In: function(s) {
      return 1 - Math.sin((1 - s) * Math.PI / 2);
    },
    Out: function(s) {
      return Math.sin(s * Math.PI / 2);
    },
    InOut: function(s) {
      return 0.5 * (1 - Math.sin(Math.PI * (0.5 - s)));
    }
  }),
  Exponential: Object.freeze({
    In: function(s) {
      return s === 0 ? 0 : Math.pow(1024, s - 1);
    },
    Out: function(s) {
      return s === 1 ? 1 : 1 - Math.pow(2, -10 * s);
    },
    InOut: function(s) {
      return s === 0 ? 0 : s === 1 ? 1 : (s *= 2) < 1 ? 0.5 * Math.pow(1024, s - 1) : 0.5 * (-Math.pow(2, -10 * (s - 1)) + 2);
    }
  }),
  Circular: Object.freeze({
    In: function(s) {
      return 1 - Math.sqrt(1 - s * s);
    },
    Out: function(s) {
      return Math.sqrt(1 - --s * s);
    },
    InOut: function(s) {
      return (s *= 2) < 1 ? -0.5 * (Math.sqrt(1 - s * s) - 1) : 0.5 * (Math.sqrt(1 - (s -= 2) * s) + 1);
    }
  }),
  Elastic: Object.freeze({
    In: function(s) {
      return s === 0 ? 0 : s === 1 ? 1 : -Math.pow(2, 10 * (s - 1)) * Math.sin((s - 1.1) * 5 * Math.PI);
    },
    Out: function(s) {
      return s === 0 ? 0 : s === 1 ? 1 : Math.pow(2, -10 * s) * Math.sin((s - 0.1) * 5 * Math.PI) + 1;
    },
    InOut: function(s) {
      return s === 0 ? 0 : s === 1 ? 1 : (s *= 2, s < 1 ? -0.5 * Math.pow(2, 10 * (s - 1)) * Math.sin((s - 1.1) * 5 * Math.PI) : 0.5 * Math.pow(2, -10 * (s - 1)) * Math.sin((s - 1.1) * 5 * Math.PI) + 1);
    }
  }),
  Back: Object.freeze({
    In: function(s) {
      var e = 1.70158;
      return s === 1 ? 1 : s * s * ((e + 1) * s - e);
    },
    Out: function(s) {
      var e = 1.70158;
      return s === 0 ? 0 : --s * s * ((e + 1) * s + e) + 1;
    },
    InOut: function(s) {
      var e = 2.5949095;
      return (s *= 2) < 1 ? 0.5 * (s * s * ((e + 1) * s - e)) : 0.5 * ((s -= 2) * s * ((e + 1) * s + e) + 2);
    }
  }),
  Bounce: Object.freeze({
    In: function(s) {
      return 1 - gi.Bounce.Out(1 - s);
    },
    Out: function(s) {
      return s < 1 / 2.75 ? 7.5625 * s * s : s < 2 / 2.75 ? 7.5625 * (s -= 1.5 / 2.75) * s + 0.75 : s < 2.5 / 2.75 ? 7.5625 * (s -= 2.25 / 2.75) * s + 0.9375 : 7.5625 * (s -= 2.625 / 2.75) * s + 0.984375;
    },
    InOut: function(s) {
      return s < 0.5 ? gi.Bounce.In(s * 2) * 0.5 : gi.Bounce.Out(s * 2 - 1) * 0.5 + 0.5;
    }
  }),
  generatePow: function(s) {
    return s === void 0 && (s = 4), s = s < Number.EPSILON ? Number.EPSILON : s, s = s > 1e4 ? 1e4 : s, {
      In: function(e) {
        return Math.pow(e, s);
      },
      Out: function(e) {
        return 1 - Math.pow(1 - e, s);
      },
      InOut: function(e) {
        return e < 0.5 ? Math.pow(e * 2, s) / 2 : (1 - Math.pow(2 - e * 2, s)) / 2 + 0.5;
      }
    };
  }
}), ys = function() {
  return performance.now();
}, Db = (
  /** @class */
  (function() {
    function s() {
      this._tweens = {}, this._tweensAddedDuringUpdate = {};
    }
    return s.prototype.getAll = function() {
      var e = this;
      return Object.keys(this._tweens).map(function(t) {
        return e._tweens[t];
      });
    }, s.prototype.removeAll = function() {
      this._tweens = {};
    }, s.prototype.add = function(e) {
      this._tweens[e.getId()] = e, this._tweensAddedDuringUpdate[e.getId()] = e;
    }, s.prototype.remove = function(e) {
      delete this._tweens[e.getId()], delete this._tweensAddedDuringUpdate[e.getId()];
    }, s.prototype.update = function(e, t) {
      e === void 0 && (e = ys()), t === void 0 && (t = !1);
      var r = Object.keys(this._tweens);
      if (r.length === 0)
        return !1;
      for (; r.length > 0; ) {
        this._tweensAddedDuringUpdate = {};
        for (var i = 0; i < r.length; i++) {
          var o = this._tweens[r[i]], l = !t;
          o && o.update(e, l) === !1 && !t && delete this._tweens[r[i]];
        }
        r = Object.keys(this._tweensAddedDuringUpdate);
      }
      return !0;
    }, s;
  })()
), hc = {
  Linear: function(s, e) {
    var t = s.length - 1, r = t * e, i = Math.floor(r), o = hc.Utils.Linear;
    return e < 0 ? o(s[0], s[1], r) : e > 1 ? o(s[t], s[t - 1], t - r) : o(s[i], s[i + 1 > t ? t : i + 1], r - i);
  },
  Utils: {
    Linear: function(s, e, t) {
      return (e - s) * t + s;
    }
  }
}, Nd = (
  /** @class */
  (function() {
    function s() {
    }
    return s.nextId = function() {
      return s._nextId++;
    }, s._nextId = 0, s;
  })()
), fc = new Db(), Ro = (
  /** @class */
  (function() {
    function s(e, t) {
      t === void 0 && (t = fc), this._object = e, this._group = t, this._isPaused = !1, this._pauseStart = 0, this._valuesStart = {}, this._valuesEnd = {}, this._valuesStartRepeat = {}, this._duration = 1e3, this._isDynamic = !1, this._initialRepeat = 0, this._repeat = 0, this._yoyo = !1, this._isPlaying = !1, this._reversed = !1, this._delayTime = 0, this._startTime = 0, this._easingFunction = gi.Linear.None, this._interpolationFunction = hc.Linear, this._chainedTweens = [], this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._id = Nd.nextId(), this._isChainStopped = !1, this._propertiesAreSetUp = !1, this._goToEnd = !1;
    }
    return s.prototype.getId = function() {
      return this._id;
    }, s.prototype.isPlaying = function() {
      return this._isPlaying;
    }, s.prototype.isPaused = function() {
      return this._isPaused;
    }, s.prototype.getDuration = function() {
      return this._duration;
    }, s.prototype.to = function(e, t) {
      if (t === void 0 && (t = 1e3), this._isPlaying)
        throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
      return this._valuesEnd = e, this._propertiesAreSetUp = !1, this._duration = t < 0 ? 0 : t, this;
    }, s.prototype.duration = function(e) {
      return e === void 0 && (e = 1e3), this._duration = e < 0 ? 0 : e, this;
    }, s.prototype.dynamic = function(e) {
      return e === void 0 && (e = !1), this._isDynamic = e, this;
    }, s.prototype.start = function(e, t) {
      if (e === void 0 && (e = ys()), t === void 0 && (t = !1), this._isPlaying)
        return this;
      if (this._group && this._group.add(this), this._repeat = this._initialRepeat, this._reversed) {
        this._reversed = !1;
        for (var r in this._valuesStartRepeat)
          this._swapEndStartRepeatValues(r), this._valuesStart[r] = this._valuesStartRepeat[r];
      }
      if (this._isPlaying = !0, this._isPaused = !1, this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._isChainStopped = !1, this._startTime = e, this._startTime += this._delayTime, !this._propertiesAreSetUp || t) {
        if (this._propertiesAreSetUp = !0, !this._isDynamic) {
          var i = {};
          for (var o in this._valuesEnd)
            i[o] = this._valuesEnd[o];
          this._valuesEnd = i;
        }
        this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, t);
      }
      return this;
    }, s.prototype.startFromCurrentValues = function(e) {
      return this.start(e, !0);
    }, s.prototype._setupProperties = function(e, t, r, i, o) {
      for (var l in r) {
        var c = e[l], u = Array.isArray(c), f = u ? "array" : typeof c, p = !u && Array.isArray(r[l]);
        if (!(f === "undefined" || f === "function")) {
          if (p) {
            var d = r[l];
            if (d.length === 0)
              continue;
            for (var g = [c], y = 0, b = d.length; y < b; y += 1) {
              var T = this._handleRelativeValue(c, d[y]);
              if (isNaN(T)) {
                p = !1, console.warn("Found invalid interpolation list. Skipping.");
                break;
              }
              g.push(T);
            }
            p && (r[l] = g);
          }
          if ((f === "object" || u) && c && !p) {
            t[l] = u ? [] : {};
            var x = c;
            for (var E in x)
              t[l][E] = x[E];
            i[l] = u ? [] : {};
            var d = r[l];
            if (!this._isDynamic) {
              var M = {};
              for (var E in d)
                M[E] = d[E];
              r[l] = d = M;
            }
            this._setupProperties(x, t[l], d, i[l], o);
          } else
            (typeof t[l] > "u" || o) && (t[l] = c), u || (t[l] *= 1), p ? i[l] = r[l].slice().reverse() : i[l] = t[l] || 0;
        }
      }
    }, s.prototype.stop = function() {
      return this._isChainStopped || (this._isChainStopped = !0, this.stopChainedTweens()), this._isPlaying ? (this._group && this._group.remove(this), this._isPlaying = !1, this._isPaused = !1, this._onStopCallback && this._onStopCallback(this._object), this) : this;
    }, s.prototype.end = function() {
      return this._goToEnd = !0, this.update(1 / 0), this;
    }, s.prototype.pause = function(e) {
      return e === void 0 && (e = ys()), this._isPaused || !this._isPlaying ? this : (this._isPaused = !0, this._pauseStart = e, this._group && this._group.remove(this), this);
    }, s.prototype.resume = function(e) {
      return e === void 0 && (e = ys()), !this._isPaused || !this._isPlaying ? this : (this._isPaused = !1, this._startTime += e - this._pauseStart, this._pauseStart = 0, this._group && this._group.add(this), this);
    }, s.prototype.stopChainedTweens = function() {
      for (var e = 0, t = this._chainedTweens.length; e < t; e++)
        this._chainedTweens[e].stop();
      return this;
    }, s.prototype.group = function(e) {
      return e === void 0 && (e = fc), this._group = e, this;
    }, s.prototype.delay = function(e) {
      return e === void 0 && (e = 0), this._delayTime = e, this;
    }, s.prototype.repeat = function(e) {
      return e === void 0 && (e = 0), this._initialRepeat = e, this._repeat = e, this;
    }, s.prototype.repeatDelay = function(e) {
      return this._repeatDelayTime = e, this;
    }, s.prototype.yoyo = function(e) {
      return e === void 0 && (e = !1), this._yoyo = e, this;
    }, s.prototype.easing = function(e) {
      return e === void 0 && (e = gi.Linear.None), this._easingFunction = e, this;
    }, s.prototype.interpolation = function(e) {
      return e === void 0 && (e = hc.Linear), this._interpolationFunction = e, this;
    }, s.prototype.chain = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      return this._chainedTweens = e, this;
    }, s.prototype.onStart = function(e) {
      return this._onStartCallback = e, this;
    }, s.prototype.onEveryStart = function(e) {
      return this._onEveryStartCallback = e, this;
    }, s.prototype.onUpdate = function(e) {
      return this._onUpdateCallback = e, this;
    }, s.prototype.onRepeat = function(e) {
      return this._onRepeatCallback = e, this;
    }, s.prototype.onComplete = function(e) {
      return this._onCompleteCallback = e, this;
    }, s.prototype.onStop = function(e) {
      return this._onStopCallback = e, this;
    }, s.prototype.update = function(e, t) {
      var r = this, i;
      if (e === void 0 && (e = ys()), t === void 0 && (t = !0), this._isPaused)
        return !0;
      var o, l = this._startTime + this._duration;
      if (!this._goToEnd && !this._isPlaying) {
        if (e > l)
          return !1;
        t && this.start(e, !0);
      }
      if (this._goToEnd = !1, e < this._startTime)
        return !0;
      this._onStartCallbackFired === !1 && (this._onStartCallback && this._onStartCallback(this._object), this._onStartCallbackFired = !0), this._onEveryStartCallbackFired === !1 && (this._onEveryStartCallback && this._onEveryStartCallback(this._object), this._onEveryStartCallbackFired = !0);
      var c = e - this._startTime, u = this._duration + ((i = this._repeatDelayTime) !== null && i !== void 0 ? i : this._delayTime), f = this._duration + this._repeat * u, p = function() {
        if (r._duration === 0 || c > f)
          return 1;
        var x = Math.trunc(c / u), E = c - x * u, M = Math.min(E / r._duration, 1);
        return M === 0 && c === r._duration ? 1 : M;
      }, d = p(), g = this._easingFunction(d);
      if (this._updateProperties(this._object, this._valuesStart, this._valuesEnd, g), this._onUpdateCallback && this._onUpdateCallback(this._object, d), this._duration === 0 || c >= this._duration)
        if (this._repeat > 0) {
          var y = Math.min(Math.trunc((c - this._duration) / u) + 1, this._repeat);
          isFinite(this._repeat) && (this._repeat -= y);
          for (o in this._valuesStartRepeat)
            !this._yoyo && typeof this._valuesEnd[o] == "string" && (this._valuesStartRepeat[o] = // eslint-disable-next-line
            // @ts-ignore FIXME?
            this._valuesStartRepeat[o] + parseFloat(this._valuesEnd[o])), this._yoyo && this._swapEndStartRepeatValues(o), this._valuesStart[o] = this._valuesStartRepeat[o];
          return this._yoyo && (this._reversed = !this._reversed), this._startTime += u * y, this._onRepeatCallback && this._onRepeatCallback(this._object), this._onEveryStartCallbackFired = !1, !0;
        } else {
          this._onCompleteCallback && this._onCompleteCallback(this._object);
          for (var b = 0, T = this._chainedTweens.length; b < T; b++)
            this._chainedTweens[b].start(this._startTime + this._duration, !1);
          return this._isPlaying = !1, !1;
        }
      return !0;
    }, s.prototype._updateProperties = function(e, t, r, i) {
      for (var o in r)
        if (t[o] !== void 0) {
          var l = t[o] || 0, c = r[o], u = Array.isArray(e[o]), f = Array.isArray(c), p = !u && f;
          p ? e[o] = this._interpolationFunction(c, i) : typeof c == "object" && c ? this._updateProperties(e[o], l, c, i) : (c = this._handleRelativeValue(l, c), typeof c == "number" && (e[o] = l + (c - l) * i));
        }
    }, s.prototype._handleRelativeValue = function(e, t) {
      return typeof t != "string" ? t : t.charAt(0) === "+" || t.charAt(0) === "-" ? e + parseFloat(t) : parseFloat(t);
    }, s.prototype._swapEndStartRepeatValues = function(e) {
      var t = this._valuesStartRepeat[e], r = this._valuesEnd[e];
      typeof r == "string" ? this._valuesStartRepeat[e] = this._valuesStartRepeat[e] + parseFloat(r) : this._valuesStartRepeat[e] = this._valuesEnd[e], this._valuesEnd[e] = t;
    }, s;
  })()
);
Nd.nextId;
var Er = fc;
Er.getAll.bind(Er);
Er.removeAll.bind(Er);
Er.add.bind(Er);
Er.remove.bind(Er);
var Ib = Er.update.bind(Er);
function wc(s, e, t) {
  if (s == null || s === "")
    throw new Error(
      t || `Parameter "${e}" is required but received: ${s}`
    );
  return s;
}
function Hd(s, e, t) {
  const r = e.split(".");
  let i = s;
  for (const o of r) {
    if (i[o] === void 0 || i[o] === null)
      throw new Error(
        `Property "${e}" is required but missing at path: "${o}"`
      );
    i = i[o];
  }
  return i;
}
function Fb(s, e, t, r = 0, i = 1) {
  const o = (s - e) * (i - r) / (t - e) + r, l = Math.min(r, i), c = Math.max(r, i);
  return o < l ? l : o > c ? c : o || 0;
}
var Rb = Object.defineProperty, Bb = (s, e, t) => e in s ? Rb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ef = (s, e, t) => Bb(s, typeof e != "symbol" ? e + "" : e, t);
class Cf {
  constructor() {
    Ef(this, "_dispatcher", new _d()), Ef(this, "_listenerMap", /* @__PURE__ */ new Map());
  }
  /**
   * 订阅事件
   * @param type 事件类型
   * @param listener 事件监听函数
   * @returns 当前实例（支持链式调用）
   * 
   * @example
   * event.on('click', (data) => {
   *   console.log('click event:', data);
   * });
   */
  on(e, t) {
    const r = (i) => t(i.data || i);
    return this._listenerMap.has(e) || this._listenerMap.set(e, /* @__PURE__ */ new Map()), this._listenerMap.get(e).set(t, r), this._dispatcher.addEventListener(e, r), this;
  }
  /**
   * 一次性订阅事件（触发后自动取消订阅）
   * @param type 事件类型
   * @param listener 事件监听函数
   * @returns 当前实例（支持链式调用）
   * 
   * @example
   * event.once('load', () => {
   *   console.log('this will only trigger once');
   * });
   */
  once(e, t) {
    const r = (i) => {
      this.off(e, r), t(i.data || i);
    };
    return this.on(e, r);
  }
  /**
   * 取消订阅事件
   * @param type 事件类型
   * @param listener 要移除的事件监听函数
   * @returns 当前实例（支持链式调用）
   * 
   * @example
   * const handler = (data) => console.log(data);
   * event.on('message', handler);
   * event.off('message', handler);
   */
  off(e, t) {
    const r = this._listenerMap.get(e);
    if (!r) return this;
    const i = r.get(t);
    return i && (this._dispatcher.removeEventListener(e, i), r.delete(t), r.size === 0 && this._listenerMap.delete(e)), this;
  }
  /**
   * 触发事件
   * @param type 事件类型
   * @param data 要传递的事件数据（可选）
   * @returns 当前实例（支持链式调用）
   * 
   * @example
   * event.trigger('update', { time: Date.now() });
   */
  trigger(e, t) {
    const r = { type: e, data: t };
    return this._dispatcher.dispatchEvent(r), this;
  }
  /**
   * 获取原生Three.js事件分发器
   * @returns Three.js的EventDispatcher实例
   * 
   * @description
   * 用于与Three.js原生事件系统集成
   */
  get threeEventDispatcher() {
    return this._dispatcher;
  }
}
function Vd(s, e) {
  return s.replace(/\{(\w+)\}/g, (t, r) => {
    if (Object.prototype.hasOwnProperty.call(e, r)) {
      const i = e[r];
      return i !== void 0 ? String(i) : t;
    }
    throw new Error(`Missing required parameter for template interpolation: "${r}"`);
  });
}
function kl(s, ...e) {
  return Object.assign(s, ...e);
}
function dc(s) {
  return s == null;
}
function os(s) {
  return typeof s == "function";
}
function Ub(s = /* @__PURE__ */ new Date()) {
  const e = (u) => u.toString().padStart(2, "0"), t = s.getFullYear(), r = e(s.getMonth() + 1), i = e(s.getDate()), o = e(s.getHours()), l = e(s.getMinutes()), c = e(s.getSeconds());
  return `${t}-${r}-${i} ${o}:${l}:${c}`;
}
var kb = Object.defineProperty, zb = (s, e, t) => e in s ? kb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, zl = (s, e, t) => zb(s, typeof e != "symbol" ? e + "" : e, t);
class Nb {
}
class la extends bi(
  rn(Nb)
) {
  constructor(e) {
    super(), zl(this, "target"), zl(this, "dom"), zl(this, "_enabled", !1), this.target = e;
  }
  /**
   * 启用Handler
   *
   * @english
   * Enables the handler
   */
  enable() {
    return this._enabled ? this : (this._enabled = !0, this.addHooks(), this);
  }
  /**
   * 停用Handler
   *
   * @english
   * Disables the handler
   */
  disable() {
    return this._enabled ? (this._enabled = !1, this.removeHooks(), this) : this;
  }
  /**
   * 检查Handler是否启用
   *
   * @english
   * Returns true if the handler is enabled.
   */
  enabled() {
    return !!this._enabled;
  }
  /**
   * 从target上移除Handler
   *
   * @english
   * remove handler from target
   */
  remove() {
    this.disable(), delete this.target, delete this.dom;
  }
}
const Nl = Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]" && !process.versions.electron && !process.versions.nw && !process.versions["node-webkit"], Lf = () => typeof window > "u" ? 1 : window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI || 1, Hb = () => {
  if (Nl)
    return {
      IS_NODE: Nl,
      isTest: !1,
      ie: !1,
      ielt9: !1,
      edge: !1,
      webkit: !1,
      gecko: !1,
      android: !1,
      android23: !1,
      chrome: !1,
      chromeVersion: "0",
      safari: !1,
      phantomjs: !1,
      ie3d: !1,
      webkit3d: !1,
      opera12: !1,
      gecko3d: !1,
      any3d: !1,
      iosWeixin: !1,
      mobile: !1,
      mobileWebkit: !1,
      mobileWebkit3d: !1,
      mobileOpera: !1,
      mobileGecko: !1,
      touch: !1,
      msPointer: !1,
      pointer: !1,
      retina: !1,
      devicePixelRatio: 1,
      language: "en",
      ie9: !1,
      ie10: !1,
      webgl: !1,
      imageBitMap: !1,
      resizeObserver: !1,
      btoa: !1,
      decodeImageInWorker: !1,
      monitorDPRChange: !1,
      supportsPassive: !1,
      proxy: !1,
      requestIdleCallback: !1,
      checkDevicePixelRatio: () => !1
    };
  const s = navigator.userAgent.toLowerCase(), e = document.documentElement || { style: {} }, t = "ActiveXObject" in window, r = s.includes("webkit"), i = s.includes("phantom"), o = s.search("android [23]") !== -1, l = s.includes("chrome"), c = s.includes("gecko") && !r && !("opera" in window) && !t, u = /iphone/i.test(s) && /micromessenger/i.test(s), f = typeof orientation < "u" || s.includes("mobile"), p = !window.PointerEvent && "MSPointerEvent" in window, d = window.PointerEvent && navigator.pointerEnabled || p, g = t && "transition" in e.style, y = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !o, b = "MozPerspective" in e.style, T = "OTransition" in e.style, x = (g || y || b) && !T && !i, E = typeof window < "u" && os(window.createImageBitmap), M = typeof window < "u" && os(window.ResizeObserver), A = typeof window < "u" && os(window.btoa), D = typeof window < "u" && os(window.Proxy), z = typeof window < "u" && os(window.requestIdleCallback);
  let j = "0";
  if (l) {
    const K = s.match(/chrome\/([\d.]+)/);
    j = K ? K[1] : "0";
  }
  const V = !i && (d || "ontouchstart" in window || "DocumentTouch" in window && document instanceof window.DocumentTouch), R = typeof window < "u" && "WebGLRenderingContext" in window, G = Lf();
  let k = !1;
  try {
    new OffscreenCanvas(2, 2).getContext("2d"), k = !0;
  } catch {
    k = !1;
  }
  let B = !1;
  try {
    const K = Object.defineProperty({}, "passive", {
      get: () => (B = !0, !0)
    });
    window.addEventListener("testPassive", () => {
    }, K);
  } catch {
  }
  const $ = {
    IS_NODE: Nl,
    isTest: !1,
    ie: t,
    ielt9: t && !document.addEventListener,
    edge: "msLaunchUri" in navigator && !("documentMode" in document),
    webkit: r,
    gecko: c,
    android: s.includes("android"),
    android23: o,
    chrome: l,
    chromeVersion: j,
    safari: !l && s.includes("safari"),
    phantomjs: i,
    ie3d: g,
    webkit3d: y,
    gecko3d: b,
    opera12: T,
    any3d: x,
    iosWeixin: u,
    mobile: f,
    mobileWebkit: f && r,
    mobileWebkit3d: f && y,
    mobileOpera: f && "opera" in window,
    mobileGecko: f && c,
    touch: !!V,
    msPointer: !!p,
    pointer: !!d,
    retina: G > 1,
    devicePixelRatio: G,
    // @ts-ignore
    language: navigator.browserLanguage || navigator.language,
    // @ts-ignore
    ie9: t && document.documentMode === 9,
    // @ts-ignore
    ie10: t && document.documentMode === 10,
    webgl: R,
    imageBitMap: E,
    resizeObserver: M,
    btoa: A,
    decodeImageInWorker: k,
    monitorDPRChange: !0,
    supportsPassive: B,
    proxy: D,
    requestIdleCallback: z,
    checkDevicePixelRatio: () => {
      if (typeof window < "u" && $.monitorDPRChange) {
        const K = Lf(), Y = K !== $.devicePixelRatio;
        return Y && ($.devicePixelRatio = K), Y;
      }
      return !1;
    }
  };
  return $;
}, Vb = Hb();
var Wb = Object.defineProperty, Gb = (s, e, t) => e in s ? Wb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, pi = (s, e, t) => Gb(s, typeof e != "symbol" ? e + "" : e, t);
function bi(s) {
  return class extends s {
    constructor(...e) {
      super(...e), pi(this, "eventClass", new Cf()), pi(this, "on", this.eventClass.on.bind(this.eventClass)), pi(this, "trigger", this.eventClass.trigger.bind(this.eventClass)), pi(this, "off", this.eventClass.off.bind(this.eventClass)), this.eventClass = new Cf();
    }
  };
}
function rn(s) {
  return class extends s {
    constructor(...e) {
      super(...e), pi(this, "options"), pi(this, "_isUpdatingOptions"), pi(this, "_initHooksCalled"), pi(this, "_initHooks");
      const t = Object.getPrototypeOf(this).options || {}, r = kl({}, t, e[0] || {});
      this.setOptions(r), this.callInitHooks(), this._isUpdatingOptions = !1;
    }
    proxyOptions() {
      return Vb.proxy ? (this.options = new Proxy(this.options, {
        set: (e, t, r) => {
          if (t = t, e[t] === r || (e[t] = r, this._isUpdatingOptions))
            return !0;
          const i = {};
          return i[t] = r, this.config(i), !0;
        }
      }), this) : this;
    }
    callInitHooks() {
      const e = Object.getPrototypeOf(this);
      return this._visitInitHooks(e), this;
    }
    setOptions(e) {
      if ((!this.hasOwnProperty("options") || dc(this.options)) && (this.options = this.options ? Object.create(this.options) : {}), !e)
        return this;
      for (const t in e)
        this.options[t] = e[t];
      return this;
    }
    config(e, t) {
      if (this._isUpdatingOptions = !0, e) {
        if (arguments.length === 2 && typeof e == "string") {
          const r = {};
          r[e] = t, e = r;
        }
        e = e;
        for (const r in e)
          this.options[r] = e[r], this[r] && this[r] instanceof la && (e[r] ? this[r].enable() : this[r].disable());
        this.onConfig(e), this._isUpdatingOptions = !1;
      } else {
        const r = {};
        for (const i in this.options)
          this.options.hasOwnProperty(i) && (r[i] = this.options[i]);
        return this._isUpdatingOptions = !1, r;
      }
      return this;
    }
    onConfig(e) {
    }
    _visitInitHooks(e) {
      if (this._initHooksCalled)
        return;
      const t = Object.getPrototypeOf(e);
      t._visitInitHooks && t._visitInitHooks.call(this, t), this._initHooksCalled = !0;
      const r = e._initHooks;
      if (r && r !== t._initHooks)
        for (let i = 0; i < r.length; i++)
          r[i].call(this);
    }
    /**
     * 合并类选项（静态方法）
     * @param options 要合并的选项
     * @returns 类本身（支持链式调用）
     */
    static mergeOptions(e) {
      const t = this.prototype, r = Object.getPrototypeOf(t);
      return t.hasOwnProperty("options") ? t.options === r.options && (t.options = Object.create(t.options)) : t.options = {}, kl(t.options, e), this;
    }
    static addInitHook(e, ...t) {
      const r = typeof e == "function" ? e : function() {
        this[e].apply(this, t);
      }, i = this.prototype, o = Object.getPrototypeOf(i);
      return (!i._initHooks || i._initHooks === o._initHooks) && (i._initHooks = []), i._initHooks.push(r), this;
    }
    static include(...e) {
      for (let t = 0; t < e.length; t++)
        kl(this.prototype, e[t]);
      return this;
    }
  };
}
var jb = Object.defineProperty, $b = (s, e, t) => e in s ? jb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Be = (s, e, t) => $b(s, typeof e != "symbol" ? e + "" : e, t);
const Xb = bi(rn(_d));
class Yb extends Xb {
  /**
   * 构造函数
   * @param container 容器元素或选择器字符串
   * @param options 配置选项
   */
  constructor(e, t = {}) {
    super(), Be(this, "scene"), Be(this, "renderer"), Be(this, "camera"), Be(this, "controls"), Be(this, "ambLight"), Be(this, "dirLight"), Be(this, "auxDirLight"), Be(this, "clouds", null), Be(this, "container"), Be(this, "_clock", new ta()), Be(this, "stats"), Be(this, "_animationCallbacks", /* @__PURE__ */ new Set()), Be(this, "_fogFactor", 1), Be(this, "_sceneSize", 5e4 * 2), Be(this, "gorund"), Be(this, "map"), Be(this, "centerWorldPos"), Be(this, "_isInteracting", !1), Be(this, "debug", !1), Be(this, "flyTween", null), Be(this, "composer"), Be(this, "renderPass"), Be(this, "bloomPass"), Be(this, "calculateCameraPosition", (g, y, b, T) => {
      const x = new I(
        0,
        // X分量
        y * Math.cos(b),
        // Y分量
        y * Math.sin(b)
        // Z分量  <-- 这里改成正号
      );
      return x.applyAxisAngle(new I(0, 1, 0), T), new I(
        g.x + x.x,
        g.y + x.y,
        g.z + x.z
      );
    }), this.setOptions(t);
    const { antialias: r = !1, stencil: i = !0, logarithmicDepthBuffer: o = !0, skybox: l, map: c, bloom: u, minDistance: f, maxDistance: p, draggable: d = !0 } = t;
    if (this.map = c, this.centerWorldPos = this.map.projectToWorld(new I(this.map.center[0], this.map.center[1], 0)), this.renderer = this._createRenderer(r, i, o), this.scene = this._createScene(l), this.camera = this._createCamera(), e && this.addTo(e), this.controls = this._createControls(f, p), this.controls.enabled = d !== !1, this.ambLight = this._createAmbLight(), this.scene.add(this.ambLight), this.dirLight = this._createDirLight(), this.scene.add(this.dirLight), this.scene.add(this.dirLight.target), this.auxDirLight = this._createAuxDirLight(), this.gorund = this._createGorund(), this.scene.add(this.gorund), u && u.enabled) {
      const g = this.renderer.getPixelRatio(), y = this.container ? this.width : window.innerWidth, b = this.container ? this.height : window.innerHeight, T = y * g, x = b * g, E = new Cn(T, x, {
        format: od
      });
      E.samples = 4, this.composer = new xx(this.renderer, E), this.renderPass = new Sx(this.scene, this.camera), this.composer.addPass(this.renderPass);
      const M = u?.strength ?? 1.5, A = u?.radius ?? 1, D = u?.threshold ?? 0.7;
      this.bloomPass = new mx(
        new ce(T, x),
        M,
        A,
        D
      ), this.composer.addPass(this.bloomPass);
    }
    this.renderer.setAnimationLoop(this.animate.bind(this)), this.debug = t.debug || !1, this.flyTween = null, this.debug && (this.stats = new Ms(), document.body.appendChild(this.stats.dom));
  }
  /**
   * 获取雾效因子
   */
  get fogFactor() {
    return this._fogFactor;
  }
  get isInteracting() {
    return this._isInteracting;
  }
  /**
   * 设置雾效因子（默认1）
   */
  set fogFactor(e) {
    this._fogFactor = e, this.controls.dispatchEvent({
      type: "change",
      target: this.controls
    });
  }
  /**
   * 获取容器宽度
   */
  get width() {
    return this.container?.clientWidth || 0;
  }
  /**
   * 获取容器高度
   */
  get height() {
    return this.container?.clientHeight || 0;
  }
  /**
   * Add renderer to container
   * 将渲染器添加到容器
   * @param container Container element or selector string 容器元素或选择器字符串
   * @returns this
   */
  addTo(e) {
    let t = null;
    if (typeof e == "string" ? t = document.getElementById(e) || document.querySelector(e) : t = e, t instanceof HTMLElement)
      this.container = t, t.appendChild(this.renderer.domElement), new ResizeObserver(this.resize.bind(this)).observe(t);
    else
      throw `${e} not found!`;
    return this;
  }
  /**
   * 创建场景
   * @param skyboxConfig 天空盒配置
   * @returns 场景对象
   */
  // private _createScene(skyboxConfig?: ViewerOptions['skybox']) {
  //     const scene = new Scene();
  //     const backColor = skyboxConfig?.defaultColor || 'rgb(21,48,94)';
  //     scene.background = new Color(backColor);
  //     scene.fog = new FogExp2(backColor, 0.0002);
  //     if (skyboxConfig?.files) {
  //         const loader = new CubeTextureLoader();
  //         if (skyboxConfig.path) {
  //             loader.setPath(skyboxConfig.path);
  //         }
  //         loader.load(
  //             skyboxConfig.files,
  //             (texture) => {
  //                 // 💥 关键步骤 1: 创建 PMREMGenerator 实例 (需要 renderer)
  //                 const pmremGenerator = new PMREMGenerator(this.renderer);
  //                 pmremGenerator.compileCubemapShader(); // 优化编译（可选）
  //                 // 💥 关键步骤 2: 将 CubeTexture 转换为 PBR 优化的环境贴图
  //                 const envMap = pmremGenerator.fromCubemap(texture).texture;
  //                 // 设置场景背景和环境贴图
  //                 scene.background = texture;    // 背景仍使用原始 CubeTexture
  //                 scene.environment = envMap;    // 环境反射使用处理后的 envMap
  //                 // 关键步骤 3: 释放资源
  //                 pmremGenerator.dispose();
  //                 // 原始 texture 仍然被 scene.background 引用，所以不能立刻 dispose()
  //             },
  //             undefined,
  //             (error) => {
  //                 console.error('Error loading skybox:', error);
  //                 scene.background = new Color(backColor);
  //             }
  //         );
  //     } else if (skyboxConfig?.hdr) {
  //         this._loadHDRWithPMREM(scene, skyboxConfig);
  //     }
  //     return scene;
  // }
  /**
   * Create scene
   * 创建场景
   * @param skyboxConfig Skybox configuration 天空盒配置
   * @returns Scene object 场景对象
   */
  _createScene(e) {
    const t = new l1(), r = e?.defaultColor || "rgb(21,48,94)";
    if (t.background = new oe(r), t.fog = new sf(r, 2e-4), e?.files) {
      const i = new c1();
      e.path && i.setPath(e.path), i.load(
        e.files,
        (o) => {
          t.background = o;
        },
        void 0,
        (o) => {
          console.error("Error loading skybox:", o), t.background = new oe(r);
        }
      );
    } else e?.hdr && this._loadHDRWithPMREM(t, e);
    return t;
  }
  /**
   * 使用PMREM加载HDR环境贴图
   * @param scene 场景对象
   * @param skyboxConfig 天空盒配置
   */
  async _loadHDRWithPMREM(e, t) {
    try {
      if (t) {
        const i = await new Ab().setPath(t.path || "").setDataType(Zo).loadAsync(t.hdr);
        i.colorSpace = this.renderer.outputColorSpace, i.mapping = 303, i.needsUpdate = !0, e.background = i, e.environment = i;
      }
    } catch (r) {
      console.error("加载HDR失败:", r), e.background = new oe(t?.defaultColor || 14414079);
    }
  }
  /**
   * 创建WebGL渲染器
   * @param antialias 是否抗锯齿
   * @param stencil 是否使用模板缓冲区
   * @param logarithmicDepthBuffer 是否使用对数深度缓冲区
   * @returns 渲染器对象
   */
  _createRenderer(e, t, r) {
    const i = new u1({
      antialias: e,
      logarithmicDepthBuffer: r,
      stencil: t,
      alpha: !0,
      precision: "highp",
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: !0
    });
    return i.debug.checkShaderErrors = !0, i.sortObjects = !0, i.setPixelRatio(window.devicePixelRatio), i.domElement.tabIndex = 0, i.shadowMap.enabled = !0, i.shadowMap.needsUpdate = !0, i.shadowMap.type = h1, i.toneMapping = f1, i.toneMappingExposure = 1, i.outputColorSpace = na, i;
  }
  /**
   * Create camera
   * 创建相机
   * @returns Camera object 相机对象
   */
  _createCamera() {
    return new qi(45, this.getAspect(), 0.1, this._sceneSize * 2);
  }
  /**
   * Create map controls
   * 创建地图控制器
   * @param minDistance Minimum zoom distance 最小缩放距离
   * @param maxDistance Maximum zoom distance 最大缩放距离
   * @returns Controls object 控制器对象
   */
  _createControls(e, t) {
    const r = new ax(this.camera, this.renderer.domElement), i = Math.PI / 2.1;
    return r.screenSpacePanning = !1, r.minDistance = e ?? 0.1, r.maxDistance = t ?? 6e4, r.maxPolarAngle = i, r.enableDamping = !0, r.dampingFactor = 0.08, r.keyPanSpeed = 1, r.listenToKeyEvents(this.renderer.domElement), r.addEventListener("change", () => {
      const o = Math.max(r.getPolarAngle(), 0.1), l = Math.max(r.getDistance(), 100);
      r.zoomSpeed = Math.max(Math.log(l / 1e3), 1) + 3;
      const c = 3e5 * 2;
      r.maxDistance > c * 0.95 && (r.maxDistance = c * 0.95), this.camera.far = lt.clamp(l / o * 8, 100, c), this.camera.near = lt.clamp(this.camera.far / 1e3, 1e-3, 1), this.camera.updateProjectionMatrix(), this.scene.fog instanceof sf && (this.scene.fog.density = o / (l + 5) * this.fogFactor * 0.1);
      const f = l > 6e4;
      r.minAzimuthAngle = f ? 0 : -1 / 0, r.maxAzimuthAngle = f ? 0 : 1 / 0, r.maxPolarAngle = Fb(r.getDistance(), 0, 7e4, i, 0), this.map?.trigger("control-change", {
        type: "control-change",
        control: r,
        camera: this.camera,
        target: this.map
      });
    }), r.addEventListener("start", () => {
      this._isInteracting = !0, this.map?.trigger("control-start", {
        type: "control-start",
        control: r,
        camera: this.camera,
        target: this.map
      });
    }), r.addEventListener("end", () => {
      this._isInteracting = !1, this.map?.trigger("control-end", {
        type: "control-end",
        control: r,
        camera: this.camera,
        target: this.map
      });
    }), r;
  }
  /**
   * Create ambient light
   * 创建环境光
   * @returns Ambient light object 环境光对象
   */
  _createAmbLight() {
    return new gd(16777215, 2);
  }
  /**
   * 创建平行光
   * @returns 平行光对象
   */
  _createDirLight() {
    const d = new Jo("rgb(255, 255, 255)", 10);
    d.position.set(this.centerWorldPos.x + 55e3 * 1.2, 55e3 * 2, this.centerWorldPos.z + 55e3 * 1);
    const g = new mr();
    if (g.position.copy(this.centerWorldPos), this.scene.add(g), d.target = g, d.castShadow = !0, d.shadow.mapSize.width = 1024 * 10, d.shadow.mapSize.height = 1024 * 10, d.shadow.camera.near = 1, d.shadow.camera.far = 192500, d.shadow.camera.left = -55e3, d.shadow.camera.bottom = -55e3, d.shadow.camera.top = 55e3, d.shadow.camera.right = 55e3, d.shadow.radius = 1, d.shadow.bias = -0, this.debug) {
      const y = new d1(d.shadow.camera);
      y.name = "dirLightCameraHelper", this.scene.add(y);
    }
    return d;
  }
  /**
   * 创建三个辅助平行光 (后补光、左侧光、右侧光)，指向场景中心。
   * @returns 返回后补光实例 (匹配 this.auxDirLight 属性)
   */
  _createAuxDirLight() {
    const l = this._createAuxLightInstance(
      this.centerWorldPos.x + -66e3,
      82500,
      this.centerWorldPos.z + -55e3,
      0.5
    );
    l.name = "AuxDirLight_BackFill", this.scene.add(l), this.scene.add(l.target);
    const p = this._createAuxLightInstance(
      this.centerWorldPos.x + 55e3 * -1,
      55e3 * 1.5,
      this.centerWorldPos.z + 55e3 * 1.2,
      0.5
    );
    p.name = "AuxDirLight_LeftRim", this.scene.add(p), this.scene.add(p.target);
    const y = this._createAuxLightInstance(
      this.centerWorldPos.x + 55e3 * 1,
      55e3 * 1.5,
      this.centerWorldPos.z + 55e3 * -1.2,
      0.5
    );
    return y.name = "AuxDirLight_RightRim", this.scene.add(y), this.scene.add(y.target), l;
  }
  /**
   * Create a single auxiliary directional light instance.
   * 创建单个辅助平行光实例。
   * @param x Light source world X coordinate 光源的世界X坐标
   * @param y Light source world Y coordinate 光源的世界Y坐标
   * @param z Light source world Z coordinate 光源的世界Z坐标
   * @param intensity Light intensity 光源强度
   * @returns DirectionalLight
   */
  _createAuxLightInstance(e, t, r, i) {
    const o = new Jo(16777215, i);
    o.position.set(e, t, r);
    const l = new mr();
    return l.position.copy(this.centerWorldPos), this.scene.add(l), o.target = l, o.castShadow = !1, o;
  }
  /**
   * Resize container
   * 调整容器大小
   * @returns this
   */
  resize() {
    const e = this.width, t = this.height;
    if (this.renderer.setSize(e, t), this.camera.aspect = e / t, this.camera.updateProjectionMatrix(), this.composer) {
      const r = this.renderer.getPixelRatio();
      this.composer.setSize(e * r, t * r), this.composer.render();
    } else
      this.renderer.render(this.scene, this.camera);
    return this;
  }
  /**
   * 添加动画回调
   * @param callback 回调函数，接收deltaTime和elapsedTime参数
   * @returns 移除回调的函数
   */
  addAnimationCallback(e) {
    return this._animationCallbacks.add(e), () => this._animationCallbacks.delete(e);
  }
  /**
   * 动画循环
   */
  animate() {
    const e = this._clock.getDelta(), t = this._clock.getElapsedTime();
    this._animationCallbacks.forEach((r) => r(e, t, this)), this.controls.update(), this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera), Ib(), this.stats && this.stats.update(), this.trigger("update", { delta: e });
  }
  /**
   * Fly to specified position
   * 飞行到指定位置
   * @param centerWorldPos Map center target position (world coordinates) 地图中心目标位置（世界坐标）
   * @param cameraWorldPos Camera target position (world coordinates) 相机目标位置（世界坐标）
   * @param animate Whether to enable animation 是否启用动画
   * @param onComplete Completion callback 完成回调
   */
  flyTo(e, t, r = !0, i) {
    if (this.controls.target.copy(e), r) {
      const o = this.camera.position;
      new Ro(o).to({ y: 2e7, z: 0 }, 500).chain(
        new Ro(o).to(t, 2e3).easing(gi.Quintic.Out).onComplete((l) => i && i(l))
      ).start();
    } else
      this.camera.position.copy(t);
  }
  /**
  * Advanced fly to specified position method
  * 高级飞行到指定位置的方法
  * 
  * Supports both straight and curved flight paths, allowing customization of flight duration, delay, and completion callback.
  * Achieves smooth camera movement and view transition via Tween animation.
  * 支持直线和曲线两种飞行路径，可以自定义飞行持续时间、延迟和完成回调。
  * 通过Tween动画实现平滑的相机移动和视角过渡。
  * 
  * @param options - Flight configuration options 飞行配置选项
  * @param options.center - Target center point longitude and latitude coordinates 目标中心点的经纬度坐标
  * @param options.cameraCoord - Camera target position longitude and latitude coordinates 相机目标位置的经纬度坐标
  * @param options.duration - Flight animation duration (ms), default 2000ms 飞行动画持续时间（毫秒），默认2000ms
  * @param options.delay - Delay before flight starts (ms), default 0ms 开始飞行前的延迟时间（毫秒），默认0ms
  * @param options.complete - Callback function when flight completes 飞行完成时的回调函数
  * @param options.curvePath - Whether to use curved flight path, true for cubic Bezier curve, false for straight line (default) 是否使用曲线路径飞行，true为三次贝塞尔曲线，false为直线（默认）
  * 
  * 
  * @remarks
  * - If there is an ongoing flight animation, it will be stopped automatically
  * - Camera position, view, and target point will be updated during flight
  * - Curved path uses cubic Bezier curve, control points are automatically generated
  * - Longitude and latitude coordinates will be automatically converted to world coordinates
  * - 如果之前有正在进行的飞行动画，会自动停止
  * - 飞行过程中会更新相机位置、视角和目标点
  * - 曲线路径使用三次贝塞尔曲线，控制点自动生成
  * - 经纬度坐标会自动转换为世界坐标
  * 
  * @throws Returns silently when center or cameraCoord parameters are invalid, no exception thrown 当center或cameraCoord参数无效时静默返回，不抛出异常
  */
  flyToAdvanced(e) {
    const t = this.camera, r = this.controls, i = e.center, o = e.cameraCoord, l = e.duration ?? 2e3, c = e.delay ?? 0, u = e.complete, f = !!e.curvePath;
    if (!i || !o) return;
    const p = this.map.projectToWorld(new I(i[0], i[1], 0)), d = this.map.projectToWorld(new I(o[0], o[1], o[2]));
    if (!t || !r || !p || !d) return;
    const g = r.target.clone(), y = t.position.clone(), b = new I(p.x, p.y, p.z), T = new I(d.x, d.y, d.z);
    if (this.flyTween && (this.flyTween.stop(), this.flyTween = null), f) {
      const x = [
        y,
        y.clone().lerp(T, 0.33),
        y.clone().lerp(T, 0.67),
        T
      ], E = new p1(...x), M = {
        t: 0,
        x: g.x,
        y: g.y,
        z: g.z
      };
      this.flyTween = new Ro(M).to(
        {
          t: 1,
          x: b.x,
          y: b.y,
          z: b.z
        },
        l
      ).easing(gi.Quadratic.InOut).onUpdate(() => {
        const A = E.getPoint(M.t), D = new I(M.x, M.y, M.z);
        t.position.copy(A), t.lookAt(D), t.updateProjectionMatrix(), r.target.copy(D), r.update();
      });
    } else {
      const x = {
        tx: g.x,
        ty: g.y,
        tz: g.z,
        px: y.x,
        py: y.y,
        pz: y.z
      };
      this.flyTween = new Ro(x).to(
        {
          tx: b.x,
          ty: b.y,
          tz: b.z,
          px: T.x,
          py: T.y,
          pz: T.z
        },
        l
      ).easing(gi.Quadratic.InOut).onUpdate(() => {
        const E = new I(x.tx, x.ty, x.tz), M = new I(x.px, x.py, x.pz);
        t.position.copy(M), t.lookAt(E), r.target.copy(E), r.update();
      });
    }
    this.flyTween && (this.flyTween.onComplete(() => {
      this.flyTween && (this.flyTween.stop(), this.flyTween = null), u && u();
    }), c > 0 ? setTimeout(() => {
      this.flyTween && this.flyTween.start();
    }, c) : this.flyTween.start());
  }
  /**
   * Configuration update callback
   * 配置更新回调
   * Triggered when viewer.config() is called to update configuration
   * 当调用 viewer.config() 更新配置时，会触发此方法
   */
  onConfig(e) {
    if ("draggable" in e) {
      const t = e.draggable;
      this.controls && (this.controls.enabled = t !== !1);
    }
  }
  /**
   * 飞行到指定点，自动计算相机位置
   * @param center 目标点的经纬度坐标
   * @param options 飞行选项
   */
  flyToPoint(e) {
    const { controls: t } = this, r = e.center, i = e.duration ?? 2e3, o = typeof e.distance == "number" ? e.distance : typeof e.altitude == "number" ? e.altitude : t.getDistance(), l = (b) => b * Math.PI / 180;
    let c;
    if (typeof e.polarDeg == "number") {
      const b = e.polarDeg <= 0 ? 0.1 : e.polarDeg;
      c = l(b);
    } else typeof e.polarAngle == "number" ? c = e.polarAngle <= 0 ? l(0.1) : e.polarAngle : c = t.getPolarAngle();
    const u = typeof e.azimuthDeg == "number" ? l(e.azimuthDeg) : e.azimuthAngle || t.getAzimuthalAngle(), f = e.complete, p = !!e.curvePath, d = this.map.projectToWorld(new I(r[0], r[1], 0)), g = this.calculateCameraPosition(d, o, c, u), y = this.map.unprojectFromWorld(g);
    this.flyToAdvanced({
      center: [r[0], r[1], 0],
      cameraCoord: [y.x, y.y, y.z || 0],
      duration: i,
      complete: f,
      curvePath: p
    });
  }
  /**
   * Get current scene state
   * 获取当前场景状态
   * @returns Object containing center position and camera position 包含中心位置和相机位置的对象
   */
  getState() {
    return {
      centerPosition: this.controls.target,
      cameraPosition: this.camera.position
    };
  }
  /**
  * Bind map instance
  * 绑定地图实例
  * @param map Map instance 地图实例
  * 
  * @protected
  */
  _bindMap(e) {
    e && (this.map = e);
  }
  /**
  * Get associated map instance
  * 获取关联的地图实例
  * @returns Map instance or null 地图实例或null
  */
  getMap() {
    return this.map ? this.map : null;
  }
  // dt的方法
  /**
  * Get current browser window aspect ratio.
  * 获取当前浏览器窗口的宽高比（aspect ratio）。
  * @returns {number} Aspect ratio (width / height), e.g., returns ~1.777 for 16:9 screen. 宽高比（width / height），例如 16:9 的屏幕返回 ~1.777。
  */
  getAspect() {
    const [e, t] = this.getWidthHeight();
    return e / t;
  }
  /**
   * 获取当前浏览器窗口的实际宽度和高度（视口尺寸）。
   * @returns {Array<number>} 包含宽度和高度的数组 [width, height]，单位是像素。
   */
  getWidthHeight() {
    let e = window.innerWidth, t = window.innerHeight;
    return [e, t];
  }
  _createGorund() {
    const e = this.centerWorldPos, t = new Os({
      transparent: !1,
      color: new oe("rgb(45,52,60)").multiplyScalar(0.7),
      metalness: 0.2,
      roughness: 1
    }), r = new Fn(this._sceneSize * 2, this._sceneSize * 2), i = new Ue(r, t);
    return i.name = "地面", i.castShadow = !1, i.receiveShadow = !1, i.position.y = 0, i.position.add(e), i.rotateX(-Math.PI / 2), i.visible = !1, i;
  }
  /**
   * 销毁viewer实例，释放所有资源
   * @description
   * 该方法会清理以下资源：
   * 1. 停止动画循环
   * 2. 销毁控制器
   * 3. 清理场景中的所有对象
   * 4. 销毁渲染器
   * 5. 销毁后期处理器
   * 6. 移除DOM元素
   */
  destroy() {
    try {
      this.renderer.setAnimationLoop(null), this._animationCallbacks.clear(), this.map = null, this.controls && this.controls.dispose(), this.scene && (this.scene.traverse((e) => {
        e.geometry && e.geometry.dispose(), e.material && (Array.isArray(e.material) ? e.material.forEach((t) => {
          this._disposeMaterial(t);
        }) : this._disposeMaterial(e.material));
      }), this.scene.clear()), this.composer && (this.bloomPass && this.bloomPass.dispose?.(), this.renderPass && this.renderPass.dispose?.(), this.composer = null, this.renderPass = null, this.bloomPass = null), this.renderer && (this.renderer.dispose(), this.container && this.renderer.domElement.parentNode === this.container && this.container.removeChild(this.renderer.domElement)), this.stats && this.stats.dom.parentNode && this.stats.dom.parentNode.removeChild(this.stats.dom);
    } catch (e) {
      console.error("❌ 销毁Viewer时出错:", e);
    }
  }
  /**
   * Dispose material resources
   * 销毁材质资源
   * @param material Material to dispose 要销毁的材质
   */
  _disposeMaterial(e) {
    if (!e) return;
    [
      "map",
      "lightMap",
      "bumpMap",
      "normalMap",
      "specularMap",
      "envMap",
      "alphaMap",
      "aoMap",
      "displacementMap",
      "emissiveMap",
      "gradientMap",
      "metalnessMap",
      "roughnessMap"
    ].forEach((r) => {
      e[r] && e[r].dispose();
    }), e.dispose();
  }
}
var Zb = Object.defineProperty, Kb = (s, e, t) => e in s ? Zb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, qb = (s, e, t) => Kb(s, e + "", t);
function xc(s) {
  return class extends s {
    constructor(...t) {
      super(...t), qb(this, "_handlers"), this._handlers = [];
    }
    /**
     * Register a handler
     * 注册处理器
     * @param {String} name       - name of the handler 处理器名称
     * @param {Handler}           - handler class 处理器类
     * @return {*} this
     * @protected
     * @function Handerable.addHandler
     */
    addHandler(t, r) {
      if (!r)
        return this;
      if (this._handlers || (this._handlers = []), this[t])
        return this[t].enable(), this;
      const i = this[t] = new r(this);
      return this._handlers.push(i), this.options[t] && i.enable(), this;
    }
    /**
     * Removes a handler
     * @param {String} name       - name of the handler
     * @return {*} this
     * @protected
     * @function Handerable.removeHandler
     */
    removeHandler(t) {
      if (!t)
        return this;
      const r = this[t];
      if (r && this._handlers) {
        const i = this._handlers.indexOf(r);
        i >= 0 && this._handlers.splice(i, 1), this[t].remove(), delete this[t];
      }
      return this;
    }
    //@internal
    _clearHandlers() {
      if (this._handlers) {
        for (let t = 0, r = this._handlers.length; t < r; t++)
          this._handlers[t].remove();
        this._handlers = [];
      }
    }
  };
}
var Qb = Object.defineProperty, Jb = (s, e, t) => e in s ? Qb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Vi = (s, e, t) => Jb(s, typeof e != "symbol" ? e + "" : e, t);
const eT = {
  attribution: "",
  visible: !0,
  opacity: 1,
  zIndex: 0,
  isSceneLayer: !1,
  altitude: 0
  // Default altitude is 0 默认高度为0
};
class ca extends xc(bi(
  rn(Qt)
)) {
  /**
   * Create a layer instance.
   * 创建图层实例
   * @param layerId - Layer ID. 图层ID
   * @param config - Layer configuration. 图层配置
   * @throws Throws error if id is not provided. 如果未提供id会抛出错误
   */
  constructor(e, t) {
    super(), Vi(this, "_layerId"), Vi(this, "opacity", 1), Vi(this, "_animCallbacks", /* @__PURE__ */ new Set()), Vi(this, "isSceneLayer", !1), Vi(this, "_baseAltitude", 0), Vi(this, "depthOffset"), Vi(this, "_regionConfigs", []), wc(e, "id", "Layer ID must be specified 图层ID必须指定"), t && (this.setOptions(t), this.opacity = t.opacity || 1, this.isSceneLayer = t.isSceneLayer ?? !1, t.altitude !== void 0 && this.setAltitude(t.altitude)), this._layerId = e, typeof this.animate == "function" && this._registerAnimate();
  }
  /**
   * Get layer ID.
   * 获取图层ID
   * @returns Layer ID
   *          图层ID
   */
  getId() {
    return this._layerId;
  }
  /**
   * Add layer to map.
   * 将图层添加到地图
   * @param mapInstance Map instance
   *            地图实例
   * @returns this
   */
  addTo(e) {
    return e.addLayer(this), this;
  }
  /**
   * Get layer z-index.
   * 获取图层层级
   * @returns Current z-index
   *          当前层级
   */
  getZIndex() {
    const e = this.options || {};
    return typeof e.zIndex == "number" ? e.zIndex : 0;
  }
  /**
   * Get layer depth offset.
   * 获取图层深度偏移
   * @returns Current layer depthOffset
   *          当前图层的 depthOffset
   */
  getDepthOffset() {
    const e = this.options || {};
    return typeof e.depthOffset == "number" ? e.depthOffset : 0;
  }
  /**
   * Get layer opacity.
   * 获取图层透明度
   * @returns Current opacity
   *          当前透明度
   */
  getOpacity() {
    return this.opacity;
  }
  /**
   * Set layer opacity.
   * 设置图层透明度
   * @param val Opacity value (0-1)
   *                透明度值 (0-1)
   * 
   * @description
   * Recursively update opacity of all child elements, including:
   * - Objects with material property
   * - Special types like Sprite
   * 
   * 递归更新所有子元素的透明度，包括：
   * - 带有material属性的对象
   * - Sprite等特殊类型
   */
  setOpacity(e) {
    this.opacity = e, this.traverse((t) => {
      "material" in t && (Array.isArray(t.material) ? t.material : [t.material]).forEach((i) => {
        "opacity" in i && (i.transparent = e < 1, i.opacity = e, i.needsUpdate = !0);
      }), t instanceof tn && (t.material.opacity = e, t.material.transparent = e < 1, t.material.needsUpdate = !0);
    });
  }
  /**
   * Get associated map instance.
   * 获取关联的地图实例
   * @returns Map instance or null
   *          地图实例或null
   */
  getMap() {
    return this.map ? this.map : null;
  }
  /**
   * Show layer.
   * 显示图层
   * @returns this
   */
  show() {
    return this.visible || (this.visible = !0, this.options.visible = !0, this.getMap()), this;
  }
  /**
   * Hide layer.
   * 隐藏图层
   * @returns this
   */
  hide() {
    return this.visible && (this.visible = !1, this.options.visible = !1, this.getMap()), this;
  }
  /**
   * Set layer altitude.
   * 设置图层高度 (海拔)
   * @param val Altitude value
   *                 高度值
   * @description 
   * Modify layer position in vertical direction.
   * 修改图层在垂直方向上的位置。
   */
  setAltitude(e) {
    return this.position.y = e, this.updateMatrix(), this.updateMatrixWorld(!0), this;
  }
  /**
   * Get current layer altitude.
   * 获取当前图层高度
   * @returns Altitude value
   *          高度值
   */
  getAltitude() {
    return this.position.y;
  }
  /**
   * Bind map instance.
   * 绑定地图实例
   * @param mapInstance Map instance
   *            地图实例
   *
   * @protected
   */
  _bindMap(e) {
    e && (this.map = e, typeof this.animate == "function" && this._registerAnimate());
  }
  /**
   * Register animation callback.
   * 注册动画回调
   * 
   * @private
   */
  _registerAnimate() {
    const e = this.getMap();
    if (!e?.viewer) return;
    const t = e.viewer.addAnimationCallback((r, i, o) => {
      this.animate?.(r, i, o);
    });
    this._animCallbacks.add(t);
  }
  /**
   * Clear animation callbacks.
   * 清除动画回调
   * 
   * @protected
   */
  _clearAnimationCallbacks() {
    this._animCallbacks.forEach((e) => e()), this._animCallbacks.clear();
  }
  /**
   * Get layer configuration.
   * 获取图层配置
   * @returns Layer configuration
   *          图层配置
   */
  getOptions() {
    return { ...this.options };
  }
  /**
   * Batch set region overlays.
   * 批量设置区域蒙版
   * @param configs Region overlay configuration array
   *                 区域蒙版配置数组
   */
  setRegionOverlays(e) {
    return this._regionConfigs = (e || []).map((t) => ({
      id: t.id ?? this._generateRegionOverlayId(),
      color: t.color ?? "#00FF88",
      opacity: t.opacity ?? 0.3,
      mode: t.mode ?? "overlay",
      zIndex: t.zIndex ?? 0,
      geometry: t.geometry,
      feature: t.feature
    })), this;
  }
  /**
   * Add a single region overlay.
   * 添加单个区域蒙版
   * @param overlay Region overlay configuration
   *                区域蒙版配置
   * @returns Generated overlay ID
   *          生成的蒙版 id
   */
  addRegionOverlay(e) {
    const t = e.id ?? this._generateRegionOverlayId(), r = {
      id: t,
      color: e.color ?? "#00FF88",
      opacity: e.opacity ?? 0.3,
      mode: e.mode ?? "overlay",
      zIndex: e.zIndex ?? 0,
      geometry: e.geometry,
      feature: e.feature
    };
    return this._regionConfigs.push(r), t;
  }
  /**
   * Remove region overlay by ID.
   * 移除指定 id 的区域蒙版
   * @param id Region overlay ID
   *           区域蒙版 id
   */
  removeRegionOverlay(e) {
    return this._regionConfigs = this._regionConfigs.filter((t) => t.id !== e), this;
  }
  /**
   * Clear all region overlays.
   * 清空所有区域蒙版
   */
  clearRegionOverlays() {
    return this._regionConfigs = [], this;
  }
  /**
   * Get all current region overlays (Returns a copy to avoid direct external modification).
   * 获取当前所有区域蒙版（返回副本，避免外部直接修改）
   */
  getRegionOverlays() {
    return this._regionConfigs.slice();
  }
  /**
   * Generate region overlay ID.
   * 生成区域蒙版 id
   */
  _generateRegionOverlayId() {
    return `region-overlay-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
ca.mergeOptions(eT);
var tT = Object.defineProperty, rT = (s, e, t) => e in s ? tT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, vs = (s, e, t) => rT(s, typeof e != "symbol" ? e + "" : e, t);
const Wd = class Gd {
  constructor(e) {
    vs(this, "cache", /* @__PURE__ */ new Map()), vs(this, "gltfLoader"), vs(this, "fbxLoader"), vs(this, "dracoLoader"), this.gltfLoader = new Ax(e), this.fbxLoader = new pb(e);
  }
  /**
   * 获取单例实例
   * @param manager 
   */
  static getInstance(e) {
    return this.instance || (this.instance = new Gd(e)), this.instance;
  }
  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }
  /**
   * 加载模型
   * @param options 模型样式配置
   */
  async load(e) {
    const t = `${e.type}:${e.url}`;
    if (this.cache.has(t))
      return this.cloneCachedModel(t, e);
    e.type === "gltf" && e.dracoOptions?.enable && this.ensureDracoLoader(e.dracoOptions.decoderPath);
    let r, i;
    try {
      if (e.type === "gltf") {
        const o = await this.gltfLoader.loadAsync(e.url);
        r = o.scene, i = o.animations;
      } else
        r = await this.fbxLoader.loadAsync(e.url), i = r.animations;
      return this.cache.set(t, { model: r, animations: i }), {
        model: this.processModel(r.clone(), e),
        animations: this.processAnimations(i)
      };
    } catch (o) {
      throw console.error(`[ExternalModelLoader] Failed to load ${e.type} model from ${e.url}:`, o), o;
    }
  }
  /**
   * 确保 Draco 加载器已初始化
   * @param decoderPath 
   */
  ensureDracoLoader(e = "/draco/") {
    this.dracoLoader || (this.dracoLoader = new Pb(), this.dracoLoader.setDecoderPath(e), this.gltfLoader.setDRACOLoader(this.dracoLoader));
  }
  /**
   * 克隆缓存的模型
   * @param cacheKey 
   * @param options 
   */
  cloneCachedModel(e, t) {
    const r = this.cache.get(e), i = r.model.clone();
    return {
      model: this.processModel(i, t),
      animations: this.processAnimations(r.animations)
    };
  }
  /**
   * 处理动画数据 (标准化)
   * @param animations 
   */
  processAnimations(e) {
    return e?.map((t) => ({
      ...t,
      name: t.name || "unnamed"
    })) || [];
  }
  /**
   * 处理模型变换 (位置、缩放、旋转)
   * @param model 
   * @param options 
   */
  processModel(e, t) {
    if (t.position && e.position.copy(t.position), t.scale)
      if (typeof t.scale == "number")
        e.scale.setScalar(t.scale);
      else {
        const { x: r, y: i, z: o } = t.scale;
        r !== void 0 && (e.scale.x = r), i !== void 0 && (e.scale.y = i), o !== void 0 && (e.scale.z = o);
      }
    return t.rotation && e.rotation.setFromVector3(t.rotation), e;
  }
};
vs(Wd, "instance");
let jd = Wd;
const Hl = (s, e) => {
  "updateRanges" in s ? s.updateRanges[0] = e : s.updateRange = e;
}, Of = /* @__PURE__ */ new xe(), Bo = /* @__PURE__ */ new I(), Uo = /* @__PURE__ */ new pr(), Df = /* @__PURE__ */ new I(), If = /* @__PURE__ */ new pr(), as = /* @__PURE__ */ new I(), iT = (s) => class extends s {
  constructor() {
    super();
    const e = parseInt(id.replace(/\D+/g, "")) >= 154 ? "opaque_fragment" : "output_fragment";
    this.onBeforeCompile = (t) => {
      t.vertexShader = `attribute float cloudOpacity;
               varying float vOpacity;
              ` + t.vertexShader.replace("#include <fog_vertex>", `#include <fog_vertex>
                 vOpacity = cloudOpacity;
                `), t.fragmentShader = `varying float vOpacity;
              ` + t.fragmentShader.replace(`#include <${e}>`, `#include <${e}>
                 gl_FragColor = vec4(outgoingLight, diffuseColor.a * vOpacity);
                `);
    };
  }
};
class nT extends Qt {
  constructor({
    limit: e = 200,
    range: t,
    material: r = md,
    texture: i,
    frustumCulled: o = !0
  } = {}) {
    super(), this.name = "Clouds", this.ref = this;
    const l = this, c = new Fn(1, 1), u = new Float32Array(Array.from({
      length: e
    }, () => 1)), f = new Float32Array(Array.from({
      length: e
    }, () => [1, 1, 1]).flat()), p = new Ql(u, 1);
    p.setUsage(of), c.setAttribute("cloudOpacity", p);
    const d = iT(r), g = new d();
    g.map = i, g.transparent = !0, g.depthWrite = !1, g.needsUpdate = !0, this.cloudMaterial = g, this.instance = new _c(c, g, e);
    const y = this.instance;
    y.matrixAutoUpdate = !1, y.frustumCulled = o, y.instanceColor = new Ql(f, 3), y.instanceColor.setUsage(of), l.add(y);
    const b = [], T = () => {
      const V = b.length;
      let R = 0;
      for (let G = 0; G < this.ref.children.length; G++) {
        const k = this.ref.children[G];
        k.cloudStateArray && (R += k.cloudStateArray.length);
      }
      if (V === R)
        return b;
      b.length = 0;
      for (let G = 0; G < this.ref.children.length; G++) {
        const k = this.ref.children[G];
        k.cloudStateArray && b.push(...k.cloudStateArray);
      }
      return x(), b;
    }, x = () => {
      const V = Math.min(e, t !== void 0 ? t : e, b.length);
      y.count = V, Hl(y.instanceMatrix, {
        offset: 0,
        count: V * 16
      }), y.instanceColor && Hl(y.instanceColor, {
        offset: 0,
        count: V * 3
      }), Hl(y.geometry.attributes.cloudOpacity, {
        offset: 0,
        count: V
      });
    };
    let E = 0, M = 0, A;
    const D = new pr(), z = new I(0, 0, 1), j = new I();
    this.update = (V, R, G) => {
      E = R, Of.copy(y.matrixWorld).invert(), V.matrixWorld.decompose(Df, If, as);
      const k = T();
      for (M = 0; M < k.length; M++)
        A = k[M], A.ref.matrixWorld.decompose(Bo, Uo, as), Bo.add(j.copy(A.position).applyQuaternion(Uo).multiply(as)), Uo.copy(If).multiply(D.setFromAxisAngle(z, A.rotation += G * A.rotationFactor)), as.multiplyScalar(A.volume + (1 + Math.sin(E * A.density * A.speed)) / 2 * A.growth), A.matrix.compose(Bo, Uo, as).premultiply(Of), A.dist = Bo.distanceTo(Df);
      for (k.sort((B, $) => $.dist - B.dist), M = 0; M < k.length; M++)
        A = k[M], u[M] = A.opacity * (A.dist < A.fade - 1 ? A.dist / A.fade : 1), y.setMatrixAt(M, A.matrix), y.setColorAt(M, A.color);
      y.geometry.attributes.cloudOpacity.needsUpdate = !0, y.instanceMatrix.needsUpdate = !0, y.instanceColor && (y.instanceColor.needsUpdate = !0);
    };
  }
}
let sT = 0;
class oT extends Qt {
  constructor({
    opacity: e = 1,
    speed: t = 0,
    bounds: r = new I().fromArray([5, 1, 1]),
    segments: i = 20,
    color: o = new oe("#ffffff"),
    fade: l = 10,
    volume: c = 6,
    smallestVolume: u = 0.25,
    distribute: f = null,
    growth: p = 4,
    concentrate: d = "inside",
    seed: g = Math.random()
  } = {}) {
    super(), this.name = "cloud_" + sT++, this.seed = g, this.segments = i, this.bounds = r, this.concentrate = d, this.volume = c, this.smallestVolume = u, this.distribute = f, this.growth = p, this.speed = t, this.fade = l, this.opacity = e, this.color = o, this.ref = this, this.cloudStateArray = [], this.updateCloud();
  }
  /**
   * @private
   */
  updateCloudStateArray() {
    if (this.cloudStateArray.length === this.segments) return;
    const {
      segments: e,
      uuid: t
    } = this;
    if (this.cloudStateArray.length > this.segments)
      this.cloudStateArray.splice(0, this.cloudStateArray.length - this.segments);
    else
      for (let r = this.cloudStateArray.length; r < e; r++)
        this.cloudStateArray.push({
          segments: e,
          bounds: new I(1, 1, 1),
          position: new I(),
          uuid: t,
          index: r,
          ref: this,
          dist: 0,
          matrix: new xe(),
          volume: 0,
          length: 0,
          speed: 0,
          growth: 0,
          opacity: 1,
          fade: 0,
          density: 0,
          rotation: r * (Math.PI / e),
          rotationFactor: 0,
          // Add rotationFactor property
          color: new oe()
        });
  }
  updateCloud() {
    const {
      volume: e,
      color: t,
      speed: r,
      growth: i,
      opacity: o,
      fade: l,
      bounds: c,
      seed: u,
      cloudStateArray: f,
      distribute: p,
      segments: d,
      concentrate: g,
      smallestVolume: y
    } = this;
    this.updateCloudStateArray();
    let b = 0;
    function T() {
      const x = Math.sin(u + b) * 1e4;
      return b++, x - Math.floor(x);
    }
    f.forEach((x, E) => {
      x.segments = d, x.volume = e, x.color = t, x.speed = r, x.growth = i, x.opacity = o, x.fade = l, x.bounds.copy(c), x.density = Math.max(0.5, T()), x.rotationFactor = Math.max(0.2, 0.5 * T()) * r;
      const M = p?.(x, E);
      if (M || d > 1) {
        var A;
        x.position.copy(x.bounds).multiply((A = M?.point) !== null && A !== void 0 ? A : {
          x: T() * 2 - 1,
          y: T() * 2 - 1,
          z: T() * 2 - 1
        });
      }
      const D = Math.abs(x.position.x), z = Math.abs(x.position.y), j = Math.abs(x.position.z), V = Math.max(D, z, j);
      x.length = 1, D === V && (x.length -= D / x.bounds.x), z === V && (x.length -= z / x.bounds.y), j === V && (x.length -= j / x.bounds.z), x.volume = (M?.volume !== void 0 ? M.volume : Math.max(Math.max(0, y), g === "random" ? T() : g === "inside" ? x.length : 1 - x.length)) * e;
    });
  }
}
class bc {
  constructor(e = 4) {
    this.pool = e, this.queue = [], this.workers = [], this.workersResolve = [], this.workerStatus = 0;
  }
  _initWorker(e) {
    if (!this.workers[e]) {
      const t = this.workerCreator();
      t.addEventListener("message", this._onMessage.bind(this, e)), this.workers[e] = t;
    }
  }
  _getIdleWorker() {
    for (let e = 0; e < this.pool; e++)
      if (!(this.workerStatus & 1 << e)) return e;
    return -1;
  }
  _onMessage(e, t) {
    const r = this.workersResolve[e];
    if (r && r(t), this.queue.length) {
      const { resolve: i, msg: o, transfer: l } = this.queue.shift();
      this.workersResolve[e] = i, this.workers[e].postMessage(o, l);
    } else
      this.workerStatus ^= 1 << e;
  }
  setWorkerCreator(e) {
    this.workerCreator = e;
  }
  setWorkerLimit(e) {
    this.pool = e;
  }
  postMessage(e, t) {
    return new Promise((r) => {
      const i = this._getIdleWorker();
      i !== -1 ? (this._initWorker(i), this.workerStatus |= 1 << i, this.workersResolve[i] = r, this.workers[i].postMessage(e, t)) : this.queue.push({ resolve: r, msg: e, transfer: t });
    });
  }
  dispose() {
    this.workers.forEach((e) => e.terminate()), this.workersResolve.length = 0, this.workers.length = 0, this.queue.length = 0, this.workerStatus = 0;
  }
}
function $d(s, e) {
  const t = new qt();
  t.setAttribute("position", new mt(new Float32Array([0, 0, 0]), 3));
  const r = s.sizeAttenuation ?? !0, i = r ? s.size * 2e-3 : s.size, o = new ia({
    size: i,
    color: s.color || 16777215,
    sizeAttenuation: r,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  });
  o.onBeforeCompile = (c) => {
    c.fragmentShader = c.fragmentShader.replace(
      "#include <clipping_planes_fragment>",
      `
            #include <clipping_planes_fragment>
            vec2 coord = gl_PointCoord - vec2(0.5);
            if(length(coord) > 0.5) discard;
            `
    );
  };
  const l = new kn(t, o);
  return l.position.copy(e), l;
}
async function aT(s, e) {
  let t = null;
  try {
    t = await Jt._loadTexture(s.url), t.magFilter = yi, t.minFilter = Ls, t.colorSpace = na, t.generateMipmaps = !0, t.premultiplyAlpha = !1, t.needsUpdate = !0;
  } catch (f) {
    console.error("IconPoint texture load failed:", s.url, f);
  }
  const r = new Ds({
    // 如果纹理加载失败，map 为 null，使用纯色占位
    map: t ?? null,
    color: s.color || 16777215,
    transparent: s.transparent ?? !0,
    opacity: s.opacity ?? 1,
    sizeAttenuation: s.sizeAttenuation ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0,
    premultipliedAlpha: !1,
    // 与纹理设置保持一致
    blending: yd
    // 正常混合模式
  }), i = new tn(r), o = 2e-3, l = s.size;
  let c, u;
  if (Array.isArray(l))
    [c, u] = l;
  else {
    const f = typeof l == "number" ? l : 32;
    if (t && t.image?.width && t.image?.height) {
      const p = t.image, d = p.width / p.height || 1;
      u = f, c = f * d;
    } else
      c = f, u = f;
  }
  return i.scale.set(c * o, u * o, 1), s.rotation && (i.rotation.z = s.rotation), s.anchor && i.center.set(s.anchor[0], s.anchor[1]), i.position.copy(e), i;
}
function Tc(s, e) {
  let t;
  e instanceof Float32Array ? t = Array.from(e) : Array.isArray(e) && typeof e[0] == "number" ? t = e : t = e.flatMap((o) => [o.x, o.y, o.z]);
  const r = new oa();
  r.setPositions(t);
  const i = new Bs({
    color: new oe(s.color ?? 16777215).getHex(),
    linewidth: s.width ?? 2,
    transparent: s.transparent ?? !0,
    opacity: s.opacity ?? 1,
    dashed: !!s.dashArray,
    dashScale: s.dashArray?.[0] ?? 1,
    dashSize: s.dashArray?.[0] ?? 1,
    gapSize: s.dashArray?.[1] ?? 0,
    resolution: new ce(window.innerWidth, window.innerHeight),
    alphaToCoverage: !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  });
  return window.addEventListener("resize", () => {
    i.resolution.set(window.innerWidth, window.innerHeight);
  }), new aa(r, i);
}
function Xd(s, e) {
  let t = [];
  if (Array.isArray(e) && typeof e[0] == "number")
    for (let T = 0; T < e.length; T += 3)
      t.push(new I(e[T], e[T + 1], e[T + 2]));
  else if (e instanceof Float32Array)
    for (let T = 0; T < e.length; T += 3)
      t.push(new I(e[T], e[T + 1], e[T + 2]));
  else
    t = e;
  if (t.length < 2) return new Ue();
  const r = new vd(), i = s.cornerRadius || 5;
  if (t.length === 2 || i <= 0)
    for (let T = 0; T < t.length - 1; T++) {
      const x = new Dn(t[T], t[T + 1]);
      r.curves.push(x);
    }
  else {
    let T = t[0];
    for (let x = 1; x < t.length - 1; x++) {
      const E = T, M = t[x], A = t[x + 1], D = new I().subVectors(M, E), z = new I().subVectors(A, M), j = D.length(), V = z.length(), R = Math.min(j, V) * 0.4, G = Math.min(i, R);
      D.normalize().multiplyScalar(j - G), z.normalize().multiplyScalar(G);
      const k = new I().addVectors(E, D), B = new I().addVectors(M, z);
      r.curves.push(new Dn(E, k)), r.curves.push(new wd(k, M, B)), T = B;
    }
    r.curves.push(new Dn(T, t[t.length - 1]));
  }
  const o = s.radius || 2, l = s.radialSegments || 8, c = s.tubularSegments || 64, u = new m1(r, c, o, l, !1), f = 5, p = new Ss({
    color: s.color || "#19bbd5",
    side: Un,
    emissive: new oe(s.color || "#19bbd5"),
    emissiveIntensity: 0.6 * f,
    transparent: !0
  });
  p.defines = { USE_UV: "" };
  const g = {
    totalLength: { value: r.getLength() },
    stripeOffset: { value: 0 },
    stripeWidth: { value: s.stripeWidth || 10 },
    stripeSpacing: { value: s.stripeSpacing || 20 },
    stripeColor: { value: new oe(s.stripeColor || "#096be3") },
    speedFactor: { value: s.speed || 10 },
    bloomBoost: { value: f }
  };
  p.onBeforeCompile = (T) => {
    T.uniforms.totalLength = g.totalLength, T.uniforms.stripeOffset = g.stripeOffset, T.uniforms.stripeWidth = g.stripeWidth, T.uniforms.stripeSpacing = g.stripeSpacing, T.uniforms.stripeColor = g.stripeColor, T.uniforms.bloomBoost = g.bloomBoost, T.fragmentShader = `
            uniform float totalLength;
            uniform float stripeOffset;
            uniform float stripeWidth;
            uniform float stripeSpacing;
            uniform vec3 stripeColor;
            uniform float bloomBoost;
            ${T.fragmentShader}
        `.replace(
      "#include <color_fragment>",
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
      "#include <emissivemap_fragment>",
      `#include <emissivemap_fragment>
            // 计算条纹模式（用于自发光）
            float pattern_e = mod((vUv.x - stripeOffset) * totalLength / (stripeWidth + stripeSpacing), 1.0);
            float isStripe_e = step(pattern_e, stripeWidth / (stripeWidth + stripeSpacing));
            
            // 自发光通道也叠加一遍，进一步抬高亮度
            totalEmissiveRadiance += stripeColor * isStripe_e * (3.0 * bloomBoost);
            `
    );
  };
  const y = new Ue(u, p);
  let b = 0;
  return y.onBeforeRender = () => {
    const T = performance.now(), x = b ? (T - b) / 1e3 : 0.016;
    b = T;
    const E = g.speedFactor.value / g.totalLength.value * 10;
    g.stripeOffset.value -= x * E, g.stripeOffset.value = g.stripeOffset.value % 1;
  }, y;
}
function Yd(s, e) {
  let t = [];
  if (Array.isArray(e) && typeof e[0] == "number")
    for (let A = 0; A < e.length; A += 3)
      t.push(new I(e[A], e[A + 1], e[A + 2]));
  else if (e instanceof Float32Array)
    for (let A = 0; A < e.length; A += 3)
      t.push(new I(e[A], e[A + 1], e[A + 2]));
  else
    t = e;
  if (t.length < 2) return new Ue();
  const r = new vd(), i = s.cornerRadius || 5;
  if (t.length === 2 || i <= 0)
    for (let A = 0; A < t.length - 1; A++) {
      const D = new Dn(t[A], t[A + 1]);
      r.curves.push(D);
    }
  else {
    let A = t[0];
    for (let D = 1; D < t.length - 1; D++) {
      const z = A, j = t[D], V = t[D + 1], R = new I().subVectors(j, z), G = new I().subVectors(V, j), k = R.length(), B = G.length(), $ = Math.min(k, B) * 0.4, K = Math.min(i, $);
      R.normalize().multiplyScalar(k - K), G.normalize().multiplyScalar(K);
      const Y = new I().addVectors(z, R), ee = new I().addVectors(j, G);
      r.curves.push(new Dn(z, Y)), r.curves.push(new wd(Y, j, ee)), A = ee;
    }
    r.curves.push(new Dn(A, t[t.length - 1]));
  }
  const o = s.width || 4, c = r.getPoints(128), u = [], f = [], p = [];
  let d = 0;
  const g = r.getLength();
  for (let A = 0; A < c.length; A++) {
    const D = c[A];
    let z;
    A === 0 ? z = new I().subVectors(c[1], c[0]) : A === c.length - 1 ? z = new I().subVectors(c[A], c[A - 1]) : z = new I().subVectors(c[A + 1], c[A - 1]), z.y = 0, z.normalize();
    const j = new I(-z.z, 0, z.x), V = o / 2, R = new I(
      D.x + j.x * V,
      D.y,
      D.z + j.z * V
    ), G = new I(
      D.x - j.x * V,
      D.y,
      D.z - j.z * V
    );
    u.push(R.x, R.y, R.z), u.push(G.x, G.y, G.z), A > 0 && (d += c[A].distanceTo(c[A - 1]));
    const k = d / g;
    if (f.push(k, 0), f.push(k, 1), A < c.length - 1) {
      const B = A * 2;
      p.push(B, B + 1, B + 2), p.push(B + 1, B + 3, B + 2);
    }
  }
  const y = new qt();
  y.setAttribute("position", new mt(new Float32Array(u), 3)), y.setAttribute("uv", new mt(new Float32Array(f), 2)), y.setIndex(p), y.computeVertexNormals();
  const b = 5, T = new Ss({
    color: s.color || "#0ED5FD",
    side: Un,
    emissive: new oe(s.color || "#0ED5FD"),
    emissiveIntensity: 5,
    transparent: !0
  });
  T.defines = { USE_UV: "" };
  const x = {
    totalLength: { value: g },
    stripeOffset: { value: 0 },
    arrowLength: { value: s.arrowLength || 20 },
    arrowSpacing: { value: s.arrowSpacing || 80 },
    arrowColor: { value: new oe(s.color || "#0ED5FD") },
    speedFactor: { value: s.speed || 10 },
    bloomBoost: { value: b }
  };
  T.onBeforeCompile = (A) => {
    A.uniforms.totalLength = x.totalLength, A.uniforms.stripeOffset = x.stripeOffset, A.uniforms.arrowLength = x.arrowLength, A.uniforms.arrowSpacing = x.arrowSpacing, A.uniforms.arrowColor = x.arrowColor, A.uniforms.bloomBoost = x.bloomBoost, A.fragmentShader = A.fragmentShader.replace(
      "uniform vec3 diffuse;",
      `uniform vec3 diffuse;
            uniform float totalLength;
            uniform float stripeOffset;
            uniform float arrowLength;
            uniform float arrowSpacing;
            uniform vec3 arrowColor;
            uniform float bloomBoost;`
    ), A.fragmentShader = A.fragmentShader.replace(
      "#include <color_fragment>",
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
    ), A.fragmentShader = A.fragmentShader.replace(
      "#include <emissivemap_fragment>",
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
  const E = new Ue(y, T);
  let M = 0;
  return E.onBeforeRender = () => {
    const A = performance.now(), D = M ? (A - M) / 1e3 : 0.016;
    M = A;
    const z = x.speedFactor.value / x.totalLength.value * 10;
    x.stripeOffset.value -= D * z, x.stripeOffset.value = x.stripeOffset.value % 1;
  }, E;
}
async function Zd(s, e) {
  let t = [];
  if (Array.isArray(e) && typeof e[0] == "number") {
    const B = e;
    for (let $ = 0; $ < B.length; $ += 3)
      t.push(new I(B[$], B[$ + 1], B[$ + 2]));
  } else if (e instanceof Float32Array)
    for (let B = 0; B < e.length; B += 3)
      t.push(new I(e[B], e[B + 1], e[B + 2]));
  else
    t = e;
  if (t.length < 2) return new Ue();
  const r = (s.width ?? 10) * 0.5, i = [], o = [], l = [];
  let c = 0;
  const u = [0];
  for (let B = 1; B < t.length; B++) {
    const $ = t[B].distanceTo(t[B - 1]);
    c += $, u.push(c);
  }
  if (c === 0) return new Ue();
  const f = s.repeat ?? 1, p = [], d = [];
  for (let B = 0; B < t.length; B++) {
    let $ = new I();
    B === 0 ? $.subVectors(t[B + 1], t[B]) : B === t.length - 1 ? $.subVectors(t[B], t[B - 1]) : $.subVectors(t[B + 1], t[B - 1]), $.normalize();
    const K = new I(0, 1, 0);
    let Y = new I().crossVectors($, K);
    Y.lengthSq() < 1e-10 ? Y.set(1, 0, 0) : Y.normalize(), p.push(t[B].clone().add(Y.clone().multiplyScalar(-r))), d.push(t[B].clone().add(Y.clone().multiplyScalar(r)));
  }
  let g = 0, y = 0;
  for (let B = 1; B < p.length; B++)
    g += p[B].distanceTo(p[B - 1]), y += d[B].distanceTo(d[B - 1]);
  if ((g + y) / 2 === 0) return new Ue();
  for (let B = 0; B < t.length; B++) {
    i.push(
      p[B].x,
      p[B].y,
      p[B].z,
      d[B].x,
      d[B].y,
      d[B].z
    );
    const $ = u[B] / c * f;
    o.push(
      $,
      0,
      // 左侧顶点：使用中心线U坐标，V=0
      $,
      1
      // 右侧顶点：使用中心线U坐标，V=1
    );
  }
  const T = t.length - 1;
  for (let B = 0; B < T; B++) {
    const $ = B * 2, K = B * 2 + 1, Y = (B + 1) * 2, ee = (B + 1) * 2 + 1;
    l.push($, Y, K), l.push(Y, ee, K);
  }
  const x = new qt();
  x.setAttribute("position", new mt(new Float32Array(i), 3)), x.setAttribute("uv", new mt(new Float32Array(o), 2)), x.setIndex(l), x.computeBoundingBox(), x.computeVertexNormals();
  const E = await Jt._loadTexture(s.flowTexture);
  E.wrapS = _r, E.wrapT = _r, E.anisotropy = 4, E.needsUpdate = !0;
  const M = new oe(s.color ?? 16777215), D = {
    uMap: { value: E },
    uColor: { value: M },
    uOpacity: { value: s.opacity ?? 1 },
    uOffset: { value: 0 },
    uBloomBoost: { value: 5 }
  }, z = s.depthOffset ?? 1, j = z !== 0, V = new Ar({
    uniforms: D,
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
    transparent: s.transparent ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !1,
    blending: mc,
    side: Un,
    polygonOffset: j,
    polygonOffsetFactor: -z,
    polygonOffsetUnits: -z
  }), R = new Ue(x, V);
  let G = 0;
  R.onBeforeRender = () => {
    const B = performance.now(), $ = G ? (B - G) / 1e3 : 0.016;
    G = B;
    const K = s.speed ?? 10;
    D.uOffset.value = k(D.uOffset.value - $ * K / c);
  };
  function k(B) {
    return B - Math.floor(B);
  }
  return R;
}
async function lT(s, e) {
  const t = s.type || (s.url.toLowerCase().endsWith(".fbx") ? "fbx" : "gltf");
  return (await jd.getInstance().load({
    ...s,
    type: t,
    position: e
  })).model;
}
function cT(s, e) {
  const { geometry: t, center: r, avgY: i } = Sc(e), o = s.depthOffset ?? 0, l = o !== 0, c = new Kt({
    color: new oe(s.color ?? 16777215),
    transparent: s.transparent ?? !0,
    opacity: s.opacity ?? 1,
    wireframe: s.wireframe ?? !1,
    side: s.side === "back" ? g1 : s.side === "double" ? Un : ea,
    // depthWrite: true,
    polygonOffset: l,
    polygonOffsetFactor: l ? o : 0,
    polygonOffsetUnits: l ? o : 0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  }), u = new Ue(t, c);
  if (u.rotation.x = -Math.PI / 2, u.position.set(r.x, i, r.z), (s.borderWidth ?? 0) > 0) {
    const d = {
      color: s.borderColor ?? s.color ?? 0,
      width: s.borderWidth
      // dashArray: config.borderdashArray,
      // opacity: config.opacity
    }, g = [];
    for (let b = 0; b < e.length; b += 3) {
      const T = e[b], x = e[b + 2];
      g.push(
        T - r.x,
        // 对应 shapePoints.x
        -(x - r.z),
        // 对应 shapePoints.y
        0
        // 与 ShapeGeometry 一样，初始在 XY 平面
      );
    }
    const y = Tc(d, g);
    y.position.z += 0.1, u.add(y);
  }
  return u;
}
function uT(s, e) {
  const t = s.extrude?.height || 2e3, r = [], i = [], o = [];
  for (let d = 0; d < e.length; d += 3) {
    const g = e[d], y = e[d + 1], b = e[d + 2];
    i.push(new I(g, y, b)), o.push(new I(g, y + t, b));
  }
  r.push(...i, ...o);
  const l = new qt();
  l.setFromPoints(r);
  const c = [], u = i.length;
  for (let d = 0; d < u; d++) {
    const g = (d + 1) % u;
    c.push(d, d + u, g), c.push(g, d + u, g + u);
  }
  for (let d = 2; d < u; d++)
    c.push(0, d - 1, d), c.push(u, u + d - 1, u + d);
  l.setIndex(c), l.computeVertexNormals();
  const f = new Ar({
    uniforms: {
      uColor: { value: new oe(s.color ?? 16777215) },
      uOpacity: { value: s.opacity ?? 1 },
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
    transparent: s.transparent ?? !0,
    side: Un,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  });
  return new Ue(l, f);
}
function hT(s, e, t) {
  const { geometry: r, center: i, avgY: o } = Sc(t), l = new Q1(r, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new ra().load(s.normalMap, function(f) {
      f.wrapS = f.wrapT = _r;
    }),
    waterColor: s.color || "#19AAEE",
    sunColor: s.sunColor || "#05FFF8",
    distortionScale: 1,
    alpha: s.opacity || 0.8
    // depthTest: config.depthTest ?? true,
    // depthWrite: config.depthWrite ?? true,
  }), c = l.onBeforeRender, u = l.onAfterRender;
  return l.onBeforeRender = (f, p, d, g, y, b) => {
    e.autoUpdate = !1, c.call(l, f, p, d, g, y, b);
  }, l.onAfterRender = (f, p, d, g, y, b) => {
    e.autoUpdate = !0, u.call(l, f, p, d, g, y, b);
  }, l.material.uniforms.size.value = 0.1, l.rotation.x = -Math.PI / 2, l.position.set(i.x, o, i.z), e.viewer.addEventListener("update", () => {
    l.material.uniforms.time.value += 1 / 60;
  }), l;
}
function Sc(s) {
  let e = 0;
  for (let l = 1; l < s.length; l += 3)
    e += s[l];
  e /= s.length / 3;
  const t = { x: 0, z: 0 }, r = [];
  for (let l = 0; l < s.length; l += 3)
    t.x += s[l], t.z += s[l + 2];
  t.x /= s.length / 3, t.z /= s.length / 3;
  for (let l = 0; l < s.length; l += 3)
    r.push(new ce(
      s[l] - t.x,
      -(s[l + 2] - t.z)
    ));
  const i = new _1(r);
  return {
    geometry: new y1(i),
    center: t,
    avgY: e
  };
}
async function fT(s, e) {
  const { geometry: t, center: r, avgY: i } = Sc(e), o = await Jt._loadTexture(s.normalMap), l = await Jt._loadTexture(s.normalMap);
  o.wrapS = o.wrapT = _r, l.wrapS = l.wrapT = _r, o.repeat.set(0.015, 0.015), l.repeat.set(5e-3, 5e-3);
  const c = new Os({
    color: new oe(s.color).multiplyScalar(3.5),
    roughness: 0.1,
    // 稍微增加粗糙度更真实
    metalness: 0.8,
    transparent: s.transparent ?? !0,
    opacity: 0.9,
    fog: !1,
    normalMap: o,
    normalScale: new ce(1.5, 1.5),
    // environmentMap: viewer.scene.environment, 
    envMapIntensity: 2,
    // 提高环境贴图的强度，让反射更亮
    // clearcoat: 1.0,        // 启用 Clearcoat，强度 1.0
    // clearcoatRoughness: 0.0, // Clearcoat 粗糙度 0.0，实现锋利高光
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  }), u = new Ue(t, c);
  u.rotation.x = -Math.PI / 2, u.position.set(r.x, i + 0.15, r.z), u.castShadow = !1, u.receiveShadow = !0;
  let f = 0;
  return u.onBeforeRender = () => {
    const p = performance.now(), d = f ? (p - f) / 1e3 : 0.016;
    o.offset.x += d * 0.08, o.offset.y += d * 0.03, l.offset.x -= d * 0.12, l.offset.y += d * 0.02, u.position.y = i + 0.5 + Math.sin(p * 0.02) * 0.02, f = p;
  }, u;
}
function dT(s, e) {
  s.color = new oe(s.hexcolor), s.boundstext && (s.bounds = new I(s.boundstext.x, s.boundstext.y, s.boundstext.z));
  const t = new oT(s);
  return t.castShadow = !0, t.scale.setScalar(50), t.position.copy(e), t;
}
async function pT(s, e) {
  const r = { ...{
    fontSizeDpi: 48,
    fontFamily: "'Microsoft YaHei', sans-serif",
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: 2,
    showBackground: !0,
    bgStyle: 1,
    bgColor: "#3498db",
    bgOpacity: 0.8,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowBlur: 5,
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    roundRectRadius: 20,
    bubblePointerHeight: 10,
    bubblePointerWidth: 15,
    bubbleBorderColor: "#ffffff",
    bubbleBorderWidth: 3,
    // 和 canvas-label-fixed 对齐的“屏幕尺寸”参数，fixedSize 作为兼容别名
    screenSpaceSize: 20,
    fixedSize: 50
  }, ...s };
  r.screenSpaceSize == null && r.fixedSize != null && (r.screenSpaceSize = r.fixedSize);
  const o = (typeof window < "u" && window.devicePixelRatio || 1) * 4, l = s.screenSpaceSize != null || s.fixedSize != null;
  if (s.fontSizeDpi == null && l) {
    const j = s.screenSpaceSize ?? s.fixedSize ?? r.screenSpaceSize;
    r.fontSizeDpi = j * o;
  }
  r.fontSizeDpi = Math.min(Math.max(r.fontSizeDpi, 8), 128);
  const c = document.createElement("canvas"), u = c.getContext("2d");
  if (!u) throw new Error("canvas context is null");
  const f = `${r.fontStyle} ${r.fontWeight} ${r.fontSizeDpi}px ${r.fontFamily}`;
  u.font = f;
  const p = r.showBackground ? 20 : 0, d = 100, g = 50, y = u.measureText(r.text), b = Math.max(d, y.width + p * 2), T = Math.max(g, r.fontSizeDpi * 1.5 + p * 2);
  c.width = Math.min(b, 2048), c.height = Math.min(T, 2048), u.clearRect(0, 0, c.width, c.height), u.font = f, r.showBackground && (r.bgStyle === 1 ? (u.fillStyle = r.bgColor, u.globalAlpha = r.bgOpacity, u.beginPath(), Kd(u, p / 2, p / 2, c.width - p, c.height - p, r.roundRectRadius), u.fill(), u.globalAlpha = 1, u.shadowColor = r.shadowColor, u.shadowBlur = r.shadowBlur, u.shadowOffsetX = r.shadowOffsetX, u.shadowOffsetY = r.shadowOffsetY) : (u.fillStyle = r.bgColor, u.globalAlpha = r.bgOpacity, u.beginPath(), qd(
    u,
    c.width / 2,
    c.height / 2,
    c.width * 0.8,
    c.height * 0.8,
    r.roundRectRadius,
    r.bubblePointerHeight,
    r.bubblePointerWidth
  ), u.fill(), u.globalAlpha = 1, u.strokeStyle = r.bubbleBorderColor, u.lineWidth = r.bubbleBorderWidth, u.stroke())), u.textAlign = "center", u.textBaseline = "middle", r.strokeWidth > 0 && (u.strokeStyle = r.strokeColor, u.lineWidth = r.strokeWidth, u.lineJoin = "round", u.strokeText(r.text, c.width / 2, c.height / 2)), u.fillStyle = r.textColor, u.fillText(r.text, c.width / 2, c.height / 2), u.shadowColor = "transparent";
  const x = new Is(c);
  x.magFilter = ld, x.minFilter = Ls, x.anisotropy = 16;
  const E = new Ds({
    map: x,
    transparent: s.transparent ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0,
    fog: !1
  }), M = new tn(E), A = r.screenSpaceSize ?? r.fixedSize;
  M.scale.set(
    c.width * A / 100,
    c.height * A / 100,
    1
  );
  const D = s.anchor || [0.5, 0.5], z = s.textOffset || { x: 0, y: 0 };
  return M.center.set(
    D[0] - z.x / c.width,
    D[1] + z.y / c.height
  ), e && M.position.copy(e), M;
}
async function mT(s, e, t) {
  const i = { ...{
    fontSizeDpi: 48,
    fontFamily: "'Microsoft YaHei', sans-serif",
    fontWeight: "bold",
    fontStyle: "normal",
    textColor: "#ffffff",
    strokeColor: "#000000",
    strokeWidth: 2,
    showBackground: !0,
    bgStyle: 1,
    bgColor: "#3498db",
    bgOpacity: 0.8,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowBlur: 5,
    shadowOffsetX: 3,
    shadowOffsetY: 3,
    roundRectRadius: 20,
    bubblePointerHeight: 10,
    bubblePointerWidth: 15,
    bubbleBorderColor: "#ffffff",
    bubbleBorderWidth: 3,
    screenSpaceSize: 20,
    maxVisibleDistance: 1 / 0
  }, ...s };
  i.screenSpaceSize == null && s.fixedSize != null && (i.screenSpaceSize = s.fixedSize);
  const l = (typeof window < "u" && window.devicePixelRatio || 1) * 4;
  s.fontSizeDpi == null && (i.fontSizeDpi = i.screenSpaceSize * l), i.fontSizeDpi = Math.max(i.fontSizeDpi, 8);
  const c = document.createElement("canvas"), u = c.getContext("2d");
  if (!u) throw new Error("Failed to get canvas context");
  const f = `${i.fontStyle} ${i.fontWeight} ${i.fontSizeDpi}px ${i.fontFamily}`;
  u.font = f;
  const p = i.showBackground ? 20 : 0, d = 100, g = 50, y = u.measureText(i.text), b = Math.max(d, y.width + p * 2), T = Math.max(g, i.fontSizeDpi * 1.5 + p * 2);
  c.width = Math.min(b, 2048), c.height = Math.min(T, 2048), u.clearRect(0, 0, c.width, c.height), u.font = f, i.showBackground && (i.bgStyle === 1 ? (u.fillStyle = i.bgColor, u.globalAlpha = i.bgOpacity, u.beginPath(), Kd(u, p / 2, p / 2, c.width - p, c.height - p, i.roundRectRadius), u.fill(), u.globalAlpha = 1, u.shadowColor = i.shadowColor, u.shadowBlur = i.shadowBlur, u.shadowOffsetX = i.shadowOffsetX, u.shadowOffsetY = i.shadowOffsetY) : (u.fillStyle = i.bgColor, u.globalAlpha = i.bgOpacity, u.beginPath(), qd(
    u,
    c.width / 2,
    c.height / 2,
    c.width * 0.8,
    c.height * 0.8,
    i.roundRectRadius,
    i.bubblePointerHeight,
    i.bubblePointerWidth
  ), u.fill(), u.globalAlpha = 1, u.strokeStyle = i.bubbleBorderColor, u.lineWidth = i.bubbleBorderWidth, u.stroke())), u.textAlign = "center", u.textBaseline = "middle", i.strokeWidth > 0 && (u.strokeStyle = i.strokeColor, u.lineWidth = i.strokeWidth, u.lineJoin = "round", u.strokeText(i.text, c.width / 2, c.height / 2)), u.fillStyle = i.textColor, u.fillText(i.text, c.width / 2, c.height / 2), u.shadowColor = "transparent";
  const x = new Is(c), E = new Ds({
    map: x,
    transparent: s.transparent ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0,
    fog: !1
  }), M = new tn(E), A = s.anchor || [0.5, 0.5], D = s.textOffset || { x: 0, y: 0 }, z = i.screenSpaceSize, j = z * (c.width / c.height);
  M.center.set(
    A[0] - D.x / j,
    A[1] + D.y / z
  ), M.position.copy(e), M.userData.isLabel = !0;
  const V = () => {
    if (!M.visible) return;
    const G = t.viewer.camera.position.distanceTo(M.position);
    if (G > i.maxVisibleDistance) {
      M.visible = !1;
      return;
    }
    M.visible = !0;
    const k = new ce();
    t.viewer.renderer.getSize(k);
    const B = k.height, $ = lt.degToRad(t.viewer.camera.fov), K = typeof window < "u" && window.devicePixelRatio || 1, ee = i.screenSpaceSize * K / c.height * (2 * G * Math.tan($ / 2) / B);
    M.scale.set(ee * c.width, ee * c.height, 1), M.lookAt(t.viewer.camera.position);
  };
  V();
  const R = () => V();
  return M.addEventListener("dispose", () => {
    t.viewer.renderer.domElement.removeEventListener("resize", V);
  }), t.viewer.renderer.domElement.addEventListener("resize", V), t.viewer.camera.addEventListener("change", V), M.onBeforeRender = R, M;
}
async function gT(s, e) {
  const t = s.size ?? s.iconSize, r = {
    text: s.text || "",
    iconSize: t,
    fontSize: s.fontSize ?? 12,
    fontFamily: s.fontFamily || "微软雅黑",
    fontWeight: s.fontWeight ?? 400,
    padding: { top: 3, right: 6, bottom: 3, left: 6, ...s.padding },
    bgColor: s.bgColor || "#ffffff",
    bgOpacity: s.bgOpacity ?? 1,
    textColor: s.textColor || "#000000",
    strokeColor: s.strokeColor || "#000000",
    strokeWidth: s.strokeWidth ?? 0,
    iconScale: s.iconScale ?? 1,
    renderbg: s.renderbg ?? !0,
    textOffset: s.textOffset ?? { x: -40, y: -19 },
    depthTest: s.depthTest ?? !1,
    depthWrite: s.depthWrite ?? !1,
    transparent: s.transparent ?? !0,
    canvasScale: 4
    // 固定 4 倍采样解决模糊
  };
  let i = null;
  if (s.url)
    try {
      i = await TT(s.url);
    } catch {
      console.error("Label icon load failed:", s.url);
    }
  const { canvas: o, width: l, height: c, center: u } = await _T(r, i), f = new Rn(o);
  f.generateMipmaps = !0, f.minFilter = Ls, f.magFilter = yi, f.colorSpace = na, f.premultiplyAlpha = !1, f.needsUpdate = !0;
  const p = new Ds({
    map: f,
    transparent: r.transparent ?? !0,
    depthTest: r.depthTest ?? !0,
    depthWrite: r.depthWrite ?? !0,
    blending: yd,
    sizeAttenuation: !1,
    premultipliedAlpha: !1,
    alphaTest: 0.05
  }), d = new tn(p), g = 2e-3;
  return d.scale.set(l * g, c * g, 1), s.anchor ? d.center.set(s.anchor[0], s.anchor[1]) : d.center.set(u[0], u[1]), e && d.position.copy(e), d;
}
async function _T(s, e) {
  return new Promise((t) => {
    const {
      text: r,
      fontSize: i,
      fontFamily: o,
      padding: l,
      bgColor: c,
      textColor: u,
      strokeColor: f,
      strokeWidth: p,
      iconScale: d,
      canvasScale: g,
      renderbg: y,
      textOffset: b,
      iconSize: T,
      fontWeight: x,
      bgOpacity: E
    } = s, M = e !== null;
    let A = 0, D = 0;
    if (M && e) {
      const Ge = e.naturalWidth || e.width || 1, At = e.naturalHeight || e.height || 1, Ti = Ge / At || 1;
      Array.isArray(T) ? (A = T[0], D = T[1]) : typeof T == "number" ? (D = T, A = T * Ti) : (A = Ge, D = At);
    } else Array.isArray(T) ? (A = T[0], D = T[1]) : typeof T == "number" && (A = T, D = T);
    const j = document.createElement("canvas").getContext("2d"), V = `${x} ${i}px ${o}`;
    j.font = V;
    const R = vT(j, r, i), { width: G, ascent: k, descent: B } = R, $ = M ? A / 2 : 0, K = M ? D / 2 : 0, Y = $ + b.x, ee = K + b.y, Q = Y - l.left, Ee = Y + G + l.right, we = ee - k - l.top, be = ee + B + l.bottom;
    let ge, Ce, Le, Oe;
    M ? (ge = Math.min(0, Q), Ce = Math.min(0, we), Le = Math.max(A, Ee), Oe = Math.max(D, be)) : (ge = Q, Ce = we, Le = Ee, Oe = be);
    const ct = Math.ceil(Le - ge), ut = Math.ceil(Oe - Ce), { canvas: Ut, ctx: er } = yT(ct, ut, g), yt = -ge, tr = -Ce;
    if (M && e && A > 0 && D > 0) {
      const Ge = A * d, At = D * d, Ti = (A - Ge) / 2, vt = (D - At) / 2, Si = yt + Ti, sn = tr + vt;
      er.drawImage(e, Si, sn, Ge, At);
    }
    const nn = yt + Y, Or = tr + ee;
    y && c && c !== "transparent" && xT(
      er,
      nn,
      Or,
      G,
      k,
      B,
      l,
      c,
      E
    ), er.font = V, bT(er, r, nn, Or, u, p, f);
    let rr, Dr;
    M && A > 0 && D > 0 ? (rr = (yt + $) / ct, Dr = (tr + K) / ut) : (rr = 0.5, Dr = 0.5), t({
      canvas: Ut,
      width: ct,
      height: ut,
      center: [rr, 1 - Dr]
      // 转换为 canvas 坐标系
    });
  });
}
function Kd(s, e, t, r, i, o) {
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + r - o, t), s.quadraticCurveTo(e + r, t, e + r, t + o), s.lineTo(e + r, t + i - o), s.quadraticCurveTo(e + r, t + i, e + r - o, t + i), s.lineTo(e + o, t + i), s.quadraticCurveTo(e, t + i, e, t + i - o), s.lineTo(e, t + o), s.quadraticCurveTo(e, t, e + o, t), s.closePath();
}
function qd(s, e, t, r, i, o, l, c) {
  if (r <= 0) throw new Error("Width must be positive");
  if (i <= 0) throw new Error("Height must be positive");
  if (o < 0) throw new Error("Radius cannot be negative");
  const u = r, f = i, p = Math.min(o, r / 2, i / 2), d = l ?? 10, g = c ?? 15;
  s.beginPath(), s.moveTo(e - u / 2 + p, t - f / 2), s.lineTo(e + u / 2 - p, t - f / 2), s.quadraticCurveTo(
    e + u / 2,
    t - f / 2,
    e + u / 2,
    t - f / 2 + p
  ), s.lineTo(e + u / 2, t + f / 2 - p), s.quadraticCurveTo(
    e + u / 2,
    t + f / 2,
    e + u / 2 - p,
    t + f / 2
  ), s.lineTo(e + g / 2, t + f / 2), s.lineTo(e, t + f / 2 + d), s.lineTo(e - g / 2, t + f / 2), s.lineTo(e - u / 2 + p, t + f / 2), s.quadraticCurveTo(
    e - u / 2,
    t + f / 2,
    e - u / 2,
    t + f / 2 - p
  ), s.lineTo(e - u / 2, t - f / 2 + p), s.quadraticCurveTo(
    e - u / 2,
    t - f / 2,
    e - u / 2 + p,
    t - f / 2
  ), s.closePath();
}
function yT(s, e, t) {
  const r = document.createElement("canvas");
  r.width = Math.ceil(s * t), r.height = Math.ceil(e * t);
  const i = r.getContext("2d", { alpha: !0 });
  return i.scale(t, t), i.imageSmoothingEnabled = !1, { canvas: r, ctx: i };
}
function vT(s, e, t) {
  const r = s.measureText(e);
  return {
    width: r.width,
    ascent: r.actualBoundingBoxAscent || t * 0.8,
    descent: r.actualBoundingBoxDescent || t * 0.2,
    totalHeight: (r.actualBoundingBoxAscent || t * 0.8) + (r.actualBoundingBoxDescent || t * 0.2)
  };
}
function wT(s, e, t, r, i, o) {
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + r - o, t), s.arcTo(e + r, t, e + r, t + o, o), s.lineTo(e + r, t + i - o), s.arcTo(e + r, t + i, e + r - o, t + i, o), s.lineTo(e + o, t + i), s.arcTo(e, t + i, e, t + i - o, o), s.lineTo(e, t + o), s.arcTo(e, t, e + o, t, o), s.closePath();
}
function xT(s, e, t, r, i, o, l, c, u = 1) {
  const f = e - l.left, p = t - i - l.top, d = r + l.left + l.right, g = i + o + l.top + l.bottom;
  s.save(), s.globalAlpha = u, s.fillStyle = c, wT(s, f, p, d, g, 2), s.fill(), s.restore();
}
function bT(s, e, t, r, i, o, l) {
  s.save(), s.textBaseline = "alphabetic", s.textAlign = "left", o > 0 && (s.strokeStyle = l, s.lineWidth = o, s.lineJoin = "round", s.strokeText(e, t, r)), s.fillStyle = i, s.fillText(e, t, r), s.restore();
}
function TT(s) {
  return new Promise((e, t) => {
    const r = new Image();
    r.crossOrigin = "Anonymous", r.onload = () => e(r), r.onerror = (i) => t(new Error(`Failed to load image: ${s} ${i}`)), r.src = s;
  });
}
async function ST(s, e, t) {
  const i = new v1(0.2, 0.2, 24, 12), o = new Kt({ color: s.color }), l = await Jt._loadTexture(s.icon), c = new ia({
    // color: new THREE.Color(color).multiplyScalar(0.5),
    size: 80 * window.innerHeight / window.innerHeight,
    fog: !1,
    opacity: 1,
    transparent: s.transparent ?? !0,
    toneMapped: !1,
    blending: mc,
    map: l,
    sizeAttenuation: !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !1
  }), u = new _c(i, o, e.length);
  u.position.add(t.prjcenter), u.castShadow = !0;
  const f = new mr(), p = [];
  for (let b = 0; b < e.length; b++) {
    const T = e[b], x = new I(
      T.coordinates[0],
      T.coordinates[1],
      T.coordinates[2] || 0
      // 默认高度0
    ), M = t.projectToWorld(x).sub(t.prjcenter);
    f.position.copy(M), f.updateMatrix(), u.setMatrixAt(b, f.matrix), p.push(M.x, 0, M.z);
  }
  const d = new Float32Array(p), g = new qt();
  g.setAttribute("position", new mt(d, 3));
  const y = new kn(g, c);
  return y.position.add(t.prjcenter), y.position.y = 1.5 * 10, y.renderOrder = 99999999, y.visible = !0, {
    points: y,
    InstancedCol: u
  };
}
var MT = Object.defineProperty, AT = (s, e, t) => e in s ? MT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Qd = (s, e, t) => AT(s, typeof e != "symbol" ? e + "" : e, t);
const Mc = class ji {
  /**
   * 构造函数
   * @param config 样式配置
   */
  constructor(e) {
    this.config = e;
  }
  /**
   * 应用样式到3D对象
   * @param object 目标3D对象
   * @returns 是否应用成功
   */
  async applyTo(e) {
    if (!e) return !1;
    try {
      switch (e.visible = this.config.visible !== !1, this.config.type) {
        case "basic-point":
        case "icon-point":
        case "icon-label-point":
          return this._applyPointStyle(e);
        case "basic-line":
          return this._applyLineStyle(e);
        case "flow-tube-line":
          return this._applyFlowLineStyle(e);
        case "arrow-line":
          return this._applyArrowLineStyle(e);
        case "flow-texture-line":
          return this._applyFlowTextureLineStyle(e);
        case "gltf":
        case "fbx":
          return this._applyModelStyle(e);
        case "basic-polygon":
          return this._applyPolygonStyle(e);
        case "extrude-polygon":
          return this._applyExtrudeStyle(e);
        case "water":
        case "base-water":
          return this._applyWaterStyle(e);
        case "cloud":
          return this._applyCloudStyle(e);
        case "canvas-label":
        case "canvas-label-fixed":
          return this._applyTextSpriteStyle(e);
        case "light":
          return this._applyLightStyle(e);
        case "custom":
          return this._applyCustomStyle(e);
        default:
          throw new Error("Unknown style type");
      }
    } catch (t) {
      return console.error("Style apply failed:", t), e.visible = !1, !1;
    }
  }
  /**
   * 应用点样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  async _applyPointStyle(e) {
    const t = this.config;
    return t.type === "icon-point" ? await this._applyIconPoint(e, t) : t.type === "basic-point" ? this._applyBasicPoint(e, t) : t.type === "icon-label-point" && this._applyIconLabelPoint(e, t), !0;
  }
  /**
   * 应用图标点样式
   * @param object 目标对象
   * @param config 样式配置
   */
  // @ts-ignore
  async _applyIconPoint(e, t) {
    return !0;
  }
  /**
   * 应用基础点样式
   * @param object 目标对象
   * @param config 样式配置
   */
  _applyBasicPoint(e, t) {
    let r;
    if (e instanceof kn)
      r = e;
    else if (r = $d(t, e.position), r.position.copy(e.position), r.rotation.copy(e.rotation), r.scale.copy(e.scale), e.parent) {
      let l = e.parent;
      l._renderObject = r, l._updateGeometry();
    }
    const i = r.material, o = t.sizeAttenuation;
    i.size = o ? t.size * 2e-3 : t.size, t.color && i.color.set(t.color), i.sizeAttenuation = o ?? !1, i.onBeforeCompile = (l) => {
      l.fragmentShader = l.fragmentShader.replace(
        "#include <clipping_planes_fragment>",
        `
                #include <clipping_planes_fragment>
                vec2 coord = gl_PointCoord - vec2(0.5);
                if(length(coord) > 0.5) discard;
                `
      );
    }, i.needsUpdate = !0;
  }
  /**
   * 应用图标标签点样式
   * @param object 目标对象
   * @param config 样式配置
   */
  // @ts-ignore
  _applyIconLabelPoint(e, t) {
    return !0;
  }
  /**
   * 应用线样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyLineStyle(e) {
    return this.config, !0;
  }
  /**
   * 应用流动管线样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyFlowLineStyle(e) {
    return !0;
  }
  /**
   * 应用箭头流动线样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyArrowLineStyle(e) {
    return !0;
  }
  /**
   * 应用流动纹理管线样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyFlowTextureLineStyle(e) {
    return !0;
  }
  /**
   * 应用多边形样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyPolygonStyle(e) {
    return !0;
  }
  /**
   * 应用拉伸多边形样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyExtrudeStyle(e) {
    return !0;
  }
  /**
   * 应用水面样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyWaterStyle(e) {
    return !0;
  }
  /**
   * 应用云朵样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyCloudStyle(e) {
    return !0;
  }
  /**
   * 应用文本精灵样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  _applyTextSpriteStyle(e) {
    return !0;
  }
  /**
  * 应用灯光样式
  * @param object 目标对象
  * @returns 是否应用成功
  */
  // @ts-ignore
  _applyLightStyle(e) {
    return !0;
  }
  /**
   * 应用模型样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  // @ts-ignore
  async _applyModelStyle(e) {
    return !0;
  }
  /**
   * 应用自定义样式
   * @param object 目标对象
   * @returns 是否应用成功
   */
  async _applyCustomStyle(e) {
    const r = await this.config.build();
    return e instanceof Qt && (e.clear(), e.add(r)), !0;
  }
  /**
   * 加载纹理
   * @param url 纹理URL
   * @returns 纹理对象
   */
  static async _loadTexture(e) {
    if (ji._textureCache.has(e))
      return ji._textureCache.get(e);
    const t = await new Promise((r, i) => {
      ji._textureLoader.load(e, r, void 0, i);
    });
    return t.needsUpdate = !0, ji._textureCache.set(e, t), t;
  }
  /**
   * 创建样式实例
   * @param input 样式输入
   * @returns 样式实例
   */
  static create(e) {
    return e instanceof ji ? e : new ji(e);
  }
};
Qd(Mc, "_textureCache", /* @__PURE__ */ new Map());
Qd(Mc, "_textureLoader", new ra());
let Jt = Mc;
const et = [];
for (let s = 0; s < 256; ++s)
  et.push((s + 256).toString(16).slice(1));
function PT(s, e = 0) {
  return (et[s[e + 0]] + et[s[e + 1]] + et[s[e + 2]] + et[s[e + 3]] + "-" + et[s[e + 4]] + et[s[e + 5]] + "-" + et[s[e + 6]] + et[s[e + 7]] + "-" + et[s[e + 8]] + et[s[e + 9]] + "-" + et[s[e + 10]] + et[s[e + 11]] + et[s[e + 12]] + et[s[e + 13]] + et[s[e + 14]] + et[s[e + 15]]).toLowerCase();
}
let Vl;
const ET = new Uint8Array(16);
function CT() {
  if (!Vl) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    Vl = crypto.getRandomValues.bind(crypto);
  }
  return Vl(ET);
}
const LT = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), Ff = { randomUUID: LT };
function OT(s, e, t) {
  s = s || {};
  const r = s.random ?? s.rng?.() ?? CT();
  if (r.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, PT(r);
}
function DT(s, e, t) {
  return Ff.randomUUID && !s ? Ff.randomUUID() : OT(s);
}
var Jd = /* @__PURE__ */ ((s) => (s.POINT = "point", s.LINE_VERTEX = "line_vertex", s.POLYGON_CENTER = "polygon_center", s.LABEL = "label", s.ICON = "icon", s.CLUSTER = "cluster", s))(Jd || {}), Pr = /* @__PURE__ */ ((s) => (s.NO_COLLISION = "no_collision", s.PRIORITY_LOST = "priority_lost", s.OUT_OF_VIEWPORT = "out_of_viewport", s.ZOOM_FILTERED = "zoom_filtered", s.MANUAL_HIDDEN = "manual_hidden", s.GROUP_COLLISION = "group_collision", s))(Pr || {}), IT = Object.defineProperty, FT = (s, e, t) => e in s ? IT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ls = (s, e, t) => FT(s, typeof e != "symbol" ? e + "" : e, t);
class RT extends la {
  constructor() {
    super(...arguments), ls(this, "_isDragging", !1), ls(this, "_lastCoord", null), ls(this, "_boundOnMouseDown", this._onMouseDown.bind(this)), ls(this, "_boundOnMouseMove", this._onMouseMove.bind(this)), ls(this, "_boundOnMouseUp", this._onMouseUp.bind(this));
  }
  /**
   * Add event hooks
   * 添加事件钩子
   */
  addHooks() {
    this.target.on("mousedown", this._boundOnMouseDown);
  }
  /**
   * Remove event hooks
   * 移除事件钩子
   */
  removeHooks() {
    this.target.off("mousedown", this._boundOnMouseDown), this._stopDrag();
  }
  /**
   * Handle mouse down event
   * 处理鼠标按下事件
   * @param e Event object 事件对象
   */
  _onMouseDown(e) {
    const t = this.target.getMap();
    !t || !this.target.options.draggable || (this._isDragging = !0, this._lastCoord = e.coordinate, t.viewer.config("draggable", !1), t.on("mousemove", this._boundOnMouseMove), t.on("mouseup", this._boundOnMouseUp), this.target.trigger("dragstart", e));
  }
  _onMouseMove(e) {
    if (!this._isDragging || !this._lastCoord || !e.coordinate) return;
    const t = e.coordinate, r = t[0] - this._lastCoord[0], i = t[1] - this._lastCoord[1];
    Math.abs(r) < 1e-8 && Math.abs(i) < 1e-8 || (this._translate(r, i), this._lastCoord = t, this.target.trigger("dragging", e));
  }
  _onMouseUp(e) {
    this._stopDrag(), this.target.trigger("dragend", e);
  }
  /**
   * Stop dragging
   * 停止拖拽
   */
  _stopDrag() {
    this._isDragging = !1;
    const e = this.target.getMap();
    e && (e.viewer.config("draggable", !0), e.off("mousemove", this._boundOnMouseMove), e.off("mouseup", this._boundOnMouseUp));
  }
  /**
   * Translate feature coordinates
   * 平移要素坐标
   * @param dx Longitude offset 经度偏移量
   * @param dy Latitude offset 纬度偏移量
   */
  _translate(e, t) {
    const r = this.target._geometry;
    if (!r || !r.coordinates) return;
    const i = (l) => Array.isArray(l[0]) ? l.map(i) : [l[0] + e, l[1] + t], o = i(r.coordinates);
    r.coordinates = o, this.target._applyCoordinateChanges(!0);
  }
}
var BT = Object.defineProperty, UT = (s, e, t) => e in s ? BT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ft = (s, e, t) => UT(s, typeof e != "symbol" ? e + "" : e, t);
class gt extends xc(
  bi(
    rn(mr)
  )
) {
  /** 上次计算的包围盒缓存 */
  // private _lastBoundingBox: IBoundingBox | null = null;
  /**
   * Create a feature instance.
   * 创建要素实例
   * 
   * @param options - Feature configuration options. 要素配置选项
   * @throws Throws error if geometry is not provided. 如果未提供geometry参数会抛出错误
   */
  constructor(e) {
    super(), Ft(this, "_worldCoordinates"), Ft(this, "_renderObject"), Ft(this, "_geometry"), Ft(this, "_layer"), Ft(this, "_style"), Ft(this, "_id"), Ft(this, "_styleQueue", []), Ft(this, "_isApplyingStyle", !1), Ft(this, "_isGeometryInitializing", !1), Ft(this, "_bloomConfig"), Ft(this, "_collisionState", {
      visible: !0,
      reason: Pr.NO_COLLISION,
      collidedWith: [],
      timestamp: Date.now()
    }), Ft(this, "_collisionConfig", {
      enabled: !0,
      priority: 50,
      padding: 4,
      minZoom: 0,
      maxZoom: 24
    }), Ft(this, "_animationRef", null), wc(e.geometry, "geometry", "geometry must be specified"), this._geometry = e.geometry, this._worldCoordinates = new I(0, 0, 0), this._renderObject = new mr(), this.options = {
      draggable: e.draggable || !1,
      editable: e.editable || !1
    }, e.userData && (this.userData = Object.assign(
      {},
      JSON.parse(JSON.stringify(e.userData))
    )), e.style && this.setStyle(e.style), e.id ? this._id = e.id : this._id = DT(), this.addHandler("draggable", RT);
  }
  /**
   * Initialize geometry (template method).
   * 初始化几何体（模板方法）
   * 
   * @description
   * Calls _buildRenderObject implemented by subclasses and processes pending style changes.
   * 该方法会调用子类实现的_buildRenderObject方法，并处理积压的样式变更
   * 
   * @returns Promise<void>
   */
  async initializeGeometry() {
    if (!(this._isGeometryInitializing || this._renderObject)) {
      this._isGeometryInitializing = !0;
      try {
        await this._buildRenderObject(), this._processStyleQueue();
      } finally {
        this._isGeometryInitializing = !1;
      }
    }
  }
  /**
   * 更新渲染对象的坐标 (Internal)
   * Update the coordinates of the render object.
   */
  _refreshCoordinates() {
    this._buildRenderObject();
  }
  /**
   * Set style.
   * 设置样式
   * 
   * @param input - Style configuration or style instance. 样式配置或样式实例
   * @returns Current feature instance (supports method chaining). 当前要素实例（支持链式调用）
   */
  setStyle(e) {
    const t = e instanceof Jt ? e : new Jt(e);
    this._style = t;
    const r = JSON.parse(JSON.stringify(t.config));
    return this._styleQueue.push(r), this._tryProcessQueue(), this;
  }
  /**
   * Get current style.
   * 获取当前样式
   * 
   * @returns Current style or undefined. 当前样式或undefined
   */
  getStyle() {
    return this._style;
  }
  /**
   * Set bloom status for the current feature.
   * 设置当前要素的发光状态
   * 
   * @param enabled Whether to enable bloom. 是否启用发光
   * @param options Optional: bloom intensity and color. 可选：发光强度和颜色
   */
  setBloom(e, t) {
    const r = this._bloomConfig || {
      intensity: 1,
      color: "#ffffff"
    };
    return this._bloomConfig = {
      enabled: e,
      intensity: t?.intensity ?? r.intensity,
      color: t?.color ?? r.color
    }, this._renderObject && this._applyBloomToObject(this._renderObject), this;
  }
  /**
   * Get bloom configuration of the current feature.
   * 获取当前要素的发光配置
   */
  getBloom() {
    return this._bloomConfig;
  }
  /**
   * Internal method: Apply bloom configuration to Three object.
   * 内部方法：把发光配置应用到 Three 对象上
   */
  _applyBloomToObject(e) {
    if (!this._bloomConfig) return;
    const { enabled: t, intensity: r, color: i } = this._bloomConfig;
    e.traverse((o) => {
      if (o instanceof kn && o.material) {
        const l = o.material;
        o.userData = o.userData || {}, o.userData.__bloomBackup || (o.userData.__bloomBackup = {
          size: l.size,
          sizeAttenuation: l.sizeAttenuation
        });
        const c = o.userData.__bloomBackup;
        t ? (l.size = c.size * (1 + r), l.sizeAttenuation = !1) : (l.size = c.size, l.sizeAttenuation = c.sizeAttenuation), l.needsUpdate = !0;
        return;
      }
      if (o.type === "Sprite" && o.material) {
        const l = o.material;
        o.userData = o.userData || {}, o.userData.__bloomBackup || (o.userData.__bloomBackup = {
          color: l.color ? l.color.clone() : null,
          opacity: l.opacity ?? 1
        });
        const c = o.userData.__bloomBackup;
        t ? (l.color && c.color && (l.color.copy(c.color), i && i !== "#ffffff" && l.color.setStyle(i), l.color.multiplyScalar(1 + r * 2)), l.opacity = Math.min(1, (c.opacity ?? 1) * (1 + r * 0.3))) : (c.color && l.color && l.color.copy(c.color), l.opacity = c.opacity), l.needsUpdate = !0;
        return;
      }
      if (o.isLine2 && o.material) {
        const l = o.material;
        o.userData = o.userData || {}, o.userData.__bloomBackup || (o.userData.__bloomBackup = {
          color: l.color ? l.color.clone() : null,
          opacity: l.opacity ?? 1
        });
        const c = o.userData.__bloomBackup;
        t ? (l.color && c.color && (l.color.copy(c.color), i && i !== "#ffffff" && l.color.setStyle(i), l.color.multiplyScalar(1 + r * 2)), l.opacity = Math.min(1, (c.opacity ?? 1) * (1 + r * 0.3))) : (c.color && l.color && l.color.copy(c.color), l.opacity = c.opacity), l.needsUpdate = !0;
        return;
      }
      o instanceof Ue && o.material && (Array.isArray(o.material) ? o.material : [o.material]).forEach((c) => {
        o.userData = o.userData || {}, o.userData.__bloomBackup || (o.userData.__bloomBackup = {
          emissiveIntensity: c.emissiveIntensity ?? 0,
          emissiveColor: c.emissive ? c.emissive.clone() : null,
          color: c.color ? c.color.clone() : null
        });
        const u = o.userData.__bloomBackup;
        t ? "emissive" in c && c.emissive ? (c.emissiveIntensity = r, i && i !== "#ffffff" && c.emissive.setStyle ? c.emissive.setStyle(i) : u.color && c.emissive && c.emissive.copy(u.color)) : c.color && (u.color && c.color.copy(u.color), i && i !== "#ffffff" ? c.color.setStyle(i) : c.color.multiplyScalar(1 + r * 0.3)) : ("emissiveIntensity" in c && (c.emissiveIntensity = u.emissiveIntensity !== void 0 ? u.emissiveIntensity : 0), u.emissiveColor && c.emissive && c.emissive.copy(u.emissiveColor), u.color && c.color && c.color.copy(u.color)), c.needsUpdate = !0;
      });
    });
  }
  /**
  * Apply style with retry mechanism
  * 应用样式（带重试机制）
  * 
  * @param style - Style instance 样式实例
  * @param maxRetries - Maximum retries (default: 3) 最大重试次数（默认3）
  * @param baseDelay - Base delay in ms (default: 100) 基础延迟时间（毫秒，默认100）
  * @returns Promise<void>
  * @private
  */
  async _applyStyleWithRetry(e, t = 3, r = 100) {
    let i = null;
    for (let o = 1; o <= t; o++)
      try {
        this._renderObject.parent || (this.add(this._renderObject), await new Promise((c) => requestAnimationFrame(c))), await e.applyTo(this._renderObject);
        const l = e.config;
        if (l.bloom !== void 0) {
          const c = l.bloom;
          typeof c == "boolean" ? this._bloomConfig = {
            enabled: c,
            intensity: 1,
            color: "#ffffff"
          } : this._bloomConfig = {
            enabled: c.enabled ?? !0,
            intensity: c.intensity ?? 1,
            color: c.color ?? "#ffffff"
          };
        }
        this._bloomConfig && this._renderObject && this._applyBloomToObject(this._renderObject);
        return;
      } catch (l) {
        if (i = l, o < t) {
          const c = r * Math.pow(2, o - 1);
          await new Promise((u) => setTimeout(u, c));
        }
      }
    throw i || new Error("样式应用失败，重试次数耗尽");
  }
  /**
   * Process style queue
   * 处理样式队列
   * 
   * @private
   * @returns Promise<void>
   */
  async _processStyleQueue() {
    if (!this._renderObject || this._isApplyingStyle || this._styleQueue.length === 0)
      return;
    this._isApplyingStyle = !0;
    const e = this._styleQueue[0];
    try {
      const t = new Jt(JSON.parse(JSON.stringify(e)));
      await this._applyStyleWithRetry(t), this._styleQueue.shift(), this._styleQueue.length > 0 && await this._processStyleQueue();
    } catch (t) {
      throw t;
    } finally {
      this._isApplyingStyle = !1, this._styleQueue.length > 0 && this._tryProcessQueue();
    }
  }
  /**
   * Try to process style queue
   * 尝试处理样式队列
   * 
   * @private
   */
  _tryProcessQueue() {
    this._renderObject && !this._isApplyingStyle && this._styleQueue.length > 0 ? this._processStyleQueue().catch((t) => {
      this._isApplyingStyle = !1, this._tryProcessQueue(), console.warn(t);
    }) : !this._renderObject && !this._isGeometryInitializing && this.initializeGeometry();
  }
  /**
   * Add feature to layer
   * 将要素添加到图层
   * 
   * @param layer - Target layer 目标图层
   * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
   */
  addTo(e) {
    return e.addFeature(this), this;
  }
  /**
   * Get parent layer
   * 获取所属图层
   * 
   * @returns Layer instance or null 图层实例或null
   */
  getLayer() {
    return this._layer || null;
  }
  /**
   * Get parent map
   * 获取所属地图
   * 
   * @returns Map instance or null 地图实例或null
   */
  getMap() {
    return this._layer ? this._layer.getMap() : null;
  }
  /**
   * Set feature coordinates (geographic coordinates)
   * 设置要素坐标（地理坐标）
   * 
   * @param coordinates - Longitude and latitude coordinates 经纬度坐标
   * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
   */
  setCoordinates(e) {
    return this._geometry.coordinates = e, this._applyCoordinateChanges(), this;
  }
  /**
   * Internal processing after coordinate change
   * 坐标变化后的内部处理
   * 
   * @param fastUpdate - Whether to use fast update mode (only updates vertex positions, does not rebuild geometry) 是否使用快速更新模式（仅更新顶点位置，不重建几何体）
   */
  _applyCoordinateChanges(e = !1) {
    e && this._renderObject ? this._refreshCoordinates() : this._buildRenderObject(), this.trigger("positionchange");
  }
  /**
   * Get feature center (geographic coordinates)
   * 获取要素中心点（地理坐标）
   * 
   * @returns Center coordinates [lng, lat] 中心点坐标 [经度, 纬度]
   */
  getCenter() {
    return this._geometry.type === "Point" ? this._geometry.coordinates : [0, 0];
  }
  /**
   * Bind to layer (internal use)
   * 绑定到图层（内部使用）
   * 
   * @param layer - Layer instance 图层实例
   * @throws Throws error if feature already belongs to another layer 如果要素已属于其他图层会抛出错误
   */
  _bindLayer(e) {
    if (this._layer && this._layer !== e)
      throw new Error("Feature cannot be added to multiple layers");
    this._layer = e;
  }
  /**
   * Update geometry
   * 更新几何体
   */
  _updateGeometry() {
    this._disposeGeometry(), this._renderObject && (this._renderObject.position.copy(this._worldCoordinates), this._renderObject?.userData?._type === "Model" ? this._renderObject.renderOrder = 0 : this._renderObject.renderOrder = 99, this.add(this._renderObject), this.updateMatrixWorld(!0), this._tryProcessQueue());
  }
  /**
   * Remove self from layer
   * 从图层中移除自身
   * 
   * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
   */
  _remove() {
    return this.getLayer() ? (this._unbind(), this) : this;
  }
  /**
   * Unbind from layer (internal use)
   * 解除图层绑定（内部使用）
   */
  _unbind() {
    const e = this.getLayer();
    e && (e.onRemoveFeature && e.onRemoveFeature(this), delete this._layer);
  }
  /**
   * Dispose geometry resources
   * 释放几何体资源
   */
  _disposeGeometry() {
    this._renderObject && (this.clear(), "traverse" in this && this._renderObject.traverse((e) => {
      e instanceof Ue ? (e.geometry?.dispose(), Array.isArray(e.material) ? e.material.forEach((t) => t.dispose()) : e.material?.dispose()) : "isLine" in e && e.isLine && (e.geometry?.dispose(), e.material?.dispose());
    }));
  }
  // === ICollidable 接口实现 ===
  /**
   * Get whether collision detection is enabled
   * 获取是否启用碰撞检测
   * 
   * @returns Whether collision detection is enabled 是否启用碰撞检测
   */
  get collidable() {
    return this._collisionConfig.enabled;
  }
  /**
   * Get collision type (subclasses need to override)
   * 获取碰撞类型（子类需要重写）
   * 
   * @returns Collision type 碰撞类型
   */
  get collisionType() {
    return Jd.POINT;
  }
  /**
   * Get collision priority
   * 获取碰撞优先级
   * 
   * Priority calculation order:
   * 优先级计算顺序：
   * 1. Priority in user data
   * 1. 用户数据中的优先级
   * 2. Priority in style configuration
   * 2. 样式配置中的优先级
   * 3. Default priority
   * 3. 默认优先级
   * 
   * @returns Collision priority value 碰撞优先级数值
   */
  getCollisionPriority() {
    return this.userData.collisionPriority ?? // 用户数据优先级
    this._style?.config.collisionPriority ?? // 样式配置优先级  
    this._collisionConfig.priority;
  }
  /**
   * Get screen space bounding box
   * 获取屏幕空间包围盒
   * 
   * Calculate the bounding box of the feature in screen space for collision detection
   * 计算要素在屏幕空间中的包围盒，用于碰撞检测
   * 
   * @param camera - Current camera 当前相机
   * @param renderer - Renderer instance 渲染器实例
   * @returns Bounding box info or null (if invisible or calculation failed) 包围盒信息或null（如果不可见或计算失败）
   */
  getScreenBoundingBox(e, t) {
    if (!this.collidable) return null;
    try {
      const r = new I();
      this._renderObject.getWorldPosition(r);
      const i = r.clone().project(e);
      if (!(i.x >= -1.1 && i.x <= 1.1 && i.y >= -1.1 && i.y <= 1.1 && i.z >= -1 && i.z <= 1))
        return null;
      const { width: l, height: c } = t.domElement, u = (i.x * 0.5 + 0.5) * l, f = (-i.y * 0.5 + 0.5) * c, p = this._calculateCollisionBoundingBox(e, t);
      return p ? {
        id: this._id,
        // 包围盒ID
        x: u + p.offsetX,
        // 屏幕X坐标 + 偏移量
        y: f + p.offsetY,
        // 屏幕Y坐标 + 偏移量  
        width: 20 + this._collisionConfig.padding * 2,
        // 宽度 + 边距
        height: 20 + this._collisionConfig.padding * 2,
        // 高度 + 边距
        priority: this.getCollisionPriority(),
        // 动态优先级
        featureId: this._id,
        // 关联的要素ID
        layerId: this._layer?.getId() || "unknown",
        // 图层ID
        type: this.collisionType,
        // 碰撞类型
        data: this.getCollisionData()
        // 扩展数据
      } : null;
    } catch (r) {
      return console.warn(`Feature ${this._id} 包围盒计算失败:`, r), null;
    }
  }
  /**
   * Set collision visibility
   * 设置碰撞可见性
   * 
   * Control the display state of the feature after collision detection, supporting smooth transition animation
   * 控制要素在碰撞检测后的显示状态，支持平滑过渡动画
   * 
   * @param visible - Whether visible 是否可见
   * @param reason - Reason for visibility change 可见性变化原因
   */
  setCollisionVisibility(e, t = Pr.MANUAL_HIDDEN) {
    this._collisionState.visible !== e && (this._animationRef !== null && (cancelAnimationFrame(this._animationRef), this._animationRef = null), this.visible = e, this._applyFinalAlpha(e ? 1 : 0), this._collisionState = {
      visible: e,
      reason: t,
      collidedWith: e ? [] : this._collisionState.collidedWith,
      timestamp: Date.now()
    });
  }
  /**
   * Get current collision visibility
   * 获取当前碰撞可见性
   * 
   * @returns Current visibility state 当前可见性状态
   */
  getCollisionVisibility() {
    return this._collisionState.visible;
  }
  // === 避让配置方法 ===
  /**
   * Set collision detection configuration
   * 设置碰撞检测配置
   * 
   * @param config - Collision configuration options 碰撞配置选项
   * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
   */
  setCollisionConfig(e) {
    return Object.assign(this._collisionConfig, e), this;
  }
  /**
   * Enable collision detection
   * 启用碰撞检测
   * 
   * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
   */
  enableCollision() {
    return this._collisionConfig.enabled = !0, this;
  }
  /**
   * Disable collision detection
   * 禁用碰撞检测
   * 
   * @returns Current feature instance (supports method chaining) 当前要素实例（支持链式调用）
   */
  disableCollision() {
    return this._collisionConfig.enabled = !1, this.setCollisionVisibility(!0, Pr.MANUAL_HIDDEN), this;
  }
  // === 私有方法 ===
  /**
   * Apply alpha to all child objects
   * 应用透明度到所有子对象
   * 
   * Recursively traverse all child objects, set transparency uniformly, support single and multiple materials
   * 递归遍历所有子对象，统一设置透明度，支持单个和多个材质
   * 
   * @param alpha - Alpha value (0-1) 透明度值（0-1）
   * @private
   */
  _applyVisibilityAlpha(e) {
    this.traverse((t) => {
      t instanceof Ue && (Array.isArray(t.material) ? t.material.forEach((r) => {
        r.opacity !== void 0 && (r.opacity = e);
      }) : t.material.opacity !== void 0 && (t.material.opacity = e));
    });
  }
  /**
   * Apply final alpha and force update
   * 应用最终透明度并强制更新
   * 
   * @param alpha - Alpha value (0-1) 透明度值（0-1）
   * @private
   */
  _applyFinalAlpha(e) {
    this._applyVisibilityAlpha(e), this.traverse((t) => {
      t instanceof Ue && (t.material.needsUpdate = !0);
    });
  }
  // /**
  //  * 触发碰撞状态变化事件
  //  * 
  //  * @param oldState - 旧状态
  //  * @param newState - 新状态
  //  * @private
  //  */
  // private _fireCollisionStateChange(oldState: ICollisionState, newState: ICollisionState): void {
  //     this.fire('collisionstatechange', {
  //         feature: this,
  //         oldState,
  //         newState,
  //         timestamp: Date.now()
  //     });
  // }
  /**
   * Get collision related data
   * 获取碰撞相关数据
   * 
   * @returns Object containing feature type, user data, and style config 包含要素类型、用户数据、样式配置的对象
   */
  getCollisionData() {
    return {
      featureType: this.constructor.name,
      userData: this.userData,
      styleConfig: this._style?.config
    };
  }
  /**
   * Calculate bounding box for collision detection
   * 计算碰撞检测用的包围盒
   * 
   * Project world space bounding box to screen space to calculate pixel-level bounding box
   * 将世界空间包围盒投影到屏幕空间，计算像素级别的包围盒
   * 
   * @param camera - Current camera 当前相机
   * @param renderer - Renderer instance 渲染器实例
   * @returns Bounding box info or null (if calculation failed) 包围盒信息或null（如果计算失败）
   * @private
   */
  _calculateCollisionBoundingBox(e, t) {
    if (!this.visible || !this._renderObject || !e || !t) return null;
    try {
      const r = new en().setFromObject(this._renderObject);
      if (r.isEmpty()) return this._getFallbackBoundingBox();
      const i = [
        new I(r.min.x, r.min.y, r.min.z),
        new I(r.max.x, r.min.y, r.min.z),
        new I(r.min.x, r.max.y, r.min.z),
        new I(r.max.x, r.max.y, r.min.z),
        new I(r.min.x, r.min.y, r.max.z),
        new I(r.max.x, r.min.y, r.max.z),
        new I(r.min.x, r.max.y, r.max.z),
        new I(r.max.x, r.max.y, r.max.z)
      ], { width: o, height: l } = t.domElement, c = [];
      i.forEach((z) => {
        const j = z.clone().project(e), V = (j.x * 0.5 + 0.5) * o, R = (-j.y * 0.5 + 0.5) * l;
        c.push(new ce(V, R));
      });
      let u = 1 / 0, f = -1 / 0, p = 1 / 0, d = -1 / 0;
      c.forEach((z) => {
        u = Math.min(u, z.x), f = Math.max(f, z.x), p = Math.min(p, z.y), d = Math.max(d, z.y);
      });
      const g = f - u, y = d - p, b = 4, T = Math.max(g, b), x = Math.max(y, b), E = new I();
      r.getCenter(E);
      const M = E.clone().project(e), A = (M.x * 0.5 + 0.5) * o, D = (-M.y * 0.5 + 0.5) * l;
      return {
        width: T,
        height: x,
        offsetX: u - A,
        // Offset of top-left corner relative to center 左上角相对于中心的偏移
        offsetY: p - D
      };
    } catch (r) {
      return console.warn("Bounding box calculation failed 包围盒计算失败:", r), this._getFallbackBoundingBox();
    }
  }
  /**
   * Get fallback bounding box (used when calculation fails)
   * 获取备用包围盒（计算失败时使用）
   * 
   * @returns Default bounding box info 默认包围盒信息
   * 
   */
  _getFallbackBoundingBox() {
    return {
      width: 20,
      height: 20,
      offsetX: -10,
      offsetY: -10
    };
  }
  /**
   * Convert tile coordinates to local world coordinates
   * 将瓦片坐标转换为本地世界坐标
   * 
   * @param rawX - Raw X coordinate 原始X坐标
   * @param rawY - Raw Y coordinate 原始Y坐标
   * @param tileData - Tile data 瓦片数据
   * @param map - Map instance 地图实例
   * @returns Local world coordinate vector 本地世界坐标向量
   * @private
   */
  // @ts-ignore
  _tileCoordToLocalWorld(e, t, r, i) {
    const { tileZ: o, tileX: l, tileY: c, extent: u, tileSize: f } = r, p = (e / u - 0.5) * f, d = (0.5 - t / u) * f;
    return i.tileIDToWorldCenter(o, l, c).clone().add(new I(p, d, 0)).sub(i.prjcenter);
  }
}
var kT = Object.defineProperty, zT = (s, e, t) => e in s ? kT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Rf = (s, e, t) => zT(s, typeof e != "symbol" ? e + "" : e, t);
class wi extends ca {
  // _collisionDetector: CollisionDetector<T>; // Changed to protected for subclass access 改为protected以便子类访问
  constructor(e, t) {
    super(e, t), Rf(this, "_feaList"), Rf(this, "_collision", !1), this._feaList = [], t?.collision && (this._collision = !0);
  }
  /**
   * Add Feature(s) to the layer.
   * 添加Feature到图层
   * @param features Feature instance or array of instances to add.
   *                 要添加的Feature实例或实例数组
   * @returns this
   */
  addFeature(e) {
    const t = Array.isArray(e) ? e : [e];
    for (const r of t)
      if (!(!r || !(r instanceof gt)) && !r.getLayer()) {
        if (!this.validateFeature(r)) {
          console.error(`Feature ${r.id} does not match the layer's type requirements`);
          continue;
        }
        r._bindLayer(this), this._feaList.push(r), r.getMap() && r._buildRenderObject(), this._clouds && (this.map.viewer.scene.add(this._clouds), console.log("我是云朵被添加cloud", this.map.viewer.scene)), this.add(r);
      }
    return this;
  }
  /**
   * Get all Features.
   * 获取所有的Features
   * @param filter Filter function.
   *               过滤函数
   * @param context Filter function context.
   *                过滤函数上下文
   * @returns Filtered Feature array.
   *          过滤后的Feature数组
   */
  getFeatures(e, t) {
    if (!e)
      return this._feaList.slice(0);
    const r = [];
    let i, o;
    for (let l = 0, c = this._feaList.length; l < c; l++)
      i = this._feaList[l], t ? o = e.call(t, i) : o = e(i), o && r.push(i);
    return r;
  }
  /**
   * Get number of features.
   * 获取features个数
   * @return Feature count.
   *         features数量
   */
  getCount() {
    return this._feaList.length;
  }
  /**
   * Check if layer is empty.
   * layer是否为空
   * @return Whether empty.
   *         是否为空
   */
  isEmpty() {
    return !this._feaList.length;
  }
  /**
   * Remove one or more features.
   * 移除一个或多个features
   * @param features Feature(s) to remove.
   *                 要移除的feature或数组
   * @returns this
   */
  removeFeature(e) {
    if (!Array.isArray(e))
      return this.removeFeature([e]);
    for (let t = e.length - 1; t >= 0; t--)
      e[t] instanceof gt || (e[t] = this.removeFeature(e[t])), !(!e[t] || this !== e[t].getLayer()) && e[t]._remove();
    return this;
  }
  /**
   * Clear all features in the layer.
   * 清空图层中的所有要素
   * @returns this
   */
  clear() {
    const e = this._feaList.slice();
    for (const t of e)
      t._remove();
    return this;
  }
  /**
   * Handler when removing a feature.
   * 移除feature时的处理
   * @param feature Feature to remove.
   *                要移除的feature
   */
  onRemoveFeature(e) {
    if (!e) return;
    const t = e.getLayer();
    if (!t || t !== this)
      return;
    const r = this._findInList(e);
    r >= 0 && this._feaList.splice(r, 1), e.parent && e.parent === this ? this.remove(e) : console.warn("Feature parent mismatch:", e.parent), this._disposeFeatureResources(e);
  }
  /**
   * Binary search algorithm.
   * 二分查找算法
   * 
   * @description
   * Requires combination with layer index.
   * 需要和图层的index结合。
   * 
   * @internal
   */
  _findInList(e) {
    const t = this._feaList.length;
    if (t === 0)
      return -1;
    let r = 0, i = t - 1, o;
    for (; r <= i; ) {
      if (o = Math.floor((r + i) / 2), this._feaList[o] === e)
        return o;
      r = o + 1;
    }
    return -1;
  }
  /**
   * Dispose feature resources recursively.
   * 递归释放要素资源
   * 
   * @private
   */
  _disposeFeatureResources(e) {
    try {
      e.geometry && e.geometry.dispose && e.geometry.dispose(), e.material && (Array.isArray(e.material) ? e.material.forEach((t) => t.dispose?.()) : e.material.dispose && e.material.dispose()), e instanceof mr && e.traverse((t) => {
        t !== e && this._disposeFeatureResources(t);
      });
    } catch (t) {
      console.error("Error disposing feature resources:", t);
    }
  }
  // override animate(delta: number, elapsedtime: number, context: Viewer) {
  //     if (this._collision) {
  //         // Update collision system 更新避让系统
  //         console.log('Update collision system 更新避让系统了', delta, elapsedtime);
  //         this.collisionEngine.update(context.camera);
  //     }
  // }
  /**
   * Merge geometries (TODO).
   * 几何体合并 (待办)
   */
  _mergedGeometry() {
    this.traverse((e) => {
      e.isMesh && e.geometry && e.material && console.log("Merging geometry 几何体合并中", e);
    });
  }
  // *=== Collision Detection Related ===*
  // *=== 碰撞检测相关 ===*
  /**
  * Set collision engine (Pluggable design).
  * 设置避让系统（可插拔设计）
  * 
  * @param engine Collision engine instance. 避让引擎实例。
  */
  setCollisionEngine(e) {
    return this._collisionEngine = e, this;
  }
}
var NT = Object.defineProperty, HT = (s, e, t) => e in s ? NT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Bf = (s, e, t) => HT(s, typeof e != "symbol" ? e + "" : e, t);
class VT extends Qt {
  constructor() {
    super(...arguments), Bf(this, "_layers", /* @__PURE__ */ new Set()), Bf(this, "_layerids", /* @__PURE__ */ new Set());
  }
  /**
   * Add layers to the container.
   * 添加图层到容器
   * @param layers Layer instances to add.
   *               要添加的图层实例
   * @returns this
   * @throws Throws error if adding non-Layer instance or duplicate ID.
   *         如果添加非Layer实例或ID重复会抛出错误
   * 
   * @override
   */
  add(...e) {
    return e.forEach((t) => {
      if (!(t instanceof ca))
        throw new Error("LayerContainer can only contain Layer instances! LayerContainer只能包含Layer实例!");
      const r = t.getId();
      if (this._layerids.has(r))
        throw new Error(`Layer with ID '${r}' already exists in the container! ID为'${r}'的图层已存在于容器中!`);
      this._layers.add(t), this._layerids.add(r), super.add(t);
    }), this;
  }
  /**
   * Remove layers from the container.
   * 从容器移除图层
   * @param layers Layer instances to remove.
   *               要移除的图层实例
   * @returns this
   * 
   * @override
   */
  remove(...e) {
    return e.forEach((t) => {
      this._layers.delete(t), this._layerids.delete(t.getId()), super.remove(t);
    }), this;
  }
  /**
   * Get all layers.
   * 获取所有图层
   * @returns Array of layers.
   *          图层数组
   */
  getLayers() {
    return Array.from(this._layers);
  }
  /**
   * Find layer by ID.
   * 根据ID查找图层
   * @param id Layer ID to find.
   *           要查找的图层ID
   * @returns Found layer instance, or undefined if not found.
   *          找到的图层实例，未找到返回undefined
   */
  getLayerById(e) {
    for (const t of this._layers)
      if (t.getId() === e)
        return t;
  }
  /**
   * Clear all layers.
   * 清空所有图层
   * @returns this
   */
  clearLayers() {
    return this._layers.clear(), this._layerids.clear(), super.clear(), this;
  }
}
var WT = Object.defineProperty, GT = (s, e, t) => e in s ? WT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, jT = (s, e, t) => GT(s, e + "", t);
class $T {
  constructor() {
    jT(this, "canvasDict", {});
  }
  /**
   * 获取指定尺寸的画布
   * @param baseWidth 画布基础宽度（逻辑像素）
   * @param baseHeight 画布基础高度（逻辑像素）
   * @param resolutionScale 分辨率缩放因子（默认为1）
   * @param keySuffix 缓存键名后缀（可选）
   * @returns HTMLCanvasElement实例
   * 
   * @example
   * // 获取一个40x30的基础画布
   * const canvas1 = manager.getCanvas(40, 30);
   * 
   * // 获取一个2倍分辨率的40x30画布
   * const canvas2 = manager.getCanvas(40, 30, 2);
   * 
   * // 获取带特定后缀的缓存画布
   * const canvas3 = manager.getCanvas(40, 30, 1, 'special');
   */
  getCanvas(e = 40, t = 30, r = 1, i) {
    const o = Math.ceil(e * r), l = Math.ceil(t * r), c = i ? `${o}_${l}_${i}` : `${o}_${l}`;
    if (!this.canvasDict[c]) {
      const p = document.createElement("canvas");
      p.width = o, p.height = l, this.canvasDict[c] = p;
    }
    const u = this.canvasDict[c], f = u.getContext("2d");
    return f.setTransform(1, 0, 0, 1, 0, 0), f.clearRect(0, 0, u.width, u.height), f.scale(r, r), u;
  }
}
function XT(s) {
  const e = +this._x.call(null, s), t = +this._y.call(null, s);
  return ep(this.cover(e, t), e, t, s);
}
function ep(s, e, t, r) {
  if (isNaN(e) || isNaN(t)) return s;
  var i, o = s._root, l = { data: r }, c = s._x0, u = s._y0, f = s._x1, p = s._y1, d, g, y, b, T, x, E, M;
  if (!o) return s._root = l, s;
  for (; o.length; )
    if ((T = e >= (d = (c + f) / 2)) ? c = d : f = d, (x = t >= (g = (u + p) / 2)) ? u = g : p = g, i = o, !(o = o[E = x << 1 | T])) return i[E] = l, s;
  if (y = +s._x.call(null, o.data), b = +s._y.call(null, o.data), e === y && t === b) return l.next = o, i ? i[E] = l : s._root = l, s;
  do
    i = i ? i[E] = new Array(4) : s._root = new Array(4), (T = e >= (d = (c + f) / 2)) ? c = d : f = d, (x = t >= (g = (u + p) / 2)) ? u = g : p = g;
  while ((E = x << 1 | T) === (M = (b >= g) << 1 | y >= d));
  return i[M] = o, i[E] = l, s;
}
function YT(s) {
  var e, t, r = s.length, i, o, l = new Array(r), c = new Array(r), u = 1 / 0, f = 1 / 0, p = -1 / 0, d = -1 / 0;
  for (t = 0; t < r; ++t)
    isNaN(i = +this._x.call(null, e = s[t])) || isNaN(o = +this._y.call(null, e)) || (l[t] = i, c[t] = o, i < u && (u = i), i > p && (p = i), o < f && (f = o), o > d && (d = o));
  if (u > p || f > d) return this;
  for (this.cover(u, f).cover(p, d), t = 0; t < r; ++t)
    ep(this, l[t], c[t], s[t]);
  return this;
}
function ZT(s, e) {
  if (isNaN(s = +s) || isNaN(e = +e)) return this;
  var t = this._x0, r = this._y0, i = this._x1, o = this._y1;
  if (isNaN(t))
    i = (t = Math.floor(s)) + 1, o = (r = Math.floor(e)) + 1;
  else {
    for (var l = i - t || 1, c = this._root, u, f; t > s || s >= i || r > e || e >= o; )
      switch (f = (e < r) << 1 | s < t, u = new Array(4), u[f] = c, c = u, l *= 2, f) {
        case 0:
          i = t + l, o = r + l;
          break;
        case 1:
          t = i - l, o = r + l;
          break;
        case 2:
          i = t + l, r = o - l;
          break;
        case 3:
          t = i - l, r = o - l;
          break;
      }
    this._root && this._root.length && (this._root = c);
  }
  return this._x0 = t, this._y0 = r, this._x1 = i, this._y1 = o, this;
}
function KT() {
  var s = [];
  return this.visit(function(e) {
    if (!e.length) do
      s.push(e.data);
    while (e = e.next);
  }), s;
}
function qT(s) {
  return arguments.length ? this.cover(+s[0][0], +s[0][1]).cover(+s[1][0], +s[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function pt(s, e, t, r, i) {
  this.node = s, this.x0 = e, this.y0 = t, this.x1 = r, this.y1 = i;
}
function QT(s, e, t) {
  var r, i = this._x0, o = this._y0, l, c, u, f, p = this._x1, d = this._y1, g = [], y = this._root, b, T;
  for (y && g.push(new pt(y, i, o, p, d)), t == null ? t = 1 / 0 : (i = s - t, o = e - t, p = s + t, d = e + t, t *= t); b = g.pop(); )
    if (!(!(y = b.node) || (l = b.x0) > p || (c = b.y0) > d || (u = b.x1) < i || (f = b.y1) < o))
      if (y.length) {
        var x = (l + u) / 2, E = (c + f) / 2;
        g.push(
          new pt(y[3], x, E, u, f),
          new pt(y[2], l, E, x, f),
          new pt(y[1], x, c, u, E),
          new pt(y[0], l, c, x, E)
        ), (T = (e >= E) << 1 | s >= x) && (b = g[g.length - 1], g[g.length - 1] = g[g.length - 1 - T], g[g.length - 1 - T] = b);
      } else {
        var M = s - +this._x.call(null, y.data), A = e - +this._y.call(null, y.data), D = M * M + A * A;
        if (D < t) {
          var z = Math.sqrt(t = D);
          i = s - z, o = e - z, p = s + z, d = e + z, r = y.data;
        }
      }
  return r;
}
function JT(s) {
  if (isNaN(p = +this._x.call(null, s)) || isNaN(d = +this._y.call(null, s))) return this;
  var e, t = this._root, r, i, o, l = this._x0, c = this._y0, u = this._x1, f = this._y1, p, d, g, y, b, T, x, E;
  if (!t) return this;
  if (t.length) for (; ; ) {
    if ((b = p >= (g = (l + u) / 2)) ? l = g : u = g, (T = d >= (y = (c + f) / 2)) ? c = y : f = y, e = t, !(t = t[x = T << 1 | b])) return this;
    if (!t.length) break;
    (e[x + 1 & 3] || e[x + 2 & 3] || e[x + 3 & 3]) && (r = e, E = x);
  }
  for (; t.data !== s; ) if (i = t, !(t = t.next)) return this;
  return (o = t.next) && delete t.next, i ? (o ? i.next = o : delete i.next, this) : e ? (o ? e[x] = o : delete e[x], (t = e[0] || e[1] || e[2] || e[3]) && t === (e[3] || e[2] || e[1] || e[0]) && !t.length && (r ? r[E] = t : this._root = t), this) : (this._root = o, this);
}
function eS(s) {
  for (var e = 0, t = s.length; e < t; ++e) this.remove(s[e]);
  return this;
}
function tS() {
  return this._root;
}
function rS() {
  var s = 0;
  return this.visit(function(e) {
    if (!e.length) do
      ++s;
    while (e = e.next);
  }), s;
}
function iS(s) {
  var e = [], t, r = this._root, i, o, l, c, u;
  for (r && e.push(new pt(r, this._x0, this._y0, this._x1, this._y1)); t = e.pop(); )
    if (!s(r = t.node, o = t.x0, l = t.y0, c = t.x1, u = t.y1) && r.length) {
      var f = (o + c) / 2, p = (l + u) / 2;
      (i = r[3]) && e.push(new pt(i, f, p, c, u)), (i = r[2]) && e.push(new pt(i, o, p, f, u)), (i = r[1]) && e.push(new pt(i, f, l, c, p)), (i = r[0]) && e.push(new pt(i, o, l, f, p));
    }
  return this;
}
function nS(s) {
  var e = [], t = [], r;
  for (this._root && e.push(new pt(this._root, this._x0, this._y0, this._x1, this._y1)); r = e.pop(); ) {
    var i = r.node;
    if (i.length) {
      var o, l = r.x0, c = r.y0, u = r.x1, f = r.y1, p = (l + u) / 2, d = (c + f) / 2;
      (o = i[0]) && e.push(new pt(o, l, c, p, d)), (o = i[1]) && e.push(new pt(o, p, c, u, d)), (o = i[2]) && e.push(new pt(o, l, d, p, f)), (o = i[3]) && e.push(new pt(o, p, d, u, f));
    }
    t.push(r);
  }
  for (; r = t.pop(); )
    s(r.node, r.x0, r.y0, r.x1, r.y1);
  return this;
}
function sS(s) {
  return s[0];
}
function oS(s) {
  return arguments.length ? (this._x = s, this) : this._x;
}
function aS(s) {
  return s[1];
}
function lS(s) {
  return arguments.length ? (this._y = s, this) : this._y;
}
function tp(s, e, t) {
  var r = new Ac(e ?? sS, t ?? aS, NaN, NaN, NaN, NaN);
  return s == null ? r : r.addAll(s);
}
function Ac(s, e, t, r, i, o) {
  this._x = s, this._y = e, this._x0 = t, this._y0 = r, this._x1 = i, this._y1 = o, this._root = void 0;
}
function Uf(s) {
  for (var e = { data: s.data }, t = e; s = s.next; ) t = t.next = { data: s.data };
  return e;
}
var _t = tp.prototype = Ac.prototype;
_t.copy = function() {
  var s = new Ac(this._x, this._y, this._x0, this._y0, this._x1, this._y1), e = this._root, t, r;
  if (!e) return s;
  if (!e.length) return s._root = Uf(e), s;
  for (t = [{ source: e, target: s._root = new Array(4) }]; e = t.pop(); )
    for (var i = 0; i < 4; ++i)
      (r = e.source[i]) && (r.length ? t.push({ source: r, target: e.target[i] = new Array(4) }) : e.target[i] = Uf(r));
  return s;
};
_t.add = XT;
_t.addAll = YT;
_t.cover = ZT;
_t.data = KT;
_t.extent = qT;
_t.find = QT;
_t.remove = JT;
_t.removeAll = eS;
_t.root = tS;
_t.size = rS;
_t.visit = iS;
_t.visitAfter = nS;
_t.x = oS;
_t.y = lS;
var cS = Object.defineProperty, uS = (s, e, t) => e in s ? cS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, kf = (s, e, t) => uS(s, typeof e != "symbol" ? e + "" : e, t);
class rp {
  /**
   * Constructor
   * 构造函数
   * 
   * @param viewport Viewport dimensions defining the QuadTree boundaries
   *                 视口尺寸，定义四叉树的边界范围
   */
  constructor(e) {
    kf(this, "_quadtree"), kf(this, "_viewport"), this._viewport = e, this._rebuildQuadTree();
  }
  /**
   * Update viewport dimensions
   * 更新视口尺寸
   * 
   * @description
   * Rebuilds the QuadTree to adapt to new boundaries when viewport size changes.
   * 当视口大小改变时，重新构建四叉树以适应新的边界
   * 
   * @param viewport New viewport dimensions
   *                 新的视口尺寸
   */
  updateViewport(e) {
    (e.width !== this._viewport.width || e.height !== this._viewport.height) && (this._viewport = e, this._rebuildQuadTree());
  }
  /**
   * Add bounding boxes to QuadTree
   * 添加边界框到四叉树
   * 
   * @description
   * Only adds bounding boxes located within the viewport to optimize memory usage.
   * 只添加位于视口内的边界框，优化内存使用
   * 
   * @param boxes Array of bounding boxes to add
   *              要添加的边界框数组
   */
  addBoxes(e) {
    e.forEach((t) => {
      this._isBoxInViewport(t) && this._quadtree.add(t);
    });
  }
  /**
   * Find all bounding boxes colliding with the target box
   * 查找与目标边界框发生碰撞的所有边界框
   * 
   * @description
   * Uses QuadTree spatial partitioning to optimize search performance.
   * 使用四叉树的空间分割特性优化搜索性能
   * 
   * @param targetBox Target bounding box
   *                  目标边界框
   * @returns Array of colliding bounding boxes
   *          与目标边界框发生碰撞的所有边界框数组
   */
  findCollisions(e) {
    const t = [], r = this._getSearchBounds(e);
    return this._quadtree.visit((i, o, l, c, u) => this._checkNodeCollision(r, o, l, c, u) ? (i.length || this._getNodeData(i).forEach((p) => {
      p.id !== e.id && this._checkBoxCollision(e, p) && t.push(p);
    }), !1) : void 0), t;
  }
  /**
   * Clear all data in QuadTree
   * 清空四叉树中的所有数据
   * 
   * @description
   * Clears by rebuilding the QuadTree.
   * 通过重建四叉树实现清空操作
   */
  clear() {
    this._rebuildQuadTree();
  }
  /**
   * Get all bounding boxes stored in QuadTree
   * 获取四叉树中存储的所有边界框
   * 
   * @description
   * Used for debugging or serializing QuadTree state.
   * 用于调试或序列化四叉树状态
   * 
   * @returns Array of all bounding boxes in QuadTree
   *          四叉树中所有边界框的数组
   */
  getAllBoxes() {
    const e = [];
    return this._quadtree.visit((t) => {
      if (!t.length) {
        const r = this._getNodeData(t);
        e.push(...r);
      }
      return !1;
    }), e;
  }
  // ============ Private Methods 私有方法 ============
  /**
   * Rebuild QuadTree
   * 重建四叉树
   * 
   * @description
   * Reinitializes QuadTree structure based on current viewport dimensions.
   * Called when viewport changes or clearing data.
   * 根据当前视口尺寸重新初始化四叉树结构
   * 在视口改变或清空操作时调用
   */
  _rebuildQuadTree() {
    this._quadtree = tp().x((e) => e.x).y((e) => e.y).extent([[0, 0], [this._viewport.width, this._viewport.height]]);
  }
  /**
   * Check if bounding box is within viewport
   * 检查边界框是否在视口内
   * 
   * @description
   * Used to filter out objects outside viewport to optimize performance.
   * 用于过滤掉视口外的对象，优化性能
   * 
   * @param box Bounding box to check
   *            要检查的边界框
   * @returns True if box is within viewport, false otherwise
   *          如果边界框在视口内返回true，否则返回false
   */
  _isBoxInViewport(e) {
    const t = e.width / 2, r = e.height / 2;
    return e.x + t >= 0 && // Right edge within right of viewport 右边界在视口右侧以内
    e.x - t <= this._viewport.width && // Left edge within left of viewport 左边界在视口左侧以内
    e.y + r >= 0 && // Bottom edge within bottom of viewport 下边界在视口底部以内
    e.y - r <= this._viewport.height;
  }
  /**
   * Get expanded search bounds
   * 获取扩大的搜索边界范围
   * 
   * @description
   * Expands search range to avoid missing edge objects, improving collision detection accuracy.
   * 扩大搜索范围以避免边界对象漏检，提高碰撞检测的准确性
   * 
   * @param box Original bounding box
   *            原始边界框
   * @returns Expanded search bounds
   *          扩大后的搜索边界
   */
  _getSearchBounds(e) {
    return {
      x: e.x,
      y: e.y,
      width: e.width * 2,
      // Width expanded 宽度扩大
      height: e.height * 2
      // Height expanded 高度扩大
    };
  }
  /**
   * Check collision between search bounds and QuadTree node
   * 检查搜索边界与四叉树节点的碰撞
   * 
   * @description
   * Uses AABB (Axis-Aligned Bounding Box) collision detection algorithm.
   * 使用AABB（轴对齐边界框）碰撞检测算法
   * 
   * @param box Search bounding box
   *            搜索边界框
   * @param x0 Node bottom-left x
   *           节点左下角x坐标
   * @param y0 Node bottom-left y
   *           节点左下角y坐标
   * @param x1 Node top-right x
   *           节点右上角x坐标
   * @param y1 Node top-right y
   *           节点右上角y坐标
   * @returns True if intersecting, false otherwise
   *          如果相交返回true，否则返回false
   */
  _checkNodeCollision(e, t, r, i, o) {
    const l = (t + i) / 2, c = (r + o) / 2, u = i - t, f = o - r;
    return Math.abs(e.x - l) * 2 < e.width + u && Math.abs(e.y - c) * 2 < e.height + f;
  }
  /**
   * 检查两个边界框之间的碰撞
   * 使用AABB碰撞检测算法
   * @param a 第一个边界框
   * @param b 第二个边界框
   * @returns 如果发生碰撞返回true，否则返回false
   */
  _checkBoxCollision(e, t) {
    return Math.abs(e.x - t.x) * 2 < e.width + t.width && // x轴方向碰撞检测
    Math.abs(e.y - t.y) * 2 < e.height + t.height;
  }
  /**
   * 从四叉树节点中提取边界框数据
   * 处理d3-quadtree节点的不同数据结构形式
   * @param node 四叉树节点
   * @returns 节点中包含的边界框数组
   */
  _getNodeData(e) {
    return e ? Array.isArray(e.data) ? e.data : e.data ? [e.data] : [] : [];
  }
  /**
  * 从四叉树中移除指定的边界框
  */
  removeBox(e) {
    const r = this.getAllBoxes().filter((i) => i.id !== e);
    this.clear(), r.length > 0 && this.addBoxes(r);
  }
}
var hS = Object.defineProperty, fS = (s, e, t) => e in s ? hS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, zf = (s, e, t) => fS(s, typeof e != "symbol" ? e + "" : e, t);
class dS {
  constructor() {
    zf(this, "_strategies", /* @__PURE__ */ new Map()), zf(this, "_executionOrder", []);
  }
  /**
   * Register collision detection strategy
   * 注册碰撞检测策略
   * 
   * @param strategy - Strategy instance to register
   *                   要注册的策略实例
   * @param order - Strategy execution order (insertion index), appended to end if not specified
   *                策略执行顺序（插入位置），如未指定则添加到队列末尾
   * @returns Current orchestrator instance (supports method chaining)
   *          当前协调器实例（支持链式调用）
   * 
   * @example
   * ```typescript
   * // Add to beginning
   * // 添加到首位
   * orchestrator.registerStrategy(strategy1, 0);
   * // Add to end
   * // 添加到末尾
   * orchestrator.registerStrategy(strategy2);
   * // Insert at specific position
   * // 插入到指定位置
   * orchestrator.registerStrategy(strategy3, 1);
   * ```
   */
  registerStrategy(e, t) {
    return this._strategies.set(e.name, e), t !== void 0 ? this._executionOrder.splice(t, 0, e.name) : this._executionOrder.push(e.name), this;
  }
  /**
   * Execute all registered strategies
   * 执行所有已注册的策略
   * 
   * @description
   * Executes collision detection strategies sequentially in registration order. The results of each strategy are merged into the final result.
   * If a feature is marked as hidden in a previous strategy, subsequent strategies will skip processing that feature.
   * 按照注册顺序依次执行各个碰撞检测策略，每个策略的执行结果会合并到最终结果中。
   * 如果某个要素在前面的策略中已经被标记为隐藏，后续策略将不再处理该要素。
   * 
   * @param features - Array of features to process
   *                   要处理的要素数组
   * @param context - Collision detection context information
   *                  碰撞检测上下文信息
   * @returns Promise containing map of all feature processing results
   *          Promise 包含所有要素处理结果的映射表
   * 
   * @example
   * ```typescript
   * const results = await orchestrator.executeStrategies(features, context);
   * results.forEach((result, featureId) => {
   *   console.log(`Feature ${featureId}: ${result.visible ? 'Visible' : 'Hidden'}`);
   * });
   * ```
   */
  async executeStrategies(e, t) {
    const r = /* @__PURE__ */ new Map();
    e.forEach((i) => {
      r.set(i._id, {
        featureId: i._id,
        visible: !0,
        reason: Pr.NO_COLLISION,
        collidedWith: [],
        timestamp: t.timestamp
      });
    });
    for (const i of this._executionOrder) {
      const o = this._strategies.get(i);
      if (o?.enabled)
        try {
          const l = await o.execute(e, t, r);
          this._mergeResults(r, l);
        } catch (l) {
          console.error(`Strategy ${i} execution failed: 策略 ${i} 执行失败:`, l);
        }
    }
    return r;
  }
  /**
   * Merge strategy execution results
   * 合并策略执行结果
   * 
   * @description
   * Merges new strategy results into base results, following the "once hidden, always hidden" principle:
   * If a feature was marked hidden in a previous strategy, subsequent strategy results for it are ignored.
   * 将新策略的执行结果合并到基础结果中，遵循"一旦隐藏，永远隐藏"的原则：
   * 如果要素在之前策略中已经被标记为隐藏，后续策略的结果将被忽略
   * 
   * @param baseResults - Base results map (will be modified)
   *                      基础结果映射表（会被修改）
   * @param newResults - Array of results from new strategy
   *                     新策略产生的结果数组
   */
  _mergeResults(e, t) {
    t.forEach((r) => {
      const i = e.get(r.featureId);
      i && !i.visible || e.set(r.featureId, r);
    });
  }
}
var pS = Object.defineProperty, mS = (s, e, t) => e in s ? pS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Wi = (s, e, t) => mS(s, typeof e != "symbol" ? e + "" : e, t);
class gS {
  constructor() {
    Wi(this, "frameStats", /* @__PURE__ */ new Map()), Wi(this, "summaryStats", {
      totalFrames: 0,
      averageFrameTime: 0,
      averageFPS: 0,
      minFrameTime: 1 / 0,
      maxFrameTime: 0,
      totalFeaturesProcessed: 0
    }), Wi(this, "sampleWindowSize", 60), Wi(this, "currentFrameId", 0), Wi(this, "lastReportTime", 0), Wi(this, "reportInterval", 5e3), Wi(this, "performanceThresholds", {
      criticalFrameTime: 33,
      // < 30fps is critical 30fps以下为严重
      warningFrameTime: 16,
      // < 60fps is warning 60fps以下为警告
      idealFrameTime: 8
      // > 120fps is ideal 120fps以上为理想
    }), this.lastReportTime = Date.now();
  }
  /**
   * Start monitoring a frame
   * 开始一帧的性能监控
   * 
   * @param frameId Frame ID
   *                帧ID
   */
  startFrame(e) {
    this.currentFrameId = e;
    const t = {
      frameId: e,
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      featureCount: 0,
      visibleCount: 0,
      hiddenCount: 0,
      collisionChecks: 0,
      memoryUsage: 0,
      strategyTimes: /* @__PURE__ */ new Map()
    };
    this.frameStats.set(e, t), this.cleanupOldFrames();
  }
  /**
   * End monitoring a frame
   * 结束一帧的性能监控
   * 
   * @param frameId Frame ID
   *                帧ID
   * @param additionalStats Additional statistics
   *                        附加统计信息
   */
  endFrame(e, t) {
    const r = this.frameStats.get(e);
    if (!r) return;
    const i = performance.now();
    r.endTime = i, r.duration = i - r.startTime, t && Object.assign(r, t), "memory" in performance && (r.memoryUsage = performance.memory.usedJSHeapSize), this.updateSummaryStats(r), this.maybeOutputReport();
  }
  /**
   * Record strategy execution time
   * 记录策略执行时间
   * 
   * @param strategyName Strategy name
   *                     策略名称
   * @param executionTime Execution time (ms)
   *                      执行时间（毫秒）
   */
  recordStrategyTime(e, t) {
    const r = this.frameStats.get(this.currentFrameId);
    r && r.strategyTimes.set(e, t);
  }
  /**
   * Record collision check count
   * 记录碰撞检测次数
   * 
   * @param checkCount Check count
   *                   检测次数
   */
  recordCollisionChecks(e) {
    const t = this.frameStats.get(this.currentFrameId);
    t && (t.collisionChecks += e);
  }
  /**
   * Get performance statistics summary
   * 获取性能统计摘要
   */
  getStats() {
    const e = this.getRecentFrames(this.sampleWindowSize), t = this.calculateFPS(e), r = this.calculateAverageFrameTime(e);
    return {
      summary: { ...this.summaryStats },
      recent: {
        fps: t,
        frameTime: r,
        frameTimeStdDev: this.calculateFrameTimeStdDev(e),
        averageFeaturesPerFrame: this.calculateAverageFeatures(e),
        performanceLevel: this.getPerformanceLevel(r)
      },
      currentFrame: this.frameStats.get(this.currentFrameId) || null,
      strategies: this.getStrategyPerformance(e),
      warnings: this.getPerformanceWarnings(e)
    };
  }
  /**
   * Get detailed performance report
   * 获取性能报告（包含详细分析）
   */
  getDetailedReport() {
    const e = this.getRecentFrames(this.sampleWindowSize), t = this.getStats();
    return {
      ...t,
      frameHistory: Array.from(e.values()),
      trends: this.calculateTrends(e),
      recommendations: this.getPerformanceRecommendations(t)
    };
  }
  /**
   * Reset all statistics
   * 重置所有统计
   */
  reset() {
    this.frameStats.clear(), this.summaryStats = {
      totalFrames: 0,
      averageFrameTime: 0,
      averageFPS: 0,
      minFrameTime: 1 / 0,
      maxFrameTime: 0,
      totalFeaturesProcessed: 0
    }, this.currentFrameId = 0, this.lastReportTime = Date.now();
  }
  // ===== 私有方法 =====
  cleanupOldFrames() {
    this.frameStats.size > this.sampleWindowSize * 2 && Array.from(this.frameStats.keys()).sort((t, r) => t - r).slice(0, this.frameStats.size - this.sampleWindowSize).forEach((t) => {
      this.frameStats.delete(t);
    });
  }
  updateSummaryStats(e) {
    this.summaryStats.totalFrames++, this.summaryStats.totalFeaturesProcessed += e.featureCount || 0, this.summaryStats.averageFrameTime = (this.summaryStats.averageFrameTime * (this.summaryStats.totalFrames - 1) + e.duration) / this.summaryStats.totalFrames, this.summaryStats.minFrameTime = Math.min(this.summaryStats.minFrameTime, e.duration), this.summaryStats.maxFrameTime = Math.max(this.summaryStats.maxFrameTime, e.duration), this.summaryStats.averageFPS = 1e3 / this.summaryStats.averageFrameTime;
  }
  maybeOutputReport() {
    const e = Date.now();
    if (e - this.lastReportTime >= this.reportInterval) {
      const t = this.getStats();
      t.warnings.length > 0 ? console.warn("避让系统性能报告:", t) : console.log("避让系统性能正常:", t), this.lastReportTime = e;
    }
  }
  getRecentFrames(e) {
    return Array.from(this.frameStats.values()).slice(-e).filter((r) => r.duration > 0);
  }
  calculateFPS(e) {
    if (e.length === 0) return 0;
    const t = this.calculateAverageFrameTime(e);
    return t > 0 ? 1e3 / t : 0;
  }
  calculateAverageFrameTime(e) {
    return e.length === 0 ? 0 : e.reduce((t, r) => t + r.duration, 0) / e.length;
  }
  calculateFrameTimeStdDev(e) {
    if (e.length === 0) return 0;
    const t = this.calculateAverageFrameTime(e), r = e.map((i) => Math.pow(i.duration - t, 2));
    return Math.sqrt(r.reduce((i, o) => i + o, 0) / e.length);
  }
  calculateAverageFeatures(e) {
    return e.length === 0 ? 0 : e.reduce((t, r) => t + (r.featureCount || 0), 0) / e.length;
  }
  getPerformanceLevel(e) {
    return e > this.performanceThresholds.criticalFrameTime ? "critical" : e > this.performanceThresholds.warningFrameTime ? "warning" : e > this.performanceThresholds.idealFrameTime ? "good" : "excellent";
  }
  getStrategyPerformance(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((r) => {
      r.strategyTimes.forEach((i, o) => {
        t.has(o) || t.set(o, []), t.get(o).push(i);
      });
    }), Array.from(t.entries()).map(([r, i]) => ({
      name: r,
      averageTime: i.reduce((o, l) => o + l, 0) / i.length,
      maxTime: Math.max(...i),
      minTime: Math.min(...i),
      callCount: i.length
    }));
  }
  getPerformanceWarnings(e) {
    const t = [], r = e.slice(-30);
    if (r.length === 0) return t;
    const i = this.calculateAverageFrameTime(r);
    i > this.performanceThresholds.criticalFrameTime ? t.push({
      type: "critical",
      message: `帧率过低: ${Math.round(1e3 / i)}fps`,
      suggestion: "考虑减少要素数量或简化避让策略"
    }) : i > this.performanceThresholds.warningFrameTime && t.push({
      type: "warning",
      message: `帧率较低: ${Math.round(1e3 / i)}fps`,
      suggestion: "建议优化避让算法或增加更新间隔"
    });
    const o = r.map((l) => l.memoryUsage).filter((l) => l > 0);
    if (o.length > 0) {
      const l = o.reduce((c, u) => c + u, 0) / o.length;
      l > 100 * 1024 * 1024 && t.push({
        type: "warning",
        message: `内存使用较高: ${(l / 1024 / 1024).toFixed(1)}MB`,
        suggestion: "检查内存泄漏，及时清理无用资源"
      });
    }
    return t;
  }
  calculateTrends(e) {
    if (e.length < 2) return { frameTime: "stable", fps: "stable", features: "stable" };
    const t = e.slice(0, Math.floor(e.length / 2)), r = e.slice(Math.floor(e.length / 2)), i = this.calculateAverageFrameTime(t), l = (this.calculateAverageFrameTime(r) - i) / i * 100;
    return {
      frameTime: Math.abs(l) < 5 ? "stable" : l > 0 ? "worsening" : "improving",
      fps: Math.abs(l) < 5 ? "stable" : l > 0 ? "improving" : "worsening",
      features: "stable"
      // 可根据实际情况计算
    };
  }
  getPerformanceRecommendations(e) {
    const t = [];
    return e.recent.performanceLevel === "critical" && (t.push("建议启用要素抽样或聚合显示"), t.push("考虑增加避让更新间隔时间"), t.push("检查是否有不必要的避让策略")), e.recent.averageFeaturesPerFrame > 5e3 && t.push("要素数量过多，建议启用LOD分级"), e.strategies.forEach((r) => {
      r.averageTime > 10 && t.push(`策略 "${r.name}" 执行时间较长，考虑优化`);
    }), t;
  }
}
var _S = Object.defineProperty, yS = (s, e, t) => e in s ? _S(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ko = (s, e, t) => yS(s, typeof e != "symbol" ? e + "" : e, t);
class vS {
  constructor() {
    ko(this, "name", "priority"), ko(this, "enabled", !0), ko(this, "weight", 1), ko(this, "description", "Priority-based avoidance strategy, smaller value means higher priority 基于优先级的避让策略，数值越小优先级越高");
  }
  /**
   * Execute avoidance detection
   * 执行避让检测
   * 
   * @param features - Features array to check 需要检测的要素数组
   * @param context - Avoidance context (camera, renderer, viewport, etc.) 避让上下文（包含相机、渲染器、视口等信息）
   * @param previousResults - Results from previous strategies (for combination) 之前策略的执行结果（用于多策略组合）
   * @returns Avoidance results array, containing visibility and collision info for each feature 避让结果数组，包含每个要素的显示状态和碰撞信息
   * 
   * @example
   * ```typescript
   * const results = await strategy.execute(features, context);
   * results.forEach(result => {
   *   feature.setCollisionVisibility(result.visible);
   * });
   * ```
   */
  async execute(e, t, r) {
    const i = [], o = new rp(t.viewport), l = [], c = /* @__PURE__ */ new Map();
    return e.forEach((u) => {
      if (!u.collidable) return;
      const f = u.getScreenBoundingBox(t.camera, t.renderer);
      f && (l.push(f), c.set(u._id, u), r?.get(u._id)?.visible);
    }), l.sort((u, f) => u.priority - f.priority), l.forEach((u) => {
      const f = o.findCollisions(u);
      f.length === 0 ? (o.addBoxes([u]), i.push({
        featureId: u.featureId,
        visible: !0,
        reason: Pr.NO_COLLISION,
        // No collision reason 无碰撞原因
        collidedWith: [],
        // No collision object 无碰撞对象
        timestamp: t.timestamp
      })) : f.some(
        (d) => d.priority < u.priority
      ) ? i.push({
        featureId: u.featureId,
        visible: !1,
        reason: Pr.PRIORITY_LOST,
        // Priority lost reason 优先级不足原因
        collidedWith: f.map((d) => d.featureId),
        // Record all colliding objects 记录所有碰撞对象
        timestamp: t.timestamp
      }) : (o.addBoxes([u]), i.push({
        featureId: u.featureId,
        visible: !0,
        reason: Pr.NO_COLLISION,
        collidedWith: [],
        timestamp: t.timestamp
      }), f.forEach((d) => {
        i.push({
          featureId: d.featureId,
          visible: !1,
          reason: Pr.PRIORITY_LOST,
          collidedWith: [u.featureId],
          // Record replaced by which feature 记录被哪个要素替换
          timestamp: t.timestamp
        });
      }));
    }), i;
  }
}
var wS = Object.defineProperty, xS = (s, e, t) => e in s ? wS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ai = (s, e, t) => xS(s, typeof e != "symbol" ? e + "" : e, t);
class bS {
  /**
   * Create collision detection engine instance
   * 创建碰撞检测引擎实例
   * 
   * @param renderer - Three.js renderer instance Three.js 渲染器实例
   * @param config - Collision detection configuration options 碰撞检测配置选项
   */
  constructor(e, t = {}) {
    this.renderer = e, ai(this, "_quadTreeManager"), ai(this, "_strategyOrchestrator"), ai(this, "_performanceMonitor"), ai(this, "_layers", /* @__PURE__ */ new Set()), ai(this, "_config"), ai(this, "_isUpdating", !1), ai(this, "_lastUpdateTime", 0), ai(this, "_frameCount", 0), this._config = {
      enabled: !0,
      padding: 4,
      updateInterval: 0,
      animationDuration: 300,
      maxFeaturesPerFrame: 2e3,
      viewportMargin: 50,
      strategies: {
        priority: !0,
        grouping: !1,
        proximity: !1
      },
      ...t
    }, this._initializeComponents(), this._setupPerformanceMonitoring();
  }
  /**
   * Update collision detection status
   * 更新碰撞检测状态
   * 
   * @description
   * Executes collision detection and avoidance strategies based on current camera position
   * and feature states. Automatically controls update frequency to avoid performance issues.
   * 根据当前相机位置和要素状态，执行碰撞检测和避让策略，
   * 自动控制更新频率以避免性能问题
   * 
   * @param camera - Current scene camera 当前场景相机
   * @returns Promise Async result after update completion 更新完成后的异步结果
   */
  async update(e) {
    if (!this._config.enabled || this._isUpdating) return;
    const t = Date.now();
    if (!(this._config.updateInterval > 0 && t - this._lastUpdateTime < this._config.updateInterval)) {
      this._isUpdating = !0, this._frameCount++;
      try {
        this._resetAllFeaturesVisibility();
        const r = this._createCollisionContext(e, t), i = this._collectCollidableFeatures();
        if (i.length === 0)
          return;
        this._performanceMonitor.startFrame(this._frameCount);
        const o = await this._strategyOrchestrator.executeStrategies(i, r);
        await this._applyCollisionResults(o, i), this._performanceMonitor.endFrame(this._frameCount, {
          featureCount: i.length,
          visibleCount: Array.from(o.values()).filter((l) => l.visible).length,
          hiddenCount: Array.from(o.values()).filter((l) => !l.visible).length
        }), this._lastUpdateTime = t;
      } catch (r) {
        console.error("避让引擎更新失败:", r);
      } finally {
        this._isUpdating = !1;
      }
    }
  }
  /**
   * Reset visibility of all features
   * 重置所有要素的可见性
   * 
   * @description
   * Ensures each update starts from a clean state, letting the avoidance engine 
   * re-decide the visibility of each feature.
   * 确保每次更新都从干净状态开始，让避让引擎重新决策每个要素的可见性
   */
  _resetAllFeaturesVisibility() {
    this._layers.forEach((e) => {
      e.getFeatures().filter((r) => r.collidable).forEach((r) => {
        r.setCollisionVisibility(!0, Pr.NO_COLLISION);
      });
    });
  }
  /**
   * Register a layer to the collision detection engine
   * 注册图层到碰撞检测引擎
   * 
   * @param layer - Overlay layer to register 要注册的覆盖图层
   * @returns Current engine instance (supports chaining) 当前引擎实例（支持链式调用）
   */
  registerLayer(e) {
    return this._layers.add(e), this;
  }
  /**
   * Unregister a layer from the collision detection engine
   * 从碰撞检测引擎取消注册图层
   * 
   * @param layer - Overlay layer to unregister 要取消注册的覆盖图层
   * @returns Current engine instance (supports chaining) 当前引擎实例（支持链式调用）
   */
  unregisterLayer(e) {
    return this._layers.delete(e), this;
  }
  /**
   * Update collision detection configuration
   * 更新碰撞检测配置
   * 
   * @param newConfig - New configuration options 新的配置选项
   * @returns Current engine instance (supports chaining) 当前引擎实例（支持链式调用）
   */
  setConfig(e) {
    return Object.assign(this._config, e), this;
  }
  /**
   * Get performance statistics
   * 获取性能统计信息
   * 
   * @returns Object containing performance metrics like FPS, processing time, etc. 包含帧率、处理时间等性能指标的对象
   */
  getPerformanceStats() {
    return this._performanceMonitor.getStats();
  }
  /**
   * Initialize internal engine components
   * 初始化引擎内部组件
   * 
   * @description
   * Creates QuadTree manager, strategy orchestrator, and performance monitor,
   * and sets up viewport resize handling.
   * 创建四叉树管理器、策略协调器和性能监控器，
   * 并设置视口变化监听
   */
  _initializeComponents() {
    const e = {
      width: this.renderer.domElement.width,
      height: this.renderer.domElement.height
    };
    this._quadTreeManager = new rp(e), this._strategyOrchestrator = new dS(), this._performanceMonitor = new gS(), this._strategyOrchestrator.registerStrategy(new vS(), 0), this._setupViewportResizeHandler();
  }
  /**
   * Create collision detection context
   * 创建碰撞检测上下文
   * 
   * @param camera - Current scene camera 当前场景相机
   * @param timestamp - Current timestamp 当前时间戳
   * @returns Collision detection context object 碰撞检测上下文对象
   */
  _createCollisionContext(e, t) {
    return {
      camera: e,
      renderer: this.renderer,
      viewport: {
        width: this.renderer.domElement.width,
        height: this.renderer.domElement.height
      },
      zoomLevel: e.position.z,
      timestamp: t,
      frameNumber: this._frameCount
    };
  }
  /**
   * Collect all collidable features
   * 收集所有可碰撞检测的要素
   * 
   * @description
   * Filters features supporting collision detection from all registered layers,
   * and limits the maximum number of features processed per frame.
   * 从所有注册的图层中筛选出支持碰撞检测的要素，
   * 并限制每帧处理的最大数量
   * 
   * @returns Array of collidable features 可碰撞检测的要素数组
   */
  _collectCollidableFeatures() {
    const e = [];
    return this._layers.forEach((t) => {
      const r = t.getFeatures().filter(
        (i) => i.collidable && i instanceof gt
      );
      if (e.length + r.length > this._config.maxFeaturesPerFrame) {
        console.warn(`达到每帧最大要素处理限制: ${this._config.maxFeaturesPerFrame}`);
        return;
      }
      e.push(...r);
    }), e;
  }
  /**
   * Apply collision detection results to features
   * 应用碰撞检测结果到要素
   * 
   * @description
   * Updates visibility status of each feature based on strategy execution results.
   * 根据策略执行结果更新每个要素的可见性状态
   * 
   * @param results - Collision detection results map 碰撞检测结果映射表
   * @param features - Features array 要素数组
   * @returns Promise Async result after application 应用完成后的异步结果
   */
  async _applyCollisionResults(e, t) {
    const r = t.map((i) => {
      const o = e.get(i._id);
      return o && i.setCollisionVisibility(
        o.visible,
        o.reason
      ), Promise.resolve();
    });
    await Promise.all(r);
  }
  /**
   * Setup viewport resize handler
   * 设置视口变化监听器
   * 
   * @description
   * Monitors renderer DOM element size changes and automatically updates QuadTree manager's viewport size.
   * 监听渲染器DOM元素尺寸变化，自动更新四叉树管理器的视口大小
   */
  _setupViewportResizeHandler() {
    new ResizeObserver((t) => {
      t.forEach((r) => {
        const { width: i, height: o } = r.contentRect;
        this._quadTreeManager.updateViewport({ width: i, height: o });
      });
    }).observe(this.renderer.domElement);
  }
  /**
   * 设置性能监控
   * 
   * 定期检查性能统计信息，在性能下降时输出警告
   */
  _setupPerformanceMonitoring() {
    setInterval(() => {
      const e = this.getPerformanceStats();
      e.frameRate < 30 && console.warn("避让系统性能警告:", e);
    }, 5e3);
  }
}
var zo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, ws = { exports: {} };
var TS = ws.exports, Nf;
function SS() {
  return Nf || (Nf = 1, (function(s, e) {
    (function() {
      var t, r = "4.17.21", i = 200, o = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", c = "Invalid `variable` option passed into `_.template`", u = "__lodash_hash_undefined__", f = 500, p = "__lodash_placeholder__", d = 1, g = 2, y = 4, b = 1, T = 2, x = 1, E = 2, M = 4, A = 8, D = 16, z = 32, j = 64, V = 128, R = 256, G = 512, k = 30, B = "...", $ = 800, K = 16, Y = 1, ee = 2, Q = 3, Ee = 1 / 0, we = 9007199254740991, be = 17976931348623157e292, ge = NaN, Ce = 4294967295, Le = Ce - 1, Oe = Ce >>> 1, ct = [
        ["ary", V],
        ["bind", x],
        ["bindKey", E],
        ["curry", A],
        ["curryRight", D],
        ["flip", G],
        ["partial", z],
        ["partialRight", j],
        ["rearg", R]
      ], ut = "[object Arguments]", Ut = "[object Array]", er = "[object AsyncFunction]", yt = "[object Boolean]", tr = "[object Date]", nn = "[object DOMException]", Or = "[object Error]", rr = "[object Function]", Dr = "[object GeneratorFunction]", Ge = "[object Map]", At = "[object Number]", Ti = "[object Null]", vt = "[object Object]", Si = "[object Promise]", sn = "[object Proxy]", Mi = "[object RegExp]", Pt = "[object Set]", $r = "[object String]", Xr = "[object Symbol]", Ai = "[object Undefined]", Pi = "[object WeakMap]", fa = "[object WeakSet]", Yr = "[object ArrayBuffer]", yr = "[object DataView]", Nn = "[object Float32Array]", Hn = "[object Float64Array]", on = "[object Int8Array]", Vn = "[object Int16Array]", Wn = "[object Int32Array]", an = "[object Uint8Array]", Ei = "[object Uint8ClampedArray]", O = "[object Uint16Array]", X = "[object Uint32Array]", se = /\b__p \+= '';/g, ve = /\b(__p \+=) '' \+/g, je = /(__e\(.*?\)|\b__t\)) \+\n'';/g, kt = /&(?:amp|lt|gt|quot|#39);/g, ir = /[&<>"']/g, Lc = RegExp(kt.source), ks = RegExp(ir.source), nr = /<%-([\s\S]+?)%>/g, sr = /<%([\s\S]+?)%>/g, Zr = /<%=([\s\S]+?)%>/g, Ci = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Li = /^\w*$/, ln = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, da = /[\\^$.*+?()[\]{}|]/g, yp = RegExp(da.source), pa = /^\s+/, vp = /\s/, wp = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, xp = /\{\n\/\* \[wrapped with (.+)\] \*/, bp = /,? & /, Tp = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, Sp = /[()=,{}\[\]\/\s]/, Mp = /\\(\\)?/g, Ap = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Oc = /\w*$/, Pp = /^[-+]0x[0-9a-f]+$/i, Ep = /^0b[01]+$/i, Cp = /^\[object .+?Constructor\]$/, Lp = /^0o[0-7]+$/i, Op = /^(?:0|[1-9]\d*)$/, Dp = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, zs = /($^)/, Ip = /['\n\r\u2028\u2029\\]/g, Ns = "\\ud800-\\udfff", Fp = "\\u0300-\\u036f", Rp = "\\ufe20-\\ufe2f", Bp = "\\u20d0-\\u20ff", Dc = Fp + Rp + Bp, Ic = "\\u2700-\\u27bf", Fc = "a-z\\xdf-\\xf6\\xf8-\\xff", Up = "\\xac\\xb1\\xd7\\xf7", kp = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", zp = "\\u2000-\\u206f", Np = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Rc = "A-Z\\xc0-\\xd6\\xd8-\\xde", Bc = "\\ufe0e\\ufe0f", Uc = Up + kp + zp + Np, ma = "['’]", Hp = "[" + Ns + "]", kc = "[" + Uc + "]", Hs = "[" + Dc + "]", zc = "\\d+", Vp = "[" + Ic + "]", Nc = "[" + Fc + "]", Hc = "[^" + Ns + Uc + zc + Ic + Fc + Rc + "]", ga = "\\ud83c[\\udffb-\\udfff]", Wp = "(?:" + Hs + "|" + ga + ")", Vc = "[^" + Ns + "]", _a = "(?:\\ud83c[\\udde6-\\uddff]){2}", ya = "[\\ud800-\\udbff][\\udc00-\\udfff]", cn = "[" + Rc + "]", Wc = "\\u200d", Gc = "(?:" + Nc + "|" + Hc + ")", Gp = "(?:" + cn + "|" + Hc + ")", jc = "(?:" + ma + "(?:d|ll|m|re|s|t|ve))?", $c = "(?:" + ma + "(?:D|LL|M|RE|S|T|VE))?", Xc = Wp + "?", Yc = "[" + Bc + "]?", jp = "(?:" + Wc + "(?:" + [Vc, _a, ya].join("|") + ")" + Yc + Xc + ")*", $p = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Xp = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Zc = Yc + Xc + jp, Yp = "(?:" + [Vp, _a, ya].join("|") + ")" + Zc, Zp = "(?:" + [Vc + Hs + "?", Hs, _a, ya, Hp].join("|") + ")", Kp = RegExp(ma, "g"), qp = RegExp(Hs, "g"), va = RegExp(ga + "(?=" + ga + ")|" + Zp + Zc, "g"), Qp = RegExp([
        cn + "?" + Nc + "+" + jc + "(?=" + [kc, cn, "$"].join("|") + ")",
        Gp + "+" + $c + "(?=" + [kc, cn + Gc, "$"].join("|") + ")",
        cn + "?" + Gc + "+" + jc,
        cn + "+" + $c,
        Xp,
        $p,
        zc,
        Yp
      ].join("|"), "g"), Jp = RegExp("[" + Wc + Ns + Dc + Bc + "]"), em = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, tm = [
        "Array",
        "Buffer",
        "DataView",
        "Date",
        "Error",
        "Float32Array",
        "Float64Array",
        "Function",
        "Int8Array",
        "Int16Array",
        "Int32Array",
        "Map",
        "Math",
        "Object",
        "Promise",
        "RegExp",
        "Set",
        "String",
        "Symbol",
        "TypeError",
        "Uint8Array",
        "Uint8ClampedArray",
        "Uint16Array",
        "Uint32Array",
        "WeakMap",
        "_",
        "clearTimeout",
        "isFinite",
        "parseInt",
        "setTimeout"
      ], rm = -1, Ie = {};
      Ie[Nn] = Ie[Hn] = Ie[on] = Ie[Vn] = Ie[Wn] = Ie[an] = Ie[Ei] = Ie[O] = Ie[X] = !0, Ie[ut] = Ie[Ut] = Ie[Yr] = Ie[yt] = Ie[yr] = Ie[tr] = Ie[Or] = Ie[rr] = Ie[Ge] = Ie[At] = Ie[vt] = Ie[Mi] = Ie[Pt] = Ie[$r] = Ie[Pi] = !1;
      var De = {};
      De[ut] = De[Ut] = De[Yr] = De[yr] = De[yt] = De[tr] = De[Nn] = De[Hn] = De[on] = De[Vn] = De[Wn] = De[Ge] = De[At] = De[vt] = De[Mi] = De[Pt] = De[$r] = De[Xr] = De[an] = De[Ei] = De[O] = De[X] = !0, De[Or] = De[rr] = De[Pi] = !1;
      var im = {
        // Latin-1 Supplement block.
        À: "A",
        Á: "A",
        Â: "A",
        Ã: "A",
        Ä: "A",
        Å: "A",
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "a",
        å: "a",
        Ç: "C",
        ç: "c",
        Ð: "D",
        ð: "d",
        È: "E",
        É: "E",
        Ê: "E",
        Ë: "E",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ï: "I",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        Ñ: "N",
        ñ: "n",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Õ: "O",
        Ö: "O",
        Ø: "O",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "o",
        ø: "o",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ü: "U",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "u",
        Ý: "Y",
        ý: "y",
        ÿ: "y",
        Æ: "Ae",
        æ: "ae",
        Þ: "Th",
        þ: "th",
        ß: "ss",
        // Latin Extended-A block.
        Ā: "A",
        Ă: "A",
        Ą: "A",
        ā: "a",
        ă: "a",
        ą: "a",
        Ć: "C",
        Ĉ: "C",
        Ċ: "C",
        Č: "C",
        ć: "c",
        ĉ: "c",
        ċ: "c",
        č: "c",
        Ď: "D",
        Đ: "D",
        ď: "d",
        đ: "d",
        Ē: "E",
        Ĕ: "E",
        Ė: "E",
        Ę: "E",
        Ě: "E",
        ē: "e",
        ĕ: "e",
        ė: "e",
        ę: "e",
        ě: "e",
        Ĝ: "G",
        Ğ: "G",
        Ġ: "G",
        Ģ: "G",
        ĝ: "g",
        ğ: "g",
        ġ: "g",
        ģ: "g",
        Ĥ: "H",
        Ħ: "H",
        ĥ: "h",
        ħ: "h",
        Ĩ: "I",
        Ī: "I",
        Ĭ: "I",
        Į: "I",
        İ: "I",
        ĩ: "i",
        ī: "i",
        ĭ: "i",
        į: "i",
        ı: "i",
        Ĵ: "J",
        ĵ: "j",
        Ķ: "K",
        ķ: "k",
        ĸ: "k",
        Ĺ: "L",
        Ļ: "L",
        Ľ: "L",
        Ŀ: "L",
        Ł: "L",
        ĺ: "l",
        ļ: "l",
        ľ: "l",
        ŀ: "l",
        ł: "l",
        Ń: "N",
        Ņ: "N",
        Ň: "N",
        Ŋ: "N",
        ń: "n",
        ņ: "n",
        ň: "n",
        ŋ: "n",
        Ō: "O",
        Ŏ: "O",
        Ő: "O",
        ō: "o",
        ŏ: "o",
        ő: "o",
        Ŕ: "R",
        Ŗ: "R",
        Ř: "R",
        ŕ: "r",
        ŗ: "r",
        ř: "r",
        Ś: "S",
        Ŝ: "S",
        Ş: "S",
        Š: "S",
        ś: "s",
        ŝ: "s",
        ş: "s",
        š: "s",
        Ţ: "T",
        Ť: "T",
        Ŧ: "T",
        ţ: "t",
        ť: "t",
        ŧ: "t",
        Ũ: "U",
        Ū: "U",
        Ŭ: "U",
        Ů: "U",
        Ű: "U",
        Ų: "U",
        ũ: "u",
        ū: "u",
        ŭ: "u",
        ů: "u",
        ű: "u",
        ų: "u",
        Ŵ: "W",
        ŵ: "w",
        Ŷ: "Y",
        ŷ: "y",
        Ÿ: "Y",
        Ź: "Z",
        Ż: "Z",
        Ž: "Z",
        ź: "z",
        ż: "z",
        ž: "z",
        Ĳ: "IJ",
        ĳ: "ij",
        Œ: "Oe",
        œ: "oe",
        ŉ: "'n",
        ſ: "s"
      }, nm = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }, sm = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      }, om = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      }, am = parseFloat, lm = parseInt, Kc = typeof zo == "object" && zo && zo.Object === Object && zo, cm = typeof self == "object" && self && self.Object === Object && self, Ze = Kc || cm || Function("return this")(), wa = e && !e.nodeType && e, Oi = wa && !0 && s && !s.nodeType && s, qc = Oi && Oi.exports === wa, xa = qc && Kc.process, zt = (function() {
        try {
          var C = Oi && Oi.require && Oi.require("util").types;
          return C || xa && xa.binding && xa.binding("util");
        } catch {
        }
      })(), Qc = zt && zt.isArrayBuffer, Jc = zt && zt.isDate, eu = zt && zt.isMap, tu = zt && zt.isRegExp, ru = zt && zt.isSet, iu = zt && zt.isTypedArray;
      function Et(C, U, F) {
        switch (F.length) {
          case 0:
            return C.call(U);
          case 1:
            return C.call(U, F[0]);
          case 2:
            return C.call(U, F[0], F[1]);
          case 3:
            return C.call(U, F[0], F[1], F[2]);
        }
        return C.apply(U, F);
      }
      function um(C, U, F, q) {
        for (var ae = -1, Te = C == null ? 0 : C.length; ++ae < Te; ) {
          var $e = C[ae];
          U(q, $e, F($e), C);
        }
        return q;
      }
      function Nt(C, U) {
        for (var F = -1, q = C == null ? 0 : C.length; ++F < q && U(C[F], F, C) !== !1; )
          ;
        return C;
      }
      function hm(C, U) {
        for (var F = C == null ? 0 : C.length; F-- && U(C[F], F, C) !== !1; )
          ;
        return C;
      }
      function nu(C, U) {
        for (var F = -1, q = C == null ? 0 : C.length; ++F < q; )
          if (!U(C[F], F, C))
            return !1;
        return !0;
      }
      function Kr(C, U) {
        for (var F = -1, q = C == null ? 0 : C.length, ae = 0, Te = []; ++F < q; ) {
          var $e = C[F];
          U($e, F, C) && (Te[ae++] = $e);
        }
        return Te;
      }
      function Vs(C, U) {
        var F = C == null ? 0 : C.length;
        return !!F && un(C, U, 0) > -1;
      }
      function ba(C, U, F) {
        for (var q = -1, ae = C == null ? 0 : C.length; ++q < ae; )
          if (F(U, C[q]))
            return !0;
        return !1;
      }
      function Re(C, U) {
        for (var F = -1, q = C == null ? 0 : C.length, ae = Array(q); ++F < q; )
          ae[F] = U(C[F], F, C);
        return ae;
      }
      function qr(C, U) {
        for (var F = -1, q = U.length, ae = C.length; ++F < q; )
          C[ae + F] = U[F];
        return C;
      }
      function Ta(C, U, F, q) {
        var ae = -1, Te = C == null ? 0 : C.length;
        for (q && Te && (F = C[++ae]); ++ae < Te; )
          F = U(F, C[ae], ae, C);
        return F;
      }
      function fm(C, U, F, q) {
        var ae = C == null ? 0 : C.length;
        for (q && ae && (F = C[--ae]); ae--; )
          F = U(F, C[ae], ae, C);
        return F;
      }
      function Sa(C, U) {
        for (var F = -1, q = C == null ? 0 : C.length; ++F < q; )
          if (U(C[F], F, C))
            return !0;
        return !1;
      }
      var dm = Ma("length");
      function pm(C) {
        return C.split("");
      }
      function mm(C) {
        return C.match(Tp) || [];
      }
      function su(C, U, F) {
        var q;
        return F(C, function(ae, Te, $e) {
          if (U(ae, Te, $e))
            return q = Te, !1;
        }), q;
      }
      function Ws(C, U, F, q) {
        for (var ae = C.length, Te = F + (q ? 1 : -1); q ? Te-- : ++Te < ae; )
          if (U(C[Te], Te, C))
            return Te;
        return -1;
      }
      function un(C, U, F) {
        return U === U ? Pm(C, U, F) : Ws(C, ou, F);
      }
      function gm(C, U, F, q) {
        for (var ae = F - 1, Te = C.length; ++ae < Te; )
          if (q(C[ae], U))
            return ae;
        return -1;
      }
      function ou(C) {
        return C !== C;
      }
      function au(C, U) {
        var F = C == null ? 0 : C.length;
        return F ? Pa(C, U) / F : ge;
      }
      function Ma(C) {
        return function(U) {
          return U == null ? t : U[C];
        };
      }
      function Aa(C) {
        return function(U) {
          return C == null ? t : C[U];
        };
      }
      function lu(C, U, F, q, ae) {
        return ae(C, function(Te, $e, Ae) {
          F = q ? (q = !1, Te) : U(F, Te, $e, Ae);
        }), F;
      }
      function _m(C, U) {
        var F = C.length;
        for (C.sort(U); F--; )
          C[F] = C[F].value;
        return C;
      }
      function Pa(C, U) {
        for (var F, q = -1, ae = C.length; ++q < ae; ) {
          var Te = U(C[q]);
          Te !== t && (F = F === t ? Te : F + Te);
        }
        return F;
      }
      function Ea(C, U) {
        for (var F = -1, q = Array(C); ++F < C; )
          q[F] = U(F);
        return q;
      }
      function ym(C, U) {
        return Re(U, function(F) {
          return [F, C[F]];
        });
      }
      function cu(C) {
        return C && C.slice(0, du(C) + 1).replace(pa, "");
      }
      function Ct(C) {
        return function(U) {
          return C(U);
        };
      }
      function Ca(C, U) {
        return Re(U, function(F) {
          return C[F];
        });
      }
      function Gn(C, U) {
        return C.has(U);
      }
      function uu(C, U) {
        for (var F = -1, q = C.length; ++F < q && un(U, C[F], 0) > -1; )
          ;
        return F;
      }
      function hu(C, U) {
        for (var F = C.length; F-- && un(U, C[F], 0) > -1; )
          ;
        return F;
      }
      function vm(C, U) {
        for (var F = C.length, q = 0; F--; )
          C[F] === U && ++q;
        return q;
      }
      var wm = Aa(im), xm = Aa(nm);
      function bm(C) {
        return "\\" + om[C];
      }
      function Tm(C, U) {
        return C == null ? t : C[U];
      }
      function hn(C) {
        return Jp.test(C);
      }
      function Sm(C) {
        return em.test(C);
      }
      function Mm(C) {
        for (var U, F = []; !(U = C.next()).done; )
          F.push(U.value);
        return F;
      }
      function La(C) {
        var U = -1, F = Array(C.size);
        return C.forEach(function(q, ae) {
          F[++U] = [ae, q];
        }), F;
      }
      function fu(C, U) {
        return function(F) {
          return C(U(F));
        };
      }
      function Qr(C, U) {
        for (var F = -1, q = C.length, ae = 0, Te = []; ++F < q; ) {
          var $e = C[F];
          ($e === U || $e === p) && (C[F] = p, Te[ae++] = F);
        }
        return Te;
      }
      function Gs(C) {
        var U = -1, F = Array(C.size);
        return C.forEach(function(q) {
          F[++U] = q;
        }), F;
      }
      function Am(C) {
        var U = -1, F = Array(C.size);
        return C.forEach(function(q) {
          F[++U] = [q, q];
        }), F;
      }
      function Pm(C, U, F) {
        for (var q = F - 1, ae = C.length; ++q < ae; )
          if (C[q] === U)
            return q;
        return -1;
      }
      function Em(C, U, F) {
        for (var q = F + 1; q--; )
          if (C[q] === U)
            return q;
        return q;
      }
      function fn(C) {
        return hn(C) ? Lm(C) : dm(C);
      }
      function or(C) {
        return hn(C) ? Om(C) : pm(C);
      }
      function du(C) {
        for (var U = C.length; U-- && vp.test(C.charAt(U)); )
          ;
        return U;
      }
      var Cm = Aa(sm);
      function Lm(C) {
        for (var U = va.lastIndex = 0; va.test(C); )
          ++U;
        return U;
      }
      function Om(C) {
        return C.match(va) || [];
      }
      function Dm(C) {
        return C.match(Qp) || [];
      }
      var Im = (function C(U) {
        U = U == null ? Ze : dn.defaults(Ze.Object(), U, dn.pick(Ze, tm));
        var F = U.Array, q = U.Date, ae = U.Error, Te = U.Function, $e = U.Math, Ae = U.Object, Oa = U.RegExp, Fm = U.String, Ht = U.TypeError, js = F.prototype, Rm = Te.prototype, pn = Ae.prototype, $s = U["__core-js_shared__"], Xs = Rm.toString, Me = pn.hasOwnProperty, Bm = 0, pu = (function() {
          var n = /[^.]+$/.exec($s && $s.keys && $s.keys.IE_PROTO || "");
          return n ? "Symbol(src)_1." + n : "";
        })(), Ys = pn.toString, Um = Xs.call(Ae), km = Ze._, zm = Oa(
          "^" + Xs.call(Me).replace(da, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
        ), Zs = qc ? U.Buffer : t, Jr = U.Symbol, Ks = U.Uint8Array, mu = Zs ? Zs.allocUnsafe : t, qs = fu(Ae.getPrototypeOf, Ae), gu = Ae.create, _u = pn.propertyIsEnumerable, Qs = js.splice, yu = Jr ? Jr.isConcatSpreadable : t, jn = Jr ? Jr.iterator : t, Di = Jr ? Jr.toStringTag : t, Js = (function() {
          try {
            var n = Ui(Ae, "defineProperty");
            return n({}, "", {}), n;
          } catch {
          }
        })(), Nm = U.clearTimeout !== Ze.clearTimeout && U.clearTimeout, Hm = q && q.now !== Ze.Date.now && q.now, Vm = U.setTimeout !== Ze.setTimeout && U.setTimeout, eo = $e.ceil, to = $e.floor, Da = Ae.getOwnPropertySymbols, Wm = Zs ? Zs.isBuffer : t, vu = U.isFinite, Gm = js.join, jm = fu(Ae.keys, Ae), Xe = $e.max, it = $e.min, $m = q.now, Xm = U.parseInt, wu = $e.random, Ym = js.reverse, Ia = Ui(U, "DataView"), $n = Ui(U, "Map"), Fa = Ui(U, "Promise"), mn = Ui(U, "Set"), Xn = Ui(U, "WeakMap"), Yn = Ui(Ae, "create"), ro = Xn && new Xn(), gn = {}, Zm = ki(Ia), Km = ki($n), qm = ki(Fa), Qm = ki(mn), Jm = ki(Xn), io = Jr ? Jr.prototype : t, Zn = io ? io.valueOf : t, xu = io ? io.toString : t;
        function v(n) {
          if (ze(n) && !le(n) && !(n instanceof _e)) {
            if (n instanceof Vt)
              return n;
            if (Me.call(n, "__wrapped__"))
              return bh(n);
          }
          return new Vt(n);
        }
        var _n = /* @__PURE__ */ (function() {
          function n() {
          }
          return function(a) {
            if (!ke(a))
              return {};
            if (gu)
              return gu(a);
            n.prototype = a;
            var h = new n();
            return n.prototype = t, h;
          };
        })();
        function no() {
        }
        function Vt(n, a) {
          this.__wrapped__ = n, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
        }
        v.templateSettings = {
          /**
           * Used to detect `data` property values to be HTML-escaped.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          escape: nr,
          /**
           * Used to detect code to be evaluated.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          evaluate: sr,
          /**
           * Used to detect `data` property values to inject.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          interpolate: Zr,
          /**
           * Used to reference the data object in the template text.
           *
           * @memberOf _.templateSettings
           * @type {string}
           */
          variable: "",
          /**
           * Used to import variables into the compiled template.
           *
           * @memberOf _.templateSettings
           * @type {Object}
           */
          imports: {
            /**
             * A reference to the `lodash` function.
             *
             * @memberOf _.templateSettings.imports
             * @type {Function}
             */
            _: v
          }
        }, v.prototype = no.prototype, v.prototype.constructor = v, Vt.prototype = _n(no.prototype), Vt.prototype.constructor = Vt;
        function _e(n) {
          this.__wrapped__ = n, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Ce, this.__views__ = [];
        }
        function eg() {
          var n = new _e(this.__wrapped__);
          return n.__actions__ = wt(this.__actions__), n.__dir__ = this.__dir__, n.__filtered__ = this.__filtered__, n.__iteratees__ = wt(this.__iteratees__), n.__takeCount__ = this.__takeCount__, n.__views__ = wt(this.__views__), n;
        }
        function tg() {
          if (this.__filtered__) {
            var n = new _e(this);
            n.__dir__ = -1, n.__filtered__ = !0;
          } else
            n = this.clone(), n.__dir__ *= -1;
          return n;
        }
        function rg() {
          var n = this.__wrapped__.value(), a = this.__dir__, h = le(n), m = a < 0, _ = h ? n.length : 0, w = p_(0, _, this.__views__), S = w.start, P = w.end, L = P - S, N = m ? P : S - 1, H = this.__iteratees__, W = H.length, Z = 0, J = it(L, this.__takeCount__);
          if (!h || !m && _ == L && J == L)
            return ju(n, this.__actions__);
          var ie = [];
          e:
            for (; L-- && Z < J; ) {
              N += a;
              for (var he = -1, ne = n[N]; ++he < W; ) {
                var de = H[he], ye = de.iteratee, Dt = de.type, dt = ye(ne);
                if (Dt == ee)
                  ne = dt;
                else if (!dt) {
                  if (Dt == Y)
                    continue e;
                  break e;
                }
              }
              ie[Z++] = ne;
            }
          return ie;
        }
        _e.prototype = _n(no.prototype), _e.prototype.constructor = _e;
        function Ii(n) {
          var a = -1, h = n == null ? 0 : n.length;
          for (this.clear(); ++a < h; ) {
            var m = n[a];
            this.set(m[0], m[1]);
          }
        }
        function ig() {
          this.__data__ = Yn ? Yn(null) : {}, this.size = 0;
        }
        function ng(n) {
          var a = this.has(n) && delete this.__data__[n];
          return this.size -= a ? 1 : 0, a;
        }
        function sg(n) {
          var a = this.__data__;
          if (Yn) {
            var h = a[n];
            return h === u ? t : h;
          }
          return Me.call(a, n) ? a[n] : t;
        }
        function og(n) {
          var a = this.__data__;
          return Yn ? a[n] !== t : Me.call(a, n);
        }
        function ag(n, a) {
          var h = this.__data__;
          return this.size += this.has(n) ? 0 : 1, h[n] = Yn && a === t ? u : a, this;
        }
        Ii.prototype.clear = ig, Ii.prototype.delete = ng, Ii.prototype.get = sg, Ii.prototype.has = og, Ii.prototype.set = ag;
        function Ir(n) {
          var a = -1, h = n == null ? 0 : n.length;
          for (this.clear(); ++a < h; ) {
            var m = n[a];
            this.set(m[0], m[1]);
          }
        }
        function lg() {
          this.__data__ = [], this.size = 0;
        }
        function cg(n) {
          var a = this.__data__, h = so(a, n);
          if (h < 0)
            return !1;
          var m = a.length - 1;
          return h == m ? a.pop() : Qs.call(a, h, 1), --this.size, !0;
        }
        function ug(n) {
          var a = this.__data__, h = so(a, n);
          return h < 0 ? t : a[h][1];
        }
        function hg(n) {
          return so(this.__data__, n) > -1;
        }
        function fg(n, a) {
          var h = this.__data__, m = so(h, n);
          return m < 0 ? (++this.size, h.push([n, a])) : h[m][1] = a, this;
        }
        Ir.prototype.clear = lg, Ir.prototype.delete = cg, Ir.prototype.get = ug, Ir.prototype.has = hg, Ir.prototype.set = fg;
        function Fr(n) {
          var a = -1, h = n == null ? 0 : n.length;
          for (this.clear(); ++a < h; ) {
            var m = n[a];
            this.set(m[0], m[1]);
          }
        }
        function dg() {
          this.size = 0, this.__data__ = {
            hash: new Ii(),
            map: new ($n || Ir)(),
            string: new Ii()
          };
        }
        function pg(n) {
          var a = yo(this, n).delete(n);
          return this.size -= a ? 1 : 0, a;
        }
        function mg(n) {
          return yo(this, n).get(n);
        }
        function gg(n) {
          return yo(this, n).has(n);
        }
        function _g(n, a) {
          var h = yo(this, n), m = h.size;
          return h.set(n, a), this.size += h.size == m ? 0 : 1, this;
        }
        Fr.prototype.clear = dg, Fr.prototype.delete = pg, Fr.prototype.get = mg, Fr.prototype.has = gg, Fr.prototype.set = _g;
        function Fi(n) {
          var a = -1, h = n == null ? 0 : n.length;
          for (this.__data__ = new Fr(); ++a < h; )
            this.add(n[a]);
        }
        function yg(n) {
          return this.__data__.set(n, u), this;
        }
        function vg(n) {
          return this.__data__.has(n);
        }
        Fi.prototype.add = Fi.prototype.push = yg, Fi.prototype.has = vg;
        function ar(n) {
          var a = this.__data__ = new Ir(n);
          this.size = a.size;
        }
        function wg() {
          this.__data__ = new Ir(), this.size = 0;
        }
        function xg(n) {
          var a = this.__data__, h = a.delete(n);
          return this.size = a.size, h;
        }
        function bg(n) {
          return this.__data__.get(n);
        }
        function Tg(n) {
          return this.__data__.has(n);
        }
        function Sg(n, a) {
          var h = this.__data__;
          if (h instanceof Ir) {
            var m = h.__data__;
            if (!$n || m.length < i - 1)
              return m.push([n, a]), this.size = ++h.size, this;
            h = this.__data__ = new Fr(m);
          }
          return h.set(n, a), this.size = h.size, this;
        }
        ar.prototype.clear = wg, ar.prototype.delete = xg, ar.prototype.get = bg, ar.prototype.has = Tg, ar.prototype.set = Sg;
        function bu(n, a) {
          var h = le(n), m = !h && zi(n), _ = !h && !m && ni(n), w = !h && !m && !_ && xn(n), S = h || m || _ || w, P = S ? Ea(n.length, Fm) : [], L = P.length;
          for (var N in n)
            (a || Me.call(n, N)) && !(S && // Safari 9 has enumerable `arguments.length` in strict mode.
            (N == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
            _ && (N == "offset" || N == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
            w && (N == "buffer" || N == "byteLength" || N == "byteOffset") || // Skip index properties.
            kr(N, L))) && P.push(N);
          return P;
        }
        function Tu(n) {
          var a = n.length;
          return a ? n[ja(0, a - 1)] : t;
        }
        function Mg(n, a) {
          return vo(wt(n), Ri(a, 0, n.length));
        }
        function Ag(n) {
          return vo(wt(n));
        }
        function Ra(n, a, h) {
          (h !== t && !lr(n[a], h) || h === t && !(a in n)) && Rr(n, a, h);
        }
        function Kn(n, a, h) {
          var m = n[a];
          (!(Me.call(n, a) && lr(m, h)) || h === t && !(a in n)) && Rr(n, a, h);
        }
        function so(n, a) {
          for (var h = n.length; h--; )
            if (lr(n[h][0], a))
              return h;
          return -1;
        }
        function Pg(n, a, h, m) {
          return ei(n, function(_, w, S) {
            a(m, _, h(_), S);
          }), m;
        }
        function Su(n, a) {
          return n && wr(a, Ye(a), n);
        }
        function Eg(n, a) {
          return n && wr(a, bt(a), n);
        }
        function Rr(n, a, h) {
          a == "__proto__" && Js ? Js(n, a, {
            configurable: !0,
            enumerable: !0,
            value: h,
            writable: !0
          }) : n[a] = h;
        }
        function Ba(n, a) {
          for (var h = -1, m = a.length, _ = F(m), w = n == null; ++h < m; )
            _[h] = w ? t : gl(n, a[h]);
          return _;
        }
        function Ri(n, a, h) {
          return n === n && (h !== t && (n = n <= h ? n : h), a !== t && (n = n >= a ? n : a)), n;
        }
        function Wt(n, a, h, m, _, w) {
          var S, P = a & d, L = a & g, N = a & y;
          if (h && (S = _ ? h(n, m, _, w) : h(n)), S !== t)
            return S;
          if (!ke(n))
            return n;
          var H = le(n);
          if (H) {
            if (S = g_(n), !P)
              return wt(n, S);
          } else {
            var W = nt(n), Z = W == rr || W == Dr;
            if (ni(n))
              return Yu(n, P);
            if (W == vt || W == ut || Z && !_) {
              if (S = L || Z ? {} : dh(n), !P)
                return L ? s_(n, Eg(S, n)) : n_(n, Su(S, n));
            } else {
              if (!De[W])
                return _ ? n : {};
              S = __(n, W, P);
            }
          }
          w || (w = new ar());
          var J = w.get(n);
          if (J)
            return J;
          w.set(n, S), Vh(n) ? n.forEach(function(ne) {
            S.add(Wt(ne, a, h, ne, n, w));
          }) : Nh(n) && n.forEach(function(ne, de) {
            S.set(de, Wt(ne, a, h, de, n, w));
          });
          var ie = N ? L ? rl : tl : L ? bt : Ye, he = H ? t : ie(n);
          return Nt(he || n, function(ne, de) {
            he && (de = ne, ne = n[de]), Kn(S, de, Wt(ne, a, h, de, n, w));
          }), S;
        }
        function Cg(n) {
          var a = Ye(n);
          return function(h) {
            return Mu(h, n, a);
          };
        }
        function Mu(n, a, h) {
          var m = h.length;
          if (n == null)
            return !m;
          for (n = Ae(n); m--; ) {
            var _ = h[m], w = a[_], S = n[_];
            if (S === t && !(_ in n) || !w(S))
              return !1;
          }
          return !0;
        }
        function Au(n, a, h) {
          if (typeof n != "function")
            throw new Ht(l);
          return is(function() {
            n.apply(t, h);
          }, a);
        }
        function qn(n, a, h, m) {
          var _ = -1, w = Vs, S = !0, P = n.length, L = [], N = a.length;
          if (!P)
            return L;
          h && (a = Re(a, Ct(h))), m ? (w = ba, S = !1) : a.length >= i && (w = Gn, S = !1, a = new Fi(a));
          e:
            for (; ++_ < P; ) {
              var H = n[_], W = h == null ? H : h(H);
              if (H = m || H !== 0 ? H : 0, S && W === W) {
                for (var Z = N; Z--; )
                  if (a[Z] === W)
                    continue e;
                L.push(H);
              } else w(a, W, m) || L.push(H);
            }
          return L;
        }
        var ei = Ju(vr), Pu = Ju(ka, !0);
        function Lg(n, a) {
          var h = !0;
          return ei(n, function(m, _, w) {
            return h = !!a(m, _, w), h;
          }), h;
        }
        function oo(n, a, h) {
          for (var m = -1, _ = n.length; ++m < _; ) {
            var w = n[m], S = a(w);
            if (S != null && (P === t ? S === S && !Ot(S) : h(S, P)))
              var P = S, L = w;
          }
          return L;
        }
        function Og(n, a, h, m) {
          var _ = n.length;
          for (h = ue(h), h < 0 && (h = -h > _ ? 0 : _ + h), m = m === t || m > _ ? _ : ue(m), m < 0 && (m += _), m = h > m ? 0 : Gh(m); h < m; )
            n[h++] = a;
          return n;
        }
        function Eu(n, a) {
          var h = [];
          return ei(n, function(m, _, w) {
            a(m, _, w) && h.push(m);
          }), h;
        }
        function Ke(n, a, h, m, _) {
          var w = -1, S = n.length;
          for (h || (h = v_), _ || (_ = []); ++w < S; ) {
            var P = n[w];
            a > 0 && h(P) ? a > 1 ? Ke(P, a - 1, h, m, _) : qr(_, P) : m || (_[_.length] = P);
          }
          return _;
        }
        var Ua = eh(), Cu = eh(!0);
        function vr(n, a) {
          return n && Ua(n, a, Ye);
        }
        function ka(n, a) {
          return n && Cu(n, a, Ye);
        }
        function ao(n, a) {
          return Kr(a, function(h) {
            return zr(n[h]);
          });
        }
        function Bi(n, a) {
          a = ri(a, n);
          for (var h = 0, m = a.length; n != null && h < m; )
            n = n[xr(a[h++])];
          return h && h == m ? n : t;
        }
        function Lu(n, a, h) {
          var m = a(n);
          return le(n) ? m : qr(m, h(n));
        }
        function ht(n) {
          return n == null ? n === t ? Ai : Ti : Di && Di in Ae(n) ? d_(n) : A_(n);
        }
        function za(n, a) {
          return n > a;
        }
        function Dg(n, a) {
          return n != null && Me.call(n, a);
        }
        function Ig(n, a) {
          return n != null && a in Ae(n);
        }
        function Fg(n, a, h) {
          return n >= it(a, h) && n < Xe(a, h);
        }
        function Na(n, a, h) {
          for (var m = h ? ba : Vs, _ = n[0].length, w = n.length, S = w, P = F(w), L = 1 / 0, N = []; S--; ) {
            var H = n[S];
            S && a && (H = Re(H, Ct(a))), L = it(H.length, L), P[S] = !h && (a || _ >= 120 && H.length >= 120) ? new Fi(S && H) : t;
          }
          H = n[0];
          var W = -1, Z = P[0];
          e:
            for (; ++W < _ && N.length < L; ) {
              var J = H[W], ie = a ? a(J) : J;
              if (J = h || J !== 0 ? J : 0, !(Z ? Gn(Z, ie) : m(N, ie, h))) {
                for (S = w; --S; ) {
                  var he = P[S];
                  if (!(he ? Gn(he, ie) : m(n[S], ie, h)))
                    continue e;
                }
                Z && Z.push(ie), N.push(J);
              }
            }
          return N;
        }
        function Rg(n, a, h, m) {
          return vr(n, function(_, w, S) {
            a(m, h(_), w, S);
          }), m;
        }
        function Qn(n, a, h) {
          a = ri(a, n), n = _h(n, a);
          var m = n == null ? n : n[xr(jt(a))];
          return m == null ? t : Et(m, n, h);
        }
        function Ou(n) {
          return ze(n) && ht(n) == ut;
        }
        function Bg(n) {
          return ze(n) && ht(n) == Yr;
        }
        function Ug(n) {
          return ze(n) && ht(n) == tr;
        }
        function Jn(n, a, h, m, _) {
          return n === a ? !0 : n == null || a == null || !ze(n) && !ze(a) ? n !== n && a !== a : kg(n, a, h, m, Jn, _);
        }
        function kg(n, a, h, m, _, w) {
          var S = le(n), P = le(a), L = S ? Ut : nt(n), N = P ? Ut : nt(a);
          L = L == ut ? vt : L, N = N == ut ? vt : N;
          var H = L == vt, W = N == vt, Z = L == N;
          if (Z && ni(n)) {
            if (!ni(a))
              return !1;
            S = !0, H = !1;
          }
          if (Z && !H)
            return w || (w = new ar()), S || xn(n) ? uh(n, a, h, m, _, w) : h_(n, a, L, h, m, _, w);
          if (!(h & b)) {
            var J = H && Me.call(n, "__wrapped__"), ie = W && Me.call(a, "__wrapped__");
            if (J || ie) {
              var he = J ? n.value() : n, ne = ie ? a.value() : a;
              return w || (w = new ar()), _(he, ne, h, m, w);
            }
          }
          return Z ? (w || (w = new ar()), f_(n, a, h, m, _, w)) : !1;
        }
        function zg(n) {
          return ze(n) && nt(n) == Ge;
        }
        function Ha(n, a, h, m) {
          var _ = h.length, w = _, S = !m;
          if (n == null)
            return !w;
          for (n = Ae(n); _--; ) {
            var P = h[_];
            if (S && P[2] ? P[1] !== n[P[0]] : !(P[0] in n))
              return !1;
          }
          for (; ++_ < w; ) {
            P = h[_];
            var L = P[0], N = n[L], H = P[1];
            if (S && P[2]) {
              if (N === t && !(L in n))
                return !1;
            } else {
              var W = new ar();
              if (m)
                var Z = m(N, H, L, n, a, W);
              if (!(Z === t ? Jn(H, N, b | T, m, W) : Z))
                return !1;
            }
          }
          return !0;
        }
        function Du(n) {
          if (!ke(n) || x_(n))
            return !1;
          var a = zr(n) ? zm : Cp;
          return a.test(ki(n));
        }
        function Ng(n) {
          return ze(n) && ht(n) == Mi;
        }
        function Hg(n) {
          return ze(n) && nt(n) == Pt;
        }
        function Vg(n) {
          return ze(n) && Mo(n.length) && !!Ie[ht(n)];
        }
        function Iu(n) {
          return typeof n == "function" ? n : n == null ? Tt : typeof n == "object" ? le(n) ? Bu(n[0], n[1]) : Ru(n) : tf(n);
        }
        function Va(n) {
          if (!rs(n))
            return jm(n);
          var a = [];
          for (var h in Ae(n))
            Me.call(n, h) && h != "constructor" && a.push(h);
          return a;
        }
        function Wg(n) {
          if (!ke(n))
            return M_(n);
          var a = rs(n), h = [];
          for (var m in n)
            m == "constructor" && (a || !Me.call(n, m)) || h.push(m);
          return h;
        }
        function Wa(n, a) {
          return n < a;
        }
        function Fu(n, a) {
          var h = -1, m = xt(n) ? F(n.length) : [];
          return ei(n, function(_, w, S) {
            m[++h] = a(_, w, S);
          }), m;
        }
        function Ru(n) {
          var a = nl(n);
          return a.length == 1 && a[0][2] ? mh(a[0][0], a[0][1]) : function(h) {
            return h === n || Ha(h, n, a);
          };
        }
        function Bu(n, a) {
          return ol(n) && ph(a) ? mh(xr(n), a) : function(h) {
            var m = gl(h, n);
            return m === t && m === a ? _l(h, n) : Jn(a, m, b | T);
          };
        }
        function lo(n, a, h, m, _) {
          n !== a && Ua(a, function(w, S) {
            if (_ || (_ = new ar()), ke(w))
              Gg(n, a, S, h, lo, m, _);
            else {
              var P = m ? m(ll(n, S), w, S + "", n, a, _) : t;
              P === t && (P = w), Ra(n, S, P);
            }
          }, bt);
        }
        function Gg(n, a, h, m, _, w, S) {
          var P = ll(n, h), L = ll(a, h), N = S.get(L);
          if (N) {
            Ra(n, h, N);
            return;
          }
          var H = w ? w(P, L, h + "", n, a, S) : t, W = H === t;
          if (W) {
            var Z = le(L), J = !Z && ni(L), ie = !Z && !J && xn(L);
            H = L, Z || J || ie ? le(P) ? H = P : Ne(P) ? H = wt(P) : J ? (W = !1, H = Yu(L, !0)) : ie ? (W = !1, H = Zu(L, !0)) : H = [] : ns(L) || zi(L) ? (H = P, zi(P) ? H = jh(P) : (!ke(P) || zr(P)) && (H = dh(L))) : W = !1;
          }
          W && (S.set(L, H), _(H, L, m, w, S), S.delete(L)), Ra(n, h, H);
        }
        function Uu(n, a) {
          var h = n.length;
          if (h)
            return a += a < 0 ? h : 0, kr(a, h) ? n[a] : t;
        }
        function ku(n, a, h) {
          a.length ? a = Re(a, function(w) {
            return le(w) ? function(S) {
              return Bi(S, w.length === 1 ? w[0] : w);
            } : w;
          }) : a = [Tt];
          var m = -1;
          a = Re(a, Ct(re()));
          var _ = Fu(n, function(w, S, P) {
            var L = Re(a, function(N) {
              return N(w);
            });
            return { criteria: L, index: ++m, value: w };
          });
          return _m(_, function(w, S) {
            return i_(w, S, h);
          });
        }
        function jg(n, a) {
          return zu(n, a, function(h, m) {
            return _l(n, m);
          });
        }
        function zu(n, a, h) {
          for (var m = -1, _ = a.length, w = {}; ++m < _; ) {
            var S = a[m], P = Bi(n, S);
            h(P, S) && es(w, ri(S, n), P);
          }
          return w;
        }
        function $g(n) {
          return function(a) {
            return Bi(a, n);
          };
        }
        function Ga(n, a, h, m) {
          var _ = m ? gm : un, w = -1, S = a.length, P = n;
          for (n === a && (a = wt(a)), h && (P = Re(n, Ct(h))); ++w < S; )
            for (var L = 0, N = a[w], H = h ? h(N) : N; (L = _(P, H, L, m)) > -1; )
              P !== n && Qs.call(P, L, 1), Qs.call(n, L, 1);
          return n;
        }
        function Nu(n, a) {
          for (var h = n ? a.length : 0, m = h - 1; h--; ) {
            var _ = a[h];
            if (h == m || _ !== w) {
              var w = _;
              kr(_) ? Qs.call(n, _, 1) : Ya(n, _);
            }
          }
          return n;
        }
        function ja(n, a) {
          return n + to(wu() * (a - n + 1));
        }
        function Xg(n, a, h, m) {
          for (var _ = -1, w = Xe(eo((a - n) / (h || 1)), 0), S = F(w); w--; )
            S[m ? w : ++_] = n, n += h;
          return S;
        }
        function $a(n, a) {
          var h = "";
          if (!n || a < 1 || a > we)
            return h;
          do
            a % 2 && (h += n), a = to(a / 2), a && (n += n);
          while (a);
          return h;
        }
        function fe(n, a) {
          return cl(gh(n, a, Tt), n + "");
        }
        function Yg(n) {
          return Tu(bn(n));
        }
        function Zg(n, a) {
          var h = bn(n);
          return vo(h, Ri(a, 0, h.length));
        }
        function es(n, a, h, m) {
          if (!ke(n))
            return n;
          a = ri(a, n);
          for (var _ = -1, w = a.length, S = w - 1, P = n; P != null && ++_ < w; ) {
            var L = xr(a[_]), N = h;
            if (L === "__proto__" || L === "constructor" || L === "prototype")
              return n;
            if (_ != S) {
              var H = P[L];
              N = m ? m(H, L, P) : t, N === t && (N = ke(H) ? H : kr(a[_ + 1]) ? [] : {});
            }
            Kn(P, L, N), P = P[L];
          }
          return n;
        }
        var Hu = ro ? function(n, a) {
          return ro.set(n, a), n;
        } : Tt, Kg = Js ? function(n, a) {
          return Js(n, "toString", {
            configurable: !0,
            enumerable: !1,
            value: vl(a),
            writable: !0
          });
        } : Tt;
        function qg(n) {
          return vo(bn(n));
        }
        function Gt(n, a, h) {
          var m = -1, _ = n.length;
          a < 0 && (a = -a > _ ? 0 : _ + a), h = h > _ ? _ : h, h < 0 && (h += _), _ = a > h ? 0 : h - a >>> 0, a >>>= 0;
          for (var w = F(_); ++m < _; )
            w[m] = n[m + a];
          return w;
        }
        function Qg(n, a) {
          var h;
          return ei(n, function(m, _, w) {
            return h = a(m, _, w), !h;
          }), !!h;
        }
        function co(n, a, h) {
          var m = 0, _ = n == null ? m : n.length;
          if (typeof a == "number" && a === a && _ <= Oe) {
            for (; m < _; ) {
              var w = m + _ >>> 1, S = n[w];
              S !== null && !Ot(S) && (h ? S <= a : S < a) ? m = w + 1 : _ = w;
            }
            return _;
          }
          return Xa(n, a, Tt, h);
        }
        function Xa(n, a, h, m) {
          var _ = 0, w = n == null ? 0 : n.length;
          if (w === 0)
            return 0;
          a = h(a);
          for (var S = a !== a, P = a === null, L = Ot(a), N = a === t; _ < w; ) {
            var H = to((_ + w) / 2), W = h(n[H]), Z = W !== t, J = W === null, ie = W === W, he = Ot(W);
            if (S)
              var ne = m || ie;
            else N ? ne = ie && (m || Z) : P ? ne = ie && Z && (m || !J) : L ? ne = ie && Z && !J && (m || !he) : J || he ? ne = !1 : ne = m ? W <= a : W < a;
            ne ? _ = H + 1 : w = H;
          }
          return it(w, Le);
        }
        function Vu(n, a) {
          for (var h = -1, m = n.length, _ = 0, w = []; ++h < m; ) {
            var S = n[h], P = a ? a(S) : S;
            if (!h || !lr(P, L)) {
              var L = P;
              w[_++] = S === 0 ? 0 : S;
            }
          }
          return w;
        }
        function Wu(n) {
          return typeof n == "number" ? n : Ot(n) ? ge : +n;
        }
        function Lt(n) {
          if (typeof n == "string")
            return n;
          if (le(n))
            return Re(n, Lt) + "";
          if (Ot(n))
            return xu ? xu.call(n) : "";
          var a = n + "";
          return a == "0" && 1 / n == -Ee ? "-0" : a;
        }
        function ti(n, a, h) {
          var m = -1, _ = Vs, w = n.length, S = !0, P = [], L = P;
          if (h)
            S = !1, _ = ba;
          else if (w >= i) {
            var N = a ? null : c_(n);
            if (N)
              return Gs(N);
            S = !1, _ = Gn, L = new Fi();
          } else
            L = a ? [] : P;
          e:
            for (; ++m < w; ) {
              var H = n[m], W = a ? a(H) : H;
              if (H = h || H !== 0 ? H : 0, S && W === W) {
                for (var Z = L.length; Z--; )
                  if (L[Z] === W)
                    continue e;
                a && L.push(W), P.push(H);
              } else _(L, W, h) || (L !== P && L.push(W), P.push(H));
            }
          return P;
        }
        function Ya(n, a) {
          return a = ri(a, n), n = _h(n, a), n == null || delete n[xr(jt(a))];
        }
        function Gu(n, a, h, m) {
          return es(n, a, h(Bi(n, a)), m);
        }
        function uo(n, a, h, m) {
          for (var _ = n.length, w = m ? _ : -1; (m ? w-- : ++w < _) && a(n[w], w, n); )
            ;
          return h ? Gt(n, m ? 0 : w, m ? w + 1 : _) : Gt(n, m ? w + 1 : 0, m ? _ : w);
        }
        function ju(n, a) {
          var h = n;
          return h instanceof _e && (h = h.value()), Ta(a, function(m, _) {
            return _.func.apply(_.thisArg, qr([m], _.args));
          }, h);
        }
        function Za(n, a, h) {
          var m = n.length;
          if (m < 2)
            return m ? ti(n[0]) : [];
          for (var _ = -1, w = F(m); ++_ < m; )
            for (var S = n[_], P = -1; ++P < m; )
              P != _ && (w[_] = qn(w[_] || S, n[P], a, h));
          return ti(Ke(w, 1), a, h);
        }
        function $u(n, a, h) {
          for (var m = -1, _ = n.length, w = a.length, S = {}; ++m < _; ) {
            var P = m < w ? a[m] : t;
            h(S, n[m], P);
          }
          return S;
        }
        function Ka(n) {
          return Ne(n) ? n : [];
        }
        function qa(n) {
          return typeof n == "function" ? n : Tt;
        }
        function ri(n, a) {
          return le(n) ? n : ol(n, a) ? [n] : xh(Se(n));
        }
        var Jg = fe;
        function ii(n, a, h) {
          var m = n.length;
          return h = h === t ? m : h, !a && h >= m ? n : Gt(n, a, h);
        }
        var Xu = Nm || function(n) {
          return Ze.clearTimeout(n);
        };
        function Yu(n, a) {
          if (a)
            return n.slice();
          var h = n.length, m = mu ? mu(h) : new n.constructor(h);
          return n.copy(m), m;
        }
        function Qa(n) {
          var a = new n.constructor(n.byteLength);
          return new Ks(a).set(new Ks(n)), a;
        }
        function e_(n, a) {
          var h = a ? Qa(n.buffer) : n.buffer;
          return new n.constructor(h, n.byteOffset, n.byteLength);
        }
        function t_(n) {
          var a = new n.constructor(n.source, Oc.exec(n));
          return a.lastIndex = n.lastIndex, a;
        }
        function r_(n) {
          return Zn ? Ae(Zn.call(n)) : {};
        }
        function Zu(n, a) {
          var h = a ? Qa(n.buffer) : n.buffer;
          return new n.constructor(h, n.byteOffset, n.length);
        }
        function Ku(n, a) {
          if (n !== a) {
            var h = n !== t, m = n === null, _ = n === n, w = Ot(n), S = a !== t, P = a === null, L = a === a, N = Ot(a);
            if (!P && !N && !w && n > a || w && S && L && !P && !N || m && S && L || !h && L || !_)
              return 1;
            if (!m && !w && !N && n < a || N && h && _ && !m && !w || P && h && _ || !S && _ || !L)
              return -1;
          }
          return 0;
        }
        function i_(n, a, h) {
          for (var m = -1, _ = n.criteria, w = a.criteria, S = _.length, P = h.length; ++m < S; ) {
            var L = Ku(_[m], w[m]);
            if (L) {
              if (m >= P)
                return L;
              var N = h[m];
              return L * (N == "desc" ? -1 : 1);
            }
          }
          return n.index - a.index;
        }
        function qu(n, a, h, m) {
          for (var _ = -1, w = n.length, S = h.length, P = -1, L = a.length, N = Xe(w - S, 0), H = F(L + N), W = !m; ++P < L; )
            H[P] = a[P];
          for (; ++_ < S; )
            (W || _ < w) && (H[h[_]] = n[_]);
          for (; N--; )
            H[P++] = n[_++];
          return H;
        }
        function Qu(n, a, h, m) {
          for (var _ = -1, w = n.length, S = -1, P = h.length, L = -1, N = a.length, H = Xe(w - P, 0), W = F(H + N), Z = !m; ++_ < H; )
            W[_] = n[_];
          for (var J = _; ++L < N; )
            W[J + L] = a[L];
          for (; ++S < P; )
            (Z || _ < w) && (W[J + h[S]] = n[_++]);
          return W;
        }
        function wt(n, a) {
          var h = -1, m = n.length;
          for (a || (a = F(m)); ++h < m; )
            a[h] = n[h];
          return a;
        }
        function wr(n, a, h, m) {
          var _ = !h;
          h || (h = {});
          for (var w = -1, S = a.length; ++w < S; ) {
            var P = a[w], L = m ? m(h[P], n[P], P, h, n) : t;
            L === t && (L = n[P]), _ ? Rr(h, P, L) : Kn(h, P, L);
          }
          return h;
        }
        function n_(n, a) {
          return wr(n, sl(n), a);
        }
        function s_(n, a) {
          return wr(n, hh(n), a);
        }
        function ho(n, a) {
          return function(h, m) {
            var _ = le(h) ? um : Pg, w = a ? a() : {};
            return _(h, n, re(m, 2), w);
          };
        }
        function yn(n) {
          return fe(function(a, h) {
            var m = -1, _ = h.length, w = _ > 1 ? h[_ - 1] : t, S = _ > 2 ? h[2] : t;
            for (w = n.length > 3 && typeof w == "function" ? (_--, w) : t, S && ft(h[0], h[1], S) && (w = _ < 3 ? t : w, _ = 1), a = Ae(a); ++m < _; ) {
              var P = h[m];
              P && n(a, P, m, w);
            }
            return a;
          });
        }
        function Ju(n, a) {
          return function(h, m) {
            if (h == null)
              return h;
            if (!xt(h))
              return n(h, m);
            for (var _ = h.length, w = a ? _ : -1, S = Ae(h); (a ? w-- : ++w < _) && m(S[w], w, S) !== !1; )
              ;
            return h;
          };
        }
        function eh(n) {
          return function(a, h, m) {
            for (var _ = -1, w = Ae(a), S = m(a), P = S.length; P--; ) {
              var L = S[n ? P : ++_];
              if (h(w[L], L, w) === !1)
                break;
            }
            return a;
          };
        }
        function o_(n, a, h) {
          var m = a & x, _ = ts(n);
          function w() {
            var S = this && this !== Ze && this instanceof w ? _ : n;
            return S.apply(m ? h : this, arguments);
          }
          return w;
        }
        function th(n) {
          return function(a) {
            a = Se(a);
            var h = hn(a) ? or(a) : t, m = h ? h[0] : a.charAt(0), _ = h ? ii(h, 1).join("") : a.slice(1);
            return m[n]() + _;
          };
        }
        function vn(n) {
          return function(a) {
            return Ta(Jh(Qh(a).replace(Kp, "")), n, "");
          };
        }
        function ts(n) {
          return function() {
            var a = arguments;
            switch (a.length) {
              case 0:
                return new n();
              case 1:
                return new n(a[0]);
              case 2:
                return new n(a[0], a[1]);
              case 3:
                return new n(a[0], a[1], a[2]);
              case 4:
                return new n(a[0], a[1], a[2], a[3]);
              case 5:
                return new n(a[0], a[1], a[2], a[3], a[4]);
              case 6:
                return new n(a[0], a[1], a[2], a[3], a[4], a[5]);
              case 7:
                return new n(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
            }
            var h = _n(n.prototype), m = n.apply(h, a);
            return ke(m) ? m : h;
          };
        }
        function a_(n, a, h) {
          var m = ts(n);
          function _() {
            for (var w = arguments.length, S = F(w), P = w, L = wn(_); P--; )
              S[P] = arguments[P];
            var N = w < 3 && S[0] !== L && S[w - 1] !== L ? [] : Qr(S, L);
            if (w -= N.length, w < h)
              return oh(
                n,
                a,
                fo,
                _.placeholder,
                t,
                S,
                N,
                t,
                t,
                h - w
              );
            var H = this && this !== Ze && this instanceof _ ? m : n;
            return Et(H, this, S);
          }
          return _;
        }
        function rh(n) {
          return function(a, h, m) {
            var _ = Ae(a);
            if (!xt(a)) {
              var w = re(h, 3);
              a = Ye(a), h = function(P) {
                return w(_[P], P, _);
              };
            }
            var S = n(a, h, m);
            return S > -1 ? _[w ? a[S] : S] : t;
          };
        }
        function ih(n) {
          return Ur(function(a) {
            var h = a.length, m = h, _ = Vt.prototype.thru;
            for (n && a.reverse(); m--; ) {
              var w = a[m];
              if (typeof w != "function")
                throw new Ht(l);
              if (_ && !S && _o(w) == "wrapper")
                var S = new Vt([], !0);
            }
            for (m = S ? m : h; ++m < h; ) {
              w = a[m];
              var P = _o(w), L = P == "wrapper" ? il(w) : t;
              L && al(L[0]) && L[1] == (V | A | z | R) && !L[4].length && L[9] == 1 ? S = S[_o(L[0])].apply(S, L[3]) : S = w.length == 1 && al(w) ? S[P]() : S.thru(w);
            }
            return function() {
              var N = arguments, H = N[0];
              if (S && N.length == 1 && le(H))
                return S.plant(H).value();
              for (var W = 0, Z = h ? a[W].apply(this, N) : H; ++W < h; )
                Z = a[W].call(this, Z);
              return Z;
            };
          });
        }
        function fo(n, a, h, m, _, w, S, P, L, N) {
          var H = a & V, W = a & x, Z = a & E, J = a & (A | D), ie = a & G, he = Z ? t : ts(n);
          function ne() {
            for (var de = arguments.length, ye = F(de), Dt = de; Dt--; )
              ye[Dt] = arguments[Dt];
            if (J)
              var dt = wn(ne), It = vm(ye, dt);
            if (m && (ye = qu(ye, m, _, J)), w && (ye = Qu(ye, w, S, J)), de -= It, J && de < N) {
              var He = Qr(ye, dt);
              return oh(
                n,
                a,
                fo,
                ne.placeholder,
                h,
                ye,
                He,
                P,
                L,
                N - de
              );
            }
            var cr = W ? h : this, Hr = Z ? cr[n] : n;
            return de = ye.length, P ? ye = P_(ye, P) : ie && de > 1 && ye.reverse(), H && L < de && (ye.length = L), this && this !== Ze && this instanceof ne && (Hr = he || ts(Hr)), Hr.apply(cr, ye);
          }
          return ne;
        }
        function nh(n, a) {
          return function(h, m) {
            return Rg(h, n, a(m), {});
          };
        }
        function po(n, a) {
          return function(h, m) {
            var _;
            if (h === t && m === t)
              return a;
            if (h !== t && (_ = h), m !== t) {
              if (_ === t)
                return m;
              typeof h == "string" || typeof m == "string" ? (h = Lt(h), m = Lt(m)) : (h = Wu(h), m = Wu(m)), _ = n(h, m);
            }
            return _;
          };
        }
        function Ja(n) {
          return Ur(function(a) {
            return a = Re(a, Ct(re())), fe(function(h) {
              var m = this;
              return n(a, function(_) {
                return Et(_, m, h);
              });
            });
          });
        }
        function mo(n, a) {
          a = a === t ? " " : Lt(a);
          var h = a.length;
          if (h < 2)
            return h ? $a(a, n) : a;
          var m = $a(a, eo(n / fn(a)));
          return hn(a) ? ii(or(m), 0, n).join("") : m.slice(0, n);
        }
        function l_(n, a, h, m) {
          var _ = a & x, w = ts(n);
          function S() {
            for (var P = -1, L = arguments.length, N = -1, H = m.length, W = F(H + L), Z = this && this !== Ze && this instanceof S ? w : n; ++N < H; )
              W[N] = m[N];
            for (; L--; )
              W[N++] = arguments[++P];
            return Et(Z, _ ? h : this, W);
          }
          return S;
        }
        function sh(n) {
          return function(a, h, m) {
            return m && typeof m != "number" && ft(a, h, m) && (h = m = t), a = Nr(a), h === t ? (h = a, a = 0) : h = Nr(h), m = m === t ? a < h ? 1 : -1 : Nr(m), Xg(a, h, m, n);
          };
        }
        function go(n) {
          return function(a, h) {
            return typeof a == "string" && typeof h == "string" || (a = $t(a), h = $t(h)), n(a, h);
          };
        }
        function oh(n, a, h, m, _, w, S, P, L, N) {
          var H = a & A, W = H ? S : t, Z = H ? t : S, J = H ? w : t, ie = H ? t : w;
          a |= H ? z : j, a &= ~(H ? j : z), a & M || (a &= -4);
          var he = [
            n,
            a,
            _,
            J,
            W,
            ie,
            Z,
            P,
            L,
            N
          ], ne = h.apply(t, he);
          return al(n) && yh(ne, he), ne.placeholder = m, vh(ne, n, a);
        }
        function el(n) {
          var a = $e[n];
          return function(h, m) {
            if (h = $t(h), m = m == null ? 0 : it(ue(m), 292), m && vu(h)) {
              var _ = (Se(h) + "e").split("e"), w = a(_[0] + "e" + (+_[1] + m));
              return _ = (Se(w) + "e").split("e"), +(_[0] + "e" + (+_[1] - m));
            }
            return a(h);
          };
        }
        var c_ = mn && 1 / Gs(new mn([, -0]))[1] == Ee ? function(n) {
          return new mn(n);
        } : bl;
        function ah(n) {
          return function(a) {
            var h = nt(a);
            return h == Ge ? La(a) : h == Pt ? Am(a) : ym(a, n(a));
          };
        }
        function Br(n, a, h, m, _, w, S, P) {
          var L = a & E;
          if (!L && typeof n != "function")
            throw new Ht(l);
          var N = m ? m.length : 0;
          if (N || (a &= -97, m = _ = t), S = S === t ? S : Xe(ue(S), 0), P = P === t ? P : ue(P), N -= _ ? _.length : 0, a & j) {
            var H = m, W = _;
            m = _ = t;
          }
          var Z = L ? t : il(n), J = [
            n,
            a,
            h,
            m,
            _,
            H,
            W,
            w,
            S,
            P
          ];
          if (Z && S_(J, Z), n = J[0], a = J[1], h = J[2], m = J[3], _ = J[4], P = J[9] = J[9] === t ? L ? 0 : n.length : Xe(J[9] - N, 0), !P && a & (A | D) && (a &= -25), !a || a == x)
            var ie = o_(n, a, h);
          else a == A || a == D ? ie = a_(n, a, P) : (a == z || a == (x | z)) && !_.length ? ie = l_(n, a, h, m) : ie = fo.apply(t, J);
          var he = Z ? Hu : yh;
          return vh(he(ie, J), n, a);
        }
        function lh(n, a, h, m) {
          return n === t || lr(n, pn[h]) && !Me.call(m, h) ? a : n;
        }
        function ch(n, a, h, m, _, w) {
          return ke(n) && ke(a) && (w.set(a, n), lo(n, a, t, ch, w), w.delete(a)), n;
        }
        function u_(n) {
          return ns(n) ? t : n;
        }
        function uh(n, a, h, m, _, w) {
          var S = h & b, P = n.length, L = a.length;
          if (P != L && !(S && L > P))
            return !1;
          var N = w.get(n), H = w.get(a);
          if (N && H)
            return N == a && H == n;
          var W = -1, Z = !0, J = h & T ? new Fi() : t;
          for (w.set(n, a), w.set(a, n); ++W < P; ) {
            var ie = n[W], he = a[W];
            if (m)
              var ne = S ? m(he, ie, W, a, n, w) : m(ie, he, W, n, a, w);
            if (ne !== t) {
              if (ne)
                continue;
              Z = !1;
              break;
            }
            if (J) {
              if (!Sa(a, function(de, ye) {
                if (!Gn(J, ye) && (ie === de || _(ie, de, h, m, w)))
                  return J.push(ye);
              })) {
                Z = !1;
                break;
              }
            } else if (!(ie === he || _(ie, he, h, m, w))) {
              Z = !1;
              break;
            }
          }
          return w.delete(n), w.delete(a), Z;
        }
        function h_(n, a, h, m, _, w, S) {
          switch (h) {
            case yr:
              if (n.byteLength != a.byteLength || n.byteOffset != a.byteOffset)
                return !1;
              n = n.buffer, a = a.buffer;
            case Yr:
              return !(n.byteLength != a.byteLength || !w(new Ks(n), new Ks(a)));
            case yt:
            case tr:
            case At:
              return lr(+n, +a);
            case Or:
              return n.name == a.name && n.message == a.message;
            case Mi:
            case $r:
              return n == a + "";
            case Ge:
              var P = La;
            case Pt:
              var L = m & b;
              if (P || (P = Gs), n.size != a.size && !L)
                return !1;
              var N = S.get(n);
              if (N)
                return N == a;
              m |= T, S.set(n, a);
              var H = uh(P(n), P(a), m, _, w, S);
              return S.delete(n), H;
            case Xr:
              if (Zn)
                return Zn.call(n) == Zn.call(a);
          }
          return !1;
        }
        function f_(n, a, h, m, _, w) {
          var S = h & b, P = tl(n), L = P.length, N = tl(a), H = N.length;
          if (L != H && !S)
            return !1;
          for (var W = L; W--; ) {
            var Z = P[W];
            if (!(S ? Z in a : Me.call(a, Z)))
              return !1;
          }
          var J = w.get(n), ie = w.get(a);
          if (J && ie)
            return J == a && ie == n;
          var he = !0;
          w.set(n, a), w.set(a, n);
          for (var ne = S; ++W < L; ) {
            Z = P[W];
            var de = n[Z], ye = a[Z];
            if (m)
              var Dt = S ? m(ye, de, Z, a, n, w) : m(de, ye, Z, n, a, w);
            if (!(Dt === t ? de === ye || _(de, ye, h, m, w) : Dt)) {
              he = !1;
              break;
            }
            ne || (ne = Z == "constructor");
          }
          if (he && !ne) {
            var dt = n.constructor, It = a.constructor;
            dt != It && "constructor" in n && "constructor" in a && !(typeof dt == "function" && dt instanceof dt && typeof It == "function" && It instanceof It) && (he = !1);
          }
          return w.delete(n), w.delete(a), he;
        }
        function Ur(n) {
          return cl(gh(n, t, Mh), n + "");
        }
        function tl(n) {
          return Lu(n, Ye, sl);
        }
        function rl(n) {
          return Lu(n, bt, hh);
        }
        var il = ro ? function(n) {
          return ro.get(n);
        } : bl;
        function _o(n) {
          for (var a = n.name + "", h = gn[a], m = Me.call(gn, a) ? h.length : 0; m--; ) {
            var _ = h[m], w = _.func;
            if (w == null || w == n)
              return _.name;
          }
          return a;
        }
        function wn(n) {
          var a = Me.call(v, "placeholder") ? v : n;
          return a.placeholder;
        }
        function re() {
          var n = v.iteratee || wl;
          return n = n === wl ? Iu : n, arguments.length ? n(arguments[0], arguments[1]) : n;
        }
        function yo(n, a) {
          var h = n.__data__;
          return w_(a) ? h[typeof a == "string" ? "string" : "hash"] : h.map;
        }
        function nl(n) {
          for (var a = Ye(n), h = a.length; h--; ) {
            var m = a[h], _ = n[m];
            a[h] = [m, _, ph(_)];
          }
          return a;
        }
        function Ui(n, a) {
          var h = Tm(n, a);
          return Du(h) ? h : t;
        }
        function d_(n) {
          var a = Me.call(n, Di), h = n[Di];
          try {
            n[Di] = t;
            var m = !0;
          } catch {
          }
          var _ = Ys.call(n);
          return m && (a ? n[Di] = h : delete n[Di]), _;
        }
        var sl = Da ? function(n) {
          return n == null ? [] : (n = Ae(n), Kr(Da(n), function(a) {
            return _u.call(n, a);
          }));
        } : Tl, hh = Da ? function(n) {
          for (var a = []; n; )
            qr(a, sl(n)), n = qs(n);
          return a;
        } : Tl, nt = ht;
        (Ia && nt(new Ia(new ArrayBuffer(1))) != yr || $n && nt(new $n()) != Ge || Fa && nt(Fa.resolve()) != Si || mn && nt(new mn()) != Pt || Xn && nt(new Xn()) != Pi) && (nt = function(n) {
          var a = ht(n), h = a == vt ? n.constructor : t, m = h ? ki(h) : "";
          if (m)
            switch (m) {
              case Zm:
                return yr;
              case Km:
                return Ge;
              case qm:
                return Si;
              case Qm:
                return Pt;
              case Jm:
                return Pi;
            }
          return a;
        });
        function p_(n, a, h) {
          for (var m = -1, _ = h.length; ++m < _; ) {
            var w = h[m], S = w.size;
            switch (w.type) {
              case "drop":
                n += S;
                break;
              case "dropRight":
                a -= S;
                break;
              case "take":
                a = it(a, n + S);
                break;
              case "takeRight":
                n = Xe(n, a - S);
                break;
            }
          }
          return { start: n, end: a };
        }
        function m_(n) {
          var a = n.match(xp);
          return a ? a[1].split(bp) : [];
        }
        function fh(n, a, h) {
          a = ri(a, n);
          for (var m = -1, _ = a.length, w = !1; ++m < _; ) {
            var S = xr(a[m]);
            if (!(w = n != null && h(n, S)))
              break;
            n = n[S];
          }
          return w || ++m != _ ? w : (_ = n == null ? 0 : n.length, !!_ && Mo(_) && kr(S, _) && (le(n) || zi(n)));
        }
        function g_(n) {
          var a = n.length, h = new n.constructor(a);
          return a && typeof n[0] == "string" && Me.call(n, "index") && (h.index = n.index, h.input = n.input), h;
        }
        function dh(n) {
          return typeof n.constructor == "function" && !rs(n) ? _n(qs(n)) : {};
        }
        function __(n, a, h) {
          var m = n.constructor;
          switch (a) {
            case Yr:
              return Qa(n);
            case yt:
            case tr:
              return new m(+n);
            case yr:
              return e_(n, h);
            case Nn:
            case Hn:
            case on:
            case Vn:
            case Wn:
            case an:
            case Ei:
            case O:
            case X:
              return Zu(n, h);
            case Ge:
              return new m();
            case At:
            case $r:
              return new m(n);
            case Mi:
              return t_(n);
            case Pt:
              return new m();
            case Xr:
              return r_(n);
          }
        }
        function y_(n, a) {
          var h = a.length;
          if (!h)
            return n;
          var m = h - 1;
          return a[m] = (h > 1 ? "& " : "") + a[m], a = a.join(h > 2 ? ", " : " "), n.replace(wp, `{
/* [wrapped with ` + a + `] */
`);
        }
        function v_(n) {
          return le(n) || zi(n) || !!(yu && n && n[yu]);
        }
        function kr(n, a) {
          var h = typeof n;
          return a = a ?? we, !!a && (h == "number" || h != "symbol" && Op.test(n)) && n > -1 && n % 1 == 0 && n < a;
        }
        function ft(n, a, h) {
          if (!ke(h))
            return !1;
          var m = typeof a;
          return (m == "number" ? xt(h) && kr(a, h.length) : m == "string" && a in h) ? lr(h[a], n) : !1;
        }
        function ol(n, a) {
          if (le(n))
            return !1;
          var h = typeof n;
          return h == "number" || h == "symbol" || h == "boolean" || n == null || Ot(n) ? !0 : Li.test(n) || !Ci.test(n) || a != null && n in Ae(a);
        }
        function w_(n) {
          var a = typeof n;
          return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? n !== "__proto__" : n === null;
        }
        function al(n) {
          var a = _o(n), h = v[a];
          if (typeof h != "function" || !(a in _e.prototype))
            return !1;
          if (n === h)
            return !0;
          var m = il(h);
          return !!m && n === m[0];
        }
        function x_(n) {
          return !!pu && pu in n;
        }
        var b_ = $s ? zr : Sl;
        function rs(n) {
          var a = n && n.constructor, h = typeof a == "function" && a.prototype || pn;
          return n === h;
        }
        function ph(n) {
          return n === n && !ke(n);
        }
        function mh(n, a) {
          return function(h) {
            return h == null ? !1 : h[n] === a && (a !== t || n in Ae(h));
          };
        }
        function T_(n) {
          var a = To(n, function(m) {
            return h.size === f && h.clear(), m;
          }), h = a.cache;
          return a;
        }
        function S_(n, a) {
          var h = n[1], m = a[1], _ = h | m, w = _ < (x | E | V), S = m == V && h == A || m == V && h == R && n[7].length <= a[8] || m == (V | R) && a[7].length <= a[8] && h == A;
          if (!(w || S))
            return n;
          m & x && (n[2] = a[2], _ |= h & x ? 0 : M);
          var P = a[3];
          if (P) {
            var L = n[3];
            n[3] = L ? qu(L, P, a[4]) : P, n[4] = L ? Qr(n[3], p) : a[4];
          }
          return P = a[5], P && (L = n[5], n[5] = L ? Qu(L, P, a[6]) : P, n[6] = L ? Qr(n[5], p) : a[6]), P = a[7], P && (n[7] = P), m & V && (n[8] = n[8] == null ? a[8] : it(n[8], a[8])), n[9] == null && (n[9] = a[9]), n[0] = a[0], n[1] = _, n;
        }
        function M_(n) {
          var a = [];
          if (n != null)
            for (var h in Ae(n))
              a.push(h);
          return a;
        }
        function A_(n) {
          return Ys.call(n);
        }
        function gh(n, a, h) {
          return a = Xe(a === t ? n.length - 1 : a, 0), function() {
            for (var m = arguments, _ = -1, w = Xe(m.length - a, 0), S = F(w); ++_ < w; )
              S[_] = m[a + _];
            _ = -1;
            for (var P = F(a + 1); ++_ < a; )
              P[_] = m[_];
            return P[a] = h(S), Et(n, this, P);
          };
        }
        function _h(n, a) {
          return a.length < 2 ? n : Bi(n, Gt(a, 0, -1));
        }
        function P_(n, a) {
          for (var h = n.length, m = it(a.length, h), _ = wt(n); m--; ) {
            var w = a[m];
            n[m] = kr(w, h) ? _[w] : t;
          }
          return n;
        }
        function ll(n, a) {
          if (!(a === "constructor" && typeof n[a] == "function") && a != "__proto__")
            return n[a];
        }
        var yh = wh(Hu), is = Vm || function(n, a) {
          return Ze.setTimeout(n, a);
        }, cl = wh(Kg);
        function vh(n, a, h) {
          var m = a + "";
          return cl(n, y_(m, E_(m_(m), h)));
        }
        function wh(n) {
          var a = 0, h = 0;
          return function() {
            var m = $m(), _ = K - (m - h);
            if (h = m, _ > 0) {
              if (++a >= $)
                return arguments[0];
            } else
              a = 0;
            return n.apply(t, arguments);
          };
        }
        function vo(n, a) {
          var h = -1, m = n.length, _ = m - 1;
          for (a = a === t ? m : a; ++h < a; ) {
            var w = ja(h, _), S = n[w];
            n[w] = n[h], n[h] = S;
          }
          return n.length = a, n;
        }
        var xh = T_(function(n) {
          var a = [];
          return n.charCodeAt(0) === 46 && a.push(""), n.replace(ln, function(h, m, _, w) {
            a.push(_ ? w.replace(Mp, "$1") : m || h);
          }), a;
        });
        function xr(n) {
          if (typeof n == "string" || Ot(n))
            return n;
          var a = n + "";
          return a == "0" && 1 / n == -Ee ? "-0" : a;
        }
        function ki(n) {
          if (n != null) {
            try {
              return Xs.call(n);
            } catch {
            }
            try {
              return n + "";
            } catch {
            }
          }
          return "";
        }
        function E_(n, a) {
          return Nt(ct, function(h) {
            var m = "_." + h[0];
            a & h[1] && !Vs(n, m) && n.push(m);
          }), n.sort();
        }
        function bh(n) {
          if (n instanceof _e)
            return n.clone();
          var a = new Vt(n.__wrapped__, n.__chain__);
          return a.__actions__ = wt(n.__actions__), a.__index__ = n.__index__, a.__values__ = n.__values__, a;
        }
        function C_(n, a, h) {
          (h ? ft(n, a, h) : a === t) ? a = 1 : a = Xe(ue(a), 0);
          var m = n == null ? 0 : n.length;
          if (!m || a < 1)
            return [];
          for (var _ = 0, w = 0, S = F(eo(m / a)); _ < m; )
            S[w++] = Gt(n, _, _ += a);
          return S;
        }
        function L_(n) {
          for (var a = -1, h = n == null ? 0 : n.length, m = 0, _ = []; ++a < h; ) {
            var w = n[a];
            w && (_[m++] = w);
          }
          return _;
        }
        function O_() {
          var n = arguments.length;
          if (!n)
            return [];
          for (var a = F(n - 1), h = arguments[0], m = n; m--; )
            a[m - 1] = arguments[m];
          return qr(le(h) ? wt(h) : [h], Ke(a, 1));
        }
        var D_ = fe(function(n, a) {
          return Ne(n) ? qn(n, Ke(a, 1, Ne, !0)) : [];
        }), I_ = fe(function(n, a) {
          var h = jt(a);
          return Ne(h) && (h = t), Ne(n) ? qn(n, Ke(a, 1, Ne, !0), re(h, 2)) : [];
        }), F_ = fe(function(n, a) {
          var h = jt(a);
          return Ne(h) && (h = t), Ne(n) ? qn(n, Ke(a, 1, Ne, !0), t, h) : [];
        });
        function R_(n, a, h) {
          var m = n == null ? 0 : n.length;
          return m ? (a = h || a === t ? 1 : ue(a), Gt(n, a < 0 ? 0 : a, m)) : [];
        }
        function B_(n, a, h) {
          var m = n == null ? 0 : n.length;
          return m ? (a = h || a === t ? 1 : ue(a), a = m - a, Gt(n, 0, a < 0 ? 0 : a)) : [];
        }
        function U_(n, a) {
          return n && n.length ? uo(n, re(a, 3), !0, !0) : [];
        }
        function k_(n, a) {
          return n && n.length ? uo(n, re(a, 3), !0) : [];
        }
        function z_(n, a, h, m) {
          var _ = n == null ? 0 : n.length;
          return _ ? (h && typeof h != "number" && ft(n, a, h) && (h = 0, m = _), Og(n, a, h, m)) : [];
        }
        function Th(n, a, h) {
          var m = n == null ? 0 : n.length;
          if (!m)
            return -1;
          var _ = h == null ? 0 : ue(h);
          return _ < 0 && (_ = Xe(m + _, 0)), Ws(n, re(a, 3), _);
        }
        function Sh(n, a, h) {
          var m = n == null ? 0 : n.length;
          if (!m)
            return -1;
          var _ = m - 1;
          return h !== t && (_ = ue(h), _ = h < 0 ? Xe(m + _, 0) : it(_, m - 1)), Ws(n, re(a, 3), _, !0);
        }
        function Mh(n) {
          var a = n == null ? 0 : n.length;
          return a ? Ke(n, 1) : [];
        }
        function N_(n) {
          var a = n == null ? 0 : n.length;
          return a ? Ke(n, Ee) : [];
        }
        function H_(n, a) {
          var h = n == null ? 0 : n.length;
          return h ? (a = a === t ? 1 : ue(a), Ke(n, a)) : [];
        }
        function V_(n) {
          for (var a = -1, h = n == null ? 0 : n.length, m = {}; ++a < h; ) {
            var _ = n[a];
            m[_[0]] = _[1];
          }
          return m;
        }
        function Ah(n) {
          return n && n.length ? n[0] : t;
        }
        function W_(n, a, h) {
          var m = n == null ? 0 : n.length;
          if (!m)
            return -1;
          var _ = h == null ? 0 : ue(h);
          return _ < 0 && (_ = Xe(m + _, 0)), un(n, a, _);
        }
        function G_(n) {
          var a = n == null ? 0 : n.length;
          return a ? Gt(n, 0, -1) : [];
        }
        var j_ = fe(function(n) {
          var a = Re(n, Ka);
          return a.length && a[0] === n[0] ? Na(a) : [];
        }), $_ = fe(function(n) {
          var a = jt(n), h = Re(n, Ka);
          return a === jt(h) ? a = t : h.pop(), h.length && h[0] === n[0] ? Na(h, re(a, 2)) : [];
        }), X_ = fe(function(n) {
          var a = jt(n), h = Re(n, Ka);
          return a = typeof a == "function" ? a : t, a && h.pop(), h.length && h[0] === n[0] ? Na(h, t, a) : [];
        });
        function Y_(n, a) {
          return n == null ? "" : Gm.call(n, a);
        }
        function jt(n) {
          var a = n == null ? 0 : n.length;
          return a ? n[a - 1] : t;
        }
        function Z_(n, a, h) {
          var m = n == null ? 0 : n.length;
          if (!m)
            return -1;
          var _ = m;
          return h !== t && (_ = ue(h), _ = _ < 0 ? Xe(m + _, 0) : it(_, m - 1)), a === a ? Em(n, a, _) : Ws(n, ou, _, !0);
        }
        function K_(n, a) {
          return n && n.length ? Uu(n, ue(a)) : t;
        }
        var q_ = fe(Ph);
        function Ph(n, a) {
          return n && n.length && a && a.length ? Ga(n, a) : n;
        }
        function Q_(n, a, h) {
          return n && n.length && a && a.length ? Ga(n, a, re(h, 2)) : n;
        }
        function J_(n, a, h) {
          return n && n.length && a && a.length ? Ga(n, a, t, h) : n;
        }
        var e0 = Ur(function(n, a) {
          var h = n == null ? 0 : n.length, m = Ba(n, a);
          return Nu(n, Re(a, function(_) {
            return kr(_, h) ? +_ : _;
          }).sort(Ku)), m;
        });
        function t0(n, a) {
          var h = [];
          if (!(n && n.length))
            return h;
          var m = -1, _ = [], w = n.length;
          for (a = re(a, 3); ++m < w; ) {
            var S = n[m];
            a(S, m, n) && (h.push(S), _.push(m));
          }
          return Nu(n, _), h;
        }
        function ul(n) {
          return n == null ? n : Ym.call(n);
        }
        function r0(n, a, h) {
          var m = n == null ? 0 : n.length;
          return m ? (h && typeof h != "number" && ft(n, a, h) ? (a = 0, h = m) : (a = a == null ? 0 : ue(a), h = h === t ? m : ue(h)), Gt(n, a, h)) : [];
        }
        function i0(n, a) {
          return co(n, a);
        }
        function n0(n, a, h) {
          return Xa(n, a, re(h, 2));
        }
        function s0(n, a) {
          var h = n == null ? 0 : n.length;
          if (h) {
            var m = co(n, a);
            if (m < h && lr(n[m], a))
              return m;
          }
          return -1;
        }
        function o0(n, a) {
          return co(n, a, !0);
        }
        function a0(n, a, h) {
          return Xa(n, a, re(h, 2), !0);
        }
        function l0(n, a) {
          var h = n == null ? 0 : n.length;
          if (h) {
            var m = co(n, a, !0) - 1;
            if (lr(n[m], a))
              return m;
          }
          return -1;
        }
        function c0(n) {
          return n && n.length ? Vu(n) : [];
        }
        function u0(n, a) {
          return n && n.length ? Vu(n, re(a, 2)) : [];
        }
        function h0(n) {
          var a = n == null ? 0 : n.length;
          return a ? Gt(n, 1, a) : [];
        }
        function f0(n, a, h) {
          return n && n.length ? (a = h || a === t ? 1 : ue(a), Gt(n, 0, a < 0 ? 0 : a)) : [];
        }
        function d0(n, a, h) {
          var m = n == null ? 0 : n.length;
          return m ? (a = h || a === t ? 1 : ue(a), a = m - a, Gt(n, a < 0 ? 0 : a, m)) : [];
        }
        function p0(n, a) {
          return n && n.length ? uo(n, re(a, 3), !1, !0) : [];
        }
        function m0(n, a) {
          return n && n.length ? uo(n, re(a, 3)) : [];
        }
        var g0 = fe(function(n) {
          return ti(Ke(n, 1, Ne, !0));
        }), _0 = fe(function(n) {
          var a = jt(n);
          return Ne(a) && (a = t), ti(Ke(n, 1, Ne, !0), re(a, 2));
        }), y0 = fe(function(n) {
          var a = jt(n);
          return a = typeof a == "function" ? a : t, ti(Ke(n, 1, Ne, !0), t, a);
        });
        function v0(n) {
          return n && n.length ? ti(n) : [];
        }
        function w0(n, a) {
          return n && n.length ? ti(n, re(a, 2)) : [];
        }
        function x0(n, a) {
          return a = typeof a == "function" ? a : t, n && n.length ? ti(n, t, a) : [];
        }
        function hl(n) {
          if (!(n && n.length))
            return [];
          var a = 0;
          return n = Kr(n, function(h) {
            if (Ne(h))
              return a = Xe(h.length, a), !0;
          }), Ea(a, function(h) {
            return Re(n, Ma(h));
          });
        }
        function Eh(n, a) {
          if (!(n && n.length))
            return [];
          var h = hl(n);
          return a == null ? h : Re(h, function(m) {
            return Et(a, t, m);
          });
        }
        var b0 = fe(function(n, a) {
          return Ne(n) ? qn(n, a) : [];
        }), T0 = fe(function(n) {
          return Za(Kr(n, Ne));
        }), S0 = fe(function(n) {
          var a = jt(n);
          return Ne(a) && (a = t), Za(Kr(n, Ne), re(a, 2));
        }), M0 = fe(function(n) {
          var a = jt(n);
          return a = typeof a == "function" ? a : t, Za(Kr(n, Ne), t, a);
        }), A0 = fe(hl);
        function P0(n, a) {
          return $u(n || [], a || [], Kn);
        }
        function E0(n, a) {
          return $u(n || [], a || [], es);
        }
        var C0 = fe(function(n) {
          var a = n.length, h = a > 1 ? n[a - 1] : t;
          return h = typeof h == "function" ? (n.pop(), h) : t, Eh(n, h);
        });
        function Ch(n) {
          var a = v(n);
          return a.__chain__ = !0, a;
        }
        function L0(n, a) {
          return a(n), n;
        }
        function wo(n, a) {
          return a(n);
        }
        var O0 = Ur(function(n) {
          var a = n.length, h = a ? n[0] : 0, m = this.__wrapped__, _ = function(w) {
            return Ba(w, n);
          };
          return a > 1 || this.__actions__.length || !(m instanceof _e) || !kr(h) ? this.thru(_) : (m = m.slice(h, +h + (a ? 1 : 0)), m.__actions__.push({
            func: wo,
            args: [_],
            thisArg: t
          }), new Vt(m, this.__chain__).thru(function(w) {
            return a && !w.length && w.push(t), w;
          }));
        });
        function D0() {
          return Ch(this);
        }
        function I0() {
          return new Vt(this.value(), this.__chain__);
        }
        function F0() {
          this.__values__ === t && (this.__values__ = Wh(this.value()));
          var n = this.__index__ >= this.__values__.length, a = n ? t : this.__values__[this.__index__++];
          return { done: n, value: a };
        }
        function R0() {
          return this;
        }
        function B0(n) {
          for (var a, h = this; h instanceof no; ) {
            var m = bh(h);
            m.__index__ = 0, m.__values__ = t, a ? _.__wrapped__ = m : a = m;
            var _ = m;
            h = h.__wrapped__;
          }
          return _.__wrapped__ = n, a;
        }
        function U0() {
          var n = this.__wrapped__;
          if (n instanceof _e) {
            var a = n;
            return this.__actions__.length && (a = new _e(this)), a = a.reverse(), a.__actions__.push({
              func: wo,
              args: [ul],
              thisArg: t
            }), new Vt(a, this.__chain__);
          }
          return this.thru(ul);
        }
        function k0() {
          return ju(this.__wrapped__, this.__actions__);
        }
        var z0 = ho(function(n, a, h) {
          Me.call(n, h) ? ++n[h] : Rr(n, h, 1);
        });
        function N0(n, a, h) {
          var m = le(n) ? nu : Lg;
          return h && ft(n, a, h) && (a = t), m(n, re(a, 3));
        }
        function H0(n, a) {
          var h = le(n) ? Kr : Eu;
          return h(n, re(a, 3));
        }
        var V0 = rh(Th), W0 = rh(Sh);
        function G0(n, a) {
          return Ke(xo(n, a), 1);
        }
        function j0(n, a) {
          return Ke(xo(n, a), Ee);
        }
        function $0(n, a, h) {
          return h = h === t ? 1 : ue(h), Ke(xo(n, a), h);
        }
        function Lh(n, a) {
          var h = le(n) ? Nt : ei;
          return h(n, re(a, 3));
        }
        function Oh(n, a) {
          var h = le(n) ? hm : Pu;
          return h(n, re(a, 3));
        }
        var X0 = ho(function(n, a, h) {
          Me.call(n, h) ? n[h].push(a) : Rr(n, h, [a]);
        });
        function Y0(n, a, h, m) {
          n = xt(n) ? n : bn(n), h = h && !m ? ue(h) : 0;
          var _ = n.length;
          return h < 0 && (h = Xe(_ + h, 0)), Ao(n) ? h <= _ && n.indexOf(a, h) > -1 : !!_ && un(n, a, h) > -1;
        }
        var Z0 = fe(function(n, a, h) {
          var m = -1, _ = typeof a == "function", w = xt(n) ? F(n.length) : [];
          return ei(n, function(S) {
            w[++m] = _ ? Et(a, S, h) : Qn(S, a, h);
          }), w;
        }), K0 = ho(function(n, a, h) {
          Rr(n, h, a);
        });
        function xo(n, a) {
          var h = le(n) ? Re : Fu;
          return h(n, re(a, 3));
        }
        function q0(n, a, h, m) {
          return n == null ? [] : (le(a) || (a = a == null ? [] : [a]), h = m ? t : h, le(h) || (h = h == null ? [] : [h]), ku(n, a, h));
        }
        var Q0 = ho(function(n, a, h) {
          n[h ? 0 : 1].push(a);
        }, function() {
          return [[], []];
        });
        function J0(n, a, h) {
          var m = le(n) ? Ta : lu, _ = arguments.length < 3;
          return m(n, re(a, 4), h, _, ei);
        }
        function ey(n, a, h) {
          var m = le(n) ? fm : lu, _ = arguments.length < 3;
          return m(n, re(a, 4), h, _, Pu);
        }
        function ty(n, a) {
          var h = le(n) ? Kr : Eu;
          return h(n, So(re(a, 3)));
        }
        function ry(n) {
          var a = le(n) ? Tu : Yg;
          return a(n);
        }
        function iy(n, a, h) {
          (h ? ft(n, a, h) : a === t) ? a = 1 : a = ue(a);
          var m = le(n) ? Mg : Zg;
          return m(n, a);
        }
        function ny(n) {
          var a = le(n) ? Ag : qg;
          return a(n);
        }
        function sy(n) {
          if (n == null)
            return 0;
          if (xt(n))
            return Ao(n) ? fn(n) : n.length;
          var a = nt(n);
          return a == Ge || a == Pt ? n.size : Va(n).length;
        }
        function oy(n, a, h) {
          var m = le(n) ? Sa : Qg;
          return h && ft(n, a, h) && (a = t), m(n, re(a, 3));
        }
        var ay = fe(function(n, a) {
          if (n == null)
            return [];
          var h = a.length;
          return h > 1 && ft(n, a[0], a[1]) ? a = [] : h > 2 && ft(a[0], a[1], a[2]) && (a = [a[0]]), ku(n, Ke(a, 1), []);
        }), bo = Hm || function() {
          return Ze.Date.now();
        };
        function ly(n, a) {
          if (typeof a != "function")
            throw new Ht(l);
          return n = ue(n), function() {
            if (--n < 1)
              return a.apply(this, arguments);
          };
        }
        function Dh(n, a, h) {
          return a = h ? t : a, a = n && a == null ? n.length : a, Br(n, V, t, t, t, t, a);
        }
        function Ih(n, a) {
          var h;
          if (typeof a != "function")
            throw new Ht(l);
          return n = ue(n), function() {
            return --n > 0 && (h = a.apply(this, arguments)), n <= 1 && (a = t), h;
          };
        }
        var fl = fe(function(n, a, h) {
          var m = x;
          if (h.length) {
            var _ = Qr(h, wn(fl));
            m |= z;
          }
          return Br(n, m, a, h, _);
        }), Fh = fe(function(n, a, h) {
          var m = x | E;
          if (h.length) {
            var _ = Qr(h, wn(Fh));
            m |= z;
          }
          return Br(a, m, n, h, _);
        });
        function Rh(n, a, h) {
          a = h ? t : a;
          var m = Br(n, A, t, t, t, t, t, a);
          return m.placeholder = Rh.placeholder, m;
        }
        function Bh(n, a, h) {
          a = h ? t : a;
          var m = Br(n, D, t, t, t, t, t, a);
          return m.placeholder = Bh.placeholder, m;
        }
        function Uh(n, a, h) {
          var m, _, w, S, P, L, N = 0, H = !1, W = !1, Z = !0;
          if (typeof n != "function")
            throw new Ht(l);
          a = $t(a) || 0, ke(h) && (H = !!h.leading, W = "maxWait" in h, w = W ? Xe($t(h.maxWait) || 0, a) : w, Z = "trailing" in h ? !!h.trailing : Z);
          function J(He) {
            var cr = m, Hr = _;
            return m = _ = t, N = He, S = n.apply(Hr, cr), S;
          }
          function ie(He) {
            return N = He, P = is(de, a), H ? J(He) : S;
          }
          function he(He) {
            var cr = He - L, Hr = He - N, rf = a - cr;
            return W ? it(rf, w - Hr) : rf;
          }
          function ne(He) {
            var cr = He - L, Hr = He - N;
            return L === t || cr >= a || cr < 0 || W && Hr >= w;
          }
          function de() {
            var He = bo();
            if (ne(He))
              return ye(He);
            P = is(de, he(He));
          }
          function ye(He) {
            return P = t, Z && m ? J(He) : (m = _ = t, S);
          }
          function Dt() {
            P !== t && Xu(P), N = 0, m = L = _ = P = t;
          }
          function dt() {
            return P === t ? S : ye(bo());
          }
          function It() {
            var He = bo(), cr = ne(He);
            if (m = arguments, _ = this, L = He, cr) {
              if (P === t)
                return ie(L);
              if (W)
                return Xu(P), P = is(de, a), J(L);
            }
            return P === t && (P = is(de, a)), S;
          }
          return It.cancel = Dt, It.flush = dt, It;
        }
        var cy = fe(function(n, a) {
          return Au(n, 1, a);
        }), uy = fe(function(n, a, h) {
          return Au(n, $t(a) || 0, h);
        });
        function hy(n) {
          return Br(n, G);
        }
        function To(n, a) {
          if (typeof n != "function" || a != null && typeof a != "function")
            throw new Ht(l);
          var h = function() {
            var m = arguments, _ = a ? a.apply(this, m) : m[0], w = h.cache;
            if (w.has(_))
              return w.get(_);
            var S = n.apply(this, m);
            return h.cache = w.set(_, S) || w, S;
          };
          return h.cache = new (To.Cache || Fr)(), h;
        }
        To.Cache = Fr;
        function So(n) {
          if (typeof n != "function")
            throw new Ht(l);
          return function() {
            var a = arguments;
            switch (a.length) {
              case 0:
                return !n.call(this);
              case 1:
                return !n.call(this, a[0]);
              case 2:
                return !n.call(this, a[0], a[1]);
              case 3:
                return !n.call(this, a[0], a[1], a[2]);
            }
            return !n.apply(this, a);
          };
        }
        function fy(n) {
          return Ih(2, n);
        }
        var dy = Jg(function(n, a) {
          a = a.length == 1 && le(a[0]) ? Re(a[0], Ct(re())) : Re(Ke(a, 1), Ct(re()));
          var h = a.length;
          return fe(function(m) {
            for (var _ = -1, w = it(m.length, h); ++_ < w; )
              m[_] = a[_].call(this, m[_]);
            return Et(n, this, m);
          });
        }), dl = fe(function(n, a) {
          var h = Qr(a, wn(dl));
          return Br(n, z, t, a, h);
        }), kh = fe(function(n, a) {
          var h = Qr(a, wn(kh));
          return Br(n, j, t, a, h);
        }), py = Ur(function(n, a) {
          return Br(n, R, t, t, t, a);
        });
        function my(n, a) {
          if (typeof n != "function")
            throw new Ht(l);
          return a = a === t ? a : ue(a), fe(n, a);
        }
        function gy(n, a) {
          if (typeof n != "function")
            throw new Ht(l);
          return a = a == null ? 0 : Xe(ue(a), 0), fe(function(h) {
            var m = h[a], _ = ii(h, 0, a);
            return m && qr(_, m), Et(n, this, _);
          });
        }
        function _y(n, a, h) {
          var m = !0, _ = !0;
          if (typeof n != "function")
            throw new Ht(l);
          return ke(h) && (m = "leading" in h ? !!h.leading : m, _ = "trailing" in h ? !!h.trailing : _), Uh(n, a, {
            leading: m,
            maxWait: a,
            trailing: _
          });
        }
        function yy(n) {
          return Dh(n, 1);
        }
        function vy(n, a) {
          return dl(qa(a), n);
        }
        function wy() {
          if (!arguments.length)
            return [];
          var n = arguments[0];
          return le(n) ? n : [n];
        }
        function xy(n) {
          return Wt(n, y);
        }
        function by(n, a) {
          return a = typeof a == "function" ? a : t, Wt(n, y, a);
        }
        function Ty(n) {
          return Wt(n, d | y);
        }
        function Sy(n, a) {
          return a = typeof a == "function" ? a : t, Wt(n, d | y, a);
        }
        function My(n, a) {
          return a == null || Mu(n, a, Ye(a));
        }
        function lr(n, a) {
          return n === a || n !== n && a !== a;
        }
        var Ay = go(za), Py = go(function(n, a) {
          return n >= a;
        }), zi = Ou(/* @__PURE__ */ (function() {
          return arguments;
        })()) ? Ou : function(n) {
          return ze(n) && Me.call(n, "callee") && !_u.call(n, "callee");
        }, le = F.isArray, Ey = Qc ? Ct(Qc) : Bg;
        function xt(n) {
          return n != null && Mo(n.length) && !zr(n);
        }
        function Ne(n) {
          return ze(n) && xt(n);
        }
        function Cy(n) {
          return n === !0 || n === !1 || ze(n) && ht(n) == yt;
        }
        var ni = Wm || Sl, Ly = Jc ? Ct(Jc) : Ug;
        function Oy(n) {
          return ze(n) && n.nodeType === 1 && !ns(n);
        }
        function Dy(n) {
          if (n == null)
            return !0;
          if (xt(n) && (le(n) || typeof n == "string" || typeof n.splice == "function" || ni(n) || xn(n) || zi(n)))
            return !n.length;
          var a = nt(n);
          if (a == Ge || a == Pt)
            return !n.size;
          if (rs(n))
            return !Va(n).length;
          for (var h in n)
            if (Me.call(n, h))
              return !1;
          return !0;
        }
        function Iy(n, a) {
          return Jn(n, a);
        }
        function Fy(n, a, h) {
          h = typeof h == "function" ? h : t;
          var m = h ? h(n, a) : t;
          return m === t ? Jn(n, a, t, h) : !!m;
        }
        function pl(n) {
          if (!ze(n))
            return !1;
          var a = ht(n);
          return a == Or || a == nn || typeof n.message == "string" && typeof n.name == "string" && !ns(n);
        }
        function Ry(n) {
          return typeof n == "number" && vu(n);
        }
        function zr(n) {
          if (!ke(n))
            return !1;
          var a = ht(n);
          return a == rr || a == Dr || a == er || a == sn;
        }
        function zh(n) {
          return typeof n == "number" && n == ue(n);
        }
        function Mo(n) {
          return typeof n == "number" && n > -1 && n % 1 == 0 && n <= we;
        }
        function ke(n) {
          var a = typeof n;
          return n != null && (a == "object" || a == "function");
        }
        function ze(n) {
          return n != null && typeof n == "object";
        }
        var Nh = eu ? Ct(eu) : zg;
        function By(n, a) {
          return n === a || Ha(n, a, nl(a));
        }
        function Uy(n, a, h) {
          return h = typeof h == "function" ? h : t, Ha(n, a, nl(a), h);
        }
        function ky(n) {
          return Hh(n) && n != +n;
        }
        function zy(n) {
          if (b_(n))
            throw new ae(o);
          return Du(n);
        }
        function Ny(n) {
          return n === null;
        }
        function Hy(n) {
          return n == null;
        }
        function Hh(n) {
          return typeof n == "number" || ze(n) && ht(n) == At;
        }
        function ns(n) {
          if (!ze(n) || ht(n) != vt)
            return !1;
          var a = qs(n);
          if (a === null)
            return !0;
          var h = Me.call(a, "constructor") && a.constructor;
          return typeof h == "function" && h instanceof h && Xs.call(h) == Um;
        }
        var ml = tu ? Ct(tu) : Ng;
        function Vy(n) {
          return zh(n) && n >= -we && n <= we;
        }
        var Vh = ru ? Ct(ru) : Hg;
        function Ao(n) {
          return typeof n == "string" || !le(n) && ze(n) && ht(n) == $r;
        }
        function Ot(n) {
          return typeof n == "symbol" || ze(n) && ht(n) == Xr;
        }
        var xn = iu ? Ct(iu) : Vg;
        function Wy(n) {
          return n === t;
        }
        function Gy(n) {
          return ze(n) && nt(n) == Pi;
        }
        function jy(n) {
          return ze(n) && ht(n) == fa;
        }
        var $y = go(Wa), Xy = go(function(n, a) {
          return n <= a;
        });
        function Wh(n) {
          if (!n)
            return [];
          if (xt(n))
            return Ao(n) ? or(n) : wt(n);
          if (jn && n[jn])
            return Mm(n[jn]());
          var a = nt(n), h = a == Ge ? La : a == Pt ? Gs : bn;
          return h(n);
        }
        function Nr(n) {
          if (!n)
            return n === 0 ? n : 0;
          if (n = $t(n), n === Ee || n === -Ee) {
            var a = n < 0 ? -1 : 1;
            return a * be;
          }
          return n === n ? n : 0;
        }
        function ue(n) {
          var a = Nr(n), h = a % 1;
          return a === a ? h ? a - h : a : 0;
        }
        function Gh(n) {
          return n ? Ri(ue(n), 0, Ce) : 0;
        }
        function $t(n) {
          if (typeof n == "number")
            return n;
          if (Ot(n))
            return ge;
          if (ke(n)) {
            var a = typeof n.valueOf == "function" ? n.valueOf() : n;
            n = ke(a) ? a + "" : a;
          }
          if (typeof n != "string")
            return n === 0 ? n : +n;
          n = cu(n);
          var h = Ep.test(n);
          return h || Lp.test(n) ? lm(n.slice(2), h ? 2 : 8) : Pp.test(n) ? ge : +n;
        }
        function jh(n) {
          return wr(n, bt(n));
        }
        function Yy(n) {
          return n ? Ri(ue(n), -we, we) : n === 0 ? n : 0;
        }
        function Se(n) {
          return n == null ? "" : Lt(n);
        }
        var Zy = yn(function(n, a) {
          if (rs(a) || xt(a)) {
            wr(a, Ye(a), n);
            return;
          }
          for (var h in a)
            Me.call(a, h) && Kn(n, h, a[h]);
        }), $h = yn(function(n, a) {
          wr(a, bt(a), n);
        }), Po = yn(function(n, a, h, m) {
          wr(a, bt(a), n, m);
        }), Ky = yn(function(n, a, h, m) {
          wr(a, Ye(a), n, m);
        }), qy = Ur(Ba);
        function Qy(n, a) {
          var h = _n(n);
          return a == null ? h : Su(h, a);
        }
        var Jy = fe(function(n, a) {
          n = Ae(n);
          var h = -1, m = a.length, _ = m > 2 ? a[2] : t;
          for (_ && ft(a[0], a[1], _) && (m = 1); ++h < m; )
            for (var w = a[h], S = bt(w), P = -1, L = S.length; ++P < L; ) {
              var N = S[P], H = n[N];
              (H === t || lr(H, pn[N]) && !Me.call(n, N)) && (n[N] = w[N]);
            }
          return n;
        }), ev = fe(function(n) {
          return n.push(t, ch), Et(Xh, t, n);
        });
        function tv(n, a) {
          return su(n, re(a, 3), vr);
        }
        function rv(n, a) {
          return su(n, re(a, 3), ka);
        }
        function iv(n, a) {
          return n == null ? n : Ua(n, re(a, 3), bt);
        }
        function nv(n, a) {
          return n == null ? n : Cu(n, re(a, 3), bt);
        }
        function sv(n, a) {
          return n && vr(n, re(a, 3));
        }
        function ov(n, a) {
          return n && ka(n, re(a, 3));
        }
        function av(n) {
          return n == null ? [] : ao(n, Ye(n));
        }
        function lv(n) {
          return n == null ? [] : ao(n, bt(n));
        }
        function gl(n, a, h) {
          var m = n == null ? t : Bi(n, a);
          return m === t ? h : m;
        }
        function cv(n, a) {
          return n != null && fh(n, a, Dg);
        }
        function _l(n, a) {
          return n != null && fh(n, a, Ig);
        }
        var uv = nh(function(n, a, h) {
          a != null && typeof a.toString != "function" && (a = Ys.call(a)), n[a] = h;
        }, vl(Tt)), hv = nh(function(n, a, h) {
          a != null && typeof a.toString != "function" && (a = Ys.call(a)), Me.call(n, a) ? n[a].push(h) : n[a] = [h];
        }, re), fv = fe(Qn);
        function Ye(n) {
          return xt(n) ? bu(n) : Va(n);
        }
        function bt(n) {
          return xt(n) ? bu(n, !0) : Wg(n);
        }
        function dv(n, a) {
          var h = {};
          return a = re(a, 3), vr(n, function(m, _, w) {
            Rr(h, a(m, _, w), m);
          }), h;
        }
        function pv(n, a) {
          var h = {};
          return a = re(a, 3), vr(n, function(m, _, w) {
            Rr(h, _, a(m, _, w));
          }), h;
        }
        var mv = yn(function(n, a, h) {
          lo(n, a, h);
        }), Xh = yn(function(n, a, h, m) {
          lo(n, a, h, m);
        }), gv = Ur(function(n, a) {
          var h = {};
          if (n == null)
            return h;
          var m = !1;
          a = Re(a, function(w) {
            return w = ri(w, n), m || (m = w.length > 1), w;
          }), wr(n, rl(n), h), m && (h = Wt(h, d | g | y, u_));
          for (var _ = a.length; _--; )
            Ya(h, a[_]);
          return h;
        });
        function _v(n, a) {
          return Yh(n, So(re(a)));
        }
        var yv = Ur(function(n, a) {
          return n == null ? {} : jg(n, a);
        });
        function Yh(n, a) {
          if (n == null)
            return {};
          var h = Re(rl(n), function(m) {
            return [m];
          });
          return a = re(a), zu(n, h, function(m, _) {
            return a(m, _[0]);
          });
        }
        function vv(n, a, h) {
          a = ri(a, n);
          var m = -1, _ = a.length;
          for (_ || (_ = 1, n = t); ++m < _; ) {
            var w = n == null ? t : n[xr(a[m])];
            w === t && (m = _, w = h), n = zr(w) ? w.call(n) : w;
          }
          return n;
        }
        function wv(n, a, h) {
          return n == null ? n : es(n, a, h);
        }
        function xv(n, a, h, m) {
          return m = typeof m == "function" ? m : t, n == null ? n : es(n, a, h, m);
        }
        var Zh = ah(Ye), Kh = ah(bt);
        function bv(n, a, h) {
          var m = le(n), _ = m || ni(n) || xn(n);
          if (a = re(a, 4), h == null) {
            var w = n && n.constructor;
            _ ? h = m ? new w() : [] : ke(n) ? h = zr(w) ? _n(qs(n)) : {} : h = {};
          }
          return (_ ? Nt : vr)(n, function(S, P, L) {
            return a(h, S, P, L);
          }), h;
        }
        function Tv(n, a) {
          return n == null ? !0 : Ya(n, a);
        }
        function Sv(n, a, h) {
          return n == null ? n : Gu(n, a, qa(h));
        }
        function Mv(n, a, h, m) {
          return m = typeof m == "function" ? m : t, n == null ? n : Gu(n, a, qa(h), m);
        }
        function bn(n) {
          return n == null ? [] : Ca(n, Ye(n));
        }
        function Av(n) {
          return n == null ? [] : Ca(n, bt(n));
        }
        function Pv(n, a, h) {
          return h === t && (h = a, a = t), h !== t && (h = $t(h), h = h === h ? h : 0), a !== t && (a = $t(a), a = a === a ? a : 0), Ri($t(n), a, h);
        }
        function Ev(n, a, h) {
          return a = Nr(a), h === t ? (h = a, a = 0) : h = Nr(h), n = $t(n), Fg(n, a, h);
        }
        function Cv(n, a, h) {
          if (h && typeof h != "boolean" && ft(n, a, h) && (a = h = t), h === t && (typeof a == "boolean" ? (h = a, a = t) : typeof n == "boolean" && (h = n, n = t)), n === t && a === t ? (n = 0, a = 1) : (n = Nr(n), a === t ? (a = n, n = 0) : a = Nr(a)), n > a) {
            var m = n;
            n = a, a = m;
          }
          if (h || n % 1 || a % 1) {
            var _ = wu();
            return it(n + _ * (a - n + am("1e-" + ((_ + "").length - 1))), a);
          }
          return ja(n, a);
        }
        var Lv = vn(function(n, a, h) {
          return a = a.toLowerCase(), n + (h ? qh(a) : a);
        });
        function qh(n) {
          return yl(Se(n).toLowerCase());
        }
        function Qh(n) {
          return n = Se(n), n && n.replace(Dp, wm).replace(qp, "");
        }
        function Ov(n, a, h) {
          n = Se(n), a = Lt(a);
          var m = n.length;
          h = h === t ? m : Ri(ue(h), 0, m);
          var _ = h;
          return h -= a.length, h >= 0 && n.slice(h, _) == a;
        }
        function Dv(n) {
          return n = Se(n), n && ks.test(n) ? n.replace(ir, xm) : n;
        }
        function Iv(n) {
          return n = Se(n), n && yp.test(n) ? n.replace(da, "\\$&") : n;
        }
        var Fv = vn(function(n, a, h) {
          return n + (h ? "-" : "") + a.toLowerCase();
        }), Rv = vn(function(n, a, h) {
          return n + (h ? " " : "") + a.toLowerCase();
        }), Bv = th("toLowerCase");
        function Uv(n, a, h) {
          n = Se(n), a = ue(a);
          var m = a ? fn(n) : 0;
          if (!a || m >= a)
            return n;
          var _ = (a - m) / 2;
          return mo(to(_), h) + n + mo(eo(_), h);
        }
        function kv(n, a, h) {
          n = Se(n), a = ue(a);
          var m = a ? fn(n) : 0;
          return a && m < a ? n + mo(a - m, h) : n;
        }
        function zv(n, a, h) {
          n = Se(n), a = ue(a);
          var m = a ? fn(n) : 0;
          return a && m < a ? mo(a - m, h) + n : n;
        }
        function Nv(n, a, h) {
          return h || a == null ? a = 0 : a && (a = +a), Xm(Se(n).replace(pa, ""), a || 0);
        }
        function Hv(n, a, h) {
          return (h ? ft(n, a, h) : a === t) ? a = 1 : a = ue(a), $a(Se(n), a);
        }
        function Vv() {
          var n = arguments, a = Se(n[0]);
          return n.length < 3 ? a : a.replace(n[1], n[2]);
        }
        var Wv = vn(function(n, a, h) {
          return n + (h ? "_" : "") + a.toLowerCase();
        });
        function Gv(n, a, h) {
          return h && typeof h != "number" && ft(n, a, h) && (a = h = t), h = h === t ? Ce : h >>> 0, h ? (n = Se(n), n && (typeof a == "string" || a != null && !ml(a)) && (a = Lt(a), !a && hn(n)) ? ii(or(n), 0, h) : n.split(a, h)) : [];
        }
        var jv = vn(function(n, a, h) {
          return n + (h ? " " : "") + yl(a);
        });
        function $v(n, a, h) {
          return n = Se(n), h = h == null ? 0 : Ri(ue(h), 0, n.length), a = Lt(a), n.slice(h, h + a.length) == a;
        }
        function Xv(n, a, h) {
          var m = v.templateSettings;
          h && ft(n, a, h) && (a = t), n = Se(n), a = Po({}, a, m, lh);
          var _ = Po({}, a.imports, m.imports, lh), w = Ye(_), S = Ca(_, w), P, L, N = 0, H = a.interpolate || zs, W = "__p += '", Z = Oa(
            (a.escape || zs).source + "|" + H.source + "|" + (H === Zr ? Ap : zs).source + "|" + (a.evaluate || zs).source + "|$",
            "g"
          ), J = "//# sourceURL=" + (Me.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++rm + "]") + `
`;
          n.replace(Z, function(ne, de, ye, Dt, dt, It) {
            return ye || (ye = Dt), W += n.slice(N, It).replace(Ip, bm), de && (P = !0, W += `' +
__e(` + de + `) +
'`), dt && (L = !0, W += `';
` + dt + `;
__p += '`), ye && (W += `' +
((__t = (` + ye + `)) == null ? '' : __t) +
'`), N = It + ne.length, ne;
          }), W += `';
`;
          var ie = Me.call(a, "variable") && a.variable;
          if (!ie)
            W = `with (obj) {
` + W + `
}
`;
          else if (Sp.test(ie))
            throw new ae(c);
          W = (L ? W.replace(se, "") : W).replace(ve, "$1").replace(je, "$1;"), W = "function(" + (ie || "obj") + `) {
` + (ie ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (P ? ", __e = _.escape" : "") + (L ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + W + `return __p
}`;
          var he = ef(function() {
            return Te(w, J + "return " + W).apply(t, S);
          });
          if (he.source = W, pl(he))
            throw he;
          return he;
        }
        function Yv(n) {
          return Se(n).toLowerCase();
        }
        function Zv(n) {
          return Se(n).toUpperCase();
        }
        function Kv(n, a, h) {
          if (n = Se(n), n && (h || a === t))
            return cu(n);
          if (!n || !(a = Lt(a)))
            return n;
          var m = or(n), _ = or(a), w = uu(m, _), S = hu(m, _) + 1;
          return ii(m, w, S).join("");
        }
        function qv(n, a, h) {
          if (n = Se(n), n && (h || a === t))
            return n.slice(0, du(n) + 1);
          if (!n || !(a = Lt(a)))
            return n;
          var m = or(n), _ = hu(m, or(a)) + 1;
          return ii(m, 0, _).join("");
        }
        function Qv(n, a, h) {
          if (n = Se(n), n && (h || a === t))
            return n.replace(pa, "");
          if (!n || !(a = Lt(a)))
            return n;
          var m = or(n), _ = uu(m, or(a));
          return ii(m, _).join("");
        }
        function Jv(n, a) {
          var h = k, m = B;
          if (ke(a)) {
            var _ = "separator" in a ? a.separator : _;
            h = "length" in a ? ue(a.length) : h, m = "omission" in a ? Lt(a.omission) : m;
          }
          n = Se(n);
          var w = n.length;
          if (hn(n)) {
            var S = or(n);
            w = S.length;
          }
          if (h >= w)
            return n;
          var P = h - fn(m);
          if (P < 1)
            return m;
          var L = S ? ii(S, 0, P).join("") : n.slice(0, P);
          if (_ === t)
            return L + m;
          if (S && (P += L.length - P), ml(_)) {
            if (n.slice(P).search(_)) {
              var N, H = L;
              for (_.global || (_ = Oa(_.source, Se(Oc.exec(_)) + "g")), _.lastIndex = 0; N = _.exec(H); )
                var W = N.index;
              L = L.slice(0, W === t ? P : W);
            }
          } else if (n.indexOf(Lt(_), P) != P) {
            var Z = L.lastIndexOf(_);
            Z > -1 && (L = L.slice(0, Z));
          }
          return L + m;
        }
        function ew(n) {
          return n = Se(n), n && Lc.test(n) ? n.replace(kt, Cm) : n;
        }
        var tw = vn(function(n, a, h) {
          return n + (h ? " " : "") + a.toUpperCase();
        }), yl = th("toUpperCase");
        function Jh(n, a, h) {
          return n = Se(n), a = h ? t : a, a === t ? Sm(n) ? Dm(n) : mm(n) : n.match(a) || [];
        }
        var ef = fe(function(n, a) {
          try {
            return Et(n, t, a);
          } catch (h) {
            return pl(h) ? h : new ae(h);
          }
        }), rw = Ur(function(n, a) {
          return Nt(a, function(h) {
            h = xr(h), Rr(n, h, fl(n[h], n));
          }), n;
        });
        function iw(n) {
          var a = n == null ? 0 : n.length, h = re();
          return n = a ? Re(n, function(m) {
            if (typeof m[1] != "function")
              throw new Ht(l);
            return [h(m[0]), m[1]];
          }) : [], fe(function(m) {
            for (var _ = -1; ++_ < a; ) {
              var w = n[_];
              if (Et(w[0], this, m))
                return Et(w[1], this, m);
            }
          });
        }
        function nw(n) {
          return Cg(Wt(n, d));
        }
        function vl(n) {
          return function() {
            return n;
          };
        }
        function sw(n, a) {
          return n == null || n !== n ? a : n;
        }
        var ow = ih(), aw = ih(!0);
        function Tt(n) {
          return n;
        }
        function wl(n) {
          return Iu(typeof n == "function" ? n : Wt(n, d));
        }
        function lw(n) {
          return Ru(Wt(n, d));
        }
        function cw(n, a) {
          return Bu(n, Wt(a, d));
        }
        var uw = fe(function(n, a) {
          return function(h) {
            return Qn(h, n, a);
          };
        }), hw = fe(function(n, a) {
          return function(h) {
            return Qn(n, h, a);
          };
        });
        function xl(n, a, h) {
          var m = Ye(a), _ = ao(a, m);
          h == null && !(ke(a) && (_.length || !m.length)) && (h = a, a = n, n = this, _ = ao(a, Ye(a)));
          var w = !(ke(h) && "chain" in h) || !!h.chain, S = zr(n);
          return Nt(_, function(P) {
            var L = a[P];
            n[P] = L, S && (n.prototype[P] = function() {
              var N = this.__chain__;
              if (w || N) {
                var H = n(this.__wrapped__), W = H.__actions__ = wt(this.__actions__);
                return W.push({ func: L, args: arguments, thisArg: n }), H.__chain__ = N, H;
              }
              return L.apply(n, qr([this.value()], arguments));
            });
          }), n;
        }
        function fw() {
          return Ze._ === this && (Ze._ = km), this;
        }
        function bl() {
        }
        function dw(n) {
          return n = ue(n), fe(function(a) {
            return Uu(a, n);
          });
        }
        var pw = Ja(Re), mw = Ja(nu), gw = Ja(Sa);
        function tf(n) {
          return ol(n) ? Ma(xr(n)) : $g(n);
        }
        function _w(n) {
          return function(a) {
            return n == null ? t : Bi(n, a);
          };
        }
        var yw = sh(), vw = sh(!0);
        function Tl() {
          return [];
        }
        function Sl() {
          return !1;
        }
        function ww() {
          return {};
        }
        function xw() {
          return "";
        }
        function bw() {
          return !0;
        }
        function Tw(n, a) {
          if (n = ue(n), n < 1 || n > we)
            return [];
          var h = Ce, m = it(n, Ce);
          a = re(a), n -= Ce;
          for (var _ = Ea(m, a); ++h < n; )
            a(h);
          return _;
        }
        function Sw(n) {
          return le(n) ? Re(n, xr) : Ot(n) ? [n] : wt(xh(Se(n)));
        }
        function Mw(n) {
          var a = ++Bm;
          return Se(n) + a;
        }
        var Aw = po(function(n, a) {
          return n + a;
        }, 0), Pw = el("ceil"), Ew = po(function(n, a) {
          return n / a;
        }, 1), Cw = el("floor");
        function Lw(n) {
          return n && n.length ? oo(n, Tt, za) : t;
        }
        function Ow(n, a) {
          return n && n.length ? oo(n, re(a, 2), za) : t;
        }
        function Dw(n) {
          return au(n, Tt);
        }
        function Iw(n, a) {
          return au(n, re(a, 2));
        }
        function Fw(n) {
          return n && n.length ? oo(n, Tt, Wa) : t;
        }
        function Rw(n, a) {
          return n && n.length ? oo(n, re(a, 2), Wa) : t;
        }
        var Bw = po(function(n, a) {
          return n * a;
        }, 1), Uw = el("round"), kw = po(function(n, a) {
          return n - a;
        }, 0);
        function zw(n) {
          return n && n.length ? Pa(n, Tt) : 0;
        }
        function Nw(n, a) {
          return n && n.length ? Pa(n, re(a, 2)) : 0;
        }
        return v.after = ly, v.ary = Dh, v.assign = Zy, v.assignIn = $h, v.assignInWith = Po, v.assignWith = Ky, v.at = qy, v.before = Ih, v.bind = fl, v.bindAll = rw, v.bindKey = Fh, v.castArray = wy, v.chain = Ch, v.chunk = C_, v.compact = L_, v.concat = O_, v.cond = iw, v.conforms = nw, v.constant = vl, v.countBy = z0, v.create = Qy, v.curry = Rh, v.curryRight = Bh, v.debounce = Uh, v.defaults = Jy, v.defaultsDeep = ev, v.defer = cy, v.delay = uy, v.difference = D_, v.differenceBy = I_, v.differenceWith = F_, v.drop = R_, v.dropRight = B_, v.dropRightWhile = U_, v.dropWhile = k_, v.fill = z_, v.filter = H0, v.flatMap = G0, v.flatMapDeep = j0, v.flatMapDepth = $0, v.flatten = Mh, v.flattenDeep = N_, v.flattenDepth = H_, v.flip = hy, v.flow = ow, v.flowRight = aw, v.fromPairs = V_, v.functions = av, v.functionsIn = lv, v.groupBy = X0, v.initial = G_, v.intersection = j_, v.intersectionBy = $_, v.intersectionWith = X_, v.invert = uv, v.invertBy = hv, v.invokeMap = Z0, v.iteratee = wl, v.keyBy = K0, v.keys = Ye, v.keysIn = bt, v.map = xo, v.mapKeys = dv, v.mapValues = pv, v.matches = lw, v.matchesProperty = cw, v.memoize = To, v.merge = mv, v.mergeWith = Xh, v.method = uw, v.methodOf = hw, v.mixin = xl, v.negate = So, v.nthArg = dw, v.omit = gv, v.omitBy = _v, v.once = fy, v.orderBy = q0, v.over = pw, v.overArgs = dy, v.overEvery = mw, v.overSome = gw, v.partial = dl, v.partialRight = kh, v.partition = Q0, v.pick = yv, v.pickBy = Yh, v.property = tf, v.propertyOf = _w, v.pull = q_, v.pullAll = Ph, v.pullAllBy = Q_, v.pullAllWith = J_, v.pullAt = e0, v.range = yw, v.rangeRight = vw, v.rearg = py, v.reject = ty, v.remove = t0, v.rest = my, v.reverse = ul, v.sampleSize = iy, v.set = wv, v.setWith = xv, v.shuffle = ny, v.slice = r0, v.sortBy = ay, v.sortedUniq = c0, v.sortedUniqBy = u0, v.split = Gv, v.spread = gy, v.tail = h0, v.take = f0, v.takeRight = d0, v.takeRightWhile = p0, v.takeWhile = m0, v.tap = L0, v.throttle = _y, v.thru = wo, v.toArray = Wh, v.toPairs = Zh, v.toPairsIn = Kh, v.toPath = Sw, v.toPlainObject = jh, v.transform = bv, v.unary = yy, v.union = g0, v.unionBy = _0, v.unionWith = y0, v.uniq = v0, v.uniqBy = w0, v.uniqWith = x0, v.unset = Tv, v.unzip = hl, v.unzipWith = Eh, v.update = Sv, v.updateWith = Mv, v.values = bn, v.valuesIn = Av, v.without = b0, v.words = Jh, v.wrap = vy, v.xor = T0, v.xorBy = S0, v.xorWith = M0, v.zip = A0, v.zipObject = P0, v.zipObjectDeep = E0, v.zipWith = C0, v.entries = Zh, v.entriesIn = Kh, v.extend = $h, v.extendWith = Po, xl(v, v), v.add = Aw, v.attempt = ef, v.camelCase = Lv, v.capitalize = qh, v.ceil = Pw, v.clamp = Pv, v.clone = xy, v.cloneDeep = Ty, v.cloneDeepWith = Sy, v.cloneWith = by, v.conformsTo = My, v.deburr = Qh, v.defaultTo = sw, v.divide = Ew, v.endsWith = Ov, v.eq = lr, v.escape = Dv, v.escapeRegExp = Iv, v.every = N0, v.find = V0, v.findIndex = Th, v.findKey = tv, v.findLast = W0, v.findLastIndex = Sh, v.findLastKey = rv, v.floor = Cw, v.forEach = Lh, v.forEachRight = Oh, v.forIn = iv, v.forInRight = nv, v.forOwn = sv, v.forOwnRight = ov, v.get = gl, v.gt = Ay, v.gte = Py, v.has = cv, v.hasIn = _l, v.head = Ah, v.identity = Tt, v.includes = Y0, v.indexOf = W_, v.inRange = Ev, v.invoke = fv, v.isArguments = zi, v.isArray = le, v.isArrayBuffer = Ey, v.isArrayLike = xt, v.isArrayLikeObject = Ne, v.isBoolean = Cy, v.isBuffer = ni, v.isDate = Ly, v.isElement = Oy, v.isEmpty = Dy, v.isEqual = Iy, v.isEqualWith = Fy, v.isError = pl, v.isFinite = Ry, v.isFunction = zr, v.isInteger = zh, v.isLength = Mo, v.isMap = Nh, v.isMatch = By, v.isMatchWith = Uy, v.isNaN = ky, v.isNative = zy, v.isNil = Hy, v.isNull = Ny, v.isNumber = Hh, v.isObject = ke, v.isObjectLike = ze, v.isPlainObject = ns, v.isRegExp = ml, v.isSafeInteger = Vy, v.isSet = Vh, v.isString = Ao, v.isSymbol = Ot, v.isTypedArray = xn, v.isUndefined = Wy, v.isWeakMap = Gy, v.isWeakSet = jy, v.join = Y_, v.kebabCase = Fv, v.last = jt, v.lastIndexOf = Z_, v.lowerCase = Rv, v.lowerFirst = Bv, v.lt = $y, v.lte = Xy, v.max = Lw, v.maxBy = Ow, v.mean = Dw, v.meanBy = Iw, v.min = Fw, v.minBy = Rw, v.stubArray = Tl, v.stubFalse = Sl, v.stubObject = ww, v.stubString = xw, v.stubTrue = bw, v.multiply = Bw, v.nth = K_, v.noConflict = fw, v.noop = bl, v.now = bo, v.pad = Uv, v.padEnd = kv, v.padStart = zv, v.parseInt = Nv, v.random = Cv, v.reduce = J0, v.reduceRight = ey, v.repeat = Hv, v.replace = Vv, v.result = vv, v.round = Uw, v.runInContext = C, v.sample = ry, v.size = sy, v.snakeCase = Wv, v.some = oy, v.sortedIndex = i0, v.sortedIndexBy = n0, v.sortedIndexOf = s0, v.sortedLastIndex = o0, v.sortedLastIndexBy = a0, v.sortedLastIndexOf = l0, v.startCase = jv, v.startsWith = $v, v.subtract = kw, v.sum = zw, v.sumBy = Nw, v.template = Xv, v.times = Tw, v.toFinite = Nr, v.toInteger = ue, v.toLength = Gh, v.toLower = Yv, v.toNumber = $t, v.toSafeInteger = Yy, v.toString = Se, v.toUpper = Zv, v.trim = Kv, v.trimEnd = qv, v.trimStart = Qv, v.truncate = Jv, v.unescape = ew, v.uniqueId = Mw, v.upperCase = tw, v.upperFirst = yl, v.each = Lh, v.eachRight = Oh, v.first = Ah, xl(v, (function() {
          var n = {};
          return vr(v, function(a, h) {
            Me.call(v.prototype, h) || (n[h] = a);
          }), n;
        })(), { chain: !1 }), v.VERSION = r, Nt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n) {
          v[n].placeholder = v;
        }), Nt(["drop", "take"], function(n, a) {
          _e.prototype[n] = function(h) {
            h = h === t ? 1 : Xe(ue(h), 0);
            var m = this.__filtered__ && !a ? new _e(this) : this.clone();
            return m.__filtered__ ? m.__takeCount__ = it(h, m.__takeCount__) : m.__views__.push({
              size: it(h, Ce),
              type: n + (m.__dir__ < 0 ? "Right" : "")
            }), m;
          }, _e.prototype[n + "Right"] = function(h) {
            return this.reverse()[n](h).reverse();
          };
        }), Nt(["filter", "map", "takeWhile"], function(n, a) {
          var h = a + 1, m = h == Y || h == Q;
          _e.prototype[n] = function(_) {
            var w = this.clone();
            return w.__iteratees__.push({
              iteratee: re(_, 3),
              type: h
            }), w.__filtered__ = w.__filtered__ || m, w;
          };
        }), Nt(["head", "last"], function(n, a) {
          var h = "take" + (a ? "Right" : "");
          _e.prototype[n] = function() {
            return this[h](1).value()[0];
          };
        }), Nt(["initial", "tail"], function(n, a) {
          var h = "drop" + (a ? "" : "Right");
          _e.prototype[n] = function() {
            return this.__filtered__ ? new _e(this) : this[h](1);
          };
        }), _e.prototype.compact = function() {
          return this.filter(Tt);
        }, _e.prototype.find = function(n) {
          return this.filter(n).head();
        }, _e.prototype.findLast = function(n) {
          return this.reverse().find(n);
        }, _e.prototype.invokeMap = fe(function(n, a) {
          return typeof n == "function" ? new _e(this) : this.map(function(h) {
            return Qn(h, n, a);
          });
        }), _e.prototype.reject = function(n) {
          return this.filter(So(re(n)));
        }, _e.prototype.slice = function(n, a) {
          n = ue(n);
          var h = this;
          return h.__filtered__ && (n > 0 || a < 0) ? new _e(h) : (n < 0 ? h = h.takeRight(-n) : n && (h = h.drop(n)), a !== t && (a = ue(a), h = a < 0 ? h.dropRight(-a) : h.take(a - n)), h);
        }, _e.prototype.takeRightWhile = function(n) {
          return this.reverse().takeWhile(n).reverse();
        }, _e.prototype.toArray = function() {
          return this.take(Ce);
        }, vr(_e.prototype, function(n, a) {
          var h = /^(?:filter|find|map|reject)|While$/.test(a), m = /^(?:head|last)$/.test(a), _ = v[m ? "take" + (a == "last" ? "Right" : "") : a], w = m || /^find/.test(a);
          _ && (v.prototype[a] = function() {
            var S = this.__wrapped__, P = m ? [1] : arguments, L = S instanceof _e, N = P[0], H = L || le(S), W = function(de) {
              var ye = _.apply(v, qr([de], P));
              return m && Z ? ye[0] : ye;
            };
            H && h && typeof N == "function" && N.length != 1 && (L = H = !1);
            var Z = this.__chain__, J = !!this.__actions__.length, ie = w && !Z, he = L && !J;
            if (!w && H) {
              S = he ? S : new _e(this);
              var ne = n.apply(S, P);
              return ne.__actions__.push({ func: wo, args: [W], thisArg: t }), new Vt(ne, Z);
            }
            return ie && he ? n.apply(this, P) : (ne = this.thru(W), ie ? m ? ne.value()[0] : ne.value() : ne);
          });
        }), Nt(["pop", "push", "shift", "sort", "splice", "unshift"], function(n) {
          var a = js[n], h = /^(?:push|sort|unshift)$/.test(n) ? "tap" : "thru", m = /^(?:pop|shift)$/.test(n);
          v.prototype[n] = function() {
            var _ = arguments;
            if (m && !this.__chain__) {
              var w = this.value();
              return a.apply(le(w) ? w : [], _);
            }
            return this[h](function(S) {
              return a.apply(le(S) ? S : [], _);
            });
          };
        }), vr(_e.prototype, function(n, a) {
          var h = v[a];
          if (h) {
            var m = h.name + "";
            Me.call(gn, m) || (gn[m] = []), gn[m].push({ name: a, func: h });
          }
        }), gn[fo(t, E).name] = [{
          name: "wrapper",
          func: t
        }], _e.prototype.clone = eg, _e.prototype.reverse = tg, _e.prototype.value = rg, v.prototype.at = O0, v.prototype.chain = D0, v.prototype.commit = I0, v.prototype.next = F0, v.prototype.plant = B0, v.prototype.reverse = U0, v.prototype.toJSON = v.prototype.valueOf = v.prototype.value = k0, v.prototype.first = v.prototype.head, jn && (v.prototype[jn] = R0), v;
      }), dn = Im();
      Oi ? ((Oi.exports = dn)._ = dn, wa._ = dn) : Ze._ = dn;
    }).call(TS);
  })(ws, ws.exports)), ws.exports;
}
var MS = SS(), AS = Object.defineProperty, PS = (s, e, t) => e in s ? AS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ES = (s, e, t) => PS(s, e + "", t);
let fr = class extends gt {
  /**
   * Create a Point feature instance.
   * 创建点要素实例
   * 
   * @param options Point feature configuration
   *                点要素配置
   */
  constructor(e) {
    super(e), ES(this, "_baseType", "Point"), this._renderObject = this._createRenderObject(), this._style && this._style.applyTo(this._renderObject);
  }
  /**
   * Coordinate transformation method.
   * 坐标转换方法
   * 
   * @returns Transformed world coordinates
   *          转换后的世界坐标
   * 
   * @description
   * Converts geographic coordinates to world coordinates.
   * 
   * 将地理坐标转换为世界坐标
   */
  _coordsTransform() {
    const e = this.getMap(), t = new I(
      this._geometry.coordinates[0],
      this._geometry.coordinates[1],
      this._geometry.coordinates[2] || 0
      // Default height 500
    );
    return e ? e.projectToWorld(t) : t;
  }
  /**
   * Convert feature to Three.js geometry (abstract method).
   * 将要素转换为Three.js几何体（抽象方法）
   * 
   * @abstract
   */
  async _buildRenderObject() {
    this.map;
  }
  _refreshCoordinates() {
    const e = this._coordsTransform();
    if (this._worldCoordinates = e, this._renderObject) {
      const t = this.getMap();
      t?.prjcenter ? this._renderObject.position.copy(e).sub(t.prjcenter) : this._renderObject.position.copy(e), this.children.includes(this._renderObject) || this.add(this._renderObject), this.updateMatrixWorld(!0);
    } else
      this._buildRenderObject();
  }
  /**
   * Create basic point geometry.
   * 创建基础点几何体
   * 
   * @returns Points instance
   *          Points实例
   * 
   * @protected
   * @description
   * Creates point geometry with default material. Subclasses can extend or override this method.
   * 
   * 创建带有默认材质的点几何体，子类可扩展或重写此方法
   */
  _createRenderObject() {
    return new kn(
      new qt(),
      new ia({ size: 1, color: 8947848 })
    );
  }
};
var CS = Object.defineProperty, LS = (s, e, t) => e in s ? CS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, OS = (s, e, t) => LS(s, e + "", t);
const DS = {
  // 默认配置项
};
class xi extends fr {
  /**
   * Create a marker feature instance.
   * 创建标记点要素实例
   * 
   * @param options - Marker configuration options. 标记点配置选项
   */
  constructor(e) {
    super(e), OS(this, "_type", "Marker");
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @description
   * Creates marker geometry based on style configuration and performs coordinate transformation.
   * 根据样式配置创建标记点几何体，并进行坐标转换
   * 
   * @returns Promise<void>
   */
  async _buildRenderObject() {
    this._worldCoordinates = this._coordsTransform(), this._style && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._style), this._refreshCoordinates());
  }
  /**
   * Quickly update geometry vertex positions (without rebuilding the entire geometry).
   * 快速更新几何体顶点位置（不重建整个几何体）
   * 
   * @description
   * Used for real-time interactions like dragging and editing. Updates only Marker position without destroying and rebuilding geometry.
   * This is much faster than full rebuild and keeps the feature visible during dragging.
   * 
   * 用于拖拽、编辑等实时交互场景，仅更新Marker的位置而不销毁重建几何体。
   * 这比完整重建快得多，并且能保持feature在拖拽过程中可见。
   */
  _refreshCoordinates() {
    this._worldCoordinates = this._coordsTransform(), this._renderObject ? (this._renderObject.position.copy(this._worldCoordinates), this.children.includes(this._renderObject) || this.add(this._renderObject), this.updateMatrixWorld(!0), this._renderObject.updateMatrixWorld(!0)) : this._buildRenderObject();
  }
  /**
   * Create marker object.
   * 创建标记点对象
   * 
   * @description
   * Supports the following style types:
   * 支持以下样式类型：
   * - 'basic-point': 基础点样式
   * - 'icon-point': 图标点样式
   * - 'icon-label-point': 带标签的图标点样式
   * 
   * @param style - 样式配置
   * @returns 创建的标记点对象
   * @throws 如果样式类型不支持会抛出错误
   */
  async _createObject(e) {
    switch (e.config.type) {
      case "basic-point":
        return $d(e.config, new I(0, 0, 0));
      case "icon-point":
        return aT(e.config, this._worldCoordinates);
      case "icon-label-point":
        return gT(e.config, this._worldCoordinates);
      default:
        throw new Error(`不支持的样式类型: ${e.config.type}`);
    }
  }
  /**
   * Calculate collision bounding box (different strategies based on type)
   * 计算碰撞检测用的屏幕空间包围盒（根据不同类型使用不同的计算策略）
   * 
   * @description
   * Override parent method, use different calculation strategies based on marker type (Sprite, Mesh, etc.)
   * Provides more precise bounding box calculation.
   * 
   * 重写父类方法，根据标记点的具体类型（Sprite、Mesh等）使用不同的计算策略
   * 提供更精确的包围盒计算
   * 
   * @param camera - Current camera 当前相机
   * @param renderer - Renderer instance 渲染器实例
   * @returns Bounding box info or null (if calculation failed) 包围盒信息或null（如果计算失败）
   */
  _calculateCollisionBoundingBox(e, t) {
    if (!this.visible || !this._renderObject || !e || !t)
      return null;
    try {
      return this._style?.config.type === "icon-point" ? this._calculateSpriteBoundingBox(
        this._renderObject
      ) : this._getFallbackBoundingBox();
    } catch (r) {
      return console.warn(`Marker ${this._id} bounding box calculation failed:`, r), console.warn(`Marker ${this._id} 包围盒计算失败:`, r), this._getFallbackBoundingBox();
    }
  }
  /**
   * Calculate Sprite screen space bounding box - based on actual display
   * 计算Sprite的屏幕空间包围盒 - 基于实际显示
   * 
   * @description
   * Precise bounding box calculation for Sprite type markers,
   * estimating actual screen size based on Sprite scale.
   * 
   * 针对Sprite类型的标记点进行精确的包围盒计算，
   * 基于Sprite的缩放比例估算实际屏幕尺寸
   * 
   * @param sprite - Sprite object Sprite对象
   * @returns Bounding box info or null (if calculation failed) 包围盒信息或null（如果计算失败）
   * @private
   */
  _calculateSpriteBoundingBox(e) {
    try {
      const r = Math.max(Math.abs(e.scale.x), Math.abs(e.scale.y)) / 2e-3;
      return {
        width: r,
        height: r,
        offsetX: -r / 2,
        offsetY: -r / 2
      };
    } catch {
      return {
        width: 20,
        height: 20,
        offsetX: -10,
        offsetY: -10
      };
    }
  }
  /**
   * Get fallback simple bounding box
   * 获取备用的简单包围盒
   * 
   * @description
   * Returns different default sizes based on style type when precise calculation fails.
   * 
   * 当精确计算失败时，根据样式类型返回不同的默认尺寸
   * 
   * @returns Default bounding box info 默认包围盒信息
   */
  _getFallbackBoundingBox() {
    switch (this.getStyle()?.config.type) {
      case "icon-point":
      case "icon-label-point":
        return { width: 20, height: 20, offsetX: -10, offsetY: -10 };
      case "basic-point":
        return { width: 10, height: 10, offsetX: -5, offsetY: -5 };
      default:
        return { width: 15, height: 15, offsetX: -7.5, offsetY: -7.5 };
    }
  }
}
xi.mergeOptions(DS);
var IS = Object.defineProperty, FS = (s, e, t) => e in s ? IS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Hf = (s, e, t) => FS(s, typeof e != "symbol" ? e + "" : e, t);
class ip extends gt {
  /**
   * Create a Line feature instance.
   * 创建线要素实例
   * 
   * @param options Line feature configuration
   *                线要素配置
   */
  constructor(e) {
    super(e), Hf(this, "_baseType", "Line"), Hf(this, "_vertexPoints"), this._renderObject = this._createRenderObject(), this._vertexPoints = [0, 0, 0], this._style && this._style.applyTo(this._renderObject);
  }
  /**
   * Coordinate transformation method.
   * 坐标转换方法
   * 
   * @returns Transformed coordinate information
   *          转换后的坐标信息
   * 
   * @description
   * Converts geographic coordinates to world coordinates and calculates coordinates relative to map center.
   * 
   * 将地理坐标转换为世界坐标，并计算相对于地图中心的坐标
   */
  _coordsTransform() {
    const e = this.getMap(), t = this._geometry, r = e?.prjcenter;
    if (this._geometry.type === "LineString") {
      let o = t.coordinates.map((c) => {
        const u = new I(c[0], c[1], c[2] || 0);
        return (e ? e.projectToWorld(u) : u).sub(r);
      }), l = o.flatMap((c) => [c.x, c.y, c.z]);
      return {
        _worldCoordinates: o,
        _vertexPoints: l
      };
    }
  }
  /**
   * Convert to Three.js geometry (abstract method).
   * 转换为Three.js几何体（抽象方法）
   * 
   * @abstract
   */
  _buildRenderObject() {
  }
  /**
   * Create basic line geometry.
   * 创建基础线几何体
   * 
   * @returns Line2 instance
   *          Line2实例
   * 
   * @protected
   * @description
   * Creates line geometry with default material. Subclasses can extend or override this method.
   * 
   * 创建带有默认材质的线几何体，子类可扩展或重写此方法
   */
  _createRenderObject() {
    const e = new oa(), t = new Bs({
      color: 8947848,
      linewidth: 0.1,
      dashed: !1,
      resolution: new ce(window.innerWidth, window.innerHeight)
    });
    return new aa(e, t);
  }
}
var RS = Object.defineProperty, BS = (s, e, t) => e in s ? RS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, US = (s, e, t) => BS(s, e + "", t);
const kS = {
  // type: 'circle', // Defaults to Point geometry
};
class Bt extends ip {
  /**
   * Create a LineString feature instance.
   * 创建线要素实例
   * 
   * @param options Configuration options for the line feature
   *                线要素配置
   */
  constructor(e) {
    super(e), US(this, "_type", "LineString");
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   * 
   * @description
   * Creates line geometry based on style configuration and performs coordinate transformation.
   * 
   * 根据样式配置创建线几何体，并进行坐标转换
   */
  async _buildRenderObject() {
    let { _vertexPoints: e } = this._coordsTransform();
    this._vertexPoints = e, this._style && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._style), this._refreshCoordinates());
  }
  /**
   * Quickly update geometry vertex positions (without rebuilding the entire geometry).
   * 快速更新几何体顶点位置（不重建整个几何体）
   * 
   * @description
   * Used for real-time interactions like dragging and editing. Updates only Line2 vertex positions without destroying and rebuilding geometry.
   * This is much faster than full rebuild and keeps the feature visible during dragging.
   * 
   * 用于拖拽、编辑等实时交互场景，仅更新Line2的顶点位置而不销毁重建几何体。
   * 这比完整重建快得多，并且能保持feature在拖拽过程中可见。
   */
  _refreshCoordinates() {
    let { _vertexPoints: e } = this._coordsTransform();
    if (this._vertexPoints = e, this._renderObject && (this._renderObject.isLine2 || this._renderObject instanceof aa)) {
      const i = this._renderObject.geometry;
      i.setPositions(this._vertexPoints), i.computeBoundingSphere(), i.computeBoundingBox();
      const o = this.getMap();
      o?.prjcenter && this._renderObject.position.set(
        o.prjcenter.x,
        o.prjcenter.y,
        o.prjcenter.z
      ), this.children.includes(this._renderObject) || this.add(this._renderObject), this.updateMatrixWorld(!0), this._renderObject.updateMatrixWorld(!0);
    } else
      console.warn("[LineString] _updateGeometryPositions: Geometry type mismatch, fallback to full rebuild", {
        hasGeometry: !!this._renderObject,
        geometryType: this._renderObject?.constructor?.name,
        isLine2: this._renderObject?.isLine2
      }), this._buildRenderObject();
  }
  /**
   * Create line object.
   * 创建线对象
   * 
   * @param style - Style configuration 样式配置
   * @returns Created line object 创建的线对象
   * @throws Throws error if style type is not supported 如果样式类型不支持会抛出错误
   * 
   * @description
   * Currently supported style types:
   * - 'basic-line': Basic line style
   * 
   * 当前支持样式类型：
   * - 'basic-line': 基础线样式
   */
  async _createObject(e) {
    switch (e.config.type) {
      case "basic-line":
        return Tc(e.config, this._vertexPoints);
      case "flow-tube-line":
        return Xd(e.config, this._vertexPoints);
      case "arrow-line":
        return Yd(e.config, this._vertexPoints);
      case "flow-texture-line":
        return await Zd(e.config, this._vertexPoints);
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
}
Bt.mergeOptions(kS);
var zS = Object.defineProperty, NS = (s, e, t) => e in s ? zS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Vf = (s, e, t) => NS(s, typeof e != "symbol" ? e + "" : e, t);
class HS extends gt {
  /**
   * Create a Surface feature instance.
   * 创建表面要素实例
   * 
   * @param options Surface configuration
   *                表面配置
   */
  constructor(e) {
    super(e), Vf(this, "_baseType", "Surface"), Vf(this, "_vertexPoints"), this._buildRenderObject(), this._vertexPoints = [0, 0, 0], this._style && this._renderObject && this._style.applyTo(this._renderObject);
  }
  _buildRenderObject() {
    if (this._renderObject || !this._geometry) return;
    const { _vertexPoints: t } = this._coordsTransform();
    this._vertexPoints = t, this._renderObject = this._createRenderObject();
  }
  /**
   * Coordinate transformation method.
   * 坐标转换方法
   * 
   * @returns Transformed coordinate information
   *          转换后的坐标信息
   * 
   * @description
   * Handles coordinate transformation for Polygon and MultiPolygon, returning:
   * - _worldCoordinates: Array of transformed coordinates
   * - _vertexPoints: Array of flattened vertex coordinates
   * 
   * 处理多边形和多面体的坐标转换，返回：
   * - _worldCoordinates: 转换后的坐标数组
   * - _vertexPoints: 展平的顶点坐标数组
   * 
   * @throws Throws error if geometry type is not supported
   *         如果几何类型不支持会抛出错误
   */
  _coordsTransform() {
    const e = this.getMap(), t = e?.prjcenter, r = this._geometry;
    if (!r) throw new Error("Geometry data undefined");
    if (r.type === "Polygon") {
      const i = r.coordinates;
      let o = [], l = [];
      return i.forEach((c) => {
        const u = c.map((f) => {
          const p = new I(f[0], f[1], f[2] || 0);
          return (e ? e.projectToWorld(p) : p).sub(t);
        });
        o.push(u), l.push(...u.flatMap((f) => [f.x, f.y, f.z]));
      }), { _worldCoordinates: o, _vertexPoints: l };
    } else if (r.type === "MultiPolygon") {
      const i = r.coordinates;
      let o = [], l = [];
      return i.forEach((c) => {
        const u = [];
        c.forEach((f) => {
          const p = f.map((d) => {
            const g = new I(d[0], d[1], d[2] || 0);
            return (e ? e.projectToWorld(g) : g).sub(t);
          });
          u.push(p), l.push(...p.flatMap((d) => [d.x, d.y, d.z]));
        }), o.push(u);
      }), { _worldCoordinates: o, _vertexPoints: l };
    } else
      throw new Error(`Unsupported geometry type: ${r.type}`);
  }
  /**
   * Update geometry.
   * 更新几何体
   * 
   * @description
   * Updates geometry based on current style type:
   * - 'basic-polygon': Basic polygon
   * - 'extrude-polygon': Extruded polygon
   * - 'water': Water surface effect
   * 
   * 根据当前样式类型更新几何体：
   * - 'basic-polygon': 基础多边形
   * - 'extrude-polygon': 挤出多边形
   * - 'water': 水面效果
   */
  _refreshCoordinates() {
    const e = this._style?.config.type;
    if (this.clear(), !this._renderObject || !this._vertexPoints?.length) {
      console.warn("Cannot update geometry: missing geometry or vertex data");
      return;
    }
    const t = this.getMap();
    try {
      e === "basic-polygon" ? (this._renderObject.renderOrder = 90, this._renderObject.position.add(t?.prjcenter), this._renderObject.updateMatrix(), this.add(this._renderObject)) : (e === "extrude-polygon" || e?.includes("water")) && (this._renderObject.renderOrder = 90, this._renderObject.position.add(t?.prjcenter), this._renderObject.updateMatrix(), this.add(this._renderObject));
    } catch (r) {
      throw console.error("Failed to update polygon position:", r), r;
    }
  }
  /**
   * Create basic geometry.
   * 创建基础几何体
   * 
   * @returns Line2 instance
   *          Line2实例
   * 
   * @protected
   * @description
   * Creates line geometry with default material. Subclasses can extend or override this method.
   * 
   * 创建带有默认材质的线几何体，子类可扩展或重写此方法
   */
  _createRenderObject() {
    const e = new oa(), t = new Bs({
      color: 8947848,
      linewidth: 0.1,
      dashed: !1,
      resolution: new ce(window.innerWidth, window.innerHeight)
    });
    return new aa(e, t);
  }
}
var VS = Object.defineProperty, WS = (s, e, t) => e in s ? VS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, GS = (s, e, t) => WS(s, e + "", t);
const jS = {
  // Default config items
};
class Wr extends HS {
  /**
   * Create a Polygon feature instance.
   * 创建多边形要素实例
   * 
   * @param options Polygon configuration
   *                多边形配置
   */
  constructor(e) {
    super(e), GS(this, "_type", "Polygon");
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   * 
   * @description
   * Creates polygon geometry based on style configuration and performs coordinate transformation.
   * 
   * 根据样式配置创建多边形几何体，并进行坐标转换
   */
  async _buildRenderObject() {
    let { _vertexPoints: e } = this._coordsTransform();
    this._vertexPoints = e, this._style && (this._renderObject && this.remove(this._renderObject), this._renderObject = await this._createObject(this._style), this._refreshCoordinates(), await this._style.applyTo(this._renderObject));
  }
  /**
   * Quickly update geometry vertex positions (without rebuilding the entire geometry).
   * 快速更新几何体顶点位置（不重建整个几何体）
   * 
   * @description
   * Used for real-time interactions like dragging and editing.
   * For basic-polygon type, implements quick update to avoid rebuild;
   * For complex types (extrude/water), still calls full rebuild.
   * 
   * 用于拖拽、编辑等实时交互场景。
   * 对于basic-polygon类型，实现快速更新避免重建；
   * 对于复杂类型（extrude/water），仍然调用完整重建。
   */
  _refreshCoordinates() {
    const e = this._style?.config.type;
    console.warn("[Polygon] _refreshCoordinates: Fallback to full rebuild", {
      styleType: e,
      hasGeometry: !!this._renderObject
    }), this._buildRenderObject();
  }
  /**
   * Create polygon object.
   * 创建多边形对象
   * 
   * @param style Style configuration
   *              样式配置
   * @returns Created polygon object
   *          创建的多边形对象
   * @throws Throws error if style type is not supported
   *         如果样式类型不支持会抛出错误
   * 
   * @description
   * Supported style types:
   * - 'basic-polygon': Basic polygon
   * - 'extrude-polygon': Extruded polygon
   * - 'water': Water surface effect
   * - 'base-water': Basic water surface effect
   * 
   * 支持以下样式类型：
   * - 'basic-polygon': 基础多边形
   * - 'extrude-polygon': 挤出多边形
   * - 'water': 水面效果
   * - 'base-water': 基础水面效果
   */
  async _createObject(e) {
    switch (e.config.type) {
      case "basic-polygon":
        return cT(e.config, this._vertexPoints);
      case "extrude-polygon":
        return uT(e.config, this._vertexPoints);
      case "water":
        return hT(e.config, this.getMap(), this._vertexPoints);
      case "base-water":
        return fT(e.config, this._vertexPoints);
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
  /**
   * Calculate collision bounding box.
   * 计算碰撞检测包围盒
   * 
   * @returns Collision bounding box
   *          碰撞检测包围盒
   */
  _calculateCollisionBoundingBox() {
    return null;
  }
}
Wr.mergeOptions(jS);
var $S = Object.defineProperty, XS = (s, e, t) => e in s ? $S(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Wl = (s, e, t) => XS(s, typeof e != "symbol" ? e + "" : e, t);
const YS = {
  // Default configuration items
  // 默认配置项
};
class ZS extends ip {
  /**
   * Create a MultiLineString feature instance.
   * 创建多线要素实例
   * 
   * @param options Multi-line configuration options
   *                多线配置选项
   */
  constructor(e) {
    super(e), Wl(this, "_type", "MultiLineString"), Wl(this, "_lineObjects", []), Wl(this, "_linesContainer"), this._linesContainer = new Qt();
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   * 
   * @description
   * Create separate geometry for each line segment and add to container.
   * 为每条线段创建单独的几何体，并添加到容器中
   */
  async _buildRenderObject() {
    const { _worldCoordinates: e } = this._coordsTransform(), t = this.getMap();
    if (this.clearLines(), this._disposeGeometry(), this._style) {
      for (const r of e) {
        const i = r.flatMap((l) => [l.x, l.y, l.z]), o = await this._createLineObject(this._style, i);
        o.position.add(t?.prjcenter), o.updateMatrixWorld(!0), o.renderOrder = 99, this._lineObjects.push(o), this._linesContainer.add(o);
      }
      this._linesContainer.renderOrder = 99, this._renderObject = this._linesContainer, this.add(this._renderObject), this._updateContainer(), this.updateMatrixWorld(!0), this._renderObject.updateMatrixWorld(!0), this._tryProcessQueue();
    }
  }
  /**
   * Create a single line object.
   * 创建单条线对象
   * 
   * @param style Style configuration
   *              样式配置
   * @param vertexPoints Vertex coordinates array
   *                     顶点坐标数组
   * @returns Created line object
   *          创建的线对象
   * @throws Throws error if style type is not supported
   *         如果样式类型不支持会抛出错误
   * 
   * @private
   */
  async _createLineObject(e, t) {
    switch (e.config.type) {
      case "basic-line":
        return Tc(e.config, t);
      case "flow-tube-line":
        return Xd(e.config, t);
      case "arrow-line":
        return Yd(e.config, t);
      case "flow-texture-line":
        return await Zd(e.config, t);
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
  /**
   * Coordinate transformation method.
   * 坐标转换方法
   * 
   * @returns Transformed coordinate information
   *          转换后的坐标信息
   * 
   * @description
   * Convert geographic coordinates to world coordinates and calculate coordinates relative to map center.
   * 将地理坐标转换为世界坐标，并计算相对于地图中心的坐标
   */
  _coordsTransform() {
    const e = this.getMap(), t = this._geometry;
    if (this._geometry.type === "MultiLineString") {
      const r = e?.prjcenter;
      return { _worldCoordinates: t.coordinates.map((o) => o.map((l) => {
        const c = new I(l[0], l[1], l[2] || 0);
        return (e ? e.projectToWorld(c) : c).sub(r);
      })) };
    }
  }
  /**
   * Update container status.
   * 更新容器状态
   * 
   * @private
   * @description
   * Update matrix and boundary information of the container group.
   * 更新容器组的矩阵和边界信息
   */
  _updateContainer() {
    this._linesContainer.updateMatrixWorld(!0);
  }
  /**
   * Clear all line objects.
   * 清除所有线对象
   * 
   * @private
   * @description
   * Remove and dispose resources of all line objects.
   * 移除并释放所有线对象的资源
   */
  clearLines() {
    this._lineObjects.forEach((e) => {
      this._linesContainer.remove(e), e.geometry && e.geometry.dispose(), e.material && (Array.isArray(e.material) ? e.material.forEach((t) => t.dispose()) : e.material.dispose());
    }), this._lineObjects = [];
  }
  /**
   * Update geometry.
   * 更新几何体
   * 
   * @description
   * For multi-line features, simply recreating all lines is easier.
   * 对于多线要素，直接重新创建所有线更简单
   */
  _refreshCoordinates() {
    this._buildRenderObject();
  }
  /**
   * Dispose object resources.
   * 释放对象资源
   * 
   * @description
   * Clean up resources used by multi-line feature.
   * 清理多线要素使用的资源
   */
  _disposeObject() {
  }
}
ZS.mergeOptions(YS);
var KS = Object.defineProperty, qS = (s, e, t) => e in s ? KS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, cs = (s, e, t) => qS(s, typeof e != "symbol" ? e + "" : e, t);
const Gl = 64;
class QS extends st.MeshStandardMaterial {
  /**
   * 构造函数
   * @param options 材质选项
   */
  constructor(e = {}) {
    const { shaderOption: t, regionOverlay: r, ...i } = e;
    if (super({
      color: "rgb(58,126,182)",
      roughness: 0.7,
      metalness: 0.1,
      transparent: !0,
      opacity: 0.9,
      envMapIntensity: 0.8,
      // 默认：建筑渐变材质不写深度，避免挡住 UI / 纹理点
      depthWrite: !0,
      depthTest: !0,
      ...i
    }), cs(this, "shaderOption"), cs(this, "clock"), cs(this, "time"), cs(this, "startTime"), cs(this, "regionOverlay"), r && r.vertices && r.vertices.length > 0) {
      const o = r.vertices.slice(0, Gl).map((c) => c.clone()), l = o.length;
      for (; o.length < Gl; )
        o.push(new st.Vector2(0, 0));
      this.regionOverlay = {
        color: r.color,
        opacity: r.opacity,
        vertices: o,
        vertexCount: l
      };
    }
    this.shaderOption = {
      minY: 0,
      maxY: 100,
      minRate: 0.3,
      maxRate: 1.5,
      effects: {
        diffusion: {
          enabled: !1,
          color: new st.Color("#9ECDEC"),
          width: 20,
          speed: 1,
          maxDistance: 100,
          center: void 0
        },
        flow: {
          enabled: !1,
          color: new st.Color("#00E4FF"),
          range: 10,
          speed: 20
        },
        sweep: {
          enabled: !1,
          color: new st.Color("#FFFFFF"),
          width: 1.5,
          speed: 10
        }
      },
      ...t
    }, this.clock = new st.Clock(), this.time = { value: 0 }, this.startTime = { value: 0 }, this.animate();
  }
  /**
   * 着色器编译前回调
   * @param shader 着色器对象
   */
  onBeforeCompile(e) {
    const { minY: t, maxY: r, minRate: i, maxRate: o, effects: l } = this.shaderOption, c = r - t, u = !!this.regionOverlay;
    e.uniforms = {
      ...e.uniforms,
      time: this.time,
      uStartTime: this.startTime,
      uMinY: { value: t },
      uMaxY: { value: r },
      uHeightRange: { value: c },
      uMinRate: { value: i },
      uMaxRate: { value: o },
      uDiffusionEnabled: { value: l?.diffusion?.enabled ? 1 : 0 },
      uDiffusionColor: { value: l?.diffusion?.color || new st.Color("#9ECDEC") },
      uDiffusionWidth: { value: l?.diffusion?.width || 20 },
      uDiffusionSpeed: { value: l?.diffusion?.speed || 1 },
      uDiffusionMaxDistance: { value: l?.diffusion?.maxDistance || 100 },
      uDiffusionCenter: { value: l?.diffusion?.center || new st.Vector3(0, 0, 0) },
      uFlowEnabled: { value: l?.flow?.enabled ? 1 : 0 },
      uFlowColor: { value: l?.flow?.color || new st.Color("#00E4FF") },
      uFlowRange: { value: l?.flow?.range || 10 },
      uFlowSpeed: { value: l?.flow?.speed || 20 },
      uSweepEnabled: { value: l?.sweep?.enabled ? 1 : 0 },
      uSweepColor: { value: l?.sweep?.color || new st.Color("#FFFFFF") },
      uSweepWidth: { value: l?.sweep?.width || 1.5 },
      uSweepSpeed: { value: l?.sweep?.speed || 10 },
      // 区域多边形外衣相关
      uRegionOverlayEnabled: { value: u ? 1 : 0 },
      uRegionOverlayColor: { value: this.regionOverlay?.color || new st.Color("#00FF88") },
      uRegionOverlayOpacity: { value: this.regionOverlay?.opacity ?? 0 },
      uRegionOverlayVertexCount: { value: this.regionOverlay?.vertexCount ?? 0 },
      uRegionOverlayVertices: {
        value: this.regionOverlay?.vertices || new Array(Gl).fill(0).map(() => new st.Vector2(0, 0))
      }
    }, e.vertexShader = `
      varying vec3 vWorldPosition;
      varying vec3 vPosition;
      varying float vHeight;
      ${e.vertexShader}
    `.replace(
      "#include <begin_vertex>",
      `
      #include <begin_vertex>
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vPosition = position;
      vHeight = position.y;
      `
    ), e.fragmentShader = `
      #define PI 3.141592653589793
      #define REGION_OVERLAY_MAX_VERTS 64
      varying vec3 vWorldPosition;
      varying vec3 vPosition;
      varying float vHeight;
      uniform float uMinY;
      uniform float uMaxY;
      uniform float uHeightRange;
      uniform float uMinRate;
      uniform float uMaxRate;
      uniform float time;
      uniform float uStartTime;
      uniform int uDiffusionEnabled;
      uniform vec3 uDiffusionColor;
      uniform float uDiffusionWidth;
      uniform float uDiffusionSpeed;
      uniform float uDiffusionMaxDistance;
      uniform vec3 uDiffusionCenter;
      uniform int uFlowEnabled;
      uniform vec3 uFlowColor;
      uniform float uFlowRange;
      uniform float uFlowSpeed;
      uniform int uSweepEnabled;
      uniform vec3 uSweepColor;
      uniform float uSweepWidth;
      uniform float uSweepSpeed;

       // 区域多边形外衣相关 uniform 声明（之前缺少）
      uniform int uRegionOverlayEnabled;
      uniform vec3 uRegionOverlayColor;
      uniform float uRegionOverlayOpacity;
      uniform int uRegionOverlayVertexCount;
      uniform vec2 uRegionOverlayVertices[REGION_OVERLAY_MAX_VERTS];
      
      
      float distanceTo(vec2 src, vec2 dst) {
        return distance(src, dst);
      }
      
      ${e.fragmentShader}
    `.replace(
      "#include <color_fragment>",
      `
      #include <color_fragment>
      
      // 高度渐变计算
      float normalizedHeight = clamp((vWorldPosition.y - uMinY) / uHeightRange, 0.0, 1.0);
      float heightFactor = smoothstep(0.0, 1.0, normalizedHeight);
      diffuseColor.rgb *= mix(uMinRate, uMaxRate, heightFactor);
      
      // 圆环扩散效果
      if (uDiffusionEnabled == 1) {
        vec2 position2D = vec2(vWorldPosition.x, vWorldPosition.z);
        vec2 center2D = vec2(uDiffusionCenter.x, uDiffusionCenter.z);
        float distToCenter = distance(position2D, center2D);
        
        float progress = mod(time * uDiffusionSpeed, 1.0);
        float currentRadius = progress * uDiffusionMaxDistance;
        
        if (distToCenter > currentRadius - uDiffusionWidth && 
            distToCenter < currentRadius) {
            float ringFactor = smoothstep(
                currentRadius - uDiffusionWidth,
                currentRadius,
                distToCenter
            );
            
            vec3 highBrightnessColor = uDiffusionColor * 5.0;
            diffuseColor.rgb += highBrightnessColor * (1.0 - ringFactor);
            diffuseColor.rgb = min(diffuseColor.rgb, vec3(2.0));
        }
      }
      
      // 流光效果
      if (uFlowEnabled == 1) {
        float dTime = mod(time * uFlowSpeed, uFlowRange * 2.0);
        if (vPosition.z > dTime - uFlowRange && vPosition.z < dTime) {
          float dIndex = sin((dTime - vPosition.z) / uFlowRange * PI);
          diffuseColor.rgb = mix(uFlowColor, diffuseColor.rgb, 1.0 - dIndex);
        }
      }
      
      // 扫光效果
      if (uSweepEnabled == 1) {
        float sweepPos = mod(time * uSweepSpeed, 2.0);
        if (vHeight > sweepPos - uSweepWidth && vHeight < sweepPos) {
          float sweepFactor = smoothstep(sweepPos - uSweepWidth, sweepPos, vHeight);
          diffuseColor.rgb = mix(uSweepColor, diffuseColor.rgb, 1.0 - sweepFactor);
        }
      }
    // 区域多边形外衣叠色（Ray casting 判定点是否在多边形内）
      if (uRegionOverlayEnabled == 1 && uRegionOverlayOpacity > 0.0 && uRegionOverlayVertexCount >= 3) {
        vec2 p = vec2(vWorldPosition.x, vWorldPosition.z);
        bool inside = false;
        int j = 0;
        for (int i = 0; i < REGION_OVERLAY_MAX_VERTS; i++) {
          if (i >= uRegionOverlayVertexCount) break;
          if (i == 0) {
            j = uRegionOverlayVertexCount - 1;
          }
          vec2 pi = uRegionOverlayVertices[i];
          vec2 pj = uRegionOverlayVertices[j];

          bool intersect = ((pi.y > p.y) != (pj.y > p.y)) &&
            (p.x < (pj.x - pi.x) * (p.y - pi.y) / (pj.y - pi.y + 1e-6) + pi.x);
          if (intersect) {
            inside = !inside;
          }
          j = i;
        }

        if (inside) {
          diffuseColor.rgb = mix(
            diffuseColor.rgb,
            uRegionOverlayColor,
            clamp(uRegionOverlayOpacity, 0.0, 1.0)
          );
        }
      }
      `
    );
  }
  /**
   * 自动设置圆环扩散参数
   * @param object 目标3D对象
   */
  setDiffusionFromObject(e) {
    if (!this.shaderOption.effects?.diffusion) return;
    const t = new st.Box3().setFromObject(e);
    if (t.isEmpty()) return;
    const r = new st.Vector3();
    t.getCenter(r);
    const i = [
      new st.Vector3(t.min.x, t.min.y, t.min.z),
      new st.Vector3(t.max.x, t.max.y, t.max.z)
    ];
    let o = 0;
    i.forEach((l) => {
      const c = r.distanceTo(l);
      c > o && (o = c);
    }), this.shaderOption.effects.diffusion = {
      ...this.shaderOption.effects.diffusion,
      center: r,
      maxDistance: o
    }, this.needsUpdate = !0;
  }
  /**
   * 更新边界框高度范围
   * @param minY 最小高度
   * @param maxY 最大高度
   */
  updateBoundingBox(e, t) {
    this.shaderOption.minY = e, this.shaderOption.maxY = t, this.needsUpdate = !0;
  }
  /**
   * 更新特效配置
   * @param effects 特效配置
   */
  updateEffects(e) {
    this.shaderOption.effects = {
      ...this.shaderOption.effects,
      ...e
    }, this.needsUpdate = !0;
  }
  /**
   * 动画循环
   */
  animate() {
    requestAnimationFrame(() => this.animate()), this.time.value = this.clock.getElapsedTime(), this.startTime.value < 1 && (this.startTime.value += 0.01);
  }
}
var JS = Object.defineProperty, e2 = (s, e, t) => e in s ? JS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, hr = (s, e, t) => e2(s, typeof e != "symbol" ? e + "" : e, t);
const t2 = {
  emissive: !1,
  emissiveIntensity: 1,
  emissiveColor: "#ffffff"
};
class r2 extends fr {
  /**
   * Create a Model feature instance.
   * 创建模型要素实例
   * 
   * @param options Model configuration options
   *                模型配置选项
   */
  constructor(e) {
    super(e), hr(this, "_type", "Model"), hr(this, "_emissive", !1), hr(this, "_emissiveIntensity", 1), hr(this, "_emissiveColor", "#ffffff"), hr(this, "_mixer", null), hr(this, "_currentAction", null), hr(this, "_animations", []), hr(this, "_clock", new ta()), hr(this, "_autoUpdate", !0), hr(this, "_animationRequestId", null), hr(this, "_iscity", !1), this._emissive = e.emissive || !1, this._emissiveIntensity = e.emissiveIntensity || 1, this._emissiveColor = e.emissiveColor || "#ffffff", this.castShadow = e.castShadow || !1, this.receiveShadow = e.receiveShadow || !1, this._iscity = e.iscity || !1;
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   */
  async _buildRenderObject() {
    if (this._worldCoordinates = this._coordsTransform(), this._style) {
      if (this._renderObject && this._disposeGeometry(), this.modelunino = await this._createObject(this._style), this._renderObject = this.modelunino.model, !this._renderObject) {
        console.error("Model load failed: model returned by _createObject is undefined"), console.error("模型加载失败：_createObject返回的model为undefined");
        return;
      }
      this._renderObject.userData._type = "Model", this.modelunino.animations && this.modelunino.animations.length > 0 && (this._animations = this.modelunino.animations, this._mixer = new w1(this._renderObject), this._startAnimationLoop(), this.playAnimation({
        name: this._animations[0].name,
        loop: !0,
        speed: 1.5,
        fadeInDuration: 0.5,
        fadeOutDuration: 0.3
      })), this._refreshCoordinates(), this.setShadows({
        cast: this.castShadow,
        receive: this.receiveShadow
      }), this._applyEmissionProperties(), this._iscity && this._rendercity();
    }
  }
  /**
   * Create model object.
   * 创建模型对象
   * 
   * @param style Style configuration
   *              样式配置
   * @returns Created model object
   *          创建的模型对象
   * @throws Throws error if style type is not supported
   *         如果样式类型不支持会抛出错误
   */
  async _createObject(e) {
    switch (e.config.type) {
      case "fbx":
      case "gltf":
        return lT(e.config, this._worldCoordinates);
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
  /**
   * Apply emission properties.
   * 应用自发光属性
   * 
   * @private
   */
  _applyEmissionProperties() {
    this._renderObject && this._renderObject.traverse((e) => {
      if ("material" in e) {
        const t = e.material;
        t && (t.emissiveIntensity = this._emissive ? this._emissiveIntensity : 0, t.emissive && t.emissive.setStyle(this._emissiveColor));
      }
    });
  }
  /* Emissive property accessors */
  /* 自发光属性访问器 */
  get emissive() {
    return this._emissive;
  }
  set emissive(e) {
    this._emissive = e, this._applyEmissionProperties();
  }
  get emissiveIntensity() {
    return this._emissiveIntensity;
  }
  set emissiveIntensity(e) {
    this._emissiveIntensity = e, this._applyEmissionProperties();
  }
  get emissiveColor() {
    return this._emissiveColor;
  }
  set emissiveColor(e) {
    this._emissiveColor = e, this._applyEmissionProperties();
  }
  /**
   * Set emissive effect.
   * 设置自发光效果
   * 
   * @param enabled Whether to enable
   *                是否启用
   * @param intensity Intensity (optional)
   *                  强度(可选)
   * @param color Color (optional)
   *              颜色(可选)
   */
  setEmission(e, t, r) {
    this._emissive = e, t !== void 0 && (this._emissiveIntensity = t), r !== void 0 && (this._emissiveColor = r), this._applyEmissionProperties();
  }
  /**
   * Set shadow properties.
   * 设置阴影属性
   * 
   * @param options Shadow configuration
   *                阴影配置
   */
  async setShadows(e) {
    this.castShadow = e.cast, this.receiveShadow = e.receive, this._renderObject && this._renderObject.traverse((t) => {
      t.isMesh && t.material && (t.castShadow = e.cast, t.receiveShadow = e.receive);
    });
  }
  setBloom(e, t) {
    return this.userData.bloom = e, this._renderObject && this._renderObject.traverse((r) => {
      r instanceof Ue && (r.userData.originalMaterial || (r.userData.originalMaterial = r.material), e ? Array.isArray(r.material) ? r.material.forEach((i) => {
        "emissive" in i && (i.emissive.setHex(16777215), i.emissiveIntensity = 0.5);
      }) : "emissive" in r.material && (r.material.emissive.setHex(16777215), r.material.emissiveIntensity = 0.5) : Array.isArray(r.material) ? r.material.forEach((i) => {
        "emissive" in i && (i.emissive.setHex(0), i.emissiveIntensity = 0);
      }) : "emissive" in r.material && (r.material.emissive.setHex(0), r.material.emissiveIntensity = 0));
    }), this;
  }
  /* Animation control methods */
  /* 动画控制方法 */
  /**
   * Play animation.
   * 播放动画
   * 
   * @param params Animation parameters
   *               动画参数
   */
  playAnimation(e) {
    if (!this._mixer || this._animations.length === 0) {
      console.warn("No available animations for model"), console.warn("模型没有可用的动画");
      return;
    }
    this._currentAction && (e.fadeOutDuration && e.fadeOutDuration > 0 ? this._currentAction.fadeOut(e.fadeOutDuration) : this._currentAction.stop());
    const t = typeof e.name == "number" ? this._animations[e.name] : this._animations.find((r) => r.name === e.name);
    if (!t) {
      console.warn(`Animation not found: ${e.name}`), console.warn(`找不到动画: ${e.name}`);
      return;
    }
    this._currentAction = this._mixer.clipAction(t), this._currentAction.setLoop(e.loop ? x1 : b1, e.loop ? 1 / 0 : 1), this._currentAction.timeScale = e.speed || 1, this._currentAction.time = e.startAt || 0, this._currentAction.setEffectiveWeight(e.weight || 1), e.fadeInDuration && e.fadeInDuration > 0 && this._currentAction.fadeIn(e.fadeInDuration), this._currentAction.play(), this._autoUpdate && this._animationRequestId === null && this._startAnimationLoop();
  }
  /**
   * Stop animation.
   * 停止动画
   * 
   * @param params Stop parameters
   *               停止参数
   */
  stopAnimation(e = {}) {
    this._currentAction && (e.fadeDuration && e.fadeDuration > 0 ? (this._currentAction.fadeOut(e.fadeDuration), setTimeout(() => {
      this._currentAction && (this._currentAction.stop(), this._currentAction = null);
    }, e.fadeDuration * 1e3)) : (this._currentAction.stop(), this._currentAction = null));
  }
  /**
   * Set animation paused state.
   * 设置动画暂停状态
   * 
   * @param params Pause parameters
   *               暂停参数
   */
  setAnimationPaused(e) {
    this._currentAction && (this._currentAction.paused = e.paused);
  }
  /**
   * Set animation speed.
   * 设置动画速度
   * 
   * @param params Speed parameters
   *               速度参数
   */
  setAnimationSpeed(e) {
    this._currentAction && (this._currentAction.timeScale = e.speed);
  }
  /**
   * Update animation.
   * 更新动画
   * 
   * @param params Update parameters
   *               更新参数
   */
  updateAnimation(e) {
    this._mixer && this._mixer.update(e.deltaTime);
  }
  /**
   * Get animation name list.
   * 获取动画名称列表
   * 
   * @returns Animation name array
   *          动画名称数组
   */
  getAnimationNames() {
    return this._animations.map((e) => e.name);
  }
  /**
   * Get current animation name.
   * 获取当前动画名称
   * 
   * @returns Current animation name or null
   *          当前动画名称或null
   */
  getCurrentAnimationName() {
    return this._currentAction ? this._currentAction.getClip().name : null;
  }
  /**
   * Get animation duration.
   * 获取动画时长
   * 
   * @param params Animation parameters
   *               动画参数
   * @returns Animation duration (seconds) or null
   *          动画时长(秒)或null
   */
  getAnimationDuration(e) {
    let t;
    return typeof e.name == "number" ? t = this._animations[e.name] : t = this._animations.find((r) => r.name === e.name), t ? t.duration : null;
  }
  /**
   * Dispose resources.
   * 释放资源
   */
  dispose() {
    this._stopAnimationLoop(), this._mixer && (this._mixer.stopAllAction(), this._mixer.uncacheRoot(this._renderObject)), super.dispose();
  }
  /**
   * Start animation loop.
   * 启动动画循环
   * 
   * @private
   */
  _startAnimationLoop() {
    if (!this._autoUpdate || this._animationRequestId !== null) return;
    const e = () => {
      if (this._mixer) {
        const t = this._clock.getDelta();
        this._mixer.update(t);
      }
      this._animationRequestId = requestAnimationFrame(e);
    };
    this._clock.start(), this._animationRequestId = requestAnimationFrame(e);
  }
  /**
   * Stop animation loop.
   * 停止动画循环
   * 
   * @private
   */
  _stopAnimationLoop() {
    this._animationRequestId !== null && (cancelAnimationFrame(this._animationRequestId), this._animationRequestId = null), this._clock.stop();
  }
  /**
   * Set auto update state.
   * 设置自动更新状态
   * 
   * @param enabled Whether to enable auto update
   *                是否启用自动更新
   */
  setAutoUpdate(e) {
    this._autoUpdate = e, e ? this._startAnimationLoop() : this._stopAnimationLoop();
  }
  /**
   * Compute polygon vertices in world coordinates (XZ plane) from region overlay configuration.
   * Prioritize using world coordinates (_vertexPoints) from Terra face feature.
   * Fallback to GeoJSON + projectToWorld only if no feature is provided.
   * 
   * 从区域蒙版配置计算世界坐标系下的多边形顶点（XZ 平面）
   * 优先使用 Terra 面 feature 中已有的世界坐标（_vertexPoints），
   * 如果没有传 feature，才回退到 GeoJSON + projectToWorld。
   */
  _computeOverlayVertices(e) {
    const t = e.feature;
    if (t && Array.isArray(t._vertexPoints) && t._vertexPoints.length >= 6) {
      const u = t.getMap?.() || this.getMap();
      if (u && u.prjcenter) {
        const f = u.prjcenter, p = t._vertexPoints, d = [];
        for (let g = 0; g + 2 < p.length; g += 3) {
          const y = p[g], b = p[g + 2], T = f.x + y, x = f.z + b;
          d.push(new ce(T, x));
        }
        if (d.length >= 3)
          return d;
      }
    }
    const r = this.getMap();
    if (!r || !e.geometry) return null;
    const i = e.geometry;
    let o;
    if (i.type === "Polygon")
      o = i.coordinates;
    else if (i.type === "MultiPolygon") {
      if (!i.coordinates.length) return null;
      o = i.coordinates[0];
    } else
      return null;
    if (!o.length || !o[0].length) return null;
    const l = o[0], c = [];
    for (const u of l) {
      const f = u[0], p = u[1], d = r.projectToWorld(new I(f, p, 0));
      c.push(new ce(d.x, d.z));
    }
    return c.length < 3 ? null : c;
  }
  /**
   * Render city effect.
   * 渲染城市效果
   * 
   * @private
   */
  _rendercity() {
    const e = this.getLayer();
    let t = null;
    if (e && e.getRegionOverlays) {
      const r = e.getRegionOverlays() || [];
      if (r.length) {
        const i = r.filter((l) => (l.mode ?? "overlay") === "overlay").sort((l, c) => (l.zIndex ?? 0) - (c.zIndex ?? 0)), o = i[i.length - 1];
        if (o && (o.geometry || o.feature)) {
          const l = this._computeOverlayVertices(o);
          l && l.length >= 3 && (t = {
            color: new oe(o.color ?? "#00FF88"),
            opacity: o.opacity ?? 0.3,
            vertices: l
          });
        }
      }
    }
    this.traverse(async (r) => {
      if (r instanceof Ue && r.material) {
        if (r.castShadow = !0, r.name === "building") {
          const i = new QS({
            // color: new Color("#C7BD3C").multiplyScalar(1.8),
            color: new oe("#6BA7EC").multiplyScalar(1.8),
            opacity: 0.9,
            shaderOption: {
              minY: 0,
              maxY: 50,
              minRate: 0.3,
              maxRate: 1.5,
              effects: {
                diffusion: {
                  enabled: !0,
                  color: new oe("#FFFFF"),
                  width: 300,
                  speed: 0.05
                },
                flow: {
                  enabled: !1,
                  color: new oe("#FFFFF"),
                  range: 1e3,
                  speed: 3e3
                },
                sweep: {
                  enabled: !0,
                  color: new oe("#ffffff"),
                  width: 3,
                  speed: 5
                }
              }
            },
            // New: pass calculated overlayParams to material
            // 新增：把算好的 overlayParams 传给材质
            regionOverlay: t || void 0
          }), o = new en().setFromObject(r);
          i.updateBoundingBox(o.min.y, o.max.y), i.setDiffusionFromObject(r), r.receiveShadow = !1, r.material = i, r.material.needsUpdate = !0;
        }
        r.name === "grass" && (r.castShadow = !1, r.receiveShadow = !0, r.material.color = new oe("#81e4d8ff)").multiplyScalar(0.7), r.material.metalness = 0.2, r.material.roughness = 0.8, ["metalnessMap", "normalMap", "roughnessMap", "specularColorMap"].forEach((i) => {
          const o = r.material[i];
          o && (o.wrapS = o.wrapT = _r, o.repeat.set(0.3, 0.3), o.needsUpdate = !0);
        }), r.material.normalScale = new ce(3, 3));
      }
    });
  }
}
r2.mergeOptions(t2);
var i2 = Object.defineProperty, n2 = (s, e, t) => e in s ? i2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, s2 = (s, e, t) => n2(s, e + "", t);
const o2 = {
  // emissive: false,
  // emissiveIntensity: 1.0,
  // emissiveColor: "#ffffff",
};
class a2 extends fr {
  /**
   * Create a Cloud feature instance.
   * 创建云朵要素
   * 
   * @param options Cloud configuration options
   *                云朵配置选项
   */
  constructor(e) {
    super(e), s2(this, "_type", "Cloud");
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   * 
   * @description
   * Create cloud geometry based on style configuration.
   * 根据样式配置创建云朵几何体
   */
  async _buildRenderObject() {
    this._worldCoordinates = this._coordsTransform(), this._style && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._style), this._refreshCoordinates());
  }
  /**
   * Update geometry (override parent method).
   * 更新几何体（重写父类方法）
   * 
   * @description
   * Add cloud geometry to the layer's cloud container, and set position and render order.
   * 将云朵几何体添加到图层的云朵容器中，并设置位置和渲染顺序
   */
  _refreshCoordinates() {
    this._disposeGeometry();
    const e = this.getLayer();
    this._renderObject && (this._renderObject.position.copy(this._worldCoordinates), this._renderObject.renderOrder = 99, e && (e._clouds.add(this._renderObject), e._clouds.updateMatrixWorld()));
  }
  /**
   * Create cloud object.
   * 创建云朵对象
   * 
   * @param style Style configuration
   *              样式配置
   * @returns Created cloud object
   *          创建的云朵对象
   * @throws Throws error if style type is not supported
   *         如果样式类型不支持会抛出错误
   * 
   * @private
   */
  async _createObject(e) {
    if (e.config.type === "cloud")
      return dT(e.config, this._worldCoordinates);
    throw new Error(`Unsupported style type: ${e.config.type}`);
  }
}
a2.mergeOptions(o2);
var l2 = Object.defineProperty, c2 = (s, e, t) => e in s ? l2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, u2 = (s, e, t) => c2(s, e + "", t);
const h2 = {
  // Default config items
};
class f2 extends fr {
  /**
   * Create a label feature.
   * 创建标签要素
   * 
   * @param options Label configuration options
   *                标签配置选项
   */
  constructor(e) {
    super(e), u2(this, "_type", "Label");
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   * 
   * @description
   * Creates text label geometry based on style configuration.
   * 
   * 根据样式配置创建文本标签几何体
   */
  async _buildRenderObject() {
    this._worldCoordinates = this._coordsTransform(), this._style && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._style), this._refreshCoordinates());
  }
  /**
   * Quickly update geometry vertex positions (without rebuilding the entire geometry).
   * 快速更新几何体顶点位置（不重建整个几何体）
   * 
   * @description
   * Used for real-time interactions like dragging and editing. Updates only Label position without destroying and rebuilding geometry.
   * 
   * 用于拖拽、编辑等实时交互场景，仅更新Label的位置而不销毁重建几何体。
   */
  _refreshCoordinates() {
    this._worldCoordinates = this._coordsTransform(), this._renderObject ? (this._renderObject.position.copy(this._worldCoordinates), this.children.includes(this._renderObject) || this.add(this._renderObject), this.updateMatrixWorld(!0), this._renderObject.updateMatrixWorld(!0)) : this._buildRenderObject();
  }
  /**
   * Create label object.
   * 创建标签对象
   * 
   * @param style Style configuration
   *              样式配置
   * @returns Created label object
   *          创建的标签对象
   * @throws Throws error if style type is not supported
   *         如果样式类型不支持会抛出错误
   * 
   * @description
   * Supports two label types:
   * - 'canvas-label-fixed': Fixed size label
   * - 'canvas-label': Dynamic size label
   * 
   * 支持两种标签类型：
   * - 'canvas-label-fixed': 固定大小标签
   * - 'canvas-label': 动态大小标签
   */
  async _createObject(e) {
    switch (e.config.type) {
      case "canvas-label-fixed":
        return mT(
          e.config,
          new I(0, 0, 0),
          this.getMap()
        );
      case "canvas-label":
        return pT(
          e.config,
          new I(0, 0, 0)
        );
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
}
f2.mergeOptions(h2);
var d2 = Object.defineProperty, p2 = (s, e, t) => e in s ? d2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Wf = (s, e, t) => p2(s, typeof e != "symbol" ? e + "" : e, t);
const m2 = {};
class g2 extends fr {
  /**
   * Create a TPoints feature instance.
   * 创建TPoints要素实例
   * 
   * @param options TPoints configuration options
   *                TPoints配置选项
   */
  constructor(e) {
    super(e), Wf(this, "_type", "TPoints"), Wf(this, "_geometries"), this._geometries = e.geometries;
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   * 
   * @description
   * Create TPoints geometry based on style configuration.
   * 根据样式配置创建TPoints几何体
   */
  async _buildRenderObject() {
    this._worldCoordinates = this._coordsTransform(), this._style && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._style), this._refreshCoordinates());
  }
  /**
   * Update geometry (override parent method).
   * 更新几何体（重写父类方法）
   * 
   * @description
   * Add TPoints geometry to the container, and set position and render order.
   * 将TPoints几何体添加到容器中，并设置位置和渲染顺序
   */
  _refreshCoordinates() {
    this._renderObject && (this._renderObject.points && this.add(this._renderObject.points), this._renderObject.InstancedCol && this.add(this._renderObject.InstancedCol), this.updateMatrixWorld(!0));
  }
  /**
   * Create TPoints object.
   * 创建TPoints对象
   * 
   * @param style Style configuration
   *              样式配置
   * @returns Created TPoints object
   *          创建的TPoints对象
   * @throws Throws error if style type is not supported
   *         如果样式类型不支持会抛出错误
   * 
   * @private
   */
  async _createObject(e) {
    if (e.config.type === "light")
      return ST(e.config, this._geometries, this.getMap());
    throw new Error(`Unsupported style type: ${e.config.type}`);
  }
}
g2.mergeOptions(m2);
var _2 = Object.defineProperty, y2 = (s, e, t) => e in s ? _2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, li = (s, e, t) => y2(s, typeof e != "symbol" ? e + "" : e, t);
class us extends bi(Object) {
  /**
   * Create edit handle instance
   * 创建编辑手柄实例
   * 
   * @param options - Handle options 手柄配置选项
   * @param map - Map instance 地图实例
   */
  constructor(e, t) {
    super(), li(this, "options"), li(this, "map"), li(this, "_sprite", null), li(this, "_isDragging", !1), li(this, "_dragStartPosition", null), li(this, "_lastCoordinate", null), li(this, "_boundOnMouseMove", null), li(this, "_boundOnMouseUp", null), this.map = t, this.options = {
      position: e.position,
      index: e.index,
      symbol: e.symbol ?? 0,
      size: e.size ?? 8,
      color: e.color ?? "#ffffff",
      opacity: e.opacity ?? 0.9,
      draggable: e.draggable ?? !0
    }, this._createSprite(), this._boundOnMouseMove = this._onMouseMove.bind(this), this._boundOnMouseUp = this._onMouseUp.bind(this);
  }
  /**
   * Create sprite object for the handle
   * 创建手柄的 Sprite 对象
   * @private
   */
  _createSprite() {
    const t = document.createElement("canvas"), r = t.getContext("2d");
    t.width = 64, t.height = 64;
    const i = 64 / 2, o = 64 / 2 - 2;
    r.clearRect(0, 0, t.width, t.height), r.beginPath(), r.arc(i, i, o, 0, 2 * Math.PI), r.fillStyle = "#000000", r.fill(), r.beginPath(), r.arc(i, i, o - 2, 0, 2 * Math.PI), r.fillStyle = this.options.color, r.fill();
    const l = new Is(t);
    l.needsUpdate = !0;
    const c = new Ds({
      map: l,
      opacity: this.options.opacity,
      transparent: !0,
      depthTest: !1,
      // 禁用深度测试，确保手柄始终可见
      depthWrite: !1,
      // 不写入深度缓冲
      sizeAttenuation: !0
      // 启用距离衰减，但在 onBeforeRender 中动态调整 scale
    });
    this._sprite = new tn(c), this._sprite.position.copy(this.options.position), this._sprite.renderOrder = 999999;
    const u = new ce();
    this._sprite.onBeforeRender = (f, p, d) => {
      if (!this._sprite || !d) return;
      const g = d.position.distanceTo(this._sprite.position);
      f.getSize(u);
      const y = f.getPixelRatio(), b = this.options.size * y;
      let T = 1;
      if (d.isPerspectiveCamera) {
        const x = d.fov * Math.PI / 180, E = 2 * Math.tan(x / 2) * g;
        T = b / u.y * E;
      } else if (d.isOrthographicCamera) {
        const x = d.top, E = d.bottom, M = Math.abs(x - E) / d.zoom;
        T = b / u.y * M;
      }
      this._sprite.scale.set(T, T, 1);
    }, this._sprite._editHandle = this, this.map.viewer.scene.add(this._sprite);
  }
  /**
   * Update handle position
   * 更新手柄位置
   * 
   * @param position - New world position 新的世界坐标位置
   */
  updatePosition(e) {
    this.options.position = e, this._sprite && this._sprite.position.copy(e);
  }
  /**
   * Get handle position
   * 获取手柄位置
   * 
   * @returns Current world position 当前世界坐标位置
   */
  getPosition() {
    return this.options.position.clone();
  }
  /**
   * Get handle index
   * 获取手柄索引
   * 
   * @returns Vertex index 顶点索引
   */
  getIndex() {
    return this.options.index;
  }
  /**
   * Get handle symbol
   * 获取手柄符号
   * 
   * @returns Symbol identifier (0=vertex, 1=midpoint) 符号标识（0=顶点，1=中点）
   */
  getSymbol() {
    return this.options.symbol;
  }
  /**
   * Get Sprite object
   * 获取 Sprite 对象
   * 
   * @returns Sprite instance Sprite 实例
   */
  getSprite() {
    return this._sprite;
  }
  /**
   * Check if mouse intersects with the handle
   * 检测鼠标是否点击到手柄
   * 
   * @param raycaster - Raycaster 射线检测器
   * @returns Whether intersected 是否命中
   */
  intersect(e) {
    return !this._sprite || !this.options.draggable ? !1 : e.intersectObject(this._sprite).length > 0;
  }
  /**
   * Start dragging
   * 开始拖拽
   * 
   * @param coordinate - Mouse geographic coordinate 鼠标地理坐标
   */
  startDrag(e) {
    this.options.draggable && (this._isDragging = !0, this._dragStartPosition = this.options.position.clone(), this._lastCoordinate = e, this.map.viewer.config("draggable", !1), this.map.on("mousemove", this._boundOnMouseMove), this.map.on("mouseup", this._boundOnMouseUp), this.trigger("dragstart", {
      target: this,
      coordinate: e,
      position: this.options.position.clone()
    }));
  }
  /**
   * Handle mouse move event
   * 处理鼠标移动事件
   * @private
   */
  _onMouseMove(e) {
    if (!this._isDragging || !this._lastCoordinate)
      return;
    const t = e.coordinate, r = t[0] - this._lastCoordinate[0], i = t[1] - this._lastCoordinate[1], o = this.map.unprojectFromWorld(this.options.position), l = this.map.projectToWorld(new I(
      t[0],
      t[1],
      o.z
    ));
    this.updatePosition(l), this._lastCoordinate = t, this.trigger("dragging", {
      target: this,
      coordinate: t,
      position: this.options.position.clone(),
      offset: { dx: r, dy: i }
    });
  }
  /**
   * Handle mouse up event
   * 处理鼠标释放事件
   * @private
   */
  _onMouseUp(e) {
    this._isDragging && (this._isDragging = !1, this.map.viewer.config("draggable", !0), this.map.off("mousemove", this._boundOnMouseMove), this.map.off("mouseup", this._boundOnMouseUp), this.trigger("dragend", {
      target: this,
      coordinate: e.coordinate,
      position: this.options.position.clone(),
      startPosition: this._dragStartPosition
    }), this._dragStartPosition = null, this._lastCoordinate = null);
  }
  /**
   * Show handle
   * 显示手柄
   */
  show() {
    this._sprite && (this._sprite.visible = !0);
  }
  /**
   * 隐藏手柄
   */
  hide() {
    this._sprite && (this._sprite.visible = !1);
  }
  /**
   * Destroy handle
   * 销毁手柄
   */
  remove() {
    if (this._isDragging && (this._isDragging = !1, this.map.viewer.config("draggable", !0), this.map.off("mousemove", this._boundOnMouseMove), this.map.off("mouseup", this._boundOnMouseUp)), this._sprite) {
      this.map.viewer.scene.remove(this._sprite);
      const e = this._sprite.material;
      e.map && e.map.dispose(), e.dispose(), this._sprite = null;
    }
    this._dragStartPosition = null, this._lastCoordinate = null, this._boundOnMouseMove = null, this._boundOnMouseUp = null;
  }
}
function Pc(s, e, t) {
  const { currentTarget: r, clientX: i, clientY: o } = s;
  if (r instanceof HTMLElement) {
    const l = r.clientWidth, c = r.clientHeight, u = new ce(i / l * 2 - 1, -(o / c) * 2 + 1);
    return Sd(t, e, u)?.location;
  } else
    return;
}
var v2 = Object.defineProperty, w2 = (s, e, t) => e in s ? v2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ot = (s, e, t) => w2(s, typeof e != "symbol" ? e + "" : e, t);
class x2 extends la {
  /**
   * Create feature edit handler instance
   * 创建要素编辑处理器实例
   * 
   * @param target - Feature to edit 要编辑的要素
   * @param options - Edit options 编辑配置选项
   */
  constructor(e, t) {
    super(e), ot(this, "options"), ot(this, "_handles", []), ot(this, "_middleHandles", []), ot(this, "_middleHandleColor", "rgba(255, 255, 255, 0.6)"), ot(this, "_editing", !1), ot(this, "_shadow", null), ot(this, "_shadowSnapshot", null), ot(this, "_updating", !1), ot(this, "_history", []), ot(this, "_historyIndex", -1), ot(this, "_draggableOriginalState", !1), ot(this, "_boundOnMapMouseMove", null), ot(this, "_boundOnMapClick", null), ot(this, "_boundOnMapMouseDown", null), ot(this, "_boundOnFeatureDragging", null), ot(this, "_boundOnFeatureDragEnd", null), this.options = {
      handleSize: t?.handleSize ?? 8,
      handleColor: t?.handleColor ?? "#ffffff",
      showMiddleHandles: t?.showMiddleHandles ?? !1,
      maxHistorySize: t?.maxHistorySize ?? 20,
      removeVertexOn: t?.removeVertexOn ?? "contextmenu"
    }, this._boundOnMapMouseMove = this._onMapMouseMove.bind(this), this._boundOnMapClick = this._onMapClick.bind(this), this._boundOnMapMouseDown = this._onMapMouseDown.bind(this), this._boundOnFeatureDragging = this._onFeatureDragging.bind(this), this._boundOnFeatureDragEnd = this._onFeatureDragEnd.bind(this);
  }
  /**
   * Enable editor
   * 启用编辑器
   */
  enable() {
    return this._editing ? this : (super.enable(), this._editing = !0, this._createShadow(), this._saveSnapshot(), this._setFeatureEditingStyle(!0), this._createHandles(), this.target.trigger("editstart"), this._draggableOriginalState = this.target.options.draggable || !1, this._draggableOriginalState || (this.target.options.draggable = !0, this.target.draggable && this.target.draggable.enable()), this);
  }
  /**
   * Disable editor
   * 禁用编辑器
   */
  disable() {
    return this._editing ? (super.disable(), this._editing = !1, this._clearHandles(), this._setFeatureEditingStyle(!1), this._draggableOriginalState || (this.target.options.draggable = !1, this.target.draggable && this.target.draggable.disable()), this._draggableOriginalState = !1, this._updateCoordFromShadow(), this._removeShadow(), this.target.trigger("editend"), this) : this;
  }
  /**
   * Add event hooks
   * 添加事件钩子
   */
  addHooks() {
    const e = this._getMap();
    e && (e.on("mousemove", this._boundOnMapMouseMove), e.on("click", this._boundOnMapClick), e.viewer.container && e.viewer.container.addEventListener("mousedown", this._boundOnMapMouseDown, !0), this.options.removeVertexOn === "contextmenu" && e.on("contextmenu", this._boundOnMapClick)), this.target.on("dragging", this._boundOnFeatureDragging), this.target.on("dragend", this._boundOnFeatureDragEnd);
  }
  /**
   * Remove event hooks
   * 移除事件钩子
   */
  removeHooks() {
    const e = this._getMap();
    e && (e.off("mousemove", this._boundOnMapMouseMove), e.off("click", this._boundOnMapClick), e.viewer.container && e.viewer.container.removeEventListener("mousedown", this._boundOnMapMouseDown, !0), this.options.removeVertexOn === "contextmenu" && e.off("contextmenu", this._boundOnMapClick)), this.target.off("dragging", this._boundOnFeatureDragging), this.target.off("dragend", this._boundOnFeatureDragEnd);
  }
  /**
   * Check if is editing
   * 检查是否正在编辑
   */
  isEditing() {
    return this._editing;
  }
  /**
   * Create shadow copy
   * 创建影子副本
   * @description  shadow mechanism, edit on the copy shadow 机制，在副本上进行编辑
   * @private
   */
  _createShadow() {
    this._shadow = null;
  }
  /**
   * Remove shadow copy
   * 移除影子副本
   * @private
   */
  _removeShadow() {
    this._shadow && (this._shadow = null), this._shadowSnapshot = null;
  }
  /**
   * Sync coordinates from shadow copy to original feature
   * 从影子副本同步坐标到原要素
   * @description  _updateCoordFromShadow
   * @param updateGeometry Whether to update geometry 是否更新几何体
   * @private
   */
  _updateCoordFromShadow(e = !1) {
    e && !this._updating && this.target._refreshCoordinates();
  }
  /**
   * Save current state snapshot
   * 保存当前状态快照
   * @private
   */
  _saveSnapshot() {
    const e = this.target._geometry;
    this._shadowSnapshot = {
      type: e.type,
      coordinates: JSON.parse(JSON.stringify(e.coordinates))
    }, this._addHistory(e.coordinates);
  }
  /**
   * Add to history
   * 添加到历史记录
   * @private
   */
  _addHistory(e) {
    this._historyIndex < this._history.length - 1 && (this._history = this._history.slice(0, this._historyIndex + 1)), this._history.push({
      coordinates: JSON.parse(JSON.stringify(e)),
      timestamp: Date.now()
    }), this._history.length > this.options.maxHistorySize ? this._history.shift() : this._historyIndex++;
  }
  /**
   * Undo edit
   * 撤销编辑
   */
  undo() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      const e = this._history[this._historyIndex];
      this._restoreCoordinates(e.coordinates), this.target.trigger("editundo");
    }
    return this;
  }
  /**
   * Redo edit
   * 重做编辑
   */
  redo() {
    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      const e = this._history[this._historyIndex];
      this._restoreCoordinates(e.coordinates), this.target.trigger("editredo");
    }
    return this;
  }
  /**
   * Restore coordinates
   * 恢复坐标
   * @private
   */
  _restoreCoordinates(e) {
    const t = this.target._geometry;
    t.coordinates = JSON.parse(JSON.stringify(e)), this.target._refreshCoordinates(), this._updateHandlePositions();
  }
  /**
   * Cancel edit (restore to state before editing)
   * 取消编辑（恢复到编辑前的状态）
   */
  cancel() {
    return this._shadowSnapshot && this._restoreCoordinates(this._shadowSnapshot.coordinates), this.disable(), this;
  }
  /**
   * Create edit handles
   * 创建编辑手柄
   * @private
   */
  _createHandles() {
    const e = this.target._geometry, t = this._getMap();
    if (!t) {
      console.warn("[FeatureEditHandler] No map found, cannot create handles");
      return;
    }
    this.target instanceof fr ? this._createPointHandles(e, t) : this.target instanceof Bt ? this._createLineStringHandles(e, t) : this.target instanceof Wr && this._createPolygonHandles(e, t);
  }
  /**
   * Create edit handles for Point feature
   * 创建点要素的编辑手柄
   * @private
   */
  _createPointHandles(e, t) {
    const r = e.coordinates, i = t.projectToWorld(new I(r[0], r[1], r[2] || 0)), o = new us({
      position: i,
      index: 0,
      symbol: 0,
      // 顶点
      size: this.options.handleSize,
      color: this.options.handleColor
    }, t);
    o.on("dragstart", (l) => {
      this._onHandleDragStart(l, 0);
    }), o.on("dragging", (l) => {
      this._onHandleDragging(l, 0);
    }), o.on("dragend", (l) => {
      this._onHandleDragEnd(l, 0);
    }), this._handles.push(o);
  }
  /**
   * Create edit handles for LineString feature
   * 创建线要素的编辑手柄
   * @private
   */
  _createLineStringHandles(e, t) {
    const r = e.coordinates;
    r.forEach((i, o) => {
      const l = t.projectToWorld(new I(i[0], i[1], i[2] || 0)), c = new us({
        position: l,
        index: o,
        symbol: 0,
        // 顶点
        size: this.options.handleSize,
        color: this.options.handleColor
      }, t);
      c.on("dragstart", (u) => {
        this._onHandleDragStart(u, o);
      }), c.on("dragging", (u) => {
        this._onHandleDragging(u, o);
      }), c.on("dragend", (u) => {
        this._onHandleDragEnd(u, o);
      }), this._handles.push(c);
    }), this.options.showMiddleHandles && this._createLineStringMiddleHandles(r, t);
  }
  /**
   * Handle handle dragging
   * 手柄拖拽中的处理
   * @description  onHandleDragging
   * @private
   */
  _onHandleDragging(e, t) {
    this._updating = !0;
    const i = e.target.getPosition();
    if (!this._getMap())
      return;
    const l = this._fixHandlePointCoordinates(i, t), c = this.target._geometry;
    this.target instanceof fr ? c.coordinates = [l.x, l.y, l.z] : this.target instanceof Bt && (c.coordinates[t] = [l.x, l.y, l.z]), this.target._refreshCoordinates(), this.target.trigger("handledragging", {
      index: t,
      coordinate: [l.x, l.y, l.z]
    }), this.target.trigger("editing", {
      index: t,
      coordinate: [l.x, l.y, l.z]
    }), this._updating = !1;
  }
  /**
   * Handle handle drag start
   * 手柄拖拽开始的处理
   * @description  onHandleDragstart
   * @private
   */
  _onHandleDragStart(e, t) {
    this._updating = !0, this.target.trigger("handledragstart", {
      index: t,
      coordinate: e.coordinate
    });
  }
  /**
   * Handle handle drag end
   * 手柄拖拽结束的处理
   * @description onHandleDragEnd
   * @private
   */
  _onHandleDragEnd(e, t) {
    this._updating = !1;
    const r = this.target._geometry;
    this._addHistory(r.coordinates), this.target.trigger("handledragend", {
      index: t,
      coordinate: this.target instanceof fr ? r.coordinates : r.coordinates[t]
    }), this.target.trigger("editvertex", {
      index: t,
      coordinate: this.target instanceof fr ? r.coordinates : r.coordinates[t]
    });
  }
  /**
   * Create polygon edit handles
   * 创建多边形编辑手柄
   * @description createPolygonEditor
   * @private
   */
  _createPolygonHandles(e, t) {
    const r = e.coordinates;
    if (!r || !Array.isArray(r) || r.length === 0) {
      console.warn("[FeatureEditHandler] Invalid polygon coordinates");
      return;
    }
    r.forEach((o, l) => {
      if (!o || o.length < 3)
        return;
      const c = o[0][0] === o[o.length - 1][0] && o[0][1] === o[o.length - 1][1] ? o.length - 1 : o.length;
      for (let u = 0; u < c; u++) {
        const f = o[u], p = t.projectToWorld(new I(f[0], f[1], f[2] || 0)), d = new us({
          position: p,
          index: u,
          symbol: 0,
          // 顶点
          size: this.options.handleSize,
          color: this.options.handleColor
        }, t);
        d._ringIndex = l, d.on("dragstart", (g) => {
          this._onPolygonHandleDragStart(g, u, l);
        }), d.on("dragging", (g) => {
          this._onPolygonHandleDragging(g, u, l);
        }), d.on("dragend", (g) => {
          this._onPolygonHandleDragEnd(g, u, l);
        }), this._handles.push(d);
      }
      this.options.showMiddleHandles && this._createPolygonMiddleHandles(o, l, t);
    });
  }
  /**
   * Handle polygon handle drag start
   * 多边形手柄拖拽开始
   * @private
   */
  _onPolygonHandleDragStart(e, t, r) {
    this._updating = !0, this.target.trigger("handledragstart", {
      index: t,
      ringIndex: r,
      coordinate: e.coordinate
    });
  }
  /**
   * 多边形手柄拖拽中
   * @description  moveVertexHandle
   * @private
   */
  _onPolygonHandleDragging(e, t, r) {
    const o = e.target.getPosition();
    if (!this._getMap())
      return;
    const c = this._fixHandlePointCoordinates(o, t, r), f = this.target._geometry.coordinates;
    if (f[r] && f[r][t] && (f[r][t] = [c.x, c.y, c.z], t === 0 && f[r].length > 1)) {
      const p = f[r].length - 1;
      f[r][p] = [c.x, c.y, c.z];
    }
    this.target._refreshCoordinates(), this.target.trigger("handledragging", {
      index: t,
      ringIndex: r,
      coordinate: [c.x, c.y, c.z]
    }), this.target.trigger("editing", {
      index: t,
      ringIndex: r,
      coordinate: [c.x, c.y, c.z]
    });
  }
  /**
   * Handle polygon handle drag end
   * 多边形手柄拖拽结束
   * @private
   */
  _onPolygonHandleDragEnd(e, t, r) {
    this._updating = !1;
    const i = this.target._geometry, o = i.coordinates;
    this._addHistory(i.coordinates), this.target.trigger("handledragend", {
      index: t,
      ringIndex: r,
      coordinate: o[r]?.[t] || null
    }), this.target.trigger("editvertex", {
      index: t,
      ringIndex: r,
      coordinate: o[r]?.[t] || null
    });
  }
  /**
   * Update handle positions
   * 更新手柄位置
   * @private
   */
  _updateHandlePositions() {
    const e = this.target._geometry, t = this._getMap();
    if (t) {
      if (this.target instanceof fr) {
        const r = e.coordinates, i = t.projectToWorld(new I(r[0], r[1], r[2] || 0));
        this._handles[0] && this._handles[0].updatePosition(i);
      } else if (this.target instanceof Bt)
        e.coordinates.forEach((i, o) => {
          const l = t.projectToWorld(new I(i[0], i[1], i[2] || 0));
          this._handles[o] && this._handles[o].updatePosition(l);
        });
      else if (this.target instanceof Wr) {
        const r = e.coordinates;
        let i = 0;
        r.forEach((o) => {
          const l = o[0][0] === o[o.length - 1][0] && o[0][1] === o[o.length - 1][1] ? o.length - 1 : o.length;
          for (let c = 0; c < l; c++) {
            const u = o[c], f = t.projectToWorld(new I(u[0], u[1], u[2] || 0));
            this._handles[i] && this._handles[i].updatePosition(f), i++;
          }
        });
      }
    }
  }
  /**
   * Clear all handles
   * 清除所有手柄
   * @private
   */
  _clearHandles() {
    this._handles.forEach((e) => e.remove()), this._handles = [], this._middleHandles.forEach((e) => e.remove()), this._middleHandles = [];
  }
  /**
   * Handle feature dragging event
   * 处理要素拖拽事件
   * @private
   */
  _onFeatureDragging(e) {
    this._updateHandlePositions(), this.options.showMiddleHandles && this._updateMiddleHandlePositions();
  }
  /**
   * Handle feature drag end event
   * 处理要素拖拽结束事件
   * @private
   */
  _onFeatureDragEnd(e) {
    const t = this.target._geometry;
    this._addHistory(t.coordinates), this._updateHandlePositions(), this.options.showMiddleHandles && this._updateMiddleHandlePositions();
  }
  /**
   * Update middle handle positions
   * 更新中点手柄位置
   * @private
   */
  _updateMiddleHandlePositions() {
    const e = this.target._geometry, t = this._getMap();
    if (!t) return;
    let r = 0;
    if (this.target instanceof Bt) {
      const i = e.coordinates;
      for (let o = 0; o < i.length - 1 && !(r >= this._middleHandles.length); o++) {
        const l = i[o], c = i[o + 1], u = [
          (l[0] + c[0]) / 2,
          (l[1] + c[1]) / 2,
          ((l[2] || 0) + (c[2] || 0)) / 2
        ], f = t.projectToWorld(new I(u[0], u[1], u[2]));
        this._middleHandles[r].updatePosition(f), r++;
      }
    } else this.target instanceof Wr && e.coordinates.forEach((o) => {
      const l = o[0][0] === o[o.length - 1][0] && o[0][1] === o[o.length - 1][1] ? o.length - 1 : o.length;
      for (let c = 0; c < l && !(r >= this._middleHandles.length); c++) {
        const u = (c + 1) % l, f = o[c], p = o[u], d = [
          (f[0] + p[0]) / 2,
          (f[1] + p[1]) / 2,
          ((f[2] || 0) + (p[2] || 0)) / 2
        ], g = t.projectToWorld(new I(d[0], d[1], d[2]));
        this._middleHandles[r].updatePosition(g), r++;
      }
    });
  }
  /**
   * Handle map mouse down event
   * 处理地图鼠标按下事件
   * @private
   */
  _onMapMouseDown(e) {
    const t = this._getMap();
    if (!t)
      return;
    const r = new Ps();
    r.params.Points = { threshold: 0.5 };
    const i = e, o = t.viewer.renderer.domElement, l = o.getBoundingClientRect(), c = new ce(
      (i.clientX - l.left) / l.width * 2 - 1,
      -((i.clientY - l.top) / l.height) * 2 + 1
    );
    r.setFromCamera(c, t.viewer.camera);
    const u = [...this._handles, ...this._middleHandles];
    for (const f of u)
      if (f.intersect(r)) {
        const p = Pc({
          currentTarget: o,
          clientX: i.clientX,
          clientY: i.clientY
        }, t, t.viewer.camera);
        p && (f.startDrag([p.x, p.y]), i.stopPropagation && i.stopPropagation(), i.stopImmediatePropagation && i.stopImmediatePropagation(), i.preventDefault && i.preventDefault());
        return;
      }
  }
  /**
   * Handle map mouse move event
   * 处理地图鼠标移动事件
   * @private
   */
  _onMapMouseMove(e) {
  }
  /**
   * Handle map click event
   * 处理地图点击事件
   * @description Implement vertex removal functionality 实现顶点删除功能
   * @private
   */
  _onMapClick(e) {
    if (!(e.type === this.options.removeVertexOn))
      return;
    const r = this._getMap();
    if (!r)
      return;
    const i = new Ps();
    i.params.Points = { threshold: 0.5 };
    const o = e.originEvent;
    if (!o)
      return;
    const l = new ce(
      o.offsetX / r.viewer.renderer.domElement.clientWidth * 2 - 1,
      -(o.offsetY / r.viewer.renderer.domElement.clientHeight) * 2 + 1
    );
    i.setFromCamera(l, r.viewer.camera);
    for (let c = 0; c < this._handles.length; c++)
      if (this._handles[c].intersect(i)) {
        this._removeVertex(c), o.stopPropagation && o.stopPropagation(), o.preventDefault && o.preventDefault();
        return;
      }
  }
  /**
   * Set feature editing style
   * 设置要素编辑模式下的样式
   * @private
   */
  _setFeatureEditingStyle(e) {
    const t = this.target._renderObject;
    t && t.traverse((r) => {
      r.material && (e ? Array.isArray(r.material) ? r.material.forEach((i) => {
        i.userData._originalOpacity || (i.userData._originalOpacity = i.opacity), i.opacity = Math.min(i.opacity * 0.6, 0.6), i.transparent = !0;
      }) : (r.material.userData._originalOpacity || (r.material.userData._originalOpacity = r.material.opacity), r.material.opacity = Math.min(r.material.opacity * 0.6, 0.6), r.material.transparent = !0) : Array.isArray(r.material) ? r.material.forEach((i) => {
        i.userData._originalOpacity !== void 0 && (i.opacity = i.userData._originalOpacity, delete i.userData._originalOpacity);
      }) : r.material.userData._originalOpacity !== void 0 && (r.material.opacity = r.material.userData._originalOpacity, delete r.material.userData._originalOpacity));
    });
  }
  /**
   * Remove vertex
   * 删除顶点
   * @description removeVertex
   * @private
   */
  _removeVertex(e) {
    const t = this.target._geometry, r = this._handles[e], i = r.getIndex(), o = r._ringIndex || 0;
    let l = null;
    if (this.target instanceof Bt) {
      const c = t.coordinates;
      if (c.length <= 2) {
        console.warn("[FeatureEditHandler] LineString requires at least 2 vertices");
        return;
      }
      l = c[i], c.splice(i, 1);
    } else if (this.target instanceof Wr) {
      const u = t.coordinates[o];
      if (!u)
        return;
      const f = u.length > 1 && u[0][0] === u[u.length - 1][0] && u[0][1] === u[u.length - 1][1], p = f ? 4 : 3;
      if (u.length <= p) {
        console.warn("[FeatureEditHandler] Polygon ring requires at least 3 vertices");
        return;
      }
      l = u[i], u.splice(i, 1), f && i === 0 && u.length > 0 && (u[u.length - 1] = [...u[0]]);
    } else
      return;
    this.target._refreshCoordinates(), r.remove(), this._handles.splice(e, 1), this._updateHandleIndices(), this._addHistory(t.coordinates), this.target.trigger("handleremove", {
      index: i,
      ringIndex: o,
      coordinate: l
    });
  }
  /**
   * Create middle handles for LineString
   * 为 LineString 创建中点手柄
   * @description Create middle handles between vertices for inserting new vertices
   * @private
   */
  _createLineStringMiddleHandles(e, t) {
    for (let r = 0; r < e.length - 1; r++) {
      const i = e[r], o = e[r + 1], l = [
        (i[0] + o[0]) / 2,
        (i[1] + o[1]) / 2,
        ((i[2] || 0) + (o[2] || 0)) / 2
      ], c = t.projectToWorld(new I(l[0], l[1], l[2])), u = new us({
        position: c,
        index: r,
        symbol: 1,
        // 中点
        size: this.options.handleSize,
        color: this._middleHandleColor,
        opacity: 0.6
      }, t);
      u.on("dragstart", (f) => {
        this._onMiddleHandleClick(r, "LineString", 0);
      }), this._middleHandles.push(u);
    }
  }
  /**
   * Create middle handles for Polygon
   * 为 Polygon 创建中点手柄
   * @private
   */
  _createPolygonMiddleHandles(e, t, r) {
    const i = e[0][0] === e[e.length - 1][0] && e[0][1] === e[e.length - 1][1] ? e.length - 1 : e.length;
    for (let o = 0; o < i; o++) {
      const l = (o + 1) % i, c = e[o], u = e[l], f = [
        (c[0] + u[0]) / 2,
        (c[1] + u[1]) / 2,
        ((c[2] || 0) + (u[2] || 0)) / 2
      ], p = r.projectToWorld(new I(f[0], f[1], f[2])), d = new us({
        position: p,
        index: o,
        symbol: 1,
        // 中点
        size: this.options.handleSize,
        color: this._middleHandleColor,
        opacity: 0.6
      }, r);
      d._ringIndex = t, d.on("dragstart", (g) => {
        this._onMiddleHandleClick(o, "Polygon", t);
      }), this._middleHandles.push(d);
    }
  }
  /**
   * Handle middle handle click (insert new vertex)
   * 处理中点手柄点击（插入新顶点）
   * Insert a new vertex at the middle handle position
   * @private
   */
  _onMiddleHandleClick(e, t, r) {
    const i = this.target._geometry;
    if (this._getMap()) {
      if (t === "LineString") {
        const l = i.coordinates, c = l[e], u = l[e + 1], f = [
          (c[0] + u[0]) / 2,
          (c[1] + u[1]) / 2,
          ((c[2] || 0) + (u[2] || 0)) / 2
        ];
        l.splice(e + 1, 0, f);
      } else if (t === "Polygon") {
        const c = i.coordinates[r];
        if (!c)
          return;
        const u = c[0][0] === c[c.length - 1][0] && c[0][1] === c[c.length - 1][1] ? c.length - 1 : c.length, f = (e + 1) % u, p = c[e], d = c[f], g = [
          (p[0] + d[0]) / 2,
          (p[1] + d[1]) / 2,
          ((p[2] || 0) + (d[2] || 0)) / 2
        ];
        c.splice(e + 1, 0, g), c.length > 1 && c[0][0] === c[c.length - 1][0] && c[0][1] === c[c.length - 1][1] && e === u - 1 && (c[c.length - 1] = [...c[0]]);
      }
      this.target._applyCoordinateChanges(!0), this._clearHandles(), this._createHandles(), this._addHistory(i.coordinates), this.target.trigger("vertexinsert", {
        index: e + 1,
        ringIndex: r
      });
    }
  }
  /**
   * 更新手柄索引
   * Update handle indices
   * @private
   */
  _updateHandleIndices() {
    if (this.target instanceof Bt)
      this._handles.forEach((e, t) => {
        e._index = t;
      });
    else if (this.target instanceof Wr) {
      let e = 0;
      this.target._geometry.coordinates.forEach((i, o) => {
        const l = i[0][0] === i[i.length - 1][0] && i[0][1] === i[i.length - 1][1] ? i.length - 1 : i.length;
        for (let c = 0; c < l; c++)
          this._handles[e] && (this._handles[e]._index = c, this._handles[e]._ringIndex = o), e++;
      });
    }
  }
  /**Fix handle point coordinates (altitude compensation)
   * 
   * 修正手柄点坐标（tion Convert world coordinates 海o geograph拔c c补ordi偿ates with altitude）compensation
   * @description  - Worldcoordinates 
   * @param index - Vertex worldPos 世界坐标
   * @param index 顶点索 - Ring index (optional)引
   * @param ringIndex 环索引（可选）
   * @private
   */
  _fixHandlePointCoordinates(e, t, r = 0) {
    const i = this._getMap();
    if (!i)
      return e;
    const o = this.target._geometry;
    let l = null;
    if (this.target instanceof fr)
      l = o.coordinates;
    else if (this.target instanceof Bt)
      l = o.coordinates[t];
    else if (this.target instanceof Wr) {
      const u = o.coordinates;
      u[r] && u[r][t] && (l = u[r][t]);
    }
    if (!l || !l[2] || l[2] === 0)
      return i.unprojectFromWorld(e);
    const c = i.unprojectFromWorld(e);
    return c.z = l[2], c;
  }
  /**
   * Get map instance
   * 获取地图实例
   * @private
   */
  _getMap() {
    return this.target.getMap();
  }
  /**Destroy editor
   * 销毁编辑器
   */
  remove() {
    this.disable(), this._history = [], this._historyIndex = -1, this._shadow = null, this._shadowSnapshot = null, this._boundOnMapMouseMove = null, this._boundOnMapClick = null, this._boundOnMapMouseDown = null;
  }
}
gt.prototype.startEdit = function(s) {
  return this.options?.editable ? (this._editor && this.endEdit(), this._editor = new x2(this, s), this._editor.enable(), this) : (console.warn("Feature is not editable. Set editable option to true."), this);
};
gt.prototype.endEdit = function() {
  return this._editor && (this._editor.disable(), this._editor.remove(), delete this._editor), this;
};
gt.prototype.isEditing = function() {
  return this._editor ? this._editor.isEditing() : !1;
};
gt.prototype.cancelEdit = function() {
  return this._editor && this._editor.cancel(), this;
};
gt.prototype.undoEdit = function() {
  return this._editor && this._editor.undo(), this;
};
gt.prototype.redoEdit = function() {
  return this._editor && this._editor.redo(), this;
};
function Ko(s, e) {
  if (!s || s === !0) return !0;
  if (!Array.isArray(s))
    return !!s;
  switch (s[0]) {
    case "all":
      return s.slice(1).every((r) => Ko(r, e));
    case "any":
      return s.slice(1).some((r) => Ko(r, e));
    case "!":
      return !Ko(s[1], e);
    case "==": {
      const r = at(s[1], e), i = at(s[2], e);
      return No(r) == No(i);
    }
    case "!=": {
      const r = at(s[1], e), i = at(s[2], e);
      return No(r) != No(i);
    }
    case ">": {
      const r = at(s[1], e), i = at(s[2], e);
      return ci(r) > ci(i);
    }
    case "<": {
      const r = at(s[1], e), i = at(s[2], e);
      return ci(r) < ci(i);
    }
    case ">=": {
      const r = at(s[1], e), i = at(s[2], e);
      return ci(r) >= ci(i);
    }
    case "<=": {
      const r = at(s[1], e), i = at(s[2], e);
      return ci(r) <= ci(i);
    }
    case "in": {
      const r = at(s[1], e);
      return s.slice(2).map((o) => at(o, e)).includes(r);
    }
    case "!in": {
      const r = at(s[1], e);
      return !s.slice(2).map((o) => at(o, e)).includes(r);
    }
    case "has": {
      const r = s[1];
      return e != null && Object.prototype.hasOwnProperty.call(e, r);
    }
    case "!has": {
      const r = s[1];
      return !(e != null && Object.prototype.hasOwnProperty.call(e, r));
    }
    default:
      return !0;
  }
}
function at(s, e) {
  return Array.isArray(s) && s[0] === "get" ? e ? e[s[1]] : void 0 : s;
}
function No(s) {
  if (s == null)
    return null;
  if (typeof s == "string") {
    const e = Number(s);
    if (!isNaN(e) && s.trim() !== "")
      return e;
  }
  return typeof s == "boolean" ? s ? 1 : 0 : s;
}
function ci(s) {
  if (s == null)
    return 0;
  if (typeof s == "number")
    return s;
  if (typeof s == "boolean")
    return s ? 1 : 0;
  if (typeof s == "string") {
    const e = Number(s);
    return isNaN(e) ? 0 : e;
  }
  return Number(s);
}
var b2 = Object.defineProperty, T2 = (s, e, t) => e in s ? b2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, hs = (s, e, t) => T2(s, typeof e != "symbol" ? e + "" : e, t);
class jl extends wi {
  constructor(e, t) {
    super(e, t), hs(this, "TILE_SIZE"), hs(this, "EXTENT"), hs(this, "style"), hs(this, "_tileFeatureMap", /* @__PURE__ */ new Map()), hs(this, "_activeFeatureFilter"), this.TILE_SIZE = t.tileSize ?? 256, this.EXTENT = t.extent ?? 4096, this.style = t.style || [], this._onMapUpdate = this._onMapUpdate.bind(this);
  }
  // --- Core Rendering and Data Processing Methods ---
  // --- 核心渲染和数据处理方法 ---
  /**
   * **Core Method:** Process single tile data, create Features based on global style rules array.
   * **核心方法：** 处理单个瓦片的数据，根据全局样式规则数组创建 Features。
   * 
   * @param tile Tile object (contains z, x, y ID). 瓦片对象 (包含 z, x, y ID)。
   * @param data Parsed vector tile data (contains vectorData property). 经过解析的矢量瓦片数据 (包含 vectorData 属性)。
   * @param zoom Current zoom level. 当前缩放级别 (Unused parameter in implementation).
   */
  processTileData(e, t) {
    const r = this.getMap(), i = `${e.z}-${e.x}-${e.y}`, o = this._tileFeatureMap.get(i);
    if (o && o.length > 0) {
      o.forEach((f) => {
        f.visible = !0, this.children.some((p) => p && f && p.uuid === f.uuid) || f.addTo(this);
      });
      return;
    }
    const l = t.vectorData;
    if (!l || !l.layers || !r || this.style.length === 0) return;
    const c = [], u = this.style;
    Object.keys(l.layers).forEach((f) => {
      const p = l.layers[f];
      for (let d = 0; d < p.length; d++) {
        const g = p[d], y = g.geometry;
        if (this._activeFeatureFilter && !this._activeFeatureFilter(g.properties))
          continue;
        let b = null;
        for (const T of u)
          if (this._evaluateFilter(T.filter, g.properties, f, g.geometry.type)) {
            b = T.style;
            break;
          }
        if (b) {
          const T = {
            isVectorTile: !0,
            tileZ: e.z,
            tileX: e.x,
            tileY: e.y,
            rawCoordinates: y,
            extent: this.EXTENT,
            tileSize: this.TILE_SIZE
          }, x = this._createFeatureInstance(
            g.geometry,
            g.geometry.type,
            b,
            g.properties
          );
          x && (x.userData.tileData = T, x.style = Jt.create(b), x.addTo(this), x.initializeGeometry(), c.push(x));
        }
      }
    }), this._tileFeatureMap.set(i, c);
  }
  /**
   * Placeholder function: Evaluate if feature properties satisfy filter conditions (needs to implement complex Mapbox GL style spec).
   * 占位函数：评估要素属性是否满足过滤条件 (需要实现复杂的 Mapbox GL 样式规范)。
   * 
   * @param filter Filter expression in style rule. 样式规则中的 filter 表达式。
   * @param properties Feature properties object. 要素的属性对象。
   * @param layerName Name of tile layer the current feature belongs to (can be used for filtering). 当前要素所属的瓦片图层名称 (可用于过滤)。
   * @returns {boolean} Whether it matches. 是否匹配。
   */
  _evaluateFilter(e, t, r, i) {
    if (!e || e === !0) return !0;
    const o = {
      ...t,
      $layer: r,
      $type: i
    };
    return Ko(e, o);
  }
  /**
   * Hide Features of a tile (do not destroy).
   * Used for tile-hidden event.
   * 隐藏某个瓦片的 Features（并不销毁）。
   * 用于 tile-hidden 事件。
   * 
   * @param tileKey Tile identifier. 瓦片标识符。
   */
  hideFeaturesByTileKey(e) {
    const t = this._tileFeatureMap.get(e);
    t && t.forEach((r) => {
      r.visible = !1;
    });
  }
  /**
   * Completely clean up all Features loaded by a tile.
   * Used for tile-unload event.
   * 彻底清理某个瓦片加载的所有 Feature。
   * 用于 tile-unload 事件。
   * 
   * @param tileKey Tile identifier. 瓦片标识符。
   */
  removeFeaturesByTileKey(e) {
    this._removeFeaturesByTileKey(e);
  }
  _removeFeaturesByTileKey(e) {
    const t = this._tileFeatureMap.get(e);
    t && (t.forEach((r) => {
      r._remove();
    }), this._tileFeatureMap.delete(e));
  }
  // --- Feature Factory Methods ---
  // --- Feature 工厂方法 ---
  /**
   * Create corresponding Feature instance based on GeoJSON type.
   * 根据 GeoJSON 类型创建对应的 Feature 实例
   */
  _createFeatureInstance(e, t, r, i) {
    const l = {
      geometry: {
        ismvt: !0,
        ...e
      },
      style: r,
      userData: i
    };
    switch (t) {
      case "Point":
        return new xi(l);
      case "LineString":
        return new Bt(l);
      // case 3: // Polygon
      //     return new PolygonFeature(options as any); 
      default:
        return null;
    }
  }
  // --- Lifecycle, Style and Update ---
  // --- 生命周期、样式和更新 ---
  setFeatureFilter(e) {
    this._activeFeatureFilter = e;
  }
  clearFeatureFilter() {
    this._activeFeatureFilter = void 0;
  }
  setOpacity(e) {
    this.opacity = e, this._tileFeatureMap.forEach((t) => {
      t.forEach((r) => {
        r.material && (r.material.opacity = e, r.material.transparent = e < 1);
      });
    });
  }
  /**
   * Start listening to map update events when Layer is added to Map.
   * Layer 绑定到 Map 时，开始监听地图更新事件
   */
  // public onAdd(map: MapClass): void {
  //     // super.onAdd(map);
  //     // Listen for map move events to update Features when map center (prjcenter) changes
  //     // 监听地图移动事件，以便在地图中心点 (prjcenter) 变化时更新 Features
  //     // (map as any).on('move', this._onMapUpdate);
  // }
  /**
   * Stop listening when Layer is removed from Map.
   * Layer 从 Map 移除时，取消监听
   */
  // public onRemove(map: MapClass): void {
  //     // (map as any).off('move', this._onMapUpdate);
  //     // super.onRemove(map);
  //     this.dispose();
  // }
  /**
   * Map update callback: Force all loaded Features to recalculate their local world coordinates.
   * 地图更新回调：强制所有已加载的 Features 重新计算其局部世界坐标。
   */
  _onMapUpdate() {
  }
  /**
   * OverlayLayer abstract method implementation.
   * OverlayLayer 抽象方法实现
   */
  validateFeature(e) {
    return e instanceof gt;
  }
  /**
   * Three.js render loop update method.
   * Three.js 渲染循环更新方法
   */
  // public update(camera: Camera): void {
  //     // Leave empty or call super.update(camera)
  //     // 留空或调用 super.update(camera)
  // }
  dispose() {
    this._tileFeatureMap.forEach((e, t) => {
      this._removeFeaturesByTileKey(t);
    }), super.dispose();
  }
}
var S2 = Object.defineProperty, M2 = (s, e, t) => e in s ? S2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, St = (s, e, t) => M2(s, typeof e != "symbol" ? e + "" : e, t);
class np extends ca {
  /**
   * Create a new BaseTileLayer instance.
   * 创建一个新的 BaseTileLayer 实例。
   * 
   * @param layerId Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    super(e, t), this.layerId = e, St(this, "isTileLayer", !0), St(this, "layerType", "base"), St(this, "isBaseLayer", !1), St(this, "_enabled", !0), St(this, "_visible", !0), St(this, "_rootTile"), St(this, "_loader"), St(this, "_LODThreshold", 1), St(this, "isSceneLayer", !1), St(this, "opacity", 1), St(this, "source"), St(this, "projection"), St(this, "minLevel", 2), St(this, "maxLevel", 19), this.source = t.source, this.projection = t.projection, this.minLevel = t.minLevel ?? 2, this.maxLevel = t.maxLevel ?? 19, this._LODThreshold = t.LODThreshold ?? 1, this.opacity = t.opacity ?? 1, this.name = `Layer-${e}`, this._loader = this.createLoader(), this._rootTile = new En(), this._rootTile.matrixAutoUpdate = !0, this._rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, 1), this.add(this._rootTile), this._rootTile.updateMatrix(), this.layerId = e, this.name === "Layer-label-layer" && this.position.set(0, 0, 1);
  }
  /**
   * Get LOD threshold.
   * 获取LOD阈值
   * 
   * @returns {number} The current LOD threshold. 当前 LOD 阈值。
   */
  get LODThreshold() {
    return this._LODThreshold;
  }
  /**
   * Set LOD threshold.
   * 设置LOD阈值
   * 
   * @param value Recommended value between 1-2. Smaller values mean higher detail. 建议取值1-2之间。值越小细节越高。
   */
  set LODThreshold(e) {
    this._LODThreshold = e;
  }
  /**
   * Get the tile loader instance.
   * 获取瓦片加载器实例。
   */
  get loader() {
    return this._loader;
  }
  // ITileLayer interface implementation
  // ITileLayer 接口实现
  /**
   * Get layer enabled state.
   * 获取图层启用状态。
   */
  get enabled() {
    return this._enabled;
  }
  /**
   * Set layer enabled state.
   * 设置图层启用状态。
   * 
   * @param value True to enable, false to disable. True 启用，False 禁用。
   */
  set enabled(e) {
    this._enabled = e, this._rootTile && (this._rootTile.visible = e && this._visible);
  }
  /**
   * Get layer internal visibility.
   * 获取图层内部可见性。
   * 
   * @description 
   * Combines layer specific visibility with base class visibility.
   * 结合图层特定可见性和基类可见性。
   */
  get ivisible() {
    return this._visible && super._visible;
  }
  /**
   * Set layer internal visibility.
   * 设置图层内部可见性。
   */
  set ivisible(e) {
    this._visible = e, this._rootTile && (this._rootTile.visible = e && this._enabled);
  }
  /**
   * Update the layer.
   * 更新图层。
   * 
   * @description
   * Called every frame to update the tile tree based on the camera.
   * 每帧调用以根据相机更新瓦片树。
   * 
   * @param camera The camera used for rendering. 用于渲染的相机。
   */
  update(e) {
    if (!(!this._enabled || !this._visible)) {
      try {
        this.updateMatrixWorld(!0), this._rootTile.update({
          camera: e,
          loader: this._loader,
          minLevel: this.minLevel,
          maxLevel: this.maxLevel,
          LODThreshold: this.LODThreshold
        });
      } catch {
      }
      console.groupEnd();
    }
  }
  // @ts-ignore
  _debugTileTree() {
    this._rootTile.traverse((e) => {
      e.isTile && (e.loaded, e.visible, e.inFrustum, e.loaded);
    });
  }
  /**
   * Get LOD threshold - Missing function implementation.
   * 获取LOD阈值 - 缺失的函数实现
   * @description Control threshold for tile detail level. 控制瓦片细节级别的阈值
   * @returns {number} LOD threshold, smaller value means easier to trigger subdivision. LOD阈值，值越小越容易触发瓦片细分。
   */
  _getLODThreshold() {
    return 1;
  }
  /**
   * Get current max loaded tile level (for debugging).
   * 获取当前显示的瓦片层级（用于调试）。
   * @private
   */
  // @ts-ignore
  _getCurrentTileLevel() {
    let e = 0;
    return this._rootTile.traverse((t) => {
      t.isTile && t.loaded && (e = Math.max(e, t.z));
    }), `最大层级: ${e}`;
  }
  // 将dispose和reload改为具体实现
  /**
   * Dispose the layer and resources.
   * 销毁图层和资源。
   * 
   * @description
   * Removes the root tile and cleans up resources.
   * 移除根瓦片并清理资源。
   */
  dispose() {
    this.remove(this._rootTile), this._rootTile.reload(this._loader);
  }
  /**
   * Reload the layer data.
   * 重新加载图层数据。
   */
  reload() {
    this._rootTile.reload(this._loader);
  }
  /**
   * Set the base elevation of the layer.
   * 设置图层整体抬高。
   * 
   * @param elevation The elevation value. 抬高高度。
   */
  setElevation(e) {
    this.position.y = e, this.updateMatrix(), this.updateMatrixWorld(!0);
  }
  /**
   * Raise the layer elevation by a delta.
   * 在现有基础上增加抬高。
   * 
   * @param delta The elevation difference to add. 增加的高度。
   */
  raiseElevation(e) {
    this.position.z += e, this.updateMatrix(), this.updateMatrixWorld(!0);
  }
  /**
   * Get current layer elevation.
   * 获取当前高程。
   * 
   * @returns {number} The current elevation (y-coordinate). 当前高程（y坐标）。
   */
  getElevation() {
    return this.position.y;
  }
}
class A2 extends Os {
  constructor(e = {}) {
    super({ transparent: !0, side: ea, ...e });
  }
  setTexture(e) {
    this.map = e, this.needsUpdate = !0;
  }
  dispose() {
    const e = this.map;
    e && (e.image instanceof ImageBitmap && e.image.close(), e.dispose());
  }
}
var rt = /* @__PURE__ */ ((s) => (s[s.Unknown = 0] = "Unknown", s[s.Point = 1] = "Point", s[s.Linestring = 2] = "Linestring", s[s.Polygon = 3] = "Polygon", s))(rt || {});
class P2 {
  /**
   * 渲染矢量数据
   * @param ctx 渲染上下文
   * @param type 元素类型
   * @param feature 元素
   * @param style 样式
   * @param scale 拉伸倍数
   */
  render(e, t, r, i, o = 1) {
    switch (e.lineCap = "round", e.lineJoin = "round", (i.shadowBlur ?? 0) > 0 && (e.shadowBlur = i.shadowBlur ?? 2, e.shadowColor = i.shadowColor ?? "black", e.shadowOffsetX = i.shadowOffset ? i.shadowOffset[0] : 0, e.shadowOffsetY = i.shadowOffset ? i.shadowOffset[1] : 0), t) {
      case rt.Point:
        e.textAlign = "center", e.textBaseline = "middle", e.font = i.font ?? "14px Arial", e.fillStyle = i.fontColor ?? "white", this._renderPointText(e, r, o, i.textField ?? "name", i.fontOffset ?? [0, -8]);
        break;
      case rt.Linestring:
        this._renderLineString(e, r, o);
        break;
      case rt.Polygon:
        this._renderPolygon(e, r, o);
        break;
      default:
        console.warn(`Unknown feature type: ${t}`);
    }
    (i.fill || t === rt.Point) && (e.globalAlpha = i.fillOpacity || 0.5, e.fillStyle = i.fillColor || i.color || "#3388ff", e.fill(i.fillRule || "evenodd")), (i.stroke ?? !0) && (i.weight ?? 1) > 0 && (e.globalAlpha = i.opacity || 1, e.lineWidth = i.weight || 1, e.strokeStyle = i.color || "#3388ff", e.setLineDash(i.dashArray || []), e.stroke());
  }
  // 渲染点要素
  _renderPointText(e, t, r = 1, i = "name", o = [0, 0]) {
    const l = t.geometry;
    e.beginPath();
    for (const u of l)
      for (let f = 0; f < u.length; f++) {
        const p = u[f];
        e.arc(p.x * r, p.y * r, 2, 0, 2 * Math.PI);
      }
    const c = t.properties;
    c && c[i] && e.fillText(
      c[i],
      l[0][0].x * r + o[0],
      l[0][0].y * r + o[1]
    );
  }
  // 渲染线要素
  _renderLineString(e, t, r) {
    const i = t.geometry;
    e.beginPath();
    for (const o of i)
      for (let l = 0; l < o.length; l++) {
        const { x: c, y: u } = o[l];
        l === 0 ? e.moveTo(c * r, u * r) : e.lineTo(c * r, u * r);
      }
  }
  // 渲染面要素
  _renderPolygon(e, t, r) {
    const i = t.geometry;
    e.beginPath();
    for (let o = 0; o < i.length; o++) {
      const l = i[o];
      for (let c = 0; c < l.length; c++) {
        const { x: u, y: f } = l[c];
        c === 0 ? e.moveTo(u * r, f * r) : e.lineTo(u * r, f * r);
      }
      e.closePath();
    }
  }
}
var E2 = Object.defineProperty, C2 = (s, e, t) => e in s ? E2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, L2 = (s, e, t) => C2(s, e + "", t);
class O2 extends T1 {
  constructor() {
    super(...arguments), L2(this, "onParseEnd");
  }
  parseEnd(e) {
    this.onParseEnd && this.onParseEnd(e);
  }
}
var D2 = Object.defineProperty, I2 = (s, e, t) => e in s ? D2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ua = (s, e, t) => I2(s, typeof e != "symbol" ? e + "" : e, t);
class We {
  // 复用 IGeometryLoader 接口?
  /**
   * 注册材质加载器
   * @param loader 
   */
  static registerMaterialLoader(e) {
    this.materialLoaders.set(e.dataType, e), this.ensureAuthor(e.info);
  }
  /**
   * 注册几何体加载器
   * @param loader 
   */
  static registerGeometryLoader(e) {
    this.geometryLoaders.set(e.dataType, e), this.ensureAuthor(e.info);
  }
  /**
   * 注册网格加载器 (通常用于矢量瓦片等自带几何体和材质的数据)
   * @param loader 
   */
  static registerMeshLoader(e) {
    this.meshLoaders.set(e.dataType, e), this.ensureAuthor(e.info);
  }
  /**
   * 获取材质加载器
   * @param source 
   */
  static getMaterialLoader(e) {
    const t = this.materialLoaders.get(e.dataType);
    if (!t)
      throw new Error(`[TileLoaderFactory] Unsupported material source type: "${e.dataType}"`);
    return t;
  }
  /**
   * 获取几何体加载器
   * @param source 
   */
  static getGeometryLoader(e) {
    const t = this.geometryLoaders.get(e.dataType);
    if (!t)
      throw new Error(`[TileLoaderFactory] Unsupported geometry source type: "${e.dataType}"`);
    return t;
  }
  /**
   * 获取网格加载器
   * @param source 
   */
  static getMeshLoader(e) {
    const t = this.meshLoaders.get(e.dataType);
    if (!t)
      throw new Error(`[TileLoaderFactory] Unsupported mesh source type: "${e.dataType}"`);
    return t;
  }
  static ensureAuthor(e) {
    e.author || (e.author = "MapOrbis");
  }
}
ua(We, "manager", new O2());
ua(We, "geometryLoaders", /* @__PURE__ */ new Map());
ua(We, "materialLoaders", /* @__PURE__ */ new Map());
ua(We, "meshLoaders", /* @__PURE__ */ new Map());
class ha {
  /**
   * 计算图片裁剪区域
   * @param clipBounds 裁剪边界 [minx, miny, maxx, maxy] (0-1)
   * @param targetSize 目标尺寸
   * @returns {sx, sy, sw, sh}
   */
  static getBoundsCoord(e, t) {
    const r = Math.floor(e[0] * t), i = Math.floor(e[1] * t), o = Math.floor((e[2] - e[0]) * t), l = Math.floor((e[3] - e[1]) * t);
    return { sx: r, sy: i, sw: o, sh: l };
  }
  /**
   * 获取安全瓦片 URL 和裁剪边界
   * @description 如果请求级别超过最大级别，则回退到最大级别并计算裁剪边界
   */
  static getSafeTileUrlAndBounds(e, t, r, i) {
    if (i < e.minLevel)
      return {
        url: void 0,
        clipBounds: [0, 0, 1, 1]
      };
    if (i <= e.maxLevel)
      return {
        url: e._getUrl(t, r, i),
        clipBounds: [0, 0, 1, 1]
      };
    const o = this.getMaxLevelTileAndBounds(t, r, i, e.maxLevel), l = o.parentNO;
    return { url: e._getUrl(l.x, l.y, l.z), clipBounds: o.bounds };
  }
  static getMaxLevelTileAndBounds(e, t, r, i) {
    const o = r - i, l = { x: e >> o, y: t >> o, z: r - o }, c = Math.pow(2, o), u = Math.pow(0.5, o), f = e % c / c - 0.5 + u / 2, p = t % c / c - 0.5 + u / 2, d = new ce(f, p), g = new S1().setFromCenterAndSize(d, new ce(u, u)), y = [
      g.min.x + 0.5,
      g.min.y + 0.5,
      g.max.x + 0.5,
      g.max.y + 0.5
    ];
    return { parentNO: l, bounds: y };
  }
}
var F2 = Object.defineProperty, R2 = (s, e, t) => e in s ? F2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, B2 = (s, e, t) => R2(s, e + "", t);
class Ec {
  constructor() {
    B2(this, "info", {
      version: "1.0.0",
      description: "Abstract material loader base class"
    });
  }
  /**
   * 从数据源加载材质
   * @param context 加载上下文
   */
  async load(e) {
    const { source: t, x: r, y: i, z: o } = e, l = new Kt({
      transparent: !0
      // polygonOffset: true, // 根据需求开启
      // polygonOffsetFactor: 1,
      // polygonOffsetUnits: 1
    }), { url: c, clipBounds: u } = ha.getSafeTileUrlAndBounds(t, r, i, o);
    if (c)
      try {
        const f = await this.performLoad(c, { ...e, bounds: u });
        l.map = f, We.manager.parseEnd(c);
      } catch (f) {
        console.warn(`[AbstractMaterialLoader] Failed to load texture from ${c}`, f);
      }
    return l;
  }
  /**
   * 卸载材质资源
   * @param material 
   */
  unload(e) {
    e.map && e.map.dispose(), e.dispose();
  }
}
var U2 = Object.defineProperty, k2 = (s, e, t) => e in s ? U2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, z2 = (s, e, t) => k2(s, e + "", t);
class eP extends Ec {
  constructor() {
    super(...arguments), z2(this, "info", {
      version: "1.0.0",
      description: "Abstract loader for generating procedural canvas textures."
    });
  }
  /**
   * 重写 load 方法以支持 Canvas 特有的材质创建逻辑
   * @param context 
   */
  async load(e) {
    const t = this.createCanvasContext(256, 256);
    this.drawTile(t, e);
    const r = new Is(t.canvas.transferToImageBitmap());
    return new A2({
      transparent: !0,
      map: r,
      opacity: e.source.opacity ?? 1
    });
  }
  /**
   * 实现父类的 abstract 方法 (虽然在这里我们重写了 load，可能不会用到 performLoad，
   * 但为了满足 TypeScript 契约，我们还是需要实现它，或者抛出错误)
   */
  async performLoad(e, t) {
    throw new Error("Method not implemented.");
  }
  /**
   * 创建 Canvas 上下文并设置坐标系
   * @param width 
   * @param height 
   */
  createCanvasContext(e, t) {
    const i = new OffscreenCanvas(e, t).getContext("2d");
    if (!i)
      throw new Error("Failed to create OffscreenCanvas context");
    return i.scale(1, -1), i.translate(0, -t), i;
  }
}
class xs {
  /**
   * 连接多个类型化数组
   * @param arrays 要连接的数组列表
   * @returns 连接后的新数组
   */
  static concatenateTypedArrays(...e) {
    if (!e || e.length === 0)
      throw new Error("[GeometryHelper] No arrays provided to concatenate.");
    const t = e[0].constructor, r = e.reduce((l, c) => l + c.length, 0), i = new t(r);
    let o = 0;
    for (const l of e)
      i.set(l, o), o += l.length;
    return i;
  }
  /**
   * 计算网格法线
   * @param vertices 顶点位置数组 (x, y, z, ...)
   * @param indices 索引数组
   * @returns 法线数组
   */
  static computeVertexNormals(e, t) {
    const r = new Float32Array(e.length);
    for (let i = 0; i < t.length; i += 3) {
      const o = t[i] * 3, l = t[i + 1] * 3, c = t[i + 2] * 3, u = e[o], f = e[o + 1], p = e[o + 2], d = e[l], g = e[l + 1], y = e[l + 2], b = e[c], T = e[c + 1], x = e[c + 2], E = d - u, M = g - f, A = y - p, D = b - u, z = T - f, j = x - p, V = M * j - A * z, R = A * D - E * j, G = E * z - M * D;
      r[o] += V, r[o + 1] += R, r[o + 2] += G, r[l] += V, r[l + 1] += R, r[l + 2] += G, r[c] += V, r[c + 1] += R, r[c + 2] += G;
    }
    for (let i = 0; i < r.length; i += 3) {
      const o = r[i], l = r[i + 1], c = r[i + 2], u = Math.sqrt(o * o + l * l + c * c);
      u > 0 ? (r[i] /= u, r[i + 1] /= u, r[i + 2] /= u) : (r[i] = 0, r[i + 1] = 0, r[i + 2] = 1);
    }
    return r;
  }
  /**
   * 生成规则网格的索引
   * @param rows 行数 (Height)
   * @param cols 列数 (Width)
   */
  static generateGridIndices(e, t) {
    const r = (e - 1) * (t - 1) * 6, i = e * t > 65535 ? Uint32Array : Uint16Array, o = new i(r);
    let l = 0;
    for (let c = 0; c < e - 1; c++)
      for (let u = 0; u < t - 1; u++) {
        const f = c * t + u, p = f + 1, d = (c + 1) * t + u, g = d + 1;
        o[l++] = f, o[l++] = p, o[l++] = d, o[l++] = d, o[l++] = p, o[l++] = g;
      }
    return o;
  }
  /**
   * 从 DEM 数据生成几何数据
   * @param demData DEM 高度数据
   * @returns IGeometryData
   */
  static fromDEM(e) {
    if (e.length < 4)
      throw new Error("[GeometryHelper] DEM data too small.");
    const t = Math.floor(Math.sqrt(e.length)), r = t, i = t, o = this.generateGridIndices(i, r), l = r * i, c = new Float32Array(l * 3), u = new Float32Array(l * 2);
    let f = 0;
    for (let d = 0; d < i; d++)
      for (let g = 0; g < r; g++) {
        const y = g / (r - 1), b = d / (i - 1);
        u[f * 2] = y, u[f * 2 + 1] = b, c[f * 3] = y - 0.5, c[f * 3 + 1] = b - 0.5, c[f * 3 + 2] = e[(i - d - 1) * r + g], f++;
      }
    const p = this.computeVertexNormals(c, o);
    return {
      attributes: {
        position: { value: c, size: 3 },
        texcoord: { value: u, size: 2 },
        normal: { value: p, size: 3 }
      },
      indices: o
    };
  }
}
class N2 {
  /**
   * 为几何体添加裙边 (Skirt)
   * @description 防止地形瓦片之间出现裂缝
   * @param geometryData 原始几何体数据
   * @param skirtHeight 裙边高度 (向下延伸的距离)
   * @param externalEdgeIndices 可选的预计算边缘索引
   */
  static addSkirt(e, t, r) {
    const i = e.attributes.position.value, o = e.attributes.texcoord.value, l = e.attributes.normal.value, c = e.indices, u = r ? this.getEdgesFromIndices(r, i) : this.extractBoundaryEdges(c), f = u.length;
    if (f === 0) return e;
    const p = f * 2, d = new Float32Array(p * 3), g = new Float32Array(p * 2), y = new Float32Array(p * 3), T = i.length / 3 + p > 65535 ? Uint32Array : Uint16Array, x = c instanceof Uint32Array ? Uint32Array : T, E = new x(f * 6);
    let M = 0, A = 0;
    const D = i.length / 3;
    for (let z = 0; z < f; z++) {
      const j = u[z], V = j[0], R = j[1], G = i[V * 3], k = i[V * 3 + 1], B = i[V * 3 + 2], $ = i[R * 3], K = i[R * 3 + 1], Y = i[R * 3 + 2], ee = o[V * 2], Q = o[V * 2 + 1], Ee = o[R * 2], we = o[R * 2 + 1];
      d[M * 3 + 0] = G, d[M * 3 + 1] = k, d[M * 3 + 2] = B - t, g[M * 2 + 0] = ee, g[M * 2 + 1] = Q, y[M * 3 + 0] = 0, y[M * 3 + 1] = 0, y[M * 3 + 2] = 1;
      const be = D + M;
      M++, d[M * 3 + 0] = $, d[M * 3 + 1] = K, d[M * 3 + 2] = Y - t, g[M * 2 + 0] = Ee, g[M * 2 + 1] = we, y[M * 3 + 0] = 0, y[M * 3 + 1] = 0, y[M * 3 + 2] = 1;
      const ge = D + M;
      M++, E[A++] = V, E[A++] = ge, E[A++] = R, E[A++] = ge, E[A++] = V, E[A++] = be;
    }
    return {
      attributes: {
        position: { value: xs.concatenateTypedArrays(i, d), size: 3 },
        texcoord: { value: xs.concatenateTypedArrays(o, g), size: 2 },
        normal: { value: xs.concatenateTypedArrays(l, y), size: 3 }
      },
      indices: xs.concatenateTypedArrays(c, E)
    };
  }
  /**
   * 从网格索引中提取边界边
   * @param indices 三角形索引
   */
  static extractBoundaryEdges(e) {
    const t = [];
    for (let l = 0; l < e.length; l += 3) {
      const c = e[l], u = e[l + 1], f = e[l + 2];
      t.push([c, u], [u, f], [f, c]);
    }
    const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    for (const l of t) {
      const c = l[0] < l[1] ? `${l[0]}-${l[1]}` : `${l[1]}-${l[0]}`;
      r.set(c, (r.get(c) || 0) + 1), i.has(c) || i.set(c, l);
    }
    const o = [];
    return r.forEach((l, c) => {
      l === 1 && o.push(i.get(c));
    }), o;
  }
  /**
   * 根据预定义的边缘索引获取边列表
   * @param indices 边缘索引组
   * @param position 顶点位置 (用于排序)
   */
  static getEdgesFromIndices(e, t) {
    const r = [], i = (g, y) => Array.from(g).sort(y), o = (g) => t[g * 3], l = (g) => t[g * 3 + 1], c = i(e.west, (g, y) => l(g) - l(y)), u = i(e.east, (g, y) => l(y) - l(g)), f = i(e.south, (g, y) => o(y) - o(g)), p = i(e.north, (g, y) => o(g) - o(y)), d = (g) => {
      if (g.length > 1)
        for (let y = 0; y < g.length - 1; y++)
          r.push([g[y], g[y + 1]]);
    };
    return d(c), d(u), d(f), d(p), r;
  }
}
var H2 = Object.defineProperty, V2 = (s, e, t) => e in s ? H2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, W2 = (s, e, t) => V2(s, e + "", t);
class Cs extends Fn {
  constructor() {
    super(...arguments), W2(this, "type", "MapTileGeometry");
  }
  /**
   * 设置地形数据
   * @param data 几何体数据 (IGeometryData) 或 DEM 高度图 (Float32Array)
   * @param skirtHeight 裙边高度 (米), 默认 1000
   * @returns this
   */
  setTerrainData(e, t = 1e3) {
    let r;
    return e instanceof Float32Array ? r = xs.fromDEM(e) : r = e, t > 0 && (r = N2.addSkirt(r, t)), this.updateThreeJSAttributes(r), this.computeBoundingBox(), this.computeBoundingSphere(), this;
  }
  /**
   * 更新 Three.js BufferAttributes
   * @param geoData 
   */
  updateThreeJSAttributes(e) {
    const { attributes: t, indices: r } = e;
    this.setIndex(new mt(r, 1)), this.setAttribute("position", new mt(t.position.value, t.position.size)), this.setAttribute("uv", new mt(t.texcoord.value, t.texcoord.size)), this.setAttribute("normal", new mt(t.normal.value, t.normal.size));
  }
}
var G2 = Object.defineProperty, j2 = (s, e, t) => e in s ? G2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, An = (s, e, t) => j2(s, typeof e != "symbol" ? e + "" : e, t);
const sp = class op {
  /**
   * Create a new TerrainMeshBuilder.
   * 创建一个新的 TerrainMeshBuilder。
   * 
   * @param gridSize Grid size, must be 2^k + 1. 网格大小，必须是 2^k + 1。
   */
  constructor(e = op.DEFAULT_GRID_SIZE) {
    An(this, "gridSize"), An(this, "numTriangles"), An(this, "numParentTriangles"), An(this, "indices"), An(this, "coords"), this.gridSize = e;
    const t = e - 1;
    if (t & t - 1)
      throw new Error(`[TerrainMeshBuilder] Invalid grid size: ${e}. Expected 2^k + 1.`);
    this.numTriangles = t * t * 2 - 2, this.numParentTriangles = this.numTriangles - t * t, this.indices = new Uint32Array(this.gridSize * this.gridSize), this.coords = new Uint16Array(this.numTriangles * 4), this.precomputeCoords(t);
  }
  /**
   * Precompute triangle coordinates.
   * 预计算三角形坐标。
   * @param tileSize Tile size (gridSize - 1)
   */
  precomputeCoords(e) {
    for (let t = 0; t < this.numTriangles; t++) {
      let r = t + 2, i = 0, o = 0, l = 0, c = 0, u = 0, f = 0;
      for (r & 1 ? l = c = u = e : i = o = f = e; (r >>= 1) > 1; ) {
        const d = i + l >> 1, g = o + c >> 1;
        r & 1 ? (l = i, c = o, i = u, o = f) : (i = l, o = c, l = u, c = f), u = d, f = g;
      }
      const p = t * 4;
      this.coords[p + 0] = i, this.coords[p + 1] = o, this.coords[p + 2] = l, this.coords[p + 3] = c;
    }
  }
  /**
   * Process terrain data to generate mesh.
   * 处理地形数据以生成网格。
   * 
   * @param terrainData Terrain height data. 地形高度数据。
   * @param maxError Maximum allowed error. 最大允许误差。
   * @returns Geometry data. 几何体数据。
   */
  build(e, t = 0) {
    const r = this.calculateErrors(e), i = this.generateGeometry(r, t), o = i._vertices, l = i.indices, c = o.length / 2, u = new Float32Array(c * 3), f = new Float32Array(c * 2), p = new Float32Array(c * 3), d = this.gridSize;
    for (let g = 0; g < c; g++) {
      const y = o[2 * g], b = o[2 * g + 1];
      u[3 * g + 0] = y, u[3 * g + 1] = b, u[3 * g + 2] = e[b * d + y], f[2 * g + 0] = y / (d - 1), f[2 * g + 1] = b / (d - 1);
    }
    return {
      attributes: {
        position: { value: u, size: 3 },
        texcoord: { value: f, size: 2 },
        normal: { value: p, size: 3 }
      },
      indices: l
    };
  }
  /**
   * Calculate errors for all triangles.
   * 计算所有三角形的误差。
   */
  calculateErrors(e) {
    const { gridSize: t, numTriangles: r, numParentTriangles: i, coords: o } = this, l = new Float32Array(e.length);
    for (let c = r - 1; c >= 0; c--) {
      const u = c * 4, f = o[u + 0], p = o[u + 1], d = o[u + 2], g = o[u + 3], y = f + d >> 1, b = p + g >> 1, T = y + b - p, x = b + y - f, E = (e[p * t + f] + e[g * t + d]) / 2, M = b * t + y, A = Math.abs(E - e[M]);
      if (l[M] = Math.max(l[M], A), c < i) {
        const D = (p + x >> 1) * t + (f + T >> 1), z = (g + x >> 1) * t + (d + T >> 1);
        l[M] = Math.max(l[M], l[D], l[z]);
      }
    }
    return l;
  }
  /**
   * Generate geometry from error map.
   * 从误差图生成几何体。
   */
  generateGeometry(e, t) {
    const { gridSize: r, indices: i } = this;
    i.fill(0);
    let o = 0, l = 0;
    const c = r - 1, u = (y, b, T, x, E, M) => {
      const A = y + T >> 1, D = b + x >> 1;
      if (Math.abs(y - E) + Math.abs(b - M) > 1 && e[D * r + A] > t)
        u(E, M, y, b, A, D), u(T, x, E, M, A, D);
      else {
        const z = b * r + y, j = x * r + T, V = M * r + E;
        i[z] === 0 && (i[z] = ++o), i[j] === 0 && (i[j] = ++o), i[V] === 0 && (i[V] = ++o), l++;
      }
    };
    u(0, 0, c, c, c, 0), u(c, c, 0, 0, 0, c);
    const f = new Uint16Array(o * 2), p = new Uint32Array(l * 3);
    let d = 0;
    const g = (y, b, T, x, E, M) => {
      const A = y + T >> 1, D = b + x >> 1;
      if (Math.abs(y - E) + Math.abs(b - M) > 1 && e[D * r + A] > t)
        g(E, M, y, b, A, D), g(T, x, E, M, A, D);
      else {
        const z = i[b * r + y] - 1, j = i[x * r + T] - 1, V = i[M * r + E] - 1;
        f[2 * z] = y, f[2 * z + 1] = b, f[2 * j] = T, f[2 * j + 1] = x, f[2 * V] = E, f[2 * V + 1] = M, p[d++] = z, p[d++] = j, p[d++] = V;
      }
    };
    return g(0, 0, c, c, c, 0), g(c, c, 0, 0, 0, c), {
      attributes: {
        position: { value: new Float32Array(0), size: 3 },
        texcoord: { value: new Float32Array(0), size: 2 },
        normal: { value: new Float32Array(0), size: 3 }
      },
      indices: p,
      // @ts-ignore: Internal property to pass out vertices for build() to use
      _vertices: f
    };
  }
};
An(sp, "DEFAULT_GRID_SIZE", 257);
let tP = sp;
var $2 = Object.defineProperty, X2 = (s, e, t) => e in s ? $2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Y2 = (s, e, t) => X2(s, e + "", t);
class ap {
  constructor() {
    Y2(this, "info", {
      version: "1.0.0",
      description: "Abstract geometry loader base class"
    });
  }
  /**
   * 从数据源加载瓦片几何数据
   * @param context 加载上下文
   * @returns Promise<MapTileGeometry>
   */
  async load(e) {
    const { source: t, x: r, y: i, z: o } = e, { url: l, clipBounds: c } = ha.getSafeTileUrlAndBounds(t, r, i, o);
    if (!l)
      return new Cs();
    const u = await this.performLoad(l, { ...e, bounds: c });
    return We.manager.parseEnd(l), u;
  }
}
const lp = '(function(){"use strict";var ee=Object.defineProperty,re=(B,d,U)=>d in B?ee(B,d,{enumerable:!0,configurable:!0,writable:!0,value:U}):B[d]=U,j=(B,d,U)=>re(B,typeof d!="symbol"?d+"":d,U);const K=class P{constructor(d=P.DEFAULT_GRID_SIZE){j(this,"gridSize"),j(this,"numTriangles"),j(this,"numParentTriangles"),j(this,"indices"),j(this,"coords"),this.gridSize=d;const U=d-1;if(U&U-1)throw new Error(`[TerrainMeshBuilder] Invalid grid size: ${d}. Expected 2^k + 1.`);this.numTriangles=U*U*2-2,this.numParentTriangles=this.numTriangles-U*U,this.indices=new Uint32Array(this.gridSize*this.gridSize),this.coords=new Uint16Array(this.numTriangles*4),this.precomputeCoords(U)}precomputeCoords(d){for(let U=0;U<this.numTriangles;U++){let F=U+2,a=0,e=0,r=0,f=0,n=0,i=0;for(F&1?r=f=n=d:a=e=i=d;(F>>=1)>1;){const t=a+r>>1,s=e+f>>1;F&1?(r=a,f=e,a=n,e=i):(a=r,e=f,r=n,f=i),n=t,i=s}const m=U*4;this.coords[m+0]=a,this.coords[m+1]=e,this.coords[m+2]=r,this.coords[m+3]=f}}build(d,U=0){const F=this.calculateErrors(d),a=this.generateGeometry(F,U),e=a._vertices,r=a.indices,f=e.length/2,n=new Float32Array(f*3),i=new Float32Array(f*2),m=new Float32Array(f*3),t=this.gridSize;for(let s=0;s<f;s++){const c=e[2*s],o=e[2*s+1];n[3*s+0]=c,n[3*s+1]=o,n[3*s+2]=d[o*t+c],i[2*s+0]=c/(t-1),i[2*s+1]=o/(t-1)}return{attributes:{position:{value:n,size:3},texcoord:{value:i,size:2},normal:{value:m,size:3}},indices:r}}calculateErrors(d){const{gridSize:U,numTriangles:F,numParentTriangles:a,coords:e}=this,r=new Float32Array(d.length);for(let f=F-1;f>=0;f--){const n=f*4,i=e[n+0],m=e[n+1],t=e[n+2],s=e[n+3],c=i+t>>1,o=m+s>>1,h=c+o-m,v=o+c-i,u=(d[m*U+i]+d[s*U+t])/2,l=o*U+c,g=Math.abs(u-d[l]);if(r[l]=Math.max(r[l],g),f<a){const x=(m+v>>1)*U+(i+h>>1),k=(s+v>>1)*U+(t+h>>1);r[l]=Math.max(r[l],r[x],r[k])}}return r}generateGeometry(d,U){const{gridSize:F,indices:a}=this;a.fill(0);let e=0,r=0;const f=F-1,n=(c,o,h,v,u,l)=>{const g=c+h>>1,x=o+v>>1;if(Math.abs(c-u)+Math.abs(o-l)>1&&d[x*F+g]>U)n(u,l,c,o,g,x),n(h,v,u,l,g,x);else{const k=o*F+c,p=v*F+h,y=l*F+u;a[k]===0&&(a[k]=++e),a[p]===0&&(a[p]=++e),a[y]===0&&(a[y]=++e),r++}};n(0,0,f,f,f,0),n(f,f,0,0,0,f);const i=new Uint16Array(e*2),m=new Uint32Array(r*3);let t=0;const s=(c,o,h,v,u,l)=>{const g=c+h>>1,x=o+v>>1;if(Math.abs(c-u)+Math.abs(o-l)>1&&d[x*F+g]>U)s(u,l,c,o,g,x),s(h,v,u,l,g,x);else{const k=a[o*F+c]-1,p=a[v*F+h]-1,y=a[l*F+u]-1;i[2*k]=c,i[2*k+1]=o,i[2*p]=h,i[2*p+1]=v,i[2*y]=u,i[2*y+1]=l,m[t++]=k,m[t++]=p,m[t++]=y}};return s(0,0,f,f,f,0),s(f,f,0,0,0,f),{attributes:{position:{value:new Float32Array(0),size:3},texcoord:{value:new Float32Array(0),size:2},normal:{value:new Float32Array(0),size:3}},indices:m,_vertices:i}}};j(K,"DEFAULT_GRID_SIZE",257);let ie=K;const ne=(function(){var B={};B.defaultNoDataValue=-34027999387901484e22,B.decode=function(r,f){f=f||{};var n=f.encodedMaskData||f.encodedMaskData===null,i=a(r,f.inputOffset||0,n),m=f.noDataValue!==null?f.noDataValue:B.defaultNoDataValue,t=d(i,f.pixelType||Float32Array,f.encodedMaskData,m,f.returnMask),s={width:i.width,height:i.height,pixelData:t.resultPixels,minValue:t.minValue,maxValue:i.pixels.maxValue,noDataValue:m};return t.resultMask&&(s.maskData=t.resultMask),f.returnEncodedMask&&i.mask&&(s.encodedMaskData=i.mask.bitset?i.mask.bitset:null),f.returnFileInfo&&(s.fileInfo=U(i),f.computeUsedBitDepths&&(s.fileInfo.bitDepths=F(i))),s};var d=function(r,f,n,i,m){var t=0,s=r.pixels.numBlocksX,c=r.pixels.numBlocksY,o=Math.floor(r.width/s),h=Math.floor(r.height/c),v=2*r.maxZError,u=Number.MAX_VALUE,l;n=n||(r.mask?r.mask.bitset:null);var g,x;g=new f(r.width*r.height),m&&n&&(x=new Uint8Array(r.width*r.height));for(var k=new Float32Array(o*h),p,y,M=0;M<=c;M++){var S=M!==c?h:r.height%c;if(S!==0)for(var I=0;I<=s;I++){var w=I!==s?o:r.width%s;if(w!==0){var D=M*r.width*h+I*o,V=r.width-w,A=r.pixels.blocks[t],L,T,b;A.encoding<2?(A.encoding===0?L=A.rawData:(e(A.stuffedData,A.bitsPerPixel,A.numValidPixels,A.offset,v,k,r.pixels.maxValue),L=k),T=0):A.encoding===2?b=0:b=A.offset;var z;if(n)for(y=0;y<S;y++){for(D&7&&(z=n[D>>3],z<<=D&7),p=0;p<w;p++)D&7||(z=n[D>>3]),z&128?(x&&(x[D]=1),l=A.encoding<2?L[T++]:b,u=u>l?l:u,g[D++]=l):(x&&(x[D]=0),g[D++]=i),z<<=1;D+=V}else if(A.encoding<2)for(y=0;y<S;y++){for(p=0;p<w;p++)l=L[T++],u=u>l?l:u,g[D++]=l;D+=V}else for(u=u>b?b:u,y=0;y<S;y++){for(p=0;p<w;p++)g[D++]=b;D+=V}if(A.encoding===1&&T!==A.numValidPixels)throw"Block and Mask do not match";t++}}}return{resultPixels:g,resultMask:x,minValue:u}},U=function(r){return{fileIdentifierString:r.fileIdentifierString,fileVersion:r.fileVersion,imageType:r.imageType,height:r.height,width:r.width,maxZError:r.maxZError,eofOffset:r.eofOffset,mask:r.mask?{numBlocksX:r.mask.numBlocksX,numBlocksY:r.mask.numBlocksY,numBytes:r.mask.numBytes,maxValue:r.mask.maxValue}:null,pixels:{numBlocksX:r.pixels.numBlocksX,numBlocksY:r.pixels.numBlocksY,numBytes:r.pixels.numBytes,maxValue:r.pixels.maxValue,noDataValue:r.noDataValue}}},F=function(r){for(var f=r.pixels.numBlocksX*r.pixels.numBlocksY,n={},i=0;i<f;i++){var m=r.pixels.blocks[i];m.encoding===0?n.float32=!0:m.encoding===1?n[m.bitsPerPixel]=!0:n[0]=!0}return Object.keys(n)},a=function(r,f,n){var i={},m=new Uint8Array(r,f,10);if(i.fileIdentifierString=String.fromCharCode.apply(null,m),i.fileIdentifierString.trim()!=="CntZImage")throw"Unexpected file identifier string: "+i.fileIdentifierString;f+=10;var t=new DataView(r,f,24);if(i.fileVersion=t.getInt32(0,!0),i.imageType=t.getInt32(4,!0),i.height=t.getUint32(8,!0),i.width=t.getUint32(12,!0),i.maxZError=t.getFloat64(16,!0),f+=24,!n)if(t=new DataView(r,f,16),i.mask={},i.mask.numBlocksY=t.getUint32(0,!0),i.mask.numBlocksX=t.getUint32(4,!0),i.mask.numBytes=t.getUint32(8,!0),i.mask.maxValue=t.getFloat32(12,!0),f+=16,i.mask.numBytes>0){var s=new Uint8Array(Math.ceil(i.width*i.height/8));t=new DataView(r,f,i.mask.numBytes);var c=t.getInt16(0,!0),o=2,h=0;do{if(c>0)for(;c--;)s[h++]=t.getUint8(o++);else{var v=t.getUint8(o++);for(c=-c;c--;)s[h++]=v}c=t.getInt16(o,!0),o+=2}while(o<i.mask.numBytes);if(c!==-32768||h<s.length)throw"Unexpected end of mask RLE encoding";i.mask.bitset=s,f+=i.mask.numBytes}else(i.mask.numBytes|i.mask.numBlocksY|i.mask.maxValue)===0&&(i.mask.bitset=new Uint8Array(Math.ceil(i.width*i.height/8)));t=new DataView(r,f,16),i.pixels={},i.pixels.numBlocksY=t.getUint32(0,!0),i.pixels.numBlocksX=t.getUint32(4,!0),i.pixels.numBytes=t.getUint32(8,!0),i.pixels.maxValue=t.getFloat32(12,!0),f+=16;var u=i.pixels.numBlocksX,l=i.pixels.numBlocksY,g=u+(i.width%u>0?1:0),x=l+(i.height%l>0?1:0);i.pixels.blocks=new Array(g*x);for(var k=0,p=0;p<x;p++)for(var y=0;y<g;y++){var M=0,S=r.byteLength-f;t=new DataView(r,f,Math.min(10,S));var I={};i.pixels.blocks[k++]=I;var w=t.getUint8(0);if(M++,I.encoding=w&63,I.encoding>3)throw"Invalid block encoding ("+I.encoding+")";if(I.encoding===2){f++;continue}if(w!==0&&w!==2){if(w>>=6,I.offsetType=w,w===2)I.offset=t.getInt8(1),M++;else if(w===1)I.offset=t.getInt16(1,!0),M+=2;else if(w===0)I.offset=t.getFloat32(1,!0),M+=4;else throw"Invalid block offset type";if(I.encoding===1)if(w=t.getUint8(M),M++,I.bitsPerPixel=w&63,w>>=6,I.numValidPixelsType=w,w===2)I.numValidPixels=t.getUint8(M),M++;else if(w===1)I.numValidPixels=t.getUint16(M,!0),M+=2;else if(w===0)I.numValidPixels=t.getUint32(M,!0),M+=4;else throw"Invalid valid pixel count type"}if(f+=M,I.encoding!==3){var D,V;if(I.encoding===0){var A=(i.pixels.numBytes-1)/4;if(A!==Math.floor(A))throw"uncompressed block has invalid length";D=new ArrayBuffer(A*4),V=new Uint8Array(D),V.set(new Uint8Array(r,f,A*4));var L=new Float32Array(D);I.rawData=L,f+=A*4}else if(I.encoding===1){var T=Math.ceil(I.numValidPixels*I.bitsPerPixel/8),b=Math.ceil(T/4);D=new ArrayBuffer(b*4),V=new Uint8Array(D),V.set(new Uint8Array(r,f,T)),I.stuffedData=new Uint32Array(D),f+=T}}}return i.eofOffset=f,i},e=function(r,f,n,i,m,t,s){var c=(1<<f)-1,o=0,h,v=0,u,l,g=Math.ceil((s-i)/m),x=r.length*4-Math.ceil(f*n/8);for(r[r.length-1]<<=8*x,h=0;h<n;h++){if(v===0&&(l=r[o++],v=32),v>=f)u=l>>>v-f&c,v-=f;else{var k=f-v;u=(l&c)<<k&c,l=r[o++],v=32-k,u+=l>>>v}t[h]=u<g?i+u*m:s}return t};return B})(),te=(function(){var B={unstuff:function(a,e,r,f,n,i,m,t){var s=(1<<r)-1,c=0,o,h=0,v,u,l,g,x=a.length*4-Math.ceil(r*f/8);if(a[a.length-1]<<=8*x,n)for(o=0;o<f;o++)h===0&&(u=a[c++],h=32),h>=r?(v=u>>>h-r&s,h-=r):(l=r-h,v=(u&s)<<l&s,u=a[c++],h=32-l,v+=u>>>h),e[o]=n[v];else for(g=Math.ceil((t-i)/m),o=0;o<f;o++)h===0&&(u=a[c++],h=32),h>=r?(v=u>>>h-r&s,h-=r):(l=r-h,v=(u&s)<<l&s,u=a[c++],h=32-l,v+=u>>>h),e[o]=v<g?i+v*m:t},unstuffLUT:function(a,e,r,f,n,i){var m=(1<<e)-1,t=0,s=0,c=0,o=0,h=0,v,u=[],l=a.length*4-Math.ceil(e*r/8);a[a.length-1]<<=8*l;var g=Math.ceil((i-f)/n);for(s=0;s<r;s++)o===0&&(v=a[t++],o=32),o>=e?(h=v>>>o-e&m,o-=e):(c=e-o,h=(v&m)<<c&m,v=a[t++],o=32-c,h+=v>>>o),u[s]=h<g?f+h*n:i;return u.unshift(f),u},unstuff2:function(a,e,r,f,n,i,m,t){var s=(1<<r)-1,c=0,o,h=0,v=0,u,l,g;if(n)for(o=0;o<f;o++)h===0&&(l=a[c++],h=32,v=0),h>=r?(u=l>>>v&s,h-=r,v+=r):(g=r-h,u=l>>>v&s,l=a[c++],h=32-g,u|=(l&(1<<g)-1)<<r-g,v=g),e[o]=n[u];else{var x=Math.ceil((t-i)/m);for(o=0;o<f;o++)h===0&&(l=a[c++],h=32,v=0),h>=r?(u=l>>>v&s,h-=r,v+=r):(g=r-h,u=l>>>v&s,l=a[c++],h=32-g,u|=(l&(1<<g)-1)<<r-g,v=g),e[o]=u<x?i+u*m:t}return e},unstuffLUT2:function(a,e,r,f,n,i){var m=(1<<e)-1,t=0,s=0,c=0,o=0,h=0,v=0,u,l=[],g=Math.ceil((i-f)/n);for(s=0;s<r;s++)o===0&&(u=a[t++],o=32,v=0),o>=e?(h=u>>>v&m,o-=e,v+=e):(c=e-o,h=u>>>v&m,u=a[t++],o=32-c,h|=(u&(1<<c)-1)<<e-c,v=c),l[s]=h<g?f+h*n:i;return l.unshift(f),l},originalUnstuff:function(a,e,r,f){var n=(1<<r)-1,i=0,m,t=0,s,c,o,h=a.length*4-Math.ceil(r*f/8);for(a[a.length-1]<<=8*h,m=0;m<f;m++)t===0&&(c=a[i++],t=32),t>=r?(s=c>>>t-r&n,t-=r):(o=r-t,s=(c&n)<<o&n,c=a[i++],t=32-o,s+=c>>>t),e[m]=s;return e},originalUnstuff2:function(a,e,r,f){var n=(1<<r)-1,i=0,m,t=0,s=0,c,o,h;for(m=0;m<f;m++)t===0&&(o=a[i++],t=32,s=0),t>=r?(c=o>>>s&n,t-=r,s+=r):(h=r-t,c=o>>>s&n,o=a[i++],t=32-h,c|=(o&(1<<h)-1)<<r-h,s=h),e[m]=c;return e}},d={HUFFMAN_LUT_BITS_MAX:12,computeChecksumFletcher32:function(a){for(var e=65535,r=65535,f=a.length,n=Math.floor(f/2),i=0;n;){var m=n>=359?359:n;n-=m;do e+=a[i++]<<8,r+=e+=a[i++];while(--m);e=(e&65535)+(e>>>16),r=(r&65535)+(r>>>16)}return f&1&&(r+=e+=a[i]<<8),e=(e&65535)+(e>>>16),r=(r&65535)+(r>>>16),(r<<16|e)>>>0},readHeaderInfo:function(a,e){var r=e.ptr,f=new Uint8Array(a,r,6),n={};if(n.fileIdentifierString=String.fromCharCode.apply(null,f),n.fileIdentifierString.lastIndexOf("Lerc2",0)!==0)throw"Unexpected file identifier string (expect Lerc2 ): "+n.fileIdentifierString;r+=6;var i=new DataView(a,r,8),m=i.getInt32(0,!0);n.fileVersion=m,r+=4,m>=3&&(n.checksum=i.getUint32(4,!0),r+=4),i=new DataView(a,r,12),n.height=i.getUint32(0,!0),n.width=i.getUint32(4,!0),r+=8,m>=4?(n.numDims=i.getUint32(8,!0),r+=4):n.numDims=1,i=new DataView(a,r,40),n.numValidPixel=i.getUint32(0,!0),n.microBlockSize=i.getInt32(4,!0),n.blobSize=i.getInt32(8,!0),n.imageType=i.getInt32(12,!0),n.maxZError=i.getFloat64(16,!0),n.zMin=i.getFloat64(24,!0),n.zMax=i.getFloat64(32,!0),r+=40,e.headerInfo=n,e.ptr=r;var t,s;if(m>=3&&(s=m>=4?52:48,t=this.computeChecksumFletcher32(new Uint8Array(a,r-s,n.blobSize-14)),t!==n.checksum))throw"Checksum failed.";return!0},checkMinMaxRanges:function(a,e){var r=e.headerInfo,f=this.getDataTypeArray(r.imageType),n=r.numDims*this.getDataTypeSize(r.imageType),i=this.readSubArray(a,e.ptr,f,n),m=this.readSubArray(a,e.ptr+n,f,n);e.ptr+=2*n;var t,s=!0;for(t=0;t<r.numDims;t++)if(i[t]!==m[t]){s=!1;break}return r.minValues=i,r.maxValues=m,s},readSubArray:function(a,e,r,f){var n;if(r===Uint8Array)n=new Uint8Array(a,e,f);else{var i=new ArrayBuffer(f),m=new Uint8Array(i);m.set(new Uint8Array(a,e,f)),n=new r(i)}return n},readMask:function(a,e){var r=e.ptr,f=e.headerInfo,n=f.width*f.height,i=f.numValidPixel,m=new DataView(a,r,4),t={};if(t.numBytes=m.getUint32(0,!0),r+=4,(i===0||n===i)&&t.numBytes!==0)throw"invalid mask";var s,c;if(i===0)s=new Uint8Array(Math.ceil(n/8)),t.bitset=s,c=new Uint8Array(n),e.pixels.resultMask=c,r+=t.numBytes;else if(t.numBytes>0){s=new Uint8Array(Math.ceil(n/8)),m=new DataView(a,r,t.numBytes);var o=m.getInt16(0,!0),h=2,v=0,u=0;do{if(o>0)for(;o--;)s[v++]=m.getUint8(h++);else for(u=m.getUint8(h++),o=-o;o--;)s[v++]=u;o=m.getInt16(h,!0),h+=2}while(h<t.numBytes);if(o!==-32768||v<s.length)throw"Unexpected end of mask RLE encoding";c=new Uint8Array(n);var l=0,g=0;for(g=0;g<n;g++)g&7?(l=s[g>>3],l<<=g&7):l=s[g>>3],l&128&&(c[g]=1);e.pixels.resultMask=c,t.bitset=s,r+=t.numBytes}return e.ptr=r,e.mask=t,!0},readDataOneSweep:function(a,e,r,f){var n=e.ptr,i=e.headerInfo,m=i.numDims,t=i.width*i.height,s=i.imageType,c=i.numValidPixel*d.getDataTypeSize(s)*m,o,h=e.pixels.resultMask;if(r===Uint8Array)o=new Uint8Array(a,n,c);else{var v=new ArrayBuffer(c),u=new Uint8Array(v);u.set(new Uint8Array(a,n,c)),o=new r(v)}if(o.length===t*m)f?e.pixels.resultPixels=d.swapDimensionOrder(o,t,m,r,!0):e.pixels.resultPixels=o;else{e.pixels.resultPixels=new r(t*m);var l=0,g=0,x=0,k=0;if(m>1){if(f){for(g=0;g<t;g++)if(h[g])for(k=g,x=0;x<m;x++,k+=t)e.pixels.resultPixels[k]=o[l++]}else for(g=0;g<t;g++)if(h[g])for(k=g*m,x=0;x<m;x++)e.pixels.resultPixels[k+x]=o[l++]}else for(g=0;g<t;g++)h[g]&&(e.pixels.resultPixels[g]=o[l++])}return n+=c,e.ptr=n,!0},readHuffmanTree:function(a,e){var r=this.HUFFMAN_LUT_BITS_MAX,f=new DataView(a,e.ptr,16);e.ptr+=16;var n=f.getInt32(0,!0);if(n<2)throw"unsupported Huffman version";var i=f.getInt32(4,!0),m=f.getInt32(8,!0),t=f.getInt32(12,!0);if(m>=t)return!1;var s=new Uint32Array(t-m);d.decodeBits(a,e,s);var c=[],o,h,v,u;for(o=m;o<t;o++)h=o-(o<i?0:i),c[h]={first:s[o-m],second:null};var l=a.byteLength-e.ptr,g=Math.ceil(l/4),x=new ArrayBuffer(g*4),k=new Uint8Array(x);k.set(new Uint8Array(a,e.ptr,l));var p=new Uint32Array(x),y=0,M,S=0;for(M=p[0],o=m;o<t;o++)h=o-(o<i?0:i),u=c[h].first,u>0&&(c[h].second=M<<y>>>32-u,32-y>=u?(y+=u,y===32&&(y=0,S++,M=p[S])):(y+=u-32,S++,M=p[S],c[h].second|=M>>>32-y));var I=0,w=0,D=new U;for(o=0;o<c.length;o++)c[o]!==void 0&&(I=Math.max(I,c[o].first));I>=r?w=r:w=I;var V=[],A,L,T,b,z,C;for(o=m;o<t;o++)if(h=o-(o<i?0:i),u=c[h].first,u>0)if(A=[u,h],u<=w)for(L=c[h].second<<w-u,T=1<<w-u,v=0;v<T;v++)V[L|v]=A;else for(L=c[h].second,C=D,b=u-1;b>=0;b--)z=L>>>b&1,z?(C.right||(C.right=new U),C=C.right):(C.left||(C.left=new U),C=C.left),b===0&&!C.val&&(C.val=A[1]);return{decodeLut:V,numBitsLUTQick:w,numBitsLUT:I,tree:D,stuffedData:p,srcPtr:S,bitPos:y}},readHuffman:function(a,e,r,f){var n=e.headerInfo,i=n.numDims,m=e.headerInfo.height,t=e.headerInfo.width,s=t*m,c=this.readHuffmanTree(a,e),o=c.decodeLut,h=c.tree,v=c.stuffedData,u=c.srcPtr,l=c.bitPos,g=c.numBitsLUTQick,x=c.numBitsLUT,k=e.headerInfo.imageType===0?128:0,p,y,M,S=e.pixels.resultMask,I,w,D,V,A,L,T,b=0;l>0&&(u++,l=0);var z=v[u],C=e.encodeMode===1,N=new r(s*i),E=N,X;if(i<2||C){for(X=0;X<i;X++)if(i>1&&(E=new r(N.buffer,s*X,s),b=0),e.headerInfo.numValidPixel===t*m)for(L=0,V=0;V<m;V++)for(A=0;A<t;A++,L++){if(y=0,I=z<<l>>>32-g,w=I,32-l<g&&(I|=v[u+1]>>>64-l-g,w=I),o[w])y=o[w][1],l+=o[w][0];else for(I=z<<l>>>32-x,w=I,32-l<x&&(I|=v[u+1]>>>64-l-x,w=I),p=h,T=0;T<x;T++)if(D=I>>>x-T-1&1,p=D?p.right:p.left,!(p.left||p.right)){y=p.val,l=l+T+1;break}l>=32&&(l-=32,u++,z=v[u]),M=y-k,C?(A>0?M+=b:V>0?M+=E[L-t]:M+=b,M&=255,E[L]=M,b=M):E[L]=M}else for(L=0,V=0;V<m;V++)for(A=0;A<t;A++,L++)if(S[L]){if(y=0,I=z<<l>>>32-g,w=I,32-l<g&&(I|=v[u+1]>>>64-l-g,w=I),o[w])y=o[w][1],l+=o[w][0];else for(I=z<<l>>>32-x,w=I,32-l<x&&(I|=v[u+1]>>>64-l-x,w=I),p=h,T=0;T<x;T++)if(D=I>>>x-T-1&1,p=D?p.right:p.left,!(p.left||p.right)){y=p.val,l=l+T+1;break}l>=32&&(l-=32,u++,z=v[u]),M=y-k,C?(A>0&&S[L-1]?M+=b:V>0&&S[L-t]?M+=E[L-t]:M+=b,M&=255,E[L]=M,b=M):E[L]=M}}else for(L=0,V=0;V<m;V++)for(A=0;A<t;A++)if(L=V*t+A,!S||S[L])for(X=0;X<i;X++,L+=s){if(y=0,I=z<<l>>>32-g,w=I,32-l<g&&(I|=v[u+1]>>>64-l-g,w=I),o[w])y=o[w][1],l+=o[w][0];else for(I=z<<l>>>32-x,w=I,32-l<x&&(I|=v[u+1]>>>64-l-x,w=I),p=h,T=0;T<x;T++)if(D=I>>>x-T-1&1,p=D?p.right:p.left,!(p.left||p.right)){y=p.val,l=l+T+1;break}l>=32&&(l-=32,u++,z=v[u]),M=y-k,E[L]=M}e.ptr=e.ptr+(u+1)*4+(l>0?4:0),e.pixels.resultPixels=N,i>1&&!f&&(e.pixels.resultPixels=d.swapDimensionOrder(N,s,i,r))},decodeBits:function(a,e,r,f,n){{var i=e.headerInfo,m=i.fileVersion,t=0,s=a.byteLength-e.ptr>=5?5:a.byteLength-e.ptr,c=new DataView(a,e.ptr,s),o=c.getUint8(0);t++;var h=o>>6,v=h===0?4:3-h,u=(o&32)>0,l=o&31,g=0;if(v===1)g=c.getUint8(t),t++;else if(v===2)g=c.getUint16(t,!0),t+=2;else if(v===4)g=c.getUint32(t,!0),t+=4;else throw"Invalid valid pixel count type";var x=2*i.maxZError,k,p,y,M,S,I,w,D,V,A=i.numDims>1?i.maxValues[n]:i.zMax;if(u){for(e.counter.lut++,D=c.getUint8(t),t++,M=Math.ceil((D-1)*l/8),S=Math.ceil(M/4),p=new ArrayBuffer(S*4),y=new Uint8Array(p),e.ptr+=t,y.set(new Uint8Array(a,e.ptr,M)),w=new Uint32Array(p),e.ptr+=M,V=0;D-1>>>V;)V++;M=Math.ceil(g*V/8),S=Math.ceil(M/4),p=new ArrayBuffer(S*4),y=new Uint8Array(p),y.set(new Uint8Array(a,e.ptr,M)),k=new Uint32Array(p),e.ptr+=M,m>=3?I=B.unstuffLUT2(w,l,D-1,f,x,A):I=B.unstuffLUT(w,l,D-1,f,x,A),m>=3?B.unstuff2(k,r,V,g,I):B.unstuff(k,r,V,g,I)}else e.counter.bitstuffer++,V=l,e.ptr+=t,V>0&&(M=Math.ceil(g*V/8),S=Math.ceil(M/4),p=new ArrayBuffer(S*4),y=new Uint8Array(p),y.set(new Uint8Array(a,e.ptr,M)),k=new Uint32Array(p),e.ptr+=M,m>=3?f==null?B.originalUnstuff2(k,r,V,g):B.unstuff2(k,r,V,g,!1,f,x,A):f==null?B.originalUnstuff(k,r,V,g):B.unstuff(k,r,V,g,!1,f,x,A))}},readTiles:function(a,e,r,f){var n=e.headerInfo,i=n.width,m=n.height,t=i*m,s=n.microBlockSize,c=n.imageType,o=d.getDataTypeSize(c),h=Math.ceil(i/s),v=Math.ceil(m/s);e.pixels.numBlocksY=v,e.pixels.numBlocksX=h,e.pixels.ptr=0;var u=0,l=0,g=0,x=0,k=0,p=0,y=0,M=0,S=0,I=0,w=0,D=0,V=0,A=0,L=0,T=0,b,z,C,N,E,X,Q=new r(s*s),le=m%s||s,oe=i%s||s,$,R,q=n.numDims,H,Y=e.pixels.resultMask,O=e.pixels.resultPixels,ue=n.fileVersion,W=ue>=5?14:15,_,J=n.zMax,Z;for(g=0;g<v;g++)for(k=g!==v-1?s:le,x=0;x<h;x++)for(p=x!==h-1?s:oe,w=g*i*s+x*s,D=i-p,H=0;H<q;H++){if(q>1?(Z=O,w=g*i*s+x*s,O=new r(e.pixels.resultPixels.buffer,t*H*o,t),J=n.maxValues[H]):Z=null,y=a.byteLength-e.ptr,b=new DataView(a,e.ptr,Math.min(10,y)),z={},T=0,M=b.getUint8(0),T++,_=n.fileVersion>=5?M&4:0,S=M>>6&255,I=M>>2&W,I!==(x*s>>3&W)||_&&H===0)throw"integrity issue";if(X=M&3,X>3)throw e.ptr+=T,"Invalid block encoding ("+X+")";if(X===2){if(_)if(Y)for(u=0;u<k;u++)for(l=0;l<p;l++)Y[w]&&(O[w]=Z[w]),w++;else for(u=0;u<k;u++)for(l=0;l<p;l++)O[w]=Z[w],w++;e.counter.constant++,e.ptr+=T;continue}else if(X===0){if(_)throw"integrity issue";if(e.counter.uncompressed++,e.ptr+=T,V=k*p*o,A=a.byteLength-e.ptr,V=V<A?V:A,C=new ArrayBuffer(V%o===0?V:V+o-V%o),N=new Uint8Array(C),N.set(new Uint8Array(a,e.ptr,V)),E=new r(C),L=0,Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=E[L++]),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w++]=E[L++];w+=D}e.ptr+=L*o}else if($=d.getDataTypeUsed(_&&c<6?4:c,S),R=d.getOnePixel(z,T,$,b),T+=d.getDataTypeSize($),X===3)if(e.ptr+=T,e.counter.constantoffset++,Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=_?Math.min(J,Z[w]+R):R),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w]=_?Math.min(J,Z[w]+R):R,w++;w+=D}else if(e.ptr+=T,d.decodeBits(a,e,Q,R,H),T=0,_)if(Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=Q[T++]+Z[w]),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w]=Q[T++]+Z[w],w++;w+=D}else if(Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=Q[T++]),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w++]=Q[T++];w+=D}}q>1&&!f&&(e.pixels.resultPixels=d.swapDimensionOrder(e.pixels.resultPixels,t,q,r))},formatFileInfo:function(a){return{fileIdentifierString:a.headerInfo.fileIdentifierString,fileVersion:a.headerInfo.fileVersion,imageType:a.headerInfo.imageType,height:a.headerInfo.height,width:a.headerInfo.width,numValidPixel:a.headerInfo.numValidPixel,microBlockSize:a.headerInfo.microBlockSize,blobSize:a.headerInfo.blobSize,maxZError:a.headerInfo.maxZError,pixelType:d.getPixelType(a.headerInfo.imageType),eofOffset:a.eofOffset,mask:a.mask?{numBytes:a.mask.numBytes}:null,pixels:{numBlocksX:a.pixels.numBlocksX,numBlocksY:a.pixels.numBlocksY,maxValue:a.headerInfo.zMax,minValue:a.headerInfo.zMin,noDataValue:a.noDataValue}}},constructConstantSurface:function(a,e){var r=a.headerInfo.zMax,f=a.headerInfo.zMin,n=a.headerInfo.maxValues,i=a.headerInfo.numDims,m=a.headerInfo.height*a.headerInfo.width,t=0,s=0,c=0,o=a.pixels.resultMask,h=a.pixels.resultPixels;if(o)if(i>1){if(e)for(t=0;t<i;t++)for(c=t*m,r=n[t],s=0;s<m;s++)o[s]&&(h[c+s]=r);else for(s=0;s<m;s++)if(o[s])for(c=s*i,t=0;t<i;t++)h[c+i]=n[t]}else for(s=0;s<m;s++)o[s]&&(h[s]=r);else if(i>1&&f!==r)if(e)for(t=0;t<i;t++)for(c=t*m,r=n[t],s=0;s<m;s++)h[c+s]=r;else for(s=0;s<m;s++)for(c=s*i,t=0;t<i;t++)h[c+t]=n[t];else for(s=0;s<m*i;s++)h[s]=r},getDataTypeArray:function(a){var e;switch(a){case 0:e=Int8Array;break;case 1:e=Uint8Array;break;case 2:e=Int16Array;break;case 3:e=Uint16Array;break;case 4:e=Int32Array;break;case 5:e=Uint32Array;break;case 6:e=Float32Array;break;case 7:e=Float64Array;break;default:e=Float32Array}return e},getPixelType:function(a){var e;switch(a){case 0:e="S8";break;case 1:e="U8";break;case 2:e="S16";break;case 3:e="U16";break;case 4:e="S32";break;case 5:e="U32";break;case 6:e="F32";break;case 7:e="F64";break;default:e="F32"}return e},isValidPixelValue:function(a,e){if(e==null)return!1;var r;switch(a){case 0:r=e>=-128&&e<=127;break;case 1:r=e>=0&&e<=255;break;case 2:r=e>=-32768&&e<=32767;break;case 3:r=e>=0&&e<=65536;break;case 4:r=e>=-2147483648&&e<=2147483647;break;case 5:r=e>=0&&e<=4294967296;break;case 6:r=e>=-34027999387901484e22&&e<=34027999387901484e22;break;case 7:r=e>=-17976931348623157e292&&e<=17976931348623157e292;break;default:r=!1}return r},getDataTypeSize:function(a){var e=0;switch(a){case 0:case 1:e=1;break;case 2:case 3:e=2;break;case 4:case 5:case 6:e=4;break;case 7:e=8;break;default:e=a}return e},getDataTypeUsed:function(a,e){var r=a;switch(a){case 2:case 4:r=a-e;break;case 3:case 5:r=a-2*e;break;case 6:e===0?r=a:e===1?r=2:r=1;break;case 7:e===0?r=a:r=a-2*e+1;break;default:r=a;break}return r},getOnePixel:function(a,e,r,f){var n=0;switch(r){case 0:n=f.getInt8(e);break;case 1:n=f.getUint8(e);break;case 2:n=f.getInt16(e,!0);break;case 3:n=f.getUint16(e,!0);break;case 4:n=f.getInt32(e,!0);break;case 5:n=f.getUInt32(e,!0);break;case 6:n=f.getFloat32(e,!0);break;case 7:n=f.getFloat64(e,!0);break;default:throw"the decoder does not understand this pixel type"}return n},swapDimensionOrder:function(a,e,r,f,n){var i=0,m=0,t=0,s=0,c=a;if(r>1)if(c=new f(e*r),n)for(i=0;i<e;i++)for(s=i,t=0;t<r;t++,s+=e)c[s]=a[m++];else for(i=0;i<e;i++)for(s=i,t=0;t<r;t++,s+=e)c[m++]=a[s];return c}},U=function(a,e,r){this.val=a,this.left=e,this.right=r},F={decode:function(a,e){e=e||{};var r=e.noDataValue,f=0,n={};if(n.ptr=e.inputOffset||0,n.pixels={},!!d.readHeaderInfo(a,n)){var i=n.headerInfo,m=i.fileVersion,t=d.getDataTypeArray(i.imageType);if(m>5)throw"unsupported lerc version 2."+m;d.readMask(a,n),i.numValidPixel!==i.width*i.height&&!n.pixels.resultMask&&(n.pixels.resultMask=e.maskData);var s=i.width*i.height;n.pixels.resultPixels=new t(s*i.numDims),n.counter={onesweep:0,uncompressed:0,lut:0,bitstuffer:0,constant:0,constantoffset:0};var c=!e.returnPixelInterleavedDims;if(i.numValidPixel!==0)if(i.zMax===i.zMin)d.constructConstantSurface(n,c);else if(m>=4&&d.checkMinMaxRanges(a,n))d.constructConstantSurface(n,c);else{var o=new DataView(a,n.ptr,2),h=o.getUint8(0);if(n.ptr++,h)d.readDataOneSweep(a,n,t,c);else if(m>1&&i.imageType<=1&&Math.abs(i.maxZError-.5)<1e-5){var v=o.getUint8(1);if(n.ptr++,n.encodeMode=v,v>2||m<4&&v>1)throw"Invalid Huffman flag "+v;v?d.readHuffman(a,n,t,c):d.readTiles(a,n,t,c)}else d.readTiles(a,n,t,c)}n.eofOffset=n.ptr;var u;e.inputOffset?(u=n.headerInfo.blobSize+e.inputOffset-n.ptr,Math.abs(u)>=1&&(n.eofOffset=e.inputOffset+n.headerInfo.blobSize)):(u=n.headerInfo.blobSize-n.ptr,Math.abs(u)>=1&&(n.eofOffset=n.headerInfo.blobSize));var l={width:i.width,height:i.height,pixelData:n.pixels.resultPixels,minValue:i.zMin,maxValue:i.zMax,validPixelCount:i.numValidPixel,dimCount:i.numDims,dimStats:{minValues:i.minValues,maxValues:i.maxValues},maskData:n.pixels.resultMask};if(n.pixels.resultMask&&d.isValidPixelValue(i.imageType,r)){var g=n.pixels.resultMask;for(f=0;f<s;f++)g[f]||(l.pixelData[f]=r);l.noDataValue=r}return n.noDataValue=r,e.returnFileInfo&&(l.fileInfo=d.formatFileInfo(n)),l}},getBandCount:function(a){var e=0,r=0,f={};for(f.ptr=0,f.pixels={};r<a.byteLength-58;)d.readHeaderInfo(a,f),r+=f.headerInfo.blobSize,e++,f.ptr=r;return e}};return F})();var ae=(function(){var B=new ArrayBuffer(4),d=new Uint8Array(B),U=new Uint32Array(B);return U[0]=1,d[0]===1})(),se={decode:function(B,d){if(!ae)throw"Big endian system is not supported.";d=d||{};var U=d.inputOffset||0,F=new Uint8Array(B,U,10),a=String.fromCharCode.apply(null,F),e,r;if(a.trim()==="CntZImage")e=ne,r=1;else if(a.substring(0,5)==="Lerc2")e=te,r=2;else throw"Unexpected file identifier string: "+a;for(var f=0,n=B.byteLength-10,i,m=[],t,s,c={width:0,height:0,pixels:[],pixelType:d.pixelType,mask:null,statistics:[]},o=0;U<n;){var h=e.decode(B,{inputOffset:U,encodedMaskData:i,maskData:s,returnMask:f===0,returnEncodedMask:f===0,returnFileInfo:!0,returnPixelInterleavedDims:d.returnPixelInterleavedDims,pixelType:d.pixelType||null,noDataValue:d.noDataValue||null});U=h.fileInfo.eofOffset,s=h.maskData,f===0&&(i=h.encodedMaskData,c.width=h.width,c.height=h.height,c.dimCount=h.dimCount||1,c.pixelType=h.pixelType||h.fileInfo.pixelType,c.mask=s),r>1&&(s&&m.push(s),h.fileInfo.mask&&h.fileInfo.mask.numBytes>0&&o++),f++,c.pixels.push(h.pixelData),c.statistics.push({minValue:h.minValue,maxValue:h.maxValue,noDataValue:h.noDataValue,dimStats:h.dimStats})}var v,u,l;if(r>1&&o>1){for(l=c.width*c.height,c.bandMasks=m,s=new Uint8Array(l),s.set(m[0]),v=1;v<m.length;v++)for(t=m[v],u=0;u<l;u++)s[u]=s[u]&t[u];c.maskData=s}return c}};const fe={0:7e3,1:6e3,2:5e3,3:4e3,4:3e3,5:2500,6:2e3,7:1500,8:800,9:500,10:200,11:100,12:40,13:12,14:5,15:2,16:1,17:.5,18:.2,19:.1,20:.01};class G{static parse(d,U,F){let a=G.decode(d);F[2]-F[0]<1&&(a=G.getSubDEM(a,F));const{array:e,width:r}=a,f=new ie(r),n=fe[U]||0;return f.build(e,n)}static decode(d){const{height:U,width:F,pixels:a}=se.decode(d),e=new Float32Array(U*F);for(let r=0;r<e.length;r++)e[r]=a[0][r];return{array:e,width:F,height:U}}static getSubDEM(d,U){function F(s,c,o,h,v,u,l,g){const x=new Float32Array(v*u);for(let p=0;p<u;p++)for(let y=0;y<v;y++){const M=(p+h)*c+(y+o),S=p*v+y;x[S]=s[M]}const k=new Float32Array(g*l);if(v===l&&u===g)k.set(x);else{const p=v/l,y=u/g;for(let M=0;M<g;M++)for(let S=0;S<l;S++){const I=Math.floor(S*p),D=Math.floor(M*y)*v+I;k[M*l+S]=x[D]}}return k}const{array:a,width:e}=d,{sx:r,sy:f,sw:n,sh:i}=G.getBoundsCoord(U,e),m=e;return{array:F(a,e,r,f,n,i,m,m),width:m,height:m}}static getBoundsCoord(d,U){const F=Math.floor(d[0]*U),a=Math.floor(d[1]*U),e=Math.floor((d[2]-d[0])*U),r=Math.floor((d[3]-d[1])*U);return{sx:F,sy:a,sw:e,sh:r}}}self.onmessage=B=>{const d=B.data,U=G.parse(d.demData,d.z,d.clipBounds);self.postMessage(U)}})();\n', Gf = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", lp], { type: "text/javascript;charset=utf-8" });
function Z2(s) {
  let e;
  try {
    if (e = Gf && (self.URL || self.webkitURL).createObjectURL(Gf), !e) throw "";
    const t = new Worker(e, {
      name: s?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(lp),
      {
        name: s?.name
      }
    );
  }
}
var K2 = Object.defineProperty, q2 = (s, e, t) => e in s ? K2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ho = (s, e, t) => q2(s, typeof e != "symbol" ? e + "" : e, t);
const Q2 = 10;
class J2 extends ap {
  constructor() {
    super(), Ho(this, "info", {
      version: "1.0.0",
      description: "Loader for ArcGIS LERC compressed terrain data."
    }), Ho(this, "dataType", "lerc"), Ho(this, "fileLoader", new vi(We.manager)), Ho(this, "workerPool", new bc(0)), this.fileLoader.setResponseType("arraybuffer"), this.workerPool.setWorkerCreator(() => new Z2());
  }
  /**
   * 执行加载
   * @param url 
   * @param context 
   */
  async performLoad(e, t) {
    this.workerPool.pool === 0 && this.workerPool.setWorkerLimit(Q2);
    const r = await this.fileLoader.loadAsync(e).catch(() => new Float32Array(256 * 256).buffer), i = {
      demData: r,
      z: t.z,
      clipBounds: t.bounds
    }, l = (await this.workerPool.postMessage(i, [r])).data, c = new Cs();
    return c.setTerrainData(l), c;
  }
}
var eM = Object.defineProperty, tM = (s, e, t) => e in s ? eM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Vo = (s, e, t) => tM(s, typeof e != "symbol" ? e + "" : e, t);
class Cc {
  constructor() {
    Vo(this, "_imgSources", []), Vo(this, "_demSource"), Vo(this, "_vtSource"), Vo(this, "manager", We.manager);
  }
  // #region Accessors
  get imgSource() {
    return this._imgSources;
  }
  set imgSource(e) {
    this._imgSources = e;
  }
  get demSource() {
    return this._demSource;
  }
  set demSource(e) {
    this._demSource = e;
  }
  get vtSource() {
    return this._vtSource;
  }
  set vtSource(e) {
    this._vtSource = e;
  }
  // #endregion
  /**
   * 加载瓦片数据
   * @param context 加载上下文
   */
  async load(e) {
    const [t, r] = await Promise.all([
      this.loadGeometry(e),
      this.loadMaterials(e)
    ]);
    if (t && r)
      for (let i = 0; i < r.length; i++)
        t.addGroup(0, 1 / 0, i);
    return { geometry: t, materials: r };
  }
  /**
   * 卸载资源
   * @param tileMesh 
   */
  unload(e) {
    const t = e.material, r = e.geometry;
    Array.isArray(t) ? t.forEach((i) => i.dispose()) : t && t.dispose(), r && r.dispose();
  }
  /**
   * 加载几何体
   * @param context 
   */
  async loadGeometry(e) {
    const { z: t, bounds: r } = e;
    return this.demSource && t >= this.demSource.minLevel && this.isBoundsInSource(this.demSource, r) ? this.loadFromSource(this.demSource, e, We.getGeometryLoader(this.demSource)) : this.vtSource && t >= this.vtSource.minLevel && this.isBoundsInSource(this.vtSource, r) ? this.loadFromSource(this.vtSource, e, We.getMeshLoader(this.vtSource)) : new Fn();
  }
  /**
   * 加载材质列表
   * @param context 
   */
  async loadMaterials(e) {
    const { z: t, bounds: r } = e, o = this._imgSources.filter(
      (l) => t >= l.minLevel && this.isBoundsInSource(l, r)
    ).map(async (l) => {
      const c = We.getMaterialLoader(l);
      try {
        const u = await c.load({ source: l, ...e }), f = (p) => {
          c.unload && c.unload(p.target), p.target.removeEventListener("dispose", f);
        };
        return u instanceof Kt || u.addEventListener("dispose", f), u;
      } catch (u) {
        return console.error(`[CompositeTileLoader] Material load failed for source ${l.dataType}:`, u), new Kt();
      }
    });
    return Promise.all(o);
  }
  async loadFromSource(e, t, r) {
    try {
      const i = await r.load({ source: e, ...t });
      return i.addEventListener("dispose", () => {
        r.unload && r.unload(i);
      }), i;
    } catch (i) {
      return console.error(`[CompositeTileLoader] Geometry load failed for source ${e.dataType}:`, i), new Fn();
    }
  }
  /**
   * 检查瓦片边界是否在数据源范围内
   */
  isBoundsInSource(e, t) {
    const [r, i, o, l] = e._projectionBounds, [c, u, f, p] = t;
    return !(f < r || p < i || c > o || u > l);
  }
}
const cp = `(function(){"use strict";class s{static parse(t){return s.getDEMFromImage(t.data)}static getDEMFromImage(t){function c(e,g){const a=g*4,[i,u,l,m]=e.slice(a,a+4);return m===0?0:-1e4+(i<<16|u<<8|l)*.1}const n=t.length>>>2,r=new Float32Array(n);for(let e=0;e<n;e++)r[e]=c(t,e);return r}}self.onmessage=o=>{const t=s.parse(o.data.imgData);self.postMessage(t)}})();
`, jf = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", cp], { type: "text/javascript;charset=utf-8" });
function rM(s) {
  let e;
  try {
    if (e = jf && (self.URL || self.webkitURL).createObjectURL(jf), !e) throw "";
    const t = new Worker(e, {
      name: s?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(cp),
      {
        name: s?.name
      }
    );
  }
}
var iM = Object.defineProperty, nM = (s, e, t) => e in s ? iM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Wo = (s, e, t) => nM(s, typeof e != "symbol" ? e + "" : e, t);
const sM = 10;
class oM extends ap {
  constructor() {
    super(), Wo(this, "info", {
      version: "1.0.0",
      description: "Mapbox-RGB terrain loader for loading elevation data encoded in RGB textures."
    }), Wo(this, "dataType", "terrain-rgb"), Wo(this, "imageLoader", new xd(We.manager)), Wo(this, "workerPool", new bc(0)), this.workerPool.setWorkerCreator(() => new rM());
  }
  /**
   * 执行加载
   * @param url 
   * @param context 
   */
  async performLoad(e, t) {
    const r = await this.imageLoader.loadAsync(e).catch(() => new Image()), i = lt.clamp((t.z + 2) * 3, 2, 64), o = this.extractSubImageData(r, t.bounds, i);
    this.workerPool.pool === 0 && this.workerPool.setWorkerLimit(sM);
    const c = (await this.workerPool.postMessage(
      { imgData: o },
      [o.data.buffer]
    )).data, u = new Cs();
    return u.setTerrainData(c), u;
  }
  /**
   * 提取子图像数据
   * @param image 源图像
   * @param bounds 裁剪边界
   * @param targetSize 目标尺寸
   */
  extractSubImageData(e, t, r) {
    const i = ha.getBoundsCoord(t, e.width), o = Math.min(r, i.sw), c = new OffscreenCanvas(o, o).getContext("2d");
    return c.imageSmoothingEnabled = !1, c.drawImage(
      e,
      i.sx,
      i.sy,
      i.sw,
      i.sh,
      0,
      0,
      o,
      o
    ), c.getImageData(0, 0, o, o);
  }
}
const up = '(function(){"use strict";const P=23283064365386963e-26,M=12,S=typeof TextDecoder>"u"?null:new TextDecoder("utf-8"),g=0,y=1,F=2,p=5;class E{constructor(t=new Uint8Array(16)){this.buf=ArrayBuffer.isView(t)?t:new Uint8Array(t),this.dataView=new DataView(this.buf.buffer),this.pos=0,this.type=0,this.length=this.buf.length}readFields(t,e,r=this.length){for(;this.pos<r;){const s=this.readVarint(),n=s>>3,o=this.pos;this.type=s&7,t(n,e,this),this.pos===o&&this.skip(s)}return e}readMessage(t,e){return this.readFields(t,e,this.readVarint()+this.pos)}readFixed32(){const t=this.dataView.getUint32(this.pos,!0);return this.pos+=4,t}readSFixed32(){const t=this.dataView.getInt32(this.pos,!0);return this.pos+=4,t}readFixed64(){const t=this.dataView.getUint32(this.pos,!0)+this.dataView.getUint32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readSFixed64(){const t=this.dataView.getUint32(this.pos,!0)+this.dataView.getInt32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readFloat(){const t=this.dataView.getFloat32(this.pos,!0);return this.pos+=4,t}readDouble(){const t=this.dataView.getFloat64(this.pos,!0);return this.pos+=8,t}readVarint(t){const e=this.buf;let r,s;return s=e[this.pos++],r=s&127,s<128||(s=e[this.pos++],r|=(s&127)<<7,s<128)||(s=e[this.pos++],r|=(s&127)<<14,s<128)||(s=e[this.pos++],r|=(s&127)<<21,s<128)?r:(s=e[this.pos],r|=(s&15)<<28,B(r,t,this))}readVarint64(){return this.readVarint(!0)}readSVarint(){const t=this.readVarint();return t%2===1?(t+1)/-2:t/2}readBoolean(){return!!this.readVarint()}readString(){const t=this.readVarint()+this.pos,e=this.pos;return this.pos=t,t-e>=M&&S?S.decode(this.buf.subarray(e,t)):q(this.buf,e,t)}readBytes(){const t=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,t);return this.pos=t,e}readPackedVarint(t=[],e){const r=this.readPackedEnd();for(;this.pos<r;)t.push(this.readVarint(e));return t}readPackedSVarint(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSVarint());return t}readPackedBoolean(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readBoolean());return t}readPackedFloat(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFloat());return t}readPackedDouble(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readDouble());return t}readPackedFixed32(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFixed32());return t}readPackedSFixed32(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSFixed32());return t}readPackedFixed64(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFixed64());return t}readPackedSFixed64(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSFixed64());return t}readPackedEnd(){return this.type===F?this.readVarint()+this.pos:this.pos+1}skip(t){const e=t&7;if(e===g)for(;this.buf[this.pos++]>127;);else if(e===F)this.pos=this.readVarint()+this.pos;else if(e===p)this.pos+=4;else if(e===y)this.pos+=8;else throw new Error(`Unimplemented type: ${e}`)}writeTag(t,e){this.writeVarint(t<<3|e)}realloc(t){let e=this.length||16;for(;e<this.pos+t;)e*=2;if(e!==this.length){const r=new Uint8Array(e);r.set(this.buf),this.buf=r,this.dataView=new DataView(r.buffer),this.length=e}}finish(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)}writeFixed32(t){this.realloc(4),this.dataView.setInt32(this.pos,t,!0),this.pos+=4}writeSFixed32(t){this.realloc(4),this.dataView.setInt32(this.pos,t,!0),this.pos+=4}writeFixed64(t){this.realloc(8),this.dataView.setInt32(this.pos,t&-1,!0),this.dataView.setInt32(this.pos+4,Math.floor(t*P),!0),this.pos+=8}writeSFixed64(t){this.realloc(8),this.dataView.setInt32(this.pos,t&-1,!0),this.dataView.setInt32(this.pos+4,Math.floor(t*P),!0),this.pos+=8}writeVarint(t){if(t=+t||0,t>268435455||t<0){T(t,this);return}this.realloc(4),this.buf[this.pos++]=t&127|(t>127?128:0),!(t<=127)&&(this.buf[this.pos++]=(t>>>=7)&127|(t>127?128:0),!(t<=127)&&(this.buf[this.pos++]=(t>>>=7)&127|(t>127?128:0),!(t<=127)&&(this.buf[this.pos++]=t>>>7&127)))}writeSVarint(t){this.writeVarint(t<0?-t*2-1:t*2)}writeBoolean(t){this.writeVarint(+t)}writeString(t){t=String(t),this.realloc(t.length*4),this.pos++;const e=this.pos;this.pos=O(this.buf,t,this.pos);const r=this.pos-e;r>=128&&k(e,r,this),this.pos=e-1,this.writeVarint(r),this.pos+=r}writeFloat(t){this.realloc(4),this.dataView.setFloat32(this.pos,t,!0),this.pos+=4}writeDouble(t){this.realloc(8),this.dataView.setFloat64(this.pos,t,!0),this.pos+=8}writeBytes(t){const e=t.length;this.writeVarint(e),this.realloc(e);for(let r=0;r<e;r++)this.buf[this.pos++]=t[r]}writeRawMessage(t,e){this.pos++;const r=this.pos;t(e,this);const s=this.pos-r;s>=128&&k(r,s,this),this.pos=r-1,this.writeVarint(s),this.pos+=s}writeMessage(t,e,r){this.writeTag(t,F),this.writeRawMessage(e,r)}writePackedVarint(t,e){e.length&&this.writeMessage(t,C,e)}writePackedSVarint(t,e){e.length&&this.writeMessage(t,L,e)}writePackedBoolean(t,e){e.length&&this.writeMessage(t,U,e)}writePackedFloat(t,e){e.length&&this.writeMessage(t,A,e)}writePackedDouble(t,e){e.length&&this.writeMessage(t,v,e)}writePackedFixed32(t,e){e.length&&this.writeMessage(t,N,e)}writePackedSFixed32(t,e){e.length&&this.writeMessage(t,G,e)}writePackedFixed64(t,e){e.length&&this.writeMessage(t,H,e)}writePackedSFixed64(t,e){e.length&&this.writeMessage(t,R,e)}writeBytesField(t,e){this.writeTag(t,F),this.writeBytes(e)}writeFixed32Field(t,e){this.writeTag(t,p),this.writeFixed32(e)}writeSFixed32Field(t,e){this.writeTag(t,p),this.writeSFixed32(e)}writeFixed64Field(t,e){this.writeTag(t,y),this.writeFixed64(e)}writeSFixed64Field(t,e){this.writeTag(t,y),this.writeSFixed64(e)}writeVarintField(t,e){this.writeTag(t,g),this.writeVarint(e)}writeSVarintField(t,e){this.writeTag(t,g),this.writeSVarint(e)}writeStringField(t,e){this.writeTag(t,F),this.writeString(e)}writeFloatField(t,e){this.writeTag(t,p),this.writeFloat(e)}writeDoubleField(t,e){this.writeTag(t,y),this.writeDouble(e)}writeBooleanField(t,e){this.writeVarintField(t,+e)}}function B(i,t,e){const r=e.buf;let s,n;if(n=r[e.pos++],s=(n&112)>>4,n<128||(n=r[e.pos++],s|=(n&127)<<3,n<128)||(n=r[e.pos++],s|=(n&127)<<10,n<128)||(n=r[e.pos++],s|=(n&127)<<17,n<128)||(n=r[e.pos++],s|=(n&127)<<24,n<128)||(n=r[e.pos++],s|=(n&1)<<31,n<128))return w(i,s,t);throw new Error("Expected varint not more than 10 bytes")}function w(i,t,e){return e?t*4294967296+(i>>>0):(t>>>0)*4294967296+(i>>>0)}function T(i,t){let e,r;if(i>=0?(e=i%4294967296|0,r=i/4294967296|0):(e=~(-i%4294967296),r=~(-i/4294967296),e^4294967295?e=e+1|0:(e=0,r=r+1|0)),i>=18446744073709552e3||i<-18446744073709552e3)throw new Error("Given varint doesn\'t fit into 10 bytes");t.realloc(10),D(e,r,t),I(r,t)}function D(i,t,e){e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos]=i&127}function I(i,t){const e=(i&7)<<4;t.buf[t.pos++]|=e|((i>>>=3)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127)))))}function k(i,t,e){const r=t<=16383?1:t<=2097151?2:t<=268435455?3:Math.floor(Math.log(t)/(Math.LN2*7));e.realloc(r);for(let s=e.pos-1;s>=i;s--)e.buf[s+r]=e.buf[s]}function C(i,t){for(let e=0;e<i.length;e++)t.writeVarint(i[e])}function L(i,t){for(let e=0;e<i.length;e++)t.writeSVarint(i[e])}function A(i,t){for(let e=0;e<i.length;e++)t.writeFloat(i[e])}function v(i,t){for(let e=0;e<i.length;e++)t.writeDouble(i[e])}function U(i,t){for(let e=0;e<i.length;e++)t.writeBoolean(i[e])}function N(i,t){for(let e=0;e<i.length;e++)t.writeFixed32(i[e])}function G(i,t){for(let e=0;e<i.length;e++)t.writeSFixed32(i[e])}function H(i,t){for(let e=0;e<i.length;e++)t.writeFixed64(i[e])}function R(i,t){for(let e=0;e<i.length;e++)t.writeSFixed64(i[e])}function q(i,t,e){let r="",s=t;for(;s<e;){const n=i[s];let o=null,h=n>239?4:n>223?3:n>191?2:1;if(s+h>e)break;let a,d,l;h===1?n<128&&(o=n):h===2?(a=i[s+1],(a&192)===128&&(o=(n&31)<<6|a&63,o<=127&&(o=null))):h===3?(a=i[s+1],d=i[s+2],(a&192)===128&&(d&192)===128&&(o=(n&15)<<12|(a&63)<<6|d&63,(o<=2047||o>=55296&&o<=57343)&&(o=null))):h===4&&(a=i[s+1],d=i[s+2],l=i[s+3],(a&192)===128&&(d&192)===128&&(l&192)===128&&(o=(n&15)<<18|(a&63)<<12|(d&63)<<6|l&63,(o<=65535||o>=1114112)&&(o=null))),o===null?(o=65533,h=1):o>65535&&(o-=65536,r+=String.fromCharCode(o>>>10&1023|55296),o=56320|o&1023),r+=String.fromCharCode(o),s+=h}return r}function O(i,t,e){for(let r=0,s,n;r<t.length;r++){if(s=t.charCodeAt(r),s>55295&&s<57344)if(n)if(s<56320){i[e++]=239,i[e++]=191,i[e++]=189,n=s;continue}else s=n-55296<<10|s-56320|65536,n=null;else{s>56319||r+1===t.length?(i[e++]=239,i[e++]=191,i[e++]=189):n=s;continue}else n&&(i[e++]=239,i[e++]=191,i[e++]=189,n=null);s<128?i[e++]=s:(s<2048?i[e++]=s>>6|192:(s<65536?i[e++]=s>>12|224:(i[e++]=s>>18|240,i[e++]=s>>12&63|128),i[e++]=s>>6&63|128),i[e++]=s&63|128)}return e}function f(i,t){this.x=i,this.y=t}f.prototype={clone(){return new f(this.x,this.y)},add(i){return this.clone()._add(i)},sub(i){return this.clone()._sub(i)},multByPoint(i){return this.clone()._multByPoint(i)},divByPoint(i){return this.clone()._divByPoint(i)},mult(i){return this.clone()._mult(i)},div(i){return this.clone()._div(i)},rotate(i){return this.clone()._rotate(i)},rotateAround(i,t){return this.clone()._rotateAround(i,t)},matMult(i){return this.clone()._matMult(i)},unit(){return this.clone()._unit()},perp(){return this.clone()._perp()},round(){return this.clone()._round()},mag(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals(i){return this.x===i.x&&this.y===i.y},dist(i){return Math.sqrt(this.distSqr(i))},distSqr(i){const t=i.x-this.x,e=i.y-this.y;return t*t+e*e},angle(){return Math.atan2(this.y,this.x)},angleTo(i){return Math.atan2(this.y-i.y,this.x-i.x)},angleWith(i){return this.angleWithSep(i.x,i.y)},angleWithSep(i,t){return Math.atan2(this.x*t-this.y*i,this.x*i+this.y*t)},_matMult(i){const t=i[0]*this.x+i[1]*this.y,e=i[2]*this.x+i[3]*this.y;return this.x=t,this.y=e,this},_add(i){return this.x+=i.x,this.y+=i.y,this},_sub(i){return this.x-=i.x,this.y-=i.y,this},_mult(i){return this.x*=i,this.y*=i,this},_div(i){return this.x/=i,this.y/=i,this},_multByPoint(i){return this.x*=i.x,this.y*=i.y,this},_divByPoint(i){return this.x/=i.x,this.y/=i.y,this},_unit(){return this._div(this.mag()),this},_perp(){const i=this.y;return this.y=this.x,this.x=-i,this},_rotate(i){const t=Math.cos(i),e=Math.sin(i),r=t*this.x-e*this.y,s=e*this.x+t*this.y;return this.x=r,this.y=s,this},_rotateAround(i,t){const e=Math.cos(i),r=Math.sin(i),s=t.x+e*(this.x-t.x)-r*(this.y-t.y),n=t.y+r*(this.x-t.x)+e*(this.y-t.y);return this.x=s,this.y=n,this},_round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},constructor:f},f.convert=function(i){if(i instanceof f)return i;if(Array.isArray(i))return new f(+i[0],+i[1]);if(i.x!==void 0&&i.y!==void 0)return new f(+i.x,+i.y);throw new Error("Expected [x, y] or {x, y} point format")};class m{constructor(t,e,r,s,n){this.properties={},this.extent=r,this.type=0,this.id=void 0,this._pbf=t,this._geometry=-1,this._keys=s,this._values=n,t.readFields(j,this,e)}loadGeometry(){const t=this._pbf;t.pos=this._geometry;const e=t.readVarint()+t.pos,r=[];let s,n=1,o=0,h=0,a=0;for(;t.pos<e;){if(o<=0){const d=t.readVarint();n=d&7,o=d>>3}if(o--,n===1||n===2)h+=t.readSVarint(),a+=t.readSVarint(),n===1&&(s&&r.push(s),s=[]),s&&s.push(new f(h,a));else if(n===7)s&&s.push(s[0].clone());else throw new Error(`unknown command ${n}`)}return s&&r.push(s),r}bbox(){const t=this._pbf;t.pos=this._geometry;const e=t.readVarint()+t.pos;let r=1,s=0,n=0,o=0,h=1/0,a=-1/0,d=1/0,l=-1/0;for(;t.pos<e;){if(s<=0){const x=t.readVarint();r=x&7,s=x>>3}if(s--,r===1||r===2)n+=t.readSVarint(),o+=t.readSVarint(),n<h&&(h=n),n>a&&(a=n),o<d&&(d=o),o>l&&(l=o);else if(r!==7)throw new Error(`unknown command ${r}`)}return[h,d,a,l]}toGeoJSON(t,e,r){const s=this.extent*Math.pow(2,r),n=this.extent*t,o=this.extent*e,h=this.loadGeometry();function a(u){return[(u.x+n)*360/s-180,360/Math.PI*Math.atan(Math.exp((1-(u.y+o)*2/s)*Math.PI))-90]}function d(u){return u.map(a)}let l;if(this.type===1){const u=[];for(const _ of h)u.push(_[0]);const c=d(u);l=u.length===1?{type:"Point",coordinates:c[0]}:{type:"MultiPoint",coordinates:c}}else if(this.type===2){const u=h.map(d);l=u.length===1?{type:"LineString",coordinates:u[0]}:{type:"MultiLineString",coordinates:u}}else if(this.type===3){const u=W(h),c=[];for(const _ of u)c.push(_.map(d));l=c.length===1?{type:"Polygon",coordinates:c[0]}:{type:"MultiPolygon",coordinates:c}}else throw new Error("unknown feature type");const x={type:"Feature",geometry:l,properties:this.properties};return this.id!=null&&(x.id=this.id),x}}m.types=["Unknown","Point","LineString","Polygon"];function j(i,t,e){i===1?t.id=e.readVarint():i===2?J(e,t):i===3?t.type=e.readVarint():i===4&&(t._geometry=e.pos)}function J(i,t){const e=i.readVarint()+i.pos;for(;i.pos<e;){const r=t._keys[i.readVarint()],s=t._values[i.readVarint()];t.properties[r]=s}}function W(i){const t=i.length;if(t<=1)return[i];const e=[];let r,s;for(let n=0;n<t;n++){const o=X(i[n]);o!==0&&(s===void 0&&(s=o<0),s===o<0?(r&&e.push(r),r=[i[n]]):r&&r.push(i[n]))}return r&&e.push(r),e}function X(i){let t=0;for(let e=0,r=i.length,s=r-1,n,o;e<r;s=e++)n=i[e],o=i[s],t+=(o.x-n.x)*(n.y+o.y);return t}class ${constructor(t,e){this.version=1,this.name="",this.extent=4096,this.length=0,this._pbf=t,this._keys=[],this._values=[],this._features=[],t.readFields(b,this,e),this.length=this._features.length}feature(t){if(t<0||t>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[t];const e=this._pbf.readVarint()+this._pbf.pos;return new m(this._pbf,e,this.extent,this._keys,this._values)}}function b(i,t,e){i===15?t.version=e.readVarint():i===1?t.name=e.readString():i===5?t.extent=e.readVarint():i===2?t._features.push(e.pos):i===3?t._keys.push(e.readString()):i===4&&t._values.push(z(e))}function z(i){let t=null;const e=i.readVarint()+i.pos;for(;i.pos<e;){const r=i.readVarint()>>3;t=r===1?i.readString():r===2?i.readFloat():r===3?i.readDouble():r===4?i.readVarint64():r===5?i.readVarint():r===6?i.readSVarint():r===7?i.readBoolean():null}if(t==null)throw new Error("unknown feature value");return t}class Y{constructor(t,e){this.layers=t.readFields(K,{},e)}}function K(i,t,e){if(i===3){const r=new $(e,e.readVarint()+e.pos);r.length&&(t[r.name]=r)}}class V{static async parse(t,e,r,s){try{const n=V.mvt2GeoJSON(t,e,r,s);return{x:e,y:r,z:s,layers:n,timestamp:Date.now(),dataFormat:"mvt"}}catch(n){throw console.error("[MVTParser] Error parsing vector tile data:",n),n}}static mvt2GeoJSON(t,e,r,s){const n=new E(t),o=new Y(n),h={};for(const a in o.layers){const d=o.layers[a],l=[];for(let x=0;x<d.length;x++){const c=d.feature(x).toGeoJSON(e,r,s);l.push(c)}h[a]=l}return h}}self.onmessage=async i=>{const t=i.data;try{const e=await V.parse(t.arrayBuffer,t.x,t.y,t.z);self.postMessage(e)}catch(e){console.error("Worker MVT Parse Failed:",e),self.postMessage({error:e.message})}}})();\n', $f = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", up], { type: "text/javascript;charset=utf-8" });
function aM(s) {
  let e;
  try {
    if (e = $f && (self.URL || self.webkitURL).createObjectURL($f), !e) throw "";
    const t = new Worker(e, {
      name: s?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(up),
      {
        name: s?.name
      }
    );
  }
}
var lM = Object.defineProperty, cM = (s, e, t) => e in s ? lM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Go = (s, e, t) => cM(s, typeof e != "symbol" ? e + "" : e, t);
const uM = 10;
class hM {
  constructor() {
    Go(this, "info", {
      version: "2.0.0",
      description: "Mapbox Vector Tile Geometry Loader (Refactored)"
    }), Go(this, "dataType", "vector-tile"), Go(this, "fileLoader", new vi(We.manager)), Go(this, "_workerPool", new bc(0)), this.fileLoader.setResponseType("arraybuffer"), this._workerPool.setWorkerCreator(() => new aM());
  }
  /**
   * Load tile geometry (vector data container)
   * 加载瓦片几何体（矢量数据容器）
   */
  async load(e) {
    const { source: t, x: r, y: i, z: o } = e, l = typeof t._getUrl == "function" ? t._getUrl(r, i, o) : this.buildTileUrl(t.url, r, i, o);
    if (!l)
      return this.createErrorGeometry(r, i, o, new Error("Source returned empty URL"));
    this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(uM);
    try {
      const c = await this.fetchVectorData(l), u = { arrayBuffer: c, x: r, y: i, z: o }, p = (await this._workerPool.postMessage(u, [c])).data;
      if (p.error)
        throw new Error(p.error);
      const d = this.createGeometryWithVectorData(p, e);
      return We.manager.parseEnd(l), d;
    } catch (c) {
      return this.createErrorGeometry(r, i, o, c);
    }
  }
  async fetchVectorData(e) {
    try {
      const t = await this.fileLoader.loadAsync(e);
      if (!t || t.byteLength === 0)
        throw new Error("Empty response");
      return t;
    } catch (t) {
      throw new Error(`Failed to fetch vector tile: ${t.message}`);
    }
  }
  buildTileUrl(e, t, r, i) {
    return e ? e.replace("{x}", t.toString()).replace("{y}", r.toString()).replace("{z}", i.toString()).replace("{-y}", (Math.pow(2, i) - 1 - r).toString()) : "";
  }
  createGeometryWithVectorData(e, t) {
    const r = new Cs();
    return r.userData = {
      vectorData: e,
      tileInfo: {
        x: t.x,
        y: t.y,
        z: t.z,
        bounds: t.bounds
      },
      metadata: {
        dataType: this.dataType,
        version: this.info.version,
        loadedAt: Date.now()
      }
    }, r;
  }
  createErrorGeometry(e, t, r, i) {
    const o = new Cs(), l = 4007501668557849e-8 / Math.pow(2, r);
    return o.userData = {
      vectorData: {
        x: e,
        y: t,
        z: r,
        layers: {},
        totalFeatures: 0,
        bounds: { world: { x: l, y: l } },
        // Simplified bounds
        error: i.message || "Unknown error",
        timestamp: Date.now(),
        dataFormat: "error"
      },
      tileInfo: { x: e, y: t, z: r, bounds: [0, 0, 0, 0] },
      metadata: {
        dataType: "vector-tile-error",
        error: !0,
        errorMessage: i.message
      }
    }, o;
  }
  unload(e) {
    e.userData?.vectorData && (e.userData.vectorData = null), e.dispose();
  }
}
function mi(s, e) {
  this.x = s, this.y = e;
}
mi.prototype = {
  /**
   * Clone this point, returning a new point that can be modified
   * without affecting the old one.
   * @return {Point} the clone
   */
  clone() {
    return new mi(this.x, this.y);
  },
  /**
   * Add this point's x & y coordinates to another point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  add(s) {
    return this.clone()._add(s);
  },
  /**
   * Subtract this point's x & y coordinates to from point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  sub(s) {
    return this.clone()._sub(s);
  },
  /**
   * Multiply this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  multByPoint(s) {
    return this.clone()._multByPoint(s);
  },
  /**
   * Divide this point's x & y coordinates by point,
   * yielding a new point.
   * @param {Point} p the other point
   * @return {Point} output point
   */
  divByPoint(s) {
    return this.clone()._divByPoint(s);
  },
  /**
   * Multiply this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  mult(s) {
    return this.clone()._mult(s);
  },
  /**
   * Divide this point's x & y coordinates by a factor,
   * yielding a new point.
   * @param {number} k factor
   * @return {Point} output point
   */
  div(s) {
    return this.clone()._div(s);
  },
  /**
   * Rotate this point around the 0, 0 origin by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @return {Point} output point
   */
  rotate(s) {
    return this.clone()._rotate(s);
  },
  /**
   * Rotate this point around p point by an angle a,
   * given in radians
   * @param {number} a angle to rotate around, in radians
   * @param {Point} p Point to rotate around
   * @return {Point} output point
   */
  rotateAround(s, e) {
    return this.clone()._rotateAround(s, e);
  },
  /**
   * Multiply this point by a 4x1 transformation matrix
   * @param {[number, number, number, number]} m transformation matrix
   * @return {Point} output point
   */
  matMult(s) {
    return this.clone()._matMult(s);
  },
  /**
   * Calculate this point but as a unit vector from 0, 0, meaning
   * that the distance from the resulting point to the 0, 0
   * coordinate will be equal to 1 and the angle from the resulting
   * point to the 0, 0 coordinate will be the same as before.
   * @return {Point} unit vector point
   */
  unit() {
    return this.clone()._unit();
  },
  /**
   * Compute a perpendicular point, where the new y coordinate
   * is the old x coordinate and the new x coordinate is the old y
   * coordinate multiplied by -1
   * @return {Point} perpendicular point
   */
  perp() {
    return this.clone()._perp();
  },
  /**
   * Return a version of this point with the x & y coordinates
   * rounded to integers.
   * @return {Point} rounded point
   */
  round() {
    return this.clone()._round();
  },
  /**
   * Return the magnitude of this point: this is the Euclidean
   * distance from the 0, 0 coordinate to this point's x and y
   * coordinates.
   * @return {number} magnitude
   */
  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  },
  /**
   * Judge whether this point is equal to another point, returning
   * true or false.
   * @param {Point} other the other point
   * @return {boolean} whether the points are equal
   */
  equals(s) {
    return this.x === s.x && this.y === s.y;
  },
  /**
   * Calculate the distance from this point to another point
   * @param {Point} p the other point
   * @return {number} distance
   */
  dist(s) {
    return Math.sqrt(this.distSqr(s));
  },
  /**
   * Calculate the distance from this point to another point,
   * without the square root step. Useful if you're comparing
   * relative distances.
   * @param {Point} p the other point
   * @return {number} distance
   */
  distSqr(s) {
    const e = s.x - this.x, t = s.y - this.y;
    return e * e + t * t;
  },
  /**
   * Get the angle from the 0, 0 coordinate to this point, in radians
   * coordinates.
   * @return {number} angle
   */
  angle() {
    return Math.atan2(this.y, this.x);
  },
  /**
   * Get the angle from this point to another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleTo(s) {
    return Math.atan2(this.y - s.y, this.x - s.x);
  },
  /**
   * Get the angle between this point and another point, in radians
   * @param {Point} b the other point
   * @return {number} angle
   */
  angleWith(s) {
    return this.angleWithSep(s.x, s.y);
  },
  /**
   * Find the angle of the two vectors, solving the formula for
   * the cross product a x b = |a||b|sin(θ) for θ.
   * @param {number} x the x-coordinate
   * @param {number} y the y-coordinate
   * @return {number} the angle in radians
   */
  angleWithSep(s, e) {
    return Math.atan2(
      this.x * e - this.y * s,
      this.x * s + this.y * e
    );
  },
  /** @param {[number, number, number, number]} m */
  _matMult(s) {
    const e = s[0] * this.x + s[1] * this.y, t = s[2] * this.x + s[3] * this.y;
    return this.x = e, this.y = t, this;
  },
  /** @param {Point} p */
  _add(s) {
    return this.x += s.x, this.y += s.y, this;
  },
  /** @param {Point} p */
  _sub(s) {
    return this.x -= s.x, this.y -= s.y, this;
  },
  /** @param {number} k */
  _mult(s) {
    return this.x *= s, this.y *= s, this;
  },
  /** @param {number} k */
  _div(s) {
    return this.x /= s, this.y /= s, this;
  },
  /** @param {Point} p */
  _multByPoint(s) {
    return this.x *= s.x, this.y *= s.y, this;
  },
  /** @param {Point} p */
  _divByPoint(s) {
    return this.x /= s.x, this.y /= s.y, this;
  },
  _unit() {
    return this._div(this.mag()), this;
  },
  _perp() {
    const s = this.y;
    return this.y = this.x, this.x = -s, this;
  },
  /** @param {number} angle */
  _rotate(s) {
    const e = Math.cos(s), t = Math.sin(s), r = e * this.x - t * this.y, i = t * this.x + e * this.y;
    return this.x = r, this.y = i, this;
  },
  /**
   * @param {number} angle
   * @param {Point} p
   */
  _rotateAround(s, e) {
    const t = Math.cos(s), r = Math.sin(s), i = e.x + t * (this.x - e.x) - r * (this.y - e.y), o = e.y + r * (this.x - e.x) + t * (this.y - e.y);
    return this.x = i, this.y = o, this;
  },
  _round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  },
  constructor: mi
};
mi.convert = function(s) {
  if (s instanceof mi)
    return (
      /** @type {Point} */
      s
    );
  if (Array.isArray(s))
    return new mi(+s[0], +s[1]);
  if (s.x !== void 0 && s.y !== void 0)
    return new mi(+s.x, +s.y);
  throw new Error("Expected [x, y] or {x, y} point format");
};
class hp {
  /**
   * @param {Pbf} pbf
   * @param {number} end
   * @param {number} extent
   * @param {string[]} keys
   * @param {(number | string | boolean)[]} values
   */
  constructor(e, t, r, i, o) {
    this.properties = {}, this.extent = r, this.type = 0, this.id = void 0, this._pbf = e, this._geometry = -1, this._keys = i, this._values = o, e.readFields(fM, this, t);
  }
  loadGeometry() {
    const e = this._pbf;
    e.pos = this._geometry;
    const t = e.readVarint() + e.pos, r = [];
    let i, o = 1, l = 0, c = 0, u = 0;
    for (; e.pos < t; ) {
      if (l <= 0) {
        const f = e.readVarint();
        o = f & 7, l = f >> 3;
      }
      if (l--, o === 1 || o === 2)
        c += e.readSVarint(), u += e.readSVarint(), o === 1 && (i && r.push(i), i = []), i && i.push(new mi(c, u));
      else if (o === 7)
        i && i.push(i[0].clone());
      else
        throw new Error(`unknown command ${o}`);
    }
    return i && r.push(i), r;
  }
  bbox() {
    const e = this._pbf;
    e.pos = this._geometry;
    const t = e.readVarint() + e.pos;
    let r = 1, i = 0, o = 0, l = 0, c = 1 / 0, u = -1 / 0, f = 1 / 0, p = -1 / 0;
    for (; e.pos < t; ) {
      if (i <= 0) {
        const d = e.readVarint();
        r = d & 7, i = d >> 3;
      }
      if (i--, r === 1 || r === 2)
        o += e.readSVarint(), l += e.readSVarint(), o < c && (c = o), o > u && (u = o), l < f && (f = l), l > p && (p = l);
      else if (r !== 7)
        throw new Error(`unknown command ${r}`);
    }
    return [c, f, u, p];
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {Feature}
   */
  toGeoJSON(e, t, r) {
    const i = this.extent * Math.pow(2, r), o = this.extent * e, l = this.extent * t, c = this.loadGeometry();
    function u(g) {
      return [
        (g.x + o) * 360 / i - 180,
        360 / Math.PI * Math.atan(Math.exp((1 - (g.y + l) * 2 / i) * Math.PI)) - 90
      ];
    }
    function f(g) {
      return g.map(u);
    }
    let p;
    if (this.type === 1) {
      const g = [];
      for (const b of c)
        g.push(b[0]);
      const y = f(g);
      p = g.length === 1 ? { type: "Point", coordinates: y[0] } : { type: "MultiPoint", coordinates: y };
    } else if (this.type === 2) {
      const g = c.map(f);
      p = g.length === 1 ? { type: "LineString", coordinates: g[0] } : { type: "MultiLineString", coordinates: g };
    } else if (this.type === 3) {
      const g = pM(c), y = [];
      for (const b of g)
        y.push(b.map(f));
      p = y.length === 1 ? { type: "Polygon", coordinates: y[0] } : { type: "MultiPolygon", coordinates: y };
    } else
      throw new Error("unknown feature type");
    const d = {
      type: "Feature",
      geometry: p,
      properties: this.properties
    };
    return this.id != null && (d.id = this.id), d;
  }
}
hp.types = ["Unknown", "Point", "LineString", "Polygon"];
function fM(s, e, t) {
  s === 1 ? e.id = t.readVarint() : s === 2 ? dM(t, e) : s === 3 ? e.type = /** @type {0 | 1 | 2 | 3} */
  t.readVarint() : s === 4 && (e._geometry = t.pos);
}
function dM(s, e) {
  const t = s.readVarint() + s.pos;
  for (; s.pos < t; ) {
    const r = e._keys[s.readVarint()], i = e._values[s.readVarint()];
    e.properties[r] = i;
  }
}
function pM(s) {
  const e = s.length;
  if (e <= 1) return [s];
  const t = [];
  let r, i;
  for (let o = 0; o < e; o++) {
    const l = mM(s[o]);
    l !== 0 && (i === void 0 && (i = l < 0), i === l < 0 ? (r && t.push(r), r = [s[o]]) : r && r.push(s[o]));
  }
  return r && t.push(r), t;
}
function mM(s) {
  let e = 0;
  for (let t = 0, r = s.length, i = r - 1, o, l; t < r; i = t++)
    o = s[t], l = s[i], e += (l.x - o.x) * (o.y + l.y);
  return e;
}
let gM = class {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(e, t) {
    this.version = 1, this.name = "", this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(_M, this, t), this.length = this._features.length;
  }
  /** return feature `i` from this layer as a `VectorTileFeature`
   * @param {number} i
   */
  feature(e) {
    if (e < 0 || e >= this._features.length) throw new Error("feature index out of bounds");
    this._pbf.pos = this._features[e];
    const t = this._pbf.readVarint() + this._pbf.pos;
    return new hp(this._pbf, t, this.extent, this._keys, this._values);
  }
};
function _M(s, e, t) {
  s === 15 ? e.version = t.readVarint() : s === 1 ? e.name = t.readString() : s === 5 ? e.extent = t.readVarint() : s === 2 ? e._features.push(t.pos) : s === 3 ? e._keys.push(t.readString()) : s === 4 && e._values.push(yM(t));
}
function yM(s) {
  let e = null;
  const t = s.readVarint() + s.pos;
  for (; s.pos < t; ) {
    const r = s.readVarint() >> 3;
    e = r === 1 ? s.readString() : r === 2 ? s.readFloat() : r === 3 ? s.readDouble() : r === 4 ? s.readVarint64() : r === 5 ? s.readVarint() : r === 6 ? s.readSVarint() : r === 7 ? s.readBoolean() : null;
  }
  if (e == null)
    throw new Error("unknown feature value");
  return e;
}
class vM {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(e, t) {
    this.layers = e.readFields(wM, {}, t);
  }
}
function wM(s, e, t) {
  if (s === 3) {
    const r = new gM(t, t.readVarint() + t.pos);
    r.length && (e[r.name] = r);
  }
}
const pc = 65536 * 65536, Xf = 1 / pc, xM = 12, Yf = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8"), $l = 0, jo = 1, fs = 2, $o = 5;
class bM {
  /**
   * @param {Uint8Array | ArrayBuffer} [buf]
   */
  constructor(e = new Uint8Array(16)) {
    this.buf = ArrayBuffer.isView(e) ? e : new Uint8Array(e), this.dataView = new DataView(this.buf.buffer), this.pos = 0, this.type = 0, this.length = this.buf.length;
  }
  // === READING =================================================================
  /**
   * @template T
   * @param {(tag: number, result: T, pbf: Pbf) => void} readField
   * @param {T} result
   * @param {number} [end]
   */
  readFields(e, t, r = this.length) {
    for (; this.pos < r; ) {
      const i = this.readVarint(), o = i >> 3, l = this.pos;
      this.type = i & 7, e(o, t, this), this.pos === l && this.skip(i);
    }
    return t;
  }
  /**
   * @template T
   * @param {(tag: number, result: T, pbf: Pbf) => void} readField
   * @param {T} result
   */
  readMessage(e, t) {
    return this.readFields(e, t, this.readVarint() + this.pos);
  }
  readFixed32() {
    const e = this.dataView.getUint32(this.pos, !0);
    return this.pos += 4, e;
  }
  readSFixed32() {
    const e = this.dataView.getInt32(this.pos, !0);
    return this.pos += 4, e;
  }
  // 64-bit int handling is based on github.com/dpw/node-buffer-more-ints (MIT-licensed)
  readFixed64() {
    const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * pc;
    return this.pos += 8, e;
  }
  readSFixed64() {
    const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * pc;
    return this.pos += 8, e;
  }
  readFloat() {
    const e = this.dataView.getFloat32(this.pos, !0);
    return this.pos += 4, e;
  }
  readDouble() {
    const e = this.dataView.getFloat64(this.pos, !0);
    return this.pos += 8, e;
  }
  /**
   * @param {boolean} [isSigned]
   */
  readVarint(e) {
    const t = this.buf;
    let r, i;
    return i = t[this.pos++], r = i & 127, i < 128 || (i = t[this.pos++], r |= (i & 127) << 7, i < 128) || (i = t[this.pos++], r |= (i & 127) << 14, i < 128) || (i = t[this.pos++], r |= (i & 127) << 21, i < 128) ? r : (i = t[this.pos], r |= (i & 15) << 28, TM(r, e, this));
  }
  readVarint64() {
    return this.readVarint(!0);
  }
  readSVarint() {
    const e = this.readVarint();
    return e % 2 === 1 ? (e + 1) / -2 : e / 2;
  }
  readBoolean() {
    return !!this.readVarint();
  }
  readString() {
    const e = this.readVarint() + this.pos, t = this.pos;
    return this.pos = e, e - t >= xM && Yf ? Yf.decode(this.buf.subarray(t, e)) : BM(this.buf, t, e);
  }
  readBytes() {
    const e = this.readVarint() + this.pos, t = this.buf.subarray(this.pos, e);
    return this.pos = e, t;
  }
  // verbose for performance reasons; doesn't affect gzipped size
  /**
   * @param {number[]} [arr]
   * @param {boolean} [isSigned]
   */
  readPackedVarint(e = [], t) {
    const r = this.readPackedEnd();
    for (; this.pos < r; ) e.push(this.readVarint(t));
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedSVarint(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readSVarint());
    return e;
  }
  /** @param {boolean[]} [arr] */
  readPackedBoolean(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readBoolean());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedFloat(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readFloat());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedDouble(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readDouble());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedFixed32(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readFixed32());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedSFixed32(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readSFixed32());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedFixed64(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readFixed64());
    return e;
  }
  /** @param {number[]} [arr] */
  readPackedSFixed64(e = []) {
    const t = this.readPackedEnd();
    for (; this.pos < t; ) e.push(this.readSFixed64());
    return e;
  }
  readPackedEnd() {
    return this.type === fs ? this.readVarint() + this.pos : this.pos + 1;
  }
  /** @param {number} val */
  skip(e) {
    const t = e & 7;
    if (t === $l) for (; this.buf[this.pos++] > 127; )
      ;
    else if (t === fs) this.pos = this.readVarint() + this.pos;
    else if (t === $o) this.pos += 4;
    else if (t === jo) this.pos += 8;
    else throw new Error(`Unimplemented type: ${t}`);
  }
  // === WRITING =================================================================
  /**
   * @param {number} tag
   * @param {number} type
   */
  writeTag(e, t) {
    this.writeVarint(e << 3 | t);
  }
  /** @param {number} min */
  realloc(e) {
    let t = this.length || 16;
    for (; t < this.pos + e; ) t *= 2;
    if (t !== this.length) {
      const r = new Uint8Array(t);
      r.set(this.buf), this.buf = r, this.dataView = new DataView(r.buffer), this.length = t;
    }
  }
  finish() {
    return this.length = this.pos, this.pos = 0, this.buf.subarray(0, this.length);
  }
  /** @param {number} val */
  writeFixed32(e) {
    this.realloc(4), this.dataView.setInt32(this.pos, e, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeSFixed32(e) {
    this.realloc(4), this.dataView.setInt32(this.pos, e, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeFixed64(e) {
    this.realloc(8), this.dataView.setInt32(this.pos, e & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * Xf), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeSFixed64(e) {
    this.realloc(8), this.dataView.setInt32(this.pos, e & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * Xf), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeVarint(e) {
    if (e = +e || 0, e > 268435455 || e < 0) {
      SM(e, this);
      return;
    }
    this.realloc(4), this.buf[this.pos++] = e & 127 | (e > 127 ? 128 : 0), !(e <= 127) && (this.buf[this.pos++] = (e >>>= 7) & 127 | (e > 127 ? 128 : 0), !(e <= 127) && (this.buf[this.pos++] = (e >>>= 7) & 127 | (e > 127 ? 128 : 0), !(e <= 127) && (this.buf[this.pos++] = e >>> 7 & 127)));
  }
  /** @param {number} val */
  writeSVarint(e) {
    this.writeVarint(e < 0 ? -e * 2 - 1 : e * 2);
  }
  /** @param {boolean} val */
  writeBoolean(e) {
    this.writeVarint(+e);
  }
  /** @param {string} str */
  writeString(e) {
    e = String(e), this.realloc(e.length * 4), this.pos++;
    const t = this.pos;
    this.pos = UM(this.buf, e, this.pos);
    const r = this.pos - t;
    r >= 128 && Zf(t, r, this), this.pos = t - 1, this.writeVarint(r), this.pos += r;
  }
  /** @param {number} val */
  writeFloat(e) {
    this.realloc(4), this.dataView.setFloat32(this.pos, e, !0), this.pos += 4;
  }
  /** @param {number} val */
  writeDouble(e) {
    this.realloc(8), this.dataView.setFloat64(this.pos, e, !0), this.pos += 8;
  }
  /** @param {Uint8Array} buffer */
  writeBytes(e) {
    const t = e.length;
    this.writeVarint(t), this.realloc(t);
    for (let r = 0; r < t; r++) this.buf[this.pos++] = e[r];
  }
  /**
   * @template T
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeRawMessage(e, t) {
    this.pos++;
    const r = this.pos;
    e(t, this);
    const i = this.pos - r;
    i >= 128 && Zf(r, i, this), this.pos = r - 1, this.writeVarint(i), this.pos += i;
  }
  /**
   * @template T
   * @param {number} tag
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeMessage(e, t, r) {
    this.writeTag(e, fs), this.writeRawMessage(t, r);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedVarint(e, t) {
    t.length && this.writeMessage(e, PM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSVarint(e, t) {
    t.length && this.writeMessage(e, EM, t);
  }
  /**
   * @param {number} tag
   * @param {boolean[]} arr
   */
  writePackedBoolean(e, t) {
    t.length && this.writeMessage(e, OM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFloat(e, t) {
    t.length && this.writeMessage(e, CM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedDouble(e, t) {
    t.length && this.writeMessage(e, LM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed32(e, t) {
    t.length && this.writeMessage(e, DM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed32(e, t) {
    t.length && this.writeMessage(e, IM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed64(e, t) {
    t.length && this.writeMessage(e, FM, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed64(e, t) {
    t.length && this.writeMessage(e, RM, t);
  }
  /**
   * @param {number} tag
   * @param {Uint8Array} buffer
   */
  writeBytesField(e, t) {
    this.writeTag(e, fs), this.writeBytes(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed32Field(e, t) {
    this.writeTag(e, $o), this.writeFixed32(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed32Field(e, t) {
    this.writeTag(e, $o), this.writeSFixed32(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed64Field(e, t) {
    this.writeTag(e, jo), this.writeFixed64(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed64Field(e, t) {
    this.writeTag(e, jo), this.writeSFixed64(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeVarintField(e, t) {
    this.writeTag(e, $l), this.writeVarint(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSVarintField(e, t) {
    this.writeTag(e, $l), this.writeSVarint(t);
  }
  /**
   * @param {number} tag
   * @param {string} str
   */
  writeStringField(e, t) {
    this.writeTag(e, fs), this.writeString(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFloatField(e, t) {
    this.writeTag(e, $o), this.writeFloat(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeDoubleField(e, t) {
    this.writeTag(e, jo), this.writeDouble(t);
  }
  /**
   * @param {number} tag
   * @param {boolean} val
   */
  writeBooleanField(e, t) {
    this.writeVarintField(e, +t);
  }
}
function TM(s, e, t) {
  const r = t.buf;
  let i, o;
  if (o = r[t.pos++], i = (o & 112) >> 4, o < 128 || (o = r[t.pos++], i |= (o & 127) << 3, o < 128) || (o = r[t.pos++], i |= (o & 127) << 10, o < 128) || (o = r[t.pos++], i |= (o & 127) << 17, o < 128) || (o = r[t.pos++], i |= (o & 127) << 24, o < 128) || (o = r[t.pos++], i |= (o & 1) << 31, o < 128)) return Sn(s, i, e);
  throw new Error("Expected varint not more than 10 bytes");
}
function Sn(s, e, t) {
  return t ? e * 4294967296 + (s >>> 0) : (e >>> 0) * 4294967296 + (s >>> 0);
}
function SM(s, e) {
  let t, r;
  if (s >= 0 ? (t = s % 4294967296 | 0, r = s / 4294967296 | 0) : (t = ~(-s % 4294967296), r = ~(-s / 4294967296), t ^ 4294967295 ? t = t + 1 | 0 : (t = 0, r = r + 1 | 0)), s >= 18446744073709552e3 || s < -18446744073709552e3)
    throw new Error("Given varint doesn't fit into 10 bytes");
  e.realloc(10), MM(t, r, e), AM(r, e);
}
function MM(s, e, t) {
  t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos] = s & 127;
}
function AM(s, e) {
  const t = (s & 7) << 4;
  e.buf[e.pos++] |= t | ((s >>>= 3) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127)))));
}
function Zf(s, e, t) {
  const r = e <= 16383 ? 1 : e <= 2097151 ? 2 : e <= 268435455 ? 3 : Math.floor(Math.log(e) / (Math.LN2 * 7));
  t.realloc(r);
  for (let i = t.pos - 1; i >= s; i--) t.buf[i + r] = t.buf[i];
}
function PM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeVarint(s[t]);
}
function EM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeSVarint(s[t]);
}
function CM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeFloat(s[t]);
}
function LM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeDouble(s[t]);
}
function OM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeBoolean(s[t]);
}
function DM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeFixed32(s[t]);
}
function IM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeSFixed32(s[t]);
}
function FM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeFixed64(s[t]);
}
function RM(s, e) {
  for (let t = 0; t < s.length; t++) e.writeSFixed64(s[t]);
}
function BM(s, e, t) {
  let r = "", i = e;
  for (; i < t; ) {
    const o = s[i];
    let l = null, c = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
    if (i + c > t) break;
    let u, f, p;
    c === 1 ? o < 128 && (l = o) : c === 2 ? (u = s[i + 1], (u & 192) === 128 && (l = (o & 31) << 6 | u & 63, l <= 127 && (l = null))) : c === 3 ? (u = s[i + 1], f = s[i + 2], (u & 192) === 128 && (f & 192) === 128 && (l = (o & 15) << 12 | (u & 63) << 6 | f & 63, (l <= 2047 || l >= 55296 && l <= 57343) && (l = null))) : c === 4 && (u = s[i + 1], f = s[i + 2], p = s[i + 3], (u & 192) === 128 && (f & 192) === 128 && (p & 192) === 128 && (l = (o & 15) << 18 | (u & 63) << 12 | (f & 63) << 6 | p & 63, (l <= 65535 || l >= 1114112) && (l = null))), l === null ? (l = 65533, c = 1) : l > 65535 && (l -= 65536, r += String.fromCharCode(l >>> 10 & 1023 | 55296), l = 56320 | l & 1023), r += String.fromCharCode(l), i += c;
  }
  return r;
}
function UM(s, e, t) {
  for (let r = 0, i, o; r < e.length; r++) {
    if (i = e.charCodeAt(r), i > 55295 && i < 57344)
      if (o)
        if (i < 56320) {
          s[t++] = 239, s[t++] = 191, s[t++] = 189, o = i;
          continue;
        } else
          i = o - 55296 << 10 | i - 56320 | 65536, o = null;
      else {
        i > 56319 || r + 1 === e.length ? (s[t++] = 239, s[t++] = 191, s[t++] = 189) : o = i;
        continue;
      }
    else o && (s[t++] = 239, s[t++] = 191, s[t++] = 189, o = null);
    i < 128 ? s[t++] = i : (i < 2048 ? s[t++] = i >> 6 | 192 : (i < 65536 ? s[t++] = i >> 12 | 224 : (s[t++] = i >> 18 | 240, s[t++] = i >> 12 & 63 | 128), s[t++] = i >> 6 & 63 | 128), s[t++] = i & 63 | 128);
  }
  return t;
}
var kM = Object.defineProperty, zM = (s, e, t) => e in s ? kM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Xo = (s, e, t) => zM(s, typeof e != "symbol" ? e + "" : e, t);
class NM extends Ec {
  constructor() {
    super(), Xo(this, "info", {
      version: "2.0.0",
      description: "Vector Tile Texture Loader (Refactored)"
    }), Xo(this, "dataType", "mvt"), Xo(this, "_loader", new vi(We.manager)), Xo(this, "_render", new P2()), this._loader.setResponseType("arraybuffer");
  }
  /**
   * Override load to handle custom MVT loading logic
   * 重写 load 以处理自定义 MVT 加载逻辑
   */
  async performLoad(e, t) {
    const r = await this._loader.loadAsync(e), i = new vM(new bM(r)), o = t.source.style, l = this.drawTile(i, o, t.z);
    return new Is(l);
  }
  /**
   * Draw tile to OffscreenCanvas
   * 在离屏画布上绘制瓦片
   */
  drawTile(e, t, r) {
    const l = new OffscreenCanvas(256, 256), c = l.getContext("2d");
    if (!c)
      throw new Error("Canvas context is not available");
    if (t)
      for (const u in t.layer) {
        const f = t.layer[u];
        if (r < (f.minLevel ?? 1) || r > (f.maxLevel ?? 20))
          continue;
        const p = e.layers[u];
        if (p) {
          const d = 256 / p.extent;
          this._renderLayer(c, p, f, d);
        }
      }
    else
      for (const u in e.layers) {
        const f = e.layers[u], p = 256 / f.extent;
        this._renderLayer(c, f, void 0, p);
      }
    return l;
  }
  _renderLayer(e, t, r, i = 1) {
    e.save();
    for (let o = 0; o < t.length; o++) {
      const l = t.feature(o);
      this._renderFeature(e, l, r, i);
    }
    e.restore();
  }
  _renderFeature(e, t, r = {}, i = 1) {
    const o = [
      rt.Unknown,
      rt.Point,
      rt.Linestring,
      rt.Polygon
    ][t.type], l = {
      geometry: t.loadGeometry(),
      properties: t.properties
    };
    this._render.render(e, o, l, r, i);
  }
  // #region GeoJSON Conversion Utilities (Preserved functionality)
  /**
   * Convert Vector Tile to GeoJSON FeatureCollection
   * 将整个矢量瓦片转换为 GeoJSON FeatureCollection
   */
  convertVectorTileToGeoJSON(e) {
    const t = [];
    for (const r in e.layers) {
      const i = e.layers[r];
      for (let o = 0; o < i.length; o++) {
        const l = i.feature(o), c = [
          rt.Unknown,
          rt.Point,
          rt.Linestring,
          rt.Polygon,
          rt.Unknown
        ][l.type], u = {
          geometry: l.loadGeometry(),
          properties: l.properties
        }, f = this._convertToGeoJSONFeature(u, c);
        f && (f.properties._layer = r, t.push(f));
      }
    }
    return {
      type: "FeatureCollection",
      features: t
    };
  }
  _convertToGeoJSONFeature(e, t) {
    const r = this._convertGeometryToGeoJSON(e.geometry, t);
    return r ? {
      type: "Feature",
      geometry: r,
      properties: e.properties || {},
      id: e.id
    } : null;
  }
  _convertGeometryToGeoJSON(e, t) {
    switch (t) {
      case rt.Point:
        return this._convertPointGeometry(e);
      case rt.Linestring:
        return this._convertLineGeometry(e);
      case rt.Polygon:
        return this._convertPolygonGeometry(e);
      default:
        return console.warn("Unknown geometry type:", t), null;
    }
  }
  _convertPointGeometry(e) {
    const t = [];
    for (const r of e)
      for (const i of r)
        t.push([i.x, i.y]);
    return t.length === 0 ? null : t.length === 1 ? { type: "Point", coordinates: t[0] } : { type: "MultiPoint", coordinates: t };
  }
  _convertLineGeometry(e) {
    const t = [];
    for (const r of e) {
      const i = [];
      for (const o of r)
        i.push([o.x, o.y]);
      i.length >= 2 && t.push(i);
    }
    return t.length === 0 ? null : t.length === 1 ? { type: "LineString", coordinates: t[0] } : { type: "MultiLineString", coordinates: t };
  }
  _convertPolygonGeometry(e) {
    const t = [];
    let r = [];
    for (const i of e) {
      const o = [];
      for (const l of i)
        o.push([l.x, l.y]);
      o.length >= 4 && (this._isRingClockwise(o) || r.length === 0 ? (r.length > 0 && t.push(r), r = [o]) : r.push(o));
    }
    return r.length > 0 && t.push(r), t.length === 0 ? null : t.length === 1 ? { type: "Polygon", coordinates: t[0] } : { type: "MultiPolygon", coordinates: t };
  }
  _isRingClockwise(e) {
    let t = 0;
    for (let r = 0; r < e.length - 1; r++) {
      const [i, o] = e[r], [l, c] = e[r + 1];
      t += (l - i) * (c + o);
    }
    return t > 0;
  }
  // #endregion
}
var HM = Object.defineProperty, VM = (s, e, t) => e in s ? HM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Xl = (s, e, t) => VM(s, typeof e != "symbol" ? e + "" : e, t);
class WM extends Ec {
  constructor() {
    super(...arguments), Xl(this, "info", {
      version: "1.0.0",
      description: "Loader for standard web images (XYZ tiles)."
    }), Xl(this, "dataType", "image"), Xl(this, "loader", new xd(We.manager));
  }
  /**
   * 执行加载
   * @param url 
   * @param context 
   */
  async performLoad(e, t) {
    const r = await this.loader.loadAsync(e).catch(() => new Image(1, 1)), i = new Rn();
    i.colorSpace = na;
    const { bounds: o } = t;
    return o[2] - o[0] < 1 || o[3] - o[1] < 1 ? i.image = this.extractSubImage(r, o) : i.image = r, i.needsUpdate = !0, i;
  }
  /**
   * 提取子图像
   * @param image 
   * @param bounds 
   */
  extractSubImage(e, t) {
    const r = e.width, i = new OffscreenCanvas(r, r), o = i.getContext("2d"), { sx: l, sy: c, sw: u, sh: f } = ha.getBoundsCoord(t, r);
    return o.drawImage(e, l, c, u, f, 0, 0, r, r), i;
  }
}
function GM() {
  We.registerMaterialLoader(new WM()), We.registerMaterialLoader(new NM()), We.registerGeometryLoader(new oM()), We.registerGeometryLoader(new J2()), We.registerMeshLoader(new hM()), console.log("[TileLoaderFactory] Default loaders registered.");
}
var jM = Object.defineProperty, $M = (s, e, t) => e in s ? jM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Gi = (s, e, t) => $M(s, typeof e != "symbol" ? e + "" : e, t);
class Kf extends np {
  // Rendering altitude 渲染高度
  // private _levelOffset = 2;
  // private _minLevelFloor = 5;   // Don't go below level 8, adjust according to scene 不要低于8级，按你场景自己调
  // public readonly type: string = "vector";
  /**
   * Create a new VectorTileLayer instance.
   * 创建一个新的 VectorTileLayer 实例。
   * 
   * @param id Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    if (super(e, t), Gi(this, "layerType", "vector"), Gi(this, "_tileDataMap", /* @__PURE__ */ new Map()), Gi(this, "_renderer"), Gi(this, "_style"), Gi(this, "_feaList", []), Gi(this, "_collision", !1), Gi(this, "_renderAltitude", 0), !t.style)
      throw new Error("VectorTileLayer must provide style configuration! VectorTileLayer 必须提供样式配置");
    this._style = t.style, this._collision = t.collision || !1, this._featureFilter = t.featureFilter, this._renderAltitude = t.altitude || 0, this._rootTile.setDataOnlyMode(!0), this._setupDataModeAndListenersForChildren(), this._setupLifeCycleListeners();
  }
  // private _computeDynamicMinLevel(): number {
  //     let currentLevel = 0;
  //
  //     this._rootTile.traverse(tile => {
  //         if ((tile as any).isTile && (tile as any).loaded && (tile as any).inFrustum) {
  //             currentLevel = Math.max(currentLevel, tile.z);
  //         }
  //     });
  //
  //     if (currentLevel === 0) {
  //         // Initial stage with few tiles, fallback to configured minLevel
  //         // 初始阶段还没什么瓦片，退回配置里的 minLevel
  //         return this.minLevel;
  //     }
  //
  //     const desired = currentLevel - this._levelOffset;
  //     return Math.max(this._minLevelFloor, Math.min(desired, this.maxLevel));
  // }
  /**
   * Create the tile loader for this layer.
   * 创建此图层的瓦片加载器。
   * 
   * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
   * @protected
   */
  createLoader() {
    const e = new Cc();
    return Array.isArray(this.source) ? e.vtSource = this.source[0] : e.vtSource = this.source, e;
  }
  /**
  * Set all child tiles to data mode and add necessary event listeners to them.
  * 设置所有子瓦片为数据模式，并为它们添加必要的事件监听器
  */
  _setupDataModeAndListenersForChildren() {
    const e = (t) => {
      t !== this._rootTile && t.setDataOnlyMode(!0), this._addShownListenerToTile(t), this._addUnloadListenerToTile(t);
    };
    this._rootTile.addEventListener("tile-created", (t) => {
      const r = t.tile;
      e(r);
    }), this._rootTile.traverse((t) => {
      t.isTile && e(t);
    });
  }
  _addShownListenerToTile(e) {
    const t = (r) => {
      const i = r.tile, o = `${i.z}-${i.x}-${i.y}`, l = !!this._renderer, c = this._tileDataMap.get(o);
      l && c && this._renderer.processTileData(i, c.data);
    };
    e.addEventListener("tile-shown", t);
  }
  _addUnloadListenerToTile(e) {
    const t = (r) => {
      const i = r.tile || r.target, o = `${i.z}-${i.x}-${i.y}`;
      if (this._renderer)
        try {
          this._renderer.removeFeaturesByTileKey(o);
        } catch {
        }
      this._tileDataMap.delete(o);
    };
    e.addEventListener("unload", t);
  }
  /**
   * Set layer altitude.
   * 设置图层高度 (海拔)。
   * 
   * @param altitude Altitude value. 高度值。
   * @description 
   * Modify layer position in vertical direction.
   * 修改图层在垂直方向上的位置。
   */
  setAltitude(e) {
    return super.setAltitude(0), this._renderAltitude = e, this._renderer && this._renderer.setAltitude(e), this;
  }
  /**
   * Get current layer altitude.
   * 获取当前图层高度。
   * 
   * @returns {number} Altitude value. 高度值。
   */
  getAltitude() {
    return this._renderAltitude;
  }
  /**
   * Add tile-hidden event listener for a single tile.
   * 为单个瓦片添加 tile-hidden 事件监听器
   * @param tile
   * @private
   */
  //@ts-ignore
  _addHiddenListenerToTile(e) {
    const t = (r) => {
      const i = r.tile, o = `${i.z}-${i.x}-${i.y}`;
      if (this._renderer)
        try {
          this._renderer.hideFeaturesByTileKey(o);
        } catch {
        }
    };
    e.addEventListener("tile-hidden", t);
  }
  /**
   * Unified lifecycle listener management, responsible for data and renderer linkage.
   * 统一管理生命周期监听，负责数据和渲染器的联动
  */
  _setupLifeCycleListeners() {
    this._rootTile.addEventListener("tile-loaded", (e) => {
      const t = e.tile, r = `${t.z}-${t.x}-${t.y}`, i = this.getVectorDataFromTile(t);
      if (!i) {
        console.warn(`[VectorTileLayer] Tile ${r} loaded but has no vector data.`);
        return;
      }
      if (i.vectorData?.dataFormat === "mvt" && this._tileDataMap.set(r, {
        data: i,
        tile: t,
        timestamp: Date.now(),
        pending: !1
        // Whether to render 是否渲染
      }), t.showing && this._renderer && i.vectorData?.dataFormat === "mvt")
        try {
          this._renderer.processTileData(t, i);
        } catch {
        }
    });
  }
  /**
   * Extract vector data from tile geometry.
   * 从瓦片几何体中提取矢量数据
   */
  getVectorDataFromTile(e) {
    return !e.geometry || !e.getVectorData() ? null : e.getVectorData();
  }
  // --- Public data access methods ---
  // --- 公开数据访问方法 ---
  /**
   * Get currently visible vector tile data.
   * 获取当前可见的矢量瓦片数据。
   * 
   * @returns {Array<{ tileKey: string, data: any, tile: Tile }>} Array of visible tile data. 可见瓦片数据的数组。
   */
  getVisibleVectorTiles() {
    const e = [];
    return this._rootTile.traverse((t) => {
      if (t.isTile && t.loaded && t.inFrustum) {
        const r = `${t.z}-${t.x}-${t.y}`, i = this._tileDataMap.get(r);
        i && e.push({
          tileKey: r,
          data: i.data,
          tile: i.tile
        });
      }
    }), e;
  }
  /**
   * Get all loaded vector data.
   * 获取所有已加载的矢量数据。
   * 
   * @returns {Map<string, any>} Map of all loaded vector data. 所有已加载矢量数据的 Map。
   */
  getAllVectorData() {
    return new Map(this._tileDataMap);
  }
  /**
   * Get specific tile data by coordinates.
   * 根据坐标获取特定瓦片数据。
   * 
   * @param x Tile X coordinate. 瓦片 X 坐标。
   * @param y Tile Y coordinate. 瓦片 Y 坐标。
   * @param z Tile Z coordinate (zoom level). 瓦片 Z 坐标（缩放级别）。
   * @returns {any} The vector data for the tile, or null if not found. 瓦片的矢量数据，如果未找到则为 null。
   */
  getVectorData(e, t, r) {
    const i = `${r}-${e}-${t}`, o = this._tileDataMap.get(i);
    return o ? o.data : null;
  }
  // --- Feature Style and Filter ---
  // --- Feature 样式和过滤 ---
  /**
   * Set feature filter.
   * 设置要素过滤器。
   * 
   * @param filter Filter function that returns true to keep the feature. 返回 true 以保留要素的过滤函数。
   */
  setFeatureFilter(e) {
    this._featureFilter = e, this._renderer && this._renderer.setFeatureFilter(e);
  }
  /**
   * Clear feature filter.
   * 清除要素过滤器。
   */
  clearFeatureFilter() {
    this._featureFilter = void 0, this._renderer && this._renderer.clearFeatureFilter();
  }
  /**
   * Set layer opacity.
   * 设置图层透明度。
   * 
   * @param opacity Opacity value (0-1). 透明度值 (0-1)。
   */
  setOpacity(e) {
    this.opacity = e, this._renderer && this._renderer.setOpacity(e);
  }
  // --- Framework Lifecycle ---
  // --- 框架生命周期 ---
  /**
   * Update layer - Override to add vector specific logic.
   * 更新图层 - 重写以添加矢量特定逻辑。
   * 
   * @param camera The camera used for rendering. 用于渲染的相机。
   */
  update(e) {
    !this.enabled || !this.visible || super.update(e);
  }
  /**
   * Override dispose method to clean up vector data.
   * 重写dispose方法，清理矢量数据。
   */
  dispose() {
    this._renderer && this._renderer.dispose(), super.dispose();
  }
  _setRenderer(e) {
    this._renderer = e;
  }
  _getRenderer() {
    return this._renderer || null;
  }
  getStyle() {
    return this._style;
  }
}
var XM = Object.defineProperty, YM = (s, e, t) => e in s ? XM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ZM = (s, e, t) => YM(s, e + "", t);
class fp {
  /**
   * 构造函数
   * @param centralMeridian 中央经线，默认为 0
   */
  constructor(e = 0) {
    ZM(this, "_centralMeridian", 0), this._centralMeridian = e;
  }
  /**
   * 获取中央经线
   */
  get centralMeridian() {
    return this._centralMeridian;
  }
  /**
   * 调整瓦片 X 坐标以适应中央经线
   * @param tileX 原始瓦片 X
   * @param zoom 层级
   */
  adjustTileXWithCentralMeridian(e, t) {
    const r = Math.pow(2, t), i = Math.round(r / 360 * this._centralMeridian);
    let o = e + i;
    return o >= r ? o -= r : o < 0 && (o += r), o;
  }
  /**
   * 计算瓦片左上角（或左下角，取决于坐标系）的投影坐标
   * 注意：这里假设 y 轴向上，且瓦片索引 y 从上到下（TMS vs XYZ 差异需注意，Three.js通常用 WebGL 坐标系）
   * 但根据原有逻辑：
   * px = (x / n) * w - w/2
   * py = h/2 - (y / n) * h  (这里原代码是 h - ... * h * 2，即 h * (1 - 2y/n) = h - 2yh/n... 待确认)
   * 原代码: py = h - (y / Math.pow(2, z)) * h * 2;  (其中 h = mapHeight / 2)
   * 让我们保持原有逻辑的数学等价性。
   */
  getTileOrigin(e, t, r) {
    const i = Math.pow(2, r), o = this.mapWidth, l = this.mapHeight / 2, c = e / i * o - o / 2, u = l - t / i * this.mapHeight;
    return { x: c, y: u };
  }
  /**
   * 获取经纬度范围的投影坐标边界
   */
  getProjectedBoundsFromGeoBounds(e) {
    const [t, r, i, o] = e, l = this.project(t, r), c = this.project(i, o);
    return [l.x, l.y, c.x, c.y];
  }
  /**
   * 获取瓦片的投影坐标边界
   */
  getTileProjectedBounds(e, t, r) {
    const i = this.getTileOrigin(e, t, r), o = this.getTileOrigin(e + 1, t + 1, r);
    return [
      Math.min(i.x, o.x),
      Math.min(i.y, o.y),
      Math.max(i.x, o.x),
      Math.max(i.y, o.y)
    ];
  }
  /**
   * 获取瓦片的经纬度边界
   */
  getTileGeoBounds(e, t, r) {
    const [i, o, l, c] = this.getTileProjectedBounds(e, t, r), u = this.unProject(i, o), f = this.unProject(l, c);
    return [
      Math.min(u.lon, f.lon),
      Math.min(u.lat, f.lat),
      Math.max(u.lon, f.lon),
      Math.max(u.lat, f.lat)
    ];
  }
}
var KM = Object.defineProperty, qM = (s, e, t) => e in s ? KM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, bs = (s, e, t) => qM(s, typeof e != "symbol" ? e + "" : e, t);
const dp = class qo extends fp {
  constructor(e = 0) {
    super(e), bs(this, "ID", "3857"), bs(this, "mapWidth", 2 * Math.PI * qo.LEGACY_EARTH_RADIUS), bs(this, "mapHeight", this.mapWidth), bs(this, "mapDepth", 1);
  }
  project(e, t) {
    const r = Math.PI / 180, i = qo.LEGACY_EARTH_RADIUS, o = (e - this.centralMeridian) * r, l = t * r, c = i * o, u = i * Math.log(Math.tan(Math.PI / 4 + l / 2));
    return { x: c, y: u };
  }
  unProject(e, t) {
    const r = 180 / Math.PI, i = qo.LEGACY_EARTH_RADIUS;
    let o = e / i * r + this.centralMeridian;
    o > 180 && (o -= 360), o < -180 && (o += 360);
    const c = (2 * Math.atan(Math.exp(t / i)) - Math.PI / 2) * r;
    return { lon: o, lat: c };
  }
};
bs(dp, "LEGACY_EARTH_RADIUS", 6378e3);
let pp = dp;
var QM = Object.defineProperty, JM = (s, e, t) => e in s ? QM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ts = (s, e, t) => JM(s, typeof e != "symbol" ? e + "" : e, t);
const mp = class $i extends fp {
  constructor(e = 0) {
    super(e), Ts(this, "ID", "4326"), Ts(this, "mapWidth", 360 * $i.SCALE_FACTOR), Ts(this, "mapHeight", 180 * $i.SCALE_FACTOR), Ts(this, "mapDepth", 1);
  }
  project(e, t) {
    return {
      x: (e - this.centralMeridian) * $i.SCALE_FACTOR,
      y: t * $i.SCALE_FACTOR
    };
  }
  unProject(e, t) {
    return {
      lon: e / $i.SCALE_FACTOR + this.centralMeridian,
      lat: t / $i.SCALE_FACTOR
    };
  }
};
Ts(mp, "SCALE_FACTOR", 100);
let eA = mp;
class iP {
  /**
   * 创建投影实例
   * @param type 投影类型 ID ("3857" | "4326")
   * @param centralMeridian 中央经线，默认为 0
   * @returns MapProjection 实例
   * @throws Error 如果投影类型不支持
   */
  static create(e = "3857", t = 0) {
    switch (e) {
      case "3857":
        return new pp(t);
      case "4326":
        return new eA(t);
      default:
        throw new Error(`[ProjectionFactory] Unsupported projection type: ${e}`);
    }
  }
}
var tA = Object.defineProperty, rA = (s, e, t) => e in s ? tA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Pe = (s, e, t) => rA(s, typeof e != "symbol" ? e + "" : e, t);
class iA {
  constructor(...e) {
  }
  // Allow receiving any arguments 允许接收任意参数
}
const nA = {};
let zn = class gp extends xc(
  bi(
    rn(iA)
  )
) {
  /**
   * Create map instance.
   * 创建地图实例
   * 
   * @param domContainer Map container element or element ID
   *                  地图容器元素或元素ID
   * @param config Map configuration options
   *                地图配置选项
   */
  constructor(e, t) {
    wc(e, "container", "Map container element must be specified");
    const r = ["center", "basemap"];
    for (const D of r)
      Hd(t, D);
    const o = {
      ...t,
      viewer: { ...{
        viewer: {
          antialias: !0,
          stencil: !0,
          logarithmicDepthBuffer: !0
        }
      }.viewer, ...t.viewer }
    };
    super(o), Pe(this, "viewer"), Pe(this, "_rootGroup", new Qt()), Pe(this, "_layers", new globalThis.Map()), Pe(this, "_mapProjection", new pp(0)), Pe(this, "_animationClock", new ta()), Pe(this, "autoUpdate", !0), Pe(this, "updateInterval", 100), Pe(this, "minLevel", 2), Pe(this, "maxLevel", 19), Pe(this, "center"), Pe(this, "prjcenter"), Pe(this, "_layerContainer"), Pe(this, "_eventState", {
      loaded: { listened: !1 }
      // Load event parameters 加载事件参数
    }), Pe(this, "_canvasMgr", new $T()), Pe(this, "_collisionEngine"), Pe(this, "_onLoadHooks"), Pe(this, "_minZoom", 0), Pe(this, "_maxZoom", 22), Pe(this, "_ZOOM_MIN_CONST", 0), Pe(this, "_ZOOM_MAX_CONST", 22), Pe(this, "_minZoomDistance", 500), Pe(this, "_maxZoomDistance", 8e4), Pe(this, "_isZooming", !1), Pe(this, "_zoomStartValue", 0), Pe(this, "_lastZoomForControls", 0), Pe(this, "_overZoom", 0), Pe(this, "_lastCameraDistance", 0), this.initMap(o.basemap), GM(), this.center = this.options.center, this.viewer = new Yb(e, { ...o.viewer, map: this }), this._rootGroup.receiveShadow = !0, this._rootGroup.up.set(0, 0, 1), this._rootGroup.rotation.x = -Math.PI / 2, this.viewer.scene.add(this._rootGroup);
    const l = this.projectToWorld(new I(this.center[0], this.center[1], 0));
    this.prjcenter = l, this.viewer.on("update", () => {
      this.update(this.viewer.camera);
    });
    const c = this.options.viewer ?? {};
    this.viewer.flyToPoint({
      center: this.center,
      distance: typeof this.center[2] == "number" ? this.center[2] : void 0,
      // Angle prioritizes Deg, then fallback to Angle, then fallback to current controls
      // 角度同样优先用 Deg，再 fallback 到 Angle，再 fallback 到当前 controls
      polarDeg: typeof c.polarDeg == "number" ? c.polarDeg : void 0,
      azimuthDeg: typeof c.azimuthDeg == "number" ? c.azimuthDeg : void 0,
      polarAngle: c.polarAngle,
      azimuthAngle: c.azimuthAngle,
      duration: 0,
      curvePath: !1
    }), this._minZoomDistance = this.viewer.controls.minDistance, this._maxZoomDistance = this.viewer.controls.maxDistance;
    const u = this._getCameraDistance();
    this._lastCameraDistance = u, this._layerGroup = new VT(), this.viewer.scene.add(this._layerGroup);
    const f = this.viewer.controls;
    this._minZoomDistance = typeof f?.minDistance == "number" ? f.minDistance : 500, this._maxZoomDistance = typeof f?.maxDistance == "number" ? f.maxDistance : 8e4;
    const d = this.getLayers().find((D) => D.isBaseLayer === !0)?.minLevel ?? this.minLevel;
    this._minZoom = Math.max(this._ZOOM_MIN_CONST, Math.min(this._ZOOM_MAX_CONST, d)), this._maxZoom = this._ZOOM_MAX_CONST;
    const g = this.prjcenter, b = this.viewer.camera.position.clone().clone().sub(g).normalize(), x = dc(t.zoom) ? 13 : t.zoom, E = Math.max(this._minZoom, Math.min(this._maxZoom, x)), M = this._computeDistanceFromZoom(E);
    l.clone().addScaledVector(b, M);
    const A = this.getZoom();
    this._lastZoomForControls = A, this._zoomStartValue = A, this._collisionEngine = new bS(this.viewer.renderer, {
      padding: 8,
      updateInterval: 16,
      // ~60fps
      animationDuration: 200,
      maxFeaturesPerFrame: 2e4,
      strategies: {
        priority: !0,
        grouping: !0,
        proximity: !0
      }
    }), this.on("control-change", MS.debounce((D) => {
      if (!this._rootGroup || !this._collisionEngine)
        return;
      const z = this.getDataZoom(), V = this.getLayers().find((Y) => Y.isBaseLayer === !0)?.maxLevel ?? this.maxLevel, R = this._getCameraDistance(), G = R - this._lastCameraDistance;
      this._lastCameraDistance = R;
      const { max: k } = this._getViewZoomRange(), B = Math.max(0, k - V);
      z < V ? this._overZoom = 0 : G < -1e-3 ? this._overZoom = Math.min(this._overZoom + 1, B) : G > 1e-3 && (this._overZoom = Math.max(this._overZoom - 1, 0));
      const $ = this.getZoom();
      Math.abs($ - this._lastZoomForControls) > 1e-3 && (this._isZooming ? this.trigger("zooming", {
        from: this._zoomStartValue,
        to: $
      }) : (this._isZooming = !0, this._zoomStartValue = this._lastZoomForControls, this.trigger("zoomstart", {
        from: this._zoomStartValue,
        to: $
      })), this._lastZoomForControls = $), this._collisionEngine.update(D.camera);
    }, 10, {
      leading: !1,
      trailing: !0
    })), this.on("control-end", () => {
      this._isZooming && (this._isZooming = !1, this.trigger("zoomend", {
        from: this._zoomStartValue,
        to: this.getZoom()
        // View zoom at end 结束时的视图 zoom
      }));
    }), this._callOnLoadHooks();
  }
  get projection() {
    return this._mapProjection;
  }
  get lon0() {
    return this.projection.centralMeridian;
  }
  /**
  * Project geographic coordinate to map model coordinate
  * 地理坐标投影到地图模型坐标
  * @param coord Geographic coordinate (Long, Lat, Alt)
  * @returns Map model coordinate
  */
  project(e) {
    const t = this.projection.project(e.x, e.y);
    return new I(t.x, t.y, e.z);
  }
  /**
   * Project geographic coordinate to world coordinate
   * 地理坐标投影到世界坐标
   * @param coord Geographic coordinate (Long, Lat, Alt)
   * @returns World coordinate
   */
  projectToWorld(e) {
    return this._rootGroup.localToWorld(this.project(e));
  }
  /**
   * Unproject map model coordinate to geographic coordinate
   * 地图模型坐标反投影到地理坐标
   * @param point Map model coordinate
   * @returns Geographic coordinate (Long, Lat, Alt)
   */
  unproject(e) {
    const t = this.projection.unProject(e.x, e.y);
    return new I(t.lon, t.lat, e.z);
  }
  /**
   * Unproject world coordinate to geographic coordinate
   * 世界坐标反投影到地理坐标
   * @param worldPos World coordinate
   * @returns Geographic coordinate (Long, Lat, Alt)
   */
  unprojectFromWorld(e) {
    return this.unproject(this._rootGroup.worldToLocal(e.clone()));
  }
  /**
   * Get intersection info from geographic coordinate
   * 获取指定地理坐标的交互/地面信息
   * @param geoCoord Geographic coordinate
   * @returns Intersection info
   */
  pickFromGeo(e) {
    const t = this.projectToWorld(e);
    return sc(this, t);
  }
  /**
   * Get intersection info from world coordinate
   * 获取指定世界坐标的交互/地面信息
   * @param worldPos World coordinate
   * @returns Intersection info
   */
  pickFromWorld(e) {
    return sc(this, e);
  }
  /**
   * Get intersection info from screen pixel coordinate
   * 获取指定屏幕坐标的交互/地面信息
   * @param camera Camera instance
   * @param pixel Screen pixel coordinate
   * @returns Intersection info
   */
  pickFromPixel(e, t) {
    return Sd(e, this, t);
  }
  /**
   * Add hook function after load completion.
   * 添加加载完成后的钩子函数
   * 
   * @param fn Function name or function
   *           函数名或函数
   * @param args Additional arguments
   *             附加参数
   * @returns Map class
   *          地图类
   */
  static addOnLoadHook(e, ...t) {
    const r = typeof e == "function" ? e : function() {
      this[e].apply(this, t);
    }, i = this.prototype;
    return i._onLoadHooks = i._onLoadHooks || [], i._onLoadHooks.push(r), this;
  }
  /**
   * Internal method: Call all load hook functions.
   * 内部方法:调用所有加载钩子函数
   */
  _callOnLoadHooks() {
    const e = gp.prototype;
    if (e._onLoadHooks)
      for (let t = 0, r = e._onLoadHooks.length; t < r; t++)
        e._onLoadHooks[t].call(this);
  }
  // ======= Zoom related public APIs =======
  // ======= 缩放相关对外 API =======
  /**
   * Get current "View Zoom Level".
   * 获取当前“视图缩放级别”
   * 
   * @description
   * Mapped to fixed scale [0, 22] based on camera distance.
   * This value can exceed data source maxLevel (e.g., 18), used for UI / Styling / Interaction.
   * 按相机距离映射到固定标尺 [0, 22]。
   * 这个值可以超过数据源的 maxLevel（比如 18），用于 UI / 样式 / 交互。
   */
  getZoom() {
    const e = this.getDataZoom(), r = this.getLayers().find((i) => i.isBaseLayer === !0)?.maxLevel ?? this.maxLevel;
    return e < r ? e : r + this._overZoom;
  }
  /**
  * Get current "Data Zoom Level" (Tile z).
  * 获取当前“数据缩放级别”（瓦片 z）
  * 
  * @description
  * Actual z calculated from TileMap base layer tile tree.
  * Max value limited by data source and TileLayer.maxLevel, e.g., data only goes up to 18.
  * 从 TileMap 的底图瓦片树中统计出来的实际 z。
  * 最大值受数据源和 TileLayer.maxLevel 限制，例如数据只到 18。
   */
  getDataZoom() {
    let e = this.minLevel;
    const t = this.getLayers().find((i) => i.isBaseLayer === !0);
    return !t || !t._rootTile || t._rootTile.traverseVisible((i) => {
      i.showing && i.inFrustum && (e = Math.max(e, i.z));
    }), e;
  }
  /**
   * Get view minimum zoom level.
   * 获取视图最小缩放级别
   */
  getMinZoom() {
    return this._minZoom;
  }
  /**
   * Get view maximum zoom level.
   * 获取视图最大缩放级别
   */
  getMaxZoom() {
    return this._maxZoom;
  }
  /**
  * Set view zoom range.
  * 设置视图缩放范围
  * 
  * @param minZoom Minimum zoom level
  *                最小缩放级别
  * @param maxZoom Maximum zoom level
  *                最大缩放级别
  */
  setZoomRange(e, t) {
    if (e > t) {
      const i = e;
      e = t, t = i;
    }
    this._minZoom = e, this._maxZoom = t;
    const r = this.viewer.controls;
    if (r) {
      const i = this._computeDistanceFromZoom(this._maxZoom), o = this._computeDistanceFromZoom(this._minZoom);
      r.minDistance = i, r.maxDistance = o;
    }
    return this;
  }
  /**
   * Set minimum zoom level.
   * 设置最小缩放级别
   */
  setMinZoom(e) {
    return this.setZoomRange(e, this._maxZoom);
  }
  /**
   * Set maximum zoom level.
   * 设置最大缩放级别
   */
  setMaxZoom(e) {
    return this.setZoomRange(this._minZoom, e);
  }
  /**
   * Set zoom level.
   * 设置缩放级别
   * 
   * @param zoom Target zoom level
   *             目标缩放级别
   * @returns Map instance
   *          地图实例
   */
  setZoom(e) {
    const t = this.getMinZoom(), r = this.getMaxZoom(), i = Math.max(t, Math.min(r, e)), o = this.getZoom(), l = this._computeDistanceFromZoom(i), c = this.viewer.controls, u = c?.target ?? this.prjcenter, f = this.viewer.camera, p = f.position.clone().sub(u).normalize();
    return f.position.copy(u).addScaledVector(p, l), f.updateProjectionMatrix(), typeof c?.update == "function" && c.update(), this._lastZoomForControls = i, this.trigger("zoomend", {
      from: o,
      to: this.getZoom()
    }), this;
  }
  /**
   * Zoom in by specified levels.
   * 放大指定级数
   * 
   * @param delta Zoom in levels, default 1
   *              放大级数，默认 1
   */
  zoomIn(e = 1) {
    return this.setZoom(this.getZoom() + e);
  }
  /**
   * Zoom out by specified levels.
   * 缩小指定级数
   * 
   * @param delta Zoom out levels, default 1
   *              缩小级数，默认 1
   */
  zoomOut(e = 1) {
    return this.setZoom(this.getZoom() - e);
  }
  /**
   * Inverse calculate camera distance to target from view zoom level.
   * 根据视图缩放级别反推相机到目标点的距离
   */
  _computeDistanceFromZoom(e) {
    const t = this._ZOOM_MIN_CONST, r = this._ZOOM_MAX_CONST, i = this._minZoomDistance, o = this._maxZoomDistance;
    if (i <= 0 || i >= o) {
      const p = Math.max(t, Math.min(r, e)), d = (r - p) / (r - t);
      return i + d * (o - i);
    }
    const c = (Math.max(t, Math.min(r, e)) - t) / (r - t), u = i / o;
    return o * Math.pow(u, c);
  }
  /**
   * Initialize map.
   * 初始化地图
   */
  initMap(e) {
    if (this.minLevel = e.minLevel ?? 2, this.maxLevel = e.maxLevel ?? 19, e.Baselayers?.length)
      for (const t of e.Baselayers)
        t.isBaseLayer = !0, this.addTileLayer(t);
    setTimeout(() => {
      const t = {
        timestamp: Ub(),
        targrt: this
      };
      this._eventState.loaded = {
        listened: !0
      }, this.trigger("loaded", t);
    }, 0);
  }
  /**
   * Update map and layers.
   * 更新地图和图层
   */
  update(e) {
    if (!this.autoUpdate) return;
    this._animationClock.getElapsedTime() > this.updateInterval / 1e3 && (this._layers.forEach((r) => {
      r.enabled && r.visible && r.update(e);
    }), this._animationClock.start());
  }
  /**
   * Add layer(s) to the map.
   * 添加图层到地图
   * 
   * @param layerOrLayers Layer object or array of layer objects
   *               图层对象或图层对象数组
   * @param otherLayers Other layer objects
   *                    其他图层对象
   * @returns Current map instance
   *          当前地图实例
   */
  addLayer(e, ...t) {
    if (!e)
      return this;
    Array.isArray(e) || (e = [e]), t?.length && (e = e.concat(t)), t?.length && (e = e.concat(t));
    for (let r = 0, i = e.length; r < i; r++) {
      const o = e[r], l = o.getId();
      if (dc(l))
        throw new Error("Invalid id for the layer: " + l);
      o.isTileLayer ? this.addTileLayer(o) : this.addRegularLayer(o);
    }
    return this;
  }
  /**
  * Remove layer.
  * 移除图层
  */
  removeLayer(e) {
    const t = this._layers.get(e);
    if (t) {
      if (t instanceof Kf) {
        const i = t._getRenderer();
        i && this._layerGroup.remove(i);
      }
      return this._layers.delete(e), this._rootGroup.remove(t), !0;
    }
    const r = this._layerGroup.getLayerById(e);
    return r ? (this._layerContainer.remove(r), r instanceof wi && r?._collision, !0) : (console.warn(`⚠️ Layer does not exist 图层不存在: ${e}`), !1);
  }
  /**
   * Add regular layer (Add to scene only).
   * 添加普通图层（只添加到场景）
   */
  addRegularLayer(e) {
    this._layerGroup.add(e), e._bindMap(this), e instanceof wi && e?._collision && (this._collisionEngine.registerLayer(e), e.setCollisionEngine(this._collisionEngine));
  }
  // addTileLayer(layer: ITileLayer) {   
  //     this.tileLayerManager.addLayer(layer);
  // }
  /**
  * Add tile layer.
  * 添加瓦片图层
  */
  addTileLayer(e) {
    if (this._layers.set(e.getId(), e), this._rootGroup.add(e), e._bindMap(this), e instanceof Kf) {
      const t = e.options || {}, r = new jl(e.getId() + "-vtrender", {
        altitude: e.getAltitude(),
        style: e.getStyle(),
        collision: e._collision,
        // Let render layer inherit vector tile layer's zIndex / depthOffset
        // 让渲染层继承矢量瓦片图层的 zIndex / depthOffset
        zIndex: typeof t.zIndex == "number" ? t.zIndex : void 0,
        depthOffset: typeof t.depthOffset == "number" ? t.depthOffset : void 0
      });
      e._setRenderer(r), this.addRegularLayer(r);
    }
    return this;
  }
  /**
   * Clear all layers.
   * 清空所有图层
   * 
   * @returns Layer container instance
   *          图层容器实例
   */
  clearLayers() {
    return this._layerGroup.clear(), this._layers.forEach((e) => {
      this._rootGroup.remove(e);
    }), this._layers.clear(), this;
  }
  /**
   * Get all layers.
   * 获取所有图层
   * 
   * @returns Array of layers
   *          图层数组
   */
  getLayers() {
    const e = this._layerGroup.getLayers().filter((r) => !(r instanceof jl)), t = Array.from(this._layers.values());
    return [...e, ...t];
  }
  /**
   * Get layer by ID.
   * 根据ID获取图层
   * 
   * @param id Layer ID
   *           图层ID
   * @returns Layer instance or undefined
   *          图层实例或undefined
   */
  getLayerById(e) {
    if (this._layers.has(e))
      return this._layers.get(e);
    const t = this._layerGroup.getLayerById(e);
    if (t)
      return t instanceof jl ? void 0 : t;
  }
  /**
   * Get canvas.
   * 获取画布
   * 
   * @param width Canvas width
   *              画布宽度
   * @param height Canvas height
   *               画布高度
   * @param keySuffix Key suffix
   *                  键名后缀
   * @returns Canvas instance
   *          画布实例
   */
  _getCanvas(e = 40, t = 30, r) {
    return this._canvasMgr.getCanvas(e, t, 1, r);
  }
  /**
   * Get map container.
   * 获取地图容器
   * 
   * @returns Map container instance
   *          地图容器实例
   */
  getContainer() {
    return this.viewer.container;
  }
  /**
   * Get renderer.
   * 获取渲染器
   * 
   * @returns Renderer instance
   *          渲染器实例
   */
  getRenderer() {
    return this.viewer.renderer;
  }
  /**
   * Get camera.
   * 获取相机
   * 
   * @returns Camera instance
   *          相机实例
   */
  getCamera() {
    return this.viewer.camera;
  }
  /**
   * Find all Features at a specific position.
   * 找出某位置的所有Feature
   */
  _findFeaturesAt(e) {
    const t = this, r = t.getRenderer(), i = t.getCamera(), o = r.domElement.getBoundingClientRect(), l = e.x / o.width * 2 - 1, c = -(e.y / o.height) * 2 + 1, u = new Ps();
    u.setFromCamera(new ce(l, c), i);
    const f = t.getLayers().filter(
      (g) => !g?.isSceneLayer && g?.visible === !0
    ), d = u.intersectObjects(f, !0).map((g) => {
      let y = g.object, b = null;
      for (; y; ) {
        if (y instanceof gt) {
          b = y;
          break;
        }
        y = y.parent;
      }
      return !b || b.visible === !1 ? null : {
        feature: b,
        distance: g.distance,
        object: g.object
      };
    }).filter((g) => !!g);
    return d.length ? d.sort((g, y) => g.distance - y.distance) : [];
  }
  /**
   * Get current map center point (Longitude, Latitude).
   * 获取当前地图中心点（经纬度）
   * 
   * @returns Coordinate [lng, lat, height]
   */
  getCenter() {
    const e = this.viewer.controls.target.clone(), t = this.unprojectFromWorld(e);
    return [t.x, t.y, t.z];
  }
  /**
   * Get event position (Screen coordinates).
   * 获取事件位置（屏幕坐标）
   */
  _getEventPosition(e) {
    let t, r;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      t = e.touches[0].clientX, r = e.touches[0].clientY;
    } else
      t = e.clientX, r = e.clientY;
    const i = this.getContainer();
    if (!i) return null;
    const o = i.getBoundingClientRect();
    return {
      x: t - o.left,
      y: r - o.top
    };
  }
  get isInteracting() {
    return this.viewer ? this.viewer.isInteracting : !1;
  }
  /**
   * Internal tool: Get distance from current camera to target point.
   * 内部工具：获取当前相机到目标点的距离
   */
  _getCameraDistance() {
    const e = this.viewer.controls, t = this.viewer.camera, r = e?.target ?? this.prjcenter;
    return e && typeof e.getDistance == "function" ? e.getDistance() : t.position.distanceTo(r);
  }
  /**
   * Internal tool: Calculate theoretically reachable zoom range of view based on current control distance limits.
   * 内部工具：根据当前控制器的距离限制，推算视图理论可达的 zoom 区间
   * 
   * @returns {Object} `{ min: number, max: number }`
   */
  _getViewZoomRange() {
    const e = this.viewer.controls, t = typeof e?.minDistance == "number" ? e.minDistance : this._minZoomDistance, r = typeof e?.maxDistance == "number" ? e.maxDistance : this._maxZoomDistance;
    if (t <= 0 || t >= r) {
      const d = this.getDataZoom();
      return { min: d, max: d };
    }
    const i = r / t, o = Math.log2(i), l = this.getLayers().find((d) => d.isBaseLayer === !0), c = l?.minLevel ?? this.minLevel, u = l?.maxLevel ?? this.maxLevel, f = c, p = u + o;
    return { min: f, max: p };
  }
  /**
   * Fly to specified position.
   * 飞行到指定位置
   * 
   * @param flyConfig Flight parameters object
   *                飞行参数对象
   */
  flyTo(e) {
    this.viewer.flyToAdvanced(e);
  }
  /**
   * Fly to point position.
   * 飞行到指定点的位置
   * 
   * @param flyConfig Flight parameters object
   *                飞行参数对象
   */
  flyToPoint(e) {
    this.viewer.flyToPoint(e);
  }
  /**
   * Destroy map instance, release all resources.
   * 销毁地图实例，释放所有资源
   * 
   * @description
   * This method cleans up the following resources:
   * 1. Remove all event listeners
   * 2. Clear all layers
   * 3. Destroy collision engine
   * 4. Destroy viewer (including renderer, scene, controls, etc.)
   * 5. Clean up DOM container
   * 
   * 该方法会清理以下资源：
   * 1. 移除所有事件监听器
   * 2. 清空所有图层
   * 3. 销毁碰撞引擎
   * 4. 销毁viewer（包括renderer、scene、controls等）
   * 5. 清理DOM容器
   */
  destroy() {
    try {
      this._clearHandlers(), ["control-change", "control-start", "control-end", "zoomstart", "zooming", "zoomend", "loaded"].forEach((t) => {
        const r = this._listenerMap?.get(t);
        r && r.forEach((i, o) => {
          this.off(t, o);
        });
      }), this.clearLayers(), jd.getInstance().clearCache(), this._collisionEngine && (this._collisionEngine = null), this._layerGroup && (this._layerGroup.clear(), this._layerGroup = null), this._canvasMgr && (this._canvasMgr = null), this.viewer && (this.viewer.destroy(), this.viewer = null), this._eventState = {
        loaded: { listened: !1 }
      };
    } catch (e) {
      console.error("Error destroying map 销毁地图时出错:", e);
    }
  }
};
zn.mergeOptions(nA);
const sA = [
  "click",
  // Click 点击
  "dblclick",
  // Double click 双击
  "mousedown",
  // Mouse down 鼠标按下
  "mouseup",
  // Mouse up 鼠标释放
  "mousemove",
  // Mouse move 鼠标移动
  "mouseenter",
  // Mouse enter element (no bubbling) 鼠标进入元素（不冒泡）
  "mouseleave",
  // Mouse leave element (no bubbling) 鼠标离开元素（不冒泡）
  "mouseover",
  // Mouse enter element (bubbling) 鼠标进入元素（冒泡）
  "mouseout"
  // Mouse leave element (bubbling) 鼠标离开元素（冒泡）
];
zn.prototype._removeDomEvents = function() {
};
zn.prototype._registerDomEvents = function() {
  const s = this.viewer.container;
  if (s) {
    let t = null;
    sA.forEach((r) => {
      s.addEventListener(r, (i) => {
        if (!this.viewer)
          return;
        if (r === "mousedown" && (t = {
          x: i.clientX,
          y: i.clientY
        }), r === "click" && t) {
          const c = i.clientX - t.x, u = i.clientY - t.y;
          if (Math.sqrt(c * c + u * u) > 5)
            return;
        }
        let o = Pc(i, this, this.viewer.camera), l = {
          target: this,
          originEvent: i,
          eventName: r,
          screenXY: {
            X: i.screenX,
            Y: i.screenY
          }
        };
        if (o) {
          let c = [o.x, o.y, o.z];
          l = {
            target: this,
            originEvent: i,
            coordinate: c,
            eventName: r,
            screenXY: {
              X: i.screenX,
              Y: i.screenY
            }
          };
        }
        this.trigger(r, l);
      });
    });
  }
};
zn.addOnLoadHook("_registerDomEvents");
var oA = Object.defineProperty, aA = (s, e, t) => e in s ? oA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Yl = (s, e, t) => aA(s, typeof e != "symbol" ? e + "" : e, t);
const lA = [
  "click",
  // Click 点击
  "dblclick",
  // Double click 双击
  "mousedown",
  // Mouse down 鼠标按下
  "mouseup",
  // Mouse up 鼠标释放
  "mousemove",
  // Mouse move 鼠标移动
  "mouseenter",
  // Mouse enter element (no bubbling) 鼠标进入元素（不冒泡）
  "mouseleave",
  // Mouse leave element (no bubbling) 鼠标离开元素（不冒泡）
  "mouseover",
  // Mouse enter element (bubbling) 鼠标进入元素（冒泡）
  "mouseout",
  // Mouse leave element (bubbling) 鼠标离开元素（冒泡）
  "contextmenu",
  "touchstart",
  "touchmove",
  "touchend"
];
class cA extends la {
  constructor() {
    super(...arguments), Yl(this, "_registeredEvents", []), Yl(this, "_mouseDownTime", 0), Yl(this, "_eventCommon", (e) => {
      (e.type === "mousedown" || e.type === "touchstart") && (this._mouseDownTime = Date.now()), !(e.type === "click" && Date.now() - this._mouseDownTime > 300) && this._handleEvent(e, e.type);
    });
  }
  /**
   * Add event hooks.
   * 添加事件钩子。
   */
  addHooks() {
    const t = this.target.getContainer();
    t && lA.forEach((r) => {
      t.addEventListener(r, this._eventCommon), this._registeredEvents.push(r);
    });
  }
  /**
   * Remove event hooks.
   * 移除事件钩子。
   */
  removeHooks() {
    const t = this.target.getContainer();
    t && this._registeredEvents.length > 0 && (this._registeredEvents.forEach((r) => {
      const i = r;
      t.removeEventListener(i, this._eventCommon);
    }), this._registeredEvents = []);
  }
  /**
   * Unified event handling
   * 统一事件处理
   * 
   * @param domEvent Original DOM event
   *                 原始 DOM 事件
   * @param eventType Event type
   *                  事件类型
   */
  _handleEvent(e, t) {
    const r = this.target;
    if (!r || !r.viewer || this._shouldIgnoreEvent(t) || (t === "mousemove" || t === "mouseenter" || t === "mouseleave" || t === "mouseover" || t === "mouseout" || t === "touchmove") && !r.getLayers().some((u) => !u.isSceneLayer && u._feaList?.length > 0))
      return;
    const i = r._getEventPosition(e);
    if (!i) return;
    const o = r._findFeaturesAt(i);
    if (o.length === 0) return;
    const l = o[0].feature;
    switch (t) {
      case "click":
        this._handleClickEvent(l, e);
        break;
      // Mouse / Touch move related events
      // 鼠标 / 触摸移动相关事件
      case "mousemove":
      case "mouseenter":
      case "mouseleave":
      case "mouseover":
      case "mouseout":
      case "touchmove":
        this.handleMoveEvent(l, e);
        break;
      // Other events (dblclick / mousedown / mouseup / contextmenu / touchstart / touchend ...)
      // 其它事件（dblclick / mousedown / mouseup / contextmenu / touchstart / touchend ...）
      default:
        if (l) {
          this._fireFeatureEvent(l, t, e);
          const c = l.getLayer();
          c && c.trigger("feature" + t, {
            feature: l,
            domEvent: e,
            type: "feature" + t
          });
        }
    }
  }
  /**
   * Handle click event
   * 处理点击事件
   * 
   * @param feature Clicked Feature
   *                点击的Feature
   * @param domEvent Original DOM event
   *                 原始DOM事件
   */
  _handleClickEvent(e, t) {
    if (!e) return;
    this._fireFeatureEvent(e, "click", t);
    const r = e.getLayer();
    r && r.trigger("featureclick", {
      feature: e,
      domEvent: t,
      type: "featureclick"
    });
  }
  /**
   * Handle move event (includes mouseenter/leave)
   * 处理移动事件（包含mouseenter/leave）
   * 
   * @param feature Feature under mouse
   *                鼠标下的Feature
   * @param domEvent Original DOM event
   *                 原始DOM事件
   */
  handleMoveEvent(e, t) {
    if (!e) return;
    this._fireFeatureEvent(e, t.type, t);
    const r = e.getLayer();
    r && r.trigger("feature" + t.type, {
      feature: e,
      domEvent: t,
      type: "feature" + t.type
    });
  }
  /**
   * Fire Feature event
   * 触发Feature事件
   * @param feature Feature triggering the event 触发事件的Feature
   * @param eventType Event type 事件类型
   * @param domEvent Original DOM event 原始DOM事件
   */
  _fireFeatureEvent(e, t, r) {
    const i = this.target;
    if (!i || !i.viewer) return;
    let o = r, l, c;
    if ("touches" in r) {
      const d = r.touches[0] || r.changedTouches[0];
      if (!d) return;
      o = {
        currentTarget: r.currentTarget,
        clientX: d.clientX,
        clientY: d.clientY
      }, l = d.screenX, c = d.screenY;
    } else {
      const d = r;
      o = d, l = d.screenX, c = d.screenY;
    }
    const u = Pc(o, i, i.viewer.camera);
    if (!u) return;
    const f = [u.x, u.y, u.z], p = {
      target: e,
      originEvent: r,
      coordinate: f,
      eventName: t,
      screenXY: {
        X: l,
        Y: c
      }
    };
    e.trigger(t, p);
  }
  // ============== Utility Methods 工具方法 ==============
  /**
   * Check if event should be ignored
   * 检查是否应该忽略该事件
   * @param eventType Event type for special judgment 事件类型，用于特殊判断
   */
  _shouldIgnoreEvent(e) {
    const t = this.target;
    return t.viewer ? e === "mousedown" || e === "touchstart" ? !1 : !!t.isInteracting : !0;
  }
}
zn.mergeOptions({
  FeatureEvents: !0,
  onlyVisibleFeatureEvents: !0
});
zn.addOnLoadHook("addHandler", "FeatureEvents", cA);
var uA = Object.defineProperty, hA = (s, e, t) => e in s ? uA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Sr = (s, e, t) => hA(s, typeof e != "symbol" ? e + "" : e, t);
let fA = class {
  constructor(...e) {
  }
};
const _p = class Pn extends bi(
  rn(fA)
) {
  /**
   * @param options UI component options UI 组件配置
   */
  constructor(e = {}) {
    super(e), Sr(this, "_owner"), Sr(this, "_map"), Sr(this, "_worldPosition"), Sr(this, "_coordinate"), Sr(this, "_dom"), Sr(this, "_visible", !1), Sr(this, "_boundMapHandlers", /* @__PURE__ */ new Map()), Sr(this, "_viewerUpdateHandler"), Sr(this, "_positionedOnce", !1);
  }
  /**
   * Subclasses optional: For debugging and style distinction.
   * 子类可选：用于调试和样式区分
   * @returns Class name 类名
   */
  _getClassName() {
    return "UIComponent";
  }
  /**
   * Subclasses optional: Extra offset.
   * 子类可选：额外偏移
   * @returns {Object} Offset `{x, y}` 偏移量
   */
  getOffset() {
    return {
      x: this.options.dx ?? 0,
      y: this.options.dy ?? 0
    };
  }
  /**
   * Add UIComponent to Map or Feature.
   * 将 UIComponent 添加到 Map 或 Feature 上
   * @param owner Map or Feature Map 或 Feature
   */
  addTo(e) {
    if (!e) return this;
    this._owner = e;
    const t = typeof e.getMap == "function" ? e.getMap() : e;
    return t ? (this._map = t, this._bindMapEvents(!0), this.options.single && (Pn._singletons.forEach((r) => {
      r !== this && r.options.single && r._map === t && r.hide();
    }), Pn._singletons.add(this)), this.onAdd && this.onAdd(), this.trigger("add", { owner: e, map: t }), this) : this;
  }
  /**
   * Remove UIComponent from owner Map / Feature.
   * 从所属 Map / Feature 移除 UIComponent
   */
  remove() {
    const e = this._map;
    return this.hideDom(), this._bindMapEvents(!1), this.options.single && Pn._singletons.delete(this), this.onRemove && this.onRemove(), this.trigger("remove", { owner: this._owner, map: e }), this._owner = void 0, this._map = void 0, this;
  }
  /**
   * Show UIComponent.
   * 显示 UIComponent
   * @param coordinate Geographic coordinate ([lng, lat, alt]), optional 地理坐标（[lng, lat, alt]），可选
   */
  show(e) {
    const t = this._map ?? (this._owner && typeof this._owner.getMap == "function" ? this._owner.getMap() : void 0);
    if (!t)
      return this;
    if (this._map = t, this.options.single && (Pn._singletons.forEach((r) => {
      r !== this && r.options.single && r._map === t && r.isVisible() && r.hide();
    }), Pn._singletons.add(this)), !this._dom) {
      const r = this.buildOn();
      this._dom = r, r.style.position = "absolute", typeof this.options.zIndex == "number" && (r.style.zIndex = String(this.options.zIndex));
      const i = t.getContainer();
      if (!i)
        return this;
      i.appendChild(r);
    }
    return this._coordinate = e ? [...e] : void 0, this._visible = !0, this._positionedOnce = !1, this._dom && (this._dom.style.display = "none"), this.trigger("show", { owner: this._owner, map: t }), this;
  }
  /**
   * Hide UIComponent (keep DOM, do not unbind).
   * 隐藏 UIComponent（保留 DOM，不解绑）
   */
  hide() {
    return this._visible = !1, this._dom && (this._dom.style.display = "none"), this._coordinate = void 0, this.trigger("hide", { owner: this._owner, map: this._map }), this;
  }
  /**
   * Remove DOM (called on remove).
   * 移除 DOM（remove 时调用）
   */
  hideDom() {
    return this._dom && this._dom.parentElement && (this._dom.parentElement.removeChild(this._dom), this.onDomRemove && this.onDomRemove()), this._dom = void 0, this._visible = !1, this._coordinate = void 0, this;
  }
  /**
   * Get owner Map.
   * 获取所属 Map
   */
  getMap() {
    return this._map;
  }
  /**
   * Whether currently visible (show state).
   * 当前是否可见（show 状态）
   */
  isVisible() {
    return this._visible;
  }
  /**
   * Internal: Bind / Unbind map events.
   * 内部：绑定 / 解绑地图事件
   */
  _bindMapEvents(e) {
    const t = this._map;
    if (!t) return;
    const r = t, i = e ? "on" : "off", o = (l, c) => {
      e ? this._boundMapHandlers.set(l, c) : this._boundMapHandlers.delete(l);
    };
    if (e) {
      const l = () => {
        this._visible && this._refreshDomPosition();
      };
      r[i]("control-change", l), o("control-change", l);
      const c = t.viewer;
      if (c && !this._viewerUpdateHandler) {
        const u = () => {
          this._visible && this._refreshDomPosition();
        };
        this._viewerUpdateHandler = u, c.addEventListener("update", u);
      }
    } else {
      this._boundMapHandlers.forEach((c, u) => {
        r[i](u, c);
      }), this._boundMapHandlers.clear();
      const l = t.viewer;
      l && this._viewerUpdateHandler && (l.removeEventListener("update", this._viewerUpdateHandler), this._viewerUpdateHandler = void 0);
    }
  }
  /**
   * Internal: Derive world position from geographic coordinate / owner.
   * Ensures unified use of map.projectToWorld to keep altitude / center units consistent.
   * 
   * 内部：根据地理坐标 / owner 推导世界坐标
   * 保证统一走 map.projectToWorld，从而保持 altitude / center 单位统一
   */
  _resolveWorldPosition() {
    const e = this._map;
    if (!e) return;
    if (this._coordinate) {
      const [r, i, o = 0] = this._coordinate, l = new I(r, i, o);
      return e.projectToWorld(l);
    }
    const t = this._owner;
    if (t && t._geometry) {
      const r = t._geometry;
      if (r && (r.type === "Point" || r.type === "MultiPoint")) {
        let i;
        if (r.type === "Point" ? i = r.coordinates : r.type === "MultiPoint" && Array.isArray(r.coordinates) && r.coordinates.length > 0 && (i = r.coordinates[0]), i && i.length >= 2) {
          const o = new I(
            i[0],
            i[1],
            i[2] ?? 0
          );
          return e.projectToWorld(o);
        }
      }
      if (t._renderObject && typeof t._renderObject.getWorldPosition == "function") {
        const i = new I();
        if (t._renderObject.getWorldPosition(i), !(i.x === 0 && i.y === 0 && i.z === 0))
          return i;
      }
      if (t._worldCoordinates instanceof I) {
        const i = t._worldCoordinates;
        if (!(i.x === 0 && i.y === 0 && i.z === 0))
          return i.clone();
      }
    }
    if (t && typeof t.getWorldPosition == "function") {
      const r = new I();
      return t.getWorldPosition(r), r;
    }
    return e.prjcenter?.clone?.() ?? void 0;
  }
  /**
   * Internal: Update DOM position based on world coordinates.
   * 内部：根据世界坐标更新 DOM 位置
   */
  _refreshDomPosition() {
    if (!this._dom || !this._map) return;
    if (this._visible) {
      const u = this._resolveWorldPosition();
      if (!u) {
        this._dom.style.display = "none";
        return;
      }
      this._worldPosition = u;
    }
    if (!this._worldPosition) return;
    const e = this._map.viewer, t = e.camera, r = this._dom.style.display === "none";
    r && (this._dom.style.visibility = "hidden", this._dom.style.display = ""), t.updateMatrixWorld();
    const i = this._worldPosition.clone().project(t);
    if (i.x < -1.1 || i.x > 1.1 || i.y < -1.1 || i.y > 1.1 || i.z < -1 || i.z > 1) {
      this._dom.style.display = "none", r && (this._dom.style.visibility = "");
      return;
    }
    const o = (i.x * 0.5 + 0.5) * e.width, l = (-i.y * 0.5 + 0.5) * e.height, c = this.getOffset();
    if (this._dom.style.left = `${o + c.x}px`, this._dom.style.top = `${l + c.y}px`, r && (this._dom.style.visibility = ""), !this._positionedOnce) {
      this._positionedOnce = !0, this._dom.style.display = "none";
      return;
    }
    this._dom.style.display = "";
  }
};
Sr(_p, "_singletons", /* @__PURE__ */ new Set());
let dA = _p;
var pA = Object.defineProperty, mA = (s, e, t) => e in s ? pA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, qf = (s, e, t) => mA(s, typeof e != "symbol" ? e + "" : e, t);
class Qf extends dA {
  /**
   * @param options InfoWindow options InfoWindow 配置
   */
  constructor(e) {
    super({
      single: !0,
      ...e
    }), qf(this, "_titleEl"), qf(this, "_contentEl");
  }
  _getClassName() {
    return "InfoWindow";
  }
  /**
   * Build InfoWindow DOM structure.
   * 构建 InfoWindow 的 DOM 结构
   */
  buildOn() {
    if (this.options.custom) {
      let c;
      this.options.content instanceof HTMLElement ? c = this.options.content : (c = document.createElement("div"), typeof this.options.content == "string" && (c.innerHTML = this.options.content));
      const u = this.options.containerClass;
      return u && (Array.isArray(u) ? u : [u]).forEach((p) => {
        c.classList.add(p);
      }), this.options.minWidth && (c.style.minWidth = `${this.options.minWidth}px`), this.options.minHeight && (c.style.minHeight = `${this.options.minHeight}px`), this._titleEl = void 0, this._contentEl = c, c;
    }
    const e = document.createElement("div");
    e.className = "maporbis-infowindow";
    const t = this.options.containerClass;
    t && (Array.isArray(t) ? t : [t]).forEach((u) => {
      e.classList.add(u);
    }), typeof this.options.zIndex == "number" && (e.style.zIndex = String(this.options.zIndex)), this.options.minWidth && (e.style.minWidth = `${this.options.minWidth}px`), this.options.minHeight && (e.style.minHeight = `${this.options.minHeight}px`);
    const r = document.createElement("div");
    r.className = "maporbis-infowindow-header";
    const i = document.createElement("div");
    i.className = "maporbis-infowindow-title", this.options.title && (i.innerText = this.options.title);
    const o = document.createElement("span");
    o.className = "maporbis-infowindow-close", o.innerHTML = "×", o.title = "关闭", o.addEventListener("click", (c) => {
      c.stopPropagation(), c.preventDefault(), this.close();
    }), o.addEventListener("mousedown", (c) => {
      c.preventDefault();
    }), o.style.cursor = "pointer", o.style.userSelect = "none", r.appendChild(i), r.appendChild(o);
    const l = document.createElement("div");
    return l.className = "maporbis-infowindow-content", this.options.content instanceof HTMLElement ? l.appendChild(this.options.content) : typeof this.options.content == "string" && (l.innerHTML = this.options.content), e.appendChild(r), e.appendChild(l), this._titleEl = i, this._contentEl = l, e;
  }
  getOffset() {
    const e = super.getOffset(), t = this._dom;
    if (!t)
      return e;
    const r = t.offsetWidth, i = t.offsetHeight, o = 10;
    let l = e.x - r / 2, c = e.y - i - o;
    const u = this._owner, f = this.getMap();
    if (u && typeof u.getStyle == "function" && f?.viewer) {
      const d = u.getStyle?.()?.config, g = d?.type;
      if (d && (g === "icon-point" || g === "icon-label-point")) {
        const y = Array.isArray(d.anchor) ? d.anchor : [0.5, 0.5], b = typeof y[1] == "number" ? y[1] : 0.5;
        let T = 0;
        const x = u._renderObject;
        if (x && x instanceof tn && (T = this._getSpriteScreenHeight(x, f.viewer)), T <= 0) {
          let E = 0;
          if (g === "icon-point") {
            const M = d.size;
            Array.isArray(M) ? E = M[1] : typeof M == "number" && (E = M);
          } else if (g === "icon-label-point") {
            const M = d.size ?? d.iconSize;
            Array.isArray(M) ? E = M[1] : typeof M == "number" && (E = M);
          }
          T = E * (1 - b);
        } else
          T = T * (1 - b);
        T > 0 && (c -= T);
      }
    }
    return {
      x: l,
      y: c
    };
  }
  /**
   * Calculate actual pixel height of Sprite on screen
   * 计算 Sprite 在屏幕上的实际像素高度
   * 
   * @description
   * Handles both sizeAttenuation=false (fixed screen size) and sizeAttenuation=true (perspective projection) cases.
   * 处理 sizeAttenuation=false（固定屏幕大小）和 sizeAttenuation=true（透视投影）两种情况。
   */
  _getSpriteScreenHeight(e, t) {
    try {
      const r = t.camera, i = t.renderer;
      if (!r || !i) return 0;
      const o = t.height || i.domElement.clientHeight;
      if (!(e.material.sizeAttenuation !== !1)) {
        const z = r.projectionMatrix.elements[5];
        return e.scale.y * z * o / 2;
      }
      const u = new I();
      e.getWorldPosition(u);
      const f = r.position.clone(), p = u.clone().sub(f).normalize(), d = new I();
      d.crossVectors(r.up, p).normalize();
      const g = new I();
      g.crossVectors(p, d).normalize();
      const y = e.scale.y * (1 - e.center.y), b = e.scale.y * e.center.y, T = u.clone().add(g.clone().multiplyScalar(y)), x = u.clone().sub(g.clone().multiplyScalar(b)), E = T.clone().project(r), M = x.clone().project(r), A = (-E.y * 0.5 + 0.5) * o, D = (-M.y * 0.5 + 0.5) * o;
      return Math.abs(D - A);
    } catch (r) {
      return console.warn("Failed to calculate sprite screen height: // 计算 sprite 屏幕高度失败:", r), 0;
    }
  }
  /**
   * Set title.
   * 设置标题
   */
  setTitle(e) {
    return this.options.title = e, this._titleEl && (this._titleEl.innerText = e ?? ""), this;
  }
  /**
   * Set content.
   * 设置内容
   */
  setContent(e) {
    return this.options.content = e, this._contentEl ? (this._contentEl.innerHTML = "", e instanceof HTMLElement ? this._contentEl.appendChild(e) : this._contentEl.innerHTML = e, this) : this;
  }
  /**
   * Open InfoWindow (semantically equivalent to show).
   * 打开 InfoWindow（语义上等价于 show）
   * @param coordinate Optional geographic coordinate, use owner center / map center if not provided 可选地理坐标，不传则使用 owner 的中心 / 地图中心
   */
  open(e) {
    super.show(e);
    const t = this, r = () => {
      !t._dom || !t._map || !t._visible || (t._positionedOnce = !0, t._refreshDomPosition());
    }, o = this.getMap()?.viewer;
    if (o && typeof o.addEventListener == "function") {
      const l = () => {
        o.removeEventListener("update", l), r();
      };
      o.addEventListener("update", l);
    } else
      requestAnimationFrame(r);
    return this;
  }
  /**
   * Close InfoWindow (semantically equivalent to hide).
   * 关闭 InfoWindow（语义上等价于 hide）
   */
  close() {
    return this.hide();
  }
}
gt.include({
  /**
   * Set InfoWindow for the feature.
   * 为要素设置 InfoWindow
   * 
   * @param options InfoWindow configuration or instance
   *                InfoWindow 配置或实例
   * @returns Feature instance
   *          当前要素实例
   */
  setInfoWindow(s) {
    this.removeInfoWindow();
    let e;
    return s instanceof Qf ? e = s : e = new Qf(s), this._infoWindow = e, this.getMap() && e.addTo(this), this;
  },
  /**
   * Get the InfoWindow currently bound to the feature.
   * 获取要素当前绑定的 InfoWindow
   */
  getInfoWindow() {
    return this._infoWindow;
  },
  /**
   * Open InfoWindow.
   * 打开 InfoWindow
   * 
   * @param coordinate Optional geographic coordinate
   *                   可选地理坐标
   */
  openInfoWindow(s) {
    const e = this._infoWindow;
    return e ? (e.getMap() || this.getMap() && e.addTo(this), requestAnimationFrame(() => {
      e.open(s);
    }), this) : this;
  },
  /**
   * Close InfoWindow.
   * 关闭 InfoWindow
   */
  closeInfoWindow() {
    return this._infoWindow && this._infoWindow.close(), this;
  },
  /**
   * Remove InfoWindow.
   * 移除 InfoWindow
   */
  removeInfoWindow() {
    return this._infoWindow && (this._infoWindow.remove(), this._infoWindow = void 0), this;
  }
});
var gA = Object.defineProperty, _A = (s, e, t) => e in s ? gA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Zl = (s, e, t) => _A(s, typeof e != "symbol" ? e + "" : e, t);
class yA {
  constructor(...e) {
  }
}
class vA extends bi(
  rn(yA)
) {
  /**
   * @param options 工具配置
   */
  constructor(e = {}) {
    super(e), Zl(this, "_map"), Zl(this, "_enabled", !1), Zl(this, "_boundHandlers", /* @__PURE__ */ new Map());
  }
  /**
   * 将工具添加到地图上，并自动启用。
   * 同一张 Map 上会保证只有一个激活的 MapTool。
   */
  addTo(e) {
    if (!e) return this;
    const t = e;
    return t._activeMapTool && t._activeMapTool !== this && t._activeMapTool.disable(), t._activeMapTool = this, this._map = e, this.onAdd && this.onAdd(), this.enable(), this.trigger("add", { map: e }), this;
  }
  /**
   * 获取当前绑定的地图实例
   */
  getMap() {
    return this._map;
  }
  /**
   * 启用工具：绑定事件 + 调用 onEnable 钩子
   */
  enable() {
    return !this._map || this._enabled ? this : (this._enabled = !0, this._bindEvents(), this.onEnable && this.onEnable(), this.trigger("enable", { map: this._map }), this);
  }
  /**
   * 禁用工具：解绑事件 + 调用 onDisable 钩子
   */
  disable() {
    return !this._map || !this._enabled ? this : (this._enabled = !1, this._unbindEvents(), this.onDisable && this.onDisable(), this.trigger("disable", { map: this._map }), this);
  }
  /**
   * 工具是否处于启用状态
   */
  isEnabled() {
    return !!this._enabled;
  }
  /**
   * 从地图上移除工具
   */
  remove() {
    if (!this._map) return this;
    this.disable();
    const e = this._map;
    return e._activeMapTool === this && delete e._activeMapTool, this._map = void 0, this.trigger("remove"), this;
  }
  /**
   * 内部：绑定 Map 事件
   */
  _bindEvents() {
    const e = this._map;
    if (!e) return;
    const t = this.getEvents() || {};
    Object.keys(t).forEach((r) => {
      const i = t[r];
      if (!i) return;
      const o = (l) => i.call(this, l);
      this._boundHandlers.set(r, o), e.on(r, o);
    });
  }
  /**
   * 内部：解绑 Map 事件
   */
  _unbindEvents() {
    const e = this._map;
    e && (this._boundHandlers.forEach((t, r) => {
      e.off(r, t);
    }), this._boundHandlers.clear());
  }
}
var wA = Object.defineProperty, xA = (s, e, t) => e in s ? wA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ds = (s, e, t) => xA(s, typeof e != "symbol" ? e + "" : e, t);
class bA extends wi {
  constructor(e) {
    super(e, { altitude: 1 });
  }
  validateFeature(e) {
    return !!e;
  }
}
const Jf = {};
class Us extends vA {
  constructor(e) {
    super(e), ds(this, "_modeDef"), ds(this, "_clickCoords", []), ds(this, "_isDrawing", !1), ds(this, "_geometry"), ds(this, "_draftLayer"), this.options.once = this.options.once ?? !1, this._ensureMode();
  }
  /**
   * 注册一个绘制模式
   */
  static registerMode(e, t) {
    Jf[e.toLowerCase()] = t;
  }
  /**
   * 获取已注册的模式
   */
  static getModeDefinition(e) {
    return Jf[e.toLowerCase()];
  }
  /**
   * 获取当前模式名称（统一转为小写）
   */
  getMode() {
    return (this.options.mode || "").toLowerCase();
  }
  /**
   * 设置绘制模式：会清空当前绘制状态
   */
  setMode(e) {
    return this._finishDrawingSilently(), this.options.mode = e, this._ensureMode(), this;
  }
  /**
  * 设置绘制样式（仅影响后续新开始的绘制）
  * - geometryStyle：主几何样式（点/线/面）
  * - vertexStyle：顶点样式，传 null 可关闭锚点显示
  */
  setStyle(e) {
    return e.geometryStyle !== void 0 && (this.options.geometryStyle = e.geometryStyle), Object.prototype.hasOwnProperty.call(e, "vertexStyle") && (this.options.vertexStyle = e.vertexStyle ?? null), this;
  }
  /**
   * 子类实现：返回需要绑定到 Map 的事件映射
   */
  getEvents() {
    return {
      click: this._handleClick.bind(this),
      mousemove: this._handleMouseMove.bind(this),
      dblclick: this._handleDblClick.bind(this)
    };
  }
  /**
   * 启用时同步一下模式定义
   */
  onEnable() {
    this._ensureMode();
  }
  /**
   * 禁用时结束当前绘制，并清理草图图层
   */
  onDisable() {
    this._finishDrawingSilently(), this._destroyDraftLayer();
  }
  /**
   * 确保当前 mode 有对应的定义
   */
  _ensureMode() {
    const e = this.getMode(), t = Us.getModeDefinition(e);
    if (!t)
      throw new Error(`DrawTool: mode "${e}" 未注册，请先调用 DrawTool.registerMode`);
    this._modeDef = t;
  }
  /**
   * 处理 click 事件：
   * - 第一次 click：开始绘制，调用 mode.create，触发 drawstart
   * - 后续 click：追加顶点，调用 mode.update，触发 drawvertex
   * - 若达到 clickLimit，则结束绘制
   */
  _handleClick(e) {
    if (!this._modeDef || !e.coordinate) return;
    const t = e.coordinate, r = this._modeDef, i = { ...e, drawTool: this };
    this._isDrawing ? (this._clickCoords.push(t), r.update(this._clickCoords, this._geometry, i), this.trigger("drawvertex", {
      coordinate: t,
      geometry: this._geometry,
      coords: [...this._clickCoords],
      originEvent: i
    })) : (this._isDrawing = !0, this._clickCoords = [t], this._geometry = r.create(t, i), this.trigger("drawstart", {
      coordinate: t,
      geometry: this._geometry,
      coords: [...this._clickCoords],
      originEvent: i
    })), r.clickLimit && this._clickCoords.length >= r.clickLimit && this._finishDrawing(i);
  }
  /**
   * 处理 mousemove 事件：
   * - 仅在绘制中才更新几何
   * - 不修改 _clickCoords，只用临时 coords 传给 update
   */
  _handleMouseMove(e) {
    if (!this._modeDef || !this._isDrawing || !e.coordinate) return;
    const t = this._modeDef, r = [...this._clickCoords, e.coordinate], i = { ...e, drawTool: this };
    t.update(r, this._geometry, i), this.trigger("drawing", {
      coordinate: e.coordinate,
      geometry: this._geometry,
      coords: r,
      originEvent: i
    });
  }
  /**
   * 处理 dblclick：
   * - 如果正在绘制，则直接结束
   */
  _handleDblClick(e) {
    if (!this._modeDef || !this._isDrawing) return;
    const t = { ...e, drawTool: this };
    this._finishDrawing(t);
  }
  /**
   * 正常结束一次绘制：调用 mode.generate 并触发 drawend
   */
  _finishDrawing(e) {
    if (!this._modeDef || !this._isDrawing) return;
    const r = this._modeDef.generate(this._geometry, [...this._clickCoords]);
    this.trigger("drawend", {
      geometry: r,
      coords: [...this._clickCoords],
      originEvent: e
    }), this._isDrawing = !1, this._clickCoords = [], this._geometry = void 0, this.options.once && this.disable();
  }
  /**
   * 静默结束（不触发 drawend），用于切换模式 / 禁用工具
   */
  _finishDrawingSilently() {
    this._isDrawing = !1, this._clickCoords = [], this._geometry = void 0;
  }
  /**
  * 内部：获取或创建统一草图图层
  */
  _getOrCreateDraftLayer() {
    if (this._draftLayer) return this._draftLayer;
    const e = this.getMap();
    if (!e)
      throw new Error("DrawTool: 尚未绑定地图，请先调用 addTo(map)");
    const t = `__draw_draft_${Date.now().toString(36)}`, r = new bA(t);
    return e.addLayer(r), this._draftLayer = r, r;
  }
  /**
  * 内部：销毁草图图层
  */
  _destroyDraftLayer() {
    const e = this.getMap();
    e && this._draftLayer && e.removeLayer(this._draftLayer.getId()), this._draftLayer = void 0;
  }
}
const TA = {
  actions: ["click", "mousemove"],
  create(s, e) {
    const t = e.drawTool, r = t._getOrCreateDraftLayer(), i = _i(
      t.options.geometryStyle,
      { type: "basic-point", size: 10, color: "#00ffff" }
    ), o = {
      type: "Point",
      coordinates: s
    }, l = new xi({
      geometry: o,
      style: i
    });
    return l.addTo(r), l.initializeGeometry(), {
      tool: t,
      draftLayer: r,
      draftMarker: l
    };
  },
  update(s, e, t) {
    const r = e?.draftMarker;
    if (!r) return;
    const i = s[s.length - 1];
    r._geometry = {
      type: "Point",
      coordinates: i
    }, r._worldCoordinates = r._coordsTransform(), r._buildRenderObject && r._buildRenderObject();
  },
  generate(s, e) {
    const t = s.tool;
    if (!e.length) return null;
    s.draftMarker && (s.draftMarker._remove(), s.draftMarker = null);
    const r = _i(
      t.options.geometryStyle,
      { type: "basic-point", size: 10, color: "#00ffff" }
    ), i = e[e.length - 1];
    return new xi({
      geometry: {
        type: "Point",
        coordinates: i
      },
      style: r
    });
  },
  clickLimit: 1
}, SA = {
  actions: ["click", "mousemove", "dblclick"],
  create(s, e) {
    const t = e.drawTool, r = t._getOrCreateDraftLayer(), i = _i(
      t.options.geometryStyle,
      { type: "basic-line", color: "#ff0000", width: 2 }
    ), o = t.options.vertexStyle === null ? void 0 : _i(
      t.options.vertexStyle,
      { type: "basic-point", size: 8, color: "#00ffff" }
    ), l = {
      type: "LineString",
      coordinates: [s]
    }, c = new Bt({
      geometry: l,
      style: i
    });
    c.addTo(r);
    const u = [];
    if (o) {
      const f = {
        type: "Point",
        coordinates: s
      }, p = new xi({
        geometry: f,
        style: o
      });
      p.addTo(r), u.push(p);
    }
    return {
      tool: t,
      draftLayer: r,
      draftLine: c,
      draftAnchors: u,
      lineStyle: i,
      vertexStyle: o
    };
  },
  update(s, e, t) {
    if (!e) return;
    const r = e.draftLayer;
    if (!s || s.length < 2)
      return;
    e.draftLine && (e.draftLine._remove(), e.draftLine = null);
    const i = {
      type: "LineString",
      coordinates: s
    }, o = new Bt({
      geometry: i,
      style: e.lineStyle
    });
    if (o.addTo(r), e.draftLine = o, t.eventName === "click" && e.vertexStyle) {
      const c = {
        type: "Point",
        coordinates: s[s.length - 1]
      }, u = new xi({
        geometry: c,
        style: e.vertexStyle
      });
      u.addTo(r), e.draftAnchors.push(u);
    }
  },
  generate(s, e) {
    const t = s.tool;
    if (!e.length) return null;
    if (s.draftLine && (s.draftLine._remove(), s.draftLine = null), Array.isArray(s.draftAnchors)) {
      for (const o of s.draftAnchors)
        o?._remove();
      s.draftAnchors = [];
    }
    const r = _i(
      t.options.geometryStyle,
      { type: "basic-line", color: "#ff0000", width: 2 }
    );
    return new Bt({
      geometry: {
        type: "LineString",
        coordinates: e
      },
      style: r
    });
  }
}, MA = {
  actions: ["click", "mousemove", "dblclick"],
  create(s, e) {
    const t = e.drawTool, r = t._getOrCreateDraftLayer(), i = _i(
      t.options.geometryStyle,
      { type: "basic-polygon", color: "#00ff00", opacity: 0.5 }
    ), o = t.options.vertexStyle === null ? void 0 : _i(
      t.options.vertexStyle,
      { type: "basic-point", size: 8, color: "#00ffff" }
    ), l = [];
    if (o) {
      const c = {
        type: "Point",
        coordinates: s
      }, u = new xi({
        geometry: c,
        style: o
      });
      u.addTo(r), u.initializeGeometry(), l.push(u);
    }
    return {
      tool: t,
      draftLayer: r,
      draftPolygon: null,
      // 草图面
      draftEdgeLine: null,
      // 点数<3时的草图边线
      draftAnchors: l,
      polygonStyle: i,
      vertexStyle: o
    };
  },
  update(s, e, t) {
    if (!e) return;
    const r = e.draftLayer;
    if (t.eventName === "click" && e.vertexStyle) {
      const p = {
        type: "Point",
        coordinates: s[s.length - 1]
      }, d = new xi({
        geometry: p,
        style: e.vertexStyle
      });
      d.addTo(r), d.initializeGeometry(), e.draftAnchors.push(d);
    }
    if (!s || s.length < 2) {
      e.draftEdgeLine && (e.draftEdgeLine._remove(), e.draftEdgeLine = null), e.draftPolygon && (e.draftPolygon._remove(), e.draftPolygon = null);
      return;
    }
    if (s.length === 2) {
      e.draftPolygon && (e.draftPolygon._remove(), e.draftPolygon = null), e.draftEdgeLine && (e.draftEdgeLine._remove(), e.draftEdgeLine = null);
      const f = {
        type: "LineString",
        coordinates: s
      }, p = e.polygonStyle?.config && e.polygonStyle.config.color || "#00ff00", d = new Jt({
        type: "basic-line",
        color: p,
        width: 2
      }), g = new Bt({
        geometry: f,
        style: d
      });
      g.addTo(r), e.draftEdgeLine = g;
      return;
    }
    e.draftEdgeLine && (e.draftEdgeLine._remove(), e.draftEdgeLine = null);
    const i = s.slice(), o = i[0], l = i[i.length - 1];
    (o[0] !== l[0] || o[1] !== l[1] || (o[2] || 0) !== (l[2] || 0)) && i.push(o), e.draftPolygon && (e.draftPolygon._remove(), e.draftPolygon = null);
    const c = {
      type: "Polygon",
      coordinates: [i]
    }, u = new Wr({
      geometry: c,
      style: e.polygonStyle
    });
    u.addTo(r), e.draftPolygon = u;
  },
  generate(s, e) {
    const t = s.tool;
    if (e.length < 3) return null;
    if (s.draftPolygon && (s.draftPolygon._remove(), s.draftPolygon = null), s.draftEdgeLine && (s.draftEdgeLine._remove(), s.draftEdgeLine = null), Array.isArray(s.draftAnchors)) {
      for (const u of s.draftAnchors)
        u?._remove();
      s.draftAnchors = [];
    }
    const r = _i(
      t.options.geometryStyle,
      { type: "basic-polygon", color: "#00ff00", opacity: 0.5 }
    ), i = e.slice(), o = i[0], l = i[i.length - 1];
    return (o[0] !== l[0] || o[1] !== l[1] || (o[2] || 0) !== (l[2] || 0)) && i.push(o), new Wr({
      geometry: {
        type: "Polygon",
        coordinates: [i]
      },
      style: r
    });
  }
};
Us.registerMode("point", TA);
Us.registerMode("line", SA);
Us.registerMode("polygon", MA);
function _i(s, e) {
  return Jt.create(s || e);
}
var AA = Object.defineProperty, PA = (s, e, t) => e in s ? AA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Rt = (s, e, t) => PA(s, typeof e != "symbol" ? e + "" : e, t);
class Lr {
  /**
   * constructor
   * 构造函数
   * @param options SourceOptions
   */
  constructor(e) {
    Rt(this, "dataType", "image"), Rt(this, "attribution", "isource"), Rt(this, "minLevel", 0), Rt(this, "maxLevel", 18), Rt(this, "projectionID", "3857"), Rt(this, "url", ""), Rt(this, "subdomains", []), Rt(this, "s", ""), Rt(this, "opacity", 1), Rt(this, "isTMS", !1), Rt(this, "bounds", [-180, -85, 180, 85]), Rt(this, "_projectionBounds", [-1 / 0, -1 / 0, 1 / 0, 1 / 0]), Rt(this, "tileMaterial"), Object.assign(this, e);
  }
  /**
   * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
   * 根据瓦片坐标获取URL，公开方法，可重写以自定义生成URL
   * @param x tile x coordinate 瓦片X坐标
   * @param y tile y coordinate 瓦片Y坐标
   * @param z tile z coordinate 瓦片Z坐标
   * @returns url tile url 瓦片URL
   */
  getUrl(e, t, r) {
    const i = { ...this, x: e, y: t, z: r };
    return Vd(this.url, i);
  }
  /**
   * Get url from tile coordinate, public, called by TileLoader system
   * 根据瓦片坐标获取URL，公开方法，由瓦片加载系统调用
   * @param x tile x coordinate 瓦片X坐标
   * @param y tile y coordinate 瓦片Y坐标
   * @param z tile z coordinate 瓦片Z坐标
   * @returns url tile url 瓦片URL
   */
  _getUrl(e, t, r) {
    const i = this.subdomains.length;
    if (i > 0) {
      const l = Math.floor(Math.random() * i);
      this.s = this.subdomains[l];
    }
    const o = this.isTMS ? Math.pow(2, r) - 1 - t : t;
    return this.getUrl(e, o, r);
  }
  /**
   * Create source directly through factoy functions.
   * @param options source options
   * @returns ISource data source instance
   */
  static create(e) {
    return new Lr(e);
  }
}
var EA = Object.defineProperty, CA = (s, e, t) => e in s ? EA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, dr = (s, e, t) => CA(s, typeof e != "symbol" ? e + "" : e, t);
class sP extends Lr {
  /**
   * 构造函数
   * @param options 配置选项
   * @throws 当未提供token时抛出错误
   */
  constructor(e) {
    if (super(e), dr(this, "dataType", "image"), dr(this, "attribution", "天地图"), dr(this, "token", ""), dr(this, "style", "img_w"), dr(this, "subdomains", "01234"), dr(this, "url", "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}"), Object.assign(this, e), !this.token)
      throw new Error("天地图访问令牌(token)是必填参数");
  }
}
class oP extends Lr {
  /**
   * 构造函数
   * @param options 配置选项
   * @throws 当未提供token时抛出错误
   */
  constructor(e) {
    if (super(e), dr(this, "dataType", "quantized-mesh"), dr(this, "attribution", "天地图"), dr(this, "token", ""), dr(this, "subdomains", "01234"), dr(this, "url", "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}"), Object.assign(this, e), !this.token)
      throw new Error("天地图访问令牌(token)是必填参数");
  }
}
var LA = Object.defineProperty, OA = (s, e, t) => e in s ? LA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ed = (s, e, t) => OA(s, typeof e != "symbol" ? e + "" : e, t);
class aP extends Lr {
  // public dataType: string = "VectorTile";
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super({
      ...e,
      url: e.urlTemplate,
      isTMS: e.isTMS || !1
    }), ed(this, "minLevel", 2), ed(this, "maxLevel", 24);
  }
  /**
   * 获取瓦片URL
   * @param x 瓦片X坐标（瓦片列号）
   * @param y 瓦片Y坐标（瓦片行号）
   * @param z 缩放级别（瓦片矩阵级别）
   * @returns 完整的瓦片请求URL
   * 
   * @description
   * 根据WMTS规范生成瓦片请求URL，自动处理：
   * - 坐标轴朝向（TMS/Y轴反向）
   * - 变量替换（支持多种WMTS参数命名）
   * 
   * 支持的URL模板变量：
   * - {x}: 瓦片X坐标
   * - {y}: 瓦片Y坐标（自动处理TMS反转）
   * - {z}: 缩放级别
   * - {tileMatrix}: 瓦片矩阵级别
   * - {tileRow}: 瓦片行号（自动处理TMS反转）
   * - {tileCol}: 瓦片列号
   */
  getUrl(e, t, r) {
    const i = this.isTMS ? Math.pow(2, r) - 1 - t : t;
    return Vd(this.url, {
      ...this,
      x: e,
      y: i,
      z: r,
      tileMatrix: r,
      // WMTS标准参数
      tileRow: i,
      // WMTS标准参数
      tileCol: e
      // WMTS标准参数
    });
  }
}
var DA = Object.defineProperty, IA = (s, e, t) => e in s ? DA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Gr = (s, e, t) => IA(s, typeof e != "symbol" ? e + "" : e, t);
class lP extends Lr {
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super(e), Gr(this, "dataType", "image"), Gr(this, "attribution", "ArcGIS"), Gr(this, "style", "World_Imagery"), Gr(this, "url", "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}"), Object.assign(this, e);
  }
}
class cP extends Lr {
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super(e), Gr(this, "dataType", "lerc"), Gr(this, "attribution", "ArcGIS"), Gr(this, "minLevel", 6), Gr(this, "maxLevel", 13), Gr(this, "url", "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}"), Object.assign(this, e);
  }
}
var FA = Object.defineProperty, RA = (s, e, t) => e in s ? FA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Mn = (s, e, t) => RA(s, typeof e != "symbol" ? e + "" : e, t);
class uP extends Lr {
  /**
   * 构造函数
   * @param options 配置选项
   * @throws 当未提供token时抛出错误
   */
  constructor(e) {
    if (super(e), Mn(this, "token", ""), Mn(this, "format", "webp"), Mn(this, "style", "cm2myr6qx001t01pi0sf7estf"), Mn(this, "attribution", "MapBox"), Mn(this, "maxLevel", 25), Mn(this, "url", "https://api.mapbox.com/styles/v1/criska/cm2myr6qx001t01pi0sf7estf/tiles/256/{z}/{x}/{y}?access_token={token}&format={format}"), Object.assign(this, e), !this.token)
      throw new Error("MapBox访问令牌(token)是必填参数");
  }
}
var BA = Object.defineProperty, UA = (s, e, t) => e in s ? BA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, td = (s, e, t) => UA(s, typeof e != "symbol" ? e + "" : e, t);
class hP extends Lr {
  //  "https://demotiles.maplibre.org/style.json";
  constructor(e) {
    super(e), td(this, "dataType", "mvt"), td(this, "style", { layer: {} }), Object.assign(this, e);
  }
}
var kA = Object.defineProperty, zA = (s, e, t) => e in s ? kA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ps = (s, e, t) => zA(s, typeof e != "symbol" ? e + "" : e, t);
class fP extends Lr {
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super(e), ps(this, "dataType", "VectorTile"), ps(this, "attribution", "ArcGIS"), ps(this, "minLevel", 1), ps(this, "maxLevel", 21), ps(this, "url", "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=uKYsZQZpm72WlbSgH9B7"), Object.assign(this, e);
  }
}
class dP extends wi {
  /**
   * Constructor.
   * 构造函数
   * @param id Layer unique identifier.
   *           图层唯一标识符
   * @param options Line layer configuration options.
   *                线图层配置选项
   */
  constructor(e, t) {
    super(e, t);
  }
  /**
   * Validate if feature belongs to this layer.
   * 验证要素是否属于此图层
   * @param feature Line feature to validate.
   *                要验证的线要素
   * @returns Whether it is a valid Line feature.
   *          是否为合法的线要素
   * 
   * @description
   * Implement parent abstract method, check if feature base type is 'Line'.
   * 实现父类抽象方法，检查要素的基础类型是否为'Line'。
   * @override
   */
  validateFeature(e) {
    return e._baseType === "Line";
  }
}
class pP extends wi {
  /**
   * Constructor.
   * 构造函数
   * @param id Layer ID.
   *           图层ID
   * @param options Layer configuration options.
   *                图层配置选项
   */
  constructor(e, t) {
    super(e, t);
  }
  /**
   * Validate if feature belongs to this layer.
   * 验证要素是否属于此图层
   * @param feature Point feature to validate.
   *                要验证的点要素
   * @returns Whether it is a valid Point feature.
   *          是否为合法的点要素
   * @override
   */
  validateFeature(e) {
    return e._baseType === "Point";
  }
}
class mP extends wi {
  /**
   * Constructor.
   * 构造函数
   * @param id Layer unique identifier.
   *           图层唯一标识符
   * @param options Polygon layer configuration options.
   *                多边形图层配置选项
   */
  constructor(e, t) {
    super(e, t);
  }
  /**
   * Validate if feature belongs to this layer.
   * 验证要素是否属于此图层
   * @param feature Polygon feature to validate.
   *                要验证的多边形要素
   * @returns Whether it is a valid Polygon feature.
   *          是否为合法的多边形要素
   * @override
   * @description 
   * Check if feature base type is 'Surface'.
   * 检查要素的基础类型是否为'Surface'。
   */
  validateFeature(e) {
    return e._baseType === "Surface";
  }
}
var NA = Object.defineProperty, HA = (s, e, t) => e in s ? NA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, VA = (s, e, t) => HA(s, e + "", t);
class gP extends wi {
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
  constructor(e, t) {
    super(e, t), VA(this, "_clouds", null);
    const r = ["texture"];
    for (const i of r)
      Hd(t, i);
    this._createClouds(t.texture);
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
  async _createClouds(e) {
    const t = await Jt._loadTexture(e), r = new nT({
      texture: t,
      material: Kt
    });
    r.castShadow = !0, this._clouds = r;
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
  validateFeature(e) {
    return e._type === "Cloud";
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
  animate(e, t) {
    this._clouds && this._clouds.update(this.map.viewer.camera, t, e);
  }
}
var WA = Object.defineProperty, GA = (s, e, t) => e in s ? WA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, jA = (s, e, t) => GA(s, e + "", t);
class $A extends np {
  /**
   * Create a new RasterTileLayer instance.
   * 创建一个新的 RasterTileLayer 实例。
   * 
   * @param id Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    super(e, t), jA(this, "layerType", "raster");
  }
  /**
   * Create the tile loader for this layer.
   * 创建此图层的瓦片加载器。
   * 
   * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
   * @protected
   */
  createLoader() {
    const e = new Cc();
    return Array.isArray(this.source) ? e.imgSource = this.source : e.imgSource = [this.source], e;
  }
}
var XA = Object.defineProperty, YA = (s, e, t) => e in s ? XA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Yo = (s, e, t) => YA(s, typeof e != "symbol" ? e + "" : e, t);
class _P extends $A {
  /**
   * Create a new WMTSTileLayer instance.
   * 创建一个新的 WMTSTileLayer 实例。
   * 
   * @param id Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    super(e, t), Yo(this, "layerType", "wmts"), Yo(this, "_layerName"), Yo(this, "_style"), Yo(this, "_matrixSet"), this._layerName = t.layerName, this._style = t.style || "default", this._matrixSet = t.matrixSet || "GoogleMapsCompatible";
  }
  /**
   * Get WMTS layer name.
   * 获取WMTS图层名称。
   */
  get layerName() {
    return this._layerName;
  }
  /**
   * Get WMTS style.
   * 获取WMTS样式。
   */
  get style() {
    return this._style;
  }
  /**
   * Get WMTS matrix set.
   * 获取WMTS矩阵集。
   */
  get matrixSet() {
    return this._matrixSet;
  }
  /**
   * Create tile loader.
   * 创建瓦片加载器。
   * 
   * @returns {ICompositeLoader} The created tile loader. 创建的瓦片加载器。
   * @protected
   */
  createLoader() {
    const e = new Cc();
    return Array.isArray(this.source) ? e.imgSource = this.source : e.imgSource = [this.source], e;
  }
  /**
   * Update layer.
   * 更新图层。
   * 
   * @param camera The camera used for rendering. 用于渲染的相机。
   */
  update(e) {
    this.loader && super.update(e);
  }
}
console.log(
  "%c✨ MapOrbis V" + M1 + " ",
  "color:rgb(255, 255, 255); font-weight: bold; background: linear-gradient(90deg, #ffb6c1, #ff69b4); padding: 5px; border-radius: 5px;"
);
export {
  eP as AbstractCanvasMaterialLoader,
  ap as AbstractGeometryLoader,
  Ec as AbstractMaterialLoader,
  J2 as ArcGISLercLoader,
  cP as ArcGisDemSource,
  lP as ArcGisSource,
  gP as CloudsLayer,
  Cc as CompositeTileLoader,
  Us as DrawTool,
  Cf as EventClass,
  jd as ExternalModelLoader,
  gt as Feature,
  xs as GeometryHelper,
  N2 as GeometrySkirtUtils,
  a2 as ICloud,
  Qf as InfoWindow,
  f2 as Label,
  dP as LineLayer,
  Bt as LineString,
  ha as LoaderUtils,
  fP as MVTGeoSource,
  hP as MVTSource,
  zn as Map,
  uP as MapBoxSource,
  Cs as MapTileGeometry,
  vA as MapTool,
  oM as MapboxRGBLoader,
  hM as MapboxVectorTileGeometryLoader,
  xi as Marker,
  r2 as Model,
  ZS as MultiLineString,
  pP as PointLayer,
  Wr as Polygon,
  mP as PolygonLayer,
  iP as ProjectionFactory,
  $A as RasterTileLayer,
  Jt as Style,
  oP as TDTQMSource,
  sP as TDTSource,
  g2 as TPoints,
  tP as TerrainMeshBuilder,
  En as Tile,
  $A as TileLayer,
  We as TileLoaderFactory,
  O2 as TileLoadingManager,
  A2 as TileMaterial,
  Lr as TileSource,
  dA as UIComponent,
  rt as VectorFeatureTypes,
  Kf as VectorTileLayer,
  P2 as VectorTileRender,
  NM as VectorTileTextureLoader,
  Yb as Viewer,
  aP as WMTSSource,
  _P as WMTSTileLayer,
  WM as WebImageLoader,
  qA as getApproxZoomLevel,
  KA as getLocalInfoFromGeo,
  Td as getLocalInfoFromRay,
  Sd as getLocalInfoFromScreen,
  sc as getLocalInfoFromWorld,
  GM as registerDefaultLoaders
};
