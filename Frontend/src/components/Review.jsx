import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageCircle, ThumbsUp, Calendar } from "lucide-react";
import axios from "axios";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:4000/reviews");
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/reviews/add", newReview, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setShowReviewModal(false);
      fetchReviews();
      setNewReview({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white">User Reviews</h2>
          <p className="text-gray-400">
            See what others are saying about BrainQuest
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReviewModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 
                   text-white font-semibold rounded-xl flex items-center gap-2 
                   hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Write a Review
        </motion.button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/10 animate-pulse rounded-2xl h-48"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {review.user.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-300">{review.comment}</p>
              <div className="flex items-center gap-2 mt-4">
                <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">{review.likes}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#2c3250]/95 backdrop-blur-xl rounded-3xl w-full max-w-lg border border-white/20 overflow-hidden"
            >
              <form onSubmit={handleSubmitReview}>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Write a Review
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setNewReview({ ...newReview, rating: i + 1 })
                            }
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                i < newReview.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-500"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">
                        Comment
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview({
                            ...newReview,
                            comment: e.target.value,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400/50"
                        rows={4}
                        placeholder="Share your experience..."
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-white/10 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-6 py-2.5 rounded-xl font-semibold hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 
                             text-white font-semibold rounded-xl hover:shadow-lg 
                             hover:shadow-yellow-500/25 transition-all"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
