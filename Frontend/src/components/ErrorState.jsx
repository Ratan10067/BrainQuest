import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Wifi,
  Server,
  HelpCircle,
  Clock,
  Home,
  Shield,
  Database,
  Zap,
  Globe,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";

// Enhanced error message handler with more detailed information
const getErrorMessage = (error) => {
  console.error("Error details:", error);

  // Handle string errors
  if (typeof error === "string") {
    if (error.includes("Network Error") || error.includes("network")) {
      return {
        title: "Connection Problem",
        message:
          "Unable to connect to the server. Please check your internet connection and try again.",
        details:
          "This usually happens when your internet is down or the server is unreachable.",
        code: "NETWORK_ERROR",
        icon: Wifi,
        color: "orange",
        severity: "warning",
        suggestions: [
          "Check your internet connection",
          "Try refreshing the page",
          "Check if other websites are working",
          "Wait a moment and try again",
        ],
      };
    }
  }

  // Handle axios/fetch response errors
  if (error?.response) {
    const status = error.response.status;
    const statusText = error.response.statusText || "";

    switch (status) {
      case 400:
        return {
          title: "Invalid Request",
          message: "The request contains invalid data or parameters.",
          details: `Server responded with: ${statusText}. Please check your input and try again.`,
          code: `HTTP_${status}`,
          icon: HelpCircle,
          color: "orange",
          severity: "warning",
          suggestions: [
            "Check if all required fields are filled",
            "Verify data format is correct",
            "Try refreshing and submitting again",
          ],
        };
      case 401:
        return {
          title: "Authentication Required",
          message: "You need to log in to access this resource.",
          details:
            "Your session may have expired or you don't have valid credentials.",
          code: `HTTP_${status}`,
          icon: Shield,
          color: "yellow",
          severity: "warning",
          suggestions: [
            "Log in to your account",
            "Check if your session expired",
            "Clear cookies and log in again",
          ],
        };
      case 403:
        return {
          title: "Access Denied",
          message: "You don't have permission to access this resource.",
          details:
            "This content is restricted or requires special permissions.",
          code: `HTTP_${status}`,
          icon: Shield,
          color: "red",
          severity: "error",
          suggestions: [
            "Contact administrator for access",
            "Check if you have the right permissions",
            "Try logging out and back in",
          ],
        };
      case 404:
        return {
          title: "Resource Not Found",
          message: "The requested data or page could not be found.",
          details:
            "The resource may have been moved, deleted, or the URL is incorrect.",
          code: `HTTP_${status}`,
          icon: HelpCircle,
          color: "blue",
          severity: "info",
          suggestions: [
            "Check the URL for typos",
            "Go back to the previous page",
            "Use the search function",
            "Contact support if this persists",
          ],
        };
      case 408:
        return {
          title: "Request Timeout",
          message: "The server took too long to respond.",
          details:
            "This might be due to slow internet connection or server overload.",
          code: `HTTP_${status}`,
          icon: Clock,
          color: "orange",
          severity: "warning",
          suggestions: [
            "Check your internet speed",
            "Try again in a few moments",
            "Refresh the page",
          ],
        };
      case 429:
        return {
          title: "Too Many Requests",
          message: "You've made too many requests. Please slow down.",
          details:
            "Rate limiting is in effect. Wait before making more requests.",
          code: `HTTP_${status}`,
          icon: Zap,
          color: "orange",
          severity: "warning",
          suggestions: [
            "Wait a few minutes before trying again",
            "Reduce the frequency of requests",
            "Contact support if you need higher limits",
          ],
        };
      case 500:
        return {
          title: "Server Error",
          message: "Something went wrong on our servers.",
          details:
            "Our team has been automatically notified and is working on a fix.",
          code: `HTTP_${status}`,
          icon: Server,
          color: "red",
          severity: "error",
          suggestions: [
            "Try again in a few minutes",
            "Check our status page",
            "Contact support if this continues",
          ],
        };
      case 502:
      case 503:
      case 504:
        return {
          title: "Service Unavailable",
          message: "The service is temporarily unavailable.",
          details:
            "This is usually temporary. Our servers might be under maintenance or experiencing high load.",
          code: `HTTP_${status}`,
          icon: Server,
          color: "red",
          severity: "error",
          suggestions: [
            "Wait a few minutes and try again",
            "Check our status page for updates",
            "Try again later",
          ],
        };
      default:
        return {
          title: "Server Error",
          message: `Server responded with error ${status}.`,
          details: `${
            statusText || "Unknown server error"
          }. Please try again later.`,
          code: `HTTP_${status}`,
          icon: AlertTriangle,
          color: "red",
          severity: "error",
          suggestions: [
            "Try refreshing the page",
            "Wait a few minutes and try again",
            "Contact support if this persists",
          ],
        };
    }
  }

  // Handle network errors
  if (
    error?.code === "NETWORK_ERROR" ||
    error?.message?.includes("Network Error") ||
    error?.name === "NetworkError"
  ) {
    return {
      title: "Network Connection Failed",
      message: "Unable to connect to the internet or server.",
      details:
        "This could be due to internet connectivity issues or server downtime.",
      code: "NETWORK_ERROR",
      icon: Wifi,
      color: "orange",
      severity: "warning",
      suggestions: [
        "Check your internet connection",
        "Try connecting to a different network",
        "Restart your router",
        "Contact your ISP if problems persist",
      ],
    };
  }

  // Handle timeout errors
  if (error?.code === "TIMEOUT" || error?.message?.includes("timeout")) {
    return {
      title: "Request Timeout",
      message: "The request took too long to complete.",
      details: "This might be due to slow connection or server overload.",
      code: "TIMEOUT_ERROR",
      icon: Clock,
      color: "orange",
      severity: "warning",
      suggestions: [
        "Check your internet speed",
        "Try again with a better connection",
        "Wait a moment and retry",
      ],
    };
  }

  // Default error
  return {
    title: "Something Went Wrong",
    message: error?.message || "An unexpected error occurred.",
    details: "We're not sure what happened, but we're looking into it.",
    code: error?.code || "UNKNOWN_ERROR",
    icon: AlertTriangle,
    color: "red",
    severity: "error",
    suggestions: [
      "Try refreshing the page",
      "Clear your browser cache",
      "Try again in a few minutes",
      "Contact support if this continues",
    ],
  };
};

