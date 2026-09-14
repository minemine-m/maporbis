# Mapbox 式 SourceCache 单一主权改造计划

> 状态：已确认方向，待执行  
> 终态：栅格/矢量共用同一套 retain/covered/showing，无第二套 LOD 主权  
> 基线：`590d23d`（v0.1.0 空洞修复 + atomic handoff + 共享平面）

---

## 0. 是否新开对话

**建议新开会话执行**，本文件作为唯一简报。

原因：

- 本会话已堆满空洞回归史，继续混谈容易又打补丁。
- 改造跨 SourceCache / Tile / TileLayer / VectorTileLayer / tests，适合干净任务列表。
- 新会话开工前：`git pull`，读本文件，从 `PR-1` 开始。

新会话开场提示词可用：

```text
按 docs/mapbox-source-cache-plan.md 执行 Mapbox 式 SourceCache 改造。
从 PR-1 开始，小步：tsc + vitest + build + demo 验证后再进下一步。
禁止在双主权上继续打补丁；showing 只能由 SourceCache 写入。
```

---

## 1. 目标与非目标

### 目标

1. **单一主权**：瓦片集合、加载、释放、可见性只由 `TileSourceCache.update` 决定。
2. **对齐 Mapbox**：ideal / retain / covered / showing；父子是覆盖关系，不是场景图可见性开关。
3. **消灭症状**：父级不消失、子级不出现、多层硬拼贴、闪一下恢复。
4. **矢量同切**：事件与遍历改挂 SourceCache/layer，语义与栅格一致。

### 非目标（本计划不做）

- Fade 观感（另开任务；调度站稳后再做）
- 实例化 / draw call 合并
- 地球（globe）模式专项
- 重写 covering 算法（现有 DFS/bbox 继续用，只收输入输出）

---

## 2. 终态架构

```text
Map
 └─ TileLayer（栅格 / VectorTileLayer 矢量）
      ├─ Transform 输入（由 camera/controls 得出）
      │    center, zoom/coveringZoom, bearing, pitch, viewport, fov
      ├─ SourceCache（每层一份，唯一主权）
      │    _tiles: Map<"z/x/y", Tile>
      │    update():
      │      ideal    = coveringTiles(transform)
      │      retain   = ideal ∪ 盖洞父级 ∪ 盖洞子级
      │      release  = 当前持有 − retain − fadeHold(可选)
      │      add/load = retain 中缺失
      │      covered  = 四个直接子节点 ∈ retain ∧ loaded
      │      showing  = retain ∧ loaded ∧ ¬covered   ← 全引擎唯一写
      │      fire created/loaded/shown/hidden/unload
      └─ 渲染
           栅格：showing 的 Tile 材质
           矢量：showing 的 tile bucket
```

### 不变量（评审红线）

| ID | 不变量 |
|----|--------|
| I1 | 只有 `SourceCache` 可对 tile 赋值 `showing` |
| I2 | 不得 dispose / release 仍在 `retain ∪ ideal` 的瓦片 |
| I3 | 加载完成只标 dirty，不直接 `showing=true` |
| I4 | `LODEvaluate` 不得作为释放/可见性权威（PR-3 后删除） |
| I5 | 栅格与矢量共用同一 SourceCache 事件语义 |
| I6 | 任何 PR 合并前：`emptyLoaded=0`，settle 后 showing 仅目标 z（或合法 underlay） |

---

## 3. 现状清单（执行时再核对）

### 已存在、可复用

| 资产 | 路径 | 备注 |
|------|------|------|
| 扁平 `_tiles` Map | `SourceCache.ts` | 已有 |
| ideal/retain/covered | `SourceCache.ts` | 已有，需收编 add/release |
| covering DFS + bbox fill | `coveringTiles.ts` | 保留 |
| payload cache | `TileCache` / `_payloadCache` | 保留 |
| 加载队列 / 并发 | `Tile.ts` static queue | 保留 |
| 共享 PlaneGeometry | `CompositeTileLoader` | 保留 |
| 空载荷恢复 | SourceCache recover + `hasRenderPayload` | 保留 |

