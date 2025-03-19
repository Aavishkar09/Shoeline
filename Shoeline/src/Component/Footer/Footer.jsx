import React from 'react'
import './Footer.css'
import footer_logo from '../../../src/assets/logo.jpg'
import instagram_icon from '../../../src/assets/instagram_icon.png'
import whatsapp_icon from '../../../src/assets/whatsapp_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-logo'>
        <img src={footer_logo} alt=""/>
        <p>Shoeline</p>
      </div>
      <ul className='footer-links'>
        <li>Company</li>
        <li>Prducts</li>
        <li>Office</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className='footer-social-icon'>
        <div className='footer-icons-conatiner'>
            <img src={instagram_icon} alt=''/>
        </div>
        <div className='footer-icons-conatiner'>
            <img src={whatsapp_icon} alt=''/>
        </div>
      </div>
      <div className='footer-copyright'>
        <hr/>
        <p>Copyright @ 2024 - All Rights Reserved.</p>
      </div>
    </div>
  
)}

export default Footer
