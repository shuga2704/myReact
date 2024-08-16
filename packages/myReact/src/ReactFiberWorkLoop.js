"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performConcurrentWorkOnRoot = performConcurrentWorkOnRoot;
const ReactFiber_1 = require("./ReactFiber");
const ReactFiberBeginWork_1 = require("./ReactFiberBeginWork");
const ReactFiberCompleteWork_1 = require("./ReactFiberCompleteWork");
const RootInProgress = 0;
const RootFatalErrored = 1;
const RootErrored = 2;
const RootSuspended = 3;
const RootSuspendedWithDelay = 4;
const RootCompleted = 5;
const RootDidNotComplete = 6;
// The root we're working on
let workInProgressRoot = null;
// The fiber we're working on
let workInProgress = null;
// Whether to root completed, errored, suspended, etc.
let workInProgressRootExitStatus = RootInProgress;
function performConcurrentWorkOnRoot(root) {
    // flushPassiveEffects();
    renderRootSync(root);
    // We now have a consistent tree. Because this is a sync render, we
    // will commit it even if something suspended.
    // const finishedWork: Fiber = root.current.alternate;
    //
    // root.finishedWork = finishedWork;
    // root.finishedLanes = lanes;
    //
    // commitRoot(
    //     root,
    //     workInProgressRootRecoverableErrors,
    //     workInProgressTransitions,
    // );
    //
    // // Before exiting, make sure there's a callback scheduled for the next
    // // pending level.
    // ensureRootIsScheduled(root);
    //
    // return null;
}
function renderRootSync(root) {
    // If the root or lanes have changed, throw out the existing stack
    // and prepare a fresh one. Otherwise we'll continue where we left off.
    if (workInProgressRoot !== root) {
        prepareFreshStack(root);
    }
    // let didSuspendInShell = false;
    outer: do {
        try {
            if (
            // workInProgressSuspendedReason !== NotSuspended &&
            workInProgress !== null) {
                // The work loop is suspended. During a synchronous render, we don't
                // yield to the main thread. Immediately unwind the stack. This will
                // trigger either a fallback or an error boundary.
                // TODO: For discrete and "default" updates (anything that's not
                // flushSync), we want to wait for the microtasks the flush before
                // unwinding. Will probably implement this using renderRootConcurrent,
                // or merge renderRootSync and renderRootConcurrent into the same
                // function and fork the behavior some other way.
                const unitOfWork = workInProgress;
                // const thrownValue = workInProgressThrownValue;
                // switch (workInProgressSuspendedReason) {
                //     case SuspendedOnHydration: {
                //         // Selective hydration. An update flowed into a dehydrated tree.
                //         // Interrupt the current render so the work loop can switch to the
                //         // hydration lane.
                //         resetWorkInProgressStack();
                //         workInProgressRootExitStatus = RootDidNotComplete;
                //         break outer;
                //     }
                //     case SuspendedOnImmediate:
                //     case SuspendedOnData: {
                //         if (
                //             !didSuspendInShell &&
                //             getSuspenseHandler() === null
                //         ) {
                //             didSuspendInShell = true;
                //         }
                //         // Intentional fallthrough
                //     }
                //     default: {
                //         // Unwind then continue with the normal work loop.
                //         workInProgressSuspendedReason = NotSuspended;
                //         workInProgressThrownValue = null;
                //         throwAndUnwindWorkLoop(unitOfWork, thrownValue);
                //         break;
                //     }
                // }
            }
            workLoopSync();
            break;
        }
        catch (thrownValue) {
            // handleThrow(root, thrownValue);
        }
    } while (true);
    // Set this to null to indicate there's no in-progress render.
    workInProgressRoot = null;
    return workInProgressRootExitStatus;
}
function workLoopSync() {
    // Perform work without checking if we need to yield between fiber.
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}
function performUnitOfWork(unitOfWork) {
    // The current, flushed, state of this fiber is the alternate. Ideally
    // nothing should rely on this, but relying on it here means that we don't
    // need an additional field on the work in progress.
    const current = unitOfWork.alternate;
    // setCurrentDebugFiberInDEV(unitOfWork);
    let next;
    next = (0, ReactFiberBeginWork_1.beginWork)(current, unitOfWork);
    // unitOfWork.memoizedProps = unitOfWork.pendingProps;
    if (next === null) {
        // If this doesn't spawn new work, complete the current work.
        completeUnitOfWork(unitOfWork);
    }
    else {
        workInProgress = next;
    }
}
function prepareFreshStack(root, lanes) {
    root.finishedWork = null;
    // root.finishedLanes = NoLanes;
    // const timeoutHandle = root.timeoutHandle;
    // if (timeoutHandle !== noTimeout) {
    //     // The root previous suspended and scheduled a timeout to commit a fallback
    //     // state. Now that we have additional work, cancel the timeout.
    //     root.timeoutHandle = noTimeout;
    //     // $FlowFixMe[incompatible-call] Complains noTimeout is not a TimeoutID, despite the check above
    //     cancelTimeout(timeoutHandle);
    // }
    // const cancelPendingCommit = root.cancelPendingCommit;
    // if (cancelPendingCommit !== null) {
    //     root.cancelPendingCommit = null;
    //     cancelPendingCommit();
    // }
    resetWorkInProgressStack();
    workInProgressRoot = root;
    // root.current === HostRoot
    const rootWorkInProgress = (0, ReactFiber_1.createWorkInProgress)(root.current, null);
    // rootWorkInProgress === HostRoot.workInProgress
    workInProgress = rootWorkInProgress;
    // workInProgressRootRenderLanes = renderLanes = lanes;
    // workInProgressSuspendedReason = NotSuspended;
    // workInProgressThrownValue = null;
    // workInProgressRootDidAttachPingListener = false;
    // workInProgressRootExitStatus = RootInProgress;
    // workInProgressRootFatalError = null;
    // workInProgressRootSkippedLanes = NoLanes;
    // workInProgressRootInterleavedUpdatedLanes = NoLanes;
    // workInProgressRootRenderPhaseUpdatedLanes = NoLanes;
    // workInProgressRootPingedLanes = NoLanes;
    // workInProgressRootConcurrentErrors = null;
    // workInProgressRootRecoverableErrors = null;
    //
    // finishQueueingConcurrentUpdates();
    //
    // if (__DEV__) {
    //     ReactStrictModeWarnings.discardPendingWarnings();
    // }
    return rootWorkInProgress;
}
function resetWorkInProgressStack() {
    if (workInProgress === null)
        return;
    // let interruptedWork;
    // if (workInProgressSuspendedReason === NotSuspended) {
    //     // Normal case. Work-in-progress hasn't started yet. Unwind all
    //     // its parents.
    //     interruptedWork = workInProgress.return;
    // } else {
    //     // Work-in-progress is in suspended state. Reset the work loop and unwind
    //     // both the suspended fiber and all its parents.
    //     resetSuspendedWorkLoopOnUnwind(workInProgress);
    //     interruptedWork = workInProgress;
    // }
    // while (interruptedWork !== null) {
    //     const current = interruptedWork.alternate;
    //     unwindInterruptedWork(
    //         current,
    //         interruptedWork,
    //         workInProgressRootRenderLanes,
    //     );
    //     interruptedWork = interruptedWork.return;
    // }
    workInProgress = null;
}
function completeUnitOfWork(unitOfWork) {
    // Attempt to complete the current unit of work, then move to the next
    // sibling. If there are no more siblings, return to the parent fiber.
    let completedWork = unitOfWork;
    do {
        // The current, flushed, state of this fiber is the alternate. Ideally
        // nothing should rely on this, but relying on it here means that we don't
        // need an additional field on the work in progress.
        const current = completedWork.alternate;
        const returnFiber = completedWork.return;
        let next;
        next = (0, ReactFiberCompleteWork_1.completeWork)(current, completedWork);
        if (next !== null) {
            // Completing this fiber spawned new work. Work on that next.
            workInProgress = next;
            return;
        }
        const siblingFiber = completedWork.sibling;
        if (siblingFiber !== null) {
            // If there is more work to do in this returnFiber, do that next.
            workInProgress = siblingFiber;
            return;
        }
        // Otherwise, return to the parent
        // $FlowFixMe[incompatible-type] we bail out when we get a null
        completedWork = returnFiber;
        // Update the next thing we're working on in case something throws.
        workInProgress = completedWork;
    } while (completedWork !== null);
    // We've reached the root.
    if (workInProgressRootExitStatus === RootInProgress) {
        workInProgressRootExitStatus = RootCompleted;
    }
}
