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

export default function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(`${API_BASE}/users/`);
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`);
        }

        const payload = await response.json();
        setUsers(normalizeRecords(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load users.');
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="card p-4">
      <h2 className="h3 mb-4">Users</h2>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted text-center py-4">
                  No users available.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id || user.email || user.username}>
                  <td>{user.name || 'Unknown user'}</td>
                  <td>{user.username || '—'}</td>
                  <td>{user.role || 'member'}</td>
                  <td>{user.fitnessGoal || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
