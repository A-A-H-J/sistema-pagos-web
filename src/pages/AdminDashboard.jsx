import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, DollarSign, Clock, UserPlus, LogOut, Menu, Book, Settings as SettingsIcon } from 'lucide-react';
import GradosManagement from '../components/GradosManagement';
import UsuariosManagement from '../components/UsuariosManagement';
import Settings from '../components/Settings';

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <div className={`p-6 rounded-xl shadow-md ${color} flex items-center justify-between`}>
    <div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wider">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className="p-3 bg-white bg-opacity-30 rounded-full">
      <Icon className="w-6 h-6 text-gray-800" />
    </div>
  </div>
);

const AdminDashboard = () => {
  const { logout, isDarkMode } = useAuth(); // Get isDarkMode from context
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

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
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
            activeTab === 'dashboard' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <BarChart3 className="w-5 h-5" /> Dashboard
        </button>
        <button
          onClick={() => { setActiveTab('grados'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
            activeTab === 'grados' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Book className="w-5 h-5" /> Grados
        </button>
        <button
          onClick={() => { setActiveTab('usuarios'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
            activeTab === 'usuarios' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <Users className="w-5 h-5" /> Usuarios
        </button>
        <button
          onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
            activeTab === 'settings' ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
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
              <StatsCard title="Estudiantes Activos" value="2,450" icon={Users} color="bg-blue-100 dark:bg-blue-800" />
              <StatsCard title="Ingresos Totales" value="$85,300" icon={DollarSign} color="bg-green-100 dark:bg-green-800" />
              <StatsCard title="Transacciones Pendientes" value="47" icon={Clock} color="bg-orange-100 dark:bg-orange-800" />
              <StatsCard title="Nuevas Inscripciones" value="12" icon={UserPlus} color="bg-purple-100 dark:bg-purple-800" />
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-500">Análisis de Datos</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-md flex items-center justify-center h-64 transition-colors duration-500">
                  <p className="text-gray-500 dark:text-gray-300">Espacio para Gráfico 1</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl shadow-md flex items-center justify-center h-64 transition-colors duration-500">
                  <p className="text-gray-500 dark:text-gray-300">Espacio para Gráfico 2</p>
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

export default AdminDashboard;