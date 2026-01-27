import { describe, it, expect } from 'vitest';
import { WMTSSource } from '@/sources/WMTSSource';
import { ArcGisSource, ArcGisDemSource } from '@/sources/ArcGisSource';

describe('WMTSSource', () => {
    it('should generate correct URL with default settings', () => {
        const source = new WMTSSource({
            urlTemplate: 'http://test.com/{z}/{x}/{y}'
        });
        const url = source.getUrl(1, 2, 3);
        expect(url).toBe('http://test.com/3/1/2');
    });

    it('should handle TMS coordinates', () => {
        const source = new WMTSSource({
            urlTemplate: 'http://test.com/{z}/{x}/{y}',
            isTMS: true
        });
        // zoom 3, Y range 0-7. reverseY = 7 - 2 = 5
        const url = source.getUrl(1, 2, 3);
        expect(url).toBe('http://test.com/3/1/5');
    });

    it('should support WMTS standard parameters', () => {
        const source = new WMTSSource({
            urlTemplate: 'http://test.com?layer=test&style=default&tilematrix={tileMatrix}&tilerow={tileRow}&tilecol={tileCol}'
        });
        const url = source.getUrl(10, 20, 5);
        expect(url).toContain('tilematrix=5');
        expect(url).toContain('tilerow=20');
        expect(url).toContain('tilecol=10');
    });
});

describe('ArcGisSource', () => {
    it('should use default style and generate correct URL', () => {
        const source = new ArcGisSource();
        expect(source.dataType).toBe('image');
        expect(source.style).toBe('World_Imagery');
        
        const url = source.getUrl(1, 2, 3);
        expect(url).toBe('https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/3/2/1');
    });

    it('should allow custom style', () => {
        const source = new ArcGisSource({ style: 'World_Street_Map' });
        const url = source.getUrl(1, 2, 3);
        expect(url).toContain('World_Street_Map');
    });
});

describe('ArcGisDemSource', () => {
    it('should have correct metadata', () => {
        const source = new ArcGisDemSource();
        expect(source.dataType).toBe('lerc');
        expect(source.minLevel).toBe(6);
        expect(source.maxLevel).toBe(13);
    });

    it('should generate correct terrain tile URL', () => {
        const source = new ArcGisDemSource();
        const url = source.getUrl(10, 20, 8);
        expect(url).toBe('https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/8/20/10');
    });
});
