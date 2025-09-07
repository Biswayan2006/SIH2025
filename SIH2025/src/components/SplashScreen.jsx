import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logo from '../assets/image.png';
import { motion } from 'framer-motion';
import BusOutline from './BusOutline';

const SplashScreen = ({ onFinished }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onFinished, 1000); // Corresponds to the fade-out duration
    }, 3000); // Total splash screen duration

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={`splash-screen ${isExiting ? 'fade-out' : ''}`}>
      <div className="splash-container">
        <div className="animation-container">
          {/* Green path line */}
          <svg className="splash-svg" viewBox="0 0 300 150">
            <path
              className="route-line"
              d="M20,100 C100,20 200,130 280,50"
              fill="none"
              stroke="#2ECC71"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Bus outline */}
          <div className="bus-container">
            <BusOutline className="bus-outline-animation" />
          </div>
          
          {/* Destination marker */}
          <div className="destination-marker">
            <svg width="30" height="30" viewBox="0 0 30 30">
              <circle cx="15" cy="15" r="12" fill="#ff5722" />
              <circle cx="15" cy="15" r="6" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* Logo */}
        <motion.img 
          src={logo} 
          alt="Transit Logo" 
          className="splash-logo" 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </div>
    </div>
  );
};

export default SplashScreen;