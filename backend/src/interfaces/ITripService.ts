import { TripResponseDto } from '../dtos/trip.dto';
import { RawGPSPoint } from './ICalculationService';

export interface ITripService {
  createTrip(userId: string, name: string, rawPoints: RawGPSPoint[]): Promise<TripResponseDto>;
  getTripsByUser(userId: string): Promise<TripResponseDto[]>;
  getTripById(userId: string, tripId: string): Promise<TripResponseDto>;
  deleteTrip(userId: string, tripId: string): Promise<void>;
}
