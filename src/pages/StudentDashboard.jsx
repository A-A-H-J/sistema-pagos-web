import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { Loader, BarChart3, LogOut, ChevronDown, ChevronUp, Menu, Settings as SettingsIcon, Sun, Moon, Eye, Mail, Save } from 'lucide-react';

const Settings = () => {
  const { auth, isDarkMode, toggleDarkMode, isDaltonicoMode, toggleDaltonicoMode, fontSize, setFontSize } = useAuth();
  
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setEmailError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.usuarios.updateEmail(auth.userId, newEmail);
      setSuccessMessage(response.data.message);
      setNewEmail('');
    } catch (err) {
      console.error('Error al cambiar el correo:', err);
      const errorMessage = err.response?.data?.message || 'No se pudo cambiar el correo. Inténtalo de nuevo.';
      setEmailError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = `${e.target.value}px`;
    setFontSize(newSize);
    document.documentElement.style.fontSize = newSize; 
  };

  return (
    <div className="p-8 space-y-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      <h2 className="text-3xl font-bold">Configuraciones</h2>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </div>
          <p className="text-lg font-semibold">Modo Oscuro</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDarkMode ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            <Eye className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">Accesibilidad</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">Modo Daltónico</p>
            <button
              onClick={toggleDaltonicoMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDaltonicoMode ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDaltonicoMode ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tamaño de letra</label>
            <input
              type="range"
              min="14"
              max="20"
              value={parseInt(fontSize)}
              onChange={handleFontSizeChange}
              className="w-full mt-1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              El tamaño de letra actual es: {fontSize}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-full">
            <Mail className="w-6 h-6" />
          </div>
          <p className="text-lg font-semibold">Cambiar Correo Electrónico</p>
        </div>
        {successMessage && (
          <div className="p-3 mb-4 text-sm text-center text-green-700 bg-green-100 rounded-lg">{successMessage}</div>
        )}
        {emailError && (
          <div className="p-3 mb-4 text-sm text-center text-red-700 bg-red-100 rounded-lg">{emailError}</div>
        )}
        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nuevo correo
            </label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              placeholder="nuevo.correo@ejemplo.com"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};


const StudentPaymentsDashboard = () => {
  const [saldo, setSaldo] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { auth, logout, isDarkMode } = useAuth();
  const userId = auth.userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.warn("No hay ID de usuario disponible. Deteniendo la carga de datos.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const carteraResponse = await apiService.carteras.getByUserId(userId);
        const userCartera = carteraResponse.data;
        setSaldo(userCartera.saldo);
        const carteraId = userCartera.idCartera;

        const transaccionesResponse = await apiService.transacciones.getAll();
        const userTransactions = transaccionesResponse.data.filter(
          (tx) => tx.carteraId === carteraId
        );
        setTransacciones(userTransactions);

      } catch (error) {
        console.error("Error al obtener los datos:", error);
        setSaldo(0.00);
        setTransacciones([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleLogout = () => {
    logout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-8">
            {/* Sección de Saldo Actual */}
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                SALDO ACTUAL
              </h2>
              <p className="text-4xl sm:text-6xl font-extrabold mt-2" style={{ color: '#4B5563' }}>
                ${saldo !== null ? saldo.toFixed(2) : '0.00'}
              </p>
            </div>

            {/* Sección de Historial de Transacciones */}
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Transacciones Recientes
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tipo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transacciones.map((tx) => (
                      <tr key={tx.id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {tx.description}
                        </td>
                        <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          ${tx.amount.toFixed(2)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {tx.date}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${tx.type === 'ingreso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {tx.type === 'ingreso' ? <ChevronUp className="inline-block w-4 h-4 mr-1" /> : <ChevronDown className="inline-block w-4 h-4 mr-1" />}
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <Loader className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 text-gray-700">
        Sesión no iniciada. Por favor, <a href="/login" className="text-blue-600 hover:underline ml-1">inicia sesión</a>.
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="bg-gray-800 text-white p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        <span className="text-lg font-medium">AdminMarketCup</span>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <BarChart3 className="w-5 h-5" /> Dashboard
        </button>
        <button
          onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
        >
          <SettingsIcon className="w-5 h-5" /> Configuración
        </button>
      </nav>

      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center gap-3"
        >
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar para desktop */}
      <aside className="hidden lg:block w-64 shadow-2xl z-20">
        <SidebarContent />
      </aside>

      {/* Botón de menú para mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-800 text-white rounded-md shadow-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar para mobile (modal) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-800 shadow-2xl animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto relative z-10 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StudentPaymentsDashboard;
