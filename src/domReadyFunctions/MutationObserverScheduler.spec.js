//@flow
import factory from './MutationObserverReadyFunction';
import type { DomReadyFunction } from '../DomReadyFunction';

describe('The mutation oberserver scheduler', () => {
    it('should be a function', () => {
        expect(typeof factory).toBe('function');
    });

    it('should return a function', () => {
        const sut = factory();
        expect(typeof sut).toBe('function');
    });

    it('should return a function which - when executed - returns a promise which eventually resolves with undefined', async () => {
        const sut : DomReadyFunction = factory() || (() => Promise.reject());
        expect(await sut()).toBeUndefined();
    });
});