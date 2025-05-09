import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeagueManagement from './pages/LeagueManagement';
import PlayerManagement from './pages/PlayerManagement';
import MatchScoring from './pages/MatchScoring';
import Standings from './pages/Standings';
import ClubManagement from './pages/ClubManagement';
import SiriIntegration from './pages/SiriIntegration';
import SearchPortal from './pages/SearchPortal';

// Create the AuthContext directly in this file
export const AuthContext = createContext();

// ProtectedRoute component defined inline
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <>
      <NavBar />
      <main className="main-content">
        {children}
      </main>
    </>
  );
}

// Authentication Provider Component
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (user && token) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'admin@pickleball.com' && password === 'admin123') {
      const user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@pickleball.com',
        role: 'admin'
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-jwt-token');
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Main App component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<SearchPortal />} />
            <Route path="/search" element={<SearchPortal />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leagues/:leagueId?"
              element={
                <ProtectedRoute>
                  <LeagueManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/players"
              element={
                <ProtectedRoute>
                  <PlayerManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/matches/:leagueId?"
              element={
                <ProtectedRoute>
                  <MatchScoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/standings"
              element={
                <ProtectedRoute>
                  <Standings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clubs"
              element={
                <ProtectedRoute>
                  <ClubManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/siri-integration"
              element={
                <ProtectedRoute>
                  <SiriIntegration />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
