import React from 'react'
import './Hero.css'
import arrow_icon from '../../../src/assets/arrow.png'

import hero_image from '../../../src/assets/hero_1.png'

const Hero = () => {
  return (
    <div className='hero'>
        <div className='hero-left'>
            <h2>New Arrivals</h2>
            <div>
                <p>new</p>
                <p>collection</p>
                <p>for everyone</p>
            </div>
            <div className='hero-latest-btn'>
                <div>Latest Collection</div>
                <img  src={arrow_icon} alt=''/>
            </div>
        </div>

        <div className='hero-right'>
            <img src={hero_image} alt='' />
        </div>
      
    </div>
  )
}

export default Hero
