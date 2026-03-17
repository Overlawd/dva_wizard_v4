import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import type { User } from '../types/auth';
import type { LoginRequest } from '../types/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have a token and potentially validate it
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, you might call an endpoint like /api/auth/me here
      // For now, we'll just assume if we have a token, we are logged in
      // The user object would be fetched or stored in localStorage alongside token
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.login(credentials);
      api.setToken(response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  const logout = () => {
    api.clearToken();
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return { user, loading, login, logout };
}