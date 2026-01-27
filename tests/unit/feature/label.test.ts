import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Label } from '@/feature/Label';
import { Map } from '@/map';
import { Vector3, Sprite } from 'three';

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
        _createTextSprite: vi.fn().mockImplementation(() => {
            const sprite = new Sprite();
            sprite.name = 'dynamic-label';
            return sprite;
        }),
        _createFixedSizeTextSprite: vi.fn().mockImplementation(() => {
            const sprite = new Sprite();
            sprite.name = 'fixed-label';
            return sprite;
        })
    };
});

describe('Label Feature', () => {
    let mockMap: any;

    beforeEach(() => {
        mockMap = new Map('container', {} as any);
    });

    it('should initialize with correct type', () => {
        const label = new Label({
            geometry: { type: 'Point', coordinates: [120, 30] }
        });
        expect(label._type).toBe('Label');
    });

    it('should build dynamic text label', async () => {
        const label = new Label({
            geometry: { type: 'Point', coordinates: [120, 30] },
            paint: {
                type: 'text',
                text: 'Hello'
            } as any
        });
        label._bindLayer({ getMap: () => mockMap } as any);
        await label._buildRenderObject();
        
        expect((label as any)._renderObject).toBeDefined();
        expect((label as any)._renderObject?.name).toBe('dynamic-label');
    });

    it('should build fixed size text label', async () => {
        const label = new Label({
            geometry: { type: 'Point', coordinates: [120, 30] },
            paint: {
                type: 'text-fixed',
                text: 'Fixed'
            } as any
        });
        label._bindLayer({ getMap: () => mockMap } as any);
        await label._buildRenderObject();
        
        expect((label as any)._renderObject).toBeDefined();
        expect((label as any)._renderObject?.name).toBe('fixed-label');
    });

    it('should update coordinates correctly', async () => {
        const label = new Label({
            geometry: { type: 'Point', coordinates: [120, 30] },
            paint: {
                type: 'text', text: 'Update'
            } as any
        });
        label._bindLayer({ getMap: () => mockMap } as any);
        await label._buildRenderObject();

        const oldPos = (label as any)._renderObject?.position.clone();
        
        // Simulate move
        mockMap.lngLatToWorld.mockReturnValue(new Vector3(150, 250, 0));
        (label as any)._refreshCoordinates();

        const newPos = (label as any)._renderObject?.position;
        expect(newPos?.x).toBe(150);
        expect(newPos?.y).toBe(250);
    });

    it('should throw error for unsupported style type', async () => {
        const label = new Label({
            geometry: { type: 'Point', coordinates: [120, 30] },
            paint: {
                type: 'unsupported' as any
            } as any
        });
        label._bindLayer({ getMap: () => mockMap } as any);
        await expect(label._buildRenderObject()).rejects.toThrow('Unsupported style type: unsupported');
    });
});
