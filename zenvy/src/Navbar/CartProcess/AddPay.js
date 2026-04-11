/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Addpay() {
  const [address, setAddress] = useState(null);

  const { cart, paymentMethod, updateQuantity } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const increaseQty = (id, qty) => {
    updateQuantity(id, qty + 1);
  };

  const decreaseQty = (id, qty) => {
    if (qty > 1) {
      updateQuantity(id, qty - 1);
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://zenvy-store.onrender.com/api/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const defaultAddress =
          data.find((item) => item.isDefault === true) ||
          data.find((item) => item.isDefault === "checked") ||
          data[0];

        setAddress(defaultAddress);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAddress();
  }, []);

  const createOrder = async () => {
    try {
      // ✅ FIX: Transform cart items to match backend expected format
      const itemsForOrder = cart.map((item) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        source: "products"
      }));

      console.log("📦 Sending order with items:", itemsForOrder);
      console.log("👤 User ID:", localStorage.getItem("userId"));
      console.log("💳 Payment Method:", paymentMethod);

      const res = await fetch("https://zenvy-store.onrender.com/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          paymentMethod,
          items: itemsForOrder,  // ✅ Now sending cart items!
          amount: totalPrice
        }),
      });

      const data = await res.json();
      console.log("📨 Order response:", data);

      if (!data.orderId) {
        alert("Order failed ❌");
        return;
      }

      localStorage.setItem("orderId", data.orderId);
      navigate("/payPage");
    } catch (err) {
      console.error("Order creation error:", err);
      alert("Server error ❌");
    }
  };

  // Rest of your component remains exactly the same...
  return (
    <>
      <style>
        {`
        body {
          background: #f3f4f6;
        }

        .section-box {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 16px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.05);
          transition: 0.3s;
        }

        .section-box:hover {
          transform: translateY(-2px);
        }

        .section-title {
          font-weight: 600;
          font-size: 16px;
        }

        .small-text {
          font-size: 12px;
          color: #666;
        }

        .small-link {
          color: #e63946;
          font-weight: 500;
          cursor: pointer;
        }

        .product-item {
          display: flex;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }

        .qty-box {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }

        .qty-btn {
          border: none;
          background: #f1f1f1;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.2s;
        }

        .qty-btn:hover {
          background: #ff416c;
          color: white;
        }

        .gradient-btn {
          background: linear-gradient(135deg, #ff4b2b, #ff416c);
          border: none;
          color: white;
          font-weight: 600;
          transition: 0.3s;
        }

        .gradient-btn:hover {
          transform: scale(1.02);
          opacity: 0.9;
        }

        .summary-box {
          position: sticky;
          top: 20px;
        }

        @media (max-width: 576px) {
          .bottom-pay-row {
            flex-direction: column !important;
            text-align: center;
          }

          .bottom-pay-row button {
            width: 100%;
            margin-bottom: 10px;
          }
        }
        `}
      </style>

      <div className="container-fluid p-4">
        <div className="row">

          {/* LEFT */}
          <div className="col-md-9">

            {/* ADDRESS */}
            <div className="section-box">
              <div className="section-title d-flex justify-content-between">
                Delivering to {address?.fullname || "User"}
                <a href="/address" className="small-link text-decoration-none">Change</a>
              </div>

              {address ? (
                <p className="small-text">
                  {address.flat}, {address.area}, {address.city},{" "}
                  {address.state}, {address.pincode}, {address.country}
                </p>
              ) : (
                <p>No address found</p>
              )}
            </div>

            {/* PAYMENT */}
            <div className="section-box">
              <div className="section-title d-flex justify-content-between">
                Pay by scanning the QR code
              </div>
              <p className="small-text">
                A UPI QR code will appear on the next page.
              </p>
            </div>

            {/* PRODUCTS */}
            <div className="section-box">
              <div className="section-title">
                Arriving {new Date(Date.now() + 2 * 86400000).toLocaleDateString("en-IN")}
              </div>

              {cart.map((item) => (
                <div className="product-item" key={item.id}>
                  <img
                    src={item.image}
                    alt={item.title}
                    width="120"
                    className="rounded"
                  />

                  <div>
                    <h6>{item.title}</h6>
                    <p className="small text-muted">{item.description}</p>
                    <p className="fw-bold">₹{item.price.toLocaleString()}</p>

                    <div className="qty-box">
                      <span
                        className="qty-btn"
                        onClick={() => decreaseQty(item.id, item.quantity)}
                      >
                        −
                      </span>

                      <span>{item.quantity}</span>

                      <span
                        className="qty-btn"
                        onClick={() => increaseQty(item.id, item.quantity)}
                      >
                        +
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM */}
            <div className="section-box d-flex justify-content-between bottom-pay-row">
              <button className="bg-gradient btn btn-danger rounded-pill px-5 "
              onClick={createOrder}>
                Pay with {paymentMethod || "UPI"}
              </button>

              <div>
                <h5>Order Total: ₹{totalPrice.toLocaleString()}</h5>
                <span className="small-text">
                  By placing your order, you agree to conditions.
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="col-md-3">
            <div className="section-box summary-box">

              <button
                className="bg-gradient btn btn-danger rounded-pill w-100"
                onClick={createOrder}
              >
                Pay with {paymentMethod || "UPI"}
              </button>

              <hr />

              <div className="d-flex justify-content-between">
                <p>Items</p>
                <p>{totalItems}</p>
              </div>

              <div className="d-flex justify-content-between text-success">
                <p>Delivery</p>
                <p>Free</p>
              </div>

              <div className="d-flex justify-content-between">
                <p>Total</p>
                <p>₹{totalPrice.toLocaleString()}</p>
              </div>

              <div className="d-flex justify-content-between fw-bold">
                <p>Order Total</p>
                <p>₹{totalPrice.toLocaleString()}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Addpay;