import React, { useEffect, useState } from 'react'
import AddressModal from '../modals/AddressModal';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Location({ isMobile = false }) {
  const [location, setLocation] = useState({
    city: "",
    state: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    getLocation();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      async (res) => {
        let la = res.coords.latitude;
        let lo = res.coords.longitude;
        try {
          let response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${la}&lon=${lo}`
          );
          let data = await response.json();
          setLocation(data.address);
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }

  async function openModal() {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      navigate("/signin");
      return;
    }

    try {
      const res = await fetch("https://zenvy-store.onrender.com/api/address", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Invalid token");

      setShowModal(true); 

    } catch (err) {
      localStorage.removeItem("token");
      navigate("/signin");
    }
  }

  function closeModal() {
    setShowModal(false);
  }

  // Mobile version render
  if (isMobile) {
    return (
      <>
        <button
          className='mobile-location-btn'
          onClick={openModal}
        >
          <div className="mobile-location-content">
            <div className="mobile-location-icon">
              <i className="bi bi-geo-alt-fill"></i>
            </div>
            <div className="mobile-location-details">
              <span className="mobile-location-label">
                {t("delivering")} {user ? user.fullName?.split(' ')[0] : "Guest"}
              </span>
              <span className="mobile-location-value">
                {location.city
                  ? `${location.city}, ${location.state || ""}`
                  : "Select Location"}
              </span>
            </div>
            <i className="bi bi-chevron-right"></i>
          </div>
        </button>

        {showModal && (
          <div className="modal d-block" tabIndex="-1">
            <AddressModal closeModal={closeModal} />
          </div>
        )}
      </>
    );
  }

  // Desktop version render
  return (
    <>
      <button
        className='text-decoration-none bg-transparent btn-outline-transparent desktop-location-btn'
        style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
        onClick={openModal}
      >
        <div className="d-none d-lg-flex align-items-left text-white location-section order-3 order-lg-2 mx-3"
          style={{ cursor: "pointer", minWidth: "120px" }}>

          <div className="d-flex flex-column small">
            <span style={{ fontSize: "11px", color: "#ccc" }}>
              {t("delivering")} {user ? user.fullName?.split(' ')[0] : "Loading..."}
            </span>

            <span style={{
              fontSize: "12px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              color: "white",
              maxWidth: "90px"
            }}>
              <i className="bi bi-geo-alt-fill" style={{ marginRight: "5px" }}></i>
              {location.city
                ? `${location.city}, ${location.state || ""}`
                : "Use Map"}
            </span>
          </div>
        </div>
      </button>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <AddressModal closeModal={closeModal} />
        </div>
      )}
    </>
  );
}

export default Location;