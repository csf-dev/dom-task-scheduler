# DOM task scheduler
This small module provides a mechanism by which to schedule tasks (functions) asynchronously on the basis
that they should execute 'as soon as possible, once the browser is ready to render changes to the DOM'.

This is useful when, for example, a script of UI framework may wish to make many changes to the DOM as part
of a batch of operations.  Making this changes 'inline' with the execution of a script can cause needless
repainting of the UI, slowing down the overall script performance.

## Detecting when the browser is ready
At the core of this module is the `DomReadyFunction`.  This function returns a **Promise** which resolves
once the browser is ready to render changes to the DOM.  Using the function `getBestReadyFunction`, this will
select from a number of strategies which (between them) support all known web browsers, but provide the best
performance available.

## Scheduling DOM manipulation tasks
Beyond the detection of when the browser is ready to manipulate the DOM, there is a service which may be
created by the function `getTaskScheduler`.  This scheduling service allows the addition of tasks into a
queue, which will be executed at first opportunity (when the browser is ready).

This scheduling service is reusable; you may add further tasks into its queue even after the queue has been
executed and cleared.  Executed tasks are automatically cleaned and newly-added tasks are scheduled to run
at next opportunity.

You may also use the promise exposed by this service: `tasksComplete`, which resolves once all pending tasks
has completed.  This may be used to schedule or initiate other operations which should occur after the
rendering has completed.

## Installation
Install this module from NPM - the package name is **[dom-task-scheduler](https://www.npmjs.com/package/dom-task-scheduler)**.
