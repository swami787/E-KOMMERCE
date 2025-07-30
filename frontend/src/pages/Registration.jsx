import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from 'axios';
import { auth, googleProvider } from '../../utils/Firebase';
import { authDataContext } from '../context/AuthContext.jsx';
import { signInWithPopup } from 'firebase/auth'
import { userDataContext } from '../context/UserContext.jsx';
import Loading from '../component/Loading';
import Logo from "../assets/logo.png";
import googleIcon from '../assets/google.png';

function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const validateForm = () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain at least one uppercase letter");
      return false;
    }
    
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain at least one number");
      return false;
    }
    
    if (!/[!@#$%^&*]/.test(password)) {
      toast.error("Password must contain at least one special character");
      return false;
    }
    
    return true;
  };

  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/registration`,
        { name, email, password },
        { withCredentials: true }
      );
      
      toast.success(result.data.message);
      setLoading(false);
      navigate("/verify-email-notice");
    } catch (error) {
      setLoading(false);
      if (error.response) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const googleSignup = async () => {
    try {
      // Use the pre-configured googleProvider
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const response = await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        {
          name: user.displayName,
          email: user.email,
          googleId: user.uid
        },
        { withCredentials: true }
      );
      
      getCurrentUser();
      navigate("/");
      toast.success("Google login successful");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
      {/* Header */}
      <div className='w-full h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
        <img className='w-[40px]' src={Logo} alt="Logo" />
        <h1 className='text-[22px] font-sans'>OneCart</h1>
      </div>

      {/* Title */}
      <div className='w-full h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[25px] font-semibold'>Registration Page</span>
        <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
      </div>

      {/* Form */}
      <div className='max-w-[600px] w-[90%] h-auto bg-[#00000025] border border-[#96969635] backdrop-blur rounded-lg shadow-lg flex items-center justify-center py-8'>
        <form onSubmit={handleSignup} className='w-[90%] flex flex-col items-center gap-6'>
          <div 
            className='w-full h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-3 py-5 cursor-pointer'
            onClick={googleSignup}
          >
            <img src={googleIcon} alt="Google" className='w-[20px]' /> 
            Registration with Google
          </div>
          
          <div className='w-full h-5 flex items-center justify-center gap-3'>
            <div className='w-[40%] h-px bg-[#96969635]'></div>
            OR
            <div className='w-[40%] h-px bg-[#96969635]'></div>
          </div>
          
          <div className='w-full flex flex-col gap-5 relative'>
            <input 
              type="text" 
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-[#ffffffc7] px-5 font-semibold'
              placeholder='Full Name' 
              required 
              onChange={(e) => setName(e.target.value)} 
              value={name}
            />
            
            <input 
              type="email" 
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-[#ffffffc7] px-5 font-semibold'
              placeholder='Email' 
              required 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
            
            <div className='relative'>
              <input 
                type={showPassword ? "text" : "password"}
                className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-[#ffffffc7] px-5 font-semibold'
                placeholder='Password' 
                required 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
              />
              {showPassword ? 
                <IoEye 
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer' 
                  onClick={() => setShowPassword(false)} 
                /> : 
                <IoEyeOutline 
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer' 
                  onClick={() => setShowPassword(true)} 
                />
              }
            </div>
            
            <div className='relative'>
              <input 
                type={showConfirm ? "text" : "password"}
                className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent placeholder-[#ffffffc7] px-5 font-semibold'
                placeholder='Confirm Password' 
                required 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                value={confirmPassword}
              />
              {showConfirm ? 
                <IoEye 
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer' 
                  onClick={() => setShowConfirm(false)} 
                /> : 
                <IoEyeOutline 
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer' 
                  onClick={() => setShowConfirm(true)} 
                />
              }
            </div>
            
            <button 
              type="submit" 
              className='w-full h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-4 text-lg font-semibold'
              disabled={loading}
            >
              {loading ? <Loading /> : "Create Account"}
            </button>
            
            <p className='flex gap-2 justify-center'>
              Already have an account? 
              <span 
                className='text-[#5555f6cf] font-semibold cursor-pointer'
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;