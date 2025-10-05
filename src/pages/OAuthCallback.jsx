import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const OAuthCallback = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); // Leemos el token de la URL

    if (token) {
      // Guardamos el token en el contexto/localStorage
      login(token);

      // Decodificamos para saber a dónde redirigir
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      
      if (role === 'ADMINISTRADOR') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } else {
      // Si no hay token, volvemos al login
      navigate('/');
    }
  }, [login, location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Procesando autenticación...</p>
    </div>
  );
};

export default OAuthCallback;