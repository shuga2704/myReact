"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoot = createRoot;
const createFiberRoot_1 = require("./createFiberRoot");
const ReactDOMRoot_1 = require("./ReactDOMRoot");
function createRoot(container) {
    const root = (0, createFiberRoot_1.createFiberRoot)(container);
    return new ReactDOMRoot_1.ReactDOMRoot(root);
}
