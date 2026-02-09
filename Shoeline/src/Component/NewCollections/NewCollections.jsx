import React from 'react'
import './NewCollections.css'
import Item from '../Item/Item'
import { useNewCollection } from '../../hooks/useProducts'

const NewCollections = () => {
  const { data: new_collection = [], isLoading, error } = useNewCollection();

  if (isLoading) return <div className='new-collections'><h1>Loading...</h1></div>;
  if (error) return <div className='new-collections'><h1>Error loading collections</h1></div>;

  return (
    <div className='new-collections'>
        <h1>New Collections</h1>
        <hr/>
        <div className='collections'>
            {new_collection.map((item,i)=>{
            return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
        })}
        </div>
    </div>
  )
}

export default NewCollections;
