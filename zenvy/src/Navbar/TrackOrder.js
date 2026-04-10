/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const steps = [
  "ORDER CREATED",
  "PAYMENT SUCCESS",
  "ORDER PLACED",
  "SHIPPED",
  "OUT FOR DELIVERY",
  "DELIVERED"
];

// 📍 RAIPUR → BHILAI coordinates
const route = [
  { lat: 21.2514, lon: 81.6296 }, // Raipur
  { lat: 21.2400, lon: 81.6400 },
  { lat: 21.2200, lon: 81.6600 },
  { lat: 21.2000, lon: 81.6800 },
  { lat: 21.1800, lon: 81.7000 },
  { lat: 21.1600, lon: 81.7200 }, // Bhilai
];

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [positionIndex, setPositionIndex] = useState(0);
  const [address, setAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please login to track orders ❌");
      navigate('/signin');
      return;
    }
    
    setIsLoggedIn(true);
  }, []);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`http://localhost:2000/api/order/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      console.log("Order data:", data);
      setOrder(data);
      setLoading(false);
      
      // Update map position based on order status
      updateMapPositionByStatus(data.status);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order details");
      navigate('/orders');
    }
  };

  // Update map position based on order status
  const updateMapPositionByStatus = (status) => {
    switch(status) {
      case "ORDER PLACED":
        setPositionIndex(0);
        break;
      case "SHIPPED":
        setPositionIndex(2);
        break;
      case "OUT FOR DELIVERY":
        setPositionIndex(4);
        break;
      case "DELIVERED":
        setPositionIndex(route.length - 1);
        break;
      default:
        setPositionIndex(0);
    }
  };

  // 🔥 FETCH ORDER
  useEffect(() => {
    if (isLoggedIn && id && id !== 'undefined') {
      fetchOrder();
      const interval = setInterval(fetchOrder, 5000);
      return () => clearInterval(interval);
    }
  }, [id, isLoggedIn]);

  // 🚚 SIMULATE MOVEMENT (only if order is SHIPPED or OUT FOR DELIVERY)
  useEffect(() => {
    if (!isLoggedIn || !order) return;
    
    // Only animate if order is in transit
    if (order.status === "SHIPPED" || order.status === "OUT FOR DELIVERY") {
      const move = setInterval(() => {
        setPositionIndex((prev) => {
          if (prev < route.length - 1) return prev + 1;
          return prev;
        });
      }, 3000);
      return () => clearInterval(move);
    }
  }, [isLoggedIn, order]);

  // 📍 GET ADDRESS (REVERSE GEO)
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const fetchAddress = async () => {
      const { lat, lon } = route[positionIndex];

      try {
        let response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        let data = await response.json();
        setAddress(data.display_name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAddress();
  }, [positionIndex, isLoggedIn]);

  // Get estimated delivery date
  const getEstimatedDelivery = () => {
    if (!order) return "Not available";
    
    const orderPlacedDate = order.timeline?.find(t => t.status === "ORDER PLACED")?.date;
    if (!orderPlacedDate) return "Processing...";
    
    const placedDate = new Date(orderPlacedDate);
    const deliveryDate = new Date(placedDate);
    deliveryDate.setDate(placedDate.getDate() + 5);
    
    return deliveryDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Get status color
  const getStatusColor = () => {
    if (!order) return "secondary";
    
    switch(order.status) {
      case "DELIVERED":
        return "success";
      case "SHIPPED":
        return "warning";
      case "OUT FOR DELIVERY":
        return "info";
      case "PLACED":
        return "primary";
      default:
        return "secondary";
    }
  };

  // Get current step index for yellow highlighting
  const getCurrentStepIndex = () => {
    const timeline = order?.timeline || [];
    const completedStatuses = timeline.map(t => t.status);
    
    for (let i = 0; i < steps.length; i++) {
      if (!completedStatuses.includes(steps[i])) {
        return i;
      }
    }
    return steps.length; // All completed
  };

  if (!isLoggedIn || loading) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">{!isLoggedIn ? "Redirecting to login..." : "Loading tracking details..."}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-4 text-center">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Order not found
        </div>
        <button className="btn btn-danger mt-3" onClick={() => navigate('/orders')}>
          Back to Orders
        </button>
      </div>
    );
  }

  const timeline = order.timeline || [];
  const completedSteps = timeline.map((t) => t && t.status);
  const currentStepIndex = getCurrentStepIndex();
  const current = route[positionIndex];

  return (
    <div className="container py-4">
      <ToastContainer position="top-center" autoClose={2000} />
      
      <style>
        {`
          .pulse {
            animation: pulseAnim 1s infinite;
          }

          @keyframes pulseAnim {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          
          .step-circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 8px;
            font-size: 12px;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          
          .step-circle.completed {
            background: #28a745;
            color: white;
          }
          
          .step-circle.current {
            background: #ffc107;
            color: #333;
            animation: pulse 1.5s infinite;
          }
          
          .step-circle.pending {
            background: #e9ecef;
            color: #6c757d;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .step-text {
            font-size: 9px;
            text-align: center;
            display: block;
          }
          
          .step-text.completed {
            color: #28a745;
            font-weight: bold;
          }
          
          .step-text.current {
            color: #ffc107;
            font-weight: bold;
          }
          
          .step-text.pending {
            color: #6c757d;
          }
        `}
      </style>

      <div className="card shadow border-0 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h4 className="fw-bold mb-1">📦 Live Tracking</h4>
            <p className="text-muted mb-0">Order ID: {order._id}</p>
          </div>
          <div className="mt-2 mt-sm-0">
            <span className={`badge bg-${getStatusColor()} fs-6 px-3 py-2`}>
              {order.status || "PENDING"}
            </span>
          </div>
        </div>

        {/* PROGRESS STEPS with YELLOW for current/upcoming step */}
        <div className="d-flex justify-content-between mb-4 flex-wrap">
          {steps.map((step, i) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = i === currentStepIndex;
            const isUpcoming = !isCompleted && !isCurrent && i > currentStepIndex;

            return (
              <div key={i} className="text-center flex-fill">
                <div
                  className={`step-circle ${
                    isCompleted ? "completed" : isCurrent ? "current" : "pending"
                  }`}
                >
                  {isCompleted ? <i className="bi bi-check-lg"></i> : i + 1}
                </div>
                <small className={`step-text ${
                  isCompleted ? "completed" : isCurrent ? "current" : "pending"
                }`}>
                  {step}
                </small>
              </div>
            );
          })}
        </div>

        <hr />

        {/* ORDER INFO CARDS */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="bg-light rounded p-3">
              <i className="bi bi-calendar-event text-danger me-2"></i>
              <strong>Estimated Delivery</strong>
              <p className="mb-0 mt-1">{getEstimatedDelivery()}</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-light rounded p-3">
              <i className="bi bi-credit-card text-danger me-2"></i>
              <strong>Payment Method</strong>
              <p className="mb-0 mt-1">{order.paymentMethod || "Not specified"}</p>
            </div>
          </div>
        </div>

        {/* 📍 LIVE LOCATION */}
        <h6>🚚 Current Location</h6>
        <p className="text-muted small">{address || "Fetching location..."}</p>

        {/* 🗺️ MAP */}
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={`https://maps.google.com/maps?q=${current.lat},${current.lon}&z=14&output=embed`}
            title="map"
            style={{ border: 0, borderRadius: "8px" }}
          ></iframe>
        </div>

      </div>

      {/* 🛒 PRODUCTS */}
      <hr />
      <h6 className="mb-3">Products in your order</h6>

      {(order.items || []).map((item, i) => (
        <div key={i} className="row mb-3 align-items-center border-bottom pb-3">
          <div className="col-md-2">
            <img 
              src={item.image} 
              className="img-fluid rounded" 
              alt={item.title}
              style={{ maxHeight: "70px", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <div className="col-md-6">
            <h6 className="mb-1">{item.title}</h6>
            <small className="text-muted">Quantity: {item.quantity}</small>
          </div>
          <div className="col-md-4 text-end">
            <strong>₹{(item.price || 0) * (item.quantity || 0)}</strong>
            <br />
            <small className="text-muted">₹{item.price} each</small>
          </div>
        </div>
      ))}

      {/* Shipping Address */}
      {order.userDetails && (
        <div className="mt-4">
          <hr />
          <h6 className="mb-2"><i className="bi bi-geo-alt text-danger me-2"></i>Shipping Address</h6>
          <p className="mb-0">{order.userDetails.name}</p>
          <p className="mb-0">{order.userDetails.address}</p>
          <p className="mb-0">{order.userDetails.city}, {order.userDetails.pincode}</p>
          <p className="mb-0">Phone: {order.userDetails.phone}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="d-flex gap-2 mt-4">
        <button 
          className="btn btn-outline-danger"
          onClick={() => navigate('/orders')}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Orders
        </button>
        <button 
          className="btn btn-danger"
          onClick={() => window.open(`http://localhost:2000/api/order/invoice/${order._id}`, '_blank')}
        >
          <i className="bi bi-download me-2"></i>Download Invoice
        </button>
      </div>

      {/* Timeline Details */}
      {timeline.length > 0 && (
        <div className="mt-4">
          <hr />
          <h6 className="mb-3"><i className="bi bi-clock-history text-danger me-2"></i>Order Timeline</h6>
          <div className="timeline">
            {timeline.map((t, i) => (
              <div key={i} className="d-flex mb-3">
                <div className="me-3">
                  <div className="bg-success rounded-circle" style={{ width: "12px", height: "12px", marginTop: "5px" }}></div>
                </div>
                <div>
                  <strong>{t.status}</strong>
                  <br />
                  <small className="text-muted">
                    {t.date ? new Date(t.date).toLocaleString() : "Date not available"}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrackOrder;