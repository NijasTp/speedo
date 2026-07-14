export const AuthMessages = {
  REGISTRATION_FAILED: 'Registration failed.',
  LOGIN_FAILED: 'Login failed.',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Unauthorized.',
  NOT_AUTHENTICATED: 'Not authenticated.',
  ACCESS_DENIED_NO_TOKEN: 'Access denied. No token provided.',
  INVALID_EXPIRED_TOKEN: 'Invalid or expired token.',
  AUTHENTICATION_INTERNAL_ERROR: 'Authentication internal error.',
  REGISTER_SUCCESS: 'Registration successful.',
  LOGIN_SUCCESS: 'Login successful.',
  VALIDATION_FAILED: 'Validation failed.',
  NAME_EMAIL_PASSWORD_REQUIRED: 'Name, email, and password are required.',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required.',
};

export const TripMessages = {
  GPS_DATA_EMPTY: 'GPS data cannot be empty.',
  NO_VALID_POINTS: 'No valid GPS points found in CSV.',
  TRIP_NOT_FOUND: 'Trip not found.',
  TRIP_NOT_FOUND_OR_UNAUTHORIZED: 'Trip not found or unauthorized.',
  TRIP_DELETED: 'Trip deleted successfully.',
  CSV_REQUIRED: 'CSV file is required.',
  CSV_ONLY_ALLOWED: 'Only CSV files are allowed.',
  FILE_PROCESSING_FAILED: 'File processing failed.',
  FETCH_TRIPS_FAILED: 'Failed to fetch trips.',
  FETCH_TRIP_DETAILS_FAILED: 'Failed to fetch trip details.',
  DELETE_TRIP_FAILED: 'Failed to delete trip.',
};

export const GeneralMessages = {
  INTERNAL_SERVER_ERROR: 'Internal Server Error.',
  SUCCESS: 'Success',
};
