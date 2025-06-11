// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [questions, setQuestions] = useState({});
  const [userId, setUserId] = useState(null);
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        setIsAuthenticated,
        questions,
        setQuestions,
        userId,
        setUserId,
        pastQuizzes,
        setPastQuizzes,
        sessionExpired,
        setSessionExpired,
        serverError,
        setServerError,
        darkMode,
        setDarkMode,
        timerEnabled,
        setTimerEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
