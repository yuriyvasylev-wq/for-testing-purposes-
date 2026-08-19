import express, { type Request, type Response } from 'express';
import { connectDatabase } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

export const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

function registerCrudRoutes(modelName: string, model: any, routeName: string) {
  app.get(`/api/${routeName}`, async (_request: Request, response: Response) => {
    try {
      const records = await model.find().sort({ createdAt: -1 });
      response.json(records);
    } catch (error) {
      response.status(500).json({
        error: `Failed to fetch ${modelName}s`,
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.get(`/api/${routeName}/:id`, async (request: Request, response: Response) => {
    try {
      const record = await model.findById(request.params.id);

      if (!record) {
        response.status(404).json({ error: `${modelName} not found` });
        return;
      }

      response.json(record);
    } catch (error) {
      response.status(400).json({
        error: `Invalid ${modelName} id`,
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.post(`/api/${routeName}`, async (request: Request, response: Response) => {
    try {
      const record = await model.create(request.body);
      response.status(201).json(record);
    } catch (error) {
      response.status(400).json({
        error: `Failed to create ${modelName}`,
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.put(`/api/${routeName}/:id`, async (request: Request, response: Response) => {
    try {
      const record = await model.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
      });

      if (!record) {
        response.status(404).json({ error: `${modelName} not found` });
        return;
      }

      response.json(record);
    } catch (error) {
      response.status(400).json({
        error: `Failed to update ${modelName}`,
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  app.delete(`/api/${routeName}/:id`, async (request: Request, response: Response) => {
    try {
      const deletedRecord = await model.findByIdAndDelete(request.params.id);

      if (!deletedRecord) {
        response.status(404).json({ error: `${modelName} not found` });
        return;
      }

      response.json({ message: `${modelName} deleted`, id: request.params.id });
    } catch (error) {
      response.status(400).json({
        error: `Failed to delete ${modelName}`,
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

app.get('/api', (_request: Request, response: Response) => {
  response.json({
    name: 'Octofit Tracker API',
    baseUrl,
    routes: ['/api/health', '/api/users', '/api/teams', '/api/activities', '/api/leaderboard', '/api/workouts'],
  });
});

app.get('/api/health', (_request: Request, response: Response) => {
  response.json({ status: 'ok', baseUrl });
});

registerCrudRoutes('user', User, 'users');
registerCrudRoutes('team', Team, 'teams');
registerCrudRoutes('activity', Activity, 'activities');
registerCrudRoutes('leaderboard', LeaderboardEntry, 'leaderboard');
registerCrudRoutes('workout', Workout, 'workouts');

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`OctoFit backend listening on port ${port}`);
    console.log(`API base URL: ${baseUrl}`);
  });
}

if (require.main === module) {
  void startServer();
}

export default app;
