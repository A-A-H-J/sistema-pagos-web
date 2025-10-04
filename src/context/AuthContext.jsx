import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext({
  auth: {
    isLoggedIn: false,
    userId: null,
    userRole: null,
  },
  login: () => {},
  logout: () => {},
  loading: true,
  isDarkMode: false,
  toggleDarkMode: () => {},
  isDaltonicoMode: false,
  toggleDaltonicoMode: () => {},
  fontSize: '16px',
  setFontSize: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    userId: null,
    userRole: null,
  });
  const [loading, setLoading] = useState(true);
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
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        if (parsedAuth && parsedAuth.isLoggedIn) {
          setAuth(parsedAuth);
        }
      } catch (e) {
        console.error("Failed to parse auth data from localStorage", e);
        localStorage.removeItem('auth');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('isDaltonicoMode', JSON.stringify(isDaltonicoMode));
    if (isDaltonicoMode) {
      document.documentElement.classList.add('daltonico');
    } else {
      document.documentElement.classList.remove('daltonico');
    }
  }, [isDaltonicoMode]);

  const login = (userId, userRole) => {
    const newAuth = {
      isLoggedIn: true,
      userId,
      userRole,
    };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
    
    // Reset visual settings to default on login
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    setIsDaltonicoMode(false);
    document.documentElement.classList.remove('daltonico');
    setFontSize('16px');
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      userId: null,
      userRole: null,
    });
    localStorage.removeItem('auth');

    // Reset visual settings to default on logout
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    setIsDaltonicoMode(false);
    document.documentElement.classList.remove('daltonico');
    setFontSize('16px');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleDaltonicoMode = () => {
    setIsDaltonicoMode(prevMode => !prevMode);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, isDarkMode, toggleDarkMode, isDaltonicoMode, toggleDaltonicoMode, fontSize, setFontSize }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
