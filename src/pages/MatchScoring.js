import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

const MatchScoring = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const { leagueId } = useParams();
  
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/matches/${leagueId}`);
        setMatches(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch matches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (leagueId) {
      fetchMatches();
    }
  }, [leagueId]);
  
  const handleLeagueChange = (e) => {
    const id = e.target.value;
    if (id) {
      navigate(`/matches/${id}`);
    }
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div className="match-scoring">
      <h1>Match Scoring</h1>
      <div className="league-selector">
        <select onChange={handleLeagueChange} value={leagueId || ''}>
          <option value="">Select a League</option>
          {/* Add your league options here */}
        </select>
      </div>
      <div className="matches-list">
        {matches.map(match => (
          <div key={match.id} className="match-card">
            <h3>Match #{match.id}</h3>
            <p>Status: {match.status}</p>
            {/* Add more match details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchScoring;
