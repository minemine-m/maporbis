import { describe, it, expect } from 'vitest';
import Browser from '@/core/Browser';

describe('Browser Capabilities', () => {
    it('should have basic browser property checks', () => {
        expect(Browser).toBeDefined();
        // In JSDOM, IS_NODE depends on how the environment is set up.
        // Usually, Vitest with jsdom environment might have IS_NODE as false if correctly simulated.
        // But our Browser.ts checks IS_NODE from '../utils/env'.
        
        // We can check if common properties are booleans
        expect(typeof Browser.ie).toBe('boolean');
        expect(typeof Browser.chrome).toBe('boolean');
        expect(typeof Browser.mobile).toBe('boolean');
        expect(typeof Browser.touch).toBe('boolean');
        expect(typeof Browser.retina).toBe('boolean');
    });

    it('should have devicePixelRatio', () => {
        expect(typeof Browser.devicePixelRatio).toBe('number');
        expect(Browser.devicePixelRatio).toBeGreaterThan(0);
    });

    it('should detect capabilities like webgl and resizeObserver', () => {
        // JSDOM usually doesn't have WebGL unless mocked, 
        // but our setup.ts might have mocked some parts.
        expect(typeof Browser.webgl).toBe('boolean');
        expect(typeof Browser.resizeObserver).toBe('boolean');
    });

    it('should allow checking devicePixelRatio change', () => {
        expect(typeof Browser.checkDevicePixelRatio).toBe('function');
        const changed = Browser.checkDevicePixelRatio();
        expect(typeof changed).toBe('boolean');
    });
});
