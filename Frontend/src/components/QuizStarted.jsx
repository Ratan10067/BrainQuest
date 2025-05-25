// src/components/QuizStarted.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import "../App.css";
import axios from "axios";

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
  const { questions, setPastQuizzes, pastQuizzes } = useContext(AuthContext);
  const total = questions.length || 0;

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(1 * 60);
  const [showNavModal, setShowNavModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
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
      setShowSubmitModal(true); // Show the modal
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
      c[current] = selected; // This will store both number and value
      return c;
    });
  };

  const handleNext = () => {
    // Record answer regardless of navigation possibility
    if (selected) {
      setStatus((st) => {
        const newStatus = [...st];
        newStatus[current] = "answered";
        return newStatus;
      });
      setAnswers((ans) => {
        const newAnswers = [...ans];
        newAnswers[current] = selected;
        return newAnswers;
      });
    }

    // Navigate if not on last question
    if (current < total - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const handleSaveMark = () => {
    // Record answer regardless of navigation possibility
    if (selected) {
      setStatus((st) => {
        const newStatus = [...st];
        newStatus[current] = "review";
        return newStatus;
      });
      setAnswers((ans) => {
        const newAnswers = [...ans];
        newAnswers[current] = selected;
        return newAnswers;
      });
    }

    // Navigate if not on last question
    if (current < total - 1) {
      setCurrent((c) => c + 1);
    }
  };
  const handleBack = () => {
    if (current > 0) setCurrent((c) => c - 1);
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

  const handleWithoutNext = () => {
    if (current < total - 1) {
      setCurrent((prev) => prev + 1);
    }
  };
  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    try {
      const quizId = window.location.pathname.split("/").pop();
      const submissionData = {
        userId: localStorage.getItem("userId"),
        quizId: quizId,
        endTime: new Date(),
        answers: answers,
      };

      const response = await axios.post(
        `http://localhost:4000/quiz/submit`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setShowSubmitModal(false);
        setShowSuccess(true); // Show success animation
        // Navigation will be handled by SuccessAnimation component
        setTimeout(() => {
          navigate(`/results/${quizId}`);
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };
  return (
    <div className="min-h-screen p-8 bg-white flex">
      {showNavModal && (
        <WarningModal onConfirm={handleSubmit} onCancel={cancelNavigation} />
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
              onClick={() => setSelected({ number: i + 1, value: opt })}
              className={`w-full text-left px-4 py-3 rounded-lg border cursor-pointer ${
                selected?.value === opt
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              } hover:border-blue-400`}
            >
              <span className="font-medium mr-2">{i + 1}.</span> {opt}
            </button>
          ))}
        </div>

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
            disabled={!selected}
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Save & Next
          </button>
          <button
            onClick={handleSaveMark}
            disabled={!selected}
            className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Save & Review
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer"
          >
            Clear
          </button>
          <button
            onClick={handleWithoutNext}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded cursor-pointer"
          >
            Next
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
      {showSubmitModal && (
        <SubmitConfirmationModal
          onConfirm={confirmSubmit}
          onCancel={() => setShowSubmitModal(false)}
          answers={answers}
          questions={questions}
          status={status}
          timeUp={timeLeft <= 0} // Pass the timeUp prop
        />
      )}
      {showSuccess && (
        <SuccessAnimation
          onComplete={() =>
            navigate(`/results/${window.location.pathname.split("/").pop()}`)
          }
        />
      )}
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

function SubmitConfirmationModal({
  onConfirm,
  onCancel,
  answers,
  questions,
  status,
  timeUp = false,
}) {
  const answered = status.filter((s) => s === "answered").length;
  const markedForReview = status.filter((s) => s === "review").length;
  const notAnswered = status.filter((s) => s === "notAnswered").length;
  const notVisited = status.filter((s) => s === "notVisited").length;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[600px] shadow-2xl border border-gray-100 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#2c3250] p-4">
          <h2 className="text-xl font-semibold text-white">Quiz Summary</h2>
        </div>

        {/* Summary Statistics */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#2c3250]">
                {questions.length}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {answered}
              </div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {markedForReview}
              </div>
              <div className="text-sm text-gray-600">For Review</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {notAnswered}
              </div>
              <div className="text-sm text-gray-600">Not Answered</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">
                {notVisited}
              </div>
              <div className="text-sm text-gray-600">Not Visited</div>
            </div>
          </div>
        </div>

        {/* Questions Review - Now with review status */}
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-lg font-semibold mb-4">Question-wise Summary</h3>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  status[index] === "answered"
                    ? "border-green-200 bg-green-50"
                    : status[index] === "review"
                    ? "border-purple-200 bg-purple-50"
                    : status[index] === "notAnswered"
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">Question {index + 1}</div>
                  <div
                    className={`px-2 py-1 rounded text-sm ${
                      status[index] === "answered"
                        ? "bg-green-100 text-green-700"
                        : status[index] === "review"
                        ? "bg-purple-100 text-purple-700"
                        : status[index] === "notAnswered"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {status[index] === "answered"
                      ? "Answered"
                      : status[index] === "review"
                      ? "Marked for Review"
                      : status[index] === "notAnswered"
                      ? "Not Answered"
                      : "Not Visited"}
                  </div>
                </div>
                {answers[index] && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected Option:{" "}
                    <span className="font-medium">
                      {answers[index].number} → {answers[index].value}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-4">
          {!timeUp && ( // Only show Continue button if time isn't up
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
              Continue Quiz
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            {timeUp ? "Submit" : "Submit Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000); // Redirect after 2 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center transform scale-up">
        {/* Success checkmark animation */}
        <div className="success-checkmark scale-up">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4 animate-fade-in">
          Quiz Submitted Successfully!
        </h2>
        <p className="text-gray-600 mt-2 animate-fade-in-delay">
          Redirecting to results...
        </p>
      </div>
    </div>
  );
}
