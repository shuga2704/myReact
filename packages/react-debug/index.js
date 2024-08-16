'use strict';

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => typeof child === 'object' ? child : createTextElement(child)),
        },
    };
};
const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

const NoLanes = /*                        */ 0b0000000000000000000000000000000;
const SyncLane = /*                        */ 0b0000000000000000000000000000010;
const FunctionComponent = 0;
const IndeterminateComponent = 2;
const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
const HostComponent = 5;
const HostText = 6;
const NoMode = /*                         */ 0b0000000;
// Don't change these values. They're used by React Dev Tools.
const NoFlags = /*                      */ 0b0000000000000000000000000000;
const Placement = /*                    */ 0b0000000000000000000000000010;
const ContentReset = /*                 */ 0b0000000000000000000000100000;
// Static tags describe aspects of a fiber that are not specific to a render,
// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
// This enables us to defer more work in the unmount case,
// since we can defer traversing the tree during layout to look for Passive effects,
// and instead rely on the static flag as a signal that there may be cleanup work.
const RefStatic = /*                    */ 0b0000001000000000000000000000;
const LayoutStatic = /*                 */ 0b0000010000000000000000000000;
const PassiveStatic = /*                */ 0b0000100000000000000000000000;
const MaySuspendCommit = /*             */ 0b0001000000000000000000000000;
const StaticMask = LayoutStatic | PassiveStatic | RefStatic | MaySuspendCommit;
const REACT_ELEMENT_TYPE = Symbol.for('react.element');

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
        lanes: NoLanes,
        childLanes: NoLanes,
        // pendingProps - defined at the bottom as dynamic properties
        memoizedProps: null,
        updateQueue: null,
        memoizedState: null,
        // dependencies: null,
        // Effects
        flags: NoFlags,
        subtreeFlags: NoFlags,
        deletions: null,
        alternate: null,
    };
    return fiber;
}
const createFiber = createFiberImplObject;

function createHostRootFiber() {
    return createFiber(HostRoot, null, null, NoMode);
}
class FiberRootNode {
    constructor(containerInfo) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}
function createFiberRoot(containerInfo) {
    const fiberRoot = new FiberRootNode(containerInfo);
    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber();
    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = fiberRoot;
    return fiberRoot;
}

// This is used to create an alternate fiber to do work on.
function createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate;
    if (workInProgress === null) {
        // We use a double buffering pooling technique because we know that we'll
        // only ever need at most two versions of a tree. We pool the "other" unused
        // node that we're free to reuse. This is lazily created to avoid allocating
        // extra objects for things that are never updated. It also allow us to
        // reclaim the extra memory if needed.
        workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
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
        workInProgress.flags = NoFlags;
        // The effects are no longer valid.
        workInProgress.subtreeFlags = NoFlags;
        workInProgress.deletions = null;
    }
    // Reset all effects except static ones.
    // Static effects are not specific to a render.
    workInProgress.flags = current.flags & StaticMask;
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
    let fiberTag = IndeterminateComponent;
    // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
    let resolvedType = type;
    if (typeof type === 'function') {
        fiberTag = FunctionComponent;
    }
    else if (typeof type === 'string') {
        fiberTag = HostComponent;
    }
    const fiber = createFiber(fiberTag, pendingProps, key, mode);
    fiber.elementType = type;
    fiber.type = resolvedType;
    return fiber;
}

