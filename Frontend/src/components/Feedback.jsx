import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageCircle,
  ThumbsUp,
  Calendar,
  User,
  Edit3,
  Trash2,
  Filter,
  Heart,
  MessageSquare,
  X,
  Send,
} from "lucide-react";
import axios from "axios";

export default function Feedback() {
  const [reviews, setReviews] = useState([
    {
      _id: "1",
      user: { name: "Alex Johnson" },
      rating: 5,
      comment:
        "Amazing platform! The AI-powered quizzes really helped me understand complex topics. The adaptive learning system is fantastic.",
      createdAt: "2024-01-15",
      likes: 12,
    },
    {
      _id: "2",
      user: { name: "Sarah Chen" },
      rating: 4,
      comment:
        "Great experience overall. The interface is intuitive and the progress tracking keeps me motivated. Would love to see more subjects added.",
      createdAt: "2024-01-14",
      likes: 8,
    },
    {
      _id: "3",
      user: { name: "Mike Rodriguez" },
      rating: 5,
      comment:
        "BrainQuest transformed my learning journey. The personalized recommendations and instant feedback make studying enjoyable and effective.",
      createdAt: "2024-01-13",
      likes: 15,
    },
    {
      _id: "4",
      user: { name: "Emma Wilson" },
      rating: 3,
      comment:
        "Good platform with solid features. Sometimes the questions can be repetitive, but overall it's helpful for exam preparation.",
      createdAt: "2024-01-12",
      likes: 5,
    },
  ]);
  const [userReview, setUserReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const reviewData = {
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: new Date().toISOString().split("T")[0],
      likes: 0,
    };
    try {
      const response = await axios.post(
        "http://localhost:4000/users/feedback",
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 201) {
        setReviews((prev) => [response.data, ...prev]);
        setUserReview(response.data);
        setShowReviewModal(false);
        setIsEditing(false);
        setNewReview({ rating: 0, comment: "" });
      } else {
        console.error("Failed to submit review:", response.data);
        alert("Failed to submit review. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleEditReview = () => {
    setNewReview({
      rating: userReview.rating,
      comment: userReview.comment,
    });
    setIsEditing(true);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async () => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      setReviews((prev) => prev.filter((r) => r._id !== userReview._id));
      setUserReview(null);
    }
  };

  const handleLikeReview = async (reviewId) => {
    setReviews((prev) =>
      prev.map((review) =>
        review._id === reviewId
          ? { ...review, likes: (review.likes || 0) + 1 }
          : review
      )
    );
  };

  useEffect(() => {
    const fetchPastReviews = async () => {
      const response = await axios.get(
        "http://localhost:4000/users/past-feedback",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        const userFeedback = response.data;
        console.log("Fetched user feedback:", userFeedback);
        setUserReview(userFeedback);
      }
    };
    fetchPastReviews();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  const getRatingText = (rating) => {
    const texts = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent",
    };
    return texts[rating] || "";
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border border-slate-700/50">
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl"
              >
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1 lg:mb-2">
                  User Feedback
                </h2>
                <p className="text-slate-300 text-sm sm:text-base lg:text-lg">
                  Share your experience and see what others think
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {!userReview ? (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewModal(true)}
                  className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                   text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Write a Review
                </motion.button>
              ) : (
                <div className="flex flex-col xs:flex-row w-full sm:w-auto gap-2 sm:gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditReview}
                    className="flex-1 xs:flex-none px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 
                     text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Edit Review
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteReview}
                    className="flex-1 xs:flex-none px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 
                     text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Delete
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* User's Review (if exists) */}
        {userReview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-800/30 to-purple-800/30 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-blue-500/30 mb-4 sm:mb-6 lg:mb-8"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
              Your Review
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      i < userReview.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-slate-600"
                    }`}
                  />
                ))}
                <span className="text-slate-300 ml-2 font-semibold text-sm sm:text-base">
                  {getRatingText(userReview.rating)}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {userReview.comment}
              </p>
              <div className="flex items-center text-slate-400 text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                {new Date(userReview.createdAt).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Section */}
        <motion.div className="bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 border border-slate-700/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <span className="text-slate-300 font-semibold text-sm sm:text-base">
                Filter by rating:
              </span>
            </div>
            <div className="grid grid-cols-3 xs:grid-cols-6 sm:flex gap-2 w-full sm:w-auto">
              {["all", "5", "4", "3", "2", "1"].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(rating)}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg lg:rounded-xl font-medium transition-all text-xs sm:text-sm ${
                    filter === rating
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                  }`}
                >
                  {rating === "all" ? "All" : `${rating} ★`}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/30 animate-pulse rounded-xl sm:rounded-2xl lg:rounded-3xl h-48 sm:h-56 lg:h-64 border border-slate-700/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl flex-shrink-0"
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-white truncate">
                          {review.user.name}
                        </h3>
                        <div className="flex items-center gap-1 sm:gap-2 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < review.rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                          <span className="text-slate-400 text-xs sm:text-sm ml-1 sm:ml-2 hidden xs:inline">
                            {getRatingText(review.rating)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1 sm:gap-2 bg-slate-800/50 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg flex-shrink-0 ml-2">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      <span className="xs:hidden">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </span>
                  </div>

                  <div className="bg-slate-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-slate-700/30">
                    <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                      {review.comment}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLikeReview(review._id)}
                      className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1.5 sm:gap-2 bg-slate-800/50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-red-500/10"
                    >
                      <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        {review.likes || 0}
                      </span>
                    </motion.button>
                    <div className="text-xs text-slate-500">
                      #{review._id.slice(-6)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredReviews.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 sm:py-12 lg:py-16"
          >
            <div className="bg-slate-800/30 rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-700/50">
              <MessageCircle className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-slate-300 mb-2">
                No Reviews Found
              </h3>
              <p className="text-slate-400 text-sm sm:text-base">
                {filter === "all"
                  ? "Be the first to share your experience!"
                  : `No ${filter}-star reviews yet.`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Enhanced Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowReviewModal(false);
                  setIsEditing(false);
                  setNewReview({ rating: 0, comment: "" });
                }
              }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl w-full max-w-2xl border border-slate-700/50 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={handleSubmitReview}>
                  {/* Modal Header */}
                  <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                        >
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </motion.div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                          {isEditing ? "Edit Your Review" : "Write a Review"}
                        </h2>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          setShowReviewModal(false);
                          setIsEditing(false);
                          setNewReview({ rating: 0, comment: "" });
                        }}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg sm:rounded-xl transition-all flex-shrink-0 ml-2"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                    {/* Rating Section */}
                    <div>
                      <label className="block text-slate-300 text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                        How would you rate your experience?
                      </label>
                      <div className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {[...Array(5)].map((_, i) => (
                          <motion.button
                            key={i}
                            type="button"
                            whileHover={{ scale: 1.2, y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: i + 1 })
                            }
                            onMouseEnter={() => setHoveredRating(i + 1)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none transition-all duration-200"
                          >
                            <Star
                              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 transition-all duration-200 ${
                                i < (hoveredRating || newReview.rating)
                                  ? "text-amber-400 fill-amber-400 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                                  : "text-slate-600 hover:text-slate-500"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      <AnimatePresence>
                        {(hoveredRating || newReview.rating) > 0 && (
                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center text-slate-400 text-lg sm:text-xl font-medium"
                          >
                            {getRatingText(hoveredRating || newReview.rating)}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Comment Section */}
                    <div>
                      <label className="block text-slate-300 text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                        Share your thoughts
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none placeholder:text-slate-500"
                        rows={4}
                        placeholder="Tell us about your experience with BrainQuest... What did you like most? Any suggestions for improvement?"
                        required
                      />
                      <p className="text-slate-500 text-xs sm:text-sm mt-2">
                        {newReview.comment.length}/500 characters
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 sm:p-6 border-t border-slate-700/50 flex flex-col xs:flex-row justify-end gap-3 sm:gap-4 bg-slate-900/30">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setIsEditing(false);
                        setNewReview({ rating: 0, comment: "" });
                      }}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 text-slate-300 font-semibold rounded-lg sm:rounded-xl hover:bg-slate-800/50 transition-all border border-slate-700/50 text-sm sm:text-base order-2 xs:order-1"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={
                        newReview.rating === 0 ||
                        newReview.comment.trim() === ""
                      }
                      className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                               text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-xl 
                               hover:shadow-blue-500/25 transition-all disabled:opacity-50 
                               disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base order-1 xs:order-2"
                    >
                      <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {isEditing ? "Update Review" : "Submit Review"}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
