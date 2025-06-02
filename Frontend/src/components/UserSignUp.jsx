import React, { useState, useContext, useRef, memo, useCallback } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  Github,
} from "lucide-react";
import { AuthContext } from "../context/UserContext";

const API_BASE_URL = "http://localhost:4000/users";

const EmailSignupForm = memo(
  ({
    formData,
    handleChange,
    handleSubmit,
    showPassword,
    setShowPassword,
    loading,
    onBack,
    handleBackToSocial,
  }) => (
    <motion.div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5 }}
      // className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <button
        onClick={handleBackToSocial}
        className="flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to options
      </button>

      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Create Account
        </h2>
        <p className="text-gray-300">Fill in your details to get started</p>
      </div>

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
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  )
);
const OtpInput = React.memo(
  ({ index, value, onChange, onKeyDown, inputRef }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
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
                 transition-all transform hover:scale-105"
        style={{ caretColor: "transparent" }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
      />
    </motion.div>
  )
);
function OtpVerificationForm({
  setShowOtpInput,
  setOtp,
  setOtpError,
  formData,
  handleOtpChange,
  handleOtpKeyDown,
  handleOtpSubmit,
  loading,
  otp,
  otpInputs,
  otpError,
  setModal,
}) {
  const handleBackToForm = () => {
    setShowOtpInput(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
  };
  return (
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
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <CheckCircle className="w-12 h-12 mx-auto text-yellow-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white">Verify your email</h3>
        <p className="text-gray-400 text-sm">
          We've sent a verification code to
          <br />
          <span className="text-white font-medium">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center gap-2">
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
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center"
          >
            {otpError}
          </motion.p>
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
}
function SocialLoginOptions({
  setShowEmailForm,
  socialLoading,
  setSocialLoading,
  setModal,
}) {
  const navigate = useNavigate();
  const handleGoogleSignup = async () => {
    setSocialLoading((prev) => ({ ...prev, google: true }));

    try {
      // Simulate Google OAuth process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, you would:
      // window.location.href = `https://accounts.google.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email profile&response_type=code`;

      setModal({
        open: true,
        success: true,
        message: "Google signup successful! Redirecting...",
      });

      setTimeout(() => navigate("/quiz"), 2000);
    } catch (error) {
      setModal({
        open: true,
        success: false,
        message: "Google signup failed. Please try again.",
      });
    } finally {
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }
  };
  const handleGithubSignup = async () => {
    setSocialLoading((prev) => ({ ...prev, github: true }));

    try {
      // Simulate GitHub OAuth process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, you would:
      // window.location.href = `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=user:email`;

      setModal({
        open: true,
        success: true,
        message: "GitHub signup successful! Redirecting...",
      });

      setTimeout(() => navigate("/quiz"), 2000);
    } catch (error) {
      setModal({
        open: true,
        success: false,
        message: "GitHub signup failed. Please try again.",
      });
    } finally {
      setSocialLoading((prev) => ({ ...prev, github: false }));
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Create Account
        </h2>
        <p className="text-gray-300">
          Join BrainQuest and start your learning journey
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-4">
        {/* Google Signup */}
        <motion.button
          onClick={handleGoogleSignup}
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

        {/* GitHub Signup */}
        <motion.button
          onClick={handleGithubSignup}
          disabled={socialLoading.google || socialLoading.github}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 
                 rounded-xl transition-all duration-200 flex items-center justify-center 
                 space-x-3 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {socialLoading.github ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Signing up with GitHub...</span>
            </>
          ) : (
            <>
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-gray-400">or</span>
        </div>
      </div>

      {/* Email Signup Button */}
      <motion.button
        onClick={() => setShowEmailForm(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 
               rounded-xl border border-white/20 transition-all duration-200 flex items-center 
               justify-center space-x-3 hover:shadow-md cursor-pointer"
      >
        <Mail className="w-5 h-5" />
        <span>Continue with Email</span>
      </motion.button>

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
  );
}
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    github: false,
  });

  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };
  const handleBackToSocial = () => {
    setShowEmailForm(false);
    setFormData({ name: "", email: "", password: "" });
  };
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

  const handleOtpChange = (index, value) => {
    const char = value.slice(-1);

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[index] = char;

      if (char && index < 5) {
        setTimeout(() => {
          otpInputs.current[index + 1]?.focus();
        }, 0);
      }

      return newOtp;
    });
  };

  const handleOtpKeyDown = (index, e) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        setOtp((prev) => {
          const newOtp = [...prev];

          if (!newOtp[index] && index > 0) {
            newOtp[index - 1] = "";
            setTimeout(() => {
              otpInputs.current[index - 1]?.focus();
            }, 0);
          } else {
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

  const closeModal = () => {
    setModal({ open: false, success: false, message: "" });
  };
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
          <AnimatePresence mode="wait">
            {showOtpInput ? (
              <OtpVerificationForm
                key="otp"
                setShowOtpInput={setShowOtpInput}
                setOtp={setOtp}
                setOtpError={setOtpError}
                formData={formData}
                handleOtpChange={handleOtpChange}
                handleOtpKeyDown={handleOtpKeyDown}
                handleOtpSubmit={handleOtpSubmit}
                loading={loading}
                otp={otp}
                otpInputs={otpInputs}
                otpError={otpError}
                setModal={setModal}
              />
            ) : showEmailForm ? (
              <EmailSignupForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                loading={loading}
                onBack={() => setShowEmailForm(false)}
                handleBackToSocial={handleBackToSocial}
              />
            ) : (
              <SocialLoginOptions
                key="social"
                setShowEmailForm={setShowEmailForm}
                socialLoading={socialLoading}
                setSocialLoading={setSocialLoading}
                setModal={setModal}
              />
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