### 双主权冲突点（必须拆）

| 写入方 | 位置 | 问题 |
|--------|------|------|
| LODEvaluate create/remove | `util.ts` + `Tile.update` | 递归 dispose 子树 |
| `_revealIfIdeal` | `Tile.ts` | 加载完成直接 showing |
| sticky lastShowing + 祖先 | `SourceCache.update` | 第二写入 |
| `applyAtomicChildHandoff` | `SourceCache.ts` | 只看直接子 showing |
| `_refreshCoverVisibility` | `Tile.ts` | 旧 cover |
| `TileLayer.update` 双步 | rootTile.update → sourceCache.update | 两套主权 |

### 矢量耦合点（必须迁）

| 依赖 | 位置 |
|------|------|
| `tile-created` → dataOnly + listeners | `VectorTileLayer.ts` |
| `tile-loaded` → processTileData | 同上 |
| `tile-shown` / `tile-hidden` | 补渲染 / 藏父 mesh |
| `tile-unload` | 清要素 |
| `traverse(_rootTile)` | getVisible / refresh |

---

## 4. 删除清单（终态）

```text
[ ] Tile._revealIfIdeal
[ ] SourceCache applyAtomicChildHandoff（covered 替代）
[ ] SourceCache sticky 整集 lastShowing（父级靠 retain 垫底）
[ ] Tile._refreshCoverVisibility 及相关测试对它的依赖
[ ] LODEvaluate / LODAction 作为结构主权（PR-3 起）
[ ] LOD remove → _disposeResources 无条件 clear 子树
[ ] TileLayer 中 “rootTile.update 决定结构” 的主路径
[ ] 矢量对 _rootTile 树遍历的依赖（改为 SourceCache）
```

保留但降级：`Tile` 仍为 Mesh/数据载体；`_rootTile` 可暂作 group 壳。

---

## 5. PR 序列（小步，每步可回滚）

> 分支：每 PR 一个 `feat/sc-mapbox-prN`，从上一 PR 末端切出。  
> 合并：远程 master 快进或 PR；禁止在 feat 分支上叠无关补丁。

---

### PR-1 单一 showing 写入方（行为收敛，不改变换）

**范围**

1. 删除 `_revealIfIdeal` 及所有非 SourceCache 的 `tile.showing =` 生产调用。
2. 加载完成 → `layer.markDirty()` / `sourceCache.invalidate()`，尽快跑一次 `update`（可保留 interval，但 dirty 优先）。
3. sticky：仅当 ideal 格子缺 loaded 时，为**该格子的最近 loaded 祖先** showing（仍由 SourceCache 在 update 内写）；去掉整集 lastShowing 点亮。
4. `applyAtomicChildHandoff`：改为与 covered 一致——父级在 `covered` 时必隐藏；未 covered 时允许父+子同帧（靠 polygonOffset），**不再**用 `kids.every(showing)`。
5. 日志开关 `TileSourceCache.traceVisibility`：记录本帧 showing 翻转及写入方标签。

**验收**

- [ ] 全库 grep：生产代码仅 SourceCache 写 `showing`
- [ ] 缩放/平移：无空洞；可有父+子叠（过渡），settle 后单 z
- [ ] `emptyLoaded=0`
- [ ] vitest：删除/改写 reveal、handoff 旧断言；新增 “加载不直接 showing”

**风险**：中（空洞若 dirty 不跑会回来）→ dirty 后同步 update 一次。

---

### PR-2 SourceCache 收编 add / release

**范围**

1. `_addTile(z,x,y)`：创建或取回 Tile，设置 transform（PR-1 阶段仍可用现有树 `ensureTilePath`），注册 `_tiles`，发 `tile-created`。
2. `release`：对 `_tiles` 中 `∉ retain` 且非 fadeHold 的 tile：`unload`、从 scene 摘除、发 `tile-unload`；**禁止** release 仍被 ideal 引用的祖先路径上的节点（由 retain 保证）。
3. 删除/旁路 `LODAction.remove` 的 dispose（改为 “LOD 不再 remove”，或 remove 空操作）。
4. `TileLayer.update` 只调用 `sourceCache.update`，不再先 `rootTile.update` 做结构决策（frustum/dist 可并入 SourceCache 或保留只读 traverse）。

