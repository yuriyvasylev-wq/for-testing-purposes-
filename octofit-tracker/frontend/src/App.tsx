import { useEffect, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import './App.css';

type ActivityRecord = {
  _id?: string;
  user?: string;
  type?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
  date?: string;
};

type LeaderboardEntry = {
  _id?: string;
  user?: string;
  team?: string;
  totalPoints?: number;
  rank?: number;
  streak?: number;
};

type TeamRecord = {
  _id?: string;
  name?: string;
  description?: string;
  members?: string[];
  captain?: string;
  points?: number;
};

type UserRecord = {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  team?: string;
  fitnessGoal?: string;
};

type WorkoutRecord = {
  _id?: string;
  title?: string;
  category?: string;
  durationMinutes?: number;
  difficulty?: string;
  exercises?: string[];
};

const fallbackStats = [
  { label: 'Active students', value: '1,284', trend: '+18% this month' },
  { label: 'Workout streaks', value: '742', trend: '92% consistency' },
  { label: 'Team points', value: '38,420', trend: 'Top team: Rocket Runners' },
  { label: 'Challenges won', value: '96', trend: '12 scheduled this week' },
];

const fallbackActivities = [
  { student: 'Ava Chen', activity: '5K run', time: '32 min', points: 210 },
  { student: 'Marcus Lee', activity: 'Strength circuit', time: '48 min', points: 180 },
  { student: 'Priya Nair', activity: 'Cycling interval', time: '41 min', points: 195 },
  { student: 'Daniel Ortiz', activity: 'Mobility session', time: '25 min', points: 140 },
];

const fallbackLeaderboard = [
  { name: 'Ava Chen', team: 'Rocket Runners', score: 1260 },
  { name: 'Priya Nair', team: 'Rocket Runners', score: 1190 },
  { name: 'Marcus Lee', team: 'Rocket Runners', score: 1105 },
  { name: 'Daniel Ortiz', team: 'Mountain Milers', score: 990 },
];

const fallbackTeams = [
  {
    name: 'Rocket Runners',
    description: 'Endurance-focused team for speed and stamina challenges.',
    members: ['Ava', 'Marcus', 'Priya'],
    points: 980,
  },
  {
    name: 'Mountain Milers',
    description: 'Strength and resilience crew with weekly recovery plans.',
    members: ['Daniel', 'Kira', 'Noah'],
    points: 870,
  },
  {
    name: 'Blue Wave Crew',
    description: 'Cross-training group balancing cardio, mobility, and agility.',
    members: ['Leah', 'Ethan', 'Sofia'],
    points: 840,
  },
];

const fallbackWorkouts = [
  {
    title: 'Boost endurance',
    category: 'Cardio',
    duration: '30 min',
    description: 'Ride intervals with a 2-minute push followed by 3 minutes easy pace.',
  },
  {
    title: 'Strength reset',
    category: 'Power',
    duration: '40 min',
    description: 'Three rounds of squats, lunges, rows, and wall sits with active recovery.',
  },
  {
    title: 'Mobility flow',
    category: 'Recovery',
    duration: '20 min',
    description: 'Hip openers, hamstring stretches, and posture resets for recovery day.',
  },
];

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }
  return response.json() as Promise<T>;
}

function StatCard({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="col-md-3 mb-4">
      <div className="card stat-card h-100">
        <div className="card-body">
          <div className="text-muted small fw-semibold text-uppercase">{label}</div>
          <div className="display-6 fw-bold mt-2">{value}</div>
          <div className="text-success small mt-2">{trend}</div>
        </div>
      </div>
    </div>
  );
}

