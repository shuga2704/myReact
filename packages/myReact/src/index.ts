import { createElement, createTextElement } from './createUtils';

import {
    Fiber,
    FiberRoot,
    FunctionComponent,
    HostComponent,
    HostRoot,
    HostText,
    IndeterminateComponent,
    Placement,
    ReactElement,
    ReactNodeList,
    RootType,
    WorkTag,
    Update,
} from './types';

let fiberRootNode: FiberRoot | null = null;
let workInProgress: any = null;
let workInProgressHookIndex: any = null;

class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;

    constructor(containerInfo: Element | Document | DocumentFragment) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}

class ReactDOMRoot {
    _internalRoot: FiberRoot;

    constructor(internalRoot: FiberRoot) {
        this._internalRoot = internalRoot;
    }

    render(children: ReactNodeList): void {
        fiberRootNode = this._internalRoot;

        fiberRootNode.current.props = {
            children: [children],
        };

        scheduleUpdateOnFiber();
    }
}

function scheduleUpdateOnFiber() {
    performConcurrentWorkOnRoot();
}

function performConcurrentWorkOnRoot() {
    renderRootSync();

    const finishedWork: Fiber | any = fiberRootNode!.current.alternate;

    fiberRootNode!.finishedWork = finishedWork;
    finishedWork.return = fiberRootNode;

    commitRoot();

    fiberRootNode!.current = finishedWork;
    fiberRootNode!.finishedWork = null;
    workInProgress = null;
}

function renderRootSync() {
    prepareFreshStack();

    workLoopSync();

    // do {
    //     try {
    //         workLoopSync();
    //
    //         break;
    //     } catch (thrownValue) {}
    // } while (true);
}

function prepareFreshStack() {
    workInProgress = createWorkInProgress(fiberRootNode!.current);
}

function workLoopSync() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

export function createFiberRoot(
    containerInfo: Element | Document | DocumentFragment,
) {
    const fiberRoot = new FiberRootNode(containerInfo);

    const uninitializedFiber = createFiber(HostRoot, null);

    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = containerInfo;

    return fiberRoot;
}

function createRoot(
    container: Element | Document | DocumentFragment,
): RootType {
    const root = createFiberRoot(container);

    return new ReactDOMRoot(root as any);
}

// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current: Fiber): Fiber {
    let workInProgress = current.alternate!;

    if (workInProgress === null) {
        workInProgress = createFiber(current.tag, null);

        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;

        workInProgress.alternate = current;
        current.alternate = workInProgress;
    }

    workInProgress.child = null;
    workInProgress.sibling = null;
    workInProgress.return = null;
    workInProgress.props = current.props;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.memoizedState = current.memoizedState;

    return workInProgress;
}

function createFiber(tag: WorkTag, props: any): Fiber {
    const fiber: Fiber = {
        tag,

        elementType: null,
        type: null,
        stateNode: null,

        // Fiber
        return: null,
        child: null,
        sibling: null,

        updateQueue: null,
        props: props,

        memoizedState: null,

        // Effects
        flags: 0,
        deletions: null,

        alternate: null,
    };

    return fiber;
}

function createFiberFromElement(element: ReactElement): Fiber {
    const type = element.type;
    const props = element.props;

    let fiberTag: WorkTag = IndeterminateComponent;

    // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
    let resolvedType = type;

    if (typeof type === 'function') {
        fiberTag = FunctionComponent;
    } else if (type === 'TEXT_ELEMENT') {
        fiberTag = HostText;
    } else if (typeof type === 'string') {
        fiberTag = HostComponent;
    }

    const fiber = createFiber(fiberTag, props);

    fiber.elementType = type;
    fiber.type = resolvedType;

    return fiber;
}

function createInstance(fiber: Fiber) {
    const { type, props } = fiber;

    const domElement =
        type == 'TEXT_ELEMENT'
            ? document.createTextNode(props.nodeValue)
            : document.createElement(type);

    fiber.stateNode = domElement;

    updateFiberProps(fiber);

    return domElement;
}

