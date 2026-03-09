import { useEffect, useState } from 'react';
import { studentApi, incidenciaApi } from '../api';
import { Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ students: 0, incidents: 0, recent: [] });

    useEffect(() => {
        // Basic stats gathering
        const fetchData = async () => {
            try {
                const [students, incidents] = await Promise.all([
                    studentApi.getAll(),
                    incidenciaApi.getAll()
                ]);
                setStats({
                    students: students.data.length,
                    incidents: incidents.data.length,
                    recent: incidents.data.slice(-5).reverse()
                });
            } catch (err) {
                console.error('API Error:', err);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 className="text-gradient">Panel de Control</h1>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <div className="glass-card">
                    <Users size={32} color="var(--primary)" />
                    <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{stats.students}</h2>
                    <p className="text-muted">Estudiantes Registrados</p>
                </div>
                <div className="glass-card">
                    <AlertTriangle size={32} color="var(--danger)" />
                    <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{stats.incidents}</h2>
                    <p className="text-muted">Total de Incidencias</p>
                </div>
                <div className="glass-card">
                    <CheckCircle size={32} color="var(--success)" />
                    <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{Math.max(0, stats.students - 5)}</h2>
                    <p className="text-muted">Compromisos Pendientes</p>
                </div>
            </div>

            <div className="glass-card" style={{ marginTop: '2rem' }}>
                <h3>Incidencias Recientes</h3>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estudiante ID</th>
                                <th>Fecha</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recent.map(inc => (
                                <tr key={inc.id}>
                                    <td>#{inc.id}</td>
                                    <td>{inc.student_id}</td>
                                    <td>{new Date(inc.date).toLocaleDateString()}</td>
                                    <td>{inc.description ? inc.description.substring(0, 50) + '...' : 'Sin descripción'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
