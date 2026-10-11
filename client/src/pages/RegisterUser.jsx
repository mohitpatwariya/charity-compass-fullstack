import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import Verify from "../components/Verify";
import Loading from "../components/Loading";

function RegisterUser() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: null,
    });

    const [viewPassword, setViewPassword] = useState(false);
    const [viewOtp, setViewOtp] = useState(false);

    function changeHandler(event) {
        // console.log(formData);
        setFormData((prevData) => {
            return {
                ...prevData,
                [event.target.name]:
                    event.target.type === "file"
                        ? event.target.files[0]
                        : event.target.value,
            };
        });
    }

    async function sendOtp(event) {
        event.preventDefault();
        const reqUrl = `${API_URL}/api/otp/sendOtp`;

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(reqUrl, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: formData.email }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success(result.message);
                setTimeout(() => setViewOtp(true), 1000);
            } else {
                toast.error(result.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Unable to reach server. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (viewOtp) return <Verify formData={formData} setViewOtp={setViewOtp} />;
    if(loading) return <div className="loading"><Loading /></div>
    return (
        <div className="register-user">
            <form onSubmit={sendOtp} className="register-form">
                <h1>Register</h1>
                <div>
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            required
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email ID"
                            required
                            onChange={changeHandler}
                        />
                    </div>
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Create Password"
                            required
                            onChange={changeHandler}
                        />
                    </div>
                    <div className="pass">
                        <input
                            name="confirmPassword"
                            type={viewPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            onChange={changeHandler}
                        />
                        <div
                            onClick={() => {
                                setViewPassword((prevValue) => !prevValue);
                            }}
                        >
                            {!viewPassword ? (
                                <FaEye className="eye" />
                            ) : (
                                <FaEyeSlash className="eye" />
                            )}
                        </div>
                    </div>
                </div>
                <button type="submit">Register</button>
                <div>
                    Don't have an account?{" "}
                    <NavLink to="/loginUser">Login</NavLink>
                </div>
            </form>
            <Toaster position="top-center" />
        </div>
    );
}

export default RegisterUser;
