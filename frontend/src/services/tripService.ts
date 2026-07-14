import api from './api';
import { ApiEndpoints } from '../constants/api-endpoints';
import type { Trip } from '../types';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const response = await api.get<Trip[]>(ApiEndpoints.TRIPS);
    return response.data;
  },

  async uploadTrip(formData: FormData): Promise<Trip> {
    const response = await api.post<Trip>(ApiEndpoints.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteTrip(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(ApiEndpoints.TRIP_BY_ID(id));
    return response.data;
  },
};
