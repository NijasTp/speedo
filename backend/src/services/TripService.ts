import { ITripService } from '../interfaces/ITripService.js';
import { ITripRepository } from '../interfaces/ITripRepository.js';
import { ICalculationService, RawGPSPoint } from '../interfaces/ICalculationService.js';
import { TripResponseDto } from '../dtos/trip.dto.js';
import { TripMapper } from '../mappers/TripMapper.js';
import { Trip } from '../models/TripModel.js';
import { NotFoundError, InternalServerError, BadRequestError } from '../errors/AppError.js';
import { TripMessages } from '../constants/messages.js';

export class TripService implements ITripService {
  constructor(
    private readonly tripRepository: ITripRepository,
    private readonly calculationService: ICalculationService
  ) {}

  public async createTrip(userId: string, name: string, rawPoints: RawGPSPoint[]): Promise<TripResponseDto> {
    if (rawPoints.length === 0) {
      throw new BadRequestError(TripMessages.GPS_DATA_EMPTY);
    }

    const calculation = await this.calculationService.calculateTripDetails(rawPoints);

    const trip: Trip = {
      userId,
      name,
      uploadDate: new Date(),
      summary: calculation.summary,
      points: calculation.points.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
        timestamp: p.timestamp,
        ignition: p.ignition,
        speed: p.speed,
        isOverspeed: p.isOverspeed,
      })),
      stoppagePoints: calculation.stoppagePoints.map(sp => ({
        latitude: sp.latitude,
        longitude: sp.longitude,
        timestamp: sp.timestamp,
        duration: sp.duration,
      })),
      idlingPoints: calculation.idlingPoints.map(ip => ({
        latitude: ip.latitude,
        longitude: ip.longitude,
        timestamp: ip.timestamp,
        duration: ip.duration,
      })),
    };

    const savedTrip = await this.tripRepository.create(trip);
    return TripMapper.toDto(savedTrip);
  }

  public async getTripsByUser(userId: string): Promise<TripResponseDto[]> {
    const trips = await this.tripRepository.findByUserId(userId);
    return TripMapper.toDtoList(trips);
  }

  public async getTripById(userId: string, tripId: string): Promise<TripResponseDto> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip || trip.userId !== userId) {
      throw new NotFoundError(TripMessages.TRIP_NOT_FOUND);
    }
    return TripMapper.toDto(trip);
  }

  public async deleteTrip(userId: string, tripId: string): Promise<void> {
    const trip = await this.tripRepository.findById(tripId);
    if (!trip || trip.userId !== userId) {
      throw new NotFoundError(TripMessages.TRIP_NOT_FOUND_OR_UNAUTHORIZED);
    }
    const success = await this.tripRepository.deleteById(tripId);
    if (!success) {
      throw new InternalServerError(TripMessages.DELETE_TRIP_FAILED);
    }
  }
}
