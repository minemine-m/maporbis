import { describe, it, expect, vi } from 'vitest';
import { RGBParser } from '@/loaders/parsers/rgb-parse';
import { MVTParser } from '@/loaders/parsers/mvt-parser';
import { VectorTile } from '@mapbox/vector-tile';

// Mock @mapbox/vector-tile
vi.mock('@mapbox/vector-tile', () => {
    return {
        VectorTile: vi.fn().mockImplementation(() => ({
            layers: {
                'test-layer': {
                    length: 1,
                    feature: vi.fn().mockReturnValue({
                        toGeoJSON: vi.fn().mockReturnValue({ type: 'Feature', properties: { id: 1 }, geometry: { type: 'Point', coordinates: [0, 0] } })
                    })
                }
            }
        }))
    };
});

describe('RGBParser', () => {
    it('should parse RGBA data to heights correctly', () => {
        // Test values based on Mapbox Terrain-RGB formula: h = -10000 + ((r << 16) | (g << 8) | b) * 0.1
        // r=1, g=134, b=160 => (1 << 16) | (134 << 8) | 160 = 65536 + 34304 + 160 = 100000
        // h = -10000 + 100000 * 0.1 = 0
        
        const data = new Uint8ClampedArray(8); // 2 pixels
        // Pixel 1: 0m height
        data[0] = 1;   // R
        data[1] = 134; // G
        data[2] = 160; // B
        data[3] = 255; // A
        
        // Pixel 2: transparent -> 0m
        data[4] = 255;
        data[5] = 255;
        data[6] = 255;
        data[7] = 0;   // A=0
        
        const imageData = { data, width: 2, height: 1 } as unknown as ImageData;
        const result = RGBParser.parse(imageData);
        
        expect(result).toBeInstanceOf(Float32Array);
        expect(result.length).toBe(2);
        expect(result[0]).toBeCloseTo(0, 1);
        expect(result[1]).toBe(0);
    });
});

describe('MVTParser', () => {
    it('should parse binary data to layers structure', async () => {
        const buffer = new ArrayBuffer(10);
        const result = await MVTParser.parse(buffer, 0, 0, 0);
        
        expect(result.layers).toBeDefined();
        expect(result.layers['test-layer']).toBeDefined();
        expect(result.layers['test-layer'][0].properties.id).toBe(1);
        expect(result.dataFormat).toBe('mvt');
    });

    it('should handle errors during parsing', async () => {
        const mockVectorTile = vi.mocked(VectorTile);
        mockVectorTile.mockImplementationOnce(() => {
            throw new Error('Parse error');
        });

        await expect(MVTParser.parse(new ArrayBuffer(0), 0, 0, 0)).rejects.toThrow('Parse error');
    });
});
