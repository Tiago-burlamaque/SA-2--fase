// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve(),
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  // já inicializa o estado lendo do localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cliente");
    return stored ? JSON.parse(stored) : null;
  });
    
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("cliente", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("cliente");
  //   }
  // }, [user]);

  // login: salva o objeto completo vindo do backend
  const login = useCallback((cliente) => {
    setUser(cliente);
  }, []);

  // logout: limpa tudos
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  // updateUser: mescla novos campos no user atual
  const updateUser = useCallback((patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
