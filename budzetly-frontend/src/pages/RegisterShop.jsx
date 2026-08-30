import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterShop() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        businessName: "",
        description: "",
        location: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };


    // ==========================================
    // GET CURRENT LOCATION
    // ==========================================

    const getCurrentLocation = () => {

        if (!navigator.geolocation) {

            setError(
                "Geolocation is not supported by your browser."
            );

            return;
        }

        console.log("📍 Getting current location...");

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

                    /*
                     * Use the same Nominatim API that
                     * already works in your MainNavbar.
                     *
                     * We are NOT using:
                     *
                     * localhost:8080/reverse-geocode
                     *
                     * because that endpoint was giving
                     * you 403.
                     */

                    const response = await fetch(
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
                        "📍 Location response:",
                        data
                    );


                    const address =
                        data.address || {};


                    const locationName =
                        address.suburb ||
                        address.neighbourhood ||
                        address.city ||
                        address.town ||
                        address.village ||
                        address.county;


                    console.log(
                        "📍 Detected location:",
                        locationName
                    );


                    if (locationName) {

                        setFormData(
                            (previousData) => ({
                                ...previousData,
                                location: locationName
                            })
                        );

                        setError("");

                    } else {

                        setError(
                            "Could not determine your location."
                        );
                    }

                } catch (error) {

                    console.error(
                        "❌ Error fetching location:",
                        error
                    );

                    setError(
                        "Unable to detect your location."
                    );
                }
            },


            (error) => {

                console.error(
                    "❌ Location permission error:",
                    error
                );


                if (error.code === 1) {

                    setError(
                        "Location permission was denied. Please allow location access."
                    );

                } else if (error.code === 2) {

                    setError(
                        "Your location could not be determined."
                    );

                } else if (error.code === 3) {

                    setError(
                        "Location request timed out."
                    );

                } else {

                    setError(
                        "Unable to get your current location."
                    );
                }
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };


    // ==========================================
    // REGISTER FOR EARN
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "You must be logged in to register for Earn."
                );

                setLoading(false);

                return;
            }


            console.log(
                "📤 Sending Earn registration:",
                formData
            );


            const response = await axios.post(

                "http://localhost:8080/api/earn/register",

                {
                    businessName:
                        formData.businessName,

                    description:
                        formData.description,

                    location:
                        formData.location
                },

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            console.log(
                "✅ Earn registration successful:",
                response.data
            );


            /*
             * Registration is complete.
             *
             * Do NOT show the registration form again.
             *
             * Go to /earn.
             *
             * Earn.jsx will call:
             *
             * GET /api/earn/me
             *
             * and show the dashboard because the
             * user now has an EarnProfile.
             */

            navigate("/earn");

        } catch (error) {

            console.error(
                "❌ Earn registration failed:",
                error
            );


            console.log(
                "Status:",
                error.response?.status
            );


            console.log(
                "Response:",
                error.response?.data
            );


            if (error.response?.status === 403) {

                setError(
                    "You are not authorized. Please login again."
                );

            } else if (error.response?.status === 409) {

                /*
                 * This can happen if the user is already
                 * registered.
                 *
                 * In that situation, simply send them
                 * to their dashboard.
                 */

                navigate("/earn");

            } else {

                setError(
                    error.response?.data ||
                    "Registration failed. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="register-shop-page">

            <div className="register-shop-container">


                {/* ======================================
                    HEADER
                ====================================== */}

                <div className="register-shop-header">

                    <h1>
                        Start Earning with Budzetly
                    </h1>

                    <p>
                        Share your food with nearby customers
                        and earn money from every sale.
                    </p>

                </div>


                {/* ======================================
                    ERROR MESSAGE
                ====================================== */}

                {error && (

                    <div className="register-error">

                        {error}

                    </div>

                )}


                {/* ======================================
                    FORM
                ====================================== */}

                <form
                    className="shop-form"
                    onSubmit={handleSubmit}
                >


                    {/* ==================================
                        BUSINESS INFORMATION
                    ================================== */}

                    <h2>
                        Business Information
                    </h2>


                    <div className="form-group">

                        <label>
                            Business / Shop Name *
                        </label>

                        <input
                            type="text"
                            name="businessName"
                            placeholder="Eg: Sathwik Foods"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description *
                        </label>

                        <textarea
                            name="description"
                            placeholder="Tell customers about your food"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* ==================================
                        LOCATION
                    ================================== */}

                    <div className="shop-location-section">

                        <h2>
                            📍 Your Location
                        </h2>

                        <p>
                            Your location helps nearby
                            customers discover your food.
                        </p>


                        <button
                            type="button"
                            className="detect-shop-location"
                            onClick={getCurrentLocation}
                        >

                            📍 Use My Current Location

                        </button>


                        <div className="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                placeholder="Click 'Use My Current Location'"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* ==================================
                        SUBMIT
                    ================================== */}

                    <button
                        type="submit"
                        className="register-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Registering..."
                            : "Register & Start Earning"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default RegisterShop;