import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import repositories
import { MongoUserRepository } from './repositories/MongoUserRepository.js';
import { MongoTripRepository } from './repositories/MongoTripRepository.js';

// Import services
import { AuthService } from './services/AuthService.js';
import { SpeedCalculationService } from './services/SpeedCalculationService.js';
import { TripService } from './services/TripService.js';

// Import controllers, middlewares, routes
import { AuthController } from './controllers/AuthController.js';
import { TripController } from './controllers/TripController.js';
import { createAuthMiddleware } from './middlewares/authMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { createAuthRouter } from './routes/authRoutes.js';
import { createTripRouter } from './routes/tripRoutes.js';
import { ApiRoutes } from './enums/api-routes.enum.js';

// Load environment variables
dotenv.config();

const app: Express = express();

// CORS Middleware - strictly configured from environment
const frontendUrl = process.env.FRONTEND_URL;
app.use(cors({
  origin: frontendUrl,
}));

app.use(express.json());

// Composition Root (Dependency Injection setup)
const userRepository = new MongoUserRepository();
const tripRepository = new MongoTripRepository();

const authService = new AuthService(userRepository);
const speedCalculationService = new SpeedCalculationService();
const tripService = new TripService(tripRepository, speedCalculationService);

const authMiddleware = createAuthMiddleware(authService);

const authController = new AuthController(authService);
const tripController = new TripController(tripService);

// Setup routers using API route enums
const authRouter = createAuthRouter(authController, authMiddleware);
const tripRouter = createTripRouter(tripController, authMiddleware);

app.use(ApiRoutes.AUTH, authRouter);
app.use(ApiRoutes.TRIPS, tripRouter);

// Centralized error handler middleware
app.use(errorMiddleware);

export default app;
