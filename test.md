MapOrbis API Semantic Refactoring Plan

Overview

Complete semantic refactoring of all public API names, configuration structures, and type definitions to align with modern GIS/WebGL map engine standards (Mapbox GL JS, MapTalks).

Protected Names (MUST NOT change): Map, Layer, Feature

User Preferences:
• Angles: pitch/bearing (degrees, no artificial limits)

• Events: on/off/fire

• Projection: lngLatToPoint/pointToLngLat

1. Configuration Structure Refactoring

MapOptions (src/map/index.ts)


OLD STRUCTURE                                  NEW STRUCTURE
─────────────────────────────────────────────────────────────────
{                                              {
  viewer?: ViewerOptions                        ┌─ renderer: {
  basemap: TileMapParams                 →      │    antialias, stencil,
  center: Coordinate                             │    logarithmicDepthBuffer,
  zoom?: number                                  │    skybox, bloom, ground
  minZoom?: number                               │  }
  maxZoom?: number                               ├─ camera: {
  FeatureEvents?: boolean                        │    pitch, bearing, 
}                                                │    minDistance, maxDistance
                                                 │  }
                                                 ├─ interaction: {
                                                 │    draggable, scrollZoom,
                                                 │    featureEvents, collision
                                                 │  }
                                                 ├─ source: {
                                                 │    baseLayers, minLevel, maxLevel
                                                 │  }
                                                 └─ state: {
                                                      center, zoom, minZoom, maxZoom
                                                    }
                                              }


ViewerOptions → RendererOptions + CameraOptions

Old Key New Location New Key

antialias renderer antialias

stencil renderer stencil

logarithmicDepthBuffer renderer logarithmicDepthBuffer

skybox renderer.environment skybox

bloom renderer.postProcessing bloom

debug renderer debug

draggable interaction draggable

polarAngle camera pitch

azimuthAngle camera bearing

polarDeg (removed) (use pitch)

azimuthDeg (removed) (use bearing)

minDistance camera minDistance

maxDistance camera maxDistance
TileMapParams → SourceOptions
Old Key New Key

minLevel minLevel

maxLevel maxLevel

Baselayers baseLayers
LayerOptions
Old Key New Key

attribution attribution

visible visible

opacity opacity

zIndex zIndex

isSceneLayer isSceneLayer

altitude elevation

depthOffset depthOffset
FeatureOptions
Old Key New Key

id id

geometry geometry

visible visible

defaultProjection projection

style paint

userData properties

rotateAngle rotation

draggable draggable

editable editable

2. Method Name Mapping

Map Class (src/map/index.ts)

Old Method New Method Category

project(coord) lngLatToPoint(lngLat) Projection

projectToWorld(coord) lngLatToWorld(lngLat) Projection

unproject(point) pointToLngLat(point) Projection

unprojectFromWorld(worldPos) worldToLngLat(worldPos) Projection

pickFromGeo(geoCoord) queryAtLngLat(lngLat) Interaction

pickFromWorld(worldPos) queryAtWorld(worldPos) Interaction

pickFromPixel(camera, pixel) queryAtPoint(point) Interaction

getZoom() getZoom() State

setZoom(zoom) setZoom(zoom) State

getDataZoom() getTileZoom() Source

getMinZoom() getMinZoom() State

getMaxZoom() getMaxZoom() State

setZoomRange(min, max) setZoomBounds(min, max) State

setMinZoom(min) setMinZoom(min) State

setMaxZoom(max) setMaxZoom(max) State

zoomIn(delta) zoomIn(delta) Camera

zoomOut(delta) zoomOut(delta) Camera

addLayer(layer) addLayer(layer) Layer

removeLayer(id) removeLayer(id) Layer

getLayers() getLayers() Layer

getLayerById(id) getLayer(id) Layer

clearLayers() clearLayers() Layer

addTileLayer(layer) addLayer(layer) (merge)

getContainer() getContainer() Core

getRenderer() getRenderer() Core

