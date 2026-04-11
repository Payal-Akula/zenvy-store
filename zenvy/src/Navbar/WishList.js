/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WishList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = "https://zenvy-store.onrender.com";

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = localStorage.getItem("userId");

    if (!user || !userId) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/wishlist/${userId}`);
      const wishlistIds = await res.json();
      console.log("Wishlist IDs:", wishlistIds);

      if (Array.isArray(wishlistIds) && wishlistIds.length > 0) {
        const productPromises = wishlistIds.map(async (id) => {
          try {
            let productRes = await fetch(`${API_URL}/api/unified/product/${id}`);
            if (productRes.ok) {
              return await productRes.json();
            }
            
            productRes = await fetch(`${API_URL}/api/best/${id}`);
            if (!productRes.ok) {
              productRes = await fetch(`${API_URL}/api/products/${id}`);
            }
            if (!productRes.ok) {
              productRes = await fetch(`${API_URL}/api/new/arrivals/${id}`);
            }
            if (productRes.ok) {
              return await productRes.json();
            }
            return null;
          } catch (err) {
            console.error(`Failed to fetch product ${id}:`, err);
            return null;
          }
        });

        const products = await Promise.all(productPromises);
        setItems(products.filter(product => product !== null));
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error(err);
      setItems([]);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = localStorage.getItem("userId");

    if (!user || !userId) return;

    try {
      const res = await fetch(`${API_URL}/api/wishlist/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
        }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== productId));
        toast.success("Removed from wishlist");
      } else {
        toast.error("Failed to remove");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/productpage/${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          /* Responsive Styles for WishList */
          @media (max-width: 992px) {
            .wishlist-card .fs-4 {
              font-size: 1.2rem !important;
            }
            .wishlist-card .text-black.fs-4 {
              font-size: 1.1rem !important;
            }
            .wishlist-card img {
              max-height: 150px !important;
            }
          }

          @media (max-width: 768px) {
            .wishlist-card .row {
              flex-direction: column;
            }
            .wishlist-card .col-6 {
              width: 100%;
              max-width: 100%;
            }
            .wishlist-card .col-6:first-child {
              margin-bottom: 15px;
            }
            .wishlist-card .col-6:first-child div {
              display: flex;
              justify-content: center;
            }
            .wishlist-card img {
              max-height: 200px !important;
              width: auto !important;
            }
            .wishlist-card .d-flex.gap-2 {
              flex-wrap: wrap;
              justify-content: center;
            }
            .wishlist-card .bg-gradient.btn {
              padding: 6px 12px;
              font-size: 12px;
              border-radius: 20px !important;
            }
            .wishlist-card .fs-4 {
              font-size: 1rem !important;
              text-align: center;
            }
            /* Hide rating stars on mobile, keep only dropdown */
            .wishlist-card .rating-stars {
              display: none !important;
            }
            .wishlist-card .text-warning .d-inline-block {
              display: none !important;
            }
            .wishlist-card .dropdown.d-inline-block {
              margin-left: 0 !important;
            }
            .wishlist-card .text-warning {
              justify-content: center;
              display: flex;
            }
            .wishlist-card .d-flex.align-items-center.mb-1 {
              justify-content: center;
              flex-wrap: wrap;
            }
            .wishlist-card .text-muted.small.ms-2 {
              margin-left: 0 !important;
              margin-top: 5px;
              display: inline-block;
              width: 100%;
              text-align: center;
            }
            .wishlist-card .d-flex.align-items-center.mb-2 {
              justify-content: center;
            }
            .wishlist-card .d-flex.gap-2.mt-2 {
              justify-content: center;
            }
            .wishlist-card .text-center.text-muted.mt-5 p {
              font-size: 16px;
            }
            .wishlist-card .btn-danger.mt-3 {
              padding: 8px 20px;
              font-size: 14px;
            }
            .wishlist-card p.text-muted.small.fw-light.mb-1 {
              text-align: center;
            }
          }

          @media (max-width: 576px) {
            .wishlist-card .card {
              margin: 0 10px;
            }
            .wishlist-card .p-3 {
              padding: 15px !important;
            }
            .wishlist-card img {
              max-height: 160px !important;
            }
            .wishlist-card .fs-4 {
              font-size: 0.95rem !important;
            }
            .wishlist-card .text-black.fs-4 {
              font-size: 1rem !important;
            }
            .wishlist-card .bg-gradient.btn {
              padding: 6px 12px;
              font-size: 11px;
              border-radius: 20px !important;
              min-width: 100px;
            }
            .wishlist-card .btn-outline-danger.rounded-pill,
            .wishlist-card .btn-outline-dark.rounded-pill {
              font-size: 11px;
              border-radius: 20px !important;
            }
            .wishlist-card .text-muted.small.ms-2 {
              font-size: 10px !important;
            }
            .wishlist-card .fw-light.mb-1 {
              font-size: 10px !important;
              text-align: center;
            }
            .wishlist-card .d-flex.align-items-center.mb-2 span {
              font-size: 11px !important;
            }
            .wishlist-card .rating-distribution .small {
              font-size: 9px !important;
            }
            h3.mb-3 {
              font-size: 1.5rem;
              text-align: center;
            }
          }

          @media (max-width: 425px) {
            .wishlist-card .bg-gradient.btn {
              padding: 5px 10px;
              font-size: 10px;
              border-radius: 20px !important;
              min-width: 90px;
            }
            .wishlist-card .d-flex.gap-2 {
              gap: 8px !important;
            }
          }

          @media (max-width: 380px) {
            .wishlist-card .p-3 {
              padding: 12px !important;
            }
            .wishlist-card img {
              max-height: 140px !important;
            }
            .wishlist-card .fs-4 {
              font-size: 0.85rem !important;
            }
            .wishlist-card .bg-gradient.btn {
              padding: 4px 8px;
              font-size: 10px;
              border-radius: 20px !important;
              min-width: 80px;
            }
            .wishlist-card .d-flex.gap-2 {
              gap: 6px !important;
            }
          }

          @media (max-width: 320px) {
            .wishlist-card .bg-gradient.btn {
              padding: 4px 6px;
              font-size: 9px;
              border-radius: 20px !important;
              min-width: 70px;
            }
            .wishlist-card .btn-outline-danger.rounded-pill,
            .wishlist-card .btn-outline-dark.rounded-pill {
              font-size: 9px;
              padding: 4px 8px;
            }
          }

          /* Ensure buttons always have border-radius */
          .bg-gradient.btn {
            border-radius: 20px !important;
          }
          
          .btn-outline-danger.rounded-pill,
          .btn-outline-dark.rounded-pill {
            border-radius: 20px !important;
          }
        `}
      </style>

      <div className="container mt-4">
        <ToastContainer position="top-center" autoClose={2000} />
        <h3 className="mb-3">Your Wishlist ❤️</h3>

        {!items || items.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>No items in wishlist</p>
            <button className="btn btn-danger mt-3" onClick={() => navigate('/')}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {items.map((item) => (
              <div className="col-12 col-lg-10 mx-auto wishlist-card" key={item._id}>
                <div
                  className="card border-0 shadow-sm p-3"
                  style={{ borderRadius: "10px", background: "#f8f9fa" }}
                >
                  <div className="row align-items-center">
                    <div className="col-12 col-md-6 d-flex justify-content-center mb-3 mb-md-0">
                      <div onClick={() => handleProductClick(item._id)} style={{ cursor: "pointer" }}>
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          style={{
                            maxHeight: "180px",
                            width: "100%",
                            objectFit: "contain",
                            borderRadius: "8px",
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 text-center text-md-start">
                      <div
                        onClick={() => handleProductClick(item._id)}
                        style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
                      >
                        <h6 className="card-title fs-4 fw-normal mb-2 hover-title">
                          {item.title}
                        </h6>
                      </div>
                      
                      {/* Rating Section - Stars hidden on mobile, only dropdown visible */}
                      <div className="text-warning mb-1 position-relative d-flex justify-content-center justify-content-md-start">
                        <div className="d-inline-block rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(item.rating || 4) ? "text-warning" : "text-secondary"}>
                              {i < Math.floor(item.rating || 4) ? "★" : "☆"}
                            </span>
                          ))}
                        </div>

                        <div className="dropdown d-inline-block ms-2" id={`rating-dropdown-${item._id}`}>
                          <button
                            className="btn btn-sm p-0 border-0 bg-transparent dropdown-toggle"
                            type="button"
                            style={{ fontSize: '17px' }}
                            onMouseEnter={(e) => {
                              const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                              dropdown.classList.add('show');
                              dropdown.querySelector('.dropdown-menu').classList.add('show');
                            }}
                            onMouseLeave={(e) => {
                              const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                              dropdown.classList.remove('show');
                              dropdown.querySelector('.dropdown-menu').classList.remove('show');
                            }}
                          >
                            {item.rating || 4}
                          </button>

                          <div
                            className="dropdown-menu p-3"
                            style={{ minWidth: '250px' }}
                            onMouseEnter={(e) => {
                              const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                              dropdown.classList.add('show');
                              e.currentTarget.classList.add('show');
                            }}
                            onMouseLeave={(e) => {
                              const dropdown = document.getElementById(`rating-dropdown-${item._id}`);
                              dropdown.classList.remove('show');
                              e.currentTarget.classList.remove('show');
                            }}
                          >
                            <div className="d-flex align-items-center mb-2">
                              <span className="fw-bold fs-5 me-2">{item.rating || 4}</span>
                              <div className="text-warning">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < Math.floor(item.rating || 4) ? "★" : "☆"}
                                  </span>
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
                                      <div
                                        className="progress-bar bg-warning"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
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

                      <div className="d-flex align-items-center mb-1 flex-wrap justify-content-center justify-content-md-start">
                        <h5 className="text-black fs-4 fw-normal d-flex align-items-center mb-0">
                          <span style={{ fontSize: "15px" }}>₹</span>{item.price}
                        </h5>
                        <div className="text-muted small ms-2">
                          M.R.P:{" "}
                          <span className="text-decoration-line-through">
                            ₹{Math.round(item.price * 1.3)}
                          </span>{" "}
                          <span className="text-success">(Save {Math.round((item.discountPercentage || 20))}%)</span>
                        </div>
                      </div>

                      <p className="text-muted small fw-light mb-1 text-center text-md-start">
                        <b>Easy 7-day returns on Zenvy</b>
                      </p>

                      <p className="d-flex align-items-center mb-2 justify-content-center justify-content-md-start">
                        <i
                          className="bi bi-check fs-5 me-1"
                          style={{ color: "#6a11cb" }}
                        ></i>
                        <span className="fw-bold" style={{ color: "#6a11cb" }}>
                          Zenvy Assured
                        </span>
                      </p>

                      <div className="d-flex gap-2 mt-2 justify-content-center justify-content-md-start">
                        <button className="bg-gradient btn btn-outline-danger rounded-pill">
                          Add to Cart
                        </button>

                        <button
                          className="bg-gradient btn btn-outline-dark rounded-pill"
                          onClick={() => removeFromWishlist(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default WishList; 