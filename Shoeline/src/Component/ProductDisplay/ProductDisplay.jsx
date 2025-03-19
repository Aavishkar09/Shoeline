import React, { useContext } from 'react'
import './ProductDisplay.css'
import star_icon from '../../assets/star_icon.png'
import star_dull_icon from '../../assets/star_dull_icon.png'
import { ShopContext } from '../../Context/ShopContext'

const ProductDisplay = (props) => {
    const {product} = props;

    const {addToCart} = useContext(ShopContext);

  return (
    <div className='productdisplay'>
      <div className='productdisplay-left'>
        <div className='productdisplay-img-list'>
            <img src={product.image} alt=''/>
            <img src={product.image} alt=''/>
            <img src={product.image} alt=''/>
            <img src={product.image} alt=''/>
        </div>
        <div className='productdisplay-img'>
            <img className='productdisplay-main-img' src={product.image} alt=''/>
        </div>
      </div>
      <div className='productdisplay-right'>
        <h1>{product.name}</h1>
        <div className='productdisplay-right-stars'>
            <img src={star_icon} alt=''/>
            <img src={star_icon} alt=''/>
            <img src={star_icon} alt=''/>
            <img src={star_icon} alt=''/>
            <img src={star_dull_icon} alt=''/>
            <p>(122)</p>
        </div>
        <div className='productdisplay-right-prices'>
            <div className='productdisplay-right-price-old'>
                <span>&#8377;</span> {product.old_price}
            </div>
            <div className='productdisplay-right-price-new'>
            <span>&#8377;</span> {product.new_price}
            </div>
        </div>
        <div className='productdisplay-right-description'>
        Let your attitude have the edge with flame-like caging that adds heat to the streets while airy mesh keeps you cool. The Air Max Plus gives you a tuned Nike Air experience that offers premium stability and unbelievable cushioning.
        </div>
        <div className='productdisplay-right-size'>
            <h1>Select Size</h1>
            <div className='productdisplay-right-sizes'>
                <div>8</div>
                <div>9</div>
                <div>9.5</div>
                <div>10</div>
                <div>10.5</div>
                <div>11</div>
                <div>11.5</div>
                <div>12</div>
            </div>
        </div>
        <button onClick={()=>(addToCart(product.id))}>Add to Bag</button>
        <p className='productdisplay-right-category'><span>Category :Men</span> </p>
        <p className='productdisplay-right-category'><span>Tags :Modern, Latest</span> </p>
      </div>
    </div>
  )
}

export default ProductDisplay
