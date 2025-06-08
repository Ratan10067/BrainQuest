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
import axios, { all } from "axios";

export default function Feedback() {
  const [allReviews, setAllReviews] = useState([]);
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

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:4000/users/past-feedback",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        const currentUserId = localStorage.getItem("userId");
        const allFeedbacks = response.data.feedbacks;
        console.log(allFeedbacks[0].user._id);
        const currentUserReview = allFeedbacks.find(
          (feedback) => feedback.user?._id === currentUserId
        );
        console.log(allFeedbacks[0]._id);
        console.log(currentUserReview);
        // Set all reviews except the user's own review
        setAllReviews(
          allFeedbacks.filter(
            (feedback) => feedback.userId?._id !== currentUserId
          )
        );

        // Set user's review if exists
        setUserReview(currentUserReview || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        isEditing && userReview
          ? `http://localhost:4000/users/feedback/${userReview._id}`
          : "http://localhost:4000/users/feedback";

      const method = isEditing ? "put" : "post";
      const response = await axios[method](
        endpoint,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === (isEditing ? 200 : 201)) {
        await fetchReviews(); // Refresh all reviews
        setShowReviewModal(false);
        setNewReview({ rating: 0, comment: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = async () => {
    if (userReview) {
      setNewReview({
        rating: userReview.rating,
        comment: userReview.comment,
      });
      setIsEditing(true);
      setShowReviewModal(true);
    }
    try {
      const endpoint =
        isEditing && userReview
          ? `http://localhost:4000/users/feedback/${userReview._id}`
          : "http://localhost:4000/users/feedback";

      const method = isEditing ? "put" : "post";
      const response = await axios[method](
        endpoint,
        {
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === (isEditing ? 200 : 201)) {
        await fetchReviews(); // Refresh all reviews
        setShowReviewModal(false);
        setNewReview({ rating: 0, comment: "" });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      setLoading(true);
      try {
        const response = await axios.delete(
          `http://localhost:4000/users/feedback/${userReview._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setUserReview(null);
          await fetchReviews(); // Refresh all reviews
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      await axios.post(
        `http://localhost:4000/users/feedback/${reviewId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchReviews(); // Refresh to get updated likes
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

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

  const filteredReviews = allReviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-slate-900/50 
                 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-700/30 
                 p-6 lg:p-8"
        >
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
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowReviewModal(true);
                  setIsEditing(false);
                  setNewReview({ rating: 0, comment: "" });
                }}
                className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-purple-600 
                 text-white font-semibold rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Write a Review
              </motion.button>
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
            <div className="flex justify-between items-start">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
                <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                Your Review
              </h3>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditReview}
                  className="p-2 bg-emerald-600/50 hover:bg-emerald-600 rounded-lg"
                >
                  <Edit3 className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteReview}
                  className="p-2 bg-red-600/50 hover:bg-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
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

        {/* All Reviews Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 sm:mb-6 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-purple-400" />
            Community Reviews
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/30 animate-pulse rounded-xl sm:rounded-2xl lg:rounded-3xl h-48 sm:h-56 lg:h-64 border border-slate-700/50"
                />
              ))}
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <AnimatePresence>
                {filteredReviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-slate-700/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl"
                        >
                          <User className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {review.user?.name || "Anonymous"}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
                      <p className="text-slate-200">{review.comment}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLikeReview(review._id)}
                        className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{review.likes || 0}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
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
                    ? "No reviews yet. Be the first to share your experience!"
                    : `No ${filter}-star reviews yet.`}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
              onClick={() => {
                setShowReviewModal(false);
                setIsEditing(false);
                setNewReview({ rating: 0, comment: "" });
              }}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl w-full max-w-2xl border border-slate-700/50 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={handleSubmitReview}>
                  <div className="p-4 sm:p-6 lg:p-8 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                        {isEditing ? "Edit Your Review" : "Write a Review"}
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReviewModal(false);
                          setIsEditing(false);
                          setNewReview({ rating: 0, comment: "" });
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                      >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
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
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${
                                i < (hoveredRating || newReview.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      {newReview.rating > 0 && (
                        <p className="text-center text-slate-400 text-lg sm:text-xl font-medium">
                          {getRatingText(newReview.rating)}
                        </p>
                      )}
                    </div>

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
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-white text-sm sm:text-base focus:outline-none focus:border-blue-500/50 resize-none"
                        rows={4}
                        placeholder="Tell us about your experience..."
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 border-t border-slate-700/50 flex justify-end gap-3 sm:gap-4 bg-slate-900/30">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setIsEditing(false);
                        setNewReview({ rating: 0, comment: "" });
                      }}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 text-slate-300 font-semibold rounded-lg sm:rounded-xl border border-slate-700/50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!newReview.rating || !newReview.comment.trim()}
                      className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
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
