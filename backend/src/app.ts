import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import repositories
import { MongoUserRepository } from './repositories/MongoUserRepository';
import { MongoTripRepository } from './repositories/MongoTripRepository';

// Import services
import { AuthService } from './services/AuthService';
import { SpeedCalculationService } from './services/SpeedCalculationService';
import { TripService } from './services/TripService';

// Import controllers, middlewares, routes
import { AuthController } from './controllers/AuthController';
import { TripController } from './controllers/TripController';
import { createAuthMiddleware } from './middlewares/authMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { createAuthRouter } from './routes/authRoutes';
import { createTripRouter } from './routes/tripRoutes';
import { ApiRoutes } from './enums/api-routes.enum';

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
