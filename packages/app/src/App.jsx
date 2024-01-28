import myReact from 'myReact'
/** @jsx myReact.createElement */

function App() {
    const [state, setState] = myReact.useState(1);

    return (
        <div>
            <h1>
                Count: {state}
            </h1>

            <button onClick={() => setState(c => c + 1)}> increment< /button>
        </div>
    )
}

export default App

