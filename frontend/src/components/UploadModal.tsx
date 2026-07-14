import React, { useState, useRef } from 'react';
import { tripService } from '../services/tripService';
import type { Trip } from '../types';
import axios from 'axios';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: (newTrip: Trip) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [tripName, setTripName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv') || droppedFile.type === 'text/csv' || droppedFile.type === 'application/vnd.ms-excel') {
        setFile(droppedFile);
        if (!tripName) {
          setTripName(droppedFile.name.replace('.csv', ''));
        }
      } else {
        setError('Only CSV files are allowed.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!tripName) {
        setTripName(selectedFile.name.replace('.csv', ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a GPS CSV file.');
      return;
    }

    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', tripName);

    try {
      const newTrip = await tripService.uploadTrip(formData);
      onUploadSuccess(newTrip);
      onClose();
    } catch (err) {
      let errorMessage = 'Failed to upload and calculate trip details.';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content">
        <div className="modal-header">
          <h2>Upload GPS Trip</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Trip Name (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Route A to B"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
            />
          </div>

          <div 
            className={`upload-dropzone ${dragOver ? 'dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".csv"
              onChange={handleFileChange}
            />
            <div className="upload-icon">📂</div>
            <div className="upload-text">
              {file ? 'File Selected' : 'Drag & Drop CSV here'}
            </div>
            <div className="upload-subtext">
              {file ? file.name : 'or click to browse your files'}
            </div>
          </div>

          {file && (
            <div className="file-info">
              <span className="file-name">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              <span className="file-remove" onClick={() => setFile(null)}>Remove</span>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading || !file}>
            {loading ? 'Uploading & Calculating...' : 'Upload & Analyze Trip'}
          </button>
        </form>
      </div>
    </div>
  );
};
