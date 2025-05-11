import React, { useState } from "react";

export default function UserSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate signup API logic
    console.log("Signing up:", formData);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#2c3250" }}
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex">
        {/* 3D Image Panel */}
        <div
          className="w-1/2 hidden md:block"
          style={{ perspective: "1000px" }}
        >
          <div className="h-full flex items-center justify-center">
            <img
              src="/3d-model.png"
              alt="3D Illustration"
              className="w-3/4 transition-transform duration-500 hover:rotate-y-12 hover:-rotate-x-6"
              style={{ transformStyle: "preserve-3d" }}
            />
          </div>
        </div>

        {/* Form Panel */}
        <div
          className="w-full md:w-1/2 p-10"
          style={{ backgroundColor: "#fff" }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Sign Up to BrainQuest
          </h2>
          <form onSubmit={handleSubmit}>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold transition-transform transform hover:scale-105 cursor-pointer"
              style={{ backgroundColor: "#2c3250" }}
            >
              Create Account
            </button>
          </form>
        </div>
      </div>

      {/* Scoped Styles for 3D Effects */}
      <style jsx>{`
        img:hover {
          transform: rotateY(15deg) rotateX(-7deg);
        }
      `}</style>
    </div>
  );
}
