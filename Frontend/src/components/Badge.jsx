import React from "react";
import { motion } from "framer-motion";

const Badge = ({ badge, earned = false, progress = 0 }) => {
  const badgeImages = {
    "gold-medal": require("../assets/badges/gold-medal.png"),
    "silver-star": require("../assets/badges/silver-star.png"),
    "bronze-star" : require("../assets/badges/bronze-star.png")
  };

  return (
    <motion.div
      className={`relative p-4 rounded-lg border-2 ${
        earned
          ? "bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-300 shadow-lg"
          : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 opacity-70"
      }`}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex flex-col items-center">
        <img
          src={badgeImages[badge.imageKey]}
          alt={badge.name}
          className={`w-16 h-16 ${!earned ? "grayscale" : ""}`}
        />
        <h4 className="font-semibold mt-2 text-center">{badge.name}</h4>
        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
          {earned ? "Earned!" : badge.description}
        </p>

        {!earned && progress > 0 && (
          <div className="w-full mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Badge;
