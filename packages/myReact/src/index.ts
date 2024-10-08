import { createElement } from './createUtils';

import {
    Fiber,
    FiberRoot,
    FunctionComponent,
    HostComponent,
    HostRoot,
    HostText,
    IndeterminateComponent,
    Placement,
    ReactElement,
    ReactNodeList,
    RootType,
    WorkTag,
    Update,
    UseStateHook,
    Effect,
    HookHasEffect,
    HookNoFlags,
} from './types';

// Переменные на уровне модуля
let fiberRootNode: FiberRoot | null = null; // Самая главная файбер-нода. Создается один раз при первом рендере.
let workInProgress: any = null; // Ссылка на файбер-ноду, которая находится в работе в данный момент времени.
let workInProgressHookIndex: any = null; // Индекс (тип число) хуки в текущей файбер-ноде. Нужен только для функциональных компонентов.

// Конструктор FiberRootNode. Вызывается один раз за все время.
class FiberRootNode {
    containerInfo: Element | Document | DocumentFragment;
    current: any;

    constructor(containerInfo: Element | Document | DocumentFragment) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}

// Конструктор ReactDOMRoot. Вызывается один раз при инициализации.
class ReactDOMRoot {
    _internalRoot: FiberRoot;

    constructor(internalRoot: FiberRoot) {
        this._internalRoot = internalRoot;
    }

    render(children: ReactNodeList): void {
        fiberRootNode = this._internalRoot;

        fiberRootNode.current.props = {
            children: [children],
        };

        scheduleUpdateOnFiber();
    }
}

// Создаем рут при инициализации.
function createRoot(
    container: Element | HTMLElement | Document | DocumentFragment,
): RootType {
    const root = createFiberRoot(container);

    return new ReactDOMRoot(root as any);
}

// Создаем FiberRootNode и HostRoot
export function createFiberRoot(
    containerInfo: Element | HTMLElement | Document | DocumentFragment,
) {
    const fiberRoot = new FiberRootNode(containerInfo);
    const uninitializedFiber = createFiber(HostRoot, null);

    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = containerInfo;

    return fiberRoot;
}

// В реакте тут начинает работать планировщик (Scheduler).
// Я же просто ставлю задачу на рендер приложения в микротаску.
function scheduleUpdateOnFiber() {
    queueMicrotask(performSyncWorkOnRoot);
}

// Основная функция, которая занимается рендером, коммитом, запуском эффектов и тд.
// Есть еще performConcurrentWorkOnRoot, она работает в concurrent-режиме.
function performSyncWorkOnRoot() {
    renderRootSync();

    const finishedWork: Fiber | any = fiberRootNode!.current.alternate;

    fiberRootNode!.finishedWork = finishedWork;
    finishedWork.return = fiberRootNode;

    commitRoot();

    flushPassiveEffects();

    fiberRootNode!.current = finishedWork;
    fiberRootNode!.finishedWork = null;
    workInProgress = null;
}

// Основная функция рендера. Подготавливаем дерево файберов для дальнейшей работы.
// Запускаем синхронный цикл по проходу каждого файбера.
function renderRootSync() {
    prepareFreshStack();

    workLoopSync();
}

// Создаем wip-дерево с только одной нодой.
function prepareFreshStack() {
    workInProgress = createWorkInProgress(fiberRootNode!.current);
}

// Синхронный цикл по обработке файберов.
function workLoopSync() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

// Создаем wip-дерево, и точнее первую ноду. Линкуем ее с alternate-нодой из current-tree.
export function createWorkInProgress(current: Fiber): Fiber {
    let workInProgress = current.alternate!;

    if (workInProgress === null) {
        workInProgress = createFiber(current.tag, null);

        workInProgress.elementType = current.elementType;
        workInProgress.type = current.type;
        workInProgress.stateNode = current.stateNode;

        workInProgress.alternate = current;
        current.alternate = workInProgress;
    }

    workInProgress.child = null;
    workInProgress.sibling = null;
    workInProgress.return = null;
    workInProgress.props = current.props;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.memoizedState = current.memoizedState;

    return workInProgress;
}

