import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import BusAnimation from '../components/BusAnimation';

const Login = () => {
  const { translate } = useLanguage();
  const { darkMode } = useTheme();
  
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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (formData.email && formData.password) {
      navigate("/admin");
    }
    setIsLoading(false);
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

  // Using imported BusAnimation component

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Transportation Background */}
      <BusAnimation />
      
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
              <div className="text-[#4cc9f0] hover:text-[#4361ee] cursor-pointer">
                Forgot Password?
              </div>
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
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

