import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

export default function UserSignIn() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/user-login",
        credentials
      );
      if (response.status === 200) {
        console.log("User logged in successfully:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        setModal({
          open: true,
          success: true,
          message: "Login successful! Redirecting to quiz section.",
        });
        setTimeout(() => navigate("/quiz"), 2000);
      } else {
        setModal({
          open: true,
          success: false,
          message: "Unexpected response. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setModal({ open: true, success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () =>
    setModal({ open: false, success: false, message: "" });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2c3250] p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex">
        {/* 3D Illustration Panel */}
        <div
          className="w-1/2 hidden lg:flex items-center justify-center p-6"
          style={{ perspective: "1000px" }}
        >
          <img
            src="https://cdn3d.iconscout.com/3d/free/preview/free-login-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--password-security-lock-empty-state-pack-seo-web-illustrations-2969410.png?f=webp&h=700"
            alt="3D Sign In Illustration"
            className="w-3/4 transition-transform duration-500 hover:rotate-y-12 hover:-rotate-x-6"
            style={{ transformStyle: "preserve-3d" }}
          />
        </div>

        {/* Form Panel */}
        <div className="w-full lg:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Welcome Back to BrainQuest
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={credentials.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white cursor-pointer font-semibold transition-transform transform hover:scale-105 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2c3250]"
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </NavLink>
          </p>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-80 p-6 text-center animate-fade-in">
            <div className="text-6xl mb-4">{modal.success ? "😊" : "😢"}</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {modal.success ? "Welcome!" : "Login Failed"}
            </h3>
            <p className="text-gray-600 mb-6">{modal.message}</p>
            {!modal.success && (
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-[#2c3250] text-white rounded-full hover:bg-opacity-90 transition cursor-pointer"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {/* CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
