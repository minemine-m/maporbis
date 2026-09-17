---
feature: sc-vector-style-bucket
status: delivered
updated: 2026-09-16
branch: feat/sc-vector-style-bucket
commits: 77f1725..b0b4610
---

# 矢量 Style Spec → Bucket

## Report

**What was built** — P1：filter 求值、StyleSpecLike→PaintRule、`setStyle` 缓存热更新。P2：更多 paint/layout（dash/blur/stroke/halo/outline-width）、`layout.visibility=none` 丢弃图层、demo 虚线淡出预设。P3a：zoom interpolate/step/exponential + layer minzoom/maxzoom + 放大时 material patch 改线宽（不重建几何）。Worker `in` 与 `matchFilter` 左值属性语义已对齐 Mapbox legacy；fill 规则不再误吃 polygon。

**Verification** — `tsc` PASS；style vitest **18 PASS**；tile vitest **77 PASS**；`vite build` PASS；demo 热更新 Δpbf=0；缩放变宽用户确认流畅。

**Journey log**
1. filter 右值/worker `in` 语义曾导致主干/高速预设空白。
2. 渲染读 `config.width`，映射必须带 `width` 不只 `weight`。
3. zoom 线宽不能走 `setPaint` 重建——必须每帧 patch `LineMaterial.linewidth`。
4. sprite / transitions / JSON URL / data-driven 表达式 留后续。

**Known residual**
- `_showCachedTile` 不感知 paint 规则版本，极端时序下可能闪旧 mesh。
- 工作区有一份未提交的 RenderLayer 加固（线宽 clamp、widthExpr 材质不进共享缓存）。

## [S1] Problem

MapOrbis 矢量层已有 `PaintRule[]` + `Line/Point/FillBucket` + worker 分桶，但：

1. 无法加载 Mapbox Style Spec 风格的 JSON（`sources` + `layers`）。
2. filter 多为占位/自定义，无标准表达式（`==` / `in` / `>=` / zoom）。
3. **改样式要整瓦片重 process**，不能从 `_tileDataMap` 缓存热更新 bucket。

目标：第一期落地「可加载 Style Spec 子集 + 表达式 filter + 改样式不重下」。

## [S2] Design

### 2.1 分期（本 feature 全景，按 task 交付）

| 期 | 内容 | 本 spec 任务 |
|----|------|--------------|
| P1 | Style JSON 子集 + filter 求值 + 从缓存 rebuild | 已交付 |
| P2 | 更多 paint/layout（dash/blur/stroke/visibility） | T5–T6 |
| P3 | 完整 Style Spec（sprite/glyph/transitions/zoom 插值） | 后续 feature |

### 2.2 Style 子集 Schema

```ts
type StyleLayer = {
  id: string;
  type: "fill" | "line" | "symbol" | "circle";
  "source-layer"?: string;
  filter?: FilterExpression;
  minzoom?: number;
  maxzoom?: number;
  paint?: Record<string, unknown>;
  layout?: Record<string, unknown>;
};

type StyleSpecLike = {
  version?: 8;
  sources: Record<string, { type: "vector"; url?: string; tiles?: string[] }>;
  layers: StyleLayer[];
};
```

`symbol` 第一期按现有 Point 路径映射（text-field / text-color 子集）。

### 2.3 Filter 表达式（Mapbox 子集）

支持：

- `true` / `false` / `null`
- `["==", key, value]` `["!="]` `["<"]` `["<="]` `[">"]` `[">="]`
- `["in", key, ...values]` `["!in", key, ...values]`
- `["has", key]` `["!has", key]`
- `["all", ...]` `["any", ...]` `["! ", expr]`（`["!", expr]`）
- `["zoom"]` 仅与数值比较（求值时传入 zoom）

实现：`style/filterExpression.ts` 的 `evaluateFilter(expr, properties, zoom)`。

### 2.4 Style → 现有渲染管线

```text
StyleSpecLike
  → toPaintRules(style, zoom?) 
      layers[] → PaintRule { filter, paint: mapPaintToConfig(layer), sourceLayer }
  → VectorTileRenderLayer.setStyle(rules) | applyStyle(style)
  → 对每个 _tileDataMap 缓存瓦片：
        removeFeatures / 清 mesh
        processTileData(tile, cachedData)   // 不触发网络
```

`mapPaintToConfig` 映射（P1）：

| Style paint/layout | PaintConfig |
|--------------------|-------------|
| line-color / line-width / line-opacity | color / weight / opacity |
| line-dasharray | dashArray |
| fill-color / fill-opacity | fillColor / fillOpacity |
| circle-color / circle-radius | color / size |
| text-color / text-size / text-field | fontColor / font / textField |

### 2.5 API

```ts
// VectorTileLayer
setStyle(style: StyleSpecLike | PaintRule[]): void
getStyleDocument(): StyleSpecLike | null
// 内部：Renderer.setStyle(rules) → rebuildFromCache()
```

热更新契约：

- **禁止** 因 setStyle 触发 `requestLoad` / 新 HTTP
- 仅使用 `_tileDataMap` 已有 `vectorData`
- showing 语义不变（SourceCache 仍唯一写 showing）

### 2.6 契约红线

- 不改 TileLoadScheduler / SourceCache retain
- 不引入完整 sprite/glyph
- 现有 demo 的 `paint: PaintConfig[]` 路径必须继续可用（兼容转换）

## [S3] Out of Scope

- Style Spec 全量属性与 transitions
- sprite / glyphs / terrain / sky
- 服务端 style URL 拉取（可 P2）
- Globe / 3D layers

## Tasks

- [x] T1: `evaluateFilter` + 单测（==/in/range/has/all/any/!/zoom） — acceptance: vitest filter 覆盖通过 (covers: S2.3)
- [x] T2: `StyleSpecLike` 类型 + `toPaintRules` + `mapPaintToConfig` — acceptance: 样例 style 转成 PaintRule[] (covers: S2.2, S2.4)
- [x] T3: `VectorTileLayer.setStyle` / Renderer rebuild from cache（无网络） — acceptance: setStyle→setPaint→_refreshVisibleTiles 仅用 `_tileDataMap` (covers: S2.4, S2.5)
- [x] T4: `tsc` + tile/style vitest + build + commit — acceptance: 全绿 (covers: S2; depends: T1,T2,T3)
- [x] T5: P2 paint/layout 扩展 — line-blur/gap、circle-stroke、text-halo、fill-outline-width、layout.visibility (covers: S2.4)
- [x] T6: demo 虚线/淡出预设 + vitest — acceptance: 新用例 PASS；demo 按钮可切换 (covers: S2.4; depends: T5)
- [x] T7: P3a zoom interpolate/step + minzoom/maxzoom — acceptance: zoomExpression 测试 PASS；setStyle 按当前 zoom 解析 (covers: S2.2, S2.4)
