import { RegisterRequestDto, AuthResponseDto, LoginRequestDto, UserDto } from '../dtos/auth.dto';

export interface IAuthService {
  register(dto: RegisterRequestDto): Promise<AuthResponseDto>;
  login(dto: LoginRequestDto): Promise<AuthResponseDto>;
  validateToken(token: string): Promise<UserDto | null>;
}
