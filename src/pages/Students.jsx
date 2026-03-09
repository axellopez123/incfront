import { useEffect, useState } from 'react';
import { studentApi } from '../api';
import { UserPlus, Trash2, Edit2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Students = () => {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({ name: '', grade: '', group: '' });
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchStudents(); }, []);

    const fetchStudents = async () => {
        try {
            const res = await studentApi.getAll();
            setStudents(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await studentApi.update(editingId, formData);
                setEditingId(null);
            } else {
                await studentApi.create(formData);
            }
            setFormData({ name: '', grade: '', group: '' });
            fetchStudents();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Seguro que quieres eliminar este estudiante?')) {
            try {
                await studentApi.delete(id);
                fetchStudents();
            } catch (err) { console.error(err); }
        }
    };

    const handleEdit = (student) => {
        setEditingId(student.id);
        setFormData({ name: student.name, grade: student.grade || '', group: student.group || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filtered = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
            {/* Student Form Section */}
            <div className="glass-card" style={{ height: 'fit-content' }}>
                <h2 className="text-gradient"><UserPlus size={24} /> {editingId ? 'Editar' : 'Añadir'} Estudiante</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Nombre Completo</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Grado</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-muted" style={{ display: 'block', marginBottom: '0.4rem' }}>Grupo</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {editingId ? 'Actualizar' : 'Guardar Estudiante'}
                    </button>
                    {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', grade: '', group: '' }); }}>Cancelar</button>}
                </form>
            </div>

            {/* Student List Section */}
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className="text-gradient">Listado de Estudiantes</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="input-field"
                            style={{ width: '200px', paddingLeft: '2.5rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Grado/Grupo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(s => (
                                <tr key={s.id}>
                                    <td>
                                        <Link to={`/students/${s.id}`} style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                                            {s.name}
                                        </Link>
                                    </td>
                                    <td>{s.grade || '-'}/{s.group || '-'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.8rem' }}>
                                            <button onClick={() => handleEdit(s)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '0.3rem', border: 'none', cursor: 'pointer' }}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(s.id)} className="btn-secondary" style={{ padding: '0.4rem', borderRadius: '0.3rem', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Students;
