import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Map } from '@/map/index';
import { PointLayer } from '@/layer/PointLayer';
import { Marker } from '@/feature/Marker';

describe('Map Integration', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'map-container';
        // Mock clientWidth/Height for JSDOM
        Object.defineProperty(container, 'clientWidth', { value: 800 });
        Object.defineProperty(container, 'clientHeight', { value: 600 });
        document.body.appendChild(container);
    });

    it('should initialize map correctly', () => {
        const map = new Map(container, {
            state: {
                center: [120, 30],
                zoom: 10
            }
        });

        expect(map).toBeDefined();
        expect(map.sceneRenderer).toBeDefined();
    });

    it('should add layer and feature to map', async () => {
        const map = new Map(container, {
            state: {
                center: [120, 30],
                zoom: 10
            }
        });

        const layer = new PointLayer('test-layer');
        const marker = new Marker({
            geometry: { type: 'Point', coordinates: [120, 30] },
            id: 'm1'
        });

        layer.addFeature(marker);
        map.addLayer(layer);

        // Check if layer is added to map's internal container
        expect(map.getLayer('test-layer')).toBe(layer);
        
        // Marker should be built since map is present
        await marker.initializeGeometry();
        expect(marker._renderObject).toBeDefined();
    });

    it('should emit load event', async () => {
        vi.useFakeTimers();
        const map = new Map(container, {
            state: {
                center: [120, 30],
                zoom: 10
            }
        });

        const loadSpy = vi.fn();
        map.on('load', loadSpy);
        
        // Map fires 'load' in a setTimeout(..., 0)
        vi.runOnlyPendingTimers();
        
        expect(loadSpy).toHaveBeenCalled();
        vi.useRealTimers();
    });
});