const isEvent = (key: any) => key.startsWith('on');
const isProperty = (key: any) => key !== 'children' && !isEvent(key);
const isNew = (prev: any, next: any) => (key: any) => prev[key] !== next[key];
const isGone = (prev: any, next: any) => (key: any) => !(key in next);

function updateFiberProps(fiber: Fiber) {
    const dom = fiber.stateNode;
    const prevProps = fiber.alternate?.props || {};
    const nextProps = fiber.props || {};

    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(
            (key) => !(key in nextProps) || isNew(prevProps, nextProps)(key),
        )
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.removeEventListener(eventType, prevProps[name]);
        });

    // Remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = '';
        });

    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            dom[name] = nextProps[name];
        });

    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach((name) => {
            const eventType = name.toLowerCase().substring(2);
            dom.addEventListener(eventType, nextProps[name]);
        });
}

function performUnitOfWork(unitOfWork: Fiber): void {
    const current = unitOfWork.alternate;

    let next;

    next = beginWork(current, unitOfWork);

    if (next === null) {
        completeUnitOfWork(unitOfWork);
    } else {
        workInProgress = next;
    }
}

function beginWork(
    current: Fiber | null,
    workInProgress: Fiber,
): Fiber | null | any {
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress);

        case FunctionComponent:
            return updateFunctionalComponent(current, workInProgress);

        case HostComponent:
            return updateHostComponent(current, workInProgress);

        case HostText:
            return updateHostText();
    }
}

function completeUnitOfWork(unitOfWork: Fiber): void {
    // Attempt to complete the current unit of work, then move to the next
    // sibling. If there are no more siblings, return to the parent fiber.
    let completedWork: Fiber = unitOfWork;

    do {
        // The current, flushed, state of this fiber is the alternate. Ideally
        // nothing should rely on this, but relying on it here means that we don't
        // need an additional field on the work in progress.
        const current = completedWork.alternate;
        const returnFiber = completedWork.return;
        // debugger;
        completeWork(completedWork);

        const siblingFiber = completedWork.sibling;

        if (siblingFiber !== null) {
            // If there is more work to do in this returnFiber, do that next.
            workInProgress = siblingFiber;

            return;
        }

        completedWork = returnFiber as any;

        // Update the next thing we're working on in case something throws.
        workInProgress = completedWork;
    } while (completedWork !== null);
}

export function completeWork(workInProgress: Fiber) {
    if (workInProgress.flags === Placement) {
        switch (workInProgress.tag) {
            case HostComponent: {
                createInstance(workInProgress);
                break;
            }
            case HostText: {
                createInstance(workInProgress);
                break;
            }
        }
    }

    return null;
}

function updateHostRoot(current: Fiber | null, workInProgress: Fiber) {
    const nextChildren = workInProgress.props.children;

    reconcileChildren(workInProgress, nextChildren);

    return workInProgress.child;
}

function updateFunctionalComponent(
    current: Fiber | null,
    workInProgress: Fiber,
) {
    workInProgress.memoizedState = current?.memoizedState || null;

    workInProgressHookIndex = 0;

    const funcResult = workInProgress.type(workInProgress.props);

    workInProgressHookIndex = 0;

    workInProgress.props.children = funcResult;

    const nextChildren = [workInProgress.props.children];

    reconcileChildren(workInProgress, nextChildren);

    return workInProgress.child;
}

function updateHostComponent(current: Fiber | null, workInProgress: Fiber) {
    const nextChildren = workInProgress.props.children;

    if (nextChildren.length === 0) return null;

    reconcileChildren(workInProgress, nextChildren);

    return workInProgress.child;
}

function updateHostText() {
    return null;
}

