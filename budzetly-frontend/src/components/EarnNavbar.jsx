import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState } from "react";

function EarnNavbar() {

    const navigate = useNavigate();

    const [showMobileMenu, setShowMobileMenu] =
        useState(false);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    const closeMobileMenu = () => {
        setShowMobileMenu(false);
    };


    return (

        <nav className="earn-navbar">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
                to="/earn"
                className="earn-navbar-brand"
                onClick={closeMobileMenu}
            >

                <div className="earn-navbar-logo">

                    <img
                        src={logo}
                        alt="Budzetly"
                    />

                </div>

                <span>
                    BUDZET<span>LY</span>
                </span>

            </Link>


            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="earn-navbar-links">

                <Link to="/earn">
                    Dashboard
                </Link>

                <Link to="/earn/orders">
                    Orders
                </Link>

            </div>


            {/* =================================================
                DESKTOP RIGHT
            ================================================= */}

            <div className="earn-navbar-right">

                <Link
                    to="/home"
                    className="earn-navbar-profile"
                >
                    Home
                </Link>

                <button
                    className="earn-navbar-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>


            {/* =================================================
                MOBILE HAMBURGER
            ================================================= */}

            <button
                className="earn-mobile-menu-button"
                onClick={() =>
                    setShowMobileMenu(!showMobileMenu)
                }
                aria-label="Open menu"
            >

                {showMobileMenu ? "✕" : "☰"}

            </button>


            {/* =================================================
                MOBILE MENU
            ================================================= */}

            {showMobileMenu && (

                <div className="earn-mobile-nav-menu">

                    <Link
                        to="/earn"
                        onClick={closeMobileMenu}
                    >
                        Dashboard
                    </Link>


                    <Link
                        to="/earn/orders"
                        onClick={closeMobileMenu}
                    >
                        Orders
                    </Link>


                    <Link
                        to="/home"
                        onClick={closeMobileMenu}
                    >
                        Home
                    </Link>


                    <button
                        onClick={() => {
                            closeMobileMenu();
                            handleLogout();
                        }}
                    >
                        Logout
                    </button>

                </div>

            )}

        </nav>
    );
}

export default EarnNavbar;