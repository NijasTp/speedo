import { HttpStatus } from '../enums/http-status.enum.js';

export abstract class AppError extends Error {
  public abstract readonly statusCode: HttpStatus;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  public readonly statusCode = HttpStatus.BAD_REQUEST;
}

export class ValidationError extends AppError {
  public readonly statusCode = HttpStatus.BAD_REQUEST;
}

export class UnauthorizedError extends AppError {
  public readonly statusCode = HttpStatus.UNAUTHORIZED;
}

export class ForbiddenError extends AppError {
  public readonly statusCode = HttpStatus.FORBIDDEN;
}

export class NotFoundError extends AppError {
  public readonly statusCode = HttpStatus.NOT_FOUND;
}

export class ConflictError extends AppError {
  public readonly statusCode = HttpStatus.CONFLICT;
}

export class InternalServerError extends AppError {
  public readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
