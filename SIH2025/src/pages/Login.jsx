import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useLoading } from '../context/LoadingContext';
import { useAuth } from '../context/AuthContext';
import BusAnimation from '../components/BusAnimation';
import AuthBackground from '../components/AuthBackground';

export default function Login() {
  const { translate } = useLanguage();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useLoading();
  const { login } = useAuth();
  
  // CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  
  // Check for error parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    
    if (errorParam) {
      let errorMessage = 'Authentication failed';
      
      // Map error codes to user-friendly messages
      switch(errorParam) {
        case 'authentication_failed':
          errorMessage = 'Google authentication failed. Please try again.';
          break;
        case 'server_error':
          errorMessage = 'Server error occurred during authentication.';
          break;
        case 'invalid_response':
          errorMessage = 'Invalid response from authentication server.';
          break;
        case 'missing_data':
          errorMessage = 'Missing authentication data.';
          break;
        case 'token_generation_failed':
          errorMessage = 'Failed to generate authentication token.';
          break;
        default:
          errorMessage = `Authentication error: ${errorParam}`;
      }
      
      setError(errorMessage);
      // Clear loading state
      setLoading(false);
    }
  }, [location.search, setLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:4001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Track mouse globally
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Google Login handler
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Redirect to backend Google OAuth endpoint
      window.location.href = 'http://localhost:4001/api/auth/google';
    } catch (error) {
      console.error('Google login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Transportation Background */}
      <BusAnimation />
      <AuthBackground darkMode={darkMode} />
      
      {/* Interactive cursor effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(76,201,240,0.15), transparent 30%)`,
        }}
      />

      {/* Login Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`w-full max-w-md relative rounded-2xl shadow-2xl overflow-hidden z-10`}
      >
        <div className={`relative ${darkMode ? 'bg-[#1a1a3a]/80' : 'bg-white/90'} backdrop-blur-lg rounded-2xl p-8 border ${darkMode ? 'border-[#4361ee]/30' : 'border-gray-200'}`}>
          {/* Icon + Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4361ee] to-[#4cc9f0] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🚌</span>
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{translate('welcomeBack')}</h1>
            <p className={`${darkMode ? 'text-[#4cc9f0]' : 'text-gray-600'} mt-2`}>{translate('loginToDashboard')}</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label className={`block text-sm font-medium ${darkMode ? 'text-[#4cc9f0]' : 'text-gray-600'} mb-2`}>
                {translate('emailAddress')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 ${darkMode ? 'bg-[#0f1642]/50 border-[#4361ee]/30 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-[#4cc9f0] focus:border-[#4cc9f0] transition-colors placeholder-[#8d99ae]`}
                placeholder="admin@transitconnect.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className={`block text-sm font-medium ${darkMode ? 'text-[#4cc9f0]' : 'text-gray-600'} mb-2`}>
                {translate('password')}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 ${darkMode ? 'bg-[#0f1642]/50 border-[#4361ee]/30 text-white' : 'bg-gray-50 border-gray-300 text-gray-800'} rounded-lg focus:ring-2 focus:ring-[#4cc9f0] focus:border-[#4cc9f0] transition-colors placeholder-[#8d99ae]`}
                placeholder="Enter your password"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AuthBackground darkMode={darkMode} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 relative z-20"
      >
        <div className={`${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-lg shadow-2xl rounded-xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/src/assets/image.png"
                alt="TransitTrack Logo"
                className="h-16 w-16 rounded-full border-2 border-cyan-500 shadow-lg"
              />
            </div>
            <h2 className={`text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {translate('loginToAccount')}
            </h2>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {translate('loginToDashboard')}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {translate('emailAddress')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400 text-gray-900'} rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {translate('password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-300 placeholder-gray-400 text-gray-900'} rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#4361ee] focus:ring-[#4cc9f0] border-[#4361ee]/30 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[#8d99ae]">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-[#4cc9f0] hover:text-[#4361ee] cursor-pointer">
                Forgot Password?
              </Link>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-[#4361ee] text-white rounded-lg font-medium hover:bg-[#3a0ca3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Boarding...
                  </>
                ) : (
                  <>🚌 {translate('login')}</>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className={`flex-1 px-6 py-3 ${darkMode ? 'bg-[#4cc9f0] text-[#0f1642]' : 'bg-blue-400 text-white'} rounded-lg font-medium ${darkMode ? 'hover:bg-[#90e0ef]' : 'hover:bg-blue-500'} transition-all duration-200`}
              >
                🎫 {translate('signUp')}
              </motion.button>
            </motion.div>
            
            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-[#4361ee]/30' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-[#1a1a3a] text-[#4cc9f0]' : 'bg-white text-gray-500'}`}>Or continue with</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/30 border-red-800 text-red-400' : 'bg-red-100 border-red-200 text-red-700'} border`}>
                {error}
              </div>
            )}
            
            {/* Google Login Button */}
            <motion.button
              type="button"
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 mt-4 border ${darkMode ? 'border-[#4361ee]/30 bg-[#0f1642]/50 hover:bg-[#0f1642]/70' : 'border-gray-300 bg-white hover:bg-gray-50'} rounded-lg shadow-sm text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} focus:outline-none focus:ring-2 focus:ring-[#4cc9f0] transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

