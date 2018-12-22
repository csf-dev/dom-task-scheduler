//@flow
import type { DomTask } from './SchedulesDomTasks';

export class TaskQueue {
    #tasks : Array<DomTask>;
    #queueResolver : () => void;
    #queueResolved : Promise<void>;

    get tasks() : Array<DomTask> { return this.#tasks; }

    get complete() : Promise<void> { return this.#queueResolved; }

    add(task : DomTask) { this.#tasks.push(task); }

    runAll() : Promise<void> {
        const taskResults = this.#tasks.map(task => task() || Promise.resolve());
        const resolver = this.#queueResolver;
        return Promise.all(taskResults)
            .then(() => resolver());
    }

    constructor() {
        this.#tasks = [];
        this.#queueResolved = new Promise((res, rej) => {
            this.#queueResolver = res;
        });
    }
}