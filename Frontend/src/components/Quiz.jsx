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
  GraduationCap,
  FileText,
  Timer,
  TimerOff,
  Star,
  Users,
  Building,
  Scale,
  Briefcase,
  Shield,
  Zap,
  Book,
  Globe,
  Calculator,
  Lightbulb,
  Play,
  Gamepad2,
  CheckCircle,
  Circle,
  ArrowRight,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import SessionExpiredModal from "./SessionExpiredModal";
import ErrorState from "./ErrorState";

export default function QuizSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState("programming");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    questions,
    setQuestions,
    sessionExpired,
    setSessionExpired,
    serverError,
    setServerError,
  } = useContext(AuthContext);
  const [titleOfTheQuiz, setTitleOfTheQuiz] = useState("");
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const programmingQuizzes = [
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

  const pyqCategories = [
    {
      id: "upsc",
      title: "UPSC Examinations",
      icon: <Building className="w-8 h-8 text-red-500" />,
      subjects: [
        {
          id: "upsc-prelims",
          name: "UPSC Prelims",
          icon: <GraduationCap className="w-6 h-6" />,
        },
        {
          id: "upsc-mains",
          name: "UPSC Mains",
          icon: <FileText className="w-6 h-6" />,
        },
        {
          id: "upsc-history",
          name: "History",
          icon: <Book className="w-6 h-6" />,
        },
        {
          id: "upsc-geography",
          name: "Geography",
          icon: <Globe className="w-6 h-6" />,
        },
        {
          id: "upsc-polity",
          name: "Polity",
          icon: <Scale className="w-6 h-6" />,
        },
        {
          id: "upsc-economics",
          name: "Economics",
          icon: <Calculator className="w-6 h-6" />,
        },
      ],
    },
    {
      id: "ssc",
      title: "SSC Examinations",
      icon: <Users className="w-8 h-8 text-green-500" />,
      subjects: [
        { id: "ssc-cgl", name: "SSC CGL", icon: <Star className="w-6 h-6" /> },
        {
          id: "ssc-chsl",
          name: "SSC CHSL",
          icon: <FileText className="w-6 h-6" />,
        },
        {
          id: "ssc-mts",
          name: "SSC MTS",
          icon: <Briefcase className="w-6 h-6" />,
        },
        { id: "ssc-gd", name: "SSC GD", icon: <Shield className="w-6 h-6" /> },
      ],
    },
    {
      id: "banking",
      title: "Banking Exams",
      icon: <Briefcase className="w-8 h-8 text-blue-600" />,
      subjects: [
        {
          id: "ibps-po",
          name: "IBPS PO",
          icon: <Trophy className="w-6 h-6" />,
        },
        {
          id: "ibps-clerk",
          name: "IBPS Clerk",
          icon: <Users className="w-6 h-6" />,
        },
        { id: "sbi-po", name: "SBI PO", icon: <Star className="w-6 h-6" /> },
        {
          id: "sbi-clerk",
          name: "SBI Clerk",
          icon: <FileText className="w-6 h-6" />,
        },
        {
          id: "rbi-grade-b",
          name: "RBI Grade B",
          icon: <GraduationCap className="w-6 h-6" />,
        },
      ],
    },
    {
      id: "railway",
      title: "Railway Exams",
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      subjects: [
        {
          id: "rrb-ntpc",
          name: "RRB NTPC",
          icon: <Lightbulb className="w-6 h-6" />,
        },
        { id: "rrb-je", name: "RRB JE", icon: <Target className="w-6 h-6" /> },
        { id: "rrb-alp", name: "RRB ALP", icon: <Zap className="w-6 h-6" /> },
        {
          id: "rrb-group-d",
          name: "RRB Group D",
          icon: <Users className="w-6 h-6" />,
        },
      ],
    },
    {
      id: "state-exams",
      title: "State PSC Exams",
      icon: <Scale className="w-8 h-8 text-purple-500" />,
      subjects: [
        {
          id: "uppsc",
          name: "UPPSC",
          icon: <GraduationCap className="w-6 h-6" />,
        },
        { id: "bpsc", name: "BPSC", icon: <FileText className="w-6 h-6" /> },
        { id: "mpsc", name: "MPSC", icon: <Book className="w-6 h-6" /> },
        { id: "tnpsc", name: "TNPSC", icon: <Star className="w-6 h-6" /> },
        { id: "kpsc", name: "KPSC", icon: <Trophy className="w-6 h-6" /> },
      ],
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
        }
        console.log("error response", error.message);
        if (error?.message === "Network Error") {
          console.error("Network Error - Please check your connection");
          setServerError("Network Error - Please check your connection");
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
    if (
      selectedQuizType === "programming" &&
      selectedQuiz &&
      selectedDifficulty
    ) {
      try {
        const response = await axios.get(`http://localhost:4000/quiz/start`, {
          params: {
            quizId: selectedQuiz,
            subject: "Python",
            difficulty: selectedDifficulty,
            title: titleOfTheQuiz,
            timerEnabled: timerEnabled,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          setQuestions(response.data.questions);
          navigate(`/quiz-started/${response.data.quizId}`, {
            state: {
              quizId: selectedQuiz,
              difficulty: selectedDifficulty,
              timerEnabled: timerEnabled,
              quizType: "programming",
            },
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error starting quiz:", error);
      }
    } else if (
      selectedQuizType === "pyq" &&
      selectedSubject &&
      selectedDifficulty
    ) {
      try {
        const response = await axios.get(
          `http://localhost:4000/quiz/pyq/start`,
          {
            params: {
              subject: selectedSubject,
              difficulty: selectedDifficulty,
              timerEnabled: timerEnabled,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setQuestions(response.data.questions);
          navigate(`/quiz-started/${response.data.quizId}`, {
            state: {
              subject: selectedSubject,
              difficulty: selectedDifficulty,
              timerEnabled: timerEnabled,
              quizType: "pyq",
            },
          });
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error("Error starting PYQ quiz:", error);
      }
    }
  };

  const resetModal = () => {
    setSelectedQuiz(null);
    setSelectedDifficulty(null);
    setSelectedSubject(null);
    setSelectedQuizType("programming");
    setTitleOfTheQuiz("");
    setTimerEnabled(true);
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
    <>
      {serverError ? (
        <ErrorState error={serverError} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-8">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 sm:mb-12">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                  Quiz Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-300">
                  Challenge yourself with programming quizzes and PYQ
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetModal();
                    setSelectedQuizType("programming");
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 
               text-white font-semibold rounded-xl flex items-center justify-center gap-2 
               hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm sm:text-base cursor-pointer"
                >
                  <Brain className="w-5 h-5" />
                  Programming Quiz
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetModal();
                    setSelectedQuizType("pyq");
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 
               text-white font-semibold rounded-xl flex items-center justify-center gap-2 
               hover:shadow-lg hover:shadow-yellow-500/25 transition-all text-sm sm:text-base cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  PYQ Practice
                </motion.button>
              </div>
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
                    <div className="p-6 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {quiz.Title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
                          {quiz.quizType === "pyq" ? (
                            <FileText className="w-3 h-3" />
                          ) : (
                            <Brain className="w-3 h-3" />
                          )}
                          <span className="text-gray-300">
                            {quiz.quizType === "pyq" ? "PYQ" : "Code"}
                          </span>
                        </div>
                      </div>
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
                           justify-center gap-2 cursor-pointer"
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
                  Begin your quest for knowledge by taking your first quiz.
                  Choose from programming challenges or practice with previous
                  year questions.
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

          {/* Enhanced Quiz Selection Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 
           flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="bg-[#2c3250]/95 backdrop-blur-xl rounded-xl sm:rounded-3xl w-full max-w-[95%] sm:max-w-6xl 
             border border-white/20 overflow-hidden my-4 sm:my-8"
                >
                  <div className="p-4 sm:p-6 sticky top-0 z-20 bg-[#2c3250]/95 backdrop-blur-xl border-b border-white/10">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
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
                    {/* Quiz Type Selection */}
                    <div className="flex justify-center gap-4 mb-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedQuizType("programming")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          selectedQuizType === "programming"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <Brain className="w-5 h-5" />
                        Programming Quiz
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedQuizType("pyq")}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                          selectedQuizType === "pyq"
                            ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <GraduationCap className="w-5 h-5" />
                        PYQ Practice
                      </motion.button>
                    </div>

                    {/* Programming Quizzes */}
                    {selectedQuizType === "programming" && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {programmingQuizzes.map((quiz) => (
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
                                ? "border-blue-400/50 bg-white/10"
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
                    )}

                    {/* PYQ Categories */}
                    {selectedQuizType === "pyq" && (
                      <div className="space-y-4 sm:space-y-6 max-h-[60vh] overflow-y-auto">
                        {pyqCategories.map((category) => (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1a1f37]/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-3 mb-6">
                              <div className="p-3 rounded-xl bg-white/10">
                                {category.icon}
                              </div>
                              <h3 className="text-xl font-bold text-white">
                                {category.title}
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {category.subjects.map((subject) => (
                                <motion.button
                                  key={subject.id}
                                  whileHover={{ scale: 1.03, y: -2 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => setSelectedSubject(subject.id)}
                                  className={`p-4 rounded-xl transition-all duration-300 group relative ${
                                    selectedSubject === subject.id
                                      ? "bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50"
                                      : "bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2.5 rounded-lg transition-all duration-300 ${
                                        selectedSubject === subject.id
                                          ? "bg-yellow-400/20"
                                          : "bg-white/10 group-hover:bg-white/15"
                                      }`}
                                    >
                                      {subject.icon}
                                    </div>
                                    <span
                                      className={`font-medium ${
                                        selectedSubject === subject.id
                                          ? "text-yellow-400"
                                          : "text-white group-hover:text-yellow-400/80"
                                      }`}
                                    >
                                      {subject.name}
                                    </span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
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

                    {/* Timer Option */}
                    <div className="flex justify-center">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-4">
                          <span className="text-white font-medium">Timer:</span>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setTimerEnabled(true)}
                              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                                timerEnabled
                                  ? "bg-green-500 text-white"
                                  : "bg-white/10 text-gray-400 hover:bg-white/20"
                              }`}
                            >
                              <Timer className="w-4 h-4" />
                              Enabled
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setTimerEnabled(false)}
                              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                                !timerEnabled
                                  ? "bg-red-500 text-white"
                                  : "bg-white/10 text-gray-400 hover:bg-white/20"
                              }`}
                            >
                              <TimerOff className="w-4 h-4" />
                              Disabled
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-white/10 sticky bottom-0 bg-white/10 backdrop-blur-xl">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStart}
                      disabled={
                        !selectedDifficulty ||
                        (selectedQuizType === "programming" && !selectedQuiz) ||
                        (selectedQuizType === "pyq" && !selectedSubject)
                      }
                      className={`w-full py-3 rounded-xl font-semibold transition-all
                           flex items-center justify-center gap-2 cursor-pointer ${
                             selectedDifficulty &&
                             ((selectedQuizType === "programming" &&
                               selectedQuiz) ||
                               (selectedQuizType === "pyq" && selectedSubject))
                               ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                               : "bg-white/10 text-gray-400 cursor-not-allowed"
                           }`}
                    >
                      {selectedDifficulty &&
                      ((selectedQuizType === "programming" && selectedQuiz) ||
                        (selectedQuizType === "pyq" && selectedSubject)) ? (
                        <>
                          Start Quiz
                          <ChevronRight className="w-5 h-5" />
                        </>
                      ) : (
                        `Select ${
                          selectedQuizType === "programming"
                            ? "quiz"
                            : "subject"
                        } and difficulty`
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {sessionExpired && <SessionExpiredModal />}
        </div>
      )}
    </>
  );
}