// Утилита для создания fiber-объекта.
function createFiber(tag: WorkTag, props: any): Fiber {
    const fiber: Fiber = {
        tag,

        elementType: null,
        type: null,
        stateNode: null,

        // Fiber
        return: null,
        child: null,
        sibling: null,

        updateQueue: null,
        props: props,

        memoizedState: null,

        // Effects
        flags: 0,
        deletions: null,

        alternate: null,
    };

    return fiber;
}

// Утилита для создания fiber-ноды из элемента.
function createFiberFromElement(element: ReactElement): Fiber {
    const type = element.type;
    const props = element.props;

    let fiberTag: WorkTag = IndeterminateComponent;

    // The resolved type is set if we know what the final type will be. I.e. it's not lazy.
    let resolvedType = type;

    if (typeof type === 'function') {
        fiberTag = FunctionComponent;
    } else if (type === 'TEXT_ELEMENT') {
        fiberTag = HostText;
    } else if (typeof type === 'string') {
        fiberTag = HostComponent;
    }

    const fiber = createFiber(fiberTag, props);

    fiber.elementType = type;
    fiber.type = resolvedType;

    return fiber;
}

// Утилита для создания dom-ноды.
function createInstance(fiber: Fiber) {
    const { type, props } = fiber;

    const domElement =
        type == 'TEXT_ELEMENT'
            ? document.createTextNode(props.nodeValue)
            : document.createElement(type);

    fiber.stateNode = domElement;

    updateFiberProps(fiber);

    return domElement;
}

// Обновляем dom-ноду.
function updateFiberProps(fiber: Fiber) {
    const fiberDomNode = fiber.stateNode;
    const prevProps = fiber.alternate?.props || {};
    const nextProps = fiber.props || {};

    // Удаляем старые атрибуты и св-ва в dom-элементе
    for (let key in prevProps) {
        if (key === 'children') continue;

        const prop = prevProps[key];

        if (key.startsWith('on')) {
            // Удаляем обработчики
            if (
                !nextProps.hasOwnProperty(key) ||
                prevProps[key] !== nextProps[key]
            ) {
                const eventType = key.toLowerCase().substring(2);
                fiberDomNode.removeEventListener(eventType, prop);
            }
        } else {
            // Удаляем атрибуты, которых уже нет
            if (!nextProps.hasOwnProperty(key)) {
                if (key.startsWith('data')) {
                    fiberDomNode.removeAttribute(key);
                } else {
                    fiberDomNode[key] = '';
                }
            }
        }
    }

    // Добавляем новые атрибуты и обработчики
    for (let key in nextProps) {
        if (key === 'children') continue;

        const prop = nextProps[key];

        if (key.startsWith('on')) {
            // Добавляем сначала обработчики
            if (prevProps[key] !== nextProps[key]) {
                const eventType = key.toLowerCase().substring(2);
                fiberDomNode.addEventListener(eventType, prop);
            }
        } else {
            // И затем уже другие свойства
            if (prevProps[key] !== prop) {
                if (key.startsWith('data')) {
                    fiberDomNode.setAttribute(key, prop);
                } else {
                    fiberDomNode[key] = prop;
                }
            }
        }
    }
}

// UnitOfWork === fiber. 1 вызов performUnitOfWork - обработка 1 fiber-ноды.
// Здесь проделываем все работу над файбером.
function performUnitOfWork(unitOfWork: Fiber): void {
    const current = unitOfWork.alternate;

    let next;

    next = beginWork(current, unitOfWork);

    if (next === null) {
        completeUnitOfWork(unitOfWork);
    } else {
        workInProgress = next;
    }
}

// Функция-маршрутизатор. Вызывает соответствующий update.
// Тут идет работа над созданием новых файбер-нод, сверке children, обновлению пропсов и тд.
function beginWork(
    current: Fiber | null,
    workInProgress: Fiber,
): Fiber | null | any {
    switch (workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress);

        case FunctionComponent:
            return updateFunctionalComponent(current, workInProgress);

        case HostComponent:
            return updateHostComponent(current, workInProgress);

        case HostText:
            return updateHostText();
    }
}

// Заключительная функция в рамках performUnitOfWork.
// Здесь создаются dom-ноды.
function completeUnitOfWork(unitOfWork: Fiber): void {
    let completedWork: Fiber = unitOfWork;

    do {
        const returnFiber = completedWork.return;

        completeWork(completedWork);

        const siblingFiber = completedWork.sibling;

        if (siblingFiber !== null) {
            // Если у текущей ноды есть сосед (sibling), то мы выходим из completeUnitOfWork и запускаем beginWork у этой sibling-ноды.
            workInProgress = siblingFiber;

            return;
        }

        completedWork = returnFiber as any;

        workInProgress = completedWork;
    } while (completedWork !== null);
}

