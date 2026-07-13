import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MapView } from '../components/MapView';
import { StatsPanel } from '../components/StatsPanel';
import { UploadModal } from '../components/UploadModal';

interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  ignition: 'on' | 'off';
  speed: number;
  isOverspeed: boolean;
}

interface StoppagePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  duration: number;
}

interface IdlingPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  duration: number;
}

interface TripSummary {
  totalDistance: number;
  totalDuration: number;
  stoppageDuration: number;
  idlingDuration: number;
}

interface Trip {
  id: string;
  name: string;
  uploadDate: string;
  summary: TripSummary;
  points: GPSPoint[];
  stoppagePoints: StoppagePoint[];
  idlingPoints: IdlingPoint[];
}

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripIds, setSelectedTripIds] = useState<string[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all trips on load
  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
      
      // Auto-select the first trip if available
      if (response.data.length > 0 && selectedTripIds.length === 0) {
        const firstTrip = response.data[0];
        setSelectedTripIds([firstTrip.id]);
        setActiveTripId(firstTrip.id);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleUploadSuccess = (newTrip: Trip) => {
    setTrips(prev => [newTrip, ...prev]);
    // Automatically select the newly uploaded trip
    setSelectedTripIds(prev => [...prev, newTrip.id]);
    setActiveTripId(newTrip.id);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    setTrips(prev => prev.filter(t => t.id !== deletedId));
    setSelectedTripIds(prev => prev.filter(id => id !== deletedId));
    if (activeTripId === deletedId) {
      const remainingSelected = selectedTripIds.filter(id => id !== deletedId);
      setActiveTripId(remainingSelected.length > 0 ? remainingSelected[0] : null);
    }
  };

  const handleTripCheckboxToggle = (tripId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Avoid triggering trip row click
    setSelectedTripIds(prev => {
      const isSelected = prev.includes(tripId);
      let updated: string[];
      if (isSelected) {
        updated = prev.filter(id => id !== tripId);
      } else {
        updated = [...prev, tripId];
      }

      // Sync active trip selection
      if (updated.length === 0) {
        setActiveTripId(null);
      } else if (activeTripId === tripId && isSelected) {
        // If we unchecked the currently active trip, set active to another selected trip
        setActiveTripId(updated[0]);
      } else if (!isSelected) {
        // If we checked a new trip, make it active
        setActiveTripId(tripId);
      }

      return updated;
    });
  };

  const handleTripRowClick = (tripId: string) => {
    // If not checked, check it
    if (!selectedTripIds.includes(tripId)) {
      setSelectedTripIds(prev => [...prev, tripId]);
    }
    // Set as active tab
    setActiveTripId(tripId);
  };

  // Get active trip details
  const activeTrip = trips.find(t => t.id === activeTripId);
  // Get selected trips data
  const selectedTrips = trips.filter(t => selectedTripIds.includes(t.id));

  return (
    <div className="dashboard-container">
      {/* Sidebar Panel */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <span style={{ fontSize: '1.8rem' }}>⚡</span>
            <span className="logo-text">SPEEDO</span>
          </div>
          {user && <span className="user-badge">{user.name.split(' ')[0]}</span>}
        </div>

        <button 
          className="btn-upload-trigger" 
          onClick={() => setIsUploadOpen(true)}
        >
          + Upload GPS Data
        </button>

        <div className="trip-list-container">
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            My Trips ({trips.length})
          </div>
          {loading ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>Loading trips...</div>
          ) : trips.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px', padding: '0 10px' }}>
              No trips uploaded yet. Upload a CSV to get started!
            </div>
          ) : (
            trips.map((trip) => {
              const isSelected = selectedTripIds.includes(trip.id);
              const isActive = activeTripId === trip.id;
              
              return (
                <div 
                  key={trip.id} 
                  className={`trip-item ${isActive ? 'selected' : ''}`}
                  onClick={() => handleTripRowClick(trip.id)}
                >
                  <input 
                    type="checkbox" 
                    className="trip-checkbox"
                    checked={isSelected}
                    onChange={() => {}} // Click handled in outer row toggle helper
                    onClick={(e) => handleTripCheckboxToggle(trip.id, e)}
                  />
                  <div className="trip-item-info">
                    <div className="trip-item-name" title={trip.name}>{trip.name}</div>
                    <div className="trip-item-date">
                      {new Date(trip.uploadDate).toLocaleDateString()} &bull; {trip.summary.totalDistance.toFixed(1)} km
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="sidebar-footer">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
            {user?.email}
          </span>
          <a href="#" className="logout-link" onClick={(e) => { e.preventDefault(); logout(); }}>
            Sign Out
          </a>
        </div>
      </div>

      {/* Main Workspace (Map + Tab view + Stats) */}
      <div className="main-workspace">
        {selectedTrips.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">🗺️</div>
            <h2 className="empty-title">No Trips Selected</h2>
            <p>Select one or more trips from the sidebar list, or upload a new GPS CSV file to compute speeds and map out details.</p>
          </div>
        ) : (
          <>
            {/* Leaflet Map display */}
            <MapView 
              selectedTrips={selectedTrips} 
              activeTripId={activeTripId} 
            />

            {/* Tab switch overlay if multiple trips are selected */}
            {selectedTrips.length > 1 && (
              <div className="tabs-container">
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 'bold', marginRight: '8px' }}>
                  Viewing Details:
                </span>
                {selectedTrips.map((trip) => (
                  <button
                    key={trip.id}
                    className={`tab-button ${trip.id === activeTripId ? 'active' : ''}`}
                    onClick={() => setActiveTripId(trip.id)}
                  >
                    {trip.name}
                  </button>
                ))}
              </div>
            )}

            {/* Metrics Report of the active selected trip */}
            {activeTrip && (
              <StatsPanel 
                trip={activeTrip} 
                onDeleteSuccess={handleDeleteSuccess} 
              />
            )}
          </>
        )}
      </div>

      {/* Upload CSV modal trigger */}
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUploadSuccess={handleUploadSuccess} 
        />
      )}
    </div>
  );
};
