import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, Users, FileText, PlusCircle, LayoutDashboard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Incidencias from './pages/Incidencias';
import StudentDetail from './pages/StudentDetail';
import './App.css';

const Navigation = () => (
  <nav className="glass-card" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
    <Link to="/" className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
      IncidentManager
    </Link>
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Link to="/" className="btn btn-secondary" style={{ border: 'none' }}>
        <LayoutDashboard size={20} /> Dashboard
      </Link>
      <Link to="/students" className="btn btn-secondary" style={{ border: 'none' }}>
        <Users size={20} /> Estudiantes
      </Link>
      <Link to="/incidencias" className="btn btn-secondary" style={{ border: 'none' }}>
        <FileText size={20} /> Incidencias
      </Link>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/students/:id" element={<StudentDetail />} />
            <Route path="/incidencias" element={<Incidencias />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
