import { ITripRepository } from '../interfaces/ITripRepository';
import { Trip, TripModel } from '../models/TripModel';

export class MongoTripRepository implements ITripRepository {
  public async create(trip: Trip): Promise<Trip> {
    const doc = new TripModel(trip);
    const saved = await doc.save();
    return saved.toJSON() as Trip;
  }

  public async findByUserId(userId: string): Promise<Trip[]> {
    const docs = await TripModel.find({ userId }).sort({ uploadDate: -1 }).exec();
    return docs.map(doc => doc.toJSON() as Trip);
  }

  public async findById(id: string): Promise<Trip | null> {
    const doc = await TripModel.findById(id).exec();
    return doc ? (doc.toJSON() as Trip) : null;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await TripModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