// Дочерняя функция-маршрутизатор из completeUnitOfWork.
export function completeWork(workInProgress: Fiber) {
    if (workInProgress.flags === Placement) {
        switch (workInProgress.tag) {
            case HostComponent: {
                createInstance(workInProgress);
                break;
            }
            case HostText: {
                createInstance(workInProgress);
                break;
            }
        }
    }

    return null;
}

// Вызывается в рамках beginWork.
function updateHostRoot(current: Fiber | null, workInProgress: Fiber) {
    const nextChildren = workInProgress.props.children;

    reconcileChildren(workInProgress, nextChildren);

    return workInProgress.child;
}

// Вызывается в рамках beginWork.
function updateFunctionalComponent(
    current: Fiber | null,
    workInProgress: Fiber,
) {
    workInProgress.memoizedState = current?.memoizedState || null;

    workInProgressHookIndex = 0;

    // Тут получаем результат вызова функциональной компоненты.
    const funcResult = workInProgress.type(workInProgress.props);

    workInProgressHookIndex = 0;

    workInProgress.props.children = funcResult;

    const nextChildren = [workInProgress.props.children];

    reconcileChildren(workInProgress, nextChildren);

    return workInProgress.child;
}

// Вызывается в рамках beginWork.
function updateHostComponent(current: Fiber | null, workInProgress: Fiber) {
    const nextChildren = workInProgress.props.children;

    if (nextChildren.length === 0) return null;

    reconcileChildren(workInProgress, nextChildren);

    return workInProgress.child;
}

// Вызывается в рамках beginWork.
function updateHostText() {
    return null;
}

// Сверка children.
function reconcileChildren(
    returnFiber: Fiber,
    newChild: any,
): Fiber | null | any {
    if (typeof newChild === 'object' && newChild !== null) {
        if (Array.isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, newChild);
        }
    }
}

// Запускается процесс reconciliation. Проверяем дочерние файбер-ноды и их порядок.
function reconcileChildrenArray(returnFiber: Fiber, elementsArr: any) {
    let index = 0;
    let firstChild = null;
    let prevFiber = null;
    let currentAlternateFiber: Fiber | null =
        returnFiber.alternate?.child || null;

    // Edge-case, когда вместо jsx-элементов мы маппим массив элементов.
    for (let i = 0; i < elementsArr.length; i++) {
        const currentItem = elementsArr[i];

        if (Array.isArray(currentItem)) {
            elementsArr.splice(i, 1, ...currentItem);
        }
    }

    while (index < elementsArr.length) {
        const created = createFiberFromElement(elementsArr[index]);

        if (
            currentAlternateFiber &&
            currentAlternateFiber?.type === created.type
        ) {
            created.alternate = currentAlternateFiber;
            currentAlternateFiber.alternate = created;

            created.flags = Update;
            created.stateNode = currentAlternateFiber?.stateNode;
        } else {
            created.flags = Placement;

            if (currentAlternateFiber) {
                if (Array.isArray(returnFiber.deletions)) {
                    returnFiber.deletions.push(currentAlternateFiber);
                } else {
                    returnFiber.deletions = [currentAlternateFiber];
                }
            }
        }

        created.return = returnFiber;

        if (index === 0) {
            returnFiber.child = created;
            firstChild = created;
        }

        if (index !== 0) {
            prevFiber!.sibling = created;
        }

        prevFiber = created;
        index++;

        if (currentAlternateFiber) {
            currentAlternateFiber = currentAlternateFiber.sibling;
        }
    }

    // Если элементов на этом уровне больше нет, но они есть в alternate, то их нужно удалить.
    let fiberToDelete = currentAlternateFiber;

    while (fiberToDelete) {
        if (Array.isArray(returnFiber.deletions)) {
            returnFiber.deletions.push(fiberToDelete);
        } else {
            returnFiber.deletions = [fiberToDelete];
        }

        fiberToDelete = fiberToDelete.sibling;
    }

    return firstChild;
}

