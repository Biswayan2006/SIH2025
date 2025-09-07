import React from 'react';
import './BusOutline.css';

const BusOutline = ({ className = '' }) => {
  return (
    <div className={`bus-outline ${className}`}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        stroke="#4DB6AC"
        strokeWidth="2"
      >
        {/* Bus Body */}
        <path 
          d="M50,150 L50,70 L80,70 L80,50 L320,50 L350,70 L350,150 L50,150" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Windows */}
        <rect x="100" y="70" width="30" height="40" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="140" y="70" width="30" height="40" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="180" y="70" width="30" height="40" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="220" y="70" width="30" height="40" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Door */}
        <path d="M320,70 L320,150" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M320,70 C330,90 330,130 320,150" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Front window */}
        <path d="M80,70 L80,50" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Wheels */}
        <circle cx="100" cy="150" r="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="300" cy="150" r="20" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Road */}
        <line x1="20" y1="170" x2="380" y2="170" stroke="#4DB6AC" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default BusOutline;