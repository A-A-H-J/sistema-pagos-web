import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';
// Eliminar la importación del archivo CSS
// import '../styles/SignupPage.css'; 

const PaginaRegistro = () => {
  const navigate = useNavigate();
  
  const [primerNombre, setPrimerNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [carnet, setCarnet] = useState('');
  const [gradoId, setGradoId] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [grados, setGrados] = useState([]);
  const [cargandoGrados, setCargandoGrados] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerGrados = async () => {
      try {
        const response = await apiService.grados.getAll(); 
        setGrados(response.data);
      } catch (err) {
        console.error("Error al cargar los grados:", err);
        setError("No se pudieron cargar los grados.");
      } finally {
        setCargandoGrados(false);
      }
    };
    obtenerGrados();
  }, []);

  const validarContrasena = (contrasena) => {
    const minLength = contrasena.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(contrasena);
    const tieneMinuscula = /[a-z]/.test(contrasena);
    const tieneNumero = /[0-9]/.test(contrasena);

    return {
      minLength,
      tieneMayuscula,
      tieneMinuscula,
      tieneNumero,
    };
  };

  const validacionContrasena = validarContrasena(contrasena);

  const resetForm = () => {
    setPrimerNombre('');
    setPrimerApellido('');
    setCorreo('');
    setCarnet('');
    setGradoId('');
    setContrasena('');
    setConfirmarContrasena('');
    setError(null);
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    
    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!validacionContrasena.minLength || !validacionContrasena.tieneMayuscula || !validacionContrasena.tieneMinuscula || !validacionContrasena.tieneNumero) {
      setError("La contraseña no cumple con los requisitos.");
      return;
    }

    setError(null);

    const nuevoUsuario = {
      primerNombre,
      primerApellido,
      correo,
      carnet,
      grado: { id: parseInt(gradoId) },
      contrasena,
      rol: { idRol: 1 }, 
    };
    
    try {
      await apiService.usuarios.create(nuevoUsuario);
      alert('¡Cuenta creada exitosamente!');
      resetForm();
      navigate('/');
    } catch (err) {
      if (err.response) {
        console.error("Error de la API:", err.response.data);
        console.error("Código de estado:", err.response.status);
        if (err.response.status === 409) {
          setError("El carné o correo electrónico ya existen. Por favor, usa datos diferentes.");
        } else if (err.response.status === 400) {
          setError("Error de validación. Revisa los datos del formulario.");
        } else {
          setError("Error del servidor. Por favor, revisa la consola.");
        }
      } else if (err.request) {
        console.error("No se recibió respuesta del servidor:", err.request);
        setError("No se pudo conectar con el servidor. Verifica que tu backend esté corriendo.");
      } else {
        console.error("Error inesperado:", err.message);
        setError("Error inesperado. Revisa la consola.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Crea tu cuenta</h2>
          <p className="text-gray-600">Únete y empieza a gestionar tus finanzas</p>
        </div>
        
        <form onSubmit={manejarEnvio}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="primerNombre" className="block text-gray-700 font-semibold mb-2">Primer Nombre</label>
              <input type="text" id="primerNombre" value={primerNombre} onChange={(e) => setPrimerNombre(e.target.value)} required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="primerApellido" className="block text-gray-700 font-semibold mb-2">Primer Apellido</label>
              <input type="text" id="primerApellido" value={primerApellido} onChange={(e) => setPrimerApellido(e.target.value)} required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="correo" className="block text-gray-700 font-semibold mb-2">Correo Electrónico</label>
            <input type="email" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="carnet" className="block text-gray-700 font-semibold mb-2">Número de Carné</label>
            <input type="text" id="carnet" value={carnet} onChange={(e) => setCarnet(e.target.value)} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="grado" className="block text-gray-700 font-semibold mb-2">Grado</label>
            <select id="grado" value={gradoId} onChange={(e) => setGradoId(e.target.value)} required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
            >
              <option value="">Selecciona tu grado</option>
              {cargandoGrados ? (
                <option disabled>Cargando...</option>
              ) : (
                grados.map((grado) => (
                  <option key={grado.id} value={grado.id}>{grado.nombre}</option>
                ))
              )}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="contrasena" className="block text-gray-700 font-semibold mb-2">Contraseña</label>
            <input type="password" id="contrasena" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmarContrasena" className="block text-gray-700 font-semibold mb-2">Confirmar Contraseña</label>
            <input type="password" id="confirmarContrasena" value={confirmarContrasena} onChange={(e) => setConfirmarContrasena(e.target.value)} required 
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">La contraseña debe contener:</p>
            <ul className="text-sm space-y-1">
              <li className={validacionContrasena.minLength ? 'text-green-600' : 'text-gray-500'}>✓ Al menos 8 caracteres</li>
              <li className={validacionContrasena.tieneMayuscula ? 'text-green-600' : 'text-gray-500'}>✓ Una letra mayúscula</li>
              <li className={validacionContrasena.tieneMinuscula ? 'text-green-600' : 'text-gray-500'}>✓ Una letra minúscula</li>
              <li className={validacionContrasena.tieneNumero ? 'text-green-600' : 'text-gray-500'}>✓ Un número</li>
            </ul>
          </div>
          
          <label className="flex items-center text-sm text-gray-600 mb-6">
              <input type="checkbox" id="terms" required className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" />
              Acepto los <a href="#" className="text-blue-600 hover:underline mx-1">Términos del Servicio</a> y la <a href="#" className="text-blue-600 hover:underline ml-1">Política de Privacidad</a>
          </label>
          
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
            CREAR CUENTA
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">¿Ya tienes una cuenta? <Link to="/" className="text-blue-600 font-semibold hover:text-blue-800">Inicia Sesión</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaginaRegistro;