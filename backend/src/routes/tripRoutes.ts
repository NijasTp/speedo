import { Router } from 'express';
import { TripController } from '../controllers/TripController';
import { RequestHandler } from 'express';
import { upload } from '../middlewares/uploadMiddleware';

export function createTripRouter(tripController: TripController, authMiddleware: RequestHandler): Router {
  const router = Router();

  // All trip routes require authentication
  router.use(authMiddleware);

  router.post('/upload', upload.single('file'), tripController.uploadTrip);
  router.get('/', tripController.getTrips);
  router.get('/:id', tripController.getTrip);
  router.delete('/:id', tripController.deleteTrip);

  return router;
}
