//@flow
import { SchedulesDomTasks } from './SchedulesDomTasks';
import getBestReadyFunction from './DomReadyFunction';
import type { DomReadyFunction } from './DomReadyFunction';
import { TaskQueue } from './TaskQueue';
import type { DomTask } from './SchedulesDomTasks';

export class DomTaskScheduler implements SchedulesDomTasks {
    #domReadyFunction : DomReadyFunction;
    #queues : Array<TaskQueue>;
    #domReadyPromise : ?Promise<void>;

    get hasTasks() : bool { return this.#queues.length > 0; }
    get tasksComplete() : Promise<void> {
        if(!this.hasTasks) { return Promise.resolve(); }
        const allDone = this.#queues.map(queue => queue.complete);
        return Promise.all(allDone).then(() => {});
    };

    addTask(task : DomTask) : void {
        if(!this.hasTasks || !this.#domReadyFunction) {
            const promiseFactory = this.#domReadyFunction;
            this.#domReadyPromise = promiseFactory()
                .then(() => this.runAllNow());
            this.#queues.push(new TaskQueue());
        }

        const lastQueue = this.#queues[this.#queues.length - 1];
        lastQueue.add(task);
    }
    async runAllNow() : Promise<void> {
        const queues = this.#queues.slice();

        this.#domReadyPromise = null;

        const results = queues.map(queue => queue.runAll());
        await Promise.all(results);

        this.#queues.splice(0, queues.length);
    }

    constructor(domReadyFunction : DomReadyFunction) {
        this.#domReadyFunction = domReadyFunction;
        this.#queues = [];
    }
}

export default function getDomTaskScheduler() : SchedulesDomTasks {
    const readyFunction = getBestReadyFunction();
    return new DomTaskScheduler(readyFunction);
}