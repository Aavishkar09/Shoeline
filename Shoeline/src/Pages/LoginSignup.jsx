import React, { useState } from 'react'


import './css/LoginSignup.css'
const LoginSignup = () => {
  
  const [state,setState] = useState("Login");
  const [emailSent, setEmailSent] = useState(false);
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const changeHandler = (e)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const login = async () => {
    console.log("Login Function executed",formData)
    const response = await fetch(`${import.meta.env.VITE_DJANGO_API_URL}/api/user-login/`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    });
    const data = await response.json();
    if(data.access){
      localStorage.setItem('auth-token',data.access);
      window.location.replace("/");
    }
    else{
      alert(data.detail || 'Login failed')
    }

  }

  const signup = async ()=>{
    console.log("SignUp Function executed",formData)
    const response = await fetch(`${import.meta.env.VITE_DJANGO_API_URL}/api/send-verification-email/`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body: JSON.stringify({ email: formData.email }),
    });
    const data = await response.json();
    if(data.success){
      setEmailSent(true);
    }
    else{
      alert(data.error || 'Failed to send verification email')
    }
  } 
  
  if (emailSent) {
    return (
      <div className='loginsignup'>
        <div className='loginsignup-container'>
          <h1>Check Your Email</h1>
          <p>We've sent a verification link to {formData.email}</p>
          <p>Please check your email and click the link to complete registration.</p>
          <button onClick={() => { setEmailSent(false); setState("Login"); }}>Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    
    <div className='loginsignup'>
      <div className='loginsignup-container'>
        <h1>{state}</h1>
        <div className='loginsignup-fields'>
          <input name='email' value={formData.email} onChange={changeHandler} type='email' placeholder='Email-Id'/>
          {state==="Login"?<input name='password' value={formData.password} onChange={changeHandler} type='password' placeholder='Password'/>:<></>}
        </div>
          <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
          {state==="Sign Up"?
          <p className='loginsignup-login'>Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
          :<p className='loginsignup-login'>Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
          
          
          <div className='loginsignup-agree'>
            <input type='checkbox' name='' id=''/>
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>
      </div>
      
    </div>
  )
}

export default LoginSignup
