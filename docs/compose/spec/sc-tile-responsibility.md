---
feature: sc-tile-responsibility
status: in-progress
updated: 2026-09-16
branch: feat/sc-tile-responsibility
commits: 
---

# Tile 职责拆分（对齐 Mapbox 边界）

## Report

## [S1] Problem

PR-1～4 已把 **结构 / retain / showing / 扁平变换** 收到 `TileSourceCache`，但 `Tile` 仍是上帝对象：

1. **静态全局调度器**压在 `Tile` 上（`_loadQueue`、`_activeDownloads`、优先级、prune、abort、interacting 节流）。
2. **事件总线挂在 root Tile**：`tile-created/loaded/unload/shown/hidden` 由 Tile 自身或 loader 回调派发；`VectorTileLayer` 直接绑 `_rootTile`，与 Mapbox「SourceCache 事件」不一致。
3. **Mesh 与数据载荷混在一类**：栅格 `geometry+materials`、矢量 `_vectorData`、`dataMode`、payload LRU、depth-bias、`hasRenderPayload` 全在 `Tile`；`VectorTileLayer` 还通过 `tile.getVectorData()` / `geometry` 取数。

目标终态与 Mapbox 对齐的**边界**（非 1:1 类名）：调度独立、事件主权在 SourceCache、载荷与 Mesh 可区分。

## [S2] Design

### 2.1 终态边界

```text
TileLoadScheduler          ← 全局队列 / 并发 / 优先级 / prune / abort
TilePayload                ← raster geometry+materials | vector data
Tile (extends Mesh)        ← xyz + state + showing + transform + 应用/释放载荷
TileSourceCache            ← ideal/retain/covered/showing + 结构 + 事件总线
TileLayer / VectorLayer    ← 只听 SourceCache 事件，不再绑 root Tile 事件
```

Mapbox 对照（只借边界，不搬 WebGL 桶流水线）：

| Mapbox | MapOrbis 终态 |
|--------|----------------|
| SourceCache retain/showing | 已有 `TileSourceCache` |
| Source/worker 请求调度 | `TileLoadScheduler` |
| Tile buckets / texture | `TilePayload` |
| Tile 不是场景对象 | `Tile` 仍为 Mesh（Three.js 必需），但 **不再承载调度与事件总线职责** |

### 2.2 TileLoadScheduler（新文件 `core/tile/TileLoadScheduler.ts`）

从 `Tile` 静态成员**原样搬迁**行为，保持共享跨层队列（栅格+矢量同一预算，与现状一致）：

```text
enqueue(tile, loader, idealKeys?)
drain()
prune()
purge(tile)
setIdealTileSet / ideal stats（stats/demo 用）
interacting / effectiveMaxConcurrentDownloads
getScheduleStats()
```

契约：

- `Tile.requestLoad` / 静态队列删除；`SourceCache` 改为 `scheduler.enqueue(...)`。
- 优先级公式、`MAX_QUEUE=160`、交互并发 20、underlay 带 `[0,1)` **不改**（feel 契约红线）。
- 调度器只读 `tile.state/distToCamera/z/x/y/_canStartLoading()`，不写 `showing`。

### 2.3 事件主权：SourceCache 为总线

| 旧（root Tile） | 新（SourceCache） |
|-----------------|-------------------|
| `tile-created` | `ensureTilePath` 后 `cache.dispatch('tile-created')` |
| `tile-loaded` | 调度完成 / `Tile._onLoadComplete` → `cache.dispatch('tile-loaded')` |
| `tile-unload` | release 路径 |
| `tile-shown` / `tile-hidden` | `_setShowing` 翻转时 |
| Vector 监听 root | `VectorTileLayer` 监听 `sourceCache` |

