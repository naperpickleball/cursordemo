import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

const LeagueManagement = () => {
  const [leagues, setLeagues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leagueName: '',
    startDate: '',
    endDate: '',
    playingDay: '',
    startTime: '',
    endTime: '',
    location: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const navigate = useNavigate();
  const { leagueId } = useParams();

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      const response = await API.get('/leagues');
      setLeagues(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load leagues');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const viewLeagueDetails = (leagueId) => {
    navigate(`/leagues/${leagueId}`);
  };

  return (
    <div className="league-management">
      <div className="header">
        <h1>League Management</h1>
        <button 
          className="primary-button" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create New League'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Create New League</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await API.post('/leagues', formData);
              setFormData({
                leagueName: '',
                startDate: '',
                endDate: '',
                playingDay: '',
                startTime: '',
                endTime: '',
                location: '',
                description: ''
              });
              setShowForm(false);
              setSuccess('League created successfully');
              fetchLeagues();
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            } catch (err) {
              setError('Failed to create league');
              console.error(err);
            }
          }}>
            {/* Form fields - same as before */}
            <div className="form-group">
              <label>League Name</label>
              <input 
                type="text" 
                name="leagueName" 
                value={formData.leagueName} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            {/* Add other form fields here */}

            <div className="form-actions">
              <button type="submit" className="primary-button">Create League</button>
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

      <div className="leagues-list">
        <h2>Active Leagues</h2>
        
        {loading && !leagues.length ? (
          <div className="loading">Loading leagues...</div>
        ) : leagues.length === 0 ? (
          <p className="no-data">No active leagues found</p>
        ) : (
          <div className="league-cards">
            {leagues.map((league) => (
              <div key={league.leagueId} className="league-card">
                <h3>{league.leagueName}</h3>
                <div className="league-details">
                  <p><strong>Duration:</strong> {new Date(league.startDate).toLocaleDateString()} - {new Date(league.endDate).toLocaleDateString()}</p>
                  <p><strong>Playing Day:</strong> {league.playingDay}</p>
                  <p><strong>Time:</strong> {league.startTime} - {league.endTime}</p>
                  {league.location && <p><strong>Location:</strong> {league.location}</p>}
                </div>
                <button 
                  className="view-button"
                  onClick={() => viewLeagueDetails(league.leagueId)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueManagement;
