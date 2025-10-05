import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Power, Search, Eye, EyeOff, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { saveAs } from 'file-saver';

const UsuariosManagement = () => {
  const { isDarkMode, isDaltonicoMode, toggleDaltonicoMode } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await apiService.usuarios.getAll();
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los usuarios:", err);
      setError("No se pudieron cargar los usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspenderUsuario = async (id) => {
    try {
      await apiService.usuarios.suspender(id);
      fetchUsuarios();
      setError(null);
    } catch (err) {
      console.error("Error al suspender/activar usuario:", err);
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError("No se pudo realizar la operación. Inténtalo de nuevo.");
      }
    }
  };

  const handleDownloadStatement = async (usuario) => {
    try {
        const response = await apiService.reportes.getEstadoDeCuenta(usuario.idUsuario);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        saveAs(blob, `EstadoDeCuenta_${usuario.carnet || usuario.idUsuario}.pdf`);
    } catch (error) {
        console.error("Error al descargar el estado de cuenta:", error);
        alert(`No se pudo descargar el estado de cuenta para ${usuario.primerNombre}.`);
    }
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const fullName = `${usuario.primerNombre} ${usuario.primerApellido}`.toLowerCase();
    const carnet = usuario.carnet ? usuario.carnet.toLowerCase() : '';
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || carnet.includes(term);
  });

  const getStatusColor = (activo) => {
    if (isDaltonicoMode) {
      return activo ? 'bg-blue-500 text-white dark:bg-blue-500' : 'bg-orange-500 text-white dark:bg-orange-500';
    }
    return activo ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
  };

  const getRoleColor = (rol) => {
    if (isDaltonicoMode) {
      return rol === 'ADMINISTRADOR' ? 'bg-fuchsia-500 text-white dark:bg-fuchsia-500' : 'bg-violet-500 text-white dark:bg-violet-500';
    }
    return rol === 'ADMINISTRADOR' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando usuarios...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 transition-colors duration-500">Gestión de Usuarios</h2>
      
      {error && <div className="mb-4 p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">{error}</div>}
      
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o código de carné..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
          <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <button
          onClick={toggleDaltonicoMode}
          className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          title={isDaltonicoMode ? "Desactivar modo daltónico" : "Activar modo daltónico"}
        >
          {isDaltonicoMode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto transition-colors duration-500">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Carné</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsuarios.map((usuario) => (
              <tr key={usuario.idUsuario} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  {usuario.primerNombre} {usuario.primerApellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {usuario.carnet || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {usuario.correo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(usuario.rol.nombre)}`}>
                    {usuario.rol.nombre}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(usuario.activo)}`}>
                    {usuario.activo ? 'Activo' : 'Suspendido'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                  {usuario.rol.nombre !== 'ADMINISTRADOR' && (
                    <button
                      onClick={() => handleSuspenderUsuario(usuario.idUsuario)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-md transition duration-200"
                      aria-label={usuario.activo ? "Suspender usuario" : "Activar usuario"}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadStatement(usuario)}
                    className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 p-2 rounded-md transition duration-200"
                    aria-label={`Descargar estado de cuenta de ${usuario.primerNombre}`}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsuarios.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No se encontraron usuarios.</p>
        )}
      </div>
    </div>
  );
};

export default UsuariosManagement;