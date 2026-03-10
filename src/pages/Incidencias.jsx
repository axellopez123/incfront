import { useEffect, useState } from 'react';
import { incidenciaApi, studentApi } from '../api';
import { FilePlus, Edit3, Trash2, Search, Filter, Download } from 'lucide-react';
import { downloadBlob } from '../utils/downloadFile';

const Incidencias = () => {
    const [incidencias, setIncidencias] = useState([]);
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        student_id: '',
        date: new Date().toISOString().substring(0, 16),
        leve_faction: [], leve_other: '',
        grave_faction: [], grave_other: '',
        muy_grave_faction: [], muy_grave_other: '',
        description: '', disciplinary: '', acuerdos_compromisos: ''
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchIncidencias();
        fetchStudents();
    }, []);

    const fetchIncidencias = async () => {
        try {
            const res = await incidenciaApi.getAll();
            setIncidencias(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchStudents = async () => {
        try {
            const res = await studentApi.getAll();
            setStudents(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await incidenciaApi.create(formData);
            setIsFormOpen(false);
            setFormData({
                student_id: '', date: new Date().toISOString().substring(0, 16),
                leve_faction: [], leve_other: '', grave_faction: [], grave_other: '',
                muy_grave_faction: [], muy_grave_other: '', description: '', disciplinary: '', acuerdos_compromisos: ''
            });
            fetchIncidencias();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Eliminar esta incidencia permanentemente?')) {
            try {
                await incidenciaApi.delete(id);
                fetchIncidencias();
            } catch (err) { console.error(err); }
        }
    };

    const handleDownload = async (id) => {
        try {
            const response = await incidenciaApi.download(id);
            downloadBlob(response.data, `Reporte_Incidencia_${id}.docx`);
        } catch (err) {
            console.error('Download error:', err);
            alert('Error al descargar el reporte');
        }
    };

    const filteredItems = incidencias.filter(i =>
        i.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.student_id.toString().includes(searchTerm)
    );

    const handleCheckboxChange = (field, value) => {
        setFormData(prev => {
            const current = prev[field] || [];
            if (current.includes(value)) {
                return { ...prev, [field]: current.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...current, value] };
            }
        });
    };

    const FactionSelector = ({ field, label, badgeClass }) => (
        <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</p>
            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                {['I', 'II', 'III', 'IV', 'V'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', background: formData[field]?.includes(opt) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: `1px solid ${formData[field]?.includes(opt) ? 'var(--primary)' : 'var(--glass-border)'}` }}>
                        <input
                            type="checkbox"
                            checked={formData[field]?.includes(opt)}
                            onChange={() => handleCheckboxChange(field, opt)}
                            style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-gradient">Gestión de Incidencias</h1>
                <button className="btn btn-primary" onClick={() => setIsFormOpen(!isFormOpen)}>
                    <FilePlus size={20} /> {isFormOpen ? 'Cerrar Formulario' : 'Nueva Incidencia'}
                </button>
            </div>

            {isFormOpen && (
                <div className="glass-card" style={{ marginBottom: '2rem', animation: 'slideIn 0.3s ease-out' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Registro de Nueva Incidencia</h2>
                    <form onSubmit={handleSubmit} className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        <div className="form-group">
                            <label>Seleccionar Estudiante</label>
                            <select
                                className="input-field"
                                value={formData.student_id}
                                onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                                required
                            >
                                <option value="">Seleccione...</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.grade || '-'})</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                className="input-field"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Descripción del Incidente (Hechos)</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Factions Section */}
                        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            <h4 className="badge-low" style={{ marginBottom: '1rem', padding: '0.4rem' }}>Falta Leve</h4>
                            <FactionSelector field="leve_faction" label="Artículos/Fracciones" badgeClass="badge-low" />
                            <input type="text" placeholder="Otros Detalles" className="input-field" value={formData.leve_other} onChange={(e) => setFormData({ ...formData, leve_other: e.target.value })} />
                        </div>

                        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                            <h4 className="badge-mid" style={{ marginBottom: '1rem', padding: '0.4rem' }}>Falta Grave</h4>
                            <FactionSelector field="grave_faction" label="Artículos/Fracciones" badgeClass="badge-mid" />
                            <input type="text" placeholder="Otros Detalles" className="input-field" value={formData.grave_other} onChange={(e) => setFormData({ ...formData, grave_other: e.target.value })} />
                        </div>

                        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <h4 className="badge-high" style={{ marginBottom: '1rem', padding: '0.4rem' }}>Falta Muy Grave</h4>
                            <FactionSelector field="muy_grave_faction" label="Artículos/Fracciones" badgeClass="badge-high" />
                            <input type="text" placeholder="Otros Detalles" className="input-field" value={formData.muy_grave_other} onChange={(e) => setFormData({ ...formData, muy_grave_other: e.target.value })} />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Medida Disciplinaria / Acción tomada</label>
                            <input
                                className="input-field"
                                value={formData.disciplinary}
                                onChange={(e) => setFormData({ ...formData, disciplinary: e.target.value })}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Acuerdos y Compromisos</label>
                            <input
                                className="input-field"
                                value={formData.acuerdos_compromisos}
                                onChange={(e) => setFormData({ ...formData, acuerdos_compromisos: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Guardar Incidencia</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar incidencias..."
                            className="input-field"
                            style={{ paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Estudiante</th>
                                <th>Nivel</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(inc => {
                                const level = (inc.muy_grave_faction && inc.muy_grave_faction.length > 0) ? 'Muy Grave' :
                                    ((inc.grave_faction && inc.grave_faction.length > 0) ? 'Grave' : 'Leve');
                                const badgeClass = level === 'Muy Grave' ? 'badge-high' : (level === 'Grave' ? 'badge-mid' : 'badge-low');
                                return (
                                    <tr key={inc.id}>
                                        <td>{new Date(inc.date).toLocaleDateString()}</td>
                                        <td>Estudiante #{inc.student_id}</td>
                                        <td><span className={`badge ${badgeClass}`}>{level}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleDownload(inc.id)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', color: 'var(--primary)' }} title="Descargar Word">
                                                    <Download size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(inc.id)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', color: 'var(--danger)' }} title="Eliminar">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredItems.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No se encontraron incidencias.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Incidencias;
