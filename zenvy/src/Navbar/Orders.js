/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const extractCleanItem = (item) => {
    // If item already has all the data we need, return it directly
    if (item.title && item.price !== undefined) {
      return {
        _id: item._id,
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.image || "",
        source: item.source || "products"
      };
    }
    
    // Handle nested _doc structure
    let cleanItem = {};
    if (item._doc) {
      cleanItem = { ...item._doc };
    } else if (typeof item === 'object') {
      cleanItem = { ...item };
    }
    
    let productId = null;
    let productData = {};
    
    if (cleanItem.productId) {
      if (typeof cleanItem.productId === 'object') {
        if (cleanItem.productId._doc) {
          productData = cleanItem.productId._doc;
        } else {
          productData = cleanItem.productId;
        }
        productId = productData._id || cleanItem.productId;
      } else if (typeof cleanItem.productId === 'string') {
        productId = cleanItem.productId;
      }
    }
    
    if (!productId && cleanItem._id) {
      productId = cleanItem._id;
    }
    
    return {
      _id: cleanItem._id,
      productId: productId,
      title: cleanItem.title || productData.title || "Product Name",
      price: cleanItem.price || productData.price || 0,
      quantity: cleanItem.quantity || 1,
      image: cleanItem.image || productData.thumbnail || productData.image || "",
      source: cleanItem.source || productData.source || "products"
    };
  };

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user || !userId) {
      setIsLoggedIn(false);
      setLoading(false);
      toast.error("Please login to view orders ❌");
      navigate('/signin');
      return;
    }
    
    setIsLoggedIn(true);
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    if (!userId) return;
    
    fetch(`https://zenvy-store.onrender.com/api/order/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched orders:", data);
        
        if (!Array.isArray(data)) {
          setOrders([]);
          setLoading(false);
          return;
        }
        
        const transformedOrders = data.map(order => {
          const cleanItems = (order.items || []).map(item => extractCleanItem(item));
          
          return {
            ...order,
            items: cleanItems,
            timeline: order.timeline || []
          };
        });
        
        console.log("Transformed orders:", transformedOrders);
        setOrders(transformedOrders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        toast.error("Failed to load orders");
        setLoading(false);
      });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not available";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleProductClick = (productId) => {
    if (!productId) {
      toast.error("Cannot open product - Product ID missing");
      return;
    }
    navigate(`/productpage/${productId}`);
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "DELIVERED":
        return "bg-success";
      case "SHIPPED":
        return "bg-warning text-dark";
      case "OUT FOR DELIVERY":
        return "bg-info text-dark";
      case "PLACED":
        return "bg-primary";
      case "Returned":
        return "bg-danger";
      case "CANCELLED":
        return "bg-dark";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading your orders...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <style>
        {`
          .order-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border-radius: 16px;
            overflow: hidden;
          }
          
          .order-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          
          .order-header {
            background: linear-gradient(135deg, #e12727, #ff6b6b);
            padding: 16px 20px;
          }
          
          .product-image {
            transition: transform 0.2s ease;
          }
          
          .product-image:hover {
            transform: scale(1.05);
          }
          
          .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .track-btn {
            transition: all 0.2s ease;
            border-radius: 20px;
          }
          
          .track-btn:hover {
            background: #e12727;
            color: white;
            transform: translateX(3px);
          }
          
          .action-btn {
            border-radius: 20px;
            padding: 5px 15px;
            font-size: 12px;
            transition: all 0.2s ease;
          }
          
          .action-btn:hover {
            transform: translateY(-2px);
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .order-card {
            animation: fadeInUp 0.4s ease;
          }
        `}
      </style>

      <div className="container py-4">
        {/* Header with icon */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-danger bg-gradient rounded-circle p-3" style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="bi bi-box-seam fs-2 text-white"></i>
          </div>
          <div>
            <h3 className="fw-bold mb-0">Your Orders</h3>
            <p className="text-muted mb-0">Track, return, or exchange your orders</p>
          </div>
        </div>
        
        {!orders || orders.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-light rounded-circle p-4 d-inline-flex mb-3" style={{ width: "100px", height: "100px", alignItems: "center", justifyContent: "center" }}>
              <i className="bi bi-inbox fs-1 text-muted"></i>
            </div>
            <h5 className="text-muted">No orders found</h5>
            <p className="text-muted small">Looks like you haven't placed any orders yet</p>
            <button className="btn btn-danger rounded-pill px-4 mt-2" onClick={() => navigate('/')}>
              <i className="bi bi-shop me-2"></i>Start Shopping
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => {
              const timeline = order.timeline || [];
              const delivered = timeline.find(t => t && t.status === "DELIVERED");
              const shipped = timeline.find(t => t && t.status === "SHIPPED");
              const canReturn = delivered && 
                (Date.now() - new Date(delivered.date)) / (1000 * 60 * 60 * 24) <= 7;
              const canExchange = delivered && 
                (Date.now() - new Date(delivered.date)) / (1000 * 60 * 60 * 24) <= 3;
              
              // Get progress percentage
              const progressSteps = ["ORDER CREATED", "PAYMENT SUCCESS", "ORDER PLACED", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"];
              let completedCount = 0;
              for (const step of progressSteps) {
                if (timeline.some(t => t.status === step)) {
                  completedCount++;
                }
              }
              const progressPercent = (completedCount / progressSteps.length) * 100;
              
              return (
                <div key={order._id} className="col-12">
                  <div className="card order-card shadow-sm border-0">
                    {/* Order Header */}
                    <div className="order-header text-white d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <i className="bi bi-receipt"></i>
                          <span className="fw-semibold">Order #{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <small className="opacity-75">
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatDate(order.createdAt)}
                        </small>
                      </div>
                      <div className="text-end mt-2 mt-sm-0">
                        <div className="fs-5 fw-bold">₹{order.amount.toLocaleString()}</div>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status || "PENDING"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="px-4 pt-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Order Progress</small>
                        <small className="text-muted">{Math.round(progressPercent)}%</small>
                      </div>
                      <div className="progress" style={{ height: "6px", borderRadius: "3px" }}>
                        <div 
                          className="progress-bar bg-danger" 
                          style={{ width: `${progressPercent}%`, borderRadius: "3px" }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="card-body p-4">
                      {/* Order Items */}
                      {(order.items || []).map((item, i) => (
                        <div key={item._id || i} className="row mb-3 align-items-center border-bottom pb-3">
                          <div className="col-md-2 col-4">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                className="img-fluid product-image rounded" 
                                style={{ 
                                  cursor: "pointer", 
                                  maxHeight: "80px", 
                                  objectFit: "contain",
                                  width: "100%",
                                  backgroundColor: "#f8f9fa",
                                  padding: "8px"
                                }} 
                                onClick={() => handleProductClick(item.productId)} 
                                alt={item.title}
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/80?text=Product";
                                }}
                              />
                            ) : (
                              <div 
                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: "100%", 
                                  height: "80px", 
                                  border: "1px solid #eee",
                                  borderRadius: "8px"
                                }}
                              >
                                <i className="bi bi-image text-muted fs-3"></i>
                              </div>
                            )}
                          </div>
                          
                          <div className="col-md-6 col-8">
                            <h6 
                              style={{ cursor: "pointer", color: "#2162A1", fontSize: "14px" }} 
                              className="mb-1"
                              onClick={() => handleProductClick(item.productId)}
                            >
                              {item.title.length > 50 ? item.title.substring(0, 50) + "..." : item.title}
                            </h6>
                            <small className="text-muted">
                              <i className="bi bi-currency-rupee"></i>{item.price} × {item.quantity}
                            </small>
                          </div>
                          
                          <div className="col-md-4 col-12 text-md-end mt-2 mt-md-0">
                            <div className="fw-bold text-dark">₹{(item.price || 0) * (item.quantity || 0)}</div>
                            <small className="text-muted">Total</small>
                          </div>
                        </div>
                      ))}
                      
                      {/* Delivery Info & Actions */}
                      <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                        <div>
                          {delivered ? (
                            <span className="text-success small">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Delivered on {new Date(delivered.date).toLocaleDateString()}
                            </span>
                          ) : shipped ? (
                            <span className="text-warning small">
                              <i className="bi bi-truck me-1"></i>
                              Shipped on {new Date(shipped.date).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-secondary small">
                              <i className="bi bi-clock-history me-1"></i>
                              Order confirmed
                            </span>
                          )}
                        </div>
                        
                        <div className="d-flex gap-2">
                          {!delivered ? (
                            <button 
                              className="btn btn-outline-danger btn-sm track-btn rounded-pill px-3" 
                              onClick={() => navigate(`/track/${order._id}`)}
                            >
                              <i className="bi bi-geo-alt me-1"></i>Track Order
                            </button>
                          ) : !canReturn ? (
                            <span className="badge bg-dark py-2 px-3">Return Closed</span>
                          ) : order.status === "Returned" ? (
                            <span className="badge bg-secondary py-2 px-3">Returned</span>
                          ) : (
                            <>
                              <button 
                                className="btn btn-danger btn-sm action-btn" 
                                onClick={() => navigate(`/return/${order._id}`)}
                              >
                                <i className="bi bi-arrow-return-left me-1"></i>Return
                              </button>
                              {canExchange && order.status !== "Returned" && (
                                <button 
                                  className="btn btn-warning btn-sm action-btn" 
                                  onClick={() => navigate(`/exchange/${order._id}`)}
                                >
                                  <i className="bi bi-arrow-left-right me-1"></i>Exchange
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Footer */}
                    <div className="card-footer bg-white border-top p-3">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <small className="text-muted">
                          <i className="bi bi-credit-card me-1"></i>
                          Payment: {order.paymentMethod || "Not specified"}
                        </small>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-link text-danger text-decoration-none p-0 small"
                            onClick={() => navigate(`/track/${order._id}`)}
                          >
                            <i className="bi bi-map me-1"></i>View Tracking
                          </button>
                          <span className="text-muted">|</span>
                          <button 
                            className="btn btn-link text-danger text-decoration-none p-0 small"
                            onClick={() => window.open(`https://zenvy-store.onrender.com/api/order/invoice/${order._id}`, '_blank')}
                          >
                            <i className="bi bi-download me-1"></i>Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;