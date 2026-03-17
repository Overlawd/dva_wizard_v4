import { User, Message, QueryLog } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to handle fetch errors
const handleResponse = async (res: Response) => {
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
};

// Auth
export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
};

// Chat
export const sendMessage = async (content: string, userId: string) => {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: content, userId }),
  });
  return handleResponse(res);
};

// Admin
export const getQueries = async (): Promise<QueryLog[]> => {
  const res = await fetch(`${API_URL}/api/admin/queries`);
  const data = await handleResponse(res);
  // Map DB columns to interface if necessary
  return data.map((row: any) => ({
    id: row.id.toString(),
    user: row.user_id.toString(), // Simplified
    query: row.content,
    response: 'Response...', // Simplified for list view
    timestamp: new Date(row.timestamp),
    status: 'active',
  }));
};