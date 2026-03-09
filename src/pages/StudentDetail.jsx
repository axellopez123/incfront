import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi, incidenciaApi } from '../api';
import { ArrowLeft, User, Phone, BookOpen, AlertCircle, FileText, Download } from 'lucide-react';
import { downloadBlob } from '../utils/downloadFile';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [incidencias, setIncidencias] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFullData = async () => {
            try {
                const [studentRes, incidenciasRes] = await Promise.all([
                    studentApi.getById(id),
                    incidenciaApi.getByStudent(id)
                ]);
                setStudent(studentRes.data);
                setIncidencias(incidenciasRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFullData();
    }, [id]);

    const handleDownload = async (incId) => {
        try {
            const response = await incidenciaApi.download(incId);
            downloadBlob(response.data, `Reporte_${student.name}_${incId}.docx`);
        } catch (err) {
            console.error('Download error:', err);
            alert('Error al descargar el reporte');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando Estudiante...</div>;
    if (!student) return <div style={{ textAlign: 'center', padding: '4rem' }}>Estudiante no encontrado.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/students')} style={{ marginBottom: '2rem' }}>
                <ArrowLeft size={18} /> Volver al Listado
            </button>

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                {/* Info Card */}
                <div className="glass-card" style={{ height: 'fit-content' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={40} color="white" />
                        </div>
                        <h2 className="text-gradient" style={{ marginBottom: '0.2rem' }}>{student.name}</h2>
                        <p className="text-muted">ID: #{student.id}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <BookOpen size={18} color="var(--primary)" />
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Grado / Grupo</p>
                                <p>{student.grade || 'N/A'} - {student.group || 'N/A'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <AlertCircle size={18} color="var(--danger)" />
                            <div>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>Total Incidencias</p>
                                <p>{incidencias.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Incidencias Card */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={24} color="var(--primary)" /> Historial de Incidencias
                    </h3>
                    {incidencias.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--glass-border)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
                            No hay incidencias registradas para este estudiante.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {incidencias.map(inc => {
                                const level = inc.muy_grave_faction ? 'Muy Grave' : (inc.grave_faction ? 'Grave' : 'Leve');
                                const badgeClass = level === 'Muy Grave' ? 'badge-high' : (level === 'Grave' ? 'badge-mid' : 'badge-low');
                                return (
                                    <div key={inc.id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span className={`badge ${badgeClass}`}>{level}</span>
                                                <button
                                                    onClick={() => handleDownload(inc.id)}
                                                    className="btn-secondary"
                                                    style={{ padding: '0.3rem', border: 'none', background: 'none' }}
                                                    title="Descargar Reporte Word"
                                                >
                                                    <Download size={14} color="var(--primary)" />
                                                </button>
                                            </div>
                                            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{new Date(inc.date).toLocaleDateString()}</span>
                                        </div>
                                        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{inc.description || 'Sin descripción'}</p>
                                        {inc.disciplinary && (
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Medida:</span> {inc.disciplinary}
                                            </p>
                                        )}
                                        {inc.acuerdos_compromisos && (
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                <span style={{ color: 'var(--success)', fontWeight: '600' }}>Compromiso:</span> {inc.acuerdos_compromisos}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;
