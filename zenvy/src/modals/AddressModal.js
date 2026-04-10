/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import './AddressModal.css'
import { getAddresses } from "../services/addressService";
import { useNavigate } from 'react-router-dom';

function AddressModal({ closeModal }) {

    const [addresses, setAddresses] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        if (token && user) {
            setIsLoggedIn(true);
            loadAddresses();
        } else {
            setIsLoggedIn(false);
            setAddresses([]);
        }
    }, []);

    async function loadAddresses() {
        try {
            const data = await getAddresses();
            setAddresses(data);
        } catch (err) {
            console.error("Address fetch failed:", err.message);
            setAddresses([]);
        }
    }

    function handleAddAddress() {
        closeModal();

        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            // Redirect to signin page if not logged in
            navigate("/signin");
            return;
        }

        // If logged in, navigate to Address page
        navigate("/Address");
    }

    return (
        <>
            <div className="modal-dialog modal-dialog-centered" style={{ width: "350px" }}>
                <div className="modal-content">
                    <div className="modal-header border-bottom-1 pb-3" style={{ backgroundColor: "#f0f2f2" }}>
                        <h5 className="modal-title fw-bold">Choose your location</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={closeModal}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <p className="fw-lighter" style={{ color: "#565959", fontSize: "12px" }}>
                            Select a delivery location to see product availability and delivery options
                        </p>

                        {/* Only show address if user is logged in AND has addresses */}
                        {isLoggedIn && addresses.length > 0 ? (
                            <div className="address-card border rounded p-3 mb-4">
                                <div className="address-content">
                                    <h6 className="fw-bold mb-2">
                                        {addresses[0].fullName}
                                    </h6>
                                    <p className="mb-1 small">
                                        {addresses[0].flat}
                                    </p>
                                    <p className="mb-1 small">
                                        {addresses[0].area}
                                    </p>
                                    <p className="mb-1 small">
                                        {addresses[0].city}, {addresses[0].state}
                                    </p>
                                    <p className="mb-2 small">
                                        {addresses[0].pincode}
                                    </p>
                                    {addresses[0].isDefault && (
                                        <span className="badge bg-light text-dark border small">
                                            Default address
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : !isLoggedIn ? (
                            /* Show message when user is not logged in */
                            <div className="text-center p-3 mb-4 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
                                <i className="bi bi-person-circle fs-1 text-muted mb-2"></i>
                                <p className="small text-muted mb-0">Sign in to see your saved addresses</p>
                            </div>
                        ) : null}

                        <div className="add-address-section">
                            <button
                                type="button"
                                onClick={handleAddAddress}
                                className="btn btn-link p-0 mb-3 text-decoration-none"
                                style={{ fontSize: "13px", color: "#2162A1" }}
                            >
                                Add an address or pick-up point
                            </button>

                            <div className="d-flex text-muted">
                                <hr style={{ width: "90px" }} />
                                <span className='mt-2' style={{ fontSize: "10px" }}>
                                    or enter an Indian pincode
                                </span>
                                <hr style={{ width: "90px" }} />
                            </div>

                            <div className="row g-2 mb-4">
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control"
                                        style={{ fontSize: "14px" }}
                                        placeholder="Enter pincode"
                                    />
                                </div>
                                <div className="col-auto">
                                    <button className="btn rounded-pill btn-outline-secondary btn-sm px-4 py-2">
                                        <a href='/' className='text-decoration-none text-black'>
                                            Apply
                                        </a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddressModal