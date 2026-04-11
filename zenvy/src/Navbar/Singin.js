/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import './nav.css'
import { uphone, uemail } from "../validation/valid";
import logo from '../assets/images/output-onlinepngtools.png';
import { NavLink, useNavigate } from 'react-router-dom';

function Singin() {
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const [validatorMsg, setValidatorMsg] = useState("");
    const [shake, setShake] = useState(false);

    function handleChange(e) {
        setInput(e.target.value);
    }

    async function formSubmit(e) {
        e.preventDefault();
        const value = input.trim();

        if (!value) {
            setValidatorMsg("Please enter Valid Email!");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }

        const isPhone = /^[0-9]+$/.test(value);

        // 🔥 VALIDATION FIRST
        if (isPhone) {
            if (!uphone(value)) {
                setValidatorMsg("Invalid phone number!");
                setShake(true);
                setTimeout(() => setShake(false), 500);
                return;
            }
        } else {
            if (!uemail(value)) {
                setValidatorMsg("Invalid email address!");
                setShake(true);
                setTimeout(() => setShake(false), 500);
                return;
            }
        }

        try {
            const response = await fetch("https://zenvy-store.onrender.com/auth/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ value }),
            });

            const data = await response.json();

            if (data.exists) {
                console.log("✅ Existing user");

                if (isPhone) {
                    localStorage.setItem("phone", value);
                } else {
                    localStorage.setItem("email", value);
                }

                navigate("/Password");
            } else {
                console.log("❌ New user");
                navigate("/register");
            }

        } catch (error) {
            console.error("API error:", error);
            setValidatorMsg("Server error. Please try again.");
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center text-center mt-5 px-3">
                <NavLink to="/" className="text-decoration-none text-black">
                    <img
                        src={logo}
                        alt="logp"
                        height="30px"
                        width="auto"
                        className="mb-4 logo-img"
                    />
                </NavLink>
            </div>

            <div className="d-flex justify-content-center align-items-center">
                <div
                    className="card p-4"
                    style={{
                        marginTop: "-10px",
                        width: "350px",
                        height: "auto",
                        boxSizing: "border-box",
                    }}
                >
                    <h1
                        className="card-title mt-1"
                        style={{
                            fontSize: "22px",
                            lineHeight: "1.4",
                            fontFamily: "Nunito, sans-serif",
                            textAlign: "left",
                        }}
                    >
                        Sign in or create account
                    </h1>

                    <form className="border-0" name="myform" onSubmit={formSubmit}>
                        <label
                            className="mb-1"
                            style={{
                                textAlign: "left",
                                marginTop: "5px",
                                fontWeight: "700",
                            }}
                        >
                            Enter Email
                        </label>

                        <input
                            className="input-group form-control mb-2 rounded mb-1"
                            onChange={handleChange}
                            name="email"
                            value={input}
                            style={{ border: "1px solid black !important" }}
                        />

                        <div
                            className={`mb-3 ${shake ? "shake" : ""} text-danger`}
                            style={{
                                fontFamily: "Nunito, sans-serif",
                                textAlign: "left",
                            }}
                        >
                            {validatorMsg && (
                                <>
                                    <i
                                        className="bi bi-info-circle-fill"
                                        style={{ fontSize: "16px" }}
                                    ></i>{" "}
                                    {validatorMsg}
                                </>
                            )}
                        </div>

                        <div className="d-grid">
                            <button
                                type="submit"
                                className="bg-gradient btn btn-danger rounded-pill mb-1 continue"
                            >
                                Continue
                            </button>
                        </div>
                    </form>

                    <div
                        className="d-flex flex-column fw-semibold"
                        style={{ width: "310px", lineHeight: "1.3" }}
                    >
                        <p
                            className="mt-2"
                            style={{
                                fontSize: "13.8px",
                                fontFamily: "Nunito, sans-serif",
                                textAlign: "left",
                                fontWeight: "400",
                            }}
                        >
                            By continuing, you agree to Zenvy's{" "}
                            <a href="#" style={{ color: "#0a637e" }}>
                                Conditions of Use
                            </a>{" "}
                            and{" "}
                            <a href="#" style={{ color: "#0a637e" }}>
                                Privacy Notice
                            </a>
                        </p>
                    </div>

                    <hr className="mb-1" style={{ marginTop: "-2px" }} />

                    <p
                        className="small mb-1 fw-bold mt-2"
                        style={{ textAlign: "left" }}
                    >
                        Buying for work?
                    </p>

                    <a
                        href="#"
                        className="text-decoration-none small fw-bold"
                        style={{ textAlign: "left", color: "#0a637e" }}
                    >
                        Create a free business account
                    </a>
                </div>
            </div>

            {/* Footer */}
            <hr className="mt-5" />

            <footer className="w-100 text-center py-3 mt-3">
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                    <a
                        href="#"
                        className="text-decoration-none"
                        style={{ fontSize: "12px", color: "#0a637e" }}
                    >
                        Conditions of Use
                    </a>

                    <a
                        href="#"
                        className="text-decoration-none"
                        style={{ fontSize: "12px", color: "#0a637e" }}
                    >
                        Privacy Notice
                    </a>

                    <a
                        href="#"
                        className="text-decoration-none"
                        style={{ fontSize: "12px", color: "#0a637e" }}
                    >
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

export default Singin;