//@flow
import factory from './SetTimeoutReadyFunction';
import type { DomReadyFunction } from '../DomReadyFunction';

describe('The set-timeout scheduler', () => {
    it('should be a function', () => {
        expect(typeof factory).toBe('function');
    });

    it('should return a function', () => {
        const sut = factory();
        expect(typeof sut).toBe('function');
    });

    it('should return a function which - when executed - returns a promise which eventually resolves with undefined', async () => {
        const sut : DomReadyFunction = factory();
        expect(await sut()).toBeUndefined();
    });
});