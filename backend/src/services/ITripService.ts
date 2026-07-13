import { Trip } from '../models/TripModel';
import { RawGPSPoint } from './ICalculationService';

export interface ITripService {
  createTrip(userId: string, name: string, rawPoints: RawGPSPoint[]): Promise<Trip>;
  getTripsByUser(userId: string): Promise<Trip[]>;
  getTripById(userId: string, tripId: string): Promise<Trip | null>;
  deleteTrip(userId: string, tripId: string): Promise<boolean>;
}
