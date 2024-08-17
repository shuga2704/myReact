import myReact, { useState, useEffect } from 'myReact';
/** @jsx myReact.createElement */

// import App from './App';

const container = document.getElementById('root');

const root = myReact.createRoot(container as any);

const ChildComponent = ({ value }: any) => {
    useEffect(() => {
        console.log('useeffect child');
    }, []);

    return <h2>Child {value}</h2>;
};

const App = () => {
    const [value, setValue] = useState(5);
    const [value2, setValue2] = useState(5);

    const handleClick = () => {
        setValue((prev: any) => prev + 1);
        // setValue2(value2 - 1);
    };

    useEffect(() => {
        console.log('useeffect root');
    }, [value]);

    return (
        <div>
            <button onClick={handleClick}>{value}</button>
            <span>{value}</span>
            <ChildComponent value={value} />
        </div>
    );
};

root.render((<App />) as any);
