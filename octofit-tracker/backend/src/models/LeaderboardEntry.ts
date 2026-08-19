import mongoose, { Schema } from 'mongoose';

export interface ILeaderboardEntry {
  user: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
  totalPoints: number;
  rank: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    totalPoints: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, default: 1 },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const LeaderboardEntry =
  mongoose.models.LeaderboardEntry || mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardEntrySchema);
