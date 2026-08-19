import mongoose, { Schema } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: 'member' | 'captain' | 'coach';
  team?: mongoose.Types.ObjectId;
  fitnessGoal: string;
  profilePhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['member', 'captain', 'coach'], default: 'member' },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    fitnessGoal: { type: String, default: 'Stay active and improve endurance' },
    profilePhoto: { type: String, default: '' },
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
