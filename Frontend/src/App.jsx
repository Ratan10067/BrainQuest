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
import ContactUs from "./components/ContactUs";
import Premium from "./components/Premium";
import NotFoundPage from "./components/NotFoundPage";
import ResetPassword from "./components/ResetPassword";
import Feedback from "./components/Feedback";
import Notification from "./components/Notification";
import CodingChallenge from "./components/CodingChallenge";
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
          <Route path="/Contact-us" element={<ContactUs />} />
          <Route path="/premium" element={<Premium />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/coding-challenges" element={<CodingChallenge />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
