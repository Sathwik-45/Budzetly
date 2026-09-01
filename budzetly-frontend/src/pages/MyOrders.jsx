import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";
const API_URL = import.meta.env.VITE_API_URL;
function MyOrders({ location, setLocation }) {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        loadOrders();
    }, []);


    const loadOrders = async () => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            console.log("🔥 Loading my orders");

            const response = await axios.get(
                `${API_URL}/api/orders/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "🔥 Orders response:",
                response.data
            );

            if (Array.isArray(response.data)) {

                console.log(
                    "✅ Number of orders:",
                    response.data.length
                );

                setOrders(response.data);

            } else {

                console.error(
                    "❌ Expected array but received:",
                    response.data
                );

                setOrders([]);
            }

        } catch (err) {

            console.error(
                "❌ Failed to load orders:",
                err
            );

            console.error(
                "Status:",
                err.response?.status
            );

            console.error(
                "Response:",
                err.response?.data
            );

            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");

                return;
            }

            setError(
                "Unable to load your orders."
            );

        } finally {

            setLoading(false);
        }
    };


    if (loading) {

        return (
            <>
                <MainNavbar
                    location={location}
                    setLocation={setLocation}
                />

                <main className="orders-page">

                    <div className="orders-loading">

                        <div className="orders-loading-spinner">
                        </div>

                        <h2>
                            Loading your orders...
                        </h2>

                    </div>

                </main>
            </>
        );
    }


    return (
        <>
            <MainNavbar
                location={location}
                setLocation={setLocation}
            />

            <main className="orders-page">

                <div className="orders-container">


                    {/* HEADER */}

                    <div className="orders-header">

                        <div>

                            <span>
                                ORDER HISTORY
                            </span>

                            <h1>
                                My Orders
                            </h1>

                            <p>
                                Track your food orders
                                from Budzetly.
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            ← Continue Shopping
                        </button>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="orders-error">

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={loadOrders}
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* NO ORDERS */}

                    {!error && orders.length === 0 && (

                        <div className="no-orders">

                            <div className="no-orders-icon">
                                🛍
                            </div>

                            <h2>
                                No orders yet
                            </h2>

                            <p>
                                Once you place an order,
                                it will appear here.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/home")
                                }
                            >
                                Explore Food
                            </button>

                        </div>

                    )}


                    {/* ORDERS */}

                    {!error && orders.length > 0 && (

                        <div className="orders-list">

                            {orders.map((order) => (

                                <div
                                    className="order-card"
                                    key={order.id}
                                >


                                    {/* ORDER HEADER */}

                                    <div className="order-card-header">

                                        <div>

                                            <span>
                                                ORDER
                                            </span>

                                            <h2>
                                                #{order.id}
                                            </h2>

                                        </div>


                                        <div className="order-status">

                                            {order.status ||
                                                "PLACED"}

                                        </div>

                                    </div>


                                    {/* ORDER INFORMATION */}

                                    <div className="order-meta">

                                        <div>

                                            <span>
                                                Ordered
                                            </span>

                                            <strong>
                                                {order.createdAt
                                                    ? new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()
                                                    : "Recently"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Payment
                                            </span>

                                            <strong>
                                                Cash on Delivery
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Delivery
                                            </span>

                                            <strong>
                                                {order.deliveryAddress}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ITEMS */}

                                    <div className="order-items">

                                        {Array.isArray(order.items) &&
                                            order.items.map(
                                                (item, index) => {

                                                    const itemName =
                                                        item.productName ||
                                                        item.name ||
                                                        item.product?.name ||
                                                        "Food Item";


                                                    const price =
                                                        item.priceAtPurchase ??
                                                        item.price ??
                                                        item.product?.price ??
                                                        0;


                                                    const quantity =
                                                        item.quantity ?? 1;


                                                    return (

                                                        <div
                                                            className="order-item"
                                                            key={
                                                                item.id ||
                                                                index
                                                            }
                                                        >

                                                            <div className="order-item-image">

                                                                {item.product?.imageUrl ||
                                                                item.imageUrl ? (

                                                                    <img
                                                                        src={
                                                                            (
                                                                                item.product?.imageUrl ||
                                                                                item.imageUrl
                                                                            ).startsWith(
                                                                                "http"
                                                                            )
                                                                                ? (
                                                                                    item.product?.imageUrl ||
                                                                                    item.imageUrl
                                                                                )
                                                                                : `${API_URL}${
                                                                                    item.product?.imageUrl ||
                                                                                    item.imageUrl
                                                                                }`
                                                                        }
                                                                        alt={itemName}
                                                                    />

                                                                ) : (

                                                                    <div>
                                                                        🍴
                                                                    </div>

                                                                )}

                                                            </div>


                                                            <div className="order-item-info">

                                                                <h3>
                                                                    {itemName}
                                                                </h3>

                                                                <p>
                                                                    ₹{price}
                                                                    {" × "}
                                                                    {quantity}
                                                                </p>

                                                            </div>


                                                            <strong>
                                                                ₹
                                                                {Number(price) *
                                                                    Number(quantity)}
                                                            </strong>

                                                        </div>

                                                    );
                                                }
                                            )}

                                    </div>


                                    {/* TOTAL */}

                                    <div className="order-card-footer">

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {order.totalAmount ?? 0}
                                        </strong>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>
        </>
    );
}

export default MyOrders;