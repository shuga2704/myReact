import { createFiber } from './createFiber';
import { HostRoot, NoMode } from './types';

class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;

    constructor(containerInfo: Element | Document | DocumentFragment) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}

export function createFiberRoot(
    containerInfo: Element | Document | DocumentFragment,
) {
    const fiberRoot = new FiberRootNode(containerInfo);

    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createFiber(HostRoot, null, null, NoMode);

    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = fiberRoot;

    return fiberRoot;
}
