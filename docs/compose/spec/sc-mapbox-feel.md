---
feature: sc-mapbox-feel
status: delivered
updated: 2026-09-16
branch: fix/tile-schedule-cache
commits: 10070d9..ddca4f3
---

# 调度观感：少要张 + 中心先下 + 缩放不露底

## Report

**What was built** — (1) coveringTiles 删除 padKeysOneTile 与 bbox 实心填充，只保留 DFS 视锥 keys。(2) SourceCache 写入 `distToCamera`；ideal 按 z 粗→细 + 距离排序；非 ideal underlay（z &lt; ideal.z）优先于全部 ideal，pitch 天际线先铺粗图。(3) `coverageIncomplete` 时 release 跳过已加载瓦。(4) Phase-1 调度：`updateInterval` 16、moveend flush、payload LRU 512；cache-hit 为独占交接（delete）。

**Verification** — `vitest src/core/tile` 69 PASS；`npm run build` PASS；pitch0 ideal 1–9；pitch55 混层 z14–17、停稳 ~2.9s（同轮 MapLibre ~4s）；demo emptyLoaded=0。

**Journey log**
- 同源 MapLibre 对照：慢在请求数与出图顺序，不在 after-net（37–97ms）。
- 砍 pad 后 pitch0 对齐 MapLibre；pitch 仍「一张张」是因为 ideal 全下完才轮 underlay。
- hold 单测必须注入 loaded 且非 retain 的瓦。
- cache-hit keep-entry 与 LRU dispose 共享 GPU 不安全，回退为 hit 即 delete。
- ideal 优先级用 `0.1 + z*0.01 + distNorm`（粗层先）；underlay `0.01+distNorm`。

## [S1] Problem

与 MapLibre/Mapbox 同源 Esri 对照：同一东京视野，MapLibre 只要 12–24 张瓦，MapOrbis ideal 一次 25–120 张，且 ideal 内无距离排序、coverageIncomplete 时仍可能 release 已加载瓦。体感是「一张张一点点」，不是 Mapbox 的「刷刷刷从中心铺开」。

客户端 after-net 已证实只需几十毫秒；瓶颈在 **请求数量、请求顺序、过程中的底图连续性**。

## [S2] Design

### 2.1 砍 covering 过采样（少要张）

- **删除** `padKeysOneTile`（对每个 key 扩 8 邻域）。
- **删除** DFS 后的 bbox 实心矩形填充及未使用的 `viewportGroundTileAabb`。只保留 DFS 视锥 keys（Mapbox 风格）。
- 不改变 `useDistanceLod: false`（距离 LOD 另开）。

验收：默认东京贴地俯视 ideal 1–9（视口仅需 1 张 z18）；`setZoom(14)` ideal ~52（原 ~108）。

### 2.2 SourceCache 写入 `distToCamera`，ideal 按距离排序（中心先下）

- `SourceCache._updateInner` 在 load 之前：用 `ctx.camera` 世界坐标，对 `_tiles` 中 **ideal ∪ retain** 的瓦片写入 `tile.distToCamera`。
- `Tile._loadPriority`：ideal 键返回 `min(distToCamera/1e9, 0.999)`（严格 &lt; 1，近的先下）。非 ideal 逻辑不变（1 / 2+dist）。

验收：单测 near &lt; far 且 ideal 带 &lt; 1；非 ideal ≥ 1。

### 2.3 coverageIncomplete 时不 release 已加载瓦（缩放不露底）

- `coverageIncomplete === true` 时，release 循环 **跳过所有 `tile.loaded === true` 的瓦**（仍可 release 未加载空壳）。
- 不改 showing 写入方（仍仅 `SourceCache._setShowing`）。

验收：单测注入 loaded 且非 retain 的瓦，在 ideal 缺一张时不被 release。

### 2.4 Pitch 天际线：粗层 underlay 优先（Mapbox 对照续）

距离 LOD 已让 pitch 产生 mixed z（如 14/15/16），但若 ideal 细瓦先下完、父级/远景粗瓦排在后面，天际线仍会「一张张」空着等。

- ideal 优先级：`0.1 + z*0.01 + distNorm` — **更低 z（更大覆盖面）先下**，同 z 再近→远。
- 非 ideal 且 `z < ideal.z` 的 retain underlay：`0.01 + distNorm`（**先于全部 ideal**），保证天际线先有粗图可画。
- `settle-single-z` 仅在 ideal keys 同 z 时启用（已在 S2 修订）。

验收：pitch 下 underlay 粗瓦 priority &lt; 0.1 且 &lt; 细 ideal；单测覆盖。

### 契约红线（不回归）

- retain = ideal ∪ 覆盖 missing 的 loaded 子 ∪ loaded 祖先
- showing = retain ∧ loaded ∧ ¬covered
- settle（ideal 全 loaded）只 `ideal.z`
- 网络 = missing ideals（+ ≤ cover cap 的非 ideal）
- 不写 `lastShowing` 全集；不在 Tile 内写 showing
- payload cache hit 为独占交接（delete），避免 LRU dispose 活瓦片 GPU 对象

## [S3] Out of Scope

- `useDistanceLod: true` / mixed-z 距离 LOD
- ImageBitmap、HTTP/2 源切换、材质/阴影 GPU 优化
- 修 `getZoom` / 默认 demo 相机距离
- PR-4 扁平变换

## Tasks

- [x] T1: coveringTiles 去掉 padKeysOneTile 与 bbox 填充 — acceptance: demo ideal 从 ~25 降到 1–9；z14 从 ~108 降到 ~52 (covers: S2.1)
- [x] T2: SourceCache 写 distToCamera + Tile._loadPriority ideal 按距离 — acceptance: feel.schedule 单测 near &lt; far 且 &lt; 1 (covers: S2.2)
- [x] T3: coverageIncomplete 时跳过 loaded release — acceptance: feel.schedule 注入非 retain loaded 瓦并持有 (covers: S2.3)
- [x] T4: vitest 69 PASS + build PASS + demo 无空洞 (covers: S2.1–2.4)
- [x] T5: pitch 粗层/underlay 优先 — acceptance: feel.schedule 粗 ideal &lt; 细 ideal；underlay &lt; 0.1 且 &lt; 细 ideal (covers: S2.4)
