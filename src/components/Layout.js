// src/components/Layout.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {user && (
        <header className="app-header">
          <h1>Welcome, {user.username}</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
      )}
      <main className="app-content">{children}</main>
    </div>
  );
};

export default Layout;