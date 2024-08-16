"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldSetTextContent = shouldSetTextContent;
function shouldSetTextContent(type, props) {
    return (typeof props.children === 'string' || typeof props.children === 'number');
}
