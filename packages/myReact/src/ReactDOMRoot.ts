import { FiberRoot, ReactNodeList } from './types';
import { updateContainer } from './updateContainer';

export class ReactDOMRoot {
    _internalRoot: FiberRoot;

    constructor(internalRoot: FiberRoot) {
        this._internalRoot = internalRoot;
    }

    render(children: ReactNodeList): void {
        const root = this._internalRoot;

        updateContainer(children, root, null, null);
    }

    unmount() {}
}
