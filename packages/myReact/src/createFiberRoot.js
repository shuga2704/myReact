"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHostRootFiber = createHostRootFiber;
exports.createFiberRoot = createFiberRoot;
const createFiber_1 = require("./createFiber");
const types_1 = require("./types");
function createHostRootFiber() {
    return (0, createFiber_1.createFiber)(types_1.HostRoot, null, null, types_1.NoMode);
}
class FiberRootNode {
    constructor(containerInfo) {
        this.containerInfo = containerInfo;
        this.current = null;
    }
}
function createFiberRoot(containerInfo) {
    const fiberRoot = new FiberRootNode(containerInfo);
    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    const uninitializedFiber = createHostRootFiber();
    fiberRoot.current = uninitializedFiber;
    uninitializedFiber.stateNode = fiberRoot;
    return fiberRoot;
}
