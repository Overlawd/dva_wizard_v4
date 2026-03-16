export interface SystemMetrics {
  gpu: number;
  gpuTemp: number;
  vram: number;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  ollamaActive: boolean;
  vramTotal: number;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

export interface ModelInfo {
  name: string;
  type: 'chat' | 'reasoning' | 'sql' | 'summarizer' | 'embedding';
  status: 'active' | 'idle' | 'loading';
}

export interface Source {
  id: string;
  title: string;
  url: string;
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  sourceType: 'legislation' | 'clik' | 'dva' | 'support' | 'community';
  snippet: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  sources?: Source[];
}

export interface CommonQuestion {
  id: string;
  category: string;
  question: string;
}

export type TaskBoundStatus = 
  | 'Normal'
  | 'GPU-Bound'
  | 'VRAM-Bound'
  | 'CPU-Bound'
  | 'Disk I/O-Bound'
  | 'Network-Bound';