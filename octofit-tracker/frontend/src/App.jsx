import { NavLink, Route, Routes } from 'react-router-dom';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 px-lg-4">
        <div className="container-fluid px-0">
          <div className="d-flex align-items-center gap-3">
            <img src="/octofitapp-small.png" alt="Octofit Tracker" className="nav-logo" />
            <span className="navbar-brand mb-0 h1 fs-4">OctoFit Tracker</span>
          </div>
          <div className="navbar-nav ms-auto flex-row gap-3 flex-wrap">
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">Users</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/activities">Activities</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/teams">Teams</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/leaderboard">Leaderboard</NavLink>
            <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/workouts">Workouts</NavLink>
          </div>
        </div>
      </nav>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
