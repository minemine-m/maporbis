# 🌍 MapOrbis

> A powerful 3D GIS engine built with Three.js

[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](packages/maporbis/package.json)
[![Three.js](https://img.shields.io/badge/Three.js-0.185+-black.svg)](https://threejs.org/)

**MapOrbis** is an open-source 3D GIS engine designed for high-performance map visualization. Built on Three.js, it brings native WebGL rendering capabilities to geographic data.

## ✨ Features

- 🗺️ **3D Globe & Flat Map** - Globe and flat map rendering
- 🎨 **Multiple Data Sources** - OSM, ArcGIS, WMTS, Mapbox, Tianditu, MVT
- 🏔️ **Atmosphere Effects** - Dynamic sky with presets (sunny, sunset, night...)
- 📦 **Vector Tiles** - High-performance vector tile rendering
- 🏗️ **3D Models** - Load and display glTF/GLB models
- 🛠️ **Feature Editing** - Click, hover, info windows, tooltips

## 🚀 Quick Start

```bash
npm install maporbis three
```

```typescript
import { Map, ImageTileSource, TileLayer, AtmosphereLayer, ATMOSPHERE_PRESETS } from 'maporbis';

const map = new Map({
  container: document.getElementById('map')!,
  state: { center: [116.397, 39.909], zoom: 12 },
  camera: { pitch: 45 },
});

// Add tiles
map.addLayer(new TileLayer({
  id: 'base',
  source: new ImageTileSource({ url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' }),
}));

// Add atmosphere
const atmosphere = new AtmosphereLayer('atmosphere');
map.addLayer(atmosphere);
atmosphere.update(ATMOSPHERE_PRESETS.sunset);
```

## 📦 Install

```bash
npm install maporbis three
# or
pnpm add maporbis three
```

## 🛠️ Development

```bash
pnpm install
pnpm dev
```

## 📄 License

[GNU Lesser General Public License v3.0](LICENSE)
