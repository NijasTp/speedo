import { Response } from 'express';
import { ITripService } from '../services/ITripService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { parseCsvBuffer } from '../utils/CsvParser';

export class TripController {
  constructor(private readonly tripService: ITripService) {}

  public uploadTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'CSV file is required.' });
      }

      // Default name to filename if name not provided in body
      let tripName = req.body.name || req.file.originalname;
      if (tripName.endsWith('.csv')) {
        tripName = tripName.substring(0, tripName.length - 4);
      }

      const rawPoints = await parseCsvBuffer(req.file.buffer);
      if (rawPoints.length === 0) {
        return res.status(400).json({ error: 'No valid GPS points found in CSV.' });
      }

      const trip = await this.tripService.createTrip(req.user.id, tripName, rawPoints);
      return res.status(201).json(trip);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'File processing failed.' });
    }
  };

  public getTrips = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      const trips = await this.tripService.getTripsByUser(req.user.id);
      return res.status(200).json(trips);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch trips.' });
    }
  };

  public getTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      const trip = await this.tripService.getTripById(req.user.id, req.params.id);
      if (!trip) {
        return res.status(404).json({ error: 'Trip not found.' });
      }

      return res.status(200).json(trip);
    } catch (error: any) {
      return res.status(500).json({ error: 'Failed to fetch trip details.' });
    }
  };

  public deleteTrip = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }

      await this.tripService.deleteTrip(req.user.id, req.params.id);
      return res.status(200).json({ message: 'Trip deleted successfully.' });
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Failed to delete trip.' });
    }
  };
}
