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
  Flame,
  Rocket,
  Crown,
  Diamond,
} from "lucide-react";
import SessionExpiredModal from "./SessionExpiredModal";

export default function QuizSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState("programming");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { questions, setQuestions, sessionExpired, setSessionExpired } =
    useContext(AuthContext);
  const [titleOfTheQuiz, setTitleOfTheQuiz] = useState("");
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const programmingQuizzes = [
    {
      id: 1,
      title: "Python Mastery",
      subtitle: "Master Python fundamentals and advanced concepts",
      icon: <Brain className="w-10 h-10" />,
      gradient: "from-blue-500 via-blue-600 to-purple-700",
      shadowColor: "shadow-blue-500/30",
      bgPattern: "bg-gradient-to-br from-blue-500/10 to-purple-700/10",
    },
    {
      id: 2,
      title: "C++ Excellence",
      subtitle: "Challenge yourself with C++ programming",
      icon: <Target className="w-10 h-10" />,
      gradient: "from-purple-500 via-purple-600 to-pink-700",
      shadowColor: "shadow-purple-500/30",
      bgPattern: "bg-gradient-to-br from-purple-500/10 to-pink-700/10",
    },
    {
      id: 3,
      title: "JavaScript Pro",
      subtitle: "Enhance your JavaScript expertise",
      icon: <Sparkles className="w-10 h-10" />,
      gradient: "from-yellow-400 via-orange-500 to-red-600",
      shadowColor: "shadow-yellow-500/30",
      bgPattern: "bg-gradient-to-br from-yellow-400/10 to-red-600/10",
    },
  ];

  const pyqCategories = [
    {
      id: "upsc",
      title: "UPSC Examinations",
      description: "Civil Services Preparation",
      icon: <Building className="w-12 h-12" />,
      gradient: "from-red-500 to-red-700",
      bgGradient: "from-red-500/5 to-red-700/10",
      subjects: [
        {
          id: "upsc-prelims",
          name: "UPSC Prelims",
          icon: <GraduationCap className="w-5 h-5" />,
          color: "text-red-400",
        },
        {
          id: "upsc-mains",
          name: "UPSC Mains",
          icon: <FileText className="w-5 h-5" />,
          color: "text-red-400",
        },
        {
          id: "upsc-history",
          name: "History",
          icon: <Book className="w-5 h-5" />,
          color: "text-red-400",
        },
        {
          id: "upsc-geography",
          name: "Geography",
          icon: <Globe className="w-5 h-5" />,
          color: "text-red-400",
        },
        {
          id: "upsc-polity",
          name: "Polity",
          icon: <Scale className="w-5 h-5" />,
          color: "text-red-400",
        },
        {
          id: "upsc-economics",
          name: "Economics",
          icon: <Calculator className="w-5 h-5" />,
          color: "text-red-400",
        },
      ],
    },
    {
      id: "ssc",
      title: "SSC Examinations",
      description: "Staff Selection Commission",
      icon: <Users className="w-12 h-12" />,
      gradient: "from-green-500 to-emerald-700",
      bgGradient: "from-green-500/5 to-emerald-700/10",
      subjects: [
        {
          id: "ssc-cgl",
          name: "SSC CGL",
          icon: <Star className="w-5 h-5" />,
          color: "text-green-400",
        },
        {
          id: "ssc-chsl",
          name: "SSC CHSL",
          icon: <FileText className="w-5 h-5" />,
          color: "text-green-400",
        },
        {
          id: "ssc-mts",
          name: "SSC MTS",
          icon: <Briefcase className="w-5 h-5" />,
          color: "text-green-400",
        },
        {
          id: "ssc-gd",
          name: "SSC GD",
          icon: <Shield className="w-5 h-5" />,
          color: "text-green-400",
        },
      ],
    },
    {
      id: "banking",
      title: "Banking Exams",
      description: "Financial Sector Careers",
      icon: <Briefcase className="w-12 h-12" />,
      gradient: "from-blue-600 to-indigo-700",
      bgGradient: "from-blue-600/5 to-indigo-700/10",
      subjects: [
        {
          id: "ibps-po",
          name: "IBPS PO",
          icon: <Trophy className="w-5 h-5" />,
          color: "text-blue-400",
        },
        {
          id: "ibps-clerk",
          name: "IBPS Clerk",
          icon: <Users className="w-5 h-5" />,
          color: "text-blue-400",
        },
        {
          id: "sbi-po",
          name: "SBI PO",
          icon: <Star className="w-5 h-5" />,
          color: "text-blue-400",
        },
        {
          id: "sbi-clerk",
          name: "SBI Clerk",
          icon: <FileText className="w-5 h-5" />,
          color: "text-blue-400",
        },
        {
          id: "rbi-grade-b",
          name: "RBI Grade B",
          icon: <Crown className="w-5 h-5" />,
          color: "text-blue-400",
        },
      ],
    },
    {
      id: "railway",
      title: "Railway Exams",
      description: "Indian Railways Recruitment",
      icon: <Zap className="w-12 h-12" />,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-500/5 to-red-600/10",
      subjects: [
        {
          id: "rrb-ntpc",
          name: "RRB NTPC",
          icon: <Lightbulb className="w-5 h-5" />,
          color: "text-orange-400",
        },
        {
          id: "rrb-je",
          name: "RRB JE",
          icon: <Target className="w-5 h-5" />,
          color: "text-orange-400",
        },
        {
          id: "rrb-alp",
          name: "RRB ALP",
          icon: <Zap className="w-5 h-5" />,
          color: "text-orange-400",
        },
        {
          id: "rrb-group-d",
          name: "RRB Group D",
          icon: <Users className="w-5 h-5" />,
          color: "text-orange-400",
        },
      ],
    },
    {
      id: "state-exams",
      title: "State PSC Exams",
      description: "State Public Service Commission",
      icon: <Scale className="w-12 h-12" />,
      gradient: "from-purple-600 to-violet-700",
      bgGradient: "from-purple-600/5 to-violet-700/10",
      subjects: [
        {
          id: "uppsc",
          name: "UPPSC",
          icon: <GraduationCap className="w-5 h-5" />,
          color: "text-purple-400",
        },
        {
          id: "bpsc",
          name: "BPSC",
          icon: <FileText className="w-5 h-5" />,
          color: "text-purple-400",
        },
        {
          id: "mpsc",
          name: "MPSC",
          icon: <Book className="w-5 h-5" />,
          color: "text-purple-400",
        },
        {
          id: "tnpsc",
          name: "TNPSC",
          icon: <Star className="w-5 h-5" />,
          color: "text-purple-400",
        },
        {
          id: "kpsc",
          name: "KPSC",
          icon: <Trophy className="w-5 h-5" />,
          color: "text-purple-400",
        },
      ],
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const categoryVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const subjectVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };
  const difficultyLevels = [
    {
      name: "Easy",
      icon: <Sparkles className="w-4 h-4" />,
      gradient: "from-green-400 to-green-600",
      description: "Perfect for beginners",
    },
    {
      name: "Medium",
      icon: <Flame className="w-4 h-4" />,
      gradient: "from-yellow-400 to-orange-500",
      description: "Good challenge level",
    },
    {
      name: "Hard",
      icon: <Diamond className="w-4 h-4" />,
      gradient: "from-red-500 to-red-700",
      description: "For advanced users",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1f37] to-[#2c3250] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 bg-white/10 backdrop-blur-2xl p-12 rounded-3xl shadow-2xl text-center max-w-md border border-white/20"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
            className="text-8xl mb-8 filter drop-shadow-lg"
          >
            🧠
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6"
          >
            Login Required
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300 mb-10 text-lg leading-relaxed"
          >
            Embark on your journey of knowledge by signing in to access premium
            quizzes and challenges.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink
              to="/signin"
              className="px-10 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                       text-white font-bold rounded-xl inline-block text-lg
                       hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300
                       relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </NavLink>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1f37] to-[#2c3250] p-4 lg:p-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6"
        >
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-4"
            >
              Quiz Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg lg:text-xl"
            >
              Challenge yourself with programming quizzes and competitive exam
              preparation
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.05, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetModal();
                setSelectedQuizType("programming");
                setIsModalOpen(true);
              }}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-700 
                       text-white font-semibold rounded-2xl flex items-center justify-center gap-3 
                       hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300
                       border border-blue-400/20 backdrop-blur-sm relative overflow-hidden group min-w-[200px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Brain className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Programming Quiz</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, rotateX: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                resetModal();
                setSelectedQuizType("pyq");
                setIsModalOpen(true);
              }}
              className="px-6 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
                       text-white font-semibold rounded-2xl flex items-center justify-center gap-3 
                       hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300
                       border border-orange-400/20 backdrop-blur-sm relative overflow-hidden group min-w-[200px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <GraduationCap className="w-6 h-6 relative z-10" />
              <span className="relative z-10">PYQ Practice</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Enhanced Past Quizzes Section */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-yellow-400/20 border-t-yellow-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                </motion.div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Loading Your Quiz Journey
                </h3>
                <p className="text-gray-400 text-lg">
                  Please wait while we fetch your personalized quiz history
                </p>
              </div>
            </div>
          </motion.div>
        ) : pastQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {pastQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, rotateX: 5 }}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 
                       overflow-hidden hover:shadow-2xl hover:shadow-white/10 transition-all duration-500
                       group relative"
              >
                {/* Card Header with Gradient */}
                <div className="p-6 pb-4 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight flex-1 mr-4">
                      {quiz.Title}
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full backdrop-blur-sm border ${
                        quiz.quizType === "pyq"
                          ? "bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30 text-yellow-300"
                          : "bg-gradient-to-r from-blue-400/20 to-purple-500/20 border-blue-400/30 text-blue-300"
                      }`}
                    >
                      {quiz.quizType === "pyq" ? (
                        <FileText className="w-3 h-3" />
                      ) : (
                        <Brain className="w-3 h-3" />
                      )}
                      <span className="font-medium">
                        {quiz.quizType === "pyq" ? "PYQ" : "CODE"}
                      </span>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-300 group/item"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 flex items-center justify-center mr-4 group-hover/item:from-yellow-400/30 group-hover/item:to-orange-500/30 transition-all">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                      </div>
                      <div>
                        <span className="text-white font-semibold text-lg">
                          {quiz.score}
                        </span>
                        <span className="text-gray-400 ml-2">points</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-300 group/item"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 flex items-center justify-center mr-4 group-hover/item:from-blue-400/30 group-hover/item:to-purple-500/30 transition-all">
                        <Clock className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-white font-semibold">
                          {formatTime(quiz.startTime, quiz.endTime)}
                        </span>
                        <span className="text-gray-400 ml-2">duration</span>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center text-gray-300 group/item"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 flex items-center justify-center mr-4 group-hover/item:from-green-400/30 group-hover/item:to-emerald-500/30 transition-all">
                        <Calendar className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <span className="text-white font-semibold">
                          {formatDate(quiz.startTime)}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-white/5 border-t border-white/10 backdrop-blur-sm">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/results/${quiz._id}`)}
                    className="w-full py-3 bg-gradient-to-r from-white/10 to-white/20 text-white rounded-2xl 
                           hover:from-white/20 hover:to-white/30 transition-all duration-300 flex items-center 
                           justify-center gap-3 font-semibold border border-white/10 backdrop-blur-sm
                           group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <Award className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">View Detailed Results</span>
                    <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 shadow-2xl text-center"
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Quiz History Yet
              </h3>
              <p className="text-gray-400 mb-8 max-w-md">
                You haven't taken any quizzes yet. Start your first quiz now to
                track your progress and see your results here.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  resetModal();
                  setSelectedQuizType("programming");
                  setIsModalOpen(true);
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                       rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 
                       transition-all duration-300 flex items-center gap-3"
              >
                <Rocket className="w-5 h-5" />
                Start Your First Quiz
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Quiz Selection Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="bg-gradient-to-br from-[#1a1f37] to-[#2c3250] rounded-3xl p-6 w-full max-w-2xl 
                       border border-white/10 shadow-2xl relative max-h-[75vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
                         transition-colors text-gray-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">
                  {selectedQuizType === "programming"
                    ? "Programming Quiz"
                    : "PYQ Practice"}{" "}
                  Settings
                </h2>

                {selectedQuizType === "programming" ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">
                        Select Quiz
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {programmingQuizzes.map((quiz) => (
                          <motion.button
                            key={quiz.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedQuiz(quiz.id);
                              setTitleOfTheQuiz(quiz.title);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 
                                    ${
                                      selectedQuiz === quiz.id
                                        ? `border-white bg-gradient-to-br ${quiz.bgPattern} shadow-lg ${quiz.shadowColor}`
                                        : "border-white/10 bg-white/5 hover:border-white/20"
                                    }`}
                          >
                            <div
                              className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${quiz.bgPattern}`}
                            >
                              {quiz.icon}
                            </div>
                            <h4 className="text-white font-semibold text-left">
                              {quiz.title}
                            </h4>
                            <p className="text-gray-400 text-sm text-left mt-1">
                              {quiz.subtitle}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // <div className="space-y-8">
                  //   <div>
                  //     <h3 className="text-lg font-semibold text-gray-300 mb-4">
                  //       Select Exam Category
                  //     </h3>
                  //     <div className="space-y-4">
                  //       {pyqCategories.map((category) => (
                  //         <div
                  //           key={category.id}
                  //           className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                  //         >
                  //           <div
                  //             className={`p-4 bg-gradient-to-r ${category.gradient} flex items-center gap-4`}
                  //           >
                  //             <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  //               {category.icon}
                  //             </div>
                  //             <div>
                  //               <h4 className="text-white font-bold">
                  //                 {category.title}
                  //               </h4>
                  //               <p className="text-white/80 text-sm">
                  //                 {category.description}
                  //               </p>
                  //             </div>
                  //           </div>
                  //           <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  //             {category.subjects.map((subject) => (
                  //               <motion.button
                  //                 key={subject.id}
                  //                 whileHover={{ scale: 1.02 }}
                  //                 whileTap={{ scale: 0.98 }}
                  //                 onClick={() => setSelectedSubject(subject.id)}
                  //                 className={`p-3 rounded-lg text-left transition-all ${
                  //                   selectedSubject === subject.id
                  //                     ? "bg-white/10 border border-white/20"
                  //                     : "bg-white/5 hover:bg-white/10 border border-white/5"
                  //                 }`}
                  //               >
                  //                 <div className="flex items-center gap-3">
                  //                   <div
                  //                     className={`p-2 rounded-full ${subject.color.replace(
                  //                       "text",
                  //                       "bg"
                  //                     )}/20`}
                  //                   >
                  //                     {subject.icon}
                  //                   </div>
                  //                   <span className="text-white font-medium">
                  //                     {subject.name}
                  //                   </span>
                  //                 </div>
                  //               </motion.button>
                  //             ))}
                  //           </div>
                  //         </div>
                  //       ))}
                  //     </div>
                  //   </div>
                  // </div>
                  <div className="max-w-7xl mx-auto space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-300 mb-4">
                        Select Exam Category
                      </h3>

                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {pyqCategories.map((category, categoryIndex) => (
                          <motion.div
                            key={category.id}
                            variants={categoryVariants}
                            className="bg-white/5 rounded-xl overflow-hidden border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-300 group"
                            style={{
                              transform: `translateY(${
                                scrollY * 0.015 * (categoryIndex + 1)
                              }px)`,
                            }}
                          >
                            {/* Category Header */}
                            <motion.div
                              className={`p-4 bg-gradient-to-r ${category.gradient} relative overflow-hidden`}
                              whileHover={{ scale: 1.005 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                              {/* Animated gradient overlay */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full"
                                animate={{
                                  translateX: ["-100%", "100%"],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "linear",
                                  repeatDelay: 2,
                                }}
                              />

                              <div className="relative flex items-center gap-4 z-10">
                                <motion.div
                                  className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20"
                                  whileHover={{
                                    scale: 1.1,
                                    rotate: 5,
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="text-white">
                                    {category.icon}
                                  </div>
                                </motion.div>
                                <div>
                                  <h4 className="text-white font-bold text-lg">
                                    {category.title}
                                  </h4>
                                  <p className="text-white/80 text-sm">
                                    {category.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>

                            {/* Subjects Grid */}
                            <div
                              className={`p-4 bg-gradient-to-br ${category.bgGradient}`}
                            >
                              <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                                variants={containerVariants}
                              >
                                {category.subjects.map((subject) => (
                                  <motion.button
                                    key={subject.id}
                                    variants={subjectVariants}
                                    whileHover={{
                                      scale: 1.03,
                                      y: -3,
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() =>
                                      setSelectedSubject(subject.id)
                                    }
                                    className={`p-3 rounded-lg text-left transition-all duration-300 group/subject relative overflow-hidden ${
                                      selectedSubject === subject.id
                                        ? "bg-white/20 border border-white/30 shadow-lg"
                                        : "bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20"
                                    }`}
                                  >
                                    {/* Selection indicator */}
                                    {selectedSubject === subject.id && (
                                      <motion.div
                                        layoutId="selection-indicator"
                                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                      />
                                    )}

                                    {/* Hover glow effect */}
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover/subject:opacity-100 transition-opacity duration-300"
                                      animate={{
                                        x: ["-100%", "100%"],
                                      }}
                                      transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                      }}
                                    />

                                    <div className="relative flex items-center gap-3 z-10">
                                      <motion.div
                                        className={`p-2 rounded-full bg-white/10 group-hover/subject:bg-white/20 border border-white/20 ${subject.color} transition-all duration-300`}
                                        whileHover={{ rotate: 180 }}
                                        transition={{ duration: 0.4 }}
                                      >
                                        {subject.icon}
                                      </motion.div>
                                      <div className="flex-1">
                                        <span
                                          className={`font-medium ${subject.color} group-hover/subject:text-white transition-colors duration-300`}
                                        >
                                          {subject.name}
                                        </span>
                                        {selectedSubject === subject.id && (
                                          <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-green-400 text-xs mt-1 flex items-center gap-1"
                                          >
                                            <motion.div
                                              className="w-1.5 h-1.5 bg-green-400 rounded-full"
                                              animate={{ scale: [1, 1.3, 1] }}
                                              transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                              }}
                                            />
                                            Selected
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>
                                  </motion.button>
                                ))}
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>

                    {/* Selection Status */}
                    <AnimatePresence>
                      {selectedSubject && (
                        <motion.div
                          initial={{ opacity: 0, y: 50, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 50, scale: 0.9 }}
                          className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-xl shadow-2xl"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              className="w-3 h-3 bg-green-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="font-medium">
                              Subject Selected!
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      {timerEnabled ? (
                        <Timer className="w-5 h-5 text-blue-400" />
                      ) : (
                        <TimerOff className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="text-white font-medium">
                        Timer: {timerEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <button
                      onClick={() => setTimerEnabled(!timerEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                              ${timerEnabled ? "bg-blue-500" : "bg-gray-600"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform 
                                ${
                                  timerEnabled
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-10 flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 bg-white/5 text-white rounded-xl border border-white/10 
                           hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleStart}
                    disabled={
                      (selectedQuizType === "programming" && !selectedQuiz) ||
                      (selectedQuizType === "pyq" && !selectedSubject) ||
                      !selectedDifficulty
                    }
                    className={`px-8 py-3 rounded-xl font-semibold transition-all 
                            ${
                              (selectedQuizType === "programming" &&
                                !selectedQuiz) ||
                              (selectedQuizType === "pyq" &&
                                !selectedSubject) ||
                              !selectedDifficulty
                                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30"
                            }`}
                  >
                    Start Quiz
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session Expired Modal */}
        {sessionExpired && <SessionExpiredModal />}
      </div>
    </div>
  );
}
