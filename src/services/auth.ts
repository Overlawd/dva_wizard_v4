import { User } from '../types/user';

// Simulate network delay for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(800); // Fake network lag

  // Simple validation simulation
  if (!credentials.username || !credentials.password) {
    throw new Error('Username and password are required');
  }

  // Return mock successful response
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'user-123',
      name: 'Demo Veteran',
      role: 'veteran', // or 'admin', 'advocate'
      serviceNumber: 'VA-987654',
    },
  };
};

export const logout = async (): Promise<void> => {
  await delay(300);
  // Mock logout logic
  return;
};