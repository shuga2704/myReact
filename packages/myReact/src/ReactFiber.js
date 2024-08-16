"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkInProgress = createWorkInProgress;
exports.createFiberFromElement = createFiberFromElement;
exports.createFiberFromTypeAndProps = createFiberFromTypeAndProps;
const types_1 = require("./types");
const createFiber_1 = require("./createFiber");
// This is used to create an alternate fiber to do work on.
function createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate;
    if (workInProgress === null) {
        // We use a double buffering pooling technique because we know that we'll
        // only ever need at most two versions of a tree. We pool the "other" unused
        // node that we're free to reuse. This is lazily created to avoid allocating
        // extra objects for things that are never updated. It also allow us to
        // reclaim the extra memory if needed.
        workInProgress = (0, createFiber_1.createFiber)(current.tag, pendingProps, current.key, current.mode);
        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;
        // if (__DEV__) {
        //     // DEV-only fields
        //
        //     workInProgress._debugSource = current._debugSource;
        //     workInProgress._debugOwner = current._debugOwner;
        //     workInProgress._debugHookTypes = current._debugHookTypes;
        // }
        workInProgress.alternate = current;
        current.alternate = workInProgress;
    }
    else {
        workInProgress.pendingProps = pendingProps;
        // Needed because Blocks store data on type.
        workInProgress.type = current.type;
        // We already have an alternate.
        // Reset the effect tag.
        workInProgress.flags = types_1.NoFlags;
        // The effects are no longer valid.
        workInProgress.subtreeFlags = types_1.NoFlags;
        workInProgress.deletions = null;
    }
    // Reset all effects except static ones.
    // Static effects are not specific to a render.
    workInProgress.flags = current.flags & types_1.StaticMask;
    // workInProgress.childLanes = current.childLanes;
    // workInProgress.lanes = current.lanes;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;
    workInProgress.updateQueue = current.updateQueue;
    // // Clone the dependencies object. This is mutated during the render phase, so
    // // it cannot be shared with the current fiber.
    // const currentDependencies = current.dependencies;
    // workInProgress.dependencies =
    //     currentDependencies === null
    //         ? null
    //         : {
    //               lanes: currentDependencies.lanes,
    //               firstContext: currentDependencies.firstContext,
    //           };
    // These will be overridden during the parent's reconciliation
    workInProgress.sibling = current.sibling;
    workInProgress.index = current.index;
    workInProgress.ref = current.ref;
    workInProgress.refCleanup = current.refCleanup;
    // if (enableProfilerTimer) {
    //     workInProgress.selfBaseDuration = current.selfBaseDuration;
    //     workInProgress.treeBaseDuration = current.treeBaseDuration;
    // }
    // if (__DEV__) {
    //     workInProgress._debugNeedsRemount = current._debugNeedsRemount;
    //     switch (workInProgress.tag) {
    //         case IndeterminateComponent:
    //         case FunctionComponent:
    //         case SimpleMemoComponent:
    //             workInProgress.type = resolveFunctionForHotReloading(
    //                 current.type,
    //             );
    //             break;
    //         case ClassComponent:
    //             workInProgress.type = resolveClassForHotReloading(current.type);
    //             break;
    //         case ForwardRef:
    //             workInProgress.type = resolveForwardRefForHotReloading(
    //                 current.type,
    //             );
    //             break;
    //         default:
    //             break;
    //     }
    // }
    return workInProgress;
}
function createFiberFromElement(element, mode) {
    const type = element.type;
    const key = element.key;
    const pendingProps = element.props;
    return createFiberFromTypeAndProps(type, key, pendingProps, mode);
}
function createFiberFromTypeAndProps(type, // React$ElementType
key, pendingProps, mode) {
    let fiberTag = types_1.IndeterminateComponent;
    // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
    let resolvedType = type;
    if (typeof type === 'function') {
        fiberTag = types_1.FunctionComponent;
    }
    else if (typeof type === 'string') {
        fiberTag = types_1.HostComponent;
    }
    const fiber = (0, createFiber_1.createFiber)(fiberTag, pendingProps, key, mode);
    fiber.elementType = type;
    fiber.type = resolvedType;
    return fiber;
}
