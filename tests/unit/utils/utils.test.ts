import { describe, it, expect } from 'vitest';
import { 
    interpolate, 
    waitUntil, 
    toRadians, 
    toDegrees, 
    formatDate, 
    isNullOrUndefined, 
    isValidNumber,
    isEmpty
} from '@/utils/index';

describe('Utility Functions', () => {
    describe('interpolate', () => {
        it('should replace placeholders with data', () => {
            const tmpl = 'Hello {name}, welcome to {place}!';
            const data = { name: 'Qoder', place: 'MapOrbis' };
            expect(interpolate(tmpl, data)).toBe('Hello Qoder, welcome to MapOrbis!');
        });

        it('should throw error if key is missing', () => {
            const tmpl = 'Hello {name}';
            const data = {};
            expect(() => interpolate(tmpl, data)).toThrow(/Missing required parameter/);
        });
    });

    describe('waitUntil', () => {
        it('should resolve when condition is met', async () => {
            let value = false;
            setTimeout(() => { value = true; }, 50);
            
            const start = Date.now();
            await waitUntil(() => value, 10);
            const duration = Date.now() - start;
            
            expect(value).toBe(true);
            expect(duration).toBeGreaterThanOrEqual(50);
        });
    });

    describe('Math utilities', () => {
        it('should convert degrees to radians', () => {
            expect(toRadians(180)).toBe(Math.PI);
            expect(toRadians(90)).toBe(Math.PI / 2);
        });

        it('should convert radians to degrees', () => {
            expect(toDegrees(Math.PI)).toBe(180);
            expect(toDegrees(Math.PI / 2)).toBe(90);
        });
    });

    describe('Validation utilities', () => {
        it('isNullOrUndefined', () => {
            expect(isNullOrUndefined(null)).toBe(true);
            expect(isNullOrUndefined(undefined)).toBe(true);
            expect(isNullOrUndefined(0)).toBe(false);
            expect(isNullOrUndefined('')).toBe(false);
        });

        it('isValidNumber', () => {
            expect(isValidNumber(123)).toBe(true);
            expect(isValidNumber(0)).toBe(true);
            expect(isValidNumber(NaN)).toBe(false);
            expect(isValidNumber('123')).toBe(false);
        });

        it('isEmpty', () => {
            expect(isEmpty({})).toBe(true);
            expect(isEmpty({ a: 1 })).toBe(false);
            expect(isEmpty(null as any)).toBe(true);
        });
    });

    describe('formatDate', () => {
        it('should format date correctly', () => {
            const date = new Date(2023, 0, 1, 12, 30, 45); // 2023-01-01 12:30:45
            expect(formatDate(date)).toBe('2023-01-01 12:30:45');
        });
    });
});