getCamera() getCamera() Core

getCenter() getCenter() State

flyTo(config) flyTo(options) Camera

flyToPoint(config) easeTo(options) Camera

setDefaultGroundVisible(v) setGroundVisible(visible) Renderer

isDefaultGroundVisible() isGroundVisible() Renderer

update(camera) render(camera) Core

destroy() dispose() Core

_findFeaturesAt(pos) _queryFeaturesAt(point) Internal

_getEventPosition(evt) _getPointerPosition(event) Internal
Viewer Class (src/viewer/index.ts) → Renamed to SceneRenderer
Old Method New Method

addTo(container) mount(container)

resize() resize()

addAnimationCallback(cb) onFrame(callback)

flyTo(...) animateTo(...)

flyToAdvanced(options) animateAdvanced(options)

flyToPoint(options) animateToPoint(options)

calculateCameraPosition(...) computeCameraPosition(...)

getState() getViewState()

getMap() getMap()

getAspect() getAspectRatio()

getWidthHeight() getViewportSize()

showDefaultGround() showGround()

hideDefaultGround() hideGround()

isDefaultGroundVisible() isGroundVisible()

destroy() dispose()

onConfig(conf) onOptionsChange(options)
Layer Class (src/layer/Layer.ts)
Old Method New Method

getId() getId()

addTo(map) addTo(map)

getZIndex() getZIndex()

getDepthOffset() getDepthOffset()

getOpacity() getOpacity()

setOpacity(val) setOpacity(opacity)

getMap() getMap()

show() show()

hide() hide()

setAltitude(val) setElevation(elevation)

getAltitude() getElevation()

getOptions() getOptions()

setRegionOverlays(configs) setMasks(masks)

addRegionOverlay(overlay) addMask(mask)

removeRegionOverlay(id) removeMask(id)

clearRegionOverlays() clearMasks()

getRegionOverlays() getMasks()
OverlayLayer Class (src/layer/OverlayLayer.ts)
Old Method New Method

addFeature(features) addFeature(features)

getFeatures(filter) getFeatures(filter)

getCount() getFeatureCount()

isEmpty() isEmpty()

removeFeature(features) removeFeature(features)

clear() clearFeatures()

setCollisionEngine(engine) setCollisionEngine(engine)

onRemoveFeature(feature) _onFeatureRemoved(feature)

_findInList(feature) _findFeatureIndex(feature)
Feature Class (src/feature/Feature.ts)
Old Method New Method

initializeGeometry() build()

setStyle(input) setPaint(paint)

getStyle() getPaint()

setBloom(enabled, opts) setGlow(enabled, options)

getBloom() getGlow()

addTo(layer) addTo(layer)

getLayer() getLayer()

getMap() getMap()

setCoordinates(coords) setLngLat(lngLat)

getCenter() getCenter()

setCollisionConfig(config) setCollisionOptions(options)

enableCollision() enableCollision()

disableCollision() disableCollision()

setCollisionVisibility(v) setCollisionVisible(visible)

getCollisionVisibility() isCollisionVisible()

getCollisionPriority() getCollisionPriority()

getScreenBoundingBox(...) getScreenBounds(...)

getCollisionData() getCollisionData()

_buildRenderObject() _buildMesh()

_refreshCoordinates() _updateCoordinates()

_applyCoordinateChanges() _applyLngLatChanges()

_bindLayer(layer) _bindLayer(layer)

_updateGeometry() _updateMesh()

_remove() _detach()

_unbind() _unbind()

_disposeGeometry() _disposeMesh()
Event Mixin (src/core/mixins/index.ts)
Old Method New Method

on(type, fn) on(type, handler)

off(type, fn) off(type, handler)

trigger(type, data) fire(type, data)
BaseMixin (src/core/mixins/index.ts)
Old Method New Method

setOptions(options) setOptions(options)

config(conf, value) configure(options)

onConfig(conf) onOptionsChange(options)

callInitHooks() _callInitHooks()

