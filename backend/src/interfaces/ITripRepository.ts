import { Trip } from '../models/TripModel';

export interface ITripRepository {
  create(trip: Trip): Promise<Trip>;
  findByUserId(userId: string): Promise<Trip[]>;
  findById(id: string): Promise<Trip | null>;
  deleteById(id: string): Promise<boolean>;
}
