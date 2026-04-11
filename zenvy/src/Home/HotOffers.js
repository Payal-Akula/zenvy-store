/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function HotOffers() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("discount");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Fetch products from BestDeals API
  useEffect(() => {
    fetchBestDeals();
  }, []);

  const fetchBestDeals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = "https://zenvy-store.onrender.com/api/best/deals";
      console.log("Fetching from:", API_URL);
      
      const response = await fetch(API_URL);
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Best Deals fetched:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        const productsWithSource = data.map(p => ({ 
          ...p, 
          source: "best_deal",
          discountPercentage: p.discountPercentage || 0
        }));
        
        setProducts(productsWithSource);
        setFilteredProducts(productsWithSource);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(productsWithSource.map(p => p.category).filter(Boolean))];
        setCategories(["all", ...uniqueCategories]);
        
        // toast.success(`🔥 Found ${productsWithSource.length} hot deals!`);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setError("No deals available at the moment");
        // toast.info("No deals available at the moment");
      }
      
    } catch (err) {
      console.error("Error fetching best deals:", err);
      setError(err.message);
    //   toast.error(`Failed to load deals: ${err.message}`);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category
  useEffect(() => {
    let filtered = [...products];
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => 
        p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Sort products
    if (sortBy === "discount") {
      filtered.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (sortBy === "price_low") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/productpage/${productId}`);
    }
  };

  const getDiscountBadge = (discount) => {
    if (!discount || discount === 0) return null;
    if (discount >= 50) return "bg-danger";
    if (discount >= 30) return "bg-warning text-dark";
    return "bg-info";
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading best deals...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill fs-1"></i>
          <h4 className="mt-2">Unable to Load Deals</h4>
          <p>{error}</p>
          <p className="text-muted small">
            Make sure your backend server is running on port 2000
          </p>
          <button 
            className="btn btn-danger mt-2"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-repeat me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    
      
      <style>
        {`
          .offer-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .offer-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          
          .discount-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            font-weight: bold;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
          }
          
          .hot-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            animation: pulse 1.5s infinite;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .product-image {
            height: 200px;
            object-fit: contain;
            padding: 20px;
            background-color: #f8f9fa;
            transition: transform 0.3s ease;
            width: 100%;
          }
          
          .offer-card:hover .product-image {
            transform: scale(1.05);
          }
          
          .price {
            font-size: 1.5rem;
            font-weight: bold;
            color: #e12727;
          }
          
          .original-price {
            text-decoration: line-through;
            font-size: 0.85rem;
            color: #999;
          }
          
          .save-amount {
            font-size: 0.8rem;
            color: #28a745;
            font-weight: 600;
          }
          
          .category-filter {
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .category-filter.active {
            background-color: #e12727;
            color: white;
            border-color: #e12727;
          }
          
          .category-filter:hover:not(.active) {
            background-color: #f8f9fa;
            border-color: #e12727;
          }
          
          @media (max-width: 768px) {
            .product-image {
              height: 160px;
            }
            .price {
              font-size: 1.2rem;
            }
          }
        `}
      </style>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav style={{ fontSize: "14px" }} className="mb-4">
          <a href="/" className="text-decoration-none text-secondary">Home</a>
          <span className="mx-2 text-secondary">›</span>
          <span className="text-danger fw-semibold">Hot Offers</span>
        </nav>

        {/* Header Section */}
        <div className="bg-danger bg-gradient rounded-3 p-4 mb-4 text-white">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold mb-2">
                🔥 Best Deals & Offers
              </h1>
              <p className="mb-0 fs-5 opacity-90">
                Limited time discounts! Grab your favorites before they're gone.
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <div className="bg-white rounded-pill px-4 py-2 text-danger">
                <i className="bi bi-tags-fill me-2"></i>
                <strong>{filteredProducts.length}</strong> Products on Sale
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {categories.length > 1 && (
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <div className="d-flex flex-wrap gap-2">
                <span className="fw-semibold me-2 mt-2">Categories:</span>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`btn btn-sm category-filter ${selectedCategory === cat ? "active btn-danger" : "btn-outline-danger"}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "all" ? "All Categories" : cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-2 align-items-center justify-content-md-end">
                <span className="fw-semibold">Sort by:</span>
                <select 
                  className="form-select form-select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ width: "auto" }}
                >
                  <option value="discount">🔥 Biggest Discount</option>
                  <option value="price_low">💰 Price: Low to High</option>
                  <option value="price_high">💰 Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-tag fs-1 text-muted"></i>
            <p className="mt-3 text-muted">No deals available at the moment</p>
            <button 
              className="btn btn-danger mt-2"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <small className="text-muted">
                Showing {filteredProducts.length} of {products.length} products
              </small>
            </div>

            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={product._id}>
                  <div 
                    className="card offer-card border-0 shadow-sm"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <div className="position-relative">
                      {product.discountPercentage > 0 && (
                        <div className={`discount-badge ${getDiscountBadge(product.discountPercentage)} text-white`}>
                          -{product.discountPercentage}% OFF
                        </div>
                      )}
                      
                      {product.discountPercentage >= 40 && (
                        <div className="hot-badge">
                          <i className="bi bi-fire me-1"></i>HOT DEAL
                        </div>
                      )}
                      
                      <div className="position-absolute bottom-0 start-0 m-2">
                        <span className="badge bg-danger">
                          ⭐ Best Deal
                        </span>
                      </div>
                      
                      <img
                        src={product.thumbnail || product.images?.[0] || "https://via.placeholder.com/300?text=Product"}
                        className="product-image w-100"
                        alt={product.title}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300?text=No+Image";
                        }}
                      />
                    </div>
                    
                    <div className="card-body">
                      <small className="text-muted text-uppercase">{product.category || "Product"}</small>
                      <h6 className="card-title mt-1 mb-2" style={{ fontSize: "0.9rem", minHeight: "45px" }}>
                        {product.title?.length > 50 ? product.title.substring(0, 50) + "..." : product.title}
                      </h6>
                      
                      <div className="mb-2">
                        <span className="price">₹{product.price?.toLocaleString()}</span>
                        {product.discountPercentage > 0 && (
                          <>
                            <span className="original-price ms-2">
                              ₹{Math.round(product.price * (1 + product.discountPercentage / 100)).toLocaleString()}
                            </span>
                            <br />
                            <span className="save-amount">
                              <i className="bi bi-piggy-bank me-1"></i>
                              Save ₹{Math.round(product.price * product.discountPercentage / 100).toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="d-flex align-items-center">
                        <div className="text-warning me-1">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bi ${i < Math.floor(product.rating || 4) ? "bi-star-fill" : "bi-star"}`} style={{ fontSize: "12px" }}></i>
                          ))}
                        </div>
                        <small className="text-muted">({product.rating || 4}.0)</small>
                      </div>
                      
                      {/* Stock Status */}
                      {product.stock > 0 && product.stock < 20 && (
                        <div className="mt-2">
                          <small className="text-warning">
                            <i className="bi bi-exclamation-triangle-fill me-1"></i>
                            Only {product.stock} left!
                          </small>
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="mt-2">
                          <small className="text-danger">Out of Stock</small>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer bg-white border-0 pb-3">
                      <button className="btn btn-danger w-100 rounded-pill">
                        <i className="bi bi-cart-plus me-2"></i>Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Footer Banner */}
        <div className="mt-5 p-4 bg-light rounded-3 text-center">
          <i className="bi bi-gift fs-1 text-danger"></i>
          <h5 className="mt-2">Don't miss out on these amazing deals!</h5>
          <p className="text-muted">New offers added daily. Check back often for the best discounts.</p>
          <button 
            className="btn btn-outline-danger rounded-pill px-4"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <i className="bi bi-arrow-up me-2"></i>Back to Top
          </button>
        </div>
      </div>
    </>
  );
}

export default HotOffers;