proxyOptions() _proxyOptions()

3. Type Definition Renaming

Core Types (src/types/)

Old Type New Type

Coordinate LngLatLike

TileMapParams SourceOptions

MapOptionsType MapBehaviorOptions

ViewerOptions RendererOptions

ViewerEventMap RendererEventMap

FlyToOptions AnimationOptions

FlyToPointOptions EaseToOptions
Layer Types
Old Type New Type

LayerOptions LayerOptions

OverlayLayerOptions FeatureLayerOptions

RegionOverlayConfig MaskOptions

RegionOverlayMode MaskMode

BaseTileLayerOptions TileLayerOptions

VectorTileLayerOptions VectorLayerOptions

RasterTileLayerOptions RasterLayerOptions
Feature Types
Old Type New Type

FeatureOptions FeatureOptions

GeoJSONGeometry GeoJSONGeometry
Style Types (src/style/index.ts)
Old Type New Type

StyleConfig PaintConfig

StyleInput PaintInput

TileStyleInput TilePaintInput

BaseStyle BasePaint

BasicPointStyle CirclePaint

IconPointStyle IconPaint

LabelStyle TextPaint

IconLabelStyle SymbolPaint

BaseLineStyle LinePaint

PipelineStyle TubePaint

FlowLineStyle FlowTubePaint

ArrowLineStyle ArrowPaint

FlowTextureLineStyle FlowTexturePaint

BasePolygonStyle FillPaint

ExtrudeStyle ExtrusionPaint

WaterStyle WaterPaint

ModelStyle ModelPaint

CloudStyle CloudPaint

CustomStyle CustomPaint

Style (class) Paint (class)
Style Type Discriminator Values
Old type Value New type Value

'basic-point' 'circle'

'icon-point' 'icon'

'icon-label-point' 'symbol'

'canvas-label' 'text'

'canvas-label-fixed' 'text-fixed'

'basic-line' 'line'

'tube-line' 'tube'

'flow-tube-line' 'flow-tube'

'arrow-line' 'arrow'

'flow-texture-line' 'flow-texture'

'basic-polygon' 'fill'

'extrude-polygon' 'extrusion'

'water' 'water'

'base-water' 'water-simple'

'gltf' 'model-gltf'

'fbx' 'model-fbx'

'cloud' 'cloud'

'custom' 'custom'

'light' 'light'
4. Event Name Standardization
Old Event New Event

loaded load

zoomstart zoomstart

zooming zoom

zoomend zoomend

control-change viewchange

control-start movestart

control-end moveend

positionchange move

collisionstatechange collisionchange

5. Source and Loader Renaming

Source Classes (src/sources/)

Old Class New Class

TileSource TileSource

ArcGisSource ArcGISSource

MapBoxSource MapboxSource

MVTSource MVTSource

MVTGeoSource VectorTileSource

TDTSource TiandituSource

WMTSSource WMTSSource
Loader Classes (src/loaders/)
Old Class New Class

TileLoaderFactory LoaderRegistry

CompositeTileLoader CompositeLoader

WebImageLoader ImageLoader

VectorTileTextureLoader VectorTextureLoader

MapboxRGBLoader TerrainRGBLoader

ArcGISLercLoader LERCLoader

MapboxVectorTileGeometryLoader VectorGeometryLoader

ExternalModelLoader ModelLoader

6. UI Component Renaming (src/ui/)

UIComponent Methods

Old Method New Method

buildOn() createElement()

_getClassName() _getComponentName()

getOffset() getOffset()

addTo(owner) bindTo(owner)

remove() unbind()

show(coordinate) open(lngLat)

hide() close()

hideDom() _removeElement()

getMap() getMap()

isVisible() isOpen()

_refreshDomPosition() _updatePosition()
UIComponentOptions
Old Key New Key

containerClass className

dx offsetX

dy offsetY

visible visible

single singleton

zIndex zIndex

7. Files to Modify

Core Files (High Priority)

• src/map/index.ts - Map class and MapOptions

