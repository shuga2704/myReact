"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const myReact_1 = __importDefault(require("myReact"));
/** @jsx myReact.createElement */
function App() {
    const [count, setCount] = myReact_1.default.useState(0);
    return (<div className="app">
            <button onClick={() => setCount(count + 1)}>increment</button>
            Counter: {count}
        </div>);
}
exports.default = App;
