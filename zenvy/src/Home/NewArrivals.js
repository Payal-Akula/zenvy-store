/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../Navbar/CartProcess/CartContext";

function NewArrivals() {
  const [arrivals, setArrivals] = useState([]);
  const [filteredArrivals, setFilteredArrivals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Smartphone & Tablet");
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();

  const API_URL = "http://localhost:2000";

  const categories = ["Fashion", "Furniture & Decor", "Health & Beauty", "Smartphone & Tablet", "Electronics"];

  // Dynamic feature images per category
  const categoryFeatureImages = {
    "Smartphone & Tablet": "https://img.global.news.samsung.com/in/wp-content/uploads/2018/10/1572_S9-Plus-Burgundy-Poster-19x29-01.jpg",
    "Fashion": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/fashion-sale-design-template-c49bdd7e3bd3064cc432c526939283f5_screen.jpg?ts=1714939206",
    "Furniture & Decor": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/furniture-design-template-b59252b49290523f8a071e81b74fd915_screen.jpg?ts=1659952489",
    "Health & Beauty": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/skin-care-flyer-template-design-0b7f8500a2364c4e35df92ffdbf09a71_e008c90b1080e890897228c9683cc984_screen.png?ts=1760192749",
    "Electronics": "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/tablet-pc-electronic-promotion-poster-flyer-design-template-6f7a9b686c7c30f360351730a66317b6_screen.jpg?ts=1721889083"
  };

  // Category-specific product IDs for banner navigation
  const categoryBannerLinks = {
    "Smartphone & Tablet": "/productpage/69d3c2e6b8f98eb810d65f83",
    "Fashion": "/productpage/69d40d1a2e67d43615935376",
    "Furniture & Decor": "/productpage/69d54c51943207e650e4a54a",
    "Health & Beauty": "/productpage/69d55a357cedcd40dae88150",
    "Electronics": "/productpage/69d61a1d5550ae7901aa74bc"
  };

  useEffect(() => {
    fetchArrivals();
    fetchWishlist();
  }, []);

  const fetchArrivals = async () => {
    try {
      console.log("Fetching from:", `${API_URL}/api/unified/category/Smartphone%20&%20Tablet`);
      const res = await fetch(`${API_URL}/api/unified/category/Smartphone%20&%20Tablet`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      console.log("Smartphone & Tablet products fetched:", responseData);
      
      const arrivalsArray = Array.isArray(responseData) ? responseData : [];
      setArrivals(arrivalsArray);
      setFilteredArrivals(arrivalsArray);
      
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load new arrivals");
    }
  };

  const fetchWishlist = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const res = await fetch(`${API_URL}/api/wishlist/${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setWishlist(data.map((item) => item._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

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

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      if (res.ok) {
        if (isWishlisted) {
          setWishlist(wishlist.filter((id) => id !== productId));
          toast.info("Removed from wishlist");
        } else {
          setWishlist([...wishlist, productId]);
          toast.success("Added to wishlist ❤️");
        }
        await fetchWishlist();
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

  const addToCart = async (product) => {
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !userId) {
      toast.error("Please login first ❌");
      navigate("/signin");
      return;
    }

    try {
      await addToCartContext({
        id: product._id,
        title: product.title,
        price: product.price,
        image: product.thumbnail,
        quantity: 1
      });
      toast.success(`${product.title.substring(0, 30)}... added to cart 🛒`);
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Server error. Please try again.");
    }
  };

  const filterByCategory = async (category) => {
    setActiveCategory(category);
    setLoading(true);
    
    try {
      const encodedCategory = encodeURIComponent(category);
      const url = `${API_URL}/api/unified/category/${encodedCategory}`;
      console.log("Filtering by category:", url);
      
      const res = await fetch(url);
      const data = await res.json();
      console.log(`Products for ${category}:`, data);
      
      setFilteredArrivals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error filtering by category:", err);
      toast.error("Failed to load category products");
      setFilteredArrivals([]);
    } finally {
      setLoading(false);
    }
  };

  const truncateTitle = (title, maxLength = 35) => {
    if (!title) return "Product";
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  return (
    <>
      <style>
        {`
          .new-arrivals-section {
            background: #fff;
            padding: 40px 0;
          }
          
          .section-title {
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #1a1a1a;
          }
          
          .section-subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
          }
          
          .category-tabs {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-bottom: 40px;
            flex-wrap: wrap;
          }
          
          .category-tab {
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            padding: 8px 0;
            transition: all 0.3s ease;
            position: relative;
          }
          
          .category-tab:hover {
            color: #dc3545;
          }
          
          .category-tab.active {
            color: #dc3545;
          }
          
          .category-tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #dc3545;
          }

          /* Elegant Marquee Styles */
          .elegant-marquee {
            background: linear-gradient(90deg, #fff 0%, #fef5f5 50%, #fff 100%);
            border-top: 1px solid #dc3545;
            border-bottom: 1px solid #dc3545;
            padding: 25px 0;
            margin: 20px 0 30px 0;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.08);
          }

          .elegant-marquee::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(220, 53, 69, 0.05), transparent);
            animation: shine 3s infinite;
          }

          @keyframes shine {
            0% { left: -100%; }
            20% { left: 100%; }
            100% { left: 100%; }
          }

          .marquee-track {
            display: inline-flex;
            white-space: nowrap;
            animation: scrollMarquee 30s linear infinite;
          }

          .marquee-track:hover {
            animation-play-state: paused;
          }

          @keyframes scrollMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .marquee-item {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 0 30px;
          }

          .marquee-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #dc3545, #b02a37);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
          }

          .marquee-text {
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
            letter-spacing: 0.5px;
          }

          .marquee-highlight {
            color: #dc3545;
            font-weight: 700;
            margin: 0 4px;
          }

          .marquee-code {
            background: #f0f0f0;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 700;
            color: #dc3545;
            letter-spacing: 0.5px;
          }

          .marquee-divider {
            width: 4px;
            height: 4px;
            background: #dc3545;
            border-radius: 50%;
            display: inline-block;
            margin: 0 15px;
            opacity: 0.5;
          }

          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }

          @media (max-width: 992px) {
            .marquee-text {
              font-size: 12px;
            }
            .marquee-icon {
              width: 28px;
              height: 28px;
              font-size: 12px;
            }
            .marquee-code {
              font-size: 11px;
              padding: 3px 10px;
            }
            .marquee-item {
              padding: 0 20px;
            }
          }

          @media (max-width: 768px) {
            .marquee-text {
              font-size: 10px;
            }
            .marquee-icon {
              width: 24px;
              height: 24px;
              font-size: 10px;
            }
            .marquee-code {
              font-size: 9px;
              padding: 2px 8px;
            }
            .marquee-item {
              padding: 0 15px;
            }
            .marquee-divider {
              margin: 0 10px;
            }
          }
          
          .arrivals-grid {
            display: grid;
            grid-template-columns: 2.6fr repeat(4, 1fr);
            gap: 20px;
          }
          
          .hero-banner {
            grid-row: span 2;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
          }
          
          .hero-banner:hover {
            transform: translateY(-5px);
          }
          
          .hero-banner img {
            max-width: 100%;
            width: 100%;
            height: 100%;
            object-fit: fit;
            transition: transform 0.3s ease;
          }
          
          .hero-banner:hover img {
            transform: scale(1.02);
          }
          
          .arrival-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            position: relative;
            border: 1px solid transparent;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .arrival-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
          }
          
          .card-image-wrapper {
            position: relative;
            overflow: hidden;
            background: #f8f8f8;
            padding: 20px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
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
          
          .arrival-card:hover .card-image-wrapper img {
            transform: scale(1.05);
          }
          
          .new-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #28a745;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            z-index: 2;
          }
          
          .hover-icons {
            position: absolute;
            top: 10px;
            right: -40px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            transition: 0.3s ease;
            z-index: 2;
          }
          
          .arrival-card:hover .hover-icons {
            right: 10px;
          }
          
          .hover-icons i {
            background: #fff;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.2s;
            font-size: 14px;
          }
          
          .hover-icons i:hover {
            background: #dc3545;
            color: white;
            transform: scale(1.1);
          }
          
          .card-content {
            padding: 12px;
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .card-content h6 {
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 6px;
            cursor: pointer;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: #1a1a1a;
            min-height: 36px;
          }
          
          .card-content h6:hover {
            color: #dc3545;
          }
          
          .rating {
            margin-bottom: 6px;
            font-size: 11px;
          }
          
          .price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 5px;
          }
          
          .current-price {
            color: #dc3545;
            font-weight: 700;
            font-size: 16px;
          }
          
          .old-price {
            color: #999;
            text-decoration: line-through;
            font-size: 12px;
          }
          
          .add-to-cart-btn {
            width: 100%;
            background: #f8f9fa;
            border: 1px solid #ddd;
            color: #333;
            padding: 6px;
            border-radius: 25px;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s;
            cursor: pointer;
            margin-top: auto;
          }
          
          .add-to-cart-btn:hover {
            background: #dc3545;
            color: white;
            border-color: #dc3545;
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
            max-width: 900px;
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
            font-size: 28px;
            cursor: pointer;
            color: #333;
            z-index: 10;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          
          .close-modal:hover {
            color: #dc3545;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          /* Responsive Styles */
          @media (max-width: 1200px) {
            .arrivals-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .hero-banner {
              grid-column: span 2;
              grid-row: span 1;
              height: 250px;
            }
          }
          
          @media (max-width: 768px) {
            .arrivals-grid {
              grid-template-columns: 1fr;
            }
            .hero-banner {
              grid-column: span 1;
              height: 200px;
            }
            .category-tabs {
              gap: 15px;
            }
            .category-tab {
              font-size: 14px;
            }
          }
          
          @media (max-width: 576px) {
            .section-title {
              font-size: 24px;
            }
            .hero-banner {
              height: 160px;
            }
          }
        `}
      </style>

      <ToastContainer position="top-center" autoClose={2000} />

      <div className="new-arrivals-section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Discover our latest products</p>

          <div className="category-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => filterByCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

         

          <div className="arrivals-grid">
            {/* HERO BANNER - Dynamic based on active category */}
            <div className="hero-banner" onClick={() => navigate(categoryBannerLinks[activeCategory])}>
              <img src={categoryFeatureImages[activeCategory]} alt={activeCategory} />
            </div>

            {/* PRODUCTS */}
            {loading ? (
              <div className="text-center py-5 col-12">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              filteredArrivals.map((item) => {
                const isWishlisted = wishlist.includes(item._id);
                const discountedPrice = item.discountedTotal || item.price;
                const originalPrice = item.total || Math.round(item.price / (1 - (item.discountPercentage / 100)));

                return (
                  <div className="arrival-card" key={item._id}>
                    <span className="new-badge">NEW</span>

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
                      <h6 onClick={() => navigate(`/productpage/${item._id}`)}>
                        {truncateTitle(item.title, 35)}
                      </h6>

                      <div className="rating text-warning">
                        {"★".repeat(Math.floor(item.rating || 4))}
                        {"☆".repeat(5 - Math.floor(item.rating || 4))}
                        <span className="text-muted ms-1">({item.rating || 4})</span>
                      </div>

                      <div className="price-section">
                        <div>
                          <span className="current-price">₹{discountedPrice}</span>
                          {item.discountPercentage > 0 && (
                            <span className="old-price">₹{originalPrice}</span>
                          )}
                        </div>
                        {item.discountPercentage > 0 && (
                          <span className="text-success small">
                            -{Math.round(item.discountPercentage)}%
                          </span>
                        )}
                      </div>

                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(item)}
                      >
                        <i className="bi bi-cart me-2"></i> Add To Cart
                      </button>
                    </div>
                  </div>
                );
              })
            )}
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
                    <h3>{truncateTitle(selectedProduct.title, 50)}</h3>
                    <div className="modal-price">
                      ₹{selectedProduct.discountedTotal || selectedProduct.price}
                    </div>
                    <div className="modal-description">
                      {selectedProduct.description || "Discover our latest arrival."}
                    </div>
                    <div className="modal-buttons">
                      <button className="modal-cart-btn" onClick={() => { addToCart(selectedProduct); closeModal(); }}>
                        Add To Cart
                      </button>
                      <button className="modal-wishlist-btn" onClick={() => toggleWishlist(selectedProduct._id)}>
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
       {/* ELEGANT PROFESSIONAL MARQUEE */}
          <div className="elegant-marquee">
            <div className="marquee-track">
              {/* First set */}
              <div className="marquee-item">
                <span className="marquee-icon">⚡</span>
                <span className="marquee-text">LIMITED TIME OFFER</span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">FLAT <span className="marquee-highlight">50% OFF</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">FREE <span className="marquee-highlight">SHIPPING</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">USE CODE: <span className="marquee-code">ZENVY10</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">UP TO <span className="marquee-highlight">20% CASHBACK</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">SHOP <span className="marquee-highlight">NOW</span> →</span>
              </div>
              {/* Duplicate for seamless loop */}
              <div className="marquee-item">
                <span className="marquee-icon">⚡</span>
                <span className="marquee-text">LIMITED TIME OFFER</span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">FLAT <span className="marquee-highlight">50% OFF</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">FREE <span className="marquee-highlight">SHIPPING</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">USE CODE: <span className="marquee-code">ZENVY10</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">UP TO <span className="marquee-highlight">20% CASHBACK</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">SHOP <span className="marquee-highlight">NOW</span> →</span>
              </div>
              <div className="marquee-item">
                <span className="marquee-icon">⚡</span>
                <span className="marquee-text">LIMITED TIME OFFER</span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">FLAT <span className="marquee-highlight">50% OFF</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">FREE <span className="marquee-highlight">SHIPPING</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">USE CODE: <span className="marquee-code">ZENVY10</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">UP TO <span className="marquee-highlight">20% CASHBACK</span></span>
                <span className="marquee-divider"></span>
                <span className="marquee-text">SHOP <span className="marquee-highlight">NOW</span> →</span>
              </div>
            </div>
          </div>
    </>
  );
}

export default NewArrivals;