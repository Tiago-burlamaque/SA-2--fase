// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 1. No mount, puxa do localStorage pra manter login após refresh
  useEffect(() => {
    const stored = localStorage.getItem('cliente');
    if (stored) setUser(JSON.parse(stored));
  }, []);

const login = (cliente) => {
  setUser(cliente);
  localStorage.setItem('cliente', JSON.stringify(cliente));
};

const logout = () => {
  setUser(null);
  localStorage.removeItem('cliente');
};

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
