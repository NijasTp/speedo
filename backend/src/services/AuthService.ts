import { IAuthService } from './IAuthService';
import { IUserRepository } from '../repositories/IUserRepository';
import { User } from '../models/UserModel';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class AuthService implements IAuthService {
  private readonly jwtSecret: string;

  constructor(private readonly userRepository: IUserRepository) {
    this.jwtSecret = process.env.JWT_SECRET || 'speedo_super_secret_key';
  }

  public async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    
    // Create copy without password
    const userWithoutPassword: User = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    return { user: userWithoutPassword, token };
  }

  public async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user || !user.password) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);
    
    const userWithoutPassword: User = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    return { user: userWithoutPassword, token };
  }

  public async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string; email: string };
      const user = await this.userRepository.findById(decoded.id);
      if (!user) return null;
      
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      
      return userWithoutPassword;
    } catch {
      return null;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign({ id: user.id, email: user.email }, this.jwtSecret, {
      expiresIn: '24h',
    });
  }
}
