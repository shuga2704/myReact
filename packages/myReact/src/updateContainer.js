"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueUpdate = enqueueUpdate;
exports.enqueueConcurrentClassUpdate = enqueueConcurrentClassUpdate;
exports.createUpdate = createUpdate;
exports.updateContainer = updateContainer;
const types_1 = require("./types");
const scheduleUpdateOnFiber_1 = require("./scheduleUpdateOnFiber");
function getRootForUpdatedFiber(sourceFiber) {
    let node = sourceFiber;
    let parent = node.return;
    while (parent !== null) {
        node = parent;
        parent = node.return;
    }
    return node.tag === types_1.HostRoot ? node.stateNode : null;
}
// ReactFiberClassUpdateQueue.js
function enqueueUpdate(fiber, update, lane) {
    const updateQueue = fiber.updateQueue;
    if (updateQueue === null) {
        // Only occurs if the fiber has been unmounted.
        return null;
    }
    const sharedQueue = updateQueue.shared;
    return enqueueConcurrentClassUpdate(fiber, sharedQueue, update, lane);
}
// ReactFiberConcurrentUpdates.js
function enqueueUpdate2(fiber, queue, update, lane) {
    // // Don't update the `childLanes` on the return path yet. If we already in
    // // the middle of rendering, wait until after it has completed.
    // concurrentQueues[concurrentQueuesIndex++] = fiber;
    // concurrentQueues[concurrentQueuesIndex++] = queue;
    // concurrentQueues[concurrentQueuesIndex++] = update;
    // concurrentQueues[concurrentQueuesIndex++] = lane;
    //
    // concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);
    //
    // // The fiber's `lane` field is used in some places to check if any work is
    // // scheduled, to perform an eager bailout, so we need to update it immediately.
    // // TODO: We should probably move this to the "shared" queue instead.
    // fiber.lanes = mergeLanes(fiber.lanes, lane);
    // const alternate = fiber.alternate;
    // if (alternate !== null) {
    //     alternate.lanes = mergeLanes(alternate.lanes, lane);
    // }
}
function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {
    const concurrentQueue = queue;
    const concurrentUpdate = update;
    enqueueUpdate2(fiber, concurrentQueue, concurrentUpdate, lane);
    return getRootForUpdatedFiber(fiber);
}
function createUpdate(lane) {
    const update = {
        lane,
        tag: types_1.UpdateState,
        payload: null,
        callback: null,
        next: null,
    };
    return update;
}
function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
    // const context = getContextForSubtree(parentComponent);
    //
    // if (container.context === null) {
    //     container.context = context;
    // } else {
    //     container.pendingContext = context;
    // }
    const update = createUpdate(lane);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = { element };
    callback = callback === undefined ? null : callback;
    if (callback !== null) {
        update.callback = callback;
    }
    const root = enqueueUpdate(rootFiber, update, lane);
    if (root !== null) {
        (0, scheduleUpdateOnFiber_1.scheduleUpdateOnFiber)(root, rootFiber, lane);
        // entangleTransitions(root, rootFiber, lane);
    }
}
function updateContainer(element, container, parentComponent, callback) {
    const current = container.current;
    const lane = types_1.SyncLane; // Результат вызова requestUpdateLane(current)
    updateContainerImpl(current, lane, element, container, parentComponent, callback);
    return lane;
}
