import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { RequestHandler } from 'express';
import { ApiRoutes } from '../enums/api-routes.enum.js';

export function createAuthRouter(authController: AuthController, authMiddleware: RequestHandler): Router {
  const router = Router();

  router.post(ApiRoutes.REGISTER, authController.register);
  router.post(ApiRoutes.LOGIN, authController.login);
  router.get(ApiRoutes.ME, authMiddleware, authController.getMe);

  return router;
}
