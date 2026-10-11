import { useState } from "react";
import { BsBookmark, BsBookmarkCheckFill } from "react-icons/bs";
import Payment from "./Payment";

function CharityCard({ charity }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [expand, setExpand] = useState(false);
    const [bookmark, setBookmark] = useState(charity.bookmarked);
    // const [category, setCategory] = useState('');

    async function updateBookmark() {
        const reqUrl = `${API_URL}/api/users/updateBookmark`;
        await fetch(reqUrl, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ charityId: charity._id }),
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                setBookmark((prevValue) => !prevValue);
            });
    }

    return (
        <div className="charity-card">
            <div className="charity-header">
                <h2>{charity.name}</h2>
                <span>{charity.category.name}</span>
                <div className="charity-button-group">
                    <button onClick={() => setExpand((prev) => !prev)}>
                        { expand ? '-' : '+'}
                    </button>
                    {bookmark ? (
                        <BsBookmarkCheckFill
                            onClick={updateBookmark}
                            className="icon-bookmark"
                        />
                    ) : (
                        <BsBookmark
                            onClick={updateBookmark}
                            className="icon-bookmark"
                        />
                    )}
                </div>
            </div>
            {expand && (
                <div className="charity-info">
                    <p>Location: {(charity.address.state).toUpperCase()}</p>
                    <p>{charity.description}</p>
                    <a href={charity.website}>Official website</a>
                    <Payment charityId={charity._id} />
                </div>
            )}
        </div>
    );
}

export default CharityCard;
