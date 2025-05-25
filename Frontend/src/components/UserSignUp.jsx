import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Loader2, EyeIcon, EyeOff } from "lucide-react";
import { AuthContext } from "../context/UserContext";
export default function UserSignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/user-register",
        formData
      );
      if (response.status === 201) {
        setModal({
          open: true,
          success: true,
          message:
            "Your account has been created! You will be redirected shortly.",
        });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        setIsAuthenticated(true);
        setTimeout(() => navigate("/quiz"), 2000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Signup failed. Please check your details and try again.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () =>
    setModal({ open: false, success: false, message: "" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl transform rotate-12 opacity-20" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex border border-white/20"
      >
        {/* Left Panel - 3D Illustration */}
        <div className="w-1/2 hidden lg:flex items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.8, rotateY: -20 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10"
          >
            <img
              src="/assets/signup-illustration.png"
              alt="Sign Up Illustration"
              className="w-full max-w-md transform transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-gray-300 mb-8">
              Join BrainQuest and start your learning journey
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                               group-focus-within:text-yellow-400 transition-colors"
                  size={20}
                />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 
                           rounded-xl text-white placeholder-gray-400 focus:outline-none 
                           focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                           transition-all"
                />
              </div>

              {/* Email Input */}
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                               group-focus-within:text-yellow-400 transition-colors"
                  size={20}
                />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 
                           rounded-xl text-white placeholder-gray-400 focus:outline-none 
                           focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                           transition-all"
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                               group-focus-within:text-yellow-400 transition-colors"
                  size={20}
                />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 
                           rounded-xl text-white placeholder-gray-400 focus:outline-none 
                           focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                           transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 
                           hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                         to-orange-500 text-[#1a1f37] font-semibold flex items-center 
                         justify-center space-x-2 hover:shadow-lg hover:shadow-yellow-500/25 
                         transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <NavLink
                  to="/signin"
                  className="text-yellow-400 hover:text-yellow-300 
                                               transition-colors"
                >
                  Sign In
                </NavLink>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 
                     backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full 
                       max-w-md p-8 border border-white/20"
            >
              <div className="text-6xl mb-4 flex justify-center">
                {modal.success ? "🎉" : "😢"}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white text-center">
                {modal.success ? "Welcome Aboard!" : "Oops!"}
              </h3>
              <p className="text-gray-300 text-center mb-6">{modal.message}</p>
              {!modal.success && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                           to-orange-500 text-[#1a1f37] font-semibold hover:shadow-lg 
                           hover:shadow-yellow-500/25 transition-all"
                >
                  Try Again
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
