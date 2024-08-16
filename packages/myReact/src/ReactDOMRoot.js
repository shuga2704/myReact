"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactDOMRoot = void 0;
const updateContainer_1 = require("./updateContainer");
class ReactDOMRoot {
    constructor(internalRoot) {
        this._internalRoot = internalRoot;
    }
    render(children) {
        const root = this._internalRoot;
        (0, updateContainer_1.updateContainer)(children, root, null, null);
    }
    unmount() { }
}
exports.ReactDOMRoot = ReactDOMRoot;
