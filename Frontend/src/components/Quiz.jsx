import React, { useState } from "react";

export default function QuizSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const newQuizzes = [
    { id: 1, title: "Test Your C Language" },
    { id: 2, title: "Test Your C++ Language" },
    { id: 3, title: "Test Your JavaScript Skills" },
  ];

  // Example past quiz details
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
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleStart = () => {
    console.log("Starting quiz:", selectedQuiz);
    // TODO: navigate to quiz
    closeModal();
  };

  return (
    <div className="p-8">
      {/* Create Quiz Button */}
      <button
        onClick={openModal}
        className="px-6 py-3 font-semibold rounded-lg text-white bg-[#2c3250] hover:bg-opacity-90 transition"
      >
        Create Quiz
      </button>

      {/* Past Quizzes Section */}
      <div className="mt-10">
        <h4 className="text-2xl font-semibold text-[#2c3250] mb-4">
          Your Past Quizzes
        </h4>
        <div className="space-y-4">
          {pastQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md flex justify-between items-center"
            >
              <div>
                <h5 className="text-lg font-medium text-gray-800">
                  {quiz.title}
                </h5>
                <p className="text-sm text-gray-600">Score: {quiz.score}</p>
                <p className="text-sm text-gray-600">
                  Time Taken: {quiz.timeTaken}
                </p>
                <p className="text-sm text-gray-500">Date: {quiz.date}</p>
              </div>
              <button
                className="px-4 py-2 bg-[#2c3250] text-white rounded-lg hover:bg-opacity-90 transition"
                onClick={() => console.log("Review quiz:", quiz.id)}
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
          <div className="bg-white rounded-2xl shadow-xl w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-h-[80vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newQuizzes.map((quiz) => {
                  const isSelected = selectedQuiz === quiz.id;
                  return (
                    <div
                      key={quiz.id}
                      onClick={() => setSelectedQuiz(quiz.id)}
                      className={
                        `cursor-pointer p-6 bg-white border-2 rounded-lg shadow hover:shadow-lg transform hover:scale-[1.02] transition ` +
                        (isSelected ? "border-[#2c3250]" : "border-gray-200")
                      }
                    >
                      <h5 className="text-gray-800 font-medium mb-2">
                        {quiz.title}
                      </h5>
                      {isSelected && (
                        <span className="text-sm text-[#2c3250]">Selected</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleStart}
                disabled={!selectedQuiz}
                className={
                  `px-6 py-3 rounded-lg font-semibold transition ` +
                  (selectedQuiz
                    ? "bg-[#2c3250] text-white hover:bg-opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed")
                }
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
