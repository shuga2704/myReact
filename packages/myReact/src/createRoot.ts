import { RootType } from './types';
import { createFiberRoot } from './createFiberRoot';

export function createRoot(container: Element | Document | DocumentFragment): RootType {
    const root = createFiberRoot(container);

    return new ReactDOMRoot(root);
}
