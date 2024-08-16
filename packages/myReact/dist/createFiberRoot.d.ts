declare class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;
    constructor(containerInfo: Element | Document | DocumentFragment);
}
export declare function createFiberRoot(containerInfo: Element | Document | DocumentFragment): FiberRootNode;
export {};
