import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo.jpg'
import navProfile from '../../assets/nav-profile.svg'
import { deleteCookie } from '../../utils/cookies'

const Navbar = ({ setIsLoggedIn }) => {
  const logout = () => {
    deleteCookie('auth-token')
    setIsLoggedIn(false)
  }

  return (
    <div className='navbar'>
        <img src={navlogo} alt="" className="nav-logo" />
        <p>Shoeline</p>
        <div className='nav-right'>
          <img src={navProfile} alt="" className='nav-profile'/>
          <button onClick={logout} className='logout-btn'>Logout</button>
        </div>
    </div>
  )
}

export default Navbar
