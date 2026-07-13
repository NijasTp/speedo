import { User } from '../models/UserModel';

export interface IAuthService {
  register(name: string, email: string, password: string): Promise<{ user: User; token: string }>;
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  validateToken(token: string): Promise<User | null>;
}
