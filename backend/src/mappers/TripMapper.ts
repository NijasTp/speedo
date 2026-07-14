import { Trip } from '../models/TripModel.js';
import { TripResponseDto } from '../dtos/trip.dto.js';

export class TripMapper {
  public static toDto(trip: Trip): TripResponseDto {
    return {
      id: trip._id?.toString() || trip.id || '',
      userId: trip.userId,
      name: trip.name,
      uploadDate: trip.uploadDate,
      summary: {
        totalDistance: trip.summary.totalDistance,
        totalDuration: trip.summary.totalDuration,
        stoppageDuration: trip.summary.stoppageDuration,
        idlingDuration: trip.summary.idlingDuration,
      },
      points: trip.points.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
        timestamp: p.timestamp,
        ignition: p.ignition,
        speed: p.speed,
        isOverspeed: p.isOverspeed,
      })),
      stoppagePoints: trip.stoppagePoints.map(sp => ({
        latitude: sp.latitude,
        longitude: sp.longitude,
        timestamp: sp.timestamp,
        duration: sp.duration,
      })),
      idlingPoints: trip.idlingPoints.map(ip => ({
        latitude: ip.latitude,
        longitude: ip.longitude,
        timestamp: ip.timestamp,
        duration: ip.duration,
      })),
    };
  }

  public static toDtoList(trips: Trip[]): TripResponseDto[] {
    return trips.map(trip => this.toDto(trip));
  }
}