function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    element.key;
    // while (child !== null) {
    //     // TODO: If key === null and child.key === null, then this only applies to
    //     // the first item in the list.
    //     if (child.key === key) {
    //         const elementType = element.type;
    //         if (elementType === REACT_FRAGMENT_TYPE) {
    //             if (child.tag === Fragment) {
    //                 deleteRemainingChildren(returnFiber, child.sibling);
    //                 const existing = useFiber(child, element.props.children);
    //                 existing.return = returnFiber;
    //                 if (__DEV__) {
    //                     existing._debugSource = element._source;
    //                     existing._debugOwner = element._owner;
    //                 }
    //                 return existing;
    //             }
    //         } else {
    //             if (
    //                 child.elementType === elementType ||
    //                 // Keep this check inline so it only runs on the false path:
    //                 (__DEV__
    //                     ? isCompatibleFamilyForHotReloading(child, element)
    //                     : false) ||
    //                 // Lazy types should reconcile their resolved type.
    //                 // We need to do this after the Hot Reloading check above,
    //                 // because hot reloading has different semantics than prod because
    //                 // it doesn't resuspend. So we can't let the call below suspend.
    //                 (typeof elementType === 'object' &&
    //                     elementType !== null &&
    //                     elementType.$$typeof === REACT_LAZY_TYPE &&
    //                     resolveLazy(elementType) === child.type)
    //             ) {
    //                 deleteRemainingChildren(returnFiber, child.sibling);
    //                 const existing = useFiber(child, element.props);
    //                 existing.ref = coerceRef(returnFiber, child, element);
    //                 existing.return = returnFiber;
    //                 if (__DEV__) {
    //                     existing._debugSource = element._source;
    //                     existing._debugOwner = element._owner;
    //                 }
    //                 return existing;
    //             }
    //         }
    //         // Didn't match.
    //         deleteRemainingChildren(returnFiber, child);
    //         break;
    //     } else {
    //         deleteChild(returnFiber, child);
    //     }
    //     child = child.sibling;
    // }
    const created = createFiberFromElement(element, returnFiber.mode);
    created.return = returnFiber;
    return created;
}
function placeSingleChild(newFiber) {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (newFiber.alternate === null) {
        newFiber.flags |= Placement;
    }
    return newFiber;
}

function shouldSetTextContent(type, props) {
    return (typeof props.children === 'string' || typeof props.children === 'number');
}

