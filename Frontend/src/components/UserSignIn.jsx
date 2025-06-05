import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, EyeIcon, EyeOff, ArrowLeft } from "lucide-react";
import { AuthContext } from "../context/UserContext";

export default function UserSignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/user-login",
        credentials
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        setModal({
          open: true,
          success: true,
          message: "Welcome back! Redirecting to quiz section.",
        });
        setIsAuthenticated(true);
        setTimeout(() => navigate("/quiz"), 2000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/forgot-password",
        { email: forgotPasswordEmail }
      );
      if (response.status === 200) {
        setModal({
          open: true,
          success: true,
          message: "Password reset link sent to your email!",
        });
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = "http://localhost:4000/auth/google";
  };

  const closeModal = () =>
    setModal({ open: false, success: false, message: "" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] flex items-center justify-center p-4 md:p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-3xl transform rotate-12 opacity-20" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-orange-500/20 to-transparent rounded-full blur-3xl transform -rotate-12 opacity-20" />
      </div>

      {/* Main Container */}
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
              src="/assets/signIn.png"
              alt="Sign In Illustration"
              className="w-full max-w-md transform transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-300 mb-8">
                  Continue your learning journey with BrainQuest
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                      value={credentials.email}
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
                      value={credentials.password}
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
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <EyeIcon size={20} />
                      )}
                    </button>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors cursor-pointer"
                    >
                      Forgot Password?
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
                             transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                {/* Google Sign In Button */}
                <div className="space-y-4">
                  <motion.button
                    onClick={handleGoogleSignIn}
                    disabled={socialLoading.google || socialLoading.github}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 
                                 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center 
                                 space-x-3 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {socialLoading.google ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span>Signing up with Google...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-gray-400">
                    Don't have an account?{" "}
                    <NavLink
                      to="/signup"
                      className="text-yellow-400 hover:text-yellow-300 
                                                   transition-colors"
                    >
                      Sign Up
                    </NavLink>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="flex items-center space-x-2 text-yellow-400 hover:text-yellow-300 transition-colors mb-4 cursor-pointer"
                  >
                    <ArrowLeft size={20} />
                    <span>Back to Sign In</span>
                  </button>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-300">
                    Enter your email address and we'll send you a reset link
                  </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {/* Email Input */}
                  <div className="relative group">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 
                                   group-focus-within:text-yellow-400 transition-colors"
                      size={20}
                    />
                    <input
                      name="forgotPasswordEmail"
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 
                               rounded-xl text-white placeholder-gray-400 focus:outline-none 
                               focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20 
                               transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                             to-orange-500 text-[#1a1f37] font-semibold flex items-center 
                             justify-center space-x-2 hover:shadow-lg hover:shadow-yellow-500/25 
                             transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {forgotPasswordLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Sending Reset Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
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
                {modal.success ? "Success!" : "Oops!"}
              </h3>
              <p className="text-gray-300 text-center mb-6">{modal.message}</p>
              {!modal.success && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeModal}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                           to-orange-500 text-[#1a1f37] font-semibold hover:shadow-lg 
                           hover:shadow-yellow-500/25 transition-all cursor-pointer"
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
