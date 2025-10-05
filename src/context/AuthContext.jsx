import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importamos la nueva librería

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    userId: null,
    userRole: null,
  });
  const [loading, setLoading] = useState(true);
  
  // Mantenemos tus estados de UI existentes
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isDaltonicoMode, setIsDaltonicoMode] = useState(() => {
    const savedMode = localStorage.getItem('isDaltonicoMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [fontSize, setFontSize] = useState('16px');

  useEffect(() => {
    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        
        // Comprobamos si el token ha expirado
        if (decodedToken.exp * 1000 > Date.now()) {
          setAuth({
            isLoggedIn: true,
            userId: decodedToken.userId,
            userRole: decodedToken.role,
          });
        } else {
          // Si el token expiró, lo limpiamos
          localStorage.removeItem('authToken');
          setAuthToken(null);
        }
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem('authToken');
        setAuthToken(null);
      }
    } else {
      // Si no hay token, nos aseguramos que el estado sea 'no logueado'
      setAuth({ isLoggedIn: false, userId: null, userRole: null });
    }
    setLoading(false);
  }, [authToken]);

  // La nueva función de login ahora recibe el token
  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    // No es necesario resetear los settings de UI aquí,
    // se puede hacer en el componente de login si se desea.
  };

  // La función de logout ahora limpia el token
  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // El resto de tus funciones de UI se mantienen igual
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('isDaltonicoMode', JSON.stringify(isDaltonicoMode));
    if (isDaltonicoMode) document.documentElement.classList.add('daltonico');
    else document.documentElement.classList.remove('daltonico');
  }, [isDaltonicoMode]);
  
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleDaltonicoMode = () => setIsDaltonicoMode(prev => !prev);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, isDarkMode, toggleDarkMode, isDaltonicoMode, toggleDaltonicoMode, fontSize, setFontSize }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);