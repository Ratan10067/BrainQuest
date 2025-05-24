// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [questions, setQuestions] = useState({});

  // On mount, initialize from localStorage
  useEffect(() => {
    const t = localStorage.getItem("authToken");
    if (t) setToken(t);
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
        isAuthenticated: !!token,
        questions,
        setQuestions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
