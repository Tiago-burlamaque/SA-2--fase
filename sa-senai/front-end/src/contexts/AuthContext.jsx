// src/contexts/AuthContext.jsx
import React, { createContext, useState, useCallback } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve(),
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  // inicializa a partir do que estiver no localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cliente");
    return stored ? JSON.parse(stored) : null;
  });

  // login: seta estado E grava no storage
  const login = useCallback((cliente) => {
    setUser(cliente);
    localStorage.setItem("cliente", JSON.stringify(cliente));
  }, []);

  // logout: limpa estado E apaga do storage
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("cliente");
  }, []);

  // updateUser: mescla novos campos e atualiza o storage
  const updateUser = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem("cliente", JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
