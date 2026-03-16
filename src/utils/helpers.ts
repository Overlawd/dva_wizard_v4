import { SystemMetrics, TaskBoundStatus } from '../types';

export const getLoadColor = (value: number): string => {
  if (value <= 50) return 'text-green-600';
  if (value <= 70) return 'text-yellow-600';
  if (value <= 90) return 'text-orange-600';
  return 'text-red-600';
};

export const getLoadBgColor = (value: number): string => {
  if (value <= 50) return 'bg-green-500';
  if (value <= 70) return 'bg-yellow-500';
  if (value <= 90) return 'bg-orange-500';
  return 'bg-red-500';
};

export const determineTaskBound = (metrics: SystemMetrics): TaskBoundStatus => {
  if (metrics.ollamaActive && metrics.gpu >= 70) {
    return 'GPU-Bound';
  }
  if (metrics.vram >= 90) {
    return 'VRAM-Bound';
  }
  if (metrics.cpu >= 85 && metrics.gpu < 50) {
    return 'CPU-Bound';
  }
  if (metrics.disk >= 80 && metrics.cpu < 70) {
    return 'Disk I/O-Bound';
  }
  if (metrics.network >= 70 && metrics.gpu < 50 && metrics.cpu < 50) {
    return 'Network-Bound';
  }
  return 'Normal';
};

export const getSuggestedModel = (vramAvailable: number): string => {
  if (vramAvailable >= 10) return 'qwen2.5:14b';
  if (vramAvailable >= 6) return 'llama3.1:8b';
  if (vramAvailable >= 5.5) return 'qwen2.5:7b';
  if (vramAvailable >= 5) return 'codellama:7b';
  return 'llama3.1:8b (reduce embeddings)';
};

export const getSourceBadgeColor = (level: string): string => {
  switch (level) {
    case 'L1': return 'bg-red-100 text-red-700 border-red-200';
    case 'L2': return 'bg-green-100 text-green-700 border-green-200';
    case 'L3': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'L4': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'L5': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getSourceTypeColor = (type: string): string => {
  switch (type) {
    case 'legislation': return 'bg-red-500';
    case 'clik': return 'bg-green-500';
    case 'dva': return 'bg-blue-500';
    case 'support': return 'bg-purple-500';
    case 'community': return 'bg-orange-500';
    default: return 'bg-gray-500';
  }
};