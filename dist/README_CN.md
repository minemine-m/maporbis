# MapOrbis Core

<div align="center">

**基于 Three.js 的高性能 WebGL 三维地图引擎 🌍**

[![npm version](https://img.shields.io/npm/v/maporbis.svg)](https://www.npmjs.com/package/maporbis)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

[English](./README.md) | 简体中文

</div>

---

## 📖 简介

MapOrbis Core 是一个基于 Three.js 构建的现代化 WebGL 三维地图引擎核心库。它提供了完整的 GIS 可视化能力，支持瓦片地图加载、矢量要素渲染、三维模型展示等丰富功能,适用于构建智慧城市、数字孪生、地理信息系统等应用场景。

### ✨ 核心特性

- 🚀 **高性能渲染** - 基于 Three.js WebGL 引擎，支持大规模数据可视化
- 🗺️ **多源瓦片支持** - 兼容 WMTS、ArcGIS、MapBox、天地图等主流瓦片服务
- 📐 **丰富的要素类型** - 支持点、线、面、标注、模型等多种地理要素
- 🎨 **灵活的样式系统** - 支持动态样式配置与主题切换
- 🎯 **完善的事件系统** - 提供地图交互、要素事件等丰富的事件机制
- 🛠️ **强大的绘制工具** - 内置绘制工具，支持点线面等要素的交互式绘制
- 🌈 **三维效果增强** - 支持天空盒、阴影、HDR、云层等视觉效果
- 📱 **UI 组件系统** - 提供信息窗口、工具提示等常用 UI 组件
- 🔧 **碰撞检测避让** - 智能标注避让，优化密集要素显示效果
- 📦 **模块化设计** - 清晰的代码结构，易于扩展和维护

---

## 🌟 为什么选择 MapOrbis

### 💪 技术优势

**1. 原生 Three.js 架构**
- 完全基于 Three.js 构建，无额外渲染层抽象
- 直接访问 Three.js 场景对象，可自由扩展
- 充分利用 WebGL 的性能优势
- 与 Three.js 生态无缝集成

**2. 专业的 GIS 能力**
- 支持多种坐标系统和投影变换（Web Mercator、WGS84 等）
- 完整的瓦片地图系统，支持海量数据加载
- 兼容主流地图服务（WMTS、ArcGIS、MapBox、天地图）
- 矢量瓦片（MVT）渲染支持

**3. 丰富的可视化能力**
- 二维矢量要素（点、线、面）与三维模型统一管理
- 支持 GLTF/GLB 模型加载，带 Draco 压缩
- 实时阴影、HDR 环境光、后期处理效果
- 粒子云层、水面波纹等特效支持

**4. 灵活的交互体验**
- 完善的事件系统（地图事件、要素事件）
- 内置绘制工具，支持点线面圆等图形绘制
- 智能碰撞检测与标注避让
- 信息窗口、工具提示等 UI 组件

**5. 开发友好**
- TypeScript 编写，完整类型定义
- 清晰的模块化设计，易于理解和扩展
- 丰富的示例和文档
- 支持 ES Module 和 UMD 两种模块格式

### 💡 适用场景

| 场景类型 | 典型应用 | 核心能力 |
|---------|---------|----------|
| **🏙️ 智慧城市** | 城市三维建模、BIM 展示、规划方案对比 | 大规模模型渲染、LOD 控制、图层管理 |
| **🔮 数字孪生** | 工业园区、智慧楼宇、设备监控 | 实时数据绑定、动态更新、状态可视化 |
| **🗺️ 地理信息** | 地形分析、资源分布、管线管理 | 坐标转换、空间查询、缓冲区分析 |
| **🚨 应急指挥** | 态势展示、资源调度、路径规划 | 实时轨迹、热力图、动态标绘 |

### ⚡ 性能特点

- **瓦片按需加载** - 根据视野范围动态加载瓦片，支持数万平方公里数据
- **LOD 层级控制** - 自动根据距离切换模型细节，优化渲染性能
- **四叉树空间索引** - 快速查询可见要素，提升交互响应速度
- **WebGL 实例化渲染** - 批量绘制相同几何体，降低 Draw Call
- **碰撞避让优化** - 智能隐藏重叠标注，保持界面整洁

---
## 📚 核心模块概述

### 🏗️ 核心架构
- **🗺️ Map** - 地图容器，统一管理图层、视图、事件
- **👁️ Viewer** - 基于Three.js的渲染引擎，管理场景、相机、光照
- **📚 Layer System** - 分层管理瓦片、矢量、模型等数据
- **📍 Feature** - 点、线、面、模型等地理要素的抽象
- **🔲 TileSystem** - 支持WMTS、ArcGIS等多源瓦片的动态加载系统

### 🔑 关键特性
- **⚡ 事件系统** - 完整的地图/要素级事件机制
- **✏️ 绘制工具** - 内置交互式绘制（点、线、面、圆等）
- **🎨 UI组件** - InfoWindow、ToolTip等常用组件
- **🎯 碰撞检测** - 智能标注避让，优化密集场景显示
- **🎭 样式系统** - 统一的矢量/模型样式配置

[查看详细API文档 →](链接到详细文档)

---

## 🚀 快速开始

### 📦 安装

```bash
npm install @terra.gl/core three@^0.171.0
```

### ⚡ 5 分钟上手

```javascript
import * as terra from '@terra.gl/core';

// 创建地图
const map = new terra.Map('#map', {
    center: [116.397428, 39.90923, 1000],  // [经度, 纬度, 相机高度]
    basemap: {
        Baselayers: [
            new terra.WMTSTileLayer('base', {
                source: new terra.WMTSSource({
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                }),
                projection: terra.ProjectFactory.createFromID('3857', 0)
            })
        ],
        minLevel: 1,
        maxLevel: 18
    }
});

// 添加标注
const label = new terra.Label({
    geometry: { type: 'Point', coordinates: [116.397428, 39.90923, 0] },
    style: { text: '北京天安门', fontSize: 16, fontColor: '#ffffff' }
});

const pointLayer = new terra.PointLayer('points');
map.addLayer(pointLayer);
label.addTo(pointLayer);
```

查看 `example/` 目录获取更多示例。

---

## 🔧 开发

### 🔨 构建

```bash
# 开发模式（监听文件变化）
npm run dev

# 生产构建
npm run build

# 生成 API 文档
npm run doc
```

### 📂 项目结构

```
packages/core/
├── src/                # 源代码
├── dist/               # 编译输出
├── docs/               # API 文档
├── assets/             # 资源文件
├── package.json        # 包配置
├── tsconfig.json       # TypeScript 配置
├── vite.config.ts      # Vite 构建配置
└── typedoc.json        # 文档生成配置
```
---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 🔗 相关链接

- [Three.js 官网](https://threejs.org/)
- [GeoJSON 规范](https://geojson.org/)
- [WMTS 标准](https://www.ogc.org/standards/wmts)
<!-- - [three-tile 官网](https://sxguojf.github.io/three-tile-doc/1.introduce/01.whatIs/) -->

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

</div>
