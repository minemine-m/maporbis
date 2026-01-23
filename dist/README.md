# MapOrbis Core

<div align="center">

**High-Performance WebGL 3D Map Engine Based on Three.js 🌍**

[![npm version](https://img.shields.io/npm/v/maporbis.svg)](https://www.npmjs.com/package/maporbis)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

English | [简体中文](./README_CN.md)

</div>

---

## 📖 Introduction

MapOrbis Core is a modern WebGL 3D map engine built on Three.js. It provides complete GIS visualization capabilities, supporting tile map loading, vector feature rendering, 3D model display, and more. Perfect for building smart cities, digital twins, geographic information systems, and other applications.

### ✨ Core Features

- 🚀 **High-Performance Rendering** - Built on Three.js WebGL engine, supports large-scale data visualization
- 🗺️ **Multi-Source Tile Support** - Compatible with WMTS, ArcGIS, MapBox, Tianditu, and other mainstream tile services
- 📐 **Rich Feature Types** - Supports points, lines, polygons, labels, models, and other geographic features
- 🎨 **Flexible Style System** - Dynamic style configuration and theme switching
- 🎯 **Complete Event System** - Rich event mechanisms for map interaction and feature events
- 🛠️ **Powerful Drawing Tools** - Built-in drawing tools for interactive creation of points, lines, polygons, etc.
- 🌈 **3D Effect Enhancement** - Supports skybox, shadows, HDR, clouds, and other visual effects
- 📱 **UI Component System** - Provides info windows, tooltips, and other common UI components
- 🔧 **Collision Detection** - Smart label avoidance for optimized dense feature display
- 📦 **Modular Design** - Clear code structure, easy to extend and maintain

---

## 🌟 Why Choose MapOrbis

### 💪 Technical Advantages

**1. Native Three.js Architecture**
- Fully built on Three.js with no additional rendering layer abstraction
- Direct access to Three.js scene objects for free extension
- Full utilization of WebGL performance advantages
- Seamless integration with Three.js ecosystem

**2. Professional GIS Capabilities**
- Support for multiple coordinate systems and projection transformations (Web Mercator, WGS84, etc.)
- Complete tile map system supporting massive data loading
- Compatible with mainstream map services (WMTS, ArcGIS, MapBox, Tianditu)
- Vector tile (MVT) rendering support

**3. Rich Visualization Capabilities**
- Unified management of 2D vector features (points, lines, polygons) and 3D models
- GLTF/GLB model loading with Draco compression
- Real-time shadows, HDR environment lighting, post-processing effects
- Particle clouds, water ripples, and other special effects support

**4. Flexible Interactive Experience**
- Complete event system (map events, feature events)
- Built-in drawing tools supporting points, lines, polygons, circles, etc.
- Smart collision detection and label avoidance
- Info windows, tooltips, and other UI components

**5. Developer Friendly**
- Written in TypeScript with complete type definitions
- Clear modular design, easy to understand and extend
- Rich examples and documentation
- Supports both ES Module and UMD module formats

### 💡 Use Cases

| Category | Typical Applications | Core Capabilities |
|---------|---------|----------|
| **🏙️ Smart City** | Urban 3D modeling, BIM display, planning comparison | Large-scale model rendering, LOD control, layer management |
| **🔮 Digital Twin** | Industrial parks, smart buildings, equipment monitoring | Real-time data binding, dynamic updates, state visualization |
| **🗺️ GIS** | Terrain analysis, resource distribution, pipeline management | Coordinate conversion, spatial query, buffer analysis |
| **🚨 Emergency Command** | Situation display, resource scheduling, route planning | Real-time tracking, heatmaps, dynamic plotting |

### ⚡ Performance Features

- **On-Demand Tile Loading** - Dynamically loads tiles based on viewport, supports tens of thousands of square kilometers of data
- **LOD Level Control** - Automatically switches model detail based on distance, optimizing rendering performance
- **Quadtree Spatial Indexing** - Fast query of visible features, improving interaction response speed
- **WebGL Instanced Rendering** - Batch drawing of identical geometries, reducing draw calls
- **Collision Avoidance Optimization** - Intelligently hides overlapping labels, keeping interface clean

---

## 📚 Core Module Overview

### 🏗️ Core Architecture
- **🗺️ Map** - Map container, unified management of layers, views, events
- **👁️ Viewer** - Three.js-based rendering engine, manages scenes, cameras, lighting
- **📚 Layer System** - Layered management of tiles, vectors, models, and other data
- **📍 Feature** - Abstraction of geographic elements such as points, lines, polygons, models
- **🔲 TileSystem** - Dynamic loading system supporting multi-source tiles like WMTS, ArcGIS

### 🔑 Key Features
- **⚡ Event System** - Complete map/feature-level event mechanism
- **✏️ Drawing Tools** - Built-in interactive drawing (points, lines, polygons, circles, etc.)
- **🎨 UI Components** - InfoWindow, ToolTip, and other common components
- **🎯 Collision Detection** - Smart label avoidance, optimized dense scene display
- **🎭 Style System** - Unified vector/model style configuration

[View Detailed API Documentation →](link-to-detailed-docs)

---
## 🚀 Quick Start

### 📦 Installation

```bash
npm install @terra.gl/core three@^0.171.0
```

### ⚡ 5-Minute Guide

```javascript
import * as terra from '@terra.gl/core';

// Create map
const map = new terra.Map('#map', {
    center: [116.397428, 39.90923, 1000],  // [longitude, latitude, camera height]
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

// Add label
const label = new terra.Label({
    geometry: { type: 'Point', coordinates: [116.397428, 39.90923, 0] },
    style: { text: 'Tiananmen Square', fontSize: 16, fontColor: '#ffffff' }
});

const pointLayer = new terra.PointLayer('points');
map.addLayer(pointLayer);
label.addTo(pointLayer);
```

See the `example/` directory for more examples.



---

## 🔧 Development

### 🔨 Build

```bash
# Development mode (watch file changes)
npm run dev

# Production build
npm run build

# Generate API documentation
npm run doc
```

### 📂 Project Structure

```
packages/core/
├── src/                # Source code
├── dist/               # Compiled output
├── docs/               # API documentation
├── assets/             # Asset files
├── package.json        # Package configuration
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite build configuration
└── typedoc.json        # Documentation generation configuration
```
## 🤝 Contributing

Issues and Pull Requests are welcome!

---

## 🔗 Related Links

- [Three.js Official Website](https://threejs.org/)\
- [GeoJSON Specification](https://geojson.org/)
- [WMTS Standard](https://www.ogc.org/standards/wmts)
<!-- - [three-tile Website](https://sxguojf.github.io/three-tile-doc/1.introduce/01.whatIs/) -->
---

<div align="center">

**If this project helps you, please give it a ⭐️ Star!**

</div>
