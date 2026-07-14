import { TripResponseDto } from '../dtos/trip.dto.js';
import { RawGPSPoint } from './ICalculationService.js';

export interface ITripService {
  createTrip(userId: string, name: string, rawPoints: RawGPSPoint[]): Promise<TripResponseDto>;
  getTripsByUser(userId: string): Promise<TripResponseDto[]>;
  getTripById(userId: string, tripId: string): Promise<TripResponseDto>;
  deleteTrip(userId: string, tripId: string): Promise<void>;
}