// Наступает фаза коммита. Сначала удаляются dom-ноды. Затем обновляются/добавляются dom-ноды.
function commitRoot() {
    const finishedWork = fiberRootNode!.finishedWork;

    commitDeletions(finishedWork.child);
    commitWork(finishedWork.child);
}

// Дочерняя функция из commitRoot. Проходим fiber-дерево снова и применяем изменения в dom.
function commitWork(fiber: Fiber | null | any) {
    if (!fiber) {
        return;
    }

    let returnFiber = fiber.return;

    while (!returnFiber?.stateNode) {
        returnFiber = returnFiber?.return || null;
    }

    const returnFiberStateNode = returnFiber.stateNode;

    if (fiber.stateNode) {
        if (fiber.flags === Update) {
            updateFiberProps(fiber);
        } else {
            returnFiberStateNode.appendChild(fiber.stateNode);
        }
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

// Удаляем dom-ноды, требующие удаления.
function commitDeletions(fiber: Fiber | null | any) {
    if (!fiber) {
        return;
    }

    if (fiber.deletions) {
        fiber.deletions.forEach((fiber: Fiber) => {
            let fiberToDelete: Fiber | null = fiber;

            while (fiberToDelete) {
                if (fiberToDelete.stateNode) {
                    fiberToDelete.stateNode.remove();
                    return;
                }

                fiberToDelete = fiberToDelete.child;
            }
        });
    }

    fiber.deletions = null;

    commitDeletions(fiber.child);
    commitDeletions(fiber.sibling);
}

// Запускаем коллбэки из useEffect.
function flushPassiveEffects() {
    let fiber = fiberRootNode!.finishedWork;
    let cameFromReturn = false;

    while (fiber) {
        if (fiber.child && !cameFromReturn) {
            fiber = fiber.child;
            continue;
        }

        if (fiber.memoizedState && fiber.memoizedState.length > 0) {
            // Обрабатываем тут только хуки эффектов
            fiber.memoizedState.forEach((hook: any) => {
                if (!hook.tag || hook.tag !== HookHasEffect) return;

                hook.create();
            })!;
        }

        if (fiber.sibling) {
            fiber = fiber.sibling;
            cameFromReturn = false;
            continue;
        }

        cameFromReturn = true;
        fiber = fiber.return;
    }
}

// Хук useState.
function useState(initialValue: string | number | boolean | any[]) {
    if (workInProgress.memoizedState === null) {
        workInProgress.memoizedState = [];
    }

    if (workInProgress.memoizedState[workInProgressHookIndex]) {
        const hook: UseStateHook =
            workInProgress.memoizedState[workInProgressHookIndex];

        hook.queue.forEach((action: any) => {
            if (typeof action === 'function') {
                hook!.state = action(hook!.state);
            } else {
                hook!.state = action;
            }
        });

        hook.queue = [];
    } else {
        workInProgress.memoizedState[workInProgressHookIndex] = {
            state: initialValue,
            queue: [],
        };
    }

    const currentHook = workInProgress.memoizedState[workInProgressHookIndex];

    function dispatcher(action: any) {
        currentHook.queue.push(action);

        scheduleUpdateOnFiber();
    }

    workInProgressHookIndex++;

    return [currentHook.state, dispatcher];
}

// Хук useEffect.
function useEffect(create: () => (() => void) | void, deps: Array<any>) {
    if (workInProgress.memoizedState === null) {
        workInProgress.memoizedState = [];
    }

    const prevEffect: Effect | null =
        workInProgress.memoizedState[workInProgressHookIndex] || null;

    // Проверка на initial render или rerender
    if (prevEffect !== null) {
        let tag = HookNoFlags;

        const prevDeps = prevEffect.deps;

        for (let i = 0; i < prevDeps.length; i++) {
            if (prevDeps[i] !== deps[i]) {
                tag = HookHasEffect;
                break;
            }
        }

        workInProgress.memoizedState[workInProgressHookIndex] = {
            tag,
            create,
            destroy: null,
            deps,
        };
    } else {
        workInProgress.memoizedState[workInProgressHookIndex] = {
            tag: HookHasEffect,
            create,
            destroy: null,
            deps,
        };
    }
}

export default {
    createRoot,
    createElement,
};

export { useEffect, useState };
