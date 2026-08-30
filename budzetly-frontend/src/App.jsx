import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import EarnOrders from "./pages/EarnOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Mainhome from "./pages/Mainhome";
import MainNavbar from "./components/MainNavbar";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import { useState } from "react";
import Earn from "./pages/Earn";
import RegisterShop from "./pages/RegisterShop";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";

function App() {

    const [location, setLocation] =
        useState("Detecting...");

    return (

        <>

            <Routes>

                {/* =========================
                    PUBLIC PAGES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    CUSTOMER HOME
                ========================= */}

                <Route
                    path="/home"
                    element={
                        <>
                            <MainNavbar
                                location={location}
                                setLocation={setLocation}
                            />

                            <Mainhome
                                location={location}
                            />
                        </>
                    }
                />


                {/* =========================
                    EARNER DASHBOARD
                    NO MainNavbar HERE
                    Earn.jsx renders EarnNavbar
                ========================= */}

                <Route
                    path="/earn"
                    element={
                        <Earn
                            location={location}
                        />
                    }
                />


                {/* =========================
                    REGISTER SHOP
                ========================= */}

                <Route
                    path="/register-shop"
                    element={
                        <>
                            <MainNavbar
                                location={location}
                                setLocation={setLocation}
                            />

                            <RegisterShop
                                location={location}
                            />
                        </>
                    }
                />


                {/* =========================
                    PROFILE
                ========================= */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />


                {/* =========================
                    PRODUCT DETAILS
                ========================= */}

                <Route
                    path="/product-details"
                    element={
                        <ProductDetails />
                    }
                />


                {/* =========================
                    MY ORDERS
                ========================= */}

                <Route
                    path="/my-orders"
                    element={
                        <MyOrders
                            location={location}
                            setLocation={setLocation}
                        />
                    }
                />


                {/* =========================
                    EXPLORE
                ========================= */}

                <Route
                    path="/explore"
                    element={
                        <Explore />
                    }
                />
 <Route
                    path="/earn/orders"
                    element={
                        <EarnOrders />
                    }
                />

                {/* =========================
                    CART
                ========================= */}

                <Route
                    path="/cart"
                    element={
                        <Cart />
                    }
                />

            </Routes>

        </>

    );
}

export default App;