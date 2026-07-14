import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { RegisterRequestDto, AuthResponseDto, LoginRequestDto, UserDto } from '../dtos/auth.dto';
import { ConflictError, UnauthorizedError } from '../errors/AppError';
import { AuthMessages } from '../constants/messages';
import { UserMapper } from '../mappers/UserMapper';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService implements IAuthService {
  private readonly jwtSecret: string;

  constructor(private readonly userRepository: IUserRepository) {
    this.jwtSecret = process.env.JWT_SECRET || 'speedo_super_secret_key';
  }

  public async register(dto: RegisterRequestDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (existing) {
      throw new ConflictError(AuthMessages.EMAIL_ALREADY_EXISTS);
    }

    if (!dto.password) {
      throw new ConflictError(AuthMessages.REGISTRATION_FAILED);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepository.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
    });

    const token = this.generateToken(user._id?.toString() || user.id || '', user.email);
    return UserMapper.toAuthResponseDto(user, token);
  }

  public async login(dto: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase());
    if (!user || !user.password) {
      throw new UnauthorizedError(AuthMessages.INVALID_CREDENTIALS);
    }

    if (!dto.password) {
      throw new UnauthorizedError(AuthMessages.INVALID_CREDENTIALS);
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError(AuthMessages.INVALID_CREDENTIALS);
    }

    const token = this.generateToken(user._id?.toString() || user.id || '', user.email);
    return UserMapper.toAuthResponseDto(user, token);
  }

  public async validateToken(token: string): Promise<UserDto | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { id: string; email: string };
      const user = await this.userRepository.findById(decoded.id);
      if (!user) return null;

      return UserMapper.toDto(user);
    } catch {
      return null;
    }
  }

  private generateToken(id: string, email: string): string {
    return jwt.sign({ id, email }, this.jwtSecret, {
      expiresIn: '24h',
    });
  }
}
