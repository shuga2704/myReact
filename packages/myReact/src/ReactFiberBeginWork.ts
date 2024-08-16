import {
    Fiber,
    Lanes,
    HostRoot,
    RootState,
    FiberRoot,
    REACT_ELEMENT_TYPE,
    REACT_FRAGMENT_TYPE,
    NoFlags,
    HostComponent,
    ContentReset,
} from './types';
import { reconcileSingleElement, placeSingleChild } from './ReactChildFiber';
import { shouldSetTextContent } from './utils';

let didReceiveUpdate: boolean = false;

export function beginWork(
    current: Fiber | null | any,
    workInProgress: Fiber | any,
): Fiber | null | any {
    if (current !== null) {
        const oldProps = current.memoizedProps;
        const newProps = workInProgress.pendingProps;

        if (oldProps !== newProps) {
            // If props or context changed, mark the fiber as having performed work.
            // This may be unset if the props are determined to be equal later (memo).
            didReceiveUpdate = true;
        } else {
            if (current.flags !== NoFlags) {
                // This is a special case that only exists for legacy mode.
                // See https://github.com/facebook/react/pull/19216.
                didReceiveUpdate = true;
            } else {
                // An update was scheduled on this fiber, but there are no new props
                // nor legacy context. Set this to false. If an update queue or context
                // consumer produces a changed value, it will set this to true. Otherwise,
                // the component will assume the children have not changed and bail out.
                didReceiveUpdate = false;
            }
        }
    } else {
        didReceiveUpdate = false;
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

function updateHostRoot(
    current: null | Fiber | any,
    workInProgress: Fiber | any,
) {
    // pushHostRootContext(workInProgress);

    // const nextProps = workInProgress.pendingProps;
    // const prevState = workInProgress.memoizedState;
    // const prevChildren = prevState.element;

    // cloneUpdateQueue(current, workInProgress);
    // processUpdateQueue(workInProgress, nextProps, null, renderLanes);

    const nextState: RootState = workInProgress.memoizedState;
    const root: FiberRoot = workInProgress.stateNode;

    const nextChildren = nextState.element;

    // pushRootTransition(workInProgress, root, renderLanes);

    reconcileChildren(current, workInProgress, nextChildren);

    return workInProgress.child;
}

function updateHostComponent(
    current: Fiber | null | any,
    workInProgress: Fiber | any,
) {
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
    } else if (prevProps !== null && shouldSetTextContent(type, prevProps)) {
        // If we're switching from a direct text child to a normal child, or to
        // empty, we need to schedule the text content to be reset.
        workInProgress.flags |= ContentReset;
    }

    // markRef(current, workInProgress);

    reconcileChildren(current, workInProgress, nextChildren);

    return workInProgress.child;
}

export function reconcileChildren(
    current: Fiber | null,
    workInProgress: Fiber,
    nextChildren: any,
) {
    if (current === null) {
        // // If this is a fresh new component that hasn't been rendered yet, we
        // // won't update its child set by applying minimal side-effects. Instead,
        // // we will add them all to the child before it gets rendered. That means
        // // we can optimize this reconciliation pass by not tracking side-effects.
        // workInProgress.child = mountChildFibers(
        //     workInProgress,
        //     null,
        //     nextChildren,
        // );
    } else {
        // If the current child is the same as the work in progress, it means that
        // we haven't yet started any work on these children. Therefore, we use
        // the clone algorithm to create a copy of all the current children.

        // If we had any progressed work already, that is invalid at this point so
        // let's throw it out.
        workInProgress.child = reconcileChildFibers(
            workInProgress,
            current.child,
            nextChildren,
        );
    }
}

// Actually its reconcileChildFibersImpl
function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
): Fiber | null | any {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle object types
    if (typeof newChild === 'object' && newChild !== null) {
        return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild),
        );

        // switch (newChild.type) {
        //     case REACT_ELEMENT_TYPE:
        //         return placeSingleChild(
        //             reconcileSingleElement(
        //                 returnFiber,
        //                 currentFirstChild,
        //                 newChild,
        //             ),
        //         );
        // }

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
