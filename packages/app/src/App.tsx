import myReact, { useEffect, useState } from 'myReact';
/** @jsx myReact.createElement */

function getRandomRgb() {
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

const UserItem = ({ item, setData, index }: any) => {
    const handleDelete = (index: number) => {
        setData((prev) => prev.filter((n, i) => i !== index));
    };

    return (
        <li style="display: flex; gap: 30px; margin: 10px 0;">
            <button onClick={() => handleDelete(index)}>Delete</button>

            <div>{item.name}</div>

            <a href={`mailto:${item.email}`}>{item.email}</a>
        </li>
    );
};

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json) => {
                setData(json);
                setIsLoading(false);
            });
    }, []);

    const handleAddUser = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const name = formData.get('name');
        const email = formData.get('email');

        setData((prev) => [...prev, { name, email }]);
    };

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (data.length === 0) {
        return <h2>No data</h2>;
    }

    return (
        <div
            style={`display: flex; background: ${getRandomRgb()}; padding: 20px`}
        >
            <form
                action=""
                id="form"
                onSubmit={handleAddUser}
                style="background: yellow; padding: 20px;"
            >
                <label htmlFor="fname">Name:</label>
                <br />
                <input type="text" id="name" name="name" />
                <br />
                <br />
                <label htmlFor="lname">Email:</label>
                <br />
                <input type="text" id="email" name="email" />
                <br />
                <br />
                <button type="submit">Add user</button>
            </form>

            <ul>
                {data.map((item, index) => (
                    <UserItem item={item} setData={setData} index={index} />
                ))}
            </ul>
        </div>
    );
}

export default App;