function OverviewPage() {
  const [activities, setActivities] = useState(fallbackActivities);
  const [stats] = useState(fallbackStats);

  useEffect(() => {
    async function loadData() {
      try {
        const activityData = await fetchJson<ActivityRecord[]>('/api/activities');
        const userData = await fetchJson<UserRecord[]>('/api/users');
        if (Array.isArray(activityData) && activityData.length > 0) {
          const mapped = activityData.slice(0, 4).map((item, index) => ({
            student: userData[index]?.name ?? `Student ${index + 1}`,
            activity: item.type ?? 'Workout',
            time: `${item.durationMinutes ?? 30} min`,
            points: (item.caloriesBurned ?? 150) / 2,
          }));
          setActivities(mapped);
        }
      } catch {
        setActivities(fallbackActivities);
      }
    }

    void loadData();
  }, []);

  return (
    <>
      <section className="hero-panel mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <p className="eyebrow mb-2">Mergington High School</p>
            <h1 className="display-5 fw-bold mb-3">Get moving and keep the healthy competition alive.</h1>
            <p className="lead text-secondary mb-4">
              OctoFit Tracker helps students log activity, build streaks, and stay motivated with team challenges and personalized workouts.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary btn-lg px-4">Log activity</button>
              <button type="button" className="btn btn-outline-dark btn-lg px-4">View leaderboard</button>
            </div>
          </div>
          <div className="col-lg-5 text-center">
            <img src="/octofitapp-small.png" alt="Octofit Tracker logo" className="hero-logo" />
          </div>
        </div>
      </section>

      <section className="row g-3 mb-4">
        {stats.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      <section className="row g-4">
        <div className="col-lg-7">
          <div className="card h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-4 px-4">
              <h2 className="h4 mb-0">Recent activity</h2>
              <span className="badge bg-success">Live</span>
            </div>
            <div className="card-body p-4">
              <div className="list-group list-group-flush">
                {activities.map((item) => (
                  <div key={`${item.student}-${item.activity}`} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{item.student}</div>
                      <div className="text-secondary small">{item.activity}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{item.points} pts</div>
                      <div className="text-secondary small">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card h-100">
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h2 className="h4 mb-0">Coach notes</h2>
            </div>
            <div className="card-body p-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">
                  <strong>Focus:</strong> Recovery days are trending up, especially after mobility sessions.
                </li>
                <li className="list-group-item px-0">
                  <strong>Challenge:</strong> Three students are within 75 points of first place.
                </li>
                <li className="list-group-item px-0">
                  <strong>Reminder:</strong> Encourage students to log at least one activity before Friday.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ActivitiesPage() {
  const [activities, setActivities] = useState(fallbackActivities);

  useEffect(() => {
    async function loadData() {
      try {
        const activityData = await fetchJson<ActivityRecord[]>('/api/activities');
        const userData = await fetchJson<UserRecord[]>('/api/users');
        if (Array.isArray(activityData) && activityData.length > 0) {
          const mapped = activityData.slice(0, 6).map((item, index) => ({
            student: userData[index]?.name ?? `Student ${index + 1}`,
            activity: item.type ?? 'Workout',
            time: `${item.durationMinutes ?? 30} min`,
            points: (item.caloriesBurned ?? 150) / 2,
          }));
          setActivities(mapped);
        }
      } catch {
        setActivities(fallbackActivities);
      }
    }

    void loadData();
  }, []);

  return (
    <div className="card p-4">
      <h2 className="h3 mb-4">Activity logging</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr key={`${item.student}-${item.activity}`}>
                <td>{item.student}</td>
                <td>{item.activity}</td>
                <td>{item.time}</td>
                <td>{item.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamsPage() {
  const [teams, setTeams] = useState(fallbackTeams);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchJson<TeamRecord[]>('/api/teams');
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((team) => ({
            name: team.name ?? 'Unknown team',
            description: team.description ?? 'Team training group',
            members: team.members?.length ? team.members.map((member) => member.slice(0, 8)) : ['Open roster'],
            points: team.points ?? 0,
          }));
          setTeams(mapped);
        }
      } catch {
        setTeams(fallbackTeams);
      }
    }

    void loadData();
  }, []);

  return (
    <div className="row g-4">
      {teams.map((team) => (
        <div className="col-lg-4" key={team.name}>
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0">{team.name}</h3>
                <span className="badge bg-primary">{team.points} pts</span>
              </div>
              <p className="text-secondary">{team.description}</p>
              <div className="mt-3">
                <div className="small text-muted mb-2">Members</div>
                <div className="d-flex flex-wrap gap-2">
                  {team.members.map((member) => (
                    <span key={`${team.name}-${member}`} className="badge rounded-pill bg-light text-dark border">
                      {member}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState(fallbackLeaderboard);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchJson<LeaderboardEntry[]>('/api/leaderboard');
        const userData = await fetchJson<UserRecord[]>('/api/users');
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 4).map((entry, index) => ({
            name: userData[index]?.name ?? `Student ${index + 1}`,
            team: 'Rocket Runners',
            score: entry.totalPoints ?? 0,
          }));
          setLeaderboard(mapped);
        }
      } catch {
        setLeaderboard(fallbackLeaderboard);
      }
    }

    void loadData();
  }, []);

  return (
    <div className="card p-4">
      <h2 className="h3 mb-4">Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Student</th>
              <th>Team</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={`${entry.name}-${index}`}>
                <td>#{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.team}</td>
                <td className="fw-bold">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function WorkoutsPage() {
  const [workouts, setWorkouts] = useState(fallbackWorkouts);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchJson<WorkoutRecord[]>('/api/workouts');
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 3).map((workout) => ({
            title: workout.title ?? 'Workout plan',
            category: workout.category ?? 'Cardio',
            duration: `${workout.durationMinutes ?? 30} min`,
            description: workout.exercises?.join(', ') ?? 'Suggested session for the next training block.',
          }));
          setWorkouts(mapped);
        }
      } catch {
        setWorkouts(fallbackWorkouts);
      }
    }

    void loadData();
  }, []);

  return (
    <div className="row g-4">
      {workouts.map((workout) => (
        <div className="col-md-4" key={workout.title}>
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="h5 mb-0">{workout.title}</h3>
                <span className="badge bg-warning text-dark">{workout.category}</span>
              </div>
              <div className="text-muted small mb-3">{workout.duration}</div>
              <p className="mb-0 text-secondary">{workout.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const navClass = ({ isActive }: { isActive: boolean }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 px-lg-4">
        <div className="container-fluid px-0">
          <div className="d-flex align-items-center gap-3">
            <img src="/octofitapp-small.png" alt="Octofit" className="nav-logo" />
            <span className="navbar-brand mb-0 h1 fs-4">OctoFit Tracker</span>
          </div>
          <div className="navbar-nav ms-auto flex-row gap-3">
            <NavLink className={navClass} to="/">Overview</NavLink>
            <NavLink className={navClass} to="/activities">Activities</NavLink>
            <NavLink className={navClass} to="/teams">Teams</NavLink>
            <NavLink className={navClass} to="/leaderboard">Leaderboard</NavLink>
            <NavLink className={navClass} to="/workouts">Workouts</NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
