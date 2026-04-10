import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/images/biglogo.png';
import "./nav.css";
import Searchbar from './Searchbar';
import Signup from './Signup';
import Categories from './Categories';
import Location from './Location';

function Navtwo() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const toggleMobileMenu = () => { 
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleSearchOverlay = () => {
    setIsSearchOverlayOpen(!isSearchOverlayOpen);
  };

  const closeSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
  };

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg w-100">
        <div className="container-fluid">

          {/* LEFT SIDE */}
          <div className="d-flex align-items-center left-section px-1">
            {/* <button
              className="navbar-toggler border-0 d-lg-none hamburger-btn"
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <span className="navbar-toggler-icon"></span>
            </button> */}

            <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
              <img src={logo} alt="zenvy Logo" className="logo-img" />
            </NavLink>
          </div>
          
          {/* CATEGORIES DROPDOWN */}
          <div className="d-none d-md-flex align-items-center text-white px-2 left-section categories-dropdown">
            <Categories />
          </div>
          
          {/* CENTER - SEARCH - Desktop */}
          <div className="search-container d-none d-md-block">
            <Searchbar />
          </div>

          {/* Mobile Search Icon */}
          <div className="d-md-none nav-right-items">
            <button className="mobile-search-btn bg-transparent text-white " onClick={toggleSearchOverlay}>
              <i className="bi bi-search"></i>
            </button>
          </div>

          {/* RIGHT SIDE - Desktop */}
          <div className="nav-right-items d-none d-lg-flex px-2">
            <NavLink className="text-decoration-none text-white account-section">
              <Signup />
            </NavLink>
          </div>
          
          <div className="nav-item nav-link px-2 text-white d-none d-lg-flex flex-column">
            <NavLink to="/orders" className="text-decoration-none text-white returns-section">
              <span className="returns-text">Returns</span>
              <span className="orders-text">& Orders</span>
            </NavLink>
          </div>
          
          <div className="nav-right-items d-none d-lg-flex px-2 small">
            <NavLink to="/wishlist" className="text-decoration-none text-white fw-normal">
              <i className='bi bi-heart px-1'></i> WishList
            </NavLink>
          </div>
          
          <div className="nav-right-items d-none d-lg-flex px-2 small">
            <NavLink to="/cart" className="text-decoration-none text-white fw-normal">
              <i className='bi bi-cart px-1'></i> Cart
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="d-lg-none nav-right-items">
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
          <div className="mobile-menu-header">
            <h6>Menu</h6>
            <button className="close-btn" onClick={toggleMobileMenu}>×</button>
          </div>
          <div className="mobile-menu-body">
            {/* Location in Sidebar */}
            <div className="mobile-location-section">
              <Location isMobile={true} />
            </div>
            
            <div className="mobile-menu-divider"></div>
            
            <NavLink to="/signin" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="bi bi-person"></i> Sign In
            </NavLink>
            
            <NavLink to="/orders" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="bi bi-box"></i> Returns & Orders
            </NavLink>
            
            <NavLink to="/wishlist" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="bi bi-heart"></i> WishList
            </NavLink>
            
            <NavLink to="/cart" className="mobile-menu-item" onClick={closeMobileMenu}>
              <i className="bi bi-cart"></i> Cart
            </NavLink>
            
            <div className="mobile-menu-divider"></div>
            
            <div className="mobile-categories">
              <div className="mobile-menu-item fw-bold">
                <i className="bi bi-grid"></i> Categories
              </div>
              <Categories />
            </div>
          </div>
        </div>

        {/* Search Overlay for Mobile */}
        <div className={`search-overlay ${isSearchOverlayOpen ? 'show' : ''}`}>
          <div className="search-overlay-header">
            <h6>Search Products</h6>
            <button className="close-search-btn" onClick={closeSearchOverlay}>×</button>
          </div>
          <div className="search-overlay-body">
            <Searchbar closeOverlay={closeSearchOverlay} />
          </div>
        </div>

        {/* Overlay Background */}
        {(isMobileMenuOpen || isSearchOverlayOpen) && (
          <div 
            className="mobile-menu-overlay" 
            onClick={() => {
              closeMobileMenu();
              closeSearchOverlay();
            }}
          ></div>
        )}
      </nav>
    </>
  )
}

export default Navtwo