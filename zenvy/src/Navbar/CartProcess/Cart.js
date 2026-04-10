/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, setCart, removeFromCart, updateQuantity } = useCart();
  const [saved, setSaved] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("saved");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const token = localStorage.getItem("token")

useEffect(() => {
  if (cart.length === 0) return;
    fetch("http://localhost:2000/api/products")
      .then((res) => res.json())
      .then((data) => {
        let cartTitle = cart[0].title.toLowerCase();
        const keywords = cartTitle.split(" ").filter((w) => w.length > 2);

        const related = data.filter((p) => {
          const title = p.title.toLowerCase();
          return keywords.some((k) => title.includes(k)) && p.id !== cart[0].id;
        });

        setRelatedProducts(related);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart]);

  const toggleCheck = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const today = new Date();
  today.setDate(today.getDate() + 6);

  const deliveryDate = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });

  const deselectAll = () => {
    setCheckedItems({});
  };

 const increaseQty = (id, qty) => {
  updateQuantity(id, qty + 1);
};

const decreaseQty = (id, qty) => {
  if (qty > 1) {
    updateQuantity(id, qty - 1);
  }
};
 const deleteItem = (id) => {
  removeFromCart(id);
};
  const saveForLater = (item) => {
    deleteItem(item.id);
    setSaved((prev) => [...prev, item]);
  };

  const moveToCart = (item) => {
    setSaved((prev) => prev.filter((i) => i.id !== item.id));
    setCart((prev) => [...prev, item]);
  };

  const shareItem = (item) => {
    const shareText = `${item.title} — ₹${item.price}\nCheck this out!`;

    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Link copied!");
    }
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  
  localStorage.setItem("token", token)
  console.log(localStorage.getItem("token"))
  const requireAuth = () => {
  if (!token) {
    navigate("/signin")
    return false
  }
  return true
}
useEffect(() => {
  console.log("🛒 CART STATE:", cart);
}, [cart]);
useEffect(() => { 
  console.log("FINAL CART:", cart);
}, [cart]);

  return (
    <>
      <style>
        {`

.cart-item {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.related-product {
  display: flex;
  gap: 12px;
}

img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.cart-item h5,
.cart-item p,
.related-product h6,
.related-product p,
.related-product small {
  word-break: break-word !important;
  white-space: normal !important;
}

@media (max-width: 768px) {
  .col-9, .col-md-9 {
    order: 1 !important;
    width: 100% !important;
  }

  .col-3, .col-md-3 {
    order: 2 !important;
    width: 100% !important;
    margin-top: 20px;
  }

  .related-wrapper {
    order: 3 !important;
    width: 100% !important;
  }

  .terms-text {
    order: 4 !important;
    display: block !important;
    margin-top: 10px;
  }
}

.tab-item {
  width: 50%;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  font-weight: 600;
  color: #333;
  background: none;
  border: none;
}

.tab-item.active {
  color: #0070c9;
}

.tab-underline {
  position: absolute;
  bottom: 0;
  height: 3px;
  width: 50%;
  background: #0070c9;
  transition: left 0.3s ease;
}

.progress-container {
  background: #e6e6e6;
  height: 10px;
  border-radius: 20px;
  overflow: hidden;
  width: 100%;
}
.progress-bar {
  height: 100%;
  background: #0a8a00;
  transition: width 0.4s ease;
}

.emi-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}


@media (max-width: 480px) {

  .cart-item {
    flex-direction: column !important;
    text-align: left;
  }

  .cart-item img {
    width: 110px !important;
    height: 110px !important;
    margin: 0 auto;
  }

  .cart-actions {
    flex-wrap: wrap;
    gap: 8px;
  }

  .related-product {
    flex-direction: column !important;
    text-align: center;
  }

  .related-product img {
    width: 100px !important;
    height: 100px !important;
    margin: 0 auto;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {

  .cart-item img {
    width: 150px !important;
    height: 150px !important;
  }

  .related-product img {
    width: 130px !important;
  }
}

@media (min-width: 1025px) and (max-width: 1440px) {

  .related-product {
    display: flex;
    align-items: flex-start;
    gap: 16px !important;
  }

  .related-product img {
    width: 140px !important;
    height: 140px !important;
    object-fit: contain;
  }

  .related-product h6 {
    font-size: 15px;
    line-height: 1.3;
  }

  .related-product small,
  .related-product p {
    font-size: 13px !important;
    line-height: 1.3 !important;
    white-space: normal !important;
  }

  .related-product button {
    padding: 5px 18px !important;
    font-size: 13px !important;
  }
}
  .related-scroll {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 10px;
  white-space: nowrap;
  scroll-behavior: smooth;
}

.related-scroll::-webkit-scrollbar {
  height: 6px;
}

.related-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.related-card {
  min-width: 160px;
  max-width: 160px;
  padding: 10px;
  border-radius: 6px;
  background: white;
  border: 1px solid #ddd;
  cursor: pointer;
}

`}
      </style>

      <div
        className="container-fluid py-4"
        style={{ backgroundColor: "#eaeded" }}
      >
        <div className="row">
          {/* LEFT COLUMN */}
          <div className="col-md-9">
            <div
              className="container bg-white p-4 rounded"
              style={{ maxWidth: "1350px" }}
            >
              {!token ? (
 <div className="text-center mt-5">
    <h3 className="fw-bold">Your Zenvy Cart is waiting 🛒</h3>
    <p className="text-muted">
      Sign in to view your saved items and continue shopping.
    </p>

     <button
      className="bg-gradient btn btn-danger px-4 mt-3"
      onClick={() => navigate("/signin")}
    >
      Sign in to your account
    </button>
  </div>
) : cart.length === 0 ? (
  <div className="mt-5">
    <h3 className="fw-bold">Your cart feels lonely 😢</h3>
    <p className="text-muted">
      Let’s fix that — discover something amazing.
    </p>
  </div>
) : null}

              {token && cart.length > 0 &&  (
                <>
                  <div className="mt-4 g-4">
                    <div>
                      <h2 className="fw-normal">Shopping Cart</h2>

                      <a
                        className="small text-decoration-none"
                        onClick={deselectAll}
                        style={{ color: "#0a637e", cursor: "pointer" }}
                      >
                        Deselect all items
                      </a>

                      <hr />

                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="border-bottom py-4 d-flex gap-4 cart-item"
                        >
                          <input
                            type="checkbox"
                            checked={checkedItems[item.id] || false}
                            onChange={() => toggleCheck(item.id)}
                          />

                          <img
                            src={item.image}
                            alt={item.title}
                            onClick={() =>
                              navigate(`/productpage/${item.id}`)
                            }
                            style={{
                              cursor: "pointer",
                              width: "150px",
                              height: "150px",
                              objectFit: "contain",
                            }}
                          />

                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h5 className="fw-semibold mb-1">{item.title}</h5>
                              <h5 className="fw-bold mb-1">₹{item.price}</h5>
                            </div>

                            <div className="d-flex justify-content-between">
                              <p className="text-success fw-semibold mb-1">
                                In stock
                              </p>
                              <p
                                className="text-dark mb-1 fw-normal"
                                style={{ fontSize: "12px" }}
                              >
                                Up to 5% back with Zenvy
                              </p>
                            </div>

                            <p className="small mb-1">
                              FREE delivery <b>{deliveryDate}</b>
                            </p>

                            {item.size && (
                              <p className="m-0 small">Size: {item.size}</p>
                            )}
                            {item.color && (
                              <p className="m-0 small">Colour: {item.color}</p>
                            )}

                            <div className="d-flex mt-2 cart-actions">
                             <button onClick={() => decreaseQty(item.id, item.quantity)}>−</button>

                              <span className="px-3 fw-semibold">
                                {item.quantity}
                              </span>

                             <button onClick={() => {
  if (!requireAuth()) return;
  increaseQty(item.id, item.quantity);
}}>
  +
</button>
                              <a
                                className="ms-3 text-decoration-none small"
                                onClick={() => deleteItem(item.id)}
                                style={{
                                  color: "#0a637e",
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </a>

                              <a
                                className="ms-3 text-decoration-none small"
                                onClick={() => saveForLater(item)}
                                style={{
                                  color: "#0a637e",
                                  cursor: "pointer",
                                }}
                              >
                                Save for later
                              </a>

                              <a
                                className="ms-3 text-decoration-none small"
                                onClick={() => shareItem(item)}
                                style={{
                                  color: "#0a637e",
                                  cursor: "pointer",
                                }}
                              >
                                Share
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="text-end mt-3 fs-4 fw-normal">
                        Subtotal ({cart.length} items):{" "}
                        <span className="fw-bold"> ₹{subtotal}</span>
                      </div>

                      {saved.length > 0 && (
                        <div className="mt-5">
                          <h4>Your Items</h4>
                          {saved.map((item) => (
                            <div
                              key={item.id}
                              className="border-bottom py-4 d-flex gap-4"
                            >
                              <img
                                src={item.image}
                                style={{
                                  width: "120px",
                                  objectFit: "contain",
                                }}
                              />

                              <div className="flex-grow-1">
                                <h5>{item.title}</h5>
                                <a
                                  className="text-primary"
                                  onClick={() => moveToCart(item)}
                                >
                                  Move to cart
                                </a>
                              </div>

                              <div className="text-end fw-bold">
                                ₹{item.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <br />

            {/* TABS SECTION */}
            <div className="container bg-white p-4 rounded">
              <h1 className="fs-3">Your Items</h1>

              <div className="tabs-wrapper">
                <div className="d-flex position-relative border-bottom">
                  <input
                    type="button"
                    value="No items saved for later"
                    className={`tab-item ${
                      activeTab === "saved" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("saved")}
                  />

                  <input
                    type="button"
                    value="Buy it again"
                    className={`tab-item ${
                      activeTab === "buy" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("buy")}
                  />

                  <div
                    className="tab-underline"
                    style={{
                      left: activeTab === "saved" ? "0%" : "50%",
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4">
                {activeTab === "saved" ? (
                  <p className="text-muted">No items saved for later</p>
                ) : (
                  <p className="text-muted">
                    Buy it again list is empty
                  </p>
                )}
              </div>
            </div>
   <div className="container bg-white p-3 rounded mt-4">
              <h4 className="fw-bold mb-3">
                Customers who viewed {cart[0]?.title} also viewed
              </h4>

              {relatedProducts.length === 0 ? (
                <p>No related products found</p>
              ) : (
                <div className="related-scroll">
                  {relatedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="related-card"
                      onClick={() => navigate(`/productpage/${prod.id}`)}
                    >
                      <img
                        src={prod.thumbnail}
                        style={{
                          width: "100%",
                          height: "130px",
                          objectFit: "contain",
                        }}
                      />

                      <h6 className="fw-semibold small mt-2 mb-1">
                        {prod.title}
                      </h6>

                      <div className="text-warning small">★★★★☆</div>

                      <div className="fw-bold text-dark">₹{prod.price}</div>

                      <small className="text-muted">Get it by Tomorrow</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <br />

            <p className="small fw-normal text-black mb-1">
              The price and availability of items at Zenvy are subject to
              change. The shopping cart is a temporary place to store a list of
              your items.
            </p>
            <span className="small fw-normal text-black">
              Do you have a gift card or promotional code?
            </span>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-3">
            <div className="border p-3 rounded shadow-sm bg-white">
              {/* PROGRESS BAR */}
              <div className="progress-container mt-2">
                <div
                  className="progress-bar"
                  style={{
                    width:
                      subtotal >= 200
                        ? "100%"
                        : `${(subtotal / 200) * 100}%`,
                  }}
                ></div>
              </div>

              {/* DELIVERY MESSAGE */}
              {subtotal >= 200 ? (
                <h3 className="text-success small mt-2 mb-1">
                  ✔ Your order is eligible for FREE Delivery.
                </h3>
              ) : (
                <h3 className="text-success small mt-2 mb-1">
                  🔥 You're ₹{200 - subtotal} away from FREE delivery!
                </h3>
              )}

              <h4 className="small mt-0 mb-3">
                Choose{" "}
                <a href="#" style={{ color: "#0a637e" }}>
                  FREE Delivery
                </a>{" "}
                option at checkout.
              </h4>

              <h5 className="fw-bold mt-3">
                Subtotal ({cart.length} item
                {cart.length > 1 && "s"}):
                <span className="text-dark">
                  {" "}
                  ₹{subtotal.toLocaleString()}
                </span>
              </h5>

              <div className="form-check my-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="giftCheck"
                />
                <label
                  className="form-check-label small"
                  htmlFor="giftCheck"
                >
                  This order contains a gift
                </label>
              </div>

              <button
  className="bg-gradient btn btn-danger w-100 mt-2 fw-semibold rounded-pill"
  style={{ color:"white" }}
  onClick={() => {
    if (!token) {
      navigate("/signin");
    } else {
      navigate("/cartmethod");
    }
  }}
>
  Proceed to Buy
</button>

              <div className="emi-box">
                <div
                  className="d-flex justify-content-between emi-toggle"
                  data-bs-toggle="collapse"
                  data-bs-target="#emiBox"
                >
                  <span>EMI Available</span>
                  <span>⌃</span>
                </div>

                <div className="collapse show" id="emiBox">
                  <p className="small mt-2 mb-0">
                    Your order qualifies for EMI with valid credit cards.
                  </p>
                </div>
              </div>
            </div>

            <br />

         
           
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
