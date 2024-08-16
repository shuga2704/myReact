"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextElement = exports.createElement = void 0;
const createElement = (type, props, ...children) => {
    return {
        type,
        props: Object.assign(Object.assign({}, props), { children: children.map((child) => typeof child === 'object' ? child : (0, exports.createTextElement)(child)) }),
    };
};
exports.createElement = createElement;
const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};
exports.createTextElement = createTextElement;
