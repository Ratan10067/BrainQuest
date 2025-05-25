import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Globe } from "lucide-react";

const languages = [
  {
    name: "English",
    code: "en",
    flag: "🇺🇸",
    subtitle: "English (US)",
  },
  {
    name: "Hindi",
    code: "hi",
    flag: "🇮🇳",
    subtitle: "हिंदी",
  },
  {
    name: "Spanish",
    code: "es",
    flag: "🇪🇸",
    subtitle: "Español",
  },
  {
    name: "French",
    code: "fr",
    flag: "🇫🇷",
    subtitle: "Français",
  },
  {
    name: "German",
    code: "de",
    flag: "🇩🇪",
    subtitle: "Deutsch",
  },
  {
    name: "Japanese",
    code: "ja",
    flag: "🇯🇵",
    subtitle: "日本語",
  },
];

export default function Language() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">Language Settings</h1>
            <p className="text-gray-400">Choose your preferred language</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => setSelectedLanguage(lang.code)}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
              selectedLanguage === lang.code
                ? "bg-blue-500/10 border-blue-500/50"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-4xl">{lang.flag}</span>
            <div className="flex-1 text-left">
              <h3 className="text-white font-medium">{lang.name}</h3>
              <p className="text-gray-400 text-sm">{lang.subtitle}</p>
            </div>
            {selectedLanguage === lang.code && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="border-t border-white/10 pt-8">
        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-4 px-6 font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f37]">
          Save Language Preference
        </button>
      </div>
    </div>
  );
}
