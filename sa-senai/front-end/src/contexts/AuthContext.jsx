// src/contexts/AuthContext.jsx
import React, { createContext, useState, useCallback } from "react";

export const AuthContext = createContext({
  user: null,
  login: () => Promise.resolve(),
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }) {
  // 1️⃣ Inicializa o user a partir do storage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cliente");
    return stored ? JSON.parse(stored) : null;
  });

  // 2️⃣ Faz login: guarda o objeto inteiro e persiste
  const login = useCallback((cliente) => {
    setUser(cliente);
    localStorage.setItem("cliente", JSON.stringify(cliente));
  }, []);

  // 3️⃣ Faz logout: limpa estado e storage
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("cliente");
  }, []);

  // 4️⃣ Atualiza (merge ou substitui) e sincroniza com storage
const updateUser = useCallback(patchOrFull => {
  setUser(prev => {
    const updated = { ...(prev||{}), ...patchOrFull };
    localStorage.setItem("cliente", JSON.stringify(updated));
    return updated;
  });
}, []);


  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
