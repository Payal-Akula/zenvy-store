import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/images/biglogo.png';

function Footer() {
  const [location, setLocation] = useState("Raipur, Chhattisgarh, India");
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (res) => {
        const { latitude, longitude } = res.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data?.address) {
            const { city, state, country } = data.address;
            const addr = `${city || ""}, ${state || ""}, ${country || ""}`.replace(/,\s*,/g, ",");
            setLocation(addr.trim() || "India");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      },
      (error) => {
        console.log("Location permission denied or error:", error);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterStatus("Subscribed successfully!");
      setEmail("");
      setTimeout(() => setNewsletterStatus(""), 3000);
    }
  };

  const socialIcons = [
    { icon: "bi-facebook", link: "https://facebook.com", color: "#1877f2" },
    { icon: "bi-instagram", link: "https://instagram.com", color: "#e4405f" },
    { icon: "bi-twitter-x", link: "https://twitter.com", color: "#1da1f2" },
    { icon: "bi-tiktok", link: "https://tiktok.com", color: "#000000" },
    { icon: "bi-youtube", link: "https://youtube.com", color: "#ff0000" },
  ];

  const paymentMethods = [
    { name: "Visa", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg/1920px-Visa_Inc._logo_%282005%E2%80%932014%29.svg.png?_=20170118154621" },
    { name: "Mastercard", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/960px-MasterCard_Logo.svg.png?_=20140711182052" },
    { name: "PayPal", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/PayPal_Logo2014.svg/250px-PayPal_Logo2014.svg.png" },
    { name: "Amazon Pay", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Amazon_Pay_logo.svg/500px-Amazon_Pay_logo.svg.png?_=20180630162337" },
    // { name: "Maestro", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Maestro_2016_logo.svg/2560px-Maestro_2016_logo.svg.png" },
  ];

  return (
    <footer className="footer mt-5">
      <div className="footer-top">
        <div className="container">
          <div className="row gy-5">
            {/* Logo & Contact */}
            <div className="col-lg-3 col-md-6">
              <div className="footer-brand">
                <img src={logo} alt="Zenvy Logo" className="footer-logo" />
                <p className="footer-tagline">Premium Shopping Experience</p>
              </div>
              <div className="footer-contact">
                <div className="contact-item">
                  <i className="bi bi-telephone-fill"></i>
                  <span>+91 9876543210</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-envelope-fill"></i>
                  <span>support@zenvy.in</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-geo-alt-fill"></i>
                  <span>{location}</span>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Information</h5>
              <ul className="footer-links">
                <li><Link to="/specials">Specials</Link></li>
                <li><Link to="/orderTracking">SiteMap</Link></li>
                <li><Link to="/return">Delivery & Return</Link></li>
                <li><Link to="/articles">Privacy Policy</Link></li>
                <li><Link to="/articles">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Customer Services */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Customer Services</h5>
              <ul className="footer-links">
                <li><Link to="/bestsellers">Brands</Link></li>
                <li><Link to="/affiliates">Affiliates</Link></li>
                <li><Link to="/return">Returns</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/gift-boxes">Gift Certificates</Link></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="col-lg-2 col-md-6">
              <h5 className="footer-title">Contact Us</h5>
              <ul className="footer-links">
                <li><Link to="/articles">About Us</Link></li>
                <li><Link to="/articles">Contact Us</Link></li>
                <li><Link to="/articles">FAQs</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-lg-3 col-md-6">
              <h5 className="footer-title">Newsletter</h5>
              <p className="newsletter-text">Join Our Newsletter And Get ₹500 Discount For Your First Order</p>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn btn-subscribe" type="submit">
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
                {newsletterStatus && (
                  <div className="newsletter-success">{newsletterStatus}</div>
                )}
              </form>

              {/* Social Icons */}
              <div className="social-icons">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon"
                    data-color={social.color}
                  >
                    <i className={`bi ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="copyright">
                © {new Date().getFullYear()} Zenvy. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="payment-methods">
                {paymentMethods.map((method, index) => (
                  <img key={index} src={method.img} alt={method.name} className="payment-icon" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          position: relative;
          overflow: hidden;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #dc3545, #ff6b6b, #dc3545);
        }

        .footer-top {
          padding: 60px 0 40px;
        }

        .footer-brand {
          margin-bottom: 20px;
        }

        .footer-logo {
          height: 55px;
          object-fit: contain;
          margin-bottom: 15px;
        }

        .footer-tagline {
          opacity: 0.8;
          font-size: 14px;
          margin-bottom: 20px;
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          opacity: 0.85;
          transition: all 0.3s ease;
        }

        .contact-item i {
          width: 20px;
          color: #dc3545;
          font-size: 16px;
        }

        .contact-item:hover {
          opacity: 1;
          transform: translateX(5px);
        }

        .footer-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: #dc3545;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #dc3545;
          transform: translateX(5px);
        }

        .newsletter-text {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 15px;
        }

        .newsletter-form .input-group {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          overflow: hidden;
        }

        .newsletter-form .form-control {
          background: transparent;
          border: none;
          color: #fff;
          padding: 12px 20px;
        }

        .newsletter-form .form-control::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .newsletter-form .form-control:focus {
          outline: none;
          box-shadow: none;
          background: transparent;
        }

        .btn-subscribe {
          background: #dc3545;
          color: #fff;
          border: none;
          padding: 0 25px;
          border-radius: 50px;
          transition: all 0.3s ease;
        }

        .btn-subscribe:hover {
          background: #c82333;
          transform: scale(1.05);
        }

        .newsletter-success {
          margin-top: 10px;
          font-size: 12px;
          color: #28a745;
        }

        .social-icons {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }

        .social-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-icon:hover {
          transform: translateY(-8px) scale(1.1);
          animation: jelly 0.6s ease;
        }

        @keyframes jelly {
          0% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-12px) scale(1.08); }
          50% { transform: translateY(4px) scale(0.95); }
          75% { transform: translateY(-6px) scale(1.05); }
          100% { transform: translateY(-8px) scale(1.1); }
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 20px 0;
        }

        .copyright {
          font-size: 13px;
          opacity: 0.7;
          margin: 0;
        }

        .payment-methods {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .payment-icon {
          height: 18px;
          object-fit: fit;
          transition: all 0.3s ease;
        }

        .payment-icon:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .footer-top {
            padding: 40px 0 20px;
          }
          
          .footer-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .footer-title {
            text-align: center;
          }
          
          .footer-links {
            text-align: center;
          }
          
          .footer-links a:hover {
            transform: translateX(0) translateY(-2px);
          }
          
          .contact-item {
            justify-content: center;
          }
          
          .contact-item:hover {
            transform: translateX(0) translateY(-2px);
          }
          
          .social-icons {
            justify-content: center;
          }
          
          .newsletter-text {
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .payment-methods {
            justify-content: center;
            margin-top: 15px;
          }
          
          .copyright {
            text-align: center;
            margin-bottom: 15px;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;