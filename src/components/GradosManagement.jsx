import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import { Trash2, Plus, Search, Pencil, Save, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Importamos el hook useAuth

const GradosManagement = () => {
  const { isDarkMode } = useAuth(); // Obtenemos el estado de dark mode del contexto
  const [grados, setGrados] = useState([]);
  const [nuevoGrado, setNuevoGrado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchGrados();
  }, []);
  
  const fetchGrados = async () => {
    try {
      setLoading(true);
      const response = await apiService.grados.getAll();
      setGrados(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los grados:", err);
      setError("No se pudieron cargar los grados.");
    } finally {
      setLoading(false);
    } 
  };

  const handleAddGrado = async (e) => {
    e.preventDefault();
    if (!nuevoGrado.trim()) {
      setError("El nombre del grado no puede estar vacío.");
    return;
    }
    try {
      await apiService.grados.create({ nombre: nuevoGrado });
      setNuevoGrado('');
      fetchGrados();
      setError(null);
    } catch (err) {
      console.error("Error al agregar grado:", err.response);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("No se pudo agregar el grado. Inténtalo de nuevo.");
      }
    }
  };

  const handleEdit = (grado) => {
    setEditingId(grado.id);
    setEditingName(grado.nombre);
  };

  const handleSaveEdit = async (id) => {
    if (!editingName.trim()) {
      setError("El nombre del grado no puede estar vacío.");
      return;
    }
    try {
      await apiService.grados.update(id, { nombre: editingName });
      setEditingId(null);
      setEditingName('');
      fetchGrados();
      setError(null);
    } catch (err) {
      console.error("Error al actualizar grado:", err.response);
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("No se pudo actualizar el grado. Inténtalo de nuevo.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setError(null);
  };

  const handleDeleteGrado = async (id) => {
    try {
      await apiService.grados.delete(id);
      fetchGrados();
      setError(null);
    } catch (err) {
      console.error("Error al eliminar grado:", err);
      setError("No se pudo eliminar el grado. Hay usuarios asignados a este grado.");
    }
  };

  const filteredGrados = grados.filter(grado =>
    grado.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Cargando grados...</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 transition-colors duration-500">Gestión de Grados</h2>

      {error && <div className="mb-4 p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">{error}</div>}

      {/* Formulario para agregar nuevo grado */}
      <form onSubmit={handleAddGrado} className="mb-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner transition-colors duration-500">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 transition-colors duration-500">Agregar Nuevo Grado</h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            value={nuevoGrado}
            onChange={(e) => setNuevoGrado(e.target.value)}
            placeholder="Escribe el nombre del grado"
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
              bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Agregar
          </button>
        </div>
      </form>
      
      {/* Barra de búsqueda */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Buscar grados por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
            bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
        />
        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* Tabla de grados */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-500">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">Grados Existentes</h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredGrados.map((grado) => (
              <li key={grado.id} className="flex items-center justify-between py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                {editingId === grado.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="p-1 border border-gray-300 dark:border-gray-600 rounded flex-grow dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => handleSaveEdit(grado.id)}
                      className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600 p-2"
                      aria-label="Guardar cambios"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 p-2"
                      aria-label="Cancelar edición"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-gray-800 dark:text-gray-200">{grado.nombre}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(grado)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 p-2 rounded-md transition duration-200"
                        aria-label={`Editar grado ${grado.nombre}`}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGrado(grado.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600 p-2 rounded-md transition duration-200"
                        aria-label={`Eliminar grado ${grado.nombre}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
          {filteredGrados.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No se encontraron grados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradosManagement;
