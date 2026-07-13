import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { UserModel } from './models/UserModel';
import { MongoTripRepository } from './repositories/MongoTripRepository';
import { TripService } from './services/TripService';
import { SpeedCalculationService } from './services/SpeedCalculationService';
import { parseCsvBuffer } from './utils/CsvParser';

async function upload() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/speedo';
  await mongoose.connect(uri);
  console.log('Connected to DB');

  // Find user john2@example.com
  const user = await UserModel.findOne({ email: 'john2@example.com' });
  if (!user) {
    console.error('User john2@example.com not found!');
    process.exit(1);
  }
  console.log('Found user:', user.name, 'ID:', user._id);

  // Read CSV
  const csvPath = path.resolve('../mock_trip.csv');
  const buffer = fs.readFileSync(csvPath);
  const rawPoints = await parseCsvBuffer(buffer);
  console.log('Parsed raw points:', rawPoints.length);

  // Initialize service & repository
  const tripRepo = new MongoTripRepository();
  const calcService = new SpeedCalculationService();
  const tripService = new TripService(tripRepo, calcService);

  // Create trip
  const trip = await tripService.createTrip(user._id.toString(), 'Mock Route test', rawPoints);
  console.log('Successfully created trip in DB!', trip.id, 'summary:', trip.summary);

  await mongoose.disconnect();
}

upload().catch(err => console.error(err));
