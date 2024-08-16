import { Fiber, RootType } from './types';
declare class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;
    constructor(containerInfo: Element | Document | DocumentFragment);
}
export declare function createFiberRoot(containerInfo: Element | Document | DocumentFragment): FiberRootNode;
declare function createRoot(container: Element | Document | DocumentFragment): RootType;
export declare function createWorkInProgress(current: Fiber): Fiber;
export declare function completeWork(workInProgress: Fiber): null;
export declare function reconcileSingleElement(returnFiber: Fiber, currentFirstChild: Fiber | null, element: any): Fiber;
declare function useState(initialValue: string | number): any[];
declare const _default: {
    createRoot: typeof createRoot;
    createTextElement: (text: any) => {
        type: string;
        props: {
            nodeValue: any;
            children: never[];
        };
    };
    createElement: (type: any, props: any, ...children: any) => {
        type: any;
        props: any;
    };
    useState: typeof useState;
};
export default _default;
