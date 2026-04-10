/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SideBySideMagnifier } from "react-image-magnifiers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useCart } from "../Navbar/CartProcess/CartContext";

function ProductPage() {
    let { id } = useParams()
    let [data, setD] = useState(null)
    let [main, setM] = useState()
    let [small, setSm] = useState([])
    const [showLarge, setShowLarge] = useState(false)
    const [quantity, setQuantity] = useState(1);
    const [location, setLocation] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [error, setError] = useState(null);

    const [colors] = useState([
        { name: "Black", code: "#201D24" },
        { name: "Titanium", code: "#878684" },
        { name: "Blue Titanium", code: "#73798C" },
        { name: "Green", code: "#E1F8DC" },
        { name: "Silver", code: "#C0C0C0" }
    ]);
    const [hoverColor, setHoverColor] = useState("Black");
    const [selectedSize, setSelectedSize] = useState("6GB+128GB");

  useEffect(() => {
    const fetchdata = async () => {
        try {
            setError(null);
            
            if (!id || id === 'undefined' || id === 'null' || id === 'singleproducts') {
                toast.error("Invalid product");
                navigate('/');
                return;
            }
            
            let result = null;
            
            // FIRST: Try to fetch from BestDeals (deals collection)
            try {
                console.log("Trying BestDeals API...");
                const dealsRes = await fetch(`http://localhost:2000/api/best/${id}`);
                if (dealsRes.ok) {
                    result = await dealsRes.json();
                    console.log("Found in BestDeals:", result);
                }
            } catch (err) {
                console.log("Not found in BestDeals, trying Products...");
            }
            
            // SECOND: If not found in BestDeals, try Products collection
            if (!result || !result._id) {
                try {
                    const productsRes = await fetch(`http://localhost:2000/api/products/${id}`);
                    if (productsRes.ok) {
                        result = await productsRes.json();
                        console.log("Found in Products:", result);
                    }
                } catch (err) {
                    console.log("Not found in Products either");
                }
            }
            
            // THIRD: Try NewArrivals collection
            if (!result || !result._id) {
                try {
                    const newArrivalsRes = await fetch(`http://localhost:2000/api/new/arrivals/${id}`);
                    if (newArrivalsRes.ok) {
                        result = await newArrivalsRes.json();
                        console.log("Found in NewArrivals:", result);
                    }
                } catch (err) {
                    console.log("Not found in NewArrivals");
                }
            }
            
            // FOURTH: Try Unified API (covers Fashion, Furniture, Health & Beauty, Electronics)
            if (!result || !result._id) {
                try {
                    const unifiedRes = await fetch(`http://localhost:2000/api/unified/product/${id}`);
                    if (unifiedRes.ok) {
                        result = await unifiedRes.json();
                        console.log("Found in Unified API:", result);
                    }
                } catch (err) {
                    console.log("Not found in Unified API");
                }
            }
            
            // FIFTH: If still not found, try search by title
            if (!result || !result._id) {
                const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
                
                if (isObjectId) {
                    const userId = localStorage.getItem("userId");
                    if (userId) {
                        const ordersRes = await fetch(`http://localhost:2000/api/order/user/${userId}`);
                        const orders = await ordersRes.json();
                        
                        let productTitle = null;
                        if (Array.isArray(orders)) {
                            for (const order of orders) {
                                const item = order.items?.find(i => i.productId === id || i.productId?._id === id);
                                if (item) {
                                    productTitle = item.title;
                                    break;
                                }
                            }
                        }
                        
                        if (productTitle) {
                            const searchRes = await fetch(`http://localhost:2000/api/products/search?q=${encodeURIComponent(productTitle)}`);
                            const searchResult = await searchRes.json();
                            if (searchResult && searchResult.length > 0) {
                                result = searchResult[0];
                            }
                        }
                    }
                } else {
                    const searchRes = await fetch(`http://localhost:2000/api/products/search?q=${encodeURIComponent(id)}`);
                    const searchResult = await searchRes.json();
                    if (searchResult && searchResult.length > 0) {
                        result = searchResult[0];
                    }
                }
            }
            
            if (!result || !result._id) {
                throw new Error(`Product not found`);
            }
            
            const normalizedData = {
                ...result,
                _id: result._id || result.id,
                id: result.id || result._id
            };

            setD(normalizedData);
            setM(normalizedData.thumbnail || "");
            setSm(normalizedData.images || []);

        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
            toast.error(error.message);
        }
    };

    if (id) {
        fetchdata();
    }
}, [id, navigate]);

    function getLocation() {
        navigator.geolocation.getCurrentPosition(
            async (res) => {
                let la = res.coords.latitude;
                let lo = res.coords.longitude;

                try {
                    let response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${la}&lon=${lo}`
                    );
                    let data = await response.json();

                    const address = data.address;

                    const formattedLocation = `
          ${address.city || address.town || address.village || ""},
          ${address.state || ""},
          ${address.postcode || ""}
        `;

                    setLocation(formattedLocation);
                } catch (error) {
                    console.error("Error fetching location:", error);
                }
            },
            (err) => {
                console.log("Location permission denied");
            }
        );
    }

    useEffect(() => {
        getLocation();
    }, []);

    const today = new Date();
    const currentDay = today.toLocaleDateString("en-IN", {
        weekday: "long"
    });

    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 7);

    const deliveryDay = deliveryDate.toLocaleDateString("en-IN", {
        weekday: "long"
    });

    const deliveryFullDate = deliveryDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long"
    });

   const addToWishlist = async () => {
    if (loading || !data) return;

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = localStorage.getItem("userId");

    if (!user || !userId) {
        toast.error("Please login first ❌");
        navigate('/signin');
        return;
    }

    setLoading(true);

    try {
        const res = await fetch("http://localhost:2000/api/wishlist/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                productId: data._id
            }),
        });

        const result = await res.json();

        if (result.message === "Already exists") {
            toast.info("Already in wishlist 💙");
            setIsWishlisted(true);
        } else {
            toast.success("Added to wishlist ❤️");
            setIsWishlisted(true);
        }

    } catch (err) {
        console.error(err);
        toast.error("Server error ⚠️");
    } finally {
        setLoading(false);
    }
};

    const handleAddToCart = async () => {
        if (isAddingToCart || !data) return;

        const user = JSON.parse(localStorage.getItem("user"));
        const userId = localStorage.getItem("userId");
        
        if (!user || !userId) {
            toast.error("Please login first to add items to cart ❌");
            navigate('/signin');
            return;
        }

        if (!data || !data._id) {
            toast.error("Product data not available ❌");
            return;
        }

        setIsAddingToCart(true);

        try {
            await addToCart({
                id: data._id,
                title: data.title,
                price: data.price,
                image: data.thumbnail,
                quantity: parseInt(quantity)
            });
            toast.success(`${data.title} added to cart 🛒`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error(error.message || "Failed to add to cart. Please try again ⚠️");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (isAddingToCart || !data) return;

        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user) {
            toast.error("Please login first to buy items ❌");
            navigate('/signin');
            return;
        }

        setIsAddingToCart(true);

        try {
            await addToCart({
                id: data._id.toString(),
                title: data.title,
                price: data.price,
                thumbnail: data.thumbnail,
                quantity: parseInt(quantity)
            });
            navigate('/cartmethod');
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to process. Please try again ⚠️");
            setIsAddingToCart(false);
        }
    };

    if (error) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">
                    <h4>⚠️ Product Not Found</h4>
                    <p>{error}</p>
                    <button 
                        className="btn btn-danger mt-3"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading product...</p>
            </div>
        );
    }

    return (
        <>
            <style>
                {`
          /* Responsive Styles - Added for better mobile/tablet experience */
          * {
            box-sizing: border-box;
          }
          
          /* Container padding adjustments */
          .container-fluid {
            padding-left: 15px;
            padding-right: 15px;
          }
          
          @media (max-width: 576px) {
            .container-fluid {
              padding-left: 10px;
              padding-right: 10px;
            }
          }
          
          /* Main Image Responsive */
          @media (min-width: 1200px) {
            .main-image-magnifier {
              height: 500px !important;
            }
          }
          
          @media (min-width: 992px) and (max-width: 1199px) {
            .main-image-magnifier {
              height: 440px !important;
            }
          }
          
          @media (min-width: 768px) and (max-width: 991px) {
            .main-image-magnifier {
              height: 380px !important;
            }
            .small-images-desktop {
              display: none !important;
            }
            .small-images-mobile {
              display: flex !important;
              margin: 15px 0;
            }
            .small-images-mobile img {
              height: 55px !important;
              width: 55px !important;
              margin: 4px !important;
            }
          }
          
          @media (max-width: 767px) {
            .main-image-magnifier {
              height: 300px !important;
              min-height: 280px !important;
            }
            .small-images-desktop {
              display: none !important;
            }
            .small-images-mobile {
              display: flex !important;
              margin: 12px 0;
            }
            .small-images-mobile img {
              height: 55px !important;
              width: 55px !important;
              margin: 4px !important;
            }
          }
          
          @media (max-width: 480px) {
            .main-image-magnifier {
              height: 250px !important;
            }
            .small-images-mobile img {
              height: 48px !important;
              width: 48px !important;
            }
          }
          
          /* Product Title Responsive */
          @media (max-width: 768px) {
            h1.fs-3 {
              font-size: 1.5rem !important;
            }
          }
          
          @media (max-width: 480px) {
            h1.fs-3 {
              font-size: 1.3rem !important;
            }
          }
          
          /* Color and Size Options Responsive */
          @media (max-width: 576px) {
            .color-box {
              width: 30px !important;
              height: 30px !important;
            }
            .size-option {
              padding: 6px 12px !important;
              font-size: 12px !important;
            }
          }
          
          /* Offer Cards Responsive */
          @media (max-width: 768px) {
            .offer-card .card-body {
              padding: 0.75rem;
            }
            .offer-card .fw-bold {
              font-size: 13px;
            }
            .offer-card .text-muted {
              font-size: 11px;
            }
          }
          
          @media (max-width: 576px) {
            .offer-card .card-body {
              padding: 0.5rem;
            }
          }
          
          /* Table Responsive */
          @media (max-width: 768px) {
            .table {
              font-size: 12px !important;
            }
            .table td, .table th {
              padding: 0.5rem !important;
            }
          }
          
          /* Purchase Card Responsive */
          @media (max-width: 768px) {
            .card.shadow-sm {
              margin-bottom: 1rem;
            }
            .action-buttons .btn {
              font-size: 14px;
              padding: 10px;
            }
          }
          
          @media (max-width: 480px) {
            .action-buttons {
              gap: 10px;
            }
            .action-buttons .btn {
              font-size: 13px;
              padding: 8px;
            }
          }
          
          /* Breadcrumb Responsive */
          @media (max-width: 576px) {
            .breadcrumb {
              font-size: 12px;
            }
            .breadcrumb-item + .breadcrumb-item::before {
              padding: 0 0.3rem;
            }
          }
          
          /* Delivery Info Responsive */
          @media (max-width: 768px) {
            .mb-3.small {
              font-size: 12px;
            }
            .text-success.fs-4 {
              font-size: 1.2rem !important;
            }
          }
          
          /* Rating Section Responsive */
          @media (max-width: 576px) {
            .text-warning span {
              font-size: 14px;
            }
            .rating-dropdown .btn {
              font-size: 14px;
            }
            .small[style*="marginLeft: 30px"] {
              margin-left: 15px !important;
              font-size: 12px !important;
            }
          }
          
          /* Features Icons Responsive */
          @media (max-width: 768px) {
            .row.text-center .fs-3 {
              font-size: 1.5rem !important;
            }
            .row.text-center .fw-semibold {
              font-size: 11px;
            }
          }
          
          @media (max-width: 480px) {
            .row.text-center .fs-3 {
              font-size: 1.3rem !important;
            }
            .row.text-center .fw-semibold {
              font-size: 10px;
            }
          }
          
          /* About this item list */
          @media (max-width: 768px) {
            .list-unstyled li {
              font-size: 13px;
            }
          }
          
          /* Modal/Lightbox Responsive */
          @media (max-width: 768px) {
            .position-fixed img {
              max-width: 95% !important;
              max-height: 85% !important;
            }
          }
          
          /* General spacing improvements */
          @media (max-width: 768px) {
            .row.g-3 {
              --bs-gutter-y: 1rem;
            }
            .mt-md-0 {
              margin-top: 1rem !important;
            }
          }
          
          /* Color and size option hover effects */
          .color-box, .size-option {
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .color-box:hover {
            transform: scale(1.05);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .size-option:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .offer-card {
            height: 100%;
            transition: transform 0.2s ease;
          }
          
          .offer-card:hover {
            transform: translateY(-2px);
          }
          
          .wishlist-btn {
            background-color: #fff;
            border: 1px solid #d5d9d9;
            color: #0F1111;
            font-size: 14px;
            padding: 8px 10px;
            transition: all 0.2s ease;
            border-radius: 8px;
          }
          
          .wishlist-btn:hover {
            background-color: #f7fafa;
            border-color: #c7c7c7;
            transform: translateY(-1px);
          }
          
          .wishlist-btn i {
            color: #C10015;
            font-size: 16px;
          }
          
          /* Button hover effects */
          .add-to-cart-btn, .buy-now-btn {
            transition: all 0.2s ease;
          }
          
          .add-to-cart-btn:hover, .buy-now-btn:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
          }
          
          .add-to-cart-btn:active, .buy-now-btn:active {
            transform: translateY(0);
          }
          
          /* Image container improvements */
          .main-image-container {
            background-color: #f8f9fa;
            padding: 10px;
          }
          
          /* Scroll behavior for mobile */
          @media (max-width: 768px) {
            html {
              scroll-behavior: smooth;
            }
          }
          
          /* Touch-friendly improvements for mobile */
          @media (max-width: 768px) {
            button, 
            .color-box, 
            .size-option,
            .wishlist-btn,
            [onClick] {
              cursor: pointer;
              -webkit-tap-highlight-color: transparent;
            }
            
            button:active,
            .color-box:active,
            .size-option:active {
              opacity: 0.8;
            }
          }
        `}
            </style>
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
            />
            <div>
                <div className="container-fluid mt-3 px-3 px-md-4">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-3">
                            <li className="breadcrumb-item"><a href="/" className="text-decoration-none">Home</a></li>
                            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Electronics</a></li>
                            <li className="breadcrumb-item"><a href="#" className="text-decoration-none">Smartphones</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{data.title}</li>
                        </ol>
                    </nav>

                    <div className="row g-3">
                        {/* COLUMN 1: Small Images for Desktop */}
                        <div className="col-lg-1 col-md-2 d-none d-md-block small-images-desktop">
                            {small && small.length > 0 && (
                                <div className="d-flex flex-lg-column flex-md-column flex-row justify-content-center justify-content-md-start flex-wrap">
                                    {small.map((item, i) => (
                                        <img
                                            key={i}
                                            src={item}
                                            alt={`Thumbnail ${i}`}
                                            onMouseOver={() => setM(item)}
                                            onClick={() => setM(item)}
                                            style={{
                                                height: "60px",
                                                width: "60px",
                                                border: main === item ? "2px solid #ffa41c" : "1px solid #ddd",
                                                borderRadius: "4px",
                                                margin: "3px",
                                                cursor: "pointer",
                                                objectFit: "cover"
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* COLUMN 2: Main Image */}
                        <div className="col-lg-4 col-md-5 col-12">
                            <div className="main-image-container border rounded position-relative">
                                <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                                    <i className="bi bi-upload fs-5"></i>
                                </div>
                                <SideBySideMagnifier
                                    imageSrc={main}
                                    imageAlt="main product image"
                                    largeImageSrc={main}
                                    alwaysInPlace={false}
                                    overlayOpacity={0.6}
                                    switchSides={false}
                                    zoomPosition="side"
                                    fillAvailableSpace={false}
                                    fillAlignTop={false}
                                    fillGapTop={0}
                                    fillGapRight={10}
                                    fillGapBottom={0}
                                    fillGapLeft={10}
                                    zoomContainerBorder="1px solid #ccc"
                                    zoomContainerBoxShadow="0 4px 8px rgba(0,0,0,0.1)"
                                    className="main-image-magnifier"
                                    style={{ width: "100%", cursor: "zoom-in" }}
                                    onImageClick={() => setShowLarge(true)}
                                />
                                <div className='d-flex justify-content-center mt-2'>
                                    <button className='btn btn-sm btn-outline-secondary' onClick={() => setShowLarge(true)}>
                                        Click to see full view
                                    </button>
                                </div>
                            </div>

                            {/* Small Images for Mobile */}
                            <div className="d-block d-md-none small-images-mobile">
                                {small && small.length > 0 && (
                                    <div className="d-flex justify-content-center flex-wrap mt-3">
                                        {small.map((item, i) => (
                                            <img
                                                key={i}
                                                src={item}
                                                alt={`Thumbnail ${i}`}
                                                onClick={() => setM(item)}
                                                style={{
                                                    height: "50px",
                                                    width: "50px",
                                                    border: main === item ? "2px solid #ffa41c" : "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    margin: "3px",
                                                    cursor: "pointer",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* COLUMN 3: Product Info */}
                        <div className="col-lg-4 col-md-5 col-12">
                            <div className="product-details">
                                <h1 className="fs-3 fw-normal" style={{ color: "#0F1111", lineHeight: "1.4" }}>
                                    {data.title} {data.category}
                                </h1>
                                <p><a href="#" className='text-decoration-none' style={{ color: "#2162A1", fontSize: "14px", fontWeight: "600" }}>Visit the {data.brand || "Generic"} Store</a></p>

                                <div className="text-warning position-relative" style={{ marginTop: "-12px" }}>
                                    <div className="d-inline-block">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={i < Math.floor(data.rating) ? "text-warning" : "text-secondary"}>
                                                {i < Math.floor(data.rating) ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="dropdown d-inline-block ms-2 rating-dropdown" id={`rating-dropdown-${data._id}`}>
                                        <button
                                            className="btn btn-sm p-0 border-0 bg-transparent dropdown-toggle"
                                            type="button"
                                            style={{ fontSize: '17px' }}
                                            onMouseEnter={() => {
                                                const dropdown = document.getElementById(`rating-dropdown-${data._id}`);
                                                if (dropdown) {
                                                    dropdown.classList.add('show');
                                                    const menu = dropdown.querySelector('.dropdown-menu');
                                                    if (menu) menu.classList.add('show');
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                const dropdown = document.getElementById(`rating-dropdown-${data._id}`);
                                                if (dropdown) {
                                                    dropdown.classList.remove('show');
                                                    const menu = dropdown.querySelector('.dropdown-menu');
                                                    if (menu) menu.classList.remove('show');
                                                }
                                            }}
                                        >
                                            {data.rating}
                                        </button>
                                        <div
                                            className="dropdown-menu p-3"
                                            style={{ minWidth: '250px' }}
                                            onMouseEnter={(e) => {
                                                const dropdown = document.getElementById(`rating-dropdown-${data._id}`);
                                                if (dropdown) {
                                                    dropdown.classList.add('show');
                                                    e.currentTarget.classList.add('show');
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                const dropdown = document.getElementById(`rating-dropdown-${data._id}`);
                                                if (dropdown) {
                                                    dropdown.classList.remove('show');
                                                    e.currentTarget.classList.remove('show');
                                                }
                                            }}
                                        >
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="fw-bold fs-5 me-2">{data.rating}</span>
                                                <div className="text-warning">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i}>{i < Math.floor(data.rating) ? "★" : "☆"}</span>
                                                    ))}
                                                </div>
                                                <span className="text-muted small ms-2">({Math.floor(Math.random() * 10000) + 1000} ratings)</span>
                                            </div>
                                            <div className="rating-distribution">
                                                {[5, 4, 3, 2, 1].map((stars) => {
                                                    const percentages = [61, 25, 6, 2, 6];
                                                    const percentage = percentages[5 - stars];
                                                    return (
                                                        <div key={stars} className="d-flex align-items-center mb-1">
                                                            <span className="small me-2" style={{ width: '20px' }}>{stars}★</span>
                                                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                                                <div className="progress-bar bg-warning" style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                            <span className="small text-muted" style={{ width: '30px' }}>{percentage}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="small" style={{ color: "#2162A1", fontSize: "14px", cursor: "pointer", marginLeft: "30px" }}>
                                        {Math.floor((6 - data.rating) * 1500 + Math.random() * 1000)} ratings
                                    </span>
                                </div>

                                <div className="text" style={{ fontSize: "12px" }}>
                                    <b>🔥 500+ customers bought</b> this recently
                                </div>

                                <hr className="text-secondary" style={{ height: "0.5px" }} />

                                <div>
                                    <div className="d-flex align-items-baseline">
                                        <span className="fs-5 text-danger fw-normal me-2">-{data.discountPercentage}%</span>
                                        <span className="fs-3 fw-normal me-2"><sup style={{ fontSize: "14px" }}>₹</sup>{data.price}</span>
                                    </div>
                                    <span className="text-muted fw-light text-decoration-line-through me-2" style={{ fontSize: "14px" }}>
                                        M.R.P.: ₹{Math.round(data.price * 1.3)}
                                    </span>
                                    <div className="small fw-normal">Inclusive of all taxes</div>
                                </div>

                                <div className="mb-2">
                                    <div className="fw-normal fs-6">
                                        <strong>EMI</strong> starts at ₹{Math.round(data.price / 24)}. No Cost EMI available.
                                        <span className="dropdown-toggle" style={{ cursor: "pointer" }}> EMI options </span>
                                    </div>
                                </div>

                                <div className="rounded p-1 bg-white">
                                    <div className="small fw-bold text-uppercase mb-1 mt-1" style={{ color: "#0F1111" }}>
                                        <i className="bi bi-currency-dollar"></i> Offers
                                    </div>
                                    <div className="row g-2">
                                        <div className="col-md-4 col-sm-6">
                                            <div className="card offer-card shadow-sm">
                                                <div className="card-body">
                                                    <div className="fw-bold text-dark">Bank Offer</div>
                                                    <div className="text-muted small mb-1">Save up to ₹4,000 instantly with Zenvy partner bank cards.</div>
                                                    <div className="fw-normal small dropdown-toggle" style={{ cursor: "pointer", color: "#2162A1" }}>5 offers</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-6">
                                            <div className="card offer-card shadow-sm">
                                                <div className="card-body">
                                                    <div className="fw-bold text-dark">No Cost EMI</div>
                                                    <div className="text-muted small mb-1">Enjoy No-Cost EMI with zero extra charges on selected cards.</div>
                                                    <div className="fw-normal small dropdown-toggle" style={{ cursor: "pointer", color: "#2162A1" }}>1 offer</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-6">
                                            <div className="card offer-card shadow-sm">
                                                <div className="card-body">
                                                    <div className="fw-bold text-dark">Cashbacks</div>
                                                    <div className="text-muted small mb-1">Get exciting cashback rewards directly on your Zenvy wallet.</div>
                                                    <div className="fw-normal small dropdown-toggle" style={{ cursor: "pointer", color: "#2162A1" }}>1 offer</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <div className="row text-center small">
                                        <div className="col-4">
                                            <div className="fw-semibold text-secondary fs-3"><i className="bi bi-truck"></i></div>
                                            <div className='fw-semibold' style={{ cursor: "pointer", color: "#2162A1" }}>Free Delivery</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="fw-semibold text-secondary fs-3"><i className="bi bi-shield-check"></i></div>
                                            <div className='fw-semibold' style={{ cursor: "pointer", color: "#2162A1" }}>1 Year Warranty</div>
                                        </div>
                                        <div className="col-4">
                                            <div className="fw-semibold text-secondary fs-3"><i className="bi bi-cash-coin"></i></div>
                                            <div className='fw-semibold' style={{ cursor: "pointer", color: "#2162A1" }}>Cash/Pay on Delivery</div>
                                        </div>
                                    </div>
                                </div>

                                <hr className="text-secondary" style={{ height: "0.5px", border: "none" }} />

                                <div className="mb-3">
                                    <div className="small fw-bold mb-2">Colour: <span style={{ color: "#201D24" }}>{hoverColor}</span></div>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {colors.map((c, i) => (
                                            <div
                                                key={i}
                                                onMouseEnter={() => setHoverColor(c.name)}
                                                onMouseLeave={() => setHoverColor("Black")}
                                                onClick={() => setHoverColor(c.name)}
                                                className="color-box border rounded"
                                                style={{
                                                    width: "35px",
                                                    height: "35px",
                                                    backgroundColor: c.code,
                                                    cursor: "pointer",
                                                    border: hoverColor === c.name ? "2px solid #f8bd19" : "1px solid #ccc",
                                                    transition: "all 0.2s ease"
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="small fw-bold mb-2">Size: <span style={{ color: "#111" }}>{selectedSize}</span></div>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {["6GB+128GB", "8GB+128GB", "8GB+256GB"].map((size, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedSize(size)}
                                                className="border rounded px-3 py-2 small size-option"
                                                style={{
                                                    cursor: "pointer",
                                                    color: selectedSize === size ? "#000" : "#333",
                                                    border: selectedSize === size ? "2px solid #f8bd19" : "1px solid #ccc",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                {size}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <table className="table table-borderless mb-0" style={{ fontSize: "14px" }}>
                                    <tbody>
                                        <tr><td className="fw-bold p-1" style={{ width: "55%" }}>Brand</td>
                                        <td className="p-1">{data.brand}</td>
                                        </tr>
                                        <tr><td className="fw-bold p-1">Operating System</td>
                                        <td className="p-1">{data.tags?.[1] || "Not specified"}</td>
                                        </tr>
                                        <tr><td className="fw-bold p-1">RAM Memory Installed Size</td>
                                        <td className="p-1">128 GB</td>
                                        </tr>
                                        <tr><td className="fw-bold p-1">Memory Storage Capacity</td>
                                        <td className="p-1">128 GB</td>
                                        </tr>
                                        <tr><td className="fw-bold p-1">Screen Size</td>
                                        <td className="p-1">6.1 Inches</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <hr className="text-secondary" style={{ height: "0.5px", border: "none" }} />

                                <h5 className="card-title fw-bold">About this item</h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2">• {data.description}</li>
                                    <li className="mb-2">• Fastest {data.tags?.[1] || data.category} in the segment with powerful processor</li>
                                    <li className="mb-2">• {data.stock} units available in stock</li>
                                    <li className="mb-2">• High resolution camera with 4K video recording</li>
                                    <li className="mb-2">• Latest software experience with regular updates</li>
                                </ul>
                                <div><i className="bi bi-chat-left-text"></i> <span style={{ cursor: "pointer", color: "#2162A1" }}>Report an issue with this product</span></div>
                            </div>
                        </div>

                        {/* COLUMN 4: Purchase Card */}
                        <div className="col-lg-3 col-md-12 col-12 mt-md-0 mt-3">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="mb-3">
                                        <div className="form-check mb-2 d-flex align-items-start">
                                            <input className="form-check-input mt-1 me-2" type="radio" name="exchange" id="withExchange" style={{ width: "18px", height: "18px" }} />
                                            <label className="form-check-label small" htmlFor="withExchange">
                                                <span className="fw-bold">With Exchange</span><br />
                                                <span className='fw-bold' style={{ color: "#C10015" }}>Up to ₹58,500 off</span>
                                            </label>
                                        </div>
                                        <div className="form-check d-flex align-items-start">
                                            <input className="form-check-input mt-1 me-2" type="radio" name="exchange" id="withoutExchange" defaultChecked style={{ width: "18px", height: "18px" }} />
                                            <label className="form-check-label small" htmlFor="withoutExchange">
                                                <span className="fw-bold">Without Exchange</span><br />
                                                <span className="fw-bold" style={{ color: "#C10015" }}>₹{data.price}.00</span>
                                                <span className="text-muted text-decoration-line-through ms-1">₹{Math.round(data.price * 1.3)}.00</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3 small">
                                        <div className="fw-normal">FREE delivery <b>{deliveryDay}, {deliveryFullDate}</b></div>
                                        <div>Or fastest delivery <span className="fw-bold">{currentDay}.</span> <span style={{ color: "#C10015" }}><strong>Order within 52 mins.</strong></span></div>
                                        <div className="mt-2" style={{ color: "#2162A1" }}>
                                            <i className="bi bi-geo-alt"></i> Delivering to {location ? location : "Fetching location..."} –
                                            <a href="#" className="text-decoration-none ms-1" style={{ color: "#C10015" }}>Update location</a>
                                        </div>
                                    </div>

                                    <div className="mb-3 small">
                                        <div className="text-success fw-normal fs-4">{data.availabilityStatus || "In Stock"}</div>
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <label className="fw-bold">Quantity:</label>
                                            <select value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="form-select" style={{ width: "100px", fontSize: "14px" }}>
                                                {Array.from({ length: Math.min(10, data.stock || 10) }).map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>Ships from <strong>Zenvy</strong></div>
                                        <div>Sold by <strong>Verified Zenvy Seller</strong></div>
                                        <div>Payment <a href="#" className="text-decoration-none" style={{ color: "#2162A1" }}>Secure transaction</a></div>
                                    </div>

                                    <div className="mb-3 small">
                                        <div className="fw-bold mb-1">Add a Protection Plan:</div>
                                        <div className="form-check d-flex align-items-start">
                                            <input className="form-check-input mt-1 me-2" type="checkbox" id="protectionPlan" style={{ width: "18px", height: "18px" }} />
                                            <label className="form-check-label" htmlFor="protectionPlan">Protect+ with AppleCare Services for iPhone 16 (1 year) <span className="text-danger fw-bold"> ₹8,499.00</span></label>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2 mb-2 action-buttons">
                                        <button className="btn fw-bold add-to-cart-btn" style={{ backgroundColor: "#e12727", backgroundImage: "linear-gradient(180deg, #e12727 50%, #a30606 100%)", color: "white" }} onClick={handleAddToCart} disabled={isAddingToCart}>
                                            {isAddingToCart ? "Adding..." : "Add to Cart"}
                                        </button>
                                        <button className="btn fw-bold buy-now-btn" style={{ backgroundColor: "#e12727", backgroundImage: "linear-gradient(180deg, #fd4a4a 50%, #cd0d0d 100%)", color: "white" }} onClick={handleBuyNow} disabled={isAddingToCart}>
                                            Buy Now
                                        </button>
                                    </div>

                                    <div className="form-check small d-flex align-items-start">
                                        <input className="form-check-input mt-1 me-2" type="checkbox" id="giftOption" style={{ width: "18px", height: "18px" }} />
                                        <label className="form-check-label" htmlFor="giftOption">Add gift options</label>
                                    </div>
                                </div>
                            </div>

                            <div className="card border-0 mt-2 shadow-sm">
                                <div className="card-body p-2 text-center">
                                    <button className="btn w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 wishlist-btn" onClick={addToWishlist} disabled={loading}>
                                        <i className={`bi ${isWishlisted ? "bi-heart-fill" : "bi-heart"}`}></i>
                                        {loading ? "Adding..." : isWishlisted ? "Wishlisted" : "Add to Wish List"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showLarge && (
                        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center" style={{ zIndex: 1050 }}>
                            <button className="btn position-absolute top-0 end-0 m-3 p-1" onClick={() => setShowLarge(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "28px", cursor: "pointer" }}>
                                <i className="bi bi-x-lg"></i>
                            </button>
                            <img src={main} alt="enlarged" style={{ maxHeight: "90%", maxWidth: "90%", borderRadius: "10px", objectFit: "contain" }} />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProductPage