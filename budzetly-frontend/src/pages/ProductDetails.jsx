import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
const API_URL = import.meta.env.VITE_API_URL;
function ProductDetails({ location, setLocation }) {

    const navigate = useNavigate();
    const routerLocation = useLocation();

    const product = routerLocation.state?.product;

    const [quantity, setQuantity] = useState(1);

    // ==========================================
    // PRODUCT NOT FOUND
    // ==========================================

    if (!product) {

        return (
            <>
                <MainNavbar
                    location={location}
                    setLocation={setLocation}
                />

                <div className="product-not-found">

                    <div className="product-not-found-card">

                        <div className="product-not-found-icon">
                            🍽️
                        </div>

                        <h2>
                            Food not found
                        </h2>

                        <p>
                            This food listing may no longer
                            be available.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            Back to Home
                        </button>

                    </div>

                </div>
            </>
        );
    }


    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    const increaseQuantity = () => {

        if (
            quantity <
            product.availableQuantity
        ) {

            setQuantity(quantity + 1);
        }
    };


    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(quantity - 1);
        }
    };


    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = () => {

        const existingCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        const existingProduct =
            existingCart.find(
                item =>
                    item.id === product.id
            );


        let updatedCart;


        if (existingProduct) {

            updatedCart =
                existingCart.map(item => {

                    if (
                        item.id === product.id
                    ) {

                        return {
                            ...item,

                            quantity:
                                Math.min(
                                    item.quantity +
                                    quantity,

                                    product.availableQuantity
                                )
                        };
                    }

                    return item;
                });

        } else {

            updatedCart = [

                ...existingCart,

                {
                    id: product.id,

                    name: product.name,

                    description:
                        product.description,

                    price: product.price,

                    imageUrl:
                        product.imageUrl,

                    location:
                        product.location,

                    availableQuantity:
                        product.availableQuantity,

                    quantity: quantity
                }
            ];
        }


        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );


        // Go directly to cart
        navigate("/cart");
    };


    // ==========================================
    // TOTAL
    // ==========================================

    const total =
        product.price * quantity;


    return (
        <>

            {/* =================================
                NAVBAR
            ================================= */}

            <MainNavbar
                location={location}
                setLocation={setLocation}
            />


            {/* =================================
                PRODUCT DETAILS PAGE
            ================================= */}

            <div className="product-details-page">

                <div className="product-details-container">


                    {/* BACK BUTTON */}

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Back
                    </button>


                    {/* PRODUCT CARD */}

                    <div className="product-details-card">


                        {/* =========================
                            IMAGE
                        ========================= */}

                        <div className="product-details-image">

                            <img
                                src={
                                    `${API_URL}${product.imageUrl}`
                                }
                                alt={product.name}
                            />


                            <span>
                                📍 {product.location}
                            </span>

                        </div>


                        {/* =========================
                            DETAILS
                        ========================= */}

                        <div className="product-details-content">


                            <span className="food-label">
                                FOOD NEAR YOU
                            </span>


                            <h1>
                                {product.name}
                            </h1>


                            <p className="product-description">
                                {product.description}
                            </p>


                            {/* PRICE */}

                            <div className="product-price">

                                <strong>
                                    ₹{product.price}
                                </strong>

                                <span>
                                    {product.availableQuantity}
                                    {" "}available
                                </span>

                            </div>


                            {/* QUANTITY */}

                            <div className="quantity-section">

                                <span>
                                    Quantity
                                </span>


                                <div className="quantity-control">

                                    <button
                                        type="button"
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <= 1
                                        }
                                    >
                                        −
                                    </button>


                                    <strong>
                                        {quantity}
                                    </strong>


                                    <button
                                        type="button"
                                        onClick={
                                            increaseQuantity
                                        }
                                        disabled={
                                            quantity >=
                                            product.availableQuantity
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                            </div>


                            {/* TOTAL */}

                            <div className="details-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{total}
                                </strong>

                            </div>


                            {/* ADD TO CART */}

                            <button
                                className="add-cart-main"
                                onClick={addToCart}
                                disabled={
                                    product.availableQuantity <= 0
                                }
                            >

                                {product.availableQuantity <= 0
                                    ? "Currently Unavailable"
                                    : "Add to Cart"
                                }

                            </button>


                            {/* DELIVERY INFO */}

                            <div className="product-trust-info">

                                <div>
                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        Fresh food from a
                                        nearby seller
                                    </p>
                                </div>


                                <div>
                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        Cash on Delivery
                                        available
                                    </p>
                                </div>


                                <div>
                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        Delivery location:
                                        {product.location}
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}

export default ProductDetails;