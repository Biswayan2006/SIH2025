import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import smoothRideGif from '../assets/Smooth ride.gif';

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
        {/* Smooth ride GIF */}
        <img 
          src={smoothRideGif} 
          alt="Smooth Ride Animation" 
          className="smooth-ride-gif" 
        />
      </div>
    </div>
  );
};

export default SplashScreen;