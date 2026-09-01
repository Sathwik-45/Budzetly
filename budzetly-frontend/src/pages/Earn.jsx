import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EarnNavbar from "../components/EarnNavbar";
import Toast from "../components/Toast";
const API_URL = import.meta.env.VITE_API_URL;
function Earn() {

    const token = localStorage.getItem("token");
    const showToast = (message, type) => {

    setToast({
        message,
        type
    });

};
    const [loading, setLoading] = useState(true);
    const [registered, setRegistered] = useState(false);
    const [earnProfile, setEarnProfile] = useState(null);

    const [products, setProducts] = useState([]);

    const [showAddProduct, setShowAddProduct] =
        useState(false);

    const [savingProduct, setSavingProduct] =
        useState(false);

    const [detectingLocation, setDetectingLocation] =
        useState(false);
    const [toast, setToast] = useState(null);

    // ==========================================
    // PRODUCT FORM
    // ==========================================

    const [productForm, setProductForm] = useState({

        name: "",
        description: "",
        price: "",
        availableQuantity: "",

        image: null,
        imagePreview: "",

        location: "",
        latitude: "",
        longitude: ""
    });


    // ==========================================
    // CHECK EARN PROFILE
    // ==========================================

    useEffect(() => {

        checkEarnRegistration();

    }, []);


    const checkEarnRegistration = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/earn/me`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "🔥 Earn profile:",
                response.data
            );

            setEarnProfile(response.data);
            setRegistered(true);

            // Load products after profile
            loadMyProducts();

        } catch (error) {

            console.log(
                "Earn profile status:",
                error.response?.status
            );

            if (error.response?.status === 404) {

                setRegistered(false);

            } else {

                console.error(
                    "❌ Error checking Earn profile:",
                    error
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // GET MY PRODUCTS
    // ==========================================

    const loadMyProducts = async () => {

        try {

            const response = await axios.get(
                `${API_URL}/api/products/my`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            console.log(
                "🔥 My products:",
                response.data
            );

            setProducts(response.data);

        } catch (error) {

            console.error(
                "❌ Failed to load products:",
                error
            );
        }
    };


    // ==========================================
    // PRODUCT INPUT
    // ==========================================

    const handleProductChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setProductForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // ==========================================
    // IMAGE SELECT
    // ==========================================

    const handleImageChange = (e) => {

        const file =
            e.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            showToast(
    "Please select an image file.",
    "error"
);

            return;
        }


        // Limit to 5 MB

        if (file.size > 5 * 1024 * 1024) {

           showToast(
    "Image size must be less than 5 MB.",
    "error"
);

            return;
        }


        setProductForm(prev => ({

            ...prev,

            image: file,

            imagePreview:
                URL.createObjectURL(file)

        }));
    };


    // ==========================================
    // REMOVE IMAGE
    // ==========================================

    const removeImage = () => {

        setProductForm(prev => ({

            ...prev,

            image: null,
            imagePreview: ""

        }));
    };


    // ==========================================
    // GET CURRENT LOCATION
    // ==========================================

    const getCurrentLocation = () => {

        if (!navigator.geolocation) {

            showToast(
                "Location is not supported by your browser.",
                "error"
            );

            return;
        }


        setDetectingLocation(true);


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


                    const data =
                        await response.json();


                    const address =
                        data.address || {};


                    const locationName =

                        address.suburb ||

                        address.neighbourhood ||

                        address.city_district ||

                        address.city ||

                        address.town ||

                        address.village ||

                        "Current Location";


                    console.log(
                        "Detected location:",
                        locationName
                    );


                    setProductForm(prev => ({

                        ...prev,

                        location:
                            locationName,

                        latitude:
                            latitude,

                        longitude:
                            longitude

                    }));


                } catch (error) {

                    console.error(
                        "Location lookup failed:",
                        error
                    );

                    // Still save coordinates

                    setProductForm(prev => ({

                        ...prev,

                        location:
                            "Current Location",

                        latitude:
                            latitude,

                        longitude:
                            longitude

                    }));

                } finally {

                    setDetectingLocation(false);
                }

            },

            (error) => {

                console.error(
                    "Location permission error:",
                    error
                );

                setDetectingLocation(false);

                showToast(
                    "Unable to access your current location.",
                    "error"
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };


    // ==========================================
    // OPEN PRODUCT MODAL
    // ==========================================

    const openAddProduct = () => {

        setProductForm({

            name: "",
            description: "",
            price: "",
            availableQuantity: "",

            image: null,
            imagePreview: "",

            location:
                earnProfile?.location || "",

            latitude: "",
            longitude: ""
        });


        setShowAddProduct(true);
    };


    // ==========================================
    // CLOSE PRODUCT MODAL
    // ==========================================

    const closeAddProduct = () => {

        setShowAddProduct(false);
    };


    // ==========================================
    // ADD PRODUCT
    // ==========================================

    const handleAddProduct = async (e) => {

        e.preventDefault();


        if (!productForm.name.trim()) {

            showToast(
                "Please enter a product name.",
                "error"
            );

            return;
        }


        if (!productForm.price) {

            showToast(
                "Please enter a price.",
                "error"
            );

            return;
        }


        if (!productForm.image) {

            showToast(
                "Please add a food image.",
                "error"
            );

             

            return;
        }


        if (!productForm.location.trim()) {

            showToast(
                "Please add the product location.",
                "error"
            );

            return;
        }


        try {

            setSavingProduct(true);


            const productData = {

                name:
                    productForm.name.trim(),

                description:
                    productForm.description.trim(),

                price:
                    Number(productForm.price),

                availableQuantity:
                    Number(
                        productForm.availableQuantity
                    ),

                location:
                    productForm.location,

                latitude:
                    productForm.latitude
                        ? Number(productForm.latitude)
                        : null,

                longitude:
                    productForm.longitude
                        ? Number(productForm.longitude)
                        : null
            };


            console.log(
                "🔥 Sending product:",
                productData
            );


            const formData =
                new FormData();


            formData.append(

                "product",

                new Blob(
                    [
                        JSON.stringify(
                            productData
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                )
            );


            formData.append(
                "image",
                productForm.image
            );


            const response =
                await axios.post(

                    `${API_URL}/api/products`,

                    formData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            console.log(
                "✅ Product created:",
                response.data
            );


            setProducts(prev => [

                ...prev,

                response.data

            ]);


            closeAddProduct();


            showToast(
                "Product added successfully!",
                "success"
            );


        } catch (error) {

            console.error(
                "❌ Failed to add product:",
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


            showToast(
                "Failed to add product.",
                "error"
            );

        } finally {

            setSavingProduct(false);
   
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="earn-loading">

                <div className="earn-loading-card">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your Earn dashboard...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // NOT REGISTERED
    // ==========================================

    if (!registered) {

        return (

            <div className="earn-page">

                <section className="earn-hero">

                    <div className="earn-hero-content">

                        <span className="earn-label">
                            BUDZETLY EARN
                        </span>

                        <h1>
                            Turn your food
                            <br />
                            into extra income.
                        </h1>

                        <p>
                            Have great food to offer?
                            List it on Budzetly, reach
                            nearby customers and earn
                            from every sale.
                        </p>

                        <Link
                            to="/register-shop"
                            className="register-shop-btn"
                        >
                            Start Earning
                            <span>→</span>
                        </Link>

                    </div>

                    <div className="earn-hero-side">

                        <div className="earn-stat-box">

                            <strong>
                                📍
                            </strong>

                            <div>
                                <b>
                                    Local customers
                                </b>

                                <span>
                                    Reach people nearby
                                </span>
                            </div>

                        </div>


                        <div className="earn-stat-box">

                            <strong>
                                ₹
                            </strong>

                            <div>
                                <b>
                                    Set your own price
                                </b>

                                <span>
                                    You control your products
                                </span>
                            </div>

                        </div>


                        <div className="earn-stat-box">

                            <strong>
                                +
                            </strong>

                            <div>
                                <b>
                                    Add unlimited products
                                </b>

                                <span>
                                    Showcase what you offer
                                </span>
                            </div>

                        </div>

                    </div>

                </section>


                <section className="earn-benefits">

                    <div className="benefits-heading">

                        <span>
                            WHY BUDZETLY EARN?
                        </span>

                        <h2>
                            Simple way to start selling.
                        </h2>

                    </div>


                    <div className="benefit-list">

                        <div className="benefit-card">

                            <div className="benefit-number">
                                01
                            </div>

                            <h3>
                                Add your food
                            </h3>

                            <p>
                                Upload a photo, add the
                                details and set your price.
                            </p>

                        </div>


                        <div className="benefit-card">

                            <div className="benefit-number">
                                02
                            </div>

                            <h3>
                                Reach nearby people
                            </h3>

                            <p>
                                Your products can be
                                discovered according to
                                customer location.
                            </p>

                        </div>


                        <div className="benefit-card">

                            <div className="benefit-number">
                                03
                            </div>

                            <h3>
                                Earn from sales
                            </h3>

                            <p>
                                Customers discover your
                                food and purchase from you.
                            </p>

                        </div>

                    </div>

                </section>

            </div>
        );
    }


    // ==========================================
    // REGISTERED DASHBOARD
    // ==========================================

    return (
          <div>
 {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
            />
        )}
        <EarnNavbar />

        <div className="earn-dashboard">
 

            {/* HEADER */}

            <div className="earn-dashboard-top">

                <div>

                    <span className="dashboard-label">
                        EARN DASHBOARD
                    </span>

                    <h1>
                        {earnProfile?.businessName}
                    </h1>

                    <p>
                        Manage your products and listings
                    </p>

                </div>


                <button
                    className="add-product-main-btn"
                    onClick={openAddProduct}
                >
                    <span>+</span>
                    Add Product
                </button>

            </div>


            {/* SHOP INFO */}

            <div className="shop-profile-card">

                <div className="shop-profile-mark">
                    {earnProfile?.businessName
                        ?.charAt(0)
                        ?.toUpperCase() || "B"}
                </div>


                <div className="shop-profile-content">

                    <div>

                        <span>
                            YOUR EARN PROFILE
                        </span>

                        <h2>
                            {earnProfile?.businessName}
                        </h2>

                    </div>


                    <div className="shop-location-display">

                        <span className="location-pin">
                            ●
                        </span>

                        <div>

                            <b>
                                {earnProfile?.location}
                            </b>

                            <span>
                                Business location
                            </span>

                        </div>

                    </div>

                </div>


                {earnProfile?.description && (

                    <p className="shop-description">
                        {earnProfile.description}
                    </p>

                )}

            </div>


            {/* STATISTICS */}

            <div className="dashboard-stats">

                <div className="stat-card">

                    <span>
                        PRODUCTS
                    </span>

                    <strong>
                        {products.length}
                    </strong>

                    <small>
                        Listed products
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        AVAILABLE
                    </span>

                    <strong>
                        {products.reduce(
                            (total, product) =>
                                total +
                                (product.availableQuantity || 0),
                            0
                        )}
                    </strong>

                    <small>
                        Items available
                    </small>

                </div>


                <div className="stat-card stat-card-action">

                    <span>
                        QUICK ACTION
                    </span>

                    <button
                        onClick={openAddProduct}
                    >
                        + Add new product
                    </button>

                </div>

            </div>


            {/* PRODUCTS */}

            <section className="products-section">

                <div className="products-heading">

                    <div>

                        <span>
                            YOUR LISTINGS
                        </span>

                        <h2>
                            Products
                        </h2>

                    </div>


                    {products.length > 0 && (

                        <button
                            className="small-add-btn"
                            onClick={openAddProduct}
                        >
                            + Add Product
                        </button>

                    )}

                </div>


                {products.length === 0 ? (

                    <div className="empty-products">

                        <div className="empty-product-icon">
                            +
                        </div>

                        <h3>
                            Your product list is empty
                        </h3>

                        <p>
                            Add your first food product
                            and start showcasing it to
                            nearby customers.
                        </p>

                        <button
                            onClick={openAddProduct}
                        >
                            Add your first product
                            <span>→</span>
                        </button>

                    </div>
                    

                ) : (

                    <div className="product-grid">

                        {products.map(product => (

                            <div
                                className="product-card"
                                key={product.id}
                            >

                                <div className="product-image-container">

                                    {product.imageUrl ? (

                                       <img
    src={product.imageUrl}
    alt={product.name}
/>
                                    ) : (

                                        <div className="no-product-image">
                                            No image
                                        </div>

                                    )}

                                    <span className="product-location-badge">
                                        ● {product.location}
                                    </span>

                                </div>


                                <div className="product-card-content">

                                    <h3>
                                        {product.name}
                                    </h3>

                                    <p>
                                        {product.description}
                                    </p>


                                    <div className="product-bottom">

                                        <strong>
                                            ₹{product.price}
                                        </strong>

                                        <span>
                                            {product.availableQuantity}
                                            {" "}
                                            available
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* =================================
                ADD PRODUCT MODAL
            ================================= */}

            {showAddProduct && (

                <div
                    className="product-modal-overlay"
                    onClick={closeAddProduct}
                >

                    <div
                        className="product-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="product-modal-header">

                            <div>

                                <span>
                                    NEW LISTING
                                </span>

                                <h2>
                                    Add Product
                                </h2>

                            </div>


                            <button
                                className="close-modal-btn"
                                onClick={closeAddProduct}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleAddProduct
                            }
                        >


                            {/* IMAGE */}

                            <div className="image-upload-area">

                                {productForm.imagePreview ? (

                                    <div className="image-preview-wrapper">

                                        <img
                                            src={
                                                productForm.imagePreview
                                            }
                                            alt="Preview"
                                        />

                                        <button
                                            type="button"
                                            className="remove-image-btn"
                                            onClick={
                                                removeImage
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                ) : (

                                    <div className="image-upload-content">

                                        <div className="upload-camera-icon">
                                            +
                                        </div>

                                        <h3>
                                            Add food photo
                                        </h3>

                                        <p>
                                            A clear photo helps
                                            customers choose
                                            your food.
                                        </p>


                                        <div className="image-upload-actions">

                                            <label className="camera-upload-btn">

                                                <span>
                                                    ◉
                                                </span>

                                                Take Photo

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    capture="environment"
                                                    onChange={
                                                        handleImageChange
                                                    }
                                                    hidden
                                                />

                                            </label>


                                            <label className="gallery-upload-btn">

                                                <span>
                                                    □
                                                </span>

                                                Gallery

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleImageChange
                                                    }
                                                    hidden
                                                />

                                            </label>

                                        </div>

                                    </div>
                                )}

                            </div>


                            {/* PRODUCT DETAILS */}

                            <div className="product-form-grid">

                                <div className="product-form-group full">

                                    <label>
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Eg: Chicken Biryani"
                                        value={
                                            productForm.name
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="product-form-group full">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        placeholder="Tell customers about your food..."
                                        value={
                                            productForm.description
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                    />

                                </div>


                                <div className="product-form-group">

                                    <label>
                                        Price
                                    </label>

                                    <div className="input-with-symbol">

                                        <span>
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="99"
                                            min="1"
                                            value={
                                                productForm.price
                                            }
                                            onChange={
                                                handleProductChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="product-form-group">

                                    <label>
                                        Available Quantity
                                    </label>

                                    <input
                                        type="number"
                                        name="availableQuantity"
                                        placeholder="20"
                                        min="0"
                                        value={
                                            productForm.availableQuantity
                                        }
                                        onChange={
                                            handleProductChange
                                        }
                                        required
                                    />

                                </div>


                                {/* LOCATION */}

                                <div className="product-form-group full">

                                    <label>
                                        Product Location
                                    </label>

                                    <div className="product-location-input">

                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="Detect your location"
                                            value={
                                                productForm.location
                                            }
                                            onChange={
                                                handleProductChange
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                getCurrentLocation
                                            }
                                            disabled={
                                                detectingLocation
                                            }
                                        >
                                            {detectingLocation
                                                ? "Detecting..."
                                                : "Use Current Location"}
                                        </button>

                                    </div>


                                    {productForm.latitude && (

                                        <small className="coordinates-text">

                                            Location detected successfully

                                        </small>

                                    )}

                                </div>

                            </div>


                            {/* SUBMIT */}

                            <div className="product-modal-footer">

                                <button
                                    type="button"
                                    className="cancel-product-btn"
                                    onClick={
                                        closeAddProduct
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="save-product-btn"
                                    disabled={
                                        savingProduct
                                    }
                                >

                                    {savingProduct
                                        ? "Adding Product..."
                                        : "Add Product →"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
        </div>
    );
}

export default Earn;