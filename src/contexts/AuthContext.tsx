
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth service - in a real app, replace with actual API calls
const mockAuth = {
  // Simulate API delay
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock user storage
  users: JSON.parse(localStorage.getItem('users') || '[]') as Array<User & { password: string }>,
  
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  },

  // Save users to localStorage
  saveUsers: (users: Array<User & { password: string }>) => {
    localStorage.setItem('users', JSON.stringify(users));
  },

  // Login user
  login: async (email: string, password: string): Promise<User> => {
    await mockAuth.delay(1000); // Simulate API delay
    
    const user = mockAuth.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  // Register user
  signup: async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
    await mockAuth.delay(1000); // Simulate API delay
    
    // Check if user already exists
    if (mockAuth.users.some(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
      role,
      profileImage: undefined
    };
    
    mockAuth.users.push(newUser);
    mockAuth.saveUsers(mockAuth.users);
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('currentUser');
  },

  // Update user
  updateUser: (updatedUser: Partial<User>) => {
    const currentUser = mockAuth.getCurrentUser();
    if (!currentUser) return null;
    
    const updatedUserData = { ...currentUser, ...updatedUser };
    localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
    
    // Also update in the users array
    const userIndex = mockAuth.users.findIndex(u => u.id === currentUser.id);
    if (userIndex >= 0) {
      mockAuth.users[userIndex] = { ...mockAuth.users[userIndex], ...updatedUser };
      mockAuth.saveUsers(mockAuth.users);
    }
    
    return updatedUserData;
  }
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check if user is already logged in
    const user = mockAuth.getCurrentUser();
    setAuthState({
      user,
      isLoading: false,
      error: null
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await mockAuth.login(email, password);
      setAuthState({ user, isLoading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const user = await mockAuth.signup(email, password, name, role);
      setAuthState({ user, isLoading: false, error: null });
    } catch (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred'
      }));
      throw error;
    }
  };

  const logout = () => {
    mockAuth.logout();
    setAuthState({ user: null, isLoading: false, error: null });
  };

  const updateUser = (userData: Partial<User>) => {
    const updatedUser = mockAuth.updateUser(userData);
    if (updatedUser) {
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

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
