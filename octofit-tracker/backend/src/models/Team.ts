import mongoose, { Schema } from 'mongoose';

export interface ITeam {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  captain?: mongoose.Types.ObjectId;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: 'Community fitness team' },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    captain: { type: Schema.Types.ObjectId, ref: 'User' },
    points: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
