import { Router } from 'express';
import { TripController } from '../controllers/TripController.js';
import { RequestHandler } from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import { ApiRoutes } from '../enums/api-routes.enum.js';

export function createTripRouter(tripController: TripController, authMiddleware: RequestHandler): Router {
  const router = Router();

  // All trip routes require authentication
  router.use(authMiddleware);

  router.post(ApiRoutes.TRIP_UPLOAD, upload.single('file'), tripController.uploadTrip);
  router.get(ApiRoutes.ROOT, tripController.getTrips);
  router.get(ApiRoutes.TRIP_ID, tripController.getTrip);
  router.delete(ApiRoutes.TRIP_ID, tripController.deleteTrip);

  return router;
}
