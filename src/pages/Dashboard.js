// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [leagues, setLeagues] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch active leagues
      const leaguesResponse = await api.get('/leagues');
      setLeagues(leaguesResponse.data);
      
      if (leaguesResponse.data.length > 0) {
        const activeLeagueId = leaguesResponse.data[0].leagueId;
        
        // Fetch recent matches
        const matchesResponse = await api.get(`/matches/league/${activeLeagueId}`);
        setRecentMatches(matchesResponse.data?.slice(0, 5) || []); // Get latest 5
        
        // Fetch top players
        const standingsResponse = await api.get(`/standings/league/${activeLeagueId}`);
        setTopPlayers(standingsResponse.data?.slice(0, 5) || []); // Get top 5
        
        // Calculate upcoming matches based on league schedule
        const activeLeague = leaguesResponse.data[0];
        const upcomingDates = getUpcomingPlayingDays(activeLeague.playingDay, 3);
        
        setUpcomingMatches(upcomingDates.map(date => ({
          date,
          leagueId: activeLeagueId,
          leagueName: activeLeague.leagueName
        })));
      }
      
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get upcoming playing days
  const getUpcomingPlayingDays = (dayName, count) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const dayIndex = days.indexOf(dayName);
    
    if (dayIndex === -1) return [];
    
    const currentDayIndex = today.getDay();
    let daysToAdd = dayIndex - currentDayIndex;
    
    if (daysToAdd <= 0) {
      daysToAdd += 7;
    }
    
    const result = [];
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + daysToAdd);
    
    for (let i = 0; i < count; i++) {
      result.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return result;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Pickleball League Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card active-leagues">
          <h2>Active Leagues</h2>
          {leagues.length === 0 ? (
            <p className="no-data">No active leagues</p>
          ) : (
            <div className="leagues-list">
              {leagues.map(league => (
                <div key={league.leagueId} className="dashboard-list-item">
                  <h3>{league.leagueName}</h3>
                  <p>
                    {new Date(league.startDate).toLocaleDateString()} - {new Date(league.endDate).toLocaleDateString()}
                  </p>
                  <p><strong>Plays on:</strong> {league.playingDay}s</p>
                  <Link to={`/leagues/${league.leagueId}`} className="view-link">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="card-footer">
            <Link to="/leagues" className="view-all-link">
              Manage Leagues
            </Link>
          </div>
        </div>

        <div className="dashboard-card recent-matches">
          <h2>Recent Matches</h2>
          {recentMatches.length === 0 ? (
            <p className="no-data">No recent matches</p>
          ) : (
            <div className="matches-list">
              {recentMatches.map(match => (
                <div key={match.matchId} className="dashboard-list-item">
                  <p className="match-date">{new Date(match.matchDate).toLocaleDateString()}</p>
                  <Link to={`/matches/${match.leagueId}`} className="view-link">
                    View Results
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="card-footer">
            <Link to="/matches" className="view-all-link">
              Score Entry
            </Link>
          </div>
        </div>

        <div className="dashboard-card top-players">
          <h2>Top Players</h2>
          {topPlayers.length === 0 ? (
            <p className="no-data">No player rankings available</p>
          ) : (
            <div className="players-list">
              {topPlayers.map((player, index) => (
                <div key={player.playerId} className="dashboard-list-item">
                  <div className="player-rank">#{index + 1}</div>
                  <div className="player-info">
                    <h3>{player.playerName}</h3>
                    <p>
                      <span className="player-stat">Games: {player.gamesPlayed}</span>
                      <span className="player-stat">Wins: {player.gamesWon}</span>
                      <span className="player-stat">Points: {player.totalPoints}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="card-footer">
            <Link to="/standings" className="view-all-link">
              View All Rankings
            </Link>
          </div>
        </div>

        <div className="dashboard-card upcoming-matches">
          <h2>Upcoming Play Days</h2>
          {upcomingMatches.length === 0 ? (
            <p className="no-data">No upcoming play days scheduled</p>
          ) : (
            <div className="upcoming-list">
              {upcomingMatches.map((match, index) => (
                <div key={index} className="dashboard-list-item">
                  <div className="upcoming-date">
                    {match.date.toLocaleDateString()}
                  </div>
                  <div className="upcoming-info">
                    <h3>{match.leagueName}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="card-footer">
            <Link to="/matches" className="view-all-link">
              Manage Matches
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
