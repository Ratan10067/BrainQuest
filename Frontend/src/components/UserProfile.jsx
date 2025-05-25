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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Settings from "./Settings";
import { AuthContext } from "../context/UserContext";
export default function UserProfile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const avatarInput = useRef();
  const [activeView, setActiveView] = useState("profile");
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "Not provided",
    location: "Not provided",
    avatar: "./assets/default.jpg",
  });

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [error, setError] = useState({
    show: false,
    message: "",
    details: "",
  });

  const handleViewSwitch = (view) => {
    setActiveView(view);
    setEditMode(false); // Reset edit mode when switching views
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
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
          setProfile((p) => ({
            ...p,
            name: user.user.name,
            email: user.user.email,
            avatar: user.user.avatar || "./assets/default.jpg",
            phone: user.user.phone || "Not provided",
            location: user.user.location || "Not provided",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError({
          show: true,
          message: "Failed to load profile",
          details: error.response?.data?.message || "Please try again later",
        });
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
    if (file) {
      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await axios.post(
          "http://localhost:4000/users/upload-avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          setProfile((p) => ({ ...p, avatar: URL.createObjectURL(file) }));
          showNotification("success", "Avatar updated successfully!");
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        setError({
          show: true,
          message: "Failed to update avatar",
          details:
            "There was a problem uploading your image. Please try again.",
        });
      }
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Remove email from the update payload
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f37] to-[#2c3250] p-8">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl md:w-[380px] flex-shrink-0 h-fit p-8 space-y-8 border border-white/20">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-500/30 shadow-xl transition-transform duration-300 group-hover:scale-105"
              />
              {editMode && (
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
              <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
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
                className="text-green-400 group-hover:scale-110 transition-transform"
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
                  {editMode ? "Edit Profile" : "My Profile"}
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
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>

              {!editMode ? (
                <div className="space-y-6">
                  {[
                    {
                      icon: <UserIcon size={20} />,
                      label: "Name",
                      value: profile.name,
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
                      icon: <MapPin size={20} />,
                      label: "Location",
                      value: profile.location,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="text-blue-400">{item.icon}</div>
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm">{item.label}</p>
                        <p
                          className={`text-white font-medium ${
                            item.isEmail
                              ? "select-none  hover:blur-none transition-all duration-300"
                              : ""
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
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
                      },
                      {
                        label: "Email",
                        value: profile.email,
                        key: "email",
                        icon: <Mail size={20} />,
                        disabled: true,
                        tooltip: "Email cannot be changed",
                      },
                      {
                        label: "Phone",
                        value: profile.phone,
                        key: "phone",
                        icon: <Phone size={20} />,
                      },
                      {
                        label: "Location",
                        value: profile.location,
                        key: "location",
                        icon: <MapPin size={20} />,
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
                            type={field.key === "email" ? "email" : "text"}
                            value={field.value}
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
                            }`}
                            placeholder={`Enter your ${field.label.toLowerCase()}`}
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
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-4 px-6 font-semibold cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1f37]"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </>
          ) : (
            <Settings />
          )}
        </section>
      </div>

      {/* Notifications */}
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
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <AlertCircle className="w-6 h-6 text-white" />
              )}
              <p className="text-white font-medium">{notification.message}</p>
              <button
                onClick={() =>
                  setNotification({ show: false, type: "", message: "" })
                }
                className="text-white/80 hover:text-white cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {error.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg border border-red-500/20 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {error.message}
                    </h3>
                    <p className="text-red-200/70">{error.details}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setError({ show: false, message: "", details: "" })
                  }
                  className="text-white/60 hover:text-white cursor-pointer transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="h-1.5 w-full bg-red-500/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 5 }}
                    className="h-full bg-red-500"
                    onAnimationComplete={() =>
                      setError({ show: false, message: "", details: "" })
                    }
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 rounded-lg bg-red-500 cursor-pointer text-white hover:bg-red-600 transition-colors"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() =>
                      setError({ show: false, message: "", details: "" })
                    }
                    className="px-4 py-2 cursor-pointer rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
