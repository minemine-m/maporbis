import { describe, it, expect, vi } from 'vitest';
import { TPoints } from '@/feature/TPoints';
import { Vector3 } from 'three';

// Mock createobject utilities
vi.mock('@/utils/createobject', async (importOriginal) => {
    const { Object3D } = await vi.importActual('three') as any;
    return {
        ...await importOriginal<any>(),
        createLight: vi.fn().mockImplementation(() => Promise.resolve({
            points: new Object3D(),
            InstancedCol: new Object3D()
        }))
    };
});

describe('TPoints Feature', () => {
    it('should initialize with geometries', () => {
        const tpoints = new TPoints({
            geometry: { type: 'Point', coordinates: [0, 0] },
            geometries: [{ type: 'Point', coordinates: [1, 1] }],
            id: 'tp1'
        });

        expect(tpoints._id).toBe('tp1');
        expect(tpoints._geometries).toBeDefined();
    });

    it('should build render object and add components', async () => {
        const tpoints = new TPoints({
            geometry: { type: 'Point', coordinates: [120, 30] },
            id: 'tp1',
            paint: { type: 'light' }
        });

        // Mock coordinate transform
        tpoints._coordsTransform = vi.fn().mockReturnValue(new Vector3(0, 0, 0));

        await tpoints._buildRenderObject();

        expect(tpoints._renderObject).toBeDefined();
        // Check if components are added as children
        expect(tpoints.children.length).toBeGreaterThan(0);
    });
});
