# 🌍 MapOrbis

> A powerful 3D GIS engine built with Three.js

[![License: LGPL v3](https://img.shields.io/badge/License-LGPL%20v3-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](packages/maporbis/package.json)
[![Three.js](https://img.shields.io/badge/Three.js-0.185+-black.svg)](https://threejs.org/)

**MapOrbis** is an open-source 3D GIS engine designed for high-performance map visualization. Built on top of Three.js, it brings native WebGL rendering capabilities to geographic data, enabling developers to create immersive 3D map experiences.

## ✨ Features

### 🗺️ Core Mapping

- **3D Globe & Flat Map** - Render maps in both 3D globe and 2D flat projections
- **Multi-Projection Support** - Web Mercator (EPSG:3857), WGS84 (EPSG:4326), and custom projections
- **Smooth Camera Controls** - Fly-to animations, easing transitions, pitch & bearing control
- **Tile-Based Rendering** - Efficient map tile loading and caching system

### 📦 Data Sources

| Source Type | Description |
|-------------|-------------|
| `ImageTileSource` | Standard raster tile images (PNG/JPG) |
| `MVTSource` | Mapbox Vector Tiles |
| `MVTGeoSource` | Vector tiles with GeoJSON overlay |
| `ArcGisSource` | ArcGIS tile services |
| `WMTSSource` | OGC Web Map Tile Service |
| `TDTSource` | Tianditu (天地图) services |
| `MapBoxSource` | Mapbox tile services |

### 🎨 Rendering Layers

| Layer | Description |
|-------|-------------|
| `TileLayer` | Base raster tile layer |
| `VectorTileLayer` | High-performance vector tile rendering |
| `AtmosphereLayer` | Dynamic sky & atmosphere effects |
| `CloudsLayer` | Procedural cloud generation |
| `LineLayer` | Line geometry rendering |
| `PointLayer` | Point geometry rendering |
| `PolygonLayer` | Polygon geometry rendering |
| `OverlayLayer` | Custom overlay management |

### 🏔️ Atmosphere & Sky

Dynamic atmosphere system with built-in presets:

```typescript
import { AtmosphereLayer, ATMOSPHERE_PRESETS } from 'maporbis';

const atmosphere = new AtmosphereLayer('atmosphere');
map.addLayer(atmosphere);

// Apply preset
atmosphere.update(ATMOSPHERE_PRESETS.sunset);

// Time of day presets
// - sunny, cloudy, overcast, fog
// - sunrise, morning, sunset
// - nightsky, night
```

### 🏗️ 3D Features

- **ModelFeature** - Load and display 3D models (glTF/GLB)
- **Point** - Point markers with custom styling
- **LineString** - Polylines with dynamic styling
- **Polygon** - Filled polygons with extrusion support
- **Surface** - Textured surface rendering
- **Label** - Text labels with collision detection
- **MultiLineString** - Multi-part line geometries
- **ICloud** - Interactive cloud points

### 🛠️ Developer Tools

- **Feature Events** - Click, hover, and interaction events on features
- **Info Windows** - Popup information windows
- **Tooltips** - Hover tooltips
- **Feature Editing** - Built-in geometry editing

## 🚀 Quick Start

### Installation

```bash
npm install maporbis three
# or
pnpm add maporbis three
```

### Basic Usage

```typescript
import { Map, ImageTileSource, TileLayer, AtmosphereLayer, ATMOSPHERE_PRESETS } from 'maporbis';
import * as THREE from 'three';

// Initialize map
const map = new Map({
  container: document.getElementById('map')!,
  state: {
    center: [116.397, 39.909], // Beijing [lng, lat]
    zoom: 12,
  },
  camera: {
    pitch: 45,
    bearing: 0,
  },
  renderer: {
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
  },
});

// Add base tile layer
const baseLayer = new TileLayer({
  id: 'base',
  source: new ImageTileSource({
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  }),
});
map.addLayer(baseLayer);

// Add atmosphere
const atmosphere = new AtmosphereLayer('atmosphere');
map.addLayer(atmosphere);
atmosphere.update(ATMOSPHERE_PRESETS.sunset);

// Add clouds
import { CloudsLayer } from 'maporbis';
const clouds = new CloudsLayer('clouds');
map.addLayer(clouds);
```

### Loading 3D Models

```typescript
import { ModelFeature, Point } from 'maporbis';

// Create a model feature
const model = new ModelFeature({
  id: 'building',
  geometry: new Point([116.397, 39.909, 100]),
  url: 'models/building.glb',
  scale: 1.0,
  rotation: [0, 0, 0],
});

map.addFeature(model);
```

### Vector Tiles

```typescript
import { VectorTileLayer, MVTSource } from 'maporbis';

const vectorLayer = new VectorTileLayer({
  id: 'vector',
  source: new MVTSource({
    url: 'https://tiles.example.com/{z}/{x}/{y}.pbf',
  }),
  style: {
    layers: [
      {
        sourceLayer: 'water',
        type: 'fill',
        paint: { 'fill-color': '#4a90d9', 'fill-opacity': 0.6 },
      },
      {
        sourceLayer: 'roads',
        type: 'line',
        paint: { 'line-color': '#ffffff', 'line-width': 2 },
      },
    ],
  },
});

map.addLayer(vectorLayer);
```

## 📦 Project Structure

```
maporbis/
├── packages/
│   └── maporbis/           # Core library
│       └── src/
│           ├── map/        # Map controller & events
│           ├── layer/      # Rendering layers
│           ├── feature/    # Geographic features
│           ├── sources/    # Data sources
│           ├── loaders/    # Asset loaders
│           ├── projection/ # Coordinate systems
│           ├── renderer/   # WebGL renderer
│           ├── style/      # Styling system
│           ├── core/       # Core utilities
│           ├── ui/         # UI components
│           └── utils/      # Helper functions
└── examples/               # Demo applications
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build library
pnpm build

# Run tests
pnpm test

# Build examples
pnpm example:build
```

## 📋 API Overview

### Map

| Method | Description |
|--------|-------------|
| `addLayer(layer)` | Add a layer to the map |
| `removeLayer(layer)` | Remove a layer |
| `flyTo(options)` | Animate camera to position |
| `easeTo(options)` | Smooth camera transition |
| `getProjection()` | Get current projection |
| `on(event, handler)` | Listen to map events |

### Layer

| Method | Description |
|--------|-------------|
| `addTo(map)` | Add layer to map |
| `remove()` | Remove layer from map |
| `setVisible(visible)` | Toggle visibility |
| `setOpacity(opacity)` | Set layer opacity |

### Feature

| Method | Description |
|--------|-------------|
| `addTo(map)` | Add feature to map |
| `remove()` | Remove feature |
| `setGeometry(geometry)` | Update geometry |
| `setStyle(style)` | Update styling |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [GNU Lesser General Public License v3.0](LICENSE).

```
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
```

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D rendering library
- [Mapbox Vector Tile Specification](https://docs.mapbox.com/vector-tiles/specification/)
