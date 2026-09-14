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

- 仅当 ideal 格子缺 `loaded` 时，为 **该格子的最近 loaded 祖先** 写 `showing=true`（仍由 SourceCache 在 `update` 内写）。
- 删除 `_lastShowing` 整集回放。

### handoff

- `applyAtomicChildHandoff` 与 `covered` 一致：covered 父级必隐藏；未 covered 允许父+子同帧（靠 polygonOffset）。
- 不再使用 `kids.every(showing)`。

### dirty / 同步 update

- `TileSourceCache.markDirty()` 置位 `_dirty`。
- `update` 保存 `_lastCtx` 并清 dirty。
- root 上 `tile-loaded` → `markDirty()` → microtask 内 `update(_lastCtx)`（避免加载回调重入）。
- 可保留 Map 的 interval 调度；dirty 路径优先。

### 调试

- `TileSourceCache.traceVisibility`：记录本帧 `showing` 翻转及写入方标签。

### 参考

- Mapbox `source_cache.ts`：`_updateRetainedTiles` / `_coveredTiles` / `_isIdRenderable`；Mapbox 不在 Tile 上存 showing，paint 时现算。本 PR 先收敛写入方，PR-2+ 再收编 add/release。

## [S3] Out of Scope

- Fade 观感
- SourceCache 收编 add/release（PR-2）
- 移除 LODEvaluate 结构主权（PR-3）
- 扁平变换（PR-4）
- 矢量事件迁移（PR-5）

## Tasks

- [ ] T1: 删除 Tile 非 SourceCache 的 showing 写入（`_revealIfIdeal`、`_refreshCoverVisibility` 生产写）— acceptance: 生产源码 grep `.showing =` 仅 SourceCache.ts (covers: S2)
- [ ] T2: SourceCache sticky 改为「缺 ideal 的最近 loaded 祖先」；删除 lastShowing 整集点亮 — acceptance: update 内不再读 `_lastShowing` 回放 (covers: S2)
- [ ] T3: handoff 与 covered 对齐，去掉 kids.every(showing) — acceptance: covered 父隐藏；未 covered 父子可同帧 (covers: S2)
- [ ] T4: markDirty + tile-loaded 触发尽快 update — acceptance: 加载完成后 showing 由下一次 SourceCache.update 决定 (covers: S2; depends: T1)
- [ ] T5: traceVisibility 日志开关 — acceptance: 开启后可见 showing 翻转标签 (covers: S2)
- [ ] T6: 更新/新增 vitest（加载不直接 showing；covered handoff；去旧 reveal/handoff 断言）— acceptance: `npx vitest run src/core/tile` 通过 (covers: S2; depends: T1,T2,T3,T4)
- [ ] T7: tsc + vitest + build 全绿 — acceptance: 三条命令 PASS (covers: S2; depends: T1–T6)
