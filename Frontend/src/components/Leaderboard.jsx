import React, { useState } from "react";
import { motion } from "framer-motion";

const leaderboardData = [
  {
    subject: "Mathematics",
    leaders: [
      { name: "Alice", score: 98 },
      { name: "Bob", score: 95 },
      { name: "Charlie", score: 92 },
      { name: "Diana", score: 90 },
      { name: "Eve", score: 88 },
      { name: "Eve", score: 88 },
      { name: "Eve", score: 88 },
      { name: "Eve", score: 88 },
    ],
  },
  {
    subject: "Science",
    leaders: [
      { name: "Frank", score: 97 },
      { name: "Grace", score: 94 },
      { name: "Heidi", score: 91 },
      { name: "Ivan", score: 89 },
      { name: "Judy", score: 87 },
      { name: "Judy", score: 87 },
      { name: "Judy", score: 87 },
    ],
  },
  {
    subject: "History",
    leaders: [
      { name: "Ken", score: 96 },
      { name: "Laura", score: 93 },
      { name: "Mallory", score: 90 },
      { name: "Ned", score: 88 },
      { name: "Olivia", score: 85 },
      { name: "Olivia", score: 85 },
    ],
  },
  {
    subject: "Computer Science",
    leaders: [
      { name: "Alice", score: 98 },
      { name: "Bob", score: 95 },
      { name: "Charlie", score: 92 },
      { name: "Diana", score: 90 },
      { name: "Eve", score: 88 },
      { name: "Eve", score: 88 },
      { name: "Eve", score: 88 },
      { name: "Eve", score: 88 },
    ],
  },
];

export default function Leaderboard() {
  const [modalSubject, setModalSubject] = useState(null);

  return (
    <div className="min-h-screen p-8 bg-[#2c3250]">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        Leaderboards
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {leaderboardData.map((board, idx) => (
          <motion.div
            key={board.subject}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transform transition border-1 border-white "
          >
            <div className="bg-[#2c3250] p-4">
              <h2 className="text-2xl font-semibold text-white">
                {board.subject}
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-2">
                {board.leaders.slice(0, 5).map((leader, i) => (
                  <li
                    key={leader.name}
                    className="flex justify-between items-center"
                  >
                    <span className="font-medium text-gray-800">
                      {i + 1}. {leader.name}
                    </span>
                    <span className="font-bold text-[#2c3250]">
                      {leader.score}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 flex justify-end border-t">
              <button
                onClick={() => setModalSubject(board)}
                className="px-4 py-2 bg-[#2c3250] text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer"
              >
                View All
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for full leaderboard */}
      {modalSubject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 ">
          <div className="bg-white rounded-2xl shadow-2xl w-3/5 h-3/5 overflow-y-auto relative">
            <div className="bg-[#2c3250] p-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="sticky text-2xl font-semibold text-white">
                {modalSubject.subject} Leaderboard
              </h2>
              <button
                onClick={() => setModalSubject(null)}
                className="text-white text-2xl hover:text-gray-200 cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modalSubject.leaders.map((leader, i) => (
                <div
                  key={leader.name}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-[#2c3250]">
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-800">
                      {leader.name}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-700">
                    Score:{" "}
                    <span className="text-[#2c3250]">{leader.score}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
