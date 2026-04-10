/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/output-onlinepngtools.png';

function Password() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeUser = () => {
    localStorage.removeItem("email");
    navigate("/Signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("❌ Email not found!");
      return;
    }

    try {
     const res = await fetch("http://localhost:2000/auth/check", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    value: email,
    password: password  
  }),
});

      const data = await res.json();

      if (!data.exists) {
        toast.error("❌ User not found!");
        return;
      }

      const user = data.user;

      if (user.password === password) {

  const token = data.token;  
  if (!token) {
    console.error("❌ Token missing from backend");
    toast.error("Login failed: No token");
    return;
  }

  localStorage.setItem("token", token);  
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("userId", user._id);

  console.log("✅ TOKEN SAVED:", token);

  // ✅ FIXED: Change this line from "storage" to "userLoggedIn"
  window.dispatchEvent(new Event("userLoggedIn"));

  setUserData(user);

  toast.success(`✅ Login Successful! Welcome ${user.fullName}`, {
    onClose: () => navigate("/"),
  });


      } else {
        toast.error("❌ Invalid Password!");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error connecting to API");
    }
  };

  const handleGetOtp = async () => {
    try {
      if (!email) {
        toast.error("Enter email first!");
        return;
      }

      const res = await fetch("http://localhost:2000/auth/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: email }),
      });

      const data = await res.json();

      if (!data.exists) {
        toast.error("❌ User not found!");
        return;
      }

      const user = data.user;

      const otpRes = await fetch("http://localhost:2000/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        toast.error(otpData.message || "Failed to send OTP");
        return;
      }

      localStorage.setItem(
        "signupData",
        JSON.stringify({
          email: user.email,
          fullName: user.fullName,
          mobileNumber: user.mobileNumber,
          password: user.password,
        })
      );

      toast.success("✅ OTP sent to your email!");
      navigate("/verify");

    } catch (error) {
      console.error(error);
      toast.error("⚠️ Failed to send OTP");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="d-flex justify-content-center align-items-center text-center mt-5 px-3">
        <a href="/" className="text-decoration-none text-black">
          <img src={logo} alt="logp" height="70px" className="mb-4 logoimg" />
        </a>
        <span className="fw-semibold mb-1" style={{ marginTop: "-26px", fontSize: "13px" }}>
          .in
        </span>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className="card p-4" style={{ width: "350px" }}>
          <h1 className="card-title mt-1 fw-semibold" style={{ fontSize: "28px" }}>
            Sign in
          </h1>

          <div className="d-flex">
            <span className="mt-1 fw-semibold" style={{ fontSize: "17px" }}>
              {email ? (
                <>
                  {email}{" "}
                  <a
                    onClick={handleChangeUser}
                    className="text-decoration-none"
                    style={{ color: "#0a637e", cursor: "pointer" }}
                  >
                    Change
                  </a>
                </>
              ) : (
                <>
                  Sign in{" "}
                  <a
                    onClick={handleChangeUser}
                    className="text-decoration-none"
                    style={{ color: "#0a637e", cursor: "pointer" }}
                  >
                    Change
                  </a>
                </>
              )}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between">
              <label className="mb-1" style={{ fontWeight: "700" }}>
                Password
              </label>
            </div>

            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control mb-2"
                onChange={handleChange}
                value={password}
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "30%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#555"
                }}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </span>
            </div>

            <div className="d-grid">
              <button type="submit" className="bg-gradient btn btn-danger rounded-pill mb-1">
                Sign in
              </button>
            </div>

            <div className="d-flex text-muted">
              <hr style={{ width: "142px" }} />
              <span className="mt-2" style={{ fontSize: "10px" }}>or</span>
              <hr style={{ width: "142px" }} />
            </div>

            <div className="d-grid">
              <button
                type="button"
                onClick={handleGetOtp}
                className="btn border-secondary rounded-pill fw-semibold"
              >
                Get an OTP on your phone
              </button>
            </div>
          </form>

          {userData && (
            <div className="text-success small mt-3">
              <b>Welcome {userData.fullName}!</b>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Password;