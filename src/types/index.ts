export interface Source {
  id: string;
  title: string;
  url: string;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  type: 'legislation' | 'clik' | 'dva' | 'support' | 'community';
  trustScore: number;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: Source[];
  isStatement?: boolean;
}

export interface SystemStatus {
  gpuLoad: number;
  vramUsed: number;
  vramTotal: number;
  dbStatus: 'connected' | 'disconnected' | 'syncing';
  lastScrape: Date;
  totalIndexed: number;
  activeModel: string;
}

export interface ScrapingTask {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  target: string;
}

export type QueryType = 'statement' | 'question' | 'sql' | 'semantic';