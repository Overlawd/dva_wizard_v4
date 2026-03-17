import { env } from './env';
import type {
  LoginRequest,
  LoginResponse,
  ChatRequest,
  ChatResponse,
  CurationRequest,
  CurationResponse,
  ScrapeRequest,
  QuestionnaireRequest,
  QuestionnaireResponse,
} from '../types/api';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = env.API_URL;
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Chat
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Curation
  async curateResponse(
    responseId: string,
    data: CurationRequest
  ): Promise<CurationResponse> {
    return this.request<CurationResponse>(`/responses/${responseId}/curate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin Tools
  async scrapeUrl(data: ScrapeRequest): Promise<{ success: boolean; jobId: string }> {
    return this.request('/admin/scrape', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteQuery(queryId: string): Promise<{ success: boolean }> {
    return this.request(`/admin/queries/${queryId}`, {
      method: 'DELETE',
    });
  }

  // Veteran
  async submitQuestionnaire(data: QuestionnaireRequest): Promise<QuestionnaireResponse> {
    return this.request<QuestionnaireResponse>('/veteran/questionnaire/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();