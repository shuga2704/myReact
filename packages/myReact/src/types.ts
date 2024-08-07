export type ReactElement = {
    $$typeof: any;
    type: any;
    key: any;
    ref: any;
    props: any;
};

export type ReactText = string | number;

export type FiberRoot = Fiber; // уникальный тип для файбер рут ноды

export type RootType = {
    render(children: ReactNodeList): void;
    unmount(): void;
    _internalRoot: FiberRoot | null;
};

export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty | Iterable<ReactNode>;

export type ReactNode = ReactElement | ReactText | ReactFragment;

export type ReactNodeList = ReactEmpty | ReactNode;

export type Fiber = {
    // These first fields are conceptually members of an Instance. This used to
    // be split into a separate type and intersected with the other Fiber fields,
    // but until Flow fixes its intersection bugs, we've merged them into a
    // single type.

    // An Instance is shared between all versions of a component. We can easily
    // break this out into a separate object to avoid copying so much to the
    // alternate versions of the tree. We put this on a single object for now to
    // minimize the number of objects created during the initial render.

    // Tag identifying the type of fiber.
    tag: WorkTag;

    // Unique identifier of this child.
    key: null | string;

    // The value of element.type which is used to preserve the identity during
    // reconciliation of this child.
    elementType: any;

    // The resolved function/class/ associated with this fiber.
    type: any;

    // The local state associated with this fiber.
    stateNode: any;

    // Conceptual aliases
    // parent : Instance -> return The parent happens to be the same as the
    // return fiber since we've merged the fiber and instance.

    // Remaining fields belong to Fiber

    // The Fiber to return to after finishing processing this one.
    // This is effectively the parent, but there can be multiple parents (two)
    // so this is only the parent of the thing we're currently processing.
    // It is conceptually the same as the return address of a stack frame.
    return: Fiber | null;

    // Singly Linked List Tree Structure.
    child: Fiber | null;
    sibling: Fiber | null;
    index: number;

    // The ref last used to attach this node.
    // I'll avoid adding an owner field for prod and model that as functions.
    ref: null | RefObject;

    refCleanup: null | (() => void);

    // Input is the data coming into process this fiber. Arguments. Props.
    pendingProps: any; // This type will be more specific once we overload the tag.
    memoizedProps: any; // The props used to create the output.

    // A queue of state updates and callbacks.
    updateQueue: any;

    // The state used to create the output
    memoizedState: any;

    // Dependencies (contexts, events) for this fiber, if it has any
    // dependencies: Dependencies | null;

    // Bitfield that describes properties about the fiber and its subtree. E.g.
    // the ConcurrentMode flag indicates whether the subtree should be async-by-
    // default. When a fiber is created, it inherits the mode of its
    // parent. Additional flags can be set at creation time, but after that the
    // value should remain unchanged throughout the fiber's lifetime, particularly
    // before its child fibers are created.
    mode: TypeOfMode;

    // Effect
    flags: Flags;
    subtreeFlags: Flags;
    deletions: Array<Fiber> | null;

    // lanes: Lanes,
    // childLanes: Lanes,

    // This is a pooled version of a Fiber. Every fiber that gets updated will
    // eventually have a pair. There are cases when we can clean up pairs to save
    // memory if we need to.
    alternate: Fiber | null;
};

export type WorkTag =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29;

export const FunctionComponent = 0;
export const ClassComponent = 1;
export const HostRoot = 3; // Root of a host tree. Could be nested inside another node.
export const HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
export const HostComponent = 5;
export const HostText = 6;
export const Fragment = 7;
export const Mode = 8;
export const ContextConsumer = 9;
export const ContextProvider = 10;
export const ForwardRef = 11;
export const Profiler = 12;
export const SuspenseComponent = 13;
export const MemoComponent = 14;
export const SimpleMemoComponent = 15;
export const LazyComponent = 16;
export const IncompleteClassComponent = 17;
export const DehydratedFragment = 18;
export const SuspenseListComponent = 19;
export const ScopeComponent = 21;
export const OffscreenComponent = 22;
export const LegacyHiddenComponent = 23;
export const CacheComponent = 24;
export const TracingMarkerComponent = 25;
export const HostHoistable = 26;
export const HostSingleton = 27;
export const IncompleteFunctionComponent = 28;
export const Throw = 29;

export type RefObject = {
    current: any;
};

export type TypeOfMode = number;

export const NoMode = /*                         */ 0b0000000;
// TODO: Remove ConcurrentMode by reading from the root tag instead
export const ConcurrentMode = /*                 */ 0b0000001;
export const ProfileMode = /*                    */ 0b0000010;
export const DebugTracingMode = /*               */ 0b0000100;
export const StrictLegacyMode = /*               */ 0b0001000;
export const StrictEffectsMode = /*              */ 0b0010000;
export const NoStrictPassiveEffectsMode = /*     */ 0b1000000;

export type Flags = number;

export const NoFlags = /*                      */ 0b0000000000000000000000000000;
