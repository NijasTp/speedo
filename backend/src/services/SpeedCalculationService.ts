import { ICalculationService, RawGPSPoint, CalculationResult } from '../interfaces/ICalculationService.js';
import { GPSPointDto, StoppagePointDto, IdlingPointDto } from '../dtos/trip.dto.js';
import * as geolib from 'geolib';

export class SpeedCalculationService implements ICalculationService {
  public calculateTripDetails(rawPoints: RawGPSPoint[]): CalculationResult {
    const sorted = [...rawPoints].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (sorted.length === 0) {
      return {
        summary: { totalDistance: 0, totalDuration: 0, stoppageDuration: 0, idlingDuration: 0 },
        points: [],
        stoppagePoints: [],
        idlingPoints: [],
      };
    }

    const points: GPSPointDto[] = [];
    const stoppagePoints: StoppagePointDto[] = [];
    const idlingPoints: IdlingPointDto[] = [];

    let totalDistance = 0;
    let totalDuration = 0;
    let stoppageDuration = 0;
    let idlingDuration = 0;

    points.push({
      latitude: sorted[0].latitude,
      longitude: sorted[0].longitude,
      timestamp: sorted[0].timestamp,
      ignition: sorted[0].ignition,
      speed: 0,
      isOverspeed: false,
    });

    let currentStoppage: { startPoint: RawGPSPoint; duration: number } | null = null;
    let currentIdling: { startPoint: RawGPSPoint; duration: number } | null = null;

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      const distanceDelta = geolib.getDistance(
        { latitude: current.latitude, longitude: current.longitude },
        { latitude: next.latitude, longitude: next.longitude }
      );

      const timeDelta = (next.timestamp.getTime() - current.timestamp.getTime()) / 1000;

      const speed = timeDelta > 0 ? (distanceDelta / timeDelta) * 3.6 : 0;
      const isOverspeed = speed > 60;

      totalDistance += distanceDelta / 1000;
      totalDuration += timeDelta;

      points.push({
        latitude: next.latitude,
        longitude: next.longitude,
        timestamp: next.timestamp,
        ignition: next.ignition,
        speed: parseFloat(speed.toFixed(2)),
        isOverspeed,
      });

      if (current.ignition === 'off') {
        stoppageDuration += timeDelta;

        if (currentIdling) {
          idlingPoints.push({
            latitude: currentIdling.startPoint.latitude,
            longitude: currentIdling.startPoint.longitude,
            timestamp: currentIdling.startPoint.timestamp,
            duration: currentIdling.duration,
          });
          currentIdling = null;
        }

        if (currentStoppage === null) {
          currentStoppage = { startPoint: current, duration: timeDelta };
        } else {
          currentStoppage.duration += timeDelta;
        }
      } else if (current.ignition === 'on' && speed < 0.1) {
        idlingDuration += timeDelta;

        if (currentStoppage) {
          stoppagePoints.push({
            latitude: currentStoppage.startPoint.latitude,
            longitude: currentStoppage.startPoint.longitude,
            timestamp: currentStoppage.startPoint.timestamp,
            duration: currentStoppage.duration,
          });
          currentStoppage = null;
        }

        if (currentIdling === null) {
          currentIdling = { startPoint: current, duration: timeDelta };
        } else {
          currentIdling.duration += timeDelta;
        }
      } else {
        if (currentStoppage) {
          stoppagePoints.push({
            latitude: currentStoppage.startPoint.latitude,
            longitude: currentStoppage.startPoint.longitude,
            timestamp: currentStoppage.startPoint.timestamp,
            duration: currentStoppage.duration,
          });
          currentStoppage = null;
        }

        if (currentIdling) {
          idlingPoints.push({
            latitude: currentIdling.startPoint.latitude,
            longitude: currentIdling.startPoint.longitude,
            timestamp: currentIdling.startPoint.timestamp,
            duration: currentIdling.duration,
          });
          currentIdling = null;
        }
      }
    }

    if (currentStoppage) {
      stoppagePoints.push({
        latitude: currentStoppage.startPoint.latitude,
        longitude: currentStoppage.startPoint.longitude,
        timestamp: currentStoppage.startPoint.timestamp,
        duration: currentStoppage.duration,
      });
    }

    if (currentIdling) {
      idlingPoints.push({
        latitude: currentIdling.startPoint.latitude,
        longitude: currentIdling.startPoint.longitude,
        timestamp: currentIdling.startPoint.timestamp,
        duration: currentIdling.duration,
      });
    }

    return {
      summary: {
        totalDistance: parseFloat(totalDistance.toFixed(2)),
        totalDuration: Math.round(totalDuration),
        stoppageDuration: Math.round(stoppageDuration),
        idlingDuration: Math.round(idlingDuration),
      },
      points,
      stoppagePoints,
      idlingPoints,
    };
  }
}
