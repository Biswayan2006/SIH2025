import React from 'react';
import { useLocation } from 'react-router-dom';
// Use JPEG images instead of SVG
const loginBg = '/src/assets/login_bg.jpeg';
const signupBg = '/src/assets/signup_bg.jpeg';

const AuthBackground = ({ darkMode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {isLoginPage && (
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'}`}>
          <img 
            src={loginBg} 
            alt="" 
            className="w-full h-full opacity-30" 
            style={{ 
              imageRendering: 'high-quality', 
              objectFit: 'cover',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          />
        </div>
      )}
      {isSignupPage && (
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'}`}>
          <div className="absolute inset-0 flex">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-end">
              <img 
                src={signupBg} 
                alt="" 
                className="h-full opacity-30" 
                style={{ 
                  imageRendering: 'high-quality', 
                  objectFit: 'cover',
                  width: '90%'
                }}
              />
            </div>
          </div>
        </div>
      )}
      {!isLoginPage && !isSignupPage && (
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'}`} />
      )}
    </div>
  );
};

export default AuthBackground;