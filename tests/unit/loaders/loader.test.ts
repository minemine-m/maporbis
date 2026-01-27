import { describe, it, expect, vi } from 'vitest';
import { TileLoaderFactory } from '@/loaders/TileLoaderFactory';
import { LoaderUtils } from '@/loaders/LoaderUtils';
import { ISource } from '@/sources/ISource';

describe('Loader System', () => {
    describe('TileLoaderFactory', () => {
        it('should register and retrieve geometry loaders', () => {
            const mockLoader = {
                dataType: 'test-geo',
                info: { name: 'Test' },
                load: vi.fn()
            } as any;

            TileLoaderFactory.registerGeometryLoader(mockLoader);
            
            const source = { dataType: 'test-geo' } as ISource;
            const retrieved = TileLoaderFactory.getGeometryLoader(source);
            
            expect(retrieved).toBe(mockLoader);
            expect(mockLoader.info.author).toBe('MapOrbis'); // Auto-filled
        });

        it('should throw error for unsupported loader type', () => {
            const source = { dataType: 'unknown' } as ISource;
            expect(() => TileLoaderFactory.getMaterialLoader(source)).toThrow();
        });
    });

    describe('LoaderUtils', () => {
        it('should calculate bounds coordinates correctly', () => {
            const clipBounds: [number, number, number, number] = [0.25, 0.25, 0.75, 0.75];
            const targetSize = 256;
            const result = LoaderUtils.getBoundsCoord(clipBounds, targetSize);
            
            expect(result.sx).toBe(64);
            expect(result.sy).toBe(64);
            expect(result.sw).toBe(128);
            expect(result.sh).toBe(128);
        });

        it('should get safe tile URL and bounds for over-zoom', () => {
            const mockSource = {
                minLevel: 0,
                maxLevel: 10,
                _getUrl: vi.fn((x, y, z) => `url/${z}/${x}/${y}`)
            } as any;

            // Zoom 11, should return parent tile (Zoom 10)
            const result = LoaderUtils.getSafeTileUrlAndBounds(mockSource, 2, 2, 11);
            
            expect(result.url).toBe('url/10/1/1'); // Parent of (2,2,11) is (1,1,10)
            expect(result.clipBounds).toEqual([0, 0, 0.5, 0.5]); // Top-left quadrant
        });
    });
});
