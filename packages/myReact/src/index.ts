import { createElement, createTextElement } from './createUtils';
import { createDom, updateDom } from './domUtils';
import { createRoot } from './createRoot';

let currentRoot: any = null;
let wipRoot: any = null;
let nextUnitOfWork: any = null;
let deletions: any = null;

function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    };

    deletions = [];

    nextUnitOfWork = wipRoot;
}

function workLoop(deadline) {
    while (nextUnitOfWork) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

        // if (deadline.timeRemaining() < 1) break;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    window.requestIdleCallback(workLoop);
}
window.requestIdleCallback(workLoop);

let wipFiber: any = null;
let hookIndex: any = null;

function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    hookIndex = 0;

    wipFiber.hooks = [];

    const componentFunction = fiber.type;

    fiber.props.children = [componentFunction(fiber.props)];

    reconcileChildren(fiber);
}

function useState(initial) {
    const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];

    const hook = {
        state: oldHook ? oldHook.newValue || oldHook.state : initial,
        newValue: undefined,
    };

    const setState = (newValue) => {
        hook.newValue = newValue;

        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        };

        nextUnitOfWork = wipRoot;
        deletions = [];
    };

    wipFiber.hooks.push(hook);
    hookIndex++;

    return [hook.state, setState];
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    reconcileChildren(fiber);
}

function performUnitOfWork(fiber) {
    console.log('FIBER', fiber.type);
    const isFunctionComponent = fiber.type instanceof Function;

    // console.log(fiber);

    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;

    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }

        nextFiber = nextFiber.parent;
    }

    return null;
}

function flatten(value) {
    const res = [];
    const copy = value.slice();

    while (copy.length) {
        const item = copy.shift();
        if (Array.isArray(item)) {
            copy.unshift(...item);
        } else {
            res.push(item as never);
        }
    }

    return res;
}

// https://github.com/facebook/react/blob/f603426f917314561c4289734f39b972be3814af/packages/react-reconciler/src/ReactFiberBeginWork.js#L340
function reconcileChildren(wipFiber) {
    let elements = flatten(wipFiber.props.children);

    let index = 0;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling: any = null;

    while (index < elements.length || oldFiber) {
        const element: any = elements[index];

        let newFiber: any = null;

        const sameType = oldFiber && element && element.type == oldFiber.type;

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: 'UPDATE',
            };
        }

        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: 'PLACEMENT',
            };
        }

        if (oldFiber && !sameType) {
            oldFiber.effectTag = 'DELETION';
            deletions.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

function commitRoot() {
    // console.log('start', performance.now());

    deletions.forEach(commitWork);

    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;

    // console.log('end', performance.now());
}

function commitWork(fiber) {
    if (!fiber) {
        return;
    }

    let domParentFiber = fiber.parent;

    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;

    if (fiber.effectTag === 'PLACEMENT' && fiber.dom) {
        domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === 'DELETION') {
        commitDeletion(fiber, domParent);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child, domParent);
    }
}

export default { createRoot, createTextElement, createElement, render, useState };
