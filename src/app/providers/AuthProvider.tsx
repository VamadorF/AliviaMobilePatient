import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { AuthUser } from '@/features/auth/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth().catch((error: unknown) => {
      console.error('Error en checkAuth:', error);
    });
  }, [checkAuth]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  }
  return context;
};