- `Tile` 不再在 `showing` setter 里派发 `tile-shown/hidden`（写入方已是 SourceCache，事件同源）。
- `TileLayer` 仍持有 `_rootTile` 作场景 group 壳；`VectorTileLayer` 停止 `addEventListener` 到 `_rootTile`。
- 测试：`sourceCache` 上可 `addEventListener`；兼容保留 root 上转发一层（过渡期），验收以生产无 root 监听为准。

### 2.4 TilePayload：载荷与 Mesh 分离

新类型（`core/tile/TilePayload.ts` 或并入现有 Tile 导出）：

```ts
type TilePayloadKind = "raster" | "vector";

interface TilePayload {
  kind: TilePayloadKind;
  // raster
  geometry?: BufferGeometry;
  materials?: Material[];
  // vector
  vectorData?: unknown;
}
```

`Tile` 行为收敛：

- `applyPayload(p)`：写入 Mesh 的 geometry/material，或只挂 `vectorData`。
- `clearPayload()`：换回 placeholder / 清 vector。
- `hasRenderPayload()`：只问 payload，不扫 placeholder 细节（逻辑等价）。
- `_dataMode` → `payloadKind === "vector"`（保留 `setDataOnlyMode` 薄包装以免大爆 API）。
- payload LRU：仍在 root `_payloadCache`，读写 `TilePayload`；cache-hit **独占 delete** 不变。
- depth-bias / material.visible 同步仍在 `applyPayload` 内（栅格路径）。

`VectorTileLayer.getVectorDataFromTile` 改为 `tile.payload?.vectorData`，不再依赖 `tile.geometry` 存在。

### 2.5 加载路径归属

- `_loadData` 可留在 `Tile` 实例方法，由 Scheduler 触发；**或** 移到 `TilePayloadLoader` 辅助。优先：实例方法 + payload 应用，避免再拆一层文件导致 diff 爆炸。
- 状态机 / 重试 / AbortController 留在 Tile（Mapbox 的 `state` 也在 Tile）。
- 成功后：`applyPayload` → `state=Loaded` → 回调 SourceCache 标 dirty / 派发 loaded（不直接 showing）。

### 2.6 契约红线（不回归 PR-1～4 / feel）

- showing 仅 `SourceCache._setShowing`
- retain = ideal ∪ 覆盖 missing 的 loaded 子 ∪ loaded 祖先
- 扁平 `setTileTransform`，生产无层级 createChildren
- ideal 优先级 / underlay / incomplete hold / 距离 LOD 不动
- `emptyLoaded=0` after recover
- 共享调度预算跨栅格/矢量（禁止每层独立队列导致底图饿死）

## [S3] Out of Scope

- Mapbox worker/bucket/FeatureIndex 完整流水线
- Fade 观感、globe、HTTP expired 状态机扩展
- 改 covering DFS 公式
- 删除 `Tile extends Mesh`（渲染仍需要）

## Tasks

- [ ] T1: 抽出 `TileLoadScheduler`，替换 `Tile` 静态队列；SourceCache/测试改引用 — acceptance: 生产代码无 `Tile._loadQueue`/`Tile.requestLoad`；`feel.schedule` + holes + release 测试 PASS (covers: S2.2)
- [ ] T2: SourceCache 事件总线：created/loaded/unload/shown/hidden 从 SourceCache 派发；VectorTileLayer 改听 sourceCache — acceptance: VectorTileLayer 不再 `addEventListener` 到 `_rootTile`；矢量 loaded/hide/show/unload 行为与改前等价 (covers: S2.3; depends: T1)
- [ ] T3: `TilePayload` + `applyPayload`/`clearPayload`/`hasRenderPayload`；矢量取数走 payload.vectorData — acceptance: Vector 不读 `tile.geometry` 取数据；raster 路径 depth-bias 与 cache-hit 仍工作 (covers: S2.4; depends: T1)
- [ ] T4: 清理 Tile 冗余静态/事件类型；`tsc` + `vitest src/core/tile` + `npm run build` — acceptance: 全绿；`emptyLoaded` 快照仍可读 (covers: S2; depends: T1,T2,T3)
