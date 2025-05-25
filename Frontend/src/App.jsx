import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/UserContext";

import Navbar from "./components/Navbar";
import HomePage from "./components/Home";
import UserSignUp from "./components/UserSignUp";
import UserSignIn from "./components/UserSignIn";
import QuizSection from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import UserProfile from "./components/UserProfile";
import QuizStarted from "./components/QuizStarted";
import Result from "./components/Result";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {" "}
        {/* ← Wrap here */}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/signin" element={<UserSignIn />} />
          <Route path="/quiz" element={<QuizSection />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/quiz-started/:quizId" element={<QuizStarted />} />
          <Route path="/results/:quizId" element={<Result />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
