import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { HttpStatus } from '../enums/http-status.enum.js';
import { GeneralMessages } from '../constants/messages.js';
import { logger } from '../logger/logger.js';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response {
  if (err instanceof AppError) {
    logger.warn(`AppError encountered: [${err.statusCode}] ${err.message}`);
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error('Unhandled Server Error: %o', err);
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: GeneralMessages.INTERNAL_SERVER_ERROR,
  });
}
