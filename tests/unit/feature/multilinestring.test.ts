import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MultiLineString } from '@/feature/MultiLineString';
import { Map } from '@/map';
import { Vector3, Group, Mesh } from 'three';

// Mock Map
vi.mock('@/map', () => {
    return {
        Map: vi.fn().mockImplementation(() => ({
            lngLatToWorld: vi.fn().mockReturnValue(new Vector3(100, 200, 0)),
            prjcenter: new Vector3(0, 0, 0),
            getProjection: vi.fn().mockReturnValue({
                project: vi.fn().mockReturnValue(new Vector3(100, 200, 0))
            }),
            getLayer: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn()
        }))
    };
});

// Mock createobject
vi.mock('@/utils/createobject', () => {
    return {
        _createBasicLine: vi.fn().mockImplementation(() => {
            const mesh = new Mesh();
            mesh.name = 'basic-line';
            return mesh;
        }),
        _createFlowLine: vi.fn().mockImplementation(() => {
            const mesh = new Mesh();
            mesh.name = 'flow-line';
            return mesh;
        }),
        _createArrowLine: vi.fn().mockImplementation(() => {
            const mesh = new Mesh();
            mesh.name = 'arrow-line';
            return mesh;
        }),
        _createFlowTextureLine: vi.fn().mockImplementation(() => {
            const mesh = new Mesh();
            mesh.name = 'texture-line';
            return Promise.resolve(mesh);
        })
    };
});

describe('MultiLineString Feature', () => {
    let mockMap: any;

    beforeEach(() => {
        mockMap = new Map('container', {} as any);
    });

    it('should initialize with correct type', () => {
        const mls = new MultiLineString({
            geometry: { type: 'MultiLineString', coordinates: [[[120, 30], [121, 31]]] }
        });
        expect(mls._type).toBe('MultiLineString');
    });

    it('should build multi-line with basic style', async () => {
        const mls = new MultiLineString({
            geometry: { 
                type: 'MultiLineString', 
                coordinates: [
                    [[120, 30], [121, 31]],
                    [[122, 32], [123, 33]]
                ] 
            },
            paint: {
                type: 'line', color: '#ff0000'
            } as any
        });
        mls._bindLayer({ getMap: () => mockMap } as any);
        await mls._buildRenderObject();
        
        const renderObject = (mls as any)._renderObject as Group;
        expect(renderObject).toBeDefined();
        expect(renderObject.type).toBe('Group');
        expect(renderObject.children.length).toBe(2);
        expect(renderObject.children[0].name).toBe('basic-line');
    });

    it('should build multi-line with flow-texture style', async () => {
        const mls = new MultiLineString({
            geometry: { 
                type: 'MultiLineString', 
                coordinates: [[[120, 30], [121, 31]]] 
            },
            paint: {
                type: 'flow-texture', url: 'test.png'
            } as any
        });
        mls._bindLayer({ getMap: () => mockMap } as any);
        await mls._buildRenderObject();
        
        const renderObject = (mls as any)._renderObject as Group;
        expect(renderObject.children[0].name).toBe('texture-line');
    });

    it('should clear existing lines when rebuilding', async () => {
        const mls = new MultiLineString({
            geometry: { 
                type: 'MultiLineString', 
                coordinates: [[[120, 30], [121, 31]]] 
            },
            paint: {
                type: 'line'
            } as any
        });
        mls._bindLayer({ getMap: () => mockMap } as any);
        await mls._buildRenderObject();
        expect(((mls as any)._renderObject as Group).children.length).toBe(1);

        // Update geometry to have 2 lines
        (mls as any)._geometry = {
            type: 'MultiLineString',
            coordinates: [
                [[120, 30], [121, 31]],
                [[122, 32], [123, 33]]
            ]
        };
        await mls._buildRenderObject();
        expect(((mls as any)._renderObject as Group).children.length).toBe(2);
    });

    it('should throw error for unsupported style type', async () => {
        const mls = new MultiLineString({
            geometry: { type: 'MultiLineString', coordinates: [[[120, 30], [121, 31]]] },
            paint: {
                type: 'unsupported' as any
            } as any
        });
        mls._bindLayer({ getMap: () => mockMap } as any);
        await expect(mls._buildRenderObject()).rejects.toThrow('Unsupported style type: unsupported');
    });
});