function beginWork(current, workInProgress) {
    if (current !== null) {
        const oldProps = current.memoizedProps;
        const newProps = workInProgress.pendingProps;
        if (oldProps !== newProps) ;
        else {
            if (current.flags !== NoFlags) ;
        }
    }
    switch (workInProgress.tag) {
        // case IndeterminateComponent: {
        //     return mountIndeterminateComponent(
        //         current,
        //         workInProgress,
        //         workInProgress.type,
        //         renderLanes,
        //     );
        // }
        // case LazyComponent: {
        //     const elementType = workInProgress.elementType;
        //     return mountLazyComponent(
        //         current,
        //         workInProgress,
        //         elementType,
        //         renderLanes,
        //     );
        // }
        // case FunctionComponent: {
        //     const Component = workInProgress.type;
        //     const unresolvedProps = workInProgress.pendingProps;
        //     const resolvedProps =
        //         workInProgress.elementType === Component
        //             ? unresolvedProps
        //             : resolveDefaultProps(Component, unresolvedProps);
        //     return updateFunctionComponent(
        //         current,
        //         workInProgress,
        //         Component,
        //         resolvedProps,
        //         renderLanes,
        //     );
        // }
        // case ClassComponent: {
        //     const Component = workInProgress.type;
        //     const unresolvedProps = workInProgress.pendingProps;
        //     const resolvedProps =
        //         workInProgress.elementType === Component
        //             ? unresolvedProps
        //             : resolveDefaultProps(Component, unresolvedProps);
        //     return updateClassComponent(
        //         current,
        //         workInProgress,
        //         Component,
        //         resolvedProps,
        //         renderLanes,
        //     );
        // }
        case HostRoot:
            return updateHostRoot(current, workInProgress);
        // case HostHoistable:
        //     if (enableFloat && supportsResources) {
        //         return updateHostHoistable(
        //             current,
        //             workInProgress,
        //             renderLanes,
        //         );
        //     }
        // // Fall through
        // case HostSingleton:
        //     if (enableHostSingletons && supportsSingletons) {
        //         return updateHostSingleton(
        //             current,
        //             workInProgress,
        //             renderLanes,
        //         );
        //     }
        // // Fall through
        case HostComponent:
            return updateHostComponent(current, workInProgress);
        // case HostText:
        //     return updateHostText(current, workInProgress);
        // case SuspenseComponent:
        //     return updateSuspenseComponent(
        //         current,
        //         workInProgress,
        //         renderLanes,
        //     );
        // case HostPortal:
        //     return updatePortalComponent(current, workInProgress, renderLanes);
        // case ForwardRef: {
        //     const type = workInProgress.type;
        //     const unresolvedProps = workInProgress.pendingProps;
        //     const resolvedProps =
        //         workInProgress.elementType === type
        //             ? unresolvedProps
        //             : resolveDefaultProps(type, unresolvedProps);
        //     return updateForwardRef(
        //         current,
        //         workInProgress,
        //         type,
        //         resolvedProps,
        //         renderLanes,
        //     );
        // }
        // case Fragment:
        //     return updateFragment(current, workInProgress, renderLanes);
        // case Mode:
        //     return updateMode(current, workInProgress, renderLanes);
        // case Profiler:
        //     return updateProfiler(current, workInProgress, renderLanes);
        // case ContextProvider:
        //     return updateContextProvider(current, workInProgress, renderLanes);
        // case ContextConsumer:
        //     return updateContextConsumer(current, workInProgress, renderLanes);
        // case MemoComponent: {
        //     const type = workInProgress.type;
        //     const unresolvedProps = workInProgress.pendingProps;
        //     // Resolve outer props first, then resolve inner props.
        //     let resolvedProps = resolveDefaultProps(type, unresolvedProps);
        //     if (__DEV__) {
        //         if (workInProgress.type !== workInProgress.elementType) {
        //             const outerPropTypes = type.propTypes;
        //             if (outerPropTypes) {
        //                 checkPropTypes(
        //                     outerPropTypes,
        //                     resolvedProps, // Resolved for outer only
        //                     'prop',
        //                     getComponentNameFromType(type),
        //                 );
        //             }
        //         }
        //     }
        //     resolvedProps = resolveDefaultProps(type.type, resolvedProps);
        //     return updateMemoComponent(
        //         current,
        //         workInProgress,
        //         type,
        //         resolvedProps,
        //         renderLanes,
        //     );
        // }
        // case SimpleMemoComponent: {
        //     return updateSimpleMemoComponent(
        //         current,
        //         workInProgress,
        //         workInProgress.type,
        //         workInProgress.pendingProps,
        //         renderLanes,
        //     );
        // }
        // case IncompleteClassComponent: {
        //     const Component = workInProgress.type;
        //     const unresolvedProps = workInProgress.pendingProps;
        //     const resolvedProps =
        //         workInProgress.elementType === Component
        //             ? unresolvedProps
        //             : resolveDefaultProps(Component, unresolvedProps);
        //     return mountIncompleteClassComponent(
        //         current,
        //         workInProgress,
        //         Component,
        //         resolvedProps,
        //         renderLanes,
        //     );
        // }
        // case SuspenseListComponent: {
        //     return updateSuspenseListComponent(
        //         current,
        //         workInProgress,
        //         renderLanes,
        //     );
        // }
        // case ScopeComponent: {
        //     if (enableScopeAPI) {
        //         return updateScopeComponent(
        //             current,
        //             workInProgress,
        //             renderLanes,
        //         );
        //     }
        //     break;
        // }
        // case OffscreenComponent: {
        //     return updateOffscreenComponent(
        //         current,
        //         workInProgress,
        //         renderLanes,
        //     );
        // }
        // case LegacyHiddenComponent: {
        //     if (enableLegacyHidden) {
        //         return updateLegacyHiddenComponent(
        //             current,
        //             workInProgress,
        //             renderLanes,
        //         );
        //     }
        //     break;
        // }
        // case CacheComponent: {
        //     if (enableCache) {
        //         return updateCacheComponent(
        //             current,
        //             workInProgress,
        //             renderLanes,
        //         );
        //     }
        //     break;
        // }
        // case TracingMarkerComponent: {
        //     if (enableTransitionTracing) {
        //         return updateTracingMarkerComponent(
        //             current,
        //             workInProgress,
        //             renderLanes,
        //         );
        //     }
        //     break;
        // }
    }
}
function updateHostRoot(current, workInProgress) {
    // pushHostRootContext(workInProgress);
    workInProgress.pendingProps;
    const prevState = workInProgress.memoizedState;
    prevState.element;
    // cloneUpdateQueue(current, workInProgress);
    // processUpdateQueue(workInProgress, nextProps, null, renderLanes);
    const nextState = workInProgress.memoizedState;
    workInProgress.stateNode;
    const nextChildren = nextState.element;
    // pushRootTransition(workInProgress, root, renderLanes);
    // if (nextChildren === prevChildren) {
    //     return bailoutOnAlreadyFinishedWork(
    //         current,
    //         workInProgress,
    //         renderLanes,
    //     );
    // }
    reconcileChildren(current, workInProgress, nextChildren);
    return workInProgress.child;
}
function updateHostComponent(current, workInProgress) {
    const type = workInProgress.type;
    const nextProps = workInProgress.pendingProps;
    const prevProps = current !== null ? current.memoizedProps : null;
    let nextChildren = nextProps.children;
    const isDirectTextChild = shouldSetTextContent(type, nextProps);
    if (isDirectTextChild) {
        // We special case a direct text child of a host node. This is a common
        // case. We won't handle it as a reified child. We will instead handle
        // this in the host environment that also has access to this prop. That
        // avoids allocating another HostText fiber and traversing it.
        nextChildren = null;
    }
    else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
        // If we're switching from a direct text child to a normal child, or to
        // empty, we need to schedule the text content to be reset.
        workInProgress.flags |= ContentReset;
    }
    // markRef(current, workInProgress);
    reconcileChildren(current, workInProgress, nextChildren);
    return workInProgress.child;
}
function reconcileChildren(current, workInProgress, nextChildren) {
    if (current === null) ;
    else {
        // If the current child is the same as the work in progress, it means that
        // we haven't yet started any work on these children. Therefore, we use
        // the clone algorithm to create a copy of all the current children.
        // If we had any progressed work already, that is invalid at this point so
        // let's throw it out.
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
    }
}
// Actually its reconcileChildFibersImpl
function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.
    // Handle object types
    if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
                return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild));
        }
        // if (Array.isArray(newChild)) {
        //     return reconcileChildrenArray(
        //         returnFiber,
        //         currentFirstChild,
        //         newChild,
        //         lanes,
        //     );
        // }
        //
        // if (getIteratorFn(newChild)) {
        //     return reconcileChildrenIterator(
        //         returnFiber,
        //         currentFirstChild,
        //         newChild,
        //         lanes,
        //     );
        // }
    }
    // if (
    //     (typeof newChild === 'string' && newChild !== '') ||
    //     typeof newChild === 'number'
    // ) {
    //     return placeSingleChild(
    //         reconcileSingleTextNode(
    //             returnFiber,
    //             currentFirstChild,
    //             '' + newChild,
    //             lanes,
    //         ),
    //     );
    // }
    //
    // // Remaining cases are all treated as empty.
    // return deleteRemainingChildren(returnFiber, currentFirstChild);
}

