---
feature: sc-mapbox-pr1
status: in-progress
updated: 2026-09-14
branch: feat/sc-mapbox-pr1
commits: 590d23d..590d23d
---

# SourceCache 单一 showing 写入方（PR-1）

## Report

## [S1] Problem

`Tile.showing` 存在多个生产写入方：`Tile._revealIfIdeal`（加载完成直接点亮）、`SourceCache` 整集 `lastShowing` 粘滞、`applyAtomicChildHandoff`（按 `kids.every(showing)` 隐藏父级）、`Tile._refreshCoverVisibility`（旧 cover）。双主权导致父级不消失、子级不出现、多层硬拼贴、闪一下恢复。

## [S2] Design

### 可见性主权

- **唯一写入方**：`TileSourceCache.update`（含其内部 sticky/handoff 辅助，同属 SourceCache）。
- **规则**（对齐 Mapbox `_isIdRenderable`）：`showing = retain ∧ loaded ∧ ¬covered`。
- `covered`：四个直接子节点均在 `retain` 且 `loaded`。
- 加载完成 **禁止** 直接 `showing=true`；改为 `markDirty` + 尽快再跑一次 `update`。

### sticky 垫底（替代 lastShowing 整集点亮）

- 仅当 ideal 格子缺 `loaded` 时，为 **该格子最近 loaded 且在 retain 中的祖先** 写 `showing=true`。
- 删除 `_lastShowing` 整集回放。

### covered 隐藏

- 生产路径在 `update` 内遍历 `_coveredKeys`，经 `_setShowing(..., "covered")` 隐藏。
- 未 covered 允许父+子同帧（靠 polygonOffset）。不再使用 `kids.every(showing)`。
- 已删除导出的 `applyAtomicChildHandoff`（避免第二写漏斗）。

### dirty / 同步 update

- `TileSourceCache.markDirty()` 置位 `_dirty`。
- `setOnDirty(cb)`：TileLayer 注册 live driver，用**当前相机**重建 ctx 后 `layer.update`（避免 stale `cameraDistance`）。
- `tile-loaded` 一律 `queueMicrotask` 后再跑 driver/`updateIfDirty`——cache-hit 在 `update` 载荷阶段同步派发事件，同步 driver 会嵌套 update。
- `update` 有 `_inUpdate` 守卫：重入时只置 dirty 并返回当前 snapshot。
- 快照含 `emptyLoaded`（recover 后应为 0，对齐计划 I6）。
- `TileLayer.dispose` 清空 `setOnDirty`。

### 调试

- `TileSourceCache.traceVisibility`：`_setShowing` 记录本帧 showing 翻转及写入方标签。

### 参考

- Mapbox `source_cache.ts`：`_updateRetainedTiles` / `_coveredTiles` / `_isIdRenderable`；Mapbox 不在 Tile 上存 showing，paint 时现算。本 PR 先收敛写入方，PR-2+ 再收编 add/release。

## [S3] Out of Scope

- Fade 观感
- SourceCache 收编 add/release（PR-2）
- 移除 LODEvaluate 结构主权（PR-3）
- 扁平变换（PR-4）
- 矢量事件迁移（PR-5）

## Tasks

- [x] T1: 删除 Tile 非 SourceCache 的 showing 写入（`_revealIfIdeal`、`_refreshCoverVisibility` 生产写）— acceptance: 生产源码 grep `.showing =` 仅 SourceCache.ts (covers: S2)
- [x] T2: SourceCache sticky 改为「缺 ideal 的最近 loaded 祖先」；删除 lastShowing 整集点亮 — acceptance: update 内不再读 `_lastShowing` 回放 (covers: S2)
- [x] T3: covered 隐藏经 `_setShowing`；去掉 kids.every(showing) 与 applyAtomicChildHandoff — acceptance: covered 父隐藏；未 covered 父子可同帧 (covers: S2)
- [x] T4: markDirty + setOnDirty live driver — acceptance: 加载完成后 showing 由 SourceCache.update 决定，且 ctx 来自当前相机 (covers: S2; depends: T1)
- [x] T5: traceVisibility 日志开关 — acceptance: 所有生产 showing 写经 `_setShowing` 打标 (covers: S2)
- [x] T6: 更新/新增 vitest（加载不直接 showing；covered；emptyLoaded；settle 单 z）— acceptance: `npx vitest run` 通过 (covers: S2; depends: T1,T2,T3,T4)
- [x] T7: tsc + vitest + build 全绿 — acceptance: 三条命令 PASS (covers: S2; depends: T1–T6)
