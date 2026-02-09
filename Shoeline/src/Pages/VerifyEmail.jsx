import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './css/LoginSignup.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [email, setEmail] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`${import.meta.env.VITE_DJANGO_API_URL}/api/verify-email/?token=${token}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setEmail(data.email);
          setStatus('verified');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const completeRegistration = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_DJANGO_API_URL}/api/complete-registration/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        username: formData.username,
        password: formData.password
      }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('auth-token', data.token);
      window.location.replace('/');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  if (status === 'verifying') {
    return (
      <div className='loginsignup'>
        <div className='loginsignup-container'>
          <h1>Verifying Email...</h1>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='loginsignup'>
        <div className='loginsignup-container'>
          <h1>Verification Failed</h1>
          <p>Invalid or expired verification link</p>
          <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className='loginsignup'>
      <div className='loginsignup-container'>
        <h1>Complete Registration</h1>
        <p>Email: {email}</p>
        <div className='loginsignup-fields'>
          <input
            name='username'
            value={formData.username}
            onChange={changeHandler}
            type='text'
            placeholder='Username'
          />
          <input
            name='password'
            value={formData.password}
            onChange={changeHandler}
            type='password'
            placeholder='Password'
          />
          <input
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={changeHandler}
            type='password'
            placeholder='Confirm Password'
          />
        </div>
        <button onClick={completeRegistration}>Complete Registration</button>
      </div>
    </div>
  );
};

export default VerifyEmail;
