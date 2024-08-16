"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFiber = void 0;
const types_1 = require("./types");
function createFiberImplObject(tag, pendingProps, key, mode) {
    const fiber = {
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
        lanes: types_1.NoLanes,
        childLanes: types_1.NoLanes,
        // pendingProps - defined at the bottom as dynamic properties
        memoizedProps: null,
        updateQueue: null,
        memoizedState: null,
        // dependencies: null,
        // Effects
        flags: types_1.NoFlags,
        subtreeFlags: types_1.NoFlags,
        deletions: null,
        alternate: null,
    };
    return fiber;
}
exports.createFiber = createFiberImplObject;
