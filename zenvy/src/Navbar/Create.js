/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    try {
      // ✅ SEND OTP API
      const res = await fetch("http://localhost:2000/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })   // 🔥 OTP goes to email
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ ...newErrors, email: data.message || "Failed to send OTP" });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        return;
      }

      // ✅ STORE DATA ONLY AFTER OTP SUCCESS
      localStorage.setItem(
        "signupData",
        JSON.stringify({
          fullName,
          email,
          mobileNumber,
          password
        })
      );

      navigate("/verify");

    } catch (error) {
      console.error("OTP API error:", error);
      setErrors({ ...newErrors, email: "Server error. Try again." });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center text-center mt-2 px-3">
        <a href="/" className="text-decoration-none text-black">
          <img
            src={logo}
            alt="logo"
            height="70px"
            width="auto"
            className="mb-4 logoimg"
          />
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className="card p-4" style={{ width: "350px" }}>
          <h1 className="fw-semibold" style={{ fontSize: "25px", textAlign: "left" }}>
            Create Account
          </h1>

          <form onSubmit={handleProceed}>
            <label className="fw-bold mt-2">Enter mobile number</label>

            <div className="d-flex align-items-center mb-1" style={{ gap: "8px" }}>
              <select className="border rounded p-1" style={{ width: "85px", height: "38px" }}>
                <option value="91">IN +91</option>
              </select>

              <input
                type="text"
                className="form-control rounded"
                name="mobileNumber"
                value={input.mobileNumber}
                onChange={handleChange}
                placeholder="Mobile number"
              />
            </div>

            {errors.mobileNumber && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.mobileNumber}
              </div>
            )}

            <label className="fw-bold mt-2">Your Name</label>

            <input
              type="text"
              className="form-control rounded mb-1"
              placeholder="First and Last name"
              name="fullName"
              value={input.fullName}
              onChange={handleChange}
            />

            {errors.fullName && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.fullName}
              </div>
            )}

            <label className="fw-bold mt-2">Email</label>

            <input
              type="email"
              className="form-control rounded mb-1"
              placeholder="Enter your email"
              name="email"
              value={input.email}
              onChange={handleChange}
            />

            {errors.email && (
              <div className={`text-danger small ${shake ? "shake" : ""}`}>
                {errors.email}
              </div>
            )}

            <label className="fw-bold mt-2">
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

            <div className="text small mt-3 fw-semibold mb-3">
              To verify your number, we’ll send a text with a temporary code.
            </div>

            <div className="d-grid">
              <button type="submit" className="bg-gradient btn btn-danger rounded-pill mb-1">
                Verify Mobile Number
              </button>
            </div>

            <hr />

            <div className="d-grid">
              <span className="mb-1 fw-bold" style={{ fontSize: "14px" }}>
                Already a customer?
              </span>

              <a
                href="/signin"
                className="fw-semibold text-decoration-none"
                style={{ fontSize: "15px", color: "#0a637e" }}
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
          <a href="#" className="text-decoration-none" style={{ fontSize: "12px", color: "#0a637e" }}>
            Conditions of Use
          </a>

          <a href="#" className="text-decoration-none" style={{ fontSize: "12px", color: "#0a637e" }}>
            Privacy Notice
          </a>

          <a href="#" className="text-decoration-none" style={{ fontSize: "12px", color: "#0a637e" }}>
            Help
          </a>
        </div>

        <p className="text-secondary mt-2" style={{ fontSize: "12px" }}>
          © 1996–2025, Zenvy.com, Inc. or its affiliates
        </p>
      </footer>
    </>
  );
}

export default Create;