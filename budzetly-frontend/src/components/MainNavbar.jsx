import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";

function MainNavbar({ location, setLocation }) {

    const navigate = useNavigate();

    const [showLocation, setShowLocation] =
        useState(false);

    const [showMobileMenu, setShowMobileMenu] =
        useState(false);

    const [searchLocation, setSearchLocation] =
        useState("");

    const [searchResults, setSearchResults] =
        useState([]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    // ==========================================
    // CURRENT LOCATION
    // ==========================================

    const getCurrentLocation = () => {

        if (!navigator.geolocation) {

            console.log(
                "Geolocation is not supported"
            );

            return;
        }


        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                console.log(
                    "Latitude:",
                    latitude
                );

                console.log(
                    "Longitude:",
                    longitude
                );


                try {

                    const response =
                        await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
                        );


                    if (!response.ok) {

                        throw new Error(
                            `Location request failed: ${response.status}`
                        );
                    }


                    const data =
                        await response.json();


                    console.log(
                        "Location response:",
                        data
                    );


                    const address =
                        data.address || {};


                    const locationName =
                        address.suburb ||
                        address.neighbourhood ||
                        address.city ||
                        address.town ||
                        address.village;


                    console.log(
                        "Detected location:",
                        locationName
                    );


                    if (locationName) {

                        setLocation(
                            locationName
                        );

                        setShowLocation(false);
                    }

                } catch (error) {

                    console.log(
                        "Unable to find location",
                        error
                    );
                }
            },


            (error) => {

                console.log(
                    "Location permission denied",
                    error
                );
            }
        );
    };


    // ==========================================
    // DETECT LOCATION WHEN NAVBAR LOADS
    // ==========================================

    useEffect(() => {

        getCurrentLocation();

    }, []);


    // ==========================================
    // SEARCH LOCATION
    // ==========================================

    const searchPlaces = async () => {

        if (!searchLocation.trim()) {

            return;
        }


        try {

            const response =
                await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchLocation)}&format=json&addressdetails=1&limit=5`
                );


            if (!response.ok) {

                throw new Error(
                    `Location search failed: ${response.status}`
                );
            }


            const data =
                await response.json();


            console.log(
                "Search results:",
                data
            );


            setSearchResults(data);

        } catch (error) {

            console.log(
                "Unable to search location",
                error
            );
        }
    };


    // ==========================================
    // SELECT SEARCH RESULT
    // ==========================================

    const selectLocation = (place) => {

        const address =
            place.address || {};


        const selectedLocation =
            address.suburb ||
            address.neighbourhood ||
            address.city ||
            address.town ||
            address.village ||
            place.name;


        setLocation(
            selectedLocation
        );


        setShowLocation(false);

        setSearchResults([]);

        setSearchLocation("");
    };


    // ==========================================
    // CLOSE MOBILE MENU
    // ==========================================

    const closeMobileMenu = () => {

        setShowMobileMenu(false);
        setShowLocation(false);
    };


    return (

        <nav className="navbar">


            {/* =================================
                LOGO
            ================================= */}

            <Link
                to="/Mainhome"
                className="brand"
                onClick={closeMobileMenu}
            >

                <div className="logo-icon">

                    <img
                        src={logo}
                        alt="Budzetly logo"
                    />

                </div>


                <span>

                    BUDZET
                    <span className="logo-green">
                        LY
                    </span>

                </span>

            </Link>


            {/* =================================
                DESKTOP NAVIGATION
            ================================= */}

            <div className="nav-links">

                <Link to="/home">
                    Home
                </Link>

                <Link to="/explore">
                    Explore
                </Link>

                <Link to="/my-orders">
                   My-Orders
                </Link>
                <Link to="/cart">
                   Cart-Items
                </Link>

            </div>


            {/* =================================
                RIGHT SIDE
            ================================= */}

            <div className="nav-buttons">


                {/* ==============================
                    LOCATION
                ============================== */}

                <div className="nav-location">

                    <button
                        className="location-btn"
                        onClick={() =>
                            setShowLocation(
                                !showLocation
                            )
                        }
                    >

                        <span>
                            📍
                        </span>

                        <span className="location-text">
                            {location ||
                                "Detecting location..."}
                        </span>

                        <span className="location-arrow">
                            ▾
                        </span>

                    </button>


                    {/* LOCATION PANEL */}

                    {showLocation && (

                        <div className="location-panel">


                            {/* SEARCH */}

                            <div className="location-search">

                                <input
                                    type="text"
                                    placeholder="Search location..."
                                    value={
                                        searchLocation
                                    }
                                    onChange={(e) =>
                                        setSearchLocation(
                                            e.target.value
                                        )
                                    }

                                    onKeyDown={(e) => {

                                        if (
                                            e.key ===
                                            "Enter"
                                        ) {

                                            searchPlaces();
                                        }
                                    }}
                                />


                                <button
                                    onClick={
                                        searchPlaces
                                    }
                                >
                                    Search
                                </button>

                            </div>


                            {/* SEARCH RESULTS */}

                            {searchResults.length >
                                0 && (

                                <div className="location-results">

                                    {searchResults.map(
                                        (place) => (

                                            <button
                                                key={
                                                    place.place_id
                                                }

                                                onClick={() =>
                                                    selectLocation(
                                                        place
                                                    )
                                                }
                                            >

                                                <span>
                                                    📍
                                                </span>

                                                <span>
                                                    {
                                                        place.display_name
                                                    }
                                                </span>

                                            </button>
                                        )
                                    )}

                                </div>
                            )}


                            {/* CURRENT LOCATION */}

                            <button
                                className="detect-location"
                                onClick={
                                    getCurrentLocation
                                }
                            >

                                <span>
                                    ◎
                                </span>

                                Use my current location

                            </button>

                        </div>
                    )}

                </div>

                <Link
                    className="profile-btn"
                    to="/Earn"
                    onClick={closeMobileMenu}
                >
                    

                    Earn

                </Link>


                {/* ==============================
                    LOGOUT
                ============================== */}

                <button
                    className="logout-btn"
                    onClick={() => {

                        closeMobileMenu();

                        handleLogout();

                    }}
                >

                    Logout

                </button>

            </div>


            {/* =================================
                MOBILE MENU BUTTON
            ================================= */}

            <button
                className="mobile-menu-button"
                onClick={() =>
                    setShowMobileMenu(
                        !showMobileMenu
                    )
                }
                aria-label="Open menu"
            >

                {showMobileMenu
                    ? "✕"
                    : "☰"}

            </button>


            {/* =================================
                MOBILE MENU
            ================================= */}

            {showMobileMenu && (

                <div className="mobile-nav-menu">


                    <Link
                        to="/home"
                        onClick={
                            closeMobileMenu
                        }
                    >
                        Home
                    </Link>


                    <Link
                        to="/explore"
                        onClick={
                            closeMobileMenu
                        }
                    >
                        Explore
                    </Link>


                    <Link
                        to="/my-orders"
                        onClick={
                            closeMobileMenu
                        }
                    >
                        Orders
                    </Link>


                    <Link
                        to="/cart"
                        onClick={
                            closeMobileMenu
                        }
                    >
                         Cart
                    </Link>


                    <Link
                        to="/earn"
                        onClick={
                            closeMobileMenu
                        }
                    >
                        Earn
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

export default MainNavbar;