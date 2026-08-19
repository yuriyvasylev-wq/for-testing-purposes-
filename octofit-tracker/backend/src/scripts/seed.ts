import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Ava Chen',
        email: 'ava.chen@example.com',
        username: 'ava-runner',
        password: 'password123',
        role: 'captain',
        fitnessGoal: 'Build endurance for 10K races',
      },
      {
        name: 'Marcus Lee',
        email: 'marcus.lee@example.com',
        username: 'marcus-strong',
        password: 'password123',
        role: 'member',
        fitnessGoal: 'Increase strength and mobility',
      },
      {
        name: 'Priya Nair',
        email: 'priya.nair@example.com',
        username: 'priya-pulse',
        password: 'password123',
        role: 'member',
        fitnessGoal: 'Train for a half marathon',
      },
      {
        name: 'Daniel Ortiz',
        email: 'daniel.ortiz@example.com',
        username: 'daniel-cycle',
        password: 'password123',
        role: 'coach',
        fitnessGoal: 'Improve cycling performance',
      },
    ]);

    const rocketRunners = await Team.create({
      name: 'Rocket Runners',
      description: 'A high-energy endurance crew for weekly challenges.',
      members: [users[0]._id, users[1]._id, users[2]._id],
      captain: users[0]._id,
      points: 980,
    });

    const mountainMilers = await Team.create({
      name: 'Mountain Milers',
      description: 'Strength and speed-focused training group.',
      members: [users[3]._id],
      captain: users[3]._id,
      points: 870,
    });

    await User.updateMany({}, { $set: { team: rocketRunners._id } });
    await User.findByIdAndUpdate(users[3]._id, { team: mountainMilers._id });

    await Activity.insertMany([
      {
        user: users[0]._id,
        type: 'run',
        durationMinutes: 42,
        distanceKm: 7.5,
        caloriesBurned: 420,
        notes: 'Tempo run with hill intervals',
        date: new Date('2026-08-15T06:30:00Z'),
      },
      {
        user: users[1]._id,
        type: 'workout',
        durationMinutes: 50,
        caloriesBurned: 370,
        notes: 'Upper-body and core circuit',
        date: new Date('2026-08-14T18:00:00Z'),
      },
      {
        user: users[2]._id,
        type: 'cycling',
        durationMinutes: 35,
        distanceKm: 18,
        caloriesBurned: 480,
        notes: 'Steady-state endurance ride',
        date: new Date('2026-08-16T07:00:00Z'),
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        user: users[0]._id,
        team: rocketRunners._id,
        totalPoints: 1260,
        rank: 1,
        streak: 8,
      },
      {
        user: users[2]._id,
        team: rocketRunners._id,
        totalPoints: 1190,
        rank: 2,
        streak: 6,
      },
      {
        user: users[1]._id,
        team: rocketRunners._id,
        totalPoints: 1105,
        rank: 3,
        streak: 5,
      },
      {
        user: users[3]._id,
        team: mountainMilers._id,
        totalPoints: 990,
        rank: 4,
        streak: 4,
      },
    ]);

    await Workout.insertMany([
      {
        user: users[0]._id,
        title: 'Intervals for speed',
        category: 'cardio',
        durationMinutes: 30,
        difficulty: 'intermediate',
        exercises: ['Sprint intervals', 'Recovery jogs', 'Cooldown walk'],
        scheduledFor: new Date('2026-08-21T06:00:00Z'),
      },
      {
        user: users[1]._id,
        title: 'Full-body strength',
        category: 'strength',
        durationMinutes: 45,
        difficulty: 'beginner',
        exercises: ['Squats', 'Push-ups', 'Rows', 'Planks'],
        scheduledFor: new Date('2026-08-22T18:30:00Z'),
      },
      {
        user: users[2]._id,
        title: 'Mobility reset',
        category: 'mobility',
        durationMinutes: 20,
        difficulty: 'beginner',
        exercises: ['Hip openers', 'Hamstring stretch', 'Thoracic twists'],
        scheduledFor: new Date('2026-08-20T17:00:00Z'),
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
