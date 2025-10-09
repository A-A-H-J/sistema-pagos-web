import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// Interceptor para adjuntar el token JWT
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
    usuarios: {
        getAll: () => apiClient.get(`/usuarios`),
        getById: (id) => apiClient.get(`/usuarios/${id}`),
        create: (data) => apiClient.post(`/usuarios`, data),
        update: (id, data) => apiClient.put(`/usuarios/${id}`, data),
        suspender: (id) => apiClient.put(`/usuarios/suspender/${id}`),
        delete: (id) => apiClient.delete(`/usuarios/${id}`),
        updateEmail: (id, newEmail) => apiClient.put(`/usuarios/${id}/email`, { newEmail }),
        
        /**
         * MODIFICADO: Ahora acepta una lista de archivos y los envía bajo la clave "files".
         */
        registrarRostro: (id, files) => {
            const formData = new FormData();
            // Agregamos cada archivo a la misma clave "files"
            files.forEach(file => {
                formData.append('files', file);
            });
            
            return apiClient.post(`/usuarios/${id}/registrar-rostro`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        }
    },

    transacciones: {
        getAll: () => apiClient.get(`/transacciones`),
        getById: (id) => apiClient.get(`/transacciones/${id}`),
        create: (data) => apiClient.post(`/transacciones`, data),
        update: (id, data) => apiClient.put(`/transacciones/${id}`, data),
        delete: (id) => apiClient.delete(`/transacciones/${id}`),
        getPagosPendientes: (userId) => apiClient.get(`/transacciones/pendientes/${userId}`),
    },
    
    qr: {
        generateQrCode: (userId) => apiClient.get(`/qr/generate/${userId}`, {
            responseType: 'blob'
        }),
        requestPayment: (paymentData) => apiClient.post(`/qr/request-payment`, paymentData),
        confirmPayment: (transactionId, file) => {
            const formData = new FormData();
            formData.append('file', file);
            return apiClient.post(`/qr/confirm-payment/${transactionId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
    },

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