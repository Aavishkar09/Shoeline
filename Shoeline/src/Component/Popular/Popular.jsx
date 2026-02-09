import React from 'react'
import './Popular.css'
import Item from '../Item/Item'
import { usePopularInMen } from '../../hooks/useProducts'

const Popular = () => {
  const { data: popularProducts = [], isLoading, error } = usePopularInMen();

  if (isLoading) return <div className='popular'><h2>Loading...</h2></div>;
  if (error) return <div className='popular'><h2>Error loading popular products</h2></div>;

  return (
    <div className='popular'>
      <h2>Popular in Mens</h2>
      <hr/>
      <div className='popular-item'>
        {popularProducts.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default Popular;
