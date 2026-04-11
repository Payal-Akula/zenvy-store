/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Recommended() {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  // Category configurations
  const categoryConfigs = [
    { name: "Fashion", endpoint: "fashion", icon: "bi-bag-heart", color: "#e91e63" },
    { name: "Furniture & Decor", endpoint: "furniture", icon: "bi-house-door", color: "#8d6e63" },
    { name: "Health & Beauty", endpoint: "health-beauty", icon: "bi-heart-pulse", color: "#4caf50" },
    { name: "Smartphone & Tablet", endpoint: "smartphone-tablet", icon: "bi-phone", color: "#ff9800" },
    { name: "Electronics", endpoint: "electronics", icon: "bi-tv", color: "#2196f3" },
    { name: "Jewelry", endpoint: "jewelry", icon: "bi-gem", color: "#9c27b0" }
  ];

  // Fetch 4 products from each category
  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  const fetchRecommendedProducts = async () => {
    setLoading(true);
    try {
      const productsByCategory = [];
      
      for (const category of categoryConfigs) {
        try {
          const response = await fetch(`https://zenvy-store.onrender.com/api/unified/${category.endpoint}`);
          
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              // Take first 4 products from each category
              const top4Products = data.slice(0, 4).map(product => ({
                ...product,
                categoryName: category.name,
                categoryIcon: category.icon,
                categoryColor: category.color,
                source: category.endpoint
              }));
              productsByCategory.push(...top4Products);
              console.log(`✅ Loaded ${top4Products.length} products from ${category.name}`);
            } else {
              console.warn(`⚠️ No products found for ${category.name}`);
            }
          } else {
            console.warn(`⚠️ Failed to fetch ${category.name}: ${response.status}`);
          }
        } catch (err) {
          console.error(`❌ Error fetching ${category.name}:`, err);
        }
      }
      
      setAllProducts(productsByCategory);
      
      // Extract unique categories for filter
      const uniqueCategories = [...new Set(productsByCategory.map(p => p.categoryName))];
      setCategories(["all", ...uniqueCategories]);
      
    //   if (productsByCategory.length > 0) {
    //     toast.success(`✨ Found ${productsByCategory.length} recommended products!`);
    //   } else {
    //     toast.info("No products available at the moment");
    //   }
      
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    //   toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category
  const getFilteredProducts = () => {
    if (selectedCategory === "all") {
      return allProducts;
    }
    return allProducts.filter(p => p.categoryName === selectedCategory);
  };

  const filteredProducts = getFilteredProducts();

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/productpage/${productId}`);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Finding recommendations for you...</p>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .rec-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .rec-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          
          .product-image {
            height: 200px;
            object-fit: contain;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
            transition: transform 0.3s ease;
            width: 100%;
          }
          
          .rec-card:hover .product-image {
            transform: scale(1.05);
          }
          
          .price {
            font-size: 1.3rem;
            font-weight: bold;
            color: #e12727;
          }
          
          .original-price {
            text-decoration: line-through;
            font-size: 0.8rem;
            color: #999;
          }
          
          .category-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
            color: white;
          }
          
          .category-filter {
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 25px;
          }
          
          .category-filter.active {
            background: linear-gradient(135deg, #e12727, #ff6b6b);
            color: white;
            border-color: #e12727;
          }
          
          .category-filter:hover:not(.active) {
            background-color: #f8f9fa;
            transform: translateY(-2px);
          }
          
          @media (max-width: 768px) {
            .product-image {
              height: 160px;
            }
            .price {
              font-size: 1.1rem;
            }
          }
        `}
      </style>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav style={{ fontSize: "14px" }} className="mb-4">
          <a href="/" className="text-decoration-none text-secondary">Home</a>
          <span className="mx-2 text-secondary">›</span>
          <a href="#" className="text-decoration-none text-secondary">Recommendations</a>
          <span className="mx-2 text-secondary">›</span>
          <span className="text-danger fw-semibold">Recommended for You</span>
        </nav>

        {/* Header Section */}
        <div className="bg-gradient rounded-3 p-4 mb-4 text-white" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="text-danger">
              <h1 className="display-5 fw-bold mb-2">
                ✨ Recommended for You
              </h1>
              <p className="mb-0 fs-5 opacity-90">
                Hand-picked products just for you from all categories
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <div className="bg-white rounded-pill px-4 py-2" style={{ color: "#764ba2" }}>
                <i className="bi bi-stars me-2"></i>
                <strong>{filteredProducts.length}</strong> Recommendations
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="mb-4">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  className={`btn category-filter px-4 py-2 ${selectedCategory === cat ? "active" : "btn-outline-danger"}`}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ borderRadius: "25px" }}
                >
                  {cat === "all" ? "🎯 All Categories" : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid - No grouping, just flat grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-emoji-frown fs-1 text-muted"></i>
            <p className="mt-3 text-muted">No recommendations available</p>
            <button 
              className="btn btn-danger mt-2"
              onClick={() => navigate('/')}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {filteredProducts.map((product) => {
                const categoryInfo = categoryConfigs.find(c => c.name === product.categoryName);
                return (
                  <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={product._id}>
                    <div 
                      className="card rec-card border-0 shadow-sm"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <div className="position-relative">
                        <div 
                          className="category-badge"
                          style={{ backgroundColor: categoryInfo?.color || "#e12727" }}
                        >
                          <i className={`${categoryInfo?.icon || "bi-tag"} me-1`}></i>
                          {product.categoryName}
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
                              <span className="save-amount text-success small">
                                <i className="bi bi-piggy-bank me-1"></i>
                                Save ₹{Math.round(product.price * product.discountPercentage / 100).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* Rating */}
                        <div className="d-flex align-items-center">
                          <div className="text-warning me-1">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`bi ${i < Math.floor(product.rating || 4) ? "bi-star-fill" : "bi-star"}`} style={{ fontSize: "12px" }}></i>
                            ))}
                          </div>
                          <small className="text-muted">({product.rating || 4}.0)</small>
                        </div>
                      </div>
                      
                      <div className="card-footer bg-white border-0 pb-3">
                        <button className="btn btn-danger w-100 rounded-pill">
                          <i className="bi bi-cart-plus me-2"></i>Shop Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {/* Footer Banner */}
        <div className="mt-5 p-4 bg-light rounded-3 text-center">
          <i className="bi bi-robot fs-1 text-danger"></i>
          <h5 className="mt-2">Personalized Recommendations</h5>
          <p className="text-muted">Based on your browsing history and preferences</p>
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

export default Recommended;