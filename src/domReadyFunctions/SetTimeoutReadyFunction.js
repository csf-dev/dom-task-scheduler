//@flow
import type { DomReadyFunction } from '../DomReadyFunction';

/* This DOM-ready function should support all known JavaScript-capable browsers.
 * It uses the least-desirable algorithm and so it should be used as a
 * fall-back option when other DOM-ready functions cannot be used.
 *
 * By using setTimeout, the promise should resolve once the JavaScript
 * queue of pending 'things to run' has cleared.
 */

export default function getSetTimeoutReadyFunction() : DomReadyFunction {
    return function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), 0);
        });
    }
}