• src/viewer/index.ts - Viewer → SceneRenderer

• src/layer/Layer.ts - Base layer class

• src/layer/OverlayLayer.ts - Feature layer

• src/feature/Feature.ts - Base feature class

• src/style/index.ts - Style → Paint system

• src/core/mixins/index.ts - Event and base mixins

• src/index.ts - Public exports

Layer Files

• src/layer/TileLayer/TileLayer.ts

• src/layer/TileLayer/VectorTileLayer.ts

• src/layer/TileLayer/RasterTileLayer.ts

• src/layer/TileLayer/WMTSTileLayer.ts

• src/layer/TileLayer/interfaces/ITileLayer.ts

• src/layer/TileLayer/renderer/VectorTileRenderLayer.ts

• src/layer/LayerContainer.ts

Feature Files

• src/feature/Point.ts

• src/feature/Marker.ts

• src/feature/LineString.ts

• src/feature/Line.ts

• src/feature/Polygon.ts

• src/feature/Surface.ts

• src/feature/Model.ts

• src/feature/Label.ts

• src/feature/MultiLineString.ts

• src/feature/TPoints.ts

• src/feature/ICloud.ts

• src/feature/Path.ts

• src/feature/internal/*.ts

Source/Loader Files

• src/sources/*.ts (all source files)

• src/loaders/*.ts (all loader files)

UI Files

• src/ui/UIComponent.ts

• src/ui/UIMarker.ts

• src/ui/InfoWindow.ts

• src/ui/ToolTip.ts

Handler/Tool Files

• src/handler/Handlerable.ts

• src/handler/Handler.ts

• src/handler/drag/FeatureDragHandler.ts

• src/handler/edit/FeatureEditHandler.ts

• src/map/tool/DrawTool.ts

• src/map/tool/MapTool.ts

Support Files

• src/core/event/index.ts

• src/core/collision/*.ts

• src/projection/*.ts

• src/map/Map.DomEvent.ts

• src/map/handler/Map.FeatureEvents.ts

• src/map/utils.ts

• src/utils/*.ts

• src/types/*.ts (if exists)

8. Implementation Order

Phase 1: Core Infrastructure

• Rename trigger → fire in EventMixin

• Rename config → configure in BaseMixin

• Update src/core/event/index.ts if needed

Phase 2: Type Definitions

• Create/update type aliases for new configuration structures

• Update all interface definitions with new property names

Phase 3: Style System

• Rename Style class → Paint

• Update all style type names

• Update style type discriminator values

Phase 4: Core Classes

• src/viewer/index.ts - Rename class and methods

• src/map/index.ts - Update all methods and config structure

• src/layer/Layer.ts - Update methods

• src/feature/Feature.ts - Update methods

Phase 5: Subclasses

• All Layer subclasses

• All Feature subclasses

• All Source classes

• All Loader classes

Phase 6: UI and Tools

• UIComponent and subclasses

• Handler classes

• Tool classes

Phase 7: Integration Files

• Update all import/export statements

• Update src/index.ts exports

• Update internal references

9. Verification

TypeScript Compilation

npm run build
# or
npx tsc --noEmit


Verify No Legacy Names

# Search for old method names that should no longer exist
grep -r "trigger(" src/ --include="*.ts"
grep -r "\.getId()" src/ --include="*.ts"
grep -r "setAltitude" src/ --include="*.ts"
grep -r "StyleConfig" src/ --include="*.ts"


Runtime Testing

• Create a simple map instance with new API

• Add layers and features

• Test camera animations (flyTo, easeTo)

• Test event system (on, off, fire)

• Test projection methods (lngLatToPoint, pointToLngLat)

10. Notes

• No Backward Compatibility: All old API names must be completely removed

• Type Safety: Ensure all TypeScript types are updated and compile without errors

• Internal Methods: Methods starting with _ are internal but should still follow new naming conventions for consistency

• Comments: Update JSDoc comments to reflect new method/property names