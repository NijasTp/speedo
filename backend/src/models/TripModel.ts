import mongoose, { Schema } from 'mongoose';

export interface GPSPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  ignition: 'on' | 'off';
  speed?: number;
  isOverspeed?: boolean;
}

export interface TripSummary {
  totalDistance: number;
  totalDuration: number;
  stoppageDuration: number;
  idlingDuration: number;
}

export interface StoppagePoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  duration: number;
}

export interface IdlingPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  duration: number;
}

export interface Trip {
  _id?: mongoose.Types.ObjectId | string;
  id?: string;
  userId: string;
  name: string;
  uploadDate: Date;
  summary: TripSummary;
  points: GPSPoint[];
  stoppagePoints: StoppagePoint[];
  idlingPoints: IdlingPoint[];
}

const GPSPointSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  ignition: { type: String, enum: ['on', 'off'], required: true },
  speed: { type: Number },
  isOverspeed: { type: Boolean }
}, { _id: false });

const StoppagePointSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  duration: { type: Number, required: true }
}, { _id: false });

const IdlingPointSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, required: true },
  duration: { type: Number, required: true }
}, { _id: false });

const TripSchema = new Schema<Trip>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  summary: {
    totalDistance: { type: Number, required: true },
    totalDuration: { type: Number, required: true },
    stoppageDuration: { type: Number, required: true },
    idlingDuration: { type: Number, required: true }
  },
  points: [GPSPointSchema],
  stoppagePoints: [StoppagePointSchema],
  idlingPoints: [IdlingPointSchema]
});

export const TripModel = mongoose.model<Trip>('Trip', TripSchema);
