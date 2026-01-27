import { describe, it, expect } from 'vitest';
import { WebMercatorProjection } from '@/projection/WebMercatorProjection';
import { WGS84Projection } from '@/projection/WGS84Projection';
import { ProjectionFactory } from '@/projection/ProjectionFactory';

describe('Projection System', () => {
    describe('WebMercatorProjection (3857)', () => {
        const projection = new WebMercatorProjection();

        it('should have correct ID and dimensions', () => {
            expect(projection.ID).toBe('3857');
            expect(projection.mapWidth).toBeCloseTo(2 * Math.PI * 6378000);
            expect(projection.mapHeight).toBe(projection.mapWidth);
        });

        it('should project (0, 0) to (0, 0)', () => {
            const result = projection.forward(0, 0);
            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should inverse (0, 0) back to (0, 0)', () => {
            const result = projection.inverse(0, 0);
            expect(result.lon).toBeCloseTo(0);
            expect(result.lat).toBeCloseTo(0);
        });

        it('should correctly project a known coordinate (Lon 120, Lat 30)', () => {
            const lon = 120;
            const lat = 30;
            const forward = projection.forward(lon, lat);
            const inverse = projection.inverse(forward.x, forward.y);
            
            expect(inverse.lon).toBeCloseTo(lon);
            expect(inverse.lat).toBeCloseTo(lat);
        });

        it('should handle central meridian', () => {
            const projectionWithCM = new WebMercatorProjection(120);
            const result = projectionWithCM.forward(120, 0);
            expect(result.x).toBeCloseTo(0);
        });
    });

    describe('WGS84Projection (4326)', () => {
        const projection = new WGS84Projection();

        it('should have correct ID and dimensions', () => {
            expect(projection.ID).toBe('4326');
            expect(projection.mapWidth).toBe(36000);
            expect(projection.mapHeight).toBe(18000);
        });

        it('should project (0, 0) to (0, 0)', () => {
            const result = projection.forward(0, 0);
            expect(result.x).toBe(0);
            expect(result.y).toBe(0);
        });

        it('should correctly project (Lon 100, Lat 50)', () => {
            const result = projection.forward(100, 50);
            expect(result.x).toBe(10000); // 100 * 100
            expect(result.y).toBe(5000);  // 50 * 100
        });

        it('should inverse correctly', () => {
            const result = projection.inverse(10000, 5000);
            expect(result.lon).toBe(100);
            expect(result.lat).toBe(50);
        });
    });

    describe('ProjectionFactory', () => {
        it('should create WebMercatorProjection by default', () => {
            const p = ProjectionFactory.create();
            expect(p).toBeInstanceOf(WebMercatorProjection);
        });

        it('should create WGS84Projection when requested', () => {
            const p = ProjectionFactory.create('4326');
            expect(p).toBeInstanceOf(WGS84Projection);
        });

        it('should throw error for unsupported projection', () => {
            expect(() => ProjectionFactory.create('unsupported' as any)).toThrow();
        });
    });

    describe('AbstractProjection tile methods', () => {
        const projection = new WebMercatorProjection();

        it('should calculate tile projected bounds correctly at zoom 0', () => {
            // Zoom 0, Tile (0, 0) should cover the whole world
            const bounds = projection.getTileProjectedBounds(0, 0, 0);
            const halfW = projection.mapWidth / 2;
            const halfH = projection.mapHeight / 2;
            
            expect(bounds[0]).toBeCloseTo(-halfW); // minX
            expect(bounds[1]).toBeCloseTo(-halfH); // minY
            expect(bounds[2]).toBeCloseTo(halfW);  // maxX
            expect(bounds[3]).toBeCloseTo(halfH);  // maxY
        });

        it('should adjust tile X with central meridian', () => {
            const pWithCM = new WebMercatorProjection(180); // CM at 180 deg
            // At zoom 1, there are 2 tiles horizontally (0 and 1).
            // 180 degrees offset is half of the tiles count.
            // So tile 0 should become tile 1.
            const adjustedX = pWithCM.adjustTileXWithCentralMeridian(0, 1);
            expect(adjustedX).toBe(1);
        });
    });
});
