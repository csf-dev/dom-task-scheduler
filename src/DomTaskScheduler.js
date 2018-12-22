//@flow
import { SchedulesDomTasks } from './SchedulesDomTasks';
import getBestReadyFunction from './DomReadyFunction';
import type { DomReadyFunction } from './DomReadyFunction';
import { TaskQueue } from './TaskQueue';
import type { DomTask } from './SchedulesDomTasks';

export class DomTaskScheduler implements SchedulesDomTasks {
    #domReadyFunction : DomReadyFunction;
    #currentQueue : TaskQueue;
    #domReadyPromise : ?Promise<void>;

    get hasTasks() : bool { return this.#currentQueue.tasks.length > 0; }
    get tasksComplete() : Promise<void> {
        if(!this.#domReadyPromise) { return Promise.resolve(); }
        return this.#currentQueue.complete;
    };

    addTask(task : DomTask) : void {
        if(!this.#domReadyPromise) {
            const domReadyFunc = this.#domReadyFunction;
            this.#domReadyPromise = domReadyFunc()
                .then(() => this.runAllNow());
        }

        this.#currentQueue.add(task);
    }
    async runAllNow() : Promise<void> {
        const queue = this.#currentQueue;
        await queue.runAll();

        this.#domReadyPromise = null;
        this.#currentQueue = new TaskQueue();
    }

    constructor(domReadyFunction : DomReadyFunction) {
        this.#domReadyFunction = domReadyFunction;
        this.#currentQueue = new TaskQueue();
    }
}

export function createDomTaskScheduler() : SchedulesDomTasks {
    const readyFunction = getBestReadyFunction();
    return new DomTaskScheduler(readyFunction);
}

const singletonScheduler = createDomTaskScheduler();

export default function getDomTaskScheduler() { return singletonScheduler; }