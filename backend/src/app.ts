import express, { Express, Request, Response, NextFunction } from 'express';
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
import { createAuthRouter } from './routes/authRoutes';
import { createTripRouter } from './routes/tripRoutes';

// Load environment variables
dotenv.config();

const app: Express = express();

// Standard middleware
app.use(cors());
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

// Setup routers
const authRouter = createAuthRouter(authController, authMiddleware);
const tripRouter = createTripRouter(tripController, authMiddleware);

app.use('/api/auth', authRouter);
app.use('/api/trips', tripRouter);

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
