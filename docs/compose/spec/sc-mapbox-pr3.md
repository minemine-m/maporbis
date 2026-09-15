---
feature: sc-mapbox-pr3
status: delivered
updated: 2026-09-15
branch: feat/sc-mapbox-pr3
commits: f26fc49..HEAD
---

# 移除 LOD 结构主权（PR-3）

## Report

**What was built** — 删除 `Tile._updateLOD` / `_processLODAction` 及 `Tile.update` 内对它们的调用。场景树只由 `SourceCache.ensureTilePath` 创建；`LODEvaluate`/`LODAction` 仅保留为 util 纯函数与单测，生产零调用。删除依赖 LOD 场景副作用的 `Tile.parent-prefetch.test.ts`。

**Verification** — `vitest src/core/tile` PASS 64；`tsc --noEmit` PASS；`npm run build` PASS。生产代码中 `LODEvaluate` 仅剩 `util.ts` 定义。

**Journey log**
- PR-2 已让 `_idealRetain` 跳过 `rootTile.update`，PR-3 把 LOD 从 Tile 内部拆干净，避免 PR-4 改变换时再被 create/remove 拆台。
- parent cover 不再靠 LOD parent-prefetch，由 SourceCache retain 负责。

## [S1] Problem

PR-2 后 showing/add/release 已由 SourceCache 决定，但 `Tile.update` 仍跑整树 `LODEvaluate`，`_updateLOD` / `_processLODAction` 还能 create 子树、enqueue load。双路径残留：结构权威未收干净，后续 PR-4 改变换时 LOD 仍可能拆台。

## [S2] Design

### 结构唯一入口

- 场景树只由 `SourceCache.ensureTilePath` 创建（缺 sibling 补齐，不整叉重复）。
- `LODAction.remove` 本就空操作；PR-3 **删除**生产侧 `_updateLOD` / `_processLODAction` 及 `Tile.update` 中对它们的调用。
- `_idealRetain=true` 时 `TileLayer` 已不调用 `rootTile.update`；保留该开关，legacy 路径若仍引用 `Tile.update` 只做 frustum/dist，**不再** create/remove。

### LODEvaluate 本体

- `LODEvaluate` / `LODAction` 保留为 **纯函数**（`util.ts`），供单测与后续 distance-LOD 参考。
- 生产代码 **零调用**（除 import 类型外不驱动场景图）。

### 测试

- `LOD.*.test.ts`：仅测纯函数 `LODEvaluate`（create/none/remove 判定），不测场景图副作用。
- 删除 `Tile.parent-prefetch.test.ts`（依赖已删的 `_processLODAction`）；parent cover 由 SourceCache retain 覆盖，已有 `tile-holes` / `SourceCache.release` 单测。

## [S3] Out of Scope

- 扁平变换（PR-4）、矢量事件（PR-5）、删除 `LODEvaluate` 函数体（可在 PR-6 清）
- 改 covering DFS / ideal 算法

## Tasks

- [x] T1: 删除 Tile 生产路径 LOD create/remove（`_updateLOD` / `_processLODAction` / update 内调用）— acceptance: `rg LODEvaluate packages/maporbis/src` 仅剩 util 定义与 __tests__ (covers: S2)
- [x] T2: 收敛测试 — acceptance: 删 parent-prefetch 场景测；LOD.* 只测纯函数；全量 vitest PASS (covers: S2; depends: T1)
- [x] T3: tsc + build — acceptance: PASS 64 tests (covers: S2; depends: T1–T2)
