import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FacialEnrollment from '../pages/FacialEnrollment'; // Importamos la nueva pantalla

const ProtectedRoute = ({ children, requiredRole }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Cargando...</p>
        </div>
    );
  }

  // 1. Si no está logueado, redirige al login
  if (!auth.isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 2. Si el rol no coincide, redirige (por si acaso intentan entrar a /admin)
  if (requiredRole && auth.userRole !== requiredRole) {
    return <Navigate to="/" replace />; 
  }

  // 3. ¡LA NUEVA LÓGICA! Si está logueado pero no tiene faceId, muestra la pantalla de enrollment
  if (auth.isLoggedIn && !auth.hasFaceId) {
    return <FacialEnrollment />;
  }

  // 4. Si todo está en orden, muestra la página solicitada
  return children;
};

export default ProtectedRoute;