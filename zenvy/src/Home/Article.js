/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Article() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("about");
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");

  const articles = {
    about: {
      title: "About Zenvy",
      icon: "bi-building",
      content: (
        <div>
          <h3>Welcome to Zenvy – Your Ultimate Shopping Destination</h3>
          <p className="lead">Founded in 2024, Zenvy has revolutionized the way India shops online.</p>
          
          <div className="row mt-4">
            <div className="col-md-6">
              <h5><i className="bi bi-flag-fill text-danger me-2"></i>Our Mission</h5>
              <p>To provide a seamless, secure, and enjoyable shopping experience to millions of customers across India, offering the widest selection of products at the best prices.</p>
            </div>
            <div className="col-md-6">
              <h5><i className="bi bi-eye-fill text-danger me-2"></i>Our Vision</h5>
              <p>To become India's most trusted and customer-centric e-commerce platform, empowering sellers and delighting customers every day.</p>
            </div>
          </div>

          <div className="mt-4">
            <h5><i className="bi bi-graph-up text-danger me-2"></i>Our Journey</h5>
            <ul className="list-unstyled">
              <li className="mb-3">
                <strong>2024:</strong> Launched Zenvy with 100+ sellers and 10,000+ products
              </li>
              <li className="mb-3">
                <strong>2025:</strong> Expanded to 50+ cities, 1M+ happy customers
              </li>
              <li className="mb-3">
                <strong>2025:</strong> Introduced AI-powered recommendations and same-day delivery
              </li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <h5><i className="bi bi-people-fill text-danger me-2"></i>By the Numbers</h5>
            <div className="row text-center mt-3">
              <div className="col-md-3 col-6 mb-3">
                <h2 className="text-danger">1M+</h2>
                <p className="text-muted">Happy Customers</p>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <h2 className="text-danger">50K+</h2>
                <p className="text-muted">Products</p>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <h2 className="text-danger">500+</h2>
                <p className="text-muted">Sellers</p>
              </div>
              <div className="col-md-3 col-6 mb-3">
                <h2 className="text-danger">24/7</h2>
                <p className="text-muted">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    features: {
      title: "Why Choose Zenvy",
      icon: "bi-star-fill",
      content: (
        <div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-truck fs-1 text-danger"></i>
                  <h5 className="mt-3">Free & Fast Delivery</h5>
                  <p className="text-muted">Free delivery on orders above ₹499. Same-day delivery in select cities.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-shield-check fs-1 text-danger"></i>
                  <h5 className="mt-3">100% Secure Payments</h5>
                  <p className="text-muted">Multiple payment options with bank-level security encryption.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-arrow-repeat fs-1 text-danger"></i>
                  <h5 className="mt-3">Easy Returns</h5>
                  <p className="text-muted">7-day easy return policy. No questions asked.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-headset fs-1 text-danger"></i>
                  <h5 className="mt-3">24/7 Customer Support</h5>
                  <p className="text-muted">Dedicated support team available round the clock.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-gem fs-1 text-danger"></i>
                  <h5 className="mt-3">Quality Assurance</h5>
                  <p className="text-muted">Verified sellers and genuine products with warranty.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-gift fs-1 text-danger"></i>
                  <h5 className="mt-3">Exciting Offers</h5>
                  <p className="text-muted">Daily deals, seasonal discounts, and exclusive coupons.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    shopping: {
      title: "Shopping Guide",
      icon: "bi-cart-check",
      content: (
        <div>
          <h4>How to Shop on Zenvy</h4>
          
          <div className="timeline mt-4">
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                  <strong>1</strong>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h5>Create an Account</h5>
                <p>Sign up with your email or phone number to get started. It's free and takes less than a minute!</p>
              </div>
            </div>
            
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                  <strong>2</strong>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h5>Browse & Search</h5>
                <p>Explore thousands of products across categories. Use filters to narrow down your search.</p>
              </div>
            </div>
            
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                  <strong>3</strong>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h5>Add to Cart</h5>
                <p>Select quantity, check product details, and add items to your shopping cart.</p>
              </div>
            </div>
            
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                  <strong>4</strong>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h5>Place Order</h5>
                <p>Enter delivery address, choose payment method, and confirm your order.</p>
              </div>
            </div>
            
            <div className="d-flex mb-4">
              <div className="flex-shrink-0">
                <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
                  <strong>5</strong>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h5>Track & Receive</h5>
                <p>Track your order in real-time and enjoy doorstep delivery.</p>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-4">
            <i className="bi bi-info-circle-fill me-2"></i>
            <strong>Pro Tip:</strong> Create a wishlist to save items you love for later!
          </div>
        </div>
      )
    },
    policies: {
      title: "Policies",
      icon: "bi-file-text",
      content: (
        <div>
          <div className="mb-4">
            <h5><i className="bi bi-arrow-return-left text-danger me-2"></i>Return Policy</h5>
            <p>We offer a hassle-free 7-day return policy on most products. Items must be unused and in original packaging. To initiate a return:</p>
            <ul>
              <li>Go to Your Orders</li>
              <li>Select the item and click "Return"</li>
              <li>Choose a reason and submit</li>
              <li>Schedule a pickup or self-ship</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h5><i className="bi bi-credit-card text-danger me-2"></i>Payment Options</h5>
            <p>We accept multiple payment methods:</p>
            <ul>
              <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
              <li>Net Banking (All major banks)</li>
              <li>UPI (Google Pay, PhonePe, Paytm)</li>
              <li>Cash on Delivery (COD)</li>
              <li>EMI Options (No Cost EMI available)</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h5><i className="bi bi-shield-lock text-danger me-2"></i>Privacy Policy</h5>
            <p>Your privacy is our priority. We collect only necessary information to process your orders and improve your shopping experience. We never share your personal data with third parties without your consent.</p>
          </div>
          
          <div className="mb-4">
            <h5><i className="bi bi-truck text-danger me-2"></i>Shipping Policy</h5>
            <p>We ship across India with multiple delivery partners. Standard delivery takes 3-7 business days. Express delivery (1-3 days) available in select cities.</p>
            <ul>
              <li>Free shipping on orders above ₹499</li>
              <li>₹40 shipping fee for orders below ₹499</li>
              <li>Same-day delivery in Mumbai, Delhi, Bangalore (order before 12 PM)</li>
            </ul>
          </div>
        </div>
      )
    },
    faq: {
      title: "FAQs",
      icon: "bi-question-circle",
      content: (
        <div>
          <div className="accordion" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                  How do I track my order?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Go to "Your Orders" section in your account. Click on "Track Order" next to your order to see real-time delivery status.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                  How long does delivery take?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Standard delivery takes 3-7 business days. Express delivery (1-3 days) is available for select pincodes.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                  Can I cancel my order?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Yes, you can cancel orders before they are shipped. Go to "Your Orders" and click "Cancel Order".
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                  Is Cash on Delivery available?
                </button>
              </h2>
              <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Yes, COD is available for orders up to ₹50,000. A small convenience fee may apply.
                </div>
              </div>
            </div>
            
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                  How do I return a product?
                </button>
              </h2>
              <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Initiate return from "Your Orders" within 7 days of delivery. Schedule a free pickup or self-ship the item.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    blog: {
      title: "Latest Articles",
      icon: "bi-newspaper",
      content: (
        <div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/010/701/660/small_2x/online-shopping-or-ecommmerce-delivery-service-concept-paper-shopping-bag-on-a-laptop-computer-easy-shopping-online-concept-free-photo.jpg" className="card-img-top" alt="Shopping Tips" style={{ height: "200px", objectFit: "fit" }} />
                <div className="card-body">
                  <small className="text-danger">Shopping Tips</small>
                  <h5 className="mt-2">10 Tips for Smart Online Shopping</h5>
                  <p className="text-muted">Learn how to save money and shop safely online with these expert tips.</p>
                  <button className="btn btn-link text-danger p-0">Read More →</button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://static.vecteezy.com/system/resources/previews/056/776/363/non_2x/a-man-and-woman-are-looking-at-items-in-a-market-free-photo.jpeg" className="card-img-top" alt="Festive Shopping" style={{ height: "200px", objectFit: "fit" }} />
                <div className="card-body">
                  <small className="text-danger">Festive Guide</small>
                  <h5 className="mt-2">Ultimate Diwali Shopping Guide 2026</h5>
                  <p className="text-muted">Best deals, gift ideas, and shopping tips for the festive season.</p>
                  <button className="btn btn-link text-danger p-0">Read More →</button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://static.vecteezy.com/system/resources/previews/039/659/867/non_2x/ai-generated-a-stack-of-wrapped-gift-boxes-illuminated-with-shiny-decorations-generated-by-ai-free-photo.jpg" className="card-img-top" alt="Gift Guide" style={{ height: "200px", objectFit: "fit" }} />
                <div className="card-body">
                  <small className="text-danger">Gift Guide</small>
                  <h5 className="mt-2">Perfect Gifts for Every Occasion</h5>
                  <p className="text-muted">Struggling to find the right gift? Our curated guide has you covered.</p>
                  <button className="btn btn-link text-danger p-0">Read More →</button>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <img src="https://i0.wp.com/nen.press/wp-content/uploads/2022/11/safe-shopping.png?w=640&ssl=1" className="card-img-top" alt="Payment Security" style={{ height: "200px", objectFit: "fit" }} />
                <div className="card-body">
                  <small className="text-danger">Security</small>
                  <h5 className="mt-2">How to Shop Safely Online</h5>
                  <p className="text-muted">Essential tips to protect yourself from online fraud and scams.</p>
                  <button className="btn btn-link text-danger p-0">Read More →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    contact: {
      title: "Contact Us",
      icon: "bi-envelope",
      content: (
        <div>
          <div className="row">
            <div className="col-md-6">
              <h5><i className="bi bi-headset text-danger me-2"></i>Customer Support</h5>
              <p>Our support team is available 24/7 to assist you.</p>
              <ul className="list-unstyled">
                <li className="mb-2"><i className="bi bi-telephone-fill text-danger me-2"></i> +91-1800-123-4567 (Toll Free)</li>
                <li className="mb-2"><i className="bi bi-envelope-fill text-danger me-2"></i> support@zenvy.com</li>
                <li className="mb-2"><i className="bi bi-chat-dots-fill text-danger me-2"></i> Live Chat (24x7)</li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h5><i className="bi bi-geo-alt-fill text-danger me-2"></i>Corporate Office</h5>
              <address>
                Zenvy Technologies Pvt Ltd<br />
                123, Tech Park, Andheri East<br />
                Mumbai - 400093, Maharashtra<br />
                India
              </address>
            </div>
          </div>
          
          <hr />
          
          <div className="mt-4">
            <h5><i className="bi bi-clock-history text-danger me-2"></i>Business Hours</h5>
            <p>Monday - Friday: 9:00 AM - 9:00 PM IST<br />
            Saturday - Sunday: 10:00 AM - 6:00 PM IST</p>
          </div>
          
          <div className="mt-4 p-3 bg-light rounded">
            <h5><i className="bi bi-envelope-paper text-danger me-2"></i>Get in Touch</h5>
            <p>Have questions or feedback? We'd love to hear from you!</p>
            <button className="btn btn-danger" onClick={() => setShowNewsletter(true)}>
              <i className="bi bi-send me-2"></i>Send Message
            </button>
          </div>
        </div>
      )
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing! 🎉");
      setEmail("");
      setShowNewsletter(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <style>
        {`
          .sidebar-nav {
            position: sticky;
            top: 20px;
          }
          
          .nav-link-custom {
            padding: 12px 15px;
            border-radius: 10px;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .nav-link-custom:hover {
            background-color: #f8f9fa;
            transform: translateX(5px);
          }
          
          .nav-link-custom.active {
            background: linear-gradient(135deg, #e12727, #ff6b6b);
            color: white;
          }
          
          .nav-link-custom.active i {
            color: white;
          }
          
          .article-content {
            min-height: 500px;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .fade-in {
            animation: fadeIn 0.5s ease;
          }

          .cursor-pointer {
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .cursor-pointer:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
        `}
      </style>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav style={{ fontSize: "14px" }} className="mb-4">
          <a href="/" className="text-decoration-none text-secondary">Home</a>
          <span className="mx-2 text-secondary">›</span>
          <span className="text-danger fw-semibold">Help Center</span>
          <span className="mx-2 text-secondary">›</span>
          <span className="text-danger fw-semibold">Articles</span>
        </nav>

        {/* Header Section */}
        <div className="bg-gradient rounded-3 p-4 mb-4 text-white" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="text-center">
            <h1 className="display-5 fw-bold mb-2 text-danger">
              📚 Help Center & Resources
            </h1>
            <p className="mb-0 fs-5 opacity-90">
              Everything you need to know about shopping on Zenvy
            </p>
          </div>
        </div>

        <div className="row">
          {/* Sidebar Navigation */}
          <div className="col-md-3 mb-4">
            <div className="sidebar-nav">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                  {Object.entries(articles).map(([key, article]) => (
                    <div
                      key={key}
                      className={`nav-link-custom ${activeSection === key ? "active" : ""}`}
                      onClick={() => setActiveSection(key)}
                    >
                      <i className={`${article.icon} me-2`}></i>
                      {article.title}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card border-0 shadow-sm mt-3 text-center">
                <div className="card-body">
                  <i className="bi bi-headset fs-1 text-danger"></i>
                  <h6 className="mt-2">Need Help?</h6>
                  <p className="small text-muted">Our support team is here for you 24/7</p>
                  <button className="btn btn-danger btn-sm w-100" onClick={() => setActiveSection("contact")}>
                    <i className="bi bi-chat-dots me-2"></i>Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="card border-0 shadow-sm fade-in">
              <div className="card-header bg-white border-bottom p-3">
                <h4 className="mb-0">
                  <i className={`${articles[activeSection].icon} text-danger me-2`}></i>
                  {articles[activeSection].title}
                </h4>
              </div>
              <div className="card-body p-4 article-content">
                {articles[activeSection].content}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Modal */}
        {showNewsletter && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-envelope-paper me-2"></i>
                    Subscribe to Newsletter
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowNewsletter(false)}
                  ></button>
                </div>
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="modal-body">
                    <p>Get the latest updates, exclusive offers, and shopping tips delivered to your inbox!</p>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowNewsletter(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-danger">
                      Subscribe
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links Footer */}
        <div className="mt-5">
          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded cursor-pointer" onClick={() => navigate('/')}>
                <i className="bi bi-shop fs-2 text-danger"></i>
                <p className="mt-2 mb-0 fw-semibold">Start Shopping</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded cursor-pointer" onClick={() => navigate('/orders')}>
                <i className="bi bi-box-seam fs-2 text-danger"></i>
                <p className="mt-2 mb-0 fw-semibold">Track Order</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded cursor-pointer" onClick={() => navigate('/WishList')}>
                <i className="bi bi-heart fs-2 text-danger"></i>
                <p className="mt-2 mb-0 fw-semibold">My Wishlist</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded cursor-pointer" onClick={() => setActiveSection("contact")}>
                <i className="bi bi-headset fs-2 text-danger"></i>
                <p className="mt-2 mb-0 fw-semibold">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Article;