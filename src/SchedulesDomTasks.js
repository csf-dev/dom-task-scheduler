//@flow

export type DomTask = () => ?Promise<void>;

export interface SchedulesDomTasks {
    +hasTasks : bool;
    +tasksComplete : Promise<void>;
    addTask(task : DomTask) : void;
    runAllNow() : Promise<void>;
}