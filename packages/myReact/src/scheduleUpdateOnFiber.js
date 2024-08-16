"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleUpdateOnFiber = scheduleUpdateOnFiber;
const ensureRootIsScheduled_1 = require("./ensureRootIsScheduled");
function scheduleUpdateOnFiber(root, fiber, lane) {
    // // Check if the work loop is currently suspended and waiting for data to
    // // finish loading.
    // if (
    //     // Suspended render phase
    //     (root === workInProgressRoot &&
    //         workInProgressSuspendedReason === SuspendedOnData) ||
    //     // Suspended commit phase
    //     root.cancelPendingCommit !== null
    // ) {
    //     // The incoming update might unblock the current render. Interrupt the
    //     // current attempt and restart from the top.
    //     prepareFreshStack(root, NoLanes);
    //     markRootSuspended(
    //         root,
    //         workInProgressRootRenderLanes,
    //         workInProgressDeferredLane,
    //     );
    // }
    // // Mark that the root has a pending update.
    // markRootUpdated(root, lane);
    if (
    // (executionContext & RenderContext) !== NoLanes &&
    // root === workInProgressRoot
    false) {
        // // This update was dispatched during the render phase. This is a mistake
        // // if the update originates from user space (with the exception of local
        // // hook updates, which are handled differently and don't reach this
        // // function), but there are some internal React features that use this as
        // // an implementation detail, like selective hydration.
        // warnAboutRenderPhaseUpdatesInDEV(fiber);
        //
        // // Track lanes that were updated during the render phase
        // workInProgressRootRenderPhaseUpdatedLanes = mergeLanes(
        //     workInProgressRootRenderPhaseUpdatedLanes,
        //     lane,
        // );
    }
    else {
        // if (root === workInProgressRoot) {
        //     // Received an update to a tree that's in the middle of rendering. Mark
        //     // that there was an interleaved update work on this root.
        //     if ((executionContext & RenderContext) === NoContext) {
        //         workInProgressRootInterleavedUpdatedLanes = mergeLanes(
        //             workInProgressRootInterleavedUpdatedLanes,
        //             lane,
        //         );
        //     }
        //     if (workInProgressRootExitStatus === RootSuspendedWithDelay) {
        //         // The root already suspended with a delay, which means this render
        //         // definitely won't finish. Since we have a new update, let's mark it as
        //         // suspended now, right before marking the incoming update. This has the
        //         // effect of interrupting the current render and switching to the update.
        //         // TODO: Make sure this doesn't override pings that happen while we've
        //         // already started rendering.
        //         markRootSuspended(
        //             root,
        //             workInProgressRootRenderLanes,
        //             workInProgressDeferredLane,
        //         );
        //     }
        // }
        (0, ensureRootIsScheduled_1.ensureRootIsScheduled)(root);
        // if (
        //     lane === SyncLane &&
        //     executionContext === NoContext &&
        //     !disableLegacyMode &&
        //     (fiber.mode & ConcurrentMode) === NoMode
        // ) {
        //     if (__DEV__ && ReactSharedInternals.isBatchingLegacy) {
        //         // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        //     } else {
        //         // Flush the synchronous work now, unless we're already working or inside
        //         // a batch. This is intentionally inside scheduleUpdateOnFiber instead of
        //         // scheduleCallbackForFiber to preserve the ability to schedule a callback
        //         // without immediately flushing it. We only do this for user-initiated
        //         // updates, to preserve historical behavior of legacy mode.
        //         resetRenderTimer();
        //         flushSyncWorkOnLegacyRootsOnly();
        //     }
        // }
    }
}
