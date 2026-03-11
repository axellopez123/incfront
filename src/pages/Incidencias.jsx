import { useEffect, useState } from 'react';
import { incidenciaApi, studentApi } from '../api';
import { FilePlus, Edit3, Trash2, Search, Filter, Download, Eye } from 'lucide-react';
import { downloadBlob } from '../utils/downloadFile';
import IncidenciaVisualizer from '../components/IncidenciaVisualizer';

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
    const [selectedIncidencia, setSelectedIncidencia] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

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
            if (isEditing) {
                await incidenciaApi.update(editId, formData);
            } else {
                await incidenciaApi.create(formData);
            }
            setIsFormOpen(false);
            resetForm();
            fetchIncidencias();
        } catch (err) { console.error(err); }
    };

    const resetForm = () => {
        setFormData({
            student_id: '',
            date: new Date().toISOString().substring(0, 16),
            leve_faction: [], leve_other: '',
            grave_faction: [], grave_other: '',
            muy_grave_faction: [], muy_grave_other: '',
            description: '', disciplinary: '', acuerdos_compromisos: ''
        });
        setIsEditing(false);
        setEditId(null);
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

    const handlePreview = (inc) => {
        setSelectedIncidencia(inc);
        setIsPreviewOpen(true);
    };

    const handleEdit = (inc) => {
        setFormData({
            student_id: inc.student_id,
            date: inc.date.substring(0, 16),
            leve_faction: inc.leve_faction || [],
            leve_other: inc.leve_other || '',
            grave_faction: inc.grave_faction || [],
            grave_other: inc.grave_other || '',
            muy_grave_faction: inc.muy_grave_faction || [],
            muy_grave_other: inc.muy_grave_other || '',
            description: inc.description || '',
            disciplinary: inc.disciplinary || '',
            acuerdos_compromisos: inc.acuerdos_compromisos || ''
        });
        setIsEditing(true);
        setEditId(inc.id);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    const FactionSelector = ({ field, label, options }) => (
        <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {options.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', background: formData[field]?.includes(opt) ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', border: `1px solid ${formData[field]?.includes(opt) ? 'var(--primary)' : 'var(--glass-border)'}` }}>
                        <input
                            type="checkbox"
                            checked={formData[field]?.includes(opt)}
                            onChange={() => handleCheckboxChange(field, opt)}
                            style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="text-gradient">Gestión de Incidencias</h1>
                <button className="btn btn-primary" onClick={() => {
                    if (isFormOpen && !isEditing) setIsFormOpen(false);
                    else {
                        resetForm();
                        setIsFormOpen(true);
                    }
                }}>
                    <FilePlus size={20} /> {isFormOpen && !isEditing ? 'Cerrar Formulario' : 'Nueva Incidencia'}
                </button>
            </div>

            {isFormOpen && (
                <div className="glass-card" style={{ marginBottom: '2rem', animation: 'slideIn 0.3s ease-out' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>
                        {isEditing ? `Editando Incidencia #${editId}` : 'Registro de Nueva Incidencia'}
                    </h2>
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
                            <h4 className="badge-low" style={{ marginBottom: '1rem', padding: '0.4rem' }}>Falta Leve (Art. 13)</h4>
                            <FactionSelector field="leve_faction" label="Fracciones" options={['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']} />
                            <input type="text" placeholder="Otros Detalles" className="input-field" value={formData.leve_other} onChange={(e) => setFormData({ ...formData, leve_other: e.target.value })} />
                        </div>

                        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                            <h4 className="badge-mid" style={{ marginBottom: '1rem', padding: '0.4rem' }}>Falta Grave (Art. 14)</h4>
                            <FactionSelector field="grave_faction" label="Fracciones" options={['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']} />
                            <input type="text" placeholder="Otros Detalles" className="input-field" value={formData.grave_other} onChange={(e) => setFormData({ ...formData, grave_other: e.target.value })} />
                        </div>

                        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <h4 className="badge-high" style={{ marginBottom: '1rem', padding: '0.4rem' }}>Falta Muy Grave (Art. 15)</h4>
                            <FactionSelector field="muy_grave_faction" label="Fracciones" options={['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']} />
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
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                {isEditing ? 'Actualizar Incidencia' : 'Guardar Incidencia'}
                            </button>
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
                                                <button onClick={() => handlePreview(inc)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', color: 'var(--success)' }} title="Visualizar Formato">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleEdit(inc)} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', color: 'var(--accent)' }} title="Editar">
                                                    <Edit3 size={16} />
                                                </button>
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

            {isPreviewOpen && (
                <IncidenciaVisualizer
                    incidencia={selectedIncidencia}
                    student={students.find(s => s.id === selectedIncidencia?.student_id)}
                    onClose={() => setIsPreviewOpen(false)}
                    onDownload={handleDownload}
                />
            )}
        </div>
    );
};

export default Incidencias;
