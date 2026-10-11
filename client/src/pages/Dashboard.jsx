import { useEffect, useState } from "react";
import Donations from "../components/Donations";
import Bookmarks from "../components/Bookmarks";
import Loading from "../components/Loading";

function Dashboard() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({});
    const [viewDonations, setViewDonations] = useState(false);
    const [viewBookmarks, setViewBookmarks] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    //get the user details from the server
    async function getUserInfo() {
        const userInfoUrl = `${API_URL}/api/users/getUserProfile`;

        setLoading(true);
        await fetch(userInfoUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) => {
                setUser(result.data);
                setLoading(false);
                console.log(result);
            })
            .catch((error) => console.error(error));
    }

    async function getTotalContribution() {
        const reqUrl = `${API_URL}/api/users/getTotalDonation`;

        setLoading(true);
        await fetch(reqUrl, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((result) =>{
                console.log(result.data);
                setTotalAmount((result.data.totalDonation/100).toFixed(2));
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        getUserInfo();
        getTotalContribution();
    }, []);

    if(loading) return <div className="loading"><Loading /></div>
    return (
        <div className="dashboard">
            <div className="user-card">
                <div className="user-image">
                    <img src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}&backgroundColor=7e8ab8`} alt="User Image" />
                </div>
                <div className="user-info">
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                    <p>Contribution so far: ₹{totalAmount}</p>
                    <div className="user-buttons">
                        <button
                            onClick={() => {
                                setViewDonations((prevValue) => !prevValue);
                                setViewBookmarks(false);
                            }}
                        >
                            Recent Donations
                        </button>
                        <button
                            onClick={() => {
                                setViewBookmarks((prevValue) => !prevValue);
                                setViewDonations(false);
                            }}
                        >
                            Saved Charities
                        </button>
                    </div>
                    {(viewDonations || viewBookmarks) && (
                        <div className="view-container">
                            {viewDonations && <Donations />}
                            {viewBookmarks && <Bookmarks />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
