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

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadTeams() {
      try {
        const response = await fetch(`${API_BASE}/teams/`);
        if (!response.ok) {
          throw new Error(`Failed to load teams (${response.status})`);
        }

        const payload = await response.json();
        setTeams(normalizeRecords(payload));
      } catch (loadError) {
        setError(loadError.message || 'Unable to load teams.');
      }
    }

    loadTeams();
  }, []);

  return (
    <div className="row g-4">
      {error ? <div className="col-12"><div className="alert alert-danger">{error}</div></div> : null}
      {teams.length === 0 ? (
        <div className="col-12 text-muted text-center py-4">No teams available.</div>
      ) : (
        teams.map((team) => (
          <div className="col-lg-4" key={team._id || team.name}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0">{team.name || 'Team'}</h3>
                  <span className="badge bg-primary">{team.points ?? 0} pts</span>
                </div>
                <p className="text-secondary">{team.description || 'Training team.'}</p>
                <div className="mt-3">
                  <div className="small text-muted mb-2">Members</div>
                  <div className="d-flex flex-wrap gap-2">
                    {(team.members || []).length === 0 ? (
                      <span className="text-muted">No members listed.</span>
                    ) : (
                      team.members.map((member) => (
                        <span key={`${team._id || team.name}-${member}`} className="badge rounded-pill bg-light text-dark border">
                          {member}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
