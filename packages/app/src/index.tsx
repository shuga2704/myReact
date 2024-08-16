import myReact from 'myReact';
/** @jsx myReact.createElement */

// import App from './App';

const container = document.getElementById('root');

const root = myReact.createRoot(container as any);

const Component = () => {
    const [value, setValue] = myReact.useState(5);
    const [value2, setValue2] = myReact.useState(5);

    const handleClick = () => {
        setValue((prev: any) => prev + 1);
        // setValue2(value2 - 1);
    };

    console.log(value, value2);

    return (
        <div>
            {/*<h1 onas={value}>{value}</h1>*/}
            {/*<input*/}
            {/*    value={value}*/}
            {/*    // onChange={(e) => setValue(String(performance.now()))}*/}
            {/*/>*/}
            <button onClick={handleClick}>{value}</button>
            {/*<span>{value}</span>*/}
            {/*<button id="btn">click</button>*/}
        </div>
    );
};

root.render((<Component />) as any);

// const rootElement = document.getElementById('root');
// myReact.render(<App />, rootElement);
