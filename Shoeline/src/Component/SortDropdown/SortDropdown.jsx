import React, { useState } from 'react'
import './SortDropdown.css'
import dropdown_icon from '../../assets/dropdown_icon.png'

const SortDropdown = ({ onSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Sort by');

  const sortOptions = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Name: A to Z', value: 'name_asc' },
    { label: 'Name: Z to A', value: 'name_desc' }
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    setIsOpen(false);
    onSort(option.value);
  };

  return (
    <div className='sort-dropdown'>
      <div className='sort-dropdown-header' onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption}</span>
        <img src={dropdown_icon} alt='' className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <div className='sort-dropdown-options'>
          {sortOptions.map((option, index) => (
            <div
              key={index}
              className='sort-dropdown-option'
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown