// src/components/QuizStarted.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";

function WarningModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-96 shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Warning!</h2>
          <p className="text-gray-600 mb-8">
            Leaving or refreshing this page will submit your quiz automatically.
            Are you sure?
          </p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              onClick={onCancel}
            >
              Stay Here
            </button>
            <button
              className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
              onClick={onConfirm}
            >
              Leave & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function QuizStarted() {
  const navigate = useNavigate();
  const { questions } = useContext(AuthContext);
  const total = questions.length || 0;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3 * 60);
  const [showNavModal, setShowNavModal] = useState(false);

  // Ref to control whether to allow the next popstate
  const allowNavRef = useRef(false);

  // — BEFOREUNLOAD for refresh/close —
  useEffect(() => {
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // Chrome needs this
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  // — POPSTATE for back/forward —
  useEffect(() => {
    // Push a dummy state so that back-button first hits our listener
    window.history.pushState(null, "", window.location.href);

    const onPopState = () => {
      if (allowNavRef.current) {
        // User has already confirmed; let them go
        return;
      }
      // Otherwise, show our modal and re-push state
      setShowNavModal(true);
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const confirmNavigation = () => {
    allowNavRef.current = true;
    setShowNavModal(false);
    // Actually go back once
    window.history.back();
  };
  const cancelNavigation = () => {
    setShowNavModal(false);
  };

  // — Initialize status & answers —
  useEffect(() => {
    setStatus(Array(total).fill("notVisited"));
    setAnswers(Array(total).fill(null));
  }, [total]);

  // — Timer countdown —
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // — Mark visited & restore selection —
  useEffect(() => {
    setStatus((st) => {
      const c = [...st];
      if (c[current] === "notVisited") c[current] = "notAnswered";
      return c;
    });
    setSelected(answers[current]);
  }, [current, answers]);

  const recordAnswer = (markStatus) => {
    setStatus((st) => {
      const c = [...st];
      c[current] = markStatus;
      return c;
    });
    setAnswers((ans) => {
      const c = [...ans];
      c[current] = selected;
      return c;
    });
  };

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
    setAnswers((ans) => {
      const c = [...ans];
      c[current] = null;
      return c;
    });
    setStatus((st) => {
      const c = [...st];
      c[current] = "notAnswered";
      return c;
    });
    setSelected(null);
  };

  const handleSubmit = () => {
    // Remove the beforeunload so navigation is clean
    window.removeEventListener("beforeunload", () => {});
    // Calculate score
    let score = 0;
    questions.forEach((q, idx) => {
      const a = answers[idx];
      if (a == null) return;
      score += a === q.correctOption ? 4 : -1;
    });
    navigate("/results", { state: { questions, answers, status, score } });
  };

  return (
    <div className="min-h-screen p-8 bg-white flex">
      {showNavModal && (
        <WarningModal
          onConfirm={handleSubmit}
          onCancel={cancelNavigation}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        <div className="text-right mb-4 font-mono">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

        <h2 className="text-xl font-semibold mb-2">
          Question {current + 1} of {total}
        </h2>
        <div className="text-sm border-l pl-4 flex gap-4 mb-4">
          <span className="text-green-600 font-medium">+4 correct</span>
          <span className="text-red-600 font-medium">-1 wrong</span>
        </div>
        <div className="border rounded-lg p-4 mb-4 text-gray-800">
          {questions[current]?.text || "Loading question..."}
        </div>

        <div className="space-y-3 mb-4">
          {questions[current]?.options.map((opt, i) => (
            <button
              key={i}
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

        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selected || current === total - 1}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save & Next
          </button>
          <button
            onClick={handleSaveMark}
            disabled={!selected || current === total - 1}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          >
            Save & Review
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          >
            Clear
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Submit Quiz
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-48 ml-6">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: total }).map((_, i) => {
            const s = status[i] || "notVisited";
            const bg =
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
                className={`${bg} h-8 flex items-center justify-center rounded cursor-pointer`}
                onClick={() => setCurrent(i)}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
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
