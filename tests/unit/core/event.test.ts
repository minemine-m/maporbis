import { describe, it, expect, vi } from 'vitest';
import { EventClass } from '@/core/event/index';

describe('EventClass', () => {
    it('should subscribe and fire events', () => {
        const events = new EventClass();
        const callback = vi.fn();

        events.on('test', callback);
        events.fire('test', { foo: 'bar' });

        expect(callback).toHaveBeenCalledWith({ foo: 'bar' });
    });

    it('should unsubscribe from events', () => {
        const events = new EventClass();
        const callback = vi.fn();

        events.on('test', callback);
        events.off('test', callback);
        events.fire('test', { foo: 'bar' });

        expect(callback).not.toHaveBeenCalled();
    });

    it('should support once() for one-time events', () => {
        const events = new EventClass();
        const callback = vi.fn();

        events.once('test', callback);
        events.fire('test', 1);
        events.fire('test', 2);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(1);
    });

    it('should support chaining', () => {
        const events = new EventClass();
        const callback = vi.fn();

        const result = events.on('test', callback).fire('test').off('test', callback);
        
        expect(result).toBe(events);
        expect(callback).toHaveBeenCalled();
    });

    it('should provide threeEventDispatcher', () => {
        const events = new EventClass();
        expect(events.threeEventDispatcher).toBeDefined();
    });
});
