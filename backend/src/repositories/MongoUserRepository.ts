import { IUserRepository } from '../interfaces/IUserRepository.js';
import { User, UserModel } from '../models/UserModel.js';

export class MongoUserRepository implements IUserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? (doc.toJSON() as User) : null;
  }

  public async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? (doc.toJSON() as User) : null;
  }

  public async create(user: User): Promise<User> {
    const doc = new UserModel(user);
    const saved = await doc.save();
    return saved.toJSON() as User;
  }
}
