import { ITripService } from './ITripService';
import { ITripRepository } from '../repositories/ITripRepository';
import { ICalculationService, RawGPSPoint } from './ICalculationService';
import { Trip } from '../models/TripModel';

export class TripService implements ITripService {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly calculationService: ICalculationService
  ) {}

  public async createTrip(userId: string, name: string, rawPoints: RawGPSPoint[]): Promise<Trip> {
    if (rawPoints.length === 0) {
      throw new Error('GPS data cannot be empty.');
    }

    const calculation = this.calculationService.calculateTripDetails(rawPoints);

    const trip: Trip = {
      userId,
      name,
      uploadDate: new Date(),
      summary: calculation.summary,
      points: calculation.points,
      stoppagePoints: calculation.stoppagePoints,
      idlingPoints: calculation.idlingPoints,
    };

    return await this.tripRepository.create(trip);
  }

  public async getTripsByUser(userId: string): Promise<Trip[]> {
    return await this.tripRepository.findByUserId(userId);
  }

  public async getTripById(userId: string, tripId: string): Promise<Trip | null> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip || trip.userId !== userId) {
      return null;
    }
    return trip;
  }

  public async deleteTrip(userId: string, tripId: string): Promise<boolean> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip || trip.userId !== userId) {
      throw new Error('Trip not found or unauthorized.');
    }
    return await this.tripRepository.deleteById(tripId);
  }
}
