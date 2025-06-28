// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                // ⬅️ limpa contexto + storage
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Landing</Link></li>

        {!user ? (
          <>
            <li><Link to="/cadastro">Cadastrar</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/home">Home</Link></li>
            <li>
              <Link onClick={handleLogout} className="navbar-logout">
                Logout
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
