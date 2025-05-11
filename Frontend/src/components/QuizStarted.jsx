// src/components/QuizStarted.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Configuration, OpenAIApi } from "openai";
const questions = [
  {
    text: "The characteristic distance at which quantum gravitational effects are significant is called?",
    options: [
      "Planck length",
      "Schwarzschild radius",
      "Bohr radius",
      "Fermi length",
    ],
  },
  {
    text: "Which of the following is the unit of Planck's constant?",
    options: ["Joule-second", "Newton-meter", "Watt", "Coulomb"],
  },
  {
    text: "What does 'c' represent in E=mc²?",
    options: [
      "Speed of light",
      "Coulomb constant",
      "Planck constant",
      "Charge",
    ],
  },
];

export default function QuizStarted() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState(questions.map(() => "notVisited"));
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    // mark visited
    setStatus((st) =>
      st.map((s, i) =>
        i === current && s === "notVisited" ? "notAnswered" : s
      )
    );
  }, [current]);

  useEffect(() => {
    if (timeLeft <= 0) return handleNext();
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const record = (action) => {
    setStatus((st) => {
      const copy = [...st];
      if (action === "saveNext") copy[current] = "answered";
      if (action === "markReview") copy[current] = "review";
      if (action === "clear") copy[current] = "notAnswered";
      if (action === "revNext") copy[current] = "reviewAnswered";
      return copy;
    });
  };

  const handleNext = () => {
    record("saveNext");
    move(1);
  };
  const handleSaveMark = () => {
    record("markReview");
    move(1);
  };
  const handleClear = () => record("clear");
  const handleMarkNext = () => {
    record("revNext");
    move(1);
  };

  const move = (dir) => {
    const nxt = current + dir;
    if (nxt < 0) return;
    if (nxt >= questions.length)
      return navigate("/results", { state: { status } });
    setCurrent(nxt);
    setSelected(null);
    setTimeLeft(30);
  };

  return (
    <div className="min-h-screen p-8 bg-white flex">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">Question {current + 1}:</h2>
        <div className="border rounded-lg p-4 mb-4 text-gray-800">
          {questions[current].text}
        </div>
        <div className="space-y-3 mb-4">
          {questions[current].options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`w-full text-left px-4 py-3 rounded-lg border ${
                selected === opt
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              } hover:border-blue-400`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleNext}
            disabled={!selected}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save & Next
          </button>
          <button
            onClick={handleSaveMark}
            disabled={!selected}
            className="bg-yellow-400 text-white px-4 py-2 rounded"
          >
            Save & Mark for Review
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Clear Response
          </button>
          <button
            onClick={handleMarkNext}
            disabled={!selected}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Mark for Review & Next
          </button>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/results", { state: { status } })}
            className="bg-green-600 text-white px-6 py-2 rounded mr-2"
          >
            Submit
          </button>
        </div>
      </div>

      <aside className="w-48 ml-6">
        <div className="flex justify-between items-center mb-4">
          <div>Time Left: {timeLeft}s</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {status.map((s, i) => (
            <div
              key={i}
              className={`h-8 flex items-center justify-center rounded ${
                s === "notVisited"
                  ? "bg-gray-200"
                  : s === "notAnswered"
                  ? "bg-red-500 text-white"
                  : s === "answered"
                  ? "bg-green-500 text-white"
                  : s === "review"
                  ? "bg-purple-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 mr-2" /> Not Visited
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2" /> Not Answered
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 mr-2" /> Answered
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 mr-2" /> Marked for Review
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 mr-2" /> Answered & Marked
          </div>
        </div>
      </aside>
    </div>
  );
}
