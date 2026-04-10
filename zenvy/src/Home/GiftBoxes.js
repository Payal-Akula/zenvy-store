/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GiftBoxes() {
  const navigate = useNavigate();
  const [selectedGift, setSelectedGift] = useState(null);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [selectedGiftWrap, setSelectedGiftWrap] = useState("premium");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isGiftCard, setIsGiftCard] = useState(false);
  const [giftCardAmount, setGiftCardAmount] = useState(1000);

  // Gift categories
  const giftCategories = [
    { name: "Birthday Gifts", icon: "bi-gift-fill", color: "#ff6b6b" },
    { name: "Anniversary Gifts", icon: "bi-suit-heart-fill", color: "#ff4757" },
    { name: "Wedding Gifts", icon: "bi-people-fill", color: "#e84393" },
    { name: "Festival Gifts", icon: "bi-stars", color: "#f39c12" },
    { name: "Corporate Gifts", icon: "bi-briefcase-fill", color: "#3498db" },
    { name: "Baby Gifts", icon: "bi-egg-fried", color: "#1abc9c" }
  ];

  // Gift products from different categories
  const giftProducts = [
    // Birthday Gifts
    {
      _id: "gift1",
      title: "Birthday Surprise Hamper",
      price: 1499,
      originalPrice: 2999,
      discountPercentage: 50,
      category: "Birthday Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/previews/035/403/738/non_2x/happy-valentine-s-day-concept-with-red-gift-box-and-heart-shaped-balloons-romantic-banner-love-concept-by-ai-generated-free-photo.jpg",
      rating: 4.8,
      stock: 45,
      description: "A beautiful hamper with chocolates, cake, and a personalized birthday card.",
      includes: ["Birthday Cake", "Chocolates", "Personalized Card", "Balloons"]
    },
    {
      _id: "gift2",
      title: "Birthday Flower Bouquet",
      price: 999,
      originalPrice: 1999,
      discountPercentage: 50,
      category: "Birthday Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/035/998/683/small_2x/ai-generated-luxury-gift-box-with-balloon-and-rose-flower-ai-generative-photo.jpg",
      rating: 4.7,
      stock: 30,
      description: "Fresh flower bouquet with birthday wishes and chocolates.",
      includes: ["Fresh Flowers", "Chocolates", "Birthday Card"]
    },
    {
      _id: "gift3",
      title: "Birthday Gift Box Premium",
      price: 2499,
      originalPrice: 4999,
      discountPercentage: 50,
      category: "Birthday Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/003/350/945/small_2x/red-gift-box-with-rope-bow-on-pink-background-with-heart-confetti-photo.jpg",
      rating: 4.9,
      stock: 20,
      description: "Premium birthday gift box with luxury items.",
      includes: ["Luxury Perfume", "Watch", "Wallet", "Chocolates"]
    },
    {
      _id: "gift4",
      title: "Birthday Surprise Box",
      price: 1899,
      originalPrice: 3499,
      discountPercentage: 46,
      category: "Birthday Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/038/116/633/small_2x/ai-generated-surprise-unfolds-with-an-explosive-laptop-gift-amidst-orange-balloons-ai-generated-photo.jpg",
      rating: 4.6,
      stock: 35,
      description: "Surprise gift box with 12 different items.",
      includes: ["12 Surprise Items", "Birthday Card", "Decoration Items"]
    },

    // Anniversary Gifts
    {
      _id: "gift5",
      title: "Romantic Anniversary Hamper",
      price: 2999,
      originalPrice: 5999,
      discountPercentage: 50,
      category: "Anniversary Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/previews/075/659/726/non_2x/roses-gifts-and-balloons-in-a-cozy-kitchen-setting-free-photo.jpg",
      rating: 4.9,
      stock: 25,
      description: "Romantic gift set for special anniversary celebration.",
      includes: ["Red Roses", "Perfume", "Chocolates", "Personalized Frame"]
    },
    {
      _id: "gift6",
      title: "Couple's Gift Set",
      price: 3999,
      originalPrice: 6999,
      discountPercentage: 43,
      category: "Anniversary Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/078/513/308/small_2x/valentine-s-day-gift-box-with-red-ribbon-and-heart-on-wooden-background-photo.jpg",
      rating: 4.8,
      stock: 15,
      description: "Matching couple's gifts for anniversary.",
      includes: ["Couple T-shirts", "Matching Bands", "Photo Album", "Love Letter Set"]
    },

    {
      _id: "gift7",
      title: "Wedding Gift Box",
      price: 4999,
      originalPrice: 9999,
      discountPercentage: 50,
      category: "Wedding Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/previews/055/311/938/non_2x/romantic-gift-box-with-elegant-ribbon-surrounded-by-rose-petals-and-soft-lights-creating-a-dreamy-atmosphere-for-special-occasions-free-photo.jpeg",
      rating: 4.9,
      stock: 10,
      description: "Elegant wedding gift set for newlyweds.",
      includes: ["Home Decor Set", "Dinner Set", "Photo Frame", "Personalized Gift"]
    },
    {
      _id: "gift8",
      title: "New Home Gift Set",
      price: 3499,
      originalPrice: 6499,
      discountPercentage: 46,
      category: "Wedding Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/059/242/371/small_2x/small-wooden-house-with-red-bow-on-knitted-blanket-symbolizing-christmas-gift-photo.jpg",
      rating: 4.7,
      stock: 20,
      description: "Perfect housewarming gift for newly married couples.",
      includes: ["Decorative Items", "Kitchen Set", "Pooja Thali", "Welcome Mat"]
    },

    // Festival Gifts
    {
      _id: "gift9",
      title: "Diwali Gift Hamper",
      price: 1999,
      originalPrice: 3999,
      discountPercentage: 50,
      category: "Festival Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/previews/074/390/032/non_2x/copper-utensils-sweets-gift-boxes-and-notepad-with-text-on-yellow-background-top-view-free-photo.jpg",
      rating: 4.8,
      stock: 50,
      description: "Festival special gift hamper with sweets and diyas.",
      includes: ["Dry Fruits", "Sweets", "Diyas", "Rangoli Colors"]
    },
    {
      _id: "gift10",
      title: "Christmas Gift Box",
      price: 1499,
      originalPrice: 2999,
      discountPercentage: 50,
      category: "Festival Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/035/119/907/small_2x/ai-generated-winter-celebration-shiny-christmas-ornament-decorates-snowy-fir-tree-generated-by-ai-photo.jpg",
      rating: 4.7,
      stock: 60,
      description: "Christmas special gift box with goodies.",
      includes: ["Christmas Cake", "Chocolates", "Decorations", "Santa Hat"]
    },

  
    {
      _id: "gift11",
      title: "Corporate Gift Set",
      price: 1499,
      originalPrice: 2999,
      discountPercentage: 50,
      category: "Corporate Gifts",
      thumbnail: "https://5.imimg.com/data5/SELLER/Default/2026/2/583407540/EC/FU/UV/94133311/red-color-5-in-1-corporate-gift-set-1000x1000.png",
      rating: 4.6,
      stock: 100,
      description: "Professional corporate gift set for employees.",
      includes: ["Diary Set", "Pen Set", "Desk Organizer", "Coffee Mug"]
    },
    {
      _id: "gift12",
      title: "Executive Gift Hamper",
      price: 2999,
      originalPrice: 5999,
      discountPercentage: 50,
      category: "Corporate Gifts",
      thumbnail: "https://whatashop.in/cdn/shop/files/TerracottaTeaGiftSet_Mitti_795a2dbf-87e7-4fad-94c2-3d9265f3f5a2.webp?v=1768737132&width=990",
      rating: 4.8,
      stock: 40,
      description: "Premium executive gift set for business partners.",
      includes: ["Leather Wallet", "Pen", "Watch", "Business Card Holder"]
    },

    // Baby Gifts
    {
      _id: "gift13",
      title: "New Born Baby Gift Set",
      price: 1299,
      originalPrice: 2599,
      discountPercentage: 50,
      category: "Baby Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/072/266/684/small_2x/celebration-presents-for-a-new-baby-girl-or-boy-with-gifts-and-pastel-decorations-photo.jpeg",
      rating: 4.9,
      stock: 30,
      description: "Cute baby gift set for new parents.",
      includes: ["Baby Clothes", "Soft Toys", "Baby Blanket", "Rattle Set"]
    },
    {
      _id: "gift14",
      title: "Baby Shower Gift Box",
      price: 999,
      originalPrice: 1999,
      discountPercentage: 50,
      category: "Baby Gifts",
      thumbnail: "https://static.vecteezy.com/system/resources/previews/072/326/251/non_2x/pink-and-blue-gift-boxes-with-pearls-and-ribbon-on-the-surface-free-photo.jpeg",
      rating: 4.7,
      stock: 45,
      description: "Perfect baby shower gift box.",
      includes: ["Baby Essentials", "Soft Toys", "Baby Book", "Photo Frame"]
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(giftProducts);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(giftProducts);
    } else {
      setFilteredProducts(giftProducts.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory]);

  const handleGiftClick = (gift) => {
    setSelectedGift(gift);
    setShowGiftModal(true);
  };

  const handleAddToCart = () => {
    const gift = selectedGift;
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
      toast.error("Please login to add gift to cart ❌");
      navigate("/signin");
      return;
    }

    // Prepare gift order data
    const giftOrder = {
      ...gift,
      giftMessage: giftMessage,
      recipientName: recipientName,
      senderName: senderName,
      giftWrap: selectedGiftWrap,
      deliveryDate: deliveryDate,
      isGiftCard: isGiftCard,
      giftCardAmount: isGiftCard ? giftCardAmount : null
    };

    // Store in localStorage for checkout
    localStorage.setItem("giftOrder", JSON.stringify(giftOrder));
    
    toast.success(`✨ Gift added to cart!`, {
      onClose: () => navigate("/cart")
    });
    setShowGiftModal(false);
    resetForm();
  };

  const resetForm = () => {
    setGiftMessage("");
    setRecipientName("");
    setSenderName("");
    setSelectedGiftWrap("premium");
    setDeliveryDate("");
    setIsGiftCard(false);
    setGiftCardAmount(1000);
  };

  const getCategoryIcon = (categoryName) => {
    const cat = giftCategories.find(c => c.name === categoryName);
    return cat ? cat.icon : "bi-gift-fill";
  };

  const getCategoryColor = (categoryName) => {
    const cat = giftCategories.find(c => c.name === categoryName);
    return cat ? cat.color : "#e12727";
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <style>
        {`
          .gift-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
          }
          
          .gift-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
          
          .gift-image {
            height: 200px;
            object-fit: fit;
            padding: 20px;
            background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
            transition: transform 0.3s ease;
            width: 100%;
          }
          
          .gift-card:hover .gift-image {
            transform: scale(1.05);
          }
          
          .category-tab {
            cursor: pointer;
            transition: all 0.2s ease;
            border-radius: 25px;
            white-space: nowrap;
          }
          
          .category-tab.active {
            background: linear-gradient(135deg, #e12727, #ff6b6b);
            color: white;
            border-color: #e12727;
          }
          
          .category-tab:hover:not(.active) {
            background-color: #e12727;
            border: 1px solid #f8f9fa;
            color:#f8f9fa;
            transform: translateY(2px);
          }
          
          .gift-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            background: linear-gradient(135deg, #ffd89b, #c7e9fb);
            color: #e12727;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
          }
          
          @media (max-width: 768px) {
            .gift-image {
              height: 160px;
            }
            .category-tab {
              white-space: normal;
            }
          }
        `}
      </style>

      <div className="container py-4">
        {/* Breadcrumb */}
        <nav style={{ fontSize: "14px" }} className="mb-4">
          <a href="/" className="text-decoration-none text-secondary">Home</a>
          <span className="mx-2 text-secondary">›</span>
          <span className="text-danger fw-semibold">Gift Boxes</span>
        </nav>

        {/* Header Section */}
        <div className="bg-gradient rounded-3 p-4 mb-4 text-white" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="text-danger">
              <h1 className="display-5 fw-bold mb-2">
                🎁 Gift Boxes & Hampers
              </h1>
              <p className="mb-0 fs-5 opacity-90">
                Find the perfect gift for every occasion. Personalize with your message!
              </p>
            </div>
            <div className="mt-3 mt-md-0">
              <div className="bg-white rounded-pill px-4 py-2" style={{ color: "#764ba2" }}>
                <i className="bi bi-gift-fill me-2"></i>
                <strong>{filteredProducts.length}</strong> Gift Options
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-4 overflow-auto ">
          <div className="d-flex gap-2 pb-2" style={{ minWidth: "min-content" }}>
            <button
              className={`btn category-tab px-4 py-2  ${selectedCategory === "all" ? "active" : "btn-outline-danger"}`}
              onClick={() => setSelectedCategory("all")}
            >
              🎁 All Gifts
            </button>
            {giftCategories.map((cat) => (
              <button
                key={cat.name}
                className={`btn category-tab px-4 py-2 ${selectedCategory === cat.name ? "active" : "btn-outline-danger"}`}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <i className={`${cat.icon} me-2`}></i>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Gift Cards Grid */}
        <div className="row g-4">
          {filteredProducts.map((gift) => (
            <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={gift._id}>
              <div 
                className="card gift-card border-0 shadow-sm"
                onClick={() => handleGiftClick(gift)}
              >
                <div className="position-relative">
                  <div className="gift-badge">
                    <i className="bi bi-gift-fill me-1"></i>Gift Box
                  </div>
                  <img
                    src={gift.thumbnail}
                    className="gift-image w-100"
                    alt={gift.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300?text=Gift+Box";
                    }}
                  />
                </div>
                
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <small className="text-muted">
                      <i className={`${getCategoryIcon(gift.category)} me-1`}></i>
                      {gift.category}
                    </small>
                    <div className="text-warning">
                      <i className="bi bi-star-fill me-1" style={{ fontSize: "12px" }}></i>
                      <small>{gift.rating}</small>
                    </div>
                  </div>
                  
                  <h6 className="card-title mb-2" style={{ fontSize: "0.95rem", minHeight: "45px" }}>
                    {gift.title}
                  </h6>
                  
                  <div className="mb-2">
                    <span className="price fw-bold text-danger fs-5">₹{gift.price}</span>
                    <span className="original-price text-muted text-decoration-line-through ms-2">
                      ₹{gift.originalPrice}
                    </span>
                    <span className="badge bg-success ms-2">-{gift.discountPercentage}%</span>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted">
                      <i className="bi bi-box-seam me-1"></i>
                      Includes {gift.includes.length} items
                    </small>
                  </div>
                </div>
                
                <div className="card-footer bg-white border-0 pb-3">
                  <button className="btn btn-danger w-100 rounded-pill">
                    <i className="bi bi-gift-fill me-2"></i>Select Gift
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gift Customization Modal */}
        {showGiftModal && selectedGift && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-gift-fill me-2"></i>
                    Personalize Your Gift
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowGiftModal(false)}
                  ></button>
                </div>
                
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-5">
                      <img
                        src={selectedGift.thumbnail}
                        className="img-fluid rounded"
                        alt={selectedGift.title}
                        style={{ maxHeight: "200px", width: "100%", objectFit: "contain" }}
                      />
                      <h6 className="mt-3">{selectedGift.title}</h6>
                      <p className="text-danger fw-bold fs-5">₹{selectedGift.price}</p>
                      <div className="mt-2">
                        <small className="text-muted">Includes:</small>
                        <ul className="small mt-1">
                          {selectedGift.includes.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="col-md-7">
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Recipient's Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Enter recipient's name"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Your Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Gift Message</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          placeholder="Write a heartfelt message for your loved one..."
                        ></textarea>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Gift Wrap Style</label>
                        <select
                          className="form-select"
                          value={selectedGiftWrap}
                          onChange={(e) => setSelectedGiftWrap(e.target.value)}
                        >
                          <option value="premium">Premium Gift Wrap (+₹99)</option>
                          <option value="luxury">Luxury Gift Box (+₹199)</option>
                          <option value="eco">Eco-friendly Wrap (+₹49)</option>
                        </select>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Delivery Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="giftCard"
                          checked={isGiftCard}
                          onChange={(e) => setIsGiftCard(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="giftCard">
                          Add a digital gift card (+₹{giftCardAmount})
                        </label>
                      </div>
                      
                      {isGiftCard && (
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Gift Card Amount</label>
                          <select
                            className="form-select"
                            value={giftCardAmount}
                            onChange={(e) => setGiftCardAmount(Number(e.target.value))}
                          >
                            <option value={500}>₹500</option>
                            <option value={1000}>₹1000</option>
                            <option value={2000}>₹2000</option>
                            <option value={5000}>₹5000</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowGiftModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={handleAddToCart}
                    disabled={!recipientName || !senderName}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gift Tips Section */}
        <div className="mt-5">
          <h4 className="mb-3">✨ Gift Giving Tips</h4>
          <div className="row g-4">
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded">
                <i className="bi bi-chat-heart fs-1 text-danger"></i>
                <h6 className="mt-2">Personalize It</h6>
                <small className="text-muted">Add a heartfelt message to make it special</small>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded">
                <i className="bi bi-calendar-heart fs-1 text-danger"></i>
                <h6 className="mt-2">Plan Ahead</h6>
                <small className="text-muted">Schedule delivery for special occasions</small>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded">
                <i className="bi bi-box-seam fs-1 text-danger"></i>
                <h6 className="mt-2">Premium Wrapping</h6>
                <small className="text-muted">Make a lasting impression</small>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="text-center p-3 bg-light rounded">
                <i className="bi bi-truck fs-1 text-danger"></i>
                <h6 className="mt-2">Free Delivery</h6>
                <small className="text-muted">On orders above ₹999</small>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Banner */}
        <div className="mt-5 p-4 bg-light rounded-3 text-center">
          <i className="bi bi-gift fs-1 text-danger"></i>
          <h5 className="mt-2">Need help choosing the perfect gift?</h5>
          <p className="text-muted">Our gift experts are here to help you 24/7</p>
          <button className="btn btn-outline-danger rounded-pill px-4">
            <i className="bi bi-chat-dots me-2"></i>Chat with Expert
          </button>
        </div>
      </div>
    </>
  );
}

export default GiftBoxes;