function reconcileChildren(
    returnFiber: Fiber,
    newChild: any,
): Fiber | null | any {
    // This function is not recursive.
    // If the top level item is an array, we treat it as a set of children,
    // not as a fragment. Nested arrays on the other hand will be treated as
    // fragment nodes. Recursion happens at the normal flow.

    // Handle object types
    if (typeof newChild === 'object' && newChild !== null) {
        if (Array.isArray(newChild) && newChild.length > 1) {
            return reconcileChildrenArray(returnFiber, newChild);
        }

        reconcileSingleElement(returnFiber, newChild[0]);
    }

    // // Remaining cases are all treated as empty.
    // return deleteRemainingChildren(returnFiber, currentFirstChild);
}

export function reconcileSingleElement(
    returnFiber: Fiber,
    element: any,
): Fiber {
    const created = createFiberFromElement(element);

    // Проверяем одинаков ли тип у файберов
    if (
        returnFiber.alternate?.child &&
        returnFiber.alternate?.child.type === created.type
    ) {
        created.alternate = returnFiber.alternate.child;
        returnFiber.alternate.child.alternate = created;

        created.flags = Update;
        created.stateNode = returnFiber.alternate.child.stateNode;
    } else {
        created.flags = Placement;
    }

    created.return = returnFiber;
    returnFiber.child = created;
    return created;
}

function reconcileChildrenArray(returnFiber: Fiber, elementsArr: any) {
    let index = 0;
    let firstChild = null;
    let prevFiber = null;

    let currentAlternateFiber: Fiber | null =
        returnFiber.alternate?.child || null;

    while (index < elementsArr.length) {
        const created = createFiberFromElement(elementsArr[index]);

        if (
            currentAlternateFiber &&
            currentAlternateFiber?.type === created.type
        ) {
            created.alternate = currentAlternateFiber;
            currentAlternateFiber.alternate = created;

            created.flags = Update;
            created.stateNode = currentAlternateFiber?.stateNode;
        } else {
            created.flags = Placement;
        }

        created.return = returnFiber;

        if (index === 0) {
            returnFiber.child = created;
            firstChild = created;
        }

        if (index !== 0) {
            prevFiber!.sibling = created;
        }

        prevFiber = created;
        index++;

        if (currentAlternateFiber) {
            currentAlternateFiber = currentAlternateFiber.sibling;
        }
    }

    return firstChild;
}

function commitRoot() {
    const finishedWork = fiberRootNode!.finishedWork;

    commitWork(finishedWork.child);
}

function commitWork(fiber: Fiber | null | any) {
    if (!fiber) {
        return;
    }

    let returnFiber = fiber.return;

    while (!returnFiber?.stateNode) {
        returnFiber = returnFiber?.return || null;
    }

    const returnFiberStateNode = returnFiber.stateNode;

    if (fiber.stateNode) {
        if (fiber.flags === Update) {
            updateFiberProps(fiber);
        } else {
            returnFiberStateNode.appendChild(fiber.stateNode);
        }
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function useState(initialValue: string | number) {
    if (workInProgress.memoizedState === null) {
        workInProgress.memoizedState = [];
    }

    if (workInProgress.memoizedState[workInProgressHookIndex]) {
        const hook = workInProgress.memoizedState[workInProgressHookIndex];

        hook.queue.forEach((action: any) => {
            if (typeof action === 'function') {
                hook!.state = action(hook!.state);
            } else {
                hook!.state = action;
            }
        });

        hook.queue = [];
    } else {
        workInProgress.memoizedState[workInProgressHookIndex] = {
            state: initialValue,
            queue: [],
        };
    }

    const currentHook = workInProgress.memoizedState[workInProgressHookIndex];

    function dispatcher(action: any) {
        currentHook.queue.push(action);

        scheduleUpdateOnFiber();
    }

    workInProgressHookIndex++;

    return [currentHook.state, dispatcher];
}

export default { createRoot, createTextElement, createElement, useState };
