// API Response and Request Types based on Backend Specification

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: 'admin' | 'veteran' | 'advocate';
    serviceNumber?: string;
  };
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  roleContext: 'veteran' | 'advocate' | 'admin';
}

export interface Source {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatResponse {
  id: string;
  content: string;
  sources: Source[];
  trustLevel: number;
  subtype: string;
}

export interface CurationRequest {
  action: 'accept' | 'deny';
  actorRole: 'admin' | 'veteran' | 'advocate';
}

export interface CurationResponse {
  success: boolean;
  newTrustLevel: number;
  message: string;
}

export interface ScrapeRequest {
  url: string;
}

export interface QuestionnaireRequest {
  answers: Record<string, any>;
}

export interface QuestionnaireResponse {
  id: string;
  status: 'in_progress' | 'completed';
  entitlementResult?: any;
}