import React, { useState } from 'react';
import './DemoPortal.css';

const DemoPortal = () => {
  const [activeView, setActiveView] = useState('director');
  const [weatherAlert, setWeatherAlert] = useState(true);
  const [attendanceAlert, setAttendanceAlert] = useState(true);
  const [courtAvailability, setCourtAvailability] = useState(true);

  const renderDirectorView = () => (
    <div className="demo-section">
      <h2>League Director Dashboard</h2>
      <div className="context-alerts">
        {weatherAlert && (
          <div className="alert weather-alert">
            <h3>🌤️ Weather Alert</h3>
            <p>Heavy rain expected in 30 minutes. AI suggests:</p>
            <ul>
              <li>Move matches to indoor courts 3-6</li>
              <li>Reschedule remaining matches to tomorrow</li>
              <li>Notify affected players automatically</li>
            </ul>
            <button onClick={() => setWeatherAlert(false)}>Dismiss</button>
          </div>
        )}
        
        {attendanceAlert && (
          <div className="alert attendance-alert">
            <h3>👥 Attendance Update</h3>
            <p>3 players have reported they can't make it. AI suggests:</p>
            <ul>
              <li>Available substitutes: John D., Sarah M., Mike R.</li>
              <li>Optimal team rebalancing options</li>
              <li>Schedule adjustments to minimize impact</li>
            </ul>
            <button onClick={() => setAttendanceAlert(false)}>Dismiss</button>
          </div>
        )}
      </div>

      <div className="ai-insights">
        <h3>AI-Powered Insights</h3>
        <div className="insight-card">
          <h4>Match Optimization</h4>
          <p>Based on player ratings and availability, here's the optimal schedule:</p>
          <ul>
            <li>Court 1: Team A vs Team B (Predicted: Close match)</li>
            <li>Court 2: Team C vs Team D (Predicted: Team C favored)</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderPlayerView = () => (
    <div className="demo-section">
      <h2>Player Experience</h2>
      <div className="player-features">
        <div className="feature-card">
          <h3>Smart Notifications</h3>
          <p>Get personalized updates about:</p>
          <ul>
            <li>Match schedule changes</li>
            <li>Partner availability</li>
            <li>Weather conditions</li>
            <li>Court assignments</li>
          </ul>
        </div>

        <div className="feature-card">
          <h3>Performance Analytics</h3>
          <p>AI-powered insights about your game:</p>
          <ul>
            <li>Win probability for upcoming matches</li>
            <li>Partner compatibility analysis</li>
            <li>Skill improvement suggestions</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderFacilityView = () => (
    <div className="demo-section">
      <h2>Facility Coordinator Dashboard</h2>
      <div className="facility-features">
        {courtAvailability && (
          <div className="alert court-alert">
            <h3>🏸 Court Management</h3>
            <p>Real-time court status and services:</p>
            <ul>
              <li>Court 1: Available for booking</li>
              <li>Court 2: Match in progress</li>
              <li>Court 3: Maintenance required</li>
            </ul>
            <button onClick={() => setCourtAvailability(false)}>Dismiss</button>
          </div>
        )}

        <div className="service-options">
          <h3>On-Demand Services</h3>
          <div className="service-card">
            <h4>Video Recording</h4>
            <p>Professional match recording with AI analysis</p>
            <button>Book Now</button>
          </div>
          <div className="service-card">
            <h4>Live Streaming</h4>
            <p>Stream matches to social media</p>
            <button>Start Stream</button>
          </div>
          <div className="service-card">
            <h4>Performance Analysis</h4>
            <p>AI-powered game statistics</p>
            <button>View Analysis</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="demo-portal">
      <div className="view-selector">
        <button 
          className={activeView === 'director' ? 'active' : ''} 
          onClick={() => setActiveView('director')}
        >
          League Director View
        </button>
        <button 
          className={activeView === 'player' ? 'active' : ''} 
          onClick={() => setActiveView('player')}
        >
          Player View
        </button>
        <button 
          className={activeView === 'facility' ? 'active' : ''} 
          onClick={() => setActiveView('facility')}
        >
          Facility Coordinator View
        </button>
      </div>

      <div className="demo-content">
        {activeView === 'director' && renderDirectorView()}
        {activeView === 'player' && renderPlayerView()}
        {activeView === 'facility' && renderFacilityView()}
      </div>
    </div>
  );
};

export default DemoPortal; 