// src/components/UserProfile.jsx
import React, { useState, useRef } from "react";
import {
  X,
  ChevronRight,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogoutIcon,
  Globe as LanguageIcon,
  Edit2 as EditIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function UserProfile() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const avatarInput = useRef();
  const [profile, setProfile] = useState({
    name: "Ratan Kumar",
    email: "Ratankumar10cr7@gmail.com",
    mobile: "7643070223",
    location: "USA",
    avatar: "./assets/logo.png",
  });

  const handleAvatarClick = () => avatarInput.current.click();
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfile((p) => ({ ...p, avatar: URL.createObjectURL(file) }));
  };
  const handleLogOut = async () => {
    console.log("Logout clicked");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:4000/users/user-logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        console.log("Logout successful");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-[#2c3250] p-8">
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto">
        {/* Sidebar */}
        <aside className="bg-white rounded-2xl shadow-lg w-full md:w-1/3 p-6 space-y-6">
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
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {editMode ? "Edit Profile" : "My Profile"}
            </h1>
            <button
              onClick={() => setEditMode((m) => !m)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <EditIcon size={20} />
              <span>{editMode ? "Cancel" : "Edit Profile"}</span>
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
                <span className="text-gray-600">Mobile Number</span>
                <span className="text-gray-800">
                  {profile.mobile || "Add number"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Location</span>
                <span className="text-gray-800">{profile.location}</span>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={profile.mobile}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, mobile: e.target.value }))
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
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, location: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
                />
              </div>
              <button
                type="submit"
                className="mt-4 bg-[#1f2b48] text-white rounded-lg py-3 px-6 font-semibold hover:bg-opacity-90 transition"
              >
                Save Change
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
