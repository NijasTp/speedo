import React, { useState } from 'react';
import { tripService } from '../services/tripService';
import type { Trip } from '../types';

interface StatsPanelProps {
  trip: Trip;
  onDeleteSuccess: (deletedId: string) => void;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const StatsPanel: React.FC<StatsPanelProps> = ({ trip, onDeleteSuccess }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete the trip "${trip.name}"?`)) {
      return;
    }
    setDeleting(true);
    try {
      await tripService.deleteTrip(trip.id);
      onDeleteSuccess(trip.id);
    } catch {
      alert('Failed to delete trip.');
    } finally {
      setDeleting(false);
    }
  };

  const { totalDistance, totalDuration, stoppageDuration, idlingDuration } = trip.summary;

  return (
    <div className="stats-drawer">
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-box-title">Distance Traveled</div>
          <div className="stat-box-value">
            {totalDistance.toFixed(2)}
            <span className="stat-box-unit">km</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-title">Total Duration</div>
          <div className="stat-box-value">
            {formatDuration(totalDuration)}
          </div>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid #ef4444' }}>
          <div className="stat-box-title" style={{ color: '#f87171' }}>Stoppage Duration</div>
          <div className="stat-box-value">
            {formatDuration(stoppageDuration)}
          </div>
        </div>

        <div className="stat-box" style={{ borderLeft: '3px solid #f59e0b' }}>
          <div className="stat-box-title" style={{ color: '#fbbf24' }}>Idling Duration</div>
          <div className="stat-box-value">
            {formatDuration(idlingDuration)}
          </div>
        </div>
      </div>

      <div className="trip-actions">
        <button 
          onClick={handleDelete} 
          className="btn-delete" 
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Trip'}
        </button>
      </div>
    </div>
  );
};
