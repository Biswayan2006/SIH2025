import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logo from '../assets/image.png';

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
        <svg className="splash-svg" viewBox="0 0 300 150">
          {/* Route line */}
          <path
            className="route-line"
            d="M20,100 C100,20 200,130 280,50"
            fill="none"
            stroke="#4CAF50"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Bus icon */}
          <g className="bus-icon">
            <path d="M-15,-10 L15,-10 L15,10 L-15,10 Z" fill="#2196F3" />
            <circle cx="-10" cy="12" r="3" fill="#fff" />
            <circle cx="10" cy="12" r="3" fill="#fff" />
          </g>

          {/* Map pin marker */}
          <path
            className="map-pin"
            d="M280,50 A20,20 0 1,1 280,49.9 Z"
            fill="#FF5722"
          />
        </svg>

        {/* Logo */}
        <img src={logo} alt="TransitTrack Logo" className="splash-logo" />
      </div>
    </div>
  );
};

export default SplashScreen;