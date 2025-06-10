import React, { useState, useEffect } from "react";
import SuccessModal from "./SuccessModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageCircle,
  Calendar,
  User,
  Edit3,
  Trash2,
  Filter,
  Heart,
  MessageSquare,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
export default function Feedback() {
  const [allReviews, setAllReviews] = useState([
    {
      _id: "1",
      user: { name: "John Doe", _id: "user1" },
      rating: 5,
      comment:
        "Absolutely amazing experience! The service exceeded all my expectations. The team was professional, responsive, and delivered exactly what was promised. I would definitely recommend this to anyone looking for quality service.",
      createdAt: new Date().toISOString(),
      likes: 12,
    },
    {
      _id: "2",
      user: { name: "Sarah Johnson", _id: "user2" },
      rating: 4,
      comment:
        "Very good overall. There were a few minor issues but nothing major. The support team was helpful in resolving them quickly.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 8,
    },
    {
      _id: "3",
      user: { name: "Mike Chen", _id: "user3" },
      rating: 3,
      comment:
        "Average experience. It does what it's supposed to do but could use some improvements in the user interface.",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      likes: 3,
    },
  ]);

  const [userReview, setUserReview] = useState({
    _id: "user-review",
    user: { name: "Current User", _id: "current-user" },
    rating: 4,
    comment:
      "This is my personal review of the service. I've been using it for a while now and I'm quite satisfied with the results. There's always room for improvement, but overall it's been a positive experience.",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    likes: 5,
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const [userReviews, setUserReviews] = useState([]);
  const [currentUserReviewIndex, setCurrentUserReviewIndex] = useState(0);

  // Add these functions
  const nextUserReview = () => {
    setCurrentUserReviewIndex((prev) => (prev + 1) % userReviews.length);
  };

  const prevUserReview = () => {
    setCurrentUserReviewIndex((prev) =>
      prev === 0 ? userReviews.length - 1 : prev - 1
    );
  };
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

        // Get all reviews by current user
        const currentUserReviews = allFeedbacks.filter(
          (feedback) => feedback.user?._id === currentUserId
        );

        // Set user's reviews
        setUserReviews(currentUserReviews);
        setUserReview(currentUserReviews[currentUserReviewIndex]);

        // Set other reviews
        setAllReviews(
          allFeedbacks.filter(
            (feedback) => feedback.user?._id !== currentUserId
          )
        );
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
        await fetchReviews();
        setShowReviewModal(false);
        setNewReview({ rating: 0, comment: "" });
        setIsEditing(false);
        setSuccessMessage(
          isEditing
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        setShowSuccess(true);
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

  const getRatingColor = (rating) => {
    const colors = {
      1: "from-red-500 to-red-600",
      2: "from-orange-500 to-orange-600",
      3: "from-yellow-500 to-yellow-600",
      4: "from-blue-500 to-blue-600",
      5: "from-green-500 to-green-600",
    };
    return colors[rating] || "from-gray-500 to-gray-600";
  };

  const filteredReviews = allReviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
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
        {/* Enhanced User's Review Card */}
        {userReviews.length > 0 && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-blue-800/40 via-purple-800/40 to-pink-800/40 
             backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-500/40 
             p-8 overflow-hidden group"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl" />

            {/* Navigation arrows if multiple reviews exist */}
            {userReviews.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevUserReview}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-800/80 
                   hover:bg-slate-700/80 rounded-full text-white shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextUserReview}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-slate-800/80 
                   hover:bg-slate-700/80 rounded-full text-white shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>

                <div className="absolute top-4 left-4 bg-slate-800/60 px-3 py-1 rounded-full">
                  <span className="text-slate-300 text-sm">
                    {currentUserReviewIndex + 1} / {userReviews.length}
                  </span>
                </div>
              </>
            )}

            {/* Review Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentUserReviewIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative space-y-6"
              >
                {/* ... Rest of your existing user review content, but using userReviews[currentUserReviewIndex] instead of userReview ... */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg"
                    >
                      <User className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        Your Review
                      </h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < userReviews[currentUserReviewIndex].rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`px-3 py-1 bg-gradient-to-r ${getRatingColor(
                            userReviews[currentUserReviewIndex].rating
                          )} text-white text-sm font-semibold rounded-full`}
                        >
                          {getRatingText(
                            userReviews[currentUserReviewIndex].rating
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleEditReview(userReviews[currentUserReviewIndex])
                      }
                      className="p-3 bg-emerald-600/60 hover:bg-emerald-600 rounded-xl backdrop-blur-sm transition-all duration-200 group"
                    >
                      <Edit3 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleDeleteReview(
                          userReviews[currentUserReviewIndex]._id
                        )
                      }
                      className="p-3 bg-red-600/60 hover:bg-red-600 rounded-xl backdrop-blur-sm transition-all duration-200 group"
                    >
                      <Trash2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </motion.button>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                  <p className="text-slate-200 leading-relaxed text-lg">
                    {userReviews[currentUserReviewIndex].comment}
                  </p>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(
                        userReviews[currentUserReviewIndex].createdAt
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm">
                        {userReviews[currentUserReviewIndex].likes} likes
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
        {/* Enhanced Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-300 font-semibold text-lg">
                Filter by rating:
              </span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {["all", "5", "4", "3", "2", "1"].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(rating)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    filter === rating
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50"
                  }`}
                >
                  {rating === "all" ? "All Reviews" : `${rating} ★`}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        {/* Enhanced Community Reviews Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white">Community Reviews</h3>
            <div className="bg-slate-700/50 px-3 py-1 rounded-full">
              <span className="text-slate-300 text-sm font-medium">
                {filteredReviews.length} reviews
              </span>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/30 animate-pulse rounded-3xl h-80 border border-slate-700/50"
                />
              ))}
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-gradient-to-br from-slate-800/60 via-slate-800/40 to-slate-900/60 
                           backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 
                           hover:border-slate-600/50 transition-all duration-500 group overflow-hidden"
                  >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`bg-gradient-to-r ${getRatingColor(
                              review.rating
                            )} p-3 rounded-2xl shadow-lg`}
                          >
                            <User className="w-6 h-6 text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {review.user?.name || "Anonymous"}
                            </h3>
                            <div className="flex items-center gap-2">
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
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 bg-gradient-to-r ${getRatingColor(
                              review.rating
                            )} text-white text-xs font-semibold rounded-full`}
                          >
                            {getRatingText(review.rating)}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400 text-xs">
                            <Clock className="w-3 h-3" />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/30">
                        <p className="text-slate-200 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <motion.button
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLikeReview(review._id)}
                          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors duration-200 group"
                        >
                          <div className="p-2 bg-red-500/10 group-hover:bg-red-500/20 rounded-xl transition-colors duration-200">
                            <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </div>
                          <span className="font-medium">
                            {review.likes || 0}
                          </span>
                        </motion.button>

                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <MessageCircle className="w-4 h-4" />
                          <span>Review</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-3">
                  No Reviews Found
                </h3>
                <p className="text-slate-400 text-lg max-w-md mx-auto">
                  {filter === "all"
                    ? "No reviews yet. Be the first to share your experience!"
                    : `No ${filter}-star reviews yet. Try a different filter.`}
                </p>
              </div>
            </motion.div>
          )}
        </div>
        {/* Enhanced Review Modal */}
        <AnimatePresence>
          {showReviewModal && (
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
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
                className="bg-gradient-to-br from-slate-800/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl 
                       rounded-3xl w-full max-w-2xl border border-slate-700/50 overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <form onSubmit={handleSubmitReview}>
                  <div className="p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white">
                          {isEditing ? "Edit Your Review" : "Write a Review"}
                        </h2>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          setShowReviewModal(false);
                          setIsEditing(false);
                          setNewReview({ rating: 0, comment: "" });
                        }}
                        className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50 transition-all duration-200"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    <div>
                      <label className="block text-slate-300 text-xl font-semibold mb-6">
                        How would you rate your experience?
                      </label>
                      <div className="flex justify-center gap-4 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <motion.button
                            key={i}
                            type="button"
                            whileHover={{ scale: 1.3, y: -8 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setNewReview({ ...newReview, rating: i + 1 })
                            }
                            onMouseEnter={() => setHoveredRating(i + 1)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="focus:outline-none transition-all duration-200"
                          >
                            <Star
                              className={`w-16 h-16 ${
                                i < (hoveredRating || newReview.rating)
                                  ? "text-amber-400 fill-amber-400 drop-shadow-lg"
                                  : "text-slate-600"
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                      {newReview.rating > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center"
                        >
                          <span
                            className={`px-6 py-2 bg-gradient-to-r ${getRatingColor(
                              newReview.rating
                            )} text-white text-xl font-bold rounded-full`}
                          >
                            {getRatingText(newReview.rating)}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xl font-semibold mb-4">
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
                        className="w-full bg-slate-800/60 border border-slate-600/50 rounded-2xl px-6 py-4 
                               text-white text-lg focus:outline-none focus:border-blue-500/50 
                               focus:ring-2 focus:ring-blue-500/20 resize-none backdrop-blur-sm
                               placeholder-slate-400"
                        rows={5}
                        placeholder="Tell us about your experience... What did you like? What could be improved?"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-8 border-t border-slate-700/50 flex justify-end gap-4 bg-slate-900/30">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowReviewModal(false);
                        setIsEditing(false);
                        setNewReview({ rating: 0, comment: "" });
                      }}
                      className="px-8 py-3 text-slate-300 font-semibold rounded-xl border border-slate-600/50 
                             hover:bg-slate-700/50 transition-all duration-200"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={
                        !newReview.rating ||
                        !newReview.comment.trim() ||
                        loading
                      }
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
      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
