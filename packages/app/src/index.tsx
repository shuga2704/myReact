import myReact from 'myReact';
/** @jsx myReact.createElement */

import App from './App';

const container = document.getElementById('root')!;

const root = myReact.createRoot(container);

root.render(<App />);
