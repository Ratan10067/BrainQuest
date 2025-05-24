import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  return (
    <nav className="bg-[#2c3250] shadow-md relative">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white flex items-center">
          <span>B</span>
          <span>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-white cursor-pointer hover:text-gray-400 ${
                  isActive ? "underline" : ""
                }`
              }
            ></NavLink>
            rainQuest
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-400 ${isActive ? "underline" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `text-white hover:text-gray-400 ${isActive ? "underline" : ""}`
            }
          >
            Quiz
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) =>
              `text-white hover:text-gray-400 ${isActive ? "underline" : ""}`
            }
          >
            Leaderboard
          </NavLink>
        </div>

        {/* Desktop Auth/Profile */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={() => navigate("/profile")}
              className="text-white hover:text-gray-400 flex items-center cursor-pointer"
            >
              <UserIcon size={20} />
            </button>
          ) : (
            <>
              <NavLink
                to="/signin"
                className="px-4 py-2 border border-white text-white rounded-lg hover:bg-gray-800"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className="px-4 py-2 border border-white text-white rounded-lg hover:bg-gray-800"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={handleMenuToggle}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#2c3250]">
          <NavLink
            to="/"
            onClick={handleMenuToggle}
            className="block px-6 py-3 text-white hover:bg-[#1f233d]"
          >
            Home
          </NavLink>
          <NavLink
            to="/quiz"
            onClick={handleMenuToggle}
            className="block px-6 py-3 text-white hover:bg-[#1f233d]"
          >
            Quiz
          </NavLink>
          <NavLink
            to="/leaderboard"
            onClick={handleMenuToggle}
            className="block px-6 py-3 text-white hover:bg-[#1f233d]"
          >
            Leaderboard
          </NavLink>
          {isAuthenticated ? (
            <button
              onClick={() => {
                navigate("/profile");
                setMenuOpen(false);
              }}
              className="w-full text-left px-6 py-3 text-white hover:bg-[#1f233d] flex items-center"
            >
              <UserIcon size={20} className="mr-2" /> Profile
            </button>
          ) : (
            <>
              <NavLink
                to="/signin"
                onClick={handleMenuToggle}
                className="block px-6 py-3 text-white hover:bg-[#1f233d]"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                onClick={handleMenuToggle}
                className="block px-6 py-3 text-white hover:bg-[#1f233d]"
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
