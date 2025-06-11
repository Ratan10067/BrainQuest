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
  ChevronLeft,
  Home,
} from "lucide-react";
import SessionExpiredModal from "./SessionExpiredModal";
import ErrorState from "./ErrorState";
import ChatBot from "./ChatBot";

export default function QuizSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedQuizType, setSelectedQuizType] = useState("programming");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentView, setCurrentView] = useState("main"); // main, category, subjects, quiz-setup

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
    timerEnabled,
    setTimerEnabled,
  } = useContext(AuthContext);
  const [titleOfTheQuiz, setTitleOfTheQuiz] = useState("");
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState("");

  // Programming quizzes data
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

  // Academic categories with subjects
  const academicCategories = [
    {
      id: "school-classes",
      title: "School Classes (6-12)",
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      description: "Study materials for class 6 to 12",
      gradient: "from-blue-500 to-purple-600",
      classes: [
        {
          id: "class-6",
          name: "Class 6",
          subjects: [
            "Mathematics",
            "Science",
            "Social Science",
            "English",
            "Hindi",
            "Sanskrit",
          ],
        },
        {
          id: "class-7",
          name: "Class 7",
          subjects: [
            "Mathematics",
            "Science",
            "Social Science",
            "English",
            "Hindi",
            "Sanskrit",
          ],
        },
        {
          id: "class-8",
          name: "Class 8",
          subjects: [
            "Mathematics",
            "Science",
            "Social Science",
            "English",
            "Hindi",
            "Sanskrit",
          ],
        },
        {
          id: "class-9",
          name: "Class 9",
          subjects: [
            "Mathematics",
            "Science",
            "Social Science",
            "English",
            "Hindi",
            "Sanskrit",
            "Computer Science",
          ],
        },
        {
          id: "class-10",
          name: "Class 10",
          subjects: [
            "Mathematics",
            "Science",
            "Social Science",
            "English",
            "Hindi",
            "Sanskrit",
            "Computer Science",
          ],
        },
        {
          id: "class-11",
          name: "Class 11",
          subjects: [
            "Physics",
            "Chemistry",
            "Mathematics",
            "Biology",
            "English",
            "Computer Science",
            "Economics",
            "Business Studies",
            "Accountancy",
            "Political Science",
            "History",
            "Geography",
          ],
        },
        {
          id: "class-12",
          name: "Class 12",
          subjects: [
            "Physics",
            "Chemistry",
            "Mathematics",
            "Biology",
            "English",
            "Computer Science",
            "Economics",
            "Business Studies",
            "Accountancy",
            "Political Science",
            "History",
            "Geography",
          ],
        },
      ],
    },
    {
      id: "competitive-exams",
      title: "Competitive Exams",
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      description: "JEE, NEET, BITSAT and more",
      gradient: "from-yellow-400 to-orange-500",
      exams: [
        {
          id: "jee-main",
          name: "JEE Main",
          subjects: ["Physics", "Chemistry", "Mathematics"],
        },
        {
          id: "jee-advanced",
          name: "JEE Advanced",
          subjects: ["Physics", "Chemistry", "Mathematics"],
        },
        {
          id: "neet",
          name: "NEET",
          subjects: ["Physics", "Chemistry", "Biology"],
        },
        {
          id: "bitsat",
          name: "BITSAT",
          subjects: [
            "Physics",
            "Chemistry",
            "Mathematics",
            "English",
            "Logical Reasoning",
          ],
        },
        {
          id: "gate",
          name: "GATE",
          subjects: [
            "Computer Science",
            "Electronics",
            "Mechanical",
            "Civil",
            "Electrical",
          ],
        },
      ],
    },
    {
      id: "government-exams",
      title: "Government Exams",
      icon: <Building className="w-8 h-8 text-green-500" />,
      description: "UPSC, SSC, Banking and Railway",
      gradient: "from-green-500 to-emerald-600",
      departments: [
        {
          id: "upsc",
          name: "UPSC",
          subjects: [
            "General Studies",
            "History",
            "Geography",
            "Polity",
            "Economics",
            "Environment",
            "Current Affairs",
          ],
        },
        {
          id: "ssc",
          name: "SSC",
          subjects: [
            "General Knowledge",
            "Reasoning",
            "Quantitative Aptitude",
            "English",
            "Current Affairs",
          ],
        },
        {
          id: "banking",
          name: "Banking",
          subjects: [
            "Reasoning",
            "Quantitative Aptitude",
            "English",
            "General Awareness",
            "Computer Knowledge",
          ],
        },
        {
          id: "railway",
          name: "Railway",
          subjects: [
            "General Awareness",
            "Arithmetic",
            "Reasoning",
            "General Science",
            "Technical",
          ],
        },
      ],
    },
    {
      id: "general-knowledge",
      title: "General Knowledge",
      icon: <Newspaper className="w-8 h-8 text-red-500" />,
      description: "Current Affairs, History, Geography",
      gradient: "from-red-500 to-pink-600",
      topics: [
        {
          id: "current-affairs",
          name: "Current Affairs",
          subjects: [
            "National News",
            "International News",
            "Sports",
            "Awards",
            "Economy",
          ],
        },
        {
          id: "history",
          name: "History",
          subjects: [
            "Ancient History",
            "Medieval History",
            "Modern History",
            "World History",
          ],
        },
        {
          id: "geography",
          name: "Geography",
          subjects: [
            "Physical Geography",
            "Human Geography",
            "Indian Geography",
            "World Geography",
          ],
        },
        {
          id: "science-gk",
          name: "Science GK",
          subjects: [
            "Physics",
            "Chemistry",
            "Biology",
            "Technology",
            "Space Science",
          ],
        },
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
    } else if (
      selectedQuizType === "academic" &&
      selectedQuiz &&
      selectedSubject
    ) {
      console.log("yaha aaye toh hai pr selectedQuiz", selectedQuiz);
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
              quizType: "academic",
            },
          });
          setIsModalOpen(false);
          setIsStartingQuiz(false);
        }
      } catch (error) {
        console.error("Error starting academic quiz:", error);
        setIsStartingQuiz(false);
      }
    }
  };

  const resetSelection = () => {
    setSelectedQuiz(null);
    setSelectedDifficulty(null);
    setSelectedSubject(null);
    setSelectedCategory(null);
    setSelectedQuizType("programming");
    setTitleOfTheQuiz("");
    setTimerEnabled(true);
    setCurrentView("main");
  };

  const handleCategorySelect = (categoryId, quizType = "academic") => {
    setSelectedCategory(categoryId);
    setSelectedQuizType(quizType);
    setCurrentView("subjects");
  };

  const handleProgrammingSelect = () => {
    setSelectedQuizType("programming");
    setCurrentView("programming");
  };

  const handleSubjectSelect = (
    subject,
    category = null,
    subCategory = null
  ) => {
    setSelectedSubject(subject);
    if (category) setSelectedCategory(category);
    if (subCategory) setSelectedQuiz(subCategory);
    setCurrentView("quiz-setup");
  };

  const handleBack = () => {
    if (currentView === "subjects") {
      setCurrentView("main");
      setSelectedCategory(null);
    } else if (currentView === "quiz-setup") {
      setCurrentView("subjects");
      setSelectedSubject(null);
    } else if (currentView === "programming") {
      setCurrentView("main");
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

  const renderMainView = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
          Choose Your Quiz Category
        </h1>
        <p className="text-gray-300 text-lg">
          Select from programming challenges or academic subjects
        </p>
      </div>

      {/* Programming Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20"
      >
        <div className="flex items-center gap-4 mb-6">
          <Code className="w-10 h-10 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">
              Programming Challenges
            </h2>
            <p className="text-gray-300">
              Test your coding skills in various languages
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProgrammingSelect}
          className="w-full p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl
                     text-white font-semibold text-lg flex items-center justify-between
                     hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <Brain className="w-8 h-8" />
            <span>Start Programming Quiz</span>
          </div>
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Academic Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {academicCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20
                       cursor-pointer hover:bg-white/15 transition-all"
            onClick={() => handleCategorySelect(category.id)}
          >
            <div className="flex items-center gap-4 mb-6">
              {category.icon}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {category.title}
                </h3>
                <p className="text-gray-300 text-sm">{category.description}</p>
              </div>
            </div>

            <div
              className={`w-full p-4 bg-gradient-to-r ${category.gradient} rounded-xl
                           text-white font-semibold flex items-center justify-between`}
            >
              <span>Explore {category.title}</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderProgrammingView = () => (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Programming Languages
          </h2>
          <p className="text-gray-300">Choose your programming language</p>
        </div>
      </div>

      {/* Programming Languages Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {programmingQuizzes.map((quiz) => (
          <motion.button
            key={quiz.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedQuiz(quiz.id);
              setSelectedSubject(quiz.subject);
              setTitleOfTheQuiz(quiz.title);
              setCurrentView("quiz-setup");
            }}
            className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20
                       hover:bg-white/15 transition-all flex flex-col items-center text-center"
          >
            <div className="mb-4">{quiz.icon}</div>
            <h3 className="text-white font-semibold mb-2">{quiz.subject}</h3>
            <p className="text-gray-300 text-sm">{quiz.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderSubjectsView = () => {
    const category = academicCategories.find(
      (cat) => cat.id === selectedCategory
    );
    if (!category) return null;

    let items = [];
    if (category.classes) items = category.classes;
    else if (category.exams) items = category.exams;
    else if (category.departments) items = category.departments;
    else if (category.topics) items = category.topics;

    return (
      <div className="space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <div className="flex items-center gap-4">
            {category.icon}
            <div>
              <h2 className="text-3xl font-bold text-white">
                {category.title}
              </h2>
              <p className="text-gray-300">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">{item.name}</h3>
              <div className="grid grid-cols-1 gap-2">
                {item.subjects.map((subject, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      handleSubjectSelect(subject, selectedCategory, item.id)
                    }
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-left
                               border border-white/10 hover:border-white/20 transition-all
                               flex items-center justify-between"
                  >
                    <span>{subject}</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuizSetupView = () => (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <div>
          <h2 className="text-3xl font-bold text-white">Quiz Setup</h2>
          <p className="text-gray-300">Subject: {selectedSubject}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
        <div className="space-y-6">
          {/* Selected Subject Display */}
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Selected Subject</h3>
                <p className="text-blue-300">{selectedSubject}</p>
              </div>
            </div>
          </div>

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
          <div>
            <label className="block text-sm font-medium text-white mb-3">
              Timer Settings
            </label>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/20">
              <div className="flex items-center gap-3">
                {timerEnabled ? (
                  <Timer className="w-5 h-5 text-blue-400" />
                ) : (
                  <TimerOff className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <p className="text-white font-medium">Timer Enabled</p>
                  <p className="text-gray-300 text-sm">
                    {timerEnabled ? "Quiz will be timed" : "No time limit"}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimerEnabled(!timerEnabled)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  timerEnabled ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <motion.div
                  animate={{ x: timerEnabled ? 24 : 2 }}
                  className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
              </motion.button>
            </div>
          </div>

          {/* Start Quiz Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedDifficulty || isStartingQuiz}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
              selectedDifficulty && !isStartingQuiz
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/25"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
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
                Start Quiz
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case "main":
        return renderMainView();
      case "programming":
        return renderProgrammingView();
      case "subjects":
        return renderSubjectsView();
      case "quiz-setup":
        return renderQuizSetupView();
      default:
        return renderMainView();
    }
  };

  if (serverError) {
    return <ErrorState errorMessage={serverError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8 text-white/60"
        >
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <span>Quiz</span>
          {currentView !== "main" && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white/80 capitalize">{currentView}</span>
            </>
          )}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Past Quizzes Section */}
        {currentView === "main" && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Clock className="w-8 h-8 text-purple-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Past Quizzes
                    </h2>
                    <p className="text-gray-300">
                      Review your previous attempts
                    </p>
                  </div>
                </div>

                {/* Filter Toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl 
                           text-white hover:bg-white/20 transition-all"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search quizzes..."
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 
                                   rounded-lg text-white placeholder-gray-400 focus:outline-none 
                                   focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Difficulty
                      </label>
                      <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Type
                      </label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="">All Types</option>
                        <option value="programming">Programming</option>
                        <option value="academic">Academic</option>
                        <option value="pyq">Previous Year Questions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Subject
                      </label>
                      <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg 
                                 text-white focus:outline-none focus:border-blue-500 transition-all"
                      >
                        <option value="">All Subjects</option>
                        {[
                          ...new Set(pastQuizzes.map((quiz) => quiz.subject)),
                        ].map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Past Quizzes List */}
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
            </div>
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Confirm Quiz Start
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Subject:</span>
                  <span className="text-white font-medium">
                    {selectedSubject}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Difficulty:</span>
                  <span
                    className={`font-medium ${
                      selectedDifficulty === "Easy"
                        ? "text-green-400"
                        : selectedDifficulty === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {selectedDifficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-300">Timer:</span>
                  <span className="text-white font-medium">
                    {timerEnabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium
                           hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  disabled={isStartingQuiz}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 
                           text-white rounded-xl font-medium hover:shadow-lg 
                           hover:shadow-green-500/25 transition-all disabled:opacity-50
                           flex items-center justify-center gap-2"
                >
                  {isStartingQuiz ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Quiz
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Expired Modal */}
      {sessionExpired && <SessionExpiredModal />}
      <ChatBot />
    </div>
  );
}
