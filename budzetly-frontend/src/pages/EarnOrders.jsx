import { useEffect, useState } from "react";
import axios from "axios";
import EarnNavbar from "../components/EarnNavbar";
const API_URL = import.meta.env.VITE_API_URL;
function EarnOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const updateOrderStatus = async (
    orderId,
    newStatus
) => {

    const token =
        localStorage.getItem("token");

    try {

        console.log(
            "🔥 Updating order:",
            orderId,
            newStatus
        );

        await axios.put(
            `${API_URL}/api/orders/${orderId}/status`,
            null,
            {
                params: {
                    status: newStatus
                },
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        console.log(
            "✅ Order status updated"
        );

        setOrders(previousOrders =>
            previousOrders.map(order => {

                if (order.id === orderId) {

                    return {
                        ...order,
                        status: newStatus
                    };
                }

                return order;
            })
        );

    } catch (error) {

        console.error(
            "❌ Failed to update order status:",
            error
        );

        alert(
            error.response?.data ||
            "Failed to update order status"
        );
    }
};

    const loadOrders = async () => {

        const token =
            localStorage.getItem("token");

        try {

            setLoading(true);
            setError("");

            console.log(
                "🔥 Loading earner orders..."
            );

            const response =
                await axios.get(
                    `${API_URL}/api/orders/earner`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            console.log(
                "✅ Earner orders:",
                response.data
            );


            setOrders(
                response.data
            );


        } catch (error) {

            console.error(
                "❌ Failed to load earner orders:",
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


            setError(
                error.response?.data ||
                "Unable to load orders"
            );


        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadOrders();

    }, []);


    return (
        <>

            <EarnNavbar />


            <main className="earner-orders-page">

                <div className="earner-orders-container">


                    {/* =========================================
                        HEADER
                    ========================================= */}

                    <div className="earner-orders-header">

                        <div>

                            <span className="earner-orders-label">
                                EARNER DASHBOARD
                            </span>

                            <h1>
                                Orders
                            </h1>

                            <p>
                                Orders received for your
                                products.
                            </p>

                        </div>


                        <div className="earner-orders-count">

                            <strong>
                                {orders.length}
                            </strong>

                            <span>
                                Orders
                            </span>

                        </div>

                    </div>


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {error && (

                        <div className="earner-orders-error">

                            {error}

                        </div>

                    )}


                    {/* =========================================
                        LOADING
                    ========================================= */}

                    {loading ? (

                        <div className="earner-orders-loading">

                            <div className="earner-orders-spinner">
                            </div>

                            <p>
                                Loading orders...
                            </p>

                        </div>


                    ) : orders.length === 0 ? (


                        /* =====================================
                           EMPTY
                        ===================================== */

                        <div className="earner-orders-empty">

                            <div className="earner-empty-icon">
                                📦
                            </div>

                            <h2>
                                No orders yet
                            </h2>

                            <p>
                                When customers order your
                                products, their orders will
                                appear here.
                            </p>

                        </div>


                    ) : (


                        /* =====================================
                           ORDERS
                        ===================================== */

                        <div className="earner-orders-list">

                            {orders.map(order => (

                                <article
                                    className="earner-order-card"
                                    key={order.id}
                                >


                                    {/* ORDER HEADER */}

                                    <div className="earner-order-header">

                                        <div>

                                            <span>
                                                ORDER
                                            </span>

                                            <h2>
                                                #{order.id}
                                            </h2>

                                        </div>


                                        <span
                                            className={
                                                `earner-order-status ${
                                                    (
                                                        order.status ||
                                                        ""
                                                    ).toLowerCase()
                                                }`
                                            }
                                        >
                                            {order.status}
                                        </span>

                                    </div>


                                    {/* =================================
                                        ORDER ITEMS
                                    ================================= */}

                                    <div className="earner-order-items">

                                        {order.items?.map(
                                            item => (

                                                <div
                                                    className="earner-order-item"
                                                    key={item.id}
                                                >


                                                    <div className="earner-order-item-image">

                                                        {item.imageUrl ? (

                                                            <img
                                                                src={
                                                                    `${API_URL}${item.imageUrl}`
                                                                }
                                                                alt={
                                                                    item.productName
                                                                }
                                                            />

                                                        ) : (

                                                            <span>
                                                                🍴
                                                            </span>

                                                        )}

                                                    </div>


                                                    <div className="earner-order-item-info">

                                                        <h3>
                                                            {
                                                                item.productName
                                                            }
                                                        </h3>

                                                        <p>
                                                            Quantity:
                                                            {" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                    </div>


                                                    <strong>
                                                        ₹
                                                        {
                                                            item.priceAtPurchase
                                                        }
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>


                                    {/* =================================
                                        CUSTOMER DETAILS
                                    ================================= */}

                                    <div className="earner-customer-section">


                                        <div className="earner-detail">

                                            <span>
                                                CUSTOMER
                                            </span>

                                            <strong>
                                                Customer
                                            </strong>

                                            <p>
                                                Order #{order.id}
                                            </p>

                                        </div>


                                        <div className="earner-detail">

                                            <span>
                                                DELIVERY ADDRESS
                                            </span>

                                            <strong>
                                                {
                                                    order.deliveryAddress
                                                }
                                            </strong>

                                        </div>


                                        <div className="earner-detail">

                                            <span>
                                                PAYMENT
                                            </span>

                                            <strong>
                                                💵{" "}
                                                {
                                                    order.paymentMethod
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================
                                        FOOTER
                                    ================================= */}

                                    {/* =================================
    FOOTER
================================= */}

<div className="earner-order-footer">

    <div>

        <span>
            ORDER TOTAL
        </span>

        <strong>
            ₹{order.totalAmount}
        </strong>

    </div>


    <div>

        <span>
            ORDER DATE
        </span>

        <strong>
            {
                order.createdAt
                    ? new Date(
                        order.createdAt
                    ).toLocaleString()
                    : "-"
            }
        </strong>

    </div>

</div>


{/* =================================
    ORDER ACTION
================================= */}

<div className="earner-order-actions">

    {order.status === "PLACED" && (

        <button
            onClick={() =>
                updateOrderStatus(
                    order.id,
                    "CONFIRMED"
                )
            }
        >
            Confirm Order
        </button>

    )}


    {order.status === "CONFIRMED" && (

        <button
            onClick={() =>
                updateOrderStatus(
                    order.id,
                    "PREPARING"
                )
            }
        >
            Start Preparing
        </button>

    )}


    {order.status === "PREPARING" && (

        <button
            onClick={() =>
                updateOrderStatus(
                    order.id,
                    "DISPATCHED"
                )
            }
        >
            Mark Dispatched
        </button>

    )}


    {order.status === "DISPATCHED" && (

        <button
            onClick={() =>
                updateOrderStatus(
                    order.id,
                    "DELIVERED"
                )
            }
        >
            Mark Delivered
        </button>

    )}

</div>

                                </article>

                            ))}

                        </div>

                    )}

                </div>

            </main>

        </>
    );
}

export default EarnOrders;