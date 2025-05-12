import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const NavBar = () => {
  const { isAuthenticated, currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isAdmin = isAuthenticated && currentUser?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">Pickleball League Manager</Link>
      </div>
      {isAuthenticated ? (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/leagues" className="nav-link">Leagues</Link>
          </li>
          <li className="nav-item">
            <Link to="/players" className="nav-link">Players</Link>
          </li>
          <li className="nav-item">
            <Link to="/matches" className="nav-link">Matches</Link>
          </li>
          <li className="nav-item">
            <Link to="/standings" className="nav-link">Standings</Link>
          </li>
          <li className="nav-item">
            <Link to="/siri-integration" className="nav-link">
              <span className="feature-badge">New</span>Siri Integration
            </Link>
          </li>
          {isAdmin && (
            <li className="nav-item">
              <Link to="/clubs" className="nav-link">
                <span className="feature-badge admin">Admin</span>Club Management
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link to="/" className="nav-link">Search Portal</Link>
          </li>
          <li className="nav-item">
            <Link to="/demo" className="nav-link">
              <span className="feature-badge">Demo</span>AI Features
            </Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
          </li>
        </ul>
      ) : (
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
