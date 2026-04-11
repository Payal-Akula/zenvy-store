/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

function PayPage() {

  const { paymentMethod } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState("confirm");

  const orderId = localStorage.getItem("orderId");
  const token = localStorage.getItem("token");

  // ✅ FALLBACK (IMPORTANT FIX)
  const selectedPayment =
    paymentMethod || localStorage.getItem("paymentMethod") || "UPI";

  // 🔥 FORM
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    captcha: "",
    agree: false
  });

  const [captchaValue] = useState(
    Math.floor(1000 + Math.random() * 9000)
  );

  const [card, setCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // ✅ AUTO FILL USER + ADDRESS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await fetch("https://zenvy-store.onrender.com/api/address", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        const defaultAddress =
          data.find((item) => item.isDefault === true) || data[0];

        setForm((prev) => ({
          ...prev,
          name: user?.fullName || "",
          email: user?.email || "",
          mobile: user?.mobileNumber || "",
          address: defaultAddress
            ? `${defaultAddress.flat}, ${defaultAddress.area}, ${defaultAddress.city}`
            : "",
        }));

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // ✅ VALIDATION
  const handleConfirm = () => {
    if (!form.name || !form.email || !form.mobile || !form.address) {
      alert("Fill all details");
      return;
    }

    if (form.captcha !== String(captchaValue)) {
      alert("Invalid captcha");
      return;
    }

    if (!form.agree) {
      alert("Accept terms");
      return;
    }

    setStep("payment");
  };


  const handlePayment = async () => {
    setLoading(true);

    try {
     await fetch(`https://zenvy-store.onrender.com/api/order/confirm/${orderId}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user: form,
    paymentMethod
  })
});
localStorage.setItem("orderId", orderId)
      setLoading(false);
      setSuccess(true);

      setTimeout(() => navigate("/success"), 1500);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ✅ PAYMENT UI (FINAL FIX)
  const renderPaymentUI = () => {

    switch (selectedPayment) {

      case "UPI":
        return (
          <div className="text-center">
            <h5 className="mb-2">Scan & Pay</h5>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=zenvy@upi&pn=${form.name}`}
              alt="QR"
            />

            <p className="mt-2">UPI ID: zenvy@upi</p>

            <button className="btn btn-danger w-100 mt-3" onClick={handlePayment}>
              I Have Paid
            </button>
          </div>
        );

      case "Card":
        return (
          <>
            <input
              className="form-control mb-2"
              placeholder="Card Number"
              onChange={(e) => setCard({ ...card, number: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder="Name on Card"
              onChange={(e) => setCard({ ...card, name: e.target.value })}
            />

            <div className="d-flex gap-2">
              <input
                className="form-control"
                placeholder="MM/YY"
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              />

              <input
                className="form-control"
                placeholder="CVV"
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
            </div>

           <button onClick={() => handlePayment()}>
  Pay Now
</button>
          </>
        );

      case "Net Banking":
        return (
          <>
            <select className="form-select mb-3">
              <option>SBI</option>
              <option>HDFC</option>
              <option>ICICI</option>
            </select>

            <button className="btn btn-danger w-100" onClick={handlePayment}>
              Continue
            </button>
          </>
        );

      case "COD":
        return (
          <div className="text-center">
            <h6>Cash on Delivery</h6>
            <button className="btn btn-success w-100 mt-2" onClick={handlePayment}>
              Place Order
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center text-danger">
            ❌ No payment method selected
          </div>
        );
    }
  };

  return (
    <>
      <style>
        {`
        body {
          background: #f3f4f6;
        }

        .pay-box {
          max-width: 420px;
          margin: 40px auto;
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        }

        .btn-danger {
          background: linear-gradient(135deg, #ff4b2b, #ff416c);
          border: none;
        }
        `}
      </style>

      <div className="pay-box">

        <h4 className="text-center mb-3">
          {step === "confirm"
            ? "Confirm Details"
            : `${selectedPayment} Payment`}
        </h4>

        {/* STEP 1 */}
        {step === "confirm" && (
          <>
            <input className="form-control mb-2" value={form.name} readOnly />
            <input className="form-control mb-2" value={form.email} readOnly />
            <input className="form-control mb-2" value={form.mobile} readOnly />
            <textarea className="form-control mb-2" value={form.address} readOnly />

            <div className="d-flex gap-2 mb-2">
              <strong>{captchaValue}</strong>
              <input
                className="form-control"
                placeholder="Enter captcha"
                onChange={(e) =>
                  setForm({ ...form, captcha: e.target.value })
                }
              />
            </div>

            <div className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={(e) =>
                  setForm({ ...form, agree: e.target.checked })
                }
              />
              <label className="small">Agree to terms</label>
            </div>

            <button className="btn btn-danger w-100" onClick={handleConfirm}>
              Continue
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === "payment" && (
          loading ? (
            <div className="text-center">
              <div className="spinner-border text-danger"></div>
              <p>Processing...</p>
            </div>
          ) : success ? (
            <div className="text-success text-center">
              ✅ Payment Successful
            </div>
          ) : renderPaymentUI()
        )}

      </div>
    </>
  );
}

export default PayPage;