import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCart } from "../Navbar/CartProcess/CartContext";

function Fashion() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const { addToCart: addToCartContext } = useCart();
  const API_URL = "http://localhost:2000";

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Direct fetch from Fashion collection
      const res = await fetch(`${API_URL}/api/unified/fashion`);
      const data = await res.json();
      console.log("Fashion products:", data);
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
      const url = isWishlisted ? `${API_URL}/api/wishlist/remove` : `${API_URL}/api/wishlist/add`;

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
    <div className="container py-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <h2 className="text-center mb-4">Fashion</h2>
      <div className="row g-4">
        {products.length === 0 ? (
          <div className="text-center py-5">
            <p>No products found in Fashion category.</p>
          </div>
        ) : (
          products.map((product) => {
            const isWishlisted = wishlist.includes(product._id);
            return (
              <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                <div className="card h-100 shadow-sm">
                  <img src={product.thumbnail} className="card-img-top p-3" alt={product.title} style={{ height: "200px", objectFit: "contain", cursor: "pointer" }} onClick={() => handleProductClick(product._id)} />
                  <div className="card-body">
                    <h6 className="card-title">{product.title}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-danger fw-bold">₹{product.price}</span>
                      {product.discountPercentage > 0 && <span className="text-success small">-{product.discountPercentage}%</span>}
                    </div>
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-outline-danger btn-sm w-100" onClick={() => addToCart(product)}>Add to Cart</button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => toggleWishlist(product._id)}>
                        <i className={`bi ${isWishlisted ? "bi-heart-fill text-danger" : "bi-heart"}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Fashion;