import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Calendar,
  Award,
  X,
  ChevronRight,
  Brain,
  Target,
  Trophy,
  Sparkles,
} from "lucide-react";
import SessionExpiredModal from "./SessionExpiredModal";

export default function QuizSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { questions, setQuestions, sessionExpired, setSessionExpired } =
    useContext(AuthContext);
  const [titleOfTheQuiz, setTitleOfTheQuiz] = useState("");
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const newQuizzes = [
    {
      id: 1,
      title: "Test Your Python Language",
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      description: "Master Python fundamentals and advanced concepts",
    },
    {
      id: 2,
      title: "Test Your C++ Language",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      description: "Challenge yourself with C++ programming",
    },
    {
      id: 3,
      title: "Test Your JavaScript Skills",
      icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
      description: "Enhance your JavaScript expertise",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchPastQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/quiz/past", {
          params: { userId: localStorage.getItem("userId") },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.status === 200) {
          setLoading(false);
          setPastQuizzes(response.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error(
            "Authentication failed - token might be invalid or expired"
          );
          setSessionExpired(true);
          // Optionally redirect to login or refresh token
        }
        console.error("Error fetching past quizzes:", error);
      }
    };
    fetchPastQuizzes();
  }, []);

  const formatTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const timeDiff = Math.floor((end - start) / 1000);
    const minutes = Math.floor(timeDiff / 60);
    const seconds = timeDiff % 60;
    return `${minutes}m ${seconds}s`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleStart = async () => {
    if (selectedQuiz && selectedDifficulty) {
      try {
        const response = await axios.get(`http://localhost:4000/quiz/start`, {
          params: {
            quizId: selectedQuiz,
            subject: "Python",
            difficulty: selectedDifficulty,
            title: titleOfTheQuiz,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setQuestions(response.data.questions);
          navigate(`/quiz-started/${response.data.quizId}`, {
            state: { quizId: selectedQuiz, difficulty: selectedDifficulty },
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error starting quiz:", error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center max-w-md border border-white/20"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl mb-6"
          >
            🧠
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">Login Required</h2>
          <p className="text-gray-300 mb-8">
            Start your journey of knowledge by signing in to access quizzes.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <NavLink
              to="/signin"
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 
                       text-white font-semibold rounded-xl inline-block 
                       hover:shadow-lg hover:shadow-yellow-500/25 transition-all"
            >
              Sign In
            </NavLink>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-white">Quiz Dashboard</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 
                     text-white font-semibold rounded-xl flex items-center gap-2 
                     hover:shadow-lg hover:shadow-yellow-500/25 transition-all cursor-pointer"
          >
            <Brain className="w-5 h-5" />
            Start New Quiz
          </motion.button>
        </div>

        {/* Past Quizzes Grid */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#2c3250]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Loading Your Quizzes
                </h3>
                <p className="text-gray-400 text-sm">
                  Please wait while we fetch your quiz history
                </p>
              </div>
            </div>
          </motion.div>
        ) : pastQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastQuizzes.map((quiz) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 
                       overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {quiz.Title}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Trophy className="w-4 h-4 mr-2" />
                      Score: {quiz.score}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2" />
                      Duration: {formatTime(quiz.startTime, quiz.endTime)}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(quiz.startTime)}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-white/5 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/results/${quiz._id}`)}
                    className="w-full py-2 bg-white/10 text-white rounded-xl 
                           hover:bg-white/20 transition-all flex items-center 
                           justify-center gap-2  cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    View Results
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 
                 flex items-center justify-center mx-auto mb-6"
            >
              <Brain className="w-12 h-12 text-yellow-400" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Start Your Learning Journey
            </h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Begin your quest for knowledge by taking your first quiz. Choose
              from various topics and difficulty levels.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 
               text-white font-semibold rounded-xl inline-flex items-center gap-2
               hover:shadow-lg hover:shadow-yellow-500/25 transition-all group"
            >
              Take Your First Quiz
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Quiz Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
                     flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white/10 backdrop-blur-xl rounded-3xl w-full max-w-4xl 
                       border border-white/20 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    Choose Your Challenge
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Quiz Types */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {newQuizzes.map((quiz) => (
                    <motion.button
                      key={quiz.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedQuiz(quiz.id);
                        setTitleOfTheQuiz(quiz.title);
                      }}
                      className={`p-6 rounded-xl border transition-all cursor-pointer ${
                        selectedQuiz === quiz.id
                          ? "border-yellow-400/50 bg-white/10"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center">
                        {quiz.icon}
                        <h3 className="text-lg font-semibold text-white mt-4">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-2">
                          {quiz.description}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Difficulty Selection */}
                <div className="flex flex-wrap justify-center gap-4">
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDifficulty(level)}
                      className={`px-6 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                        selectedDifficulty === level
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  disabled={!selectedQuiz || !selectedDifficulty}
                  className={`w-full py-3 rounded-xl font-semibold transition-all
                           flex items-center justify-center gap-2 cursor-pointer ${
                             selectedQuiz && selectedDifficulty
                               ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                               : "bg-white/10 text-gray-400 cursor-not-allowed"
                           }`}
                >
                  {selectedQuiz && selectedDifficulty ? (
                    <>
                      Start Quiz
                      <ChevronRight className="w-5 h-5" />
                    </>
                  ) : (
                    "Select quiz and difficulty"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {sessionExpired && <SessionExpiredModal />}
    </div>
  );
}
