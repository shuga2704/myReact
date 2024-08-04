import myReact from 'myReact';
/** @jsx myReact.createElement */

function App() {
    const [count, setCount] = myReact.useState(0);

    return (
        <div className="app">
            <button onClick={() => setCount(count + 1)}>increment</button>
            Counter: {count}
        </div>
    );
}

export default App;
