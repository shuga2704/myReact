import { FiberRoot, ReactNodeList } from './types';
export declare class ReactDOMRoot {
    _internalRoot: FiberRoot;
    constructor(internalRoot: FiberRoot);
    render(children: ReactNodeList): void;
    unmount(): void;
}
