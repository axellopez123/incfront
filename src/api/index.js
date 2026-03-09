import axios from 'axios';

const API_BASE_URL = 'https://inc.arwax.pro/'; // Adjust as needed for your FastAPI backend

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Students CRUD
export const studentApi = {
    getAll: () => api.get('/students/'),
    getById: (id) => api.get(`/students/${id}`),
    create: (data) => api.post('/students/', data),
    update: (id, data) => api.put(`/students/${id}`, data),
    delete: (id) => api.delete(`/students/${id}`),
};

// Incidencias CRUD
export const incidenciaApi = {
    getAll: () => api.get('/incidencias/'),
    getById: (id) => api.get(`/incidencias/${id}`),
    getByStudent: (studentId) => api.get(`/students/${studentId}/incidencias`),
    create: (data) => api.post('/incidencias/', data),
    update: (id, data) => api.put(`/incidencias/${id}`, data),
    delete: (id) => api.delete(`/incidencias/${id}`),
    download: (id) => api.get(`/incidencias/${id}/download`, { responseType: 'blob' }),
};

export default api;
