//@flow
import { SchedulesDomTasks } from './SchedulesDomTasks';
import getBestReadyFunction from './DomReadyFunction';
import type { DomReadyFunction } from './DomReadyFunction';
import { TaskQueue } from './TaskQueue';
import type { DomTask } from './SchedulesDomTasks';

export class DomTaskScheduler implements SchedulesDomTasks {
    #domReadyFunction : DomReadyFunction;
    #queue : ?TaskQueue;

    get hasTasks() : bool { return this.#queue !== null; }
    get tasksComplete() : Promise<void> {
        if(!this.#queue) return Promise.resolve();
        return this.#queue.complete;
    };

    addTask(task : DomTask) : void {
        if(!this.#queue) {
            const getReadyPromise = this.#domReadyFunction;
            getReadyPromise().then(() => this.runAllNow());
            this.#queue = new TaskQueue();
        }

        this.#queue.add(task);
    }
    runAllNow() : Promise<void> {
        const queue = this.#queue;
        if(!queue) return Promise.resolve();

        this.#queue = null;
        return queue.runAll();
    }

    constructor(domReadyFunction : DomReadyFunction) {
        this.#domReadyFunction = domReadyFunction;
        this.#queue = null;
    }
}

export default function getDomTaskScheduler() : SchedulesDomTasks {
    const readyFunction = getBestReadyFunction();
    return new DomTaskScheduler(readyFunction);
}