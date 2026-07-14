import { GPSPointDto, TripSummaryDto, StoppagePointDto, IdlingPointDto } from '../dtos/trip.dto';

export interface RawGPSPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: 'on' | 'off';
}

export interface CalculationResult {
  summary: TripSummaryDto;
  points: GPSPointDto[];
  stoppagePoints: StoppagePointDto[];
  idlingPoints: IdlingPointDto[];
}

export interface ICalculationService {
  calculateTripDetails(rawPoints: RawGPSPoint[]): Promise<CalculationResult> | CalculationResult;
}
