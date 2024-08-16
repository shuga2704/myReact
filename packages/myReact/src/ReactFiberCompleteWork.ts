import {
    Fiber,
    FunctionComponent,
    HostRoot,
    HostComponent,
    FiberRoot,
    RootState,
    Update,
    HostText,
} from './types';

export function completeWork(
    current: Fiber | null,
    workInProgress: Fiber | any,
): Fiber | null | any {
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
            } else {
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

function markUpdate(workInProgress: Fiber) {
    workInProgress.flags |= Update;
}

function createInstance(type: string, props: any) {
    var domElement = document.createElement(
        type,
        props,
        // rootContainerInstance,
        // parentNamespace,
    );

    // precacheFiberNode(internalInstanceHandle, domElement);
    // updateFiberProps(domElement, props);
    return domElement;
}

function appendAllChildren(
    parent: any,
    workInProgress: Fiber,
    needsVisibilityToggle: boolean,
    isHidden: boolean,
) {
    let node = workInProgress.child;

    while (node !== null) {
        if (node.tag === HostComponent || node.tag === HostText) {
            // todo
        } else if (node.child !== null) {
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
