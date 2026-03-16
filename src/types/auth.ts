export type UserRole = 'admin' | 'veteran' | 'advocate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  serviceNumber?: string; // For Veterans
}

export interface FlaggedResponse {
  id: string;
  query: string;
  response: string;
  flagReason: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'denied';
}

export interface QuestionnaireState {
  currentStep: number;
  answers: Record<string, string>;
  completed: boolean;
}