import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Save,
  Bookmark,
  XCircle,
  Send,
} from "lucide-react";
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
  const {
    questions,
    setPastQuizzes,
    pastQuizzes,
    timerEnabled,
    setTimerEnabled,
  } = useContext(AuthContext);
  const total = questions.length || 0;
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0.5 * 60);
  const [showNavModal, setShowNavModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Ref to control whether to allow the next popstate
  const [submissionProgress, setSubmissionProgress] = useState(0);
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
    if (!timerEnabled) return;
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
      setShowSubmitModal(false);
      setSubmitting(true);

      // Start progress simulation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15; // Random increment between 0-15
        if (progress > 90) progress = 90; // Cap at 90% until API responds
        setSubmissionProgress(progress);
      }, 200);

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
        clearInterval(progressInterval);
        setSubmissionProgress(100); // Complete the progress bar

        // Wait for progress bar animation to complete
        setTimeout(() => {
          setSubmitting(false);
          setShowSuccess(true);
          setTimeout(() => {
            navigate(`/results/${quizId}`);
          }, 2);
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSubmitting(false);
    }
  };

  const LoadingDots = ({ progress }) => {
    return (
      <div className="fixed inset-0 backdrop-blur-lg bg-[#1a1f37]/80 flex items-center justify-center z-50">
        <div className="bg-[#2c3250]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-yellow-400/20 border-t-yellow-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Dynamic progress bar */}
            <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Submitting Quiz
              </h3>
              <p className="text-gray-400 text-sm">
                {progress < 100 ? "Evaluating your answers..." : "Almost done!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-8">
      {showNavModal && (
        <WarningModal onConfirm={handleSubmit} onCancel={cancelNavigation} />
      )}

      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Main Content */}
        <div className="flex-1 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          {/* Timer */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Question {current + 1} of {total}
            </h2>
            {timerEnabled && (
              <div className="flex items-center gap-2 bg-[#2c3250] px-4 py-2 rounded-xl border border-white/10">
                <Clock className="text-yellow-400" size={20} />
                <span className="font-mono text-white">
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </div>
            )}
          </div>

          {/* Score Info */}
          <div className="flex gap-4 mb-6">
            <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg border border-green-500/20">
              +4 correct
            </div>
            <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/20">
              -1 wrong
            </div>
          </div>

          {/* Question */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
            <p className="text-lg text-white">
              {questions[current]?.text || "Loading question..."}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-6">
            {questions[current]?.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() =>
                  setSelected({
                    number: String.fromCharCode(65 + i),
                    value: opt,
                  })
                }
                className={`w-full text-left px-6 py-4 rounded-xl backdrop-blur-sm transition-all cursor-pointer ${
                  selected?.value === opt
                    ? "bg-yellow-400/20 border-2 border-yellow-400/50 text-white"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + i)}.
                </span>{" "}
                {opt}
              </motion.button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              disabled={current === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
              Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!selected}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-400 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save size={18} />
              Save & Next
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveMark}
              disabled={!selected}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Bookmark size={18} />
              Save & Review
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 cursor-pointer"
            >
              <XCircle size={18} />
              Clear
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWithoutNext}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 cursor-pointer"
            >
              <ChevronRight size={18} />
              Next
            </motion.button>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 cursor-pointer"
            >
              <Send size={18} />
              Submit Quiz
            </motion.button>
          </div>
        </div>

        {/* Question Navigation Sidebar */}
        <div className="w-64 flex flex-col gap-6">
          {/* Question Grid */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-medium mb-4">Question Navigation</h3>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: total }).map((_, i) => {
                const s = status[i] || "notVisited";
                const bg =
                  s === "notVisited"
                    ? "bg-white/5 text-gray-400 border border-white/10"
                    : s === "notAnswered"
                    ? "bg-red-500/20 text-red-400 border-2 border-red-500/50"
                    : s === "answered"
                    ? "bg-green-500/20 text-green-400 border-2 border-green-500/50"
                    : "bg-purple-500/20 text-purple-400 border-2 border-purple-500/50";
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrent(i)}
                    className={`${bg} cursor-pointer h-8 flex items-center justify-center rounded-lg font-medium hover:bg-white/10`}
                  >
                    {i + 1}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-medium mb-4">Legend</h3>
            <div className="space-y-3">
              <Legend
                color="bg-white/5 border border-white/10"
                textColor="text-gray-400"
                label="Not Visited"
              />
              <Legend
                color="bg-red-500/20 border-2 border-red-500/50"
                textColor="text-red-400"
                label="Not Answered"
              />
              <Legend
                color="bg-green-500/20 border-2 border-green-500/50"
                textColor="text-green-400"
                label="Answered"
              />
              <Legend
                color="bg-purple-500/20 border-2 border-purple-500/50"
                textColor="text-purple-400"
                label="Marked for Review"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSubmitModal && (
        <SubmitConfirmationModal
          onConfirm={confirmSubmit}
          onCancel={() => setShowSubmitModal(false)}
          answers={answers}
          questions={questions}
          status={status}
          timeUp={timeLeft <= 0}
        />
      )}
      {submitting && <LoadingDots progress={submissionProgress} />}
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

// Update the Legend component
function Legend({ color, textColor, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`${color} w-6 h-6 rounded-lg`} />
      <span className={`${textColor}`}>{label}</span>
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
