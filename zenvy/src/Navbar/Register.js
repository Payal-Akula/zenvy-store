/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useNavigate } from "react-router-dom"; 
import logo from '../assets/images/output-onlinepngtools.png';

function Register() {
  const navigate = useNavigate(); 
  const handleProceed = (e) => {
    e.preventDefault(); 
    navigate("/Create"); 
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center text-center mt-2 px-3">
        <a href="/" className="text-decoration-none text-black">
          <img
            src={logo}
            alt="logp"
            height="70px"
            width="auto"
            className="mb-4 logo-img"
          />
        </a>
      </div>

      <div className="d-flex justify-content-center align-items-center px-3">
        <div
          className="card p-4"
          style={{
            marginTop: "-10px",
            width: "100%",
            maxWidth: "450px",
            height: "auto",
            boxSizing: "border-box",
          }}
        >
          <h1
            className="card-title mt-1 fw-semibold"
            style={{
              fontSize: "clamp(18px, 5vw, 22px)",
              lineHeight: "1.4",
              fontFamily: "Nunito, sans-serif",
              textAlign: "left",
            }}
          >
            Looks like you are new to Zenvy
          </h1>

          <div className="d-flex">
            <span
              className="mt-1 fw-semibold"
              style={{
                fontSize: "clamp(14px, 4vw, 17px)",
                lineHeight: "1.4",
                fontFamily: "Nunito, sans-serif",
                textAlign: "left",
              }}
            >
              Sign in{" "}
              <a href="/signin" className="text-decoration-none" style={{ color: "#0a637e" }}>
                Change
              </a>
            </span>
          </div>

          <form className="border-0" onSubmit={handleProceed}>
            <div className="d-flex justify-content-between text-black fw-semibold">
              <span
                className="mb-1"
                style={{
                  textAlign: "left",
                  marginTop: "5px",
                  fontSize: "clamp(12px, 3.5vw, 14px)",
                }}
              >
                Let's create an account using your mobile number
              </span>
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="bg-gradient btn btn-danger rounded-pill mb-1 continue"
                style={{ fontSize: "clamp(12px, 3.5vw, 14px)", padding: "10px 0" }}
              >
                Proceed to create an account
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
                Sign in with another email or mobile
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

export default Register;