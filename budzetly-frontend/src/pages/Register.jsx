import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/nobglogo.png";
import Navbar from "../components/Navbar";
import api from "../api/Axios";
import Toast from "../components/Toast";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState(null);


    // ==========================================
    // SHOW TOAST
    // ==========================================

    const showToast = (message, type) => {

        setToast({
            message,
            type
        });

    };


    // ==========================================
    // REGISTER
    // ==========================================

    const handleRegister = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (password !== confirmPassword) {

            showToast(
                "Passwords do not match",
                "error"
            );

            return;
        }


        setLoading(true);


        // ==========================================
        // REGISTERING TOAST
        // ==========================================

        showToast(
            "Creating your account...",
            "loading"
        );


        try {

            const response =
                await api.post(
                    "/api/auth/register",
                    {
                        name,
                        email,
                        password,
                        phone
                    }
                );


            console.log(
                "✅ Registration response:",
                response.data
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            showToast(
                "Registration successful!",
                "success"
            );


            // Clear form

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setPhone("");


            setLoading(false);


        } catch (error) {

            console.error(
                "❌ Registration error:",
                error
            );


            // ==========================================
            // ERROR
            // ==========================================

            showToast(
                "Registration failed",
                "error"
            );


            setLoading(false);

        }

    };


    return (

        <>

            <Navbar />


            {/* ==========================================
                TOAST
            ========================================== */}

            {toast && (

                <Toast
                    message={toast.message}
                    type={toast.type}
                />

            )}


            <div className="login-page">


                {/* ==========================================
                    LOGO
                ========================================== */}

                <div className="logo">

                    <img
                        src={logo}
                        alt="Budzetly Logo"
                        className="login-background"
                    />

                </div>


                <h1>
                    Register Here
                </h1>


                {/* ==========================================
                    REGISTER FORM
                ========================================== */}

                <div className="login-form">

                    <form
                        onSubmit={handleRegister}
                    >


                        {/* NAME */}

                        <label htmlFor="name">
                            Name:
                        </label>

                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        {/* EMAIL */}

                        <label htmlFor="email">
                            Email:
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        {/* PHONE */}

                        <label htmlFor="phone">
                            Phone:
                        </label>

                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        {/* PASSWORD */}

                        <label htmlFor="password">
                            Password:
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        {/* CONFIRM PASSWORD */}

                        <label htmlFor="confirm-password">
                            Confirm Password:
                        </label>

                        <input
                            type="password"
                            id="confirm-password"
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            required
                        />


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating account..."
                                : "Register"
                            }

                        </button>


                        {/* LOGIN */}

                        <p>

                            ALREADY REGISTERED?

                            <Link to="/login">
                                {" "}Login here
                            </Link>

                        </p>


                    </form>

                </div>

            </div>

        </>

    );

}

export default Register;