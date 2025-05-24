// src/components/QuizStarted.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";

export default function QuizStarted() {
  const navigate = useNavigate();
  const { questions } = useContext(AuthContext);

  const total = questions.length || 0;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3 * 60); // 5 minutes total

  // Initialize status and answers arrays
  useEffect(() => {
    setStatus(Array(total).fill("notVisited"));
    setAnswers(Array(total).fill(null));
  }, [total]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Mark visited when current changes and restore selection
  useEffect(() => {
    setStatus((st) => {
      const copy = [...st];
      if (copy[current] === "notVisited") copy[current] = "notAnswered";
      return copy;
    });
    setSelected(answers[current]);
  }, [current, answers]);

  // Record answer and status
  const recordAnswer = (markStatus) => {
    setStatus((st) => {
      const copy = [...st];
      copy[current] = markStatus;
      return copy;
    });
    setAnswers((ans) => {
      const copy = [...ans];
      copy[current] = selected;
      return copy;
    });
  };

  // Navigation
  const handleNext = () => {
    recordAnswer("answered");
    if (current < total - 1) setCurrent((c) => c + 1);
  };
  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };
  const handleSaveMark = () => {
    recordAnswer("review");
    if (current < total - 1) setCurrent((c) => c + 1);
  };
  const handleClear = () => {
    // Clear answer
    setAnswers((ans) => {
      const copy = [...ans];
      copy[current] = null;
      return copy;
    });
    setStatus((st) => {
      const copy = [...st];
      copy[current] = "notAnswered";
      return copy;
    });
    setSelected(null);
  };

  const handleSubmit = () => {
    // Calculate score: +4 correct, -1 wrong
    let score = 0;
    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      if (userAns == null) return;
      if (userAns === q.correctOption) score += 4;
      else score -= 1;
    });
    navigate("/results", { state: { questions, answers, status, score } });
  };

  return (
    <div className="min-h-screen p-8 bg-white flex">
      {/* Main Section */}
      <div className="flex-1">
        {/* Timer */}
        <div className="text-right mb-4 font-mono">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
        <h2 className="text-xl font-semibold mb-2">
          Question {current + 1} of {total}
        </h2>
        <div className="text-sm border-l pl-4 flex gap-4">
          <span className="text-green-600 font-medium">+4 correct</span>
          <span className="text-red-600 font-medium">-1 wrong</span>
        </div>
        <div className="border rounded-lg p-4 mb-4 text-gray-800">
          {questions[current]?.text || "Loading question..."}
        </div>
        <div className="space-y-3 mb-4">
          {questions[current]?.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(opt)}
              className={`w-full text-left px-4 py-3 rounded-lg border cursor-pointer ${
                selected === opt
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              } hover:border-blue-400`}
            >
              {opt}
            </button>
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected || current === total - 1}
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Save & Next
          </button>
          <button
            onClick={handleSaveMark}
            disabled={!selected || current === total - 1}
            className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Save & Mark Review
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer"
          >
            Clear
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer"
          >
            Submit Quiz
          </button>
        </div>
      </div>

      {/* Sidebar with Question Numbers */}
      <aside className="w-48 ml-6">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const s = status[i] || "notVisited";
            const classes =
              s === "notVisited"
                ? "bg-gray-200"
                : s === "notAnswered"
                ? "bg-red-500 text-white"
                : s === "answered"
                ? "bg-green-500 text-white"
                : "bg-purple-500 text-white";
            return (
              <div
                key={i}
                className={`${classes} h-8 flex items-center justify-center rounded cursor-pointer`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="mt-4 space-y-1 text-sm">
          <Legend color="bg-gray-200" label="Not Visited" />
          <Legend color="bg-red-500 text-white" label="Not Answered" />
          <Legend color="bg-green-500 text-white" label="Answered" />
          <Legend color="bg-purple-500 text-white" label="Marked for Review" />
        </div>
      </aside>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center">
      <div className={`${color} w-4 h-4 mr-2 rounded`} />
      <span>{label}</span>
    </div>
  );
}
