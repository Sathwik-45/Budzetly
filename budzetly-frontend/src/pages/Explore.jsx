import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

function Explore({ location, setLocation }) {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [locationFilter, setLocationFilter] = useState("All");


    // =========================================================
    // LOAD ALL PRODUCTS
    // =========================================================

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    "http://localhost:8080/api/products"
                );

                console.log(
                    "🔥 Explore products:",
                    response.data
                );

                setProducts(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "❌ Failed to load products:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        loadProducts();

    }, []);

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
            `http://localhost:8080/api/orders/${orderId}/status`,
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


        // Immediately update UI

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
    // =========================================================
    // GET LOCATIONS FOR FILTER
    // =========================================================

    const locations = useMemo(() => {

        const uniqueLocations = [
            ...new Set(
                products
                    .map(product => product.location)
                    .filter(Boolean)
            )
        ];

        return uniqueLocations;

    }, [products]);


    // =========================================================
    // FILTER + SEARCH + SORT
    // =========================================================

    const filteredProducts = useMemo(() => {

        let result = [...products];


        // SEARCH

        if (search.trim()) {

            const searchText =
                search.toLowerCase().trim();

            result = result.filter(product => {

                return (
                    product.name
                        ?.toLowerCase()
                        .includes(searchText)
                    ||
                    product.description
                        ?.toLowerCase()
                        .includes(searchText)
                    ||
                    product.location
                        ?.toLowerCase()
                        .includes(searchText)
                );

            });
        }


        // LOCATION FILTER

        if (locationFilter !== "All") {

            result = result.filter(product =>
                product.location
                    ?.toLowerCase()
                    .trim()
                    ===
                locationFilter
                    .toLowerCase()
                    .trim()
            );
        }


        // SORT

        if (sortBy === "price-low") {

            result.sort(
                (a, b) =>
                    Number(a.price) -
                    Number(b.price)
            );
        }

        if (sortBy === "price-high") {

            result.sort(
                (a, b) =>
                    Number(b.price) -
                    Number(a.price)
            );
        }

        if (sortBy === "name") {

            result.sort(
                (a, b) =>
                    (a.name || "")
                        .localeCompare(
                            b.name || ""
                        )
            );
        }


        return result;

    }, [
        products,
        search,
        sortBy,
        locationFilter
    ]);


    // =========================================================
    // PRODUCT CLICK
    // =========================================================

    const openProduct = (product) => {

        navigate(
            "/product-details",
            {
                state: {
                    product
                }
            }
        );
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <>
            <MainNavbar
                location={location}
                setLocation={setLocation}
            />


            <main className="explore-page">

                <div className="explore-container">


                    {/* HEADER */}

                    <section className="explore-header">

                        <div>

                            <span className="explore-label">
                                DISCOVER FOOD
                            </span>

                            <h1>
                                Explore All Food
                            </h1>

                            <p>
                                Discover food from
                                sellers across Budzetly.
                            </p>

                        </div>

                    </section>


                    {/* SEARCH */}

                    <section className="explore-controls">

                        <div className="explore-search">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search biryani, pizza, snacks..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* LOCATION */}

                        <select
                            value={locationFilter}
                            onChange={(e) =>
                                setLocationFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="All">
                                All locations
                            </option>

                            {locations.map(
                                place => (

                                    <option
                                        key={place}
                                        value={place}
                                    >
                                        {place}
                                    </option>

                                )
                            )}

                        </select>


                        {/* SORT */}

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                        >

                            <option value="default">
                                Sort by
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="name">
                                Name
                            </option>

                        </select>

                    </section>


                    {/* RESULT COUNT */}

                    <div className="explore-results-bar">

                        <strong>
                            {filteredProducts.length}
                            {" "}
                            {filteredProducts.length === 1
                                ? "food"
                                : "foods"}
                        </strong>

                        <span>
                            available
                        </span>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <div className="explore-loading">

                            <div className="explore-spinner">
                            </div>

                            <p>
                                Loading food...
                            </p>

                        </div>

                    )}


                    {/* NO PRODUCTS */}

                    {!loading &&
                        filteredProducts.length === 0 && (

                            <div className="explore-empty">

                                <div>
                                    🔎
                                </div>

                                <h2>
                                    No food found
                                </h2>

                                <p>
                                    Try a different
                                    search or filter.
                                </p>

                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setLocationFilter("All");
                                        setSortBy("default");
                                    }}
                                >
                                    Clear Filters
                                </button>

                            </div>

                        )}


                    {/* PRODUCT GRID */}

                    {!loading &&
                        filteredProducts.length > 0 && (

                            <section className="explore-grid">

                                {filteredProducts.map(
                                    product => (

                                        <article
                                            className="explore-product-card"
                                            key={product.id}
                                            onClick={() =>
                                                openProduct(
                                                    product
                                                )
                                            }
                                        >

                                            {/* IMAGE */}

                                            <div className="explore-product-image">

                                                {product.imageUrl ? (

                                                    <img
                                                        src={
                                                            product.imageUrl.startsWith(
                                                                "http"
                                                            )
                                                                ? product.imageUrl
                                                                : `http://localhost:8080${product.imageUrl}`
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                    />

                                                ) : (

                                                    <div className="explore-no-image">
                                                        🍴
                                                    </div>

                                                )}

                                                <span className="explore-location">

                                                    📍
                                                    {" "}
                                                    {product.location}

                                                </span>

                                            </div>


                                            {/* CONTENT */}

                                            <div className="explore-product-content">

                                                <div className="explore-product-top">

                                                    <h2>
                                                        {product.name}
                                                    </h2>

                                                    <strong>
                                                        ₹
                                                        {product.price}
                                                    </strong>

                                                </div>


                                                <p>
                                                    {product.description}
                                                </p>


                                                <div className="explore-product-bottom">

                                                    <span>
                                                        {product.availableQuantity}
                                                        {" "}
                                                        available
                                                    </span>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            openProduct(
                                                                product
                                                            );
                                                        }}
                                                    >
                                                        View Food →
                                                    </button>

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}

                            </section>

                        )}

                </div>

            </main>
        </>
    );
}

export default Explore;