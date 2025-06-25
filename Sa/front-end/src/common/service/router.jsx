// src/router/index.jsx
import React, { useContext } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "../../App";
import Landing from "../../pages/Landing/Landing";
import PaginaInicial from "../../pages/PaginaInicial/PaginaInicial";
import CadastroCliente from "../../pages/CadastroCliente/CadastroCliente";
import LoginCliente from "../../pages/LoginCliente/LoginCliente";


import { AuthProvider, AuthContext } from "../../contexts/AuthContext";

// 1) Componente que protege rotas privadas
function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    // se não estiver logado, manda pro login
    return <Navigate to="/login" replace />;
  }
  return children;
}

const router = createBrowserRouter([
  {
    // 2) Envolvemos TODO O APP no AuthProvider
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      // rotas públicas:
      { path: "/", element: <Landing /> },
      { path: "cadastro", element: <CadastroCliente /> },
      { path: "login", element: <LoginCliente /> },

      // rotas protegidas:
      {
        path: "home",
        element: (
          <RequireAuth>
            <PaginaInicial />
          </RequireAuth>
        ),
      },

      // rota coringa:
      { path: "*", element: <div>404 – Página não encontrada</div> },
    ],
  },
]);

export default router;
