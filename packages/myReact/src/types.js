"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placement = exports.PerformedWork = exports.NoFlags = exports.NoStrictPassiveEffectsMode = exports.StrictEffectsMode = exports.StrictLegacyMode = exports.DebugTracingMode = exports.ProfileMode = exports.ConcurrentMode = exports.NoMode = exports.Throw = exports.IncompleteFunctionComponent = exports.HostSingleton = exports.HostHoistable = exports.TracingMarkerComponent = exports.CacheComponent = exports.LegacyHiddenComponent = exports.OffscreenComponent = exports.ScopeComponent = exports.SuspenseListComponent = exports.DehydratedFragment = exports.IncompleteClassComponent = exports.LazyComponent = exports.SimpleMemoComponent = exports.MemoComponent = exports.SuspenseComponent = exports.Profiler = exports.ForwardRef = exports.ContextProvider = exports.ContextConsumer = exports.Mode = exports.Fragment = exports.HostText = exports.HostComponent = exports.HostPortal = exports.HostRoot = exports.IndeterminateComponent = exports.ClassComponent = exports.FunctionComponent = exports.SyncUpdateLanes = exports.DefaultLane = exports.DefaultHydrationLane = exports.InputContinuousLane = exports.InputContinuousHydrationLane = exports.SyncLaneIndex = exports.SyncLane = exports.SyncHydrationLane = exports.NoLane = exports.NoLanes = exports.TotalLanes = void 0;
exports.REACT_FRAGMENT_TYPE = exports.REACT_ELEMENT_TYPE = exports.StaticMask = exports.MaySuspendCommit = exports.PassiveStatic = exports.LayoutStatic = exports.RefStatic = exports.CaptureUpdate = exports.ForceUpdate = exports.ReplaceState = exports.UpdateState = exports.Passive = exports.Snapshot = exports.Ref = exports.ForceClientRender = exports.Callback = exports.ContentReset = exports.ChildDeletion = exports.Cloned = exports.Update = exports.Hydrating = exports.DidCapture = void 0;
exports.TotalLanes = 31;
exports.NoLanes = 0b0000000000000000000000000000000;
exports.NoLane = 0b0000000000000000000000000000000;
exports.SyncHydrationLane = 0b0000000000000000000000000000001;
exports.SyncLane = 0b0000000000000000000000000000010;
exports.SyncLaneIndex = 1;
exports.InputContinuousHydrationLane = 0b0000000000000000000000000000100;
exports.InputContinuousLane = 0b0000000000000000000000000001000;
exports.DefaultHydrationLane = 0b0000000000000000000000000010000;
exports.DefaultLane = 0b0000000000000000000000000100000;
exports.SyncUpdateLanes = exports.SyncLane | exports.InputContinuousLane | exports.DefaultLane;
const TransitionHydrationLane = /*                */ 0b0000000000000000000000001000000;
const TransitionLanes = /*                       */ 0b0000000001111111111111110000000;
const TransitionLane1 = /*                        */ 0b0000000000000000000000010000000;
const TransitionLane2 = /*                        */ 0b0000000000000000000000100000000;
const TransitionLane3 = /*                        */ 0b0000000000000000000001000000000;
const TransitionLane4 = /*                        */ 0b0000000000000000000010000000000;
const TransitionLane5 = /*                        */ 0b0000000000000000000100000000000;
const TransitionLane6 = /*                        */ 0b0000000000000000001000000000000;
const TransitionLane7 = /*                        */ 0b0000000000000000010000000000000;
const TransitionLane8 = /*                        */ 0b0000000000000000100000000000000;
const TransitionLane9 = /*                        */ 0b0000000000000001000000000000000;
const TransitionLane10 = /*                       */ 0b0000000000000010000000000000000;
const TransitionLane11 = /*                       */ 0b0000000000000100000000000000000;
const TransitionLane12 = /*                       */ 0b0000000000001000000000000000000;
const TransitionLane13 = /*                       */ 0b0000000000010000000000000000000;
const TransitionLane14 = /*                       */ 0b0000000000100000000000000000000;
const TransitionLane15 = /*                       */ 0b0000000001000000000000000000000;
exports.FunctionComponent = 0;
exports.ClassComponent = 1;
exports.IndeterminateComponent = 2;
exports.HostRoot = 3; // Root of a host tree. Could be nested inside another node.
exports.HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
exports.HostComponent = 5;
exports.HostText = 6;
exports.Fragment = 7;
exports.Mode = 8;
exports.ContextConsumer = 9;
exports.ContextProvider = 10;
exports.ForwardRef = 11;
exports.Profiler = 12;
exports.SuspenseComponent = 13;
exports.MemoComponent = 14;
exports.SimpleMemoComponent = 15;
exports.LazyComponent = 16;
exports.IncompleteClassComponent = 17;
exports.DehydratedFragment = 18;
exports.SuspenseListComponent = 19;
exports.ScopeComponent = 21;
exports.OffscreenComponent = 22;
exports.LegacyHiddenComponent = 23;
exports.CacheComponent = 24;
exports.TracingMarkerComponent = 25;
exports.HostHoistable = 26;
exports.HostSingleton = 27;
exports.IncompleteFunctionComponent = 28;
exports.Throw = 29;
exports.NoMode = 0b0000000;
// TODO: Remove ConcurrentMode by reading from the root tag instead
exports.ConcurrentMode = 0b0000001;
exports.ProfileMode = 0b0000010;
exports.DebugTracingMode = 0b0000100;
exports.StrictLegacyMode = 0b0001000;
exports.StrictEffectsMode = 0b0010000;
exports.NoStrictPassiveEffectsMode = 0b1000000;
// Don't change these values. They're used by React Dev Tools.
exports.NoFlags = 0b0000000000000000000000000000;
exports.PerformedWork = 0b0000000000000000000000000001;
exports.Placement = 0b0000000000000000000000000010;
exports.DidCapture = 0b0000000000000000000010000000;
exports.Hydrating = 0b0000000000000001000000000000;
// You can change the rest (and add more).
exports.Update = 0b0000000000000000000000000100;
exports.Cloned = 0b0000000000000000000000001000;
exports.ChildDeletion = 0b0000000000000000000000010000;
exports.ContentReset = 0b0000000000000000000000100000;
exports.Callback = 0b0000000000000000000001000000;
/* Used by DidCapture:                            0b0000000000000000000010000000; */
exports.ForceClientRender = 0b0000000000000000000100000000;
exports.Ref = 0b0000000000000000001000000000;
exports.Snapshot = 0b0000000000000000010000000000;
exports.Passive = 0b0000000000000000100000000000;
exports.UpdateState = 0;
exports.ReplaceState = 1;
exports.ForceUpdate = 2;
exports.CaptureUpdate = 3;
// Static tags describe aspects of a fiber that are not specific to a render,
// e.g. a fiber uses a passive effect (even if there are no updates on this particular render).
// This enables us to defer more work in the unmount case,
// since we can defer traversing the tree during layout to look for Passive effects,
// and instead rely on the static flag as a signal that there may be cleanup work.
exports.RefStatic = 0b0000001000000000000000000000;
exports.LayoutStatic = 0b0000010000000000000000000000;
exports.PassiveStatic = 0b0000100000000000000000000000;
exports.MaySuspendCommit = 0b0001000000000000000000000000;
exports.StaticMask = exports.LayoutStatic | exports.PassiveStatic | exports.RefStatic | exports.MaySuspendCommit;
exports.REACT_ELEMENT_TYPE = Symbol.for('react.element');
exports.REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
