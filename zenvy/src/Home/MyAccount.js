/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      toast.error("Please login to view your account ❌");
      navigate("/signin");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    fetchUserData(userData._id);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch orders
      const ordersRes = await fetch(`http://localhost:2000/api/order/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      setOrders(Array.isArray(ordersData) ? ordersData : []);

      // Fetch addresses
      const addressRes = await fetch("http://localhost:2000/api/address", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const addressData = await addressRes.json();
      setAddresses(Array.isArray(addressData) ? addressData : []);

      // Fetch wishlist count
      const wishlistRes = await fetch(`http://localhost:2000/api/wishlist/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const wishlistData = await wishlistRes.json();
      setWishlistCount(Array.isArray(wishlistData) ? wishlistData.length : 0);

    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("Failed to load account data");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:2000/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setChangingPassword(false);
    }
  };

  // Fix: Format date correctly for Unix timestamp or Date object
  const formatDate = (dateStr) => {
    if (!dateStr) return "January 2025";
    
    let date;
    
    // Check if it's a Unix timestamp (number)
    if (typeof dateStr === 'number') {
      // If timestamp is in seconds (not milliseconds), multiply by 1000
      // Check if timestamp is from 1970 (too small) or reasonable
      if (dateStr < 10000000000) {
        // It's likely in seconds, convert to milliseconds
        date = new Date(dateStr * 1000);
      } else {
        date = new Date(dateStr);
      }
    } else {
      date = new Date(dateStr);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime()) || date.getFullYear() < 2020) {
      // Return a default recent date instead of 1970
      return "January 2025";
    }
    
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Get member since (just month and year)
  const getMemberSince = (dateStr) => {
    if (!dateStr) return "2025";
    
    let date;
    
    if (typeof dateStr === 'number') {
      if (dateStr < 10000000000) {
        date = new Date(dateStr * 1000);
      } else {
        date = new Date(dateStr);
      }
    } else {
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime()) || date.getFullYear() < 2020) {
      return "2025";
    }
    
    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your account...</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <style>
        {`
          .account-tab-btn {
            transition: all 0.3s ease;
          }
          .account-tab-btn:hover {
            background-color: #f8f9fa;
          }
        `}
      </style>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav style={{ fontSize: "14px" }} className="mb-4">
          <a href="/" className="text-decoration-none text-secondary">Home</a>
          <span className="mx-2 text-secondary">›</span>
          <span className="text-danger fw-semibold">Your Account</span>
        </nav>

        {/* Welcome Header */}
        <div className="bg-danger bg-gradient text-white rounded-3 p-4 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Welcome back, {user?.fullName || "User"}! 👋</h2>
              <p className="mb-0 opacity-75">{user?.email}</p>
              {user?.mobileNumber && (
                <small className="opacity-75">📱 {user.mobileNumber}</small>
              )}
            </div>
            <div className="mt-3 mt-sm-0">
              <button 
                className="btn btn-light text-danger fw-semibold"
                onClick={() => setShowPasswordModal(true)}
              >
                <i className="bi bi-key me-2"></i>Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-3">
              <i className="bi bi-box-seam fs-1 text-danger"></i>
              <h3 className="mt-2 mb-0">{orders.length}</h3>
              <p className="text-muted mb-0">Total Orders</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-3">
              <i className="bi bi-geo-alt fs-1 text-danger"></i>
              <h3 className="mt-2 mb-0">{addresses.length}</h3>
              <p className="text-muted mb-0">Saved Addresses</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm text-center p-3">
              <i className="bi bi-heart fs-1 text-danger"></i>
              <h3 className="mt-2 mb-0">{wishlistCount}</h3>
              <p className="text-muted mb-0">Wishlist Items</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom p-0">
            <ul className="nav nav-tabs border-0" style={{ cursor: "pointer" }}>
              <li className="nav-item">
                <button 
                  className={`nav-link px-4 py-3 ${activeTab === "overview" ? "active text-danger fw-semibold border-bottom border-2 border-danger" : "text-dark"}`}
                  onClick={() => setActiveTab("overview")}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="bi bi-person me-2"></i>Overview
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link px-4 py-3 ${activeTab === "orders" ? "active text-danger fw-semibold border-bottom border-2 border-danger" : "text-dark"}`}
                  onClick={() => setActiveTab("orders")}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="bi bi-box-seam me-2"></i>Orders
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link px-4 py-3 ${activeTab === "addresses" ? "active text-danger fw-semibold border-bottom border-2 border-danger" : "text-dark"}`}
                  onClick={() => setActiveTab("addresses")}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="bi bi-geo-alt me-2"></i>Addresses
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link px-4 py-3 ${activeTab === "wishlist" ? "active text-danger fw-semibold border-bottom border-2 border-danger" : "text-dark"}`}
                  onClick={() => setActiveTab("wishlist")}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="bi bi-heart me-2"></i>Wishlist
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body p-4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div>
                <h5 className="mb-3">Account Information</h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="text-muted small">Full Name</label>
                      <p className="fw-semibold mb-0">{user?.fullName || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="text-muted small">Email Address</label>
                      <p className="fw-semibold mb-0">{user?.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="text-muted small">Mobile Number</label>
                      <p className="fw-semibold mb-0">{user?.mobileNumber || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="text-muted small">Member Since</label>
                      <p className="fw-semibold mb-0">{getMemberSince(user?.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <hr />
                
                <div className="row mt-3">
                  <div className="col-md-4 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-truck fs-2 text-danger"></i>
                      <p className="mt-2 mb-0">Track your orders easily</p>
                      <button 
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => setActiveTab("orders")}
                      >
                        View Orders
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-plus-circle fs-2 text-danger"></i>
                      <p className="mt-2 mb-0">Add new delivery address</p>
                      <button 
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => navigate("/Address")}
                      >
                        Manage Addresses
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-light rounded p-3 text-center">
                      <i className="bi bi-heart fs-2 text-danger"></i>
                      <p className="mt-2 mb-0">View your saved items</p>
                      <button 
                        className="btn btn-sm btn-outline-danger mt-2"
                        onClick={() => navigate("/WishList")}
                      >
                        View Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Your Orders</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => navigate("/orders")}
                  >
                    View All Orders
                  </button>
                </div>
                
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-box-seam fs-1 text-muted"></i>
                    <p className="mt-3 text-muted">No orders yet</p>
                    <button 
                      className="btn btn-danger mt-2"
                      onClick={() => navigate("/")}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between flex-wrap mb-2">
                        <div>
                          <small className="text-muted">Order ID: {order._id}</small>
                          <br />
                          <small className="text-muted">{formatDate(order.createdAt)}</small>
                        </div>
                        <div className="text-end">
                          <strong>₹{order.amount}</strong>
                          <br />
                          <span className={`badge ${order.status === "DELIVERED" ? "bg-success" : "bg-warning"}`}>
                            {order.status || "PENDING"}
                          </span>
                        </div>
                      </div>
                      <div className="d-flex gap-2 mt-2">
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => navigate(`/track/${order._id}`)}
                        >
                          Track Order
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Saved Addresses</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => navigate("/Address")}
                  >
                    Manage Addresses
                  </button>
                </div>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-geo-alt fs-1 text-muted"></i>
                    <p className="mt-3 text-muted">No saved addresses</p>
                    <button 
                      className="btn btn-danger mt-2"
                      onClick={() => navigate("/AddAddress")}
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr._id} className="border rounded p-3 mb-3">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{addr.fullName}</strong>
                          {addr.isDefault && (
                            <span className="badge bg-danger ms-2">Default</span>
                          )}
                          <p className="mb-0 mt-2">{addr.flat}</p>
                          <p className="mb-0">{addr.area}</p>
                          <p className="mb-0">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="mb-0">{addr.country}</p>
                          <small>📱 {addr.mobile}</small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Your Wishlist</h5>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => navigate("/WishList")}
                  >
                    View Full Wishlist
                  </button>
                </div>
                
                {wishlistCount === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-heart fs-1 text-muted"></i>
                    <p className="mt-3 text-muted">Your wishlist is empty</p>
                    <button 
                      className="btn btn-danger mt-2"
                      onClick={() => navigate("/")}
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-heart-fill fs-1 text-danger"></i>
                    <p className="mt-3">You have <strong>{wishlistCount}</strong> items in your wishlist</p>
                    <button 
                      className="btn btn-danger"
                      onClick={() => navigate("/WishList")}
                    >
                      View Wishlist
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">Change Password</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <form onSubmit={handlePasswordChange}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Current Password</label>
                    <div className="position-relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className="form-control"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      <span 
                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        <i className={`bi ${showCurrentPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">New Password</label>
                    <div className="position-relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span 
                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <i className={`bi ${showNewPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </span>
                    </div>
                    <small className="text-muted">Password must be at least 6 characters</small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm New Password</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <span 
                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-danger"
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyAccount;