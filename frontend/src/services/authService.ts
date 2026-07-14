import api from './api';
import { ApiEndpoints } from '../constants/api-endpoints';
import type { User } from '../types';

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async getMe(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>(ApiEndpoints.GET_ME);
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ApiEndpoints.LOGIN, { email, password });
    return response.data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ApiEndpoints.REGISTER, { name, email, password });
    return response.data;
  },
};
