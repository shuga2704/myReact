"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureRootIsScheduled = ensureRootIsScheduled;
const ReactFiberWorkLoop_1 = require("./ReactFiberWorkLoop");
// A linked list of all the roots with pending work. In an idiomatic app,
// there's only a single root, but we do support multi root apps, hence this
// extra complexity. But this module is optimized for the single root case.
let firstScheduledRoot = null;
let lastScheduledRoot = null;
function ensureRootIsScheduled(root) {
    // This function is called whenever a root receives an update. It does two
    // things 1) it ensures the root is in the root schedule, and 2) it ensures
    // there's a pending microtask to process the root schedule.
    //
    // Most of the actual scheduling logic does not happen until
    // `scheduleTaskForRootDuringMicrotask` runs.
    // Add the root to the schedule
    if (root === lastScheduledRoot || root.next !== null) {
        // Fast path. This root is already scheduled.
    }
    else {
        if (lastScheduledRoot === null) {
            firstScheduledRoot = lastScheduledRoot = root;
        }
        else {
            lastScheduledRoot.next = root;
            lastScheduledRoot = root;
        }
    }
    queueMicrotask(() => {
        (0, ReactFiberWorkLoop_1.performConcurrentWorkOnRoot)(root);
    });
    // scheduleImmediateTask(processRootScheduleInMicrotask);
}
function scheduleImmediateTask(cb) {
    queueMicrotask(() => {
        cb();
    });
}
// function processRootScheduleInMicrotask() {
//     // This function is always called inside a microtask. It should never be
//     // called synchronously.
//     didScheduleMicrotask = false;
//     if (__DEV__) {
//         didScheduleMicrotask_act = false;
//     }
//
//     // We'll recompute this as we iterate through all the roots and schedule them.
//     mightHavePendingSyncWork = false;
//
//     const currentTime = now();
//
//     let prev = null;
//     let root = firstScheduledRoot;
//     while (root !== null) {
//         const next = root.next;
//
//         if (
//             currentEventTransitionLane !== NoLane &&
//             shouldAttemptEagerTransition()
//         ) {
//             // A transition was scheduled during an event, but we're going to try to
//             // render it synchronously anyway. We do this during a popstate event to
//             // preserve the scroll position of the previous page.
//             upgradePendingLaneToSync(root, currentEventTransitionLane);
//         }
//
//         const nextLanes = scheduleTaskForRootDuringMicrotask(root, currentTime);
//         if (nextLanes === NoLane) {
//             // This root has no more pending work. Remove it from the schedule. To
//             // guard against subtle reentrancy bugs, this microtask is the only place
//             // we do this — you can add roots to the schedule whenever, but you can
//             // only remove them here.
//
//             // Null this out so we know it's been removed from the schedule.
//             root.next = null;
//             if (prev === null) {
//                 // This is the new head of the list
//                 firstScheduledRoot = next;
//             } else {
//                 prev.next = next;
//             }
//             if (next === null) {
//                 // This is the new tail of the list
//                 lastScheduledRoot = prev;
//             }
//         } else {
//             // This root still has work. Keep it in the list.
//             prev = root;
//             if (includesSyncLane(nextLanes)) {
//                 mightHavePendingSyncWork = true;
//             }
//         }
//         root = next;
//     }
//
//     currentEventTransitionLane = NoLane;
//
//     // At the end of the microtask, flush any pending synchronous work. This has
//     // to come at the end, because it does actual rendering work that might throw.
//     flushSyncWorkOnAllRoots();
// }
