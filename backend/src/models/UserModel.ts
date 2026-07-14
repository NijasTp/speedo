import mongoose, { Schema } from 'mongoose';

export interface User {
  _id?: mongoose.Types.ObjectId | string;
  id?: string;
  name: string;
  email: string;
  password?: string;
}

const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<User>('User', UserSchema);
