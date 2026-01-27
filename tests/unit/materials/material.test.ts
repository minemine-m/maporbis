import { describe, it, expect } from 'vitest';
import { TileMaterial } from '@/materials/TileMaterial';
import { Color } from 'three';

describe('Materials', () => {
    it('should initialize TileMaterial', () => {
        const material = new TileMaterial({
            color: new Color(0xff0000),
            opacity: 0.5,
            transparent: true
        });

        expect(material.color.getHex()).toBe(0xff0000);
        expect(material.opacity).toBe(0.5);
        expect(material.transparent).toBe(true);
    });
});
