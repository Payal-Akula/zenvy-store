/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from '../assets/images/output-onlinepngtools.png';

function Verify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        setCanResend(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    const signupData = JSON.parse(localStorage.getItem("signupData"));
    if (!signupData) {
      toast.error("Session expired. Please sign up again.");
      navigate("/create");
      return;
    }

    try {
      const res = await fetch("http://localhost:2000/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: signupData.email }),
      });

      if (res.ok) {
        toast.success("OTP resent successfully!");
        setTimer(30);
        setCanResend(false);
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Server error. Please try again.");
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
      navigate("/create");
      return;
    }

    try {
      const res = await fetch("http://localhost:2000/auth/otp/verify", {
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
      if (data.token) {
  localStorage.setItem("token", data.token);  
  localStorage.setItem("user", JSON.stringify(data.user)); 
}
      if (data.statusCode === 200) {
        // ✅ IMPORTANT: Store userId in localStorage
        const userId = data.user._id || data.user.id;
        
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", userId); // This is crucial for cart
        
        console.log("✅ User registered:", data.user);
        console.log("✅ UserId stored:", userId);
        
        localStorage.removeItem("signupData");
        
        toast.success("Account created successfully! 🎉");
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.message || "Invalid OTP");
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
          <img src={logo} alt="logo" height="70px" className="mb-4 logoimg" />
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className="card p-4" style={{ width: "350px" }}>
          <h1 className="fw-semibold" style={{ fontSize: "25px", textAlign: "left" }}>
            Verify OTP
          </h1>
          
          <p className="text-muted small mt-2">
            Enter the 6-digit OTP sent to your email
          </p>

          <input
            type="text"
            className="form-control text-center mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength="6"
            style={{ fontSize: "24px", letterSpacing: "5px" }}
          />

          <div className="d-grid mb-3">
            <button 
              className="btn btn-danger rounded-pill" 
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-muted small">
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