import RegisterUser from "./pages/RegisterUser.jsx";
import { Routes, Route } from "react-router-dom";
import LoginUser from "./pages/LoginUser.jsx";
import Home from "./pages/Home.jsx";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Charities from "./pages/Charities.jsx";
import Loading from "./components/Loading.jsx";

function App() {
    const API_URL = import.meta.env.VITE_API_URL;
    const loginCheckUrl = `${API_URL}/api/users/getLoginStatus`;
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    async function updateLoginStatus() {
        setLoading(true);
        try {
            const response = await fetch(loginCheckUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            setLoading(false);
            setLoggedIn(result.data?.isLoggedIn);
        } catch (error) {
            setLoggedIn(false);
        }
    }
    useEffect(() => {
        updateLoginStatus();
    }, []);

    //instead user state should be taken from the server
    if(loading) return <div className="loading"><Loading /></div>
    return (
            <Routes>
                <Route exact path="/" element={<Home loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                <Route exact path="/loginUser" element={<LoginUser loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                <Route exact path="/registerUser" element={<RegisterUser loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                <Route exact path="/dashboard" element={<Dashboard />}/>
                <Route exact path="/charities" element={<Charities />}/>
            </Routes>
    );
}

export default App;
