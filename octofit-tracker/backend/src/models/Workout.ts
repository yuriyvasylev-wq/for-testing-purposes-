import mongoose, { Schema } from 'mongoose';

export interface IWorkout {
  user: mongoose.Types.ObjectId;
  title: string;
  category: 'strength' | 'cardio' | 'mobility' | 'recovery';
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: string[];
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: ['strength', 'cardio', 'mobility', 'recovery'], required: true },
    durationMinutes: { type: Number, required: true, min: 10 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    exercises: [{ type: String, trim: true }],
    scheduledFor: { type: Date },
  },
  { timestamps: true },
);

export const Workout = mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
