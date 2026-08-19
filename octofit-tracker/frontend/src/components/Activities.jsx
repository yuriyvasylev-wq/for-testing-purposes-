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

function formatActivityLabel(activity) {
  return activity?.type || activity?.name || 'Workout';
}

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch(`${API_BASE}/activities/`);
        if (!response.ok) {
          throw new Error(`Failed to load activities (${response.status})`);
        }

        const payload = await response.json();
        setActivities(normalizeRecords(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load activities.');
      }
    }

    loadActivities();
  }, []);

  return (
    <div className="card p-4">
      <h2 className="h3 mb-4">Activity log</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Type</th>
              <th>Duration</th>
              <th>Calories</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted text-center py-4">
                  No activities available.
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity._id || `${activity.type}-${activity.date}`}>
                  <td>{formatActivityLabel(activity)}</td>
                  <td>{activity.durationMinutes ?? '—'} min</td>
                  <td>{activity.caloriesBurned ?? '—'}</td>
                  <td>{activity.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
