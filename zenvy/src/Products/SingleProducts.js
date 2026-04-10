/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

function SingleProducts() {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setP] = useState([])
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        // Get search keyword from URL
        const params = new URLSearchParams(location.search);
        const keyword = params.get("keyword");
        setSearchKeyword(keyword || '');
        
        if (!keyword) {
            setP([]);
            return;
        }

        const fetchdata = async () => {
            setLoading(true);
            try {
                let res = await fetch(`http://localhost:2000/api/products/search?q=${encodeURIComponent(keyword)}`);
                let data = await res.json();
                console.log("Fetched products:", data);
                setP(data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setP([]);
            } finally {
                setLoading(false);
            }
        };

        fetchdata();
    }, [location.search]);

    const handleProductClick = (productId) => {
        if (productId) {
            console.log("✅ Navigating to product with ID:", productId);
            const idString = String(productId);
            navigate(`/productpage/${idString}`);
        } else {
            console.error("❌ No product ID provided");
        }
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Searching for "{searchKeyword}"...</p>
            </div>
        );
    }

    return (
        <>
            <div>
                {searchKeyword && (
                    <div className="container mt-3">
                        <h4 className="mb-3">Search Results for "{searchKeyword}"</h4>
                        <p className="text-muted">Found {products.length} products</p>
                    </div>
                )}
                
                {products.length === 0 && searchKeyword && !loading && (
                    <div className="container mt-5 text-center">
                        <div className="alert alert-info">
                            <h5>No products found for "{searchKeyword}"</h5>
                            <p className="mb-0">Try searching with different keywords or browse our categories.</p>
                            <button className="btn btn-danger mt-3" onClick={() => navigate('/')}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
                
                {products.length > 0 && (
                    <div className="container mt-3">
                        <div className="row g-3">
                            {products.map((item) => (
                                <div className="col-12 col-lg-10 mx-auto" key={item._id}>
                                    <div
                                        className="card bg-light border-0 shadow-sm p-3"
                                        style={{ borderRadius: "10px" }}
                                    >
                                        <div className="row g-0 align-items-center">
                                            {/* Left: Product Image */}
                                            <div className="col-md-5 d-flex align-items-center justify-content-center">
                                                <div 
                                                    onClick={() => handleProductClick(item._id)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <img
                                                        src={item.thumbnail}
                                                        style={{
                                                            maxHeight: "250px",
                                                            width: "100%",
                                                            objectFit: "contain",
                                                            borderRadius: "8px",
                                                        }}
                                                        alt={item.title}
                                                    />
                                                </div>
                                            </div>

                                            {/* Right: Product Details */}
                                            <div className="col-md-7 ps-md-3">
                                                <div className="card-body d-flex flex-column">
                                                    <div
                                                        onClick={() => handleProductClick(item._id)}
                                                        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                                                    >
                                                        <h6 className="card-title fs-4 fw-normal mb-2 hover-title">
                                                            {item.title}
                                                        </h6>
                                                    </div>

                                                    {/* Rating */}
                                                    <div className="text-warning mb-1 position-relative">
                                                        <div className="d-inline-block">
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} className={i < Math.floor(item.rating) ? "text-warning" : "text-secondary"}>
                                                                    {i < Math.floor(item.rating) ? "★" : "☆"}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="dropdown d-inline-block ms-2" id={`rating-dropdown-${item._id}`}>
                                                            <button
                                                                className="btn btn-sm p-0 border-0 bg-transparent dropdown-toggle"
                                                                type="button"
                                                                style={{ fontSize: '17px' }}
                                                                onMouseEnter={() => {
                                                                    const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                                                                    if (dropdown) {
                                                                        dropdown.classList.add('show');
                                                                        const menu = dropdown.querySelector('.dropdown-menu');
                                                                        if (menu) menu.classList.add('show');
                                                                    }
                                                                }}
                                                                onMouseLeave={() => {
                                                                    const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                                                                    if (dropdown) {
                                                                        dropdown.classList.remove('show');
                                                                        const menu = dropdown.querySelector('.dropdown-menu');
                                                                        if (menu) menu.classList.remove('show');
                                                                    }
                                                                }}
                                                            >
                                                                {item.rating}
                                                            </button>

                                                            <div
                                                                className="dropdown-menu p-3"
                                                                style={{ minWidth: '250px' }}
                                                                onMouseEnter={(e) => {
                                                                    const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                                                                    if (dropdown) {
                                                                        dropdown.classList.add('show');
                                                                        e.currentTarget.classList.add('show');
                                                                    }
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                                                                    if (dropdown) {
                                                                        dropdown.classList.remove('show');
                                                                        e.currentTarget.classList.remove('show');
                                                                    }
                                                                }}
                                                            >
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <span className="fw-bold fs-5 me-2">{item.rating}</span>
                                                                    <div className="text-warning">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            <span key={i}>{i < Math.floor(item.rating) ? "★" : "☆"}</span>
                                                                        ))}
                                                                    </div>
                                                                    <span className="text-muted small ms-2">({Math.floor(Math.random() * 10000) + 1000} ratings)</span>
                                                                </div>

                                                                <hr className="my-2" />

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

                                                                <hr className="my-2" />

                                                                <a href="#" className="small text-primary text-decoration-none">See all customer reviews</a>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="fw-bold small text-center py-1 mb-2"
                                                        style={{
                                                            background: "linear-gradient(45deg, #ff3b3b, #b30000)",
                                                            width: "fit-content",
                                                            borderRadius: "4px",
                                                            padding: "2px 10px",
                                                        }}
                                                    >
                                                        <a href="/" className="text-decoration-none text-white">Zenvy Hot Deals 🔥</a>
                                                    </div>

                                                    <div className="d-flex align-items-center mb-1">
                                                        <h5 className="text-black fs-4 fw-normal d-flex align-items-center mb-0">
                                                            <span style={{ fontSize: "15px" }}>₹</span>{item.price}
                                                        </h5>
                                                        <div className="text-muted small ms-2">
                                                            M.R.P: <span className="text-decoration-line-through">₹69,000</span> <span className="text-success">(Save 31%)</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-muted small fw-light mb-1">
                                                        <b>Easy 7-day returns on Zenvy</b>
                                                    </p>

                                                    <p className="d-flex align-items-center mb-2">
                                                        <i className="bi bi-check fs-5 me-1" style={{ color: "#6a11cb" }}></i>
                                                        <span className="fw-bold" style={{ color: "#6a11cb" }}>Zenvy Assured</span>
                                                    </p>

                                                    <div className="mt-auto">
                                                        <button
                                                            className="bg-gradient btn btn-danger"
                                                            style={{
                                                                fontSize: "0.85rem",
                                                                borderRadius: "50px",
                                                                padding: "0.35rem 1rem",
                                                            }}
                                                            onClick={() => handleProductClick(item._id)}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default SingleProducts;