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

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch(`${API_BASE}/leaderboard/`);
        if (!response.ok) {
          throw new Error(`Failed to load leaderboard (${response.status})`);
        }

        const payload = await response.json();
        setEntries(normalizeRecords(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load leaderboard.');
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <div className="card p-4">
      <h2 className="h3 mb-4">Leaderboard</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Points</th>
              <th>Streak</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted text-center py-4">
                  No leaderboard entries available.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id || `${entry.rank}-${entry.team}`}>
                  <td>#{entry.rank ?? '—'}</td>
                  <td>{entry.team ?? '—'}</td>
                  <td>{entry.totalPoints ?? 0}</td>
                  <td>{entry.streak ?? 0} days</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
