import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    const rollNumber = localStorage.getItem('userRollNumber');

    if (isLoggedIn) {
      setUser({
        email: userEmail,
        role: userRole,
        rollNumber: rollNumber
      });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userData.role);
    if (userData.rollNumber) {
      localStorage.setItem('userRollNumber', userData.rollNumber);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userRollNumber');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
