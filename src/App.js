// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Playground from './components/Playground';
import Layout from './components/Layout';

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/playground" /> : 
                <Navigate to="/login" />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/playground" /> : 
                <Login onSwitchToRegister={() => window.location.href = '/register'} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
                <Navigate to="/playground" /> : 
                <Register onSwitchToLogin={() => window.location.href = '/login'} />
            } 
          />
          <Route 
            path="/playground" 
            element={
              isAuthenticated ? 
                <Playground /> : 
                <Navigate to="/login" />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;