import { describe, it, expect } from 'vitest';
import { CanvasManager } from '@/core/canvas/index';

describe('CanvasManager', () => {
    it('should create and cache canvas', () => {
        const manager = new CanvasManager();
        const canvas1 = manager.getCanvas(40, 30);
        
        expect(canvas1).toBeInstanceOf(HTMLCanvasElement);
        expect(canvas1.width).toBe(40);
        expect(canvas1.height).toBe(30);

        const canvas2 = manager.getCanvas(40, 30);
        expect(canvas1).toBe(canvas2); // Cached
    });

    it('should handle resolution scale', () => {
        const manager = new CanvasManager();
        const canvas = manager.getCanvas(40, 30, 2);
        
        expect(canvas.width).toBe(80);
        expect(canvas.height).toBe(60);
    });

    it('should handle key suffix', () => {
        const manager = new CanvasManager();
        const canvas1 = manager.getCanvas(40, 30, 1, 'suffix1');
        const canvas2 = manager.getCanvas(40, 30, 1, 'suffix2');
        
        expect(canvas1).not.toBe(canvas2);
    });

    it('should reset canvas state and clear', () => {
        const manager = new CanvasManager();
        const canvas = manager.getCanvas(10, 10);
        const ctx = canvas.getContext('2d')!;
        
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, 10, 10);
        
        // Get again should clear it
        const canvas2 = manager.getCanvas(10, 10);
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        expect(imageData[3]).toBe(0); // Transparent (cleared)
    });
});
