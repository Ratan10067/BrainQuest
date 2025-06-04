import React, { createContext, useState, useEffect, useContext } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isExpired, setIsExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check JWT expiry
  const checkToken = () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const isTokenExpired = Date.now() >= exp * 1000;
      setIsExpired(isTokenExpired);
      if (isTokenExpired) setShowModal(true);
    } catch (error) {
      console.error("Token check failed:", error);
    }
  };

  // Check token every minute
  useEffect(() => {
    checkToken(); // Immediate check
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SessionContext.Provider value={{ isExpired, showModal, setShowModal }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
