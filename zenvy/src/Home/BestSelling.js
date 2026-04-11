/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../Navbar/CartProcess/CartContext";

function BestSelling() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { addToCart: addToCartContext } = useCart();
  const API_URL = "https://zenvy-store.onrender.com";

  const categories = [
    { name: "Furniture & Decor", path: "/furniture", endpoint: "/api/unified/furniture" },
    { name: "Electronics", path: "/electronics", endpoint: "/api/unified/electronics" },
    { name: "Fashion", path: "/fashion", endpoint: "/api/unified/fashion" },
    { name: "Jewelry", path: "/jewelry", endpoint: "/api/unified/jewelry" },
    { name: "Smartphones", path: "/smartphone", endpoint: "/api/unified/smartphone-tablet" }
  ];

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productPromises = categories.map(async (cat) => {
        try {
          const res = await fetch(`${API_URL}${cat.endpoint}`);
          const data = await res.json();
          if (data && data.length > 0) {
            return {
              ...data[0],
              categoryPath: cat.path,
              categoryName: cat.name
            };
          }
          return null;
        } catch {
          return null;
        }
      });
      const results = await Promise.all(productPromises);
      setProducts(results.filter(Boolean).slice(0, 4));
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
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
    } catch {}
  };

  const toggleWishlist = async (productId) => {
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !userId) {
      toast.error("Please login first ❌");
      navigate("/signin");
      return;
    }
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
        setWishlist(prev =>
          isWishlisted ? prev.filter(id => id !== productId) : [...prev, productId]
        );
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
      }
    } catch {
      toast.error("Wishlist error");
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
      toast.error("Login first ❌");
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
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const totalSlides = 2;
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [products, totalSlides]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const truncateTitle = (title, maxLength = 30) => {
    if (!title) return "Product";
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .best-selling-section {
          padding: 60px 0;
          background: #f8f9fa;
        }
        .section-title {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 40px;
          color: #1a1a1a;
          position: relative;
        }
        .section-title:after {
          content: '';
          display: block;
          width: 60px;
          height: 3px;
          background: #dc3545;
          margin: 15px auto 0;
          border-radius: 2px;
        }

        /* Brand Logos Section */
        .brand-logos-container {
          margin-top: 60px;
          padding: 40px 0;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          border-radius: 16px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.04);
        }

        .brand-logos-wrapper {
          overflow: hidden;
          position: relative;
        }

        .brand-logos-track {
          display: flex;
          align-items: center;
          gap: 80px;
          animation: scrollLogos 30s linear infinite;
          width: max-content;
          padding: 10px 0;
        }

        .brand-logos-track:hover {
          animation-play-state: paused;
        }

        .brand-logo {
          flex-shrink: 0;
          height: 65px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 20px;
          border: 1px solid transparent;
          border-radius: 12px;
          transition: all 0.4s ease;
          background: #fafafa;
        }

        .brand-logo:hover {
          border-color: #dc3545;
          background: #fff;
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.1);
        }

        .brand-logo img {
          max-height: 100%;
          max-width: 150px;
          object-fit: contain;
          transition: all 0.4s ease;
        }

        .brand-logo:hover img {
          filter: grayscale(0%);
        }

        @keyframes scrollLogos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Showcase Container */
        .showcase-container {
          display: flex;
          gap: 30px;
          align-items: stretch;
        }
        
        .carousel-section {
          flex: 1;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          min-height: 480px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .carousel-slides {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }
        
        .carousel-slide.active {
          opacity: 1;
          z-index: 1;
        }
        
        .carousel-product-card {
          position: relative;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #eee;
        }
        
        .carousel-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          border-color: #dc3545;
        }
        
        .carousel-product-card img {
          width: 100%;
          height: 280px;
          object-fit: contain;
          background: #f8f9fa;
          padding: 20px;
          transition: transform 0.5s ease;
        }
        
        .carousel-slide:hover .carousel-product-card img {
          transform: scale(1.03);
        }
        
        .carousel-product-info {
          padding: 15px;
          background: white;
          border-top: 1px solid #eee;
        }
        
        .carousel-product-info h4 {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1a1a1a;
          transition: color 0.3s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 40px;
        }
        
        .carousel-product-info h4:hover {
          color: #dc3545;
        }
        
        .carousel-product-info .price {
          color: #dc3545;
          font-weight: 700;
          font-size: 18px;
        }
        
        .carousel-product-info .category-tag {
          display: inline-block;
          background: #f0f0f0;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          color: #666;
          margin-top: 10px;
        }
        
        .carousel-hover-icons {
          position: absolute;
          top: 15px;
          right: -50px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: 0.3s ease;
          z-index: 10;
        }
        
        .carousel-product-card:hover .carousel-hover-icons {
          right: 15px;
        }
        
        .carousel-hover-icons i {
          background: #fff;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          transition: all 0.2s;
          font-size: 16px;
        }
        
        .carousel-hover-icons i:hover {
          background: #dc3545;
          color: white;
          transform: scale(1.1);
        }
        
        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0,0,0,0.6);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          z-index: 10;
          color: white;
        }
        
        .carousel-control:hover {
          background: #dc3545;
        }
        
        .carousel-control.prev {
          left: 10px;
        }
        
        .carousel-control.next {
          right: 10px;
        }
        
        .banner-section {
          flex: 1;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          min-height: 480px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
        
        .banner-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .banner-section:hover img {
          transform: scale(1.05);
        }
        
        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 30px;
        }
        
        .banner-overlay h2 {
          font-size: 38px;
          font-weight: 800;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .banner-overlay p {
          font-size: 18px;
          margin-bottom: 30px;
        }
        
        .banner-btn {
          background: #dc3545;
          color: white;
          border: none;
          padding: 12px 35px;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }
        
        .banner-btn:hover {
          background: white;
          color: #dc3545;
          transform: translateY(-3px);
        }
        
        .banner-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: #dc3545;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 2;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
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
        
        .modal-product-image {
          background: #f8f8f8;
          padding: 30px;
          border-radius: 16px;
          text-align: center;
        }
        
        .modal-product-image img {
          max-width: 100%;
          max-height: 300px;
          object-fit: contain;
        }
        
        .modal-product-details h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 10px;
        }
        
        .modal-price {
          font-size: 26px;
          font-weight: 700;
          color: #dc3545;
          margin-bottom: 15px;
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
          cursor: pointer;
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
          cursor: pointer;
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
          .carousel-product-card img {
            height: 240px;
          }
          .brand-logo {
            height: 55px;
          }
          .brand-logo img {
            max-width: 120px;
          }
        }

        @media (max-width: 992px) {
          .showcase-container {
            flex-direction: column;
          }
          .carousel-section, .banner-section {
            min-height: auto;
          }
          .carousel-product-card img {
            height: 220px;
          }
          .banner-overlay h2 {
            font-size: 28px;
          }
          .brand-logos-track {
            gap: 60px;
          }
        }
        
        @media (max-width: 768px) {
          .carousel-section {
            min-height: auto;
          }
          .carousel-slide .row {
            flex-direction: column;
          }
          .carousel-slide .col-6 {
            width: 100%;
            margin-bottom: 15px;
          }
          .carousel-product-card img {
            height: 200px;
          }
          .banner-section {
            min-height: 300px;
          }
          .banner-overlay h2 {
            font-size: 24px;
          }
          .banner-overlay p {
            font-size: 14px;
          }
          .banner-btn {
            padding: 8px 25px;
            font-size: 12px;
          }
          .carousel-control {
            width: 35px;
            height: 35px;
            font-size: 20px;
          }
          .brand-logos-track {
            gap: 40px;
          }
          .brand-logo {
            height: 50px;
            padding: 8px 15px;
          }
          .brand-logo img {
            max-width: 100px;
          }
          .carousel-product-info h4 {
            font-size: 13px;
          }
          .carousel-product-info .price {
            font-size: 16px;
          }
        }
        
        @media (max-width: 576px) {
          .best-selling-section {
            padding: 40px 0;
          }
          .section-title {
            font-size: 24px;
            margin-bottom: 30px;
          }
          .carousel-product-card img {
            height: 180px;
            padding: 15px;
          }
          .banner-section {
            min-height: 250px;
          }
          .banner-overlay h2 {
            font-size: 20px;
          }
          .banner-btn {
            padding: 8px 20px;
            font-size: 11px;
          }
          .brand-logos-container {
            margin-top: 40px;
            padding: 25px 0;
          }
          .brand-logos-track {
            gap: 25px;
          }
          .brand-logo {
            height: 40px;
            padding: 6px 10px;
          }
          .brand-logo img {
            max-width: 80px;
          }
          .carousel-control {
            width: 30px;
            height: 30px;
            font-size: 16px;
          }
          .carousel-product-info {
            padding: 10px;
          }
          .carousel-product-info h4 {
            font-size: 12px;
            min-height: 32px;
          }
          .carousel-product-info .price {
            font-size: 14px;
          }
          .carousel-product-info .category-tag {
            font-size: 9px;
            padding: 3px 8px;
          }
        }
        
        @media (max-width: 380px) {
          .carousel-product-card img {
            height: 150px;
          }
          .brand-logo {
            height: 35px;
            padding: 5px 8px;
          }
          .brand-logo img {
            max-width: 65px;
          }
          .banner-overlay h2 {
            font-size: 16px;
          }
          .banner-overlay p {
            font-size: 11px;
            margin-bottom: 15px;
          }
          .banner-btn {
            padding: 6px 15px;
            font-size: 10px;
          }
        }
      `}</style>

      <ToastContainer position="top-center" autoClose={2000} />

      <div className="best-selling-section">
        <div className="container">
          <h2 className="section-title">Best Selling Products</h2>

          <div className="showcase-container">
            {/* LEFT SIDE - CAROUSEL */}
            <div className="carousel-section">
              <div className="carousel-slides">
                {/* SLIDE 1 */}
                <div className={`carousel-slide ${0 === currentIndex ? 'active' : ''}`}>
                  <div className="row h-100 m-0 g-2">
                    {products[0] && (
                      <div className="col-12 col-md-6 p-2 h-100">
                        <div className="carousel-product-card">
                          <div className="carousel-hover-icons">
                            <i
                              className={`bi ${wishlist.includes(products[0]._id) ? "bi-heart-fill text-danger" : "bi-heart"}`}
                              onClick={() => toggleWishlist(products[0]._id)}
                            />
                            <i className="bi bi-eye" onClick={() => openPreview(products[0])} />
                          </div>
                          <img
                            src={products[0].thumbnail}
                            alt={products[0].title}
                            onClick={() => navigate(products[0].categoryPath)}
                          />
                          <div className="carousel-product-info">
                            <h4 onClick={() => navigate(products[0].categoryPath)}>
                              {truncateTitle(products[0].title, 35)}
                            </h4>
                            <div className="price">₹{products[0].price}</div>
                            <span className="category-tag">{products[0].categoryName}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {products[1] && (
                      <div className="col-12 col-md-6 p-2 h-100">
                        <div className="carousel-product-card">
                          <div className="carousel-hover-icons">
                            <i
                              className={`bi ${wishlist.includes(products[1]._id) ? "bi-heart-fill text-danger" : "bi-heart"}`}
                              onClick={() => toggleWishlist(products[1]._id)}
                            />
                            <i className="bi bi-eye" onClick={() => openPreview(products[1])} />
                          </div>
                          <img
                            src={products[1].thumbnail}
                            alt={products[1].title}
                            onClick={() => navigate(products[1].categoryPath)}
                          />
                          <div className="carousel-product-info">
                            <h4 onClick={() => navigate(products[1].categoryPath)}>
                              {truncateTitle(products[1].title, 35)}
                            </h4>
                            <div className="price">₹{products[1].price}</div>
                            <span className="category-tag">{products[1].categoryName}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SLIDE 2 */}
                <div className={`carousel-slide ${1 === currentIndex ? 'active' : ''}`}>
                  <div className="row h-100 m-0 g-2">
                    {products[2] && (
                      <div className="col-12 col-md-6 p-2 h-100">
                        <div className="carousel-product-card">
                          <div className="carousel-hover-icons">
                            <i
                              className={`bi ${wishlist.includes(products[2]._id) ? "bi-heart-fill text-danger" : "bi-heart"}`}
                              onClick={() => toggleWishlist(products[2]._id)}
                            />
                            <i className="bi bi-eye" onClick={() => openPreview(products[2])} />
                          </div>
                          <img
                            src={products[2].thumbnail}
                            alt={products[2].title}
                            onClick={() => navigate(products[2].categoryPath)}
                          />
                          <div className="carousel-product-info">
                            <h4 onClick={() => navigate(products[2].categoryPath)}>
                              {truncateTitle(products[2].title, 35)}
                            </h4>
                            <div className="price">₹{products[2].price}</div>
                            <span className="category-tag">{products[2].categoryName}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {products[3] && (
                      <div className="col-12 col-md-6 p-2 h-100">
                        <div className="carousel-product-card">
                          <div className="carousel-hover-icons">
                            <i
                              className={`bi ${wishlist.includes(products[3]._id) ? "bi-heart-fill text-danger" : "bi-heart"}`}
                              onClick={() => toggleWishlist(products[3]._id)}
                            />
                            <i className="bi bi-eye" onClick={() => openPreview(products[3])} />
                          </div>
                          <img
                            src={products[3].thumbnail}
                            alt={products[3].title}
                            onClick={() => navigate(products[3].categoryPath)}
                          />
                          <div className="carousel-product-info">
                            <h4 onClick={() => navigate(products[3].categoryPath)}>
                              {truncateTitle(products[3].title, 35)}
                            </h4>
                            <div className="price">₹{products[3].price}</div>
                            <span className="category-tag">{products[3].categoryName}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button className="carousel-control prev" onClick={goToPrev}>‹</button>
              <button className="carousel-control next" onClick={goToNext}>›</button>
            </div>

            {/* RIGHT SIDE - BANNER */}
            <div className="banner-section" onClick={() => navigate("/offers")}>
              <span className="banner-badge">HOT DEAL</span>
              <img
                src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=600&h=450&fit=crop"
                alt="Summer Sale Banner"
              />
              <div className="banner-overlay">
                <h2>SUMMER SALE</h2>
                <p>Up to 50% off on selected items</p>
                <button className="banner-btn">Shop Collection →</button>
              </div>
            </div>
          </div>

         
        </div>
      </div>

      {/* Preview Modal */}
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
                    <div className="modal-price">₹{selectedProduct.price}</div>
                    <div className="modal-description">
                      {selectedProduct.description || "Discover amazing products from this category. Shop now for exclusive deals and discounts."}
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
       {/* Brand Logos Carousel */}
          <div className="brand-logos-container">
            <div className="brand-logos-wrapper">
              <div className="brand-logos-track">
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Vivo_logo_2019.svg/1920px-Vivo_logo_2019.svg.png" alt="vivo" />
                </div>
                <div className="brand-logo">
                  <img src="https://www.huawei.com/-/media/hcomponent-header/1.0.1.20260304161812/component/img/huawei_logo.png" alt="Huawei" />
                </div>
                <div className="brand-logo">
                  <img src="https://cdn.freebiesupply.com/images/large/2x/sony-logo-png-transparent.png" alt="Sony" />
                </div>
                <div className="brand-logo">
                  <img src="https://cdn.worldvectorlogo.com/logos/hikoki.svg" alt="Hikoki" />
                </div>
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/1280px-LG_logo_%282014%29.svg.png" alt="LG" />
                </div>
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Samsung_wordmark.svg/1280px-Samsung_wordmark.svg.png" alt="Samsung" />
                </div>
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/ThinkPad_Logo.svg/1280px-ThinkPad_Logo.svg.png" alt="ThinkPad" />
                </div>
                {/* Duplicate for seamless scroll */}
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Vivo_logo_2019.svg/1920px-Vivo_logo_2019.svg.png" alt="vivo" />
                </div>
                <div className="brand-logo">
                  <img src="https://www.huawei.com/-/media/hcomponent-header/1.0.1.20260304161812/component/img/huawei_logo.png" alt="Huawei" />
                </div>
                <div className="brand-logo">
                  <img src="https://cdn.freebiesupply.com/images/large/2x/sony-logo-png-transparent.png" alt="Sony" />
                </div>
                <div className="brand-logo">
                  <img src="https://cdn.worldvectorlogo.com/logos/hikoki.svg" alt="Hikoki" />
                </div>
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/LG_logo_%282014%29.svg/1280px-LG_logo_%282014%29.svg.png" alt="LG" />
                </div>
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Samsung_wordmark.svg/1280px-Samsung_wordmark.svg.png" alt="Samsung" />
                </div>
                <div className="brand-logo">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/ThinkPad_Logo.svg/1280px-ThinkPad_Logo.svg.png" alt="ThinkPad" />
                </div>
              </div>
            </div>
          </div>
    </>
  );
}

export default BestSelling;