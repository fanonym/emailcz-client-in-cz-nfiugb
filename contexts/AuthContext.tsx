
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  email: string;
  name: string;
  authenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, sessionData: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'seznam_auth_data';
const USER_KEY = 'seznam_user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      if (Platform.OS === 'web') {
        // For web, use localStorage
        const authData = localStorage.getItem(AUTH_KEY);
        const userData = localStorage.getItem(USER_KEY);
        
        if (authData && userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        // For native, use SecureStore
        const authData = await SecureStore.getItemAsync(AUTH_KEY);
        const userData = await SecureStore.getItemAsync(USER_KEY);
        
        if (authData && userData) {
          setUser(JSON.parse(userData));
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, sessionData: any) => {
    try {
      const userData: User = {
        email,
        name: email.split('@')[0],
        authenticated: true,
      };

      if (Platform.OS === 'web') {
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionData));
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      } else {
        await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(sessionData));
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      }

      setUser(userData);
      console.log('User logged in successfully:', email);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
      } else {
        await SecureStore.deleteItemAsync(AUTH_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
      }

      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
