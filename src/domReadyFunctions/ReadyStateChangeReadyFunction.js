//@flow
import type { DomReadyFunction } from '../DomReadyFunction';

/* This DOM-ready function should support Internet Explorer versions 6
 * through 10. It uses an onreadystatechange JavaScript event upon an HTML
 * <script> element to detect that an HTML manipulation has taken
 * place.
 *
 * It functions by appending the script element to the document element,
 * listening for the onreadystatechange event and then (when that event
 * fires), resolving the promise and cleaning up (by removing the script).
 */

export default function tryGetReadyStateChangeReadyFunction() : ?DomReadyFunction {
    if(!document || !document.documentElement || !('onreadystatechange' in document.createElement('script')))
        return null;

    return function() {
        const script = document.createElement('script');

        return new Promise((resolve, reject) => {
            const doc : HTMLElement = (document.documentElement : any);
            script.onreadystatechange = () => {
                script.onreadystatechange = null;
                doc.removeChild(script);
                resolve();
            };
            doc.appendChild(script);
        });
    }
}
