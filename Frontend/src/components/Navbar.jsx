import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  Brain,
  Trophy,
  ChevronDown,
  Crown,
  Star,
  MessageCircle,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, setIsAuthenticated, darkMode, setDarkMode } =
    useContext(AuthContext);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [premiumDropdownOpen, setPremiumDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropDownRef = useRef(null);
  const premiumDropdownRef = useRef(null);
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
    { path: "/Contact-us", label: "Contact Us", icon: <Mail size={18} /> },
    { path: "/feedback", label: "Feedback", icon: <MessageCircle size={18} /> },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (
        premiumDropdownRef.current &&
        !premiumDropdownRef.current.contains(event.target)
      ) {
        setPremiumDropdownOpen(false);
      }
    }
    if (profileDropdownOpen || premiumDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen, premiumDropdownOpen]);

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
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 lg:space-x-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-white"
                  }`
                }
              >
                {item.icon}
                <span className="text-xs lg:text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Premium & Auth Section */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/* Premium Button/Dropdown */}
            <div className="relative" ref={premiumDropdownRef}>
              {isAuthenticated ? (
                // Premium Button for Authenticated Users
                <NavLink
                  to="/premium"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-[#1a1f37] font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Crown size={16} className="lg:w-[18px] lg:h-[18px]" />
                  <span className="whitespace-nowrap">Go Premium</span>
                </NavLink>
              ) : (
                // Premium Dropdown for Non-Authenticated Users
                <>
                  <button
                    onClick={() => setPremiumDropdownOpen(!premiumDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-[#1a1f37] font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    <Crown size={18} />
                    <span>Go Premium</span>
                    <ChevronDown
                      size={16}
                      className={`transform transition-transform ${
                        premiumDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {premiumDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 py-2 bg-[#2c3250] rounded-xl shadow-xl border border-white/10"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <p className="text-sm font-medium text-white">
                              Unlock Premium Features
                            </p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            Sign in to access premium benefits
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigate("/signin");
                            setPremiumDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 flex items-center space-x-2 cursor-pointer"
                        >
                          <User size={16} />
                          <span>Sign In</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/premium");
                            setPremiumDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-yellow-400 hover:text-yellow-300 hover:bg-white/10 flex items-center space-x-2 cursor-pointer"
                        >
                          <Crown size={16} />
                          <span>View Premium Plans</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Profile Section */}
            {isAuthenticated && (
              <div className="relative" ref={dropDownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-1 lg:space-x-2 text-white px-3 lg:px-4 py-2 rounded-xl bg-[#2c3250] hover:bg-[#2c3250]/80 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                    <User
                      size={16}
                      className="lg:w-[18px] lg:h-[18px] text-[#1a1f37]"
                    />
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transform transition-transform lg:w-4 lg:h-4 ${
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
                        <User size={16} />
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
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-400" />
              )}
            </motion.button>
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

                {/* Mobile Premium Button */}
                {isAuthenticated ? (
                  <NavLink
                    to="/premium"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-[#1a1f37] font-medium cursor-pointer"
                  >
                    <Crown size={18} />
                    <span>Go Premium</span>
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/premium");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-[#1a1f37] font-medium"
                    >
                      <Crown size={18} />
                      <span>Go Premium</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/20"
                    >
                      <User size={18} />
                      <span>Sign In</span>
                    </button>
                  </>
                )}

                {isAuthenticated && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                    >
                      <User size={18} />
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
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
