import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import UserSignUp from "./components/UserSignUp";
import UserSignIn from "./components/UserSignIn";
import Navbar from "./components/Navbar";
import HomePage from "./components/Home";
import QuizSection from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<UserSignUp />} />
            <Route path="/signin" element={<UserSignIn />} />
            <Route path="/Quiz" element={<QuizSection />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
