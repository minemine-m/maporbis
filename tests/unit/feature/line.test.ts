import { describe, it, expect, vi } from 'vitest';
import { LineString } from '@/feature/LineString';
import { Vector3 } from 'three';
import { Map } from '@/map/index';

describe('LineString Feature', () => {
    it('should initialize with geometry', () => {
        const line = new LineString({
            geometry: {
                type: 'LineString',
                coordinates: [[0, 0], [1, 1]]
            },
            id: 'l1'
        });

        expect(line._id).toBe('l1');
        expect(line._type).toBe('LineString');
    });

    it('should perform coordinate transformation', () => {
        const mockMap = {
            prjcenter: new Vector3(100, 100, 0),
            lngLatToWorld: vi.fn((v: Vector3) => v.clone().multiplyScalar(10))
        } as any;
        const mockLayer = {
            getMap: () => mockMap
        } as any;

        const line = new LineString({
            geometry: {
                type: 'LineString',
                coordinates: [[0, 0], [10, 10]]
            },
            id: 'l1'
        });

        line._bindLayer(mockLayer);
        const result = line._coordsTransform();

        // [0,0] -> [0,0] -> [0-100, 0-100, 0] -> [-100, -100, 0]
        // [10,10] -> [100,100] -> [100-100, 100-100, 0] -> [0, 0, 0]
        expect(result._worldLngLatLikes[0].x).toBe(-100);
        expect(result._worldLngLatLikes[1].x).toBe(0);
        expect(result._vertexPoints).toEqual([-100, -100, 0, 0, 0, 0]);
    });

    it('should refresh coordinates when map center changes', async () => {
        const mockMap = {
            prjcenter: new Vector3(0, 0, 0),
            lngLatToWorld: vi.fn((v: Vector3) => v.clone())
        } as any;
        const mockLayer = {
            getMap: () => mockMap
        } as any;

        const line = new LineString({
            geometry: {
                type: 'LineString',
                coordinates: [[1, 1], [2, 2]]
            },
            id: 'l1'
        });

        line._bindLayer(mockLayer);
        await line._buildRenderObject();

        expect(line._vertexPoints).toEqual([1, 1, 0, 2, 2, 0]);

        // Change center
        mockMap.prjcenter = new Vector3(1, 1, 0);
        // @ts-ignore
        line._refreshCoordinates();
        
        expect(line._vertexPoints).toEqual([0, 0, 0, 1, 1, 0]);
    });
});
