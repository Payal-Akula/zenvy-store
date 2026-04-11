/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useCart } from "./CartContext"; 
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CartMethod() {

  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const { cart, paymentMethod, setPaymentMethod } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

 const handlePaymentSubmit = () => {
  if (!paymentMethod) {
    toast.error("Select payment method ❌");
    return;
  }

  localStorage.setItem("paymentMethod", paymentMethod);
  navigate("/addpay");
};

  // COD RULE
  useEffect(() => {
    if (totalPrice >= 500 && paymentMethod === "COD") {
      setPaymentMethod("");
    }
  }, [totalPrice, paymentMethod, setPaymentMethod]);


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("https://zenvy-store.onrender.com/api/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const defaultAddress = data.find(item => item.isDefault);

        setAddress(defaultAddress);
      } catch (err) {
        console.error("Error fetching address:", err);
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchdata();
  }, []);
  

  return (
    <>
      <style>
        {`
          body {
            background: #f4f6f8;
          }

          a { color: #0a637e; }

          .card-box {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          }

          .payment-option {
            border-bottom: 1px solid #eee;
            padding: 15px 0;
          }

          .payment-option:hover {
            background: #fafafa;
          }

          .selected-method {
            background: #ffeaea;
            border-radius: 6px;
            padding: 8px;
          }

          .summary-box {
            position: sticky;
            top: 20px;
          }
        `}
      </style>
 <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
            />
      <div className="container py-4">
        <div className="row">

          {/* LEFT */}
          <div className="col-md-8">

            {/* ADDRESS */}
            <div className="card-box mb-3">
              {loadingAddress ? (
                <p>Loading address...</p>
              ) : !address ? (
                <p>No default address found</p>
              ) : (
                <>
                  <div className="d-flex justify-content-between">
                    <h6 className="fw-bold">
                      Delivering to {address.fullname}
                    </h6>
                    <a href="/address">Change</a>
                  </div>

                  <p className="text-muted small mb-1">
                    {address.flat}, {address.area}, {address.city}, {address.state}
                  </p>

                  <p className="small">
                    {address.pincode}, {address.country}
                  </p>
                </>
              )}
            </div>

            {/* PAYMENT */}
            <div className="card-box mb-3">
              <h4 className="fw-bold mb-3">Payment Method</h4>

              {/* CARD */}
              <div className="payment-option">
                <input type="radio"
                  name="paymentMethod"
                  onChange={() => setPaymentMethod("Card")}
                />
                <span className="ms-2 fw-bold">Card Payment</span>
              </div>

              {/* NET BANKING */}
              <div className="payment-option">
                <input type="radio"
                  name="paymentMethod"
                  onChange={() => setPaymentMethod("Net Banking")}
                />
                <span className="ms-2">Net Banking</span>

                <select className="form-select mt-2 w-50">
                  <option>Select Bank</option>
                  <option>SBI</option>
                  <option>HDFC</option>
                  <option>ICICI</option>
                </select>
              </div>

              {/* UPI */}
              <div className="payment-option">
                <input type="radio"
                  name="paymentMethod"
                  onChange={() => setPaymentMethod("UPI")}
                />
                <span className="ms-2">UPI Payment</span>
              </div>

              {/* COD */}
              <div className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  disabled={totalPrice >= 500}
                />
                <span className="ms-2">Cash on Delivery</span>

                <br />
                <small className="text-muted">
                  {totalPrice >= 500
                    ? "Not available above ₹500"
                    : "Available"}
                </small>
              </div>

              {/* SELECTED */}
              {paymentMethod && (
                <div className="selected-method mt-3">
                  Selected: <b>{paymentMethod}</b>
                </div>
              )}

              <button className="btn btn-danger bg-gradient mt-3 px-4 rounded-pill"
              onClick={() => handlePaymentSubmit()}>
                Use this payment method
              </button>
            </div>

            {/* REVIEW */}
            <div className="card-box">
              <h5>Review items and shipping</h5>
              
              <p className='text-black' style={{ fontSize: "11px" }}>
                Check our <a href="#" className='text-decoration-none'>help pages</a> or <a href="#" className='text-decoration-none'>contact us 24x7</a>
              </p>
              <div style={{  margin: "0 auto", fontFamily: "Arial, sans-serif", fontSize: "11px", lineHeight: "1.5" }}>
                <p style={{ marginBottom: "10px" }}>
                  The Online refund will be credited directly through the mode from which payment was made within 10 to 15 working days. 
                  In case of Cash on Delivery (COD) order, the refund will be in the mode of Bank transfer through NEFT or IMPS.
                </p>

                <p style={{ marginBottom: "10px" }}>
                  Please use the same email address and the mobile number to track the status of your query. The Refund will be through NEFT / 
                  IMPs to the bank account furnished by you in the refund form. We will endeavor to process your request within 21 working days 
                  from the date of receipt of your complaint.
                </p>

                <p style={{ marginBottom: "10px" }}>
                  If you need further clarification or have additional queries, please contact our support team with your order details, 
                  and we will be happy to assist you.
                </p>
              </div>

              <p className='text-black' style={{ fontSize: "11px" }}>
                See Zenvy's <a href="#">Return Policy.</a>
              </p>
              <a href="/cart" style={{ fontSize: "11px" }} className='text-decoration-none'>Back to cart</a>
         
            </div>

          </div>

          {/* RIGHT */}
          <div className="col-md-4">
            <div className="card-box summary-box">

              <button
  className="btn btn-danger bg-gradient w-100 rounded-pill"
  onClick={() => handlePaymentSubmit()}
  disabled={!paymentMethod}
>
  Continue
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
                <p>₹{totalPrice}</p>
              </div>

              <div className="d-flex justify-content-between fw-bold">
                <p>Order Total</p>
                <p>₹{totalPrice}</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default CartMethod;