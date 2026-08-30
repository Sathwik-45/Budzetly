import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FoodImage from "../assets/mainhome-bg.png";

function Mainhome({ location }) {

    const navigate = useNavigate();

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    const [nearbyProducts, setNearbyProducts] =
        useState([]);

    const [productsLoading, setProductsLoading] =
        useState(true);


    const loadNearbyProducts = async () => {

        try {

            setProductsLoading(true);

            const response =
                await axios.get(
                    "http://localhost:8080/api/products"
                );

            const allProducts =
                response.data;


            if (!location) {

                setNearbyProducts(
                    allProducts
                );

                return;
            }


            const currentLocation =
                location
                    .toLowerCase()
                    .trim();


            const filteredProducts =
                allProducts.filter(
                    product => {

                        if (!product.location) {
                            return false;
                        }


                        const productLocation =
                            product.location
                                .toLowerCase()
                                .trim();


                        return (
                            productLocation.includes(
                                currentLocation
                            )
                            ||
                            currentLocation.includes(
                                productLocation
                            )
                        );
                    }
                );


            setNearbyProducts(
                filteredProducts
            );


        } catch (error) {

            console.error(
                "❌ Failed to load products:",
                error
            );

        } finally {

            setProductsLoading(false);
        }
    };


    useEffect(() => {

        loadNearbyProducts();

    }, [location]);


    return (

        <main className="mainhome">

            <section className="food-hero">


                {/* =================================================
                    HERO CONTENT
                ================================================= */}

                <div className="home-hero-content">


                    {/* LEFT SIDE */}

                    <div className="home-hero-left">

                        <div className="home-welcome">

                            <span>
                                WELCOME BACK
                            </span>

                            <h2>
                                {user?.name}
                            </h2>

                        </div>


                        <h1>

                            Great Food.

                            <span className="highlight">
                                {" "}Better Prices.
                            </span>

                        </h1>


                        <p>
                            Discover affordable food from
                            people around you.
                        </p>


                        <div className="food-search">

                           

                            <input
                                type="text"
                                placeholder="Search for biryani, pizza, burgers..."
                            />

                            <button>
                                Search
                            </button>

                        </div>

                    </div>


                    {/* RIGHT SIDE IMAGE */}

                    <div className="home-hero-image">

                        <img
                            src={FoodImage}
                            alt="People enjoying Budzetly food"
                        />

                    </div>

                </div>


                {/* =================================================
                    NEARBY FOOD
                ================================================= */}

                <section className="home-food-section">


                    <div className="home-food-heading">

                        <div>

                            <span>
                                NEAR YOU
                            </span>

                            <h2>
                                Food around{" "}
                                {location || "you"}
                            </h2>

                        </div>

                        <p>
                            Fresh food. Better prices.
                        </p>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {productsLoading ? (

                        <div className="food-skeleton-grid">

                            {[1, 2, 3].map(
                                number => (

                                    <div
                                        className="food-skeleton"
                                        key={number}
                                    >

                                        <div className="skeleton-image" />

                                        <div className="skeleton-line large" />

                                        <div className="skeleton-line" />

                                        <div className="skeleton-line small" />

                                    </div>

                                )
                            )}

                        </div>


                    ) : nearbyProducts.length === 0 ? (


                        /* =================================================
                            EMPTY
                        ================================================= */

                        <div className="no-nearby-products">

                            <div>
                                🍽️
                            </div>

                            <h3>
                                Nothing nearby yet
                            </h3>

                            <p>
                                New food listings will
                                appear here when people
                                add food in your area.
                            </p>

                        </div>


                    ) : (


                        /* =================================================
                            PRODUCTS
                        ================================================= */

                        <div className="home-product-grid">

                            {nearbyProducts.map(
                                product => (

                                    <article
                                        className="home-product-card"
                                        key={product.id}
                                        onClick={() =>
                                            navigate(
                                                "/product-details",
                                                {
                                                    state: {
                                                        product
                                                    }
                                                }
                                            )
                                        }
                                    >


                                        {/* PRODUCT IMAGE */}

                                        <div className="home-product-image">

                                            <img
                                                src={
                                                    `http://localhost:8080${product.imageUrl}`
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />


                                            <span>

                                                📍{" "}
                                                {product.location}

                                            </span>

                                        </div>


                                        {/* PRODUCT INFORMATION */}

                                        <div className="home-product-info">

                                            <h3>
                                                {product.name}
                                            </h3>


                                            <p>
                                                {product.description}
                                            </p>


                                            <div className="home-product-footer">

                                                <div>

                                                    <strong>
                                                        ₹
                                                        {product.price}
                                                    </strong>

                                                    <small>
                                                        {product.availableQuantity}
                                                        {" "}available
                                                    </small>

                                                </div>


                                                <button
                                                    onClick={(e) => {

                                                        e.stopPropagation();

                                                        navigate(
                                                            "/product-details",
                                                            {
                                                                state: {
                                                                    product
                                                                }
                                                            }
                                                        );

                                                    }}
                                                >

                                                    View →

                                                </button>

                                            </div>

                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}

                </section>

            </section>

        </main>
    );
}

export default Mainhome;