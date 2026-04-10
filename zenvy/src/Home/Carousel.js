/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slide1 from '../assets/images/slide-1.jpg';
import slide2 from '../assets/images/slide-2.jpeg';
import slide3 from '../assets/images/slide-3.jpg';

function Carousel() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      id: 1,
      image: slide1,
      h1: "Best Living Room Furniture Collection",
      h3: "Make your living room more luxurious",
      btnText: "Shop Now",
      btnLink: "/furniture",
      h1Animation: "zoomIn",
      h3Animation: "fromRight",
      btnAnimation: "fromBottom",
      contentPosition: "left-bottom"
    },
    {
      id: 2,
      image: slide2,
      h1: "Women's Designer Sunglass",
      h3: "Maximum discount upto 30% on Burberry women's sunglasses",
      btnText: "Shop Now",
      btnLink: "/fashion",
      h1Animation: "fromRight",
      h3Animation: "fromLeft",
      btnAnimation: "fromBottom",
      contentPosition: "left"
    },
    {
      id: 3,
      image: slide3,
      h1: "Women's Sterling Silver Jewelry",
      h3: "Three-piece women's jewelry set made entirely from pure silver",
      btnText: "Shop Now",
      btnLink: "/jewelry",
      h1Animation: "fromRight",
      h3Animation: "rotate180",
      btnAnimation: "fromLeft",
      contentPosition: "left"
    }
  ];

  const features = [
    {
      icon: "bi-box",
      title: "Free Shipping",
      desc: "On order over $49.00",
    },
    {
      icon: "bi-currency-dollar",
      title: "Money Guarantee",
      desc: "Within 30 days for an exchange",
    },
    {
      icon: "bi-headset",
      title: "Online Support",
      desc: "24 hours a day, 7 days a week",
    },
    {
      icon: "bi-credit-card",
      title: "Flexible Payment",
      desc: "Pay with Multiple Credit Cards",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleShopNow = (link) => {
    navigate(link);
  };

  const getContentPosition = (position) => {
    switch(position) {
      case 'left-bottom':
        return {
          textAlign: 'left',
          marginLeft: '10%',
          marginRight: 'auto',
          alignSelf: 'flex-end',
          marginBottom: '80px'
        };
      case 'left':
        return {
          textAlign: 'left',
          marginLeft: '10%',
          marginRight: 'auto',
          marginTop: '-80px'
        };
      default:
        return {
          textAlign: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '-80px'
        };
    }
  };

  return (
    <>
      <style>
        {`
        .carousel-container {
          position: relative;
          width: 100%;
          height: 600px;
          overflow: hidden;
          margin: 0 auto;
        }

        .carousel-slides {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
          display: flex;
          align-items: center;
        }

        .carousel-slide.active {
          opacity: 1;
          z-index: 1;
        }

        .slide-image-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .slide-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%);
          z-index: 1;
        }

        .carousel-content {
          color: white;
          max-width: 600px;
          padding: 20px;
          z-index: 2;
          position: relative;
        }

        .carousel-h1 {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          opacity: 0;
        }

        .carousel-h1.zoomIn {
          animation: zoomIn 0.8s ease forwards;
        }

        .carousel-h1.fromRight {
          animation: fromRight 0.8s ease forwards;
        }

        .carousel-h3 {
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 30px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          opacity: 0;
        }

        .carousel-h3.fromRight {
          animation: fromRight 0.8s ease 0.2s forwards;
        }

        .carousel-h3.fromLeft {
          animation: fromLeft 0.8s ease 0.2s forwards;
        }

        .carousel-h3.rotate180 {
          animation: rotate180 0.8s ease 0.2s forwards;
        }

        .carousel-btn {
          background: transparent;
          color: white;
          border: 2px solid white;
          padding: 12px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 4px;
          opacity: 0;
          text-decoration: none;
          display: inline-block;
        }

        .carousel-btn.fromBottom {
          animation: fromBottom 0.8s ease 0.4s forwards;
        }

        .carousel-btn.fromLeft {
          animation: fromLeft 0.8s ease 0.4s forwards;
        }

        .carousel-btn:hover {
          background-color: black;
          border-color: black;
          color: white;
          transform: translateY(-2px);
        }

        .carousel-indicators {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
          margin: 0;
          padding: 0;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .indicator.active {
          background-color: white;
          transform: scale(1.2);
        }

        .indicator:hover {
          background-color: white;
          transform: scale(1.1);
        }

        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .carousel-control:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-control.prev {
          left: 20px;
        }

        .carousel-control.next {
          right: 20px;
        }

        /* Feature Section Styles */
        .feature-item {
          cursor: pointer;
          padding: 10px;
          transition: all 0.3s ease;
        }

        .icon-wrapper {
          width: 55px;
          height: 55px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .icon-wrapper i {
          font-size: 26px;
          color: #000;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .feature-item:hover .icon-wrapper i {
          animation: jellyIcon 0.6s ease;
          background-color: black;
          border-radius: 50%;
          padding: 10px;
          color: white;
        }

        /* Animations */
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fromBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rotate180 {
          from {
            opacity: 0;
            transform: rotate(180deg) scale(0.5);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes jellyIcon {
          0% {
            transform: translateY(0) scale(1, 1);
          }
          30% {
            transform: translateY(-6px) scale(1.2, 0.8);
          }
          50% {
            transform: translateY(-10px) scale(0.9, 1.1);
          }
          70% {
            transform: translateY(-6px) scale(1.05, 0.95);
          }
          100% {
            transform: translateY(0) scale(1, 1);
          }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .carousel-container {
            height: 550px;
          }
          
          .carousel-h1 {
            font-size: 42px;
          }
          
          .carousel-h3 {
            font-size: 22px;
          }
        }

        @media (max-width: 992px) {
          .carousel-container {
            height: 500px;
          }
          
          .carousel-h1 {
            font-size: 36px;
          }
          
          .carousel-h3 {
            font-size: 20px;
          }
          
          .carousel-btn {
            padding: 10px 28px;
            font-size: 14px;
          }
          
          .carousel-content {
            max-width: 500px;
          }
        }

        @media (max-width: 768px) {
          .carousel-container {
            height: 450px;
          }

          .carousel-h1 {
            font-size: 28px;
            margin-bottom: 15px;
          }

          .carousel-h3 {
            font-size: 16px;
            margin-bottom: 20px;
          }

          .carousel-btn {
            padding: 8px 20px;
            font-size: 12px;
          }

          .carousel-control {
            width: 35px;
            height: 35px;
            font-size: 20px;
          }

          .carousel-content {
            padding: 15px;
            max-width: 400px;
          }
          
          .carousel-content[style*="margin-bottom: 80px"] {
            margin-bottom: 40px !important;
          }
          
          .carousel-content[style*="margin-top: -80px"] {
            margin-top: -40px !important;
          }
          
          .carousel-indicators {
            bottom: 15px;
            gap: 8px;
          }
          
          .indicator {
            width: 8px;
            height: 8px;
          }
          
          /* Feature section responsive */
          .feature-item {
            justify-content: center !important;
            text-align: center;
            flex-direction: column !important;
          }
          
          .feature-item .icon-wrapper {
            margin-bottom: 10px;
          }
          
          .feature-item div {
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .carousel-container {
            height: 350px;
          }

          .carousel-h1 {
            font-size: 22px;
            margin-bottom: 10px;
          }

          .carousel-h3 {
            font-size: 13px;
            margin-bottom: 15px;
          }

          .carousel-btn {
            padding: 6px 16px;
            font-size: 11px;
          }

          .carousel-control {
            width: 30px;
            height: 30px;
            font-size: 18px;
          }
          
          .carousel-control.prev {
            left: 10px;
          }
          
          .carousel-control.next {
            right: 10px;
          }
          
          .carousel-content[style*="margin-bottom: 80px"] {
            margin-bottom: 20px !important;
          }
          
          .carousel-content[style*="margin-top: -80px"] {
            margin-top: -20px !important;
          }
          
          .carousel-content {
            max-width: 280px;
            padding: 10px;
          }
          
          .carousel-content[style*="margin-left: 10%"] {
            margin-left: 5% !important;
          }
        }

        @media (max-width: 380px) {
          .carousel-container {
            height: 300px;
          }
          
          .carousel-h1 {
            font-size: 18px;
          }
          
          .carousel-h3 {
            font-size: 11px;
          }
          
          .carousel-btn {
            padding: 5px 12px;
            font-size: 10px;
          }
          
          .carousel-content {
            max-width: 240px;
          }
        }

        @media (min-width: 1920px) {
          .carousel-container {
            height: 700px;
          }
          
          .carousel-h1 {
            font-size: 64px;
          }
          
          .carousel-h3 {
            font-size: 32px;
          }
          
          .carousel-btn {
            padding: 15px 40px;
            font-size: 18px;
          }
          
          .carousel-content {
            max-width: 800px;
          }
        }

        /* Landscape mode for mobile */
        @media (max-width: 768px) and (orientation: landscape) {
          .carousel-container {
            height: 300px;
          }
          
          .carousel-h1 {
            font-size: 20px;
          }
          
          .carousel-h3 {
            font-size: 12px;
          }
          
          .carousel-content {
            margin-top: 0 !important;
          }
        }
        `}
      </style>

      <div className="carousel-container mb-3">
        <div className="carousel-slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
            >
              <div className="slide-image-wrapper">
                <img 
                  src={slide.image} 
                  alt={slide.h1}
                  className="slide-image"
                />
              </div>
              
              <div className="slide-overlay"></div>
              
              <div 
                className="carousel-content"
                style={getContentPosition(slide.contentPosition)}
              >
                <h1 className={`carousel-h1 ${index === activeIndex ? slide.h1Animation : ''}`}>
                  {slide.h1}
                </h1>
                <h3 className={`carousel-h3 ${index === activeIndex ? slide.h3Animation : ''}`}>
                  {slide.h3}
                </h3>
                <button 
                  className={`carousel-btn ${index === activeIndex ? slide.btnAnimation : ''}`}
                  onClick={() => handleShopNow(slide.btnLink)}
                >
                  {slide.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button className="carousel-control prev" onClick={goToPrev} aria-label="Previous slide">
          <span>‹</span>
        </button>
        <button className="carousel-control next" onClick={goToNext} aria-label="Next slide">
          <span>›</span>
        </button>
      </div>
      
      <br />
      
      <div className="bg-light py-4">
        <div className="container">
          <div className="row text-center text-md-start">
            {features.map((item, index) => (
              <div key={index} className="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0">
                <div className="d-flex align-items-center gap-3 feature-item">
                  <div className="icon-wrapper">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <h6 className="mb-1 fw-semibold">{item.title}</h6>
                    <small className="text-muted">{item.desc}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Carousel;