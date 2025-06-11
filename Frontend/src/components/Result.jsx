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
  Download,
  ArrowLeft,
  TrendingUp,
  Calendar,
  BookOpen,
} from "lucide-react";
import ChatBot from "./ChatBot";

ChartJS.register(ArcElement, Tooltip, Legend);

function StatCard({ title, value, bgColor, icon, gradient, subtitle }) {
  return (
    <div
      className={`${
        gradient || bgColor
      } rounded-2xl shadow-xl p-6 text-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/10 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/10">
          {icon}
        </div>
        <div className="text-right">
          <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
        </div>
      </div>
      <h3 className="text-lg font-semibold opacity-90 mb-1">{title}</h3>
      {subtitle && <p className="text-sm opacity-70 mb-2">{subtitle}</p>}
      <p className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {value}
      </p>
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
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-slate-600/50">
      <div className="p-8">
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
              {index + 1}
            </div>
            <h3 className="text-xl font-bold text-white">
              Question {index + 1}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center space-x-2 border backdrop-blur-sm ${
                isCorrect
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : userResponse
                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                  : "bg-slate-500/20 text-slate-300 border-slate-500/30"
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct</span>
                </>
              ) : userResponse ? (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Incorrect</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>Not Attempted</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-slate-800/30 rounded-xl p-6 mb-6 border border-slate-700/30">
          <p className="text-slate-200 text-lg leading-relaxed font-medium">
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((option, i) => {
            const optionLetter = String.fromCharCode(65 + i);
            const isCorrectOption = optionLetter === correctOption;
            const isSelectedOption = userResponse?.number === optionLetter;
            const isWrongSelection = isSelectedOption && !isCorrect;

            return (
              <div
                key={i}
                className={`relative p-5 rounded-xl border-2 transition-all duration-300 ${
                  isCorrectOption
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-emerald-500/20 shadow-lg"
                    : isWrongSelection
                    ? "bg-red-500/10 border-red-500/50 shadow-red-500/20 shadow-lg"
                    : "bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg border-2 ${
                        isCorrectOption
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
                          : isWrongSelection
                          ? "bg-red-500/20 border-red-500/50 text-red-300"
                          : "bg-slate-700/50 border-slate-600/50 text-slate-300"
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span
                      className={`text-lg font-medium ${
                        isCorrectOption
                          ? "text-emerald-200"
                          : isWrongSelection
                          ? "text-red-200"
                          : "text-slate-200"
                      }`}
                    >
                      {option}
                    </span>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center space-x-3">
                    {isCorrectOption && (
                      <div className="flex items-center space-x-2 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">
                          Correct Answer
                        </span>
                      </div>
                    )}
                    {isWrongSelection && (
                      <div className="flex items-center space-x-2 bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/30">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-300">
                          Your Answer
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle animation for correct/wrong answers */}
                {(isCorrectOption || isWrongSelection) && (
                  <div className="absolute inset-0 rounded-xl opacity-20 animate-ping-slow pointer-events-none">
                    <div
                      className={`w-full h-full rounded-xl ${
                        isCorrectOption ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                )}
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-purple-500/20 border-t-purple-500 animate-spin-reverse mx-auto"></div>
          </div>
          <p className="text-white/80 text-lg font-medium">
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900/30 to-slate-900 p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-lg mx-4 transform hover:scale-105 transition-all duration-300 border border-red-500/20">
          <div className="mb-6">
            <div className="bg-red-500/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-3xl font-bold text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-slate-300 mb-6">{error}</p>
          </div>
          <button
            onClick={() => navigate("/quiz")}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-2 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Quiz Section</span>
          </button>
        </div>
      </div>
    );
  }

  if (!result || !result.quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-slate-700/50">
          <h2 className="text-2xl font-bold text-slate-300 mb-4">
            No Data Found
          </h2>
          <p className="text-slate-400 mb-6">Could not find quiz results</p>
          <button
            onClick={() => navigate("/quiz")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold"
          >
            Back to Quiz Section
          </button>
        </div>
      </div>
    );
  }

  const { quiz, timeTaken } = result;
  const correctAnswers = quiz.questions.filter((q) => q.isCorrect).length;
  const incorrectAnswers = quiz.questions.filter(
    (q) => !q.isCorrect && q.userResponse
  ).length;
  const skippedAnswers = quiz.questions.filter((q) => !q.userResponse).length;
  const accuracy = ((correctAnswers / quiz.totalQuestions) * 100).toFixed(2);

  const chartData = {
    labels: ["Correct", "Incorrect", "Not Attempted"],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers, skippedAnswers],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(148, 163, 184, 0.8)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(148, 163, 184, 1)",
        ],
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 25,
          font: { size: 14, weight: "600" },
          usePointStyle: true,
          pointStyle: "circle",
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
    cutout: "65%",
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: "easeInOutQuart",
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {result.quiz.Title}
                </h1>
                <p className="text-slate-300 text-lg">
                  Quiz Results & Performance Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-2xl text-lg font-semibold border border-yellow-500/30 backdrop-blur-sm">
                {result.quiz.subject}
              </div>
              <div className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-xl text-sm font-medium border border-slate-600/50">
                {result.quiz.difficulty}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300">
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <Calendar className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="font-semibold">
                  {new Date(result.quiz.endTime).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <Timer className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">Duration</p>
                <p className="font-semibold">{result.timeStats.timeTaken}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-sm text-slate-400">Final Score</p>
                <p className="font-semibold">{result.score} points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Questions"
            value={result.quiz.totalQuestions}
            gradient="bg-gradient-to-br from-blue-600 to-blue-800"
            icon={<BookOpen className="w-7 h-7" />}
            subtitle="Questions in quiz"
          />
          <StatCard
            title="Correct Answers"
            value={result.statistics.correctAnswers}
            gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
            icon={<CheckCircle2 className="w-7 h-7" />}
            subtitle="Well done!"
          />
          <StatCard
            title="Accuracy Rate"
            value={`${result.statistics.accuracy}%`}
            gradient="bg-gradient-to-br from-purple-600 to-purple-800"
            icon={<Target className="w-7 h-7" />}
            subtitle="Success percentage"
          />
          <StatCard
            title="Total Score"
            value={result.score}
            gradient="bg-gradient-to-br from-amber-600 to-amber-800"
            icon={<Award className="w-7 h-7" />}
            subtitle="Points earned"
          />
        </div>

        {/* Chart and Questions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Chart Section */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:col-span-1 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl mr-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              Performance Overview
            </h2>

            {/* Accuracy Progress Bar */}
            <div className="mb-8 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/30">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-slate-200">
                  Accuracy Rate
                </span>
                <span className="text-2xl font-bold text-blue-400">
                  {accuracy}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-400 mt-2">
                {accuracy >= 80
                  ? "Excellent performance!"
                  : accuracy >= 60
                  ? "Good job!"
                  : "Keep practicing!"}
              </p>
            </div>

            {/* Enhanced Doughnut Chart */}
            <div className="relative mb-8">
              <div className="w-full max-w-[280px] mx-auto">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-4xl font-bold text-white mb-1">
                  {correctAnswers}
                </p>
                <p className="text-sm text-slate-400">Correct</p>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Correct",
                  value: correctAnswers,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  border: "border-emerald-500/30",
                },
                {
                  label: "Incorrect",
                  value: incorrectAnswers,
                  color: "text-red-400",
                  bg: "bg-red-500/10",
                  border: "border-red-500/30",
                },
                {
                  label: "Skipped",
                  value: skippedAnswers,
                  color: "text-slate-400",
                  bg: "bg-slate-500/10",
                  border: "border-slate-500/30",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-xl border ${stat.bg} ${stat.border} backdrop-blur-sm`}
                >
                  <p className={`text-3xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Questions Section */}
          <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:col-span-2 border border-slate-700/50">
            <h2 className="text-2xl font-bold mb-8 text-white flex items-center">
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-2 rounded-xl mr-3">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              Detailed Question Analysis
            </h2>
            <div className="space-y-8">
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

        {/* Enhanced Action Buttons */}
        <div className="flex justify-center mt-12 space-x-6">
          <button
            onClick={() => navigate("/quiz")}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer flex items-center space-x-3 font-semibold text-lg border border-blue-500/30"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Quiz Section</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer flex items-center space-x-3 font-semibold text-lg border border-emerald-500/30"
          >
            <Download className="w-6 h-6" />
            <span>Download Result</span>
          </button>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}
