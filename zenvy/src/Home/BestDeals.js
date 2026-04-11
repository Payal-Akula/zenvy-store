/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../Navbar/CartProcess/CartContext";  

function BestDeal() {
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();  

  const API_URL = "https://zenvy-store.onrender.com";

  useEffect(() => {
    fetchDeals();
    fetchWishlist();
  }, []);

  const fetchDeals = async () => {
    try {
      console.log("Fetching from:", `${API_URL}/api/best/deals`);
      const res = await fetch(`${API_URL}/api/best/deals`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Deals fetched:", data);
      setDeals(Array.isArray(data) ? data : []);

      if (!data || data.length === 0) {
        toast.info("No active deals found. Add some deals to the database.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load deals. Please check backend");
    }
  };

  const fetchWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/api/wishlist/${userId}`);
      const data = await res.json();
      console.log("Wishlist data:", data);

      if (Array.isArray(data)) {
        setWishlist(data.map((item) => item._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      deals.forEach((deal) => {
        if (!deal.dealEnd) return;
        const end = new Date(deal.dealEnd);
        const now = new Date();
        const diff = end - now;
        if (diff > 0) {
          updated[deal._id] = {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
            mins: Math.floor((diff / (1000 * 60)) % 60),
            secs: Math.floor((diff / 1000) % 60),
          };
        }
      });
      setTimeLeft(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [deals]);

  const toggleWishlist = async (productId) => {
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !userId) {
      toast.error("Please login first ❌");
      navigate("/signin");
      return;
    }

    setLoading(true);
    try {
      const isWishlisted = wishlist.includes(productId);
      const url = isWishlisted
        ? `${API_URL}/api/wishlist/remove`
        : `${API_URL}/api/wishlist/add`;

      console.log("Toggling wishlist:", { userId, productId, isWishlisted, url });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const result = await res.json();
      console.log("Wishlist response:", result);

      if (res.ok) {
        if (isWishlisted) {
          setWishlist(wishlist.filter((id) => id !== productId));
          toast.info("Removed from wishlist");
        } else {
          setWishlist([...wishlist, productId]);
          toast.success("Added to wishlist ❤️");
        }
        await fetchWishlist();
      } else {
        toast.error(result.message || "Failed to update wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    } finally {
      setLoading(false);
    }
  };

  const openPreview = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Updated addToCart function using CartContext
  const addToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !userId) {
      toast.error("Please login first ❌");
      navigate("/signin");
      return;
    }

    try {
      console.log("Adding to cart via context:", { userId, productId: product._id });
      
      // Use CartContext addToCart function
      await addToCartContext({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        quantity: 1
      });
      
      toast.success(`${product.title} added to cart 🛒`);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Server error. Please try again.");
    }
  };

  const firstTimer = Object.values(timeLeft)[0];

  return (
    <>
      <style>
        {`
          .best-deals-section {
            background: #f5f5f5;
            padding: 40px 0;
          }
          
          .deal-box {
            background: #fff;
            padding: 30px 20px;
            text-align: center;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            height:425px;
          }
          
          .deal-box h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #1a1a1a;
          }
          
          .deal-box p {
            color: #666;
            font-size: 14px;
            margin-bottom: 25px;
          }
          
          .timer {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 25px;
          }
          
          .timer div {
            background: #2c2c2c;
            color: #fff;
            padding: 12px 8px;
            border-radius: 8px;
            min-width: 65px;
            font-weight: 700;
            font-size: 24px;
            text-align: center;
          }
          
          .timer span {
            display: block;
            font-size: 10px;
            font-weight: 400;
            margin-top: 4px;
            color: #ccc;
          }
          
          .deal-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            position: relative;
            height: 100%;
          }
          
          .deal-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border:1px solid black;
          }
          
          .card-image-wrapper {
            position: relative;
            overflow: hidden;
            background: #f8f8f8;
            padding: 20px;
            height: 250px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .card-image-wrapper img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: transform 0.3s ease;
            cursor: pointer;
          }
          
          .deal-card:hover .card-image-wrapper img {
            transform: scale(1.05);
          }
          
          .sale-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background: #dc3545;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 2;
          }
          
          .hover-icons {
            position: absolute;
            top: 15px;
            right: -40px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: 0.3s ease;
            z-index: 2;
          }
          
          .deal-card:hover .hover-icons {
            right: 15px;
          }
          
          .hover-icons i {
            background: #fff;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.2s;
            font-size: 16px;
          }
          
          .hover-icons i:hover {
            background: #dc3545;
            color: white;
            transform: scale(1.1);
          }
          
          .card-content {
            padding: 16px;
          }
          
          .card-content h6 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            cursor: pointer;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: #1a1a1a;
          }
          
          .card-content h6:hover {
            color: #dc3545;
          }
          
          .rating {
            margin-bottom: 8px;
            font-size: 12px;
          }
          
          .price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .current-price {
            color: #dc3545;
            font-weight: 700;
            font-size: 18px;
          }
          
          .old-price {
            color: #999;
            text-decoration: line-through;
            font-size: 13px;
            margin-left: 8px;
          }
          
          .add-to-cart-btn {
            width: 100%;
            background: #fff;
            border: 1px solid #dc3545;
            color: #dc3545;
            padding: 8px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s;
          }
          
          .add-to-cart-btn:hover {
            background: #dc3545;
            color: white;
          }
          
          .add-to-cart-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.85);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
          }
          
          .preview-content {
            background: #fff;
            max-width: 1000px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            border-radius: 20px;
            position: relative;
            animation: slideUp 0.3s ease;
          }
          
          .close-modal {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 32px;
            cursor: pointer;
            color: #333;
            z-index: 10;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          
          .close-modal:hover {
            color: #dc3545;
            transform: scale(1.1);
          }
          
          .modal-product-image {
            background: #f8f8f8;
            padding: 30px;
            border-radius: 16px;
            text-align: center;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .modal-product-image img {
            max-width: 100%;
            max-height: 350px;
            object-fit: contain;
          }
          
          .modal-product-details h3 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
          }
          
          .modal-rating {
            margin-bottom: 15px;
          }
          
          .modal-price {
            font-size: 28px;
            font-weight: 700;
            color: #dc3545;
            margin-bottom: 15px;
          }
          
          .modal-old-price {
            font-size: 18px;
            color: #999;
            text-decoration: line-through;
            margin-left: 10px;
            font-weight: 400;
          }
          
          .modal-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          
          .modal-buttons {
            display: flex;
            gap: 12px;
          }
          
          .modal-cart-btn {
            flex: 1;
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 30px;
            font-weight: 600;
          }
          
          .modal-wishlist-btn {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 1px solid #ddd;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @media (max-width: 768px) {
            .timer div {
              min-width: 55px;
              font-size: 18px;
              padding: 8px;
            }
            .card-image-wrapper {
              height: 200px;
            }
            .modal-product-image img {
              max-height: 250px;
            }
            .modal-product-details h3 {
              font-size: 20px;
            }
            .modal-price {
              font-size: 24px;
            }
          }
          
          @media (max-width: 576px) {
            .deal-box h2 {
              font-size: 22px;
            }
            .timer {
              gap: 8px;
            }
            .timer div {
              min-width: 50px;
              font-size: 16px;
            }
          }
            .carousel-wrapper {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px;
}

.carousel-wrapper::-webkit-scrollbar {
  height: 8px;
}

.carousel-wrapper::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.carousel-item-custom {
  min-width: 260px;
  max-width: 260px;
  flex: 0 0 auto;
}

.deal-info-card {
  min-width: 300px;
  max-width: 300px;
}
        `}
      </style>

      <ToastContainer position="top-center" autoClose={2000} />

      <div className="best-deals-section">
        <div className="container">
          <div className="carousel-wrapper">
            {/* LEFT SIDE DEAL BOX */}
            <div className="carousel-item-custom deal-info-card">
              <div className="deal-box">
                <div className="mt-5">
                  <h2>Today's Best Deals</h2>
                  <p>Limited time offers</p>
                  <div className="timer">
                    {firstTimer ? (
                      <>
                        <div>{firstTimer.days}<span>DAYS</span></div>
                        <div>{firstTimer.hrs}<span>HR</span></div>
                        <div>{firstTimer.mins}<span>MINS</span></div>
                        <div>{firstTimer.secs}<span>SECS</span></div>
                      </>
                    ) : (
                      <>
                        <div>00<span>DAYS</span></div>
                        <div>00<span>HR</span></div>
                        <div>00<span>MINS</span></div>
                        <div>00<span>SECS</span></div>
                      </>
                    )}
                  </div>
                  <button className="btn btn-outline-danger mt-3 w-100 rounded-pill">
                    See All
                  </button>
                </div>
              </div>
            </div>

            {/* PRODUCT CARDS */}
            {deals.map((item) => {
              const expired = item.dealEnd ? new Date(item.dealEnd) < new Date() : true;
              const isWishlisted = wishlist.includes(item._id);

              return (
                <div className="carousel-item-custom" key={item._id}>
                  <div className="deal-card">
                    <span className="sale-badge">SALE</span>
                    <div className="card-image-wrapper">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        onClick={() => navigate(`/productpage/${item._id}`)}
                      />
                    </div>
                    <div className="hover-icons">
                      <i
                        className={`bi ${isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"}`}
                        onClick={() => toggleWishlist(item._id)}
                      />
                      <i className="bi bi-eye" onClick={() => openPreview(item)} />
                    </div>
                    <div className="card-content">
                      <h6 onClick={() => navigate(`/productpage/${item._id}`)}>{item.title}</h6>
                      <div className="rating text-warning">
                        {"★".repeat(Math.floor(item.rating || 4))}
                        {"☆".repeat(5 - Math.floor(item.rating || 4))}
                        <span className="text-muted ms-1">({item.rating || 4})</span>
                      </div>
                      <div className="price-section">
                        <div>
                          <span className="current-price">${item.price}</span>
                          <span className="old-price">${item.discountedTotal}</span>
                        </div>
                        <span className="text-success small">-{item.discountPercentage || 20}%</span>
                      </div>
                      <button
                        className="add-to-cart-btn"
                        disabled={expired}
                        onClick={() => addToCart(item)}
                      >
                        <i className="bi bi-cart me-2"></i>
                        {expired ? "Expired" : "Add To Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {showModal && selectedProduct && (
        <div className="preview-modal" onClick={closeModal}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={closeModal}>&times;</span>
            <div className="p-4">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="modal-product-image">
                    <img src={selectedProduct.thumbnail} alt={selectedProduct.title} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="modal-product-details">
                    <h3>{selectedProduct.title}</h3>
                    <div className="modal-rating text-warning">
                      {"★".repeat(Math.floor(selectedProduct.rating || 4))}
                      {"☆".repeat(5 - Math.floor(selectedProduct.rating || 4))}
                      <span className="text-muted ms-2">({selectedProduct.rating || 4} stars)</span>
                    </div>
                    <div className="modal-price">
                      ${selectedProduct.price}
                      <span className="modal-old-price">${selectedProduct.discountedTotal}</span>
                      <span className="text-success ms-2">-{selectedProduct.discountPercentage || 20}%</span>
                    </div>
                    <div className="modal-description">
                      {selectedProduct.description || "Lorem ipsum dolor sit amet, consectetur adipisicing elit..."}
                    </div>
                    <div className="modal-buttons">
                      <button
                        className="modal-cart-btn"
                        onClick={() => {
                          addToCart(selectedProduct);
                          closeModal();
                        }}
                      >
                        <i className="bi bi-cart me-2"></i> Add To Cart
                      </button>
                      <button
                        className="modal-wishlist-btn"
                        onClick={() => toggleWishlist(selectedProduct._id)}
                      >
                        <i className={`bi ${wishlist.includes(selectedProduct._id) ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BestDeal;