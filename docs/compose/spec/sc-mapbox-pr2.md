---
feature: sc-mapbox-pr2
status: delivered
updated: 2026-09-15
branch: feat/sc-mapbox-pr2
commits: 50f14c6..HEAD
---

# SourceCache 收编 add / release（PR-2 重做）

## Report

**What was built** — PR-2 在 `50f14c6` 骨架上按严格 Mapbox 契约重做。`_idealRetain=true` 时 TileLayer 不再跑 LOD `rootTile.update`；结构仅由 `ensureTilePath` 建、SourceCache release 收。retain = ideal ∪ 盖 missing 的已加载子级 ∪ missing 的最近已加载祖先 ∪ missing 的未加载直接父级一层。网络只拉 missing ideal + 那一层父级。settled 时 showing 仅 `ideal.z`；in-flight 允许 underlay/cover，不挖天空盒。SourceCache 请求的瓦片标记 `inFrustum`，避免队列 prune 丢掉 underlay。

**Verification** — `vitest src/core/tile` PASS 66；`tsc --noEmit` PASS；`npm run build` PASS。独立评审 9 条 acceptance 全过；唯一非阻断项（`inFrustum` 未刷新导致 prune）已在交付前修掉。

**Journey log**
- 骨架后的连环热修互相打架（warm 祖先链 ↔ 漏底 ↔ 多 z 请求），根因是契约未钉死就打补丁。
- 重做前 `git reset --hard 50f14c6`，在干净底座上一次实现四条 retain 并集 + settle 单 z。
- `_idealRetain` 跳过 LOD 后 `Tile.inFrustum` 永不刷新，queue prune 会误杀 underlay load——SourceCache request 时显式置 true。
- 不要对已加载 ideal 做多级祖先预取：那是上次「平移也拉 z5–z8」的来源。

## [S1] Problem

PR-1 后 showing 只由 SourceCache 写，但结构仍双主权：LOD create/remove 会 dispose 子树，retain 的瓦片被拆掉 → 洞。骨架 `50f14c6` 已收编 add/release，但加载/underlay/settle 契约未钉死，后续热修互相打架。

用户选定契约：**严格 Mapbox**。

## [S2] Design

### 主权

- `_idealRetain=true` 时 TileLayer **不**调用 `rootTile.update`（无 LOD create/remove）。
- 建树仅 `ensureTilePath`（缺啥建啥，不重复整叉）。
- `LODAction.remove` 空操作。
- showing 唯一写：`SourceCache._setShowing`。

### retain（Mapbox `_updateRetainedTiles`）

```
retain =
    ideal
  ∪ 已加载且能盖住 missing ideal 的子级（topmost loaded descendant）
  ∪ missing ideal 的最近已加载祖先（underlay，只 retain 已有节点）
  ∪ missing ideal 的直接父级（若未加载，仅此一层，供网络请求）
```

**禁止**：对已加载 ideal 再向上预取 z-1..z-N；禁止每帧 warm 祖先链。

### covered / showing

- `covered`：四个直接子均 `retain ∧ loaded`。
- `showing = retain ∧ loaded ∧ ¬covered`。
- **in-flight**（有 missing ideal）：允许父 underlay / 子 cover 与 ideal 同帧（不挖洞）。
- **settled**（ideal 全 loaded）：`showing` 仅 `z === ideal.z`（pitch 0 单 z）。

### 网络加载

仅请求：

1. missing ideals（最高优先）
2. retain 中未加载的节点 —— 按上面 retain 定义，未加载非 ideal 最多是 **直接父级一层**

平移同级、放大更细、缩小更粗；不拉无关祖先链。SourceCache `requestLoad` 前将 `inFrustum=true`，防止 prune 误杀 underlay。

### release

每帧 update 末：`key ∈ _tiles ∧ key ∉ retain ∧ key ∉ structural(ideal 路径祖先)`：

1. `_setShowing(false)`
2. `releasePayloadForCache`（浅，不递归）
3. 无 tile 子则 `parent.remove` + `tile-unload` + `_tiles.delete`
4. 有子壳保留（变换用）

### dirty

`tile-loaded` → `markDirty` + `queueMicrotask` live driver（当前相机重建 ctx）。`_inUpdate` 防嵌套。

## [S3] Out of Scope

- Fade、扁平变换（PR-4）、矢量事件（PR-5）、删除 LODEvaluate 本体（PR-3）
- 多级祖先预取、distance LOD 混 z

## Tasks

- [x] T1: retain 改为 Mapbox 四条并集（无多级 warm）— acceptance: 单测 ideal z=2 时网络不请求 z0 (covers: S2)
- [x] T2: settled 仅 ideal.z；in-flight 允许 underlay/cover — acceptance: 全 loaded 单 z；冷父级缩小时子级仍 showing (covers: S2)
- [x] T3: ensureTilePath 不重复整叉；LOD 有 ideal 时不 enqueue 祖先 — acceptance: 无重复 z/x/y 场景节点 (covers: S2)
- [x] T4: release ∉ retain∪structural；浅释放 — acceptance: SourceCache.release 单测 (covers: S2; depends: T1)
- [x] T5: tsc + vitest + build — acceptance: PASS 66 tests (covers: S2; depends: T1–T4)
