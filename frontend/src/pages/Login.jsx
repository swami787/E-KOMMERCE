import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { toast } from 'react-toastify';
import axios from 'axios';
import { auth, googleProvider } from '../../utils/Firebase';
import { authDataContext } from "../context/AuthContext";
import { signInWithPopup } from 'firebase/auth';
import { userDataContext } from '../context/UserContext';
import Loading from '../component/Loading';
import Logo from "../assets/logo.png";
import google from '../assets/google.png';

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Separate loading for Google
  
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      let result = await axios.post(
        serverUrl + '/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      setLoading(false);
      getCurrentUser();
      navigate("/");
      toast.success("User Login Successful");
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // Fixed Google login function
  const googlelogin = async () => {
    try {
      setGoogleLoading(true);
      const response = await signInWithPopup(auth, googleProvider);
      const user = response.user;
      
      // Add googleId to the request
      const result = await axios.post(
        serverUrl + "/api/auth/googlelogin",
        { 
          name: user.displayName, 
          email: user.email,
          googleId: user.uid  // Crucial: Add googleId
        },
        { withCredentials: true }
      );
      
      toast.success("Google login successful");
      getCurrentUser();
      setGoogleLoading(false);
      navigate("/");
    } catch (error) {
      setGoogleLoading(false);
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] flex flex-col items-center justify-start'>
      {/* Header */}
      <div className='w-[100%] h-[80px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
        <img className='w-[40px]' src={Logo} alt="" />
        <h1 className='text-[22px] font-sans '>OneCart</h1>
      </div>

      {/* Title */}
      <div className='w-[100%] h-[100px] flex items-center justify-center flex-col gap-[10px]'>
        <span className='text-[25px] font-semibold'>Login Page</span>
        <span className='text-[16px]'>Welcome to OneCart, Place your order</span>
      </div>
      
      {/* Login Form */}
      <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border-[1px] border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center '>
        <form onSubmit={handleLogin} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]'>
          {/* Google Login Button */}
          <div 
            className='w-[90%] h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer'
            onClick={googleLoading ? undefined : googlelogin}
          >
            {googleLoading ? (
              <Loading />
            ) : (
              <>
                <img src={google} alt="" className='w-[20px]'/> 
                Login account with Google
              </>
            )}
          </div>
          
          <div className='w-[100%] h-[20px] flex items-center justify-center gap-[10px]'>
            <div className='w-[40%] h-[1px] bg-[#96969635]'></div> 
            OR 
            <div className='w-[40%] h-[1px] bg-[#96969635]'></div>
          </div>
          
          <div className='w-[90%] h-[400px] flex flex-col items-center justify-center gap-[15px]  relative'>
            <input 
              type="text" 
              className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold'
              placeholder='Email' 
              required 
              onChange={(e) => setEmail(e.target.value)} 
              value={email}
            />
            
            <div className='relative w-full'>
              <input 
                type={show ? "text" : "password"}
                className='w-[100%] h-[50px] border-[2px] border-[#96969635] backdrop:blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#ffffffc7] px-[20px] font-semibold'
                placeholder='Password' 
                required 
                onChange={(e) => setPassword(e.target.value)} 
                value={password}
              />
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                {show ? (
                  <IoEye 
                    className='w-5 h-5 cursor-pointer' 
                    onClick={() => setShow(false)}
                  />
                ) : (
                  <IoEyeOutline 
                    className='w-5 h-5 cursor-pointer' 
                    onClick={() => setShow(true)}
                  />
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className='w-[100%] h-[50px] bg-[#6060f5] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold'
              disabled={loading}
            >
              {loading ? <Loading /> : "Login"}
            </button>
            
            <p className='flex gap-[10px]'>
              You haven't any account? 
              <span 
                className='text-[#5555f6cf] text-[17px] font-semibold cursor-pointer'
                onClick={() => navigate("/signup")}
              >
                Create New Account
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;