import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { 
    Loader, BarChart3, LogOut, ChevronDown, ChevronUp, Menu, 
    Settings as SettingsIcon, Download, ArrowLeftRight, Bell 
} from 'lucide-react';
import { saveAs } from 'file-saver';
import ReceivePayment from '../components/payment/ReceivePayment'; 
import SendPayment from '../components/payment/SendPayment';
import Settings from '../components/Settings'; // Asumiendo que Settings es un componente separado
import PaymentConfirmation from '../components/payment/PaymentConfirmation'; // Importamos el nuevo componente

const StudentDashboard = () => {
  const [saldo, setSaldo] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [paymentView, setPaymentView] = useState('confirm'); // Inicia en la vista de confirmación
  const [pendingCount, setPendingCount] = useState(0);
  const { auth, logout, isDarkMode } = useAuth();
  const userId = auth.userId;

  const fetchDashboardData = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const carteraResponse = await apiService.carteras.getByUserId(userId);
      const userCartera = carteraResponse.data;
      setSaldo(userCartera.saldo);

      const transaccionesResponse = await apiService.transacciones.getAll();
      const userTransactions = transaccionesResponse.data
        .filter(tx => tx.cartera.idCartera === userCartera.idCartera)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Ordenar por fecha descendente
      setTransacciones(userTransactions);
    } catch (error) {
      console.error("Error al obtener los datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchPendingCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await apiService.transacciones.getPagosPendientes(userId);
      setPendingCount(response.data.length);
    } catch (error) {
      console.error("Error al obtener el conteo de pagos pendientes:", error);
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
    fetchPendingCount(); // Llama siempre para mantener el badge actualizado
  }, [userId, activeTab, fetchDashboardData, fetchPendingCount]);

  const handleLogout = () => {
    logout();
  };

  const handleDownloadStatement = async () => {
    try {
      const response = await apiService.reportes.getEstadoDeCuenta(auth.userId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `EstadoDeCuenta_${auth.userId}.pdf`);
    } catch (error) {
      console.error("Error al descargar el estado de cuenta:", error);
      alert("No se pudo descargar el estado de cuenta. Inténtalo de nuevo.");
    }
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (loading) {
            return <div className="flex items-center justify-center h-full"><Loader className="w-10 h-10 animate-spin text-blue-500" /></div>;
        }
        return (
          <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-8">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">SALDO ACTUAL</h2>
              <p className="text-4xl sm:text-6xl font-extrabold mt-2 text-gray-700 dark:text-gray-200">${saldo !== null ? saldo.toFixed(2) : '0.00'}</p>
              <button onClick={handleDownloadStatement} className="mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 mx-auto">
                <Download className="w-5 h-5" />Descargar Estado de Cuenta
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Transacciones Recientes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transacciones.map((tx) => (
                            <tr key={tx.idTransaccion}>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{tx.descripcion}</td>
                                <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold ${tx.tipo === 'PAGO' ? 'text-red-500' : 'text-green-500'}`}>${tx.monto.toFixed(2)}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(tx.fecha).toLocaleDateString()}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2 text-xs font-semibold leading-5 rounded-full ${tx.tipo === 'RECARGA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {tx.tipo === 'RECARGA' ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                        {tx.tipo.charAt(0).toUpperCase() + tx.tipo.slice(1).toLowerCase()}
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
      case 'payment':
        return (
          <div className="p-4 sm:p-8">
            <div className="flex justify-center mb-6 border-b border-gray-200 dark:border-gray-700">
              <button onClick={() => setPaymentView('confirm')}
                className={`py-3 px-6 font-semibold transition-colors duration-300 relative ${paymentView === 'confirm' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
                Aprobar Pagos
                {pendingCount > 0 && <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs">{pendingCount}</span>}
              </button>
              <button onClick={() => setPaymentView('send')}
                className={`py-3 px-6 font-semibold transition-colors duration-300 ${paymentView === 'send' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
                Solicitar Pago (Vendedor)
              </button>
              <button onClick={() => setPaymentView('receive')}
                className={`py-3 px-6 font-semibold transition-colors duration-300 ${paymentView === 'receive' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}>
                Recibir Pago (Mostrar QR)
              </button>
            </div>
            {paymentView === 'confirm' && <PaymentConfirmation />}
            {paymentView === 'receive' && <ReceivePayment />}
            {paymentView === 'send' && <SendPayment />}
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  if (!userId && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700">
        Sesión no iniciada. Por favor, <a href="/" className="text-blue-600 hover:underline ml-1">inicia sesión</a>.
      </div>
    );
  }

  const SidebarContent = () => (
    <div className="bg-gray-800 text-white p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
        <span className="text-lg font-medium">MarketCup</span>
      </div>
      <nav className="flex-1 space-y-2">
        <button onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <BarChart3 className="w-5 h-5" /> Dashboard
        </button>
        <button onClick={() => { setActiveTab('payment'); setPaymentView('confirm'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 relative ${activeTab === 'payment' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <ArrowLeftRight className="w-5 h-5" /> Pagos
          {pendingCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{pendingCount}</span>}
        </button>
        <button onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
          className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-3 ${activeTab === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
          <SettingsIcon className="w-5 h-5" /> Configuración
        </button>
      </nav>
      <div className="mt-auto pt-4">
        <button onClick={handleLogout} className="w-full text-left py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center gap-3">
          <LogOut className="w-5 h-5" /> Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <aside className="hidden lg:block w-64 shadow-2xl z-20"><SidebarContent /></aside>
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-gray-800 text-white rounded-md shadow-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <aside className="absolute left-0 top-0 h-full w-64 bg-gray-800 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
      <main className="flex-1 overflow-y-auto relative z-10 p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;