---
feature: sc-mapbox-pr2
status: in-progress
updated: 2026-09-15
branch: feat/sc-mapbox-pr2
commits: 1809b2c..1809b2c
---

# SourceCache 收编 add / release（PR-2）

## Report

## [S1] Problem

PR-1 后 showing 只由 SourceCache 写，但结构仍双主权：`TileLayer` 每帧先 `rootTile.update`，LOD `create/remove` 会 dispose 子树；倾斜/缩放时 SourceCache 仍 retain 的瓦片被 LOD 拆掉 → 洞、抖动、渲染异常。`_tiles` 可能无限膨胀。

## [S2] Design

### 单一结构主权

- `_idealRetain=true`（默认）时 **不调用** `rootTile.update`。
- 建树仅：`ensureTilePath` / `_addTile`（按 ideal 与 retain 需要）。
- `LODAction.remove` **空操作**（不 dispose、不 clear 子树）。

### release

- 每帧 `update` 末尾：对 `key ∈ _tiles` 且 `key ∉ retain`：
  1. abort 在途 load（若有）
  2. 仅卸载 **自身** payload（不递归 clear 仍 retain 的子节点）
  3. `parent.remove(tile)` 从场景摘除
  4. 发 `tile-unload`
  5. `_tiles.delete(key)`
- retain 由 ideal ∪ 盖洞父级 ∪ 盖洞子级保证 → 不释放 ideal 路径上的祖先。

### TileLayer

- 只跑 `sourceCache.update`；相机矩阵先 `updateMatrixWorld`。

### 验收相关

- `_tiles.size` 与 retain 量级一致
- 缩放回退再前进：无「整棵子树被 LOD 拆掉」的随机空洞
- payload cache 仍可命中

## [S3] Out of Scope

- Fade
- 扁平变换（PR-4）
- 矢量事件迁移（PR-5）
- 删除 LODEvaluate 代码本体（PR-3 可清）

## Tasks

- [x] T1: LODAction.remove 不再 dispose — acceptance: remove 路径不调用 _disposeResources (covers: S2)
- [x] T2: TileLayer 仅 sourceCache.update — acceptance: _idealRetain 时不调用 rootTile.update (covers: S2)
- [x] T3: SourceCache release ∉ retain 且 ∉ 结构路径；保留有子节点的壳 — acceptance: 单测 + _tiles 不无限膨胀 (covers: S2; depends: T1)
- [x] T4: tsc + vitest + build — acceptance: PASS 72 tests (covers: S2; depends: T1–T3)
