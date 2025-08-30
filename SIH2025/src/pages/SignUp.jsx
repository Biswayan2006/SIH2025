import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Here you would typically send the data to your backend
    // For now, we'll just simulate a successful registration
    if (formData.email && formData.password && formData.fullName) {
      navigate("/login");
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear password error when user types in password fields
    if (name === "password" || name === "confirmPassword") {
      setPasswordError("");
    }
  };

  // Track mouse globally for the gradient effect
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* ✨ Moving Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(46,204,113,0.25), transparent 40%),
                       linear-gradient(135deg, #0A2342 0%, #2ECC71 50%, #F1C40F 100%)`,
        }}
      />

      {/* 🔹 SignUp Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md relative rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-gray-200">
          {/* Icon + Title */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-[#F1C40F] to-[#2ECC71] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">✨</span>
            </div>
            <h1 className="text-2xl font-bold text-[#333333]">Create Account</h1>
            <p className="text-gray-600 mt-2">Join TransitTrack for smarter commutes</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-colors"
                placeholder="John Doe"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-colors"
                placeholder="you@example.com"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-colors"
                placeholder="+91 9876543210"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-colors"
                placeholder="Create a strong password"
                required
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-[#333333] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-colors"
                placeholder="Confirm your password"
                required
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#2ECC71] border-gray-300 rounded focus:ring-[#2ECC71]"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-[#2ECC71] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#2ECC71] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 px-6 py-3 bg-[#F1C40F] text-[#333333] rounded-lg font-medium hover:bg-[#e1b90d] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#333333] border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>✨ Sign Up</>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="flex-1 px-6 py-3 bg-[#0A2342] text-white rounded-lg font-medium hover:bg-[#2ECC71] transition-all duration-200"
              >
                🚀 Login
              </motion.button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}