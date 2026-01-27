import { describe, it, expect, beforeEach } from 'vitest';
import { LayerContainer } from '@/layer/LayerContainer';
import { PointLayer } from '@/layer/PointLayer';
import { LineLayer } from '@/layer/LineLayer';
import { PolygonLayer } from '@/layer/PolygonLayer';
import { Marker } from '@/feature/Marker';
import { LineString } from '@/feature/LineString';
import { Polygon } from '@/feature/Polygon';

describe('Layer System', () => {
    describe('LayerContainer', () => {
        let container: LayerContainer;

        beforeEach(() => {
            container = new LayerContainer();
        });

        it('should add and remove layers', () => {
            const layer = new PointLayer('test-layer');
            container.add(layer);
            
            expect(container.getLayers()).toContain(layer);
            expect(container.getLayerById('test-layer')).toBe(layer);

            container.remove(layer);
            expect(container.getLayers()).not.toContain(layer);
        });

        it('should throw error for duplicate layer IDs', () => {
            const layer1 = new PointLayer('dup');
            const layer2 = new PointLayer('dup');
            container.add(layer1);
            expect(() => container.add(layer2)).toThrow();
        });

        it('should clear all layers', () => {
            container.add(new PointLayer('l1'));
            container.add(new PointLayer('l2'));
            container.clearLayers();
            expect(container.getLayers().length).toBe(0);
        });
    });

    describe('OverlayLayer (PointLayer)', () => {
        let layer: PointLayer;

        beforeEach(() => {
            layer = new PointLayer('test-layer');
        });

        it('should add and remove features', () => {
            const marker = new Marker({
                geometry: { type: 'Point', coordinates: [0, 0] },
                id: 'm1'
            });

            layer.addFeature(marker);
            expect(layer.getCount()).toBe(1);
            expect(layer.getFeatures()).toContain(marker);

            layer.removeFeature(marker);
            expect(layer.getCount()).toBe(0);
        });

        it('should validate features', () => {
            const marker = new Marker({
                geometry: { type: 'Point', coordinates: [0, 0] },
                id: 'm1'
            });
            // Marker is a Point, so it should be valid for PointLayer
            expect((layer as any).validateFeature(marker)).toBe(true);
        });

        it('should clear features', () => {
            const m1 = new Marker({ geometry: { type: 'Point', coordinates: [0, 0] } });
            const m2 = new Marker({ geometry: { type: 'Point', coordinates: [0, 0] } });
            layer.addFeature([m1, m2]);
            layer.clear();
            expect(layer.isEmpty()).toBe(true);
        });
    });

    describe('LineLayer', () => {
        it('should validate Line features', () => {
            const layer = new LineLayer('line-layer');
            const line = new LineString({
                geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }
            });
            expect((layer as any).validateFeature(line)).toBe(true);
        });
    });

    describe('PolygonLayer', () => {
        it('should validate Polygon features', () => {
            const layer = new PolygonLayer('poly-layer');
            const poly = new Polygon({
                geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]] }
            });
            expect((layer as any).validateFeature(poly)).toBe(true);
        });
    });
});
