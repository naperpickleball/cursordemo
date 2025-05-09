// src/pages/Standings.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Standings = () => {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { leagueId } = useParams();

  useEffect(() => {
    fetchLeagues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (leagueId) {
      setSelectedLeague(leagueId);
      fetchStandings(leagueId);
    }
  }, [leagueId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchLeagues = async () => {
    try {
      const response = await api.get('/leagues');
      setLeagues(response.data);
      
      if (response.data.length > 0 && !leagueId) {
        setSelectedLeague(response.data[0].leagueId);
        fetchStandings(response.data[0].leagueId);
      }
    } catch (err) {
      setError('Failed to load leagues');
      console.error(err);
    }
  };

  const fetchStandings = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/standings/league/${id}`);
      setStandings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load standings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeagueChange = (e) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    fetchStandings(leagueId);
  };

  const updateRankings = async () => {
    try {
      await api.put(`/standings/updateRankings/${selectedLeague}`);
      fetchStandings(selectedLeague);
    } catch (err) {
      setError('Failed to update rankings');
      console.error(err);
    }
  };

  if (loading && !leagues.length) return <div className="loading">Loading...</div>;

  return (
    <div className="standings-page">
      <div className="header">
        <h1>League Standings</h1>
        <div className="league-selector">
          <label>Select League: </label>
          <select 
            value={selectedLeague || ''} 
            onChange={handleLeagueChange}
          >
            <option value="">-- Select League --</option>
            {leagues.map(league => (
              <option key={league.leagueId} value={league.leagueId}>
                {league.leagueName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {selectedLeague && (
        <div className="standings-container">
          <div className="standings-header">
            <h2>Current Standings</h2>
            <button 
              className="primary-button"
              onClick={updateRankings}
            >
              Refresh Rankings
            </button>
          </div>

          {standings.length === 0 ? (
            <p className="no-data">No standings data available for this league</p>
          ) : (
            <div className="standings-table-container">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Games Played</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing, index) => (
                    <tr key={standing.playerId} className={index < 3 ? 'top-player' : ''}>
                      <td>{standing.ranking}</td>
                      <td>{standing.playerName}</td>
                      <td>{standing.gamesPlayed}</td>
                      <td>{standing.gamesWon}</td>
                      <td>{standing.gamesLost}</td>
                      <td>{standing.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Standings;
