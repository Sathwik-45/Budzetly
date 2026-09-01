import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/nobglogo.png";
import Navbar from "../components/Navbar";
import api from "../api/Axios";
import Toast from "../components/Toast";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState(null);


    const showToast = (message, type) => {

        setToast({
            message,
            type
        });

    };


    const hideToast = () => {

        setToast(null);

    };


    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        // ==========================================
        // LOGIN START
        // ==========================================

        showToast(
            "Logging in...",
            "loading"
        );


        try {

            const response =
                await api.post(
                    "/api/auth/login",
                    {
                        email,
                        password
                    }
                );


            console.log(
                "✅ Login response:",
                response.data
            );


            // ==========================================
            // GET TOKEN AND USER
            // ==========================================

            const {
                token,
                user
            } = response.data;


            // ==========================================
            // STORE TOKEN AND USER
            // ==========================================

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // ==========================================
            // SUCCESS TOAST
            // ==========================================

            showToast(
                "Login successful",
                "success"
            );


            // ==========================================
            // SMALL DELAY SO USER CAN SEE TOAST
            // ==========================================

            setTimeout(() => {

                navigate("/home");

            }, 800);


        } catch (error) {

            console.error(
                "❌ Login error:",
                error
            );


            // ==========================================
            // ERROR TOAST
            // ==========================================

            showToast(
                "Invalid email or password",
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
                    Login Page
                </h1>


                {/* ==========================================
                    LOGIN FORM
                ========================================== */}

                <div className="login-form">

                    <form
                        onSubmit={handleLogin}
                    >


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


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>


                        {/* SIGN UP */}

                        <p>

                            NOT YET REGISTERED?

                            <Link to="/register">
                                {" "}Sign Up here
                            </Link>

                        </p>


                    </form>

                </div>

            </div>

        </>

    );

}

export default Login;