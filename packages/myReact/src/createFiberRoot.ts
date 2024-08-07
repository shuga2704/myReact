import { createFiber } from './createFiber';
import { HostRoot, NoMode } from './types';

export function createHostRootFiber() {
    return createFiber(HostRoot, null, null, NoMode);
}

class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;

    constructor(containerInfo: Element | Document | DocumentFragment) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}

export function createFiberRoot(containerInfo: Element | Document | DocumentFragment) {
    const fiberRoot = new FiberRootNode(containerInfo);

    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber();

    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = fiberRoot;

    return fiberRoot;
}
