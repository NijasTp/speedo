import mongoose from 'mongoose';
import { logger } from '../logger/logger.js';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/speedo';
  try {
    await mongoose.connect(uri);
    logger.info('Successfully connected to MongoDB database.');
  } catch (error) {
    logger.error('Error connecting to MongoDB: %o', error);
    process.exit(1);
  }
}
