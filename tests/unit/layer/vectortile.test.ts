import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VectorTileLayer } from '@/layer/TileLayer/VectorTileLayer';
import { VectorTileRenderLayer } from '@/layer/TileLayer/renderer/VectorTileRenderLayer';
import { Map } from '@/map';
import { Tile } from '@/core/tile';
import { Vector3 } from 'three';

// Mock Map
vi.mock('@/map', () => {
    return {
        Map: vi.fn().mockImplementation(() => ({
            lngLatToWorld: vi.fn().mockReturnValue(new Vector3(0, 0, 0)),
            prjcenter: new Vector3(0, 0, 0),
            getProjection: vi.fn().mockReturnValue({
                project: vi.fn().mockReturnValue(new Vector3(0, 0, 0))
            }),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn()
        }))
    };
});

// Mock filter
vi.mock('@/style/filter', () => {
    return {
        matchFilter: vi.fn().mockReturnValue(true)
    };
});

// Mock Tile
vi.mock('@/core/tile', async () => {
    const { Object3D } = await vi.importActual('three') as any;
    return {
        Tile: vi.fn().mockImplementation((z, x, y) => {
            const tile = new Object3D();
            Object.assign(tile, {
                z, x, y,
                isTile: true,
                setDataOnlyMode: vi.fn(),
                traverse: vi.fn(),
                getVectorData: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            });
            return tile;
        })
    };
});

// Mock Features
vi.mock('../../../src/feature', async (importOriginal) => {
    const actual = await importOriginal<any>();
    const { Feature: RealFeature } = await vi.importActual('../../../src/feature/Feature') as any;
    
    class MockMarker extends RealFeature {
        constructor(opts: any) {
            super(opts);
            Object.assign(this, opts);
        }
        addTo = vi.fn().mockImplementation(function(this: any, layer: any) {
            layer.addFeature(this);
            return this;
        });
        initializeGeometry = vi.fn();
        _buildRenderObject = vi.fn();
    }

    class MockLineString extends RealFeature {
        constructor(opts: any) {
            super(opts);
            Object.assign(this, opts);
        }
        addTo = vi.fn().mockImplementation(function(this: any, layer: any) {
            layer.addFeature(this);
            return this;
        });
        initializeGeometry = vi.fn();
        _buildRenderObject = vi.fn();
    }

    return {
        ...actual,
        Marker: MockMarker,
        LineString: MockLineString
    };
});

describe('VectorTileLayer', () => {
    let mockSource: any;

    beforeEach(() => {
        mockSource = {
            on: vi.fn(),
            off: vi.fn(),
            getTileUrl: vi.fn()
        };
    });

    it('should initialize with style and data mode', () => {
        const layer = new VectorTileLayer('test-vlayer', {
            source: mockSource,
            style: { layers: [] },
            projection: { mapWidth: 256, mapHeight: 256 }
        } as any);
        
        expect(layer.layerType).toBe('vector');
        // Root tile should be in data mode
        expect((layer as any)._rootTile.setDataOnlyMode).toHaveBeenCalledWith(true);
    });

    it('should throw error if style is missing', () => {
        expect(() => {
            new VectorTileLayer('test', { 
                source: mockSource,
                projection: { mapWidth: 256, mapHeight: 256 }
            } as any);
        }).toThrow('VectorTileLayer must provide style configuration');
    });

    it('should set altitude and propagate to renderer', () => {
        const layer = new VectorTileLayer('test', {
            source: mockSource,
            style: { layers: [] },
            projection: { mapWidth: 256, mapHeight: 256 }
        } as any);
        const mockRenderer = {
            setAltitude: vi.fn()
        };
        (layer as any)._renderer = mockRenderer;

        layer.setAltitude(100);
        expect(layer.getAltitude()).toBe(100);
        expect(mockRenderer.setAltitude).toHaveBeenCalledWith(100);
    });
});

describe('VectorTileRenderLayer', () => {
    let renderLayer: VectorTileRenderLayer;
    let mockMap: any;

    beforeEach(() => {
        mockMap = new Map('container', {} as any);
        renderLayer = new VectorTileRenderLayer('test-render', {
            paint: [
                {
                    filter: true,
                    paint: { type: 'text', text: '{name}' }
                }
            ],
            projection: { mapWidth: 256, mapHeight: 256 }
        } as any);
        renderLayer._bindMap(mockMap);
    });

    it('should initialize with paint rules', () => {
        expect(renderLayer.paint.length).toBe(1);
    });

    it('should process tile data and create features', async () => {
        const mockTile = new Tile(10, 100, 200);
        const mockData = {
            vectorData: {
                layers: {
                    poi: [
                        {
                            geometry: { type: 'Point', coordinates: [0, 0] },
                            properties: { name: 'Test POI' }
                        }
                    ]
                },
                dataFormat: 'mvt'
            }
        };
         
        renderLayer.processTileData(mockTile as any, mockData);
        
        // Feature should be added
        expect(renderLayer.getFeatures().length).toBe(1);
        expect(renderLayer.getFeatures()[0].userData.tileData.tileX).toBe(100);
    });

    it('should hide and remove features by tile key', () => {
        const mockTile = new Tile(10, 1, 1);
        const tileKey = '10-1-1';
        const mockData = {
            vectorData: {
                layers: {
                    poi: [{ geometry: { type: 'Point' }, properties: {} }]
                }
            }
        };

        renderLayer.processTileData(mockTile as any, mockData);
        const feature = renderLayer.getFeatures()[0];

        renderLayer.hideFeaturesByTileKey(tileKey);
        expect(feature.visible).toBe(false);

        renderLayer.removeFeaturesByTileKey(tileKey);
        expect(renderLayer.getFeatures().length).toBe(0);
    });
});
