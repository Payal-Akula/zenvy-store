import React from "react";
import { useNavigate } from "react-router-dom";
import grid1 from '../assets/images/grid-1.jpeg'
import grid2 from '../assets/images/grid-2.jpeg'
import grid3 from '../assets/images/grid-3.jpg'
import grid4 from '../assets/images/grid-4.jpg'
import grid5 from '../assets/images/grid-5.jpeg'
import grid6 from '../assets/images/grid-6.jpeg'

function ProductDisplay() {
  const navigate = useNavigate();

const items = [
  {
    title: "Watch & Jewelry",
    img: grid1,
    tall: true,
    path: "/jewelry", 
  },
  {
    title: "Smartphone",
    img: grid2,
    path: "/smartphone", 
  },
  {
    title: "Cosmetics",
    img: grid3,
    path: "/cosmetics", 
  },
  {
    title: "Women’s Jacket",
    img: grid4,
    tall: true,
    path: "/fashion",  
  },
  {
    title: "Furniture",
    img: grid5,
    path: "/furniture",  
  },
  {
    title: "Speaker",
    img: grid6,
    path: "/electronics",  
  },
];

  const handleNavigation = (item) => {
    navigate(item.path);
  };
  return (
    <>
      <style>
        {`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: auto;
          gap: 20px;
        }

        .product-card {
          position: relative;
          cursor: pointer;
          overflow: hidden;
          border-radius: 8px;
          background: #f5f5f5;
        }

        .product-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .product-card:hover img {
          transform: scale(1.05);
        }

        .tall-card {
          grid-row: span 2;
        }

        /* Button styling */
        .product-btn {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: white;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .product-btn i {
          transition: transform 0.3s ease;
        }

        /* Hover effect - danger color without border */
        .product-card:hover .product-btn {
          background-color: #dc3545;
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 5px 20px rgba(220, 53, 69, 0.3);
        }

        .product-card:hover .product-btn i {
          transform: translateX(8px);
        }

        /* Shadow flash animation - comes and goes */
        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 8px;
          z-index: 3;
          pointer-events: none;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          transition: none;
        }

        .product-card:hover::before {
          animation: shadowFlash 0.6s ease-out forwards;
        }

        @keyframes shadowFlash {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
          20% {
            box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.6);
          }
          40% {
            box-shadow: 0 0 0 16px rgba(255, 255, 255, 0.3);
          }
          60% {
            box-shadow: 0 0 0 24px rgba(255, 255, 255, 0.1);
          }
          100% {
            box-shadow: 0 0 0 32px rgba(255, 255, 255, 0);
          }
        }

        /* Desktop Layout */
        @media (min-width: 1200px) {
          .product-grid {
            gap: 24px;
          }
          
          .product-card:nth-child(1) {
            grid-row: span 2;
            grid-column: 1 / 2;
          }
          
          .product-card:nth-child(2) {
            grid-row: 1 / 2;
            grid-column: 2 / 3;
          }
          
          .product-card:nth-child(3) {
            grid-row: 2 / 3;
            grid-column: 2 / 3;
          }
          
          .product-card:nth-child(4) {
            grid-row: span 2;
            grid-column: 3 / 4;
          }
          
          .product-card:nth-child(5) {
            grid-row: 1 / 2;
            grid-column: 4 / 5;
          }
          
          .product-card:nth-child(6) {
            grid-row: 2 / 3;
            grid-column: 4 / 5;
          }
        }

        @media (min-width: 992px) and (max-width: 1199px) {
          .product-grid {
            gap: 16px;
          }
          
          .product-card:nth-child(1) {
            grid-row: span 2;
            grid-column: 1 / 2;
          }
          
          .product-card:nth-child(2) {
            grid-row: 1 / 2;
            grid-column: 2 / 3;
          }
          
          .product-card:nth-child(3) {
            grid-row: 2 / 3;
            grid-column: 2 / 3;
          }
          
          .product-card:nth-child(4) {
            grid-row: span 2;
            grid-column: 3 / 4;
          }
          
          .product-card:nth-child(5) {
            grid-row: 1 / 2;
            grid-column: 4 / 5;
          }
          
          .product-card:nth-child(6) {
            grid-row: 2 / 3;
            grid-column: 4 / 5;
          }
          
          .product-btn {
            padding: 10px 16px;
            font-size: 12px;
            bottom: 15px;
            left: 15px;
            right: 15px;
          }
        }

        @media (min-width: 768px) and (max-width: 991px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          
          .tall-card {
            grid-row: span 1;
          }
          
          .product-card {
            height: 350px;
          }
          
          .product-card img {
            object-fit: cover;
          }
          
          .product-btn {
            padding: 10px 16px;
            font-size: 12px;
            bottom: 15px;
            left: 15px;
            right: 15px;
          }
        }

        @media (min-width: 576px) and (max-width: 767px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .tall-card {
            grid-row: span 1;
          }
          
          .product-card {
            height: 280px;
          }
          
          .product-btn {
            padding: 8px 12px;
            font-size: 11px;
            bottom: 12px;
            left: 12px;
            right: 12px;
          }
          
          .product-btn i {
            font-size: 10px;
          }
        }

        @media (max-width: 575px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .product-card {
            height: 320px;
          }
          
          .tall-card {
            grid-row: span 1;
            height: 320px;
          }
          
          .product-btn {
            padding: 10px 16px;
            font-size: 12px;
            bottom: 15px;
            left: 15px;
            right: 15px;
          }
        }

        @media (max-width: 380px) {
          .product-card {
            height: 260px;
          }
          
          .product-btn {
            padding: 8px 12px;
            font-size: 10px;
            bottom: 10px;
            left: 10px;
            right: 10px;
          }
          
          .product-btn i {
            font-size: 9px;
          }
        }

        @media (min-width: 992px) {
          .product-card:not(.tall-card) {
            height: auto;
            min-height: 250px;
          }
        }

        @media (min-width: 992px) {
          .product-card.tall-card {
            height: auto;
            min-height: 520px;
          }
        }
        `}
      </style>

      <div className="container py-4">
      <div className="product-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className={`product-card ${item.tall ? "tall-card" : ""}`}
            onClick={() => handleNavigation(item)}
          >
            <img src={item.img} alt={item.title} />
            <button className="product-btn" onClick={(e) => {
              e.stopPropagation();
              handleNavigation(item);
            }}>
              {item.title}
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default ProductDisplay;