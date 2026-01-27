import { describe, it, expect, vi } from 'vitest';
import { TDTSource } from '@/sources/TDTSource';
import { MapBoxSource } from '@/sources/MapBoxSource';

describe('Map Sources', () => {
    it('should generate TDT URLs correctly', () => {
        const source = new TDTSource({
            token: 'test-token',
            style: 'vec_w'
        });

        const url = source.getUrl(1, 2, 3);
        expect(url).toContain('test-token');
        expect(url).toContain('vec_w');
    });

    it('should generate MapBox URLs correctly', () => {
        const source = new MapBoxSource({
            token: 'test-token',
            style: 'streets-v11'
        });

        const url = source.getUrl(1, 2, 3);
        expect(url).toContain('test-token');
        expect(url).toContain('streets-v11');
    });
});
