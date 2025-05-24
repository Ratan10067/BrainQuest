// src/components/Result.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { questions, answers, status } = state || {};

  const totalQuestions = questions?.length || 0;
  const attemptedQuestions = answers?.filter((ans) => ans !== null).length || 0;
  const correctAnswers =
    answers?.reduce(
      (acc, ans, idx) => (ans === questions[idx].correctOption ? acc + 1 : acc),
      0
    ) || 0;
  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Quiz Results</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-green-100 rounded text-center">
            <h2 className="text-lg font-semibold">Total Questions</h2>
            <p className="text-2xl font-bold">{totalQuestions}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded text-center">
            <h2 className="text-lg font-semibold">Attempted Questions</h2>
            <p className="text-2xl font-bold">{attemptedQuestions}</p>
          </div>
          <div className="p-4 bg-purple-100 rounded text-center">
            <h2 className="text-lg font-semibold">Correct Answers</h2>
            <p className="text-2xl font-bold">{correctAnswers}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded text-center">
            <h2 className="text-lg font-semibold">Accuracy</h2>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Question Details:</h2>
        <div className="space-y-4">
          {questions?.map((q, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded border">
              <h3 className="font-semibold">{`Q${idx + 1}: ${q.text}`}</h3>
              <p
                className={`mt-2 ${
                  answers[idx] === q.correctOption
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {answers[idx]
                  ? `Your Answer: ${answers[idx]}`
                  : "You did not attempt this question"}
              </p>
              <p className="text-gray-700">{`Correct Answer: ${q.correctOption}`}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/quiz")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
          >
            Go Back to Quiz Section
          </button>
        </div>
      </div>
    </div>
  );
}
