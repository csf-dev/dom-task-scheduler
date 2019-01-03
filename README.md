# DOM task scheduler
This small module provides a mechanism by which to schedule tasks (functions) asynchronously on the basis
that they should execute 'as soon as possible, once the browser is ready to render changes to the DOM'.

This is useful when, for example, a script or UI framework needs to make many changes to the DOM as part
of a batch of operations.  Making these changes 'inline' with the execution of a script can cause needless
repainting of the UI, slowing down the overall script performance.

## Detecting when the browser is ready
At the core of this module is **the DOM-ready function**.  This function takes no parameters and returns a
**Promise** which resolves once the browser is ready to render changes to the DOM.

There are a few *variants* of the DOM-ready function available, each using a different strategy to determine
when the browser is ready to render changes to the DOM.  Different strategies provide different levels of
performance, although not all browsers support all strategies.

This module exposes *a strategy-chooser function* named `getBestReadyFunction`.  Use this to get the DOM-ready
function. It will pick *the best strategy* for the current browser.

## Scheduling DOM manipulation tasks
Beyond the detection of when the browser is ready to manipulate the DOM, there is a service which may be
created by the function `getTaskScheduler`.  This scheduling service maintains a queue of tasks (see below)
which will be executed at first opportunity, when the browser is ready.

### Anatomy of a task
A task should be a JavaScript function which takes no parameters and *may optionally return* a **Promise**
(otherwise return nothing, or `undefined`).

The task's function body may do anything but the intention is that it manipulates the DOM in some manner.
Most tasks don't need to return anything, because typically DOM manipulations are synchronous.  In the rare
case that an async manipulation is required then the task should return a promise, which resolves once the
task's work is complete.

### Scheduling tasks
Use `addTask` to add new tasks to the scheduler.  The task function will be executed asynchronously, at first
opportunity.  `addTask` will add the function to an existing queue if one exists, or it will begin a new queue
if one does not exist.

This behaviour makes a single instance of the scheduling service reusable; you may add further tasks
even after a queue has been executed and cleared from the scheduler.  Executed tasks are automatically
cleaned and newly-added tasks are scheduled to run at next opportunity.

### Acting after the tasks have completed
It may be desirable to know when a queue of tasks has completed, so that further logic may continue executing
*after* any DOM-manipulation tasks have completed.  The scheduler service offers a property named
`tasksComplete`.  This is a promise which resolves any time the queue of tasks has completed.  For example:

```js
const scheduler = getTaskScheduler();
const myElement = document.getElementById('myElement');

scheduler.addTask(() => myElement.classList.add('foo'));
// Perhaps many more DOM changes here interspersed with other logic

scheduler.tasksComplete.then(() => {
    // This executes after the scheduled DOM changes have all completed
});
```

If there are no tasks scheduled at present (the queue is empty), then `tasksComplete` will return *a
resolved promise*.

### Checking whether there is a queue of tasks waiting
A very simple property available on the scheduler service is `hasTasks`; this returns `true` if there are
currently any tasks queued and waiting to be executed, `false` otherwise.

### Running tasks early
If there is ever a need to run all of the scheduled/queued tasks early, you may use the `runAllNow` function.
This bypasses the usual "when the browser is ready to render DOM changes" functionality and sets about running
all of the tasks in the current queue immediately.

This function returns a promise which resolves once all tasks in the queue have finished executing (or an
already-resolved promise if the queue was empty).

## Installation
Install this module from NPM - the package name is **[dom-task-scheduler](https://www.npmjs.com/package/dom-task-scheduler)**.
