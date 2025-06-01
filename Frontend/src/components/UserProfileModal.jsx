import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const UserProfileModal = ({ user, onClose, leaderboardEntry }) => {
  console.log("Enhanced User Profile Modal Loading...");
  if (!user) return null;

  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const getAvatarSrc = (avatar) => {
    if (avatar && avatar !== "default-avatar.png") {
      return avatar.startsWith("http")
        ? avatar
        : `http://localhost:4000/uploads/${avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.name
    )}&background=gradient&size=400`;
  };

  const handleAddFriend = async () => {
    setIsLoading(true);
    try {
      // Backend integration placeholder
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setFriendRequestSent(true);
      // Add your backend API call here
      console.log("Friend request sent to:", user._id);
    } catch (error) {
      setError("Failed to send friend request");
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    bgColor,
    iconBg,
    delay = 0,
    trend,
  }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideUpVariants}
      transition={{ delay }}
      className={`${bgColor} p-6 rounded-2xl border transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
            {title}
          </p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs ${
                  trend > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div
          className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <i className={`${icon} text-white text-2xl`}></i>
        </div>
      </div>
    </motion.div>
  );

  const InfoCard = ({ label, value, icon, color = "blue" }) => (
    <motion.div
      whileHover={{ x: 5, scale: 1.02 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white mt-1 break-all">
            {value}
          </p>
        </div>
        <div
          className={`p-3 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <i
            className={`${icon} text-${color}-600 dark:text-${color}-400 text-xl`}
          ></i>
        </div>
      </div>
    </motion.div>
  );

  const TabButton = ({ tab, label, icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab)}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
      }`}
    >
      <i className={`${icon} text-sm`}></i>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  const AchievementBadge = ({
    title,
    description,
    icon,
    color,
    earned = false,
  }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
        earned
          ? `bg-gradient-to-br from-${color}-50 to-${color}-100 border-${color}-200 text-${color}-700`
          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
      }`}
    >
      <div className="text-center">
        <div
          className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
            earned ? `bg-${color}-500` : "bg-gray-400"
          }`}
        >
          <i className={`${icon} text-white text-lg`}></i>
        </div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs opacity-80 mt-1">{description}</p>
      </div>
    </motion.div>
  );

  const mockAchievements = [
    {
      title: "First Quiz",
      description: "Completed first quiz",
      icon: "fas fa-star",
      color: "yellow",
      earned: true,
    },
    {
      title: "Speed Demon",
      description: "Finished in under 2 mins",
      icon: "fas fa-bolt",
      color: "orange",
      earned: user.quizzesTaken > 5,
    },
    {
      title: "Perfect Score",
      description: "Achieved 100% score",
      icon: "fas fa-trophy",
      color: "gold",
      earned: false,
    },
    {
      title: "Quiz Master",
      description: "Completed 10+ quizzes",
      icon: "fas fa-crown",
      color: "purple",
      earned: user.quizzesTaken >= 10,
    },
  ];

  const mockRecentActivity = [
    {
      action: "Completed Quiz",
      subject: "JavaScript Basics",
      score: 85,
      time: "2 hours ago",
    },
    {
      action: "Joined Leaderboard",
      subject: "React Fundamentals",
      score: 92,
      time: "1 day ago",
    },
    {
      action: "Achieved Milestone",
      subject: "10 Quizzes Completed",
      score: null,
      time: "3 days ago",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 overflow-y-auto"
        onClick={onClose}
      >
        <div className="min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-7xl overflow-hidden border border-gray-700 my-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Integrated Close Button - Fixed Position */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-all duration-200 border border-gray-600"
              aria-label="Close profile modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-300 hover:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* Enhanced Header */}
            {/* Replace the header section with this updated version */}
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 sm:p-12 overflow-hidden">
              {/* Subtle animated background elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-800 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-800 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
                  <div className="flex items-center gap-2">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-100">
                      User Profile
                    </h2>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-blue-400"
                    >
                      <i className="fas fa-star text-2xl"></i>
                    </motion.div>
                  </div>

                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddFriend}
                      disabled={isLoading || friendRequestSent}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        friendRequestSent
                          ? "bg-green-600 text-white"
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600"
                      }`}
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : friendRequestSent ? (
                        <>
                          <i className="fas fa-check"></i>
                          <span>Request Sent</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus"></i>
                          <span>Add Friend</span>
                        </>
                      )}
                    </motion.button>

                    <button
                      onClick={onClose}
                      className="text-gray-300 hover:text-white transition-colors p-3 hover:bg-gray-700 rounded-full"
                    >
                      <i className="fas fa-times text-2xl"></i>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Profile Image and Basic Info */}
                  <div className="lg:col-span-1 text-center lg:text-left">
                    <motion.div
                      variants={scaleVariants}
                      initial="hidden"
                      animate="visible"
                      className="relative inline-block"
                    >
                      <img
                        src={getAvatarSrc(user.avatar)}
                        alt={user.name}
                        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-gray-700 shadow-2xl object-cover mx-auto lg:mx-0"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=gradient&size=400`;
                        }}
                      />
                      {leaderboardEntry && leaderboardEntry.rank <= 3 && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-lg">
                          #{leaderboardEntry.rank}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center border-4 border-gray-800">
                        <i className="fas fa-check text-white text-sm"></i>
                      </div>
                    </motion.div>
                  </div>

                  {/* User Details */}
                  <div className="lg:col-span-2 text-center lg:text-left">
                    <motion.div
                      variants={fadeInVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-2">
                        {user.name}
                      </h3>
                      <p className="text-gray-400 text-lg mb-1">{user.email}</p>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-500 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <i className="fas fa-calendar-alt"></i>
                          Member since{" "}
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="fas fa-map-marker-alt"></i>
                          {user.location || "Location not set"}
                        </span>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="text-center bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
                          <div className="text-2xl font-bold text-white">
                            {user.quizzesTaken || 0}
                          </div>
                          <div className="text-gray-400 text-sm">Quizzes</div>
                        </div>
                        <div className="text-center bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
                          <div className="text-2xl font-bold text-white">
                            {user.totalScore || 0}
                          </div>
                          <div className="text-gray-400 text-sm">
                            Total Score
                          </div>
                        </div>
                        <div className="text-center bg-gray-700/50 backdrop-blur-sm rounded-xl p-4 border border-gray-600">
                          <div className="text-2xl font-bold text-white">
                            {user.quizzesTaken && user.totalScore
                              ? Math.round(user.totalScore / user.quizzesTaken)
                              : 0}
                            %
                          </div>
                          <div className="text-gray-400 text-sm">Average</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <TabButton
                  tab="overview"
                  label="Overview"
                  icon="fas fa-home"
                  isActive={activeTab === "overview"}
                  onClick={setActiveTab}
                />
                <TabButton
                  tab="stats"
                  label="Statistics"
                  icon="fas fa-chart-bar"
                  isActive={activeTab === "stats"}
                  onClick={setActiveTab}
                />
                <TabButton
                  tab="achievements"
                  label="Achievements"
                  icon="fas fa-trophy"
                  isActive={activeTab === "achievements"}
                  onClick={setActiveTab}
                />
                <TabButton
                  tab="activity"
                  label="Activity"
                  icon="fas fa-history"
                  isActive={activeTab === "activity"}
                  onClick={setActiveTab}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8 sm:p-12">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* Contact Information */}
                    <div className="space-y-6">
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <i className="fas fa-user text-blue-600 dark:text-blue-400"></i>
                        </div>
                        Contact Information
                      </h4>

                      <div className="space-y-4">
                        <InfoCard
                          label="Email Address"
                          value={user.email}
                          icon="fas fa-envelope"
                          color="blue"
                        />
                        <InfoCard
                          label="Phone Number"
                          value={user.phone || "Not provided"}
                          icon="fas fa-phone"
                          color="green"
                        />
                        <InfoCard
                          label="Location"
                          value={user.location || "Not specified"}
                          icon="fas fa-map-marker-alt"
                          color="red"
                        />
                        <InfoCard
                          label="Join Date"
                          value={new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                          icon="fas fa-calendar-alt"
                          color="purple"
                        />
                      </div>
                    </div>

                    {/* Current Performance */}
                    <div className="space-y-6">
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <i className="fas fa-chart-line text-green-600 dark:text-green-400"></i>
                        </div>
                        Performance Overview
                      </h4>

                      {leaderboardEntry ? (
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                          <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Current Leaderboard Position
                          </h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                #{leaderboardEntry.rank}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Rank
                              </p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {leaderboardEntry.score}%
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Score
                              </p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl">
                              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                                {formatTime(leaderboardEntry.completionTime)}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Time
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
                          <i className="fas fa-chart-bar text-4xl text-gray-400 mb-4"></i>
                          <p className="text-gray-600 dark:text-gray-400">
                            No leaderboard data available
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "stats" && (
                  <motion.div
                    key="stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <i className="fas fa-chart-bar text-purple-600 dark:text-purple-400"></i>
                      </div>
                      Detailed Statistics
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <StatCard
                        title="Quizzes Completed"
                        value={user.quizzesTaken || 0}
                        icon="fas fa-clipboard-check"
                        bgColor="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-600 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700 dark:text-blue-400"
                        iconBg="bg-gradient-to-r from-blue-500 to-blue-600"
                        trend={15}
                      />
                      <StatCard
                        title="Total Points"
                        value={user.totalScore || 0}
                        icon="fas fa-star"
                        bgColor="bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-600 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700 dark:text-green-400"
                        iconBg="bg-gradient-to-r from-green-500 to-green-600"
                        trend={8}
                        delay={0.1}
                      />
                      <StatCard
                        title="Average Score"
                        value={`${
                          user.quizzesTaken && user.totalScore
                            ? Math.round(user.totalScore / user.quizzesTaken)
                            : 0
                        }%`}
                        icon="fas fa-percentage"
                        bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-600 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:border-yellow-700 dark:text-yellow-400"
                        iconBg="bg-gradient-to-r from-yellow-500 to-yellow-600"
                        trend={-3}
                        delay={0.2}
                      />
                      <StatCard
                        title="Best Streak"
                        value="7"
                        icon="fas fa-fire"
                        bgColor="bg-gradient-to-br from-red-50 to-red-100 border-red-200 text-red-600 dark:from-red-900/20 dark:to-red-800/20 dark:border-red-700 dark:text-red-400"
                        iconBg="bg-gradient-to-r from-red-500 to-red-600"
                        delay={0.3}
                      />
                      <StatCard
                        title="Perfect Scores"
                        value="3"
                        icon="fas fa-trophy"
                        bgColor="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-600 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700 dark:text-purple-400"
                        iconBg="bg-gradient-to-r from-purple-500 to-purple-600"
                        delay={0.4}
                      />
                      <StatCard
                        title="Time Saved"
                        value="2.5h"
                        icon="fas fa-clock"
                        bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600 dark:from-indigo-900/20 dark:to-indigo-800/20 dark:border-indigo-700 dark:text-indigo-400"
                        iconBg="bg-gradient-to-r from-indigo-500 to-indigo-600"
                        delay={0.5}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === "achievements" && (
                  <motion.div
                    key="achievements"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                        <i className="fas fa-trophy text-yellow-600 dark:text-yellow-400"></i>
                      </div>
                      Achievements & Badges
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                      {mockAchievements.map((achievement, index) => (
                        <AchievementBadge key={index} {...achievement} />
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center">
                      <i className="fas fa-medal text-6xl text-gray-400 mb-4"></i>
                      <h5 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        More achievements coming soon!
                      </h5>
                      <p className="text-gray-600 dark:text-gray-400">
                        Keep taking quizzes to unlock new badges and
                        achievements.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === "activity" && (
                  <motion.div
                    key="activity"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <i className="fas fa-history text-green-600 dark:text-green-400"></i>
                      </div>
                      Recent Activity
                    </h4>

                    <div className="space-y-4">
                      {mockRecentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-800 dark:text-white">
                                {activity.action}{" "}
                                <span className="text-blue-600 dark:text-blue-400">
                                  {activity.subject}
                                </span>
                              </h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <i className="far fa-clock mr-1"></i>
                                {activity.time}
                              </p>
                            </div>
                            {activity.score !== null && (
                              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                                {activity.score}%
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="text-center pt-8">
                      <button className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        <i className="fas fa-history mr-2"></i>
                        View Full Activity History
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Last updated: {new Date().toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <i className="fas fa-share-alt mr-2"></i>
                    Share Profile
                  </button>
                  <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    <i className="fas fa-flag mr-2"></i>
                    Report
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export default UserProfileModal;