**验收**

- [ ] 缩放回退再前进：无“整棵子树被拆导致的随机空洞”
- [ ] `_tiles.size` 与 retain 量级一致（无无限膨胀）
- [ ] payload cache 命中仍工作（放大缩小）
- [ ] vitest：release 不释放 retain；ideal 子树不被 dispose

**风险**：中高（内存与节点泄漏）→ 加 size 断言与 demo 面板。

---

### PR-3 移除 LOD 结构主权

**范围**

1. `LODEvaluate` / `LODAction.create|remove` 不再驱动场景图。
2. 建树仅：SourceCache 在 `_addTile` 时按需创建（扁平或一层 parent，见 PR-4）。
3. `Tile.update` 删除整树 LOD traverse；或 Tile.update 整文件废弃。
4. 更新 `LOD.*.test.ts`：改为测 SourceCache add/release，或删除并并入 SourceCache 测试。

**验收**

- [ ] 无 LODEvaluate 调用点（除测试若保留纯函数）
- [ ] 混 z / pitch：ideal 集不被统一 targetZ 误删
- [ ] 全量 vitest + demo

**风险**：中（若 PR-2 未稳不要做）。

---

### PR-4 扁平变换（真 Mapbox 坐标）

**范围**

1. 由现层级矩阵反推公式（必须单测对拍）：

```text
// 现：root.scale = (mapW, mapH, 1)，root.rotation.x = -π/2
// 子：scale 0.5，position ±0.25（父局部）
// 目标：Tile 挂在 layer.group 下，局部
//   sx = mapW / 2^z
//   sy = mapH / 2^z
//   px = (x + 0.5) / 2^z * mapW - mapW / 2   // 与现中心对齐，以单测为准
//   py = (y + 0.5) / 2^z * mapH - mapH / 2
// 再经 root 旋转到世界（与现一致：XZ 地面、Y-up）
```

2. 实现 `tile.setTileTransform(z,x,y, projection)`；`matrixAutoUpdate` 策略明确。
3. 单测：同一 (z,x,y) 在「旧树连乘」与「新公式」下 world position/scale 误差 &lt; 1e-3。
4. 矢量要素仍挂 tile 局部系 → 自动跟随。

**验收**

- [ ] 对拍单测 100% 通过（覆盖 z=0..14 若干点）
- [ ] demo 东京中心：位置无偏移、无重影
- [ ] pitch/bearing 抽检

**风险**：**高** → 单独 PR，禁止与调度逻辑混提。

---

### PR-5 矢量事件与遍历迁移

**范围**

| 旧 | 新 |
|----|-----|
| `_rootTile` tile-created | layer 转发 SourceCache `_addTile` |
| tile-loaded | SourceCache load 完成 |
| tile-shown/hidden | showing 翻转时派发 |
| tile-unload | release |
| traverse root | `sourceCache` 遍历 retain/showing |
| hidden 时藏父 mesh | 父 showing=false 即不画（删除补丁 listener） |

**验收**

- [ ] 矢量 demo：线面与栅格 LOD 同步，无“线在底图洞上”
- [ ] 切换图层可见性、改颜色、过滤器
- [ ] 无重复 processTileData 风暴（日志计数）

**风险**：中高 → 必须与栅格同版本验证。

---

### PR-6 清理与文档

- 删除死代码、旧测试、`scratch` 探针
- 更新 demo 面板：retain/covered/showing/dirty
- README 或本文件标记完成
- tag：`v0.2.0-sourcecache`

---

## 6. SourceCache.update 伪代码（终态）

