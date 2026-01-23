import React, { createContext, useContext, useState, useEffect } from 'react';
import dataService from '../services/DataService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing authentication on app load
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (authToken && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Find user in the system
    const users = dataService.getUsers();
    const existingUser = users.find(user => user.email === userData.email);
    
    if (existingUser) {
      // Update last login time
      const updatedUser = {
        ...existingUser,
        lastLogin: new Date().toISOString()
      };
      
      // Update user in storage
      const updatedUsers = users.map(user => 
        user.id === existingUser.id ? updatedUser : user
      );
      dataService.saveUsers(updatedUsers);
      
      setCurrentUser(updatedUser);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } else {
      console.error('Login failed: User not found');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...currentUser, ...updatedUserData };
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    user: currentUser, // Add user alias for compatibility
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  // Show loading screen while checking authentication - simplified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
