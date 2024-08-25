import { Fiber, RootType } from './types';
declare class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;
    constructor(containerInfo: Element | Document | DocumentFragment);
}
export declare function createFiberRoot(containerInfo: Element | HTMLElement | Document | DocumentFragment): FiberRootNode;
declare function createRoot(container: Element | HTMLElement | Document | DocumentFragment): RootType;
export declare function createWorkInProgress(current: Fiber): Fiber;
export declare function completeWork(workInProgress: Fiber): null;
export declare function reconcileSingleElement(returnFiber: Fiber, element: any): Fiber;
declare function useState(initialValue: string | number | boolean | any[]): any[];
declare function useEffect(create: () => (() => void) | void, deps: Array<any>): void;
declare const _default: {
    createRoot: typeof createRoot;
    createElement: (type: any, props: any, ...children: any) => {
        type: any;
        props: any;
    };
};
export default _default;
export { useEffect, useState };
