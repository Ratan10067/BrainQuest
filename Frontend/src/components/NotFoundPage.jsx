import React, { useState, useEffect } from "react";
import { Home, Search, ArrowLeft, RefreshCw, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [floatingElements, setFloatingElements] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Create floating elements
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setFloatingElements(elements);
  }, []);

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      window.location.reload();
    }, 1000);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Simulate search - in real app, navigate to search results
      alert(`Searching for: ${searchTerm}`);
    }
  };

  const suggestions = [
    "Check the URL for typos",
    "Go back to homepage",
    "Use the search function",
    "Browse our categories",
    "Contact support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute w-2 h-2 bg-gray-800 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-pink-400 opacity-50 animate-ping">
            404
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Oops! Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
            The page you're looking for seems to have vanished into the digital
            void. Don't worry, even the best explorers get lost sometimes!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for something..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 backdrop-blur-md border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-white"
          >
            <Home className="w-5 h-5" />
            Home
          </button>

          <button
            onClick={handleRefresh}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 text-white"
          >
            <RefreshCw
              className={`w-5 h-5 ${isAnimating ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Suggestions */}
        <div className="bg-gray-50 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
            What you can do:
          </h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-2">
            Still can't find what you're looking for?
          </p>
          <button
            // onClick={navigate("/contact-us")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 mx-auto"
          >
            <ExternalLink className="w-4 h-4" />
            Contact Support
          </button>
        </div>

        {/* Fun Easter Egg */}
        <div className="mt-12 text-xs text-gray-400">
          <p>Error Code: VOID_EXPLORER_404 | Lost in Space? 🚀</p>
        </div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none" />
    </div>
  );
}
