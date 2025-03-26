
import React, { createContext, useContext } from 'react';
import { User, UserRole, AuthState, AuthContextType } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthActions } from '@/hooks/useAuthActions';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { authState, setAuthState } = useAuthSession();
  const { login, signup, logout, updateUser } = useAuthActions(authState, setAuthState);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
