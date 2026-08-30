import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/nobglogo.png";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/api/auth/login", {
                email,
                password
            });

            console.log(response.data);

            // Get token and user
            const { token, user } = response.data;

            // Store them
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Go to home only after successful login
            navigate("/home");

        } catch (error) {

            console.error(error);

            alert("Invalid email or password");

        }
    };

    return (
        <>
            <Navbar />

            <div className="login-page">

                <div className="logo">
                    <img
                        src={logo}
                        alt="Login Background"
                        className="login-background"
                    />
                </div>

                <h1>Login Page</h1>

                <div className="login-form">

                    <form onSubmit={handleLogin}>

                        <label htmlFor="email">
                            Email:
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label htmlFor="password">
                            Password:
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                        <p>
                            NOT YET REGISTERED?
                            <Link to="/register"> Sign Up here</Link>
                        </p>

                    </form>

                </div>
            </div>
        </>
    );
}

export default Login;