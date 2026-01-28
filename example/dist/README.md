# ✨ MapOrbis ✨

[![npm version](https://img.shields.io/npm/v/maporbis.svg?style=flat-square)](https://www.npmjs.com/package/maporbis)
[![license](https://img.shields.io/npm/l/maporbis.svg?style=flat-square)](https://www.npmjs.com/package/maporbis)

[**English**](./README.md) | [**简体中文**](./README_CN.md)

---

### 🌍 Discover the World in 3D!

**MapOrbis** is a high-performance, next-generation 3D mapping engine powered by **Three.js** 🚀. It brings professional GIS capabilities to the WebGL world with stunning visuals and smooth interactions. Whether you're building a Digital Twin, a Smart City dashboard, or an interactive geographical exploration tool, MapOrbis has you covered! 🏙️💎

---

## ✨ Amazing Features

*   **🎨 Stunning 3D Visuals**: Full integration with Three.js allows for beautiful lighting 💡, real-time shadows 🌑, HDR environments 🌈, and Bloom effects ✨.
*   **🗺️ Versatile Tile Support**: Load maps from almost anywhere! Compatible with WMTS, ArcGIS, Mapbox, and more. 🌐
*   **⚡ Vector Power**: Smoothly render Vector Tiles (MVT) for sharp, scalable, and interactive map data. 📈
*   **☁️ Atmospheric Magic**: Add realistic clouds ☁️, atmosphere effects 🌫️, and dynamic skyboxes 🌌 to your scenes.
*   **📍 Rich Map Elements**: Easily add Points, Lines, Polygons, and even complex 3D Models (.gltf / .glb) to your map. 🏎️🏠
*   **🧠 Smart Labeling**: Built-in collision detection 💥 ensures your labels and markers never overlap, keeping your map clean and readable. 🏷️
*   **🛠️ Interactive Tools**: Ready-to-use InfoWindows ℹ️, ToolTips 💬, and drawing tools to engage your users.

---

## 🚀 Quick Start

### 📦 Installation

Get started in seconds! Install MapOrbis via npm:

```bash
npm install maporbis
```

> **Note**: MapOrbis requires [Three.js](https://threejs.org/) as a peer dependency.

### 🛠️ Basic Usage

Creating a map is as easy as pie 🥧:

```javascript
import { Map, TileLayer, TileSource, ProjectionFactory } from 'maporbis';

// Initialize your amazing 3D map!
const map = new Map('map-container', {
  state: {
    center: [116.4, 39.9, 20000], // [Longitude, Latitude, Altitude]
  },
  source: {
    baseLayers: [
      new TileLayer("osm", {
        source: new TileSource({
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          projectionID: "3857",
        }),
        projection: ProjectionFactory.create("3857"),
      }),
    ],
  },
});
```

---

## 🗺️ What Can You Do?

### 🧱 Layers & Sources
Mix and match different data sources! From satellite imagery 🛰️ to street maps 🛣️, and custom vector data.

### 📐 Geometry & Features
Draw your world! 

```javascript
import { PointLayer, Marker } from 'maporbis';

// Add a point layer for your markers
const markersLayer = new PointLayer("markers");
map.addLayer(markersLayer);

// Create a marker and add it to the layer
const marker = new Marker({
  geometry: {
    type: "Point",
    coordinates: [116.4, 39.9],
  },
  style: {
    type: "icon",
    url: "/path/to/icon.png",
    size: 32,
  },
});
marker.addTo(markersLayer);
```

- **Points & Markers**: Mark your favorite spots 📍.
- **Lines & Paths**: Trace routes and boundaries 📏.
- **Polygons**: Define areas and districts 🟩.
- **3D Models**: Bring buildings and vehicles to life 🏢.

### 🎭 Visual Enhancements
Transform your map into a masterpiece:
- **Environment**: HDR lighting and Skyboxes 🌌.
- **Effects**: Post-processing like Bloom and Tone Mapping 📸.
- **Weather**: Procedural clouds and atmosphere ⛈️.

---

## 🤝 Contributing

We love contributions! If you have ideas, bug reports, or want to add a feature, feel free to open an issue or submit a pull request. Let's build the best 3D map engine together! 👨‍💻👩‍💻

---

## 📄 License

MapOrbis is released under the **Apache-2.0** License. 📜

---

Made with ❤️ by the MapOrbis Team. Enjoy mapping! 🗺️✨
