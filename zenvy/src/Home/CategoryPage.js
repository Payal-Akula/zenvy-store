import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../Navbar/CartProcess/CartContext";

function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const API_URL = "https://zenvy-store.onrender.com";

  // Map category to specific API endpoint
  const getApiUrl = () => {
    switch(category) {
      case "watch-jewelry":
        return `${API_URL}/api/unified/category/Fashion`;
      case "womens-jacket":
        return `${API_URL}/api/unified/category/Fashion`;
      case "smartphone":
        return `${API_URL}/api/unified/category/Smartphone%20&%20Tablet`;
      case "cosmetics":
        return `${API_URL}/api/unified/category/Health%20&%20Beauty`;
      case "furniture":
        return `${API_URL}/api/unified/category/Furniture%20&%20Decor`;
      case "speaker":
        return `${API_URL}/api/unified/category/Electronics`;
      default:
        return `${API_URL}/api/unified/all`;
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = getApiUrl();
      console.log("Fetching from:", apiUrl);
      
      const res = await fetch(apiUrl);
      const data = await res.json();
      console.log(`Products for ${category}:`, data);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
      setProducts([]);
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
    }
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

  const handleProductClick = (productId) => {
    navigate(`/productpage/${productId}`);
  };

  const getCategoryTitle = () => {
    const titles = {
      "watch-jewelry": "Watch & Jewelry",
      "smartphone": "Smartphones",
      "cosmetics": "Cosmetics & Beauty",
      "womens-jacket": "Women's Jackets",
      "furniture": "Furniture & Decor",
      "speaker": "Speakers & Audio"
    };
    return titles[category] || category?.replace(/-/g, ' ').toUpperCase() || "Products";
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
      <style>
        {`
          .category-page {
            background: #f5f5f5;
            min-height: 100vh;
            padding: 40px 0;
          }
          
          .category-title {
            text-align: center;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #1a1a1a;
          }
          
          .category-subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 40px;
          }
          
          .products-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          
          .product-card {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            position: relative;
            cursor: pointer;
          }
          
          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          
          .product-image-wrapper {
            position: relative;
            overflow: hidden;
            background: #f8f8f8;
            padding: 20px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .product-image-wrapper img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            transition: transform 0.3s ease;
          }
          
          .product-card:hover .product-image-wrapper img {
            transform: scale(1.05);
          }
          
          .wishlist-icon {
            position: absolute;
            top: 10px;
            right: 10px;
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
            z-index: 2;
          }
          
          .wishlist-icon:hover {
            background: #dc3545;
            color: white;
            transform: scale(1.1);
          }
          
          .product-info {
            padding: 12px;
          }
          
          .product-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 6px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            color: #1a1a1a;
            min-height: 40px;
          }
          
          .product-title:hover {
            color: #dc3545;
          }
          
          .rating {
            margin-bottom: 6px;
            font-size: 12px;
          }
          
          .price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
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
            background: #f8f9fa;
            border: 1px solid #ddd;
            color: #333;
            padding: 8px;
            border-radius: 25px;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.3s;
            cursor: pointer;
          }
          
          .add-to-cart-btn:hover {
            background: #dc3545;
            color: white;
            border-color: #dc3545;
          }
          
          @media (max-width: 1200px) {
            .products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          @media (max-width: 992px) {
            .products-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (max-width: 576px) {
            .products-grid {
              grid-template-columns: 1fr;
            }
            .category-title {
              font-size: 24px;
            }
          }
        `}
      </style>

      <ToastContainer position="top-center" autoClose={2000} />

      <div className="category-page">
        <div className="container">
          <h2 className="category-title">{getCategoryTitle()}</h2>
          <p className="category-subtitle">Discover our amazing collection</p>

          {products.length === 0 ? (
            <div className="text-center py-5">
              <p>No products found in this category.</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const isWishlisted = wishlist.includes(product._id);
                const discountedPrice = product.discountedTotal || product.price;
                const originalPrice = product.total || Math.round(product.price / (1 - (product.discountPercentage / 100)));

                return (
                  <div key={product._id} className="product-card">
                    <div className="product-image-wrapper" onClick={() => handleProductClick(product._id)}>
                      <img src={product.thumbnail} alt={product.title} />
                    </div>
                    
                    <div className="wishlist-icon" onClick={() => toggleWishlist(product._id)}>
                      <i className={`bi ${isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                    </div>
                    
                    <div className="product-info">
                      <h6 className="product-title" onClick={() => handleProductClick(product._id)}>
                        {product.title}
                      </h6>
                      
                      <div className="rating text-warning">
                        {"★".repeat(Math.floor(product.rating || 4))}
                        {"☆".repeat(5 - Math.floor(product.rating || 4))}
                        <span className="text-muted ms-1">({product.rating || 4})</span>
                      </div>
                      
                      <div className="price-section">
                        <div>
                          <span className="current-price">₹{discountedPrice}</span>
                          {product.discountPercentage > 0 && (
                            <span className="old-price">₹{originalPrice}</span>
                          )}
                        </div>
                        {product.discountPercentage > 0 && (
                          <span className="text-success small">-{Math.round(product.discountPercentage)}%</span>
                        )}
                      </div>
                      
                      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                        <i className="bi bi-cart me-2"></i> Add To Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CategoryPage;