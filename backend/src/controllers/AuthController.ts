import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/IAuthService.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { HttpStatus } from '../enums/http-status.enum.js';
import { AuthMessages } from '../constants/messages.js';
import { ValidationError, UnauthorizedError } from '../errors/AppError.js';
import { RegisterRequestDto, LoginRequestDto } from '../dtos/auth.dto.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public register = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new ValidationError(AuthMessages.NAME_EMAIL_PASSWORD_REQUIRED);
    }

    const dto: RegisterRequestDto = { name, email, password };
    const result = await this.authService.register(dto);
    return res.status(HttpStatus.CREATED).json(result);
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError(AuthMessages.EMAIL_PASSWORD_REQUIRED);
    }

    const dto: LoginRequestDto = { email, password };
    const result = await this.authService.login(dto);
    return res.status(HttpStatus.OK).json(result);
  });

  public getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError(AuthMessages.NOT_AUTHENTICATED);
    }
    return res.status(HttpStatus.OK).json({ user: req.user });
  });
}
