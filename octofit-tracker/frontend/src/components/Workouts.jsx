import { useEffect, useState } from 'react';

const API_BASE = (() => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
})();

function normalizeRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const response = await fetch(`${API_BASE}/workouts/`);
        if (!response.ok) {
          throw new Error(`Failed to load workouts (${response.status})`);
        }

        const payload = await response.json();
        setWorkouts(normalizeRecords(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load workouts.');
      }
    }

    loadWorkouts();
  }, []);

  return (
    <div className="row g-4">
      {error ? <div className="col-12"><div className="alert alert-danger">{error}</div></div> : null}
      {workouts.length === 0 ? (
        <div className="col-12 text-muted text-center py-4">No workouts available.</div>
      ) : (
        workouts.map((workout) => (
          <div className="col-md-4" key={workout._id || workout.title}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="h5 mb-0">{workout.title || 'Workout plan'}</h3>
                  <span className="badge bg-warning text-dark">{workout.category || 'Training'}</span>
                </div>
                <div className="text-muted small mb-3">{workout.durationMinutes ?? 30} min</div>
                <p className="mb-0 text-secondary">
                  {(workout.exercises || []).length > 0
                    ? workout.exercises.join(', ')
                    : 'Suggested training session for this week.'}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
