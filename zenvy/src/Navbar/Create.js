/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../assets/images/output-onlinepngtools.png';
import { uname, uphone, upassword } from "../validation/valid";
 
function Create() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [input, setInput] = useState({
    mobileNumber: "",
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    mobileNumber: "",
    fullName: "",
    email: "",
    password: "",
  });

  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  }

  const handleProceed = async (e) => {
    e.preventDefault();
    const { mobileNumber, fullName, email, password } = input;

    let valid = true;

    const newErrors = {
      mobileNumber: "",
      fullName: "",
      email: "",
      password: "",
    };

    if (!uphone(mobileNumber)) {
      newErrors.mobileNumber = "Invalid phone number!";
      valid = false;
    }

    if (!uname(fullName)) {
      newErrors.fullName = "Invalid name!";
      valid = false;
    }

    if (!email) {
      newErrors.email = "Email is required!";
      valid = false;
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = "Invalid email address!";
      valid = false;
    }

    if (!upassword(password)) {
      newErrors.password = "Password must be at least 6 characters!";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);

    try {
      console.log("Sending OTP to:", email);
      
      const res = await fetch("https://zenvy-store.onrender.com/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.message) {
        // Store signup data in localStorage
        localStorage.setItem(
          "signupData",
          JSON.stringify({
            fullName,
            email,
            mobileNumber,
            password
          })
        );

        toast.success(data.message || "OTP sent successfully to your email! 📧");
        
        setTimeout(() => {
          navigate("/verify");
        }, 1000);
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
        setErrors({ ...newErrors, email: data.message || "Failed to send OTP" });
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

    } catch (error) {
      console.error("OTP API error:", error);
      toast.error("Network error. Please check your connection and try again.");
      setErrors({ ...newErrors, email: "Network error. Please try again." });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="d-flex justify-content-center align-items-center text-center mt-2 px-3">
        <a href="/" className="text-decoration-none text-black">
          <img
            src={logo}
            alt="logo"
            height="70px"
            width="auto"
            className="mb-4 logo-img"
          />
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center px-3">
        <div className="card p-4" style={{ width: "100%", maxWidth: "500px" }}>
          <h1 className="fw-semibold" style={{ fontSize: "clamp(20px, 5vw, 25px)", textAlign: "left" }}>
            Create Account
          </h1>

          <form onSubmit={handleProceed}>
            <label className="fw-bold mt-2" style={{ fontSize: "clamp(12px, 3.5vw, 14px)" }}>Enter mobile number</label>

            <div className="d-flex align-items-center mb-1" style={{ gap: "8px", flexWrap: "wrap" }}>
              <select className="border rounded p-1" style={{ width: "clamp(70px, 20%, 85px)", height: "38px" }}>
                <option value="91">IN +91</option>
              </select>

              <input
                type="tel"
                className="form-control rounded"
                name="mobileNumber"
                value={input.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile number"
                style={{ flex: "1", minWidth: "150px" }}
                autoComplete="tel"
              />
            </div>

            {errors.mobileNumber && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.mobileNumber}
              </div>
            )}

            <label className="fw-bold mt-2" style={{ fontSize: "clamp(12px, 3.5vw, 14px)" }}>Your Name</label>

            <input
              type="text"
              className="form-control rounded mb-1"
              placeholder="First and Last name"
              name="fullName"
              value={input.fullName}
              onChange={handleChange}
              autoComplete="name"
            />

            {errors.fullName && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.fullName}
              </div>
            )}

            <label className="fw-bold mt-2" style={{ fontSize: "clamp(12px, 3.5vw, 14px)" }}>Email</label>

            <input
              type="email"
              className="form-control rounded mb-1"
              placeholder="Enter your email"
              name="email"
              value={input.email}
              onChange={handleChange}
              autoComplete="email"
            />

            {errors.email && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.email}
              </div>
            )}

            <label className="fw-bold mt-2" style={{ fontSize: "clamp(12px, 3.5vw, 14px)" }}>
              Password (at least 6 characters)
            </label>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control rounded mb-1"
                placeholder="At least 6 characters"
                name="password"
                value={input.password}
                onChange={handleChange}
                autoComplete="new-password"
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555"
                }}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>

            {errors.password && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.password}
              </div>
            )}

            <div className="text small mt-3 fw-semibold mb-3" style={{ fontSize: "clamp(11px, 3vw, 13px)" }}>
              To verify your email, we'll send an OTP to your email address.
            </div>

            <div className="d-grid">
              <button 
                type="submit" 
                className="bg-gradient btn btn-danger rounded-pill mb-1" 
                style={{ fontSize: "clamp(12px, 3.5vw, 14px)", padding: "10px 0" }}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Verify & Send OTP"}
              </button>
            </div>

            <hr />

            <div className="d-grid">
              <span className="mb-1 fw-bold" style={{ fontSize: "clamp(12px, 3.5vw, 14px)" }}>
                Already a customer?
              </span>

              <a
                href="/signin"
                className="fw-semibold text-decoration-none"
                style={{ fontSize: "clamp(13px, 4vw, 15px)", color: "#0a637e" }}
              >
                Sign in instead
              </a>
            </div>
          </form>
        </div>
      </div>

      <hr className="mt-5" />

      <footer className="w-100 text-center py-3 mt-3">
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <a href="#" className="text-decoration-none" style={{ fontSize: "clamp(10px, 3vw, 12px)", color: "#0a637e" }}>
            Conditions of Use
          </a>
          <a href="#" className="text-decoration-none" style={{ fontSize: "clamp(10px, 3vw, 12px)", color: "#0a637e" }}>
            Privacy Notice
          </a>
          <a href="#" className="text-decoration-none" style={{ fontSize: "clamp(10px, 3vw, 12px)", color: "#0a637e" }}>
            Help
          </a>
        </div>
        <p className="text-secondary mt-2" style={{ fontSize: "clamp(10px, 3vw, 12px)" }}>
          © 1996–2025, Zenvy.com, Inc. or its affiliates
        </p>
      </footer>
    </>
  );
}

export default Create;