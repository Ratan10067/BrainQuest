import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Home,
  Brain,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/UserContext";
export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropDownRef = useRef(null);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserName("");
    navigate("/");
    setProfileDropdownOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home", icon: <Home size={18} /> },
    { path: "/quiz", label: "Quiz", icon: <Brain size={18} /> },
    { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
    { path: "/Contact-us", label: "Contact Us", icon: <UserIcon size={18} /> },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);
  return (
    <nav className="bg-[#1a1f37]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center"
            >
              <span className="text-xl font-bold text-white">B</span>
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
              rainQuest
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Auth/Profile Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropDownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-white px-4 py-2 rounded-xl bg-[#2c3250] hover:bg-[#2c3250]/80 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <UserIcon size={18} className="text-[#1a1f37]" />
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 py-2 bg-[#2c3250] rounded-xl shadow-xl border border-white/10"
                    >
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">
                          {userName || "User"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 flex items-center space-x-2 cursor-pointer"
                      >
                        <UserIcon size={16} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-white/10 flex items-center space-x-2 cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden cursor-pointer text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "text-yellow-400 bg-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                    >
                      <UserIcon size={18} />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-xl"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : // <NavLink
                //   to="/"
                //   onClick={() => setMenuOpen(false)}
                //   className="block px-4 py-3 text-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-[#1a1f37] font-medium cursor-pointer"
                // >
                //   Get Started
                // </NavLink>
                null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
