// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [questions, setQuestions] = useState({});
  const [userId, setUserId] = useState(null);
  const [pastQuizzes, setPastQuizzes] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // On mount, initialize from localStorage
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
