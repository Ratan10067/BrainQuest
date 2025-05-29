import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pastQueries, setPastQueries] = useState([]);
  const [isLoadingQueries, setIsLoadingQueries] = useState(true);
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);

  // Simulate fetching past queries
  useEffect(() => {
    fetchPastQueries();
  }, []);

  const fetchPastQueries = async () => {
    setIsLoadingQueries(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get token and userId from localStorage
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Debug: Check if token exists
      console.log("Token from localStorage:", token);
      console.log("UserId from localStorage:", userId);

      if (!token) {
        console.error("No token found in localStorage");
        // Handle missing token case
        return;
      }

      // Correct axios configuration - combine params and headers in single config object
      const response = await axios.get(
        "http://localhost:4000/contact/past-queries",
        {
          params: {
            userId: userId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Fetched past queries successfully:", response.data);

        // Process the response data
        const queries = response.data.queries.map((query) => ({
          ...query,
          createdAt: new Date(query.createdAt).toISOString(),
          resolvedAt: query.resolvedAt
            ? new Date(query.resolvedAt).toISOString()
            : null,
        }));

        console.log("Processed queries:", queries);
        setPastQueries(queries);
      } else {
        console.error("Error fetching queries:", response.data);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);

      // Check if it's an authentication error
      if (error.response?.status === 401) {
        console.error(
          "Authentication failed - token might be invalid or expired"
        );
        // Optionally redirect to login or refresh token
      }
    } finally {
      setIsLoadingQueries(false);
    }
  };

  const handleSubmit = async () => {
    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await axios.post(
        "http://localhost:4000/contact/submit-query",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Form submitted successfully:", response.data);
        setSubmitted(true);
        setIsSubmitting(false);
      } else {
        console.error("Error submitting form:", response.data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      return;
    }
  };

  const handleNewQuery = () => {
    setSubmitted(false);
    setShowNewQueryForm(true);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const updateQueryStatus = async (queryId, newStatus) => {
    try {
      // Simulate API call to update status
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPastQueries((prev) =>
        prev.map((query) =>
          query.id === queryId
            ? {
                ...query,
                status: newStatus,
                resolvedAt:
                  newStatus === "resolved" ? new Date().toISOString() : null,
              }
            : query
        )
      );
    } catch (error) {
      console.error("Error updating query status:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        text: "Pending",
      },
      in_progress: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: RefreshCw,
        text: "In Progress",
      },
      resolved: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Resolved",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
        >
          <div className="animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-4 bg-white/20 rounded w-1/3"></div>
              <div className="h-6 bg-white/20 rounded-full w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/20 rounded w-full"></div>
              <div className="h-3 bg-white/20 rounded w-2/3"></div>
            </div>
            <div className="mt-4 h-3 bg-white/20 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Support Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Having issues or questions? We're here to help! Submit a new query
            or check your previous submissions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Section - Contact Form */}
          <div className="xl:col-span-2 space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400/20 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">
                      support@brainquest.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400/20 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-400/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-medium">IIT KGP, 721302</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-white">
                        Submit New Query
                      </h2>
                      {showNewQueryForm && (
                        <button
                          onClick={() => setShowNewQueryForm(false)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                            placeholder="Your name"
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                            placeholder="your@email.com"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                          placeholder="How can we help?"
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subject: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 mb-2">
                          Message
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
                          placeholder="Describe your issue or question in detail..."
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="bg-green-400/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Query Submitted!
                    </h3>
                    <p className="text-gray-400 mb-8 text-lg">
                      We've received your message and will get back to you
                      within 24 hours.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNewQuery}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                      >
                        <Plus className="w-5 h-5" />
                        Submit Another Query
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fetchPastQueries()}
                        className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/20"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Refresh Queries
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Section - Past Queries */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 sticky top-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6" />
                  Your Queries
                </h2>
                <button
                  onClick={fetchPastQueries}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={isLoadingQueries}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${
                      isLoadingQueries ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>

              <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
                {isLoadingQueries ? (
                  <LoadingSkeleton />
                ) : pastQueries.length > 0 ? (
                  pastQueries.map((query) => (
                    <motion.div
                      key={query.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-white text-sm group-hover:text-yellow-400 transition-colors">
                          {query.subject}
                        </h3>
                        {getStatusBadge(query.status)}
                      </div>

                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                        {query.query}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Calendar className="w-3 h-3" />
                        {formatDate(query.createdAt)}
                      </div>

                      {query.status !== "resolved" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateQueryStatus(query.id, "resolved")
                            }
                            className="flex-1 py-1.5 px-3 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Resolved
                          </button>
                        </div>
                      )}

                      {query.status === "resolved" && query.resolvedAt && (
                        <div className="text-xs text-green-400 flex items-center gap-1 mt-2">
                          <CheckCircle className="w-3 h-3" />
                          Resolved on {formatDate(query.resolvedAt)}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No queries yet</p>
                    <p className="text-gray-500 text-sm">
                      Submit your first query to get started
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
