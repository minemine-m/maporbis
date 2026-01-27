import { describe, it, expect, vi } from 'vitest';
import { Model } from '@/feature/Model';
import { Vector3, Object3D } from 'three';

// Mock createobject utilities
vi.mock('@/utils/createobject', () => ({
    _createModel: vi.fn().mockImplementation(() => {
        const model = new Object3D();
        model.userData = {};
        return Promise.resolve({
            model: model,
            animations: []
        });
    })
}));

describe('Model Feature', () => {
    it('should initialize with options', () => {
        const model = new Model({
            geometry: { type: 'Point', coordinates: [120, 30] },
            id: 'm1',
            emissive: true,
            emissiveIntensity: 2.0
        });

        expect(model._id).toBe('m1');
        expect(model.emissive).toBe(true);
        expect(model.emissiveIntensity).toBe(2.0);
    });

    it('should build render object and set properties', async () => {
        const model = new Model({
            geometry: { type: 'Point', coordinates: [120, 30] },
            id: 'm1',
            paint: { type: 'model-gltf', url: 'dummy.glb' },
            castShadow: true
        });

        // Mock coordinate transform
        model._coordsTransform = vi.fn().mockReturnValue(new Vector3(0, 0, 0));

        await model._buildRenderObject();

        expect(model._renderObject).toBeDefined();
        expect(model.castShadow).toBe(true);
    });

    it('should handle animation playback', async () => {
        const model = new Model({
            geometry: { type: 'Point', coordinates: [120, 30] },
            id: 'm1'
        });

        // Manually inject mixer and animations for testing
        const mockClip = { name: 'run', duration: 1.0 };
        const mockAction = { 
            play: vi.fn(), 
            stop: vi.fn(),
            fadeIn: vi.fn().mockReturnThis(),
            fadeOut: vi.fn().mockReturnThis(),
            setLoop: vi.fn().mockReturnThis(),
            setEffectiveWeight: vi.fn().mockReturnThis(),
            getClip: () => mockClip
        };
        const mockMixer = {
            clipAction: vi.fn().mockReturnValue(mockAction)
        };

        (model as any)._animations = [mockClip];
        (model as any)._mixer = mockMixer;

        model.playAnimation({ name: 'run' });
        expect(mockMixer.clipAction).toHaveBeenCalledWith(mockClip);
        expect(mockAction.play).toHaveBeenCalled();
    });
});
