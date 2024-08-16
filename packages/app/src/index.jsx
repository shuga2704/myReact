"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myReact_1 = __importDefault(require("myReact"));
/** @jsx myReact.createElement */
console.log('myReact', myReact_1.default);
// import App from './App';
const container = document.getElementById('root');
const root = myReact_1.default.createRoot(container);
root.render((<h1>Title</h1>));
// const rootElement = document.getElementById('root');
// myReact.render(<App />, rootElement);
