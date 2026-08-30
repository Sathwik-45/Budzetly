import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

function Cart({ location, setLocation }) {

    const navigate = useNavigate();

    const [cart, setCart] = useState([]);

    const [address, setAddress] = useState("");

    const [placingOrder, setPlacingOrder] =
        useState(false);

    const [orderMessage, setOrderMessage] =
        useState("");


    // ==========================================
    // LOAD CART
    // ==========================================

    useEffect(() => {

        loadCart();

    }, []);


    const loadCart = () => {

        console.log("=================================");
        console.log("🛒 LOADING CART");
        console.log("=================================");

        const savedCart =
            localStorage.getItem("cart");

        console.log(
            "🛒 Raw localStorage cart:",
            savedCart
        );


        if (!savedCart) {

            console.log(
                "❌ CART DOES NOT EXIST IN LOCAL STORAGE"
            );

            setCart([]);

            return;
        }


        try {

            const parsedCart =
                JSON.parse(savedCart);

            console.log(
                "✅ Parsed cart:",
                parsedCart
            );


            if (!Array.isArray(parsedCart)) {

                console.error(
                    "❌ Cart data is not an array"
                );

                setCart([]);

                return;
            }


            const validCart =
                parsedCart.filter(item => {

                    return (
                        item &&
                        item.id !== undefined &&
                        item.name &&
                        item.price !== undefined
                    );

                });


            console.log(
                "✅ Valid cart items:",
                validCart
            );


            setCart(validCart);

        } catch (error) {

            console.error(
                "❌ Failed to parse cart:",
                error
            );

            localStorage.removeItem("cart");

            setCart([]);
        }
    };


    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    const updateQuantity = (
        productId,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }


        const updatedCart =
            cart.map(item => {

                if (
                    item.id === productId
                ) {

                    return {

                        ...item,

                        quantity:
                            Math.min(
                                newQuantity,
                                item.availableQuantity
                            )
                    };
                }

                return item;
            });


        setCart(updatedCart);


        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );


        console.log(
            "🛒 Cart updated:",
            updatedCart
        );
    };


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    const removeItem = (productId) => {

        const updatedCart =
            cart.filter(
                item =>
                    item.id !== productId
            );


        setCart(updatedCart);


        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );


        console.log(
            "🗑️ Product removed:",
            productId
        );
    };


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    const totalItems =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );


    // ==========================================
    // TOTAL PRICE
    // ==========================================

    const totalAmount =
        cart.reduce(
            (total, item) =>
                total +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );


    // ==========================================
    // PLACE ORDER
    // ==========================================

    const placeOrder = async () => {

        if (!address.trim()) {

            alert(
                "Please enter your delivery address."
            );

            return;
        }


        if (cart.length === 0) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;
        }


        try {

            setPlacingOrder(true);

            setOrderMessage("");


            const requestData = {

                deliveryAddress:
                    address.trim(),

                paymentMethod:
                    "CASH_ON_DELIVERY",

                items:
                    cart.map(item => ({

                        productId:
                            item.id,

                        quantity:
                            Number(item.quantity)

                    }))
            };


            console.log(
                "🔥 Sending order:",
                requestData
            );


            const response =
                await axios.post(

                    "http://localhost:8080/api/orders",

                    requestData,

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
                "✅ Order created:",
                response.data
            );


            // ==================================
            // CLEAR CART ONLY AFTER SUCCESS
            // ==================================

            localStorage.removeItem(
                "cart"
            );

            setCart([]);


            setOrderMessage(
                "Order placed successfully!"
            );


            setTimeout(() => {

                navigate("/home");

            }, 1200);


        } catch (error) {

            console.error(
                "❌ Failed to place order:",
                error
            );


            console.error(
                "Status:",
                error.response?.status
            );


            console.error(
                "Response:",
                error.response?.data
            );


            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "Your login session has expired. Please login again."
                );


                localStorage.removeItem(
                    "token"
                );


                localStorage.removeItem(
                    "user"
                );


                navigate("/login");

            } else {

                alert(
                    error.response?.data ||
                    "Unable to place order."
                );
            }


        } finally {

            setPlacingOrder(false);
        }
    };


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cart.length === 0) {

        return (

            <>

                <MainNavbar
                    location={location}
                    setLocation={setLocation}
                />


                <div className="cart-page">

                    <div className="empty-cart">

                        <div className="empty-cart-icon">
                            🛒
                        </div>


                        <h1>
                            Your cart is empty
                        </h1>


                        <p>
                            Find something delicious
                            near you.
                        </p>


                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            Explore Food
                        </button>

                    </div>

                </div>

            </>

        );
    }


    // ==========================================
    // CART
    // ==========================================

    return (

        <>

            <MainNavbar
                location={location}
                setLocation={setLocation}
            />


            <div className="cart-page">

                <div className="cart-container">


                    {/* =================================
                        HEADER
                    ================================= */}

                    <div className="cart-heading">

                        <div>

                            <span>
                                YOUR ORDER
                            </span>

                            <h1>
                                Your Cart
                            </h1>

                            <small>

                                {totalItems}

                                {" "}

                                {totalItems === 1
                                    ? "item"
                                    : "items"}

                            </small>

                        </div>


                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            ← Continue Shopping
                        </button>

                    </div>


                    {/* =================================
                        CART LAYOUT
                    ================================= */}

                    <div className="cart-layout">


                        {/* =================================
                            CART ITEMS
                        ================================= */}

                        <section className="cart-items">

                            {cart.map(item => (

                                <div
                                    className="cart-item"
                                    key={item.id}
                                >


                                    {/* IMAGE */}

                                    <img
                                        src={
                                            `http://localhost:8080${item.imageUrl}`
                                        }
                                        alt={item.name}
                                        onError={(e) => {

                                            e.currentTarget.style.display =
                                                "none";

                                        }}
                                    />


                                    {/* INFO */}

                                    <div className="cart-item-info">

                                        <div>

                                            <h3>
                                                {item.name}
                                            </h3>


                                            <p>
                                                📍 {item.location}
                                            </p>

                                        </div>


                                        <strong>
                                            ₹{item.price}
                                        </strong>


                                        <div className="cart-item-bottom">


                                            {/* QUANTITY */}

                                            <div className="quantity-control">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    −
                                                </button>


                                                <span>
                                                    {item.quantity}
                                                </span>


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity >=
                                                        item.availableQuantity
                                                    }
                                                >
                                                    +
                                                </button>

                                            </div>


                                            {/* ITEM TOTAL */}

                                            <strong className="cart-item-total">

                                                ₹
                                                {Number(item.price) *
                                                    Number(item.quantity)}

                                            </strong>


                                            {/* REMOVE */}

                                            <button
                                                className="remove-item"
                                                onClick={() =>
                                                    removeItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </section>


                        {/* =================================
                            CHECKOUT
                        ================================= */}

                        <aside className="checkout-card">

                            <h2>
                                Checkout
                            </h2>


                            {/* ADDRESS */}

                            <div className="checkout-field">

                                <label>
                                    Delivery Address
                                </label>


                                <textarea
                                    placeholder="Enter your complete delivery address..."
                                    value={address}
                                    onChange={
                                        e =>
                                            setAddress(
                                                e.target.value
                                            )
                                    }
                                />

                            </div>


                            {/* PAYMENT */}

                            <div className="payment-method">

                                <span>
                                    Payment
                                </span>


                                <div>

                                    <strong>
                                        💵 Cash on Delivery
                                    </strong>

                                    <small>
                                        Pay when your food arrives
                                    </small>

                                </div>

                            </div>


                            {/* ORDER ITEMS */}

                            <div className="checkout-summary">

                                <div>

                                    <span>
                                        Items
                                    </span>

                                    <strong>
                                        {totalItems}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹{totalAmount}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Delivery
                                    </span>

                                    <strong>
                                        Free
                                    </strong>

                                </div>

                            </div>


                            {/* TOTAL */}

                            <div className="checkout-total">

                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹{totalAmount}
                                </strong>

                            </div>


                            {/* SUCCESS */}

                            {orderMessage && (

                                <div className="order-success">

                                    ✓ {orderMessage}

                                </div>

                            )}


                            {/* PLACE ORDER */}

                            <button
                                className="place-order-button"
                                onClick={placeOrder}
                                disabled={placingOrder}
                            >

                                {placingOrder

                                    ? "Placing Order..."

                                    : "Place Order — COD"

                                }

                            </button>


                            <p className="checkout-note">
                                Your order will be confirmed
                                after you place it.
                            </p>

                        </aside>

                    </div>

                </div>

            </div>

        </>

    );
}

export default Cart;