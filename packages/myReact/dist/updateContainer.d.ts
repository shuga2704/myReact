import { ReactNodeList, FiberRoot, Fiber, Lane, Update, SharedQueue as ClassQueue, Update as ClassUpdate } from './types';
export declare function enqueueUpdate<State>(fiber: Fiber, update: Update<State>, lane: Lane): FiberRoot | null;
export declare function enqueueConcurrentClassUpdate<State>(fiber: Fiber, queue: ClassQueue<State> | any, update: ClassUpdate<State>, lane: Lane): FiberRoot | null;
export declare function createUpdate(lane: Lane): Update<any>;
export declare function updateContainer(element: ReactNodeList, container: FiberRoot | any, parentComponent: any, callback: any): Lane;
