import React, { useState } from 'react'
import './Login.css'
import { setCookie } from '../../utils/cookies'

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const login = async () => {
    const API_URL = import.meta.env.VITE_API_URL;
    
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setCookie('auth-token', data.access)
        setIsLoggedIn(true)
        alert('Login Successful')
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      alert('Login failed')
    }
  }

  return (
    <div className='login'>
      <div className='login-container'>
        <h1>Admin Login</h1>
        <div className='login-fields'>
          <input
            name='email'
            value={formData.email}
            onChange={changeHandler}
            type='email'
            placeholder='Email'
          />
          <input
            name='password'
            value={formData.password}
            onChange={changeHandler}
            type='password'
            placeholder='Password'
          />
        </div>
        <button onClick={login}>Login</button>
      </div>
    </div>
  )
}

export default Login