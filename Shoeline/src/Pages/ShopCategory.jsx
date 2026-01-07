import React, { useContext, useState } from 'react'
import './css/ShopCategory.css'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Component/Item/Item'
import SearchBar from '../Component/SearchBar/SearchBar'
import SortDropdown from '../Component/SortDropdown/SortDropdown'
import FilterPanel from '../Component/FilterPanel/FilterPanel'

const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [filters, setFilters] = useState({ sizes: [], colors: [], types: [] });

  const handleSearch = (term) => {
    setSearchTerm(term.toLowerCase());
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = all_product.filter(item => {
    const matchesCategory = props.category === item.category;
    const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm);
    const matchesSize = filters.sizes.length === 0 || (item.size && filters.sizes.some(size => item.size.includes(size)));
    const matchesColor = filters.colors.length === 0 || (item.color && filters.colors.some(color => item.color.includes(color)));
    const matchesType = filters.types.length === 0 || (item.type && filters.types.includes(item.type));
    return matchesCategory && matchesSearch && matchesSize && matchesColor && matchesType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case 'price_asc': return a.new_price - b.new_price;
      case 'price_desc': return b.new_price - a.new_price;
      case 'name_asc': return a.name.localeCompare(b.name);
      case 'name_desc': return b.name.localeCompare(a.name);
      default: return 0;
    }
  });
  return (
    <div className='shop-category'>
      <img src={props.banner} alt=''/>
      <SearchBar onSearch={handleSearch} placeholder={`Search ${props.category} products...`} />
      <div className='shopcategory-indexSort'>
        <p>
          <span>Showing 1-12</span> out of 36 products
        </p>
        <div className='shopcategory-sort'>
          <FilterPanel onFilter={handleFilter} />
          <SortDropdown onSort={handleSort} />
        </div>
      </div>

      <div className='shopcategory-products'>
        {sortedProducts.map((item,i)=>{
          return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
        <div className='shopcategory-loadmore'>
          Loadmore...
        </div>
    </div>
  )
}

export default ShopCategory;
