import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UIComponent } from '@/ui/UIComponent';
import { Vector3 } from 'three';

// Concrete subclass for testing
class TestUIComponent extends UIComponent {
    protected buildOn(): HTMLElement {
        const div = document.createElement('div');
        div.className = 'test-ui';
        return div;
    }
}

describe('UIComponent', () => {
    let component: TestUIComponent;
    let mockMap: any;

    beforeEach(() => {
        component = new TestUIComponent({ dx: 10, dy: 20 });
        mockMap = {
            getContainer: vi.fn().mockReturnValue(document.createElement('div')),
            lngLatToWorld: vi.fn().mockReturnValue(new Vector3(0, 0, 0)),
            sceneRenderer: {
                camera: { 
                    updateMatrixWorld: vi.fn(),
                    projectionMatrix: { elements: [] }
                },
                width: 800,
                height: 600,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            },
            on: vi.fn(),
            off: vi.fn()
        };
        // Mock project method on Vector3
        Vector3.prototype.project = vi.fn().mockReturnValue(new Vector3(0, 0, 0));
    });

    it('should initialize with options', () => {
        expect(component.options.dx).toBe(10);
        expect(component.options.dy).toBe(20);
    });

    it('should add to map and bind events', () => {
        component.addTo(mockMap);
        expect(mockMap.on).toHaveBeenCalledWith('viewchange', expect.any(Function));
        expect(mockMap.sceneRenderer.addEventListener).toHaveBeenCalledWith('update', expect.any(Function));
    });

    it('should show and create DOM', () => {
        component.addTo(mockMap);
        component.show([120, 30]);
        
        expect((component as any)._dom).toBeDefined();
        expect(mockMap.getContainer().appendChild).toBeDefined();
    });

    it('should hide and remove DOM', () => {
        component.addTo(mockMap);
        component.show([120, 30]);
        component.hide();
        
        expect(component.isVisible()).toBe(false);
        expect((component as any)._dom.style.display).toBe('none');
    });
});
