import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../interfaces/IAuthService.js';
import { UnauthorizedError, InternalServerError } from '../errors/AppError.js';
import { AuthMessages } from '../constants/messages.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { UserDto } from '../dtos/auth.dto.js';

export interface AuthenticatedRequest extends Request {
  user?: UserDto;
}

export function createAuthMiddleware(authService: IAuthService) {
  return asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError(AuthMessages.ACCESS_DENIED_NO_TOKEN);
    }

    const token = authHeader.split(' ')[1];
    let user: UserDto | null;
    try {
      user = await authService.validateToken(token);
    } catch (error) {
      throw new InternalServerError(AuthMessages.AUTHENTICATION_INTERNAL_ERROR);
    }

    if (!user) {
      throw new UnauthorizedError(AuthMessages.INVALID_EXPIRED_TOKEN);
    }

    req.user = user;
    next();
  });
}
