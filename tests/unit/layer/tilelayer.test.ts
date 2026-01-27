import { describe, it, expect, vi } from 'vitest';
import { TileSource } from '@/sources/TileSource';
import { RasterTileLayer } from '@/layer/TileLayer/RasterTileLayer';
import { WebMercatorProjection } from '@/projection/WebMercatorProjection';
import { Camera } from 'three';
import { registerDefaultLoaders } from '@/loaders';

describe('TileLayer and TileSource', () => {
    registerDefaultLoaders();

    it('should initialize TileSource with template URL', () => {
        const source = new TileSource({
            url: 'https://test.com/{z}/{x}/{y}.png',
            minLevel: 0,
            maxLevel: 10
        });

        // expect(source.id).toBe('test-source');
        expect(source.getUrl(1, 2, 3)).toBe('https://test.com/3/1/2.png');
    });

    it('should initialize RasterTileLayer', () => {
        const source = new TileSource({
            url: 'https://test.com/{z}/{x}/{y}.png'
        });
        const projection = new WebMercatorProjection();
        const layer = new RasterTileLayer('test-layer', {
            source,
            projection
        });

        expect(layer.getId()).toBe('test-layer');
        expect(layer.isTileLayer).toBe(true);
        expect(layer.projection).toBe(projection);
    });

    it('should update tile tree on layer update', () => {
        const source = new TileSource({
            url: 'https://test.com/{z}/{x}/{y}.png'
        });
        const projection = new WebMercatorProjection();
        const layer = new RasterTileLayer('test-layer', {
            source,
            projection
        });

        const camera = new Camera();
        camera.position.set(0, 0, 1000);
        
        // Mock root tile update
        const updateSpy = vi.spyOn((layer as any)._rootTile, 'update');
        
        layer.update(camera);
        expect(updateSpy).toHaveBeenCalled();
    });
});
