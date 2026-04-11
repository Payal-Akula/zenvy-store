/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function OrderTracking() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetch(`https://zenvy-store.onrender.com/api/order/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Order not found');
          }
          return res.json();
        })
        .then(data => {
          console.log("Order data:", data);
          setOrder(data);
        })
        .catch(err => console.error("Error fetching order:", err));
    }
  }, [id]);

  if (!order) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  // ✅ STEP MAPPING
  const steps = [
    "ORDER CREATED",
    "PAYMENT SUCCESS",
    "ORDER PLACED",
    "PACKED",
    "SHIPPED",
    "OUT FOR DELIVERY",
    "DELIVERED"
  ];

  // ✅ Safety check - ensure timeline exists
  const timeline = order.timeline || [];

  return (
    <div className="container mt-4">

      <h4 className="mb-3">📦 Track Order</h4>

      <div className="card p-3 shadow-sm">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Status:</b> {order.status || "Processing"}</p>

        <hr />

        {/* PROGRESS BAR */}
        <div className="d-flex justify-content-between mb-3 flex-wrap">
          {steps.map((step, index) => {
            const done = timeline.some(t => t && t.status === step);

            return (
              <div key={index} className="text-center flex-fill">
                <div
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: "50%",
                    background: done ? "green" : "#ccc",
                    margin: "auto"
                  }}
                ></div>
                <small style={{ fontSize: "10px" }}>{step}</small>
              </div>
            );
          })}
        </div>

        <hr />

        {/* TIMELINE */}
        <h6>Timeline</h6>

        {timeline.length === 0 ? (
          <p className="text-muted">No timeline updates yet.</p>
        ) : (
          timeline.map((t, i) => (
            <div key={i} className="mb-2">
              <strong>✅ {t.status}</strong>
              <br />
              <small className="text-muted">
                {t.date ? new Date(t.date).toLocaleString() : "Date not available"}
              </small>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default OrderTracking;