import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Estado para el mensaje de error
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Limpia el mensaje de error anterior
        try {
            const response = await apiService.auth.login({ correo: email, contrasena: password });

            const { idUsuario, rol } = response.data;
            const userRole = rol.nombre;

            login(idUsuario, userRole);

            // Redirección basada en el rol, ya no se usa alert()
            if (userRole === "ADMINISTRADOR") {
                navigate('/admin');
            } else if (userRole === "ESTUDIANTE") {
                navigate('/student');
            } else {
                navigate('/');
            }

        } catch (error) {
            console.error('Error de autenticación:', error);
            // El backend devuelve un error 401 si las credenciales son incorrectas.
            // Si el usuario suspendido no pasa la validación en el backend, el login fallará.
            setErrorMessage('Credenciales incorrectas o cuenta suspendida. Por favor, verifica tus datos.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Login to your account</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
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
                            Remember me
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-800 transition duration-200">Forgot Password?</a>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md">
                        LOGIN
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account? <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-800">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;