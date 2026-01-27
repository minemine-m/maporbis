import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PerspectiveCamera, WebGLRenderer, OrthographicCamera } from 'three';
import { PixelUnitConverter } from '@/renderer/PixelUnitConverter';

describe('PixelUnitConverter', () => {
    let camera: PerspectiveCamera;
    let renderer: WebGLRenderer;
    let container: HTMLElement;
    let converter: PixelUnitConverter;

    beforeEach(() => {
        camera = new PerspectiveCamera(45, 1, 0.1, 1000);
        camera.position.set(0, 0, 100);
        camera.updateMatrixWorld();

        renderer = {
            domElement: {
                width: 800,
                height: 600
            }
        } as unknown as WebGLRenderer;

        container = document.createElement('div');
        // Mock getBoundingClientRect
        container.getBoundingClientRect = vi.fn(() => ({
            width: 800,
            height: 600,
            top: 0,
            left: 0,
            bottom: 600,
            right: 800,
            x: 0,
            y: 0,
            toJSON: () => {}
        } as DOMRect));

        converter = new PixelUnitConverter(camera, renderer, container);
    });

    it('should calculate visible height at distance', () => {
        const distance = 100;
        const visibleSize = converter.getVisibleSizeAtDistance(distance);
        
        // height = 2 * tan(fov/2) * distance
        const expectedHeight = 2 * Math.tan((45 * Math.PI / 180) / 2) * distance;
        expect(visibleSize.height).toBeCloseTo(expectedHeight);
    });

    it('should convert pixels to units correctly (Perspective)', () => {
        const pixels = 600;
        const units = converter.pixelsToUnits(pixels, 100);
        
        const visibleSize = converter.getVisibleSizeAtDistance(100);
        expect(units).toBeCloseTo(visibleSize.height);
    });

    it('should convert units to pixels correctly (Perspective)', () => {
        const visibleSize = converter.getVisibleSizeAtDistance(100);
        const pixels = converter.unitsToPixels(visibleSize.height, 100);
        
        expect(pixels).toBeCloseTo(600);
    });

    it('should handle OrthographicCamera', () => {
        const orthoCamera = new OrthographicCamera(-400, 400, 300, -300, 0.1, 1000);
        const orthoConverter = new PixelUnitConverter(orthoCamera, renderer, container);
        
        const units = orthoConverter.pixelsToUnits(600);
        expect(units).toBe(600); // 600 pixels should be 600 units if view is 600 units high and container is 600 pixels high
    });

    it('should use cache for repeated calculations', () => {
        const spy = vi.spyOn(container, 'getBoundingClientRect');
        
        converter.getPixelsToUnit(100);
        converter.getPixelsToUnit(100);
        
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should clear cache on update', () => {
        const spy = vi.spyOn(container, 'getBoundingClientRect');
        
        converter.getPixelsToUnit(100);
        converter.update();
        converter.getPixelsToUnit(100);
        
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
