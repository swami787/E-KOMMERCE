import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Move SVGs outside the component to prevent redefinition on every render
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const HomeIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CollectionIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ContactIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

function Nav() {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('authToken');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    return loggedIn;
  }, []);

  // Fetch cart items from API
  const fetchCartItems = useCallback(async () => {
    try {
      const isAuthenticated = checkAuthStatus();
      
      if (!isAuthenticated) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        const count = guestCart.reduce((total, item) => total + (item.quantity || 0), 0);
        setCartCount(count);
        return;
      }
      
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/cart/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = data.items.reduce((total, item) => total + (item.quantity || 0), 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      setCartCount(0);
    }
  }, [checkAuthStatus]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } finally {
      localStorage.removeItem('authToken');
      setIsLoggedIn(false);
      setShowProfile(false);
      fetchCartItems();
      navigate('/login');
    }
  }, [navigate, fetchCartItems]);

  // Handle search
  const handleSearch = useCallback(() => {
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setShowSearch(false);
      setSearch('');
    }
  }, [navigate, search]);

  // Initialize component
  useEffect(() => {
    checkAuthStatus();
    fetchCartItems();
    
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'guestCart') {
        checkAuthStatus();
        fetchCartItems();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus, fetchCartItems]);

  // Create navigation items with active state
  const navItems = useMemo(() => [
    { name: 'Home', path: '/', icon: <HomeIcon className={location.pathname === '/' ? "text-cyan-300" : "text-white"} /> },
    { name: 'Collections', path: '/collections', icon: <CollectionIcon className={location.pathname === '/collection' ? "text-cyan-300" : "text-white"} /> },
    { name: 'Contact', path: '/contact', icon: <ContactIcon className={location.pathname === '/contact' ? "text-cyan-300" : "text-white"} /> },
  ], [location.pathname]);

  return (
    <div className="w-full fixed top-0 z-50">
      {/* Top Navigation */}
      <div className="w-full h-[70px] bg-gradient-to-r from-cyan-50 to-teal-50 flex items-center justify-between px-4 sm:px-8 shadow-md">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-r from-cyan-600 to-teal-600 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent">Zenuxs Store</h1>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6">
          {['Home', 'Collections', 'About', 'Contact'].map((item) => (
            <button
              key={item}
              className={`px-4 py-2 rounded-full hover:bg-teal-700 transition-colors duration-300 font-medium ${
                location.pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`)
                  ? 'bg-teal-700 text-white'
                  : 'bg-cyan-800 text-white'
              }`}
              onClick={() => navigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-5">
          {/* Search Icon */}
          <button 
            className="hover:scale-110 transition-transform"
            onClick={() => setShowSearch(!showSearch)}
          >
            <SearchIcon />
          </button>
          
          {/* User Icon */}
          <div className="relative">
            <button 
              className="hover:scale-110 transition-transform"
              onClick={() => {
                checkAuthStatus();
                setShowProfile(!showProfile);
              }}
            >
              <UserIcon />
            </button>
            
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10">
                {isLoggedIn ? (
                  <>
                    <button 
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-cyan-50 font-medium"
                      onClick={() => { navigate('/profile'); setShowProfile(false); }}
                    >
                      My Profile
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-cyan-50 font-medium"
                      onClick={() => { navigate('/orders'); setShowProfile(false); }}
                    >
                      My Orders
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-cyan-50 font-medium"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-cyan-50 font-medium"
                      onClick={() => { navigate('/login'); setShowProfile(false); }}
                    >
                      Log In
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-cyan-50 font-medium"
                      onClick={() => { navigate('/signup'); setShowProfile(false); }}
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Cart Icon */}
          <div className="relative">
            <button 
              className="hover:scale-110 transition-transform"
              onClick={() => navigate('/cart')}
            >
              <CartIcon />
            </button>
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="w-full bg-gradient-to-r from-cyan-100 to-teal-100 py-4 flex justify-center shadow-md">
          <div className="w-full max-w-2xl px-4 flex items-center">
            <input
              type="text"
              className="w-full h-12 px-6 rounded-l-full bg-white border-2 border-cyan-300 focus:border-cyan-500 focus:outline-none shadow-md"
              placeholder="Search for products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="h-12 px-6 bg-cyan-600 text-white rounded-r-full hover:bg-cyan-700 transition-colors font-medium shadow-md"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="w-full h-16 bg-gradient-to-r from-cyan-800 to-teal-800 fixed bottom-0 left-0 flex justify-around items-center md:hidden z-50 px-4">
        {navItems.map((item) => (
          <button 
            key={item.name}
            className="flex flex-col items-center text-white"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
        
        <button 
          className="flex flex-col items-center text-white relative"
          onClick={() => navigate('/cart')}
        >
          <CartIcon />
          <span className="text-xs mt-1">Cart</span>
          {cartCount > 0 && (
            <div className="absolute -top-1 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {cartCount}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export default Nav;