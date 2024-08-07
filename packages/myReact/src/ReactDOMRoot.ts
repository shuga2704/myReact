import { FiberRoot, ReactNodeList } from './types';

class ReactDOMRoot {
    _internalRoot: FiberRoot;

    constructor(internalRoot: FiberRoot) {
        this._internalRoot = internalRoot;
    }

    render(children: ReactNodeList): void {
        const root = this._internalRoot;

        updateContainer(children, root, null, null);
    }
}
