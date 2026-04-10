/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import './nav.css'

function NavThree() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="nav-three-container">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg p-0">
          <button
            className="nav-three-menu-btn"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-grid-3x3-gap-fill'}`}></i>
            <span className="ms-2 d-lg-none">Menu</span>
          </button>

          {/* Menu - Centered */}
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navThreeMenu">
            <ul className="navbar-nav mx-auto gap-lg-4 gap-2 py-2">

<li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/myAccount">
                  <i class="bi bi-person-lines-fill me-1"></i> My Account
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/hot-offers">
                  <i className="bi bi-fire me-1"></i> Hot offers
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/recommends">
                  <i className="bi bi-star me-1"></i> Recommends
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/new-arrivals">
                  <i className="bi bi-gift me-1"></i> New arrivals
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/bestsellers">
                  <i className="bi bi-trophy me-1"></i> Bestsellers
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/gift-boxes">
                  <i className="bi bi-gift-fill me-1"></i> Gift boxes
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link nav-three-link" to="/articles">
                  <i className="bi bi-newspaper me-1"></i> Articles
                </NavLink>
              </li>

              {/* Dropdown - Fixed */}
              <li className="nav-item dropdown nav-three-dropdown">
                <a
                  className="nav-link dropdown-toggle nav-three-link"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots me-1"></i> More
                </a>

                <ul className="dropdown-menu nav-three-dropdown-menu">
                  <li><a className="dropdown-item" href="#">Customer Support</a></li>
                  <li><a className="dropdown-item" href="#">Track Orders</a></li>
                  <li><a className="dropdown-item" href="#">Return Policy</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">FAQs</a></li>
                </ul>
              </li>

            </ul>
          </div>

          {/* Right side - Extra info for desktop */}
          <div className="ms-auto d-none d-xl-block">
            <span className="nav-three-badge">
              <i className="bi bi-headset me-1"></i> 24/7 Support
            </span>
          </div>

        </nav>
      </div>
    </div>
  );
}

export default NavThree;