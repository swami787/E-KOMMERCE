import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import Logo from "../assets/logo.png";

function VerifyEmailNotice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className='w-full flex items-center justify-start px-4 absolute top-5 left-0 gap-3 cursor-pointer' onClick={() => navigate("/")}>
        <img className='w-10' src={Logo} alt="Logo" />
        <h1 className='text-2xl font-sans'>OneCart</h1>
      </div>
      
      {/* Content */}
      <div className="max-w-md w-full bg-[#00000025] border border-[#96969635] backdrop-blur rounded-xl shadow-2xl p-8 flex flex-col items-center">
        <FaEnvelope className="text-blue-500 text-6xl mb-6 animate-pulse" />
        <h1 className="text-3xl font-bold text-center mb-4">Verify Your Email</h1>
        
        <div className="text-center mb-6">
          <p className="mb-3">
            We've sent a verification link to your email address. 
          </p>
          <p className="font-medium">
            Please check your inbox and click the link to activate your account.
          </p>
        </div>
        
        <div className="flex items-start bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-6 w-full">
          <FaCheckCircle className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm">
              <span className="block mb-1">If you don't see the email:</span>
              <span className="block">1. Check your spam/junk folder</span>
              <span className="block">2. Wait 5-10 minutes for delivery</span>
              <span className="block">3. Make sure you entered the correct email</span>
            </p>
          </div>
        </div>
        
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-[#6060f5] rounded-lg font-semibold hover:bg-[#4a4af0] transition flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Return to Home
          </button>
          
          <p className="text-center text-sm mt-4">
            Already verified? 
            <Link to="/login" className="text-blue-400 font-medium ml-2">
              Sign in to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailNotice;