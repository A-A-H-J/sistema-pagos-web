import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// --- ¡INTERCEPTOR DE AXIOS PARA ADJUNTAR EL TOKEN JWT! ---
// Este código se ejecuta automáticamente ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Obtenemos el token guardado en localStorage
    const token = localStorage.getItem('authToken');
    
    // 2. Si el token existe, lo añadimos a la cabecera 'Authorization'
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 3. Devolvemos la configuración modificada para que la petición continúe
    return config;
  },
  (error) => {
    // Manejamos errores en la configuración de la petición
    return Promise.reject(error);
  }
);

// Ahora, todas las funciones usan `apiClient` en lugar del `axios` global.
// Gracias al interceptor, todas llevarán el token si existe.
const apiService = {
    // API de Usuarios
    usuarios: {
        getAll: () => apiClient.get(`/usuarios`),
        getById: (id) => apiClient.get(`/usuarios/${id}`),
        create: (data) => apiClient.post(`/usuarios`, data),
        update: (id, data) => apiClient.put(`/usuarios/${id}`, data),
        suspender: (id) => apiClient.put(`/usuarios/suspender/${id}`),
        delete: (id) => apiClient.delete(`/usuarios/${id}`),
        updateEmail: (id, newEmail) => apiClient.put(`/usuarios/${id}/email`, { newEmail })
    },
    // API de Carteras
    carteras: {
        getAll: () => apiClient.get(`/carteras`),
        getById: (id) => apiClient.get(`/carteras/${id}`),
        create: (data) => apiClient.post(`/carteras`, data),
        update: (id, data) => apiClient.put(`/carteras/${id}`, data),
        delete: (id) => apiClient.delete(`/carteras/${id}`),
        getByUserId: (userId) => apiClient.get(`/carteras/usuario/${userId}`),
    },
    // API de Transacciones
    transacciones: {
        getAll: () => apiClient.get(`/transacciones`),
        getById: (id) => apiClient.get(`/transacciones/${id}`),
        create: (data) => apiClient.post(`/transacciones`, data),
        update: (id, data) => apiClient.put(`/transacciones/${id}`, data),
        delete: (id) => apiClient.delete(`/transacciones/${id}`)
    },
    // API de Roles
    roles: {
        getAll: () => apiClient.get(`/roles`),
        getById: (id) => apiClient.get(`/roles/${id}`),
        create: (data) => apiClient.post(`/roles`, data),
        update: (id, data) => apiClient.put(`/roles/${id}`, data),
        delete: (id) => apiClient.delete(`/roles/${id}`)
    },
    // API de Grados
    grados: {
        getAll: () => apiClient.get(`/grados`),
        getById: (id) => apiClient.get(`/grados/${id}`),
        create: (data) => apiClient.post(`/grados`, data),
        update: (id, data) => apiClient.put(`/grados/${id}`, data),
        delete: (id) => apiClient.delete(`/grados/${id}`)
    },
    // API de Auth
    auth: {
        login: (credenciales) => apiClient.post(`/auth/login`, credenciales),
    },
    // API de Dashboard
    dashboard: {
        getEstadisticasGenerales: () => apiClient.get(`/dashboard/estadisticas-generales`),
        getFlujoUltimos7Dias: () => apiClient.get(`/dashboard/flujo-ultimos-7-dias`),
        getRegistrosPorMes: () => apiClient.get(`/dashboard/registros-por-mes`),
    },
    // API de Reportes
    reportes: {
        getEstadoDeCuenta: (usuarioId) => apiClient.get(`/reportes/estado-de-cuenta/${usuarioId}`, {
            responseType: 'blob',
        }),
    },
    // API de QR
    qr: {
        generateQrCode: (userId) => apiClient.get(`/qr/generate/${userId}`, {
            responseType: 'blob'
        }),
        processPayment: (paymentData) => apiClient.post(`/qr/process-payment`, paymentData),
    },
};

export default apiService;