// src/pages/SearchPortal.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './SearchPortal.css';

const SearchPortal = () => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const clubParam = searchParams.get('club');
  const [selectedClub, setSelectedClub] = useState(clubParam || 'naperville-picklers');
  const searchInputRef = useRef(null);
  
  // Mock club data - would come from API in a real implementation
  const clubs = [
    { id: 'naperville-picklers', name: 'Naperville Picklers', color: '#3498db' },
    { id: 'chicago-dinks', name: 'Chicago Dinks', color: '#e74c3c' },
    { id: 'aurora-aces', name: 'Aurora Aces', color: '#2ecc71' }
  ];
  
  // Get selected club data
  const clubData = clubs.find(club => club.id === selectedClub);
  
  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Apply club theme color
    if (clubData) {
      document.documentElement.style.setProperty('--club-color', clubData.color);
    }
    
    return () => {
      // Reset variable when component unmounts
      document.documentElement.style.setProperty('--club-color', '#3498db');
    };
  }, [clubData]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Process natural language query
      const processedQuery = query.toLowerCase();
      
      // Mock responses based on query patterns
      let result;
      
      if (processedQuery.includes('next game') || processedQuery.includes('next match')) {
        result = {
          type: 'nextGame',
          data: {
            date: 'Wednesday, May 8, 2025',
            time: '7:00 PM',
            location: 'Naperville Pickleball Club - Court 3',
            opponent: 'Team Beta',
            league: 'Spring 2025 League'
          }
        };
      } else if (processedQuery.includes('last score') || processedQuery.includes('previous game')) {
        result = {
          type: 'gameResult',
          data: {
            date: 'Wednesday, May 1, 2025',
            yourTeam: 'Team Alpha',
            opponent: 'Team Gamma',
            scores: ['11-9', '7-11', '11-6'],
            result: 'Win'
          }
        };
      } else if (processedQuery.includes('playing with') || processedQuery.includes('partner')) {
        result = {
          type: 'partner',
          data: {
            partner: 'Jane Doe',
            date: 'Wednesday, May 8, 2025',
            time: '7:00 PM'
          }
        };
      } else if (processedQuery.includes('standings') || processedQuery.includes('ranking')) {
        result = {
          type: 'standings',
          data: {
            league: 'Spring 2025 League',
            yourRank: 3,
            totalPlayers: 12,
            gamesPlayed: 8,
            gamesWon: 6,
            topPlayer: 'Emily Davis'
          }
        };
      } else {
        result = {
          type: 'unknown',
          suggestion: 'Try asking about your next game, last score, playing partner, or league standings.'
        };
      }
      
      setSearchResults(result);
      setLoading(false);
    }, 1200); // Simulate network delay
  };
  
  const startListening = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        // Auto-submit after voice input
        setTimeout(() => {
          setIsListening(false);
          handleSearch({ preventDefault: () => {} });
        }, 500);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };
  
  const handleClubChange = (e) => {
    const newClub = e.target.value;
    setSelectedClub(newClub);
    setSearchParams({ club: newClub });
    setSearchResults(null);
  };
  
  const renderSearchResults = () => {
    if (!searchResults) return null;
    
    switch (searchResults.type) {
      case 'nextGame':
        return (
          <div className="search-result next-game">
            <h2>Your Next Game</h2>
            <div className="result-card">
              <div className="result-date">{searchResults.data.date}</div>
              <div className="result-detail">{searchResults.data.time} at {searchResults.data.location}</div>
              <div className="result-detail">Opponent: {searchResults.data.opponent}</div>
              <div className="result-detail">League: {searchResults.data.league}</div>
              <Link to="/matches" className="view-details">View Match Details</Link>
            </div>
          </div>
        );
        
      case 'gameResult':
        return (
          <div className="search-result game-result">
            <h2>Your Last Match Result</h2>
            <div className="result-card">
              <div className="result-date">{searchResults.data.date}</div>
              <div className="result-teams">
                {searchResults.data.yourTeam} vs {searchResults.data.opponent}
              </div>
              <div className="result-scores">
                {searchResults.data.scores.map((score, index) => (
                  <span key={index} className="score">{score}</span>
                ))}
              </div>
              <div className={`result-outcome ${searchResults.data.result.toLowerCase()}`}>
                {searchResults.data.result}
              </div>
              <Link to="/matches" className="view-details">View All Matches</Link>
            </div>
          </div>
        );
        
      case 'partner':
        return (
          <div className="search-result partner-info">
            <h2>Your Playing Partner</h2>
            <div className="result-card">
              <div className="partner-name">{searchResults.data.partner}</div>
              <div className="result-detail">
                {searchResults.data.date} at {searchResults.data.time}
              </div>
              <Link to="/players" className="view-details">View Player Profile</Link>
            </div>
          </div>
        );
        
      case 'standings':
        return (
          <div className="search-result standings-info">
            <h2>League Standings</h2>
            <div className="result-card">
              <div className="league-name">{searchResults.data.league}</div>
              <div className="ranking-info">
                Your Rank: <span className="rank">{searchResults.data.yourRank}</span> of {searchResults.data.totalPlayers}
              </div>
              <div className="result-detail">
                Games: {searchResults.data.gamesWon} wins, {searchResults.data.gamesPlayed - searchResults.data.gamesWon} losses
              </div>
              <div className="result-detail">
                Top Player: {searchResults.data.topPlayer}
              </div>
              <Link to="/standings" className="view-details">View Full Standings</Link>
            </div>
          </div>
        );
        
      case 'unknown':
        return (
          <div className="search-result unknown-query">
            <div className="result-card">
              <div className="no-results">
                <p>I couldn't find specific information for that query.</p>
                <p className="suggestion">{searchResults.suggestion}</p>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`search-portal ${selectedClub}`}>
      <div className="top-bar">
        <Link to="/login" className="login-link">Login</Link>
        <div className="club-selector">
          <select value={selectedClub} onChange={handleClubChange}>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="search-container">
        <h1 className="portal-title">
          <span className="portal-primary">{clubData?.name || 'Pickleball'}</span>
          <span className="portal-secondary">Portal</span>
        </h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              ref={searchInputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about your games, scores, or standings..."
              className="search-input"
            />
            <button 
              type="button" 
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={startListening}
            >
              🎤
            </button>
            <button type="submit" className="search-button">Search</button>
          </div>
        </form>
        
        <div className="search-examples">
          <p>Try asking: "When is my next game?" • "What was my last score?" • "Who am I playing with next week?"</p>
        </div>
      </div>
      
      <div className="results-container">
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Processing your query...</p>
          </div>
        ) : (
          renderSearchResults()
        )}
      </div>
    </div>
  );
};

export default SearchPortal;
