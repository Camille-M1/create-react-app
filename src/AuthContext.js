import React, { createContext, useContext } from "react";
import { ROLES } from "./Roles";   // ✅ ADD THIS

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const user = {
    id: 1,
    name: "Yasmin",
    role: ROLES.TEAM_MEMBER, // ADMIN | TEAM_MEMBER | SYSTEM
  };

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
