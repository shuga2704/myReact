'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const FunctionComponent = 0;
const IndeterminateComponent = 2;
const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
const HostComponent = 5;
const HostText = 6;
const Placement = /*                    */ 0b0000000000000000000000000010;
// You can change the rest (and add more).
const Update = /*                       */ 0b0000000000000000000000000100;

let fiberRootNode = null;
let workInProgress = null;
let workInProgressHookIndex = null;
class FiberRootNode {
    constructor(containerInfo) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}
class ReactDOMRoot {
    constructor(internalRoot) {
        this._internalRoot = internalRoot;
    }
    render(children) {
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
    const finishedWork = fiberRootNode.current.alternate;
    fiberRootNode.finishedWork = finishedWork;
    finishedWork.return = fiberRootNode;
    commitRoot();
    fiberRootNode.current = finishedWork;
    fiberRootNode.finishedWork = null;
    workInProgress = null;
}
function renderRootSync() {
    prepareFreshStack();
    do {
        try {
            workLoopSync();
            break;
        }
        catch (thrownValue) { }
    } while (true);
}
function prepareFreshStack() {
    workInProgress = createWorkInProgress(fiberRootNode.current);
}
function workLoopSync() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}
function createFiberRoot(containerInfo) {
    const fiberRoot = new FiberRootNode(containerInfo);
    const uninitializedFiber = createFiber(HostRoot, null);
    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = containerInfo;
    return fiberRoot;
}
function createRoot(container) {
    const root = createFiberRoot(container);
    return new ReactDOMRoot(root);
}
// This is used to create an alternate fiber to do work on.
function createWorkInProgress(current) {
    let workInProgress = current.alternate;
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
function createFiber(tag, props) {
    const fiber = {
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
function createFiberFromElement(element) {
    const type = element.type;
    const props = element.props;
    let fiberTag = IndeterminateComponent;
    // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
    let resolvedType = type;
    if (typeof type === 'function') {
        fiberTag = FunctionComponent;
    }
    else if (type === 'TEXT_ELEMENT') {
        fiberTag = HostText;
    }
    else if (typeof type === 'string') {
        fiberTag = HostComponent;
    }
    const fiber = createFiber(fiberTag, props);
    fiber.elementType = type;
    fiber.type = resolvedType;
    return fiber;
}
function createInstance(fiber) {
    const { type, props } = fiber;
    const domElement = type == 'TEXT_ELEMENT'
        ? document.createTextNode(props.nodeValue)
        : document.createElement(type);
    fiber.stateNode = domElement;
    updateFiberProps(fiber);
    return domElement;
}
const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
function updateFiberProps(fiber) {
    var _a;
    const dom = fiber.stateNode;
    const prevProps = ((_a = fiber.alternate) === null || _a === void 0 ? void 0 : _a.props) || {};
    const nextProps = fiber.props || {};
    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
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
function performUnitOfWork(unitOfWork) {
    const current = unitOfWork.alternate;
    let next;
    next = beginWork(current, unitOfWork);
    if (next === null) {
        completeUnitOfWork(unitOfWork);
    }
    else {
        workInProgress = next;
    }
}
function beginWork(current, workInProgress) {
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
function completeUnitOfWork(unitOfWork) {
    // Attempt to complete the current unit of work, then move to the next
    // sibling. If there are no more siblings, return to the parent fiber.
    let completedWork = unitOfWork;
    do {
        // The current, flushed, state of this fiber is the alternate. Ideally
        // nothing should rely on this, but relying on it here means that we don't
        // need an additional field on the work in progress.
        completedWork.alternate;
        const returnFiber = completedWork.return;
        // debugger;
        completeWork(completedWork);
        const siblingFiber = completedWork.sibling;
        if (siblingFiber !== null) {
            // If there is more work to do in this returnFiber, do that next.
            workInProgress = siblingFiber;
            return;
        }
        completedWork = returnFiber;
        // Update the next thing we're working on in case something throws.
        workInProgress = completedWork;
    } while (completedWork !== null);
}
function completeWork(workInProgress) {
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
function updateHostRoot(current, workInProgress) {
    const nextChildren = workInProgress.props.children;
    reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
}
function updateFunctionalComponent(current, workInProgress) {
    workInProgress.memoizedState = (current === null || current === void 0 ? void 0 : current.memoizedState) || null;
    workInProgressHookIndex = 0;
    const funcResult = workInProgress.type(workInProgress.props);
    workInProgressHookIndex = 0;
    workInProgress.props.children = funcResult;
    const nextChildren = [workInProgress.props.children];
    reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
}
function updateHostComponent(current, workInProgress) {
    const nextChildren = workInProgress.props.children;
    if (nextChildren.length === 0)
        return null;
    reconcileChildren(workInProgress, nextChildren);
    return workInProgress.child;
}
function updateHostText() {
    return null;
}
function reconcileChildren(returnFiber, newChild) {
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
function reconcileSingleElement(returnFiber, element) {
    var _a, _b;
    const created = createFiberFromElement(element);
    // Проверяем одинаков ли тип у файберов
    if (((_a = returnFiber.alternate) === null || _a === void 0 ? void 0 : _a.child) &&
        ((_b = returnFiber.alternate) === null || _b === void 0 ? void 0 : _b.child.type) === created.type) {
        created.alternate = returnFiber.alternate.child;
        returnFiber.alternate.child.alternate = created;
        created.flags = Update;
        created.stateNode = returnFiber.alternate.child.stateNode;
    }
    else {
        created.flags = Placement;
    }
    created.return = returnFiber;
    returnFiber.child = created;
    return created;
}
function reconcileChildrenArray(returnFiber, elementsArr) {
    var _a;
    let index = 0;
    let firstChild = null;
    let prevFiber = null;
    let currentAlternateFiber = ((_a = returnFiber.alternate) === null || _a === void 0 ? void 0 : _a.child) || null;
    while (index < elementsArr.length) {
        const created = createFiberFromElement(elementsArr[index]);
        if (currentAlternateFiber &&
            (currentAlternateFiber === null || currentAlternateFiber === void 0 ? void 0 : currentAlternateFiber.type) === created.type) {
            created.alternate = currentAlternateFiber;
            currentAlternateFiber.alternate = created;
            created.flags = Update;
            created.stateNode = currentAlternateFiber === null || currentAlternateFiber === void 0 ? void 0 : currentAlternateFiber.stateNode;
        }
        else {
            created.flags = Placement;
        }
        created.return = returnFiber;
        if (index === 0) {
            returnFiber.child = created;
            firstChild = created;
        }
        if (index !== 0) {
            prevFiber.sibling = created;
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
    const finishedWork = fiberRootNode.finishedWork;
    commitWork(finishedWork.child);
}
function commitWork(fiber) {
    if (!fiber) {
        return;
    }
    let returnFiber = fiber.return;
    while (!(returnFiber === null || returnFiber === void 0 ? void 0 : returnFiber.stateNode)) {
        returnFiber = (returnFiber === null || returnFiber === void 0 ? void 0 : returnFiber.return) || null;
    }
    const returnFiberStateNode = returnFiber.stateNode;
    if (fiber.stateNode) {
        if (fiber.flags === Update) {
            updateFiberProps(fiber);
        }
        else {
            returnFiberStateNode.appendChild(fiber.stateNode);
        }
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}
function useState(initialValue) {
    if (workInProgress.memoizedState === null) {
        workInProgress.memoizedState = [];
    }
    if (workInProgress.memoizedState[workInProgressHookIndex]) {
        const hook = workInProgress.memoizedState[workInProgressHookIndex];
        hook.queue.forEach((action) => {
            if (typeof action === 'function') {
                hook.state = action(hook.state);
            }
            else {
                hook.state = action;
            }
        });
        hook.queue = [];
    }
    else {
        workInProgress.memoizedState[workInProgressHookIndex] = {
            state: initialValue,
            queue: [],
        };
    }
    const currentHook = workInProgress.memoizedState[workInProgressHookIndex];
    function dispatcher(action) {
        currentHook.queue.push(action);
        scheduleUpdateOnFiber();
    }
    workInProgressHookIndex++;
    return [currentHook.state, dispatcher];
}
var index = { createRoot, createTextElement, createElement, useState };

exports.completeWork = completeWork;
exports.createFiberRoot = createFiberRoot;
exports.createWorkInProgress = createWorkInProgress;
exports.default = index;
exports.reconcileSingleElement = reconcileSingleElement;
//# sourceMappingURL=index.js.map
