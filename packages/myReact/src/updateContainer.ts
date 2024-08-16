import {
    ReactNodeList,
    FiberRoot,
    Fiber,
    SyncLane,
    Lane,
    Update,
    UpdateState,
    SharedQueue,
    SharedQueue as ClassQueue,
    Update as ClassUpdate,
    ConcurrentUpdate,
    ConcurrentQueue,
    HostRoot,
} from './types';

import { scheduleUpdateOnFiber } from './scheduleUpdateOnFiber';

function getRootForUpdatedFiber(sourceFiber: Fiber): FiberRoot | null {
    let node = sourceFiber;
    let parent = node.return;

    while (parent !== null) {
        node = parent;
        parent = node.return;
    }

    return node.tag === HostRoot ? node.stateNode : null;
}

// ReactFiberClassUpdateQueue.js
export function enqueueUpdate<State>(
    fiber: Fiber,
    update: Update<State>,
    lane: Lane,
): FiberRoot | null {
    const updateQueue = fiber.updateQueue;

    // if (updateQueue === null) {
    //     // Only occurs if the fiber has been unmounted.
    //     return null;
    // }

    // const sharedQueue: SharedQueue<State> = updateQueue.shared;

    return enqueueConcurrentClassUpdate(fiber, null, update, lane);
}

// ReactFiberConcurrentUpdates.js
function enqueueUpdate2(
    fiber: Fiber,
    queue: ConcurrentQueue | null,
    update: ConcurrentUpdate | null,
    lane: Lane,
) {
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

export function enqueueConcurrentClassUpdate<State>(
    fiber: Fiber,
    queue: ClassQueue<State> | any,
    update: ClassUpdate<State>,
    lane: Lane,
): FiberRoot | null {
    const concurrentQueue: ConcurrentQueue = queue as any;
    const concurrentUpdate: ConcurrentUpdate = update as any;

    enqueueUpdate2(fiber, concurrentQueue, concurrentUpdate, lane);

    return getRootForUpdatedFiber(fiber);
}

export function createUpdate(lane: Lane): Update<any> {
    const update: Update<any> = {
        lane,

        tag: UpdateState,
        payload: null,
        callback: null,

        next: null,
    };

    return update;
}

function updateContainerImpl(
    rootFiber: Fiber,
    lane: Lane,
    element: ReactNodeList,
    container: FiberRoot,
    parentComponent: any,
    callback: any,
): void {
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
        scheduleUpdateOnFiber(root, rootFiber, lane);
        // entangleTransitions(root, rootFiber, lane);
    }
}

export function updateContainer(
    element: ReactNodeList,
    container: FiberRoot | any,
    parentComponent: any,
    callback: any,
): Lane {
    const rootFiber = container.current;
    const lane = SyncLane; // Результат вызова requestUpdateLane(current)

    rootFiber.memoizedState = {};
    rootFiber.memoizedState.element = element;

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
        scheduleUpdateOnFiber(root, rootFiber, lane);
        // entangleTransitions(root, rootFiber, lane);
    }

    return lane;
}
