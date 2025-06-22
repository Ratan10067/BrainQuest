import React, { useState, useRef, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  Globe as LanguageIcon,
  Edit2 as EditIcon,
  CheckCircle,
  AlertCircle,
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  Briefcase,
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Key,
  UserCheck,
  ExternalLink,
  Globe,
  Book,
  CircleAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Settings from "./Settings";
import { AuthContext } from "../context/UserContext";
import SessionExpiredModal from "./SessionExpiredModal";
import ChatBot from "./ChatBot";
import UserProfileModal from "./UserProfileModal";
export default function UserProfile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const avatarInput = useRef();
  const [activeView, setActiveView] = useState("profile");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const {
    isAuthenticated,
    setIsAuthenticated,
    sessionExpired,
    setSessionExpired,
  } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "Not provided",
    location: "Not provided",
    avatar: "./assets/default.jpg",
    gender: "Not specified",
    birthday: "Not provided",
    summary: "Tell us about yourself (interests, experience, etc.)",
    website: "Your blog, portfolio, etc.",
    github: "",
    linkedin: "",
    twitter: "",
    workExperience: "Add a workplace",
    education: "Add your education",
    skills: [],
  });

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [error, setError] = useState({
    show: false,
    message: "",
    details: "",
  });
  const [userProfileModal, setUserProfileModal] = useState({
    user: null,
    entry: null,
  });
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const handleViewSwitch = (view) => {
    setActiveView(view);
    setEditMode(false);
  };
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:4000/users/user-profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const user = response.data;
          console.log("User profile data:", user);
          setProfile((p) => ({
            ...p,
            name: user.user.name,
            email: user.user.email,
            avatar: user.user.avatar || "./assets/default.jpg",
            phone: user.user.phone || "Not provided",
            location: user.user.location || "Not provided",
            gender: user.user.gender || "Not specified",
            birthday: user.user.birthday || "Not provided",
            summary:
              user.user.summary ||
              "Tell us about yourself (interests, experience, etc.)",
            website: user.user.website || "Your blog, portfolio, etc.",
            github: user.user.github || "",
            linkedin: user.user.linkedin || "",
            twitter: user.user.twitter || "",
            workExperience: user.user.workExperience || "Add a workplace",
            education: user.user.education || "Add your education",
            skills: user.user.skills || [],
          }));
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error(
            "Authentication failed - token might be invalid or expired"
          );
          setSessionExpired(true);
        }
        console.error("Error fetching user profile:", error);
        setError({
          show: true,
          message: "Failed to load profile",
          details: error.response?.data?.message || "Please try again later",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleAvatarClick = () => avatarInput.current.click();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsAvatarLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result;

          const response = await axios.post(
            "http://localhost:4000/users/update-avatar",
            { avatarUrl: base64String },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            setProfile((prev) => ({ ...prev, avatar: response.data.avatar }));
            showNotification(
              "success",
              "Profile picture updated successfully! 🎉"
            );
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
          setError({
            show: true,
            message: "Failed to update profile picture",
            details: error.response?.data?.message || "Please try again later",
          });
        } finally {
          setIsAvatarLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setError({
        show: true,
        message: "Failed to process image",
        details: "Please try a different image file",
      });
    }
  };
  const handleLogOut = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/users/user-logout",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        navigate("/signin");
      }
    } catch (error) {
      console.error("Logout error:", error);
      setError({
        show: true,
        message: "Failed to logout",
        details: "Unable to logout at this time. Please try again.",
      });
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/users/forgot-password",
        { email: profile.email }
      );
      if (response.status === 200) {
        setMessage("Check your inbox! We've sent a password reset link.");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again.";
      setMessage(msg);
    }
  };
  const handleDeleteClick = async (e) => {
    setShowDeleteConfirmation(true);
  };
  const handleConfirmDelete = async (e) => {
    setShowDeleteConfirmation(false);
    try {
      const response = await axios.delete(
        "http://localhost:4000/users/delete-account",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        navigate("/");
      }
    } catch (error) {
      console.log("error comes while deleting profile : ", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const { email, ...updateData } = profile;

      const response = await axios.post(
        "http://localhost:4000/users/user-update",
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setEditMode(false);
        showNotification("success", "Profile updated successfully! 🎉");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError({
        show: true,
        message: "Failed to update profile",
        details: error.response?.data?.message || "Please try again later",
      });
    }
  };
  const handleImageError = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/users/refresh-avatar",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.avatar) {
        setProfile((prev) => ({ ...prev, avatar: response.data.avatar }));
      }
    } catch (error) {
      console.error("Failed to refresh avatar URL:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="relative w-24 h-24">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            {/* Inner pulse */}
            <div className="absolute inset-4 bg-blue-500/20 rounded-full animate-pulse"></div>
          </div>
          <h2 className="mt-8 text-xl font-semibold text-white">
            Loading Profile...
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we fetch your data
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto">
          {/* Sidebar */}
          <aside className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl md:w-[380px] flex-shrink-0 h-fit p-8 space-y-8 border border-white/20">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  onError={handleImageError}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500/30 shadow-xl transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  onClick={() => {
                    setShowProfileModal(true);
                    setUserProfileModal({
                      user: {
                        ...profile, // All user profile data
                        quizzesTaken:
                          profile.statistics?.totalQuizzesTaken || 0,
                        totalScore: profile.statistics?.totalScore || 0,
                      },
                      entry: {
                        rank: profile.leaderboardHistory?.[0]?.rank || 0,
                        score: profile.statistics?.averageScore || 0,
                        completionTime:
                          profile.quizHistory?.[0]?.timeTaken || 0,
                        submittedAt:
                          profile.quizHistory?.[0]?.completedAt ||
                          new Date().toISOString(),
                      },
                    });
                  }}
                  className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  <i className="fas fa-chart-line mr-1"></i>
                  View Performance
                </button>
                {isAvatarLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <div className="relative">
                      {/* Spinning circle animation */}
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                      {/* Inner pulse animation */}
                      <div className="absolute inset-0 rounded-full animate-pulse bg-blue-500/20"></div>
                    </div>
                  </div>
                )}
                {editMode && !isAvatarLoading && (
                  <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 cursor-pointer"
                  >
                    <Camera size={16} className="text-white" />
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInput}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">
                  {profile.name}
                </h2>
                <p className="text-blue-300/80">{profile.email}</p>
              </div>
            </div>

            <nav className="space-y-3">
              <button
                onClick={() => handleViewSwitch("profile")}
                className={`w-full flex items-center justify-start space-x-3 px-6 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-300 group cursor-pointer ${
                  activeView === "profile" ? "bg-white/10" : ""
                }`}
              >
                <UserIcon
                  size={20}
                  className="text-blue-400 group-hover:scale-110 transition-transform"
                />
                <span>My Profile</span>
                <ChevronRight
                  className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
              <button
                onClick={() => handleViewSwitch("account")}
                className={`w-full flex items-center justify-start space-x-3 px-6 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-300 group cursor-pointer ${
                  activeView === "account" ? "bg-white/10" : ""
                }`}
              >
                <Shield
                  size={20}
                  className="text-green-400 group-hover:scale-110 transition-transform"
                />
                <span>Account</span>
                <ChevronRight
                  className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
              <button
                onClick={() => handleViewSwitch("settings")}
                className={`w-full flex items-center justify-start space-x-3 px-6 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-300 group cursor-pointer ${
                  activeView === "settings" ? "bg-white/10" : ""
                }`}
              >
                <SettingsIcon
                  size={20}
                  className="text-purple-400 group-hover:scale-110 transition-transform"
                />
                <span>Settings</span>
                <ChevronRight
                  className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
              <button className="w-full flex items-center justify-start space-x-3 px-6 py-4 text-white hover:bg-white/10 rounded-2xl transition-all duration-300 group cursor-pointer">
                <LanguageIcon
                  size={20}
                  className="text-yellow-400 group-hover:scale-110 transition-transform"
                />
                <span>Language</span>
                <ChevronRight
                  className="ml-auto opacity-50 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </button>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center justify-start space-x-3 px-6 py-4 text-white hover:bg-red-500/20 rounded-2xl transition-all duration-300 group cursor-pointer"
              >
                <LogoutIcon
                  size={20}
                  className="text-red-400 group-hover:scale-110 transition-transform cursor-pointer"
                />
                <span>Log Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <section className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full p-8 relative border border-white/20">
            {activeView === "profile" ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-white">
                    {editMode ? "Edit Profile" : "Basic Info"}
                  </h1>
                  <button
                    onClick={() => setEditMode((m) => !m)}
                    className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                  >
                    {editMode ? (
                      <>
                        <X size={20} />
                        <span>Cancel</span>
                      </>
                    ) : (
                      <>
                        <EditIcon size={20} />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                </div>

                {!editMode ? (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      {[
                        {
                          icon: <UserIcon size={20} />,
                          label: "Name",
                          value: profile.name,
                        },
                        {
                          icon: <UserCheck size={20} />,
                          label: "Gender",
                          value: profile.gender,
                        },
                        {
                          icon: <MapPin size={20} />,
                          label: "Location",
                          value: profile.location,
                        },
                        {
                          icon: <Calendar size={20} />,
                          label: "Birthday",
                          value: profile.birthday,
                        },
                        {
                          icon: <Mail size={20} />,
                          label: "Email",
                          value: profile.email,
                          isEmail: true,
                        },
                        {
                          icon: <Phone size={20} />,
                          label: "Phone",
                          value: profile.phone,
                        },
                        {
                          icon: <EditIcon size={20} />,
                          label: "Summary",
                          value: profile.summary,
                          isMultiline: true,
                        },
                        {
                          icon: <Globe size={20} />,
                          label: "Website",
                          value: profile.website,
                        },
                        {
                          icon: <Github size={20} />,
                          label: "Github",
                          value: profile.github || "Not provided",
                        },
                        {
                          icon: <Linkedin size={20} />,
                          label: "LinkedIn",
                          value: profile.linkedin || "Not provided",
                        },
                        {
                          icon: <Twitter size={20} />,
                          label: "Twitter",
                          value: profile.twitter || "Not provided",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                        >
                          <div className="text-blue-400 mt-1">{item.icon}</div>
                          <div className="flex-1">
                            <p className="text-gray-400 text-sm">
                              {item.label}
                            </p>
                            <p
                              className={`text-white font-medium ${
                                item.isEmail
                                  ? "select-none hover:blur-none transition-all duration-300"
                                  : ""
                              } ${
                                item.isMultiline ? "whitespace-pre-wrap" : ""
                              }`}
                            >
                              {item.value}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Experience Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Experience
                      </h3>
                      <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <div className="text-blue-400 mt-1">
                          <Briefcase size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Work</p>
                          <p className="text-white font-medium">
                            {profile.workExperience}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <div className="text-blue-400 mt-1">
                          <Book size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">Education</p>
                          <p className="text-white font-medium">
                            {profile.education}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-white">
                        Skills
                      </h3>
                      <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-300">
                        <div className="text-blue-400 mt-1">
                          <UserCheck size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">
                            Technical Skills
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {profile.skills.length > 0 ? (
                              profile.skills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">
                                No skills added
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "Name",
                          value: profile.name,
                          key: "name",
                          icon: <UserIcon size={20} />,
                          placeholder: "Enter your name",
                        },
                        {
                          label: "Gender",
                          value: profile.gender,
                          key: "gender",
                          icon: <UserCheck size={20} />,
                          placeholder: "Select your gender",
                        },
                        {
                          label: "Location",
                          value: profile.location,
                          key: "location",
                          icon: <MapPin size={20} />,
                          placeholder: "Enter your location",
                        },
                        {
                          label: "Birthday",
                          value: profile.birthday,
                          key: "birthday",
                          icon: <Calendar size={20} />,
                          type: "date",
                          placeholder: "Select your birthday",
                        },
                        {
                          label: "Email",
                          value: profile.email,
                          key: "email",
                          icon: <Mail size={20} />,
                          disabled: true,
                          tooltip: "Email cannot be changed",
                          placeholder: "Your email address",
                        },
                        {
                          label: "Phone",
                          value: profile.phone,
                          key: "phone",
                          icon: <Phone size={20} />,
                          placeholder: "Enter your phone number",
                        },
                        {
                          label: "Website",
                          value: profile.website,
                          key: "website",
                          icon: <Globe size={20} />,
                          placeholder: "Enter your website URL",
                        },
                      ].map((field) => (
                        <div key={field.key} className="relative group">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                              {field.icon}
                            </div>
                            <input
                              type={
                                field.type ||
                                (field.key === "email" ? "email" : "text")
                              }
                              value={field.value || ""}
                              onChange={(e) =>
                                !field.disabled &&
                                setProfile((p) => ({
                                  ...p,
                                  [field.key]: e.target.value,
                                }))
                              }
                              disabled={field.disabled}
                              className={`w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                                field.disabled
                                  ? "cursor-not-allowed opacity-60"
                                  : ""
                              } ${
                                !field.value
                                  ? "text-gray-400 italic"
                                  : "text-white"
                              }`}
                              placeholder={field.placeholder}
                            />
                            {field.disabled && (
                              <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-sm rounded whitespace-nowrap">
                                {field.tooltip}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Social Accounts Section in Edit Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          label: "GitHub",
                          value: profile.github,
                          key: "github",
                          icon: <Github size={20} />,
                          placeholder: "https://github.com/username",
                        },
                        {
                          label: "LinkedIn",
                          value: profile.linkedin,
                          key: "linkedin",
                          icon: <Linkedin size={20} />,
                          placeholder: "https://linkedin.com/in/username",
                        },
                        {
                          label: "Twitter",
                          value: profile.twitter,
                          key: "twitter",
                          icon: <Twitter size={20} />,
                          placeholder: "https://twitter.com/username",
                        },
                      ].map((field) => (
                        <div key={field.key} className="relative">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400">
                              {field.icon}
                            </div>
                            <input
                              type="text"
                              value={field.value || ""}
                              onChange={(e) =>
                                setProfile((p) => ({
                                  ...p,
                                  [field.key]: e.target.value,
                                }))
                              }
                              className={`w-full bg-white/5 border border-white/10 rounded-xl px-10 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                                !field.value
                                  ? "text-gray-400 italic"
                                  : "text-white"
                              }`}
                              placeholder={field.placeholder}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary field - full width */}
                    <div className="relative group">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Summary
                      </label>
                      <div className="relative">
                        <textarea
                          value={profile.summary || ""}
                          onChange={(e) =>
                            setProfile((p) => ({
                              ...p,
                              summary: e.target.value,
                            }))
                          }
                          rows={4}
                          className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-none ${
                            !profile.summary
                              ? "text-gray-400 italic"
                              : "text-white"
                          }`}
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-4 px-6 font-semibold cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f37]"
                    >
                      Save Changes
                    </button>
                  </form>
                )}
              </>
            ) : activeView === "account" ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-white">
                    Account Information
                  </h1>
                </div>

                <div className="space-y-8">
                  {/* Account Details */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5">
                      <div className="text-blue-400 mt-1">
                        <UserIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm">Username</p>
                        <p className="text-white font-medium">{profile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5">
                      <div className="text-blue-400 mt-1">
                        <Mail size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm">Email</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium">
                            {profile.email}
                          </p>
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                            Primary
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white/5">
                      <div className="text-blue-400 mt-1">
                        <Key size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm">Password</p>
                        <button
                          onClick={handleChangePassword}
                          className="text-blue-400 hover:text-blue-300 transition-colors text-sm cursor-pointer"
                        >
                          Change Password
                        </button>
                        {message && (
                          <p
                            className={`px-4 py-3 rounded-lg mb-4 text-center font-medium ${
                              message.type === "error"
                                ? "bg-red-500/20 text-red-300 border border-red-500/50"
                                : "bg-green-500/20 text-green-300 border border-green-500/50"
                            } transition-all duration-300 animate-fadeIn`}
                          >
                            {message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Account */}
                  <div className="pt-8 border-t border-white/10">
                    <button
                      onClick={handleDeleteClick}
                      className="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                  {showDeleteConfirmation && (
                    <div className="absolute inset-0 z-10   rounded-xl flex items-center justify-center">
                      <div className="bg-white rounded-xl p-8 w-96 shadow-2xl border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                          <div className="inline-flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mb-4">
                            <CircleAlert className="h-6 w-6 text-red-600" />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Delete Account
                          </h2>
                          <p className="text-gray-600 mb-8">
                            This will permanently delete all your data. This
                            action cannot be undone.
                          </p>
                          <div className="flex space-x-4">
                            <button
                              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                              onClick={handleCancelDelete}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer"
                              onClick={handleConfirmDelete}
                            >
                              Yes, Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Settings />
            )}
          </section>
          <AnimatePresence>
            {notification.show && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 max-w-md"
              >
                <div
                  className={`rounded-2xl shadow-2xl backdrop-blur-lg p-4 flex items-center space-x-3 ${
                    notification.type === "success"
                      ? "bg-green-500/90"
                      : "bg-red-500/90"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle size={24} className="text-white" />
                  ) : (
                    <AlertCircle size={24} className="text-white" />
                  )}
                  <p className="text-white font-medium">
                    {notification.message}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {error.show && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="bg-[#1a1f37] rounded-2xl p-6 max-w-md w-full border border-white/10"
                >
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={24} className="text-red-400 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {error.message}
                      </h3>
                      <p className="text-gray-300 mt-2">{error.details}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-6 space-x-3">
                    <button
                      onClick={() =>
                        setError({ show: false, message: "", details: "" })
                      }
                      className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      {/* Session Expired Modal */}
      {sessionExpired && (
        <SessionExpiredModal
          isOpen={sessionExpired}
          onClose={() => {
            setSessionExpired(false);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setIsAuthenticated(false);
            navigate("/signin");
          }}
        />
      )}
      <ChatBot />
      {showProfileModal && (
        <UserProfileModal
          user={userProfileModal.user}
          leaderboardEntry={userProfileModal.entry}
          onClose={() => setShowProfileModal(false)}
          hideAddFriend={true}
        />
      )}
    </div>
  );
}
