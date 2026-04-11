/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ReturnPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please login first ❌");
      navigate('/signin');
      return;
    }
    
    setIsLoggedIn(true);
    
    if (id && id !== 'undefined') {
      fetchOrder();
    } else {
      toast.error("Invalid order ID");
      navigate('/orders');
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`https://zenvy-store.onrender.com/api/order/${id}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order details");
      navigate('/orders');
    }
  };

  const handleSubmit = async () => {
    // Double-check authentication
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      toast.error("Session expired. Please login again ❌");
      navigate('/signin');
      return;
    }
    
    if (!reason) {
      toast.error("Please select a reason for return");
      return;
    }

    try {
      const res = await fetch("https://zenvy-store.onrender.com/api/order/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: id, reason })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Return request failed");
      }

      toast.success("Return Requested ✅");
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to process return");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to login...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-4 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <h4 className="fw-bold mb-4">🔄 Return Order</h4>

      <div className="card shadow p-4">

        {/* ORDER INFO */}
        <div className="mb-3">
          <h6>Order ID: {order._id}</h6>
          <p className="mb-1">Total: ₹{order.amount}</p>
          <small className="text-muted">Status: {order.status}</small>
        </div>

        <hr />

        {/* PRODUCT LIST */}
        <h6 className="mb-3">Products in this order:</h6>

        {order.items && order.items.map((item, i) => (
          <div key={i} className="row align-items-center mb-3 border-bottom pb-2">

            {/* IMAGE */}
            <div className="col-md-2 text-center">
              <img
                src={item.image}
                className="img-fluid rounded"
                style={{ maxHeight: "70px" }}
                alt={item.title}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* DETAILS */}
            <div className="col-md-6">
              <h6 className="mb-1">{item.title}</h6>
              <small className="text-muted">
                ₹{item.price} × {item.quantity}
              </small>
            </div>

            {/* TOTAL */}
            <div className="col-md-4 text-end fw-bold">
              ₹{item.price * item.quantity}
            </div>

          </div>
        ))}

        <hr />

        {/* REASON */}
        <label className="fw-semibold mb-2">Select Reason</label>

        <select
          className="form-select mb-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- Choose --</option>
          <option>Damaged product</option>
          <option>Wrong item</option>
          <option>Not satisfied</option>
        </select>

        <button className="btn btn-danger w-100" onClick={handleSubmit}>
          Confirm Return
        </button>

      </div>
    </div>
  );
}

export default ReturnPage;