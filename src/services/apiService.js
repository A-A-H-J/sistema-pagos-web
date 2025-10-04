import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiService = {
    // API de Usuarios
    usuarios: {
        getAll: () => axios.get(`${API_BASE_URL}/usuarios`),
        getById: (id) => axios.get(`${API_BASE_URL}/usuarios/${id}`),
        create: (data) => axios.post(`${API_BASE_URL}/usuarios`, data),
        update: (id, data) => axios.put(`${API_BASE_URL}/usuarios/${id}`, data),
        suspender: (id) => axios.put(`${API_BASE_URL}/usuarios/suspender/${id}`),
        delete: (id) => axios.delete(`${API_BASE_URL}/usuarios/${id}`),
        updateEmail: (id, newEmail) => axios.put(`${API_BASE_URL}/usuarios/${id}/email`, { newEmail })
    },
    // API de Carteras
    carteras: {
        getAll: () => axios.get(`${API_BASE_URL}/carteras`),
        getById: (id) => axios.get(`${API_BASE_URL}/carteras/${id}`),
        create: (data) => axios.post(`${API_BASE_URL}/carteras`, data),
        update: (id, data) => axios.put(`${API_BASE_URL}/carteras/${id}`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/carteras/${id}`),
        getByUserId: (userId) => axios.get(`${API_BASE_URL}/carteras/usuario/${userId}`),
    },
    // API de Transacciones
    transacciones: {
        getAll: () => axios.get(`${API_BASE_URL}/transacciones`),
        getById: (id) => axios.get(`${API_BASE_URL}/transacciones/${id}`),
        create: (data) => axios.post(`${API_BASE_URL}/transacciones`, data),
        update: (id, data) => axios.put(`${API_BASE_URL}/transacciones/${id}`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/transacciones/${id}`)
    },
    // API de Roles
    roles: {
        getAll: () => axios.get(`${API_BASE_URL}/roles`),
        getById: (id) => axios.get(`${API_BASE_URL}/roles/${id}`),
        create: (data) => axios.post(`${API_BASE_URL}/roles`, data),
        update: (id, data) => axios.put(`${API_BASE_URL}/roles/${id}`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/roles/${id}`)
    },
    // API de Grados
    grados: {
        getAll: () => axios.get(`${API_BASE_URL}/grados`),
        getById: (id) => axios.get(`${API_BASE_URL}/grados/${id}`),
        create: (data) => axios.post(`${API_BASE_URL}/grados`, data),
        update: (id, data) => axios.put(`${API_BASE_URL}/grados/${id}`, data),
        delete: (id) => axios.delete(`${API_BASE_URL}/grados/${id}`)
    },
    auth: {
        login: (credenciales) => axios.post(`${API_BASE_URL}/auth/login`, credenciales),
    }
};

export default apiService;