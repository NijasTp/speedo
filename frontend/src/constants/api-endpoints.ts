export const ApiEndpoints = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_ME: '/auth/me',
  TRIPS: '/trips',
  UPLOAD: '/trips/upload',
  TRIP_BY_ID: (id: string) => `/trips/${id}`,
} as const;
