import { GPSPoint, TripSummary, StoppagePoint, IdlingPoint } from '../models/TripModel';

export interface RawGPSPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: 'on' | 'off';
}

export interface CalculationResult {
  summary: TripSummary;
  points: GPSPoint[];
  stoppagePoints: StoppagePoint[];
  idlingPoints: IdlingPoint[];
}

export interface ICalculationService {
  calculateTripDetails(rawPoints: RawGPSPoint[]): CalculationResult;
}
