/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Signup() {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const location = useLocation();

    // Function to check and update user from localStorage
    const updateUserFromStorage = () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        console.log("Updating user from storage:", storedUser); // Debug log
        if (storedUser) {
            setUser(storedUser);
        } else {
            setUser(null);
        }
    };

    useEffect(() => {
        // Initial load
        updateUserFromStorage();

        // Listen for storage changes (when user logs in/out from another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                console.log("Storage event detected for user");
                updateUserFromStorage();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);

        // Custom event for login (for same tab updates)
        const handleLoginEvent = () => {
            console.log("userLoggedIn event received");
            updateUserFromStorage();
        };
        
        const handleLogoutEvent = () => {
            console.log("userLoggedOut event received");
            updateUserFromStorage();
        };
        
        window.addEventListener('userLoggedIn', handleLoginEvent);
        window.addEventListener('userLoggedOut', handleLogoutEvent);

        // Also check whenever route changes (in case of navigation)
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userLoggedIn', handleLoginEvent);
            window.removeEventListener('userLoggedOut', handleLogoutEvent);
        };
    }, []);

    // Check for user data on route change
    useEffect(() => {
        updateUserFromStorage();
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUser(null);
        setOpen(false);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('userLoggedOut'));
        // Optional: reload page to reset all states
        window.location.href = '/';
    };

    return (
        <>
            <div className="position-relative" ref={dropdownRef}>
                <div
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setOpen(!open)}
                >
                    <div className="fw-bold " style={{ fontSize: "12px" }}>
                        {user ? `Hello, ${user.fullName}` : "Hello, Sign in"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#ccc" }}>
                        Accounts & Lists
                    </div>
                </div>

                {/* Dropdown */}
                {open && (
                    <div
                        className="position-absolute bg-gradient bg-black shadow"
                        style={{
                            width: "170px",
                            padding: "10px 10px",
                            top: "40px",
                            right: "2px",
                            zIndex: 1000,
                            borderRadius: "5px",
                        }}
                    >
                        <div className="text-center">
                            {!user && (
                                <>
                                    <button
                                        className="btn bg-gradient btn-danger opacity-100 fw-bold"
                                        style={{ fontSize: "13px" }}
                                    >
                                        <NavLink
                                            to="/Signin"
                                            className="text-dark text-decoration-none text-white"
                                        >
                                            Sign In
                                        </NavLink>
                                    </button>

                                    <p className="mt-2 text-white" style={{ fontSize: "11px" }}>
                                        New Customer?
                                        <NavLink
                                            to="/Signin"
                                            className="text-danger text-decoration-none ms-1"
                                        >
                                            Start here.
                                        </NavLink>
                                    </p>
                                </>
                            )}

                            {user && (
                                <>
                                    <p className="text-white mb-2" style={{ fontSize: "13px" }}>
                                        Welcome, {user.fullName}
                                    </p>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-danger w-100 fw-bold"
                                        style={{ fontSize: "13px" }}
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Signup;