import { useState, useEffect } from "react";
import CharityCard from "./CharityCard";
import Loading from './Loading';

function Bookmarks() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [savedCharities, setSavedCharities] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getSavedCharities() {
        const reqUrl = `${API_URL}/api/users/getSavedCharities`;

        setLoading(true);
        await fetch(reqUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                setSavedCharities(result.data);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getSavedCharities();
    }, []);

    if(loading) return <Loading />
    return (
        <div className="bookmarks">
            <h1>Bookmarked Charities</h1>
            {savedCharities.map((charity) => (
                <CharityCard key={charity._id} charity={charity} />
            ))}
        </div>
    );
}

export default Bookmarks;
