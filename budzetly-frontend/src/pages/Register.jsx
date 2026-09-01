import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/nobglogo.png";
import Navbar from "../components/Navbar";
import api from "../api/Axios";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            const response = await api.post("/api/auth/register", {
                name,
                email,
                password,
                phone
            });

            console.log(response.data);

            alert("Registration successful!");

        } catch (error) {

            console.error(error);

            alert("Registration failed");

        }
    };

    return (
        <>
            <Navbar />

            <div className="login-page">

                <div className="logo">
                    <img
                        src={logo}
                        alt="Register Background"
                        className="login-background"
                    />
                </div>

                <h1>Register Here</h1>

                <div className="login-form">

                    <form onSubmit={handleRegister}>

                        <label htmlFor="name">
                            Name:
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

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

                        <label htmlFor="phone">
                            Phone:
                        </label>

                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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

                        <label htmlFor="confirm-password">
                            Confirm Password:
                        </label>

                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />

                        <button type="submit">
                            Register
                        </button>

                        <p>
                            ALREADY REGISTERED?
                            <Link to="/login"> Login here</Link>
                        </p>

                    </form>

                </div>
            </div>
        </>
    );
}

export default Register;