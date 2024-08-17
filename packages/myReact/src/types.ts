export type ReactElement = {
    $$typeof: any;
    type: any;
    key: any;
    ref: any;
    props: any;
};

export type ReactText = string | number;

export type FiberRoot = {
    current: Fiber;
    containerInfo: any;
    next: any;
    finishedWork: any;
}; // уникальный тип для файбер рут ноды

export type RootType = {
    render(children: ReactNodeList): void;
    _internalRoot: FiberRoot | null;
};

export type ReactEmpty = null | void | boolean;

export type ReactFragment = ReactEmpty | Iterable<ReactNode>;

export type ReactNode = ReactElement | ReactText | ReactFragment;

export type ReactNodeList = ReactEmpty | ReactNode;

export type Fiber = {
    // Tag identifying the type of fiber.
    tag: WorkTag;

    // The value of element.type which is used to preserve the identity during
    // reconciliation of this child.
    elementType: any;

    // The resolved function/class/ associated with this fiber.
    type: any;

    // The local state associated with this fiber.
    stateNode: any;

    return: Fiber | null;

    // Singly Linked List Tree Structure.
    child: Fiber | null;
    sibling: Fiber | null;

    props: any;

    memoizedState: any;

    // A queue of state updates and callbacks.
    updateQueue: any;

    // Effect
    flags: Flags;
    deletions: Array<Fiber> | null;

    alternate: Fiber | null;
};

export type Lanes = number;
export type Lane = number;

export const TotalLanes = 31;

export const NoLanes: Lanes = /*                        */ 0b0000000000000000000000000000000;
export const NoLane: Lane = /*                          */ 0b0000000000000000000000000000000;

export const SyncHydrationLane: Lane = /*               */ 0b0000000000000000000000000000001;
export const SyncLane: Lane = /*                        */ 0b0000000000000000000000000000010;
export const SyncLaneIndex: number = 1;

export const InputContinuousHydrationLane: Lane = /*    */ 0b0000000000000000000000000000100;
export const InputContinuousLane: Lane = /*             */ 0b0000000000000000000000000001000;

export const DefaultHydrationLane: Lane = /*            */ 0b0000000000000000000000000010000;
export const DefaultLane: Lane = /*                     */ 0b0000000000000000000000000100000;

export const SyncUpdateLanes: Lane =
    SyncLane | InputContinuousLane | DefaultLane;

const TransitionHydrationLane: Lane = /*                */ 0b0000000000000000000000001000000;
const TransitionLanes: Lanes = /*                       */ 0b0000000001111111111111110000000;
const TransitionLane1: Lane = /*                        */ 0b0000000000000000000000010000000;
const TransitionLane2: Lane = /*                        */ 0b0000000000000000000000100000000;
const TransitionLane3: Lane = /*                        */ 0b0000000000000000000001000000000;
const TransitionLane4: Lane = /*                        */ 0b0000000000000000000010000000000;
const TransitionLane5: Lane = /*                        */ 0b0000000000000000000100000000000;
const TransitionLane6: Lane = /*                        */ 0b0000000000000000001000000000000;
const TransitionLane7: Lane = /*                        */ 0b0000000000000000010000000000000;
const TransitionLane8: Lane = /*                        */ 0b0000000000000000100000000000000;
const TransitionLane9: Lane = /*                        */ 0b0000000000000001000000000000000;
const TransitionLane10: Lane = /*                       */ 0b0000000000000010000000000000000;
const TransitionLane11: Lane = /*                       */ 0b0000000000000100000000000000000;
const TransitionLane12: Lane = /*                       */ 0b0000000000001000000000000000000;
const TransitionLane13: Lane = /*                       */ 0b0000000000010000000000000000000;
const TransitionLane14: Lane = /*                       */ 0b0000000000100000000000000000000;
const TransitionLane15: Lane = /*                       */ 0b0000000001000000000000000000000;

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
export const IndeterminateComponent = 2;
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

// Don't change these values. They're used by React Dev Tools.
export const NoFlags = /*                      */ 0b0000000000000000000000000000;
export const PerformedWork = /*                */ 0b0000000000000000000000000001;
export const Placement = /*                    */ 0b0000000000000000000000000010;
export const DidCapture = /*                   */ 0b0000000000000000000010000000;
export const Hydrating = /*                    */ 0b0000000000000001000000000000;

// You can change the rest (and add more).
export const Update = /*                       */ 0b0000000000000000000000000100;
export const Cloned = /*                       */ 0b0000000000000000000000001000;

export const ChildDeletion = /*                */ 0b0000000000000000000000010000;
export const ContentReset = /*                 */ 0b0000000000000000000000100000;
export const Callback = /*                     */ 0b0000000000000000000001000000;
/* Used by DidCapture:                            0b0000000000000000000010000000; */

export const ForceClientRender = /*            */ 0b0000000000000000000100000000;
export const Ref = /*                          */ 0b0000000000000000001000000000;
export const Snapshot = /*                     */ 0b0000000000000000010000000000;
export const Passive = /*                      */ 0b0000000000000000100000000000;

export type Update<State> = {
    lane: Lane;

    tag: 0 | 1 | 2 | 3;
    payload: any;
    callback: (() => any) | null;

    next: Update<State> | null;
};

export const UpdateState = 0;
export const ReplaceState = 1;
export const ForceUpdate = 2;
export const CaptureUpdate = 3;

export type SharedQueue<State> = {
    pending: Update<State> | null;
    lanes: Lanes;
    hiddenCallbacks: Array<() => any> | null;
};

export type ConcurrentUpdate = {
    next: ConcurrentUpdate;
    lane: Lane;
};

export type ConcurrentQueue = {
    pending: ConcurrentUpdate | null;
};

export type RootExitStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Static tags describe aspects of a fiber that are not specific to a render,
// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
// This enables us to defer more work in the unmount case,
// since we can defer traversing the tree during layout to look for Passive effects,
// and instead rely on the static flag as a signal that there may be cleanup work.
export const RefStatic = /*                    */ 0b0000001000000000000000000000;
export const LayoutStatic = /*                 */ 0b0000010000000000000000000000;
export const PassiveStatic = /*                */ 0b0000100000000000000000000000;
export const MaySuspendCommit = /*             */ 0b0001000000000000000000000000;

export const StaticMask =
    LayoutStatic | PassiveStatic | RefStatic | MaySuspendCommit;

export type RootState = {
    element: any;
    isDehydrated: boolean;
    cache: Cache;
};

export const REACT_ELEMENT_TYPE: symbol = Symbol.for('react.element');
export const REACT_FRAGMENT_TYPE: symbol = Symbol.for('react.fragment');

export type UseStateHook = {
    state: any;
    queue: [];
};

export type Effect = {
    tag: HookFlags;
    create: () => (() => void) | void;
    destroy: () => (() => void) | void;
    deps: Array<any>;
};

export type HookFlags = number;

export const HookNoFlags = /*   */ 0b0000;

// Represents whether effect should fire.
export const HookHasEffect = /* */ 0b0001;

// Represents the phase in which the effect (not the clean-up) fires.
export const HookInsertion = /* */ 0b0010;
export const HookLayout = /*    */ 0b0100;
export const HookPassive = /*   */ 0b1000;
