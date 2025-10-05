import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, DollarSign, Clock, UserPlus, LogOut, Menu, Book, Settings as SettingsIcon, Loader } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import GradosManagement from '../components/GradosManagement';
import UsuariosManagement from '../components/UsuariosManagement';
import Settings from '../components/Settings';
import apiService from '../services/apiService';

// --- Componente de Tarjeta de Estadísticas ---
const StatsCard = ({ title, value, icon: Icon, color, loading }) => (
  <div className={`p-6 rounded-xl shadow-md ${color} flex items-center justify-between`}>
    <div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wider">{title}</h3>
      {loading ? (
        <div className="mt-2 h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
      ) : (
        <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
      )}
    </div>
    <div className="p-3 bg-white bg-opacity-30 rounded-full">
      <Icon className="w-6 h-6 text-gray-800" />
    </div>
  </div>
);

// --- Componente de Gráfico de Flujo (Ingresos vs Gastos) ---
const GraficoFlujo = ({ data }) => {
  const formattedData = data.map(item => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Line type="monotone" dataKey="ingresos" stroke="#22c55e" name="Ingresos" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="gastos" stroke="#ef4444" name="Gastos" />
      </LineChart>
    </ResponsiveContainer>
  );
};

// --- Componente de Gráfico de Nuevos Usuarios ---
const GraficoUsuarios = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cantidad" fill="#3b82f6" name="Nuevos Usuarios" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// --- Componente Principal del Dashboard ---
const AdminDashboard = () => {
  const { logout, isDarkMode } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [stats, setStats] = useState({ totalUsuariosActivos: 0, ingresosTotales: 0, transaccionesHoy: 0, nuevosUsuariosMes: 0 });
  const [flujoData, setFlujoData] = useState([]);
  const [usuariosData, setUsuariosData] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (activeTab === 'dashboard') {
        try {
          setLoadingStats(true);
          const [statsRes, flujoRes, usuariosRes] = await Promise.all([
            apiService.dashboard.getEstadisticasGenerales(),
            apiService.dashboard.getFlujoUltimos7Dias(),
            apiService.dashboard.getRegistrosPorMes(),
          ]);
          setStats(statsRes.data);
          setFlujoData(flujoRes.data);
          setUsuariosData(usuariosRes.data);
        } catch (error) {
          console.error("Error al cargar datos del dashboard:", error);
        } finally {
          setLoadingStats(false);
        }
      }
    };
    fetchDashboardData();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="bg-gray-800 text-white p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <span className="text-lg font-medium">AdminMarketCup</span>
      </div>
      <nav className="flex-1 space-y-2">
        <button
          onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <BarChart3 className="w-5 h-5" /> Dashboard
        </button>
        <button
          onClick={() => { setActiveTab('grados'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'grados' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <Book className="w-5 h-5" /> Grados
        </button>
        <button
          onClick={() => { setActiveTab('usuarios'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'usuarios' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <Users className="w-5 h-5" /> Usuarios
        </button>
        <button
          onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'settings' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
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

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 transition-colors duration-500">Dashboard de Administración</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Estudiantes Activos" value={stats.totalUsuariosActivos} icon={Users} color="bg-blue-100 dark:bg-blue-800" loading={loadingStats} />
              <StatsCard title="Ingresos Totales" value={`$${stats.ingresosTotales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="bg-green-100 dark:bg-green-800" loading={loadingStats} />
              <StatsCard title="Transacciones Hoy" value={stats.transaccionesHoy} icon={Clock} color="bg-orange-100 dark:bg-orange-800" loading={loadingStats} />
              <StatsCard title="Nuevos Estudiantes (Mes)" value={stats.nuevosUsuariosMes} icon={UserPlus} color="bg-purple-100 dark:bg-purple-800" loading={loadingStats} />
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-500">Análisis de Datos</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md transition-colors duration-500">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Ingresos vs Gastos (Últimos 7 días)</h4>
                  {loadingStats ? <div className="h-[300px] flex items-center justify-center"><Loader className="animate-spin" /></div> : <GraficoFlujo data={flujoData} />}
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md transition-colors duration-500">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Nuevos Usuarios por Mes (Año Actual)</h4>
                  {loadingStats ? <div className="h-[300px] flex items-center justify-center"><Loader className="animate-spin" /></div> : <GraficoUsuarios data={usuariosData} />}
                </div>
              </div>
            </div>
          </div>
        );
      case 'grados':
        return <GradosManagement />;
      case 'usuarios':
        return <UsuariosManagement />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg">Seleccione una opción del menú lateral.</p>
          </div>
        );
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <aside className="hidden lg:block w-64 shadow-2xl z-20">
        <SidebarContent />
      </aside>
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-800 text-white rounded-md shadow-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-800 shadow-2xl animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}
      <main className="flex-1 overflow-y-auto relative z-10 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;