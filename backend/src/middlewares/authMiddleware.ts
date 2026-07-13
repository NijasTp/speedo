import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../services/IAuthService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    name: string;
    email: string;
  };
}

export function createAuthMiddleware(authService: IAuthService) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
      }

      const token = authHeader.split(' ')[1];
      const user = await authService.validateToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ error: 'Authentication internal error.' });
    }
  };
}
