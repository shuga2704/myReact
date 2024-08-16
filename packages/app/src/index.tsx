import myReact from 'myReact';
/** @jsx myReact.createElement */

// import App from './App';

const container = document.getElementById('root');

const root = myReact.createRoot(container as any);

const ChildComponent = ({ value }: any) => {
    return <h2>Child {value}</h2>;
};

const Component = () => {
    const [value, setValue] = myReact.useState(5);
    const [value2, setValue2] = myReact.useState(5);

    const handleClick = () => {
        setValue((prev: any) => prev + 1);
        // setValue2(value2 - 1);
    };

    return (
        <div>
            <button onClick={handleClick}>{value}</button>
            <span>{value}</span>
            <ChildComponent value={value} />
        </div>
    );
};

root.render((<Component />) as any);

// const rootElement = document.getElementById('root');
// myReact.render(<App />, rootElement);
