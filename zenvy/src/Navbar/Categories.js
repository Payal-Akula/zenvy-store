/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'

function Categories() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="dropdown categories-dropdown" 
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="btn text-white bg-transparent " 
        type="button"
      >
       <i className='bi bi-grid px-1'></i> All Categories
      </button>
      
      <ul className={`dropdown-menu scroll-dropdown ${isOpen ? 'show' : ''}`}>
        <li><a className="dropdown-item" href="#">All Category</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Cars & Motorbikes</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Electronics</a></li>
        <li><a className="dropdown-item ps-4" href="#">Cell Phones</a></li>
        <li><a className="dropdown-item ps-4" href="#">Computers</a></li>
        <li><a className="dropdown-item ps-5" href="#">Headphone</a></li>
        <li><a className="dropdown-item ps-5" href="#">Keyboards</a></li>
        <li><a className="dropdown-item ps-5" href="#">Sound</a></li>
        <li><a className="dropdown-item ps-5" href="#">Webcams</a></li>
        <li><a className="dropdown-item ps-4" href="#">Mobile</a></li>
        <li><a className="dropdown-item ps-4" href="#">Office Electronics</a></li>
        <li><a className="dropdown-item ps-5" href="#">Calculators</a></li>
        <li><a className="dropdown-item ps-5" href="#">Copiers</a></li>
        <li><a className="dropdown-item ps-5" href="#">Equipment</a></li>
        <li><a className="dropdown-item ps-5" href="#">Fax Machines</a></li>
        <li><a className="dropdown-item ps-4" href="#">Smartphone</a></li>
        <li><a className="dropdown-item ps-5" href="#">Apple</a></li>
        <li><a className="dropdown-item ps-5" href="#">Oppo</a></li>
        <li><a className="dropdown-item ps-5" href="#">Samsung</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Fashion</a></li>
        <li><a className="dropdown-item ps-4" href="#">Bags & Luggage</a></li>
        <li><a className="dropdown-item ps-4" href="#">Handbags</a></li>
        <li><a className="dropdown-item ps-4" href="#">Sneakers</a></li>
        <li><a className="dropdown-item ps-4" href="#">Women</a></li>
        <li><a className="dropdown-item ps-5" href="#">Belt</a></li>
        <li><a className="dropdown-item ps-5" href="#">Shoes</a></li>
        <li><a className="dropdown-item ps-5" href="#">Sneaker</a></li>
        <li><a className="dropdown-item ps-5" href="#">Socks</a></li>
        <li><a className="dropdown-item ps-5" href="#">Towel</a></li>
        <li><a className="dropdown-item ps-4" href="#">Women Bags</a></li>
        <li><a className="dropdown-item ps-4" href="#">Women Fashion</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Furniture & Decor</a></li>
        <li><a className="dropdown-item ps-4" href="#">Furniture</a></li>
        <li><a className="dropdown-item ps-4" href="#">Home Office</a></li>
        <li><a className="dropdown-item ps-5" href="#">Bookcases</a></li>
        <li><a className="dropdown-item ps-5" href="#">Desks</a></li>
        <li><a className="dropdown-item ps-5" href="#">Office Chairs</a></li>
        <li><a className="dropdown-item ps-5" href="#">Office Storage</a></li>
        <li><a className="dropdown-item ps-4" href="#">Kitchen</a></li>
        <li><a className="dropdown-item ps-4" href="#">Living Room</a></li>
        <li><a className="dropdown-item ps-4" href="#">Sofa & Chair</a></li>
        <li><a className="dropdown-item ps-4" href="#">Sofas & beds</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Games & Console</a></li>
        <li><a className="dropdown-item ps-4" href="#">Baby & Toys</a></li>
        <li><a className="dropdown-item ps-5" href="#">Action figures</a></li>
        <li><a className="dropdown-item ps-5" href="#">Learning toys</a></li>
        <li><a className="dropdown-item ps-5" href="#">Outdoor toys</a></li>
        <li><a className="dropdown-item ps-5" href="#">Toy Vehicle</a></li>
        <li><a className="dropdown-item ps-4" href="#">Board Game</a></li>
        <li><a className="dropdown-item ps-4" href="#">Fidget Toys</a></li>
        <li><a className="dropdown-item ps-4" href="#">Puzzles</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Health & Beauty</a></li>
        <li><a className="dropdown-item ps-4" href="#">Cosmetics</a></li>
        <li><a className="dropdown-item ps-4" href="#">Health & wellness</a></li>
        <li><a className="dropdown-item ps-5" href="#">Fitness & yoga</a></li>
        <li><a className="dropdown-item ps-5" href="#">Fragrance</a></li>
        <li><a className="dropdown-item ps-5" href="#">Haircare</a></li>
        <li><a className="dropdown-item ps-5" href="#">Skincare</a></li>
        <li><a className="dropdown-item ps-4" href="#">Make up</a></li>
        <li><a className="dropdown-item ps-4" href="#">Perfumes</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Jewelry</a></li>
        <li><a className="dropdown-item ps-4" href="#">Brooches</a></li>
        <li><a className="dropdown-item ps-4" href="#">Earrings</a></li>
        <li><a className="dropdown-item ps-4" href="#">Jewelry Armoires</a></li>
        <li><a className="dropdown-item ps-4" href="#">Jewelry sets</a></li>
        <li><a className="dropdown-item ps-5" href="#">Bracelets</a></li>
        <li><a className="dropdown-item ps-5" href="#">Couple ring set</a></li>
        <li><a className="dropdown-item ps-5" href="#">Cufflinks</a></li>
        <li><a className="dropdown-item ps-5" href="#">Necklaces</a></li>
        <li><a className="dropdown-item ps-5" href="#">Rings</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Mom & Baby</a></li>
        <li><a className="dropdown-item ps-4" href="#">Baby Care</a></li>
        <li><a className="dropdown-item ps-4" href="#">Baby Stationery</a></li>
        <li><a className="dropdown-item ps-4" href="#">Car Seats & Accessories</a></li>
        <li><a className="dropdown-item ps-4" href="#">Stroller</a></li>
        <li><hr className="dropdown-divider" /></li>
        
        <li><a className="dropdown-item fw-bold" href="#">Smartphone & Tablet</a></li>
        <li><a className="dropdown-item fw-bold" href="#">Sport & Outdoor</a></li>
      </ul>
    </div>
  )
}

export default Categories