import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaMedal, FaCrown, FaUserCircle } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

// Mock data for testing
const mockLeaderboardData = [
  {
    subject: "Mathematics",
    leaders: [
      { name: "John Doe", score: 980, attempts: 15 },
      { name: "Alice Smith", score: 945, attempts: 12 },
      { name: "Bob Johnson", score: 920, attempts: 10 },
      { name: "Emma Wilson", score: 890, attempts: 8 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
    ],
  },
  {
    subject: "Mathematics",
    leaders: [
      { name: "John Doe", score: 980, attempts: 15 },
      { name: "Alice Smith", score: 945, attempts: 12 },
      { name: "Bob Johnson", score: 920, attempts: 10 },
      { name: "Emma Wilson", score: 890, attempts: 8 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
      { name: "Mike Brown", score: 875, attempts: 7 },
    ],
  },
  {
    subject: "Science",
    leaders: [
      { name: "Emily Taylor", score: 990, attempts: 20 },
      { name: "James Anderson", score: 970, attempts: 18 },
      { name: "Sophie Miller", score: 940, attempts: 15 },
      { name: "Oliver Wilson", score: 915, attempts: 12 },
      { name: "Ava Thompson", score: 900, attempts: 10 },
    ],
  },
  {
    subject: "History",
    leaders: [
      { name: "Daniel Lee", score: 995, attempts: 25 },
      { name: "Sophia Chen", score: 975, attempts: 22 },
      { name: "Lucas Martin", score: 950, attempts: 20 },
      { name: "Mia Rodriguez", score: 925, attempts: 18 },
      { name: "Henry Garcia", score: 900, attempts: 15 },
    ],
  },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

export default function Leaderboard() {
  const [modalSubject, setModalSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate loading
        setLeaderboardData(mockLeaderboardData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMedalColor = (index) => {
    switch (index) {
      case 0:
        return "text-yellow-400";
      case 1:
        return "text-gray-400";
      case 2:
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-[#1a1f37] to-[#2c3250] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-7xl">
          <div className="animate-pulse flex justify-center">
            <div className="h-12 bg-white/10 rounded-lg w-64"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-2xl h-[400px] animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#1a1f37] to-[#2c3250]">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl font-bold text-white text-center mb-12 flex items-center justify-center gap-4"
      >
        <FaTrophy className="text-yellow-400 text-4xl" />
        Leaderboards
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {leaderboardData.map((board, idx) => (
          <motion.div
            key={board.subject}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={idx}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden hover:scale-105 transform transition duration-300 border border-white/20"
          >
            <div className="bg-gradient-to-r from-[#2c3250] to-[#1a1f37] p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaCrown className="text-yellow-400" />
                {board.subject}
              </h2>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                {board.leaders.slice(0, 5).map((leader, i) => (
                  <motion.li
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    key={leader.name}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${getMedalColor(i)}`}>
                        {i <= 2 ? <FaMedal size={24} /> : `${i + 1}`}
                      </span>
                      <div>
                        <span className="font-medium text-white block">
                          {leader.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {leader.attempts} attempts
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-white bg-[#2c3250] px-4 py-1 rounded-full">
                      {leader.score}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="p-4 flex justify-end border-t border-white/10">
              <button
                onClick={() => setModalSubject(board)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
              >
                View All
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modalSubject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-[#1a1f37] to-[#2c3250] rounded-2xl shadow-2xl w-4/5 max-w-4xl h-4/5 overflow-hidden relative border border-white/20"
            >
              <div className="bg-gradient-to-r from-[#2c3250] to-[#1a1f37] p-6 rounded-t-2xl flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FaTrophy className="text-yellow-400" />
                  {modalSubject.subject} Leaderboard
                </h2>
                <button
                  onClick={() => setModalSubject(null)}
                  className="text-white hover:text-red-400 transition-colors cursor-pointer"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100%-5rem)]">
                {modalSubject.leaders.map((leader, i) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    key={leader.name}
                    className="flex justify-between items-center bg-white/5 p-5 rounded-xl hover:bg-white/10 transition duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl font-bold ${getMedalColor(i)}`}
                      >
                        {i <= 2 ? <FaMedal size={28} /> : `${i + 1}`}
                      </span>
                      <div>
                        <span className="font-medium text-white text-lg block">
                          {leader.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {leader.attempts} attempts
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80">Score:</span>
                      <span className="font-bold text-xl bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full">
                        {leader.score}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
