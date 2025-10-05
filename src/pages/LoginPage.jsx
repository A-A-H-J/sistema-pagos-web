import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Necesitamos esto para leer el rol del token
import { FcGoogle } from 'react-icons/fc'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        try {
            // 1. El backend ahora responde con un objeto que contiene el token JWT
            const response = await apiService.auth.login({ correo: email, contrasena: password });
            const token = response.data.jwt;

            // 2. Usamos nuestra función de login del AuthContext para guardar el token
            login(token);

            // 3. Decodificamos el token para obtener la información (como el rol)
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;

            // 4. Redirigimos al usuario basado en su rol
            if (userRole === "ADMINISTRADOR") {
                navigate('/admin');
            } else if (userRole === "ESTUDIANTE") {
                navigate('/student');
            } else {
                // Si el rol no es reconocido, lo enviamos a la página principal
                navigate('/');
            }

        } catch (error) {
            console.error('Error de autenticación:', error);
            setErrorMessage('Credenciales incorrectas o cuenta suspendida. Por favor, verifica tus datos.');
        }
    };

    // La URL para el login con Google se mantiene igual
    const googleLoginUrl = 'http://localhost:8080/oauth2/authorization/google';

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Inicia sesión en tu cuenta</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    {errorMessage && (
                        <div className="mb-4 p-3 text-sm text-center text-red-700 bg-red-100 rounded-lg">
                            {errorMessage}
                        </div>
                    )}
                    <div className="flex items-center justify-between mb-6 text-sm">
                        <label className="flex items-center text-gray-600">
                            <input type="checkbox" className="h-4 w-4 text-blue-600 rounded mr-2 focus:ring-blue-500" />
                            Recuérdame
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-200">¿Olvidaste tu contraseña?</a>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
                        INICIAR SESIÓN
                    </button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">O continúa con</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <a
                            href={googleLoginUrl}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FcGoogle className="w-5 h-5 mr-3" />
                            Iniciar sesión con Google
                        </a>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿No tienes una cuenta? <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-800">Regístrate</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;