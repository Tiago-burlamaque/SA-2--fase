// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve(),
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Carrega do storage ao montar
  useEffect(() => {
    const stored = localStorage.getItem("cliente");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Sempre que o user mudar, atualiza o storage
  useEffect(() => {
    if (user) {
      localStorage.setItem("cliente", JSON.stringify(user));
    } else {
      localStorage.removeItem("cliente");
    }
  }, [user]);

  // login: salva o objeto completo vindo do backend
  const login = useCallback((cliente) => {
    setUser(cliente);
  }, []);

  // logout: limpa tudo
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
