import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/UserContext";
export default function QuizSection() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { questions, setQuestions } = useContext(AuthContext);
  console.log("questions", questions);
  console.log("setQuestions", setQuestions);
  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const newQuizzes = [
    { id: 1, title: "Test Your Python Language" },
    { id: 2, title: "Test Your C++ Language" },
    { id: 3, title: "Test Your JavaScript Skills" },
  ];

  const pastQuizzes = [
    {
      id: 101,
      title: "Algebra Basics Quiz",
      score: "85%",
      timeTaken: "5m 30s",
      date: "2025-05-10",
    },
    {
      id: 102,
      title: "History 101 Quiz",
      score: "92%",
      timeTaken: "4m 12s",
      date: "2025-05-09",
    },
    {
      id: 103,
      title: "Biology Fundamentals",
      score: "78%",
      timeTaken: "6m 05s",
      date: "2025-05-08",
    },
  ];

  const openModal = () => {
    setSelectedQuiz(null);
    setSelectedDifficulty(null);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleStart = async () => {
    if (selectedQuiz && selectedDifficulty) {
      // Pass selected quiz and difficulty to the quiz start route
      const response = await axios.get(`http://localhost:4000/quiz/start`, {
        params: {
          quizId: selectedQuiz,
          subject: "Python",
          difficulty: selectedDifficulty,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      if (response.status === 200) {
        setQuestions(response.data);
        navigate(`/quiz-started`, {
          state: { quizId: selectedQuiz, difficulty: selectedDifficulty },
        });
        closeModal();
      }
    }
  };

  // If user is not signed in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-8">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-sm">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to sign in before creating or viewing quizzes.
          </p>
          <NavLink
            to="/signin"
            className="inline-block px-6 py-3 bg-[#2c3250] text-white font-semibold rounded-full hover:bg-opacity-90 transition"
          >
            Sign In Now
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50">
      {/* Create Quiz Button */}
      <button
        onClick={openModal}
        className="px-6 py-3 font-semibold rounded-lg text-white bg-[#2c3250] hover:bg-opacity-90 transition cursor-pointer"
      >
        Create Quiz
      </button>

      {/* Past Quizzes Section */}
      <div className="mt-10">
        <h4 className="text-2xl font-semibold text-[#2c3250] mb-4">
          Your Past Quizzes
        </h4>
        <div className="space-y-6">
          {pastQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h5 className="text-lg font-medium text-gray-800">
                  {quiz.title}
                </h5>
                <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                  <span>Score: {quiz.score}</span>
                  <span>Time: {quiz.timeTaken}</span>
                  <span>Date: {quiz.date}</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/quiz/review/${quiz.id}`)}
                className="px-4 py-2 bg-[#2c3250] text-white rounded-full hover:bg-opacity-90 transition"
              >
                Review
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Selecting New Quiz */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 bg-[#2c3250] rounded-t-2xl">
              <h3 className="text-xl font-bold text-white">Select a Quiz</h3>
              <button
                onClick={closeModal}
                className="text-white text-2xl hover:text-gray-200"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Quiz Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    onClick={() => setSelectedQuiz(quiz.id)}
                    className={`cursor-pointer p-6 rounded-lg transition transform hover:scale-105 border-2 ${
                      selectedQuiz === quiz.id
                        ? "border-[#2c3250] bg-gray-50 shadow-lg"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <h5 className="text-gray-800 font-semibold mb-2">
                      {quiz.title}
                    </h5>
                    {selectedQuiz === quiz.id && (
                      <span className="text-xs text-[#2c3250]">
                        Selected ✅
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Difficulty Selection */}
              <div className="flex justify-center mt-6 space-x-4">
                {["Easy", "Medium", "Hard"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedDifficulty(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${
                      selectedDifficulty === level
                        ? "bg-[#2c3250] text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleStart}
                disabled={!selectedQuiz || !selectedDifficulty}
                className={`px-6 py-3 rounded-full font-semibold transition cursor-pointer ${
                  selectedQuiz && selectedDifficulty
                    ? "bg-[#2c3250] text-white hover:bg-opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
