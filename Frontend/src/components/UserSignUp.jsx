import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

export default function UserSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/users/user-register",
        formData
      );
      if (response.status === 201) {
        setModal({
          open: true,
          success: true,
          message:
            "Your account has been created! You will be redirected to the quiz section shortly.",
        });
        console.log("User registered successfully:", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        setTimeout(() => navigate("/quiz"), 2000);
      } else {
        setModal({
          open: true,
          success: false,
          message: "Unexpected response. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        "Signup failed. Please check your details and try again.";
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
        {/* 3D Illustration */}
        <div
          className="w-1/2 hidden md:flex items-center justify-center p-6"
          style={{ perspective: "1000px" }}
        >
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/young-man-doing-online-registration-and-sign-up-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--signup-create-account-form-pack-crime-security-illustrations-10209162.png"
            alt="3D Illustration"
            className="w-3/4 transition-transform duration-500 hover:rotate-y-12 hover:-rotate-x-6"
            style={{ transformStyle: "preserve-3d" }}
          />
        </div>
        {/* Form Panel */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Sign Up to BrainQuest
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div>
            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div>
            {/* Password */}
            <div className="mb-8">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div>
            {/* Location */}
            {/* <div className="mb-6">
              <label htmlFor="location" className="block text-gray-700 mb-2">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div> */}
            {/* Phone */}
            {/* <div className="mb-6">
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c3250]"
              />
            </div> */}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 cursor-pointer ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#2c3250]"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          <div className="mt-4 text-center text-gray-600">
            Already have an account??{" "}
            <NavLink to="/signin" className="text-indigo-600 hover:underline">
              Sign In
            </NavLink>
          </div>
        </div>
      </div>

      {/* Styled Modal */}
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-80 p-6 text-center animate-fade-in">
            <div className="text-6xl mb-4">{modal.success ? "😊" : "😢"}</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">
              {modal.success ? "Success!" : "Oops!"}
            </h3>
            <p className="text-gray-600 mb-6">{modal.message}</p>
            {!modal.success && (
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-[#2c3250] text-white rounded-full hover:bg-opacity-90 transition"
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
