import { describe, it, expect, vi } from 'vitest';
import { getLocalFromMouse, limitCameraHeight } from '@/utils/tilemaputils';
import { Vector3, PerspectiveCamera } from 'three';
import * as mapUtils from '@/map/utils';

// Mock mapUtils
vi.mock('@/map/utils', () => ({
    getLocalInfoFromScreen: vi.fn(),
    getLocalInfoFromWorld: vi.fn()
}));

describe('tilemaputils', () => {
    describe('getLocalFromMouse', () => {
        it('should return location from mouse event', () => {
            const mockTarget = document.createElement('div');
            Object.defineProperty(mockTarget, 'clientWidth', { value: 1000 });
            Object.defineProperty(mockTarget, 'clientHeight', { value: 500 });
            
            const mouseEvent = {
                currentTarget: mockTarget,
                clientX: 500,
                clientY: 250
            };
            
            const mockMap = {} as any;
            const mockCamera = {} as any;
            
            const expectedLocation = new Vector3(100, 200, 300);
            (mapUtils.getLocalInfoFromScreen as any).mockReturnValue({
                location: expectedLocation
            });
            
            const result = getLocalFromMouse(mouseEvent as any, mockMap, mockCamera);
            
            expect(mapUtils.getLocalInfoFromScreen).toHaveBeenCalledWith(
                mockCamera,
                mockMap,
                expect.objectContaining({ x: 0, y: 0 }) // (500/1000)*2 - 1 = 0, -(250/500)*2 + 1 = 0
            );
            expect(result).toBe(expectedLocation);
        });

        it('should return undefined if target is not HTMLElement', () => {
            const mouseEvent = { currentTarget: {} };
            const result = getLocalFromMouse(mouseEvent as any, {} as any, {} as any);
            expect(result).toBeUndefined();
        });
    });

    describe('limitCameraHeight', () => {
        it('should adjust camera position when below limitHeight', () => {
            const mockCamera = new PerspectiveCamera(45, 1, 0.1, 1000);
            mockCamera.position.set(0, 100, 0);
            mockCamera.near = 10;
            mockCamera.fov = 45;
            mockCamera.updateMatrixWorld();

            const mockMap = {
                up: new Vector3(0, 1, 0),
                localToWorld: vi.fn().mockImplementation((v) => v.clone())
            } as any;

            // Mock getLocalInfoFromWorld to return a surface at y=95
            // Camera checkPoint will be at 100 - (some offset)
            // Let's just mock the return value
            (mapUtils.getLocalInfoFromWorld as any).mockReturnValue({
                point: new Vector3(0, 95, 0)
            });

            // limitHeight = 10, if camera is at 100, and ground is at 95, 
            // checkPoint will be around 100 - near = 90. 
            // h = 90 - 95 = -5.
            // offset = -(-5) * 1.1 = 5.5
            
            const hit = limitCameraHeight(mockMap, mockCamera, 10);
            
            expect(hit).toBe(true);
            expect(mockCamera.position.y).toBeGreaterThan(100);
        });

        it('should not adjust camera when above limitHeight', () => {
            const mockCamera = new PerspectiveCamera(45, 1, 0.1, 1000);
            mockCamera.position.set(0, 200, 0);
            mockCamera.updateMatrixWorld();

            const mockMap = {} as any;

            (mapUtils.getLocalInfoFromWorld as any).mockReturnValue({
                point: new Vector3(0, 0, 0)
            });

            const hit = limitCameraHeight(mockMap, mockCamera, 10);
            expect(hit).toBe(false);
            expect(mockCamera.position.y).toBe(200);
        });
    });
});
