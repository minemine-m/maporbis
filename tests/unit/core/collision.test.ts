import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WebGLRenderer, Camera, PerspectiveCamera } from 'three';
import { CollisionEngine } from '@/core/collision/CollisionEngine';
import { OverlayLayer } from '@/layer/OverlayLayer';
import { Feature } from '@/feature/Feature';

describe('CollisionEngine', () => {
    let renderer: WebGLRenderer;
    let engine: CollisionEngine;
    let camera: Camera;

    beforeEach(() => {
        renderer = {
            domElement: {
                width: 800,
                height: 600,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            }
        } as unknown as WebGLRenderer;

        // Mock ResizeObserver
        global.ResizeObserver = vi.fn().mockImplementation(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));

        engine = new CollisionEngine(renderer);
        camera = new PerspectiveCamera(45, 1.33, 0.1, 1000);
        camera.position.z = 100;
    });

    it('should initialize with default config', () => {
        expect(engine).toBeDefined();
    });

    it('should register and unregister layers', () => {
        const layer = { getFeatures: () => [] } as unknown as OverlayLayer;
        engine.registerLayer(layer);
        engine.unregisterLayer(layer);
    });

    it('should update and execute strategies', async () => {
        const feature = {
            _id: 'test-feature',
            collidable: true,
            setCollisionVisibility: vi.fn()
        } as unknown as Feature;
        Object.setPrototypeOf(feature, Feature.prototype);

        const layer = {
            getFeatures: () => [feature]
        } as unknown as OverlayLayer;

        engine.registerLayer(layer);
        
        // Mock strategy orchestrator internal execution if needed, 
        // but here we just check if it runs without error
        await engine.update(camera);
        
        expect(feature.setCollisionVisibility).toHaveBeenCalled();
    });

    it('should respect update interval', async () => {
        vi.useFakeTimers();
        const now = Date.now();
        vi.setSystemTime(now);

        engine.setConfig({ updateInterval: 1000 });
        
        const feature = {
            _id: 'test-feature',
            collidable: true,
            setCollisionVisibility: vi.fn()
        } as unknown as Feature;
        Object.setPrototypeOf(feature, Feature.prototype);

        const layer = {
            getFeatures: () => [feature]
        } as unknown as OverlayLayer;
        
        engine.registerLayer(layer);

        const spy = vi.spyOn(engine as any, '_collectCollidableFeatures');
        
        await engine.update(camera);
        
        // Advance time by 500ms (less than 1000ms interval)
        vi.setSystemTime(now + 500);
        await engine.update(camera); // This one should be skipped
        
        expect(spy).toHaveBeenCalledTimes(1);

        // Advance time by another 600ms (total 1100ms > 1000ms)
        vi.setSystemTime(now + 1100);
        await engine.update(camera); // This one should proceed
        expect(spy).toHaveBeenCalledTimes(2);

        vi.useRealTimers();
    });
});
