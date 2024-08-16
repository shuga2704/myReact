import { Fiber, ReactElement, TypeOfMode } from './types';
export declare function createWorkInProgress(current: Fiber | any, pendingProps: any): Fiber;
export declare function createFiberFromElement(element: ReactElement, mode: TypeOfMode | any): Fiber;
export declare function createFiberFromTypeAndProps(type: any, // React$ElementType
key: null | string, pendingProps: any, mode: TypeOfMode): Fiber;
