import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage on initial render
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Update localStorage when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Store token separately for easy access by axios interceptors
      localStorage.setItem('userToken', user.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
    // Also set the token directly for immediate use
    if (userData && userData.token) {
      localStorage.setItem('userToken', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
