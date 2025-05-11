import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#2c3250]  shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white flex items-center">
          <span className="bg-amber-300 text-black w-6 h-7 text-center rounded-1">
            B
          </span>
          <span>rainQuest</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-9">
          <NavLink to="/" className="text-white hover:text-gray-400">
            Home
          </NavLink>
          <NavLink to="/quiz" className="text-white hover:text-gray-400">
            Quiz
          </NavLink>
          <NavLink to="/leaderboard" className="text-white hover:text-gray-400">
            Leaderboard
          </NavLink>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex space-x-2">
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
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#2c3250]">
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-white hover:bg-[#1f233d]"
          >
            Home
          </NavLink>
          <NavLink
            to="/quiz"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-white hover:bg-[#1f233d]"
          >
            Quiz
          </NavLink>
          <NavLink
            to="/leaderboard"
            onClick={() => setOpen(false)}
            className="block px-6 py-3 text-white hover:bg-[#1f233d]"
          >
            Leaderboard
          </NavLink>
          <div className="border-t border-[#3a3f60]">
            <NavLink
              to="/signin"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-white hover:bg-[#1f233d]"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/signup"
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-white hover:bg-[#1f233d]"
            >
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}
