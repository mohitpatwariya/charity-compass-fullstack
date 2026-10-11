import { useState, useEffect } from "react";
import DonationCard from "./DonationCard";
import Loading from "./Loading";

function Donations() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(false);

    async function fetchDonations() {
        const reqUrl = `${API_URL}/api/users/getDonations`;

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
                setDonations(result.data);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        fetchDonations();
    }, []);

    if(loading) return <Loading />
    return (
        <div className="donations">
            <h1>Recent Contributions</h1>
            {donations.map((donation) => (
                <DonationCard key={donation._id} donation={donation} />
            ))}
        </div>
    );
}

export default Donations;
