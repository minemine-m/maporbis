import { describe, it, expect, vi } from 'vitest';
import { StrategyOrchestrator } from '@/core/collision/StrategyOrchestrator';
import { PriorityCollisionStrategy } from '@/core/collision/PriorityCollisionStrategy';
import { ICollidable } from '@/core/collision/interfaces/ICollidable';
import { CollisionReason } from '@/core/collision/types/CollisionTypes';

describe('StrategyOrchestrator', () => {
    it('should execute strategies in order and merge results', async () => {
        const orchestrator = new StrategyOrchestrator();
        
        const strategy1 = {
            name: 'strategy1',
            enabled: true,
            execute: vi.fn().mockImplementation(async () => [
                { featureId: 'f1', visible: false, reason: CollisionReason.PRIORITY_LOST, timestamp: 0 }
            ])
        };

        const strategy2 = {
            name: 'strategy2',
            enabled: true,
            execute: vi.fn().mockImplementation(async () => [
                { featureId: 'f2', visible: false, reason: CollisionReason.PRIORITY_LOST, timestamp: 0 }
            ])
        };

        orchestrator.registerStrategy(strategy1 as any);
        orchestrator.registerStrategy(strategy2 as any);

        const features = [{ _id: 'f1' }, { _id: 'f2' }] as ICollidable[];
        const results = await orchestrator.executeStrategies(features, { timestamp: 0 } as any);

        expect(results.get('f1')?.visible).toBe(false);
        expect(results.get('f2')?.visible).toBe(false);
        expect(strategy1.execute).toHaveBeenCalled();
        expect(strategy2.execute).toHaveBeenCalled();
    });

    it('should once hidden, always hidden', async () => {
        const orchestrator = new StrategyOrchestrator();
        
        const strategy1 = {
            name: 'strategy1',
            enabled: true,
            execute: vi.fn().mockImplementation(async () => [
                { featureId: 'f1', visible: false, reason: CollisionReason.PRIORITY_LOST, timestamp: 0 }
            ])
        };

        const strategy2 = {
            name: 'strategy2',
            enabled: true,
            execute: vi.fn().mockImplementation(async () => [
                { featureId: 'f1', visible: true, reason: CollisionReason.NO_COLLISION, timestamp: 0 }
            ])
        };

        orchestrator.registerStrategy(strategy1 as any);
        orchestrator.registerStrategy(strategy2 as any);

        const features = [{ _id: 'f1' }] as ICollidable[];
        const results = await orchestrator.executeStrategies(features, { timestamp: 0 } as any);

        // Even though strategy2 said visible: true, it should stay false from strategy1
        expect(results.get('f1')?.visible).toBe(false);
    });
});

describe('PriorityCollisionStrategy', () => {
    it('should hide lower priority overlapping features', async () => {
        const strategy = new PriorityCollisionStrategy();
        
        const f1 = { 
            _id: 'f1', 
            collidable: true,
            getScreenBoundingBox: () => ({ 
                id: 'b1', x: 0, y: 0, width: 50, height: 50, priority: 5, featureId: 'f1' 
            }) 
        } as unknown as ICollidable;

        const f2 = { 
            _id: 'f2', 
            collidable: true,
            getScreenBoundingBox: () => ({ 
                id: 'b2', x: 10, y: 10, width: 50, height: 50, priority: 10, featureId: 'f2' 
            }) // Overlaps f1, but higher priority value (lower importance)
        } as unknown as ICollidable;

        const results = await strategy.execute([f1, f2], { 
            viewport: { width: 800, height: 600 },
            timestamp: 0 
        } as any, new Map());
        
        const r1 = results.find(r => r.featureId === 'f1');
        const r2 = results.find(r => r.featureId === 'f2');

        expect(r1?.visible).toBe(true);
        expect(r2?.visible).toBe(false);
        expect(r2?.reason).toBe(CollisionReason.PRIORITY_LOST);
    });
});
