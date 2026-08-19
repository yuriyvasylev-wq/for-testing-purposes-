import mongoose, { Schema } from 'mongoose';

export interface IActivity {
  user: mongoose.Types.ObjectId;
  type: 'run' | 'workout' | 'cycling' | 'walk' | 'swim';
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['run', 'workout', 'cycling', 'walk', 'swim'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, min: 0 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', activitySchema);
