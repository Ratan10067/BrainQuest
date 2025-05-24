import React, { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const avatarInput = useRef();
  const [modal, setModal] = useState({ show: false, type: "", message: "" });
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });
  const [profile, setProfile] = useState({
    name: "Ratan Kumar",
    email: "Ratankumar10cr7@gmail.com",
    phone: "Not provided",
    location: "Not provided",
    avatar: "./assets/default.jpg",
  });

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
            avatar: "./assets/default.jpg",
            phone: user.user.phone || "Not provided",
            location: user.user.location || "Not provided",
          }));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error.message);
      }
    };

    fetchUserProfile();
  }, []);

  const handleAvatarClick = () => avatarInput.current.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfile((p) => ({ ...p, avatar: URL.createObjectURL(file) }));
  };

  const handleLogOut = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/users/user-logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/users/user-update",
        profile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setEditMode(false);
        setNotification({
          show: true,
          type: "success",
          message: "Profile updated successfully! 🎉",
        });
      }
    } catch (error) {
      setNotification({
        show: true,
        type: "error",
        message: "Oops! Something went wrong 😟",
      });
    }
    // Auto hide notification after 3 seconds
    // setTimeout(() => {
    //   setNotification({ show: false, type: "", message: "" });
    // }, 3000);
  };
  return (
    <div className="min-h-screen bg-[#2c3250] p-8">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-lg md:w-[380px] flex-shrink-0 h-fit p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {profile.name}
              </h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center justify-start space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <UserIcon size={18} />
              <span>My Profile</span>
              <ChevronRight className="ml-auto" size={18} />
            </button>
            <button className="w-full flex items-center justify-start space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <SettingsIcon size={18} />
              <span>Settings</span>
              <ChevronRight className="ml-auto" size={18} />
            </button>
            <button className="w-full flex items-center justify-start space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
              <LanguageIcon size={18} />
              <span>Language</span>
              <ChevronRight className="ml-auto" size={18} />
            </button>
            <button
              onClick={handleLogOut}
              className="w-full cursor-pointer flex items-center justify-start space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <LogoutIcon size={18} />
              <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="bg-white rounded-2xl shadow-lg w-full md:w-2/3 p-8 relative">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 cursor-pointer">
              {editMode ? "Edit Profile" : "My Profile"}
            </h1>
            <button
              onClick={() => setEditMode((m) => !m)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              {editMode ? (
                <>
                  <X size={20} />
                  <span className="cursor-pointer">Cancel</span>
                </>
              ) : (
                <>
                  <EditIcon size={20} />
                  <span className="cursor-pointer">Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Content */}
          {!editMode ? (
            <div className="space-y-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Name</span>
                <span className="text-gray-800">{profile.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Email Account</span>
                <span className="text-gray-800">{profile.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Phone Number</span>
                <span className="text-gray-800">
                  {profile.phone || "Add number"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Location</span>
                <span className="text-gray-800">{profile.location}</span>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleUpdateProfile}>
              <div className="relative w-28">
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-28 h-28 rounded-full"
                />
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow"
                >
                  <SettingsIcon size={16} />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInput}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Account
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Add number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  placeholder="Add Location"
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, location: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#1f2b48] text-white rounded-lg py-3 px-6 font-semibold hover:bg-opacity-90 transition cursor-pointer"
              >
                Save Change
              </button>
            </form>
          )}
        </section>
      </div>
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed bottom-4 right-4 max-w-xl"
          >
            <div
              className={`relative overflow-hidden rounded-lg shadow-lg hover:scale-102 transition-transform duration-200 ${
                notification.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
              onMouseEnter={(e) => {
                const progressBar =
                  e.currentTarget.querySelector(".progress-bar");
                progressBar?.classList.add("progress-bar-paused");
              }}
              onMouseLeave={(e) => {
                const progressBar =
                  e.currentTarget.querySelector(".progress-bar");
                progressBar?.classList.remove("progress-bar-paused");
              }}
            >
              <div className="px-8 py-4 flex items-center space-x-3">
                {notification.type === "success" ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-white" />
                )}
                <span className="text-white font-medium text-lg">
                  {notification.message}
                </span>
                <button
                  onClick={() =>
                    setNotification({ show: false, type: "", message: "" })
                  }
                  className="ml-4 text-white hover:opacity-80 transition-opacity"
                >
                  <X className="w-5 h-5 cursor-pointer" />
                </button>
              </div>

              <div
                className={`absolute bottom-0 left-0 h-1.5 progress-bar ${
                  notification.type === "success"
                    ? "bg-green-300"
                    : "bg-red-300"
                }`}
                onAnimationEnd={() => {
                  setNotification({ show: false, type: "", message: "" });
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