// Auto-refresh hook with better state management
const useAutoRefresh = (onRetry, enabled = false, interval = 30000) => {
  const [countdown, setCountdown] = useState(Math.floor(interval / 1000));
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] = useState(enabled);
  const [isPaused, setIsPaused] = useState(false);

  const resetCountdown = useCallback(() => {
    setCountdown(Math.floor(interval / 1000));
  }, [interval]);

  useEffect(() => {
    if (!isAutoRefreshEnabled || isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          onRetry();
          return Math.floor(interval / 1000);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoRefreshEnabled, isPaused, onRetry, interval]);

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
    if (!isAutoRefreshEnabled) {
      resetCountdown();
    }
  };

  const pauseAutoRefresh = () => {
    setIsPaused(!isPaused);
  };

  return {
    countdown,
    isAutoRefreshEnabled,
    isPaused,
    toggleAutoRefresh,
    pauseAutoRefresh,
    resetCountdown,
  };
};

const ErrorState = ({
  error,
  onRetry,
  enableAutoRefresh = false,
  autoRefreshInterval = 30000,
  showHomeButton = false,
  onGoHome = null,
  showTechnicalDetails = false,
  customActions = [],
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const errorInfo = getErrorMessage(error);
  const IconComponent = errorInfo.icon;

  const {
    countdown,
    isAutoRefreshEnabled,
    isPaused,
    toggleAutoRefresh,
    pauseAutoRefresh,
    resetCountdown,
  } = useAutoRefresh(onRetry, enableAutoRefresh, autoRefreshInterval);

  const handleRetry = async () => {
    setIsRetrying(true);
    resetCountdown();
    try {
      await onRetry();
    } catch (retryError) {
      console.error("Retry failed:", retryError);
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  const getColorClasses = () => {
    const colors = {
      red: {
        icon: "text-red-500 bg-red-100 dark:bg-red-900/30",
        accent: "border-red-200 dark:border-red-800",
        button: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
      },
      orange: {
        icon: "text-orange-500 bg-orange-100 dark:bg-orange-900/30",
        accent: "border-orange-200 dark:border-orange-800",
        button:
          "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      },
      yellow: {
        icon: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30",
        accent: "border-yellow-200 dark:border-yellow-800",
        button:
          "from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
      },
      blue: {
        icon: "text-blue-500 bg-blue-100 dark:bg-blue-900/30",
        accent: "border-blue-200 dark:border-blue-800",
        button:
          "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      },
    };
    return colors[errorInfo.color] || colors.red;
  };

  const getSeverityIcon = () => {
    switch (errorInfo.severity) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-lg w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header with Icon */}
          <div
            className={`p-6 border-b ${colorClasses.accent} bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800`}
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses.icon} ring-4 ring-white dark:ring-gray-800`}
              >
                <IconComponent className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {getSeverityIcon()}
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {errorInfo.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {errorInfo.message}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Error Details */}
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                {errorInfo.details}
              </p>

              {errorInfo.code && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Error Code
                    </p>
                    <p className="font-mono font-semibold text-gray-800 dark:text-white">
                      {errorInfo.code}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard?.writeText(errorInfo.code)
                    }
                    className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>

            {/* Auto-refresh Status */}
            {isAutoRefreshEnabled && (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Auto-retry {isPaused ? "paused" : "active"}
                    </span>
                  </div>
                  {!isPaused && (
                    <span className="text-sm text-green-600 dark:text-green-400 font-mono">
                      {countdown}s
                    </span>
                  )}
                </div>
                {!isPaused && (
                  <div className="mt-2 w-full bg-green-200 dark:bg-green-800 rounded-full h-1">
                    <div
                      className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                      style={{
                        width: `${
                          ((autoRefreshInterval / 1000 - countdown) /
                            (autoRefreshInterval / 1000)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                <Info className="w-4 h-4" />
                <span>What you can try:</span>
              </h3>
              <ul className="space-y-2">
                {errorInfo.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${colorClasses.button} text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium`}
                >
                  <RotateCcw
                    className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                  />
                  <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
                </button>

                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  <span>{refreshing ? "Refreshing..." : "Refresh Page"}</span>
                </button>
              </div>

              {/* Auto-refresh Controls */}
              {enableAutoRefresh && (
                <div className="flex space-x-2">
                  <button
                    onClick={toggleAutoRefresh}
                    className={`flex-1 px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
                      isAutoRefreshEnabled
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    {isAutoRefreshEnabled
                      ? "Turn Off Auto-retry"
                      : "Turn On Auto-retry"}
                  </button>

                  {isAutoRefreshEnabled && (
                    <button
                      onClick={pauseAutoRefresh}
                      className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {isPaused ? "Resume" : "Pause"}
                    </button>
                  )}
                </div>
              )}

              {/* Custom Actions */}
              {customActions.length > 0 && (
                <div className="space-y-2">
                  {customActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      {action.icon && <action.icon className="w-4 h-4" />}
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Home Button */}
              {showHomeButton && onGoHome && (
                <button
                  onClick={onGoHome}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Go to Home</span>
                </button>
              )}
            </div>

            {/* Technical Details */}
            {(showTechnicalDetails || process.env.NODE_ENV === "development") &&
              error && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    <span>Technical Details</span>
                    <span
                      className={`transform transition-transform ${
                        showDetails ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {showDetails && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-32 whitespace-pre-wrap">
                        {JSON.stringify(
                          {
                            message: error?.message,
                            stack: error?.stack,
                            response: error?.response?.data,
                            status: error?.response?.status,
                            timestamp: new Date().toISOString(),
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
