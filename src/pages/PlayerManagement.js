// src/pages/PlayerManagement.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PlayerManagement = () => {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [players, setPlayers] = useState([]);
  const [leaguePlayers, setLeaguePlayers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [playerForm, setPlayerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    skillLevel: ''
  });
  const [showAddToLeagueForm, setShowAddToLeagueForm] = useState(false);
  const [addToLeagueForm, setAddToLeagueForm] = useState({
    playerId: '',
    leagueId: '',
    isSubstitute: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchLeagues();
    fetchPlayers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedLeague) {
      fetchLeaguePlayers(selectedLeague);
    }
  }, [selectedLeague]);

  const fetchLeagues = async () => {
    try {
      const response = await api.get('/leagues');
      setLeagues(response.data);
      
      if (response.data.length > 0) {
        setSelectedLeague(response.data[0].leagueId);
        setAddToLeagueForm({
          ...addToLeagueForm,
          leagueId: response.data[0].leagueId
        });
      }
    } catch (err) {
      setError('Failed to load leagues');
      console.error(err);
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (err) {
      setError('Failed to load players');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaguePlayers = async (leagueId) => {
    try {
      const response = await api.get(`/players/league/${leagueId}`);
      setLeaguePlayers(response.data);
    } catch (err) {
      setError('Failed to load league players');
      console.error(err);
    }
  };

  const handleLeagueChange = (e) => {
    const leagueId = e.target.value;
    setSelectedLeague(leagueId);
    setAddToLeagueForm({
      ...addToLeagueForm,
      leagueId
    });
  };

  const handlePlayerFormChange = (e) => {
    const { name, value } = e.target;
    setPlayerForm({
      ...playerForm,
      [name]: value
    });
  };

  const handleAddToLeagueFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddToLeagueForm({
      ...addToLeagueForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/players', playerForm);
      setPlayers([...players, response.data]);
      setPlayerForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        skillLevel: ''
      });
      setShowForm(false);
      setSuccess('Player created successfully');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to create player');
      console.error(err);
    }
  };

  const handleAddToLeague = async (e) => {
    e.preventDefault();
    
    // Check if player is already in league
    const playerInLeague = leaguePlayers.find(p => p.playerId === parseInt(addToLeagueForm.playerId));
    if (playerInLeague) {
      setError('This player is already in the selected league');
      return;
    }
    
    try {
      await api.post('/players/addToLeague', addToLeagueForm);
      fetchLeaguePlayers(selectedLeague);
      setShowAddToLeagueForm(false);
      setAddToLeagueForm({
        ...addToLeagueForm,
        playerId: '',
        isSubstitute: false
      });
      setSuccess('Player added to league successfully');
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to add player to league');
      console.error(err);
    }
  };

  if (loading && !players.length) return <div className="loading">Loading...</div>;

  const availablePlayers = players.filter(player => 
    !leaguePlayers.some(lp => lp.playerId === player.playerId)
  );

  return (
    <div className="player-management">
      <div className="header">
        <h1>Player Management</h1>
        <div className="header-buttons">
          <button 
            className="primary-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add New Player'}
          </button>
          <button 
            className="secondary-button"
            onClick={() => setShowAddToLeagueForm(!showAddToLeagueForm)}
            disabled={availablePlayers.length === 0 || !selectedLeague}
          >
            {showAddToLeagueForm ? 'Cancel' : 'Add Player to League'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Add New Player</h2>
          <form onSubmit={handleCreatePlayer}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={playerForm.firstName}
                  onChange={handlePlayerFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={playerForm.lastName}
                  onChange={handlePlayerFormChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={playerForm.email}
                  onChange={handlePlayerFormChange}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={playerForm.phone}
                  onChange={handlePlayerFormChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Skill Level (1.0-5.0)</label>
              <input
                type="number"
                name="skillLevel"
                value={playerForm.skillLevel}
                onChange={handlePlayerFormChange}
                step="0.1"
                min="1.0"
                max="5.0"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">Add Player</button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddToLeagueForm && (
        <div className="form-container">
          <h2>Add Player to League</h2>
          <form onSubmit={handleAddToLeague}>
            <div className="form-group">
              <label>League</label>
              <select 
                name="leagueId"
                value={addToLeagueForm.leagueId}
                onChange={handleAddToLeagueFormChange}
                required
              >
                <option value="">-- Select League --</option>
                {leagues.map(league => (
                  <option key={league.leagueId} value={league.leagueId}>
                    {league.leagueName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Player</label>
              <select 
                name="playerId"
                value={addToLeagueForm.playerId}
                onChange={handleAddToLeagueFormChange}
                required
              >
                <option value="">-- Select Player --</option>
                {availablePlayers.map(player => (
                  <option key={player.playerId} value={player.playerId}>
                    {player.firstName} {player.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-checkbox">
              <input
                type="checkbox"
                name="isSubstitute"
                checked={addToLeagueForm.isSubstitute}
                onChange={handleAddToLeagueFormChange}
                id="isSubstitute"
              />
              <label htmlFor="isSubstitute">Add as substitute player</label>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">Add to League</button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => setShowAddToLeagueForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="league-player-container">
        <div className="league-selector-container">
          <label>View Players In: </label>
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

        {selectedLeague && (
          <div className="league-players">
            <h2>Players in Selected League</h2>
            {leaguePlayers.length === 0 ? (
              <p className="no-data">No players in this league yet</p>
            ) : (
              <div className="player-list">
                <div className="player-list-header">
                  <div className="player-name">Name</div>
                  <div className="player-contact">Contact</div>
                  <div className="player-skill">Skill Level</div>
                  <div className="player-status">Status</div>
                </div>
                
                {leaguePlayers.map(player => (
                  <div key={player.playerId} className="player-item">
                    <div className="player-name">
                      {player.firstName} {player.lastName}
                    </div>
                    <div className="player-contact">
                      {player.email && <div>{player.email}</div>}
                      {player.phone && <div>{player.phone}</div>}
                    </div>
                    <div className="player-skill">
                      {player.skillLevel ? player.skillLevel : '-'}
                    </div>
                    <div className="player-status">
                      <span className={player.isSubstitute ? 'substitute-badge' : 'regular-badge'}>
                        {player.isSubstitute ? 'Substitute' : 'Regular'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="all-players-container">
        <h2>All Players</h2>
        {players.length === 0 ? (
          <p className="no-data">No players added yet</p>
        ) : (
          <div className="player-list">
            <div className="player-list-header">
              <div className="player-name">Name</div>
              <div className="player-contact">Contact</div>
              <div className="player-skill">Skill Level</div>
            </div>
            
            {players.map(player => (
              <div key={player.playerId} className="player-item">
                <div className="player-name">
                  {player.firstName} {player.lastName}
                </div>
                <div className="player-contact">
                  {player.email && <div>{player.email}</div>}
                  {player.phone && <div>{player.phone}</div>}
                </div>
                <div className="player-skill">
                  {player.skillLevel ? player.skillLevel : '-'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;
