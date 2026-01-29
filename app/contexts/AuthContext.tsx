"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/* =====================
   1. TYPE / SHAPE
===================== */

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  avatar?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
};

/* =====================
   2. CONTEXT
===================== */

const AuthContext = createContext<AuthContextType | null>(null);

/* =====================
   3. PROVIDER
===================== */

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /* 🔁 Page refresh хийхэд auth-г сэргээх */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  /* 🔐 Login */
  const login = (userData: User, tokenString: string) => {
    localStorage.setItem("token", tokenString);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setToken(tokenString);
    setIsLoggedIn(true);
  };

  /* 🚪 Logout */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =====================
   4. CUSTOM HOOK
===================== */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
