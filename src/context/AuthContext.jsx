import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiService from '../services/apiService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    userId: null,
    userRole: null,
    hasFaceId: false, 
  });
  const [loading, setLoading] = useState(true);
  
  // ... (estados de UI: isDarkMode, etc. se mantienen igual)
  const [isDarkMode, setIsDarkMode] = useState(() => JSON.parse(localStorage.getItem('isDarkMode') || 'false'));
  const [isDaltonicoMode, setIsDaltonicoMode] = useState(() => JSON.parse(localStorage.getItem('isDaltonicoMode') || 'false'));
  const [fontSize, setFontSize] = useState('16px');


  const checkForFaceId = useCallback(async (userId) => {
    if (!userId) return false;
    try {
        const response = await apiService.usuarios.getById(userId);
        const userHasFaceId = !!response.data.faceId;
        setAuth(prevAuth => ({ ...prevAuth, hasFaceId: userHasFaceId }));
        return userHasFaceId;
    } catch (error) {
        console.error("Error al verificar el faceId:", error);
        return false;
    }
  }, []);

  useEffect(() => {
    const validateToken = async () => {
        if (authToken) {
          try {
            const decodedToken = jwtDecode(authToken);
            if (decodedToken.exp * 1000 > Date.now()) {
              const userHasFaceId = await checkForFaceId(decodedToken.userId);
              setAuth({
                isLoggedIn: true,
                userId: decodedToken.userId,
                userRole: decodedToken.role,
                hasFaceId: userHasFaceId, // <-- ACTUALIZADO
              });
            } else {
              logout();
            }
          } catch (error) {
            console.error("Token inválido:", error);
            logout();
          }
        } else {
          setAuth({ isLoggedIn: false, userId: null, userRole: null, hasFaceId: false });
        }
        setLoading(false);
    };
    validateToken();
  }, [authToken, checkForFaceId]);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  // ... (funciones de UI: toggleDarkMode, etc. se mantienen igual)
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
    <AuthContext.Provider value={{ auth, login, logout, loading, checkForFaceId, isDarkMode, toggleDarkMode, isDaltonicoMode, toggleDaltonicoMode, fontSize, setFontSize }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);