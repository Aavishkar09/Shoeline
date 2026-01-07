import React, { useContext, useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'; 

import './Navbar.css'
import logo from '../../../src/assets/logo.jpg'
import cart from '../../../src/assets/cart.png'
import { ShopContext } from '../../Context/ShopContext';
import nav_dropdown from '../../assets/drop_icon.png' 

const Navbar = () => {

    const [menu,setMenu]= useState("shop");
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setMenu('shop');
        else if (path === '/mens') setMenu('mens');
        else if (path === '/womens') setMenu('womens');
        else if (path === '/kids') setMenu('kids');
    }, [location]);

    const dropdown_toggle = (e) =>{
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt="" className='logo-img'/>
            <p>Shoeline</p>
        </div>
        <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt=''/>
        <ul ref={menuRef} className='nav-menu'>
            <li onClick={()=>{setMenu("shop")}}><Link  to='/'>Shop</Link>{menu==="shop"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("mens")}}><Link style={{textDecoration:'none'}} to='/mens'>Mens</Link>{menu==="mens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("womens")}}><Link style={{textDecoration:'none'}} to='/womens'>Womens</Link>{menu==="womens"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none'}} to='/kids'>Kids</Link>{menu==="kids"?<hr/>:<></>}</li>
        </ul>
        <div className='nav-login'>
            {localStorage.getItem('auth-token')
            ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>:<Link to='/login'><button className='button'>Login</button></Link>}
            
            
        </div>
        <div className='cart'>
        <Link to='/cart'><img className='cart-img' alt="" src={cart}/></Link>
        <div className='nav-cart-count'>{getTotalCartItems()}</div>
        </div>
      
    </div>
  )
}

export default Navbar
