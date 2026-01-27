import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Polygon } from '@/feature/Polygon';
import { Paint } from '@/style/index';
import * as THREE from 'three';

// Mock the createobject utilities
vi.mock('@/utils/createobject', () => ({
    _createBasePolygon: vi.fn().mockImplementation(() => new (require('three')).Object3D()),
    _createExtrudedPolygon: vi.fn().mockImplementation(() => Promise.resolve(new (require('three')).Object3D())),
    _createWaterSurface: vi.fn().mockImplementation(() => Promise.resolve(new (require('three')).Object3D())),
    _createBaseWaterSurface: vi.fn().mockImplementation(() => Promise.resolve(new (require('three')).Object3D()))
}));

describe('Polygon Feature', () => {
    let polygon: Polygon;
    const geometry = {
        type: 'Polygon',
        coordinates: [[[120, 30], [121, 30], [121, 31], [120, 31], [120, 30]]]
    } as any;

    beforeEach(() => {
        polygon = new Polygon({
            geometry,
            id: 'test-polygon'
        });
    });

    it('should initialize correctly', () => {
        expect(polygon._id).toBe('test-polygon');
        expect(polygon._type).toBe('Polygon');
    });

    it('should handle fill paint', async () => {
        const paint = new Paint({
            type: 'fill',
            color: '#00ff00'
        });
        polygon.setPaint(paint);
        
        await polygon.initializeGeometry();
        expect(polygon._renderObject).toBeDefined();
    });

    it('should handle extrusion paint', async () => {
        const paint = new Paint({
            type: 'extrusion',
            color: '#0000ff',
            extrude: { height: 10 }
        });
        polygon.setPaint(paint);
        
        await polygon.initializeGeometry();
        expect(polygon._renderObject).toBeDefined();
    });
});
