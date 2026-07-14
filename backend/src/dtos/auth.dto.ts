export interface RegisterRequestDto {
  name: string;
  email: string;
  password?: string;
}

export interface LoginRequestDto {
  email: string;
  password?: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
}
