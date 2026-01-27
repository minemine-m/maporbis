import { describe, it, expect, vi } from 'vitest';
import { matchFilter } from '@/style/filter';
import { LayerPaint } from '@/style/Layerstyle';
import { Paint } from '@/style/index';
import { Points, PointsMaterial } from 'three';

describe('Style Filter', () => {
    const properties = {
        class: 'highway',
        speed: 100,
        available: true,
        type: 'residential'
    };

    it('should match simple comparisons', () => {
        expect(matchFilter(['==', ['get', 'class'], 'highway'], properties)).toBe(true);
        expect(matchFilter(['==', ['get', 'class'], 'street'], properties)).toBe(false);
        expect(matchFilter(['!=', ['get', 'class'], 'street'], properties)).toBe(true);
    });

    it('should match numerical comparisons', () => {
        expect(matchFilter(['>', ['get', 'speed'], 50], properties)).toBe(true);
        expect(matchFilter(['<', ['get', 'speed'], 200], properties)).toBe(true);
        expect(matchFilter(['>=', ['get', 'speed'], 100], properties)).toBe(true);
        expect(matchFilter(['<=', ['get', 'speed'], 100], properties)).toBe(true);
    });

    it('should handle logical operators (all, any, !)', () => {
        expect(matchFilter(['all', 
            ['==', ['get', 'class'], 'highway'],
            ['>', ['get', 'speed'], 50]
        ], properties)).toBe(true);

        expect(matchFilter(['any', 
            ['==', ['get', 'class'], 'street'],
            ['>', ['get', 'speed'], 50]
        ], properties)).toBe(true);

        expect(matchFilter(['!', ['==', ['get', 'class'], 'street']], properties)).toBe(true);
    });

    it('should handle "in" and "!in"', () => {
        expect(matchFilter(['in', ['get', 'type'], 'residential', 'service'], properties)).toBe(true);
        expect(matchFilter(['in', ['get', 'type'], 'industrial', 'service'], properties)).toBe(false);
        expect(matchFilter(['!in', ['get', 'type'], 'industrial'], properties)).toBe(true);
    });

    it('should handle "has" and "!has"', () => {
        expect(matchFilter(['has', 'class'], properties)).toBe(true);
        expect(matchFilter(['has', 'nonexistent'], properties)).toBe(false);
        expect(matchFilter(['!has', 'nonexistent'], properties)).toBe(true);
    });
});

describe('LayerPaint', () => {
    it('should return default paint when no rules match but default exists', () => {
        const lp = new LayerPaint({ type: 'circle', size: 10 });
        expect(lp.getPaint({}, 10)).toEqual({ type: 'circle', size: 10 });
    });

    it('should match rules using filter engine', () => {
        const mockFilterEngine = {
            evaluate: vi.fn().mockImplementation((filter, props) => {
                if (filter === 'rule1' && props.id === 1) return true;
                if (filter === true) return true;
                return false;
            })
        };

        const rules = [
            { filter: 'rule1', paint: { type: 'circle', size: 20 } as any },
            { filter: true, paint: { type: 'circle', size: 10 } as any }
        ];

        const lp = new LayerPaint(rules, mockFilterEngine);
        
        expect(lp.getPaint({ properties: { id: 1 } }, 10)).toEqual({ type: 'circle', size: 20 });
        expect(lp.getPaint({ properties: { id: 2 } }, 10)).toEqual({ type: 'circle', size: 10 });
    });
});

describe('Paint', () => {
    it('should apply circle paint to Points object', async () => {
        const paint = new Paint({
            type: 'circle',
            color: '#ff0000',
            size: 15,
            sizeAttenuation: true
        });

        const points = new Points(undefined, new PointsMaterial());
        points.position.set(1, 2, 3);
        
        await paint.applyTo(points);

        const material = points.material as PointsMaterial;
        expect(material.size).toBe(15 * 0.002);
        expect(material.color.getHex()).toBe(0xff0000);
        expect(material.sizeAttenuation).toBe(true);
    });

    it('should handle visibility', async () => {
        const paint = new Paint({ type: 'circle', size: 5, visible: false });
        const obj = new Points();
        await paint.applyTo(obj);
        expect(obj.visible).toBe(false);
    });
});
