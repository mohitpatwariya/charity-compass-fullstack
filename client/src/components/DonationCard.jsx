import { useState, useEffect } from "react";
import CharityCard from "./CharityCard";

function DonationCard({ donation }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [charity, setCharity] = useState({});
    const [expandCharity, setExpandCharity] = useState(false);

    async function getCharityById() {
        const reqUrl = `${API_URL}/api/charity/getCharityById/${donation.charity}`;
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
                setCharity(result.data);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getCharityById();
    }, []);

    return (
        <div className="donation-card">
            <h2>
                Amount: {(donation.amount/100).toFixed(2)} <span>for </span>
                {charity.name}
            </h2>
            <p>Payment ID: {donation.paymentId}</p>
            <p>Date: {donation.date}</p>
            <p>Payment Method: {donation.paymentMethod}</p>
            <button onClick={() => setExpandCharity((prevValue) => !prevValue)}>
                view {expandCharity ? "less" : "more"}
            </button>
            <div className="donation-charity">
                {expandCharity && <CharityCard charity={charity} />}
            </div>
        </div>
    );
}

export default DonationCard;
