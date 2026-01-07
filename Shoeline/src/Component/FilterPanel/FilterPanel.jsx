import React, { useState } from 'react'
import './FilterPanel.css'

const FilterPanel = ({ onFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const sizes = ['6', '7', '8', '9', '10', '11', '12'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Brown'];
  const types = ['Sneakers', 'Sandals', 'Basketball', 'Running', 'Casual'];

  const handleFilterChange = (type, value) => {
    let newFilters;
    if (type === 'size') {
      newFilters = selectedSizes.includes(value) 
        ? selectedSizes.filter(s => s !== value)
        : [...selectedSizes, value];
      setSelectedSizes(newFilters);
      onFilter({ sizes: newFilters, colors: selectedColors, types: selectedTypes });
    } else if (type === 'color') {
      newFilters = selectedColors.includes(value)
        ? selectedColors.filter(c => c !== value)
        : [...selectedColors, value];
      setSelectedColors(newFilters);
      onFilter({ sizes: selectedSizes, colors: newFilters, types: selectedTypes });
    } else if (type === 'type') {
      newFilters = selectedTypes.includes(value)
        ? selectedTypes.filter(t => t !== value)
        : [...selectedTypes, value];
      setSelectedTypes(newFilters);
      onFilter({ sizes: selectedSizes, colors: selectedColors, types: newFilters });
    }
  };

  return (
    <div className='filter-container'>
      <button className='filter-button' onClick={() => setIsOpen(!isOpen)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 4.5H21V6H3V4.5ZM7.5 10.5H16.5V12H7.5V10.5ZM10.5 16.5H13.5V18H10.5V16.5Z" fill="currentColor"/>
        </svg>
        <span>Filter</span>
      </button>
      
      {isOpen && (
        <>
          <div className='filter-overlay' onClick={() => setIsOpen(false)} />
          <div className='filter-popup'>
            <div className='filter-header'>
              <h3>Filters</h3>
              <button className='close-button' onClick={() => setIsOpen(false)}>×</button>
            </div>
            
            <div className='filter-content'>
              <div className='filter-section'>
                <h4>Size</h4>
                <div className='filter-options'>
                  {sizes.map(size => (
                    <label key={size} className='filter-option'>
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => handleFilterChange('size', size)}
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className='filter-section'>
                <h4>Color</h4>
                <div className='filter-options'>
                  {colors.map(color => (
                    <label key={color} className='filter-option'>
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => handleFilterChange('color', color)}
                      />
                      <span>{color}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className='filter-section'>
                <h4>Type</h4>
                <div className='filter-options'>
                  {types.map(type => (
                    <label key={type} className='filter-option'>
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleFilterChange('type', type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FilterPanel