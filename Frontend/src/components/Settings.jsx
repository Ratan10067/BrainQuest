import React, { useState } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, BookOpen, Shield, Eye } from "lucide-react";

// Settings configuration
const settingsSections = [
  {
    title: "Account Preferences",
    icon: <UserIcon size={20} className="text-blue-400" />,
    settings: [
      {
        name: "Display Mode",
        description: "Switch between light and dark themes",
        type: "toggle",
        key: "theme",
      },
      {
        name: "Notifications",
        description: "Manage your notification preferences",
        type: "toggle",
        key: "notifications",
      },
    ],
  },
  {
    title: "Quiz Preferences",
    icon: <BookOpen size={20} className="text-green-400" />,
    settings: [
      {
        name: "Quiz Timer",
        description: "Enable/disable countdown timer during quizzes",
        type: "toggle",
        key: "quizTimer",
      },
      {
        name: "Difficulty Level",
        description: "Set your default quiz difficulty",
        type: "select",
        options: ["Easy", "Medium", "Hard"],
        key: "difficulty",
      },
      {
        name: "Auto-Submit",
        description: "Automatically submit quiz when timer ends",
        type: "toggle",
        key: "autoSubmit",
      },
    ],
  },
  {
    title: "Privacy & Security",
    icon: <Shield size={20} className="text-purple-400" />,
    settings: [
      {
        name: "Profile Visibility",
        description: "Control who can see your profile",
        type: "select",
        options: ["Public", "Friends Only", "Private"],
        key: "visibility",
      },
      {
        name: "Show Progress",
        description: "Display your learning progress to others",
        type: "toggle",
        key: "showProgress",
      },
      {
        name: "Two-Factor Authentication",
        description: "Add an extra layer of security",
        type: "toggle",
        key: "2fa",
      },
    ],
  },
  {
    title: "Accessibility",
    icon: <Eye size={20} className="text-yellow-400" />,
    settings: [
      {
        name: "Font Size",
        description: "Adjust text size for better readability",
        type: "select",
        options: ["Small", "Medium", "Large"],
        key: "fontSize",
      },
      {
        name: "High Contrast",
        description: "Increase contrast for better visibility",
        type: "toggle",
        key: "highContrast",
      },
      {
        name: "Screen Reader",
        description: "Optimize for screen readers",
        type: "toggle",
        key: "screenReader",
      },
    ],
  },
];

export default function Settings() {
  const [settings, setSettings] = useState({});

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      {settingsSections.map((section, idx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/5 rounded-2xl p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            {section.icon}
            <h2 className="text-xl font-semibold text-white">
              {section.title}
            </h2>
          </div>

          <div className="space-y-4">
            {section.settings.map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div>
                  <h3 className="text-white font-medium">{setting.name}</h3>
                  <p className="text-gray-400 text-sm">{setting.description}</p>
                </div>

                {setting.type === "toggle" ? (
                  <button
                    onClick={() =>
                      handleSettingChange(setting.key, !settings[setting.key])
                    }
                    className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                      settings[setting.key] ? "bg-blue-500" : "bg-gray-600"
                    } relative`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform duration-200 ${
                        settings[setting.key]
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                ) : setting.type === "select" ? (
                  <select
                    value={settings[setting.key] || setting.options[0]}
                    onChange={(e) =>
                      handleSettingChange(setting.key, e.target.value)
                    }
                    className="bg-white/10 text-white rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {setting.options.map((option) => (
                      <option
                        key={option}
                        value={option}
                        className="bg-[#1a1f37]"
                      >
                        {option}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
