//@flow
import factory from './ReadyStateChangeReadyFunction';
import type { DomReadyFunction } from '../DomReadyFunction';

describe('The readystatechange scheduler', () => {
    it('should be a function', () => {
        expect(typeof factory).toBe('function');
    });

    it('should return null if the readystatechange event is not supported', () => {
        if(readyStateChangeSupported())
            pending('readystatechange is supported in this environment.');

        const sut = factory();
        expect(sut).toBeNull();
    });

    it('should return a function', () => {
        if(!readyStateChangeSupported())
            pending('readystatechange is not supported in this environment.');

        const sut = factory();
        expect(typeof sut).toBe('function');
    });

    it('should return a function which - when executed - returns a promise which eventually resolves with undefined', async () => {
        if(!readyStateChangeSupported())
            pending('readystatechange is not supported in this environment.');

        const sut : DomReadyFunction = factory() || (() => Promise.reject());
        expect(await sut()).toBeUndefined();
    });
});

function readyStateChangeSupported() {
    return window && window.document && ('onreadystatechange' in document.createElement('script'));
}