```text
function update(transform, loader, projection):
  dirty = false
  ideal = computeCoveringTiles(transform)          // 可混 z
  retain = new Set(ideal.keys)

  for key in ideal where not loaded(key):
    retain |= ancestorsToFirstLoaded(key)          // Mapbox 父级垫底
  for key in retain where missing coverage:
    retain |= loadedDescendantsCovering(key)

  // release
  for tile in tiles where key ∉ retain:
    if tile.loading: abort
    unload(tile); scene.remove(tile); fire unload
    tiles.delete(key)

  // add + load
  for key in retain:
    tile = tiles.get(key) ?? addTile(key)
    if not tile.loaded and not tile.loading:
      requestLoad(tile)

  loaded = {k in retain | tiles[k].loaded}
  covered = {k in retain | all 4 children in retain and in loaded}

  for tile in tiles:
    show = tile.key in retain and tile.loaded and tile.key not in covered
    if tile.showing != show:
      tile.showing = show                          // 唯一写
      fire shown/hidden

  snapshot = ...
  return snapshot
```

加载完成回调：

```text
onTileLoaded(tile):
  layer.markDirty()   // 下一帧或立即 update；禁止 showing=true
```

---

## 7. 测试计划

### 单元

| 用例 | PR |
|------|-----|
| 加载完成不直接 showing | 1 |
| 仅 SourceCache 写 showing（spy） | 1 |
| retain 外 release；retain 内不 dispose | 2 |
| ideal 子树在混 z 下不被 remove | 2/3 |
| covered：四子齐 → 父不显示 | 1 |
| 公式变换 vs 旧树对拍 | 4 |
| 矢量事件次数与 key | 5 |

### Demo 手工清单（每 PR）

1. 东京初始 z≈13 settle：无洞、单 z showing  
2. 放大到街景再缩小：无空洞、无永久父级  
3. 平移甩动：无随机灰块  
4. pitch 0→60°：无大面积闪白  
5. 矢量开关/改色：与栅格同步  
6. 面板：`emptyLoaded=0`，queue 收敛  

### 回归命令

```bash
cd packages/maporbis
npx tsc --noEmit   # 或 npm run build 内含 tsc
npx vitest run src/core/tile src/loaders
npm run build
# demo: examples/maporbis-examples, vite :3000, CDP 验证
```

---

## 8. 风险与回滚

| 风险 | 缓解 |
|------|------|
| dirty 不跑 → 空洞 | markDirty 后同步 update；hidden tab 文档说明 |
| release 过猛 → 闪 | retain 含祖先；先软删（不 dispose）一版再硬删 |
| 扁平变换偏移 | PR-4 独立 + 对拍单测 + 双路径开关 `options.flatTiles` |
| 矢量双绘/漏绘 | PR-5 与栅格同测；事件计数日志 |
| 内存涨 | release 真删；payload cache 上限；面板 size |

回滚：每 PR 独立分支；远程 master 可 revert 单 PR；PR-4 建议 feature flag。

---

## 9. 建议执行方式

| 项 | 建议 |
|----|------|
| 新对话 | **要**。本文件作简报，从 PR-1 开 |
| 分支 | `feat/sc-mapbox-pr1` … `pr6` |
| 节奏 | 一 PR 一合并，禁止跨 PR 大爆炸 |
| 沟通 | 每 PR 结束：空洞结论 + 面板数字 + 截图 |
| Fade / 性能 | **全部做完 PR-1..5 并稳定后再开** |

---

## 10. 工作量粗估

| PR | 估时（熟悉代码者） |
|----|-------------------|
| 1 单一写入 | 0.5–1 日 |
| 2 add/release | 1–2 日 |
| 3 去 LOD 主权 | 0.5–1 日 |
| 4 扁平变换 | 1–2 日 |
| 5 矢量迁移 | 1–2 日 |
| 6 清理 | 0.5 日 |

合计约 **5–9 人日**（不含 fade）。

---

## 11. 完成定义（DoD）

- [ ] I1–I6 全部满足  
- [ ] 手工清单 1–6 通过  
- [ ] 无 LODEvaluate 结构调用  
- [ ] 矢量/栅格共用 SourceCache 事件  
- [ ] tag `v0.2.0-sourcecache` + 本文件更新为 “已落地”
