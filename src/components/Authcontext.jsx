import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    admin: null,
    isLoading: true
  });

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const admin = localStorage.getItem('admin');
        const adminToken = localStorage.getItem('adminToken');
        
        if (user && token) {
          setAuthState({
            user: JSON.parse(user),
            admin: null,
            isLoading: false
          });
        } else if (admin && adminToken) {
          setAuthState({
            user: null,
            admin: JSON.parse(admin),
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            admin: null,
            isLoading: false
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuth();
        setAuthState({
          user: null,
          admin: null,
          isLoading: false
        });
      }
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
  };

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setAuthState({
      user: userData,
      admin: null,
      isLoading: false
    });
  };

  const adminLogin = (adminData, token) => {
    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', token);
    setAuthState({
      user: null,
      admin: adminData,
      isLoading: false
    });
  };
  
  const logout = () => {
    clearAuth();
    setAuthState({
      user: null,
      admin: null,
      isLoading: false
    });
  };

  const value = {
    ...authState,
    login,
    adminLogin,
    logout,
    isAuthenticated: !!authState.user || !!authState.admin,
    isUser: !!authState.user,
    isAdmin: !!authState.admin
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.isLoading && children}
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