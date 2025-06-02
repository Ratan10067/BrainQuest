import React, { useState, useEffect, useContext } from "react";
import { ShieldAlert, LogIn, Clock, X } from "lucide-react";
import { AuthContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SessionExpiredModal = () => {
  const [showModal, setShowModal] = useState(true); // Demo state
  const [countdown, setCountdown] = useState(30);
  const { sessionExpired, setSessionExpired, setIsAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const handleReLogin = async () => {
    console.log("Redirecting to login...");
    try {
      const response = await axios.get(
        "http://localhost:4000/users/user-logout",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setShowModal(false);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    setSessionExpired(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setSessionExpired(false);
  };

  // Auto-redirect countdown
  useEffect(() => {
    if (showModal) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleReLogin();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showModal]);

  // Reset countdown when modal opens
  useEffect(() => {
    if (showModal) {
      setCountdown(30);
    }
  }, [showModal]);

  if (!showModal) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(75, 85, 99, 0.4); }
          50% { box-shadow: 0 0 40px rgba(75, 85, 99, 0.7); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        
        .shimmer-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-md mx-auto animate-slideUp">
          {/* Animated gradient background with dark theme colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-slate-600 to-gray-700 rounded-3xl blur-lg opacity-30 animate-pulse"></div>

          {/* Modal container with dark theme */}
          <div className="relative bg-[#2c3250] rounded-3xl shadow-2xl border border-gray-600/30 overflow-hidden backdrop-blur-sm animate-glow">
            {/* Header with dark gradient */}
            <div className="relative bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 px-8 py-6 text-center overflow-hidden">
              {/* Floating animation elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-white bg-opacity-5 rounded-full transform -translate-x-10 -translate-y-10 animate-bounce"></div>
              <div
                className="absolute bottom-0 right-0 w-16 h-16 bg-white bg-opacity-5 rounded-full transform translate-x-8 translate-y-8 animate-bounce"
                style={{ animationDelay: "0.3s" }}
              ></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/60 rounded-full mb-3 backdrop-blur-sm border border-gray-600/30">
                  <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100 drop-shadow-lg">
                  Session Expired
                </h2>
              </div>
            </div>

            {/* Content section with dark theme */}
            <div className="px-8 py-8 text-center space-y-6">
              {/* Main message */}
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full mb-4 shadow-lg border border-gray-600/30">
                  <Clock className="w-10 h-10 text-gray-300 animate-spin-slow" />
                </div>

                <h3 className="text-xl font-bold text-gray-100 leading-tight">
                  Your Current Session is Expired
                </h3>

                <p className="text-gray-400 text-base leading-relaxed max-w-sm mx-auto">
                  For your security, your session has timed out. Please click
                  here to relogin and continue.
                </p>
              </div>

              {/* Countdown display with dark theme */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 border-2 border-dashed border-gray-600/50 shadow-inner">
                <div className="flex items-center justify-center space-x-2 text-gray-300">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium">
                    Auto-login redirect in:
                  </span>
                </div>
                <div className="text-3xl font-bold text-red-400 mt-2">
                  {countdown}s
                </div>
              </div>

              {/* Action buttons with dark theme */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleReLogin}
                  className="w-full group relative bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-100 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl overflow-hidden shimmer-effect border border-gray-500/30"
                >
                  <div className="relative flex items-center justify-center space-x-3">
                    <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-lg">Click Here to Relogin</span>
                  </div>
                </button>

                {/* <button
                  onClick={handleClose}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 border border-gray-600 hover:border-gray-500 hover:scale-105"
                >
                  Stay on Current Page
                </button> */}
              </div>
            </div>

            {/* Decorative bottom section with dark theme colors */}
            <div className="h-2 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
          </div>

          {/* Additional floating elements with dark theme colors */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-600 bg-opacity-30 rounded-full animate-ping"></div>
          <div
            className="absolute -bottom-4 -right-4 w-6 h-6 bg-gray-500 bg-opacity-30 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default SessionExpiredModal;