function completeWork(current, workInProgress) {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case FunctionComponent:
            // bubbleProperties(workInProgress);
            return null;
        case HostRoot: {
            // bubbleProperties(workInProgress);
            return null;
        }
        case HostComponent: {
            var type = workInProgress.type;
            if (current !== null && workInProgress.stateNode != null) ;
            else {
                // if (!newProps) {
                //     if (workInProgress.stateNode === null) {
                //         throw new Error(
                //             'We must have new props for new mounts. This error is likely ' +
                //                 'caused by a bug in React. Please file an issue.',
                //         );
                //     } // This can happen when we abort work.
                //
                //     bubbleProperties(workInProgress);
                //     return null;
                // }
                //
                // var currentHostContext = getHostContext(); // TODO: Move createInstance to beginWork and keep it on a context
                // // "stack" as the parent. Then append children as we go in beginWork
                // // or completeWork depending on whether we want to add them top->down or
                // // bottom->up. Top->down is faster in IE11.
                //
                // var _wasHydrated = popHydrationState(workInProgress);
                var instance = createInstance(type, newProps);
                appendAllChildren(instance, workInProgress);
                workInProgress.stateNode = instance;
            }
            // bubbleProperties(workInProgress);
            return null;
        }
    }
}
function createInstance(type, props) {
    var domElement = document.createElement(type, props);
    // precacheFiberNode(internalInstanceHandle, domElement);
    // updateFiberProps(domElement, props);
    return domElement;
}
function appendAllChildren(parent, workInProgress, needsVisibilityToggle, isHidden) {
    let node = workInProgress.child;
    while (node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) ;
        else if (node.child !== null) {
            node.child.return = node;
            node = node.child;
            continue;
        }
        if (node === workInProgress) {
            return;
        }
        while (node.sibling === null) {
            if (node.return === null || node.return === workInProgress) {
                return;
            }
            node = node.return;
        }
        node.sibling.return = node.return;
        node = node.sibling;
    }
}

