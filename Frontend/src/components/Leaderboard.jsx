import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy,
  FaMedal,
  FaCrown,
  FaUserCircle,
  FaClock,
  FaChartLine,
  FaStar,
  FaExclamationTriangle,
  FaRedo,
  FaWifi,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGamepad,
  FaCalendarAlt,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { IoMdClose, IoMdTrendingUp } from "react-icons/io";
import { HiOutlineSparkles } from "react-icons/hi";
import axios from "axios";

// Mock data with complete user information
const mockLeaderboardData = [
  {
    _id: "math_easy",
    subject: "Mathematics",
    difficulty: "Easy",
    totalParticipants: 156,
    entries: [
      {
        userId: {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1-555-0123",
          location: "New York, USA",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          quizzesTaken: 45,
          totalScore: 4250,
          createdAt: "2024-01-15T10:30:00Z",
        },
        score: 98,
        completionTime: 45,
        submittedAt: "2025-05-30T10:30:00Z",
        rank: 1,
      },
      {
        userId: {
          _id: "2",
          name: "Alice Smith",
          email: "alice@example.com",
          phone: "+1-555-0124",
          location: "California, USA",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          quizzesTaken: 38,
          totalScore: 3650,
          createdAt: "2024-02-20T11:20:00Z",
        },
        score: 95,
        completionTime: 52,
        submittedAt: "2025-05-30T11:20:00Z",
        rank: 2,
      },
      {
        userId: {
          _id: "3",
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "Not provided",
          location: "Texas, USA",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          quizzesTaken: 52,
          totalScore: 4890,
          createdAt: "2023-12-10T09:15:00Z",
        },
        score: 92,
        completionTime: 48,
        submittedAt: "2025-05-30T09:15:00Z",
        rank: 3,
      },
    ],
  },
];

