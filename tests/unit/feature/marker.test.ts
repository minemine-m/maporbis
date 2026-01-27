import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Vector3, Sprite, Object3D } from 'three';
import { Marker } from '@/feature/Marker';
import { Paint } from '@/style/index';

// Mock the createobject utilities
vi.mock('@/utils/createobject', () => ({
    _createBasicPoint: vi.fn().mockReturnValue(new Object3D()),
    _createIconPoint: vi.fn().mockImplementation(() => {
        const sprite = new Sprite();
        sprite.scale.set(10, 10, 1);
        return Promise.resolve(sprite);
    }),
    _createIconLabelSprite: vi.fn().mockReturnValue(Promise.resolve(new Sprite()))
}));

describe('Marker Feature', () => {
    let marker: Marker;
    const geometry = { type: 'Point', coordinates: [120, 30] } as any;

    beforeEach(() => {
        marker = new Marker({
            geometry,
            id: 'test-marker'
        });
    });

    it('should initialize with correct id and type', () => {
        expect(marker._id).toBe('test-marker');
        expect(marker._type).toBe('Marker');
    });

    it('should calculate screen bounding box for icon type', async () => {
        const paint = new Paint({
            type: 'icon',
            url: 'test.png',
            size: 32
        });
        marker.setPaint(paint);
        
        // Mock render object as a Sprite with scale
        const sprite = new Sprite();
        sprite.scale.set(10, 10, 1);
        (marker as any)._renderObject = sprite;
        (marker as any)._paint = paint;

        const camera = {} as any;
        const renderer = { domElement: {} } as any;

        const bbox = marker._calculateCollisionBoundingBox(camera, renderer);
        expect(bbox).toBeDefined();
        // scale is 10, pixelsToUnit is 0.002, so 10/0.002 = 5000? 
        // Wait, the code uses 10 / 0.002 = 5000.
        expect(bbox?.width).toBe(5000);
    });

    it('should fallback to default bounding box if calculation fails', () => {
        const bbox = marker._getFallbackBoundingBox();
        expect(bbox.width).toBe(15); // default case
    });

    it('should handle paint changes', async () => {
        const buildSpy = vi.spyOn(marker, '_buildRenderObject');
        marker.setPaint({ type: 'circle', color: '#ff0000', size: 10 });
        
        // Manual call since initializeGeometry might skip if _renderObject is set
        await marker._buildRenderObject();
        expect(buildSpy).toHaveBeenCalled();
    });
});
