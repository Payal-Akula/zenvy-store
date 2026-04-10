/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ExchangePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetch(`http://localhost:2000/api/order/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data));
  }, [id]);

  const handleSubmit = async () => {
    if (!reason) return alert("Select reason");

    await fetch("http://localhost:2000/api/order/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ orderId: id, reason })
    });

    alert("Exchange Requested 🔁");
    navigate("/orders");
  };

  if (!order) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-4">🔁 Exchange Product</h4>

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

        {order.items.map((item, i) => (
          <div key={i} className="row align-items-center mb-3 border-bottom pb-2">

            <div className="col-md-2 text-center">
              <img
                src={item.image}
                className="img-fluid rounded"
                style={{ maxHeight: "70px" }}
              />
            </div>

            <div className="col-md-6">
              <h6 className="mb-1">{item.title}</h6>
              <small className="text-muted">
                ₹{item.price} × {item.quantity}
              </small>
            </div>

            <div className="col-md-4 text-end fw-bold">
              ₹{item.price * item.quantity}
            </div>

          </div>
        ))}

        <hr />

        {/* REASON */}
        <label className="fw-semibold mb-2">Reason for Exchange</label>

        <select
          className="form-select mb-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- Choose --</option>
          <option>Size issue</option>
          <option>Wrong product</option>
          <option>Quality issue</option>
        </select>

        <button className="btn btn-warning w-100" onClick={handleSubmit}>
          Confirm Exchange
        </button>

      </div>
    </div>
  );
}

export default ExchangePage;