import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Trip } from '../types';

interface MapViewProps {
  selectedTrips: Trip[];
  activeTripId: string | null;
}

const MapBoundsUpdater: React.FC<{ trips: Trip[]; activeTripId: string | null }> = ({ trips, activeTripId }) => {
  const map = useMap();

  useEffect(() => {
    if (trips.length === 0) return;

    const focusTrips = activeTripId 
      ? trips.filter(t => t.id === activeTripId)
      : trips;

    const coordinates: L.LatLng[] = [];
    focusTrips.forEach((trip) => {
      trip.points.forEach((p) => {
        coordinates.push(L.latLng(p.latitude, p.longitude));
      });
    });

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [trips, activeTripId, map]);

  return null;
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const MapView: React.FC<MapViewProps> = ({ selectedTrips, activeTripId }) => {
  const getTripSegments = (trip: Trip) => {
    const segments: { coords: [number, number][]; isOverspeed: boolean }[] = [];
    const points = trip.points;

    if (points.length < 2) return segments;

    let currentSegment: [number, number][] = [[points[0].latitude, points[0].longitude]];
    let currentOverspeed = points[0].isOverspeed || false;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const overspeed = curr.isOverspeed;

      if (overspeed === currentOverspeed) {
        currentSegment.push([curr.latitude, curr.longitude]);
      } else {
        currentSegment.push([curr.latitude, curr.longitude]);
        segments.push({ coords: currentSegment, isOverspeed: currentOverspeed });
        currentSegment = [[prev.latitude, prev.longitude], [curr.latitude, curr.longitude]];
        currentOverspeed = overspeed;
      }
    }

    if (currentSegment.length > 1) {
      segments.push({ coords: currentSegment, isOverspeed: currentOverspeed });
    }

    return segments;
  };

  const createStoppageIcon = () => {
    return L.divIcon({
      className: 'stoppage-marker-container',
      html: `<div style="background-color: #ef4444; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #ef4444; cursor: pointer;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  const createIdlingIcon = () => {
    return L.divIcon({
      className: 'idling-marker-container',
      html: `<div style="background-color: #f59e0b; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #f59e0b; cursor: pointer;"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  const defaultCenter: [number, number] = [52.52, 13.40];
  const defaultZoom = 12;

  return (
    <div className="map-pane">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        className="map-container"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {selectedTrips.map((trip) => {
          const segments = getTripSegments(trip);
          const isActive = trip.id === activeTripId;
          
          return (
            <React.Fragment key={trip.id}>
              {segments.map((seg, idx) => (
                <Polyline
                  key={`${trip.id}-seg-${idx}`}
                  positions={seg.coords}
                  color={seg.isOverspeed ? '#06b6d4' : (isActive ? '#3b82f6' : '#6b7280')}
                  weight={seg.isOverspeed ? (isActive ? 5 : 4) : (isActive ? 4 : 3)}
                  opacity={isActive ? 0.9 : 0.6}
                  dashArray={isActive ? undefined : '5, 5'}
                >
                  <Popup>
                    <div className="popup-title">{trip.name}</div>
                    <div className="popup-detail">
                      Speed Segment: {seg.isOverspeed ? 'Overspeeding (> 60 km/h)' : 'Normal Speed'}
                    </div>
                  </Popup>
                </Polyline>
              ))}

              {trip.stoppagePoints.map((stop, idx) => (
                <Marker
                  key={`${trip.id}-stop-${idx}`}
                  position={[stop.latitude, stop.longitude]}
                  icon={createStoppageIcon()}
                >
                  <Popup>
                    <div>
                      <div className="popup-title" style={{ color: '#ef4444' }}>Stoppage Point</div>
                      <div className="popup-detail">Trip: {trip.name}</div>
                      <div className="popup-detail">Time: {new Date(stop.timestamp).toLocaleString()}</div>
                      <div className="popup-detail">Duration: {formatDuration(stop.duration)}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {trip.idlingPoints.map((idle, idx) => (
                <Marker
                  key={`${trip.id}-idle-${idx}`}
                  position={[idle.latitude, idle.longitude]}
                  icon={createIdlingIcon()}
                >
                  <Popup>
                    <div>
                      <div className="popup-title" style={{ color: '#f59e0b' }}>Idling Point</div>
                      <div className="popup-detail">Trip: {trip.name}</div>
                      <div className="popup-detail">Time: {new Date(idle.timestamp).toLocaleString()}</div>
                      <div className="popup-detail">Duration: {formatDuration(idle.duration)}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}

        <MapBoundsUpdater trips={selectedTrips} activeTripId={activeTripId} />
      </MapContainer>

      {/* Map Legends */}
      <div className="map-legend">
        <div className="legend-item">
          <div className="legend-line normal"></div>
          <span>Normal Path</span>
        </div>
        <div className="legend-item">
          <div className="legend-line overspeed"></div>
          <span>Overspeeding (&gt; 60 km/h)</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker stoppage"></div>
          <span>Stoppage (Ignition OFF)</span>
        </div>
        <div className="legend-item">
          <div className="legend-marker idling"></div>
          <span>Idling (Ignition ON, Speed 0)</span>
        </div>
      </div>
    </div>
  );
};
