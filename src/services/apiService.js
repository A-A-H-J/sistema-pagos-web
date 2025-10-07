import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// --- Interceptor de Axios para adjuntar el token JWT (sin cambios) ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiService = {
    // --- API de Usuarios (con la nueva función) ---
    usuarios: {
        getAll: () => apiClient.get(`/usuarios`),
        getById: (id) => apiClient.get(`/usuarios/${id}`),
        create: (data) => apiClient.post(`/usuarios`, data),
        update: (id, data) => apiClient.put(`/usuarios/${id}`, data),
        suspender: (id) => apiClient.put(`/usuarios/suspender/${id}`),
        delete: (id) => apiClient.delete(`/usuarios/${id}`),
        updateEmail: (id, newEmail) => apiClient.put(`/usuarios/${id}/email`, { newEmail }),
        // --- NUEVA FUNCIÓN ---
        registrarRostro: (id, file) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post(`/usuarios/${id}/registrar-rostro`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
    },

    // --- API de Transacciones (con la nueva función) ---
    transacciones: {
        getAll: () => apiClient.get(`/transacciones`),
        getById: (id) => apiClient.get(`/transacciones/${id}`),
        create: (data) => apiClient.post(`/transacciones`, data),
        update: (id, data) => apiClient.put(`/transacciones/${id}`, data),
        delete: (id) => apiClient.delete(`/transacciones/${id}`),
        // --- NUEVA FUNCIÓN (Asegúrate de tener este endpoint en tu backend) ---
        getPagosPendientes: (userId) => apiClient.get(`/transacciones/pendientes/${userId}`),
    },
    
    // --- API de QR (ACTUALIZADA) ---
    qr: {
        generateQrCode: (userId) => apiClient.get(`/qr/generate/${userId}`, {
            responseType: 'blob'
        }),
        // --- FUNCIÓN ACTUALIZADA ---
        requestPayment: (paymentData) => apiClient.post(`/qr/request-payment`, paymentData),
        // --- NUEVA FUNCIÓN ---
        confirmPayment: (transactionId, file) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post(`/qr/confirm-payment/${transactionId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
    },

    // --- OTRAS APIs (sin cambios) ---
    carteras: {
        getAll: () => apiClient.get(`/carteras`),
        getById: (id) => apiClient.get(`/carteras/${id}`),
        create: (data) => apiClient.post(`/carteras`, data),
        update: (id, data) => apiClient.put(`/carteras/${id}`, data),
        delete: (id) => apiClient.delete(`/carteras/${id}`),
        getByUserId: (userId) => apiClient.get(`/carteras/usuario/${userId}`),
    },
    roles: {
        getAll: () => apiClient.get(`/roles`),
    },
    grados: {
        getAll: () => apiClient.get(`/grados`),
    },
    auth: {
        login: (credenciales) => apiClient.post(`/auth/login`, credenciales),
    },
    dashboard: {
        getEstadisticasGenerales: () => apiClient.get(`/dashboard/estadisticas-generales`),
        getFlujoUltimos7Dias: () => apiClient.get(`/dashboard/flujo-ultimos-7-dias`),
        getRegistrosPorMes: () => apiClient.get(`/dashboard/registros-por-mes`),
    },
    reportes: {
        getEstadoDeCuenta: (usuarioId) => apiClient.get(`/reportes/estado-de-cuenta/${usuarioId}`, {
            responseType: 'blob',
        }),
    },
};

export default apiService;