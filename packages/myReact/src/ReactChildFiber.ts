import { Fiber, ReactElement, Placement } from './types';
import { createFiberFromElement } from './ReactFiber';

export function reconcileSingleElement(
    returnFiber: Fiber | any,
    currentFirstChild: Fiber | null | any,
    element: ReactElement,
): Fiber {
    const key = element.key;
    let child = currentFirstChild;

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

    const created = createFiberFromElement(element, returnFiber.mode!);

    created.return = returnFiber;

    return created;
}

export function placeSingleChild(newFiber: Fiber): Fiber {
    // This is simpler for the single child case. We only need to do a
    // placement for inserting new children.
    if (newFiber.alternate === null) {
        newFiber.flags |= Placement;
    }
    return newFiber;
}