import { Response } from 'express';
import { ITripService } from '../interfaces/ITripService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { parseCsvBuffer } from '../utils/CsvParser';
import { HttpStatus } from '../enums/http-status.enum';
import { TripMessages } from '../constants/messages';
import { UnauthorizedError, BadRequestError } from '../errors/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export class TripController {
  constructor(private readonly tripService: ITripService) {}

  public uploadTrip = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(TripMessages.TRIP_NOT_FOUND_OR_UNAUTHORIZED);
    }

    if (!req.file) {
      throw new BadRequestError(TripMessages.CSV_REQUIRED);
    }

    let tripName = req.body.name || req.file.originalname;
    if (tripName.endsWith('.csv')) {
      tripName = tripName.substring(0, tripName.length - 4);
    }

    const rawPoints = await parseCsvBuffer(req.file.buffer);
    if (rawPoints.length === 0) {
      throw new BadRequestError(TripMessages.NO_VALID_POINTS);
    }

    const trip = await this.tripService.createTrip(req.user.id, tripName, rawPoints);
    return res.status(HttpStatus.CREATED).json(trip);
  });

  public getTrips = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(TripMessages.TRIP_NOT_FOUND_OR_UNAUTHORIZED);
    }

    const trips = await this.tripService.getTripsByUser(req.user.id);
    return res.status(HttpStatus.OK).json(trips);
  });

  public getTrip = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(TripMessages.TRIP_NOT_FOUND_OR_UNAUTHORIZED);
    }

    const trip = await this.tripService.getTripById(req.user.id, req.params.id);
    return res.status(HttpStatus.OK).json(trip);
  });

  public deleteTrip = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedError(TripMessages.TRIP_NOT_FOUND_OR_UNAUTHORIZED);
    }

    await this.tripService.deleteTrip(req.user.id, req.params.id);
    return res.status(HttpStatus.OK).json({ message: TripMessages.TRIP_DELETED });
  });
}
