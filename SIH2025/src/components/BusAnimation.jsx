import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const BusAnimation = ({ className = '', size = 'md' }) => {
  const { darkMode } = useTheme();
  const [isMoving, setIsMoving] = useState(false);
  
  // Size multipliers based on the size prop
  const sizeMultipliers = {
    sm: 0.8,
    md: 1,
    lg: 1.5,
    xl: 2
  };
  
  const multiplier = sizeMultipliers[size] || 1;
  
  // Start animation after component mounts
  useEffect(() => {
    setIsMoving(true);
    
    return () => setIsMoving(false);
  }, []);
  
  return (
    <div className={`bus-animation-container relative ${isMoving ? 'animate-float' : ''} ${className}`} style={{ width: `${32 * multiplier}px`, height: `${20 * multiplier}px` }}>
      {/* Bus body */}
      <div 
        className={`bus-body absolute rounded-md ${darkMode ? 'bg-blue-600' : 'bg-yellow-500'} bottom-2 left-0 animate-bus-move shadow-lg`}
        style={{ width: `${28 * multiplier}px`, height: `${12 * multiplier}px`, borderRadius: `${4 * multiplier}px` }}
      >
        {/* Bus roof */}
        <div 
          className={`absolute -top-1 left-0 right-0 ${darkMode ? 'bg-blue-700' : 'bg-yellow-600'} rounded-t-md`}
          style={{ height: `${2 * multiplier}px` }}
        ></div>
        {/* Windows */}
        <div className="windows flex justify-around absolute" style={{ top: `${2 * multiplier}px`, left: `${4 * multiplier}px`, right: `${4 * multiplier}px` }}>
          <div 
            className={`window rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'} ${darkMode ? 'shadow-inner shadow-blue-900/30' : 'shadow-inner shadow-yellow-900/20'}`}
            style={{ width: `${3 * multiplier}px`, height: `${3 * multiplier}px`, borderRadius: `${1 * multiplier}px` }}
          ></div>
          <div 
            className={`window rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'} ${darkMode ? 'shadow-inner shadow-blue-900/30' : 'shadow-inner shadow-yellow-900/20'}`}
            style={{ width: `${3 * multiplier}px`, height: `${3 * multiplier}px`, borderRadius: `${1 * multiplier}px` }}
          ></div>
          <div 
            className={`window rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'} ${darkMode ? 'shadow-inner shadow-blue-900/30' : 'shadow-inner shadow-yellow-900/20'}`}
            style={{ width: `${3 * multiplier}px`, height: `${3 * multiplier}px`, borderRadius: `${1 * multiplier}px` }}
          ></div>
        </div>
        
        {/* Headlights */}
        <div 
          className={`headlight absolute rounded-full ${darkMode ? 'bg-yellow-300' : 'bg-yellow-200'} animate-pulse-slow`}
          style={{ width: `${1.5 * multiplier}px`, height: `${1.5 * multiplier}px`, right: `${0 * multiplier}px`, bottom: `${2 * multiplier}px` }}
        ></div>
        <div 
          className={`headlight absolute rounded-full ${darkMode ? 'bg-yellow-300' : 'bg-yellow-200'} animate-pulse-slow`}
          style={{ width: `${1.5 * multiplier}px`, height: `${1.5 * multiplier}px`, right: `${0 * multiplier}px`, bottom: `${5 * multiplier}px` }}
        ></div>
        
        {/* Driver's window */}
        <div 
          className={`driver-window absolute rounded-sm ${darkMode ? 'bg-blue-200' : 'bg-blue-100'} ${darkMode ? 'shadow-inner shadow-blue-900/30' : 'shadow-inner shadow-yellow-900/20'}`}
          style={{ width: `${4 * multiplier}px`, height: `${4 * multiplier}px`, left: `${1 * multiplier}px`, top: `${2 * multiplier}px`, borderRadius: `${1 * multiplier}px` }}
        ></div>
        
        {/* Door */}
        <div 
          className={`door absolute ${darkMode ? 'bg-blue-700' : 'bg-yellow-600'} border-r ${darkMode ? 'border-blue-500' : 'border-yellow-400'}`}
          style={{ width: `${3 * multiplier}px`, height: `${6 * multiplier}px`, right: `${8 * multiplier}px`, bottom: `${0 * multiplier}px` }}
        ></div>
      </div>
      
      {/* Wheels */}
      <div className="wheels absolute bottom-0 flex justify-between" style={{ left: `${4 * multiplier}px`, right: `${4 * multiplier}px` }}>
        <div className="wheel-with-hub relative">
          <div 
            className={`wheel rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} border ${darkMode ? 'border-gray-600' : 'border-gray-500'} animate-wheel-spin shadow-md`}
            style={{ width: `${5 * multiplier}px`, height: `${5 * multiplier}px`, borderWidth: `${2 * multiplier}px` }}
          ></div>
          <div 
            className={`wheel-hub absolute rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}
            style={{ width: `${2 * multiplier}px`, height: `${2 * multiplier}px`, top: `${1.5 * multiplier}px`, left: `${1.5 * multiplier}px` }}
          ></div>
        </div>
        <div className="wheel-with-hub relative">
          <div 
            className={`wheel rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-700'} border ${darkMode ? 'border-gray-600' : 'border-gray-500'} animate-wheel-spin shadow-md`}
            style={{ width: `${5 * multiplier}px`, height: `${5 * multiplier}px`, borderWidth: `${2 * multiplier}px` }}
          ></div>
          <div 
            className={`wheel-hub absolute rounded-full ${darkMode ? 'bg-gray-500' : 'bg-gray-400'}`}
            style={{ width: `${2 * multiplier}px`, height: `${2 * multiplier}px`, top: `${1.5 * multiplier}px`, left: `${1.5 * multiplier}px` }}
          ></div>
        </div>
      </div>
      
      {/* Road with markings */}
      <div className="road-container absolute bottom-0 left-0 right-0" style={{ height: `${4 * multiplier}px` }}>
        <div className={`road absolute bottom-0 left-0 right-0 ${darkMode ? 'bg-gray-700' : 'bg-gray-500'}`} style={{ height: `${1 * multiplier}px` }}></div>
        <div className="road-markings flex absolute bottom-0" style={{ left: `-${10 * multiplier}px`, right: `${0}px` }}>
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`road-marking ${darkMode ? 'bg-gray-400' : 'bg-white'} mx-1 animate-road-marking`}
              style={{ 
                width: `${4 * multiplier}px`, 
                height: `${0.5 * multiplier}px`, 
                marginBottom: `${0.25 * multiplier}px`,
                animationDelay: `${i * 0.2}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Smoke */}
      <div className="smoke-container absolute" style={{ left: `-${2 * multiplier}px`, bottom: `${3 * multiplier}px` }}>
        <div 
          className={`smoke smoke-1 absolute rounded-full ${darkMode ? 'bg-gray-400/70' : 'bg-gray-300/70'} animate-smoke-1`}
          style={{ width: `${2 * multiplier}px`, height: `${2 * multiplier}px` }}
        ></div>
        <div 
          className={`smoke smoke-2 absolute rounded-full ${darkMode ? 'bg-gray-400/60' : 'bg-gray-300/60'} animate-smoke-2`}
          style={{ width: `${1.5 * multiplier}px`, height: `${1.5 * multiplier}px` }}
        ></div>
        <div 
          className={`smoke smoke-3 absolute rounded-full ${darkMode ? 'bg-gray-400/50' : 'bg-gray-300/50'} animate-smoke-3`}
          style={{ width: `${1 * multiplier}px`, height: `${1 * multiplier}px` }}
        ></div>
      </div>
      
      {/* Scenery elements */}
      {multiplier > 0.9 && (
        <div className="scenery absolute left-0 right-0" style={{ bottom: `${1 * multiplier}px` }}>
          <div 
            className={`tree absolute ${darkMode ? 'text-green-700' : 'text-green-600'} animate-scenery-move`}
            style={{ fontSize: `${8 * multiplier}px`, right: `-${50 * multiplier}px`, bottom: `${0}px`, animationDelay: '0s' }}
          >🌳</div>
          <div 
            className={`tree absolute ${darkMode ? 'text-green-700' : 'text-green-600'} animate-scenery-move`}
            style={{ fontSize: `${6 * multiplier}px`, right: `-${80 * multiplier}px`, bottom: `${0}px`, animationDelay: '1.5s' }}
          >🌲</div>
          <div 
            className={`tree absolute ${darkMode ? 'text-green-700' : 'text-green-600'} animate-scenery-move`}
            style={{ fontSize: `${7 * multiplier}px`, right: `-${120 * multiplier}px`, bottom: `${0}px`, animationDelay: '3s' }}
          >🌴</div>
        </div>
      )}
    </div>
  );
};

export default BusAnimation;