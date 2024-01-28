import myReact from 'myReact';
/** @jsx myReact.createElement */

export const element = myReact.createElement("div", {
  style: "background: salmon"
}, myReact.createElement("h1", null, "Hello World"), myReact.createElement("h2", {
  style: "text-align:right"
}, "from Didact"));