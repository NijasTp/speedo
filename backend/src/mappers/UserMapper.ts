import { User } from '../models/UserModel';
import { UserDto, AuthResponseDto } from '../dtos/auth.dto';

export class UserMapper {
  public static toDto(user: User): UserDto {
    return {
      id: user._id?.toString() || user.id || '',
      name: user.name,
      email: user.email,
    };
  }

  public static toAuthResponseDto(user: User, token: string): AuthResponseDto {
    return {
      user: this.toDto(user),
      token,
    };
  }
}
