import { Fiber, WorkTag, TypeOfMode } from './types';
declare function createFiberImplObject(tag: WorkTag, pendingProps: any, key: null | string, mode: TypeOfMode): Fiber;
export declare const createFiber: typeof createFiberImplObject;
export {};
