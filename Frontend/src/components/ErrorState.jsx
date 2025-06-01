import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaRedo,
  //   FaRefresh,
  FaWifi,
  FaServer,
  FaQuestion,
  FaClock,
  FaHome,
} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
// Enhanced error message handler
const getErrorMessage = (error) => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return {
          message: "Bad request. Please check your input and try again.",
          code: `HTTP_${status}`,
          icon: FaQuestion,
          color: "orange",
        };
      case 401:
        return {
          message: "Authentication required. Please log in and try again.",
          code: `HTTP_${status}`,
          icon: FaExclamationTriangle,
          color: "yellow",
        };
      case 403:
        return {
          message:
            "Access denied. You don't have permission to view this data.",
          code: `HTTP_${status}`,
          icon: FaExclamationTriangle,
          color: "red",
        };
      case 404:
        return {
          message:
            "Leaderboard data not found. The requested resource doesn't exist.",
          code: `HTTP_${status}`,
          icon: FaQuestion,
          color: "blue",
        };
      case 408:
        return {
          message: "Request timeout. The server took too long to respond.",
          code: `HTTP_${status}`,
          icon: FaClock,
          color: "orange",
        };
      case 500:
        return {
          message:
            "Server error. Our team has been notified and is working on it.",
          code: `HTTP_${status}`,
          icon: FaServer,
          color: "red",
        };
      case 502:
      case 503:
      case 504:
        return {
          message:
            "Service temporarily unavailable. Please try again in a few minutes.",
          code: `HTTP_${status}`,
          icon: FaServer,
          color: "red",
        };
      default:
        return {
          message: `Server error (${status}). Please try again later.`,
          code: `HTTP_${status}`,
          icon: FaExclamationTriangle,
          color: "red",
        };
    }
  }

  // Network errors
  if (
    error.code === "NETWORK_ERROR" ||
    error.message?.includes("Network Error")
  ) {
    return {
      message:
        "Network connection failed. Please check your internet connection.",
      code: "NETWORK_ERROR",
      icon: FaWifi,
      color: "orange",
    };
  }

  return {
    message: error.message || "An unexpected error occurred.",
    code: error.code || "UNKNOWN_ERROR",
    icon: FaExclamationTriangle,
    color: "red",
  };
};

// Auto-refresh hook
const useAutoRefresh = (onRetry, enabled = false, interval = 30000) => {
  const [countdown, setCountdown] = useState(interval / 1000);
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(enabled);

  useEffect(() => {
    if (!isAutoRefreshEnabled) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onRetry();
          return interval / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoRefreshEnabled, onRetry, interval]);

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
    if (!isAutoRefreshEnabled) {
      setCountdown(interval / 1000);
    }
  };

  return { countdown, isAutoRefreshEnabled, toggleAutoRefresh };
};

const ErrorState = ({
  error,
  onRetry,
  usingMockData,
  enableAutoRefresh = false,
  showHomeButton = false,
  onGoHome = null,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const errorInfo = getErrorMessage(error);
  const IconComponent = errorInfo.icon;

  const { countdown, isAutoRefreshEnabled, toggleAutoRefresh } = useAutoRefresh(
    onRetry,
    enableAutoRefresh
  );
  console.log("Error State Chal rha hai");
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  const getIconColor = () => {
    const colors = {
      red: "text-red-500 bg-red-100 dark:bg-red-900/30",
      orange: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
      yellow: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
      blue: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
    };
    return colors[errorInfo.color] || colors.red;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${getIconColor()}`}
          >
            <IconComponent className="text-3xl" />
          </motion.div>

          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Oops! Something went wrong
          </h2>

          <div className="space-y-3 mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              {errorInfo.message}
            </p>

            {errorInfo.code && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Error Code:{" "}
                  <span className="font-mono font-semibold">
                    {errorInfo.code}
                  </span>
                </p>
              </div>
            )}

            {usingMockData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3"
              >
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  📊 Showing sample data for demonstration
                </p>
              </motion.div>
            )}
          </div>

          {/* Auto-refresh indicator */}
          {isAutoRefreshEnabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
            >
              <p className="text-sm text-green-700 dark:text-green-300">
                🔄 Auto-retry in {countdown}s
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FaRedo
                  className={`text-sm ${isRetrying ? "animate-spin" : ""}`}
                />
                {isRetrying ? "Retrying..." : "Try Again"}
              </button>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <IoMdRefresh
                  className={`text-sm ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Optional Home Button */}
            {showHomeButton && onGoHome && (
              <button
                onClick={onGoHome}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
              >
                <FaHome className="text-sm" />
                Go to Home
              </button>
            )}

            {/* Auto-refresh toggle */}
            {enableAutoRefresh && (
              <button
                onClick={toggleAutoRefresh}
                className={`w-full px-6 py-2 text-sm rounded-xl transition-colors cursor-pointer ${
                  isAutoRefreshEnabled
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                {isAutoRefreshEnabled
                  ? "🔄 Auto-retry ON"
                  : "⏸️ Auto-retry OFF"}
              </button>
            )}
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Quick Solutions:
            </h3>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Verify the server is running</li>
              <li>• Clear browser cache and cookies</li>
              <li>• Disable browser extensions temporarily</li>
              <li>• Try using a different browser</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>

          {/* Additional error details for development */}
          {process.env.NODE_ENV === "development" && error.stack && (
            <details className="mt-4 text-left">
              <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                🔧 Developer Details
              </summary>
              <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorState;
