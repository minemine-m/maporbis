import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Map } from '@/map/index';
import { PointLayer } from '@/layer/PointLayer';
import { Marker } from '@/feature/Marker';

describe('Map Collision Integration', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        Object.defineProperty(container, 'clientWidth', { value: 800 });
        Object.defineProperty(container, 'clientHeight', { value: 600 });
        document.body.appendChild(container);
    });

    it('should manage feature visibility through collision engine', async () => {
        const map = new Map(container, {
            state: { center: [0, 0], zoom: 10 },
            interaction: { collision: true }
        });

        const layer = new PointLayer('collision-layer', { collision: true });
        map.addLayer(layer);

        // Marker 1: High priority (smaller value)
        const m1 = new Marker({
            id: 'm1',
            geometry: { type: 'Point', coordinates: [0, 0] }
        });
        m1.enableCollision().setCollisionConfig({ priority: 1 });

        // Marker 2: Low priority (larger value), same location
        const m2 = new Marker({
            id: 'm2',
            geometry: { type: 'Point', coordinates: [0, 0] }
        });
        m2.enableCollision().setCollisionConfig({ priority: 10 });

        layer.addFeature(m1);
        layer.addFeature(m2);

        // Mock getScreenBoundingBox for both markers to return overlapping boxes
        vi.spyOn(m1, 'getScreenBoundingBox').mockReturnValue({
            id: 'b1', x: 100, y: 100, width: 50, height: 50, priority: 1, featureId: 'm1', layerId: 'l1', type: 'point' as any
        });
        vi.spyOn(m2, 'getScreenBoundingBox').mockReturnValue({
            id: 'b2', x: 105, y: 105, width: 50, height: 50, priority: 10, featureId: 'm2', layerId: 'l1', type: 'point' as any
        });

        // Trigger collision update
        const collisionEngine = (map as any)._collisionEngine;
        await collisionEngine.update(map.sceneRenderer.camera);

        expect(m1.getCollisionVisibility()).toBe(true);
        expect(m2.getCollisionVisibility()).toBe(false);
    });
});
