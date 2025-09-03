import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const SignUp = () => {
  const { translate } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  // CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
      @keyframes drive {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100vw); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  // Track mouse globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Car animation component
  const CarAnimation = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sunset sky background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff9e7d] via-[#ff7b54] to-[#5e2e7a]">
          {/* Stars appearing as it gets darker */}
          {[...Array(50)].map((_, i) => {
            const size = Math.random() * 2 + 1;
            const animationDuration = Math.random() * 3 + 2;
            return (
              <div 
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${Math.random() * 40}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `twinkle ${animationDuration}s infinite ease-in-out`
                }}
              />
            );
          })}
        </div>
        
        {/* Sun/Moon */}
        <div className="absolute top-[15%] right-[15%] w-[100px] h-[100px] rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/50" />
        
        {/* Highway */}
        <div className="absolute bottom-0 w-full h-[30%] bg-[#1a1a1a]">
          {/* Road markings */}
          <div className="absolute top-0 w-full h-[10px] bg-[#444]" />
          <div className="absolute top-1/2 w-full h-[10px] flex">
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={i}
                className="h-full w-[50px] bg-yellow-400 mx-[50px]"
                initial={{ x: "100vw" }}
                animate={{ x: "-100vw" }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "linear",
                  delay: i * 0.2 % 2
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Moving Cars */}
        {[...Array(3)].map((_, i) => {
          const lane = i % 3;
          const speed = 8 + (lane * 2);
          const delay = i * 2;
          const carColors = ['#4361ee', '#3a0ca3', '#4cc9f0'];
          
          return (
            <motion.div 
              key={i}
              className="absolute h-[40px] w-[80px]"
              style={{
                bottom: `${10 + (lane * 5)}%`,
                zIndex: 10 - lane
              }}
              initial={{ x: "-100px" }}
              animate={{ x: "calc(100vw + 50px)" }}
              transition={{ 
                duration: speed, 
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
                delay: delay
              }}
            >
              {/* Car body */}
              <div className="relative h-full w-full">
                <div 
                  className="absolute bottom-0 h-[20px] w-full rounded-t-lg rounded-b-sm shadow-lg"
                  style={{ backgroundColor: carColors[lane % carColors.length] }}
                />
                <div className="absolute bottom-[20px] h-[15px] w-[60px] left-[10px] bg-[#111] rounded-t-lg" />
                
                {/* Windows */}
                <div className="absolute bottom-[22px] left-[15px] right-[15px] h-[10px] flex space-x-2">
                  <div className="flex-1 bg-[#4cc9f0] rounded-sm opacity-70" />
                  <div className="flex-1 bg-[#4cc9f0] rounded-sm opacity-70" />
                </div>
                
                {/* Wheels */}
                <div className="absolute bottom-[-5px] left-[15px] h-[10px] w-[10px] bg-[#333] rounded-full border-2 border-gray-400" />
                <div className="absolute bottom-[-5px] right-[15px] h-[10px] w-[10px] bg-[#333] rounded-full border-2 border-gray-400" />
                
                {/* Lights */}
                <div className="absolute bottom-[5px] right-0 h-[5px] w-[3px] bg-red-500" />
                <div className="absolute bottom-[5px] left-0 h-[5px] w-[3px] bg-yellow-300" />
              </div>
            </motion.div>
          );
        })}
        
        {/* Mountain Silhouettes */}
        <div className="absolute bottom-[30%] w-full">
          <svg viewBox="0 0 1440 320" className="w-full">
            <path 
              fill="#2b2d42" 
              fillOpacity="0.8"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,202.7C672,203,768,181,864,181.3C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Transportation Background */}
      <CarAnimation />
      
      {/* Interactive cursor effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(76,201,240,0.15), transparent 30%)`,
        }}
      />
      
      {/* Signup Card */}
      <div className="w-full max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`w-full max-w-md space-y-6 ${darkMode ? 'bg-[#1a1a3a]/80' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-8 border ${darkMode ? 'border-[#4361ee]/30' : 'border-gray-200'} shadow-xl`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4361ee] to-[#4cc9f0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🚗</span>
            </div>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {translate('joinTransitConnect')}
            </h2>
            <p className={`${darkMode ? 'text-[#4cc9f0]' : 'text-gray-600'} mt-2`}>
              {translate('alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className={`font-medium ${darkMode ? 'text-[#90e0ef] hover:text-white' : 'text-blue-600 hover:text-blue-800'} focus:outline-none focus:underline transition duration-150 ease-in-out`}
              >
                {translate('signIn')}
              </button>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className={`block text-sm ${darkMode ? 'text-[#90e0ef]' : 'text-gray-600'} mb-1`}>
                  {translate('fullName')}
                </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4cc9f0]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className={`w-full pl-10 px-3 py-2 ${darkMode ? 'bg-[#1a1a3a]/50 border-[#4361ee]/30 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
                <label htmlFor="email" className={`block text-sm ${darkMode ? 'text-[#90e0ef]' : 'text-gray-600'} mb-1`}>
                    {translate('emailAddress')}
                  </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4cc9f0]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`w-full pl-10 px-3 py-2 ${darkMode ? 'bg-[#1a1a3a]/50 border-[#4361ee]/30 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
            </div>

            <div>
              <label htmlFor="phone" className={`block text-sm ${darkMode ? 'text-[#90e0ef]' : 'text-gray-600'} mb-1`}>
                {translate('phoneNumber')}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className={`w-full px-3 py-2 ${darkMode ? 'bg-[#1F1F1F] border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-[#90e0ef] mb-1">
                {translate('password')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4cc9f0]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 px-3 py-2 bg-[#1a1a3a]/50 border border-[#4361ee]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-[#90e0ef] mb-1">
                {translate('confirmPassword')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#4cc9f0]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 px-3 py-2 bg-[#1a1a3a]/50 border border-[#4361ee]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4cc9f0]"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-red-400">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-[#4361ee] focus:ring-[#4cc9f0] border-[#4361ee]/30 bg-[#1a1a3a]/50 rounded"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-[#90e0ef]">
                    {translate('agreeToTerms')}{' '}
                    <a href="#" className="text-[#4cc9f0] hover:text-white underline">
                      {translate('termsOfService')}
                    </a>{' '}
                    {translate('and')}{' '}
                    <a href="#" className="text-[#4cc9f0] hover:text-white underline">
                      {translate('privacyPolicy')}
                    </a>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-[#4361ee] to-[#4cc9f0] hover:from-[#3a56d4] hover:to-[#43b4d9] focus:outline-none focus:ring-2 focus:ring-[#4cc9f0] transform transition-all duration-150 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {translate('processing')}
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  {translate('signUp')}
                </span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;