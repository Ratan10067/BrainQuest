import React, { useState, useContext, useRef, memo } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Loader2,
  EyeIcon,
  EyeOff,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { AuthContext } from "../context/UserContext";

const API_BASE_URL = "http://localhost:4000/users";

export default function UserSignUp() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const [otpError, setOtpError] = useState("");

  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setOtpError("");

  //   if (!isValidEmail(formData.email)) {
  //     setModal({
  //       open: true,
  //       success: false,
  //       message: "Please enter a valid email address.",
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/send-otp`, {
  //       email: formData.email,
  //       name: formData.name,
  //     });

  //     if (response.status === 200) {
  //       setShowOtpInput(true);
  //       setModal({
  //         open: true,
  //         success: true,
  //         message: "OTP has been sent to your email!",
  //       });
  //     }
  //   } catch (error) {
  //     setModal({
  //       open: true,
  //       success: false,
  //       message: error.response?.data?.message || "Failed to send OTP",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError("");

    if (!isValidEmail(formData.email)) {
      setModal({
        open: true,
        success: false,
        message: "Please enter a valid email address.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, {
        email: formData.email,
        name: formData.name,
      });

      if (response.status === 200) {
        setModal({
          open: true,
          success: true,
          message: "OTP has been sent to your email!",
          action: () => {
            setShowOtpInput(true);
            setModal({ open: false, success: false, message: "" });
          },
          actionText: "Enter OTP",
        });
      }
    } catch (error) {
      setModal({
        open: true,
        success: false,
        message: error.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setLoading(false);
    }
  };
  const OtpInput = React.memo(
    ({ index, value, onChange, onKeyDown, inputRef }) => (
      <input
        ref={inputRef}
        type="text"
        maxLength={1}
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        onKeyDown={(e) => onKeyDown(index, e)}
        className="w-12 h-12 text-center bg-white/5 border border-white/10 
                 rounded-lg text-white text-xl font-bold focus:outline-none 
                 focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20
                 transition-all"
        style={{ caretColor: "transparent" }} // Hide blinking cursor
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none" // Allow lowercase
      />
    )
  );
  // const handleOtpChange = (index, value) => {
  //   if (value.length > 1) return;

  //   const newOtp = [...otp];
  //   newOtp[index] = value.replace(/[^0-9]/g, "");
  //   setOtp(newOtp);

  //   if (value && index < 5) {
  //     otpInputs.current[index + 1].focus();
  //   }
  // };
  const handleOtpChange = (index, value) => {
    const char = value.slice(-1); // Get last character

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = char;

      // Move to next input if character is entered
      if (char && index < 5) {
        setTimeout(() => {
          otpInputs.current[index + 1]?.focus();
        }, 0);
      }

      return newOtp;
    });
  };
  // const handleOtpKeyDown = (index, e) => {
  //   if (e.key === "Backspace" && !otp[index] && index > 0) {
  //     otpInputs.current[index - 1].focus();
  //   }
  // };
  const handleOtpKeyDown = (index, e) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        setOtp((prev) => {
          const newOtp = [...prev];

          if (!newOtp[index] && index > 0) {
            // If current input is empty, clear previous and move focus
            newOtp[index - 1] = "";
            setTimeout(() => {
              otpInputs.current[index - 1]?.focus();
            }, 0);
          } else {
            // Clear current input
            newOtp[index] = "";
          }

          return newOtp;
        });
        break;

      case "ArrowLeft":
        e.preventDefault();
        if (index > 0) {
          otpInputs.current[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
        e.preventDefault();
        if (index < 5) {
          otpInputs.current[index + 1]?.focus();
        }
        break;
    }
  };
  const handleOtpSubmit = async () => {
    setLoading(true);
    setOtpError("");
    const otpString = otp.join("");

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email: formData.email,
        otp: otpString,
        name: formData.name,
        password: formData.password,
      });

      if (response.status === 201) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        setIsAuthenticated(true);

        setModal({
          open: true,
          success: true,
          message: "Account created successfully! Redirecting...",
        });

        setTimeout(() => navigate("/quiz"), 2000);
      }
    } catch (error) {
      setOtpError(error.response?.data?.message || "Invalid OTP");
      setModal({
        open: true,
        success: false,
        message: error.response?.data?.message || "Failed to verify OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setShowOtpInput(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };

  const closeModal = () => {
    setModal({ open: false, success: false, message: "" });
  };

  // OTP Input Form Component
  const OtpVerificationForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      <button
        onClick={handleBackToForm}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to form
      </button>

      <div className="text-center space-y-3">
        <CheckCircle className="w-12 h-12 mx-auto text-yellow-400" />
        <h3 className="text-2xl font-bold text-white">Verify your email</h3>
        <p className="text-gray-400 text-sm">
          We've sent a verification code to
          <br />
          <span className="text-white font-medium">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          {/* {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpInputs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center bg-white/5 border border-white/10 
                       rounded-lg text-white text-xl font-bold focus:outline-none 
                       focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20
                       transition-all"
            />
          ))} */}
          {/* {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (otpInputs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 text-center bg-white/5 border border-white/10 
             rounded-lg text-white text-xl font-bold uppercase focus:outline-none 
             focus:border-yellow-400/50 focus:ring-2 focus:ring-yellow-400/20
             transition-all"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          ))} */}
          {otp.map((digit, index) => (
            <OtpInput
              key={index}
              index={index}
              value={digit}
              onChange={handleOtpChange}
              onKeyDown={handleOtpKeyDown}
              inputRef={(el) => (otpInputs.current[index] = el)}
            />
          ))}
        </div>

        {otpError && (
          <p className="text-red-400 text-sm text-center">{otpError}</p>
        )}

        <motion.button
          onClick={handleOtpSubmit}
          disabled={loading || otp.join("").length !== 6}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                   to-orange-500 text-[#1a1f37] font-semibold flex items-center 
                   justify-center gap-2 hover:shadow-lg hover:shadow-yellow-500/25 
                   transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

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
        {/* Left Panel - Illustration */}
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
          {showOtpInput ? (
            <OtpVerificationForm />
          ) : (
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

              {/* Sign Up Form */}
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
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
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

              {/* Sign In Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <NavLink
                    to="/signin"
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    Sign In
                  </NavLink>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      {/* <AnimatePresence>
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
      </AnimatePresence> */}
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
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={modal.success ? modal.action : closeModal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 
                    to-orange-500 text-[#1a1f37] font-semibold hover:shadow-lg 
                    hover:shadow-yellow-500/25 transition-all"
              >
                {modal.success ? modal.actionText || "Continue" : "Try Again"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
