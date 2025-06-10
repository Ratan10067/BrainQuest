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
  Search,
  Filter,
  ChevronDown,
  Atom,
  Beaker,
  FlaskConical,
  Dna,
  Earth,
  Newspaper,
  Activity,
  Microscope,
  Rocket,
  Heart,
  Leaf,
  Waves,
  Mountain,
  Sun,
  Moon,
  Code,
  Database,
  Cpu,
  HardDrive,
  Wifi,
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
  const [searchFilter, setSearchFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);
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
  const [subjectFilter, setSubjectFilter] = useState("");
  const programmingQuizzes = [
    {
      id: 1,
      title: "Test Your Python Language",
      icon: <Brain className="w-8 h-8 text-blue-500" />,
      description: "Master Python fundamentals and advanced concepts",
      subject: "Python",
    },
    {
      id: 2,
      title: "Test Your C++ Language",
      icon: <Target className="w-8 h-8 text-purple-500" />,
      description: "Challenge yourself with C++ programming",
      subject: "C++",
    },
    {
      id: 3,
      title: "Test Your JavaScript Skills",
      icon: <Sparkles className="w-8 h-8 text-yellow-500" />,
      description: "Enhance your JavaScript expertise",
      subject: "JavaScript",
    },
    {
      id: 4,
      title: "Test Your Java Programming",
      icon: <Code className="w-8 h-8 text-orange-500" />,
      description: "Master Java object-oriented programming",
      subject: "Java",
    },
    {
      id: 5,
      title: "Test Your React.js Skills",
      icon: <Cpu className="w-8 h-8 text-cyan-500" />,
      description: "Build modern web applications with React",
      subject: "React",
    },
    {
      id: 6,
      title: "Test Your Node.js Knowledge",
      icon: <Database className="w-8 h-8 text-green-500" />,
      description: "Backend development with Node.js",
      subject: "Node.js",
    },
    {
      id: 7,
      title: "Test Your SQL Database Skills",
      icon: <HardDrive className="w-8 h-8 text-indigo-500" />,
      description: "Master database queries and design",
      subject: "SQL",
    },
    {
      id: 8,
      title: "Test Your Data Structures",
      icon: <Wifi className="w-8 h-8 text-pink-500" />,
      description: "Arrays, Trees, Graphs and Algorithms",
      subject: "Data Structures",
    },
    {
      id: 9,
      title: "Machine Learning Quiz",
      icon: <Brain className="w-8 h-8 text-teal-500" />,
      description: "Test your knowledge of machine learning concepts",
      subject: "Machine Learning",
    },
    {
      id: 10,
      title: "Web Development Quiz",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      description: "HTML, CSS, JavaScript and more",
      subject: "Web Development",
    },
    {
      id: 11,
      title: "Cybersecurity Quiz",
      icon: <Shield className="w-8 h-8 text-red-500" />,
      description: "Network security, cryptography and ethical hacking",
      subject: "Cybersecurity",
    },
  ];

  const pyqCategories = [
    {
      id: "class-quizzes",
      title: "Class Quizzes (6-12)",
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      subjects: [
        {
          id: "class-6",
          name: "Class 6",
          icon: <BookOpen className="w-6 h-6" />,
        },
        {
          id: "class-7",
          name: "Class 7",
          icon: <BookOpen className="w-6 h-6" />,
        },
        {
          id: "class-8",
          name: "Class 8",
          icon: <BookOpen className="w-6 h-6" />,
        },
        {
          id: "class-9",
          name: "Class 9",
          icon: <BookOpen className="w-6 h-6" />,
        },
        {
          id: "class-10",
          name: "Class 10",
          icon: <BookOpen className="w-6 h-6" />,
        },
        {
          id: "class-11",
          name: "Class 11",
          icon: <GraduationCap className="w-6 h-6" />,
        },
        {
          id: "class-12",
          name: "Class 12",
          icon: <GraduationCap className="w-6 h-6" />,
        },
      ],
    },
    {
      id: "entrance-exams",
      title: "Entrance Examinations",
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      subjects: [
        {
          id: "jee-main",
          name: "JEE Main",
          icon: <Calculator className="w-6 h-6" />,
        },
        {
          id: "jee-advanced",
          name: "JEE Advanced",
          icon: <Trophy className="w-6 h-6" />,
        },
        { id: "neet", name: "NEET", icon: <Heart className="w-6 h-6" /> },
        {
          id: "neet-biology",
          name: "NEET Biology",
          icon: <Dna className="w-6 h-6" />,
        },
        {
          id: "neet-chemistry",
          name: "NEET Chemistry",
          icon: <FlaskConical className="w-6 h-6" />,
        },
        {
          id: "neet-physics",
          name: "NEET Physics",
          icon: <Atom className="w-6 h-6" />,
        },
        { id: "bitsat", name: "BITSAT", icon: <Cpu className="w-6 h-6" /> },
        { id: "gate", name: "GATE", icon: <Zap className="w-6 h-6" /> },
      ],
    },
    {
      id: "general-science",
      title: "General Science",
      icon: <Microscope className="w-8 h-8 text-green-500" />,
      subjects: [
        { id: "physics", name: "Physics", icon: <Atom className="w-6 h-6" /> },
        {
          id: "chemistry",
          name: "Chemistry",
          icon: <Beaker className="w-6 h-6" />,
        },
        { id: "biology", name: "Biology", icon: <Dna className="w-6 h-6" /> },
        {
          id: "mathematics",
          name: "Mathematics",
          icon: <Calculator className="w-6 h-6" />,
        },
        {
          id: "environmental-science",
          name: "Environmental Science",
          icon: <Leaf className="w-6 h-6" />,
        },
        {
          id: "earth-science",
          name: "Earth Science",
          icon: <Earth className="w-6 h-6" />,
        },
        {
          id: "space-science",
          name: "Space Science",
          icon: <Rocket className="w-6 h-6" />,
        },
        {
          id: "medical-science",
          name: "Medical Science",
          icon: <Activity className="w-6 h-6" />,
        },
      ],
    },
    {
      id: "current-affairs",
      title: "Current Affairs & GK",
      icon: <Newspaper className="w-8 h-8 text-red-500" />,
      subjects: [
        {
          id: "current-affairs-2024",
          name: "Current Affairs 2024",
          icon: <Newspaper className="w-6 h-6" />,
        },
        {
          id: "current-affairs-2023",
          name: "Current Affairs 2023",
          icon: <Calendar className="w-6 h-6" />,
        },
        {
          id: "world-geography",
          name: "World Geography",
          icon: <Globe className="w-6 h-6" />,
        },
        {
          id: "indian-history",
          name: "Indian History",
          icon: <Book className="w-6 h-6" />,
        },
        {
          id: "indian-polity",
          name: "Indian Polity",
          icon: <Scale className="w-6 h-6" />,
        },
        {
          id: "economics",
          name: "Economics",
          icon: <TrendingUp className="w-6 h-6" />,
        },
        {
          id: "sports-gk",
          name: "Sports GK",
          icon: <Trophy className="w-6 h-6" />,
        },
        {
          id: "technology-gk",
          name: "Technology GK",
          icon: <Cpu className="w-6 h-6" />,
        },
      ],
    },
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
          console.log("Past quizzes fetched successfully:", response.data);
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

  const filteredPastQuizzes = pastQuizzes.filter((quiz) => {
    const matchesSearch = quiz.Title.toLowerCase().includes(
      searchFilter.toLowerCase()
    );
    const matchesDifficulty =
      !difficultyFilter || quiz.difficulty === difficultyFilter;
    const matchesType = !typeFilter || quiz.quizType === typeFilter;
    const matchesSubject =
      !subjectFilter ||
      quiz.subject.toLowerCase() === subjectFilter.toLowerCase();
    return matchesSearch && matchesDifficulty && matchesType && matchesSubject;
  });

  const handleStart = async () => {
    setIsStartingQuiz(true);
    console.log("jwink", selectedSubject);

    if (
      selectedQuizType === "programming" &&
      selectedQuiz &&
      selectedDifficulty
    ) {
      try {
        const response = await axios.get(`http://localhost:4000/quiz/start`, {
          params: {
            quizId: selectedQuiz,
            subject: selectedSubject,
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
          setIsStartingQuiz(false);
        }
      } catch (error) {
        console.error("Error starting quiz:", error);
        setIsStartingQuiz(false);
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
          setIsStartingQuiz(false);
        }
      } catch (error) {
        console.error("Error starting PYQ quiz:", error);
        setIsStartingQuiz(false);
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

            {/* Past Quizzes Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Your Quiz History
                </h2>

                {/* Filter Controls */}
                {pastQuizzes.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/50 transition-all"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowFilters(!showFilters)}
                      className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          showFilters ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Filter Dropdown */}
              <AnimatePresence>
                {showFilters && pastQuizzes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 mb-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Difficulty
                        </label>
                        <select
                          value={difficultyFilter}
                          onChange={(e) => setDifficultyFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400/50"
                        >
                          <option value="">All Difficulties</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Type
                        </label>
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-yellow-400/50"
                        >
                          <option value="">All Types</option>
                          <option value="programming">Programming</option>
                          <option value="pyq">PYQ</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSearchFilter("");
                            setDifficultyFilter("");
                            setTypeFilter("");
                          }}
                          className="w-full px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
                        >
                          Clear Filters
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            ) : filteredPastQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPastQuizzes.map((quiz) => (
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
                        <h3 className="text-xl font-semibold text-white line-clamp-2">
                          {quiz.Title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full shrink-0">
                          {quiz.difficulty === "Easy" && (
                            <span className="text-green-400">Easy</span>
                          )}
                          {quiz.difficulty === "Medium" && (
                            <span className="text-yellow-400">Medium</span>
                          )}
                          {quiz.difficulty === "Hard" && (
                            <span className="text-red-400">Hard</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTime(quiz.startTime, quiz.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(quiz.endTime)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
                            {quiz.subject}
                          </span>
                          {quiz.quizType === "programming" ? (
                            <Code className="w-4 h-4 text-blue-400" />
                          ) : (
                            <GraduationCap className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="capitalize">{quiz.quizType}</span>
                        </div>
                        <div className="text-sm text-white/70">
                          Score: {quiz.score}%
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 px-6 py-3 flex justify-between items-center border-t border-white/10">
                      <div className="flex items-center gap-1 text-sm text-white/70">
                        {quiz.timerEnabled ? (
                          <>
                            <Timer className="w-4 h-4" />
                            <span>Timed</span>
                          </>
                        ) : (
                          <>
                            <TimerOff className="w-4 h-4" />
                            <span>Untimed</span>
                          </>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          navigate(`/results/${quiz._id}`, {
                            state: { quizData: quiz },
                          })
                        }
                        className="text-sm flex items-center gap-1 text-white hover:text-yellow-400 transition-colors"
                      >
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#2c3250]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-yellow-400" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-white">
                      No Quizzes Found
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {searchFilter || difficultyFilter || typeFilter
                        ? "Try adjusting your filters"
                        : "Start by taking your first quiz!"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      resetModal();
                      setSelectedQuizType("programming");
                      setIsModalOpen(true);
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 
                               text-white font-semibold rounded-xl flex items-center justify-center gap-2 
                               hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  >
                    <Brain className="w-5 h-5" />
                    Start Quiz
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Quiz Selection Modal */}
            {/* Quiz Selection Modal */}
            <AnimatePresence>
              {isModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                  onClick={() => setIsModalOpen(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="relative bg-gradient-to-br from-[#1a1f37] to-[#2c3250] backdrop-blur-lg 
                   rounded-2xl border border-white/20 p-6 max-w-2xl w-full shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold text-white mb-6">
                      {selectedQuizType === "programming"
                        ? "Programming Quiz"
                        : "Academic Practice"}
                    </h2>

                    <div className="space-y-6">
                      {/* Quiz Type Toggle */}
                      <div className="flex items-center justify-between bg-white/10 rounded-xl p-1">
                        <button
                          onClick={() => {
                            setSelectedQuizType("programming");
                            setSelectedCategory(null);
                            setSelectedSubject(null);
                          }}
                          className={`flex-1 py-2 rounded-lg transition-colors ${
                            selectedQuizType === "programming"
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <Code className="w-4 h-4" />
                            Programming
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQuizType("pyq");
                            setSelectedQuiz(null);
                          }}
                          className={`flex-1 py-2 rounded-lg transition-colors ${
                            selectedQuizType === "pyq"
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center justify-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            Academic
                          </div>
                        </button>
                      </div>

                      {/* Programming Quiz Selection */}
                      {selectedQuizType === "programming" && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">
                              Select Programming Language
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {programmingQuizzes.map((quiz) => (
                                <motion.button
                                  key={quiz.id}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => {
                                    setSelectedQuiz(quiz.id);
                                    setSelectedSubject(quiz.subject);
                                    setTitleOfTheQuiz(quiz.title);
                                  }}
                                  className={`p-3 rounded-xl border transition-all flex flex-col items-center ${
                                    selectedQuiz === quiz.id
                                      ? "border-blue-500 bg-blue-500/10"
                                      : "border-white/20 bg-white/5 hover:bg-white/10"
                                  }`}
                                >
                                  <div className="mb-2">{quiz.icon}</div>
                                  <span className="text-white text-sm font-medium text-center">
                                    {quiz.subject}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PYQ Quiz Selection */}
                      {selectedQuizType === "pyq" && (
                        <div className="space-y-4">
                          {/* Category Selection */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-3">
                              Select Exam Category
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {pyqCategories.map((category) => (
                                <motion.button
                                  key={category.id}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() => {
                                    setSelectedCategory(category.id);
                                    setSelectedSubject(null);
                                  }}
                                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                                    selectedCategory === category.id
                                      ? "border-yellow-500 bg-yellow-500/10"
                                      : "border-white/20 bg-white/5 hover:bg-white/10"
                                  }`}
                                >
                                  <div className="text-yellow-400">
                                    {category.icon}
                                  </div>
                                  <span className="text-white text-sm font-medium">
                                    {category.title}
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Subject Selection */}
                          {selectedCategory && (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-white">
                                  Select Subject
                                </label>
                                {selectedSubject && (
                                  <button
                                    onClick={() => setSelectedSubject(null)}
                                    className="text-xs text-yellow-400 hover:text-yellow-300"
                                  >
                                    Change subject
                                  </button>
                                )}
                              </div>

                              {!selectedSubject ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                  {pyqCategories
                                    .find((cat) => cat.id === selectedCategory)
                                    ?.subjects.map((subject) => (
                                      <motion.button
                                        key={subject.id}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() =>
                                          setSelectedSubject(subject.id)
                                        }
                                        className={`p-3 rounded-xl border transition-all flex flex-col items-center ${
                                          selectedSubject === subject.id
                                            ? "border-yellow-500 bg-yellow-500/10"
                                            : "border-white/20 bg-white/5 hover:bg-white/10"
                                        }`}
                                      >
                                        <div className="mb-2 text-yellow-400">
                                          {subject.icon}
                                        </div>
                                        <span className="text-white text-sm font-medium text-center">
                                          {subject.name}
                                        </span>
                                      </motion.button>
                                    ))}
                                </div>
                              ) : (
                                <div className="p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {
                                      pyqCategories
                                        .find(
                                          (cat) => cat.id === selectedCategory
                                        )
                                        ?.subjects.find(
                                          (sub) => sub.id === selectedSubject
                                        )?.icon
                                    }
                                    <span className="text-white font-medium">
                                      {
                                        pyqCategories
                                          .find(
                                            (cat) => cat.id === selectedCategory
                                          )
                                          ?.subjects.find(
                                            (sub) => sub.id === selectedSubject
                                          )?.name
                                      }
                                    </span>
                                  </div>
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Difficulty Selection */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-3">
                          Select Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {["Easy", "Medium", "Hard"].map((difficulty) => (
                            <motion.button
                              key={difficulty}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setSelectedDifficulty(difficulty)}
                              className={`py-3 rounded-xl border transition-all flex flex-col items-center ${
                                selectedDifficulty === difficulty
                                  ? difficulty === "Easy"
                                    ? "border-green-500 bg-green-500/10"
                                    : difficulty === "Medium"
                                    ? "border-yellow-500 bg-yellow-500/10"
                                    : "border-red-500 bg-red-500/10"
                                  : "border-white/20 bg-white/5 hover:bg-white/10"
                              }`}
                            >
                              {difficulty === "Easy" && (
                                <Sparkles className="w-5 h-5 mb-1 text-green-400" />
                              )}
                              {difficulty === "Medium" && (
                                <Target className="w-5 h-5 mb-1 text-yellow-400" />
                              )}
                              {difficulty === "Hard" && (
                                <Award className="w-5 h-5 mb-1 text-red-400" />
                              )}
                              <span
                                className={`text-sm font-medium ${
                                  selectedDifficulty === difficulty
                                    ? difficulty === "Easy"
                                      ? "text-green-400"
                                      : difficulty === "Medium"
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                    : "text-white"
                                }`}
                              >
                                {difficulty}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Timer Toggle */}
                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                          {timerEnabled ? (
                            <Timer className="w-5 h-5 text-blue-400" />
                          ) : (
                            <TimerOff className="w-5 h-5 text-gray-400" />
                          )}
                          <span className="text-white font-medium">
                            {timerEnabled ? "Timer Enabled" : "Timer Disabled"}
                          </span>
                        </div>
                        <button
                          onClick={() => setTimerEnabled(!timerEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            timerEnabled ? "bg-blue-500" : "bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              timerEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Start Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStart}
                        disabled={
                          isStartingQuiz ||
                          (selectedQuizType === "programming"
                            ? !selectedQuiz || !selectedDifficulty
                            : !selectedSubject || !selectedDifficulty)
                        }
                        className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                          isStartingQuiz ||
                          (selectedQuizType === "programming"
                            ? !selectedQuiz || !selectedDifficulty
                            : !selectedSubject || !selectedDifficulty)
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : selectedQuizType === "programming"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 text-white"
                            : "bg-gradient-to-r from-yellow-400 to-orange-500 hover:shadow-lg hover:shadow-yellow-500/25 text-white"
                        }`}
                      >
                        {isStartingQuiz ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Starting Quiz...
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            Start Quiz Now
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Session Expired Modal */}
      {sessionExpired && (
        <SessionExpiredModal
          isOpen={sessionExpired}
          onClose={() => setSessionExpired(false)}
        />
      )}
    </>
  );
}