const RootInProgress = 0;
const RootCompleted = 5;
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
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;
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
    do {
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
    next = beginWork(current, unitOfWork);
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
    const rootWorkInProgress = createWorkInProgress(root.current, null);
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
        next = completeWork(current, completedWork);
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

let lastScheduledRoot = null;
function ensureRootIsScheduled(root) {
    // This function is called whenever a root receives an update. It does two
    // things 1) it ensures the root is in the root schedule, and 2) it ensures
    // there's a pending microtask to process the root schedule.
    //
    // Most of the actual scheduling logic does not happen until
    // `scheduleTaskForRootDuringMicrotask` runs.
    // Add the root to the schedule
    if (root === lastScheduledRoot || root.next !== null) ;
    else {
        if (lastScheduledRoot === null) {
            lastScheduledRoot = root;
        }
        else {
            lastScheduledRoot.next = root;
            lastScheduledRoot = root;
        }
    }
    queueMicrotask(() => {
        performConcurrentWorkOnRoot(root);
    });
    // scheduleImmediateTask(processRootScheduleInMicrotask);
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
    {
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
        ensureRootIsScheduled(root);
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

function getRootForUpdatedFiber(sourceFiber) {
    let node = sourceFiber;
    let parent = node.return;
    while (parent !== null) {
        node = parent;
        parent = node.return;
    }
    return node.tag === HostRoot ? node.stateNode : null;
}
// ReactFiberClassUpdateQueue.js
function enqueueUpdate(fiber, update, lane) {
    const updateQueue = fiber.updateQueue;
    if (updateQueue === null) {
        // Only occurs if the fiber has been unmounted.
        return null;
    }
    updateQueue.shared;
    return enqueueConcurrentClassUpdate(fiber);
}
function enqueueConcurrentClassUpdate(fiber, queue, update, lane) {
    return getRootForUpdatedFiber(fiber);
}
function updateContainerImpl(rootFiber, lane, element, container, parentComponent, callback) {
    const root = enqueueUpdate(rootFiber);
    if (root !== null) {
        scheduleUpdateOnFiber(root);
        // entangleTransitions(root, rootFiber, lane);
    }
}
function updateContainer(element, container, parentComponent, callback) {
    const current = container.current;
    const lane = SyncLane; // Результат вызова requestUpdateLane(current)
    updateContainerImpl(current);
    return lane;
}

class ReactDOMRoot {
    constructor(internalRoot) {
        this._internalRoot = internalRoot;
    }
    render(children) {
        const root = this._internalRoot;
        updateContainer(children, root);
    }
    unmount() { }
}

function createRoot(container) {
    const root = createFiberRoot(container);
    return new ReactDOMRoot(root);
}

//
// function render(element, container) {
//     wipRoot = {
//         dom: container,
//         props: {
//             children: [element],
//         },
//         alternate: currentRoot,
//     };
//
//     deletions = [];
//
//     nextUnitOfWork = wipRoot;
// }
//
// function workLoop(deadline) {
//     while (nextUnitOfWork) {
//         nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
//
//         // if (deadline.timeRemaining() < 1) break;
//     }
//
//     if (!nextUnitOfWork && wipRoot) {
//         commitRoot();
//     }
//
//     window.requestIdleCallback(workLoop);
// }
// window.requestIdleCallback(workLoop);
//
// let wipFiber: any = null;
// let hookIndex: any = null;
//
// function updateFunctionComponent(fiber) {
//     wipFiber = fiber;
//     hookIndex = 0;
//
//     wipFiber.hooks = [];
//
//     const componentFunction = fiber.type;
//
//     fiber.props.children = [componentFunction(fiber.props)];
//
//     reconcileChildren(fiber);
// }
//
// function useState(initial) {
//     const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];
//
//     const hook = {
//         state: oldHook ? oldHook.newValue || oldHook.state : initial,
//         newValue: undefined,
//     };
//
//     const setState = (newValue) => {
//         hook.newValue = newValue;
//
//         wipRoot = {
//             dom: currentRoot.dom,
//             props: currentRoot.props,
//             alternate: currentRoot,
//         };
//
//         nextUnitOfWork = wipRoot;
//         deletions = [];
//     };
//
//     wipFiber.hooks.push(hook);
//     hookIndex++;
//
//     return [hook.state, setState];
// }
//
// function updateHostComponent(fiber) {
//     if (!fiber.dom) {
//         fiber.dom = createDom(fiber);
//     }
//
//     reconcileChildren(fiber);
// }
//
// function performUnitOfWork(fiber) {
//     console.log('FIBER', fiber.type);
//     const isFunctionComponent = fiber.type instanceof Function;
//
//     // console.log(fiber);
//
//     if (isFunctionComponent) {
//         updateFunctionComponent(fiber);
//     } else {
//         updateHostComponent(fiber);
//     }
//
//     if (fiber.child) {
//         return fiber.child;
//     }
//
//     let nextFiber = fiber;
//
//     while (nextFiber) {
//         if (nextFiber.sibling) {
//             return nextFiber.sibling;
//         }
//
//         nextFiber = nextFiber.parent;
//     }
//
//     return null;
// }
//
// function flatten(value) {
//     const res = [];
//     const copy = value.slice();
//
//     while (copy.length) {
//         const item = copy.shift();
//         if (Array.isArray(item)) {
//             copy.unshift(...item);
//         } else {
//             res.push(item as never);
//         }
//     }
//
//     return res;
// }
//
// // https://github.com/facebook/react/blob/f603426f917314561c4289734f39b972be3814af/packages/react-reconciler/src/ReactFiberBeginWork.js#L340
// function reconcileChildren(wipFiber) {
//     let elements = flatten(wipFiber.props.children);
//
//     let index = 0;
//     let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
//     let prevSibling: any = null;
//
//     while (index < elements.length || oldFiber) {
//         const element: any = elements[index];
//
//         let newFiber: any = null;
//
//         const sameType = oldFiber && element && element.type == oldFiber.type;
//
//         if (sameType) {
//             newFiber = {
//                 type: oldFiber.type,
//                 props: element.props,
//                 dom: oldFiber.dom,
//                 parent: wipFiber,
//                 alternate: oldFiber,
//                 effectTag: 'UPDATE',
//             };
//         }
//
//         if (element && !sameType) {
//             newFiber = {
//                 type: element.type,
//                 props: element.props,
//                 dom: null,
//                 parent: wipFiber,
//                 alternate: null,
//                 effectTag: 'PLACEMENT',
//             };
//         }
//
//         if (oldFiber && !sameType) {
//             oldFiber.effectTag = 'DELETION';
//             deletions.push(oldFiber);
//         }
//
//         if (oldFiber) {
//             oldFiber = oldFiber.sibling;
//         }
//
//         if (index === 0) {
//             wipFiber.child = newFiber;
//         } else if (element) {
//             prevSibling.sibling = newFiber;
//         }
//
//         prevSibling = newFiber;
//         index++;
//     }
// }
//
// function commitRoot() {
//     // console.log('start', performance.now());
//
//     deletions.forEach(commitWork);
//
//     commitWork(wipRoot.child);
//     currentRoot = wipRoot;
//     wipRoot = null;
//
//     // console.log('end', performance.now());
// }
//
// function commitWork(fiber) {
//     if (!fiber) {
//         return;
//     }
//
//     let domParentFiber = fiber.parent;
//
//     while (!domParentFiber.dom) {
//         domParentFiber = domParentFiber.parent;
//     }
//     const domParent = domParentFiber.dom;
//
//     if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
//         domParent.appendChild(fiber.dom);
//     } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
//         updateDom(fiber.dom, fiber.alternate.props, fiber.props);
//     } else if (fiber.effectTag === 'DELETION') {
//         commitDeletion(fiber, domParent);
//     }
//
//     commitWork(fiber.child);
//     commitWork(fiber.sibling);
// }
//
// function commitDeletion(fiber, domParent) {
//     if (fiber.dom) {
//         domParent.removeChild(fiber.dom);
//     } else {
//         commitDeletion(fiber.child, domParent);
//     }
// }
var index = { createRoot, createTextElement, createElement };

module.exports = index;
//# sourceMappingURL=index.js.map
