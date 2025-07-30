// src/context/authContext.jsx

import React, { createContext } from "react";

export const authDataContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:8000";

  return (
    <authDataContext.Provider value={{ serverUrl }}>
      {children}
    </authDataContext.Provider>
  );
};
