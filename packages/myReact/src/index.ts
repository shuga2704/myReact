import { createElement } from './createUtils';

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
    UseStateHook,
    Effect,
    HookHasEffect,
    HookNoFlags,
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
    queueMicrotask(performConcurrentWorkOnRoot);
}

function performConcurrentWorkOnRoot() {
    renderRootSync();

    const finishedWork: Fiber | any = fiberRootNode!.current.alternate;

    fiberRootNode!.finishedWork = finishedWork;
    finishedWork.return = fiberRootNode;

    commitRoot();

    flushPassiveEffects();

    fiberRootNode!.current = finishedWork;
    fiberRootNode!.finishedWork = null;
    workInProgress = null;
}

function renderRootSync() {
    prepareFreshStack();

    workLoopSync();
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
    containerInfo: Element | HTMLElement | Document | DocumentFragment,
) {
    const fiberRoot = new FiberRootNode(containerInfo);

    const uninitializedFiber = createFiber(HostRoot, null);

    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = containerInfo;

    return fiberRoot;
}

function createRoot(
    container: Element | HTMLElement | Document | DocumentFragment,
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

function updateFiberProps(fiber: Fiber) {
    const fiberDomNode = fiber.stateNode;
    const prevProps = fiber.alternate?.props || {};
    const nextProps = fiber.props || {};

    // Удаляем старые атрибуты и св-ва в dom-элементе
    for (let key in prevProps) {
        if (key === 'children') continue;

        const prop = prevProps[key];

        if (key.startsWith('on')) {
            // Удаляем обработчики
            if (
                !nextProps.hasOwnProperty(key) ||
                prevProps[key] !== nextProps[key]
            ) {
                const eventType = key.toLowerCase().substring(2);
                fiberDomNode.removeEventListener(eventType, prop);
            }
        } else {
            // Удаляем атрибуты, которых уже нет
            if (!nextProps.hasOwnProperty(key)) {
                if (key.startsWith('data')) {
                    fiberDomNode.removeAttribute(key);
                } else {
                    fiberDomNode[key] = '';
                }
            }
        }
    }

    // Добавляем новые атрибуты и обработчики
    for (let key in nextProps) {
        if (key === 'children') continue;

        const prop = nextProps[key];

        if (key.startsWith('on')) {
            // Добавляем сначала обработчики
            if (prevProps[key] !== nextProps[key]) {
                const eventType = key.toLowerCase().substring(2);
                fiberDomNode.addEventListener(eventType, prop);
            }
        } else {
            // И затем уже другие свойства
            if (prevProps[key] !== prop) {
                if (key.startsWith('data')) {
                    fiberDomNode.setAttribute(key, prop);
                } else {
                    fiberDomNode[key] = prop;
                }
            }
        }
    }
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
        if (Array.isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, newChild);
        }

        // reconcileSingleElement(returnFiber, newChild[0]);
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

    for (let i = 0; i < elementsArr.length; i++) {
        const currentItem = elementsArr[i];

        if (Array.isArray(currentItem)) {
            elementsArr.splice(i, 1, ...currentItem);
        }
    }

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

            if (currentAlternateFiber) {
                if (Array.isArray(returnFiber.deletions)) {
                    returnFiber.deletions.push(currentAlternateFiber);
                } else {
                    returnFiber.deletions = [currentAlternateFiber];
                }
            }
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

    // Если элементов на этом уровне больше нет, но они есть в alternate, то их нужно удалить.
    let fiberToDelete = currentAlternateFiber;

    while (fiberToDelete) {
        if (Array.isArray(returnFiber.deletions)) {
            returnFiber.deletions.push(fiberToDelete);
        } else {
            returnFiber.deletions = [fiberToDelete];
        }

        fiberToDelete = fiberToDelete.sibling;
    }

    return firstChild;
}

function commitRoot() {
    const finishedWork = fiberRootNode!.finishedWork;

    commitDeletions(finishedWork.child);
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

function commitDeletions(fiber: Fiber | null | any) {
    if (!fiber) {
        return;
    }

    if (fiber.deletions) {
        fiber.deletions.forEach((fiber: Fiber) => {
            let fiberToDelete: Fiber | null = fiber;

            while (fiberToDelete) {
                if (fiberToDelete.stateNode) {
                    fiberToDelete.stateNode.remove();
                    return;
                }

                fiberToDelete = fiberToDelete.child;
            }
        });
    }

    fiber.deletions = null;

    commitDeletions(fiber.child);
    commitDeletions(fiber.sibling);
}

function flushPassiveEffects() {
    let fiber = fiberRootNode!.finishedWork;
    let cameFromReturn = false;

    while (fiber) {
        if (fiber.child && !cameFromReturn) {
            fiber = fiber.child;
            continue;
        }

        if (fiber.memoizedState && fiber.memoizedState.length > 0) {
            // Обрабатываем тут только хуки эффектов
            fiber.memoizedState.forEach((hook: any) => {
                if (!hook.tag || hook.tag !== HookHasEffect) return;

                hook.create();
            })!;
        }

        if (fiber.sibling) {
            fiber = fiber.sibling;
            cameFromReturn = false;
            continue;
        }

        cameFromReturn = true;
        fiber = fiber.return;
    }
}

function useState(initialValue: string | number | boolean | any[]) {
    if (workInProgress.memoizedState === null) {
        workInProgress.memoizedState = [];
    }

    if (workInProgress.memoizedState[workInProgressHookIndex]) {
        const hook: UseStateHook =
            workInProgress.memoizedState[workInProgressHookIndex];

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

function useEffect(create: () => (() => void) | void, deps: Array<any>) {
    if (workInProgress.memoizedState === null) {
        workInProgress.memoizedState = [];
    }

    const prevEffect: Effect | null =
        workInProgress.memoizedState[workInProgressHookIndex] || null;

    // Проверка на initial render или rerender
    if (prevEffect !== null) {
        let tag = HookNoFlags;

        const prevDeps = prevEffect.deps;

        for (let i = 0; i < prevDeps.length; i++) {
            if (prevDeps[i] !== deps[i]) {
                tag = HookHasEffect;
                break;
            }
        }

        workInProgress.memoizedState[workInProgressHookIndex] = {
            tag,
            create,
            destroy: null,
            deps,
        };
    } else {
        workInProgress.memoizedState[workInProgressHookIndex] = {
            tag: HookHasEffect,
            create,
            destroy: null,
            deps,
        };
    }
}

export default {
    createRoot,
    createElement,
};

export { useEffect, useState };
