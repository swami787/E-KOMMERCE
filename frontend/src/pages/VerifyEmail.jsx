import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Logo from "../assets/logo.png";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token');
        return;
      }

      try {
        // Use environment variable for server URL
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
        const response = await axios.get(`${serverUrl}/api/auth/verify-email?token=${token}`);
        
        setStatus('success');
        setMessage(response.data.message);
        toast.success('Email verified successfully!');
        
        // Start countdown to redirect
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              navigate('/login');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
        toast.error('Email verification failed');
      }
    };

    verifyEmailToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className='w-full flex items-center justify-start px-4 absolute top-5 left-0 gap-3 cursor-pointer' onClick={() => navigate("/")}>
        <img className='w-10' src={Logo} alt="Logo" />
        <h1 className='text-2xl font-sans'>OneCart</h1>
      </div>
      
      {/* Verification Status */}
      <div className="max-w-md w-full bg-[#00000025] border border-[#96969635] backdrop-blur rounded-xl shadow-2xl p-8 flex flex-col items-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <FaSpinner className="text-blue-500 text-6xl mb-6 animate-spin" />
            <h1 className="text-3xl font-bold text-center mb-4">Verifying Your Email</h1>
            <p className="text-center">Please wait while we verify your account...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-green-500 text-6xl mb-6" />
            <h1 className="text-3xl font-bold text-center mb-2">Email Verified!</h1>
            <p className="text-center mb-6 text-green-200">{message}</p>
            
            <div className="w-full bg-green-900 bg-opacity-30 rounded-lg p-4 mb-6">
              <p className="text-center">
                You can now log in to your account
              </p>
            </div>
            
            <p className="text-center mb-6">
              Redirecting to login in <span className="text-blue-400 font-bold">{countdown}</span> seconds...
            </p>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-[#6060f5] rounded-lg font-semibold hover:bg-[#4a4af0] transition"
            >
              Go to Login Now
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="text-red-500 text-6xl mb-6" />
            <h1 className="text-3xl font-bold text-center mb-2">Verification Failed</h1>
            <p className="text-center mb-6 text-red-300">{message}</p>
            
            <div className="w-full bg-red-900 bg-opacity-30 rounded-lg p-4 mb-6">
              <p className="text-center">
                Possible reasons:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm">
                <li>Verification link expired</li>
                <li>Invalid verification token</li>
                <li>Account already verified</li>
              </ul>
            </div>
            
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => navigate('/registration')}
                className="w-full py-3 bg-[#6060f5] rounded-lg font-semibold hover:bg-[#4a4af0] transition"
              >
                Register Again
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 border border-gray-500 rounded-lg font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
              >
                <FaArrowLeft /> Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;