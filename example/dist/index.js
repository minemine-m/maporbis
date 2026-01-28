import * as st from "three";
import { Vector3 as D, InstancedBufferGeometry as od, Matrix4 as be, Box3 as tr, Frustum as $w, Mesh as Be, Raycaster as Es, REVISION as ad, TrianglesDrawMode as jw, TriangleFanDrawMode as Ql, TriangleStripDrawMode as ld, Color as oe, FrontSide as na, Plane as cd, Vector4 as _n, PerspectiveCamera as Qi, WebGLRenderTarget as Cr, UniformsUtils as er, UniformsLib as ea, ShaderMaterial as Pn, MOUSE as hi, TOUCH as fi, Spherical as af, Quaternion as mn, OrthographicCamera as Or, Vector2 as ce, Ray as Xw, PlaneGeometry as Fr, HalfFloatType as Yi, AdditiveBlending as _c, MeshBasicMaterial as qt, RGBAFormat as ud, LinearFilter as vi, NoBlending as Yw, Clock as ia, Loader as yc, LoaderUtils as Rr, FileLoader as wi, MeshPhysicalMaterial as Cn, SpotLight as hd, PointLight as Jl, DirectionalLight as ta, InstancedMesh as vc, InstancedBufferAttribute as ec, Object3D as gn, TextureLoader as ra, ImageBitmapLoader as Zw, BufferAttribute as mt, InterleavedBuffer as qw, InterleavedBufferAttribute as Zi, LinearMipmapLinearFilter as Rs, NearestMipmapLinearFilter as Kw, LinearMipmapNearestFilter as Qw, NearestMipmapNearestFilter as Jw, NearestFilter as fd, RepeatWrapping as yn, MirroredRepeatWrapping as eb, ClampToEdgeWrapping as tc, PointsMaterial as sa, Material as Pl, LineBasicMaterial as dd, MeshStandardMaterial as Ds, DoubleSide as kr, PropertyBinding as Cs, BufferGeometry as Kt, SkinnedMesh as pd, LineSegments as tb, Line as md, LineLoop as nb, Points as zr, Group as Qt, MathUtils as lt, Skeleton as gd, AnimationClip as _d, Bone as nc, InterpolateDiscrete as ib, InterpolateLinear as yd, Texture as Br, VectorKeyframeTrack as ic, NumberKeyframeTrack as rc, QuaternionKeyframeTrack as sc, Interpolant as rb, Sphere as wc, Curve as sb, MeshPhongMaterial as As, MeshLambertMaterial as vd, EquirectangularReflectionMapping as ob, AmbientLight as wd, Float32BufferAttribute as di, Uint16BufferAttribute as ab, Matrix3 as lb, Euler as _s, DataTextureLoader as cb, FloatType as Ko, DataUtils as Co, InstancedInterleavedBuffer as oc, WireframeGeometry as ub, Line3 as hb, EventDispatcher as bd, Scene as fb, FogExp2 as lf, CubeTextureLoader as db, WebGLRenderer as pb, PCFSoftShadowMap as mb, ACESFilmicToneMapping as gb, SRGBColorSpace as oa, CameraHelper as _b, CubicBezierCurve3 as yb, Sprite as nr, DynamicDrawUsage as cf, SpriteMaterial as Is, NormalBlending as xd, CurvePath as Td, LineCurve3 as Dr, QuadraticBezierCurve3 as Sd, TubeGeometry as vb, BackSide as wb, Shape as bb, ShapeGeometry as xb, CanvasTexture as Fs, CylinderGeometry as Tb, AnimationMixer as Sb, LoopRepeat as Mb, LoopOnce as Ab, LoadingManager as Pb, Box2 as Lb, ImageLoader as Md } from "three";
const Eb = "0.1.0-beta";
var ys = /* @__PURE__ */ ((s) => (s[s.none = 0] = "none", s[s.create = 1] = "create", s[s.remove = 2] = "remove", s))(ys || {});
function Cb(s, e) {
  const t = s.position.clone().setZ(s.maxZ).applyMatrix4(s.matrixWorld);
  return e.distanceTo(t);
}
function Ob(s) {
  const e = s.scale, t = new D(-e.x, -e.y, 0).applyMatrix4(s.matrixWorld), n = new D(e.x, e.y, 0).applyMatrix4(s.matrixWorld);
  return t.sub(n).length();
}
function Rb(s) {
  return s.distToCamera / s.sizeInWorld * 0.8;
}
function Db(s, e, t, n) {
  const i = Rb(s);
  if (s.isLeaf) {
    if (s.inFrustum && // Tile is in frustum
    s.z < t && // Tile level < map maxlevel
    (s.z < e || s.showing) && // (Tile level < map minLevel ) || (Parent tile has showed)
    (s.z < e || i < n))
      return 1;
  } else if (s.z >= e && // Tile level >= map minLevel
  (s.z > t || i > n))
    return 2;
  return 0;
}
function Ib(s, e, t, n) {
  const i = [], o = n + 1, l = e * 2, c = 0, u = 0.25;
  {
    const f = t * 2, p = new D(0.5, 0.5, 1), d = new Er(l, f, o), g = new Er(l + 1, f, o), y = new Er(l, f + 1, o), x = new Er(l + 1, f + 1, o);
    d.position.set(-u, u, c), d.scale.copy(p), g.position.set(u, u, c), g.scale.copy(p), y.position.set(-u, -u, c), y.scale.copy(p), x.position.set(u, -u, c), x.scale.copy(p), i.push(d, g, y, x);
  }
  return i;
}
var Fb = Object.defineProperty, Bb = (s, e, t) => e in s ? Fb(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Je = (s, e, t) => Bb(s, typeof e != "symbol" ? e + "" : e, t);
const Ub = 10, kb = new od(), zb = new D(), Nb = new be(), Hb = new tr(new D(-0.5, -0.5, 0), new D(0.5, 0.5, 1)), uf = new $w(), Ad = class vs extends Be {
  /**
   * Constructor for the Tile class.
   * Tile类的构造函数。
   * @param x - Tile X-coordinate, default: 0. 瓦片X坐标，默认0。
   * @param y - Tile Y-coordinate, default: 0. 瓦片Y坐标，默认0。
   * @param z - Tile level, default: 0. 瓦片层级，默认0。
   */
  constructor(e = 0, t = 0, n = 0) {
    super(kb, []), Je(this, "_dataMode", !1), Je(this, "_vectorData", null), Je(this, "x"), Je(this, "y"), Je(this, "z"), Je(this, "isTile", !0), Je(this, "parent", null), Je(this, "children", []), Je(this, "_isReady", !1), Je(this, "_isVirtualTile", !1), Je(this, "_isVisible", !1), Je(this, "_maxHeight", 0), Je(this, "distToCamera", 0), Je(this, "sizeInWorld", 0), Je(this, "_isLoaded", !1), Je(this, "_inFrustum", !1), this.x = e, this.y = t, this.z = n, this.name = `Tile ${n}-${e}-${t}`, this.up.set(0, 0, 1), this.matrixAutoUpdate = !1;
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
    return vs._activeDownloads;
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
    this._isVisible = e, this.material.forEach((n) => n.visible = e), t === !1 && this._isVisible === !0 && this._isLoaded && this.dispatchEvent({ type: "tile-shown", tile: this }), t === !0 && this._isVisible === !1 && this.dispatchEvent({ type: "tile-hidden", tile: this });
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
    if (vs.downloadThreads > Ub)
      return { action: ys.none };
    let t = [];
    const { loader: n, minLevel: i, maxLevel: o, LODThreshold: l } = e, c = Db(this, i, o, l);
    return c === ys.create && (t = Ib(n, this.x, this.y, this.z), this.add(...t)), { action: c, newTiles: t };
  }
  /**
   * Checks the visibility of the tile.
   */
  _checkVisibility() {
    const e = this.parent;
    if (e && e.isTile) {
      const t = e.children.filter((i) => i.isTile), n = t.every((i) => i.loaded);
      e.showing = !n, t.forEach((i) => i.showing = n);
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
    vs._activeDownloads++;
    const { x: t, y: n, z: i } = this;
    if (this._dataMode)
      try {
        const o = await e.load({
          x: t,
          y: n,
          z: i,
          bounds: [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
        });
        this._vectorData = o.geometry?.userData || {}, this._isLoaded = !0, this.dispatchEvent({
          type: "vector-data-loaded",
          data: this._vectorData,
          tile: this
        });
      } catch (o) {
        console.error(`数据模式加载失败 ${i}/${t}/${n}:`, o), this._isLoaded = !1;
      }
    else {
      const o = await e.load({
        x: t,
        y: n,
        z: i,
        bounds: [-1 / 0, -1 / 0, 1 / 0, 1 / 0]
      });
      this.material = o.materials, this.geometry = o.geometry, this.maxZ = this.geometry.boundingBox?.max.z || 0, this._isLoaded = !0;
    }
    return vs._activeDownloads--, this;
  }
  /** New tile init */
  _initTile() {
    this.updateMatrix(), this.updateMatrixWorld(), this.sizeInWorld = Ob(this);
  }
  /**
   * Updates the tile.
   * @param params - The update parameters.
   * @returns this
   */
  update(e) {
    if (console.assert(this.z === 0), !this.parent)
      return this;
    uf.setFromProjectionMatrix(
      Nb.multiplyMatrices(e.camera.projectionMatrix, e.camera.matrixWorldInverse)
    );
    const t = e.camera.getWorldPosition(zb);
    return this.traverse((n) => {
      n.receiveShadow = this.receiveShadow, n.castShadow = this.castShadow;
      const i = Hb.clone().applyMatrix4(n.matrixWorld);
      n.inFrustum = uf.intersectsBox(i), n.distToCamera = Cb(n, t);
      const { action: o, newTiles: l } = n._updateLOD(e);
      this._processLODAction(n, o, l, e);
    }), this._checkReadyState(), this;
  }
  _processLODAction(e, t, n, i) {
    return t === ys.create ? n?.forEach((o) => {
      o._initTile(), o._isVirtualTile = o.z < i.minLevel, this.dispatchEvent({ type: "tile-created", tile: o }), o.isDummy || o._loadData(i.loader).then(() => {
        o._checkVisibility(), this.dispatchEvent({ type: "tile-loaded", tile: o });
      });
    }) : t === ys.remove && (e.showing = !0, e._disposeResources(!1, i.loader), this.dispatchEvent({ type: "tile-unload", tile: e })), this;
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
    return e && this.isTile && !this.isDummy && (this.dispatchEvent({ type: "unload" }), t?.unload?.(this)), this.children.forEach((n) => n._disposeResources(!0, t)), this.clear(), this;
  }
};
Je(Ad, "_activeDownloads", 0);
let Er = Ad;
function Pd(s, e) {
  const t = s.getLayers().find((o) => o.isBaseLayer === !0);
  if (!t || !t._rootTile)
    return;
  const n = t._rootTile, i = e.intersectObjects([n]);
  for (const o of i)
    if (o.object instanceof Er) {
      const l = o.point.clone(), c = s.pointToLngLat(l);
      return Object.assign(o, {
        location: c
      });
    }
}
function ac(s, e) {
  const t = new D(0, -1, 0), n = new D(e.x, 10 * 1e3, e.z), i = new Es(n, t);
  return Pd(s, i);
}
function Ld(s, e, t) {
  const n = new Es();
  return n.setFromCamera(t, s), Pd(e, n);
}
function uP(s, e) {
  const t = s.lngLatToWorld(e);
  return ac(s, t);
}
function hP(s, e) {
  return e.getZoom();
}
var Ps = function() {
  var s = 0, e = document.createElement("div");
  e.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", e.addEventListener("click", function(p) {
    p.preventDefault(), n(++s % e.children.length);
  }, !1);
  function t(p) {
    return e.appendChild(p.dom), p;
  }
  function n(p) {
    for (var d = 0; d < e.children.length; d++)
      e.children[d].style.display = d === p ? "block" : "none";
    s = p;
  }
  var i = (performance || Date).now(), o = i, l = 0, c = t(new Ps.Panel("FPS", "#0ff", "#002")), u = t(new Ps.Panel("MS", "#0f0", "#020"));
  if (self.performance && self.performance.memory)
    var f = t(new Ps.Panel("MB", "#f08", "#201"));
  return n(0), {
    REVISION: 16,
    dom: e,
    addPanel: t,
    showPanel: n,
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
    setMode: n
  };
};
Ps.Panel = function(s, e, t) {
  var n = 1 / 0, i = 0, o = Math.round, l = o(window.devicePixelRatio || 1), c = 80 * l, u = 48 * l, f = 3 * l, p = 2 * l, d = 3 * l, g = 15 * l, y = 74 * l, x = 30 * l, T = document.createElement("canvas");
  T.width = c, T.height = u, T.style.cssText = "width:80px;height:48px";
  var b = T.getContext("2d");
  return b.font = "bold " + 9 * l + "px Helvetica,Arial,sans-serif", b.textBaseline = "top", b.fillStyle = t, b.fillRect(0, 0, c, u), b.fillStyle = e, b.fillText(s, f, p), b.fillRect(d, g, y, x), b.fillStyle = t, b.globalAlpha = 0.9, b.fillRect(d, g, y, x), {
    dom: T,
    update: function(L, M) {
      n = Math.min(n, L), i = Math.max(i, L), b.fillStyle = t, b.globalAlpha = 1, b.fillRect(0, 0, c, g), b.fillStyle = e, b.fillText(o(L) + " " + s + " (" + o(n) + "-" + o(i) + ")", f, p), b.drawImage(T, d + l, g, y - l, x, d, g, y - l, x), b.fillRect(d + y - l, g, l, x), b.fillStyle = t, b.globalAlpha = 0.9, b.fillRect(d + y - l, g, l, o((1 - L / M) * x));
    }
  };
};
const aa = parseInt(ad.replace(/\D+/g, "")), bc = aa >= 125 ? "uv1" : "uv2";
function hf(s, e) {
  if (e === jw)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), s;
  if (e === Ql || e === ld) {
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
    const n = t.count - 2, i = [];
    if (t)
      if (e === Ql)
        for (let l = 1; l <= n; l++)
          i.push(t.getX(0)), i.push(t.getX(l)), i.push(t.getX(l + 1));
      else
        for (let l = 0; l < n; l++)
          l % 2 === 0 ? (i.push(t.getX(l)), i.push(t.getX(l + 1)), i.push(t.getX(l + 2))) : (i.push(t.getX(l + 2)), i.push(t.getX(l + 1)), i.push(t.getX(l)));
    i.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const o = s.clone();
    return o.setIndex(i), o.clearGroups(), o;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), s;
}
var Zt = Uint8Array, pi = Uint16Array, lc = Uint32Array, Ed = new Zt([
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
]), Cd = new Zt([
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
]), Vb = new Zt([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), Od = function(s, e) {
  for (var t = new pi(31), n = 0; n < 31; ++n)
    t[n] = e += 1 << s[n - 1];
  for (var i = new lc(t[30]), n = 1; n < 30; ++n)
    for (var o = t[n]; o < t[n + 1]; ++o)
      i[o] = o - t[n] << 5 | n;
  return [t, i];
}, Rd = Od(Ed, 2), Dd = Rd[0], Wb = Rd[1];
Dd[28] = 258, Wb[258] = 28;
var Gb = Od(Cd, 0), $b = Gb[0], cc = new pi(32768);
for (var Ie = 0; Ie < 32768; ++Ie) {
  var oi = (Ie & 43690) >>> 1 | (Ie & 21845) << 1;
  oi = (oi & 52428) >>> 2 | (oi & 13107) << 2, oi = (oi & 61680) >>> 4 | (oi & 3855) << 4, cc[Ie] = ((oi & 65280) >>> 8 | (oi & 255) << 8) >>> 1;
}
var Ls = (function(s, e, t) {
  for (var n = s.length, i = 0, o = new pi(e); i < n; ++i)
    ++o[s[i] - 1];
  var l = new pi(e);
  for (i = 0; i < e; ++i)
    l[i] = l[i - 1] + o[i - 1] << 1;
  var c;
  if (t) {
    c = new pi(1 << e);
    var u = 15 - e;
    for (i = 0; i < n; ++i)
      if (s[i])
        for (var f = i << 4 | s[i], p = e - s[i], d = l[s[i] - 1]++ << p, g = d | (1 << p) - 1; d <= g; ++d)
          c[cc[d] >>> u] = f;
  } else
    for (c = new pi(n), i = 0; i < n; ++i)
      s[i] && (c[i] = cc[l[s[i] - 1]++] >>> 15 - s[i]);
  return c;
}), Bs = new Zt(288);
for (var Ie = 0; Ie < 144; ++Ie)
  Bs[Ie] = 8;
for (var Ie = 144; Ie < 256; ++Ie)
  Bs[Ie] = 9;
for (var Ie = 256; Ie < 280; ++Ie)
  Bs[Ie] = 7;
for (var Ie = 280; Ie < 288; ++Ie)
  Bs[Ie] = 8;
var Id = new Zt(32);
for (var Ie = 0; Ie < 32; ++Ie)
  Id[Ie] = 5;
var jb = /* @__PURE__ */ Ls(Bs, 9, 1), Xb = /* @__PURE__ */ Ls(Id, 5, 1), Ll = function(s) {
  for (var e = s[0], t = 1; t < s.length; ++t)
    s[t] > e && (e = s[t]);
  return e;
}, hn = function(s, e, t) {
  var n = e / 8 | 0;
  return (s[n] | s[n + 1] << 8) >> (e & 7) & t;
}, El = function(s, e) {
  var t = e / 8 | 0;
  return (s[t] | s[t + 1] << 8 | s[t + 2] << 16) >> (e & 7);
}, Yb = function(s) {
  return (s / 8 | 0) + (s & 7 && 1);
}, Zb = function(s, e, t) {
  (t == null || t > s.length) && (t = s.length);
  var n = new (s instanceof pi ? pi : s instanceof lc ? lc : Zt)(t - e);
  return n.set(s.subarray(e, t)), n;
}, qb = function(s, e, t) {
  var n = s.length;
  if (!n || t && !t.l && n < 5)
    return e || new Zt(0);
  var i = !e || t, o = !t || t.i;
  t || (t = {}), e || (e = new Zt(n * 3));
  var l = function(Bt) {
    var en = e.length;
    if (Bt > en) {
      var yt = new Zt(Math.max(en * 2, Bt));
      yt.set(e), e = yt;
    }
  }, c = t.f || 0, u = t.p || 0, f = t.b || 0, p = t.l, d = t.d, g = t.m, y = t.n, x = n * 8;
  do {
    if (!p) {
      t.f = c = hn(s, u, 1);
      var T = hn(s, u + 1, 3);
      if (u += 3, T)
        if (T == 1)
          p = jb, d = Xb, g = 9, y = 5;
        else if (T == 2) {
          var A = hn(s, u, 31) + 257, R = hn(s, u + 10, 15) + 4, k = A + hn(s, u + 5, 31) + 1;
          u += 14;
          for (var G = new Zt(k), V = new Zt(19), F = 0; F < R; ++F)
            V[Vb[F]] = hn(s, u + F * 3, 7);
          u += R * 3;
          for (var $ = Ll(V), z = (1 << $) - 1, U = Ls(V, $, 1), F = 0; F < k; ) {
            var X = U[hn(s, u, z)];
            u += X & 15;
            var b = X >>> 4;
            if (b < 16)
              G[F++] = b;
            else {
              var q = 0, Z = 0;
              for (b == 16 ? (Z = 3 + hn(s, u, 3), u += 2, q = G[F - 1]) : b == 17 ? (Z = 3 + hn(s, u, 7), u += 3) : b == 18 && (Z = 11 + hn(s, u, 127), u += 7); Z--; )
                G[F++] = q;
            }
          }
          var ee = G.subarray(0, A), Q = G.subarray(A);
          g = Ll(ee), y = Ll(Q), p = Ls(ee, g, 1), d = Ls(Q, y, 1);
        } else
          throw "invalid block type";
      else {
        var b = Yb(u) + 4, L = s[b - 4] | s[b - 3] << 8, M = b + L;
        if (M > n) {
          if (o)
            throw "unexpected EOF";
          break;
        }
        i && l(f + L), e.set(s.subarray(b, M), f), t.b = f += L, t.p = u = M * 8;
        continue;
      }
      if (u > x) {
        if (o)
          throw "unexpected EOF";
        break;
      }
    }
    i && l(f + 131072);
    for (var Le = (1 << g) - 1, we = (1 << y) - 1, xe = u; ; xe = u) {
      var q = p[El(s, u) & Le], ge = q >>> 4;
      if (u += q & 15, u > x) {
        if (o)
          throw "unexpected EOF";
        break;
      }
      if (!q)
        throw "invalid length/literal";
      if (ge < 256)
        e[f++] = ge;
      else if (ge == 256) {
        xe = u, p = null;
        break;
      } else {
        var Ee = ge - 254;
        if (ge > 264) {
          var F = ge - 257, Ce = Ed[F];
          Ee = hn(s, u, (1 << Ce) - 1) + Dd[F], u += Ce;
        }
        var Oe = d[El(s, u) & we], ct = Oe >>> 4;
        if (!Oe)
          throw "invalid distance";
        u += Oe & 15;
        var Q = $b[ct];
        if (ct > 3) {
          var Ce = Cd[ct];
          Q += El(s, u) & (1 << Ce) - 1, u += Ce;
        }
        if (u > x) {
          if (o)
            throw "unexpected EOF";
          break;
        }
        i && l(f + 131072);
        for (var ut = f + Ee; f < ut; f += 4)
          e[f] = e[f - Q], e[f + 1] = e[f + 1 - Q], e[f + 2] = e[f + 2 - Q], e[f + 3] = e[f + 3 - Q];
        f = ut;
      }
    }
    t.l = p, t.p = xe, t.b = f, p && (c = 1, t.m = g, t.d = d, t.n = y);
  } while (!c);
  return f == e.length ? e : Zb(e, 0, f);
}, Kb = /* @__PURE__ */ new Zt(0), Qb = function(s) {
  if ((s[0] & 15) != 8 || s[0] >>> 4 > 7 || (s[0] << 8 | s[1]) % 31)
    throw "invalid zlib data";
  if (s[1] & 32)
    throw "invalid zlib data: preset dictionaries not supported";
};
function Jb(s, e) {
  return qb((Qb(s), s.subarray(2, -4)), e);
}
var e1 = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), t1 = 0;
try {
  e1.decode(Kb, { stream: !0 }), t1 = 1;
} catch {
}
class n1 extends Be {
  constructor(e, t = {}) {
    super(e), this.isWater = !0;
    const n = this, i = t.textureWidth !== void 0 ? t.textureWidth : 512, o = t.textureHeight !== void 0 ? t.textureHeight : 512, l = t.clipBias !== void 0 ? t.clipBias : 0, c = t.alpha !== void 0 ? t.alpha : 1, u = t.time !== void 0 ? t.time : 0, f = t.waterNormals !== void 0 ? t.waterNormals : null, p = t.sunDirection !== void 0 ? t.sunDirection : new D(0.70707, 0.70707, 0), d = new oe(t.sunColor !== void 0 ? t.sunColor : 16777215), g = new oe(t.waterColor !== void 0 ? t.waterColor : 8355711), y = t.eye !== void 0 ? t.eye : new D(0, 0, 0), x = t.distortionScale !== void 0 ? t.distortionScale : 20, T = t.side !== void 0 ? t.side : na, b = t.fog !== void 0 ? t.fog : !1, L = new cd(), M = new D(), A = new D(), R = new D(), k = new be(), G = new D(0, 0, -1), V = new _n(), F = new D(), $ = new D(), z = new _n(), U = new be(), X = new Qi(), q = new Cr(i, o), Z = {
      uniforms: er.merge([
        ea.fog,
        ea.lights,
        {
          normalSampler: { value: null },
          mirrorSampler: { value: null },
          alpha: { value: 1 },
          time: { value: 0 },
          size: { value: 1 },
          distortionScale: { value: 20 },
          textureMatrix: { value: new be() },
          sunColor: { value: new oe(8355711) },
          sunDirection: { value: new D(0.70707, 0.70707, 0) },
          eye: { value: new D() },
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
					#include <${aa >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
					#include <fog_fragment>	
				}`
      )
    }, ee = new Pn({
      fragmentShader: Z.fragmentShader,
      vertexShader: Z.vertexShader,
      uniforms: er.clone(Z.uniforms),
      lights: !0,
      side: T,
      fog: b
    });
    ee.uniforms.mirrorSampler.value = q.texture, ee.uniforms.textureMatrix.value = U, ee.uniforms.alpha.value = c, ee.uniforms.time.value = u, ee.uniforms.normalSampler.value = f, ee.uniforms.sunColor.value = d, ee.uniforms.waterColor.value = g, ee.uniforms.sunDirection.value = p, ee.uniforms.distortionScale.value = x, ee.uniforms.eye.value = y, n.material = ee, n.onBeforeRender = function(Q, Le, we) {
      if (A.setFromMatrixPosition(n.matrixWorld), R.setFromMatrixPosition(we.matrixWorld), k.extractRotation(n.matrixWorld), M.set(0, 0, 1), M.applyMatrix4(k), F.subVectors(A, R), F.dot(M) > 0)
        return;
      F.reflect(M).negate(), F.add(A), k.extractRotation(we.matrixWorld), G.set(0, 0, -1), G.applyMatrix4(k), G.add(R), $.subVectors(A, G), $.reflect(M).negate(), $.add(A), X.position.copy(F), X.up.set(0, 1, 0), X.up.applyMatrix4(k), X.up.reflect(M), X.lookAt($), X.far = we.far, X.updateMatrixWorld(), X.projectionMatrix.copy(we.projectionMatrix), U.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), U.multiply(X.projectionMatrix), U.multiply(X.matrixWorldInverse), L.setFromNormalAndCoplanarPoint(M, A), L.applyMatrix4(X.matrixWorldInverse), V.set(L.normal.x, L.normal.y, L.normal.z, L.constant);
      const xe = X.projectionMatrix;
      z.x = (Math.sign(V.x) + xe.elements[8]) / xe.elements[0], z.y = (Math.sign(V.y) + xe.elements[9]) / xe.elements[5], z.z = -1, z.w = (1 + xe.elements[10]) / xe.elements[14], V.multiplyScalar(2 / V.dot(z)), xe.elements[2] = V.x, xe.elements[6] = V.y, xe.elements[10] = V.z + 1 - l, xe.elements[14] = V.w, y.setFromMatrixPosition(we.matrixWorld);
      const ge = Q.getRenderTarget(), Ee = Q.xr.enabled, Ce = Q.shadowMap.autoUpdate;
      n.visible = !1, Q.xr.enabled = !1, Q.shadowMap.autoUpdate = !1, Q.setRenderTarget(q), Q.state.buffers.depth.setMask(!0), Q.autoClear === !1 && Q.clear(), Q.render(Le, X), n.visible = !0, Q.xr.enabled = Ee, Q.shadowMap.autoUpdate = Ce, Q.setRenderTarget(ge);
      const Oe = we.viewport;
      Oe !== void 0 && Q.state.viewport(Oe);
    };
  }
}
var i1 = Object.defineProperty, r1 = (s, e, t) => e in s ? i1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, s1 = (s, e, t) => (r1(s, e + "", t), t);
class o1 {
  constructor() {
    s1(this, "_listeners");
  }
  /**
   * Adds a listener to an event type.
   * @param type The type of event to listen to.
   * @param listener The function that gets called when the event is fired.
   */
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
  }
  /**
      * Checks if listener is added to an event type.
      * @param type The type of event to listen to.
      * @param listener The function that gets called when the event is fired.
      */
  hasEventListener(e, t) {
    if (this._listeners === void 0)
      return !1;
    const n = this._listeners;
    return n[e] !== void 0 && n[e].indexOf(t) !== -1;
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
    const n = this._listeners[e.type];
    if (n !== void 0) {
      e.target = this;
      const i = n.slice(0);
      for (let o = 0, l = i.length; o < l; o++)
        i[o].call(this, e);
      e.target = null;
    }
  }
}
var a1 = Object.defineProperty, l1 = (s, e, t) => e in s ? a1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, te = (s, e, t) => (l1(s, typeof e != "symbol" ? e + "" : e, t), t);
const Oo = /* @__PURE__ */ new Xw(), ff = /* @__PURE__ */ new cd(), c1 = Math.cos(70 * (Math.PI / 180)), df = (s, e) => (s % e + e) % e;
class u1 extends o1 {
  constructor(e, t) {
    super(), te(this, "object"), te(this, "domElement"), te(this, "enabled", !0), te(this, "target", new D()), te(this, "minDistance", 0), te(this, "maxDistance", 1 / 0), te(this, "minZoom", 0), te(this, "maxZoom", 1 / 0), te(this, "minPolarAngle", 0), te(this, "maxPolarAngle", Math.PI), te(this, "minAzimuthAngle", -1 / 0), te(this, "maxAzimuthAngle", 1 / 0), te(this, "enableDamping", !1), te(this, "dampingFactor", 0.05), te(this, "enableZoom", !0), te(this, "zoomSpeed", 1), te(this, "enableRotate", !0), te(this, "rotateSpeed", 1), te(this, "enablePan", !0), te(this, "panSpeed", 1), te(this, "screenSpacePanning", !0), te(this, "keyPanSpeed", 7), te(this, "zoomToCursor", !1), te(this, "autoRotate", !1), te(this, "autoRotateSpeed", 2), te(this, "reverseOrbit", !1), te(this, "reverseHorizontalOrbit", !1), te(this, "reverseVerticalOrbit", !1), te(this, "keys", { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }), te(this, "mouseButtons", {
      LEFT: hi.ROTATE,
      MIDDLE: hi.DOLLY,
      RIGHT: hi.PAN
    }), te(this, "touches", { ONE: fi.ROTATE, TWO: fi.DOLLY_PAN }), te(this, "target0"), te(this, "position0"), te(this, "zoom0"), te(this, "_domElementKeyEvents", null), te(this, "getPolarAngle"), te(this, "getAzimuthalAngle"), te(this, "setPolarAngle"), te(this, "setAzimuthalAngle"), te(this, "getDistance"), te(this, "getZoomScale"), te(this, "listenToKeyEvents"), te(this, "stopListenToKeyEvents"), te(this, "saveState"), te(this, "reset"), te(this, "update"), te(this, "connect"), te(this, "dispose"), te(this, "dollyIn"), te(this, "dollyOut"), te(this, "getScale"), te(this, "setScale"), this.object = e, this.domElement = t, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = () => p.phi, this.getAzimuthalAngle = () => p.theta, this.setPolarAngle = (O) => {
      let j = df(O, 2 * Math.PI), se = p.phi;
      se < 0 && (se += 2 * Math.PI), j < 0 && (j += 2 * Math.PI);
      let ve = Math.abs(j - se);
      2 * Math.PI - ve < ve && (j < se ? j += 2 * Math.PI : se += 2 * Math.PI), d.phi = j - se, n.update();
    }, this.setAzimuthalAngle = (O) => {
      let j = df(O, 2 * Math.PI), se = p.theta;
      se < 0 && (se += 2 * Math.PI), j < 0 && (j += 2 * Math.PI);
      let ve = Math.abs(j - se);
      2 * Math.PI - ve < ve && (j < se ? j += 2 * Math.PI : se += 2 * Math.PI), d.theta = j - se, n.update();
    }, this.getDistance = () => n.object.position.distanceTo(n.target), this.listenToKeyEvents = (O) => {
      O.addEventListener("keydown", vn), this._domElementKeyEvents = O;
    }, this.stopListenToKeyEvents = () => {
      this._domElementKeyEvents.removeEventListener("keydown", vn), this._domElementKeyEvents = null;
    }, this.saveState = () => {
      n.target0.copy(n.target), n.position0.copy(n.object.position), n.zoom0 = n.object.zoom;
    }, this.reset = () => {
      n.target.copy(n.target0), n.object.position.copy(n.position0), n.object.zoom = n.zoom0, n.object.updateProjectionMatrix(), n.dispatchEvent(i), n.update(), u = c.NONE;
    }, this.update = (() => {
      const O = new D(), j = new D(0, 1, 0), se = new mn().setFromUnitVectors(e.up, j), ve = se.clone().invert(), $e = new D(), Ut = new mn(), rn = 2 * Math.PI;
      return function() {
        const Ns = n.object.position;
        se.setFromUnitVectors(e.up, j), ve.copy(se).invert(), O.copy(Ns).sub(n.target), O.applyQuaternion(se), p.setFromVector3(O), n.autoRotate && u === c.NONE && Z(X()), n.enableDamping ? (p.theta += d.theta * n.dampingFactor, p.phi += d.phi * n.dampingFactor) : (p.theta += d.theta, p.phi += d.phi);
        let sn = n.minAzimuthAngle, on = n.maxAzimuthAngle;
        isFinite(sn) && isFinite(on) && (sn < -Math.PI ? sn += rn : sn > Math.PI && (sn -= rn), on < -Math.PI ? on += rn : on > Math.PI && (on -= rn), sn <= on ? p.theta = Math.max(sn, Math.min(on, p.theta)) : p.theta = p.theta > (sn + on) / 2 ? Math.max(sn, p.theta) : Math.min(on, p.theta)), p.phi = Math.max(n.minPolarAngle, Math.min(n.maxPolarAngle, p.phi)), p.makeSafe(), n.enableDamping === !0 ? n.target.addScaledVector(y, n.dampingFactor) : n.target.add(y), n.zoomToCursor && $ || n.object.isOrthographicCamera ? p.radius = Oe(p.radius) : p.radius = Oe(p.radius * g), O.setFromSpherical(p), O.applyQuaternion(ve), Ns.copy(n.target).add(O), n.object.matrixAutoUpdate || n.object.updateMatrix(), n.object.lookAt(n.target), n.enableDamping === !0 ? (d.theta *= 1 - n.dampingFactor, d.phi *= 1 - n.dampingFactor, y.multiplyScalar(1 - n.dampingFactor)) : (d.set(0, 0, 0), y.set(0, 0, 0));
        let qn = !1;
        if (n.zoomToCursor && $) {
          let Ci = null;
          if (n.object instanceof Qi && n.object.isPerspectiveCamera) {
            const Oi = O.length();
            Ci = Oe(Oi * g);
            const lr = Oi - Ci;
            n.object.position.addScaledVector(V, lr), n.object.updateMatrixWorld();
          } else if (n.object.isOrthographicCamera) {
            const Oi = new D(F.x, F.y, 0);
            Oi.unproject(n.object), n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / g)), n.object.updateProjectionMatrix(), qn = !0;
            const lr = new D(F.x, F.y, 0);
            lr.unproject(n.object), n.object.position.sub(lr).add(Oi), n.object.updateMatrixWorld(), Ci = O.length();
          } else
            console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), n.zoomToCursor = !1;
          Ci !== null && (n.screenSpacePanning ? n.target.set(0, 0, -1).transformDirection(n.object.matrix).multiplyScalar(Ci).add(n.object.position) : (Oo.origin.copy(n.object.position), Oo.direction.set(0, 0, -1).transformDirection(n.object.matrix), Math.abs(n.object.up.dot(Oo.direction)) < c1 ? e.lookAt(n.target) : (ff.setFromNormalAndCoplanarPoint(n.object.up, n.target), Oo.intersectPlane(ff, n.target))));
        } else n.object instanceof Or && n.object.isOrthographicCamera && (qn = g !== 1, qn && (n.object.zoom = Math.max(n.minZoom, Math.min(n.maxZoom, n.object.zoom / g)), n.object.updateProjectionMatrix()));
        return g = 1, $ = !1, qn || $e.distanceToSquared(n.object.position) > f || 8 * (1 - Ut.dot(n.object.quaternion)) > f ? (n.dispatchEvent(i), $e.copy(n.object.position), Ut.copy(n.object.quaternion), qn = !1, !0) : !1;
      };
    })(), this.connect = (O) => {
      n.domElement = O, n.domElement.style.touchAction = "none", n.domElement.addEventListener("contextmenu", or), n.domElement.addEventListener("pointerdown", Xn), n.domElement.addEventListener("pointercancel", Pi), n.domElement.addEventListener("wheel", Zn);
    }, this.dispose = () => {
      var O, j, se, ve, $e, Ut;
      n.domElement && (n.domElement.style.touchAction = "auto"), (O = n.domElement) == null || O.removeEventListener("contextmenu", or), (j = n.domElement) == null || j.removeEventListener("pointerdown", Xn), (se = n.domElement) == null || se.removeEventListener("pointercancel", Pi), (ve = n.domElement) == null || ve.removeEventListener("wheel", Zn), ($e = n.domElement) == null || $e.ownerDocument.removeEventListener("pointermove", Yn), (Ut = n.domElement) == null || Ut.ownerDocument.removeEventListener("pointerup", Pi), n._domElementKeyEvents !== null && n._domElementKeyEvents.removeEventListener("keydown", vn);
    };
    const n = this, i = { type: "change" }, o = { type: "start" }, l = { type: "end" }, c = {
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
    const f = 1e-6, p = new af(), d = new af();
    let g = 1;
    const y = new D(), x = new ce(), T = new ce(), b = new ce(), L = new ce(), M = new ce(), A = new ce(), R = new ce(), k = new ce(), G = new ce(), V = new D(), F = new ce();
    let $ = !1;
    const z = [], U = {};
    function X() {
      return 2 * Math.PI / 60 / 60 * n.autoRotateSpeed;
    }
    function q() {
      return Math.pow(0.95, n.zoomSpeed);
    }
    function Z(O) {
      n.reverseOrbit || n.reverseHorizontalOrbit ? d.theta += O : d.theta -= O;
    }
    function ee(O) {
      n.reverseOrbit || n.reverseVerticalOrbit ? d.phi += O : d.phi -= O;
    }
    const Q = (() => {
      const O = new D();
      return function(se, ve) {
        O.setFromMatrixColumn(ve, 0), O.multiplyScalar(-se), y.add(O);
      };
    })(), Le = (() => {
      const O = new D();
      return function(se, ve) {
        n.screenSpacePanning === !0 ? O.setFromMatrixColumn(ve, 1) : (O.setFromMatrixColumn(ve, 0), O.crossVectors(n.object.up, O)), O.multiplyScalar(se), y.add(O);
      };
    })(), we = (() => {
      const O = new D();
      return function(se, ve) {
        const $e = n.domElement;
        if ($e && n.object instanceof Qi && n.object.isPerspectiveCamera) {
          const Ut = n.object.position;
          O.copy(Ut).sub(n.target);
          let rn = O.length();
          rn *= Math.tan(n.object.fov / 2 * Math.PI / 180), Q(2 * se * rn / $e.clientHeight, n.object.matrix), Le(2 * ve * rn / $e.clientHeight, n.object.matrix);
        } else $e && n.object instanceof Or && n.object.isOrthographicCamera ? (Q(
          se * (n.object.right - n.object.left) / n.object.zoom / $e.clientWidth,
          n.object.matrix
        ), Le(
          ve * (n.object.top - n.object.bottom) / n.object.zoom / $e.clientHeight,
          n.object.matrix
        )) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), n.enablePan = !1);
      };
    })();
    function xe(O) {
      n.object instanceof Qi && n.object.isPerspectiveCamera || n.object instanceof Or && n.object.isOrthographicCamera ? g = O : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), n.enableZoom = !1);
    }
    function ge(O) {
      xe(g / O);
    }
    function Ee(O) {
      xe(g * O);
    }
    function Ce(O) {
      if (!n.zoomToCursor || !n.domElement)
        return;
      $ = !0;
      const j = n.domElement.getBoundingClientRect(), se = O.clientX - j.left, ve = O.clientY - j.top, $e = j.width, Ut = j.height;
      F.x = se / $e * 2 - 1, F.y = -(ve / Ut) * 2 + 1, V.set(F.x, F.y, 1).unproject(n.object).sub(n.object.position).normalize();
    }
    function Oe(O) {
      return Math.max(n.minDistance, Math.min(n.maxDistance, O));
    }
    function ct(O) {
      x.set(O.clientX, O.clientY);
    }
    function ut(O) {
      Ce(O), R.set(O.clientX, O.clientY);
    }
    function Bt(O) {
      L.set(O.clientX, O.clientY);
    }
    function en(O) {
      T.set(O.clientX, O.clientY), b.subVectors(T, x).multiplyScalar(n.rotateSpeed);
      const j = n.domElement;
      j && (Z(2 * Math.PI * b.x / j.clientHeight), ee(2 * Math.PI * b.y / j.clientHeight)), x.copy(T), n.update();
    }
    function yt(O) {
      k.set(O.clientX, O.clientY), G.subVectors(k, R), G.y > 0 ? ge(q()) : G.y < 0 && Ee(q()), R.copy(k), n.update();
    }
    function tn(O) {
      M.set(O.clientX, O.clientY), A.subVectors(M, L).multiplyScalar(n.panSpeed), we(A.x, A.y), L.copy(M), n.update();
    }
    function rr(O) {
      Ce(O), O.deltaY < 0 ? Ee(q()) : O.deltaY > 0 && ge(q()), n.update();
    }
    function Rn(O) {
      let j = !1;
      switch (O.code) {
        case n.keys.UP:
          we(0, n.keyPanSpeed), j = !0;
          break;
        case n.keys.BOTTOM:
          we(0, -n.keyPanSpeed), j = !0;
          break;
        case n.keys.LEFT:
          we(n.keyPanSpeed, 0), j = !0;
          break;
        case n.keys.RIGHT:
          we(-n.keyPanSpeed, 0), j = !0;
          break;
      }
      j && (O.preventDefault(), n.update());
    }
    function nn() {
      if (z.length == 1)
        x.set(z[0].pageX, z[0].pageY);
      else {
        const O = 0.5 * (z[0].pageX + z[1].pageX), j = 0.5 * (z[0].pageY + z[1].pageY);
        x.set(O, j);
      }
    }
    function Dn() {
      if (z.length == 1)
        L.set(z[0].pageX, z[0].pageY);
      else {
        const O = 0.5 * (z[0].pageX + z[1].pageX), j = 0.5 * (z[0].pageY + z[1].pageY);
        L.set(O, j);
      }
    }
    function Ge() {
      const O = z[0].pageX - z[1].pageX, j = z[0].pageY - z[1].pageY, se = Math.sqrt(O * O + j * j);
      R.set(0, se);
    }
    function At() {
      n.enableZoom && Ge(), n.enablePan && Dn();
    }
    function Si() {
      n.enableZoom && Ge(), n.enableRotate && nn();
    }
    function vt(O) {
      if (z.length == 1)
        T.set(O.pageX, O.pageY);
      else {
        const se = Ei(O), ve = 0.5 * (O.pageX + se.x), $e = 0.5 * (O.pageY + se.y);
        T.set(ve, $e);
      }
      b.subVectors(T, x).multiplyScalar(n.rotateSpeed);
      const j = n.domElement;
      j && (Z(2 * Math.PI * b.x / j.clientHeight), ee(2 * Math.PI * b.y / j.clientHeight)), x.copy(T);
    }
    function Mi(O) {
      if (z.length == 1)
        M.set(O.pageX, O.pageY);
      else {
        const j = Ei(O), se = 0.5 * (O.pageX + j.x), ve = 0.5 * (O.pageY + j.y);
        M.set(se, ve);
      }
      A.subVectors(M, L).multiplyScalar(n.panSpeed), we(A.x, A.y), L.copy(M);
    }
    function sr(O) {
      const j = Ei(O), se = O.pageX - j.x, ve = O.pageY - j.y, $e = Math.sqrt(se * se + ve * ve);
      k.set(0, $e), G.set(0, Math.pow(k.y / R.y, n.zoomSpeed)), ge(G.y), R.copy(k);
    }
    function Ai(O) {
      n.enableZoom && sr(O), n.enablePan && Mi(O);
    }
    function Pt(O) {
      n.enableZoom && sr(O), n.enableRotate && vt(O);
    }
    function Xn(O) {
      var j, se;
      n.enabled !== !1 && (z.length === 0 && ((j = n.domElement) == null || j.ownerDocument.addEventListener("pointermove", Yn), (se = n.domElement) == null || se.ownerDocument.addEventListener("pointerup", Pi)), Wr(O), O.pointerType === "touch" ? Hr(O) : Li(O));
    }
    function Yn(O) {
      n.enabled !== !1 && (O.pointerType === "touch" ? Vr(O) : pa(O));
    }
    function Pi(O) {
      var j, se, ve;
      Gr(O), z.length === 0 && ((j = n.domElement) == null || j.releasePointerCapture(O.pointerId), (se = n.domElement) == null || se.ownerDocument.removeEventListener("pointermove", Yn), (ve = n.domElement) == null || ve.ownerDocument.removeEventListener("pointerup", Pi)), n.dispatchEvent(l), u = c.NONE;
    }
    function Li(O) {
      let j;
      switch (O.button) {
        case 0:
          j = n.mouseButtons.LEFT;
          break;
        case 1:
          j = n.mouseButtons.MIDDLE;
          break;
        case 2:
          j = n.mouseButtons.RIGHT;
          break;
        default:
          j = -1;
      }
      switch (j) {
        case hi.DOLLY:
          if (n.enableZoom === !1)
            return;
          ut(O), u = c.DOLLY;
          break;
        case hi.ROTATE:
          if (O.ctrlKey || O.metaKey || O.shiftKey) {
            if (n.enablePan === !1)
              return;
            Bt(O), u = c.PAN;
          } else {
            if (n.enableRotate === !1)
              return;
            ct(O), u = c.ROTATE;
          }
          break;
        case hi.PAN:
          if (O.ctrlKey || O.metaKey || O.shiftKey) {
            if (n.enableRotate === !1)
              return;
            ct(O), u = c.ROTATE;
          } else {
            if (n.enablePan === !1)
              return;
            Bt(O), u = c.PAN;
          }
          break;
        default:
          u = c.NONE;
      }
      u !== c.NONE && n.dispatchEvent(o);
    }
    function pa(O) {
      if (n.enabled !== !1)
        switch (u) {
          case c.ROTATE:
            if (n.enableRotate === !1)
              return;
            en(O);
            break;
          case c.DOLLY:
            if (n.enableZoom === !1)
              return;
            yt(O);
            break;
          case c.PAN:
            if (n.enablePan === !1)
              return;
            tn(O);
            break;
        }
    }
    function Zn(O) {
      n.enabled === !1 || n.enableZoom === !1 || u !== c.NONE && u !== c.ROTATE || (O.preventDefault(), n.dispatchEvent(o), rr(O), n.dispatchEvent(l));
    }
    function vn(O) {
      n.enabled === !1 || n.enablePan === !1 || Rn(O);
    }
    function Hr(O) {
      switch (ar(O), z.length) {
        case 1:
          switch (n.touches.ONE) {
            case fi.ROTATE:
              if (n.enableRotate === !1)
                return;
              nn(), u = c.TOUCH_ROTATE;
              break;
            case fi.PAN:
              if (n.enablePan === !1)
                return;
              Dn(), u = c.TOUCH_PAN;
              break;
            default:
              u = c.NONE;
          }
          break;
        case 2:
          switch (n.touches.TWO) {
            case fi.DOLLY_PAN:
              if (n.enableZoom === !1 && n.enablePan === !1)
                return;
              At(), u = c.TOUCH_DOLLY_PAN;
              break;
            case fi.DOLLY_ROTATE:
              if (n.enableZoom === !1 && n.enableRotate === !1)
                return;
              Si(), u = c.TOUCH_DOLLY_ROTATE;
              break;
            default:
              u = c.NONE;
          }
          break;
        default:
          u = c.NONE;
      }
      u !== c.NONE && n.dispatchEvent(o);
    }
    function Vr(O) {
      switch (ar(O), u) {
        case c.TOUCH_ROTATE:
          if (n.enableRotate === !1)
            return;
          vt(O), n.update();
          break;
        case c.TOUCH_PAN:
          if (n.enablePan === !1)
            return;
          Mi(O), n.update();
          break;
        case c.TOUCH_DOLLY_PAN:
          if (n.enableZoom === !1 && n.enablePan === !1)
            return;
          Ai(O), n.update();
          break;
        case c.TOUCH_DOLLY_ROTATE:
          if (n.enableZoom === !1 && n.enableRotate === !1)
            return;
          Pt(O), n.update();
          break;
        default:
          u = c.NONE;
      }
    }
    function or(O) {
      n.enabled !== !1 && O.preventDefault();
    }
    function Wr(O) {
      z.push(O);
    }
    function Gr(O) {
      delete U[O.pointerId];
      for (let j = 0; j < z.length; j++)
        if (z[j].pointerId == O.pointerId) {
          z.splice(j, 1);
          return;
        }
    }
    function ar(O) {
      let j = U[O.pointerId];
      j === void 0 && (j = new ce(), U[O.pointerId] = j), j.set(O.pageX, O.pageY);
    }
    function Ei(O) {
      const j = O.pointerId === z[0].pointerId ? z[1] : z[0];
      return U[j.pointerId];
    }
    this.dollyIn = (O = q()) => {
      Ee(O), n.update();
    }, this.dollyOut = (O = q()) => {
      ge(O), n.update();
    }, this.getScale = () => g, this.setScale = (O) => {
      xe(O), n.update();
    }, this.getZoomScale = () => q(), t !== void 0 && this.connect(t), this.update();
  }
}
class h1 extends u1 {
  constructor(e, t) {
    super(e, t), this.screenSpacePanning = !1, this.mouseButtons.LEFT = hi.PAN, this.mouseButtons.RIGHT = hi.ROTATE, this.touches.ONE = fi.PAN, this.touches.TWO = fi.DOLLY_ROTATE;
  }
}
var f1 = Object.defineProperty, d1 = (s, e, t) => e in s ? f1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, qi = (s, e, t) => (d1(s, typeof e != "symbol" ? e + "" : e, t), t);
class Us {
  constructor() {
    qi(this, "enabled", !0), qi(this, "needsSwap", !0), qi(this, "clear", !1), qi(this, "renderToScreen", !1);
  }
  setSize(e, t) {
  }
  render(e, t, n, i, o) {
    console.error("THREE.Pass: .render() must be implemented in derived pass.");
  }
  dispose() {
  }
}
class Fd {
  constructor(e) {
    qi(this, "camera", new Or(-1, 1, 1, -1, 0, 1)), qi(this, "geometry", new Fr(2, 2)), qi(this, "mesh"), this.mesh = new Be(this.geometry, e);
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
var p1 = Object.defineProperty, m1 = (s, e, t) => e in s ? p1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ro = (s, e, t) => (m1(s, typeof e != "symbol" ? e + "" : e, t), t);
class pf extends Us {
  constructor(e, t = "tDiffuse") {
    super(), Ro(this, "textureID"), Ro(this, "uniforms"), Ro(this, "material"), Ro(this, "fsQuad"), this.textureID = t, e instanceof Pn ? (this.uniforms = e.uniforms, this.material = e) : (this.uniforms = er.clone(e.uniforms), this.material = new Pn({
      defines: Object.assign({}, e.defines),
      uniforms: this.uniforms,
      vertexShader: e.vertexShader,
      fragmentShader: e.fragmentShader
    })), this.fsQuad = new Fd(this.material);
  }
  render(e, t, n) {
    this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n.texture), this.fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this.fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this.fsQuad.render(e));
  }
  dispose() {
    this.fsQuad.dispose(), this.material.dispose();
  }
}
const uc = {
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
}, g1 = {
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
var _1 = Object.defineProperty, y1 = (s, e, t) => e in s ? _1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, mf = (s, e, t) => (y1(s, typeof e != "symbol" ? e + "" : e, t), t);
const v1 = /* @__PURE__ */ (() => {
  const s = class extends Us {
    constructor(t, n, i, o) {
      super(), this.strength = n !== void 0 ? n : 1, this.radius = i, this.threshold = o, this.resolution = t !== void 0 ? new ce(t.x, t.y) : new ce(256, 256), this.clearColor = new oe(0, 0, 0), this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
      let l = Math.round(this.resolution.x / 2), c = Math.round(this.resolution.y / 2);
      this.renderTargetBright = new Cr(l, c, { type: Yi }), this.renderTargetBright.texture.name = "UnrealBloomPass.bright", this.renderTargetBright.texture.generateMipmaps = !1;
      for (let g = 0; g < this.nMips; g++) {
        const y = new Cr(l, c, { type: Yi });
        y.texture.name = "UnrealBloomPass.h" + g, y.texture.generateMipmaps = !1, this.renderTargetsHorizontal.push(y);
        const x = new Cr(l, c, { type: Yi });
        x.texture.name = "UnrealBloomPass.v" + g, x.texture.generateMipmaps = !1, this.renderTargetsVertical.push(x), l = Math.round(l / 2), c = Math.round(c / 2);
      }
      const u = g1;
      this.highPassUniforms = er.clone(u.uniforms), this.highPassUniforms.luminosityThreshold.value = o, this.highPassUniforms.smoothWidth.value = 0.01, this.materialHighPassFilter = new Pn({
        uniforms: this.highPassUniforms,
        vertexShader: u.vertexShader,
        fragmentShader: u.fragmentShader,
        defines: {}
      }), this.separableBlurMaterials = [];
      const f = [3, 5, 7, 9, 11];
      l = Math.round(this.resolution.x / 2), c = Math.round(this.resolution.y / 2);
      for (let g = 0; g < this.nMips; g++)
        this.separableBlurMaterials.push(this.getSeperableBlurMaterial(f[g])), this.separableBlurMaterials[g].uniforms.texSize.value = new ce(l, c), l = Math.round(l / 2), c = Math.round(c / 2);
      this.compositeMaterial = this.getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = n, this.compositeMaterial.uniforms.bloomRadius.value = 0.1, this.compositeMaterial.needsUpdate = !0;
      const p = [1, 0.8, 0.6, 0.4, 0.2];
      this.compositeMaterial.uniforms.bloomFactors.value = p, this.bloomTintColors = [
        new D(1, 1, 1),
        new D(1, 1, 1),
        new D(1, 1, 1),
        new D(1, 1, 1),
        new D(1, 1, 1)
      ], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors;
      const d = uc;
      this.copyUniforms = er.clone(d.uniforms), this.copyUniforms.opacity.value = 1, this.materialCopy = new Pn({
        uniforms: this.copyUniforms,
        vertexShader: d.vertexShader,
        fragmentShader: d.fragmentShader,
        blending: _c,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0
      }), this.enabled = !0, this.needsSwap = !1, this._oldClearColor = new oe(), this.oldClearAlpha = 1, this.basic = new qt(), this.fsQuad = new Fd(null);
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
    setSize(t, n) {
      let i = Math.round(t / 2), o = Math.round(n / 2);
      this.renderTargetBright.setSize(i, o);
      for (let l = 0; l < this.nMips; l++)
        this.renderTargetsHorizontal[l].setSize(i, o), this.renderTargetsVertical[l].setSize(i, o), this.separableBlurMaterials[l].uniforms.texSize.value = new ce(i, o), i = Math.round(i / 2), o = Math.round(o / 2);
    }
    render(t, n, i, o, l) {
      t.getClearColor(this._oldClearColor), this.oldClearAlpha = t.getClearAlpha();
      const c = t.autoClear;
      t.autoClear = !1, t.setClearColor(this.clearColor, 0), l && t.state.buffers.stencil.setTest(!1), this.renderToScreen && (this.fsQuad.material = this.basic, this.basic.map = i.texture, t.setRenderTarget(null), t.clear(), this.fsQuad.render(t)), this.highPassUniforms.tDiffuse.value = i.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this.fsQuad.material = this.materialHighPassFilter, t.setRenderTarget(this.renderTargetBright), t.clear(), this.fsQuad.render(t);
      let u = this.renderTargetBright;
      for (let f = 0; f < this.nMips; f++)
        this.fsQuad.material = this.separableBlurMaterials[f], this.separableBlurMaterials[f].uniforms.colorTexture.value = u.texture, this.separableBlurMaterials[f].uniforms.direction.value = s.BlurDirectionX, t.setRenderTarget(this.renderTargetsHorizontal[f]), t.clear(), this.fsQuad.render(t), this.separableBlurMaterials[f].uniforms.colorTexture.value = this.renderTargetsHorizontal[f].texture, this.separableBlurMaterials[f].uniforms.direction.value = s.BlurDirectionY, t.setRenderTarget(this.renderTargetsVertical[f]), t.clear(), this.fsQuad.render(t), u = this.renderTargetsVertical[f];
      this.fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, t.setRenderTarget(this.renderTargetsHorizontal[0]), t.clear(), this.fsQuad.render(t), this.fsQuad.material = this.materialCopy, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, l && t.state.buffers.stencil.setTest(!0), this.renderToScreen ? (t.setRenderTarget(null), this.fsQuad.render(t)) : (t.setRenderTarget(i), this.fsQuad.render(t)), t.setClearColor(this._oldClearColor, this.oldClearAlpha), t.autoClear = c;
    }
    getSeperableBlurMaterial(t) {
      return new Pn({
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
      return new Pn({
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
  return mf(e, "BlurDirectionX", new ce(1, 0)), mf(e, "BlurDirectionY", new ce(0, 1)), e;
})();
var w1 = Object.defineProperty, b1 = (s, e, t) => e in s ? w1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Cl = (s, e, t) => (b1(s, typeof e != "symbol" ? e + "" : e, t), t);
class gf extends Us {
  constructor(e, t) {
    super(), Cl(this, "scene"), Cl(this, "camera"), Cl(this, "inverse"), this.scene = e, this.camera = t, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
  }
  render(e, t, n) {
    const i = e.getContext(), o = e.state;
    o.buffers.color.setMask(!1), o.buffers.depth.setMask(!1), o.buffers.color.setLocked(!0), o.buffers.depth.setLocked(!0);
    let l, c;
    this.inverse ? (l = 0, c = 1) : (l = 1, c = 0), o.buffers.stencil.setTest(!0), o.buffers.stencil.setOp(i.REPLACE, i.REPLACE, i.REPLACE), o.buffers.stencil.setFunc(i.ALWAYS, l, 4294967295), o.buffers.stencil.setClear(c), o.buffers.stencil.setLocked(!0), e.setRenderTarget(n), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), o.buffers.color.setLocked(!1), o.buffers.depth.setLocked(!1), o.buffers.stencil.setLocked(!1), o.buffers.stencil.setFunc(i.EQUAL, 1, 4294967295), o.buffers.stencil.setOp(i.KEEP, i.KEEP, i.KEEP), o.buffers.stencil.setLocked(!0);
  }
}
class x1 extends Us {
  constructor() {
    super(), this.needsSwap = !1;
  }
  render(e) {
    e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
  }
}
var T1 = Object.defineProperty, S1 = (s, e, t) => e in s ? T1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, jt = (s, e, t) => (S1(s, typeof e != "symbol" ? e + "" : e, t), t);
class M1 {
  constructor(e, t) {
    if (jt(this, "renderer"), jt(this, "_pixelRatio"), jt(this, "_width"), jt(this, "_height"), jt(this, "renderTarget1"), jt(this, "renderTarget2"), jt(this, "writeBuffer"), jt(this, "readBuffer"), jt(this, "renderToScreen"), jt(this, "passes", []), jt(this, "copyPass"), jt(this, "clock"), this.renderer = e, t === void 0) {
      const n = {
        minFilter: vi,
        magFilter: vi,
        format: ud
      }, i = e.getSize(new ce());
      this._pixelRatio = e.getPixelRatio(), this._width = i.width, this._height = i.height, t = new Cr(
        this._width * this._pixelRatio,
        this._height * this._pixelRatio,
        n
      ), t.texture.name = "EffectComposer.rt1";
    } else
      this._pixelRatio = 1, this._width = t.width, this._height = t.height;
    this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, uc === void 0 && console.error("THREE.EffectComposer relies on CopyShader"), pf === void 0 && console.error("THREE.EffectComposer relies on ShaderPass"), this.copyPass = new pf(uc), this.copyPass.material.blending = Yw, this.clock = new ia();
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
    let n = !1;
    const i = this.passes.length;
    for (let o = 0; o < i; o++) {
      const l = this.passes[o];
      if (l.enabled !== !1) {
        if (l.renderToScreen = this.renderToScreen && this.isLastEnabledPass(o), l.render(this.renderer, this.writeBuffer, this.readBuffer, e, n), l.needsSwap) {
          if (n) {
            const c = this.renderer.getContext(), u = this.renderer.state.buffers.stencil;
            u.setFunc(c.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), u.setFunc(c.EQUAL, 1, 4294967295);
          }
          this.swapBuffers();
        }
        gf !== void 0 && (l instanceof gf ? n = !0 : l instanceof x1 && (n = !1));
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
    const n = this._width * this._pixelRatio, i = this._height * this._pixelRatio;
    this.renderTarget1.setSize(n, i), this.renderTarget2.setSize(n, i);
    for (let o = 0; o < this.passes.length; o++)
      this.passes[o].setSize(n, i);
  }
  setPixelRatio(e) {
    this._pixelRatio = e, this.setSize(this._width, this._height);
  }
  dispose() {
    this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
  }
}
var A1 = Object.defineProperty, P1 = (s, e, t) => e in s ? A1(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Hi = (s, e, t) => (P1(s, typeof e != "symbol" ? e + "" : e, t), t);
class L1 extends Us {
  constructor(e, t, n, i, o = 0) {
    super(), Hi(this, "scene"), Hi(this, "camera"), Hi(this, "overrideMaterial"), Hi(this, "clearColor"), Hi(this, "clearAlpha"), Hi(this, "clearDepth", !1), Hi(this, "_oldClearColor", new oe()), this.scene = e, this.camera = t, this.overrideMaterial = n, this.clearColor = i, this.clearAlpha = o, this.clear = !0, this.needsSwap = !1;
  }
  render(e, t, n) {
    let i = e.autoClear;
    e.autoClear = !1;
    let o, l = null;
    this.overrideMaterial !== void 0 && (l = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor && (e.getClearColor(this._oldClearColor), o = e.getClearAlpha(), e.setClearColor(this.clearColor, this.clearAlpha)), this.clearDepth && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : n), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor && e.setClearColor(this._oldClearColor, o), this.overrideMaterial !== void 0 && (this.scene.overrideMaterial = l), e.autoClear = i;
  }
}
function Ur(s) {
  if (typeof TextDecoder < "u")
    return new TextDecoder().decode(s);
  let e = "";
  for (let t = 0, n = s.length; t < n; t++)
    e += String.fromCharCode(s[t]);
  try {
    return decodeURIComponent(escape(e));
  } catch {
    return e;
  }
}
const Ki = "srgb", jn = "srgb-linear", _f = 3001, E1 = 3e3;
class C1 extends yc {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new F1(t);
    }), this.register(function(t) {
      return new B1(t);
    }), this.register(function(t) {
      return new $1(t);
    }), this.register(function(t) {
      return new j1(t);
    }), this.register(function(t) {
      return new X1(t);
    }), this.register(function(t) {
      return new k1(t);
    }), this.register(function(t) {
      return new z1(t);
    }), this.register(function(t) {
      return new N1(t);
    }), this.register(function(t) {
      return new H1(t);
    }), this.register(function(t) {
      return new I1(t);
    }), this.register(function(t) {
      return new V1(t);
    }), this.register(function(t) {
      return new U1(t);
    }), this.register(function(t) {
      return new G1(t);
    }), this.register(function(t) {
      return new W1(t);
    }), this.register(function(t) {
      return new R1(t);
    }), this.register(function(t) {
      return new Y1(t);
    }), this.register(function(t) {
      return new Z1(t);
    });
  }
  load(e, t, n, i) {
    const o = this;
    let l;
    if (this.resourcePath !== "")
      l = this.resourcePath;
    else if (this.path !== "") {
      const f = Rr.extractUrlBase(e);
      l = Rr.resolveURL(f, this.path);
    } else
      l = Rr.extractUrlBase(e);
    this.manager.itemStart(e);
    const c = function(f) {
      i ? i(f) : console.error(f), o.manager.itemError(e), o.manager.itemEnd(e);
    }, u = new wi(this.manager);
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
      n,
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
  parse(e, t, n, i) {
    let o;
    const l = {}, c = {};
    if (typeof e == "string")
      o = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (Ur(new Uint8Array(e.slice(0, 4))) === Bd) {
        try {
          l[me.KHR_BINARY_GLTF] = new q1(e);
        } catch (p) {
          i && i(p);
          return;
        }
        o = JSON.parse(l[me.KHR_BINARY_GLTF].content);
      } else
        o = JSON.parse(Ur(new Uint8Array(e)));
    else
      o = e;
    if (o.asset === void 0 || o.asset.version[0] < 2) {
      i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const u = new cx(o, {
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
            l[p] = new D1();
            break;
          case me.KHR_DRACO_MESH_COMPRESSION:
            l[p] = new K1(o, this.dracoLoader);
            break;
          case me.KHR_TEXTURE_TRANSFORM:
            l[p] = new Q1();
            break;
          case me.KHR_MESH_QUANTIZATION:
            l[p] = new J1();
            break;
          default:
            d.indexOf(p) >= 0 && c[p] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + p + '".');
        }
      }
    u.setExtensions(l), u.setPlugins(c), u.parse(n, i);
  }
  parseAsync(e, t) {
    const n = this;
    return new Promise(function(i, o) {
      n.parse(e, t, i, o);
    });
  }
}
function O1() {
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
class R1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let n = 0, i = t.length; n < i; n++) {
      const o = t[n];
      o.extensions && o.extensions[this.name] && o.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, o.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, n = "light:" + e;
    let i = t.cache.get(n);
    if (i)
      return i;
    const o = t.json, u = ((o.extensions && o.extensions[this.name] || {}).lights || [])[e];
    let f;
    const p = new oe(16777215);
    u.color !== void 0 && p.setRGB(u.color[0], u.color[1], u.color[2], jn);
    const d = u.range !== void 0 ? u.range : 0;
    switch (u.type) {
      case "directional":
        f = new ta(p), f.target.position.set(0, 0, -1), f.add(f.target);
        break;
      case "point":
        f = new Jl(p), f.distance = d;
        break;
      case "spot":
        f = new hd(p), f.distance = d, u.spot = u.spot || {}, u.spot.innerConeAngle = u.spot.innerConeAngle !== void 0 ? u.spot.innerConeAngle : 0, u.spot.outerConeAngle = u.spot.outerConeAngle !== void 0 ? u.spot.outerConeAngle : Math.PI / 4, f.angle = u.spot.outerConeAngle, f.penumbra = 1 - u.spot.innerConeAngle / u.spot.outerConeAngle, f.target.position.set(0, 0, -1), f.add(f.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + u.type);
    }
    return f.position.set(0, 0, 0), f.decay = 2, Wn(f, u), u.intensity !== void 0 && (f.intensity = u.intensity), f.name = t.createUniqueName(u.name || "light_" + e), i = Promise.resolve(f), t.cache.add(n, i), i;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, n = this.parser, o = n.json.nodes[e], c = (o.extensions && o.extensions[this.name] || {}).light;
    return c === void 0 ? null : this._loadLight(c).then(function(u) {
      return n._getNodeRef(t.cache, c, u);
    });
  }
}
class D1 {
  constructor() {
    this.name = me.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return qt;
  }
  extendParams(e, t, n) {
    const i = [];
    e.color = new oe(1, 1, 1), e.opacity = 1;
    const o = t.pbrMetallicRoughness;
    if (o) {
      if (Array.isArray(o.baseColorFactor)) {
        const l = o.baseColorFactor;
        e.color.setRGB(l[0], l[1], l[2], jn), e.opacity = l[3];
      }
      o.baseColorTexture !== void 0 && i.push(n.assignTexture(e, "map", o.baseColorTexture, Ki));
    }
    return Promise.all(i);
  }
}
class I1 {
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
class F1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    if (l.clearcoatFactor !== void 0 && (t.clearcoat = l.clearcoatFactor), l.clearcoatTexture !== void 0 && o.push(n.assignTexture(t, "clearcoatMap", l.clearcoatTexture)), l.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = l.clearcoatRoughnessFactor), l.clearcoatRoughnessTexture !== void 0 && o.push(n.assignTexture(t, "clearcoatRoughnessMap", l.clearcoatRoughnessTexture)), l.clearcoatNormalTexture !== void 0 && (o.push(n.assignTexture(t, "clearcoatNormalMap", l.clearcoatNormalTexture)), l.clearcoatNormalTexture.scale !== void 0)) {
      const c = l.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new ce(c, c);
    }
    return Promise.all(o);
  }
}
class B1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = i.extensions[this.name];
    return t.dispersion = o.dispersion !== void 0 ? o.dispersion : 0, Promise.resolve();
  }
}
class U1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return l.iridescenceFactor !== void 0 && (t.iridescence = l.iridescenceFactor), l.iridescenceTexture !== void 0 && o.push(n.assignTexture(t, "iridescenceMap", l.iridescenceTexture)), l.iridescenceIor !== void 0 && (t.iridescenceIOR = l.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), l.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = l.iridescenceThicknessMinimum), l.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = l.iridescenceThicknessMaximum), l.iridescenceThicknessTexture !== void 0 && o.push(
      n.assignTexture(t, "iridescenceThicknessMap", l.iridescenceThicknessTexture)
    ), Promise.all(o);
  }
}
class k1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [];
    t.sheenColor = new oe(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const l = i.extensions[this.name];
    if (l.sheenColorFactor !== void 0) {
      const c = l.sheenColorFactor;
      t.sheenColor.setRGB(c[0], c[1], c[2], jn);
    }
    return l.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = l.sheenRoughnessFactor), l.sheenColorTexture !== void 0 && o.push(n.assignTexture(t, "sheenColorMap", l.sheenColorTexture, Ki)), l.sheenRoughnessTexture !== void 0 && o.push(n.assignTexture(t, "sheenRoughnessMap", l.sheenRoughnessTexture)), Promise.all(o);
  }
}
class z1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return l.transmissionFactor !== void 0 && (t.transmission = l.transmissionFactor), l.transmissionTexture !== void 0 && o.push(n.assignTexture(t, "transmissionMap", l.transmissionTexture)), Promise.all(o);
  }
}
class N1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    t.thickness = l.thicknessFactor !== void 0 ? l.thicknessFactor : 0, l.thicknessTexture !== void 0 && o.push(n.assignTexture(t, "thicknessMap", l.thicknessTexture)), t.attenuationDistance = l.attenuationDistance || 1 / 0;
    const c = l.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new oe().setRGB(
      c[0],
      c[1],
      c[2],
      jn
    ), Promise.all(o);
  }
}
class H1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = i.extensions[this.name];
    return t.ior = o.ior !== void 0 ? o.ior : 1.5, Promise.resolve();
  }
}
class V1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    t.specularIntensity = l.specularFactor !== void 0 ? l.specularFactor : 1, l.specularTexture !== void 0 && o.push(n.assignTexture(t, "specularIntensityMap", l.specularTexture));
    const c = l.specularColorFactor || [1, 1, 1];
    return t.specularColor = new oe().setRGB(c[0], c[1], c[2], jn), l.specularColorTexture !== void 0 && o.push(
      n.assignTexture(t, "specularColorMap", l.specularColorTexture, Ki)
    ), Promise.all(o);
  }
}
class W1 {
  constructor(e) {
    this.parser = e, this.name = me.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return t.bumpScale = l.bumpFactor !== void 0 ? l.bumpFactor : 1, l.bumpTexture !== void 0 && o.push(n.assignTexture(t, "bumpMap", l.bumpTexture)), Promise.all(o);
  }
}
class G1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : Cn;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, i = n.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const o = [], l = i.extensions[this.name];
    return l.anisotropyStrength !== void 0 && (t.anisotropy = l.anisotropyStrength), l.anisotropyRotation !== void 0 && (t.anisotropyRotation = l.anisotropyRotation), l.anisotropyTexture !== void 0 && o.push(n.assignTexture(t, "anisotropyMap", l.anisotropyTexture)), Promise.all(o);
  }
}
class $1 {
  constructor(e) {
    this.parser = e, this.name = me.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, n = t.json, i = n.textures[e];
    if (!i.extensions || !i.extensions[this.name])
      return null;
    const o = i.extensions[this.name], l = t.options.ktx2Loader;
    if (!l) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, o.source, l);
  }
}
class j1 {
  constructor(e) {
    this.parser = e, this.name = me.EXT_TEXTURE_WEBP, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, i = n.json, o = i.textures[e];
    if (!o.extensions || !o.extensions[t])
      return null;
    const l = o.extensions[t], c = i.images[l.source];
    let u = n.textureLoader;
    if (c.uri) {
      const f = n.options.manager.getHandler(c.uri);
      f !== null && (u = f);
    }
    return this.detectSupport().then(function(f) {
      if (f)
        return n.loadTextureImage(e, l.source, u);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      return n.loadTexture(e);
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
class X1 {
  constructor(e) {
    this.parser = e, this.name = me.EXT_TEXTURE_AVIF, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, i = n.json, o = i.textures[e];
    if (!o.extensions || !o.extensions[t])
      return null;
    const l = o.extensions[t], c = i.images[l.source];
    let u = n.textureLoader;
    if (c.uri) {
      const f = n.options.manager.getHandler(c.uri);
      f !== null && (u = f);
    }
    return this.detectSupport().then(function(f) {
      if (f)
        return n.loadTextureImage(e, l.source, u);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
      return n.loadTexture(e);
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
class Y1 {
  constructor(e) {
    this.name = me.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const i = n.extensions[this.name], o = this.parser.getDependency("buffer", i.buffer), l = this.parser.options.meshoptDecoder;
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
class Z1 {
  constructor(e) {
    this.name = me.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0)
      return null;
    const i = t.meshes[n.mesh];
    for (const f of i.primitives)
      if (f.mode !== Yt.TRIANGLES && f.mode !== Yt.TRIANGLE_STRIP && f.mode !== Yt.TRIANGLE_FAN && f.mode !== void 0)
        return null;
    const l = n.extensions[this.name].attributes, c = [], u = {};
    for (const f in l)
      c.push(
        this.parser.getDependency("accessor", l[f]).then((p) => (u[f] = p, u[f]))
      );
    return c.length < 1 ? null : (c.push(this.parser.createNodeMesh(e)), Promise.all(c).then((f) => {
      const p = f.pop(), d = p.isGroup ? p.children : [p], g = f[0].count, y = [];
      for (const x of d) {
        const T = new be(), b = new D(), L = new mn(), M = new D(1, 1, 1), A = new vc(x.geometry, x.material, g);
        for (let R = 0; R < g; R++)
          u.TRANSLATION && b.fromBufferAttribute(u.TRANSLATION, R), u.ROTATION && L.fromBufferAttribute(u.ROTATION, R), u.SCALE && M.fromBufferAttribute(u.SCALE, R), A.setMatrixAt(R, T.compose(b, L, M));
        for (const R in u)
          if (R === "_COLOR_0") {
            const k = u[R];
            A.instanceColor = new ec(k.array, k.itemSize, k.normalized);
          } else R !== "TRANSLATION" && R !== "ROTATION" && R !== "SCALE" && x.geometry.setAttribute(R, u[R]);
        gn.prototype.copy.call(A, x), this.parser.assignFinalMaterial(A), y.push(A);
      }
      return p.isGroup ? (p.clear(), p.add(...y), p) : y[0];
    }));
  }
}
const Bd = "glTF", os = 12, yf = { JSON: 1313821514, BIN: 5130562 };
class q1 {
  constructor(e) {
    this.name = me.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, os);
    if (this.header = {
      magic: Ur(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== Bd)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const n = this.header.length - os, i = new DataView(e, os);
    let o = 0;
    for (; o < n; ) {
      const l = i.getUint32(o, !0);
      o += 4;
      const c = i.getUint32(o, !0);
      if (o += 4, c === yf.JSON) {
        const u = new Uint8Array(e, os + o, l);
        this.content = Ur(u);
      } else if (c === yf.BIN) {
        const u = os + o;
        this.body = e.slice(u, u + l);
      }
      o += l;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class K1 {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = me.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const n = this.json, i = this.dracoLoader, o = e.extensions[this.name].bufferView, l = e.extensions[this.name].attributes, c = {}, u = {}, f = {};
    for (const p in l) {
      const d = hc[p] || p.toLowerCase();
      c[d] = l[p];
    }
    for (const p in e.attributes) {
      const d = hc[p] || p.toLowerCase();
      if (l[p] !== void 0) {
        const g = n.accessors[e.attributes[p]], y = Ir[g.componentType];
        f[d] = y.name, u[d] = g.normalized === !0;
      }
    }
    return t.getDependency("bufferView", o).then(function(p) {
      return new Promise(function(d, g) {
        i.decodeDracoFile(
          p,
          function(y) {
            for (const x in y.attributes) {
              const T = y.attributes[x], b = u[x];
              b !== void 0 && (T.normalized = b);
            }
            d(y);
          },
          c,
          f,
          jn,
          g
        );
      });
    });
  }
}
class Q1 {
  constructor() {
    this.name = me.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class J1 {
  constructor() {
    this.name = me.KHR_MESH_QUANTIZATION;
  }
}
class Ud extends rb {
  constructor(e, t, n, i) {
    super(e, t, n, i);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, i = this.valueSize, o = e * i * 3 + i;
    for (let l = 0; l !== i; l++)
      t[l] = n[o + l];
    return t;
  }
  interpolate_(e, t, n, i) {
    const o = this.resultBuffer, l = this.sampleValues, c = this.valueSize, u = c * 2, f = c * 3, p = i - t, d = (n - t) / p, g = d * d, y = g * d, x = e * f, T = x - f, b = -2 * y + 3 * g, L = y - g, M = 1 - b, A = L - g + d;
    for (let R = 0; R !== c; R++) {
      const k = l[T + R + c], G = l[T + R + u] * p, V = l[x + R + c], F = l[x + R] * p;
      o[R] = M * k + A * G + b * V + L * F;
    }
    return o;
  }
}
const ex = /* @__PURE__ */ new mn();
class tx extends Ud {
  interpolate_(e, t, n, i) {
    const o = super.interpolate_(e, t, n, i);
    return ex.fromArray(o).normalize().toArray(o), o;
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
}, Ir = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, vf = {
  9728: fd,
  9729: vi,
  9984: Jw,
  9985: Qw,
  9986: Kw,
  9987: Rs
}, wf = {
  33071: tc,
  33648: eb,
  10497: yn
}, Ol = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, hc = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  // uv => uv1, 4 uv channels
  // https://github.com/mrdoob/three.js/pull/25943
  // https://github.com/mrdoob/three.js/pull/25788
  ...aa >= 152 ? {
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
}, ai = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, nx = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: yd,
  STEP: ib
}, Rl = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function ix(s) {
  return s.DefaultMaterial === void 0 && (s.DefaultMaterial = new Ds({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: na
  })), s.DefaultMaterial;
}
function Vi(s, e, t) {
  for (const n in t.extensions)
    s[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
}
function Wn(s, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(s.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function rx(s, e, t) {
  let n = !1, i = !1, o = !1;
  for (let f = 0, p = e.length; f < p; f++) {
    const d = e[f];
    if (d.POSITION !== void 0 && (n = !0), d.NORMAL !== void 0 && (i = !0), d.COLOR_0 !== void 0 && (o = !0), n && i && o)
      break;
  }
  if (!n && !i && !o)
    return Promise.resolve(s);
  const l = [], c = [], u = [];
  for (let f = 0, p = e.length; f < p; f++) {
    const d = e[f];
    if (n) {
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
    return n && (s.morphAttributes.position = p), i && (s.morphAttributes.normal = d), o && (s.morphAttributes.color = g), s.morphTargetsRelative = !0, s;
  });
}
function sx(s, e) {
  if (s.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, n = e.weights.length; t < n; t++)
      s.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (s.morphTargetInfluences.length === t.length) {
      s.morphTargetDictionary = {};
      for (let n = 0, i = t.length; n < i; n++)
        s.morphTargetDictionary[t[n]] = n;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function ox(s) {
  let e;
  const t = s.extensions && s.extensions[me.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + Dl(t.attributes) : e = s.indices + ":" + Dl(s.attributes) + ":" + s.mode, s.targets !== void 0)
    for (let n = 0, i = s.targets.length; n < i; n++)
      e += ":" + Dl(s.targets[n]);
  return e;
}
function Dl(s) {
  let e = "";
  const t = Object.keys(s).sort();
  for (let n = 0, i = t.length; n < i; n++)
    e += t[n] + ":" + s[t[n]] + ";";
  return e;
}
function fc(s) {
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
function ax(s) {
  return s.search(/\.jpe?g($|\?)/i) > 0 || s.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : s.search(/\.webp($|\?)/i) > 0 || s.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
}
const lx = /* @__PURE__ */ new be();
class cx {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new O1(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let n = !1, i = !1, o = -1;
    typeof navigator < "u" && typeof navigator.userAgent < "u" && (n = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0, i = navigator.userAgent.indexOf("Firefox") > -1, o = i ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1), typeof createImageBitmap > "u" || n || i && o < 98 ? this.textureLoader = new ra(this.options.manager) : this.textureLoader = new Zw(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new wi(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this, i = this.json, o = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(l) {
      return l._markDefs && l._markDefs();
    }), Promise.all(
      this._invokeAll(function(l) {
        return l.beforeRoot && l.beforeRoot();
      })
    ).then(function() {
      return Promise.all([
        n.getDependencies("scene"),
        n.getDependencies("animation"),
        n.getDependencies("camera")
      ]);
    }).then(function(l) {
      const c = {
        scene: l[0][i.scene || 0],
        scenes: l[0],
        animations: l[1],
        cameras: l[2],
        asset: i.asset,
        parser: n,
        userData: {}
      };
      return Vi(o, c, i), Wn(c, i), Promise.all(
        n._invokeAll(function(u) {
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
    const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
    for (let i = 0, o = t.length; i < o; i++) {
      const l = t[i].joints;
      for (let c = 0, u = l.length; c < u; c++)
        e[l[c]].isBone = !0;
    }
    for (let i = 0, o = e.length; i < o; i++) {
      const l = e[i];
      l.mesh !== void 0 && (this._addNodeRef(this.meshCache, l.mesh), l.skin !== void 0 && (n[l.mesh].isSkinnedMesh = !0)), l.camera !== void 0 && this._addNodeRef(this.cameraCache, l.camera);
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
  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1)
      return n;
    const i = n.clone(), o = (l, c) => {
      const u = this.associations.get(l);
      u != null && this.associations.set(c, u);
      for (const [f, p] of l.children.entries())
        o(p, c.children[f]);
    };
    return o(n, i), i.name += "_instance_" + e.uses[t]++, i;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const i = e(t[n]);
      if (i)
        return i;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let i = 0; i < t.length; i++) {
      const o = e(t[i]);
      o && n.push(o);
    }
    return n;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const n = e + ":" + t;
    let i = this.cache.get(n);
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
      this.cache.add(n, i);
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
      const n = this, i = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(
        i.map(function(o, l) {
          return n.getDependency(e, l);
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
    const t = this.json.buffers[e], n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[me.KHR_BINARY_GLTF].body);
    const i = this.options;
    return new Promise(function(o, l) {
      n.load(Rr.resolveURL(t.uri, i.path), o, void 0, function() {
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
    return this.getDependency("buffer", t.buffer).then(function(n) {
      const i = t.byteLength || 0, o = t.byteOffset || 0;
      return n.slice(o, o + i);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, n = this.json, i = this.json.accessors[e];
    if (i.bufferView === void 0 && i.sparse === void 0) {
      const l = Ol[i.type], c = Ir[i.componentType], u = i.normalized === !0, f = new c(i.count * l);
      return Promise.resolve(new mt(f, l, u));
    }
    const o = [];
    return i.bufferView !== void 0 ? o.push(this.getDependency("bufferView", i.bufferView)) : o.push(null), i.sparse !== void 0 && (o.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), o.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(o).then(function(l) {
      const c = l[0], u = Ol[i.type], f = Ir[i.componentType], p = f.BYTES_PER_ELEMENT, d = p * u, g = i.byteOffset || 0, y = i.bufferView !== void 0 ? n.bufferViews[i.bufferView].byteStride : void 0, x = i.normalized === !0;
      let T, b;
      if (y && y !== d) {
        const L = Math.floor(g / y), M = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + L + ":" + i.count;
        let A = t.cache.get(M);
        A || (T = new f(c, L * y, i.count * y / p), A = new qw(T, y / p), t.cache.add(M, A)), b = new Zi(
          A,
          u,
          g % y / p,
          x
        );
      } else
        c === null ? T = new f(i.count * u) : T = new f(c, g, i.count * u), b = new mt(T, u, x);
      if (i.sparse !== void 0) {
        const L = Ol.SCALAR, M = Ir[i.sparse.indices.componentType], A = i.sparse.indices.byteOffset || 0, R = i.sparse.values.byteOffset || 0, k = new M(
          l[1],
          A,
          i.sparse.count * L
        ), G = new f(l[2], R, i.sparse.count * u);
        c !== null && (b = new mt(
          b.array.slice(),
          b.itemSize,
          b.normalized
        ));
        for (let V = 0, F = k.length; V < F; V++) {
          const $ = k[V];
          if (b.setX($, G[V * u]), u >= 2 && b.setY($, G[V * u + 1]), u >= 3 && b.setZ($, G[V * u + 2]), u >= 4 && b.setW($, G[V * u + 3]), u >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return b;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(e) {
    const t = this.json, n = this.options, o = t.textures[e].source, l = t.images[o];
    let c = this.textureLoader;
    if (l.uri) {
      const u = n.manager.getHandler(l.uri);
      u !== null && (c = u);
    }
    return this.loadTextureImage(e, o, c);
  }
  loadTextureImage(e, t, n) {
    const i = this, o = this.json, l = o.textures[e], c = o.images[t], u = (c.uri || c.bufferView) + ":" + l.sampler;
    if (this.textureCache[u])
      return this.textureCache[u];
    const f = this.loadImageSource(t, n).then(function(p) {
      p.flipY = !1, p.name = l.name || c.name || "", p.name === "" && typeof c.uri == "string" && c.uri.startsWith("data:image/") === !1 && (p.name = c.uri);
      const g = (o.samplers || {})[l.sampler] || {};
      return p.magFilter = vf[g.magFilter] || vi, p.minFilter = vf[g.minFilter] || Rs, p.wrapS = wf[g.wrapS] || yn, p.wrapT = wf[g.wrapT] || yn, i.associations.set(p, { textures: e }), p;
    }).catch(function() {
      return null;
    });
    return this.textureCache[u] = f, f;
  }
  loadImageSource(e, t) {
    const n = this, i = this.json, o = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((d) => d.clone());
    const l = i.images[e], c = self.URL || self.webkitURL;
    let u = l.uri || "", f = !1;
    if (l.bufferView !== void 0)
      u = n.getDependency("bufferView", l.bufferView).then(function(d) {
        f = !0;
        const g = new Blob([d], { type: l.mimeType });
        return u = c.createObjectURL(g), u;
      });
    else if (l.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const p = Promise.resolve(u).then(function(d) {
      return new Promise(function(g, y) {
        let x = g;
        t.isImageBitmapLoader === !0 && (x = function(T) {
          const b = new Br(T);
          b.needsUpdate = !0, g(b);
        }), t.load(Rr.resolveURL(d, o.path), x, void 0, y);
      });
    }).then(function(d) {
      return f === !0 && c.revokeObjectURL(u), Wn(d, l), d.userData.mimeType = l.mimeType || ax(l.uri), d;
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
  assignTexture(e, t, n, i) {
    const o = this;
    return this.getDependency("texture", n.index).then(function(l) {
      if (!l)
        return null;
      if (n.texCoord !== void 0 && n.texCoord > 0 && (l = l.clone(), l.channel = n.texCoord), o.extensions[me.KHR_TEXTURE_TRANSFORM]) {
        const c = n.extensions !== void 0 ? n.extensions[me.KHR_TEXTURE_TRANSFORM] : void 0;
        if (c) {
          const u = o.associations.get(l);
          l = o.extensions[me.KHR_TEXTURE_TRANSFORM].extendTexture(l, c), o.associations.set(l, u);
        }
      }
      return i !== void 0 && (typeof i == "number" && (i = i === _f ? Ki : jn), "colorSpace" in l ? l.colorSpace = i : l.encoding = i === Ki ? _f : E1), e[t] = l, l;
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
    let n = e.material;
    const i = t.attributes.tangent === void 0, o = t.attributes.color !== void 0, l = t.attributes.normal === void 0;
    if (e.isPoints) {
      const c = "PointsMaterial:" + n.uuid;
      let u = this.cache.get(c);
      u || (u = new sa(), Pl.prototype.copy.call(u, n), u.color.copy(n.color), u.map = n.map, u.sizeAttenuation = !1, this.cache.add(c, u)), n = u;
    } else if (e.isLine) {
      const c = "LineBasicMaterial:" + n.uuid;
      let u = this.cache.get(c);
      u || (u = new dd(), Pl.prototype.copy.call(u, n), u.color.copy(n.color), u.map = n.map, this.cache.add(c, u)), n = u;
    }
    if (i || o || l) {
      let c = "ClonedMaterial:" + n.uuid + ":";
      i && (c += "derivative-tangents:"), o && (c += "vertex-colors:"), l && (c += "flat-shading:");
      let u = this.cache.get(c);
      u || (u = n.clone(), o && (u.vertexColors = !0), l && (u.flatShading = !0), i && (u.normalScale && (u.normalScale.y *= -1), u.clearcoatNormalScale && (u.clearcoatNormalScale.y *= -1)), this.cache.add(c, u), this.associations.set(u, this.associations.get(n))), n = u;
    }
    e.material = n;
  }
  getMaterialType() {
    return Ds;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, n = this.json, i = this.extensions, o = n.materials[e];
    let l;
    const c = {}, u = o.extensions || {}, f = [];
    if (u[me.KHR_MATERIALS_UNLIT]) {
      const d = i[me.KHR_MATERIALS_UNLIT];
      l = d.getMaterialType(), f.push(d.extendParams(c, o, t));
    } else {
      const d = o.pbrMetallicRoughness || {};
      if (c.color = new oe(1, 1, 1), c.opacity = 1, Array.isArray(d.baseColorFactor)) {
        const g = d.baseColorFactor;
        c.color.setRGB(g[0], g[1], g[2], jn), c.opacity = g[3];
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
    o.doubleSided === !0 && (c.side = kr);
    const p = o.alphaMode || Rl.OPAQUE;
    if (p === Rl.BLEND ? (c.transparent = !0, c.depthWrite = !1) : (c.transparent = !1, p === Rl.MASK && (c.alphaTest = o.alphaCutoff !== void 0 ? o.alphaCutoff : 0.5)), o.normalTexture !== void 0 && l !== qt && (f.push(t.assignTexture(c, "normalMap", o.normalTexture)), c.normalScale = new ce(1, 1), o.normalTexture.scale !== void 0)) {
      const d = o.normalTexture.scale;
      c.normalScale.set(d, d);
    }
    if (o.occlusionTexture !== void 0 && l !== qt && (f.push(t.assignTexture(c, "aoMap", o.occlusionTexture)), o.occlusionTexture.strength !== void 0 && (c.aoMapIntensity = o.occlusionTexture.strength)), o.emissiveFactor !== void 0 && l !== qt) {
      const d = o.emissiveFactor;
      c.emissive = new oe().setRGB(
        d[0],
        d[1],
        d[2],
        jn
      );
    }
    return o.emissiveTexture !== void 0 && l !== qt && f.push(t.assignTexture(c, "emissiveMap", o.emissiveTexture, Ki)), Promise.all(f).then(function() {
      const d = new l(c);
      return o.name && (d.name = o.name), Wn(d, o), t.associations.set(d, { materials: e }), o.extensions && Vi(i, d, o), d;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(e) {
    const t = Cs.sanitizeNodeName(e || "");
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
    const t = this, n = this.extensions, i = this.primitiveCache;
    function o(c) {
      return n[me.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(c, t).then(function(u) {
        return bf(u, c, t);
      });
    }
    const l = [];
    for (let c = 0, u = e.length; c < u; c++) {
      const f = e[c], p = ox(f), d = i[p];
      if (d)
        l.push(d.promise);
      else {
        let g;
        f.extensions && f.extensions[me.KHR_DRACO_MESH_COMPRESSION] ? g = o(f) : g = bf(new Kt(), f, t), i[p] = { primitive: f, promise: g }, l.push(g);
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
    const t = this, n = this.json, i = this.extensions, o = n.meshes[e], l = o.primitives, c = [];
    for (let u = 0, f = l.length; u < f; u++) {
      const p = l[u].material === void 0 ? ix(this.cache) : this.getDependency("material", l[u].material);
      c.push(p);
    }
    return c.push(t.loadGeometries(l)), Promise.all(c).then(function(u) {
      const f = u.slice(0, u.length - 1), p = u[u.length - 1], d = [];
      for (let y = 0, x = p.length; y < x; y++) {
        const T = p[y], b = l[y];
        let L;
        const M = f[y];
        if (b.mode === Yt.TRIANGLES || b.mode === Yt.TRIANGLE_STRIP || b.mode === Yt.TRIANGLE_FAN || b.mode === void 0)
          L = o.isSkinnedMesh === !0 ? new pd(T, M) : new Be(T, M), L.isSkinnedMesh === !0 && L.normalizeSkinWeights(), b.mode === Yt.TRIANGLE_STRIP ? L.geometry = hf(L.geometry, ld) : b.mode === Yt.TRIANGLE_FAN && (L.geometry = hf(L.geometry, Ql));
        else if (b.mode === Yt.LINES)
          L = new tb(T, M);
        else if (b.mode === Yt.LINE_STRIP)
          L = new md(T, M);
        else if (b.mode === Yt.LINE_LOOP)
          L = new nb(T, M);
        else if (b.mode === Yt.POINTS)
          L = new zr(T, M);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + b.mode);
        Object.keys(L.geometry.morphAttributes).length > 0 && sx(L, o), L.name = t.createUniqueName(o.name || "mesh_" + e), Wn(L, o), b.extensions && Vi(i, L, b), t.assignFinalMaterial(L), d.push(L);
      }
      for (let y = 0, x = d.length; y < x; y++)
        t.associations.set(d[y], {
          meshes: e,
          primitives: y
        });
      if (d.length === 1)
        return o.extensions && Vi(i, d[0], o), d[0];
      const g = new Qt();
      o.extensions && Vi(i, g, o), t.associations.set(g, { meshes: e });
      for (let y = 0, x = d.length; y < x; y++)
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
    const n = this.json.cameras[e], i = n[n.type];
    if (!i) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return n.type === "perspective" ? t = new Qi(
      lt.radToDeg(i.yfov),
      i.aspectRatio || 1,
      i.znear || 1,
      i.zfar || 2e6
    ) : n.type === "orthographic" && (t = new Or(-i.xmag, i.xmag, i.ymag, -i.ymag, i.znear, i.zfar)), n.name && (t.name = this.createUniqueName(n.name)), Wn(t, n), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], n = [];
    for (let i = 0, o = t.joints.length; i < o; i++)
      n.push(this._loadNodeShallow(t.joints[i]));
    return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(i) {
      const o = i.pop(), l = i, c = [], u = [];
      for (let f = 0, p = l.length; f < p; f++) {
        const d = l[f];
        if (d) {
          c.push(d);
          const g = new be();
          o !== null && g.fromArray(o.array, f * 16), u.push(g);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[f]);
      }
      return new gd(c, u);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, n = this, i = t.animations[e], o = i.name ? i.name : "animation_" + e, l = [], c = [], u = [], f = [], p = [];
    for (let d = 0, g = i.channels.length; d < g; d++) {
      const y = i.channels[d], x = i.samplers[y.sampler], T = y.target, b = T.node, L = i.parameters !== void 0 ? i.parameters[x.input] : x.input, M = i.parameters !== void 0 ? i.parameters[x.output] : x.output;
      T.node !== void 0 && (l.push(this.getDependency("node", b)), c.push(this.getDependency("accessor", L)), u.push(this.getDependency("accessor", M)), f.push(x), p.push(T));
    }
    return Promise.all([
      Promise.all(l),
      Promise.all(c),
      Promise.all(u),
      Promise.all(f),
      Promise.all(p)
    ]).then(function(d) {
      const g = d[0], y = d[1], x = d[2], T = d[3], b = d[4], L = [];
      for (let M = 0, A = g.length; M < A; M++) {
        const R = g[M], k = y[M], G = x[M], V = T[M], F = b[M];
        if (R === void 0)
          continue;
        R.updateMatrix && R.updateMatrix();
        const $ = n._createAnimationTracks(R, k, G, V, F);
        if ($)
          for (let z = 0; z < $.length; z++)
            L.push($[z]);
      }
      return new _d(o, void 0, L);
    });
  }
  createNodeMesh(e) {
    const t = this.json, n = this, i = t.nodes[e];
    return i.mesh === void 0 ? null : n.getDependency("mesh", i.mesh).then(function(o) {
      const l = n._getNodeRef(n.meshCache, i.mesh, o);
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
    const t = this.json, n = this, i = t.nodes[e], o = n._loadNodeShallow(e), l = [], c = i.children || [];
    for (let f = 0, p = c.length; f < p; f++)
      l.push(n.getDependency("node", c[f]));
    const u = i.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", i.skin);
    return Promise.all([o, Promise.all(l), u]).then(function(f) {
      const p = f[0], d = f[1], g = f[2];
      g !== null && p.traverse(function(y) {
        y.isSkinnedMesh && y.bind(g, lx);
      });
      for (let y = 0, x = d.length; y < x; y++)
        p.add(d[y]);
      return p;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, n = this.extensions, i = this;
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
      if (o.isBone === !0 ? p = new nc() : f.length > 1 ? p = new Qt() : f.length === 1 ? p = f[0] : p = new gn(), p !== f[0])
        for (let d = 0, g = f.length; d < g; d++)
          p.add(f[d]);
      if (o.name && (p.userData.name = o.name, p.name = l), Wn(p, o), o.extensions && Vi(n, p, o), o.matrix !== void 0) {
        const d = new be();
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
    const t = this.extensions, n = this.json.scenes[e], i = this, o = new Qt();
    n.name && (o.name = i.createUniqueName(n.name)), Wn(o, n), n.extensions && Vi(t, o, n);
    const l = n.nodes || [], c = [];
    for (let u = 0, f = l.length; u < f; u++)
      c.push(i.getDependency("node", l[u]));
    return Promise.all(c).then(function(u) {
      for (let p = 0, d = u.length; p < d; p++)
        o.add(u[p]);
      const f = (p) => {
        const d = /* @__PURE__ */ new Map();
        for (const [g, y] of i.associations)
          (g instanceof Pl || g instanceof Br) && d.set(g, y);
        return p.traverse((g) => {
          const y = i.associations.get(g);
          y != null && d.set(g, y);
        }), d;
      };
      return i.associations = f(o), o;
    });
  }
  _createAnimationTracks(e, t, n, i, o) {
    const l = [], c = e.name ? e.name : e.uuid, u = [];
    ai[o.path] === ai.weights ? e.traverse(function(g) {
      g.morphTargetInfluences && u.push(g.name ? g.name : g.uuid);
    }) : u.push(c);
    let f;
    switch (ai[o.path]) {
      case ai.weights:
        f = rc;
        break;
      case ai.rotation:
        f = sc;
        break;
      case ai.position:
      case ai.scale:
        f = ic;
        break;
      default:
        n.itemSize === 1 ? f = rc : f = ic;
        break;
    }
    const p = i.interpolation !== void 0 ? nx[i.interpolation] : yd, d = this._getArrayFromAccessor(n);
    for (let g = 0, y = u.length; g < y; g++) {
      const x = new f(
        u[g] + "." + ai[o.path],
        t.array,
        d,
        p
      );
      i.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(x), l.push(x);
    }
    return l;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = fc(t.constructor), i = new Float32Array(t.length);
      for (let o = 0, l = t.length; o < l; o++)
        i[o] = t[o] * n;
      t = i;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(n) {
      const i = this instanceof sc ? tx : Ud;
      return new i(this.times, this.values, this.getValueSize() / 3, n);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function ux(s, e, t) {
  const n = e.attributes, i = new tr();
  if (n.POSITION !== void 0) {
    const c = t.json.accessors[n.POSITION], u = c.min, f = c.max;
    if (u !== void 0 && f !== void 0) {
      if (i.set(new D(u[0], u[1], u[2]), new D(f[0], f[1], f[2])), c.normalized) {
        const p = fc(Ir[c.componentType]);
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
    const c = new D(), u = new D();
    for (let f = 0, p = o.length; f < p; f++) {
      const d = o[f];
      if (d.POSITION !== void 0) {
        const g = t.json.accessors[d.POSITION], y = g.min, x = g.max;
        if (y !== void 0 && x !== void 0) {
          if (u.setX(Math.max(Math.abs(y[0]), Math.abs(x[0]))), u.setY(Math.max(Math.abs(y[1]), Math.abs(x[1]))), u.setZ(Math.max(Math.abs(y[2]), Math.abs(x[2]))), g.normalized) {
            const T = fc(Ir[g.componentType]);
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
  const l = new wc();
  i.getCenter(l.center), l.radius = i.min.distanceTo(i.max) / 2, s.boundingSphere = l;
}
function bf(s, e, t) {
  const n = e.attributes, i = [];
  function o(l, c) {
    return t.getDependency("accessor", l).then(function(u) {
      s.setAttribute(c, u);
    });
  }
  for (const l in n) {
    const c = hc[l] || l.toLowerCase();
    c in s.attributes || i.push(o(n[l], c));
  }
  if (e.indices !== void 0 && !s.index) {
    const l = t.getDependency("accessor", e.indices).then(function(c) {
      s.setIndex(c);
    });
    i.push(l);
  }
  return Wn(s, e), ux(s, e, t), Promise.all(i).then(function() {
    return e.targets !== void 0 ? rx(s, e.targets, t) : s;
  });
}
function kd(s, e, t) {
  const n = t.length - s - 1;
  if (e >= t[n])
    return n - 1;
  if (e <= t[s])
    return s;
  let i = s, o = n, l = Math.floor((i + o) / 2);
  for (; e < t[l] || e >= t[l + 1]; )
    e < t[l] ? o = l : i = l, l = Math.floor((i + o) / 2);
  return l;
}
function hx(s, e, t, n) {
  const i = [], o = [], l = [];
  i[0] = 1;
  for (let c = 1; c <= t; ++c) {
    o[c] = e - n[s + 1 - c], l[c] = n[s + c] - e;
    let u = 0;
    for (let f = 0; f < c; ++f) {
      const p = l[f + 1], d = o[c - f], g = i[f] / (p + d);
      i[f] = u + p * g, u = d * g;
    }
    i[c] = u;
  }
  return i;
}
function fx(s, e, t, n) {
  const i = kd(s, n, e), o = hx(i, n, s, e), l = new _n(0, 0, 0, 0);
  for (let c = 0; c <= s; ++c) {
    const u = t[i - s + c], f = o[c], p = u.w * f;
    l.x += u.x * p, l.y += u.y * p, l.z += u.z * p, l.w += u.w * f;
  }
  return l;
}
function dx(s, e, t, n, i) {
  const o = [];
  for (let d = 0; d <= t; ++d)
    o[d] = 0;
  const l = [];
  for (let d = 0; d <= n; ++d)
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
      const x = f[y + 1], T = u[d - y];
      c[d][y] = x + T;
      const b = c[y][d - 1] / c[d][y];
      c[y][d] = g + x * b, g = T * b;
    }
    c[d][d] = g;
  }
  for (let d = 0; d <= t; ++d)
    l[0][d] = c[d][t];
  for (let d = 0; d <= t; ++d) {
    let g = 0, y = 1;
    const x = [];
    for (let T = 0; T <= t; ++T)
      x[T] = o.slice(0);
    x[0][0] = 1;
    for (let T = 1; T <= n; ++T) {
      let b = 0;
      const L = d - T, M = t - T;
      d >= T && (x[y][0] = x[g][0] / c[M + 1][L], b = x[y][0] * c[L][M]);
      const A = L >= -1 ? 1 : -L, R = d - 1 <= M ? T - 1 : t - d;
      for (let G = A; G <= R; ++G)
        x[y][G] = (x[g][G] - x[g][G - 1]) / c[M + 1][L + G], b += x[y][G] * c[L + G][M];
      d <= M && (x[y][T] = -x[g][T - 1] / c[M + 1][d], b += x[y][T] * c[d][M]), l[T][d] = b;
      const k = g;
      g = y, y = k;
    }
  }
  let p = t;
  for (let d = 1; d <= n; ++d) {
    for (let g = 0; g <= t; ++g)
      l[d][g] *= p;
    p *= t - d;
  }
  return l;
}
function px(s, e, t, n, i) {
  const o = i < s ? i : s, l = [], c = kd(s, n, e), u = dx(c, n, s, o, e), f = [];
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
    l[p] = new _n(0, 0, 0);
  return l;
}
function mx(s, e) {
  let t = 1;
  for (let i = 2; i <= s; ++i)
    t *= i;
  let n = 1;
  for (let i = 2; i <= e; ++i)
    n *= i;
  for (let i = 2; i <= s - e; ++i)
    n *= i;
  return t / n;
}
function gx(s) {
  const e = s.length, t = [], n = [];
  for (let o = 0; o < e; ++o) {
    const l = s[o];
    t[o] = new D(l.x, l.y, l.z), n[o] = l.w;
  }
  const i = [];
  for (let o = 0; o < e; ++o) {
    const l = t[o].clone();
    for (let c = 1; c <= o; ++c)
      l.sub(i[o - c].clone().multiplyScalar(mx(o, c) * n[c]));
    i[o] = l.divideScalar(n[0]);
  }
  return i;
}
function _x(s, e, t, n, i) {
  const o = px(s, e, t, n, i);
  return gx(o);
}
class xf extends sb {
  constructor(e, t, n, i, o) {
    super(), this.degree = e, this.knots = t, this.controlPoints = [], this.startKnot = i || 0, this.endKnot = o || this.knots.length - 1;
    for (let l = 0; l < n.length; ++l) {
      const c = n[l];
      this.controlPoints[l] = new _n(c.x, c.y, c.z, c.w);
    }
  }
  getPoint(e, t) {
    const n = t || new D(), i = this.knots[this.startKnot] + e * (this.knots[this.endKnot] - this.knots[this.startKnot]), o = fx(this.degree, this.knots, this.controlPoints, i);
    return o.w != 1 && o.divideScalar(o.w), n.set(o.x, o.y, o.z);
  }
  getTangent(e, t) {
    const n = t || new D(), i = this.knots[0] + e * (this.knots[this.knots.length - 1] - this.knots[0]), o = _x(this.degree, this.knots, this.controlPoints, i, 1);
    return n.copy(o[1]).normalize(), n;
  }
}
let pe, Ve, Mt;
class yx extends yc {
  constructor(e) {
    super(e);
  }
  load(e, t, n, i) {
    const o = this, l = o.path === "" ? Rr.extractUrlBase(e) : o.path, c = new wi(this.manager);
    c.setPath(o.path), c.setResponseType("arraybuffer"), c.setRequestHeader(o.requestHeader), c.setWithCredentials(o.withCredentials), c.load(
      e,
      function(u) {
        try {
          t(o.parse(u, l));
        } catch (f) {
          i ? i(f) : console.error(f), o.manager.itemError(e);
        }
      },
      n,
      i
    );
  }
  parse(e, t) {
    if (Sx(e))
      pe = new Tx().parse(e);
    else {
      const i = Vd(e);
      if (!Mx(i))
        throw new Error("THREE.FBXLoader: Unknown format.");
      if (Sf(i) < 7e3)
        throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + Sf(i));
      pe = new xx().parse(i);
    }
    const n = new ra(this.manager).setPath(this.resourcePath || t).setCrossOrigin(this.crossOrigin);
    return new vx(n, this.manager).parse(pe);
  }
}
class vx {
  constructor(e, t) {
    this.textureLoader = e, this.manager = t;
  }
  parse() {
    Ve = this.parseConnections();
    const e = this.parseImages(), t = this.parseTextures(e), n = this.parseMaterials(t), i = this.parseDeformers(), o = new wx().parse(i);
    return this.parseScene(i, o, n), Mt;
  }
  // Parses FBXTree.Connections which holds parent-child connections between objects (e.g. material -> texture, model->geometry )
  // and details the connection type
  parseConnections() {
    const e = /* @__PURE__ */ new Map();
    return "Connections" in pe && pe.Connections.connections.forEach(function(n) {
      const i = n[0], o = n[1], l = n[2];
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
      const n = pe.Objects.Video;
      for (const i in n) {
        const o = n[i], l = parseInt(i);
        if (e[l] = o.RelativeFilename || o.Filename, "Content" in o) {
          const c = o.Content instanceof ArrayBuffer && o.Content.byteLength > 0, u = typeof o.Content == "string" && o.Content !== "";
          if (c || u) {
            const f = this.parseImage(n[i]);
            t[o.RelativeFilename || o.Filename] = f;
          }
        }
      }
    }
    for (const n in e) {
      const i = e[n];
      t[i] !== void 0 ? e[n] = t[i] : e[n] = e[n].split("\\").pop();
    }
    return e;
  }
  // Parse embedded image data in FBXTree.Video.Content
  parseImage(e) {
    const t = e.Content, n = e.RelativeFilename || e.Filename, i = n.slice(n.lastIndexOf(".") + 1).toLowerCase();
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
        this.manager.getHandler(".tga") === null && console.warn("FBXLoader: TGA loader not found, skipping ", n), o = "image/tga";
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
      const n = pe.Objects.Texture;
      for (const i in n) {
        const o = this.parseTexture(n[i], e);
        t.set(parseInt(i), o);
      }
    }
    return t;
  }
  // Parse individual node in FBXTree.Objects.Texture
  parseTexture(e, t) {
    const n = this.loadTexture(e, t);
    n.ID = e.id, n.name = e.attrName;
    const i = e.WrapModeU, o = e.WrapModeV, l = i !== void 0 ? i.value : 0, c = o !== void 0 ? o.value : 0;
    if (n.wrapS = l === 0 ? yn : tc, n.wrapT = c === 0 ? yn : tc, "Scaling" in e) {
      const u = e.Scaling.value;
      n.repeat.x = u[0], n.repeat.y = u[1];
    }
    return n;
  }
  // load a texture specified as a blob or data URI, or via an external URL using TextureLoader
  loadTexture(e, t) {
    let n;
    const i = this.textureLoader.path, o = Ve.get(e.id).children;
    o !== void 0 && o.length > 0 && t[o[0].ID] !== void 0 && (n = t[o[0].ID], (n.indexOf("blob:") === 0 || n.indexOf("data:") === 0) && this.textureLoader.setPath(void 0));
    let l;
    const c = e.FileName.slice(-3).toLowerCase();
    if (c === "tga") {
      const u = this.manager.getHandler(".tga");
      u === null ? (console.warn("FBXLoader: TGA loader not found, creating placeholder texture for", e.RelativeFilename), l = new Br()) : (u.setPath(this.textureLoader.path), l = u.load(n));
    } else c === "psd" ? (console.warn(
      "FBXLoader: PSD textures are not supported, creating placeholder texture for",
      e.RelativeFilename
    ), l = new Br()) : l = this.textureLoader.load(n);
    return this.textureLoader.setPath(i), l;
  }
  // Parse nodes in FBXTree.Objects.Material
  parseMaterials(e) {
    const t = /* @__PURE__ */ new Map();
    if ("Material" in pe.Objects) {
      const n = pe.Objects.Material;
      for (const i in n) {
        const o = this.parseMaterial(n[i], e);
        o !== null && t.set(parseInt(i), o);
      }
    }
    return t;
  }
  // Parse single node in FBXTree.Objects.Material
  // Materials are connected to texture maps in FBXTree.Objects.Textures
  // FBX format currently only supports Lambert and Phong shading models
  parseMaterial(e, t) {
    const n = e.id, i = e.attrName;
    let o = e.ShadingModel;
    if (typeof o == "object" && (o = o.value), !Ve.has(n))
      return null;
    const l = this.parseParameters(e, t, n);
    let c;
    switch (o.toLowerCase()) {
      case "phong":
        c = new As();
        break;
      case "lambert":
        c = new vd();
        break;
      default:
        console.warn('THREE.FBXLoader: unknown material type "%s". Defaulting to MeshPhongMaterial.', o), c = new As();
        break;
    }
    return c.setValues(l), c.name = i, c;
  }
  // Parse FBX material and return parameters suitable for a three.js material
  // Also parse the texture map and return any textures associated with the material
  parseParameters(e, t, n) {
    const i = {};
    e.BumpFactor && (i.bumpScale = e.BumpFactor.value), e.Diffuse ? i.color = new oe().fromArray(e.Diffuse.value) : e.DiffuseColor && (e.DiffuseColor.type === "Color" || e.DiffuseColor.type === "ColorRGB") && (i.color = new oe().fromArray(e.DiffuseColor.value)), e.DisplacementFactor && (i.displacementScale = e.DisplacementFactor.value), e.Emissive ? i.emissive = new oe().fromArray(e.Emissive.value) : e.EmissiveColor && (e.EmissiveColor.type === "Color" || e.EmissiveColor.type === "ColorRGB") && (i.emissive = new oe().fromArray(e.EmissiveColor.value)), e.EmissiveFactor && (i.emissiveIntensity = parseFloat(e.EmissiveFactor.value)), e.Opacity && (i.opacity = parseFloat(e.Opacity.value)), i.opacity < 1 && (i.transparent = !0), e.ReflectionFactor && (i.reflectivity = e.ReflectionFactor.value), e.Shininess && (i.shininess = e.Shininess.value), e.Specular ? i.specular = new oe().fromArray(e.Specular.value) : e.SpecularColor && e.SpecularColor.type === "Color" && (i.specular = new oe().fromArray(e.SpecularColor.value));
    const o = this;
    return Ve.get(n).children.forEach(function(l) {
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
          i.envMap = o.getTexture(t, l.ID), i.envMap !== void 0 && (i.envMap.mapping = ob, "colorSpace" in i.envMap ? i.envMap.colorSpace = "srgb" : i.envMap.encoding = 3001);
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
      const n = pe.Objects.Deformer;
      for (const i in n) {
        const o = n[i], l = Ve.get(parseInt(i));
        if (o.attrType === "Skin") {
          const c = this.parseSkeleton(l, n);
          c.ID = i, l.parents.length > 1 && console.warn("THREE.FBXLoader: skeleton attached to more than one geometry is not supported."), c.geometryID = l.parents[0].ID, e[i] = c;
        } else if (o.attrType === "BlendShape") {
          const c = {
            id: i
          };
          c.rawTargets = this.parseMorphTargets(l, n), c.id = i, l.parents.length > 1 && console.warn("THREE.FBXLoader: morph target attached to more than one geometry is not supported."), t[i] = c;
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
    const n = [];
    return e.children.forEach(function(i) {
      const o = t[i.ID];
      if (o.attrType !== "Cluster")
        return;
      const l = {
        ID: i.ID,
        indices: [],
        weights: [],
        transformLink: new be().fromArray(o.TransformLink.a)
        // transform: new Matrix4().fromArray( boneNode.Transform.a ),
        // linkMode: boneNode.Mode,
      };
      "Indexes" in o && (l.indices = o.Indexes.a, l.weights = o.Weights.a), n.push(l);
    }), {
      rawBones: n,
      bones: []
    };
  }
  // The top level morph deformer node has type "BlendShape" and sub nodes have type "BlendShapeChannel"
  parseMorphTargets(e, t) {
    const n = [];
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
      })[0].ID, n.push(c);
    }
    return n;
  }
  // create the main Group() to be returned by the loader
  parseScene(e, t, n) {
    Mt = new Qt();
    const i = this.parseModels(e.skeletons, t, n), o = pe.Objects.Model, l = this;
    i.forEach(function(u) {
      const f = o[u.ID];
      l.setLookAtProperties(u, f), Ve.get(u.ID).parents.forEach(function(d) {
        const g = i.get(d.ID);
        g !== void 0 && g.add(u);
      }), u.parent === null && Mt.add(u);
    }), this.bindSkeleton(e.skeletons, t, i), this.createAmbientLight(), Mt.traverse(function(u) {
      if (u.userData.transformData) {
        u.parent && (u.userData.transformData.parentMatrix = u.parent.matrix, u.userData.transformData.parentMatrixWorld = u.parent.matrixWorld);
        const f = Nd(u.userData.transformData);
        u.applyMatrix4(f), u.updateWorldMatrix();
      }
    });
    const c = new bx().parse();
    Mt.children.length === 1 && Mt.children[0].isGroup && (Mt.children[0].animations = c, Mt = Mt.children[0]), Mt.animations = c;
  }
  // parse nodes in FBXTree.Objects.Model
  parseModels(e, t, n) {
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
            p = this.createMesh(f, t, n);
            break;
          case "NurbsCurve":
            p = this.createCurve(f, t);
            break;
          case "LimbNode":
          case "Root":
            p = new nc();
            break;
          default:
            p = new Qt();
            break;
        }
        p.name = u.attrName ? Cs.sanitizeNodeName(u.attrName) : "", p.ID = c;
      }
      this.getTransformData(p, u), i.set(c, p);
    }
    return i;
  }
  buildSkeleton(e, t, n, i) {
    let o = null;
    return e.parents.forEach(function(l) {
      for (const c in t) {
        const u = t[c];
        u.rawBones.forEach(function(f, p) {
          if (f.ID === l.ID) {
            const d = o;
            o = new nc(), o.matrixWorld.copy(f.transformLink), o.name = i ? Cs.sanitizeNodeName(i) : "", o.ID = n, u.bones[p] = o, d !== null && o.add(d);
          }
        });
      }
    }), o;
  }
  // create a PerspectiveCamera or OrthographicCamera
  createCamera(e) {
    let t, n;
    if (e.children.forEach(function(i) {
      const o = pe.Objects.NodeAttribute[i.ID];
      o !== void 0 && (n = o);
    }), n === void 0)
      t = new gn();
    else {
      let i = 0;
      n.CameraProjectionType !== void 0 && n.CameraProjectionType.value === 1 && (i = 1);
      let o = 1;
      n.NearPlane !== void 0 && (o = n.NearPlane.value / 1e3);
      let l = 1e3;
      n.FarPlane !== void 0 && (l = n.FarPlane.value / 1e3);
      let c = window.innerWidth, u = window.innerHeight;
      n.AspectWidth !== void 0 && n.AspectHeight !== void 0 && (c = n.AspectWidth.value, u = n.AspectHeight.value);
      const f = c / u;
      let p = 45;
      n.FieldOfView !== void 0 && (p = n.FieldOfView.value);
      const d = n.FocalLength ? n.FocalLength.value : null;
      switch (i) {
        case 0:
          t = new Qi(p, f, o, l), d !== null && t.setFocalLength(d);
          break;
        case 1:
          t = new Or(
            -c / 2,
            c / 2,
            u / 2,
            -u / 2,
            o,
            l
          );
          break;
        default:
          console.warn("THREE.FBXLoader: Unknown camera type " + i + "."), t = new gn();
          break;
      }
    }
    return t;
  }
  // Create a DirectionalLight, PointLight or SpotLight
  createLight(e) {
    let t, n;
    if (e.children.forEach(function(i) {
      const o = pe.Objects.NodeAttribute[i.ID];
      o !== void 0 && (n = o);
    }), n === void 0)
      t = new gn();
    else {
      let i;
      n.LightType === void 0 ? i = 0 : i = n.LightType.value;
      let o = 16777215;
      n.Color !== void 0 && (o = new oe().fromArray(n.Color.value));
      let l = n.Intensity === void 0 ? 1 : n.Intensity.value / 100;
      n.CastLightOnObject !== void 0 && n.CastLightOnObject.value === 0 && (l = 0);
      let c = 0;
      n.FarAttenuationEnd !== void 0 && (n.EnableFarAttenuation !== void 0 && n.EnableFarAttenuation.value === 0 ? c = 0 : c = n.FarAttenuationEnd.value);
      const u = 1;
      switch (i) {
        case 0:
          t = new Jl(o, l, c, u);
          break;
        case 1:
          t = new ta(o, l);
          break;
        case 2:
          let f = Math.PI / 3;
          n.InnerAngle !== void 0 && (f = lt.degToRad(n.InnerAngle.value));
          let p = 0;
          n.OuterAngle !== void 0 && (p = lt.degToRad(n.OuterAngle.value), p = Math.max(p, 1)), t = new hd(o, l, c, f, p, u);
          break;
        default:
          console.warn(
            "THREE.FBXLoader: Unknown light type " + n.LightType.value + ", defaulting to a PointLight."
          ), t = new Jl(o, l);
          break;
      }
      n.CastShadows !== void 0 && n.CastShadows.value === 1 && (t.castShadow = !0);
    }
    return t;
  }
  createMesh(e, t, n) {
    let i, o = null, l = null;
    const c = [];
    return e.children.forEach(function(u) {
      t.has(u.ID) && (o = t.get(u.ID)), n.has(u.ID) && c.push(n.get(u.ID));
    }), c.length > 1 ? l = c : c.length > 0 ? l = c[0] : (l = new As({ color: 13421772 }), c.push(l)), "color" in o.attributes && c.forEach(function(u) {
      u.vertexColors = !0;
    }), o.FBX_Deformer ? (i = new pd(o, l), i.normalizeSkinWeights()) : i = new Be(o, l), i;
  }
  createCurve(e, t) {
    const n = e.children.reduce(function(o, l) {
      return t.has(l.ID) && (o = t.get(l.ID)), o;
    }, null), i = new dd({ color: 3342591, linewidth: 1 });
    return new md(n, i);
  }
  // parse the model node for transform data
  getTransformData(e, t) {
    const n = {};
    "InheritType" in t && (n.inheritType = parseInt(t.InheritType.value)), "RotationOrder" in t ? n.eulerOrder = Hd(t.RotationOrder.value) : n.eulerOrder = "ZYX", "Lcl_Translation" in t && (n.translation = t.Lcl_Translation.value), "PreRotation" in t && (n.preRotation = t.PreRotation.value), "Lcl_Rotation" in t && (n.rotation = t.Lcl_Rotation.value), "PostRotation" in t && (n.postRotation = t.PostRotation.value), "Lcl_Scaling" in t && (n.scale = t.Lcl_Scaling.value), "ScalingOffset" in t && (n.scalingOffset = t.ScalingOffset.value), "ScalingPivot" in t && (n.scalingPivot = t.ScalingPivot.value), "RotationOffset" in t && (n.rotationOffset = t.RotationOffset.value), "RotationPivot" in t && (n.rotationPivot = t.RotationPivot.value), e.userData.transformData = n;
  }
  setLookAtProperties(e, t) {
    "LookAtProperty" in t && Ve.get(e.ID).children.forEach(function(i) {
      if (i.relationship === "LookAtProperty") {
        const o = pe.Objects.Model[i.ID];
        if ("Lcl_Translation" in o) {
          const l = o.Lcl_Translation.value;
          e.target !== void 0 ? (e.target.position.fromArray(l), Mt.add(e.target)) : e.lookAt(new D().fromArray(l));
        }
      }
    });
  }
  bindSkeleton(e, t, n) {
    const i = this.parsePoseNodes();
    for (const o in e) {
      const l = e[o];
      Ve.get(parseInt(l.ID)).parents.forEach(function(u) {
        if (t.has(u.ID)) {
          const f = u.ID;
          Ve.get(f).parents.forEach(function(d) {
            n.has(d.ID) && n.get(d.ID).bind(new gd(l.bones), i[d.ID]);
          });
        }
      });
    }
  }
  parsePoseNodes() {
    const e = {};
    if ("Pose" in pe.Objects) {
      const t = pe.Objects.Pose;
      for (const n in t)
        if (t[n].attrType === "BindPose" && t[n].NbPoseNodes > 0) {
          const i = t[n].PoseNode;
          Array.isArray(i) ? i.forEach(function(o) {
            e[o.Node] = new be().fromArray(o.Matrix.a);
          }) : e[i.Node] = new be().fromArray(i.Matrix.a);
        }
    }
    return e;
  }
  // Parse ambient color in FBXTree.GlobalSettings - if it's not set to black (default), create an ambient light
  createAmbientLight() {
    if ("GlobalSettings" in pe && "AmbientColor" in pe.GlobalSettings) {
      const e = pe.GlobalSettings.AmbientColor.value, t = e[0], n = e[1], i = e[2];
      if (t !== 0 || n !== 0 || i !== 0) {
        const o = new oe(t, n, i);
        Mt.add(new wd(o, 1));
      }
    }
  }
}
class wx {
  // Parse nodes in FBXTree.Objects.Geometry
  parse(e) {
    const t = /* @__PURE__ */ new Map();
    if ("Geometry" in pe.Objects) {
      const n = pe.Objects.Geometry;
      for (const i in n) {
        const o = Ve.get(parseInt(i)), l = this.parseGeometry(o, n[i], e);
        t.set(parseInt(i), l);
      }
    }
    return t;
  }
  // Parse single node in FBXTree.Objects.Geometry
  parseGeometry(e, t, n) {
    switch (t.attrType) {
      case "Mesh":
        return this.parseMeshGeometry(e, t, n);
      case "NurbsCurve":
        return this.parseNurbsGeometry(t);
    }
  }
  // Parse single node mesh geometry in FBXTree.Objects.Geometry
  parseMeshGeometry(e, t, n) {
    const i = n.skeletons, o = [], l = e.parents.map(function(d) {
      return pe.Objects.Model[d.ID];
    });
    if (l.length === 0)
      return;
    const c = e.children.reduce(function(d, g) {
      return i[g.ID] !== void 0 && (d = i[g.ID]), d;
    }, null);
    e.children.forEach(function(d) {
      n.morphTargets[d.ID] !== void 0 && o.push(n.morphTargets[d.ID]);
    });
    const u = l[0], f = {};
    "RotationOrder" in u && (f.eulerOrder = Hd(u.RotationOrder.value)), "InheritType" in u && (f.inheritType = parseInt(u.InheritType.value)), "GeometricTranslation" in u && (f.translation = u.GeometricTranslation.value), "GeometricRotation" in u && (f.rotation = u.GeometricRotation.value), "GeometricScaling" in u && (f.scale = u.GeometricScaling.value);
    const p = Nd(f);
    return this.genGeometry(t, c, o, p);
  }
  // Generate a BufferGeometry from a node in FBXTree.Objects.Geometry
  genGeometry(e, t, n, i) {
    const o = new Kt();
    e.attrName && (o.name = e.attrName);
    const l = this.parseGeoNode(e, t), c = this.genBuffers(l), u = new di(c.vertex, 3);
    if (u.applyMatrix4(i), o.setAttribute("position", u), c.colors.length > 0 && o.setAttribute("color", new di(c.colors, 3)), t && (o.setAttribute("skinIndex", new ab(c.weightsIndices, 4)), o.setAttribute("skinWeight", new di(c.vertexWeights, 4)), o.FBX_Deformer = t), c.normal.length > 0) {
      const f = new lb().getNormalMatrix(i), p = new di(c.normal, 3);
      p.applyNormalMatrix(f), o.setAttribute("normal", p);
    }
    if (c.uvs.forEach(function(f, p) {
      bc === "uv2" && p++;
      const d = p === 0 ? "uv" : `uv${p}`;
      o.setAttribute(d, new di(c.uvs[p], 2));
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
    return this.addMorphTargets(o, e, n, i), o;
  }
  parseGeoNode(e, t) {
    const n = {};
    if (n.vertexPositions = e.Vertices !== void 0 ? e.Vertices.a : [], n.vertexIndices = e.PolygonVertexIndex !== void 0 ? e.PolygonVertexIndex.a : [], e.LayerElementColor && (n.color = this.parseVertexColors(e.LayerElementColor[0])), e.LayerElementMaterial && (n.material = this.parseMaterialIndices(e.LayerElementMaterial[0])), e.LayerElementNormal && (n.normal = this.parseNormals(e.LayerElementNormal[0])), e.LayerElementUV) {
      n.uv = [];
      let i = 0;
      for (; e.LayerElementUV[i]; )
        e.LayerElementUV[i].UV && n.uv.push(this.parseUVs(e.LayerElementUV[i])), i++;
    }
    return n.weightTable = {}, t !== null && (n.skeleton = t, t.rawBones.forEach(function(i, o) {
      i.indices.forEach(function(l, c) {
        n.weightTable[l] === void 0 && (n.weightTable[l] = []), n.weightTable[l].push({
          id: o,
          weight: i.weights[c]
        });
      });
    })), n;
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
    let n = 0, i = 0, o = !1, l = [], c = [], u = [], f = [], p = [], d = [];
    const g = this;
    return e.vertexIndices.forEach(function(y, x) {
      let T, b = !1;
      y < 0 && (y = y ^ -1, b = !0);
      let L = [], M = [];
      if (l.push(y * 3, y * 3 + 1, y * 3 + 2), e.color) {
        const A = Do(x, n, y, e.color);
        u.push(A[0], A[1], A[2]);
      }
      if (e.skeleton) {
        if (e.weightTable[y] !== void 0 && e.weightTable[y].forEach(function(A) {
          M.push(A.weight), L.push(A.id);
        }), M.length > 4) {
          o || (console.warn(
            "THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights."
          ), o = !0);
          const A = [0, 0, 0, 0], R = [0, 0, 0, 0];
          M.forEach(function(k, G) {
            let V = k, F = L[G];
            R.forEach(function($, z, U) {
              if (V > $) {
                U[z] = V, V = $;
                const X = A[z];
                A[z] = F, F = X;
              }
            });
          }), L = A, M = R;
        }
        for (; M.length < 4; )
          M.push(0), L.push(0);
        for (let A = 0; A < 4; ++A)
          p.push(M[A]), d.push(L[A]);
      }
      if (e.normal) {
        const A = Do(x, n, y, e.normal);
        c.push(A[0], A[1], A[2]);
      }
      e.material && e.material.mappingType !== "AllSame" && (T = Do(x, n, y, e.material)[0]), e.uv && e.uv.forEach(function(A, R) {
        const k = Do(x, n, y, A);
        f[R] === void 0 && (f[R] = []), f[R].push(k[0]), f[R].push(k[1]);
      }), i++, b && (g.genFace(
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
      ), n++, i = 0, l = [], c = [], u = [], f = [], p = [], d = []);
    }), t;
  }
  // Generate data for a single face in a geometry. If the face is a quad then split it into 2 tris
  genFace(e, t, n, i, o, l, c, u, f, p) {
    for (let d = 2; d < p; d++)
      e.vertex.push(t.vertexPositions[n[0]]), e.vertex.push(t.vertexPositions[n[1]]), e.vertex.push(t.vertexPositions[n[2]]), e.vertex.push(t.vertexPositions[n[(d - 1) * 3]]), e.vertex.push(t.vertexPositions[n[(d - 1) * 3 + 1]]), e.vertex.push(t.vertexPositions[n[(d - 1) * 3 + 2]]), e.vertex.push(t.vertexPositions[n[d * 3]]), e.vertex.push(t.vertexPositions[n[d * 3 + 1]]), e.vertex.push(t.vertexPositions[n[d * 3 + 2]]), t.skeleton && (e.vertexWeights.push(u[0]), e.vertexWeights.push(u[1]), e.vertexWeights.push(u[2]), e.vertexWeights.push(u[3]), e.vertexWeights.push(u[(d - 1) * 4]), e.vertexWeights.push(u[(d - 1) * 4 + 1]), e.vertexWeights.push(u[(d - 1) * 4 + 2]), e.vertexWeights.push(u[(d - 1) * 4 + 3]), e.vertexWeights.push(u[d * 4]), e.vertexWeights.push(u[d * 4 + 1]), e.vertexWeights.push(u[d * 4 + 2]), e.vertexWeights.push(u[d * 4 + 3]), e.weightsIndices.push(f[0]), e.weightsIndices.push(f[1]), e.weightsIndices.push(f[2]), e.weightsIndices.push(f[3]), e.weightsIndices.push(f[(d - 1) * 4]), e.weightsIndices.push(f[(d - 1) * 4 + 1]), e.weightsIndices.push(f[(d - 1) * 4 + 2]), e.weightsIndices.push(f[(d - 1) * 4 + 3]), e.weightsIndices.push(f[d * 4]), e.weightsIndices.push(f[d * 4 + 1]), e.weightsIndices.push(f[d * 4 + 2]), e.weightsIndices.push(f[d * 4 + 3])), t.color && (e.colors.push(l[0]), e.colors.push(l[1]), e.colors.push(l[2]), e.colors.push(l[(d - 1) * 3]), e.colors.push(l[(d - 1) * 3 + 1]), e.colors.push(l[(d - 1) * 3 + 2]), e.colors.push(l[d * 3]), e.colors.push(l[d * 3 + 1]), e.colors.push(l[d * 3 + 2])), t.material && t.material.mappingType !== "AllSame" && (e.materialIndex.push(i), e.materialIndex.push(i), e.materialIndex.push(i)), t.normal && (e.normal.push(o[0]), e.normal.push(o[1]), e.normal.push(o[2]), e.normal.push(o[(d - 1) * 3]), e.normal.push(o[(d - 1) * 3 + 1]), e.normal.push(o[(d - 1) * 3 + 2]), e.normal.push(o[d * 3]), e.normal.push(o[d * 3 + 1]), e.normal.push(o[d * 3 + 2])), t.uv && t.uv.forEach(function(g, y) {
        e.uvs[y] === void 0 && (e.uvs[y] = []), e.uvs[y].push(c[y][0]), e.uvs[y].push(c[y][1]), e.uvs[y].push(c[y][(d - 1) * 2]), e.uvs[y].push(c[y][(d - 1) * 2 + 1]), e.uvs[y].push(c[y][d * 2]), e.uvs[y].push(c[y][d * 2 + 1]);
      });
  }
  addMorphTargets(e, t, n, i) {
    if (n.length === 0)
      return;
    e.morphTargetsRelative = !0, e.morphAttributes.position = [];
    const o = this;
    n.forEach(function(l) {
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
  genMorphGeometry(e, t, n, i, o) {
    const l = t.PolygonVertexIndex !== void 0 ? t.PolygonVertexIndex.a : [], c = n.Vertices !== void 0 ? n.Vertices.a : [], u = n.Indexes !== void 0 ? n.Indexes.a : [], f = e.attributes.position.count * 3, p = new Float32Array(f);
    for (let x = 0; x < u.length; x++) {
      const T = u[x] * 3;
      p[T] = c[x * 3], p[T + 1] = c[x * 3 + 1], p[T + 2] = c[x * 3 + 2];
    }
    const d = {
      vertexIndices: l,
      vertexPositions: p
    }, g = this.genBuffers(d), y = new di(g.vertex, 3);
    y.name = o || n.attrName, y.applyMatrix4(i), e.morphAttributes.position.push(y);
  }
  // Parse normal from FBXTree.Objects.Geometry.LayerElementNormal if it exists
  parseNormals(e) {
    const t = e.MappingInformationType, n = e.ReferenceInformationType, i = e.Normals.a;
    let o = [];
    return n === "IndexToDirect" && ("NormalIndex" in e ? o = e.NormalIndex.a : "NormalsIndex" in e && (o = e.NormalsIndex.a)), {
      dataSize: 3,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: n
    };
  }
  // Parse UVs from FBXTree.Objects.Geometry.LayerElementUV if it exists
  parseUVs(e) {
    const t = e.MappingInformationType, n = e.ReferenceInformationType, i = e.UV.a;
    let o = [];
    return n === "IndexToDirect" && (o = e.UVIndex.a), {
      dataSize: 2,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: n
    };
  }
  // Parse Vertex Colors from FBXTree.Objects.Geometry.LayerElementColor if it exists
  parseVertexColors(e) {
    const t = e.MappingInformationType, n = e.ReferenceInformationType, i = e.Colors.a;
    let o = [];
    return n === "IndexToDirect" && (o = e.ColorIndex.a), {
      dataSize: 4,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: n
    };
  }
  // Parse mapping and material data in FBXTree.Objects.Geometry.LayerElementMaterial if it exists
  parseMaterialIndices(e) {
    const t = e.MappingInformationType, n = e.ReferenceInformationType;
    if (t === "NoMappingInformation")
      return {
        dataSize: 1,
        buffer: [0],
        indices: [0],
        mappingType: "AllSame",
        referenceType: n
      };
    const i = e.Materials.a, o = [];
    for (let l = 0; l < i.length; ++l)
      o.push(l);
    return {
      dataSize: 1,
      buffer: i,
      indices: o,
      mappingType: t,
      referenceType: n
    };
  }
  // Generate a NurbGeometry from a node in FBXTree.Objects.Geometry
  parseNurbsGeometry(e) {
    if (xf === void 0)
      return console.error(
        "THREE.FBXLoader: The loader relies on NURBSCurve for any nurbs present in the model. Nurbs will show up as empty geometry."
      ), new Kt();
    const t = parseInt(e.Order);
    if (isNaN(t))
      return console.error("THREE.FBXLoader: Invalid Order %s given for geometry ID: %s", e.Order, e.id), new Kt();
    const n = t - 1, i = e.KnotVector.a, o = [], l = e.Points.a;
    for (let d = 0, g = l.length; d < g; d += 4)
      o.push(new _n().fromArray(l, d));
    let c, u;
    if (e.Form === "Closed")
      o.push(o[0]);
    else if (e.Form === "Periodic") {
      c = n, u = i.length - 1 - c;
      for (let d = 0; d < n; ++d)
        o.push(o[d]);
    }
    const p = new xf(n, i, o, c, u).getPoints(o.length * 12);
    return new Kt().setFromPoints(p);
  }
}
class bx {
  // take raw animation clips and turn them into three.js animation clips
  parse() {
    const e = [], t = this.parseClips();
    if (t !== void 0)
      for (const n in t) {
        const i = t[n], o = this.addClip(i);
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
    for (const n in e) {
      const i = e[n];
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
    for (const n in t) {
      const i = {
        id: t[n].id,
        times: t[n].KeyTime.a.map(Ax),
        values: t[n].KeyValueFloat.a
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
    const t = pe.Objects.AnimationLayer, n = /* @__PURE__ */ new Map();
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
                  modelName: g.attrName ? Cs.sanitizeNodeName(g.attrName) : "",
                  ID: g.id,
                  initialPosition: [0, 0, 0],
                  initialRotation: [0, 0, 0],
                  initialScale: [1, 1, 1]
                };
                Mt.traverse(function(x) {
                  x.ID === g.id && (y.transform = x.matrix, x.userData.transformData && (y.eulerOrder = x.userData.transformData.eulerOrder));
                }), y.transform || (y.transform = new be()), "PreRotation" in g && (y.preRotation = g.PreRotation.value), "PostRotation" in g && (y.postRotation = g.PostRotation.value), o[f] = y;
              }
            }
            o[f] && (o[f][p.attr] = p);
          } else if (p.curves.morph !== void 0) {
            if (o[f] === void 0) {
              const d = Ve.get(u.ID).parents.filter(function(L) {
                return L.relationship !== void 0;
              })[0].ID, g = Ve.get(d).parents[0].ID, y = Ve.get(g).parents[0].ID, x = Ve.get(y).parents[0].ID, T = pe.Objects.Model[x], b = {
                modelName: T.attrName ? Cs.sanitizeNodeName(T.attrName) : "",
                morphName: pe.Objects.Deformer[d].attrName
              };
              o[f] = b;
            }
            o[f][p.attr] = p;
          }
        }
      }), n.set(parseInt(i), o));
    }
    return n;
  }
  // parse nodes in FBXTree.Objects.AnimationStack. These are the top level node in the animation
  // hierarchy. Each Stack node will be used to create a AnimationClip
  parseAnimStacks(e) {
    const t = pe.Objects.AnimationStack, n = {};
    for (const i in t) {
      const o = Ve.get(parseInt(i)).children;
      o.length > 1 && console.warn(
        "THREE.FBXLoader: Encountered an animation stack with multiple layers, this is currently not supported. Ignoring subsequent layers."
      );
      const l = e.get(o[0].ID);
      n[i] = {
        name: t[i].attrName,
        layer: l
      };
    }
    return n;
  }
  addClip(e) {
    let t = [];
    const n = this;
    return e.layer.forEach(function(i) {
      t = t.concat(n.generateTracks(i));
    }), new _d(e.name, -1, t);
  }
  generateTracks(e) {
    const t = [];
    let n = new D(), i = new mn(), o = new D();
    if (e.transform && e.transform.decompose(n, i, o), n = n.toArray(), i = new _s().setFromQuaternion(i, e.eulerOrder).toArray(), o = o.toArray(), e.T !== void 0 && Object.keys(e.T.curves).length > 0) {
      const l = this.generateVectorTrack(
        e.modelName,
        e.T.curves,
        n,
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
  generateVectorTrack(e, t, n, i) {
    const o = this.getTimesForAllAxes(t), l = this.getKeyframeTrackValues(o, t, n);
    return new ic(e + "." + i, o, l);
  }
  generateRotationTrack(e, t, n, i, o, l) {
    t.x !== void 0 && (this.interpolateRotations(t.x), t.x.values = t.x.values.map(lt.degToRad)), t.y !== void 0 && (this.interpolateRotations(t.y), t.y.values = t.y.values.map(lt.degToRad)), t.z !== void 0 && (this.interpolateRotations(t.z), t.z.values = t.z.values.map(lt.degToRad));
    const c = this.getTimesForAllAxes(t), u = this.getKeyframeTrackValues(c, t, n);
    i !== void 0 && (i = i.map(lt.degToRad), i.push(l), i = new _s().fromArray(i), i = new mn().setFromEuler(i)), o !== void 0 && (o = o.map(lt.degToRad), o.push(l), o = new _s().fromArray(o), o = new mn().setFromEuler(o).invert());
    const f = new mn(), p = new _s(), d = [];
    for (let g = 0; g < u.length; g += 3)
      p.set(u[g], u[g + 1], u[g + 2], l), f.setFromEuler(p), i !== void 0 && f.premultiply(i), o !== void 0 && f.multiply(o), f.toArray(d, g / 3 * 4);
    return new sc(e + ".quaternion", c, d);
  }
  generateMorphTrack(e) {
    const t = e.DeformPercent.curves.morph, n = t.values.map(function(o) {
      return o / 100;
    }), i = Mt.getObjectByName(e.modelName).morphTargetDictionary[e.morphName];
    return new rc(
      e.modelName + ".morphTargetInfluences[" + i + "]",
      t.times,
      n
    );
  }
  // For all animated objects, times are defined separately for each axis
  // Here we'll combine the times into one sorted array without duplicates
  getTimesForAllAxes(e) {
    let t = [];
    if (e.x !== void 0 && (t = t.concat(e.x.times)), e.y !== void 0 && (t = t.concat(e.y.times)), e.z !== void 0 && (t = t.concat(e.z.times)), t = t.sort(function(n, i) {
      return n - i;
    }), t.length > 1) {
      let n = 1, i = t[0];
      for (let o = 1; o < t.length; o++) {
        const l = t[o];
        l !== i && (t[n] = l, i = l, n++);
      }
      t = t.slice(0, n);
    }
    return t;
  }
  getKeyframeTrackValues(e, t, n) {
    const i = n, o = [];
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
      const n = e.values[t - 1], i = e.values[t] - n, o = Math.abs(i);
      if (o >= 180) {
        const l = o / 180, c = i / l;
        let u = n + c;
        const f = e.times[t - 1], d = (e.times[t] - f) / l;
        let g = f + d;
        const y = [], x = [];
        for (; g < e.times[t]; )
          y.push(g), g += d, x.push(u), u += c;
        e.times = Mf(e.times, t, y), e.values = Mf(e.values, t, x);
      }
    }
  }
}
class xx {
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
    this.currentIndent = 0, this.allNodes = new zd(), this.nodeStack = [], this.currentProp = [], this.currentPropName = "";
    const t = this, n = e.split(/[\r\n]+/);
    return n.forEach(function(i, o) {
      const l = i.match(/^[\s\t]*;/), c = i.match(/^[\s\t]*$/);
      if (l || c)
        return;
      const u = i.match("^\\t{" + t.currentIndent + "}(\\w+):(.*){", ""), f = i.match("^\\t{" + t.currentIndent + "}(\\w+):[\\s\\t\\r\\n](.*)"), p = i.match("^\\t{" + (t.currentIndent - 1) + "}}");
      u ? t.parseNodeBegin(i, u) : f ? t.parseNodeProperty(i, f, n[++o]) : p ? t.popStack() : i.match(/^[^\s\t}]/) && t.parseNodePropertyContinued(i);
    }), this.allNodes;
  }
  parseNodeBegin(e, t) {
    const n = t[1].trim().replace(/^"/, "").replace(/"$/, ""), i = t[2].split(",").map(function(u) {
      return u.trim().replace(/^"/, "").replace(/"$/, "");
    }), o = { name: n }, l = this.parseNodeAttr(i), c = this.getCurrentNode();
    this.currentIndent === 0 ? this.allNodes.add(n, o) : n in c ? (n === "PoseNode" ? c.PoseNode.push(o) : c[n].id !== void 0 && (c[n] = {}, c[n][c[n].id] = c[n]), l.id !== "" && (c[n][l.id] = o)) : typeof l.id == "number" ? (c[n] = {}, c[n][l.id] = o) : n !== "Properties70" && (n === "PoseNode" ? c[n] = [o] : c[n] = o), typeof l.id == "number" && (o.id = l.id), l.name !== "" && (o.attrName = l.name), l.type !== "" && (o.attrType = l.type), this.pushStack(o);
  }
  parseNodeAttr(e) {
    let t = e[0];
    e[0] !== "" && (t = parseInt(e[0]), isNaN(t) && (t = e[0]));
    let n = "", i = "";
    return e.length > 1 && (n = e[1].replace(/^(\w+)::/, ""), i = e[2]), { id: t, name: n, type: i };
  }
  parseNodeProperty(e, t, n) {
    let i = t[1].replace(/^"/, "").replace(/"$/, "").trim(), o = t[2].replace(/^"/, "").replace(/"$/, "").trim();
    i === "Content" && o === "," && (o = n.replace(/"/g, "").replace(/,$/, "").trim());
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
      }), i = "connections", o = [f, p], Lx(o, d), l[i] === void 0 && (l[i] = []);
    }
    i === "Node" && (l.id = o), i in l && Array.isArray(l[i]) ? l[i].push(o) : i !== "a" ? l[i] = o : l.a = o, this.setCurrentProp(l, i), i === "a" && o.slice(-1) !== "," && (l.a = Fl(o));
  }
  parseNodePropertyContinued(e) {
    const t = this.getCurrentNode();
    t.a += e, e.slice(-1) !== "," && (t.a = Fl(t.a));
  }
  // parse "Property70"
  parseNodeSpecialProperty(e, t, n) {
    const i = n.split('",').map(function(p) {
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
        f = Fl(f);
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
class Tx {
  parse(e) {
    const t = new Tf(e);
    t.skip(23);
    const n = t.getUint32();
    if (n < 6400)
      throw new Error("THREE.FBXLoader: FBX version not supported, FileVersion: " + n);
    const i = new zd();
    for (; !this.endOfContent(t); ) {
      const o = this.parseNode(t, n);
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
    const n = {}, i = t >= 7500 ? e.getUint64() : e.getUint32(), o = t >= 7500 ? e.getUint64() : e.getUint32();
    t >= 7500 ? e.getUint64() : e.getUint32();
    const l = e.getUint8(), c = e.getString(l);
    if (i === 0)
      return null;
    const u = [];
    for (let g = 0; g < o; g++)
      u.push(this.parseProperty(e));
    const f = u.length > 0 ? u[0] : "", p = u.length > 1 ? u[1] : "", d = u.length > 2 ? u[2] : "";
    for (n.singleProperty = o === 1 && e.getOffset() === i; i > e.getOffset(); ) {
      const g = this.parseNode(e, t);
      g !== null && this.parseSubNode(c, n, g);
    }
    return n.propertyList = u, typeof f == "number" && (n.id = f), p !== "" && (n.attrName = p), d !== "" && (n.attrType = d), c !== "" && (n.name = c), n;
  }
  parseSubNode(e, t, n) {
    if (n.singleProperty === !0) {
      const i = n.propertyList[0];
      Array.isArray(i) ? (t[n.name] = n, n.a = i) : t[n.name] = i;
    } else if (e === "Connections" && n.name === "C") {
      const i = [];
      n.propertyList.forEach(function(o, l) {
        l !== 0 && i.push(o);
      }), t.connections === void 0 && (t.connections = []), t.connections.push(i);
    } else if (n.name === "Properties70")
      Object.keys(n).forEach(function(o) {
        t[o] = n[o];
      });
    else if (e === "Properties70" && n.name === "P") {
      let i = n.propertyList[0], o = n.propertyList[1];
      const l = n.propertyList[2], c = n.propertyList[3];
      let u;
      i.indexOf("Lcl ") === 0 && (i = i.replace("Lcl ", "Lcl_")), o.indexOf("Lcl ") === 0 && (o = o.replace("Lcl ", "Lcl_")), o === "Color" || o === "ColorRGB" || o === "Vector" || o === "Vector3D" || o.indexOf("Lcl_") === 0 ? u = [n.propertyList[4], n.propertyList[5], n.propertyList[6]] : u = n.propertyList[4], t[i] = {
        type: o,
        type2: l,
        flag: c,
        value: u
      };
    } else t[n.name] === void 0 ? typeof n.id == "number" ? (t[n.name] = {}, t[n.name][n.id] = n) : t[n.name] = n : n.name === "PoseNode" ? (Array.isArray(t[n.name]) || (t[n.name] = [t[n.name]]), t[n.name].push(n)) : t[n.name][n.id] === void 0 && (t[n.name][n.id] = n);
  }
  parseProperty(e) {
    const t = e.getString(1);
    let n;
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
        return n = e.getUint32(), e.getArrayBuffer(n);
      case "S":
        return n = e.getUint32(), e.getString(n);
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
        const c = Jb(new Uint8Array(e.getArrayBuffer(l))), u = new Tf(c.buffer);
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
class Tf {
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
    for (let n = 0; n < e; n++)
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
    for (let n = 0; n < e; n++)
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
    for (let n = 0; n < e; n++)
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
    for (let n = 0; n < e; n++)
      t.push(this.getFloat32());
    return t;
  }
  getFloat64() {
    const e = this.dv.getFloat64(this.offset, this.littleEndian);
    return this.offset += 8, e;
  }
  getFloat64Array(e) {
    const t = [];
    for (let n = 0; n < e; n++)
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
    const n = t.indexOf(0);
    return n >= 0 && (t = t.slice(0, n)), Ur(new Uint8Array(t));
  }
}
class zd {
  add(e, t) {
    this[e] = t;
  }
}
function Sx(s) {
  const e = "Kaydara FBX Binary  \0";
  return s.byteLength >= e.length && e === Vd(s, 0, e.length);
}
function Mx(s) {
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
  function n(i) {
    const o = s[i - 1];
    return s = s.slice(t + i), t++, o;
  }
  for (let i = 0; i < e.length; ++i)
    if (n(1) === e[i])
      return !1;
  return !0;
}
function Sf(s) {
  const e = /FBXVersion: (\d+)/, t = s.match(e);
  if (t)
    return parseInt(t[1]);
  throw new Error("THREE.FBXLoader: Cannot find the version number for the file given.");
}
function Ax(s) {
  return s / 46186158e3;
}
const Px = [];
function Do(s, e, t, n) {
  let i;
  switch (n.mappingType) {
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
      i = n.indices[0];
      break;
    default:
      console.warn("THREE.FBXLoader: unknown attribute mapping type " + n.mappingType);
  }
  n.referenceType === "IndexToDirect" && (i = n.indices[i]);
  const o = i * n.dataSize, l = o + n.dataSize;
  return Ex(Px, n.buffer, o, l);
}
const Il = /* @__PURE__ */ new _s(), Tr = /* @__PURE__ */ new D();
function Nd(s) {
  const e = new be(), t = new be(), n = new be(), i = new be(), o = new be(), l = new be(), c = new be(), u = new be(), f = new be(), p = new be(), d = new be(), g = new be(), y = s.inheritType ? s.inheritType : 0;
  if (s.translation && e.setPosition(Tr.fromArray(s.translation)), s.preRotation) {
    const z = s.preRotation.map(lt.degToRad);
    z.push(s.eulerOrder), t.makeRotationFromEuler(Il.fromArray(z));
  }
  if (s.rotation) {
    const z = s.rotation.map(lt.degToRad);
    z.push(s.eulerOrder), n.makeRotationFromEuler(Il.fromArray(z));
  }
  if (s.postRotation) {
    const z = s.postRotation.map(lt.degToRad);
    z.push(s.eulerOrder), i.makeRotationFromEuler(Il.fromArray(z)), i.invert();
  }
  s.scale && o.scale(Tr.fromArray(s.scale)), s.scalingOffset && c.setPosition(Tr.fromArray(s.scalingOffset)), s.scalingPivot && l.setPosition(Tr.fromArray(s.scalingPivot)), s.rotationOffset && u.setPosition(Tr.fromArray(s.rotationOffset)), s.rotationPivot && f.setPosition(Tr.fromArray(s.rotationPivot)), s.parentMatrixWorld && (d.copy(s.parentMatrix), p.copy(s.parentMatrixWorld));
  const x = t.clone().multiply(n).multiply(i), T = new be();
  T.extractRotation(p);
  const b = new be();
  b.copyPosition(p);
  const L = b.clone().invert().multiply(p), M = T.clone().invert().multiply(L), A = o, R = new be();
  if (y === 0)
    R.copy(T).multiply(x).multiply(M).multiply(A);
  else if (y === 1)
    R.copy(T).multiply(M).multiply(x).multiply(A);
  else {
    const U = new be().scale(new D().setFromMatrixScale(d)).clone().invert(), X = M.clone().multiply(U);
    R.copy(T).multiply(x).multiply(X).multiply(A);
  }
  const k = f.clone().invert(), G = l.clone().invert();
  let V = e.clone().multiply(u).multiply(f).multiply(t).multiply(n).multiply(i).multiply(k).multiply(c).multiply(l).multiply(o).multiply(G);
  const F = new be().copyPosition(V), $ = p.clone().multiply(F);
  return g.copyPosition($), V = g.clone().multiply(R), V.premultiply(p.invert()), V;
}
function Hd(s) {
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
function Fl(s) {
  return s.split(",").map(function(t) {
    return parseFloat(t);
  });
}
function Vd(s, e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = s.byteLength), Ur(new Uint8Array(s, e, t));
}
function Lx(s, e) {
  for (let t = 0, n = s.length, i = e.length; t < i; t++, n++)
    s[n] = e[t];
}
function Ex(s, e, t, n) {
  for (let i = t, o = 0; i < n; i++, o++)
    s[o] = e[i];
  return s;
}
function Mf(s, e, t) {
  return s.slice(0, e).concat(t).concat(s.slice(e));
}
class Cx extends cb {
  constructor(e) {
    super(e), this.type = Yi;
  }
  // adapted from http://www.graphics.cornell.edu/~bjw/rgbe.html
  parse(e) {
    const l = function(F, $) {
      switch (F) {
        case 1:
          throw new Error("THREE.RGBELoader: Read Error: " + ($ || ""));
        case 2:
          throw new Error("THREE.RGBELoader: Write Error: " + ($ || ""));
        case 3:
          throw new Error("THREE.RGBELoader: Bad File Format: " + ($ || ""));
        default:
        case 4:
          throw new Error("THREE.RGBELoader: Memory Error: " + ($ || ""));
      }
    }, d = function(F, $, z) {
      $ = $ || 1024;
      let X = F.pos, q = -1, Z = 0, ee = "", Q = String.fromCharCode.apply(null, new Uint16Array(F.subarray(X, X + 128)));
      for (; 0 > (q = Q.indexOf(`
`)) && Z < $ && X < F.byteLength; )
        ee += Q, Z += Q.length, X += 128, Q += String.fromCharCode.apply(null, new Uint16Array(F.subarray(X, X + 128)));
      return -1 < q ? (F.pos += Z + q + 1, ee + Q.slice(0, q)) : !1;
    }, g = function(F) {
      const $ = /^#\?(\S+)/, z = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/, U = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/, X = /^\s*FORMAT=(\S+)\s*$/, q = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/, Z = {
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
      for ((F.pos >= F.byteLength || !(ee = d(F))) && l(1, "no header found"), (Q = ee.match($)) || l(3, "bad initial token"), Z.valid |= 1, Z.programtype = Q[1], Z.string += ee + `
`; ee = d(F), ee !== !1; ) {
        if (Z.string += ee + `
`, ee.charAt(0) === "#") {
          Z.comments += ee + `
`;
          continue;
        }
        if ((Q = ee.match(z)) && (Z.gamma = parseFloat(Q[1])), (Q = ee.match(U)) && (Z.exposure = parseFloat(Q[1])), (Q = ee.match(X)) && (Z.valid |= 2, Z.format = Q[1]), (Q = ee.match(q)) && (Z.valid |= 4, Z.height = parseInt(Q[1], 10), Z.width = parseInt(Q[2], 10)), Z.valid & 2 && Z.valid & 4)
          break;
      }
      return Z.valid & 2 || l(3, "missing format specifier"), Z.valid & 4 || l(3, "missing image size specifier"), Z;
    }, y = function(F, $, z) {
      const U = $;
      if (
        // run length encoding is not allowed so read flat
        U < 8 || U > 32767 || // this file is not run length encoded
        F[0] !== 2 || F[1] !== 2 || F[2] & 128
      )
        return new Uint8Array(F);
      U !== (F[2] << 8 | F[3]) && l(3, "wrong scanline width");
      const X = new Uint8Array(4 * $ * z);
      X.length || l(4, "unable to allocate buffer space");
      let q = 0, Z = 0;
      const ee = 4 * U, Q = new Uint8Array(4), Le = new Uint8Array(ee);
      let we = z;
      for (; we > 0 && Z < F.byteLength; ) {
        Z + 4 > F.byteLength && l(1), Q[0] = F[Z++], Q[1] = F[Z++], Q[2] = F[Z++], Q[3] = F[Z++], (Q[0] != 2 || Q[1] != 2 || (Q[2] << 8 | Q[3]) != U) && l(3, "bad rgbe scanline format");
        let xe = 0, ge;
        for (; xe < ee && Z < F.byteLength; ) {
          ge = F[Z++];
          const Ce = ge > 128;
          if (Ce && (ge -= 128), (ge === 0 || xe + ge > ee) && l(3, "bad scanline data"), Ce) {
            const Oe = F[Z++];
            for (let ct = 0; ct < ge; ct++)
              Le[xe++] = Oe;
          } else
            Le.set(F.subarray(Z, Z + ge), xe), xe += ge, Z += ge;
        }
        const Ee = U;
        for (let Ce = 0; Ce < Ee; Ce++) {
          let Oe = 0;
          X[q] = Le[Ce + Oe], Oe += U, X[q + 1] = Le[Ce + Oe], Oe += U, X[q + 2] = Le[Ce + Oe], Oe += U, X[q + 3] = Le[Ce + Oe], q += 4;
        }
        we--;
      }
      return X;
    }, x = function(F, $, z, U) {
      const X = F[$ + 3], q = Math.pow(2, X - 128) / 255;
      z[U + 0] = F[$ + 0] * q, z[U + 1] = F[$ + 1] * q, z[U + 2] = F[$ + 2] * q, z[U + 3] = 1;
    }, T = function(F, $, z, U) {
      const X = F[$ + 3], q = Math.pow(2, X - 128) / 255;
      z[U + 0] = Co.toHalfFloat(Math.min(F[$ + 0] * q, 65504)), z[U + 1] = Co.toHalfFloat(Math.min(F[$ + 1] * q, 65504)), z[U + 2] = Co.toHalfFloat(Math.min(F[$ + 2] * q, 65504)), z[U + 3] = Co.toHalfFloat(1);
    }, b = new Uint8Array(e);
    b.pos = 0;
    const L = g(b), M = L.width, A = L.height, R = y(b.subarray(b.pos), M, A);
    let k, G, V;
    switch (this.type) {
      case Ko:
        V = R.length / 4;
        const F = new Float32Array(V * 4);
        for (let z = 0; z < V; z++)
          x(R, z * 4, F, z * 4);
        k = F, G = Ko;
        break;
      case Yi:
        V = R.length / 4;
        const $ = new Uint16Array(V * 4);
        for (let z = 0; z < V; z++)
          T(R, z * 4, $, z * 4);
        k = $, G = Yi;
        break;
      default:
        throw new Error("THREE.RGBELoader: Unsupported type: " + this.type);
    }
    return {
      width: M,
      height: A,
      data: k,
      header: L.string,
      gamma: L.gamma,
      exposure: L.exposure,
      type: G
    };
  }
  setDataType(e) {
    return this.type = e, this;
  }
  load(e, t, n, i) {
    function o(l, c) {
      switch (l.type) {
        case Ko:
        case Yi:
          "colorSpace" in l ? l.colorSpace = "srgb-linear" : l.encoding = 3e3, l.minFilter = vi, l.magFilter = vi, l.generateMipmaps = !1, l.flipY = !0;
          break;
      }
      t && t(l, c);
    }
    return super.load(e, o, n, i);
  }
}
const Bl = /* @__PURE__ */ new WeakMap();
class Ox extends yc {
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
  load(e, t, n, i) {
    const o = new wi(this.manager);
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
      n,
      i
    );
  }
  /** @deprecated Kept for backward-compatibility with previous DRACOLoader versions. */
  decodeDracoFile(e, t, n, i) {
    const o = {
      attributeIDs: n || this.defaultAttributeIDs,
      attributeTypes: i || this.defaultAttributeTypes,
      useUniqueIDs: !!n
    };
    this.decodeGeometry(e, o).then(t);
  }
  decodeGeometry(e, t) {
    for (const u in t.attributeTypes) {
      const f = t.attributeTypes[u];
      f.BYTES_PER_ELEMENT !== void 0 && (t.attributeTypes[u] = f.name);
    }
    const n = JSON.stringify(t);
    if (Bl.has(e)) {
      const u = Bl.get(e);
      if (u.key === n)
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
    }), Bl.set(e, {
      key: n,
      promise: c
    }), c;
  }
  _createGeometry(e) {
    const t = new Kt();
    e.index && t.setIndex(new mt(e.index.array, 1));
    for (let n = 0; n < e.attributes.length; n++) {
      const i = e.attributes[n], o = i.name, l = i.array, c = i.itemSize;
      t.setAttribute(o, new mt(l, c));
    }
    return t;
  }
  _loadLibrary(e, t) {
    const n = new wi(this.manager);
    return n.setPath(this.decoderPath), n.setResponseType(t), n.setWithCredentials(this.withCredentials), new Promise((i, o) => {
      n.load(e, i, void 0, o);
    });
  }
  preload() {
    return this._initDecoder(), this;
  }
  _initDecoder() {
    if (this.decoderPending)
      return this.decoderPending;
    const e = typeof WebAssembly != "object" || this.decoderConfig.type === "js", t = [];
    return e ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")), t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))), this.decoderPending = Promise.all(t).then((n) => {
      const i = n[0];
      e || (this.decoderConfig.wasmBinary = n[1]);
      const o = Rx.toString(), l = [
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
      const n = this.workerPool[this.workerPool.length - 1];
      return n._taskCosts[e] = t, n._taskLoad += t, n;
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
function Rx() {
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
            const x = t(d, g, y, f), T = x.attributes.map((b) => b.array.buffer);
            x.index && T.push(x.index.array.buffer), self.postMessage({ type: "decode", id: c.id, geometry: x }, T);
          } catch (x) {
            console.error(x), self.postMessage({ type: "error", id: c.id, error: x.message });
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
    const x = c.GetEncodedGeometryType(u);
    if (x === l.TRIANGULAR_MESH)
      g = new l.Mesh(), y = c.DecodeBufferToMesh(u, g);
    else if (x === l.POINT_CLOUD)
      g = new l.PointCloud(), y = c.DecodeBufferToPointCloud(u, g);
    else
      throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
    if (!y.ok() || g.ptr === 0)
      throw new Error("THREE.DRACOLoader: Decoding failed: " + y.error_msg());
    const T = { index: null, attributes: [] };
    for (const b in p) {
      const L = self[d[b]];
      let M, A;
      if (f.useUniqueIDs)
        A = p[b], M = c.GetAttributeByUniqueId(g, A);
      else {
        if (A = c.GetAttributeId(g, l[p[b]]), A === -1)
          continue;
        M = c.GetAttribute(g, A);
      }
      T.attributes.push(i(l, c, g, b, L, M));
    }
    return x === l.TRIANGULAR_MESH && (T.index = n(l, c, g)), l.destroy(g), T;
  }
  function n(l, c, u) {
    const p = u.num_faces() * 3, d = p * 4, g = l._malloc(d);
    c.GetTrianglesUInt32Array(u, d, g);
    const y = new Uint32Array(l.HEAPF32.buffer, g, p).slice();
    return l._free(g), { array: y, itemSize: 1 };
  }
  function i(l, c, u, f, p, d) {
    const g = d.num_components(), x = u.num_points() * g, T = x * p.BYTES_PER_ELEMENT, b = o(l, p), L = l._malloc(T);
    c.GetAttributeDataArrayForAllPoints(u, d, b, T, L);
    const M = new p(l.HEAPF32.buffer, L, x).slice();
    return l._free(L), {
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
const Af = /* @__PURE__ */ new tr(), Io = /* @__PURE__ */ new D();
class Wd extends od {
  constructor() {
    super(), this.isLineSegmentsGeometry = !0, this.type = "LineSegmentsGeometry";
    const e = [-1, 2, 0, 1, 2, 0, -1, 1, 0, 1, 1, 0, -1, 0, 0, 1, 0, 0, -1, -1, 0, 1, -1, 0], t = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2], n = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];
    this.setIndex(n), this.setAttribute("position", new di(e, 3)), this.setAttribute("uv", new di(t, 2));
  }
  applyMatrix4(e) {
    const t = this.attributes.instanceStart, n = this.attributes.instanceEnd;
    return t !== void 0 && (t.applyMatrix4(e), n.applyMatrix4(e), t.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this;
  }
  setPositions(e) {
    let t;
    e instanceof Float32Array ? t = e : Array.isArray(e) && (t = new Float32Array(e));
    const n = new oc(t, 6, 1);
    return this.setAttribute("instanceStart", new Zi(n, 3, 0)), this.setAttribute("instanceEnd", new Zi(n, 3, 3)), this.computeBoundingBox(), this.computeBoundingSphere(), this;
  }
  setColors(e, t = 3) {
    let n;
    e instanceof Float32Array ? n = e : Array.isArray(e) && (n = new Float32Array(e));
    const i = new oc(n, t * 2, 1);
    return this.setAttribute("instanceColorStart", new Zi(i, t, 0)), this.setAttribute("instanceColorEnd", new Zi(i, t, t)), this;
  }
  fromWireframeGeometry(e) {
    return this.setPositions(e.attributes.position.array), this;
  }
  fromEdgesGeometry(e) {
    return this.setPositions(e.attributes.position.array), this;
  }
  fromMesh(e) {
    return this.fromWireframeGeometry(new ub(e.geometry)), this;
  }
  fromLineSegments(e) {
    const t = e.geometry;
    return this.setPositions(t.attributes.position.array), this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new tr());
    const e = this.attributes.instanceStart, t = this.attributes.instanceEnd;
    e !== void 0 && t !== void 0 && (this.boundingBox.setFromBufferAttribute(e), Af.setFromBufferAttribute(t), this.boundingBox.union(Af));
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new wc()), this.boundingBox === null && this.computeBoundingBox();
    const e = this.attributes.instanceStart, t = this.attributes.instanceEnd;
    if (e !== void 0 && t !== void 0) {
      const n = this.boundingSphere.center;
      this.boundingBox.getCenter(n);
      let i = 0;
      for (let o = 0, l = e.count; o < l; o++)
        Io.fromBufferAttribute(e, o), i = Math.max(i, n.distanceToSquared(Io)), Io.fromBufferAttribute(t, o), i = Math.max(i, n.distanceToSquared(Io));
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
class la extends Wd {
  constructor() {
    super(), this.isLineGeometry = !0, this.type = "LineGeometry";
  }
  setPositions(e) {
    const t = e.length - 3, n = new Float32Array(2 * t);
    for (let i = 0; i < t; i += 3)
      n[2 * i] = e[i], n[2 * i + 1] = e[i + 1], n[2 * i + 2] = e[i + 2], n[2 * i + 3] = e[i + 3], n[2 * i + 4] = e[i + 4], n[2 * i + 5] = e[i + 5];
    return super.setPositions(n), this;
  }
  setColors(e, t = 3) {
    const n = e.length - t, i = new Float32Array(2 * n);
    if (t === 3)
      for (let o = 0; o < n; o += t)
        i[2 * o] = e[o], i[2 * o + 1] = e[o + 1], i[2 * o + 2] = e[o + 2], i[2 * o + 3] = e[o + 3], i[2 * o + 4] = e[o + 4], i[2 * o + 5] = e[o + 5];
    else
      for (let o = 0; o < n; o += t)
        i[2 * o] = e[o], i[2 * o + 1] = e[o + 1], i[2 * o + 2] = e[o + 2], i[2 * o + 3] = e[o + 3], i[2 * o + 4] = e[o + 4], i[2 * o + 5] = e[o + 5], i[2 * o + 6] = e[o + 6], i[2 * o + 7] = e[o + 7];
    return super.setColors(i, t), this;
  }
  fromLine(e) {
    const t = e.geometry;
    return this.setPositions(t.attributes.position.array), this;
  }
}
class ks extends Pn {
  constructor(e) {
    super({
      type: "LineMaterial",
      uniforms: er.clone(
        er.merge([
          ea.common,
          ea.fog,
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
					#include <${aa >= 154 ? "colorspace_fragment" : "encodings_fragment"}>
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
const Ul = /* @__PURE__ */ new _n(), Pf = /* @__PURE__ */ new D(), Lf = /* @__PURE__ */ new D(), Ke = /* @__PURE__ */ new _n(), Qe = /* @__PURE__ */ new _n(), Tn = /* @__PURE__ */ new _n(), kl = /* @__PURE__ */ new D(), zl = /* @__PURE__ */ new be(), tt = /* @__PURE__ */ new hb(), Ef = /* @__PURE__ */ new D(), Fo = /* @__PURE__ */ new tr(), Bo = /* @__PURE__ */ new wc(), Sn = /* @__PURE__ */ new _n();
let An, Ji;
function Cf(s, e, t) {
  return Sn.set(0, 0, -e, 1).applyMatrix4(s.projectionMatrix), Sn.multiplyScalar(1 / Sn.w), Sn.x = Ji / t.width, Sn.y = Ji / t.height, Sn.applyMatrix4(s.projectionMatrixInverse), Sn.multiplyScalar(1 / Sn.w), Math.abs(Math.max(Sn.x, Sn.y));
}
function Dx(s, e) {
  const t = s.matrixWorld, n = s.geometry, i = n.attributes.instanceStart, o = n.attributes.instanceEnd, l = Math.min(n.instanceCount, i.count);
  for (let c = 0, u = l; c < u; c++) {
    tt.start.fromBufferAttribute(i, c), tt.end.fromBufferAttribute(o, c), tt.applyMatrix4(t);
    const f = new D(), p = new D();
    An.distanceSqToSegment(tt.start, tt.end, p, f), p.distanceTo(f) < Ji * 0.5 && e.push({
      point: p,
      pointOnLine: f,
      distance: An.origin.distanceTo(p),
      object: s,
      face: null,
      faceIndex: c,
      uv: null,
      [bc]: null
    });
  }
}
function Ix(s, e, t) {
  const n = e.projectionMatrix, o = s.material.resolution, l = s.matrixWorld, c = s.geometry, u = c.attributes.instanceStart, f = c.attributes.instanceEnd, p = Math.min(c.instanceCount, u.count), d = -e.near;
  An.at(1, Tn), Tn.w = 1, Tn.applyMatrix4(e.matrixWorldInverse), Tn.applyMatrix4(n), Tn.multiplyScalar(1 / Tn.w), Tn.x *= o.x / 2, Tn.y *= o.y / 2, Tn.z = 0, kl.copy(Tn), zl.multiplyMatrices(e.matrixWorldInverse, l);
  for (let g = 0, y = p; g < y; g++) {
    if (Ke.fromBufferAttribute(u, g), Qe.fromBufferAttribute(f, g), Ke.w = 1, Qe.w = 1, Ke.applyMatrix4(zl), Qe.applyMatrix4(zl), Ke.z > d && Qe.z > d)
      continue;
    if (Ke.z > d) {
      const A = Ke.z - Qe.z, R = (Ke.z - d) / A;
      Ke.lerp(Qe, R);
    } else if (Qe.z > d) {
      const A = Qe.z - Ke.z, R = (Qe.z - d) / A;
      Qe.lerp(Ke, R);
    }
    Ke.applyMatrix4(n), Qe.applyMatrix4(n), Ke.multiplyScalar(1 / Ke.w), Qe.multiplyScalar(1 / Qe.w), Ke.x *= o.x / 2, Ke.y *= o.y / 2, Qe.x *= o.x / 2, Qe.y *= o.y / 2, tt.start.copy(Ke), tt.start.z = 0, tt.end.copy(Qe), tt.end.z = 0;
    const T = tt.closestPointToPointParameter(kl, !0);
    tt.at(T, Ef);
    const b = lt.lerp(Ke.z, Qe.z, T), L = b >= -1 && b <= 1, M = kl.distanceTo(Ef) < Ji * 0.5;
    if (L && M) {
      tt.start.fromBufferAttribute(u, g), tt.end.fromBufferAttribute(f, g), tt.start.applyMatrix4(l), tt.end.applyMatrix4(l);
      const A = new D(), R = new D();
      An.distanceSqToSegment(tt.start, tt.end, R, A), t.push({
        point: R,
        pointOnLine: A,
        distance: An.origin.distanceTo(R),
        object: s,
        face: null,
        faceIndex: g,
        uv: null,
        [bc]: null
      });
    }
  }
}
class Fx extends Be {
  constructor(e = new Wd(), t = new ks({ color: Math.random() * 16777215 })) {
    super(e, t), this.isLineSegments2 = !0, this.type = "LineSegments2";
  }
  // for backwards-compatibility, but could be a method of LineSegmentsGeometry...
  computeLineDistances() {
    const e = this.geometry, t = e.attributes.instanceStart, n = e.attributes.instanceEnd, i = new Float32Array(2 * t.count);
    for (let l = 0, c = 0, u = t.count; l < u; l++, c += 2)
      Pf.fromBufferAttribute(t, l), Lf.fromBufferAttribute(n, l), i[c] = c === 0 ? 0 : i[c - 1], i[c + 1] = i[c] + Pf.distanceTo(Lf);
    const o = new oc(i, 2, 1);
    return e.setAttribute("instanceDistanceStart", new Zi(o, 1, 0)), e.setAttribute("instanceDistanceEnd", new Zi(o, 1, 1)), this;
  }
  raycast(e, t) {
    const n = this.material.worldUnits, i = e.camera;
    i === null && !n && console.error(
      'LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'
    );
    const o = e.params.Line2 !== void 0 && e.params.Line2.threshold || 0;
    An = e.ray;
    const l = this.matrixWorld, c = this.geometry, u = this.material;
    Ji = u.linewidth + o, c.boundingSphere === null && c.computeBoundingSphere(), Bo.copy(c.boundingSphere).applyMatrix4(l);
    let f;
    if (n)
      f = Ji * 0.5;
    else {
      const d = Math.max(i.near, Bo.distanceToPoint(An.origin));
      f = Cf(i, d, u.resolution);
    }
    if (Bo.radius += f, An.intersectsSphere(Bo) === !1)
      return;
    c.boundingBox === null && c.computeBoundingBox(), Fo.copy(c.boundingBox).applyMatrix4(l);
    let p;
    if (n)
      p = Ji * 0.5;
    else {
      const d = Math.max(i.near, Fo.distanceToPoint(An.origin));
      p = Cf(i, d, u.resolution);
    }
    Fo.expandByScalar(p), An.intersectsBox(Fo) !== !1 && (n ? Dx(this, t) : Ix(this, i, t));
  }
  onBeforeRender(e) {
    const t = this.material.uniforms;
    t && t.resolution && (e.getViewport(Ul), this.material.uniforms.resolution.value.set(Ul.z, Ul.w));
  }
}
class ca extends Fx {
  constructor(e = new la(), t = new ks({ color: Math.random() * 16777215 })) {
    super(e, t), this.isLine2 = !0, this.type = "Line2";
  }
}
var _i = Object.freeze({
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
      return 1 - _i.Bounce.Out(1 - s);
    },
    Out: function(s) {
      return s < 1 / 2.75 ? 7.5625 * s * s : s < 2 / 2.75 ? 7.5625 * (s -= 1.5 / 2.75) * s + 0.75 : s < 2.5 / 2.75 ? 7.5625 * (s -= 2.25 / 2.75) * s + 0.9375 : 7.5625 * (s -= 2.625 / 2.75) * s + 0.984375;
    },
    InOut: function(s) {
      return s < 0.5 ? _i.Bounce.In(s * 2) * 0.5 : _i.Bounce.Out(s * 2 - 1) * 0.5 + 0.5;
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
}), ws = function() {
  return performance.now();
}, Bx = (
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
      e === void 0 && (e = ws()), t === void 0 && (t = !1);
      var n = Object.keys(this._tweens);
      if (n.length === 0)
        return !1;
      for (; n.length > 0; ) {
        this._tweensAddedDuringUpdate = {};
        for (var i = 0; i < n.length; i++) {
          var o = this._tweens[n[i]], l = !t;
          o && o.update(e, l) === !1 && !t && delete this._tweens[n[i]];
        }
        n = Object.keys(this._tweensAddedDuringUpdate);
      }
      return !0;
    }, s;
  })()
), dc = {
  Linear: function(s, e) {
    var t = s.length - 1, n = t * e, i = Math.floor(n), o = dc.Utils.Linear;
    return e < 0 ? o(s[0], s[1], n) : e > 1 ? o(s[t], s[t - 1], t - n) : o(s[i], s[i + 1 > t ? t : i + 1], n - i);
  },
  Utils: {
    Linear: function(s, e, t) {
      return (e - s) * t + s;
    }
  }
}, Gd = (
  /** @class */
  (function() {
    function s() {
    }
    return s.nextId = function() {
      return s._nextId++;
    }, s._nextId = 0, s;
  })()
), pc = new Bx(), Uo = (
  /** @class */
  (function() {
    function s(e, t) {
      t === void 0 && (t = pc), this._object = e, this._group = t, this._isPaused = !1, this._pauseStart = 0, this._valuesStart = {}, this._valuesEnd = {}, this._valuesStartRepeat = {}, this._duration = 1e3, this._isDynamic = !1, this._initialRepeat = 0, this._repeat = 0, this._yoyo = !1, this._isPlaying = !1, this._reversed = !1, this._delayTime = 0, this._startTime = 0, this._easingFunction = _i.Linear.None, this._interpolationFunction = dc.Linear, this._chainedTweens = [], this._onStartCallbackFired = !1, this._onEveryStartCallbackFired = !1, this._id = Gd.nextId(), this._isChainStopped = !1, this._propertiesAreSetUp = !1, this._goToEnd = !1;
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
      if (e === void 0 && (e = ws()), t === void 0 && (t = !1), this._isPlaying)
        return this;
      if (this._group && this._group.add(this), this._repeat = this._initialRepeat, this._reversed) {
        this._reversed = !1;
        for (var n in this._valuesStartRepeat)
          this._swapEndStartRepeatValues(n), this._valuesStart[n] = this._valuesStartRepeat[n];
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
    }, s.prototype._setupProperties = function(e, t, n, i, o) {
      for (var l in n) {
        var c = e[l], u = Array.isArray(c), f = u ? "array" : typeof c, p = !u && Array.isArray(n[l]);
        if (!(f === "undefined" || f === "function")) {
          if (p) {
            var d = n[l];
            if (d.length === 0)
              continue;
            for (var g = [c], y = 0, x = d.length; y < x; y += 1) {
              var T = this._handleRelativeValue(c, d[y]);
              if (isNaN(T)) {
                p = !1, console.warn("Found invalid interpolation list. Skipping.");
                break;
              }
              g.push(T);
            }
            p && (n[l] = g);
          }
          if ((f === "object" || u) && c && !p) {
            t[l] = u ? [] : {};
            var b = c;
            for (var L in b)
              t[l][L] = b[L];
            i[l] = u ? [] : {};
            var d = n[l];
            if (!this._isDynamic) {
              var M = {};
              for (var L in d)
                M[L] = d[L];
              n[l] = d = M;
            }
            this._setupProperties(b, t[l], d, i[l], o);
          } else
            (typeof t[l] > "u" || o) && (t[l] = c), u || (t[l] *= 1), p ? i[l] = n[l].slice().reverse() : i[l] = t[l] || 0;
        }
      }
    }, s.prototype.stop = function() {
      return this._isChainStopped || (this._isChainStopped = !0, this.stopChainedTweens()), this._isPlaying ? (this._group && this._group.remove(this), this._isPlaying = !1, this._isPaused = !1, this._onStopCallback && this._onStopCallback(this._object), this) : this;
    }, s.prototype.end = function() {
      return this._goToEnd = !0, this.update(1 / 0), this;
    }, s.prototype.pause = function(e) {
      return e === void 0 && (e = ws()), this._isPaused || !this._isPlaying ? this : (this._isPaused = !0, this._pauseStart = e, this._group && this._group.remove(this), this);
    }, s.prototype.resume = function(e) {
      return e === void 0 && (e = ws()), !this._isPaused || !this._isPlaying ? this : (this._isPaused = !1, this._startTime += e - this._pauseStart, this._pauseStart = 0, this._group && this._group.add(this), this);
    }, s.prototype.stopChainedTweens = function() {
      for (var e = 0, t = this._chainedTweens.length; e < t; e++)
        this._chainedTweens[e].stop();
      return this;
    }, s.prototype.group = function(e) {
      return e === void 0 && (e = pc), this._group = e, this;
    }, s.prototype.delay = function(e) {
      return e === void 0 && (e = 0), this._delayTime = e, this;
    }, s.prototype.repeat = function(e) {
      return e === void 0 && (e = 0), this._initialRepeat = e, this._repeat = e, this;
    }, s.prototype.repeatDelay = function(e) {
      return this._repeatDelayTime = e, this;
    }, s.prototype.yoyo = function(e) {
      return e === void 0 && (e = !1), this._yoyo = e, this;
    }, s.prototype.easing = function(e) {
      return e === void 0 && (e = _i.Linear.None), this._easingFunction = e, this;
    }, s.prototype.interpolation = function(e) {
      return e === void 0 && (e = dc.Linear), this._interpolationFunction = e, this;
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
      var n = this, i;
      if (e === void 0 && (e = ws()), t === void 0 && (t = !0), this._isPaused)
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
        if (n._duration === 0 || c > f)
          return 1;
        var b = Math.trunc(c / u), L = c - b * u, M = Math.min(L / n._duration, 1);
        return M === 0 && c === n._duration ? 1 : M;
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
          for (var x = 0, T = this._chainedTweens.length; x < T; x++)
            this._chainedTweens[x].start(this._startTime + this._duration, !1);
          return this._isPlaying = !1, !1;
        }
      return !0;
    }, s.prototype._updateProperties = function(e, t, n, i) {
      for (var o in n)
        if (t[o] !== void 0) {
          var l = t[o] || 0, c = n[o], u = Array.isArray(e[o]), f = Array.isArray(c), p = !u && f;
          p ? e[o] = this._interpolationFunction(c, i) : typeof c == "object" && c ? this._updateProperties(e[o], l, c, i) : (c = this._handleRelativeValue(l, c), typeof c == "number" && (e[o] = l + (c - l) * i));
        }
    }, s.prototype._handleRelativeValue = function(e, t) {
      return typeof t != "string" ? t : t.charAt(0) === "+" || t.charAt(0) === "-" ? e + parseFloat(t) : parseFloat(t);
    }, s.prototype._swapEndStartRepeatValues = function(e) {
      var t = this._valuesStartRepeat[e], n = this._valuesEnd[e];
      typeof n == "string" ? this._valuesStartRepeat[e] = this._valuesStartRepeat[e] + parseFloat(n) : this._valuesStartRepeat[e] = this._valuesEnd[e], this._valuesEnd[e] = t;
    }, s;
  })()
);
Gd.nextId;
var En = pc;
En.getAll.bind(En);
En.removeAll.bind(En);
En.add.bind(En);
En.remove.bind(En);
var Ux = En.update.bind(En);
function xc(s, e, t) {
  if (s == null || s === "")
    throw new Error(
      t || `Parameter "${e}" is required but received: ${s}`
    );
  return s;
}
function mc(s, e, t) {
  const n = e.split(".");
  let i = s;
  for (const o of n) {
    if (i[o] === void 0 || i[o] === null)
      throw new Error(
        `Property "${e}" is required but missing at path: "${o}"`
      );
    i = i[o];
  }
  return i;
}
function kx(s, e, t, n = 0, i = 1) {
  const o = (s - e) * (i - n) / (t - e) + n, l = Math.min(n, i), c = Math.max(n, i);
  return o < l ? l : o > c ? c : o || 0;
}
var zx = Object.defineProperty, Nx = (s, e, t) => e in s ? zx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Of = (s, e, t) => Nx(s, typeof e != "symbol" ? e + "" : e, t);
class Rf {
  constructor() {
    Of(this, "_dispatcher", new bd()), Of(this, "_listenerMap", /* @__PURE__ */ new Map());
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
    const n = (i) => t(i.data || i);
    return this._listenerMap.has(e) || this._listenerMap.set(e, /* @__PURE__ */ new Map()), this._listenerMap.get(e).set(t, n), this._dispatcher.addEventListener(e, n), this;
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
    const n = (i) => {
      this.off(e, n), t(i.data || i);
    };
    return this.on(e, n);
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
    const n = this._listenerMap.get(e);
    if (!n) return this;
    const i = n.get(t);
    return i && (this._dispatcher.removeEventListener(e, i), n.delete(t), n.size === 0 && this._listenerMap.delete(e)), this;
  }
  /**
   * Fire an event.
   * 触发事件
   * @param type Event type. 事件类型
   * @param data Event data to pass (optional). 要传递的事件数据（可选）
   * @returns Current instance (supports chaining). 当前实例（支持链式调用）
   * 
   * @example
   * event.fire('update', { time: Date.now() });
   */
  fire(e, t) {
    const n = { type: e, data: t };
    return this._dispatcher.dispatchEvent(n), this;
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
function $d(s, e) {
  return s.replace(/\{(\w+)\}/g, (t, n) => {
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      const i = e[n];
      return i !== void 0 ? String(i) : t;
    }
    throw new Error(`Missing required parameter for template interpolation: "${n}"`);
  });
}
function Nl(s, ...e) {
  return Object.assign(s, ...e);
}
function jd(s) {
  return s == null;
}
function as(s) {
  return typeof s == "function";
}
function Hx(s = /* @__PURE__ */ new Date()) {
  const e = (u) => u.toString().padStart(2, "0"), t = s.getFullYear(), n = e(s.getMonth() + 1), i = e(s.getDate()), o = e(s.getHours()), l = e(s.getMinutes()), c = e(s.getSeconds());
  return `${t}-${n}-${i} ${o}:${l}:${c}`;
}
var Vx = Object.defineProperty, Wx = (s, e, t) => e in s ? Vx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Hl = (s, e, t) => Wx(s, typeof e != "symbol" ? e + "" : e, t);
class Gx {
}
class ua extends Ti(
  ir(Gx)
) {
  constructor(e) {
    super(), Hl(this, "target"), Hl(this, "dom"), Hl(this, "_enabled", !1), this.target = e;
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
const Vl = Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]" && !process.versions.electron && !process.versions.nw && !process.versions["node-webkit"], Df = () => typeof window > "u" ? 1 : window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI || 1, $x = () => {
  if (Vl)
    return {
      IS_NODE: Vl,
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
  const s = navigator.userAgent.toLowerCase(), e = document.documentElement || { style: {} }, t = "ActiveXObject" in window, n = s.includes("webkit"), i = s.includes("phantom"), o = s.search("android [23]") !== -1, l = s.includes("chrome"), c = s.includes("gecko") && !n && !("opera" in window) && !t, u = /iphone/i.test(s) && /micromessenger/i.test(s), f = typeof orientation < "u" || s.includes("mobile"), p = !window.PointerEvent && "MSPointerEvent" in window, d = window.PointerEvent && navigator.pointerEnabled || p, g = t && "transition" in e.style, y = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !o, x = "MozPerspective" in e.style, T = "OTransition" in e.style, b = (g || y || x) && !T && !i, L = typeof window < "u" && as(window.createImageBitmap), M = typeof window < "u" && as(window.ResizeObserver), A = typeof window < "u" && as(window.btoa), R = typeof window < "u" && as(window.Proxy), k = typeof window < "u" && as(window.requestIdleCallback);
  let G = "0";
  if (l) {
    const q = s.match(/chrome\/([\d.]+)/);
    G = q ? q[1] : "0";
  }
  const V = !i && (d || "ontouchstart" in window || "DocumentTouch" in window && document instanceof window.DocumentTouch), F = typeof window < "u" && "WebGLRenderingContext" in window, $ = Df();
  let z = !1;
  try {
    new OffscreenCanvas(2, 2).getContext("2d"), z = !0;
  } catch {
    z = !1;
  }
  let U = !1;
  try {
    const q = Object.defineProperty({}, "passive", {
      get: () => (U = !0, !0)
    });
    window.addEventListener("testPassive", () => {
    }, q);
  } catch {
  }
  const X = {
    IS_NODE: Vl,
    isTest: !1,
    ie: t,
    ielt9: t && !document.addEventListener,
    edge: "msLaunchUri" in navigator && !("documentMode" in document),
    webkit: n,
    gecko: c,
    android: s.includes("android"),
    android23: o,
    chrome: l,
    chromeVersion: G,
    safari: !l && s.includes("safari"),
    phantomjs: i,
    ie3d: g,
    webkit3d: y,
    gecko3d: x,
    opera12: T,
    any3d: b,
    iosWeixin: u,
    mobile: f,
    mobileWebkit: f && n,
    mobileWebkit3d: f && y,
    mobileOpera: f && "opera" in window,
    mobileGecko: f && c,
    touch: !!V,
    msPointer: !!p,
    pointer: !!d,
    retina: $ > 1,
    devicePixelRatio: $,
    // @ts-ignore
    language: navigator.browserLanguage || navigator.language,
    // @ts-ignore
    ie9: t && document.documentMode === 9,
    // @ts-ignore
    ie10: t && document.documentMode === 10,
    webgl: F,
    imageBitMap: L,
    resizeObserver: M,
    btoa: A,
    decodeImageInWorker: z,
    monitorDPRChange: !0,
    supportsPassive: U,
    proxy: R,
    requestIdleCallback: k,
    checkDevicePixelRatio: () => {
      if (typeof window < "u" && X.monitorDPRChange) {
        const q = Df(), Z = q !== X.devicePixelRatio;
        return Z && (X.devicePixelRatio = q), Z;
      }
      return !1;
    }
  };
  return X;
}, jx = $x();
var Xx = Object.defineProperty, Yx = (s, e, t) => e in s ? Xx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, mi = (s, e, t) => Yx(s, typeof e != "symbol" ? e + "" : e, t);
function Ti(s) {
  return class extends s {
    constructor(...e) {
      super(...e), mi(this, "eventClass", new Rf()), mi(this, "on", this.eventClass.on.bind(this.eventClass)), mi(this, "fire", this.eventClass.fire.bind(this.eventClass)), mi(this, "off", this.eventClass.off.bind(this.eventClass)), this.eventClass = new Rf();
    }
  };
}
function ir(s) {
  return class extends s {
    constructor(...e) {
      super(...e), mi(this, "options"), mi(this, "_isUpdatingOptions"), mi(this, "_initHooksCalled"), mi(this, "_initHooks");
      const t = Object.getPrototypeOf(this).options || {}, n = Nl({}, t, e[0] || {});
      this.setOptions(n), this._callInitHooks(), this._isUpdatingOptions = !1;
    }
    _proxyOptions() {
      return jx.proxy ? (this.options = new Proxy(this.options, {
        set: (e, t, n) => {
          if (t = t, e[t] === n || (e[t] = n, this._isUpdatingOptions))
            return !0;
          const i = {};
          return i[t] = n, this.configure(i), !0;
        }
      }), this) : this;
    }
    _callInitHooks() {
      const e = Object.getPrototypeOf(this);
      return this._visitInitHooks(e), this;
    }
    setOptions(e) {
      if ((!this.hasOwnProperty("options") || jd(this.options)) && (this.options = this.options ? Object.create(this.options) : {}), !e)
        return this;
      for (const t in e)
        this.options[t] = e[t];
      return this;
    }
    configure(e, t) {
      if (this._isUpdatingOptions = !0, e) {
        if (arguments.length === 2 && typeof e == "string") {
          const n = {};
          n[e] = t, e = n;
        }
        e = e;
        for (const n in e)
          this.options[n] = e[n], this[n] && this[n] instanceof ua && (e[n] ? this[n].enable() : this[n].disable());
        this.onOptionsChange(e), this._isUpdatingOptions = !1;
      } else {
        const n = {};
        for (const i in this.options)
          this.options.hasOwnProperty(i) && (n[i] = this.options[i]);
        return this._isUpdatingOptions = !1, n;
      }
      return this;
    }
    onOptionsChange(e) {
    }
    _visitInitHooks(e) {
      if (this._initHooksCalled)
        return;
      const t = Object.getPrototypeOf(e);
      t._visitInitHooks && t._visitInitHooks.call(this, t), this._initHooksCalled = !0;
      const n = e._initHooks;
      if (n && n !== t._initHooks)
        for (let i = 0; i < n.length; i++)
          n[i].call(this);
    }
    /**
     * 合并类选项（静态方法）
     * @param options 要合并的选项
     * @returns 类本身（支持链式调用）
     */
    static mergeOptions(e) {
      const t = this.prototype, n = Object.getPrototypeOf(t);
      return t.hasOwnProperty("options") ? t.options === n.options && (t.options = Object.create(t.options)) : t.options = {}, Nl(t.options, e), this;
    }
    static addInitHook(e, ...t) {
      const n = typeof e == "function" ? e : function() {
        this[e].apply(this, t);
      }, i = this.prototype, o = Object.getPrototypeOf(i);
      return (!i._initHooks || i._initHooks === o._initHooks) && (i._initHooks = []), i._initHooks.push(n), this;
    }
    static include(...e) {
      for (let t = 0; t < e.length; t++)
        Nl(this.prototype, e[t]);
      return this;
    }
  };
}
var Zx = Object.defineProperty, qx = (s, e, t) => e in s ? Zx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ke = (s, e, t) => qx(s, typeof e != "symbol" ? e + "" : e, t);
const Kx = Ti(ir(bd));
class Qx extends Kx {
  /**
   * 构造函数
   * @param container 容器元素或选择器字符串
   * @param options 配置选项
   */
  constructor(e, t = {}) {
    super(), ke(this, "scene"), ke(this, "renderer"), ke(this, "camera"), ke(this, "controls"), ke(this, "ambLight"), ke(this, "dirLight"), ke(this, "clouds", null), ke(this, "container"), ke(this, "_clock", new ia()), ke(this, "stats"), ke(this, "_animationCallbacks", /* @__PURE__ */ new Set()), ke(this, "_fogFactor", 1), ke(this, "_sceneSize", 5e4 * 2), ke(this, "_defaultGround"), ke(this, "map"), ke(this, "centerWorldPos"), ke(this, "_isInteracting", !1), ke(this, "debug", !1), ke(this, "flyTween", null), ke(this, "composer"), ke(this, "renderPass"), ke(this, "bloomPass"), ke(this, "calculateCameraPosition", (y, x, T, b) => {
      const L = new D(
        0,
        // X component
        x * Math.cos(T),
        // Y component
        x * Math.sin(T)
        // Z component
      );
      return L.applyAxisAngle(new D(0, 1, 0), b), new D(
        y.x + L.x,
        y.y + L.y,
        y.z + L.z
      );
    }), this.setOptions(t);
    const {
      antialias: n = !1,
      stencil: i = !0,
      logarithmicDepthBuffer: o = !0,
      skybox: l,
      map: c,
      bloom: u,
      minDistance: f,
      maxDistance: p,
      draggable: d = !0,
      defaultGround: g
    } = t;
    if (this.map = c, this.centerWorldPos = this.map.lngLatToWorld(
      new D(this.map.center[0], this.map.center[1], 0)
    ), this.renderer = this._createRenderer(
      n,
      i,
      o
    ), this.scene = this._createScene(l), this.camera = this._createCamera(), e && this.addTo(e), this.controls = this._createControls(f, p), this.controls.enabled = d !== !1, this.ambLight = this._createAmbLight(), this.scene.add(this.ambLight), this.dirLight = this._createDirLight(), this.scene.add(this.dirLight), this.scene.add(this.dirLight.target), this._defaultGround = this._createDefaultGround(g), g?.enabled && this.scene.add(this._defaultGround), u && u.enabled) {
      const y = this.renderer.getPixelRatio(), x = this.container ? this.width : window.innerWidth, T = this.container ? this.height : window.innerHeight, b = x * y, L = T * y, M = new Cr(b, L, {
        format: ud
      });
      M.samples = 4, this.composer = new M1(this.renderer, M), this.renderPass = new L1(this.scene, this.camera), this.composer.addPass(this.renderPass);
      const A = u?.strength ?? 1.5, R = u?.radius ?? 1, k = u?.threshold ?? 0.7;
      this.bloomPass = new v1(
        new ce(b, L),
        A,
        R,
        k
      ), this.composer.addPass(this.bloomPass);
    }
    this.renderer.setAnimationLoop(this.animate.bind(this)), this.debug = t.debug || !1, this.flyTween = null, this.debug && (this.stats = new Ps(), document.body.appendChild(this.stats.dom));
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
   * Create scene
   * 创建场景
   * @param skyboxConfig Skybox configuration 天空盒配置
   * @returns Scene object 场景对象
   */
  _createScene(e) {
    const t = new fb(), n = e?.defaultColor || "rgb(21,48,94)";
    if (t.background = new oe(n), t.fog = new lf(n, 2e-4), e?.files) {
      const i = new db();
      e.path && i.setPath(e.path), i.load(
        e.files,
        (o) => {
          t.background = o;
        },
        void 0,
        (o) => {
          console.error("Error loading skybox:", o), t.background = new oe(n);
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
        const i = await new Cx().setPath(t.path || "").setDataType(Ko).loadAsync(t.hdr);
        i.colorSpace = this.renderer.outputColorSpace, i.mapping = 303, i.needsUpdate = !0, this.scene.environment = i, this.scene.background = i, this.scene.backgroundIntensity = 1.1;
      }
    } catch (n) {
      console.error("加载HDR失败:", n), e.background = new oe(t?.defaultColor || 14414079);
    }
  }
  /**
   * 创建WebGL渲染器
   * @param antialias 是否抗锯齿
   * @param stencil 是否使用模板缓冲区
   * @param logarithmicDepthBuffer 是否使用对数深度缓冲区
   * @returns 渲染器对象
   */
  _createRenderer(e, t, n) {
    const i = new pb({
      antialias: e,
      logarithmicDepthBuffer: n,
      stencil: t,
      alpha: !0,
      precision: "highp",
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: !0
    });
    return i.debug.checkShaderErrors = !0, i.sortObjects = !0, i.setPixelRatio(window.devicePixelRatio), i.domElement.tabIndex = 0, i.shadowMap.enabled = !0, i.shadowMap.needsUpdate = !0, i.shadowMap.type = mb, i.toneMapping = gb, i.toneMappingExposure = 1, i.outputColorSpace = oa, i;
  }
  /**
   * Create camera
   * 创建相机
   * @returns Camera object 相机对象
   */
  _createCamera() {
    return new Qi(
      45,
      this.getAspect(),
      0.1,
      this._sceneSize * 2
    );
  }
  /**
   * Create map controls
   * 创建地图控制器
   * @param minDistance Minimum zoom distance 最小缩放距离
   * @param maxDistance Maximum zoom distance 最大缩放距离
   * @returns Controls object 控制器对象
   */
  _createControls(e, t) {
    const n = new h1(this.camera, this.renderer.domElement), i = Math.PI / 2.1;
    return n.screenSpacePanning = !1, n.minDistance = e ?? 0.1, n.maxDistance = t ?? 6e4, n.maxPolarAngle = i, n.enableDamping = !0, n.dampingFactor = 0.08, n.keyPanSpeed = 1, n.listenToKeyEvents(this.renderer.domElement), n.addEventListener("change", () => {
      const o = Math.max(n.getPolarAngle(), 0.1), l = Math.max(n.getDistance(), 100);
      n.zoomSpeed = Math.max(Math.log(l / 1e3), 1) + 3;
      const c = 3e5 * 2;
      n.maxDistance > c * 0.95 && (n.maxDistance = c * 0.95), this.camera.far = lt.clamp(l / o * 8, 100, c), this.camera.near = lt.clamp(this.camera.far / 1e3, 1e-3, 1), this.camera.updateProjectionMatrix(), this.scene.fog instanceof lf && (this.scene.fog.density = o / (l + 5) * this.fogFactor * 0.1);
      const f = l > 6e4;
      n.minAzimuthAngle = f ? 0 : -1 / 0, n.maxAzimuthAngle = f ? 0 : 1 / 0, n.maxPolarAngle = kx(
        n.getDistance(),
        0,
        7e4,
        i,
        0
      ), this.map?.fire("viewchange", {
        type: "control-change",
        control: n,
        camera: this.camera,
        target: this.map
      });
    }), n.addEventListener("start", () => {
      this._isInteracting = !0, this.map?.fire("movestart", {
        type: "control-start",
        control: n,
        camera: this.camera,
        target: this.map
      });
    }), n.addEventListener("end", () => {
      this._isInteracting = !1, this.map?.fire("moveend", {
        type: "control-end",
        control: n,
        camera: this.camera,
        target: this.map
      });
    }), n;
  }
  /**
   * Create ambient light
   * 创建环境光
   * @returns Ambient light object 环境光对象
   */
  _createAmbLight() {
    return new wd(16777215, 2);
  }
  /**
   * 创建平行光
   * @returns 平行光对象
   */
  _createDirLight() {
    const d = new ta("rgba(248, 167, 16, 1)", 10);
    d.position.set(
      this.centerWorldPos.x + 55e3 * 1.2,
      55e3 * 2,
      this.centerWorldPos.z + 55e3 * 1
    );
    const g = new gn();
    if (g.position.copy(this.centerWorldPos), this.scene.add(g), d.target = g, d.castShadow = !0, d.shadow.mapSize.width = 1024 * 10, d.shadow.mapSize.height = 1024 * 10, d.shadow.camera.near = 1, d.shadow.camera.far = 192500, d.shadow.camera.left = -55e3, d.shadow.camera.bottom = -55e3, d.shadow.camera.top = 55e3, d.shadow.camera.right = 55e3, d.shadow.radius = 1, d.shadow.bias = -0, this.debug) {
      const y = new _b(d.shadow.camera);
      y.name = "dirLightCameraHelper", this.scene.add(y);
    }
    return d;
  }
  /**
   * 创建三个辅助平行光 (后补光、左侧光、右侧光)，指向场景中心。
   * @returns 返回后补光实例 (匹配 this.auxDirLight 属性)
   * @internal Reserved for future use
   */
  // @ts-ignore - Reserved method for auxiliary light creation
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
  _createAuxLightInstance(e, t, n, i) {
    const o = new ta(16777215, i);
    o.position.set(e, t, n);
    const l = new gn();
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
      const n = this.renderer.getPixelRatio();
      this.composer.setSize(e * n, t * n), this.composer.render();
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
    this._animationCallbacks.forEach((n) => n(e, t, this)), this.controls.update(), this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera), Ux(), this.stats && this.stats.update(), this.fire("update", { delta: e });
  }
  /**
   * Fly to specified position
   * 飞行到指定位置
   * @param centerWorldPos Map center target position (world coordinates) 地图中心目标位置（世界坐标）
   * @param cameraWorldPos Camera target position (world coordinates) 相机目标位置（世界坐标）
   * @param animate Whether to enable animation 是否启用动画
   * @param onComplete Completion callback 完成回调
   */
  flyTo(e, t, n = !0, i) {
    if (this.controls.target.copy(e), n) {
      const o = this.camera.position;
      new Uo(o).to({ y: 2e7, z: 0 }, 500).chain(
        new Uo(o).to(t, 2e3).easing(_i.Quintic.Out).onComplete((l) => i && i(l))
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
    const t = this.camera, n = this.controls, i = e.center, o = e.cameraCoord, l = e.duration ?? 2e3, c = e.delay ?? 0, u = e.complete, f = !!e.curvePath;
    if (!i || !o) return;
    const p = this.map.lngLatToWorld(
      new D(i[0], i[1], 0)
    ), d = this.map.lngLatToWorld(
      new D(o[0], o[1], o[2])
    );
    if (!t || !n || !p || !d) return;
    const g = n.target.clone(), y = t.position.clone(), x = new D(
      p.x,
      p.y,
      p.z
    ), T = new D(
      d.x,
      d.y,
      d.z
    );
    if (this.flyTween && (this.flyTween.stop(), this.flyTween = null), f) {
      const b = [
        y,
        y.clone().lerp(T, 0.33),
        y.clone().lerp(T, 0.67),
        T
      ], L = new yb(...b), M = {
        t: 0,
        x: g.x,
        y: g.y,
        z: g.z
      };
      this.flyTween = new Uo(M).to(
        {
          t: 1,
          x: x.x,
          y: x.y,
          z: x.z
        },
        l
      ).easing(_i.Quadratic.InOut).onUpdate(() => {
        const A = L.getPoint(M.t), R = new D(M.x, M.y, M.z);
        t.position.copy(A), t.lookAt(R), t.updateProjectionMatrix(), n.target.copy(R), n.update();
      });
    } else {
      const b = {
        tx: g.x,
        ty: g.y,
        tz: g.z,
        px: y.x,
        py: y.y,
        pz: y.z
      };
      this.flyTween = new Uo(b).to(
        {
          tx: x.x,
          ty: x.y,
          tz: x.z,
          px: T.x,
          py: T.y,
          pz: T.z
        },
        l
      ).easing(_i.Quadratic.InOut).onUpdate(() => {
        const L = new D(b.tx, b.ty, b.tz), M = new D(
          b.px,
          b.py,
          b.pz
        );
        t.position.copy(M), t.lookAt(L), n.target.copy(L), n.update();
      });
    }
    this.flyTween && (this.flyTween.onComplete(() => {
      this.flyTween && (this.flyTween.stop(), this.flyTween = null), u && u();
    }), c > 0 ? setTimeout(() => {
      this.flyTween && this.flyTween.start();
    }, c) : this.flyTween.start());
  }
  /**
   * Options change callback.
   * 配置更新回调
   * Triggered when sceneRenderer.configure() is called to update options.
   * 当调用 sceneRenderer.configure() 更新配置时，会触发此方法
   */
  onOptionsChange(e) {
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
  easeTo(e) {
    const { controls: t } = this, n = e.center, i = e.duration ?? 2e3, o = typeof e.distance == "number" ? e.distance : typeof e.altitude == "number" ? e.altitude : t.getDistance(), l = (x) => x * Math.PI / 180;
    let c;
    if (typeof e.pitch == "number") {
      const x = e.pitch <= 0 ? 0.1 : e.pitch;
      c = l(x);
    } else
      c = t.getPolarAngle();
    const u = typeof e.bearing == "number" ? l(e.bearing) : t.getAzimuthalAngle(), f = e.complete, p = !!e.curvePath, d = this.map.lngLatToWorld(
      new D(n[0], n[1], 0)
    ), g = this.calculateCameraPosition(
      d,
      o,
      c,
      u
    ), y = this.map.worldToLngLat(g);
    this.flyToAdvanced({
      center: [n[0], n[1], 0],
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
  /**
   * Create the default ground plane.
   * 创建默认地面平面
   *
   * @description
   * Creates a large ground plane mesh that serves as a visual base when no tile layers are present.
   * The ground is positioned at y=0 and centered at the map center.
   * 创建一个大型地面网格，当没有瓦片图层时作为视觉基底。
   * 地面位于 y=0 并以地图中心为中心。
   *
   * @param config Ground configuration 地面配置
   * @returns Ground mesh. 地面网格
   * @internal
   */
  _createDefaultGround(e) {
    const t = this.centerWorldPos, n = e?.color ?? "rgb(45,52,60)", i = e?.opacity ?? 1, o = e?.visible ?? !1, l = new Ds({
      transparent: i < 1,
      opacity: i,
      color: new oe(n),
      metalness: 0.2,
      roughness: 1,
      polygonOffset: !0,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    }), c = new Fr(
      this._sceneSize * 2,
      this._sceneSize * 2
    ), u = new Be(c, l);
    return u.name = "DefaultGround", u.castShadow = !1, u.receiveShadow = !0, u.position.y = -0.1, u.position.add(t), u.rotateX(-Math.PI / 2), u.visible = o, u;
  }
  /**
   * Show the default ground plane.
   * 显示默认地面平面
   * 
   * @description
   * Makes the default ground plane visible. This is typically called automatically
   * when no tile layers are present in the map.
   * 使默认地面平面可见。通常在地图中没有瓦片图层时自动调用。
   */
  showDefaultGround() {
    this._defaultGround && (this._defaultGround.visible = !0);
  }
  /**
   * Update the default ground plane position.
   * 更新默认地面平面位置
   * 
   * @description
   * Recalculates and updates the ground plane position based on current map center.
   * This should be called after the map's root group transformation is finalized.
   * 根据当前地图中心重新计算并更新地面位置。
   * 应在地图根组变换完成后调用。
   * 
   * @internal
   */
  _updateDefaultGroundPosition() {
    if (!this._defaultGround || !this.map)
      return;
    const e = this.map.lngLatToWorld(
      new D(this.map.center[0], this.map.center[1], 0)
    );
    this.centerWorldPos = e, this._defaultGround.position.copy(e), this._defaultGround.position.y -= 0.1;
  }
  /**
   * Hide the default ground plane.
   * 隐藏默认地面平面
   * 
   * @description
   * Hides the default ground plane. This is typically called automatically
   * when tile layers are added to the map.
   * 隐藏默认地面平面。通常在向地图添加瓦片图层时自动调用。
   */
  hideDefaultGround() {
    this._defaultGround && (this._defaultGround.visible = !1);
  }
  /**
   * Check if the default ground plane is visible.
   * 检查默认地面平面是否可见
   * 
   * @returns Whether the ground is visible. 地面是否可见
   */
  isDefaultGroundVisible() {
    return this._defaultGround?.visible ?? !1;
  }
  /**
   * Set the default ground plane visibility.
   * 设置默认地面平面可见性
   *
   * @param visible Whether the ground is visible. 地面是否可见
   */
  setDefaultGroundVisible(e) {
    this._defaultGround && (this._defaultGround.visible = e);
  }
  /**
   * Set the default ground plane style.
   * 设置默认地面平面样式
   *
   * @param style Style properties. 样式属性
   */
  setDefaultGroundStyle(e) {
    if (!this._defaultGround) return;
    const t = this._defaultGround.material;
    e.color !== void 0 && t.color.set(e.color), e.opacity !== void 0 && (t.opacity = e.opacity, t.transparent = e.opacity < 1);
  }
  /**
   * 销毁sceneRenderer实例，释放所有资源
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
      console.error("❌ 销毁SceneRenderer时出错:", e);
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
    ].forEach((n) => {
      e[n] && e[n].dispose();
    }), e.dispose();
  }
}
var Jx = Object.defineProperty, eT = (s, e, t) => e in s ? Jx(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, tT = (s, e, t) => eT(s, e + "", t);
function Tc(s) {
  return class extends s {
    constructor(...t) {
      super(...t), tT(this, "_handlers"), this._handlers = [];
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
    addHandler(t, n) {
      if (!n)
        return this;
      if (this._handlers || (this._handlers = []), this[t])
        return this[t].enable(), this;
      const i = this[t] = new n(this);
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
      const n = this[t];
      if (n && this._handlers) {
        const i = this._handlers.indexOf(n);
        i >= 0 && this._handlers.splice(i, 1), this[t].remove(), delete this[t];
      }
      return this;
    }
    //@internal
    _clearHandlers() {
      if (this._handlers) {
        for (let t = 0, n = this._handlers.length; t < n; t++)
          this._handlers[t].remove();
        this._handlers = [];
      }
    }
  };
}
var nT = Object.defineProperty, iT = (s, e, t) => e in s ? nT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Wi = (s, e, t) => iT(s, typeof e != "symbol" ? e + "" : e, t);
const rT = {
  attribution: "",
  visible: !0,
  opacity: 1,
  zIndex: 0,
  isSceneLayer: !1,
  altitude: 0
  // Default altitude is 0 默认高度为0
};
class ha extends Tc(Ti(
  ir(Qt)
)) {
  /**
   * Create a layer instance.
   * 创建图层实例
   * @param layerId - Layer ID. 图层ID
   * @param config - Layer configuration. 图层配置
   * @throws Throws error if id is not provided. 如果未提供id会抛出错误
   */
  constructor(e, t) {
    super(), Wi(this, "_layerId"), Wi(this, "opacity", 1), Wi(this, "_animCallbacks", /* @__PURE__ */ new Set()), Wi(this, "isSceneLayer", !1), Wi(this, "_baseAltitude", 0), Wi(this, "depthOffset"), Wi(this, "_regionConfigs", []), xc(e, "id", "Layer ID must be specified 图层ID必须指定"), t && (this.setOptions(t), this.opacity = t.opacity || 1, this.isSceneLayer = t.isSceneLayer ?? !1, t.altitude !== void 0 && this.setAltitude(t.altitude)), this._layerId = e, typeof this.animate == "function" && this._registerAnimate();
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
      }), t instanceof nr && (t.material.opacity = e, t.material.transparent = e < 1, t.material.needsUpdate = !0);
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
    if (!e?.sceneRenderer) return;
    const t = e.sceneRenderer.addAnimationCallback((n, i, o) => {
      this.animate?.(n, i, o);
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
    const t = e.id ?? this._generateRegionOverlayId(), n = {
      id: t,
      color: e.color ?? "#00FF88",
      opacity: e.opacity ?? 0.3,
      mode: e.mode ?? "overlay",
      zIndex: e.zIndex ?? 0,
      geometry: e.geometry,
      feature: e.feature
    };
    return this._regionConfigs.push(n), t;
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
ha.mergeOptions(rT);
const et = [];
for (let s = 0; s < 256; ++s)
  et.push((s + 256).toString(16).slice(1));
function sT(s, e = 0) {
  return (et[s[e + 0]] + et[s[e + 1]] + et[s[e + 2]] + et[s[e + 3]] + "-" + et[s[e + 4]] + et[s[e + 5]] + "-" + et[s[e + 6]] + et[s[e + 7]] + "-" + et[s[e + 8]] + et[s[e + 9]] + "-" + et[s[e + 10]] + et[s[e + 11]] + et[s[e + 12]] + et[s[e + 13]] + et[s[e + 14]] + et[s[e + 15]]).toLowerCase();
}
let Wl;
const oT = new Uint8Array(16);
function aT() {
  if (!Wl) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    Wl = crypto.getRandomValues.bind(crypto);
  }
  return Wl(oT);
}
const lT = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), If = { randomUUID: lT };
function cT(s, e, t) {
  s = s || {};
  const n = s.random ?? s.rng?.() ?? aT();
  if (n.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, sT(n);
}
function uT(s, e, t) {
  return If.randomUUID && !s ? If.randomUUID() : cT(s);
}
var Xd = /* @__PURE__ */ ((s) => (s.POINT = "point", s.LINE_VERTEX = "line_vertex", s.POLYGON_CENTER = "polygon_center", s.LABEL = "label", s.ICON = "icon", s.CLUSTER = "cluster", s))(Xd || {}), Ln = /* @__PURE__ */ ((s) => (s.NO_COLLISION = "no_collision", s.PRIORITY_LOST = "priority_lost", s.OUT_OF_VIEWPORT = "out_of_viewport", s.ZOOM_FILTERED = "zoom_filtered", s.MANUAL_HIDDEN = "manual_hidden", s.GROUP_COLLISION = "group_collision", s))(Ln || {}), hT = Object.defineProperty, fT = (s, e, t) => e in s ? hT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ls = (s, e, t) => fT(s, typeof e != "symbol" ? e + "" : e, t);
class dT extends ua {
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
    !t || !this.target.options.draggable || (this._isDragging = !0, this._lastCoord = e.coordinate, t.sceneRenderer.configure("draggable", !1), t.on("mousemove", this._boundOnMouseMove), t.on("mouseup", this._boundOnMouseUp), this.target.fire("dragstart", e));
  }
  _onMouseMove(e) {
    if (!this._isDragging || !this._lastCoord || !e.coordinate) return;
    const t = e.coordinate, n = t[0] - this._lastCoord[0], i = t[1] - this._lastCoord[1];
    Math.abs(n) < 1e-8 && Math.abs(i) < 1e-8 || (this._translate(n, i), this._lastCoord = t, this.target.fire("dragging", e));
  }
  _onMouseUp(e) {
    this._stopDrag(), this.target.fire("dragend", e);
  }
  /**
   * Stop dragging
   * 停止拖拽
   */
  _stopDrag() {
    this._isDragging = !1;
    const e = this.target.getMap();
    e && (e.sceneRenderer.configure("draggable", !0), e.off("mousemove", this._boundOnMouseMove), e.off("mouseup", this._boundOnMouseUp));
  }
  /**
   * Translate feature coordinates
   * 平移要素坐标
   * @param dx Longitude offset 经度偏移量
   * @param dy Latitude offset 纬度偏移量
   */
  _translate(e, t) {
    const n = this.target._geometry;
    if (!n || !n.coordinates) return;
    const i = (l) => Array.isArray(l[0]) ? l.map(i) : [l[0] + e, l[1] + t], o = i(n.coordinates);
    n.coordinates = o, this.target._applyCoordinateChanges(!0);
  }
}
var pT = Object.defineProperty, mT = (s, e, t) => e in s ? pT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, bs = (s, e, t) => mT(s, typeof e != "symbol" ? e + "" : e, t);
const Yd = class Zd {
  constructor(e) {
    bs(this, "cache", /* @__PURE__ */ new Map()), bs(this, "gltfLoader"), bs(this, "fbxLoader"), bs(this, "dracoLoader"), this.gltfLoader = new C1(e), this.fbxLoader = new yx(e);
  }
  /**
   * 获取单例实例
   * @param manager 
   */
  static getInstance(e) {
    return this.instance || (this.instance = new Zd(e)), this.instance;
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
    e.type === "model-gltf" && e.dracoOptions?.enable && this.ensureDracoLoader(e.dracoOptions.decoderPath);
    let n, i;
    try {
      if (e.type === "model-gltf") {
        const o = await this.gltfLoader.loadAsync(e.url);
        n = o.scene, i = o.animations;
      } else
        n = await this.fbxLoader.loadAsync(e.url), i = n.animations;
      return this.cache.set(t, { model: n, animations: i }), {
        model: this.processModel(n.clone(), e),
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
    this.dracoLoader || (this.dracoLoader = new Ox(), this.dracoLoader.setDecoderPath(e), this.gltfLoader.setDRACOLoader(this.dracoLoader));
  }
  /**
   * 克隆缓存的模型
   * @param cacheKey 
   * @param options 
   */
  cloneCachedModel(e, t) {
    const n = this.cache.get(e), i = n.model.clone();
    return {
      model: this.processModel(i, t),
      animations: this.processAnimations(n.animations)
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
        const { x: n, y: i, z: o } = t.scale;
        n !== void 0 && (e.scale.x = n), i !== void 0 && (e.scale.y = i), o !== void 0 && (e.scale.z = o);
      }
    return t.rotation && e.rotation.setFromVector3(t.rotation), e;
  }
};
bs(Yd, "instance");
let qd = Yd;
const Gl = (s, e) => {
  "updateRanges" in s ? s.updateRanges[0] = e : s.updateRange = e;
}, Ff = /* @__PURE__ */ new be(), ko = /* @__PURE__ */ new D(), zo = /* @__PURE__ */ new mn(), Bf = /* @__PURE__ */ new D(), Uf = /* @__PURE__ */ new mn(), cs = /* @__PURE__ */ new D(), gT = (s) => class extends s {
  constructor() {
    super();
    const e = parseInt(ad.replace(/\D+/g, "")) >= 154 ? "opaque_fragment" : "output_fragment";
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
class _T extends Qt {
  constructor({
    limit: e = 200,
    range: t,
    material: n = vd,
    texture: i,
    frustumCulled: o = !0
  } = {}) {
    super(), this.name = "Clouds", this.ref = this;
    const l = this, c = new Fr(1, 1), u = new Float32Array(Array.from({
      length: e
    }, () => 1)), f = new Float32Array(Array.from({
      length: e
    }, () => [1, 1, 1]).flat()), p = new ec(u, 1);
    p.setUsage(cf), c.setAttribute("cloudOpacity", p);
    const d = gT(n), g = new d();
    g.map = i, g.transparent = !0, g.depthWrite = !1, g.needsUpdate = !0, this.cloudMaterial = g, this.instance = new vc(c, g, e);
    const y = this.instance;
    y.matrixAutoUpdate = !1, y.frustumCulled = o, y.instanceColor = new ec(f, 3), y.instanceColor.setUsage(cf), l.add(y);
    const x = [], T = () => {
      const V = x.length;
      let F = 0;
      for (let $ = 0; $ < this.ref.children.length; $++) {
        const z = this.ref.children[$];
        z.cloudStateArray && (F += z.cloudStateArray.length);
      }
      if (V === F)
        return x;
      x.length = 0;
      for (let $ = 0; $ < this.ref.children.length; $++) {
        const z = this.ref.children[$];
        z.cloudStateArray && x.push(...z.cloudStateArray);
      }
      return b(), x;
    }, b = () => {
      const V = Math.min(e, t !== void 0 ? t : e, x.length);
      y.count = V, Gl(y.instanceMatrix, {
        offset: 0,
        count: V * 16
      }), y.instanceColor && Gl(y.instanceColor, {
        offset: 0,
        count: V * 3
      }), Gl(y.geometry.attributes.cloudOpacity, {
        offset: 0,
        count: V
      });
    };
    let L = 0, M = 0, A;
    const R = new mn(), k = new D(0, 0, 1), G = new D();
    this.update = (V, F, $) => {
      L = F, Ff.copy(y.matrixWorld).invert(), V.matrixWorld.decompose(Bf, Uf, cs);
      const z = T();
      for (M = 0; M < z.length; M++)
        A = z[M], A.ref.matrixWorld.decompose(ko, zo, cs), ko.add(G.copy(A.position).applyQuaternion(zo).multiply(cs)), zo.copy(Uf).multiply(R.setFromAxisAngle(k, A.rotation += $ * A.rotationFactor)), cs.multiplyScalar(A.volume + (1 + Math.sin(L * A.density * A.speed)) / 2 * A.growth), A.matrix.compose(ko, zo, cs).premultiply(Ff), A.dist = ko.distanceTo(Bf);
      for (z.sort((U, X) => X.dist - U.dist), M = 0; M < z.length; M++)
        A = z[M], u[M] = A.opacity * (A.dist < A.fade - 1 ? A.dist / A.fade : 1), y.setMatrixAt(M, A.matrix), y.setColorAt(M, A.color);
      y.geometry.attributes.cloudOpacity.needsUpdate = !0, y.instanceMatrix.needsUpdate = !0, y.instanceColor && (y.instanceColor.needsUpdate = !0);
    };
  }
}
let yT = 0;
class vT extends Qt {
  constructor({
    opacity: e = 1,
    speed: t = 0,
    bounds: n = new D().fromArray([5, 1, 1]),
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
    super(), this.name = "cloud_" + yT++, this.seed = g, this.segments = i, this.bounds = n, this.concentrate = d, this.volume = c, this.smallestVolume = u, this.distribute = f, this.growth = p, this.speed = t, this.fade = l, this.opacity = e, this.color = o, this.ref = this, this.cloudStateArray = [], this.updateCloud();
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
      for (let n = this.cloudStateArray.length; n < e; n++)
        this.cloudStateArray.push({
          segments: e,
          bounds: new D(1, 1, 1),
          position: new D(),
          uuid: t,
          index: n,
          ref: this,
          dist: 0,
          matrix: new be(),
          volume: 0,
          length: 0,
          speed: 0,
          growth: 0,
          opacity: 1,
          fade: 0,
          density: 0,
          rotation: n * (Math.PI / e),
          rotationFactor: 0,
          // Add rotationFactor property
          color: new oe()
        });
  }
  updateCloud() {
    const {
      volume: e,
      color: t,
      speed: n,
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
    let x = 0;
    function T() {
      const b = Math.sin(u + x) * 1e4;
      return x++, b - Math.floor(b);
    }
    f.forEach((b, L) => {
      b.segments = d, b.volume = e, b.color = t, b.speed = n, b.growth = i, b.opacity = o, b.fade = l, b.bounds.copy(c), b.density = Math.max(0.5, T()), b.rotationFactor = Math.max(0.2, 0.5 * T()) * n;
      const M = p?.(b, L);
      if (M || d > 1) {
        var A;
        b.position.copy(b.bounds).multiply((A = M?.point) !== null && A !== void 0 ? A : {
          x: T() * 2 - 1,
          y: T() * 2 - 1,
          z: T() * 2 - 1
        });
      }
      const R = Math.abs(b.position.x), k = Math.abs(b.position.y), G = Math.abs(b.position.z), V = Math.max(R, k, G);
      b.length = 1, R === V && (b.length -= R / b.bounds.x), k === V && (b.length -= k / b.bounds.y), G === V && (b.length -= G / b.bounds.z), b.volume = (M?.volume !== void 0 ? M.volume : Math.max(Math.max(0, y), g === "random" ? T() : g === "inside" ? b.length : 1 - b.length)) * e;
    });
  }
}
class Sc {
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
    const n = this.workersResolve[e];
    if (n && n(t), this.queue.length) {
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
    return new Promise((n) => {
      const i = this._getIdleWorker();
      i !== -1 ? (this._initWorker(i), this.workerStatus |= 1 << i, this.workersResolve[i] = n, this.workers[i].postMessage(e, t)) : this.queue.push({ resolve: n, msg: e, transfer: t });
    });
  }
  dispose() {
    this.workers.forEach((e) => e.terminate()), this.workersResolve.length = 0, this.workers.length = 0, this.queue.length = 0, this.workerStatus = 0;
  }
}
function Kd(s, e) {
  const t = new Kt();
  t.setAttribute("position", new mt(new Float32Array([0, 0, 0]), 3));
  const n = s.sizeAttenuation ?? !0, i = n ? s.size * 2e-3 : s.size, o = new sa({
    size: i,
    color: s.color || 16777215,
    sizeAttenuation: n,
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
  const l = new zr(t, o);
  return l.position.copy(e), l;
}
async function wT(s, e) {
  let t = null;
  try {
    t = await Jt._loadTexture(s.url), t.magFilter = vi, t.minFilter = Rs, t.colorSpace = oa, t.generateMipmaps = !0, t.premultiplyAlpha = !1, t.needsUpdate = !0;
  } catch (f) {
    console.error("IconPoint texture load failed:", s.url, f);
  }
  const n = new Is({
    // 如果纹理加载失败，map 为 null，使用纯色占位
    map: t ?? null,
    color: s.color || 16777215,
    transparent: s.transparent ?? !0,
    opacity: s.opacity ?? 1,
    sizeAttenuation: s.sizeAttenuation ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0,
    alphaTest: s.alphaTest ?? 0.05,
    premultipliedAlpha: !1,
    // 与纹理设置保持一致
    blending: xd
    // 正常混合模式
  }), i = new nr(n), o = 2e-3, l = s.size;
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
function Mc(s, e) {
  let t;
  e instanceof Float32Array ? t = Array.from(e) : Array.isArray(e) && typeof e[0] == "number" ? t = e : t = e.flatMap((o) => [o.x, o.y, o.z]);
  const n = new la();
  n.setPositions(t);
  const i = new ks({
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
  }), new ca(n, i);
}
function Qd(s, e) {
  let t = [];
  if (Array.isArray(e) && typeof e[0] == "number")
    for (let T = 0; T < e.length; T += 3)
      t.push(new D(e[T], e[T + 1], e[T + 2]));
  else if (e instanceof Float32Array)
    for (let T = 0; T < e.length; T += 3)
      t.push(new D(e[T], e[T + 1], e[T + 2]));
  else
    t = e;
  if (t.length < 2) return new Be();
  const n = new Td(), i = s.cornerRadius || 5;
  if (t.length === 2 || i <= 0)
    for (let T = 0; T < t.length - 1; T++) {
      const b = new Dr(t[T], t[T + 1]);
      n.curves.push(b);
    }
  else {
    let T = t[0];
    for (let b = 1; b < t.length - 1; b++) {
      const L = T, M = t[b], A = t[b + 1], R = new D().subVectors(M, L), k = new D().subVectors(A, M), G = R.length(), V = k.length(), F = Math.min(G, V) * 0.4, $ = Math.min(i, F);
      R.normalize().multiplyScalar(G - $), k.normalize().multiplyScalar($);
      const z = new D().addVectors(L, R), U = new D().addVectors(M, k);
      n.curves.push(new Dr(L, z)), n.curves.push(new Sd(z, M, U)), T = U;
    }
    n.curves.push(new Dr(T, t[t.length - 1]));
  }
  const o = s.radius || 2, l = s.radialSegments || 8, c = s.tubularSegments || 64, u = new vb(n, c, o, l, !1), f = 5, p = new As({
    color: s.color || "#19bbd5",
    side: kr,
    emissive: new oe(s.color || "#19bbd5"),
    emissiveIntensity: 0.6 * f,
    transparent: !0
  });
  p.defines = { USE_UV: "" };
  const g = {
    totalLength: { value: n.getLength() },
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
  const y = new Be(u, p);
  let x = 0;
  return y.onBeforeRender = () => {
    const T = performance.now(), b = x ? (T - x) / 1e3 : 0.016;
    x = T;
    const L = g.speedFactor.value / g.totalLength.value * 10;
    g.stripeOffset.value -= b * L, g.stripeOffset.value = g.stripeOffset.value % 1;
  }, y;
}
function Jd(s, e) {
  let t = [];
  if (Array.isArray(e) && typeof e[0] == "number")
    for (let A = 0; A < e.length; A += 3)
      t.push(new D(e[A], e[A + 1], e[A + 2]));
  else if (e instanceof Float32Array)
    for (let A = 0; A < e.length; A += 3)
      t.push(new D(e[A], e[A + 1], e[A + 2]));
  else
    t = e;
  if (t.length < 2) return new Be();
  const n = new Td(), i = s.cornerRadius || 5;
  if (t.length === 2 || i <= 0)
    for (let A = 0; A < t.length - 1; A++) {
      const R = new Dr(t[A], t[A + 1]);
      n.curves.push(R);
    }
  else {
    let A = t[0];
    for (let R = 1; R < t.length - 1; R++) {
      const k = A, G = t[R], V = t[R + 1], F = new D().subVectors(G, k), $ = new D().subVectors(V, G), z = F.length(), U = $.length(), X = Math.min(z, U) * 0.4, q = Math.min(i, X);
      F.normalize().multiplyScalar(z - q), $.normalize().multiplyScalar(q);
      const Z = new D().addVectors(k, F), ee = new D().addVectors(G, $);
      n.curves.push(new Dr(k, Z)), n.curves.push(new Sd(Z, G, ee)), A = ee;
    }
    n.curves.push(new Dr(A, t[t.length - 1]));
  }
  const o = s.width || 4, c = n.getPoints(128), u = [], f = [], p = [];
  let d = 0;
  const g = n.getLength();
  for (let A = 0; A < c.length; A++) {
    const R = c[A];
    let k;
    A === 0 ? k = new D().subVectors(c[1], c[0]) : A === c.length - 1 ? k = new D().subVectors(c[A], c[A - 1]) : k = new D().subVectors(c[A + 1], c[A - 1]), k.y = 0, k.normalize();
    const G = new D(-k.z, 0, k.x), V = o / 2, F = new D(
      R.x + G.x * V,
      R.y,
      R.z + G.z * V
    ), $ = new D(
      R.x - G.x * V,
      R.y,
      R.z - G.z * V
    );
    u.push(F.x, F.y, F.z), u.push($.x, $.y, $.z), A > 0 && (d += c[A].distanceTo(c[A - 1]));
    const z = d / g;
    if (f.push(z, 0), f.push(z, 1), A < c.length - 1) {
      const U = A * 2;
      p.push(U, U + 1, U + 2), p.push(U + 1, U + 3, U + 2);
    }
  }
  const y = new Kt();
  y.setAttribute("position", new mt(new Float32Array(u), 3)), y.setAttribute("uv", new mt(new Float32Array(f), 2)), y.setIndex(p), y.computeVertexNormals();
  const x = 5, T = new As({
    color: s.color || "#0ED5FD",
    side: kr,
    emissive: new oe(s.color || "#0ED5FD"),
    emissiveIntensity: 5,
    transparent: !0
  });
  T.defines = { USE_UV: "" };
  const b = {
    totalLength: { value: g },
    stripeOffset: { value: 0 },
    arrowLength: { value: s.arrowLength || 20 },
    arrowSpacing: { value: s.arrowSpacing || 80 },
    arrowColor: { value: new oe(s.color || "#0ED5FD") },
    speedFactor: { value: s.speed || 10 },
    bloomBoost: { value: x }
  };
  T.onBeforeCompile = (A) => {
    A.uniforms.totalLength = b.totalLength, A.uniforms.stripeOffset = b.stripeOffset, A.uniforms.arrowLength = b.arrowLength, A.uniforms.arrowSpacing = b.arrowSpacing, A.uniforms.arrowColor = b.arrowColor, A.uniforms.bloomBoost = b.bloomBoost, A.fragmentShader = A.fragmentShader.replace(
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
  const L = new Be(y, T);
  let M = 0;
  return L.onBeforeRender = () => {
    const A = performance.now(), R = M ? (A - M) / 1e3 : 0.016;
    M = A;
    const k = b.speedFactor.value / b.totalLength.value * 10;
    b.stripeOffset.value -= R * k, b.stripeOffset.value = b.stripeOffset.value % 1;
  }, L;
}
async function ep(s, e) {
  let t = [];
  if (Array.isArray(e) && typeof e[0] == "number") {
    const U = e;
    for (let X = 0; X < U.length; X += 3)
      t.push(new D(U[X], U[X + 1], U[X + 2]));
  } else if (e instanceof Float32Array)
    for (let U = 0; U < e.length; U += 3)
      t.push(new D(e[U], e[U + 1], e[U + 2]));
  else
    t = e;
  if (t.length < 2) return new Be();
  const n = (s.width ?? 10) * 0.5, i = [], o = [], l = [];
  let c = 0;
  const u = [0];
  for (let U = 1; U < t.length; U++) {
    const X = t[U].distanceTo(t[U - 1]);
    c += X, u.push(c);
  }
  if (c === 0) return new Be();
  const f = s.repeat ?? 1, p = [], d = [];
  for (let U = 0; U < t.length; U++) {
    let X = new D();
    U === 0 ? X.subVectors(t[U + 1], t[U]) : U === t.length - 1 ? X.subVectors(t[U], t[U - 1]) : X.subVectors(t[U + 1], t[U - 1]), X.normalize();
    const q = new D(0, 1, 0);
    let Z = new D().crossVectors(X, q);
    Z.lengthSq() < 1e-10 ? Z.set(1, 0, 0) : Z.normalize(), p.push(t[U].clone().add(Z.clone().multiplyScalar(-n))), d.push(t[U].clone().add(Z.clone().multiplyScalar(n)));
  }
  let g = 0, y = 0;
  for (let U = 1; U < p.length; U++)
    g += p[U].distanceTo(p[U - 1]), y += d[U].distanceTo(d[U - 1]);
  if ((g + y) / 2 === 0) return new Be();
  for (let U = 0; U < t.length; U++) {
    i.push(
      p[U].x,
      p[U].y,
      p[U].z,
      d[U].x,
      d[U].y,
      d[U].z
    );
    const X = u[U] / c * f;
    o.push(
      X,
      0,
      // 左侧顶点：使用中心线U坐标，V=0
      X,
      1
      // 右侧顶点：使用中心线U坐标，V=1
    );
  }
  const T = t.length - 1;
  for (let U = 0; U < T; U++) {
    const X = U * 2, q = U * 2 + 1, Z = (U + 1) * 2, ee = (U + 1) * 2 + 1;
    l.push(X, Z, q), l.push(Z, ee, q);
  }
  const b = new Kt();
  b.setAttribute("position", new mt(new Float32Array(i), 3)), b.setAttribute("uv", new mt(new Float32Array(o), 2)), b.setIndex(l), b.computeBoundingBox(), b.computeVertexNormals();
  const L = await Jt._loadTexture(s.flowTexture);
  L.wrapS = yn, L.wrapT = yn, L.anisotropy = 4, L.needsUpdate = !0;
  const M = new oe(s.color ?? 16777215), R = {
    uMap: { value: L },
    uColor: { value: M },
    uOpacity: { value: s.opacity ?? 1 },
    uOffset: { value: 0 },
    uBloomBoost: { value: 5 }
  }, k = s.depthOffset ?? 1, G = k !== 0, V = new Pn({
    uniforms: R,
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
    blending: _c,
    side: kr,
    polygonOffset: G,
    polygonOffsetFactor: -k,
    polygonOffsetUnits: -k
  }), F = new Be(b, V);
  let $ = 0;
  F.onBeforeRender = () => {
    const U = performance.now(), X = $ ? (U - $) / 1e3 : 0.016;
    $ = U;
    const q = s.speed ?? 10;
    R.uOffset.value = z(R.uOffset.value - X * q / c);
  };
  function z(U) {
    return U - Math.floor(U);
  }
  return F;
}
async function bT(s, e) {
  const t = s.type || (s.url.toLowerCase().endsWith(".fbx") ? "fbx" : "gltf");
  return (await qd.getInstance().load({
    ...s,
    type: t,
    position: e
  })).model;
}
function xT(s, e) {
  const { geometry: t, center: n, avgY: i } = Ac(e), o = s.depthOffset ?? 0, l = o !== 0, c = new qt({
    color: new oe(s.color ?? 16777215),
    transparent: s.transparent ?? !0,
    opacity: s.opacity ?? 1,
    wireframe: s.wireframe ?? !1,
    side: s.side === "back" ? wb : s.side === "double" ? kr : na,
    // depthWrite: true,
    polygonOffset: l,
    polygonOffsetFactor: l ? o : 0,
    polygonOffsetUnits: l ? o : 0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  }), u = new Be(t, c);
  if (u.rotation.x = -Math.PI / 2, u.position.set(n.x, i, n.z), (s.borderWidth ?? 0) > 0) {
    const d = {
      color: s.borderColor ?? s.color ?? 0,
      width: s.borderWidth
      // dashArray: config.borderdashArray,
      // opacity: config.opacity
    }, g = [];
    for (let x = 0; x < e.length; x += 3) {
      const T = e[x], b = e[x + 2];
      g.push(
        T - n.x,
        // 对应 shapePoints.x
        -(b - n.z),
        // 对应 shapePoints.y
        0
        // 与 ShapeGeometry 一样，初始在 XY 平面
      );
    }
    const y = Mc(d, g);
    y.position.z += 0.1, u.add(y);
  }
  return u;
}
function TT(s, e) {
  const t = s.extrude?.height || 2e3, n = [], i = [], o = [];
  for (let d = 0; d < e.length; d += 3) {
    const g = e[d], y = e[d + 1], x = e[d + 2];
    i.push(new D(g, y, x)), o.push(new D(g, y + t, x));
  }
  n.push(...i, ...o);
  const l = new Kt();
  l.setFromPoints(n);
  const c = [], u = i.length;
  for (let d = 0; d < u; d++) {
    const g = (d + 1) % u;
    c.push(d, d + u, g), c.push(g, d + u, g + u);
  }
  for (let d = 2; d < u; d++)
    c.push(0, d - 1, d), c.push(u, u + d - 1, u + d);
  l.setIndex(c), l.computeVertexNormals();
  const f = new Pn({
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
    side: kr,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  });
  return new Be(l, f);
}
function ST(s, e, t) {
  const { geometry: n, center: i, avgY: o } = Ac(t), l = new n1(n, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new ra().load(s.normalMap, function(f) {
      f.wrapS = f.wrapT = yn;
    }),
    waterColor: s.color || "#19AAEE",
    sunColor: s.sunColor || "#05FFF8",
    distortionScale: 1,
    alpha: s.opacity || 0.8
    // depthTest: config.depthTest ?? true,
    // depthWrite: config.depthWrite ?? true,
  }), c = l.onBeforeRender, u = l.onAfterRender;
  return l.onBeforeRender = (f, p, d, g, y, x) => {
    e.autoUpdate = !1, c.call(l, f, p, d, g, y, x);
  }, l.onAfterRender = (f, p, d, g, y, x) => {
    e.autoUpdate = !0, u.call(l, f, p, d, g, y, x);
  }, l.material.uniforms.size.value = 0.1, l.rotation.x = -Math.PI / 2, l.position.set(i.x, o, i.z), e.sceneRenderer.addEventListener("update", () => {
    l.material.uniforms.time.value += 1 / 60;
  }), l;
}
function Ac(s) {
  let e = 0;
  for (let l = 1; l < s.length; l += 3)
    e += s[l];
  e /= s.length / 3;
  const t = { x: 0, z: 0 }, n = [];
  for (let l = 0; l < s.length; l += 3)
    t.x += s[l], t.z += s[l + 2];
  t.x /= s.length / 3, t.z /= s.length / 3;
  for (let l = 0; l < s.length; l += 3)
    n.push(new ce(
      s[l] - t.x,
      -(s[l + 2] - t.z)
    ));
  const i = new bb(n);
  return {
    geometry: new xb(i),
    center: t,
    avgY: e
  };
}
async function MT(s, e) {
  const { geometry: t, center: n, avgY: i } = Ac(e), o = await Jt._loadTexture(s.normalMap), l = await Jt._loadTexture(s.normalMap);
  o.wrapS = o.wrapT = yn, l.wrapS = l.wrapT = yn, o.repeat.set(0.015, 0.015), l.repeat.set(5e-3, 5e-3);
  const c = new Ds({
    color: new oe(s.color).multiplyScalar(3.5),
    roughness: 0.1,
    // 稍微增加粗糙度更真实
    metalness: 0.8,
    transparent: s.transparent ?? !0,
    opacity: 0.9,
    fog: !1,
    normalMap: o,
    normalScale: new ce(1.5, 1.5),
    // environmentMap: sceneRenderer.scene.environment, 
    envMapIntensity: 2,
    // 提高环境贴图的强度，让反射更亮
    // clearcoat: 1.0,        // 启用 Clearcoat，强度 1.0
    // clearcoatRoughness: 0.0, // Clearcoat 粗糙度 0.0，实现锋利高光
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0
  }), u = new Be(t, c);
  u.rotation.x = -Math.PI / 2, u.position.set(n.x, i + 0.15, n.z), u.castShadow = !1, u.receiveShadow = !0;
  let f = 0;
  return u.onBeforeRender = () => {
    const p = performance.now(), d = f ? (p - f) / 1e3 : 0.016;
    o.offset.x += d * 0.08, o.offset.y += d * 0.03, l.offset.x -= d * 0.12, l.offset.y += d * 0.02, u.position.y = i + 0.5 + Math.sin(p * 0.02) * 0.02, f = p;
  }, u;
}
function AT(s, e) {
  s.color = new oe(s.hexcolor), s.boundstext && (s.bounds = new D(s.boundstext.x, s.boundstext.y, s.boundstext.z));
  const t = new vT(s);
  return t.castShadow = !0, t.scale.setScalar(50), t.position.copy(e), t;
}
async function PT(s, e) {
  const n = { ...{
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
  n.screenSpaceSize == null && n.fixedSize != null && (n.screenSpaceSize = n.fixedSize);
  const o = (typeof window < "u" && window.devicePixelRatio || 1) * 4, l = s.screenSpaceSize != null || s.fixedSize != null;
  if (s.fontSizeDpi == null && l) {
    const G = s.screenSpaceSize ?? s.fixedSize ?? n.screenSpaceSize;
    n.fontSizeDpi = G * o;
  }
  n.fontSizeDpi = Math.min(Math.max(n.fontSizeDpi, 8), 128);
  const c = document.createElement("canvas"), u = c.getContext("2d");
  if (!u) throw new Error("canvas context is null");
  const f = `${n.fontStyle} ${n.fontWeight} ${n.fontSizeDpi}px ${n.fontFamily}`;
  u.font = f;
  const p = n.showBackground ? 20 : 0, d = 100, g = 50, y = u.measureText(n.text), x = Math.max(d, y.width + p * 2), T = Math.max(g, n.fontSizeDpi * 1.5 + p * 2);
  c.width = Math.min(x, 2048), c.height = Math.min(T, 2048), u.clearRect(0, 0, c.width, c.height), u.font = f, n.showBackground && (n.bgStyle === 1 ? (u.fillStyle = n.bgColor, u.globalAlpha = n.bgOpacity, u.beginPath(), tp(u, p / 2, p / 2, c.width - p, c.height - p, n.roundRectRadius), u.fill(), u.globalAlpha = 1, u.shadowColor = n.shadowColor, u.shadowBlur = n.shadowBlur, u.shadowOffsetX = n.shadowOffsetX, u.shadowOffsetY = n.shadowOffsetY) : (u.fillStyle = n.bgColor, u.globalAlpha = n.bgOpacity, u.beginPath(), np(
    u,
    c.width / 2,
    c.height / 2,
    c.width * 0.8,
    c.height * 0.8,
    n.roundRectRadius,
    n.bubblePointerHeight,
    n.bubblePointerWidth
  ), u.fill(), u.globalAlpha = 1, u.strokeStyle = n.bubbleBorderColor, u.lineWidth = n.bubbleBorderWidth, u.stroke())), u.textAlign = "center", u.textBaseline = "middle", n.strokeWidth > 0 && (u.strokeStyle = n.strokeColor, u.lineWidth = n.strokeWidth, u.lineJoin = "round", u.strokeText(n.text, c.width / 2, c.height / 2)), u.fillStyle = n.textColor, u.fillText(n.text, c.width / 2, c.height / 2), u.shadowColor = "transparent";
  const b = new Fs(c);
  b.magFilter = fd, b.minFilter = Rs, b.anisotropy = 16;
  const L = new Is({
    map: b,
    transparent: s.transparent ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0,
    fog: !1
  }), M = new nr(L), A = n.screenSpaceSize ?? n.fixedSize;
  M.scale.set(
    c.width * A / 100,
    c.height * A / 100,
    1
  );
  const R = s.anchor || [0.5, 0.5], k = s.textOffset || { x: 0, y: 0 };
  return M.center.set(
    R[0] - k.x / c.width,
    R[1] + k.y / c.height
  ), e && M.position.copy(e), M;
}
async function LT(s, e, t) {
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
  const p = i.showBackground ? 20 : 0, d = 100, g = 50, y = u.measureText(i.text), x = Math.max(d, y.width + p * 2), T = Math.max(g, i.fontSizeDpi * 1.5 + p * 2);
  c.width = Math.min(x, 2048), c.height = Math.min(T, 2048), u.clearRect(0, 0, c.width, c.height), u.font = f, i.showBackground && (i.bgStyle === 1 ? (u.fillStyle = i.bgColor, u.globalAlpha = i.bgOpacity, u.beginPath(), tp(u, p / 2, p / 2, c.width - p, c.height - p, i.roundRectRadius), u.fill(), u.globalAlpha = 1, u.shadowColor = i.shadowColor, u.shadowBlur = i.shadowBlur, u.shadowOffsetX = i.shadowOffsetX, u.shadowOffsetY = i.shadowOffsetY) : (u.fillStyle = i.bgColor, u.globalAlpha = i.bgOpacity, u.beginPath(), np(
    u,
    c.width / 2,
    c.height / 2,
    c.width * 0.8,
    c.height * 0.8,
    i.roundRectRadius,
    i.bubblePointerHeight,
    i.bubblePointerWidth
  ), u.fill(), u.globalAlpha = 1, u.strokeStyle = i.bubbleBorderColor, u.lineWidth = i.bubbleBorderWidth, u.stroke())), u.textAlign = "center", u.textBaseline = "middle", i.strokeWidth > 0 && (u.strokeStyle = i.strokeColor, u.lineWidth = i.strokeWidth, u.lineJoin = "round", u.strokeText(i.text, c.width / 2, c.height / 2)), u.fillStyle = i.textColor, u.fillText(i.text, c.width / 2, c.height / 2), u.shadowColor = "transparent";
  const b = new Fs(c), L = new Is({
    map: b,
    transparent: s.transparent ?? !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !0,
    fog: !1
  }), M = new nr(L), A = s.anchor || [0.5, 0.5], R = s.textOffset || { x: 0, y: 0 }, k = i.screenSpaceSize, G = k * (c.width / c.height);
  M.center.set(
    A[0] - R.x / G,
    A[1] + R.y / k
  ), M.position.copy(e), M.userData.isLabel = !0;
  const V = () => {
    if (!M.visible) return;
    const $ = t.sceneRenderer.camera.position.distanceTo(M.position);
    if ($ > i.maxVisibleDistance) {
      M.visible = !1;
      return;
    }
    M.visible = !0;
    const z = new ce();
    t.sceneRenderer.renderer.getSize(z);
    const U = z.height, X = lt.degToRad(t.sceneRenderer.camera.fov), q = typeof window < "u" && window.devicePixelRatio || 1, ee = i.screenSpaceSize * q / c.height * (2 * $ * Math.tan(X / 2) / U);
    M.scale.set(ee * c.width, ee * c.height, 1), M.lookAt(t.sceneRenderer.camera.position);
  };
  V();
  const F = () => V();
  return M.addEventListener("dispose", () => {
    t.sceneRenderer.renderer.domElement.removeEventListener("resize", V);
  }), t.sceneRenderer.renderer.domElement.addEventListener("resize", V), t.sceneRenderer.camera.addEventListener("change", V), M.onBeforeRender = F, M;
}
async function ET(s, e) {
  const t = s.size ?? s.iconSize, n = {
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
      i = await BT(s.url);
    } catch {
      console.error("Label icon load failed:", s.url);
    }
  const { canvas: o, width: l, height: c, center: u } = await CT(n, i), f = new Br(o);
  f.generateMipmaps = !0, f.minFilter = Rs, f.magFilter = vi, f.colorSpace = oa, f.premultiplyAlpha = !1, f.needsUpdate = !0;
  const p = new Is({
    map: f,
    transparent: n.transparent ?? !0,
    depthTest: n.depthTest ?? !0,
    depthWrite: n.depthWrite ?? !0,
    blending: xd,
    sizeAttenuation: !1,
    premultipliedAlpha: !1,
    alphaTest: 0.05
  }), d = new nr(p), g = 2e-3;
  return d.scale.set(l * g, c * g, 1), s.anchor ? d.center.set(s.anchor[0], s.anchor[1]) : d.center.set(u[0], u[1]), e && d.position.copy(e), d;
}
async function CT(s, e) {
  return new Promise((t) => {
    const {
      text: n,
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
      textOffset: x,
      iconSize: T,
      fontWeight: b,
      bgOpacity: L
    } = s, M = e !== null;
    let A = 0, R = 0;
    if (M && e) {
      const Ge = e.naturalWidth || e.width || 1, At = e.naturalHeight || e.height || 1, Si = Ge / At || 1;
      Array.isArray(T) ? (A = T[0], R = T[1]) : typeof T == "number" ? (R = T, A = T * Si) : (A = Ge, R = At);
    } else Array.isArray(T) ? (A = T[0], R = T[1]) : typeof T == "number" && (A = T, R = T);
    const G = document.createElement("canvas").getContext("2d"), V = `${b} ${i}px ${o}`;
    G.font = V;
    const F = RT(G, n, i), { width: $, ascent: z, descent: U } = F, X = M ? A / 2 : 0, q = M ? R / 2 : 0, Z = X + x.x, ee = q + x.y, Q = Z - l.left, Le = Z + $ + l.right, we = ee - z - l.top, xe = ee + U + l.bottom;
    let ge, Ee, Ce, Oe;
    M ? (ge = Math.min(0, Q), Ee = Math.min(0, we), Ce = Math.max(A, Le), Oe = Math.max(R, xe)) : (ge = Q, Ee = we, Ce = Le, Oe = xe);
    const ct = Math.ceil(Ce - ge), ut = Math.ceil(Oe - Ee), { canvas: Bt, ctx: en } = OT(ct, ut, g), yt = -ge, tn = -Ee;
    if (M && e && A > 0 && R > 0) {
      const Ge = A * d, At = R * d, Si = (A - Ge) / 2, vt = (R - At) / 2, Mi = yt + Si, sr = tn + vt;
      en.drawImage(e, Mi, sr, Ge, At);
    }
    const rr = yt + Z, Rn = tn + ee;
    y && c && c !== "transparent" && IT(
      en,
      rr,
      Rn,
      $,
      z,
      U,
      l,
      c,
      L
    ), en.font = V, FT(en, n, rr, Rn, u, p, f);
    let nn, Dn;
    M && A > 0 && R > 0 ? (nn = (yt + X) / ct, Dn = (tn + q) / ut) : (nn = 0.5, Dn = 0.5), t({
      canvas: Bt,
      width: ct,
      height: ut,
      center: [nn, 1 - Dn]
      // 转换为 canvas 坐标系
    });
  });
}
function tp(s, e, t, n, i, o) {
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + n - o, t), s.quadraticCurveTo(e + n, t, e + n, t + o), s.lineTo(e + n, t + i - o), s.quadraticCurveTo(e + n, t + i, e + n - o, t + i), s.lineTo(e + o, t + i), s.quadraticCurveTo(e, t + i, e, t + i - o), s.lineTo(e, t + o), s.quadraticCurveTo(e, t, e + o, t), s.closePath();
}
function np(s, e, t, n, i, o, l, c) {
  if (n <= 0) throw new Error("Width must be positive");
  if (i <= 0) throw new Error("Height must be positive");
  if (o < 0) throw new Error("Radius cannot be negative");
  const u = n, f = i, p = Math.min(o, n / 2, i / 2), d = l ?? 10, g = c ?? 15;
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
function OT(s, e, t) {
  const n = document.createElement("canvas");
  n.width = Math.ceil(s * t), n.height = Math.ceil(e * t);
  const i = n.getContext("2d", { alpha: !0 });
  return i.scale(t, t), i.imageSmoothingEnabled = !1, { canvas: n, ctx: i };
}
function RT(s, e, t) {
  const n = s.measureText(e);
  return {
    width: n.width,
    ascent: n.actualBoundingBoxAscent || t * 0.8,
    descent: n.actualBoundingBoxDescent || t * 0.2,
    totalHeight: (n.actualBoundingBoxAscent || t * 0.8) + (n.actualBoundingBoxDescent || t * 0.2)
  };
}
function DT(s, e, t, n, i, o) {
  s.beginPath(), s.moveTo(e + o, t), s.lineTo(e + n - o, t), s.arcTo(e + n, t, e + n, t + o, o), s.lineTo(e + n, t + i - o), s.arcTo(e + n, t + i, e + n - o, t + i, o), s.lineTo(e + o, t + i), s.arcTo(e, t + i, e, t + i - o, o), s.lineTo(e, t + o), s.arcTo(e, t, e + o, t, o), s.closePath();
}
function IT(s, e, t, n, i, o, l, c, u = 1) {
  const f = e - l.left, p = t - i - l.top, d = n + l.left + l.right, g = i + o + l.top + l.bottom;
  s.save(), s.globalAlpha = u, s.fillStyle = c, DT(s, f, p, d, g, 2), s.fill(), s.restore();
}
function FT(s, e, t, n, i, o, l) {
  s.save(), s.textBaseline = "alphabetic", s.textAlign = "left", o > 0 && (s.strokeStyle = l, s.lineWidth = o, s.lineJoin = "round", s.strokeText(e, t, n)), s.fillStyle = i, s.fillText(e, t, n), s.restore();
}
function BT(s) {
  return new Promise((e, t) => {
    const n = new Image();
    n.crossOrigin = "Anonymous", n.onload = () => e(n), n.onerror = (i) => t(new Error(`Failed to load image: ${s} ${i}`)), n.src = s;
  });
}
async function UT(s, e, t) {
  const i = new Tb(0.2, 0.2, 24, 12), o = new qt({ color: s.color }), l = await Jt._loadTexture(s.icon), c = new sa({
    // color: new THREE.Color(color).multiplyScalar(0.5),
    size: 80 * window.innerHeight / window.innerHeight,
    fog: !1,
    opacity: 1,
    transparent: s.transparent ?? !0,
    toneMapped: !1,
    blending: _c,
    map: l,
    sizeAttenuation: !0,
    depthTest: s.depthTest ?? !0,
    depthWrite: s.depthWrite ?? !1
  }), u = new vc(i, o, e.length);
  u.position.add(t.prjcenter), u.castShadow = !0;
  const f = new gn(), p = [];
  for (let x = 0; x < e.length; x++) {
    const T = e[x], b = new D(
      T.coordinates[0],
      T.coordinates[1],
      T.coordinates[2] || 0
      // 默认高度0
    ), M = t.lngLatToWorld(b).sub(t.prjcenter);
    f.position.copy(M), f.updateMatrix(), u.setMatrixAt(x, f.matrix), p.push(M.x, 0, M.z);
  }
  const d = new Float32Array(p), g = new Kt();
  g.setAttribute("position", new mt(d, 3));
  const y = new zr(g, c);
  return y.position.add(t.prjcenter), y.position.y = 1.5 * 10, y.renderOrder = 99999999, y.visible = !0, {
    points: y,
    InstancedCol: u
  };
}
var kT = Object.defineProperty, zT = (s, e, t) => e in s ? kT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ip = (s, e, t) => zT(s, typeof e != "symbol" ? e + "" : e, t);
const Pc = class ji {
  /**
   * Constructor
   * @param config Paint configuration
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
        case "circle":
        case "icon":
        case "symbol":
          return this._applyPointPaint(e);
        case "line":
          return this._applyLinePaint(e);
        case "flow-tube":
          return this._applyFlowTubePaint(e);
        case "arrow":
          return this._applyArrowPaint(e);
        case "flow-texture":
          return this._applyFlowTexturePaint(e);
        case "model-gltf":
        case "model-fbx":
          return this._applyModelPaint(e);
        case "fill":
          return this._applyFillPaint(e);
        case "extrusion":
          return this._applyExtrusionPaint(e);
        case "water":
        case "water-simple":
          return this._applyWaterPaint(e);
        case "cloud":
          return this._applyCloudPaint(e);
        case "text":
        case "text-fixed":
          return this._applyTextPaint(e);
        case "light":
          return this._applyLightPaint(e);
        case "custom":
          return this._applyCustomPaint(e);
        default:
          throw new Error("Unknown paint type");
      }
    } catch (t) {
      return console.error("Paint apply failed:", t), e.visible = !1, !1;
    }
  }
  /**
   * Apply point paint
   * @param object Target object
   * @returns Success status
   */
  async _applyPointPaint(e) {
    const t = this.config;
    return t.type === "icon" ? await this._applyIconPaint(e, t) : t.type === "circle" ? this._applyCirclePaint(e, t) : t.type === "symbol" && this._applySymbolPaint(e, t), !0;
  }
  /**
   * Apply icon paint
   * @param object Target object
   * @param config Paint configuration
   */
  // @ts-ignore
  async _applyIconPaint(e, t) {
    return !0;
  }
  /**
   * Apply circle paint
   * @param object Target object
   * @param config Paint configuration
   */
  _applyCirclePaint(e, t) {
    let n;
    if (e instanceof zr)
      n = e;
    else if (n = Kd(t, e.position), n.position.copy(e.position), n.rotation.copy(e.rotation), n.scale.copy(e.scale), e.parent) {
      let l = e.parent;
      l._renderObject = n, l._updateGeometry();
    }
    const i = n.material, o = t.sizeAttenuation;
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
   * Apply symbol paint
   * @param object Target object
   * @param config Paint configuration
   */
  // @ts-ignore
  _applySymbolPaint(e, t) {
    return !0;
  }
  /**
   * Apply line paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyLinePaint(e) {
    return this.config, !0;
  }
  /**
   * Apply flow tube paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyFlowTubePaint(e) {
    return !0;
  }
  /**
   * Apply arrow paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyArrowPaint(e) {
    return !0;
  }
  /**
   * Apply flow texture paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyFlowTexturePaint(e) {
    return !0;
  }
  /**
   * Apply fill paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyFillPaint(e) {
    return !0;
  }
  /**
   * Apply extrusion paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyExtrusionPaint(e) {
    return !0;
  }
  /**
   * Apply water paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyWaterPaint(e) {
    return !0;
  }
  /**
   * Apply cloud paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyCloudPaint(e) {
    return !0;
  }
  /**
   * Apply text paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  _applyTextPaint(e) {
    return !0;
  }
  /**
  * Apply light paint
  * @param object Target object
  * @returns Success status
  */
  // @ts-ignore
  _applyLightPaint(e) {
    return !0;
  }
  /**
   * Apply model paint
   * @param object Target object
   * @returns Success status
   */
  // @ts-ignore
  async _applyModelPaint(e) {
    return !0;
  }
  /**
   * Apply custom paint
   * @param object Target object
   * @returns Success status
   */
  async _applyCustomPaint(e) {
    const n = await this.config.build();
    return e instanceof Qt && (e.clear(), e.add(n)), !0;
  }
  /**
   * Load texture
   * @param url Texture URL
   * @returns Texture object
   */
  static async _loadTexture(e) {
    if (ji._textureCache.has(e))
      return ji._textureCache.get(e);
    const t = await new Promise((n, i) => {
      ji._textureLoader.load(e, n, void 0, i);
    });
    return t.needsUpdate = !0, ji._textureCache.set(e, t), t;
  }
  /**
   * Create paint instance
   * @param input Paint input
   * @returns Paint instance
   */
  static create(e) {
    return e instanceof ji ? e : new ji(e);
  }
};
ip(Pc, "_textureCache", /* @__PURE__ */ new Map());
ip(Pc, "_textureLoader", new ra());
let Jt = Pc;
var NT = Object.defineProperty, HT = (s, e, t) => e in s ? NT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Sr = (s, e, t) => HT(s, typeof e != "symbol" ? e + "" : e, t);
class VT {
  /**
   * Create a paint manager instance.
   * 创建样式管理器实例
   * 
   * @param getRenderObject - Function to get current render object. 获取当前渲染对象的函数
   * @param addRenderObject - Function to add render object to parent. 添加渲染对象到父级的函数
   */
  constructor(e, t) {
    Sr(this, "_paintQueue", []), Sr(this, "_isApplyingPaint", !1), Sr(this, "_currentPaint"), Sr(this, "_onPaintApplied"), Sr(this, "_getRenderObject"), Sr(this, "_addRenderObject"), this._getRenderObject = e, this._addRenderObject = t;
  }
  /**
   * Set callback for when paint is applied.
   * 设置样式应用后的回调
   * 
   * @param callback - Callback function. 回调函数
   */
  setOnPaintApplied(e) {
    this._onPaintApplied = e;
  }
  /**
   * Get current paint.
   * 获取当前样式
   * 
   * @returns Current paint or undefined. 当前样式或undefined
   */
  getCurrentPaint() {
    return this._currentPaint;
  }
  /**
   * Enqueue a paint for application.
   * 将样式加入应用队列
   * 
   * @param input - Paint configuration or paint instance. 样式配置或样式实例
   * @returns The paint instance. 样式实例
   */
  enqueuePaint(e) {
    const t = e instanceof Jt ? e : new Jt(e);
    this._currentPaint = t;
    const n = JSON.parse(JSON.stringify(t.config));
    return this._paintQueue.push(n), this._tryProcessPaintQueue(), t;
  }
  /**
   * Check if paint queue can be processed.
   * 检查样式队列是否可以处理
   * 
   * @returns Whether processing should start. 是否应该开始处理
   */
  canProcessQueue() {
    return this._getRenderObject() !== null && !this._isApplyingPaint && this._paintQueue.length > 0;
  }
  /**
   * Try to process the paint queue.
   * 尝试处理样式队列
   */
  _tryProcessPaintQueue() {
    this.canProcessQueue() && this._processPaintQueue().catch((e) => {
      this._isApplyingPaint = !1, this._tryProcessPaintQueue(), console.warn("Paint application failed:", e);
    });
  }
  /**
   * Process the paint queue sequentially.
   * 按顺序处理样式队列
   */
  async _processPaintQueue() {
    const e = this._getRenderObject();
    if (!e || this._isApplyingPaint || this._paintQueue.length === 0)
      return;
    this._isApplyingPaint = !0;
    const t = this._paintQueue[0];
    try {
      const n = new Jt(JSON.parse(JSON.stringify(t)));
      await this._applyPaintWithRetry(n, e), this._paintQueue.shift(), this._paintQueue.length > 0 && await this._processPaintQueue();
    } catch (n) {
      throw n;
    } finally {
      this._isApplyingPaint = !1, this._paintQueue.length > 0 && this._tryProcessPaintQueue();
    }
  }
  /**
   * Apply paint with retry mechanism.
   * 应用样式（带重试机制）
   * 
   * @param paint - Paint instance. 样式实例
   * @param renderObject - Render object to apply paint to. 要应用样式的渲染对象
   * @param maxRetries - Maximum retries (default: 3). 最大重试次数（默认3）
   * @param baseDelay - Base delay in ms (default: 100). 基础延迟时间（毫秒，默认100）
   */
  async _applyPaintWithRetry(e, t, n = 3, i = 100) {
    let o = null;
    for (let l = 1; l <= n; l++)
      try {
        t.parent || (this._addRenderObject(), await new Promise((c) => requestAnimationFrame(c))), await e.applyTo(t), this._onPaintApplied && this._onPaintApplied(e);
        return;
      } catch (c) {
        if (o = c, l < n) {
          const u = i * Math.pow(2, l - 1);
          await new Promise((f) => setTimeout(f, u));
        }
      }
    throw o || new Error("Paint application failed after retries");
  }
  /**
   * Check if paint is being applied.
   * 检查是否正在应用样式
   */
  get isApplyingPaint() {
    return this._isApplyingPaint;
  }
  /**
   * Check if there are pending paints.
   * 检查是否有待处理的样式
   */
  get hasPendingPaints() {
    return this._paintQueue.length > 0;
  }
}
var WT = Object.defineProperty, GT = (s, e, t) => e in s ? WT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, $T = (s, e, t) => GT(s, e + "", t);
class jT {
  constructor() {
    $T(this, "_bloomConfig");
  }
  /**
   * Get current bloom configuration.
   * 获取当前发光配置
   */
  getBloomConfig() {
    return this._bloomConfig;
  }
  /**
   * Set bloom configuration.
   * 设置发光配置
   * 
   * @param enabled - Whether to enable bloom. 是否启用发光
   * @param options - Bloom intensity and color options. 发光强度和颜色选项
   */
  setBloomConfig(e, t) {
    const n = this._bloomConfig || {
      intensity: 1,
      color: "#ffffff"
    };
    return this._bloomConfig = {
      enabled: e,
      intensity: t?.intensity ?? n.intensity,
      color: t?.color ?? n.color
    }, this._bloomConfig;
  }
  /**
   * Apply bloom configuration from style.
   * 从样式应用发光配置
   * 
   * @param styleBloom - Bloom config from style. 样式中的发光配置
   */
  applyStyleBloom(e) {
    e !== void 0 && (typeof e == "boolean" ? this._bloomConfig = {
      enabled: e,
      intensity: 1,
      color: "#ffffff"
    } : this._bloomConfig = {
      enabled: e.enabled ?? !0,
      intensity: e.intensity ?? 1,
      color: e.color ?? "#ffffff"
    });
  }
  /**
   * Apply bloom effect to a Three.js object.
   * 将发光效果应用到Three.js对象上
   * 
   * @param root - Root object to apply bloom to. 要应用发光的根对象
   */
  applyBloomToObject(e) {
    if (!this._bloomConfig) return;
    const { enabled: t, intensity: n, color: i } = this._bloomConfig;
    e.traverse((o) => {
      if (o instanceof zr && o.material) {
        this._applyBloomToPoints(o, t, n);
        return;
      }
      if (o.type === "Sprite" && o.material) {
        this._applyBloomToSprite(o, t, n, i);
        return;
      }
      if (o.isLine2 && o.material) {
        this._applyBloomToLine2(o, t, n, i);
        return;
      }
      o instanceof Be && o.material && this._applyBloomToMesh(o, t, n, i);
    });
  }
  /**
   * Apply bloom to Points material.
   * 将发光效果应用到点材质
   */
  _applyBloomToPoints(e, t, n) {
    const i = e.material;
    e.userData = e.userData || {}, e.userData.__bloomBackup || (e.userData.__bloomBackup = {
      size: i.size,
      sizeAttenuation: i.sizeAttenuation
    });
    const o = e.userData.__bloomBackup;
    t ? (i.size = o.size * (1 + n), i.sizeAttenuation = !1) : (i.size = o.size, i.sizeAttenuation = o.sizeAttenuation), i.needsUpdate = !0;
  }
  /**
   * Apply bloom to Sprite material.
   * 将发光效果应用到精灵材质
   */
  _applyBloomToSprite(e, t, n, i) {
    const o = e.material;
    e.userData = e.userData || {}, e.userData.__bloomBackup || (e.userData.__bloomBackup = {
      color: o.color ? o.color.clone() : null,
      opacity: o.opacity ?? 1
    });
    const l = e.userData.__bloomBackup;
    t ? (o.color && l.color && (o.color.copy(l.color), i && i !== "#ffffff" && o.color.setStyle(i), o.color.multiplyScalar(1 + n * 2)), o.opacity = Math.min(1, (l.opacity ?? 1) * (1 + n * 0.3))) : (l.color && o.color && o.color.copy(l.color), o.opacity = l.opacity), o.needsUpdate = !0;
  }
  /**
   * Apply bloom to Line2 material.
   * 将发光效果应用到Line2材质
   */
  _applyBloomToLine2(e, t, n, i) {
    const o = e.material;
    e.userData = e.userData || {}, e.userData.__bloomBackup || (e.userData.__bloomBackup = {
      color: o.color ? o.color.clone() : null,
      opacity: o.opacity ?? 1
    });
    const l = e.userData.__bloomBackup;
    t ? (o.color && l.color && (o.color.copy(l.color), i && i !== "#ffffff" && o.color.setStyle(i), o.color.multiplyScalar(1 + n * 2)), o.opacity = Math.min(1, (l.opacity ?? 1) * (1 + n * 0.3))) : (l.color && o.color && o.color.copy(l.color), o.opacity = l.opacity), o.needsUpdate = !0;
  }
  /**
   * Apply bloom to Mesh material.
   * 将发光效果应用到网格材质
   */
  _applyBloomToMesh(e, t, n, i) {
    (Array.isArray(e.material) ? e.material : [e.material]).forEach((l) => {
      e.userData = e.userData || {}, e.userData.__bloomBackup || (e.userData.__bloomBackup = {
        emissiveIntensity: l.emissiveIntensity ?? 0,
        emissiveColor: l.emissive ? l.emissive.clone() : null,
        color: l.color ? l.color.clone() : null
      });
      const c = e.userData.__bloomBackup;
      t ? "emissive" in l && l.emissive ? (l.emissiveIntensity = n, i && i !== "#ffffff" && l.emissive.setStyle ? l.emissive.setStyle(i) : c.color && l.emissive && l.emissive.copy(c.color)) : l.color && (c.color && l.color.copy(c.color), i && i !== "#ffffff" ? l.color.setStyle(i) : l.color.multiplyScalar(1 + n * 0.3)) : ("emissiveIntensity" in l && (l.emissiveIntensity = c.emissiveIntensity !== void 0 ? c.emissiveIntensity : 0), c.emissiveColor && l.emissive && l.emissive.copy(c.emissiveColor), c.color && l.color && l.color.copy(c.color)), l.needsUpdate = !0;
    });
  }
}
var XT = Object.defineProperty, YT = (s, e, t) => e in s ? XT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Xt = (s, e, t) => YT(s, typeof e != "symbol" ? e + "" : e, t);
class gt extends Tc(
  Ti(
    ir(gn)
  )
) {
  /**
   * Create a feature instance.
   * 创建要素实例
   * 
   * @param options - Feature configuration options. 要素配置选项
   * @throws Throws error if geometry is not provided. 如果未提供geometry参数会抛出错误
   */
  constructor(e) {
    super(), Xt(this, "_worldCoordinates"), Xt(this, "_renderObject"), Xt(this, "_geometry"), Xt(this, "_layer"), Xt(this, "_paint"), Xt(this, "_id"), Xt(this, "_paintManager"), Xt(this, "_bloomHelper"), Xt(this, "_isGeometryInitializing", !1), Xt(this, "_collisionConfig", {
      enabled: !1,
      priority: 50,
      padding: 4
    }), Xt(this, "_collisionState", {
      visible: !0,
      reason: Ln.NO_COLLISION,
      collidedWith: [],
      timestamp: Date.now()
    }), Xt(this, "_animationRef", null), xc(e.geometry, "geometry", "geometry must be specified"), this._geometry = e.geometry, this._worldCoordinates = new D(0, 0, 0), this._renderObject = new gn(), this.options = {
      draggable: e.draggable || !1,
      editable: e.editable || !1
    }, e.id ? this._id = e.id : this._id = uT(), this._paintManager = new VT(
      () => this._renderObject,
      () => this._ensureRenderObjectInScene()
    ), this._paintManager.setOnPaintApplied((t) => {
      this._onPaintApplied(t);
    }), this._bloomHelper = new jT(), e.userData && (this.userData = Object.assign(
      {},
      JSON.parse(JSON.stringify(e.userData))
    )), e.paint && this.setPaint(e.paint), this.addHandler("draggable", dT);
  }
  /**
   * Ensure render object is added to the scene.
   * 确保渲染对象已添加到场景中
   */
  _ensureRenderObjectInScene() {
    this._renderObject && !this._renderObject.parent && this.add(this._renderObject);
  }
  /**
   * Apply alpha value to object.
   * 应用透明度值到对象
   * @internal Reserved for collision visibility animation
   */
  // @ts-ignore - Reserved method for alpha transitions
  _applyAlphaToObject(e) {
    this._renderObject?.traverse?.((t) => {
      t.material && (Array.isArray(t.material) ? t.material : [t.material]).forEach((i) => {
        i && typeof i.opacity < "u" && (i.opacity = e * (i.userData?.originalOpacity ?? 1), i.transparent = i.opacity < 1, i.needsUpdate = !0);
      });
    });
  }
  /**
   * Called when paint is successfully applied.
   * 样式成功应用后调用
   */
  _onPaintApplied(e) {
    e.config.bloom !== void 0 && (this._bloomHelper.applyStyleBloom(e.config.bloom), this._bloomHelper.applyBloomToObject(this._renderObject));
  }
  /**
   * Initialize geometry (template method).
   * 初始化几何体（模板方法）
   * 
   * @description
   * Calls _buildRenderObject implemented by subclasses and processes pending paint changes.
   * 该方法会调用子类实现的_buildRenderObject方法，并处理积压的样式变更
   * 
   * @returns Promise<void>
   */
  async initializeGeometry() {
    if (!(this._isGeometryInitializing || this._renderObject)) {
      this._isGeometryInitializing = !0;
      try {
        await this._buildRenderObject(), this._paintManager._tryProcessPaintQueue();
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
   * Set paint.
   * 设置样式
   * 
   * @param input - Paint configuration or paint instance. 样式配置或样式实例
   * @returns Current feature instance (supports method chaining). 当前要素实例（支持链式调用）
   */
  setPaint(e) {
    return this._paint = this._paintManager.enqueuePaint(e), this;
  }
  /**
   * Get current paint.
   * 获取当前样式
   * 
   * @returns Current paint or undefined. 当前样式或undefined
   */
  getPaint() {
    return this._paint;
  }
  /**
   * Paint property getter/setter for convenience.
   */
  get paint() {
    return this._paint;
  }
  set paint(e) {
    e && this.setPaint(e);
  }
  /**
   * Set bloom status for the current feature.
   * 设置当前要素的发光状态
   * 
   * @param enabled Whether to enable bloom. 是否启用发光
   * @param options Optional: bloom intensity and color. 可选：发光强度和颜色
   */
  setBloom(e, t) {
    return this._bloomHelper.setBloomConfig(e, t), this._bloomHelper.applyBloomToObject(this._renderObject), this;
  }
  /**
   * Get bloom configuration of the current feature.
   * 获取当前要素的发光配置
   */
  getBloom() {
    return this._bloomHelper.getBloomConfig();
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
    e && this._renderObject ? this._refreshCoordinates() : this._buildRenderObject(), this.fire("move");
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
   * Try to process paint queue. (Internal)
   * 尝试处理样式队列
   */
  _tryProcessQueue() {
    this._paintManager._tryProcessPaintQueue();
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
      e instanceof Be ? (e.geometry?.dispose(), Array.isArray(e.material) ? e.material.forEach((t) => t.dispose()) : e.material?.dispose()) : "isLine" in e && e.isLine && (e.geometry?.dispose(), e.material?.dispose());
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
    return Xd.POINT;
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
    this._paint?.config.collisionPriority ?? // 样式配置优先级  
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
    if (!this.collidable || !this._renderObject) return null;
    try {
      const n = new D();
      this._renderObject.getWorldPosition(n);
      const i = n.clone().project(e);
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
        width: p.width + this._collisionConfig.padding * 2,
        // 宽度 + 边距
        height: p.height + this._collisionConfig.padding * 2,
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
    } catch (n) {
      return console.warn(`Feature ${this._id} 包围盒计算失败:`, n), null;
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
  setCollisionVisibility(e, t = Ln.MANUAL_HIDDEN) {
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
    return this._collisionConfig.enabled = !1, this.setCollisionVisibility(!0, Ln.MANUAL_HIDDEN), this;
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
      t instanceof Be && (Array.isArray(t.material) ? t.material.forEach((n) => {
        n.opacity !== void 0 && (n.opacity = e);
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
      t instanceof Be && (t.material.needsUpdate = !0);
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
      paintConfig: this._paint?.config
    };
  }
  /**
   * Calculate bounding box for collision detection
   * 计算碰撞检测用的包围盒
   * 
   * pointToLngLat world space bounding box to screen space to calculate pixel-level bounding box
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
      const n = new tr().setFromObject(this._renderObject);
      if (n.isEmpty()) return this._getFallbackBoundingBox();
      const i = [
        new D(n.min.x, n.min.y, n.min.z),
        new D(n.max.x, n.min.y, n.min.z),
        new D(n.min.x, n.max.y, n.min.z),
        new D(n.max.x, n.max.y, n.min.z),
        new D(n.min.x, n.min.y, n.max.z),
        new D(n.max.x, n.min.y, n.max.z),
        new D(n.min.x, n.max.y, n.max.z),
        new D(n.max.x, n.max.y, n.max.z)
      ], { width: o, height: l } = t.domElement, c = [];
      i.forEach((k) => {
        const G = k.clone().project(e), V = (G.x * 0.5 + 0.5) * o, F = (-G.y * 0.5 + 0.5) * l;
        c.push(new ce(V, F));
      });
      let u = 1 / 0, f = -1 / 0, p = 1 / 0, d = -1 / 0;
      c.forEach((k) => {
        u = Math.min(u, k.x), f = Math.max(f, k.x), p = Math.min(p, k.y), d = Math.max(d, k.y);
      });
      const g = f - u, y = d - p, x = 4, T = Math.max(g, x), b = Math.max(y, x), L = new D();
      n.getCenter(L);
      const M = L.clone().project(e), A = (M.x * 0.5 + 0.5) * o, R = (-M.y * 0.5 + 0.5) * l;
      return {
        width: T,
        height: b,
        offsetX: u - A,
        // Offset of top-left corner relative to center 左上角相对于中心的偏移
        offsetY: p - R
      };
    } catch (n) {
      return console.warn("Bounding box calculation failed 包围盒计算失败:", n), this._getFallbackBoundingBox();
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
  _tileCoordToLocalWorld(e, t, n, i) {
    const { tileZ: o, tileX: l, tileY: c, extent: u, tileSize: f } = n, p = (e / u - 0.5) * f, d = (0.5 - t / u) * f;
    return i.tileIDToWorldCenter(o, l, c).clone().add(new D(p, d, 0)).sub(i.prjcenter);
  }
}
var ZT = Object.defineProperty, qT = (s, e, t) => e in s ? ZT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, kf = (s, e, t) => qT(s, typeof e != "symbol" ? e + "" : e, t);
class bi extends ha {
  // _collisionDetector: CollisionDetector<T>; // Changed to protected for subclass access 改为protected以便子类访问
  constructor(e, t) {
    super(e, t), kf(this, "_feaList"), kf(this, "_collision", !1), this._feaList = [], t?.collision && (this._collision = !0);
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
    for (const n of t)
      if (!(!n || !(n instanceof gt)) && !n.getLayer()) {
        if (!this.validateFeature(n)) {
          console.error(`Feature ${n.id} does not match the layer's type requirements`);
          continue;
        }
        n._bindLayer(this), this._feaList.push(n), n.getMap() && n._buildRenderObject(), this._clouds && (this.map.sceneRenderer.scene.add(this._clouds), console.log("我是云朵被添加cloud", this.map.sceneRenderer.scene)), this.add(n);
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
    const n = [];
    let i, o;
    for (let l = 0, c = this._feaList.length; l < c; l++)
      i = this._feaList[l], t ? o = e.call(t, i) : o = e(i), o && n.push(i);
    return n;
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
    const n = this._findInList(e);
    n >= 0 && this._feaList.splice(n, 1), e.parent && e.parent === this ? this.remove(e) : console.warn("Feature parent mismatch:", e.parent), this._disposeFeatureResources(e);
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
    let n = 0, i = t - 1, o;
    for (; n <= i; ) {
      if (o = Math.floor((n + i) / 2), this._feaList[o] === e)
        return o;
      n = o + 1;
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
      e.geometry && e.geometry.dispose && e.geometry.dispose(), e.material && (Array.isArray(e.material) ? e.material.forEach((t) => t.dispose?.()) : e.material.dispose && e.material.dispose()), e instanceof gn && e.traverse((t) => {
        t !== e && this._disposeFeatureResources(t);
      });
    } catch (t) {
      console.error("Error disposing feature resources:", t);
    }
  }
  // override animate(delta: number, elapsedtime: number, context: SceneRenderer) {
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
var KT = Object.defineProperty, QT = (s, e, t) => e in s ? KT(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, zf = (s, e, t) => QT(s, typeof e != "symbol" ? e + "" : e, t);
class JT extends Qt {
  constructor() {
    super(...arguments), zf(this, "_layers", /* @__PURE__ */ new Set()), zf(this, "_layerids", /* @__PURE__ */ new Set());
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
      if (!(t instanceof ha))
        throw new Error("LayerContainer can only contain Layer instances! LayerContainer只能包含Layer实例!");
      const n = t.getId();
      if (this._layerids.has(n))
        throw new Error(`Layer with ID '${n}' already exists in the container! ID为'${n}'的图层已存在于容器中!`);
      this._layers.add(t), this._layerids.add(n), super.add(t);
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
var eS = Object.defineProperty, tS = (s, e, t) => e in s ? eS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, nS = (s, e, t) => tS(s, e + "", t);
class iS {
  constructor() {
    nS(this, "canvasDict", {});
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
  getCanvas(e = 40, t = 30, n = 1, i) {
    const o = Math.ceil(e * n), l = Math.ceil(t * n), c = i ? `${o}_${l}_${i}` : `${o}_${l}`;
    if (!this.canvasDict[c]) {
      const p = document.createElement("canvas");
      p.width = o, p.height = l, this.canvasDict[c] = p;
    }
    const u = this.canvasDict[c], f = u.getContext("2d");
    return f.setTransform(1, 0, 0, 1, 0, 0), f.clearRect(0, 0, u.width, u.height), f.scale(n, n), u;
  }
}
function rS(s) {
  const e = +this._x.call(null, s), t = +this._y.call(null, s);
  return rp(this.cover(e, t), e, t, s);
}
function rp(s, e, t, n) {
  if (isNaN(e) || isNaN(t)) return s;
  var i, o = s._root, l = { data: n }, c = s._x0, u = s._y0, f = s._x1, p = s._y1, d, g, y, x, T, b, L, M;
  if (!o) return s._root = l, s;
  for (; o.length; )
    if ((T = e >= (d = (c + f) / 2)) ? c = d : f = d, (b = t >= (g = (u + p) / 2)) ? u = g : p = g, i = o, !(o = o[L = b << 1 | T])) return i[L] = l, s;
  if (y = +s._x.call(null, o.data), x = +s._y.call(null, o.data), e === y && t === x) return l.next = o, i ? i[L] = l : s._root = l, s;
  do
    i = i ? i[L] = new Array(4) : s._root = new Array(4), (T = e >= (d = (c + f) / 2)) ? c = d : f = d, (b = t >= (g = (u + p) / 2)) ? u = g : p = g;
  while ((L = b << 1 | T) === (M = (x >= g) << 1 | y >= d));
  return i[M] = o, i[L] = l, s;
}
function sS(s) {
  var e, t, n = s.length, i, o, l = new Array(n), c = new Array(n), u = 1 / 0, f = 1 / 0, p = -1 / 0, d = -1 / 0;
  for (t = 0; t < n; ++t)
    isNaN(i = +this._x.call(null, e = s[t])) || isNaN(o = +this._y.call(null, e)) || (l[t] = i, c[t] = o, i < u && (u = i), i > p && (p = i), o < f && (f = o), o > d && (d = o));
  if (u > p || f > d) return this;
  for (this.cover(u, f).cover(p, d), t = 0; t < n; ++t)
    rp(this, l[t], c[t], s[t]);
  return this;
}
function oS(s, e) {
  if (isNaN(s = +s) || isNaN(e = +e)) return this;
  var t = this._x0, n = this._y0, i = this._x1, o = this._y1;
  if (isNaN(t))
    i = (t = Math.floor(s)) + 1, o = (n = Math.floor(e)) + 1;
  else {
    for (var l = i - t || 1, c = this._root, u, f; t > s || s >= i || n > e || e >= o; )
      switch (f = (e < n) << 1 | s < t, u = new Array(4), u[f] = c, c = u, l *= 2, f) {
        case 0:
          i = t + l, o = n + l;
          break;
        case 1:
          t = i - l, o = n + l;
          break;
        case 2:
          i = t + l, n = o - l;
          break;
        case 3:
          t = i - l, n = o - l;
          break;
      }
    this._root && this._root.length && (this._root = c);
  }
  return this._x0 = t, this._y0 = n, this._x1 = i, this._y1 = o, this;
}
function aS() {
  var s = [];
  return this.visit(function(e) {
    if (!e.length) do
      s.push(e.data);
    while (e = e.next);
  }), s;
}
function lS(s) {
  return arguments.length ? this.cover(+s[0][0], +s[0][1]).cover(+s[1][0], +s[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function pt(s, e, t, n, i) {
  this.node = s, this.x0 = e, this.y0 = t, this.x1 = n, this.y1 = i;
}
function cS(s, e, t) {
  var n, i = this._x0, o = this._y0, l, c, u, f, p = this._x1, d = this._y1, g = [], y = this._root, x, T;
  for (y && g.push(new pt(y, i, o, p, d)), t == null ? t = 1 / 0 : (i = s - t, o = e - t, p = s + t, d = e + t, t *= t); x = g.pop(); )
    if (!(!(y = x.node) || (l = x.x0) > p || (c = x.y0) > d || (u = x.x1) < i || (f = x.y1) < o))
      if (y.length) {
        var b = (l + u) / 2, L = (c + f) / 2;
        g.push(
          new pt(y[3], b, L, u, f),
          new pt(y[2], l, L, b, f),
          new pt(y[1], b, c, u, L),
          new pt(y[0], l, c, b, L)
        ), (T = (e >= L) << 1 | s >= b) && (x = g[g.length - 1], g[g.length - 1] = g[g.length - 1 - T], g[g.length - 1 - T] = x);
      } else {
        var M = s - +this._x.call(null, y.data), A = e - +this._y.call(null, y.data), R = M * M + A * A;
        if (R < t) {
          var k = Math.sqrt(t = R);
          i = s - k, o = e - k, p = s + k, d = e + k, n = y.data;
        }
      }
  return n;
}
function uS(s) {
  if (isNaN(p = +this._x.call(null, s)) || isNaN(d = +this._y.call(null, s))) return this;
  var e, t = this._root, n, i, o, l = this._x0, c = this._y0, u = this._x1, f = this._y1, p, d, g, y, x, T, b, L;
  if (!t) return this;
  if (t.length) for (; ; ) {
    if ((x = p >= (g = (l + u) / 2)) ? l = g : u = g, (T = d >= (y = (c + f) / 2)) ? c = y : f = y, e = t, !(t = t[b = T << 1 | x])) return this;
    if (!t.length) break;
    (e[b + 1 & 3] || e[b + 2 & 3] || e[b + 3 & 3]) && (n = e, L = b);
  }
  for (; t.data !== s; ) if (i = t, !(t = t.next)) return this;
  return (o = t.next) && delete t.next, i ? (o ? i.next = o : delete i.next, this) : e ? (o ? e[b] = o : delete e[b], (t = e[0] || e[1] || e[2] || e[3]) && t === (e[3] || e[2] || e[1] || e[0]) && !t.length && (n ? n[L] = t : this._root = t), this) : (this._root = o, this);
}
function hS(s) {
  for (var e = 0, t = s.length; e < t; ++e) this.remove(s[e]);
  return this;
}
function fS() {
  return this._root;
}
function dS() {
  var s = 0;
  return this.visit(function(e) {
    if (!e.length) do
      ++s;
    while (e = e.next);
  }), s;
}
function pS(s) {
  var e = [], t, n = this._root, i, o, l, c, u;
  for (n && e.push(new pt(n, this._x0, this._y0, this._x1, this._y1)); t = e.pop(); )
    if (!s(n = t.node, o = t.x0, l = t.y0, c = t.x1, u = t.y1) && n.length) {
      var f = (o + c) / 2, p = (l + u) / 2;
      (i = n[3]) && e.push(new pt(i, f, p, c, u)), (i = n[2]) && e.push(new pt(i, o, p, f, u)), (i = n[1]) && e.push(new pt(i, f, l, c, p)), (i = n[0]) && e.push(new pt(i, o, l, f, p));
    }
  return this;
}
function mS(s) {
  var e = [], t = [], n;
  for (this._root && e.push(new pt(this._root, this._x0, this._y0, this._x1, this._y1)); n = e.pop(); ) {
    var i = n.node;
    if (i.length) {
      var o, l = n.x0, c = n.y0, u = n.x1, f = n.y1, p = (l + u) / 2, d = (c + f) / 2;
      (o = i[0]) && e.push(new pt(o, l, c, p, d)), (o = i[1]) && e.push(new pt(o, p, c, u, d)), (o = i[2]) && e.push(new pt(o, l, d, p, f)), (o = i[3]) && e.push(new pt(o, p, d, u, f));
    }
    t.push(n);
  }
  for (; n = t.pop(); )
    s(n.node, n.x0, n.y0, n.x1, n.y1);
  return this;
}
function gS(s) {
  return s[0];
}
function _S(s) {
  return arguments.length ? (this._x = s, this) : this._x;
}
function yS(s) {
  return s[1];
}
function vS(s) {
  return arguments.length ? (this._y = s, this) : this._y;
}
function sp(s, e, t) {
  var n = new Lc(e ?? gS, t ?? yS, NaN, NaN, NaN, NaN);
  return s == null ? n : n.addAll(s);
}
function Lc(s, e, t, n, i, o) {
  this._x = s, this._y = e, this._x0 = t, this._y0 = n, this._x1 = i, this._y1 = o, this._root = void 0;
}
function Nf(s) {
  for (var e = { data: s.data }, t = e; s = s.next; ) t = t.next = { data: s.data };
  return e;
}
var _t = sp.prototype = Lc.prototype;
_t.copy = function() {
  var s = new Lc(this._x, this._y, this._x0, this._y0, this._x1, this._y1), e = this._root, t, n;
  if (!e) return s;
  if (!e.length) return s._root = Nf(e), s;
  for (t = [{ source: e, target: s._root = new Array(4) }]; e = t.pop(); )
    for (var i = 0; i < 4; ++i)
      (n = e.source[i]) && (n.length ? t.push({ source: n, target: e.target[i] = new Array(4) }) : e.target[i] = Nf(n));
  return s;
};
_t.add = rS;
_t.addAll = sS;
_t.cover = oS;
_t.data = aS;
_t.extent = lS;
_t.find = cS;
_t.remove = uS;
_t.removeAll = hS;
_t.root = fS;
_t.size = dS;
_t.visit = pS;
_t.visitAfter = mS;
_t.x = _S;
_t.y = vS;
var wS = Object.defineProperty, bS = (s, e, t) => e in s ? wS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Hf = (s, e, t) => bS(s, typeof e != "symbol" ? e + "" : e, t);
class op {
  /**
   * Constructor
   * 构造函数
   * 
   * @param viewport Viewport dimensions defining the QuadTree boundaries
   *                 视口尺寸，定义四叉树的边界范围
   */
  constructor(e) {
    Hf(this, "_quadtree"), Hf(this, "_viewport"), this._viewport = e, this._rebuildQuadTree();
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
    const t = [], n = this._getSearchBounds(e);
    return this._quadtree.visit((i, o, l, c, u) => this._checkNodeCollision(n, o, l, c, u) ? (i.length || this._getNodeData(i).forEach((p) => {
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
        const n = this._getNodeData(t);
        e.push(...n);
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
    this._quadtree = sp().x((e) => e.x).y((e) => e.y).extent([[0, 0], [this._viewport.width, this._viewport.height]]);
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
    const t = e.width / 2, n = e.height / 2;
    return e.x + t >= 0 && // Right edge within right of viewport 右边界在视口右侧以内
    e.x - t <= this._viewport.width && // Left edge within left of viewport 左边界在视口左侧以内
    e.y + n >= 0 && // Bottom edge within bottom of viewport 下边界在视口底部以内
    e.y - n <= this._viewport.height;
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
  _checkNodeCollision(e, t, n, i, o) {
    const l = (t + i) / 2, c = (n + o) / 2, u = i - t, f = o - n;
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
    const n = this.getAllBoxes().filter((i) => i.id !== e);
    this.clear(), n.length > 0 && this.addBoxes(n);
  }
}
var xS = Object.defineProperty, TS = (s, e, t) => e in s ? xS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Vf = (s, e, t) => TS(s, typeof e != "symbol" ? e + "" : e, t);
class SS {
  constructor() {
    Vf(this, "_strategies", /* @__PURE__ */ new Map()), Vf(this, "_executionOrder", []);
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
    const n = /* @__PURE__ */ new Map();
    e.forEach((i) => {
      n.set(i._id, {
        featureId: i._id,
        visible: !0,
        reason: Ln.NO_COLLISION,
        collidedWith: [],
        timestamp: t.timestamp
      });
    });
    for (const i of this._executionOrder) {
      const o = this._strategies.get(i);
      if (o?.enabled)
        try {
          const l = await o.execute(e, t, n);
          this._mergeResults(n, l);
        } catch (l) {
          console.error(`Strategy ${i} execution failed: 策略 ${i} 执行失败:`, l);
        }
    }
    return n;
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
    t.forEach((n) => {
      const i = e.get(n.featureId);
      i && !i.visible || e.set(n.featureId, n);
    });
  }
}
var MS = Object.defineProperty, AS = (s, e, t) => e in s ? MS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Gi = (s, e, t) => AS(s, typeof e != "symbol" ? e + "" : e, t);
class PS {
  constructor() {
    Gi(this, "frameStats", /* @__PURE__ */ new Map()), Gi(this, "summaryStats", {
      totalFrames: 0,
      averageFrameTime: 0,
      averageFPS: 0,
      minFrameTime: 1 / 0,
      maxFrameTime: 0,
      totalFeaturesProcessed: 0
    }), Gi(this, "sampleWindowSize", 60), Gi(this, "currentFrameId", 0), Gi(this, "lastReportTime", 0), Gi(this, "reportInterval", 5e3), Gi(this, "performanceThresholds", {
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
    const n = this.frameStats.get(e);
    if (!n) return;
    const i = performance.now();
    n.endTime = i, n.duration = i - n.startTime, t && Object.assign(n, t), "memory" in performance && (n.memoryUsage = performance.memory.usedJSHeapSize), this.updateSummaryStats(n), this.maybeOutputReport();
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
    const n = this.frameStats.get(this.currentFrameId);
    n && n.strategyTimes.set(e, t);
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
    const e = this.getRecentFrames(this.sampleWindowSize), t = this.calculateFPS(e), n = this.calculateAverageFrameTime(e);
    return {
      summary: { ...this.summaryStats },
      recent: {
        fps: t,
        frameTime: n,
        frameTimeStdDev: this.calculateFrameTimeStdDev(e),
        averageFeaturesPerFrame: this.calculateAverageFeatures(e),
        performanceLevel: this.getPerformanceLevel(n)
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
    this.frameStats.size > this.sampleWindowSize * 2 && Array.from(this.frameStats.keys()).sort((t, n) => t - n).slice(0, this.frameStats.size - this.sampleWindowSize).forEach((t) => {
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
    return Array.from(this.frameStats.values()).slice(-e).filter((n) => n.duration > 0);
  }
  calculateFPS(e) {
    if (e.length === 0) return 0;
    const t = this.calculateAverageFrameTime(e);
    return t > 0 ? 1e3 / t : 0;
  }
  calculateAverageFrameTime(e) {
    return e.length === 0 ? 0 : e.reduce((t, n) => t + n.duration, 0) / e.length;
  }
  calculateFrameTimeStdDev(e) {
    if (e.length === 0) return 0;
    const t = this.calculateAverageFrameTime(e), n = e.map((i) => Math.pow(i.duration - t, 2));
    return Math.sqrt(n.reduce((i, o) => i + o, 0) / e.length);
  }
  calculateAverageFeatures(e) {
    return e.length === 0 ? 0 : e.reduce((t, n) => t + (n.featureCount || 0), 0) / e.length;
  }
  getPerformanceLevel(e) {
    return e > this.performanceThresholds.criticalFrameTime ? "critical" : e > this.performanceThresholds.warningFrameTime ? "warning" : e > this.performanceThresholds.idealFrameTime ? "good" : "excellent";
  }
  getStrategyPerformance(e) {
    const t = /* @__PURE__ */ new Map();
    return e.forEach((n) => {
      n.strategyTimes.forEach((i, o) => {
        t.has(o) || t.set(o, []), t.get(o).push(i);
      });
    }), Array.from(t.entries()).map(([n, i]) => ({
      name: n,
      averageTime: i.reduce((o, l) => o + l, 0) / i.length,
      maxTime: Math.max(...i),
      minTime: Math.min(...i),
      callCount: i.length
    }));
  }
  getPerformanceWarnings(e) {
    const t = [], n = e.slice(-30);
    if (n.length === 0) return t;
    const i = this.calculateAverageFrameTime(n);
    i > this.performanceThresholds.criticalFrameTime ? t.push({
      type: "critical",
      message: `帧率过低: ${Math.round(1e3 / i)}fps`,
      suggestion: "考虑减少要素数量或简化避让策略"
    }) : i > this.performanceThresholds.warningFrameTime && t.push({
      type: "warning",
      message: `帧率较低: ${Math.round(1e3 / i)}fps`,
      suggestion: "建议优化避让算法或增加更新间隔"
    });
    const o = n.map((l) => l.memoryUsage).filter((l) => l > 0);
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
    const t = e.slice(0, Math.floor(e.length / 2)), n = e.slice(Math.floor(e.length / 2)), i = this.calculateAverageFrameTime(t), l = (this.calculateAverageFrameTime(n) - i) / i * 100;
    return {
      frameTime: Math.abs(l) < 5 ? "stable" : l > 0 ? "worsening" : "improving",
      fps: Math.abs(l) < 5 ? "stable" : l > 0 ? "improving" : "worsening",
      features: "stable"
      // 可根据实际情况计算
    };
  }
  getPerformanceRecommendations(e) {
    const t = [];
    return e.recent.performanceLevel === "critical" && (t.push("建议启用要素抽样或聚合显示"), t.push("考虑增加避让更新间隔时间"), t.push("检查是否有不必要的避让策略")), e.recent.averageFeaturesPerFrame > 5e3 && t.push("要素数量过多，建议启用LOD分级"), e.strategies.forEach((n) => {
      n.averageTime > 10 && t.push(`策略 "${n.name}" 执行时间较长，考虑优化`);
    }), t;
  }
}
var LS = Object.defineProperty, ES = (s, e, t) => e in s ? LS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, No = (s, e, t) => ES(s, typeof e != "symbol" ? e + "" : e, t);
class CS {
  constructor() {
    No(this, "name", "priority"), No(this, "enabled", !0), No(this, "weight", 1), No(this, "description", "Priority-based avoidance strategy, smaller value means higher priority 基于优先级的避让策略，数值越小优先级越高");
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
  async execute(e, t, n) {
    const i = [], o = new op(t.viewport), l = [], c = /* @__PURE__ */ new Map();
    return e.forEach((u) => {
      if (!u.collidable) return;
      const f = u.getScreenBoundingBox(t.camera, t.renderer);
      f && (l.push(f), c.set(u._id, u), n?.get(u._id)?.visible);
    }), l.sort((u, f) => u.priority - f.priority), l.forEach((u) => {
      const f = o.findCollisions(u);
      f.length === 0 ? (o.addBoxes([u]), i.push({
        featureId: u.featureId,
        visible: !0,
        reason: Ln.NO_COLLISION,
        // No collision reason 无碰撞原因
        collidedWith: [],
        // No collision object 无碰撞对象
        timestamp: t.timestamp
      })) : f.some(
        (d) => d.priority < u.priority
      ) ? i.push({
        featureId: u.featureId,
        visible: !1,
        reason: Ln.PRIORITY_LOST,
        // Priority lost reason 优先级不足原因
        collidedWith: f.map((d) => d.featureId),
        // Record all colliding objects 记录所有碰撞对象
        timestamp: t.timestamp
      }) : (o.addBoxes([u]), i.push({
        featureId: u.featureId,
        visible: !0,
        reason: Ln.NO_COLLISION,
        collidedWith: [],
        timestamp: t.timestamp
      }), f.forEach((d) => {
        i.push({
          featureId: d.featureId,
          visible: !1,
          reason: Ln.PRIORITY_LOST,
          collidedWith: [u.featureId],
          // Record replaced by which feature 记录被哪个要素替换
          timestamp: t.timestamp
        });
      }));
    }), i;
  }
}
var OS = Object.defineProperty, RS = (s, e, t) => e in s ? OS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, li = (s, e, t) => RS(s, typeof e != "symbol" ? e + "" : e, t);
class DS {
  /**
   * Create collision detection engine instance
   * 创建碰撞检测引擎实例
   * 
   * @param renderer - Three.js renderer instance Three.js 渲染器实例
   * @param config - Collision detection configuration options 碰撞检测配置选项
   */
  constructor(e, t = {}) {
    this.renderer = e, li(this, "_quadTreeManager"), li(this, "_strategyOrchestrator"), li(this, "_performanceMonitor"), li(this, "_layers", /* @__PURE__ */ new Set()), li(this, "_config"), li(this, "_isUpdating", !1), li(this, "_lastUpdateTime", 0), li(this, "_frameCount", 0), this._config = {
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
        const n = this._createCollisionContext(e, t), i = this._collectCollidableFeatures();
        if (i.length === 0)
          return;
        this._performanceMonitor.startFrame(this._frameCount);
        const o = await this._strategyOrchestrator.executeStrategies(i, n);
        await this._applyCollisionResults(o, i), this._performanceMonitor.endFrame(this._frameCount, {
          featureCount: i.length,
          visibleCount: Array.from(o.values()).filter((l) => l.visible).length,
          hiddenCount: Array.from(o.values()).filter((l) => !l.visible).length
        }), this._lastUpdateTime = t;
      } catch (n) {
        console.error("避让引擎更新失败:", n);
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
      e.getFeatures().filter((n) => n.collidable).forEach((n) => {
        n.setCollisionVisibility(!0, Ln.NO_COLLISION);
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
    this._quadTreeManager = new op(e), this._strategyOrchestrator = new SS(), this._performanceMonitor = new PS(), this._strategyOrchestrator.registerStrategy(new CS(), 0), this._setupViewportResizeHandler();
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
      const n = t.getFeatures().filter(
        (i) => i.collidable && i instanceof gt
      );
      if (e.length + n.length > this._config.maxFeaturesPerFrame) {
        console.warn(`达到每帧最大要素处理限制: ${this._config.maxFeaturesPerFrame}`);
        return;
      }
      e.push(...n);
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
    const n = t.map((i) => {
      const o = e.get(i._id);
      return o && i.setCollisionVisibility(
        o.visible,
        o.reason
      ), Promise.resolve();
    });
    await Promise.all(n);
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
      t.forEach((n) => {
        const { width: i, height: o } = n.contentRect;
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
var Ho = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, xs = { exports: {} };
var IS = xs.exports, Wf;
function FS() {
  return Wf || (Wf = 1, (function(s, e) {
    (function() {
      var t, n = "4.17.21", i = 200, o = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", l = "Expected a function", c = "Invalid `variable` option passed into `_.template`", u = "__lodash_hash_undefined__", f = 500, p = "__lodash_placeholder__", d = 1, g = 2, y = 4, x = 1, T = 2, b = 1, L = 2, M = 4, A = 8, R = 16, k = 32, G = 64, V = 128, F = 256, $ = 512, z = 30, U = "...", X = 800, q = 16, Z = 1, ee = 2, Q = 3, Le = 1 / 0, we = 9007199254740991, xe = 17976931348623157e292, ge = NaN, Ee = 4294967295, Ce = Ee - 1, Oe = Ee >>> 1, ct = [
        ["ary", V],
        ["bind", b],
        ["bindKey", L],
        ["curry", A],
        ["curryRight", R],
        ["flip", $],
        ["partial", k],
        ["partialRight", G],
        ["rearg", F]
      ], ut = "[object Arguments]", Bt = "[object Array]", en = "[object AsyncFunction]", yt = "[object Boolean]", tn = "[object Date]", rr = "[object DOMException]", Rn = "[object Error]", nn = "[object Function]", Dn = "[object GeneratorFunction]", Ge = "[object Map]", At = "[object Number]", Si = "[object Null]", vt = "[object Object]", Mi = "[object Promise]", sr = "[object Proxy]", Ai = "[object RegExp]", Pt = "[object Set]", Xn = "[object String]", Yn = "[object Symbol]", Pi = "[object Undefined]", Li = "[object WeakMap]", pa = "[object WeakSet]", Zn = "[object ArrayBuffer]", vn = "[object DataView]", Hr = "[object Float32Array]", Vr = "[object Float64Array]", or = "[object Int8Array]", Wr = "[object Int16Array]", Gr = "[object Int32Array]", ar = "[object Uint8Array]", Ei = "[object Uint8ClampedArray]", O = "[object Uint16Array]", j = "[object Uint32Array]", se = /\b__p \+= '';/g, ve = /\b(__p \+=) '' \+/g, $e = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ut = /&(?:amp|lt|gt|quot|#39);/g, rn = /[&<>"']/g, Dc = RegExp(Ut.source), Ns = RegExp(rn.source), sn = /<%-([\s\S]+?)%>/g, on = /<%([\s\S]+?)%>/g, qn = /<%=([\s\S]+?)%>/g, Ci = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Oi = /^\w*$/, lr = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, ma = /[\\^$.*+?()[\]{}|]/g, xp = RegExp(ma.source), ga = /^\s+/, Tp = /\s/, Sp = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Mp = /\{\n\/\* \[wrapped with (.+)\] \*/, Ap = /,? & /, Pp = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, Lp = /[()=,{}\[\]\/\s]/, Ep = /\\(\\)?/g, Cp = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ic = /\w*$/, Op = /^[-+]0x[0-9a-f]+$/i, Rp = /^0b[01]+$/i, Dp = /^\[object .+?Constructor\]$/, Ip = /^0o[0-7]+$/i, Fp = /^(?:0|[1-9]\d*)$/, Bp = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Hs = /($^)/, Up = /['\n\r\u2028\u2029\\]/g, Vs = "\\ud800-\\udfff", kp = "\\u0300-\\u036f", zp = "\\ufe20-\\ufe2f", Np = "\\u20d0-\\u20ff", Fc = kp + zp + Np, Bc = "\\u2700-\\u27bf", Uc = "a-z\\xdf-\\xf6\\xf8-\\xff", Hp = "\\xac\\xb1\\xd7\\xf7", Vp = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Wp = "\\u2000-\\u206f", Gp = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", kc = "A-Z\\xc0-\\xd6\\xd8-\\xde", zc = "\\ufe0e\\ufe0f", Nc = Hp + Vp + Wp + Gp, _a = "['’]", $p = "[" + Vs + "]", Hc = "[" + Nc + "]", Ws = "[" + Fc + "]", Vc = "\\d+", jp = "[" + Bc + "]", Wc = "[" + Uc + "]", Gc = "[^" + Vs + Nc + Vc + Bc + Uc + kc + "]", ya = "\\ud83c[\\udffb-\\udfff]", Xp = "(?:" + Ws + "|" + ya + ")", $c = "[^" + Vs + "]", va = "(?:\\ud83c[\\udde6-\\uddff]){2}", wa = "[\\ud800-\\udbff][\\udc00-\\udfff]", cr = "[" + kc + "]", jc = "\\u200d", Xc = "(?:" + Wc + "|" + Gc + ")", Yp = "(?:" + cr + "|" + Gc + ")", Yc = "(?:" + _a + "(?:d|ll|m|re|s|t|ve))?", Zc = "(?:" + _a + "(?:D|LL|M|RE|S|T|VE))?", qc = Xp + "?", Kc = "[" + zc + "]?", Zp = "(?:" + jc + "(?:" + [$c, va, wa].join("|") + ")" + Kc + qc + ")*", qp = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Kp = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Qc = Kc + qc + Zp, Qp = "(?:" + [jp, va, wa].join("|") + ")" + Qc, Jp = "(?:" + [$c + Ws + "?", Ws, va, wa, $p].join("|") + ")", em = RegExp(_a, "g"), tm = RegExp(Ws, "g"), ba = RegExp(ya + "(?=" + ya + ")|" + Jp + Qc, "g"), nm = RegExp([
        cr + "?" + Wc + "+" + Yc + "(?=" + [Hc, cr, "$"].join("|") + ")",
        Yp + "+" + Zc + "(?=" + [Hc, cr + Xc, "$"].join("|") + ")",
        cr + "?" + Xc + "+" + Yc,
        cr + "+" + Zc,
        Kp,
        qp,
        Vc,
        Qp
      ].join("|"), "g"), im = RegExp("[" + jc + Vs + Fc + zc + "]"), rm = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, sm = [
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
      ], om = -1, De = {};
      De[Hr] = De[Vr] = De[or] = De[Wr] = De[Gr] = De[ar] = De[Ei] = De[O] = De[j] = !0, De[ut] = De[Bt] = De[Zn] = De[yt] = De[vn] = De[tn] = De[Rn] = De[nn] = De[Ge] = De[At] = De[vt] = De[Ai] = De[Pt] = De[Xn] = De[Li] = !1;
      var Re = {};
      Re[ut] = Re[Bt] = Re[Zn] = Re[vn] = Re[yt] = Re[tn] = Re[Hr] = Re[Vr] = Re[or] = Re[Wr] = Re[Gr] = Re[Ge] = Re[At] = Re[vt] = Re[Ai] = Re[Pt] = Re[Xn] = Re[Yn] = Re[ar] = Re[Ei] = Re[O] = Re[j] = !0, Re[Rn] = Re[nn] = Re[Li] = !1;
      var am = {
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
      }, lm = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }, cm = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'"
      }, um = {
        "\\": "\\",
        "'": "'",
        "\n": "n",
        "\r": "r",
        "\u2028": "u2028",
        "\u2029": "u2029"
      }, hm = parseFloat, fm = parseInt, Jc = typeof Ho == "object" && Ho && Ho.Object === Object && Ho, dm = typeof self == "object" && self && self.Object === Object && self, Ze = Jc || dm || Function("return this")(), xa = e && !e.nodeType && e, Ri = xa && !0 && s && !s.nodeType && s, eu = Ri && Ri.exports === xa, Ta = eu && Jc.process, kt = (function() {
        try {
          var E = Ri && Ri.require && Ri.require("util").types;
          return E || Ta && Ta.binding && Ta.binding("util");
        } catch {
        }
      })(), tu = kt && kt.isArrayBuffer, nu = kt && kt.isDate, iu = kt && kt.isMap, ru = kt && kt.isRegExp, su = kt && kt.isSet, ou = kt && kt.isTypedArray;
      function Lt(E, B, I) {
        switch (I.length) {
          case 0:
            return E.call(B);
          case 1:
            return E.call(B, I[0]);
          case 2:
            return E.call(B, I[0], I[1]);
          case 3:
            return E.call(B, I[0], I[1], I[2]);
        }
        return E.apply(B, I);
      }
      function pm(E, B, I, K) {
        for (var ae = -1, Te = E == null ? 0 : E.length; ++ae < Te; ) {
          var je = E[ae];
          B(K, je, I(je), E);
        }
        return K;
      }
      function zt(E, B) {
        for (var I = -1, K = E == null ? 0 : E.length; ++I < K && B(E[I], I, E) !== !1; )
          ;
        return E;
      }
      function mm(E, B) {
        for (var I = E == null ? 0 : E.length; I-- && B(E[I], I, E) !== !1; )
          ;
        return E;
      }
      function au(E, B) {
        for (var I = -1, K = E == null ? 0 : E.length; ++I < K; )
          if (!B(E[I], I, E))
            return !1;
        return !0;
      }
      function Kn(E, B) {
        for (var I = -1, K = E == null ? 0 : E.length, ae = 0, Te = []; ++I < K; ) {
          var je = E[I];
          B(je, I, E) && (Te[ae++] = je);
        }
        return Te;
      }
      function Gs(E, B) {
        var I = E == null ? 0 : E.length;
        return !!I && ur(E, B, 0) > -1;
      }
      function Sa(E, B, I) {
        for (var K = -1, ae = E == null ? 0 : E.length; ++K < ae; )
          if (I(B, E[K]))
            return !0;
        return !1;
      }
      function Fe(E, B) {
        for (var I = -1, K = E == null ? 0 : E.length, ae = Array(K); ++I < K; )
          ae[I] = B(E[I], I, E);
        return ae;
      }
      function Qn(E, B) {
        for (var I = -1, K = B.length, ae = E.length; ++I < K; )
          E[ae + I] = B[I];
        return E;
      }
      function Ma(E, B, I, K) {
        var ae = -1, Te = E == null ? 0 : E.length;
        for (K && Te && (I = E[++ae]); ++ae < Te; )
          I = B(I, E[ae], ae, E);
        return I;
      }
      function gm(E, B, I, K) {
        var ae = E == null ? 0 : E.length;
        for (K && ae && (I = E[--ae]); ae--; )
          I = B(I, E[ae], ae, E);
        return I;
      }
      function Aa(E, B) {
        for (var I = -1, K = E == null ? 0 : E.length; ++I < K; )
          if (B(E[I], I, E))
            return !0;
        return !1;
      }
      var _m = Pa("length");
      function ym(E) {
        return E.split("");
      }
      function vm(E) {
        return E.match(Pp) || [];
      }
      function lu(E, B, I) {
        var K;
        return I(E, function(ae, Te, je) {
          if (B(ae, Te, je))
            return K = Te, !1;
        }), K;
      }
      function $s(E, B, I, K) {
        for (var ae = E.length, Te = I + (K ? 1 : -1); K ? Te-- : ++Te < ae; )
          if (B(E[Te], Te, E))
            return Te;
        return -1;
      }
      function ur(E, B, I) {
        return B === B ? Om(E, B, I) : $s(E, cu, I);
      }
      function wm(E, B, I, K) {
        for (var ae = I - 1, Te = E.length; ++ae < Te; )
          if (K(E[ae], B))
            return ae;
        return -1;
      }
      function cu(E) {
        return E !== E;
      }
      function uu(E, B) {
        var I = E == null ? 0 : E.length;
        return I ? Ea(E, B) / I : ge;
      }
      function Pa(E) {
        return function(B) {
          return B == null ? t : B[E];
        };
      }
      function La(E) {
        return function(B) {
          return E == null ? t : E[B];
        };
      }
      function hu(E, B, I, K, ae) {
        return ae(E, function(Te, je, Ae) {
          I = K ? (K = !1, Te) : B(I, Te, je, Ae);
        }), I;
      }
      function bm(E, B) {
        var I = E.length;
        for (E.sort(B); I--; )
          E[I] = E[I].value;
        return E;
      }
      function Ea(E, B) {
        for (var I, K = -1, ae = E.length; ++K < ae; ) {
          var Te = B(E[K]);
          Te !== t && (I = I === t ? Te : I + Te);
        }
        return I;
      }
      function Ca(E, B) {
        for (var I = -1, K = Array(E); ++I < E; )
          K[I] = B(I);
        return K;
      }
      function xm(E, B) {
        return Fe(B, function(I) {
          return [I, E[I]];
        });
      }
      function fu(E) {
        return E && E.slice(0, gu(E) + 1).replace(ga, "");
      }
      function Et(E) {
        return function(B) {
          return E(B);
        };
      }
      function Oa(E, B) {
        return Fe(B, function(I) {
          return E[I];
        });
      }
      function $r(E, B) {
        return E.has(B);
      }
      function du(E, B) {
        for (var I = -1, K = E.length; ++I < K && ur(B, E[I], 0) > -1; )
          ;
        return I;
      }
      function pu(E, B) {
        for (var I = E.length; I-- && ur(B, E[I], 0) > -1; )
          ;
        return I;
      }
      function Tm(E, B) {
        for (var I = E.length, K = 0; I--; )
          E[I] === B && ++K;
        return K;
      }
      var Sm = La(am), Mm = La(lm);
      function Am(E) {
        return "\\" + um[E];
      }
      function Pm(E, B) {
        return E == null ? t : E[B];
      }
      function hr(E) {
        return im.test(E);
      }
      function Lm(E) {
        return rm.test(E);
      }
      function Em(E) {
        for (var B, I = []; !(B = E.next()).done; )
          I.push(B.value);
        return I;
      }
      function Ra(E) {
        var B = -1, I = Array(E.size);
        return E.forEach(function(K, ae) {
          I[++B] = [ae, K];
        }), I;
      }
      function mu(E, B) {
        return function(I) {
          return E(B(I));
        };
      }
      function Jn(E, B) {
        for (var I = -1, K = E.length, ae = 0, Te = []; ++I < K; ) {
          var je = E[I];
          (je === B || je === p) && (E[I] = p, Te[ae++] = I);
        }
        return Te;
      }
      function js(E) {
        var B = -1, I = Array(E.size);
        return E.forEach(function(K) {
          I[++B] = K;
        }), I;
      }
      function Cm(E) {
        var B = -1, I = Array(E.size);
        return E.forEach(function(K) {
          I[++B] = [K, K];
        }), I;
      }
      function Om(E, B, I) {
        for (var K = I - 1, ae = E.length; ++K < ae; )
          if (E[K] === B)
            return K;
        return -1;
      }
      function Rm(E, B, I) {
        for (var K = I + 1; K--; )
          if (E[K] === B)
            return K;
        return K;
      }
      function fr(E) {
        return hr(E) ? Im(E) : _m(E);
      }
      function an(E) {
        return hr(E) ? Fm(E) : ym(E);
      }
      function gu(E) {
        for (var B = E.length; B-- && Tp.test(E.charAt(B)); )
          ;
        return B;
      }
      var Dm = La(cm);
      function Im(E) {
        for (var B = ba.lastIndex = 0; ba.test(E); )
          ++B;
        return B;
      }
      function Fm(E) {
        return E.match(ba) || [];
      }
      function Bm(E) {
        return E.match(nm) || [];
      }
      var Um = (function E(B) {
        B = B == null ? Ze : dr.defaults(Ze.Object(), B, dr.pick(Ze, sm));
        var I = B.Array, K = B.Date, ae = B.Error, Te = B.Function, je = B.Math, Ae = B.Object, Da = B.RegExp, km = B.String, Nt = B.TypeError, Xs = I.prototype, zm = Te.prototype, pr = Ae.prototype, Ys = B["__core-js_shared__"], Zs = zm.toString, Me = pr.hasOwnProperty, Nm = 0, _u = (function() {
          var r = /[^.]+$/.exec(Ys && Ys.keys && Ys.keys.IE_PROTO || "");
          return r ? "Symbol(src)_1." + r : "";
        })(), qs = pr.toString, Hm = Zs.call(Ae), Vm = Ze._, Wm = Da(
          "^" + Zs.call(Me).replace(ma, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
        ), Ks = eu ? B.Buffer : t, ei = B.Symbol, Qs = B.Uint8Array, yu = Ks ? Ks.allocUnsafe : t, Js = mu(Ae.getPrototypeOf, Ae), vu = Ae.create, wu = pr.propertyIsEnumerable, eo = Xs.splice, bu = ei ? ei.isConcatSpreadable : t, jr = ei ? ei.iterator : t, Di = ei ? ei.toStringTag : t, to = (function() {
          try {
            var r = ki(Ae, "defineProperty");
            return r({}, "", {}), r;
          } catch {
          }
        })(), Gm = B.clearTimeout !== Ze.clearTimeout && B.clearTimeout, $m = K && K.now !== Ze.Date.now && K.now, jm = B.setTimeout !== Ze.setTimeout && B.setTimeout, no = je.ceil, io = je.floor, Ia = Ae.getOwnPropertySymbols, Xm = Ks ? Ks.isBuffer : t, xu = B.isFinite, Ym = Xs.join, Zm = mu(Ae.keys, Ae), Xe = je.max, it = je.min, qm = K.now, Km = B.parseInt, Tu = je.random, Qm = Xs.reverse, Fa = ki(B, "DataView"), Xr = ki(B, "Map"), Ba = ki(B, "Promise"), mr = ki(B, "Set"), Yr = ki(B, "WeakMap"), Zr = ki(Ae, "create"), ro = Yr && new Yr(), gr = {}, Jm = zi(Fa), eg = zi(Xr), tg = zi(Ba), ng = zi(mr), ig = zi(Yr), so = ei ? ei.prototype : t, qr = so ? so.valueOf : t, Su = so ? so.toString : t;
        function v(r) {
          if (ze(r) && !le(r) && !(r instanceof _e)) {
            if (r instanceof Ht)
              return r;
            if (Me.call(r, "__wrapped__"))
              return Mh(r);
          }
          return new Ht(r);
        }
        var _r = /* @__PURE__ */ (function() {
          function r() {
          }
          return function(a) {
            if (!Ue(a))
              return {};
            if (vu)
              return vu(a);
            r.prototype = a;
            var h = new r();
            return r.prototype = t, h;
          };
        })();
        function oo() {
        }
        function Ht(r, a) {
          this.__wrapped__ = r, this.__actions__ = [], this.__chain__ = !!a, this.__index__ = 0, this.__values__ = t;
        }
        v.templateSettings = {
          /**
           * Used to detect `data` property values to be HTML-escaped.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          escape: sn,
          /**
           * Used to detect code to be evaluated.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          evaluate: on,
          /**
           * Used to detect `data` property values to inject.
           *
           * @memberOf _.templateSettings
           * @type {RegExp}
           */
          interpolate: qn,
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
        }, v.prototype = oo.prototype, v.prototype.constructor = v, Ht.prototype = _r(oo.prototype), Ht.prototype.constructor = Ht;
        function _e(r) {
          this.__wrapped__ = r, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Ee, this.__views__ = [];
        }
        function rg() {
          var r = new _e(this.__wrapped__);
          return r.__actions__ = wt(this.__actions__), r.__dir__ = this.__dir__, r.__filtered__ = this.__filtered__, r.__iteratees__ = wt(this.__iteratees__), r.__takeCount__ = this.__takeCount__, r.__views__ = wt(this.__views__), r;
        }
        function sg() {
          if (this.__filtered__) {
            var r = new _e(this);
            r.__dir__ = -1, r.__filtered__ = !0;
          } else
            r = this.clone(), r.__dir__ *= -1;
          return r;
        }
        function og() {
          var r = this.__wrapped__.value(), a = this.__dir__, h = le(r), m = a < 0, _ = h ? r.length : 0, w = y_(0, _, this.__views__), S = w.start, P = w.end, C = P - S, N = m ? P : S - 1, H = this.__iteratees__, W = H.length, Y = 0, J = it(C, this.__takeCount__);
          if (!h || !m && _ == C && J == C)
            return Yu(r, this.__actions__);
          var ie = [];
          e:
            for (; C-- && Y < J; ) {
              N += a;
              for (var he = -1, re = r[N]; ++he < W; ) {
                var de = H[he], ye = de.iteratee, Rt = de.type, dt = ye(re);
                if (Rt == ee)
                  re = dt;
                else if (!dt) {
                  if (Rt == Z)
                    continue e;
                  break e;
                }
              }
              ie[Y++] = re;
            }
          return ie;
        }
        _e.prototype = _r(oo.prototype), _e.prototype.constructor = _e;
        function Ii(r) {
          var a = -1, h = r == null ? 0 : r.length;
          for (this.clear(); ++a < h; ) {
            var m = r[a];
            this.set(m[0], m[1]);
          }
        }
        function ag() {
          this.__data__ = Zr ? Zr(null) : {}, this.size = 0;
        }
        function lg(r) {
          var a = this.has(r) && delete this.__data__[r];
          return this.size -= a ? 1 : 0, a;
        }
        function cg(r) {
          var a = this.__data__;
          if (Zr) {
            var h = a[r];
            return h === u ? t : h;
          }
          return Me.call(a, r) ? a[r] : t;
        }
        function ug(r) {
          var a = this.__data__;
          return Zr ? a[r] !== t : Me.call(a, r);
        }
        function hg(r, a) {
          var h = this.__data__;
          return this.size += this.has(r) ? 0 : 1, h[r] = Zr && a === t ? u : a, this;
        }
        Ii.prototype.clear = ag, Ii.prototype.delete = lg, Ii.prototype.get = cg, Ii.prototype.has = ug, Ii.prototype.set = hg;
        function In(r) {
          var a = -1, h = r == null ? 0 : r.length;
          for (this.clear(); ++a < h; ) {
            var m = r[a];
            this.set(m[0], m[1]);
          }
        }
        function fg() {
          this.__data__ = [], this.size = 0;
        }
        function dg(r) {
          var a = this.__data__, h = ao(a, r);
          if (h < 0)
            return !1;
          var m = a.length - 1;
          return h == m ? a.pop() : eo.call(a, h, 1), --this.size, !0;
        }
        function pg(r) {
          var a = this.__data__, h = ao(a, r);
          return h < 0 ? t : a[h][1];
        }
        function mg(r) {
          return ao(this.__data__, r) > -1;
        }
        function gg(r, a) {
          var h = this.__data__, m = ao(h, r);
          return m < 0 ? (++this.size, h.push([r, a])) : h[m][1] = a, this;
        }
        In.prototype.clear = fg, In.prototype.delete = dg, In.prototype.get = pg, In.prototype.has = mg, In.prototype.set = gg;
        function Fn(r) {
          var a = -1, h = r == null ? 0 : r.length;
          for (this.clear(); ++a < h; ) {
            var m = r[a];
            this.set(m[0], m[1]);
          }
        }
        function _g() {
          this.size = 0, this.__data__ = {
            hash: new Ii(),
            map: new (Xr || In)(),
            string: new Ii()
          };
        }
        function yg(r) {
          var a = wo(this, r).delete(r);
          return this.size -= a ? 1 : 0, a;
        }
        function vg(r) {
          return wo(this, r).get(r);
        }
        function wg(r) {
          return wo(this, r).has(r);
        }
        function bg(r, a) {
          var h = wo(this, r), m = h.size;
          return h.set(r, a), this.size += h.size == m ? 0 : 1, this;
        }
        Fn.prototype.clear = _g, Fn.prototype.delete = yg, Fn.prototype.get = vg, Fn.prototype.has = wg, Fn.prototype.set = bg;
        function Fi(r) {
          var a = -1, h = r == null ? 0 : r.length;
          for (this.__data__ = new Fn(); ++a < h; )
            this.add(r[a]);
        }
        function xg(r) {
          return this.__data__.set(r, u), this;
        }
        function Tg(r) {
          return this.__data__.has(r);
        }
        Fi.prototype.add = Fi.prototype.push = xg, Fi.prototype.has = Tg;
        function ln(r) {
          var a = this.__data__ = new In(r);
          this.size = a.size;
        }
        function Sg() {
          this.__data__ = new In(), this.size = 0;
        }
        function Mg(r) {
          var a = this.__data__, h = a.delete(r);
          return this.size = a.size, h;
        }
        function Ag(r) {
          return this.__data__.get(r);
        }
        function Pg(r) {
          return this.__data__.has(r);
        }
        function Lg(r, a) {
          var h = this.__data__;
          if (h instanceof In) {
            var m = h.__data__;
            if (!Xr || m.length < i - 1)
              return m.push([r, a]), this.size = ++h.size, this;
            h = this.__data__ = new Fn(m);
          }
          return h.set(r, a), this.size = h.size, this;
        }
        ln.prototype.clear = Sg, ln.prototype.delete = Mg, ln.prototype.get = Ag, ln.prototype.has = Pg, ln.prototype.set = Lg;
        function Mu(r, a) {
          var h = le(r), m = !h && Ni(r), _ = !h && !m && si(r), w = !h && !m && !_ && br(r), S = h || m || _ || w, P = S ? Ca(r.length, km) : [], C = P.length;
          for (var N in r)
            (a || Me.call(r, N)) && !(S && // Safari 9 has enumerable `arguments.length` in strict mode.
            (N == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
            _ && (N == "offset" || N == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
            w && (N == "buffer" || N == "byteLength" || N == "byteOffset") || // Skip index properties.
            zn(N, C))) && P.push(N);
          return P;
        }
        function Au(r) {
          var a = r.length;
          return a ? r[Xa(0, a - 1)] : t;
        }
        function Eg(r, a) {
          return bo(wt(r), Bi(a, 0, r.length));
        }
        function Cg(r) {
          return bo(wt(r));
        }
        function Ua(r, a, h) {
          (h !== t && !cn(r[a], h) || h === t && !(a in r)) && Bn(r, a, h);
        }
        function Kr(r, a, h) {
          var m = r[a];
          (!(Me.call(r, a) && cn(m, h)) || h === t && !(a in r)) && Bn(r, a, h);
        }
        function ao(r, a) {
          for (var h = r.length; h--; )
            if (cn(r[h][0], a))
              return h;
          return -1;
        }
        function Og(r, a, h, m) {
          return ti(r, function(_, w, S) {
            a(m, _, h(_), S);
          }), m;
        }
        function Pu(r, a) {
          return r && bn(a, Ye(a), r);
        }
        function Rg(r, a) {
          return r && bn(a, xt(a), r);
        }
        function Bn(r, a, h) {
          a == "__proto__" && to ? to(r, a, {
            configurable: !0,
            enumerable: !0,
            value: h,
            writable: !0
          }) : r[a] = h;
        }
        function ka(r, a) {
          for (var h = -1, m = a.length, _ = I(m), w = r == null; ++h < m; )
            _[h] = w ? t : yl(r, a[h]);
          return _;
        }
        function Bi(r, a, h) {
          return r === r && (h !== t && (r = r <= h ? r : h), a !== t && (r = r >= a ? r : a)), r;
        }
        function Vt(r, a, h, m, _, w) {
          var S, P = a & d, C = a & g, N = a & y;
          if (h && (S = _ ? h(r, m, _, w) : h(r)), S !== t)
            return S;
          if (!Ue(r))
            return r;
          var H = le(r);
          if (H) {
            if (S = w_(r), !P)
              return wt(r, S);
          } else {
            var W = rt(r), Y = W == nn || W == Dn;
            if (si(r))
              return Ku(r, P);
            if (W == vt || W == ut || Y && !_) {
              if (S = C || Y ? {} : gh(r), !P)
                return C ? c_(r, Rg(S, r)) : l_(r, Pu(S, r));
            } else {
              if (!Re[W])
                return _ ? r : {};
              S = b_(r, W, P);
            }
          }
          w || (w = new ln());
          var J = w.get(r);
          if (J)
            return J;
          w.set(r, S), $h(r) ? r.forEach(function(re) {
            S.add(Vt(re, a, h, re, r, w));
          }) : Wh(r) && r.forEach(function(re, de) {
            S.set(de, Vt(re, a, h, de, r, w));
          });
          var ie = N ? C ? rl : il : C ? xt : Ye, he = H ? t : ie(r);
          return zt(he || r, function(re, de) {
            he && (de = re, re = r[de]), Kr(S, de, Vt(re, a, h, de, r, w));
          }), S;
        }
        function Dg(r) {
          var a = Ye(r);
          return function(h) {
            return Lu(h, r, a);
          };
        }
        function Lu(r, a, h) {
          var m = h.length;
          if (r == null)
            return !m;
          for (r = Ae(r); m--; ) {
            var _ = h[m], w = a[_], S = r[_];
            if (S === t && !(_ in r) || !w(S))
              return !1;
          }
          return !0;
        }
        function Eu(r, a, h) {
          if (typeof r != "function")
            throw new Nt(l);
          return rs(function() {
            r.apply(t, h);
          }, a);
        }
        function Qr(r, a, h, m) {
          var _ = -1, w = Gs, S = !0, P = r.length, C = [], N = a.length;
          if (!P)
            return C;
          h && (a = Fe(a, Et(h))), m ? (w = Sa, S = !1) : a.length >= i && (w = $r, S = !1, a = new Fi(a));
          e:
            for (; ++_ < P; ) {
              var H = r[_], W = h == null ? H : h(H);
              if (H = m || H !== 0 ? H : 0, S && W === W) {
                for (var Y = N; Y--; )
                  if (a[Y] === W)
                    continue e;
                C.push(H);
              } else w(a, W, m) || C.push(H);
            }
          return C;
        }
        var ti = nh(wn), Cu = nh(Na, !0);
        function Ig(r, a) {
          var h = !0;
          return ti(r, function(m, _, w) {
            return h = !!a(m, _, w), h;
          }), h;
        }
        function lo(r, a, h) {
          for (var m = -1, _ = r.length; ++m < _; ) {
            var w = r[m], S = a(w);
            if (S != null && (P === t ? S === S && !Ot(S) : h(S, P)))
              var P = S, C = w;
          }
          return C;
        }
        function Fg(r, a, h, m) {
          var _ = r.length;
          for (h = ue(h), h < 0 && (h = -h > _ ? 0 : _ + h), m = m === t || m > _ ? _ : ue(m), m < 0 && (m += _), m = h > m ? 0 : Xh(m); h < m; )
            r[h++] = a;
          return r;
        }
        function Ou(r, a) {
          var h = [];
          return ti(r, function(m, _, w) {
            a(m, _, w) && h.push(m);
          }), h;
        }
        function qe(r, a, h, m, _) {
          var w = -1, S = r.length;
          for (h || (h = T_), _ || (_ = []); ++w < S; ) {
            var P = r[w];
            a > 0 && h(P) ? a > 1 ? qe(P, a - 1, h, m, _) : Qn(_, P) : m || (_[_.length] = P);
          }
          return _;
        }
        var za = ih(), Ru = ih(!0);
        function wn(r, a) {
          return r && za(r, a, Ye);
        }
        function Na(r, a) {
          return r && Ru(r, a, Ye);
        }
        function co(r, a) {
          return Kn(a, function(h) {
            return Nn(r[h]);
          });
        }
        function Ui(r, a) {
          a = ii(a, r);
          for (var h = 0, m = a.length; r != null && h < m; )
            r = r[xn(a[h++])];
          return h && h == m ? r : t;
        }
        function Du(r, a, h) {
          var m = a(r);
          return le(r) ? m : Qn(m, h(r));
        }
        function ht(r) {
          return r == null ? r === t ? Pi : Si : Di && Di in Ae(r) ? __(r) : C_(r);
        }
        function Ha(r, a) {
          return r > a;
        }
        function Bg(r, a) {
          return r != null && Me.call(r, a);
        }
        function Ug(r, a) {
          return r != null && a in Ae(r);
        }
        function kg(r, a, h) {
          return r >= it(a, h) && r < Xe(a, h);
        }
        function Va(r, a, h) {
          for (var m = h ? Sa : Gs, _ = r[0].length, w = r.length, S = w, P = I(w), C = 1 / 0, N = []; S--; ) {
            var H = r[S];
            S && a && (H = Fe(H, Et(a))), C = it(H.length, C), P[S] = !h && (a || _ >= 120 && H.length >= 120) ? new Fi(S && H) : t;
          }
          H = r[0];
          var W = -1, Y = P[0];
          e:
            for (; ++W < _ && N.length < C; ) {
              var J = H[W], ie = a ? a(J) : J;
              if (J = h || J !== 0 ? J : 0, !(Y ? $r(Y, ie) : m(N, ie, h))) {
                for (S = w; --S; ) {
                  var he = P[S];
                  if (!(he ? $r(he, ie) : m(r[S], ie, h)))
                    continue e;
                }
                Y && Y.push(ie), N.push(J);
              }
            }
          return N;
        }
        function zg(r, a, h, m) {
          return wn(r, function(_, w, S) {
            a(m, h(_), w, S);
          }), m;
        }
        function Jr(r, a, h) {
          a = ii(a, r), r = wh(r, a);
          var m = r == null ? r : r[xn(Gt(a))];
          return m == null ? t : Lt(m, r, h);
        }
        function Iu(r) {
          return ze(r) && ht(r) == ut;
        }
        function Ng(r) {
          return ze(r) && ht(r) == Zn;
        }
        function Hg(r) {
          return ze(r) && ht(r) == tn;
        }
        function es(r, a, h, m, _) {
          return r === a ? !0 : r == null || a == null || !ze(r) && !ze(a) ? r !== r && a !== a : Vg(r, a, h, m, es, _);
        }
        function Vg(r, a, h, m, _, w) {
          var S = le(r), P = le(a), C = S ? Bt : rt(r), N = P ? Bt : rt(a);
          C = C == ut ? vt : C, N = N == ut ? vt : N;
          var H = C == vt, W = N == vt, Y = C == N;
          if (Y && si(r)) {
            if (!si(a))
              return !1;
            S = !0, H = !1;
          }
          if (Y && !H)
            return w || (w = new ln()), S || br(r) ? dh(r, a, h, m, _, w) : m_(r, a, C, h, m, _, w);
          if (!(h & x)) {
            var J = H && Me.call(r, "__wrapped__"), ie = W && Me.call(a, "__wrapped__");
            if (J || ie) {
              var he = J ? r.value() : r, re = ie ? a.value() : a;
              return w || (w = new ln()), _(he, re, h, m, w);
            }
          }
          return Y ? (w || (w = new ln()), g_(r, a, h, m, _, w)) : !1;
        }
        function Wg(r) {
          return ze(r) && rt(r) == Ge;
        }
        function Wa(r, a, h, m) {
          var _ = h.length, w = _, S = !m;
          if (r == null)
            return !w;
          for (r = Ae(r); _--; ) {
            var P = h[_];
            if (S && P[2] ? P[1] !== r[P[0]] : !(P[0] in r))
              return !1;
          }
          for (; ++_ < w; ) {
            P = h[_];
            var C = P[0], N = r[C], H = P[1];
            if (S && P[2]) {
              if (N === t && !(C in r))
                return !1;
            } else {
              var W = new ln();
              if (m)
                var Y = m(N, H, C, r, a, W);
              if (!(Y === t ? es(H, N, x | T, m, W) : Y))
                return !1;
            }
          }
          return !0;
        }
        function Fu(r) {
          if (!Ue(r) || M_(r))
            return !1;
          var a = Nn(r) ? Wm : Dp;
          return a.test(zi(r));
        }
        function Gg(r) {
          return ze(r) && ht(r) == Ai;
        }
        function $g(r) {
          return ze(r) && rt(r) == Pt;
        }
        function jg(r) {
          return ze(r) && Po(r.length) && !!De[ht(r)];
        }
        function Bu(r) {
          return typeof r == "function" ? r : r == null ? Tt : typeof r == "object" ? le(r) ? zu(r[0], r[1]) : ku(r) : sf(r);
        }
        function Ga(r) {
          if (!is(r))
            return Zm(r);
          var a = [];
          for (var h in Ae(r))
            Me.call(r, h) && h != "constructor" && a.push(h);
          return a;
        }
        function Xg(r) {
          if (!Ue(r))
            return E_(r);
          var a = is(r), h = [];
          for (var m in r)
            m == "constructor" && (a || !Me.call(r, m)) || h.push(m);
          return h;
        }
        function $a(r, a) {
          return r < a;
        }
        function Uu(r, a) {
          var h = -1, m = bt(r) ? I(r.length) : [];
          return ti(r, function(_, w, S) {
            m[++h] = a(_, w, S);
          }), m;
        }
        function ku(r) {
          var a = ol(r);
          return a.length == 1 && a[0][2] ? yh(a[0][0], a[0][1]) : function(h) {
            return h === r || Wa(h, r, a);
          };
        }
        function zu(r, a) {
          return ll(r) && _h(a) ? yh(xn(r), a) : function(h) {
            var m = yl(h, r);
            return m === t && m === a ? vl(h, r) : es(a, m, x | T);
          };
        }
        function uo(r, a, h, m, _) {
          r !== a && za(a, function(w, S) {
            if (_ || (_ = new ln()), Ue(w))
              Yg(r, a, S, h, uo, m, _);
            else {
              var P = m ? m(ul(r, S), w, S + "", r, a, _) : t;
              P === t && (P = w), Ua(r, S, P);
            }
          }, xt);
        }
        function Yg(r, a, h, m, _, w, S) {
          var P = ul(r, h), C = ul(a, h), N = S.get(C);
          if (N) {
            Ua(r, h, N);
            return;
          }
          var H = w ? w(P, C, h + "", r, a, S) : t, W = H === t;
          if (W) {
            var Y = le(C), J = !Y && si(C), ie = !Y && !J && br(C);
            H = C, Y || J || ie ? le(P) ? H = P : Ne(P) ? H = wt(P) : J ? (W = !1, H = Ku(C, !0)) : ie ? (W = !1, H = Qu(C, !0)) : H = [] : ss(C) || Ni(C) ? (H = P, Ni(P) ? H = Yh(P) : (!Ue(P) || Nn(P)) && (H = gh(C))) : W = !1;
          }
          W && (S.set(C, H), _(H, C, m, w, S), S.delete(C)), Ua(r, h, H);
        }
        function Nu(r, a) {
          var h = r.length;
          if (h)
            return a += a < 0 ? h : 0, zn(a, h) ? r[a] : t;
        }
        function Hu(r, a, h) {
          a.length ? a = Fe(a, function(w) {
            return le(w) ? function(S) {
              return Ui(S, w.length === 1 ? w[0] : w);
            } : w;
          }) : a = [Tt];
          var m = -1;
          a = Fe(a, Et(ne()));
          var _ = Uu(r, function(w, S, P) {
            var C = Fe(a, function(N) {
              return N(w);
            });
            return { criteria: C, index: ++m, value: w };
          });
          return bm(_, function(w, S) {
            return a_(w, S, h);
          });
        }
        function Zg(r, a) {
          return Vu(r, a, function(h, m) {
            return vl(r, m);
          });
        }
        function Vu(r, a, h) {
          for (var m = -1, _ = a.length, w = {}; ++m < _; ) {
            var S = a[m], P = Ui(r, S);
            h(P, S) && ts(w, ii(S, r), P);
          }
          return w;
        }
        function qg(r) {
          return function(a) {
            return Ui(a, r);
          };
        }
        function ja(r, a, h, m) {
          var _ = m ? wm : ur, w = -1, S = a.length, P = r;
          for (r === a && (a = wt(a)), h && (P = Fe(r, Et(h))); ++w < S; )
            for (var C = 0, N = a[w], H = h ? h(N) : N; (C = _(P, H, C, m)) > -1; )
              P !== r && eo.call(P, C, 1), eo.call(r, C, 1);
          return r;
        }
        function Wu(r, a) {
          for (var h = r ? a.length : 0, m = h - 1; h--; ) {
            var _ = a[h];
            if (h == m || _ !== w) {
              var w = _;
              zn(_) ? eo.call(r, _, 1) : qa(r, _);
            }
          }
          return r;
        }
        function Xa(r, a) {
          return r + io(Tu() * (a - r + 1));
        }
        function Kg(r, a, h, m) {
          for (var _ = -1, w = Xe(no((a - r) / (h || 1)), 0), S = I(w); w--; )
            S[m ? w : ++_] = r, r += h;
          return S;
        }
        function Ya(r, a) {
          var h = "";
          if (!r || a < 1 || a > we)
            return h;
          do
            a % 2 && (h += r), a = io(a / 2), a && (r += r);
          while (a);
          return h;
        }
        function fe(r, a) {
          return hl(vh(r, a, Tt), r + "");
        }
        function Qg(r) {
          return Au(xr(r));
        }
        function Jg(r, a) {
          var h = xr(r);
          return bo(h, Bi(a, 0, h.length));
        }
        function ts(r, a, h, m) {
          if (!Ue(r))
            return r;
          a = ii(a, r);
          for (var _ = -1, w = a.length, S = w - 1, P = r; P != null && ++_ < w; ) {
            var C = xn(a[_]), N = h;
            if (C === "__proto__" || C === "constructor" || C === "prototype")
              return r;
            if (_ != S) {
              var H = P[C];
              N = m ? m(H, C, P) : t, N === t && (N = Ue(H) ? H : zn(a[_ + 1]) ? [] : {});
            }
            Kr(P, C, N), P = P[C];
          }
          return r;
        }
        var Gu = ro ? function(r, a) {
          return ro.set(r, a), r;
        } : Tt, e_ = to ? function(r, a) {
          return to(r, "toString", {
            configurable: !0,
            enumerable: !1,
            value: bl(a),
            writable: !0
          });
        } : Tt;
        function t_(r) {
          return bo(xr(r));
        }
        function Wt(r, a, h) {
          var m = -1, _ = r.length;
          a < 0 && (a = -a > _ ? 0 : _ + a), h = h > _ ? _ : h, h < 0 && (h += _), _ = a > h ? 0 : h - a >>> 0, a >>>= 0;
          for (var w = I(_); ++m < _; )
            w[m] = r[m + a];
          return w;
        }
        function n_(r, a) {
          var h;
          return ti(r, function(m, _, w) {
            return h = a(m, _, w), !h;
          }), !!h;
        }
        function ho(r, a, h) {
          var m = 0, _ = r == null ? m : r.length;
          if (typeof a == "number" && a === a && _ <= Oe) {
            for (; m < _; ) {
              var w = m + _ >>> 1, S = r[w];
              S !== null && !Ot(S) && (h ? S <= a : S < a) ? m = w + 1 : _ = w;
            }
            return _;
          }
          return Za(r, a, Tt, h);
        }
        function Za(r, a, h, m) {
          var _ = 0, w = r == null ? 0 : r.length;
          if (w === 0)
            return 0;
          a = h(a);
          for (var S = a !== a, P = a === null, C = Ot(a), N = a === t; _ < w; ) {
            var H = io((_ + w) / 2), W = h(r[H]), Y = W !== t, J = W === null, ie = W === W, he = Ot(W);
            if (S)
              var re = m || ie;
            else N ? re = ie && (m || Y) : P ? re = ie && Y && (m || !J) : C ? re = ie && Y && !J && (m || !he) : J || he ? re = !1 : re = m ? W <= a : W < a;
            re ? _ = H + 1 : w = H;
          }
          return it(w, Ce);
        }
        function $u(r, a) {
          for (var h = -1, m = r.length, _ = 0, w = []; ++h < m; ) {
            var S = r[h], P = a ? a(S) : S;
            if (!h || !cn(P, C)) {
              var C = P;
              w[_++] = S === 0 ? 0 : S;
            }
          }
          return w;
        }
        function ju(r) {
          return typeof r == "number" ? r : Ot(r) ? ge : +r;
        }
        function Ct(r) {
          if (typeof r == "string")
            return r;
          if (le(r))
            return Fe(r, Ct) + "";
          if (Ot(r))
            return Su ? Su.call(r) : "";
          var a = r + "";
          return a == "0" && 1 / r == -Le ? "-0" : a;
        }
        function ni(r, a, h) {
          var m = -1, _ = Gs, w = r.length, S = !0, P = [], C = P;
          if (h)
            S = !1, _ = Sa;
          else if (w >= i) {
            var N = a ? null : d_(r);
            if (N)
              return js(N);
            S = !1, _ = $r, C = new Fi();
          } else
            C = a ? [] : P;
          e:
            for (; ++m < w; ) {
              var H = r[m], W = a ? a(H) : H;
              if (H = h || H !== 0 ? H : 0, S && W === W) {
                for (var Y = C.length; Y--; )
                  if (C[Y] === W)
                    continue e;
                a && C.push(W), P.push(H);
              } else _(C, W, h) || (C !== P && C.push(W), P.push(H));
            }
          return P;
        }
        function qa(r, a) {
          return a = ii(a, r), r = wh(r, a), r == null || delete r[xn(Gt(a))];
        }
        function Xu(r, a, h, m) {
          return ts(r, a, h(Ui(r, a)), m);
        }
        function fo(r, a, h, m) {
          for (var _ = r.length, w = m ? _ : -1; (m ? w-- : ++w < _) && a(r[w], w, r); )
            ;
          return h ? Wt(r, m ? 0 : w, m ? w + 1 : _) : Wt(r, m ? w + 1 : 0, m ? _ : w);
        }
        function Yu(r, a) {
          var h = r;
          return h instanceof _e && (h = h.value()), Ma(a, function(m, _) {
            return _.func.apply(_.thisArg, Qn([m], _.args));
          }, h);
        }
        function Ka(r, a, h) {
          var m = r.length;
          if (m < 2)
            return m ? ni(r[0]) : [];
          for (var _ = -1, w = I(m); ++_ < m; )
            for (var S = r[_], P = -1; ++P < m; )
              P != _ && (w[_] = Qr(w[_] || S, r[P], a, h));
          return ni(qe(w, 1), a, h);
        }
        function Zu(r, a, h) {
          for (var m = -1, _ = r.length, w = a.length, S = {}; ++m < _; ) {
            var P = m < w ? a[m] : t;
            h(S, r[m], P);
          }
          return S;
        }
        function Qa(r) {
          return Ne(r) ? r : [];
        }
        function Ja(r) {
          return typeof r == "function" ? r : Tt;
        }
        function ii(r, a) {
          return le(r) ? r : ll(r, a) ? [r] : Sh(Se(r));
        }
        var i_ = fe;
        function ri(r, a, h) {
          var m = r.length;
          return h = h === t ? m : h, !a && h >= m ? r : Wt(r, a, h);
        }
        var qu = Gm || function(r) {
          return Ze.clearTimeout(r);
        };
        function Ku(r, a) {
          if (a)
            return r.slice();
          var h = r.length, m = yu ? yu(h) : new r.constructor(h);
          return r.copy(m), m;
        }
        function el(r) {
          var a = new r.constructor(r.byteLength);
          return new Qs(a).set(new Qs(r)), a;
        }
        function r_(r, a) {
          var h = a ? el(r.buffer) : r.buffer;
          return new r.constructor(h, r.byteOffset, r.byteLength);
        }
        function s_(r) {
          var a = new r.constructor(r.source, Ic.exec(r));
          return a.lastIndex = r.lastIndex, a;
        }
        function o_(r) {
          return qr ? Ae(qr.call(r)) : {};
        }
        function Qu(r, a) {
          var h = a ? el(r.buffer) : r.buffer;
          return new r.constructor(h, r.byteOffset, r.length);
        }
        function Ju(r, a) {
          if (r !== a) {
            var h = r !== t, m = r === null, _ = r === r, w = Ot(r), S = a !== t, P = a === null, C = a === a, N = Ot(a);
            if (!P && !N && !w && r > a || w && S && C && !P && !N || m && S && C || !h && C || !_)
              return 1;
            if (!m && !w && !N && r < a || N && h && _ && !m && !w || P && h && _ || !S && _ || !C)
              return -1;
          }
          return 0;
        }
        function a_(r, a, h) {
          for (var m = -1, _ = r.criteria, w = a.criteria, S = _.length, P = h.length; ++m < S; ) {
            var C = Ju(_[m], w[m]);
            if (C) {
              if (m >= P)
                return C;
              var N = h[m];
              return C * (N == "desc" ? -1 : 1);
            }
          }
          return r.index - a.index;
        }
        function eh(r, a, h, m) {
          for (var _ = -1, w = r.length, S = h.length, P = -1, C = a.length, N = Xe(w - S, 0), H = I(C + N), W = !m; ++P < C; )
            H[P] = a[P];
          for (; ++_ < S; )
            (W || _ < w) && (H[h[_]] = r[_]);
          for (; N--; )
            H[P++] = r[_++];
          return H;
        }
        function th(r, a, h, m) {
          for (var _ = -1, w = r.length, S = -1, P = h.length, C = -1, N = a.length, H = Xe(w - P, 0), W = I(H + N), Y = !m; ++_ < H; )
            W[_] = r[_];
          for (var J = _; ++C < N; )
            W[J + C] = a[C];
          for (; ++S < P; )
            (Y || _ < w) && (W[J + h[S]] = r[_++]);
          return W;
        }
        function wt(r, a) {
          var h = -1, m = r.length;
          for (a || (a = I(m)); ++h < m; )
            a[h] = r[h];
          return a;
        }
        function bn(r, a, h, m) {
          var _ = !h;
          h || (h = {});
          for (var w = -1, S = a.length; ++w < S; ) {
            var P = a[w], C = m ? m(h[P], r[P], P, h, r) : t;
            C === t && (C = r[P]), _ ? Bn(h, P, C) : Kr(h, P, C);
          }
          return h;
        }
        function l_(r, a) {
          return bn(r, al(r), a);
        }
        function c_(r, a) {
          return bn(r, ph(r), a);
        }
        function po(r, a) {
          return function(h, m) {
            var _ = le(h) ? pm : Og, w = a ? a() : {};
            return _(h, r, ne(m, 2), w);
          };
        }
        function yr(r) {
          return fe(function(a, h) {
            var m = -1, _ = h.length, w = _ > 1 ? h[_ - 1] : t, S = _ > 2 ? h[2] : t;
            for (w = r.length > 3 && typeof w == "function" ? (_--, w) : t, S && ft(h[0], h[1], S) && (w = _ < 3 ? t : w, _ = 1), a = Ae(a); ++m < _; ) {
              var P = h[m];
              P && r(a, P, m, w);
            }
            return a;
          });
        }
        function nh(r, a) {
          return function(h, m) {
            if (h == null)
              return h;
            if (!bt(h))
              return r(h, m);
            for (var _ = h.length, w = a ? _ : -1, S = Ae(h); (a ? w-- : ++w < _) && m(S[w], w, S) !== !1; )
              ;
            return h;
          };
        }
        function ih(r) {
          return function(a, h, m) {
            for (var _ = -1, w = Ae(a), S = m(a), P = S.length; P--; ) {
              var C = S[r ? P : ++_];
              if (h(w[C], C, w) === !1)
                break;
            }
            return a;
          };
        }
        function u_(r, a, h) {
          var m = a & b, _ = ns(r);
          function w() {
            var S = this && this !== Ze && this instanceof w ? _ : r;
            return S.apply(m ? h : this, arguments);
          }
          return w;
        }
        function rh(r) {
          return function(a) {
            a = Se(a);
            var h = hr(a) ? an(a) : t, m = h ? h[0] : a.charAt(0), _ = h ? ri(h, 1).join("") : a.slice(1);
            return m[r]() + _;
          };
        }
        function vr(r) {
          return function(a) {
            return Ma(nf(tf(a).replace(em, "")), r, "");
          };
        }
        function ns(r) {
          return function() {
            var a = arguments;
            switch (a.length) {
              case 0:
                return new r();
              case 1:
                return new r(a[0]);
              case 2:
                return new r(a[0], a[1]);
              case 3:
                return new r(a[0], a[1], a[2]);
              case 4:
                return new r(a[0], a[1], a[2], a[3]);
              case 5:
                return new r(a[0], a[1], a[2], a[3], a[4]);
              case 6:
                return new r(a[0], a[1], a[2], a[3], a[4], a[5]);
              case 7:
                return new r(a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
            }
            var h = _r(r.prototype), m = r.apply(h, a);
            return Ue(m) ? m : h;
          };
        }
        function h_(r, a, h) {
          var m = ns(r);
          function _() {
            for (var w = arguments.length, S = I(w), P = w, C = wr(_); P--; )
              S[P] = arguments[P];
            var N = w < 3 && S[0] !== C && S[w - 1] !== C ? [] : Jn(S, C);
            if (w -= N.length, w < h)
              return ch(
                r,
                a,
                mo,
                _.placeholder,
                t,
                S,
                N,
                t,
                t,
                h - w
              );
            var H = this && this !== Ze && this instanceof _ ? m : r;
            return Lt(H, this, S);
          }
          return _;
        }
        function sh(r) {
          return function(a, h, m) {
            var _ = Ae(a);
            if (!bt(a)) {
              var w = ne(h, 3);
              a = Ye(a), h = function(P) {
                return w(_[P], P, _);
              };
            }
            var S = r(a, h, m);
            return S > -1 ? _[w ? a[S] : S] : t;
          };
        }
        function oh(r) {
          return kn(function(a) {
            var h = a.length, m = h, _ = Ht.prototype.thru;
            for (r && a.reverse(); m--; ) {
              var w = a[m];
              if (typeof w != "function")
                throw new Nt(l);
              if (_ && !S && vo(w) == "wrapper")
                var S = new Ht([], !0);
            }
            for (m = S ? m : h; ++m < h; ) {
              w = a[m];
              var P = vo(w), C = P == "wrapper" ? sl(w) : t;
              C && cl(C[0]) && C[1] == (V | A | k | F) && !C[4].length && C[9] == 1 ? S = S[vo(C[0])].apply(S, C[3]) : S = w.length == 1 && cl(w) ? S[P]() : S.thru(w);
            }
            return function() {
              var N = arguments, H = N[0];
              if (S && N.length == 1 && le(H))
                return S.plant(H).value();
              for (var W = 0, Y = h ? a[W].apply(this, N) : H; ++W < h; )
                Y = a[W].call(this, Y);
              return Y;
            };
          });
        }
        function mo(r, a, h, m, _, w, S, P, C, N) {
          var H = a & V, W = a & b, Y = a & L, J = a & (A | R), ie = a & $, he = Y ? t : ns(r);
          function re() {
            for (var de = arguments.length, ye = I(de), Rt = de; Rt--; )
              ye[Rt] = arguments[Rt];
            if (J)
              var dt = wr(re), Dt = Tm(ye, dt);
            if (m && (ye = eh(ye, m, _, J)), w && (ye = th(ye, w, S, J)), de -= Dt, J && de < N) {
              var He = Jn(ye, dt);
              return ch(
                r,
                a,
                mo,
                re.placeholder,
                h,
                ye,
                He,
                P,
                C,
                N - de
              );
            }
            var un = W ? h : this, Vn = Y ? un[r] : r;
            return de = ye.length, P ? ye = O_(ye, P) : ie && de > 1 && ye.reverse(), H && C < de && (ye.length = C), this && this !== Ze && this instanceof re && (Vn = he || ns(Vn)), Vn.apply(un, ye);
          }
          return re;
        }
        function ah(r, a) {
          return function(h, m) {
            return zg(h, r, a(m), {});
          };
        }
        function go(r, a) {
          return function(h, m) {
            var _;
            if (h === t && m === t)
              return a;
            if (h !== t && (_ = h), m !== t) {
              if (_ === t)
                return m;
              typeof h == "string" || typeof m == "string" ? (h = Ct(h), m = Ct(m)) : (h = ju(h), m = ju(m)), _ = r(h, m);
            }
            return _;
          };
        }
        function tl(r) {
          return kn(function(a) {
            return a = Fe(a, Et(ne())), fe(function(h) {
              var m = this;
              return r(a, function(_) {
                return Lt(_, m, h);
              });
            });
          });
        }
        function _o(r, a) {
          a = a === t ? " " : Ct(a);
          var h = a.length;
          if (h < 2)
            return h ? Ya(a, r) : a;
          var m = Ya(a, no(r / fr(a)));
          return hr(a) ? ri(an(m), 0, r).join("") : m.slice(0, r);
        }
        function f_(r, a, h, m) {
          var _ = a & b, w = ns(r);
          function S() {
            for (var P = -1, C = arguments.length, N = -1, H = m.length, W = I(H + C), Y = this && this !== Ze && this instanceof S ? w : r; ++N < H; )
              W[N] = m[N];
            for (; C--; )
              W[N++] = arguments[++P];
            return Lt(Y, _ ? h : this, W);
          }
          return S;
        }
        function lh(r) {
          return function(a, h, m) {
            return m && typeof m != "number" && ft(a, h, m) && (h = m = t), a = Hn(a), h === t ? (h = a, a = 0) : h = Hn(h), m = m === t ? a < h ? 1 : -1 : Hn(m), Kg(a, h, m, r);
          };
        }
        function yo(r) {
          return function(a, h) {
            return typeof a == "string" && typeof h == "string" || (a = $t(a), h = $t(h)), r(a, h);
          };
        }
        function ch(r, a, h, m, _, w, S, P, C, N) {
          var H = a & A, W = H ? S : t, Y = H ? t : S, J = H ? w : t, ie = H ? t : w;
          a |= H ? k : G, a &= ~(H ? G : k), a & M || (a &= -4);
          var he = [
            r,
            a,
            _,
            J,
            W,
            ie,
            Y,
            P,
            C,
            N
          ], re = h.apply(t, he);
          return cl(r) && bh(re, he), re.placeholder = m, xh(re, r, a);
        }
        function nl(r) {
          var a = je[r];
          return function(h, m) {
            if (h = $t(h), m = m == null ? 0 : it(ue(m), 292), m && xu(h)) {
              var _ = (Se(h) + "e").split("e"), w = a(_[0] + "e" + (+_[1] + m));
              return _ = (Se(w) + "e").split("e"), +(_[0] + "e" + (+_[1] - m));
            }
            return a(h);
          };
        }
        var d_ = mr && 1 / js(new mr([, -0]))[1] == Le ? function(r) {
          return new mr(r);
        } : Sl;
        function uh(r) {
          return function(a) {
            var h = rt(a);
            return h == Ge ? Ra(a) : h == Pt ? Cm(a) : xm(a, r(a));
          };
        }
        function Un(r, a, h, m, _, w, S, P) {
          var C = a & L;
          if (!C && typeof r != "function")
            throw new Nt(l);
          var N = m ? m.length : 0;
          if (N || (a &= -97, m = _ = t), S = S === t ? S : Xe(ue(S), 0), P = P === t ? P : ue(P), N -= _ ? _.length : 0, a & G) {
            var H = m, W = _;
            m = _ = t;
          }
          var Y = C ? t : sl(r), J = [
            r,
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
          if (Y && L_(J, Y), r = J[0], a = J[1], h = J[2], m = J[3], _ = J[4], P = J[9] = J[9] === t ? C ? 0 : r.length : Xe(J[9] - N, 0), !P && a & (A | R) && (a &= -25), !a || a == b)
            var ie = u_(r, a, h);
          else a == A || a == R ? ie = h_(r, a, P) : (a == k || a == (b | k)) && !_.length ? ie = f_(r, a, h, m) : ie = mo.apply(t, J);
          var he = Y ? Gu : bh;
          return xh(he(ie, J), r, a);
        }
        function hh(r, a, h, m) {
          return r === t || cn(r, pr[h]) && !Me.call(m, h) ? a : r;
        }
        function fh(r, a, h, m, _, w) {
          return Ue(r) && Ue(a) && (w.set(a, r), uo(r, a, t, fh, w), w.delete(a)), r;
        }
        function p_(r) {
          return ss(r) ? t : r;
        }
        function dh(r, a, h, m, _, w) {
          var S = h & x, P = r.length, C = a.length;
          if (P != C && !(S && C > P))
            return !1;
          var N = w.get(r), H = w.get(a);
          if (N && H)
            return N == a && H == r;
          var W = -1, Y = !0, J = h & T ? new Fi() : t;
          for (w.set(r, a), w.set(a, r); ++W < P; ) {
            var ie = r[W], he = a[W];
            if (m)
              var re = S ? m(he, ie, W, a, r, w) : m(ie, he, W, r, a, w);
            if (re !== t) {
              if (re)
                continue;
              Y = !1;
              break;
            }
            if (J) {
              if (!Aa(a, function(de, ye) {
                if (!$r(J, ye) && (ie === de || _(ie, de, h, m, w)))
                  return J.push(ye);
              })) {
                Y = !1;
                break;
              }
            } else if (!(ie === he || _(ie, he, h, m, w))) {
              Y = !1;
              break;
            }
          }
          return w.delete(r), w.delete(a), Y;
        }
        function m_(r, a, h, m, _, w, S) {
          switch (h) {
            case vn:
              if (r.byteLength != a.byteLength || r.byteOffset != a.byteOffset)
                return !1;
              r = r.buffer, a = a.buffer;
            case Zn:
              return !(r.byteLength != a.byteLength || !w(new Qs(r), new Qs(a)));
            case yt:
            case tn:
            case At:
              return cn(+r, +a);
            case Rn:
              return r.name == a.name && r.message == a.message;
            case Ai:
            case Xn:
              return r == a + "";
            case Ge:
              var P = Ra;
            case Pt:
              var C = m & x;
              if (P || (P = js), r.size != a.size && !C)
                return !1;
              var N = S.get(r);
              if (N)
                return N == a;
              m |= T, S.set(r, a);
              var H = dh(P(r), P(a), m, _, w, S);
              return S.delete(r), H;
            case Yn:
              if (qr)
                return qr.call(r) == qr.call(a);
          }
          return !1;
        }
        function g_(r, a, h, m, _, w) {
          var S = h & x, P = il(r), C = P.length, N = il(a), H = N.length;
          if (C != H && !S)
            return !1;
          for (var W = C; W--; ) {
            var Y = P[W];
            if (!(S ? Y in a : Me.call(a, Y)))
              return !1;
          }
          var J = w.get(r), ie = w.get(a);
          if (J && ie)
            return J == a && ie == r;
          var he = !0;
          w.set(r, a), w.set(a, r);
          for (var re = S; ++W < C; ) {
            Y = P[W];
            var de = r[Y], ye = a[Y];
            if (m)
              var Rt = S ? m(ye, de, Y, a, r, w) : m(de, ye, Y, r, a, w);
            if (!(Rt === t ? de === ye || _(de, ye, h, m, w) : Rt)) {
              he = !1;
              break;
            }
            re || (re = Y == "constructor");
          }
          if (he && !re) {
            var dt = r.constructor, Dt = a.constructor;
            dt != Dt && "constructor" in r && "constructor" in a && !(typeof dt == "function" && dt instanceof dt && typeof Dt == "function" && Dt instanceof Dt) && (he = !1);
          }
          return w.delete(r), w.delete(a), he;
        }
        function kn(r) {
          return hl(vh(r, t, Lh), r + "");
        }
        function il(r) {
          return Du(r, Ye, al);
        }
        function rl(r) {
          return Du(r, xt, ph);
        }
        var sl = ro ? function(r) {
          return ro.get(r);
        } : Sl;
        function vo(r) {
          for (var a = r.name + "", h = gr[a], m = Me.call(gr, a) ? h.length : 0; m--; ) {
            var _ = h[m], w = _.func;
            if (w == null || w == r)
              return _.name;
          }
          return a;
        }
        function wr(r) {
          var a = Me.call(v, "placeholder") ? v : r;
          return a.placeholder;
        }
        function ne() {
          var r = v.iteratee || xl;
          return r = r === xl ? Bu : r, arguments.length ? r(arguments[0], arguments[1]) : r;
        }
        function wo(r, a) {
          var h = r.__data__;
          return S_(a) ? h[typeof a == "string" ? "string" : "hash"] : h.map;
        }
        function ol(r) {
          for (var a = Ye(r), h = a.length; h--; ) {
            var m = a[h], _ = r[m];
            a[h] = [m, _, _h(_)];
          }
          return a;
        }
        function ki(r, a) {
          var h = Pm(r, a);
          return Fu(h) ? h : t;
        }
        function __(r) {
          var a = Me.call(r, Di), h = r[Di];
          try {
            r[Di] = t;
            var m = !0;
          } catch {
          }
          var _ = qs.call(r);
          return m && (a ? r[Di] = h : delete r[Di]), _;
        }
        var al = Ia ? function(r) {
          return r == null ? [] : (r = Ae(r), Kn(Ia(r), function(a) {
            return wu.call(r, a);
          }));
        } : Ml, ph = Ia ? function(r) {
          for (var a = []; r; )
            Qn(a, al(r)), r = Js(r);
          return a;
        } : Ml, rt = ht;
        (Fa && rt(new Fa(new ArrayBuffer(1))) != vn || Xr && rt(new Xr()) != Ge || Ba && rt(Ba.resolve()) != Mi || mr && rt(new mr()) != Pt || Yr && rt(new Yr()) != Li) && (rt = function(r) {
          var a = ht(r), h = a == vt ? r.constructor : t, m = h ? zi(h) : "";
          if (m)
            switch (m) {
              case Jm:
                return vn;
              case eg:
                return Ge;
              case tg:
                return Mi;
              case ng:
                return Pt;
              case ig:
                return Li;
            }
          return a;
        });
        function y_(r, a, h) {
          for (var m = -1, _ = h.length; ++m < _; ) {
            var w = h[m], S = w.size;
            switch (w.type) {
              case "drop":
                r += S;
                break;
              case "dropRight":
                a -= S;
                break;
              case "take":
                a = it(a, r + S);
                break;
              case "takeRight":
                r = Xe(r, a - S);
                break;
            }
          }
          return { start: r, end: a };
        }
        function v_(r) {
          var a = r.match(Mp);
          return a ? a[1].split(Ap) : [];
        }
        function mh(r, a, h) {
          a = ii(a, r);
          for (var m = -1, _ = a.length, w = !1; ++m < _; ) {
            var S = xn(a[m]);
            if (!(w = r != null && h(r, S)))
              break;
            r = r[S];
          }
          return w || ++m != _ ? w : (_ = r == null ? 0 : r.length, !!_ && Po(_) && zn(S, _) && (le(r) || Ni(r)));
        }
        function w_(r) {
          var a = r.length, h = new r.constructor(a);
          return a && typeof r[0] == "string" && Me.call(r, "index") && (h.index = r.index, h.input = r.input), h;
        }
        function gh(r) {
          return typeof r.constructor == "function" && !is(r) ? _r(Js(r)) : {};
        }
        function b_(r, a, h) {
          var m = r.constructor;
          switch (a) {
            case Zn:
              return el(r);
            case yt:
            case tn:
              return new m(+r);
            case vn:
              return r_(r, h);
            case Hr:
            case Vr:
            case or:
            case Wr:
            case Gr:
            case ar:
            case Ei:
            case O:
            case j:
              return Qu(r, h);
            case Ge:
              return new m();
            case At:
            case Xn:
              return new m(r);
            case Ai:
              return s_(r);
            case Pt:
              return new m();
            case Yn:
              return o_(r);
          }
        }
        function x_(r, a) {
          var h = a.length;
          if (!h)
            return r;
          var m = h - 1;
          return a[m] = (h > 1 ? "& " : "") + a[m], a = a.join(h > 2 ? ", " : " "), r.replace(Sp, `{
/* [wrapped with ` + a + `] */
`);
        }
        function T_(r) {
          return le(r) || Ni(r) || !!(bu && r && r[bu]);
        }
        function zn(r, a) {
          var h = typeof r;
          return a = a ?? we, !!a && (h == "number" || h != "symbol" && Fp.test(r)) && r > -1 && r % 1 == 0 && r < a;
        }
        function ft(r, a, h) {
          if (!Ue(h))
            return !1;
          var m = typeof a;
          return (m == "number" ? bt(h) && zn(a, h.length) : m == "string" && a in h) ? cn(h[a], r) : !1;
        }
        function ll(r, a) {
          if (le(r))
            return !1;
          var h = typeof r;
          return h == "number" || h == "symbol" || h == "boolean" || r == null || Ot(r) ? !0 : Oi.test(r) || !Ci.test(r) || a != null && r in Ae(a);
        }
        function S_(r) {
          var a = typeof r;
          return a == "string" || a == "number" || a == "symbol" || a == "boolean" ? r !== "__proto__" : r === null;
        }
        function cl(r) {
          var a = vo(r), h = v[a];
          if (typeof h != "function" || !(a in _e.prototype))
            return !1;
          if (r === h)
            return !0;
          var m = sl(h);
          return !!m && r === m[0];
        }
        function M_(r) {
          return !!_u && _u in r;
        }
        var A_ = Ys ? Nn : Al;
        function is(r) {
          var a = r && r.constructor, h = typeof a == "function" && a.prototype || pr;
          return r === h;
        }
        function _h(r) {
          return r === r && !Ue(r);
        }
        function yh(r, a) {
          return function(h) {
            return h == null ? !1 : h[r] === a && (a !== t || r in Ae(h));
          };
        }
        function P_(r) {
          var a = Mo(r, function(m) {
            return h.size === f && h.clear(), m;
          }), h = a.cache;
          return a;
        }
        function L_(r, a) {
          var h = r[1], m = a[1], _ = h | m, w = _ < (b | L | V), S = m == V && h == A || m == V && h == F && r[7].length <= a[8] || m == (V | F) && a[7].length <= a[8] && h == A;
          if (!(w || S))
            return r;
          m & b && (r[2] = a[2], _ |= h & b ? 0 : M);
          var P = a[3];
          if (P) {
            var C = r[3];
            r[3] = C ? eh(C, P, a[4]) : P, r[4] = C ? Jn(r[3], p) : a[4];
          }
          return P = a[5], P && (C = r[5], r[5] = C ? th(C, P, a[6]) : P, r[6] = C ? Jn(r[5], p) : a[6]), P = a[7], P && (r[7] = P), m & V && (r[8] = r[8] == null ? a[8] : it(r[8], a[8])), r[9] == null && (r[9] = a[9]), r[0] = a[0], r[1] = _, r;
        }
        function E_(r) {
          var a = [];
          if (r != null)
            for (var h in Ae(r))
              a.push(h);
          return a;
        }
        function C_(r) {
          return qs.call(r);
        }
        function vh(r, a, h) {
          return a = Xe(a === t ? r.length - 1 : a, 0), function() {
            for (var m = arguments, _ = -1, w = Xe(m.length - a, 0), S = I(w); ++_ < w; )
              S[_] = m[a + _];
            _ = -1;
            for (var P = I(a + 1); ++_ < a; )
              P[_] = m[_];
            return P[a] = h(S), Lt(r, this, P);
          };
        }
        function wh(r, a) {
          return a.length < 2 ? r : Ui(r, Wt(a, 0, -1));
        }
        function O_(r, a) {
          for (var h = r.length, m = it(a.length, h), _ = wt(r); m--; ) {
            var w = a[m];
            r[m] = zn(w, h) ? _[w] : t;
          }
          return r;
        }
        function ul(r, a) {
          if (!(a === "constructor" && typeof r[a] == "function") && a != "__proto__")
            return r[a];
        }
        var bh = Th(Gu), rs = jm || function(r, a) {
          return Ze.setTimeout(r, a);
        }, hl = Th(e_);
        function xh(r, a, h) {
          var m = a + "";
          return hl(r, x_(m, R_(v_(m), h)));
        }
        function Th(r) {
          var a = 0, h = 0;
          return function() {
            var m = qm(), _ = q - (m - h);
            if (h = m, _ > 0) {
              if (++a >= X)
                return arguments[0];
            } else
              a = 0;
            return r.apply(t, arguments);
          };
        }
        function bo(r, a) {
          var h = -1, m = r.length, _ = m - 1;
          for (a = a === t ? m : a; ++h < a; ) {
            var w = Xa(h, _), S = r[w];
            r[w] = r[h], r[h] = S;
          }
          return r.length = a, r;
        }
        var Sh = P_(function(r) {
          var a = [];
          return r.charCodeAt(0) === 46 && a.push(""), r.replace(lr, function(h, m, _, w) {
            a.push(_ ? w.replace(Ep, "$1") : m || h);
          }), a;
        });
        function xn(r) {
          if (typeof r == "string" || Ot(r))
            return r;
          var a = r + "";
          return a == "0" && 1 / r == -Le ? "-0" : a;
        }
        function zi(r) {
          if (r != null) {
            try {
              return Zs.call(r);
            } catch {
            }
            try {
              return r + "";
            } catch {
            }
          }
          return "";
        }
        function R_(r, a) {
          return zt(ct, function(h) {
            var m = "_." + h[0];
            a & h[1] && !Gs(r, m) && r.push(m);
          }), r.sort();
        }
        function Mh(r) {
          if (r instanceof _e)
            return r.clone();
          var a = new Ht(r.__wrapped__, r.__chain__);
          return a.__actions__ = wt(r.__actions__), a.__index__ = r.__index__, a.__values__ = r.__values__, a;
        }
        function D_(r, a, h) {
          (h ? ft(r, a, h) : a === t) ? a = 1 : a = Xe(ue(a), 0);
          var m = r == null ? 0 : r.length;
          if (!m || a < 1)
            return [];
          for (var _ = 0, w = 0, S = I(no(m / a)); _ < m; )
            S[w++] = Wt(r, _, _ += a);
          return S;
        }
        function I_(r) {
          for (var a = -1, h = r == null ? 0 : r.length, m = 0, _ = []; ++a < h; ) {
            var w = r[a];
            w && (_[m++] = w);
          }
          return _;
        }
        function F_() {
          var r = arguments.length;
          if (!r)
            return [];
          for (var a = I(r - 1), h = arguments[0], m = r; m--; )
            a[m - 1] = arguments[m];
          return Qn(le(h) ? wt(h) : [h], qe(a, 1));
        }
        var B_ = fe(function(r, a) {
          return Ne(r) ? Qr(r, qe(a, 1, Ne, !0)) : [];
        }), U_ = fe(function(r, a) {
          var h = Gt(a);
          return Ne(h) && (h = t), Ne(r) ? Qr(r, qe(a, 1, Ne, !0), ne(h, 2)) : [];
        }), k_ = fe(function(r, a) {
          var h = Gt(a);
          return Ne(h) && (h = t), Ne(r) ? Qr(r, qe(a, 1, Ne, !0), t, h) : [];
        });
        function z_(r, a, h) {
          var m = r == null ? 0 : r.length;
          return m ? (a = h || a === t ? 1 : ue(a), Wt(r, a < 0 ? 0 : a, m)) : [];
        }
        function N_(r, a, h) {
          var m = r == null ? 0 : r.length;
          return m ? (a = h || a === t ? 1 : ue(a), a = m - a, Wt(r, 0, a < 0 ? 0 : a)) : [];
        }
        function H_(r, a) {
          return r && r.length ? fo(r, ne(a, 3), !0, !0) : [];
        }
        function V_(r, a) {
          return r && r.length ? fo(r, ne(a, 3), !0) : [];
        }
        function W_(r, a, h, m) {
          var _ = r == null ? 0 : r.length;
          return _ ? (h && typeof h != "number" && ft(r, a, h) && (h = 0, m = _), Fg(r, a, h, m)) : [];
        }
        function Ah(r, a, h) {
          var m = r == null ? 0 : r.length;
          if (!m)
            return -1;
          var _ = h == null ? 0 : ue(h);
          return _ < 0 && (_ = Xe(m + _, 0)), $s(r, ne(a, 3), _);
        }
        function Ph(r, a, h) {
          var m = r == null ? 0 : r.length;
          if (!m)
            return -1;
          var _ = m - 1;
          return h !== t && (_ = ue(h), _ = h < 0 ? Xe(m + _, 0) : it(_, m - 1)), $s(r, ne(a, 3), _, !0);
        }
        function Lh(r) {
          var a = r == null ? 0 : r.length;
          return a ? qe(r, 1) : [];
        }
        function G_(r) {
          var a = r == null ? 0 : r.length;
          return a ? qe(r, Le) : [];
        }
        function $_(r, a) {
          var h = r == null ? 0 : r.length;
          return h ? (a = a === t ? 1 : ue(a), qe(r, a)) : [];
        }
        function j_(r) {
          for (var a = -1, h = r == null ? 0 : r.length, m = {}; ++a < h; ) {
            var _ = r[a];
            m[_[0]] = _[1];
          }
          return m;
        }
        function Eh(r) {
          return r && r.length ? r[0] : t;
        }
        function X_(r, a, h) {
          var m = r == null ? 0 : r.length;
          if (!m)
            return -1;
          var _ = h == null ? 0 : ue(h);
          return _ < 0 && (_ = Xe(m + _, 0)), ur(r, a, _);
        }
        function Y_(r) {
          var a = r == null ? 0 : r.length;
          return a ? Wt(r, 0, -1) : [];
        }
        var Z_ = fe(function(r) {
          var a = Fe(r, Qa);
          return a.length && a[0] === r[0] ? Va(a) : [];
        }), q_ = fe(function(r) {
          var a = Gt(r), h = Fe(r, Qa);
          return a === Gt(h) ? a = t : h.pop(), h.length && h[0] === r[0] ? Va(h, ne(a, 2)) : [];
        }), K_ = fe(function(r) {
          var a = Gt(r), h = Fe(r, Qa);
          return a = typeof a == "function" ? a : t, a && h.pop(), h.length && h[0] === r[0] ? Va(h, t, a) : [];
        });
        function Q_(r, a) {
          return r == null ? "" : Ym.call(r, a);
        }
        function Gt(r) {
          var a = r == null ? 0 : r.length;
          return a ? r[a - 1] : t;
        }
        function J_(r, a, h) {
          var m = r == null ? 0 : r.length;
          if (!m)
            return -1;
          var _ = m;
          return h !== t && (_ = ue(h), _ = _ < 0 ? Xe(m + _, 0) : it(_, m - 1)), a === a ? Rm(r, a, _) : $s(r, cu, _, !0);
        }
        function e0(r, a) {
          return r && r.length ? Nu(r, ue(a)) : t;
        }
        var t0 = fe(Ch);
        function Ch(r, a) {
          return r && r.length && a && a.length ? ja(r, a) : r;
        }
        function n0(r, a, h) {
          return r && r.length && a && a.length ? ja(r, a, ne(h, 2)) : r;
        }
        function i0(r, a, h) {
          return r && r.length && a && a.length ? ja(r, a, t, h) : r;
        }
        var r0 = kn(function(r, a) {
          var h = r == null ? 0 : r.length, m = ka(r, a);
          return Wu(r, Fe(a, function(_) {
            return zn(_, h) ? +_ : _;
          }).sort(Ju)), m;
        });
        function s0(r, a) {
          var h = [];
          if (!(r && r.length))
            return h;
          var m = -1, _ = [], w = r.length;
          for (a = ne(a, 3); ++m < w; ) {
            var S = r[m];
            a(S, m, r) && (h.push(S), _.push(m));
          }
          return Wu(r, _), h;
        }
        function fl(r) {
          return r == null ? r : Qm.call(r);
        }
        function o0(r, a, h) {
          var m = r == null ? 0 : r.length;
          return m ? (h && typeof h != "number" && ft(r, a, h) ? (a = 0, h = m) : (a = a == null ? 0 : ue(a), h = h === t ? m : ue(h)), Wt(r, a, h)) : [];
        }
        function a0(r, a) {
          return ho(r, a);
        }
        function l0(r, a, h) {
          return Za(r, a, ne(h, 2));
        }
        function c0(r, a) {
          var h = r == null ? 0 : r.length;
          if (h) {
            var m = ho(r, a);
            if (m < h && cn(r[m], a))
              return m;
          }
          return -1;
        }
        function u0(r, a) {
          return ho(r, a, !0);
        }
        function h0(r, a, h) {
          return Za(r, a, ne(h, 2), !0);
        }
        function f0(r, a) {
          var h = r == null ? 0 : r.length;
          if (h) {
            var m = ho(r, a, !0) - 1;
            if (cn(r[m], a))
              return m;
          }
          return -1;
        }
        function d0(r) {
          return r && r.length ? $u(r) : [];
        }
        function p0(r, a) {
          return r && r.length ? $u(r, ne(a, 2)) : [];
        }
        function m0(r) {
          var a = r == null ? 0 : r.length;
          return a ? Wt(r, 1, a) : [];
        }
        function g0(r, a, h) {
          return r && r.length ? (a = h || a === t ? 1 : ue(a), Wt(r, 0, a < 0 ? 0 : a)) : [];
        }
        function _0(r, a, h) {
          var m = r == null ? 0 : r.length;
          return m ? (a = h || a === t ? 1 : ue(a), a = m - a, Wt(r, a < 0 ? 0 : a, m)) : [];
        }
        function y0(r, a) {
          return r && r.length ? fo(r, ne(a, 3), !1, !0) : [];
        }
        function v0(r, a) {
          return r && r.length ? fo(r, ne(a, 3)) : [];
        }
        var w0 = fe(function(r) {
          return ni(qe(r, 1, Ne, !0));
        }), b0 = fe(function(r) {
          var a = Gt(r);
          return Ne(a) && (a = t), ni(qe(r, 1, Ne, !0), ne(a, 2));
        }), x0 = fe(function(r) {
          var a = Gt(r);
          return a = typeof a == "function" ? a : t, ni(qe(r, 1, Ne, !0), t, a);
        });
        function T0(r) {
          return r && r.length ? ni(r) : [];
        }
        function S0(r, a) {
          return r && r.length ? ni(r, ne(a, 2)) : [];
        }
        function M0(r, a) {
          return a = typeof a == "function" ? a : t, r && r.length ? ni(r, t, a) : [];
        }
        function dl(r) {
          if (!(r && r.length))
            return [];
          var a = 0;
          return r = Kn(r, function(h) {
            if (Ne(h))
              return a = Xe(h.length, a), !0;
          }), Ca(a, function(h) {
            return Fe(r, Pa(h));
          });
        }
        function Oh(r, a) {
          if (!(r && r.length))
            return [];
          var h = dl(r);
          return a == null ? h : Fe(h, function(m) {
            return Lt(a, t, m);
          });
        }
        var A0 = fe(function(r, a) {
          return Ne(r) ? Qr(r, a) : [];
        }), P0 = fe(function(r) {
          return Ka(Kn(r, Ne));
        }), L0 = fe(function(r) {
          var a = Gt(r);
          return Ne(a) && (a = t), Ka(Kn(r, Ne), ne(a, 2));
        }), E0 = fe(function(r) {
          var a = Gt(r);
          return a = typeof a == "function" ? a : t, Ka(Kn(r, Ne), t, a);
        }), C0 = fe(dl);
        function O0(r, a) {
          return Zu(r || [], a || [], Kr);
        }
        function R0(r, a) {
          return Zu(r || [], a || [], ts);
        }
        var D0 = fe(function(r) {
          var a = r.length, h = a > 1 ? r[a - 1] : t;
          return h = typeof h == "function" ? (r.pop(), h) : t, Oh(r, h);
        });
        function Rh(r) {
          var a = v(r);
          return a.__chain__ = !0, a;
        }
        function I0(r, a) {
          return a(r), r;
        }
        function xo(r, a) {
          return a(r);
        }
        var F0 = kn(function(r) {
          var a = r.length, h = a ? r[0] : 0, m = this.__wrapped__, _ = function(w) {
            return ka(w, r);
          };
          return a > 1 || this.__actions__.length || !(m instanceof _e) || !zn(h) ? this.thru(_) : (m = m.slice(h, +h + (a ? 1 : 0)), m.__actions__.push({
            func: xo,
            args: [_],
            thisArg: t
          }), new Ht(m, this.__chain__).thru(function(w) {
            return a && !w.length && w.push(t), w;
          }));
        });
        function B0() {
          return Rh(this);
        }
        function U0() {
          return new Ht(this.value(), this.__chain__);
        }
        function k0() {
          this.__values__ === t && (this.__values__ = jh(this.value()));
          var r = this.__index__ >= this.__values__.length, a = r ? t : this.__values__[this.__index__++];
          return { done: r, value: a };
        }
        function z0() {
          return this;
        }
        function N0(r) {
          for (var a, h = this; h instanceof oo; ) {
            var m = Mh(h);
            m.__index__ = 0, m.__values__ = t, a ? _.__wrapped__ = m : a = m;
            var _ = m;
            h = h.__wrapped__;
          }
          return _.__wrapped__ = r, a;
        }
        function H0() {
          var r = this.__wrapped__;
          if (r instanceof _e) {
            var a = r;
            return this.__actions__.length && (a = new _e(this)), a = a.reverse(), a.__actions__.push({
              func: xo,
              args: [fl],
              thisArg: t
            }), new Ht(a, this.__chain__);
          }
          return this.thru(fl);
        }
        function V0() {
          return Yu(this.__wrapped__, this.__actions__);
        }
        var W0 = po(function(r, a, h) {
          Me.call(r, h) ? ++r[h] : Bn(r, h, 1);
        });
        function G0(r, a, h) {
          var m = le(r) ? au : Ig;
          return h && ft(r, a, h) && (a = t), m(r, ne(a, 3));
        }
        function $0(r, a) {
          var h = le(r) ? Kn : Ou;
          return h(r, ne(a, 3));
        }
        var j0 = sh(Ah), X0 = sh(Ph);
        function Y0(r, a) {
          return qe(To(r, a), 1);
        }
        function Z0(r, a) {
          return qe(To(r, a), Le);
        }
        function q0(r, a, h) {
          return h = h === t ? 1 : ue(h), qe(To(r, a), h);
        }
        function Dh(r, a) {
          var h = le(r) ? zt : ti;
          return h(r, ne(a, 3));
        }
        function Ih(r, a) {
          var h = le(r) ? mm : Cu;
          return h(r, ne(a, 3));
        }
        var K0 = po(function(r, a, h) {
          Me.call(r, h) ? r[h].push(a) : Bn(r, h, [a]);
        });
        function Q0(r, a, h, m) {
          r = bt(r) ? r : xr(r), h = h && !m ? ue(h) : 0;
          var _ = r.length;
          return h < 0 && (h = Xe(_ + h, 0)), Lo(r) ? h <= _ && r.indexOf(a, h) > -1 : !!_ && ur(r, a, h) > -1;
        }
        var J0 = fe(function(r, a, h) {
          var m = -1, _ = typeof a == "function", w = bt(r) ? I(r.length) : [];
          return ti(r, function(S) {
            w[++m] = _ ? Lt(a, S, h) : Jr(S, a, h);
          }), w;
        }), ey = po(function(r, a, h) {
          Bn(r, h, a);
        });
        function To(r, a) {
          var h = le(r) ? Fe : Uu;
          return h(r, ne(a, 3));
        }
        function ty(r, a, h, m) {
          return r == null ? [] : (le(a) || (a = a == null ? [] : [a]), h = m ? t : h, le(h) || (h = h == null ? [] : [h]), Hu(r, a, h));
        }
        var ny = po(function(r, a, h) {
          r[h ? 0 : 1].push(a);
        }, function() {
          return [[], []];
        });
        function iy(r, a, h) {
          var m = le(r) ? Ma : hu, _ = arguments.length < 3;
          return m(r, ne(a, 4), h, _, ti);
        }
        function ry(r, a, h) {
          var m = le(r) ? gm : hu, _ = arguments.length < 3;
          return m(r, ne(a, 4), h, _, Cu);
        }
        function sy(r, a) {
          var h = le(r) ? Kn : Ou;
          return h(r, Ao(ne(a, 3)));
        }
        function oy(r) {
          var a = le(r) ? Au : Qg;
          return a(r);
        }
        function ay(r, a, h) {
          (h ? ft(r, a, h) : a === t) ? a = 1 : a = ue(a);
          var m = le(r) ? Eg : Jg;
          return m(r, a);
        }
        function ly(r) {
          var a = le(r) ? Cg : t_;
          return a(r);
        }
        function cy(r) {
          if (r == null)
            return 0;
          if (bt(r))
            return Lo(r) ? fr(r) : r.length;
          var a = rt(r);
          return a == Ge || a == Pt ? r.size : Ga(r).length;
        }
        function uy(r, a, h) {
          var m = le(r) ? Aa : n_;
          return h && ft(r, a, h) && (a = t), m(r, ne(a, 3));
        }
        var hy = fe(function(r, a) {
          if (r == null)
            return [];
          var h = a.length;
          return h > 1 && ft(r, a[0], a[1]) ? a = [] : h > 2 && ft(a[0], a[1], a[2]) && (a = [a[0]]), Hu(r, qe(a, 1), []);
        }), So = $m || function() {
          return Ze.Date.now();
        };
        function fy(r, a) {
          if (typeof a != "function")
            throw new Nt(l);
          return r = ue(r), function() {
            if (--r < 1)
              return a.apply(this, arguments);
          };
        }
        function Fh(r, a, h) {
          return a = h ? t : a, a = r && a == null ? r.length : a, Un(r, V, t, t, t, t, a);
        }
        function Bh(r, a) {
          var h;
          if (typeof a != "function")
            throw new Nt(l);
          return r = ue(r), function() {
            return --r > 0 && (h = a.apply(this, arguments)), r <= 1 && (a = t), h;
          };
        }
        var pl = fe(function(r, a, h) {
          var m = b;
          if (h.length) {
            var _ = Jn(h, wr(pl));
            m |= k;
          }
          return Un(r, m, a, h, _);
        }), Uh = fe(function(r, a, h) {
          var m = b | L;
          if (h.length) {
            var _ = Jn(h, wr(Uh));
            m |= k;
          }
          return Un(a, m, r, h, _);
        });
        function kh(r, a, h) {
          a = h ? t : a;
          var m = Un(r, A, t, t, t, t, t, a);
          return m.placeholder = kh.placeholder, m;
        }
        function zh(r, a, h) {
          a = h ? t : a;
          var m = Un(r, R, t, t, t, t, t, a);
          return m.placeholder = zh.placeholder, m;
        }
        function Nh(r, a, h) {
          var m, _, w, S, P, C, N = 0, H = !1, W = !1, Y = !0;
          if (typeof r != "function")
            throw new Nt(l);
          a = $t(a) || 0, Ue(h) && (H = !!h.leading, W = "maxWait" in h, w = W ? Xe($t(h.maxWait) || 0, a) : w, Y = "trailing" in h ? !!h.trailing : Y);
          function J(He) {
            var un = m, Vn = _;
            return m = _ = t, N = He, S = r.apply(Vn, un), S;
          }
          function ie(He) {
            return N = He, P = rs(de, a), H ? J(He) : S;
          }
          function he(He) {
            var un = He - C, Vn = He - N, of = a - un;
            return W ? it(of, w - Vn) : of;
          }
          function re(He) {
            var un = He - C, Vn = He - N;
            return C === t || un >= a || un < 0 || W && Vn >= w;
          }
          function de() {
            var He = So();
            if (re(He))
              return ye(He);
            P = rs(de, he(He));
          }
          function ye(He) {
            return P = t, Y && m ? J(He) : (m = _ = t, S);
          }
          function Rt() {
            P !== t && qu(P), N = 0, m = C = _ = P = t;
          }
          function dt() {
            return P === t ? S : ye(So());
          }
          function Dt() {
            var He = So(), un = re(He);
            if (m = arguments, _ = this, C = He, un) {
              if (P === t)
                return ie(C);
              if (W)
                return qu(P), P = rs(de, a), J(C);
            }
            return P === t && (P = rs(de, a)), S;
          }
          return Dt.cancel = Rt, Dt.flush = dt, Dt;
        }
        var dy = fe(function(r, a) {
          return Eu(r, 1, a);
        }), py = fe(function(r, a, h) {
          return Eu(r, $t(a) || 0, h);
        });
        function my(r) {
          return Un(r, $);
        }
        function Mo(r, a) {
          if (typeof r != "function" || a != null && typeof a != "function")
            throw new Nt(l);
          var h = function() {
            var m = arguments, _ = a ? a.apply(this, m) : m[0], w = h.cache;
            if (w.has(_))
              return w.get(_);
            var S = r.apply(this, m);
            return h.cache = w.set(_, S) || w, S;
          };
          return h.cache = new (Mo.Cache || Fn)(), h;
        }
        Mo.Cache = Fn;
        function Ao(r) {
          if (typeof r != "function")
            throw new Nt(l);
          return function() {
            var a = arguments;
            switch (a.length) {
              case 0:
                return !r.call(this);
              case 1:
                return !r.call(this, a[0]);
              case 2:
                return !r.call(this, a[0], a[1]);
              case 3:
                return !r.call(this, a[0], a[1], a[2]);
            }
            return !r.apply(this, a);
          };
        }
        function gy(r) {
          return Bh(2, r);
        }
        var _y = i_(function(r, a) {
          a = a.length == 1 && le(a[0]) ? Fe(a[0], Et(ne())) : Fe(qe(a, 1), Et(ne()));
          var h = a.length;
          return fe(function(m) {
            for (var _ = -1, w = it(m.length, h); ++_ < w; )
              m[_] = a[_].call(this, m[_]);
            return Lt(r, this, m);
          });
        }), ml = fe(function(r, a) {
          var h = Jn(a, wr(ml));
          return Un(r, k, t, a, h);
        }), Hh = fe(function(r, a) {
          var h = Jn(a, wr(Hh));
          return Un(r, G, t, a, h);
        }), yy = kn(function(r, a) {
          return Un(r, F, t, t, t, a);
        });
        function vy(r, a) {
          if (typeof r != "function")
            throw new Nt(l);
          return a = a === t ? a : ue(a), fe(r, a);
        }
        function wy(r, a) {
          if (typeof r != "function")
            throw new Nt(l);
          return a = a == null ? 0 : Xe(ue(a), 0), fe(function(h) {
            var m = h[a], _ = ri(h, 0, a);
            return m && Qn(_, m), Lt(r, this, _);
          });
        }
        function by(r, a, h) {
          var m = !0, _ = !0;
          if (typeof r != "function")
            throw new Nt(l);
          return Ue(h) && (m = "leading" in h ? !!h.leading : m, _ = "trailing" in h ? !!h.trailing : _), Nh(r, a, {
            leading: m,
            maxWait: a,
            trailing: _
          });
        }
        function xy(r) {
          return Fh(r, 1);
        }
        function Ty(r, a) {
          return ml(Ja(a), r);
        }
        function Sy() {
          if (!arguments.length)
            return [];
          var r = arguments[0];
          return le(r) ? r : [r];
        }
        function My(r) {
          return Vt(r, y);
        }
        function Ay(r, a) {
          return a = typeof a == "function" ? a : t, Vt(r, y, a);
        }
        function Py(r) {
          return Vt(r, d | y);
        }
        function Ly(r, a) {
          return a = typeof a == "function" ? a : t, Vt(r, d | y, a);
        }
        function Ey(r, a) {
          return a == null || Lu(r, a, Ye(a));
        }
        function cn(r, a) {
          return r === a || r !== r && a !== a;
        }
        var Cy = yo(Ha), Oy = yo(function(r, a) {
          return r >= a;
        }), Ni = Iu(/* @__PURE__ */ (function() {
          return arguments;
        })()) ? Iu : function(r) {
          return ze(r) && Me.call(r, "callee") && !wu.call(r, "callee");
        }, le = I.isArray, Ry = tu ? Et(tu) : Ng;
        function bt(r) {
          return r != null && Po(r.length) && !Nn(r);
        }
        function Ne(r) {
          return ze(r) && bt(r);
        }
        function Dy(r) {
          return r === !0 || r === !1 || ze(r) && ht(r) == yt;
        }
        var si = Xm || Al, Iy = nu ? Et(nu) : Hg;
        function Fy(r) {
          return ze(r) && r.nodeType === 1 && !ss(r);
        }
        function By(r) {
          if (r == null)
            return !0;
          if (bt(r) && (le(r) || typeof r == "string" || typeof r.splice == "function" || si(r) || br(r) || Ni(r)))
            return !r.length;
          var a = rt(r);
          if (a == Ge || a == Pt)
            return !r.size;
          if (is(r))
            return !Ga(r).length;
          for (var h in r)
            if (Me.call(r, h))
              return !1;
          return !0;
        }
        function Uy(r, a) {
          return es(r, a);
        }
        function ky(r, a, h) {
          h = typeof h == "function" ? h : t;
          var m = h ? h(r, a) : t;
          return m === t ? es(r, a, t, h) : !!m;
        }
        function gl(r) {
          if (!ze(r))
            return !1;
          var a = ht(r);
          return a == Rn || a == rr || typeof r.message == "string" && typeof r.name == "string" && !ss(r);
        }
        function zy(r) {
          return typeof r == "number" && xu(r);
        }
        function Nn(r) {
          if (!Ue(r))
            return !1;
          var a = ht(r);
          return a == nn || a == Dn || a == en || a == sr;
        }
        function Vh(r) {
          return typeof r == "number" && r == ue(r);
        }
        function Po(r) {
          return typeof r == "number" && r > -1 && r % 1 == 0 && r <= we;
        }
        function Ue(r) {
          var a = typeof r;
          return r != null && (a == "object" || a == "function");
        }
        function ze(r) {
          return r != null && typeof r == "object";
        }
        var Wh = iu ? Et(iu) : Wg;
        function Ny(r, a) {
          return r === a || Wa(r, a, ol(a));
        }
        function Hy(r, a, h) {
          return h = typeof h == "function" ? h : t, Wa(r, a, ol(a), h);
        }
        function Vy(r) {
          return Gh(r) && r != +r;
        }
        function Wy(r) {
          if (A_(r))
            throw new ae(o);
          return Fu(r);
        }
        function Gy(r) {
          return r === null;
        }
        function $y(r) {
          return r == null;
        }
        function Gh(r) {
          return typeof r == "number" || ze(r) && ht(r) == At;
        }
        function ss(r) {
          if (!ze(r) || ht(r) != vt)
            return !1;
          var a = Js(r);
          if (a === null)
            return !0;
          var h = Me.call(a, "constructor") && a.constructor;
          return typeof h == "function" && h instanceof h && Zs.call(h) == Hm;
        }
        var _l = ru ? Et(ru) : Gg;
        function jy(r) {
          return Vh(r) && r >= -we && r <= we;
        }
        var $h = su ? Et(su) : $g;
        function Lo(r) {
          return typeof r == "string" || !le(r) && ze(r) && ht(r) == Xn;
        }
        function Ot(r) {
          return typeof r == "symbol" || ze(r) && ht(r) == Yn;
        }
        var br = ou ? Et(ou) : jg;
        function Xy(r) {
          return r === t;
        }
        function Yy(r) {
          return ze(r) && rt(r) == Li;
        }
        function Zy(r) {
          return ze(r) && ht(r) == pa;
        }
        var qy = yo($a), Ky = yo(function(r, a) {
          return r <= a;
        });
        function jh(r) {
          if (!r)
            return [];
          if (bt(r))
            return Lo(r) ? an(r) : wt(r);
          if (jr && r[jr])
            return Em(r[jr]());
          var a = rt(r), h = a == Ge ? Ra : a == Pt ? js : xr;
          return h(r);
        }
        function Hn(r) {
          if (!r)
            return r === 0 ? r : 0;
          if (r = $t(r), r === Le || r === -Le) {
            var a = r < 0 ? -1 : 1;
            return a * xe;
          }
          return r === r ? r : 0;
        }
        function ue(r) {
          var a = Hn(r), h = a % 1;
          return a === a ? h ? a - h : a : 0;
        }
        function Xh(r) {
          return r ? Bi(ue(r), 0, Ee) : 0;
        }
        function $t(r) {
          if (typeof r == "number")
            return r;
          if (Ot(r))
            return ge;
          if (Ue(r)) {
            var a = typeof r.valueOf == "function" ? r.valueOf() : r;
            r = Ue(a) ? a + "" : a;
          }
          if (typeof r != "string")
            return r === 0 ? r : +r;
          r = fu(r);
          var h = Rp.test(r);
          return h || Ip.test(r) ? fm(r.slice(2), h ? 2 : 8) : Op.test(r) ? ge : +r;
        }
        function Yh(r) {
          return bn(r, xt(r));
        }
        function Qy(r) {
          return r ? Bi(ue(r), -we, we) : r === 0 ? r : 0;
        }
        function Se(r) {
          return r == null ? "" : Ct(r);
        }
        var Jy = yr(function(r, a) {
          if (is(a) || bt(a)) {
            bn(a, Ye(a), r);
            return;
          }
          for (var h in a)
            Me.call(a, h) && Kr(r, h, a[h]);
        }), Zh = yr(function(r, a) {
          bn(a, xt(a), r);
        }), Eo = yr(function(r, a, h, m) {
          bn(a, xt(a), r, m);
        }), ev = yr(function(r, a, h, m) {
          bn(a, Ye(a), r, m);
        }), tv = kn(ka);
        function nv(r, a) {
          var h = _r(r);
          return a == null ? h : Pu(h, a);
        }
        var iv = fe(function(r, a) {
          r = Ae(r);
          var h = -1, m = a.length, _ = m > 2 ? a[2] : t;
          for (_ && ft(a[0], a[1], _) && (m = 1); ++h < m; )
            for (var w = a[h], S = xt(w), P = -1, C = S.length; ++P < C; ) {
              var N = S[P], H = r[N];
              (H === t || cn(H, pr[N]) && !Me.call(r, N)) && (r[N] = w[N]);
            }
          return r;
        }), rv = fe(function(r) {
          return r.push(t, fh), Lt(qh, t, r);
        });
        function sv(r, a) {
          return lu(r, ne(a, 3), wn);
        }
        function ov(r, a) {
          return lu(r, ne(a, 3), Na);
        }
        function av(r, a) {
          return r == null ? r : za(r, ne(a, 3), xt);
        }
        function lv(r, a) {
          return r == null ? r : Ru(r, ne(a, 3), xt);
        }
        function cv(r, a) {
          return r && wn(r, ne(a, 3));
        }
        function uv(r, a) {
          return r && Na(r, ne(a, 3));
        }
        function hv(r) {
          return r == null ? [] : co(r, Ye(r));
        }
        function fv(r) {
          return r == null ? [] : co(r, xt(r));
        }
        function yl(r, a, h) {
          var m = r == null ? t : Ui(r, a);
          return m === t ? h : m;
        }
        function dv(r, a) {
          return r != null && mh(r, a, Bg);
        }
        function vl(r, a) {
          return r != null && mh(r, a, Ug);
        }
        var pv = ah(function(r, a, h) {
          a != null && typeof a.toString != "function" && (a = qs.call(a)), r[a] = h;
        }, bl(Tt)), mv = ah(function(r, a, h) {
          a != null && typeof a.toString != "function" && (a = qs.call(a)), Me.call(r, a) ? r[a].push(h) : r[a] = [h];
        }, ne), gv = fe(Jr);
        function Ye(r) {
          return bt(r) ? Mu(r) : Ga(r);
        }
        function xt(r) {
          return bt(r) ? Mu(r, !0) : Xg(r);
        }
        function _v(r, a) {
          var h = {};
          return a = ne(a, 3), wn(r, function(m, _, w) {
            Bn(h, a(m, _, w), m);
          }), h;
        }
        function yv(r, a) {
          var h = {};
          return a = ne(a, 3), wn(r, function(m, _, w) {
            Bn(h, _, a(m, _, w));
          }), h;
        }
        var vv = yr(function(r, a, h) {
          uo(r, a, h);
        }), qh = yr(function(r, a, h, m) {
          uo(r, a, h, m);
        }), wv = kn(function(r, a) {
          var h = {};
          if (r == null)
            return h;
          var m = !1;
          a = Fe(a, function(w) {
            return w = ii(w, r), m || (m = w.length > 1), w;
          }), bn(r, rl(r), h), m && (h = Vt(h, d | g | y, p_));
          for (var _ = a.length; _--; )
            qa(h, a[_]);
          return h;
        });
        function bv(r, a) {
          return Kh(r, Ao(ne(a)));
        }
        var xv = kn(function(r, a) {
          return r == null ? {} : Zg(r, a);
        });
        function Kh(r, a) {
          if (r == null)
            return {};
          var h = Fe(rl(r), function(m) {
            return [m];
          });
          return a = ne(a), Vu(r, h, function(m, _) {
            return a(m, _[0]);
          });
        }
        function Tv(r, a, h) {
          a = ii(a, r);
          var m = -1, _ = a.length;
          for (_ || (_ = 1, r = t); ++m < _; ) {
            var w = r == null ? t : r[xn(a[m])];
            w === t && (m = _, w = h), r = Nn(w) ? w.call(r) : w;
          }
          return r;
        }
        function Sv(r, a, h) {
          return r == null ? r : ts(r, a, h);
        }
        function Mv(r, a, h, m) {
          return m = typeof m == "function" ? m : t, r == null ? r : ts(r, a, h, m);
        }
        var Qh = uh(Ye), Jh = uh(xt);
        function Av(r, a, h) {
          var m = le(r), _ = m || si(r) || br(r);
          if (a = ne(a, 4), h == null) {
            var w = r && r.constructor;
            _ ? h = m ? new w() : [] : Ue(r) ? h = Nn(w) ? _r(Js(r)) : {} : h = {};
          }
          return (_ ? zt : wn)(r, function(S, P, C) {
            return a(h, S, P, C);
          }), h;
        }
        function Pv(r, a) {
          return r == null ? !0 : qa(r, a);
        }
        function Lv(r, a, h) {
          return r == null ? r : Xu(r, a, Ja(h));
        }
        function Ev(r, a, h, m) {
          return m = typeof m == "function" ? m : t, r == null ? r : Xu(r, a, Ja(h), m);
        }
        function xr(r) {
          return r == null ? [] : Oa(r, Ye(r));
        }
        function Cv(r) {
          return r == null ? [] : Oa(r, xt(r));
        }
        function Ov(r, a, h) {
          return h === t && (h = a, a = t), h !== t && (h = $t(h), h = h === h ? h : 0), a !== t && (a = $t(a), a = a === a ? a : 0), Bi($t(r), a, h);
        }
        function Rv(r, a, h) {
          return a = Hn(a), h === t ? (h = a, a = 0) : h = Hn(h), r = $t(r), kg(r, a, h);
        }
        function Dv(r, a, h) {
          if (h && typeof h != "boolean" && ft(r, a, h) && (a = h = t), h === t && (typeof a == "boolean" ? (h = a, a = t) : typeof r == "boolean" && (h = r, r = t)), r === t && a === t ? (r = 0, a = 1) : (r = Hn(r), a === t ? (a = r, r = 0) : a = Hn(a)), r > a) {
            var m = r;
            r = a, a = m;
          }
          if (h || r % 1 || a % 1) {
            var _ = Tu();
            return it(r + _ * (a - r + hm("1e-" + ((_ + "").length - 1))), a);
          }
          return Xa(r, a);
        }
        var Iv = vr(function(r, a, h) {
          return a = a.toLowerCase(), r + (h ? ef(a) : a);
        });
        function ef(r) {
          return wl(Se(r).toLowerCase());
        }
        function tf(r) {
          return r = Se(r), r && r.replace(Bp, Sm).replace(tm, "");
        }
        function Fv(r, a, h) {
          r = Se(r), a = Ct(a);
          var m = r.length;
          h = h === t ? m : Bi(ue(h), 0, m);
          var _ = h;
          return h -= a.length, h >= 0 && r.slice(h, _) == a;
        }
        function Bv(r) {
          return r = Se(r), r && Ns.test(r) ? r.replace(rn, Mm) : r;
        }
        function Uv(r) {
          return r = Se(r), r && xp.test(r) ? r.replace(ma, "\\$&") : r;
        }
        var kv = vr(function(r, a, h) {
          return r + (h ? "-" : "") + a.toLowerCase();
        }), zv = vr(function(r, a, h) {
          return r + (h ? " " : "") + a.toLowerCase();
        }), Nv = rh("toLowerCase");
        function Hv(r, a, h) {
          r = Se(r), a = ue(a);
          var m = a ? fr(r) : 0;
          if (!a || m >= a)
            return r;
          var _ = (a - m) / 2;
          return _o(io(_), h) + r + _o(no(_), h);
        }
        function Vv(r, a, h) {
          r = Se(r), a = ue(a);
          var m = a ? fr(r) : 0;
          return a && m < a ? r + _o(a - m, h) : r;
        }
        function Wv(r, a, h) {
          r = Se(r), a = ue(a);
          var m = a ? fr(r) : 0;
          return a && m < a ? _o(a - m, h) + r : r;
        }
        function Gv(r, a, h) {
          return h || a == null ? a = 0 : a && (a = +a), Km(Se(r).replace(ga, ""), a || 0);
        }
        function $v(r, a, h) {
          return (h ? ft(r, a, h) : a === t) ? a = 1 : a = ue(a), Ya(Se(r), a);
        }
        function jv() {
          var r = arguments, a = Se(r[0]);
          return r.length < 3 ? a : a.replace(r[1], r[2]);
        }
        var Xv = vr(function(r, a, h) {
          return r + (h ? "_" : "") + a.toLowerCase();
        });
        function Yv(r, a, h) {
          return h && typeof h != "number" && ft(r, a, h) && (a = h = t), h = h === t ? Ee : h >>> 0, h ? (r = Se(r), r && (typeof a == "string" || a != null && !_l(a)) && (a = Ct(a), !a && hr(r)) ? ri(an(r), 0, h) : r.split(a, h)) : [];
        }
        var Zv = vr(function(r, a, h) {
          return r + (h ? " " : "") + wl(a);
        });
        function qv(r, a, h) {
          return r = Se(r), h = h == null ? 0 : Bi(ue(h), 0, r.length), a = Ct(a), r.slice(h, h + a.length) == a;
        }
        function Kv(r, a, h) {
          var m = v.templateSettings;
          h && ft(r, a, h) && (a = t), r = Se(r), a = Eo({}, a, m, hh);
          var _ = Eo({}, a.imports, m.imports, hh), w = Ye(_), S = Oa(_, w), P, C, N = 0, H = a.interpolate || Hs, W = "__p += '", Y = Da(
            (a.escape || Hs).source + "|" + H.source + "|" + (H === qn ? Cp : Hs).source + "|" + (a.evaluate || Hs).source + "|$",
            "g"
          ), J = "//# sourceURL=" + (Me.call(a, "sourceURL") ? (a.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++om + "]") + `
`;
          r.replace(Y, function(re, de, ye, Rt, dt, Dt) {
            return ye || (ye = Rt), W += r.slice(N, Dt).replace(Up, Am), de && (P = !0, W += `' +
__e(` + de + `) +
'`), dt && (C = !0, W += `';
` + dt + `;
__p += '`), ye && (W += `' +
((__t = (` + ye + `)) == null ? '' : __t) +
'`), N = Dt + re.length, re;
          }), W += `';
`;
          var ie = Me.call(a, "variable") && a.variable;
          if (!ie)
            W = `with (obj) {
` + W + `
}
`;
          else if (Lp.test(ie))
            throw new ae(c);
          W = (C ? W.replace(se, "") : W).replace(ve, "$1").replace($e, "$1;"), W = "function(" + (ie || "obj") + `) {
` + (ie ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (P ? ", __e = _.escape" : "") + (C ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + W + `return __p
}`;
          var he = rf(function() {
            return Te(w, J + "return " + W).apply(t, S);
          });
          if (he.source = W, gl(he))
            throw he;
          return he;
        }
        function Qv(r) {
          return Se(r).toLowerCase();
        }
        function Jv(r) {
          return Se(r).toUpperCase();
        }
        function ew(r, a, h) {
          if (r = Se(r), r && (h || a === t))
            return fu(r);
          if (!r || !(a = Ct(a)))
            return r;
          var m = an(r), _ = an(a), w = du(m, _), S = pu(m, _) + 1;
          return ri(m, w, S).join("");
        }
        function tw(r, a, h) {
          if (r = Se(r), r && (h || a === t))
            return r.slice(0, gu(r) + 1);
          if (!r || !(a = Ct(a)))
            return r;
          var m = an(r), _ = pu(m, an(a)) + 1;
          return ri(m, 0, _).join("");
        }
        function nw(r, a, h) {
          if (r = Se(r), r && (h || a === t))
            return r.replace(ga, "");
          if (!r || !(a = Ct(a)))
            return r;
          var m = an(r), _ = du(m, an(a));
          return ri(m, _).join("");
        }
        function iw(r, a) {
          var h = z, m = U;
          if (Ue(a)) {
            var _ = "separator" in a ? a.separator : _;
            h = "length" in a ? ue(a.length) : h, m = "omission" in a ? Ct(a.omission) : m;
          }
          r = Se(r);
          var w = r.length;
          if (hr(r)) {
            var S = an(r);
            w = S.length;
          }
          if (h >= w)
            return r;
          var P = h - fr(m);
          if (P < 1)
            return m;
          var C = S ? ri(S, 0, P).join("") : r.slice(0, P);
          if (_ === t)
            return C + m;
          if (S && (P += C.length - P), _l(_)) {
            if (r.slice(P).search(_)) {
              var N, H = C;
              for (_.global || (_ = Da(_.source, Se(Ic.exec(_)) + "g")), _.lastIndex = 0; N = _.exec(H); )
                var W = N.index;
              C = C.slice(0, W === t ? P : W);
            }
          } else if (r.indexOf(Ct(_), P) != P) {
            var Y = C.lastIndexOf(_);
            Y > -1 && (C = C.slice(0, Y));
          }
          return C + m;
        }
        function rw(r) {
          return r = Se(r), r && Dc.test(r) ? r.replace(Ut, Dm) : r;
        }
        var sw = vr(function(r, a, h) {
          return r + (h ? " " : "") + a.toUpperCase();
        }), wl = rh("toUpperCase");
        function nf(r, a, h) {
          return r = Se(r), a = h ? t : a, a === t ? Lm(r) ? Bm(r) : vm(r) : r.match(a) || [];
        }
        var rf = fe(function(r, a) {
          try {
            return Lt(r, t, a);
          } catch (h) {
            return gl(h) ? h : new ae(h);
          }
        }), ow = kn(function(r, a) {
          return zt(a, function(h) {
            h = xn(h), Bn(r, h, pl(r[h], r));
          }), r;
        });
        function aw(r) {
          var a = r == null ? 0 : r.length, h = ne();
          return r = a ? Fe(r, function(m) {
            if (typeof m[1] != "function")
              throw new Nt(l);
            return [h(m[0]), m[1]];
          }) : [], fe(function(m) {
            for (var _ = -1; ++_ < a; ) {
              var w = r[_];
              if (Lt(w[0], this, m))
                return Lt(w[1], this, m);
            }
          });
        }
        function lw(r) {
          return Dg(Vt(r, d));
        }
        function bl(r) {
          return function() {
            return r;
          };
        }
        function cw(r, a) {
          return r == null || r !== r ? a : r;
        }
        var uw = oh(), hw = oh(!0);
        function Tt(r) {
          return r;
        }
        function xl(r) {
          return Bu(typeof r == "function" ? r : Vt(r, d));
        }
        function fw(r) {
          return ku(Vt(r, d));
        }
        function dw(r, a) {
          return zu(r, Vt(a, d));
        }
        var pw = fe(function(r, a) {
          return function(h) {
            return Jr(h, r, a);
          };
        }), mw = fe(function(r, a) {
          return function(h) {
            return Jr(r, h, a);
          };
        });
        function Tl(r, a, h) {
          var m = Ye(a), _ = co(a, m);
          h == null && !(Ue(a) && (_.length || !m.length)) && (h = a, a = r, r = this, _ = co(a, Ye(a)));
          var w = !(Ue(h) && "chain" in h) || !!h.chain, S = Nn(r);
          return zt(_, function(P) {
            var C = a[P];
            r[P] = C, S && (r.prototype[P] = function() {
              var N = this.__chain__;
              if (w || N) {
                var H = r(this.__wrapped__), W = H.__actions__ = wt(this.__actions__);
                return W.push({ func: C, args: arguments, thisArg: r }), H.__chain__ = N, H;
              }
              return C.apply(r, Qn([this.value()], arguments));
            });
          }), r;
        }
        function gw() {
          return Ze._ === this && (Ze._ = Vm), this;
        }
        function Sl() {
        }
        function _w(r) {
          return r = ue(r), fe(function(a) {
            return Nu(a, r);
          });
        }
        var yw = tl(Fe), vw = tl(au), ww = tl(Aa);
        function sf(r) {
          return ll(r) ? Pa(xn(r)) : qg(r);
        }
        function bw(r) {
          return function(a) {
            return r == null ? t : Ui(r, a);
          };
        }
        var xw = lh(), Tw = lh(!0);
        function Ml() {
          return [];
        }
        function Al() {
          return !1;
        }
        function Sw() {
          return {};
        }
        function Mw() {
          return "";
        }
        function Aw() {
          return !0;
        }
        function Pw(r, a) {
          if (r = ue(r), r < 1 || r > we)
            return [];
          var h = Ee, m = it(r, Ee);
          a = ne(a), r -= Ee;
          for (var _ = Ca(m, a); ++h < r; )
            a(h);
          return _;
        }
        function Lw(r) {
          return le(r) ? Fe(r, xn) : Ot(r) ? [r] : wt(Sh(Se(r)));
        }
        function Ew(r) {
          var a = ++Nm;
          return Se(r) + a;
        }
        var Cw = go(function(r, a) {
          return r + a;
        }, 0), Ow = nl("ceil"), Rw = go(function(r, a) {
          return r / a;
        }, 1), Dw = nl("floor");
        function Iw(r) {
          return r && r.length ? lo(r, Tt, Ha) : t;
        }
        function Fw(r, a) {
          return r && r.length ? lo(r, ne(a, 2), Ha) : t;
        }
        function Bw(r) {
          return uu(r, Tt);
        }
        function Uw(r, a) {
          return uu(r, ne(a, 2));
        }
        function kw(r) {
          return r && r.length ? lo(r, Tt, $a) : t;
        }
        function zw(r, a) {
          return r && r.length ? lo(r, ne(a, 2), $a) : t;
        }
        var Nw = go(function(r, a) {
          return r * a;
        }, 1), Hw = nl("round"), Vw = go(function(r, a) {
          return r - a;
        }, 0);
        function Ww(r) {
          return r && r.length ? Ea(r, Tt) : 0;
        }
        function Gw(r, a) {
          return r && r.length ? Ea(r, ne(a, 2)) : 0;
        }
        return v.after = fy, v.ary = Fh, v.assign = Jy, v.assignIn = Zh, v.assignInWith = Eo, v.assignWith = ev, v.at = tv, v.before = Bh, v.bind = pl, v.bindAll = ow, v.bindKey = Uh, v.castArray = Sy, v.chain = Rh, v.chunk = D_, v.compact = I_, v.concat = F_, v.cond = aw, v.conforms = lw, v.constant = bl, v.countBy = W0, v.create = nv, v.curry = kh, v.curryRight = zh, v.debounce = Nh, v.defaults = iv, v.defaultsDeep = rv, v.defer = dy, v.delay = py, v.difference = B_, v.differenceBy = U_, v.differenceWith = k_, v.drop = z_, v.dropRight = N_, v.dropRightWhile = H_, v.dropWhile = V_, v.fill = W_, v.filter = $0, v.flatMap = Y0, v.flatMapDeep = Z0, v.flatMapDepth = q0, v.flatten = Lh, v.flattenDeep = G_, v.flattenDepth = $_, v.flip = my, v.flow = uw, v.flowRight = hw, v.fromPairs = j_, v.functions = hv, v.functionsIn = fv, v.groupBy = K0, v.initial = Y_, v.intersection = Z_, v.intersectionBy = q_, v.intersectionWith = K_, v.invert = pv, v.invertBy = mv, v.invokeMap = J0, v.iteratee = xl, v.keyBy = ey, v.keys = Ye, v.keysIn = xt, v.map = To, v.mapKeys = _v, v.mapValues = yv, v.matches = fw, v.matchesProperty = dw, v.memoize = Mo, v.merge = vv, v.mergeWith = qh, v.method = pw, v.methodOf = mw, v.mixin = Tl, v.negate = Ao, v.nthArg = _w, v.omit = wv, v.omitBy = bv, v.once = gy, v.orderBy = ty, v.over = yw, v.overArgs = _y, v.overEvery = vw, v.overSome = ww, v.partial = ml, v.partialRight = Hh, v.partition = ny, v.pick = xv, v.pickBy = Kh, v.property = sf, v.propertyOf = bw, v.pull = t0, v.pullAll = Ch, v.pullAllBy = n0, v.pullAllWith = i0, v.pullAt = r0, v.range = xw, v.rangeRight = Tw, v.rearg = yy, v.reject = sy, v.remove = s0, v.rest = vy, v.reverse = fl, v.sampleSize = ay, v.set = Sv, v.setWith = Mv, v.shuffle = ly, v.slice = o0, v.sortBy = hy, v.sortedUniq = d0, v.sortedUniqBy = p0, v.split = Yv, v.spread = wy, v.tail = m0, v.take = g0, v.takeRight = _0, v.takeRightWhile = y0, v.takeWhile = v0, v.tap = I0, v.throttle = by, v.thru = xo, v.toArray = jh, v.toPairs = Qh, v.toPairsIn = Jh, v.toPath = Lw, v.toPlainObject = Yh, v.transform = Av, v.unary = xy, v.union = w0, v.unionBy = b0, v.unionWith = x0, v.uniq = T0, v.uniqBy = S0, v.uniqWith = M0, v.unset = Pv, v.unzip = dl, v.unzipWith = Oh, v.update = Lv, v.updateWith = Ev, v.values = xr, v.valuesIn = Cv, v.without = A0, v.words = nf, v.wrap = Ty, v.xor = P0, v.xorBy = L0, v.xorWith = E0, v.zip = C0, v.zipObject = O0, v.zipObjectDeep = R0, v.zipWith = D0, v.entries = Qh, v.entriesIn = Jh, v.extend = Zh, v.extendWith = Eo, Tl(v, v), v.add = Cw, v.attempt = rf, v.camelCase = Iv, v.capitalize = ef, v.ceil = Ow, v.clamp = Ov, v.clone = My, v.cloneDeep = Py, v.cloneDeepWith = Ly, v.cloneWith = Ay, v.conformsTo = Ey, v.deburr = tf, v.defaultTo = cw, v.divide = Rw, v.endsWith = Fv, v.eq = cn, v.escape = Bv, v.escapeRegExp = Uv, v.every = G0, v.find = j0, v.findIndex = Ah, v.findKey = sv, v.findLast = X0, v.findLastIndex = Ph, v.findLastKey = ov, v.floor = Dw, v.forEach = Dh, v.forEachRight = Ih, v.forIn = av, v.forInRight = lv, v.forOwn = cv, v.forOwnRight = uv, v.get = yl, v.gt = Cy, v.gte = Oy, v.has = dv, v.hasIn = vl, v.head = Eh, v.identity = Tt, v.includes = Q0, v.indexOf = X_, v.inRange = Rv, v.invoke = gv, v.isArguments = Ni, v.isArray = le, v.isArrayBuffer = Ry, v.isArrayLike = bt, v.isArrayLikeObject = Ne, v.isBoolean = Dy, v.isBuffer = si, v.isDate = Iy, v.isElement = Fy, v.isEmpty = By, v.isEqual = Uy, v.isEqualWith = ky, v.isError = gl, v.isFinite = zy, v.isFunction = Nn, v.isInteger = Vh, v.isLength = Po, v.isMap = Wh, v.isMatch = Ny, v.isMatchWith = Hy, v.isNaN = Vy, v.isNative = Wy, v.isNil = $y, v.isNull = Gy, v.isNumber = Gh, v.isObject = Ue, v.isObjectLike = ze, v.isPlainObject = ss, v.isRegExp = _l, v.isSafeInteger = jy, v.isSet = $h, v.isString = Lo, v.isSymbol = Ot, v.isTypedArray = br, v.isUndefined = Xy, v.isWeakMap = Yy, v.isWeakSet = Zy, v.join = Q_, v.kebabCase = kv, v.last = Gt, v.lastIndexOf = J_, v.lowerCase = zv, v.lowerFirst = Nv, v.lt = qy, v.lte = Ky, v.max = Iw, v.maxBy = Fw, v.mean = Bw, v.meanBy = Uw, v.min = kw, v.minBy = zw, v.stubArray = Ml, v.stubFalse = Al, v.stubObject = Sw, v.stubString = Mw, v.stubTrue = Aw, v.multiply = Nw, v.nth = e0, v.noConflict = gw, v.noop = Sl, v.now = So, v.pad = Hv, v.padEnd = Vv, v.padStart = Wv, v.parseInt = Gv, v.random = Dv, v.reduce = iy, v.reduceRight = ry, v.repeat = $v, v.replace = jv, v.result = Tv, v.round = Hw, v.runInContext = E, v.sample = oy, v.size = cy, v.snakeCase = Xv, v.some = uy, v.sortedIndex = a0, v.sortedIndexBy = l0, v.sortedIndexOf = c0, v.sortedLastIndex = u0, v.sortedLastIndexBy = h0, v.sortedLastIndexOf = f0, v.startCase = Zv, v.startsWith = qv, v.subtract = Vw, v.sum = Ww, v.sumBy = Gw, v.template = Kv, v.times = Pw, v.toFinite = Hn, v.toInteger = ue, v.toLength = Xh, v.toLower = Qv, v.toNumber = $t, v.toSafeInteger = Qy, v.toString = Se, v.toUpper = Jv, v.trim = ew, v.trimEnd = tw, v.trimStart = nw, v.truncate = iw, v.unescape = rw, v.uniqueId = Ew, v.upperCase = sw, v.upperFirst = wl, v.each = Dh, v.eachRight = Ih, v.first = Eh, Tl(v, (function() {
          var r = {};
          return wn(v, function(a, h) {
            Me.call(v.prototype, h) || (r[h] = a);
          }), r;
        })(), { chain: !1 }), v.VERSION = n, zt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(r) {
          v[r].placeholder = v;
        }), zt(["drop", "take"], function(r, a) {
          _e.prototype[r] = function(h) {
            h = h === t ? 1 : Xe(ue(h), 0);
            var m = this.__filtered__ && !a ? new _e(this) : this.clone();
            return m.__filtered__ ? m.__takeCount__ = it(h, m.__takeCount__) : m.__views__.push({
              size: it(h, Ee),
              type: r + (m.__dir__ < 0 ? "Right" : "")
            }), m;
          }, _e.prototype[r + "Right"] = function(h) {
            return this.reverse()[r](h).reverse();
          };
        }), zt(["filter", "map", "takeWhile"], function(r, a) {
          var h = a + 1, m = h == Z || h == Q;
          _e.prototype[r] = function(_) {
            var w = this.clone();
            return w.__iteratees__.push({
              iteratee: ne(_, 3),
              type: h
            }), w.__filtered__ = w.__filtered__ || m, w;
          };
        }), zt(["head", "last"], function(r, a) {
          var h = "take" + (a ? "Right" : "");
          _e.prototype[r] = function() {
            return this[h](1).value()[0];
          };
        }), zt(["initial", "tail"], function(r, a) {
          var h = "drop" + (a ? "" : "Right");
          _e.prototype[r] = function() {
            return this.__filtered__ ? new _e(this) : this[h](1);
          };
        }), _e.prototype.compact = function() {
          return this.filter(Tt);
        }, _e.prototype.find = function(r) {
          return this.filter(r).head();
        }, _e.prototype.findLast = function(r) {
          return this.reverse().find(r);
        }, _e.prototype.invokeMap = fe(function(r, a) {
          return typeof r == "function" ? new _e(this) : this.map(function(h) {
            return Jr(h, r, a);
          });
        }), _e.prototype.reject = function(r) {
          return this.filter(Ao(ne(r)));
        }, _e.prototype.slice = function(r, a) {
          r = ue(r);
          var h = this;
          return h.__filtered__ && (r > 0 || a < 0) ? new _e(h) : (r < 0 ? h = h.takeRight(-r) : r && (h = h.drop(r)), a !== t && (a = ue(a), h = a < 0 ? h.dropRight(-a) : h.take(a - r)), h);
        }, _e.prototype.takeRightWhile = function(r) {
          return this.reverse().takeWhile(r).reverse();
        }, _e.prototype.toArray = function() {
          return this.take(Ee);
        }, wn(_e.prototype, function(r, a) {
          var h = /^(?:filter|find|map|reject)|While$/.test(a), m = /^(?:head|last)$/.test(a), _ = v[m ? "take" + (a == "last" ? "Right" : "") : a], w = m || /^find/.test(a);
          _ && (v.prototype[a] = function() {
            var S = this.__wrapped__, P = m ? [1] : arguments, C = S instanceof _e, N = P[0], H = C || le(S), W = function(de) {
              var ye = _.apply(v, Qn([de], P));
              return m && Y ? ye[0] : ye;
            };
            H && h && typeof N == "function" && N.length != 1 && (C = H = !1);
            var Y = this.__chain__, J = !!this.__actions__.length, ie = w && !Y, he = C && !J;
            if (!w && H) {
              S = he ? S : new _e(this);
              var re = r.apply(S, P);
              return re.__actions__.push({ func: xo, args: [W], thisArg: t }), new Ht(re, Y);
            }
            return ie && he ? r.apply(this, P) : (re = this.thru(W), ie ? m ? re.value()[0] : re.value() : re);
          });
        }), zt(["pop", "push", "shift", "sort", "splice", "unshift"], function(r) {
          var a = Xs[r], h = /^(?:push|sort|unshift)$/.test(r) ? "tap" : "thru", m = /^(?:pop|shift)$/.test(r);
          v.prototype[r] = function() {
            var _ = arguments;
            if (m && !this.__chain__) {
              var w = this.value();
              return a.apply(le(w) ? w : [], _);
            }
            return this[h](function(S) {
              return a.apply(le(S) ? S : [], _);
            });
          };
        }), wn(_e.prototype, function(r, a) {
          var h = v[a];
          if (h) {
            var m = h.name + "";
            Me.call(gr, m) || (gr[m] = []), gr[m].push({ name: a, func: h });
          }
        }), gr[mo(t, L).name] = [{
          name: "wrapper",
          func: t
        }], _e.prototype.clone = rg, _e.prototype.reverse = sg, _e.prototype.value = og, v.prototype.at = F0, v.prototype.chain = B0, v.prototype.commit = U0, v.prototype.next = k0, v.prototype.plant = N0, v.prototype.reverse = H0, v.prototype.toJSON = v.prototype.valueOf = v.prototype.value = V0, v.prototype.first = v.prototype.head, jr && (v.prototype[jr] = z0), v;
      }), dr = Um();
      Ri ? ((Ri.exports = dr)._ = dr, xa._ = dr) : Ze._ = dr;
    }).call(IS);
  })(xs, xs.exports)), xs.exports;
}
var BS = FS(), US = Object.defineProperty, kS = (s, e, t) => e in s ? US(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, zS = (s, e, t) => kS(s, e + "", t);
let dn = class extends gt {
  /**
   * Create a Point feature instance.
   * 创建点要素实例
   * 
   * @param options Point feature configuration
   *                点要素配置
   */
  constructor(e) {
    super(e), zS(this, "_baseType", "Point"), this._renderObject = this._createRenderObject(), this._paint && this._paint.applyTo(this._renderObject);
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
    const e = this.getMap(), t = new D(
      this._geometry.coordinates[0],
      this._geometry.coordinates[1],
      this._geometry.coordinates[2] || 0
      // Default height 500
    );
    return e ? e.lngLatToWorld(t) : t;
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
    return new zr(
      new Kt(),
      new sa({ size: 1, color: 8947848 })
    );
  }
};
var NS = Object.defineProperty, HS = (s, e, t) => e in s ? NS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, VS = (s, e, t) => HS(s, e + "", t);
const WS = {
  // 默认配置项
};
class xi extends dn {
  /**
   * Create a marker feature instance.
   * 创建标记点要素实例
   * 
   * @param options - Marker configuration options. 标记点配置选项
   */
  constructor(e) {
    super(e), VS(this, "_type", "Marker");
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
    this._worldCoordinates = this._coordsTransform(), this._paint && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._paint), this._refreshCoordinates());
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
      case "circle":
        return Kd(e.config, new D(0, 0, 0));
      case "icon":
        return wT(e.config, this._worldCoordinates);
      case "symbol":
        return ET(e.config, this._worldCoordinates);
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
      return this._paint?.config.type === "icon" ? this._calculateSpriteBoundingBox(
        this._renderObject
      ) : this._getFallbackBoundingBox();
    } catch (n) {
      return console.warn(`Marker ${this._id} bounding box calculation failed:`, n), console.warn(`Marker ${this._id} 包围盒计算失败:`, n), this._getFallbackBoundingBox();
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
      const n = Math.max(Math.abs(e.scale.x), Math.abs(e.scale.y)) / 2e-3;
      return {
        width: n,
        height: n,
        offsetX: -n / 2,
        offsetY: -n / 2
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
    switch (this.getPaint()?.config.type) {
      case "icon":
      case "symbol":
        return { width: 20, height: 20, offsetX: -10, offsetY: -10 };
      case "circle":
        return { width: 10, height: 10, offsetX: -5, offsetY: -5 };
      default:
        return { width: 15, height: 15, offsetX: -7.5, offsetY: -7.5 };
    }
  }
}
xi.mergeOptions(WS);
var GS = Object.defineProperty, $S = (s, e, t) => e in s ? GS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Gf = (s, e, t) => $S(s, typeof e != "symbol" ? e + "" : e, t);
class ap extends gt {
  /**
   * Create a Line feature instance.
   * 创建线要素实例
   * 
   * @param options Line feature configuration
   *                线要素配置
   */
  constructor(e) {
    super(e), Gf(this, "_baseType", "Line"), Gf(this, "_vertexPoints"), this._renderObject = this._createRenderObject(), this._vertexPoints = [0, 0, 0], this._paint && this._paint.applyTo(this._renderObject);
  }
  /**
   * LngLatLike transformation method.
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
    const e = this.getMap(), t = this._geometry, n = e?.prjcenter;
    if (this._geometry.type === "LineString") {
      let o = t.coordinates.map((c) => {
        const u = new D(c[0], c[1], c[2] || 0);
        return (e ? e.lngLatToWorld(u) : u).sub(n);
      }), l = o.flatMap((c) => [c.x, c.y, c.z]);
      return {
        _worldLngLatLikes: o,
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
    const e = new la(), t = new ks({
      color: 8947848,
      linewidth: 0.1,
      dashed: !1,
      resolution: new ce(window.innerWidth, window.innerHeight)
    });
    return new ca(e, t);
  }
}
var jS = Object.defineProperty, XS = (s, e, t) => e in s ? jS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, YS = (s, e, t) => XS(s, e + "", t);
const ZS = {
  // type: 'circle', // Defaults to Point geometry
};
class Ft extends ap {
  /**
   * Create a LineString feature instance.
   * 创建线要素实例
   * 
   * @param options Configuration options for the line feature
   *                线要素配置
   */
  constructor(e) {
    super(e), YS(this, "_type", "LineString");
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
    this._vertexPoints = e, this._paint && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._paint), this._refreshCoordinates());
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
    if (this._vertexPoints = e, this._renderObject && (this._renderObject.isLine2 || this._renderObject instanceof ca)) {
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
      case "line":
        return Mc(e.config, this._vertexPoints);
      case "flow-tube":
        return Qd(e.config, this._vertexPoints);
      case "arrow":
        return Jd(e.config, this._vertexPoints);
      case "flow-texture":
        return await ep(e.config, this._vertexPoints);
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
}
Ft.mergeOptions(ZS);
var qS = Object.defineProperty, KS = (s, e, t) => e in s ? qS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, $f = (s, e, t) => KS(s, typeof e != "symbol" ? e + "" : e, t);
class QS extends gt {
  /**
   * Create a Surface feature instance.
   * 创建表面要素实例
   * 
   * @param options Surface configuration
   *                表面配置
   */
  constructor(e) {
    super(e), $f(this, "_baseType", "Surface"), $f(this, "_vertexPoints"), this._buildRenderObject(), this._vertexPoints = [0, 0, 0], this._paint && this._renderObject && this._paint.applyTo(this._renderObject);
  }
  _buildRenderObject() {
    if (this._renderObject || !this._geometry) return;
    const { _vertexPoints: t } = this._coordsTransform();
    this._vertexPoints = t, this._renderObject = this._createRenderObject();
  }
  /**
   * LngLatLike transformation method.
   * 坐标转换方法
   * 
   * @returns Transformed coordinate information
   *          转换后的坐标信息
   * 
   * @description
   * Handles coordinate transformation for Polygon and MultiPolygon, returning:
   * - _worldLngLatLikes: Array of transformed coordinates
   * - _vertexPoints: Array of flattened vertex coordinates
   * 
   * 处理多边形和多面体的坐标转换，返回：
   * - _worldLngLatLikes: 转换后的坐标数组
   * - _vertexPoints: 展平的顶点坐标数组
   * 
   * @throws Throws error if geometry type is not supported
   *         如果几何类型不支持会抛出错误
   */
  _coordsTransform() {
    const e = this.getMap(), t = e?.prjcenter, n = this._geometry;
    if (!n) throw new Error("Geometry data undefined");
    if (n.type === "Polygon") {
      const i = n.coordinates;
      let o = [], l = [];
      return i.forEach((c) => {
        const u = c.map((f) => {
          const p = new D(f[0], f[1], f[2] || 0), d = e ? e.lngLatToWorld(p) : p;
          return t ? d.sub(t) : d;
        });
        o.push(u), l.push(...u.flatMap((f) => [f.x, f.y, f.z]));
      }), { _worldLngLatLikes: o, _vertexPoints: l };
    } else if (n.type === "MultiPolygon") {
      const i = n.coordinates;
      let o = [], l = [];
      return i.forEach((c) => {
        const u = [];
        c.forEach((f) => {
          const p = f.map((d) => {
            const g = new D(d[0], d[1], d[2] || 0), y = e ? e.lngLatToWorld(g) : g;
            return t ? y.sub(t) : y;
          });
          u.push(p), l.push(...p.flatMap((d) => [d.x, d.y, d.z]));
        }), o.push(u);
      }), { _worldLngLatLikes: o, _vertexPoints: l };
    } else
      throw new Error(`Unsupported geometry type: ${n.type}`);
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
  _refreshLngLatLikes() {
    const e = this._paint?.config.type;
    if (this.clear(), !this._renderObject || !this._vertexPoints?.length) {
      console.warn("Cannot update geometry: missing geometry or vertex data");
      return;
    }
    const t = this.getMap();
    try {
      e === "basic-polygon" ? (this._renderObject.renderOrder = 90, this._renderObject.position.add(t?.prjcenter), this._renderObject.updateMatrix(), this.add(this._renderObject)) : (e === "extrude-polygon" || e?.includes("water")) && (this._renderObject.renderOrder = 90, this._renderObject.position.add(t?.prjcenter), this._renderObject.updateMatrix(), this.add(this._renderObject));
    } catch (n) {
      throw console.error("Failed to update polygon position:", n), n;
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
    const e = new la(), t = new ks({
      color: 8947848,
      linewidth: 0.1,
      dashed: !1,
      resolution: new ce(window.innerWidth, window.innerHeight)
    });
    return new ca(e, t);
  }
}
var JS = Object.defineProperty, eM = (s, e, t) => e in s ? JS(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, tM = (s, e, t) => eM(s, e + "", t);
const nM = {
  // Default config items
};
class Gn extends QS {
  /**
   * Create a Polygon feature instance.
   * 创建多边形要素实例
   * 
   * @param options Polygon configuration
   *                多边形配置
   */
  constructor(e) {
    super(e), tM(this, "_type", "Polygon");
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
    this._vertexPoints = e, this._paint && (this._renderObject && this.remove(this._renderObject), this._renderObject = await this._createObject(this._paint), this._refreshCoordinates(), await this._paint.applyTo(this._renderObject));
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
    const e = this._paint?.config.type;
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
      case "fill":
        return xT(e.config, this._vertexPoints);
      case "extrusion":
        return TT(e.config, this._vertexPoints);
      case "water":
        return ST(e.config, this.getMap(), this._vertexPoints);
      case "water-simple":
        return MT(e.config, this._vertexPoints);
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
Gn.mergeOptions(nM);
var iM = Object.defineProperty, rM = (s, e, t) => e in s ? iM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, $l = (s, e, t) => rM(s, typeof e != "symbol" ? e + "" : e, t);
const sM = {
  // Default configuration items
  // 默认配置项
};
class oM extends ap {
  /**
   * Create a MultiLineString feature instance.
   * 创建多线要素实例
   * 
   * @param options Multi-line configuration options
   *                多线配置选项
   */
  constructor(e) {
    super(e), $l(this, "_type", "MultiLineString"), $l(this, "_lineObjects", []), $l(this, "_linesContainer"), this._linesContainer = new Qt();
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
    if (this.clearLines(), this._disposeGeometry(), this._paint) {
      for (const n of e) {
        const i = n.flatMap((l) => [l.x, l.y, l.z]), o = await this._createLineObject(this._paint, i);
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
      case "line":
        return Mc(e.config, t);
      case "flow-tube":
        return Qd(e.config, t);
      case "arrow":
        return Jd(e.config, t);
      case "flow-texture":
        return await ep(e.config, t);
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
      const n = e?.prjcenter;
      return { _worldCoordinates: t.coordinates.map((o) => o.map((l) => {
        const c = new D(l[0], l[1], l[2] || 0);
        return (e ? e.lngLatToWorld(c) : c).sub(n);
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
oM.mergeOptions(sM);
var aM = Object.defineProperty, lM = (s, e, t) => e in s ? aM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, us = (s, e, t) => lM(s, typeof e != "symbol" ? e + "" : e, t);
const jl = 64;
class cM extends st.MeshStandardMaterial {
  /**
   * 构造函数
   * @param options 材质选项
   */
  constructor(e = {}) {
    const { shaderOption: t, regionOverlay: n, ...i } = e;
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
    }), us(this, "shaderOption"), us(this, "clock"), us(this, "time"), us(this, "startTime"), us(this, "regionOverlay"), n && n.vertices && n.vertices.length > 0) {
      const o = n.vertices.slice(0, jl).map((c) => c.clone()), l = o.length;
      for (; o.length < jl; )
        o.push(new st.Vector2(0, 0));
      this.regionOverlay = {
        color: n.color,
        opacity: n.opacity,
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
    const { minY: t, maxY: n, minRate: i, maxRate: o, effects: l } = this.shaderOption, c = n - t, u = !!this.regionOverlay;
    e.uniforms = {
      ...e.uniforms,
      time: this.time,
      uStartTime: this.startTime,
      uMinY: { value: t },
      uMaxY: { value: n },
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
        value: this.regionOverlay?.vertices || new Array(jl).fill(0).map(() => new st.Vector2(0, 0))
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
    const n = new st.Vector3();
    t.getCenter(n);
    const i = [
      new st.Vector3(t.min.x, t.min.y, t.min.z),
      new st.Vector3(t.max.x, t.max.y, t.max.z)
    ];
    let o = 0;
    i.forEach((l) => {
      const c = n.distanceTo(l);
      c > o && (o = c);
    }), this.shaderOption.effects.diffusion = {
      ...this.shaderOption.effects.diffusion,
      center: n,
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
var uM = Object.defineProperty, hM = (s, e, t) => e in s ? uM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, fn = (s, e, t) => hM(s, typeof e != "symbol" ? e + "" : e, t);
const fM = {
  emissive: !1,
  emissiveIntensity: 1,
  emissiveColor: "#ffffff"
};
class dM extends dn {
  /**
   * Create a Model feature instance.
   * 创建模型要素实例
   * 
   * @param options Model configuration options
   *                模型配置选项
   */
  constructor(e) {
    super(e), fn(this, "_type", "Model"), fn(this, "_emissive", !1), fn(this, "_emissiveIntensity", 1), fn(this, "_emissiveColor", "#ffffff"), fn(this, "_mixer", null), fn(this, "_currentAction", null), fn(this, "_animations", []), fn(this, "_clock", new ia()), fn(this, "_autoUpdate", !0), fn(this, "_animationRequestId", null), fn(this, "_iscity", !1), this._emissive = e.emissive || !1, this._emissiveIntensity = e.emissiveIntensity || 1, this._emissiveColor = e.emissiveColor || "#ffffff", this.castShadow = e.castShadow || !1, this.receiveShadow = e.receiveShadow || !1, this._iscity = e.iscity || !1;
  }
  /**
   * Convert feature to Three.js geometry.
   * 将要素转换为Three.js几何体
   * 
   * @returns Promise<void>
   */
  async _buildRenderObject() {
    if (this._worldCoordinates = this._coordsTransform(), this._paint) {
      if (this._renderObject && this._disposeGeometry(), this.modelunino = await this._createObject(this._paint), this._renderObject = this.modelunino.model, !this._renderObject) {
        console.error("Model load failed: model returned by _createObject is undefined"), console.error("模型加载失败：_createObject返回的model为undefined");
        return;
      }
      this._renderObject.userData._type = "Model", this.modelunino.animations && this.modelunino.animations.length > 0 && (this._animations = this.modelunino.animations, this._mixer = new Sb(this._renderObject), this._startAnimationLoop(), this.playAnimation({
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
      case "model-fbx":
      case "model-gltf":
        return bT(e.config, this._worldCoordinates);
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
  setEmission(e, t, n) {
    this._emissive = e, t !== void 0 && (this._emissiveIntensity = t), n !== void 0 && (this._emissiveColor = n), this._applyEmissionProperties();
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
    return this.userData.bloom = e, this._renderObject && this._renderObject.traverse((n) => {
      n instanceof Be && (n.userData.originalMaterial || (n.userData.originalMaterial = n.material), e ? Array.isArray(n.material) ? n.material.forEach((i) => {
        "emissive" in i && (i.emissive.setHex(16777215), i.emissiveIntensity = 0.5);
      }) : "emissive" in n.material && (n.material.emissive.setHex(16777215), n.material.emissiveIntensity = 0.5) : Array.isArray(n.material) ? n.material.forEach((i) => {
        "emissive" in i && (i.emissive.setHex(0), i.emissiveIntensity = 0);
      }) : "emissive" in n.material && (n.material.emissive.setHex(0), n.material.emissiveIntensity = 0));
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
    const t = typeof e.name == "number" ? this._animations[e.name] : this._animations.find((n) => n.name === e.name);
    if (!t) {
      console.warn(`Animation not found: ${e.name}`), console.warn(`找不到动画: ${e.name}`);
      return;
    }
    this._currentAction = this._mixer.clipAction(t), this._currentAction.setLoop(e.loop ? Mb : Ab, e.loop ? 1 / 0 : 1), this._currentAction.timeScale = e.speed || 1, this._currentAction.time = e.startAt || 0, this._currentAction.setEffectiveWeight(e.weight || 1), e.fadeInDuration && e.fadeInDuration > 0 && this._currentAction.fadeIn(e.fadeInDuration), this._currentAction.play(), this._autoUpdate && this._animationRequestId === null && this._startAnimationLoop();
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
    return typeof e.name == "number" ? t = this._animations[e.name] : t = this._animations.find((n) => n.name === e.name), t ? t.duration : null;
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
   * Fallback to GeoJSON + lngLatToWorld only if no feature is provided.
   * 
   * 从区域蒙版配置计算世界坐标系下的多边形顶点（XZ 平面）
   * 优先使用 Terra 面 feature 中已有的世界坐标（_vertexPoints），
   * 如果没有传 feature，才回退到 GeoJSON + lngLatToWorld。
   */
  _computeOverlayVertices(e) {
    const t = e.feature;
    if (t && Array.isArray(t._vertexPoints) && t._vertexPoints.length >= 6) {
      const u = t.getMap?.() || this.getMap();
      if (u && u.prjcenter) {
        const f = u.prjcenter, p = t._vertexPoints, d = [];
        for (let g = 0; g + 2 < p.length; g += 3) {
          const y = p[g], x = p[g + 2], T = f.x + y, b = f.z + x;
          d.push(new ce(T, b));
        }
        if (d.length >= 3)
          return d;
      }
    }
    const n = this.getMap();
    if (!n || !e.geometry) return null;
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
      const f = u[0], p = u[1], d = n.lngLatToWorld(new D(f, p, 0));
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
      const n = e.getRegionOverlays() || [];
      if (n.length) {
        const i = n.filter((l) => (l.mode ?? "overlay") === "overlay").sort((l, c) => (l.zIndex ?? 0) - (c.zIndex ?? 0)), o = i[i.length - 1];
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
    this.traverse(async (n) => {
      if (n instanceof Be && n.material) {
        if (n.castShadow = !0, n.name === "building") {
          const i = new cM({
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
          }), o = new tr().setFromObject(n);
          i.updateBoundingBox(o.min.y, o.max.y), i.setDiffusionFromObject(n), n.receiveShadow = !1, n.material = i, n.material.needsUpdate = !0;
        }
        n.name === "grass" && (n.castShadow = !1, n.receiveShadow = !0, n.material.color = new oe("#81e4d8ff)").multiplyScalar(0.7), n.material.metalness = 0.2, n.material.roughness = 0.8, ["metalnessMap", "normalMap", "roughnessMap", "specularColorMap"].forEach((i) => {
          const o = n.material[i];
          o && (o.wrapS = o.wrapT = yn, o.repeat.set(0.3, 0.3), o.needsUpdate = !0);
        }), n.material.normalScale = new ce(3, 3));
      }
    });
  }
}
dM.mergeOptions(fM);
var pM = Object.defineProperty, mM = (s, e, t) => e in s ? pM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, gM = (s, e, t) => mM(s, e + "", t);
const _M = {
  // emissive: false,
  // emissiveIntensity: 1.0,
  // emissiveColor: "#ffffff",
};
class yM extends dn {
  /**
   * Create a Cloud feature instance.
   * 创建云朵要素
   * 
   * @param options Cloud configuration options
   *                云朵配置选项
   */
  constructor(e) {
    super(e), gM(this, "_type", "Cloud");
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
    this._worldCoordinates = this._coordsTransform(), this._paint && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._paint), this._refreshCoordinates());
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
      return AT(e.config, this._worldCoordinates);
    throw new Error(`Unsupported style type: ${e.config.type}`);
  }
}
yM.mergeOptions(_M);
var vM = Object.defineProperty, wM = (s, e, t) => e in s ? vM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, bM = (s, e, t) => wM(s, e + "", t);
const xM = {
  // Default config items
};
class TM extends dn {
  /**
   * Create a label feature.
   * 创建标签要素
   * 
   * @param options Label configuration options
   *                标签配置选项
   */
  constructor(e) {
    super(e), bM(this, "_type", "Label");
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
    this._worldCoordinates = this._coordsTransform(), this._paint && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._paint), this._refreshCoordinates());
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
      case "text-fixed":
        return LT(
          e.config,
          new D(0, 0, 0),
          this.getMap()
        );
      case "text":
        return PT(
          e.config,
          new D(0, 0, 0)
        );
      default:
        throw new Error(`Unsupported style type: ${e.config.type}`);
    }
  }
}
TM.mergeOptions(xM);
var SM = Object.defineProperty, MM = (s, e, t) => e in s ? SM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, jf = (s, e, t) => MM(s, typeof e != "symbol" ? e + "" : e, t);
const AM = {};
class PM extends dn {
  /**
   * Create a TPoints feature instance.
   * 创建TPoints要素实例
   * 
   * @param options TPoints configuration options
   *                TPoints配置选项
   */
  constructor(e) {
    super(e), jf(this, "_type", "TPoints"), jf(this, "_geometries"), this._geometries = e.geometries;
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
    this._worldCoordinates = this._coordsTransform(), this._paint && (this._renderObject && this._disposeGeometry(), this._renderObject = await this._createObject(this._paint), this._refreshCoordinates());
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
      return UT(e.config, this._geometries, this.getMap());
    throw new Error(`Unsupported style type: ${e.config.type}`);
  }
}
PM.mergeOptions(AM);
var LM = Object.defineProperty, EM = (s, e, t) => e in s ? LM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ci = (s, e, t) => EM(s, typeof e != "symbol" ? e + "" : e, t);
class hs extends Ti(Object) {
  /**
   * Create edit handle instance
   * 创建编辑手柄实例
   * 
   * @param options - Handle options 手柄配置选项
   * @param map - Map instance 地图实例
   */
  constructor(e, t) {
    super(), ci(this, "options"), ci(this, "map"), ci(this, "_sprite", null), ci(this, "_isDragging", !1), ci(this, "_dragStartPosition", null), ci(this, "_lastCoordinate", null), ci(this, "_boundOnMouseMove", null), ci(this, "_boundOnMouseUp", null), this.map = t, this.options = {
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
    const t = document.createElement("canvas"), n = t.getContext("2d");
    t.width = 64, t.height = 64;
    const i = 64 / 2, o = 64 / 2 - 2;
    n.clearRect(0, 0, t.width, t.height), n.beginPath(), n.arc(i, i, o, 0, 2 * Math.PI), n.fillStyle = "#000000", n.fill(), n.beginPath(), n.arc(i, i, o - 2, 0, 2 * Math.PI), n.fillStyle = this.options.color, n.fill();
    const l = new Fs(t);
    l.needsUpdate = !0;
    const c = new Is({
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
    this._sprite = new nr(c), this._sprite.position.copy(this.options.position), this._sprite.renderOrder = 999999;
    const u = new ce();
    this._sprite.onBeforeRender = (f, p, d) => {
      if (!this._sprite || !d) return;
      const g = d.position.distanceTo(this._sprite.position);
      f.getSize(u);
      const y = f.getPixelRatio(), x = this.options.size * y;
      let T = 1;
      if (d.isPerspectiveCamera) {
        const b = d.fov * Math.PI / 180, L = 2 * Math.tan(b / 2) * g;
        T = x / u.y * L;
      } else if (d.isOrthographicCamera) {
        const b = d.top, L = d.bottom, M = Math.abs(b - L) / d.zoom;
        T = x / u.y * M;
      }
      this._sprite.scale.set(T, T, 1);
    }, this._sprite._editHandle = this, this.map.sceneRenderer.scene.add(this._sprite);
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
    this.options.draggable && (this._isDragging = !0, this._dragStartPosition = this.options.position.clone(), this._lastCoordinate = e, this.map.sceneRenderer.configure("draggable", !1), this.map.on("mousemove", this._boundOnMouseMove), this.map.on("mouseup", this._boundOnMouseUp), this.fire("dragstart", {
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
    const t = e.coordinate, n = t[0] - this._lastCoordinate[0], i = t[1] - this._lastCoordinate[1], o = this.map.worldToLngLat(this.options.position), l = this.map.lngLatToWorld(new D(
      t[0],
      t[1],
      o.z
    ));
    this.updatePosition(l), this._lastCoordinate = t, this.fire("dragging", {
      target: this,
      coordinate: t,
      position: this.options.position.clone(),
      offset: { dx: n, dy: i }
    });
  }
  /**
   * Handle mouse up event
   * 处理鼠标释放事件
   * @private
   */
  _onMouseUp(e) {
    this._isDragging && (this._isDragging = !1, this.map.sceneRenderer.configure("draggable", !0), this.map.off("mousemove", this._boundOnMouseMove), this.map.off("mouseup", this._boundOnMouseUp), this.fire("dragend", {
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
    if (this._isDragging && (this._isDragging = !1, this.map.sceneRenderer.configure("draggable", !0), this.map.off("mousemove", this._boundOnMouseMove), this.map.off("mouseup", this._boundOnMouseUp)), this._sprite) {
      this.map.sceneRenderer.scene.remove(this._sprite);
      const e = this._sprite.material;
      e.map && e.map.dispose(), e.dispose(), this._sprite = null;
    }
    this._dragStartPosition = null, this._lastCoordinate = null, this._boundOnMouseMove = null, this._boundOnMouseUp = null;
  }
}
function Ec(s, e, t) {
  const { currentTarget: n, clientX: i, clientY: o } = s;
  if (n instanceof HTMLElement) {
    const l = n.clientWidth, c = n.clientHeight, u = new ce(i / l * 2 - 1, -(o / c) * 2 + 1);
    return Ld(t, e, u)?.location;
  } else
    return;
}
var CM = Object.defineProperty, OM = (s, e, t) => e in s ? CM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ot = (s, e, t) => OM(s, typeof e != "symbol" ? e + "" : e, t);
class RM extends ua {
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
    return this._editing ? this : (super.enable(), this._editing = !0, this._createShadow(), this._saveSnapshot(), this._setFeatureEditingStyle(!0), this._createHandles(), this.target.fire("editstart"), this._draggableOriginalState = this.target.options.draggable || !1, this._draggableOriginalState || (this.target.options.draggable = !0, this.target.draggable && this.target.draggable.enable()), this);
  }
  /**
   * Disable editor
   * 禁用编辑器
   */
  disable() {
    return this._editing ? (super.disable(), this._editing = !1, this._clearHandles(), this._setFeatureEditingStyle(!1), this._draggableOriginalState || (this.target.options.draggable = !1, this.target.draggable && this.target.draggable.disable()), this._draggableOriginalState = !1, this._updateCoordFromShadow(), this._removeShadow(), this.target.fire("editend"), this) : this;
  }
  /**
   * Add event hooks
   * 添加事件钩子
   */
  addHooks() {
    const e = this._getMap();
    e && (e.on("mousemove", this._boundOnMapMouseMove), e.on("click", this._boundOnMapClick), e.sceneRenderer.container && e.sceneRenderer.container.addEventListener("mousedown", this._boundOnMapMouseDown, !0), this.options.removeVertexOn === "contextmenu" && e.on("contextmenu", this._boundOnMapClick)), this.target.on("dragging", this._boundOnFeatureDragging), this.target.on("dragend", this._boundOnFeatureDragEnd);
  }
  /**
   * Remove event hooks
   * 移除事件钩子
   */
  removeHooks() {
    const e = this._getMap();
    e && (e.off("mousemove", this._boundOnMapMouseMove), e.off("click", this._boundOnMapClick), e.sceneRenderer.container && e.sceneRenderer.container.removeEventListener("mousedown", this._boundOnMapMouseDown, !0), this.options.removeVertexOn === "contextmenu" && e.off("contextmenu", this._boundOnMapClick)), this.target.off("dragging", this._boundOnFeatureDragging), this.target.off("dragend", this._boundOnFeatureDragEnd);
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
      this._restoreCoordinates(e.coordinates), this.target.fire("editundo");
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
      this._restoreCoordinates(e.coordinates), this.target.fire("editredo");
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
    this.target instanceof dn ? this._createPointHandles(e, t) : this.target instanceof Ft ? this._createLineStringHandles(e, t) : this.target instanceof Gn && this._createPolygonHandles(e, t);
  }
  /**
   * Create edit handles for Point feature
   * 创建点要素的编辑手柄
   * @private
   */
  _createPointHandles(e, t) {
    const n = e.coordinates, i = t.lngLatToWorld(new D(n[0], n[1], n[2] || 0)), o = new hs({
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
    const n = e.coordinates;
    n.forEach((i, o) => {
      const l = t.lngLatToWorld(new D(i[0], i[1], i[2] || 0)), c = new hs({
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
    }), this.options.showMiddleHandles && this._createLineStringMiddleHandles(n, t);
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
    this.target instanceof dn ? c.coordinates = [l.x, l.y, l.z] : this.target instanceof Ft && (c.coordinates[t] = [l.x, l.y, l.z]), this.target._refreshCoordinates(), this.target.fire("handledragging", {
      index: t,
      coordinate: [l.x, l.y, l.z]
    }), this.target.fire("editing", {
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
    this._updating = !0, this.target.fire("handledragstart", {
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
    const n = this.target._geometry;
    this._addHistory(n.coordinates), this.target.fire("handledragend", {
      index: t,
      coordinate: this.target instanceof dn ? n.coordinates : n.coordinates[t]
    }), this.target.fire("editvertex", {
      index: t,
      coordinate: this.target instanceof dn ? n.coordinates : n.coordinates[t]
    });
  }
  /**
   * Create polygon edit handles
   * 创建多边形编辑手柄
   * @description createPolygonEditor
   * @private
   */
  _createPolygonHandles(e, t) {
    const n = e.coordinates;
    if (!n || !Array.isArray(n) || n.length === 0) {
      console.warn("[FeatureEditHandler] Invalid polygon coordinates");
      return;
    }
    n.forEach((o, l) => {
      if (!o || o.length < 3)
        return;
      const c = o[0][0] === o[o.length - 1][0] && o[0][1] === o[o.length - 1][1] ? o.length - 1 : o.length;
      for (let u = 0; u < c; u++) {
        const f = o[u], p = t.lngLatToWorld(new D(f[0], f[1], f[2] || 0)), d = new hs({
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
  _onPolygonHandleDragStart(e, t, n) {
    this._updating = !0, this.target.fire("handledragstart", {
      index: t,
      ringIndex: n,
      coordinate: e.coordinate
    });
  }
  /**
   * 多边形手柄拖拽中
   * @description  moveVertexHandle
   * @private
   */
  _onPolygonHandleDragging(e, t, n) {
    const o = e.target.getPosition();
    if (!this._getMap())
      return;
    const c = this._fixHandlePointCoordinates(o, t, n), f = this.target._geometry.coordinates;
    if (f[n] && f[n][t] && (f[n][t] = [c.x, c.y, c.z], t === 0 && f[n].length > 1)) {
      const p = f[n].length - 1;
      f[n][p] = [c.x, c.y, c.z];
    }
    this.target._refreshCoordinates(), this.target.fire("handledragging", {
      index: t,
      ringIndex: n,
      coordinate: [c.x, c.y, c.z]
    }), this.target.fire("editing", {
      index: t,
      ringIndex: n,
      coordinate: [c.x, c.y, c.z]
    });
  }
  /**
   * Handle polygon handle drag end
   * 多边形手柄拖拽结束
   * @private
   */
  _onPolygonHandleDragEnd(e, t, n) {
    this._updating = !1;
    const i = this.target._geometry, o = i.coordinates;
    this._addHistory(i.coordinates), this.target.fire("handledragend", {
      index: t,
      ringIndex: n,
      coordinate: o[n]?.[t] || null
    }), this.target.fire("editvertex", {
      index: t,
      ringIndex: n,
      coordinate: o[n]?.[t] || null
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
      if (this.target instanceof dn) {
        const n = e.coordinates, i = t.lngLatToWorld(new D(n[0], n[1], n[2] || 0));
        this._handles[0] && this._handles[0].updatePosition(i);
      } else if (this.target instanceof Ft)
        e.coordinates.forEach((i, o) => {
          const l = t.lngLatToWorld(new D(i[0], i[1], i[2] || 0));
          this._handles[o] && this._handles[o].updatePosition(l);
        });
      else if (this.target instanceof Gn) {
        const n = e.coordinates;
        let i = 0;
        n.forEach((o) => {
          const l = o[0][0] === o[o.length - 1][0] && o[0][1] === o[o.length - 1][1] ? o.length - 1 : o.length;
          for (let c = 0; c < l; c++) {
            const u = o[c], f = t.lngLatToWorld(new D(u[0], u[1], u[2] || 0));
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
    let n = 0;
    if (this.target instanceof Ft) {
      const i = e.coordinates;
      for (let o = 0; o < i.length - 1 && !(n >= this._middleHandles.length); o++) {
        const l = i[o], c = i[o + 1], u = [
          (l[0] + c[0]) / 2,
          (l[1] + c[1]) / 2,
          ((l[2] || 0) + (c[2] || 0)) / 2
        ], f = t.lngLatToWorld(new D(u[0], u[1], u[2]));
        this._middleHandles[n].updatePosition(f), n++;
      }
    } else this.target instanceof Gn && e.coordinates.forEach((o) => {
      const l = o[0][0] === o[o.length - 1][0] && o[0][1] === o[o.length - 1][1] ? o.length - 1 : o.length;
      for (let c = 0; c < l && !(n >= this._middleHandles.length); c++) {
        const u = (c + 1) % l, f = o[c], p = o[u], d = [
          (f[0] + p[0]) / 2,
          (f[1] + p[1]) / 2,
          ((f[2] || 0) + (p[2] || 0)) / 2
        ], g = t.lngLatToWorld(new D(d[0], d[1], d[2]));
        this._middleHandles[n].updatePosition(g), n++;
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
    const n = new Es();
    n.params.Points = { threshold: 0.5 };
    const i = e, o = t.sceneRenderer.renderer.domElement, l = o.getBoundingClientRect(), c = new ce(
      (i.clientX - l.left) / l.width * 2 - 1,
      -((i.clientY - l.top) / l.height) * 2 + 1
    );
    n.setFromCamera(c, t.sceneRenderer.camera);
    const u = [...this._handles, ...this._middleHandles];
    for (const f of u)
      if (f.intersect(n)) {
        const p = Ec({
          currentTarget: o,
          clientX: i.clientX,
          clientY: i.clientY
        }, t, t.sceneRenderer.camera);
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
    const n = this._getMap();
    if (!n)
      return;
    const i = new Es();
    i.params.Points = { threshold: 0.5 };
    const o = e.originEvent;
    if (!o)
      return;
    const l = new ce(
      o.offsetX / n.sceneRenderer.renderer.domElement.clientWidth * 2 - 1,
      -(o.offsetY / n.sceneRenderer.renderer.domElement.clientHeight) * 2 + 1
    );
    i.setFromCamera(l, n.sceneRenderer.camera);
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
    t && t.traverse((n) => {
      n.material && (e ? Array.isArray(n.material) ? n.material.forEach((i) => {
        i.userData._originalOpacity || (i.userData._originalOpacity = i.opacity), i.opacity = Math.min(i.opacity * 0.6, 0.6), i.transparent = !0;
      }) : (n.material.userData._originalOpacity || (n.material.userData._originalOpacity = n.material.opacity), n.material.opacity = Math.min(n.material.opacity * 0.6, 0.6), n.material.transparent = !0) : Array.isArray(n.material) ? n.material.forEach((i) => {
        i.userData._originalOpacity !== void 0 && (i.opacity = i.userData._originalOpacity, delete i.userData._originalOpacity);
      }) : n.material.userData._originalOpacity !== void 0 && (n.material.opacity = n.material.userData._originalOpacity, delete n.material.userData._originalOpacity));
    });
  }
  /**
   * Remove vertex
   * 删除顶点
   * @description removeVertex
   * @private
   */
  _removeVertex(e) {
    const t = this.target._geometry, n = this._handles[e], i = n.getIndex(), o = n._ringIndex || 0;
    let l = null;
    if (this.target instanceof Ft) {
      const c = t.coordinates;
      if (c.length <= 2) {
        console.warn("[FeatureEditHandler] LineString requires at least 2 vertices");
        return;
      }
      l = c[i], c.splice(i, 1);
    } else if (this.target instanceof Gn) {
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
    this.target._refreshCoordinates(), n.remove(), this._handles.splice(e, 1), this._updateHandleIndices(), this._addHistory(t.coordinates), this.target.fire("handleremove", {
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
    for (let n = 0; n < e.length - 1; n++) {
      const i = e[n], o = e[n + 1], l = [
        (i[0] + o[0]) / 2,
        (i[1] + o[1]) / 2,
        ((i[2] || 0) + (o[2] || 0)) / 2
      ], c = t.lngLatToWorld(new D(l[0], l[1], l[2])), u = new hs({
        position: c,
        index: n,
        symbol: 1,
        // 中点
        size: this.options.handleSize,
        color: this._middleHandleColor,
        opacity: 0.6
      }, t);
      u.on("dragstart", (f) => {
        this._onMiddleHandleClick(n, "LineString", 0);
      }), this._middleHandles.push(u);
    }
  }
  /**
   * Create middle handles for Polygon
   * 为 Polygon 创建中点手柄
   * @private
   */
  _createPolygonMiddleHandles(e, t, n) {
    const i = e[0][0] === e[e.length - 1][0] && e[0][1] === e[e.length - 1][1] ? e.length - 1 : e.length;
    for (let o = 0; o < i; o++) {
      const l = (o + 1) % i, c = e[o], u = e[l], f = [
        (c[0] + u[0]) / 2,
        (c[1] + u[1]) / 2,
        ((c[2] || 0) + (u[2] || 0)) / 2
      ], p = n.lngLatToWorld(new D(f[0], f[1], f[2])), d = new hs({
        position: p,
        index: o,
        symbol: 1,
        // 中点
        size: this.options.handleSize,
        color: this._middleHandleColor,
        opacity: 0.6
      }, n);
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
  _onMiddleHandleClick(e, t, n) {
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
        const c = i.coordinates[n];
        if (!c)
          return;
        const u = c[0][0] === c[c.length - 1][0] && c[0][1] === c[c.length - 1][1] ? c.length - 1 : c.length, f = (e + 1) % u, p = c[e], d = c[f], g = [
          (p[0] + d[0]) / 2,
          (p[1] + d[1]) / 2,
          ((p[2] || 0) + (d[2] || 0)) / 2
        ];
        c.splice(e + 1, 0, g), c.length > 1 && c[0][0] === c[c.length - 1][0] && c[0][1] === c[c.length - 1][1] && e === u - 1 && (c[c.length - 1] = [...c[0]]);
      }
      this.target._applyCoordinateChanges(!0), this._clearHandles(), this._createHandles(), this._addHistory(i.coordinates), this.target.fire("vertexinsert", {
        index: e + 1,
        ringIndex: n
      });
    }
  }
  /**
   * 更新手柄索引
   * Update handle indices
   * @private
   */
  _updateHandleIndices() {
    if (this.target instanceof Ft)
      this._handles.forEach((e, t) => {
        e._index = t;
      });
    else if (this.target instanceof Gn) {
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
  _fixHandlePointCoordinates(e, t, n = 0) {
    const i = this._getMap();
    if (!i)
      return e;
    const o = this.target._geometry;
    let l = null;
    if (this.target instanceof dn)
      l = o.coordinates;
    else if (this.target instanceof Ft)
      l = o.coordinates[t];
    else if (this.target instanceof Gn) {
      const u = o.coordinates;
      u[n] && u[n][t] && (l = u[n][t]);
    }
    if (!l || !l[2] || l[2] === 0)
      return i.worldToLngLat(e);
    const c = i.worldToLngLat(e);
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
  return this.options?.editable ? (this._editor && this.endEdit(), this._editor = new RM(this, s), this._editor.enable(), this) : (console.warn("Feature is not editable. Set editable option to true."), this);
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
function Qo(s, e) {
  if (!s || s === !0) return !0;
  if (!Array.isArray(s))
    return !!s;
  switch (s[0]) {
    case "all":
      return s.slice(1).every((n) => Qo(n, e));
    case "any":
      return s.slice(1).some((n) => Qo(n, e));
    case "!":
      return !Qo(s[1], e);
    case "==": {
      const n = at(s[1], e), i = at(s[2], e);
      return Vo(n) == Vo(i);
    }
    case "!=": {
      const n = at(s[1], e), i = at(s[2], e);
      return Vo(n) != Vo(i);
    }
    case ">": {
      const n = at(s[1], e), i = at(s[2], e);
      return ui(n) > ui(i);
    }
    case "<": {
      const n = at(s[1], e), i = at(s[2], e);
      return ui(n) < ui(i);
    }
    case ">=": {
      const n = at(s[1], e), i = at(s[2], e);
      return ui(n) >= ui(i);
    }
    case "<=": {
      const n = at(s[1], e), i = at(s[2], e);
      return ui(n) <= ui(i);
    }
    case "in": {
      const n = at(s[1], e);
      return s.slice(2).map((o) => at(o, e)).includes(n);
    }
    case "!in": {
      const n = at(s[1], e);
      return !s.slice(2).map((o) => at(o, e)).includes(n);
    }
    case "has": {
      const n = s[1];
      return e != null && Object.prototype.hasOwnProperty.call(e, n);
    }
    case "!has": {
      const n = s[1];
      return !(e != null && Object.prototype.hasOwnProperty.call(e, n));
    }
    default:
      return !0;
  }
}
function at(s, e) {
  return Array.isArray(s) && s[0] === "get" ? e ? e[s[1]] : void 0 : s;
}
function Vo(s) {
  if (s == null)
    return null;
  if (typeof s == "string") {
    const e = Number(s);
    if (!isNaN(e) && s.trim() !== "")
      return e;
  }
  return typeof s == "boolean" ? s ? 1 : 0 : s;
}
function ui(s) {
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
var DM = Object.defineProperty, IM = (s, e, t) => e in s ? DM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, fs = (s, e, t) => IM(s, typeof e != "symbol" ? e + "" : e, t);
class Xl extends bi {
  constructor(e, t) {
    super(e, t), fs(this, "TILE_SIZE"), fs(this, "EXTENT"), fs(this, "paint"), fs(this, "_tileFeatureMap", /* @__PURE__ */ new Map()), fs(this, "_activeFeatureFilter"), this.TILE_SIZE = t.tileSize ?? 256, this.EXTENT = t.extent ?? 4096, this.paint = t.paint || [], this._onMapUpdate = this._onMapUpdate.bind(this);
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
    const n = this.getMap(), i = `${e.z}-${e.x}-${e.y}`, o = this._tileFeatureMap.get(i);
    if (o && o.length > 0) {
      o.forEach((f) => {
        f.visible = !0, this.children.some((p) => p && f && p.uuid === f.uuid) || f.addTo(this);
      });
      return;
    }
    const l = t.vectorData;
    if (!l || !l.layers || !n || this.paint.length === 0) return;
    const c = [], u = this.paint;
    Object.keys(l.layers).forEach((f) => {
      const p = l.layers[f];
      for (let d = 0; d < p.length; d++) {
        const g = p[d], y = g.geometry;
        if (this._activeFeatureFilter && !this._activeFeatureFilter(g.properties))
          continue;
        let x = null;
        for (const T of u)
          if (this._evaluateFilter(T.filter, g.properties, f, g.geometry.type)) {
            x = T.paint;
            break;
          }
        if (x) {
          const T = {
            isVectorTile: !0,
            tileZ: e.z,
            tileX: e.x,
            tileY: e.y,
            rawCoordinates: y,
            extent: this.EXTENT,
            tileSize: this.TILE_SIZE
          }, b = this._createFeatureInstance(
            g.geometry,
            g.geometry.type,
            x,
            g.properties
          );
          b && (b.userData.tileData = T, b.paint = Jt.create(x), b.addTo(this), b.initializeGeometry(), c.push(b));
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
  _evaluateFilter(e, t, n, i) {
    if (!e || e === !0) return !0;
    const o = {
      ...t,
      $layer: n,
      $type: i
    };
    return Qo(e, o);
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
    t && t.forEach((n) => {
      n.visible = !1;
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
    t && (t.forEach((n) => {
      n._remove();
    }), this._tileFeatureMap.delete(e));
  }
  // --- Feature Factory Methods ---
  // --- Feature 工厂方法 ---
  /**
   * Create corresponding Feature instance based on GeoJSON type.
   * 根据 GeoJSON 类型创建对应的 Feature 实例
   */
  _createFeatureInstance(e, t, n, i) {
    const l = {
      geometry: {
        ismvt: !0,
        ...e
      },
      paint: n,
      userData: i
    };
    switch (t) {
      case "Point":
        return new xi(l);
      case "LineString":
        return new Ft(l);
      // case 3: // Polygon
      //     return new PolygonFeature(options as any); 
      default:
        return null;
    }
  }
  // --- Lifecycle, Paint and Update ---
  // --- 生命周期、样式和更新 ---
  setFeatureFilter(e) {
    this._activeFeatureFilter = e;
  }
  clearFeatureFilter() {
    this._activeFeatureFilter = void 0;
  }
  setOpacity(e) {
    this.opacity = e, this._tileFeatureMap.forEach((t) => {
      t.forEach((n) => {
        n.material && (n.material.opacity = e, n.material.transparent = e < 1);
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
var FM = Object.defineProperty, BM = (s, e, t) => e in s ? FM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, St = (s, e, t) => BM(s, typeof e != "symbol" ? e + "" : e, t);
class lp extends ha {
  /**
   * Create a new BaseTileLayer instance.
   * 创建一个新的 BaseTileLayer 实例。
   * 
   * @param layerId Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    super(e, t), this.layerId = e, St(this, "isTileLayer", !0), St(this, "layerType", "base"), St(this, "isBaseLayer", !1), St(this, "_enabled", !0), St(this, "_visible", !0), St(this, "_rootTile"), St(this, "_loader"), St(this, "_LODThreshold", 1), St(this, "isSceneLayer", !1), St(this, "opacity", 1), St(this, "source"), St(this, "projection"), St(this, "minLevel", 2), St(this, "maxLevel", 19), this.source = t.source, this.projection = t.projection, this.minLevel = t.minLevel ?? 2, this.maxLevel = t.maxLevel ?? 19, this._LODThreshold = t.LODThreshold ?? 1, this.opacity = t.opacity ?? 1, this.name = `Layer-${e}`, this._loader = this.createLoader(), this._rootTile = new Er(), this._rootTile.matrixAutoUpdate = !0, this._rootTile.scale.set(this.projection.mapWidth, this.projection.mapHeight, 1), this.add(this._rootTile), this._rootTile.updateMatrix(), this.layerId = e, this.name === "Layer-label-layer" && this.position.set(0, 0, 1);
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
class UM extends Ds {
  constructor(e = {}) {
    super({ transparent: !0, side: na, ...e });
  }
  setTexture(e) {
    this.map = e, this.needsUpdate = !0;
  }
  dispose() {
    const e = this.map;
    e && (e.image instanceof ImageBitmap && e.image.close(), e.dispose());
  }
}
var nt = /* @__PURE__ */ ((s) => (s[s.Unknown = 0] = "Unknown", s[s.Point = 1] = "Point", s[s.Linestring = 2] = "Linestring", s[s.Polygon = 3] = "Polygon", s))(nt || {});
class kM {
  /**
   * 渲染矢量数据
   * @param ctx 渲染上下文
   * @param type 元素类型
   * @param feature 元素
   * @param style 样式
   * @param scale 拉伸倍数
   */
  render(e, t, n, i, o = 1) {
    switch (e.lineCap = "round", e.lineJoin = "round", (i.shadowBlur ?? 0) > 0 && (e.shadowBlur = i.shadowBlur ?? 2, e.shadowColor = i.shadowColor ?? "black", e.shadowOffsetX = i.shadowOffset ? i.shadowOffset[0] : 0, e.shadowOffsetY = i.shadowOffset ? i.shadowOffset[1] : 0), t) {
      case nt.Point:
        e.textAlign = "center", e.textBaseline = "middle", e.font = i.font ?? "14px Arial", e.fillStyle = i.fontColor ?? "white", this._renderPointText(e, n, o, i.textField ?? "name", i.fontOffset ?? [0, -8]);
        break;
      case nt.Linestring:
        this._renderLineString(e, n, o);
        break;
      case nt.Polygon:
        this._renderPolygon(e, n, o);
        break;
      default:
        console.warn(`Unknown feature type: ${t}`);
    }
    (i.fill || t === nt.Point) && (e.globalAlpha = i.fillOpacity || 0.5, e.fillStyle = i.fillColor || i.color || "#3388ff", e.fill(i.fillRule || "evenodd")), (i.stroke ?? !0) && (i.weight ?? 1) > 0 && (e.globalAlpha = i.opacity || 1, e.lineWidth = i.weight || 1, e.strokeStyle = i.color || "#3388ff", e.setLineDash(i.dashArray || []), e.stroke());
  }
  // 渲染点要素
  _renderPointText(e, t, n = 1, i = "name", o = [0, 0]) {
    const l = t.geometry;
    e.beginPath();
    for (const u of l)
      for (let f = 0; f < u.length; f++) {
        const p = u[f];
        e.arc(p.x * n, p.y * n, 2, 0, 2 * Math.PI);
      }
    const c = t.properties;
    c && c[i] && e.fillText(
      c[i],
      l[0][0].x * n + o[0],
      l[0][0].y * n + o[1]
    );
  }
  // 渲染线要素
  _renderLineString(e, t, n) {
    const i = t.geometry;
    e.beginPath();
    for (const o of i)
      for (let l = 0; l < o.length; l++) {
        const { x: c, y: u } = o[l];
        l === 0 ? e.moveTo(c * n, u * n) : e.lineTo(c * n, u * n);
      }
  }
  // 渲染面要素
  _renderPolygon(e, t, n) {
    const i = t.geometry;
    e.beginPath();
    for (let o = 0; o < i.length; o++) {
      const l = i[o];
      for (let c = 0; c < l.length; c++) {
        const { x: u, y: f } = l[c];
        c === 0 ? e.moveTo(u * n, f * n) : e.lineTo(u * n, f * n);
      }
      e.closePath();
    }
  }
}
var zM = Object.defineProperty, NM = (s, e, t) => e in s ? zM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, HM = (s, e, t) => NM(s, e + "", t);
class VM extends Pb {
  constructor() {
    super(...arguments), HM(this, "onParseEnd");
  }
  parseEnd(e) {
    this.onParseEnd && this.onParseEnd(e);
  }
}
var WM = Object.defineProperty, GM = (s, e, t) => e in s ? WM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, fa = (s, e, t) => GM(s, typeof e != "symbol" ? e + "" : e, t);
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
fa(We, "manager", new VM());
fa(We, "geometryLoaders", /* @__PURE__ */ new Map());
fa(We, "materialLoaders", /* @__PURE__ */ new Map());
fa(We, "meshLoaders", /* @__PURE__ */ new Map());
class da {
  /**
   * 计算图片裁剪区域
   * @param clipBounds 裁剪边界 [minx, miny, maxx, maxy] (0-1)
   * @param targetSize 目标尺寸
   * @returns {sx, sy, sw, sh}
   */
  static getBoundsCoord(e, t) {
    const n = Math.floor(e[0] * t), i = Math.floor(e[1] * t), o = Math.floor((e[2] - e[0]) * t), l = Math.floor((e[3] - e[1]) * t);
    return { sx: n, sy: i, sw: o, sh: l };
  }
  /**
   * 获取安全瓦片 URL 和裁剪边界
   * @description 如果请求级别超过最大级别，则回退到最大级别并计算裁剪边界
   */
  static getSafeTileUrlAndBounds(e, t, n, i) {
    if (i < e.minLevel)
      return {
        url: void 0,
        clipBounds: [0, 0, 1, 1]
      };
    if (i <= e.maxLevel)
      return {
        url: e._getUrl(t, n, i),
        clipBounds: [0, 0, 1, 1]
      };
    const o = this.getMaxLevelTileAndBounds(t, n, i, e.maxLevel), l = o.parentNO;
    return { url: e._getUrl(l.x, l.y, l.z), clipBounds: o.bounds };
  }
  static getMaxLevelTileAndBounds(e, t, n, i) {
    const o = n - i, l = { x: e >> o, y: t >> o, z: n - o }, c = Math.pow(2, o), u = Math.pow(0.5, o), f = e % c / c - 0.5 + u / 2, p = t % c / c - 0.5 + u / 2, d = new ce(f, p), g = new Lb().setFromCenterAndSize(d, new ce(u, u)), y = [
      g.min.x + 0.5,
      g.min.y + 0.5,
      g.max.x + 0.5,
      g.max.y + 0.5
    ];
    return { parentNO: l, bounds: y };
  }
}
var $M = Object.defineProperty, jM = (s, e, t) => e in s ? $M(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, XM = (s, e, t) => jM(s, e + "", t);
class Cc {
  constructor() {
    XM(this, "info", {
      version: "1.0.0",
      description: "Abstract material loader base class"
    });
  }
  /**
   * 从数据源加载材质
   * @param context 加载上下文
   */
  async load(e) {
    const { source: t, x: n, y: i, z: o } = e, l = new qt({
      transparent: !0
      // polygonOffset: true, // 根据需求开启
      // polygonOffsetFactor: 1,
      // polygonOffsetUnits: 1
    }), { url: c, clipBounds: u } = da.getSafeTileUrlAndBounds(t, n, i, o);
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
var YM = Object.defineProperty, ZM = (s, e, t) => e in s ? YM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, qM = (s, e, t) => ZM(s, e + "", t);
class pP extends Cc {
  constructor() {
    super(...arguments), qM(this, "info", {
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
    const n = new Fs(t.canvas.transferToImageBitmap());
    return new UM({
      transparent: !0,
      map: n,
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
class Ts {
  /**
   * 连接多个类型化数组
   * @param arrays 要连接的数组列表
   * @returns 连接后的新数组
   */
  static concatenateTypedArrays(...e) {
    if (!e || e.length === 0)
      throw new Error("[GeometryHelper] No arrays provided to concatenate.");
    const t = e[0].constructor, n = e.reduce((l, c) => l + c.length, 0), i = new t(n);
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
    const n = new Float32Array(e.length);
    for (let i = 0; i < t.length; i += 3) {
      const o = t[i] * 3, l = t[i + 1] * 3, c = t[i + 2] * 3, u = e[o], f = e[o + 1], p = e[o + 2], d = e[l], g = e[l + 1], y = e[l + 2], x = e[c], T = e[c + 1], b = e[c + 2], L = d - u, M = g - f, A = y - p, R = x - u, k = T - f, G = b - p, V = M * G - A * k, F = A * R - L * G, $ = L * k - M * R;
      n[o] += V, n[o + 1] += F, n[o + 2] += $, n[l] += V, n[l + 1] += F, n[l + 2] += $, n[c] += V, n[c + 1] += F, n[c + 2] += $;
    }
    for (let i = 0; i < n.length; i += 3) {
      const o = n[i], l = n[i + 1], c = n[i + 2], u = Math.sqrt(o * o + l * l + c * c);
      u > 0 ? (n[i] /= u, n[i + 1] /= u, n[i + 2] /= u) : (n[i] = 0, n[i + 1] = 0, n[i + 2] = 1);
    }
    return n;
  }
  /**
   * 生成规则网格的索引
   * @param rows 行数 (Height)
   * @param cols 列数 (Width)
   */
  static generateGridIndices(e, t) {
    const n = (e - 1) * (t - 1) * 6, i = e * t > 65535 ? Uint32Array : Uint16Array, o = new i(n);
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
    const t = Math.floor(Math.sqrt(e.length)), n = t, i = t, o = this.generateGridIndices(i, n), l = n * i, c = new Float32Array(l * 3), u = new Float32Array(l * 2);
    let f = 0;
    for (let d = 0; d < i; d++)
      for (let g = 0; g < n; g++) {
        const y = g / (n - 1), x = d / (i - 1);
        u[f * 2] = y, u[f * 2 + 1] = x, c[f * 3] = y - 0.5, c[f * 3 + 1] = x - 0.5, c[f * 3 + 2] = e[(i - d - 1) * n + g], f++;
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
class KM {
  /**
   * 为几何体添加裙边 (Skirt)
   * @description 防止地形瓦片之间出现裂缝
   * @param geometryData 原始几何体数据
   * @param skirtHeight 裙边高度 (向下延伸的距离)
   * @param externalEdgeIndices 可选的预计算边缘索引
   */
  static addSkirt(e, t, n) {
    const i = e.attributes.position.value, o = e.attributes.texcoord.value, l = e.attributes.normal.value, c = e.indices, u = n ? this.getEdgesFromIndices(n, i) : this.extractBoundaryEdges(c), f = u.length;
    if (f === 0) return e;
    const p = f * 2, d = new Float32Array(p * 3), g = new Float32Array(p * 2), y = new Float32Array(p * 3), T = i.length / 3 + p > 65535 ? Uint32Array : Uint16Array, b = c instanceof Uint32Array ? Uint32Array : T, L = new b(f * 6);
    let M = 0, A = 0;
    const R = i.length / 3;
    for (let k = 0; k < f; k++) {
      const G = u[k], V = G[0], F = G[1], $ = i[V * 3], z = i[V * 3 + 1], U = i[V * 3 + 2], X = i[F * 3], q = i[F * 3 + 1], Z = i[F * 3 + 2], ee = o[V * 2], Q = o[V * 2 + 1], Le = o[F * 2], we = o[F * 2 + 1];
      d[M * 3 + 0] = $, d[M * 3 + 1] = z, d[M * 3 + 2] = U - t, g[M * 2 + 0] = ee, g[M * 2 + 1] = Q, y[M * 3 + 0] = 0, y[M * 3 + 1] = 0, y[M * 3 + 2] = 1;
      const xe = R + M;
      M++, d[M * 3 + 0] = X, d[M * 3 + 1] = q, d[M * 3 + 2] = Z - t, g[M * 2 + 0] = Le, g[M * 2 + 1] = we, y[M * 3 + 0] = 0, y[M * 3 + 1] = 0, y[M * 3 + 2] = 1;
      const ge = R + M;
      M++, L[A++] = V, L[A++] = ge, L[A++] = F, L[A++] = ge, L[A++] = V, L[A++] = xe;
    }
    return {
      attributes: {
        position: { value: Ts.concatenateTypedArrays(i, d), size: 3 },
        texcoord: { value: Ts.concatenateTypedArrays(o, g), size: 2 },
        normal: { value: Ts.concatenateTypedArrays(l, y), size: 3 }
      },
      indices: Ts.concatenateTypedArrays(c, L)
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
    const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
    for (const l of t) {
      const c = l[0] < l[1] ? `${l[0]}-${l[1]}` : `${l[1]}-${l[0]}`;
      n.set(c, (n.get(c) || 0) + 1), i.has(c) || i.set(c, l);
    }
    const o = [];
    return n.forEach((l, c) => {
      l === 1 && o.push(i.get(c));
    }), o;
  }
  /**
   * 根据预定义的边缘索引获取边列表
   * @param indices 边缘索引组
   * @param position 顶点位置 (用于排序)
   */
  static getEdgesFromIndices(e, t) {
    const n = [], i = (g, y) => Array.from(g).sort(y), o = (g) => t[g * 3], l = (g) => t[g * 3 + 1], c = i(e.west, (g, y) => l(g) - l(y)), u = i(e.east, (g, y) => l(y) - l(g)), f = i(e.south, (g, y) => o(y) - o(g)), p = i(e.north, (g, y) => o(g) - o(y)), d = (g) => {
      if (g.length > 1)
        for (let y = 0; y < g.length - 1; y++)
          n.push([g[y], g[y + 1]]);
    };
    return d(c), d(u), d(f), d(p), n;
  }
}
var QM = Object.defineProperty, JM = (s, e, t) => e in s ? QM(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, e2 = (s, e, t) => JM(s, e + "", t);
class Os extends Fr {
  constructor() {
    super(...arguments), e2(this, "type", "MapTileGeometry");
  }
  /**
   * 设置地形数据
   * @param data 几何体数据 (IGeometryData) 或 DEM 高度图 (Float32Array)
   * @param skirtHeight 裙边高度 (米), 默认 1000
   * @returns this
   */
  setTerrainData(e, t = 1e3) {
    let n;
    return e instanceof Float32Array ? n = Ts.fromDEM(e) : n = e, t > 0 && (n = KM.addSkirt(n, t)), this.updateThreeJSAttributes(n), this.computeBoundingBox(), this.computeBoundingSphere(), this;
  }
  /**
   * 更新 Three.js BufferAttributes
   * @param geoData 
   */
  updateThreeJSAttributes(e) {
    const { attributes: t, indices: n } = e;
    this.setIndex(new mt(n, 1)), this.setAttribute("position", new mt(t.position.value, t.position.size)), this.setAttribute("uv", new mt(t.texcoord.value, t.texcoord.size)), this.setAttribute("normal", new mt(t.normal.value, t.normal.size));
  }
}
var t2 = Object.defineProperty, n2 = (s, e, t) => e in s ? t2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Pr = (s, e, t) => n2(s, typeof e != "symbol" ? e + "" : e, t);
const cp = class up {
  /**
   * Create a new TerrainMeshBuilder.
   * 创建一个新的 TerrainMeshBuilder。
   * 
   * @param gridSize Grid size, must be 2^k + 1. 网格大小，必须是 2^k + 1。
   */
  constructor(e = up.DEFAULT_GRID_SIZE) {
    Pr(this, "gridSize"), Pr(this, "numTriangles"), Pr(this, "numParentTriangles"), Pr(this, "indices"), Pr(this, "coords"), this.gridSize = e;
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
      let n = t + 2, i = 0, o = 0, l = 0, c = 0, u = 0, f = 0;
      for (n & 1 ? l = c = u = e : i = o = f = e; (n >>= 1) > 1; ) {
        const d = i + l >> 1, g = o + c >> 1;
        n & 1 ? (l = i, c = o, i = u, o = f) : (i = l, o = c, l = u, c = f), u = d, f = g;
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
    const n = this.calculateErrors(e), i = this.generateGeometry(n, t), o = i._vertices, l = i.indices, c = o.length / 2, u = new Float32Array(c * 3), f = new Float32Array(c * 2), p = new Float32Array(c * 3), d = this.gridSize;
    for (let g = 0; g < c; g++) {
      const y = o[2 * g], x = o[2 * g + 1];
      u[3 * g + 0] = y, u[3 * g + 1] = x, u[3 * g + 2] = e[x * d + y], f[2 * g + 0] = y / (d - 1), f[2 * g + 1] = x / (d - 1);
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
    const { gridSize: t, numTriangles: n, numParentTriangles: i, coords: o } = this, l = new Float32Array(e.length);
    for (let c = n - 1; c >= 0; c--) {
      const u = c * 4, f = o[u + 0], p = o[u + 1], d = o[u + 2], g = o[u + 3], y = f + d >> 1, x = p + g >> 1, T = y + x - p, b = x + y - f, L = (e[p * t + f] + e[g * t + d]) / 2, M = x * t + y, A = Math.abs(L - e[M]);
      if (l[M] = Math.max(l[M], A), c < i) {
        const R = (p + b >> 1) * t + (f + T >> 1), k = (g + b >> 1) * t + (d + T >> 1);
        l[M] = Math.max(l[M], l[R], l[k]);
      }
    }
    return l;
  }
  /**
   * Generate geometry from error map.
   * 从误差图生成几何体。
   */
  generateGeometry(e, t) {
    const { gridSize: n, indices: i } = this;
    i.fill(0);
    let o = 0, l = 0;
    const c = n - 1, u = (y, x, T, b, L, M) => {
      const A = y + T >> 1, R = x + b >> 1;
      if (Math.abs(y - L) + Math.abs(x - M) > 1 && e[R * n + A] > t)
        u(L, M, y, x, A, R), u(T, b, L, M, A, R);
      else {
        const k = x * n + y, G = b * n + T, V = M * n + L;
        i[k] === 0 && (i[k] = ++o), i[G] === 0 && (i[G] = ++o), i[V] === 0 && (i[V] = ++o), l++;
      }
    };
    u(0, 0, c, c, c, 0), u(c, c, 0, 0, 0, c);
    const f = new Uint16Array(o * 2), p = new Uint32Array(l * 3);
    let d = 0;
    const g = (y, x, T, b, L, M) => {
      const A = y + T >> 1, R = x + b >> 1;
      if (Math.abs(y - L) + Math.abs(x - M) > 1 && e[R * n + A] > t)
        g(L, M, y, x, A, R), g(T, b, L, M, A, R);
      else {
        const k = i[x * n + y] - 1, G = i[b * n + T] - 1, V = i[M * n + L] - 1;
        f[2 * k] = y, f[2 * k + 1] = x, f[2 * G] = T, f[2 * G + 1] = b, f[2 * V] = L, f[2 * V + 1] = M, p[d++] = k, p[d++] = G, p[d++] = V;
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
Pr(cp, "DEFAULT_GRID_SIZE", 257);
let mP = cp;
var i2 = Object.defineProperty, r2 = (s, e, t) => e in s ? i2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, s2 = (s, e, t) => r2(s, e + "", t);
class hp {
  constructor() {
    s2(this, "info", {
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
    const { source: t, x: n, y: i, z: o } = e, { url: l, clipBounds: c } = da.getSafeTileUrlAndBounds(t, n, i, o);
    if (!l)
      return new Os();
    const u = await this.performLoad(l, { ...e, bounds: c });
    return We.manager.parseEnd(l), u;
  }
}
const fp = '(function(){"use strict";var ee=Object.defineProperty,re=(B,d,U)=>d in B?ee(B,d,{enumerable:!0,configurable:!0,writable:!0,value:U}):B[d]=U,j=(B,d,U)=>re(B,typeof d!="symbol"?d+"":d,U);const K=class P{constructor(d=P.DEFAULT_GRID_SIZE){j(this,"gridSize"),j(this,"numTriangles"),j(this,"numParentTriangles"),j(this,"indices"),j(this,"coords"),this.gridSize=d;const U=d-1;if(U&U-1)throw new Error(`[TerrainMeshBuilder] Invalid grid size: ${d}. Expected 2^k + 1.`);this.numTriangles=U*U*2-2,this.numParentTriangles=this.numTriangles-U*U,this.indices=new Uint32Array(this.gridSize*this.gridSize),this.coords=new Uint16Array(this.numTriangles*4),this.precomputeCoords(U)}precomputeCoords(d){for(let U=0;U<this.numTriangles;U++){let F=U+2,a=0,e=0,r=0,f=0,n=0,i=0;for(F&1?r=f=n=d:a=e=i=d;(F>>=1)>1;){const t=a+r>>1,s=e+f>>1;F&1?(r=a,f=e,a=n,e=i):(a=r,e=f,r=n,f=i),n=t,i=s}const m=U*4;this.coords[m+0]=a,this.coords[m+1]=e,this.coords[m+2]=r,this.coords[m+3]=f}}build(d,U=0){const F=this.calculateErrors(d),a=this.generateGeometry(F,U),e=a._vertices,r=a.indices,f=e.length/2,n=new Float32Array(f*3),i=new Float32Array(f*2),m=new Float32Array(f*3),t=this.gridSize;for(let s=0;s<f;s++){const c=e[2*s],o=e[2*s+1];n[3*s+0]=c,n[3*s+1]=o,n[3*s+2]=d[o*t+c],i[2*s+0]=c/(t-1),i[2*s+1]=o/(t-1)}return{attributes:{position:{value:n,size:3},texcoord:{value:i,size:2},normal:{value:m,size:3}},indices:r}}calculateErrors(d){const{gridSize:U,numTriangles:F,numParentTriangles:a,coords:e}=this,r=new Float32Array(d.length);for(let f=F-1;f>=0;f--){const n=f*4,i=e[n+0],m=e[n+1],t=e[n+2],s=e[n+3],c=i+t>>1,o=m+s>>1,h=c+o-m,v=o+c-i,u=(d[m*U+i]+d[s*U+t])/2,l=o*U+c,g=Math.abs(u-d[l]);if(r[l]=Math.max(r[l],g),f<a){const x=(m+v>>1)*U+(i+h>>1),k=(s+v>>1)*U+(t+h>>1);r[l]=Math.max(r[l],r[x],r[k])}}return r}generateGeometry(d,U){const{gridSize:F,indices:a}=this;a.fill(0);let e=0,r=0;const f=F-1,n=(c,o,h,v,u,l)=>{const g=c+h>>1,x=o+v>>1;if(Math.abs(c-u)+Math.abs(o-l)>1&&d[x*F+g]>U)n(u,l,c,o,g,x),n(h,v,u,l,g,x);else{const k=o*F+c,p=v*F+h,y=l*F+u;a[k]===0&&(a[k]=++e),a[p]===0&&(a[p]=++e),a[y]===0&&(a[y]=++e),r++}};n(0,0,f,f,f,0),n(f,f,0,0,0,f);const i=new Uint16Array(e*2),m=new Uint32Array(r*3);let t=0;const s=(c,o,h,v,u,l)=>{const g=c+h>>1,x=o+v>>1;if(Math.abs(c-u)+Math.abs(o-l)>1&&d[x*F+g]>U)s(u,l,c,o,g,x),s(h,v,u,l,g,x);else{const k=a[o*F+c]-1,p=a[v*F+h]-1,y=a[l*F+u]-1;i[2*k]=c,i[2*k+1]=o,i[2*p]=h,i[2*p+1]=v,i[2*y]=u,i[2*y+1]=l,m[t++]=k,m[t++]=p,m[t++]=y}};return s(0,0,f,f,f,0),s(f,f,0,0,0,f),{attributes:{position:{value:new Float32Array(0),size:3},texcoord:{value:new Float32Array(0),size:2},normal:{value:new Float32Array(0),size:3}},indices:m,_vertices:i}}};j(K,"DEFAULT_GRID_SIZE",257);let ie=K;const ne=(function(){var B={};B.defaultNoDataValue=-34027999387901484e22,B.decode=function(r,f){f=f||{};var n=f.encodedMaskData||f.encodedMaskData===null,i=a(r,f.inputOffset||0,n),m=f.noDataValue!==null?f.noDataValue:B.defaultNoDataValue,t=d(i,f.pixelType||Float32Array,f.encodedMaskData,m,f.returnMask),s={width:i.width,height:i.height,pixelData:t.resultPixels,minValue:t.minValue,maxValue:i.pixels.maxValue,noDataValue:m};return t.resultMask&&(s.maskData=t.resultMask),f.returnEncodedMask&&i.mask&&(s.encodedMaskData=i.mask.bitset?i.mask.bitset:null),f.returnFileInfo&&(s.fileInfo=U(i),f.computeUsedBitDepths&&(s.fileInfo.bitDepths=F(i))),s};var d=function(r,f,n,i,m){var t=0,s=r.pixels.numBlocksX,c=r.pixels.numBlocksY,o=Math.floor(r.width/s),h=Math.floor(r.height/c),v=2*r.maxZError,u=Number.MAX_VALUE,l;n=n||(r.mask?r.mask.bitset:null);var g,x;g=new f(r.width*r.height),m&&n&&(x=new Uint8Array(r.width*r.height));for(var k=new Float32Array(o*h),p,y,M=0;M<=c;M++){var S=M!==c?h:r.height%c;if(S!==0)for(var I=0;I<=s;I++){var w=I!==s?o:r.width%s;if(w!==0){var D=M*r.width*h+I*o,V=r.width-w,A=r.pixels.blocks[t],L,T,b;A.encoding<2?(A.encoding===0?L=A.rawData:(e(A.stuffedData,A.bitsPerPixel,A.numValidPixels,A.offset,v,k,r.pixels.maxValue),L=k),T=0):A.encoding===2?b=0:b=A.offset;var z;if(n)for(y=0;y<S;y++){for(D&7&&(z=n[D>>3],z<<=D&7),p=0;p<w;p++)D&7||(z=n[D>>3]),z&128?(x&&(x[D]=1),l=A.encoding<2?L[T++]:b,u=u>l?l:u,g[D++]=l):(x&&(x[D]=0),g[D++]=i),z<<=1;D+=V}else if(A.encoding<2)for(y=0;y<S;y++){for(p=0;p<w;p++)l=L[T++],u=u>l?l:u,g[D++]=l;D+=V}else for(u=u>b?b:u,y=0;y<S;y++){for(p=0;p<w;p++)g[D++]=b;D+=V}if(A.encoding===1&&T!==A.numValidPixels)throw"Block and Mask do not match";t++}}}return{resultPixels:g,resultMask:x,minValue:u}},U=function(r){return{fileIdentifierString:r.fileIdentifierString,fileVersion:r.fileVersion,imageType:r.imageType,height:r.height,width:r.width,maxZError:r.maxZError,eofOffset:r.eofOffset,mask:r.mask?{numBlocksX:r.mask.numBlocksX,numBlocksY:r.mask.numBlocksY,numBytes:r.mask.numBytes,maxValue:r.mask.maxValue}:null,pixels:{numBlocksX:r.pixels.numBlocksX,numBlocksY:r.pixels.numBlocksY,numBytes:r.pixels.numBytes,maxValue:r.pixels.maxValue,noDataValue:r.noDataValue}}},F=function(r){for(var f=r.pixels.numBlocksX*r.pixels.numBlocksY,n={},i=0;i<f;i++){var m=r.pixels.blocks[i];m.encoding===0?n.float32=!0:m.encoding===1?n[m.bitsPerPixel]=!0:n[0]=!0}return Object.keys(n)},a=function(r,f,n){var i={},m=new Uint8Array(r,f,10);if(i.fileIdentifierString=String.fromCharCode.apply(null,m),i.fileIdentifierString.trim()!=="CntZImage")throw"Unexpected file identifier string: "+i.fileIdentifierString;f+=10;var t=new DataView(r,f,24);if(i.fileVersion=t.getInt32(0,!0),i.imageType=t.getInt32(4,!0),i.height=t.getUint32(8,!0),i.width=t.getUint32(12,!0),i.maxZError=t.getFloat64(16,!0),f+=24,!n)if(t=new DataView(r,f,16),i.mask={},i.mask.numBlocksY=t.getUint32(0,!0),i.mask.numBlocksX=t.getUint32(4,!0),i.mask.numBytes=t.getUint32(8,!0),i.mask.maxValue=t.getFloat32(12,!0),f+=16,i.mask.numBytes>0){var s=new Uint8Array(Math.ceil(i.width*i.height/8));t=new DataView(r,f,i.mask.numBytes);var c=t.getInt16(0,!0),o=2,h=0;do{if(c>0)for(;c--;)s[h++]=t.getUint8(o++);else{var v=t.getUint8(o++);for(c=-c;c--;)s[h++]=v}c=t.getInt16(o,!0),o+=2}while(o<i.mask.numBytes);if(c!==-32768||h<s.length)throw"Unexpected end of mask RLE encoding";i.mask.bitset=s,f+=i.mask.numBytes}else(i.mask.numBytes|i.mask.numBlocksY|i.mask.maxValue)===0&&(i.mask.bitset=new Uint8Array(Math.ceil(i.width*i.height/8)));t=new DataView(r,f,16),i.pixels={},i.pixels.numBlocksY=t.getUint32(0,!0),i.pixels.numBlocksX=t.getUint32(4,!0),i.pixels.numBytes=t.getUint32(8,!0),i.pixels.maxValue=t.getFloat32(12,!0),f+=16;var u=i.pixels.numBlocksX,l=i.pixels.numBlocksY,g=u+(i.width%u>0?1:0),x=l+(i.height%l>0?1:0);i.pixels.blocks=new Array(g*x);for(var k=0,p=0;p<x;p++)for(var y=0;y<g;y++){var M=0,S=r.byteLength-f;t=new DataView(r,f,Math.min(10,S));var I={};i.pixels.blocks[k++]=I;var w=t.getUint8(0);if(M++,I.encoding=w&63,I.encoding>3)throw"Invalid block encoding ("+I.encoding+")";if(I.encoding===2){f++;continue}if(w!==0&&w!==2){if(w>>=6,I.offsetType=w,w===2)I.offset=t.getInt8(1),M++;else if(w===1)I.offset=t.getInt16(1,!0),M+=2;else if(w===0)I.offset=t.getFloat32(1,!0),M+=4;else throw"Invalid block offset type";if(I.encoding===1)if(w=t.getUint8(M),M++,I.bitsPerPixel=w&63,w>>=6,I.numValidPixelsType=w,w===2)I.numValidPixels=t.getUint8(M),M++;else if(w===1)I.numValidPixels=t.getUint16(M,!0),M+=2;else if(w===0)I.numValidPixels=t.getUint32(M,!0),M+=4;else throw"Invalid valid pixel count type"}if(f+=M,I.encoding!==3){var D,V;if(I.encoding===0){var A=(i.pixels.numBytes-1)/4;if(A!==Math.floor(A))throw"uncompressed block has invalid length";D=new ArrayBuffer(A*4),V=new Uint8Array(D),V.set(new Uint8Array(r,f,A*4));var L=new Float32Array(D);I.rawData=L,f+=A*4}else if(I.encoding===1){var T=Math.ceil(I.numValidPixels*I.bitsPerPixel/8),b=Math.ceil(T/4);D=new ArrayBuffer(b*4),V=new Uint8Array(D),V.set(new Uint8Array(r,f,T)),I.stuffedData=new Uint32Array(D),f+=T}}}return i.eofOffset=f,i},e=function(r,f,n,i,m,t,s){var c=(1<<f)-1,o=0,h,v=0,u,l,g=Math.ceil((s-i)/m),x=r.length*4-Math.ceil(f*n/8);for(r[r.length-1]<<=8*x,h=0;h<n;h++){if(v===0&&(l=r[o++],v=32),v>=f)u=l>>>v-f&c,v-=f;else{var k=f-v;u=(l&c)<<k&c,l=r[o++],v=32-k,u+=l>>>v}t[h]=u<g?i+u*m:s}return t};return B})(),te=(function(){var B={unstuff:function(a,e,r,f,n,i,m,t){var s=(1<<r)-1,c=0,o,h=0,v,u,l,g,x=a.length*4-Math.ceil(r*f/8);if(a[a.length-1]<<=8*x,n)for(o=0;o<f;o++)h===0&&(u=a[c++],h=32),h>=r?(v=u>>>h-r&s,h-=r):(l=r-h,v=(u&s)<<l&s,u=a[c++],h=32-l,v+=u>>>h),e[o]=n[v];else for(g=Math.ceil((t-i)/m),o=0;o<f;o++)h===0&&(u=a[c++],h=32),h>=r?(v=u>>>h-r&s,h-=r):(l=r-h,v=(u&s)<<l&s,u=a[c++],h=32-l,v+=u>>>h),e[o]=v<g?i+v*m:t},unstuffLUT:function(a,e,r,f,n,i){var m=(1<<e)-1,t=0,s=0,c=0,o=0,h=0,v,u=[],l=a.length*4-Math.ceil(e*r/8);a[a.length-1]<<=8*l;var g=Math.ceil((i-f)/n);for(s=0;s<r;s++)o===0&&(v=a[t++],o=32),o>=e?(h=v>>>o-e&m,o-=e):(c=e-o,h=(v&m)<<c&m,v=a[t++],o=32-c,h+=v>>>o),u[s]=h<g?f+h*n:i;return u.unshift(f),u},unstuff2:function(a,e,r,f,n,i,m,t){var s=(1<<r)-1,c=0,o,h=0,v=0,u,l,g;if(n)for(o=0;o<f;o++)h===0&&(l=a[c++],h=32,v=0),h>=r?(u=l>>>v&s,h-=r,v+=r):(g=r-h,u=l>>>v&s,l=a[c++],h=32-g,u|=(l&(1<<g)-1)<<r-g,v=g),e[o]=n[u];else{var x=Math.ceil((t-i)/m);for(o=0;o<f;o++)h===0&&(l=a[c++],h=32,v=0),h>=r?(u=l>>>v&s,h-=r,v+=r):(g=r-h,u=l>>>v&s,l=a[c++],h=32-g,u|=(l&(1<<g)-1)<<r-g,v=g),e[o]=u<x?i+u*m:t}return e},unstuffLUT2:function(a,e,r,f,n,i){var m=(1<<e)-1,t=0,s=0,c=0,o=0,h=0,v=0,u,l=[],g=Math.ceil((i-f)/n);for(s=0;s<r;s++)o===0&&(u=a[t++],o=32,v=0),o>=e?(h=u>>>v&m,o-=e,v+=e):(c=e-o,h=u>>>v&m,u=a[t++],o=32-c,h|=(u&(1<<c)-1)<<e-c,v=c),l[s]=h<g?f+h*n:i;return l.unshift(f),l},originalUnstuff:function(a,e,r,f){var n=(1<<r)-1,i=0,m,t=0,s,c,o,h=a.length*4-Math.ceil(r*f/8);for(a[a.length-1]<<=8*h,m=0;m<f;m++)t===0&&(c=a[i++],t=32),t>=r?(s=c>>>t-r&n,t-=r):(o=r-t,s=(c&n)<<o&n,c=a[i++],t=32-o,s+=c>>>t),e[m]=s;return e},originalUnstuff2:function(a,e,r,f){var n=(1<<r)-1,i=0,m,t=0,s=0,c,o,h;for(m=0;m<f;m++)t===0&&(o=a[i++],t=32,s=0),t>=r?(c=o>>>s&n,t-=r,s+=r):(h=r-t,c=o>>>s&n,o=a[i++],t=32-h,c|=(o&(1<<h)-1)<<r-h,s=h),e[m]=c;return e}},d={HUFFMAN_LUT_BITS_MAX:12,computeChecksumFletcher32:function(a){for(var e=65535,r=65535,f=a.length,n=Math.floor(f/2),i=0;n;){var m=n>=359?359:n;n-=m;do e+=a[i++]<<8,r+=e+=a[i++];while(--m);e=(e&65535)+(e>>>16),r=(r&65535)+(r>>>16)}return f&1&&(r+=e+=a[i]<<8),e=(e&65535)+(e>>>16),r=(r&65535)+(r>>>16),(r<<16|e)>>>0},readHeaderInfo:function(a,e){var r=e.ptr,f=new Uint8Array(a,r,6),n={};if(n.fileIdentifierString=String.fromCharCode.apply(null,f),n.fileIdentifierString.lastIndexOf("Lerc2",0)!==0)throw"Unexpected file identifier string (expect Lerc2 ): "+n.fileIdentifierString;r+=6;var i=new DataView(a,r,8),m=i.getInt32(0,!0);n.fileVersion=m,r+=4,m>=3&&(n.checksum=i.getUint32(4,!0),r+=4),i=new DataView(a,r,12),n.height=i.getUint32(0,!0),n.width=i.getUint32(4,!0),r+=8,m>=4?(n.numDims=i.getUint32(8,!0),r+=4):n.numDims=1,i=new DataView(a,r,40),n.numValidPixel=i.getUint32(0,!0),n.microBlockSize=i.getInt32(4,!0),n.blobSize=i.getInt32(8,!0),n.imageType=i.getInt32(12,!0),n.maxZError=i.getFloat64(16,!0),n.zMin=i.getFloat64(24,!0),n.zMax=i.getFloat64(32,!0),r+=40,e.headerInfo=n,e.ptr=r;var t,s;if(m>=3&&(s=m>=4?52:48,t=this.computeChecksumFletcher32(new Uint8Array(a,r-s,n.blobSize-14)),t!==n.checksum))throw"Checksum failed.";return!0},checkMinMaxRanges:function(a,e){var r=e.headerInfo,f=this.getDataTypeArray(r.imageType),n=r.numDims*this.getDataTypeSize(r.imageType),i=this.readSubArray(a,e.ptr,f,n),m=this.readSubArray(a,e.ptr+n,f,n);e.ptr+=2*n;var t,s=!0;for(t=0;t<r.numDims;t++)if(i[t]!==m[t]){s=!1;break}return r.minValues=i,r.maxValues=m,s},readSubArray:function(a,e,r,f){var n;if(r===Uint8Array)n=new Uint8Array(a,e,f);else{var i=new ArrayBuffer(f),m=new Uint8Array(i);m.set(new Uint8Array(a,e,f)),n=new r(i)}return n},readMask:function(a,e){var r=e.ptr,f=e.headerInfo,n=f.width*f.height,i=f.numValidPixel,m=new DataView(a,r,4),t={};if(t.numBytes=m.getUint32(0,!0),r+=4,(i===0||n===i)&&t.numBytes!==0)throw"invalid mask";var s,c;if(i===0)s=new Uint8Array(Math.ceil(n/8)),t.bitset=s,c=new Uint8Array(n),e.pixels.resultMask=c,r+=t.numBytes;else if(t.numBytes>0){s=new Uint8Array(Math.ceil(n/8)),m=new DataView(a,r,t.numBytes);var o=m.getInt16(0,!0),h=2,v=0,u=0;do{if(o>0)for(;o--;)s[v++]=m.getUint8(h++);else for(u=m.getUint8(h++),o=-o;o--;)s[v++]=u;o=m.getInt16(h,!0),h+=2}while(h<t.numBytes);if(o!==-32768||v<s.length)throw"Unexpected end of mask RLE encoding";c=new Uint8Array(n);var l=0,g=0;for(g=0;g<n;g++)g&7?(l=s[g>>3],l<<=g&7):l=s[g>>3],l&128&&(c[g]=1);e.pixels.resultMask=c,t.bitset=s,r+=t.numBytes}return e.ptr=r,e.mask=t,!0},readDataOneSweep:function(a,e,r,f){var n=e.ptr,i=e.headerInfo,m=i.numDims,t=i.width*i.height,s=i.imageType,c=i.numValidPixel*d.getDataTypeSize(s)*m,o,h=e.pixels.resultMask;if(r===Uint8Array)o=new Uint8Array(a,n,c);else{var v=new ArrayBuffer(c),u=new Uint8Array(v);u.set(new Uint8Array(a,n,c)),o=new r(v)}if(o.length===t*m)f?e.pixels.resultPixels=d.swapDimensionOrder(o,t,m,r,!0):e.pixels.resultPixels=o;else{e.pixels.resultPixels=new r(t*m);var l=0,g=0,x=0,k=0;if(m>1){if(f){for(g=0;g<t;g++)if(h[g])for(k=g,x=0;x<m;x++,k+=t)e.pixels.resultPixels[k]=o[l++]}else for(g=0;g<t;g++)if(h[g])for(k=g*m,x=0;x<m;x++)e.pixels.resultPixels[k+x]=o[l++]}else for(g=0;g<t;g++)h[g]&&(e.pixels.resultPixels[g]=o[l++])}return n+=c,e.ptr=n,!0},readHuffmanTree:function(a,e){var r=this.HUFFMAN_LUT_BITS_MAX,f=new DataView(a,e.ptr,16);e.ptr+=16;var n=f.getInt32(0,!0);if(n<2)throw"unsupported Huffman version";var i=f.getInt32(4,!0),m=f.getInt32(8,!0),t=f.getInt32(12,!0);if(m>=t)return!1;var s=new Uint32Array(t-m);d.decodeBits(a,e,s);var c=[],o,h,v,u;for(o=m;o<t;o++)h=o-(o<i?0:i),c[h]={first:s[o-m],second:null};var l=a.byteLength-e.ptr,g=Math.ceil(l/4),x=new ArrayBuffer(g*4),k=new Uint8Array(x);k.set(new Uint8Array(a,e.ptr,l));var p=new Uint32Array(x),y=0,M,S=0;for(M=p[0],o=m;o<t;o++)h=o-(o<i?0:i),u=c[h].first,u>0&&(c[h].second=M<<y>>>32-u,32-y>=u?(y+=u,y===32&&(y=0,S++,M=p[S])):(y+=u-32,S++,M=p[S],c[h].second|=M>>>32-y));var I=0,w=0,D=new U;for(o=0;o<c.length;o++)c[o]!==void 0&&(I=Math.max(I,c[o].first));I>=r?w=r:w=I;var V=[],A,L,T,b,z,C;for(o=m;o<t;o++)if(h=o-(o<i?0:i),u=c[h].first,u>0)if(A=[u,h],u<=w)for(L=c[h].second<<w-u,T=1<<w-u,v=0;v<T;v++)V[L|v]=A;else for(L=c[h].second,C=D,b=u-1;b>=0;b--)z=L>>>b&1,z?(C.right||(C.right=new U),C=C.right):(C.left||(C.left=new U),C=C.left),b===0&&!C.val&&(C.val=A[1]);return{decodeLut:V,numBitsLUTQick:w,numBitsLUT:I,tree:D,stuffedData:p,srcPtr:S,bitPos:y}},readHuffman:function(a,e,r,f){var n=e.headerInfo,i=n.numDims,m=e.headerInfo.height,t=e.headerInfo.width,s=t*m,c=this.readHuffmanTree(a,e),o=c.decodeLut,h=c.tree,v=c.stuffedData,u=c.srcPtr,l=c.bitPos,g=c.numBitsLUTQick,x=c.numBitsLUT,k=e.headerInfo.imageType===0?128:0,p,y,M,S=e.pixels.resultMask,I,w,D,V,A,L,T,b=0;l>0&&(u++,l=0);var z=v[u],C=e.encodeMode===1,N=new r(s*i),E=N,X;if(i<2||C){for(X=0;X<i;X++)if(i>1&&(E=new r(N.buffer,s*X,s),b=0),e.headerInfo.numValidPixel===t*m)for(L=0,V=0;V<m;V++)for(A=0;A<t;A++,L++){if(y=0,I=z<<l>>>32-g,w=I,32-l<g&&(I|=v[u+1]>>>64-l-g,w=I),o[w])y=o[w][1],l+=o[w][0];else for(I=z<<l>>>32-x,w=I,32-l<x&&(I|=v[u+1]>>>64-l-x,w=I),p=h,T=0;T<x;T++)if(D=I>>>x-T-1&1,p=D?p.right:p.left,!(p.left||p.right)){y=p.val,l=l+T+1;break}l>=32&&(l-=32,u++,z=v[u]),M=y-k,C?(A>0?M+=b:V>0?M+=E[L-t]:M+=b,M&=255,E[L]=M,b=M):E[L]=M}else for(L=0,V=0;V<m;V++)for(A=0;A<t;A++,L++)if(S[L]){if(y=0,I=z<<l>>>32-g,w=I,32-l<g&&(I|=v[u+1]>>>64-l-g,w=I),o[w])y=o[w][1],l+=o[w][0];else for(I=z<<l>>>32-x,w=I,32-l<x&&(I|=v[u+1]>>>64-l-x,w=I),p=h,T=0;T<x;T++)if(D=I>>>x-T-1&1,p=D?p.right:p.left,!(p.left||p.right)){y=p.val,l=l+T+1;break}l>=32&&(l-=32,u++,z=v[u]),M=y-k,C?(A>0&&S[L-1]?M+=b:V>0&&S[L-t]?M+=E[L-t]:M+=b,M&=255,E[L]=M,b=M):E[L]=M}}else for(L=0,V=0;V<m;V++)for(A=0;A<t;A++)if(L=V*t+A,!S||S[L])for(X=0;X<i;X++,L+=s){if(y=0,I=z<<l>>>32-g,w=I,32-l<g&&(I|=v[u+1]>>>64-l-g,w=I),o[w])y=o[w][1],l+=o[w][0];else for(I=z<<l>>>32-x,w=I,32-l<x&&(I|=v[u+1]>>>64-l-x,w=I),p=h,T=0;T<x;T++)if(D=I>>>x-T-1&1,p=D?p.right:p.left,!(p.left||p.right)){y=p.val,l=l+T+1;break}l>=32&&(l-=32,u++,z=v[u]),M=y-k,E[L]=M}e.ptr=e.ptr+(u+1)*4+(l>0?4:0),e.pixels.resultPixels=N,i>1&&!f&&(e.pixels.resultPixels=d.swapDimensionOrder(N,s,i,r))},decodeBits:function(a,e,r,f,n){{var i=e.headerInfo,m=i.fileVersion,t=0,s=a.byteLength-e.ptr>=5?5:a.byteLength-e.ptr,c=new DataView(a,e.ptr,s),o=c.getUint8(0);t++;var h=o>>6,v=h===0?4:3-h,u=(o&32)>0,l=o&31,g=0;if(v===1)g=c.getUint8(t),t++;else if(v===2)g=c.getUint16(t,!0),t+=2;else if(v===4)g=c.getUint32(t,!0),t+=4;else throw"Invalid valid pixel count type";var x=2*i.maxZError,k,p,y,M,S,I,w,D,V,A=i.numDims>1?i.maxValues[n]:i.zMax;if(u){for(e.counter.lut++,D=c.getUint8(t),t++,M=Math.ceil((D-1)*l/8),S=Math.ceil(M/4),p=new ArrayBuffer(S*4),y=new Uint8Array(p),e.ptr+=t,y.set(new Uint8Array(a,e.ptr,M)),w=new Uint32Array(p),e.ptr+=M,V=0;D-1>>>V;)V++;M=Math.ceil(g*V/8),S=Math.ceil(M/4),p=new ArrayBuffer(S*4),y=new Uint8Array(p),y.set(new Uint8Array(a,e.ptr,M)),k=new Uint32Array(p),e.ptr+=M,m>=3?I=B.unstuffLUT2(w,l,D-1,f,x,A):I=B.unstuffLUT(w,l,D-1,f,x,A),m>=3?B.unstuff2(k,r,V,g,I):B.unstuff(k,r,V,g,I)}else e.counter.bitstuffer++,V=l,e.ptr+=t,V>0&&(M=Math.ceil(g*V/8),S=Math.ceil(M/4),p=new ArrayBuffer(S*4),y=new Uint8Array(p),y.set(new Uint8Array(a,e.ptr,M)),k=new Uint32Array(p),e.ptr+=M,m>=3?f==null?B.originalUnstuff2(k,r,V,g):B.unstuff2(k,r,V,g,!1,f,x,A):f==null?B.originalUnstuff(k,r,V,g):B.unstuff(k,r,V,g,!1,f,x,A))}},readTiles:function(a,e,r,f){var n=e.headerInfo,i=n.width,m=n.height,t=i*m,s=n.microBlockSize,c=n.imageType,o=d.getDataTypeSize(c),h=Math.ceil(i/s),v=Math.ceil(m/s);e.pixels.numBlocksY=v,e.pixels.numBlocksX=h,e.pixels.ptr=0;var u=0,l=0,g=0,x=0,k=0,p=0,y=0,M=0,S=0,I=0,w=0,D=0,V=0,A=0,L=0,T=0,b,z,C,N,E,X,Q=new r(s*s),le=m%s||s,oe=i%s||s,$,R,q=n.numDims,H,Y=e.pixels.resultMask,O=e.pixels.resultPixels,ue=n.fileVersion,W=ue>=5?14:15,_,J=n.zMax,Z;for(g=0;g<v;g++)for(k=g!==v-1?s:le,x=0;x<h;x++)for(p=x!==h-1?s:oe,w=g*i*s+x*s,D=i-p,H=0;H<q;H++){if(q>1?(Z=O,w=g*i*s+x*s,O=new r(e.pixels.resultPixels.buffer,t*H*o,t),J=n.maxValues[H]):Z=null,y=a.byteLength-e.ptr,b=new DataView(a,e.ptr,Math.min(10,y)),z={},T=0,M=b.getUint8(0),T++,_=n.fileVersion>=5?M&4:0,S=M>>6&255,I=M>>2&W,I!==(x*s>>3&W)||_&&H===0)throw"integrity issue";if(X=M&3,X>3)throw e.ptr+=T,"Invalid block encoding ("+X+")";if(X===2){if(_)if(Y)for(u=0;u<k;u++)for(l=0;l<p;l++)Y[w]&&(O[w]=Z[w]),w++;else for(u=0;u<k;u++)for(l=0;l<p;l++)O[w]=Z[w],w++;e.counter.constant++,e.ptr+=T;continue}else if(X===0){if(_)throw"integrity issue";if(e.counter.uncompressed++,e.ptr+=T,V=k*p*o,A=a.byteLength-e.ptr,V=V<A?V:A,C=new ArrayBuffer(V%o===0?V:V+o-V%o),N=new Uint8Array(C),N.set(new Uint8Array(a,e.ptr,V)),E=new r(C),L=0,Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=E[L++]),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w++]=E[L++];w+=D}e.ptr+=L*o}else if($=d.getDataTypeUsed(_&&c<6?4:c,S),R=d.getOnePixel(z,T,$,b),T+=d.getDataTypeSize($),X===3)if(e.ptr+=T,e.counter.constantoffset++,Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=_?Math.min(J,Z[w]+R):R),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w]=_?Math.min(J,Z[w]+R):R,w++;w+=D}else if(e.ptr+=T,d.decodeBits(a,e,Q,R,H),T=0,_)if(Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=Q[T++]+Z[w]),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w]=Q[T++]+Z[w],w++;w+=D}else if(Y)for(u=0;u<k;u++){for(l=0;l<p;l++)Y[w]&&(O[w]=Q[T++]),w++;w+=D}else for(u=0;u<k;u++){for(l=0;l<p;l++)O[w++]=Q[T++];w+=D}}q>1&&!f&&(e.pixels.resultPixels=d.swapDimensionOrder(e.pixels.resultPixels,t,q,r))},formatFileInfo:function(a){return{fileIdentifierString:a.headerInfo.fileIdentifierString,fileVersion:a.headerInfo.fileVersion,imageType:a.headerInfo.imageType,height:a.headerInfo.height,width:a.headerInfo.width,numValidPixel:a.headerInfo.numValidPixel,microBlockSize:a.headerInfo.microBlockSize,blobSize:a.headerInfo.blobSize,maxZError:a.headerInfo.maxZError,pixelType:d.getPixelType(a.headerInfo.imageType),eofOffset:a.eofOffset,mask:a.mask?{numBytes:a.mask.numBytes}:null,pixels:{numBlocksX:a.pixels.numBlocksX,numBlocksY:a.pixels.numBlocksY,maxValue:a.headerInfo.zMax,minValue:a.headerInfo.zMin,noDataValue:a.noDataValue}}},constructConstantSurface:function(a,e){var r=a.headerInfo.zMax,f=a.headerInfo.zMin,n=a.headerInfo.maxValues,i=a.headerInfo.numDims,m=a.headerInfo.height*a.headerInfo.width,t=0,s=0,c=0,o=a.pixels.resultMask,h=a.pixels.resultPixels;if(o)if(i>1){if(e)for(t=0;t<i;t++)for(c=t*m,r=n[t],s=0;s<m;s++)o[s]&&(h[c+s]=r);else for(s=0;s<m;s++)if(o[s])for(c=s*i,t=0;t<i;t++)h[c+i]=n[t]}else for(s=0;s<m;s++)o[s]&&(h[s]=r);else if(i>1&&f!==r)if(e)for(t=0;t<i;t++)for(c=t*m,r=n[t],s=0;s<m;s++)h[c+s]=r;else for(s=0;s<m;s++)for(c=s*i,t=0;t<i;t++)h[c+t]=n[t];else for(s=0;s<m*i;s++)h[s]=r},getDataTypeArray:function(a){var e;switch(a){case 0:e=Int8Array;break;case 1:e=Uint8Array;break;case 2:e=Int16Array;break;case 3:e=Uint16Array;break;case 4:e=Int32Array;break;case 5:e=Uint32Array;break;case 6:e=Float32Array;break;case 7:e=Float64Array;break;default:e=Float32Array}return e},getPixelType:function(a){var e;switch(a){case 0:e="S8";break;case 1:e="U8";break;case 2:e="S16";break;case 3:e="U16";break;case 4:e="S32";break;case 5:e="U32";break;case 6:e="F32";break;case 7:e="F64";break;default:e="F32"}return e},isValidPixelValue:function(a,e){if(e==null)return!1;var r;switch(a){case 0:r=e>=-128&&e<=127;break;case 1:r=e>=0&&e<=255;break;case 2:r=e>=-32768&&e<=32767;break;case 3:r=e>=0&&e<=65536;break;case 4:r=e>=-2147483648&&e<=2147483647;break;case 5:r=e>=0&&e<=4294967296;break;case 6:r=e>=-34027999387901484e22&&e<=34027999387901484e22;break;case 7:r=e>=-17976931348623157e292&&e<=17976931348623157e292;break;default:r=!1}return r},getDataTypeSize:function(a){var e=0;switch(a){case 0:case 1:e=1;break;case 2:case 3:e=2;break;case 4:case 5:case 6:e=4;break;case 7:e=8;break;default:e=a}return e},getDataTypeUsed:function(a,e){var r=a;switch(a){case 2:case 4:r=a-e;break;case 3:case 5:r=a-2*e;break;case 6:e===0?r=a:e===1?r=2:r=1;break;case 7:e===0?r=a:r=a-2*e+1;break;default:r=a;break}return r},getOnePixel:function(a,e,r,f){var n=0;switch(r){case 0:n=f.getInt8(e);break;case 1:n=f.getUint8(e);break;case 2:n=f.getInt16(e,!0);break;case 3:n=f.getUint16(e,!0);break;case 4:n=f.getInt32(e,!0);break;case 5:n=f.getUInt32(e,!0);break;case 6:n=f.getFloat32(e,!0);break;case 7:n=f.getFloat64(e,!0);break;default:throw"the decoder does not understand this pixel type"}return n},swapDimensionOrder:function(a,e,r,f,n){var i=0,m=0,t=0,s=0,c=a;if(r>1)if(c=new f(e*r),n)for(i=0;i<e;i++)for(s=i,t=0;t<r;t++,s+=e)c[s]=a[m++];else for(i=0;i<e;i++)for(s=i,t=0;t<r;t++,s+=e)c[m++]=a[s];return c}},U=function(a,e,r){this.val=a,this.left=e,this.right=r},F={decode:function(a,e){e=e||{};var r=e.noDataValue,f=0,n={};if(n.ptr=e.inputOffset||0,n.pixels={},!!d.readHeaderInfo(a,n)){var i=n.headerInfo,m=i.fileVersion,t=d.getDataTypeArray(i.imageType);if(m>5)throw"unsupported lerc version 2."+m;d.readMask(a,n),i.numValidPixel!==i.width*i.height&&!n.pixels.resultMask&&(n.pixels.resultMask=e.maskData);var s=i.width*i.height;n.pixels.resultPixels=new t(s*i.numDims),n.counter={onesweep:0,uncompressed:0,lut:0,bitstuffer:0,constant:0,constantoffset:0};var c=!e.returnPixelInterleavedDims;if(i.numValidPixel!==0)if(i.zMax===i.zMin)d.constructConstantSurface(n,c);else if(m>=4&&d.checkMinMaxRanges(a,n))d.constructConstantSurface(n,c);else{var o=new DataView(a,n.ptr,2),h=o.getUint8(0);if(n.ptr++,h)d.readDataOneSweep(a,n,t,c);else if(m>1&&i.imageType<=1&&Math.abs(i.maxZError-.5)<1e-5){var v=o.getUint8(1);if(n.ptr++,n.encodeMode=v,v>2||m<4&&v>1)throw"Invalid Huffman flag "+v;v?d.readHuffman(a,n,t,c):d.readTiles(a,n,t,c)}else d.readTiles(a,n,t,c)}n.eofOffset=n.ptr;var u;e.inputOffset?(u=n.headerInfo.blobSize+e.inputOffset-n.ptr,Math.abs(u)>=1&&(n.eofOffset=e.inputOffset+n.headerInfo.blobSize)):(u=n.headerInfo.blobSize-n.ptr,Math.abs(u)>=1&&(n.eofOffset=n.headerInfo.blobSize));var l={width:i.width,height:i.height,pixelData:n.pixels.resultPixels,minValue:i.zMin,maxValue:i.zMax,validPixelCount:i.numValidPixel,dimCount:i.numDims,dimStats:{minValues:i.minValues,maxValues:i.maxValues},maskData:n.pixels.resultMask};if(n.pixels.resultMask&&d.isValidPixelValue(i.imageType,r)){var g=n.pixels.resultMask;for(f=0;f<s;f++)g[f]||(l.pixelData[f]=r);l.noDataValue=r}return n.noDataValue=r,e.returnFileInfo&&(l.fileInfo=d.formatFileInfo(n)),l}},getBandCount:function(a){var e=0,r=0,f={};for(f.ptr=0,f.pixels={};r<a.byteLength-58;)d.readHeaderInfo(a,f),r+=f.headerInfo.blobSize,e++,f.ptr=r;return e}};return F})();var ae=(function(){var B=new ArrayBuffer(4),d=new Uint8Array(B),U=new Uint32Array(B);return U[0]=1,d[0]===1})(),se={decode:function(B,d){if(!ae)throw"Big endian system is not supported.";d=d||{};var U=d.inputOffset||0,F=new Uint8Array(B,U,10),a=String.fromCharCode.apply(null,F),e,r;if(a.trim()==="CntZImage")e=ne,r=1;else if(a.substring(0,5)==="Lerc2")e=te,r=2;else throw"Unexpected file identifier string: "+a;for(var f=0,n=B.byteLength-10,i,m=[],t,s,c={width:0,height:0,pixels:[],pixelType:d.pixelType,mask:null,statistics:[]},o=0;U<n;){var h=e.decode(B,{inputOffset:U,encodedMaskData:i,maskData:s,returnMask:f===0,returnEncodedMask:f===0,returnFileInfo:!0,returnPixelInterleavedDims:d.returnPixelInterleavedDims,pixelType:d.pixelType||null,noDataValue:d.noDataValue||null});U=h.fileInfo.eofOffset,s=h.maskData,f===0&&(i=h.encodedMaskData,c.width=h.width,c.height=h.height,c.dimCount=h.dimCount||1,c.pixelType=h.pixelType||h.fileInfo.pixelType,c.mask=s),r>1&&(s&&m.push(s),h.fileInfo.mask&&h.fileInfo.mask.numBytes>0&&o++),f++,c.pixels.push(h.pixelData),c.statistics.push({minValue:h.minValue,maxValue:h.maxValue,noDataValue:h.noDataValue,dimStats:h.dimStats})}var v,u,l;if(r>1&&o>1){for(l=c.width*c.height,c.bandMasks=m,s=new Uint8Array(l),s.set(m[0]),v=1;v<m.length;v++)for(t=m[v],u=0;u<l;u++)s[u]=s[u]&t[u];c.maskData=s}return c}};const fe={0:7e3,1:6e3,2:5e3,3:4e3,4:3e3,5:2500,6:2e3,7:1500,8:800,9:500,10:200,11:100,12:40,13:12,14:5,15:2,16:1,17:.5,18:.2,19:.1,20:.01};class G{static parse(d,U,F){let a=G.decode(d);F[2]-F[0]<1&&(a=G.getSubDEM(a,F));const{array:e,width:r}=a,f=new ie(r),n=fe[U]||0;return f.build(e,n)}static decode(d){const{height:U,width:F,pixels:a}=se.decode(d),e=new Float32Array(U*F);for(let r=0;r<e.length;r++)e[r]=a[0][r];return{array:e,width:F,height:U}}static getSubDEM(d,U){function F(s,c,o,h,v,u,l,g){const x=new Float32Array(v*u);for(let p=0;p<u;p++)for(let y=0;y<v;y++){const M=(p+h)*c+(y+o),S=p*v+y;x[S]=s[M]}const k=new Float32Array(g*l);if(v===l&&u===g)k.set(x);else{const p=v/l,y=u/g;for(let M=0;M<g;M++)for(let S=0;S<l;S++){const I=Math.floor(S*p),D=Math.floor(M*y)*v+I;k[M*l+S]=x[D]}}return k}const{array:a,width:e}=d,{sx:r,sy:f,sw:n,sh:i}=G.getBoundsCoord(U,e),m=e;return{array:F(a,e,r,f,n,i,m,m),width:m,height:m}}static getBoundsCoord(d,U){const F=Math.floor(d[0]*U),a=Math.floor(d[1]*U),e=Math.floor((d[2]-d[0])*U),r=Math.floor((d[3]-d[1])*U);return{sx:F,sy:a,sw:e,sh:r}}}self.onmessage=B=>{const d=B.data,U=G.parse(d.demData,d.z,d.clipBounds);self.postMessage(U)}})();\n', Xf = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", fp], { type: "text/javascript;charset=utf-8" });
function o2(s) {
  let e;
  try {
    if (e = Xf && (self.URL || self.webkitURL).createObjectURL(Xf), !e) throw "";
    const t = new Worker(e, {
      name: s?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(fp),
      {
        name: s?.name
      }
    );
  }
}
var a2 = Object.defineProperty, l2 = (s, e, t) => e in s ? a2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Wo = (s, e, t) => l2(s, typeof e != "symbol" ? e + "" : e, t);
const c2 = 10;
class u2 extends hp {
  constructor() {
    super(), Wo(this, "info", {
      version: "1.0.0",
      description: "Loader for ArcGIS LERC compressed terrain data."
    }), Wo(this, "dataType", "lerc"), Wo(this, "fileLoader", new wi(We.manager)), Wo(this, "workerPool", new Sc(0)), this.fileLoader.setResponseType("arraybuffer"), this.workerPool.setWorkerCreator(() => new o2());
  }
  /**
   * 执行加载
   * @param url 
   * @param context 
   */
  async performLoad(e, t) {
    this.workerPool.pool === 0 && this.workerPool.setWorkerLimit(c2);
    const n = await this.fileLoader.loadAsync(e).catch(() => new Float32Array(256 * 256).buffer), i = {
      demData: n,
      z: t.z,
      clipBounds: t.bounds
    }, l = (await this.workerPool.postMessage(i, [n])).data, c = new Os();
    return c.setTerrainData(l), c;
  }
}
var h2 = Object.defineProperty, f2 = (s, e, t) => e in s ? h2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Go = (s, e, t) => f2(s, typeof e != "symbol" ? e + "" : e, t);
class Oc {
  constructor() {
    Go(this, "_imgSources", []), Go(this, "_demSource"), Go(this, "_vtSource"), Go(this, "manager", We.manager);
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
    const [t, n] = await Promise.all([
      this.loadGeometry(e),
      this.loadMaterials(e)
    ]);
    if (t && n)
      for (let i = 0; i < n.length; i++)
        t.addGroup(0, 1 / 0, i);
    return { geometry: t, materials: n };
  }
  /**
   * 卸载资源
   * @param tileMesh 
   */
  unload(e) {
    const t = e.material, n = e.geometry;
    Array.isArray(t) ? t.forEach((i) => i.dispose()) : t && t.dispose(), n && n.dispose();
  }
  /**
   * 加载几何体
   * @param context 
   */
  async loadGeometry(e) {
    const { z: t, bounds: n } = e;
    return this.demSource && t >= this.demSource.minLevel && this.isBoundsInSource(this.demSource, n) ? this.loadFromSource(this.demSource, e, We.getGeometryLoader(this.demSource)) : this.vtSource && t >= this.vtSource.minLevel && this.isBoundsInSource(this.vtSource, n) ? this.loadFromSource(this.vtSource, e, We.getMeshLoader(this.vtSource)) : new Fr();
  }
  /**
   * 加载材质列表
   * @param context 
   */
  async loadMaterials(e) {
    const { z: t, bounds: n } = e, o = this._imgSources.filter(
      (l) => t >= l.minLevel && this.isBoundsInSource(l, n)
    ).map(async (l) => {
      const c = We.getMaterialLoader(l);
      try {
        const u = await c.load({ source: l, ...e }), f = (p) => {
          c.unload && c.unload(p.target), p.target.removeEventListener("dispose", f);
        };
        return u instanceof qt || u.addEventListener("dispose", f), u;
      } catch (u) {
        return console.error(`[CompositeTileLoader] Material load failed for source ${l.dataType}:`, u), new qt();
      }
    });
    return Promise.all(o);
  }
  async loadFromSource(e, t, n) {
    try {
      const i = await n.load({ source: e, ...t });
      return i.addEventListener("dispose", () => {
        n.unload && n.unload(i);
      }), i;
    } catch (i) {
      return console.error(`[CompositeTileLoader] Geometry load failed for source ${e.dataType}:`, i), new Fr();
    }
  }
  /**
   * 检查瓦片边界是否在数据源范围内
   */
  isBoundsInSource(e, t) {
    const [n, i, o, l] = e._projectionBounds, [c, u, f, p] = t;
    return !(f < n || p < i || c > o || u > l);
  }
}
const dp = `(function(){"use strict";class s{static parse(t){return s.getDEMFromImage(t.data)}static getDEMFromImage(t){function c(e,g){const a=g*4,[i,u,l,m]=e.slice(a,a+4);return m===0?0:-1e4+(i<<16|u<<8|l)*.1}const n=t.length>>>2,r=new Float32Array(n);for(let e=0;e<n;e++)r[e]=c(t,e);return r}}self.onmessage=o=>{const t=s.parse(o.data.imgData);self.postMessage(t)}})();
`, Yf = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", dp], { type: "text/javascript;charset=utf-8" });
function d2(s) {
  let e;
  try {
    if (e = Yf && (self.URL || self.webkitURL).createObjectURL(Yf), !e) throw "";
    const t = new Worker(e, {
      name: s?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(dp),
      {
        name: s?.name
      }
    );
  }
}
var p2 = Object.defineProperty, m2 = (s, e, t) => e in s ? p2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, $o = (s, e, t) => m2(s, typeof e != "symbol" ? e + "" : e, t);
const g2 = 10;
class _2 extends hp {
  constructor() {
    super(), $o(this, "info", {
      version: "1.0.0",
      description: "Mapbox-RGB terrain loader for loading elevation data encoded in RGB textures."
    }), $o(this, "dataType", "terrain-rgb"), $o(this, "imageLoader", new Md(We.manager)), $o(this, "workerPool", new Sc(0)), this.workerPool.setWorkerCreator(() => new d2());
  }
  /**
   * 执行加载
   * @param url 
   * @param context 
   */
  async performLoad(e, t) {
    const n = await this.imageLoader.loadAsync(e).catch(() => new Image()), i = lt.clamp((t.z + 2) * 3, 2, 64), o = this.extractSubImageData(n, t.bounds, i);
    this.workerPool.pool === 0 && this.workerPool.setWorkerLimit(g2);
    const c = (await this.workerPool.postMessage(
      { imgData: o },
      [o.data.buffer]
    )).data, u = new Os();
    return u.setTerrainData(c), u;
  }
  /**
   * 提取子图像数据
   * @param image 源图像
   * @param bounds 裁剪边界
   * @param targetSize 目标尺寸
   */
  extractSubImageData(e, t, n) {
    const i = da.getBoundsCoord(t, e.width), o = Math.min(n, i.sw), c = new OffscreenCanvas(o, o).getContext("2d");
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
const pp = '(function(){"use strict";const P=23283064365386963e-26,M=12,S=typeof TextDecoder>"u"?null:new TextDecoder("utf-8"),g=0,y=1,F=2,p=5;class E{constructor(t=new Uint8Array(16)){this.buf=ArrayBuffer.isView(t)?t:new Uint8Array(t),this.dataView=new DataView(this.buf.buffer),this.pos=0,this.type=0,this.length=this.buf.length}readFields(t,e,r=this.length){for(;this.pos<r;){const s=this.readVarint(),n=s>>3,o=this.pos;this.type=s&7,t(n,e,this),this.pos===o&&this.skip(s)}return e}readMessage(t,e){return this.readFields(t,e,this.readVarint()+this.pos)}readFixed32(){const t=this.dataView.getUint32(this.pos,!0);return this.pos+=4,t}readSFixed32(){const t=this.dataView.getInt32(this.pos,!0);return this.pos+=4,t}readFixed64(){const t=this.dataView.getUint32(this.pos,!0)+this.dataView.getUint32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readSFixed64(){const t=this.dataView.getUint32(this.pos,!0)+this.dataView.getInt32(this.pos+4,!0)*4294967296;return this.pos+=8,t}readFloat(){const t=this.dataView.getFloat32(this.pos,!0);return this.pos+=4,t}readDouble(){const t=this.dataView.getFloat64(this.pos,!0);return this.pos+=8,t}readVarint(t){const e=this.buf;let r,s;return s=e[this.pos++],r=s&127,s<128||(s=e[this.pos++],r|=(s&127)<<7,s<128)||(s=e[this.pos++],r|=(s&127)<<14,s<128)||(s=e[this.pos++],r|=(s&127)<<21,s<128)?r:(s=e[this.pos],r|=(s&15)<<28,B(r,t,this))}readVarint64(){return this.readVarint(!0)}readSVarint(){const t=this.readVarint();return t%2===1?(t+1)/-2:t/2}readBoolean(){return!!this.readVarint()}readString(){const t=this.readVarint()+this.pos,e=this.pos;return this.pos=t,t-e>=M&&S?S.decode(this.buf.subarray(e,t)):q(this.buf,e,t)}readBytes(){const t=this.readVarint()+this.pos,e=this.buf.subarray(this.pos,t);return this.pos=t,e}readPackedVarint(t=[],e){const r=this.readPackedEnd();for(;this.pos<r;)t.push(this.readVarint(e));return t}readPackedSVarint(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSVarint());return t}readPackedBoolean(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readBoolean());return t}readPackedFloat(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFloat());return t}readPackedDouble(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readDouble());return t}readPackedFixed32(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFixed32());return t}readPackedSFixed32(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSFixed32());return t}readPackedFixed64(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readFixed64());return t}readPackedSFixed64(t=[]){const e=this.readPackedEnd();for(;this.pos<e;)t.push(this.readSFixed64());return t}readPackedEnd(){return this.type===F?this.readVarint()+this.pos:this.pos+1}skip(t){const e=t&7;if(e===g)for(;this.buf[this.pos++]>127;);else if(e===F)this.pos=this.readVarint()+this.pos;else if(e===p)this.pos+=4;else if(e===y)this.pos+=8;else throw new Error(`Unimplemented type: ${e}`)}writeTag(t,e){this.writeVarint(t<<3|e)}realloc(t){let e=this.length||16;for(;e<this.pos+t;)e*=2;if(e!==this.length){const r=new Uint8Array(e);r.set(this.buf),this.buf=r,this.dataView=new DataView(r.buffer),this.length=e}}finish(){return this.length=this.pos,this.pos=0,this.buf.subarray(0,this.length)}writeFixed32(t){this.realloc(4),this.dataView.setInt32(this.pos,t,!0),this.pos+=4}writeSFixed32(t){this.realloc(4),this.dataView.setInt32(this.pos,t,!0),this.pos+=4}writeFixed64(t){this.realloc(8),this.dataView.setInt32(this.pos,t&-1,!0),this.dataView.setInt32(this.pos+4,Math.floor(t*P),!0),this.pos+=8}writeSFixed64(t){this.realloc(8),this.dataView.setInt32(this.pos,t&-1,!0),this.dataView.setInt32(this.pos+4,Math.floor(t*P),!0),this.pos+=8}writeVarint(t){if(t=+t||0,t>268435455||t<0){T(t,this);return}this.realloc(4),this.buf[this.pos++]=t&127|(t>127?128:0),!(t<=127)&&(this.buf[this.pos++]=(t>>>=7)&127|(t>127?128:0),!(t<=127)&&(this.buf[this.pos++]=(t>>>=7)&127|(t>127?128:0),!(t<=127)&&(this.buf[this.pos++]=t>>>7&127)))}writeSVarint(t){this.writeVarint(t<0?-t*2-1:t*2)}writeBoolean(t){this.writeVarint(+t)}writeString(t){t=String(t),this.realloc(t.length*4),this.pos++;const e=this.pos;this.pos=O(this.buf,t,this.pos);const r=this.pos-e;r>=128&&k(e,r,this),this.pos=e-1,this.writeVarint(r),this.pos+=r}writeFloat(t){this.realloc(4),this.dataView.setFloat32(this.pos,t,!0),this.pos+=4}writeDouble(t){this.realloc(8),this.dataView.setFloat64(this.pos,t,!0),this.pos+=8}writeBytes(t){const e=t.length;this.writeVarint(e),this.realloc(e);for(let r=0;r<e;r++)this.buf[this.pos++]=t[r]}writeRawMessage(t,e){this.pos++;const r=this.pos;t(e,this);const s=this.pos-r;s>=128&&k(r,s,this),this.pos=r-1,this.writeVarint(s),this.pos+=s}writeMessage(t,e,r){this.writeTag(t,F),this.writeRawMessage(e,r)}writePackedVarint(t,e){e.length&&this.writeMessage(t,C,e)}writePackedSVarint(t,e){e.length&&this.writeMessage(t,L,e)}writePackedBoolean(t,e){e.length&&this.writeMessage(t,U,e)}writePackedFloat(t,e){e.length&&this.writeMessage(t,A,e)}writePackedDouble(t,e){e.length&&this.writeMessage(t,v,e)}writePackedFixed32(t,e){e.length&&this.writeMessage(t,N,e)}writePackedSFixed32(t,e){e.length&&this.writeMessage(t,G,e)}writePackedFixed64(t,e){e.length&&this.writeMessage(t,H,e)}writePackedSFixed64(t,e){e.length&&this.writeMessage(t,R,e)}writeBytesField(t,e){this.writeTag(t,F),this.writeBytes(e)}writeFixed32Field(t,e){this.writeTag(t,p),this.writeFixed32(e)}writeSFixed32Field(t,e){this.writeTag(t,p),this.writeSFixed32(e)}writeFixed64Field(t,e){this.writeTag(t,y),this.writeFixed64(e)}writeSFixed64Field(t,e){this.writeTag(t,y),this.writeSFixed64(e)}writeVarintField(t,e){this.writeTag(t,g),this.writeVarint(e)}writeSVarintField(t,e){this.writeTag(t,g),this.writeSVarint(e)}writeStringField(t,e){this.writeTag(t,F),this.writeString(e)}writeFloatField(t,e){this.writeTag(t,p),this.writeFloat(e)}writeDoubleField(t,e){this.writeTag(t,y),this.writeDouble(e)}writeBooleanField(t,e){this.writeVarintField(t,+e)}}function B(i,t,e){const r=e.buf;let s,n;if(n=r[e.pos++],s=(n&112)>>4,n<128||(n=r[e.pos++],s|=(n&127)<<3,n<128)||(n=r[e.pos++],s|=(n&127)<<10,n<128)||(n=r[e.pos++],s|=(n&127)<<17,n<128)||(n=r[e.pos++],s|=(n&127)<<24,n<128)||(n=r[e.pos++],s|=(n&1)<<31,n<128))return w(i,s,t);throw new Error("Expected varint not more than 10 bytes")}function w(i,t,e){return e?t*4294967296+(i>>>0):(t>>>0)*4294967296+(i>>>0)}function T(i,t){let e,r;if(i>=0?(e=i%4294967296|0,r=i/4294967296|0):(e=~(-i%4294967296),r=~(-i/4294967296),e^4294967295?e=e+1|0:(e=0,r=r+1|0)),i>=18446744073709552e3||i<-18446744073709552e3)throw new Error("Given varint doesn\'t fit into 10 bytes");t.realloc(10),D(e,r,t),I(r,t)}function D(i,t,e){e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos++]=i&127|128,i>>>=7,e.buf[e.pos]=i&127}function I(i,t){const e=(i&7)<<4;t.buf[t.pos++]|=e|((i>>>=3)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127|((i>>>=7)?128:0),i&&(t.buf[t.pos++]=i&127)))))}function k(i,t,e){const r=t<=16383?1:t<=2097151?2:t<=268435455?3:Math.floor(Math.log(t)/(Math.LN2*7));e.realloc(r);for(let s=e.pos-1;s>=i;s--)e.buf[s+r]=e.buf[s]}function C(i,t){for(let e=0;e<i.length;e++)t.writeVarint(i[e])}function L(i,t){for(let e=0;e<i.length;e++)t.writeSVarint(i[e])}function A(i,t){for(let e=0;e<i.length;e++)t.writeFloat(i[e])}function v(i,t){for(let e=0;e<i.length;e++)t.writeDouble(i[e])}function U(i,t){for(let e=0;e<i.length;e++)t.writeBoolean(i[e])}function N(i,t){for(let e=0;e<i.length;e++)t.writeFixed32(i[e])}function G(i,t){for(let e=0;e<i.length;e++)t.writeSFixed32(i[e])}function H(i,t){for(let e=0;e<i.length;e++)t.writeFixed64(i[e])}function R(i,t){for(let e=0;e<i.length;e++)t.writeSFixed64(i[e])}function q(i,t,e){let r="",s=t;for(;s<e;){const n=i[s];let o=null,h=n>239?4:n>223?3:n>191?2:1;if(s+h>e)break;let a,d,l;h===1?n<128&&(o=n):h===2?(a=i[s+1],(a&192)===128&&(o=(n&31)<<6|a&63,o<=127&&(o=null))):h===3?(a=i[s+1],d=i[s+2],(a&192)===128&&(d&192)===128&&(o=(n&15)<<12|(a&63)<<6|d&63,(o<=2047||o>=55296&&o<=57343)&&(o=null))):h===4&&(a=i[s+1],d=i[s+2],l=i[s+3],(a&192)===128&&(d&192)===128&&(l&192)===128&&(o=(n&15)<<18|(a&63)<<12|(d&63)<<6|l&63,(o<=65535||o>=1114112)&&(o=null))),o===null?(o=65533,h=1):o>65535&&(o-=65536,r+=String.fromCharCode(o>>>10&1023|55296),o=56320|o&1023),r+=String.fromCharCode(o),s+=h}return r}function O(i,t,e){for(let r=0,s,n;r<t.length;r++){if(s=t.charCodeAt(r),s>55295&&s<57344)if(n)if(s<56320){i[e++]=239,i[e++]=191,i[e++]=189,n=s;continue}else s=n-55296<<10|s-56320|65536,n=null;else{s>56319||r+1===t.length?(i[e++]=239,i[e++]=191,i[e++]=189):n=s;continue}else n&&(i[e++]=239,i[e++]=191,i[e++]=189,n=null);s<128?i[e++]=s:(s<2048?i[e++]=s>>6|192:(s<65536?i[e++]=s>>12|224:(i[e++]=s>>18|240,i[e++]=s>>12&63|128),i[e++]=s>>6&63|128),i[e++]=s&63|128)}return e}function f(i,t){this.x=i,this.y=t}f.prototype={clone(){return new f(this.x,this.y)},add(i){return this.clone()._add(i)},sub(i){return this.clone()._sub(i)},multByPoint(i){return this.clone()._multByPoint(i)},divByPoint(i){return this.clone()._divByPoint(i)},mult(i){return this.clone()._mult(i)},div(i){return this.clone()._div(i)},rotate(i){return this.clone()._rotate(i)},rotateAround(i,t){return this.clone()._rotateAround(i,t)},matMult(i){return this.clone()._matMult(i)},unit(){return this.clone()._unit()},perp(){return this.clone()._perp()},round(){return this.clone()._round()},mag(){return Math.sqrt(this.x*this.x+this.y*this.y)},equals(i){return this.x===i.x&&this.y===i.y},dist(i){return Math.sqrt(this.distSqr(i))},distSqr(i){const t=i.x-this.x,e=i.y-this.y;return t*t+e*e},angle(){return Math.atan2(this.y,this.x)},angleTo(i){return Math.atan2(this.y-i.y,this.x-i.x)},angleWith(i){return this.angleWithSep(i.x,i.y)},angleWithSep(i,t){return Math.atan2(this.x*t-this.y*i,this.x*i+this.y*t)},_matMult(i){const t=i[0]*this.x+i[1]*this.y,e=i[2]*this.x+i[3]*this.y;return this.x=t,this.y=e,this},_add(i){return this.x+=i.x,this.y+=i.y,this},_sub(i){return this.x-=i.x,this.y-=i.y,this},_mult(i){return this.x*=i,this.y*=i,this},_div(i){return this.x/=i,this.y/=i,this},_multByPoint(i){return this.x*=i.x,this.y*=i.y,this},_divByPoint(i){return this.x/=i.x,this.y/=i.y,this},_unit(){return this._div(this.mag()),this},_perp(){const i=this.y;return this.y=this.x,this.x=-i,this},_rotate(i){const t=Math.cos(i),e=Math.sin(i),r=t*this.x-e*this.y,s=e*this.x+t*this.y;return this.x=r,this.y=s,this},_rotateAround(i,t){const e=Math.cos(i),r=Math.sin(i),s=t.x+e*(this.x-t.x)-r*(this.y-t.y),n=t.y+r*(this.x-t.x)+e*(this.y-t.y);return this.x=s,this.y=n,this},_round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},constructor:f},f.convert=function(i){if(i instanceof f)return i;if(Array.isArray(i))return new f(+i[0],+i[1]);if(i.x!==void 0&&i.y!==void 0)return new f(+i.x,+i.y);throw new Error("Expected [x, y] or {x, y} point format")};class m{constructor(t,e,r,s,n){this.properties={},this.extent=r,this.type=0,this.id=void 0,this._pbf=t,this._geometry=-1,this._keys=s,this._values=n,t.readFields(j,this,e)}loadGeometry(){const t=this._pbf;t.pos=this._geometry;const e=t.readVarint()+t.pos,r=[];let s,n=1,o=0,h=0,a=0;for(;t.pos<e;){if(o<=0){const d=t.readVarint();n=d&7,o=d>>3}if(o--,n===1||n===2)h+=t.readSVarint(),a+=t.readSVarint(),n===1&&(s&&r.push(s),s=[]),s&&s.push(new f(h,a));else if(n===7)s&&s.push(s[0].clone());else throw new Error(`unknown command ${n}`)}return s&&r.push(s),r}bbox(){const t=this._pbf;t.pos=this._geometry;const e=t.readVarint()+t.pos;let r=1,s=0,n=0,o=0,h=1/0,a=-1/0,d=1/0,l=-1/0;for(;t.pos<e;){if(s<=0){const x=t.readVarint();r=x&7,s=x>>3}if(s--,r===1||r===2)n+=t.readSVarint(),o+=t.readSVarint(),n<h&&(h=n),n>a&&(a=n),o<d&&(d=o),o>l&&(l=o);else if(r!==7)throw new Error(`unknown command ${r}`)}return[h,d,a,l]}toGeoJSON(t,e,r){const s=this.extent*Math.pow(2,r),n=this.extent*t,o=this.extent*e,h=this.loadGeometry();function a(u){return[(u.x+n)*360/s-180,360/Math.PI*Math.atan(Math.exp((1-(u.y+o)*2/s)*Math.PI))-90]}function d(u){return u.map(a)}let l;if(this.type===1){const u=[];for(const _ of h)u.push(_[0]);const c=d(u);l=u.length===1?{type:"Point",coordinates:c[0]}:{type:"MultiPoint",coordinates:c}}else if(this.type===2){const u=h.map(d);l=u.length===1?{type:"LineString",coordinates:u[0]}:{type:"MultiLineString",coordinates:u}}else if(this.type===3){const u=W(h),c=[];for(const _ of u)c.push(_.map(d));l=c.length===1?{type:"Polygon",coordinates:c[0]}:{type:"MultiPolygon",coordinates:c}}else throw new Error("unknown feature type");const x={type:"Feature",geometry:l,properties:this.properties};return this.id!=null&&(x.id=this.id),x}}m.types=["Unknown","Point","LineString","Polygon"];function j(i,t,e){i===1?t.id=e.readVarint():i===2?J(e,t):i===3?t.type=e.readVarint():i===4&&(t._geometry=e.pos)}function J(i,t){const e=i.readVarint()+i.pos;for(;i.pos<e;){const r=t._keys[i.readVarint()],s=t._values[i.readVarint()];t.properties[r]=s}}function W(i){const t=i.length;if(t<=1)return[i];const e=[];let r,s;for(let n=0;n<t;n++){const o=X(i[n]);o!==0&&(s===void 0&&(s=o<0),s===o<0?(r&&e.push(r),r=[i[n]]):r&&r.push(i[n]))}return r&&e.push(r),e}function X(i){let t=0;for(let e=0,r=i.length,s=r-1,n,o;e<r;s=e++)n=i[e],o=i[s],t+=(o.x-n.x)*(n.y+o.y);return t}class ${constructor(t,e){this.version=1,this.name="",this.extent=4096,this.length=0,this._pbf=t,this._keys=[],this._values=[],this._features=[],t.readFields(b,this,e),this.length=this._features.length}feature(t){if(t<0||t>=this._features.length)throw new Error("feature index out of bounds");this._pbf.pos=this._features[t];const e=this._pbf.readVarint()+this._pbf.pos;return new m(this._pbf,e,this.extent,this._keys,this._values)}}function b(i,t,e){i===15?t.version=e.readVarint():i===1?t.name=e.readString():i===5?t.extent=e.readVarint():i===2?t._features.push(e.pos):i===3?t._keys.push(e.readString()):i===4&&t._values.push(z(e))}function z(i){let t=null;const e=i.readVarint()+i.pos;for(;i.pos<e;){const r=i.readVarint()>>3;t=r===1?i.readString():r===2?i.readFloat():r===3?i.readDouble():r===4?i.readVarint64():r===5?i.readVarint():r===6?i.readSVarint():r===7?i.readBoolean():null}if(t==null)throw new Error("unknown feature value");return t}class Y{constructor(t,e){this.layers=t.readFields(K,{},e)}}function K(i,t,e){if(i===3){const r=new $(e,e.readVarint()+e.pos);r.length&&(t[r.name]=r)}}class V{static async parse(t,e,r,s){try{const n=V.mvt2GeoJSON(t,e,r,s);return{x:e,y:r,z:s,layers:n,timestamp:Date.now(),dataFormat:"mvt"}}catch(n){throw console.error("[MVTParser] Error parsing vector tile data:",n),n}}static mvt2GeoJSON(t,e,r,s){const n=new E(t),o=new Y(n),h={};for(const a in o.layers){const d=o.layers[a],l=[];for(let x=0;x<d.length;x++){const c=d.feature(x).toGeoJSON(e,r,s);l.push(c)}h[a]=l}return h}}self.onmessage=async i=>{const t=i.data;try{const e=await V.parse(t.arrayBuffer,t.x,t.y,t.z);self.postMessage(e)}catch(e){console.error("Worker MVT Parse Failed:",e),self.postMessage({error:e.message})}}})();\n', Zf = typeof self < "u" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", pp], { type: "text/javascript;charset=utf-8" });
function y2(s) {
  let e;
  try {
    if (e = Zf && (self.URL || self.webkitURL).createObjectURL(Zf), !e) throw "";
    const t = new Worker(e, {
      name: s?.name
    });
    return t.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(e);
    }), t;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(pp),
      {
        name: s?.name
      }
    );
  }
}
var v2 = Object.defineProperty, w2 = (s, e, t) => e in s ? v2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, jo = (s, e, t) => w2(s, typeof e != "symbol" ? e + "" : e, t);
const b2 = 10;
class x2 {
  constructor() {
    jo(this, "info", {
      version: "2.0.0",
      description: "Mapbox Vector Tile Geometry Loader (Refactored)"
    }), jo(this, "dataType", "vector-tile"), jo(this, "fileLoader", new wi(We.manager)), jo(this, "_workerPool", new Sc(0)), this.fileLoader.setResponseType("arraybuffer"), this._workerPool.setWorkerCreator(() => new y2());
  }
  /**
   * Load tile geometry (vector data container)
   * 加载瓦片几何体（矢量数据容器）
   */
  async load(e) {
    const { source: t, x: n, y: i, z: o } = e, l = typeof t._getUrl == "function" ? t._getUrl(n, i, o) : this.buildTileUrl(t.url, n, i, o);
    if (!l)
      return this.createErrorGeometry(n, i, o, new Error("Source returned empty URL"));
    this._workerPool.pool === 0 && this._workerPool.setWorkerLimit(b2);
    try {
      const c = await this.fetchVectorData(l), u = { arrayBuffer: c, x: n, y: i, z: o }, p = (await this._workerPool.postMessage(u, [c])).data;
      if (p.error)
        throw new Error(p.error);
      const d = this.createGeometryWithVectorData(p, e);
      return We.manager.parseEnd(l), d;
    } catch (c) {
      return this.createErrorGeometry(n, i, o, c);
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
  buildTileUrl(e, t, n, i) {
    return e ? e.replace("{x}", t.toString()).replace("{y}", n.toString()).replace("{z}", i.toString()).replace("{-y}", (Math.pow(2, i) - 1 - n).toString()) : "";
  }
  createGeometryWithVectorData(e, t) {
    const n = new Os();
    return n.userData = {
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
    }, n;
  }
  createErrorGeometry(e, t, n, i) {
    const o = new Os(), l = 4007501668557849e-8 / Math.pow(2, n);
    return o.userData = {
      vectorData: {
        x: e,
        y: t,
        z: n,
        layers: {},
        totalFeatures: 0,
        bounds: { world: { x: l, y: l } },
        // Simplified bounds
        error: i.message || "Unknown error",
        timestamp: Date.now(),
        dataFormat: "error"
      },
      tileInfo: { x: e, y: t, z: n, bounds: [0, 0, 0, 0] },
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
function gi(s, e) {
  this.x = s, this.y = e;
}
gi.prototype = {
  /**
   * Clone this point, returning a new point that can be modified
   * without affecting the old one.
   * @return {Point} the clone
   */
  clone() {
    return new gi(this.x, this.y);
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
    const e = Math.cos(s), t = Math.sin(s), n = e * this.x - t * this.y, i = t * this.x + e * this.y;
    return this.x = n, this.y = i, this;
  },
  /**
   * @param {number} angle
   * @param {Point} p
   */
  _rotateAround(s, e) {
    const t = Math.cos(s), n = Math.sin(s), i = e.x + t * (this.x - e.x) - n * (this.y - e.y), o = e.y + n * (this.x - e.x) + t * (this.y - e.y);
    return this.x = i, this.y = o, this;
  },
  _round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  },
  constructor: gi
};
gi.convert = function(s) {
  if (s instanceof gi)
    return (
      /** @type {Point} */
      s
    );
  if (Array.isArray(s))
    return new gi(+s[0], +s[1]);
  if (s.x !== void 0 && s.y !== void 0)
    return new gi(+s.x, +s.y);
  throw new Error("Expected [x, y] or {x, y} point format");
};
class mp {
  /**
   * @param {Pbf} pbf
   * @param {number} end
   * @param {number} extent
   * @param {string[]} keys
   * @param {(number | string | boolean)[]} values
   */
  constructor(e, t, n, i, o) {
    this.properties = {}, this.extent = n, this.type = 0, this.id = void 0, this._pbf = e, this._geometry = -1, this._keys = i, this._values = o, e.readFields(T2, this, t);
  }
  loadGeometry() {
    const e = this._pbf;
    e.pos = this._geometry;
    const t = e.readVarint() + e.pos, n = [];
    let i, o = 1, l = 0, c = 0, u = 0;
    for (; e.pos < t; ) {
      if (l <= 0) {
        const f = e.readVarint();
        o = f & 7, l = f >> 3;
      }
      if (l--, o === 1 || o === 2)
        c += e.readSVarint(), u += e.readSVarint(), o === 1 && (i && n.push(i), i = []), i && i.push(new gi(c, u));
      else if (o === 7)
        i && i.push(i[0].clone());
      else
        throw new Error(`unknown command ${o}`);
    }
    return i && n.push(i), n;
  }
  bbox() {
    const e = this._pbf;
    e.pos = this._geometry;
    const t = e.readVarint() + e.pos;
    let n = 1, i = 0, o = 0, l = 0, c = 1 / 0, u = -1 / 0, f = 1 / 0, p = -1 / 0;
    for (; e.pos < t; ) {
      if (i <= 0) {
        const d = e.readVarint();
        n = d & 7, i = d >> 3;
      }
      if (i--, n === 1 || n === 2)
        o += e.readSVarint(), l += e.readSVarint(), o < c && (c = o), o > u && (u = o), l < f && (f = l), l > p && (p = l);
      else if (n !== 7)
        throw new Error(`unknown command ${n}`);
    }
    return [c, f, u, p];
  }
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {Feature}
   */
  toGeoJSON(e, t, n) {
    const i = this.extent * Math.pow(2, n), o = this.extent * e, l = this.extent * t, c = this.loadGeometry();
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
      for (const x of c)
        g.push(x[0]);
      const y = f(g);
      p = g.length === 1 ? { type: "Point", coordinates: y[0] } : { type: "MultiPoint", coordinates: y };
    } else if (this.type === 2) {
      const g = c.map(f);
      p = g.length === 1 ? { type: "LineString", coordinates: g[0] } : { type: "MultiLineString", coordinates: g };
    } else if (this.type === 3) {
      const g = M2(c), y = [];
      for (const x of g)
        y.push(x.map(f));
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
mp.types = ["Unknown", "Point", "LineString", "Polygon"];
function T2(s, e, t) {
  s === 1 ? e.id = t.readVarint() : s === 2 ? S2(t, e) : s === 3 ? e.type = /** @type {0 | 1 | 2 | 3} */
  t.readVarint() : s === 4 && (e._geometry = t.pos);
}
function S2(s, e) {
  const t = s.readVarint() + s.pos;
  for (; s.pos < t; ) {
    const n = e._keys[s.readVarint()], i = e._values[s.readVarint()];
    e.properties[n] = i;
  }
}
function M2(s) {
  const e = s.length;
  if (e <= 1) return [s];
  const t = [];
  let n, i;
  for (let o = 0; o < e; o++) {
    const l = A2(s[o]);
    l !== 0 && (i === void 0 && (i = l < 0), i === l < 0 ? (n && t.push(n), n = [s[o]]) : n && n.push(s[o]));
  }
  return n && t.push(n), t;
}
function A2(s) {
  let e = 0;
  for (let t = 0, n = s.length, i = n - 1, o, l; t < n; i = t++)
    o = s[t], l = s[i], e += (l.x - o.x) * (o.y + l.y);
  return e;
}
let P2 = class {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(e, t) {
    this.version = 1, this.name = "", this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(L2, this, t), this.length = this._features.length;
  }
  /** return feature `i` from this layer as a `VectorTileFeature`
   * @param {number} i
   */
  feature(e) {
    if (e < 0 || e >= this._features.length) throw new Error("feature index out of bounds");
    this._pbf.pos = this._features[e];
    const t = this._pbf.readVarint() + this._pbf.pos;
    return new mp(this._pbf, t, this.extent, this._keys, this._values);
  }
};
function L2(s, e, t) {
  s === 15 ? e.version = t.readVarint() : s === 1 ? e.name = t.readString() : s === 5 ? e.extent = t.readVarint() : s === 2 ? e._features.push(t.pos) : s === 3 ? e._keys.push(t.readString()) : s === 4 && e._values.push(E2(t));
}
function E2(s) {
  let e = null;
  const t = s.readVarint() + s.pos;
  for (; s.pos < t; ) {
    const n = s.readVarint() >> 3;
    e = n === 1 ? s.readString() : n === 2 ? s.readFloat() : n === 3 ? s.readDouble() : n === 4 ? s.readVarint64() : n === 5 ? s.readVarint() : n === 6 ? s.readSVarint() : n === 7 ? s.readBoolean() : null;
  }
  if (e == null)
    throw new Error("unknown feature value");
  return e;
}
class C2 {
  /**
   * @param {Pbf} pbf
   * @param {number} [end]
   */
  constructor(e, t) {
    this.layers = e.readFields(O2, {}, t);
  }
}
function O2(s, e, t) {
  if (s === 3) {
    const n = new P2(t, t.readVarint() + t.pos);
    n.length && (e[n.name] = n);
  }
}
const gc = 65536 * 65536, qf = 1 / gc, R2 = 12, Kf = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8"), Yl = 0, Xo = 1, ds = 2, Yo = 5;
class D2 {
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
  readFields(e, t, n = this.length) {
    for (; this.pos < n; ) {
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
    const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getUint32(this.pos + 4, !0) * gc;
    return this.pos += 8, e;
  }
  readSFixed64() {
    const e = this.dataView.getUint32(this.pos, !0) + this.dataView.getInt32(this.pos + 4, !0) * gc;
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
    let n, i;
    return i = t[this.pos++], n = i & 127, i < 128 || (i = t[this.pos++], n |= (i & 127) << 7, i < 128) || (i = t[this.pos++], n |= (i & 127) << 14, i < 128) || (i = t[this.pos++], n |= (i & 127) << 21, i < 128) ? n : (i = t[this.pos], n |= (i & 15) << 28, I2(n, e, this));
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
    return this.pos = e, e - t >= R2 && Kf ? Kf.decode(this.buf.subarray(t, e)) : X2(this.buf, t, e);
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
    const n = this.readPackedEnd();
    for (; this.pos < n; ) e.push(this.readVarint(t));
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
    return this.type === ds ? this.readVarint() + this.pos : this.pos + 1;
  }
  /** @param {number} val */
  skip(e) {
    const t = e & 7;
    if (t === Yl) for (; this.buf[this.pos++] > 127; )
      ;
    else if (t === ds) this.pos = this.readVarint() + this.pos;
    else if (t === Yo) this.pos += 4;
    else if (t === Xo) this.pos += 8;
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
      const n = new Uint8Array(t);
      n.set(this.buf), this.buf = n, this.dataView = new DataView(n.buffer), this.length = t;
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
    this.realloc(8), this.dataView.setInt32(this.pos, e & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * qf), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeSFixed64(e) {
    this.realloc(8), this.dataView.setInt32(this.pos, e & -1, !0), this.dataView.setInt32(this.pos + 4, Math.floor(e * qf), !0), this.pos += 8;
  }
  /** @param {number} val */
  writeVarint(e) {
    if (e = +e || 0, e > 268435455 || e < 0) {
      F2(e, this);
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
    this.pos = Y2(this.buf, e, this.pos);
    const n = this.pos - t;
    n >= 128 && Qf(t, n, this), this.pos = t - 1, this.writeVarint(n), this.pos += n;
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
    for (let n = 0; n < t; n++) this.buf[this.pos++] = e[n];
  }
  /**
   * @template T
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeRawMessage(e, t) {
    this.pos++;
    const n = this.pos;
    e(t, this);
    const i = this.pos - n;
    i >= 128 && Qf(n, i, this), this.pos = n - 1, this.writeVarint(i), this.pos += i;
  }
  /**
   * @template T
   * @param {number} tag
   * @param {(obj: T, pbf: Pbf) => void} fn
   * @param {T} obj
   */
  writeMessage(e, t, n) {
    this.writeTag(e, ds), this.writeRawMessage(t, n);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedVarint(e, t) {
    t.length && this.writeMessage(e, k2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSVarint(e, t) {
    t.length && this.writeMessage(e, z2, t);
  }
  /**
   * @param {number} tag
   * @param {boolean[]} arr
   */
  writePackedBoolean(e, t) {
    t.length && this.writeMessage(e, V2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFloat(e, t) {
    t.length && this.writeMessage(e, N2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedDouble(e, t) {
    t.length && this.writeMessage(e, H2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed32(e, t) {
    t.length && this.writeMessage(e, W2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed32(e, t) {
    t.length && this.writeMessage(e, G2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedFixed64(e, t) {
    t.length && this.writeMessage(e, $2, t);
  }
  /**
   * @param {number} tag
   * @param {number[]} arr
   */
  writePackedSFixed64(e, t) {
    t.length && this.writeMessage(e, j2, t);
  }
  /**
   * @param {number} tag
   * @param {Uint8Array} buffer
   */
  writeBytesField(e, t) {
    this.writeTag(e, ds), this.writeBytes(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed32Field(e, t) {
    this.writeTag(e, Yo), this.writeFixed32(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed32Field(e, t) {
    this.writeTag(e, Yo), this.writeSFixed32(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFixed64Field(e, t) {
    this.writeTag(e, Xo), this.writeFixed64(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSFixed64Field(e, t) {
    this.writeTag(e, Xo), this.writeSFixed64(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeVarintField(e, t) {
    this.writeTag(e, Yl), this.writeVarint(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeSVarintField(e, t) {
    this.writeTag(e, Yl), this.writeSVarint(t);
  }
  /**
   * @param {number} tag
   * @param {string} str
   */
  writeStringField(e, t) {
    this.writeTag(e, ds), this.writeString(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeFloatField(e, t) {
    this.writeTag(e, Yo), this.writeFloat(t);
  }
  /**
   * @param {number} tag
   * @param {number} val
   */
  writeDoubleField(e, t) {
    this.writeTag(e, Xo), this.writeDouble(t);
  }
  /**
   * @param {number} tag
   * @param {boolean} val
   */
  writeBooleanField(e, t) {
    this.writeVarintField(e, +t);
  }
}
function I2(s, e, t) {
  const n = t.buf;
  let i, o;
  if (o = n[t.pos++], i = (o & 112) >> 4, o < 128 || (o = n[t.pos++], i |= (o & 127) << 3, o < 128) || (o = n[t.pos++], i |= (o & 127) << 10, o < 128) || (o = n[t.pos++], i |= (o & 127) << 17, o < 128) || (o = n[t.pos++], i |= (o & 127) << 24, o < 128) || (o = n[t.pos++], i |= (o & 1) << 31, o < 128)) return Mr(s, i, e);
  throw new Error("Expected varint not more than 10 bytes");
}
function Mr(s, e, t) {
  return t ? e * 4294967296 + (s >>> 0) : (e >>> 0) * 4294967296 + (s >>> 0);
}
function F2(s, e) {
  let t, n;
  if (s >= 0 ? (t = s % 4294967296 | 0, n = s / 4294967296 | 0) : (t = ~(-s % 4294967296), n = ~(-s / 4294967296), t ^ 4294967295 ? t = t + 1 | 0 : (t = 0, n = n + 1 | 0)), s >= 18446744073709552e3 || s < -18446744073709552e3)
    throw new Error("Given varint doesn't fit into 10 bytes");
  e.realloc(10), B2(t, n, e), U2(n, e);
}
function B2(s, e, t) {
  t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos++] = s & 127 | 128, s >>>= 7, t.buf[t.pos] = s & 127;
}
function U2(s, e) {
  const t = (s & 7) << 4;
  e.buf[e.pos++] |= t | ((s >>>= 3) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127 | ((s >>>= 7) ? 128 : 0), s && (e.buf[e.pos++] = s & 127)))));
}
function Qf(s, e, t) {
  const n = e <= 16383 ? 1 : e <= 2097151 ? 2 : e <= 268435455 ? 3 : Math.floor(Math.log(e) / (Math.LN2 * 7));
  t.realloc(n);
  for (let i = t.pos - 1; i >= s; i--) t.buf[i + n] = t.buf[i];
}
function k2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeVarint(s[t]);
}
function z2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeSVarint(s[t]);
}
function N2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeFloat(s[t]);
}
function H2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeDouble(s[t]);
}
function V2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeBoolean(s[t]);
}
function W2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeFixed32(s[t]);
}
function G2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeSFixed32(s[t]);
}
function $2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeFixed64(s[t]);
}
function j2(s, e) {
  for (let t = 0; t < s.length; t++) e.writeSFixed64(s[t]);
}
function X2(s, e, t) {
  let n = "", i = e;
  for (; i < t; ) {
    const o = s[i];
    let l = null, c = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
    if (i + c > t) break;
    let u, f, p;
    c === 1 ? o < 128 && (l = o) : c === 2 ? (u = s[i + 1], (u & 192) === 128 && (l = (o & 31) << 6 | u & 63, l <= 127 && (l = null))) : c === 3 ? (u = s[i + 1], f = s[i + 2], (u & 192) === 128 && (f & 192) === 128 && (l = (o & 15) << 12 | (u & 63) << 6 | f & 63, (l <= 2047 || l >= 55296 && l <= 57343) && (l = null))) : c === 4 && (u = s[i + 1], f = s[i + 2], p = s[i + 3], (u & 192) === 128 && (f & 192) === 128 && (p & 192) === 128 && (l = (o & 15) << 18 | (u & 63) << 12 | (f & 63) << 6 | p & 63, (l <= 65535 || l >= 1114112) && (l = null))), l === null ? (l = 65533, c = 1) : l > 65535 && (l -= 65536, n += String.fromCharCode(l >>> 10 & 1023 | 55296), l = 56320 | l & 1023), n += String.fromCharCode(l), i += c;
  }
  return n;
}
function Y2(s, e, t) {
  for (let n = 0, i, o; n < e.length; n++) {
    if (i = e.charCodeAt(n), i > 55295 && i < 57344)
      if (o)
        if (i < 56320) {
          s[t++] = 239, s[t++] = 191, s[t++] = 189, o = i;
          continue;
        } else
          i = o - 55296 << 10 | i - 56320 | 65536, o = null;
      else {
        i > 56319 || n + 1 === e.length ? (s[t++] = 239, s[t++] = 191, s[t++] = 189) : o = i;
        continue;
      }
    else o && (s[t++] = 239, s[t++] = 191, s[t++] = 189, o = null);
    i < 128 ? s[t++] = i : (i < 2048 ? s[t++] = i >> 6 | 192 : (i < 65536 ? s[t++] = i >> 12 | 224 : (s[t++] = i >> 18 | 240, s[t++] = i >> 12 & 63 | 128), s[t++] = i >> 6 & 63 | 128), s[t++] = i & 63 | 128);
  }
  return t;
}
var Z2 = Object.defineProperty, q2 = (s, e, t) => e in s ? Z2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Zo = (s, e, t) => q2(s, typeof e != "symbol" ? e + "" : e, t);
class K2 extends Cc {
  constructor() {
    super(), Zo(this, "info", {
      version: "2.0.0",
      description: "Vector Tile Texture Loader (Refactored)"
    }), Zo(this, "dataType", "mvt"), Zo(this, "_loader", new wi(We.manager)), Zo(this, "_render", new kM()), this._loader.setResponseType("arraybuffer");
  }
  /**
   * Override load to handle custom MVT loading logic
   * 重写 load 以处理自定义 MVT 加载逻辑
   */
  async performLoad(e, t) {
    const n = await this._loader.loadAsync(e), i = new C2(new D2(n)), o = t.source.paint, l = this.drawTile(i, o, t.z);
    return new Fs(l);
  }
  /**
   * Draw tile to OffscreenCanvas
   * 在离屏画布上绘制瓦片
   */
  drawTile(e, t, n) {
    const l = new OffscreenCanvas(256, 256), c = l.getContext("2d");
    if (!c)
      throw new Error("Canvas context is not available");
    if (t)
      for (const u in t.layer) {
        const f = t.layer[u];
        if (n < (f.minLevel ?? 1) || n > (f.maxLevel ?? 20))
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
  _renderLayer(e, t, n, i = 1) {
    e.save();
    for (let o = 0; o < t.length; o++) {
      const l = t.feature(o);
      this._renderFeature(e, l, n, i);
    }
    e.restore();
  }
  _renderFeature(e, t, n = {}, i = 1) {
    const o = [
      nt.Unknown,
      nt.Point,
      nt.Linestring,
      nt.Polygon
    ][t.type], l = {
      geometry: t.loadGeometry(),
      properties: t.properties
    };
    this._render.render(e, o, l, n, i);
  }
  // #region GeoJSON Conversion Utilities (Preserved functionality)
  /**
   * Convert Vector Tile to GeoJSON FeatureCollection
   * 将整个矢量瓦片转换为 GeoJSON FeatureCollection
   */
  convertVectorTileToGeoJSON(e) {
    const t = [];
    for (const n in e.layers) {
      const i = e.layers[n];
      for (let o = 0; o < i.length; o++) {
        const l = i.feature(o), c = [
          nt.Unknown,
          nt.Point,
          nt.Linestring,
          nt.Polygon,
          nt.Unknown
        ][l.type], u = {
          geometry: l.loadGeometry(),
          properties: l.properties
        }, f = this._convertToGeoJSONFeature(u, c);
        f && (f.properties._layer = n, t.push(f));
      }
    }
    return {
      type: "FeatureCollection",
      features: t
    };
  }
  _convertToGeoJSONFeature(e, t) {
    const n = this._convertGeometryToGeoJSON(e.geometry, t);
    return n ? {
      type: "Feature",
      geometry: n,
      properties: e.properties || {},
      id: e.id
    } : null;
  }
  _convertGeometryToGeoJSON(e, t) {
    switch (t) {
      case nt.Point:
        return this._convertPointGeometry(e);
      case nt.Linestring:
        return this._convertLineGeometry(e);
      case nt.Polygon:
        return this._convertPolygonGeometry(e);
      default:
        return console.warn("Unknown geometry type:", t), null;
    }
  }
  _convertPointGeometry(e) {
    const t = [];
    for (const n of e)
      for (const i of n)
        t.push([i.x, i.y]);
    return t.length === 0 ? null : t.length === 1 ? { type: "Point", coordinates: t[0] } : { type: "MultiPoint", coordinates: t };
  }
  _convertLineGeometry(e) {
    const t = [];
    for (const n of e) {
      const i = [];
      for (const o of n)
        i.push([o.x, o.y]);
      i.length >= 2 && t.push(i);
    }
    return t.length === 0 ? null : t.length === 1 ? { type: "LineString", coordinates: t[0] } : { type: "MultiLineString", coordinates: t };
  }
  _convertPolygonGeometry(e) {
    const t = [];
    let n = [];
    for (const i of e) {
      const o = [];
      for (const l of i)
        o.push([l.x, l.y]);
      o.length >= 4 && (this._isRingClockwise(o) || n.length === 0 ? (n.length > 0 && t.push(n), n = [o]) : n.push(o));
    }
    return n.length > 0 && t.push(n), t.length === 0 ? null : t.length === 1 ? { type: "Polygon", coordinates: t[0] } : { type: "MultiPolygon", coordinates: t };
  }
  _isRingClockwise(e) {
    let t = 0;
    for (let n = 0; n < e.length - 1; n++) {
      const [i, o] = e[n], [l, c] = e[n + 1];
      t += (l - i) * (c + o);
    }
    return t > 0;
  }
  // #endregion
}
var Q2 = Object.defineProperty, J2 = (s, e, t) => e in s ? Q2(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Zl = (s, e, t) => J2(s, typeof e != "symbol" ? e + "" : e, t);
class eA extends Cc {
  constructor() {
    super(...arguments), Zl(this, "info", {
      version: "1.0.0",
      description: "Loader for standard web images (XYZ tiles)."
    }), Zl(this, "dataType", "image"), Zl(this, "loader", new Md(We.manager));
  }
  /**
   * 执行加载
   * @param url 
   * @param context 
   */
  async performLoad(e, t) {
    const n = await this.loader.loadAsync(e).catch(() => new Image(1, 1)), i = new Br();
    i.colorSpace = oa;
    const { bounds: o } = t;
    return o[2] - o[0] < 1 || o[3] - o[1] < 1 ? i.image = this.extractSubImage(n, o) : i.image = n, i.needsUpdate = !0, i;
  }
  /**
   * 提取子图像
   * @param image 
   * @param bounds 
   */
  extractSubImage(e, t) {
    const n = e.width, i = new OffscreenCanvas(n, n), o = i.getContext("2d"), { sx: l, sy: c, sw: u, sh: f } = da.getBoundsCoord(t, n);
    return o.drawImage(e, l, c, u, f, 0, 0, n, n), i;
  }
}
function tA() {
  We.registerMaterialLoader(new eA()), We.registerMaterialLoader(new K2()), We.registerGeometryLoader(new _2()), We.registerGeometryLoader(new u2()), We.registerMeshLoader(new x2()), console.log("[TileLoaderFactory] Default loaders registered.");
}
var nA = Object.defineProperty, iA = (s, e, t) => e in s ? nA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, $i = (s, e, t) => iA(s, typeof e != "symbol" ? e + "" : e, t);
class Jf extends lp {
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
    if (super(e, t), $i(this, "layerType", "vector"), $i(this, "_tileDataMap", /* @__PURE__ */ new Map()), $i(this, "_renderer"), $i(this, "_style"), $i(this, "_feaList", []), $i(this, "_collision", !1), $i(this, "_renderAltitude", 0), !t.style)
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
    const e = new Oc();
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
      const n = t.tile;
      e(n);
    }), this._rootTile.traverse((t) => {
      t.isTile && e(t);
    });
  }
  _addShownListenerToTile(e) {
    const t = (n) => {
      const i = n.tile, o = `${i.z}-${i.x}-${i.y}`, l = !!this._renderer, c = this._tileDataMap.get(o);
      l && c && this._renderer.processTileData(i, c.data);
    };
    e.addEventListener("tile-shown", t);
  }
  _addUnloadListenerToTile(e) {
    const t = (n) => {
      const i = n.tile || n.target, o = `${i.z}-${i.x}-${i.y}`;
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
    const t = (n) => {
      const i = n.tile, o = `${i.z}-${i.x}-${i.y}`;
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
      const t = e.tile, n = `${t.z}-${t.x}-${t.y}`, i = this.getVectorDataFromTile(t);
      if (!i) {
        console.warn(`[VectorTileLayer] Tile ${n} loaded but has no vector data.`);
        return;
      }
      if (i.vectorData?.dataFormat === "mvt" && this._tileDataMap.set(n, {
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
        const n = `${t.z}-${t.x}-${t.y}`, i = this._tileDataMap.get(n);
        i && e.push({
          tileKey: n,
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
  getVectorData(e, t, n) {
    const i = `${n}-${e}-${t}`, o = this._tileDataMap.get(i);
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
var rA = Object.defineProperty, sA = (s, e, t) => e in s ? rA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, oA = (s, e, t) => sA(s, e + "", t);
class gp {
  /**
   * 构造函数
   * @param centralMeridian 中央经线，默认为 0
   */
  constructor(e = 0) {
    oA(this, "_centralMeridian", 0), this._centralMeridian = e;
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
    const n = Math.pow(2, t), i = Math.round(n / 360 * this._centralMeridian);
    let o = e + i;
    return o >= n ? o -= n : o < 0 && (o += n), o;
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
  getTileOrigin(e, t, n) {
    const i = Math.pow(2, n), o = this.mapWidth, l = this.mapHeight / 2, c = e / i * o - o / 2, u = l - t / i * this.mapHeight;
    return { x: c, y: u };
  }
  /**
   * 获取经纬度范围的投影坐标边界
   */
  getProjectedBoundsFromGeoBounds(e) {
    const [t, n, i, o] = e, l = this.forward(t, n), c = this.forward(i, o);
    return [l.x, l.y, c.x, c.y];
  }
  /**
   * 获取瓦片的投影坐标边界
   */
  getTileProjectedBounds(e, t, n) {
    const i = this.getTileOrigin(e, t, n), o = this.getTileOrigin(e + 1, t + 1, n);
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
  getTileGeoBounds(e, t, n) {
    const [i, o, l, c] = this.getTileProjectedBounds(e, t, n), u = this.inverse(i, o), f = this.inverse(l, c);
    return [
      Math.min(u.lon, f.lon),
      Math.min(u.lat, f.lat),
      Math.max(u.lon, f.lon),
      Math.max(u.lat, f.lat)
    ];
  }
}
var aA = Object.defineProperty, lA = (s, e, t) => e in s ? aA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ss = (s, e, t) => lA(s, typeof e != "symbol" ? e + "" : e, t);
const _p = class Jo extends gp {
  constructor(e = 0) {
    super(e), Ss(this, "ID", "3857"), Ss(this, "mapWidth", 2 * Math.PI * Jo.LEGACY_EARTH_RADIUS), Ss(this, "mapHeight", this.mapWidth), Ss(this, "mapDepth", 1);
  }
  forward(e, t) {
    const n = Math.PI / 180, i = Jo.LEGACY_EARTH_RADIUS, o = (e - this.centralMeridian) * n, l = t * n, c = i * o, u = i * Math.log(Math.tan(Math.PI / 4 + l / 2));
    return { x: c, y: u };
  }
  inverse(e, t) {
    const n = 180 / Math.PI, i = Jo.LEGACY_EARTH_RADIUS;
    let o = e / i * n + this.centralMeridian;
    o > 180 && (o -= 360), o < -180 && (o += 360);
    const c = (2 * Math.atan(Math.exp(t / i)) - Math.PI / 2) * n;
    return { lon: o, lat: c };
  }
};
Ss(_p, "LEGACY_EARTH_RADIUS", 6378e3);
let yp = _p;
var cA = Object.defineProperty, uA = (s, e, t) => e in s ? cA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ms = (s, e, t) => uA(s, typeof e != "symbol" ? e + "" : e, t);
const vp = class Xi extends gp {
  constructor(e = 0) {
    super(e), Ms(this, "ID", "4326"), Ms(this, "mapWidth", 360 * Xi.SCALE_FACTOR), Ms(this, "mapHeight", 180 * Xi.SCALE_FACTOR), Ms(this, "mapDepth", 1);
  }
  forward(e, t) {
    return {
      x: (e - this.centralMeridian) * Xi.SCALE_FACTOR,
      y: t * Xi.SCALE_FACTOR
    };
  }
  inverse(e, t) {
    return {
      lon: e / Xi.SCALE_FACTOR + this.centralMeridian,
      lat: t / Xi.SCALE_FACTOR
    };
  }
};
Ms(vp, "SCALE_FACTOR", 100);
let hA = vp;
class _P {
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
        return new yp(t);
      case "4326":
        return new hA(t);
      default:
        throw new Error(`[ProjectionFactory] Unsupported projection type: ${e}`);
    }
  }
}
var fA = Object.defineProperty, dA = (s, e, t) => e in s ? fA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Pe = (s, e, t) => dA(s, typeof e != "symbol" ? e + "" : e, t);
class pA {
  constructor(...e) {
  }
  // Allow receiving any arguments 允许接收任意参数
}
const mA = {};
let Nr = class wp extends Tc(
  Ti(
    ir(pA)
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
    xc(e, "container", "Map container element must be specified"), mc(t, "state"), mc(t.state, "center");
    const n = {
      renderer: {
        antialias: !0,
        stencil: !0,
        logarithmicDepthBuffer: !0
      },
      camera: {},
      interaction: {},
      source: {}
    }, i = {
      ...t,
      renderer: { ...n.renderer, ...t.renderer },
      camera: { ...n.camera, ...t.camera },
      interaction: { ...n.interaction, ...t.interaction },
      source: { ...n.source, ...t.source }
    };
    super(i), Pe(this, "sceneRenderer"), Pe(this, "_rootGroup", new Qt()), Pe(this, "_layers", new globalThis.Map()), Pe(this, "_mapProjection", new yp(0)), Pe(this, "_animationClock", new ia()), Pe(this, "autoUpdate", !0), Pe(this, "updateInterval", 100), Pe(this, "minLevel", 2), Pe(this, "maxLevel", 19), Pe(this, "center"), Pe(this, "prjcenter"), Pe(this, "_layerContainer"), Pe(this, "_eventState", {
      load: { listened: !1 }
      // Load event parameters 加载事件参数
    }), Pe(this, "_canvasMgr", new iS()), Pe(this, "_collisionEngine"), Pe(this, "_onLoadHooks"), Pe(this, "_minZoom", 0), Pe(this, "_maxZoom", 22), Pe(this, "_ZOOM_MIN_CONST", 0), Pe(this, "_ZOOM_MAX_CONST", 22), Pe(this, "_minZoomDistance", 500), Pe(this, "_maxZoomDistance", 8e4), Pe(this, "_isZooming", !1), Pe(this, "_zoomStartValue", 0), Pe(this, "_lastZoomForControls", 0), Pe(this, "_overZoom", 0), Pe(this, "_lastCameraDistance", 0), this.initMap(i.source ?? {}), tA(), this.center = this.options.state.center, this.sceneRenderer = new Qx(e, { ...i.renderer, map: this }), this._rootGroup.receiveShadow = !0, this._rootGroup.up.set(0, 0, 1), this._rootGroup.rotation.x = -Math.PI / 2, this.sceneRenderer.scene.add(this._rootGroup), this.sceneRenderer._updateDefaultGroundPosition();
    const o = this.lngLatToWorld(new D(this.center[0], this.center[1], 0));
    this.prjcenter = o, this.sceneRenderer.on("update", () => {
      this.render(this.sceneRenderer.camera);
    });
    const l = this.options.camera ?? {};
    this.sceneRenderer.easeTo({
      center: this.center,
      distance: typeof this.center[2] == "number" ? this.center[2] : void 0,
      // Use pitch/bearing in degrees from camera options
      pitch: typeof l.pitch == "number" ? l.pitch : void 0,
      bearing: typeof l.bearing == "number" ? l.bearing : void 0,
      duration: 0,
      curvePath: !1
    }), this._minZoomDistance = this.sceneRenderer.controls.minDistance, this._maxZoomDistance = this.sceneRenderer.controls.maxDistance;
    const c = this._getCameraDistance();
    this._lastCameraDistance = c, this._layerGroup = new JT(), this.sceneRenderer.scene.add(this._layerGroup);
    const u = this.sceneRenderer.controls;
    this._minZoomDistance = typeof u?.minDistance == "number" ? u.minDistance : 500, this._maxZoomDistance = typeof u?.maxDistance == "number" ? u.maxDistance : 8e4;
    const p = this.getLayers().find((g) => g.isBaseLayer === !0)?.minLevel ?? this.minLevel;
    this._minZoom = Math.max(this._ZOOM_MIN_CONST, Math.min(this._ZOOM_MAX_CONST, p)), this._maxZoom = this._ZOOM_MAX_CONST;
    const d = this.getZoom();
    this._lastZoomForControls = d, this._zoomStartValue = d, this._collisionEngine = new DS(this.sceneRenderer.renderer, {
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
    }), this.on("viewchange", BS.debounce((g) => {
      if (!this._rootGroup || !this._collisionEngine)
        return;
      const y = this.getTileZoom(), T = this.getLayers().find((G) => G.isBaseLayer === !0)?.maxLevel ?? this.maxLevel, b = this._getCameraDistance(), L = b - this._lastCameraDistance;
      this._lastCameraDistance = b;
      const { max: M } = this._getViewZoomRange(), A = Math.max(0, M - T);
      y < T ? this._overZoom = 0 : L < -1e-3 ? this._overZoom = Math.min(this._overZoom + 1, A) : L > 1e-3 && (this._overZoom = Math.max(this._overZoom - 1, 0));
      const R = this.getZoom();
      Math.abs(R - this._lastZoomForControls) > 1e-3 && (this._isZooming ? this.fire("zoom", {
        from: this._zoomStartValue,
        to: R
      }) : (this._isZooming = !0, this._zoomStartValue = this._lastZoomForControls, this.fire("zoomstart", {
        from: this._zoomStartValue,
        to: R
      })), this._lastZoomForControls = R), this._collisionEngine.update(g.camera);
    }, 10, {
      leading: !1,
      trailing: !0
    })), this.on("moveend", () => {
      this._isZooming && (this._isZooming = !1, this.fire("zoomend", {
        from: this._zoomStartValue,
        to: this.getZoom()
        // View zoom at end 结束时的视图 zoom
      }));
    }), this._callOnLoadHooks(), this._updateDefaultGroundVisibility();
  }
  get projection() {
    return this._mapProjection;
  }
  get lon0() {
    return this.projection.centralMeridian;
  }
  /**
  * Convert geographic coordinate to map model coordinate
  * 地理坐标转换到地图模型坐标
  * @param lngLat Geographic coordinate (Long, Lat, Alt)
  * @returns Map model coordinate
  */
  lngLatToPoint(e) {
    const t = this.projection.forward(e.x, e.y);
    return new D(t.x, t.y, e.z);
  }
  /**
   * Convert geographic coordinate to world coordinate
   * 地理坐标转换到世界坐标
   * @param lngLat Geographic coordinate (Long, Lat, Alt)
   * @returns World coordinate
   */
  lngLatToWorld(e) {
    return this._rootGroup.localToWorld(this.lngLatToPoint(e));
  }
  /**
   * Convert map model coordinate to geographic coordinate
   * 地图模型坐标转换到地理坐标
   * @param point Map model coordinate
   * @returns Geographic coordinate (Long, Lat, Alt)
   */
  pointToLngLat(e) {
    const t = this.projection.inverse(e.x, e.y);
    return new D(t.lon, t.lat, e.z);
  }
  /**
   * Convert world coordinate to geographic coordinate
   * 世界坐标转换到地理坐标
   * @param worldPos World coordinate
   * @returns Geographic coordinate (Long, Lat, Alt)
   */
  worldToLngLat(e) {
    return this.pointToLngLat(this._rootGroup.worldToLocal(e.clone()));
  }
  /**
   * Query intersection info at geographic coordinate
   * 查询指定地理坐标的交互/地面信息
   * @param lngLat Geographic coordinate
   * @returns Intersection info
   */
  queryAtLngLat(e) {
    const t = this.lngLatToWorld(e);
    return ac(this, t);
  }
  /**
   * Query intersection info at world coordinate
   * 查询指定世界坐标的交互/地面信息
   * @param worldPos World coordinate
   * @returns Intersection info
   */
  queryAtWorld(e) {
    return ac(this, e);
  }
  /**
   * Query intersection info at screen pixel coordinate
   * 查询指定屏幕坐标的交互/地面信息
   * @param point Screen pixel coordinate
   * @returns Intersection info
   */
  queryAtPoint(e) {
    return Ld(this.sceneRenderer.camera, this, e);
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
    const n = typeof e == "function" ? e : function() {
      this[e].apply(this, t);
    }, i = this.prototype;
    return i._onLoadHooks = i._onLoadHooks || [], i._onLoadHooks.push(n), this;
  }
  /**
   * Internal method: Call all load hook functions.
   * 内部方法:调用所有加载钩子函数
   */
  _callOnLoadHooks() {
    const e = wp.prototype;
    if (e._onLoadHooks)
      for (let t = 0, n = e._onLoadHooks.length; t < n; t++)
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
    const e = this.getTileZoom(), n = this.getLayers().find((i) => i.isBaseLayer === !0)?.maxLevel ?? this.maxLevel;
    return e < n ? e : n + this._overZoom;
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
  getTileZoom() {
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
  setZoomBounds(e, t) {
    if (e > t) {
      const i = e;
      e = t, t = i;
    }
    this._minZoom = e, this._maxZoom = t;
    const n = this.sceneRenderer.controls;
    if (n) {
      const i = this._computeDistanceFromZoom(this._maxZoom), o = this._computeDistanceFromZoom(this._minZoom);
      n.minDistance = i, n.maxDistance = o;
    }
    return this;
  }
  /**
   * Set minimum zoom level.
   * 设置最小缩放级别
   */
  setMinZoom(e) {
    return this.setZoomBounds(e, this._maxZoom);
  }
  /**
   * Set maximum zoom level.
   * 设置最大缩放级别
   */
  setMaxZoom(e) {
    return this.setZoomBounds(this._minZoom, e);
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
    const t = this.getMinZoom(), n = this.getMaxZoom(), i = Math.max(t, Math.min(n, e)), o = this.getZoom(), l = this._computeDistanceFromZoom(i), c = this.sceneRenderer.controls, u = c?.target ?? this.prjcenter, f = this.sceneRenderer.camera, p = f.position.clone().sub(u).normalize();
    return f.position.copy(u).addScaledVector(p, l), f.updateProjectionMatrix(), typeof c?.update == "function" && c.update(), this._lastZoomForControls = i, this.fire("zoomend", {
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
    const t = this._ZOOM_MIN_CONST, n = this._ZOOM_MAX_CONST, i = this._minZoomDistance, o = this._maxZoomDistance;
    if (i <= 0 || i >= o) {
      const p = Math.max(t, Math.min(n, e)), d = (n - p) / (n - t);
      return i + d * (o - i);
    }
    const c = (Math.max(t, Math.min(n, e)) - t) / (n - t), u = i / o;
    return o * Math.pow(u, c);
  }
  /**
   * Initialize map.
   * 初始化地图
   */
  initMap(e) {
    if (this.minLevel = e.minLevel ?? 2, this.maxLevel = e.maxLevel ?? 19, e.baseLayers?.length)
      for (const t of e.baseLayers)
        t.isBaseLayer = !0, this.addTileLayer(t);
    else
      this._updateDefaultGroundVisibility();
    setTimeout(() => {
      const t = {
        timestamp: Hx(),
        target: this
      };
      this._eventState.load = {
        listened: !0
      }, this.fire("load", t);
    }, 0);
  }
  /**
   * Update default ground plane visibility based on tile layers.
   * 根据瓦片图层更新默认地面可见性
   * 
   * @description
   * Shows the default ground plane when no tile layers are present,
   * hides it when at least one tile layer exists.
   * 当没有瓦片图层时显示默认地面，当存在至少一个瓦片图层时隐藏。
   * 
   * @internal
   */
  _updateDefaultGroundVisibility() {
    if (!this.sceneRenderer)
      return;
    this._layers.size > 0 ? this.sceneRenderer.hideDefaultGround() : this.sceneRenderer.showDefaultGround();
  }
  /**
   * Show or hide the default ground plane manually.
   * 手动显示或隐藏默认地面
   * 
   * @param visible - Whether to show the ground plane. 是否显示地面
   * @returns Current map instance. 当前地图实例
   */
  setGroundVisible(e) {
    return e ? this.sceneRenderer.showDefaultGround() : this.sceneRenderer.hideDefaultGround(), this;
  }
  /**
   * Check if the default ground plane is visible.
   * 检查默认地面是否可见
   * 
   * @returns Whether the ground is visible. 地面是否可见
   */
  isGroundVisible() {
    return this.sceneRenderer.isDefaultGroundVisible();
  }
  /**
   * Update map and layers.
   * 更新地图和图层
   */
  render(e) {
    if (!this.autoUpdate) return;
    this._animationClock.getElapsedTime() > this.updateInterval / 1e3 && (this._layers.forEach((n) => {
      n.enabled && n.visible && n.update(e);
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
    for (let n = 0, i = e.length; n < i; n++) {
      const o = e[n], l = o.getId();
      if (jd(l))
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
      if (t instanceof Jf) {
        const i = t._getRenderer();
        i && this._layerGroup.remove(i);
      }
      return this._layers.delete(e), this._rootGroup.remove(t), this._updateDefaultGroundVisibility(), !0;
    }
    const n = this._layerGroup.getLayerById(e);
    return n ? (this._layerContainer.remove(n), n instanceof bi && n?._collision, !0) : (console.warn(`⚠️ Layer does not exist 图层不存在: ${e}`), !1);
  }
  /**
   * Add regular layer (Add to scene only).
   * 添加普通图层（只添加到场景）
   */
  addRegularLayer(e) {
    this._layerGroup.add(e), e._bindMap(this), e instanceof bi && e?._collision && (this._collisionEngine.registerLayer(e), e.setCollisionEngine(this._collisionEngine));
  }
  // addTileLayer(layer: ITileLayer) {   
  //     this.tileLayerManager.addLayer(layer);
  // }
  /**
  * Add tile layer.
  * 添加瓦片图层
  */
  addTileLayer(e) {
    if (this._layers.set(e.getId(), e), this._rootGroup.add(e), e._bindMap(this), this._updateDefaultGroundVisibility(), e instanceof Jf) {
      const t = e.options || {}, n = new Xl(e.getId() + "-vtrender", {
        altitude: e.getAltitude(),
        paint: e.getPaint(),
        collision: e._collision,
        // Let render layer inherit vector tile layer's zIndex / depthOffset
        // 让渲染层继承矢量瓦片图层的 zIndex / depthOffset
        zIndex: typeof t.zIndex == "number" ? t.zIndex : void 0,
        depthOffset: typeof t.depthOffset == "number" ? t.depthOffset : void 0
      });
      e._setRenderer(n), this.addRegularLayer(n);
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
    }), this._layers.clear(), this._updateDefaultGroundVisibility(), this;
  }
  /**
   * Get all layers.
   * 获取所有图层
   * 
   * @returns Array of layers
   *          图层数组
   */
  getLayers() {
    const e = this._layerGroup.getLayers().filter((n) => !(n instanceof Xl)), t = Array.from(this._layers.values());
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
  getLayer(e) {
    if (this._layers.has(e))
      return this._layers.get(e);
    const t = this._layerGroup.getLayerById(e);
    if (t)
      return t instanceof Xl ? void 0 : t;
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
  _getCanvas(e = 40, t = 30, n) {
    return this._canvasMgr.getCanvas(e, t, 1, n);
  }
  /**
   * Get map container.
   * 获取地图容器
   * 
   * @returns Map container instance
   *          地图容器实例
   */
  getContainer() {
    return this.sceneRenderer.container;
  }
  /**
   * Get renderer.
   * 获取渲染器
   * 
   * @returns Renderer instance
   *          渲染器实例
   */
  getRenderer() {
    return this.sceneRenderer.renderer;
  }
  /**
   * Get camera.
   * 获取相机
   * 
   * @returns Camera instance
   *          相机实例
   */
  getCamera() {
    return this.sceneRenderer.camera;
  }
  /**
   * Find all Features at a specific position.
   * 找出某位置的所有Feature
   */
  _queryFeaturesAt(e) {
    const t = this, n = t.getRenderer(), i = t.getCamera(), o = n.domElement.getBoundingClientRect(), l = e.x / o.width * 2 - 1, c = -(e.y / o.height) * 2 + 1, u = new Es();
    u.setFromCamera(new ce(l, c), i);
    const f = t.getLayers().filter(
      (g) => !g?.isSceneLayer && g?.visible === !0
    ), d = u.intersectObjects(f, !0).map((g) => {
      let y = g.object, x = null;
      for (; y; ) {
        if (y instanceof gt) {
          x = y;
          break;
        }
        y = y.parent;
      }
      return !x || x.visible === !1 ? null : {
        feature: x,
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
    const e = this.sceneRenderer.controls.target.clone(), t = this.worldToLngLat(e);
    return [t.x, t.y, t.z];
  }
  /**
   * Get event position (Screen coordinates).
   * 获取事件位置（屏幕坐标）
   */
  _getPointerPosition(e) {
    let t, n;
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      t = e.touches[0].clientX, n = e.touches[0].clientY;
    } else
      t = e.clientX, n = e.clientY;
    const i = this.getContainer();
    if (!i) return null;
    const o = i.getBoundingClientRect();
    return {
      x: t - o.left,
      y: n - o.top
    };
  }
  get isInteracting() {
    return this.sceneRenderer ? this.sceneRenderer.isInteracting : !1;
  }
  /**
   * Internal tool: Get distance from current camera to target point.
   * 内部工具：获取当前相机到目标点的距离
   */
  _getCameraDistance() {
    const e = this.sceneRenderer.controls, t = this.sceneRenderer.camera, n = e?.target ?? this.prjcenter;
    return e && typeof e.getDistance == "function" ? e.getDistance() : t.position.distanceTo(n);
  }
  /**
   * Internal tool: Calculate theoretically reachable zoom range of view based on current control distance limits.
   * 内部工具：根据当前控制器的距离限制，推算视图理论可达的 zoom 区间
   * 
   * @returns {Object} `{ min: number, max: number }`
   */
  _getViewZoomRange() {
    const e = this.sceneRenderer.controls, t = typeof e?.minDistance == "number" ? e.minDistance : this._minZoomDistance, n = typeof e?.maxDistance == "number" ? e.maxDistance : this._maxZoomDistance;
    if (t <= 0 || t >= n) {
      const d = this.getTileZoom();
      return { min: d, max: d };
    }
    const i = n / t, o = Math.log2(i), l = this.getLayers().find((d) => d.isBaseLayer === !0), c = l?.minLevel ?? this.minLevel, u = l?.maxLevel ?? this.maxLevel, f = c, p = u + o;
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
    this.sceneRenderer.flyToAdvanced(e);
  }
  /**
   * Fly to point position.
   * 飞行到指定点的位置
   * 
   * @param flyConfig Flight parameters object
   *                飞行参数对象
   */
  easeTo(e) {
    this.sceneRenderer.flyToPoint(e);
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
   * 4. Destroy sceneRenderer (including renderer, scene, controls, etc.)
   * 5. Clean up DOM container
   * 
   * 该方法会清理以下资源：
   * 1. 移除所有事件监听器
   * 2. 清空所有图层
   * 3. 销毁碰撞引擎
   * 4. 销毁sceneRenderer（包括renderer、scene、controls等）
   * 5. 清理DOM容器
   */
  dispose() {
    try {
      this._clearHandlers(), ["viewchange", "movestart", "moveend", "zoomstart", "zoom", "zoomend", "load"].forEach((t) => {
        const n = this._listenerMap?.get(t);
        n && n.forEach((i, o) => {
          this.off(t, o);
        });
      }), this.clearLayers(), qd.getInstance().clearCache(), this._collisionEngine && (this._collisionEngine = null), this._layerGroup && (this._layerGroup.clear(), this._layerGroup = null), this._canvasMgr && (this._canvasMgr = null), this.sceneRenderer && (this.sceneRenderer.destroy(), this.sceneRenderer = null), this._eventState = {
        load: { listened: !1 }
      };
    } catch (e) {
      console.error("Error destroying map 销毁地图时出错:", e);
    }
  }
};
Nr.mergeOptions(mA);
const gA = [
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
Nr.prototype._removeDomEvents = function() {
};
Nr.prototype._registerDomEvents = function() {
  const s = this.sceneRenderer.container;
  if (s) {
    let t = null;
    gA.forEach((n) => {
      s.addEventListener(n, (i) => {
        if (!this.sceneRenderer)
          return;
        if (n === "mousedown" && (t = {
          x: i.clientX,
          y: i.clientY
        }), n === "click" && t) {
          const c = i.clientX - t.x, u = i.clientY - t.y;
          if (Math.sqrt(c * c + u * u) > 5)
            return;
        }
        let o = Ec(i, this, this.sceneRenderer.camera), l = {
          target: this,
          originEvent: i,
          eventName: n,
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
            eventName: n,
            screenXY: {
              X: i.screenX,
              Y: i.screenY
            }
          };
        }
        this.fire(n, l);
      });
    });
  }
};
Nr.addOnLoadHook("_registerDomEvents");
var _A = Object.defineProperty, yA = (s, e, t) => e in s ? _A(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ql = (s, e, t) => yA(s, typeof e != "symbol" ? e + "" : e, t);
const vA = [
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
class wA extends ua {
  constructor() {
    super(...arguments), ql(this, "_registeredEvents", []), ql(this, "_mouseDownTime", 0), ql(this, "_eventCommon", (e) => {
      (e.type === "mousedown" || e.type === "touchstart") && (this._mouseDownTime = Date.now()), !(e.type === "click" && Date.now() - this._mouseDownTime > 300) && this._handleEvent(e, e.type);
    });
  }
  /**
   * Add event hooks.
   * 添加事件钩子。
   */
  addHooks() {
    const t = this.target.getContainer();
    t && vA.forEach((n) => {
      t.addEventListener(n, this._eventCommon), this._registeredEvents.push(n);
    });
  }
  /**
   * Remove event hooks.
   * 移除事件钩子。
   */
  removeHooks() {
    const t = this.target.getContainer();
    t && this._registeredEvents.length > 0 && (this._registeredEvents.forEach((n) => {
      const i = n;
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
    const n = this.target;
    if (!n || !n.sceneRenderer || this._shouldIgnoreEvent(t) || (t === "mousemove" || t === "mouseenter" || t === "mouseleave" || t === "mouseover" || t === "mouseout" || t === "touchmove") && !n.getLayers().some((u) => !u.isSceneLayer && u._feaList?.length > 0))
      return;
    const i = n._getPointerPosition(e);
    if (!i) return;
    const o = n._queryFeaturesAt(i);
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
          c && c.fire("feature" + t, {
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
    const n = e.getLayer();
    n && n.fire("featureclick", {
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
    const n = e.getLayer();
    n && n.fire("feature" + t.type, {
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
  _fireFeatureEvent(e, t, n) {
    const i = this.target;
    if (!i || !i.sceneRenderer) return;
    let o = n, l, c;
    if ("touches" in n) {
      const d = n.touches[0] || n.changedTouches[0];
      if (!d) return;
      o = {
        currentTarget: n.currentTarget,
        clientX: d.clientX,
        clientY: d.clientY
      }, l = d.screenX, c = d.screenY;
    } else {
      const d = n;
      o = d, l = d.screenX, c = d.screenY;
    }
    const u = Ec(o, i, i.sceneRenderer.camera);
    if (!u) return;
    const f = [u.x, u.y, u.z], p = {
      target: e,
      originEvent: n,
      coordinate: f,
      eventName: t,
      screenXY: {
        X: l,
        Y: c
      }
    };
    e.fire(t, p);
  }
  // ============== Utility Methods 工具方法 ==============
  /**
   * Check if event should be ignored
   * 检查是否应该忽略该事件
   * @param eventType Event type for special judgment 事件类型，用于特殊判断
   */
  _shouldIgnoreEvent(e) {
    const t = this.target;
    return t.sceneRenderer ? e === "mousedown" || e === "touchstart" ? !1 : !!t.isInteracting : !0;
  }
}
Nr.mergeOptions({
  FeatureEvents: !0,
  onlyVisibleFeatureEvents: !0
});
Nr.addOnLoadHook("addHandler", "FeatureEvents", wA);
var bA = Object.defineProperty, xA = (s, e, t) => e in s ? bA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Mn = (s, e, t) => xA(s, typeof e != "symbol" ? e + "" : e, t);
let TA = class {
  constructor(...e) {
  }
};
const bp = class Lr extends Ti(
  ir(TA)
) {
  /**
   * @param options UI component options UI 组件配置
   */
  constructor(e = {}) {
    super(e), Mn(this, "_owner"), Mn(this, "_map"), Mn(this, "_worldPosition"), Mn(this, "_coordinate"), Mn(this, "_dom"), Mn(this, "_visible", !1), Mn(this, "_boundMapHandlers", /* @__PURE__ */ new Map()), Mn(this, "_sceneRendererUpdateHandler"), Mn(this, "_positionedOnce", !1);
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
    return t ? (this._map = t, this._bindMapEvents(!0), this.options.single && (Lr._singletons.forEach((n) => {
      n !== this && n.options.single && n._map === t && n.hide();
    }), Lr._singletons.add(this)), this.onAdd && this.onAdd(), this.fire("add", { owner: e, map: t }), this) : this;
  }
  /**
   * Remove UIComponent from owner Map / Feature.
   * 从所属 Map / Feature 移除 UIComponent
   */
  remove() {
    const e = this._map;
    return this.hideDom(), this._bindMapEvents(!1), this.options.single && Lr._singletons.delete(this), this.onRemove && this.onRemove(), this.fire("remove", { owner: this._owner, map: e }), this._owner = void 0, this._map = void 0, this;
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
    if (this._map = t, this.options.single && (Lr._singletons.forEach((n) => {
      n !== this && n.options.single && n._map === t && n.isVisible() && n.hide();
    }), Lr._singletons.add(this)), !this._dom) {
      const n = this.buildOn();
      this._dom = n, n.style.position = "absolute", typeof this.options.zIndex == "number" && (n.style.zIndex = String(this.options.zIndex));
      const i = t.getContainer();
      if (!i)
        return this;
      i.appendChild(n);
    }
    return this._coordinate = e ? [...e] : void 0, this._visible = !0, this._positionedOnce = !1, this._dom && (this._dom.style.display = "none"), this.fire("show", { owner: this._owner, map: t }), this;
  }
  /**
   * Hide UIComponent (keep DOM, do not unbind).
   * 隐藏 UIComponent（保留 DOM，不解绑）
   */
  hide() {
    return this._visible = !1, this._dom && (this._dom.style.display = "none"), this._coordinate = void 0, this.fire("hide", { owner: this._owner, map: this._map }), this;
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
    const n = t, i = e ? "on" : "off", o = (l, c) => {
      e ? this._boundMapHandlers.set(l, c) : this._boundMapHandlers.delete(l);
    };
    if (e) {
      const l = () => {
        this._visible && this._refreshDomPosition();
      };
      n[i]("viewchange", l), o("viewchange", l);
      const c = t.sceneRenderer;
      if (c && !this._sceneRendererUpdateHandler) {
        const u = () => {
          this._visible && this._refreshDomPosition();
        };
        this._sceneRendererUpdateHandler = u, c.addEventListener("update", u);
      }
    } else {
      this._boundMapHandlers.forEach((c, u) => {
        n[i](u, c);
      }), this._boundMapHandlers.clear();
      const l = t.sceneRenderer;
      l && this._sceneRendererUpdateHandler && (l.removeEventListener("update", this._sceneRendererUpdateHandler), this._sceneRendererUpdateHandler = void 0);
    }
  }
  /**
   * Internal: Derive world position from geographic coordinate / owner.
   * Ensures unified use of map.lngLatToWorld to keep altitude / center units consistent.
   * 
   * 内部：根据地理坐标 / owner 推导世界坐标
   * 保证统一走 map.lngLatToWorld，从而保持 altitude / center 单位统一
   */
  _resolveWorldPosition() {
    const e = this._map;
    if (!e) return;
    if (this._coordinate) {
      const [n, i, o = 0] = this._coordinate, l = new D(n, i, o);
      return e.lngLatToWorld(l);
    }
    const t = this._owner;
    if (t && t._geometry) {
      const n = t._geometry;
      if (n && (n.type === "Point" || n.type === "MultiPoint")) {
        let i;
        if (n.type === "Point" ? i = n.coordinates : n.type === "MultiPoint" && Array.isArray(n.coordinates) && n.coordinates.length > 0 && (i = n.coordinates[0]), i && i.length >= 2) {
          const o = new D(
            i[0],
            i[1],
            i[2] ?? 0
          );
          return e.lngLatToWorld(o);
        }
      }
      if (t._renderObject && typeof t._renderObject.getWorldPosition == "function") {
        const i = new D();
        if (t._renderObject.getWorldPosition(i), !(i.x === 0 && i.y === 0 && i.z === 0))
          return i;
      }
      if (t._worldLngLatLikes instanceof D) {
        const i = t._worldLngLatLikes;
        if (!(i.x === 0 && i.y === 0 && i.z === 0))
          return i.clone();
      }
    }
    if (t && typeof t.getWorldPosition == "function") {
      const n = new D();
      return t.getWorldPosition(n), n;
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
    const e = this._map.sceneRenderer, t = e.camera, n = this._dom.style.display === "none";
    n && (this._dom.style.visibility = "hidden", this._dom.style.display = ""), t.updateMatrixWorld();
    const i = this._worldPosition.clone().project(t);
    if (i.x < -1.1 || i.x > 1.1 || i.y < -1.1 || i.y > 1.1 || i.z < -1 || i.z > 1) {
      this._dom.style.display = "none", n && (this._dom.style.visibility = "");
      return;
    }
    const o = (i.x * 0.5 + 0.5) * e.width, l = (-i.y * 0.5 + 0.5) * e.height, c = this.getOffset();
    if (this._dom.style.left = `${o + c.x}px`, this._dom.style.top = `${l + c.y}px`, n && (this._dom.style.visibility = ""), !this._positionedOnce) {
      this._positionedOnce = !0, this._dom.style.display = "none";
      return;
    }
    this._dom.style.display = "";
  }
};
Mn(bp, "_singletons", /* @__PURE__ */ new Set());
let Rc = bp;
var SA = Object.defineProperty, MA = (s, e, t) => e in s ? SA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ed = (s, e, t) => MA(s, typeof e != "symbol" ? e + "" : e, t);
class td extends Rc {
  /**
   * @param options InfoWindow options InfoWindow 配置
   */
  constructor(e) {
    super({
      single: !0,
      ...e
    }), ed(this, "_titleEl"), ed(this, "_contentEl");
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
    const n = document.createElement("div");
    n.className = "maporbis-infowindow-header";
    const i = document.createElement("div");
    i.className = "maporbis-infowindow-title", this.options.title && (i.textContent = this.options.title);
    const o = document.createElement("span");
    o.className = "maporbis-infowindow-close", o.innerHTML = "×", o.title = "关闭", o.addEventListener("click", (c) => {
      c.stopPropagation(), c.preventDefault(), this.close();
    }), o.addEventListener("mousedown", (c) => {
      c.preventDefault();
    }), o.style.cursor = "pointer", o.style.userSelect = "none", n.appendChild(i), n.appendChild(o);
    const l = document.createElement("div");
    return l.className = "maporbis-infowindow-content", this.options.content instanceof HTMLElement ? l.appendChild(this.options.content) : typeof this.options.content == "string" && (l.innerHTML = this.options.content), e.appendChild(n), e.appendChild(l), this._titleEl = i, this._contentEl = l, e;
  }
  getOffset() {
    const e = super.getOffset(), t = this._dom;
    if (!t)
      return e;
    const n = t.offsetWidth, i = t.offsetHeight, o = 10;
    let l = e.x - n / 2, c = e.y - i - o;
    const u = this._owner, f = this.getMap();
    if (u && typeof u.getStyle == "function" && f?.sceneRenderer) {
      const d = u.getStyle?.()?.config, g = d?.type;
      if (d && (g === "icon-point" || g === "icon-label-point")) {
        const y = Array.isArray(d.anchor) ? d.anchor : [0.5, 0.5], x = typeof y[1] == "number" ? y[1] : 0.5;
        let T = 0;
        const b = u._renderObject;
        if (b && b instanceof nr && (T = this._getSpriteScreenHeight(b, f.sceneRenderer)), T <= 0) {
          let L = 0;
          if (g === "icon-point") {
            const M = d.size;
            Array.isArray(M) ? L = M[1] : typeof M == "number" && (L = M);
          } else if (g === "icon-label-point") {
            const M = d.size ?? d.iconSize;
            Array.isArray(M) ? L = M[1] : typeof M == "number" && (L = M);
          }
          T = L * (1 - x);
        } else
          T = T * (1 - x);
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
      const n = t.camera, i = t.renderer;
      if (!n || !i) return 0;
      const o = t.height || i.domElement.clientHeight;
      if (!(e.material.sizeAttenuation !== !1)) {
        const k = n.projectionMatrix.elements[5];
        return e.scale.y * k * o / 2;
      }
      const u = new D();
      e.getWorldPosition(u);
      const f = n.position.clone(), p = u.clone().sub(f).normalize(), d = new D();
      d.crossVectors(n.up, p).normalize();
      const g = new D();
      g.crossVectors(p, d).normalize();
      const y = e.scale.y * (1 - e.center.y), x = e.scale.y * e.center.y, T = u.clone().add(g.clone().multiplyScalar(y)), b = u.clone().sub(g.clone().multiplyScalar(x)), L = T.clone().project(n), M = b.clone().project(n), A = (-L.y * 0.5 + 0.5) * o, R = (-M.y * 0.5 + 0.5) * o;
      return Math.abs(R - A);
    } catch (n) {
      return console.warn("Failed to calculate sprite screen height: // 计算 sprite 屏幕高度失败:", n), 0;
    }
  }
  /**
   * Set title.
   * 设置标题
   */
  setTitle(e) {
    return this.options.title = e, this._titleEl && (this._titleEl.textContent = e ?? ""), this;
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
    const t = this, n = () => {
      !t._dom || !t._map || !t._visible || (t._positionedOnce = !0, t._refreshDomPosition());
    }, o = this.getMap()?.sceneRenderer;
    if (o && typeof o.addEventListener == "function") {
      const l = () => {
        o.removeEventListener("update", l), n();
      };
      o.addEventListener("update", l);
    } else
      requestAnimationFrame(n);
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
    return s instanceof td ? e = s : e = new td(s), this._infoWindow = e, this.getMap() && e.addTo(this), this;
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
var AA = Object.defineProperty, PA = (s, e, t) => e in s ? AA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Kl = (s, e, t) => PA(s, typeof e != "symbol" ? e + "" : e, t);
class LA {
  constructor(...e) {
  }
}
class EA extends Ti(
  ir(LA)
) {
  /**
   * @param options 工具配置
   */
  constructor(e = {}) {
    super(e), Kl(this, "_map"), Kl(this, "_enabled", !1), Kl(this, "_boundHandlers", /* @__PURE__ */ new Map());
  }
  /**
   * 将工具添加到地图上，并自动启用。
   * 同一张 Map 上会保证只有一个激活的 MapTool。
   */
  addTo(e) {
    if (!e) return this;
    const t = e;
    return t._activeMapTool && t._activeMapTool !== this && t._activeMapTool.disable(), t._activeMapTool = this, this._map = e, this.onAdd && this.onAdd(), this.enable(), this.fire("add", { map: e }), this;
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
    return !this._map || this._enabled ? this : (this._enabled = !0, this._bindEvents(), this.onEnable && this.onEnable(), this.fire("enable", { map: this._map }), this);
  }
  /**
   * 禁用工具：解绑事件 + 调用 onDisable 钩子
   */
  disable() {
    return !this._map || !this._enabled ? this : (this._enabled = !1, this._unbindEvents(), this.onDisable && this.onDisable(), this.fire("disable", { map: this._map }), this);
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
    return e._activeMapTool === this && delete e._activeMapTool, this._map = void 0, this.fire("remove"), this;
  }
  /**
   * 内部：绑定 Map 事件
   */
  _bindEvents() {
    const e = this._map;
    if (!e) return;
    const t = this.getEvents() || {};
    Object.keys(t).forEach((n) => {
      const i = t[n];
      if (!i) return;
      const o = (l) => i.call(this, l);
      this._boundHandlers.set(n, o), e.on(n, o);
    });
  }
  /**
   * 内部：解绑 Map 事件
   */
  _unbindEvents() {
    const e = this._map;
    e && (this._boundHandlers.forEach((t, n) => {
      e.off(n, t);
    }), this._boundHandlers.clear());
  }
}
var CA = Object.defineProperty, OA = (s, e, t) => e in s ? CA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ps = (s, e, t) => OA(s, typeof e != "symbol" ? e + "" : e, t);
class RA extends bi {
  constructor(e) {
    super(e, { altitude: 1 });
  }
  validateFeature(e) {
    return !!e;
  }
}
const nd = {};
class zs extends EA {
  constructor(e) {
    super(e), ps(this, "_modeDef"), ps(this, "_clickCoords", []), ps(this, "_isDrawing", !1), ps(this, "_geometry"), ps(this, "_draftLayer"), this.options.once = this.options.once ?? !1, this._ensureMode();
  }
  /**
   * 注册一个绘制模式
   */
  static registerMode(e, t) {
    nd[e.toLowerCase()] = t;
  }
  /**
   * 获取已注册的模式
   */
  static getModeDefinition(e) {
    return nd[e.toLowerCase()];
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
  * Set drawing paint (only affects new drawings started after this call)
  * - geometryPaint: main geometry paint (point/line/fill)
  * - vertexPaint: vertex paint, pass null to disable anchor point rendering
  */
  setPaint(e) {
    return e.geometryPaint !== void 0 && (this.options.geometryPaint = e.geometryPaint), Object.prototype.hasOwnProperty.call(e, "vertexPaint") && (this.options.vertexPaint = e.vertexPaint ?? null), this;
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
    const e = this.getMode(), t = zs.getModeDefinition(e);
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
    const t = e.coordinate, n = this._modeDef, i = { ...e, drawTool: this };
    this._isDrawing ? (this._clickCoords.push(t), n.update(this._clickCoords, this._geometry, i), this.fire("drawvertex", {
      coordinate: t,
      geometry: this._geometry,
      coords: [...this._clickCoords],
      originEvent: i
    })) : (this._isDrawing = !0, this._clickCoords = [t], this._geometry = n.create(t, i), this.fire("drawstart", {
      coordinate: t,
      geometry: this._geometry,
      coords: [...this._clickCoords],
      originEvent: i
    })), n.clickLimit && this._clickCoords.length >= n.clickLimit && this._finishDrawing(i);
  }
  /**
   * 处理 mousemove 事件：
   * - 仅在绘制中才更新几何
   * - 不修改 _clickCoords，只用临时 coords 传给 update
   */
  _handleMouseMove(e) {
    if (!this._modeDef || !this._isDrawing || !e.coordinate) return;
    const t = this._modeDef, n = [...this._clickCoords, e.coordinate], i = { ...e, drawTool: this };
    t.update(n, this._geometry, i), this.fire("drawing", {
      coordinate: e.coordinate,
      geometry: this._geometry,
      coords: n,
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
    const n = this._modeDef.generate(this._geometry, [...this._clickCoords]);
    this.fire("drawend", {
      geometry: n,
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
    const t = `__draw_draft_${Date.now().toString(36)}`, n = new RA(t);
    return e.addLayer(n), this._draftLayer = n, n;
  }
  /**
  * 内部：销毁草图图层
  */
  _destroyDraftLayer() {
    const e = this.getMap();
    e && this._draftLayer && e.removeLayer(this._draftLayer.getId()), this._draftLayer = void 0;
  }
}
const DA = {
  actions: ["click", "mousemove"],
  create(s, e) {
    const t = e.drawTool, n = t._getOrCreateDraftLayer(), i = yi(
      t.options.geometryPaint,
      { type: "circle", size: 10, color: "#00ffff" }
    ), o = {
      type: "Point",
      coordinates: s
    }, l = new xi({
      geometry: o,
      paint: i
    });
    return l.addTo(n), l.initializeGeometry(), {
      tool: t,
      draftLayer: n,
      draftMarker: l
    };
  },
  update(s, e, t) {
    const n = e?.draftMarker;
    if (!n) return;
    const i = s[s.length - 1];
    n._geometry = {
      type: "Point",
      coordinates: i
    }, n._worldLngLatLikes = n._coordsTransform(), n._buildRenderObject && n._buildRenderObject();
  },
  generate(s, e) {
    const t = s.tool;
    if (!e.length) return null;
    s.draftMarker && (s.draftMarker._remove(), s.draftMarker = null);
    const n = yi(
      t.options.geometryPaint,
      { type: "basic-point", size: 10, color: "#00ffff" }
    ), i = e[e.length - 1];
    return new xi({
      geometry: {
        type: "Point",
        coordinates: i
      },
      paint: n
    });
  },
  clickLimit: 1
}, IA = {
  actions: ["click", "mousemove", "dblclick"],
  create(s, e) {
    const t = e.drawTool, n = t._getOrCreateDraftLayer(), i = yi(
      t.options.geometryPaint,
      { type: "basic-line", color: "#ff0000", width: 2 }
    ), o = t.options.vertexPaint === null ? void 0 : yi(
      t.options.vertexPaint,
      { type: "basic-point", size: 8, color: "#00ffff" }
    ), l = {
      type: "LineString",
      coordinates: [s]
    }, c = new Ft({
      geometry: l,
      paint: i
    });
    c.addTo(n);
    const u = [];
    if (o) {
      const f = {
        type: "Point",
        coordinates: s
      }, p = new xi({
        geometry: f,
        paint: o
      });
      p.addTo(n), u.push(p);
    }
    return {
      tool: t,
      draftLayer: n,
      draftLine: c,
      draftAnchors: u,
      linePaint: i,
      vertexPaint: o
    };
  },
  update(s, e, t) {
    if (!e) return;
    const n = e.draftLayer;
    if (!s || s.length < 2)
      return;
    e.draftLine && (e.draftLine._remove(), e.draftLine = null);
    const i = {
      type: "LineString",
      coordinates: s
    }, o = new Ft({
      geometry: i,
      paint: e.linePaint
    });
    if (o.addTo(n), e.draftLine = o, t.eventName === "click" && e.vertexPaint) {
      const c = {
        type: "Point",
        coordinates: s[s.length - 1]
      }, u = new xi({
        geometry: c,
        paint: e.vertexPaint
      });
      u.addTo(n), e.draftAnchors.push(u);
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
    const n = yi(
      t.options.geometryPaint,
      { type: "basic-line", color: "#ff0000", width: 2 }
    );
    return new Ft({
      geometry: {
        type: "LineString",
        coordinates: e
      },
      paint: n
    });
  }
}, FA = {
  actions: ["click", "mousemove", "dblclick"],
  create(s, e) {
    const t = e.drawTool, n = t._getOrCreateDraftLayer(), i = yi(
      t.options.geometryPaint,
      { type: "basic-polygon", color: "#00ff00", opacity: 0.5 }
    ), o = t.options.vertexPaint === null ? void 0 : yi(
      t.options.vertexPaint,
      { type: "basic-point", size: 8, color: "#00ffff" }
    ), l = [];
    if (o) {
      const c = {
        type: "Point",
        coordinates: s
      }, u = new xi({
        geometry: c,
        paint: o
      });
      u.addTo(n), u.initializeGeometry(), l.push(u);
    }
    return {
      tool: t,
      draftLayer: n,
      draftPolygon: null,
      // 草图面
      draftEdgeLine: null,
      // 点数<3时的草图边线
      draftAnchors: l,
      polygonPaint: i,
      vertexPaint: o
    };
  },
  update(s, e, t) {
    if (!e) return;
    const n = e.draftLayer;
    if (t.eventName === "click" && e.vertexPaint) {
      const p = {
        type: "Point",
        coordinates: s[s.length - 1]
      }, d = new xi({
        geometry: p,
        paint: e.vertexPaint
      });
      d.addTo(n), d.initializeGeometry(), e.draftAnchors.push(d);
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
      }, p = e.polygonPaint?.config && e.polygonPaint.config.color || "#00ff00", d = new Jt({
        type: "line",
        color: p,
        width: 2
      }), g = new Ft({
        geometry: f,
        paint: d
      });
      g.addTo(n), e.draftEdgeLine = g;
      return;
    }
    e.draftEdgeLine && (e.draftEdgeLine._remove(), e.draftEdgeLine = null);
    const i = s.slice(), o = i[0], l = i[i.length - 1];
    (o[0] !== l[0] || o[1] !== l[1] || (o[2] || 0) !== (l[2] || 0)) && i.push(o), e.draftPolygon && (e.draftPolygon._remove(), e.draftPolygon = null);
    const c = {
      type: "Polygon",
      coordinates: [i]
    }, u = new Gn({
      geometry: c,
      paint: e.polygonPaint
    });
    u.addTo(n), e.draftPolygon = u;
  },
  generate(s, e) {
    const t = s.tool;
    if (e.length < 3) return null;
    if (s.draftPolygon && (s.draftPolygon._remove(), s.draftPolygon = null), s.draftEdgeLine && (s.draftEdgeLine._remove(), s.draftEdgeLine = null), Array.isArray(s.draftAnchors)) {
      for (const u of s.draftAnchors)
        u?._remove();
      s.draftAnchors = [];
    }
    const n = yi(
      t.options.geometryPaint,
      { type: "basic-polygon", color: "#00ff00", opacity: 0.5 }
    ), i = e.slice(), o = i[0], l = i[i.length - 1];
    return (o[0] !== l[0] || o[1] !== l[1] || (o[2] || 0) !== (l[2] || 0)) && i.push(o), new Gn({
      geometry: {
        type: "Polygon",
        coordinates: [i]
      },
      paint: n
    });
  }
};
zs.registerMode("point", DA);
zs.registerMode("line", IA);
zs.registerMode("polygon", FA);
function yi(s, e) {
  return Jt.create(s || e);
}
var BA = Object.defineProperty, UA = (s, e, t) => e in s ? BA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, It = (s, e, t) => UA(s, typeof e != "symbol" ? e + "" : e, t);
class On {
  /**
   * constructor
   * 构造函数
   * @param options SourceOptions
   */
  constructor(e) {
    It(this, "dataType", "image"), It(this, "attribution", "isource"), It(this, "minLevel", 0), It(this, "maxLevel", 18), It(this, "projectionID", "3857"), It(this, "url", ""), It(this, "subdomains", []), It(this, "s", ""), It(this, "opacity", 1), It(this, "isTMS", !1), It(this, "bounds", [-180, -85, 180, 85]), It(this, "_projectionBounds", [-1 / 0, -1 / 0, 1 / 0, 1 / 0]), It(this, "tileMaterial"), Object.assign(this, e);
  }
  /**
   * Get url from tile coordinate, public, overwrite to custom generation tile url from xyz
   * 根据瓦片坐标获取URL，公开方法，可重写以自定义生成URL
   * @param x tile x coordinate 瓦片X坐标
   * @param y tile y coordinate 瓦片Y坐标
   * @param z tile z coordinate 瓦片Z坐标
   * @returns url tile url 瓦片URL
   */
  getUrl(e, t, n) {
    const i = { ...this, x: e, y: t, z: n };
    return $d(this.url, i);
  }
  /**
   * Get url from tile coordinate, public, called by TileLoader system
   * 根据瓦片坐标获取URL，公开方法，由瓦片加载系统调用
   * @param x tile x coordinate 瓦片X坐标
   * @param y tile y coordinate 瓦片Y坐标
   * @param z tile z coordinate 瓦片Z坐标
   * @returns url tile url 瓦片URL
   */
  _getUrl(e, t, n) {
    const i = this.subdomains.length;
    if (i > 0) {
      const l = Math.floor(Math.random() * i);
      this.s = this.subdomains[l];
    }
    const o = this.isTMS ? Math.pow(2, n) - 1 - t : t;
    return this.getUrl(e, o, n);
  }
  /**
   * Create source directly through factoy functions.
   * @param options source options
   * @returns ISource data source instance
   */
  static create(e) {
    return new On(e);
  }
}
var kA = Object.defineProperty, zA = (s, e, t) => e in s ? kA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, pn = (s, e, t) => zA(s, typeof e != "symbol" ? e + "" : e, t);
class vP extends On {
  /**
   * 构造函数
   * @param options 配置选项
   * @throws 当未提供token时抛出错误
   */
  constructor(e) {
    if (super(e), pn(this, "dataType", "image"), pn(this, "attribution", "天地图"), pn(this, "token", ""), pn(this, "style", "img_w"), pn(this, "subdomains", "01234"), pn(this, "url", "https://t{s}.tianditu.gov.cn/DataServer?T={style}&x={x}&y={y}&l={z}&tk={token}"), Object.assign(this, e), !this.token)
      throw new Error("天地图访问令牌(token)是必填参数");
  }
}
class wP extends On {
  /**
   * 构造函数
   * @param options 配置选项
   * @throws 当未提供token时抛出错误
   */
  constructor(e) {
    if (super(e), pn(this, "dataType", "quantized-mesh"), pn(this, "attribution", "天地图"), pn(this, "token", ""), pn(this, "subdomains", "01234"), pn(this, "url", "https://t{s}.tianditu.gov.cn/mapservice/swdx?T=elv_c&tk={token}&x={x}&y={y}&l={z}"), Object.assign(this, e), !this.token)
      throw new Error("天地图访问令牌(token)是必填参数");
  }
}
var NA = Object.defineProperty, HA = (s, e, t) => e in s ? NA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, id = (s, e, t) => HA(s, typeof e != "symbol" ? e + "" : e, t);
class bP extends On {
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
    }), id(this, "minLevel", 2), id(this, "maxLevel", 24);
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
  getUrl(e, t, n) {
    const i = this.isTMS ? Math.pow(2, n) - 1 - t : t;
    return $d(this.url, {
      ...this,
      x: e,
      y: i,
      z: n,
      tileMatrix: n,
      // WMTS标准参数
      tileRow: i,
      // WMTS标准参数
      tileCol: e
      // WMTS标准参数
    });
  }
}
var VA = Object.defineProperty, WA = (s, e, t) => e in s ? VA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, $n = (s, e, t) => WA(s, typeof e != "symbol" ? e + "" : e, t);
class xP extends On {
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super(e), $n(this, "dataType", "image"), $n(this, "attribution", "ArcGIS"), $n(this, "style", "World_Imagery"), $n(this, "url", "https://services.arcgisonline.com/arcgis/rest/services/{style}/MapServer/tile/{z}/{y}/{x}"), Object.assign(this, e);
  }
}
class TP extends On {
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super(e), $n(this, "dataType", "lerc"), $n(this, "attribution", "ArcGIS"), $n(this, "minLevel", 6), $n(this, "maxLevel", 13), $n(this, "url", "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}"), Object.assign(this, e);
  }
}
var GA = Object.defineProperty, $A = (s, e, t) => e in s ? GA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, Ar = (s, e, t) => $A(s, typeof e != "symbol" ? e + "" : e, t);
class SP extends On {
  /**
   * 构造函数
   * @param options 配置选项
   * @throws 当未提供token时抛出错误
   */
  constructor(e) {
    if (super(e), Ar(this, "token", ""), Ar(this, "format", "webp"), Ar(this, "style", "cm2myr6qx001t01pi0sf7estf"), Ar(this, "attribution", "MapBox"), Ar(this, "maxLevel", 25), Ar(this, "url", "https://api.mapbox.com/styles/v1/criska/{style}/tiles/256/{z}/{x}/{y}?access_token={token}&format={format}"), Object.assign(this, e), !this.token)
      throw new Error("MapBox访问令牌(token)是必填参数");
  }
}
var jA = Object.defineProperty, XA = (s, e, t) => e in s ? jA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, rd = (s, e, t) => XA(s, typeof e != "symbol" ? e + "" : e, t);
class MP extends On {
  //  "https://demotiles.maplibre.org/style.json";
  constructor(e) {
    super(e), rd(this, "dataType", "mvt"), rd(this, "paint", { layer: {} }), Object.assign(this, e);
  }
}
var YA = Object.defineProperty, ZA = (s, e, t) => e in s ? YA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, ms = (s, e, t) => ZA(s, typeof e != "symbol" ? e + "" : e, t);
class AP extends On {
  /**
   * 构造函数
   * @param options 配置选项
   */
  constructor(e) {
    super(e), ms(this, "dataType", "VectorTile"), ms(this, "attribution", "ArcGIS"), ms(this, "minLevel", 1), ms(this, "maxLevel", 21), ms(this, "url", "https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=uKYsZQZpm72WlbSgH9B7"), Object.assign(this, e);
  }
}
class PP extends bi {
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
class LP extends bi {
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
class EP extends bi {
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
var qA = Object.defineProperty, KA = (s, e, t) => e in s ? qA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, QA = (s, e, t) => KA(s, e + "", t);
class CP extends bi {
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
    super(e, t), QA(this, "_clouds", null);
    const n = ["texture"];
    for (const i of n)
      mc(t, i);
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
    const t = await Jt._loadTexture(e), n = new _T({
      texture: t,
      material: qt
    });
    n.castShadow = !0, this._clouds = n;
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
    this._clouds && this._clouds.update(this.map.sceneRenderer.camera, t, e);
  }
}
var JA = Object.defineProperty, eP = (s, e, t) => e in s ? JA(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, tP = (s, e, t) => eP(s, e + "", t);
class nP extends lp {
  /**
   * Create a new RasterTileLayer instance.
   * 创建一个新的 RasterTileLayer 实例。
   * 
   * @param id Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    super(e, t), tP(this, "layerType", "raster");
  }
  /**
   * Create the tile loader for this layer.
   * 创建此图层的瓦片加载器。
   * 
   * @returns {ICompositeLoader} The created tile loader instance. 创建的瓦片加载器实例。
   * @protected
   */
  createLoader() {
    const e = new Oc();
    return Array.isArray(this.source) ? e.imgSource = this.source : e.imgSource = [this.source], e;
  }
}
var iP = Object.defineProperty, rP = (s, e, t) => e in s ? iP(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, qo = (s, e, t) => rP(s, typeof e != "symbol" ? e + "" : e, t);
class OP extends nP {
  /**
   * Create a new WMTSTileLayer instance.
   * 创建一个新的 WMTSTileLayer 实例。
   * 
   * @param id Unique layer identifier. 图层唯一标识符。
   * @param options Layer configuration options. 图层配置选项。
   */
  constructor(e, t) {
    super(e, t), qo(this, "layerType", "wmts"), qo(this, "_layerName"), qo(this, "_style"), qo(this, "_matrixSet"), this._layerName = t.layerName, this._style = t.style || "default", this._matrixSet = t.matrixSet || "GoogleMapsCompatible";
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
    const e = new Oc();
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
var sP = Object.defineProperty, oP = (s, e, t) => e in s ? sP(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, gs = (s, e, t) => oP(s, typeof e != "symbol" ? e + "" : e, t);
class RP extends Rc {
  /**
   * @param options ToolTip options ToolTip 配置
   */
  constructor(e = {}) {
    super({
      single: !1,
      // tooltip usually not global singleton tooltip 通常不做全局单例
      ...e
    }), gs(this, "_content"), gs(this, "_timeoutId"), gs(this, "_boundOnOwnerMove", (t) => this._onOwnerMove(t)), gs(this, "_boundOnOwnerOut", () => this._onOwnerOut()), gs(this, "_boundOnOwnerRemoved", () => this._onOwnerRemoved()), this._content = e.content;
  }
  _getClassName() {
    return "ToolTip";
  }
  /**
   * Build ToolTip DOM structure.
   * 构建 ToolTip 的 DOM 结构
   */
  buildOn() {
    const e = document.createElement("div"), t = document.createElement("div");
    t.className = "maporbis-tooltip";
    const n = this.options.containerClass;
    n && (Array.isArray(n) ? n : [n]).forEach((u) => {
      t.classList.add(u);
    });
    const { width: i, height: o } = this.options;
    typeof i == "number" && (t.style.width = `${i}px`), typeof o == "number" && (t.style.height = `${o}px`);
    const l = this._content;
    return typeof l == "function" ? l(t) : l instanceof HTMLElement ? t.appendChild(l) : typeof l == "string" && (t.innerHTML = l), e.appendChild(t), e;
  }
  /**
   * Calculate offset based on DOM size to make tooltip appear slightly above and to the right of the point.
   * 根据 DOM 尺寸，做一个简单的偏移，让 tooltip 出现在点的上方偏右一点
   */
  getOffset() {
    const e = super.getOffset(), t = this._dom;
    if (!t)
      return e;
    const n = t.offsetWidth, i = t.offsetHeight;
    return {
      x: e.x + 10 - n / 2,
      y: e.y - i - 10
    };
  }
  /**
   * Bind to feature or map. The key is to bind mouse move/leave events to owner.
   * 绑定到要素或地图。这里重点是给 owner 绑鼠标移动/离开事件。
   */
  addTo(e) {
    return this._owner = e, super.addTo(e), e && typeof e.on == "function" && (e.on("mousemove", this._boundOnOwnerMove), e.on("mouseout", this._boundOnOwnerOut), e.on("removed", this._boundOnOwnerRemoved)), this;
  }
  /**
   * Internal: Handle owner move event.
   * 内部：处理 owner 移动事件
   */
  _onOwnerMove(e) {
    const t = this.getMap();
    if (!t)
      return;
    this._timeoutId != null && (window.clearTimeout(this._timeoutId), this._timeoutId = void 0);
    const n = e?.coordinate ?? (this._owner && typeof this._owner.getLngLatLike == "function" ? this._owner.getLngLatLike() : t.getCenter?.()), i = this.options.showTimeout ?? 400, o = () => {
      super.show(n);
      const l = this;
      l._positionedOnce = !0, l._refreshDomPosition(), l._dom && (l._dom.style.display = "block");
    };
    i <= 0 ? o() : this._timeoutId = window.setTimeout(o, i);
  }
  /**
   * Internal: Handle owner out event.
   * 内部：处理 owner 离开事件
   */
  _onOwnerOut() {
    this._timeoutId != null && (window.clearTimeout(this._timeoutId), this._timeoutId = void 0), this.hide();
  }
  /**
   * Internal: Handle owner removed event.
   * 内部：处理 owner 移除事件
   */
  _onOwnerRemoved() {
    this.remove();
  }
  onRemove() {
    this._timeoutId != null && (window.clearTimeout(this._timeoutId), this._timeoutId = void 0);
    const e = this._owner;
    e && typeof e.off == "function" && (e.off("mousemove", this._boundOnOwnerMove), e.off("mouseout", this._boundOnOwnerOut), e.off("removed", this._boundOnOwnerRemoved)), this._owner = void 0;
  }
}
var aP = Object.defineProperty, lP = (s, e, t) => e in s ? aP(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, sd = (s, e, t) => lP(s, typeof e != "symbol" ? e + "" : e, t);
class DP extends Rc {
  constructor(e) {
    super({
      single: !1,
      // UIMarker allows multiple instances by default UIMarker 默认允许同图多实例共存
      ...e
    }), sd(this, "_markerCoord"), sd(this, "_content"), this._markerCoord = [...e.coordinate], this._content = e.content;
  }
  _getClassName() {
    return "UIMarker";
  }
  /**
   * Build UIMarker DOM
   * 构建 UIMarker 的 DOM
   */
  buildOn() {
    const e = document.createElement("div"), { width: t, height: n } = this.options;
    typeof t == "number" && (e.style.width = `${t}px`), typeof n == "number" && (e.style.height = `${n}px`);
    const i = this.options.containerClass;
    i && (Array.isArray(i) ? i : [i]).forEach((c) => e.classList.add(c));
    const o = this._content;
    return typeof o == "function" ? o(e) : o instanceof HTMLElement ? e.appendChild(o) : typeof o == "string" && (e.innerHTML = o), e;
  }
  /**
   * Position offset: default centers the marker on the coordinate
   * 位置偏移：默认让标记点中心落在坐标位置上
   */
  getOffset() {
    const e = super.getOffset(), t = this._dom;
    if (!t)
      return e;
    const n = t.offsetWidth, i = t.offsetHeight;
    return {
      x: e.x - n / 2,
      y: e.y - i / 2
    };
  }
  /**
   * Show: updates internal coordinate if a new one is provided
   * 显示：如果传了新坐标，就更新内部坐标
   */
  show(e) {
    return e && (this._markerCoord = [...e]), super.show(this._markerCoord);
  }
  /**
   * 设置坐标（会触发重新定位）
   */
  setLngLatLikes(e) {
    return this._markerCoord = [...e], this.isVisible() && super.show(this._markerCoord), this;
  }
  /**
   * 获取当前坐标
   */
  getLngLatLikes() {
    return [...this._markerCoord];
  }
  /**
   * 
   */
  getCenter() {
    return this.getLngLatLikes();
  }
  /**
   * 获取高度（优先坐标的 z，再退回 options.altitude）
   */
  getAltitude() {
    const e = this._markerCoord;
    return typeof e[2] == "number" ? e[2] : typeof this.options.altitude == "number" ? this.options.altitude : 0;
  }
  /**
   * 设置高度：内部直接改第三个分量
   */
  setAltitude(e) {
    const t = [...this._markerCoord];
    return t[2] = e, this._markerCoord = t, this.isVisible() && super.show(this._markerCoord), this;
  }
  /**
   * 设置内容：如果当前已显示，会立即更新 DOM
   */
  setContent(e) {
    this._content = e, this.options.content = e;
    const t = this._dom;
    return t ? (t.innerHTML = "", typeof e == "function" ? e(t) : e instanceof HTMLElement ? t.appendChild(e) : typeof e == "string" && (t.innerHTML = e), this) : this;
  }
  getContent() {
    return this._content;
  }
  addTo(e) {
    return super.addTo(e), this.options.visible !== !1 && this.show(this.options.coordinate), this;
  }
}
console.log(
  "%c✨ MapOrbis V" + Eb + " ",
  "color:rgb(255, 255, 255); font-weight: bold; background: linear-gradient(90deg, #ffb6c1, #ff69b4); padding: 5px; border-radius: 5px;"
);
export {
  pP as AbstractCanvasMaterialLoader,
  hp as AbstractGeometryLoader,
  Cc as AbstractMaterialLoader,
  u2 as ArcGISLercLoader,
  TP as ArcGisDemSource,
  xP as ArcGisSource,
  CP as CloudsLayer,
  Oc as CompositeTileLoader,
  zs as DrawTool,
  Rf as EventClass,
  qd as ExternalModelLoader,
  gt as Feature,
  Ts as GeometryHelper,
  KM as GeometrySkirtUtils,
  yM as ICloud,
  td as InfoWindow,
  TM as Label,
  PP as LineLayer,
  Ft as LineString,
  da as LoaderUtils,
  AP as MVTGeoSource,
  MP as MVTSource,
  Nr as Map,
  SP as MapBoxSource,
  Os as MapTileGeometry,
  EA as MapTool,
  _2 as MapboxRGBLoader,
  x2 as MapboxVectorTileGeometryLoader,
  xi as Marker,
  dM as Model,
  oM as MultiLineString,
  Jt as Paint,
  LP as PointLayer,
  Gn as Polygon,
  EP as PolygonLayer,
  _P as ProjectionFactory,
  nP as RasterTileLayer,
  Qx as SceneRenderer,
  wP as TDTQMSource,
  vP as TDTSource,
  PM as TPoints,
  mP as TerrainMeshBuilder,
  Er as Tile,
  nP as TileLayer,
  We as TileLoaderFactory,
  VM as TileLoadingManager,
  UM as TileMaterial,
  On as TileSource,
  RP as ToolTip,
  Rc as UIComponent,
  DP as UIMarker,
  nt as VectorFeatureTypes,
  Jf as VectorTileLayer,
  kM as VectorTileRender,
  K2 as VectorTileTextureLoader,
  bP as WMTSSource,
  OP as WMTSTileLayer,
  eA as WebImageLoader,
  hP as getApproxZoomLevel,
  uP as getLocalInfoFromGeo,
  Pd as getLocalInfoFromRay,
  Ld as getLocalInfoFromScreen,
  ac as getLocalInfoFromWorld,
  tA as registerDefaultLoaders
};
