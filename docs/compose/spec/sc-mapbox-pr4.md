---
feature: sc-mapbox-pr4
status: delivered
updated: 2026-09-16
branch: feat/sc-mapbox-pr4-redo
commits: 531edd0..7065e51
---

# 扁平变换 redo（真 Mapbox 坐标）

## Report

**What was built** — 在当前 master（含 feel 调度）上重做扁平变换：`tileTransform` 单位空间公式 + `Tile.setTileTransform`；`ensureTilePath` 只创建缺失 `(z,x,y)` 为 root 直接子级，生产路径不再 `createChildren`。与层级连乘对拍 z0–14 误差 &lt; 1e-3。Review 后移除 `_loadPriority` 对 `parent.children` 的空间兄弟假设（扁平下 parent 恒为 root）。

**Verification** — `vitest src/core/tile` 73 PASS；`npm run build` PASS；demo：`nested=0`，pitch 下 `emptyLoaded=0`、ideal 6/6。

**Journey log**
- 旧 `feat/sc-mapbox-pr4` 只作公式/对拍参考，SourceCache 与 feel 分叉不可整支 merge。
- 扁平后 release 的 `hasTileChild` 对 z&gt;0 恒 false；prune 靠 parent==null。
- `tile.parent.children` 不能再当空间兄弟集；优先级只用 z/x/y 键与距离带。
- covering 本地 AABB 与 `computeTileRootLocal` 同为 y=0 上、+v，须锁步。

## [S1] Problem

瓦片靠父级链 `scale 0.5 + local ±0.25` 连乘定位（`createChildren`）。深层精度差，变换主权分散。旧 `feat/sc-mapbox-pr4` 已验证公式，但基于 pre-feel 的 SourceCache，**不可整支合并**；需在当前 master（含 feel 调度）上重做扁平化。

## [S2] Design

### 坐标约定

根：`scale=(mapW,mapH,1)`，挂在 layer 下；`Map._rootGroup.rotation.x=-π/2`（既有）。

瓦片挂在 **root 直接子级**，在根局部单位空间（约 [-0.5,0.5]²，scale 之前）：

```
u = (x + 0.5) / 2^z - 0.5
v = 0.5 - (y + 0.5) / 2^z     // y=0 在上，与 createChildren 一致
su = sv = 1 / 2^z
```

### 实现

1. `tileTransform.ts`：`computeTileRootLocal` / `computeTileRootSpace`。
2. `Tile.setTileTransform(z,x,y)`：写 position/scale，`matrixAutoUpdate=false`，`updateMatrix()`。
3. `ensureTilePath`：**只**创建缺失的 `(z,x,y)` 为 root 子级并 `setTileTransform`；**不再** `createChildren` 整叉/层级链。
4. release/prune：扁平后瓦片 parent 恒为 root；`hasTileChild` 对 z&gt;0 恒为 false，`parent.remove` 即卸下。不改 retain/showing 键逻辑（仍用 z/x/y）。

### 契约红线（不回归 feel / PR-1～3）

- showing 仅 `SourceCache._setShowing`
- retain/showing/covered 键语义不变
- ideal 优先级、underlay、incomplete hold、距离 LOD 不动
- `createChildren` 仅保留给对拍单测，生产零调用（除 import）

## [S3] Out of Scope

- Fade、矢量事件、删 LODEvaluate 函数体
- 改 covering DFS 公式 / 调度优先级
- 旧分支 `feat/sc-mapbox-pr4` 整支合并

## Tasks

- [x] T1: tileTransform + Tile.setTileTransform + 对拍单测 z0–14 — acceptance: vitest parity PASS (covers: S2)
- [x] T2: ensureTilePath 扁平 root 子级 — acceptance: flat-tiles 测试 parent===root；生产无 createChildren (covers: S2; depends: T1)
- [x] T3: vitest 73 + build + demo nested=0 emptyLoaded=0 (covers: S2; depends: T2)
