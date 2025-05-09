import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ClubManagement = () => {
  const [clubs, setClubs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    clubName: '',
    subdomain: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    primaryColor: '#3498db',
    logoUrl: '',
    description: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      const mockClubs = [
        {
          clubId: 1,
          clubName: "Naperville Picklers",
          subdomain: "naperville-picklers",
          location: "Naperville, IL",
          contactEmail: "admin@naperville-picklers.com",
          contactPhone: "555-123-4567",
          primaryColor: "#3498db",
          logoUrl: "https://placekitten.com/100/100",
          description: "Premier pickleball club serving the Naperville area since 2020.",
          memberCount: 85,
          leagueCount: 3,
          status: "active"
        },
        {
          clubId: 2,
          clubName: "Chicago Dinks",
          subdomain: "chicago-dinks",
          location: "Chicago, IL",
          contactEmail: "info@chicagodinks.com",
          contactPhone: "555-987-6543",
          primaryColor: "#e74c3c",
          logoUrl: "https://placekitten.com/101/101",
          description: "Urban pickleball club in the heart of Chicago.",
          memberCount: 120,
          leagueCount: 5,
          status: "active"
        }
      ];
      
      setClubs(mockClubs);
      setError(null);
    } catch (err) {
      setError('Failed to load clubs');
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

  const openPortal = (club) => {
    navigate(`/search?club=${club.subdomain}`);
  };

  const handleManageClub = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

  return (
    <div className="club-management">
      <div className="header">
        <h1>Club Management</h1>
        <button 
          className="primary-button" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Club'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Add New Club</h2>
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              // Create new club logic
              let newClub = {
                ...formData,
                clubId: clubs.length + 1,
                memberCount: 0,
                leagueCount: 0,
                status: 'active'
              };
              
              setClubs([...clubs, newClub]);
              setFormData({
                clubName: '',
                subdomain: '',
                location: '',
                contactEmail: '',
                contactPhone: '',
                primaryColor: '#3498db',
                logoUrl: '',
                description: ''
              });
              setShowForm(false);
              setSuccess('Club created successfully');
              setTimeout(() => {
                setSuccess(null);
              }, 3000);
            } catch (err) {
              setError('Failed to create club');
              console.error(err);
            }
          }}>
            <div className="form-row">
              <div className="form-group">
                <label>Club Name</label>
                <input 
                  type="text" 
                  name="clubName" 
                  value={formData.clubName} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Subdomain</label>
                <div className="subdomain-input-group">
                  <input 
                    type="text" 
                    name="subdomain" 
                    value={formData.subdomain} 
                    onChange={handleInputChange} 
                    placeholder="Generated from name if empty" 
                  />
                  <span className="subdomain-suffix">.pickleballportal.com</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Primary Color</label>
                <div className="color-input-group">
                  <input 
                    type="color" 
                    name="primaryColor" 
                    value={formData.primaryColor} 
                    onChange={handleInputChange} 
                    className="color-picker" 
                  />
                  <input 
                    type="text" 
                    name="primaryColor" 
                    value={formData.primaryColor} 
                    onChange={handleInputChange} 
                    className="color-text" 
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contact Email</label>
                <input 
                  type="email" 
                  name="contactEmail" 
                  value={formData.contactEmail} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Contact Phone</label>
                <input 
                  type="tel" 
                  name="contactPhone" 
                  value={formData.contactPhone} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Logo URL</label>
              <input 
                type="text" 
                name="logoUrl" 
                value={formData.logoUrl} 
                onChange={handleInputChange} 
                placeholder="https://example.com/logo.png" 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows="3" 
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">Create Club</button>
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

      <div className="clubs-grid">
        {clubs.map((club) => (
          <div 
            key={club.clubId} 
            className="club-card" 
            style={{ borderTop: `4px solid ${club.primaryColor}` }}
          >
            <div className="club-card-header">
              {club.logoUrl && (
                <div className="club-logo">
                  <img src={club.logoUrl} alt={`${club.clubName} logo`} />
                </div>
              )}
              <div className="club-info">
                <h3>{club.clubName}</h3>
                <p className="club-location">{club.location}</p>
              </div>
            </div>
            
            <div className="club-card-stats">
              <div className="stat">
                <span className="stat-value">{club.memberCount}</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="stat">
                <span className="stat-value">{club.leagueCount}</span>
                <span className="stat-label">Leagues</span>
              </div>
              <div className="stat">
                <span className="stat-value">{club.status}</span>
                <span className="stat-label">Status</span>
              </div>
            </div>
            
            <div className="club-description">{club.description}</div>
            
            <div className="club-card-actions">
              <button 
                onClick={() => handleManageClub(club)} 
                className="secondary-button"
              >
                Manage
              </button>
              <button 
                onClick={() => openPortal(club)} 
                className="primary-button" 
                style={{ backgroundColor: club.primaryColor }}
              >
                Open Portal
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Club Detail Modal */}
      {showModal && selectedClub && (
        <div className="modal-overlay">
          <div className="modal-content club-detail-modal">
            <div className="modal-header" style={{ backgroundColor: selectedClub.primaryColor }}>
              <h2>{selectedClub.clubName}</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setShowDeleteModal(false);
                }} 
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="club-detail-grid">
                <div className="club-detail-section club-info-section">
                  <h3>Club Information</h3>
                  <div className="detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{selectedClub.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact Email:</span>
                    <span className="detail-value">{selectedClub.contactEmail}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact Phone:</span>
                    <span className="detail-value">{selectedClub.contactPhone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Subdomain:</span>
                    <span className="detail-value">{selectedClub.subdomain}.pickleballportal.com</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Primary Color:</span>
                    <div 
                      className="color-preview" 
                      style={{ backgroundColor: selectedClub.primaryColor }}
                    >
                      {selectedClub.primaryColor}
                    </div>
                  </div>
                </div>
                
                <div className="club-detail-section club-stats-section">
                  <h3>Club Statistics</h3>
                  <div className="detail-stats">
                    <div className="detail-stat">
                      <span className="detail-stat-value">{selectedClub.memberCount}</span>
                      <span className="detail-stat-label">Members</span>
                    </div>
                    <div className="detail-stat">
                      <span className="detail-stat-value">{selectedClub.leagueCount}</span>
                      <span className="detail-stat-label">Leagues</span>
                    </div>
                  </div>
                  
                  <h3>Club Description</h3>
                  <p className="club-full-description">{selectedClub.description}</p>
                </div>
                
                <div className="club-detail-section club-actions-section">
                  <h3>Portal Management</h3>
                  <div className="club-detail-actions">
                    <button 
                      className="secondary-button detail-action-button" 
                      onClick={() => window.alert("Feature not implemented in demo")}
                    >
                      Customize Appearance
                    </button>
                    <button 
                      className="secondary-button detail-action-button" 
                      onClick={() => window.alert("Feature not implemented in demo")}
                    >
                      Manage Users
                    </button>
                    <button 
                      className="secondary-button detail-action-button" 
                      onClick={() => window.alert("Feature not implemented in demo")}
                    >
                      Configure Settings
                    </button>
                    <button 
                      className="primary-button detail-action-button" 
                      style={{ backgroundColor: selectedClub.primaryColor }} 
                      onClick={() => openPortal(selectedClub)}
                    >
                      Open Club Portal
                    </button>
                    <button 
                      className="danger-button detail-action-button" 
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Club
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedClub && (
        <div className="modal-overlay">
          <div className="modal-content delete-confirm-modal">
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="close-button"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>{selectedClub.clubName}</strong>?
              </p>
              <p>
                This action cannot be undone. All associated data will be permanently removed.
              </p>
              <div className="confirm-actions">
                <button 
                  className="secondary-button" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="danger-button" 
                  onClick={async () => {
                    if (selectedClub) {
                      try {
                        setClubs(clubs.filter(club => club.clubId !== selectedClub.clubId));
                        setShowModal(false);
                        setShowDeleteModal(false);
                        setSuccess('Club deleted successfully');
                        setTimeout(() => {
                          setSuccess(null);
                        }, 3000);
                      } catch (err) {
                        setError('Failed to delete club');
                        console.error(err);
                      }
                    }
                  }}
                >
                  Delete Club
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubManagement;
