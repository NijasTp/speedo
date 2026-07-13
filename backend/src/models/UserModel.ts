import mongoose, { Schema } from 'mongoose';

export interface User {
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

// Map standard MongoDB _id to string id in application layer
UserSchema.set('toJSON', {
  transform: (doc, ret: any) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const UserModel = mongoose.model<User>('User', UserSchema);
