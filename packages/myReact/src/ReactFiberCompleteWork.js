"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeWork = completeWork;
const types_1 = require("./types");
function completeWork(current, workInProgress) {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case types_1.FunctionComponent:
            // bubbleProperties(workInProgress);
            return null;
        case types_1.HostRoot: {
            // bubbleProperties(workInProgress);
            return null;
        }
        case types_1.HostComponent: {
            var type = workInProgress.type;
            if (current !== null && workInProgress.stateNode != null) {
                // updateHostComponent$1(
                //     current,
                //     workInProgress,
                //     type,
                //     newProps,
                //     rootContainerInstance,
                // );
                //
                // if (current.ref !== workInProgress.ref) {
                //     markRef$1(workInProgress);
                // }
            }
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
                appendAllChildren(instance, workInProgress, false, false);
                workInProgress.stateNode = instance;
            }
            // bubbleProperties(workInProgress);
            return null;
        }
    }
}
function markUpdate(workInProgress) {
    workInProgress.flags |= types_1.Update;
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
        if (node.tag === types_1.HostComponent || node.tag === types_1.HostText) {
            // todo
        }
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
