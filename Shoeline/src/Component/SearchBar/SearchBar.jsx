import React, { useState, useContext, useRef, useEffect } from 'react'
import { ShopContext } from '../../Context/ShopContext'
import './SearchBar.css'

const SearchBar = ({ onSearch, placeholder = "Search products...", category }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const { all_product } = useContext(ShopContext);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = (value) => {
    if (value.trim()) {
      const results = all_product.filter(item => {
        const matchesCategory = category ? item.category === category : true;
        const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
        return matchesCategory && matchesSearch;
      }).slice(0, 5);
      
      setFilteredResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setShowDropdown(false);
      setFilteredResults([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    setShowDropdown(false);
  };

  const handleResultClick = (product) => {
    setSearchTerm(product.name);
    onSearch(product.name);
    setShowDropdown(false);
    inputRef.current.blur();
  };

  const handleInputFocus = () => {
    if (searchTerm.trim() && filteredResults.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className='search-bar-container' ref={dropdownRef}>
      <form onSubmit={handleSubmit} className='search-bar-form'>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className='search-bar-input'
        />
        <button type="submit" className='search-bar-button'>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
      
      {showDropdown && (
        <div className='search-dropdown'>
          {filteredResults.map((product) => (
            <div 
              key={product.id} 
              className='search-dropdown-item'
              onClick={() => handleResultClick(product)}
            >
              <img src={product.image} alt={product.name} className='search-item-image' />
              <div className='search-item-details'>
                <span className='search-item-name'>{product.name}</span>
                <span className='search-item-price'>${product.new_price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar