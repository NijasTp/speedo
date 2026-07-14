export interface GPSPointDto {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: 'on' | 'off';
  speed?: number;
  isOverspeed?: boolean;
}

export interface TripSummaryDto {
  totalDistance: number;
  totalDuration: number;
  stoppageDuration: number;
  idlingDuration: number;
}

export interface StoppagePointDto {
  latitude: number;
  longitude: number;
  timestamp: Date;
  duration: number;
}

export interface IdlingPointDto {
  latitude: number;
  longitude: number;
  timestamp: Date;
  duration: number;
}

export interface TripResponseDto {
  id: string;
  userId: string;
  name: string;
  uploadDate: Date;
  summary: TripSummaryDto;
  points: GPSPointDto[];
  stoppagePoints: StoppagePointDto[];
  idlingPoints: IdlingPointDto[];
}