// User Profile Modal Component
const UserProfileModal = ({ user, onClose, leaderboardEntry }) => {
  if (!user) return null;

  const getAvatarSrc = (avatar) => {
    if (avatar && avatar !== "default-avatar.png") {
      return avatar.startsWith("http")
        ? avatar
        : `http://localhost:4000/uploads/${avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name
    )}&background=random&size=200`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">User Profile</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-200 transition-colors p-2 hover:bg-white/20 rounded-full"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative">
                  <img
                    src={getAvatarSrc(user.avatar)}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}&background=random&size=200`;
                    }}
                  />
                  {leaderboardEntry && leaderboardEntry.rank <= 3 && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      #{leaderboardEntry.rank}
                    </div>
                  )}
                </div>

                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{user.name}</h3>
                  <p className="text-white/80 mb-1">{user.email}</p>
                  <p className="text-white/70 text-sm">
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  Contact Information
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaEnvelope className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Email
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaPhone className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phone
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {user.phone && user.phone !== "Not provided"
                          ? user.phone
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Location
                      </p>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {user.location && user.location !== "Unknown"
                          ? user.location
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Statistics */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaGamepad className="text-green-500" />
                  Quiz Statistics
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaTrophy className="text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quizzes Taken
                      </p>
                      <p className="font-bold text-2xl text-gray-800 dark:text-white">
                        {user.quizzesTaken || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaChartLine className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Total Score
                      </p>
                      <p className="font-bold text-2xl text-gray-800 dark:text-white">
                        {user.totalScore || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <FaStar className="text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Average Score
                      </p>
                      <p className="font-bold text-2xl text-gray-800 dark:text-white">
                        {user.quizzesTaken && user.totalScore
                          ? Math.round(user.totalScore / user.quizzesTaken)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Performance (if from leaderboard) */}
            {leaderboardEntry && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Current Performance
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      #{leaderboardEntry.rank}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rank
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {leaderboardEntry.score}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Score
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {formatTime(leaderboardEntry.completionTime)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Time
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Error State Component
// const ErrorState = ({ error, onRetry, usingMockData }) => (
//   <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="max-w-md w-full text-center"
//     >
//       <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.2, type: "spring" }}
//           className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
//         >
//           <FaExclamationTriangle className="text-red-500 text-3xl" />
//         </motion.div>

//         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
//           Oops! Something went wrong
//         </h2>

//         <div className="space-y-3 mb-6">
//           <p className="text-gray-600 dark:text-gray-400">
//             {error.message || "Unable to load leaderboard data"}
//           </p>

//           {usingMockData && (
//             <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
//               <p className="text-sm text-blue-700 dark:text-blue-300">
//                 📊 Showing sample data for demonstration
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col gap-3">
//           <button
//             onClick={onRetry}
//             className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             <FaRedo className="text-sm" />
//             Try Again
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   </div>
// );
const ErrorState = ({ error, onRetry, usingMockData }) => (
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
          className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6"
        >
          <FaExclamationTriangle className="text-red-500 text-3xl" />
        </motion.div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Oops! Something went wrong
        </h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {error.message || "Unable to load leaderboard data"}
          </p>

          {error.code && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Error Code: <span className="font-mono">{error.code}</span>
              </p>
            </div>
          )}

          {usingMockData && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📊 Showing sample data for demonstration
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaRedo className="text-sm" />
            Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
          >
            Refresh Page
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Common Solutions:
          </h3>
          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 text-left">
            <li>• Check your internet connection</li>
            <li>• Verify the server is running</li>
            <li>• Clear browser cache and cookies</li>
            <li>• Contact support if the issue persists</li>
          </ul>
        </div>
      </div>
    </motion.div>
  </div>
);
// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-center">
        <div className="h-16 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl w-80 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-2xl h-[450px] animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// Helper function to format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Leaderboard() {
  const [modalData, setModalData] = useState(null);
  const [userProfileModal, setUserProfileModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [usingMockData, setUsingMockData] = useState(false);

  const getErrorMessage = (error) => {
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 404:
          return {
            message:
              "Leaderboard data not found. The requested resource doesn't exist.",
            code: `HTTP_${status}`,
          };
        case 500:
          return {
            message:
              "Server error. Our team has been notified and is working on it.",
            code: `HTTP_${status}`,
          };
        default:
          return {
            message: `Server error (${status}). Please try again later.`,
            code: `HTTP_${status}`,
          };
      }
    }
    return {
      message: error.message || "An unexpected error occurred.",
      code: "UNKNOWN_ERROR",
    };
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:4000/leaderboard", {
        timeout: 10000,
      });
      setLeaderboardData(mockLeaderboardData);
      if (response.status === 200 && response.data) {
        // Transform backend data to match frontend expectations
        const transformedData = response.data.map((board) => ({
          ...board,
          entries: board.entries.map((entry) => ({
            ...entry,
            userId: {
              ...entry.userId,
              // Ensure all required user fields exist
              phone: entry.userId.phone || "Not provided",
              location: entry.userId.location || "Unknown",
              quizzesTaken: entry.userId.quizzesTaken || 0,
              totalScore: entry.userId.totalScore || 0,
              createdAt: entry.userId.createdAt || new Date().toISOString(),
              avatar: entry.userId.avatar || "default-avatar.png",
            },
          })),
        }));

        setLeaderboardData(transformedData);
        setUsingMockData(false);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
      const errorInfo = getErrorMessage(err);
      setError(errorInfo);
      setLeaderboardData(mockLeaderboardData);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "from-green-500 to-emerald-600";
      case "medium":
        return "from-yellow-500 to-orange-600";
      case "hard":
        return "from-red-500 to-pink-600";
      default:
        return "from-blue-500 to-purple-600";
    }
  };

  const getMedalIcon = (index) => {
    switch (index) {
      case 0:
        return <FaTrophy className="text-yellow-400 text-xl" />;
      case 1:
        return <FaMedal className="text-gray-300 text-xl" />;
      case 2:
        return <FaMedal className="text-amber-600 text-xl" />;
      default:
        return <FaStar className="text-blue-400 text-lg" />;
    }
  };

  // const getAvatarSrc = (avatar, name) => {
  //   if (avatar && avatar !== "default-avatar.png") {
  //     return avatar.startsWith("http")
  //       ? avatar
  //       : `http://localhost:4000/uploads/${avatar}`;
  //   }
  //   return `https://ui-avatars.com/api/?name=${encodeURIComponent(
  //     name
  //   )}&background=random&size=80`;
  // };

  const filteredData =
    selectedDifficulty === "all"
      ? leaderboardData
      : leaderboardData.filter(
          (board) => board.difficulty?.toLowerCase() === selectedDifficulty
        );

  if (error && !usingMockData) {
    return (
      <ErrorState
        error={error}
        onRetry={handleRetry}
        usingMockData={usingMockData}
      />
    );
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <HiOutlineSparkles className="text-yellow-500 text-3xl animate-pulse" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Leaderboards
          </h1>
          <HiOutlineSparkles className="text-yellow-500 text-3xl animate-pulse" />
        </div>

        {/* Difficulty Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {["all", "easy", "medium", "hard"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedDifficulty === difficulty
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Demo Data Warning */}
      {usingMockData && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <div className="bg-amber-500/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg max-w-sm">
            <p className="text-sm font-medium">Demo Mode - Sample Data</p>
          </div>
        </motion.div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {filteredData.map((board, idx) => (
          <motion.div
            key={board._id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.15, duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white dark:bg-gray-800 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
          >
            {/* Header */}
            <div
              className={`bg-gradient-to-r ${getDifficultyColor(
                board.difficulty
              )} p-6 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaCrown className="text-yellow-200" />
                    {board.subject}
                  </h2>
                  <span className="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
                    {board.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <span className="flex items-center gap-1">
                    <FaUserCircle />
                    {board.totalParticipants} participants
                  </span>
                  <span className="flex items-center gap-1">
                    <IoMdTrendingUp />
                    Top {Math.min(board.entries.length, 5)}
                  </span>
                </div>
              </div>
            </div>

            {/* Entries List */}
            <div className="p-6">
              <ul className="space-y-3">
                {board.entries.slice(0, 5).map((entry, i) => (
                  <motion.li
                    key={entry.userId._id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: i * 0.08,
                      duration: 0.4,
                      type: "spring",
                    }}
                    className="group"
                  >
                    <div className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getMedalIcon(i)}</span>
                          <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                            #{i + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <img
                            // src={getAvatarSrc(
                            //   entry.userId.avatar,
                            //   entry.userId.name
                            // )}
                            alt={entry.userId.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                entry.userId.name
                              )}&background=random&size=80`;
                            }}
                          />

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {entry.userId.name}
                              </span>
                              <button
                                onClick={() =>
                                  setUserProfileModal({
                                    user: entry.userId,
                                    entry,
                                  })
                                }
                                className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 transition-all duration-300 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                                title="View Profile"
                              >
                                <FaEye className="text-sm" />
                              </button>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <FaClock />
                                {formatTime(entry.completionTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaChartLine />
                                {entry.score}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-full shadow-lg">
                          {entry.score}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Enhanced Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setModalData(board)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 font-medium"
              >
                View Complete Rankings
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Modal Header */}
              <div
                className={`bg-gradient-to-r ${getDifficultyColor(
                  modalData.difficulty
                )} p-8 relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h2 className="text-4xl font-bold text-white flex items-center gap-4 mb-2">
                      <FaTrophy className="text-yellow-200" />
                      {modalData.subject} - {modalData.difficulty}
                    </h2>
                    <p className="text-white/90 text-lg">
                      Complete rankings • {modalData.totalParticipants} total
                      participants
                    </p>
                  </div>
                  <button
                    onClick={() => setModalData(null)}
                    className="text-white hover:text-red-200 transition-colors p-2 hover:bg-white/20 rounded-full"
                  >
                    <IoMdClose size={28} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto h-[calc(100%-140px)]">
                <div className="space-y-3">
                  {modalData.entries.map((entry, i) => (
                    <motion.div
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                      key={entry.userId._id}
                      className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getMedalIcon(i)}</span>
                          <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                            #{i + 1}
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-gray-800 dark:text-white text-xl block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {entry.userId.name}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {entry.userId.email}
                          </span>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <FaClock />
                              Time: {formatTime(entry.completionTime)}
                            </span>
                            <span>
                              Submitted:{" "}
                              {new Date(entry.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          {entry.score}%
                        </div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                          Score
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
