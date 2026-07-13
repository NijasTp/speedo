import { Request, Response } from 'express';
import { IAuthService } from '../services/IAuthService';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      const result = await this.authService.register(name, email, password);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Registration failed.' });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const result = await this.authService.login(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Login failed.' });
    }
  };

  public getMe = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }
      return res.status(200).json({ user: req.user });
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };
}
