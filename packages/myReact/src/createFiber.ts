import { Fiber, WorkTag, TypeOfMode, NoFlags, NoLanes } from './types';

function createFiberImplObject(
    tag: WorkTag,
    pendingProps: any,
    key: null | string,
    mode: TypeOfMode,
): Fiber {
    const fiber: any = {
        tag,
        key,
        pendingProps,
        mode,

        elementType: null,
        type: null,
        stateNode: null,

        // Fiber
        return: null,
        child: null,
        sibling: null,
        index: 0,

        ref: null,
        refCleanup: null,

        lanes: NoLanes,
        childLanes: NoLanes,

        // pendingProps - defined at the bottom as dynamic properties
        memoizedProps: null,
        updateQueue: null,
        memoizedState: null,
        props: null,
        // dependencies: null,

        // Effects
        flags: NoFlags,
        subtreeFlags: NoFlags,
        deletions: null,

        alternate: null,
    };

    return fiber;
}

export const createFiber = createFiberImplObject;
