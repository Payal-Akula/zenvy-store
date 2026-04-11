import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./nav.css";

function Searchbar({ closeOverlay }) {
  const [arr, setA] = useState([]);
  const [data, setD] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://zenvy-store.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setA(Array.isArray(data) ? data : data.products || []);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  function change(e) {
    const keyword = e.target.value.toLowerCase();
    setInputValue(keyword);

    if (keyword.trim().length === 0) {
      setD([]);
      return;
    }

    const safeArr = Array.isArray(arr) ? arr : [];
    const filtered = safeArr.filter((item) =>
      (item.title || "").toLowerCase().includes(keyword)
    );
    setD(filtered);
  }

  function handleSearch(searchTerm) {
    if (searchTerm && searchTerm.trim()) {
      setD([]);
      navigate(`/singleproducts?keyword=${encodeURIComponent(searchTerm.trim())}`);
      if (closeOverlay) closeOverlay();
    }
  }

  function new1(title) {
    let viewed = JSON.parse(localStorage.getItem("viewedItems")) || [];
    if (!viewed.includes(title)) {
      viewed.push(title);
      localStorage.setItem("viewedItems", JSON.stringify(viewed));
    }
    handleSearch(title);
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(inputValue);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setD([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchbar-wrapper" ref={dropdownRef}>
      <div className="searchbar flex-grow-1 d-flex justify-content-center">
        <div className="input-group searching">
          <input
            type="text"
            className="form-control controls"
            value={inputValue}
            onChange={change}
            onKeyPress={handleKeyPress}
            placeholder="Search Zenvy.in"
            aria-label="Search products"
            autoFocus
          />
          <button 
            className="btn btn-outline-secondary searchicon" 
            type="button"
            onClick={() => handleSearch(inputValue)}
            aria-label="Search"
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>

      {data.length > 0 && (
        <ul className="search-results">
          {data.map((item, index) => (
            <li
              className="search-item"
              key={index}
              onClick={() => new1(item.title)}
            >
              <i className="bi bi-search me-2"></i>
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Searchbar