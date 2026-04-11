/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../assets/images/output-onlinepngtools.png';

function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60); // Changed from 30 to 60 seconds
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if signupData exists
    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (!signupData) {
      toast.error("Session expired. Please sign up again.");
      setTimeout(() => {
        navigate("/register");
      }, 1500);
      return;
    }

    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setCanResend(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, navigate]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (!signupData) {
      toast.error("Session expired. Please sign up again.");
      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      console.log("Resending OTP to:", signupData.email);
      
      const res = await fetch("https://zenvy-store.onrender.com/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: signupData.email }),
      });

      const data = await res.json();
      console.log("Resend response:", data);

      if (res.ok) {
        toast.success("OTP resent successfully! 📧 Please check your email.");
        setTimer(60); // Reset to 60 seconds
        setCanResend(false);
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (!signupData) {
      toast.error("Session expired. Please sign up again.");
      navigate("/register");
      setLoading(false);
      return;
    }

    try {
      console.log("Verifying OTP for:", signupData.email);
      
      const res = await fetch("https://zenvy-store.onrender.com/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupData.email,
          otp: parseInt(otp),
          fullName: signupData.fullName,
          mobileNumber: signupData.mobileNumber,
          password: signupData.password,
        }),
      });

      const data = await res.json();
      console.log("Verify response:", data);
      
      if (res.ok && data.token) {
        // Store user data
        localStorage.setItem("token", data.token);  
        localStorage.setItem("user", JSON.stringify(data.user)); 
        localStorage.setItem("userId", data.user._id || data.user.id);
        
        console.log("✅ User registered successfully:", data.user);
        
        // Clear signup data
        localStorage.removeItem("signupData");
        
        toast.success("Account created successfully! 🎉");
        
        // Dispatch login event
        window.dispatchEvent(new Event("userLoggedIn"));
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      
      <div className="d-flex justify-content-center align-items-center text-center mt-5 px-3">
        <a href="/" className="text-decoration-none text-black">
          <img src={logo} alt="logo" height="70px" className="mb-4 logo-img" />
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center px-3">
        <div className="card p-4" style={{ width: "100%", maxWidth: "400px" }}>
          <h1 className="fw-semibold" style={{ fontSize: "clamp(20px, 5vw, 25px)", textAlign: "left" }}>
            Verify OTP
          </h1>
          
          <p className="text-muted small mt-2" style={{ fontSize: "clamp(11px, 3vw, 13px)" }}>
            Enter the 6-digit OTP sent to your email
          </p>

          <input
            type="text"
            className="form-control text-center mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength="6"
            style={{ fontSize: "clamp(18px, 5vw, 24px)", letterSpacing: "clamp(3px, 2vw, 5px)", padding: "12px" }}
          />

          <div className="d-grid mb-3">
            <button 
              className="btn btn-danger rounded-pill" 
              onClick={handleVerify}
              disabled={loading}
              style={{ fontSize: "clamp(12px, 3.5vw, 14px)", padding: "10px 0" }}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-muted small" style={{ fontSize: "clamp(11px, 3vw, 12px)" }}>
              Didn't receive OTP?{" "}
              {canResend ? (
                <span 
                  onClick={handleResendOTP}
                  style={{ color: "#0a637e", cursor: "pointer" }}
                >
                  Resend OTP
                </span>
              ) : (
                <span className="text-muted">Resend in {timer}s</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verify;