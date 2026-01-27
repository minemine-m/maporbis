import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InfoWindow } from '@/ui/InfoWindow';
import { ToolTip } from '@/ui/ToolTip';
import { Map } from '@/map';
import { Vector3 } from 'three';

// Mock Map
vi.mock('@/map', () => {
    return {
        Map: vi.fn().mockImplementation(() => ({
            lngLatToWorld: vi.fn().mockReturnValue(new Vector3(0, 0, 0)),
            prjcenter: new Vector3(0, 0, 0),
            getProjection: vi.fn().mockReturnValue({
                project: vi.fn().mockReturnValue(new Vector3(0, 0, 0))
            }),
            sceneRenderer: {
                camera: { projectionMatrix: { elements: new Array(16).fill(0) } },
                renderer: { domElement: { clientHeight: 600 } },
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                project: vi.fn().mockReturnValue({ x: 100, y: 100 })
            },
            getContainer: vi.fn().mockReturnValue(document.createElement('div')),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            on: vi.fn(),
            off: vi.fn(),
            dispatchEvent: vi.fn()
        }))
    };
});

describe('InfoWindow', () => {
    let mockMap: any;

    beforeEach(() => {
        mockMap = new Map('container', {} as any);
    });

    it('should create DOM structure with title and content', () => {
        const info = new InfoWindow({
            title: 'Test Title',
            content: 'Test Content'
        });
        const dom = (info as any).buildOn();
        
        const titleEl = dom.querySelector('.maporbis-infowindow-title');
        const contentEl = dom.querySelector('.maporbis-infowindow-content');
        
        expect(titleEl?.innerHTML || titleEl?.textContent).toBe('Test Title');
        expect(contentEl?.innerHTML).toBe('Test Content');
    });

    it('should support custom DOM content', () => {
        const customContent = document.createElement('div');
        customContent.id = 'custom-ui';
        const info = new InfoWindow({
            content: customContent,
            custom: true
        });
        const dom = (info as any).buildOn();
        expect(dom.querySelector('#custom-ui')).toBeDefined();
    });

    it('should handle close button click', () => {
        const info = new InfoWindow({ title: 'Title' });
        const dom = (info as any).buildOn();
        const closeBtn = dom.querySelector('.maporbis-infowindow-close') as HTMLElement;
        
        const hideSpy = vi.spyOn(info, 'hide');
        closeBtn.click();
        expect(hideSpy).toHaveBeenCalled();
    });

    it('should set title and content dynamically', () => {
        const info = new InfoWindow({ title: 'Old Title', content: 'Old Content' });
        (info as any).buildOn();
        
        info.setTitle('New Title');
        expect(info.options.title).toBe('New Title');
        expect((info as any)._titleEl.textContent).toBe('New Title');
        
        info.setContent('New Content');
        expect(info.options.content).toBe('New Content');
        expect((info as any)._contentEl.innerHTML).toBe('New Content');
    });
});

describe('ToolTip', () => {
    let mockMap: any;

    beforeEach(() => {
        mockMap = new Map('container', {} as any);
    });

    it('should create simple tooltip DOM', () => {
        const tooltip = new ToolTip({ content: 'Tooltip text' });
        const dom = (tooltip as any).buildOn();
        expect(dom.querySelector('.maporbis-tooltip')?.innerHTML).toBe('Tooltip text');
    });

    it('should handle function as content', () => {
        const contentFn = vi.fn().mockImplementation((container) => {
            container.innerHTML = 'Dynamic text';
        });
        const tooltip = new ToolTip({ content: contentFn });
        (tooltip as any).buildOn();
        expect(contentFn).toHaveBeenCalled();
    });

    it('should bind to owner events when added', () => {
        const tooltip = new ToolTip({ content: 'Test' });
        const mockOwner = {
            on: vi.fn(),
            off: vi.fn(),
            getMap: () => mockMap
        };
        
        tooltip.addTo(mockOwner);
        expect(mockOwner.on).toHaveBeenCalledWith('mousemove', expect.any(Function));
        expect(mockOwner.on).toHaveBeenCalledWith('mouseout', expect.any(Function));
    });
});
