export interface User {
  id: string;
  name: string;
  email: string;
}

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  ignition: 'on' | 'off';
  speed: number;
  isOverspeed: boolean;
}

export interface StoppagePoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  duration: number;
}

export interface IdlingPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  duration: number;
}

export interface TripSummary {
  totalDistance: number;
  totalDuration: number;
  stoppageDuration: number;
  idlingDuration: number;
}

export interface Trip {
  id: string;
  name: string;
  uploadDate: string;
  summary: TripSummary;
  points: GPSPoint[];
  stoppagePoints: StoppagePoint[];
  idlingPoints: IdlingPoint[];
}
