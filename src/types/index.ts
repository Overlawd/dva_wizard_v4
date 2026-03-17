export type UserRole = 'admin' | 'veteran' | 'advocate';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  serviceNumber?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  trustLevel?: number;
  curated?: 'accepted' | 'denied' | null;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet: string;
}

export interface QueryLog {
  id: string;
  user: string;
  query: string;
  response: string;
  timestamp: Date;
  status: 'active' | 'flagged';
}

export interface QuestionnaireData {
  serviceConnected: boolean;
  disabilityPercentage: number;
  dependents: number;
}