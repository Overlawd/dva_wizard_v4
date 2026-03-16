export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  title: string;
  source: string;
  relevance: number;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  gpu: number;
  vram: number;
}

export interface AppSettings {
  model: string;
  temperature: number;
  maxTokens: number;
}