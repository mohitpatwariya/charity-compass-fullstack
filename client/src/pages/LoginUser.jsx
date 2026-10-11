import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Loading from "../components/Loading";

function LoginUser({ setLoggedIn }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [viewPassword, setViewPassword] = useState(false);

    function changeHandler(event) {
        // console.log(formData);
        setFormData((prevData) => {
            return {
                ...prevData,
                [event.target.name]:
                    event.target.type === "checkbox"
                        ? event.target.checked
                        : event.target.value,
            };
        });
    }

    async function submitHandler(event) {
        //make a post request to register user
        event.preventDefault();
        setLoading(true);
        
        try {
            //make api call to backend for login
            const loginUrl = `${API_URL}/api/users/login`;
            const response = await fetch(loginUrl, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            setLoading(false);
            console.log(result);

            //toast the message and navigate
            if (result.success) {
                setLoading(false);
                setLoggedIn(true);
                toast.success(result.message || "User logged in successfully");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                toast.error(result.message.trim() || "Something went wrong");
            }
        } catch (error) {
            console.error(error);
        }
    }

    if(loading) return <div className="loading"><Loading /><Toaster /></div>
    return (
        <div className="login-user">
            <form onSubmit={submitHandler} className="login-form">
                <h1>Login</h1>
                <div className="form">
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email ID"
                            required
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="pass">
                        <input
                            name="password"
                            type={viewPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            onChange={changeHandler}
                        />
                        <div
                            onClick={() => {
                                setViewPassword((prevValue) => !prevValue);
                            }}
                        >
                            {!viewPassword ? <FaEye className="eye"/> : <FaEyeSlash className="eye"/>}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <input
                            type="checkbox"
                            id="user-check"
                            onChange={changeHandler}
                            value={formData.rememberMe}
                        />
                        <label htmlFor="user-check">Remember me</label>
                    </div>
                    <NavLink to="/forgotPassword">Forgot password</NavLink>
                </div>
                <button type="submit" onClick={submitHandler}>
                    Login
                </button>
                <div>
                    Don't have an account?{" "}
                    <NavLink to="/registerUser">Register</NavLink>
                </div>
            </form>
            <Toaster position="top-center"/>
        </div>
    );
}

export default LoginUser;
