/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/images/output-onlinepngtools.png'

function Address() {
  const [address, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      // Redirect to signin if not logged in
      navigate("/signin");
    } else {
      setIsLoggedIn(true);
      fetchdata();
    }
  }, []);

  const fetchdata = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://zenvy-store.onrender.com/api/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAddress(data);
      console.log("Fetched Addresses:", data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`https://zenvy-store.onrender.com/api/address/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddress(address.filter((item) => item._id !== id));
        alert("Address deleted successfully!");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openModal = (items) => {
    setSelectedAddress(items);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAddress(null);
    setShowModal(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <nav style={{ fontSize: "14px" }}>
          <a href="/myAccount" className="text-decoration-none text-secondary">
            Your Account
          </a>
          <span className="mx-2 text-secondary">›</span>
          <a href="#" className="text-decoration-none text-danger fw-semibold">
            Your Addresses
          </a>
        </nav>

        <h3 className="mt-3 mb-4" style={{ fontWeight: "500" }}>
          Your Addresses
        </h3>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
          
          {/* Add Address Card */}
          <div className="col d-flex justify-content-center">
            <div
              className="card text-center rounded bg-light"
              style={{
                width: "18rem",
                height: "16rem",
                border: "2px dashed #c7ccd1",
                backgroundColor: "#fafafa",
              }}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <a
                  href="/AddAddress"
                  className="text-decoration-none bg-transparent border-0"
                  style={{ outline: "none" }}
                >
                  <i
                    className="bi bi-plus-lg"
                    style={{
                      color: "#c7ccd1",
                      fontSize: "45px",
                      fontWeight: 900,
                    }}
                  ></i>
                  <p
                    className="fw-bold text-secondary mt-2"
                    style={{ fontSize: "1.2rem" }}
                  >
                    Add address
                  </p>
                </a>
              </div>
            </div>
          </div>

          {/* Address Cards */}
          {address &&
            address.map((item) => (
              <div className="col d-flex justify-content-center" key={item._id}>
                <div
                  className="card shadow-sm"
                  style={{
                    width: "18rem",
                    minHeight: "16rem",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Header */}
                  <div className="card-header bg-light" style={{ height: "45px" }}>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <p className="text-muted" style={{ fontSize: "10px" }}>
                        {item.isDefault ? "Default:" : ""}
                        <img
                          src={logo}
                          className="mt-auto"
                          alt="logo"
                          style={{
                            height: "19px",
                            width: "auto",
                          }}
                        />
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div
                    className="card-body"
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.4",
                      overflow: "hidden",
                    }}
                  >
                    <span className="fw-bold text-dark fs-6">
                      {item.fullName}
                    </span>
                    <p className="mb-1 fw-normal text-dark">
                      {item.flat}
                    </p>
                    <p className="mb-1 fw-normal text-dark">
                      {item.area}
                    </p>
                    <p className="mb-1 text-muted text-dark">
                      {`${item.city}, ${item.state} - ${item.pincode}`.toUpperCase()}
                    </p>
                    <p className="mb-1 text-muted text-dark">
                      {item.country}
                    </p>
                    <p className="mb-1 fw-semibold text-dark">
                      Mobile: {item.mobile}
                    </p>
                  </div>

                  {/* Footer */}
                  <div
                    className="card-footer bg-white border-0 d-flex justify-content-between small"
                    style={{ marginTop: "-25px" }}
                  >
                    <p>
                      <a
                        href="#"
                        className="text-decoration-none"
                        style={{ color: "#0a637e" }}
                      >
                        Add delivery instructions
                      </a>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex p-2" style={{ marginTop: "-35px" }}>
                    <button
                      className="btn btn-outline-none btn-sm mb-1"
                      style={{ color: "#0a637e" }}
                      onClick={() => openModal(item)}
                    >
                      Edit
                    </button>
                    <span className="mb-1" style={{ color: "#0a637e" }}>
                      {" "}|{" "}
                    </span>
                    <button
                      className="btn btn-outline-none btn-sm mb-1"
                      style={{ color: "#0a637e" }}
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedAddress && (
        <div className="modal ab" tabIndex="-1" style={{ lineHeight: "1.3" }}>
          <div className="modal-dialog modal-dialog-centered" style={{ width: "350px" }}>
            <div className="modal-content">
              <div
                className="modal-header border-bottom-1 pb-3"
                style={{ backgroundColor: "#f0f2f2" }}
              >
                <h6 className="modal-title fw-bold">Edit Failed</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="fw-bold mb-1">{selectedAddress.fullName}</h6>
                <p className="small fw-semibold">{selectedAddress.flat}</p>
                <p className="small fw-semibold">{selectedAddress.area}</p>
                <p className="small fw-semibold">
                  Mobile: {selectedAddress.mobile}
                </p>
                <hr />
                <p style={{ color: "#565959", fontSize: "12px" }}>
                  <span className="text-danger">
                    This address is used as your residential address.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Address;