//@flow
import { SchedulesDomTasks } from './SchedulesDomTasks';
import type { DomReadyFunction } from './DomReadyFunction';
import { DomTaskScheduler } from './DomTaskScheduler';
import tryGetMutationObserverReadyFunction from './domReadyFunctions/MutationObserverReadyFunction';

describe('The DOM task scheduler', () => {
    let sut : SchedulesDomTasks;
    let readyNotifiers : Array<() => void>;

    beforeEach(() => {
        readyNotifiers = [];
        sut = new DomTaskScheduler(readyFunction);
    });

    it('should return a resolved promise from tasksComplete if it has no tasks', async () => {
        const promise = sut.tasksComplete;
        let resolved = false;
        let rejected = false;
        await promise.then(() => resolved = true);
        expect(resolved).toBeTruthy();
        expect(rejected).toBeFalsy();
    });

    it('should return a pending promise from tasksComplete if it has one task', async () => {
        sut.addTask(() => {});
        let timedOut = false;
        const timeoutPromise = new Promise((res, rej) => setTimeout(() => { timedOut = true; res(); }, 400));
        await Promise.race([sut.tasksComplete, timeoutPromise]);
        expect(timedOut).toBeTruthy();
    });

    it('should be able to complete two tasks but only after the DOM is ready', async () => {
        let done1 = false, done2 = false;
        sut.addTask(() => { done1 = true; });
        sut.addTask(() => { done2 = true; });

        expect(done1).toBeFalsy();
        expect(done2).toBeFalsy();

        readyNotifiers[0]();
        await sut.tasksComplete;

        expect(done1).toBeTruthy();
        expect(done2).toBeTruthy();
    });

    it('should be reusable - it should be possible to add tasks after a queue has already completed', async () => {
        let done1 = false, done2 = false;

        sut.addTask(() => { done1 = true; });

        expect(done1).toBeFalsy();
        readyNotifiers[0]();
        await sut.tasksComplete;
        expect(done1).toBeTruthy();

        sut.addTask(() => { done2 = true; });
        readyNotifiers[1]();
        await sut.tasksComplete;
        expect(done2).toBeTruthy();
    });

    it('should return a pending promise from tasksComplete after re-use', async () => {
        sut.addTask(() => {});
        readyNotifiers[0]();
        await sut.tasksComplete;
        sut.addTask(() => {});

        let timedOut = false;
        const timeoutPromise = new Promise((res, rej) => setTimeout(() => { timedOut = true; res(); }, 400));
        await Promise.race([sut.tasksComplete, timeoutPromise]);

        expect(timedOut).toBeTruthy();
    });

    it('should return a pending promise from tasksComplete after re-use when waiting for the tasks to complete', async () => {
        sut.addTask(() => {});
        await sut.runAllNow();
        sut.addTask(() => {});

        let timedOut = false;
        const timeoutPromise = new Promise((res, rej) => setTimeout(() => { timedOut = true; res(); }, 400));
        await Promise.race([sut.tasksComplete, timeoutPromise]);
        
        expect(timedOut).toBeTruthy();
    });

    function readyFunction() : Promise<void> {
        return new Promise((res, rej) => {
            readyNotifiers.push(() => res());
        })
    }
});