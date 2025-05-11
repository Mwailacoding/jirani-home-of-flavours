import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData) => {
    // Ensure email is included in user data
    if (!userData.email) {
      throw new Error("Email is required for user authentication");
    }
    
    const completeUserData = {
      ...userData,
      // Add any additional user fields you need
    };
    
    setUser(completeUserData);
    localStorage.setItem('user', JSON.stringify(completeUserData));
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}