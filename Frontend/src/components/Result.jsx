import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ClipboardCheck } from "lucide-react";
import {
  Clock,
  Timer,
  Target,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

function StatCard({ title, value, bgColor, icon }) {
  return (
    <div
      className={`${bgColor} rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-lg">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold opacity-90">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}


function QuestionCard({
  question,
  userResponse,
  correctOption,
  isCorrect,
  index,
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      <div
        className={`p-6 ${
          isCorrect
            ? "bg-[#2e384c]"
            : userResponse
            ? "bg-[#2e384c]"
            : "bg-white/5"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold ">
            Question {index + 1}
          </h3>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              isCorrect
                ? "bg-green-400/10 text-[#61b387]"
                : userResponse
                ? "bg-red-400/10 text-red-400"
                : "bg-gray-400/10 text-gray-400"
            }`}
          >
            {isCorrect
              ? "✓ Correct"
              : userResponse
              ? "✗ Incorrect"
              : "Not Attempted"}
          </span>
        </div>

        <p className="text-gray-300 font-medium mb-4">{question.text}</p>

        <div className="space-y-3">
          {question.options.map((option, i) => {
            const optionLetter = String.fromCharCode(65 + i);
            const isCorrectOption = optionLetter === correctOption;
            const isSelectedOption = userResponse?.number === optionLetter;

            return (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  isCorrectOption
                    ? "bg-green-400/10 border-green-600"
                    : isSelectedOption && !isCorrect
                    ? "bg-red-400/10 border-red-400/50"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        isCorrectOption
                          ? "bg-green-600 text-green-700"
                          : isSelectedOption && !isCorrect
                          ? "bg-red-300 text-red-400"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span className="text-gray-300">{option}</span>
                  </div>
                  {(isSelectedOption || isCorrectOption) && (
                    <span
                      className={`text-sm font-medium ${
                        isCorrectOption ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isCorrectOption
                        ? isSelectedOption
                          ? "Correct Answer ✓"
                          : "Correct Answer"
                        : "Your Answer ✗"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


export default function Result() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/quiz/result/${quizId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setResult(response.data);
        console.log("result data", response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch result");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [quizId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-lg mx-4 transform hover:scale-105 transition-all duration-300">
          <div className="mb-6">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <button
            onClick={() => navigate("/quiz")}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Quiz Section</span>
          </button>
        </div>
      </div>
    );
  }
  if (!result || !result.quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            No Data Found
          </h2>
          <p className="text-gray-700">Could not find quiz results</p>
          <button
            onClick={() => navigate("/quiz")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quiz Section
          </button>
        </div>
      </div>
    );
  }

  const { quiz, timeTaken } = result;
  const correctAnswers = quiz.questions.filter((q) => q.isCorrect).length;
  const accuracy = ((correctAnswers / quiz.totalQuestions) * 100).toFixed(2);

  const chartData = {
    labels: ["Correct", "Incorrect", "Not Attempted"],
    datasets: [
      {
        data: [
          correctAnswers,
          quiz.questions.filter((q) => !q.isCorrect && q.userResponse).length,
          quiz.questions.filter((q) => !q.userResponse).length,
        ],
        backgroundColor: [
          "rgba(74, 222, 128, 0.9)",
          "rgba(248, 113, 113, 0.9)",
          "rgba(209, 213, 219, 0.9)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(156, 163, 175, 1)",
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: { size: 14, weight: "bold" },
          usePointStyle: true,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets[0].data.map((value, index) => ({
              text: `${chart.data.labels[index]} (${value})`,
              fillStyle: datasets[0].backgroundColor[index],
              strokeStyle: datasets[0].borderColor[index],
              lineWidth: 2,
              hidden: false,
              index: index,
            }));
          },
        },
      },
    },
    cutout: "70%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
    },
    responsive: true,
    maintainAspectRatio: true,
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        {/* <div className="bg-white rounded-xl shadow-lg p-8 mb-6 transform hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Quiz Result</h1>
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {quiz.Title}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Completed: {new Date(quiz.endTime).toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Duration: {timeTaken}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Final Score: {quiz.score} points</span>
            </div>
          </div>
        </div> */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-lg p-8 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold ">
              {result.quiz.Title}
            </h1>
            <div className="px-4 py-2 bg-yellow-400/10 text-yellow-700 rounded-full text-sm font-medium">
              {result.quiz.subject} - {result.quiz.difficulty}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-400" />
              <span>
                Completed: {new Date(result.quiz.endTime).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center">
              <Timer className="w-5 h-5 mr-2 text-yellow-400" />
              <span>Duration: {result.timeStats.timeTaken}</span>
            </div>
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-yellow-400" />
              <span>Final Score: {result.score} points</span>
            </div>
          </div>
        </div>
        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Questions"
            value={quiz.totalQuestions}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          />
          <StatCard
            title="Correct Answers"
            value={correctAnswers}
            bgColor="bg-gradient-to-r from-green-500 to-green-600"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            }
          />
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
          />
          <StatCard
            title="Total Score"
            value={quiz.score}
            bgColor="bg-gradient-to-r from-yellow-500 to-yellow-600"
            icon={
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            }
          />
        </div> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Questions"
            value={result.quiz.totalQuestions}
            bgColor="bg-[#2c3250]"
            icon={<Award className="w-6 h-6 text-yellow-400" />}
          />
          <StatCard
            title="Correct Answers"
            value={result.statistics.correctAnswers}
            bgColor="bg-[#2c3250]"
            icon={<CheckCircle2 className="w-6 h-6 text-green-400" />}
          />
          <StatCard
            title="Accuracy"
            value={`${result.statistics.accuracy}%`}
            bgColor="bg-[#2c3250]"
            icon={<Target className="w-6 h-6 text-yellow-400" />}
          />
          <StatCard
            title="Total Score"
            value={result.score}
            bgColor="bg-[#2c3250]"
            icon={<Award className="w-6 h-6 text-yellow-400" />}
          />
        </div>
        {/* Chart and Questions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-8 lg:col-span-1 transform hover:shadow-2xl transition-all duration-300 h-10%">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Performance Overview
            </h2>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Accuracy Rate
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {accuracy}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full max-w-[300px] mx-auto">
                <Doughnut
                  data={chartData}
                  options={{
                    ...chartOptions,
                    plugins: {
                      ...chartOptions.plugins,
                      legend: {
                        position: "bottom",
                        labels: {
                          padding: 20,
                          font: { size: 14 },
                          usePointStyle: true,
                          boxWidth: 8,
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-4xl font-bold text-gray-800">
                  {correctAnswers}
                </p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                {
                  label: "Correct",
                  value: correctAnswers,
                  color: "text-green-500",
                },
                {
                  label: "Incorrect",
                  value: quiz.questions.filter(
                    (q) => !q.isCorrect && q.userResponse
                  ).length,
                  color: "text-red-500",
                },
                {
                  label: "Skipped",
                  value: quiz.questions.filter((q) => !q.userResponse).length,
                  color: "text-gray-500",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <ClipboardCheck className="w-6 h-6 mr-2 text-blue-500" />
              Question Details
            </h2>
            <div className="space-y-6">
              {result.quiz.questions.map((q, idx) => (
                <QuestionCard
                  key={idx}
                  question={q.questionId}
                  userResponse={q.userResponse}
                  correctOption={q.questionId.correctOption}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div> */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-lg p-6 lg:col-span-2 border border-white/10">
            <h2 className="text-xl font-semibold mb-6  flex items-center">
              <ClipboardCheck className="w-6 h-6 mr-2 text-yellow-400" />
              Question Details
            </h2>
            <div className="space-y-6">
              {result.quiz.questions.map((q, idx) => (
                <QuestionCard
                  key={idx}
                  question={q.questionId}
                  userResponse={q.userResponse}
                  isCorrect={q.isCorrect}
                  index={idx}
                  correctOption={q.questionId.correctOption}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={() => navigate("/quiz")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Back to Quiz Section
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            Download Result
          </button>
        </div>
      </div>
    </div>
  );
}
