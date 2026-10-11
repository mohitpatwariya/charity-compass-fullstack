import { useEffect, useState } from "react";

function CharityFilter({ category, setCategory }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [categories, setCategories] = useState([]);

    async function getAllCategories() {
        const reqUrl = `${API_URL}/api/category/getAllCategories`;
        await fetch(reqUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) => setCategories(result.data))
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getAllCategories();
    }, []);

    function filterHandler(event) {
        setCategory(event.target.value);
    }

    return (
        <div className="charity-filter">
            {categories.map((cat) => (
                <label key={cat._id}>
                    <input
                        type="radio"
                        value={cat.name}
                        name="category"
                        onChange={filterHandler}
                        checked = {cat.name === category}
                    />
                    {cat.name}
                </label>
            ))}
            <button onClick={() => setCategory('')}>CLEAR FILTERS</button>
        </div>
    );
}

export default CharityFilter;
