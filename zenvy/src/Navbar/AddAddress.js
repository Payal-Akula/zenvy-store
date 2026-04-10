/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */ 
import React, { useState, useEffect } from 'react';
import { addAddress } from "../services/addressService";
import "../modals/AddressModal.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

function AddAddress() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [fullname, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [pincode, setPin] = useState("");
  const [flat, setFlat] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Please login first to add address ❌");
      navigate("/signin");
      return;
    }
    
    handleAutoFill();
  }, []);

  async function handleAutoFill() {
    try {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const la = pos.coords.latitude;
        const lo = pos.coords.longitude;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${la}&lon=${lo}`
        );

        const data = await response.json();
        const address = data.address || {};

        setCountry(address.country || "");
        setPin(address.postcode || "");
        setState(address.state || address.region || "");
        setCity(address.city || address.town || address.village || address.county || "");
        setArea(data.display_name || "");
        setFlat(
          `${data.type || "Building"} near ${
            address.quarter || address.neighbourhood || address.suburb || address.road || ""
          }`
        );

        setLoading(false);
      });
    } catch (error) {
      console.error("Autofill Error:", error);
      setLoading(false);
      alert("Failed to autofill location!");
    }
  }

  async function formSubmit(e) {
    e.preventDefault();

    // Double-check authentication before submitting
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      toast.error("Session expired. Please login again ❌");
      navigate("/signin");
      return;
    }

    const payload = {
      fullName: fullname,
      mobile,
      pincode,
      flat,
      area,
      city,
      state,
      country,
      isDefault
    };

    try {
      const res = await addAddress(payload);
      toast.success("✅ Address added successfully!", {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/Address")   
      });
    } catch (err) {
      console.error("Submit Error:", err.message);
      if (err.message.includes("token") || err.message.includes("401")) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        toast.error("Error submitting form!");
      }
    }
  }

  return (
    <>
      <ToastContainer/>
      <div className="container mt-4 mb-5">
        <div className="address-container mx-auto" style={{ maxWidth: "700px" }}>
          
          <nav style={{ fontSize: "13px" }}>
            <a href="/myAccount" className="text-decoration-none text-secondary">Your Account</a>
            <span className="mx-2 text-secondary">›</span>
            <a href="/Address" className="text-decoration-none text-secondary">Your Addresses</a>
            <span className="mx-2 text-secondary">›</span>
            <a href="#" className="text-decoration-none text-danger fw-semibold">New Address</a>
          </nav>

          <h4 className="mt-3 address-title">Add a new address</h4>

          {/* Autofill */}
          <div className="autofill-box d-flex justify-content-between align-items-center mt-3 px-3 py-2">
            <span>
              <i className="bi bi-info-circle me-2"></i>
              Autofill your current location
            </span>
            <button
              type="button"
              className="btn btn-outline-info btn-sm"
              onClick={handleAutoFill}
              disabled={loading}
            >
              {loading ? "Loading..." : "Autofill"}
            </button>
          </div>

          <form onSubmit={formSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label fw-semibold">Country/Region</label>
              <input
                type="text"
                className="form-control text-muted"
                value={country}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Full name</label>
              <input className="form-control" required onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Mobile number</label>
              <input className="form-control" required onChange={(e) => setMobile(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Pincode</label>
              <input className="form-control" value={pincode} required onChange={(e) => setPin(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Flat</label>
              <input className="form-control" value={flat} required onChange={(e) => setFlat(e.target.value)} />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Area</label>
              <input className="form-control" value={area} required onChange={(e) => setArea(e.target.value)} />
            </div>

            <div className="row">
              <div className="col-md-6 mb-5">
                <label className="form-label fw-semibold">City</label>
                <input className="form-control" value={city} required onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="col-md-6 mb-5">
                <label className="form-label fw-semibold">State</label>
                <input className="form-control" value={state} required onChange={(e) => setState(e.target.value)} />
              </div>
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
              <label className="form-check-label">
                Make this my default address
              </label>
            </div>

            <button type="submit" className="btn btn-warning px-4">
              Add address
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddAddress;