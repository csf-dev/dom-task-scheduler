//@flow
import tryGetMutationObservableReadyFunction from './domReadyFunctions/MutationObserverReadyFunction';
import tryGetReadyStateChangeReadyFunction from './domReadyFunctions/ReadyStateChangeReadyFunction';
import getSetTimeoutReadyFunction from './domReadyFunctions/SetTimeoutReadyFunction';

/* A DOM-ready function returns a promise which resolves once the browser is ready
 * to make changes to the DOM.  This is the core of the task scheduler; tasks
 * will begin once the ready function has resolved.
 *
 * The promise returned by a ready function will resolve 'as soon as is reasonably
 * possible' but after the browser has finished executing its current synchronous
 * workload.
 */
export type DomReadyFunction = () => Promise<void>;

/* There are a few algorithms available for creating a DOM-ready function.
 * This function picks and returns the "best" one, based upon the
 * browser/environment's available support.
 */
export default function getBestReadyFunction() : DomReadyFunction {
    return tryGetMutationObservableReadyFunction()
           || tryGetReadyStateChangeReadyFunction()
           || getSetTimeoutReadyFunction();
}